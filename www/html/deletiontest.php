<?PHP
//if(isset($_REQUEST['dirinfo']) and !empty($_REQUEST['dirinfo']) and !is_null($_REQUEST['dirinfo']) and $_REQUEST['dirinfo'] != 0){
	$dirinfo = $_REQUEST['dirinfo'];
	// Specify the target directory and add forward slash
	$dirs = array ("./pic", "./img","./upload", "./logo", "./sublogo"); 
	foreach ($dirs as $dir){
		// Open the directory
		if(is_dir($dir.$dirinfo)){
			$sdir = $dir.$dirinfo;
			$dirHandle = opendir($sdir); 
			// Loop over all of the files in the folder
			while ($file = readdir($dirHandle)) { 
				// If $file is NOT a directory remove it
				if(!is_dir($file)) { 
					unlink ("$sdir".'/'."$file"); // unlink() deletes the files
				}
			}
		}
		if(is_dir($sdir)){
		rmdir($sdir);
		}
		//closedir($dirHandle);
	}	
//}
echo json_encode(array("res" => true));
?>