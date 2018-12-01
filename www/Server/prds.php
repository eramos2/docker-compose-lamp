<?php

//My SQL Credentials
$host = 'mysql';
$user = 'root';
$pass = 'tiger';
$dbn = 'prd';

$endpoint = $_REQUEST['endpoint'];
$code = $_REQUEST['code'];
$con = mysqli_connect($host, $user, $pass, $dbn);

//prdn 2.0  some of rows contain non-utf8 encoded character causing json_encode to fail, next line fixes it
mysqli_set_charset($con, 'utf8');
error_log($endpoint,0);  
error_log($code,0);  
error_log($_REQUEST['du'], 0);
error_log("the requests",0);
$sql = getQuery();

error_log($sql, 0);

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

if(isset($_REQUEST['multi'])){
    $row_result = mysqli_multi_query($con, $sql);
}
else{
    $row_result = mysqli_query($con,$sql);
}

$response = "";
$rows = array();

if(!isset( $_REQUEST['du'] )){
    error_log("Entered if !isset request du", 0);
    while($row = mysqli_fetch_array($row_result, MYSQLI_ASSOC)){
        $rows[] = $row;
    };
    //error_log(print_r($rows,1), 0);
    $response = json_encode($rows);
}
else {
    $num = mysqli_affected_rows($con);
    $arr = array("number" => $num);
    $rows[] = $arr;
    $response = json_encode($rows);
}
mysqli_close($con);

//header('Content-Type: application/json');
print '{ "resp" : ' . $response . '}';


function getQuery(){

global $endpoint;
global $con;
error_log($endpoint, 0);
error_log("The endpoint", 0);
    switch ($endpoint) {
        case 'users':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetUser();
            else
                return requestPostUser();
            break;

        case 'admin':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetAdmin();
            else
                return requestPostAdmin();
            break;

        case 'company':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetCompany();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'material':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetMaterial();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'process':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetProcess();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'service':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetService();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'map':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetMap();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'submissions':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetSubmissions();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        case 'news':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetNews();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        default:
            die("Wrong EndPoint! ");
            break;
    }
};


function requestGetUser(){
	global $con;
    global $code;

    switch ($code) {
        case '0': //get all users //prdn2.0 change active = 0 to active IS NOT NULL to confirm user is active
            $sql = "SELECT userId, email, firstName, lastName, occupation, birthDate, city " .
            "FROM users WHERE active IS NOT NULL";
            break;

        case '1': // Get a particular user //prdn2.0 change active = 0 to active IS NOT NULL to confirm user is active
            $uid = $_GET['uid'];
            $sql = "SELECT userId, email, firstName, lastName, occupation, birthDate, city " .
            "FROM users WHERE userId = '" . $uid ."' AND active IS NOT NULL;";
            break;

        case '2': //delete a particular user  //prdn2.0 changed active = 0 to active = NULL
            $uid = $_GET['uid'];

            $sql = "UPDATE users SET active = NULL WHERE userId ='" . $uid . "';";
            break;

        case '3': //Recover Password Request Passcode //prdn2.0 checks if passcode and email are correct in the recovery table type 0 is for users and type 1 for administrators
            $uemail = mysqli_real_escape_string($con,$_GET['uemail']);
            $passcode = mysqli_real_escape_string($con,$_GET['passcode']);
            $utype = $_GET['utype'];
            if($utype == 0)
                $sql = "SELECT userId, email, firstName, lastName FROM recovery NATURAL JOIN users WHERE email = '". $uemail ."' AND passcode = '". $passcode ."' AND userType = '".$utype."';";
            else
                $sql = "SELECT userId, email, firstName, lastName FROM recovery NATURAL JOIN admin WHERE email = '". $uemail ."' AND passcode = '". $passcode ."' AND userType = '".$utype."';";
            break;

        case '4': //Verify user email
            $uemail = mysqli_real_escape_string($con,$_GET['uemail']);
            $sql = "SELECT userId, email, firstName, lastName, occupation, birthDate, city FROM users WHERE email = '". $uemail . "' ";
            break;

        case '5':
            $uid = $_GET['uid'];
            $uemail = mysqli_real_escape_string($con,$_GET['uemail']);
            $sql = "SELECT userId, email, firstName, lastName, occupation, birthDate, city FROM users WHERE userId = '".$uid."' AND email = '".$uemail."' ;";
            break;

        default:
            break;
    }

    return $sql;
};


function requestPostUser(){
    global $code;
	global $con;
    switch ($code) {

        case '0': //verify users credentials
            $uemail = mysqli_real_escape_string($con,$_POST['uemail']);
            $upass = mysqli_real_escape_string($con,$_POST['upass']);
            error_log($uemail . " " . $upass, 0);
            //Change active = 0 to active IS NOT NULL to confirm user is active
            $sql = "SELECT userId, email, firstName, lastName, occupation, birthDate, city " .
            " FROM users WHERE ( email = '" . $uemail . "' AND userPassword = SHA2(CONCAT('" .
                $upass . "','" . $uemail . "'),512) ) AND active IS NOT NULL;";
            break;

        case '1': //add a new user
            $uemail = mysqli_real_escape_string($con,$_POST['uemail']);
            $uname = mysqli_real_escape_string($con,$_POST['uname']);
            $ulname = mysqli_real_escape_string($con,$_POST['ulname']);
            $upass = mysqli_real_escape_string($con,$_POST['upass']);
            $uoccu = mysqli_real_escape_string($con,$_POST['uoccu']);
            $ubdate = mysqli_real_escape_string($con,$_POST['ubdate']);
            $ucity = mysqli_real_escape_string($con,$_POST['ucity']);
            //removed column active and value = 0 because database was giving error
            //When performing this request prdn2.0 comment/change
            $sql = "INSERT INTO users (email, userPassword, firstName, lastName, " .
                "occupation, birthDate, city) VALUES ('" . $uemail ."', SHA2(CONCAT('" . $upass .
                    "','" . $uemail . "'),512),'"  . $uname . "','"  . $ulname . "','" .
                $uoccu . "','". $ubdate . "','" . $ucity . "');";
            break;


        case '2': //update user information
            $uname = mysqli_real_escape_string($con,$_POST['uname']);
            $ulname = mysqli_real_escape_string($con,$_POST['ulname']);
            $uoccu = mysqli_real_escape_string($con,$_POST['uoccu']);
            $ucity = mysqli_real_escape_string($con,$_POST['ucity']);
            $uid = $_POST['uid'];


                 $sql = "UPDATE users SET firstName = '" .
                $uname . "', lastName = '" . $ulname . "', occupation = '" . $uoccu .
                "', city= '" . $ucity . "' WHERE userId='" . $uid ."';";

            break;

        case '3': //Change User Password //prdn2.0 with passcode
            $uemail = mysqli_real_escape_string($con,$_POST['uemail']);
            $upass = mysqli_real_escape_string($con,$_POST['upass']);
            $uid = $_POST['uid'];
            $type = $_POST['type'];
            $sql = "UPDATE users SET userPassword = SHA2(CONCAT('". $upass ."', '". $uemail . "'), 512) ".
            "WHERE userId = '". $uid ."' AND email = '". $uemail ."'; DELETE FROM recovery WHERE email = '".
            $uemail."' AND userType = '".$type."' ; ";
            break;

        case '4': //Update user password
            $uemail = mysqli_real_escape_string($con,$_POST['uemail']);
            $upass = mysqli_real_escape_string($con,$_POST['upass']);
            $uid = $_POST['uid'];
            $sql = "UPDATE users SET userPassword = SHA2(CONCAT('". $upass ."', '". $uemail . "'), 512) ".
            "WHERE userId = '". $uid ."' ;";
            break;

        default:
            break;
    }

    return $sql;

};

