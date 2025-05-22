function getPage1TrenContent() {
    return `<div>
        <div class="float-left-box" >
            <div class="card card-medium card-gold">              
                <div class="group_header">Тренеров</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">всего обучено</div>
                    <div id="tren_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="tren_top5" style="visibility: hidden; margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="tren_top5_template">
                            <tr>
                                <td id="tren_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="tren_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="tren_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="trenRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="tren_box" class="float-left-box">
            <div class="card card-big card-gold">
                <div id="tren_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="tren_regions" class="total">
                        <option>Итого</option>
                    </select>
                </div>
                <div id="tren_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="tren_year1" class="float-left-box year-align"></div>
                        <div id="tren_value1" class="value-align">0</div>
                        <div id="tren_value_diff1" class="value-diff diff-title"></div>
                        <div id="tren_img_box1" class="float-left-box up-box">
                            <img id="tren_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="tren_year2" class="float-left-box year-align"></div>
                        <div id="tren_value2" class="value-align">0</div>
                        <div id="tren_value_diff2" class="value-diff diff-title"></div>
                        <div id="tren_img_box2" class="float-left-box up-box">
                            <img id="tren_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="tren_year3" class="float-left-box year-align"></div>
                        <div id="tren_value3" class="value-align">0</div>
                        <div id="tren_value_diff3" class="value-diff diff-title"></div>
                        <div id="tren_img_box3" class="float-left-box up-box">
                            <img id="tren_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="tren_year4" class="float-left-box year-align"></div>
                        <div id="tren_value4" class="value-align">0</div>
                        <div id="tren_value_diff4" class="value-diff diff-title"></div>
                        <div id="tren_img_box4" class="float-left-box up-box">
                            <img id="tren_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="tren_year5" class="float-left-box year-align"></div>
                        <div id="tren_value5" class="value-align">0</div>
                        <div id="tren_value_diff5" class="value-diff diff-title"></div>
                        <div id="tren_img_box5" class="float-left-box up-box">
                            <img id="tren_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="tren_year6" class="float-left-box year-align"></div>
                        <div id="tren_value6" class="value-align">0</div>
                        <div id="tren_value_diff6" class="value-diff diff-title"></div>
                        <div id="tren_img_box6" class="float-left-box up-box">
                            <img id="tren_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="tren_year7" class="float-left-box year-align"></div>
                        <div id="tren_value7" class="value-align">0</div>
                        <div id="tren_value_diff7" class="value-diff diff-title"></div>
                        <div id="tren_img_box7" class="float-left-box up-box">
                            <img id="tren_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="tren_year8" class="float-left-box year-align"></div>
                        <div id="tren_value8" class="value-align">0</div>
                        <div id="tren_value_diff8" class="value-diff diff-title"></div>
                        <div id="tren_img_box8" class="float-left-box up-box">
                            <img id="tren_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="tren_year9" class="float-left-box year-align"></div>
                        <div id="tren_value9" class="value-align">0</div>
                        <div id="tren_value_diff9" class="value-diff diff-title"></div>
                        <div id="tren_img_box9" class="float-left-box up-box">
                            <img id="tren_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="tren_year10" class="float-left-box year-align"></div>
                        <div id="tren_value10" class="value-align">0</div>
                        <div id="tren_value_diff10" class="value-diff diff-title"></div>
                        <div id="tren_img_box10" class="float-left-box up-box">
                            <img id="tren_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="tren_year11" class="float-left-box year-align"></div>
                        <div id="tren_value11" class="value-align">0</div>
                        <div id="tren_value_diff11" class="value-diff diff-title"></div>
                        <div id="tren_img_box11" class="float-left-box up-box">
                            <img id="tren_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="tren_year12" class="float-left-box year-align"></div>
                        <div id="tren_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="tren_value_diff12" class="value-diff diff-title"></div>
                        <div  id="tren_img_box12" class="float-left-box up-box">
                            <img id="tren_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var trenChart;

const trenModeName = "Итого";

var trenData = [];
var trenYears = [];
var trenRegions = [];
var trenYear;
var trenMode = trenModeName;
var trenStartYear = 2018;
var trenAdmin = 0;

const trenWidgetColor = "#FF7F50";

function addTrenBox() {
    const options = getPage1ChartOption();

    trenChart = new ApexCharts($("#tren_chart").get(0), options);
    trenChart.render();

    trenChart.updateSeries([{
        color: trenWidgetColor,
        data: getTrenInitialData(getCurrentYear())
    }]);

    trenChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onTrenChartClick(opts);
                }
            }
        },
        xaxis: {
            categories: getTrenXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getTrenXAxisColors(getCurrentYear())
                }
            }
        }
    });

    trenRefresh();
}

function normalizeTrenData() {
    for(let i = 0; i < trenData.length; i++) {
        trenData[i].name = trenData[i].name.trim();
    }
}

function processTren(isChangeYearColor) {
    trenYears = [2024];
    let yearCount = [0];
    let currentYear = 2024;

    clearTrenMonthBoxesByName();

    trenStartYear = getYearFromDatetime(trenData[0].start_datetime);
    trenAdmin = trenData[0].is_admin;

    for(let i = 0; i < trenData.length; i++) {
        if (parseInt(trenData[i].is_admin) == 1 ||  trenData[i].mode.indexOf(trenMode) > 0) {
            if (i < trenData.length - 1) {
                trenRegions.push(trenData[i].name);
            }

            if(currentYear !== getYearFromDatetime(trenData[i].start_datetime)) {
                currentYear = getYearFromDatetime(trenData[i].start_datetime);
                trenYears.push(currentYear);
            }

            if (trenData[i].name === trenMode) {
                total = 0;

                trenData[i].elements.forEach((element, index) => {
                    total += element.value;
                });

                $("#tren_count").html(total);
                yearCount.push(total);

                fillTrenMonthBoxesByName(trenData[i].elements, trenYear);
            }
        }
    }

    trenChart.updateSeries([
        {data: yearCount}
    ]);

    if(isChangeYearColor) {
        colors = [];

        trenYears.forEach((element, index) => {
            if (element === trenYear) {
                colors.push(trenWidgetColor
                );
            } else {
                colors.push("black");
            }
        });

        trenChart.updateOptions({
            xaxis: {
                categories: trenYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function onTrenChartClick(opts) {
    let colors = [];

    trenYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(trenWidgetColor
            );

            trenYear = element;
        } else {
            colors.push("black");
        }
    });

    trenChart.updateOptions({
        xaxis: {
            categories: trenYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processTren(false);
}

function getTrenInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= trenStartYear; i--) {
        values.unshift(0);
    }

    return values;
}

function getTrenXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= trenStartYear; i--) {
        if(i === currentYear) {
            colors.push(trenWidgetColor
            );
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getTrenXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= trenStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearTrenMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#tren_value" + i).html(0);
        $("#tren_value_diff" + i).html("");
    };
}

function fillTrenMonthBoxesByName(elements, year) {
    prevValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === trenYear) {
            month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#tren_value_diff" + month);

            if(elementValue > prevValue) {
                $("#tren_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#tren_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#tren_img_box" + month).css("visibility", "hidden");
                    $("#tren_value_diff" + month).html("");
                } else {
                    $("#tren_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", "#ff0080");

                    $("#tren_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#tren_value" + month).html(element.value);
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#tren_year" + i).html(currentYear);

        if(parseInt($("#tren_value" + i).html()) === 0) {
            $("#tren_img_box" + i).css("visibility", "hidden");
            $("#tren_value_diff" + i).html("");
        }
    }
}

function getTrenTopFive() {
    let results = [];

    for (let i = 0; i < trenData.length - 1; i++) {
        const element = {}

        element.name = trenData[i].name;

        let total = 0;

        trenData[i].elements.forEach((element, index) => {
            total += element.value;
        });

        element.value = total;
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

    const trenTop5Element = $("#tren_top5");

    trenTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#tren_top5").append(kendo.template($("#tren_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#tren_top_name").attr("id", "tren_top_name_" + index + 1);
        $("#tren_top_name_" + index + 1).html(region_name);
        $("#tren_top_value").attr("id", "tren_top_value_" + index + 1);
        $("#tren_top_value_" + index + 1).html(top5element.value);
    });

    trenTop5Element.css("visibility", "visible");
}

function trenRefresh() {
    $("#tren_refresh").css("visibility", "hidden");
    $("#tren_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7425618304446911712",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                $("#tren_regions .reg").remove();

                trenData = data;

                trenYear = getYearFromDatetime(trenData[trenData.length - 1].elements[trenData[trenData.length - 1].elements.length - 1].datetime);

                if(trenData[0].is_admin) {
                    trenMode = trenModeName;
                } else {
                    trenMode = trenData[0].mode.replace("г. ", "");
                }

                normalizeTrenData();
                processTren(true);

                if (trenData.length > 0) {
                    $("#tren_count").html(getRegionTotalCount(trenData[trenData.length - 1].elements));
                } else {
                    $("#tren_count").html(0);
                }

                trenRegions.forEach((name, index) => {
                    if(trenAdmin === 1 || name.toUpperCase().indexOf(trenMode.toUpperCase()) >= 0) {
                        $("#tren_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getTrenTopFive();

                $("#tren_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }

            $("#wait").css("visibility", "hidden");
        },
        error: function() {
            $("#tren_wait").css("visibility", "hidden");

            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

function getRegionTotalCount(yearMonthElements) {
    let total = 0;

    yearMonthElements.forEach((element, index) => {
        total += element.value;
    });

    return total;
}

$(document).ready(function () {
    $("#page1").append(getPage1TrenContent());

    for(let i = 1; i <= 12; i++) {
        $("#tren_year" + i).html(trenYear);
    }

    addTrenBox();

    $("#tren_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            trenMode = ui.item.value;

            processTren(false);
        }
    });
});