
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
$password = substr(md5(uniqid(rand(),1)),3,10);
$name = $_GET['name'];
$email = $_GET['remail'];
$id = $_GET['id'];
$type = $_GET['rtype'];
//$email = $_POST['remail'];
//$id = 1;

$sql = "Delete FROM recovery where userId = '".$id."' AND userType = '".$type."'; Insert into recovery (email, userId, passcode, userType) VALUES ('". $email ."', '". $id ."', '". $password ."',".$type. ")";

$row_result = mysqli_multi_query($con,$sql);
mysqli_next_result($con);
$num = mysqli_affected_rows($con);

if($num > 0){
	
	//send email
	$to = $email;
	$subject = "PR Design Network Password Reset Details";
	$body = "Dear " . $name . ":\n\n".  
			"This email was sent automatically by PR Design Network in response to your request for reseting your " .
			"password. To proceed with the password reset process, please click the link below".
			" (or copy and paste the URL into your browser). Once in the website, click the login option and select \"Have a passcode?\". " .
			" Then enter this automatically generated passcode: " . $password . " along with your new credentials. " . 
			"\n\n http://www.uprm.edu/creativeindustries/" .    //Added prdn2.0 new url
			" \n\nFor your security this passcode will expire in 24 hours." . 
			"\n\nThank you, \nPR Design Network Team";
	$additionalheaders = "From: <capstone2018icom@gmail.com>";  //Added prdn2.0 email
	$additionalheaders .= "Reply-To: capstone2018icom@gmail.com";  //added prdn2.0 email
	error_log("Before sending email", 0);
	mail($to, $subject, $body, $additionalheaders);
	error_log("After sending email", 0);
}

else{
	die('Data not added to DB! ');
}

$response = "";
$rows = array();
$arr = array("number" => $num);
$rows[] = $arr;
$response = json_encode($rows);

mysqli_close($con);
 	
//header('Content-Type: application/json');
print '{ "resp" : ' . $response . '}';

?>


