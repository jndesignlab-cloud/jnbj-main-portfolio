const SITE_VERSION = "3.12.0";
const LAST_EDIT = "August 18, 2026";
const DRAFT_STORAGE_KEY = "designlab-inquiry-draft";

const inquiryForm = document.querySelector("#inquiryForm");
const submitButton = document.querySelector("#inquirySubmit");
const inquiryStatus = document.querySelector("#inquiryStatus");
const successPanel = document.querySelector("#inquirySuccess");
const formIntro = document.querySelector("#contactFormIntro");
const referenceElement = document.querySelector("#inquiryReference");
const confirmationNote = document.querySelector("#inquiryConfirmationNote");
const trackingLink = document.querySelector("#inquiryTrackingLink");
const messageField = inquiryForm?.querySelector('textarea[name="message"]');
const messageCount = document.querySelector("#messageCount");
const progressFill = document.querySelector("#inquiryProgressFill");
const stepPanels = [...document.querySelectorAll("[data-form-step]")];
const stepIndicators = [...document.querySelectorAll("[data-step-indicator]")];
let currentStep = 1;

function setFooterMeta() {
  const yearNode = document.querySelector("#year");
  const versionNode = document.querySelector("#siteVersion");
  const lastEditNode = document.querySelector("#lastEdit");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
  if (versionNode) versionNode.textContent = SITE_VERSION;
  if (lastEditNode) lastEditNode.textContent = LAST_EDIT;
}

function applyInquiryContext() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service") || "";
  const packageName = params.get("package") || "";
  const source = params.get("source") || "contact-page";

  const serviceField = document.querySelector("#serviceInterest");
  const packageField = document.querySelector("#packageInterest");
  const sourceField = document.querySelector("#inquirySource");
  const sourcePageField = document.querySelector("#inquirySourcePage");
  const themeField = document.querySelector("#inquiryTheme");

  if (serviceField && service && [...serviceField.options].some((option) => option.value === service)) {
    serviceField.value = service;
  }
  if (packageField && packageName) packageField.value = packageName;
  if (sourceField) sourceField.value = source;
  if (sourcePageField) sourcePageField.value = document.referrer || window.location.href;
  if (themeField) themeField.value = document.documentElement.dataset.theme || "blue";
}

function updateMessageCount() {
  if (messageCount && messageField) messageCount.textContent = messageField.value.length;
}

function getStepPanel(step) {
  return stepPanels.find((panel) => Number(panel.dataset.formStep) === step);
}

function validateStep(step) {
  const panel = getStepPanel(step);
  if (!panel) return true;

  const fields = [...panel.querySelectorAll("input, select, textarea")]
    .filter((field) => field.type !== "hidden" && !field.disabled);

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus({ preventScroll: true });
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
  }
  return true;
}

function updateReview() {
  if (!inquiryForm) return;
  const data = new FormData(inquiryForm);
  const fullName = `${data.get("firstName") || ""} ${data.get("lastName") || ""}`.trim() || "—";
  const email = data.get("email") || "—";
  const service = [data.get("service"), data.get("package")].filter(Boolean).join(" · ") || "—";
  const scope = [data.get("budget"), data.get("timeline")].filter(Boolean).join(" · ") || "—";

  const values = { name: fullName, email, service, scope };
  Object.entries(values).forEach(([key, value]) => {
    const target = document.querySelector(`[data-review-field="${key}"]`);
    if (target) target.textContent = value;
  });
}

function showStep(step, options = {}) {
  currentStep = Math.min(3, Math.max(1, step));

  stepPanels.forEach((panel) => {
    const panelStep = Number(panel.dataset.formStep);
    panel.hidden = panelStep !== currentStep;
  });

  stepIndicators.forEach((indicator) => {
    const indicatorStep = Number(indicator.dataset.stepIndicator);
    indicator.classList.toggle("is-active", indicatorStep === currentStep);
    indicator.classList.toggle("is-complete", indicatorStep < currentStep);
  });

  if (progressFill) progressFill.style.width = `${(currentStep / 3) * 100}%`;
  if (currentStep === 3) updateReview();

  if (options.scroll !== false) {
    document.querySelector(".contact-form-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function removeDraft() {
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    /* Draft storage may be unavailable in restricted browser contexts. */
  }
}

function saveDraft() {
  if (!inquiryForm) return;
  const draft = {};
  new FormData(inquiryForm).forEach((value, key) => {
    if (!["website", "sourcePage", "theme"].includes(key)) draft[key] = value;
  });
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    /* The form remains fully usable even when draft storage is unavailable. */
  }
}

