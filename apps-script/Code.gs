const CONFIG = {
  spreadsheetId: '1RcxQwDOstjvzx5JdqRJIsmZyChgrG1ccQJjP8wWnJWY',
  notificationEmail: 'info@vistamaterialsupply.com',
  sheetName: 'Quote Requests'
};

const HEADERS = [
  'Submission Time',
  'Company Name',
  'Contact Name',
  'Email',
  'Phone',
  'Material Requirements',
  'Attachment Link',
  'Status',
  'Notes'
];

function setup() {
  const sheet = getQuoteSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  MailApp.getRemainingDailyQuota();
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    if (!e || !e.parameter) {
      throw new Error('Missing form submission');
    }

    const p = e.parameter;
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('INTEGRATION_SECRET');
    if (!expectedSecret || p.integrationSecret !== expectedSecret) {
      console.warn('Rejected an unauthorized quote request.');
      return response({ ok: false, error: 'Unauthorized' });
    }

    const company = clean(p.companyName, 200);
    const contact = clean(p.contactName, 200);
    const email = clean(p.email, 250);
    const phone = clean(p.phone, 100);
    const details = clean(p.materialRequirements, 5000);
    const attachment = clean(p.attachmentLink, 1000);

    if (!phone && !isValidEmail(email)) {
      throw new Error('Email or phone is required');
    }

    const ss = SpreadsheetApp.openById(CONFIG.spreadsheetId);
    const sheet = getQuoteSheet(ss);
    const safe = value => /^[=+\-@\t\r]/.test(value) ? "'" + value : value;

    sheet.appendRow([
      new Date(),
      safe(company),
      safe(contact),
      safe(email),
      safe(phone),
      safe(details),
      safe(attachment),
      'New',
      ''
    ]);

    const row = sheet.getLastRow();
    const requester = company || contact || email || phone || 'Website Inquiry';
    const subject = 'New Quote Request - ' + requester;
    const body = [
      'New quote request received.',
      '',
      'Company: ' + (company || 'Not provided'),
      'Contact: ' + (contact || 'Not provided'),
      'Email: ' + (email || 'Not provided'),
      'Phone: ' + (phone || 'Not provided'),
      '',
      'Material Requirements:',
      details || 'Not provided',
      '',
      'Attachment Link: ' + (attachment || 'None'),
      '',
      'Google Sheets:',
      ss.getUrl()
    ].join('\n');

    try {
      MailApp.sendEmail({
        to: CONFIG.notificationEmail,
        subject,
        body
      });
    } catch (mailError) {
      console.error('Email notification failed: ' + mailError);
      sheet.getRange(row, 8).setValue('New - Email Failed');
      sheet.getRange(row, 9).setValue(clean(mailError && mailError.message, 500));
      return response({ ok: true, warning: 'The request was saved, but the notification email was delayed.' });
    }

    return response({ ok: true });
  } catch (error) {
    console.error(error);
    return response({ ok: false, error: 'Submission failed' });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getQuoteSheet(spreadsheet) {
  const ss = spreadsheet || SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    throw new Error('The Quote Requests worksheet does not exist.');
  }
  return sheet;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return response({
    status: 'ok',
    message: 'Vista Supply Quote API is running'
  });
}
