(() => {
  const CACHE_KEY = 'jann-shared-project-archive-v1';
  const CACHE_AGE = 5 * 60 * 1000;

  function text(value) {
    return Array.isArray(value) ? value.join(' ') : String(value || '');
  }
  function list(value) {
    if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
    return String(value || '').split(/\n|,|;|\||\s+-\s+/).map(v => v.trim()).filter(Boolean);
  }
  function slug(value) {
    return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  function id(project) { return String(project?.id || slug(project?.title)); }
  function image(project) {
    if (!project) return '';
    return project.image || project.previewImage || list(project.galleryImages)[0] || '';
  }
  function gallery(project) {
    const images = [...list(project?.galleryImages)];
    const main = image(project);
    if (main && !images.includes(main)) images.unshift(main);
    return images;
  }
  function visible(project) {
    const value = project?.showOnPersonalPortfolio ?? project?.personalPortfolio ?? project?.showPersonal;
    if (value === undefined || value === null || value === '') return true;
    return value === true || ['true','yes','1','show'].includes(String(value).toLowerCase());
  }
  function normalize(project) {
    return {
      ...project,
      id: id(project),
      title: String(project?.title || 'Untitled project'),
      category: String(project?.category || 'Selected Project'),
      description: String(project?.description || project?.summary || ''),
      skills: project?.skills || '',
      galleryImages: gallery(project)
    };
  }
  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached?.savedAt || Date.now() - cached.savedAt > CACHE_AGE || !Array.isArray(cached.projects)) return null;
      return cached.projects;
    } catch (_) { return null; }
  }
  function writeCache(projects) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), projects })); } catch (_) {}
  }
  async function load(options = {}) {
    if (!options.force) {
      const cached = readCache();
      if (cached) return cached.map(normalize).filter(visible);
    }
    const response = await fetch(`${API_URL}?action=listProjects`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Project archive request failed (${response.status})`);
    const payload = await response.json();
    if (!payload?.success || !Array.isArray(payload.projects)) throw new Error('Invalid project archive response');
    const projects = payload.projects.filter(project => project && project.title).map(normalize);
    writeCache(projects);
    return projects.filter(visible);
  }
  function find(projects, requestedId) {
    const target = String(requestedId || '').trim().toLowerCase();
    return projects.find(project => id(project).toLowerCase() === target || project.title.toLowerCase() === target);
  }
  window.ProjectArchive = { load, id, image, gallery, visible, list, text, slug, normalize, find };
})();