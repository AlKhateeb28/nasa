function getPage2Content() {
    return `<div>
        <div id="pg2_regions_box" style="padding-top: 50px; padding-left: 5px;">
            <div class="float-left-box">
                <select id="pg2_regions" class="total">
                    <option value="0" selected="selected">Итого</option>
                </select>
            </div>
            <div id="mode_basic" class="float-left-box block page2-mode page2-mode" style="margin-top: 7px; margin-left: 7px; width: 80px; text-align: center;" onclick="changeViewMode2(0)">Базовый</div>
            <div id="mode_accumulation" class="float-left-box block page2-mode-view" onclick="changeViewMode2(1)">С накоплением</div>
        </div>
    </div>
    <div class="float-left-box main_box">
        <div class="float-left-box">
            <div class="block pg2-block1">
                <div class="block-header">Размещено курсов на платфоме</div>
                <div id="pg2_block2_value" class="block-value">0</div>
                <div id="pg2_block2_chart" style="margin-top: -10px;"></div>
            </div>
            <div class="block pg2-block2">
                <div class="block-header">Уникально обученных<br/></div>
                <div id="pg2_block1_value" class="block-value">0</div>
            </div>
        </div>
        <div class="float-left-box">
            <div class="block pg2-block4">
                <div class="block-header">
                    <div class="float-left-box">Назначено</div>
                    <div class="float-left-box page2-basic mode_caption">базовый</div>
                </div>
                <div id="pg2_block4_value" class="block-value">0</div>
                <div id="pg2_block4_chart" class="chart-block"></div>
            </div>
        </div>
        <div class="float-left-box">
            <div class="block pg2-block3">
                <div class="block-header">
                    <div class="float-left-box">В процессе</div>
                    <div class="float-left-box page2-basic mode_caption">базовый</div>
                </div>
                <div id="pg2_block3_value" class="block-value">0</div>
                <div id="pg2_block3_chart" class="chart-block"></div>
            </div>
        </div>
        <div class="float-left-box">
            <div class="block pg2-block5">               
                <div class="block-header">
                    <div class="float-left-box">Пройдено</div>
                    <div class="float-left-box page2-basic mode_caption">базовый</div>
                </div>
                <div id="pg2_block5_value" class="block-value" style="margin-top: 0px;">0</div>
                <div id="pg2_block5_remains" style="left: 90px; top: 90px; position: relative; margin-top: -16px; min-height: 17px;"></div>
                <div id="pg2_block5_chart" class="chart-block"></div>
            </div>
        </div>
        <div class="float-left-box">
            <div class="block pg2-block6">
                <div class="block-header">Доходимость</div>
                <div id="pg2_block6_chart" style="margin-left: -50px; margin-top: 60px;"></div>
            </div>
        </div>
    </div>          
        <div class="float-left-box" style="margin-top: 11px;">
            <table class="block" style="width: 390px;">
                <tr>
                    <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;">#</td> 
                    <td id="course_top5_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>                   
                </tr>
                <tr>
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">1</td> 
                    <td id="courses_top1_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="courses_top1_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="font-size: x-large;">2</td>
                    <td id="courses_top2_name" class="top5-cell"></td>
                    <td id="courses_top2_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">3</td>
                    <td id="courses_top3_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="courses_top3_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="font-size: x-large;">4</td>
                    <td id="courses_top4_name" class="top5-cell"></td>
                    <td id="courses_top4_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">5</td>
                    <td id="courses_top5_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="courses_top5_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr style="visibility: hidden"> 
                    <td colspan="3"></td>                   
                </tr>
            </table>
            <table class="block" style="width: 390px; margin-top: 50px;">
                <tr> 
                    <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;">#</td>
                    <td id="orgs_top5_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                </tr>
                <tr>
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">1</td> 
                    <td id="orgs_top1_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="orgs_top1_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="font-size: x-large;">2</td>
                    <td id="orgs_top2_name" class="top5-cell"></td>
                    <td id="orgs_top2_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">3</td>
                    <td id="orgs_top3_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="orgs_top3_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="font-size: x-large;">4</td>
                    <td id="orgs_top4_name" class="top5-cell"></td>
                    <td id="orgs_top4_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">5</td>
                    <td id="orgs_top5_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="orgs_top5_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td class="top5-cell" style="font-size: x-large;">6</td>
                    <td id="orgs_top6_name" class="top5-cell"></td>
                    <td id="orgs_top6_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr
                <tr> 
                    <td class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">7</td>
                    <td id="orgs_top7_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="orgs_top7_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>                
                <tr style="visibility: hidden"> 
                    <td colspan="3"></td>                   
                </tr>
            </table>
        </div>
        <div class="float-left-box" style="margin-top: 11px; margin-left: 18px;">
            <table class="block" style="width: 390px;">
                <tr> 
                    <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;">#</td>
                    <td id="regions_top5_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                </tr>
                <tr>
                    <td id="regions_top1_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">1</td> 
                    <td id="regions_top1_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="regions_top1_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="regions_top2_index" class="top5-cell" style="font-size: x-large;">2</td>
                    <td id="regions_top2_name" class="top5-cell"></td>
                    <td id="regions_top2_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="regions_top3_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">3</td>
                    <td id="regions_top3_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="regions_top3_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="regions_top4_index" class="top5-cell" style="font-size: x-large;">4</td>
                    <td id="regions_top4_name" class="top5-cell"></td>
                    <td id="regions_top4_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="regions_top5_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">5</td>
                    <td id="regions_top5_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="regions_top5_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr id="regions_top5_owner_row" style="visibility: hidden;"> 
                    <td id="regions_top6_index" class="top5-cell" style="font-size: x-large;"></td>
                    <td id="regions_top6_name" class="top5-cell"></td>
                    <td id="regions_top6_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>                                
            </table>
            <table class="block" style="width: 390px; margin-top: 50px">
                <tr> 
                    <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;">#</td>
                    <td id="support_top5_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                </tr>
                <tr>
                    <td id="support_top1_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">1</td> 
                    <td id="support_top1_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="support_top1_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="support_top2_index" class="top5-cell" style="font-size: x-large;">2</td>
                    <td id="support_top2_name" class="top5-cell"></td>
                    <td id="support_top2_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="support_top3_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">3</td>
                    <td id="support_top3_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="support_top3_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="support_top4_index" class="top5-cell" style="font-size: x-large;">4</td>
                    <td id="support_top4_name" class="top5-cell"></td>
                    <td id="support_top4_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>
                <tr> 
                    <td id="support_top5_index" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large;">5</td>
                    <td id="support_top5_name" class="top5-cell" style="background-color: #F1F1F1;"></td>
                    <td id="support_top5_value" class="top5-cell" style="background-color: #F1F1F1; font-size: x-large; text-align: end;"></td>
                </tr>
                <tr style="visibility: hidden;"> 
                    <td class="top5-cell" style="font-size: x-large;"></td>
                    <td class="top5-cell"></td>
                    <td class="top5-cell" style="font-size: x-large; text-align: end;"></td>
                </tr>                                
            </table>        
        </div>       
        <div class="float-left-box pg2-block-chart">
            <div class="page2-basic mode_caption block-header" style="position: absolute; margin-top: 30px; margin-left: 20px;">базовый</div>                   
            <div id="pg2_chart" class="float-left-box block"></div>
        </div>
    </div>`;
}

