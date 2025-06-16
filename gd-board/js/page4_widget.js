var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var page4Chart;
var page4CoursesChart;

var page4Data = {};

var page4AccumulationData = {};
page4AccumulationData.state0Data = [];
page4AccumulationData.state1Data = [];
page4AccumulationData.state4Data = [];

var weekList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
    "51", "52", "53"
];

var currentMode = 0;

function getPage4Content() {
    return `
    <div style="width: 100%">
        <div class="card gd-board-caption-box" style="background: url(./images/banner02.png) no-repeat 1% / 101%; margin-top: 5.5%;">
                    <div class="gd-board-caption-header">
                        Материалы
                    </div>
        </div>
        <div style="margin-top: -50px;">
            <div class="float-left-box" style="width: 30%;">
                <div id="pg4_chart"></div>
            </div>
            <div id="pg4_mat_top" class="float-left-box" style="margin-left: 20px;">
                <table id="pg4_mat_table" class="block" style="width: 350px; margin-top: 50px">
                    <tr> 
                        <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange; width: 14px;">#</td>
                        <td id="pg4_mat_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                    </tr>
                </table>            
            </div>
            <div id="pg4_month_mat_top" class="float-left-box" style="margin-left: 20px;">
                <table id="pg4_mat_hour_table" class="block" style="width: 350px; margin-top: 50px">
                    <tr> 
                        <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange; width: 14px;">#</td>
                        <td id="pg4_month_mat_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                    </tr>
                </table>            
            </div>
            <div id="pg4_month_person_top" class="float-left-box" style="margin-left: 20px;">
                <table id="pg4_month_person_table" class="block" style="width: 350px; margin-top: 50px">
                    <tr> 
                        <td class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange; width: 14px;">#</td>
                        <td id="pg4_month_person_header" colspan="2" class="top5-header top5-cell" style="font-size: large; color: mintcream; background-color: darkorange;"></td>
                    </tr>
                </table>            
            </div>
        </div>
        
        <div class="card gd-board-caption-box" style="background: url(./images/banner02.png) no-repeat 1% / 101%; margin-top: 21%;">
            <div class="gd-board-caption-header">
                <div class="float-left-box">
                    Электронные курсы по неделям года
                </div>
            </div>
        </div>  
        <div>
            <div class="float-left-box" style="margin-left: 10px; width: 99%;">
                <div class="float-left-box">
                    Год
                </div>
                <div class="float-left-box" style="margin-left: 15px; margin-top: -5px;">
                    <select id="pg4_years" class="total">
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025" selected="selected">2025</option>
                    </select>               
                </div>
                <div class="float-left-box" style="margin-top: -6px; width: 92%;">
                    <div id="pg4_mode_basic" class="float-left-box prevent-select block page2-mode page2-mode-view" onclick="changeViewMode(0)">Базовый</div>
                    <div id="pg4_mode_accumulation" class="float-left-box prevent-select block page2-mode-view" onclick="changeViewMode(1)">С накоплением</div>
                    <div class= "float-left-box" style="margin-left: 8px; margin-top: 6px;">
                        <button type="button" class="btn-refresh" onclick="refreshCoursesOfWeekManually()">Обновить</button>
                    </div>
                    <div id="refreshed_datetime" class= "float-right-box" style="margin-right: 8px; margin-top: 6px; font-size: smaller; color: deeppink;">
                    </div>
                </div>
            </div> 
        </div>
        <div>
            <div id="pg4_courses_chart" style="margin-left: -10px; margin-top: 50px;"></div>
        </div>     
    </div> 
    <script type="text/html" id="pg4_row_template">
        <tr> 
            <td id="pg4_row_index" class="top5-cell" style="font-size: x-large;">2</td>
            <td id="pg4_row_name" class="top5-cell"></td>
            <td id="pg4_row_value" class="top5-cell" style="font-size: x-large; text-align: end;"></td>
        </tr>
    </script>`;
}

function reloadPage4() {
    // Dynamically load on tab click
    if(visitPage(4)) {
        $("#wait").css("visibility", "visible");

        sleep(1).then(r => page4Refresh());
    }
}

function refreshCoursesOfWeekManually() {
    page4CoursesOfWeekRefresh();

    changeViewMode(currentMode);

    $("#refreshed_datetime").html(getCurrentDateTime());
}

