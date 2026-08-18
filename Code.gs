const SHEET_NAME = "Projects";
const ADMIN_PASSWORD = "CHANGE_THIS_PASSWORD";
const INQUIRY_SHEET_NAME = "Inquiries";
const INQUIRY_NOTIFICATION_EMAIL = "jannjaravata@gmail.com";
const PORTFOLIO_BASE_URL = "https://jndesignlab-cloud.github.io/jnbj-designlabcreativestudio";
const INQUIRY_TRACKING_PAGE = PORTFOLIO_BASE_URL + "/inquiry-status.html";

const HEADERS = [
  "Created At",
  "ID",
  "Title",
  "Category",
  "Filter Category",
  "Featured",
  "Image URL",
  "Gallery Image URLs",
  "Skills / Services Used",
  "Description",
  "Problem / Goal",
  "What I Did",
  "Result / Outcome",
  "Project Link",
  "Status"
];

function doGet(e) {
  const action = e.parameter.action;

  if (action === "listProjects") {
    return jsonResponse({
      success: true,
      projects: getProjects()
    });
  }

  if (action === "recordVisit") {
    return jsonResponse({
      success: true,
      visits: recordVisit()
    });
  }

  if (action === "getVisitCount") {
    return jsonResponse({
      success: true,
      visits: getVisitCount()
    });
  }

  return jsonResponse({
    success: false,
    message: "Invalid action."
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (data.action === "submitInquiry") {
      return handleInquirySubmission(data);
    }

    if (data.action === "trackInquiry") {
      return handleInquiryTracking(data);
    }

    if (data.action === "getAdminDashboard") {
      if (data.password !== ADMIN_PASSWORD) {
        return jsonResponse({
          success: false,
          message: "Incorrect admin password."
        });
      }

      return jsonResponse({
        success: true,
        dashboard: getAdminDashboardData()
      });
    }

    if (data.action === "addProject") {
      if (data.password !== ADMIN_PASSWORD) {
        return jsonResponse({
          success: false,
          message: "Incorrect admin password."
        });
      }

      const sheet = getProjectSheet();
      const title = data.title || "";
      const id = createProjectId(title);

      sheet.appendRow([
        new Date(),
        id,
        title,
        data.category || "",
        data.filterCategory || "",
        data.featured || "FALSE",
        data.image || "",
        data.galleryImages || "",
        data.skills || "",
        data.description || "",
        data.problem || "",
        data.solution || "",
        data.outcome || "",
        data.link || "",
        "Published"
      ]);

      return jsonResponse({
        success: true,
        message: "Project added.",
        id: id
      });
    }

    return jsonResponse({
      success: false,
      message: "Invalid action."
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


const INQUIRY_STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Awaiting Details",
  "Quotation Sent",
  "Proposal Sent",
  "For Approval",
  "Approved",
  "Scheduled",
  "In Progress",
  "Ongoing",
  "Production",
  "Completed",
  "Delivered",
  "Closed"
];

const INQUIRY_HEADERS = [
  "Created At",
  "Inquiry ID",
  "First Name",
  "Last Name",
  "Email",
  "Contact Number",
  "Company / Brand",
  "Service Interest",
  "Package / Project",
  "Budget Range",
  "Preferred Timeline",
  "Preferred Contact Method",
  "Message",
  "Referral Source",
  "CTA Source",
  "Source Page",
  "Selected Theme",
  "Status",
  "Follow-up Notes",
  "Notification Status",
  "Notification Error",
  "Client Confirmation Status",
  "Client Confirmation Error",
  "Tracking URL"
];

function handleInquirySubmission(data) {
  // Honeypot field: legitimate visitors leave this blank.
  if (String(data.website || "").trim()) {
    return jsonResponse({ success: true, inquiryId: "Received" });
  }

  const requiredFields = [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["email", "Email address"],
    ["contactNumber", "Contact number"],
    ["service", "Service interest"],
    ["budget", "Budget range"],
    ["timeline", "Preferred timeline"],
    ["preferredContact", "Preferred contact method"],
    ["message", "Project message"],
    ["consent", "Consent"]
  ];

  requiredFields.forEach(function(field) {
    if (!String(data[field[0]] || "").trim()) {
      throw new Error(field[1] + " is required.");
    }
  });

  const email = String(data.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  const message = String(data.message || "").trim();
  if (message.length < 20) {
    throw new Error("Please provide a little more information about the project.");
  }

  const inquiryId = createInquiryId();
  const trackingUrl = createInquiryTrackingUrl(inquiryId);
  const sheet = getInquirySheet();

  sheet.appendRow([
    new Date(),
    inquiryId,
    cleanInquiryValue(data.firstName, 80),
    cleanInquiryValue(data.lastName, 80),
    cleanInquiryValue(email, 160),
    cleanInquiryValue(data.contactNumber, 40),
    cleanInquiryValue(data.company, 140),
    cleanInquiryValue(data.service, 140),
    cleanInquiryValue(data.package, 180),
    cleanInquiryValue(data.budget, 80),
    cleanInquiryValue(data.timeline, 100),
    cleanInquiryValue(data.preferredContact, 80),
    cleanInquiryValue(message, 3000),
    cleanInquiryValue(data.referralSource, 100),
    cleanInquiryValue(data.source, 160),
    cleanInquiryValue(data.sourcePage, 500),
    cleanInquiryValue(data.theme, 30),
    "New",
    "",
    "Pending",
    "",
    "Pending",
    "",
    trackingUrl
  ]);

  const inquiryRow = sheet.getLastRow();
  const delivery = sendInquiryEmails(data, inquiryId, trackingUrl);
  updateInquiryEmailStatuses(sheet, inquiryRow, delivery);

  return jsonResponse({
    success: true,
    message: "Inquiry received.",
    inquiryId: inquiryId,
    trackingUrl: trackingUrl,
    notificationSent: delivery.admin.sent,
    notificationError: delivery.admin.error || "",
    clientConfirmationSent: delivery.client.sent,
    clientConfirmationError: delivery.client.error || ""
  });
}

function handleInquiryTracking(data) {
  const inquiryId = cleanInquiryValue(data.inquiryId, 40).toUpperCase();
  const email = cleanInquiryValue(data.email, 160).toLowerCase();

  if (!inquiryId || !email) {
    throw new Error("Enter both your inquiry reference and email address.");
  }

  if (!/^INQ-\d{8}-[A-Z0-9]{6}$/.test(inquiryId)) {
    throw new Error("The inquiry reference format is not valid.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  const sheet = getInquirySheet();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    throw new Error("No matching inquiry was found.");
  }

  const headers = values[0];
  const idIndex = headers.indexOf("Inquiry ID");
  const emailIndex = headers.indexOf("Email");
  const row = values.slice(1).find(function(item) {
    return String(item[idIndex] || "").trim().toUpperCase() === inquiryId &&
      String(item[emailIndex] || "").trim().toLowerCase() === email;
  });

  if (!row) {
    throw new Error("No inquiry matched that reference and email address.");
  }

  const status = getInquiryCell(row, headers, "Status") || "New";
  const createdAt = getInquiryCell(row, headers, "Created At");
  const firstName = getInquiryCell(row, headers, "First Name");
  const lastName = getInquiryCell(row, headers, "Last Name");

  return jsonResponse({
    success: true,
    inquiry: {
      inquiryId: inquiryId,
      createdAt: formatInquiryDate(createdAt),
      name: [firstName, lastName].filter(Boolean).join(" "),
      service: getInquiryCell(row, headers, "Service Interest"),
      package: getInquiryCell(row, headers, "Package / Project"),
      budget: getInquiryCell(row, headers, "Budget Range"),
      timeline: getInquiryCell(row, headers, "Preferred Timeline"),
      preferredContact: getInquiryCell(row, headers, "Preferred Contact Method"),
      message: getInquiryCell(row, headers, "Message"),
      status: status,
      statusStage: getInquiryStatusStage(status),
      statusMessage: getInquiryStatusMessage(status)
    }
  });
}

function getInquirySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(INQUIRY_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(INQUIRY_SHEET_NAME);
  }

  ensureInquiryHeaders(sheet);
  ensureInquiryStatusValidation(sheet);
  sheet.setFrozenRows(1);
  return sheet;
}

function ensureInquiryHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, INQUIRY_HEADERS.length).setValues([INQUIRY_HEADERS]);
    return;
  }

  const currentLastColumn = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, currentLastColumn).getValues()[0];

  INQUIRY_HEADERS.forEach(function(header) {
    if (currentHeaders.indexOf(header) === -1) {
      const nextColumn = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextColumn).setValue(header);
      currentHeaders.push(header);
    }
  });
}


