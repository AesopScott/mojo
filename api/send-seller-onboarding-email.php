<?php
/**
 * send-seller-onboarding-email.php — Sends seller onboarding email with contract link
 *
 * Accepts:  POST /api/send-seller-onboarding-email   Content-Type: application/json
 * Returns:  JSON { "ok": true } | { "ok": false, "message": "..." }
 *
 * Called by product-form.js after seller record creation succeeds
 */

declare(strict_types=1);

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid JSON body.']);
    exit;
}

// Validate required fields
$required = ['email', 'contactName', 'productName', 'sellerToken'];
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

// Sanitize inputs
function clean(string $value): string {
    return trim(strip_tags(preg_replace('/\s+/', ' ', $value)));
}

$email       = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$contactName = clean($data['contactName'] ?? '');
$productName = clean($data['productName'] ?? '');
$sellerToken = clean($data['sellerToken'] ?? '');

if ($email === false) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Build onboarding URL with token and email
$onboardingUrl = 'https://mojoaistudio.com/products/pages/seller-onboarding.html?'
    . 'email=' . urlencode($email)
    . '&token=' . urlencode($sellerToken);

// Build email
$subject = 'Complete Your Seller Setup — Mojo AI Studio';
$fromEmail = 'noreply@mojoaistudio.com';

$body  = "Hi {$contactName},\n\n";
$body .= "Thanks for submitting \"{$productName}\" to the Mojo AI Studio marketplace!\n\n";
$body .= "To complete your seller setup, please sign the seller agreement:\n\n";
$body .= $onboardingUrl . "\n\n";
$body .= "What happens next:\n";
$body .= "1. Review and sign the seller agreement\n";
$body .= "2. Choose a payout method such as PayPal, Zelle, Venmo, Cash App, mailed check, or another option\n";
$body .= "3. Mojo reviews your submitted product assets and connects the approved product to the marketplace checkout\n";
$body .= "4. Buyers purchase through the Mojo marketplace checkout\n\n";
$body .= "If you have any questions, reply to this email or contact us at admin@mojoaistudio.com.\n\n";
$body .= "— Mojo AI Studio Team\n";
$body .= "https://MojoAiStudio.com\n";

$headers  = 'From: Mojo AI Studio <' . $fromEmail . '>' . "\r\n";
$headers .= 'Reply-To: admin@mojoaistudio.com' . "\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// Send email
$sent = mail($email, $subject, $body, $headers, '-f' . $fromEmail);

if (!$sent) {
    error_log('[SellerOnboarding] mail() returned false for ' . $email);
    http_response_code(500);
    echo json_encode([
        'ok'      => false,
        'message' => 'Email could not be sent. Please email admin@mojoaistudio.com directly.',
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['ok' => true]);
