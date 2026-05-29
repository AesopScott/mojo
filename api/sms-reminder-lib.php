<?php
/**
 * Shared SMS reminder helpers.
 *
 * Stores only the data needed to invite Meetup RSVPs into SMS reminders and
 * send the requested reminder. Phone numbers are purpose-bound to event SMS.
 */

declare(strict_types=1);

if (isset($_SERVER['SCRIPT_FILENAME']) && realpath((string) $_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    http_response_code(404);
    exit;
}

const MOJO_SMS_CONSENT_TEXT = 'I agree to receive SMS reminders for Advanced AI Concepts events. Mojo AI Studio will use my phone number only for event reminders and SMS service messages, not marketing or any other purpose.';

function smsRespond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function smsEnvValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function smsLoadEnvFile(string $path): void {
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

function smsLoadProjectEnv(): void {
    $projectRoot = dirname(__DIR__);
    foreach ([
        $projectRoot . '/.env',
        dirname($projectRoot) . '/.env',
        dirname($projectRoot, 2) . '/.env',
        dirname($projectRoot, 2) . '/mojo.env',
    ] as $path) {
        if (is_readable($path)) {
            smsLoadEnvFile($path);
            return;
        }
    }
}

function smsStorePath(): string {
    $configured = smsEnvValue('MOJO_SMS_REMINDER_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/mojo-sms-reminders.json';
}

function smsBaseUrl(): string {
    $configured = rtrim(smsEnvValue('MOJO_PUBLIC_BASE_URL'), '/');
    if ($configured !== '') {
        return $configured;
    }

    return 'https://mojoaistudio.com';
}

function smsReadStore(): array {
    $path = smsStorePath();
    if (!is_readable($path)) {
        return ['invites' => [], 'subscriptions' => [], 'messages' => []];
    }

    $decoded = json_decode((string) file_get_contents($path), true);
    if (!is_array($decoded)) {
        return ['invites' => [], 'subscriptions' => [], 'messages' => []];
    }

    return array_replace(['invites' => [], 'subscriptions' => [], 'messages' => []], $decoded);
}

function smsWriteStore(array $store): void {
    $path = smsStorePath();
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        throw new RuntimeException('Unable to create SMS reminder store directory.');
    }

    $encoded = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write SMS reminder store.');
    }
}

function smsInviteKey(string $eventId, string $rsvpId): string {
    return hash('sha256', $eventId . '|' . $rsvpId);
}

function smsFindInviteByToken(array $store, string $token): ?array {
    foreach (($store['invites'] ?? []) as $key => $invite) {
        if (is_array($invite) && hash_equals((string) ($invite['token'] ?? ''), $token)) {
            $invite['_key'] = (string) $key;
            return $invite;
        }
    }

    return null;
}

function smsNormalizePhone(string $phone): string {
    $phone = trim($phone);
    if ($phone === '') {
        return '';
    }

    $digits = preg_replace('/\D+/', '', $phone) ?? '';
    if (strlen($digits) === 10) {
        return '+1' . $digits;
    }
    if (strlen($digits) === 11 && str_starts_with($digits, '1')) {
        return '+' . $digits;
    }
    if (str_starts_with($phone, '+') && strlen($digits) >= 8 && strlen($digits) <= 15) {
        return '+' . $digits;
    }

    return '';
}

function smsPhoneLast4(string $phone): string {
    $digits = preg_replace('/\D+/', '', $phone) ?? '';
    return substr($digits, -4);
}

function smsOptInUrl(string $token): string {
    return smsBaseUrl() . '/watch/sms/?token=' . rawurlencode($token);
}

function smsSendTwilio(string $to, string $body): array {
    $sid = smsEnvValue('TWILIO_ACCOUNT_SID');
    $token = smsEnvValue('TWILIO_AUTH_TOKEN');
    $from = smsEnvValue('TWILIO_FROM_NUMBER');

    if ($sid === '' || $token === '' || $from === '') {
        return ['ok' => false, 'error' => 'Twilio credentials are not configured.'];
    }

    $url = 'https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($sid) . '/Messages.json';
    $bodyFields = http_build_query([
        'From' => $from,
        'To' => $to,
        'Body' => $body,
    ], '', '&', PHP_QUERY_RFC3986);

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $bodyFields,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERPWD => $sid . ':' . $token,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT => 20,
        ]);

        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Authorization: Basic " . base64_encode($sid . ':' . $token) . "\r\nContent-Type: application/x-www-form-urlencoded\r\n",
                'content' => $bodyFields,
                'timeout' => 20,
                'ignore_errors' => true,
            ],
        ]);
        $responseBody = file_get_contents($url, false, $context);
        $status = 0;
        $error = '';
        if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
            $status = (int) $matches[1];
        }
    }

    $payload = json_decode($responseBody === false ? '' : $responseBody, true);
    return [
        'ok' => $error === '' && $status >= 200 && $status < 300,
        'http_status' => $status,
        'twilio_sid' => is_array($payload) ? ($payload['sid'] ?? null) : null,
        'error' => $error !== '' ? $error : (is_array($payload) ? ($payload['message'] ?? '') : ''),
    ];
}

function smsReminderBody(array $subscription, string $reminderType = ''): string {
    $title = (string) ($subscription['eventTitle'] ?? 'your Advanced AI Concepts event');
    $eventUrl = (string) ($subscription['eventUrl'] ?? '');
    $dateText = (string) ($subscription['eventDateText'] ?? '');

    $prefix = 'Reminder';
    if ($reminderType === 'evening_before') {
        $prefix = 'Tomorrow';
    } elseif ($reminderType === 'day_of') {
        $prefix = 'Today';
    }

    $message = $prefix . ': ' . $title;
    if ($dateText !== '') {
        $message .= ' starts ' . $dateText . '.';
    } else {
        $message .= ' is coming up.';
    }
    if ($eventUrl !== '') {
        $message .= ' Details: ' . $eventUrl;
    }
    $message .= ' Reply STOP to opt out.';

    return $message;
}
