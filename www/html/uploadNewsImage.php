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
        $name = $_POST["filename"];
        $name1 = mysqli_real_escape_string($link,$_POST["filename"]);
		$nid = $_POST["nid"];
		
		mysqli_multi_query( $link,"SELECT max(newsId) INTO @maxId  FROM news; UPDATE news SET newsImgName = NULL, newsImage = NULL, newsImgType = NULL WHERE newsId = @maxId and newsImgName = '".$name1."';");
		
        if(file_exists($dir.'/'.$name)){
            unlink($dir.'/'.$name);
            
            echo json_encode(array("res" => true));
        }else{
            echo json_encode(array("res" => false));
        }
    }else{
		$file = $_FILES["file"]["name"];
		$file1 = mysqli_real_escape_string($link,$_FILES["file"]["name"]);
		$filetype = $_FILES["file"]["type"];
		$filesize = $_FILES["file"]["size"];
		$imgData = base64_encode(file_get_contents($_FILES["file"]["tmp_name"]));	

		if(isset($_REQUEST["new"]) and $_REQUEST["new"] == 't'){
			$sql = "SELECT max(newsId) INTO @maxId  FROM news;";
			$sql .= " UPDATE news SET newsImgName = '".$file1."', newsImage = '".$imgData."', newsImgType = '".$filetype."' WHERE newsId =  @maxId;";
		}
		
		if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir."/".$file)){
			mysqli_multi_query($link,$sql);
		}
		
	}
	mysqli_close($link);

}
?>