function requestGetAdmin(){
    global $code;
	global $con;
    switch ($code) {
        case '0': //get all admins //prdn2.0 change active = 0 to active IS NOT NULL to confirm admin is active
            $sql = "SELECT adminId, adminTypeName, email, firstName, lastName, occupation, birthDate, ".
                "city FROM admin NATURAL JOIN adminType WHERE active IS NOT NULL;";
            break;

        case '1': // Get a particular admin
            $aid = $_GET['aid'];
            $sql = "SELECT adminId, adminTypeName, email, firstName, lastName, occupation, birthDate, city ".
                    "FROM admin NATURAL JOIN adminType WHERE adminId = '". $aid ."' AND active IS NOT NULL;";
            break;

        case '2': // Delete a particular admin
            $aid = $_GET['aid'];
            $sql = "UPDATE admin SET active = NULL WHERE adminId ='".$aid."';";
            break;

        case '3': //look for admin by name
            $name = mysqli_real_escape_string($con,$_GET['name']);
            $sql = "SELECT adminId, email, firstName, lastName, occupation, birthDate, city FROM admin WHERE (firstName " .
                " LIKE '%" . $name . "%' OR lastName LIKE '%" . $name . "%') AND active IS NOT NULL;";
            break;

        case '4': //Verify admin email
            $aemail = mysqli_real_escape_string($con,$_GET['aemail']);
            $sql = "SELECT adminId, adminTypeName, email, firstName, lastName, occupation, birthDate, city FROM admin NATURAL JOIN adminType WHERE email = '". $aemail . "' AND active IS NOT NULL";
            break;

        case '5':
            $aid = $_GET['aid'];
            $aemail = mysqli_real_escape_string($con,$_GET['aemail']);
            $sql = "SELECT adminId, adminTypeName, email, firstName, lastName, occupation, birthDate, city FROM admin NATURAL JOIN adminType WHERE adminId = '".$aid."' AND email = '".$aemail."' ;";
            break;

        default:
            break;
    }

    return $sql;
}


function requestPostAdmin(){
	global $con;
    global $code;

    switch ($code) {

        case '0': //add a new admin// when doing call set key/value pair - du: true, returns resp 1 if insert success -1 otherwise
            $aemail = mysqli_real_escape_string($con,$_POST['aemail']);
            $tp = mysqli_real_escape_string($con,$_POST['tp']);
            $aname = mysqli_real_escape_string($con,$_POST['aname']);
            $apass = mysqli_real_escape_string($con,$_POST['apass']);
            $alname = mysqli_real_escape_string($con,$_POST['alname']);
            $aoccu = mysqli_real_escape_string($con,$_POST['aoccu']);
            $abdate = mysqli_real_escape_string($con,$_POST['abdate']);
            $acity = mysqli_real_escape_string($con,$_POST['acity']);
            //removed column active and value = 0 because database was giving error
            //When performing this request prdn2.0 comment/change
            $sql = "INSERT INTO admin (adminTypeId, email, adminPassword, firstName, lastName, occupation," .
            " birthDate, city) VALUES ( '" . $tp ."', '" . $aemail . "', SHA2(CONCAT('" . $apass . "','" .
                $aemail. "'),512), '" . $aname . "','" . $alname . "','" .$aoccu. "', '" . $abdate . "','" .
            $acity . "');";
            break;

        case '1': // Test admin credential
            $aemail = mysqli_real_escape_string($con,$_POST['aemail']);
            $apass = mysqli_real_escape_string($con,$_POST['apass']);
            //Change active = 0 to active IS NOT NULL to confirm user is active
            $sql = "SELECT adminId, adminTypeName, email, firstName, lastName, occupation, birthDate, city " .
                    "FROM admin NATURAL JOIN adminType WHERE email = '". $aemail . "' AND adminPassword = SHA2(CONCAT('".$apass. "','"
                    . $aemail . "'),512) and active IS NOT NULL;";
            break;

        case '2': //Update admin information


            $aname = mysqli_real_escape_string($con,$_POST['aname']);
            $alname = mysqli_real_escape_string($con,$_POST['alname']);
            $aoccu = mysqli_real_escape_string($con,$_POST['aoccu']);
            $acity = mysqli_real_escape_string($con,$_POST['acity']);
            $aid = $_POST['aid'];


                $sql = "UPDATE admin SET firstName = '". $aname . "', " .
                "lastName = '" . $alname ."', occupation = '". $aoccu . "' , city= '". $acity .
                "' WHERE adminId='". $aid . "';";

            break;

        case '3': //Change Admin Password //prdn2.0 after using passcode, removes entry from recovery table
            $aemail = mysqli_real_escape_string($con,$_POST['aemail']);
            $apass = mysqli_real_escape_string($con,$_POST['apass']);
            $aid = $_POST['aid'];
            $type = $_POST['type'];
            $sql = "UPDATE admin SET adminPassword = SHA2(CONCAT('". $apass ."', '". $aemail . "'), 512) WHERE adminId = '". $aid ."' AND email = '". $aemail ."'; DELETE FROM recovery WHERE email = '".$aemail."' AND userType = '".$type."';";

            break;

        case '4': //Change Admin Password
            $aemail = mysqli_real_escape_string($con,$_POST['aemail']);
            $apass = mysqli_real_escape_string($con,$_POST['apass']);
            $aid = $_POST['aid'];
            $sql = "UPDATE admin SET adminPassword = SHA2(CONCAT('". $apass ."', '". $aemail . "'), 512) WHERE adminId = '". $aid ."' ;";

            break;

        default:
            break;
    }

    return $sql;

};

