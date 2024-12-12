var page4Chart;

var page4Data = {};

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

function page4Refresh() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7100353776568465126",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                page4Data = data;

                updatePage4Chart();
                refreshTop5Material();
                refreshTop5MonthMaterial();
                refreshTop5MonthPerson();

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
});

//"Book_Tom Cruze_1.0".replaceAll("_", " ").replace(" ", ":");