<?php
/**
 * Local Meetup OAuth helper.
 *
 * Usage:
 *   php scripts/meetup-oauth-test.php auth-url
 *   php scripts/meetup-oauth-test.php exchange-code CODE
 *
 * Requires .env:
 *   MEETUP_CLIENT_ID=
 *   MEETUP_CLIENT_SECRET=
 *   MEETUP_REDIRECT_URI=https://mojoaistudio.com/oauth/meetup/callback
 */

declare(strict_types=1);

const MEETUP_AUTHORIZE_ENDPOINT = 'https://secure.meetup.com/oauth2/authorize';
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
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
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
        }
    }
}

function envValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function requireEnv(string $name): string {
    $value = envValue($name);
    if ($value === '') {
        fwrite(STDERR, "Missing {$name}. Add it to .env first.\n");
        exit(1);
    }

    return $value;
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

function maskToken(?string $token): ?string {
    if ($token === null || $token === '') {
        return $token;
    }

    return strlen($token) <= 12 ? str_repeat('*', strlen($token)) : substr($token, 0, 6) . '...' . substr($token, -4);
}

loadEnvFile(dirname(__DIR__) . '/.env');

$command = $argv[1] ?? '';
$redirectUri = envValue('MEETUP_REDIRECT_URI', 'https://mojoaistudio.com/oauth/meetup/callback');

if ($command === 'auth-url') {
    $clientId = requireEnv('MEETUP_CLIENT_ID');
    $state = bin2hex(random_bytes(16));
    $url = MEETUP_AUTHORIZE_ENDPOINT . '?' . http_build_query([
        'client_id' => $clientId,
        'response_type' => 'code',
        'redirect_uri' => $redirectUri,
        'state' => $state,
    ], '', '&', PHP_QUERY_RFC3986);

    echo $url . PHP_EOL;
    echo 'State: ' . $state . PHP_EOL;
    exit(0);
}

if ($command === 'exchange-code') {
    $code = trim($argv[2] ?? '');
    if ($code === '') {
        fwrite(STDERR, "Usage: php scripts/meetup-oauth-test.php exchange-code CODE\n");
        exit(1);
    }

    [$status, $responseBody, $transportError] = postForm(MEETUP_TOKEN_ENDPOINT, [
        'client_id' => requireEnv('MEETUP_CLIENT_ID'),
        'client_secret' => requireEnv('MEETUP_CLIENT_SECRET'),
        'grant_type' => 'authorization_code',
        'redirect_uri' => $redirectUri,
        'code' => $code,
    ]);

    if ($transportError !== '') {
        fwrite(STDERR, "Transport error: {$transportError}\n");
        exit(1);
    }

    $tokens = json_decode($responseBody, true);
    if (!is_array($tokens) || $status < 200 || $status >= 300) {
        fwrite(STDERR, "Meetup token exchange failed with HTTP {$status}.\n");
        fwrite(STDERR, $responseBody . "\n");
        exit(1);
    }

    $safe = $tokens;
    $safe['access_token'] = maskToken($safe['access_token'] ?? null);
    $safe['refresh_token'] = maskToken($safe['refresh_token'] ?? null);

    echo json_encode($safe, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(0);
}

fwrite(STDERR, "Usage:\n");
fwrite(STDERR, "  php scripts/meetup-oauth-test.php auth-url\n");
fwrite(STDERR, "  php scripts/meetup-oauth-test.php exchange-code CODE\n");
exit(1);
