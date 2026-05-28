let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
//sleep(1000).then(r => r);

let isGlobalDefragStarted = false;
let isSingleDefragStarted = false;
let timerId = null;

let statisticTimerId = null;

let selectedTable = "";
let selectedIndex = "";

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
    '<path d="M341.3,0v85.3h-64c-70.7,0-128,57.3-128,128v85.3c0,35.4-28.6,64-64,64H0v64h85.3c70.7,0,128-57.3,128-128v-85.3'+
	'c0-35.4,28.6-64,64-64h64v85.3L512,128v-21.3L341.3,0z M114,156.4l37.6-52.1c-19.4-11.8-42-19-66.3-19H0v64h85.3' +
	'C95.7,149.3,105.3,152,114,156.4z M341.3,362.7h-64c-10.4,0-20-2.7-28.7-7.1L211,407.7c19.4,11.8,42,19,66.3,19h64V512L512,405.3'+
	'V384L341.3,277.3L341.3,362.7L341.3,362.7z"/>' +
    '</svg>';

const buildSVG = '<svg fill="#f80505" width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>REBUILD</title>' +
    '<path d="M469.54,120.52h0a16,16,0,0,0-25.54-4L382.56,178a16.12,16.12,0,0,1-22.63,0L333.37,151.4a16,16,0,0,1,0-22.63l61.18-61.19a16,16,0,0,0-4.78-25.92h0C343.56' + 
    ',21,285.88,31.78,249.51,67.88c-30.9,30.68-40.11,78.62-25.25,131.53a15.89,15.89,0,0,1-4.49,16L53.29,367.46a64.17,64.17,0,1,0,90.6,90.64L297.57,291.25a15.9,15.9,0,' + 
    '0,1,15.77-4.57,179.3,179.3,0,0,0,46.22,6.37c33.4,0,62.71-10.81,83.85-31.64C482.56,222.84,488.53,157.42,469.54,120.52ZM99.48,447.15a32,32,0,1,1,28.34-28.35A32,32,0' + 
    ',0,1,99.48,447.15Z" /></svg>';

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

function initialize() {
    $("#stat_frag_svg").html(BLANK_SVG);
    $("#stat_size_svg").html(BLANK_SVG);    
    $("#stat_space_svg").html(BLANK_SVG);
    $("#stat_page_count_svg").html(BLANK_SVG);
    $("#stat_record_count_svg").html(BLANK_SVG);

    getIndexes();
}

function getIndexes() {
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
                    } else {
                        $("#organize_svg_" + index).html(buildSVG);
                    }
                    
                    $("#size").attr("id", "size_" + index);
                    $("#size_" + index).html(element.size);

                    $("#processing").attr("id", "processing_" + index);

                    $("#result").attr("id", "result_" + index);

                    $("#result_code").attr("id", "result_code_" + index);

                    $("#run_time").attr("id", "run_time_" + index);
                });

                $("#total_table_count").html(tableCount);
            } else {
                //messageElement.css("color", "hotpink");
                //messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

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

function onHeaderCheckBoxChange(event) {
    let count = 0;

    if (event.currentTarget.checked) {
        $(".row_with_checkbox").each((index, checkbox) => {
            if (!$(checkbox).prop("disabled")) {
                checkbox.checked = true;

                $(checkbox).addClass("selected");

                count++;
            }
        });
    } else {
        $(".row_with_checkbox").each((index, checkbox) => {
            checkbox.checked = false;

            $(checkbox).removeClass("selected");
        });
    }

    $("#selected_index_count").html(count);
}

function onRowCheckBoxChange(event) {
    $("#header_check").prop("checked", false);

    if (event.currentTarget.checked) {
        $("#" + event.currentTarget.id).addClass("selected");

        const tableName = $("#" + event.currentTarget.id).attr("data-name");

        checkUncheckByTable(tableName, true);
    } else {
        $("#" + event.currentTarget.id).removeClass("selected");

        const tableName = $("#" + event.currentTarget.id).attr("data-name");

        checkUncheckByTable(tableName, false);
    }

    if ($(".row_with_checkbox").length === $(".selected").length) {
        $("#header_check").prop("checked", true);
    }

    setSelectedCheckboxCount();
}

function checkUncheckByTable(tableName, checked) {
    $(".row_with_checkbox").each((index, checkbox) => {
        if ($(checkbox).attr("data-name") === tableName) {
            if (!$(checkbox).prop("disabled")) {
                $(checkbox).prop("checked", checked);
            }
        }
    });
}

function startGlobalDefrag() {
    isGlobalDefragStarted = true;

    timerId = setInterval(startSingleDefrag, 2000);
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

    //console.log("Table: " + indexInfo.table + " Index: " + indexInfo.index + " Frag: " + indexInfo.frag + " rowIndex:" + indexInfo.rowIndex);

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
            $("#processing_" + indexInfo.rowIndex).css("display", "none");

            if (data.errorMessage.indexOf("#") < 0) {
                $("#result_" + indexInfo.rowIndex).empty();

                if (parseInt(data.errorCode) == 0) {
                    $("#frag_" + indexInfo.rowIndex).html(data.frag + " (" + $("#frag_" + indexInfo.rowIndex).html() + ")");

                    const frag = parseInt(data.frag);
                    $("#frag_" + indexInfo.rowIndex).removeClass("bold");
                    if (frag >= 30) {
                        $("#frag_" + indexInfo.rowIndex).addClass("bold");
                    }

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
        },
        error: function (error) {
            afterReload();

            $("#processing_" + indexInfo.rowIndex).css("display", "none");

            $("#result_" + indexInfo.rowIndex).empty();
            $("#result_" + indexInfo.rowIndex).html(FAILURE_SVG);

            $("#row_" + indexInfo.rowIndex).attr("data-success", 0);
            $("#row_" + indexInfo.rowIndex).attr("data-failure", 1);

            $("#process_" + indexInfo.rowIndex).remove();
            
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

    $("#" + element.id).addClass("selected-row");

    if (statisticTimerId !== null) {
        clearTimeout(statisticTimerId);

        statisticTimerId = null;
    }

    selectedTable = $("#table_" + $("#" + element.id).attr("data-index")).html();
    selectedIndex = $("#index_" + $("#" + element.id).attr("data-index")).html();

    getIndexStatisctic();
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

function getIndexStatisctic(isCompare) {
    if (selectedTable === "" || selectedIndex === "") {
        alert("Для просмотра выберите таблицу из списка.");

        return;
    }

    const start = new Date();

    beforeGetIndexStatistic();

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
                comparePreviousValue("stat_frag", data.frag, isCompare, "red", "green");
                $("#stat_frag").html(data.frag);
                comparePreviousValue("stat_size", data.size, isCompare, "blue", "blue");
                $("#stat_size").html(data.size);                
                comparePreviousValue("stat_space", data.pageSpaceUsed, isCompare, "green", "red");
                $("#stat_space").html(data.pageSpaceUsed);
                comparePreviousValue("stat_page_count", data.pageCount, isCompare, "blue", "blue");
                $("#stat_page_count").html(data.pageCount);
                comparePreviousValue("stat_record_count", data.frag, isCompare, "blue", "blue");
                $("#stat_record_count").html(data.recordCount);                
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