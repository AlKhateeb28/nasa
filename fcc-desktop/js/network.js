"use strict";

var checkBox = null;

let TEST_SRV_histories = [];
let PROD_SRV_histories = [];

let serverHosts = [];
let host = {};

host.id = "TEST_SRV";
host.ip = "10.176.10.36";
host.port = 7;
host.parentId = "testServer_tbl";
host.title = "Server";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "TEST_SRV_WWW";
host.ip = "10.176.10.36";
host.port = 8080;
host.parentId = "testServer_tbl";
host.title = "Web";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "TEST_SRV_SQL";
host.ip = "10.176.10.36";
host.port = 1433;
host.parentId = "testServer_tbl";
host.title = "SQL";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "PROD_SRV";
host.ip = "192.168.0.96";
host.port = 7;
host.parentId = "prodServer_tbl";
host.title = "Server";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "PROD_SRV_WWW";
host.ip = "192.168.0.96";
host.port = 80;
host.parentId = "prodServer_tbl";
host.title = "Web";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "PROD_SRV_97";
host.ip = "192.168.0.97";
host.port = 7;
host.parentId = "prodServer97_tbl";
host.title = "Server";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "PROD_SRV_97_SQL";
host.ip = "192.168.0.97";
host.port = 1433;
host.parentId = "prodServer97_tbl";
host.title = "SQL";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV";
host.ip = "10.176.10.119";
host.port = 7;
host.parentId = "postServer_tbl";
host.title = "Server";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_25";
host.ip = "10.176.10.119";
host.port = 25;
host.parentId = "postServer_tbl";
host.title = "TCP";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_465";
host.ip = "10.176.10.119";
host.port = 465;
host.parentId = "postServer_tbl";
host.title = "TCP";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_857";
host.ip = "10.176.10.119";
host.port = 857;
host.parentId = "postServer_tbl";
host.title = "TCP";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_110";
host.ip = "10.176.10.119";
host.port = 110;
host.parentId = "postServer_tbl";
host.title = "POP3";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_995";
host.ip = "10.176.10.119";
host.port = 995;
host.parentId = "postServer_tbl";
host.title = "POP3";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_143";
host.ip = "10.176.10.119";
host.port = 143;
host.parentId = "postServer_tbl";
host.title = "IMAP";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

host = {};
host.id = "POST_SRV_993";
host.ip = "10.176.10.119";
host.port = 993;
host.parentId = "postServer_tbl";
host.title = "IMAP";
host.observe = true;
host.prevPingTime = 0
serverHosts.push(host);

function newHistory() {
    let history = {};
    history.id = null;
    history.index = null;
    history.pingTime = null;

    return history;
}

function calculateDurationTime(startDateTime, currentDateTime) {
    let duration = currentDateTime - startDateTime;

    var ms =  duration % 1000;
    duration = (duration - ms) / 1000;
    var secs = duration % 60;
    duration = (duration - secs) / 60;
    var mins = duration % 60;
    var hrs = (duration - mins) / 60;

    return hrs.toString().padStart(2, "0") + ':' + mins.toString().padStart(2, "0") + ':' + secs.toString().padStart(2, "0");
}

function getCurrentTime() {
    const currentDate = new Date();

    return currentDate.getHours().toString().padStart(2, "0") + ":" +
        currentDate.getMinutes().toString().padStart(2, "0") + ":" +
        currentDate.getSeconds().toString().padStart(2, "0");
}

function addTimeElement(host, timeParent) {
    let timeCount = parseInt( timeParent.attr("count") );
    timeCount++;

    if(timeCount > 1) {
        if(timeCount >= 17) {
            $("#" + host.id + "_time .time-box").last().remove();
        }
        // Decrease paddiing-left value for prev child element
        const prevChildElement = $("#" + host.id + "_time_element" + (timeCount - 1));
        prevChildElement.css("padding-left", (parseInt(timeParent.attr("step")) - 30) + "px");
    }

    timeParent.attr("count", timeCount);
    timeParent.attr("step", 0);

    $("#" + host.id + "_time").prepend(kendo.template($("#time_template").html()));

    $("#tmp_time_element").attr("id", host.id + "_time_element" + timeCount);

    const timeElement = $("#" + host.id + "_time_element" + timeCount);
    timeElement.attr("step", timeCount);
    timeElement.html(getCurrentTime());
}

