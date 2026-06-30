let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
//sleep(1000).then(r => r);

let notification = null;

const isPage1Visited = true;
let isPage2Visited = false;
let isPage3Visited = false;
let isPage4Visited = false;

let alertPopupWindow = null;

let isGlobalDefragStarted = false;
let isSingleDefragStarted = false;
let timerId = null;
let processingTimerId = null;
let statisticTimerId = null;

let selectedTable = "";
let selectedIndex = "";
let selectedRowIndex = null;

let chart;

let selectedTabIndex = 1;

let reorganizeButtonStatus = 0; // 0 - Отжата, 1 - Нажата
let rebuildButtonStatus = 0; // 0 - Отжата, 1 - Нажата

function getChartOption() {
    return {
        series: [
            {
                name: "NOFRAGMENTED",
                color: "#05b113",
                data: []
            },
            {
                name: "REORGANIZE",
                color: "#a08b18",
                data: []
            },
            {
                name: "REBUILD",
                color: "#da0909",
                data: []
            },
            {
                name: "Fragmentation",
                color: "#4a4fd4",
                data: []
            }
        ],
        chart: {
            type: "area",//"line",
            width: 440,
            height: 170,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "Finlandica, sans-serif",
        },
        stroke: {
            width: 4,
            curve: "smooth"
        },
        dataLabels: {
            enabled: false,
            fontWeight: "normal",
        },
        grid: {
            show: false,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: false } }
        },
        xaxis: {
            position: "bottom",
            categories: [],
            axisBorder: { show: true },
            axisTicks: { show: true },
            tooltip: { enabled: false },
            labels: {
                show: false,
            }
        },
        yaxis: {
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: { show: false },
            lines: { show: false }
        },
        legend: {
            show: true,
            labels: {
                colors: "#000000"
            }
        },
        tooltip: {
            enabled: true,
            theme: "dark"
        }
    };
}

const SUCCESS_SVG = '<svg width="25px" height="25px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> ' +
    '<title>success-filled</title> ' +
    '<g id="Page-1" stroke="none" stroke-width="1" fill="#1f7a45" fill-rule="evenodd" > ' +
    '<g id="add-copy-2" fill="#1f7a45" transform="translate(42.666667, 42.666667)" > ' +
    '<path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z" id="Shape"> ' +
    '</path></g></g></svg>';

const FAILURE_SVG = '<svg fill="#fc0303" width="25px" height="25px" viewBox="0 -8 528 528" xmlns="http://www.w3.org/2000/svg" >' +
    '<title>fail</title><path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 ' +
    '110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168' +
    ' 192 232 256 168 320 200 352 264 288Z" /></svg>';

const BLANK_SVG = '<svg fill="#ffffff" width="15px" height="15px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
    '< title > up</title>' +
    '<path d="M11.25 15.688l-7.656 7.656-3.594-3.688 11.063-11.094 11.344 11.344-3.5 3.5z"></path>'
'</svg> ';

const UP_SVG = '<svg fill="#000000" width="15px" height="15px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
    '< title > up</title>' +
    '<path d="M11.25 15.688l-7.656 7.656-3.594-3.688 11.063-11.094 11.344 11.344-3.5 3.5z"></path>'
'</svg> ';

const DOWN_SVG = '<svg fill="#000000" width="15px" height="15px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
    '< title > down</title>' +
    '<path d="M11.125 16.313l7.688-7.688 3.594 3.719-11.094 11.063-11.313-11.313 3.5-3.531z"></path>' +
    '</svg>';

const organizeSVG = '<svg fill="#fa9804" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'viewBox = "0 0 512 512" enable - background="new 0 0 512 512" xml: space = "preserve" ><title>REORGANIZE</title>' +
    '<path d="M341.3,0v85.3h-64c-70.7,0-128,57.3-128,128v85.3c0,35.4-28.6,64-64,64H0v64h85.3c70.7,0,128-57.3,128-128v-85.3' +
    'c0-35.4,28.6-64,64-64h64v85.3L512,128v-21.3L341.3,0z M114,156.4l37.6-52.1c-19.4-11.8-42-19-66.3-19H0v64h85.3' +
    'C95.7,149.3,105.3,152,114,156.4z M341.3,362.7h-64c-10.4,0-20-2.7-28.7-7.1L211,407.7c19.4,11.8,42,19,66.3,19h64V512L512,405.3' +
    'V384L341.3,277.3L341.3,362.7L341.3,362.7z"/>' +
    '</svg>';

