<?php
/**
 * firestore-lib.php — Firestore REST API helper for PHP shared hosting.
 *
 * Requires two environment variables:
 *   FIREBASE_PROJECT_ID           — e.g. "mojo-ai-studio"
 *   FIREBASE_SERVICE_ACCOUNT_JSON — full contents of the service account JSON key file
 *
 * To get the key: Firebase Console → Project Settings → Service Accounts →
 * Generate new private key.  Paste the entire JSON as the env var value.
 *
 * The service account needs the "Cloud Datastore User" IAM role (or a custom
 * role with datastore.documents.create).
 */

declare(strict_types=1);

/**
 * Add a document to a Firestore collection.
 * Returns true on success, false on any failure (never throws).
 *
 * Supported field types: string, int, float, bool, null, DateTimeInterface.
 * Arrays/nested objects are not supported by this minimal helper.
 */
function firestoreAddDocument(string $collection, array $fields): bool
{
    $projectId = getenv('FIREBASE_PROJECT_ID');
    $saJson    = getenv('FIREBASE_SERVICE_ACCOUNT_JSON');

    if (!$projectId || !$saJson) {
        error_log('[Firestore] FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_JSON not set');
        return false;
    }

    $sa = json_decode($saJson, true);
    if (!is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) {
        error_log('[Firestore] FIREBASE_SERVICE_ACCOUNT_JSON is malformed');
        return false;
    }

    $token = firestoreGetAccessToken($sa['client_email'], $sa['private_key']);
    if ($token === null) {
        return false;
    }

    $url      = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/{$collection}";
    $document = ['fields' => firestoreEncodeFields($fields)];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($document),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
        ],
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        error_log('[Firestore] curl error writing to ' . $collection . ': ' . $curlErr);
        return false;
    }

    if ($status !== 200) {
        error_log('[Firestore] Write to ' . $collection . ' failed — HTTP ' . $status . ' — ' . $response);
        return false;
    }

    return true;
}

function firestoreGetAccessToken(string $clientEmail, string $privateKey): ?string
{
    $now = time();

    $header  = firestoreBase64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $payload = firestoreBase64UrlEncode(json_encode([
        'iss'   => $clientEmail,
        'scope' => 'https://www.googleapis.com/auth/datastore',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]));

    $signingInput = $header . '.' . $payload;

    if (!openssl_sign($signingInput, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
        error_log('[Firestore] openssl_sign failed — check private key format');
        return null;
    }

    $jwt = $signingInput . '.' . firestoreBase64UrlEncode($signature);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $curlErr  = curl_error($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curlErr) {
        error_log('[Firestore] curl error fetching OAuth2 token: ' . $curlErr);
        return null;
    }

    if ($status !== 200) {
        error_log('[Firestore] OAuth2 token exchange failed — HTTP ' . $status . ' — ' . $response);
        return null;
    }

    $parsed = json_decode($response, true);
    if (empty($parsed['access_token'])) {
        error_log('[Firestore] OAuth2 response missing access_token');
        return null;
    }

    return $parsed['access_token'];
}

function firestoreEncodeFields(array $fields): array
{
    $encoded = [];
    foreach ($fields as $key => $value) {
        if ($value === null) {
            $encoded[$key] = ['nullValue' => null];
        } elseif (is_bool($value)) {
            $encoded[$key] = ['booleanValue' => $value];
        } elseif (is_int($value)) {
            $encoded[$key] = ['integerValue' => (string) $value];
        } elseif (is_float($value)) {
            $encoded[$key] = ['doubleValue' => $value];
        } elseif ($value instanceof DateTimeInterface) {
            $encoded[$key] = ['timestampValue' => $value->format(DateTimeInterface::RFC3339_EXTENDED)];
        } else {
            $encoded[$key] = ['stringValue' => (string) $value];
        }
    }
    return $encoded;
}

function firestoreBase64UrlEncode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
