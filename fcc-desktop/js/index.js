"use strict";

var newCollsAgent = null;

var isConnected = false;
var pongDate;
var pingTimeout = 300000;

var challengerChart;
var challengesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var webOverloadChart;
var sqlOverloadChart;
var webOverloadData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sqlOverloadData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var webData = [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sqlData = [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var overloadData = [0, 0];
var overloadCount = [0, 0];

var agents = {};
var mismatches = {};
var pinnedWindows = {};

var webChart, sqlChart, createdCollsHourChart, createdCollsDayChart, createdCollsMonthChart;

var hoursChartTopColor = "#7CFC00";
var hoursChartBottomColor = "#ceff86";
var overloadChartTopColor = "#8B0000";
var overloadChartBottomColor = "#FC0202";

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

const networkOption = {
    series: [{
        data: []
    }],
    chart: {
        animations: {enabled: false},
        height: 90,
        type: "bar",
        offsetX: -15,
        toolbar: {show: false},
        zoom: {enabled: false}
    },
    plotOptions: {
        bar: {
            rangeBarOverlap: false,
            borderRadius: 2,
            columnWidth: "5px",
            barHeight: "80px",
            dataLabels: {
                position: "top",
            }
        }
    },
    fill: {
        //colors: ["#ffc107"],
        colors: [
            function({ value, seriesIndex, w }) {
                if(value === 20) {
                    return "#212529";
                }

                if(value < 6) {
                    return "#7CFC00";
                } else if(value >= 6 && value < 11) {
                    return "#ffc107";
                } else {
                    return "#FF4500";
                }
            }
        ],
        type: "gradient",
        gradient: {
            shade: "dark",
            type: 'vertical',
            inverseColors: true,
            shadeIntensity: 0.1,
            //gradientToColors: ["#fd7e14"],
            stops: [20, 100]
        }
    },
    dataLabels: { enabled: false},
    legend: {show: false},
    tooltip: {enabled: false},
    grid: {show: false, xaxis: {lines: {show: false}},yaxis: {lines: {show: false}}},
    xaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false},tooltip: {enabled: false}},
    yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}}
};

var webSocket = getWebSocket(window.WebSocket);

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

function getSummaryOption() {
    return {
        series: [{
            name: "Запусков"/*,
            data: challengesData*/
        }],
        chart: {
            width: 310,
            //height: 380,
            type: "bar",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "14px",
                dataLabels: {
                    position: "top",
                }
            }
        },
        dataLabels: {
            enabled: true,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            offsetX: 0,
            offsetY: 3,
            style: {
                fontSize: "10px",
                fontFamily: "'ArnamuMonoBold', sans-serif",
                fontWeight: "normal",
                colors: ["#f5fffa"]
            }
        },
        grid: {
            borderColor: "#5b5b5b",
            padding: {
                top: 25
            }
        },
        stroke: {curve: 'smooth'},
        fill: {
            //colors: [bottomColor],
            type: "gradient",
            gradient: {
                shade: "dark",
                type: 'vertical',
                inverseColors: true,
                shadeIntensity: 0.1,
                //gradientToColors: [topColor],
                stops: [20, 100]
            }
        },
        xaxis: {
            offsetY: -10,
            categories: ["6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                rotate: -70,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "lawngreen", "lawngreen", "lawngreen", "lawngreen", "lawngreen", "lawngreen", "lawngreen", "lawngreen", "lawngreen",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond"
                    ]
                }
            }
        },
        yaxis: {axisBorder: {show: false}, axisTicks: {show: false,}, labels: {show: false}},
        legend: {show: false},
        tooltip: {enabled: false}
    };
}

