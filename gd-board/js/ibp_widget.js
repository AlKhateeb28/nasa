function getPage1IbpContent() {
    return `<div>
        <div class="float-left-box" >
            <div class="card card-medium card-green">               
                <div class="group_header">Инструкторов БП</div>
                <div style="z-index: 1000; position: relative; margin-top: -25px;">
                    <div class="group-desc">всего обучено</div>
                    <div id="ibp_count" class="group-value" style="color: #0099ee;">0</div>
                    <table id="ibp_top5" style="visibility: hidden; margin-left: 10px; margin-top: -18px;">
                        <script type="text/x-kendo-template" id="ibp_top5_template">
                            <tr>
                                <td id="ibp_top_name" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                                <td id="ibp_top_value" style="font-size: 14px; border-bottom: 1px solid silver !important;"></td>
                            </tr>
                        </script>
                    </table>
                    <div id="ibp_refresh" style="margin-top: 10px; margin-left: 10px; visibility: hidden">
                        <button type="button" class="btn-refresh" onclick="ibpRefresh()">Обновить</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="ibp_box" class="float-left-box">
            <div class="card card-big card-green">
                <div id="ibp_regions_box" style="padding-top: 7px; padding-left: 5px;">
                    <select id="ibp_regions" class="total">
                        <option >Итого</option>
                    </select>
                </div>
                <div id="ibp_chart" style="cursor: pointer;"></div>
                <div class="months-box">
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Янв</div>
                        <div id="ibp_year1" class="float-left-box year-align"></div>
                        <div id="ibp_value1" class="value-align">0</div>
                        <div id="ibp_value_diff1" class="value-diff diff-title"></div>
                        <div id="ibp_img_box1" class="float-left-box up-box">
                            <img id="ibp_img1" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Фев</div>
                        <div id="ibp_year2" class="float-left-box year-align"></div>
                        <div id="ibp_value2" class="value-align">0</div>
                        <div id="ibp_value_diff2" class="value-diff diff-title"></div>
                        <div id="ibp_img_box2" class="float-left-box up-box">
                            <img id="ibp_img2" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Мар</div>
                        <div id="ibp_year3" class="float-left-box year-align"></div>
                        <div id="ibp_value3" class="value-align">0</div>
                        <div id="ibp_value_diff3" class="value-diff diff-title"></div>
                        <div id="ibp_img_box3" class="float-left-box up-box">
                            <img id="ibp_img3" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Апр</div>
                        <div id="ibp_year4" class="float-left-box year-align"></div>
                        <div id="ibp_value4" class="value-align">0</div>
                        <div id="ibp_value_diff4" class="value-diff diff-title"></div>
                        <div id="ibp_img_box4" class="float-left-box up-box">
                            <img id="ibp_img4" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Май</div>
                        <div id="ibp_year5" class="float-left-box year-align"></div>
                        <div id="ibp_value5" class="value-align">0</div>
                        <div id="ibp_value_diff5" class="value-diff diff-title"></div>
                        <div id="ibp_img_box5" class="float-left-box up-box">
                            <img id="ibp_img5" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июн</div>
                        <div id="ibp_year6" class="float-left-box year-align"></div>
                        <div id="ibp_value6" class="value-align">0</div>
                        <div id="ibp_value_diff6" class="value-diff diff-title"></div>
                        <div id="ibp_img_box6" class="float-left-box up-box">
                            <img id="ibp_img6" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Июл</div>
                        <div id="ibp_year7" class="float-left-box year-align"></div>
                        <div id="ibp_value7" class="value-align">0</div>
                        <div id="ibp_value_diff7" class="value-diff diff-title"></div>
                        <div id="ibp_img_box7" class="float-left-box up-box">
                            <img id="ibp_img7" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Авг</div>
                        <div id="ibp_year8" class="float-left-box year-align"></div>
                        <div id="ibp_value8" class="value-align">0</div>
                        <div id="ibp_value_diff8" class="value-diff diff-title"></div>
                        <div id="ibp_img_box8" class="float-left-box up-box">
                            <img id="ibp_img8" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Сен</div>
                        <div id="ibp_year9" class="float-left-box year-align"></div>
                        <div id="ibp_value9" class="value-align">0</div>
                        <div id="ibp_value_diff9" class="value-diff diff-title"></div>
                        <div id="ibp_img_box9" class="float-left-box up-box">
                            <img id="ibp_img9" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Окт</div>
                        <div id="ibp_year10" class="float-left-box year-align"></div>
                        <div id="ibp_value10" class="value-align">0</div>
                        <div id="ibp_value_diff10" class="value-diff diff-title"></div>
                        <div id="ibp_img_box10" class="float-left-box up-box">
                            <img id="ibp_img10" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box month-box">
                        <div class="float-left-box month-align">Ноя</div>
                        <div id="ibp_year11" class="float-left-box year-align"></div>
                        <div id="ibp_value11" class="value-align">0</div>
                        <div id="ibp_value_diff11" class="value-diff diff-title"></div>
                        <div id="ibp_img_box11" class="float-left-box up-box">
                            <img id="ibp_img11" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                    <div class="float-left-box">
                        <div class="float-left-box month-align">Дек</div>
                        <div id="ibp_year12" class="float-left-box year-align"></div>
                        <div id="ibp_value12" class="value-align" style="margin-left: 15px;">0</div>
                        <div id="ibp_value_diff12" class="value-diff diff-title"></div>
                        <div  id="ibp_img_box12" class="float-left-box up-box">
                            <img id="ibp_img12" src="https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png" class="up-image"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

var ibpChart;

const ibpModeName = "Итого";

var ibpData = [];
var ibpYears = [];
var ibpRegions = [];
var ibpYear;
var ibpMode = ibpModeName;
var ibpStartYear = 2018;
var ibpAdmin = 0;

const ibpWidgetColor = "#7fff00";

function addIbpBox() {
    const options = getPage1ChartOption();

    ibpChart = new ApexCharts($("#ibp_chart").get(0), options);
    ibpChart.render();

    ibpChart.updateSeries([{
        color: ibpWidgetColor,
        data: getIbpInitialData(getCurrentYear())
    }]);

    ibpChart.updateOptions({
        chart: {
            events: {
                click: function(event, chartContext, opts) {
                    onIbpChartClick(opts);
                }
            }
        },
        dataLabels: {
            background: {
                foreColor: "#2f4f4f"
            }
        },
        xaxis: {
            categories: getIbpXAxisCategories(getCurrentYear()),
            labels: {
                style: {
                    colors: getIbpXAxisColors(getCurrentYear())
                }
            }
        }
    });

    ibpRefresh();
}

function normalizeIbpData() {
    for(let i = 0; i < ibpData.length; i++) {
        ibpData[i].name = ibpData[i].name.trim();
    }
}

function processIbp(isChangeYearColor) {
    ibpYears = [2024];
    let yearCount = [0];
    let currentYear = 2024;

    clearIbpMonthBoxesByName();

    ibpStartYear = getYearFromDatetime(ibpData[0].start_datetime);
    ibpAdmin = ibpData[0].is_admin;

    for(let i = 0; i < ibpData.length; i++) {
        if (parseInt(ibpData[i].is_admin) == 1 ||  ibpData[i].mode.indexOf(ibpMode) > 0) {
            if (i < ibpData.length - 1) {
                ibpRegions.push(ibpData[i].name);
            }

            if(currentYear !== getYearFromDatetime(ibpData[i].start_datetime)) {
                currentYear = getYearFromDatetime(ibpData[i].start_datetime);
                ibpYears.push(currentYear);
            }

            if (ibpData[i].name === ibpMode) {
                ibpYears.push(getYearFromDatetime(ibpData[i].start_datetime));

                total = 0;

                ibpData[i].elements.forEach((element, index) => {
                    total += element.value;
                });

                $("#ibp_count").html(total);
                yearCount.push(total);

                fillIbpMonthBoxesByName(ibpData[i].elements, ibpYear);
            }
        }
    }

    ibpChart.updateSeries([
        {data: yearCount}
    ]);

    if(isChangeYearColor) {
        colors = [];

        ibpYears.forEach((element, index) => {
            if (element === ibpYear) {
                colors.push(ibpWidgetColor
                );
            } else {
                colors.push("black");
            }
        });

        ibpChart.updateOptions({
            xaxis: {
                categories: ibpYears,
                labels: {
                    style: {
                        colors: colors
                    }
                }
            }
        });
    }
}

function onIbpChartClick(opts) {
    let colors = [];

    ibpYears.forEach((element, index) => {
        if(index === opts.dataPointIndex) {
            colors.push(ibpWidgetColor
            );

            ibpYear = element;
        } else {
            colors.push("black");
        }
    });

    ibpChart.updateOptions({
        xaxis: {
            categories: ibpYears,
            labels: {
                style: {
                    colors: colors
                }
            }
        }
    });

    processIbp(false);
}

function getIbpInitialData(currentYear){
    let values = [];

    for(let i = currentYear; i >= ibpStartYear; i--) {
        values.push(0);
    }

    return values;
}

function getIbpXAxisColors(currentYear){
    let colors = [];

    for(let i = currentYear; i >= ibpStartYear; i--) {
        if(i === currentYear) {
            colors.push(ibpWidgetColor
            );
        } else {
            colors.push("black");
        }
    }

    return colors;
}

function getIbpXAxisCategories(currentYear){
    let years = [];

    for(let i = currentYear; i >= ibpStartYear; i--) {
        years.unshift(i);
    }

    return years;
}

function clearIbpMonthBoxesByName() {
    for(let i = 1; i <= 12; i++) {
        $("#ibp_value" + i).html(0);
        $("#ibp_value_diff" + i).html("");
    };
}

function fillIbpMonthBoxesByName(elements, year) {
    prevValue = 0;

    let currentYear;

    elements.forEach((element, index) => {
        if(getYearFromDatetime(element.datetime) === ibpYear) {
            month = getMonthFromDatetime(element.datetime);

            const elementValue = parseInt(element.value);

            if(month === 1 && index > 0) {
                prevValue = elements[index - 1].value;
            }

            const diffElement = $("#ibp_value_diff" + month);

            if(elementValue > prevValue) {
                $("#ibp_img_box" + month).css("visibility", "visible");
                diffElement.html("+" + (elementValue - prevValue));
                diffElement.css("color", "green");

                $("#ibp_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/up.png");
            } else {
                if(elementValue === prevValue) {
                    $("#ibp_img_box" + month).css("visibility", "hidden");
                    $("#ibp_value_diff" + month).html("");
                } else {
                    $("#ibp_img_box" + month).css("visibility", "visible");
                    diffElement.html(elementValue - prevValue);
                    diffElement.css("color", "#ff0080");

                    $("#ibp_img" + month).attr("src", "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/images/down.png");
                }
            }

            prevValue = elementValue;
            currentYear = getYearFromDatetime(element.datetime);

            $("#ibp_value" + month).html(element.value);
        }
    });

    for(let i = 1; i <= 12; i++) {
        $("#ibp_year" + i).html(currentYear);

        if(parseInt($("#ibp_value" + i).html()) === 0) {
            $("#ibp_img_box" + i).css("visibility", "hidden");
            $("#ibp_value_diff" + i).html("");
        }
    }
}

function getIbpTopFive() {
    let results = [];

    for (let i = 0; i < ibpData.length - 1; i++) {
        const element = {}

        element.name = ibpData[i].name;

        let total = 0;

        ibpData[i].elements.forEach((element, index) => {
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

    const ibpTop5Element = $("#ibp_top5");

    ibpTop5Element.append("<tr><th colSpan='2' style='font-size: 22px; font-weight: bold; background-color: #dee2e6'>Топ 5</th></tr>");

    top5List.forEach((top5element, index) => {
        $("#ibp_top5").append(kendo.template($("#ibp_top5_template").html()));

        let region_name = top5element.name;
        if (region_name.length > 25) {
            region_name = region_name.substring(0, 18) + " ...";
        }

        $("#ibp_top_name").attr("id", "ibp_top_name_" + index + 1);
        $("#ibp_top_name_" + index + 1).html(region_name);
        $("#ibp_top_value").attr("id", "ibp_top_value_" + index + 1);
        $("#ibp_top_value_" + index + 1).html(top5element.value);
    });

    ibpTop5Element.css("visibility", "visible");
}

function ibpRefresh() {
    $("#ibp_refresh").css("visibility", "hidden");
    $("#ibp_top5 tr").remove();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7425602477515813645",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                $("#ibp_regions .reg").remove();

                ibpData = data;

                ibpYear = getYearFromDatetime(ibpData[ibpData.length - 1].elements[ibpData[ibpData.length - 1].elements.length - 1].datetime);

                if(ibpData[0].is_admin) {
                    ibpMode = ibpModeName;
                } else {
                    ibpMode = ibpData[0].mode.replace("г. ", "");
                }

                normalizeIbpData();
                processIbp(true);

                if (ibpData.length > 0) {
                    $("#ibp_count").html(getRegionTotalCount(ibpData[ibpData.length - 1].elements));
                } else {
                    $("#ibp_count").html(0);
                }

                ibpRegions.forEach((name, index) => {
                    if(ibpAdmin === 1 || name.toUpperCase().indexOf(ibpMode.toUpperCase()) >= 0) {
                        $("#ibp_regions").append("<option class='reg'>" + name + "</option>");
                    }
                });

                getIbpTopFive();

                $("#ibp_refresh").css("visibility", "visible");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7421809736986544030</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
            $("#ibp_wait").css("visibility", "hidden");

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
    $("#page1").append(getPage1IbpContent());

    for(let i = 1; i <= 12; i++) {
        $("#ibp_year" + i).html(ibpYear);
    }

    addIbpBox();

    $("#ibp_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            ibpMode = ui.item.value;

            processIbp(false);
        }
    });
});