<?php
$name = $_POST["name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$checkoutData = $_POST["checkoutData"];

ob_start();
include 'mailtpl.php';
$myvar = ob_get_clean();

//print_r($myvar);

require 'phpmailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'test@gmail.com';                 // SMTP username
$mail->Password = 'XXXXXX';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587; 
$mail->SMTPDebug = 2;                                   // TCP port to connect to

$mail->setFrom('encomendas@futureled.pt', 'Future LED');
$mail->addAddress('aleksei.borsenko.dev@gmail.com', 'Recepcionista');     // Add a recipient

$mail->addReplyTo('no-reply@futureled.pt', 'Information');
$mail->addCC('geral@futureled.pt');


$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Uma nova encomenda para '.$email;
$mail->Body    = $myvar;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}