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
        el.className = `maps-phase-link${isCurrent ? " current" : ""}${phase.status !== "available" ? " planned" : ""}`;
        if (phase.status === "available") {
          el.href = phase.file;
        }
        el.innerHTML = `<strong>${phase.label}: ${phase.title}</strong><span>${phase.output}</span>`;
        nav.appendChild(el);
      });
    });
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
      }
      label.textContent = item.name;
      li.appendChild(label);
      if (item.note) {
        li.append(` ${item.note}`);
      }
      target.appendChild(li);
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
})();
