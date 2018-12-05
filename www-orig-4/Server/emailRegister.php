
<?php
//My SQL Credentials
$host = "mysql";
$user = 'root';
$pass = 'tiger';
$dbn = 'prd';
	
$con = mysqli_connect($host, $user, $pass, $dbn);

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

//create a new random code

$name = $_GET['name'];
$email = $_GET['remail'];

	
	//send email
	$to = $email;
	$subject = "PR Design Network - New Account Confirmation";
	$body = "Dear " . $name . ":\n\n".  
			"This email was sent automatically by PR Design Network in response to your account registration." .
			" Welcome to PR Design Netowork." .
			" If you did not create this account, please contact the administrators: capstone2018icom@gmail.com". 
			"\n\nThank you, \nPR Design Network Team";
	$additionalheaders = "From: <capstone2018icom@gmail.com>";  //Added prdn2.0 email
	$additionalheaders .= "Reply-To: capstone2018icom@gmail.com";  //added prdn2.0 email
	error_log("Before sending email", 0);
	mail($to, $subject, $body, $additionalheaders);
	error_log("After sending email", 0);




$response = "";
$rows = array();
$arr = array("number" => 1);  //Need to change to make sure it sends the email
$rows[] = $arr;
$response = json_encode($rows);

mysqli_close($con);
 	
//header('Content-Type: application/json');
print '{ "resp" : ' . $response . '}';

?>


