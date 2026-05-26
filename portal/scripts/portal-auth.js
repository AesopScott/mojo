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

  /* ── Google sign-in ── */
  var googleBtn = document.getElementById('google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      googleBtn.disabled = true;
      googleBtn.textContent = 'Signing in…';

      auth.signInWithPopup(provider)
        .catch(function (err) {
          if (err.code !== 'auth/popup-closed-by-user') {
            showError('google-error', friendlyError(err.code));
          }
          googleBtn.disabled = false;
          googleBtn.innerHTML =
            '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">' +
            '<path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>' +
            '<path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>' +
            '<path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z"/>' +
            '<path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>' +
            '</svg> Continue with Google';
        });
    });
  }

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
