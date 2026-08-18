const SITE_VERSION = "3.12.0";

const yearNode = document.getElementById("year");
const versionNode = document.getElementById("siteVersion");
const printButton = document.getElementById("printCvButton");
const modal = document.getElementById("cvDetailModal");
const dialog = modal?.querySelector(".cv-detail-dialog");
const modalEyebrow = document.getElementById("cvDetailEyebrow");
const modalTitle = document.getElementById("cvDetailTitle");
const modalIntro = document.getElementById("cvDetailIntro");
const modalSections = document.getElementById("cvDetailSections");
const modalFooterTitle = document.getElementById("cvDetailFooterTitle");
const modalFooterText = document.getElementById("cvDetailFooterText");
const modalCta = document.getElementById("cvDetailCta");
let lastTrigger = null;

// Move the dialog portal outside <main>. The page reveal animation applies a
// transform to <main>, which creates a stacking context and can place a fixed
// modal underneath the sticky navigation. Appending it to <body> keeps the
// overlay attached to the viewport and above every page element.
if (modal && modal.parentElement !== document.body) {
  document.body.appendChild(modal);
}

if (yearNode) yearNode.textContent = new Date().getFullYear();
if (versionNode) versionNode.textContent = SITE_VERSION;
if (printButton) printButton.addEventListener("click", () => window.print());

