const MAX_ROWS = 2000;

var pearlNotification;
var currentPage = 1;
var selectedID = null;

//--------------------------------------------------------------
$(document).ready(function () {
    $.ajaxSetup({
        async: false
    });

    moment.locale(readCookie("clang"));

    pearlNotification = $("#pearlNotification")
        .kendoNotification({
                animation: {
                    open: {
                        effects: "slideIn:left"
                    },
                    close: {
                        effects: "slideIn:left",
                        reverse: true
                    }
                }
            }
        )
        .data("kendoNotification");

    onInitGrid();

    refreshGrid();

    initElements();

    $("#grid tbody").on("dblclick", "td", function(e) {
        var selectedItem = getSelectedItem();

        if(selectedItem != null) {
            showWindow(selectedItem);
        }
    });

    window.onkeydown = function (event) {
        if(event.keyCode === 13) {
            var selectedItem = getSelectedItem();

            if(selectedItem != null) {
                showWindow(selectedItem);
            }
        }
    };

    $(window).resize(function(){
        resizeGrid();
    });
});
//--------------------------------------------------------------
function getPearlNotification() {
    return pearlNotification;
}
//--------------------------------------------------------------
function getSelectedItem() {
    var gridData = $("#grid").data("kendoGrid");

    return gridData.dataItem(gridData.select());
}
//--------------------------------------------------------------
function resizeGrid() {
    $("#grid").data("kendoGrid").resize();
}
//--------------------------------------------------------------
function initElements() {
    var gridData = $("#grid").data("kendoGrid");

    $("#add_button").kendoButton({
        click: function(e) {
            showWindow(null);
        }
    });

    $("#edit_button").kendoButton({
        click: function(e) {
            var selectedItem = getSelectedItem();

            if(selectedItem != null) {
                showWindow(selectedItem);
            } else {
                alert("Please select item to edit!");
            }
        }
    });

    $("#delete_button").kendoButton({
        click: function(e) {
            var selectedItem = getSelectedItem();

            if(selectedItem != null) {
                deleteLogisticCenter(selectedItem.id);
            } else {
                alert("Please select item to delete!");
            }
        }
    });


}
//--------------------------------------------------------------
function onDataBound() {
    currentPage = $('#grid').data('kendoGrid').dataSource.page();
}
//--------------------------------------------------------------
function onInitGrid() {
    var gridElement = $("#grid");

    gridElement.kendoGrid({
        dataSource: {
            schema: {
                data: "content",
                model: {
                    fields: {
                        id: {type: "number"},
                        shortName: {type: "string"},
                        longName: {type: "string"},
                        region: {type: "number"},
                        priority: {type: "number"},
                        supplierId: {type: "number"},
                        type: {type: "number"},
                        subType: {type: "number"}
                    }
                }
            },
            pageSize: 20
        },
        //height: 550,
        //width: "200%",
        dataBound: onDataBound,
        filterable: true,
        sortable: true,
        pageable: true,
        columnMenu: true,
        selectable: "row",
        detailTemplate: kendo.template($("#template").html()),
        columns: [
            {field: "id", title: "ID", width: 50},
            {field: "shortName", title: "Short name", width: 200},
            {field: "longName", title: "Long name", width: 300},
            {field: "region", title: "Region", width: 200, template: "#:region# -  <span class='#:regionClass#'>#:regionName#</span>"},
            {field: "priority", title: "Priority", width: 100, attributes: {style: "text-align: right;"}},
            {field: "supplierId", title: "Supplier Id", width: 300, template: "#:supplierId# -  <span class='#:supplierClass#'>#:supplierName#</span>"},
            {field: "type", title: "Type", template: "#:type# -  <span class='#:typeClass#'>#:typeName#</span>"},
            {field: "subType", title: "Sub type", template: "#:subType# -  <span class='#:subTypeClass#'>#:subTypeName#</span>"}
        ]
    });

    gridElement.data("kendoGrid").wrapper.find(".k-pager-last")
        .after('&nbsp;<button id="add_button">Neu</button><button id="edit_button">Editieren</button><button id="delete_button">L&#246;schen</button>');
}
//--------------------------------------------------------------
function refreshGrid() {
    $.ajax({
        url: "/bbs/partners/logistic/list.do",
        data: {
            first : currentPage === 1 ? 0 : currentPage - 1,
            max: MAX_ROWS
        },
        dataType: "json",
        async: false,
        success: function(data) {
            if (data !== null) {
                data.forEach(function (logisticElement) {
                    logisticElement.createDate = moment(logisticElement.createDate).format('L LTS');
                    if(logisticElement.updateDate != null) {
                        logisticElement.updateDate = moment(logisticElement.updateDate).format('L LTS');
                    }
                });

                var gridData = $('#grid').data('kendoGrid');

                gridData.dataSource.data(data);

                gridData.dataSource.page(currentPage);
            } else {
                showMessageIfDataIsNull(pearlNotification);
            }
        },
        error: function (httpRequest, textStatus, errorThrown) {
            showMessage(pearlNotification, httpRequest, window.location.pathname);
        }
    });
}
//--------------------------------------------------------------
function showWindow(selectedItem) {
    var dialogWindow = $("#dialog_window").kendoWindow({
        modal: true,
        content: "/bbs/partners/logistic/edit.html" + (selectedItem != null ? "?id=" + selectedItem.id : ""),
        iframe: true,
        width: 1180, //parseInt($(document).width()) - 500,
        height: parseInt($(document).height()) - 50,
        close: function (e) {
            $(this.element).empty();

            dialogWindow = null;
        }
    });

    dialogWindow.data("kendoWindow").title("Logistic center " + (selectedItem !== null ? "(ID: " + selectedItem.id + ")" : ": New" ));
    dialogWindow.data("kendoWindow").center().open();
}
//--------------------------------------------------------------
function deleteLogisticCenter(id) {
    if(confirm("Remove logistic center with ID=" + id + "?")) {
        $.ajax({
            url: "/bbs/partners/logistic/delete.do",
            dataType: "json",
            data: {
                id : id
            },
            async: false,
            success: function(data) {
                if (data !== null) {
                    refreshGrid();
                } else {
                    showMessageIfDataIsNull(pearlNotification);
                }
            },
            error: function (httpRequest, textStatus, errorThrown) {
                showMessage(pearlNotification, httpRequest, window.location.pathname);

            }
        });
    }
}
//--------------------------------------------------------------
function onClose(refresh) {
    $("#dialog_window").data("kendoWindow").close();

    if(refresh !== null && typeof refresh !== "undefined" && refresh) {
        refreshGrid();

        if(selectedID != null) {
            //$("#grid").data("kendoGrid").tbody.find("tr[data-uid='" + selectedUID + "']");

            var row = $("#grid").find("tr:eq(" + selectedID + ")");
            theGrid.select(row);
        }
    }
}
//--------------------------------------------------------------