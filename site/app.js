const toggle = document.querySelector(".theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : systemTheme.matches;
  toggle.textContent = dark ? "Light" : "Dark";
  toggle.setAttribute(
    "aria-label",
    dark ? "Use light theme" : "Use dark theme",
  );
}
toggle.hidden = false;
updateThemeButton();
systemTheme.addEventListener("change", updateThemeButton);
toggle.addEventListener("click", () => {
  const dark = toggle.getAttribute("aria-label") === "Use light theme";
  const theme = dark ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("causal-course-theme", theme);
  } catch (error) {
    if (!["SecurityError", "QuotaExceededError"].includes(error.name))
      throw error;
  }
  updateThemeButton();
});

const search = document.querySelector("#chapter-search");
if (search) {
  document.querySelector(".search").hidden = false;
  const chapters = [...document.querySelectorAll(".chapter")];
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    for (const chapter of chapters) {
      chapter.hidden = !chapter.dataset.search.includes(query);
      if (!chapter.hidden) count++;
    }
    document.querySelector(".chapter-count").textContent =
      `${count} of ${chapters.length} chapters${query ? " match your search" : " available"}.`;
    document.querySelector(".empty-search").hidden = count > 0;
  });
}

const key = "causal-course-read-v1";
const checkbox = document.querySelector("[data-complete]");
let completed = [];
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  if (Array.isArray(saved))
    completed = saved.filter((id) => typeof id === "string");
} catch (error) {
  if (error.name === "SecurityError") storageAvailable = false;
  else if (!(error instanceof SyntaxError)) throw error;
}
for (const chapter of document.querySelectorAll("[data-lesson-id]")) {
  chapter.querySelector(".completed-label").hidden = !completed.includes(
    chapter.dataset.lessonId,
  );
}
if (checkbox) {
  document.querySelector(".reading-progress").hidden = false;
  checkbox.checked = completed.includes(checkbox.dataset.complete);
  const status = document.querySelector(".storage-note");
  const unavailable =
    "Browser storage is unavailable. This reading mark will last only while this page is open.";
  if (!storageAvailable) status.textContent = unavailable;
  checkbox.addEventListener("change", () => {
    completed = completed.filter((id) => id !== checkbox.dataset.complete);
    if (checkbox.checked) completed.push(checkbox.dataset.complete);
    try {
      localStorage.setItem(key, JSON.stringify(completed));
    } catch (error) {
      if (!["SecurityError", "QuotaExceededError"].includes(error.name))
        throw error;
      status.textContent = unavailable;
    }
  });
}

const contents = document.querySelector(".contents");
if (contents && window.matchMedia("(max-width: 800px)").matches)
  contents.open = false;
