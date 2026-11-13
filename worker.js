const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_REQUEST_SIZE = 27 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['pdf', 'xlsx', 'dwg']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/quote' && request.method === 'POST') {
      return handleQuoteRequest(request, env, url);
    }

    if (url.pathname.startsWith('/api/attachments/') && request.method === 'GET') {
      return handleAttachmentDownload(request, env, url);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ ok: false, error: 'Not found' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleQuoteRequest(request, env, url) {
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    return jsonResponse({ ok: false, error: 'Request origin is not allowed' }, 403);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_REQUEST_SIZE) {
    return jsonResponse({ ok: false, error: 'The uploaded file is too large.' }, 413);
  }

  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_SECRET || !env.ATTACHMENT_SIGNING_SECRET) {
    console.error('Required Worker secrets are not configured.');
    return jsonResponse({ ok: false, error: 'The quote service is not configured yet.' }, 503);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ ok: false, error: 'The form submission could not be read.' }, 400);
  }

  if (clean(form.get('website'), 200)) {
    return jsonResponse({ ok: true });
  }

  const companyName = clean(form.get('companyName'), 200);
  const contactName = clean(form.get('contactName'), 200);
  const email = clean(form.get('email'), 250);
  const phone = clean(form.get('phone'), 100);
  const materialRequirements = clean(form.get('materialRequirements'), 5000);

  if (!phone && !EMAIL_PATTERN.test(email)) {
    return jsonResponse({
      ok: false,
      error: email
        ? 'Please enter a valid email address or leave a phone number.'
        : 'Please leave an email or phone number so we can get back to you.'
    }, 400);
  }

  const file = form.get('attachment');
  let attachmentKey = '';
  let attachmentLink = '';

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ ok: false, error: 'Please choose a file smaller than 25 MB.' }, 413);
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return jsonResponse({ ok: false, error: 'Please attach a PDF, XLSX, or DWG file.' }, 400);
    }

    if (!env.QUOTE_ATTACHMENTS) {
      return jsonResponse({ ok: false, error: 'Attachment storage is not configured yet.' }, 503);
    }

    attachmentKey = `quote-attachments/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
    await env.QUOTE_ATTACHMENTS.put(attachmentKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: { originalName: file.name }
    });

    const token = await createSignature(attachmentKey, env.ATTACHMENT_SIGNING_SECRET);
    attachmentLink = `${url.origin}/api/attachments/${encodeURIComponent(attachmentKey)}?token=${token}`;
  }

  const payload = new URLSearchParams({
    integrationSecret: env.APPS_SCRIPT_SECRET,
    companyName,
    contactName,
    email,
    phone,
    materialRequirements,
    attachmentLink
  });

  try {
    const appsScriptResponse = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload,
      redirect: 'follow'
    });

    const responseText = await appsScriptResponse.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(`Apps Script returned non-JSON (${appsScriptResponse.status}): ${responseText.slice(0, 200)}`);
    }
    if (!appsScriptResponse.ok || !result.ok) {
      throw new Error(result.error || `Apps Script returned ${appsScriptResponse.status}`);
    }

    return jsonResponse({ ok: true, warning: result.warning || '' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Quote submission failed: ${errorMessage}`);
    if (attachmentKey && env.QUOTE_ATTACHMENTS) {
      await env.QUOTE_ATTACHMENTS.delete(attachmentKey).catch(() => {});
    }
    return jsonResponse({ ok: false, error: 'We could not send your inquiry. Please try again.' }, 502);
  }
}

async function handleAttachmentDownload(request, env, url) {
  if (!env.QUOTE_ATTACHMENTS || !env.ATTACHMENT_SIGNING_SECRET) {
    return new Response('Not found', { status: 404 });
  }

  const encodedKey = url.pathname.slice('/api/attachments/'.length);
  let key;
  try {
    key = decodeURIComponent(encodedKey);
  } catch {
    return new Response('Invalid attachment link', { status: 400 });
  }

  const suppliedToken = url.searchParams.get('token') || '';
  const expectedToken = await createSignature(key, env.ATTACHMENT_SIGNING_SECRET);
  if (!constantTimeEqual(suppliedToken, expectedToken)) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.QUOTE_ATTACHMENTS.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('Content-Disposition', `attachment; filename="${safeDownloadName(object.customMetadata?.originalName || 'attachment')}"`);
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function getExtension(fileName) {
  const parts = String(fileName).toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function sanitizeFileName(fileName) {
  const sanitized = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-140);
  return sanitized || 'attachment';
}

function safeDownloadName(fileName) {
  return String(fileName).replace(/["\\\r\n]/g, '_').slice(0, 180) || 'attachment';
}

async function createSignature(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
