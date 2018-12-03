<?PHP

$host = "136.145.116.231";
$user = 'root';
$pass = 'Capstone2014';
$dbn = 'prd';
$link = mysqli_connect($host, $user, $pass, $dbn);

if( isset($_REQUEST["subid"]) ){
	$subid = $_REQUEST["subid"];
	$sql = "SELECT max(companyId) INTO @maxId  FROM company; ";
	$sql .= "UPDATE company set "
			."logoName = ( SELECT imageName FROM submissions WHERE submissionId = ".$subid."), "
			."logo = (SELECT imageData FROM submissions WHERE submissionId = ".$subid."), "
			."logoType = (SELECT imageType FROM submissions WHERE submissionId = ".$subid." ) "
			."WHERE companyId =  @maxId;";	

	mysqli_multi_query($link,$sql);

echo json_encode(array("res" => true));
}else echo json_encode(array("res" => false));
mysqli_close($link);

?>