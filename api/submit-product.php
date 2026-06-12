<?php
/**
 * submit-product.php — Product marketplace submission intake endpoint.
 *
 * Accepts:  POST /api/submit-product   Content-Type: application/json
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

$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://mojoaistudio.com', 'https://www.mojoaistudio.com'];

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
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid JSON body.']);
    exit;
}

// ── Validate required fields ─────────────────────────────────────────────────
$required = ['productName', 'contactName', 'contactEmail', 'productDescription'];
$missing  = [];

foreach ($required as $field) {
    if (empty(trim($data[$field] ?? ''))) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(422);
    echo json_encode([
        'ok'      => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing),
    ]);
    exit;
}

// ── Sanitize inputs ──────────────────────────────────────────────────────────
function clean(string $value): string {
    return trim(strip_tags(preg_replace('/\s+/', ' ', $value)));
}

$productName        = clean($data['productName'] ?? '');
$contactName        = clean($data['contactName'] ?? '');
$contactEmail       = filter_var(trim($data['contactEmail'] ?? ''), FILTER_VALIDATE_EMAIL);
$productDescription = clean($data['productDescription'] ?? '');
$productUrl         = clean($data['productUrl'] ?? '');
$category           = clean($data['category'] ?? '');
$pricingModel       = clean($data['pricingModel'] ?? '');
$targetUser         = clean($data['targetUser'] ?? '');
$anythingElse       = clean($data['anythingElse'] ?? '');

if ($contactEmail === false) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Validate URL if provided
if ($productUrl !== '' && filter_var($productUrl, FILTER_VALIDATE_URL) === false) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid product URL.']);
    exit;
}

// ── Build the admin email ────────────────────────────────────────────────────
$adminEmail = filter_var(getenv('MOJO_ADMIN_EMAIL') ?: 'admin@mojoaistudio.com', FILTER_VALIDATE_EMAIL);
$fromEmail  = filter_var(getenv('MOJO_FROM_EMAIL') ?: 'admin@mojoaistudio.com', FILTER_VALIDATE_EMAIL);

if ($adminEmail === false) {
    $adminEmail = 'admin@mojoaistudio.com';
}

if ($fromEmail === false) {
    $fromEmail = 'admin@mojoaistudio.com';
}

$subject    = '[Mojo Product] ' . $productName . ' — ' . $contactName;

$body  = "New product submission via MojoAiStudio.com\n";
$body .= str_repeat('─', 56) . "\n\n";
$body .= "Product name:    {$productName}\n";
$body .= "Contact name:    {$contactName}\n";
$body .= "Contact email:   {$contactEmail}\n";
$body .= "Category:        " . ($category ?: '(not specified)') . "\n";
$body .= "Pricing model:   " . ($pricingModel ?: '(not specified)') . "\n";

if ($productUrl !== '') {
    $body .= "Product URL:     {$productUrl}\n";
}

if ($targetUser !== '') {
    $body .= "Target user:     {$targetUser}\n";
}

$body .= "\n";
$body .= "PRODUCT DESCRIPTION\n";
$body .= str_repeat('─', 56) . "\n";
$body .= $productDescription . "\n\n";

if ($anythingElse !== '') {
    $body .= "ANYTHING ELSE\n";
    $body .= str_repeat('─', 56) . "\n";
    $body .= $anythingElse . "\n\n";
}

$body .= str_repeat('─', 56) . "\n";
$body .= "Reply to: {$contactEmail}\n";

$headers  = 'From: Mojo AI Studio <' . $fromEmail . '>' . "\r\n";
$headers .= 'Reply-To: ' . $contactName . ' <' . $contactEmail . '>' . "\r\n";
$headers .= 'X-Mailer: MojoAiStudio-ProductForm/1.0' . "\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// ── Send ─────────────────────────────────────────────────────────────────────
$sent = mail($adminEmail, $subject, $body, $headers, '-f' . $fromEmail);

if (!$sent) {
    error_log('[MojoProduct] mail() returned false for submission from ' . $contactEmail);
    http_response_code(500);
    echo json_encode([
        'ok'      => false,
        'message' => 'Email could not be sent. Please email admin@mojoaistudio.com directly.',
    ]);
    exit;
}

// ── Send auto-reply to submitter ─────────────────────────────────────────────
$replySubject = 'We received your product submission — Mojo AI Studio';
$replyBody    = "Hi {$contactName},\n\n";
$replyBody   .= "Thanks for submitting \"{$productName}\" to the Mojo AI Studio marketplace.\n\n";
$replyBody   .= "Our team will review your product for marketplace fit and respond ";
$replyBody   .= "within five business days.\n\n";
$replyBody   .= "If you have anything to add in the meantime, just reply to this email.\n\n";
$replyBody   .= "— Mojo AI Studio\n";
$replyBody   .= "https://MojoAiStudio.com\n";

$replyHeaders  = 'From: Mojo AI Studio <' . $fromEmail . '>' . "\r\n";
$replyHeaders .= 'Reply-To: ' . $adminEmail . "\r\n";
$replyHeaders .= 'MIME-Version: 1.0' . "\r\n";
$replyHeaders .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

$replySent = mail($contactEmail, $replySubject, $replyBody, $replyHeaders, '-f' . $fromEmail);
if (!$replySent) {
    error_log('[MojoProduct] auto-reply mail() returned false for ' . $contactEmail);
}

// ── Success ───────────────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode(['ok' => true]);
