"use strict";

var dossFckData = [0, 0], dossRckData = [0, 0], blEventData = [0, 0], blCollsData = [0, 0], suspiciousCollsData = [0, 0];
var dossInstructorsData = [0, 0], dossTrainerData = [0, 0], inProgramData = [0, 0], isFccData = [0, 0], isRckData = [0, 0];
var isRoivData = [0, 0], isPartnerData = [0, 0], isCommerceData = [0, 0];
var dossFckChart, dossRckChart, blEventChart, blCollsChart, suspiciousCollsChart, dossInstructorsChart, dossTrainersChart;
var inProgramChart, isFccChart, isRckChart, isRoivChart, isPartnerChart, isCommerceChart;

var webSocket = getWebSocket(window.WebSocket);

webSocket.onmessage = function(event) {
    receiveMessage(event.data);
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

function showMessage(message) {
    if(message.indexOf("#") > -1) {
        message = message.substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

        let task = JSON.parse(message, reviver);

        if (task.type === "MISMATCH") {
            let clientTask = createMismatchTask(task);
            let prevCount = 0;
            let percentElement;
            let percentValue;
            let prefix = "";

            let taskImageElement;

            switch (clientTask.getMismatchType()) {
                case "DOSS_FCK": {
                    taskImageElement = $("#doss_fck_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#doss_fck");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        dossFckData.push(clientTask.getCount());
                        dossFckChart.updateSeries([{data: dossFckData}]);

                        percentElement = $("#doss_fck_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#doss_fck_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "DOSS_RCK": {
                    taskImageElement = $("#doss_rck_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#doss_rck");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        dossRckData.push(clientTask.getCount());
                        dossRckChart.updateSeries([{data: dossRckData}]);

                        percentElement = $("#doss_rck_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#doss_rck_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "BL_EVENT": {
                    taskImageElement = $("#bl_event_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#bl_event");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        blEventData.push(clientTask.getCount());
                        blEventChart.updateSeries([{data: blEventData}]);

                        percentElement = $("#bl_event_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#bl_event_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "BL_COLLS": {
                    taskImageElement = $("#bl_colls_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#bl_colls");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        blCollsData.push(clientTask.getCount());
                        blCollsChart.updateSeries([{data: blCollsData}]);

                        percentElement = $("#bl_colls_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#bl_colls_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "SUSPICIOUS_COLLS": {
                    taskImageElement = $("#suspicious_colls_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#suspicious_colls");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        suspiciousCollsData.push(clientTask.getCount());
                        suspiciousCollsChart.updateSeries([{data: suspiciousCollsData}]);

                        percentElement = $("#suspicious_colls_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#suspicious_colls_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "DOSS_INSTRUCTOR": {
                    taskImageElement = $("#doss_instructors_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#doss_instructors");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        dossInstructorsData.push(clientTask.getCount());
                        dossInstructorsChart.updateSeries([{data: dossInstructorsData}]);

                        percentElement = $("#doss_instructors_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#doss_instructors_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "DOSS_TRAINER": {
                    taskImageElement = $("#doss_trainers_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#doss_trainers");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        dossTrainerData.push(clientTask.getCount());
                        dossTrainersChart.updateSeries([{data: dossTrainerData}]);

                        percentElement = $("#doss_trainers_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#doss_trainers_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IN_PROGRAM": {
                    taskImageElement = $("#in_program_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#in_program");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        inProgramData.push(clientTask.getCount());
                        inProgramChart.updateSeries([{data: inProgramData}]);

                        percentElement = $("#in_program_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#in_program_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IS_FCC": {
                    taskImageElement = $("#is_fcc_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#is_fcc");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        isFccData.push(clientTask.getCount());
                        isFccChart.updateSeries([{data: isFccData}]);

                        percentElement = $("#is_fcc_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#is_fcc_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IS_RCK": {
                    taskImageElement = $("#is_rck_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#is_rck");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        isRckData.push(clientTask.getCount());
                        isRckChart.updateSeries([{data: isRckData}]);

                        percentElement = $("#is_rck_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#is_rck_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IS_ROIV": {
                    taskImageElement = $("#is_roiv_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#is_roiv");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        isRoivData.push(clientTask.getCount());
                        isRoivChart.updateSeries([{data: isRoivData}]);

                        percentElement = $("#is_roiv_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#is_roiv_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IS_PARTNER": {
                    taskImageElement = $("#is_partner_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#is_partner");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        isPartnerData.push(clientTask.getCount());
                        isPartnerChart.updateSeries([{data: isPartnerData}]);

                        percentElement = $("#is_partner_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#is_partner_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

                case "IS_COMMERCE": {
                    taskImageElement = $("#is_commerce_sun");

                    if (parseInt(clientTask.getState()) === 0) {
                        taskImageElement.css("visibility", "visible");
                    } else {
                        taskImageElement.css("visibility", "hidden");

                        const taskElement = $("#is_commerce");
                        prevCount = parseInt(taskElement.html());

                        taskElement.attr("prev_count", prevCount);
                        taskElement.html(clientTask.getCount());

                        isCommerceData.push(clientTask.getCount());
                        isCommerceChart.updateSeries([{data: isCommerceData}]);

                        percentElement = $("#is_commerce_percent");
                        percentValue = clientTask.getCount() - prevCount;

                        percentElement.removeClass("up_box");
                        percentElement.removeClass("down_box");
                        percentElement.removeClass("nil_box");

                        const imageElement = $("#is_commerce_img");

                        if (percentValue < 0) {
                            percentElement.addClass("down_box");
                            imageElement.attr("src", "images/down.png");
                        } else if (percentValue > 0) {
                            prefix = "+";
                            percentElement.addClass("up_box");
                            imageElement.attr("src", "images/up.png");
                        } else {
                            percentElement.addClass("nil_box");
                            imageElement.attr("src", "images/blank.png");
                        }

                        percentElement.html(prefix + percentValue);
                    }

                    break;
                }

            }
        }
    } else {
        if (message === "pong") {
            console.log("Pong message");
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
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
    } catch (err) {}

    document.body.removeChild(textArea);

    alert("ID copied into clipboard!");
}

$(document).ready(function () {
    let options = {
        series: [{
            color: "#adff2f",
            name: "",
            data: [0, 0]
        }],
        chart: {
            width: 220,
            height: 80,
            type: "area",
            toolbar: {
                show: false
            }
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        legend: {show: false},
        tooltip: {enabled: false},
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

    dossFckChart = new ApexCharts($("#doss_fck_chart").get(0), options);
    dossFckChart.render();

    dossRckChart = new ApexCharts($("#doss_rck_chart").get(0), options);
    dossRckChart.render();

    blEventChart = new ApexCharts($("#bl_event_chart").get(0), options);
    blEventChart.render();

    blCollsChart = new ApexCharts($("#bl_colls_chart").get(0), options);
    blCollsChart.render();

    suspiciousCollsChart = new ApexCharts($("#suspicious_colls_chart").get(0), options);
    suspiciousCollsChart.render();

    dossInstructorsChart = new ApexCharts($("#doss_instructors_chart").get(0), options);
    dossInstructorsChart.render();

    dossTrainersChart = new ApexCharts($("#doss_trainers_chart").get(0), options);
    dossTrainersChart.render();

    inProgramChart = new ApexCharts($("#in_program_chart").get(0), options);
    inProgramChart.render();

    isFccChart = new ApexCharts($("#is_fcc_chart").get(0), options);
    isFccChart.render();

    isRckChart = new ApexCharts($("#is_rck_chart").get(0), options);
    isRckChart.render();

    isRoivChart = new ApexCharts($("#is_roiv_chart").get(0), options);
    isRoivChart.render();

    isPartnerChart = new ApexCharts($("#is_partner_chart").get(0), options);
    isPartnerChart.render();

    isCommerceChart = new ApexCharts($("#is_commerce_chart").get(0), options);
    isCommerceChart.render();
});