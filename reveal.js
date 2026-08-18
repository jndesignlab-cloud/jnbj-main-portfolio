(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  root.classList.add("motion-enabled");

  function preparePage() {
    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("page-reveal");

    const revealTargets = new Set([
      ...document.querySelectorAll(".reveal-up"),
      ...main.querySelectorAll(":scope > section, :scope > article")
    ]);

    revealTargets.forEach((target, index) => {
      target.classList.add("section-reveal");
      target.style.setProperty("--section-reveal-delay", `${Math.min(index * 35, 140)}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      main.classList.add("is-visible");
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => main.classList.add("is-visible")));

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: .11, rootMargin: "0px 0px -6% 0px" });

    revealTargets.forEach((target) => observer.observe(target));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preparePage, { once: true });
  } else {
    preparePage();
  }
})();
