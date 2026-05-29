<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Load credentials
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
    http_response_code(503);
    echo json_encode(array('ok' => false));
    exit;
}

// 1-hour file cache
$cacheFile = sys_get_temp_dir() . '/mojo_cf_' . substr(md5($zoneId), 0, 8) . '.json';
if (@file_exists($cacheFile) && (time() - @filemtime($cacheFile)) < 3600) {
    $cached = @file_get_contents($cacheFile);
    if ($cached !== false && $cached !== '') {
        header('Cache-Control: public, max-age=3600');
        echo $cached;
        exit;
    }
}

// Date ranges
$sevenDaysAgo = gmdate('Y-m-d', strtotime('-7 days'));
$oneDayAgo    = gmdate('Y-m-d\TH:i:s\Z', strtotime('-24 hours'));

// POST to Cloudflare GraphQL via stream_context
$cfUrl = 'https://api.cloudflare.com/client/v4/graphql';
$query = '{ viewer { zones(filter: { zoneTag: "' . $zoneId . '" }) {'
    . ' week: httpRequests1dGroups(orderBy: [date_ASC] limit: 7 filter: { date_geq: "' . $sevenDaysAgo . '" }) { sum { pageViews } }'
    . ' day: httpRequests1hGroups(orderBy: [datetime_ASC] limit: 24 filter: { datetime_geq: "' . $oneDayAgo . '" }) { sum { pageViews } }'
    . ' } } }';
$body = json_encode(array('query' => $query));

$context = stream_context_create(array(
    'http' => array(
        'method'        => 'POST',
        'header'        => 'Authorization: Bearer ' . $token . "\r\nContent-Type: application/json\r\n",
        'content'       => $body,
        'timeout'       => 10,
        'ignore_errors' => true,
    ),
));
$response = @file_get_contents($cfUrl, false, $context);
$httpCode = 0;
if (isset($http_response_header[0]) && preg_match('/HTTP\/\S+\s+(\d{3})/', $http_response_header[0], $m)) {
    $httpCode = (int) $m[1];
}

if ($response === false || $httpCode !== 200) {
    http_response_code(502);
    echo json_encode(array('ok' => false, 'http' => $httpCode));
    exit;
}

$data  = json_decode($response, true);
$zones = isset($data['data']['viewer']['zones'][0]) ? $data['data']['viewer']['zones'][0] : null;

if ($zones === null) {
    http_response_code(502);
    echo json_encode(array('ok' => false, 'raw' => substr((string)$response, 0, 300)));
    exit;
}

$weekVisits = 0;
$dayVisits  = 0;
foreach (isset($zones['week']) ? $zones['week'] : array() as $row) {
    $weekVisits += isset($row['sum']['pageViews']) ? (int) $row['sum']['pageViews'] : 0;
}
foreach (isset($zones['day']) ? $zones['day'] : array() as $row) {
    $dayVisits += isset($row['sum']['pageViews']) ? (int) $row['sum']['pageViews'] : 0;
}

$result = json_encode(array('ok' => true, 'week' => $weekVisits, 'day' => $dayVisits));
@file_put_contents($cacheFile, $result);
header('Cache-Control: public, max-age=3600');
echo $result;
