<?php

error_reporting(E_ALL); 
ini_set('display_errors', 1); 
echo "test";
$name = $_POST["name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$nif = $_POST["nif"];
$morada = $_POST["morada"];
$send = $_POST["send"];
$total = $_POST["total"];
$checkoutData = $_POST["checkoutData"];

ob_start();
include 'mailtpl.php';
$myvar = ob_get_clean();

//print_r($myvar);

require_once('phpmailer/class.phpmailer.php');
//include("phpmailer/class.smtp.php");

$mail = new PHPMailer;

$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'futureledencomendas@gmail.com';                 // SMTP username
$mail->Password = 'benfica3';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->CharSet = 'UTF-8';
$mail->Port = 465;                                    // TCP port to connect to                                 

$mail->setFrom('encomendas@futureled.pt', 'Future LED');
$mail->addAddress('encomendas@futureled.pt', 'Recepcionista');     // Add a recipient

$mail->addReplyTo('no-reply@futureled.pt', 'Information');
$mail->addBCC('aleksei.borsenko.dev@gmail.com', 'Developer');


$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Uma nova encomenda para '.$email;
$mail->Body    = $myvar;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
