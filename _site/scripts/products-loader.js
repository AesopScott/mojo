/**
 * products-loader.js — Load marketplace products from Firestore
 *
 * Loads published products (status=live) from Firestore collection
 * and renders them in the marketplace with filtering by category/tags
 */

(function () {
  let db = null;
  let allProducts = [];

  // DOM Elements
  const appGrid = document.querySelector('[data-app-grid]');
  const categoryButtons = document.querySelectorAll('[data-category]');
  const filterCheckboxes = document.querySelectorAll('[data-filter]');
  const resetBtn = document.querySelector('[data-reset]');
  const resultCount = document.querySelector('[data-result-count]');

  if (!appGrid) {
    console.log('[products-loader] No app grid found, skipping');
    return;
  }

  // Initialize Firebase
  try {
    db = firebase.firestore();
  } catch (err) {
    console.error('[products-loader] Firebase not initialized:', err);
    return;
  }

  // Load products on page load
  loadProducts();

  // Set up event listeners
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', filterProducts);
  });

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
  });

  resetBtn?.addEventListener('click', resetFilters);

  async function loadProducts() {
    try {
      const snapshot = await db
        .collection('products')
        .where('status', '==', 'live')
        .orderBy('featured', 'desc')
        .orderBy('createdAt', 'desc')
        .get();

      allProducts = [];
      snapshot.forEach(doc => {
        allProducts.push({ id: doc.id, ...doc.data() });
      });

      // Clear existing hardcoded cards (keep first few for branding)
      const existingCards = appGrid.querySelectorAll('[data-name]');
      existingCards.forEach((card, idx) => {
        // Keep first 2 hardcoded cards if they're Mojo products
        if (idx >= 2) {
          card.remove();
        }
      });

      filterProducts();
    } catch (err) {
      console.error('[products-loader] loadProducts error:', err);
    }
  }

  function filterProducts() {
    const activeCategory = document.querySelector('[data-category].active')?.dataset.category || 'all';
    const activeTags = Array.from(filterCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    let filtered = allProducts;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by tags
    if (activeTags.length > 0) {
      filtered = filtered.filter(p => {
        const productTags = p.tags || [];
        return activeTags.some(tag => productTags.includes(tag));
      });
    }

    renderProducts(filtered);
  }

  function renderProducts(products) {
    // Remove previously rendered products (keep hardcoded ones)
    const renderedCards = appGrid.querySelectorAll('[data-firestore-product]');
    renderedCards.forEach(card => card.remove());

    products.forEach(product => {
      const card = createProductCard(product);
      appGrid.appendChild(card);
    });

    // Update result count
    const total = appGrid.querySelectorAll('[data-name]').length;
    if (resultCount) {
      resultCount.textContent = `Showing ${total} app${total !== 1 ? 's' : ''}`;
    }
  }

  function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'app-card app-card--live';
    card.setAttribute('data-firestore-product', product.id);
    card.setAttribute('data-category', product.category || 'other');
    card.setAttribute('data-tags', (product.tags || []).join(' '));
    card.setAttribute('data-name', product.name);

    const iconColor = product.iconColor || 'blue';
    const iconLetter = product.iconLetter || String(product.name || '?').charAt(0).toUpperCase();
    const imageUrl = safeUrl(product.imageUrl || product.screenshotUrl || '');
    const logoUrl = safeUrl(product.logoUrl || '');
    const price = product.price ? `$${(product.price / 100).toFixed(0)}/mo` : 'Custom';
    const sellerName = product.sellerId ? `by ${product.sellerId.split('@')[0]}` : 'by Mojo';

    card.innerHTML = `
      ${imageUrl ? `<div class="app-image"><img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(product.name || 'Product')} screenshot" loading="lazy"></div>` : ''}
      <div class="app-card-header">
        ${logoUrl ? `<img class="app-logo" src="${escapeAttribute(logoUrl)}" alt="${escapeAttribute(product.name || 'Product')} logo" loading="lazy">` : `<div class="app-icon ${escapeAttribute(iconColor)}">${escapeHtml(iconLetter)}</div>`}
        <span>${escapeHtml(product.category || 'Tools')} ${product.featured ? '<span class="pill pill--live">Featured</span>' : ''}</span>
      </div>
      <h3>${escapeHtml(product.name || 'Untitled product')}</h3>
      <p>${escapeHtml(product.description || '')}</p>
      <div class="meta-row">
        <small>${escapeHtml(sellerName)}</small>
        ${product.integrations && product.integrations.length > 0 ? product.integrations.slice(0, 2).map(i => `<small>${escapeHtml(i)}</small>`).join('') : ''}
      </div>
      <footer>
        <b>${escapeHtml(price)}</b>
        <div class="card-actions">
          ${safeUrl(product.externalUrl) ? `<a class="button dark" href="${escapeAttribute(safeUrl(product.externalUrl))}" target="_blank" rel="noopener">Learn More</a>` : '<button type="button" disabled>Coming Soon</button>'}
        </div>
      </footer>
    `;

    return card;
  }

  function resetFilters() {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    categoryButtons[0].classList.add('active');

    filterCheckboxes.forEach(checkbox => {
      checkbox.checked = checkbox.dataset.default !== undefined;
    });

    filterProducts();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function safeUrl(value) {
    try {
      const url = new URL(String(value || '').trim());
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }
}());
