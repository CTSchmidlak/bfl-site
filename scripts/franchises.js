const franchiseGrid = document.querySelector("[data-franchise-grid]");

async function loadFranchises() {
  if (!franchiseGrid) {
    return;
  }

  try {
    const response = await fetch("/data/franchises.json");

    if (!response.ok) {
      throw new Error("Franchise data could not be loaded.");
    }

    const franchises = await response.json();

    if (!franchises.length) {
      renderEmptyState();
      return;
    }

    franchiseGrid.replaceChildren(
      ...franchises.map((franchise) => buildFranchiseCard(franchise))
    );
  } catch {
    renderEmptyState();
  }
}

function buildFranchiseCard(franchise) {
  const card = document.createElement("article");
  card.className = "franchise-card";

  const logo = document.createElement("img");
  logo.className = "franchise-logo";
  logo.src = franchise.logo || "/images/logo/BFL_letters_white.svg";
  logo.alt = `${franchise.teamName || "Franchise"} logo`;

  const status = document.createElement("p");
  status.className = "franchise-status";
  status.textContent = franchise.status || "Franchise";

  const title = document.createElement("h3");
  title.textContent = franchise.teamName || "Pending Franchise";

  const owner = document.createElement("p");
  owner.className = "franchise-owner";
  owner.textContent = `Owner: ${franchise.ownerName || "Pending"}`;

  const stats = document.createElement("dl");
  stats.className = "franchise-stats";

  stats.append(
    buildStat("Record", franchise.record || "Season pending"),
    buildStat("Standing", franchise.standing || "Preseason"),
    buildStat("Roster", franchise.rosterStatus || "Draft pending"),
    buildStat("Titles", String(franchise.championships ?? 0))
  );

  card.append(logo, status, title, owner, stats);

  if (franchise.url) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = franchise.url;
    link.textContent = "View franchise page";
    card.appendChild(link);
  }

  return card;
}

function buildStat(labelText, valueText) {
  const wrapper = document.createElement("div");

  const label = document.createElement("dt");
  label.textContent = labelText;

  const value = document.createElement("dd");
  value.textContent = valueText;

  wrapper.append(label, value);

  return wrapper;
}

function renderEmptyState() {
  franchiseGrid.replaceChildren();

  const emptyCard = document.createElement("article");
  emptyCard.className = "franchise-card franchise-card-loading";
  emptyCard.textContent = "Franchise data will appear after owners join the league.";

  franchiseGrid.appendChild(emptyCard);
}

loadFranchises();