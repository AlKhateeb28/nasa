var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var weekList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
    "51", "52", "53"
];

var prevReportData = [];

var coursesPlan = 1500000;
var coursesChart;
var completedCount = 0;
var isInitialized = false;
var prevExpectedMilliseconds = 0;
var prevExpectedDate = new Date();

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function getCurrentYearNumber() {
    const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

    return currentDate.split(".")[2];
}

function getCurrentWeekNumber() {
    return getWeek(getCurrentDateTime());
}

function getFilledList(value) {
    return [
        value, value, value, value, value, value, value, value, value, value,
        value, value, value, value, value, value, value, value, value, value,
        value, value, value, value, value, value, value, value, value, value,
        value, value, value, value, value, value, value, value, value, value,
        value, value, value, value, value, value, value, value, value, value,
        value, value, value
    ];
}

function getCoursesChartOption() {
    return {
        series: [
            {
                name: "Назначено",
                color: "#ff9719",
                data: getFilledList(0)
            },
            {
                name: "Пройдено",
                color: "#89fc19",
                data: getFilledList(0)
            },
            {
                name: "Удаленные дубликаты",
                color: "#cd5c5c",
                data: getFilledList(0)
            },
        ],
        chart: {
            type: "line",//"line",
            width: 1300,
            height: 550,
            toolbar: {show: false},
            zoom: {enabled: false},
            fontFamily: "Rubic, sans-serif",
            events: {
                click: function(event, chartContext, opts) {
                    if(opts.dataPointIndex + 1 === 0) {
                        return;
                    }

                    refreshCurrentAssignedFlagsData(opts.dataPointIndex + 1);
                }
            }
        },
        stroke: {
            width: 4,
            curve: "smooth"
        },
        dataLabels: {
            enabled: true,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "9px",
                //fontWeight: "bold"
            },
            background: {
                enabled: true,
                foreColor: "#000000"
            }
        },
        grid: {
            show: false,
            xaxis: {lines: {show: false}},
            yaxis: {lines: {show: false}}
        },
        xaxis: {
            position: "bottom",
            categories: weekList,
            axisBorder: {show: true},
            axisTicks: {show: true},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: getFilledList("#f5f5f5")
                }
            }
        },
        yaxis: {
            axisTicks: {show: false},
            axisBorder: {show: false},
            labels: {show: false},
            lines: {show: false}
        },
        legend: {
            show: true,
            labels: {
                colors: "#f5f5f5ff"
            }
        },
        tooltip: {
            enabled: true,
            theme: "dark"
        }
    };
}

function getCoursesOfWeekList(list) {
    clearedWeekData = [];

    list.forEach((element, index) => {
        clearedWeekData.push(element.count);
    });

    return clearedWeekData;
}

function getWeekXAxisColors(currentWeekNumber, expectedWeekNumber, stateData){
    function getWeekColorByWeekCount(weekNumber, stateData) {
        prevCount = 0;
        for(let i = 0; i < prevReportData.length; i++) {
            if(weekNumber === parseInt(prevReportData[i].week)) {
                prevCount = prevReportData[i].count;
                break;
            }
        }

        stateDataCount = 0;
        for(let i = 0; i < stateData.length; i++) {
            if(weekNumber === parseInt(stateData[i].week)) {
                stateDataCount = stateData[i].count;
                break;
            }
        }

        return {
            prevWeekCount: parseInt(prevCount),
            currentWeekCount: parseInt(stateDataCount)
        };
    }

    let colors = [];

    weekList.forEach((weekNumber, index) => {
        weekNumber = parseInt(weekNumber);

        const counts = getWeekColorByWeekCount(weekNumber, stateData);

        if(weekNumber === expectedWeekNumber) {
            if(counts.prevWeekCount === counts.currentWeekCount) {
                colors.push("#a1b8fc");
            } else if(counts.prevWeekCount < counts.currentWeekCount) {
                colors.push("#adff2f");
            } else {
                colors.push("#cd5c5c");
            }
        } else {
            if(weekNumber === currentWeekNumber) {
                if(counts.prevWeekCount === counts.currentWeekCount) {
                    colors.push("#ffc107");
                } else if(counts.prevWeekCount < counts.currentWeekCount) {
                    colors.push("#adff2f");
                } else {
                    colors.push("#cd5c5c");
                }
            } else {
                if(counts.prevWeekCount === counts.currentWeekCount) {
                    colors.push("#f5f5f5ff");
                } else if(counts.prevWeekCount < counts.currentWeekCount) {
                    colors.push("#adff2f");
                } else {
                    colors.push("#cd5c5c");
                }
            }
        }
    });

    return colors;
}

