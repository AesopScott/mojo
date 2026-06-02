<?php
/**
 * Public top Meetup group member counts for the Watch page.
 */

declare(strict_types=1);

const MEETUP_GROUPS_TOKEN_ENDPOINT = 'https://secure.meetup.com/oauth2/access';
const MEETUP_GROUPS_GRAPHQL_ENDPOINT = 'https://api.meetup.com/gql-ext';
const MEETUP_GROUPS_CACHE_TTL = 3600;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=3600');

function groupsRespond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit;
}

function groupsLoadEnvFile(string $path): void {
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

function groupsLoadProjectEnv(): ?string {
    $projectRoot = dirname(__DIR__);
    foreach ([
        $projectRoot . '/.env',
        dirname($projectRoot) . '/.env',
        dirname($projectRoot, 2) . '/.env',
        dirname($projectRoot, 2) . '/mojo.env',
    ] as $path) {
        if (is_readable($path)) {
            groupsLoadEnvFile($path);
            return $path;
        }
    }

    return null;
}

function groupsEnvValue(string $name, string $default = ''): string {
    $value = getenv($name);
    return $value === false ? $default : trim($value);
}

function groupsTokenStorePath(?string $loadedEnv): string {
    $configured = groupsEnvValue('MEETUP_TOKEN_STORE');
    if ($configured !== '') {
        return $configured;
    }

    return $loadedEnv === null ? '' : dirname($loadedEnv) . '/meetup-oauth-token.json';
}

function groupsCachePath(): string {
    $configured = groupsEnvValue('MOJO_MEETUP_GROUP_LEADERS_CACHE');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 2) . '/mojo-meetup-group-leaders.json';
}

function groupsReadJson(string $path): array {
    if ($path === '' || !is_readable($path)) {
        throw new RuntimeException('JSON file was not found.');
    }

    $payload = json_decode((string) file_get_contents($path), true);
    if (!is_array($payload)) {
        throw new RuntimeException('JSON file was invalid.');
    }

    return $payload;
}

function groupsWriteJson(string $path, array $payload): void {
    $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        return;
    }

    @file_put_contents($path, $encoded . PHP_EOL, LOCK_EX);
}

function groupsPostForm(string $url, array $fields): array {
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

function groupsPostJson(string $url, array $payload, string $accessToken): array {
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

function groupsRefreshToken(string $tokenPath): array {
    $tokens = groupsReadJson($tokenPath);
    if (empty($tokens['refresh_token'])) {
        throw new RuntimeException('Stored Meetup token has no refresh token.');
    }

    [$status, $responseBody] = groupsPostForm(MEETUP_GROUPS_TOKEN_ENDPOINT, [
        'client_id' => groupsEnvValue('MEETUP_CLIENT_ID'),
        'client_secret' => groupsEnvValue('MEETUP_CLIENT_SECRET'),
        'grant_type' => 'refresh_token',
        'refresh_token' => $tokens['refresh_token'],
    ]);

    $refreshed = json_decode($responseBody, true);
    if (!is_array($refreshed) || $status < 200 || $status >= 300 || empty($refreshed['access_token'])) {
        throw new RuntimeException('Meetup rejected refresh token request.');
    }

    $refreshed['stored_at'] = gmdate('c');
    groupsWriteJson($tokenPath, $refreshed);
    return $refreshed;
}

function groupsGraphQL(string $query, array $variables, string $tokenPath): array {
    $tokens = groupsReadJson($tokenPath);
    [$status, $responseBody] = groupsPostJson(MEETUP_GROUPS_GRAPHQL_ENDPOINT, [
        'query' => $query,
        'variables' => (object) $variables,
    ], (string) $tokens['access_token']);

    $payload = json_decode($responseBody, true);
    $expired = is_array($payload)
        && !empty($payload['errors'])
        && strpos(json_encode($payload['errors']), 'access_token_invalid') !== false;

    if ($expired) {
        $tokens = groupsRefreshToken($tokenPath);
        [$status, $responseBody] = groupsPostJson(MEETUP_GROUPS_GRAPHQL_ENDPOINT, [
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

function groupsFreshCache(string $path, int $minimumGroups = 1): ?array {
    if (!is_readable($path)) {
        return null;
    }

    $payload = json_decode((string) file_get_contents($path), true);
    if (!is_array($payload) || empty($payload['cachedAt'])) {
        return null;
    }

    $cachedAt = strtotime((string) $payload['cachedAt']);
    if ($cachedAt === false || time() - $cachedAt > MEETUP_GROUPS_CACHE_TTL) {
        return null;
    }

    if (count($payload['groups'] ?? []) < $minimumGroups) {
        return null;
    }

    return $payload;
}

function groupsCityLabel(array $group): string {
    $city = trim((string) ($group['city'] ?? ''));
    $state = trim((string) ($group['state'] ?? ''));
    if ($city === '') {
        return trim((string) ($group['name'] ?? 'Advanced AI Concepts'));
    }

    return $state === '' || stripos($city, $state) !== false ? $city : $city . ', ' . $state;
}

function groupsPayload(string $tokenPath, int $limit): array {
    $payload = groupsGraphQL(<<<'GRAPHQL'
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
          link
          stats {
            memberCounts {
              all
            }
          }
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

    $edges = $payload['data']['proNetwork']['groupsSearch']['edges'] ?? [];
    $groups = [];
    foreach ($edges as $edge) {
        $node = is_array($edge) ? ($edge['node'] ?? []) : [];
        if (!is_array($node)) {
            continue;
        }

        $groups[] = [
            'city' => groupsCityLabel($node),
            'members' => (int) ($node['stats']['memberCounts']['all'] ?? 0),
            'urlname' => (string) ($node['urlname'] ?? ''),
            'link' => (string) ($node['link'] ?? ''),
        ];
    }

    usort($groups, static function (array $a, array $b): int {
        return $b['members'] <=> $a['members'];
    });

    return [
        'ok' => true,
        'groups' => array_slice($groups, 0, $limit),
        'group_count' => count($groups),
        'source' => 'advanced-ai-concepts',
        'updatedAt' => gmdate('c'),
    ];
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    groupsRespond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$loadedEnv = groupsLoadProjectEnv();
$cachePath = groupsCachePath();
$limit = max(1, min(100, (int) ($_GET['limit'] ?? 20)));

try {
    $payload = groupsFreshCache($cachePath, $limit);
    if ($payload === null) {
        $payload = groupsPayload(groupsTokenStorePath($loadedEnv), 100);
        $payload['cachedAt'] = gmdate('c');
        groupsWriteJson($cachePath, $payload);
    }

    $payload['groups'] = array_slice($payload['groups'] ?? [], 0, $limit);
    groupsRespond(200, $payload);
} catch (Throwable $error) {
    $stale = is_readable($cachePath) ? json_decode((string) file_get_contents($cachePath), true) : null;
    if (is_array($stale)) {
        $stale['stale'] = true;
        $stale['ok'] = true;
        $stale['groups'] = array_slice($stale['groups'] ?? [], 0, $limit);
        groupsRespond(200, $stale);
    }

    groupsRespond(500, ['ok' => false, 'message' => 'Unable to load Meetup group leaders.']);
}
