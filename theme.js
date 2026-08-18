(() => {
  const root = document.documentElement;
  const STORAGE_KEY = "designlab-theme";
  const VALID_THEMES = ["blue", "light"];

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return VALID_THEMES.includes(saved) ? saved : "light";
    } catch (error) {
      return "light";
    }
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = VALID_THEMES.includes(theme) ? theme : "light";
    root.dataset.theme = nextTheme;

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, nextTheme); } catch (error) {}
    }

    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      const active = button.dataset.themeChoice === nextTheme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function initThemeControls() {
    applyTheme(getSavedTheme());
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => applyTheme(button.dataset.themeChoice, true));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeControls);
  } else {
    initThemeControls();
  }
})();
