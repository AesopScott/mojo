<?php
/**
 * Public Zoom activity summary for the Watch page.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function zoomStatusRespond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function zoomStatusLoadEnvFile(string $path): void {
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

function zoomStatusLoadProjectEnv(): void {
    $projectRoot = dirname(__DIR__);
    foreach ([
        $projectRoot . '/.env',
        dirname($projectRoot) . '/.env',
        dirname($projectRoot, 2) . '/.env',
        dirname($projectRoot, 2) . '/mojo.env',
    ] as $path) {
        if (is_readable($path)) {
            zoomStatusLoadEnvFile($path);
            return;
        }
    }
}

function zoomStatusEnvValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function zoomStatusStorePath(): string {
    $configured = zoomStatusEnvValue('ZOOM_WEBHOOK_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/zoom-webhook-events.jsonl';
}

function zoomStatusEventKey(string $event): ?string {
    $normalized = strtolower(trim($event));
    if ($normalized === 'meeting.created') {
        return 'meeting_created';
    }
    if ($normalized === 'meeting.updated') {
        return 'meeting_updated';
    }
    if (strpos($normalized, 'participant_joined') !== false || strpos($normalized, 'participant.joined') !== false) {
        return 'participant_joined';
    }

    return null;
}

function zoomStatusEventLabel(string $key): string {
    switch ($key) {
        case 'meeting_created':
            return 'Meeting created';
        case 'meeting_updated':
            return 'Meeting updated';
        case 'participant_joined':
            return 'Attendee joined';
        default:
            return 'Zoom event';
    }
}

function zoomStatusMeetingTopic(array $event): string {
    $payload = $event['payload'] ?? [];
    $object = is_array($payload) ? ($payload['object'] ?? []) : [];
    $topic = is_array($object) ? (string) ($object['topic'] ?? '') : '';
    $topic = trim($topic);

    return $topic === '' ? 'Advanced AI Concepts session' : substr($topic, 0, 90);
}

function zoomStatusRecentLines(string $path, int $limit = 1000): array {
    if (!is_readable($path)) {
        return [];
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return [];
    }

    return array_slice($lines, -$limit);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    zoomStatusRespond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

zoomStatusLoadProjectEnv();

$counts = [
    'meeting_created' => 0,
    'participant_joined' => 0,
    'meeting_updated' => 0,
];
$latest = [];

foreach (zoomStatusRecentLines(zoomStatusStorePath()) as $line) {
    $event = json_decode($line, true);
    if (!is_array($event)) {
        continue;
    }

    $key = zoomStatusEventKey((string) ($event['event'] ?? ''));
    if ($key === null) {
        continue;
    }

    $counts[$key]++;
    $latest[] = [
        'type' => $key,
        'label' => zoomStatusEventLabel($key),
        'topic' => zoomStatusMeetingTopic($event),
        'receivedAt' => (string) ($event['receivedAt'] ?? ''),
    ];
}

$latest = array_reverse(array_slice($latest, -5));

zoomStatusRespond(200, [
    'ok' => true,
    'updatedAt' => gmdate('c'),
    'counts' => $counts,
    'latest' => $latest,
]);
