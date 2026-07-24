(function () {
  const tabs = Array.from(document.querySelectorAll("[data-tab-button]"));
  const modules = Array.from(document.querySelectorAll("[data-module]"));
  const visited = new Set(["overview"]);
  const progressBar = document.querySelector("[data-progress-bar]");
  const progressText = document.querySelector("[data-progress-text]");
  const toast = document.querySelector("[data-toast]");
  let riskTier = "Moderate impact";

  const pillars = [
    {
      title: "Public Transparency and Stakeholder Engagement",
      summary:
        "Students should be able to explain where AI is used, what it does, who is affected, and how people can seek help or give feedback.",
      evidence: ["public notice", "plain-language explanation", "feedback channel", "appeal or correction path"],
    },
    {
      title: "Accuracy and Reliability",
      summary:
        "Developers need test cases, evaluation records, performance thresholds, human review rules, and monitoring after release.",
      evidence: ["evaluation set", "acceptance threshold", "human review", "drift monitoring"],
    },
    {
      title: "Governance and Coordination",
      summary:
        "A project should have a known owner, review route, release gate, procurement checkpoint, and incident escalation path.",
      evidence: ["AI inventory", "review board", "change log", "incident owner"],
    },
    {
      title: "Privacy and Security",
      summary:
        "The team should know what data the system touches, how it is protected, how long it is retained, and what the vendor can do with it.",
      evidence: ["data map", "security review", "retention rule", "access control"],
    },
    {
      title: "Safety, Rights, and Legal Compliance",
      summary:
        "High-impact uses need special attention to rights, accessibility, bias, public benefit access, enforcement, and legal constraints.",
      evidence: ["impact assessment", "bias testing", "legal signoff", "redress workflow"],
    },
  ];

  function updateProgress() {
    const percent = Math.round((visited.size / tabs.length) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressText) progressText.textContent = String(percent);
    tabs.forEach((tab) => {
      tab.classList.toggle("visited", visited.has(tab.dataset.tabButton));
    });
  }

  function showTab(id) {
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tabButton === id));
    modules.forEach((module) => {
      const active = module.id === id;
      module.classList.toggle("active", active);
      module.hidden = !active;
    });
    visited.add(id);
    updateProgress();
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function renderPillar(index) {
    const detail = document.querySelector("[data-pillar-detail]");
    if (!detail) return;
    const pillar = pillars[index] || pillars[0];
    detail.innerHTML = `
      <h3>${escapeHtml(pillar.title)}</h3>
      <p>${escapeHtml(pillar.summary)}</p>
      <div class="tag-row">
        ${pillar.evidence.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    `;
    document.querySelectorAll("[data-pillar]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.pillar) === index);
    });
  }

  function updateStackMeter() {
    const checks = Array.from(document.querySelectorAll(".stack-list input"));
    const checked = checks.filter((input) => input.checked).length;
    const percent = checks.length ? Math.round((checked / checks.length) * 100) : 0;
    const meter = document.querySelector("[data-stack-meter]");
    const count = document.querySelector("[data-stack-count]");
    if (meter) meter.style.width = percent + "%";
    if (count) count.textContent = String(checked);
  }

  function worksheetText() {
    const answers = Array.from(document.querySelectorAll("[data-worksheet]"))
      .map((field) => {
        const question = field.dataset.worksheet;
        const answer = field.value.trim() || "[answer]";
        return `${question}\n${answer}`;
      })
      .join("\n\n");

    return [
      "AI Governance for Developers workshop worksheet",
      "GAIN focus: record the use case, risk tier, controls, evidence, and monitoring plan in Govern AI Now.",
      "Scenario: A city wants to deploy an AI assistant to help residents understand permit requirements and draft application materials.",
      `Risk tier: ${riskTier}`,
      "",
      answers,
    ].join("\n");
  }

  function copyText(text, label) {
    if (!navigator.clipboard) {
      showToast("Clipboard is not available");
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(label))
      .catch(() => showToast("Copy failed"));
  }

  function downloadWorksheet() {
    const blob = new Blob([worksheetText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-governance-developers-gain-worksheet.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Worksheet downloaded");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tabButton));
  });

  document.querySelectorAll("[data-pillar]").forEach((button) => {
    button.addEventListener("click", () => renderPillar(Number(button.dataset.pillar)));
  });

  document.querySelectorAll(".stack-list input").forEach((input) => {
    input.addEventListener("change", updateStackMeter);
  });

  document.querySelectorAll("[data-risk]").forEach((button) => {
    button.addEventListener("click", () => {
      riskTier = button.dataset.risk || riskTier;
      document.querySelectorAll("[data-risk]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  const copyWorksheet = document.querySelector("[data-copy-worksheet]");
  if (copyWorksheet) {
    copyWorksheet.addEventListener("click", () => copyText(worksheetText(), "Worksheet copied"));
  }

  const downloadButton = document.querySelector("[data-download-worksheet]");
  if (downloadButton) {
    downloadButton.addEventListener("click", downloadWorksheet);
  }

  document.querySelectorAll("[data-template-card]").forEach((card) => {
    const button = card.querySelector("button");
    if (!button) return;
    button.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "Template card";
      const template = card.querySelector("[data-template-text]")?.textContent.trim();
      if (!template) {
        showToast("Template text missing");
        return;
      }
      copyText(template, `${title} copied`);
    });
  });

  renderPillar(0);
  updateStackMeter();
  updateProgress();
})();