function showMessage(message) {
    if(message.indexOf("#") > -1) {
        message = message.substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

        jsonMessage = message;
        let agent = JSON.parse(message, reviver);
        agent.originalId = agent.id;

        if (agent.type === "AGENT") {
            let clientAgent = createAgent(agent);

            clientAgent.setMessageDate(new Date());

            const agentStateElement = $("#agentState" + clientAgent.getId());
            const wsStateElement = $("#wsState" + clientAgent.getId());

            let newBoxId = clientAgent.getId();

            if(agents[clientAgent.getId()] !== undefined) {
                agents[clientAgent.getId()].setMessageDate(new Date());
                agents[clientAgent.getId()].setFetchTime(clientAgent.getFetchTime());
                agents[clientAgent.getId()].setHandlingTime(clientAgent.getHandlingTime());
                agents[clientAgent.getId()].setSavingTime(clientAgent.getSavingTime());

                if(agents[clientAgent.getId()].getState() > 0) {
                    $("#msPerRow_" + clientAgent.getId()).html("--");
                    $("#chart_" + clientAgent.getId() + " svg").last().remove();
                }

                if(agents[clientAgent.getId()].getState() !== clientAgent.getState()) {
                    agents[clientAgent.getId()].setStartDateTime(new Date());

                    if(clientAgent.getState() == 0) {
                        $("#dateTime_" + clientAgent.getId()).html(getCurrentDateTime());
                    }

                    const waitElement = $("#wait" + clientAgent.getId())
                    waitElement.css("visibility", "visible");

                    if(clientAgent.getState() !== 2) {
                        const errorBoxElement = $("#errorBox_" + clientAgent.getId());
                        errorBoxElement.css("visibility", "hidden");
                        errorBoxElement.html("");
                    }

                    if(clientAgent.getState() === 0) {
                        clearDevicesClasses(agentStateElement);
                        agentStateElement.addClass("device-run");
                        agentStateElement.attr("title", "Agent is running");

                        clearDevicesClasses(wsStateElement);
                        wsStateElement.addClass("device-run");
                        wsStateElement.attr("title", "WS is running");

                        //$("#expected_" + clientAgent.getId()).html($("#duration" + clientAgent.getId()).html());
                    } else {
                        waitElement.css("visibility", "hidden");

                        clearDevicesClasses(agentStateElement);
                        agentStateElement.addClass("device-sleep");
                        agentStateElement.attr("title", "Agent is sleeping");

                        clearDevicesClasses(wsStateElement);
                        wsStateElement.addClass("device-sleep");
                        wsStateElement.attr("title", "WS is sleeping");

                        //$("#expected_" + clientAgent.getId()).html("");
                    }
                } else {
                    $("#expected_" + clientAgent.getId()).html( getExpectedTime(clientAgent) );
                }

                agents[clientAgent.getId()].setState(clientAgent.getState());

                refreshAgentBox(clientAgent);

                if(clientAgent.getState() > 0) {
                    wsStateElement.attr("title", "WS is sleeping");

                    newBoxId = changeFinishedAgentId(clientAgent, agents[clientAgent.getId()]);

                    //saveAgent(clientAgent);
                } else {
                    agentStateElement.attr("title", "Agent is running");
                    wsStateElement.attr("title", "WS is running");
                }
            } else {
                clientAgent.setStartDateTime(new Date());

                agents[clientAgent.getId()] = clientAgent;

                createAgentBox(clientAgent);

                $("#active-count").html(parseInt($("#active-count").html()) + 1);
            }

            if(clientAgent.getState() === 2) {
                // Received error message
                $("#wait" + clientAgent.getId()).css("visibility", "hidden");

                clearDevicesClasses(agentStateElement);
                agentStateElement.addClass("device-error");
                agentStateElement.attr("title", "Agent is broken");

                const errorBoxElement = $("#errorBox_" + newBoxId);
                errorBoxElement.css("visibility", "visible");
                errorBoxElement.css("background-color", "#fc185a");
                errorBoxElement.css("color", "mintcream");
                errorBoxElement.html(clientAgent.getErrorMessage().replaceAll("\r\n", "<br/>"));
            }
        } else if(agent.type === "CHALLENGE") {
            agent.challenges.forEach((challenge) => {
                changeChallengesData(challenge);
            });

            challengerChart.updateSeries([{data: challengesData}]);

            calculateChallenges();
        } else if(agent.type === "MISMATCH") {
            processMismatchMessage(agent);
        } else if(agent.type === "NEW_COLLS_HOURS") {
            processNewCollaboratorsHour(agent);
        } else if(agent.type === "NEW_COLLS_DAYS") {
            processNewCollaboratorsDay(agent);
        }  else if(agent.type === "NEW_COLLS_MONTH") {
            processNewCollaboratorsMonth(agent);
        }
    }  else {
        if (message === "pong") {
            setWSStateAsAlive();

            pongDate = new Date();

            if(!isConnected) {
                isConnected = true;

                checkPingState();
                setTimeout(checkPingState, pingTimeout);
            }
        } else if(message.indexOf("vis-") > -1) {
            showFreshVisitors(message);
        }
    }
}

function changeChallengesData(challenge) {
    let currentDateTime;

    if(challenge == null) {
        currentDateTime = new Date();
    } else {
        currentDateTime = new Date(challenge.datetime);
    }

    const currentTime = currentDateTime.toLocaleString("ru-RU").split(", ")[1];
    const currentHour = currentTime.split(":")[0];

    challengesData[currentHour - 6] = challengesData[currentHour - 6] + 1;
}

function showFreshVisitors(message) {
    let visitors = JSON.parse(message.substring(4), reviver);

    $("#visitors tr").remove();
    $("#agentNameHeader").html("Агенты");

    let agentCount = 0;

    visitors.forEach((visitor, index) => {
        $("#visitors").append(kendo.template($("#visitor_template").html()));

        const elementId = visitor.id.substring(0, visitor.id.indexOf(".") - 1);

        $("#visitorParent").attr("id", "visitorParent_" + elementId);
        $("#visitorIndex").attr("id", "visitorIndex_" + elementId);
        $("#visitorName").attr("id", "visitorName_" + elementId);
        $("#visitorId").attr("id", "visitorId_" + elementId);

        let agentId = visitor.agentId;

        if (agentId.indexOf("_") > -1) {
            agentId = visitor.agentId.substring(0, visitor.agentId.indexOf("_") + 4);
        }

        $("#visitorIndex_" + elementId).html(index);
        $("#visitorName_" + elementId).html(agentId);
        $("#visitorId_" + elementId).html(visitor.id);

        agentCount++;
    });

    $("#agentNameHeader").html("Агенты (" + agentCount + ")");
}

function setWSStateAsAlive() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-unknown");
    wsServerElement.removeClass("ws-server-inactive");
    wsServerElement.addClass("ws-server-active");

    wsServerElement.html("Active<div style='position: absolute; left: 260px; top: 63px;'>" + fullSVG + "</div>");
}

function setWSStateAsDead() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-active");
    wsServerElement.addClass("ws-server-inactive");

    wsServerElement.html("Inactive <div style='position: absolute; left: 260px; top: 63px;'>" + lowSVG + "</div>");

    $("#start_datetime").css("color", "silver");
}

function checkPingState() {
    if((new Date() - pongDate - 60000) > pingTimeout) {
        setWSStateAsDead();
    } else {
        webSocket.send("ping");

        setTimeout(checkPingState, pingTimeout);
    }
}