function ensureInquiryStatusValidation(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusColumn = headers.indexOf("Status") + 1;
  if (statusColumn < 1) return;

  const target = sheet.getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1);
  const firstRule = sheet.getRange(2, statusColumn).getDataValidation();
  if (firstRule) return;

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(INQUIRY_STATUS_OPTIONS, true)
    .setAllowInvalid(true)
    .setHelpText("Choose a status used by the public inquiry tracker.")
    .build();
  target.setDataValidation(rule);
}

function createInquiryId() {
  const datePart = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const randomPart = Utilities.getUuid().slice(0, 6).toUpperCase();
  return "INQ-" + datePart + "-" + randomPart;
}

function createInquiryTrackingUrl(inquiryId) {
  return INQUIRY_TRACKING_PAGE + "?id=" + encodeURIComponent(inquiryId);
}

function cleanInquiryValue(value, maxLength) {
  const text = String(value || "").trim();
  return text.slice(0, maxLength || 5000);
}

function sendInquiryEmails(data, inquiryId, trackingUrl) {
  let quota = 0;
  try {
    quota = MailApp.getRemainingDailyQuota();
  } catch (error) {
    const message = getEmailErrorMessage(error, "Email quota check");
    return {
      client: emailFailure(message),
      admin: emailFailure(message)
    };
  }

  const client = quota >= 1
    ? sendClientInquiryConfirmation(data, inquiryId, trackingUrl)
    : emailFailure("The Apps Script daily email quota has been reached.");

  const quotaAfterClient = client.sent ? quota - 1 : quota;
  const admin = quotaAfterClient >= 1
    ? sendAdminInquiryNotification(data, inquiryId, trackingUrl)
    : emailFailure("The Apps Script daily email quota has been reached after sending the client confirmation.");

  return { client: client, admin: admin };
}

