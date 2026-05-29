<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Load credentials (same as working probe)
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

// Build a minimal test query
$cfUrl = 'https://api.cloudflare.com/client/v4/graphql';
$body  = json_encode(array('query' => '{ viewer { __typename } }'));

// Test curl_init
$ch = curl_init($cfUrl);
if ($ch === false) {
    echo json_encode(array('ok' => false, 'step' => 'curl_init failed'));
    exit;
}

curl_setopt($ch, CURLOPT_POST,           true);
curl_setopt($ch, CURLOPT_POSTFIELDS,     $body);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Authorization: Bearer ' . $token, 'Content-Type: application/json'));
curl_setopt($ch, CURLOPT_TIMEOUT,        10);
$response = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

echo json_encode(array(
    'ok'       => ($httpCode === 200),
    'step'     => 'curl done',
    'http'     => $httpCode,
    'curl_err' => $curlErr,
    'raw'      => substr((string)$response, 0, 200),
));
