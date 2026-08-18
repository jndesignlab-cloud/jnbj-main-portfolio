const unlockForm = document.querySelector("#adminUnlockForm");
const unlockPanel = document.querySelector("#adminUnlockPanel");
const dashboardContent = document.querySelector("#adminDashboardContent");
const unlockStatus = document.querySelector("#adminUnlockStatus");
const passwordInput = document.querySelector("#adminPassword");

const TOOL_TIMEZONE = "Asia/Manila";

document.querySelector("#year").textContent = new Date().getFullYear();
startAdminClock();

unlockForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordInput.value.trim();
  if (!password) return;

  unlockStatus.textContent = "Loading dashboard…";
  unlockForm.querySelector("button").disabled = true;

  try {
    const portfolioRequest = fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getAdminDashboard", password })
    }).then((response) => response.json());

    const taskRequest = loadTaskData();
    const [portfolioData, taskData] = await Promise.all([portfolioRequest, taskRequest]);

    if (!portfolioData.success) {
      throw new Error(portfolioData.message || "Unable to unlock dashboard.");
    }

    renderPortfolioDashboard(portfolioData.dashboard || {});
    renderTaskDashboard(taskData);

    unlockPanel.hidden = true;
    dashboardContent.hidden = false;
    document.body.classList.add("admin-dashboard-unlocked");
    dashboardContent.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    unlockStatus.textContent = error.message || "Could not load the dashboard.";
  } finally {
    unlockForm.querySelector("button").disabled = false;
  }
});

async function loadTaskData() {
  if (!TASK_API_URL) return { success: false, tasks: [] };
  try {
    const response = await fetch(`${TASK_API_URL}?action=getTasks`);
    const data = await response.json();
    if (!data.success || !Array.isArray(data.tasks)) throw new Error(data.message || "Task data unavailable.");
    return data;
  } catch (error) {
    console.error("Task dashboard error:", error);
    return { success: false, tasks: [], message: error.message };
  }
}

function renderPortfolioDashboard(data) {
  const inquiries = data.inquiries || {};
  const projects = data.projects || {};

  setText("metricOpenInquiries", formatNumber(inquiries.open));
  setText("metricTodayInquiries", formatNumber(inquiries.today));
  setText("metricProjects", formatNumber(projects.published));
  setText("metricFeaturedProjects", `${formatNumber(projects.featured)} featured`);
  setText("metricVisits", formatNumber(data.visits));
  setText("metricInquiryNote", `${formatNumber(inquiries.total)} total · ${formatNumber(inquiries.new)} new`);

  const recent = Array.isArray(inquiries.recent) ? inquiries.recent : [];
  const container = document.querySelector("#recentInquiryList");
  if (!recent.length) {
    container.innerHTML = '<p class="admin-empty">No inquiries have been recorded yet.</p>';
  } else {
    container.innerHTML = recent.map((item) => `
      <div class="admin-data-row">
        <div><strong>${escapeHtml(item.name || "Unnamed inquiry")}</strong><span>${escapeHtml(item.service || "General inquiry")}</span></div>
        <div class="admin-row-meta"><span class="admin-status-chip">${escapeHtml(item.status || "New")}</span><small>${escapeHtml(item.createdAt || "")}</small></div>
      </div>`).join("");
  }

  const statuses = inquiries.byStatus || {};
  const statusEntries = Object.entries(statuses).sort((a, b) => b[1] - a[1]);
  const statusContainer = document.querySelector("#inquiryStatusList");
  if (!statusEntries.length) {
    statusContainer.innerHTML = '<p class="admin-empty">No inquiry status data yet.</p>';
  } else {
    const max = Math.max(...statusEntries.map(([, count]) => Number(count) || 0), 1);
    statusContainer.innerHTML = statusEntries.map(([status, count]) => `
      <div class="admin-status-row">
        <div><span>${escapeHtml(status)}</span><strong>${formatNumber(count)}</strong></div>
        <i><b style="width:${Math.max(5, Math.round((count / max) * 100))}%"></b></i>
      </div>`).join("");
  }
}

function renderTaskDashboard(data) {
  const tasks = data.success && Array.isArray(data.tasks) ? data.tasks : [];
  const today = getManilaDateKey();
  const todayTasks = tasks.filter((task) => normalizeDate(task.date) === today);
  const pendingTasks = tasks
    .filter((task) => ["Pending", "In Progress"].includes(String(task.status || "")))
    .sort(sortPendingTasks);
  const completedToday = todayTasks.filter((task) => String(task.status) === "Completed").length;

  setText("metricPendingTasks", data.success ? formatNumber(pendingTasks.length) : "—");
  setText("metricTodayTasks", data.success ? formatNumber(todayTasks.length) : "—");
  setText("metricCompletedToday", data.success ? `${formatNumber(completedToday)} completed` : "Tracker unavailable");

  renderTaskList("todayTaskList", todayTasks.sort(sortTasksByTime), "No tasks scheduled for today.");
  renderTaskList("pendingTaskList", pendingTasks.slice(0, 8), data.success ? "No pending tasks. Great work." : "The task tracker could not be reached.");
}

function renderTaskList(id, tasks, emptyMessage) {
  const container = document.querySelector(`#${id}`);
  if (!tasks.length) {
    container.innerHTML = `<p class="admin-empty">${escapeHtml(emptyMessage)}</p>`;
    return;
  }

  container.innerHTML = tasks.slice(0, 10).map((task) => `
    <div class="admin-data-row admin-task-row">
      <div><strong>${escapeHtml(task.taskName || "Untitled task")}</strong><span>${escapeHtml([task.category, task.urgency].filter(Boolean).join(" · "))}</span></div>
      <div class="admin-row-meta"><span class="admin-status-chip">${escapeHtml(task.status || "Pending")}</span><small>${escapeHtml(task.timeSlot || formatTaskDate(task.date))}</small></div>
    </div>`).join("");
}

function sortPendingTasks(a, b) {
  const priority = { "Today’s Priority": 0, "High Priority": 1, "Daily Task": 2, "Weekly Task": 3, "Low Priority": 4 };
  return (priority[a.urgency] ?? 8) - (priority[b.urgency] ?? 8) || normalizeDate(a.date).localeCompare(normalizeDate(b.date));
}

function sortTasksByTime(a, b) {
  return timeToMinutes(a.timeSlot) - timeToMinutes(b.timeSlot);
}

function timeToMinutes(value) {
  if (!value) return 9999;
  const parsed = new Date(`2000-01-01 ${value}`);
  return Number.isNaN(parsed.getTime()) ? 9999 : parsed.getHours() * 60 + parsed.getMinutes();
}

function normalizeDate(value) {
  if (!value) return "";
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TOOL_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function getManilaDateKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TOOL_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function formatTaskDate(value) {
  if (!value) return "";
  const date = new Date(`${normalizeDate(value)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function startAdminClock() {
  const update = () => {
    const now = new Date();
    setText("adminClock", now.toLocaleTimeString("en-PH", { timeZone: TOOL_TIMEZONE, hour: "2-digit", minute: "2-digit" }));
    setText("adminDate", now.toLocaleDateString("en-PH", { timeZone: TOOL_TIMEZONE, weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  };
  update();
  window.setInterval(update, 30000);
}

function formatNumber(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-PH").format(number);
}

function setText(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
