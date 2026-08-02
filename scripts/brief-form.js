/**
 * brief-form.js — Client-side handler for the teaching build intake form.
 *
 * Submits form data and an optional quote file to /api/submit-brief.
 * On success, redirects to the confirmation page.
 * On failure, shows an inline error without losing the user's data.
 */

(function () {
  var form = document.getElementById('brief-form');
  if (!form) { return; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.textContent;
    var fileInput = form.querySelector('input[type="file"][name="quoteFile"]');
    var quoteFile = fileInput && fileInput.files ? fileInput.files[0] : null;
    var maxFileSize = 8 * 1024 * 1024;

    if (quoteFile && quoteFile.size > maxFileSize) {
      showError('Please upload a quote file smaller than 8 MB.');
      return;
    }

    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    var data = new FormData(form);

    fetch('/api/submit-brief', {
      method: 'POST',
      body: data,
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
        window.location.href = '/request/pages/confirmation.html';
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
