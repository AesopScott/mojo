<?php
/**
 * submit-brief.php — Custom development brief intake endpoint.
 *
 * Accepts:  POST /api/submit-brief   Content-Type: application/json
 * Sends:    Email to ADMIN_EMAIL (default: admin@mojoaistudio.com)
 * Returns:  JSON { "ok": true }  |  { "ok": false, "message": "..." }
 *
 * Override the admin address by setting the MOJO_ADMIN_EMAIL environment
 * variable in cPanel → Software → PHP → Environment Variables, or in
 * .user.ini at the document root.
 */

declare(strict_types=1);

// ── CORS: only allow requests from the same origin ──────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://mojoaistudio.com', 'https://www.mojoaistudio.com'];

// Allow all origins in local dev (file://) or if no origin header
if ($origin === '' || in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// ── Only accept POST ─────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Parse JSON body ──────────────────────────────────────────────────────────
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid JSON body.']);
    exit;
}

// ── Validate required fields ─────────────────────────────────────────────────
$required = ['projectName', 'contactName', 'contactEmail', 'problemDescription'];
$missing = [];

foreach ($required as $field) {
    if (empty(trim($data[$field] ?? ''))) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing),
    ]);
    exit;
}

// ── Sanitize inputs ──────────────────────────────────────────────────────────
function clean(string $value): string {
    // Strip tags, collapse whitespace
    return trim(strip_tags(preg_replace('/\s+/', ' ', $value)));
}

$projectName        = clean($data['projectName'] ?? '');
$contactName        = clean($data['contactName'] ?? '');
$contactEmail       = filter_var(trim($data['contactEmail'] ?? ''), FILTER_VALIDATE_EMAIL);
$problemDescription = clean($data['problemDescription'] ?? '');
$currentTools       = clean($data['currentTools'] ?? '');
$builderPriority    = clean($data['builderPriority'] ?? '');
$interviewCount     = clean($data['interviewCount'] ?? '');
$timeline           = clean($data['timeline'] ?? '');
$budget             = clean($data['budget'] ?? '');
$anythingElse       = clean($data['anythingElse'] ?? '');

if ($contactEmail === false) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid email address.']);
    exit;
}

// ── Build the email ──────────────────────────────────────────────────────────
$adminEmail = filter_var(getenv('MOJO_ADMIN_EMAIL') ?: 'admin@mojoaistudio.com', FILTER_VALIDATE_EMAIL);
$fromEmail  = 'noreply@mojoaistudio.com';

if ($adminEmail === false) {
    $adminEmail = 'admin@mojoaistudio.com';
}

$subject    = '[Mojo Brief] ' . $projectName . ' — ' . $contactName;

$body  = "New project brief submitted via MojoAiStudio.com\n";
$body .= str_repeat('─', 56) . "\n\n";
$body .= "Project name:    {$projectName}\n";
$body .= "Contact name:    {$contactName}\n";
$body .= "Contact email:   {$contactEmail}\n";
$body .= "Timeline:        " . ($timeline ?: '(not specified)') . "\n";
$body .= "Budget:          " . ($budget ?: '(not specified)') . "\n\n";
$body .= "Builder priority: " . ($builderPriority ?: '(not specified)') . "\n";
$body .= "Interview count:  " . ($interviewCount ?: '(not specified)') . "\n\n";
$body .= "PROBLEM DESCRIPTION\n";
$body .= str_repeat('─', 56) . "\n";
$body .= $problemDescription . "\n\n";

if ($currentTools !== '') {
    $body .= "CURRENT TOOLS\n";
    $body .= str_repeat('─', 56) . "\n";
    $body .= $currentTools . "\n\n";
}

if ($anythingElse !== '') {
    $body .= "ANYTHING ELSE\n";
    $body .= str_repeat('─', 56) . "\n";
    $body .= $anythingElse . "\n\n";
}

$body .= str_repeat('─', 56) . "\n";
$body .= "Reply to: {$contactEmail}\n";

// Headers: set Reply-To so replying goes to the submitter
$headers  = 'From: Mojo AI Studio <' . $fromEmail . '>' . "\r\n";
$headers .= 'Reply-To: ' . $contactName . ' <' . $contactEmail . '>' . "\r\n";
$headers .= 'X-Mailer: MojoAiStudio-BriefForm/1.0' . "\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// ── Send ─────────────────────────────────────────────────────────────────────
$sent = mail($adminEmail, $subject, $body, $headers, '-f' . $fromEmail);

if (!$sent) {
    // Log failure server-side without leaking details to client
    error_log('[MojoBrief] mail() returned false for submission from ' . $contactEmail);
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Email could not be sent. Please email admin@mojoaistudio.com directly.',
    ]);
    exit;
}

// ── Send auto-reply to submitter ─────────────────────────────────────────────
$replySubject = 'We received your AI builder intake — Mojo AI Studio';
$replyBody    = "Hi {$contactName},\n\n";
$replyBody   .= "Thanks for submitting an AI builder intake to Mojo AI Studio.\n\n";
$replyBody   .= "We've received your intake for \"{$projectName}\" and will review it ";
$replyBody   .= "for builder matching within two business days.\n\n";
$replyBody   .= "If you have anything to add in the meantime, just reply to this email.\n\n";
$replyBody   .= "— Mojo AI Studio\n";
$replyBody   .= "https://MojoAiStudio.com\n";

$replyHeaders  = 'From: Mojo AI Studio <' . $fromEmail . '>' . "\r\n";
$replyHeaders .= 'Reply-To: ' . $adminEmail . "\r\n";
$replyHeaders .= 'MIME-Version: 1.0' . "\r\n";
$replyHeaders .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// Auto-reply failure is non-fatal — the admin email was already sent
$replySent = mail($contactEmail, $replySubject, $replyBody, $replyHeaders, '-f' . $fromEmail);
if (!$replySent) {
    error_log('[MojoBrief] auto-reply mail() returned false for ' . $contactEmail);
}

// ── Success ───────────────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode(['ok' => true]);