function sendAdminInquiryNotification(data, inquiryId, trackingUrl) {
  try {
    const fullName = getInquiryFullName(data);
    const senderEmail = cleanInquiryValue(data.email, 160);
    const subject = "New DesignLab Inquiry · " + cleanInquiryValue(data.service, 100) + " · " + inquiryId;
    const plainBody = buildAdminInquiryPlainText(data, inquiryId, trackingUrl, fullName);
    const htmlBody = buildAdminInquiryEmailHtml(data, inquiryId, trackingUrl, fullName);

    MailApp.sendEmail({
      to: INQUIRY_NOTIFICATION_EMAIL,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      replyTo: senderEmail,
      name: "DesignLab Inquiry System"
    });

    return emailSuccess();
  } catch (error) {
    return emailFailure(getEmailErrorMessage(error, "Admin notification"));
  }
}

function sendClientInquiryConfirmation(data, inquiryId, trackingUrl) {
  try {
    const fullName = getInquiryFullName(data);
    const recipientEmail = cleanInquiryValue(data.email, 160);
    const subject = "We received your DesignLab inquiry · " + inquiryId;
    const plainBody = buildClientInquiryPlainText(data, inquiryId, trackingUrl, fullName);
    const htmlBody = buildClientInquiryEmailHtml(data, inquiryId, trackingUrl, fullName);

    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      replyTo: INQUIRY_NOTIFICATION_EMAIL,
      name: "DesignLab Inquiry System"
    });

    return emailSuccess();
  } catch (error) {
    return emailFailure(getEmailErrorMessage(error, "Client confirmation"));
  }
}

function getInquiryFullName(data) {
  return (cleanInquiryValue(data.firstName, 80) + " " + cleanInquiryValue(data.lastName, 80)).trim();
}

function buildAdminInquiryPlainText(data, inquiryId, trackingUrl, fullName) {
  return [
    "NEW DESIGNLAB PROJECT INQUIRY",
    "",
    "Reference: " + inquiryId,
    "Status: New",
    "Tracking: " + trackingUrl,
    "",
    "CLIENT",
    "Name: " + fullName,
    "Email: " + cleanInquiryValue(data.email, 160),
    "Contact number: " + cleanInquiryValue(data.contactNumber, 40),
    "Company / Brand: " + cleanInquiryValue(data.company, 140),
    "Preferred contact: " + cleanInquiryValue(data.preferredContact, 80),
    "",
    "PROJECT",
    "Service: " + cleanInquiryValue(data.service, 140),
    "Package / Project: " + cleanInquiryValue(data.package, 180),
    "Budget: " + cleanInquiryValue(data.budget, 80),
    "Timeline: " + cleanInquiryValue(data.timeline, 100),
    "Referral source: " + cleanInquiryValue(data.referralSource, 100),
    "",
    "PROJECT MESSAGE",
    cleanInquiryValue(data.message, 3000),
    "",
    "Reply directly to this email to contact the sender."
  ].join("\n");
}

