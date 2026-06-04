/**
 * admin-products.js — Admin dashboard for managing product listings
 *
 * Features:
 * - Admin key authentication
 * - View pending products for review
 * - Approve products and set pricing
 * - View published products
 * - Archive products
 */

(function () {
  let db = null;
  let adminKey = null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const adminKeyInput = document.getElementById('admin-key');
  const logoutBtn = document.getElementById('logout-btn');
  const tabs = document.querySelectorAll('.tab');
  const message = document.getElementById('message');

  try {
    db = firebase.firestore();
  } catch (err) {
    console.error('[admin-products] Firebase not initialized:', err);
  }

  // Check if logged in
  const savedKey = sessionStorage.getItem('adminKey');
  if (savedKey) {
    adminKey = savedKey;
    showDashboard();
  } else {
    showLogin();
  }

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const key = adminKeyInput.value.trim();
    if (!key) {
      showMessage('Please enter admin key', 'error');
      return;
    }

    adminKey = key;
    sessionStorage.setItem('adminKey', key);
    showDashboard();
  });

  logoutBtn.addEventListener('click', function () {
    adminKey = null;
    sessionStorage.removeItem('adminKey');
    showLogin();
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');

      if (this.dataset.tab === 'pending') {
        loadPendingProducts();
      } else {
        loadLiveProducts();
      }
    });
  });

  async function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    await loadPendingProducts();
  }

  function showLogin() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    adminKeyInput.value = '';
  }

  async function loadPendingProducts() {
    try {
      const container = document.getElementById('pending-products');
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">Loading...</p>';

      const snapshot = await db
        .collection('products')
        .where('status', '==', 'pending_review')
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        container.innerHTML = '<div class="empty-state"><p>No pending products</p></div>';
        return;
      }

      container.innerHTML = '';
      snapshot.forEach(doc => {
        const product = doc.data();
        const card = createPendingCard(doc.id, product);
        container.appendChild(card);
      });
    } catch (err) {
      console.error('[admin-products] loadPendingProducts error:', err);
      showMessage('Error loading products', 'error');
    }
  }

  async function loadLiveProducts() {
    try {
      const container = document.getElementById('live-products');
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">Loading...</p>';

      const snapshot = await db
        .collection('products')
        .where('status', '==', 'live')
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        container.innerHTML = '<div class="empty-state"><p>No published products</p></div>';
        return;
      }

      container.innerHTML = '';
      snapshot.forEach(doc => {
        const product = doc.data();
        const card = createLiveCard(doc.id, product);
        container.appendChild(card);
      });
    } catch (err) {
      console.error('[admin-products] loadLiveProducts error:', err);
      showMessage('Error loading products', 'error');
    }
  }

  function createPendingCard(productId, product) {
    const div = document.createElement('div');
    div.className = 'product-card';

    const seller = product.submittedByEmail || 'Unknown';
    const sellerName = seller.split('@')[0];

    div.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-seller">by ${sellerName} (${seller})</div>
        </div>
        <span class="status-badge status-pending">Pending Review</span>
      </div>

      <p class="product-description">${product.description}</p>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Category</div>
          <div class="meta-value">${product.category || 'Other'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Pricing Model</div>
          <div class="meta-value">${product.billingPeriod || 'Month'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Submitted</div>
          <div class="meta-value">${new Date(product.createdAt?.toDate()).toLocaleDateString()}</div>
        </div>
      </div>

      <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <div class="form-row">
          <div class="form-group">
            <label>Price (USD/month)</label>
            <input type="number" class="price-input" value="49" min="0" step="0.01" placeholder="49.99">
          </div>
          <div class="form-group">
            <label>Polar Price ID</label>
            <input type="text" class="polar-id-input" placeholder="POLAR_PRODUCT_PRICE_ID">
          </div>
        </div>

        <div class="form-group">
          <label>Featured (optional)</label>
          <select class="featured-select">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-approve" data-product-id="${productId}">Approve & Publish</button>
        <button class="btn-archive" data-product-id="${productId}">Reject</button>
      </div>
    `;

    const approveBtn = div.querySelector('.btn-approve');
    const rejectBtn = div.querySelector('.btn-archive');

    approveBtn.addEventListener('click', async () => {
      const price = parseFloat(div.querySelector('.price-input').value);
      const polarId = div.querySelector('.polar-id-input').value.trim();
      const featured = div.querySelector('.featured-select').value === 'true';

      if (!price || !polarId) {
        showMessage('Please fill in price and Polar ID', 'error');
        return;
      }

      try {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Publishing...';

        await db.collection('products').doc(productId).update({
          status: 'live',
          price: Math.round(price * 100), // Store as cents
          polarPriceId: polarId,
          featured,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        showMessage(`Published ${product.name}`, 'success');
        setTimeout(() => loadPendingProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] approve error:', err);
        showMessage('Error approving product', 'error');
        approveBtn.disabled = false;
        approveBtn.textContent = 'Approve & Publish';
      }
    });

    rejectBtn.addEventListener('click', async () => {
      if (!confirm(`Remove "${product.name}"?`)) return;

      try {
        rejectBtn.disabled = true;
        await db.collection('products').doc(productId).delete();
        showMessage(`Rejected ${product.name}`, 'success');
        setTimeout(() => loadPendingProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] reject error:', err);
        showMessage('Error rejecting product', 'error');
        rejectBtn.disabled = false;
      }
    });

    return div;
  }

  function createLiveCard(productId, product) {
    const div = document.createElement('div');
    div.className = 'product-card';

    const seller = product.sellerId || 'Mojo';
    const price = product.price ? `$${(product.price / 100).toFixed(2)}/mo` : 'Custom';

    div.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-seller">by ${seller}</div>
        </div>
        <span class="status-badge status-live">Published</span>
      </div>

      <p class="product-description">${product.description}</p>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Price</div>
          <div class="meta-value">${price}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Polar ID</div>
          <div class="meta-value" style="font-family: monospace; font-size: 11px;">${product.polarPriceId || '—'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Featured</div>
          <div class="meta-value">${product.featured ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-archive" data-product-id="${productId}">Archive</button>
      </div>
    `;

    const archiveBtn = div.querySelector('.btn-archive');
    archiveBtn.addEventListener('click', async () => {
      if (!confirm(`Archive "${product.name}"?`)) return;

      try {
        archiveBtn.disabled = true;
        await db.collection('products').doc(productId).update({
          status: 'archived',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        showMessage(`Archived ${product.name}`, 'success');
        setTimeout(() => loadLiveProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] archive error:', err);
        showMessage('Error archiving product', 'error');
        archiveBtn.disabled = false;
      }
    });

    return div;
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
    setTimeout(() => {
      message.classList.remove('show');
    }, 4000);
  }
}());
