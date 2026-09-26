try {
  const theme = localStorage.getItem("causal-course-theme");
  if (theme === "dark" || theme === "light")
    document.documentElement.dataset.theme = theme;
} catch (error) {
  if (error.name !== "SecurityError") throw error;
}
