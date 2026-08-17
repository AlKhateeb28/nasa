"use strict";

var newCollsAgent = null;

var isConnected = false;
var pongDate;
var pingTimeout = 300000;

var challengerChart;
var challengesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let activeGroupName = "";

let helperGroupIDs = [
    "7437057559620972968",
    "7437386579509580998",
    "7299983342287187981",
    "7207884401104677018",
    "7300978396789946474"
];

let courseGroupIDs = [
    "7169007381472566729",
    "7168940904002975753",
    "7168598185951097742"
];

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

const helperSVG = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 64.000000 64.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
        <path d="M333 455 c-78 -93 -91 -104 -115 -100 -19 3 -36 -3 -58 -21 -32 -27 -38 -52 -18 -72 9 -9 4 -20 -22 -47 l-34 -35 20 -27 c11 -15 32 -36 47 -47 l27 -20 35 34 c27 26 38 31 47 22 20 -20 45 -14 72 19 18 21 24 38 20 53 -5 20 11 37 100 115 l106 92 0 58 c0 31 -5 62 -12 69 -7 7 -38 12 -70 12 l-57 0 -88 -105z m157 16 c0 -19 -177 -178 -187 -168 -2 3 30 46 72 96 76 89 115 114 115 72z m-245 -202 c35 -31 60 -67 53 -75 -2 -2 -29 21 -58 51 -58 59 -54 76 5 24z m-51 -90 c-9 -10 -21 -16 -26 -13 -5 3 -2 14 8 25 9 10 21 16 26 13 5 -3 2 -14 -8 -25z"></path>
    </g>
</svg>`;

const lookupSVG = `<svg fill="#ffffff" height="30px" width="30px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.104 485.104" xml:space="preserve">
        <g>
	        <path d="M110.028,115.171c-4.76-4.767-12.483-4.752-17.227,0c-32.314,32.33-32.314,84.898-0.016,117.197 c2.38,2.379,5.487,3.569,8.614,3.569c3.123,0,6.234-1.19,8.613-3.569c4.76-4.76,4.76-12.469,0-17.228 c-22.795-22.803-22.795-59.923,0.016-82.742C114.788,127.64,114.788,119.923,110.028,115.171z"/>
	        <path d="M471.481,405.861L324.842,259.23c37.405-66.25,28.109-151.948-28.217-208.317C263.787,18.075,220.133,0,173.718,0 C127.287,0,83.633,18.075,50.81,50.913c-67.717,67.74-67.701,177.979,0.02,245.738c32.85,32.823,76.488,50.897,122.919,50.897 c30.489,0,59.708-7.939,85.518-22.595L405.824,471.51c18.113,18.121,47.493,18.129,65.641,0 c8.706-8.71,13.593-20.512,13.608-32.823C485.073,426.37,480.171,414.567,471.481,405.861z M85.28,262.191 c-48.729-48.756-48.729-128.079-0.016-176.828c23.62-23.627,55.029-36.634,88.453-36.634c33.407,0,64.816,13.007,88.451,36.627 c48.715,48.756,48.699,128.094-0.015,176.85c-23.62,23.612-55.014,36.612-88.406,36.612 C140.341,298.818,108.919,285.811,85.28,262.191z"/>
        </g>
    </svg>`;

const updateSVG = `<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 493.935 493.936" xml:space="preserve">
    <g>
	    <g>
            <path d="M276.217,186.19c16.236-49.241,4.914-105.582-34.254-144.744C201.779,1.262,143.517-9.656,93.394,8.496
                c-4.51,1.634-5.324,5.955-1.934,9.345l87.871,87.871c3.391,3.391,4.847,9.804,3.25,14.327l-13.433,38.042
                c-1.597,4.523-6.555,9.48-11.077,11.078l-38.061,13.445c-4.522,1.598-10.936,0.141-14.327-3.25L17.824,91.489
                c-3.391-3.391-7.711-2.577-9.339,1.928C-9.654,143.534,1.27,201.79,41.441,241.968c39.168,39.168,95.502,50.49,144.744,34.254
                l208.392,208.386c12.436,12.437,32.602,12.437,45.037,0l44.994-44.994c12.436-12.436,12.436-32.601,0-45.037L276.217,186.19z
                M426.426,445.954c-12.362,0-22.381-10.019-22.381-22.381s10.019-22.381,22.381-22.381s22.381,10.019,22.381,22.381
                S438.789,445.954,426.426,445.954z"/>
	    </g>
    </g>
