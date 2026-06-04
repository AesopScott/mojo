/**
 * seller-dashboard.js — Seller dashboard for viewing balance, earnings, and requesting payouts
 *
 * Features:
 * - Authentication with email + seller token
 * - View available balance and total earnings
 * - Request payouts
 * - View payout history
 * - View recent sales
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';

  let db = null;
  let currentSeller = null;
  let currentEmail = null;
  let currentToken = null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('seller-email');
  const tokenInput = document.getElementById('seller-token');
  const logoutBtn = document.getElementById('logout-btn');
  const payoutAmountInput = document.getElementById('payout-amount');
  const requestPayoutBtn = document.getElementById('btn-request-payout');
  const errorMsg = document.getElementById('error-message');
  const successMsg = document.getElementById('success-message');

  // Initialize Firebase
  try {
    db = firebase.firestore();
  } catch (err) {
    console.error('[seller-dashboard] Firebase not initialized:', err);
  }

  // Check if already logged in (via sessionStorage)
  const savedEmail = sessionStorage.getItem('sellerEmail');
  const savedToken = sessionStorage.getItem('sellerToken');
  if (savedEmail && savedToken) {
    currentEmail = savedEmail;
    currentToken = savedToken;
    loadDashboard();
  } else {
    showLogin();
  }

  // Login handler
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const token = tokenInput.value.trim();

    if (!email || !token) {
      showError('Please enter email and token');
      return;
    }

    try {
      showError('');
      currentEmail = email;
      currentToken = token;

      await loadDashboard();

      sessionStorage.setItem('sellerEmail', email);
      sessionStorage.setItem('sellerToken', token);
    } catch (err) {
      console.error('[seller-dashboard] Login error:', err);
      currentEmail = null;
      currentToken = null;
      sessionStorage.removeItem('sellerEmail');
      sessionStorage.removeItem('sellerToken');
      showError(err.message || 'Invalid email or token');
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', function () {
    currentSeller = null;
    currentEmail = null;
    currentToken = null;
    sessionStorage.removeItem('sellerEmail');
    sessionStorage.removeItem('sellerToken');
    showLogin();
  });

  // Request payout handler
  requestPayoutBtn.addEventListener('click', async function () {
    const amount = parseFloat(payoutAmountInput.value);

    if (!amount || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    const amountCents = Math.round(amount * 100);

    if (amountCents > (currentSeller.availableBalance || 0)) {
      showError('Insufficient balance');
      return;
    }

    try {
      showError('');
      requestPayoutBtn.disabled = true;
      requestPayoutBtn.textContent = 'Submitting...';

      const response = await fetch(
        `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/requestPayout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentEmail,
            sellerToken: currentToken,
            amount: amountCents,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request payout');
      }

      showSuccess(`Payout request submitted! Your funds will be transferred within 3-5 business days.`);
      payoutAmountInput.value = '';

      // Reload dashboard
      setTimeout(() => {
        loadDashboard();
      }, 1500);
    } catch (err) {
      console.error('[seller-dashboard] requestPayout error:', err);
      showError(err.message);
    } finally {
      requestPayoutBtn.disabled = false;
      requestPayoutBtn.textContent = 'Request Payout';
    }
  });

  async function loadDashboard() {
    try {
      showError('');

      // Load seller data
      const sellerSnap = await db.collection('sellers').doc(currentEmail).get();

      if (!sellerSnap.exists) {
        throw new Error('Seller account not found');
      }

      currentSeller = sellerSnap.data();

      // Update UI
      document.getElementById('seller-name').textContent = currentSeller.contactName || 'Seller';
      document.getElementById('seller-email-display').textContent = currentEmail;

      const availableBalance = (currentSeller.availableBalance || 0) / 100;
      const totalEarnings = (currentSeller.totalEarnings || 0) / 100;

      document.getElementById('stat-available').textContent = `$${availableBalance.toFixed(2)}`;
      document.getElementById('stat-total').textContent = `$${totalEarnings.toFixed(2)}`;

      // Bank status
      const bankStatus = currentSeller.bankDetailsStatus || 'pending';
      const bankStatusDisplay = bankStatus === 'verified' ? '✓ Verified' : 'Pending verification';
      document.getElementById('stat-bank-status').textContent = bankStatusDisplay.split(' ')[0];
      document.getElementById('stat-bank-subtext').textContent = bankStatusDisplay;

      // Load payout history
      await loadPayoutHistory();

      // Load sales history
      await loadSalesHistory();

      // Show dashboard
      loginView.style.display = 'none';
      dashboardView.style.display = 'block';
    } catch (err) {
      console.error('[seller-dashboard] loadDashboard error:', err);
      showError(err.message || 'Failed to load dashboard');
      showLogin();
    }
  }

  async function loadPayoutHistory() {
    try {
      const payoutSnap = await db
        .collection('payout_requests')
        .where('sellerEmail', '==', currentEmail)
        .orderBy('requestedAt', 'desc')
        .limit(10)
        .get();

      const tbody = document.getElementById('payout-tbody');

      if (payoutSnap.empty) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state"><p>No payout requests yet</p></td></tr>';
        return;
      }

      let rows = [];
      payoutSnap.forEach(doc => {
        const payout = doc.data();
        const amount = ((payout.amount || 0) / 100).toFixed(2);
        const date = payout.requestedAt
          ? new Date(payout.requestedAt.toDate()).toLocaleDateString()
          : 'unknown';
        const status = payout.status === 'completed' ? 'Completed' : 'Pending';

        const row = `
          <tr>
            <td class="amount">$${amount}</td>
            <td>${date}</td>
            <td>
              <span class="status-badge status-${payout.status}">
                ${status}
              </span>
            </td>
          </tr>
        `;
        rows.push(row);
      });

      tbody.innerHTML = rows.join('');
    } catch (err) {
      console.error('[seller-dashboard] loadPayoutHistory error:', err);
    }
  }

  async function loadSalesHistory() {
    try {
      const salesSnap = await db
        .collection('sales')
        .where('sellerId', '==', currentEmail)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const tbody = document.getElementById('sales-tbody');

      if (salesSnap.empty) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><p>No sales yet</p></td></tr>';
        return;
      }

      let rows = [];
      salesSnap.forEach(doc => {
        const sale = doc.data();
        const saleAmount = ((sale.amount || 0) / 100).toFixed(2);
        const commission = ((sale.commission || 0) / 100).toFixed(2);
        const date = sale.createdAt
          ? new Date(sale.createdAt.toDate()).toLocaleDateString()
          : 'unknown';

        const row = `
          <tr>
            <td>${sale.productName || 'Product'}</td>
            <td class="amount">$${saleAmount}</td>
            <td class="amount">$${commission}</td>
            <td>${date}</td>
          </tr>
        `;
        rows.push(row);
      });

      tbody.innerHTML = rows.join('');
    } catch (err) {
      console.error('[seller-dashboard] loadSalesHistory error:', err);
    }
  }

  function showLogin() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    emailInput.value = '';
    tokenInput.value = '';
  }

  function showError(message) {
    if (message) {
      errorMsg.textContent = message;
      errorMsg.classList.add('show');
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }
  }

  function showSuccess(message) {
    if (message) {
      successMsg.textContent = message;
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 4000);
    }
  }
}());
