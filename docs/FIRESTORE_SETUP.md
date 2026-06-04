# Firestore Setup Guide

This document guides the setup of Firestore for product submission logging.

## Prerequisites

- Firebase project (create at https://console.firebase.google.com)
- Service account with Cloud Datastore User role
- Environment variables configured on MochaHost

## Step 1: Create Firestore Database

1. Go to Firebase Console → Select your project
2. Left sidebar → Firestore Database
3. Click "Create Database"
4. Start in **production mode** (security rules will restrict write access)
5. Choose region: `us-central1` (or your preferred region)
6. Click "Create"

## Step 2: Security Rules (Included in firestore.rules)

The Firestore security rules for `product_submissions` are already defined in `firestore.rules`:

```
match /product_submissions/{submissionId} {
  allow create, write: if false; // PHP uses OAuth2-authenticated REST API
  allow read: if false;           // Admin access TBD (future)
}
```

**Why `if false`?**

The PHP backend uses the Firestore REST API with OAuth2 service account credentials, which **bypasses Firestore security rules entirely**. The rule is set to `if false` to prevent accidental client writes via the normal Firestore SDK while the PHP service account writes directly via the REST API.

**Verification in Firebase Console:**

1. Go to Firebase Console → Your project → Firestore Database → Rules tab
2. Confirm the rules contain the `match /product_submissions/{...}` rule shown above
3. Rules should have been deployed automatically — no manual changes needed for this step

## Step 3: Create Service Account

1. Firebase Console → Project Settings (gear icon) → Service Accounts
2. Click "Generate New Private Key"
3. A JSON file downloads — save it securely
4. Copy the entire JSON content

## Step 4: Set Environment Variables

1. SSH to MochaHost or access via cPanel File Manager
2. Add to `.env` file in the document root:

```
FIREBASE_PROJECT_ID=mojo-ai-studio
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"mojo-ai-studio",...}
```

Replace `mojo-ai-studio` with your Firebase project ID and paste the full JSON from Step 3.

Alternatively, via cPanel:
1. cPanel → Software → PHP → Environment Variables
2. Add `FIREBASE_PROJECT_ID` with your project ID
3. Add `FIREBASE_SERVICE_ACCOUNT_JSON` with the full JSON (as single line)

## Step 5: Verify Setup

1. Test the `/products/pages/submit.html` form with valid data
2. Check Firestore console → `product_submissions` collection
3. Confirm a new document appears with all submitted fields
4. Check server error logs (`error_log`) for any Firestore auth failures

## Troubleshooting

**"FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_JSON not set"**
- Verify environment variables are set in cPanel or `.env`
- Reload the page or restart PHP

**"HTTP 403 Forbidden" from Firestore API**
- Verify service account has Cloud Datastore User role in Google Cloud Console
- Check that security rules are published

**"Write to product_submissions failed — HTTP 400"**
- Check error logs for JSON schema validation errors
- Verify all required fields are being sent by the PHP script

## Future: Firestore Indexes

If you add queries to filter/sort submissions by status or date, create indexes:

1. Firestore Console → Indexes tab
2. Create composite index on `product_submissions`:
   - Field 1: `status` (Ascending)
   - Field 2: `submittedAt` (Descending)
3. Click "Create Index"

For now, this is not needed — submissions are write-only from the form.