</svg>`;

const leftSVG = `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 9.02615L9.50135 8.9811C9.50045 8.9961 9.5 9.01113 9.5 9.02615H10.25ZM9.71578 8.10177L9.38104 8.77293L9.38104 8.77293L9.71578 8.10177ZM8.656 8.23115L8.16963 7.66024C8.16481 7.66434 8.16005 7.6685 8.15534 7.67273L8.656 8.23115ZM5.35 11.1952L4.84934 10.6367L4.84814 10.6378L5.35 11.1952ZM5 11.9902L5.75008 11.9964L5.74997 11.9839L5 11.9902ZM5.35 12.7852L4.84813 13.3425L4.84943 13.3437L5.35 12.7852ZM8.656 15.7482L8.15543 16.3067C8.16011 16.3109 8.16484 16.315 8.16963 16.3191L8.656 15.7482ZM9.71578 15.8775L9.38104 15.2064V15.2064L9.71578 15.8775ZM10.25 14.9532H9.5C9.5 14.9682 9.50045 14.9832 9.50135 14.9982L10.25 14.9532ZM10.25 11.2402C9.83579 11.2402 9.5 11.5759 9.5 11.9902C9.5 12.4044 9.83579 12.7402 10.25 12.7402V11.2402ZM19 12.7402C19.4142 12.7402 19.75 12.4044 19.75 11.9902C19.75 11.5759 19.4142 11.2402 19 11.2402V12.7402ZM11 11.9902V9.02615H9.5V11.9902L11 11.9902ZM10.9986 9.0712C11.04 8.38373 10.6668 7.738 10.0505 7.43061L9.38104 8.77293C9.45925 8.81193 9.5066 8.89387 9.50135 8.9811L10.9986 9.0712ZM10.0505 7.43061C9.4342 7.12323 8.69388 7.21361 8.16963 7.66024L9.14237 8.80206C9.2089 8.74539 9.30284 8.73392 9.38104 8.77293L10.0505 7.43061ZM8.15534 7.67273L4.84934 10.6367L5.85066 11.7536L9.15666 8.78958L8.15534 7.67273ZM4.84814 10.6378C4.46349 10.9842 4.24573 11.4788 4.25003 11.9964L5.74997 11.9839C5.74924 11.8958 5.78634 11.8115 5.85186 11.7525L4.84814 10.6378ZM4.25003 11.9839C4.24573 12.5015 4.46349 12.9961 4.84814 13.3425L5.85186 12.2278C5.78634 12.1688 5.74924 12.0845 5.74997 11.9964L4.25003 11.9839ZM4.84943 13.3437L8.15543 16.3067L9.15656 15.1896L5.85056 12.2266L4.84943 13.3437ZM8.16963 16.3191C8.69389 16.7657 9.4342 16.8561 10.0505 16.5487L9.38104 15.2064C9.30284 15.2454 9.2089 15.2339 9.14237 15.1772L8.16963 16.3191ZM10.0505 16.5487C10.6668 16.2413 11.04 15.5956 10.9986 14.9081L9.50135 14.9982C9.5066 15.0854 9.45925 15.1674 9.38104 15.2064L10.0505 16.5487ZM11 14.9532V11.9902L9.5 11.9902V14.9532L11 14.9532ZM10.25 12.7402H19V11.2402H10.25V12.7402Z" fill="#f5f5f5"/>
</svg>`;

const networkOption = {
    series: [{
        data: []
    }],
    chart: {
        animations: { enabled: false },
        height: 90,
        type: "bar",
        offsetX: -15,
        toolbar: { show: false },
        zoom: { enabled: false }
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
            function ({ value, seriesIndex, w }) {
                if (value === 20) {
                    return "#212529";
                }

                if (value < 6) {
                    return "#7CFC00";
                } else if (value >= 6 && value < 11) {
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
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { enabled: false },
    grid: { show: false, xaxis: { lines: { show: false } }, yaxis: { lines: { show: false } } },
    xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false }, tooltip: { enabled: false } },
    yaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } }
};

let helperRunAgents = [
    { start: 57, finish: 1, name: "HELPER" },               // 0
    { start: 2, finish: 6, name: "HELPER RIGHTLESS" },      // 1
    { start: 7, finish: 11, name: "HELPER" },               // 2
    { start: 8, finish: 16, name: "HELPER RIGHTLESS" },     // 3
    { start: 17, finish: 21, name: "HELPER" },              // 4
    { start: 22, finish: 23, name: "SMART HELPER 0/1" },    // 5
    { start: 24, finish: 26, name: "HELPER RIGHTLESS" },    // 6
    { start: 27, finish: 31, name: "HELPER" },              // 7
    { start: 32, finish: 36, name: "HELPER RIGHTLESS" },    // 8
    { start: 37, finish: 41, name: "HELPER" },              // 9
    { start: 42, finish: 46, name: "HELPER RIGHTLESS" },    // 10
    { start: 47, finish: 51, name: "HELPER" },              // 11
    { start: 52, finish: 53, name: "УБЕРНАТОР" },           // 12
    { start: 54, finish: 56, name: "HELPER RIGHTLESS" },    // 13
];

var webSocket = getWebSocket(window.WebSocket);

webSocket.onmessage = function (event) {
    setWSStateAsAlive();

    receiveMessage(event.data).then(r => r);
};

async function receiveMessage(promise) {
    if (typeof promise === "string") {
        showMessage(promise);
    } else {
        promise.text().then((value) => {
            showMessage(value);
        });
    }
}

function getFirst(minutes) {
    let result = {};
    result.name = "";
    result.index = -1;

    let step = 0;

    helperRunAgents.every(item => {
        if (minutes <= 1) {
            result.name = helperRunAgents[0].name;
            result.remained = helperRunAgents[0].finish - minutes;
            result.finish = helperRunAgents[0].finish;
            result.index = 0;

            return false;
        } else if (minutes >= 57) {
            result.name = helperRunAgents[0].name;
            result.remained = 60 - minutes + helperRunAgents[0].finish;
            result.finish = helperRunAgents[0].finish;
            result.index = 0;

            return false;
        } else if (minutes >= 54 && minutes <= 56) {
            result.name = helperRunAgents[13].name;
            result.remained = helperRunAgents[13].finish - minutes;
            result.finish = helperRunAgents[13].finish;
            result.index = -1;

            return false;
        } else if (minutes >= item.start && minutes <= item.finish) {
            result.name = item.name;
            result.remained = item.finish - minutes;
            result.finish = item.finish;
            result.index = step;

            return false;
        }

        step++;

        return true;
    });

    return result;
}

function getNext(agent) {
    let result = {};

    if (agent.index + 1 === 0) {
        result.name = helperRunAgents[0].name;
        result.remained = (60 - agent.finish + helperRunAgents[0].finish + agent.remained);
        result.finish = helperRunAgents[0].finish;
        result.index = 0;
    } else if (agent.index + 1 === 13) {
        result.name = helperRunAgents[13].name;
        result.remained = (helperRunAgents[13].finish - agent.finish + agent.remained);
        result.finish = helperRunAgents[13].finish;
        result.index = -1;
    } else {
        result.name = helperRunAgents[agent.index + 1].name;
        result.remained = (helperRunAgents[agent.index + 1].finish - agent.finish + agent.remained);
        result.finish = helperRunAgents[agent.index + 1].finish;
        result.index = agent.index + 1;
    }

    return result;
}

function getNextRunningAgents() {
    const minutes = getCurrentTime().split(":")[1];

    let agent = getFirst(minutes);
    $("#agent0").html(agent.name);
    if (agent.remained === 0) {
        $("#time0").html("Running");
    } else {
        $("#time0").html(agent.remained + " min");
    }

    agent = getNext(agent);
    $("#agent1").html(agent.name);
    $("#time1").html(agent.remained + " min");

    agent = getNext(agent);
    $("#agent2").html(agent.name);
    $("#time2").html(agent.remained + " min");

    agent = getNext(agent);
    $("#agent3").html(agent.name);
    $("#time3").html(agent.remained + " min");
}

function isInGroup(agentId) {
    if (activeGroupName === "") {
        return true;
    } else if (activeGroupName === "HELPER") {
        return isInGroupIDs(helperGroupIDs, agentId);
    }
}

function isInGroupIDs(group, agentId) {
    let isFound = false;

    for (let i = 0; i < group.length; i++) {
        if (group[i] === agentId) {
            isFound = true;
        }
    };

    return isFound;
}

function putGroupMark(group) {
    $(".agent-box").each(function (index) {
        const agentId = $(this).attr("data-id");

        if (!isInGroupIDs(group, agentId)) {
            $(this).css("display", "none");
        }
    });
}

function removeGroupMark() {
    $(".agent-box").each(function (index) {
        $(this).css("display", "block");
    });
}

function onHelperGroupClick(element) {
    if (activeGroupName === "") {
        activeGroupName = "HELPER";

        $("#task_box").css("height", "251px");
        $("#helper_info").css("display", "block");

        $(element).addClass("group-btn-flash");
        $(element).css("color", "gold");

        putGroupMark(helperGroupIDs);

        $("#agent_block0").css("display", "block");
        $("#agent_block1").css("display", "block");
        $("#agent_block2").css("display", "block");
        $("#agent_block3").css("display", "block");
    } else if (activeGroupName === "HELPER") {
        activeGroupName = "";

        $("#task_box").css("height", "50px");
        $("#helper_info").css("display", "none");

        $(element).removeClass("group-btn-flash");
        $(element).addClass("run-group-inactive");
        $(element).css("color", "mintcream");

        removeGroupMark();

        $("#agent_block0").css("display", "none");
        $("#agent_block1").css("display", "none");
        $("#agent_block2").css("display", "none");
        $("#agent_block3").css("display", "none");
    }
}

function onCoursesGroupClick(element) {
    if (activeGroupName === "") {
        activeGroupName = "COURSE";

        $("#task_box").css("height", "251px");
        $("#course_info").css("display", "block");

        $(element).addClass("group-btn-flash");
        $(element).css("color", "gold");

        putGroupMark(courseGroupIDs);

        $("#agent_block0").css("display", "none");
        $("#agent_block1").css("display", "none");
        $("#agent_block2").css("display", "none");
        $("#agent_block3").css("display", "none");
    } else if (activeGroupName === "COURSE") {
        activeGroupName = "";

        $("#task_box").css("height", "50px");
        $("#course_info").css("display", "none");

        $(element).removeClass("group-btn-flash");
        $(element).addClass("run-group-inactive");
        $(element).css("color", "mintcream");

        removeGroupMark();

        $("#agent_block0").css("display", "none");
        $("#agent_block1").css("display", "none");
        $("#agent_block2").css("display", "none");
        $("#agent_block3").css("display", "none");
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
            toolbar: { show: false },
            zoom: { enabled: false }
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
        stroke: { curve: 'smooth' },
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
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
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
        yaxis: { axisBorder: { show: false }, axisTicks: { show: false, }, labels: { show: false } },
        legend: { show: false },
        tooltip: { enabled: false }
    };
}

function showMessage(message) {
    if (message.indexOf("#") > -1) {
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

            if (agents[clientAgent.getId()] !== undefined) {
                agents[clientAgent.getId()].setMessageDate(new Date());
                agents[clientAgent.getId()].setFetchTime(clientAgent.getFetchTime());
                agents[clientAgent.getId()].setHandlingTime(clientAgent.getHandlingTime());
                agents[clientAgent.getId()].setSavingTime(clientAgent.getSavingTime());

                if (agents[clientAgent.getId()].getState() > 0) {
                    $("#msPerRow_" + clientAgent.getId()).html("--");
                    $("#chart_" + clientAgent.getId() + " svg").last().remove();
                }

                if (agents[clientAgent.getId()].getState() !== clientAgent.getState()) {
                    agents[clientAgent.getId()].setStartDateTime(new Date());

                    if (clientAgent.getState() == 0) {
                        $("#dateTime_" + clientAgent.getId()).html(getCurrentDateTime());
                    }

                    const waitElement = $("#wait" + clientAgent.getId())
                    waitElement.css("visibility", "visible");

                    if (clientAgent.getState() !== 2) {
                        const errorBoxElement = $("#errorBox_" + clientAgent.getId());
                        errorBoxElement.css("visibility", "hidden");
                        errorBoxElement.html("");
                    }

                    if (clientAgent.getState() === 0) {
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
                    $("#expected_" + clientAgent.getId()).html(getExpectedTime(clientAgent));
                }

                agents[clientAgent.getId()].setState(clientAgent.getState());

                refreshAgentBox(clientAgent, agent);

                if (clientAgent.getState() > 0) {
                    wsStateElement.attr("title", "WS is sleeping");

                    newBoxId = changeFinishedAgentId(clientAgent, agents[clientAgent.getId()], agent);

                    //saveAgent(clientAgent);
                } else {
                    agentStateElement.attr("title", "Agent is running");
                    wsStateElement.attr("title", "WS is running");
                }
            } else {
                clientAgent.setStartDateTime(new Date());

                agents[clientAgent.getId()] = clientAgent;

                createAgentBox(clientAgent, agent);

                $("#active-count").html(parseInt($("#active-count").html()) + 1);
            }

            if (clientAgent.getState() === 2) {
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
        } else if (agent.type === "CHALLENGE") {
            agent.challenges.forEach((challenge) => {
                changeChallengesData(challenge);
            });

            challengerChart.updateSeries([{ data: challengesData }]);

            calculateChallenges();
        } else if (agent.type === "MISMATCH") {
            processMismatchMessage(agent);
        } else if (agent.type === "NEW_COLLS_HOURS") {
            processNewCollaboratorsHour(agent);
        } else if (agent.type === "NEW_COLLS_DAYS") {
            processNewCollaboratorsDay(agent);
        } else if (agent.type === "NEW_COLLS_MONTH") {
            processNewCollaboratorsMonth(agent);
        }
    } else {
        if (message === "pong") {
            setWSStateAsAlive();

            pongDate = new Date();

            if (!isConnected) {
                isConnected = true;

                checkPingState();
                setTimeout(checkPingState, pingTimeout);
            }
        } else if (message.indexOf("vis-") > -1) {
            showFreshVisitors(message);
        }
    }
}

function changeChallengesData(challenge) {
    let currentDateTime;

    if (challenge == null) {
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
    if ((new Date() - pongDate - 60000) > pingTimeout) {
        setWSStateAsDead();
    } else {
        webSocket.send("ping");

        setTimeout(checkPingState, pingTimeout);
    }
}

function getExpectedTime(agent) {
    if (agent.getTotal() === "--" || agent.getTotal() === "--" || agent.getMsPerRow() === 0) {
        return "";
    } else {
        let expectedTime = Math.round((agent.getTotal() - agent.getProcessed()) * agent.getMsPerRow());

        if (expectedTime < 60) {
            return "00:00:" + expectedTime.toString().padStart(2, "0");
        } else if (expectedTime >= 60 && expectedTime < 3600) {
            return "00:" +
                Math.floor(expectedTime / 60).toString().padStart(2, "0") + ":" +
                (expectedTime % 60).toString().padStart(2, "0");
        } else {
            const seconds = expectedTime - 3600 * Math.floor(expectedTime / 3600);

            let minSecString = "";

            if (seconds < 60) {
                minSecString = "00:" + seconds.toString().padStart(2, "0");
            } else {
                minSecString = Math.floor(seconds / 60).toString().padStart(2, "0") + ":" +
                    (seconds % 60).toString().padStart(2, "0");
            }

            return Math.floor(expectedTime / 3600).toString().padStart(2, "0") + ":" + minSecString;
        }
    }
}

function fillHelperInfoValue(originalAgent, formIdPreffix, flagValue) {
    const prevValue = parseInt($("#" + formIdPreffix + originalAgent.id).text());
    const newValue = prevValue + flagValue;

    $("#" + formIdPreffix + originalAgent.id).html(newValue);

    if (newValue > 0) {
        $("#" + formIdPreffix + originalAgent.id).css("font-weight", "600");

        if (prevValue === newValue) {
            $("#" + formIdPreffix + originalAgent.id).css("color", "#f5f5f5");
        } else {
            $("#" + formIdPreffix + originalAgent.id).css("color", "#00ff00");
        }
    }
}

function changeFinishedAgentId(agent, stackAgent, originalAgent) {
    const newAgentId = agent.getId() + "-" + Math.floor(Math.random() * 100000);

    delete agents[agent.getId()];

    $("#wait" + agent.getId()).attr("id", "wait" + newAgentId);
    $("#agentState" + agent.getId()).attr("id", "agentState" + newAgentId);
    $("#wsState" + agent.getId()).attr("id", "wsState" + newAgentId);

    for (let id in pinnedWindows) {
        if (id === "rowId" + agent.getId()) {
            delete pinnedWindows[id];

            pinnedWindows["rowId" + newAgentId] = 0;
        }
    }

    const rowElement = $("#rowId" + agent.getId());
    rowElement.removeClass("thread-active");
    rowElement.addClass("thread-inactive");
    if (parseInt(rowElement.attr("pin")) === 1) {
        rowElement.addClass("pinned-color");
    }

    rowElement.attr("id", "rowId" + newAgentId);

    const pinElement = $("#pin_btn_" + agent.getId());
    pinElement.attr("id", "pin_btn_" + newAgentId);
    pinElement.attr("parent", newAgentId);

    $("#agentId" + agent.getId()).attr("id", "agentId" + newAgentId);
    $("#agentName" + agent.getId()).attr("id", "agentName" + newAgentId);
    $("#agentCopyId_" + agent.getId()).attr("id", "agentCopyId_" + newAgentId);
    $("#userCopyId_" + agent.getId()).attr("id", "userCopyId_" + newAgentId);
    $("#userId" + agent.getId()).attr("id", "userId" + newAgentId);
    $("#userName" + agent.getId()).attr("id", "userName" + newAgentId);
    $("#total" + agent.getId()).attr("id", "total" + newAgentId);
    $("#processed" + agent.getId()).attr("id", "processed" + newAgentId);
    $("#skipped" + agent.getId()).attr("id", "skipped" + newAgentId);
    $("#saved" + agent.getId()).attr("id", "saved" + newAgentId);
    $("#notFound" + agent.getId()).attr("id", "notFound" + newAgentId);
    $("#message" + agent.getId()).attr("id", "message" + newAgentId);
    $("#duration" + agent.getId()).attr("id", "duration" + newAgentId);
    $("#msPerRow_" + agent.getId()).attr("id", "msPerRow_" + newAgentId);

    const expectedElement = $("#expected_" + agent.getId());
    expectedElement.html("00:00:00");
    expectedElement.attr("id", "expected_" + newAgentId);

    $("#errorBox_" + agent.getId()).attr("id", "errorBox_" + newAgentId);
    $("#optionalHeader_" + agent.getId()).attr("id", "optionalHeader_" + newAgentId);
    $("#optionalData_" + agent.getId()).attr("id", "optionalData_" + newAgentId);
    $("#name1_" + agent.getId()).attr("id", "name1_" + newAgentId);
    $("#value1_" + agent.getId()).attr("id", "value1_" + newAgentId);
    $("#name2_" + agent.getId()).attr("id", "name2_" + newAgentId);
    $("#value2_" + agent.getId()).attr("id", "value2_" + newAgentId);

    $("#active-count").html(parseInt($("#active-count").html()) - 1);
    $("#inactive-count").html(parseInt($("#inactive-count").html()) + 1);

    if (isInGroupIDs(helperGroupIDs, "" + originalAgent.id)) {
        if (Object.hasOwn(originalAgent, "inProgram")) {
            fillHelperInfoValue(originalAgent, "helper_program_", originalAgent.inProgram);
        }
        if (Object.hasOwn(originalAgent, "isFcc")) {
            fillHelperInfoValue(originalAgent, "helper_fcc_", originalAgent.isFcc);
        }
        if (Object.hasOwn(originalAgent, "isRck")) {
            fillHelperInfoValue(originalAgent, "helper_rck_", originalAgent.isRck);
        }
        if (Object.hasOwn(originalAgent, "isOck")) {
            fillHelperInfoValue(originalAgent, "helper_ock_", originalAgent.isOck);
        }
        if (Object.hasOwn(originalAgent, "isRoiv")) {
            fillHelperInfoValue(originalAgent, "helper_roiv_", originalAgent.isRoiv);
        }
        if (Object.hasOwn(originalAgent, "isPartner")) {
            fillHelperInfoValue(originalAgent, "helper_partner_", originalAgent.isPartner);
        }
        if (Object.hasOwn(originalAgent, "isCommerce")) {
            fillHelperInfoValue(originalAgent, "helper_commerce_", originalAgent.isCommerce);
        }
        if (Object.hasOwn(originalAgent, "isProjectEnded")) {
            fillHelperInfoValue(originalAgent, "helper_ended_", originalAgent.isProjectEnded);
        }
        if (Object.hasOwn(originalAgent, "withNoRight")) {
            fillHelperInfoValue(originalAgent, "helper_wnr_", originalAgent.withNoRight);
        }
        if (Object.hasOwn(originalAgent, "step1")) {
            fillHelperInfoValue(originalAgent, "helper_step1_", originalAgent.step1);
        }
        if (Object.hasOwn(originalAgent, "step2")) {
            fillHelperInfoValue(originalAgent, "helper_step2_", originalAgent.step2);
        }
        if (Object.hasOwn(originalAgent, "step3")) {
            fillHelperInfoValue(originalAgent, "helper_step3_", originalAgent.step3);
        }
    }

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
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        legend: { show: false },
        tooltip: { enabled: false },
        grid: { show: false, xaxis: { lines: { show: false } }, yaxis: { lines: { show: false } } },
        xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false }, tooltip: { enabled: false } },
        yaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } }
    };

    const chartElement = $("#chart_" + agent.getId());

    const chart = new ApexCharts(chartElement.get(0), options);
    chart.render();

    chartElement.attr("id", "chart_" + newAgentId);
}

function refreshOptionalData(agent) {
    if (agent.getOptionalData() !== undefined) {
        if (agent.getOptionalData().getName1() !== undefined) {
            const name1Element = $("#name1_" + agent.getId());
            const value1Element = $("#value1_" + agent.getId());

            name1Element.css("visibility", "visible");
            value1Element.css("visibility", "visible");

            name1Element.html(agent.getOptionalData().getName1());
            value1Element.html(agent.getOptionalData().getValue1());
        }

        if (agent.getOptionalData().getName2() != undefined) {
            const name2Element = $("#name2_" + agent.getId());
            const value2Element = $("#value2_" + agent.getId());

            name2Element.css("visibility", "visible");
            value2Element.css("visibility", "visible");

            name2Element.html(agent.getOptionalData().getName2());
            value2Element.html(agent.getOptionalData().getValue2());
        }
    }
}

function refreshMsMaxPerRow(agent) {
    if (agent.getMsPerRow() > 0) {
        let msPerRow = Math.ceil((agent.getMsPerRow() * 1000) * 100) / 100;

        $("#msPerRow_" + agent.getId()).html(msPerRow + " ms");
    }
}

function getValueWithPercent(value, total) {
    if (total === "--" || total === 0 || value === "--") {
        return value;
    } else {
        const percentValue = Math.round(parseInt(value) * 100 / parseInt(total));

        return value + " (" + percentValue + "%)";
    }
}

function getCorrectAgentName(name) {
    if (name.length > 67) {
        name = name.substring(0, 61) + " ...";
    }

    return name;
}

function refreshAgentBox(agent, originalAgent) {
    $("#agentId" + agent.getId()).html(agent.getId());
    $("#agentName" + agent.getId()).html(getCorrectAgentName(agent.getName()));
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

function createAgentBox(agent, originalAgent) {
    refreshVisitors();

    changeChallengesData(null);
    challengerChart.updateSeries([{ data: challengesData }]);

    calculateChallenges();

    $("#table").prepend(kendo.template($("#template").html()));

    $("#wait").attr("id", "wait" + agent.getId());
    $("#agentState").attr("id", "agentState" + agent.getId());
    $("#wsState").attr("id", "wsState" + agent.getId());

    $("#rowId").attr("id", "rowId" + agent.getId());
    if (!isInGroup("" + agent.getId())) {
        $("#rowId" + agent.getId()).css("display", "none");
    }
    $("#rowId" + agent.getId()).attr("data-id", "" + agent.getId());
    $("#rowId" + agent.getId()).addClass("agent_" + agent.getId());

    $("#icon_svg").attr("id", "icon_svg_" + agent.getId());
    if (Object.hasOwn(originalAgent, "processed_mode")) {
        if (originalAgent.processed_mode === "lookup") {
            $("#icon_svg_" + agent.getId()).css("display", "block");

            $("#icon_svg_" + agent.getId()).html(lookupSVG);
            $("#icon_svg_" + agent.getId()).addClass("lookup-rotate");
        } else if (originalAgent.processed_mode === "update") {
            $("#icon_svg_" + agent.getId()).css("display", "block");

            $("#icon_svg_" + agent.getId()).html(updateSVG);
            $("#icon_svg_" + agent.getId()).addClass("update-rotate");
        }
    }

    const pinElement = $("#pin_btn");
    pinElement.attr("parent", agent.getId());
    pinElement.attr("id", "pin_btn_" + agent.getId());

    $("#agentId").attr("id", "agentId" + agent.getId());
    $("#agentId" + agent.getId()).html(agent.getId());
    $("#agentName").attr("id", "agentName" + agent.getId());
    $("#agentName" + agent.getId()).html(getCorrectAgentName(agent.getName()));
    if (isInGroupIDs(helperGroupIDs, "" + agent.getId())) {
        $("#rowId" + agent.getId()).addClass("helper");

        $("#agentName" + agent.getId()).css("color", "whitesmoke");
        $("#agentName" + agent.getId()).css("font-weight", "600");
    } else {
        $("#agentName" + agent.getId()).css("color", "#mediumspringgreen");
    }
    $("#agentCopyId").attr("id", "agentCopyId_" + agent.getId());
    $("#agentCopyId_" + agent.getId()).attr("agentId", agent.getId());
    $("#userCopyId").attr("id", "userCopyId_" + agent.getId());
    $("#userCopyId_" + agent.getId()).attr("userId", agent.getUserId());
    $("#userId").attr("id", "userId" + agent.getId());
    $("#userId" + agent.getId()).html(agent.getUserId());
    $("#userName").attr("id", "userName" + agent.getId());
    $("#userName" + agent.getId()).html(agent.getUserName());
    $("#total").attr("id", "total" + agent.getId());
    $("#total" + agent.getId()).html(agent.getTotal());
    $("#processed").attr("id", "processed" + agent.getId());
    $("#processed" + agent.getId()).html(agent.getProcessed());
    $("#skipped").attr("id", "skipped" + agent.getId());
    $("#skipped" + agent.getId()).html(agent.getSkipped());
    $("#saved").attr("id", "saved" + agent.getId());
    $("#saved" + agent.getId()).html(agent.getSaved());
    $("#notFound").attr("id", "notFound" + agent.getId());
    $("#notFound" + agent.getId()).html(agent.getNotFound());
    $("#message").attr("id", "message" + agent.getId());
    $("#message" + agent.getId()).html(agent.getMessage());
    $("#duration").attr("id", "duration" + agent.getId());
    $("#duration" + agent.getId()).html("00:00:00");
    $("#chart").attr("id", "chart_" + agent.getId());
    $("#msPerRow").attr("id", "msPerRow_" + agent.getId());
    $("#dateTime").attr("id", "dateTime_" + agent.getId());
    $("#dateTime_" + agent.getId()).html(getCurrentDateTime());
    $("#expected").attr("id", "expected_" + agent.getId());
    $("#errorBox").attr("id", "errorBox_" + agent.getId());
    $("#optionalHeader").attr("id", "optionalHeader_" + agent.getId());
    $("#optionalData").attr("id", "optionalData_" + agent.getId());
    $("#name1").attr("id", "name1_" + agent.getId());
    $("#value1").attr("id", "value1_" + agent.getId());
    $("#name2").attr("id", "name2_" + agent.getId());
    $("#value2").attr("id", "value2_" + agent.getId());

    refreshOptionalData(agent);
    refreshMsMaxPerRow(agent);
}

function calculateDurationTime(startDateTime, currentDateTime, total, processed) {
    return durationTimeToString(currentDateTime - startDateTime)
}

function durationTimeToString(duration) {
    const ms = duration % 1000;
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
    for (const id in agents) {
        if (agents[id].getState() === 0) {
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
    for (const id in agents) {
        const wsStateElement = $("#wsState" + agents[id].getId());

        if (agents[id].getState() === 0) {
            if ((new Date() - agents[id].getMessageDate()) > 30000) {
                if ((new Date() - agents[id].getMessageDate()) > 60000) {
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
    } catch (err) { }

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

    a.href = URL.createObjectURL(new Blob([jsonData], { type: "text/plain" }));
    a.download = `agents_data_${getCurrentDate()}.json`;
    a.click();

    a.remove();
}

function refreshManuallyVisitors() {
    $("#visitors tr").remove();

    setTimeout(function () {
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
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        legend: { show: false },
        //tooltip: {enabled: false},
        grid: { show: false, xaxis: { lines: { show: false } }, yaxis: { lines: { show: false } } },
        xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false }, tooltip: { enabled: false } },
        yaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
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
    $("#mismatch_img").attr("id", "mismatch_img_" + index);
    $("#mismatch_percent").attr("id", "mismatch_percent_" + index);
    $("#mismatch_sun").attr("id", "mismatch_sun_" + index);
    $("#mismatch").attr("id", "mismatch_" + index);
    $("#mismatch_chart").attr("id", "mismatch_chart_" + index);
    $("#mismatch_header").attr("id", "mismatch_header_" + index);
    $("#mismatch_header_" + index).html(header);
    $("#mismatch_footer").attr("id", "mismatch_footer_" + index);
    $("#mismatch_footer_" + index).html(footer);
    $("#mismatch_date_footer").attr("id", "mismatch_date_footer_" + index);
    $("mismatch_fix_btn").attr("id", "mismatch_fix_btn_" + index);
    $("#mismatch_fix_btn_" + index).attr("onClick", "copyToClipboard('" + fixerId + "');");

    const mismatchChart = new ApexCharts($("#mismatch_chart_" + index).get(0), option);
    mismatchChart.render();

    mismatches[index] = mismatchChart;
    mismatches[index].option = option;
}

function appendOverloadBlock(overloadBoxElement, mismatchTemplateElement, header, index, overloadData) {
    overloadBoxElement.append(kendo.template(mismatchTemplateElement.html()));

    $("#overload_header").attr("id", "overload_header_" + index);
    $("#overload_header_" + index).html(header);
    $("#overload_chart").attr("id", "overload_chart_" + index);

    var options = getSummaryOption();
    options.series[0].data = overloadData;
    options.chart.height = 200;
    options.chart.offsetY = -40;
    options.fill.colors = [overloadChartBottomColor];
    options.fill.gradient.gradientToColors = [overloadChartTopColor];

    if (index === 0) {
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

    if (mismatchIndex > -1) {
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
            mismatches[mismatchIndex].updateSeries([{ data: mismatches[mismatchIndex].option.series[0].data }]);

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
            toolbar: { show: false },
            zoom: { enabled: false }
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
        stroke: { curve: 'smooth' },
        xaxis: {
            categories: getHourXAxisCategories(new Date().getHours()),
            position: "bottom",
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
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
        { data: agent.muc },
        { data: agent.other }
    ]);

    $("#mucCountHour").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountHour").html(addNewCollaboratorCount(agent.other));

    $("#hour_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getHourXAxisCategories(hour) {
    let hourCategories = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    for (let i = 23; i >= 0; i--) {
        hourCategories[i] = String(hour).padStart(2, "0");

        hour = hour - 1;

        if (hour < 0) {
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
            toolbar: { show: false },
            zoom: { enabled: false }
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
        stroke: { curve: 'smooth' },
        xaxis: {
            categories: getDayXAxisCategories(),
            position: "bottom",
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
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
        { data: agent.muc },
        { data: agent.other }
    ]);

    $("#mucCountDay").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountDay").html(addNewCollaboratorCount(agent.other));

    $("#day_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getDayXAxisCategories() {
    let dayCategories = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    for (let i = 0; i < 28; i++) {
        dayCategories[27 - i] = moment().subtract(i, "days").format("DD");
    }

    return dayCategories;
}

function getDayXAxisLabelColors() {
    let dayColors = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]


    for (let i = 0; i < 28; i++) {
        if (moment().subtract(i, "days").day() === 0 || moment().subtract(i, "days").day() === 6) {
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
            toolbar: { show: false },
            zoom: { enabled: false }
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
        stroke: { curve: 'smooth' },
        xaxis: {
            categories: getMonthXAxisCategories(),
            position: "bottom",
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
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
        { data: agent.muc },
        { data: agent.other }
    ]);

    $("#mucCountMonth").html(addNewCollaboratorCount(agent.muc));
    $("#otherCountMonth").html(addNewCollaboratorCount(agent.other));

    $("#month_datetime").html(getCurrentDateTime());
}
//----------------------------------------------------------------------------------------------------------------------
function getMonthXAxisCategories() {
    let monthCategories = ["", "", "", "", "", "", "", "", "", "", "", ""]

    for (let i = 0; i < 12; i++) {
        monthCategories[11 - i] = getMonthName(moment().subtract(i, "months"));
    }

    return monthCategories;
}
//----------------------------------------------------------------------------------------------------------------------
function getMonthName(datetime) {
    if (datetime.format("MM") === "01") {
        return "Янв " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "02") {
        return "Фев " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "03") {
        return "Мар " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "04") {
        return "Апр " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "05") {
        return "Май " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "06") {
        return "Июн " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "07") {
        return "Июл " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "08") {
        return "Авг " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "09") {
        return "Сен " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "10") {
        return "Окт " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "11") {
        return "Ноя " + datetime.format("YYYY");
    } else if (datetime.format("MM") === "12") {
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
    ping(0, "192.168.0.96", 80);
    ping(1, "192.168.0.97", 1433);
}

function updateMinMaxColor(element) {
    const weight = element.attr("weight");

    element.removeClass("network-green-color");
    element.removeClass("network-orange-color");
    element.removeClass("network-red-color");

    if (weight < 670) {
        element.addClass("network-green-color");
    } else if (weight >= 670 && weight < 1000) {
        element.addClass("network-orange-color");
    } else {
        element.addClass("network-red-color");
    }
}

function updateMinMax(minElement, maxElement, milliseconds) {
    if (milliseconds < parseInt(minElement.attr("weight"))) {
        minElement.attr("weight", milliseconds);
        minElement.html(milliseconds + " ms");
    }

    if (milliseconds > parseInt(maxElement.attr("weight"))) {
        maxElement.attr("weight", milliseconds);
        maxElement.html(milliseconds + " ms");
    }

    updateMinMaxColor(minElement);
    updateMinMaxColor(maxElement);
}

function checkOverloadValue(index, pingPointer) {
    if (pingPointer >= 11) {
        if (overloadData[index] <= 5) {
            overloadData[index] = overloadData[index] + 1;
        }

        if (overloadCount[index] < 6) {
            overloadCount[index] = overloadCount[index] + 1;
        }
    } else {
        if (overloadData[index] > 0) {
            overloadData[index] = overloadData[index] - 1;

            if (overloadData[index] === 0 && overloadCount[index] > 5) {
                overloadCount[index] = 0;

                // ADD TO OVERLOAD
                const currentDateTime = new Date();
                const currentTime = currentDateTime.toLocaleString("ru-RU").split(", ")[1];
                const currentHour = currentTime.split(":")[0];

                if (index === 0) {
                    webOverloadData[currentHour - 6] = webOverloadData[currentHour - 6] + 1;
                    webOverloadChart.updateSeries([{ data: webOverloadData }]);
                } else {
                    sqlOverloadData[currentHour - 6] = sqlOverloadData[currentHour - 6] + 1;
                    sqlOverloadChart.updateSeries([{ data: sqlOverloadData }]);
                }
            }

            if (overloadData[index] === 0) {
                overloadCount[index] = 0;
            }
        }
    }
}

function ping(id, host, port) {
    let milliseconds = 0;
    let started = new Date().getTime();

    let http = new XMLHttpRequest();

    http.open("GET", "http://" + host + ":" + port, true);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            let ended = new Date().getTime();

            milliseconds = ended - started;

            let pingPointer = Math.round(milliseconds / 100);

            if (pingPointer <= 2) {
                pingPointer = 2;
            } else if (pingPointer > 16) {
                pingPointer = 16;
            }

            if (id === 0) {
                updateMinMax($("#web_min"), $("#web_max"), milliseconds);

                webData.shift();
                webData.unshift(pingPointer);
                webData.pop();
                webData.unshift(20);

                webChart.updateSeries([{ data: webData }]);

                checkOverloadValue(0, pingPointer);
            } else if (id === 1) {
                updateMinMax($("#sql_min"), $("#sql_max"), milliseconds);

                sqlData.shift();
                sqlData.unshift(pingPointer);
                sqlData.pop();
                sqlData.unshift(20);

                sqlChart.updateSeries([{ data: sqlData }]);

                checkOverloadValue(1, pingPointer);
            }

        }
    };

    try {
        http.send(null);
    } catch (exception) { }
}

function openFullNetworkPage() {
    window.open("http://192.168.0.96/fcc-desktop/network.html", "_blank").focus();
}

function showCreatedCollsBy(type) {
    if (type === "HOURS") {
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
    } else if (type === "DAYS") {
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
    } else if (type === "MONTH") {
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

    if (pinButtonElement.html().toUpperCase() === "PIN") {
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

        if (!parentElement.hasClass("thread-active")) {
            parentElement.addClass("pinned-color");
        }
    } else {
        pinButtonElement.html("Pin");

        parentElement.removeClass("pinned");
        parentElement.css("z-index", 0);
        parentElement.css("cursor", "default");
        parentElement.attr("pin", 0);

        if (parentElement.hasClass("thread-inactive")) {
            parentElement.removeClass("pinned-color");
        }

        delete pinnedWindows[parentElement.attr("id")];
    }
}

function haveFocus(element) {
    const focusedElement = $("#" + element.getAttribute("id"));

    if (parseInt(focusedElement.attr("pin")) === 1) {
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

    $("#agent_svg0").html(leftSVG);
    $("#agent_svg1").html(leftSVG);
    $("#agent_svg2").html(leftSVG);
    $("#agent_svg3").html(leftSVG);

    getNextRunningAgents();
    setInterval(getNextRunningAgents, 15000);
});