function createAccumulationData(courseArray, accumulationArray) {
    let accumulationCount = 0;

    courseArray.forEach((data, index) => {
        element = {};
        element.week = data.week;
        element.count = data.count + accumulationCount;

        accumulationArray.push(element);

        accumulationCount = element.count;
    });
}

function changeViewMode(mode) {
    const basicElement = $("#pg4_mode_basic");
    const accumulationElement = $("#pg4_mode_accumulation");

    if(mode === 0) {
        currentMode = 0;

        basicElement.removeClass("page2-mode");
        accumulationElement.removeClass("page2-mode");

        basicElement.addClass("page2-mode");

        page4CoursesChart.updateSeries([
            {data: getCoursesOfWeekList(page4Data.state0Data)},
            {data: getCoursesOfWeekList(page4Data.state1Data)},
            {data: getCoursesOfWeekList(page4Data.state4Data)}
        ]);
    } else if(mode === 1) {
        currentMode = 1;

        basicElement.removeClass("page2-mode");
        accumulationElement.removeClass("page2-mode");

        accumulationElement.addClass("page2-mode");

        page4CoursesChart.updateSeries([
            {data: getCoursesOfWeekList(page4AccumulationData.state0Data)},
            {data: getCoursesOfWeekList(page4AccumulationData.state1Data)},
            {data: getCoursesOfWeekList(page4AccumulationData.state4Data)}
        ]);
    }
}

function getCoursesOfWeekList(list) {
    clearedWeelData = [];

    for(let i = 0; i < 53; i++) {
        clearedWeelData.push(0);
    }

    list.forEach((element, index) => {
        clearedWeelData[element.week - 1] = element.count;
    });

    return clearedWeelData;
}

function refreshCoursesOfWeek() {
    page4CoursesChart.updateSeries([
        {data: getCoursesOfWeekList(page4Data.state0Data)},
        {data: getCoursesOfWeekList(page4Data.state1Data)},
        {data: getCoursesOfWeekList(page4Data.state4Data)}
    ]);
}

function page4Refresh() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7100353776568465126&year=" + $("#pg4_years").val(),
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                page4Data = data;

                createAccumulationData(page4Data.state0Data, page4AccumulationData.state0Data);
                createAccumulationData(page4Data.state1Data, page4AccumulationData.state1Data);
                createAccumulationData(page4Data.state4Data, page4AccumulationData.state4Data);

                updatePage4Chart();
                refreshTop5Material();
                refreshTop5MonthMaterial();
                refreshTop5MonthPerson();
                refreshCoursesOfWeek();

                $("#wait").css("visibility", "hidden");

                $("#refreshed_datetime").html(getCurrentDateTime());
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

function page4CoursesOfWeekRefresh() {
    const waitElement = $("#wait");

    waitElement.css("visibility", "visible");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7164719528758835695&year=" + $("#pg4_years").val(),
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                $(".page2-mode-view").removeClass("page2-mode");
                $("#pg4_mode_basic").addClass("page2-mode");

                page4Data = data;

                refreshCoursesOfWeek();

                page4AccumulationData.state0Data  = [];
                page4AccumulationData.state1Data  = [];
                page4AccumulationData.state4Data  = [];

                createAccumulationData(page4Data.state0Data, page4AccumulationData.state0Data);
                createAccumulationData(page4Data.state1Data, page4AccumulationData.state1Data);
                createAccumulationData(page4Data.state4Data, page4AccumulationData.state4Data);

                waitElement.css("visibility", "hidden");

                $("#refreshed_datetime").html(getCurrentDateTime());
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

function updatePage4Chart() {
    const charCategories = [];
    const charData = [];

    page4Data.categoriesData.forEach((element, index) => {
        charCategories.push(element.padStart(7, "0"));
    });

    page4Data.chartData.forEach((element, index) => {
        charData.push(element.count);
    });

    page4Chart.updateSeries([
        {data: charData}
    ]);

    page4Chart.updateOptions({
        xaxis: {categories: charCategories}
    });
}

function getPage4ChartOption() {
    return {
        series: [{
            name: "ФЦК",
            data: []
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
        grid: {
            borderColor: "#d2d1d1",
            padding: {
                top: 15
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "'Noto Sans', sans-serif"
                }
            }
        },
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}},
        legend: {
            labels: {
                colors: ["darkslategray"]
            }
        }
    };
}

