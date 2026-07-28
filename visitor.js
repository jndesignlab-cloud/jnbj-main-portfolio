const visitorCountElement = document.querySelector("#visitorCount");

async function loadVisitorCount() {
  if (!visitorCountElement) return;

  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    visitorCountElement.textContent = "0";
    return;
  }

  const counterVersion =
    typeof VISITOR_COUNTER_VERSION !== "undefined"
      ? VISITOR_COUNTER_VERSION
      : "2";

  const sessionKey =
    `visit-recorded:${VISITOR_SITE_KEY}:v${counterVersion}`;

  const alreadyRecorded =
    sessionStorage.getItem(sessionKey) === "1";

  // These actions are intentionally separate from DesignLab's legacy
  // recordVisit/getVisitCount actions. This prevents the personal
  // portfolio from reading or incrementing the studio counter.
  const action = alreadyRecorded
    ? "getSiteVisitCount"
    : "recordSiteVisit";

  try {
    const url =
      `${API_URL}?action=${action}` +
      `&site=${encodeURIComponent(VISITOR_SITE_KEY)}` +
      `&t=${Date.now()}`;

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!data.success || data.site !== VISITOR_SITE_KEY) {
      throw new Error(
        data.message ||
        "The separate personal portfolio counter is awaiting backend deployment."
      );
    }

    if (!alreadyRecorded) {
      sessionStorage.setItem(sessionKey, "1");
    }

    visitorCountElement.textContent =
      Number(data.visits || 0).toLocaleString("en-PH");
  } catch (error) {
    console.warn("Personal portfolio counter:", error.message);

    // Do not display the shared DesignLab value. Until the updated
    // Apps Script is deployed, the personal counter visibly stays reset.
    visitorCountElement.textContent = "0";
  }
}

loadVisitorCount();