const buildSVG = '<svg fill="#f80505" width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>REBUILD</title>' +
    '<path d="M469.54,120.52h0a16,16,0,0,0-25.54-4L382.56,178a16.12,16.12,0,0,1-22.63,0L333.37,151.4a16,16,0,0,1,0-22.63l61.18-61.19a16,16,0,0,0-4.78-25.92h0C343.56' +
    ',21,285.88,31.78,249.51,67.88c-30.9,30.68-40.11,78.62-25.25,131.53a15.89,15.89,0,0,1-4.49,16L53.29,367.46a64.17,64.17,0,1,0,90.6,90.64L297.57,291.25a15.9,15.9,0,' +
    '0,1,15.77-4.57,179.3,179.3,0,0,0,46.22,6.37c33.4,0,62.71-10.81,83.85-31.64C482.56,222.84,488.53,157.42,469.54,120.52ZM99.48,447.15a32,32,0,1,1,28.34-28.35A32,32,0' +
    ',0,1,99.48,447.15Z" /></svg>';

const whiteSVG = '<svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>REBUILD</title>' +
    '<path d="M469.54,120.52h0a16,16,0,0,0-25.54-4L382.56,178a16.12,16.12,0,0,1-22.63,0L333.37,151.4a16,16,0,0,1,0-22.63l61.18-61.19a16,16,0,0,0-4.78-25.92h0C343.56' +
    ',21,285.88,31.78,249.51,67.88c-30.9,30.68-40.11,78.62-25.25,131.53a15.89,15.89,0,0,1-4.49,16L53.29,367.46a64.17,64.17,0,1,0,90.6,90.64L297.57,291.25a15.9,15.9,0,' +
    '0,1,15.77-4.57,179.3,179.3,0,0,0,46.22,6.37c33.4,0,62.71-10.81,83.85-31.64C482.56,222.84,488.53,157.42,469.54,120.52ZM99.48,447.15a32,32,0,1,1,28.34-28.35A32,32,0' +
    ',0,1,99.48,447.15Z" /></svg>';

const runningBox = `
    <div class="statistic scrollbar-control" style="height: 151px; width: 450px; background-color: #e0e0e0;">
        <div id="running_block">
        </div>
    </div>
`;

const goToIndexInfoSVG = `
    <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Go to table's indexes info</title><desc>Created with Sketch.</desc><defs></defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-380.000000, -7439.000000)" fill="#2261e9"><g id="icons" transform="translate(56.000000, 160.000000)">
            <path d="M338.858,7294.401 C337.26,7294.401 336.74,7293.157 337.151,7291.76 L337.744,7289.64 C338.022,7288.735 337.715,7287.897 336.756,7287.897 C335.911,7287.897 335.354,7288.361 335.067,7289.529 L333.917,7294 L331.905,7294 L332.266,7292.692 C331.675,7293.664 330.853,7294.337 329.84,7294.337 C328.28,7294.337 327.794,7293.242 328.151,7291.723 L329.067,7288 L327.648,7288 L328.079,7286 L331.493,7286 L330.145,7291.548 C329.986,7292.151 329.855,7292.889 330.451,7293.023 C330.611,7293.059 331.888,7293.061 332.583,7291.516 L333.468,7288 L332.031,7288 L332.462,7286 L335.534,7286 L335.139,7288.008 C335.678,7287.002 336.756,7286.147 337.816,7286.147 C339.542,7286.147 340.266,7287.923 339.685,7289.885 L339.11,7291.963 C338.754,7293.39 339.788,7293.58 340.439,7291.777 L341.23,7292.083 C340.762,7293.718 339.918,7294.401 338.858,7294.401 M330.684,7282.885 C331.349,7282.885 331.906,7283.406 331.906,7284.088 C331.906,7284.771 331.349,7285.292 330.684,7285.292 C330.019,7285.292 329.463,7284.771 329.463,7284.088 C329.463,7283.406 330.019,7282.885 330.684,7282.885 M342.187,7279 L325.813,7279 C324.812,7279 324,7279.811 324,7280.813 L324,7297.187 C324,7298.188 324.812,7299 325.813,7299 L342.187,7299 C343.188,7299 344,7298.188 344,7297.187 L344,7280.813 C344,7279.811 343.188,7279 342.187,7279" id="invision-[#166]"></path>
        </g></g></g>
    </svg>
`;

function stringToDate(str) {
    const parts = str.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
}

function daysDiff(date1, date2) {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor((utc2 - utc1) / oneDay);
}

function formatDateDiff(date1, date2) {
    let diff = Math.abs(date2 - date1);

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return formatted;
}

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

function initializePage0() {

    $("#stat_frag_svg").html(BLANK_SVG);
    $("#stat_size_svg").html(BLANK_SVG);
    $("#stat_space_svg").html(BLANK_SVG);
    $("#stat_page_count_svg").html(BLANK_SVG);
    $("#stat_record_count_svg").html(BLANK_SVG);

    chart = new ApexCharts($("#chart").get(0), getChartOption());
    chart.render();

    $("#go_to_table_index_svg").html(goToIndexInfoSVG);

    getIndexes();
}