function buildClientInquiryPlainText(data, inquiryId, trackingUrl, fullName) {
  return [
    "Hello " + (cleanInquiryValue(data.firstName, 80) || fullName) + ",",
    "",
    "Thank you for contacting DesignLab Creative Studio. Your project inquiry has been received and saved successfully.",
    "",
    "Tracking reference: " + inquiryId,
    "Current status: New",
    "Track your inquiry: " + trackingUrl,
    "",
    "REQUEST SUMMARY",
    "Service: " + cleanInquiryValue(data.service, 140),
    "Package / Project: " + cleanInquiryValue(data.package, 180),
    "Budget: " + cleanInquiryValue(data.budget, 80),
    "Timeline: " + cleanInquiryValue(data.timeline, 100),
    "Preferred contact: " + cleanInquiryValue(data.preferredContact, 80),
    "",
    "PROJECT MESSAGE",
    cleanInquiryValue(data.message, 3000),
    "",
    "WHAT HAPPENS NEXT",
    "1. Your inquiry will be reviewed.",
    "2. You may be contacted if more information is needed.",
    "3. The next response may include scope, availability, recommendations, or a quotation.",
    "",
    "Please keep your tracking reference for future follow-ups.",
    "",
    "DesignLab Creative Studio",
    "Independent creative practice of Jann Nathaniel Jaravata"
  ].join("\n");
}

function buildAdminInquiryEmailHtml(data, inquiryId, trackingUrl, fullName) {
  const clientRows = [
    ["Name", fullName],
    ["Email", cleanInquiryValue(data.email, 160)],
    ["Contact number", cleanInquiryValue(data.contactNumber, 40)],
    ["Company / Brand", cleanInquiryValue(data.company, 140)],
    ["Preferred contact", cleanInquiryValue(data.preferredContact, 80)]
  ];
  const projectRows = [
    ["Service", cleanInquiryValue(data.service, 140)],
    ["Package / Project", cleanInquiryValue(data.package, 180)],
    ["Budget", cleanInquiryValue(data.budget, 80)],
    ["Timeline", cleanInquiryValue(data.timeline, 100)],
    ["Referral source", cleanInquiryValue(data.referralSource, 100)],
    ["CTA source", cleanInquiryValue(data.source, 160)]
  ];
  const replyUrl = "mailto:" + encodeURIComponent(cleanInquiryValue(data.email, 160)) +
    "?subject=" + encodeURIComponent("Re: DesignLab inquiry " + inquiryId);
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  return buildSystemEmailShell({
    preheader: "New DesignLab project inquiry " + inquiryId,
    eyebrow: "New project inquiry",
    title: "A new client brief has arrived.",
    intro: "Review the request below, update its status in the Inquiries sheet, and reply directly when ready.",
    status: "New",
    inquiryId: inquiryId,
    trackingUrl: trackingUrl,
    content: buildEmailSection("Client information", clientRows) +
      buildEmailSection("Project scope", projectRows) +
      buildEmailMessageSection("Project message", cleanInquiryValue(data.message, 3000)) +
      buildEmailButtonRow([
        ["Reply to client", replyUrl, true],
        ["Open inquiry sheet", sheetUrl, false]
      ]),
    footer: "This notification was generated automatically by the DesignLab Portfolio Inquiry System."
  });
}

