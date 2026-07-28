function setMeta(selector, attribute, value) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value || '');
}
function setCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}
function updateProjectSeo(project) {
  const projectId = ProjectArchive.id(project);
  const url = `${location.origin}${location.pathname}?id=${encodeURIComponent(projectId)}`;
  const description = project.description || 'A selected project gallery by Jann Jaravata.';
  const image = ProjectArchive.image(project) || `${location.origin}/assets/og-jann-jaravata.jpg`;
  const title = `${project.title} | Jann Jaravata`;

  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:image"]', 'content', image);
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
  setMeta('meta[name="twitter:image"]', 'content', image);
  setCanonical(url);

  const structuredData = document.getElementById('structuredData');
  if (structuredData) {
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${url}#project`,
      url,
      name: project.title,
      description,
      image: ProjectArchive.gallery(project),
      creator: {
        '@type': 'Person',
        '@id': `${location.origin}/#person`,
        name: 'Jann Nathaniel Jaravata'
      },
      about: project.category || 'Graphic Design',
      dateCreated: project.year || undefined,
      inLanguage: 'en-PH'
    });
  }
}
const data = window.PORTFOLIO_DATA;
const params = new URLSearchParams(location.search);
const requested = params.get('id') || params.get('project');
const root = document.getElementById('projectRoot');
const mainPreview = document.getElementById('projectMainPreview');
const thumbs = document.getElementById('projectGalleryThumbs');
const imageCount = document.getElementById('projectImageCount');

function escapeHtml(value) {
  return String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function findSkillLabel(project) {
  const text = [project.category, project.filterCategory, project.skills].join(' ').toLowerCase();
  for (const [key, skill] of Object.entries(data.skills)) {
    if (text.includes(skill.label.toLowerCase().split(' & ')[0]) || text.includes(key)) return skill.label;
  }
  return project.category || 'Selected project';
}

function missing(message = 'The requested project page is not available.') {
  root.innerHTML = `<section class="missing-project shell"><h1>Project not found.</h1><p>${escapeHtml(message)}</p><a href="projects.html">Return to projects →</a></section>`;
}

function showImage(src, index) {
  if (!src) return;
  mainPreview.classList.add('is-changing');
  setTimeout(() => {
    mainPreview.innerHTML = `<img src="${escapeHtml(src)}" alt="Project image ${index + 1}" />`;
    requestAnimationFrame(() => mainPreview.classList.remove('is-changing'));
  }, 120);
  thumbs.querySelectorAll('.project-thumb-button').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
    button.setAttribute('aria-current', buttonIndex === index ? 'true' : 'false');
  });
}

function render(project) {
  document.title = `${project.title} — Jann Jaravata`;
  document.querySelector('meta[name="description"]').setAttribute('content', project.description || 'Project gallery by Jann Jaravata.');
  document.getElementById('projectSkill').textContent = findSkillLabel(project).toUpperCase();
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectSummary').textContent = project.description || '';

  const images = ProjectArchive.gallery(project).filter(Boolean);
  imageCount.textContent = `${images.length} image${images.length === 1 ? '' : 's'}`;

  if (!images.length) {
    mainPreview.innerHTML = '<div class="project-gallery-empty">No project images are available yet.</div>';
    thumbs.hidden = true;
    return;
  }

  thumbs.innerHTML = images.map((src, index) => `<button class="project-thumb-button${index === 0 ? ' active' : ''}" type="button" data-image-index="${index}" aria-label="Show project image ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}"><img src="${escapeHtml(src)}" alt="Project thumbnail ${index + 1}" loading="lazy" decoding="async" /></button>`).join('');
  thumbs.querySelectorAll('[data-image-index]').forEach(button => button.addEventListener('click', () => showImage(images[Number(button.dataset.imageIndex)], Number(button.dataset.imageIndex))));
  showImage(images[0], 0);
}

(async () => {
  try {
    const all = await ProjectArchive.load();
    const project = ProjectArchive.find(all, requested);
    if (!project) return missing();
    render(project);
  } catch (_) {
    missing('The shared DesignLab project archive could not be reached. Please try again later.');
  }
})();
