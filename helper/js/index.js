"use strict";

var pongDate;
var pingTimeout = 300000;
var helperCurrentState = 1;
var messageGettingDatetime = new Date();
var chart;

var webSocket = getWebSocket(window.WebSocket);

webSocket.onmessage = function(event) {
    HelperPage.setWSStateAsAlive();

    receiveMessage(event.data).then(r => r);
};

async function receiveMessage(promise) {
    if(typeof promise === "string") {
        HelperPage.showMessage(promise);
    } else {
        promise.text().then((value) => {
            HelperPage.showMessage(value);
        });
    }
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function getHoursAnMinutes(datetime) {
    const time = datetime.toLocaleString("ru-RU").split("T")[1].split("+")[0].split(":");

    return time[0] + ":" + time[1];
}

function getOnlyMinutes(datetime) {
    return datetime.toLocaleString("ru-RU").split("T")[1].split("+")[0].split(":")[1];
}

function datetime(datetime) {
    return datetime.toLocaleString("ru-RU").split(",")[1];
}

class HelperPage extends Object {
    constructor() {
        super();
    }

    static initialize(isSelectRow, newIds) {
        /*HelperPage.getData();

        setInterval(HelperPage.getData, 15000);*/
    }

    static getData() {
        console.log("Get data");

        $("#loader").css("visibility", "visible");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7181781964950760680",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    $("#sum_total").html(data.total);
                    $("#sum_processed").html(data.processed);
                    //$("#sum_skipped").html(data.skipped);
                    $("#sum_saved").html(data.saved);
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                $("#loader").css("visibility", "hidden");
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                $("#loader").css("visibility", "hidden");
            }
        });
    }

    static showMessage(message) {
        if(message.indexOf("#") > -1) {
            message = message.substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

            jsonMessage = message;
            let agent = JSON.parse(message, reviver);
            agent.originalId = agent.id;

            if (agent.type === "AGENT") {
                let clientAgent = createAgent(agent);

                if (parseInt(clientAgent.getId()) === 7437057559620972968) {
                    HelperPage.showAgentInfo(clientAgent);
                }
            } else if(agent.type === "HELPER") {
                HelperPage.showSummaryData(agent);
            }
        } else {
            if (message === "pong") {
                HelperPage.setWSStateAsAlive();

                pongDate = new Date();
            }
        }
    }

    static setWSStateAsAlive() {
        const wsServerElement = $("#ws_server");
        wsServerElement.removeClass("ws-server-unknown");
        wsServerElement.removeClass("ws-server-inactive");
        wsServerElement.addClass("ws-server-active");

        wsServerElement.html("Active");
    }

    static setWSStateAsDead() {
        const wsServerElement = $("#ws_server");
        wsServerElement.removeClass("ws-server-active");
        wsServerElement.addClass("ws-server-inactive");

        wsServerElement.html("Inactive");

        $("#start_datetime").css("color", "silver");
    }

    static checkPingState() {
        if((new Date() - pongDate - 60000) > pingTimeout) {
            HelperPage.setWSStateAsDead();
        } else {
            webSocket.send("ping");
        }
    }

    static setActive() {
        const agentCard = $("#rowId");
        agentCard.removeClass("thread-inactive");
        agentCard.addClass("thread-active");
    }

    static setInactive() {
        const agentCard = $("#rowId");
        agentCard.removeClass("thread-active");
        agentCard.addClass("thread-inactive");
    }

    static showAgentInfo(agent) {
        const agentStateElement = $("#agentState");
        const wsStateElement = $("#wsState");

        if(agent.getState() === 0) {
            if(helperCurrentState === 1) {
                messageGettingDatetime = new Date();

                $("#dateTime").html(getCurrentDateTime());

                helperCurrentState = 0;
            }

            HelperPage.setActive();

            $("#wait").css("visibility", "visible");

            HelperPage.clearDevicesClasses(agentStateElement);
            agentStateElement.addClass("device-run");
            agentStateElement.attr("title", "Agent is running");

            HelperPage.clearDevicesClasses(wsStateElement);
            wsStateElement.addClass("device-run");
            wsStateElement.attr("title", "WS is running");

            $("#expected").html(HelperPage.getExpectedTime(agent));

            HelperPage.refreshAgentBox(agent);
        } else {
            helperCurrentState = 1;

            $("#wait").css("visibility", "hidden");

            HelperPage.clearDevicesClasses(wsStateElement);
            wsStateElement.addClass("device-sleep");
            wsStateElement.attr("title", "WS is sleeping");

            HelperPage.clearDevicesClasses(agentStateElement);

            HelperPage.setInactive();

            $("#message").html(agent.getMessage());

            if(agent.getState() === 1) {
                agentStateElement.addClass("device-sleep");
                agentStateElement.attr("title", "Agent is sleeping");
            } else {
                agentStateElement.addClass("device-error");
                agentStateElement.attr("title", "Agent is broken");
            }
        }
    }

    static showSummaryData(summary) {
        $("#sum_total").html(summary.total);
        $("#sum_processed").html(summary.processed);
        $("#sum_saved").html(summary.saved);
        $("#sum_skipped").html(summary.skipped);

        const charData = [];
        const charCategories = [];

        summary.ticks.forEach((tick, index) => {
            charData.push((tick.diff / 60).toFixed(2));

            charCategories.push(getHoursAnMinutes(tick.startDate));
        });


        for(let i = summary.ticks.length; i < 144/* - summary.ticks.length*/; i++) {
            charData.push(0);
            charCategories.push("⚬");
        }

        chart.updateSeries(HelperPage.getCharData(charData));

        chart.updateOptions({
            xaxis: {categories: charCategories}
        });
    }

    static clearDevicesClasses(element) {
        element.removeClass("device-run");
        element.removeClass("device-wait");
        element.removeClass("device-error");
        element.removeClass("device-sleep");
    }

    static getExpectedTime(agent) {
        if(agent.getTotal() === "--" || agent.getTotal() === "--" || agent.getMsPerRow() === 0) {
            return "";
        } else {
            let expectedTime = Math.round((agent.getTotal() - agent.getProcessed()) * agent.getMsPerRow());

            if(expectedTime < 60) {
                return "00:00:" + expectedTime.toString().padStart(2, "0");
            } else if(expectedTime >= 60 && expectedTime < 3600) {
                return "00:" +
                    Math.floor(expectedTime / 60).toString().padStart(2, "0") + ":" +
                    (expectedTime % 60).toString().padStart(2, "0");
            } else {
                const seconds = expectedTime - 3600 * Math.floor(expectedTime / 3600);

                let minSecString = "";

                if(seconds < 60) {
                    minSecString = "00:" + seconds.toString().padStart(2, "0");
                } else {
                    minSecString = Math.floor(seconds / 60).toString().padStart(2, "0") + ":" +
                        (seconds % 60).toString().padStart(2, "0");
                }

                return Math.floor(expectedTime / 3600).toString().padStart(2, "0") + ":" + minSecString;
            }
        }
    }

    static refreshAgentBox(agent) {
        $("#total").html(agent.getTotal());
        $("#processed").html(HelperPage.getValueWithPercent(agent.getProcessed(), agent.getTotal()));
        $("#skipped").html(HelperPage.getValueWithPercent(agent.getSkipped(), agent.getTotal()));
        $("#saved").html(HelperPage.getValueWithPercent(agent.getSaved(), agent.getTotal()));
        $("#notFound").html(HelperPage.getValueWithPercent(agent.getNotFound(), agent.getTotal()));
        $("#message").html(agent.getMessage());

        HelperPage.refreshMsMaxPerRow(agent);
    }

    static refreshMsMaxPerRow(agent) {
        if(agent.getMsPerRow() > 0) {
            let msPerRow  = Math.ceil((agent.getMsPerRow() * 1000) * 100) / 100;

            $("#msPerRow").html( msPerRow + " ms");
        }
    }

    static getValueWithPercent(value, total) {
        if(total === "--" || total === 0 || value === "--") {
            return value;
        } else {
            const percentValue = Math.round( parseInt(value) * 100 / parseInt(total));

            return value + " (" + percentValue + "%)";
        }
    }

    static checkWebsocketServerIsLive() {
        const wsStateElement = $("#wsState");

        if(helperCurrentState === 0) {
            if((new Date() - messageGettingDatetime) > 30000) {
                if((new Date() - messageGettingDatetime) > 600000) {
                    HelperPage.clearDevicesClasses(wsStateElement);
                    wsStateElement.addClass("device-error");
                    wsStateElement.attr("title", "WS maybe not available");
                } else {
                    HelperPage.clearDevicesClasses(wsStateElement);
                    wsStateElement.addClass("device-wait");
                    wsStateElement.attr("title", "WS is waiting");
                }
            } else {
                HelperPage.clearDevicesClasses(wsStateElement);
                wsStateElement.addClass("device-run");
                wsStateElement.attr("title", "WS is running");
            }

        }
    }

    static refreshDuration() {
        if(helperCurrentState === 0) {
            $("#duration").html(
                HelperPage.calculateDurationTime(messageGettingDatetime, new Date())
            );
        }
    }

    static calculateDurationTime(startDateTime, currentDateTime) {
        return HelperPage.durationTimeToString(currentDateTime - startDateTime)
    }

    static durationTimeToString(duration) {
        const ms =  duration % 1000;
        duration = (duration - ms) / 1000;
        const secs = duration % 60;
        duration = (duration - secs) / 60;
        const mins = duration % 60;
        const hrs = (duration - mins) / 60;

        return hrs.toString().padStart(2, "0") + ':' + mins.toString().padStart(2, "0") + ':' + secs.toString().padStart(2, "0");
    }

    static getFilledList(value) {
        return [
            value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value,
            value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value,
            value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value,
            value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value,
            value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value, value,
            value, value, value, value, value, value, value, value, value
        ];
    }

    static getCharData(agentData) {
        return  [{
            name: "Принять решение",
            color: "#f88b85",
            data: HelperPage.getFilledList(9)
        },
            {
                name: "Внимание",
                color: "#ffde93",
                data: HelperPage.getFilledList(7)
            },
            {
                name: "Время агента",
                color: "#8dff50",
                data: agentData
            }
        ]
    }

    static getChartOption() {
        return {
            series: HelperPage.getCharData(HelperPage.getFilledList(0)),
            chart: {
                type: "area",
                height: 550,
                toolbar: {show: false},
                zoom: {enabled: false}
            },
            dataLabels: {
                enabled: true,
                offsetX: -3,
                fontWeight: "normal",
                formatter: function (val) {
                    return val === 0 || val === 7 || val === 9 ? "" : val;
                },
                style: {
                    fontSize: "10px",
                    fontWeight: "bold"
                },
                background: {
                    enabled: true,
                    foreColor: "#2f4f4f"
                }
            },
            grid: {
                borderColor: "#d2d1d1",
                padding: {
                    top: 15
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                position: "bottom",
                categories: HelperPage.getFilledList("⚬"),
                axisBorder: {show: false},
                axisTicks: {show: false},
                tooltip: {enabled: false},
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: true,
                    style: {
                        fontSize: "9px",
                        fontFamily: "'Noto Sans', sans-serif",
                        colors: HelperPage.getFilledList("#ffffff")
                    }
                }
            },
            yaxis: {
                stepSize: 5,
                min: 0,
                max: 10,
                labels: {
                    show: true,
                    style: {
                        fontSize: "10px",
                        fontFamily: "'Noto Sans', sans-serif",
                        colors: HelperPage.getFilledList("#ffffff")
                    }
                }
            },
            legend: {
                labels: {
                    colors: "#ffffff"
                }
            },
            tooltip: {
                enabled: true,
                enabledOnSeries: [2],
                theme: "dark"
            }
        };
    }
}

$(document).ready(function () {
    $("#start_datetime").html("Activated: " + getCurrentDateTime());

    HelperPage.initialize();

    chart = new ApexCharts($("#chart").get(0), HelperPage.getChartOption());
    chart.render();

    setInterval(HelperPage.checkPingState, pingTimeout);
    setInterval(HelperPage.checkWebsocketServerIsLive, 10000);
    setInterval(HelperPage.refreshDuration, 1000);
});