function requestGetCompany(){
	global $con;
    global $code;

    switch ($code) {
        case '0': // get all companies
            $sql = "SELECT companyId, companyName, description, city, latitude, logo, logoType, longitude FROM company NATURAL JOIN address WHERE active IS NOT NULL ORDER BY companyName;";
            break;

        case '1': //view all business in a city
            $theCity = mysqli_real_escape_string($con,$_GET['theCity']);
            $sql = "SELECT * FROM company NATURAL JOIN address WHERE address.city = '". $theCity ."' AND active IS NOT NULL;";
            break;

        case '2': //View all subservices of a business //prdn2.0 added serviceName, subcatImage - to help with routing on webapp
            $cid = $_GET['cid'];
            $sql = "SELECT serviceId, serviceName, subServiceId, subServiceName, subcatImage, model, limitation, application FROM (company NATURAL JOIN CAS NATURAL JOIN " .
                    "subService) NATURAL JOIN serviceType WHERE companyId = '" . $cid . "' AND active IS NOT NULL;";
            break;

        case '3': //View all subprocesss of a business //prdn2.0 added processName, subcatImage - to help with routing on webapp
            $cid = $_GET['cid'];
            $sql = "SELECT processId, processName, subProcessId, subProcessName, subcatImage, model, limitation, application FROM (company NATURAL JOIN CAP NATURAL JOIN " .
                    " subProcess) NATURAL JOIN processType WHERE companyId = '" . $cid . "' AND active IS NOT NULL;";
            break;

        case '4': //View all submaterials of a business //prdn2.0 added material Name, subcatImage - to help with routing on webapp
            $cid = $_GET['cid'];
            $sql = "SELECT materialId, materialName, subMaterialId, subMaterialName, subcatImage, model, limitation, application FROM (company NATURAL JOIN CAM NATURAL JOIN ".
                    " subMaterial) NATURAL JOIN materialType WHERE companyId = '" . $cid . "' AND active IS NOT NULL;";
            break;

        case '5': // look for a company by name
            $keyword = mysqli_real_escape_string($con,$_GET['keyword']);
            $sql = "SELECT companyId, companyName, description, city FROM company NATURAL JOIN address WHERE companyName LIKE '%" . $keyword . "%' AND active IS NOT NULL ORDER BY companyName;";
            break;

        case '6': // delete a particular business in the system
            $cid = $_GET['cid'];
            $sql = "UPDATE company SET active = NULL WHERE companyId ='" . $cid . "';";
            break;

        case '7': //View a business profile
            $cid = $_GET['cid'];
            $sql = "SELECT company.companyId AS companyId, adminId, companyName, videoURL, website, phone, description, "
                    ."logo, logoType, email, addressId, line, city, country,"
                    ." zipcode, latitude, longitude, imageId, imageData, imageName, imageType FROM company NATURAL JOIN "
                    ." address LEFT OUTER JOIN images ".
                    "ON ( company.companyId = images.companyId ) WHERE company.companyId = '".$cid."' AND active IS NOT NULL;";
					
				
            break;

        case '8': // Add new company info Need to test
                    $aid = $_GET['aid'];
                    $name = mysqli_real_escape_string($con,$_GET['name']);
                    $URL = mysqli_real_escape_string($con,$_GET['URL']);
                    $site = mysqli_real_escape_string($con,$_GET['site']);
                    $phone = mysqli_real_escape_string($con,$_GET['phone']);
                    $descr = mysqli_real_escape_string($con,$_GET['descr']);
                    //////////////////////////////////////////////////////////////////////////////////$img = $_GET['img'];
                    $email = mysqli_real_escape_string($con,$_GET['cemail']);
                    $line = mysqli_real_escape_string($con,$_GET['line']);
                    $city = mysqli_real_escape_string($con,$_GET['city']);
                    $count = mysqli_real_escape_string($con,$_GET['count']);
                    $zip = mysqli_real_escape_string($con,$_GET['zip']);
                    $lat = mysqli_real_escape_string($con,$_GET['lat']);
                    $lon = mysqli_real_escape_string($con,$_GET['lon']);

                    if(isset($_GET['spids']))
                        $spids = $_GET['spids'];
                    else
                        $spids = array();

                    if(isset($_GET['ssids']))
                        $ssids = $_GET['ssids'];
                    else
                        $ssids = array();

                    if(isset($_GET['smids']))
                        $smids = $_GET['smids'];
                    else
                        $smids = array();

                    $sql = "INSERT INTO company (adminId, companyName, videoURL, website, phone, description, email)".    //prdn2.0 remove active column as it is now set automatically to current date
                            " VALUES ('".$aid."','".$name."','".$URL."','".$site."','".$phone."','".$descr."','".$email."'); ";  //prdn2.0 remove active value as it is now set automatically to current date

                    $sql .= "SET @maxId := (select max(companyId) from company);";

                    $sql .= "INSERT INTO address (companyId, line, city, country, zipcode, latitude, longitude) VALUES (@maxId,'".$line."','".$city."','".$count."','".$zip."','".$lat."','".$lon."' );";

                    //Array of arrays (subarrays are each subcategory)prdn2.0 [arrayindex - value], 0- subcategory name, 1 -subcategory id, 2- categoryid ,3- model, 4 -application, 5 -limitation
                    if  (count($spids) >= 1){
                        $sql = $sql."INSERT INTO CAP(companyId, subProcessId, model, application, limitation) VALUES ";
                        if (count($spids) > 1){
                            for ($x = 0; $x < count($spids); $x++) {
                                if ($x < count($spids)-1){

        							if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."','".$spids[$x][5]."'), ";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL,'".$spids[$x][4]."','".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."', NULL,'".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."', NULL), ";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL, NULL,'".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."', NULL, NULL), ";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL,'".$spids[$x][4]."', NULL), ";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL, NULL, NULL), ";
        							}

        						}elseif($x == (count($spids) - 1)){

        							if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."','".$spids[$x][5]."');";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL,'".$spids[$x][4]."','".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."', NULL,'".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."', NULL);";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL, NULL,'".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."','".$spids[$x][3]."', NULL, NULL);";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL,'".$spids[$x][4]."', NULL);";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$spids[$x][1]."', NULL,NULL, NULL);";
        							}
        						}
                            }
                        }elseif(count($spids) == 1){
                            //$sql = $sql."(@maxId,'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."','".$spids[0][5]."');";
        					if( !empty($spids[0][3]) and !empty($spids[0][4]) and !empty($spids[0][5]) ){// !a!b!c
        						$sql = $sql."(@maxId,'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."','".$spids[0][5]."');";

        					}else if( empty($spids[0][3]) and !empty($spids[0][4]) and !empty($spids[0][5]) ){// a !b !c
        						$sql = $sql."(@maxId,'".$spids[0][1]."', NULL,'".$spids[0][4]."','".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and empty($spids[0][4]) and !empty($spids[0][5]) ){// !a b !c
        						$sql = $sql."(@maxId,'".$spids[0][1]."','".$spids[0][3]."', NULL,'".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and !empty($spids[0][4]) and empty($spids[0][5]) ){// !a !b c
        						$sql = $sql."(@maxId,'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."', NULL);";

        					}else if( empty($spids[0][3]) and empty($spids[0][4]) and !empty($spids[0][5]) ){// a b !c
        						$sql = $sql."(@maxId,'".$spids[0][1]."', NULL, NULL,'".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and empty($spids[0][4]) and empty($spids[0][5]) ){// !a b c
        						$sql = $sql."(@maxId,'".$spids[0][1]."','".$spids[0][3]."', NULL, NULL);";

        					}else if( empty($spids[0][3]) and !empty($spids[0][4]) and empty($spids[0][5]) ){// a !b c
        						$sql = $sql."(@maxId,'".$spids[0][1]."', NULL,'".$spids[0][4]."', NULL);";

        					}else if( empty($spids[0][3]) and empty($spids[0][4]) and empty($spids[0][5]) ){// a b c
        						$sql = $sql."(@maxId,'".$spids[0][1]."', NULL, NULL, NULL);";
        					}
        				}
                    }



                    if  (count($smids) >= 1){
                        $sql = $sql."INSERT INTO CAM(companyId, subMaterialId, model, application, limitation) VALUES ";
                        if (count($smids) > 1){
                            for ($x = 0; $x < count($smids); $x++) {
                                if ($x < count($smids)-1){
                                    //$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."'),";
        							if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."'),";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL,'".$smids[$x][4]."','".$smids[$x][5]."'),";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."', NULL,'".$smids[$x][5]."'),";

        							}else if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."', NULL),";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL, NULL,'".$smids[$x][5]."'),";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."', NULL, NULL),";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL,'".$smids[$x][4]."', NULL),";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL, NULL, NULL),";
        							}


        						}elseif($x == (count($smids) - 1)){
                                    //$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."');";
        							if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."');";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL,'".$smids[$x][4]."','".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."', NULL,'".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."', NULL);";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL, NULL,'".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."','".$smids[$x][3]."', NULL, NULL);";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL,'".$smids[$x][4]."', NULL);";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$smids[$x][1]."', NULL, NULL, NULL);";
        							}

        						}
                            }
                        }elseif(count($smids) == 1){
                            //$sql = $sql."(@maxId,'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."','".$smids[0][5]."');";
        					if( !empty($smids[0][3]) and !empty($smids[0][4]) and !empty($smids[0][5]) ){// !a!b!c
        						$sql = $sql."(@maxId,'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."','".$smids[0][5]."');";

        					}else if( empty($smids[0][3]) and !empty($smids[0][4]) and !empty($smids[0][5]) ){// a !b !c
        						$sql = $sql."(@maxId,'".$smids[0][1]."', NULL,'".$smids[0][4]."','".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and empty($smids[0][4]) and !empty($smids[0][5]) ){// !a b !c
        						$sql = $sql."(@maxId,'".$smids[0][1]."','".$smids[0][3]."', NULL,'".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and !empty($smids[0][4]) and empty($smids[0][5]) ){// !a !b c
        						$sql = $sql."(@maxId,'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."', NULL);";

        					}else if( empty($smids[0][3]) and empty($smids[0][4]) and !empty($smids[0][5]) ){// a b !c
        						$sql = $sql."(@maxId,'".$smids[0][1]."', NULL, NULL,'".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and empty($smids[0][4]) and empty($smids[0][5]) ){// !a b c
        						$sql = $sql."(@maxId,'".$smids[0][1]."','".$smids[0][3]."', NULL, NULL);";

        					}else if( empty($smids[0][3]) and !empty($smids[0][4]) and empty($smids[0][5]) ){// a !b c
        						$sql = $sql."(@maxId,'".$smids[0][1]."', NULL,'".$smids[0][4]."', NULL);";

        					}else if( empty($smids[0][3]) and empty($smids[0][4]) and empty($smids[0][5]) ){// a b c
        						$sql = $sql."(@maxId,'".$smids[0][1]."', NULL, NULL, NULL);";
        					}

        				}
                    }

                    if  (count($ssids) >= 1){
                        $sql = $sql."INSERT INTO CAS(companyId, subServiceId, model, application, limitation) VALUES ";
                        if (count($ssids) > 1){
                            for ($x = 0; $x < count($ssids); $x++) {
                                if ($x < count($ssids)-1){
                                    //$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."'),";
        							if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."'),";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."','".$ssids[$x][5]."'),";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL,'".$ssids[$x][5]."'),";

        							}else if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."', NULL),";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL, NULL,'".$ssids[$x][5]."'),";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL, NULL),";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."', NULL),";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL, NULL, NULL),";
        							}

        						}elseif($x == (count($ssids) - 1)){
                                    //$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."');";
        							if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a!b!c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."');";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a !b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."','".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL,'".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a !b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."', NULL);";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a b !c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL, NULL,'".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL, NULL);";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a !b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."', NULL);";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a b c
        								$sql = $sql."(@maxId,'".$ssids[$x][1]."', NULL, NULL, NULL);";
        							}
        						}
                            }
                        }elseif(count($ssids) == 1){
                            //$sql = $sql."(@maxId,'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."','".$ssids[0][5]."');";
        					if( !empty($ssids[0][3]) and !empty($ssids[0][4]) and !empty($ssids[0][5]) ){// !a!b!c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."','".$ssids[0][5]."');";

        					}else if( empty($ssids[0][3]) and !empty($ssids[0][4]) and !empty($ssids[0][5]) ){// a !b !c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."', NULL,'".$ssids[0][4]."','".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and empty($ssids[0][4]) and !empty($ssids[0][5]) ){// !a b !c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."','".$ssids[0][3]."', NULL,'".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and !empty($ssids[0][4]) and empty($ssids[0][5]) ){// !a !b c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."', NULL);";

        					}else if( empty($ssids[0][3]) and empty($ssids[0][4]) and !empty($ssids[0][5]) ){// a b !c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."', NULL, NULL,'".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and empty($ssids[0][4]) and empty($ssids[0][5]) ){// !a b c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."','".$ssids[0][3]."', NULL, NULL);";

        					}else if( empty($ssids[0][3]) and !empty($ssids[0][4]) and empty($ssids[0][5]) ){// a !b c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."', NULL,'".$ssids[0][4]."', NULL);";

        					}else if( empty($ssids[0][3]) and empty($ssids[0][4]) and empty($ssids[0][5]) ){// a b c
        						$sql = $sql."(@maxId,'".$ssids[0][1]."', NULL, NULL, NULL);";
        					}
        				}
                    }
                    break;


                case '9': // Modify company info Need to test
                    $cid = $_GET['cid'];
                    $name = mysqli_real_escape_string($con,$_GET['name']);
                    $URL = mysqli_real_escape_string($con,$_GET['URL']);
                    $site = mysqli_real_escape_string($con,$_GET['site']);
                    $phone = mysqli_real_escape_string($con,$_GET['phone']);
                    $descr = mysqli_real_escape_string($con,$_GET['descr']);
                    //////////////////////////////////////////////////////////////////////////$img = $_GET['img'];
                    $email = mysqli_real_escape_string($con,$_GET['cemail']);
                    $line = mysqli_real_escape_string($con,$_GET['line']);
                    $city = mysqli_real_escape_string($con,$_GET['city']);
                    $count = mysqli_real_escape_string($con,$_GET['count']);
                    $zip = mysqli_real_escape_string($con,$_GET['zip']);
                    $lat = mysqli_real_escape_string($con,$_GET['lat']);
                    $lon = mysqli_real_escape_string($con,$_GET['lon']);


                    if(isset($_GET['spids']))
                        $spids = $_GET['spids'];
                    else
                        $spids = array();

                    if(isset($_GET['ssids']))
                        $ssids = $_GET['ssids'];
                    else
                        $ssids = array();

                    if(isset($_GET['smids']))
                        $smids = $_GET['smids'];
                    else
                        $smids = array();
                    if(isset($_GET['smids']))
                        $tids = $_GET['tids'];
                    else
                        $tids = array();

                    $sql = "UPDATE company SET companyName = '"
                            .$name."', videoURL = '"
                            .$URL."', website = '"
                            .$site."', phone = '"
                            .$phone."', description = '"
                            .$descr."', email = '"
                            .$email."' WHERE companyId = '".$cid."';";
                    $sql = $sql." UPDATE address SET line = '"
                            .$line."', city = '"
                            .$city."', country = '"
                            .$count."', zipcode = '"
                            .$zip."', latitude = '"
                            .$lat."', longitude = '"
                            .$lon."' WHERE companyId = '".$cid."';";

                    $sql = $sql."DELETE FROM CAP WHERE companyId = '".$cid."';";
                    $sql = $sql."DELETE FROM CAS WHERE companyId = '".$cid."';";
                    $sql = $sql."DELETE FROM CAM WHERE companyId = '".$cid."';";
                    $sql = $sql."DELETE FROM CAT WHERE companyId = '".$cid."';";
                    
                    if  (count($spids) >= 1){
                        $sql = $sql."INSERT INTO CAP(companyId, subProcessId, model, application, limitation) VALUES ";
                        if (count($spids) > 1){
                            for ($x = 0; $x < count($spids); $x++) {
                                if ($x < count($spids)-1){

        							if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."','".$spids[$x][5]."'), ";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL,'".$spids[$x][4]."','".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."', NULL,'".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."', NULL), ";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL, NULL,'".$spids[$x][5]."'), ";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."', NULL, NULL), ";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL,'".$spids[$x][4]."', NULL), ";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL, NULL, NULL), ";
        							}



        						}elseif($x == (count($spids) - 1)){

        							if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."','".$spids[$x][5]."');";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL,'".$spids[$x][4]."','".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."', NULL,'".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."','".$spids[$x][4]."', NULL);";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and !empty($spids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL, NULL,'".$spids[$x][5]."');";

        							}else if( !empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."','".$spids[$x][3]."', NULL, NULL);";

        							}else if( empty($spids[$x][3]) and !empty($spids[$x][4]) and empty($spids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL,'".$spids[$x][4]."', NULL);";

        							}else if( empty($spids[$x][3]) and empty($spids[$x][4]) and empty($spids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$spids[$x][1]."', NULL,NULL, NULL);";
        							}
        						}
                            }
                        }elseif(count($spids) == 1){
                            //$sql = $sql."(".$cid.",'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."','".$spids[0][5]."');";
        					if( !empty($spids[0][3]) and !empty($spids[0][4]) and !empty($spids[0][5]) ){// !a!b!c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."','".$spids[0][5]."');";

        					}else if( empty($spids[0][3]) and !empty($spids[0][4]) and !empty($spids[0][5]) ){// a !b !c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."', NULL,'".$spids[0][4]."','".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and empty($spids[0][4]) and !empty($spids[0][5]) ){// !a b !c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."','".$spids[0][3]."', NULL,'".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and !empty($spids[0][4]) and empty($spids[0][5]) ){// !a !b c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."','".$spids[0][3]."','".$spids[0][4]."', NULL);";

        					}else if( empty($spids[0][3]) and empty($spids[0][4]) and !empty($spids[0][5]) ){// a b !c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."', NULL, NULL,'".$spids[0][5]."');";

        					}else if( !empty($spids[0][3]) and empty($spids[0][4]) and empty($spids[0][5]) ){// !a b c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."','".$spids[0][3]."', NULL, NULL);";

        					}else if( empty($spids[0][3]) and !empty($spids[0][4]) and empty($spids[0][5]) ){// a !b c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."', NULL,'".$spids[0][4]."', NULL);";

        					}else if( empty($spids[0][3]) and empty($spids[0][4]) and empty($spids[0][5]) ){// a b c
        						$sql = $sql."(".$cid.",'".$spids[0][1]."', NULL, NULL, NULL);";
        					}
        				}
                    }



                    if  (count($smids) >= 1){
                        $sql = $sql."INSERT INTO CAM(companyId, subMaterialId, model, application, limitation) VALUES ";
                        if (count($smids) > 1){
                            for ($x = 0; $x < count($smids); $x++) {
                                if ($x < count($smids)-1){
                                    //$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."'),";
        							if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."'), ";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL,'".$smids[$x][4]."','".$smids[$x][5]."'), ";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."', NULL,'".$smids[$x][5]."'), ";

        							}else if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."', NULL), ";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL, NULL,'".$smids[$x][5]."'), ";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."', NULL, NULL), ";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL,'".$smids[$x][4]."', NULL), ";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL, NULL, NULL), ";
        							}


        						}elseif($x == (count($smids) - 1)){
                                    //$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."');";
        							if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."','".$smids[$x][5]."');";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL,'".$smids[$x][4]."','".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."', NULL,'".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."','".$smids[$x][4]."', NULL);";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and !empty($smids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL, NULL,'".$smids[$x][5]."');";

        							}else if( !empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."','".$smids[$x][3]."', NULL, NULL);";

        							}else if( empty($smids[$x][3]) and !empty($smids[$x][4]) and empty($smids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL,'".$smids[$x][4]."', NULL);";

        							}else if( empty($smids[$x][3]) and empty($smids[$x][4]) and empty($smids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$smids[$x][1]."', NULL, NULL, NULL);";
        							}

        						}
                            }
                        }elseif(count($smids) == 1){
                            //$sql = $sql."(".$cid.",'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."','".$smids[0][5]."');";
        					if( !empty($smids[0][3]) and !empty($smids[0][4]) and !empty($smids[0][5]) ){// !a!b!c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."','".$smids[0][5]."');";

        					}else if( empty($smids[0][3]) and !empty($smids[0][4]) and !empty($smids[0][5]) ){// a !b !c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."', NULL,'".$smids[0][4]."','".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and empty($smids[0][4]) and !empty($smids[0][5]) ){// !a b !c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."','".$smids[0][3]."', NULL,'".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and !empty($smids[0][4]) and empty($smids[0][5]) ){// !a !b c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."','".$smids[0][3]."','".$smids[0][4]."', NULL);";

        					}else if( empty($smids[0][3]) and empty($smids[0][4]) and !empty($smids[0][5]) ){// a b !c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."', NULL, NULL,'".$smids[0][5]."');";

        					}else if( !empty($smids[0][3]) and empty($smids[0][4]) and empty($smids[0][5]) ){// !a b c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."','".$smids[0][3]."', NULL, NULL);";

        					}else if( empty($smids[0][3]) and !empty($smids[0][4]) and empty($smids[0][5]) ){// a !b c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."', NULL,'".$smids[0][4]."', NULL);";

        					}else if( empty($smids[0][3]) and empty($smids[0][4]) and empty($smids[0][5]) ){// a b c
        						$sql = $sql."(".$cid.",'".$smids[0][1]."', NULL, NULL, NULL);";
        					}

        				}
                    }

                    if  (count($ssids) >= 1){
                        $sql = $sql."INSERT INTO CAS(companyId, subServiceId, model, application, limitation) VALUES ";
                        if (count($ssids) > 1){
                            for ($x = 0; $x < count($ssids); $x++) {
                                if ($x < count($ssids)-1){
                                    //$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."'),";
        							if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."'), ";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."','".$ssids[$x][5]."'), ";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL,'".$ssids[$x][5]."'), ";

        							}else if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."', NULL), ";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL, NULL,'".$ssids[$x][5]."'), ";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL, NULL), ";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."', NULL), ";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL, NULL, NULL), ";
        							}

        						}elseif($x == (count($ssids) - 1)){
                                    //$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."');";
        							if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a!b!c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."','".$ssids[$x][5]."');";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a !b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."','".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// !a b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL,'".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a !b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."','".$ssids[$x][4]."', NULL);";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and !empty($ssids[$x][5]) ){// a b !c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL, NULL,'".$ssids[$x][5]."');";

        							}else if( !empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// !a b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."','".$ssids[$x][3]."', NULL, NULL);";

        							}else if( empty($ssids[$x][3]) and !empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a !b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL,'".$ssids[$x][4]."', NULL);";

        							}else if( empty($ssids[$x][3]) and empty($ssids[$x][4]) and empty($ssids[$x][5]) ){// a b c
        								$sql = $sql."(".$cid.",'".$ssids[$x][1]."', NULL, NULL, NULL);";
        							}
        						}
                            }
                        }elseif(count($ssids) == 1){
                            //$sql = $sql."(".$cid.",'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."','".$ssids[0][5]."');";
        					if( !empty($ssids[0][3]) and !empty($ssids[0][4]) and !empty($ssids[0][5]) ){// !a!b!c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."','".$ssids[0][5]."');";

        					}else if( empty($ssids[0][3]) and !empty($ssids[0][4]) and !empty($ssids[0][5]) ){// a !b !c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."', NULL,'".$ssids[0][4]."','".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and empty($ssids[0][4]) and !empty($ssids[0][5]) ){// !a b !c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."','".$ssids[0][3]."', NULL,'".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and !empty($ssids[0][4]) and empty($ssids[0][5]) ){// !a !b c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."','".$ssids[0][3]."','".$ssids[0][4]."', NULL);";

        					}else if( empty($ssids[0][3]) and empty($ssids[0][4]) and !empty($ssids[0][5]) ){// a b !c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."', NULL, NULL,'".$ssids[0][5]."');";

        					}else if( !empty($ssids[0][3]) and empty($ssids[0][4]) and empty($ssids[0][5]) ){// !a b c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."','".$ssids[0][3]."', NULL, NULL);";

        					}else if( empty($ssids[0][3]) and !empty($ssids[0][4]) and empty($ssids[0][5]) ){// a !b c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."', NULL,'".$ssids[0][4]."', NULL);";

        					}else if( empty($ssids[0][3]) and empty($ssids[0][4]) and empty($ssids[0][5]) ){// a b c
        						$sql = $sql."(".$cid.",'".$ssids[0][1]."', NULL, NULL, NULL);";
        					}
        				}
                    }
                    //prdn2.0 array of tags id array
                    if  (count($tids) >= 1){
                        $sql = $sql."INSERT INTO CAT(companyId, tagId) VALUES ";
                        if (count($tids) > 1){
                            for ($x = 0; $x < count($tids); $x++) {

                                if ($x < count($tids)-1){
        							$sql = $sql."(".$cid.",".$tids[$x][0]."), ";


        						}elseif($x == (count($tids) - 1)){
        							$sql = $sql."(".$cid.",".$tids[$x][0].");";

        						}
                            }
                        }else if(count($tids) == 1){
        						$sql = $sql."(".$cid.",".$tids[0][0].");";

                        }
                      }
                    
            break;

            case '10': //Get limitation application and model for a subprocess
                $arr = $_GET['arr'];
                $cid = $_GET['cid'];

                if(count($arr) == 1)
                    $sql = "SELECT subProcessId, limitation, application, model FROM CAP WHERE companyId = '".$cid."' and subProcessId = '". $arr[0]. "';";
                else{
                    $sql = "SELECT subProcessId, limitation, application, model FROM CAP WHERE companyId = '".$cid."' and subProcessId in ('". implode("','", $arr) ."');";
                }
                break;

            case '11': //Get limitation application and model for a subservice
                $arr = $_GET['arr'];
                $cid = $_GET['cid'];

                if(count($arr) == 1)
                    $sql = "SELECT subServiceId, limitation, application, model FROM CAS WHERE companyId = '".$cid."' and subServiceId = '". $arr[0]. "';";
                else{
                    $sql = "SELECT subServiceId, limitation, application, model FROM CAS WHERE companyId = '".$cid."' and subServiceId in ('". implode("','", $arr) ."');";
                }
                break;

            case '12': //Get limitation application and model for a submaterial
                $arr = $_GET['arr'];
                $cid = $_GET['cid'];

                if(count($arr) == 1)
                    $sql = "SELECT subMaterialId, limitation, application, model FROM CAM WHERE companyId = '".$cid."' and subMaterialId = '". $arr[0]. "';";
                else{
                    $sql = "SELECT subMaterialId, limitation, application, model FROM CAM WHERE companyId = '".$cid."' and subMaterialId in ('". implode("','", $arr) ."');";
                }
                break;

            case '13': //get all companies that offer a subprocess
                $spid = $_GET['sid'];
                $sql = "SELECT subProcessName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAP NATURAL JOIN subProcess WHERE subProcessId = '".$spid."' AND active IS NOT NULL ORDER BY companyName;";
                break;

            case '14': //get all companies that offer a subservice
                $ssid = $_GET['sid'];
                $sql = "SELECT subServiceName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAS NATURAL JOIN subService WHERE subServiceId = '".$ssid."' AND active IS NOT NULL ORDER BY companyName;";
                break;

            case '15': //get all companies that offer a submaterial
                $smid = $_GET['sid'];
                $sql = "SELECT subMaterialName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAM NATURAL JOIN subMaterial WHERE subMaterialId = '".$smid."' AND active IS NOT NULL ORDER BY companyName;";
                break;
            
            //prdn 2.0
            case '16': //get all companies that offer a subprocess by Name
                $spname = $_GET['scname'];
                $sql = "SELECT subProcessName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAP NATURAL JOIN subProcess WHERE subProcessName = '" . $spname . "' AND active IS NOT NULL ORDER BY companyName;";
                break;
            //prdn 2.0
            case '17': //get all companies that offer a subservice by Name
                $ssname = $_GET['scname'];
                $sql = "SELECT subServiceName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAS NATURAL JOIN subService WHERE subServiceName = '" . $ssname . "' AND active IS NOT NULL ORDER BY companyName;";
                break;
            //prdn 2.0
            case '18': //get all companies that offer a submaterial by Name
                $smname = $_GET['scname'];
                $sql = "SELECT subMaterialName, companyId, companyName, description, city, latitude, longitude, logo, logoType FROM company NATURAL JOIN address NATURAL JOIN CAM NATURAL JOIN subMaterial WHERE subMaterialName = '" . $smname . "' AND active IS NOT NULL ORDER BY companyName;";
                break;
        default:
            break;
    }

    return $sql;

};


