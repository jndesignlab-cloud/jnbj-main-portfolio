const SITE_VERSION = "3.12.0";
document.querySelectorAll("#year").forEach((el) => el.textContent = new Date().getFullYear());
document.querySelectorAll("#siteVersion").forEach((el) => el.textContent = SITE_VERSION);