function getExpectedTime(agent) {
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

function changeFinishedAgentId(agent, stackAgent) {
    const newAgentId = agent.getId() + "-" + Math.floor(Math.random() * 100000);

    delete agents[agent.getId()];

    $("#wait" + agent.getId()).attr("id",   "wait" + newAgentId);
    $("#agentState" + agent.getId()).attr("id",   "agentState" +  newAgentId);
    $("#wsState" + agent.getId()).attr("id",   "wsState" + newAgentId);

    for(let id in pinnedWindows) {
        if(id === "rowId" + agent.getId()) {
            delete pinnedWindows[id];

            pinnedWindows["rowId" + newAgentId] = 0;
        }
    }

    const rowElement = $("#rowId" + agent.getId());
    rowElement.removeClass("thread-active");
    rowElement.addClass("thread-inactive");
    if(parseInt(rowElement.attr("pin")) === 1) {
        rowElement.addClass("pinned-color");
    }

    rowElement.attr("id",   "rowId" + newAgentId);

    const pinElement = $("#pin_btn_" + agent.getId());
    pinElement.attr("id",   "pin_btn_" + newAgentId);
    pinElement.attr("parent",  newAgentId);

    $("#agentId" + agent.getId()).attr("id",   "agentId" + newAgentId);
    $("#agentName" + agent.getId()).attr("id",   "agentName" + newAgentId);
    $("#agentCopyId_" + agent.getId()).attr("id",   "agentCopyId_" + newAgentId);
    $("#userCopyId_" + agent.getId()).attr("id",   "userCopyId_" + newAgentId);
    $("#userId" + agent.getId()).attr("id",   "userId" + newAgentId);
    $("#userName" + agent.getId()).attr("id",   "userName" + newAgentId);
    $("#total" + agent.getId()).attr("id",   "total" + newAgentId);
    $("#processed" + agent.getId()).attr("id",   "processed" + newAgentId);
    $("#skipped" + agent.getId()).attr("id",   "skipped" + newAgentId);
    $("#saved" + agent.getId()).attr("id",   "saved" + newAgentId);
    $("#notFound" + agent.getId()).attr("id",   "notFound" + newAgentId);
    $("#message" + agent.getId()).attr("id",   "message" + newAgentId);
    $("#duration" + agent.getId()).attr("id",   "duration" + newAgentId);
    $("#msPerRow_" + agent.getId()).attr("id",   "msPerRow_" + newAgentId);

    const expectedElement = $("#expected_" + agent.getId());
    expectedElement.html("00:00:00");
    expectedElement.attr("id",   "expected_" + newAgentId);

    $("#errorBox_" + agent.getId()).attr("id",   "errorBox_" + newAgentId);
    $("#optionalHeader_" + agent.getId()).attr("id",   "optionalHeader_" + newAgentId);
    $("#optionalData_" + agent.getId()).attr("id",   "optionalData_" + newAgentId);
    $("#name1_" + agent.getId()).attr("id",   "name1_" + newAgentId);
    $("#value1_" + agent.getId()).attr("id",   "value1_" + newAgentId);
    $("#name2_" + agent.getId()).attr("id",   "name2_" + newAgentId);
    $("#value2_" + agent.getId()).attr("id",   "value2_" + newAgentId);

    $("#active-count").html(parseInt($("#active-count").html()) - 1);
    $("#inactive-count").html(parseInt($("#inactive-count").html()) + 1);

    refreshChart(agent, newAgentId);

    calculateChallenges();

    return newAgentId;
}

function refreshChart(agent, newAgentId) {
    const options = {
        series: [{
            color: "#adff2f",
            name: "",
            data: [
                0,
                agent.getValueAsPercent(agent.getFetchTime()),
                agent.getValueAsPercent(agent.getHandlingTime()),
                agent.getValueAsPercent(agent.getSavingTime())
            ]
        }],
        chart: {
            width: 300,
            height: 80,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        legend: {show: false},
        tooltip: {enabled: false},
        grid: {show: false, xaxis: {lines: {show: false}},yaxis: {lines: {show: false}}},
        xaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false},tooltip: {enabled: false}},
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}}
    };

    const chartElement = $("#chart_" + agent.getId());

    const chart = new ApexCharts(chartElement.get(0), options);
    chart.render();

    chartElement.attr("id", "chart_" + newAgentId);
}

function refreshOptionalData(agent) {
    if(agent.getOptionalData() !== undefined) {
        if(agent.getOptionalData().getName1() !== undefined) {
            const name1Element = $("#name1_" + agent.getId());
            const value1Element = $("#value1_" + agent.getId());

            name1Element.css("visibility",   "visible");
            value1Element.css("visibility",   "visible");

            name1Element.html(agent.getOptionalData().getName1());
            value1Element.html(agent.getOptionalData().getValue1());
        }

        if(agent.getOptionalData().getName2() != undefined) {
            const name2Element = $("#name2_" + agent.getId());
            const value2Element = $("#value2_" + agent.getId());

            name2Element.css("visibility",   "visible");
            value2Element.css("visibility",   "visible");

            name2Element.html(agent.getOptionalData().getName2());
            value2Element.html(agent.getOptionalData().getValue2());
        }
    }
}

function refreshMsMaxPerRow(agent) {
    if(agent.getMsPerRow() > 0) {
        let msPerRow  = Math.ceil((agent.getMsPerRow() * 1000) * 100) / 100;

        $("#msPerRow_" + agent.getId()).html( msPerRow + " ms");
    }
}

function getValueWithPercent(value, total) {
    if(total === "--" || total === 0 || value === "--") {
        return value;
    } else {
        const percentValue = Math.round( parseInt(value) * 100 / parseInt(total));

        return value + " (" + percentValue + "%)";
    }
}

function getCorrectAgentName(name) {
    if(name.length > 67) {
        name = name.substring(0, 61) + " ...";
    }

    return name;
}

function refreshAgentBox(agent) {
    $("#agentId" + agent.getId()).html(agent.getId());
    $("#agentName" + agent.getId()).html( getCorrectAgentName(agent.getName()) );
    $("#userId" + agent.getId()).html(agent.getUserId());
    $("#userName" + agent.getId()).html(agent.getUserName());
    $("#total" + agent.getId()).html(agent.getTotal());
    $("#processed" + agent.getId()).html(getValueWithPercent(agent.getProcessed(), agent.getTotal()));
    $("#skipped" + agent.getId()).html(getValueWithPercent(agent.getSkipped(), agent.getTotal()));
    $("#saved" + agent.getId()).html(getValueWithPercent(agent.getSaved(), agent.getTotal()));
    $("#notFound" + agent.getId()).html(getValueWithPercent(agent.getNotFound(), agent.getTotal()));
    $("#message" + agent.getId()).html(agent.getMessage());

    refreshOptionalData(agent);
    refreshMsMaxPerRow(agent);
}

