<?php
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
	$host = "136.145.116.231";
	$user = 'root';
	$pass = 'Capstone2014';
	$dbn = 'prd';
	$link = mysqli_connect($host, $user, $pass, $dbn);
	$dir = $_REQUEST["dir"];
    if(!is_dir($dir."/")) mkdir($dir."/",0777);    
	$dir = "./".$dir;
    if(isset($_GET['delete']) && $_GET["delete"] == true ){
        $name1 = mysqli_real_escape_string($link,$_POST["filename"]);
        $name = $_POST["filename"];
		$subid = $_POST["subid"];
		//dont do anything
		//mysqli_multi_query( $link,"SELECT max(submissionId) INTO @maxId FROM submissions; UPDATE submissionId SET imageName = NULL, imageData = NULL, imageType = NULL WHERE submissionId = @maxId and imageName = '".$name1."';");
		
        if(file_exists($dir.'/'.$name)){
            unlink($dir.'/'.$name);
            
            echo json_encode(array("res" => true));
        }else{
            echo json_encode(array("res" => false));
        }
    }else{
		if (!empty($_FILES)){
			$file1 = mysqli_real_escape_string($link,$_FILES["file"]["name"]);
			$file = $_FILES["file"]["name"];
			$filetype = mysqli_real_escape_string($link,$_FILES["file"]["type"]);
			$filesize = mysqli_real_escape_string($link,$_FILES["file"]["size"]);
			$imgData = base64_encode(file_get_contents($_FILES["file"]["tmp_name"]));	

			if(isset($_REQUEST["new"]) and $_REQUEST["new"] == 't'){
				$sql = "SELECT max(submissionId) INTO @maxId  FROM submissions;";
				$sql .= " UPDATE submissions SET imageName = '".$file1."', imageData = '".$imgData."', imageType = '".$filetype."' WHERE submissionId =  @maxId;";
			}
			
			if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir."/".$file)){
				mysqli_multi_query($link,$sql);
			}
		}else {
				 
				header('Content-type: text/json');           
				header('Content-type: application/json');
				echo json_encode(array("res" => false, "err" => "NO FILES!"));
			}
	}
	mysqli_close($link);
}
?>