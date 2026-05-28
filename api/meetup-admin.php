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
  proNetworkByUrlname(urlname: "advanced-ai-concepts") {
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
            'photo_note' => 'Meetup rejected reusing the source photo ID in the Dallas pilot; copy the main photo through the dashboard or a separate upload flow.',
        ]);
    }

    respond(400, ['ok' => false, 'error' => 'Unknown action.']);
} catch (Throwable $exception) {
    respond(500, ['ok' => false, 'error' => $exception->getMessage()]);
}
