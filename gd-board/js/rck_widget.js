function getPage1RckContent() {
    return `<div>
        <div class="float-left-box">
            <div class="card card-medium card-red">               
                <div class="group_header">Под региональным управлением (с РЦК)</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">всего обучено</div>
                    <div id="rck_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="rck_top5" style="margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="rck_top5_template">
                            <tr>
                                <td id="rck_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="rck_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="rck_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="rckRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="rck_box" class="float-left-box">
            <div class="card card-big card-red">
                <div id="rck_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="rck_regions" class="total">
                        <option selected="selected">Итого</option>
                    </select>
                </div>
                <div id="rck_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="rck_year1" class="float-left-box year-align"></div>
                        <div id="rck_value1" class="value-align">0</div>
                        <div id="rck_value_diff1" class="value-diff diff-title"></div>
                        <div id="rck_img_box1" class="float-left-box up-box">
                            <img id="rck_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal1" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="rck_year2" class="float-left-box year-align"></div>
                        <div id="rck_value2" class="value-align">0</div>
                        <div id="rck_value_diff2" class="value-diff diff-title"></div>
                        <div id="rck_img_box2" class="float-left-box up-box">
                            <img id="rck_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal2" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="rck_year3" class="float-left-box year-align"></div>
                        <div id="rck_value3" class="value-align">0</div>
                        <div id="rck_value_diff3" class="value-diff diff-title"></div>
                        <div id="rck_img_box3" class="float-left-box up-box">
                            <img id="rck_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal3" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="rck_year4" class="float-left-box year-align"></div>
                        <div id="rck_value4" class="value-align">0</div>
                        <div id="rck_value_diff4" class="value-diff diff-title"></div>
                        <div id="rck_img_box4" class="float-left-box up-box">
                            <img id="rck_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal4" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="rck_year5" class="float-left-box year-align"></div>
                        <div id="rck_value5" class="value-align">0</div>
                        <div id="rck_value_diff5" class="value-diff diff-title"></div>
                        <div id="rck_img_box5" class="float-left-box up-box">
                            <img id="rck_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal5" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="rck_year6" class="float-left-box year-align"></div>
                        <div id="rck_value6" class="value-align">0</div>
                        <div id="rck_value_diff6" class="value-diff diff-title"></div>
                        <div id="rck_img_box6" class="float-left-box up-box">
                            <img id="rck_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal6" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="rck_year7" class="float-left-box year-align"></div>
                        <div id="rck_value7" class="value-align">0</div>
                        <div id="rck_value_diff7" class="value-diff diff-title"></div>
                        <div id="rck_img_box7" class="float-left-box up-box">
                            <img id="rck_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal7" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="rck_year8" class="float-left-box year-align"></div>
                        <div id="rck_value8" class="value-align">0</div>
                        <div id="rck_value_diff8" class="value-diff diff-title"></div>
                        <div id="rck_img_box8" class="float-left-box up-box">
                            <img id="rck_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal8" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="rck_year9" class="float-left-box year-align"></div>
                        <div id="rck_value9" class="value-align">0</div>
                        <div id="rck_value_diff9" class="value-diff diff-title"></div>
                        <div id="rck_img_box9" class="float-left-box up-box">
                            <img id="rck_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal9" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="rck_year10" class="float-left-box year-align"></div>
                        <div id="rck_value10" class="value-align">0</div>
                        <div id="rck_value_diff10" class="value-diff diff-title"></div>
                        <div id="rck_img_box10" class="float-left-box up-box">
                            <img id="rck_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal10" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="rck_year11" class="float-left-box year-align"></div>
                        <div id="rck_value11" class="value-align">0</div>
                        <div id="rck_value_diff11" class="value-diff diff-title"></div>
                        <div id="rck_img_box11" class="float-left-box up-box">
                            <img id="rck_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal11" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="rck_year12" class="float-left-box year-align"></div>
                        <div id="rck_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="rck_value_diff12" class="value-diff diff-title"></div>
                        <div  id="rck_img_box12" class="float-left-box up-box">
                            <img id="rck_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                        <div id="rck_value_goal12" class="value-diff diff-title" style="margin-left: 75px; padding-top: 2px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var rckChart;

const modeName = "Итого";
var rckData = [];
var rckRegionGoals = [];
var rckYears = [];
var rckRegions = [];
var rckYear;
var rckMode = modeName;
var rckStartYear = 2018;
var rckAdmin = 0;
var rckError;

const rckWidgetColor = "#ff0080";

function addRckBox() {
    const options = getPage1ChartOption();

    rckChart = new ApexCharts($("#rck_chart").get(0), options);
    rckChart.render();

    rckChart.updateSeries([{
        color: rckWidgetColor,
        data: getRckInitialData(getCurrentYear())
    }]);

    rckChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onRckChartClick(opts);
                }
            }
        },
        xaxis: {
            categories: getRckXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getRckXAxisColors(getCurrentYear())
                }
            }
        }
    });

    rckRefresh();
}

function normalizeRckData() {
    for(let i = 0; i < rckData.length; i++) {
        rckData[i].name = rckData[i].name.trim().replace("город федерального значения ", "");
    }
}

function getCurrentGoal() {
    for(let i = 0; i < rckRegionGoals.length; i++) {
        if (rckRegionGoals[i].name.replaceAll(" ", "").toUpperCase() === rckMode.replaceAll(" ", "").toUpperCase()) {
            return rckRegionGoals[i].goal;
        }
    }

    return 0;
}

function updateRckChartSeries(resultList) {
    let goal = getCurrentGoal();

    let goalData = [];

    rckYears.forEach((element, index) => {
        if(rckYear === getLastShowedYear()) {
            goalData.push(goal)
        } else {
            goalData.push(0);
        }
    });

    series = [
        {
            name: "ФЦК",
            color: rckWidgetColor,
            data: resultList
        }
    ];

    rckChart.updateSeries(series);
}

function updateRckChartOptions(isChangeYearColor) {
    if(isChangeYearColor) {
        colors = [];

        rckYears.forEach((element, index) => {
            if (element === rckYear) {
                colors.push(rckWidgetColor);
            } else {
                colors.push("black");
            }
        });

        rckChart.updateOptions({
            xaxis: {
                categories: rckYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function processRck(isChangeYearColor) {
    rckYears = [];

    let result = [];

    clearRckMonthBoxesByName();

    rckStartYear = getYearFromDatetime(rckData[0].start_datetime);
    rckAdmin = rckData[0].is_admin;

    for(let i = 0; i < rckData.length; i++) {

        if (parseInt(rckData[i].is_admin) == 1  ||  rckData[i].mode.indexOf(rckMode) > 0) {
            if (i < rckData.length - 1) {
                rckRegions.push(rckData[i].name);
            }

            if (rckData[i].name === rckMode) {
                rckData[i].elements.forEach((element, index) => {
                    // Generate char data
                    if (getMonthFromDatetime(element.datetime) === 12) {
                        result.push(element.value);
                        rckYears.push(getYearFromDatetime(element.datetime));
                    }

                    if (index === rckData[i].elements.length - 1 && getMonthFromDatetime(element.datetime) !== 12) {
                        result.push(element.value);
                        rckYears.push(getYearFromDatetime(element.datetime));
                    }

                    $("#rck_count").html(element.value);
                });

                fillRckMonthBoxesByName(rckData[i].elements, rckYear);
            }
        }
    }

    updateRckChartSeries(result);
    updateRckChartOptions(isChangeYearColor);
}

function onRckChartClick(opts) {
    let colors = [];

    rckYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(rckWidgetColor);

            rckYear = element;
        } else {
            colors.push("black");
        }
    });

    rckChart.updateOptions({
        xaxis: {
            categories: rckYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processRck(false);
}

function getRckInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= rckStartYear; i--) {
        values.unshift(0);
    }

    return values;
}

function getRckXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= rckStartYear; i--) {
        if(i === currentYear) {
            colors.push(rckWidgetColor);
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getRckXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= rckStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearRckMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#rck_value" + i).html(0);
        $("#rck_value_diff" + i).html("");
    };
}

function getGoalColor(goalValue) {
    if(getCurrentGoal() > goalValue) {
        return "#ff0080";
    } else {
        return "green";
    }
}

function fillRckMonthBoxesByName(elements, year) {
    let prevValue = 0;
    let prevGoalValue = getCurrentGoal();
    let currentGoalValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === rckYear) {
            // FILL DIFF BY VALUE
            const month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#rck_value_diff" + month);

            if(elementValue > prevValue) {
                $("#rck_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#rck_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#rck_img_box" + month).css("visibility", "hidden");
                    $("#rck_value_diff" + month).html("");
                } else {
                    $("#rck_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", rckWidgetColor);

                    $("#rck_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#rck_value" + month).html(element.value);

            //FILL PLAN IN LAST SHOWN YEAR
            const diffGoalElement = $("#rck_value_goal" + month);

            if(rckMode === modeName) {
                /*let diffValue;

                if(diffElement.html() === "") {
                    diffValue = 0;
                } else {
                    diffValue = parseInt(diffElement.html());
                }

                currentGoalValue = prevGoalValue - diffValue;

                if(prevGoalValue - diffValue > 0) {
                    diffGoalElement.html(prevGoalValue - diffValue);
                    diffGoalElement.css("color", getGoalColor(currentGoalValue));
                } else {
                    if(prevGoalValue - diffValue === 0) {
                        diffGoalElement.html("0");
                        diffGoalElement.css("color", "green");
                    } else {
                        diffGoalElement.html(Math.abs(prevGoalValue - diffValue));
                        diffGoalElement.css("color", "green");
                    }
                }*/

                //console.log("Month: " + month + " Diff.Value:" + diffElement.html() + " Goal: " + getCurrentGoal());
            } else {
                diffGoalElement.html("");
            }
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#rck_year" + i).html(currentYear);

        if(parseInt($("#rck_value" + i).html()) === 0) {
            $("#rck_img_box" + i).css("visibility", "hidden");
            $("#rck_value_diff" + i).html("");
        }
    }
}

function getRckTopFive() {
    let results = [];

    for (let i = 0; i < rckData.length - 1; i++) {
        const element = {}

        element.name = rckData[i].name;
        element.value = rckData[i].elements[rckData[i].elements.length - 1].value;
        element.checked = false;

        results.push(element);
    }

    let top5List = [];

    for (let i = 1; i <= 5; i++) {
        let maxValue = 0;
        let maxIndex = 0;
        let regionName = "";
        let regionValue = 0;

        results.forEach((element, index) => {
            if (!element.checked && element.value > maxValue) {
                regionName = element.name;
                regionValue = element.value;
                maxIndex = index;

                maxValue = element.value;
            }
        });

        result = {};
        result.name = regionName;
        result.value = regionValue;

        top5List.push(result);

        results[maxIndex].checked = true
    }

    const rckTop5Element = $("#rck_top5");

    rckTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#rck_top5").append(kendo.template($("#rck_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#rck_top_name").attr("id", "rck_top_name_" + index + 1);
        $("#rck_top_name_" + index + 1).html(region_name);
        $("#rck_top_value").attr("id", "rck_top_value_" + index + 1);
        $("#rck_top_value_" + index + 1).html(top5element.value);
    });

    rckTop5Element.css("visibility", "visible");
}

function getLastShowedYear() {
    return getYearFromDatetime(rckData[rckData.length - 1].elements[rckData[rckData.length - 1].elements.length - 1].datetime);
}

function rckRefresh() {
    $("#rck_refresh").css("visibility", "hidden");
    $("#rck_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7424484892990776274",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                $("#rck_regions .reg").remove();

                rckData = data.list;
                rckRegionGoals = data.regionGoals;

                rckYear = getLastShowedYear();

                if(rckData[0].is_admin) {
                    rckMode = modeName;
                } else {
                    rckMode = rckData[0].mode.replace("г. ", "");
                }

                normalizeRckData();
                processRck(true);

                if (rckData.length > 0) {
                    $("#rck_count").html(rckData[rckData.length - 1].elements[rckData[rckData.length - 1].elements.length - 1].value);
                } else {
                    $("#rck_count").html(0);
                }

                rckRegions.forEach((name, index) => {
                    if(rckAdmin === 1 || name.toUpperCase().indexOf(rckMode.toUpperCase()) >= 0) {
                        $("#rck_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getRckTopFive();

                $("#rck_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function(error) {
            rckError = error;

            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

$(document).ready(function () {
    $("#page1").append(getPage1RckContent());

    for(let i = 1; i <= 12; i++) {
        $("#rck_year" + i).html(rckYear);
    }

    $("#rck_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            rckMode = ui.item.value;

            processRck(false);
        }
    });

    addRckBox();
});