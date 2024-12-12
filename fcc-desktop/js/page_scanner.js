"use strict";

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange=function(){
    if (httpRequest.readyState==4 && httpRequest.status==200) {
        $("#main_box").html(httpRequest.responseText);
    }
}

$(document).ready(function () {
    httpRequest.open("GET", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/home?mode=home", false);
    httpRequest.send();
});