function handleHistories(host, milliseconds) {
    let history = newHistory();
    history.id = host.id;
    history.pingTime = milliseconds;

    const historyParent =  $("#" + host.id + "_history");
    let elementCount = parseInt( historyParent.attr("count") );

    elementCount++;

    const timeParent = $("#" + host.id + "_time");

    if(elementCount === 1) {
        addTimeElement(host, timeParent);
    } else {
        const timeElement = $("#" + host.id + "_time_element" + timeParent.attr("count"));
        let timeElementStep = parseInt(timeParent.attr("step"));

        if(elementCount % 16 === 0) {
            addTimeElement(host, timeParent);
        } else {
            timeElement
                .css(
                    "padding-left",
                    ( timeElementStep + 5) + "px"
                );

            timeElementStep += 6;
            timeParent.attr("step", timeElementStep);
        }
    }

    if(elementCount >= 275) {
        $("#" + host.id + "_history .server-vertical-block").last().remove();
    }

    historyParent.prepend(kendo.template($("#history_template").html()));

    $("#history_empty_el").attr("id", host.id + "_history_empty_el" + elementCount);
    $("#history_el").attr("id", host.id + "_history_el" + elementCount);

    let historyEmptyChild = $("#" + host.id + "_history_empty_el" + elementCount);
    let historyChild = $("#" + host.id + "_history_el" + elementCount);

    let pingColor = "";
    if(milliseconds > 0 && milliseconds <= 500) {
        pingColor = "#04ff09";
    } else if (milliseconds > 500 && milliseconds <= 1000) {
        pingColor = "#fecc03";
    } else {
        pingColor = "#d1030d";
    }

    historyEmptyChild.css("background-color", "#212529");
    historyChild.css("background-color", pingColor);
    historyChild.attr("title", history.pingTime + " ms");

    historyParent.attr("count", elementCount);

    let historyPointer = Math.round(milliseconds / 38);
    let historyEmptyPointer = 0, maxHistoryElWidth = 40;

    if(historyPointer > maxHistoryElWidth) {
        historyPointer = 39;
        historyEmptyPointer = 1;
    } else {
        if(historyPointer <= 1) {
            historyPointer = 2;
        }
        historyEmptyPointer = maxHistoryElWidth - historyPointer;
    }
    historyEmptyChild.css("height", historyEmptyPointer + "px");
    historyChild.css("height", historyPointer + "px");
}

function pingOne() {
    ping(serverHosts[0], $("#ping_value").val());
}

function ping(host, milliseconds) {
    var started = new Date().getTime();

    var http = new XMLHttpRequest();

    http.open("GET", "http://" + host.ip + ":" + host.port, /*async*/true);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            let ended = new Date().getTime();

            if(milliseconds === null) {
                milliseconds = ended - started;
            }

            let pingPointer = Math.round(milliseconds / 167);

            if(pingPointer > 10) {
                pingPointer = 10;
            }

            for (let i = 0; i < 10; i++) {
                const hostBlockElement = $("#" + host.id + "_block" + i);
                let informative = 0;

                if (i > pingPointer) {
                    hostBlockElement.css("background-color", "#212529");
                } else {
                    informative = 1;

                    let pingColor = "";
                    if(pingPointer >= 0 && pingPointer < 4) {
                        pingColor = "#04ff09";
                    } else if(pingPointer >= 4 && pingPointer < 6) {
                        pingColor = "#fecc03";
                    } else {
                        pingColor = "#d1030d";
                    }

                    hostBlockElement.css("background-color", pingColor);
                }

                hostBlockElement.attr("informative", informative);
            }

            const hostPingElement = $("#" + host.id + "_ping");

            $("#" + host.id + "_prev_ping").html( hostPingElement.html() );
            hostPingElement.html(milliseconds + " ms");

            let minPingElement = $("#" + host.id + "_ping_min");
            let maxPingElement = $("#" + host.id + "_ping_max");

            if(milliseconds < parseInt(minPingElement.html())) {
                if(milliseconds <= 0) {
                    milliseconds = 1;
                }

                minPingElement.html(milliseconds + " ms");
            } else if(milliseconds > parseInt(maxPingElement.html())) {
                maxPingElement.html(milliseconds + " ms");
            }

            handleHistories(host, milliseconds);

            host.prevPingTime = milliseconds;
        }
    };
    try {
        http.send(null);
    } catch (exception) {
        // this is expected
    }
}

