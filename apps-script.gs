// ============================================================
//  Google Apps Script — Reuniões Semanais
//  Cola este código em script.google.com e faz deploy como
//  Web app (acesso: Anyone)
// ============================================================

const SHEET_NAME = 'Inscrições';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date().toLocaleString('pt-PT'),
      data.nome            || '',
      data.contacto        || '',
      data.turma           || '',
      data.escola          || '',
      data.disponibilidade || ''
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  if (e.parameter.action === 'get') {
    const sheet = getOrCreateSheet();
    const rows  = sheet.getDataRange().getValues();

    if (rows.length <= 1) return jsonResponse({ data: [] });

    const data = rows.slice(1).map(r => ({
      timestamp:       r[0],
      nome:            r[1],
      contacto:        r[2],
      turma:           r[3],
      escola:          r[4],
      disponibilidade: r[5]
    }));

    return jsonResponse({ data });
  }

  return jsonResponse({ ok: true, msg: 'Script a funcionar!' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Data', 'Nome', 'Contacto', 'Turma', 'Escola', 'Disponibilidade']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}
