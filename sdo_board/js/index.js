let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

let weekList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
    "51", "52", "53"
];

let coursesPlan = 1120000;
let coursesChart;
let completedCount = 0;
let isInitialized = false;
let prevExpectedMilliseconds = 0;
let prevExpectedDate = new Date();

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function getCurrentYearNumber() {
    const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

    return currentDate.split(".")[2];
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
                name: "Пройденые",
                color: "#2a60fc",
                data: getFilledList(0)
            },
            {
                name: "",
                color: "#141414",
                data: getFilledList(0)
            }
        ],
        chart: {
            type: "line",
            width: 1190,
            height: 550,
            toolbar: {show: false},
            zoom: {enabled: false},
            fontFamily: "Rubic, sans-serif",
            events: {
                click: function (event, chartContext, opts) {

                }
            }
        },
        stroke: {
            width: 4,
            curve: "smooth"
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontWeight: "bold"
            },
            background: {
                enabled: true,
                foreColor: "#f5f5f5ff"
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
                    colors: getFilledList("#f5f5f5ff")
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
            show: false,
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

    /*for(let i = 0; i < 53; i++) {
        clearedWeekData.push(0);
    }*/

    list.forEach((element, index) => {
        clearedWeekData[element.week - 1] = element.count;
    });

    return clearedWeekData;
}

function calculateExpectedWeekNumber(data) {
    const prevYearCount = parseInt(data.prevYearCount);
    const leaveCount = coursesPlan - prevYearCount;

    let currentWeek = 0;
    let passedCount = 0;

    data.state4Data.forEach((element, index) => {
        currentWeek = element.week;
        passedCount += element.count;
    })

    const r = leaveCount - passedCount;
    const v = passedCount / currentWeek;
    const t = r / v;

    return {
        current: currentWeek,
        expected: currentWeek + t,
        expectedStr: (currentWeek + t).toFixed(2)
    };
}

function getWeekDates(year, weekNumber, expectedSuffix) {
    function getWholeFromFractionalPart(value, fractional) {
        value = (value - Math.trunc(value)) * 100;

        return  value * fractional / 100;
    }

    const firstDay = new Date(year, 0, 1);
    const daysToMonday = (1 - firstDay.getDay() + 7) % 7;
    const firstMonday = new Date(firstDay);

    firstMonday.setDate(firstDay.getDate() + daysToMonday);

    let startDate = new Date(firstMonday);
    //startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    startDate.setDate(firstMonday.getDate() + (weekNumber - 2) * 7);

    const endDate = new Date(startDate);
    const expectedFloatDay = expectedSuffix * 7;

    startDate.setDate(startDate.getDate() + Math.floor(expectedFloatDay) - 1 );
    endDate.setDate(endDate.getDate() + Math.ceil(expectedFloatDay) - 1);

    hours = getWholeFromFractionalPart(expectedFloatDay, 24);
    minutes = getWholeFromFractionalPart(hours, 60);

    return {
        start: startDate,
        end: endDate,
        startStr: startDate.toLocaleString("ru-RU").split('T')[0].split(",")[0],
        endStr: endDate.toLocaleString("ru-RU").split('T')[0].split(",")[0],
        hours: Math.floor(hours).toString().padStart(2, "0"),
        minutes: Math.ceil(minutes).toString().padStart(2, "0"),
    };
}

function getWeekXAxisColors(currentWeekNumber, expectedWeekNumber){
    let colors = [];

    weekList.forEach((weekNumber, index) => {
        weekNumber = parseInt(weekNumber);

        if(weekNumber === expectedWeekNumber) {
            colors.push("#a1b8fc");
        } else {
            if(weekNumber === currentWeekNumber) {
                colors.push("#adff2f");
            } else {
                colors.push("#f5f5f5ff");
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
    $("#wait").css("visibility", "visible");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7208564163180227555&year=" + getCurrentYearNumber(),
        async: false,
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
                        increaseCountElement.html("-" + increasedValue);
                    }
                }

                weekData = calculateExpectedWeekNumber(data);

                let expectedWeekNumber = weekData.expectedStr;

                expectedWeekNumberSuffix = expectedWeekNumber;
                if(expectedWeekNumberSuffix.indexOf(".") > -1) {
                    expectedWeekNumberSuffix = parseFloat("0." + expectedWeekNumberSuffix.split(".")[1]);
                }

                expectedWeekNumber = Math.floor(weekData.expected);

                const weekDays = getWeekDates(getCurrentYearNumber(), expectedWeekNumber, expectedWeekNumberSuffix);

                // MOMENT. GET WEEK WHEN IT STARTS FROM MONDAY
                let leaveWeek = moment(weekDays.startStr, "DD.MM.YYYY").isoWeekday(1).startOf('week').week() - expectedWeekNumber;

                if(leaveWeek > 0) {
                    leaveWeek = "+" + leaveWeek;
                }

                $("#expected_week").html(expectedWeekNumber + " (" + leaveWeek + ")");
                $("#expected_start").html(weekDays.startStr + " " + weekDays.hours + ":" + weekDays.minutes);
                //$("#expected_finish").html(weekDays.endStr);

                coursesChart.updateOptions({
                    xaxis: {
                        labels: {
                            style: {
                                colors: getWeekXAxisColors(weekData.current, expectedWeekNumber)
                            }
                        }
                    }
                });

                coursesChart.updateSeries([
                    {
                        name: "Пройденые",
                        color: "#2a60fc",
                        data: getCoursesOfWeekList(data.state4Data)
                    },
                    {
                        name: "",
                        color: "#141414",
                        data: getFilledList(0)
                    }
                ]);

                //$(".apexcharts-series").addClass("courses_shadow");

                const result = calculateCatchUpTime(data.yesterdayCount, data.todayCount, new Date());

                const expectedTimeElement = $("#courses_expected_time");

                let time = "";

                if(result.type === 0) {
                    time = getNormalizedTime(result.time.toLocaleString("ru-RU"));
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
                todayLeaveElement.html(todayLeavePrefix + (data.todayCount - data.yesterdayCount) );

                $("#courses_yesterday_count").html(data.yesterdayCount);

                if(data.todayCount - data.yesterdayCount)
                courses_today_leave

                isInitialized = true;

                $("#wait").css("visibility", "hidden");

                $("#refreshed_datetime").html("обновлено: " + getCurrentDateTime());
            } else {
                isInitialized = true;

                $("#wait").css("visibility", "hidden");

                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
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

function initialize() {
    $("#courses_expected_time").html(getNormalizedTime(new Date().toLocaleString("ru-RU")));

    sleep(100).then(() => {
        refreshBoardData();
    });

    coursesChart = new ApexCharts($("#courses_chart").get(0), getCoursesChartOption());
    coursesChart.render();
}

$(document).ready(function () {
    initialize();

    setInterval(refreshBoardData, 15000);
});