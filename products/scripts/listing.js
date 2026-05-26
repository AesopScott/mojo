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

    // Find matching card — read Polar price ID or external URL from it
    var card = document.querySelector('[data-name="' + appName + '"]');
    var subscribeLink = card ? card.querySelector('[data-polar-checkout]') : null;
    var polarPriceId = subscribeLink ? subscribeLink.getAttribute('data-polar-checkout') : '';
    var externalUrl = card ? (card.getAttribute('data-external-url') || '') : '';

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

    // Wire the dialog action button: external URL (live product) > real Polar ID > placeholder
    var dialogCheckout = dialog.querySelector('[data-dialog-polar-checkout]');
    if (dialogCheckout) {
      // Reset any state from previous dialog open
      dialogCheckout.removeAttribute('data-polar-checkout');
      dialogCheckout.removeAttribute('target');
      dialogCheckout.removeAttribute('rel');
      dialogCheckout.setAttribute('href', '#');

      if (externalUrl) {
        // Live product — link directly to its own site
        dialogCheckout.setAttribute('href', externalUrl);
        dialogCheckout.setAttribute('target', '_blank');
        dialogCheckout.setAttribute('rel', 'noopener');
        dialogCheckout.removeAttribute('aria-disabled');
        dialogCheckout.removeAttribute('title');
        dialogCheckout.textContent = 'Get Started Free';
      } else if (polarPriceId && !isPlaceholderId(polarPriceId)) {
        // Live Polar price ID — wire to Polar checkout
        dialogCheckout.setAttribute('data-polar-checkout', polarPriceId);
        dialogCheckout.removeAttribute('aria-disabled');
        dialogCheckout.removeAttribute('title');
        dialogCheckout.textContent = 'Subscribe';
      } else {
        // Placeholder — disable until Polar is configured
        dialogCheckout.setAttribute('aria-disabled', 'true');
        dialogCheckout.setAttribute('title', 'Coming soon — not yet available');
        dialogCheckout.textContent = 'Coming soon';
      }
    }

    dialog.showModal();
  }

  /** ── Placeholder guard ── */

  /**
   * Detect any [data-polar-checkout] element that still holds a placeholder value
   * (i.e. the string starts with "POLAR_"). Mark it aria-disabled so the Polar SDK
   * never receives the call, prevent the default link/button action, and show a
   * "Coming soon" tooltip. Also skips wiring the dialog Subscribe link when the
   * resolved price ID is a placeholder.
   */
  function isPlaceholderId(id) {
    return !id || id.indexOf('POLAR_') === 0;
  }

  function guardPlaceholderCheckout() {
    document.querySelectorAll('[data-polar-checkout]').forEach(function (el) {
      if (!isPlaceholderId(el.getAttribute('data-polar-checkout'))) { return; }
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('title', 'Coming soon — not yet available');
      // Relabel the button so users see "Coming soon" rather than a silent non-action.
      // Preserve any price suffix, e.g. "Subscribe — $149/mo" → "Coming soon — $149/mo".
      var text = el.textContent || '';
      var priceSuffix = text.match(/—\s*\$[\d,.]+\/\w+/);
      el.textContent = 'Coming soon' + (priceSuffix ? ' ' + priceSuffix[0] : '');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  /** ── Init ── */

  function init() {
    bindCategoryButtons();
    bindFilterCheckboxes();
    bindSearchForm();
    bindDetailButtons();
    guardPlaceholderCheckout();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
