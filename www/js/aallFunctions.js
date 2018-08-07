
var globalDropzone;
var globalDropzone2;
var myMarker = new google.maps.LatLng(18.1987193, -66.3526748);
var mainMap;
var currentAdmin = GetCookie('userID');
var myForm;
var globalEmail;
var addBsnType;
//Global Variables to get all the checked checkboxes in addBusiness.html
var matChecked = [];
var procChecked = [];
var servChecked = [];
//Global Variable to pass addBusiness.html inputs to addBusinessExtra.html
var msg = '';

//Global variable for cookies
var expdate = new Date ();
expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000*365)); // 1 yr from now

// Main Global Variables
var globalProc = [];
var globalMat = [];
var globalServ = [];

var procToShow = [];
var matToShow = [];
var servToShow = [];
var tempArray = [];

var matCompanies = [];
var servCompanies = [];
var procCompanies = [];
var mainCompanyPins = [[]];

var pClicks = 0;
var mClicks = 0;
var sClicks = 0;
var timesCalled = 0;

var mainBoxText1 = document.createElement("div");
mainBoxText1.id = "mainBoxText1";
mainBoxText1.className = "labelText1";
mainBoxText1.innerHTML = "title1";//this is created earlier
var mainBoxList = [];
var mainMarkers = [];

var toDelete = '-1';
var articleToShow = 8388607;
var myScrollHandler = function() {

    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        console.log("Scroll Activated!");
        loadAllArticles();
    }
};

function turnOffScroll(){
    //console.log("Scroll Deactivated!");
    $(window).off("scroll", myScrollHandler);
}

/******************************************************************************************************************
 Cookies
 ******************************************************************************************************************/

function setCookie(name, value, expires, path, domain, secure) {  var thisCookie = name + "=" + escape(value) +
    ((expires) ? "; expires=" + expires.toGMTString() : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
    document.cookie = thisCookie;
}

function showCookie(){

   // // alert(unescape(document.cookie));
}

function getCookieVal (offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal (j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function DeleteCookie (name) {
    if (GetCookie(name)) {
        document.cookie = name + "= ; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

function setWelcomeMsg(){
    var userId = GetCookie("userId");

    var dataToSend = {
        endpoint: 'users',
        code: '1',
        uid : userId };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            document.getElementById('loggedIn').innerHTML+= '<li onclick=\"loadPage(\'editAccount\')\" id="welcomeMsg"><a>Welcome '+response[0].firstName+' !</a></li><li id="logOutOpt"><a onclick="logOut()" >(Log Out)</a></li>';
            $("#logOutOpt").mouseover(function(){
                $(this).css("cursor","pointer");
            });
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}
function setUserCookie(id){
    var dataToSend = {
        endpoint: 'users',
        code: '1',
        uid : id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var userType = "regular";
            var now= new Date();
            now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);
            setCookie("userId", id, now);
            setCookie("userType", userType, now);
			loadPage('goToMain');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function setAdminWelcomeMsg(){
    var userId = GetCookie("userId");
    console.log();
    var dataToSend = {
        endpoint: 'admin',
        code: '1',
        aid: userId };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            $('#adminLogInOpt').remove();
            document.getElementById('loggedIn').innerHTML+= '<li onclick=\"loadPage(\'editAccount\')\" id="welcomeMsg"><a>Welcome '+response[0].firstName+' !</a></li></li><li id="logOutOpt"><a onclick="logOut()">(Log Out)</a></li><li><span class="glyphicon glyphicon-wrench wrenchMargin" onclick=\"loadPage(\'controlPanel\')\" id="wrench"></span>';
            $("#wrench").mouseover(function(){
                $(this).css("cursor","pointer");
            });
            $("#logOutOpt").mouseover(function(){
                $(this).css("cursor","pointer");
            });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });



}

function setAdminCookie(type, id){
    var dataToSend = {
        endpoint: 'admin',
        code: '1',
        aid: id 
	};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var userType = "admin";
            var now= new Date();
            now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);

            setCookie("userId", id, now);
            setCookie("userType", userType, now);
            setCookie("adminType", type, now);
            loadPage('controlPanel');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

//Function that detects if an user is a regular user or an admin, and calls the respective function to set
// the welcome message and respective options.
function userType(){
    var userType = GetCookie("userType");
    if (userType=='regular'){
        $('#logOutOpt').remove();
        $('#welcomeMsg').remove();
        $('#loginOption').remove();
        $('#eOption').remove();
        $('#wrench').remove();
        setWelcomeMsg();
    }

    else if (userType=='admin'){
        $('#logOutOpt').remove();
        $('#welcomeMsg').remove();
        $('#loginOption').remove();
        $('#registerOption').remove();
        $('#wrench').remove();
        setAdminWelcomeMsg();
    }

    else {
        $('#logOutOpt').remove();
        $('#welcomeMsg').remove();
        $('#loginOption').remove();
        $('#registerOption').remove();
        $('#wrench').remove();
        document.getElementById('loggedIn').innerHTML+= '<li onclick=\"loadPage(\'login\')\" id="loginOption"><a>Login</a></li><li onclick=\"loadPage(\'register\')\" id="registerOption"><a>Register</a></li>';
    }
}

function logOut(){
    DeleteCookie('userId');
    DeleteCookie('adminType');
    DeleteCookie('userType');
    loadPage('goToMain');
    userType();
}

function goToCP(){
    loadPage('controlPanel');
}

function cookiesEnableTest(){
    var now= new Date();
    now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    setCookie("test", "test", now);
}

/******************************************************************************************************************
 Utilities
 ******************************************************************************************************************/

function isValidEmailAddress(emailAddress) {

    var pattern = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);

    return pattern.test(emailAddress);
};

function isValidBirthDate(date) {

    var dateVal = date;

    if (dateVal == null)
        return false;

    var validatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;

    dateValues = dateVal.match(validatePattern);

    if (dateValues == null)
        return false;

    var dtYear = dateValues[1];
    dtMonth = dateValues[3];
    dtDay=  dateValues[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay> 31)
        return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
        return false;
    else if (dtMonth == 2){
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap))
            return false;
    }

    return true;
};

function isValidPhone(phone) {

    var pattern = new RegExp(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/);

    return pattern.test(phone);
};

function isValidZipCode(zipcode) {

    var pattern = new RegExp(/^(\d{5})?$/);

    return pattern.test(zipcode);
};

function isValidWebsite(website) {

    var pattern = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

    if(website != ''){
        return pattern.test(website);
    }
    else{
        return true;
    }
};

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

function populateServiceList(){
//    // alert("I'm getting services and subservices");

    var html;
    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li><div class="checkbox"><label><input type="checkbox" name="subService" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of services gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].serviceId;
                html1 += '<li class="input-group" name="service" value="' + response[i].serviceId + '">' + response[i].serviceName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subServiceName +"," + response[i].subServiceId +","+ response[i].serviceId +'"/>' + response[i].subServiceName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].serviceId)){
                    i++;
                    html2 += subCategory + response[i].subServiceName +"," + response[i].subServiceId +","+ response[i].serviceId +'"/>' + response[i].subServiceName + subCategory2;
                }
                html1 = html1 + html2;
            }

            html = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function populateProcessList(){

//    // alert("I'm getting materials and subprocess");

    var html;
    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li class="catMargins"><div class="checkbox"><label><input type="checkbox" name="subProcess" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of processes gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].processId;
                html1 += '<li class="input-group" name="process" value="' + response[i].processId + '">' + response[i].processName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subProcessName +"," + response[i].subProcessId +"," + response[i].processId +'">' + response[i].subProcessName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].processId)){
                    i++;
                    html2 += subCategory + response[i].subProcessName +"," + + response[i].subProcessId +","+ response[i].processId +'">' + response[i].subProcessName + subCategory2;
                }
                html1 = html1 + html2;
            }
            html = html1;


        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function populateMaterialsList(){
//    // alert("I'm getting materials and submaterials");
    var html;
    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li class="catMargins"><div class="checkbox"><label><input type="checkbox" name="subMaterial" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of processes gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].materialId;
                html1 += '<li class="input-group" name="process" value="' + response[i].materialId + '">' + response[i].materialName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subMaterialName +"," + response[i].subMaterialId +","+ response[i].materialId +'">' + response[i].subMaterialName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].materialId)){
                    i++;
                    html2 += subCategory + response[i].subMaterialName +"," + + response[i].subMaterialId +","+ response[i].materialId +'">' + response[i].subMaterialName + subCategory2;
                }
                html1 = html1 + html2;
            }
            html = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
      // // alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function populateServiceList2(){
//    // alert("I'm getting services and subservices");

    var html;
    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li><div class="checkbox"><label><input type="checkbox" name="subService" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of services gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].serviceId;
                html1 += '<li class="input-group" name="service" value="' + response[i].serviceId + '">' + response[i].serviceName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subServiceId+'"/>' + response[i].subServiceName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].serviceId)){
                    i++;
                    html2 += subCategory + response[i].subServiceId + '"/>' + response[i].subServiceName + subCategory2;
                }
                html1 = html1 + html2;
            }

            html = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //// alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function populateProcessList2(){

//    // alert("I'm getting materials and subprocess");

    var html;
    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li class="catMargins"><div class="checkbox"><label><input type="checkbox" name="subProcess" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of processes gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].processId;
                html1 += '<li class="input-group" name="process" value="' + response[i].processId + '">' + response[i].processName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subProcessId +'">' + response[i].subProcessName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].processId)){
                    i++;
                    html2 += subCategory + response[i].subProcessId + '">' + response[i].subProcessName + subCategory2;
                }
                html1 = html1 + html2;
            }
            html = html1;


        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function populateMaterialsList2(){
//    // alert("I'm getting materials and submaterials");
    var html;
    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            var html1 = "";
            var html2 = "";
            var subCategory = '<li class="catMargins"><div class="checkbox"><label><input type="checkbox" name="subMaterial" value="'; //value = subMaterialId
            var subCategory2 = '</label></div></li>';
            var matId = 0;

            //for loop to traverse the list of processes gathered from the DB and add it to the html
            for(var i=0; i < response.length; i++){
                matId = response[i].materialId;
                html1 += '<li class="input-group" name="process" value="' + response[i].materialId + '">' + response[i].materialName + '</li>';
                html2 = "";
                html2 += subCategory + response[i].subMaterialId +'">' + response[i].subMaterialName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].materialId)){
                    i++;
                    html2 += subCategory + response[i].subMaterialId +'">' + response[i].subMaterialName + subCategory2;
                }
                html1 = html1 + html2;
            }
            html = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
    return html;
}

function getChboxSelected(frm,m,p,s){

    matChecked = [];
    procChecked = [];
    servChecked = [];

    var checklist = [];
    if(m == 1){
        for (i = 0; i < frm.subMaterial.length; i++) {
            if (frm.subMaterial[i].checked) {
                checklist = frm.subMaterial[i].value.split(",");
                toPush = [];
                toPush.push(checklist[0]);
                toPush.push(parseInt(checklist[1]));
                toPush.push(parseInt(checklist[2]));
                matChecked.push(toPush);
            }
        }
    }


    if(p == 1){
        for (i = 0; i < frm.subProcess.length; i++) {
            if (frm.subProcess[i].checked) {
                checklist = frm.subProcess[i].value.split(",");
                toPush = [];
                toPush.push(checklist[0]);
                toPush.push(parseInt(checklist[1]));
                toPush.push(parseInt(checklist[2]));
                procChecked.push(toPush);
            }
        }
    }


    if(s ==1){
        for (i = 0; i < frm.subService.length; i++) {
            if (frm.subService[i].checked) {
                checklist = frm.subService[i].value.split(",");
                toPush = [];
                toPush.push(checklist[0]);
                toPush.push(parseInt(checklist[1]));
                toPush.push(parseInt(checklist[2]));
                servChecked.push(toPush);
            }
        }
    }
};

function getChboxSelected2(frm,m,p,s){

    matChecked = [];
    procChecked = [];
    servChecked = [];

    var checklist = [];
    if(m == 1){
        for (i = 0; i < frm.subMaterial.length; i++) {
            if (frm.subMaterial[i].checked) {
                checklist = frm.subMaterial[i].value.split(",");
                matChecked.push(parseInt(checklist));
            }
        }
    }


    if(p == 1){
        for (i = 0; i < frm.subProcess.length; i++) {
            if (frm.subProcess[i].checked) {
                checklist = frm.subProcess[i].value;
                console.log(frm.subProcess[i].value);
                procChecked.push(parseInt(checklist));
            }
        }
    }


    if(s ==1){
        for (i = 0; i < frm.subService.length; i++) {
            if (frm.subService[i].checked) {
                checklist = frm.subService[i].value;
                servChecked.push(parseInt(checklist));
            }
        }
    }
};

/******************************************************************************************************************
 addAdmin.html
 ******************************************************************************************************************/