function requestGetMaterial(){
	global $con;
    global $code;

    switch ($code) {
        case '0': //Look for a submaterial by name
            $keyword = mysqli_real_escape_string($con,$_GET['keyword']);
            $sql = "SELECT * FROM subMaterial NATURAL JOIN ".
                    " materialType WHERE subMaterialName LIKE '%" . $keyword . "%' OR materialName ".
                    "LIKE '%" . $keyword . "%' ORDER BY materialName, subMaterialName;";
            break;

        case '1': //View all materials
            $sql = "SELECT * FROM materialType ORDER BY materialName;";
            break;

        case '2': //View all materials and submaterials
            $sql = "SELECT * FROM materialType NATURAL JOIN subMaterial ORDER BY materialName, subMaterialName;";
            break;

        case '3': //View all materials and submaterials of a particular material
            $mid = $_GET['mid'];
            $sql = "SELECT * FROM materialType NATURAL JOIN subMaterial WHERE materialId = '" . $mid . "' ORDER BY subMaterialName;";
            break;

        case '4': //Delete a submaterial //prdn2.0 if it was the last submaterial of it's type delete the materialType
            $smid = $_GET['smid'];
            $sql = "DELETE FROM subMaterial WHERE subMaterialId = '".$smid."'; DELETE FROM materialType ".
            "WHERE not exists (SELECT * FROM subMaterial WHERE subMaterial.materialId = materialType.materialId);";
            break;

        case '5': //Change a submaterial connection

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $smid = $_GET['smid'];

            $sql = "DELETE ".
                    "FROM PAM ".
                    "WHERE subMaterialId = '".$smid."';";

            $sql .= "DELETE ".
                    "FROM MAS ".
                    "WHERE subMaterialId = '".$smid."';";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO PAM (subMaterialId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "('".$smid."','".implode("'), ('".$smid."','",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "('".$smid."','".$spids[0]."');";
                }
            }

            if(count($ssids) >= 1){
                $sql .= "INSERT INTO MAS (subMaterialId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "('".$smid."','".implode("'), ('".$smid."','",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "('".$smid."','".$ssids[0]."');";
                }
            }

            break;

        case '6': //Add new submaterial
            $mid = $_GET['smid'];
            $sname = mysqli_real_escape_string($con,$_GET['subName']);

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $sql  = "INSERT INTO subMaterial (materialId, subMaterialName) VALUES ('" . $mid . "','" . $sname . "');";

            $sql .= " SET @maxId := (select max(subMaterialId) from subMaterial); ";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO PAM (subMaterialId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "(@maxId,'".$spids[0]."');";
                }
            }

            if(count($ssids) >= 1){
                $sql .= "INSERT INTO MAS (subMaterialId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "(@maxId,'".$ssids[0]."');";
                }
            }
            break;

        case '7': //Add new material
            $sname = mysqli_real_escape_string($con,$_GET['subName']);
            $name = mysqli_real_escape_string($con,$_GET['name']);

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $sql = "INSERT INTO materialType (materialName) VALUES ('".$name."');";
            $sql .= " SET @matId := (select max(materialId) from materialType); ";

            $sql  .= "INSERT INTO subMaterial (materialId, subMaterialName) VALUES (@matId,'" . $sname . "');";

            $sql .= " SET @maxId := (select max(subMaterialId) from subMaterial); ";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO PAM (subMaterialId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "(@maxId,'".$spids[0]."');";
                }
            }

            if(count($ssids) >= 1){
                $sql .= "INSERT INTO MAS (subMaterialId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "(@maxId,'".$ssids[0]."');";
                }
            }
            error_log($sql, 0);
            break;


        default:
            break;
    }

    return $sql;

};


