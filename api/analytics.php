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
if (!$token || !$zoneId) { echo json_encode(array('ok' => false, 'step' => 'no creds')); exit; }

// Cache check
$step = 'cache';
$cacheFile = sys_get_temp_dir() . '/mojo_cf_' . substr(md5($zoneId), 0, 8) . '.json';

// Date calc
$step = 'date';
$sevenDaysAgo = gmdate('Y-m-d', strtotime('-7 days'));
$oneDayAgo    = gmdate('Y-m-d\TH:i:s\Z', strtotime('-24 hours'));

// Query build
$step = 'query';
$cfUrl = 'https://api.cloudflare.com/client/v4/graphql';
$query = '{ viewer { zones(filter: { zoneTag: "' . $zoneId . '" }) {' .
    ' week: httpRequests1dGroups(orderBy: [date_ASC] limit: 7 filter: { date_geq: "' . $sevenDaysAgo . '" }) { sum { visits } }' .
    ' day: httpRequests1hGroups(orderBy: [datetime_ASC] limit: 24 filter: { datetime_geq: "' . $oneDayAgo . '" }) { sum { visits } }' .
    ' } } }';
$body = json_encode(array('query' => $query));
$authHdr = 'Authorization: Bearer ' . $token;

// Return before HTTP call
echo json_encode(array('ok' => true, 'step' => $step, 'has_curl' => function_exists('curl_init')));
