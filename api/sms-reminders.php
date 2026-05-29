<?php
/**
 * Public SMS reminder opt-in endpoint.
 *
 * Accepts opt-ins from Meetup registrants who received a Mojo invite link.
 */

declare(strict_types=1);

require_once __DIR__ . '/sms-reminder-lib.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

smsLoadProjectEnv();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    smsRespond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) {
    smsRespond(400, ['ok' => false, 'message' => 'Expected JSON body.']);
}

$token = trim((string) ($input['token'] ?? ''));
$phone = smsNormalizePhone((string) ($input['phone'] ?? ''));
$consent = (bool) ($input['consent'] ?? false);

if ($token === '' || $phone === '' || !$consent) {
    smsRespond(422, [
        'ok' => false,
        'message' => 'Enter a valid phone number and consent to SMS event reminders.',
    ]);
}

try {
    $store = smsReadStore();
    $invite = smsFindInviteByToken($store, $token);
    if ($invite === null) {
        smsRespond(404, ['ok' => false, 'message' => 'That reminder invite was not found.']);
    }

    $now = gmdate('c');
    $key = (string) $invite['_key'];
    $store['invites'][$key]['status'] = 'opted_in';
    $store['invites'][$key]['optedInAt'] = $now;

    $eventDateText = '';
    if (!empty($invite['eventDateTime'])) {
        try {
            $date = new DateTimeImmutable((string) $invite['eventDateTime']);
            $eventDateText = $date->format('M j, Y g:i A T');
        } catch (Exception $exception) {
            $eventDateText = '';
        }
    }

    $store['subscriptions'][$token] = [
        'token' => $token,
        'eventId' => (string) ($invite['eventId'] ?? ''),
        'eventTitle' => (string) ($invite['eventTitle'] ?? ''),
        'eventDateTime' => (string) ($invite['eventDateTime'] ?? ''),
        'eventDateText' => $eventDateText,
        'eventUrl' => (string) ($invite['eventUrl'] ?? ''),
        'groupName' => (string) ($invite['groupName'] ?? ''),
        'phone' => $phone,
        'phoneLast4' => smsPhoneLast4($phone),
        'purpose' => 'event_sms_reminder_only',
        'consentText' => MOJO_SMS_CONSENT_TEXT,
        'consentedAt' => $now,
        'reminderSentAt' => $store['subscriptions'][$token]['reminderSentAt'] ?? null,
        'unsubscribedAt' => null,
    ];

    smsWriteStore($store);

    smsRespond(200, [
        'ok' => true,
        'message' => 'SMS reminder saved.',
        'phoneLast4' => smsPhoneLast4($phone),
    ]);
} catch (Throwable $throwable) {
    error_log('[sms-reminders] ' . $throwable->getMessage());
    smsRespond(500, ['ok' => false, 'message' => 'Unable to save SMS reminder.']);
}
