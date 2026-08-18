const SITE_VERSION = "3.12.0";
const LAST_EDIT = "August 18, 2026";

const DOWNLOADS = [
  {
    "id": "financial-planner",
    "title": "DesignLab Financial Planner",
    "type": "Google Sheets",
    "description": "A personal finance workbook for budgeting, tracking expenses, and keeping everyday money planning organized.",
    "preview": "https://docs.google.com/spreadsheets/d/1140shsvBh52ljiG7e1iERysfn2Ep9uiUfJqm5qXh0is/edit?usp=sharing",
    "copy": "https://docs.google.com/spreadsheets/d/1140shsvBh52ljiG7e1iERysfn2Ep9uiUfJqm5qXh0is/copy",
    "expect": [
      "A ready-to-use personal finance workbook",
      "Budget and expense tracking sections",
      "Simple dashboard-style summaries",
      "Editable categories for your own setup"
    ],
    "tags": [
      "finance",
      "planner",
      "budget",
      "expenses",
      "personal"
    ],
    "accent": "green"
  },
  {
    "id": "small-business-finance",
    "title": "DesignLab Small Business Finance Tracker",
    "type": "Google Sheets",
    "description": "A compact finance tracker for small businesses that need a clearer view of income, expenses, and day-to-day financial activity.",
    "preview": "https://docs.google.com/spreadsheets/d/1r9BnLF9emXIHyQmbb-JfHNCISHWpmtGAO-2jHEh0nOY/edit?gid=1770362451#gid=1770362451",
    "copy": "https://docs.google.com/spreadsheets/d/1r9BnLF9emXIHyQmbb-JfHNCISHWpmtGAO-2jHEh0nOY/copy",
    "expect": [
      "Business-focused income and expense tracking",
      "A cleaner view of regular cash movement",
      "Editable categories for products or services",
      "A reusable finance sheet for ongoing records"
    ],
    "tags": [
      "business",
      "finance",
      "income",
      "expenses",
      "small business"
    ],
    "accent": "blue"
  },
  {
    "id": "freelancer-dashboard",
    "title": "DesignLab Freelancer Dashboard",
    "type": "Google Sheets",
    "description": "A practical dashboard for freelancers to organize client work, project activity, and the business side of independent work.",
    "preview": "https://docs.google.com/spreadsheets/d/1g2NDK0Xt-Z3p4ghGLMihiGas14zbajb25oir9qgHl9Q/edit?usp=sharing",
    "copy": "https://docs.google.com/spreadsheets/d/1g2NDK0Xt-Z3p4ghGLMihiGas14zbajb25oir9qgHl9Q/copy",
    "expect": [
      "A centralized freelancer workspace",
      "Sections for clients and project tracking",
      "A quick dashboard for active work",
      "Editable fields to fit your own freelance workflow"
    ],
    "tags": [
      "freelancer",
      "dashboard",
      "clients",
      "projects",
      "workflow"
    ],
    "accent": "violet"
  }
];

document.querySelectorAll("#siteVersion").forEach((el) => el.textContent = SITE_VERSION);
document.querySelectorAll("#lastEdit").forEach((el) => el.textContent = LAST_EDIT);
document.querySelectorAll("#year").forEach((el) => el.textContent = new Date().getFullYear());

const downloadGrid = document.getElementById("downloadGrid");
const downloadSearch = document.getElementById("downloadSearch");
const downloadResultCount = document.getElementById("downloadResultCount");
const downloadEmptyState = document.getElementById("downloadEmptyState");
const downloadModal = document.getElementById("downloadModal");

const dialogType = document.getElementById("downloadDialogType");
const dialogTitle = document.getElementById("downloadDialogTitle");
const dialogDescription = document.getElementById("downloadDialogDescription");
const dialogExpectList = document.getElementById("downloadExpectList");
const copyLink = document.getElementById("downloadCopyLink");
const previewLink = document.getElementById("downloadPreviewLink");

let lastDownloadTrigger = null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cardPreview(resource) {
  const initials = resource.title
    .replace("DesignLab ", "")
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("");

  return `
    <div class="compact-file-visual compact-file-visual-${escapeHtml(resource.accent)}">
      <div class="compact-sheet-ui" aria-hidden="true">
        <div class="compact-sheet-bar">
          <span></span><span></span><span></span>
          <b>${escapeHtml(resource.type)}</b>
        </div>
        <div class="compact-sheet-content">
          <div class="compact-sheet-side">
            <i></i><i></i><i></i>
          </div>
          <div class="compact-sheet-main">
            <strong>${escapeHtml(initials)}</strong>
            <div></div><div></div><div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function downloadCard(resource) {
  return `
    <article class="download-file-card compact-download-card">
      ${cardPreview(resource)}
      <div class="download-file-body compact-download-body">
        <div class="download-file-topline">
          <span>${escapeHtml(resource.type)}</span>
          <strong>FREE</strong>
        </div>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
        <div class="download-file-actions">
          <button
            class="download-file-primary"
            type="button"
            data-download-id="${escapeHtml(resource.id)}">
            View free file
          </button>
          <a href="${escapeHtml(resource.preview)}" target="_blank" rel="noopener noreferrer">
            Preview ↗
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderDownloads(items) {
  if (!downloadGrid) return;

  downloadGrid.innerHTML = items.map(downloadCard).join("");

  if (downloadResultCount) {
    downloadResultCount.textContent =
      `${items.length} free file${items.length === 1 ? "" : "s"}`;
  }

  if (downloadEmptyState) {
    downloadEmptyState.hidden = items.length !== 0;
  }

  downloadGrid.querySelectorAll("[data-download-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const resource = DOWNLOADS.find((item) => item.id === button.dataset.downloadId);
      if (resource) openDownloadModal(resource, button);
    });
  });
}

function filterDownloads() {
  const query = (downloadSearch?.value || "").trim().toLowerCase();

  if (!query) {
    renderDownloads(DOWNLOADS);
    return;
  }

  const filtered = DOWNLOADS.filter((resource) => {
    const haystack = [
      resource.title,
      resource.type,
      resource.description,
      ...(resource.tags || []),
      ...(resource.expect || [])
    ].join(" ").toLowerCase();

    return haystack.includes(query);
  });

  renderDownloads(filtered);
}

function openDownloadModal(resource, trigger) {
  if (!downloadModal) return;

  lastDownloadTrigger = trigger || document.activeElement;

  dialogType.textContent = `FREE ${resource.type.toUpperCase()}`;
  dialogTitle.textContent = resource.title;
  dialogDescription.textContent = resource.description;
  dialogExpectList.innerHTML = resource.expect
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  copyLink.href = resource.copy;
  previewLink.href = resource.preview;

  downloadModal.classList.add("is-open");
  downloadModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("download-modal-open");

  window.setTimeout(() => {
    downloadModal.querySelector(".download-dialog-close")?.focus();
  }, 20);
}

function closeDownloadModal() {
  if (!downloadModal) return;

  downloadModal.classList.remove("is-open");
  downloadModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("download-modal-open");
  lastDownloadTrigger?.focus();
}

downloadSearch?.addEventListener("input", filterDownloads);

document.querySelectorAll("[data-download-close]").forEach((button) => {
  button.addEventListener("click", closeDownloadModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && downloadModal?.classList.contains("is-open")) {
    closeDownloadModal();
  }
});

copyLink?.addEventListener("click", () => {
  closeDownloadModal();
});

renderDownloads(DOWNLOADS);