function calculateChallenges() {
    let challengeCount = 0;

    challengesData.forEach((challenge) => {
        challengeCount += challenge;
    });

    $("#hours-count").html(challengeCount);
}

function createAgentBox(agent) {
    refreshVisitors();

    changeChallengesData(null);
    challengerChart.updateSeries([{data: challengesData}]);

    calculateChallenges();

    $("#table").prepend(kendo.template($("#template").html()));

    $("#wait").attr("id",   "wait" + agent.getId());
    $("#agentState").attr("id",   "agentState" + agent.getId());
    $("#wsState").attr("id",   "wsState" + agent.getId());

    $("#rowId").attr("id",   "rowId" + agent.getId());
    $("#rowId" + agent.getId()).addClass("agent_" + agent.getId());

    const pinElement = $("#pin_btn");
    pinElement.attr("parent",  agent.getId());
    pinElement.attr("id",   "pin_btn_" + agent.getId());

    $("#agentId").attr("id",   "agentId" + agent.getId());
    $("#agentId" + agent.getId()).html(agent.getId());
    $("#agentName").attr("id",   "agentName" + agent.getId());
    $("#agentName" + agent.getId()).html( getCorrectAgentName(agent.getName()) );
    $("#agentCopyId").attr("id",   "agentCopyId_" + agent.getId());
    $("#agentCopyId_" + agent.getId()).attr("agentId",   agent.getId());
    $("#userCopyId").attr("id",   "userCopyId_" + agent.getId());
    $("#userCopyId_" + agent.getId()).attr("userId",   agent.getUserId());
    $("#userId").attr("id",   "userId" + agent.getId());
    $("#userId" + agent.getId()).html(agent.getUserId());
    $("#userName").attr("id",   "userName" + agent.getId());
    $("#userName" + agent.getId()).html(agent.getUserName());
    $("#total").attr("id",   "total" + agent.getId());
    $("#total" + agent.getId()).html(agent.getTotal());
    $("#processed").attr("id",   "processed" + agent.getId());
    $("#processed" + agent.getId()).html(agent.getProcessed());
    $("#skipped").attr("id",   "skipped" + agent.getId());
    $("#skipped" + agent.getId()).html(agent.getSkipped());
    $("#saved").attr("id",   "saved" + agent.getId());
    $("#saved" + agent.getId()).html(agent.getSaved());
    $("#notFound").attr("id",   "notFound" + agent.getId());
    $("#notFound" + agent.getId()).html(agent.getNotFound());
    $("#message").attr("id",   "message" + agent.getId());
    $("#message" + agent.getId()).html(agent.getMessage());
    $("#duration").attr("id",   "duration" + agent.getId());
    $("#duration" + agent.getId()).html("00:00:00");
    $("#chart").attr("id", "chart_" + agent.getId());
    $("#msPerRow").attr("id",   "msPerRow_" + agent.getId());
    $("#dateTime").attr("id",   "dateTime_" + agent.getId());
    $("#dateTime_" + agent.getId()).html(getCurrentDateTime());
    $("#expected").attr("id",   "expected_" + agent.getId());
    $("#errorBox").attr("id",   "errorBox_" + agent.getId());
    $("#optionalHeader").attr("id",   "optionalHeader_" + agent.getId());
    $("#optionalData").attr("id",   "optionalData_" + agent.getId());
    $("#name1").attr("id",   "name1_" + agent.getId());
    $("#value1").attr("id",   "value1_" + agent.getId());
    $("#name2").attr("id",   "name2_" + agent.getId());
    $("#value2").attr("id",   "value2_" + agent.getId());

    refreshOptionalData(agent);
    refreshMsMaxPerRow(agent);
}

function calculateDurationTime(startDateTime, currentDateTime, total, processed) {
    return durationTimeToString(currentDateTime - startDateTime)
}

function durationTimeToString(duration) {
    const ms =  duration % 1000;
    duration = (duration - ms) / 1000;
    const secs = duration % 60;
    duration = (duration - secs) / 60;
    const mins = duration % 60;
    const hrs = (duration - mins) / 60;

    return hrs.toString().padStart(2, "0") + ':' + mins.toString().padStart(2, "0") + ':' + secs.toString().padStart(2, "0");
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

function getCurrentTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[1];
}

function refreshDuration() {
    for(const id in agents) {
        if(agents[id].getState() === 0) {
            $("#duration" + agents[id].getId()).html(
                calculateDurationTime(agents[id].getStartDateTime(), new Date())
            );
        }
    }
}

function clearDevicesClasses(element) {
    element.removeClass("device-run");
    element.removeClass("device-wait");
    element.removeClass("device-error");
    element.removeClass("device-sleep");
}

