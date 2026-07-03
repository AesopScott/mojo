/**
 * seller-onboarding.js — Seller contract signing and payout preference handler
 *
 * Flow:
 * 1. Load seller token from URL (?token=...)
 * 2. Validate token and load seller record
 * 3. Display contract from Firestore
 * 4. Handle contract signing
 * 5. Collect payout preference without bank account storage
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';
  const SELLER_AGREEMENT_HTML = `<h2>Mojo Seller Agreement</h2>
<p>By signing this agreement, you acknowledge and accept the following terms:</p>
<ol>
  <li><strong>Commission Structure:</strong> You will receive 90% of the revenue from each sale of your product(s). Mojo retains 10% to cover platform costs and payment processing.</li>
  <li><strong>Listing Fee:</strong> A $100 non-refundable listing fee applies per product submission.</li>
  <li><strong>Payment Terms:</strong> Mojo holds seller funds in trust. Payouts are processed manually using the payout preference you provide during onboarding.</li>
  <li><strong>Payout Preference:</strong> You must choose a payout method and provide the contact details needed to pay you. Current payout options include PayPal, Zelle, Venmo, Cash App, mailed check, or another option approved by Mojo. Mojo does not collect or store bank account information during onboarding. Once you have sold 10 products, Mojo will work with your bank account directly.</li>
  <li><strong>Content Rights:</strong> You warrant that you own or have the rights to the product(s) you list. You agree not to list copyrighted or infringing content.</li>
  <li><strong>Termination:</strong> Either party may terminate this agreement at any time. Upon termination, all outstanding earnings will be paid out upon request.</li>
  <li><strong>Liability:</strong> Mojo is provided as-is. We are not liable for technical issues, payment delays, or other circumstances beyond our control.</li>
</ol>
<p>Last updated: July 2, 2026</p>`;

  let currentSeller = null;
  let currentStep = 'loading';
  let contractHandlersReady = false;
  let payoutHandlersReady = false;

  // Initialize after the DOM is available, even if this script is moved later.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  async function initialize() {
    try {
      showStep('loading');

      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const sellerToken = params.get('token');

      if (!sellerToken) {
        throw new Error('Missing seller token. Please check your email for the correct link.');
      }

      const email = params.get('email');
      if (!email) {
        throw new Error('Missing email. Please check your email for the correct link.');
      }

      displayContract();
      const state = await loadOnboardingState(email, sellerToken);

      setupContractHandlers();
      setupPayoutHandlers();
      showStep(state.nextStep || 'contract');
    } catch (err) {
      showError(err.message);
      showStep('contract');
    }
  }

  async function loadOnboardingState(email, sellerToken) {
    const response = await fetch(
      `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/getSellerOnboardingState`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sellerToken }),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Could not load seller onboarding status.');
    }

    return data;
  }

  function displayContract() {
    const contentEl = getRequiredElement('contract-content');
    contentEl.innerHTML = SELLER_AGREEMENT_HTML;
  }

  function setupContractHandlers() {
    if (contractHandlersReady) return;

    const contractAgreeCheckbox = getRequiredElement('contract-agree');
    const signContractBtn = getRequiredElement('btn-sign-contract');

    contractAgreeCheckbox.addEventListener('change', function () {
      signContractBtn.disabled = !this.checked;
    });

    signContractBtn.addEventListener('click', async function () {
      try {
        showError('');
        signContractBtn.disabled = true;
        signContractBtn.textContent = 'Signing…';

        const params = new URLSearchParams(window.location.search);
        const sellerToken = params.get('token');
        const email = params.get('email');

        if (!email) {
          throw new Error('Missing email. Please check your link.');
        }

        const response = await fetch(
          `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/signContract`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              sellerToken,
              contractVersion: '1.0',
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to sign contract');
        }

        showStep('payout');
        setupPayoutHandlers();
      } catch (err) {
        showError(err.message);
        signContractBtn.disabled = false;
        signContractBtn.textContent = 'Sign Contract';
      }
    });

    contractHandlersReady = true;
  }

  function setupPayoutHandlers() {
    if (payoutHandlersReady) return;

    const payoutForm = getRequiredElement('payout-preference-form');
    const submitPayoutBtn = getRequiredElement('btn-submit-payout');

    payoutForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      try {
        showError('');
        submitPayoutBtn.disabled = true;
        submitPayoutBtn.textContent = 'Saving...';

        const params = new URLSearchParams(window.location.search);
        const sellerToken = params.get('token');
        const email = params.get('email');

        if (!email || !sellerToken) {
          throw new Error('Missing onboarding link details. Please check your email for the correct link.');
        }

        const payoutMethod = getRequiredElement('payout-method').value;
        const payoutContact = getRequiredElement('payout-contact').value.trim();
        const payoutNotes = getRequiredElement('payout-notes').value.trim();

        if (!payoutMethod || !payoutContact) {
          throw new Error('Please choose a payout method and enter the payout contact details.');
        }

        const response = await fetch(
          `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/submitPayoutPreference`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              sellerToken,
              payoutMethod,
              payoutContact,
              payoutNotes,
            }),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to save payout preference');
        }

        showStep('success');
      } catch (err) {
        showError(err.message);
        submitPayoutBtn.disabled = false;
        submitPayoutBtn.textContent = 'Save Payout Method';
      }
    });

    payoutHandlersReady = true;
  }

  function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => {
      el.classList.remove('active');
    });

    // Show selected step
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) {
      stepEl.classList.add('active');
    }

    currentStep = step;
  }

  function showError(message) {
    const errorEl = document.getElementById('form-error');
    if (!errorEl) {
      console.error('[seller-onboarding] Missing form-error element:', message);
      return;
    }

    if (message) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }
  }

  function getRequiredElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`[seller-onboarding] Missing required element: #${id}`);
      throw new Error('This onboarding page is missing a required control. Please refresh the page or contact admin@mojoaistudio.com.');
    }
    return element;
  }
}());
