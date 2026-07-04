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
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';

  let adminKey = null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const adminKeyInput = document.getElementById('admin-key');
  const logoutBtn = document.getElementById('logout-btn');
  const tabs = document.querySelectorAll('.tab');
  const message = document.getElementById('message');

  const urlKey = new URLSearchParams(window.location.search).get('key');
  const savedKey = sessionStorage.getItem('adminKey');
  if (urlKey || savedKey) {
    adminKey = urlKey || savedKey;
    sessionStorage.setItem('adminKey', adminKey);
    if (urlKey) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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
      } else if (this.dataset.tab === 'onboarding') {
        loadOnboardingProducts();
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

      const products = await adminRequest('adminListProducts?status=pending_review');

      if (!products.length) {
        container.innerHTML = '<div class="empty-state"><p>No pending products</p></div>';
        return;
      }

      container.innerHTML = '';
      products.forEach(product => {
        const card = createPendingCard(product.id, product);
        container.appendChild(card);
      });
    } catch (err) {
      console.error('[admin-products] loadPendingProducts error:', err);
      handleAdminError(err, 'Error loading products');
    }
  }

  async function loadOnboardingProducts() {
    try {
      const container = document.getElementById('onboarding-products');
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">Loading...</p>';

      const [waiting, ready] = await Promise.all([
        adminRequest('adminListProducts?status=pending_seller_onboarding'),
        adminRequest('adminListProducts?status=ready_for_launch'),
      ]);
      const products = waiting.concat(ready)
        .sort((a, b) => (b.updatedAtMillis || b.createdAtMillis || 0) - (a.updatedAtMillis || a.createdAtMillis || 0));

      if (!products.length) {
        container.innerHTML = '<div class="empty-state"><p>No products waiting on seller onboarding</p></div>';
        return;
      }

      container.innerHTML = '';
      products.forEach(product => {
        const card = createOnboardingCard(product.id, product);
        container.appendChild(card);
      });
    } catch (err) {
      console.error('[admin-products] loadOnboardingProducts error:', err);
      handleAdminError(err, 'Error loading seller onboarding products');
    }
  }

  async function loadLiveProducts() {
    try {
      const container = document.getElementById('live-products');
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">Loading...</p>';

      const products = await adminRequest('adminListProducts?status=live');

      if (!products.length) {
        container.innerHTML = '<div class="empty-state"><p>No published products</p></div>';
        return;
      }

      container.innerHTML = '';
      products.forEach(product => {
        const card = createLiveCard(product.id, product);
        container.appendChild(card);
      });
    } catch (err) {
      console.error('[admin-products] loadLiveProducts error:', err);
      handleAdminError(err, 'Error loading products');
    }
  }

  function createPendingCard(productId, product) {
    const div = document.createElement('div');
    div.className = 'product-card';

    const seller = product.submittedByEmail || 'Unknown';
    const sellerName = seller.split('@')[0];
    const submitterName = product.submitterName || sellerName;
    const productUrl = product.productUrl || product.externalUrl || '';
    const safeProductUrl = safeUrl(productUrl);
    const logoUrl = product.logoUrl || '';
    const screenshotUrl = product.screenshotUrl || product.imageUrl || '';
    const safeLogoUrl = safeUrl(logoUrl);
    const safeScreenshotUrl = safeUrl(screenshotUrl);
    const pricingModel = product.pricingModel || product.billingPeriod || '';
    const targetUser = product.targetUser || product.inputs || '';
    const additionalContext = product.anythingElse || '';

    div.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <h3>${escapeHtml(product.name || 'Untitled product')}</h3>
          <div class="product-seller">by ${escapeHtml(submitterName)} (${escapeHtml(seller)})</div>
        </div>
        <span class="status-badge status-pending">Pending Review</span>
      </div>

      <p class="product-description">${escapeHtml(product.description || '')}</p>

      <div class="product-assets">
        <div class="product-asset product-asset--logo">
          <div class="meta-label">Logo / Icon</div>
          ${safeLogoUrl ? `<img src="${escapeAttribute(safeLogoUrl)}" alt="${escapeAttribute(product.name || 'Product')} logo" loading="lazy">` : '<div class="meta-value">Not provided</div>'}
          ${safeLogoUrl ? `<a href="${escapeAttribute(safeLogoUrl)}" target="_blank" rel="noopener">${escapeHtml(logoUrl)}</a>` : ''}
        </div>
        <div class="product-asset">
          <div class="meta-label">Screenshot / Cover</div>
          ${safeScreenshotUrl ? `<img src="${escapeAttribute(safeScreenshotUrl)}" alt="${escapeAttribute(product.name || 'Product')} screenshot" loading="lazy">` : '<div class="meta-value">Not provided</div>'}
          ${safeScreenshotUrl ? `<a href="${escapeAttribute(safeScreenshotUrl)}" target="_blank" rel="noopener">${escapeHtml(screenshotUrl)}</a>` : ''}
        </div>
      </div>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Category</div>
          <div class="meta-value">${escapeHtml(formatValue(product.category, 'Other'))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Pricing Model</div>
          <div class="meta-value">${escapeHtml(formatValue(pricingModel, 'Not specified'))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Submitted</div>
          <div class="meta-value">${formatDate(product.createdAtMillis)}</div>
        </div>
      </div>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Product URL / Demo</div>
          <div class="meta-value">${safeProductUrl ? `<a href="${escapeAttribute(safeProductUrl)}" target="_blank" rel="noopener">${escapeHtml(productUrl)}</a>` : escapeHtml(formatValue(productUrl, 'Not provided'))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Target User</div>
          <div class="meta-value">${escapeHtml(formatValue(targetUser, 'Not specified'))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Contact Email</div>
          <div class="meta-value">${escapeHtml(seller)}</div>
        </div>
      </div>

      ${additionalContext ? `
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
          <div class="meta-label" style="margin-bottom: 8px;">Anything Else</div>
          <div class="product-description" style="margin-bottom: 0;">${escapeHtml(additionalContext)}</div>
        </div>
      ` : ''}

      <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <div class="form-row">
          <div class="form-group">
            <label>Price USD <span style="font-weight:400;color:#6b7280">(saved now; Polar is created after seller onboarding)</span></label>
            <input type="number" class="price-input" min="1" step="0.01" placeholder="99.00" required>
          </div>

          <div class="form-group">
            <label>Billing</label>
            <select class="billing-select">
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="one_time">One-time</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Existing Polar Price ID <span style="font-weight:400;color:#6b7280">(optional override; only if this already exists in Mojo Polar)</span></label>
          <input type="text" class="polar-id-input" placeholder="Optional existing Polar price ID">
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
        <button class="btn-approve" data-product-id="${productId}">Approve & Send Contract</button>
        <button class="btn-archive" data-product-id="${productId}">Reject</button>
      </div>
    `;

    const approveBtn = div.querySelector('.btn-approve');
    const rejectBtn = div.querySelector('.btn-archive');

    approveBtn.addEventListener('click', async () => {
      const polarId = div.querySelector('.polar-id-input').value.trim();
      const priceDollars = Number(div.querySelector('.price-input').value);
      const priceCents = Number.isFinite(priceDollars) ? Math.round(priceDollars * 100) : null;
      const billingPeriod = div.querySelector('.billing-select').value;
      const featured = div.querySelector('.featured-select').value === 'true';

      if (!polarId && (!priceCents || priceCents <= 0)) {
        showMessage('Enter a price so Mojo can create the Polar checkout product', 'error');
        return;
      }

      try {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Approving...';

        const result = await adminRequest('adminApproveProduct', {
          method: 'POST',
          body: {
            productId,
            polarPriceId: polarId,
            priceCents,
            billingPeriod,
            featured,
          },
        });

        // Send seller onboarding email now that product is approved
        if (result.sellerToken && result.email) {
          await sendSellerOnboardingEmail({
            email: result.email,
            contactName: result.contactName || result.email.split('@')[0],
            productName: result.productName || product.name,
            sellerToken: result.sellerToken,
          });
        }

        showMessage(`Approved ${product.name} — onboarding email sent. Publish after seller signs and saves payout details.`, 'success');
        setTimeout(() => loadPendingProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] approve error:', err);
        showMessage(err.message || 'Error approving product', 'error');
        approveBtn.disabled = false;
        approveBtn.textContent = 'Approve & Send Contract';
      }
    });

    rejectBtn.addEventListener('click', async () => {
      if (!confirm(`Remove "${product.name}"?`)) return;

      try {
        rejectBtn.disabled = true;
        await adminRequest('adminRejectProduct', {
          method: 'POST',
          body: { productId },
        });
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

  function createOnboardingCard(productId, product) {
    const div = document.createElement('div');
    div.className = 'product-card';

    const seller = product.sellerEmail || product.submittedByEmail || product.sellerId || 'Unknown';
    const sellerName = product.sellerContactName || product.submitterName || (seller.includes('@') ? seller.split('@')[0] : seller);
    const canResendContract = Boolean(product.sellerToken && seller.includes('@'));
    const payoutStatus = product.sellerPayoutPreferenceStatus || 'not submitted';
    const payoutMethod = formatPayoutMethod(product.sellerPayoutMethod);
    const payoutContact = product.sellerPayoutContact || '—';
    const payoutNotes = product.sellerPayoutNotes || '';
    const sellerReady = product.status === 'ready_for_launch' || payoutStatus === 'provided';
    const price = formatPrice(product.price, product.billingPeriod);
    const productUrl = product.productUrl || product.externalUrl || '';
    const safeProductUrl = safeUrl(productUrl);

    div.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <h3>${escapeHtml(product.name || 'Untitled product')}</h3>
          <div class="product-seller">by ${escapeHtml(sellerName)} (${escapeHtml(seller)})</div>
        </div>
        <span class="status-badge status-pending">${sellerReady ? 'Ready to Publish' : 'Seller Onboarding'}</span>
      </div>

      <p class="product-description">${escapeHtml(product.description || '')}</p>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Price</div>
          <div class="meta-value">${escapeHtml(price)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Seller Status</div>
          <div class="meta-value">${escapeHtml(formatValue(product.sellerStatus, 'Unknown'))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Product URL / Demo</div>
          <div class="meta-value">${safeProductUrl ? `<a href="${escapeAttribute(safeProductUrl)}" target="_blank" rel="noopener">${escapeHtml(productUrl)}</a>` : escapeHtml(formatValue(productUrl, 'Not provided'))}</div>
        </div>
      </div>

      <div class="seller-payout">
        <h4 class="seller-payout-title">Seller Payout</h4>
        <div class="seller-payout-grid">
          <div class="meta-item">
            <div class="meta-label">Status</div>
            <div class="meta-value">${escapeHtml(formatValue(payoutStatus, 'Not submitted'))}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Method</div>
            <div class="meta-value">${escapeHtml(payoutMethod)}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Pay To / Contact</div>
            <div class="meta-value">${escapeHtml(payoutContact)}</div>
          </div>
        </div>
        ${payoutNotes ? `<div class="seller-payout-notes"><strong>Notes:</strong> ${escapeHtml(payoutNotes)}</div>` : ''}
      </div>

      <div class="action-buttons">
        <button class="btn-approve" data-product-id="${productId}" ${sellerReady ? '' : 'disabled'} title="${sellerReady ? 'Create the Mojo-owned Polar product and publish this listing' : 'Seller must sign contract and save payout details first'}">Create Polar Product & Publish</button>
        <button class="btn-resend" data-product-id="${productId}" ${canResendContract ? '' : 'disabled'} title="${canResendContract ? 'Resend seller onboarding email' : 'Seller token unavailable'}">Resend Contract</button>
        <button class="btn-archive" data-product-id="${productId}">Archive</button>
      </div>
    `;

    const publishBtn = div.querySelector('.btn-approve');
    const resendBtn = div.querySelector('.btn-resend');
    const archiveBtn = div.querySelector('.btn-archive');

    publishBtn.addEventListener('click', async () => {
      try {
        publishBtn.disabled = true;
        publishBtn.textContent = 'Creating in Polar...';

        const result = await adminRequest('adminFinalizeProduct', {
          method: 'POST',
          body: {
            productId,
            priceCents: product.price,
            billingPeriod: product.billingPeriod,
            featured: product.featured,
          },
        });

        const checkoutNote = result.polarPriceId ? ` Checkout ID: ${result.polarPriceId}` : '';
        showMessage(`Published ${product.name}.${checkoutNote}`, 'success');
        setTimeout(() => loadOnboardingProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] finalize error:', err);
        showMessage(err.message || 'Error publishing product', 'error');
        publishBtn.disabled = false;
        publishBtn.textContent = 'Create Polar Product & Publish';
      }
    });

    resendBtn.addEventListener('click', async () => {
      try {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        await sendSellerOnboardingEmail({
          email: seller,
          contactName: sellerName,
          productName: product.name || 'your product',
          sellerToken: product.sellerToken,
        });
        showMessage(`Contract email resent to ${seller}`, 'success');
        resendBtn.textContent = 'Resent';
        setTimeout(() => {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend Contract';
        }, 2000);
      } catch (err) {
        console.error('[admin-products] resend onboarding error:', err);
        showMessage(err.message || 'Error resending contract email', 'error');
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Contract';
      }
    });

    archiveBtn.addEventListener('click', async () => {
      if (!confirm(`Archive "${product.name}"?`)) return;

      try {
        archiveBtn.disabled = true;
        await adminRequest('adminArchiveProduct', {
          method: 'POST',
          body: { productId },
        });
        showMessage(`Archived ${product.name}`, 'success');
        setTimeout(() => loadOnboardingProducts(), 1500);
      } catch (err) {
        console.error('[admin-products] archive onboarding error:', err);
        showMessage('Error archiving product', 'error');
        archiveBtn.disabled = false;
      }
    });

    return div;
  }

  function createLiveCard(productId, product) {
    const div = document.createElement('div');
    div.className = 'product-card';

    const seller = product.sellerEmail || product.sellerId || 'Mojo';
    const sellerName = product.sellerContactName || (seller.includes('@') ? seller.split('@')[0] : seller);
    const canResendContract = Boolean(product.sellerToken && seller.includes('@'));
    const price = formatPrice(product.price, product.billingPeriod);
    const payoutStatus = product.sellerPayoutPreferenceStatus || 'not submitted';
    const payoutMethod = formatPayoutMethod(product.sellerPayoutMethod);
    const payoutContact = product.sellerPayoutContact || '—';
    const payoutNotes = product.sellerPayoutNotes || '';

    div.innerHTML = `
      <div class="product-header">
        <div class="product-info">
          <h3>${escapeHtml(product.name || 'Untitled product')}</h3>
          <div class="product-seller">by ${escapeHtml(sellerName)} (${escapeHtml(seller)})</div>
        </div>
        <span class="status-badge status-live">Published</span>
      </div>

      <p class="product-description">${escapeHtml(product.description || '')}</p>

      <div class="product-meta">
        <div class="meta-item">
          <div class="meta-label">Price</div>
          <div class="meta-value">${escapeHtml(price)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Polar ID</div>
          <div class="meta-value" style="font-family: monospace; font-size: 11px;">${escapeHtml(product.polarPriceId || '—')}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Polar Product</div>
          <div class="meta-value" style="font-family: monospace; font-size: 11px;">${escapeHtml(product.polarProductId || '—')}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Featured</div>
          <div class="meta-value">${product.featured ? 'Yes' : 'No'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Seller Status</div>
          <div class="meta-value">${escapeHtml(formatValue(product.sellerStatus, 'Unknown'))}</div>
        </div>
      </div>

      <div class="seller-payout">
        <h4 class="seller-payout-title">Seller Payout</h4>
        <div class="seller-payout-grid">
          <div class="meta-item">
            <div class="meta-label">Status</div>
            <div class="meta-value">${escapeHtml(formatValue(payoutStatus, 'Not submitted'))}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Method</div>
            <div class="meta-value">${escapeHtml(payoutMethod)}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Pay To / Contact</div>
            <div class="meta-value">${escapeHtml(payoutContact)}</div>
          </div>
        </div>
        ${payoutNotes ? `<div class="seller-payout-notes"><strong>Notes:</strong> ${escapeHtml(payoutNotes)}</div>` : ''}
      </div>

      <div class="action-buttons">
        <button class="btn-resend" data-product-id="${productId}" ${canResendContract ? '' : 'disabled'} title="${canResendContract ? 'Resend seller contract email' : 'Seller token unavailable'}">Resend Contract</button>
        <button class="btn-archive" data-product-id="${productId}">Archive</button>
      </div>
    `;

    const resendBtn = div.querySelector('.btn-resend');
    const archiveBtn = div.querySelector('.btn-archive');

    resendBtn.addEventListener('click', async () => {
      try {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';

        await sendSellerOnboardingEmail({
          email: seller,
          contactName: sellerName,
          productName: product.name || 'your product',
          sellerToken: product.sellerToken,
        });

        showMessage(`Contract email resent to ${seller}`, 'success');
        resendBtn.textContent = 'Resent';
        setTimeout(() => {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend Contract';
        }, 2000);
      } catch (err) {
        console.error('[admin-products] resend contract error:', err);
        showMessage(err.message || 'Error resending contract email', 'error');
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Contract';
      }
    });

    archiveBtn.addEventListener('click', async () => {
      if (!confirm(`Archive "${product.name}"?`)) return;

      try {
        archiveBtn.disabled = true;
        await adminRequest('adminArchiveProduct', {
          method: 'POST',
          body: { productId },
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

  async function sendSellerOnboardingEmail({ email, contactName, productName, sellerToken }) {
    const response = await fetch('/api/send-seller-onboarding-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        contactName,
        productName,
        sellerToken,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to send seller onboarding email');
    }

    return data;
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
    setTimeout(() => {
      message.classList.remove('show');
    }, 4000);
  }

  async function adminRequest(endpoint, options = {}) {
    const response = await fetch(
      `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/${endpoint}`,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Admin request failed');
    }

    return data.products || data;
  }

  function handleAdminError(err, fallback) {
    const message = err.message || fallback;
    if (/unauthorized/i.test(message)) {
      adminKey = null;
      sessionStorage.removeItem('adminKey');
      showLogin();
      alert('Admin key rejected. Please sign in again with the current admin key.');
      return;
    }

    showMessage(message, 'error');
  }

  function formatDate(value) {
    if (!value) return 'unknown';
    return new Date(value).toLocaleDateString();
  }

  function formatValue(value, fallback) {
    const text = String(value || '').trim();
    return text || fallback;
  }

  function formatPayoutMethod(value) {
    const labels = {
      paypal: 'PayPal',
      zelle: 'Zelle',
      venmo: 'Venmo',
      cash_app: 'Cash App',
      check: 'Mailed check',
      other: 'Other',
    };
    return labels[value] || formatValue(value, '—');
  }

  function formatPrice(priceCents, billingPeriod) {
    if (!priceCents) return 'Custom';
    const period = String(billingPeriod || 'month');
    const suffix = period === 'one_time' ? ' one-time' : `/${period === 'year' ? 'yr' : 'mo'}`;
    return `$${(Number(priceCents) / 100).toFixed(2)}${suffix}`;
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