const BASE_1_TIME_SECONDS = 10;
const BASE_2_TIME_SECONDS = 15;
const BASE_3_TIME_SECONDS = 5;
const BASE_4_TIME_SECONDS = 20;
const BASE_5_TIME_SECONDS = 14;

function estimateQueryTime(frag, weights, baseTime) {
    const w = weights || defaultWeights;
    const baseFrag = 5;

    function calcSlowdown(fragPercent) {
        return fragPercent / baseFrag;
    }

    let totalSlowdown = 0;

    for (const [table, fragValue] of Object.entries(frag)) {
        if (weights[table] !== undefined) {
            const slowdown = calcSlowdown(fragValue);
            totalSlowdown += weights[table] * slowdown;
        }
    }

    return baseTime * totalSlowdown;
}

function getIndexes() {
    $("#coll_to_reg").empty();
    $("#event_to_reg").empty();
    $("#active_learning_to_os").empty();
    $("#learning_to_os").empty();
    $("#trash_docs").empty();

    $("#reorganize_count").html(0);
    $("#rebuild_count").html(0);
    $("#deleted_count").html(0);

    $("#up_reorgnize_button").css("display", "none");
    $("#up_rebuild_button").css("display", "none");

    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7288243525935543905",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const indexBodyElement = $("#index_body");
                indexBodyElement.empty();

                $("#total_index_count").html(data.indexes.length);

                total_table_count
                let tableName = "";
                let tableCount = "";

                let reorganizeCount = 0;
                let rebuildCount = 0;
                let canBeDeletedCount = 0;

                const dayPassed = daysDiff(stringToDate(data.startDate), new Date());
                
                $("#sql_start_time").html(data.startDate + " (" + dayPassed + " days)");

                data.indexes.forEach((element, index) => {
                    if (tableName !== element.table) {
                        tableName = element.table

                        tableCount++;
                    }

                    indexBodyElement.append(getTemplate("row_template"));

                    $("#row").attr("id", "row_" + index);
                    $("#row_" + index).attr("data-index", index);
                    if ((element.columnType === "varchar" || element.columnType === "nvarchar") && element.columnLength !== null &&
                        (parseInt(element.columnLength) === -1 || parseInt(element.columnLength) === 900)) {
                        $("#row_" + index).addClass("varchar-type");
                    }

                    if (element.table === "group_collaborators") {
                        $("#row_" + index).css("background-color", "#ff7f50");
                    }

                    $("#delete_svg").attr("id", "delete_svg_" + index);
                    if(element.seeks === 0 && element.lookups === 0) {
                        $("#delete_svg_" + index).css("display", "block");
                        canBeDeletedCount++;
                    }

                    $("#go_to_index_info").attr("id", "go_to_index_info_" + index);
                    $("#go_to_index_info_" + index).attr("data-index", index);

                    $("#go_to_index_info_" + index).html(goToIndexInfoSVG);

                    $("#checkbox").attr("id", "checkbox_" + index);
                    $("#checkbox_" + index).append(getTemplate("row_checkbox"));

                    $("#row_check").attr("id", "row_check_" + index);
                    $("#row_check_" + index).attr("data-name", element.table);
                    $("#row_check_" + index).attr("data-index", index);

                    $("#table").attr("id", "table_" + index);
                    $("#table_" + index).html(element.table);                 

                    $("#index").attr("id", "index_" + index);
                    $("#index_" + index).html(element.index);

                    $("#type").attr("id", "type_" + index);
                    $("#type_" + index).html(element.type);

                    if (element.type === "HEAP") {
                        $("#row_" + index).css("color", "#ff00ff");
                    }

                    $("#field").attr("id", "field_" + index);
                    $("#field_" + index).html(element.field);

                    $("#organize_svg").attr("id", "organize_svg_" + index);

                    const frag = parseInt(element.frag);
                    $("#frag").attr("id", "frag_" + index);

                    $("#frag_" + index).html(element.frag);
                    $("#frag_" + index).removeClass("bold");
                    if (frag < 30) {
                        $("#organize_svg_" + index).html(organizeSVG);

                        reorganizeCount++;                        
                    } else {
                        $("#organize_svg_" + index).html(buildSVG);

                        rebuildCount++;
                    }

                    $("#size").attr("id", "size_" + index);
                    $("#size_" + index).html(parseFloat(element.size).toLocaleString("ru-RU"));

                    $("#processing").attr("id", "processing_" + index);

                    $("#result").attr("id", "result_" + index);

                    $("#result_code").attr("id", "result_code_" + index);

                    $("#run_time").attr("id", "run_time_" + index);
                });

                $("#total_table_count").html(tableCount);

                $("#reorganize_count").html(reorganizeCount);
                $("#rebuild_count").html(rebuildCount);
                $("#deleted_count").html(canBeDeletedCount);                

                getCollOrgRegBundle();

                $("#up_reorgnize_button").css("display", "block");
                $("#up_rebuild_button").css("display", "block");
            } else {
                //messageElement.css("color", "hotpink");
                //messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                $("#coll_to_reg").empty();
                $("#event_to_reg").empty();

                $("#up_reorgnize_button").css("display", "block");
                $("#up_rebuild_button").css("display", "block");

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

            $("#up_reorgnize_button").css("display", "block");
            $("#up_rebuild_button").css("display", "block");

            console.log("Error");
            console.log(error);
            //onError(7257828458375147659);
        }
    });
}

