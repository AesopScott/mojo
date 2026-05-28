<?php
/**
 * analytics.php — Cloudflare zone analytics proxy.
 *
 * Accepts:  GET /api/analytics
 * Returns:  JSON { "ok": true, "week": 1234, "day": 56 }
 *
 * Reads CF_API_TOKEN and CF_ZONE_ID from environment variables or the .env
 * file at the project root. Caches the Cloudflare response for 1 hour in the
 * system temp directory to avoid hammering the upstream API.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://mojoaistudio.com', 'https://www.mojoaistudio.com'];
if ($origin === '' || in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// ── Load credentials ──────────────────────────────────────────────────────────
function load_env(string $path): void {
    if (!file_exists($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || substr($line, 0, 1) === '#') continue;
        $parts = explode('=', $line, 2);
        if (count($parts) < 2) continue;
        $key = trim($parts[0]);
        $val = trim($parts[1]);
        if ($key !== '' && getenv($key) === false) {
            putenv("$key=$val");
        }
    }
}

load_env(dirname(__DIR__) . '/.env');

$token  = getenv('CF_API_TOKEN') ?: '';
$zoneId = getenv('CF_ZONE_ID') ?: '';

if ($token === '' || $zoneId === '') {
    header('Cache-Control: no-store');
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Analytics not configured.']);
    exit;
}

// ── 1-hour file cache ─────────────────────────────────────────────────────────
$cacheFile = sys_get_temp_dir() . '/mojo_cf_' . substr(md5($zoneId), 0, 8) . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 3600) {
    header('Cache-Control: public, max-age=3600');
    echo file_get_contents($cacheFile);
    exit;
}

// ── Date ranges ───────────────────────────────────────────────────────────────
$utc          = new DateTimeZone('UTC');
$now          = new DateTimeImmutable('now', $utc);
$sevenDaysAgo = $now->modify('-7 days')->format('Y-m-d');
$oneDayAgo    = $now->modify('-24 hours')->format('Y-m-d\TH:i:s\Z');

// ── Query Cloudflare GraphQL Analytics API ────────────────────────────────────
$query = <<<GQL
{
  viewer {
    zones(filter: { zoneTag: "$zoneId" }) {
      week: httpRequests1dGroups(
        orderBy: [date_ASC]
        limit: 7
        filter: { date_geq: "$sevenDaysAgo" }
      ) {
        sum { visits }
      }
      day: httpRequests1hGroups(
        orderBy: [datetime_ASC]
        limit: 24
        filter: { datetime_geq: "$oneDayAgo" }
      ) {
        sum { visits }
      }
    }
  }
}
GQL;

$ch = curl_init('https://api.cloudflare.com/client/v4/graphql');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['query' => $query]),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT        => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode !== 200) {
    error_log('[mojo/analytics] Cloudflare API error HTTP ' . $httpCode);
    http_response_code(502);
    echo json_encode(['ok' => false]);
    exit;
}

$data  = json_decode($response, true);
$zones = $data['data']['viewer']['zones'][0] ?? null;

if ($zones === null) {
    error_log('[mojo/analytics] No zone data in Cloudflare response.');
    http_response_code(502);
    echo json_encode(['ok' => false]);
    exit;
}

$weekVisits = (int) array_sum(array_column(array_column($zones['week'] ?? [], 'sum'), 'visits'));
$dayVisits  = (int) array_sum(array_column(array_column($zones['day'] ?? [], 'sum'), 'visits'));

$result = json_encode(['ok' => true, 'week' => $weekVisits, 'day' => $dayVisits]);
file_put_contents($cacheFile, $result);

header('Cache-Control: public, max-age=3600');
echo $result;
