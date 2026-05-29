<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Load credentials (proven working)
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

// Minimal test query via stream_context only (no curl)
$cfUrl = 'https://api.cloudflare.com/client/v4/graphql';
$body  = json_encode(array('query' => '{ viewer { __typename } }'));

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

echo json_encode(array(
    'ok'   => ($httpCode === 200),
    'step' => 'stream done',
    'http' => $httpCode,
    'raw'  => substr((string) $response, 0, 200),
));