function beforeReload() {
    //$("#loader").css("visibility", "visible");
    $("#wait_caption").html("Загружаем...")
    $("#wait").css("display", "block");
}

function afterReload() {
    //$("#loader").css("visibility", "hidden");
    $("#wait").css("display", "none");
}

function onRowCheckBoxChange(event) {
    const checkboxElement = $("#" + event.currentTarget.id);

    if (event.currentTarget.checked) {
        $("#" + event.currentTarget.id).addClass("selected");

        $("#row_" + checkboxElement.attr("data-index")).addClass("will-start");

        const tableName = checkboxElement.attr("data-name");

        checkUncheckByTable(tableName, true);

        $(".row_with_checkbox").each((index, checkbox) => {
            if (!$(checkbox).prop("checked")) {
                $(checkbox).prop("disabled", true)
            }
        });
    } else {
        $("#" + event.currentTarget.id).removeClass("selected");

        $("#row_" + checkboxElement.attr("data-index")).removeClass("will-start");

        const tableName = checkboxElement.attr("data-name");

        checkUncheckByTable(tableName, false);

        $(".row_with_checkbox").each((index, checkbox) => {
            $(checkbox).prop("disabled", false)
        });
    }

    setSelectedCheckboxCount();
}

function checkUncheckByTable(tableName, checked) {
    $(".row_with_checkbox").each((index, checkbox) => {
        if ($(checkbox).attr("data-name") === tableName) {
            if (!$(checkbox).prop("disabled")) {
                $(checkbox).prop("checked", checked);

                const rowElement = $("#row_" + $(checkbox).attr("data-index"));

                if(checked) {
                    if (!rowElement.hasClass("will-start")) {
                        rowElement.addClass("will-start");
                    }
                } else {
                    rowElement.removeClass("will-start");
                }
            }
        }
    });
}

function removeNotification() {
    $("#stickyNotification").remove();

    notification = null;

    console.log("Startd disable");

    $(".row_with_checkbox").each((index, checkbox) => {
        console.log("disabled");
        $(checkbox).prop("disabled", false)
    });
}

function validateFragProcesses() {
    let startedCount = 0;

    $(".will-start").each((index, row) => {
        startedCount++;
    });

    console.log("startedCount: " + startedCount);

    if (startedCount === 0) {1
        removeNotification();
    }
}

function startGlobalDefrag() {
    isGlobalDefragStarted = true;

    timerId = setInterval(startSingleDefrag, 2000);

    notification = new Notification(runningBox, 4, null, "Defragmentation process(es)");

    notification.show();

    $("#stickyNotification").css("width", "452px");
    $("#stickyNotification").css("height", "185px");
    $("#stickyNotification").css("right", "10px");
    $("#stickyNotification").css("bottom", "40px");

    //processingTimerId = setInterval(validateFragProcesses, 1000);
}

