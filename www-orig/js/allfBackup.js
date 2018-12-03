
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

    alert(unescape(document.cookie));
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
        uid : id }