function validateAddAdmin(frm){
    var fName = frm.firstname.value;
    var lName = frm.lastnames.value;
    var email = frm.email.value;
    var password = frm.pass1.value;
    var occupation = frm.occupation.value;
    var birth = frm.birthdate.value;
    var city = frm.city.value;
    var adminType = frm.adminType.value;
    var errorMessage = "";

    var dataToSend = {
        endpoint: 'admin',
        code: '4',
        aemail: email
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('Success!!');
            var response = data.resp; 
            console.log(response);
            console.log(response.length != 0);      
            if(response.length != 0){
                console.log('response length different of zero');
                errorMessage = "<br />The email entered already exists. Please enter another email.";
            }

            if($.trim($("#addAdminFName").val()) == ""){
              errorMessage = "<br />Please enter a valid first name.";
            }

            if($.trim($("#addAdminFLast").val()) == ""){
                errorMessage = "<br />Please enter a valid last name.";
            }

            if (!isValidEmailAddress($("#addAdminEmail").val().toLowerCase())) {
                errorMessage = "<br />Please enter a valid email address.";
            }

           if (!isValidBirthDate($("#addAdminBirthdate").val())) {
               errorMessage = "<br />Please enter a valid birth date in the format yyyy-mm-dd.";
           }

            if (($("#addAdminPass1").val() != $("#addAdminPass2").val()) || ($.trim($("#addAdminPass1").val()) == "") || ($.trim($("#addAdminPass2").val()) == "")) {
                errorMessage = "<br />Passwords does not match.";
            }

            if(adminType== "0"){
                errorMessage = "<br />Select an administrator type.";
            }

            if (errorMessage == "") {
                console.log(email + "\n" + password+ "\n" +fName+ "\n" +lName+ "\n" +occupation+ "\n" +birth+ "\n" + city+ "\n" + adminType);
                addNewAdmin(email,password, fName, lName, occupation, birth, city, adminType);     
            }

            else {
                $("#error").html(errorMessage);
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
    
}

/******************************************************************************************************************
 addArticle.html
 ******************************************************************************************************************/
function dropzoneArticlePic(){
    Dropzone.autoDiscover = false;
	var dir = "upload"+GetCookie("userType")+GetCookie("userId");
    var myDropzone = new Dropzone("#dropzone-article-photo", {
        url: "./html/uploadNewsImage.php?new=t&dir="+dir,
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
                // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
            // alert("Error uploading the following image: " + file.name);
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
			var dataToSend = {
                filename: name,
				dir: dir
            };
            $.ajax({
                type: "POST",
                url: "./html/uploadNewsImage.php?delete=true",
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        // alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
				
	
    });
	
}

function validateAddArticle(frm){
    var title = frm.title.value;
    var description = frm.description.value;

    var errorMessage = "";

    if($.trim($("#addArtDesc").val()) == ""){
        errorMessage = "<br />Please enter a valid description.";
    }

    if($.trim($("#addArtTitle").val()) == ""){
        errorMessage = "<br />Please enter a valid title.";
    }

    if (errorMessage == "") {
        console.log(title + "\n" + description);
        addNews(GetCookie('userId'),title,description,null);
    }

    else {
        $("#error").html(errorMessage);
    }
}


/******************************************************************************************************************
 addBusiness.html
 ******************************************************************************************************************/

//Function to load all dynamic lists in addBusiness.html
function loadAddBusiness(){
    addBsnServiceList();
    addBsnProcessList();
    addBsnMaterialsList();
	dropzonePhotos();
	dropzoneLogo();
	globalDropzone = Dropzone.forElement("#dropzone-photos");
	globalDropzone2 = Dropzone.forElement("#dropzone-logo");
}
function dropzonePhotos(){
   Dropzone.autoDiscover = false;
   var dir = "upload"+GetCookie("userType")+GetCookie("userId");  
    var myDropzone = new Dropzone("#dropzone-photos", {
        url: "./html/uploadCompanyImage.php?new=t&dir="+dir,
        addRemoveLinks: true,
        uploadMutiple: true,
        parallelUploads: 5,
        maxFileSize: 1,
        maxFiles: 5,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
              //  // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
            // alert("Error uploading the following image: " + file.name);
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
				dir: dir
			};
            $.ajax({
                type: "POST",
                url: "./html/uploadCompanyImage.php?delete=true",
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        // alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}

function dropzoneLogo(){
    Dropzone.autoDiscover = false;
	var dir = "upload"+GetCookie("userType")+GetCookie("userId");  
    var myDropzone = new Dropzone("#dropzone-logo", {
        url: "./html/uploadCompanyLogo.php?new=t&dir="+dir,
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
             //   // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
            // alert("Error uploading the following image: " + file.name);
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                dir: dir
            };
            $.ajax({
                type: "POST",
                url: "./html/uploadCompanyLogo.php?delete=true",
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        // alert("Image has been removed: " + name);
                    }
                }
            });
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}

//Function to populate the list of available services in addBusiness.html
function addBsnServiceList(){
    document.getElementById('addBusinessServices').innerHTML = populateServiceList();
}

//Function to populate the list of available processes in addBusiness.html
function addBsnProcessList(){
    document.getElementById('addBusinessProcesses').innerHTML = populateProcessList();
}

//Function to populate the list of available materials in addBusiness.html
function addBsnMaterialsList(){
    document.getElementById('addBusinessMaterials').innerHTML = populateMaterialsList();
}


function loadBsnCatForm(){

    if(matChecked.length > 0){
        var catDiv = "<h4>Materials</h4>";
        for(var i=0; i < matChecked.length; i++){

            catDiv += '<div class="col-md-3"><p style=" font-weight: bold">'+ matChecked[i][0]+'</p></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Model" id="modMat'+ matChecked[i][1] +'"name="modMat'+ matChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class= "form-control textField" placeholder="Application" id="appMat'+ matChecked[i][1]+'"name="appMat'+ matChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Limitation" id="limitMat'+ matChecked[i][1]+'"name="limitMat'+ matChecked[i][1]+'"></div>';
        }
        document.getElementById('bsnMatForm').innerHTML += catDiv;
    }

    if(procChecked.length > 0){
        catDiv = "<h4>Processes</h4>";
        for(var i=0; i < procChecked.length; i++){

            catDiv += '<div class="col-md-3"><p style=" font-weight: bold">'+ procChecked[i][0]+'</p></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Model" id="modProc'+ procChecked[i][1]+'"name="modProc'+ procChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class= "form-control textField" placeholder="Application" id="appProc'+ procChecked[i][1]+'"name="appProc'+ procChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Limitation" id="limitProc'+ procChecked[i][1]+'"name="limitProc'+ procChecked[i][1]+'"></div>';
        }
        document.getElementById('bsnProcForm').innerHTML += catDiv;
    }

    if(servChecked.length > 0){
        catDiv = "<h4>Services</h4>";
        for(var i=0; i < servChecked.length; i++){

            catDiv += '<div class="col-md-3"><p style=" font-weight: bold">'+ servChecked[i][0]+'</p></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Model" id="modServ'+ servChecked[i][1]+'"name="modServ'+ servChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class= "form-control textField" placeholder="Application" id="appServ'+ servChecked[i][1]+'"name="appServ'+ servChecked[i][1]+'"></div>' +
                '<div class="col-md-3"><input class="form-control textField" placeholder="Limitation" id="limitServ'+ servChecked[i][1]+'"name="limitServ'+ servChecked[i][1]+'"></div>';
        }
        document.getElementById('bsnServForm').innerHTML += catDiv;
    }
};

function getBsnExtraInputs(){
    var model;
    var app;
    var limit;
    if(matChecked.length > 0){
        for(var i=0; i < matChecked.length; i++){
            model = "modMat"+ matChecked[i][1];
            app = "appMat"+ matChecked[i][1];
            limit = "limitMat"+ matChecked[i][1];
            
           matChecked[i].push($.trim($('[name="'+model+ '"]').val()));
           matChecked[i].push($.trim($('[name="'+app+ '"]').val()));
           matChecked[i].push($.trim($('[name="'+limit+ '"]').val()));
        }
    }


    if(procChecked.length > 0) {
        for(i=0; i < procChecked.length; i++){
            model = "modProc"+ procChecked[i][1];
            app = "appProc"+ procChecked[i][1];
            limit = "limitProc"+ procChecked[i][1];

           
           procChecked[i].push($.trim($('[name="'+model+ '"]').val()));
           procChecked[i].push($.trim($('[name="'+app+ '"]').val()));
           procChecked[i].push($.trim($('[name="'+limit+ '"]').val()));
        }
    }

    if(servChecked.length > 0) {
        for(var i=0; i < servChecked.length; i++){
            model = "modServ"+ servChecked[i][1];
            app = "appServ"+ servChecked[i][1];
            limit = "limitServ"+ servChecked[i][1];

           servChecked[i].push($.trim($('[name="'+model+ '"]').val()));
           servChecked[i].push($.trim($('[name="'+app+ '"]').val()));
           servChecked[i].push($.trim($('[name="'+limit+ '"]').val()));
        }
    }

    var companyName = myForm.companyName.value;
    var description = myForm.description.value;
    var website = addhttp(myForm.website.value);
    var address = myForm.address.value;
    var city = myForm.city.value;
    var country = myForm.country.value;
    var zipcode = myForm.zipcode.value;
    var phone = myForm.phone.value;
    var email = myForm.email.value;
    var videoURL = myForm.videoURL.value;

    var geocoder = new google.maps.Geocoder();
    var addressLatLong = address + ', ' + city + ', ' + country;
    var latitudeAdd = '';
    var longitudeAdd = '';

    geocoder.geocode( { 'address': addressLatLong}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            latitudeAdd = results[0].geometry.location.lat();
            longitudeAdd = results[0].geometry.location.lng();
            console.log(currentAdmin + "\n" + companyName + "\n" + videoURL + "\n" + website + "\n" + phone + "\n" + description + "\n" +
                null + "\n" + email + "\n" + procChecked + "\n" + servChecked + "\n" +matChecked + "\n" +address + "\n" +  city + "\n" +
                country + "\n" + zipcode + "\n" + latitudeAdd + "\n" + longitudeAdd); }
        if(addingCompany == 1){
            console.log("Testing mod, app and limit null values: " + procChecked);
            addNewCompany(currentAdmin, companyName, videoURL, website, phone, description, null, email,
                procChecked,servChecked,matChecked,address, city, country, zipcode,latitudeAdd,longitudeAdd);
			executeDropzone(globalDropzone);
			if (addBsnType == '0'){
				//// alert("SubId: "+myForm.submissionId.value);
				executeDropzoneAux(myForm.submissionId.value,globalDropzone2);
			}else {
				executeDropzone(globalDropzone2);
			}
		}
        else {
            console.log("Testing mod, app and limit null values: " + procChecked);
            modifyCompany(myForm.companyId.value, companyName, videoURL, website, phone, description, null, email,
                procChecked,servChecked,matChecked,address, city, country, zipcode,latitudeAdd,longitudeAdd);
			executeDropzone(globalDropzone);
			executeDropzone(globalDropzone2);
		}

        // if(addBsnType == '0'){
            // deleteSubmission(myForm.submissionId.value);
        // }

    });
}
function executeDropzone(dzObj){
	var dataToSend = {
        dirinfo: GetCookie("userType")+GetCookie("userId")
		};
	$.ajax({
		url: './html/deletiontest.php',
		data: dataToSend,
		success: function (response) {
		  //  // alert("Folders Emptied!");
		//	// alert(dzObj);
			dzObj.processQueue();
			// if(GetCookie("userType") == 'admin'){
				// loadPage('controlPanel');
			// }else{
				// loadPage('goToMain');
			// }
			
		},
		error: function () {
			//// alert("Dropzone Execute ERROR!");
		}
	});
}

function executeDropzoneSubmission(dzObj){
    var dataToSend = {
        dirinfo: GetCookie("userType")+GetCookie("userId")
        };
    $.ajax({
        url: './html/deletiontest.php',
        data: dataToSend,
        success: function (response) {
            dzObj.processQueue();     
            loadPage('goToMain');
        },
        error: function () {
            //// alert("Dropzone Execute ERROR!");
        }
    });
}

function validateAddBsn(frm){
    var errorMessage = "";
    myForm = frm;

    getChboxSelected(frm,1,1,1);

    if((matChecked.length == 0) && (procChecked.length == 0) && (servChecked.length == 0)){
        errorMessage = "<br />Please select at least one material, process or service.";
    }

    if($.trim($("#addBsnDescription").val()) == ""){
        errorMessage = "<br />Please enter a description.";
    }

    if (!isValidEmailAddress($("#addBsnEmail").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid email address.";
    }

    if (!isValidPhone($("#addBsnPhone").val())) {
        errorMessage = "<br />Please enter a valid telephone number.";
    }

    if ((!isValidZipCode($("#addBsnZipCode").val())) || ($.trim($("#addBsnZipCode").val()) == "")) {
        errorMessage = "<br />Please enter a valid zipcode.";
    }

    if($.trim($("#addBsnCountry").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if($.trim($("#addBsnCity").val()) == ""){
        errorMessage = "<br />Please enter a valid city.";
    }

    if($.trim($("#addBsnAddress").val()) == ""){
        errorMessage = "<br />Please enter a valid address.";
    }

    if (!isValidWebsite($("#addBsnWebsite").val().toLowerCase()) || $.trim($("#addBsnWebsite").val()) == "") {
        errorMessage = "<br />Please enter a valid website.";
    }

    if($.trim($("#addBsnCompanyName").val()) == ""){
        errorMessage = "<br />Please enter a valid business name.";
    }

    if (errorMessage == "") {

        $("#addBsnPage").load('./html/addBusinessExtra.html', function(){
            loadBsnCatForm();
            addBsnType = 1;
        });
    }

    else {
        $("#error").html(errorMessage);
    }
}

function validateAddBsn2(frm){
    var errorMessage = "";
    myForm = frm;
    addingCompany = 1;
    addBsnType = 0;
    getChboxSelected(frm,1,1,1);

    if((matChecked.length == 0) && (procChecked.length == 0) && (servChecked.length == 0)){
        errorMessage = "<br />Please select at least one material, process or service.";
    }

    if($.trim($("#viewRequestDescription").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if (!isValidEmailAddress($("#viewRequestEmail").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid email address.";
    }

    if (!isValidPhone($("#viewRequestPhone").val())) {
        errorMessage = "<br />Please enter a valid telephone number.";
    }

    if ((!isValidZipCode($("#viewRequestZipCode").val())) || ($.trim($("#viewRequestZipCode").val()) == "")) {
        errorMessage = "<br />Please enter a valid zipcode.";
    }

    if($.trim($("#viewRequestCountry").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if($.trim($("#viewRequestCity").val()) == ""){
        errorMessage = "<br />Please enter a valid city.";
    }

    if($.trim($("#viewRequestAddress").val()) == ""){
        errorMessage = "<br />Please enter a valid address.";
    }

    if (!isValidWebsite($("#viewRequestWebsite").val().toLowerCase()) || ($.trim($("#viewRequestWebsite").val()) == "")) {
        errorMessage = "<br />Please enter a valid website.";
    }

    if($.trim($("#viewRequestName").val()) == ""){
        errorMessage = "<br />Please enter a valid business name.";
    }

    if (errorMessage == "") {

        $("#viewReqContainer").load('./html/addBusinessExtra.html', function(){
            loadBsnCatForm();
        });
    }

    else {
        $("#error").html(errorMessage);
    }
}


/******************************************************************************************************************
 addNewMaterial.html
 ******************************************************************************************************************/

//Function to load all dynamic lists in addNewMaterial.html
function loadAddNewMat(){
    addMatMaterialsList();
    addMatProcessConnections();
    addMatServiceConnections();

}

//Function that appears the connections lists once the user selects the sub-material field
function showMatConnections(){

    document.getElementById('procConn').style.display = 'block';
    document.getElementById('servConn').style.display = 'block';
    window.setTimeout(function(){
        document.getElementById('addProcServConnBtn').style.display = 'block';
    },500);

};

//Function that creates another field if the user selects "New Material" in the dropdown.
function addMat(){
    var ddl = document.getElementById("matTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    //if "New Material" option is selected, a blank field appears.
    if (selectedValue == "addNewMat"){
        document.getElementById('newMat').innerHTML += '<input type="text" class="form-control" name="newMatField" placeholder="Enter New Material" id="newMaterialField">';
        $('#headerSubMatTtl').remove();
        $('#subMatModalList').remove();
        document.getElementById('subMatModalDiv').innerHTML += '<ul id="subMatModalList">Select a material to view their sub-materials</ul>';
    }

    //if any other option is selected, the blank field disappears if it is in the page. Also the help button is updated
    //with the list that contains the sub-materials of the selected material.
    else{
        $('#newMaterialField').remove();
        populateSubMatModalList();
    }

};

function addMatMaterialsList(){
//    // alert("I'm getting materials and submaterials");

    var dataToSend = {
        endpoint: 'material',
        code: '1'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = '<option value="none" disabled selected>Choose One Material</option>' +
                "<option id=\"addNewMat\" value=\"addNewMat\">New Material</option>";

            for(var i=0; i < response.length; i++){
                html1 = html1 +
                    "<option value=\""+ response[i].materialId +"\">" + response[i].materialName + "</option>";
            }
            document.getElementById('matTypes').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });


}

//Function that populates the dropdown list with all available materials
function addMatServiceConnections(){
    document.getElementById('servCons').innerHTML = populateServiceList2();
}

//Function that populates the process connection list with all available processes
function addMatProcessConnections(){
    document.getElementById('procCons').innerHTML = populateProcessList2();
}

function populateSubMatModalList(){
    //// alert("I'm getting materials and submaterials");
    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var ddl = document.getElementById("matTypes");
            var selectedValue = ddl.options[ddl.selectedIndex].value;
            var selectedValueText = ddl.options[ddl.selectedIndex].text;
            var subMatNameList = "";

            $('#headerSubMatTtl').remove();
            document.getElementById('helpModalTitle').innerHTML += '<h4 class="modal-title" id="headerSubMatTtl">'+selectedValueText+'</h4>';
            $('#subMatModalList').remove();

            for(var i=0; i < response.length; i++){
                if (selectedValue == response[i].materialId) {
                    subMatNameList += '<li>'+ response[i].subMaterialName + '</li>';
                }
            }
            document.getElementById('subMatModalDiv').innerHTML += '<ul id="subMatModalList">' +
                subMatNameList + '</ul>';

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}


function validateAddNewMat(frm){

    var errorMessage = "";
    var ddl = document.getElementById("matTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    var newMat;
    var newSubMat = frm.newSubMat.value;

    if (selectedValue == "addNewMat"){
        newMat = frm.newMatField.value;
    }

    else{
        newMat = selectedValue;
    }

    if($.trim($("#newSubMat").val()) == ""){
        errorMessage = "<br />Please enter a sub-material.";
    }

    if((selectedValue == "addNewMat") && ($.trim($("#newMaterialField").val()) == "")){
        errorMessage = "<br />Please enter a material type.";
    }

    if(selectedValue == "none"){
        errorMessage = "<br />Please select a material type.";
    }

    if (errorMessage == "") {

        getChboxSelected2(frm,0,1,1);

        if((selectedValue == "addNewMat")){
            console.log(servChecked+"\n"+procChecked+"\n"+newMat+"\n"+newSubMat);
            addNewMaterial(servChecked, procChecked,newMat,newSubMat);
        }
        else{

            console.log(newMat+"\n"+servChecked+"\n"+procChecked+"\n"+newSubMat);
            addNewSubmaterial(newMat,servChecked, procChecked,newSubMat);
        }
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 addNewProcess.html
 ******************************************************************************************************************/
function loadAddNewProc(){
    addProcProcessList();
    addProcMaterialsConnections();
    addProcServiceConnections();
};

function showProcConnections(){

    document.getElementById('matConn').style.display = 'block';
    document.getElementById('servConn').style.display = 'block';
    window.setTimeout(function(){
        document.getElementById('addMatServConnBtn').style.display = 'block';
    },500);

};

function addProc(){
    var ddl = document.getElementById("procTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    //if "New Process" option is selected, a blank field appears.
    if (selectedValue == "addNewProc"){
        document.getElementById('newProc').innerHTML += '<input type="text" class="form-control" name="newProcField" placeholder="Enter New Process" id="newProcessField">';
        $('#headerSubProcTtl').remove();
        $('#subProcModalList').remove();
        document.getElementById('subProcModalDiv').innerHTML += '<ul id="subProcModalList">Select a process to view their sub-processes</ul>';
    }


    //if any other option is selected, the blank field disappears if it is in the page. Also the help button is updated
    //with the list that contains the sub-processes of the selected process.
    else{
        $('#newProcessField').remove();
        populateSubProcModalList();
    }

};

function addProcProcessList(){
//    // alert("I'm getting materials and submaterials");

    var dataToSend = {
        endpoint: 'process',
        code: '1'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = '<option value="none" disabled selected>Choose One Process</option>' +
                "<option id=\"addNewProc\" value=\"addNewProc\">New Process</option>";

            for(var i=0; i < response.length; i++){
                html1 = html1 +
                    "<option value=\""+ response[i].processId +"\">" + response[i].processName + "</option>";
            }
            document.getElementById('procTypes').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function addProcServiceConnections(){
    document.getElementById('servCons').innerHTML = populateServiceList2();
};

function addProcMaterialsConnections(){
    document.getElementById('matCons').innerHTML = populateMaterialsList2();
};

function populateSubProcModalList(){

//    // alert("I'm getting materials and subprocess");

    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var ddl = document.getElementById("procTypes");
            var selectedValue = ddl.options[ddl.selectedIndex].value;
            var selectedValueText = ddl.options[ddl.selectedIndex].text;
            var subProcNameList = "";

            $('#headerSubProcTtl').remove();
            document.getElementById('helpModalTitle').innerHTML += '<h4 class="modal-title" id="headerSubProcTtl">'+selectedValueText+'</h4>';
            $('#subProcModalList').remove();

            for(var i=0; i < response.length; i++){
                if (selectedValue == response[i].processId) {
                    subProcNameList += '<li>'+ response[i].subProcessName + '</li>';
                }
            }
            document.getElementById('subProcModalDiv').innerHTML += '<ul id="subProcModalList">'
                + subProcNameList + '</ul>';

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function validateAddNewProc(frm){
    var errorMessage = "";
    var ddl = document.getElementById("procTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    var newProc;
    var newSubProc = frm.newSubProc.value;

    if (selectedValue == "addNewProc"){
        newProc = frm.newProcField.value;
    }

    else{
        newProc = selectedValue;
    }

    if($.trim($("#newSubProc").val()) == ""){
        errorMessage = "<br />Please enter a sub-process.";
    }

    if((selectedValue == "addNewProc") && ($.trim($("#newProcessField").val()) == "")){
        errorMessage = "<br />Please enter a process type.";
    }

    if(selectedValue == "none"){
        errorMessage = "<br />Please select a process type.";
    }

    if (errorMessage == "") {
        getChboxSelected2(frm,1,0,1);

        if((selectedValue == "addNewProc")){
            console.log(matChecked+"\n"+servChecked+"\n"+newProc+"\n"+newSubProc);
            addNewProcess(matChecked,servChecked,newProc,newSubProc);
        }
        else{
            console.log(matChecked +"\n"+servChecked+"\n"+newProc+"\n"+newSubProc);
            addNewSubprocess(matChecked,servChecked,newProc,newSubProc);
        }
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 addNewService.html
 ******************************************************************************************************************/

function loadAddNewServ(){
    addServServiceList();
    addServMaterialsConnections();
    addServProcessConnections();
}

function showServConnections(){

    document.getElementById('matConn').style.display = 'block';
    document.getElementById('procConn').style.display = 'block';
    window.setTimeout(function(){
        document.getElementById('addMatProcConnBtn').style.display = 'block';
    },500);

}

function addServ(){
    var ddl = document.getElementById("servTypes");

    var selectedValue = ddl.options[ddl.selectedIndex].value;

    var html = "";

    if (selectedValue == "addNewServ"){
        document.getElementById('newServ').innerHTML += '<input type="text" class="form-control" name="newServField" placeholder="Enter New Service" id="newServiceField">';
        $('#headerSubServTtl').remove();
        $('#subServModalList').remove();
        document.getElementById('subServModalDiv').innerHTML += '<ul id="subServModalList">Select a service to view their sub-services</ul>';
    }

    else{
        $('#newServiceField').remove();
        populateSubServModalList();
    }

}

function addServServiceList(){
//    // alert("I'm getting materials and submaterials");

    var dataToSend = {
        endpoint: 'service',
        code: '1'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "<option value=\"none\" disabled selected>Choose One Service</option>" +
                "<option id=\"addNewServ\" value=\"addNewServ\">New Service</option>";

            for(var i=0; i < response.length; i++){
                html1 = html1 +
                    "<option value=\""+ response[i].serviceId +"\">" + response[i].serviceName + "</option>";
            }
            document.getElementById('servTypes').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}


function addServProcessConnections(){
    document.getElementById('procCons').innerHTML = populateProcessList2();
};


function addServMaterialsConnections(){
    document.getElementById('matCons').innerHTML = populateMaterialsList2();
}

function populateSubServModalList(){
//    // alert("I'm getting services and subservices");

    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var ddl = document.getElementById("servTypes");
            var selectedValue = ddl.options[ddl.selectedIndex].value;
            var selectedValueText = ddl.options[ddl.selectedIndex].text;
            var subServNameList = "";

            $('#headerSubServTtl').remove();
            document.getElementById('helpModalTitle').innerHTML += '<h4 class="modal-title" id="headerSubServTtl">'+selectedValueText+'</h4>';
            $('#subServModalList').remove();

            for(var i=0; i < response.length; i++){
                if (selectedValue == response[i].serviceId) {
                    subServNameList += '<li>'+ response[i].subServiceName + '</li>';
                }
            }
            document.getElementById('subServModalDiv').innerHTML += '<ul id="subServModalList">' + subServNameList + '</ul>';
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function validateAddNewServ(frm){
    var errorMessage = "";
    var ddl = document.getElementById("servTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    var newServ;
    var newSubServ = frm.newSubServ.value;

    if (selectedValue == "addNewServ"){
        newServ = frm.newServField.value;
    }

    else{
        newServ = selectedValue;
    }

    if($.trim($("#newSubServ").val()) == ""){
        errorMessage = "<br />Please enter a sub-service.";
    }

    if((selectedValue == "addNewServ") && ($.trim($("#newServiceField").val()) == "")){
        errorMessage = "<br />Please enter a service type.";
    }

    if(selectedValue == "none"){
        errorMessage = "<br />Please select a service type.";
    }

    if (errorMessage == "") {
        getChboxSelected2(frm,1,1,0);

        if((selectedValue == "addNewServ")){
            console.log(matChecked+"\n"+procChecked+"\n"+newServ+"\n"+newSubServ);
            addNewService(matChecked,procChecked,newServ,newSubServ);
        }
        else{
            console.log(matChecked+"\n"+newServ+"\n"+procChecked+"\n"+newSubServ);
            addNewSubservice(matChecked, newServ, procChecked,newSubServ);
        }
    }

    else {
        $("#error").html(errorMessage);
    }
}
/******************************************************************************************************************
 adminControlPanel.html
 ******************************************************************************************************************/

function loadControlPanel(){
    userType();
    showAddBusinessMain();
    requestsLabel();
    hideAddAdmin(GetCookie("adminType"));
}

function requestsLabel(){
    var dataToSend = {
        endpoint: 'submissions',
        code: '4'
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            document.getElementById('badgeCount').innerHTML = response[0].number;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function hideAddAdmin(adminType){
    if(adminType == 'Super Admin'){
        document.getElementById('manageAdmin').innerHTML+= "<h4>Manage Administrator</h4><ul class=\"subOptions\">" +
            "<li onclick=\"loadPage(\'addAdmin\')\"><a>Add</a></li>" +
            "<li onclick=\"loadPage(\'removeAdmin\')\"><a>Remove</a></li>";
    }
}

/******************************************************************************************************************
 editAccount.html
 ******************************************************************************************************************/


function loadEditAccount(){
    var userId = GetCookie("userId");
    var dataToSend;

    if(GetCookie("userType")=='regular'){
        dataToSend = {
            endpoint: 'users',
            code: '1',
            uid : userId };
    }
    else{
        dataToSend = {
            endpoint: 'admin',
            code: '1',
            aid: userId };
    }


    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var firstName = response[0].firstName;
            var lastName = response[0].lastName;
            globalEmail = response[0].email;
            var occupation= response[0].occupation;
            var city= response[0].city;

            document.getElementById("editAccFirstName").value = firstName;
            document.getElementById("editAccLastName").value = lastName;
            document.getElementById("editAccOccupation").value = occupation;
            document.getElementById("editAccCity").value = city;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

}

function validateEditAccount(frm){
    var errorMessage = "";
    var userId = GetCookie('userId');
    var fName = frm.firstname.value;
    var lName = frm.lastnames.value;
    var occupation = frm.occupation.value;
    var city = frm.city.value;

    if (($("#editAccPass1").val() != $("#editAccPass2").val())) {

        errorMessage += "<br />Passwords does not match.";
    }

    if($.trim($("#editAccLastName").val()) == ""){

        errorMessage = "<br />Please enter a valid last name.";
    }

    if($.trim($("#editAccFirstName").val()) == ""){

        errorMessage = "<br />Please enter a valid first name.";
    }

    if (errorMessage == "") {
        if(GetCookie("userType")== "regular"){
            console.log($.trim($("#editAccPass1").val()));
            if(($.trim($("#editAccPass1").val()) != "") && ($.trim($("#editAccPass2").val()) != "")){
//            console.log("Changing User password: " + email1+ "\n" +password+ "\n" +userId);
                changeUserPassword(globalEmail, frm.pass1.value, userId);
            }
//            console.log("Modifiying user account: " + userId + "\n" + "\n" + fName+ "\n" + lName+ "\n" + occupation+ "\n" + city);
            modifyUser(userId, fName, lName, occupation, city);
        }

        else{
            console.log($.trim($("#editAccPass1").val()));
            if(($.trim($("#editAccPass1").val()) != "") && ($.trim($("#editAccPass2").val()) != "")){
//              console.log("Changing User password: " + email1+ "\n" +password+ "\n" +userId);
                changeAdminPassword(globalEmail, frm.pass1.value, userId);
            }
//              console.log("Modifiying admin account: " + id + "\n" + fName+ "\n" + lName+ "\n" + occupation+ "\n" + city);
            modifyAdmin(userId, fName, lName, occupation, city);
        }
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 editArticle.html
 ******************************************************************************************************************/

function dropzoneEditArticlePic(id){
Dropzone.autoDiscover = false;
    var nid = id;//3;
	var dir = "pic"+GetCookie("userType")+GetCookie("userId");
    var myDropzone = new Dropzone("#dropzone-edit-article-photo", {
        url: "./html/dumpNewsImage.php?new=f&nid="+nid+"&dir="+dir,
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
             //   // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
            // alert("Error uploading the following image: " + file.name);
        },
		init: function() {
            thisDropzone = this;
            $.get('./html/dumpNewsImage.php?new=f&nid='+nid+'&dir='+dir, function(data) {
                $.each(data, function(key,value){
                    var mockFile = { name: value.name, size: value.size  };
                    thisDropzone.emit("addedfile", mockFile);
                    thisDropzone.emit("thumbnail", mockFile, "./html/"+dir+"/"+value.name);
                });
            });
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                nid: nid
            };
            $.ajax({
                type: "POST",
                url: "./html/dumpNewsImage.php?delete=true&dir="+dir,
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        // alert("Image has been removed: " + name);
                    }
                }
            });
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}

function validateEditArt(frm){
    var errorMessage = "";
    var nid = frm.newsId.value;
    var title = frm.title.value;
    var description = frm.description.value;

    if($.trim($("#editArticleDesc").val()) == ""){
        errorMessage = "<br />Please enter a valid description.";
    }

    if($.trim($("#editArticleTitle").val()) == ""){
        errorMessage = "<br />Please enter a valid title.";
    }

    if (errorMessage == "") {
        console.log(nid + "\n" + title + "\n" + description);
        updateNews(nid, title, description);
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 editArticleSelector.html
 ******************************************************************************************************************/

function showArticlesToEdit(){

    var dataToSend = {
        endpoint: 'news',
        code: '5'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            var html1 = "";
            for(var i=0; i < response.length; i++){
                html1 = html1 + '<tr>' +
                    '<td id="' + response[i].newsId +'"><input type="radio" name="row-1"></td>'+
                    '<td id="' + response[i].newsId + '">' + response[i].title + '</td>'+
                    '<td id="' + response[i].newsId +'">' + response[i].body +'</td></tr>';
            }
            document.getElementById('editArticleSelectList').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}


function getEditArtSelectorInputs(){
    var table = document.getElementById("editArticleTable");
    var rows = table.getElementsByTagName("tr");

    for(i = 1; i < rows.length; i++)
    {
        if(document.getElementById(rows[i].cells[0].id).getElementsByTagName("input")[0].checked){
            //// alert(document.getElementById(rows[i].cells[1].id).id);
            loadArticle(document.getElementById(rows[i].cells[1].id).id);
            break;
        }
    }

}

function loadArticle(id){
    $('#overallContainer').load('html/editArticle.html', function(){
        viewNews(id);
    });
}


/******************************************************************************************************************
 editBusiness.html
 ******************************************************************************************************************/


function populateEditBsnServiceList(){
    document.getElementById('editBusnServ').innerHTML = populateServiceList();
}

function populateEditBsnProcessList(){
    document.getElementById('editBusnProc').innerHTML = populateProcessList();
}

function populateEditBsnMaterialList(){
    document.getElementById('editBusnMat').innerHTML = populateMaterialsList();
}

function validateEditBsn(frm){

    var errorMessage = "";
    myForm = frm;

    getChboxSelected(frm,1,1,1);


    if((matChecked.length == 0) && (procChecked.length == 0) && (servChecked.length == 0)){
        errorMessage = "<br />Please select at least one material, process or service.";
    }

    if (!isValidEmailAddress($("#editBsnEmail").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid email address.";
    }

    if (!isValidPhone($("#editBsnTelephone").val())) {

        errorMessage = "<br />Please enter a valid telephone number.";
    }

    if ((!isValidZipCode($("#editBsnZipCode").val())) || ($.trim($("#editBsnZipCode").val()) == "")) {
        errorMessage = "<br />Please enter a valid zipcode.";
    }

    if($.trim($("#editBsnCountry").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if($.trim($("#editBsnCity").val()) == ""){
        errorMessage = "<br />Please enter a valid city.";
    }

    if($.trim($("#editBsnAddress").val()) == ""){
        errorMessage = "<br />Please enter a valid address.";
    }

    if (!isValidWebsite($("#editBsnWebsite").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid website.";
    }

    if($.trim($("#editBsnName").val()) == ""){
        errorMessage = "<br />Please enter a valid business name.";
    }

    if (errorMessage == "") {

        $("#editBsnPage").load('./html/addBusinessExtra.html', function(){
            loadBsnCatForm();
            var matTemp = [];
            var servTemp = [];
            var procTemp = [];

            for(var i = 0; i < matChecked.length; i++){
                matTemp.push(matChecked[i][1]);
            }

            for(var i = 0; i < procChecked.length; i++){
                procTemp.push(procChecked[i][1]);
            }

            for(var i = 0; i < servChecked.length; i++){
                servTemp.push(servChecked[i][1]);
            }
            if(matTemp.length > 0){
			businessExtraInfo(myForm.companyId.value, matTemp,'subMaterial');
            }
            if(procTemp.length > 0){
			businessExtraInfo(myForm.companyId.value, procTemp,'subProcess');
            }
            if(servTemp.length > 0){
			businessExtraInfo(myForm.companyId.value, servTemp,'subService');
			}
			
        });
    }

    else {
        $("#error").html(errorMessage);
    }
}

function dropzoneEditBusPhoto(id){
    Dropzone.autoDiscover = false;
    var cid = id;//16;
	var dir = "img"+GetCookie("userType")+GetCookie("userId");
    var myDropzone2 = new Dropzone("#dropzone-edit-photos", {
        url: "./html/dumpCompanyImage.php?new=f&cid="+cid+"&dir="+dir,
        addRemoveLinks: true,
        uploadMutiple: true,
        parallelUploads: 5,
        maxFileSize: 1,
        maxFiles: 5,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
             //   // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
            // alert("Error uploading the following image: " + file.name);
        },
        init: function() {
            thisDropzone2 = this;
            $.get('./html/dumpCompanyImage.php?new=f&cid='+cid+'&dir='+dir, function(data) {
                $.each(data, function(key,value){
                    var mockFile = { name: value.name, size: value.size  };
                    thisDropzone2.emit("addedfile", mockFile);
                    thisDropzone2.emit("thumbnail", mockFile, "./html/"+dir+"/"+value.name);
                });
            });
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                cid: cid
            };
            $.ajax({
                type: "POST",
                url: "./html/dumpCompanyImage.php?delete=true&dir="+dir,
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        // alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}

function dropzoneEditBusLogo(id){
        Dropzone.autoDiscover = false;
    var cid = id;//16;
	var dir = "logo"+GetCookie("userType")+GetCookie("userId");
    var myDropzone = new Dropzone("#dropzone-edit-logo", {
        url: "./html/dumpLogoImage.php?new=f&cid="+cid+"&dir="+dir,
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
             //   // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
          //  // alert("Error uploading the following image: " + file.name);
        },
		init: function() {
            thisDropzone = this;
            $.get('./html/dumpLogoImage.php?new=f&cid='+cid+'&dir='+dir, function(data) {
                $.each(data, function(key,value){
                    var mockFile = { name: value.name, size: value.size  };
                    thisDropzone.emit("addedfile", mockFile);
                    thisDropzone.emit("thumbnail", mockFile, "./html/"+dir+"/"+value.name);
                });
            });
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                cid: cid
            };
            $.ajax({
                type: "POST",
                url: "./html/dumpLogoImage.php?delete=true+&dir="+dir,
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                    //    // alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}
/******************************************************************************************************************
 editBusinessSelector.html
 ******************************************************************************************************************/


function showBusinessesToEdit(){
    var dataToSend = {
        endpoint: 'company',
        code: '0'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            var html1;
            for(var i=0; i < response.length; i++){
                var html1 = "";
                for(var i=0; i < response.length; i++){
                    html1 = html1 + '<tr>' +
                        '<td id=' + response[i].companyId +'><input type="radio" name="row-1"></td>'+
                        '<td id=' + response[i].companyId + '>' + response[i].companyName + '</td>'+
                        '<td id="desc_' + response[i].companyName + '">' + response[i].description + '</td>'+
                        '<td id="city_' + response[i].companyName +'">' + response[i].city +'</td></tr>';
                }

            }
            document.getElementById('editBsnSelectList').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getEditBsnSelectorInputs(){
    var table = document.getElementById("editBsnTable");
    var rows = table.getElementsByTagName("tr");

    for(i = 1; i < rows.length; i++)
    {
        if(document.getElementById(rows[i].cells[0].id).getElementsByTagName("input")[0].checked){
            //// alert(document.getElementById(rows[i].cells[1].id).id);
            loadCompany(document.getElementById(rows[i].cells[1].id).id);
            break;
        }
    }
}


function loadCompany(id){
    console.log("ID #1: " + id);
    $('#overallContainer').load('html/editBusiness.html', function(){
        console.log("ID #2: " + id);
//        viewSubmission(id);
        getCompanyInfo(id);
        populateEditBsnServiceList();
        populateEditBsnProcessList();
        populateEditBsnMaterialList();
        getEditSubmaterials(id);
        getEditSubProcesses(id);
        getEditSubServices(id);
		dropzoneEditBusPhoto(id);
		dropzoneEditBusLogo(id);
		globalDropzone = Dropzone.forElement("#dropzone-edit-photos");
		globalDropzone2 = Dropzone.forElement("#dropzone-edit-logo");
    });
}

function populateEditBsnServiceList(){
    document.getElementById('editBusnServ').innerHTML = populateServiceList();
}

function populateEditBsnProcessList(){
    document.getElementById('editBusnProc').innerHTML = populateProcessList();
}

function populateEditBsnMaterialList(){
    document.getElementById('editBusnMat').innerHTML = populateMaterialsList();
}


/******************************************************************************************************************
 editMaterialConnections.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in editMaterialConnections.html
function loadEditMatConn(){
    populateEditMatMatList();
    populateEditMatProcConn();
    populateEditMatServConn();
}


function populateEditMatMatList(){
//    // alert("I'm getting materials and submaterials");

    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            var html1 = '<option value="none" disabled selected>Choose One Material</option>';
            var html2 = "";
            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<optgroup label="'+ response[i].materialName +'">';
                html2 += '<option value="'+response[i].subMaterialId+'">'+ response[i].subMaterialName + '</option>';

                if (i != (response.length - 1))
                    while (response[i + 1].materialId == response[i].materialId) {
                        i++;
                        html2 += '<option value="'+response[i].subMaterialId+'">'+ response[i].subMaterialName + '</option>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('editMatTypes').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          //  // alert("Server Not Found: Please Try Again Later!");
        }
    });
};

//Script for dynamically populating the Service list
function populateEditMatServConn(){
    document.getElementById('editMatServCons').innerHTML = populateServiceList2();
}


function populateEditMatProcConn(){
    document.getElementById('editMatProcCons').innerHTML = populateProcessList2();
};


function validateEditMatConn(frm){

    var errorMessage = "";
    var ddl = document.getElementById("editMatTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    getChboxSelected2(frm,0,1,1);


    if(selectedValue == "none"){
        errorMessage = "<br />Please select a material type.";
    }

    if (errorMessage == "") {
        console.log(selectedValue + "\n" + procChecked + "\n" + servChecked);
        changeSubmaterialConnection(parseInt(selectedValue),servChecked, procChecked);
    }

    else {
        $("#error").html(errorMessage);
    }
}
/******************************************************************************************************************
 editProcessConnections.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in editProcessConnections.html
function loadEditProcConn(){
    populateEditProcProcList();
    populateEditProcMatConn();
    populateEditProcServConn();
}

function populateEditProcProcList(){

//    // alert("I'm getting materials and subprocess");

    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = '<option value="none" disabled selected>Choose One Process</option>';
            var html2 = "";
            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<optgroup label="'+ response[i].processName +'">';
                html2 += '<option value="'+response[i].subProcessId+'">'+ response[i].subProcessName + '</option>';

                if (i != (response.length - 1))
                    while (response[i + 1].processId == response[i].processId) {
                        i++;
                        html2 += '<option value="'+response[i].subProcessId+'">'+ response[i].subProcessName + '</option>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }

            document.getElementById('editProcTypes').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
        //    // alert("Server Not Found: Please Try Again Later!");
        }
    });
};

//Script for dynamically populating the Services list
function populateEditProcServConn(){
    document.getElementById('editProcServCons').innerHTML = populateServiceList2();
}


function populateEditProcMatConn(){
    document.getElementById('editProcMatCons').innerHTML = populateMaterialsList2();
}


function validateEditProcConn(frm){

    var errorMessage = "";
    var ddl = document.getElementById("editProcTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    getChboxSelected2(frm,1,0,1);

    if(selectedValue == "none"){
        errorMessage = "<br />Please select a process type.";
    }

    if (errorMessage == "") {
        console.log(selectedValue + "\n" + matChecked + "\n" + servChecked);
        changeSubprocessConnection(matChecked,servChecked,parseInt(selectedValue));
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 editServiceConnections.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in editServiceConnections.html
function loadEditServConn(){
    populateEditServServList();
    populateEditServMatConn();
    populateEditServProcConn();
}

function populateEditServServList(){
//    // alert("I'm getting services and subservices");

    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

           var response = data.resp;
            var html1 = '<option value="none" disabled selected>Choose One Service</option>';
            var html2 = "";
            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<optgroup label="'+ response[i].serviceName +'">';
                html2 += '<option value="'+response[i].subServiceId+'">'+ response[i].subServiceName + '</option>';

                if (i != (response.length - 1))
                    while (response[i + 1].serviceId == response[i].serviceId) {
                        i++;
                        html2 += '<option value="'+response[i].subServiceId+'">'+ response[i].subServiceName + '</option>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('editServTypes').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });


}

//Script for dynamically populating the Services list
function populateEditServProcConn(){
    document.getElementById('editServProcCons').innerHTML = populateProcessList2();
}


function populateEditServMatConn(){
    document.getElementById('editServMatCons').innerHTML = populateMaterialsList2();
};


function validateEditServConn(frm){

    var errorMessage = "";
    var ddl = document.getElementById("editServTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;

    getChboxSelected2(frm,1,1,0);


    if(selectedValue == "none"){
        errorMessage = "<br />Please select a service type.";
    }

    if (errorMessage == "") {
        console.log(selectedValue+"\n"+procChecked+"\n"+matChecked);
        changeSubserviceConnection(matChecked,parseInt(selectedValue),procChecked);
    }

    else {
        $("#error").html(errorMessage);
    }
}
/******************************************************************************************************************
 login.html
 ******************************************************************************************************************/

function validateLogin(frm){
    var email = frm.loginEmail.value;
    var password = frm.loginPass.value;

    var dataToSend = {
        endpoint: 'users',
        code: '0',
        uemail: email,
        upass: password
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            //document.getElementById("answer").innerHTML = JSON.stringify(response);

            var errorMessage = "";

            cookiesEnableTest();

             if (GetCookie("test") != "test") {
                errorMessage = "<br />Cookies must be enabled in order to login.";
                $("#error").html(errorMessage);
                return;
            }

            if (!isValidEmailAddress($("#loginEmail").val().toLowerCase())) {
                errorMessage = "<br />Please enter a valid email address.";
                $("#error").html(errorMessage);
                return;
            }

            if(response.length == 0){
                $("#error").html('Wrong email or password');

            }
            else if($("#loginEmail").val() == response[0].email){
                setUserCookie(response[0].userId);
                return;
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};


/******************************************************************************************************************
 loginAdmin.html
 ******************************************************************************************************************/

function validateAdminLogin(frm){

    var email = frm.adminLoginEmail.value;
    var password = frm.adminLoginPass.value;


    var dataToSend = {
        endpoint: 'admin',
        code: '1',
        aemail: email,
        apass: password
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            //document.getElementById("answer").innerHTML = JSON.stringify(response);

            var errorMessage = "";

             cookiesEnableTest();

             if (GetCookie("test") != "test") {
                errorMessage = "<br />Cookies must be enabled in order to login.";
                $("#error").html(errorMessage);
                return;
            }
            if (!isValidEmailAddress($("#adminLoginEmail").val().toLowerCase())) {
                errorMessage = "<br />Please enter a valid email address.";
                $("#error").html(errorMessage);
                return;
            }
			if(response.length == 0){
				errorMessage = "<br />Wrong email or password.";
				$("#error").html(errorMessage);
				return;
			}
			
			if($("#adminLoginEmail").val() == response[0].email){
                setAdminCookie(response[0].adminTypeName, response[0].adminId);
                return;
            }

            
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

/******************************************************************************************************************
 pendingRequest.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in pendingRequest.html
function loadPendingRequest(){
    showPendingRequests();
}

function getPendingRequestRadio(){
    var table = document.getElementById("pendingRequestTable");
    var rows = table.getElementsByTagName("tr");
    for(i = 1; i < rows.length; i++)
    {
        temp = [];


        if(document.getElementById(rows[i].cells[0].id).getElementsByTagName("input")[0].checked){
            console.log(document.getElementById(rows[i].cells[1].id).id);
            loadSubmission(document.getElementById(rows[i].cells[1].id).id);
            break;
        }
    }

}

function loadSubmission(id){
    console.log("ID #1: " + id);
    $('#overallContainer').load('html/viewRequest.html', function(){
        populateViewReqServiceList();
        populateViewReqProcessList();
        populateViewReqMaterialList();
        console.log("ID #2: " + id);
        viewSubmission(id);
		dropzonePhotos();
		dropzoneSubLogo(id);
		globalDropzone = Dropzone.forElement("#dropzone-photos");
		globalDropzone2 = Dropzone.forElement("#dropzone-sub-logo");
        changeStateOfSubmission(id);
    });
}

function dropzoneSubLogo(id){
    Dropzone.autoDiscover = false;
    var subid = id;//1 for test
	var dir = "sublogo"+GetCookie("userType")+GetCookie("userId");
    var myDropzone = new Dropzone("#dropzone-sub-logo", {
        url:  "./html/dumpSubLogoImage.php?new=t&subid="+subid+"&dir="+dir, 
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
             //   // alert("The following image has been uploaded suscessfully: " + file.name);
            }
        },
        error: function(){
          //  // alert("Error uploading the following image: " + file.name);
        },
		init: function() {
            thisDropzone = this;
            $.get('./html/dumpSubLogoImage.php?new=t&subid='+subid+'&dir='+dir, function(data) {
                $.each(data, function(key,value){
                    var mockFile = { name: value.name, size: value.size };
                    thisDropzone.emit("addedfile", mockFile);
                    thisDropzone.emit("thumbnail", mockFile, "./html/"+dir+"/"+value.name);
                });
            });
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                subid: subid
            };
            $.ajax({
                type: "POST",
                url: "./html/dumpSubLogoImage.php?delete=true&dir="+dir,
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                     //   // alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}

function showPendingRequests(){
    var dataToSend = {
        endpoint: 'submissions',
        code: '0'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var status;

            for(var i=0; i < response.length; i++){
                if(response[i].submissionStatus == 1){
                    status = "New"
                }
                else{
                    status = "Pending"
                }
                html1 = html1 + "<tr>"+
                    '<td id=' + response[i].submissionId + '><input type="radio" name="row-1" ></td>'+
                    "<td id="+ response[i].submissionId  +">" + response[i].companyName + "</td>"+
                    "<td> " + status +"</td>"+
                    "<td>"+ response[i].submissionDate +"</td>"+
                    "</tr>";
            }

            document.getElementById('requestsList').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          //  // alert("Server Not Found: Please Try Again Later!");
        }
    });


};
function executeDropzoneAux(subid,dzObj){
	var dataToSend = {
        dirinfo: GetCookie("userType")+GetCookie("userId")
		};
	$.ajax({
            url: './html/deletiontest.php',
            data: dataToSend,
			success: function (response) {
              //  // alert("Folders Emptied!");
				if(dzObj.getQueuedFiles().length == 0){
			//		// alert("Calling Aux!");
					dropzoneSubLogoAux(subid);	
				}else {
			//		// alert("Processing Queue!");
					dzObj.processQueue();
					deleteSubmission(subid);
					}
					
				//loadPage('controlPanel');	
            },
            error: function () {
                //// alert("ERROR!");
            }
        });
}

function dropzoneSubLogoAux(subid){
	$.ajax({
		type: "POST",
		url: "./html/uploadSubLogoAux.php?subid="+subid, 
		success: function(){
			//// alert("Moved logo from the submission into the new company!");
			deleteSubmission(subid);
		},
		error: function(){
			//// alert("Error: Could not move Logo.");
		}
	});
}



/******************************************************************************************************************
 recoverPassword.html
 ******************************************************************************************************************/
function checkRecPassEmail(frm){

    var email = frm.recPassEmail.value;

    console.log("I'm looking user info by email: " + email);

    var dataToSend = {
        endpoint: 'users',
        code: '4',
        uemail: email
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            //document.getElementById("answer").innerHTML = JSON.stringify(response);

            if(response.length > 0){
                sendEmail(response[0].email, response[0].userId, response[0].firstName, 0);

            }
            else{
                var na = document.getElementById('passwordRecoverNotificationArea');
                na.innerHTML = "Email address is not in our system.";
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};


/******************************************************************************************************************
 recoverPasswordAdmin.html
 ******************************************************************************************************************/
function checkAdminRecPassEmail(frm){

    var email = frm.recAdminPassEmail.value;

    console.log("I'm looking admin info by email: " + email);

    var dataToSend = {
        endpoint: 'admin',
        code: '4',
        aemail: email
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            //document.getElementById("answer").innerHTML = JSON.stringify(response);

            if(response.length > 0){
                sendEmail(response[0].email, response[0].adminId, response[0].firstName, 1);
            }
            else{
                var na = document.getElementById('passwordRecoverAdminNotificationArea');
                na.innerHTML = "Email address is not in our system.";
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

function sendEmail(email, uid, fname, type) {

    var dataToSend0 = {
        remail: email,
        id: uid ,
        name: fname,
        rtype: type
    };

    $.ajax({
        url: "../Server/email.php",
        data: dataToSend0,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            //document.body.innerHTML = response[0].number;
            if(type == 0)
                loadPage('changePassword');
            else
                loadPage('changeAdminPassword');

        },

        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Testing Sending Email to Recover password");

        }
    });
};


/******************************************************************************************************************
 changePassword.html
 ******************************************************************************************************************/

function getChngPassInputs(frm){
    var msg = "";

    var email = frm.changePasswordEmail.value;
    var code = frm.changePasswordPasscode.value;
    var pass = frm.changePasswordPass1.value;

    msg += 'Email: ' + email +'\nCode: ' +code;

    var errorMessage = "";

    if (!isValidEmailAddress($("#changePasswordEmail").val().toLowerCase())) {

        errorMessage = "<br />Please enter a valid email address.";
    }

    if ($("#changePasswordPass1").val() != $("#changePasswordPass2").val()) {

        errorMessage = errorMessage + "<br />Passwords does not match.";
    }

    if (errorMessage == "") {

        console.log(msg);
        verifyPasscode(email, code, pass);
    }

    else {
        $("#error").html(errorMessage);
    }

}

function verifyPasscode(email,code, pass){

    console.log("I'm verifying passcode for " + email);

    var dataToSend = {
        endpoint: 'users',
        code: '3',
        passcode: code,
        uemail: email,
        utype: 0
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            if(response.length > 0){

                recoverUserPassword(email, pass, response[0].userId);
            }
            else{
                $("#error").html("Invalid Email or Passcode");
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

}



function recoverUserPassword(email,pass,id){
    console.log("I'm recovering password for " + email);

    var dataToSend = {
        endpoint: 'users',
        code: '3',
        du: true,
        multi: true,
        uemail: email,
        upass: pass,
        uid: id,
        type: 0
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('goToMain');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};


/******************************************************************************************************************
 changeAdminPassword.html
 ******************************************************************************************************************/

function getChngAdminPassInputs(frm){
    var msg = "";

    var email = frm.changeAdminPasswordEmail.value;
    var pass = frm.changeAdminPasswordPass1.value;
    var code = frm.changeAdminPasswordPasscode.value;

    msg += 'Email: ' + email +'\nCode: ' +code;
    var errorMessage = "";
    //

    function isValidEmailAddress(emailAddress) {

        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

        return pattern.test(emailAddress);
    };

    if (!isValidEmailAddress($("#changeAdminPasswordEmail").val().toLowerCase())) {

        errorMessage = "<br />Please enter a valid email address.";
    }

    if ($("#changeAdminPasswordPass1").val() != $("#changeAdminPasswordPass2").val()) {

        errorMessage = errorMessage + "<br />Passwords does not match.";
    }

    if (errorMessage == "") {
        console.log(msg);
        verifyAdminPasscode(email, code, pass);
    }

    else {
        $("#error").html(errorMessage);
    }

}


function verifyAdminPasscode(email,code, pass){

    console.log("I'm verifying passcode for " + email);

    var dataToSend = {
        endpoint: 'users',
        code: '3',
        passcode: code,
        uemail: email,
        utype: 1
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
//            // alert(JSON.stringify(response));
            if(response.length > 0){
                recoverAdminPassword(email, pass, response[0].userId);
            }
            else{
                $("#error").html("Invalid Email or Passcode");
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

}

function recoverAdminPassword(email,pass,id){
    console.log("I'm recovering password for admin " + email);

    var dataToSend = {
        endpoint: 'admin',
        code: '3',
        du: true,
        multi: true,
        aemail: email,
        aid: id,
        apass: pass,
        type: 1
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('goToMain');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};


/******************************************************************************************************************
 register.html
 ******************************************************************************************************************/


function validateResgister(frm){
    var errorMessage = "";
	var fName = frm.firstname.value;
    var lName = frm.lastnames.value;
    var email = frm.email.value;
    var pass = frm.pass1.value;
    var occupation = frm.occupation.value;
    var birth = frm.birthdate.value;
    var city = frm.city.value;

    var dataToSend = {
        endpoint: 'users',
        code: '4',
        uemail: email
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;       
            if(response.length != 0){
                console.log("hey esta empty");
                errorMessage = "<br />The email entered already exists. Please enter another email.";
            }

            if (!isValidEmailAddress($("#registerEmail").val().toLowerCase())) {
                errorMessage = "<br />Please enter a valid email address.";
            }
    

            if (($("#registerPass1").val() != $("#registerPass2").val()) || ($("#registerPass1").val() == "") || ($("#registerPass2").val() == "")){
                errorMessage = "<br />Passwords does not match.";
            }

            if($.trim($("#registerLast").val()) == ""){
                errorMessage = "<br />Please enter a valid last name.";
            }

            if($.trim($("#registerName").val()) == ""){
                errorMessage = "<br />Please enter a valid first name.";
            }

            if (!isValidBirthDate($("#registerBirth").val())) {

                errorMessage = "<br />Please enter a valid birth date in the format yyyy-mm-dd.";
            }

            if (errorMessage == "") {
               addNewUser(email,pass, fName, lName, occupation, birth, city); 
            }

            else {
                $("#error").html(errorMessage);
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
    
    
}


/******************************************************************************************************************
 removeAdministrator.html
 ******************************************************************************************************************/
var currentAdminsList = [];

function getAdmins() {
    currentAdminsList = [];

    console.log("Im in get Admins");
    var dataToSend1 = {
        endpoint: 'admin',
        code: '0' };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend1,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {


            $("#tags").autocomplete({
                source: currentAdminsList,
                focus: function (event, ui) {
                    event.preventDefault();
                    this.value = ui.item.label;
                },
                select: function (e, ui) {
                    e.preventDefault();
                    this.value = ui.item.label;
                    populateAdmin(ui.item.value);
                },
                minLength: 0
            });

            $('#tags').on('autocompleteselect', function (e, ui) {
                toDelete = ui.item.value;
                $("#adminInfoToRemove").css("display", "block");
            });

            var regList = data.resp;

            for (var i = 0, j = 0; i < regList.length; ++i, ++j) {

                var line = regList[i];
                var obj = {
                    label: line.firstName + " " + line.lastName,
                    value: line.adminId
                };

                currentAdminsList.push(obj);
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function getRemvAdmin(){
    deleteAdmin(toDelete);
}

function deleteAdmin(id){
    console.log("I'm deleting admin: " + id);

    var dataToSend = {
        endpoint: 'admin',
        code: '2',
        du: true,
        aid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            $('#viewReqModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            loadPage('controlPanel');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function populateAdmin(id){

    console.log("Im populating the admin!! " + id);

    var dataToSend1 = {
        endpoint: 'admin',
        code: '1',
        aid: id
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend1,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;

            document.getElementById('removeAdminName').innerHTML = response[0].firstName + " " + response[0].lastName ;
            document.getElementById('removeAdminEmail').innerHTML = response[0].email;


        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          //  // alert("Server Not Found: Please Try Again Later!");
        }
    });

}



/******************************************************************************************************************
 removeArticles.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in removeArticles.html
function loadRemoveArticles(){
    showArticlesToRemove();
}

function showArticlesToRemove(){
    var dataToSend = {
        endpoint: 'news',
        code: '5'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;

            var html1 = "";

            for(var i=0; i < response.length; i++){
                console.log(response[i].newsId);
                html1 = html1 + '<tr>' +
                    '<td id="' + response[i].newsId +'"><input type="checkbox"></td>'+
                    '<td>' + response[i].title + '</td>'+
                    '<td>' + response[i].body +'</td></tr>';
            }

            document.getElementById('articleList').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function getArticlesRemove(){

    var table = document.getElementById("removArtTable");
    var rows = table.getElementsByTagName("tr");
    var temp = 0;
    for(i = 1; i < rows.length; i++)
    {
        if(rows[i].getElementsByTagName("input")[0].checked){
            temp = 1;
            removeArticles(rows[i].cells[0].id);
        }
    }

    if(temp == 1){
       loadPage('controlPanel');
    }
}

function removeArticles(id){
    var dataToSend = {
        endpoint: 'news',
        code: '2',
        du: true,
        nid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            $('#basicModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}

/******************************************************************************************************************
 removeBusiness.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in removeBusiness.html
function loadRemoveBusiness(){
    showBusinessesToRemove();
}

function showBusinessesToRemove(){
    var dataToSend = {
        endpoint: 'company',
        code: '0'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;

            var html1 = "";

            for(var i=0; i < response.length; i++){
                html1 = html1 + '<tr>' +
                    '<td id='+ response[i].companyId +'><input type="checkbox"></td>'+
                    '<td>' + response[i].companyName + '</td>'+
                    '<td>' + response[i].description +'</td>'+
                    '<td>' + response[i].city +'</td></tr>';
            }
            document.getElementById('businessList').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getBusinessRemove(){
    var table = document.getElementById("removBsnTable");
    var rows = table.getElementsByTagName("tr");
    var temp = 0;
    for(i = 1; i < rows.length; i++)
    {
        if(rows[i].getElementsByTagName("input")[0].checked){
            temp = 1;
             removeBusiness(rows[i].cells[0].id);
        }
    }
    if(temp == 1){
       loadPage('controlPanel');
    }

}

function removeBusiness(id){

    var dataToSend = {
        endpoint: 'company',
        code: '6',
        du: true,
        cid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('#basicModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });


}

/******************************************************************************************************************
 removeMaterial.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in removeMaterial.html
function loadRemoveMaterial(){
    showMaterialsToRemove();
}

function showMaterialsToRemove(){
    document.getElementById('materialList').innerHTML = populateMaterialsList();
}

function getRemvMatChbox(frm){
    var checklist = [];
    var temp = 0;
    for (i = 0; i < frm.subMaterial.length; i++) {
        if (frm.subMaterial[i].checked) {
            temp = 1;
            checklist = frm.subMaterial[i].value.split(",");
            removeMaterial(checklist[1]);
        }
    }
    if(temp == 1){
        loadPage('controlPanel');
    }}

function removeMaterial(id){
    var dataToSend = {
        endpoint: 'material',
        code: '4',
        du: true,
        multi: true,
        smid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function () {
            $('#basicModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}

/******************************************************************************************************************
 removeProcess.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in removeProcess.html
function loadRemoveProcess(){
    showProcessesToRemove();
}

function showProcessesToRemove(){
    document.getElementById('processList').innerHTML = populateProcessList();
}

function getRemvProcChbox(frm){
    var checklist = [];
    var spid;
    var temp = 0;
    for (i = 0; i < frm.subProcess.length; i++) {
        if (frm.subProcess[i].checked) {
            temp = 1;
            checklist = frm.subProcess[i].value.split(",");
            toPush = [];
//            message1 += 'ProcessName: ' + checklist[0] + ' ' + 'ProcessID: ' + checklist[2] + ' ' + 'sub-ProcessID: ' + checklist[1] + "\n";
            toPush.push(checklist[0]);
            toPush.push(checklist[1]);
            toPush.push(checklist[2]);
            procChecked.push(toPush);
            removeProcess(checklist[1]);
        }
    }
    if(temp == 1){
        loadPage('controlPanel');
    }}

function removeProcess(id){
    var dataToSend = {
        endpoint: 'process',
        code: '4',
        du: true,
        multi: true,
        spid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function () {
            $('#basicModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}

/******************************************************************************************************************
 removeService.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in removeService.html
function loadRemoveService(){
    showServicesToRemove();
}

function showServicesToRemove(){
    document.getElementById('serviceList').innerHTML = populateServiceList();
}

function getRemvServChbox(frm){

    var checklist = [];
    var ssid;
    var temp = 0;
    for (i = 0; i < frm.subService.length; i++) {
        if (frm.subService[i].checked) {
            temp = 1;
            checklist = frm.subService[i].value.split(",");
            toPush = [];
//            message1 += 'ServiceName: ' + checklist[0] + ' ' + 'ServiceID: ' + checklist[2] + ' ' + 'sub-ServiceID: ' + checklist[1] + "\n";
            toPush.push(checklist[0]);
            toPush.push(checklist[1]);
            toPush.push(checklist[2]);
            servChecked.push(toPush);
            removeService(checklist[1]);
        }
    }
    if(temp == 1){
        loadPage('controlPanel');
    }
}

function removeService(id){

    var dataToSend = {
        endpoint: 'service',
        code: '4',
        du: true,
        multi: true,
        ssid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function () {
            $('#basicModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });


}


/******************************************************************************************************************
 searchByBusiness.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in searchByBusiness.html
function loadSearchByBusiness(){
    showAllBusiness();
}

function showAllBusiness(){
    var dataToSend = {
        endpoint: 'company',
        code: '0'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var desc;
            var length = 200;
            
                for(var i=0; i < response.length; i++){
                    if(response[i].description.length > length){
                        desc = response[i].description.substring(0, length) + " ......click to see more";
                    }
                    else{
                        desc = response[i].description;
                    }
                    html1 = html1 + '<tr style="cursor:pointer" onclick="viewB('+response[i].companyId+')">'+
                    "<td>" + (i+1) + "</td>"+
                    "<td>" + response[i].companyName + "</td>"+
                    "<td> " + desc +"</td>"+
                    "<td>"+ response[i].city +"</td>"+
                    "</tr>";
                }
                document.getElementById('searchBusinessList').innerHTML = html1;

                $("tbody > tr").mouseover(function(){
                    $(this).css("color","#808080");
                });

                $("tr").mouseout(function(){
                    $(this).css("color","");
                });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
        //    // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function showAllBusinessFromSearch(){
    var dataToSend = {
        endpoint: 'company',
        code: '0'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";

            for(var i=0; i < response.length; i++){
                html1 = html1 + '<tr style="cursor:pointer" onclick="viewBuSe('+response[i].companyId+')">'+
                    "<td>" + (i+1) + "</td>"+
                    "<td>" + response[i].companyName + "</td>"+
                    "<td> " + response[i].description +"</td>"+
                    "<td>"+ response[i].city +"</td>"+
                    "</tr>";

                mainCompanyPins.push([]);
                mainCompanyPins[i][0] = response[i].companyName;
                mainCompanyPins[i][1] = response[i].latitude;
                mainCompanyPins[i][2] = response[i].longitude;
                mainCompanyPins[i][3] = i;
                mainCompanyPins[i][4] = response[i].companyName;
                mainCompanyPins[i][5] = response[i].companyId;

                if(response[i].logoType == null){
                    mainCompanyPins[i][6] = '<img width="50" height="50" border="0" align="left"  src="images/default.gif">';
                }
                else{
                    mainCompanyPins[i][6] = '<img class="img-rounded" src=data:' + response[i].logoType + ";base64,"
                        + response[i].logo +  ' width="50" height="50" align="left">';
                }
            }
            mainCompanyPins.pop();
            document.getElementById('searchBusinessList').innerHTML = html1;

            $("tbody > tr").mouseover(function(){
                $(this).css("color","#808080");
            });

            $("tr").mouseout(function(){
                $(this).css("color","");
            });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          //  // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function viewBuSe(id){
    console.log("CompanyId "+ id);
    $('#overallContainer').load('html/viewBusiness.html', function(){
        var i = getRow(id);
        mainCompanyPins.move(i,0);
        getCompanyProfile(id);
        getAllSubmaterials(id);
        getAllSubProcesses(id);
        getAllSubServices(id);
    });
}


/******************************************************************************************************************
 searchBy General
 ******************************************************************************************************************/

function searchBy(id, target){
    console.log("I'm in searchBy");

    $('#overallContainer').load('html/searchResults.html', function(){
        getCompaniesOf(id, target);
    });
};

function viewB(id){
    console.log("CompanyId "+ id);
    $('#overallContainer').load('html/viewBusiness.html', function(){
        var i = getRow(id);
        mainCompanyPins.move(i,0);
        getCompanyProfile(id);
        getAllSubmaterials(id);
        getAllSubProcesses(id);
        getAllSubServices(id);
    });
}

function getRow(id){
    var res = -1;
    for(var i = 0; i < mainCompanyPins.length; i++){
        if(mainCompanyPins[i][5] == id){
            res = mainCompanyPins[i][3];
            break;
        }
    }
    return res;
}

function autoSearch(val, target){
    switch (target){
        case 'subMaterial':
            getSubmaterial(val);
            break;
        case 'subProcess':
            getSubprocess(val);
            break;
        case 'subService':
            getSubservice(val);
            break;
        case 'business':
            getCompany(val);
            break;

        default:
            return;

    }
}

function getCompany(name){

    var dataToSend = {
        endpoint: 'company',
        code: '5',
        keyword: name };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";

            for(var i=0; i < response.length; i++){
                html1 = html1 + '<tr style="cursor:pointer" onclick="viewB('+response[i].companyId+')">'+
                "<td>" + (i+1) + "</td>"+
                "<td>" + response[i].companyName + "</td>"+
                "<td> " + response[i].description +"</td>"+
                "<td>"+ response[i].city +"</td>"+
                "</tr>";
            }
            document.getElementById('searchBusinessList').innerHTML = html1;

            $("tbody > tr").mouseover(function(){
                $(this).css("color","#808080");
            });

            $("tr").mouseout(function(){
                $(this).css("color","");
            });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getSubmaterial(name){

    var dataToSend = {
        endpoint: 'material',
        code: '0',
        keyword: name };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";


            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].materialName + '<ul>';
                html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subMaterial\')" class="catMargins" id="' + response[i].subMaterialId + '"><a ">' + response[i].subMaterialName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].materialId == response[i].materialId) {
                        i++;
                        html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subMaterial\')" class="catMargins" id="' + response[i].subMaterialId + '"><a ">' + response[i].subMaterialName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchMaterialList').innerHTML = html1;



        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getSubprocess(name){
    var dataToSend = {
        endpoint: 'process',
        code: '0',
        keyword: name };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";


            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].processName + '<ul>';
                html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subProcess\')" class="catMargins" id="' + response[i].subProcessId + '"><a ">' + response[i].subProcessName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].processId == response[i].processId) {
                        i++;
                        html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subProcess\')" class="catMargins" id="' + response[i].subProcessId + '"><a ">' + response[i].subProcessName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchProcessList').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getSubservice(name){

    var dataToSend = {
        endpoint: 'service',
        code: '0',
        keyword: name };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";

            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].serviceName + '<ul>';
                html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subService\')" class="catMargins" id="' + response[i].subServiceId + '"><a ">' + response[i].subServiceName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].serviceId == response[i].serviceId) {
                        i++;
                        html2 += '<li style="cursor:pointer" onclick="searchBy(this.id, \'subService\')" class="catMargins" id="' + response[i].subServiceId + '"><a ">' + response[i].subServiceName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchServicesList').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};



function getCompaniesOf(id, target){

    document.getElementById('searchResultsHeader').innerHTML = '';
    document.getElementById('searchBusinessList').innerHTML = '';


    switch(target){
        case 'subMaterial':
            myCode = '15';
            break;

        case 'subService':
            myCode = '14';
            break;

        case 'subProcess':
            myCode = '13';
            break;

        default:
            console.log("Wrong Target!!");
            return;
            break;
    }

    var dataToSend = {
        endpoint: 'company',
        code: myCode,
        sid: id
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {


            var response = data.resp;
            var html1 = "";
            mainCompanyPins = [[]];

            if(response.length > 0){
                switch(target){
                    case 'subMaterial':
                        document.getElementById('searchResultsHeader').innerHTML = 'Result of search by ' + response[0].subMaterialName;
                        break;

                    case 'subService':
                        document.getElementById('searchResultsHeader').innerHTML = 'Result of search by ' + response[0].subServiceName;
                        break;

                    case 'subProcess':
                        document.getElementById('searchResultsHeader').innerHTML = 'Result of search by ' + response[0].subProcessName;
                        break;

                    default:
                        document.getElementById('searchResultsHeader').innerHTML = 'Result of search ';
                        break;
                }

                for(var i=0; i < response.length; i++){
                    html1 = html1 + '<tr style="cursor:pointer" onclick="viewB('+response[i].companyId+')">'+
                    "<td>" + (i+1) + "</td>"+
                    "<td>" + response[i].companyName + "</td>"+
                    "<td> " + response[i].description +"</td>"+
                    "<td>"+ response[i].city +"</td>"+
                    "</tr>";

                    mainCompanyPins.push([]);
                    mainCompanyPins[i][0] = response[i].companyName;
                    mainCompanyPins[i][1] = response[i].latitude;
                    mainCompanyPins[i][2] = response[i].longitude;
                    mainCompanyPins[i][3] = i;
                    mainCompanyPins[i][4] = response[i].companyName;
                    mainCompanyPins[i][5] = response[i].companyId;

                    if(response[i].logoType == null){
                        mainCompanyPins[i][6] = '<img width="50" height="50" border="0" align="left"  src="images/default.gif">';
                    }
                    else{
                        mainCompanyPins[i][6] = '<img class="img-rounded" src=data:' + response[i].logoType + ";base64,"
                        + response[i].logo +  ' width="50" height="50" align="left">';
                    }

                }
                mainCompanyPins.pop();
                
                document.getElementById('searchBusinessList').innerHTML = html1;
                $("tbody > tr").mouseover(function(){
                    $(this).css("color","#808080");
                });

                $("tr").mouseout(function(){
                    $(this).css("color","");
                });
            }

            else{
                document.getElementById('searchResultsHeader').innerHTML = 'Your search did not match any company';
            }




        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}


/******************************************************************************************************************
 searchByMaterial.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in searchByMaterial.html
function loadSearchByMaterial(){
    showAllMaterial();
}


function showAllMaterial(){

    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";


            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].materialName + '<ul>';
                html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subMaterial\')" class="catMargins" id="' + response[i].subMaterialId + '"><a ">' + response[i].subMaterialName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].materialId == response[i].materialId) {
                        i++;
                        html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subMaterial\')" class="catMargins" id="' + response[i].subMaterialId + '"><a ">' + response[i].subMaterialName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchMaterialList').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

/******************************************************************************************************************
 searchByProcess.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in searchByProcess.html
function loadSearchByProcess(){
    showAllProcesses();
}


function showAllProcesses(){

    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";


            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].processName + '<ul>';
                html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subProcess\')" class="catMargins" id="' + response[i].subProcessId + '"><a ">' + response[i].subProcessName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].processId == response[i].processId) {
                        i++;
                        html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subProcess\')" class="catMargins" id="' + response[i].subProcessId + '"><a ">' + response[i].subProcessName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchProcessList').innerHTML = html1;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });


}

/******************************************************************************************************************
 searchByService.html
 ******************************************************************************************************************/

//Function to load all dynamic fields in searchByService.html
function loadSearchByService(){
    showAllServices();
}

function showAllServices(){

    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";


            for(var i = 0 ; i < response.length; i++) {
                html2 = "";
                html1 += '<li class="input-group list-group-item">' + response[i].serviceName + '<ul>';
                html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subService\')" class="catMargins" id="' + response[i].subServiceId + '"><a ">' + response[i].subServiceName + '</a></li>';

                if (i != (response.length - 1))
                    while (response[i + 1].serviceId == response[i].serviceId) {
                        i++;
                        html2 += '<li style="cursor:pointer"  onclick="searchBy(this.id, \'subService\')" class="catMargins" id="' + response[i].subServiceId + '"><a ">' + response[i].subServiceName + '</a></li>';

                        if (i == (response.length - 1))
                            break;
                    }
                html1 += html2 + '</ul></li>';

            }
            document.getElementById('searchServicesList').innerHTML = html1;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}

/******************************************************************************************************************
 searchResults.html
 ******************************************************************************************************************/

//Function to load search result list in searchResults.html
function loadSearchResults(){
    showAllBusiness();
    rowSelectorSearchResult();
}

function rowSelectorSearchResult() {
    var table = document.getElementById("searchResultTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 1; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                    var cell = row.getElementsByTagName("td")[0];
//                    var id = cell.innerHTML;
//                    // alert("id:" + id);
                    window.location.href = 'viewBusiness.html';
                };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}


/******************************************************************************************************************
 submitBusiness.html
 ******************************************************************************************************************/

function validateSubmitBsn(frm){

    var errorMessage = "";
    var uid = GetCookie('userId');
    var name = frm.submitName.value;
    var address = frm.submitAddress.value;
    var email = frm.submitEmail.value;
    var description = frm.submitDescription.value;
    var website = frm.submitWebsite.value;
    var city = frm.submitCity.value;
    var country = frm.submitCountry.value;
    var zipCode = frm.submitZipcode.value;
    var telephone = frm.submitPhone.value;

    if (!isValidEmailAddress($("#submitMail").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid email address.";
    }

    if (!isValidPhone($("#submitPhone").val())) {
        errorMessage = "<br />Please enter a valid telephone number.";
    }

    if ((!isValidZipCode($("#submitZipcode").val())) || ($.trim($("#submitZipcode").val()) == "")) {
        errorMessage = "<br />Please enter a valid zipcode.";
    }

    if($.trim($("#submitCountry").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if($.trim($("#submitCity").val()) == ""){
        errorMessage = "<br />Please enter a valid city.";
    }

    if($.trim($("#submitAddress").val()) == ""){
        errorMessage = "<br />Please enter a valid address.";
    }

    if (!isValidWebsite($("#submitWebsite").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid website.";
    }

    if($.trim($("#submitName").val()) == ""){
        errorMessage = "<br />Please enter a valid business name.";
    }

    if (errorMessage == "") {
       // console.log(uid+ "\n" + name + "\n" + address+ "\n" + email + "\n" +description+ "\n" + website + "\n" +city + "\n" +country+ "\n" + zipCode + "\n" +telephone);
        addSubmission(uid, name, website, description, telephone, email, address, city, country, zipCode);
    }

    else {
        $("#error").html(errorMessage);
    }
}

function  dropzoneSubmitBsnPhoto(){
    Dropzone.autoDiscover = false;
	var dir = "upload"+GetCookie("userType")+GetCookie("userId");
    var myDropzone = new Dropzone("#dropzone-submit", {
		url: "./html/uploadSubImage.php?new=t&dir="+dir,
        addRemoveLinks: true,
        maxFileSize: 1,
        maxFiles: 1,
        autoProcessQueue: false,
        dictResponseError: "There has been an error in the server.",
        acceptedFiles: 'image/*,.jpg,.png,.gif,.JPG,.PNG,.GIF',
        complete: function(file){
            if(file.status == "success"){
            //    // alert("The following image has been uploaded suscessfully: " + file.name);
				loadPage('goToMain');
            }
        },
        error: function(){
         //   // alert("Error uploading the following image: " + file.name);
        },
        removedfile: function(file, serverFileName){
            var _ref;
            var name = file.name;
            var dataToSend = {
                filename: name,
                dir: dir
            };
            $.ajax({
                type: "POST",
                url: "./html/uploadSubImage.php?delete=true",
                data: dataToSend,
                sucess: function(data) {
                    var json = JSON.parse(data);
                    if(json.res== true){
                        var element;
                        (element = file.previewElement) != null ?
                            element.parentNode.removeChild(file.previewElement): false;
                        //// alert("Image has been removed: " + name);
                    }
                }
            })
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
}


/******************************************************************************************************************
 viewArticles.html
 ******************************************************************************************************************/

function loadAllArticles(){


    var dataToSend = {
        endpoint: 'news',
        code: '0',
        curr: articleToShow
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            <!-- Featured Article-->
            var response = data.resp;

            var featuredArticleHTML1='<a href="#"  ' +
                'data-toggle="modal" data-target="#basicModal';

            var featuredArticleHTML2 = '"><img width="500" height="440" src="data:image/jpg;base64,';

            var featuredArticleHTML3 = '" alt="" class="feature"></a><div class="block-title"><h4>';

            var featuredArticleHTML4='</h4></div>';
            <!------------------->


            <!-- Normal Article-->
            var normalArticleHTML1='<li class="media"><a class="pull-left" href="#"  data-toggle="modal" data-target="#basicModal';

            var normalArticleHTML15 = '"><img class="media-object artImgSize" src="data:image/jpg;base64,';

            var normalArticleHTML2 ='" alt="..."></a><div class="media-body"><h4 class="media-heading">';

            var normalArticleHTML3 = '</h4></div></li>';
            <!------------------->



            <!-- Modal HTML-->
            var modal1 = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="basicModal';

            var modal15 = '" aria-hidden="true" id="basicModal';

            var modal2 = '"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button><h4 class="modal-title" ' +
                'id="myModalLabel">';

            var modal3='</h4></div><div class="modal-body"><p><img src="data:image/jpg;base64,';

            var modal4='" alt="" class="feature">';

            var modal5='</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">' +
                'Close</button></div></div></div></div>';
            <!------------------->

            var featuredArticle="";
            var topRightArticle="";
            var botLeftArticles="";
            var botRightArticles="";
            var modal="";

            if(articleToShow == 8388607){
                //Accomodate the articles in certain form, depending on the order they are in the json file.
                for(var i=0; i < response.length; i++){
                    if(i==0){ //featured article

                        if(response[i].newsImage == null){
                            featuredArticleHTML2 = '"><img width="500" height="440" src="images/prdlogo.gif"';
                            featuredArticleHTML3 = ' class="feature"></a><div class="block-title"><h4>';
                            modal3='</h4></div><div class="modal-body"><p><img src="images/prdlogo.gif"';
                            modal4='class="feature">';

                            featuredArticle= featuredArticleHTML1 + response[i].newsId + featuredArticleHTML2 +
                            featuredArticleHTML3 + response[i].title + featuredArticleHTML4;

                            modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + modal4 + response[i].body +
                            modal5;
                         }
                         else{
                             featuredArticle= featuredArticleHTML1 + response[i].newsId + featuredArticleHTML2 + response[i].newsImage +
                             featuredArticleHTML3 + response[i].title + featuredArticleHTML4;

                             modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                             modal5;
                         }  
                    }

                    else if(i<5){ //top 4 articles right column
                        if(response[i].newsImage == null){
                            normalArticleHTML15 = '"><img class="media-object artImgSize" src="images/prdlogo.gif"';
                            normalArticleHTML2 ='alt="..."></a><div class="media-body"><h4 class="media-heading">';
                            modal3='</h4></div><div class="modal-body"><p><img src="images/prdlogo.gif"';
                            modal4='class="feature">';

                            topRightArticle += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                            modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + modal4 + response[i].body +
                            modal5;
                         }
                         else{
                            normalArticleHTML15 = '"><img class="media-object artImgSize" src="data:image/jpg;base64,';
                            normalArticleHTML2 ='" alt="..."></a><div class="media-body"><h4 class="media-heading">';
                            modal3='</h4></div><div class="modal-body"><p><img src="data:image/jpg;base64,';
                            modal4='" alt="" class="feature">';

                            topRightArticle += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                            modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                            modal5; 
                         }  
                        
                    }

                    else if(i>5 && i%2 == 0){ //even number, articles posted in bottom left column
                        if(response[i].newsImage == null){
                            normalArticleHTML15 = '"><img class="media-object artImgSize" src="images/prdlogo.gif"';
                            normalArticleHTML2 ='alt="..."></a><div class="media-body"><h4 class="media-heading">';
                            modal3='</h4></div><div class="modal-body"><p><img src="images/prdlogo.gif"';
                            modal4='class="feature">';

                            botRightArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                            modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + modal4 + response[i].body +
                            modal5;
                         }
                         else{
                            normalArticleHTML15 = '"><img class="media-object artImgSize" src="data:image/jpg;base64,';
                            normalArticleHTML2 ='" alt="..."></a><div class="media-body"><h4 class="media-heading">';
                            modal3='</h4></div><div class="modal-body"><p><img src="data:image/jpg;base64,';
                            modal4='" alt="" class="feature">';

                            botRightArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                            modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                            modal5; 
                         }  

                    }

                    else{ //articles posted in bottom right column
                         if(response[i].newsImage == null){
                                 if(response[i].newsImage == null){
                                normalArticleHTML15 = '"><img class="media-object artImgSize" src="images/prdlogo.gif"';
                                normalArticleHTML2 ='alt="..."></a><div class="media-body"><h4 class="media-heading">';
                                modal3='</h4></div><div class="modal-body"><p><img src="images/prdlogo.gif"';
                                modal4='class="feature">';

                                botRightArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                                modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + modal4 + response[i].body +
                                modal5;
                             }
                             else{
                                normalArticleHTML15 = '"><img class="media-object artImgSize" src="data:image/jpg;base64,';
                                normalArticleHTML2 ='" alt="..."></a><div class="media-body"><h4 class="media-heading">';
                                modal3='</h4></div><div class="modal-body"><p><img src="data:image/jpg;base64,';
                                modal4='" alt="" class="feature">';

                                botRightArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                                modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                                modal5; 
                             } 
                         }
                         else{
                                if(response[i].newsImage == null){
                                normalArticleHTML15 = '"><img class="media-object artImgSize" src="images/prdlogo.gif"';
                                normalArticleHTML2 ='alt="..."></a><div class="media-body"><h4 class="media-heading">';
                                modal3='</h4></div><div class="modal-body"><p><img src="images/prdlogo.gif"';
                                modal4='class="feature">';

                                botLeftArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                                modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + modal4 + response[i].body +
                                modal5;
                             }
                             else{
                                normalArticleHTML15 = '"><img class="media-object artImgSize" src="data:image/jpg;base64,';
                                normalArticleHTML2 ='" alt="..."></a><div class="media-body"><h4 class="media-heading">';
                                modal3='</h4></div><div class="modal-body"><p><img src="data:image/jpg;base64,';
                                modal4='" alt="" class="feature">';

                                botLeftArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                                modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                                modal5; 
                             }  
                         }  
                    }
                }

                document.getElementById('featuredArticle').innerHTML = featuredArticle ;
                document.getElementById('rightColumnArticles').innerHTML = topRightArticle ;

            }
            else {
                for (var i = 0; i < response.length; i++) {
                    if(i%2 == 0){ //even number, articles posted in bottom left column
                        botRightArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                        modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                        modal5;

                    }

                    else{ //articles posted in bottom right column
                        botLeftArticles += normalArticleHTML1 + response[i].newsId + normalArticleHTML15 + response[i].newsImage + normalArticleHTML2 + response[i].title + normalArticleHTML3;

                        modal += modal1 + response[i].newsId + modal15 + response[i].newsId + modal2 + response[i].title + modal3 + response[i].newsImage + modal4 + response[i].body +
                        modal5;
                    }

                }


            }

            if(response.length != 0)
            articleToShow = response[response.length - 1].newsId;

            $('#botLeftColumnArticles').append(botLeftArticles) ;
            $('#botRightColumnArticles').append(botRightArticles) ;
            $('#modalDiv').append(modal);


        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
       //     // alert("Server Not Found: Please Try Again Later!");
        }
    });

}


/******************************************************************************************************************
 viewBusiness.html
 ******************************************************************************************************************/
//var latlong = (18.370841,-66.143714);
var lat=0;
var long=0;
var myCenter;
var viewTest;

//google.maps.event.addDomListener(window, 'load', initialize);

//Function to load all articles in viewBusiness.html
function loadViewBusiness(){
    userType();
}



function viewBusinessInfo(id){
    //console.log('entro view');
//    // alert(id);
    getCompanyProfile(id);
    getAllSubmaterials(id);
    getAllSubProcesses(id);
    getAllSubServices(id);
}

function getCompanyProfile(id){
    console.log("I'm getting a business profile");
    $('#overallContainer').load('html/viewBusiness.html', function (){
        loadScript();

        var dataToSend = {
            endpoint: 'company',
            code: '7',
            cid: id };

        $.ajax({
            url: "../Server/prds.php",
            data: dataToSend,
            contentType: "application/json",
            type: "GET",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {

                var response = data.resp;
                var name ='<span style="font-weight: bold">Name:</span> ';
                var nameTitle = '';
                var compDescription = '<span style="font-weight: bold">Description:</span> ';
                var tel = '<span style="font-weight: bold">Telephone:</span> ';
                var webS = '<span style="font-weight: bold">Website:</span><a href="';
                var link = " ";
                var eMail = '<span style="font-weight: bold">E-mail:</span> ';
                var address = '<span style="font-weight: bold">Address:</span> ';
                var utube = '<iframe width="100%" height="315" src="//www.youtube.com/embed/';
                var logo = '';


                if(response[0].logoType == null){
                    logo += '<img class="img-rounded" src="images/default.gif">';
                }
                else{
                    logo += '<img class="img-rounded" src=data:' + response[0].logoType + ";base64,"
                        + response[0].logo +  ' width="175" height="175">';
                }
                nameTitle += response[0].companyName;
                name += response[0].companyName;
                compDescription += response[0].description;
                tel += response[0].phone;
                webS += response[0].website;
                link += response[0].website;
                eMail += response[0].email;
                address += response[0].line.trim() + ', ' + response[0].city.trim() + ', ' + response[0].country.trim() + ' ' + response[0].zipcode;


                if(response[0].videoURL != (null || '')){
                    utube += youtube_parser(response[0].videoURL);
                }
                else{
                    $('#youtubeLink').css("display","none");
                }

                var html1Pic = "";
                var html2Pic = "";

                //Active Element
                if(response[0].imageData != null) {
                    html1Pic += "<div class=\"item active\"><img src=\"data:" + response[0].imageType + ";base64," + response[0].imageData + "\"><div class=\"carousel-caption\"></div></div>";
                    html2Pic += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"0\" class=\"active\"></li>";

                    for(var i = 1 ; i < response.length; i++){
                        html1Pic += "<div class=\"item\"><img src=\"data:" + response[i].imageType + ";base64," + response[i].imageData + "\"><div class=\"carousel-caption\"></div></div>";
                        html2Pic += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"" + i + "\"></li>";
                    }
                }
                else{
                    $('#carousel-example-generic').css("display","none");
                }

                document.getElementById('companyLogo').innerHTML = logo;
                document.getElementById('companyCarousel').innerHTML = html1Pic;
                document.getElementById('companyIndicators').innerHTML = html2Pic;
                document.getElementById('companyName1').innerHTML = nameTitle;
                document.getElementById('companyName2').innerHTML = name + '</li>';
                document.getElementById('companyDesc').innerHTML = compDescription + '</li>';
                document.getElementById('companyPhone').innerHTML = tel + '</li>';
                document.getElementById('companyWeb').innerHTML = webS + '">' + link + '</a></li>';
                document.getElementById('companyEmail').innerHTML = eMail + '</li>';
                document.getElementById('companyAddress').innerHTML = address + '</li>';
                document.getElementById('youtubeLink').innerHTML = utube + '" frameborder="0" allowfullscreen></iframe>';


            },
            error: function (data, textStatus, jqXHR) {
                console.log("textStatus: " + textStatus);
                console.log("Server Not Found: Please Try Again Later!");
            }
        });

    });


}

function changeCompanyProfile(id){
    console.log("I'm getting a business profile");
//    loadScript();

    var dataToSend = {
        endpoint: 'company',
        code: '7',
        cid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

//            window.location.href='viewBusiness.html';

            console.log('entro getcompany0');
            var response = data.resp;
            var name ='<span style="font-weight: bold">Name:</span> ';
            var nameTitle = '';
            var compDescription = '<span style="font-weight: bold">Description:</span> ';
            var tel = '<span style="font-weight: bold">Telephone:</span> ';
            var webS = '<span style="font-weight: bold">Website:</span><a href="';
            var link = " ";
            var eMail = '<span style="font-weight: bold">E-mail:</span> ';
            var address = '<span style="font-weight: bold">Address:</span> ';
            var utube = '<iframe width="100%" height="315" src="//www.youtube.com/embed/';
//            var photos = "";
            var logo = '';

            if(response[0].logoType == null){
                logo += '<img class="img-rounded" src="images/default.gif">';
            }
            else{
                logo += '<img class="img-rounded" src=data:' + response[0].logoType + ";base64,"
                    + response[0].logo +  ' width="175" height="175">';
            }

            nameTitle += response[0].companyName;
            name += response[0].companyName;
            compDescription += response[0].description;
            tel += response[0].phone;
            webS += response[0].website;
            link += response[0].website;
            eMail += response[0].email;
            address += response[0].line.trim() + ', ' + response[0].city.trim() + ', ' + response[0].country.trim() + ' ' + response[0].zipcode;


            $('#youtubeLink').css("display","block");
            if(response[0].videoURL != (null || '')){
                utube += youtube_parser(response[0].videoURL);
            }
            else{
                $('#youtubeLink').css("display","none");
            }

//            var car = document.getElementById('companyCarousel');
//            var ind = document.getElementById('companyIndicators');
            var html1Pic = "";
            var html2Pic = "";

            //Active Element
            $('#carousel-example-generic').css("display","block");
            if(response[0].imageData != null) {
                html1Pic += "<div class=\"item active\"><img src=\"data:" + response[0].imageType + ";base64," + response[0].imageData + "\"><div class=\"carousel-caption\"></div></div>";
                html2Pic += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"0\" class=\"active\"></li>";

                for(var i = 1 ; i < response.length; i++){
                    html1Pic += "<div class=\"item\"><img src=\"data:" + response[i].imageType + ";base64," + response[i].imageData + "\"><div class=\"carousel-caption\"></div></div>";
                    html2Pic += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"" + i + "\"></li>";
                }
            }
            else{
                $('#carousel-example-generic').css("display","none");
            }


            document.getElementById('companyLogo').innerHTML = logo;
            document.getElementById('companyCarousel').innerHTML = html1Pic;
            document.getElementById('companyIndicators').innerHTML = html2Pic;
            document.getElementById('companyName1').innerHTML = nameTitle;
            document.getElementById('companyName2').innerHTML = name + '</li>';
            document.getElementById('companyDesc').innerHTML = compDescription + '</li>';
            document.getElementById('companyPhone').innerHTML = tel + '</li>';
            document.getElementById('companyWeb').innerHTML = webS + '">' + link + '</a></li>';
            document.getElementById('companyEmail').innerHTML = eMail + '</li>';
            document.getElementById('companyAddress').innerHTML = address + '</li>';
            document.getElementById('youtubeLink').innerHTML = utube + '" frameborder="0" allowfullscreen></iframe>';

            console.log('entro getcompany');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
    getAllSubmaterials(id);
    getAllSubProcesses(id);
    getAllSubServices(id);
}

function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[1].length==11){
        return match[1];
    }else{
        // // alert("Url incorrecta");
    }
}

function getAllSubmaterials(company){
    console.log("I'm getting all submaterials of company");

    var dataToSend = {
        endpoint: 'company',
        code: '4',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var materialFormat = '<li> <span style="font-weight: bold">Material: </span> ';
            var matLimitationFormat = '<li> <span class="matLimitationFormat" style="font-weight: bold">Limitation:</span> ';
            var matApplicationFormat = '<li> <span class="matApplicationFormat" style="font-weight: bold">Application:</span> ';
            var material = '';
            var matLimitation = '';
            var matApplication = '';
            var matFinal = '';
            var limit;
            var appli;


            for(var i=0; i < response.length; i++){
                material = response[i].subMaterialName + '</li>';
                if(response[i].limitation != null) {
                    matLimitation = response[i].limitation + '</li>';
                    limit = matLimitationFormat;
                }
                else{
                    matLimitation = '';
                    limit = '';
                }
                if(response[i].application != null) {
                    matApplication = response[i].application + '</li>';
                    appli = matApplicationFormat;
                }
                else{
                    matApplication = '';
                    appli = '';
                }
                matFinal += materialFormat + material + limit + matLimitation + appli + matApplication + '</li></br><li>';
            }

            document.getElementById('material').innerHTML = matFinal + '</li>';
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getAllSubProcesses(company){
    console.log("I'm getting all subprocess of company");

    var dataToSend = {
        endpoint: 'company',
        code: '3',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var processFormat = '<li> <span style="font-weight: bold">Process:</span> ';
            var procLimitationFormat = '<li> <span style="font-weight: bold">Limitation:</span> ';
            var procApplicationFormat = '<li> <span style="font-weight: bold">Application:</span> ';
            var process = '';
            var procLimitation = '';
            var procApplication = '';
            var procFinal = '';
            var limit;
            var appli;


            for(var i=0; i < response.length; i++){
                process = response[i].subProcessName + '</li>';
                if(response[i].limitation != null) {
                    procLimitation = response[i].limitation + '</li>';
                    limit = procLimitationFormat;
                }
                else{
                    procLimitation = '';
                    limit = '';
                }
                if(response[i].application != null) {
                    procApplication = response[i].application + '</li>';
                    appli = procApplicationFormat;
                }
                else{
                    procApplication = '';
                    appli = '';
                }
                procFinal += processFormat + process + limit + procLimitation + appli + procApplication + '</li></br><li>';
            }
            document.getElementById('process').innerHTML = procFinal + '</li>';
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}

function getAllSubServices(company){
    console.log("I'm getting all subservices of company");

    var dataToSend = {
        endpoint: 'company',
        code: '2',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var serviceFormat = '<li> <span style="font-weight: bold">Service:</span> ';
            var servLimitationFormat = '<li> <span style="font-weight: bold">Limitation:</span> ';
            var servApplicationFormat = '<li> <span style="font-weight: bold">Application:</span> ';
            var service = '';
            var servLimitation = '';
            var servApplication = '';
            var servFinal = '';
            var limit;
            var appli;


            for(var i=0; i < response.length; i++){
                service = response[i].subServiceName + '</li>';
                if(response[i].limitation != null){
                    servLimitation = response[i].limitation + '</li>';
                    limit = servLimitationFormat;
                }
                else{
                    servLimitation = '';
                    limit = '';
                }

                if(response[i].application != null){
                    servApplication = response[i].application + '</li>';
                    appli = servApplicationFormat;
                }
                else{
                    servApplication = '';
                    appli = '';
                }
                servFinal += serviceFormat + service + limit + servLimitation + appli + servApplication + '</li></br><li>';
            }

            document.getElementById('service').innerHTML = servFinal + '</li>';
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

//var myMarker = new google.maps.LatLng(18.1987193, -66.3526748);
//var map;

var markerRed;

function initialize() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 12,
        disableDefaultUI: true,
        center: new google.maps.LatLng(mainCompanyPins[0][1], mainCompanyPins[0][2]),
        zoomControl: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    addMarkers();
}
var boxText1 = document.createElement("div");
boxText1.id = "boxText1";
boxText1.className = "labelText1";
boxText1.innerHTML = "title1";//this is created earlier
var boxList = [];

function addMarkers(){
    var marker, i;
    var infowindow = new google.maps.InfoWindow({
        disableAutoPan: false
        ,isHidden:false
        ,maxWidth:900
        ,closeBoxURL: ""
        ,pane: "mapPane"
        ,enableEventPropagation: true
    });
    for (var i = 0; i < mainCompanyPins.length; i++)
    {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(mainCompanyPins[i][1], mainCompanyPins[i][2]),
            map: map,
            animation:google.maps.Animation.DROP,
            id: i,
//            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            title: mainCompanyPins[i][4]
        });

        var boxText = document.createElement("div");
        boxText.id = i;
        boxText.className = "labelText" + i;
        boxText.innerHTML = '<div class="map-info-window">' +
            mainCompanyPins[i][6] + mainCompanyPins[i][0];
        boxList.push(boxText);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            var contentString = '<div class="map-info-window">' +
                '<img border="0" align="left" src="logo.png">'+
                marker.title + '</div>';

            return function() {
                if (markerRed) {
                    markerRed.setIcon('');
                }
                infowindow.setContent(boxList[this.id]);
                infowindow.open(map, marker);
                marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
                markerRed = marker;
            }
        })(marker, i)); //end add marker listener

        google.maps.event.addDomListener(boxList[i],'click',(function(marker, i) {
            return function() {
                changeCompanyProfile(mainCompanyPins[i][5]);
            }
        })(marker, i));
    } //endfor
}
/******************************************************************************************************************
 viewRequests.html
 ******************************************************************************************************************/

function populateViewReqServiceList(){
    document.getElementById('viewReqServ').innerHTML = populateServiceList();
}

function populateViewReqProcessList(){
    document.getElementById('viewReqProc').innerHTML = populateProcessList();
}

function populateViewReqMaterialList(){
    document.getElementById('viewReqMat').innerHTML = populateMaterialsList();
}

function validateViewReq(msg){

    var errorMessage = "";

    if((matChecked.length == 0) && (procChecked.length == 0) && (servChecked.length == 0)){
        errorMessage = "<br />Please select at least one material, process or service.";
    }

    if (!isValidEmailAddress($("#viewRequestEmail").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid email address.";
    }

    if (!isValidPhone($("#viewRequestPhone").val())) {

        errorMessage = "<br />Please enter a valid telephone number.";
    }

    if ((!isValidZipCode($("#viewRequestZipCode").val())) || ($.trim($("#viewRequestZipCode").val()) == "")) {
        errorMessage = "<br />Please enter a valid zipcode.";
    }

    if($.trim($("#viewRequestCountry").val()) == ""){
        errorMessage = "<br />Please enter a valid country.";
    }

    if($.trim($("#viewRequestCity").val()) == ""){
        errorMessage = "<br />Please enter a valid city.";
    }

    if($.trim($("#viewRequestAddress").val()) == ""){
        errorMessage = "<br />Please enter a valid address.";
    }

    if (!isValidWebsite($("#viewRequestWebsite").val().toLowerCase())) {
        errorMessage = "<br />Please enter a valid website.";
    }

    if($.trim($("#viewRequestName").val()) == ""){
        errorMessage = "<br />Please enter a valid business name.";
    }

    if (errorMessage == "") {

        // // alert("Success!");
        // // alert(msg);
        $("#viewReqContainer").load('addBusinessExtra.html', function(frm){
            loadBsnCatForm();
        });
    }

    else {
        $("#error").html(errorMessage);
    }
}

/******************************************************************************************************************
 main.html
 ******************************************************************************************************************/

function mainInitialize() {

    mainMap = new google.maps.Map(document.getElementById('googleMainMap'), {
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false,
        center: myMarker,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'styled']}
    });
    var styles = [
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#FFFFFF" }
            ]

        }
    ];
    var styledMapType = new google.maps.StyledMapType(styles, {
        map: mainMap,
        name: 'Styled Map'
    });

    mainMap.mapTypes.set('styled', styledMapType);
    mainMap.setMapTypeId('styled');
}


function loadMain(){
    userType();
    showAddBusinessMain();
    populateMainMaterialsList();
    populateMainProcessesList();
    populateMainServicesList();

    $("li > ul > li").mouseover(function(){
        $(this).css("color","blue");
    });

    $("li > ul > li").mouseout(function(){
        $(this).css("color","");
    });

    $("li ").mouseover(function(){
        $(this).css("cursor","pointer");
    });

}

function showAddBusinessMain(){
        // if(typeof GetCookie("userType") != 'undifined' && typeof GetCookie("userId") != 'undifined' && GetCookie("userId") != 0){
        if(GetCookie("userType") == 'regular' || GetCookie("userType") == 'admin'){
            $('#addBtag').remove();
			document.getElementById('addBusinessOption').innerHTML+= '<a id="addBtag" >Add a business</a>';
        }

}

function populateMainMaterialsList(){
//    // alert("I'm getting materials and submaterials");

    var dataToSend = {
        endpoint: 'material',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";
            var subCategory = '<li value="'; //value = subMaterialId
            var subCategory2 = '</li>';
            var matId = 0;

            for(var i=0; i < response.length; i++){
                matId = response[i].materialId;
                html1 += '<li class="input-group htmlAlign click0" name="material" value="' + response[i].materialId + '">' + response[i].materialName + '<ul class="subMaterialsMain">';
                html2 = "";
                html2 += subCategory + response[i].subMaterialId + '">' + response[i].subMaterialName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].materialId)){
                    i++;
                    html2 += subCategory + response[i].subMaterialId + '">' + response[i].subMaterialName + subCategory2;
                }
                html1 = html1 + html2 + '</ul></li>';
            }
            document.getElementById('materialsMain').innerHTML = html1;

            $('#materialsMain li > ul').css("display", "none");


            $('#materialsMain li').on('click', function () {
                $(this).children().css("display","block");

                if($(this).hasClass('click0')){
                    $(this).removeClass('click0').addClass('click1');
                }
                else if($(this).hasClass('click1')){
                    $(this).removeClass('click1').addClass('click2');
                }
                if($(this).hasClass('click2')){
//                    // alert(mClicks + " Nooooo");
                    var subIdClicked = ($(this).val());
                    makeSearch('mat',subIdClicked,'parent');
//                    matCompanies = matToShow;
                    matCompanies = intersect_safe(globalMat, matCompanies);
                    filterColumn('#processesMain li > ul');
                    filterColumn('#servicesMain li > ul');
                    filterColumn('#materialsMain li > ul');
                }
            });

            $('#materialsMain li > ul > li').on('click', function (e) {
                var subIdClicked = ($(this).val());
                matCompanies = subIdClicked;
                makeSearch('mat',subIdClicked,'child');
                matCompanies = intersect_safe(globalMat, matCompanies);
                filterColumn('#processesMain li > ul');
                filterColumn('#servicesMain li > ul');
                filterColumn('#materialsMain li > ul');
                e.stopPropagation();
            });
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });


}

function populateMainProcessesList(){

//    // alert("I'm getting materials and subprocess");

    var dataToSend = {
        endpoint: 'process',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";
            var subCategory = '<li value="'; //value = subMaterialId
            var subCategory2 = '</li>';
            var matId = 0;

            for(var i=0; i < response.length; i++){
                matId = response[i].processId;
                html1 += '<li class="input-group htmlAlign click0" name="process" value="' + response[i].processId + '">' + response[i].processName + '<ul>';
                html2 = "";
                html2 += subCategory + response[i].subProcessId + '">' + response[i].subProcessName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].processId)){
                    i++;
                    html2 += subCategory + response[i].subProcessId + '">' + response[i].subProcessName + subCategory2;
                }
                html1 = html1 + html2 + '</ul></li>';
            }
            document.getElementById('processesMain').innerHTML = html1;



            $('#processesMain li > ul').css("display", "none");


            $('#processesMain li').on('click', function () {
                $(this).children().css("display","block");

                if($(this).hasClass('click0')){
                    $(this).removeClass('click0').addClass('click1');
                }
                else if($(this).hasClass('click1')){
                    $(this).removeClass('click1').addClass('click2');
                }
                if($(this).hasClass('click2')){
//                    ("Nooooo");
                    var subIdClicked = ($(this).val());
                    makeSearch('proc',subIdClicked,'parent');
//                    procCompanies = procToShow;
                    procCompanies = intersect_safe(globalProc, procCompanies);
                    filterColumn('#processesMain li > ul');
                    filterColumn('#servicesMain li > ul');
                    filterColumn('#materialsMain li > ul');
                }
            });

            $('#processesMain li > ul > li').on('click', function (e) {
                var subIdClicked = ($(this).val());
//                // alert(subIdClicked);
                procCompanies = subIdClicked;
                makeSearch('proc',subIdClicked,'child');
                procCompanies = intersect_safe(globalProc, procCompanies);
                filterColumn('#processesMain li > ul');
                filterColumn('#servicesMain li > ul');
                filterColumn('#materialsMain li > ul');
                e.stopPropagation();
            });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function populateMainServicesList(){
//    // alert("I'm getting services and subservices");
//    var response;

    var dataToSend = {
        endpoint: 'service',
        code: '2'};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var html1 = "";
            var html2 = "";
            var subCategory = '<li value="'; //value = subMaterialId
            var subCategory2 = '</li>';
            var matId = 0;

            for(var i=0; i < response.length; i++){
                matId = response[i].serviceId;
                html1 += '<li class="input-group htmlAlign click0" name="services" value="' + response[i].serviceId + '">' + response[i].serviceName + '<ul>';
                html2 = "";
                html2 += subCategory + response[i].subServiceId +'">' + response[i].subServiceName + subCategory2;

                while(response.length-1 != i && (matId == response[i+1].serviceId)){
                    i++;
                    html2 += subCategory + response[i].subServiceId +'">' + response[i].subServiceName + subCategory2;
                }
                html1 = html1 + html2 + '</ul></li>';
            }
            document.getElementById('servicesMain').innerHTML = html1;

            $('#servicesMain li > ul').css("display", "none");

            $('#servicesMain li').on('click', function () {
                $(this).children().css("display","block");

                if($(this).hasClass('click0')){
                    $(this).removeClass('click0').addClass('click1');
                }
                else if($(this).hasClass('click1')){
                    $(this).removeClass('click1').addClass('click2');
                }
                if($(this).hasClass('click2')){
//                    // alert("Nooooo");
                    var subIdClicked = ($(this).val());
                    makeSearch('serv',subIdClicked,'parent');
//                    servCompanies = servToShow;
                    servCompanies = intersect_safe(globalServ, servCompanies);
                    filterColumn('#processesMain li > ul');
                    filterColumn('#servicesMain li > ul');
                    filterColumn('#materialsMain li > ul');
                }
            });


            $('#servicesMain li > ul > li').on('click', function (e) {
                var subIdClicked = ($(this).val());
                servCompanies = subIdClicked;
                makeSearch('serv',subIdClicked,'child');
                servCompanies = intersect_safe(globalServ, servCompanies);
                filterColumn('#processesMain li > ul');
                filterColumn('#servicesMain li > ul');
                filterColumn('#materialsMain li > ul');
                e.stopPropagation();
            });

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
         //   // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function filterColumn(column){
    $(column).find("li:not(:contains(" + (-1) + "))").slideUp();

    if(column == '#servicesMain li > ul'){
        $(column).css("display", "block");
        $(column).css("color","blue");

        for(var i = 0;i < globalServ.length; i++) {
            $(column).find("li[value=" + globalServ[i] + "]").slideDown();
            $(column).find("li[value=" + globalServ[i] + "]").parent().addClass("toShow");
        }
        $('#servicesMain li').find("ul:not(.toShow)").parent().css("display", "none");

        for(var i = 0;i < globalServ.length; i++) {
            $(column).find("li[value=" + globalServ[i] + "]").parent().removeClass("toShow");
        }
    }
    else if(column == '#processesMain li > ul'){
        $(column).css("display", "block");
        $(column).css("color","blue");

        for(var i = 0;i < globalProc.length; i++) {
            $(column).find("li[value=" + globalProc[i] + "]").slideDown();
            $(column).find("li[value=" + globalProc[i] + "]").parent().addClass("toShow");
        }
        $('#processesMain li').find("ul:not(.toShow)").parent().css("display", "none");

        for(var i = 0;i < globalProc.length; i++) {
            $(column).find("li[value=" + globalProc[i] + "]").parent().removeClass("toShow");
        }
    }
    else if(column == '#materialsMain li > ul'){
        $(column).css("display", "block");
        $(column).css("color","blue");

        for(var i = 0;i < globalMat.length; i++) {
            $(column).find("li[value=" + globalMat[i] + "]").slideDown();
            $(column).find("li[value=" + globalMat[i] + "]").parent().addClass("toShow");
        }
        $('#materialsMain li').find("ul:not(.toShow)").parent().css("display", "none");

        for(var i = 0;i < globalMat.length; i++) {
            $(column).find("li[value=" + globalMat[i] + "]").parent().removeClass("toShow");
        }
    };
}

//category = column clicked(mat,serv,proc), id = identifier, type = parent or child
function makeSearch(category, id, type){
    tempArray = [];
    procToShow = [];
    matToShow = [];
    servToShow = [];
    if (type == 'parent'){
        getAllChildren(id,category);
    }
    else{
        tempArray.push(id);
    }

    if(category == 'mat'){
        matToShow = tempArray;
        matCompanies = matToShow;
    }
    else if(category == 'proc'){
        procToShow = tempArray;
        procCompanies = procToShow;
    }
    else if(category == 'serv'){
        servToShow = tempArray;
        servCompanies = servToShow;
    }

    for(var i = 0; i < tempArray.length; i++){
        if(category == 'mat'){
            getRelatedProc(tempArray[i],procToShow,'mat');
            getRelatedServ(tempArray[i],servToShow,'mat');
        }
        else if(category == 'proc'){
            getRelatedMat(tempArray[i],matToShow,'proc');
            getRelatedServ(tempArray[i],servToShow,'proc');
        }
        else if(category == 'serv'){
            getRelatedMat(tempArray[i],matToShow,'serv');
            getRelatedProc(tempArray[i],procToShow,'serv');
        }
    }
    compareGlobals(matToShow, procToShow, servToShow);
    getMainCompanies(servCompanies, matCompanies, procCompanies);

}

function compareGlobals(matToShow, procToShow, servToShow){
    if(globalMat.length == 0) {
        globalMat = matToShow;
    }
    else{
//        // alert("entro else de interseccion. gMat: " + globalMat);
        globalMat = intersect_safe(matToShow,globalMat);
//        // alert('after: '+ globalMat);
    }

    if(globalProc.length == 0) {
        globalProc = procToShow;
    }
    else{
        globalProc = intersect_safe(procToShow,globalProc);
    }

    if(globalServ.length == 0) {
        globalServ = servToShow;
    }
    else{
        globalServ = intersect_safe(servToShow,globalServ);
    }
}

function intersect_safe(x, y){
    var ret = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                ret.push(x[i]);
                break;
            }
        }
    }
    return ret;
}

function getAllChildren(i, cat){

    var dataToSend = {
        endpoint: 'map',
        code: '3',
        category: cat,
        id: i
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var result = [];


            for(var i = 0; i < response.length;i++){
                if(cat == 'mat'){
                    result.push(response[i].subMaterialId);

                }
                else if(cat == 'proc'){
                    result.push(response[i].subProcessId);
                }
                else{
                    result.push(response[i].subServiceId);
                }

            }
            tempArray = result;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          //  // alert("Server Not Found: Please Try Again Later!");
        }
    });

};


function resetButton(){
    $('#processesMain').find('.click1').removeClass('click1').addClass('click0');
    $('#processesMain').find('.click2').removeClass('click2').addClass('click0');
    $('#processesMain li').css("display","block");
    $('#servicesMain').find('.click1').removeClass('click1').addClass('click0');
    $('#servicesMain').find('.click2').removeClass('click2').addClass('click0');
    $('#servicesMain li').css("display","block");
    $('#materialsMain').find('.click1').removeClass('click1').addClass('click0');
    $('#materialsMain').find('.click2').removeClass('click2').addClass('click0');
    $('#materialsMain li').css("display","block");
    $('#materialsMain li > ul').css({"display":"none","color":"black"});
    $('#servicesMain li > ul').css({"display":"none","color":"black"});
    $('#processesMain li > ul').css({"display":"none","color":"black"});
    globalMat = [];
    globalProc = [];
    globalServ = [];
    mainCompanyPins = [[]];
    procToShow = [];
    matToShow = [];
    servToShow = [];
    tempArray = [];
    matCompanies = [];
    servCompanies = [];
    procCompanies = [];
    resetMainMap();
};

function addMainMarkers(){
    if(timesCalled > 0){
        resetMainMap();
//        google.maps.event.trigger(mainMap, 'resize');
    }

    var marker; var i;
    var infowindow = new google.maps.InfoWindow({
        disableAutoPan: false
        ,isHidden:false
        ,maxWidth:900
        ,closeBoxURL: ""
        ,pane: "mapPane"
        ,enableEventPropagation: true
    });
    for (var i = 0; i < mainCompanyPins.length; i++)
    {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(mainCompanyPins[i][1], mainCompanyPins[i][2]),
            map: mainMap,
            animation:google.maps.Animation.DROP,
            id: i,
            title: mainCompanyPins[i][4]
        });

        var boxText = document.createElement("div");
        boxText.id = i;
        boxText.className = "labelText" + i;
        boxText.innerHTML = '<div class="map-info-window">' +
            mainCompanyPins[i][6] + mainCompanyPins[i][0];
        mainBoxList.push(boxText);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            var contentString = '<div class="map-info-window">' +
                '<img width="30" height="30" border="0" align="left" src="../images/default.gif">'+
                marker.title + '</div>';

            return function() {
                if (markerRed) {
                    markerRed.setIcon('');
                }
                infowindow.setContent(mainBoxList[this.id]);
                infowindow.open(mainMap, marker);
                marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
                markerRed = marker;
            }
        })(marker, i)); //end add marker listener

        google.maps.event.addListener(infowindow, 'closeclick', function() {
            if (markerRed) {
                markerRed.setIcon('');
            }
        });

        google.maps.event.addDomListener(mainBoxList[i],'click',(function(marker, i) {
            return function() {
//                getCompanyProfile(mainCompanyPins[i][5]);
//                marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
                viewBusinessInfo(mainCompanyPins[i][5]);
                mainCompanyPins.move(i,0);
            }
        })(marker, i));
        mainMarkers.push(marker);
    }
    timesCalled++;
}

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function resetMainMap() {
    for (var i = 0; i < mainMarkers.length; i++) {
        mainMarkers[i].setMap(null);
    }
    mainMarkers = [];
    mainBoxList = [];
}

function setLocationMarkers(json){
    mainCompanyPins = [[]];

    for(var j = 0; j < json.length; j++){
        mainCompanyPins.push([]);
        mainCompanyPins[j][0] = json[j].companyName;
        mainCompanyPins[j][1] = json[j].latitude;
        mainCompanyPins[j][2] = json[j].longitude;
        mainCompanyPins[j][3] = j;
        mainCompanyPins[j][4] = json[j].companyName;
        mainCompanyPins[j][5] = json[j].companyId;

        if(json[j].logoType == null){
            mainCompanyPins[j][6] = '<img width="50" height="50" border="0" align="left"  src="images/default.gif">';
        }
        else{
            mainCompanyPins[j][6] = '<img class="img-rounded" src=data:' + json[j].logoType + ";base64,"
                + json[j].logo +  ' width="50" height="50" align="left">';
        }

    }
    mainCompanyPins.pop();
    addMainMarkers()
}

function getMainCompanies(s, m, p){

//    // alert("Getting all Main Companies ");
//    // alert("S: "+s+"  M: "+m+"  P: "+p);

    var dataToSend = {
        endpoint: 'map',
        code: '4',
        global_serv: s,
        global_proc: p,
        global_mat: m
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
//            document.getElementById("answer").innerHTML = JSON.stringify(response);
            setLocationMarkers(response);

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
        //    // alert("Server Not Found: Please Try Again Later!");
        }
    });

};

function getRelatedProc(child, procToShow1, catToQuery){
//    // alert("Getting Related Processes.");

    var dataToSend = {
        endpoint: 'map',
        code: '5',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var toReturn = [];
            toReturn = procToShow1;
            var result = []; //SQL call function with query that returns all results depending in the catToQuery

            for(var i = 0; i < response.length;i++){
                result.push(response[i].subProcessId);
            }

            if(procToShow1.length > 0){
                myArray = result.filter( function( el ) {
                    return procToShow1.indexOf( el ) < 0;
                });
                for(var i = 0; i < myArray.length; i++){
                    toReturn.push(myArray[i]);
                }
                procToShow = toReturn;
            }

            else
                procToShow = result;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getRelatedServ(child, servToShow1, catToQuery){
//    // alert("Getting Related Services.");
    var dataToSend = {
        endpoint: 'map',
        code: '6',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var toReturn = [];
            toReturn = servToShow1;
            var result = []; //SQL call function with query that returns all results in

            for(var i = 0; i < response.length;i++){
                result.push(response[i].subServiceId);
            }

            if(servToShow1.length > 0){
                myArray = result.filter( function( el ) {
                    return servToShow1.indexOf( el ) < 0;
                });
                for(var i = 0; i < myArray.length; i++){
                    toReturn.push(myArray[i]);
                }
                servToShow = toReturn;
            }
            else{
                servToShow = result;
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getRelatedMat(child,  matToShow1, catToQuery){
//    // alert("Getting Related Materials.");
    var dataToSend = {
        endpoint: 'map',
        code: '7',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            var toReturn = [];
            toReturn = matToShow1;
            var result = []; //SQL call function with query that returns all results in MAP

            for(var i = 0; i < response.length;i++){
                result.push(response[i].subMaterialId);
            }

            if(catToQuery = 'proc'){
                //result = a query related to the catToQuery (MAS,PAM)
            }
            else if(catToQuery = 'serv'){
                //do other query
            }

            if(matToShow1.length > 0){
                myArray = result.filter( function( el ) {
                    return matToShow.indexOf( el ) < 0;
                });
                for(var i = 0; i < myArray.length; i++){
                    toReturn.push(myArray[i]);
                }
                matToShow = toReturn;
            }
            else{
                matToShow = result;
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}


function loadPage(pg){
    turnOffScroll();
	
	if(typeof GetCookie("userType") != 'undifined' && typeof GetCookie("userId") != 'undifined' && GetCookie("userId") != 0){
	
	var dataToSend = {
			dirinfo: GetCookie("userType")+GetCookie("userId")
		};
		$.ajax({
			url: './html/deletiontest.php',
			data: dataToSend,
			success: function (response) {
			   //// alert("Wuuju Folders Emptied!");  
			},
			error: function () {
				//console.log("Folder delete ERROR!");				
			}
		});	 
	}
	switch (pg){
        case 'main':
            loadMain();
            break;

        case 'goToMain':
            location.reload();
            break;


        case 'sbmaterial':
            $('#overallContainer').load('html/searchByMaterial.html', function(){
                boxList = [];
                loadSearchByMaterial();
            });
            break;

        case 'sbprocess':
            $('#overallContainer').load('html/searchByProcess.html', function(){
                boxList = [];
                loadSearchByProcess();
            });
            break;

        case 'sbservice':
            $('#overallContainer').load('html/searchByService.html', function(){
                boxList = [];
                loadSearchByService();
            });
            break;

        case 'sbbusiness':
            $('#overallContainer').load('html/searchByBusiness.html', function(){
                boxList = [];
                showAllBusinessFromSearch();
            });
            break;

        case 'submitBusiness':
            $('#overallContainer').load('html/submitBusiness.html', function(){
				dropzoneSubmitBsnPhoto();
			});
            break;

        case 'article':
            $('#overallContainer').load('html/viewArticles.html', function(){
                articleToShow = 8388607;
                loadAllArticles();
                $(window).scroll(myScrollHandler);
            });
            break;

        case 'addAdmin':
            $('#overallContainer').load('html/addAdmin.html', function(){
            });
            break;

        case 'addArticle':
            $('#overallContainer').load('html/addArticle.html', function(){
				dropzoneArticlePic();
            });
            break;

        case 'addBusiness':
            $('#overallContainer').load('html/addBusiness.html', function(){
                addingCompany = 1;
                loadAddBusiness();
            });
            break;

        case 'addMaterial':
            $('#overallContainer').load('html/addNewMaterial.html', function(){
                loadAddNewMat();
            });
            break;

        case 'addProcess':
            $('#overallContainer').load('html/addNewProcess.html', function(){
                loadAddNewProc();
            });
            break;

        case 'addService':
            $('#overallContainer').load('html/addNewService.html', function(){
                loadAddNewServ();
            });
            break;

        case 'controlPanel':
            $('#overallContainer').load('html/adminControlPanel.html', function(){
                loadControlPanel();
            });
            break;

        case 'changeAdminPassword':
            $('#overallContainer').load('html/changeAdminPassword.html', function(){

            });
            break;

        case 'changePassword':
            $('#overallContainer').load('html/changePassword.html', function(){

            });
            break;

        case 'editAccount':
            $('#overallContainer').load('html/editAccount.html', function(){
                loadEditAccount();
            });
            break;

        case 'editArticleSelector':
            $('#overallContainer').load('html/editArticleSelector.html', function(){
                showArticlesToEdit();
            });
            break;

        case 'editBusinessSelector':
            $('#overallContainer').load('html/editBusinessSelector.html', function(){
                addingCompany = 0;
                showBusinessesToEdit();
            });
            break;

        case 'editMaterialConn':
            $('#overallContainer').load('html/editMaterialConnections.html', function(){
                loadEditMatConn();
            });
            break;

        case 'editProcessConn':
            $('#overallContainer').load('html/editProcessConnections.html', function(){
                loadEditProcConn();
            });
            break;

        case 'editServiceConn':
            $('#overallContainer').load('html/editServiceConnections.html', function(){
                loadEditServConn();
            });
            break;

        case 'login':
            $('#overallContainer').load('html/login.html', function(){

            });
            break;

        case 'loginAdmin':
            $('#overallContainer').load('html/loginAdmin.html', function(){

            });
            break;

        case 'pendingRequest':
            $('#overallContainer').load('html/pendingRequests.html', function(){
                loadPendingRequest();
            });
            break;

        case 'recoverPassword':
            $('#overallContainer').load('html/recoverPassword.html', function(){

            });
            break;

        case 'recoverPasswordAdmin':
            $('#overallContainer').load('html/recoverPasswordAdmin.html', function(){

            });
            break;

        case 'register':
            $('#overallContainer').load('html/register.html', function(){

            });
            break;

        case 'removeAdmin':

            $('#overallContainer').load('html/removeAdministrator.html', function(){

                getAdmins();


            });
            break;

        case 'removeArticle':
            $('#overallContainer').load('html/removeArticles.html', function(){
                loadRemoveArticles();
            });
            break;

        case 'removeBusiness':
            $('#overallContainer').load('html/removeBusiness.html', function(){
                loadRemoveBusiness()
            });
            break;

        case 'removeMaterial':
            $('#overallContainer').load('html/removeMaterial.html', function(){
                loadRemoveMaterial();
            });
            break;

        case 'removeProcess':
            $('#overallContainer').load('html/removeProcess.html', function(){
                loadRemoveProcess();
            });
            break;

        case 'removeService':
            $('#overallContainer').load('html/removeServices.html', function(){
                loadRemoveService();
            });
            break;

        case 'searchResult':
            $('#overallContainer').load('html/searchResults.html', function(){
                loadSearchResults();
            });
            break;

        case 'viewSubmission':
            $('#overallContainer').load('html/viewRequest.html', function(){

            });
            break;

        case 'aboutUs':
            $('#overallContainer').load('html/aboutUs.html', function(){

            });
            break;

        case 'contactUs':
            $('#overallContainer').load('html/contactUs.html', function(){

            });
            break;
        default:
            return;
    }
}

//google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', mainInitialize);


function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCJdq7z8PRPSXIBNk3hHFLBxgrj48rde2I&sensor=false&' +
        'callback=initialize';
    document.body.appendChild(script);
}


function modifyUser(id, name, lastname, occupation, city){
    console.log("I'm modifying user " + name);
    var dataToSend = {
        endpoint: 'users',
        code: '2',
        uid: id,
        uname: name,
        ulname: lastname,
        uoccu: occupation,
        ucity: city,
        du: true
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('goToMain');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

function modifyAdmin(id, name, lastname, occupation, city){
    console.log("I'm adding admin " + name);

    var dataToSend = {
        endpoint: 'admin',
        code: '2',
        du: true,
        aid: id,
        aname: name,
        alname: lastname,
        aoccu: occupation,
        acity: city
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            loadPage('goToMain');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

function changeUserPassword(email,pass,id){
    console.log("I'm recovering password for " + email + "and userId = " + id);

    var dataToSend = {
        endpoint: 'users',
        code: '4',
        du: true,
        uemail: email,
        upass: pass,
        uid: id
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(data.resp);

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

function changeAdminPassword(email,pass,id){
    console.log("I'm recovering password for " + email + "and userId = " + id);

    var dataToSend = {
        endpoint: 'admin',
        code: '4',
        du: true,
        aemail: email,
        aid: id,
        apass: pass
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewAdmin(email,pass, name, lastname, occupation, birthday, city, type){
    console.log("I'm adding admin " + name);

    var dataToSend = {
        endpoint: 'admin',
        code: '0',
        du: true,
        aemail: email,
        apass: pass,
        aname: name,
        tp: type,
        alname: lastname,
        aoccu: occupation,
        abdate: birthday,
        acity: city
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
			loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};

function addNews(id, title, body, image){
    console.log("Add News " + title);

    var dataToSend = {
        endpoint: 'news',
        code: '3',
        aid: id,
        du: true,
        ntitle: title,
        nbody: body,
        nimag: image
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            if(response[0].number == 1){
                var dzObj = Dropzone.forElement("#dropzone-article-photo");
				//// alert("EXECUTING DZ");
				executeDropzone(dzObj);
				loadPage('controlPanel');
            }
            else{
                console.log('Stuff');
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewSubmaterial(mid, sid, pid, subName){
    console.log("Adding Submaterial " + subName+ " to Material  " + mid);

    var dataToSend = {
        endpoint: 'material',
        code: '6',
        multi: true,
        du: true,
        ssid: sid,
        smid: mid,
        spid: pid,
        subName: subName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            loadPage('controlPanel');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewMaterial(sid, pid, superName, subName){
    console.log("Adding New Material  " + superName + " and Submaterial " + subName);

    var dataToSend = {
        endpoint: 'material',
        code: '7',
        multi: true,
        du: true,
        ssid: sid,
        spid: pid,
        subName: subName,
        name: superName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewSubprocess(mid, sid, pid, subName){
    console.log("Adding subProcess " + subName+ " to Process  " + mid);

    var dataToSend = {
        endpoint: 'process',
        code: '6',
        multi: true,
        du: true,
        ssid: sid,
        smid: mid,
        spid: pid,
        subName: subName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewProcess(mid, sid, superName, subName){
    console.log("Adding New Process  " + superName + " and subProcess " + subName);

    var dataToSend = {
        endpoint: 'process',
        code: '7',
        multi: true,
        du: true,
        ssid: sid,
        smid: mid,
        subName: subName,
        name: superName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            loadPage('controlPanel');

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewSubservice(mid, sid, pid, subName){
    console.log("Adding Subservice " + subName+ " to Service  " + sid);

    var dataToSend = {
        endpoint: 'service',
        code: '6',
        multi: true,
        du: true,
        ssid: sid,
        smid: mid,
        spid: pid,
        subName: subName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('controlPanel')
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewService(mid, pid, superName, subName){
    console.log("Adding New Service  " + superName + " and Subservice " + subName);

    var dataToSend = {
        endpoint: 'service',
        code: '7',
        multi: true,
        du: true,
        smid: mid,
        spid: pid,
        subName: subName,
        name: superName
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('controlPanel')
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function changeSubmaterialConnection(mid, sid, pid){
    console.log("Changing submaterial Connection to  " + mid);

    var dataToSend = {
        endpoint: 'material',
        code: '5',
        du: true,
        multi: true,
        ssid: sid,
        smid: mid,
        spid: pid
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            loadPage('controlPanel')
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function changeSubprocessConnection(mid, sid, pid){
    console.log("Changing subprocess Connection to  " + pid);
    console.log("Material array length: " + mid.length);
    var dataToSend = {
        endpoint: 'process',
        code: '5',
        du: true,
        multi: true,
        ssid: sid,
        smid: mid,
        spid: pid
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function changeSubserviceConnection(mid, sid, pid){
    console.log("Changing subservice Connection to  " + sid);

    var dataToSend = {
        endpoint: 'service',
        code: '5',
        du: true,
        multi: true,
        ssid: sid,
        smid: mid,
        spid: pid
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getMaterialRelated(){
    var ddl = document.getElementById("editMatTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;
    removeSelectedCheckboxes();
    getRelatedProccesses(selectedValue, 'mat');
    getRelatedServices(selectedValue, 'mat');
}

function getProcessRelated(){
    var ddl = document.getElementById("editProcTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;
    removeSelectedCheckboxes();
    getRelatedMaterials(selectedValue, 'proc');
    getRelatedServices(selectedValue, 'proc');
}

function getServiceRelated(){
    var ddl = document.getElementById("editServTypes");
    var selectedValue = ddl.options[ddl.selectedIndex].value;
    removeSelectedCheckboxes()
    getRelatedMaterials(selectedValue, 'serv');
    getRelatedProccesses(selectedValue, 'serv');
}

function removeSelectedCheckboxes(m,p,s){
    $('input[type="checkbox"]').each(function(){
        this.checked = false;
    });
}


function getRelatedProccesses(child, catToQuery){

    var dataToSend = {
        endpoint: 'map',
        code: '5',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            for(var i = 0; i < response.length; i++) {
                $("input[type='checkbox'][name='subProcess'][value='" + response[i].subProcessId + "']").prop("checked", true);

            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getRelatedServices(child, catToQuery){
    var dataToSend = {
        endpoint: 'map',
        code: '6',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            for(var i = 0; i < response.length; i++){
                $("input[type='checkbox'][name='subService'][value='"+response[i].subServiceId+"']").prop("checked", true);
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });

}

function getRelatedMaterials(child, catToQuery){
    var dataToSend = {
        endpoint: 'map',
        code: '7',
        id: child,
        pivot_column: catToQuery
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        async: false,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = data.resp;
            for(var i = 0; i < response.length; i++){
                $("input[type='checkbox'][name='subMaterial'][value='"+response[i].subMaterialId+"']").prop("checked", true);
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            // alert("Server Not Found: Please Try Again Later!");
        }
    });
}

function addNewCompany(admin, company, video, website, telephone, description, logo, email, processes, services, materials, ln, theCity, country, zipcode, lati, longi ){
//    console.log("I'm adding a new business");

    var dataToSend = {
        endpoint: 'company',
        code: '8',
        aid: admin,
        du: true,
        multi: true,
        name: company,
        URL: video,
        site: website,
        phone: telephone,
        descr: description,
        img: logo,
        cemail: email,
        spids: processes,
        smids: materials,
        ssids: services,
        line: ln,
        city: theCity,
        count: country,
        zip: zipcode,
        lat: lati,
        lon: longi};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('controlPanel')
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function viewSubmission(id){
    console.log("Getting submission " + id);

    var dataToSend = {
        endpoint: 'submissions',
        code: '5',
        subid: id
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(data.resp);
            var response = data.resp[0];

            var subId = response.submissionId;
            var companyName1 = response.companyName;
            var website = response.website;
            var telephone = response.phone;
            var description = response.description;
            var email = response.email;
            var address = response.line;
            var city = response.city;
            var country = response.country;
            var zipcode = response.zipcode;

            document.getElementById("submissionId").value = subId;
            document.getElementById("viewRequestName").value = companyName1;
            document.getElementById("viewRequestWebsite").value = website;
            document.getElementById("viewRequestAddress").value = address;
            document.getElementById("viewRequestCity").value = city;
            document.getElementById("viewRequestCountry").value = country;
            document.getElementById("viewRequestZipCode").value = zipcode;
            document.getElementById("viewRequestEmail").value = email;
            document.getElementById("viewRequestDescription").value = description;
            document.getElementById("viewRequestPhone").value = telephone;
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function changeStateOfSubmission(id){
    console.log("Marking Submission as Read");

    var dataToSend = {
        endpoint: 'submissions',
        du: true,
        code: '2',
        subid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function deleteSubmission(id){
    console.log("Getting all submissions");
    //var id = myForm.submissionId.value;
    var dataToSend = {
        endpoint: 'submissions',
        code: '1',
        du: true,
        subid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('#viewReqModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function preDelete(){
    var myId = document.getElementById('submissionId').value;
    addBsnType = 0;
    deleteSubmission(myId);
    loadPage('controlPanel');
}

function getCompanyInfo(id){
    console.log("I'm getting a business profile");

    var dataToSend = {
        endpoint: 'company',
        code: '7',
        cid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp[0];

            var companyName = response.companyName;
            var website = response.website;
            var telephone = response.phone;
            var description = response.description;
            var email = response.email;
            var address = response.line;
            var city = response.city;
            var country = response.country;
            var zipcode = response.zipcode;
            var videoURL = response.videoURL;

            document.getElementById("companyId").value = response.companyId;
            document.getElementById("editBsnName").value = companyName;
            document.getElementById("editBsnWebsite").value = website;
            document.getElementById("editBsnAddress").value = address;
            document.getElementById("editBsnCity").value = city;
            document.getElementById("editBsnCountry").value = country;
            document.getElementById("editBsnZipCode").value = zipcode;
            document.getElementById("editBsnEmail").value = email;
            document.getElementById("editBsnDescription").value = description;
            document.getElementById("editBsnTelephone").value = telephone;
            document.getElementById("editBsnVideoURL").value = videoURL;


        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function getEditSubmaterials(company){
    console.log("I'm getting all submaterials of company");

    var dataToSend = {
        endpoint: 'company',
        code: '4',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            for(var i = 0; i < response.length; i++){
                $("input[type='checkbox'][name='subMaterial'][value='" + response[i].subMaterialName + ',' +
                    response[i].subMaterialId + ',' + response[i].materialId + "']").prop("checked", true);
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};


function getEditSubProcesses(company){
    console.log("I'm getting all subprocess of company");

    var dataToSend = {
        endpoint: 'company',
        code: '3',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            console.log("I'm getting all subprocess of company22222");

            var response = data.resp;
            for(var i = 0; i < response.length; i++){
                $("input[type='checkbox'][name='subProcess'][value='" + response[i].subProcessName + ',' +
                    response[i].subProcessId + ',' + response[i].processId + "']").prop("checked", true);
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
}


function getEditSubServices(company){
    console.log("I'm getting all subservices of company");

    var dataToSend = {
        endpoint: 'company',
        code: '2',
        cid: company };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            console.log("I'm getting all subservices of company222222");

            var response = data.resp;
            for(var i = 0; i < response.length; i++){
                $("input[type='checkbox'][name='subService'][value='" + response[i].subServiceName + ',' +
                    response[i].subServiceId + ',' + response[i].serviceId + "']").prop("checked", true);
            }

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function businessExtraInfo(id, arreglo, target){
    console.log("I'm getting additional info for " + target+ " company: " + id );

    var myCode = "";

    switch(target){

        case 'subMaterial':
            myCode = '12';
            break;

        case 'subProcess':
            myCode = '10';
            break;

        case 'subService':
            myCode = '11';
            break;

        default:
            console.log("Wrong Target!!");
            return;
            break;
    }

    var dataToSend = {
        endpoint: 'company',
        code: myCode,
        cid: id,
        arr: arreglo
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var response = data.resp;
            //modMat5, modProc5, modServ5
            //appMat5, appProc5, appServ5,
            //limitMat5,
            var modelo;
            var appli;
            var limi;

            if(target == 'subMaterial'){
                modelo = 'modMat';
                appli = 'appMat';
                limi = 'limitMat';
                for(var i = 0; i < response.length; i++){
                    console.log(document.getElementsByName(modelo + response[i].subMaterialId));
                    document.getElementById(modelo + response[i].subMaterialId).value = response[i].model;
                    document.getElementById(appli + response[i].subMaterialId).value = response[i].application;
                    document.getElementById(limi + response[i].subMaterialId).value = response[i].limitation;
                    console.log(document.getElementById(modelo + response[i].subMaterialId).value);
                }
            }
            else if (target == 'subProcess'){
                modelo = 'modProc';
                appli = 'appProc';
                limi = 'limitProc';
                for(var i = 0; i < response.length; i++){
                    document.getElementById(modelo + response[i].subProcessId).value = response[i].model;
                    document.getElementById(appli + response[i].subProcessId).value = response[i].application;
                    document.getElementById(limi + response[i].subProcessId).value = response[i].limitation;
                }
            }
            else{
                modelo = 'modServ';
                appli = 'appServ';
                limi = 'limitServ';
                for(var i = 0; i < response.length; i++){
                    document.getElementById(modelo + response[i].subServiceId).value = response[i].model;
                    document.getElementById(appli + response[i].subServiceId).value = response[i].application;
                    document.getElementById(limi + response[i].subServiceId).value = response[i].limitation;
                }
            }



        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function modifyCompany(id, company, video, website, telephone, description, logo, email, processes, services, materials, ln, theCity, country, zipcode, lati, longi){
    console.log("I'm modifying company " + id);

    var dataToSend = {
        endpoint: 'company',
        code: '9',
        du: true,
        multi: true,
        cid: id,
        name: company,
        URL: video,
        site: website,
        phone: telephone,
        descr: description,
        img: logo,
        cemail: email,
        spids: processes,
        smids: materials,
        ssids: services,
        line: ln,
        city: theCity,
        count: country,
        zip: zipcode,
        lat: lati,
        lon: longi};

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('Company Edited');
            loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function viewNews(id){
    console.log("Getting news " + id);

    var dataToSend = {
        endpoint: 'news',
        code: '1',
        nid: id };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
			dropzoneEditArticlePic(id);
            var response = data.resp;
            var title= response[0].title;
            var body = response[0].body;

            document.getElementById("newsId").value = id;
            document.getElementById("editArticleTitle").value = title;
            document.getElementById("editArticleDesc").value = body;

        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function updateNews(id, title, body){
    console.log("Add News " + title);

    var dataToSend = {
        endpoint: 'news',
        code: '4',
        du: true,
        nid: id,
        ntitle: title,
        nbody: body,
    };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('Updating article: ' + title);
            var dzObj = Dropzone.forElement("#dropzone-edit-article-photo");
			executeDropzone(dzObj);
			loadPage('controlPanel');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addSubmission(id, name, website, description, phone, email, line, city, country, zip){
    console.log("Adding submission");

    var dataToSend = {
        endpoint: 'submissions',
        uid: id,
        du: true,
        sname: name,
        swebsite: website,
        sdescription: description,
        sphone: phone,
        semail: email,
        sline: line,
        scity: city,
        scountry: country,
        szip: zip,
        code: '3' };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var dzObj = Dropzone.forElement("#dropzone-submit");
            if(dzObj.getQueuedFiles().length != 0){
				executeDropzoneSubmission(dzObj);
            }
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });
};

function addNewUser(email,pass, name, lastname, occupation, birthday, city){
     console.log("I'm adding user " + name);
    
	 var dataToSend = {
        endpoint: 'users',
        code: '1',
		du: true,
        uemail: email,
        upass: pass,
        uname: name,
        ulname: lastname, 
        uoccu: occupation, 
        ubdate: birthday,
        ucity: city
        };

    $.ajax({
        url: "../Server/prds.php",
        data: dataToSend,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            loadPage('goToMain');
        },
        error: function (data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
            console.log("Server Not Found: Please Try Again Later!");
        }
    });

};