function requestGetProcess(){
	global $con;
    global $code;

    switch ($code) {
        case '0': //Look for a subprocess by name
            $keyword = mysqli_real_escape_string($con,$_GET['keyword']);
            $sql = "SELECT * FROM subProcess ".
                    "NATURAL JOIN processType WHERE subProcessName LIKE ".
                    "'%".$keyword."%' OR processName LIKE '%".$keyword."%' ORDER BY processName, subProcessName;";
            break;

        case '1': //View all processes
            $sql = "SELECT * FROM processType ORDER BY processName;";
            break;

        case '2': //View all process and subprocess
            $sql = "SELECT * FROM processType NATURAL JOIN subProcess ORDER BY processName, subProcessName;";
            break;

        case '3': //View all subprocess of a particular process
            $pid = $_GET['pid'];
            $sql = "SELECT * FROM processType NATURAL JOIN subProcess ".
            "WHERE processId = '".$pid."' ORDER BY subProcessName;";
            break;

        case '4': //Delete a subprocess
            $spid = $_GET['spid'];
            $sql = "DELETE FROM subProcess WHERE subProcessId = '".$spid."';".
            "DELETE FROM processType WHERE NOT EXISTS ( SELECT * FROM ".
            "subProcess WHERE subProcess.processId = processType.processId);";
            break;

        case '5': //Change a subprocess connection
            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $spid = $_GET['spid'];

            $sql = "DELETE ".
                    "FROM PAM ".
                    "WHERE subProcessId = '".$spid."';";
            $sql .= "DELETE ".
                    "FROM SAP ".
                    "WHERE subProcessId = '".$spid."';";

            if (count($smids) >= 1){
                $sql .= "INSERT INTO PAM (subProcessId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "('".$spid."','".implode("'), ('".$spid."','",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "('".$spid."','".$smids[0]."');";
                }

            }

            if (count($ssids) >= 1){
                $sql .= "INSERT INTO SAP (subProcessId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "('".$spid."','".implode("'), ('".$spid."','",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "('".$spid."','".$ssids[0]."');";
                }
            }

            break;

        case '6': //Add new subprocess

            $pid = $_GET['spid'];
            $sname = mysqli_real_escape_string($con,$_GET['subName']);

            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $sql  = "INSERT INTO subProcess (processId, subProcessName) VALUES ('".$pid."','" . $sname . "');";

            $sql .= " SET @maxId := (select max(subProcessId) from subProcess); ";

            if (count($smids) >= 1){
                $sql .= "INSERT INTO PAM (subProcessId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "(@maxId,'".$smids[0]."');";
                }

            }

            if (count($ssids) >= 1){
                $sql .= "INSERT INTO SAP (subProcessId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "(@maxId,'".$ssids[0]."');";
                }
            }
            break;

        case '7': //Add new process
            $sname = mysqli_real_escape_string($con,$_GET['subName']);
            $name = mysqli_real_escape_string($con,$_GET['name']);

            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['ssid']))
                $ssids = $_GET['ssid'];
            else
                $ssids = array();

            $sql = "INSERT INTO processType (processName) VALUES ('".$name."');";
            $sql .= " SET @procId := (select max(processId) from processType); ";

            $sql  .= "INSERT INTO subProcess (processId, subProcessName) VALUES (@procId,'" . $sname . "');";

            $sql .= " SET @maxId := (select max(subProcessId) from subProcess); ";

            if (count($smids) >= 1){
                $sql .= "INSERT INTO PAM (subProcessId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "(@maxId,'".$smids[0]."');";
                }

            }

            if (count($ssids) >= 1){
                $sql .= "INSERT INTO SAP (subProcessId, subServiceId) VALUES ";
                if(count($ssids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$ssids)."');";
                }elseif(count($ssids) == 1){
                    $sql .= "(@maxId,'".$ssids[0]."');";
                }
            }
            break;

        default:
            break;
    }

    return $sql;

};