function checkWebsocketServerIsLive() {
    for(const id in agents) {
        const wsStateElement = $("#wsState" + agents[id].getId());

        if(agents[id].getState() === 0) {
            if((new Date() - agents[id].getMessageDate()) > 30000) {
                if((new Date() - agents[id].getMessageDate()) > 600000) {
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
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {}

    document.body.removeChild(textArea);

    alert("ID copied into clipboard!");
}

function copyAgentId(element) {
    copyToClipboard(element.getAttribute("agentId"));
}

function copyUserId(element) {
    copyToClipboard(element.getAttribute("userId"));
}

function saveAgent(agent) {
    var jsonData = JSON.stringify(agent, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    )

    var a = document.createElement("a");

    a.href = URL.createObjectURL( new Blob([jsonData], {type: "text/plain"}) );
    a.download = `agents_data_${getCurrentDate()}.json`;
    a.click();

    a.remove();
}

function refreshManuallyVisitors() {
    $("#visitors tr").remove();

    setTimeout(function() {
        refreshVisitors();
    }, 100);
}

function refreshVisitors() {
    webSocket.send("visitors");
}

function appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, index, header, footer, fixerId, backgroundColor) {
    const option = {
        series: [{
            color: "#adff2f",
            name: "Count",
            data: [0, 0]
        }],
        chart: {
            width: 220,
            height: 80,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        legend: {show: false},
        //tooltip: {enabled: false},
        grid: {show: false, xaxis: {lines: {show: false}},yaxis: {lines: {show: false}}},
        xaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false},tooltip: {enabled: false}},
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}},
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 99, 100],
                gradientToColors: ["#212529"]
            }
        },
    };

    mismatchBoxElement.append(kendo.template(mismatchTemplateElement.html()));

    $("#mismatch_parent").attr("id", "mismatch_parent_" + index);
    $("#mismatch_parent_" + index).css("background-color", backgroundColor);
    $("#mismatch_img").attr("id",   "mismatch_img_" + index);
    $("#mismatch_percent").attr("id",   "mismatch_percent_" + index);
    $("#mismatch_sun").attr("id",   "mismatch_sun_" + index);
    $("#mismatch").attr("id",   "mismatch_" + index);
    $("#mismatch_chart").attr("id",   "mismatch_chart_" + index);
    $("#mismatch_header").attr("id",   "mismatch_header_" + index);
    $("#mismatch_header_" + index).html(header);
    $("#mismatch_footer").attr("id",   "mismatch_footer_" + index);
    $("#mismatch_footer_" + index).html(footer);
    $("#mismatch_date_footer").attr("id",   "mismatch_date_footer_" + index);
    $("mismatch_fix_btn").attr("id",   "mismatch_fix_btn_" + index);
    $("#mismatch_fix_btn_" + index).attr("onClick", "copyToClipboard('" + fixerId + "');");

    const mismatchChart = new ApexCharts($("#mismatch_chart_" + index).get(0), option);
    mismatchChart.render();

    mismatches[index] = mismatchChart;
    mismatches[index].option = option;
}

function appendOverloadBlock(overloadBoxElement, mismatchTemplateElement, header, index, overloadData) {
    overloadBoxElement.append(kendo.template(mismatchTemplateElement.html()));

    $("#overload_header").attr("id",   "overload_header_" + index);
    $("#overload_header_" + index).html(header);
    $("#overload_chart").attr("id",   "overload_chart_" + index);

    var options = getSummaryOption();
    options.series[0].data = overloadData;
    options.chart.height = 200;
    options.chart.offsetY = -40;
    options.fill.colors = [overloadChartBottomColor];
    options.fill.gradient.gradientToColors = [overloadChartTopColor];

    if(index === 0) {
        webOverloadChart = new ApexCharts($("#overload_chart_" + index).get(0), options);
        webOverloadChart.render();
    } else {
        sqlOverloadChart = new ApexCharts($("#overload_chart_" + index).get(0), options);
        sqlOverloadChart.render();
    }
}

