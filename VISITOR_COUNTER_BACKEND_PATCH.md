# Optional: Separate Portfolio Visit Counter

The website currently uses the existing DesignLab Apps Script endpoint so the counter works immediately.
Because the deployed backend currently stores only one total, the number is shared with the main DesignLab website.

To separate the personal portfolio count, update the existing Apps Script backend so `recordVisit` and `getVisitCount` read the `site` query parameter.

## Replace the visitor portion of `doGet(e)`

```javascript
if (action === "recordVisit") {
  return jsonResponse({
    success: true,
    visits: recordVisit(e.parameter.site || "designlab")
  });
}

if (action === "getVisitCount") {
  return jsonResponse({
    success: true,
    visits: getVisitCount(e.parameter.site || "designlab")
  });
}
```

## Replace the visitor functions

```javascript
function getVisitorMetricRows(site) {
  return site === "jann-portfolio"
    ? { visits: 4, lastVisit: 5, label: "Jann Portfolio" }
    : { visits: 2, lastVisit: 3, label: "DesignLab" };
}

function getVisitorSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Site Analytics");

  if (!sheet) {
    sheet = ss.insertSheet("Site Analytics");
    sheet.getRange("A1").setValue("Metric");
    sheet.getRange("B1").setValue("Value");
  }

  if (!sheet.getRange("A2").getValue()) sheet.getRange("A2").setValue("DesignLab Total Visits");
  if (!sheet.getRange("B2").getValue()) sheet.getRange("B2").setValue(0);
  if (!sheet.getRange("A3").getValue()) sheet.getRange("A3").setValue("DesignLab Last Visit");
  if (!sheet.getRange("A4").getValue()) sheet.getRange("A4").setValue("Jann Portfolio Total Visits");
  if (!sheet.getRange("B4").getValue()) sheet.getRange("B4").setValue(0);
  if (!sheet.getRange("A5").getValue()) sheet.getRange("A5").setValue("Jann Portfolio Last Visit");

  return sheet;
}

function recordVisit(site) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getVisitorSheet();
    const rows = getVisitorMetricRows(site);
    const current = Number(sheet.getRange(rows.visits, 2).getValue()) || 0;
    const updated = current + 1;

    sheet.getRange(rows.visits, 2).setValue(updated);
    sheet.getRange(rows.lastVisit, 2).setValue(new Date());
    return updated;
  } finally {
    lock.releaseLock();
  }
}

function getVisitCount(site) {
  const sheet = getVisitorSheet();
  const rows = getVisitorMetricRows(site);
  return Number(sheet.getRange(rows.visits, 2).getValue()) || 0;
}
```

Redeploy the Apps Script web app after saving. The portfolio already sends `site=jann-portfolio`, so no website code changes are needed afterward.
