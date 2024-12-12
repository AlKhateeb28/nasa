var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var pagesVisited = [];
var currentPage = 1;

var notifyElement;

function visitPage(pageNumber) {
    for(let i= 1; i<= pagesVisited.length; i++) {
        if(i === pageNumber) {
            if(!pagesVisited[pageNumber]) {
                pagesVisited[pageNumber] = true;

                return true;
            } else {
                return false;
            }
        }
    }

    return false;
}

function initVisitPage(isVisit) {
    pagesVisited.push(isVisit);
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

function getMonthFromDatetime(datetime) {
    const currentDate = new Date(datetime).toLocaleString("ru-RU").split(",")[0];

    return parseInt(currentDate.split(".")[1]);
}

function getYearFromDatetime(datetime) {
    const currentDate = new Date(datetime).toLocaleString("ru-RU").split(",")[0];

    return parseInt(currentDate.split(".")[2]);
}

function getCurrentYear() {
    const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

    return parseInt(currentDate.split(".")[2]);
}

function showNotification(message){
    notifyElement = document.createElement("div");

    notifyElement.id = "stickyNotification";
    notifyElement.style.display = "block";
    notifyElement.style.position = "absolute";
    notifyElement.style.width = "350px";
    notifyElement.style.height = "150px";
    notifyElement.style.padding = "10px";
    notifyElement.style.borderRadius = "5px";
    notifyElement.style.border = "1px solid black";
    notifyElement.style.right = "10px";
    notifyElement.style.bottom = "10px";
    notifyElement.style.backgroundColor = "whitesmoke";
    notifyElement.innerHTML = "<div>" +
        "<div>" +
        "<div style='background-color: red; font-weight: bold; color: white; text-align: center; width: 91%;margin-left: -6px; padding-right: 18px;'>Внимание</div>" +
        "<div style='float: right; margin-top: -17px; cursor: pointer;'><img src='images/close.png' style='width: 16px; height: 16px; cursor: pointer;' onclick='document.body.removeChild(notifyElement);';></div>" +
        "</div>" +
        "<div style='color: black; background-color: whitesmoke; margin-top: 10px;'>" + message + "</div>" +
        "</div>";
    document.body.appendChild(notifyElement);

    document.addEventListener("scroll", (event) => {
        let btmPos = -window.scrollY + 10;
        notifyElement.style.bottom = btmPos + "px";
    });

    setTimeout(function() {
        document.body.removeChild(notifyElement);
    }, 30000 );
}

function onPageChange(pageNumber) {
    if(pageNumber === currentPage) {
        return;
    }

    for(let i = 1; i <= pagesVisited.length; i++) {
        const tabElement = $("#tab" + i);
        tabElement.css("color", "#212529");
        tabElement.css("background-color", "");
        tabElement.css("border-radius", "");
        $("#page" + i).css("display", "none");
    }

    const tabElement = $("#tab" + pageNumber);
    tabElement.css("color", "#008cff");
    tabElement.css("background-color", "#d8edfd");
    tabElement.css("border-radius", "3px");
    $("#page" + pageNumber).css("display", "block");

    if(tabElement.attr("refreshMethod").length > 0) {
        eval(tabElement.attr("refreshMethod"));
    }

    currentPage = pageNumber;
}

function login() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/",
        async: false,
        type: "GET",
        dataType: "text",
        success: function (data) {},
        error: function(error) {}
    });
}

function template(templateId) {
    return $("#" + templateId).html();
}

function getMonthAndYearSuffix() {
    let monthName = "";

    switch (getMonthFromDatetime(new Date())) {
        case 1 :
            monthName = "Январь";
            break;
        case 2 :
            monthName = "Февраль";
            break;
        case 3 :
            monthName = "Март";
            break;
        case 4 :
            monthName = "Апрель";
            break;
        case 5 :
            monthName = "Май";
            break;
        case 6 :
            monthName = "Июнь";
            break;
        case 7 :
            monthName = "Июль";
            break;
        case 8 :
            monthName = "Август";
            break;
        case 9 :
            monthName = "Сентябрь";
            break;
        case 10 :
            monthName = "Октябрь";
            break;
        case 11 :
            monthName = "Ноябрь";
            break;
        case 12 :
            monthName = "Декабрь";
            break;
    }

    return monthName + " " + getYearFromDatetime(new Date());
}

$(document).ready(function () {
    login();

    $(".diff-title").attr("title", "Разница с прошлым месяцем");

    $("#tab_box").css("display", "block");
});