function pingAllServers() {
    for(const host of serverHosts) {
        if(host.observe) {
            ping(host, null);
        } else {
            for(let i = 0; i <= 14; i++) {
                const blockElement = $("#" + host.id + "_block" + i);
                if (blockElement.attr("informative") === "1") {
                    blockElement.css("background-color", "silver");
                }
            }

            const firstPingDiv = parseInt($("#" + host.id + "_history").attr("count"));

            for(let i = firstPingDiv; i >= firstPingDiv - 33; i--) {
                $("#" + host.id + "_history_el" + i).css("background-color", "silver");
            }
        }
    }
}

function refreshDuration() {
    for(const agent of agents) {
        if(agent.state === 0) {
            $("#duration" + agent.id).html( calculateDurationTime(agent.startDateTime, new Date()) );
        }
    }
}

function showWindow() {
    /*var dialog = $("#dialog").kendoWindow({
        modal: true,
        //content: "http://10.176.17.18:8080/fcc-monitor/index.html",
        //iframe: true,
        //title: "Ad-Channels Report (ID: " + dataItem.id + ")",
        width: parseInt($(document).width()) - 100,
        height: parseInt($(document).height()) - 50,
        close: function (e) {
            $(this.element).empty();
        }
    });

    //dialog.data("kendoWindow").title("Ad-Channels Report (ID: " + id + ")");
    dialog.data("kendoWindow").center().open();*/
}

$(document).ready(function () {
    $("#progress-div").css("visibility", "visible");

    $("#testTabstrip").kendoTabStrip({animation: {open: {effects: "fadeIn"}}});
    $("#prodTabstrip").kendoTabStrip({animation: {open: {effects: "fadeIn"}}});
    $("#prodTabstrip97").kendoTabStrip({animation: {open: {effects: "fadeIn"}}});
    $("#postTabstrip").kendoTabStrip({animation: {open: {effects: "fadeIn"}}});

    $("#all_observe").kendoButton({
        click: function(e) {
            const button = $("#all_observe");
            let isObserve = false;

            if(button.attr("observe") === "true") {
                //host.observe = false;
                button.attr("observe", "false");

                button.addClass("observe-button");
                button.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All observe&nbsp;&nbsp;&nbsp;&nbsp;");

                isObserve = true;
            } else {
                //host.observe = true;
                button.attr("observe", "true");

                button.removeClass("observe-button");
                button.html("All don't observe");

                isObserve = false;
            }

            for (let host of serverHosts) {
                host.observe = isObserve;

                const hostButton = $("#" + host.id + "_observe");
                hostButton.attr("observe", isObserve);
                hostButton.click();
            }
        }
    });

    for (let host of serverHosts) {
        $("#" + host.parentId).append(kendo.template($("#server_template").html()));
        $("#tmp").attr("id", host.id);

        const hostElement = $("#" + host.id);
        hostElement.html(host.title + " : " + host.port);

        $("#tmp_progress").attr("id", host.id + "_progress");
        $("#tmp_ping").attr("id", host.id + "_ping");
        $("#tmp_prev_ping").attr("id", host.id + "_prev_ping");
        $("#tmp_history").attr("id", host.id + "_history");
        $("#tmp_ping_min").attr("id", host.id + "_ping_min");
        $("#tmp_ping_max").attr("id", host.id + "_ping_max");
        $("#tmp_time").attr("id", host.id + "_time");

        $("#tmp_observe").attr("id", host.id + "_observe");

        $("#" + host.id + "_observe").kendoButton({
            click: function(e) {
                const button = $("#" + e.event.target.id);

                if(e.event.target.getAttribute("observe") === "true") {
                    host.observe = false;
                    e.event.target.setAttribute("observe", "false");

                    button.addClass("observe-button");
                    button.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Observe&nbsp;&nbsp;&nbsp;&nbsp;");
                } else {
                    host.observe = true;
                    e.event.target.setAttribute("observe", "true");

                    button.removeClass("observe-button");
                    button.html("Don't observe");
                }
            }
        });

        for (let i = 0; i < 10; i++) {
            $("#" + host.id + "_progress").prepend(kendo.template($("#progress-template").html()));
            $("#progress_block").attr("id", host.id + "_block" + i);
            $("#" + host.id + "_block" + i).css("background-color", "silver");
        }
    }

    pingAllServers();
    setInterval(pingAllServers, 1000);
});