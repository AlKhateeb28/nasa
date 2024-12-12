function getPage1FccContent() {
    return `<div style="margin-top: 100px;">
        <div class="float-left-box" >
            <div class="card card-medium card-blue">               
                <div class="group_header">Под федеральным управлением (с ФЦК)</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">всего обучено</div>
                    <div id="fcc_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="fcc_top5" style="margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="fcc_top5_template">
                            <tr>
                                <td id="fcc_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="fcc_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="fcc_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="fccRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="fcc_box" class="float-left-box">
            <div class="card card-big card-blue">
                <div id="fcc_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="fcc_regions" class="total">
                        <option >Итого</option>
                    </select>
                </div>
                <div id="fcc_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="fcc_year1" class="float-left-box year-align"></div>
                        <div id="fcc_value1" class="value-align">0</div>
                        <div id="fcc_value_diff1" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box1" class="float-left-box up-box">
                            <img id="fcc_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="fcc_year2" class="float-left-box year-align"></div>
                        <div id="fcc_value2" class="value-align">0</div>
                        <div id="fcc_value_diff2" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box2" class="float-left-box up-box">
                            <img id="fcc_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="fcc_year3" class="float-left-box year-align"></div>
                        <div id="fcc_value3" class="value-align">0</div>
                        <div id="fcc_value_diff3" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box3" class="float-left-box up-box">
                            <img id="fcc_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="fcc_year4" class="float-left-box year-align"></div>
                        <div id="fcc_value4" class="value-align">0</div>
                        <div id="fcc_value_diff4" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box4" class="float-left-box up-box">
                            <img id="fcc_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="fcc_year5" class="float-left-box year-align"></div>
                        <div id="fcc_value5" class="value-align">0</div>
                        <div id="fcc_value_diff5" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box5" class="float-left-box up-box">
                            <img id="fcc_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="fcc_year6" class="float-left-box year-align"></div>
                        <div id="fcc_value6" class="value-align">0</div>
                        <div id="fcc_value_diff6" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box6" class="float-left-box up-box">
                            <img id="fcc_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="fcc_year7" class="float-left-box year-align"></div>
                        <div id="fcc_value7" class="value-align">0</div>
                        <div id="fcc_value_diff7" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box7" class="float-left-box up-box">
                            <img id="fcc_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="fcc_year8" class="float-left-box year-align"></div>
                        <div id="fcc_value8" class="value-align">0</div>
                        <div id="fcc_value_diff8" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box8" class="float-left-box up-box">
                            <img id="fcc_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="fcc_year9" class="float-left-box year-align"></div>
                        <div id="fcc_value9" class="value-align">0</div>
                        <div id="fcc_value_diff9" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box9" class="float-left-box up-box">
                            <img id="fcc_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="fcc_year10" class="float-left-box year-align"></div>
                        <div id="fcc_value10" class="value-align">0</div>
                        <div id="fcc_value_diff10" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box10" class="float-left-box up-box">
                            <img id="fcc_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="fcc_year11" class="float-left-box year-align"></div>
                        <div id="fcc_value11" class="value-align">0</div>
                        <div id="fcc_value_diff11" class="value-diff diff-title diff-title"></div>
                        <div id="fcc_img_box11" class="float-left-box up-box">
                            <img id="fcc_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="fcc_year12" class="float-left-box year-align"></div>
                        <div id="fcc_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="fcc_value_diff12" class="value-diff diff-title diff-title"></div>
                        <div  id="fcc_img_box12" class="float-left-box up-box">
                            <img id="fcc_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var fccChart;

const fccModeName = "Итого";

var fccData = [];
var fccYears = [];
var fccRegions = [];
var fccYear;
var fccMode = fccModeName;
var fccStartYear = 2018;
var fccAdmin = 0;

const fccWidgetColor = "#0dcaf0";

function addFccBox() {
    const options = getPage1ChartOption();

    fccChart = new ApexCharts($("#fcc_chart").get(0), options);
    fccChart.render();

    fccChart.updateSeries([{
        color: fccWidgetColor,
        data: getFccInitialData(getCurrentYear())
    }]);

    fccChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onFccChartClick(opts);
                }
            }
        },
        xaxis: {
            categories: getFccXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getFccXAxisColors(getCurrentYear())
                }
            }
        }
    });

    fccRefresh();
}

function normalizeFccData() {
    for(let i = 0; i < fccData.length; i++) {
        fccData[i].name = fccData[i].name.trim();
    }
}

function processFcc(isChangeYearColor) {
    fccYears = [];

    let result = [];

    clearFccMonthBoxesByName();

    fccStartYear = getYearFromDatetime(fccData[0].start_datetime);
    fccAdmin = fccData[0].is_admin;

    for(let i = 0; i < fccData.length; i++) {
        if (parseInt(fccData[i].is_admin) == 1 ||  fccData[i].mode.indexOf(fccMode) > 0) {
            if (i < fccData.length - 1) {
                fccRegions.push(fccData[i].name);
            }

            if (fccData[i].name === fccMode) {
                fccData[i].elements.forEach((element, index) => {
                    // Generate char data
                    if (getMonthFromDatetime(element.datetime) === 12) {
                        result.push(element.value);
                        fccYears.push(getYearFromDatetime(element.datetime));
                    }

                    if (index === fccData[i].elements.length - 1 && getMonthFromDatetime(element.datetime) !== 12) {
                        result.push(element.value);
                        fccYears.push(getYearFromDatetime(element.datetime));
                    }

                    $("#fcc_count").html(element.value);
                });

                fillFccMonthBoxesByName(fccData[i].elements, fccYear);
            }
        }
    }

    fccChart.updateSeries([
        {data: result}
    ]);

    if(isChangeYearColor) {
        colors = [];

        fccYears.forEach((element, index) => {
            if (element === fccYear) {
                colors.push(fccWidgetColor
                );
            } else {
                colors.push("black");
            }
        });

        fccChart.updateOptions({
            xaxis: {
                categories: fccYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function onFccChartClick(opts) {
    let colors = [];

    fccYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(fccWidgetColor
            );

            fccYear = element;
        } else {
            colors.push("black");
        }
    });

    fccChart.updateOptions({
        xaxis: {
            categories: fccYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processFcc(false);
}

function getFccInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= fccStartYear; i--) {
        values.unshift(0);
    }

    return values;
}

function getFccXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= fccStartYear; i--) {
        if(i === currentYear) {
            colors.push(fccWidgetColor
            );
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getFccXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= fccStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearFccMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#fcc_value" + i).html(0);
        $("#fcc_value_diff" + i).html("");
    };
}

function fillFccMonthBoxesByName(elements, year) {
    prevValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === fccYear) {
            month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#fcc_value_diff" + month);

            if(elementValue > prevValue) {
                $("#fcc_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#fcc_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#fcc_img_box" + month).css("visibility", "hidden");
                    $("#fcc_value_diff" + month).html("");
                } else {
                    $("#fcc_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", "#ff0080");

                    $("#fcc_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#fcc_value" + month).html(element.value);
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#fcc_year" + i).html(currentYear);

        if(parseInt($("#fcc_value" + i).html()) === 0) {
            $("#fcc_img_box" + i).css("visibility", "hidden");
            $("#fcc_value_diff" + i).html("");
        }
    }
}

function getFccTopFive() {
    let results = [];

    for (let i = 0; i < fccData.length - 1; i++) {
        const element = {}

        element.name = fccData[i].name;
        element.value = fccData[i].elements[fccData[i].elements.length - 1].value;
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

    const fccTop5Element = $("#fcc_top5");

    fccTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#fcc_top5").append(kendo.template($("#fcc_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#fcc_top_name").attr("id", "fcc_top_name_" + index + 1);
        $("#fcc_top_name_" + index + 1).html(region_name);
        $("#fcc_top_value").attr("id", "fcc_top_value_" + index + 1);
        $("#fcc_top_value_" + index + 1).html(top5element.value);
    });

    fccTop5Element.css("visibility", "visible");
}

function fccRefresh() {
    $("#fcc_refresh").css("visibility", "hidden");
    $("#fcc_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7421809736986544030",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                $("#fcc_regions .reg").remove();

                fccData = data;

                fccYear = getYearFromDatetime(fccData[fccData.length - 1].elements[fccData[fccData.length - 1].elements.length - 1].datetime);

                if(fccData[0].is_admin) {
                    fccMode = fccModeName;
                } else {
                    fccMode = fccData[0].mode.replace("г. ", "");
                }

                normalizeFccData();
                processFcc(true);

                if (fccData.length > 0) {
                    $("#fcc_count").html(fccData[fccData.length - 1].elements[fccData[fccData.length - 1].elements.length - 1].value);
                } else {
                    $("#fcc_count").html(0);
                }

                fccRegions.forEach((name, index) => {
                    if(fccAdmin === 1 || name.toUpperCase().indexOf(fccMode.toUpperCase()) >= 0) {
                        $("#fcc_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getFccTopFive();

                $("#fcc_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

$(document).ready(function () {
    $("#page1").append(getPage1FccContent());

    for(let i = 1; i <= 12; i++) {
        $("#fcc_year" + i).html(fccYear);
    }

    addFccBox();

    $("#fcc_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            fccMode = ui.item.value;

            processFcc(false);
        }
    });
});