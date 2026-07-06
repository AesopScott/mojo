<?php
declare(strict_types=1);

$sessions = [
    'harness' => [
        'title' => 'Global - Dev Automation and Harness Engineering I',
        'date' => '2026-07-12T14:00:00Z',
        'duration' => 120,
        'zoom_url' => 'https://us06web.zoom.us/j/83807077130?pwd=nWRWVcUhdntdUeDHqTw2XLnebkVepi.1',
    ],
    'anthro-cert' => [
        'title' => 'Anthropic Certified Architect Prep',
        'date' => '2026-07-18T00:00:00Z',
        'duration' => 120,
        'zoom_url' => 'https://us06web.zoom.us/j/85138194775?pwd=jtMvJyC6ficqZ4L4H30N8YTgP6PSt8.1',
    ],
    'anthro-cert-global' => [
        'title' => 'Global - Anthropic Certified Architect Prep',
        'date' => '2026-07-19T14:00:00Z',
        'duration' => 120,
        'zoom_url' => 'https://us06web.zoom.us/j/81322966426?pwd=CuThxc5YARefRgufvgogQA5kK7H1RJ.1',
    ],
    'govern' => [
        'title' => 'AI Governance for AI Developers',
        'date' => '2026-07-25T00:00:00Z',
        'duration' => 120,
        'zoom_url' => 'https://us06web.zoom.us/j/82609616968?pwd=LYxMUuIbHoStB6YnQb6IvPPdaOssmi.1',
    ],
    'govern-global' => [
        'title' => 'Global - AI Governance for AI Developers',
        'date' => '2026-07-26T14:00:00Z',
        'duration' => 120,
        'zoom_url' => 'https://us06web.zoom.us/j/81053958115?pwd=eY5KL5ZHFVAUIkieefFhPHKLDwXpZm.1',
    ],
];

$id = trim((string) ($_GET['id'] ?? ''));
$go = isset($_GET['go']);

if ($id === '' || !isset($sessions[$id])) {
    join_error('Session not found.');
}

$session = $sessions[$id];
$title = (string) $session['title'];
$date = (string) $session['date'];
$duration = max(0, (int) $session['duration']);
$zoomUrl = trim((string) $session['zoom_url']);

if ($zoomUrl === '') {
    join_error('The Zoom link for this session is not configured.');
}

$startTs = strtotime($date);
$now = time();
$windowOpen = $startTs ? $startTs - 15 * 60 : 0;
$windowClose = $startTs ? $startTs + $duration * 60 + 45 * 60 : 0;

if ($startTs && $now < $windowOpen) {
    $minutes = (int) ceil(($windowOpen - $now) / 60);
    join_info(
        $title,
        'Session has not started yet',
        'The join link opens 15 minutes before the session. Come back in about '
            . $minutes . ' minute' . ($minutes === 1 ? '' : 's') . '.'
    );
}

if ($startTs && $now > $windowClose) {
    join_info(
        $title,
        'Session has ended',
        'This session is over. Recordings will be posted after the session.'
    );
}

$goUrl = '/api/join-session.php?id=' . rawurlencode($id) . '&go=1';
$dateLabel = format_session_date($date);

if ($go) {
    header('Location: ' . $zoomUrl, true, 302);
    exit;
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joining: <?= htmlspecialchars($title) ?> - Mojo AI Studio</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; background: #0b1020; color: #f8fafc; }
        main { max-width: 680px; margin: 64px auto; padding: 0 24px; text-align: center; }
        .eyebrow { color: #67e8f9; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
        h1 { font-size: 30px; line-height: 1.2; margin: 14px 0 10px; }
        p { color: #cbd5e1; line-height: 1.6; }
        .date { color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
        a.button { display: inline-block; margin-top: 22px; padding: 13px 18px; color: #06121f; background: #67e8f9; border-radius: 8px; font-weight: 700; text-decoration: none; }
        .learn-links { display: grid; gap: 10px; margin: 34px auto 0; max-width: 420px; }
        .learn-links a { color: #67e8f9; text-decoration: none; border: 1px solid rgba(103,232,249,.32); border-radius: 8px; padding: 11px 14px; }
        .learn-links a:hover { background: rgba(103,232,249,.1); }
    </style>
</head>
<body>
<main>
    <div class="eyebrow">Joining session</div>
    <h1><?= htmlspecialchars($title) ?></h1>
    <?php if ($dateLabel !== ''): ?><div class="date"><?= htmlspecialchars($dateLabel) ?></div><?php endif; ?>
    <p>The verified Zoom room is open. Click the join button when you are ready.</p>
    <a class="button" href="<?= htmlspecialchars($goUrl) ?>" id="join">Join Now</a>
    <?= learning_links_html() ?>
</main>
</body>
</html>
<?php

function join_error(string $message): void {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo $message . PHP_EOL;
    exit;
}

function join_info(string $title, string $heading, string $body): void {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>' . htmlspecialchars($title) . ' - Mojo AI Studio</title>';
    echo '<style>body{margin:0;font-family:Arial,sans-serif;background:#0b1020;color:#f8fafc}main{max-width:680px;margin:64px auto;padding:0 24px;text-align:center}p{color:#cbd5e1;line-height:1.6}.learn-links{display:grid;gap:10px;margin:34px auto 0;max-width:420px}.learn-links a{color:#67e8f9;text-decoration:none;border:1px solid rgba(103,232,249,.32);border-radius:8px;padding:11px 14px}.learn-links a:hover{background:rgba(103,232,249,.1)}</style>';
    echo '</head><body><main><h1>' . htmlspecialchars($heading) . '</h1>';
    echo '<h2>' . htmlspecialchars($title) . '</h2>';
    echo '<p>' . $body . '</p>';
    echo learning_links_html();
    echo '</main></body></html>';
    exit;
}

function learning_links_html(): string {
    return '<nav class="learn-links" aria-label="Learning links">'
        . '<a href="https://mojoaistudio.com/learn">Mojo AI Studio Learning</a>'
        . '<a href="https://aesopacademy.org">Aesop AI Academy</a>'
        . '<a href="https://25experts.com/videos.html">25 AI Experts Video Curation</a>'
        . '</nav>';
}

function format_session_date(string $date): string {
    $ts = strtotime($date);
    if (!$ts) {
        return '';
    }

    $mountain = (new DateTimeImmutable('@' . $ts))->setTimezone(new DateTimeZone('America/Denver'));
    return $mountain->format('l, F j, Y \a\t g:i A T');
}
