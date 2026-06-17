(function () {
  const site = window.MAPS_SITE;

  if (!site) {
    return;
  }

  function renderPhaseNav() {
    const navs = document.querySelectorAll("[data-maps-phase-nav]");
    navs.forEach((nav) => {
      const current = nav.getAttribute("data-current-phase");
      nav.innerHTML = "";
      site.phases.forEach((phase) => {
        const isCurrent = phase.number === current;
        const el = document.createElement(phase.status === "available" ? "a" : "span");
        el.className = `maps-phase-link${isCurrent ? " current" : ""}${phase.status !== "available" ? " under-construction" : ""}`;
        if (phase.status === "available") {
          el.href = phase.file;
        }
        const statusLabel = phase.status === "available" ? "" : `<em>Under construction</em>`;
        el.innerHTML = `<strong>${phase.label}: ${phase.title}</strong><span>${phase.output}</span>${statusLabel}`;
        nav.appendChild(el);
      });
    });
  }

  function githubRepoPath(url) {
    const match = String(url || "").match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)/);
    return match ? match[1] : "";
  }

  function starHistoryUrl(url) {
    const repo = githubRepoPath(url);
    return repo ? `https://star-history.com/#${repo}&Date` : "";
  }

  function createStarHistoryLink(url) {
    const href = starHistoryUrl(url);
    if (!href) {
      return null;
    }

    const link = document.createElement("a");
    link.className = "maps-star-history";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Star history";
    return link;
  }

  function renderResourceGroup(selector, items) {
    const target = document.querySelector(selector);
    if (!target) {
      return;
    }
    target.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      const label = item.url ? document.createElement("a") : document.createElement("strong");
      if (item.url) {
        label.href = item.url;
        if (item.download) {
          label.setAttribute("download", "");
          label.classList.add("maps-download-link");
        } else {
          label.target = "_blank";
          label.rel = "noopener noreferrer";
        }
      }
      label.textContent = item.name;
      li.appendChild(label);
      if (item.note) {
        li.append(` ${item.note}`);
      }
      if (!item.download) {
        const starLink = createStarHistoryLink(item.url);
        if (starLink) {
          li.append(" ");
          li.appendChild(starLink);
        }
      }
      target.appendChild(li);
    });
  }

  function enhanceReferenceCards() {
    document.querySelectorAll(".maps-reference-card h3 a[href^='https://github.com/']").forEach((repoLink) => {
      const card = repoLink.closest(".maps-reference-card");
      if (!card || card.querySelector(".maps-star-history")) {
        return;
      }

      const starLink = createStarHistoryLink(repoLink.href);
      if (!starLink) {
        return;
      }

      repoLink.closest("h3").insertAdjacentElement("afterend", starLink);
    });
  }

  function enhanceInlineGithubLinks() {
    document.querySelectorAll(".maps-main a[href^='https://github.com/'], .maps-hero a[href^='https://github.com/']").forEach((repoLink) => {
      if (
        repoLink.closest("[data-maps-repos]") ||
        repoLink.closest(".maps-reference-card h3") ||
        repoLink.nextElementSibling?.classList?.contains("maps-star-history")
      ) {
        return;
      }

      const starLink = createStarHistoryLink(repoLink.href);
      if (!starLink) {
        return;
      }

      repoLink.insertAdjacentText("afterend", " ");
      repoLink.insertAdjacentElement("afterend", starLink);
    });
  }

  function renderResources() {
    const current = document.body.getAttribute("data-maps-phase");
    const phaseResources = current ? site.phaseResources?.[current] : null;
    const byName = (items, names) => (names || []).map((name) => items.find((item) => item.name === name)).filter(Boolean);

    renderResourceGroup("[data-maps-skills]", phaseResources ? byName(site.resources.skills, phaseResources.skills) : site.resources.skills);
    renderResourceGroup("[data-maps-repos]", phaseResources ? byName(site.resources.repos, phaseResources.repos) : site.resources.repos);
    renderResourceGroup("[data-maps-tools]", phaseResources ? byName(site.resources.tools, phaseResources.tools) : site.resources.tools);
    renderResourceGroup("[data-maps-templates]", phaseResources ? byName(site.resources.templates, phaseResources.templates) : site.resources.templates);
    renderResourceGroup("[data-maps-catalogs]", phaseResources ? byName(site.resources.catalogs, phaseResources.catalogs) : site.resources.catalogs);
  }

  renderPhaseNav();
  renderResources();
  enhanceReferenceCards();
  enhanceInlineGithubLinks();
})();
