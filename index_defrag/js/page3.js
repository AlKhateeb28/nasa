let selectedIndexColumnTabIndex = 1;

const isIndexsPageVisited = true;
let isColumnsPageVisited = false;

function initializePage3() {
    if (!isPage4Visited) {
        getTablesNames();
    } else {
        highlightElementsByMask();
    }
}

function getTablesNames() {
    isPage4Visited = true;

    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7293613460182792869",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                data.tables.forEach((element, index) => {
                    $("#index_info_body").append(getTemplate("row_index_info_template"));

                    $("#index_info_row").attr("id", "index_info_row_" + index);
                    $("#index_info_row_" + index).attr("data-table", element.table);

                    $("#index_info_cell").attr("id", "index_info_cell_" + index);
                    $("#index_info_cell_" + index).html(element.table);

                });

                highlightElementsByMask();
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

            console.log("Error");
            console.log(error);

            //onError(7257828458375147659);
        }
    });
}

function selectIndexInfoRow(element) {
    $(".index-info-row").each((index, row) => {
        $(row).removeClass("selected-index-info-row");
    });

    $(element).addClass("selected-index-info-row");

    if (selectedIndexColumnTabIndex === 1) {
        getIndexesInfo($(element).attr("data-table"));
    } else if (selectedIndexColumnTabIndex === 2) {
        getColumnsInfo($(element).attr("data-table"));
    }
}

function selectColumnInfoRow(element) {
    $(".column-info-row").each((index, row) => {
        $(row).removeClass("selected-column-info-row");
    });

    $(element).addClass("selected-column-info-row");
}

function numberToLocaleString(value) {
    if (value === "" || value === null) {
        return value;
    }

    return parseInt(value).toLocaleString("ru-RU");
}

function normalizeColumnLength(length) {
    if (length === null) {
        return "";
    }

    return "(" + length + ")";
}

function getIndexesInfo(tableName) {
    beforeReload();

    $("#indexes_info_body").empty();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7294971710576419446&table=" + tableName,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                data.indexes.forEach((element, index) => {
                    $("#indexes_info_body").append(getTemplate("row_indexes_info_template"));

                    //$("#info_change").attr("id", "info_change_" + index);

                    $("#info_row").attr("id", "info_row_" + index);
                    $("#info_row_" + index).attr("data-table", tableName)

                    $("#info_num").attr("id", "info_num_" + index);
                    $("#info_num_" + index).html(index + 1);

                    $("#info_index").attr("id", "info_index_" + index);
                    $("#info_index_" + index).html(element.index);

                    $("#info_type").attr("id", "info_type_" + index);
                    $("#info_type_" + index).html(element.type);

                    $("#info_field").attr("id", "info_field_" + index);
                    $("#info_field_" + index).html(element.field);

                    $("#info_frag").attr("id", "info_frag_" + index);
                    $("#info_frag_" + index).html(parseFloat(element.frag).toLocaleString("ru-RU"));

                    $("#info_size").attr("id", "info_size_" + index);
                    $("#info_size_" + index).html(parseInt(element.size).toLocaleString("ru-RU"));

                    $("#info_page_count").attr("id", "info_page_count_" + index);
                    $("#info_page_count_" + index).html(parseInt(element.pageCount).toLocaleString("ru-RU"));

                    $("#info_column_type").attr("id", "info_column_type_" + index);
                    $("#info_column_type_" + index).html(element.columnType + normalizeColumnLength(element.columnLength));

                    if ((element.columnType === "varchar" || element.columnType === "nvarchar") && element.columnLength !== null &&
                        (parseInt(element.columnLength) === -1 || parseInt(element.columnLength) === 900)) {
                        $("#info_column_type_" + index).addClass("varchar-type");                        
                    }

                    $("#info_max_length").attr("id", "info_max_length_" + index);
                    $("#info_max_length_" + index).html(element.maxLength);

                    $("#info_seeks").attr("id", "info_seeks_" + index);
                    $("#info_seeks_" + index).html(numberToLocaleString(element.seeks));

                    $("#info_scans").attr("id", "info_scans_" + index);
                    $("#info_scans_" + index).html(numberToLocaleString(element.scans));

                    $("#info_lookups").attr("id", "info_lookups_" + index);
                    $("#info_lookups_" + index).html(numberToLocaleString(element.lookups));

                    $("#info_total_writes").attr("id", "info_total_writes_" + index);
                    $("#info_total_writes_" + index).html(numberToLocaleString(element.totalWrites));
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

            console.log("Error");
            console.log(error);

            //onError(7257828458375147659);
        }
    });
}

