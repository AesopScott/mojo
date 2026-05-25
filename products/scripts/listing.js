/**
 * listing.js — Category filtering, search, and app detail dialog for the products page.
 *
 * Depends on: mockups.js (window.appDetails)
 * Checkout: handled by Polar.sh SDK via [data-polar-checkout] attributes on links/buttons.
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

  /** ── App detail dialog ── */

  function bindDetailButtons() {
    var dialog = document.querySelector('[data-dialog]');
    if (!dialog) { return; }

    document.querySelectorAll('[data-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog(btn.getAttribute('data-detail'));
      });
    });

    var closeBtn = dialog.querySelector('[data-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { dialog.close(); });
    }

    // Close on backdrop click
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) { dialog.close(); }
    });
  }

  function openDialog(appName) {
    var dialog = document.querySelector('[data-dialog]');
    if (!dialog) { return; }

    var details = window.appDetails && window.appDetails[appName];
    if (!details) { return; }

    // Find matching card to read Polar price ID from the subscribe link
    var card = document.querySelector('[data-name="' + appName + '"]');
    var subscribeLink = card ? card.querySelector('[data-polar-checkout]') : null;
    var polarPriceId = subscribeLink ? subscribeLink.getAttribute('data-polar-checkout') : '';

    // Populate dialog fields
    var set = function (sel, val) {
      var el = dialog.querySelector(sel);
      if (el) { el.textContent = val; }
    };

    set('[data-dialog-title]', appName);
    set('[data-dialog-category]', details.category || 'Mojo app');
    set('[data-dialog-copy]', details.copy || '');
    set('[data-dialog-setup]', details.setup || '—');
    set('[data-dialog-plan]', details.plan || '—');
    set('[data-dialog-integrations]', (details.integrations || []).join(', ') || '—');
    set('[data-dialog-output]', details.output || '—');

    // Wire the dialog Subscribe link to the same Polar price ID as the card
    var dialogCheckout = dialog.querySelector('[data-dialog-polar-checkout]');
    if (dialogCheckout && polarPriceId) {
      dialogCheckout.setAttribute('data-polar-checkout', polarPriceId);
    }

    dialog.showModal();
  }

  /** ── Init ── */

  function init() {
    bindCategoryButtons();
    bindFilterCheckboxes();
    bindSearchForm();
    bindDetailButtons();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
