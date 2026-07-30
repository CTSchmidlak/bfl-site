const seasonSelects = document.querySelectorAll("[data-season-select]");

seasonSelects.forEach((select) => {
  const group = select.closest("[data-season-group]");

  if (!group) {
    return;
  }

  select.addEventListener("change", () => {
    const selectedSeason = select.value;
    const panels = group.querySelectorAll("[data-season-panel]");

    panels.forEach((panel) => {
      const isActive = panel.dataset.seasonPanel === selectedSeason;

      panel.toggleAttribute("hidden", !isActive);
    });
  });
});