function startSingleDefrag() {
    if (isSingleDefragStarted) {
        return;
    }

    const indexInfo = getNextDefragIndex();

    if (indexInfo === null) {
        clearTimeout(timerId);

        isSingleDefragStarted = false;
        isGlobalDefragStarted = false;

        return;
    }

    isSingleDefragStarted = true;

    $("#processing_" + indexInfo.rowIndex).css("display", "block");
    $("#result_" + indexInfo.rowIndex).empty();
    $("#result_code_" + indexInfo.rowIndex).empty();

    $("#running_block").append(getTemplate("process_template"));

    $("#process").attr("id", "process_" + indexInfo.rowIndex);

    $("#running_table").attr("id", "running_table_" + indexInfo.rowIndex);
    $("#running_table_" + indexInfo.rowIndex).html(indexInfo.table);

    $("#running_index").attr("id", "running_index_" + indexInfo.rowIndex);
    $("#running_index_" + indexInfo.rowIndex).html(indexInfo.index);

    const start = new Date();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7288311374876600612&table=" + indexInfo.table + "&index=" + indexInfo.index + "&frag=" + indexInfo.frag,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#row_" + indexInfo.rowIndex).removeClass("will-start");

            $("#processing_" + indexInfo.rowIndex).css("display", "none");

            if (data.errorMessage.indexOf("#") < 0) {
                $("#result_" + indexInfo.rowIndex).empty();

                if (parseInt(data.errorCode) == 0) {
                    $("#frag_" + indexInfo.rowIndex).html(data.frag + " (" + $("#frag_" + indexInfo.rowIndex).html() + ")");

                    const svgElement = $("#organize_svg_" + indexInfo.rowIndex);

                    const frag = parseInt(data.frag);

                    if (frag < 5) {
                        svgElement.empty();
                    } else if (frag >= 5 && frag <= 30) {
                        svgElement.html(organizeSVG);
                    } else {
                        svgElement.html(buildSVG);
                    }

                    /*$("#frag_" + indexInfo.rowIndex).removeClass("bold");
                    if (frag >= 30) {
                        $("#frag_" + indexInfo.rowIndex).addClass("bold");
                    }*/

                    $("#result_" + indexInfo.rowIndex).html(SUCCESS_SVG);

                    $("#row_check_" + indexInfo.rowIndex).prop("disabled", true);

                    $("#row_" + indexInfo.rowIndex).attr("data-success", 1);
                    $("#row_" + indexInfo.rowIndex).attr("data-failure", 0);
                } else {
                    $("#result_" + indexInfo.rowIndex).html(FAILURE_SVG);
                    $("#result_code_" + indexInfo.rowIndex).html(data.errorCode);

                    $("#row_" + indexInfo.rowIndex).attr("data-success", 0);
                    $("#row_" + indexInfo.rowIndex).attr("data-failure", 1);
                }

                isSingleDefragStarted = false;
            } else {
                //messageElement.css("color", "hotpink");
                //messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                $("#result_" + indexInfo.rowIndex).empty();
                $("#result_" + indexInfo.rowIndex).html(FAILURE_SVG);

                $("#row_" + indexInfo.rowIndex).attr("data-success", 0);
                $("#row_" + indexInfo.rowIndex).attr("data-failure", 1);

                isSingleDefragStarted = false;

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();

            $("#run_time_" + indexInfo.rowIndex).html(formatDateDiff(new Date(), start));
            $("#process_" + indexInfo.rowIndex).remove();

            setResponses();

            validateFragProcesses();

            getCollOrgRegBundle();
        },
        error: function (error) {
            afterReload();

            $("#processing_" + indexInfo.rowIndex).css("display", "none");

            $("#result_" + indexInfo.rowIndex).empty();
            $("#result_" + indexInfo.rowIndex).html(FAILURE_SVG);

            $("#row_" + indexInfo.rowIndex).attr("data-success", 0);
            $("#row_" + indexInfo.rowIndex).attr("data-failure", 1);
            $("#row_" + indexInfo.rowIndex).removeClass("will-start");

            $("#process_" + indexInfo.rowIndex).remove();

            validateFragProcesses();

            //onError(7257828458375147659);
        }
    });

    isSingleDefragStarted = false;
}

function getNextDefragIndex() {
    let result = null;

    let found = false;

    $(".row_with_checkbox").each((index, checkbox) => {
        if (!found && $(checkbox).prop("checked")) {
            const currentIndex = $(checkbox).attr("data-index");

            result = {};
            result.table = $("#table_" + currentIndex).html();
            result.index = $("#index_" + currentIndex).html();
            if (result.index === "") {
                result.index = "ALL";
            }
            result.rowIndex = currentIndex;
            result.frag = parseInt($("#frag_" + currentIndex).html());

            found = true;

            $(checkbox).prop("checked", false);
        }
    });

    setSelectedCheckboxCount();

    return result;
}

function setSelectedCheckboxCount() {
    let count = 0;

    $(".row_with_checkbox").each((index, checkbox) => {
        if ($(checkbox).prop("checked")) {
            count++;
        }
    });

    $("#selected_index_count").html(count);
}

function setResponses() {
    let successCount = 0;
    let failureCount = 0;

    $(".row").each((index, row) => {
        successCount += parseInt($(row).attr("data-success"));
        failureCount += parseInt($(row).attr("data-failure"));
    });

    $("#success_count").html(successCount);
    $("#failure_count").html(failureCount);
}

function beforeGetIndexStatistic() {
    $("#stat_loader").css("visibility", "visible");
}

function afterGotIndexStatistic() {
    $("#stat_loader").css("visibility", "hidden");
}

