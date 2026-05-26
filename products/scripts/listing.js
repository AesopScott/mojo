/**
 * listing.js — Category filtering, search, and GAIN plan-selector dialog.
 *
 * Depends on: mockups.js (window.gainPlans)
 */

(function () {
  var activeCategory = 'all';
  var activeFilters = ['ready', 'team'];
  var searchQuery = '';

  /** ── Category bar ── */

  function bindCategoryButtons() {
    var bar = document.querySelector('.category-bar');
    if (!bar) { return; }

    bar.querySelectorAll('[data-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('[data-category]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        applyFilters();
      });
    });
  }

  /** ── Checkbox filters ── */

  function bindFilterCheckboxes() {
    document.querySelectorAll('[data-filter]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (cb.checked) {
          if (!activeFilters.includes(cb.value)) {
            activeFilters = activeFilters.concat([cb.value]);
          }
        } else {
          activeFilters = activeFilters.filter(function (f) { return f !== cb.value; });
        }
        applyFilters();
      });
    });

    var resetBtn = document.querySelector('[data-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeFilters = [];
        document.querySelectorAll('[data-filter]').forEach(function (cb) { cb.checked = false; });
        applyFilters();
      });
    }
  }

  /** ── Search form ── */

  function bindSearchForm() {
    var form = document.querySelector('[data-search-form]');
    if (!form) { return; }
    var input = form.querySelector('input[type="search"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      searchQuery = input ? input.value.trim().toLowerCase() : '';
      applyFilters();
    });

    if (input) {
      input.addEventListener('input', function () {
        searchQuery = input.value.trim().toLowerCase();
        applyFilters();
      });
    }
  }

  /** ── Filter logic ── */

  function matchesFilters(card) {
    var category = card.getAttribute('data-category');
    var tags = (card.getAttribute('data-tags') || '').split(' ');
    var name = (card.getAttribute('data-name') || '').toLowerCase();
    var descEl = card.querySelector('p');
    var description = descEl ? descEl.textContent.toLowerCase() : '';

    if (activeCategory !== 'all' && category !== activeCategory) { return false; }

    if (activeFilters.length > 0) {
      var hasAllFilters = activeFilters.every(function (f) { return tags.includes(f); });
      if (!hasAllFilters) { return false; }
    }

    if (searchQuery) {
      var matchesSearch = name.includes(searchQuery)
        || description.includes(searchQuery)
        || tags.some(function (t) { return t.includes(searchQuery); });
      if (!matchesSearch) { return false; }
    }

    return true;
  }

  function applyFilters() {
    var cards = document.querySelectorAll('[data-app-grid] .app-card');
    var visible = 0;

    cards.forEach(function (card) {
      if (matchesFilters(card)) {
        card.classList.remove('is-hidden');
        visible++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    var countEl = document.querySelector('[data-result-count]');
    if (countEl) {
      countEl.textContent = 'Showing ' + visible + ' app' + (visible !== 1 ? 's' : '');
    }
  }

  /** ── GAIN plan-selector dialog ── */

  var gainDialog = null;
  var gainPlans = window.gainPlans || [];
  var activePlanId = 'business'; // default to most popular

  function renderPlanFeatures(planId) {
    var plan = gainPlans.find(function (p) { return p.id === planId; });
    var list = gainDialog && gainDialog.querySelector('[data-gain-features]');
    var cta = gainDialog && gainDialog.querySelector('[data-gain-trial-cta]');

    if (!plan || !list) { return; }

    list.innerHTML = plan.features.map(function (f) {
      return '<li>' + escapeHtml(f) + '</li>';
    }).join('');

    if (cta) {
      cta.setAttribute('href', plan.url);
    }
  }

  function selectPlanTab(planId) {
    activePlanId = planId;

    gainDialog.querySelectorAll('.plan-tab').forEach(function (tab) {
      var isActive = tab.getAttribute('data-plan') === planId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderPlanFeatures(planId);
  }

  function openGainDialog() {
    if (!gainDialog) { return; }

    // Start on Business (most popular) each time
    selectPlanTab('business');
    gainDialog.showModal();
  }

  function bindGainDialog() {
    gainDialog = document.querySelector('[data-gain-dialog]');
    if (!gainDialog) { return; }

    // Open: "Compare plans" button on the GAIN card
    document.querySelectorAll('[data-gain-details]').forEach(function (btn) {
      btn.addEventListener('click', openGainDialog);
    });

    // Plan tabs
    gainDialog.querySelectorAll('.plan-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        selectPlanTab(tab.getAttribute('data-plan'));
      });
    });

    // Close button
    var closeBtn = gainDialog.querySelector('[data-gain-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { gainDialog.close(); });
    }

    // Backdrop click
    gainDialog.addEventListener('click', function (e) {
      if (e.target === gainDialog) { gainDialog.close(); }
    });
  }

  /** ── Utility ── */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** ── Init ── */

  function init() {
    bindCategoryButtons();
    bindFilterCheckboxes();
    bindSearchForm();
    bindGainDialog();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