const blackNameList = [
    "ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ ГОРОДА МОСКВЫ ",
    "ОРДЕНА ЛЕНИНА И ОРДЕНА ТРУДОВОГО КРАСНОГО ЗНАМЕНИ ",
    "АКЦИОНЕРНОЕ ОБЩЕСТВО ",
    "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "
];

var page2Chart;
var block2Chart;
var block3Chart;
var block4Chart;
var block5Chart;
var block6Chart;

var fccStartYear = 2018;

var page2Data = {};
var page2RegionId = 0;

function reloadPage2() {
    // Dynamically load on tab click
    if(visitPage(2)) {
        $("#wait").css("visibility", "visible");

        sleep(1).then(r => page2Refresh(0));
    }
}

function getRegions() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7428923418845716087",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                data.forEach((element, index) => {
                    $("#pg2_regions").append("<option value='" + element.id + "'>" + element.name + "</option>");
                });
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

function getOption(data, color, width, height) {
    if(width === undefined) {
        width = 300;
    }
    if(height === undefined) {
        height = 150;
    }

    optionCategories = [];
    optionData = [];

    data.forEach((element, index) => {
        optionCategories.push(element.year);
        optionData.push(element.count);
    });

    return {
        series: [{
            color: color,
            data: optionData,
        }],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 99, 100],
                gradientToColors: ["#f5fffa"]
            }
        },
        chart: {
            animations: {enabled: false},
            width: width,
            height: height,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: true,
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
                foreColor: "#f5fffa"
            }
        },
        grid: {show: false, xaxis: {lines: {show: false}},yaxis: {lines: {show: false}}},
        tooltip: {enabled: false},
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            categories: optionCategories,
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "'Noto Sans', sans-serif"/*,
                    colors: getFccXAxisColors(getCurrentYear())*/
                }
            }
        },
        legend: {show: false},
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}}
    };
}