function processMismatchMessage(agent) {
    let clientTask = createMismatchTask(agent);
    let prevCount = 0;
    let percentValue;
    let prefix = "";

    let mismatchIndex = -1;

    switch (clientTask.getMismatchType()) {
        /*case "DOSS_FCK": {
            mismatchIndex = 0;
            break;
        }

        case "DOSS_RCK": {
            mismatchIndex = 1;
            break;
        }

        case "BL_EVENT": {
            mismatchIndex = 2;
            break;
        }

        case "BL_COLLS": {
            mismatchIndex = 3;
            break;
        }

        case "DOSS_INSTRUCTOR": {
            mismatchIndex = 4;
            break;
        }

        case "DOSS_TRAINER": {
            mismatchIndex = 5;
            break;
        }*/

        case "IN_PROGRAM": {
            mismatchIndex = 0;
            break;
        }

        case "IS_FCC": {
            mismatchIndex = 1;
            break;
        }

        case "IS_RCK": {
            mismatchIndex = 2;
            break;
        }

        case "IS_OCK": {
            mismatchIndex = 3;
            break;
        }

        case "IS_ROIV": {
            mismatchIndex = 4;
            break;
        }

        case "IS_PARTNER": {
            mismatchIndex = 5;
            break;
        }

        case "IS_COMMERCE": {
            mismatchIndex = 6;
            break;
        }

        case "IS_OCK": {
            mismatchIndex = 7;
            break;
        }

        case "IS_PROJECT": {
            mismatchIndex = 8;
            break;
        }

        case "WITH_NO_RIGHT": {
            mismatchIndex = 9;
            break;
        }
    }

    if(mismatchIndex > -1) {
        const mismatchImgElement = $("#mismatch_img_" + mismatchIndex);
        const mismatchPercentElement = $("#mismatch_percent_" + mismatchIndex);
        const mismatchSunElement = $("#mismatch_sun_" + mismatchIndex);
        const mismatchElement = $("#mismatch_" + mismatchIndex);

        if (parseInt(clientTask.getState()) === 0) {
            mismatchSunElement.css("visibility", "visible");
        } else {
            mismatchSunElement.css("visibility", "hidden");

            $("#mismatch_date_footer_" + mismatchIndex).html(getCurrentDateTime());

            prevCount = parseInt(mismatchElement.html());

            mismatchElement.attr("prev_count", prevCount);
            mismatchElement.html(clientTask.getCount());

            mismatches[mismatchIndex].option.series[0].data.push(clientTask.getCount());
            mismatches[mismatchIndex].updateSeries([{data: mismatches[mismatchIndex].option.series[0].data}]);

            percentValue = clientTask.getCount() - prevCount;

            mismatchPercentElement.removeClass("up_box");
            mismatchPercentElement.removeClass("down_box");
            mismatchPercentElement.removeClass("nil_box");

            if (percentValue < 0) {
                mismatchPercentElement.addClass("down_box");
                mismatchImgElement.attr("src", "images/down.png");
            } else if (percentValue > 0) {
                prefix = "+";
                mismatchPercentElement.addClass("up_box");
                mismatchImgElement.attr("src", "images/up.png");
            } else {
                mismatchPercentElement.addClass("nil_box");
                mismatchImgElement.attr("src", "images/blank.png");
            }

            mismatchPercentElement.html(prefix + percentValue);
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------
function appendCreatedCollaboratorsBox() {
    $("#mismatchBox").append(kendo.template($("#created_colls_template").html()));

    const hourOptions = getCreatedCollaboratorsHourOption();

    createdCollsHourChart = new ApexCharts($("#createdCollsHourChart").get(0), hourOptions);
    createdCollsHourChart.render();

    const dayOptions = getCreatedCollaboratorsDayOption();

    createdCollsDayChart = new ApexCharts($("#createdCollsDayChart").get(0), dayOptions);
    createdCollsDayChart.render();

    const monthOptions = getCreatedCollaboratorsMonthOption();

    createdCollsMonthChart = new ApexCharts($("#createdCollsMonthChart").get(0), monthOptions);
    createdCollsMonthChart.render();
}
//----------------------------------------------------------------------------------------------------------------------
function getCreatedCollaboratorsHourOption() {
    return {
        series: [{
            name: "muc",
            color: "#ffc107",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
            {
                name: "остальные",
                color: "#7cfc00",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }],
        chart: {
            width: 650,
            height: 380,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: false,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontFamily: "'ArnamuMonoBold', sans-serif",
                fontWeight: "normal",
                colors: ["#f5fffa"]
            }
        },
        grid: {
            borderColor: "#5b5b5b",
            padding: {
                top: 25
            }
        },
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: getHourXAxisCategories(new Date().getHours()),
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond"
                    ]
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond"]
                }
            }
        },
        legend: {
            labels: {
                colors: ["#f5fffa"]
            }
        }
    };
}
//----------------------------------------------------------------------------------------------------------------------
function processNewCollaboratorsHour(agent) {
    newCollsAgent = agent;

    createdCollsHourChart.updateOptions({
        xaxis: {
            categories: getHourXAxisCategories(agent.currentHour)
        }
    });

    createdCollsHourChart.updateSeries([
        {data: agent.muc},
        {data: agent.other}
    ]);

    $("#mucCountHour").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountHour").html(addNewCollaboratorCount(agent.other));

    $("#hour_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getHourXAxisCategories(hour) {
    let hourCategories = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    for(let i = 23; i >= 0; i--) {
        hourCategories[i] = String(hour).padStart(2, "0");

        hour = hour - 1;

        if(hour < 0) {
            hour = 23
        }
    }

    return hourCategories;
}
//----------------------------------------------------------------------------------------------------------------------
function getCreatedCollaboratorsDayOption() {
    return {
        series: [{
            name: "muc",
            color: "#ffc107",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
            {
                name: "остальные",
                color: "#7cfc00",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }],
        chart: {
            width: 650,
            height: 380,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: false,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontFamily: "'ArnamuMonoBold', sans-serif",
                fontWeight: "normal",
                colors: ["#f5fffa"]
            }
        },
        grid: {
            borderColor: "#5b5b5b",
            padding: {
                top: 25,
                left: 35,
                bottom: 36
            }
        },
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: getDayXAxisCategories(),
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: getDayXAxisLabelColors()
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                offsetX: 23,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond"]
                }
            }
        },
        legend: {
            labels: {
                colors: ["#f5fffa"]
            }
        }
    };
}
//----------------------------------------------------------------------------------------------------------------------
function processNewCollaboratorsDay(agent) {
    newCollsAgent = agent;

    createdCollsDayChart.updateOptions({
        xaxis: {
            categories: getDayXAxisCategories()
        }
    });

    createdCollsDayChart.updateSeries([
        {data: agent.muc},
        {data: agent.other}
    ]);

    $("#mucCountDay").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountDay").html(addNewCollaboratorCount(agent.other));

    $("#day_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getDayXAxisCategories() {
    let dayCategories = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    for(let i = 0; i < 28; i++) {
        dayCategories[27 - i] = moment().subtract(i, "days").format("DD");
    }

    return dayCategories;
}

function getDayXAxisLabelColors() {
    let dayColors = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]


    for(let i = 0; i < 28; i++) {
        if(moment().subtract(i, "days").day() === 0 || moment().subtract(i, "days").day() === 6) {
            dayColors[27 - i] = "#FC0202";
        } else {
            dayColors[27 - i] = "blanchedalmond";
        }
    }

    return dayColors;
}
//----------------------------------------------------------------------------------------------------------------------
function getCreatedCollaboratorsMonthOption() {
    return {
        series: [{
            name: "muc",
            color: "#ffc107",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
            {
                name: "остальные",
                color: "#7cfc00",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }],
        chart: {
            width: 650,
            height: 380,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: false,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontFamily: "'ArnamuMonoBold', sans-serif",
                fontWeight: "normal",
                colors: ["#f5fffa"]
            }
        },
        grid: {
            borderColor: "#5b5b5b",
            padding: {
                top: 25,
                left: 35,
                bottom: 36,
                right: 25
            }
        },
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: getMonthXAxisCategories(),
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond"
                    ]
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                offsetX: 23,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond"]
                }
            }
        },
        legend: {
            labels: {
                colors: ["#f5fffa"]
            }
        }
    };
}
//----------------------------------------------------------------------------------------------------------------------
function processNewCollaboratorsMonth(agent) {
    newCollsAgent = agent;

    createdCollsMonthChart.updateOptions({
        xaxis: {
            categories: getMonthXAxisCategories()
        }
    });

    createdCollsMonthChart.updateSeries([
        {data: agent.muc},
        {data: agent.other}
    ]);

    $("#mucCountMonth").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountMonth").html(addNewCollaboratorCount(agent.other));

    $("#month_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getMonthXAxisCategories() {
    let monthCategories = ["", "", "", "", "", "", "", "", "", "", "", ""]

    for(let i = 0; i < 12; i++) {
        monthCategories[11 - i] = getMonthName(moment().subtract(i, "months"));
    }

    return monthCategories;
}
//----------------------------------------------------------------------------------------------------------------------
function getMonthName(datetime) {
    if(datetime.format("MM") === "01") {
        return "Янв " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "02") {
        return "Фев " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "03") {
        return "Мар " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "04") {
        return "Апр " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "05") {
        return "Май " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "06") {
        return "Июн " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "07") {
        return "Июл " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "08") {
        return "Авг " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "09") {
        return "Сен " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "10") {
        return "Окт " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "11") {
        return "Ноя " + datetime.format("YYYY");
    } else if(datetime.format("MM") === "12") {
        return "Дек " + datetime.format("YYYY");
    } else {
        return "Неизвестный";
    }
}
//----------------------------------------------------------------------------------------------------------------------
function addNewCollaboratorCount(list) {
    let result = 0;

    list.forEach((hours) => {
        result += hours;
    });

    return result;
}

function appendNetworkWatcher() {
    $("#mismatchBox").append(kendo.template($("#network_template").html()));

    networkOption.series[0].data = webData;
    webChart = new ApexCharts($("#web_chart").get(0), networkOption);
    webChart.render();

    networkOption.series[0].data = sqlData;
    sqlChart = new ApexCharts($("#sql_chart").get(0), networkOption);
    sqlChart.render();
}

function pingServers() {
    ping(0,"192.168.0.96", 80);
    ping(1, "192.168.0.97", 1433);
}

function updateMinMaxColor(element) {
    const weight = element.attr("weight");

    element.removeClass("network-green-color");
    element.removeClass("network-orange-color");
    element.removeClass("network-red-color");

    if(weight < 670) {
        element.addClass("network-green-color");
    } else if(weight >= 670 && weight < 1000) {
        element.addClass("network-orange-color");
    } else {
        element.addClass("network-red-color");
    }
}

function updateMinMax(minElement, maxElement, milliseconds) {
    if(milliseconds < parseInt(minElement.attr("weight"))) {
        minElement.attr("weight", milliseconds);
        minElement.html(milliseconds + " ms");
    }

    if(milliseconds > parseInt(maxElement.attr("weight"))) {
        maxElement.attr("weight", milliseconds);
        maxElement.html(milliseconds + " ms");
    }

    updateMinMaxColor(minElement);
    updateMinMaxColor(maxElement);
}

function checkOverloadValue(index, pingPointer) {
    if(pingPointer >= 11) {
        if(overloadData[index] <= 5) {
            overloadData[index] = overloadData[index] + 1;
        }

        if(overloadCount[index] < 6) {
            overloadCount[index] = overloadCount[index] + 1;
        }
    } else {
        if(overloadData[index] > 0) {
            overloadData[index] = overloadData[index] - 1;

            if(overloadData[index] === 0 && overloadCount[index] > 5) {
                overloadCount[index] = 0;

                // ADD TO OVERLOAD
                const currentDateTime = new Date();
                const currentTime = currentDateTime.toLocaleString("ru-RU").split(", ")[1];
                const currentHour = currentTime.split(":")[0];

                if(index === 0) {
                    webOverloadData[currentHour - 6] = webOverloadData[currentHour - 6] + 1;
                    webOverloadChart.updateSeries([{data: webOverloadData}]);
                } else {
                    sqlOverloadData[currentHour - 6] = sqlOverloadData[currentHour - 6] + 1;
                    sqlOverloadChart.updateSeries([{data: sqlOverloadData}]);
                }
            }

            if(overloadData[index] === 0) {
                overloadCount[index] = 0;
            }
        }
    }
}

function ping(id, host, port) {
    let milliseconds = 0;
    let started = new Date().getTime();

    let http = new XMLHttpRequest();

    http.open("GET", "http://" + host + ":" + port,  true);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            let ended = new Date().getTime();

            milliseconds = ended - started;

            let pingPointer = Math.round(milliseconds / 100);

            if(pingPointer <= 2) {
                pingPointer = 2;
            } else if(pingPointer > 16) {
                pingPointer = 16;
            }

            if(id === 0) {
                updateMinMax($("#web_min"), $("#web_max"), milliseconds);

                webData.shift();
                webData.unshift(pingPointer);
                webData.pop();
                webData.unshift(20);

                webChart.updateSeries([{data: webData}]);

                checkOverloadValue(0, pingPointer);
            } else if(id === 1) {
                updateMinMax($("#sql_min"), $("#sql_max"), milliseconds);

                sqlData.shift();
                sqlData.unshift(pingPointer);
                sqlData.pop();
                sqlData.unshift(20);

                sqlChart.updateSeries([{data: sqlData}]);

                checkOverloadValue(1, pingPointer);
            }

        }
    };

    try {
        http.send(null);
    } catch (exception) {}
}

