<!DOCTYPE html>
<html>
<body>

<?php
session_start();
$con=mysqli_connect("127.0.0.1","root","123456","prd");
//$con=mysqli_connect("50.62.209.2","proesystems","123pescao","prd");
if (!$con){
print "Database Connection Error.<br>";
}

print "Hi again ".$_SESSION["username"];

if ($_FILES["file"]["error"] > 0) {
  echo "Error: " . $_FILES["file"]["error"] . "<br>";
} else {
  echo "Upload: " . $_FILES["file"]["name"] . "<br>";
  echo "Type: " . $_FILES["file"]["type"] . "<br>";
  echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
  echo "Stored in: " . $_FILES["file"]["tmp_name"];
  
  $imagedata = base64_encode(file_get_contents($_FILES["file"]["tmp_name"]));
  
  $name = $_FILES["file"]["tmp_name"];

  //$sql = "UPDATE company SET logo = '$imagedata' where companyId = 4";
//$sql = "INSERT INTO submissions (userId,companyName,submissionStatus,website,description,phone,imageData) VALUES ('2','Catz',0,'www.catz.com','Grooming and more','2433354538','$imagedata')";
$row_result = mysqli_query($con,$sql);   
$result = $mysqli->query($sql);

if (!$result) {
 printf("UPS%s\n", $mysqli->error);
}

}
print "<br>";

$sql = "SELECT imageData FROM submissions ORDER BY submissionId DESC LIMIT 1";
$row_result = mysqli_query($con,$sql);

if($row = mysqli_fetch_array($row_result)){
	if ($row == NULL){print "No Image Data Received!<br>";} 
$imagedataDB = $row['imageData'];
}

$mime = $_FILES["file"]["type"];
$b64Src = "data:".$mime.";base64," . $imagedataDB;
echo 'IMAGE: <br><img src="'.$b64Src.'" alt="" />';
mysqli_close($con);

?>  

</form>
</body>
</html>