function getBlock6Option(value) {
    return {
        series: [value],
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            },
            width: 400
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    strokeWidth: '97%',
                    margin: 5,
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        color: '#999',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontWeight: "bold",
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        }
    };
}

function updateBlockChart(chartElement, chartBlockData, accumulationMode, dataLabelsColor) {
    if(dataLabelsColor === undefined) {
        dataLabelsColor = "#f5fffa";
    }

    let accumulationCount = 0;
    const charCategories = [];
    const charData = [];

    chartBlockData.forEach((element, index) => {

        if(accumulationMode) {
            accumulationCount += element.count;
        } else {
            accumulationCount = element.count;
        }

        charData.push(accumulationCount);
        charCategories.push(element.year);
    });

    chartElement.updateSeries([
        {data: charData}
    ]);

    chartElement.updateOptions({
        xaxis: {categories: charCategories},
        dataLabels: {
            background: {
                foreColor: dataLabelsColor
            }
        }
    });
}

function getBlockTotal(chartBlockData) {
    let result = 0;

    chartBlockData.forEach((element, index) => {
        result += element.count;
    });

    return result;
}

function updateBlock6Chart() {
    const block3Total = getBlockTotal(page2Data.block3Data);
    const block4Total = getBlockTotal(page2Data.block4Data);
    const block5Total = getBlockTotal(page2Data.block5Data);

    const total = ((block5Total + page2Data.block6Value) / (block3Total + block4Total + block5Total + page2Data.block6Value)) * 100;

    block6Chart.updateSeries([total.toFixed(2)]);
}

function updatePage2Chart(accumulationMode) {
    const values = [];
    const categories = [];
    let accumulationCount = 0;

    page2Data.chartData.forEach((element, index) => {
        if(accumulationMode) {
            accumulationCount += element.count;
        } else {
            accumulationCount = element.count;
        }

        values.push(accumulationCount);
        categories.push(element.month.toString().padStart(2, "0") + "." + element.year);
    });

    page2Chart.updateSeries([
        {data: values}
    ]);

    page2Chart.updateOptions({
        xaxis: {categories: categories}
    });
}