function requestGetService(){
	global $con;
    global $code;

    switch ($code) {
        case '0': //look for a subservice by name
            $keyword = mysqli_real_escape_string($con,$_GET['keyword']);
            $sql = "SELECT * FROM subService ".
                    "NATURAL JOIN serviceType WHERE subServiceName LIKE '%".
                    $keyword."%' OR serviceName LIKE '%".$keyword."%' ORDER BY serviceName, subServiceName;";
            break;

        case '1': //View all services
            $sql = "SELECT * FROM serviceType ORDER BY serviceName;";
            break;

        case '2': //View all services and subservices
            $sql = "SELECT * FROM serviceType NATURAL JOIN subService ORDER BY serviceName, subServiceName;";
            break;

        case '3': //View all subservices of a particular service
            $sid = $_GET['sid'];
            $sql = "SELECT * FROM serviceType NATURAL JOIN subService ".
            "WHERE serviceId = '".$sid."' ORDER BY subServiceName;";
            break;

        case '4': //Delete a subservice
            $ssid = $_GET['ssid'];
            $sql = "DELETE FROM subService WHERE subServiceId = '".$ssid."'; ".
                    "DELETE FROM serviceType WHERE NOT EXISTS ( SELECT * ".
                    "FROM subService WHERE subService.serviceId = ".
                    "serviceType.serviceId );";
            break;

        case '5': //Change a subservice connection

            $ssid = $_GET['ssid'];

            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();


            $sql = "DELETE ".
                    "FROM SAP ".
                    "WHERE subServiceId = '".$ssid."';";
            $sql .= "DELETE ".
                    "FROM MAS ".
                    "WHERE subServiceId = '".$ssid."';";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO SAP (subServiceId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "('".$ssid."','".implode("'), ('".$ssid."','",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "('".$ssid."','".$spids[0]."');";
                }
            }

            if(count($smids) >= 1){
                $sql .= "INSERT INTO MAS (subServiceId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "('".$ssid."','".implode("'), ('".$ssid."','",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "('".$ssid."','".$smids[0]."');";
                }
            }
            break;

        case '6': //Add new subservice

            $sid = $_GET['ssid'];
            $sname = mysqli_real_escape_string($con,$_GET['subName']);

            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();

            $sql  = "INSERT INTO subService (serviceId, subServiceName) VALUES ('" . $sid . "','" . $sname . "');";

            $sql .= " SET @maxId := (select max(subServiceId) from subService); ";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO SAP (subServiceId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "(@maxId,'".$spids[0]."');";
                }
            }

            if(count($smids) >= 1){
                $sql .= "INSERT INTO MAS (subServiceId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "(@maxId,'".$smids[0]."');";
                }
            }
            break;

        case '7': //Add new service
            $sname = mysqli_real_escape_string($con,$_GET['subName']);
            $name = mysqli_real_escape_string($con,$_GET['name']);

            if(isset($_GET['smid']))
                $smids = $_GET['smid'];
            else
                $smids = array();

            if(isset($_GET['spid']))
                $spids = $_GET['spid'];
            else
                $spids = array();

            $sql = "INSERT INTO serviceType (serviceName) VALUES ('".$name."');";
            $sql .= " SET @servId := (select max(serviceId) from serviceType); ";

            $sql  .= "INSERT INTO subService (serviceId, subServiceName) VALUES (@servId,'" . $sname . "');";

            $sql .= " SET @maxId := (select max(subServiceId) from subService); ";

            if(count($spids) >= 1){
                $sql .= "INSERT INTO SAP (subServiceId, subProcessId) VALUES ";
                if(count($spids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$spids)."');";
                }elseif(count($spids) == 1){
                    $sql .= "(@maxId,'".$spids[0]."');";
                }
            }

            if(count($smids) >= 1){
                $sql .= "INSERT INTO MAS (subServiceId, subMaterialId) VALUES ";
                if(count($smids) > 1){
                    $sql .= "(@maxId,'".implode("'), (@maxId,'",$smids)."');";
                }elseif(count($smids) == 1){
                    $sql .= "(@maxId,'".$smids[0]."');";
                }
            }
            break;

        default:
            break;
    }

    return $sql;

};

