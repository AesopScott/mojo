<?php
/**
 * Private Meetup admin helper.
 *
 * Requires MEETUP_ADMIN_KEY in the server .env and a matching X-Admin-Key
 * header or ?admin_key= query parameter. Intended for one-off organizer
 * operations while building the real admin UI.
 */

declare(strict_types=1);

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

function targetDateTime(string $sourceDateTime, string $targetUrlname): string {
    $timeZones = [
        'advanced-ai-concepts-boston' => 'America/New_York',
        'advanced-ai-concepts-chicago' => 'America/Chicago',
        'advanced-ai-concepts-dallas' => 'America/Chicago',
        'advanced-ai-concepts-los-angeles' => 'America/Los_Angeles',
        'advanced-ai-concepts-miami' => 'America/New_York',
        'advanced-ai-concepts-new-york' => 'America/New_York',
        'advanced-ai-concepts-san-francisco' => 'America/Los_Angeles',
    ];

    if (isset($timeZones[$targetUrlname])) {
        try {
            $localDateTime = substr($sourceDateTime, 0, 19);
            $target = new DateTimeImmutable($localDateTime, new DateTimeZone($timeZones[$targetUrlname]));
            return $target->format('Y-m-d\TH:i:sP');
        } catch (Exception $exception) {
            return $sourceDateTime;
        }
    }

    return $sourceDateTime;
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
    fields {
      name
      args { name type { kind name ofType { kind name ofType { kind name } } } }
      type { kind name ofType { kind name ofType { kind name } } }
    }
    inputFields {
      name
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

    if ($action === 'copy-events') {
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

            $copyDateTime = targetDateTime((string) ($sourceEvent['dateTime'] ?? ''), $targetUrlname);
            $candidate = [
                'title' => (string) ($sourceEvent['title'] ?? ''),
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
            'created' => $created,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }


    if ($action === 'network-groups') {
        $query = trim((string) ($_GET['query'] ?? ''));

        $filter = [];
        if ($query !== '') {
            $filter['query'] = $query;
        }

        $input = [
            'first' => 25,
            'sort' => 'createdDate',
            'desc' => true,
        ];
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
        $urlname = strtolower(trim((string) ($_GET['urlname'] ?? '')));
        $confirm = trim((string) ($_GET['confirm'] ?? ''));

        if ($name === '' || $city === '' || $state === '' || $zip === '' || $urlname === '') {
            respond(400, [
                'ok' => false,
                'error' => 'Missing required city copy fields.',
                'required' => ['name', 'city', 'state', 'zip', 'urlname', 'confirm'],
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

        $draftInput = [
            'name' => $name,
            'description' => (string) ($source['description'] ?? ''),
            'customMembersLabel' => (string) ($source['customMemberLabel'] ?? 'Members'),
            'topics' => $topicIds,
            'urlname' => $urlname,
            'location' => [
                'geoLocation' => [
                    'country' => 'us',
                    'zip' => $zip,
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

    respond(400, ['ok' => false, 'error' => 'Unknown action.']);
} catch (Throwable $exception) {
    respond(500, ['ok' => false, 'error' => $exception->getMessage()]);
}