function updateOtherCharts(accumulationMode) {
    let totalValue = 0;
    page2Data.block3Data.forEach((element, index) => {
        totalValue += parseInt(element.count);
    });
    $("#pg2_block3_value").html(totalValue.toLocaleString());
    updateBlockChart(block3Chart, page2Data.block3Data, accumulationMode);

    totalValue = 0;
    page2Data.block4Data.forEach((element, index) => {
        totalValue += parseInt(element.count);
    });
    $("#pg2_block4_value").html(totalValue.toLocaleString());
    updateBlockChart(block4Chart, page2Data.block4Data, accumulationMode);

    totalValue = 0;
    page2Data.block5Data.forEach((element, index) => {
        totalValue += parseInt(element.count);
    });
    $("#pg2_block5_value").html(totalValue.toLocaleString());

    const remainsValue = totalValue - 1120000;

    const remainsElement = $("#pg2_block5_remains");
    remainsElement.html(remainsValue.toLocaleString());

    if(remainsValue === 0) {
        remainsElement.css("color", "black");
    } else if(remainsValue < 0) {
        remainsElement.css("color", "red");
    } else {
        remainsElement.css("color", "green");
    }

    updateBlockChart(block5Chart, page2Data.block5Data, accumulationMode, "#2f4f4f");

    updatePage2Chart(accumulationMode);
}

function updateTop5Courses() {
    for(let i = 0; i < 5; i++) {
        if(i + 1 <= page2Data.topCoursesData.length) {
            $("#courses_top" + (i + 1) + "_name").html(page2Data.topCoursesData[i].name);
            $("#courses_top" + (i + 1) + "_value").html(page2Data.topCoursesData[i].count);
        }

    }
}

function normalizeOrganisationName(name) {
    blackNameList.forEach((element, index) => {
        name = name.toUpperCase().replaceAll(element, "");
    });

    return name;
}

function updateTop7Organization() {
    for(let i = 0; i < 7; i++) {
        if(i + 1 <= page2Data.topOrgsData.length) {
            $("#orgs_top" + (i + 1) + "_name").html(
                normalizeOrganisationName(page2Data.topOrgsData[i].name)
            );
            $("#orgs_top" + (i + 1) + "_value").html(page2Data.topOrgsData[i].count);
        }

    }
}

function updateTop5Regions() {
    for(let i = 1; i <= 5; i++) {
        $("#regions_top" + i + "_index").css("color", "darkslategray");
        $("#regions_top" + i + "_name").css("color", "darkslategray");
        $("#regions_top" + i + "_value").css("color", "darkslategray");
    }

    const ownerElement = $("#regions_top5_owner_row");
    ownerElement.css("visibility", "hidden");

    const top6IndexElement = $("#regions_top6_index");
    top6IndexElement.empty();

    const top6NameElement = $("#regions_top6_name");
    top6NameElement.empty();

    const top6ValueElement = $("#regions_top6_value");
    top6ValueElement.empty();

    for(let i = 0; i < page2Data.topRegionData.length - 1; i++) {
        if (i + 1 <= 5) {
            const indexElement = $("#regions_top" + (i + 1) + "_index");
            const nameElement = $("#regions_top" + (i + 1) + "_name");
            const valueElement = $("#regions_top" + (i + 1) + "_value");

            nameElement.html(page2Data.topRegionData[i].name);
            valueElement.html(page2Data.topRegionData[i].count);

            if(page2RegionId !== 0 && page2Data.topRegionData[i].id === page2RegionId) {
                indexElement.css("color", "#008cff");
                nameElement.css("color", "#008cff");
                valueElement.css("color", "#008cff");
            }
        } else {
            if (page2RegionId !== 0 && page2Data.topRegionData[i].id === page2RegionId) {
                ownerElement.css("visibility", "visible");

                top6IndexElement.html(i + 1);
                top6IndexElement.css("color", "#008cff");

                top6NameElement.html(page2Data.topRegionData[i].name);
                top6NameElement.css("color", "#008cff");

                top6ValueElement.html(page2Data.topRegionData[i].count);
                top6ValueElement.css("color", "#008cff");
            }
        }
    }
}

function updateTop5Support() {
    for(let i = 0; i < 5; i++) {
        $("#support_top" + (i + 1) + "_name").html(page2Data.divisionData[i].name);
        $("#support_top" + (i + 1) + "_value").html(page2Data.divisionData[i].count);
    }
}

