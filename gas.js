// ================================================================
// 経費逆算チェッカー → Google Sheets 連携スクリプト
// 使い方：
//   1. スプレッドシートのメニュー「拡張機能」→「Apps Script」を開く
//   2. このコードを全て貼り付けて保存（Ctrl+S）
//   3. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」
//   4. 実行者：自分 / アクセス権：全員（匿名ユーザーを含む）
//   5. 表示されたURLをアプリの設定欄に貼り付ける
// ================================================================

// -------- 担当者マスター（実際のメンバー名に書き換えてください） --------
const MEMBERS = [
  '池田',
  '田中',
  '鈴木',
  '山田',
  // ↑ ここを編集
];

// -------- シート設定（変更不要） --------
const TEMPLATE_NAME    = '【TEMP】会社名_案件名';
const TITLE_CELL       = 'B2';
const COST_START_ROW   = 14;   // 経費 行開始
const COST_ITEM_COL    = 4;    // D列 = 項目
const COST_MEMBER_COL  = 5;    // E列 = 担当者
const COST_PRICE_COL   = 6;    // F列 = 見積もり（税抜）
const QUOTE_START_ROW  = 14;   // 予算 行開始
const QUOTE_ITEM_COL   = 13;   // M列 = 項目
const QUOTE_PRICE_COL  = 14;   // N列 = 価格（税抜）

// ================================================================
function doGet(e) {
  const mode = (e.parameter || {}).mode || 'init';

  // ---- ドロップダウン一覧を返す ----
  if (mode === 'init') {
    const items = getItemsFromSheet();
    return makeJson({ status: 'ok', items: items, members: MEMBERS });
  }

  // ---- シート作成 ----
  if (mode === 'create') {
    try {
      const data = JSON.parse(decodeURIComponent(e.parameter.data));
      const result = createSheet(data);
      return makeJson(result);
    } catch (err) {
      return makeJson({ status: 'error', message: err.message });
    }
  }

  return makeJson({ status: 'error', message: 'unknown mode' });
}

// ================================================================
// D14 のデータ入力規則からプルダウン選択肢を取得
function getItemsFromSheet() {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(TEMPLATE_NAME);
    const rule  = sheet.getRange('D14').getDataValidation();
    if (!rule) return defaultItems();
    const vals  = rule.getCriteriaValues()[0].getValues();
    return vals.flat().filter(v => v !== '');
  } catch (e) {
    return defaultItems();
  }
}

function defaultItems() {
  return ['デザイン', 'コーディング・実装', '案件定義・ディレクション', '撮影', '動画制作', 'ライティング', 'その他'];
}

// ================================================================
function createSheet(data) {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const template = ss.getSheetByName(TEMPLATE_NAME);
  if (!template) throw new Error('テンプレートシートが見つかりません：' + TEMPLATE_NAME);

  const sheetName = data.company + '_' + data.project;

  // 同名シートがあれば削除
  const existing = ss.getSheetByName(sheetName);
  if (existing) ss.deleteSheet(existing);

  const sheet = template.copyTo(ss);
  sheet.setName(sheetName);

  // B2 にシート名を書き込む
  sheet.getRange(TITLE_CELL).setValue(sheetName);

  // 経費（外注費）書き込み
  (data.costs || []).forEach(function(row, i) {
    var r = COST_START_ROW + i;
    sheet.getRange(r, COST_ITEM_COL).setValue(row.item);
    sheet.getRange(r, COST_MEMBER_COL).setValue(row.member);
    sheet.getRange(r, COST_PRICE_COL).setValue(row.amount);
  });

  // 予算（見積額）書き込み
  (data.quotes || []).forEach(function(row, i) {
    var r = QUOTE_START_ROW + i;
    sheet.getRange(r, QUOTE_ITEM_COL).setValue(row.item);
    sheet.getRange(r, QUOTE_PRICE_COL).setValue(row.amount);
  });

  var url = 'https://docs.google.com/spreadsheets/d/'
            + ss.getId()
            + '/edit#gid='
            + sheet.getSheetId();

  return { status: 'ok', sheetName: sheetName, url: url };
}

// ================================================================
function makeJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
