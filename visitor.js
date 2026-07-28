const visitorCountElement = document.querySelector("#visitorCount");

async function loadVisitorCount() {
  if (!visitorCountElement) return;
  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    visitorCountElement.textContent = "—";
    return;
  }

  const sessionKey = `visit-recorded:${VISITOR_SITE_KEY}`;
  const alreadyRecorded = sessionStorage.getItem(sessionKey) === "1";
  const action = alreadyRecorded ? "getVisitCount" : "recordVisit";

  try {
    const url = `${API_URL}?action=${action}&site=${encodeURIComponent(VISITOR_SITE_KEY)}&t=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!data.success) throw new Error(data.message || "Unable to load visit count.");
    if (!alreadyRecorded) sessionStorage.setItem(sessionKey, "1");
    visitorCountElement.textContent = Number(data.visits || 0).toLocaleString("en-PH");
  } catch (error) {
    console.error("Visitor counter error:", error);
    visitorCountElement.textContent = "—";
  }
}

loadVisitorCount();