function getPage4CoursesChartOption() {
    return {
        series: [{
                name: "Назначено",
                color: "#ff9719",
                data: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0
                ]
            },
            {
                name: "В процессе",
                color: "#ff198c",
                data: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0
                ]
            },
            {
                name: "Пройдено",
                color: "#89fc19",
                data: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0
                ]
            }
        ],
        /*fill: {
            type: "solid",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 99, 100],
                gradientToColors: ["#f5fffa"]
            }
        },*/
        chart: {
            type: "area",
            height: 600,
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: true,
            offsetX: -3,
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
                foreColor: "#000000"
            }
        },
        grid: {
            borderColor: "#d2d1d1",
            padding: {
                top: 15
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            position: "bottom",
            categories: weekList,
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "'Noto Sans', sans-serif"
                }
            }
        },
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}},
        legend: {
            labels: {
                colors: ["darkslategray"]
            }
        }
    };
}

function refreshTop5Material() {
    $("#pg4_mat_header").html("Топ 5. Материалы");

    page4Data.materialData.forEach((element, index) => {
        $("#pg4_mat_table").append(template("pg4_row_template"));

        $("#pg4_row_index").attr("id", "pg4_row_index_mat_" + index);
        $("#pg4_row_index_mat_" + index).html(index + 1);

        $("#pg4_row_name").attr("id", "pg4_row_name_mat_" + index);
        $("#pg4_row_name_mat_" + index).html(element.name.replaceAll("_", " ").replace(" ", ":"));

        $("#pg4_row_value").attr("id", "pg4_row_value_mat_" + index);
        $("#pg4_row_value_mat_" + index).html(element.count);
    });
}

function refreshTop5MonthMaterial() {
    $("#pg4_month_mat_header").html("Топ 5. Материалы. " + getMonthAndYearSuffix());

    page4Data.materialMonthData.forEach((element, index) => {
        $("#pg4_mat_hour_table").append(template("pg4_row_template"));

        $("#pg4_row_index").attr("id", "pg4_row_index_mat_hour_" + index);
        $("#pg4_row_index_mat_hour_" + index).html(index + 1);

        $("#pg4_row_name").attr("id", "pg4_row_name_mat_hour_" + index);
        $("#pg4_row_name_mat_hour_" + index).html(element.name.replaceAll("_", " ").replace(" ", ":"));

        $("#pg4_row_value").attr("id", "pg4_row_value_mat_hour_" + index);
        $("#pg4_row_value_mat_hour_" + index).html(element.count);
    });
}

function refreshTop5MonthPerson() {
    $("#pg4_month_person_header").html("Топ 5. Сотрудники. " + getMonthAndYearSuffix());

    page4Data.personMonthData.forEach((element, index) => {
        $("#pg4_month_person_table").append(template("pg4_row_template"));

        $("#pg4_row_index").attr("id", "pg4_row_index_person_hour_" + index);
        $("#pg4_row_index_person_hour_" + index).html(index + 1);

        $("#pg4_row_name").attr("id", "pg4_row_name_person_hour_" + index);
        $("#pg4_row_name_person_hour_" + index).html(element.name.replaceAll("_", " ").replace(" ", ":"));

        $("#pg4_row_value").attr("id", "pg4_row_value_person_hour_" + index);
        $("#pg4_row_value_person_hour_" + index).html(element.count);
    });
}

$(document).ready(function () {
    initVisitPage(false);

    $("#page4").append(getPage4Content());

    page4Chart = new ApexCharts($("#pg4_chart").get(0), getPage4ChartOption());
    page4Chart.render();

    let values = [];
    let categories = [];

    for(let year = getCurrentYear(); year >= fccStartYear; year--) {
        for(let month = 12; month >= 1; month--) {
            values.unshift(0);
            categories.unshift(month.toString().padStart(2, "0") + "." + year);
        }
    }

    page4Chart.updateSeries([
        {
            name: "Мероприятия",
            color: "#4a4fd4",
            data: values
        }
    ]);

    page4Chart.updateOptions({
        /*chart: {
            width: 1200,
            height: 850,
        },*/
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

    $("#pg4_years").selectmenu({
        width: 100,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            //sleep(1).then(r => page2Refresh(ui.item.value));

            sleep(1).then(r => page4CoursesOfWeekRefresh());
        }
    });

    page4CoursesChart = new ApexCharts($("#pg4_courses_chart").get(0), getPage4CoursesChartOption());
    page4CoursesChart.render();
});