function buildClientInquiryEmailHtml(data, inquiryId, trackingUrl, fullName) {
  const summaryRows = [
    ["Service", cleanInquiryValue(data.service, 140)],
    ["Package / Project", cleanInquiryValue(data.package, 180)],
    ["Budget", cleanInquiryValue(data.budget, 80)],
    ["Timeline", cleanInquiryValue(data.timeline, 100)],
    ["Preferred contact", cleanInquiryValue(data.preferredContact, 80)]
  ];
  const firstName = cleanInquiryValue(data.firstName, 80) || fullName;
  const nextSteps = '<div style="margin:22px 0 0;padding:20px;border-radius:16px;background:#f4f7ff;border:1px solid #dce6ff;">' +
    '<div style="font-size:12px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#2d63d7;margin-bottom:12px;">What happens next</div>' +
    '<div style="display:flex;margin-bottom:12px;"><div style="width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#2d63d7;color:#fff;font-size:12px;font-weight:800;margin-right:10px;">1</div><div style="font-size:14px;color:#26344d;line-height:1.55;"><strong>Your inquiry is reviewed.</strong><br><span style="color:#66738a;">The project scope, timeline, and requirements will be checked.</span></div></div>' +
    '<div style="display:flex;margin-bottom:12px;"><div style="width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#2d63d7;color:#fff;font-size:12px;font-weight:800;margin-right:10px;">2</div><div style="font-size:14px;color:#26344d;line-height:1.55;"><strong>Questions may follow.</strong><br><span style="color:#66738a;">You may be contacted if clarification or additional files are needed.</span></div></div>' +
    '<div style="display:flex;"><div style="width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#2d63d7;color:#fff;font-size:12px;font-weight:800;margin-right:10px;">3</div><div style="font-size:14px;color:#26344d;line-height:1.55;"><strong>You receive the next action.</strong><br><span style="color:#66738a;">The response may include recommendations, availability, scope, or a quotation.</span></div></div>' +
  '</div>';

  return buildSystemEmailShell({
    preheader: "Your DesignLab inquiry has been received — " + inquiryId,
    eyebrow: "Inquiry received",
    title: "Thank you, " + escapeHtmlForEmail(firstName) + ".",
    intro: "Your project inquiry has been saved successfully. A copy of the details you submitted is included below for your records.",
    status: "New",
    inquiryId: inquiryId,
    trackingUrl: trackingUrl,
    content: buildEmailSection("Request summary", summaryRows) +
      buildEmailMessageSection("Your project message", cleanInquiryValue(data.message, 3000)) +
      nextSteps +
      buildEmailButtonRow([["Track your inquiry", trackingUrl, true]]) +
      '<p style="margin:18px 0 0;font-size:13px;line-height:1.65;color:#66738a;">Keep your reference number private and use the same email address you submitted when checking your status.</p>',
    footer: "DesignLab Creative Studio · Independent creative practice of Jann Nathaniel Jaravata"
  });
}

function buildSystemEmailShell(options) {
  return '<!doctype html><html><body style="margin:0;padding:0;background:#eef2f8;">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + escapeHtmlForEmail(options.preheader || "") + '</div>' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2f8;padding:28px 12px;"><tr><td align="center">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(26,45,84,.10);">' +
        '<tr><td style="padding:26px 28px;background:linear-gradient(135deg,#245ad1 0%,#376fe4 58%,#7357d9 100%);color:#ffffff;">' +
          '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>' +
            '<td><div style="font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;opacity:.82;">DesignLab Creative Studio</div><div style="margin-top:7px;font-size:20px;font-weight:800;">Inquiry System</div></td>' +
            '<td align="right"><div style="display:inline-block;width:44px;height:44px;line-height:44px;text-align:center;border-radius:14px;background:rgba(255,255,255,.16);font-size:14px;font-weight:900;letter-spacing:.04em;">DL</div></td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td style="padding:30px 28px 10px;font-family:Arial,Helvetica,sans-serif;color:#172033;">' +
          '<div style="font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#2d63d7;">' + escapeHtmlForEmail(options.eyebrow || "") + '</div>' +
          '<h1 style="margin:9px 0 12px;font-size:28px;line-height:1.18;color:#172033;">' + (options.title || "") + '</h1>' +
          '<p style="margin:0;font-size:15px;line-height:1.7;color:#66738a;">' + escapeHtmlForEmail(options.intro || "") + '</p>' +
          '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;background:#f7f9fd;border:1px solid #e2e8f3;border-radius:16px;"><tr>' +
            '<td style="padding:16px 18px;"><div style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#7a879c;">Tracking reference</div><div style="margin-top:6px;font-size:18px;font-weight:900;color:#172033;letter-spacing:.02em;">' + escapeHtmlForEmail(options.inquiryId || "") + '</div></td>' +
            '<td align="right" style="padding:16px 18px;"><span style="display:inline-block;padding:7px 11px;border-radius:999px;background:#e9f0ff;color:#2d63d7;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;">' + escapeHtmlForEmail(options.status || "New") + '</span></td>' +
          '</tr></table>' +
          (options.content || "") +
        '</td></tr>' +
        '<tr><td style="padding:20px 28px 26px;font-family:Arial,Helvetica,sans-serif;">' +
          '<div style="height:1px;background:#e5eaf2;margin-bottom:18px;"></div>' +
          '<p style="margin:0;font-size:12px;line-height:1.65;color:#7a879c;">' + escapeHtmlForEmail(options.footer || "") + '</p>' +
          '<p style="margin:8px 0 0;font-size:11px;color:#9aa5b7;">Reference: ' + escapeHtmlForEmail(options.inquiryId || "") + '</p>' +
        '</td></tr>' +
      '</table>' +
    '</td></tr></table>' +
  '</body></html>';
}

