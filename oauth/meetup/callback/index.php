<?php
/**
 * Meetup OAuth callback.
 *
 * Registered redirect URL:
 * https://mojoaistudio.com/oauth/meetup/callback
 *
 * Exchanges an authorization code for Meetup access credentials. By default,
 * token values are masked in the browser. Set MEETUP_TOKEN_STORE to an
 * absolute path outside the web root if this endpoint should persist tokens.
 */

declare(strict_types=1);

const MEETUP_TOKEN_ENDPOINT = 'https://secure.meetup.com/oauth2/access';

function loadEnvFile(string $path): void {
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if ($value !== '' && (
            ($value[0] === '"' && substr($value, -1) === '"') ||
            ($value[0] === "'" && substr($value, -1) === "'")
        )) {
            $value = substr($value, 1, -1);
        }

        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

function loadFirstEnvFile(array $paths): ?string {
    foreach ($paths as $path) {
        if (is_readable($path)) {
            loadEnvFile($path);
            return $path;
        }
    }

    return null;
}

function envValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function maskToken(?string $token): ?string {
    if ($token === null || $token === '') {
        return $token;
    }

    $length = strlen($token);
    if ($length <= 12) {
        return str_repeat('*', $length);
    }

    return substr($token, 0, 6) . '...' . substr($token, -4);
}

function renderPage(string $title, string $message, array $details = [], int $status = 200): void {
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');

    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . html($title) . '</title>';
    echo '<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:760px;margin:64px auto;padding:0 20px;line-height:1.5;color:#16161d}';
    echo '.card{border:1px solid #ddd;border-radius:8px;padding:24px;background:#fff}.muted{color:#666}code,pre{background:#f6f6f8;border-radius:6px}code{padding:2px 5px}pre{padding:14px;overflow:auto}</style>';
    echo '</head><body><main class="card">';
    echo '<p class="muted">Meetup OAuth</p>';
    echo '<h1>' . html($title) . '</h1>';
    echo '<p>' . html($message) . '</p>';

    if (!empty($details)) {
        echo '<pre>' . html(json_encode($details, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre>';
    }

    echo '</main></body></html>';
    exit;
}

function postForm(string $url, array $fields): array {
    $body = http_build_query($fields, '', '&', PHP_QUERY_RFC3986);

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT => 20,
        ]);

        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        return [$status, $responseBody === false ? '' : $responseBody, $error];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [$status, $responseBody === false ? '' : $responseBody, ''];
}

function storeTokens(array $tokens, string $path): void {
    if ($path === '') {
        return;
    }

    $directory = dirname($path);
    if (!is_dir($directory) || !is_writable($directory)) {
        throw new RuntimeException('Token store directory is not writable.');
    }

    $payload = $tokens;
    $payload['stored_at'] = gmdate('c');

    $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write token store.');
    }
}

$projectRoot = dirname(__DIR__, 3);
$loadedEnv = loadFirstEnvFile([
    $projectRoot . '/.env',
    dirname($projectRoot) . '/.env',
    dirname($projectRoot, 2) . '/.env',
    dirname($projectRoot, 2) . '/mojo.env',
]);

$error = $_GET['error'] ?? '';
if ($error !== '') {
    renderPage('Authorization declined', 'Meetup returned an OAuth error.', [
        'error' => $error,
        'state' => $_GET['state'] ?? null,
    ], 400);
}

$code = trim((string) ($_GET['code'] ?? ''));
if ($code === '') {
    renderPage('Callback installed', 'This endpoint is ready. It will exchange a Meetup authorization code once Meetup redirects back here.');
}

$clientId = envValue('MEETUP_CLIENT_ID');
$clientSecret = envValue('MEETUP_CLIENT_SECRET');
$redirectUri = envValue('MEETUP_REDIRECT_URI', 'https://mojoaistudio.com/oauth/meetup/callback');

if ($clientId === '' || $clientSecret === '') {
    renderPage('Missing Meetup credentials', 'Set MEETUP_CLIENT_ID and MEETUP_CLIENT_SECRET before exchanging authorization codes.', [
        'has_client_id' => $clientId !== '',
        'has_client_secret' => $clientSecret !== '',
        'redirect_uri' => $redirectUri,
        'env_file_loaded' => $loadedEnv !== null,
    ], 500);
}

[$status, $responseBody, $transportError] = postForm(MEETUP_TOKEN_ENDPOINT, [
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'grant_type' => 'authorization_code',
    'redirect_uri' => $redirectUri,
    'code' => $code,
]);

if ($transportError !== '') {
    renderPage('Token exchange failed', 'The request to Meetup could not be completed.', [
        'transport_error' => $transportError,
    ], 502);
}

$tokens = json_decode($responseBody, true);
if (!is_array($tokens) || $status < 200 || $status >= 300) {
    renderPage('Token exchange rejected', 'Meetup did not accept the authorization code exchange.', [
        'http_status' => $status,
        'response' => $tokens ?? $responseBody,
    ], 502);
}

$stored = false;
$storeError = null;

try {
    $tokenStore = envValue('MEETUP_TOKEN_STORE');
    if ($tokenStore !== '') {
        storeTokens($tokens, $tokenStore);
        $stored = true;
    }
} catch (Throwable $exception) {
    $storeError = $exception->getMessage();
}

renderPage('Meetup authorization connected', 'The authorization code was exchanged successfully.', [
    'token_type' => $tokens['token_type'] ?? null,
    'expires_in' => $tokens['expires_in'] ?? null,
    'access_token' => maskToken($tokens['access_token'] ?? null),
    'refresh_token' => maskToken($tokens['refresh_token'] ?? null),
    'stored' => $stored,
    'store_error' => $storeError,
]);
