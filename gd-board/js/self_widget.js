function getPage1SelfContent() {
    return `<div>
        <div class="float-left-box" >
            <div class="card card-medium card-darkblue">               
                <div class="group_header">Обученных самостоятельно</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">Всего обучено</div>
                    <div id="self_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="self_top5" style="visibility: hidden; margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="self_top5_template">
                            <tr>
                                <td id="self_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="self_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="self_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="selfRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="self_box" class="float-left-box">
            <div class="card card-big card-darkblue">
                <div id="self_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="self_regions" class="total">
                        <option>Итого</option>
                    </select>
                </div>
                <div id="self_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="self_year1" class="float-left-box year-align"></div>
                        <div id="self_value1" class="value-align">0</div>
                        <div id="self_value_diff1" class="value-diff diff-title"></div>
                        <div id="self_img_box1" class="float-left-box up-box">
                            <img id="self_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="self_year2" class="float-left-box year-align"></div>
                        <div id="self_value2" class="value-align">0</div>
                        <div id="self_value_diff2" class="value-diff diff-title"></div>
                        <div id="self_img_box2" class="float-left-box up-box">
                            <img id="self_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="self_year3" class="float-left-box year-align"></div>
                        <div id="self_value3" class="value-align">0</div>
                        <div id="self_value_diff3" class="value-diff diff-title"></div>
                        <div id="self_img_box3" class="float-left-box up-box">
                            <img id="self_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="self_year4" class="float-left-box year-align"></div>
                        <div id="self_value4" class="value-align">0</div>
                        <div id="self_value_diff4" class="value-diff diff-title"></div>
                        <div id="self_img_box4" class="float-left-box up-box">
                            <img id="self_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="self_year5" class="float-left-box year-align"></div>
                        <div id="self_value5" class="value-align">0</div>
                        <div id="self_value_diff5" class="value-diff diff-title"></div>
                        <div id="self_img_box5" class="float-left-box up-box">
                            <img id="self_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="self_year6" class="float-left-box year-align"></div>
                        <div id="self_value6" class="value-align">0</div>
                        <div id="self_value_diff6" class="value-diff diff-title"></div>
                        <div id="self_img_box6" class="float-left-box up-box">
                            <img id="self_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="self_year7" class="float-left-box year-align"></div>
                        <div id="self_value7" class="value-align">0</div>
                        <div id="self_value_diff7" class="value-diff diff-title"></div>
                        <div id="self_img_box7" class="float-left-box up-box">
                            <img id="self_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="self_year8" class="float-left-box year-align"></div>
                        <div id="self_value8" class="value-align">0</div>
                        <div id="self_value_diff8" class="value-diff diff-title"></div>
                        <div id="self_img_box8" class="float-left-box up-box">
                            <img id="self_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="self_year9" class="float-left-box year-align"></div>
                        <div id="self_value9" class="value-align">0</div>
                        <div id="self_value_diff9" class="value-diff diff-title"></div>
                        <div id="self_img_box9" class="float-left-box up-box">
                            <img id="self_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="self_year10" class="float-left-box year-align"></div>
                        <div id="self_value10" class="value-align">0</div>
                        <div id="self_value_diff10" class="value-diff diff-title"></div>
                        <div id="self_img_box10" class="float-left-box up-box">
                            <img id="self_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="self_year11" class="float-left-box year-align"></div>
                        <div id="self_value11" class="value-align">0</div>
                        <div id="self_value_diff11" class="value-diff diff-title"></div>
                        <div id="self_img_box11" class="float-left-box up-box">
                            <img id="self_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="self_year12" class="float-left-box year-align"></div>
                        <div id="self_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="self_value_diff12" class="value-diff diff-title"></div>
                        <div  id="self_img_box12" class="float-left-box up-box">
                            <img id="self_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var selfChart;

const selfModeName = "Итого";

var selfData = [];
var selfYears = [];
var selfRegions = [];
var selfYear;
var selfMode = selfModeName;
var selfStartYear = 2018;
var selfAdmin = 0;

const selfWidgetColor = "#4a4fd4";

function addSelfBox() {
    const options = getPage1ChartOption();

    selfChart = new ApexCharts($("#self_chart").get(0), options);
    selfChart.render();

    selfChart.updateSeries([{
        color: selfWidgetColor,
        data: getSelfInitialData(getCurrentYear())
    }]);

    selfChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onSelfChartClick(opts);
                }
            }
        },
        xaxis: {
            categories: getSelfXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getSelfXAxisColors(getCurrentYear())
                }
            }
        }
    });

    selfRefresh();
}

function normalizeSelfData() {
    for(let i = 0; i < selfData.length; i++) {
        selfData[i].name = selfData[i].name.trim().replace("город федерального значения ", "");
    }
}

function processSelf(isChangeYearColor) {
    selfYears = [];

    let result = [];

    clearSelfMonthBoxesByName();

    selfStartYear = getYearFromDatetime(selfData[0].start_datetime);
    selfAdmin = selfData[0].is_admin;

    for(let i = 0; i < selfData.length; i++) {
        if (parseInt(selfData[i].is_admin) == 1 ||  selfData[i].mode.indexOf(selfMode) > 0) {
            if (i < selfData.length - 1) {
                selfRegions.push(selfData[i].name);
            }

            if (selfData[i].name === selfMode) {
                selfData[i].elements.forEach((element, index) => {
                    // Generate char data
                    if (getMonthFromDatetime(element.datetime) === 12) {
                        result.push(element.value);
                        selfYears.push(getYearFromDatetime(element.datetime));
                    }

                    if (index === selfData[i].elements.length - 1 && getMonthFromDatetime(element.datetime) !== 12) {
                        result.push(element.value);
                        selfYears.push(getYearFromDatetime(element.datetime));
                    }

                    $("#self_count").html(element.value);
                });

                fillSelfMonthBoxesByName(selfData[i].elements, selfYear);
            }
        }
    }

    selfChart.updateSeries([
        {data: result}
    ]);

    if(isChangeYearColor) {
        colors = [];

        selfYears.forEach((element, index) => {
            if (element === selfYear) {
                colors.push(selfWidgetColor
                );
            } else {
                colors.push("black");
            }
        });

        selfChart.updateOptions({
            xaxis: {
                categories: selfYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function onSelfChartClick(opts) {
    let colors = [];

    selfYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(selfWidgetColor
            );

            selfYear = element;
        } else {
            colors.push("black");
        }
    });

    selfChart.updateOptions({
        xaxis: {
            categories: selfYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processSelf(false);
}

function getSelfInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= selfStartYear; i--) {
        values.unshift(0);
    }

    return values;
}

function getSelfXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= selfStartYear; i--) {
        if(i === currentYear) {
            colors.push(selfWidgetColor
            );
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getSelfXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= selfStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearSelfMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#self_value" + i).html(0);
        $("#self_value_diff" + i).html("");
    };
}

function fillSelfMonthBoxesByName(elements, year) {
    prevValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === selfYear) {
            month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#self_value_diff" + month);

            if(elementValue > prevValue) {
                $("#self_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#self_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#self_img_box" + month).css("visibility", "hidden");
                    $("#self_value_diff" + month).html("");
                } else {
                    $("#self_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", "#ff0080");

                    $("#self_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#self_value" + month).html(element.value);
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#self_year" + i).html(currentYear);

        if(parseInt($("#self_value" + i).html()) === 0) {
            $("#self_img_box" + i).css("visibility", "hidden");
            $("#self_value_diff" + i).html("");
        }
    }
}

function getSelfTopFive() {
    let results = [];

    for (let i = 0; i < selfData.length - 1; i++) {
        const element = {}

        element.name = selfData[i].name;
        element.value = selfData[i].elements[selfData[i].elements.length - 1].value;
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

    const selfTop5Element = $("#self_top5");

    selfTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#self_top5").append(kendo.template($("#self_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#self_top_name").attr("id", "self_top_name_" + index + 1);
        $("#self_top_name_" + index + 1).html(region_name);
        $("#self_top_value").attr("id", "self_top_value_" + index + 1);
        $("#self_top_value_" + index + 1).html(top5element.value);
    });

    selfTop5Element.css("visibility", "visible");
}

function selfRefresh() {
    $("#self_refresh").css("visibility", "hidden");
    $("#self_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7426312796418893102",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                $("#self_regions .reg").remove();

                selfData = data;

                selfYear = getYearFromDatetime(selfData[selfData.length - 1].elements[selfData[selfData.length - 1].elements.length - 1].datetime);

                if(selfData[0].is_admin) {
                    selfMode = selfModeName;
                } else {
                    selfMode = selfData[0].mode.replace("г. ", "");
                }

                normalizeSelfData();
                processSelf(true);

                if (selfData.length > 0) {
                    $("#self_count").html(selfData[selfData.length - 1].elements[selfData[selfData.length - 1].elements.length - 1].value);
                } else {
                    $("#self_count").html(0);
                }

                selfRegions.forEach((name, index) => {
                    if(selfAdmin === 1 || name.toUpperCase().indexOf(selfMode.toUpperCase()) >= 0) {
                        $("#self_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getSelfTopFive();

                $("#self_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }

            $("#wait").css("visibility", "hidden");
        },
        error: function() {
            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

$(document).ready(function () {
    $("#page1").append(getPage1SelfContent());

    for(let i = 1; i <= 12; i++) {
        $("#self_year" + i).html(selfYear);
    }

    addSelfBox();

    $("#self_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            selfMode = ui.item.value;

            processSelf(false);
        }
    });
});