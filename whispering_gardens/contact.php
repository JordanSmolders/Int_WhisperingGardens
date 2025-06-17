<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $firstName = strip_tags(trim($_POST["firstName"] ?? ''));
    $lastName = strip_tags(trim($_POST["lastName"] ?? ''));
    $activityTitle = strip_tags(trim($_POST["activityTitle"] ?? ''));
    $eventType = strip_tags(trim($_POST["eventType"] ?? ''));
    $description = trim($_POST["description"] ?? '');
    $dateRange = strip_tags(trim($_POST["dateRange"] ?? ''));
    $duration = strip_tags(trim($_POST["duration"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $countryCode = strip_tags(trim($_POST["countryCode"] ?? ''));
    $phone = strip_tags(trim($_POST["phone"] ?? ''));

    if (
        empty($firstName) || empty($lastName) || empty($activityTitle) || empty($eventType) ||
        empty($description) || empty($dateRange) || empty($duration) || !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);
        echo "Please fill out the form correctly.";
        exit;
    }

    $to = "skiutedomantas@gmail.com";
    $subject = "New Submission from Multi-Step Form";
    
    $content = "Name: $firstName $lastName\n";
    $content .= "Email: $email\n";
    $content .= "Phone: $countryCode $phone\n\n";
    $content .= "Activity Title: $activityTitle\n";
    $content .= "Event Type: $eventType\n";
    $content .= "Date Range: $dateRange\n";
    $content .= "Duration: $duration\n\n";
    $content .= "Description:\n$description\n";

    $from = "skiutedomantas@gmail.com";
    $headers = "From: Website Form <$from>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    if (mail($to, $subject, $content, $headers)) {
        http_response_code(200);
        echo "Message successfully sent!";
    } else {
        http_response_code(500);
        echo "Something went wrong and the message couldn't be sent.";
    }
} else {
    http_response_code(403);
    echo "Invalid request method.";
}