function openFullNetworkPage() {
    window.open("http://192.168.0.96/fcc-desktop/network.html", "_blank").focus();
}

function showCreatedCollsBy(type) {
    if(type === "HOURS") {
        $("#colls_day").removeClass("created-colls-active");
        $("#colls_month").removeClass("created-colls-active");
        $("#colls_hour").addClass("created-colls-active");

        $("#mucCountDay").css("display", "none");
        $("#otherCountDay").css("display", "none");
        $("#createdCollsDayChart").css("display", "none");
        $("#day_datetime").css("display", "none");

        $("#mucCountMonth").css("display", "none");
        $("#otherCountMonth").css("display", "none");
        $("#createdCollsMonthChart").css("display", "none");
        $("#month_datetime").css("display", "none");

        $("#mucCountHour").css("display", "block");
        $("#otherCountHour").css("display", "block");
        $("#createdCollsHourChart").css("display", "block");
        $("#hour_datetime").css("display", "block");
    } else if(type === "DAYS") {
        $("#colls_hour").removeClass("created-colls-active");
        $("#colls_month").removeClass("created-colls-active");
        $("#colls_day").addClass("created-colls-active");

        $("#mucCountHour").css("display", "none");
        $("#otherCountHour").css("display", "none");
        $("#createdCollsHourChart").css("display", "none");
        $("#hour_datetime").css("display", "none");

        $("#mucCountMonth").css("display", "none");
        $("#otherCountMonth").css("display", "none");
        $("#createdCollsMonthChart").css("display", "none");
        $("#month_datetime").css("display", "none");

        $("#mucCountDay").css("display", "block");
        $("#otherCountDay").css("display", "block");
        $("#createdCollsDayChart").css("display", "block");
        $("#day_datetime").css("display", "block");
    } else if(type === "MONTH") {
        $("#colls_hour").removeClass("created-colls-active");
        $("#colls_day").removeClass("created-colls-active");
        $("#colls_month").addClass("created-colls-active");

        $("#mucCountHour").css("display", "none");
        $("#otherCountHour").css("display", "none");
        $("#createdCollsHourChart").css("display", "none");
        $("#hour_datetime").css("display", "none");

        $("#mucCountDay").css("display", "none");
        $("#otherCountDay").css("display", "none");
        $("#createdCollsDayChart").css("display", "none");
        $("#day_datetime").css("display", "none");

        $("#mucCountMonth").css("display", "block");
        $("#otherCountMonth").css("display", "block");
        $("#createdCollsMonthChart").css("display", "block");
        $("#month_datetime").css("display", "block");
    }
}

