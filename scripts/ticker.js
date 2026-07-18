const tickerRoot = document.querySelector("[data-ticker]");
const tickerTrack = document.querySelector("[data-ticker-track]");

async function loadTicker() {
  if (!tickerRoot || !tickerTrack) {
    return;
  }

  try {
    const response = await fetch("/data/ticker.json");

    if (!response.ok) {
      throw new Error("Ticker data could not be loaded.");
    }

    const items = await response.json();
    const activeItems = items.filter((item) => item.active !== false);

    if (!activeItems.length) {
      tickerRoot.hidden = true;
      return;
    }

    const group = buildTickerGroup(activeItems);
    const duplicateGroup = group.cloneNode(true);

    duplicateGroup.setAttribute("aria-hidden", "true");
    duplicateGroup.querySelectorAll("a").forEach((link) => {
      link.tabIndex = -1;
    });

    tickerTrack.replaceChildren(group, duplicateGroup);

    const duration = Math.max(28, activeItems.length * 8);
    tickerTrack.style.setProperty("--ticker-duration", `${duration}s`);
  } catch {
    tickerTrack.replaceChildren();
    tickerRoot.hidden = true;
  }
}

function buildTickerGroup(items) {
  const group = document.createElement("div");
  group.className = "ticker-group";

  items.forEach((item) => {
    const tickerItem = item.url
      ? document.createElement("a")
      : document.createElement("span");

    tickerItem.className = "ticker-item";

    if (item.url) {
      tickerItem.href = item.url;

      if (item.url.startsWith("http")) {
        tickerItem.target = "_blank";
        tickerItem.rel = "noopener";
      }
    }

    const label = document.createElement("span");
    label.className = "ticker-item-label";
    label.textContent = item.label;

    const text = document.createElement("span");
    text.className = "ticker-item-text";
    text.textContent = item.text;

    tickerItem.append(label, text);
    group.appendChild(tickerItem);
  });

  return group;
}

loadTicker();