const appDetails = {
  "GAIN — Govern AI Now": {
    category: "Governance",
    copy: "A multi-tenant AI governance platform. Build your program from use-case intake through risk register, AI Impact Assessments, compliance checklists (NIST AI RMF, ISO 42001, EU AI Act, HIPAA, and more), and an append-only audit trail.",
    setup: "20 min",
    plan: "Pro — $100/mo",
    integrations: ["Google Workspace", "CSV"],
    output: "Governance program, audit trail",
  },
  "LeadLens Revenue Suite": {
    category: "Revenue bundle",
    copy: "A bundled revenue workflow for turning raw prospect lists into account briefs, buying-signal summaries, CRM notes, and first-touch outreach drafts.",
    setup: "12 min",
    plan: "Team",
    integrations: "HubSpot, Gmail",
    output: "Briefs, scores, emails",
  },
  LeadLens: {
    category: "Sales",
    copy: "Prospect research and outreach support for founders, sales teams, and consultants who need better account context before they write.",
    setup: "8 min",
    plan: "Solo",
    integrations: "Gmail, CSV",
    output: "Research briefs",
  },
  FlowDesk: {
    category: "Operations",
    copy: "Workflow automation for recurring operational tasks, with owner handoffs, alerts, and status notes your team can scan quickly.",
    setup: "15 min",
    plan: "Team",
    integrations: "Slack, API",
    output: "Workflow runs",
  },
  ClausePilot: {
    category: "Legal",
    copy: "Contract review assistance for summarizing agreements, extracting clauses, and producing structured notes for human review.",
    setup: "10 min",
    plan: "Team",
    integrations: "PDF, Docs",
    output: "Review notes",
  },
  ClipSmith: {
    category: "Content",
    copy: "Content repurposing for turning long recordings into summaries, social posts, newsletters, scripts, and clip outlines.",
    setup: "7 min",
    plan: "Solo",
    integrations: "Video, Docs",
    output: "Content drafts",
  },
  BriefForge: {
    category: "Research",
    copy: "Executive briefing from links, documents, transcripts, and market notes, built for fast decisions and repeatable research workflows.",
    setup: "6 min",
    plan: "Solo",
    integrations: "Docs, Web",
    output: "Briefs",
  },
  "Data Concierge": {
    category: "Analytics",
    copy: "Spreadsheet cleanup, row classification, anomaly explanation, and starter chart generation for messy business data.",
    setup: "9 min",
    plan: "Solo",
    integrations: "Sheets, CSV",
    output: "Clean data",
  },
  "Meeting Memory": {
    category: "Operations",
    copy: "Meeting follow-through for turning notes into decisions, owners, deadlines, and ready-to-send follow-up messages.",
    setup: "5 min",
    plan: "Solo",
    integrations: "Calendar, Gmail",
    output: "Action lists",
  },
  "Prompt Vault": {
    category: "Content",
    copy: "A shared prompt library for teams that want reusable examples, version notes, and practical quality scoring.",
    setup: "11 min",
    plan: "Team",
    integrations: "API, Teams",
    output: "Prompt systems",
  },
};

const cards = [...document.querySelectorAll(".app-card")];
const categoryButtons = [...document.querySelectorAll("[data-category]")];
const filters = [...document.querySelectorAll("[data-filter]")];
const resultCount = document.querySelector("[data-result-count]");
const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("#hero-search-input");
const resetButton = document.querySelector("[data-reset]");
const dialog = document.querySelector("[data-dialog]");

let activeCategory = "all";
let searchTerm = "";

function selectedFilters() {
  return filters.filter((filter) => filter.checked).map((filter) => filter.value);
}

function updateCatalog() {
  const required = selectedFilters();
  let visible = 0;

  cards.forEach((card) => {
    const cardCategory = card.dataset.category;
    const haystack = `${card.dataset.name} ${card.dataset.category} ${card.dataset.tags} ${card.textContent}`.toLowerCase();
    const categoryMatch = activeCategory === "all" || cardCategory === activeCategory;
    const searchMatch = !searchTerm || haystack.includes(searchTerm);
    const filterMatch = required.every((filter) => haystack.includes(filter));
    const show = categoryMatch && searchMatch && filterMatch;

    card.classList.toggle("is-hidden", !show);
    if (show) visible += 1;
  });

  resultCount.textContent = `Showing ${visible} app${visible === 1 ? "" : "s"}`;
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateCatalog();
    document.querySelector("#apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

filters.forEach((filter) => filter.addEventListener("change", updateCatalog));

resetButton?.addEventListener("click", () => {
  activeCategory = "all";
  searchTerm = "";
  searchInput.value = "";
  filters.forEach((filter) => {
    filter.checked = filter.value === "ready" || filter.value === "team";
  });
  categoryButtons.forEach((button) => button.classList.toggle("active", button.dataset.category === "all"));
  updateCatalog();
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim().toLowerCase();
  updateCatalog();
  document.querySelector("#apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = appDetails[button.dataset.detail];
    if (!detail || !dialog) return;

    dialog.querySelector("[data-dialog-category]").textContent = detail.category;
    dialog.querySelector("[data-dialog-title]").textContent = button.dataset.detail;
    dialog.querySelector("[data-dialog-copy]").textContent = detail.copy;
    dialog.querySelector("[data-dialog-setup]").textContent = detail.setup;
    dialog.querySelector("[data-dialog-plan]").textContent = detail.plan;
    dialog.querySelector("[data-dialog-integrations]").textContent = detail.integrations;
    dialog.querySelector("[data-dialog-output]").textContent = detail.output;
    dialog.showModal();
  });
});

document.querySelector("[data-close]")?.addEventListener("click", () => dialog?.close());
document.querySelector("[data-close-link]")?.addEventListener("click", () => dialog?.close());

updateCatalog();