function calculateCatchUpTime(yesterdayTotal, todaySoFar, currentTime) {
    const remaining = yesterdayTotal - todaySoFar;

    if (remaining <= 0) {
        return {
            type: 2,
            time: new Date(prevExpectedDate)
        };
    }

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const elapsedHours = currentHour + currentMinute / 60;

    const speed = todaySoFar / elapsedHours;

    const hoursNeeded = remaining / speed;

    const totalHours = elapsedHours + hoursNeeded;

    if (totalHours < 24) {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const today = new Date(currentTime);
        today.setHours(hours, minutes, 0, 0);

        prevExpectedDate = today;

        return {
            type: 0, // today
            time: today.toLocaleString("ru-RU"),
            ms: today.getTime()
        };
    } else {
        const tomorrow = new Date(currentTime);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const overflowHours = totalHours - 24;
        const hours = Math.floor(overflowHours);
        const minutes = Math.round((overflowHours - hours) * 60);
        tomorrow.setHours(hours, minutes, 0, 0);

        prevExpectedDate = tomorrow;

        return {
            type: 1, // tomorrow
            time: tomorrow.toLocaleString("ru-RU"),
            ms: tomorrow.getTime()
        };
    }
}

function getNormalizedDateTime(timeAsString) {
    return timeAsString.split(", ")[0] + " " + timeAsString.split(", ")[1].split(":")[0] + ":" + timeAsString.split(", ")[1].split(":")[1];
}

function getNormalizedTime(timeAsString) {
    return timeAsString.split(", ")[1].split(":")[0] + ":" + timeAsString.split(", ")[1].split(":")[1];
}

