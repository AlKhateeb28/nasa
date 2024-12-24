var page3Region = 0;
var page3CertType = 0;
var page3CertSerial = 0;

var page3Chart;
var page3Data = {};

var page3StartYear = 2018;

function getPage3Content() {
    return `
    <div>
        <div id="pg3_regions_box" style="padding-top: 50px; padding-left: 5px;">
            <div class="float-left-box">
                <div class="float-left-box" style="margin-top: 7px; padding-right: 10px;">Регион:</div>
                <div class="float-left-box">
                    <select id="pg3_regions" class="total">
                        <option value="0" selected="selected">Итого</option>
                    </select>
                </div>
            </div>
            
            <div class="float-left-box">
                <div class="float-left-box" style="margin-top: 7px; padding-left: 10px; padding-right: 10px;">Тип сертификата:</div>
                <div class="float-left-box">
                    <select id="pg3_cert_type" class="total">
                        <option value="0" selected="selected">Все</option>
                    </select>
                </div>
            </div>
            
            <div class="float-left-box">
                <div class="float-left-box" style="margin-top: 7px; padding-left: 10px; padding-right: 10px;">Серия сертификата:</div>
                <div class="float-left-box">
                    <select id="pg3_cert_serial" class="total">
                        <option value="0" selected="selected">Все</option>
                        <option value="CK">CK</option>
                        <option value="ВТ">ВТ</option>
                        <option value="Д">Д</option>
                        <option value="К">К</option>
                        <option value="РК">РК</option>
                        <option value="РП">РП</option>
                        <option value="СК">СК</option>
                        <option value="СК-2024-">СК-2024-</option>
                        <option value="Т">Т</option>
                        <option value="Т7162/2021">Т7162/2021</option>
                        <option value="У">У</option>
                        <option value="ШК">ШК</option>
                        <option value="ЭК">ЭК</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div style="padding-left: 20px;">
        <div id="page3_chart" class="float-left-box block"></div>
    </div>`;
}

function reloadPage3() {
    // Dynamically load on tab click
    if(visitPage(3)) {
        $("#wait").css("visibility", "visible");

        sleep(1).then(r => page3Refresh());
        //page2Refresh(0);
    }
}

function updatePage3Chart(dataLabelsColor) {
    if(dataLabelsColor === undefined) {
        dataLabelsColor = "#f5fffa";
    }

    const charCategories = [];
    const charData = [];

    page3Data.forEach((element, index) => {
        charData.push(element.count);
        charCategories.push(element.month.toString().padStart(2, "0") + "." + element.year);
    });

    page3Chart.updateSeries([
        {data: charData}
    ]);

    page3Chart.updateOptions({
        xaxis: {categories: charCategories},
        dataLabels: {
            background: {
                foreColor: dataLabelsColor
            }
        }
    });
}

function page3Refresh() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7106651538719735074&region_id=" + page3Region + "&type_id=" + page3CertType + "&serial=" + page3CertSerial,
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                page3Data = data.chartData;

                updatePage3Chart();

                $("#wait").css("visibility", "hidden");
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {}
    });
}

function getPage3Regions() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7428923418845716087",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                data.forEach((element, index) => {
                    $("#pg3_regions").append("<option value='" + element.id + "'>" + element.name + "</option>");
                });
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {}
    });
}

function getPage3CertTypes() {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7106644233027277547",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.indexOf("#") < 0) {
                data.forEach((element, index) => {
                    $("#pg3_cert_type").append("<option value='" + element.id + "'>" + element.name + "</option>");
                });
            } else {
                showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                    "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
            }
        },
        error: function() {}
    });
}

$(document).ready(function () {
    initVisitPage(false);

    $("#page3").append(getPage3Content());

    $("#pg3_regions").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            page3Region = ui.item.value;

            sleep(1).then(r => page3Refresh());
        }
    });

    $("#pg3_cert_type").selectmenu({
        width: 400,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            page3CertType = ui.item.value;

            sleep(1).then(r => page3Refresh());
        }
    });

    $("#pg3_cert_serial").selectmenu({
        width: 100,
        change: function (event, ui) {
            //ui.index, ui.value, ui.label, ui.hidden, ui.disabled
            page3CertSerial = ui.item.value;

            sleep(1).then(r => page3Refresh());
        }
    });

    getPage3Regions();
    getPage3CertTypes();

    page3Chart = new ApexCharts($("#page3_chart").get(0), getPage1ChartOption());
    page3Chart.render();

    let values = [];
    let categories = [];

    for(let year = getCurrentYear(); year >= page3StartYear; year--) {
        for(let month = 12; month >= 1; month--) {
            values.unshift(0);
            categories.unshift(month.toString().padStart(2, "0") + "." + year);
        }
    }

    page3Chart.updateSeries([
        {
            name: "Сертификаты",
            color: "#211f54",
            data: values
        }
    ]);

    page3Chart.updateOptions({
        chart: {
            width: 1600,
            height: 700,
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