function restoreDraft() {
  if (!inquiryForm) return;
  let raw = "";
  try {
    raw = sessionStorage.getItem(DRAFT_STORAGE_KEY) || "";
  } catch (error) {
    return;
  }
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    Object.entries(draft).forEach(([name, value]) => {
      const fields = [...inquiryForm.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      fields.forEach((field) => {
        if (field.type === "radio" || field.type === "checkbox") {
          field.checked = field.value === value;
        } else if (!field.value) {
          field.value = value;
        }
      });
    });
  } catch (error) {
    console.warn("Could not restore the saved inquiry draft.", error);
    removeDraft();
  }
}

function validateForm() {
  if (!inquiryForm.checkValidity()) {
    const invalidField = inquiryForm.querySelector(":invalid");
    if (invalidField) {
      const parentStep = invalidField.closest("[data-form-step]");
      if (parentStep) showStep(Number(parentStep.dataset.formStep), { scroll: false });
      invalidField.reportValidity();
    }
    return false;
  }
  return true;
}

async function submitInquiry(event) {
  event.preventDefault();

  if (!validateForm()) return;
  if (typeof API_URL === "undefined" || !API_URL || API_URL.includes("PASTE_YOUR")) {
    inquiryStatus.textContent = "The inquiry form is not connected yet. Please check config.js.";
    return;
  }

  const payload = Object.fromEntries(new FormData(inquiryForm).entries());
  payload.action = "submitInquiry";
  payload.theme = document.documentElement.dataset.theme || payload.theme || "blue";
  payload.sourcePage = payload.sourcePage || document.referrer || window.location.href;

  submitButton.disabled = true;
  submitButton.textContent = "Sending inquiry...";
  inquiryStatus.textContent = "Please wait while your inquiry is submitted.";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!data.success) throw new Error(data.message || "Unable to send your inquiry.");

    removeDraft();
    inquiryForm.hidden = true;
    formIntro.hidden = true;
    document.querySelector(".inquiry-stepper")?.setAttribute("hidden", "");
    document.querySelector(".inquiry-progress-track")?.setAttribute("hidden", "");
    successPanel.hidden = false;
    const inquiryId = data.inquiryId || "Submitted";
    referenceElement.textContent = inquiryId;

    if (trackingLink) {
      trackingLink.href = data.trackingUrl || `inquiry-status.html?id=${encodeURIComponent(inquiryId)}`;
    }

    if (confirmationNote) {
      confirmationNote.textContent = data.clientConfirmationSent === false
        ? "Your inquiry was saved, but the confirmation email could not be sent. Keep your reference number and use the Track Inquiry button below."
        : `A confirmation email with your submitted details and tracking link was sent to ${payload.email}.`;
    }

    if (data.notificationSent === false) {
      console.warn("Inquiry saved, but the admin notification email failed:", data.notificationError || "Unknown error");
    }
    if (data.clientConfirmationSent === false) {
      console.warn("Inquiry saved, but the client confirmation email failed:", data.clientConfirmationError || "Unknown error");
    }

    successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    inquiryStatus.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Project Inquiry ↗";
  }
}

inquiryForm?.addEventListener("input", () => {
  updateMessageCount();
  saveDraft();
  if (currentStep === 3) updateReview();
});

inquiryForm?.addEventListener("change", () => {
  saveDraft();
  if (currentStep === 3) updateReview();
});

inquiryForm?.addEventListener("submit", submitInquiry);

document.querySelectorAll("[data-next-step]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    showStep(Number(button.dataset.nextStep));
  });
});

document.querySelectorAll("[data-previous-step]").forEach((button) => {
  button.addEventListener("click", () => showStep(Number(button.dataset.previousStep)));
});

setFooterMeta();
restoreDraft();
applyInquiryContext();
updateMessageCount();
showStep(1, { scroll: false });