function buildEmailSection(title, rows) {
  const tableRows = rows.map(function(row) {
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #edf0f5;width:38%;font-size:12px;font-weight:800;color:#7a879c;vertical-align:top;">' +
      escapeHtmlForEmail(row[0]) +
      '</td><td style="padding:10px 0;border-bottom:1px solid #edf0f5;font-size:14px;font-weight:600;color:#26344d;vertical-align:top;overflow-wrap:anywhere;">' +
      escapeHtmlForEmail(row[1] || "—") +
      '</td></tr>';
  }).join("");

  return '<div style="margin-top:24px;"><div style="font-size:12px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#2d63d7;margin-bottom:8px;">' +
    escapeHtmlForEmail(title) +
    '</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">' + tableRows + '</table></div>';
}

function buildEmailMessageSection(title, message) {
  return '<div style="margin-top:24px;"><div style="font-size:12px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#2d63d7;margin-bottom:10px;">' +
    escapeHtmlForEmail(title) +
    '</div><div style="padding:18px;border-radius:14px;background:#f7f9fd;border:1px solid #e5eaf2;white-space:pre-wrap;font-size:14px;line-height:1.7;color:#34415a;">' +
    escapeHtmlForEmail(message || "—") + '</div></div>';
}

function buildEmailButtonRow(buttons) {
  const buttonHtml = buttons.map(function(button) {
    const primary = button[2];
    const bg = primary ? "#2d63d7" : "#ffffff";
    const color = primary ? "#ffffff" : "#2d63d7";
    const border = primary ? "#2d63d7" : "#cfd9ec";
    return '<a href="' + escapeHtmlForEmail(button[1]) + '" style="display:inline-block;margin:10px 8px 0 0;padding:12px 17px;border-radius:10px;background:' + bg + ';border:1px solid ' + border + ';color:' + color + ';font-size:13px;font-weight:800;text-decoration:none;">' + escapeHtmlForEmail(button[0]) + '</a>';
  }).join("");
  return '<div style="margin-top:20px;">' + buttonHtml + '</div>';
}

function emailSuccess() {
  return { sent: true, error: "" };
}

function emailFailure(message) {
  return { sent: false, error: message || "Unknown email error." };
}

function getEmailErrorMessage(error, label) {
  const message = error && error.message ? error.message : String(error);
  console.error(label + " email failed: " + message);
  Logger.log(label + " email failed: " + message);
  return message;
}

function escapeHtmlForEmail(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateInquiryEmailStatuses(sheet, rowNumber, delivery) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  setInquiryStatusCell(sheet, rowNumber, headers, "Notification Status", delivery.admin.sent ? "Sent" : "Failed");
  setInquiryStatusCell(sheet, rowNumber, headers, "Notification Error", delivery.admin.error || "");
  setInquiryStatusCell(sheet, rowNumber, headers, "Client Confirmation Status", delivery.client.sent ? "Sent" : "Failed");
  setInquiryStatusCell(sheet, rowNumber, headers, "Client Confirmation Error", delivery.client.error || "");
}

function setInquiryStatusCell(sheet, rowNumber, headers, headerName, value) {
  const column = headers.indexOf(headerName) + 1;
  if (column > 0) sheet.getRange(rowNumber, column).setValue(value);
}

function getInquiryCell(row, headers, headerName) {
  const index = headers.indexOf(headerName);
  if (index < 0) return "";
  const value = row[index];
  if (value instanceof Date) return value;
  return String(value || "").trim();
}

function formatInquiryDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "MMMM d, yyyy · h:mm a");
}