function selectRow(element, event) {
    if (event.target.type === "checkbox") {
        return;
    }

    $(".row").each((index, row) => {
        $(row).removeClass("selected-row");
    });

    $(element).addClass("selected-row");

    const selectedRowIndex = $(element).attr("data-index");

    if ($("#type_" + selectedRowIndex).html() === "HEAP") {
        clearStatisticElements();

        return;
    }

    if (statisticTimerId !== null) {
        clearTimeout(statisticTimerId);

        statisticTimerId = null;
    }

    selectedTable = $("#table_" + selectedRowIndex).html();
    selectedIndex = $("#index_" + selectedRowIndex).html();

    if ($("#type_" + selectedRowIndex).text().toUpperCase() !== "XML") {
        getIndexStatisctic();
    }
}

function removeSvgClass(id) {
    const svgElement = $("#" + id + "_svg");

    if (svgElement.hasClass("svg-element-blue")) {
        svgElement.removeClass("svg-element-blue");
    } else if (svgElement.hasClass("svg-element-green")) {
        svgElement.removeClass("svg-element-green");
    } else if (svgElement.hasClass("svg-element-red")) {
        if (svgElement.hasClass("svg-element-red")) {
            svgElement.removeClass("svg-element-red");
        }
    }
}

function comparePreviousValue(id, value, isCompare, upClassSuffix, downClassSuffix) {
    const svgElement = $("#" + id + "_svg");

    if (isCompare !== undefined && isCompare) {
        if (parseFloat(value) > parseFloat($("#" + id).html())) {
            svgElement.addClass("svg-element-" + upClassSuffix);
            svgElement.html(UP_SVG);
        } else if (parseFloat(value) < parseFloat($("#" + id).html())) {
            svgElement.addClass("svg-element-" + downClassSuffix);
            svgElement.html(DOWN_SVG);
        } else {
            removeSvgClass(id);

            svgElement.html(BLANK_SVG);
        }
    } else {
        removeSvgClass(id);

        svgElement.html(BLANK_SVG);
    }
}

function clearStatisticElements() {
    $("#can_delete").css("display", "none");
    $("#stat_table").empty();
    $("#stat_index").empty();
    $("#stat_type").empty();
    $("#stat_field").empty();
    $("#stat_field_type").empty();
    $("#stat_frag").empty();
    $("#stat_frag_svg").empty();
    $("#stat_size").empty();
    $("#stat_size_svg").empty();
    $("#stat_space").empty();
    $("#stat_space_svg").empty();
    $("#stat_page_count").empty();
    $("#stat_page_count_svg").empty();
    $("#stat_record_count").empty();
    $("#stat_record_count_svg").empty();
    $("#stat_seeks_count").empty();
    $("#stat_seeks_count_svg").empty();
    $("#stat_scans_count").empty();
    $("#stat_scans_count_svg").empty();
    $("#stat_lookups_count").empty();
    $("#stat_lookups_count_svg").empty();
    $("#stat_writes_count").empty();
    $("#stat_writes_count_svg").empty();
}

