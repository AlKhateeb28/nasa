var webSocket = getWebSocket(window.WebSocket);

var pongDate;
var pingTimeout = 300000;
var currentState = 1;

var hourBackgroundColors = [];
var importantAgentIds = [
    7437057559620972968,
    7169007381472566729
];

const lowSVG = "<svg fill='#fc0202' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>\n" +
    "<title>alt-battery-1</title>\n" +
    "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8z'></path>\n" +
    "</svg>";

const middleSVG = "<svg fill='#ffffff' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>\n" +
    "<title>alt-battery-2</title>\n" +
    "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8zM10.016 20h1.984v-8h-1.984v8z'></path>\n" +
    "</svg>";

const fullSVG = "<svg fill='#ffffff' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>" +
    "<title>alt-battery-5</title>" +
    "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8zM10.016 20h1.984v-8h-1.984v8zM14.016 20h1.984v-8h-1.984v8zM18.016 20h1.984v-8h-1.984v8zM22.016 20h1.984v-8h-1.984v8z'></path>" +
    "</svg>";

function isImportantAgent(id) {
    let result = false;

    importantAgentIds.forEach((agentId, index) => {
       if(agentId === id) {
           result = true;
       }
    });

    return result;
}

function fillSingleHour(hour) {
    let backgroundColor = "";

    if(hour >= 0 && hour <= 3) {
        backgroundColor = "night-bg-color";
    } else if(hour >= 4 && hour <= 9) {
        backgroundColor = "sunrise-bg-color";
    }  else if(hour >= 10 && hour <= 15) {
        backgroundColor = "noon-bg-color";
    } else if(hour >= 16 && hour <= 21) {
        backgroundColor = "sunset-bg-color";
    } else {
        backgroundColor = "night-bg-color";
    }

    element = {};
    element.hour = hour;
    element.bgColor = backgroundColor;
    hourBackgroundColors.push(element);
}

function fillHoursByDayPart() {
    for(let i = 0; i <= 23; i++) {
        fillSingleHour(i);
    }
}

function getHourBackgroundColor(hour) {
    for(let i = 0; i <= 23; i++) {
        if(i === hour) {
            return hourBackgroundColors[i].bgColor;
        }
    }

    return "";
}

webSocket.onmessage = function(event) {
    setWSStateAsAlive();

    receiveMessage(event.data).then(r => r);
};

async function receiveMessage(promise) {
    if(typeof promise === "string") {
        showMessage(promise);
    } else {
        promise.text().then((value) => {
            showMessage(value);
        });
    }
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function getCurrentHourNumber() {
    const currentDate = new Date().toLocaleString("ru-RU").split(",")[1];

    return parseInt(currentDate.split(":")[0]);
}

function secondsToMinuteSeconds(value) {
    if(value >= 60) {
        const valueParts = (value / 60).toString().split(".");

        const hour = valueParts[0].padStart(2, "0");
        let minute = "00";

        if(valueParts[1] !== undefined) {
            minute = parseInt(valueParts[1].substring(0, 2)) * 60 / 100;

            if(minute.toString().length === 1 && minute < 6) {
                minute = minute.toString().padEnd(2, "0");
            } else {
                minute = minute.toString().substring(0, 2).replaceAll(".", "").padStart(2, "0");
            }
        }

        return hour + ":" + minute;
    } else {
        return value + "s";
    }
}

function showMessage(message) {
    if(message.indexOf("#") > -1) {
        message = message.substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

        jsonMessage = message;
        let agent = JSON.parse(message, reviver);

        if(agent.type === "AGENTS_MONITOR") {
            showAgentsData(agent);
        }
    } else {
        if (message === "pong") {
            setWSStateAsAlive();

            pongDate = new Date();
        }
    }
}

function setWSStateAsAlive() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-unknown");
    wsServerElement.removeClass("ws-server-inactive");
    wsServerElement.addClass("ws-server-active");

    wsServerElement.html("Active<div style='position: absolute; left: 250px; top: 61px;'>" + fullSVG + "</div>");
}

function setWSStateAsDead() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-active");
    wsServerElement.addClass("ws-server-inactive");

    wsServerElement.html("Inactive<div style='position: absolute; left: 250px; top: 61px;'>" + lowSVG + "</div>");

    $("#start_datetime").css("color", "silver");
}

