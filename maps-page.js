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
        el.className = `maps-phase-link${phase.kind === "lab" ? " lab" : ""}${isCurrent ? " current" : ""}${phase.status !== "available" ? " under-construction" : ""}`;
        if (phase.status === "available") {
          el.href = phase.file;
        }
        const statusLabel = phase.status === "available" ? "" : `<em>${phase.statusLabel || "Under construction"}</em>`;
        el.innerHTML = `<strong>${phase.label}: ${phase.title}</strong><span>${phase.output}</span>${statusLabel}`;
        nav.appendChild(el);
      });
    });
  }

  function highlightCurrentPipelinePhase() {
    const current = document.body.getAttribute("data-maps-phase");
    const phase = current ? site.phases.find((item) => item.number === current) : null;
    if (!phase?.file) {
      return;
    }

    document.querySelectorAll(`.maps-pipeline-links a[href="${phase.file}"]`).forEach((link) => {
      link.classList.add("current");
      link.setAttribute("aria-current", "page");
    });
  }

  function renderLabPills() {
    const labs = site.phases.filter((phase) => phase.kind === "lab" && phase.status === "available");
    if (!labs.length) {
      return;
    }

    document.querySelectorAll(".maps-pipeline-group.agentic .maps-pipeline-links").forEach((links) => {
      if (links.querySelector("[data-maps-lab-pill]")) {
        return;
      }

      const current = document.body.getAttribute("data-maps-phase");
      labs.forEach((lab) => {
        const pill = document.createElement("a");
        pill.href = lab.file;
        pill.className = `maps-lab-pill${lab.number === current ? " current" : ""}`;
        pill.dataset.mapsLabPill = lab.number;
        if (lab.number === current) {
          pill.setAttribute("aria-current", "page");
        }
        pill.textContent = `${lab.label} ${lab.title}`;
        links.appendChild(pill);
      });
    });
  }

  function renderApsDownloadButton() {
    const skill = site.resources.skills.find((item) => item.name === "Aps/");
    if (!skill?.url) {
      return;
    }

    document.querySelectorAll(".maps-links").forEach((links) => {
      if (links.querySelector("[data-aps-download-button]")) {
        return;
      }

      const agentsLink = Array.from(links.querySelectorAll("a")).find((link) => link.getAttribute("href") === "agents.html");
      if (!agentsLink) {
        return;
      }

      const button = document.createElement("a");
      button.href = skill.url;
      button.download = "";
      button.className = "maps-aps-download-button";
      button.dataset.apsDownloadButton = "true";
      button.textContent = "Download Aps/ skill";
      agentsLink.insertAdjacentElement("afterend", button);
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
  }

  function buildReferenceList(category, names) {
    const items = names
      .map((name) => site.resources[category].find((item) => item.name === name))
      .filter(Boolean);

    if (!items.length) {
      return "";
    }

    const label = {
      skills: "Skills",
      repos: "Repos",
      tools: "Tools",
      templates: "Templates"
    }[category];

    const listItems = items.map((item) => {
      const attrs = [];
      if (item.url) {
        attrs.push(`href="${item.url}"`);
        if (item.download) {
          attrs.push("download");
          attrs.push('class="maps-download-link"');
        } else {
          attrs.push('target="_blank"');
          attrs.push('rel="noopener noreferrer"');
        }
      }
      const title = item.url ? `<a ${attrs.join(" ")}>${item.name}</a>` : `<strong>${item.name}</strong>`;
      return `<li>${title}${item.note ? ` <span>${item.note}</span>` : ""}</li>`;
    }).join("");

    return `<div class="maps-reference-column"><h3>${label}</h3><ul>${listItems}</ul></div>`;
  }

  function renderReferencePhases() {
    const target = document.querySelector("[data-maps-reference-phases]");
    if (!target) {
      return;
    }

    target.innerHTML = "";
    site.phases.forEach((phase) => {
      const resources = site.phaseResources?.[phase.number];
      if (!resources) {
        return;
      }

      const section = document.createElement("article");
      section.className = "maps-reference-phase";
      section.id = `phase-${phase.number}`;
      section.innerHTML = `
        <header>
          <p class="maps-layer-kicker">${phase.label}</p>
          <h2>${phase.title}</h2>
          <p>${phase.output}</p>
        </header>
        <div class="maps-reference-columns">
          ${buildReferenceList("skills", resources.skills || [])}
          ${buildReferenceList("repos", resources.repos || [])}
          ${buildReferenceList("tools", resources.tools || [])}
          ${buildReferenceList("templates", resources.templates || [])}
        </div>
      `;
      target.appendChild(section);
    });
  }

  highlightCurrentPipelinePhase();
  renderLabPills();
  renderApsDownloadButton();
  renderPhaseNav();
  renderResources();
  renderReferencePhases();
})();