function getIndexStatisctic(isCompare, index) {
    getChartData();

    statisticTimerId = setInterval(getChartData, 60000);

    const start = new Date();

    beforeGetIndexStatistic();

    clearStatisticElements();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7289976371793559045&table=" + selectedTable + "&index=" + selectedIndex,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                $("#stat_table").html(data.table);
                $("#stat_index").html(data.index);
                $("#stat_type").html(data.type);
                $("#stat_field").html(data.field);
                $("#stat_field_type").html(data.columnType + "(" + data.columnLength + ")");

                if (data.columnType === 'varchar' || data.columnType === 'nvarchar') {
                    $("#stat_field_type").css("color", "#9400d3");
                }

                comparePreviousValue("stat_frag", data.frag, isCompare, "red", "green");
                $("#stat_frag").html(data.frag);

                if (data.frag > 0 && data.frag <= 30) {
                    $("#stat_frag").css("color", "#1ad11a");
                } else if (data.frag > 30 && data.frag <= 60) {
                    $("#stat_frag").css("color", "#b8860b");
                } else {
                    $("#stat_frag").css("color", "#f13f3f");
                }

                comparePreviousValue("stat_size", data.size, isCompare, "blue", "blue");
                $("#stat_size").html(parseFloat(data.size).toLocaleString("ru-RU"));
                comparePreviousValue("stat_space", data.pageSpaceUsed, isCompare, "green", "red");
                $("#stat_space").html(data.pageSpaceUsed);

                if (data.pageSpaceUsed > 0 && data.pageSpaceUsed <= 30) {
                    $("#stat_space").css("color", "#f13f3f");
                } else if (data.pageSpaceUsed > 30 && data.pageSpaceUsed <= 60) {
                    $("#stat_space").css("color", "#b8860b");
                } else {
                    $("#stat_space").css("color", "#1ad11a");
                }

                comparePreviousValue("stat_page_count", data.pageCount, isCompare, "blue", "blue");
                $("#stat_page_count").html(parseInt(data.pageCount).toLocaleString("ru-RU"));
                comparePreviousValue("stat_record_count", data.recordCount, isCompare, "blue", "blue");
                $("#stat_record_count").html(parseInt(data.recordCount).toLocaleString("ru-RU"));
                comparePreviousValue("stat_seeks_count", data.seeks, isCompare, "blue", "blue");
                $("#stat_seeks_count").html(parseInt(data.scans).toLocaleString("ru-RU"));
                comparePreviousValue("stat_scans_count", data.scan, isCompare, "blue", "blue");
                $("#stat_scans_count").html(parseInt(data.scans).toLocaleString("ru-RU"));
                comparePreviousValue("stat_lookups_count", data.lookup, isCompare, "blue", "blue");
                $("#stat_lookups_count").html(parseInt(data.lookups).toLocaleString("ru-RU"));
                comparePreviousValue("stat_writes_count", data.totalWrites, isCompare, "blue", "blue");
                $("#stat_writes_count").html(parseInt(data.totalWrites).toLocaleString("ru-RU"));

                if (data.seeks === 0 && data.lookups === 0) {
                    $("#can_delete").css("display", "block");
                } else {
                    $("#can_delete").css("display", "none");
                }

                if (selectedRowIndex !== null) {
                    $("#frag_" + selectedRowIndex).html(data.frag);
                    $("#size_" + selectedRowIndex).html(data.size);

                    const frag = parseInt(data.frag);
                    const svgElement = $("#organize_svg_" + selectedRowIndex);

                    svgElement.empty();

                    if (frag < 30) {
                        svgElement.html(organizeSVG);
                    } else {
                        svgElement.html(buildSVG);
                    }
                }
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            $("#stat_run_time").html(formatDateDiff(new Date(), start));

            afterGotIndexStatistic();
        },
        error: function (error) {
            afterGotIndexStatistic();

            //onError(7257828458375147659);
        }
    });
}

function getChartData() {
    const selectedTable = $("#table_" + selectedRowIndex).html();
    const selectedIndex = $("#index_" + selectedRowIndex).html();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7290722412293715251&table=" + selectedTable + "&index=" + selectedIndex,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const frags = [];
                const nofragmentedLine = [];
                const reorganizeLine = [];
                const rebuildLine = [];

                data.frags.forEach((element, index) => {
                    frags.push(parseInt(element.frag));

                    nofragmentedLine.push(5);
                    reorganizeLine.push(30);
                    rebuildLine.push(100);
                });

                chart.updateSeries([
                    { data: nofragmentedLine },
                    { data: reorganizeLine },
                    { data: rebuildLine },
                    { data: frags }
                ]);
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }
        },
        error: function (error) {
            //onError(7257828458375147659);
        }
    });
}

function showSlowOrFasterData(frags, weights, baseTime, elementId) {
    const estimatedTime = estimateQueryTime(frags, weights, baseTime);

    const collRegElement = $("#" + elementId);

    let slowerOrFasterValue = parseFloat((estimatedTime / baseTime).toFixed(2));

    $("#" + elementId).removeClass("relation-loader");

    if (estimatedTime === baseTime) {
        collRegElement.html("Excellent");
        collRegElement.css("color", "#000000");
    } else if (estimatedTime < baseTime) {
        slowerOrFasterValue = parseFloat((slowerOrFasterValue * 100).toFixed(2));

        if (estimatedTime === 0) {
            collRegElement.html("Excellent");
        } else {
            collRegElement.html(slowerOrFasterValue + "% faster");            
        }

        collRegElement.css("color", "#228b22");
    } else {        
        collRegElement.html(slowerOrFasterValue + "x slower");
        collRegElement.css("color", "#ff0000");
    }
}

