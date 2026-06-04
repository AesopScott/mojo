/**
 * product-form.js — Client-side handler for the product marketplace submission form.
 *
 * Submits form data as JSON to /api/submit-product.
 * On success, redirects to the product submission confirmation page.
 * On failure, shows an inline error without losing the user's data.
 */

(function () {
  var form = document.getElementById('product-submit-form');
  if (!form) { return; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    var data = {};
    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (field) {
      if (field.name) {
        data[field.name] = field.value;
      }
    });

    fetch('/api/submit-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (body) {
            throw new Error(body.message || 'Server error');
          });
        }
        return res.json();
      })
      .then(function () {
        // Create product listing in Firestore
        return fetch('https://us-central1-mojo-f86de.cloudfunctions.net/createProductFromSubmission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.contactEmail,
            contactName: data.contactName,
            productName: data.productName,
            productDescription: data.productDescription,
            category: data.category,
            pricingModel: data.pricingModel,
            productUrl: data.productUrl,
            targetUser: data.targetUser,
          }),
        }).then(function (res) {
          return res.json();
        }).catch(function (err) {
          console.warn('[product-form] product creation failed:', err);
        });
      })
      .then(function () {
        // Create seller record after product submission succeeds
        return fetch('https://us-central1-mojo-f86de.cloudfunctions.net/createSellerFromProductSubmission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.contactEmail,
            contactName: data.contactName,
            productName: data.productName,
          }),
        }).then(function (res) {
          return res.json().then(function (json) {
            return { status: res.status, data: json };
          });
        }).then(function (result) {
          // If seller creation succeeded, send onboarding email
          if (result.status === 200 && result.data.sellerToken) {
            return fetch('/api/send-seller-onboarding-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: data.contactEmail,
                contactName: data.contactName,
                productName: data.productName,
                sellerToken: result.data.sellerToken,
              }),
            }).catch(function (err) {
              // Log but don't fail - email might be sent via other means
              console.warn('[product-form] onboarding email failed:', err);
            });
          }
        }).catch(function (err) {
          // Log but don't fail
          console.warn('[product-form] seller creation failed:', err);
        });
      })
      .then(function () {
        window.location.href = '/products/pages/confirmation.html';
      })
      .catch(function (err) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showError('Something went wrong: ' + (err.message || 'Please try again or email admin@MojoAiStudio.com.'));
      });
  });

  function showError(message) {
    var existing = document.getElementById('form-error');
    if (existing) { existing.remove(); }

    var errEl = document.createElement('p');
    errEl.id = 'form-error';
    errEl.textContent = message;
    Object.assign(errEl.style, {
      padding: '14px 18px',
      borderRadius: '8px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      fontWeight: '700',
      fontSize: '0.92rem',
      margin: '0',
    });

    var submitRow = form.querySelector('.form-submit');
    form.insertBefore(errEl, submitRow);
    errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}());
