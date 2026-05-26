/**
 * portal-auth.js — Firebase Auth for the Mojo AI Studio customer portal.
 * Handles sign-in, sign-up, tab switching, and password reset.
 *
 * Depends on: firebase-app-compat.js, firebase-auth-compat.js, firebase-config.js
 */

(function () {
  var auth = firebase.auth();

  /* ── If already signed in, skip to dashboard ── */
  auth.onAuthStateChanged(function (user) {
    if (user) {
      window.location.replace('dashboard.html');
    }
  });

  /* ── Tab switching ── */
  var signinForm = document.getElementById('signin-form');
  var signupForm = document.getElementById('signup-form');

  document.querySelectorAll('.auth-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.auth-tab').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      var which = tab.getAttribute('data-tab');
      signinForm.hidden = which !== 'signin';
      signupForm.hidden = which !== 'signup';
      clearErrors();
    });
  });

  /* ── Helpers ── */
  function clearErrors() {
    ['signin-error', 'signup-error'].forEach(function (id) {
      var el = document.getElementById(id);
      el.hidden = true;
      el.textContent = '';
      el.style.color = '';
    });
  }

  function showError(id, message, isSuccess) {
    var el = document.getElementById(id);
    el.textContent = message;
    el.hidden = false;
    el.style.color = isSuccess ? 'var(--green, #16a34a)' : '';
  }

  function friendlyError(code) {
    var map = {
      'auth/user-not-found':     'No account found with that email.',
      'auth/wrong-password':     'Incorrect password.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/invalid-email':      'Please enter a valid email address.',
      'auth/email-already-in-use': 'An account with that email already exists. Try signing in.',
      'auth/weak-password':      'Password must be at least 8 characters.',
      'auth/too-many-requests':  'Too many attempts — please wait a moment and try again.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  function setLoading(btn, originalText, isLoading) {
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Please wait…' : originalText;
  }

  /* ── Sign in ── */
  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var email    = document.getElementById('signin-email').value.trim();
    var password = document.getElementById('signin-password').value;
    var btn      = signinForm.querySelector('button[type="submit"]');

    setLoading(btn, 'Sign in', true);

    auth.signInWithEmailAndPassword(email, password)
      .catch(function (err) {
        showError('signin-error', friendlyError(err.code));
        setLoading(btn, 'Sign in', false);
      });
  });

  /* ── Sign up ── */
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var email    = document.getElementById('signup-email').value.trim();
    var password = document.getElementById('signup-password').value;
    var confirm  = document.getElementById('signup-confirm').value;
    var btn      = signupForm.querySelector('button[type="submit"]');

    if (password !== confirm) {
      showError('signup-error', 'Passwords do not match.');
      return;
    }

    setLoading(btn, 'Create account', true);

    auth.createUserWithEmailAndPassword(email, password)
      .catch(function (err) {
        showError('signup-error', friendlyError(err.code));
        setLoading(btn, 'Create account', false);
      });
  });

  /* ── Forgot password ── */
  var forgotLink = document.getElementById('forgot-password');
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      var email = document.getElementById('signin-email').value.trim();
      if (!email) {
        showError('signin-error', 'Enter your email address above, then click "Forgot password".');
        return;
      }
      auth.sendPasswordResetEmail(email)
        .then(function () {
          showError('signin-error', '✓ Reset email sent — check your inbox.', true);
        })
        .catch(function (err) {
          showError('signin-error', friendlyError(err.code));
        });
    });
  }
}());
