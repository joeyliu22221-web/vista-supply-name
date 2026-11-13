import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';

const originalFetch = globalThis.fetch;

function createEnv(overrides = {}) {
  return {
    APPS_SCRIPT_URL: 'https://example.com/apps-script',
    APPS_SCRIPT_SECRET: 'integration-secret',
    ATTACHMENT_SIGNING_SECRET: 'attachment-secret',
    ASSETS: { fetch: () => new Response('asset') },
    QUOTE_ATTACHMENTS: {
      put: async () => {},
      get: async () => null,
      delete: async () => {}
    },
    ...overrides
  };
}

function quoteRequest(fields) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return new Request('https://vista.example/api/quote', { method: 'POST', body: form });
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('rejects a quote without email or phone', async () => {
  const response = await worker.fetch(quoteRequest({ materialRequirements: 'Strut channel' }), createEnv());
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Please leave an email or phone number so we can get back to you.'
  });
});

test('accepts an email-only quote and maps Apps Script fields', async () => {
  let submittedBody = '';
  globalThis.fetch = async (_url, options) => {
    submittedBody = String(options.body);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const response = await worker.fetch(quoteRequest({
    email: 'contractor@example.com',
    materialRequirements: 'Threaded rod'
  }), createEnv());

  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  const values = new URLSearchParams(submittedBody);
  assert.equal(values.get('integrationSecret'), 'integration-secret');
  assert.equal(values.get('email'), 'contractor@example.com');
  assert.equal(values.get('materialRequirements'), 'Threaded rod');
});

test('accepts a phone-only quote', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
  const response = await worker.fetch(quoteRequest({ phone: '(929) 555-0198' }), createEnv());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
});

test('stores an allowed attachment and forwards a protected link', async () => {
  let storedKey = '';
  let forwardedAttachment = '';
  globalThis.fetch = async (_url, options) => {
    forwardedAttachment = new URLSearchParams(String(options.body)).get('attachmentLink');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const env = createEnv({
    QUOTE_ATTACHMENTS: {
      put: async key => { storedKey = key; },
      get: async () => null,
      delete: async () => {}
    }
  });
  const file = new File(['test'], 'takeoff.pdf', { type: 'application/pdf' });
  const response = await worker.fetch(quoteRequest({ email: 'test@example.com', attachment: file }), env);

  assert.equal(response.status, 200);
  assert.match(storedKey, /quote-attachments\/.+-takeoff\.pdf$/);
  assert.match(forwardedAttachment, /^https:\/\/vista\.example\/api\/attachments\/.+\?token=.+$/);
});

test('rejects unsupported attachment types', async () => {
  const file = new File(['test'], 'malware.exe', { type: 'application/octet-stream' });
  const response = await worker.fetch(quoteRequest({ phone: '9295550198', attachment: file }), createEnv());
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Please attach a PDF, XLSX, or DWG file.');
});
