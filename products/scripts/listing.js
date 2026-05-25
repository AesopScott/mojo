/**
 * listing.js — Category filtering, search, and app detail dialog for the products page.
 *
 * Depends on: mockups.js (window.appDetails), cart.js (window.MojoCart)
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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="search"]');
      searchQuery = input ? input.value.trim().toLowerCase() : '';
      applyFilters();
    });

    var input = form ? form.querySelector('input[type="search"]') : null;
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
    var description = (card.querySelector('p') ? card.querySelector('p').textContent : '').toLowerCase();

    if (activeCategory !== 'all' && category !== activeCategory) { return false; }

    if (activeFilters.length > 0) {
      var hasAllFilters = activeFilters.every(function (f) { return tags.includes(f); });
      if (!hasAllFilters) { return false; }
    }

    if (searchQuery) {
      var matchesSearch = name.includes(searchQuery) || description.includes(searchQuery) || tags.some(function (t) { return t.includes(searchQuery); });
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
        var appName = btn.getAttribute('data-detail');
        openDialog(appName);
      });
    });

    var closeBtn = dialog.querySelector('[data-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { dialog.close(); });
    }

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) { dialog.close(); }
    });
  }

  function openDialog(appName) {
    var dialog = document.querySelector('[data-dialog]');
    if (!dialog) { return; }

    var details = window.appDetails && window.appDetails[appName];
    if (!details) { return; }

    // Find the app card to get price and id
    var card = document.querySelector('[data-name="' + appName + '"]');
    var priceText = card ? (card.querySelector('footer b') || { textContent: '' }).textContent : '';
    var price = priceText.replace(/[^0-9]/g, '');
    var productId = card ? (card.getAttribute('data-add-to-cart') || appName.toLowerCase().replace(/\s+/g, '')) : '';

    var titleEl = dialog.querySelector('[data-dialog-title]');
    var categoryEl = dialog.querySelector('[data-dialog-category]');
    var copyEl = dialog.querySelector('[data-dialog-copy]');
    var setupEl = dialog.querySelector('[data-dialog-setup]');
    var planEl = dialog.querySelector('[data-dialog-plan]');
    var integrationsEl = dialog.querySelector('[data-dialog-integrations]');
    var outputEl = dialog.querySelector('[data-dialog-output]');
    var addToCartBtn = dialog.querySelector('[data-dialog-add-to-cart]');

    if (titleEl) { titleEl.textContent = appName; }
    if (categoryEl) { categoryEl.textContent = details.category || 'Mojo app'; }
    if (copyEl) { copyEl.textContent = details.copy || ''; }
    if (setupEl) { setupEl.textContent = details.setup || '—'; }
    if (planEl) { planEl.textContent = details.plan || '—'; }
    if (integrationsEl) { integrationsEl.textContent = (details.integrations || []).join(', ') || '—'; }
    if (outputEl) { outputEl.textContent = details.output || '—'; }

    if (addToCartBtn) {
      addToCartBtn.setAttribute('data-product-id', productId);
      addToCartBtn.setAttribute('data-product-name', appName);
      addToCartBtn.setAttribute('data-product-price', price);
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