function getInquiryStatusStage(status) {
  const value = String(status || "").trim().toLowerCase();
  if (["completed", "closed", "delivered"].indexOf(value) !== -1) return 5;
  if (["approved", "scheduled", "in progress", "ongoing", "production"].indexOf(value) !== -1) return 4;
  if (["awaiting details", "awaiting client", "quotation sent", "proposal sent", "for approval"].indexOf(value) !== -1) return 3;
  if (["under review", "reviewing", "qualified"].indexOf(value) !== -1) return 2;
  return 1;
}

function getInquiryStatusMessage(status) {
  const stage = getInquiryStatusStage(status);
  if (stage === 5) return "This inquiry has reached its final recorded stage.";
  if (stage === 4) return "The inquiry has moved into an approved, scheduled, or active work stage.";
  if (stage === 3) return "The next step may require details, approval, or a quotation response.";
  if (stage === 2) return "The inquiry is currently being reviewed for scope, availability, and next steps.";
  return "The inquiry was received successfully and is waiting for its initial review.";
}

/**
 * Run this function once from the Apps Script editor if email permissions have not been authorized.
 */
function authorizeInquiryEmail() {
  const quota = MailApp.getRemainingDailyQuota();
  MailApp.sendEmail({
    to: INQUIRY_NOTIFICATION_EMAIL,
    subject: "DesignLab Inquiry Email Test",
    body: "The DesignLab portfolio inquiry email system is connected successfully. Remaining daily recipient quota before this test: " + quota,
    name: "DesignLab Inquiry System"
  });
  return "Test email sent to " + INQUIRY_NOTIFICATION_EMAIL + ". Remaining daily recipient quota before sending: " + quota;
}

function testInquiryEmailSystem() {
  const sample = {
    firstName: "Jann",
    lastName: "Jaravata",
    email: INQUIRY_NOTIFICATION_EMAIL,
    contactNumber: "+63 900 000 0000",
    company: "DesignLab Creative Studio",
    service: "Website / Digital System",
    package: "Inquiry System Test",
    budget: "Test only",
    timeline: "Flexible",
    preferredContact: "Email",
    referralSource: "System test",
    source: "Apps Script editor",
    message: "This is a test of the redesigned admin and client confirmation email templates."
  };
  const inquiryId = createInquiryId();
  return sendInquiryEmails(sample, inquiryId, createInquiryTrackingUrl(inquiryId));
}

function testInquiryEmail() {
  return authorizeInquiryEmail();
}


function getAdminDashboardData() {
  const projects = getProjectDashboardStats();
  const inquiries = getInquiryDashboardStats();

  return {
    generatedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMM d, yyyy h:mm a"),
    projects: projects,
    inquiries: inquiries,
    visits: getVisitCount()
  };
}

function getProjectDashboardStats() {
  const sheet = getProjectSheet();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return { total: 0, published: 0, featured: 0 };
  }

  const headers = values[0];
  const rows = values.slice(1).filter(function(row) {
    return String(getCell(row, headers, "Title") || "").trim();
  });

  return {
    total: rows.length,
    published: rows.filter(function(row) {
      return String(getCell(row, headers, "Status") || "").trim().toLowerCase() === "published";
    }).length,
    featured: rows.filter(function(row) {
      const value = String(getCell(row, headers, "Featured") || "").trim().toLowerCase();
      return value === "true" || value === "yes" || value === "1";
    }).length
  };
}