function getCollOrgRegBundle() {
    const collToRegElement = $("#coll_to_reg");
    collToRegElement.empty();
    collToRegElement.addClass("relation-loader");

    const eventToRegElement = $("#event_to_reg");
    eventToRegElement.empty();
    eventToRegElement.addClass("relation-loader");

    const activeLearningToOsElement = $("#active_learning_to_os");
    activeLearningToOsElement.empty();
    activeLearningToOsElement.addClass("relation-loader");
    
    const learningToOsElement = $("#learning_to_os");
    learningToOsElement.empty();
    learningToOsElement.addClass("relation-loader");

    const trashDocsElement = $("#trash_docs");
    trashDocsElement.empty();
    trashDocsElement.addClass("relation-loader");
    
    const selectedTable = $("#table_" + selectedRowIndex).html();
    const selectedIndex = $("#index_" + selectedRowIndex).html();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7292142554092386196",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                // COLL-ORG-REG BOX
                let currentFrags = {
                    collaborators: parseInt(data.coll_frag),
                    orgs: parseInt(data.org_frag),
                    regions: parseInt(data.reg_frag)
                };

                let weights = {
                    collaborators: 0.5,
                    orgs: 0.3,
                    regions: 0.2
                };

                showSlowOrFasterData(currentFrags, weights, BASE_1_TIME_SECONDS, "coll_to_reg");

                // ERS-ES-ERTS-COLL-ORG-REG BOX
                currentFrags = {
                    event_results: parseInt(data.ers_frag),
                    events: parseInt(data.es_frag),
                    event_result_types: parseInt(data.erts_frag),
                    collaborators: parseInt(data.coll_frag),
                    orgs: parseInt(data.org_frag),
                    regions: parseInt(data.reg_frag)
                };

                weights = {
                    event_results: 0.46,
                    events: 0.01,
                    event_result_types: 0,
                    collaborators: 0.40,
                    orgs: 0.13,
                    regions: 0
                };

                showSlowOrFasterData(currentFrags, weights, BASE_2_TIME_SECONDS, "event_to_reg");

                // ACTIVE_LEARNING-COURCES-EDUCATION_PLANS-CCOLLS-ORGS
                currentFrags = {
                    active_learnings: parseInt(data.als_frag),
                    cources: parseInt(data.cour_frag),
                    edu_plans: parseInt(data.edu_plans_frag),
                    collaborators: parseInt(data.coll_frag),
                    orgs: parseInt(data.org_frag)
                };

                weights = {
                    active_learnings: 0.25,
                    cources: 0,
                    edu_plans: 0,
                    collaborators: 0.57,
                    orgs: 0.18
                };

                showSlowOrFasterData(currentFrags, weights, BASE_3_TIME_SECONDS, "active_learning_to_os");

                // LEARNING-COURCES-EDUCATION_PLANS-CCOLLS-ORGS
                currentFrags = {
                    learnings: parseInt(data.ls_frag),
                    cources: parseInt(data.cour_frag),
                    edu_plans: parseInt(data.edu_plans_frag),
                    collaborators: parseInt(data.coll_frag),
                    orgs: parseInt(data.org_frag)
                };

                weights = {
                    learnings: 0.61,
                    cources: 0,
                    edu_plans: 0,
                    collaborators: 0.34,
                    orgs: 0.4
                };

                showSlowOrFasterData(currentFrags, weights, BASE_4_TIME_SECONDS, "learning_to_os");

                // TRASH_DOCS
                currentFrags = {
                    trash_docs: parseInt(data.trash_docs_frag)
                };

                weights = {
                    trash_docs: 1
                };

                showSlowOrFasterData(currentFrags, weights, BASE_5_TIME_SECONDS, "trash_docs");
            } else {
                console.log("Error 1: " + data.errorMessage.indexOf("#"));
            }
        },
        error: function (error) {
            console.log("Error 2: " + error);
            //onError(7257828458375147659);
        }
    });
}

function onSelectTab(element, tabIndex) {
    selectedTabIndex = tabIndex;

    $(".tab").each((index, div) => {
        $(div).removeClass("selected-tab");        
    });

    $(element).addClass("selected-tab");

    $(".info-box").css("display", "none");

    $("#box" + tabIndex).css("display", "block");
}

function selectTab(element, index) {
    if(index === 1 && selectedTabIndex !== index) {
        onSelectTab(element, index);
    } else if (index === 2 && selectedTabIndex !== index) {
        if (notification != null) {
            openAlertPopupWindow("Дождитесь окончания процесса фрагментации индексов.");
            return;
        } else {
            onSelectTab(element, 2);
        }
    } else if (index === 3 && selectedTabIndex !== index) {
        if (notification != null) {
            openAlertPopupWindow("Дождитесь окончания процесса фрагментации индексов.");
            return;
        } else {
            onSelectTab(element, 3);
        }
    } else if (index === 4 && selectedTabIndex !== index) {
        if (notification != null) {
            openAlertPopupWindow("Дождитесь окончания процесса фрагментации индексов.");
            return;
        } else {
            onSelectTab(element, 4);

            initializePage3();
        }
    }
}

function openAlertPopupWindow(message) {
    $("#popup_box").empty();

    const content = `
			<div style="margin-top: 10px; text-align: center;">${message}</div>			
		`;

    alertPopupWindow = new AlertPopupWindow("alertPopupWindow", "popup_box", content);
}

function goToTableIndexInfo(element) {
    if (isGlobalDefragStarted) {
        openAlertPopupWindow("Дождитесь окончания процесса фрагментации индексов.");
        return;
    }

    const tableName = $("#table_" + $(element).attr("data-index")).text();

    $("#card_find").val(tableName);

    $("#tab4").click();
}