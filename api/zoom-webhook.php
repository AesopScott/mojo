<?php
/**
 * Zoom webhook receiver.
 *
 * Handles Zoom endpoint URL validation and accepts future webhook events.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function zoomRespond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function zoomLoadEnvFile(string $path): void {
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

function zoomLoadProjectEnv(): void {
    $projectRoot = dirname(__DIR__);
    foreach ([
        $projectRoot . '/.env',
        dirname($projectRoot) . '/.env',
        dirname($projectRoot, 2) . '/.env',
        dirname($projectRoot, 2) . '/mojo.env',
    ] as $path) {
        if (is_readable($path)) {
            zoomLoadEnvFile($path);
            return;
        }
    }
}

function zoomEnvValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function zoomStorePath(): string {
    $configured = zoomEnvValue('ZOOM_WEBHOOK_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/zoom-webhook-events.jsonl';
}

function zoomAppendEvent(array $event): void {
    $path = zoomStorePath();
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        throw new RuntimeException('Unable to create Zoom webhook store directory.');
    }

    $encoded = json_encode($event, JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
        throw new RuntimeException('Unable to write Zoom webhook event.');
    }
}

zoomLoadProjectEnv();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    zoomRespond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$rawBody = (string) file_get_contents('php://input');
$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    zoomRespond(400, ['ok' => false, 'message' => 'Expected JSON body.']);
}

$event = (string) ($payload['event'] ?? '');
$secretToken = zoomEnvValue('ZOOM_SECRET_TOKEN');

if ($event === 'endpoint.url_validation') {
    $plainToken = (string) ($payload['payload']['plainToken'] ?? '');
    if ($plainToken === '') {
        zoomRespond(400, ['message' => 'Missing plainToken.']);
    }
    if ($secretToken === '') {
        zoomRespond(500, ['message' => 'Zoom secret token is not configured.']);
    }

    zoomRespond(200, [
        'plainToken' => $plainToken,
        'encryptedToken' => hash_hmac('sha256', $plainToken, $secretToken),
    ]);
}

try {
    zoomAppendEvent([
        'receivedAt' => gmdate('c'),
        'event' => $event,
        'event_ts' => $payload['event_ts'] ?? null,
        'payload' => $payload['payload'] ?? null,
    ]);
} catch (Throwable $throwable) {
    error_log('[zoom-webhook] ' . $throwable->getMessage());
    zoomRespond(500, ['ok' => false, 'message' => 'Unable to store webhook event.']);
}

zoomRespond(200, ['ok' => true]);
