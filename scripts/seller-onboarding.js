/**
 * seller-onboarding.js — Seller contract signing and bank details form handler
 *
 * Flow:
 * 1. Load seller token from URL (?token=...)
 * 2. Validate token and load seller record
 * 3. Display contract from Firestore
 * 4. Handle contract signing
 * 5. Handle bank details submission
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';

  let currentSeller = null;
  let currentStep = 'loading';

  // DOM Elements
  const errorEl = document.getElementById('form-error');
  const contractAgreeCheckbox = document.getElementById('contract-agree');
  const signContractBtn = document.getElementById('btn-sign-contract');

  // Initialize
  initialize();

  async function initialize() {
    try {
      showStep('loading');

      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const sellerToken = params.get('token');

      if (!sellerToken) {
        throw new Error('Missing seller token. Please check your email for the correct link.');
      }

      // Load contract from Firestore
      const contract = await loadContract();
      if (!contract) {
        throw new Error('Contract not found. Please try again.');
      }

      displayContract(contract);

      // Show contract step
      showStep('contract');
      setupContractHandlers();
    } catch (err) {
      showError(err.message);
      showStep('contract');
    }
  }

  async function loadContract() {
    try {
      const db = firebase.firestore();
      const doc = await db.collection('contracts').doc('1.0').get();
      return doc.data();
    } catch (err) {
      console.error('[seller-onboarding] loadContract error:', err);
      return null;
    }
  }

  function displayContract(contract) {
    const contentEl = document.getElementById('contract-content');
    contentEl.innerHTML = contract.content || '<p>No contract content available.</p>';
  }

  function setupContractHandlers() {
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

        showStep('success');
      } catch (err) {
        showError(err.message);
        signContractBtn.disabled = false;
        signContractBtn.textContent = 'Sign Contract';
      }
    });
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
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }
  }
}());
