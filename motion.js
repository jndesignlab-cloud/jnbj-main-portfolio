(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    ...document.querySelectorAll('.motion-cover, .motion-identity, .motion-section, .page-hero, .projects-grid, .cv-hero, .cv-section, .project-hero-case, .project-image-stage, .case-content, .project-gallery-hero, .project-gallery-stage, .project-gallery-thumbs')
  ];
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-ready');
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 180)}ms`);
  });
  document.querySelectorAll('.service-item, .project-tile, .cv-metric, .cv-index-row, .cv-experience-row').forEach((element, index) => {
    element.classList.add('reveal-ready');
    element.style.setProperty('--reveal-delay', `${(index % 8) * 55}ms`);
  });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.concat([...document.querySelectorAll('.reveal-ready')]).forEach(element => element.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal-ready').forEach(element => observer.observe(element));
  }

  const counters = [...document.querySelectorAll('.count-up')];
  function animateCounter(element) {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';
    const end = Number(element.dataset.count || 0);
    if (reduceMotion) { element.textContent = end.toLocaleString('en-US'); return; }
    const duration = 1150;
    const startTime = performance.now();
    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(end * eased).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); countObserver.unobserve(entry.target); }
    }), { threshold: .55 });
    counters.forEach(counter => countObserver.observe(counter));
  } else counters.forEach(animateCounter);
})();