function page2Refresh(regionId) {
    page2RegionId = regionId;

    const basicElement = $("#mode_basic");

    $(".mode_caption").html("базовый");
    $("#mode_accumulation").removeClass("page2-mode");

    basicElement.removeClass("page2-mode");
    basicElement.addClass("page2-mode");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7428876886603078129&region_id=" + regionId,
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                page2Data = data;

                $("#pg2_block1_value").html(data.block1Value.toLocaleString());

                let totalValue = 0;
                page2Data.block2Data.forEach((element, index) => {
                    totalValue += parseInt(element.count);
                });
                $("#pg2_block2_value").html(totalValue);

                updateBlockChart(block2Chart, page2Data.block2Data, false);
                updateBlock6Chart();
                updateOtherCharts(false);
                updateTop5Courses();
                updateTop7Organization();
                updateTop5Regions();
                updateTop5Support();

                $("#wait").css("visibility", "hidden");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {
            showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
        }
    });
}

function changeViewMode2(mode) {
    const basicElement = $("#mode_basic");
    const accumulationElement = $("#mode_accumulation");

    if(mode === 0) {
        $(".mode_caption").html("базовый");

        basicElement.removeClass("page2-mode");
        accumulationElement.removeClass("page2-mode");

        basicElement.addClass("page2-mode");
        accumulationElement.addClass("page2-mode-view");

        updateOtherCharts(false);
    } else if(mode === 1) {
        $(".mode_caption").html("с накоплением");

        basicElement.removeClass("page2-mode");
        accumulationElement.removeClass("page2-mode");

        basicElement.addClass("page2-mode-view");
        accumulationElement.addClass("page2-mode");

        updateOtherCharts(true);
    }
}

$(document).ready(function () {
    initVisitPage(false);

    $("#page2").append(getPage2Content());

    const monthAndYearSuffix = getMonthAndYearSuffix();

    $("#course_top5_header").html("Топ 5. Курсы. " + monthAndYearSuffix);
    $("#orgs_top5_header").html("Топ 7. Организации. " + monthAndYearSuffix);
    $("#regions_top5_header").html("Топ 5. Регионы. " + monthAndYearSuffix);
    $("#support_top5_header").html("Топ 5. Тип поддержки. " + monthAndYearSuffix);

    $("#pg2_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled

            sleep(1).then(r => page2Refresh(ui.item.value));
        }
    });

    getRegions();

    initialData = [];
    for(let i = 2019; i<= getCurrentYear(); i++) {
        element = {}
        element.year = i;
        element.count = 0;

        initialData.push(element);
    }

    block2Chart = new ApexCharts($("#pg2_block2_chart").get(0), getOption(initialData, "#4a4fd4", 265, 100));
    block2Chart.render();

    block3Chart = new ApexCharts($("#pg2_block3_chart").get(0), getOption(initialData, "#ff0080"));
    block3Chart.render();

    block4Chart = new ApexCharts($("#pg2_block4_chart").get(0), getOption(initialData, "#ff8c00"));
    block4Chart.render();

    block5Chart = new ApexCharts($("#pg2_block5_chart").get(0), getOption(initialData, "#7cfc00"));
    block5Chart.render();

    block6Chart = new ApexCharts($("#pg2_block6_chart").get(0), getBlock6Option(0));
    block6Chart.render();

    page2Chart = new ApexCharts($("#pg2_chart").get(0), getPage1ChartOption());
    page2Chart.render();

    let values = [];
    let categories = [];

    for(let year = getCurrentYear(); year >= fccStartYear; year--) {
        for(let month = 12; month >= 1; month--) {
            values.unshift(0);
            categories.unshift(month.toString().padStart(2, "0") + "." + year);
        }
    }

    page2Chart.updateSeries([
        {
            name: "Пройденные курсы",
            color: "#9b0086",
            data: values
        }
    ]);

    page2Chart.updateOptions({
        chart: {
            width: 810,
            height: 500,
        },
        dataLabels: {
            offsetX: -2
        },
        grid: {
            padding: {
                left: 25,
                right: 20
            }
        },
        xaxis: {categories: categories}
    });
});