function pinUnpinParent(element) {
    const pinButtonElement = $("#" + element.getAttribute("id"));
    const parentElement = $("#rowId" + element.getAttribute("parent"));

    if(pinButtonElement.html().toUpperCase() === "PIN") {
        for (let id in pinnedWindows) {
            $("#" + id).css("z-index", parseInt($("#" + id).css("z-index")) - 1);
        }
        pinnedWindows[parentElement.attr("id")] = 0;

        pinButtonElement.html("Unpin");

        parentElement.addClass("pinned");
        parentElement.css("z-index", 1000);
        parentElement.css("cursor", "pointer");
        parentElement.attr("pin", 1);
        parentElement.draggable();

        if(!parentElement.hasClass("thread-active")) {
            parentElement.addClass("pinned-color");
        }
    } else {
        pinButtonElement.html("Pin");

        parentElement.removeClass("pinned");
        parentElement.css("z-index", 0);
        parentElement.css("cursor", "default");
        parentElement.attr("pin", 0);

        if(parentElement.hasClass("thread-inactive")) {
            parentElement.removeClass("pinned-color");
        }

        delete pinnedWindows[parentElement.attr("id")];
    }
}

function haveFocus(element) {
    const focusedElement = $("#" + element.getAttribute("id"));

    if(parseInt(focusedElement.attr("pin")) === 1) {
        for (let id in pinnedWindows) {
            $("#" + id).css("z-index", parseInt($("#" + id).css("z-index")) - 1);
        }
        focusedElement.css("z-index", 1000);
    }
}

function refreshHourChart() {
    $.ajax({
        url: "http://192.168.0.96/_wt/doc_type/custom_web_template_id/7419255387363809706",
        method: "GET",
        /*dataType: "json",
        data: {
            channelId: $("#type_combobox1").val(),
        },*/
        async: true,
        success: function (data) {
        },
        error: function (httpRequest, textStatus, errorThrown) {
            //alert(textStatus);
        }
    });

}

$(document).ready(function () {
    $("#start_datetime").html("Activated: " + getCurrentDateTime());

    $("#ws_server").html(lowSVG);

    const options = getSummaryOption();
    options.series[0].data = challengesData;
    options.chart.height = 380;
    options.dataLabels.style.colors = ["darkblue"];
    options.fill.colors = [hoursChartBottomColor];
    options.fill.gradient.gradientToColors = [hoursChartTopColor];

    challengerChart = new ApexCharts($("#hoursChart").get(0), options);
    challengerChart.render();

    const mismatchBoxElement = $("#mismatchBox");
    const mismatchTemplateElement = $("#mismatch_template");
    const overloadTemplateElement = $("#overload_template");

    appendNetworkWatcher();

    appendCreatedCollaboratorsBox();

    appendOverloadBlock(mismatchBoxElement, overloadTemplateElement, "Overload Web: 192.168.0.96 (порт: 80)", 0, webOverloadData);
    appendOverloadBlock(mismatchBoxElement, overloadTemplateElement, "Overload SQL: 192.168.0.97 (порт: 1433)", 1, sqlOverloadData);

    /*appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 0,  "Досье: ФЦК", "Изменилось количество пройденных программ", 7368463748813160933, "#212529");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 1, "Досье: РЦК", "Изменилось количество пройденных программ", 7368463748813160933, "#212529");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 2, "Мероприятия: битые ссылки", "Результат мероприятия имеет ломанные ссылки на мероприятие", 7382143266387215552, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 3, "Сотрудники: битые ссылки", "Результат мероприятия имеет ломанные ссылки на сотрудника", 7382143266387215552, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 4, "Досье: инструкторы", "Количество проблемных номеров сертификатов", 7389939808110063496, "#212529");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 5, "Досье: тренеры", "Количество проблемных номеров сертификатов", 7389939808110063496, "#212529");*/
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 0, "Признак: in_program", "Не верный признак <b>in_program</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 1, "Признак: is_fcc", "Не верный признак <b>is_fcc</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 2, "Признак: is_rck", "Не верный признак <b>is_rck</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 3, "Признак: is_ock", "Не верный признак <b>is_ock</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 4, "Признак: is_roiv", "Не верный признак <b>is_roiv</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 5, "Признак: is_partner", "Не верный признак <b>is_partner</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 6, "Признак: is_a_commerce_client", "Не верный признак <b>is_a_commerce_client</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 7, "Признак: is_ock", "Не верный признак <b>is_ock</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 8, "Признак: is_project_ended", "Не верный признак <b>is_project_ended</b> сотрудника", 7397671274748933246, "#4a4e50");
    appendMismatchBlock(mismatchBoxElement, mismatchTemplateElement, 9, "Признак: With_no_right", "Не верный признак <b>With_no_right</b> сотрудника", 7397671274748933246, "#4a4e50");

    setInterval(refreshDuration, 1000);
    setInterval(pingServers, 1000);
    setInterval(refreshVisitors, 30000);
    setInterval(checkWebsocketServerIsLive, 10000);

    const dialog = document.querySelector("dialog");
    const closeButton = document.querySelector("dialog button");

    closeButton.addEventListener("click", () => {
        dialog.close();
    });
});