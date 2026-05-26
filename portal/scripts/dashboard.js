/**
 * dashboard.js — Customer portal purchase history dashboard.
 * Fetches the signed-in user's purchases from Firestore and renders them.
 *
 * Firestore schema — /purchases/{id}:
 *   userId          string   (Firebase UID)
 *   planName        string   e.g. "GAIN — Business"
 *   planTier        string   "pro" | "business" | "enterprise"
 *   amount          number   price in cents (e.g. 10000 = $100.00)
 *   currency        string   "usd"
 *   status          string   "active" | "trialing" | "cancelled" | "past_due" | "expired"
 *   polarSubscriptionId string
 *   createdAt       Timestamp
 *   renewalDate     Timestamp (null if cancelled/expired)
 *
 * Depends on: firebase-app-compat.js, firebase-auth-compat.js,
 *             firebase-firestore-compat.js, firebase-config.js
 */

(function () {
  var auth = firebase.auth();
  var db   = firebase.firestore();

  var greetingEl  = document.getElementById('portal-greeting');
  var emailEl     = document.getElementById('portal-email');
  var loadingEl   = document.getElementById('purchases-loading');
  var emptyEl     = document.getElementById('purchases-empty');
  var listEl      = document.getElementById('purchases-list');
  var signoutBtn  = document.getElementById('signout-btn');

  /* ── Auth guard: redirect to login if not signed in ── */
  auth.onAuthStateChanged(function (user) {
    if (!user) {
      window.location.replace('index.html');
      return;
    }

    // Personalise header
    var name = user.displayName || user.email.split('@')[0];
    if (greetingEl) { greetingEl.textContent = 'Welcome back, ' + name + '.'; }
    if (emailEl)    { emailEl.textContent = user.email; }

    // Load purchases
    db.collection('purchases')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get()
      .then(function (snapshot) {
        loadingEl.hidden = true;

        if (snapshot.empty) {
          emptyEl.hidden = false;
          return;
        }

        listEl.hidden = false;
        snapshot.forEach(function (doc) {
          listEl.appendChild(renderPurchase(doc.id, doc.data()));
        });
      })
      .catch(function (err) {
        loadingEl.textContent = 'Could not load purchases — please refresh the page.';
        console.error('[portal] Firestore error:', err);
      });
  });

  /* ── Sign out ── */
  if (signoutBtn) {
    signoutBtn.addEventListener('click', function () {
      auth.signOut().then(function () {
        window.location.replace('index.html');
      });
    });
  }

  /* ── Render a single purchase card ── */
  function renderPurchase(id, data) {
    var card = document.createElement('article');
    card.className = 'purchase-card';
    card.setAttribute('data-purchase-id', id);

    var statusMap = {
      active:    { label: 'Active',    css: 'active'   },
      trialing:  { label: 'Trial',     css: 'trialing' },
      cancelled: { label: 'Cancelled', css: 'cancelled'},
      past_due:  { label: 'Past due',  css: 'past-due' },
      expired:   { label: 'Expired',   css: 'expired'  },
    };
    var st = statusMap[data.status] || { label: data.status || '—', css: 'unknown' };

    var startStr   = formatDate(data.createdAt);
    var renewalStr = formatDate(data.renewalDate);

    var renewalLine = '';
    if (renewalStr && data.status === 'active') {
      renewalLine = '<p>Renews <b>' + renewalStr + '</b></p>';
    } else if (renewalStr && data.status === 'trialing') {
      renewalLine = '<p>Trial ends <b>' + renewalStr + '</b></p>';
    } else if (renewalStr && data.status === 'cancelled') {
      renewalLine = '<p>Access until <b>' + renewalStr + '</b></p>';
    }

    var amountLine = data.amount
      ? '<p>' + formatAmount(data.amount, data.currency) + '/mo</p>'
      : '';

    card.innerHTML =
      '<div class="purchase-card-header">' +
        '<div>' +
          '<h3>' + escapeHtml(data.planName || 'Unknown plan') + '</h3>' +
          (startStr ? '<p class="purchase-date">Purchased ' + startStr + '</p>' : '') +
        '</div>' +
        '<span class="purchase-status purchase-status--' + st.css + '">' +
          escapeHtml(st.label) +
        '</span>' +
      '</div>' +
      '<div class="purchase-card-body">' +
        renewalLine +
        amountLine +
      '</div>' +
      '<div class="purchase-card-footer">' +
        '<a class="button ghost" href="https://polar.sh/purchases" target="_blank" rel="noopener">' +
          'Manage subscription →' +
        '</a>' +
      '</div>';

    return card;
  }

  /* ── Utilities ── */
  function formatDate(ts) {
    if (!ts) { return null; }
    var d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatAmount(cents, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}());
