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
const previousButton = document.getElementById('projectPrevImage');
const nextButton = document.getElementById('projectNextImage');

let galleryImages = [];
let activeImageIndex = 0;
let imageChangeTimer = null;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function findSkillLabel(project) {
  const text = [project.category, project.filterCategory, project.skills].join(' ').toLowerCase();
  for (const [key, skill] of Object.entries(data.skills)) {
    if (text.includes(skill.label.toLowerCase()) || text.includes(key)) return skill.label;
  }
  return project.category || 'Selected project';
}

function missing(message = 'The requested project page is not available.') {
  root.innerHTML = `<section class="missing-project shell"><h1>Project not found.</h1><p>${escapeHtml(message)}</p><a href="projects.html">Return to projects →</a></section>`;
}

function updateArrowState() {
  const hasMultipleImages = galleryImages.length > 1;
  [previousButton, nextButton].forEach(button => {
    if (!button) return;
    button.hidden = !hasMultipleImages;
    button.disabled = !hasMultipleImages;
  });
}

function showImage(src, index, options = {}) {
  if (!src || !galleryImages.length) return;

  activeImageIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length;
  clearTimeout(imageChangeTimer);
  mainPreview.classList.add('is-changing');

  imageChangeTimer = setTimeout(() => {
    mainPreview.innerHTML = `<img src="${escapeHtml(src)}" alt="Project image ${activeImageIndex + 1} of ${galleryImages.length}" />`;
    requestAnimationFrame(() => mainPreview.classList.remove('is-changing'));
  }, 100);

  thumbs.querySelectorAll('.project-thumb-button').forEach((button, buttonIndex) => {
    const isActive = buttonIndex === activeImageIndex;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-current', isActive ? 'true' : 'false');
    if (isActive && options.scrollThumbnail !== false) {
      button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  imageCount.textContent = `${activeImageIndex + 1} / ${galleryImages.length} images`;
}

function stepImage(direction) {
  if (galleryImages.length < 2) return;
  const nextIndex = (activeImageIndex + direction + galleryImages.length) % galleryImages.length;
  showImage(galleryImages[nextIndex], nextIndex);
}

function render(project) {
  updateProjectSeo(project);
  document.getElementById('projectSkill').textContent = findSkillLabel(project).toUpperCase();
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectSummary').textContent = project.description || '';

  galleryImages = ProjectArchive.gallery(project).filter(Boolean);
  imageCount.textContent = `${galleryImages.length} image${galleryImages.length === 1 ? '' : 's'}`;
  updateArrowState();

  if (!galleryImages.length) {
    mainPreview.innerHTML = '<div class="project-gallery-empty">No project images are available yet.</div>';
    thumbs.hidden = true;
    return;
  }

  thumbs.hidden = false;
  thumbs.innerHTML = galleryImages.map((src, index) => `
    <button
      class="project-thumb-button${index === 0 ? ' active' : ''}"
      type="button"
      data-image-index="${index}"
      aria-label="Show project image ${index + 1}"
      aria-current="${index === 0 ? 'true' : 'false'}">
      <img src="${escapeHtml(src)}" alt="Project thumbnail ${index + 1}" loading="lazy" decoding="async" />
    </button>
  `).join('');

  thumbs.querySelectorAll('[data-image-index]').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.imageIndex);
      showImage(galleryImages[index], index, { scrollThumbnail: false });
    });
  });

  showImage(galleryImages[0], 0, { scrollThumbnail: false });
}

previousButton?.addEventListener('click', () => stepImage(-1));
nextButton?.addEventListener('click', () => stepImage(1));

document.addEventListener('keydown', event => {
  const tagName = document.activeElement?.tagName;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    stepImage(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    stepImage(1);
  }
});

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
