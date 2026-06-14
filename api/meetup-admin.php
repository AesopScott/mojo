<?php
/**
 * Private Meetup admin helper.
 *
 * Requires MEETUP_ADMIN_KEY in the server .env and a matching X-Admin-Key
 * header or ?admin_key= query parameter. Intended for one-off organizer
 * operations while building the real admin UI.
 */

declare(strict_types=1);

require_once __DIR__ . '/sms-reminder-lib.php';

const MEETUP_TOKEN_ENDPOINT = 'https://secure.meetup.com/oauth2/access';
const MEETUP_GRAPHQL_ENDPOINT = 'https://api.meetup.com/gql-ext';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function loadEnvFile(string $path): void {
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

function loadFirstEnvFile(array $paths): ?string {
    foreach ($paths as $path) {
        if (is_readable($path)) {
            loadEnvFile($path);
            return $path;
        }
    }

    return null;
}

function envValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function postForm(string $url, array $fields): array {
    $body = http_build_query($fields, '', '&', PHP_QUERY_RFC3986);

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT => 20,
        ]);

        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        return [$status, $responseBody === false ? '' : $responseBody, $error];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [$status, $responseBody === false ? '' : $responseBody, ''];
}

function postJson(string $url, array $payload, string $accessToken): array {
    $body = json_encode($payload);
    if ($body === false) {
        throw new RuntimeException('Unable to encode JSON request.');
    }

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json',
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        return [$status, $responseBody === false ? '' : $responseBody, $error];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Authorization: Bearer {$accessToken}\r\nContent-Type: application/json\r\n",
            'content' => $body,
            'timeout' => 30,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [$status, $responseBody === false ? '' : $responseBody, ''];
}

function fetchBinary(string $url): array {
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_TIMEOUT => 30,
        ]);

        $body = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $contentType = (string) curl_getinfo($curl, CURLINFO_CONTENT_TYPE);
        $error = curl_error($curl);
        curl_close($curl);

        return [$status, $body === false ? '' : $body, $contentType, $error];
    }

    $context = stream_context_create(['http' => ['timeout' => 30, 'ignore_errors' => true]]);
    $body = file_get_contents($url, false, $context);
    $status = 0;
    $contentType = '';

    if (isset($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (preg_match('/^HTTP\/\S+\s(\d{3})\s/', $header, $matches)) {
                $status = (int) $matches[1];
            }
            if (stripos($header, 'Content-Type:') === 0) {
                $contentType = trim(substr($header, strlen('Content-Type:')));
            }
        }
    }

    return [$status, $body === false ? '' : $body, $contentType, ''];
}

function putBinary(string $url, string $body, string $contentType): array {
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type: ' . $contentType,
                'Content-Length: ' . strlen($body),
            ],
            CURLOPT_TIMEOUT => 60,
        ]);

        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        return [$status, $responseBody === false ? '' : $responseBody, $error];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'PUT',
            'header' => "Content-Type: {$contentType}\r\nContent-Length: " . strlen($body) . "\r\n",
            'content' => $body,
            'timeout' => 60,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [$status, $responseBody === false ? '' : $responseBody, ''];
}

function tokenStorePath(?string $loadedEnv): string {
    $configured = envValue('MEETUP_TOKEN_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return $loadedEnv === null ? '' : dirname($loadedEnv) . '/meetup-oauth-token.json';
}

function readStoredToken(string $path): array {
    if ($path === '' || !is_readable($path)) {
        throw new RuntimeException('Stored Meetup token was not found.');
    }

    $tokens = json_decode((string) file_get_contents($path), true);
    if (!is_array($tokens) || empty($tokens['access_token'])) {
        throw new RuntimeException('Stored Meetup token file is invalid.');
    }

    return $tokens;
}

function writeStoredToken(string $path, array $tokens): void {
    $tokens['stored_at'] = gmdate('c');
    $encoded = json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write refreshed Meetup token.');
    }
}

function refreshStoredToken(string $tokenPath): array {
    $tokens = readStoredToken($tokenPath);
    if (empty($tokens['refresh_token'])) {
        throw new RuntimeException('Stored Meetup token has no refresh token.');
    }

    [$status, $responseBody, $transportError] = postForm(MEETUP_TOKEN_ENDPOINT, [
        'client_id' => envValue('MEETUP_CLIENT_ID'),
        'client_secret' => envValue('MEETUP_CLIENT_SECRET'),
        'grant_type' => 'refresh_token',
        'refresh_token' => $tokens['refresh_token'],
    ]);

    if ($transportError !== '') {
        throw new RuntimeException('Refresh token request failed: ' . $transportError);
    }

    $refreshed = json_decode($responseBody, true);
    if (!is_array($refreshed) || $status < 200 || $status >= 300 || empty($refreshed['access_token'])) {
        throw new RuntimeException('Meetup rejected refresh token request: ' . $responseBody);
    }

    writeStoredToken($tokenPath, $refreshed);
    return $refreshed;
}

function graphQL(string $query, array $variables, string $tokenPath): array {
    $tokens = readStoredToken($tokenPath);

    [$status, $responseBody, $transportError] = postJson(MEETUP_GRAPHQL_ENDPOINT, [
        'query' => $query,
        'variables' => (object) $variables,
    ], $tokens['access_token']);

    $payload = json_decode($responseBody, true);
    $expired = is_array($payload)
        && !empty($payload['errors'])
        && strpos(json_encode($payload['errors']), 'access_token_invalid') !== false;

    if ($expired) {
        $tokens = refreshStoredToken($tokenPath);
        [$status, $responseBody, $transportError] = postJson(MEETUP_GRAPHQL_ENDPOINT, [
            'query' => $query,
            'variables' => (object) $variables,
        ], $tokens['access_token']);
        $payload = json_decode($responseBody, true);
    }

    return [
        'http_status' => $status,
        'transport_error' => $transportError,
        'response' => $payload ?? $responseBody,
    ];
}

function eventKey(array $event): string {
    $title = strtolower(trim((string) ($event['title'] ?? '')));
    $dateTime = (string) ($event['dateTime'] ?? '');
    return $title . '|' . substr($dateTime, 0, 19);
}

function groupTimeZones(): array {
    return [
        'advanced-ai-concepts-atlanta' => 'America/New_York',
        'advanced-ai-concepts-boston' => 'America/New_York',
        'advanced-ai-concepts-chicago' => 'America/Chicago',
        'advanced-ai-concepts' => 'America/Denver',
        'advanced-ai-concepts-columbus' => 'America/New_York',
        'advanced-ai-concepts-dallas' => 'America/Chicago',
        'advanced-ai-concepts-houston' => 'America/Chicago',
        'advanced-ai-concepts-kansas-city' => 'America/Chicago',
        'advanced-ai-concepts-los-angeles' => 'America/Los_Angeles',
        'advanced-ai-concepts-buenos-aires' => 'America/Argentina/Buenos_Aires',
        'advanced-ai-concepts-mexico-city' => 'America/Mexico_City',
        'advanced-ai-concepts-miami' => 'America/New_York',
        'advanced-ai-concepts-montreal' => 'America/Toronto',
        'advanced-ai-concepts-new-york' => 'America/New_York',
        'advanced-ai-concepts-okc' => 'America/Chicago',
        'advanced-ai-concepts-philadelphia' => 'America/New_York',
        'advanced-ai-concepts-phoenix' => 'America/Phoenix',
        'advanced-ai-concepts-san-francisco' => 'America/Los_Angeles',
        'advanced-ai-concepts-san-antonio' => 'America/Chicago',
        'advanced-ai-concepts-santiago' => 'America/Santiago',
        'advanced-ai-concepts-seattle' => 'America/Los_Angeles',
        'advanced-ai-concepts-singapore-guild' => 'Asia/Singapore',
        'advanced-ai-concepts-sao-paulo' => 'America/Sao_Paulo',
        'advanced-ai-concepts-sydney-guild' => 'Australia/Sydney',
        'advanced-ai-concepts-tampa' => 'America/New_York',
        'advanced-ai-concepts-the-triangle' => 'America/New_York',
        'advanced-ai-concepts-tokyo-guild' => 'Asia/Tokyo',
        'advanced-ai-concepts-toronto' => 'America/Toronto',
        'advanced-ai-concepts-vancouver' => 'America/Vancouver',
        'advanced-ai-concepts-washington-dc' => 'America/New_York',
    ];
}

function groupTimeZone(string $urlname): ?string {
    $timeZones = groupTimeZones();
    return $timeZones[$urlname] ?? null;
}

function targetDateTime(string $sourceDateTime, string $targetUrlname): string {
    $timeZone = groupTimeZone($targetUrlname);
    if ($timeZone !== null) {
        try {
            $localDateTime = substr($sourceDateTime, 0, 19);
            $target = new DateTimeImmutable($localDateTime, new DateTimeZone($timeZone));
            return $target->format('Y-m-d\TH:i:sP');
        } catch (Exception $exception) {
            return $sourceDateTime;
        }
    }

    return $sourceDateTime;
}

function localGroupDateTime(string $date, string $time, string $targetUrlname): string {
    $timeZone = groupTimeZone($targetUrlname);
    if ($timeZone !== null) {
        try {
            $target = new DateTimeImmutable($date . 'T' . $time . ':00', new DateTimeZone($timeZone));
            return $target->format('Y-m-d\TH:i:sP');
        } catch (Exception $exception) {
            return $date . 'T' . $time . ':00';
        }
    }

    return $date . 'T' . $time . ':00';
}

function editEventLocalDateTimeValue(string $dateTime): string {
    return substr($dateTime, 0, 16);
}

