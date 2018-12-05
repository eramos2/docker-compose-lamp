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

$sql = getQuery();
error_log($sql,0); 

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
    error_log(print_r($rows,1), 0);
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
    switch ($endpoint) {

        case 'projects':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetProjects();
            else
                return requestPostProject();
            break;

        case 'company':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetCompany();
            else
                die("Wrong EndPoint! ");
            return;
            break;

        default:
            die("Wrong EndPoint! ");
            break;
    }
};


function requestGetProjects(){
	global $con;
    global $code;
    switch ($code) {
        case '0': //get all user's projects with their respective tags by the given user id
            $uid = $_GET['uid'];
            $sql = "SELECT projectId, projectName, tagName, tagCategory, tagId " 
                   . "FROM users NATURAL JOIN UAP NATURAL JOIN projects NATURAL JOIN PAT NATURAL JOIN tags "
                   . "WHERE userId = '" . $uid ."';";
            break;
          
        case '1':    //get tags(tagId) endorsed by the given user id to the given company name
            $uid = $_GET['uid'];
            $cname = $_GET['cname'];
            $sql = "SELECT tagId FROM (SELECT firstName, tagId, tagName, tagCategory "
                 . "FROM users NATURAL JOIN endorsement NATURAL JOIN tags WHERE userId = '". $uid ."') "
                 . "AS T NATURAL JOIN company WHERE companyName = '". $cname ."';";
            break;  
    
        case '3': //Get all tags from a company with their respective endorsements count
            $cName = $_GET['cname']; //The company name 
            $sql = "SELECT cmpT.tagId, COALESCE(times, 0) as endorsements FROM (SELECT tagId "
              . "FROM company NATURAL JOIN CAT NATURAL JOIN tags WHERE companyName = \'" . $cname . "'"
            . ") as cmpT LEFT JOIN ( SELECT tagId, COUNT(*) as times FROM company NATURAL JOIN endorsement "
            . " WHERE companyName = '". $cname ."' GROUP BY tagId) as endorsedTags "  
            . "ON cmpT.tagId = endorsedTags.tagId;";
            break;
        
        case '4': //Get all tags with their id,category, and name
            $sql = "SELECT * FROM tags";
        
        case '5': //Get all tag's categories
            $sql = "SELECT DISTINCT tagCategory FROM tags;";
            break;
        
        case '6': //Get all tags name and id by the given tag category name
            $tcat= $_GET['tcat'];
            $sql = "SELECT tagId, tagName FROM tags WHERE tagCategory = '" . $tcat. "';";
            break;

        case '7': //Add new project 
            $uid = $_GET['uid'];
            $pname = mysqli_real_escape_string($con,$_GET['pname']);

            //Check for tags related to the project
            if(isset($_GET['tids']))
                $tids = $_GET['tids'];
            else
                $tids = array();

            //Add the project name
            $sql = "INSERT INTO projects (projectName) VALUES ('".$pname."');";

            //Get the new project id
            $sql .= "SET @maxId := (select max(projectId) from projects);";

            //Add the relation between user and project
            $sql .= "INSERT INTO UAP (userId, projectId) VALUES ('". $uid ."', @maxId);";

            //Add relation between project and tags
            if  (count($tids) >= 1){
                $sql = $sql."INSERT INTO PAT(projectId, tagId) VALUES ";
                if (count($tids) > 1){
                    for ($x = 0; $x < count($tids); $x++) {

                        if ($x < count($tids)-1){
                            $sql = $sql."(@maxId,".$tids[$x][0]."), ";


                        }elseif($x == (count($tids) - 1)){
                            $sql = $sql."(@maxId,".$tids[$x][0].");";

                        }
                    }
                }else if(count($tids) == 1){
                        $sql = $sql."(@maxId,".$tids[0][0].");";

                }
              }

              break; 

        case '8':   //Get Businesses recommendations based on the project tags(gets tags Matched count and the company data )
            $pid = $_GET['pid']; // The projectId to get its associated tags, and get the businesses that match this tags. 
            
            $sql = "SELECT companyId, companyName, description, city, logo, logoName, logoType, tagsMatched FROM ".
            "(SELECT companyId, companyName, description, logo, logoName, logoType, COUNT(*) as tagsMatched FROM ".
            "(SELECT tagId FROM projects NATURAL JOIN PAT NATURAL JOIN tags WHERE projectId = '". $pid ."') ". 
            " as projectTags NATURAL JOIN CAT NATURAL JOIN company WHERE active IS NOT NULL ".
            "GROUP BY companyId ORDER BY tagsMatched DESC) as recommendedComps NATURAL JOIN address;";

            break;

        case '9': //Remove project
            $pid = $_GET['pid'];

            $sql = "DELETE FROM UAP WHERE projectId = '". $pid ."'; DELETE FROM projects WHERE projectId = '". $pid ."';";
        
            break;
        
        case '10': //Edit project

            $uid = $_GET['uid'];
            $pname = mysqli_real_escape_string($con,$_GET['pname']);
            $pid = $_GET['pid'];

            //Check for tags related to the project
            if(isset($_GET['tids']))
                $tids = $_GET['tids'];
            else
                $tids = array();

            //Remove any previous tags
            $sql = "DELETE FROM PAT WHERE projectId = '".$pid."';";
            //Add the project name
            $sql = $sql."UPDATE projects SET projectName '".$pname."' WHERE projectId = '".$pid."';";
            
            //Add relation between project and tags
            if  (count($tids) >= 1){
                $sql = $sql."INSERT INTO PAT(projectId, tagId) VALUES ";
                if (count($tids) > 1){
                    for ($x = 0; $x < count($tids); $x++) {

                        if ($x < count($tids)-1){
                            $sql = $sql."('".$pid."','".$tids[$x][0]."'), ";


                        }elseif($x == (count($tids) - 1)){
                            $sql = $sql."('".$pid."','".$tids[$x][0]."');";

                        }
                    }
                }else if(count($tids) == 1){
                        $sql = $sql."('".$pid."','".$tids[0][0]."');";

                }
              }

              break;
        }
        return $sql;
}

?>
