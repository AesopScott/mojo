<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed = array('https://mojoaistudio.com', 'https://www.mojoaistudio.com');
if ($origin === '' || in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . ($origin ? $origin : '*'));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(array('ok' => false));
    exit;
}

// ── Load credentials from .env ────────────────────────────────────────────────
$token  = '';
$zoneId = '';
$envPath = dirname(dirname(__FILE__)) . '/.env';

if (is_readable($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($lines)) {
        foreach ($lines as $line) {
            if (strpos($line, 'CF_API_TOKEN=') === 0) $token  = trim(substr($line, 13));
            if (strpos($line, 'CF_ZONE_ID=') === 0)   $zoneId = trim(substr($line, 11));
        }
    }
}

if (!$token || !$zoneId) {
    header('Cache-Control: no-store');
    http_response_code(503);
    echo json_encode(array('ok' => false, 'message' => 'Analytics not configured.'));
    exit;
}

// ── 1-hour file cache ─────────────────────────────────────────────────────────
$cacheFile = sys_get_temp_dir() . '/mojo_cf_' . substr(md5($zoneId), 0, 8) . '.json';
if (@file_exists($cacheFile) && (time() - @filemtime($cacheFile)) < 3600) {
    $cached = @file_get_contents($cacheFile);
    if ($cached !== false && $cached !== '') {
        header('Cache-Control: public, max-age=3600');
        echo $cached;
        exit;
    }
}

// ── Date ranges ───────────────────────────────────────────────────────────────
$sevenDaysAgo = gmdate('Y-m-d', strtotime('-7 days'));
$oneDayAgo    = gmdate('Y-m-d\TH:i:s\Z', strtotime('-24 hours'));

// ── Build GraphQL query ───────────────────────────────────────────────────────
$cfUrl = 'https://api.cloudflare.com/client/v4/graphql';
$query = '{ viewer { zones(filter: { zoneTag: "' . $zoneId . '" }) {' .
    ' week: httpRequests1dGroups(orderBy: [date_ASC] limit: 7 filter: { date_geq: "' . $sevenDaysAgo . '" }) { sum { visits } }' .
    ' day: httpRequests1hGroups(orderBy: [datetime_ASC] limit: 24 filter: { datetime_geq: "' . $oneDayAgo . '" }) { sum { visits } }' .
    ' } } }';
$body    = json_encode(array('query' => $query));
$authHdr = 'Authorization: Bearer ' . $token;

// ── POST to Cloudflare (curl with stream_context fallback) ────────────────────
$response = false;
$httpCode = 0;

if (function_exists('curl_init')) {
    $ch = curl_init($cfUrl);
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => false,
        CURLOPT_HTTPHEADER     => array($authHdr, 'Content-Type: application/json'),
        CURLOPT_TIMEOUT        => 10,
    ));
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
} else {
    $context = stream_context_create(array(
        'http' => array(
            'method'        => 'POST',
            'header'        => $authHdr . "\r\nContent-Type: application/json\r\n",
            'content'       => $body,
            'timeout'       => 10,
            'ignore_errors' => true,
        ),
    ));
    $response = @file_get_contents($cfUrl, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $httpCode = (int) $m[1];
    }
}

if ($response === false || $httpCode !== 200) {
    error_log('[mojo/analytics] Cloudflare API error HTTP ' . $httpCode);
    http_response_code(502);
    echo json_encode(array('ok' => false));
    exit;
}

// ── Parse response ────────────────────────────────────────────────────────────
$data  = json_decode($response, true);
$zones = isset($data['data']['viewer']['zones'][0]) ? $data['data']['viewer']['zones'][0] : null;

if ($zones === null) {
    error_log('[mojo/analytics] No zone data in Cloudflare response.');
    http_response_code(502);
    echo json_encode(array('ok' => false));
    exit;
}

$weekRows   = isset($zones['week']) ? $zones['week'] : array();
$dayRows    = isset($zones['day'])  ? $zones['day']  : array();
$weekVisits = 0;
$dayVisits  = 0;

foreach ($weekRows as $row) { $weekVisits += isset($row['sum']['visits']) ? (int)$row['sum']['visits'] : 0; }
foreach ($dayRows  as $row) { $dayVisits  += isset($row['sum']['visits']) ? (int)$row['sum']['visits'] : 0; }

$result = json_encode(array('ok' => true, 'week' => $weekVisits, 'day' => $dayVisits));
@file_put_contents($cacheFile, $result);

header('Cache-Control: public, max-age=3600');
echo $result;