function getInquiryDashboardStats() {
  const sheet = getInquirySheet();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return { total: 0, open: 0, new: 0, today: 0, completed: 0, byStatus: {}, recent: [] };
  }

  const headers = values[0];
  const rows = values.slice(1).filter(function(row) {
    return String(getCell(row, headers, "Inquiry ID") || "").trim();
  });
  const closedStatuses = ["completed", "delivered", "closed"];
  const todayKey = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const byStatus = {};

  rows.forEach(function(row) {
    const status = String(getCell(row, headers, "Status") || "New").trim() || "New";
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  const recent = rows.slice(-6).reverse().map(function(row) {
    const createdAt = getCell(row, headers, "Created At");
    return {
      inquiryId: getCell(row, headers, "Inquiry ID"),
      name: [getCell(row, headers, "First Name"), getCell(row, headers, "Last Name")].filter(Boolean).join(" "),
      service: getCell(row, headers, "Service Interest") || getCell(row, headers, "Package / Project"),
      status: getCell(row, headers, "Status") || "New",
      createdAt: formatInquiryDate(createdAt)
    };
  });

  return {
    total: rows.length,
    open: rows.filter(function(row) {
      const status = String(getCell(row, headers, "Status") || "New").trim().toLowerCase();
      return closedStatuses.indexOf(status) === -1;
    }).length,
    new: rows.filter(function(row) {
      return String(getCell(row, headers, "Status") || "New").trim().toLowerCase() === "new";
    }).length,
    today: rows.filter(function(row) {
      const createdAt = getCell(row, headers, "Created At");
      if (!createdAt) return false;
      return Utilities.formatDate(new Date(createdAt), Session.getScriptTimeZone(), "yyyy-MM-dd") === todayKey;
    }).length,
    completed: rows.filter(function(row) {
      const status = String(getCell(row, headers, "Status") || "").trim().toLowerCase();
      return closedStatuses.indexOf(status) >= 0;
    }).length,
    byStatus: byStatus,
    recent: recent
  };
}

function getProjects() {
  const sheet = getProjectSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const header = values[0];
  const rows = values.slice(1);

  return rows
    .filter(row => getCell(row, header, "Status") === "Published")
    .map(row => {
      const title = getCell(row, header, "Title");
      const image = convertDriveUrl(getCell(row, header, "Image URL"));
      const galleryRaw = getCell(row, header, "Gallery Image URLs");

      return {
        createdAt: getCell(row, header, "Created At"),
        id: getCell(row, header, "ID") || createProjectId(title),
        title: title,
        category: getCell(row, header, "Category"),
        filterCategory: getCell(row, header, "Filter Category"),
        featured: getCell(row, header, "Featured"),
        image: image,
        galleryImages: parseGalleryImages(galleryRaw, image),
        skills: getCell(row, header, "Skills / Services Used"),
        description: getCell(row, header, "Description"),
        problem: getCell(row, header, "Problem / Goal"),
        solution: getCell(row, header, "What I Did"),
        outcome: getCell(row, header, "Result / Outcome"),
        link: getCell(row, header, "Project Link")
      };
    })
    .reverse();
}

function getProjectSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    return sheet;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  if (existingHeaders.indexOf("ID") === -1 || existingHeaders.indexOf("Filter Category") === -1 || existingHeaders.indexOf("Featured") === -1 || existingHeaders.indexOf("Gallery Image URLs") === -1 || existingHeaders.indexOf("Skills / Services Used") === -1 || existingHeaders.indexOf("Problem / Goal") === -1 || existingHeaders.indexOf("What I Did") === -1 || existingHeaders.indexOf("Result / Outcome") === -1) {
    sheet.clear();
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function getCell(row, header, name) {
  const index = header.indexOf(name);
  return index >= 0 ? row[index] : "";
}

function parseGalleryImages(value, fallbackImage) {
  if (!value) return fallbackImage ? [fallbackImage] : [];

  const images = String(value)
    .split(/\n|,/)
    .map(url => convertDriveUrl(url.trim()))
    .filter(Boolean);

  if (!images.length && fallbackImage) images.push(fallbackImage);

  return images;
}

function createProjectId(title) {
  const slug = String(title || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const random = Utilities.getUuid().slice(0, 8);
  return slug + "-" + random;
}

function convertDriveUrl(url) {
  if (!url) return "";

  const match = String(url).match(/\/d\/([^/]+)/);
  if (match && match[1]) {
    return "https://drive.google.com/uc?export=view&id=" + match[1];
  }

  const idMatch = String(url).match(/[?&]id=([^&]+)/);
  if (idMatch && idMatch[1]) {
    return "https://drive.google.com/uc?export=view&id=" + idMatch[1];
  }

  return url;
}


function getVisitorSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Site Analytics");

  if (!sheet) {
    sheet = ss.insertSheet("Site Analytics");
    sheet.getRange("A1").setValue("Metric");
    sheet.getRange("B1").setValue("Value");
    sheet.getRange("A2").setValue("Total Visits");
    sheet.getRange("B2").setValue(0);
    sheet.getRange("A3").setValue("Last Visit");
    sheet.getRange("B3").setValue("");
  }

  return sheet;
}

function recordVisit() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getVisitorSheet();
    const current = Number(sheet.getRange("B2").getValue()) || 0;
    const updated = current + 1;

    sheet.getRange("B2").setValue(updated);
    sheet.getRange("B3").setValue(new Date());

    return updated;
  } finally {
    lock.releaseLock();
  }
}

function getVisitCount() {
  const sheet = getVisitorSheet();
  return Number(sheet.getRange("B2").getValue()) || 0;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
