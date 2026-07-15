const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const storageKey = "bfl-theme";

const sunIcon = toggle?.querySelector(".icon-sun");
const moonIcon = toggle?.querySelector(".icon-moon");

function getActiveTheme() {
  const manualTheme = root.dataset.theme;

  if (manualTheme === "light" || manualTheme === "dark") {
    return manualTheme;
  }

  return systemTheme.matches ? "dark" : "light";
}

function updateToggle() {
  if (!toggle || !sunIcon || !moonIcon) {
    return;
  }

  const activeTheme = getActiveTheme();
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  /*
   * The icon indicates what clicking the button will do:
   * sun = switch to light mode
   * moon = switch to dark mode
   */
  sunIcon.toggleAttribute("hidden", nextTheme !== "light");
  moonIcon.toggleAttribute("hidden", nextTheme !== "dark");

  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);
}

toggle?.addEventListener("click", () => {
  const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";

  root.dataset.theme = nextTheme;

  try {
    localStorage.setItem(storageKey, nextTheme);
  } catch {
    // The theme still changes when browser storage is unavailable.
  }

  updateToggle();
});

systemTheme.addEventListener("change", () => {
  /*
   * Follow changes to the system theme only when the visitor
   * has not previously made a manual selection.
   */
  if (!root.dataset.theme) {
    updateToggle();
  }
});

updateToggle();