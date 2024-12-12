function getPage1RegContent() {
    return `<div>
        <div class="float-left-box" >
            <div class="card card-medium card-pink">               
                <div class="group_header">Региональных команд</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">всего обучено</div>
                    <div id="reg_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="reg_top5" style="visibility: hidden; margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="reg_top5_template">
                            <tr>
                                <td id="reg_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="reg_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="reg_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="regRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="reg_box" class="float-left-box">
            <div class="card card-big card-pink">
                <div id="reg_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="reg_regions" class="total">
                        <option>Итого</option>
                    </select>
                </div>
                <div id="reg_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="reg_year1" class="float-left-box year-align"></div>
                        <div id="reg_value1" class="value-align">0</div>
                        <div id="reg_value_diff1" class="value-diff diff-title"></div>
                        <div id="reg_img_box1" class="float-left-box up-box">
                            <img id="reg_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="reg_year2" class="float-left-box year-align"></div>
                        <div id="reg_value2" class="value-align">0</div>
                        <div id="reg_value_diff2" class="value-diff diff-title"></div>
                        <div id="reg_img_box2" class="float-left-box up-box">
                            <img id="reg_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="reg_year3" class="float-left-box year-align"></div>
                        <div id="reg_value3" class="value-align">0</div>
                        <div id="reg_value_diff3" class="value-diff diff-title"></div>
                        <div id="reg_img_box3" class="float-left-box up-box">
                            <img id="reg_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="reg_year4" class="float-left-box year-align"></div>
                        <div id="reg_value4" class="value-align">0</div>
                        <div id="reg_value_diff4" class="value-diff diff-title"></div>
                        <div id="reg_img_box4" class="float-left-box up-box">
                            <img id="reg_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="reg_year5" class="float-left-box year-align"></div>
                        <div id="reg_value5" class="value-align">0</div>
                        <div id="reg_value_diff5" class="value-diff diff-title"></div>
                        <div id="reg_img_box5" class="float-left-box up-box">
                            <img id="reg_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="reg_year6" class="float-left-box year-align"></div>
                        <div id="reg_value6" class="value-align">0</div>
                        <div id="reg_value_diff6" class="value-diff diff-title"></div>
                        <div id="reg_img_box6" class="float-left-box up-box">
                            <img id="reg_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="reg_year7" class="float-left-box year-align"></div>
                        <div id="reg_value7" class="value-align">0</div>
                        <div id="reg_value_diff7" class="value-diff diff-title"></div>
                        <div id="reg_img_box7" class="float-left-box up-box">
                            <img id="reg_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="reg_year8" class="float-left-box year-align"></div>
                        <div id="reg_value8" class="value-align">0</div>
                        <div id="reg_value_diff8" class="value-diff diff-title"></div>
                        <div id="reg_img_box8" class="float-left-box up-box">
                            <img id="reg_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="reg_year9" class="float-left-box year-align"></div>
                        <div id="reg_value9" class="value-align">0</div>
                        <div id="reg_value_diff9" class="value-diff diff-title"></div>
                        <div id="reg_img_box9" class="float-left-box up-box">
                            <img id="reg_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="reg_year10" class="float-left-box year-align"></div>
                        <div id="reg_value10" class="value-align">0</div>
                        <div id="reg_value_diff10" class="value-diff diff-title"></div>
                        <div id="reg_img_box10" class="float-left-box up-box">
                            <img id="reg_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="reg_year11" class="float-left-box year-align"></div>
                        <div id="reg_value11" class="value-align">0</div>
                        <div id="reg_value_diff11" class="value-diff diff-title"></div>
                        <div id="reg_img_box11" class="float-left-box up-box">
                            <img id="reg_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="reg_year12" class="float-left-box year-align"></div>
                        <div id="reg_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="reg_value_diff12" class="value-diff diff-title"></div>
                        <div  id="reg_img_box12" class="float-left-box up-box">
                            <img id="reg_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var regChart;

const regModeName = "Итого";

var regData = [];
var regYears = [];
var regRegions = [];
var regYear;
var regMode = regModeName;
var regStartYear = 2018;
var regAdmin = 0;

const regWidgetColor = "#9b0086";

function addRegBox() {
    const options = getPage1ChartOption();

    regChart = new ApexCharts($("#reg_chart").get(0), options);
    regChart.render();

    regChart.updateSeries([{
        color: regWidgetColor,
        data: getRegInitialData(getCurrentYear())
    }]);

    regChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onRegChartClick(opts);
                }
            }
        },
        xaxis: {
            categories: getRegXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getRegXAxisColors(getCurrentYear())
                }
            }
        }
    });

    regRefresh();
}

function normalizeRegData() {
    for(let i = 0; i < regData.length; i++) {
        regData[i].name = regData[i].name.trim().replace("город федерального значения ", "");
    }
}

function processReg(isChangeYearColor) {
    regYears = [];

    let result = [];

    clearRegMonthBoxesByName();

    regStartYear = getYearFromDatetime(regData[0].start_datetime);
    regAdmin = regData[0].is_admin;

    for(let i = 0; i < regData.length; i++) {
        if (parseInt(regData[i].is_admin) == 1 ||  regData[i].mode.indexOf(regMode) > 0) {
            if (i < regData.length - 1) {
                regRegions.push(regData[i].name);
            }

            if (regData[i].name === regMode) {
                regData[i].elements.forEach((element, index) => {
                    // Generate char data
                    if (getMonthFromDatetime(element.datetime) === 12) {
                        result.push(element.value);
                        regYears.push(getYearFromDatetime(element.datetime));
                    }

                    if (index === regData[i].elements.length - 1 && getMonthFromDatetime(element.datetime) !== 12) {
                        result.push(element.value);
                        regYears.push(getYearFromDatetime(element.datetime));
                    }

                    $("#reg_count").html(element.value);
                });

                fillRegMonthBoxesByName(regData[i].elements, regYear);
            }
        }
    }

    regChart.updateSeries([
        {data: result}
    ]);

    if(isChangeYearColor) {
        colors = [];

        regYears.forEach((element, index) => {
            if (element === regYear) {
                colors.push(regWidgetColor
                );
            } else {
                colors.push("black");
            }
        });

        regChart.updateOptions({
            xaxis: {
                categories: regYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function onRegChartClick(opts) {
    let colors = [];

    regYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(regWidgetColor
            );

            regYear = element;
        } else {
            colors.push("black");
        }
    });

    regChart.updateOptions({
        xaxis: {
            categories: regYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processReg(false);
}

function getRegInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= regStartYear; i--) {
        values.unshift(0);
    }

    return values;
}

function getRegXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= regStartYear; i--) {
        if(i === currentYear) {
            colors.push(regWidgetColor
            );
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getRegXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= regStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearRegMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#reg_value" + i).html(0);
        $("#reg_value_diff" + i).html("");
    };
}

function fillRegMonthBoxesByName(elements, year) {
    prevValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === regYear) {
            month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#reg_value_diff" + month);

            if(elementValue > prevValue) {
                $("#reg_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#reg_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#reg_img_box" + month).css("visibility", "hidden");
                    $("#reg_value_diff" + month).html("");
                } else {
                    $("#reg_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", "#ff0080");

                    $("#reg_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#reg_value" + month).html(element.value);
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#reg_year" + i).html(currentYear);

        if(parseInt($("#reg_value" + i).html()) === 0) {
            $("#reg_img_box" + i).css("visibility", "hidden");
            $("#reg_value_diff" + i).html("");
        }
    }
}

function getRegTopFive() {
    let results = [];

    for (let i = 0; i < regData.length - 1; i++) {
        const element = {}

        element.name = regData[i].name;
        element.value = regData[i].elements[regData[i].elements.length - 1].value;
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

    const regTop5Element = $("#reg_top5");

    regTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#reg_top5").append(kendo.template($("#reg_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#reg_top_name").attr("id", "reg_top_name_" + index + 1);
        $("#reg_top_name_" + index + 1).html(region_name);
        $("#reg_top_value").attr("id", "reg_top_value_" + index + 1);
        $("#reg_top_value_" + index + 1).html(top5element.value);
    });

    regTop5Element.css("visibility", "visible");
}

function regRefresh() {
    $("#reg_refresh").css("visibility", "hidden");
    $("#reg_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7426297455233024870",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                $("#reg_regions .reg").remove();

                regData = data;

                regYear = getYearFromDatetime(regData[regData.length - 1].elements[regData[regData.length - 1].elements.length - 1].datetime);

                if(regData[0].is_admin) {
                    regMode = regModeName;
                } else {
                    regMode = regData[0].mode.replace("г. ", "");
                }

                normalizeRegData();
                processReg(true);

                if (regData.length > 0) {
                    $("#reg_count").html(regData[regData.length - 1].elements[regData[regData.length - 1].elements.length - 1].value);
                } else {
                    $("#reg_count").html(0);
                }

                regRegions.forEach((name, index) => {
                    if(regAdmin === 1 || name.toUpperCase().indexOf(regMode.toUpperCase()) >= 0) {
                        $("#reg_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getRegTopFive();

                $("#reg_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }

        },
        error: function() {
            $("#reg_wait").css("visibility", "hidden");

            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

$(document).ready(function () {
    $("#page1").append(getPage1RegContent());

    for(let i = 1; i <= 12; i++) {
        $("#reg_year" + i).html(regYear);
    }

    addRegBox();

    $("#reg_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            regMode = ui.item.value;

            processReg(false);
        }
    });
});