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
    const skill = site.resources.skills.find((item) => item.name === "/aps");
    if (!skill?.url) {
      return;
    }

    if (document.querySelector("[data-aps-download-button]")) {
      return;
    }

    const button = document.createElement("a");
    button.href = skill.url;
    button.download = "";
    button.className = "maps-aps-download-button";
    button.dataset.apsDownloadButton = "true";
    button.textContent = "Download /aps skill";
    document.body.appendChild(button);
    positionApsDownloadButton();
  }

  function balancePipelineRows() {
    if (window.matchMedia("(max-width: 640px)").matches) {
      document.querySelectorAll(".maps-pipeline-links > *").forEach((item) => {
        item.style.width = "";
      });
      return;
    }

    document.querySelectorAll(".maps-pipeline-group .maps-pipeline-links").forEach((links) => {
      const items = Array.from(links.children);
      items.forEach((item) => {
        item.style.width = "";
      });

      const rows = new Map();
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const rowKey = Math.round(rect.top);
        if (!rows.has(rowKey)) {
          rows.set(rowKey, []);
        }
        rows.get(rowKey).push({ item, width: rect.width, left: rect.left, right: rect.right });
      });

      const rowData = Array.from(rows.values()).map((rowItems) => ({
        items: rowItems,
        width: Math.max(...rowItems.map((entry) => entry.right)) - Math.min(...rowItems.map((entry) => entry.left))
      }));

      if (rowData.length < 2) {
        return;
      }

      const targetWidth = Math.max(...rowData.map((row) => row.width));
      rowData.forEach((row) => {
        const deficit = targetWidth - row.width;
        if (deficit <= 1) {
          return;
        }

        const extraPerItem = deficit / row.items.length;
        row.items.forEach((entry) => {
          entry.item.style.width = `${Math.ceil(entry.width + extraPerItem)}px`;
        });
      });
    });
  }

  function positionApsDownloadButton() {
    const button = document.querySelector(".maps-aps-download-button");
    const topbar = document.querySelector(".maps-topbar");
    const agentsLink = document.querySelector('.maps-links > a[href="agents.html"]');
    const multiAgent = document.querySelector(".maps-pipeline-group.multi-agent");
    const agentic = document.querySelector(".maps-pipeline-group.agentic");
    if (!button || !topbar) {
      return;
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
      document.documentElement.style.removeProperty("--maps-aps-button-left");
      document.documentElement.style.removeProperty("--maps-aps-button-top");
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const topbarRect = topbar.getBoundingClientRect();
    const agentsRect = agentsLink?.getBoundingClientRect();
    const multiRect = multiAgent?.getBoundingClientRect();
    const agenticRect = agentic?.getBoundingClientRect();

    const desiredCenterX = agentsRect ? agentsRect.left + agentsRect.width / 2 : topbarRect.left + 176;
    const desiredCenterY = multiRect && agenticRect
      ? (multiRect.bottom + agenticRect.top) / 2
      : topbarRect.top + topbarRect.height / 2;

    const left = Math.max(16, Math.min(window.innerWidth - buttonRect.width - 16, desiredCenterX - buttonRect.width / 2));
    const top = Math.max(16, desiredCenterY - buttonRect.height / 2);

    document.documentElement.style.setProperty("--maps-aps-button-left", `${Math.round(left)}px`);
    document.documentElement.style.setProperty("--maps-aps-button-top", `${Math.round(top)}px`);
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
  requestAnimationFrame(() => {
    balancePipelineRows();
    positionApsDownloadButton();
  });
  window.addEventListener("resize", () => {
    balancePipelineRows();
    positionApsDownloadButton();
  });
  window.addEventListener("load", () => {
    balancePipelineRows();
    positionApsDownloadButton();
  });
})();
