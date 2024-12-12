var pearlNotification;
var stompClient = null;

//--------------------------------------------------------------
$(document).ready(function () {
    $.ajaxSetup({
        async: false
    });

    moment.locale(readCookie("clang"));

    pearlNotification = $("#pearlNotification")
        .kendoNotification({
                autoHideAfter: 0,
                button: true,
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

    $("#lastBillId").kendoMaskedTextBox({});
    $("#extBillIds").kendoMaskedTextBox({});

    $("#lastOK").kendoButton({
        click: function(e) {
            var lastBillIdElement = $("#lastBillId");

            if(lastBillIdElement.val().trim().length === 0) {
                alert("'Last bill ID' element is empty!");
            }

            $.ajax({
                url: "/bbs/partners/request/set_partner_last_bill_id.do",
                method: "GET",
                dataType: "json",
                data: {
                    id: $("#partnerId").val(),
                    billId : lastBillIdElement.val()
                },
                async: false,
                success: function(data) {
                    if(data != null && data.verified) {
                        alert("Last bill ID value saved!");
                    } else {
                        alert("ERROR: bill exists: " + data.billExists + " client exists: " + data.clientExists);
                    }
                },
                error: function (httpRequest, textStatus, errorThrown) {
                    showMessage(pearlNotification, httpRequest, window.location.pathname);
                }
            });
        }


    });

    $("#extOK").kendoButton({
        click: function(e) {
            $.ajax({
                url: "/bbs/partners/request/set_partner_ext_bill_ids.do",
                method: "GET",
                dataType: "json",
                data: {
                    id: $("#partnerId").val(),
                    extIds : $("#extBillIds").val()
                },
                async: false,
                success: function(data) {
                    if(data != null && data.verified) {
                        alert("Last excluded bill IDs are saved!");
                    } else {
                        alert("ERROR: bill exists: " + data.billExists + " client exists: " + data.clientExists);
                    }
                },
                error: function (httpRequest, textStatus, errorThrown) {
                    showMessage(pearlNotification, httpRequest, window.location.pathname);
                }
            });
        }
    });

    $("#partnerId").kendoDropDownList({
        dataTextField: "name",
        dataValueField: "id",
        change: function(e) {
            getPartnerData();
        }
    });

    fillPartners();

    $("#files").kendoUpload({
        "multiple":false,
        localization: {
            select: "Browse…",
            remove: "",
            cancel: ""
        }
    });

    $("#progressBar").kendoProgressBar({
        type: "percent",
        animation: {
            duration: 100
        }
    });

    $("#logs_panel").kendoPanelBar({
        expandMode: "single"
    });

    $("#submit").kendoButton({});

    $("#cancel").kendoButton({
        click: function(e) {
            stompClient.send("/stomp/partners/request/interrupt", {}, JSON.stringify({}));
        }
    });
    connect();
});
//-------------------------------------------------------------
$(window).unload(function() {
    disconnect();
});
//-------------------------------------------------------------
function fillPartners() {
    var partnersIdData = $("#partnerId").data("kendoDropDownList");

    partnersData.partners.forEach(function (partner) {
        partnersIdData.dataSource.add({
            id: partner.id,
            name: partner.shortName
        });
    });

    partnersIdData.dataSource.sync();

    partnersIdData.select(0);

    getPartnerData();
}
//-------------------------------------------------------------
function getPartnerData() {
    var partnersElement = $("#partnerId");

    if(parseInt(partnersElement.val() === 0)) {
        return;
    }

    $.ajax({
        url: "/bbs/partners/request/get_partner.do",
        method: "GET",
        dataType: "json",
        data: {
            id: partnersElement.val()
        },
        async: false,
        success: function(data) {
            if(data != null) {
                $("#lastBillId").val(data.billLastId);
                $("#extBillIds").val(data.excludedBillIds);
            }
        },
        error: function (httpRequest, textStatus, errorThrown) {
            showMessage(pearlNotification, httpRequest, window.location.pathname);
        }
    });
}
//-------------------------------------------------------------
function beforeSubmit() {
    var partnerIdElement = $("#partnerId");

    if(parseInt(partnerIdElement.val()) > 0) {
        $("#id").val(partnerIdElement.val());

        $("#progressBar").css("visibility", "visible");

        return true;
    } else {
        alert("Please choose the partner!");

        return false;
    }
}
//-------------------------------------------------------------
function connect() {
    var socket = new SockJS('/bbs/stomp/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/partners/request/message/info', function (data) {
            data = JSON.parse(data.body);

            pearlNotification.show(data.message, "info");
        });

        stompClient.subscribe('/topic/partners/request/message/error', function (data) {
            data = JSON.parse(data.body);

            pearlNotification.show(data.message, "error");

            $("#submit").css( "visibility", "visible" );
            $("#cancel").css( "visibility", "hidden" );
        });

        stompClient.subscribe('/topic/partners/request/message/warning', function (data) {
            data = JSON.parse(data.body);

            pearlNotification.show(data.message, "warning");
        });

        stompClient.subscribe('/topic/partners/request/message/start', function (data) {
            data = JSON.parse(data.body);

            $("#submit").css( "visibility", "hidden" );
            $("#logs").val(data.message);
        });

        stompClient.subscribe('/topic/partners/request/message/upload', function (data) {
            data = JSON.parse(data.body);

            var logsElement = $("#logs"), logs = logsElement.val();

            logs += data.message;

            if(data.stage === "Failed") {
                logs += "\nIdle";

                $("#submit").css( "visibility", "visible" );
                $("#cancel").css( "visibility", "hidden" );
            }

            logsElement.val(logs);
        });

        stompClient.subscribe('/topic/partners/request/message/validate', function (data) {
            var submitElement = $("#submit");
            submitElement.css( "visibility", "hidden" );

            var cancelElement = $("#cancel");
            cancelElement.css( "visibility", "visible" );

            data = JSON.parse(data.body);

            $("#stage").html(data.stage);

            var progressBarElement = $("#progressBar");
            progressBarElement.css("visibility", "visible");
            progressBarElement.data("kendoProgressBar").value(data.progressInPercent);

            if(data.stage === "Validating failed") {
                submitElement.css( "visibility", "visible" );
                cancelElement.css( "visibility", "hidden" );
                progressBarElement.css( "visibility", "hidden" );
            }

            var logsElement = $("#logs"), logs = logsElement.val();

            if(data.message != null) {
                logs += data.message;

                logsElement.val(logs);
            }/* else {
                if(data.stage === "Validated") {
                    // Add ' OK' message after 'Validating ... ' message on view
                    logs += data.message;

                    logsElement.val(logs);
                }
            }*/
        });

        stompClient.subscribe('/topic/partners/request/message/progress', function (data) {
            var submitElement = $("#submit");

            submitElement.css( "visibility", "hidden" );

            data = JSON.parse(data.body);

            $("#stage").html(data.stage);

            var progressBarElement = $("#progressBar");
            progressBarElement.css("visibility", "visible");
            progressBarElement.data("kendoProgressBar").value(data.progressInPercent);

            var logsElement = $("#logs"), logs = logsElement.val();

            logs += "\n" + data.message;

            logsElement.val(logs);

            if(logsElement.length) {
                logsElement.scrollTop(logsElement[0].scrollHeight - logsElement.height());
            }
        });

        stompClient.subscribe('/topic/partners/request/message/finish', function (data) {
            $("#submit").css( "visibility", "visible" );
            $("#cancel").css( "visibility", "hidden" );

            var logsElement = $("#logs"), logs = logsElement.val();

            logs += "\nIdle";

            logsElement.val(logs);
        });

        stompClient.subscribe('/topic/partners/request/message/interrupt', function (data) {
            data = JSON.parse(data.body);

            var logsElement = $("#logs"), logs = logsElement.val();

            logs += "\n" + data.message;

            $("#stage").html(data.stage);

            logsElement.val(logs);

            $("#submit").css( "visibility", "visible" );
            $("#cancel").css( "visibility", "hidden" );
        });
    });
}
//-------------------------------------------------------------
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
}
//-------------------------------------------------------------
