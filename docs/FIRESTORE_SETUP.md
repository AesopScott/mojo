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

## Step 2: Create Security Rules

1. In Firestore Console, go to **Rules** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Product submissions: authenticated service account write, admin read
    match /product_submissions/{document=**} {
      allow create, write: if request.auth.uid != null || isServiceAccount();
      allow read: if isAdmin();
    }
    
    // Helper functions
    function isServiceAccount() {
      return request.auth.uid == null && 
             request.headers['authorization'] != null;
    }
    
    function isAdmin() {
      return request.auth.uid == 'admin-uid' || 
             isServiceAccount();
    }
  }
}
```

3. Click "Publish" to deploy the rules

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