function checkPingState() {
    if((new Date() - pongDate - 60000) > pingTimeout) {
        setWSStateAsDead();
    } else {
        webSocket.send("ping");
    }
}

function setActive() {
    const agentCard = $("#rowId");
    agentCard.removeClass("thread-inactive");
    agentCard.addClass("thread-active");
}

function setInactive() {
    const agentCard = $("#rowId");
    agentCard.removeClass("thread-active");
    agentCard.addClass("thread-inactive");
}

function template(templateId) {
    return $("#" + templateId).html();
}

function checkWebsocketServerIsLive() {
    const wsStateElement = $("#wsState");

    if(currentState === 0) {
        if((new Date() - messageGettingDatetime) > 30000) {
            if((new Date() - messageGettingDatetime) > 600000) {
                clearDevicesClasses(wsStateElement);
                wsStateElement.addClass("device-error");
                wsStateElement.attr("title", "WS maybe not available");
            } else {
                clearDevicesClasses(wsStateElement);
                wsStateElement.addClass("device-wait");
                wsStateElement.attr("title", "WS is waiting");
            }
        } else {
            clearDevicesClasses(wsStateElement);
            wsStateElement.addClass("device-run");
            wsStateElement.attr("title", "WS is running");
        }

    }
}

function clearDevicesClasses(element) {
    element.removeClass("device-run");
    element.removeClass("device-wait");
    element.removeClass("device-error");
    element.removeClass("device-sleep");
}

