const SITE_VERSION = "3.12.0";

const yearElement = document.querySelector("#year");
const versionElement = document.querySelector("#siteVersion");
const lastEditElement = document.querySelector("#lastEdit");
const visitorCountElement = document.querySelector("#visitorCount");

if (yearElement) yearElement.textContent = new Date().getFullYear();
if (versionElement) versionElement.textContent = SITE_VERSION;

if (lastEditElement) {
  const lastModified = new Date(document.lastModified);
  lastEditElement.textContent = lastModified.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function recordVisitor() {
  if (!visitorCountElement) return;

  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    visitorCountElement.textContent = "—";
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}?action=recordVisit&t=${Date.now()}`,
      { cache: "no-store" }
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Unable to record visit.");
    }

    visitorCountElement.textContent =
      Number(data.visits || 0).toLocaleString("en-PH");
  } catch (error) {
    console.error("Visitor counter error:", error);
    visitorCountElement.textContent = "—";
  }
}

recordVisitor();
