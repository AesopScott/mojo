<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Step 1: PHP is alive
$out = array('ok' => false, 'step' => 1);

// Step 2: Can we load the .env file?
$envPath = dirname(dirname(__FILE__)) . '/.env';
$token   = '';
$zoneId  = '';

if (is_readable($envPath)) {
    $out['step'] = 2;
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($lines)) {
        $out['step'] = 3;
        foreach ($lines as $line) {
            if (strpos($line, 'CF_API_TOKEN=') === 0)  $token  = trim(substr($line, 13));
            if (strpos($line, 'CF_ZONE_ID=') === 0)    $zoneId = trim(substr($line, 11));
        }
        if ($token && $zoneId) {
            $out['step'] = 4;
            $out['ok']   = true;
        } else {
            $out['error'] = 'token=' . (int)(bool)$token . ' zone=' . (int)(bool)$zoneId;
        }
    }
} else {
    $out['error'] = 'env not readable at: ' . $envPath;
}

echo json_encode($out);