function showAgentsHourData(index, hourData) {
    if(hourData !== null && hourData.agents.length > 0) {
        hourData.agents.forEach((element, elementIndex) => {
            const agentBlockIdentifier = "agent_block_" + index + "_" + element.agentId;

            if($("." + agentBlockIdentifier).length === 0) {
                $("#block_" + index + "_2").append($("#agent_instance_template").html());
                $("#agent_instance").attr("id", "agent_instance_" + index + "_" + element.agentId);
                const agentElement = $("#agent_instance_" + index + "_" + element.agentId);

                agentElement.removeClass("new-bg-color");
                agentElement.removeClass("night-bg-color");
                agentElement.removeClass("sunrise-bg-color");
                agentElement.removeClass("noon-bg-color");
                agentElement.removeClass("sunset-bg-color");

                agentElement.addClass(agentBlockIdentifier);

                if(getCurrentHourNumber() === index) {
                    agentElement.addClass("new-bg-color");
                } else {
                    agentElement.addClass(getHourBackgroundColor(index));
                }
            } else {
                $("#agent_instance_" + index + "_" + element.agentId).addClass(getHourBackgroundColor(index));
            }

            // HELPER
            if(isImportantAgent(parseInt(element.agentId))) {
                $("#agent_instance_" + index + "_" + element.agentId).css("background-color", "indigo");
            }

            $("#agent_name").attr("id", "agent_name_" + index + "_" + element.agentId);
            const agentNameElement = $("#agent_name_" + index + "_" + element.agentId);
            agentNameElement.html(element.name.substring(0, 44) + "...");
            //agentNameElement.addClass(getHourBackgroundColor(index));

            $("#agent_button").attr("id", "agent_button_" + index + "_" + element.agentId);
            $("#agent_button_" + index + "_" + element.agentId).attr("data-agent-id", element.agentId);

            $("#period").attr("id", "period_" + index + "_" + element.agentId);
            $("#period_" + index + "_" + element.agentId).html(element.type.toUpperCase());

            let suffix = "";
            if(element.type.toUpperCase() === "PERIOD") {
                suffix = element.period + "m";
            } else if(element.type.toUpperCase() === "DAILY") {
                suffix = element.start;
            } else {
                suffix = element.period;
            }

            $("#period_value").attr("id", "period_value_" + index + "_" + element.agentId);
            $("#period_value_" + index + "_" + element.agentId).html(suffix);

            $("#run_count").attr("id", "run_count_" + index + "_" + element.agentId);
            $("#run_count_" + index + "_" + element.agentId).html(element.runCount);

            if(index === 14 && elementIndex === 4) {
                secondsToMinuteSeconds(element.maxDiff, true)
            }

            $("#max_run_time").attr("id", "max_run_time_" + index + "_" + element.agentId);
            const maxRunTimeElement = $("#max_run_time_" + index + "_" + element.agentId);
            maxRunTimeElement.html(secondsToMinuteSeconds(element.maxDiff));
            if(element.type.toUpperCase() === "PERIOD" && parseInt(element.period) * 60 < parseInt(element.maxDiff)) {
                maxRunTimeElement.css("background", "orangered");
            } else {
                maxRunTimeElement.css("background", "cornsilk");
            }

            if(parseInt(element.agentId) === 7437057559620972968) {
                if(parseInt(element.maxDiff) <= 5) {
                    maxRunTimeElement.css("background", "tomato");
                }
            }

            $("#launch_block").attr("id", "launch_block_" + index + "_" + element.agentId);

            element.launches.forEach((launch, launchIndex) => {
                const launchIdentifier = "launch_" + index + "_" + element.agentId + "_" + launch.runTimeId;

                if($("." + launchIdentifier).length === 0) {
                    $("#launch_block_" + index + "_" + element.agentId).append($("#st_template").html());

                    $("#launch_time").attr("id", "launch_time_" + index + "_" + element.agentId + "_" + launch.runTimeId);
                    const launchRunTimeElement = $("#launch_time_" + index + "_" + element.agentId + "_" + launch.runTimeId);

                    launchRunTimeElement.addClass(launchIdentifier);

                    launchRunTimeElement.removeClass("value-old-cell");

                    if(getCurrentHourNumber() === index) {
                        launchRunTimeElement.addClass("value-new-cell");
                    } else {
                        launchRunTimeElement.addClass("value-old-cell");
                    }

                    launchRunTimeElement.html(launch.runTime);
                } else {
                    const launchRunTimeElement = $("#launch_time_" + index + "_" + element.agentId + "_" + launch.runTimeId);

                    launchRunTimeElement.removeClass("value-new-cell");
                    launchRunTimeElement.addClass("value-old-cell");
                }
            });

            $("#exception_block").attr("id", "exception_block_" + index + "_" + element.agentId);

            element.exceptions.forEach((exception, exceptionIndex) => {
                const exceptionIdentifier = "exception_" + index + "_" + element.agentId + "_" + exceptionIndex;

                if($("." + exceptionIdentifier).length === 0) {
                    $("#exception_block_" + index + "_" + element.agentId).append($("#exception_template").html());

                    $("#exception").attr("id", "exception_" + index + "_" + element.agentId + "_" + exceptionIndex);

                    const exceptionElement = $("#exception_" + index + "_" + element.agentId + "_" + exceptionIndex);
                    exceptionElement.addClass(exceptionIdentifier);
                    exceptionElement.html(exception);
                }
            });
        });
    }
}

function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? "SUCCESSFUL! ID is COPIED into clipboard!" : "UNSUCCESSFUL! ID DIDN'T COPY into clipboard!";
    } catch (err) {}

    document.body.removeChild(textArea);

    alert(msg);
}

function copyAgentId(element) {
    copyToClipboard(element.getAttribute("data-agent-id"));
}

function showAgentsData(data) {
    for(let i = 0; i <= 23; i++) {
        showAgentsHourData(i, eval("data.hour" + i));
    }
}

function goToHelperMonitor() {
    window.open("http://192.168.0.96/helper/index.html", '_blank').focus();
}

function goToAgentMonitor() {
    window.open("http://192.168.0.96/fcc-desktop/index.html", '_blank').focus();
}

function goToNetworkMonitor() {
    window.open("http://192.168.0.96/fcc-desktop/network.html", '_blank').focus();
}

function goToGdBoard() {
    window.open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/index.html", '_blank').focus();
}

function goToSdoBoard() {
    window.open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/sdo_board/index.html", '_blank').focus();
}

$(document).ready(function () {
    fillHoursByDayPart();

    $("#start_datetime").html("Activated: " + getCurrentDateTime());

    setInterval(checkPingState, pingTimeout);
    setInterval(checkWebsocketServerIsLive, 10000);
});
