/**
 * seller-portal.js - Mojo seller account and product management.
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';
  const FUNCTIONS_BASE = `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net`;
  const STORAGE_EMAIL = 'mojoSellerPortalEmail';
  const STORAGE_SESSION = 'mojoSellerPortalSession';

  const state = {
    email: sessionStorage.getItem(STORAGE_EMAIL) || '',
    sessionToken: sessionStorage.getItem(STORAGE_SESSION) || '',
    seller: null,
    products: [],
    selectedProductId: null,
    inviteToken: '',
  };

  const els = {};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  function initialize() {
    cacheElements();

    const params = new URLSearchParams(window.location.search);
    state.inviteToken = params.get('token') || '';
    const inviteEmail = params.get('email') || state.email;

    els.inviteEmail.value = inviteEmail;
    els.loginEmail.value = inviteEmail;

    if (!state.inviteToken) {
      els.invitePanel.hidden = true;
    }

    bindEvents();

    if (state.email && state.sessionToken) {
      loadPortal();
    } else {
      showView('auth');
    }
  }

  function cacheElements() {
    [
      'auth-view',
      'dashboard-view',
      'portal-message',
      'invite-panel',
      'create-account-form',
      'invite-email',
      'invite-password',
      'invite-password-confirm',
      'create-account-btn',
      'login-form',
      'login-email',
      'login-password',
      'login-btn',
      'session-box',
      'seller-name',
      'seller-email-label',
      'sign-out-btn',
      'onboarding-checklist',
      'onboarding-link',
      'resend-onboarding-invite',
      'refresh-btn',
      'product-list',
      'editor-empty',
      'product-editor',
      'sync-note',
      'edit-name',
      'edit-category',
      'edit-description',
      'edit-product-url',
      'edit-logo-url',
      'edit-screenshot-url',
      'edit-target-user',
      'edit-price',
      'edit-billing-period',
      'edit-anything-else',
      'save-product-btn',
      'submit-launch-btn',
    ].forEach((id) => {
      els[toCamel(id)] = document.getElementById(id);
    });
  }

  function bindEvents() {
    els.createAccountForm.addEventListener('submit', createAccount);
    els.loginForm.addEventListener('submit', login);
    els.signOutBtn.addEventListener('click', signOut);
    els.refreshBtn.addEventListener('click', loadPortal);
    els.productEditor.addEventListener('submit', saveProduct);
    els.submitLaunchBtn.addEventListener('click', submitForLaunch);
    if (els.resendOnboardingInvite) {
      els.resendOnboardingInvite.addEventListener('click', resendOnboardingInvite);
    }
  }

  async function createAccount(event) {
    event.preventDefault();
    clearMessage();

    const email = els.inviteEmail.value.trim().toLowerCase();
    const password = els.invitePassword.value;
    const confirm = els.invitePasswordConfirm.value;

    if (!state.inviteToken) {
      showMessage('Use the approval email link to create your seller account.', 'error');
      return;
    }

    if (password.length < 10) {
      showMessage('Use a password with at least 10 characters.', 'error');
      return;
    }

    if (password !== confirm) {
      showMessage('The password confirmation does not match.', 'error');
      return;
    }

    try {
      setBusy(els.createAccountBtn, 'Creating...');
      const data = await callFunction('sellerCreateAccount', {
        email,
        sellerToken: state.inviteToken,
        password,
      });
      setSession(data.email || email, data.sessionToken);
      showMessage('Seller account created. Your products are ready below.', 'success');
      await loadPortal();
    } catch (err) {
      showMessage(err.message || 'Could not create seller account.', 'error');
    } finally {
      setBusy(els.createAccountBtn, null, 'Create Account');
    }
  }

  async function login(event) {
    event.preventDefault();
    clearMessage();

    const email = els.loginEmail.value.trim().toLowerCase();
    const password = els.loginPassword.value;

    try {
      setBusy(els.loginBtn, 'Signing in...');
      const data = await callFunction('sellerLogin', { email, password });
      setSession(data.email || email, data.sessionToken);
      state.seller = data.seller || null;
      await loadPortal();
    } catch (err) {
      showMessage(err.message || 'Could not sign in.', 'error');
    } finally {
      setBusy(els.loginBtn, null, 'Sign In');
    }
  }

  async function loadPortal() {
    clearMessage();

    try {
      const data = await callFunction('sellerListProducts', {
        email: state.email,
        sessionToken: state.sessionToken,
      });
      state.seller = data.seller || null;
      state.products = Array.isArray(data.products) ? data.products : [];
      if (!state.selectedProductId && state.products[0]) {
        state.selectedProductId = state.products[0].id;
      }
      renderDashboard();
      showView('dashboard');
    } catch (err) {
      if (/session|sign in/i.test(err.message || '')) {
        clearSession();
        showView('auth');
      }
      showMessage(err.message || 'Could not load seller portal.', 'error');
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    clearMessage();

    const product = selectedProduct();
    if (!product) return;

    const priceDollars = Number(els.editPrice.value);
    const priceCents = Number.isFinite(priceDollars) && priceDollars > 0 ? Math.round(priceDollars * 100) : null;

    try {
      setBusy(els.saveProductBtn, 'Saving...');
      const data = await callFunction('sellerUpdateProduct', {
        email: state.email,
        sessionToken: state.sessionToken,
        productId: product.id,
        name: els.editName.value.trim(),
        category: els.editCategory.value.trim(),
        description: els.editDescription.value.trim(),
        productUrl: els.editProductUrl.value.trim(),
        logoUrl: els.editLogoUrl.value.trim(),
        screenshotUrl: els.editScreenshotUrl.value.trim(),
        targetUser: els.editTargetUser.value.trim(),
        priceCents,
        billingPeriod: els.editBillingPeriod.value,
        anythingElse: els.editAnythingElse.value.trim(),
      });

      const updatedProduct = data.product;
      state.products = state.products.map((item) => item.id === updatedProduct.id ? updatedProduct : item);
      renderProducts();
      renderEditor();
      showMessage(data.message || 'Product saved.', data.polarUpdated ? 'success' : 'success');
    } catch (err) {
      showMessage(err.message || 'Could not save product.', 'error');
    } finally {
      setBusy(els.saveProductBtn, null, 'Save Draft');
    }
  }

  async function submitForLaunch() {
    clearMessage();

    const product = selectedProduct();
    if (!product) return;

    if (!confirm('Submit this product for live marketplace sales? Mojo will sync the Polar checkout record and publish the listing if onboarding is complete.')) {
      return;
    }

    const priceDollars = Number(els.editPrice.value);
    const priceCents = Number.isFinite(priceDollars) && priceDollars > 0 ? Math.round(priceDollars * 100) : null;

    try {
      setBusy(els.submitLaunchBtn, 'Submitting...');
      const data = await callFunction('sellerSubmitProductForLaunch', {
        email: state.email,
        sessionToken: state.sessionToken,
        productId: product.id,
        name: els.editName.value.trim(),
        category: els.editCategory.value.trim(),
        description: els.editDescription.value.trim(),
        productUrl: els.editProductUrl.value.trim(),
        logoUrl: els.editLogoUrl.value.trim(),
        screenshotUrl: els.editScreenshotUrl.value.trim(),
        targetUser: els.editTargetUser.value.trim(),
        priceCents,
        billingPeriod: els.editBillingPeriod.value,
        anythingElse: els.editAnythingElse.value.trim(),
      });

      const updatedProduct = data.product;
      state.products = state.products.map((item) => item.id === updatedProduct.id ? updatedProduct : item);
      renderChecklist();
      renderProducts();
      renderEditor();
      showMessage(data.message || 'Product submitted for launch.', 'success');
    } catch (err) {
      showMessage(err.message || 'Could not submit product for launch.', 'error');
    } finally {
      setBusy(els.submitLaunchBtn, null, product.status === 'live' ? 'Sync Live Listing' : 'Submit for Launch');
    }
  }

  function renderDashboard() {
    const seller = state.seller || {};
    els.sessionBox.hidden = false;
    els.sellerName.textContent = seller.contactName || 'Seller';
    els.sellerEmailLabel.textContent = state.email;
    renderChecklist();
    renderProducts();
    renderEditor();
  }

  function renderChecklist() {
    const seller = state.seller || {};
    const selected = selectedProduct() || state.products[0] || {};
    const listingFeeReady = Boolean(selected.listingFeeWaived || selected.listingFeeStatus === 'waived' || selected.listingFeeStatus === 'paid' || selected.listingFeeStatus === 'payment_submitted');
    const listingFeeText = listingFeeReady
      ? selected.listingFeeStatus === 'paid'
        ? 'Paid.'
        : selected.listingFeeStatus === 'payment_submitted'
          ? 'Payment details submitted.'
          : 'Waived by Mojo.'
      : 'Pay the one-time $100 listing fee before launch.';
    const sellerToken = state.inviteToken || seller.sellerToken || '';
    const onboardingUrl = `/products/pages/seller-onboarding.html?email=${encodeURIComponent(state.email)}&token=${encodeURIComponent(sellerToken)}`;
    const hasInviteToken = Boolean(sellerToken);
    els.onboardingLink.href = hasInviteToken ? onboardingUrl : '#';
    els.onboardingLink.textContent = seller.contractSigned && seller.payoutPreferenceProvided
      ? 'Review Onboarding'
      : 'Finish Contract & Payout';
    els.onboardingLink.classList.toggle('secondary', !hasInviteToken);
    if (!hasInviteToken) {
      els.onboardingLink.setAttribute('aria-disabled', 'true');
      els.onboardingLink.addEventListener('click', preventDisabledOnboardingLink);
    }

    const canResendInvite = Boolean(state.sessionToken && seller.contractSignedAt);
    if (els.resendOnboardingInvite) {
      els.resendOnboardingInvite.disabled = !canResendInvite;
      els.resendOnboardingInvite.hidden = !canResendInvite;
    }

    const items = [
      {
        label: 'Seller account',
        text: 'Created in Mojo.',
        complete: true,
      },
      {
        label: 'Seller agreement',
        text: seller.contractSigned ? 'Signed.' : 'Needs signature.',
        complete: seller.contractSigned,
      },
      {
        label: 'Payout preference',
        text: seller.payoutPreferenceProvided ? formatPayout(seller.payoutMethod, seller.payoutContact) : 'Choose PayPal, Zelle, Venmo, Cash App, mailed check, or another option.',
        complete: seller.payoutPreferenceProvided,
      },
      {
        label: 'Listing fee',
        text: listingFeeText,
        complete: listingFeeReady,
      },
      {
        label: 'Polar checkout',
        text: state.products.some((product) => product.polarProductId) ? 'Mojo owns and syncs the Polar product.' : 'Created by Mojo after onboarding is complete.',
        complete: state.products.some((product) => product.status === 'live'),
      },
    ];

    els.onboardingChecklist.innerHTML = items.map((item) => `
      <div class="check-item ${item.complete ? 'complete' : ''}">
        <div class="check-dot">${item.complete ? '✓' : '•'}</div>
        <div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.text)}</span></div>
      </div>
    `).join('') + listingFeePaymentHtml(selected);
  }

  function listingFeePaymentHtml(product) {
    if (!product || product.listingFeeWaived || product.listingFeeStatus === 'waived' || product.listingFeeStatus === 'paid') {
      return '';
    }

    return '<div class="sync-note" style="margin-top:12px;">The $100 listing fee is paid by PayPal or Zelle before contract signing. Submit the payment details from your onboarding link to continue.</div>';
  }

  function preventDisabledOnboardingLink(event) {
    if (!state.inviteToken) {
      event.preventDefault();
      showMessage('Open the portal from the approval email to finish contract and payout setup.', 'error');
    }
  }

  function renderProducts() {
    if (!state.products.length) {
      els.productList.innerHTML = '<div class="empty-state">No products are attached to this seller account yet.</div>';
      return;
    }

    els.productList.innerHTML = state.products.map((product) => {
      const chipClass = product.status === 'live'
        ? 'live'
        : product.polarSyncStatus === 'update_failed'
          ? 'failed'
          : 'pending';
      return `
        <button class="product-row ${product.id === state.selectedProductId ? 'active' : ''}" data-product-id="${escapeAttribute(product.id)}" type="button">
          <div>
            <p class="product-name">${escapeHtml(product.name || 'Untitled product')}</p>
            <div class="product-meta">${escapeHtml(formatPrice(product.price, product.billingPeriod))} · ${escapeHtml(formatSync(product))}</div>
          </div>
          <span class="status-chip ${chipClass}">${escapeHtml(formatStatus(product.status))}</span>
        </button>
      `;
    }).join('');

    els.productList.querySelectorAll('.product-row').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedProductId = button.dataset.productId;
        renderProducts();
        renderChecklist();
        renderEditor();
      });
    });
  }

  function renderEditor() {
    const product = selectedProduct();
    if (!product) {
      els.editorEmpty.style.display = 'block';
      els.productEditor.style.display = 'none';
      return;
    }

    els.editorEmpty.style.display = 'none';
    els.productEditor.style.display = 'block';
    els.editName.value = product.name || '';
    els.editCategory.value = product.category || '';
    els.editDescription.value = product.description || '';
    els.editProductUrl.value = product.productUrl || '';
    els.editLogoUrl.value = product.logoUrl || '';
    els.editScreenshotUrl.value = product.screenshotUrl || '';
    els.editTargetUser.value = product.targetUser || '';
    els.editPrice.value = product.pendingPricingUpdate?.price
      ? (product.pendingPricingUpdate.price / 100).toFixed(2)
      : product.price
        ? (product.price / 100).toFixed(2)
        : '';
    els.editBillingPeriod.value = normalizeBilling(product.pendingPricingUpdate?.billingPeriod || product.billingPeriod);
    els.editAnythingElse.value = product.anythingElse || '';

    const live = product.status === 'live';
    const pendingPricing = product.pendingPricingUpdate?.price;
    els.syncNote.textContent = live
      ? pendingPricing
        ? 'Your listing edits are saved. The price change is waiting for Mojo to sync safely with Polar checkout.'
        : 'Live product: Mojo saves your edits here and syncs supported Polar fields such as name and description.'
      : 'Pre-launch product: save drafts while you work, then submit for launch to sync Polar and publish the marketplace listing.';
    els.submitLaunchBtn.disabled = false;
    els.submitLaunchBtn.textContent = live ? 'Sync Live Listing' : 'Submit for Launch';
  }

  async function resendOnboardingInvite() {
    try {
      setBusy(els.resendOnboardingInvite, 'Sending...');
      const data = await callFunction('sellerResendOnboardingInvite', {
        email: state.email,
        sessionToken: state.sessionToken,
      });
      showMessage(data.message || 'Seller onboarding invite resent.', 'success');
    } catch (err) {
      showMessage(err.message || 'Could not resend onboarding invite.', 'error');
    } finally {
      setBusy(els.resendOnboardingInvite, null, 'Resend Onboarding Invite');
    }
  }

  function selectedProduct() {
    return state.products.find((product) => product.id === state.selectedProductId) || null;
  }

  async function callFunction(name, body) {
    const response = await fetch(`${FUNCTIONS_BASE}/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || `Request failed: ${name}`);
    }
    return data;
  }

  function setSession(email, sessionToken) {
    state.email = email;
    state.sessionToken = sessionToken;
    sessionStorage.setItem(STORAGE_EMAIL, email);
    sessionStorage.setItem(STORAGE_SESSION, sessionToken);
  }

  function clearSession() {
    state.email = '';
    state.sessionToken = '';
    state.seller = null;
    state.products = [];
    state.selectedProductId = null;
    sessionStorage.removeItem(STORAGE_EMAIL);
    sessionStorage.removeItem(STORAGE_SESSION);
  }

  function signOut() {
    clearSession();
    els.sessionBox.hidden = true;
    showView('auth');
  }

  function showView(name) {
    document.querySelectorAll('.portal-view').forEach((view) => view.classList.remove('active'));
    document.getElementById(`${name}-view`).classList.add('active');
  }

  function setBusy(button, text, fallback) {
    if (!button) return;
    if (text) {
      button.dataset.originalText = button.textContent;
      button.textContent = text;
      button.disabled = true;
    } else {
      button.textContent = fallback || button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function showMessage(text, type) {
    els.portalMessage.textContent = text;
    els.portalMessage.className = `message show ${type}`;
    els.portalMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearMessage() {
    els.portalMessage.textContent = '';
    els.portalMessage.className = 'message';
  }

  function formatStatus(status) {
    return String(status || 'pending').replace(/_/g, ' ');
  }

  function formatSync(product) {
    if (product.polarSyncStatus === 'update_failed') return 'Polar update needs review';
    if (product.pendingPricingUpdate?.price) return 'Price update pending';
    if (product.polarProductId) return 'Polar connected';
    if (product.status === 'ready_for_launch') return 'Ready for Mojo launch';
    return 'Mojo review/onboarding';
  }

  function formatPrice(cents, billingPeriod) {
    if (!cents) return 'Price not set';
    const dollars = (Number(cents) / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
    });
    const period = normalizeBilling(billingPeriod);
    if (period === 'one_time') return `${dollars} one time`;
    return `${dollars}/${period}`;
  }

  function formatPayout(method, contact) {
    const label = String(method || 'payout').replace(/_/g, ' ');
    return `${label}${contact ? `: ${contact}` : ''}`;
  }

  function normalizeBilling(value) {
    const period = String(value || '').toLowerCase();
    if (['one_time', 'one-time', 'once'].includes(period)) return 'one_time';
    if (['year', 'yearly', 'annual', 'annually'].includes(period)) return 'year';
    return 'month';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    })[char]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
  }

  function toCamel(id) {
    return id.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }
}());