const detailData = {
  capabilities: {
    eyebrow: "Capability profile",
    title: "Creative capabilities",
    intro: "My work combines high-volume visual production with clear information design. I can support a single deliverable, a campaign rollout, or an ongoing content system.",
    sections: [
      {
        title: "Campaign & social design",
        body: "Visual direction and production for announcements, enrollment campaigns, event promotions, branded social series, carousel posts, story adaptations, and recurring content requirements.",
        items: ["Campaign key visuals and rollout systems", "Static social posts, carousels, and story formats", "Captions, hooks, and content-support materials"]
      },
      {
        title: "Publication & information design",
        body: "Layouts that organize dense content into readable, structured materials for print and digital use.",
        items: ["Brochures, newsletters, flyers, and event programs", "Infographics and information-heavy announcements", "Presentation assets, backdrops, and large-format materials"]
      },
      {
        title: "Brand, product & visual support",
        body: "Flexible creative support for identity systems, marketing materials, product presentation, and polished visual execution.",
        items: ["Brand identity starters and visual systems", "Photo retouching, mockups, packaging, and apparel visuals", "Canva-editable templates and digital-product presentation"]
      },
      {
        title: "Web visuals & lightweight systems",
        body: "Design and front-end implementation for portfolio pages, landing pages, trackers, dashboards, and small workflow systems.",
        items: ["Responsive HTML, CSS, and JavaScript interfaces", "Google Apps Script and Google Sheets workflows", "GitHub Pages deployment and content-management structures"]
      }
    ],
    footerTitle: "See the work in context",
    footerText: "Browse case studies across university, studio, publication, and web-system projects.",
    ctaLabel: "View projects ↗",
    ctaHref: "projects.html"
  },
  tools: {
    eyebrow: "Applications & workflow",
    title: "Tools selected around the job",
    intro: "I do not treat software as the final skill. I choose tools based on the output, revision process, delivery format, and how easily the work needs to be maintained after handoff.",
    sections: [
      { title: "Adobe production", body: "Photoshop is my primary production and retouching environment, supported by Illustrator and InDesign for vector, identity, and publication needs.", items: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign"] },
      { title: "Collaborative design", body: "For editable systems, fast client collaboration, and interface planning, I use tools that keep files accessible and revisions clear.", items: ["Canva Pro", "Figma", "Framer"] },
      { title: "Web & automation", body: "I build lightweight front-end experiences and practical internal tools when a visual project also needs a working system.", items: ["HTML, CSS, and JavaScript", "Google Apps Script", "Google Sheets and GitHub Pages"] },
      { title: "Content & delivery", body: "Production includes file organization, page support, event visuals, and delivery workflows—not only the final graphic.", items: ["Google Workspace", "Meta/Facebook Page support", "OBS and video-editing tools"] }
    ],
    footerTitle: "Need a specific workflow?",
    footerText: "Project tools can be adapted to your team, delivery method, and preferred editable format.",
    ctaLabel: "Discuss a project ↗",
    ctaHref: "contact.html?source=cv-tools&service=General%20Inquiry"
  },
  remote: {
    eyebrow: "Remote-work capability",
    title: "Prepared for structured remote collaboration",
    intro: "My setup supports design production, cloud delivery, meetings, async communication, and overlapping schedules with distributed teams.",
    sections: [
      { title: "Workstation", body: "A dedicated desktop setup supports Adobe production, multi-file campaigns, browser-based systems, and day-to-day communication.", items: ["Dedicated workstation", "Dual-purpose design and web-production setup", "Organized local and cloud file management"] },
      { title: "Connectivity", body: "A fast primary connection is supported by a backup option to reduce interruption during delivery, meetings, and file transfers.", items: ["Fast primary internet connection", "Backup mobile connection", "Cloud-based file delivery"] },
      { title: "Communication", body: "I work with clear checkpoints, documented revisions, and organized handoffs so progress stays visible without constant meetings.", items: ["Email and chat-based coordination", "Google Drive and shared-document workflows", "Async updates and revision tracking"] },
      { title: "Scheduling", body: "Timezone overlap can be arranged depending on the role, project stage, and required communication window.", items: ["Flexible overlap by arrangement", "Remote freelance and part-time availability", "Deadline-based production planning"] }
    ],
    footerTitle: "Considering remote creative support?",
    footerText: "Share the role, schedule, or project requirements and I can confirm the best working arrangement.",
    ctaLabel: "Contact me ↗",
    ctaHref: "contact.html?source=cv-remote&service=General%20Inquiry"
  },
  panpacific: {
    eyebrow: "Professional experience",
    title: "Panpacific University",
    intro: "Since 2018, I have supported university communications through design, social media management, multimedia production, and fast-turnaround visual execution across official channels.",
    sections: [
      { title: "Current role", body: "Creative Designer, Multimedia Specialist & Social Media Manager", items: ["Institutional campaigns and announcements", "Official social media visual content", "Event, enrollment, and academic communication materials"] },
      { title: "Core responsibilities", body: "I translate academic, marketing, and administrative information into visuals that are easier for students, parents, employees, and external audiences to understand.", items: ["Design and manage campaign visuals, announcements, and social content", "Produce posters, publications, presentation assets, backdrops, and website graphics", "Support captions, schedules, campaign rollouts, and page requirements"] },
      { title: "Production environment", body: "The work often involves multiple offices, strict institutional branding, large audiences, urgent deadlines, and several output formats from one source brief.", items: ["High-volume and rush communication needs", "Coordination with marketing and communications teams", "Consistent output across digital, print, and event use"] },
      { title: "Selected output types", body: "The role covers both daily communication and larger campaign or event requirements.", items: ["Enrollment and program campaigns", "Institutional achievements and ranking announcements", "Student advisories, events, publications, and social media systems"] }
    ],
    footerTitle: "View selected institutional work",
    footerText: "Browse university campaigns, infographics, event visuals, and communication systems in the portfolio.",
    ctaLabel: "View university work ↗",
    ctaHref: "projects.html"
  },
  designlab: {
    eyebrow: "Professional experience",
    title: "DesignLab Creative Studio",
    intro: "DesignLab is my independent creative practice for client work, digital products, campaign systems, and lightweight web tools. It also serves as the structure behind this portfolio.",
    sections: [
      { title: "Current role", body: "Founder, Creative Director & Freelance Designer", items: ["Creative direction and visual production", "Client communication and project intake", "Revision management, file preparation, and final delivery"] },
      { title: "Creative services", body: "Projects range from one-off design support to reusable brand and content systems.", items: ["Social campaigns, carousel posts, logos, and promotional materials", "Canva templates, digital products, mockups, packaging, and presentation visuals", "Brand-consistent systems for ongoing content requirements"] },
      { title: "Web & system work", body: "When a project needs more than a visual, I build focused front-end pages and Google-based workflows that remain practical to maintain.", items: ["Portfolio and landing-page builds", "Dashboards, trackers, forms, and inquiry systems", "Google Apps Script, Sheets, GitHub Pages, and static content workflows"] },
      { title: "Working approach", body: "AI-assisted tools may support concept exploration and production speed, while final direction, editing, brand judgment, and quality control remain human-led.", items: ["Clear creative direction before production", "Reusable systems rather than isolated visuals", "Organized, editable, and presentation-ready delivery"] }
    ],
    footerTitle: "Have a project in mind?",
    footerText: "Use the guided inquiry form to share your goals, timeline, and preferred service.",
    ctaLabel: "Start an inquiry ↗",
    ctaHref: "contact.html?source=cv-designlab&service=General%20Inquiry"
  }
};

function renderSections(sections = []) {
  return sections.map((section) => {
    const items = Array.isArray(section.items) && section.items.length
      ? `<ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "";
    return `<section><span>${section.title}</span><p>${section.body}</p>${items}</section>`;
  }).join("");
}

function openDetail(key, trigger) {
  const detail = detailData[key];
  if (!modal || !dialog || !detail) return;
  lastTrigger = trigger || null;
  modalEyebrow.textContent = detail.eyebrow;
  modalTitle.textContent = detail.title;
  modalIntro.textContent = detail.intro;
  modalSections.innerHTML = renderSections(detail.sections);
  modalFooterTitle.textContent = detail.footerTitle;
  modalFooterText.textContent = detail.footerText;
  modalCta.textContent = detail.ctaLabel;
  modalCta.href = detail.ctaHref;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => dialog.focus());
}

function closeDetail() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastTrigger?.focus();
}

document.querySelectorAll("[data-cv-detail]").forEach((button) => {
  button.addEventListener("click", () => openDetail(button.dataset.cvDetail, button));
});

document.querySelectorAll("[data-cv-close]").forEach((button) => {
  button.addEventListener("click", closeDetail);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetail();
});