function refreshBoardData() {
    $("#chart_wait").css("display", "block");

    const currentDateTime = getCurrentDateTime();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7208564163180227555&date=" + currentDateTime,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                const prevCompletedValue = completedCount;

                completedCount = parseInt(data.completedCount);
                $("#courses_completed").html(completedCount.toLocaleString());

                const courseLeftElement = $("#courses_left");
                leftValue = completedCount - coursesPlan;
                let leftPrefix = "";

                if(leftValue === 0) {
                    courseLeftElement.css("color", "var(--color-whitesmoke)");
                } else if(leftValue > 0) {
                    leftPrefix = "+";
                    courseLeftElement.css("color", "var(--color-course-plus)");
                } else {
                    courseLeftElement.css("color", "var(--color-course-minus)");
                }

                courseLeftElement.html(leftPrefix + leftValue.toLocaleString());

                const doneCount = completedCount * 100 / coursesPlan;
                $("#courses_done").html(doneCount.toFixed(2).toLocaleString() + "%");

                if(isInitialized) {
                    const increaseCountElement = $("#increase_count");

                    const increasedValue = completedCount - prevCompletedValue;

                    if (increasedValue === 0) {
                        increaseCountElement.html(increasedValue);
                    } else if (increasedValue > 0) {
                        increaseCountElement.html("+" + increasedValue);
                    } else {
                        increaseCountElement.html(increasedValue);
                    }
                }

                weekData = calculateExpectedWeekNumber(data, currentDateTime);

                // MOMENT. GET WEEK WHEN IT STARTS FROM MONDAY
                let leaveWeek= 0;

                if(parseInt(weekData.currentYear) === parseInt(weekData.expectedYear)) {
                    leaveWeek = weekData.expectedWeek - weekData.currentWeek;
                } else {
                    leaveWeek = 53 - weekData.currentWeek + weekData.expectedWeek;
                }

                if(leaveWeek > 0) {
                    leaveWeek = "+" + leaveWeek;
                }

                $("#expected_week").html(weekData.expectedWeek + " / " + weekData.expectedYear + " (" + leaveWeek + ")");
                $("#expected_start").html(weekData.expected);
                //$("#expected_finish").html(weekDays.endStr);

                coursesChart.updateOptions({
                    xaxis: {
                        labels: {
                            style: {
                                colors: getWeekXAxisColors(weekData.currentWeek, weekData.expectedWeek, data.state4Data)
                            }
                        }
                    }
                });

                prevReportData = [];
                data.state4Data.forEach((weekState, index) => {
                    element = {};
                    element.week = weekState.week;
                    element.count = weekState.count;

                    prevReportData.push(element);
                });

                coursesChart.updateSeries([
                    {data: getCoursesOfWeekList(data.state0Data)},
                    {data: getCoursesOfWeekList(data.state4Data)},
                    {data: getCoursesOfWeekList(data.stateDelDupData)},
                ]);

                //$(".apexcharts-series").addClass("courses_shadow");

                const result = calculateCatchUpTime(data.yesterdayCount, data.todayCount, new Date());

                const expectedTimeElement = $("#courses_expected_time");

                let time;

                if(result.type === 0) {
                    time = getNormalizedTime(result.time.toLocaleString("ru-RU"));
                } else if(result.type === 2) {
                    time = "--:--"
                } else {
                    time  = getNormalizedDateTime(result.time.toLocaleString("ru-RU"));
                }

                if(prevExpectedMilliseconds === result.ms) {
                    expectedTimeElement.css("color", "var(--color-course-passed)");
                } else if(result.ms < prevExpectedMilliseconds) {
                    expectedTimeElement.css("color", "var(--color-course-plus)");
                } else {
                    expectedTimeElement.css("color", "var(--color-course-minus)");
                }
                expectedTimeElement.html(time);

                prevExpectedMilliseconds = result.ms;

                const todayCountElement = $("#courses_today_count");
                const todayLeaveElement = $("#courses_today_leave");
                let todayLeavePrefix = "";

                if(data.todayCount === data.yesterdayCount) {
                    todayCountElement.css("color", "var(--color-course-plus)");
                } else if(data.todayCount > data.yesterdayCount) {
                    todayCountElement.css("color", "var(--color-course-plus)");
                    todayLeavePrefix = "+";
                } else {
                    todayCountElement.css("color", "var(--color-course-minus)")
                }
                todayCountElement.html(data.todayCount);
                todayLeaveElement.html(todayLeavePrefix + (data.todayCount - data.yesterdayCount));

                $("#today_reached_time").html(data.yesterdayReachedTime.split(":")[0].padStart(2, "0") + ":" + data.yesterdayReachedTime.split(":")[1].padStart(2, "0"));

                $("#courses_before_yesterday_count").html(data.beforeYesterdayCount);
                $("#courses_yesterday_count").html(data.yesterdayCount);
                $("#yesterday_reached_time").html(data.beforeYesterdayReachedTime.split(":")[0].padStart(2, "0") + ":" + data.beforeYesterdayReachedTime.split(":")[1].padStart(2, "0"));

                isInitialized = true;

                $("#chart_wait").css("display", "none");

                $("#refreshed_datetime").html("обновлено: " + getCurrentDateTime());
            } else {
                isInitialized = true;

                $("#chart_wait").css("display", "none");

                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

function getFlagValue(value, weekTotal) {
    return (parseInt(value) * 100 / weekTotal).toFixed(2);
}

function refreshValueAndBottomElements(elementId, flag, total, value) {
    const rckElement = $("#" + elementId + "_value_" + flag);
    if(total === 0) {
        rckElement.html("0%");
    } else {
        rckElement.html( getFlagValue(value, total) + "%");
    }
    $("#" + elementId + "_bottom_" + flag).html(value.toLocaleString());
}

function refreshCurrentAssignedFlagsData(week) {
    $("#owner_wait").css("display", "block");

    if(week === undefined) {
        week = getCurrentWeekNumber();
    }

    const ownerWeekElement = $("#owner_week");
    ownerWeekElement.html("--");
    ownerWeekElement.css("color", "whitesmoke");
    
    $("#courses_assign_value_rck").html("--");
    $("#courses_assign_value_ock").html("--");
    $("#courses_assign_value_fck").html("--");
    $("#courses_assign_value_roiv").html("--");
    $("#courses_assign_value_partner").html("--");
    $("#courses_assign_value_commerce").html("--");
    $("#courses_assign_value_with_no_right").html("--");
    $("#courses_assign_bottom_rck").html("--");
    $("#courses_assign_bottom_ock").html("--");
    $("#courses_assign_bottom_fck").html("--");
    $("#courses_assign_bottom_roiv").html("--");
    $("#courses_assign_bottom_partner").html("--");
    $("#courses_assign_bottom_commerce").html("--");
    $("#courses_assign_bottom_with_no_right").html("--");

    $("#courses_pass_value_rck").html("--");
    $("#courses_pass_value_ock").html("--");
    $("#courses_pass_value_fck").html("--");
    $("#courses_pass_value_roiv").html("--");
    $("#courses_pass_value_partner").html("--");
    $("#courses_pass_value_commerce").html("--");
    $("#courses_pass_value_with_no_right").html("--");
    $("#courses_pass_bottom_rck").html("--");
    $("#courses_pass_bottom_ock").html("--");
    $("#courses_pass_bottom_fck").html("--");
    $("#courses_pass_bottom_roiv").html("--");
    $("#courses_pass_bottom_partner").html("--");
    $("#courses_pass_bottom_commerce").html("--");
    $("#courses_pass_bottom_with_no_right").html("--");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7226648571481683640&year=" + getCurrentYearNumber() + "&week="+ week,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                const ownerWeekElement = $("#owner_week");
                ownerWeekElement.html(week);

                if(parseInt(week) === parseInt(getCurrentWeekNumber())) {
                    ownerWeekElement.css("color", "#ffc107");
                } else {
                    ownerWeekElement.css("color", "var(--color-course-passed)");
                }

                refreshValueAndBottomElements("courses_assign", "rck", data.weekTotal, data.rck);
                refreshValueAndBottomElements("courses_assign", "ock", data.weekTotal, data.ock);
                refreshValueAndBottomElements("courses_assign", "fck", data.weekTotal, data.fck);
                refreshValueAndBottomElements("courses_assign", "roiv", data.weekTotal, data.roiv);
                refreshValueAndBottomElements("courses_assign", "partner", data.weekTotal, data.partner);
                refreshValueAndBottomElements("courses_assign", "commerce", data.weekTotal, data.commerce);
                refreshValueAndBottomElements("courses_assign", "with_no_right", data.weekTotal, data.withNoRight);

                refreshValueAndBottomElements("courses_pass", "rck", data.passWeekTotal, data.passRck);
                refreshValueAndBottomElements("courses_pass", "ock", data.passWeekTotal, data.passOck);
                refreshValueAndBottomElements("courses_pass", "fck", data.passWeekTotal, data.passFck);
                refreshValueAndBottomElements("courses_pass", "roiv", data.passWeekTotal, data.passRoiv);
                refreshValueAndBottomElements("courses_pass", "partner", data.passWeekTotal, data.passPartner);
                refreshValueAndBottomElements("courses_pass", "commerce", data.passWeekTotal, data.passCommerce);
                refreshValueAndBottomElements("courses_pass", "with_no_right", data.passWeekTotal, data.passWithNoRight);

            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }

            $("#owner_wait").css("display", "none");
        },
        error: function() {
            $("#owner_wait").css("display", "none");

            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
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

function calculateExpectedWeekNumber(data, currentDateAsString) {
    const prevYearCount = parseInt(data.prevYearCount);
    const leaveCount = coursesPlan - prevYearCount;
    const planCount = Math.ceil(leaveCount / 365);

    let passed = 0;

    let leaveDays = {};
    leaveDays.days = 0;
    leaveDays.time = "";

    test = [];
    let element = {count: 206079};
    test.push(element);

    let leave = 0;
    let expected = "31.12." + getCurrentYearNumber() + " 23:59:59";

    //data.state4ByDayData.forEach((element, index) => {
    let isFinishProcess = false;

    for(let i = 0; i < data.state4ByDayData.length; i++) {
        passed += data.state4ByDayData[i].count;

        leave = (leaveCount - passed) / planCount;

        if (moment(currentDateAsString, "DD.MM.YYYY").format("DD.MM.YYYY") === moment(expected, "DD.MM.YYYY").format("DD.MM.YYYY")) {
            expected = data.state4ByDayData[i].day + "." + data.state4ByDayData[i].month + "." + data.state4ByDayData[i].year;

            isFinishProcess = true;
        } else {
            expected = moment(currentDateAsString, "DD.MM.YYYY").add(Math.floor(leave), 'days').format("DD.MM.YYYY");
        }

        if(isFinishProcess) {
            break;
        }
    }

    return {
        currentWeek: getWeek(currentDateAsString),
        currentYear: currentDateAsString.split(" ")[0].split(".")[2],
        expected: expected,
        expectedWeek: moment(expected, "DD.MM.YYYY").isoWeekday(1).startOf('week').week(),
        expectedYear: expected.split(".")[2],
        passed: passed,
        leave: leave
    };
}

function getWeek(dateAsString) {
    return moment(dateAsString, "DD.MM.YYYY").isoWeekday(1).startOf('week').week();
}

function appendOwnerChild(parentId, id, name) {
    $("#" + parentId).append(getTemplate("owner_template"));
    $("#owner_caption").attr("id", parentId + "_caption_" + id);
    $("#" + parentId + "_caption_" + id).html(name);

    $("#owner_value").attr("id", parentId + "_value_" + id);

    const valueElement = $("#" + parentId + "_value_" + id);
    valueElement.html("--");
    valueElement.attr("data-prev-val", "0");

    $("#owner_bottom").attr("id", parentId + "_bottom_" + id);
    $("#" + parentId + "_bottom_" + id).html("--");
}

function initialize() {
    $("#courses_expected_time").html(getNormalizedTime(new Date().toLocaleString("ru-RU")));

    coursesChart = new ApexCharts($("#courses_chart").get(0), getCoursesChartOption());
    coursesChart.render();

    refreshBoardData();
    refreshCurrentAssignedFlagsData();
}

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

$(document).ready(function () {
    initialize();

    setInterval(refreshBoardData, 15000);
});
