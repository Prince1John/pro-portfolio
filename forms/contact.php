<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set response header
header('Content-Type: application/json');

// CSRF Token validation
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Security validation failed']);
        exit;
    }
}

// Path to the PHP Email Form library
$php_email_form_path = '../assets/vendor/php-email-form/php-email-form.php';

// Check if the email form library exists
if (!file_exists($php_email_form_path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to load email form library']);
    exit;
}

include($php_email_form_path);

// Recipient email address
$receiving_email_address = "otienojohnprince9@gmail.com";

// Rate limiting
$client_ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = sys_get_temp_dir() . '/email_form_' . md5($client_ip) . '.txt';
$rate_limit_time = 60; // 1 minute between submissions

if (file_exists($rate_limit_file)) {
    $last_submission = file_get_contents($rate_limit_file);
    if (time() - $last_submission < $rate_limit_time) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Please wait before sending another message']);
        exit;
    }
}

// Validate and sanitize inputs
$name = filter_var(trim($_POST['name'] ?? ''), FILTER_SANITIZE_STRING);
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = filter_var(trim($_POST['subject'] ?? ''), FILTER_SANITIZE_STRING);
$message = filter_var(trim($_POST['message'] ?? ''), FILTER_SANITIZE_STRING);
$phone = filter_var(trim($_POST['phone'] ?? ''), FILTER_SANITIZE_STRING);
$company = filter_var(trim($_POST['company'] ?? ''), FILTER_SANITIZE_STRING);

// Validation
$errors = [];

if (!$name || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters';
}

if (!$email) {
    $errors[] = 'Valid email is required';
}

if (!$subject || strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters';
}

if (!$message || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
}

// Optional phone validation
if ($phone && !preg_match('/^[0-9\s\-\+\(\)]+$/', $phone)) {
    $errors[] = 'Invalid phone number format';
}

// Check for spam patterns
$spam_patterns = ['viagra', 'casino', 'lottery', 'prize', 'click here'];
$combined_text = strtolower($name . $subject . $message);
foreach ($spam_patterns as $pattern) {
    if (strpos($combined_text, $pattern) !== false) {
        $errors[] = 'Message contains restricted content';
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    // Create a new PHP_Email_Form instance
    $contact = new PHP_Email_Form;
    $contact->ajax = true;
    
    $contact->to = $receiving_email_address;
    $contact->from_name = $name;
    $contact->from_email = $email;
    $contact->subject = 'New Contact Form Submission: ' . $subject;
    
    // Add message details
    $contact->add_message($name, 'From');
    $contact->add_message($email, 'Email');
    if ($phone) {
        $contact->add_message($phone, 'Phone');
    }
    if ($company) {
        $contact->add_message($company, 'Company');
    }
    $contact->add_message($message, 'Message', 10);
    $contact->add_message('IP Address: ' . $client_ip, 'Sender IP');
    $contact->add_message('Sent at: ' . date('Y-m-d H:i:s'), 'Date & Time');
    
    // Send the email
    $result = $contact->send();
    
    if ($result === true) {
        // Update rate limit
        file_put_contents($rate_limit_file, time());
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully! We\'ll get back to you soon.'
        ]);
    } else {
        throw new Exception($result);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error sending message: ' . $e->getMessage()
    ]);
}
?>