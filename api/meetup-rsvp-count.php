<?php
/**
 * Public RSVP summary for the Watch page.
 */

declare(strict_types=1);

const MEETUP_RSVP_TOKEN_ENDPOINT = 'https://secure.meetup.com/oauth2/access';
const MEETUP_RSVP_GRAPHQL_ENDPOINT = 'https://api.meetup.com/gql-ext';
const MEETUP_RSVP_CACHE_TTL = 300;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=300');

function rsvpRespond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function rsvpLoadEnvFile(string $path): void {
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

function rsvpLoadProjectEnv(): ?string {
    $projectRoot = dirname(__DIR__);
    foreach ([
        $projectRoot . '/.env',
        dirname($projectRoot) . '/.env',
        dirname($projectRoot, 2) . '/.env',
        dirname($projectRoot, 2) . '/mojo.env',
    ] as $path) {
        if (is_readable($path)) {
            rsvpLoadEnvFile($path);
            return $path;
        }
    }

    return null;
}

function rsvpEnvValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function rsvpTokenStorePath(?string $loadedEnv): string {
    $configured = rsvpEnvValue('MEETUP_TOKEN_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return $loadedEnv === null ? '' : dirname($loadedEnv) . '/meetup-oauth-token.json';
}

function rsvpCachePath(): string {
    $configured = rsvpEnvValue('MOJO_MEETUP_RSVP_COUNT_CACHE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/mojo-meetup-rsvp-count.json';
}

function rsvpReadJson(string $path): array {
    if ($path === '' || !is_readable($path)) {
        throw new RuntimeException('JSON file was not found.');
    }

    $payload = json_decode((string) file_get_contents($path), true);
    if (!is_array($payload)) {
        throw new RuntimeException('JSON file was invalid.');
    }

    return $payload;
}

function rsvpWriteJson(string $path, array $payload): void {
    $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        return;
    }

    @file_put_contents($path, $encoded . PHP_EOL, LOCK_EX);
}

function rsvpPostForm(string $url, array $fields): array {
    $body = http_build_query($fields, '', '&', PHP_QUERY_RFC3986);
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

    return [$status, $responseBody === false ? '' : $responseBody];
}

function rsvpPostJson(string $url, array $payload, string $accessToken): array {
    $body = json_encode($payload);
    if ($body === false) {
        throw new RuntimeException('Unable to encode JSON request.');
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

    return [$status, $responseBody === false ? '' : $responseBody];
}

function rsvpRefreshToken(string $tokenPath): array {
    $tokens = rsvpReadJson($tokenPath);
    if (empty($tokens['refresh_token'])) {
        throw new RuntimeException('Stored Meetup token has no refresh token.');
    }

    [$status, $responseBody] = rsvpPostForm(MEETUP_RSVP_TOKEN_ENDPOINT, [
        'client_id' => rsvpEnvValue('MEETUP_CLIENT_ID'),
        'client_secret' => rsvpEnvValue('MEETUP_CLIENT_SECRET'),
        'grant_type' => 'refresh_token',
        'refresh_token' => $tokens['refresh_token'],
    ]);

    $refreshed = json_decode($responseBody, true);
    if (!is_array($refreshed) || $status < 200 || $status >= 300 || empty($refreshed['access_token'])) {
        throw new RuntimeException('Meetup rejected refresh token request.');
    }

    $refreshed['stored_at'] = gmdate('c');
    rsvpWriteJson($tokenPath, $refreshed);
    return $refreshed;
}

function rsvpGraphQL(string $query, array $variables, string $tokenPath): array {
    $tokens = rsvpReadJson($tokenPath);
    [$status, $responseBody] = rsvpPostJson(MEETUP_RSVP_GRAPHQL_ENDPOINT, [
        'query' => $query,
        'variables' => (object) $variables,
    ], (string) $tokens['access_token']);

    $payload = json_decode($responseBody, true);
    $expired = is_array($payload)
        && !empty($payload['errors'])
        && strpos(json_encode($payload['errors']), 'access_token_invalid') !== false;

    if ($expired) {
        $tokens = rsvpRefreshToken($tokenPath);
        [$status, $responseBody] = rsvpPostJson(MEETUP_RSVP_GRAPHQL_ENDPOINT, [
            'query' => $query,
            'variables' => (object) $variables,
        ], (string) $tokens['access_token']);
        $payload = json_decode($responseBody, true);
    }

    if ($status < 200 || $status >= 300 || !is_array($payload)) {
        throw new RuntimeException('Meetup GraphQL request failed.');
    }

    return $payload;
}

function rsvpFreshCache(string $path): ?array {
    if (!is_readable($path)) {
        return null;
    }

    $payload = json_decode((string) file_get_contents($path), true);
    if (!is_array($payload) || empty($payload['cachedAt'])) {
        return null;
    }

    $cachedAt = strtotime((string) $payload['cachedAt']);
    if ($cachedAt === false || time() - $cachedAt > MEETUP_RSVP_CACHE_TTL) {
        return null;
    }

    return $payload;
}

function rsvpCountPayload(string $tokenPath): array {
    $events = [];
    $after = null;
    $pages = 0;
    $reportedTotal = 0;

    do {
        $payload = rsvpGraphQL(<<<'GRAPHQL'
query ($input: ProNetworkEventsSearchInput!) {
  proNetwork(urlname: "advanced-ai-concepts") {
    eventsSearch(input: $input) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          dateTime
          description
          eventUrl
          group { urlname }
          rsvps { totalCount }
        }
      }
    }
  }
}
GRAPHQL, [
            'input' => [
                'first' => 100,
                'after' => $after,
                'filter' => ['status' => 'UPCOMING'],
            ],
        ], $tokenPath);

        $search = $payload['data']['proNetwork']['eventsSearch'] ?? [];
        $reportedTotal = max($reportedTotal, (int) ($search['totalCount'] ?? 0));
        foreach (($search['edges'] ?? []) as $edge) {
            $node = is_array($edge) ? ($edge['node'] ?? []) : [];
            if (is_array($node) && !empty($node['id'])) {
                $events[(string) $node['id']] = $node;
            }
        }

        $pageInfo = $search['pageInfo'] ?? [];
        $after = !empty($pageInfo['hasNextPage']) ? (string) ($pageInfo['endCursor'] ?? '') : null;
        $pages++;
    } while ($after !== null && $after !== '' && $pages < 20);

    $total = 0;
    $breakdown = [];
    foreach ($events as $node) {
        $rsvps = max(0, (int) ($node['rsvps']['totalCount'] ?? 0));
        $total += $rsvps;
        $breakdown[] = [
            'id'          => $node['id'] ?? null,
            'title'       => $node['title'] ?? null,
            'group'       => $node['group']['urlname'] ?? null,
            'date'        => $node['dateTime'] ?? null,
            'rsvps'       => $rsvps,
            'description' => $node['description'] ?? null,
            'eventUrl'    => $node['eventUrl'] ?? null,
        ];
    }

    return [
        'ok' => true,
        'count' => $total,
        'event_count' => count($breakdown),
        'reported_event_count' => $reportedTotal,
        'pages' => $pages,
        'source' => 'advanced-ai-concepts',
        'updatedAt' => gmdate('c'),
        'breakdown' => $breakdown,
    ];
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    rsvpRespond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$loadedEnv = rsvpLoadProjectEnv();
$cachePath = rsvpCachePath();
$debug = isset($_GET['debug']) && $_GET['debug'] !== 'false';
$refresh = isset($_GET['refresh']) && $_GET['refresh'] !== 'false';

try {
    $payload = $refresh ? null : rsvpFreshCache($cachePath);
    if ($payload === null) {
        $payload = rsvpCountPayload(rsvpTokenStorePath($loadedEnv));
        $payload['cachedAt'] = gmdate('c');
        rsvpWriteJson($cachePath, $payload);
    }

    if (!$debug) {
        unset($payload['breakdown']);
    }

    rsvpRespond(200, $payload);
} catch (Throwable $error) {
    $stale = is_readable($cachePath) ? json_decode((string) file_get_contents($cachePath), true) : null;
    if (is_array($stale)) {
        $stale['stale'] = true;
        $stale['ok'] = true;
        if (!$debug) {
            unset($stale['breakdown']);
        }
        rsvpRespond(200, $stale);
    }

    rsvpRespond(500, ['ok' => false, 'message' => 'Unable to load Meetup RSVP count.']);
}
