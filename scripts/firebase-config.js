/**
 * firebase-config.js — Firebase project configuration.
 *
 * Fill in your values from:
 *   Firebase Console → Project Settings → Your apps → SDK setup and configuration
 *
 * This file is loaded before any auth or dashboard scripts.
 */

var firebaseConfig = {
  apiKey:            'REPLACE_WITH_API_KEY',
  authDomain:        'REPLACE_WITH_PROJECT_ID.firebaseapp.com',
  projectId:         'REPLACE_WITH_PROJECT_ID',
  storageBucket:     'REPLACE_WITH_PROJECT_ID.appspot.com',
  messagingSenderId: 'REPLACE_WITH_MESSAGING_SENDER_ID',
  appId:             'REPLACE_WITH_APP_ID',
};

firebase.initializeApp(firebaseConfig);