function requestGetMap(){
	global $con;
    global $code;

    switch ($code) {

        case '2':
            $category = mysqli_real_escape_string($con,$_GET['category']);
            $target = mysqli_real_escape_string($con,$_GET['target']);
            $id = $_GET['id'];

            if ($category == 'mat' ){
                if($target == 'P')
                    $sql = "SELECT 'MP' as relation, subMaterialId as id1, subProcessId as id2 FROM PAM WHERE subMaterialId =  '".$id."' ;";

                elseif($target == 'S')
                    $sql = "SELECT 'MS' as relation, subMaterialId as id1, subServiceId as id2 FROM MAS WHERE subMaterialId =  '".$id."' ;";

            }
            elseif ($category == 'proc'){

                if($target == 'S')
                    $sql = "SELECT 'SP' as relation, subServiceId as id1 , subProcessId as id2 FROM SAP WHERE subProcessId = '".$id."' ;";

                elseif($target == 'M')
                $sql = "SELECT 'MP' as relation, subMaterialId as id1 , subProcessId as id2 FROM PAM WHERE subProcessId = '".$id."' ;";

            }
            elseif ($category == 'serv'){

                if($target == 'M')
                $sql = "SELECT 'MS' as relation, subMaterialId as id1 , subServiceId as id2 FROM MAS WHERE subServiceId = '".$id."' ;";

                elseif($target == 'P')
                    $sql = "SELECT 'PS' as relation, subProcessId as id1 , subServiceId as id2  FROM SAP WHERE subServiceId = '".$id."' ;";
            }
        break;

        case '3': //Get all childrens
            $category = mysqli_real_escape_string($con,$_GET['category']);
            $id = $_GET['id'];

            if($category == 'mat')
                $sql = "SELECT subMaterialId FROM subMaterial NATURAL JOIN materialType WHERE materialId= '".$id."' ;";

            elseif($category == 'proc')
                $sql = "SELECT subProcessId FROM subProcess NATURAL JOIN processType WHERE processId= '".$id."' ;";

            else
                $sql = "SELECT subServiceId FROM subService NATURAL JOIN serviceType WHERE serviceId= '".$id."' ;";
            break;

         case '4': //Company that offer the servs, mats, and proces in the arrays
            // $global_serv = $_GET['global_serv'];
            // $global_mat = $_GET['global_mat'];
            // $global_proc = $_GET['global_proc'];

            if(isset($_GET['global_serv'])){
                $global_serv = $_GET['global_serv'];
            }else{
                $global_serv = array();
            }

            if(isset($_GET['global_mat'])){
                $global_mat = $_GET['global_mat'];
            }else{
                $global_mat = array();
            }

            if(isset($_GET['global_proc'])){
                $global_proc = $_GET['global_proc'];
            }else{
                $global_proc = array();
            }

            $sql = "SELECT companyId, companyName, addressId, latitude, longitude, line, logo, logoType FROM company AS CMP NATURAL JOIN address WHERE CMP.active IS NOT NULL ";


            // // ////if one of the global arrays has values add the WHERE clause and setup lists
            if(count($global_serv) >= 1 or count($global_mat) >= 1 or count($global_proc) >= 1 ){
                $sql.= " AND ";


                // // //set up the lists for query///////

                if(count($global_serv) > 1){
                    $servIdList = "'".implode("','",$global_serv)."'";
                }elseif(count($global_serv) == 1){
                    $servIdList = "'".$global_serv[0]."'";
                }

                if(count($global_mat) > 1){
                    $matIdList = "'".implode("','",$global_mat)."'";
                }elseif (count($global_mat) == 1){
                    $matIdList = "'".$global_mat[0]."'";
                }

                if(count($global_proc) > 1){
                    $procIdList = "'".implode("','",$global_proc)."'";
                }elseif (count($global_proc) == 1){
                    $procIdList = "'".$global_proc[0]."'";
                }

                // //set up the lists for query///////

                // //set up EXISTS clause for CAP
                if (isset($procIdList)){
                    $sqlCAP = " EXISTS (SELECT * FROM CAP WHERE ".
                    "CMP.companyId = CAP.companyId ".
                    "AND CAP.subProcessId IN (".$procIdList.")) ";
                    // // '8','9','7','12' iterate here
                }

                // //set up EXISTS clause for CAM
                if(isset($matIdList)){
                    $sqlCAM= " EXISTS (SELECT * FROM CAM WHERE ".
                    "CMP.companyId = CAM.companyId ".
                    "AND CAM.subMaterialId IN (".$matIdList.")) ";
                    // //   '1','4','2','3' iterarate here
                }

                // //set up EXISTS clause for CAS
                if(isset($servIdList)){
                    $sqlCAS= " EXISTS (SELECT * FROM CAS WHERE ".
                    "CMP.companyId = CAS.companyId ".
                    "AND CAS.subServiceId IN (".$servIdList.")) ";
                    // //   '1','2','9','10' iterate here
                }

                // //construct rest of query
                if(isset($sqlCAM) and isset($sqlCAS) and isset($sqlCAP)){
                    $sql .= $sqlCAM." AND ".$sqlCAS." AND ".$sqlCAP;
                }elseif(!isset($sqlCAM) and isset($sqlCAS) and isset($sqlCAP)){
                    $sql .= $sqlCAS." AND ".$sqlCAP;
                }elseif(isset($sqlCAM) and !isset($sqlCAS) and isset($sqlCAP)){
                    $sql .= $sqlCAM." AND ".$sqlCAP;
                }elseif(isset($sqlCAM) and isset($sqlCAS) and !isset($sqlCAP)){
                    $sql .= $sqlCAM." AND ".$sqlCAS;
                }elseif(!isset($sqlCAM) and !isset($sqlCAS) and isset($sqlCAP)){
                    $sql .= $sqlCAP;
                }elseif(!isset($sqlCAM) and isset($sqlCAS) and !isset($sqlCAP)){
                    $sql .= $sqlCAS;
                }elseif(isset($sqlCAM) and !isset($sqlCAS) and !isset($sqlCAP)){
                    $sql .= $sqlCAM;
                }

            }
            else{
                $sql .= " AND 1 = 0 ";
            }
            $sql .= " ;";//to finish the query

            break;

        case '5'://getRelatedProc
            $id = $_GET['id'];
            $pivot_column = mysqli_real_escape_string($con,$_GET['pivot_column']);
            $table = "";
            $col = "";

            if($pivot_column == 'mat'){
                $table = " PAM ";
                $col = "subMaterialId";
                }
            elseif($pivot_column == 'serv'){
                $table = "SAP";
                $col = "subServiceId";
            }

            $sql = "SELECT subProcessId FROM ".$table." WHERE ".$col." = ".$id.";";


            break;

        case '6'://getRelatedServ
            $id = $_GET['id'];
            $pivot_column = mysqli_real_escape_string($con,$_GET['pivot_column']);
            $table = "";
            $col = "";

            if($pivot_column == 'mat'){
                $table = " MAS ";
                $col = "subMaterialId";
                }
            elseif($pivot_column == 'proc'){
                $table = "SAP";
                $col = "subProcessId";
            }

            $sql = "SELECT subServiceId FROM ".$table." WHERE ".$col." = ".$id.";";
            break;

        case '7'://getRelatedMat
            $sql = "";
            $id = $_GET['id'];
            $pivot_column = mysqli_real_escape_string($con,$_GET['pivot_column']);

            $table = "";
            $col = "";

            if($pivot_column == 'proc'){
                $table = " PAM ";
                $col = "subProcessId";
                }
            elseif($pivot_column == 'serv'){
                $table = "MAS";
                $col = "subServiceId";
            }

            $sql = "SELECT subMaterialId FROM ".$table." WHERE ".$col." = ".$id.";";

            break;

        default:
            break;
    }

    return $sql;

};

