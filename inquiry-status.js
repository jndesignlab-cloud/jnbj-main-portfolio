const SITE_VERSION = "3.12.0";
const LAST_EDIT = "August 18, 2026";

const trackingForm = document.querySelector("#trackingForm");
const trackingSubmit = document.querySelector("#trackingSubmit");
const trackingMessage = document.querySelector("#trackingMessage");
const trackingResult = document.querySelector("#trackingResult");
const trackingReference = document.querySelector("#trackingReference");

function setFooterMeta() {
  const yearNode = document.querySelector("#year");
  const versionNode = document.querySelector("#siteVersion");
  const lastEditNode = document.querySelector("#lastEdit");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
  if (versionNode) versionNode.textContent = SITE_VERSION;
  if (lastEditNode) lastEditNode.textContent = LAST_EDIT;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value || "—";
}

function applyTrackingStage(stage) {
  const safeStage = Math.max(1, Math.min(5, Number(stage) || 1));
  document.querySelectorAll(".tracking-timeline [data-stage]").forEach((item) => {
    const itemStage = Number(item.dataset.stage);
    item.classList.toggle("is-complete", itemStage < safeStage);
    item.classList.toggle("is-current", itemStage === safeStage);
  });
}

function renderInquiry(inquiry) {
  setText("#trackingResultId", inquiry.inquiryId);
  setText("#trackingStatusBadge", inquiry.status || "New");
  setText("#trackingStatusMessage", inquiry.statusMessage);
  setText("#trackingCreatedAt", inquiry.createdAt);
  setText("#trackingService", inquiry.service);
  setText("#trackingPackage", inquiry.package);
  setText("#trackingBudget", inquiry.budget);
  setText("#trackingTimeline", inquiry.timeline);
  setText("#trackingContact", inquiry.preferredContact);
  setText("#trackingProjectMessage", inquiry.message);
  applyTrackingStage(inquiry.statusStage);

  trackingResult.hidden = false;
  trackingResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function checkInquiry(event) {
  event.preventDefault();
  trackingResult.hidden = true;
  trackingMessage.textContent = "";

  if (!trackingForm.checkValidity()) {
    trackingForm.reportValidity();
    return;
  }

  if (typeof API_URL === "undefined" || !API_URL || API_URL.includes("PASTE_YOUR")) {
    trackingMessage.textContent = "The tracking system is not connected yet. Please check config.js.";
    return;
  }

  const payload = Object.fromEntries(new FormData(trackingForm).entries());
  payload.action = "trackInquiry";
  payload.inquiryId = String(payload.inquiryId || "").trim().toUpperCase();
  payload.email = String(payload.email || "").trim();

  trackingSubmit.disabled = true;
  trackingSubmit.textContent = "Checking status...";
  trackingMessage.textContent = "Verifying your inquiry details.";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Unable to find this inquiry.");

    trackingMessage.textContent = "Inquiry verified successfully.";
    renderInquiry(data.inquiry);
  } catch (error) {
    console.error(error);
    trackingMessage.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    trackingSubmit.disabled = false;
    trackingSubmit.textContent = "Check Inquiry Status ↗";
  }
}

function applyQueryReference() {
  const reference = new URLSearchParams(window.location.search).get("id");
  if (reference && trackingReference) trackingReference.value = reference.toUpperCase();
}

trackingForm?.addEventListener("submit", checkInquiry);
setFooterMeta();
applyQueryReference();
