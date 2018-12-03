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
			
		mysqli_query( $link,"UPDATE news SET newsImgName = NULL, newsImage = NULL, newsImgType = NULL WHERE newsId = '".$nid."';");
        
		if(file_exists($dir.'/'.$name)){
            unlink($dir.'/'.$name);
            echo json_encode(array("res" => true));
        }else{
            echo json_encode(array("res" => false));
        }
    }else{
	
		if (!empty($_FILES)){
				$file = $_FILES["file"]["name"];
				$file1 = mysqli_real_escape_string($link,$_FILES["file"]["name"]);
				$filetype = $_FILES["file"]["type"];
				$filesize = $_FILES["file"]["size"];
				$imgData = base64_encode(file_get_contents($_FILES["file"]["tmp_name"]));	
			
				if(isset($_REQUEST["new"]) and $_REQUEST["new"] == 'f'){
					$nid = $_REQUEST["nid"];
					$sql = "UPDATE news SET newsImgName = '".$file1."', newsImage = '".$imgData."', newsImgType = '".$filetype."' WHERE newsId = '".$nid."';";
				
				}
				
				if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir."/".$file)){
					mysqli_multi_query($link,$sql);	
				}

			}else {
				$nid = $_REQUEST["nid"];
				$sql = "SELECT newsImgName, newsImage FROM news WHERE newsId = '".$nid."';";
				$result = mysqli_query($link,$sql);
				
				while ($row_result = mysqli_fetch_array($result,MYSQLI_ASSOC)){
						$imageName = $row_result['newsImgName'];
						$imgData = base64_decode($row_result['newsImage']);
						$im = imagecreatefromstring($imgData);
						imagejpeg($im, $dir.'/'.$imageName);
						imagedestroy($im);
				}
				$result  = array();
				$files = scandir($dir);              
				if ( false!==$files ) {
					foreach ( $files as $file ) {
						if ( '.'!=$file && '..'!=$file) {      
							$obj['name'] = $file;
							$obj['size'] = filesize($dir."/".$file);
							$result[] = $obj;
						}
					}
				}
				 
				header('Content-type: text/json');            
				header('Content-type: application/json');
				echo json_encode($result);
			}		
	}
	mysqli_close($link);
}
?>