function requestGetSubmissions(){
	global $con;
    global $code;

    switch ($code) {
        case '0': //View all submissions
            $sql = "SELECT submissionId, userId, companyName, submissionStatus, website, description, phone, submissionDate, "
			."email, line, city, country, zipcode FROM submissions ORDER BY submissionStatus DESC;";
            break;

        case '1': //delete a particular submission
            $subid = $_GET['subid'];
            $sql = "DELETE FROM submissions WHERE submissionId ='" .$subid."';";
            break;

        case '2': //change the state of a submission
            $subid = $_GET['subid'];
            $sql = "UPDATE submissions SET submissionStatus = 0 WHERE submissionId ='".$subid. "';";
            break;

        case '3': //add a new submission
            $uid = $_GET['uid'];
            $sname = mysqli_real_escape_string($con,$_GET['sname']);
            $swebsite = mysqli_real_escape_string($con,$_GET['swebsite']);
            $sdescription = mysqli_real_escape_string($con,$_GET['sdescription']);
            $sphone = mysqli_real_escape_string($con,$_GET['sphone']);
            ///////////////////////////////////////////////////////////////$simage = mysqli_real_escape_string($con,$_GET['simage']);
            $semail = mysqli_real_escape_string($con,$_GET['semail']);
            $sline = mysqli_real_escape_string($con,$_GET['sline']);
            $scity = mysqli_real_escape_string($con,$_GET['scity']);
            $scountry = mysqli_real_escape_string($con,$_GET['scountry']);
            $szip = mysqli_real_escape_string($con,$_GET['szip']);


            $sql = "INSERT INTO submissions (userId, companyName, submissionStatus, website," .
                    " description, phone, submissionDate, email, line, city, country, zipcode) VALUES ('".$uid."', '".$sname.
                    "', 1, '".$swebsite."', '".$sdescription."', '".$sphone."', now(), '". $semail."', '".$sline."', '".$scity."', '".$scountry."', '".$szip."');";
            break;

        case '4': //Get the number of *new* pending request  
            $sql = "SELECT COUNT(*) as number FROM submissions WHERE submissionStatus = 1; ";
            break;

        case '5': //Get a particular submission
            $subid = $_GET['subid'];
            $sql = "SELECT * FROM submissions WHERE submissionId = '".$subid."'";
            break;

        default:
            break;
    }

    return $sql;

};

function requestGetNews(){
	global $con;
    global $code;

    switch ($code) {

        case '0': //View all news
            $curr = $_GET['curr'];
            $sql = "SELECT * FROM news WHERE newsId < ".$curr." ORDER BY newsId desc LIMIT 10;";
            break;

        case '1': //View a particular news
            $nid = $_GET['nid'];
            $sql = "SELECT * FROM news WHERE newsId = '" . $nid . "';";
            break;

        case '2': //Delete a particular new
            $nid = $_GET['nid'];
            $sql = "DELETE FROM news WHERE newsId ='". $nid ."';";
            break;

        case '3': //Add a new news
            $aid = $_GET['aid'];
            $ntitle = mysqli_real_escape_string($con,$_GET['ntitle']);
            $nbody = mysqli_real_escape_string($con,$_GET['nbody']);
           //////////////////////////////////////////////// $nimag = $_GET['nimag'];
            $sql = "INSERT INTO news (adminId, title, body, newsDate)" .
            "VALUES ('" . $aid . "','" . $ntitle ."','" . $nbody ."',now());";
            break;


        case '4': //Update information about a particular news
            $ntitle = mysqli_real_escape_string($con,$_GET['ntitle']);
            $nbody = mysqli_real_escape_string($con,$_GET['nbody']);
            ///////////////////////////////////////////////////////////////$nimag = $_GET['nimag'];
            $nid = $_GET['nid'];
            $sql = "UPDATE news SET title = '". $ntitle. "',body =  '". $nbody ."' WHERE newsId = '" . $nid . "';";
            
			break;

        case '5':
            $sql = "SELECT title, body, newsId FROM news;";
            break;

        default:
            break;
    }

    return $sql;

};

?>