function getColumnsInfo(tableName) {
    beforeReload();

    $("#columns_info_body").empty();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7295332076801147872&table=" + tableName,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const selectedTable = getSelectedTable();

                data.columns.forEach((column, index) => {
                    $("#columns_info_body").append(getTemplate("row_columns_info_template"));

                    $("#column_size_change").attr("id", "column_size_change_" + index);

                    $("#column_row").attr("id", "column_row_" + index);
                    if (selectedTable.isSelected) {
                        $("#column_row_" + index).attr("data-table", selectedTable.tableName);
                        $("#column_row_" + index).attr("data-column", column.name);
                    }

                    $("#column_num").attr("id", "column_num_" + index);
                    $("#column_num_" + index).html(index + 1);

                    $("#column_name").attr("id", "column_name_" + index);
                    $("#column_name_" + index).html(column.name);

                    $("#column_type").attr("id", "column_type_" + index);
                    $("#column_type_" + index).html(column.type);

                    if ((column.type === "varchar" || column.type === "nvarchar")) {
                        $("#column_type_" + index).addClass("varchar-type");

                        $("#column_size_change_" + index).append(getTemplate("change_field_size_template"));

                        $("#change_size_input").attr("id", "change_size_input_" + index);
                        $("#change_size_input_" + index).attr("data-index", index);
                    }

                    $("#column_length").attr("id", "column_length_" + index);

                    if ($("#column_type_" + index).html() === "xml") {
                        $("#column_length_" + index).html("");                        
                    } else {
                        if (parseInt(column.length) === -1) {
                            $("#column_length_" + index).html("MAX");
                        } else {
                            $("#column_length_" + index).html(column.length);
                        }
                    }

                    $("#column_max_fill_length").attr("id", "column_max_fill_length_" + index);
                    $("#column_max_fill_length_" + index).html(column.maxLength);
                    
                    $("#change_field_size").attr("id", "change_field_size_" + index);                    
                    $("#change_field_size_" + index).attr("data-index", index);
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

            console.log("Error");
            console.log(error);

            //onError(7257828458375147659);
        }
    });
}