function createAndUploadPhoto(string $tokenPath, string $groupId, string $sourceUrl, string $photoType, bool $setAsMain, ?string $eventId = null): array {
    [$downloadStatus, $imageBody, $sourceContentType, $downloadError] = fetchBinary($sourceUrl);
    if ($downloadError !== '' || $downloadStatus < 200 || $downloadStatus >= 300 || $imageBody === '') {
        return [
            'ok' => false,
            'stage' => 'download',
            'http_status' => $downloadStatus,
            'error' => $downloadError,
            'content_type' => $sourceContentType,
        ];
    }

    $contentType = stripos($sourceContentType, 'png') !== false ? 'PNG' : 'JPEG';
    $uploadContentType = $contentType === 'PNG' ? 'image/png' : 'image/jpeg';

    $input = [
        'groupId' => $groupId,
        'photoType' => $photoType,
        'contentType' => $contentType,
        'setAsMain' => $setAsMain,
    ];
    if ($eventId !== null && $eventId !== '') {
        $input['eventId'] = $eventId;
    }

    $placeholder = graphQL(<<<'GRAPHQL'
mutation ($input: GroupEventPhotoCreateInput!) {
  createGroupEventPhoto(input: $input) {
    uploadUrl
    imagePath
    photo { id baseUrl standardUrl thumbUrl }
    error { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

    $payload = $placeholder['response']['data']['createGroupEventPhoto'] ?? null;
    $uploadUrl = is_array($payload) ? (string) ($payload['uploadUrl'] ?? '') : '';
    if ($uploadUrl === '' || !empty($payload['error']) || !empty($placeholder['response']['errors'])) {
        return [
            'ok' => false,
            'stage' => 'placeholder',
            'placeholder' => $placeholder,
        ];
    }

    [$uploadStatus, $uploadBody, $uploadError] = putBinary($uploadUrl, $imageBody, $uploadContentType);

    return [
        'ok' => $uploadError === '' && $uploadStatus >= 200 && $uploadStatus < 300,
        'stage' => 'upload',
        'download' => [
            'http_status' => $downloadStatus,
            'content_type' => $sourceContentType,
            'bytes' => strlen($imageBody),
        ],
        'placeholder' => $payload,
        'upload' => [
            'http_status' => $uploadStatus,
            'body' => $uploadBody,
            'error' => $uploadError,
        ],
    ];
}

function emailSmsInvite(array $invite, string $recipientEmail, bool $dryRun, bool $recovery): array {
    $adminEmail = envValue('MOJO_ADMIN_EMAIL', 'admin@MojoAiStudio.com');
    $eventTitle = (string) ($invite['eventTitle'] ?? 'Advanced AI Concepts event');
    $eventDate = '';
    if (!empty($invite['eventDateTime'])) {
        try {
            $date = new DateTimeImmutable((string) $invite['eventDateTime']);
            $eventDate = $date->format('M j, Y g:i A T');
        } catch (Exception $exception) {
            $eventDate = '';
        }
    }

    $subject = 'SMS reminder for ' . $eventTitle;
    $body = "Hi " . ((string) ($invite['memberName'] ?? 'there')) . ",\n\n";
    if ($recovery) {
        $body .= "Quick apology: if you received an earlier SMS reminder link from us, it may not have worked. "
            . "This updated link is the one to use.\n\n";
    }
    $body .= "You registered for " . $eventTitle . " on Meetup";
    if ($eventDate !== '') {
        $body .= " (" . $eventDate . ")";
    }
    $body .= ". If you'd like a text reminder before the event, add your phone number here:\n\n"
        . (string) ($invite['optInUrl'] ?? '') . "\n\n"
        . "Mojo AI Studio will use your phone number only for event reminders and SMS service messages. "
        . "We won't use it for marketing or any other purpose.\n\n"
        . "Thanks,\nMojo AI Studio";

    if ($dryRun) {
        return ['ok' => true, 'dry_run' => true];
    }

    $headers = [
        'From: Mojo AI Studio <' . $adminEmail . '>',
        'Reply-To: ' . $adminEmail,
        'Content-Type: text/plain; charset=UTF-8',
    ];

    return [
        'ok' => mail($recipientEmail, $subject, $body, implode("\r\n", $headers)),
        'dry_run' => false,
    ];
}

function smsStoreWriteCheck(): array {
    try {
        $store = smsReadStore();
        $store['_writeChecks'][] = [
            'checkedAt' => gmdate('c'),
            'purpose' => 'admin_write_preflight',
        ];
        $store['_writeChecks'] = array_slice($store['_writeChecks'], -5);
        smsWriteStore($store);

        return [
            'ok' => true,
            'path' => smsStorePath(),
        ];
    } catch (Throwable $throwable) {
        return [
            'ok' => false,
            'path' => smsStorePath(),
            'error' => $throwable->getMessage(),
        ];
    }
}

function upcomingGroupEvents(string $groupUrlname, string $tokenPath): array {
    $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 20) {
      edges {
        node {
          id
          title
          eventUrl
          status
          dateTime
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $groupUrlname], $tokenPath);

    $edges = $eventsResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
    if (!is_array($edges)) {
        return [];
    }

    $events = [];
    foreach ($edges as $edge) {
        $event = $edge['node'] ?? null;
        if (is_array($event) && (string) ($event['id'] ?? '') !== '' && (string) ($event['dateTime'] ?? '') !== '') {
            $events[] = $event;
        }
    }

    return $events;
}

function topicFollowupStorePath(): string {
    $configured = envValue('MOJO_MEETUP_FOLLOWUP_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/mojo-meetup-followups.json';
}

function topicFollowupReadStore(): array {
    $path = topicFollowupStorePath();
    if (!is_readable($path)) {
        return ['topicFollowups' => []];
    }

    $decoded = json_decode((string) file_get_contents($path), true);
    if (!is_array($decoded)) {
        return ['topicFollowups' => []];
    }

    return array_replace(['topicFollowups' => []], $decoded);
}

function topicFollowupWriteStore(array $store): void {
    $path = topicFollowupStorePath();
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        throw new RuntimeException('Unable to create Meetup follow-up store directory.');
    }

    $encoded = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write Meetup follow-up store.');
    }
}

function topicFollowupStoreWriteCheck(): array {
    try {
        $store = topicFollowupReadStore();
        $store['topicFollowups']['__dry_run_probe__'] = [
            'purpose' => 'advanced_ai_concepts_topic_followup_store_probe',
            'dryRun' => true,
            'updatedAt' => gmdate('c'),
        ];
        topicFollowupWriteStore($store);

        return [
            'ok' => true,
            'path' => topicFollowupStorePath(),
            'probe_key' => '__dry_run_probe__',
        ];
    } catch (Throwable $throwable) {
        return [
            'ok' => false,
            'path' => topicFollowupStorePath(),
            'probe_key' => '__dry_run_probe__',
            'error' => $throwable->getMessage(),
        ];
    }
}

function topicFollowupKey(string $source, string $sourceId, string $email): string {
    return hash('sha256', $source . '|' . $sourceId . '|' . strtolower(trim($email)));
}

function topicFollowupAdminEmail(): string {
    $adminEmail = strtolower(envValue('MOJO_ADMIN_EMAIL', 'admin@mojoaistudio.com'));
    return $adminEmail === '' ? 'admin@mojoaistudio.com' : $adminEmail;
}

function topicFollowupEmail(array $followup, string $recipientEmail, bool $dryRun): array {
    $adminEmail = topicFollowupAdminEmail();
    $memberName = trim((string) ($followup['memberName'] ?? ''));
    $greeting = $memberName === '' ? 'Hey, glad you found Advanced AI Concepts.' : 'Hey ' . $memberName . ', glad you found Advanced AI Concepts.';

    $subject = 'Anything you want us to dig into?';
    $body = $greeting . "\n\n"
        . "Quick question: is there any particular AI topic, build problem, architecture question, model/hardware/harness issue, or advanced concept you would like us to talk about in an upcoming session?\n\n"
        . "Just reply to this message. It will go to admin@mojoaistudio.com.\n\n"
        . "The best sessions come from real questions and live problems, so if there is something you are trying to understand, optimize, wire together, or push further, send it over.";

    if ($dryRun) {
        return ['ok' => true, 'dry_run' => true];
    }

    $headers = [
        'From: Mojo AI Studio <' . $adminEmail . '>',
        'Reply-To: ' . $adminEmail,
        'Content-Type: text/plain; charset=UTF-8',
    ];

    return [
        'ok' => mail($recipientEmail, $subject, $body, implode("\r\n", $headers)),
        'dry_run' => false,
    ];
}

function sendPlainAnnouncementEmail(string $recipientEmail, string $subject, string $body, bool $dryRun): array {
    $adminEmail = topicFollowupAdminEmail();

    if ($dryRun) {
        return ['ok' => true, 'dry_run' => true];
    }

    $headers = [
        'From: Mojo AI Studio <' . $adminEmail . '>',
        'Reply-To: ' . $adminEmail,
        'Content-Type: text/plain; charset=UTF-8',
    ];

    return [
        'ok' => mail($recipientEmail, $subject, $body, implode("\r\n", $headers)),
        'dry_run' => false,
    ];
}

function topicFollowupIsoAfterDays(string $isoDate, int $days): string {
    try {
        return (new DateTimeImmutable($isoDate))->modify('+' . $days . ' days')->format('c');
    } catch (Exception $exception) {
        return gmdate('c');
    }
}

$projectRoot = dirname(__DIR__);
$loadedEnv = loadFirstEnvFile([
    $projectRoot . '/.env',
    dirname($projectRoot) . '/.env',
    dirname($projectRoot, 2) . '/.env',
    dirname($projectRoot, 2) . '/mojo.env',
]);

$adminKey = envValue('MEETUP_ADMIN_KEY');
$providedKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? ($_GET['admin_key'] ?? '');
if ($adminKey === '' || !hash_equals($adminKey, (string) $providedKey)) {
    respond(403, ['ok' => false, 'error' => 'Forbidden']);
}

$action = $_GET['action'] ?? 'self';
$tokenPath = tokenStorePath($loadedEnv);

try {
    if ($action === 'self') {
        respond(200, [
            'ok' => true,
            'result' => graphQL('query { self { id name } }', [], $tokenPath),
        ]);
    }

    if ($action === 'introspect') {
        $query = <<<'GRAPHQL'
query {
  __schema {
    queryType { fields { name args { name type { kind name ofType { kind name } } } } }
    mutationType { fields { name args { name type { kind name ofType { kind name } } } } }
  }
}
GRAPHQL;
        respond(200, ['ok' => true, 'result' => graphQL($query, [], $tokenPath)]);
    }

    if ($action === 'schema-type') {
        $typeName = trim((string) ($_GET['type'] ?? ''));
        if ($typeName === '') {
            respond(400, ['ok' => false, 'error' => 'Missing type.']);
        }

        $query = <<<'GRAPHQL'
query ($name: String!) {
  __type(name: $name) {
    name
    kind
    description
    fields {
      name
      description
      args { name type { kind name ofType { kind name ofType { kind name } } } }
      type { kind name ofType { kind name ofType { kind name } } }
    }
    enumValues {
      name
      description
    }
    inputFields {
      name
      description
      type { kind name ofType { kind name ofType { kind name } } }
    }
  }
}
GRAPHQL;
        respond(200, [
            'ok' => true,
            'result' => graphQL($query, ['name' => $typeName], $tokenPath),
        ]);
    }

    if ($action === 'group') {
        $urlname = trim((string) ($_GET['urlname'] ?? ''));
        if ($urlname === '') {
            respond(400, ['ok' => false, 'error' => 'Missing urlname.']);
        }

        $query = <<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    description
    customMemberLabel
    urlname
    timezone
    city
    state
    country
    zip
    link
    activeTopics { id name urlkey }
    keyGroupPhoto { id baseUrl standardUrl thumbUrl }
    proNetwork { id urlname name }
  }
}
GRAPHQL;
        respond(200, [
            'ok' => true,
            'result' => graphQL($query, ['urlname' => $urlname], $tokenPath),
        ]);
    }

    if ($action === 'events') {
        $urlname = trim((string) ($_GET['urlname'] ?? ''));
        if ($urlname === '') {
            respond(400, ['ok' => false, 'error' => 'Missing urlname.']);
        }

        $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 20) {
      totalCount
      edges {
        node {
          id
          title
          description
          eventUrl
          eventType
          status
          dateTime
          duration
          networkEvent { id title eventTime groupCount status timezone }
          zoomMeetingId
          howToFindUs
          venue {
            id
            name
            address
            city
            state
            country
            postalCode
            lat
            lon
          }
          venues {
            id
            name
            address
            city
            state
            country
            postalCode
            lat
            lon
          }
          featuredEventPhoto { id baseUrl standardUrl thumbUrl }
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);

        respond(200, [
            'ok' => true,
            'result' => $eventsResult,
        ]);
    }

    if ($action === 'test-sms-store') {
        $check = smsStoreWriteCheck();
        respond($check['ok'] ? 200 : 500, $check);
    }

    if ($action === 'send-topic-followups') {
        $networkUrlname = trim((string) ($_GET['network'] ?? 'advanced-ai-concepts'));
        $first = max(1, min(50, (int) ($_GET['first'] ?? 50)));
        $daysAfter = max(1, min(90, (int) ($_GET['days_after'] ?? 7)));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'send-topic-followups';

        if ((string) ($_GET['dry_run_write'] ?? '') === '1') {
            if (trim((string) ($_GET['confirm'] ?? '')) !== 'test-followup-store') {
                respond(400, [
                    'ok' => false,
                    'error' => 'Missing confirmation.',
                    'expected_confirm' => 'test-followup-store',
                ]);
            }

            $check = topicFollowupStoreWriteCheck();
            respond($check['ok'] ? 200 : 500, $check);
        }

        $storeCheck = topicFollowupStoreWriteCheck();
        if (!$storeCheck['ok']) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Meetup follow-up store is not writable.',
                'store' => $storeCheck,
            ]);
        }

        $rsvpResult = graphQL(<<<'GRAPHQL'
query ($urlname: ID!, $first: Int!) {
  proNetwork(urlname: $urlname) {
    eventsSearch(input: { first: $first, filter: { status: "UPCOMING" } }) {
      totalCount
      edges {
        node {
          id
          title
          eventUrl
          dateTime
          group { id name urlname }
          rsvps {
            edges {
              node {
                id
                member {
                  name
                  email
                }
              }
            }
          }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $networkUrlname, 'first' => $first], $tokenPath);

        $events = $rsvpResult['response']['data']['proNetwork']['eventsSearch']['edges'] ?? [];
        if (!is_array($events)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load Meetup RSVPs.',
                'result' => $rsvpResult,
            ]);
        }

        $store = topicFollowupReadStore();

        $selfResult = graphQL('query { self { id email } }', [], $tokenPath);
        $organizerEmail = strtolower(trim((string) ($selfResult['response']['data']['self']['email'] ?? '')));

        $emailsSent = [];
        foreach ($store['topicFollowups'] as $storeEntry) {
            if (is_array($storeEntry) && !empty($storeEntry['sentAt']) && !empty($storeEntry['memberEmailHash'])) {
                $emailsSent[$storeEntry['memberEmailHash']] = true;
            }
        }
        $emailsQueuedThisRun = [];

        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $observed = [];
        $eligible = [];
        $sent = [];
        $skipped = [];
        $errors = [];

        foreach ($events as $edge) {
            $event = $edge['node'] ?? null;
            if (!is_array($event)) {
                continue;
            }

            foreach (($event['rsvps']['edges'] ?? []) as $rsvpEdge) {
                $rsvp = $rsvpEdge['node'] ?? null;
                if (!is_array($rsvp)) {
                    continue;
                }

                $eventId = (string) ($event['id'] ?? '');
                $rsvpId = (string) ($rsvp['id'] ?? '');
                $email = trim((string) ($rsvp['member']['email'] ?? ''));
                if ($eventId === '' || $rsvpId === '' || $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'missing event, RSVP, or valid email',
                    ];
                    continue;
                }

                if ($organizerEmail !== '' && strtolower($email) === $organizerEmail) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'organizer excluded',
                    ];
                    continue;
                }

                $emailHash = hash('sha256', strtolower($email));
                if (isset($emailsSent[$emailHash]) || isset($emailsQueuedThisRun[$emailHash])) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'follow-up already sent to this email',
                    ];
                    continue;
                }

                $key = topicFollowupKey('rsvp', $rsvpId, $email);
                $existing = $store['topicFollowups'][$key] ?? null;
                if (is_array($existing) && !empty($existing['sentAt'])) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'follow-up already sent',
                    ];
                    continue;
                }

                $firstSeenAt = is_array($existing) ? (string) ($existing['firstSeenAt'] ?? gmdate('c')) : gmdate('c');
                $eligibleAt = is_array($existing)
                    ? (string) ($existing['eligibleAt'] ?? topicFollowupIsoAfterDays($firstSeenAt, $daysAfter))
                    : topicFollowupIsoAfterDays($firstSeenAt, $daysAfter);

                $followup = [
                    'memberEmailHash' => hash('sha256', strtolower($email)),
                    'memberName' => (string) ($rsvp['member']['name'] ?? ''),
                    'groupName' => (string) ($event['group']['name'] ?? ''),
                    'groupUrlname' => (string) ($event['group']['urlname'] ?? ''),
                    'source' => 'rsvp',
                    'sourceId' => $rsvpId,
                    'eventId' => $eventId,
                    'eventTitle' => (string) ($event['title'] ?? ''),
                    'eventDateTime' => (string) ($event['dateTime'] ?? ''),
                    'eventUrl' => (string) ($event['eventUrl'] ?? ''),
                    'firstSeenAt' => $firstSeenAt,
                    'eligibleAt' => $eligibleAt,
                    'sentAt' => is_array($existing) ? ($existing['sentAt'] ?? null) : null,
                    'purpose' => 'advanced_ai_concepts_one_week_topic_prompt',
                ];

                $store['topicFollowups'][$key] = $followup;
                $observed[] = [
                    'event_id' => $eventId,
                    'rsvp_id' => $rsvpId,
                    'member' => $followup['memberName'],
                    'eligible_at' => $eligibleAt,
                ];

                try {
                    $eligibleTime = new DateTimeImmutable($eligibleAt);
                } catch (Exception $exception) {
                    $eligibleTime = $now->modify('+' . $daysAfter . ' days');
                }

                if ($eligibleTime > $now) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'not eligible yet',
                        'eligible_at' => $eligibleAt,
                    ];
                    continue;
                }

                $eligible[] = [
                    'event_id' => $eventId,
                    'rsvp_id' => $rsvpId,
                    'member' => $followup['memberName'],
                ];

                $emailsQueuedThisRun[$emailHash] = true;

                $emailResult = topicFollowupEmail($followup, $email, $dryRun);
                if (empty($emailResult['ok'])) {
                    $errors[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'email failed',
                    ];
                    continue;
                }

                if (!$dryRun) {
                    $store['topicFollowups'][$key]['sentAt'] = gmdate('c');
                }

                $sent[] = [
                    'event_id' => $eventId,
                    'rsvp_id' => $rsvpId,
                    'dry_run' => $dryRun,
                ];
            }
        }

        topicFollowupWriteStore($store);

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'days_after' => $daysAfter,
            'store' => $storeCheck,
            'observed_count' => count($observed),
            'eligible_count' => count($eligible),
            'sent_count' => count($sent),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'observed' => $observed,
            'eligible' => $eligible,
            'errors' => $errors,
        ]);
    }

    if ($action === 'poll-sms-invites') {
        $networkUrlname = trim((string) ($_GET['network'] ?? 'advanced-ai-concepts'));
        $first = max(1, min(25, (int) ($_GET['first'] ?? 10)));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'send-sms-invites';
        $recovery = (string) ($_GET['recovery'] ?? '') === '1';
        $storeCheck = smsStoreWriteCheck();
        if (!$storeCheck['ok']) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'recovery' => $recovery,
                'error' => 'SMS reminder store is not writable.',
                'store' => $storeCheck,
            ]);
        }

        $rsvpResult = graphQL(<<<'GRAPHQL'
query ($urlname: ID!, $first: Int!) {
  proNetwork(urlname: $urlname) {
    eventsSearch(input: { first: $first, filter: { status: "UPCOMING" } }) {
      totalCount
      edges {
        node {
          id
          title
          eventUrl
          dateTime
          group { id name urlname }
          rsvps {
            edges {
              node {
                id
                member {
                  name
                  email
                }
              }
            }
          }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $networkUrlname, 'first' => $first], $tokenPath);

        $events = $rsvpResult['response']['data']['proNetwork']['eventsSearch']['edges'] ?? [];
        if (!is_array($events)) {
            respond(500, [
                'ok' => false,
                'error' => 'Unable to load Meetup RSVPs.',
                'result' => $rsvpResult,
            ]);
        }

        $store = smsReadStore();
        $created = [];
        $sent = [];
        $skipped = [];
        $errors = [];

        foreach ($events as $edge) {
            $event = $edge['node'] ?? null;
            if (!is_array($event)) {
                continue;
            }

            foreach (($event['rsvps']['edges'] ?? []) as $rsvpEdge) {
                $rsvp = $rsvpEdge['node'] ?? null;
                if (!is_array($rsvp)) {
                    continue;
                }

                $eventId = (string) ($event['id'] ?? '');
                $rsvpId = (string) ($rsvp['id'] ?? '');
                $email = trim((string) ($rsvp['member']['email'] ?? ''));
                if ($eventId === '' || $rsvpId === '' || $email === '') {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'missing event, RSVP, or email',
                    ];
                    continue;
                }

                $key = smsInviteKey($eventId, $rsvpId);
                if (isset($store['invites'][$key])) {
                    $skipped[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'invite already exists',
                    ];
                    continue;
                }

                $token = bin2hex(random_bytes(18));
                $invite = [
                    'token' => $token,
                    'eventId' => $eventId,
                    'eventTitle' => (string) ($event['title'] ?? ''),
                    'eventDateTime' => (string) ($event['dateTime'] ?? ''),
                    'eventUrl' => (string) ($event['eventUrl'] ?? ''),
                    'groupName' => (string) ($event['group']['name'] ?? ''),
                    'groupUrlname' => (string) ($event['group']['urlname'] ?? ''),
                    'rsvpId' => $rsvpId,
                    'memberName' => (string) ($rsvp['member']['name'] ?? ''),
                    'memberEmailHash' => hash('sha256', strtolower($email)),
                    'optInUrl' => smsOptInUrl($token),
                    'status' => 'invited',
                    'createdAt' => gmdate('c'),
                    'inviteSentAt' => null,
                    'purpose' => 'invite_meetup_rsvp_to_sms_event_reminder',
                ];

                $emailResult = emailSmsInvite($invite, $email, $dryRun, $recovery);
                if (empty($emailResult['ok'])) {
                    $errors[] = [
                        'event_id' => $eventId,
                        'rsvp_id' => $rsvpId,
                        'reason' => 'email failed',
                    ];
                    continue;
                }

                $invite['inviteSentAt'] = gmdate('c');
                $store['invites'][$key] = $invite;
                $created[] = [
                    'event_id' => $eventId,
                    'rsvp_id' => $rsvpId,
                    'member' => $invite['memberName'],
                    'opt_in_url' => $invite['optInUrl'],
                ];
                $sent[] = [
                    'event_id' => $eventId,
                    'rsvp_id' => $rsvpId,
                    'dry_run' => $dryRun,
                ];
            }
        }

        if (!$dryRun) {
            smsWriteStore($store);
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'recovery' => $recovery,
            'store' => $storeCheck,
            'created_count' => count($created),
            'sent_count' => count($sent),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'created' => $created,
            'errors' => $errors,
        ]);
    }

    if ($action === 'send-sms-reminders') {
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'send-sms-reminders';
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $storeCheck = smsStoreWriteCheck();
        if (!$storeCheck['ok']) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'SMS reminder store is not writable.',
                'store' => $storeCheck,
            ]);
        }

        $store = smsReadStore();
        $sent = [];
        $skipped = [];
        $errors = [];

        foreach (($store['subscriptions'] ?? []) as $token => $subscription) {
            if (!is_array($subscription)) {
                continue;
            }
            if (!empty($subscription['reminderSentAt'])) {
                $skipped[] = ['token' => (string) $token, 'reason' => 'already sent'];
                continue;
            }
            if (!empty($subscription['unsubscribedAt'])) {
                $skipped[] = ['token' => (string) $token, 'reason' => 'unsubscribed'];
                continue;
            }
            if (empty($subscription['eventDateTime']) || empty($subscription['phone'])) {
                $skipped[] = ['token' => (string) $token, 'reason' => 'missing event time or phone'];
                continue;
            }

            try {
                $eventAt = new DateTimeImmutable((string) $subscription['eventDateTime']);
            } catch (Exception $exception) {
                $skipped[] = ['token' => (string) $token, 'reason' => 'invalid event time'];
                continue;
            }

            $eventLocal = $eventAt;
            $eventDate = $eventLocal->format('Y-m-d');
            $dayBeforeDate = $eventLocal->modify('-1 day')->format('Y-m-d');
            $eventDayStart = new DateTimeImmutable($eventDate . ' 00:00:00', $eventLocal->getTimezone());
            $slots = [
                'evening_before' => [
                    'start' => new DateTimeImmutable($dayBeforeDate . ' 18:00:00', $eventLocal->getTimezone()),
                    'end' => $eventDayStart,
                ],
                'day_of' => [
                    'start' => new DateTimeImmutable($eventDate . ' 16:00:00', $eventLocal->getTimezone()),
                    'end' => $eventLocal,
                ],
            ];

            $dueSlot = '';
            $dueAt = null;
            foreach ($slots as $slotName => $slotWindow) {
                $sentAt = $subscription['reminders'][$slotName]['sentAt'] ?? null;
                if (!empty($sentAt)) {
                    continue;
                }

                $slotUtc = $slotWindow['start']->setTimezone(new DateTimeZone('UTC'));
                $slotEndUtc = $slotWindow['end']->setTimezone(new DateTimeZone('UTC'));
                if ($now >= $slotUtc && $now < $slotEndUtc) {
                    $dueSlot = $slotName;
                    $dueAt = $slotUtc;
                    break;
                }
            }

            if ($dueSlot === '' || $dueAt === null) {
                $skipped[] = ['token' => (string) $token, 'reason' => 'no scheduled reminder due'];
                continue;
            }

            $result = $dryRun
                ? ['ok' => true, 'dry_run' => true]
                : smsSendTwilio((string) $subscription['phone'], smsReminderBody($subscription, $dueSlot));

            if (empty($result['ok'])) {
                $errors[] = [
                    'token' => (string) $token,
                    'slot' => $dueSlot,
                    'phoneLast4' => (string) ($subscription['phoneLast4'] ?? ''),
                    'error' => (string) ($result['error'] ?? 'SMS send failed'),
                ];
                continue;
            }

            if (!$dryRun) {
                $store['subscriptions'][$token]['reminders'][$dueSlot] = [
                    'scheduledFor' => $dueAt->format('c'),
                    'sentAt' => gmdate('c'),
                    'twilioMessageSid' => $result['twilio_sid'] ?? null,
                ];
            }

            $sent[] = [
                'token' => (string) $token,
                'event_id' => (string) ($subscription['eventId'] ?? ''),
                'slot' => $dueSlot,
                'scheduled_for' => $dueAt->format('c'),
                'phoneLast4' => (string) ($subscription['phoneLast4'] ?? ''),
                'dry_run' => $dryRun,
            ];
        }

        $publicSent = [];
        $publicSkipped = [];
        $eventsByGroup = [];

        foreach (($store['publicSubscriptions'] ?? []) as $subscriptionId => $subscription) {
            if (!is_array($subscription)) {
                continue;
            }
            if (!empty($subscription['unsubscribedAt'])) {
                $publicSkipped[] = ['subscription_id' => (string) $subscriptionId, 'reason' => 'unsubscribed'];
                continue;
            }
            if (empty($subscription['phone'])) {
                $publicSkipped[] = ['subscription_id' => (string) $subscriptionId, 'reason' => 'missing phone'];
                continue;
            }

            $groupUrlname = (string) ($subscription['groupUrlname'] ?? 'advanced-ai-concepts');
            if ($groupUrlname === '') {
                $groupUrlname = 'advanced-ai-concepts';
            }

            if (!array_key_exists($groupUrlname, $eventsByGroup)) {
                $eventsByGroup[$groupUrlname] = upcomingGroupEvents($groupUrlname, $tokenPath);
            }

            if (empty($eventsByGroup[$groupUrlname])) {
                $publicSkipped[] = [
                    'subscription_id' => (string) $subscriptionId,
                    'groupUrlname' => $groupUrlname,
                    'reason' => 'no upcoming events loaded',
                ];
                continue;
            }

            foreach ($eventsByGroup[$groupUrlname] as $event) {
                try {
                    $eventAt = new DateTimeImmutable((string) $event['dateTime']);
                } catch (Exception $exception) {
                    $publicSkipped[] = [
                        'subscription_id' => (string) $subscriptionId,
                        'event_id' => (string) ($event['id'] ?? ''),
                        'reason' => 'invalid event time',
                    ];
                    continue;
                }

                $eventId = (string) ($event['id'] ?? '');
                $eventLocal = $eventAt;
                $eventDate = $eventLocal->format('Y-m-d');
                $dayBeforeDate = $eventLocal->modify('-1 day')->format('Y-m-d');
                $eventDayStart = new DateTimeImmutable($eventDate . ' 00:00:00', $eventLocal->getTimezone());
                $slots = [
                    'evening_before' => [
                        'start' => new DateTimeImmutable($dayBeforeDate . ' 18:00:00', $eventLocal->getTimezone()),
                        'end' => $eventDayStart,
                    ],
                    'day_of' => [
                        'start' => new DateTimeImmutable($eventDate . ' 16:00:00', $eventLocal->getTimezone()),
                        'end' => $eventLocal,
                    ],
                ];

                $dueSlot = '';
                $dueAt = null;
                foreach ($slots as $slotName => $slotWindow) {
                    $sentAt = $subscription['eventReminders'][$eventId][$slotName]['sentAt'] ?? null;
                    if (!empty($sentAt)) {
                        continue;
                    }

                    $slotUtc = $slotWindow['start']->setTimezone(new DateTimeZone('UTC'));
                    $slotEndUtc = $slotWindow['end']->setTimezone(new DateTimeZone('UTC'));
                    if ($now >= $slotUtc && $now < $slotEndUtc) {
                        $dueSlot = $slotName;
                        $dueAt = $slotUtc;
                        break;
                    }
                }

                if ($dueSlot === '' || $dueAt === null) {
                    $publicSkipped[] = [
                        'subscription_id' => (string) $subscriptionId,
                        'event_id' => $eventId,
                        'reason' => 'no scheduled reminder due',
                    ];
                    continue;
                }

                $result = $dryRun
                    ? ['ok' => true, 'dry_run' => true]
                    : smsSendTwilio((string) $subscription['phone'], smsUpcomingReminderBody($subscription, $event, $dueSlot));

                if (empty($result['ok'])) {
                    $errors[] = [
                        'subscription_id' => (string) $subscriptionId,
                        'event_id' => $eventId,
                        'slot' => $dueSlot,
                        'phoneLast4' => (string) ($subscription['phoneLast4'] ?? ''),
                        'error' => (string) ($result['error'] ?? 'SMS send failed'),
                    ];
                    continue;
                }

                if (!$dryRun) {
                    $store['publicSubscriptions'][$subscriptionId]['eventReminders'][$eventId][$dueSlot] = [
                        'scheduledFor' => $dueAt->format('c'),
                        'sentAt' => gmdate('c'),
                        'twilioMessageSid' => $result['twilio_sid'] ?? null,
                    ];
                    $store['publicSubscriptions'][$subscriptionId]['updatedAt'] = gmdate('c');
                }

                $publicSent[] = [
                    'subscription_id' => (string) $subscriptionId,
                    'groupUrlname' => $groupUrlname,
                    'event_id' => $eventId,
                    'slot' => $dueSlot,
                    'scheduled_for' => $dueAt->format('c'),
                    'phoneLast4' => (string) ($subscription['phoneLast4'] ?? ''),
                    'dry_run' => $dryRun,
                ];
            }
        }

        if (!$dryRun) {
            smsWriteStore($store);
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'store' => $storeCheck,
            'schedule' => [
                'evening_before' => '18:00 event-local time the day before',
                'day_of' => '16:00 event-local time the day of',
            ],
            'sent_count' => count($sent),
            'skipped_count' => count($skipped),
            'public_sent_count' => count($publicSent),
            'public_skipped_count' => count($publicSkipped),
            'error_count' => count($errors),
            'sent' => $sent,
            'public_sent' => $publicSent,
            'public_skipped' => $publicSkipped,
            'errors' => $errors,
        ]);
    }

    if ($action === 'copy-events') {
        $sourceUrlname = trim((string) ($_GET['source'] ?? 'advanced-ai-concepts'));
        $targetUrlname = trim((string) ($_GET['target'] ?? ''));
        $titleFilter = trim((string) ($_GET['titles'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $allowedTitles = [];
        if ($titleFilter !== '') {
            foreach (explode('|', $titleFilter) as $title) {
                $normalizedTitle = strtolower(trim($title));
                if ($normalizedTitle !== '') {
                    $allowedTitles[$normalizedTitle] = true;
                }
            }
        }

        if ($targetUrlname === '') {
            respond(400, ['ok' => false, 'error' => 'Missing target group urlname.']);
        }

        if ($confirm !== $targetUrlname) {
            respond(400, [
                'ok' => false,
                'error' => 'Confirmation must match target urlname.',
                'expected_confirm' => $targetUrlname,
            ]);
        }

        $eventsQuery = <<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 50) {
      totalCount
      edges {
        node {
          id
          title
          description
          eventUrl
          status
          dateTime
          duration
          networkEvent { id title eventTime groupCount status timezone }
          howToFindUs
          venue {
            id
            name
          }
          venues {
            id
            name
          }
          featuredEventPhoto { id baseUrl standardUrl thumbUrl }
        }
      }
    }
  }
}
GRAPHQL;

        $sourceResult = graphQL($eventsQuery, ['urlname' => $sourceUrlname], $tokenPath);
        $targetResult = graphQL($eventsQuery, ['urlname' => $targetUrlname], $tokenPath);

        $sourceEdges = $sourceResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
        $targetEdges = $targetResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];

        if (!is_array($sourceEdges) || !is_array($targetEdges)) {
            respond(500, [
                'ok' => false,
                'error' => 'Unable to load source or target events.',
                'source' => $sourceResult,
                'target' => $targetResult,
            ]);
        }

        $existing = [];
        foreach ($targetEdges as $edge) {
            $event = $edge['node'] ?? null;
            if (is_array($event)) {
                $existing[eventKey($event)] = true;
            }
        }

        $created = [];
        $skipped = [];
        $errors = [];

        foreach ($sourceEdges as $edge) {
            $sourceEvent = $edge['node'] ?? null;
            if (!is_array($sourceEvent) || ($sourceEvent['status'] ?? '') !== 'ACTIVE') {
                continue;
            }

            $sourceTitle = (string) ($sourceEvent['title'] ?? '');
            if (!empty($allowedTitles) && !isset($allowedTitles[strtolower(trim($sourceTitle))])) {
                $skipped[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'title' => $sourceTitle,
                    'dateTime' => $sourceEvent['dateTime'] ?? null,
                    'reason' => 'title filtered',
                ];
                continue;
            }

            $copyDateTime = targetDateTime((string) ($sourceEvent['dateTime'] ?? ''), $targetUrlname);
            $candidate = [
                'title' => $sourceTitle,
                'dateTime' => $copyDateTime,
            ];
            $key = eventKey($candidate);

            if (isset($existing[$key])) {
                $skipped[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'dateTime' => $copyDateTime,
                    'reason' => 'already exists',
                ];
                continue;
            }

            $input = [
                'groupUrlname' => $targetUrlname,
                'title' => (string) ($sourceEvent['title'] ?? ''),
                'description' => (string) ($sourceEvent['description'] ?? ''),
                'startDateTime' => $copyDateTime,
                'duration' => (string) ($sourceEvent['duration'] ?? 'PT2H'),
                'publishStatus' => 'PUBLISHED',
                'isCopy' => true,
            ];

            if (!empty($sourceEvent['howToFindUs'])) {
                $input['howToFindUs'] = (string) $sourceEvent['howToFindUs'];
            }

            $venues = $sourceEvent['venues'] ?? [];
            if (is_array($venues) && !empty($venues[0]['id'])) {
                $input['venueId'] = (string) $venues[0]['id'];
            } elseif (!empty($sourceEvent['venue']['id'])) {
                $input['venueId'] = (string) $sourceEvent['venue']['id'];
            }

            $createResult = graphQL(<<<'GRAPHQL'
mutation ($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      id
      title
      eventUrl
      status
      dateTime
      duration
      venue { id name }
      group { id name urlname }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

            $payload = $createResult['response']['data']['createEvent'] ?? null;
            if (!is_array($payload) || !empty($payload['errors']) || empty($payload['event'])) {
                $errors[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'result' => $createResult,
                ];
                continue;
            }

            $created[] = [
                'source_id' => $sourceEvent['id'] ?? null,
                'event' => $payload['event'],
            ];
            $existing[$key] = true;
        }

        respond(200, [
            'ok' => empty($errors),
            'source' => $sourceUrlname,
            'target' => $targetUrlname,
            'title_filter' => array_keys($allowedTitles),
            'created' => $created,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    if ($action === 'create-network-event-from-existing') {
        $sourceUrlname = trim((string) ($_GET['source'] ?? 'advanced-ai-concepts'));
        $eventId = trim((string) ($_GET['event_id'] ?? ''));
        $startDateTime = trim((string) ($_GET['start_datetime'] ?? ''));
        $networkTimezone = trim((string) ($_GET['timezone'] ?? 'America/Denver'));
        $fromEventId = trim((string) ($_GET['from_event_id'] ?? ''));
        $filterId = trim((string) ($_GET['filter_id'] ?? ''));
        $networkOnly = (string) ($_GET['network_only'] ?? 'false') === 'true';
        $publishStatus = strtoupper(trim((string) ($_GET['publish_status'] ?? 'DRAFT')));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'create-network-event-from-existing';

        if ($eventId === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing event_id.',
            ]);
        }

        if ($publishStatus !== 'DRAFT' && $publishStatus !== 'PUBLISHED') {
            respond(400, [
                'ok' => false,
                'error' => 'publish_status must be DRAFT or PUBLISHED.',
            ]);
        }

        $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 50) {
      edges {
        node {
          id
          title
          description
          eventUrl
          status
          dateTime
          duration
          networkEvent { id title eventTime groupCount status timezone }
          howToFindUs
          venue { id name }
          venues { id name }
          featuredEventPhoto { id baseUrl standardUrl thumbUrl }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $sourceUrlname], $tokenPath);

        $sourceEdges = $eventsResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
        if (!is_array($sourceEdges)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load source events.',
                'result' => $eventsResult,
            ]);
        }

        $sourceEvent = null;
        foreach ($sourceEdges as $edge) {
            $candidate = $edge['node'] ?? null;
            if (is_array($candidate) && (string) ($candidate['id'] ?? '') === $eventId) {
                $sourceEvent = $candidate;
                break;
            }
        }

        if (!is_array($sourceEvent)) {
            respond(404, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Source event not found.',
                'event_id' => $eventId,
            ]);
        }

        $input = [
            'title' => (string) ($sourceEvent['title'] ?? ''),
            'description' => (string) ($sourceEvent['description'] ?? ''),
            'startDateTime' => $startDateTime !== '' ? $startDateTime : (string) ($sourceEvent['dateTime'] ?? ''),
            'duration' => (string) ($sourceEvent['duration'] ?? 'PT2H'),
            'publishStatus' => $publishStatus,
            'isCopy' => true,
            'proNetworkEvents' => [
                'timezone' => $networkTimezone,
            ],
        ];

        if (!$networkOnly) {
            $input['groupUrlname'] = $sourceUrlname;
        }

        if ($fromEventId !== '') {
            $input['proNetworkEvents']['fromEventId'] = $fromEventId;
        }

        if ($filterId !== '') {
            $input['proNetworkEvents']['filterId'] = $filterId;
        }

        if (!empty($sourceEvent['howToFindUs'])) {
            $input['howToFindUs'] = (string) $sourceEvent['howToFindUs'];
        }

        $venues = $sourceEvent['venues'] ?? [];
        if (is_array($venues) && !empty($venues[0]['id'])) {
            $input['venueId'] = (string) $venues[0]['id'];
        } elseif (!empty($sourceEvent['venue']['id'])) {
            $input['venueId'] = (string) $sourceEvent['venue']['id'];
        }

        if ($dryRun) {
            respond(200, [
                'ok' => true,
                'dry_run' => true,
                'source_event' => [
                    'id' => $sourceEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'dateTime' => $sourceEvent['dateTime'] ?? null,
                    'network_event_id' => $sourceEvent['networkEvent']['id'] ?? null,
                ],
                'input' => $input,
            ]);
        }

        $createResult = graphQL(<<<'GRAPHQL'
mutation ($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      id
      title
      eventUrl
      status
      dateTime
      duration
      networkEvent { id title eventTime groupCount status timezone }
      group { id name urlname }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

        $payload = $createResult['response']['data']['createEvent'] ?? null;
        $errors = is_array($payload) ? ($payload['errors'] ?? []) : [];

        respond(empty($errors) && !empty($payload['event']) ? 200 : 500, [
            'ok' => empty($errors) && !empty($payload['event']),
            'dry_run' => false,
            'source_event_id' => $eventId,
            'result' => $createResult,
        ]);
    }

    if ($action === 'delete-event') {
        $eventId = trim((string) ($_GET['event_id'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $removeFromCalendar = (string) ($_GET['remove_from_calendar'] ?? 'true') !== 'false';

        if ($eventId === '' || $confirm !== $eventId) {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation. Set confirm to the event_id.',
                'expected_confirm' => $eventId,
            ]);
        }

        $deleteResult = graphQL(<<<'GRAPHQL'
mutation ($input: DeleteEventInput!) {
  deleteEvent(input: $input) {
    errors { message field code }
  }
}
GRAPHQL, [
            'input' => [
                'eventId' => $eventId,
                'removeFromCalendar' => $removeFromCalendar,
            ],
        ], $tokenPath);

        $errors = $deleteResult['response']['data']['deleteEvent']['errors'] ?? [];
        respond(empty($errors) ? 200 : 500, [
            'ok' => empty($errors),
            'event_id' => $eventId,
            'result' => $deleteResult,
        ]);
    }

    if ($action === 'set-event-start-time') {
        $eventId = trim((string) ($_GET['event_id'] ?? ''));
        $startDateTime = trim((string) ($_GET['start_datetime'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== $eventId;

        if ($eventId === '' || $startDateTime === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Provide event_id and start_datetime.',
            ]);
        }

        $input = [
            'eventId' => $eventId,
            'startDateTime' => $startDateTime,
        ];

        if ($dryRun) {
            respond(200, [
                'ok' => true,
                'dry_run' => true,
                'input' => $input,
            ]);
        }

        $editResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      eventUrl
      status
      dateTime
      group { id name urlname }
      networkEvent { id title eventTime groupCount status timezone }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

        $payload = $editResult['response']['data']['editEvent'] ?? null;
        $errors = is_array($payload) ? ($payload['errors'] ?? []) : [];

        respond(empty($errors) && !empty($payload['event']) ? 200 : 500, [
            'ok' => empty($errors) && !empty($payload['event']),
            'dry_run' => false,
            'result' => $editResult,
        ]);
    }

    if ($action === 'attach-event-to-network-event') {
        $eventId = trim((string) ($_GET['event_id'] ?? ''));
        $fromEventId = trim((string) ($_GET['from_event_id'] ?? ''));
        $timezone = trim((string) ($_GET['timezone'] ?? 'America/Denver'));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== $eventId;

        if ($eventId === '' || $fromEventId === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Provide event_id and from_event_id.',
            ]);
        }

        $input = [
            'eventId' => $eventId,
            'proNetworkEvents' => [
                'fromEventId' => $fromEventId,
                'timezone' => $timezone,
            ],
        ];

        if ($dryRun) {
            respond(200, [
                'ok' => true,
                'dry_run' => true,
                'input' => $input,
            ]);
        }

        $editResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      eventUrl
      status
      dateTime
      networkEvent { id title eventTime groupCount status timezone }
      group { id name urlname }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

        $payload = $editResult['response']['data']['editEvent'] ?? null;
        $errors = is_array($payload) ? ($payload['errors'] ?? []) : [];

        respond(empty($errors) && !empty($payload['event']) ? 200 : 500, [
            'ok' => empty($errors) && !empty($payload['event']),
            'dry_run' => false,
            'result' => $editResult,
        ]);
    }


    if ($action === 'network-groups') {
        $query = trim((string) ($_GET['query'] ?? ''));
        $networkEventFilterId = trim((string) ($_GET['network_event_filter_id'] ?? ''));
        $first = max(1, min(100, (int) ($_GET['first'] ?? 100)));

        $filter = [];
        if ($query !== '') {
            $filter['query'] = $query;
        }

        $input = [
            'first' => $first,
            'sort' => 'createdDate',
            'desc' => true,
        ];
        if ($networkEventFilterId !== '') {
            $input['networkEventFilterId'] = $networkEventFilterId;
        }
        if (!empty($filter)) {
            $input['filter'] = $filter;
        }

        $networkResult = graphQL(<<<'GRAPHQL'
query ($input: ProNetworkGroupsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    id
    name
    urlname
    groupsSearch(input: $input) {
      totalCount
      edges {
        node {
          id
          name
          urlname
          city
          state
          country
          zip
          link
          proNetwork { id urlname name }
        }
      }
    }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

        respond(200, [
            'ok' => true,
            'result' => $networkResult,
        ]);
    }

    if ($action === 'question-report') {
        $days = max(1, min(30, (int) ($_GET['days'] ?? 7)));
        $since = (new DateTimeImmutable('now', new DateTimeZone('UTC')))
            ->sub(new DateInterval('P' . $days . 'D'));

        $extraUrlnames = [
            'advanced-ai-concepts-kinshasa',
            'advanced-ai-concepts-istanbul',
            'advanced-ai-concepts-ho-chi-minh-city',
            'advanced-ai-concepts-lahore',
            'advanced-ai-concepts-karachi',
            'advanced-ai-concepts-moscow',
            'advanced-ai-concepts-dhaka',
            'advanced-ai-concepts-seoul',
            'advanced-ai-concepts-cairo',
            'advanced-ai-concepts-jakarta',
            'advanced-ai-concepts-hanoi',
            'advanced-ai-concepts-taipei',
            'advanced-ai-concepts-lima',
            'advanced-ai-concepts-bogota',
            'advanced-ai-concepts-hong-kong',
            'advanced-ai-concepts-rio-de-janeiro',
            'advanced-ai-concepts-ahmedabad',
            'advanced-ai-concepts-abidjan',
        ];

        $groupsResult = graphQL(<<<'GRAPHQL'
query ($input: ProNetworkGroupsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    groupsSearch(input: $input) {
      edges {
        node {
          id
          name
          urlname
          city
          state
          country
          link
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 100,
                'sort' => 'createdDate',
                'desc' => true,
            ],
        ], $tokenPath);

        $groupEdges = $groupsResult['response']['data']['proNetwork']['groupsSearch']['edges'] ?? [];
        $groups = [];
        foreach ($groupEdges as $edge) {
            $group = $edge['node'] ?? null;
            if (is_array($group) && !empty($group['urlname'])) {
                $groups[(string) $group['urlname']] = $group;
            }
        }

        foreach ($extraUrlnames as $urlname) {
            if (isset($groups[$urlname])) {
                continue;
            }
            $groupResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    city
    state
    country
    link
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);
            $group = $groupResult['response']['data']['groupByUrlname'] ?? null;
            if (is_array($group) && !empty($group['urlname'])) {
                $groups[(string) $group['urlname']] = $group;
            }
        }

        $groupQuestions = [];
        $eventComments = [];
        $groupErrors = [];
        foreach ($groups as $urlname => $groupSummary) {
            $detailResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    link
    needsQuestions
    questions {
      id
      question
      sort
    }
    events(first: 20) {
      edges {
        node {
          id
          title
          eventUrl
          status
          dateTime
          comments(first: 20, sortOrder: DESC) {
            totalCount
            edges {
              node {
                id
                created
                text
                link
                member {
                  id
                  name
                  memberUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);

            $loadedGroup = $detailResult['response']['data']['groupByUrlname'] ?? null;
            if (!is_array($loadedGroup)) {
                $groupErrors[] = [
                    'urlname' => $urlname,
                    'result' => $detailResult,
                ];
                continue;
            }

            foreach (($loadedGroup['questions'] ?? []) as $question) {
                $groupQuestions[] = [
                    'group' => $loadedGroup['name'] ?? '',
                    'urlname' => $urlname,
                    'link' => $loadedGroup['link'] ?? '',
                    'question_id' => $question['id'] ?? '',
                    'question' => $question['question'] ?? '',
                    'sort' => $question['sort'] ?? null,
                ];
            }

            foreach (($loadedGroup['events']['edges'] ?? []) as $eventEdge) {
                $event = $eventEdge['node'] ?? null;
                if (!is_array($event)) {
                    continue;
                }
                foreach (($event['comments']['edges'] ?? []) as $commentEdge) {
                    $comment = $commentEdge['node'] ?? null;
                    if (!is_array($comment)) {
                        continue;
                    }
                    $createdRaw = (string) ($comment['created'] ?? '');
                    try {
                        $created = new DateTimeImmutable($createdRaw);
                    } catch (Throwable $ignored) {
                        $created = null;
                    }
                    if ($created !== null && $created < $since) {
                        continue;
                    }
                    $eventComments[] = [
                        'group' => $loadedGroup['name'] ?? '',
                        'urlname' => $urlname,
                        'event_id' => $event['id'] ?? '',
                        'event_title' => $event['title'] ?? '',
                        'event_status' => $event['status'] ?? '',
                        'event_time' => $event['dateTime'] ?? '',
                        'event_url' => $event['eventUrl'] ?? '',
                        'comment_id' => $comment['id'] ?? '',
                        'created' => $createdRaw,
                        'text' => $comment['text'] ?? '',
                        'link' => $comment['link'] ?? '',
                        'member' => $comment['member']['name'] ?? '',
                        'member_url' => $comment['member']['memberUrl'] ?? '',
                    ];
                }
            }
        }

        $registrationResult = graphQL(<<<'GRAPHQL'
query ($input: ProEventRegistrationAnswersInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    eventRegistrationAnswers(input: $input) {
      totalCount
      edges {
        node {
          updatedAt
          member {
            id
            name
            memberUrl
          }
          event {
            id
            title
            eventUrl
            dateTime
            status
            group {
              id
              name
              urlname
            }
          }
          answers {
            question
            answer
          }
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 100,
            ],
        ], $tokenPath);

        $registrationAnswers = [];
        foreach (($registrationResult['response']['data']['proNetwork']['eventRegistrationAnswers']['edges'] ?? []) as $edge) {
            $registration = $edge['node'] ?? null;
            if (!is_array($registration)) {
                continue;
            }
            $updatedRaw = (string) ($registration['updatedAt'] ?? '');
            try {
                $updated = new DateTimeImmutable($updatedRaw);
            } catch (Throwable $ignored) {
                $updated = null;
            }
            if ($updated !== null && $updated < $since) {
                continue;
            }
            foreach (($registration['answers'] ?? []) as $answer) {
                $registrationAnswers[] = [
                    'updated_at' => $updatedRaw,
                    'member' => $registration['member']['name'] ?? '',
                    'member_url' => $registration['member']['memberUrl'] ?? '',
                    'event_id' => $registration['event']['id'] ?? '',
                    'event_title' => $registration['event']['title'] ?? '',
                    'event_url' => $registration['event']['eventUrl'] ?? '',
                    'event_time' => $registration['event']['dateTime'] ?? '',
                    'group' => $registration['event']['group']['name'] ?? '',
                    'urlname' => $registration['event']['group']['urlname'] ?? '',
                    'question' => $answer['question'] ?? '',
                    'answer' => $answer['answer'] ?? '',
                ];
            }
        }

        respond(200, [
            'ok' => true,
            'days' => $days,
            'since' => $since->format(DateTimeInterface::ATOM),
            'group_count' => count($groups),
            'group_question_count' => count($groupQuestions),
            'event_comment_count' => count($eventComments),
            'registration_answer_count' => count($registrationAnswers),
            'group_questions' => $groupQuestions,
            'event_comments' => $eventComments,
            'registration_answers' => $registrationAnswers,
            'group_errors' => $groupErrors,
            'registration_result_status' => [
                'http_status' => $registrationResult['http_status'] ?? null,
                'transport_error' => $registrationResult['transport_error'] ?? '',
                'errors' => $registrationResult['response']['errors'] ?? [],
            ],
        ]);
    }

    if ($action === 'update-group-descriptions') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respond(405, [
                'ok' => false,
                'error' => 'Use POST for description updates.',
            ]);
        }

        $input = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($input)) {
            respond(400, [
                'ok' => false,
                'error' => 'Expected JSON body.',
            ]);
        }

        $description = trim((string) ($input['description'] ?? ''));
        $confirm = trim((string) ($input['confirm'] ?? ''));
        if ($description === '' || $confirm !== 'update Advanced AI Concepts group descriptions') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing description or confirmation.',
                'expected_confirm' => 'update Advanced AI Concepts group descriptions',
            ]);
        }

        $networkResult = graphQL(<<<'GRAPHQL'
query ($input: ProNetworkGroupsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    id
    name
    urlname
    groupsSearch(input: $input) {
      totalCount
      edges {
        node {
          id
          name
          urlname
          city
          state
          link
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 25,
                'sort' => 'createdDate',
                'desc' => true,
            ],
        ], $tokenPath);

        $edges = $networkResult['response']['data']['proNetwork']['groupsSearch']['edges'] ?? [];
        if (!is_array($edges) || empty($edges)) {
            respond(500, [
                'ok' => false,
                'error' => 'No Advanced AI Concepts network groups found.',
                'network' => $networkResult,
            ]);
        }

        $updates = [];
        $errors = [];

        foreach ($edges as $edge) {
            $group = $edge['node'] ?? null;
            if (!is_array($group) || empty($group['id'])) {
                continue;
            }

            $updateResult = graphQL(<<<'GRAPHQL'
mutation ($chapterId: ID!, $description: String!) {
  updateGroup(chapterId: $chapterId, input: { shortDesc: $description }) {
    id
    name
    urlname
    description
    welcomeBlurb
    link
  }
}
GRAPHQL, [
                'chapterId' => (string) $group['id'],
                'description' => $description,
            ], $tokenPath);

            $updatedGroup = $updateResult['response']['data']['updateGroup'] ?? null;
            $groupErrors = $updateResult['response']['errors'] ?? [];

            if (!empty($groupErrors) || !is_array($updatedGroup)) {
                $errors[] = [
                    'urlname' => (string) ($group['urlname'] ?? ''),
                    'errors' => $groupErrors ?: ($updateResult['response']['errors'] ?? ['Unknown update failure']),
                ];
                continue;
            }

            $updates[] = [
                'id' => (string) ($updatedGroup['id'] ?? ''),
                'name' => (string) ($updatedGroup['name'] ?? ''),
                'urlname' => (string) ($updatedGroup['urlname'] ?? ''),
                'link' => (string) ($updatedGroup['link'] ?? ''),
                'description_length' => strlen((string) ($updatedGroup['description'] ?? '')),
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'attempted' => count($edges),
            'updated' => count($updates),
            'groups' => $updates,
            'errors' => $errors,
        ]);
    }

    if ($action === 'send-group-announcements') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respond(405, [
                'ok' => false,
                'error' => 'Use POST for group announcements.',
            ]);
        }

        $input = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($input)) {
            respond(400, [
                'ok' => false,
                'error' => 'Expected JSON body.',
            ]);
        }

        $networkUrlname = trim((string) ($input['network'] ?? 'advanced-ai-concepts'));
        $targetUrlname = trim((string) ($input['target'] ?? ''));
        $subject = trim((string) ($input['subject'] ?? ''));
        $body = trim((string) ($input['body'] ?? ''));
        $confirm = trim((string) ($input['confirm'] ?? ''));
        $dryRun = $confirm !== 'send-group-announcements';

        if ($subject === '' || $body === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing subject or body.',
            ]);
        }

        $groupsResult = graphQL(<<<'GRAPHQL'
query ($input: ProNetworkGroupsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    id
    name
    urlname
    groupsSearch(input: $input) {
      totalCount
      edges {
        node {
          id
          name
          urlname
          city
          state
          link
          emailAnnounceAddress
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 100,
                'sort' => 'createdDate',
                'desc' => true,
            ],
        ], $tokenPath);

        $edges = $groupsResult['response']['data']['proNetwork']['groupsSearch']['edges'] ?? [];
        if (!is_array($edges)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load Pro network groups.',
                'result' => $groupsResult,
            ]);
        }

        $sent = [];
        $skipped = [];
        $errors = [];
        $seen = [];

        foreach ($edges as $edge) {
            $group = $edge['node'] ?? null;
            if (!is_array($group)) {
                continue;
            }

            $urlname = (string) ($group['urlname'] ?? '');
            $email = trim((string) ($group['emailAnnounceAddress'] ?? ''));
            $summary = [
                'group_id' => (string) ($group['id'] ?? ''),
                'name' => (string) ($group['name'] ?? ''),
                'urlname' => $urlname,
                'city' => (string) ($group['city'] ?? ''),
                'state' => (string) ($group['state'] ?? ''),
                'link' => (string) ($group['link'] ?? ''),
                'recipient' => $email,
            ];

            if ($targetUrlname !== '' && $urlname !== $targetUrlname) {
                $skipped[] = $summary + ['reason' => 'not targeted'];
                continue;
            }

            if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                $errors[] = $summary + ['reason' => 'missing or invalid announce email'];
                continue;
            }

            if (isset($seen[strtolower($email)])) {
                $skipped[] = $summary + ['reason' => 'duplicate recipient'];
                continue;
            }
            $seen[strtolower($email)] = true;

            $result = sendPlainAnnouncementEmail($email, $subject, $body, $dryRun);
            if (empty($result['ok'])) {
                $errors[] = $summary + ['reason' => 'mail failed'];
                continue;
            }

            $sent[] = $summary + ['dry_run' => $dryRun];
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'network' => $networkUrlname,
            'target' => $targetUrlname,
            'subject' => $subject,
            'body_length' => strlen($body),
            'total_loaded' => count($edges),
            'sent_count' => count($sent),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'sent' => $sent,
            'errors' => $errors,
        ]);
    }

    if ($action === 'update-welcome-messages') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respond(405, [
                'ok' => false,
                'error' => 'Use POST for welcome message updates.',
            ]);
        }

        $input = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($input)) {
            respond(400, [
                'ok' => false,
                'error' => 'Expected JSON body.',
            ]);
        }

        $message = trim((string) ($input['message'] ?? ''));
        $confirm = trim((string) ($input['confirm'] ?? ''));
        if ($message === '' || $confirm !== 'update Advanced AI Concepts welcome messages') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing message or confirmation.',
                'expected_confirm' => 'update Advanced AI Concepts welcome messages',
            ]);
        }

        $networkResult = graphQL(<<<'GRAPHQL'
query ($input: ProNetworkGroupsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    id
    name
    urlname
    groupsSearch(input: $input) {
      totalCount
      edges {
        node {
          id
          name
          urlname
          city
          state
          link
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 50,
                'sort' => 'createdDate',
                'desc' => true,
            ],
        ], $tokenPath);

        $edges = $networkResult['response']['data']['proNetwork']['groupsSearch']['edges'] ?? [];
        if (!is_array($edges) || empty($edges)) {
            respond(500, [
                'ok' => false,
                'error' => 'No Advanced AI Concepts network groups found.',
                'network' => $networkResult,
            ]);
        }

        $updates = [];
        $errors = [];

        foreach ($edges as $edge) {
            $group = $edge['node'] ?? null;
            if (!is_array($group) || empty($group['id'])) {
                continue;
            }

            $updateResult = graphQL(<<<'GRAPHQL'
mutation ($input: UpdateGroupSettingsInput!) {
  updateGroupSettings(input: $input) {
    group {
      id
      name
      urlname
      welcomeBlurb
      link
    }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'id' => (string) $group['id'],
                    'welcomeBlurb' => $message,
                ],
            ], $tokenPath);

            $payload = $updateResult['response']['data']['updateGroupSettings'] ?? null;
            $groupErrors = is_array($payload) ? ($payload['errors'] ?? []) : ($updateResult['response']['errors'] ?? []);
            $updatedGroup = is_array($payload) ? ($payload['group'] ?? null) : null;

            if (!empty($groupErrors) || !is_array($updatedGroup)) {
                $errors[] = [
                    'urlname' => (string) ($group['urlname'] ?? ''),
                    'errors' => $groupErrors ?: ['Unknown update failure'],
                ];
                continue;
            }

            $updates[] = [
                'id' => (string) ($updatedGroup['id'] ?? ''),
                'name' => (string) ($updatedGroup['name'] ?? ''),
                'urlname' => (string) ($updatedGroup['urlname'] ?? ''),
                'link' => (string) ($updatedGroup['link'] ?? ''),
                'welcome_length' => strlen((string) ($updatedGroup['welcomeBlurb'] ?? '')),
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'attempted' => count($edges),
            'updated' => count($updates),
            'groups' => $updates,
            'errors' => $errors,
        ]);
    }


    if ($action === 'create-dallas-draft') {
        $confirm = (string) ($_GET['confirm'] ?? '');
        if ($confirm !== 'Advanced AI Concepts-Dallas') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation. Add confirm=Advanced%20AI%20Concepts-Dallas to create the draft.',
            ]);
        }

        $sourceResult = graphQL(<<<'GRAPHQL'
query {
  groupByUrlname(urlname: "advanced-ai-concepts") {
    id
    name
    description
    customMemberLabel
    activeTopics { id name urlkey }
    keyGroupPhoto { id baseUrl standardUrl thumbUrl }
    proNetwork { id urlname name }
  }
}
GRAPHQL, [], $tokenPath);

        $source = $sourceResult['response']['data']['groupByUrlname'] ?? null;
        if (!is_array($source)) {
            respond(500, [
                'ok' => false,
                'error' => 'Unable to load source group.',
                'source_result' => $sourceResult,
            ]);
        }

        $topicIds = [];
        foreach (($source['activeTopics'] ?? []) as $topic) {
            if (!empty($topic['id'])) {
                $topicIds[] = $topic['id'];
            }
        }

        $input = [
            'name' => 'Advanced AI Concepts-Dallas',
            'description' => (string) ($source['description'] ?? ''),
            'customMembersLabel' => (string) ($source['customMemberLabel'] ?? 'Members'),
            'topics' => $topicIds,
            'urlname' => 'advanced-ai-concepts-dallas',
            'location' => [
                'geoLocation' => [
                    'country' => 'us',
                    'zip' => '75201',
                ],
            ],
        ];

        $draftResult = graphQL(<<<'GRAPHQL'
mutation ($input: CreateGroupDraftInput!) {
  createGroupDraft(input: $input) {
    token
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      activeTopics { id name urlkey }
      keyGroupPhoto { id baseUrl standardUrl thumbUrl }
      proNetwork { id urlname name }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $input], $tokenPath);

        respond(200, [
            'ok' => true,
            'source' => [
                'id' => $source['id'] ?? null,
                'name' => $source['name'] ?? null,
                'topic_count' => count($topicIds),
                'photo_id' => $source['keyGroupPhoto']['id'] ?? null,
                'pro_network' => $source['proNetwork']['urlname'] ?? null,
            ],
            'input' => [
                'name' => $input['name'],
                'urlname' => $input['urlname'],
                'zip' => $input['location']['geoLocation']['zip'],
                'topic_count' => count($topicIds),
            ],
            'result' => $draftResult,
        ]);
    }

    if ($action === 'publish-dallas-draft') {
        $confirm = (string) ($_GET['confirm'] ?? '');
        $token = trim((string) ($_GET['token'] ?? ''));
        if ($confirm !== 'publish Advanced AI Concepts-Dallas' || $token === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation or token.',
                'expected_confirm' => 'publish Advanced AI Concepts-Dallas',
            ]);
        }

        $publishResult = graphQL(<<<'GRAPHQL'
mutation ($input: PublishGroupDraftInput!) {
  publishGroupDraft(input: $input) {
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      keyGroupPhoto { id baseUrl standardUrl thumbUrl }
      proNetwork { id urlname name }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => ['token' => $token]], $tokenPath);

        $publishedGroup = $publishResult['response']['data']['publishGroupDraft']['group'] ?? null;
        $groupId = is_array($publishedGroup) ? (string) ($publishedGroup['id'] ?? '') : '';

        $networkResult = null;
        if ($groupId !== '') {
            $networkResult = graphQL(<<<'GRAPHQL'
mutation {
  addGroupToNetworkByUrlname(input: {
    networkUrlname: "advanced-ai-concepts",
    groupUrlname: "advanced-ai-concepts-dallas"
  }) {
    group { id name urlname proNetwork { id urlname name } }
    network { id urlname name }
    errors { message field code }
  }
}
GRAPHQL, [], $tokenPath);
        }

        $photoResult = null;
        if ($groupId !== '') {
            $photoResult = graphQL(<<<'GRAPHQL'
mutation ($input: UpdateGroupInput!) {
  updateGroup(input: $input) {
    group {
      id
      name
      urlname
      keyGroupPhoto { id baseUrl standardUrl thumbUrl }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => ['id' => $groupId, 'logoId' => '534450237']], $tokenPath);
        }

        respond(200, [
            'ok' => true,
            'publish' => $publishResult,
            'network' => $networkResult,
            'photo' => $photoResult,
        ]);
    }

    if ($action === 'apply-dallas-photo') {
        $confirm = (string) ($_GET['confirm'] ?? '');
        if ($confirm !== 'apply Dallas photo') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation.',
                'expected_confirm' => 'apply Dallas photo',
            ]);
        }

        $photoResult = graphQL(<<<'GRAPHQL'
mutation {
  updateGroup(chapterId: "38530543", input: { coverPhotoId: 534450237 }) {
    id
    name
    urlname
    keyGroupPhoto { id baseUrl standardUrl thumbUrl }
  }
}
GRAPHQL, [], $tokenPath);

        respond(200, [
            'ok' => true,
            'photo' => $photoResult,
        ]);
    }

    if ($action === 'copy-dallas-group-photo') {
        $confirm = (string) ($_GET['confirm'] ?? '');
        if ($confirm !== 'copy Dallas group photo') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation.',
                'expected_confirm' => 'copy Dallas group photo',
            ]);
        }

        $sourceResult = graphQL(<<<'GRAPHQL'
query {
  groupByUrlname(urlname: "advanced-ai-concepts") {
    keyGroupPhoto { id standardUrl baseUrl thumbUrl }
  }
}
GRAPHQL, [], $tokenPath);
        $sourcePhotoUrl = (string) ($sourceResult['response']['data']['groupByUrlname']['keyGroupPhoto']['standardUrl'] ?? '');
        if ($sourcePhotoUrl === '') {
            respond(500, [
                'ok' => false,
                'error' => 'Source group photo URL not found.',
                'source' => $sourceResult,
            ]);
        }

        $uploadResult = createAndUploadPhoto($tokenPath, '38530543', $sourcePhotoUrl, 'GROUP_PHOTO', true);
        $verifyResult = graphQL(<<<'GRAPHQL'
query {
  groupByUrlname(urlname: "advanced-ai-concepts-dallas") {
    id
    name
    urlname
    keyGroupPhoto { id baseUrl standardUrl thumbUrl }
  }
}
GRAPHQL, [], $tokenPath);

        respond(200, [
            'ok' => $uploadResult['ok'],
            'upload' => $uploadResult,
            'verify' => $verifyResult,
        ]);
    }

    if ($action === 'rename-event-title') {
        $urlname = trim((string) ($_GET['urlname'] ?? ''));
        $oldTitle = trim((string) ($_GET['old_title'] ?? ''));
        $newTitle = trim((string) ($_GET['new_title'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));

        if ($urlname === '' || $oldTitle === '' || $newTitle === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing required rename fields.',
                'required' => ['urlname', 'old_title', 'new_title', 'confirm'],
            ]);
        }

        if ($confirm !== $oldTitle . ' -> ' . $newTitle) {
            respond(400, [
                'ok' => false,
                'error' => 'Confirmation must match the event rename.',
                'expected_confirm' => $oldTitle . ' -> ' . $newTitle,
            ]);
        }

        $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 50) {
      edges {
        node {
          id
          title
          status
          dateTime
          eventUrl
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);

        $group = $eventsResult['response']['data']['groupByUrlname'] ?? null;
        if (!is_array($group)) {
            respond(404, [
                'ok' => false,
                'error' => 'Group not found.',
                'result' => $eventsResult,
            ]);
        }

        $renamed = [];
        $skipped = [];
        $errors = [];
        foreach (($group['events']['edges'] ?? []) as $edge) {
            $event = $edge['node'] ?? null;
            if (!is_array($event) || ($event['status'] ?? '') !== 'ACTIVE') {
                continue;
            }

            $title = (string) ($event['title'] ?? '');
            if ($title === $newTitle) {
                $skipped[] = [
                    'id' => $event['id'] ?? null,
                    'title' => $title,
                    'reason' => 'already renamed',
                ];
                continue;
            }

            if ($title !== $oldTitle) {
                continue;
            }

            $editResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      dateTime
      eventUrl
    }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'eventId' => (string) ($event['id'] ?? ''),
                    'title' => $newTitle,
                ],
            ], $tokenPath);

            $payload = $editResult['response']['data']['editEvent'] ?? null;
            $payloadErrors = is_array($payload) ? ($payload['errors'] ?? []) : [];
            if (!empty($payloadErrors)) {
                $errors[] = [
                    'id' => $event['id'] ?? null,
                    'title' => $title,
                    'errors' => $payloadErrors,
                ];
                continue;
            }

            $renamed[] = [
                'old_title' => $title,
                'event' => $payload['event'] ?? null,
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'group' => [
                'id' => $group['id'] ?? null,
                'name' => $group['name'] ?? null,
                'urlname' => $group['urlname'] ?? null,
            ],
            'renamed' => $renamed,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    if ($action === 'copy-event-photos') {
        $sourceUrlname = trim((string) ($_GET['source'] ?? 'advanced-ai-concepts'));
        $targetUrlname = trim((string) ($_GET['target'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));

        if ($targetUrlname === '') {
            respond(400, ['ok' => false, 'error' => 'Missing target group urlname.']);
        }

        if ($confirm !== $targetUrlname) {
            respond(400, [
                'ok' => false,
                'error' => 'Confirmation must match target urlname.',
                'expected_confirm' => $targetUrlname,
            ]);
        }

        $eventsQuery = <<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 50) {
      edges {
        node {
          id
          title
          dateTime
          featuredEventPhoto { id standardUrl baseUrl thumbUrl }
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL;

        $sourceResult = graphQL($eventsQuery, ['urlname' => $sourceUrlname], $tokenPath);
        $targetResult = graphQL($eventsQuery, ['urlname' => $targetUrlname], $tokenPath);
        $sourceEdges = $sourceResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
        $targetEdges = $targetResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
        $targetGroupId = (string) ($targetResult['response']['data']['groupByUrlname']['id'] ?? '');

        if (!is_array($sourceEdges) || !is_array($targetEdges) || $targetGroupId === '') {
            respond(500, [
                'ok' => false,
                'error' => 'Unable to load source or target events.',
                'source' => $sourceResult,
                'target' => $targetResult,
            ]);
        }

        $targetsByKey = [];
        foreach ($targetEdges as $edge) {
            $event = $edge['node'] ?? null;
            if (is_array($event)) {
                $targetsByKey[eventKey($event)] = $event;
            }
        }

        $copied = [];
        $skipped = [];
        $errors = [];

        foreach ($sourceEdges as $edge) {
            $sourceEvent = $edge['node'] ?? null;
            if (!is_array($sourceEvent)) {
                continue;
            }

            $targetDate = targetDateTime((string) ($sourceEvent['dateTime'] ?? ''), $targetUrlname);
            $targetKey = eventKey([
                'title' => $sourceEvent['title'] ?? '',
                'dateTime' => $targetDate,
            ]);
            $targetEvent = $targetsByKey[$targetKey] ?? null;
            $sourcePhotoUrl = (string) ($sourceEvent['featuredEventPhoto']['standardUrl'] ?? '');

            if (!is_array($targetEvent)) {
                $skipped[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'reason' => 'target event not found',
                ];
                continue;
            }

            if (!empty($targetEvent['featuredEventPhoto']['id'])) {
                $skipped[] = [
                    'target_id' => $targetEvent['id'] ?? null,
                    'title' => $targetEvent['title'] ?? null,
                    'reason' => 'target already has photo',
                ];
                continue;
            }

            if ($sourcePhotoUrl === '') {
                $skipped[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'target_id' => $targetEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'reason' => 'source has no photo',
                ];
                continue;
            }

            $uploadResult = createAndUploadPhoto(
                $tokenPath,
                $targetGroupId,
                $sourcePhotoUrl,
                'EVENT_PHOTO',
                true,
                (string) ($targetEvent['id'] ?? '')
            );

            if (!$uploadResult['ok']) {
                $errors[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'target_id' => $targetEvent['id'] ?? null,
                    'title' => $sourceEvent['title'] ?? null,
                    'result' => $uploadResult,
                ];
                continue;
            }

            $copied[] = [
                'source_id' => $sourceEvent['id'] ?? null,
                'target_id' => $targetEvent['id'] ?? null,
                'title' => $sourceEvent['title'] ?? null,
                'photo' => $uploadResult['placeholder']['photo'] ?? null,
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'source' => $sourceUrlname,
            'target' => $targetUrlname,
            'copied' => $copied,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    if ($action === 'sync-event-local-times') {
        $sourceUrlname = trim((string) ($_GET['source'] ?? 'advanced-ai-concepts'));
        $targetUrlname = trim((string) ($_GET['target'] ?? ''));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $limit = max(1, min(500, (int) ($_GET['limit'] ?? 100)));
        $dryRun = $confirm !== $targetUrlname;

        if ($targetUrlname === '') {
            respond(400, ['ok' => false, 'error' => 'Missing target group urlname.']);
        }

        $eventsQuery = <<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    events(first: 50) {
      edges {
        node {
          id
          title
          status
          eventUrl
          dateTime
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL;

        $sourceResult = graphQL($eventsQuery, ['urlname' => $sourceUrlname], $tokenPath);
        $targetResult = graphQL($eventsQuery, ['urlname' => $targetUrlname], $tokenPath);
        $sourceEdges = $sourceResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];
        $targetEdges = $targetResult['response']['data']['groupByUrlname']['events']['edges'] ?? [];

        if (!is_array($sourceEdges) || !is_array($targetEdges)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load source or target events.',
                'source' => $sourceResult,
                'target' => $targetResult,
            ]);
        }

        $targetsByTitle = [];
        foreach ($targetEdges as $edge) {
            $event = $edge['node'] ?? null;
            if (is_array($event)) {
                $targetsByTitle[strtolower(trim((string) ($event['title'] ?? '')))] = $event;
            }
        }

        $updated = [];
        $skipped = [];
        $errors = [];

        foreach ($sourceEdges as $edge) {
            $sourceEvent = $edge['node'] ?? null;
            if (!is_array($sourceEvent) || ($sourceEvent['status'] ?? '') !== 'ACTIVE') {
                continue;
            }

            $title = (string) ($sourceEvent['title'] ?? '');
            $targetEvent = $targetsByTitle[strtolower(trim($title))] ?? null;
            $targetDate = targetDateTime((string) ($sourceEvent['dateTime'] ?? ''), $targetUrlname);

            if (!is_array($targetEvent)) {
                $skipped[] = [
                    'source_id' => $sourceEvent['id'] ?? null,
                    'title' => $title,
                    'reason' => 'target event not found by title',
                ];
                continue;
            }

            $summary = [
                'event_id' => $targetEvent['id'] ?? null,
                'title' => $title,
                'old_date' => $targetEvent['dateTime'] ?? null,
                'target_date' => $targetDate,
                'target_limit' => $limit,
                'event_url' => $targetEvent['eventUrl'] ?? null,
            ];

            if ($dryRun) {
                $updated[] = $summary + ['dry_run' => true];
                continue;
            }

            $editResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      dateTime
      eventUrl
    }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'eventId' => (string) ($targetEvent['id'] ?? ''),
                    'startDateTime' => editEventLocalDateTimeValue($targetDate),
                    'rsvpSettings' => [
                        'rsvpLimit' => $limit,
                    ],
                ],
            ], $tokenPath);

            $payload = $editResult['response']['data']['editEvent'] ?? null;
            $payloadErrors = is_array($payload) ? ($payload['errors'] ?? []) : [];
            if (!is_array($payload) || !empty($payloadErrors) || empty($payload['event'])) {
                $errors[] = $summary + [
                    'reason' => 'edit failed',
                    'result' => $editResult,
                ];
                continue;
            }

            $updated[] = $summary + [
                'dry_run' => false,
                'new_date' => $payload['event']['dateTime'] ?? null,
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'source' => $sourceUrlname,
            'target' => $targetUrlname,
            'updated_count' => count($updated),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }


    if ($action === 'attach-dallas-network') {
        $confirm = (string) ($_GET['confirm'] ?? '');
        if ($confirm !== 'attach Dallas to network') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation.',
                'expected_confirm' => 'attach Dallas to network',
            ]);
        }

        $networkResult = graphQL(<<<'GRAPHQL'
mutation {
  addGroupToNetwork(input: {
    networkId: "1391637342781403051",
    groupId: "38530543"
  }) {
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      proNetwork { id urlname name }
    }
    network { id urlname name }
    errors { message field code }
  }
}
GRAPHQL, [], $tokenPath);

        respond(200, [
            'ok' => true,
            'network' => $networkResult,
        ]);
    }


    if ($action === 'copy-city') {
        $name = trim((string) ($_GET['name'] ?? ''));
        $city = trim((string) ($_GET['city'] ?? ''));
        $state = strtoupper(trim((string) ($_GET['state'] ?? '')));
        $zip = trim((string) ($_GET['zip'] ?? ''));
        $country = strtolower(trim((string) ($_GET['country'] ?? 'us')));
        $latitude = trim((string) ($_GET['latitude'] ?? ''));
        $longitude = trim((string) ($_GET['longitude'] ?? ''));
        $urlname = strtolower(trim((string) ($_GET['urlname'] ?? '')));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $hasPointLocation = $latitude !== '' && $longitude !== '';

        if ($name === '' || $city === '' || $urlname === '' || (!$hasPointLocation && ($state === '' || $zip === ''))) {
            respond(400, [
                'ok' => false,
                'error' => 'Missing required city copy fields.',
                'required' => [
                    'name',
                    'city',
                    'urlname',
                    'confirm',
                    'either state+zip for US geoLocation or latitude+longitude for pointLocation',
                ],
            ]);
        }

        if ($hasPointLocation && (!is_numeric($latitude) || !is_numeric($longitude))) {
            respond(400, [
                'ok' => false,
                'error' => 'latitude and longitude must be numeric.',
            ]);
        }

        if ($confirm !== $name) {
            respond(400, [
                'ok' => false,
                'error' => 'Confirmation must match the target group name.',
                'expected_confirm' => $name,
            ]);
        }

        $existingResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    link
    city
    state
    country
    zip
    proNetwork { id urlname name }
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);

        $existing = $existingResult['response']['data']['groupByUrlname'] ?? null;
        if (is_array($existing)) {
            respond(200, [
                'ok' => true,
                'created' => false,
                'reason' => 'Group already exists.',
                'group' => $existing,
            ]);
        }

        $sourceResult = graphQL(<<<'GRAPHQL'
query {
  groupByUrlname(urlname: "advanced-ai-concepts") {
    id
    name
    description
    customMemberLabel
    activeTopics { id name urlkey }
    keyGroupPhoto { id baseUrl standardUrl thumbUrl }
    proNetwork { id urlname name }
  }
}
GRAPHQL, [], $tokenPath);

        $source = $sourceResult['response']['data']['groupByUrlname'] ?? null;
        if (!is_array($source)) {
            respond(500, [
                'ok' => false,
                'error' => 'Unable to load source group.',
                'source_result' => $sourceResult,
            ]);
        }

        $topicIds = [];
        foreach (($source['activeTopics'] ?? []) as $topic) {
            if (!empty($topic['id'])) {
                $topicIds[] = $topic['id'];
            }
        }

        $location = $hasPointLocation
            ? [
                'pointLocation' => [
                    'latitude' => (float) $latitude,
                    'longitude' => (float) $longitude,
                ],
            ]
            : [
                'geoLocation' => [
                    'country' => $country === '' ? 'us' : $country,
                    'zip' => $zip,
                ],
            ];

        $draftInput = [
            'name' => $name,
            'description' => (string) ($source['description'] ?? ''),
            'customMembersLabel' => (string) ($source['customMemberLabel'] ?? 'Members'),
            'topics' => $topicIds,
            'urlname' => $urlname,
            'location' => $location,
        ];

        $draftResult = graphQL(<<<'GRAPHQL'
mutation ($input: CreateGroupDraftInput!) {
  createGroupDraft(input: $input) {
    token
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      activeTopics { id name urlkey }
      keyGroupPhoto { id baseUrl standardUrl thumbUrl }
      proNetwork { id urlname name }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => $draftInput], $tokenPath);

        $draft = $draftResult['response']['data']['createGroupDraft'] ?? null;
        $draftToken = is_array($draft) ? (string) ($draft['token'] ?? '') : '';
        if ($draftToken === '' || !empty($draft['errors'])) {
            respond(500, [
                'ok' => false,
                'error' => 'Draft creation failed.',
                'draft' => $draftResult,
            ]);
        }

        $publishResult = graphQL(<<<'GRAPHQL'
mutation ($input: PublishGroupDraftInput!) {
  publishGroupDraft(input: $input) {
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      activeTopics { id name urlkey }
      keyGroupPhoto { id baseUrl standardUrl thumbUrl }
      proNetwork { id urlname name }
    }
    errors { message field code }
  }
}
GRAPHQL, ['input' => ['token' => $draftToken]], $tokenPath);

        $publishedGroup = $publishResult['response']['data']['publishGroupDraft']['group'] ?? null;
        $publishedGroupId = is_array($publishedGroup) ? (string) ($publishedGroup['id'] ?? '') : '';
        $networkResult = null;

        if ($publishedGroupId !== '') {
            $networkResult = graphQL(<<<'GRAPHQL'
mutation ($input: AddGroupToNetworkInput!) {
  addGroupToNetwork(input: $input) {
    group {
      id
      name
      urlname
      city
      state
      country
      zip
      link
      proNetwork { id urlname name }
    }
    network { id urlname name }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'networkId' => '1391637342781403051',
                    'groupId' => $publishedGroupId,
                ],
            ], $tokenPath);
        }

        $groupPhotoResult = null;
        $sourcePhotoUrl = (string) ($source['keyGroupPhoto']['standardUrl'] ?? '');
        if ($publishedGroupId !== '' && $sourcePhotoUrl !== '') {
            $groupPhotoResult = createAndUploadPhoto(
                $tokenPath,
                $publishedGroupId,
                $sourcePhotoUrl,
                'GROUP_PHOTO',
                true
            );
        }

        respond(200, [
            'ok' => true,
            'created' => true,
            'source' => [
                'id' => $source['id'] ?? null,
                'name' => $source['name'] ?? null,
                'topic_count' => count($topicIds),
                'photo_id' => $source['keyGroupPhoto']['id'] ?? null,
                'pro_network' => $source['proNetwork']['urlname'] ?? null,
            ],
            'draft' => $draftResult,
            'publish' => $publishResult,
            'network' => $networkResult,
            'group_photo' => $groupPhotoResult,
        ]);
    }

    if ($action === 'attach-network') {
        $urlname = strtolower(trim((string) ($_GET['urlname'] ?? '')));
        $confirm = strtolower(trim((string) ($_GET['confirm'] ?? '')));

        if ($urlname === '' || $confirm !== $urlname) {
            respond(400, [
                'ok' => false,
                'error' => 'Missing confirmation. Set confirm to the group urlname.',
                'expected_confirm' => $urlname,
            ]);
        }

        $groupResult = graphQL(<<<'GRAPHQL'
query ($urlname: String!) {
  groupByUrlname(urlname: $urlname) {
    id
    name
    urlname
    link
    proNetwork { id urlname name }
  }
}
GRAPHQL, ['urlname' => $urlname], $tokenPath);

        $group = $groupResult['response']['data']['groupByUrlname'] ?? null;
        $groupId = is_array($group) ? (string) ($group['id'] ?? '') : '';
        if ($groupId === '') {
            respond(404, [
                'ok' => false,
                'error' => 'Group not found.',
                'group' => $groupResult,
            ]);
        }

        $networkResult = graphQL(<<<'GRAPHQL'
mutation ($input: AddGroupToNetworkInput!) {
  addGroupToNetwork(input: $input) {
    group {
      id
      name
      urlname
      link
      proNetwork { id urlname name }
    }
    network { id urlname name }
    errors { message field code }
  }
}
GRAPHQL, [
            'input' => [
                'networkId' => '1391637342781403051',
                'groupId' => $groupId,
            ],
        ], $tokenPath);

        $errors = $networkResult['response']['data']['addGroupToNetwork']['errors'] ?? [];
        respond(200, [
            'ok' => empty($errors),
            'group' => $group,
            'network' => $networkResult,
        ]);
    }

    if ($action === 'reservation-count') {
        $networkResult = graphQL(<<<'GRAPHQL'
query ($first: Int!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    eventsSearch(input: { first: $first, filter: { status: "UPCOMING" } }) {
      edges {
        node {
          id
          title
          dateTime
          group { urlname }
          rsvps {
            totalCount
          }
        }
      }
    }
  }
}
GRAPHQL, ['first' => 50], $tokenPath);

        $events = $networkResult['response']['data']['proNetwork']['eventsSearch']['edges'] ?? [];
        $total = 0;
        $breakdown = [];
        foreach ($events as $edge) {
            $node = $edge['node'] ?? [];
            $rsvpCount = max(0, (int) ($node['rsvps']['totalCount'] ?? 0) - 1);
            $total += $rsvpCount;
            $breakdown[] = [
                'id'    => $node['id'] ?? null,
                'title' => $node['title'] ?? null,
                'group' => $node['group']['urlname'] ?? null,
                'date'  => $node['dateTime'] ?? null,
                'rsvps' => $rsvpCount,
            ];
        }

        $debug = isset($_GET['debug']) && $_GET['debug'] !== 'false';
        $payload = [
            'ok'        => true,
            'count'     => $total,
            'source'    => 'advanced-ai-concepts',
            'updatedAt' => date('c'),
        ];
        if ($debug) {
            $payload['breakdown'] = $breakdown;
        }
        respond(200, $payload);
    }

    if ($action === 'update-event-rsvp-limits') {
        $networkUrlname = trim((string) ($_GET['network'] ?? 'advanced-ai-concepts'));
        $first = max(1, min(100, (int) ($_GET['first'] ?? 50)));
        $limit = max(1, min(500, (int) ($_GET['limit'] ?? 100)));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'update-event-rsvp-limits';

        $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: ID!, $first: Int!) {
  proNetwork(urlname: $urlname) {
    eventsSearch(input: { first: $first, filter: { status: "UPCOMING" } }) {
      totalCount
      edges {
        node {
          id
          title
          eventUrl
          dateTime
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $networkUrlname, 'first' => $first], $tokenPath);

        $edges = $eventsResult['response']['data']['proNetwork']['eventsSearch']['edges'] ?? [];
        if (!is_array($edges)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load upcoming Meetup events.',
                'result' => $eventsResult,
            ]);
        }

        $updated = [];
        $skipped = [];
        $errors = [];

        foreach ($edges as $edge) {
            $event = $edge['node'] ?? null;
            if (!is_array($event)) {
                continue;
            }

            $eventId = (string) ($event['id'] ?? '');
            $summary = [
                'event_id' => $eventId,
                'title' => (string) ($event['title'] ?? ''),
                'group' => (string) ($event['group']['urlname'] ?? ''),
                'date' => (string) ($event['dateTime'] ?? ''),
                'target_limit' => $limit,
                'event_url' => (string) ($event['eventUrl'] ?? ''),
            ];

            if ($eventId === '') {
                $errors[] = $summary + ['reason' => 'missing event id'];
                continue;
            }

            if ($dryRun) {
                $updated[] = $summary + ['dry_run' => true];
                continue;
            }

            $updateResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      eventUrl
      dateTime
      group { name urlname }
    }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'eventId' => $eventId,
                    'rsvpSettings' => [
                        'rsvpLimit' => $limit,
                    ],
                ],
            ], $tokenPath);

            $payload = $updateResult['response']['data']['editEvent'] ?? null;
            $mutationErrors = is_array($payload) ? ($payload['errors'] ?? []) : [];
            if (!is_array($payload) || !empty($mutationErrors) || empty($payload['event'])) {
                $errors[] = $summary + [
                    'reason' => 'update failed',
                    'result' => $updateResult,
                ];
                continue;
            }

            $updatedEvent = $payload['event'];
            $updated[] = $summary + [
                'dry_run' => false,
                'updated_event_id' => $updatedEvent['id'] ?? null,
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'network' => $networkUrlname,
            'target_limit' => $limit,
            'total_loaded' => count($edges),
            'updated_count' => count($updated),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    if ($action === 'set-event-local-time') {
        $networkUrlname = trim((string) ($_GET['network'] ?? 'advanced-ai-concepts'));
        $first = max(1, min(100, (int) ($_GET['first'] ?? 100)));
        $titleFilter = trim((string) ($_GET['title'] ?? 'Building Agentic Pipelines I'));
        $dateFilter = trim((string) ($_GET['date'] ?? '2026-06-19'));
        $time = trim((string) ($_GET['time'] ?? '18:00'));
        $limit = max(1, min(500, (int) ($_GET['limit'] ?? 100)));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));
        $dryRun = $confirm !== 'set-event-local-time';

        if ($titleFilter === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFilter) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
            respond(400, [
                'ok' => false,
                'error' => 'Provide title, date as YYYY-MM-DD, and time as HH:MM.',
            ]);
        }

        $eventsResult = graphQL(<<<'GRAPHQL'
query ($urlname: ID!, $first: Int!) {
  proNetwork(urlname: $urlname) {
    eventsSearch(input: { first: $first, filter: { status: "UPCOMING" } }) {
      totalCount
      edges {
        node {
          id
          title
          eventUrl
          dateTime
          group { id name urlname }
        }
      }
    }
  }
}
GRAPHQL, ['urlname' => $networkUrlname, 'first' => $first], $tokenPath);

        $edges = $eventsResult['response']['data']['proNetwork']['eventsSearch']['edges'] ?? [];
        if (!is_array($edges)) {
            respond(500, [
                'ok' => false,
                'dry_run' => $dryRun,
                'error' => 'Unable to load upcoming Meetup events.',
                'result' => $eventsResult,
            ]);
        }

        $updated = [];
        $skipped = [];
        $errors = [];

        foreach ($edges as $edge) {
            $event = $edge['node'] ?? null;
            if (!is_array($event)) {
                continue;
            }

            $eventTitle = (string) ($event['title'] ?? '');
            $eventDate = substr((string) ($event['dateTime'] ?? ''), 0, 10);
            if ($eventTitle !== $titleFilter || $eventDate !== $dateFilter) {
                $skipped[] = [
                    'event_id' => $event['id'] ?? null,
                    'title' => $eventTitle,
                    'date' => (string) ($event['dateTime'] ?? ''),
                    'reason' => 'not targeted',
                ];
                continue;
            }

            $groupUrlname = (string) ($event['group']['urlname'] ?? '');
            $timeZone = groupTimeZone($groupUrlname);
            $targetDate = localGroupDateTime($dateFilter, $time, $groupUrlname);
            $summary = [
                'event_id' => $event['id'] ?? null,
                'title' => $eventTitle,
                'group' => $groupUrlname,
                'old_date' => (string) ($event['dateTime'] ?? ''),
                'target_date' => $targetDate,
                'timezone' => $timeZone,
                'target_limit' => $limit,
                'event_url' => (string) ($event['eventUrl'] ?? ''),
            ];

            if ($timeZone === null) {
                $errors[] = $summary + ['reason' => 'missing group timezone'];
                continue;
            }

            if ($dryRun) {
                $updated[] = $summary + ['dry_run' => true];
                continue;
            }

            $updateResult = graphQL(<<<'GRAPHQL'
mutation ($input: EditEventInput!) {
  editEvent(input: $input) {
    event {
      id
      title
      eventUrl
      dateTime
      group { name urlname }
    }
    errors { message field code }
  }
}
GRAPHQL, [
                'input' => [
                    'eventId' => (string) ($event['id'] ?? ''),
                    'startDateTime' => editEventLocalDateTimeValue($targetDate),
                    'rsvpSettings' => [
                        'rsvpLimit' => $limit,
                    ],
                ],
            ], $tokenPath);

            $payload = $updateResult['response']['data']['editEvent'] ?? null;
            $mutationErrors = is_array($payload) ? ($payload['errors'] ?? []) : [];
            if (!is_array($payload) || !empty($mutationErrors) || empty($payload['event'])) {
                $errors[] = $summary + [
                    'reason' => 'update failed',
                    'result' => $updateResult,
                ];
                continue;
            }

            $updated[] = $summary + [
                'dry_run' => false,
                'new_date' => $payload['event']['dateTime'] ?? null,
            ];
        }

        respond(200, [
            'ok' => empty($errors),
            'dry_run' => $dryRun,
            'network' => $networkUrlname,
            'title' => $titleFilter,
            'date' => $dateFilter,
            'time' => $time,
            'target_limit' => $limit,
            'total_loaded' => count($edges),
            'updated_count' => count($updated),
            'skipped_count' => count($skipped),
            'error_count' => count($errors),
            'updated' => $updated,
            'errors' => $errors,
        ]);
    }

    respond(400, ['ok' => false, 'error' => 'Unknown action.']);
} catch (Throwable $exception) {
    respond(500, ['ok' => false, 'error' => $exception->getMessage()]);
}
