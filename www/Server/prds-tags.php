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
    switch ($endpoint) {

        case 'tags':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetTags();
            else
                return requestPostTags();
            break;

        case 'projects':
            if($_SERVER['REQUEST_METHOD'] == "GET")
                return requestGetProjects();
            else
                return requestPostProjects();
            return;
            break;

        default:
            die("Wrong EndPoint! ");
            break;
    }
};

//All tag related Get calls
function requestGetTags(){
	global $con;
    global $code;
    switch ($code) {
          
        case '0':    //get tags(tagId) endorsed by the given user id to the given company name
            $uid = $_GET['uid'];
            $cname = $_GET['cname'];
            $sql = "SELECT tagId FROM (SELECT firstName, tagId, tagName, tagCategory "
                 . "FROM users NATURAL JOIN endorsement NATURAL JOIN tags WHERE userId = '". $uid ."') "
                 . "AS T NATURAL JOIN company WHERE companyName = '". $cname ."';";
            break;  
    
        case '1': //Get all tags from a company with their respective endorsements count
            $cName = $_GET['cname']; //The company name 
            $sql = "SELECT tagId, tagName, tagCategory, endorsements FROM (SELECT cmpT.tagId, COALESCE(times, 0) as endorsements FROM (SELECT tagId "
              . "FROM company NATURAL JOIN CAT NATURAL JOIN tags WHERE companyName = '" . $cName . "' AND active IS NOT NULL"
            . ") as cmpT LEFT JOIN ( SELECT tagId, COUNT(*) as times FROM company NATURAL JOIN endorsement "
            . " WHERE companyName = '". $cName ."' GROUP BY tagId) as endorsedTags "  
            . "ON cmpT.tagId = endorsedTags.tagId) as compEnd NATURAL JOIN tags;";
            break;
        
        case '2': //Get all tags with their id,category, and name
            $sql = "SELECT * FROM tags";
            break;
        
        case '3': //Get all tag's categories
            $sql = "SELECT DISTINCT tagCategory FROM tags;";
            break;
        
        case '4': //Get all tags name and id by the given tag category name
            $tcat= $_GET['tcat'];
            $sql = "SELECT tagId, tagName FROM tags WHERE tagCategory = '" . $tcat. "';";
            break;
        case '5':
            $sql = "";
            break;
               //Add project to user (needs to add tags to project if any)
             //needs to add project name to project
            //INSERT INTO `UAP` (`userId`, `projectId`) VALUES ('5', '3');
        }
        return $sql;
}

function requestPostTags(){
    global $con;
    global $code;
    switch ($code) {
        case '0': //add a new tag, with given name and category
            $name = mysqli_real_escape_string($con,$_POST['name']);
            $category = mysqli_real_escape_string($con,$_POST['category']);
 
            $sql = "INSERT INTO tags (tagName, tagCategory) VALUES ('" . $name . "','"   . $category . "');";
            break;
        case '1': //edit tag name, from given tag id and tag name
            $name = mysqli_real_escape_string($con,$_POST['name']);
            $tid = mysqli_real_escape_string($con,$_POST['tagId']);
            
            $sql = "UPDATE tags SET tagName = '". $name . "' WHERE tags.tagId = '". $tid ."'";
            break;
        case '2': //Delete a tag 
            $tid = mysqli_real_escape_string($con,$_POST['tagId']);
           
            $sql = "DELETE FROM tags WHERE tagId = '".$tid."'";
            break;
    }
    return $sql;
}

//All project related GET calls
function requestGetProjects() {
    global $con;
    global $code;
    switch ($code) {
        case '0': //get all user's projects with their respective tags by the given user id
            $uid = $_GET['uid'];
            $sql = "SELECT projectName, tagName, tagCategory " 
                   . "FROM users NATURAL JOIN UAP NATURAL JOIN projects NATURAL JOIN PAT NATURAL JOIN tags "
                   . "WHERE userId = '" . $uid ."';";
            break;
    }
    return $sql;

}

?>