function scrollToRowOrCell(cell) {
    const row = cell.closest('tr');
    const prevRow = row.previousElementSibling; // предыдущая строка (или null, если её нет)

    if (prevRow && prevRow.tagName === 'TR') {
        prevRow.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        cell.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function highlightElementsByMask() {
    if ($("#card_find").val() !== "") {
        findTableByMask();
    }
}

function findTableByMask() {
    const searchValue = $("#card_find").val();

    $(".table-cell").each((index, cell) => {
        const cellElement = $(cell);
        cellElement.removeClass("highlight");

        cellElement.html($("#index_info_row_" + index).attr("data-table"));
    });

    $(".table-cell").each((index, cell) => {
        if ($(cell).text().startsWith(searchValue)) {
            const name = $(cell).text();
            const firstPart = name.slice(0, searchValue.length);
            const secondPart = name.slice(searchValue.length);

            $(cell).html(`<span class="highlight">${firstPart}</span>${secondPart}`)
        }
    });

    $(".table-cell").each((index, cell) => {
        if ($(cell).text().startsWith(searchValue)) {
            scrollToRowOrCell(cell);

            return false;
        }
    });
}

function selectInfoRow(element) {
    $(".info-row").each((index, row) => {
        $(row).removeClass("selected-info-row");
    });

    $(element).addClass("selected-info-row");
}

function onSelectIndexColumnTab(element, tabIndex) {
    selectedIndexColumnTabIndex = tabIndex;

    $(".tab-ind-col").each((index, div) => {
        $(div).removeClass("selected-ind-col-tab");
    });

    let tableSelected = false;

    $(".index-info-row").each((index, row) => {
        if ($(row).hasClass("selected-index-info-row")) {
            tableSelected = true;
        }
    });

    $(element).addClass("selected-ind-col-tab");

    const selectedTable = getSelectedTable();

    if (tabIndex === 1) {
        $("#columns_info_box").css("display", "none");

        $("#indexes_info_box").css("display", "block");

        if (selectedTable.isSelected && !hasChildren("indexes_info_body")) {
            getIndexesInfo(selectedTable.tableName);
        }
    } else if (tabIndex === 2) {
        $("#indexes_info_box").css("display", "none");

        $("#columns_info_box").css("display", "block");

        if (selectedTable.isSelected && !hasChildren("columns_info_body")) {
            getColumnsInfo(selectedTable.tableName);
        }
    }
}

function getSelectedTable() {
    const selectedElement = $(".selected-index-info-row");

    if (selectedElement.length === 0) {
        return {
            isSelected: false,
            tableName: ""
        }
    }

    return {
        isSelected: true,
        tableName: selectedElement.attr("data-table")
    }
}

function getSelectedColumn() {
    const selectedElement = $(".selected-column-info-row");

    if (selectedElement.length === 0) {
        return {
            isSelected: false,
            tableName: "",
            columnName: ""
        }
    }

    return {
        isSelected: true,
        tableName: selectedElement.attr("data-table"),
        columnName: selectedElement.attr("data-column")
    }
}

function hasChildren(parentId) {
    return $("#" + parentId).children().length > 0;
}

function selectIndexesColumsTab(element, index) {
    if (index === 1 && selectedIndexColumnTabIndex !== index) {
        onSelectIndexColumnTab(element, index);
    } else if (index === 2 && selectedIndexColumnTabIndex !== index) {
        onSelectIndexColumnTab(element, index);
    }
}

function highlightColumnLegend(element) {
    if ($(element).val().trim() === "") {
        $("#legend_fast_row").removeClass("legend_fast_row");
        $("#legend_slow_row").removeClass("legend_low_row");        
    } else {
        const columnLengt = $("#column_length_" + $(element).attr("data-index")).text();
        const columnMaxLengt = $("#column_max_fill_length_" + $(element).attr("data-index")).text();

        if (parseInt($(element).val()) === parseInt(columnLengt)) {
            $("#legend_fast_row").removeClass("legend_fast_row");
            $("#legend_slow_row").removeClass("legend_low_row");        
        } else if (parseInt($(element).val()) < parseInt(columnLengt)) {
            $("#legend_fast_row").removeClass("legend_fast_row");
            $("#legend_slow_row").addClass("legend_low_row");                    
        } else {
            $("#legend_fast_row").addClass("legend_fast_row");
            $("#legend_slow_row").removeClass("legend_low_row");        
        }
    }
}

function changeFieldSize(element) {
    const inputLength = $("#change_size_input_" + $(element).attr("data-index")).val();
    const columnMaxLengt = $("#column_max_fill_length_" + $(element).attr("data-index")).text();

    if (inputLength === "") {
        openAlertPopupWindow("Введите размер символьного поля.");

        return;
    }

    if (parseInt(inputLength) < parseInt(columnMaxLengt)) {
        openAlertPopupWindow("Нельзя изменить размер поля. Поле имеет более длинную строку.");

        return;
    }

    openAlertPopupWindow("Функционал изменения длины символьного поля находится в стадии разработки.");
}

function selectCompared(element) {
    const selectedIndex = $(element).attr("data-index");

    $("#column_length_" + selectedIndex).addClass("compared");    
}

function deselectCompared(element) {
    $(".compared-cell").removeClass("compared");
}