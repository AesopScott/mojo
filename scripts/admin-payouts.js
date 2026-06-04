/**
 * admin-payouts.js — Admin dashboard for managing seller payout requests
 *
 * Features:
 * - Admin key authentication
 * - View pending payout requests
 * - Mark payouts as complete
 * - Display seller bank details (decrypted from snapshot)
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';

  let adminKey = null;
  let db = null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const adminKeyInput = document.getElementById('admin-key');
  const logoutBtn = document.getElementById('logout-btn');

  // Initialize
  try {
    db = firebase.firestore();
  } catch (err) {
    console.error('[admin-payouts] Firebase not initialized:', err);
  }

  // Check if already logged in (via sessionStorage)
  const savedAdminKey = sessionStorage.getItem('adminKey');
  if (savedAdminKey) {
    adminKey = savedAdminKey;
    showDashboard();
  } else {
    showLogin();
  }

  // Login handler
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const key = adminKeyInput.value.trim();
    if (!key) {
      alert('Please enter admin key');
      return;
    }

    // Try to fetch payouts with this key to verify it
    try {
      adminKey = key;
      sessionStorage.setItem('adminKey', key);
      showDashboard();
      await loadPayouts();
    } catch (err) {
      console.error('[admin-payouts] Login error:', err);
      adminKey = null;
      sessionStorage.removeItem('adminKey');
      alert('Invalid admin key');
      adminKeyInput.value = '';
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', function () {
    adminKey = null;
    sessionStorage.removeItem('adminKey');
    showLogin();
  });

  async function loadPayouts() {
    try {
      const tbody = document.getElementById('payouts-tbody');
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Loading...</td></tr>';

      // Query pending payout requests
      const snapshot = await db
        .collection('payout_requests')
        .where('status', '==', 'pending')
        .orderBy('requestedAt', 'desc')
        .get();

      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No pending payout requests</p></td></tr>';
        updateStats(0, 0, 0);
        return;
      }

      let totalPending = 0;
      let rows = [];

      snapshot.forEach(doc => {
        const payout = doc.data();
        totalPending += payout.amount || 0;

        const bankDetails = payout.bankDetailsSnapshot || {};
        const accountLast4 = bankDetails.accountNumber
          ? bankDetails.accountNumber.slice(-4)
          : 'unknown';
        const routingNumber = bankDetails.routingNumber || 'unknown';

        const requestedDate = payout.requestedAt
          ? new Date(payout.requestedAt.toDate()).toLocaleDateString()
          : 'unknown';

        const amountUSD = ((payout.amount || 0) / 100).toFixed(2);

        const row = `
          <tr>
            <td>
              <div class="seller-name">${payout.sellerName || 'Unknown'}</div>
              <div class="seller-email">${payout.sellerEmail}</div>
            </td>
            <td>
              <div class="amount">$${amountUSD}</div>
            </td>
            <td>
              <div class="bank-details">
                Account: ••••${accountLast4}<br>
                Routing: ${routingNumber}
              </div>
            </td>
            <td>${requestedDate}</td>
            <td>
              <span class="status-badge status-pending">Pending</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-complete" data-payout-id="${doc.id}">Mark Complete</button>
              </div>
            </td>
          </tr>
        `;
        rows.push(row);
      });

      tbody.innerHTML = rows.join('');

      // Attach click handlers to complete buttons
      tbody.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', async function () {
          const payoutId = this.getAttribute('data-payout-id');
          await completePayout(payoutId, this);
        });
      });

      updateStats(snapshot.size, totalPending, 0);
    } catch (err) {
      console.error('[admin-payouts] loadPayouts error:', err);
      document.getElementById('payouts-tbody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; color: #ef4444; padding: 20px;">Error loading payouts</td></tr>';
    }
  }

  async function completePayout(payoutId, btn) {
    try {
      btn.disabled = true;
      btn.textContent = 'Processing...';

      const response = await fetch(
        `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/completePayout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Key': adminKey,
          },
          body: JSON.stringify({
            payoutId,
            adminNotes: 'Manual transfer completed',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete payout');
      }

      // Reload payouts
      await loadPayouts();
      alert(`Payout marked complete!`);
    } catch (err) {
      console.error('[admin-payouts] completePayout error:', err);
      alert(`Error: ${err.message}`);
      btn.disabled = false;
      btn.textContent = 'Mark Complete';
    }
  }

  function updateStats(pending, pendingAmount, completed) {
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-pending-amount').textContent = `$${(pendingAmount / 100).toFixed(2)}`;
    document.getElementById('stat-completed').textContent = completed;
  }

  function showLogin() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
  }

  function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    loadPayouts();
  }
}());
