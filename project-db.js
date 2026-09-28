(() => {
  const PUBLIC_COLUMNS = [
    "id",
    "title",
    "category",
    "filter_category",
    "featured",
    "image_url",
    "gallery_image_urls",
    "skills",
    "description",
    "problem_goal",
    "what_i_did",
    "result_outcome",
    "project_link",
    "status",
    "show_on_personal_portfolio",
    "created_at",
    "updated_at"
  ].join(",");

  function assertConfig() {
    if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
      throw new Error("Supabase configuration is missing.");
    }
  }

  function headers() {
    assertConfig();
    return {
      apikey: window.SUPABASE_PUBLISHABLE_KEY,
      Accept: "application/json"
    };
  }

  async function parseResponse(response) {
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.hint ||
        data?.details ||
        `Supabase request failed (${response.status}).`;
      throw new Error(message);
    }

    return data;
  }

  function normalizeProject(row = {}) {
    return {
      id: row.id || "",
      title: row.title || "",
      category: row.category || "",
      filterCategory: row.filter_category || "",
      featured: Boolean(row.featured),
      image: row.image_url || "",
      previewImage: row.image_url || "",
      galleryImages: row.gallery_image_urls || "",
      skills: row.skills || "",
      description: row.description || "",
      problem: row.problem_goal || "",
      solution: row.what_i_did || "",
      outcome: row.result_outcome || "",
      link: row.project_link || "",
      status: row.status || "Draft",
      showOnPersonalPortfolio: row.show_on_personal_portfolio !== false,
      createdAt: row.created_at || "",
      updatedAt: row.updated_at || ""
    };
  }

  async function request(params) {
    assertConfig();
    const response = await fetch(
      `${window.SUPABASE_URL}/rest/v1/projects?${params.toString()}`,
      {
        method: "GET",
        headers: headers(),
        cache: "no-store"
      }
    );
    return parseResponse(response);
  }

  async function listPersonalPublished({ limit = null } = {}) {
    const params = new URLSearchParams();
    params.set("select", PUBLIC_COLUMNS);
    params.set("status", "eq.Published");
    params.set("show_on_personal_portfolio", "eq.true");
    params.set("order", "created_at.desc");
    if (Number.isFinite(limit) && limit > 0) params.set("limit", String(limit));

    const rows = await request(params);
    return Array.isArray(rows) ? rows.map(normalizeProject) : [];
  }

  async function getPersonalPublishedProject(id) {
    if (!id) return null;

    const params = new URLSearchParams();
    params.set("select", PUBLIC_COLUMNS);
    params.set("id", `eq.${id}`);
    params.set("status", "eq.Published");
    params.set("show_on_personal_portfolio", "eq.true");
    params.set("limit", "1");

    const rows = await request(params);
    return Array.isArray(rows) && rows.length ? normalizeProject(rows[0]) : null;
  }

  window.JannSupabaseProjects = {
    listPersonalPublished,
    getPersonalPublishedProject,
    normalizeProject
  };
})();
