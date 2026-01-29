function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

class IndexPage extends Object {
    constructor() {
        super();
    }

    static onDownloadOCK(element, id) {
        IndexPage.beforeReport("Формируется выгрузка ОЦК ...");

        IndexPage.awake(element, id);

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7137494958071545430",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка ОЦК сформирована!", "report_ock_2025/report_ock_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, id);

            },
            error: function(error) {
                IndexPage.onError(7137494958071545430);

                IndexPage.sleep(element, id);
            }
        });
    }

    static onDownloadOCKBNO(element, id) {
        IndexPage.beforeReport("Формируется выгрузка ОЦК БНО...");

        IndexPage.awake(element, id);

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7151616261867663994",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка ОЦК-БНО сформирована!", "report_ock_2025/report_ock_bno_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7151616261867663994'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, id);
            },
            error: function(error) {
                IndexPage.onError(7151616261867663994);

                IndexPage.sleep(element, id);
            }
        });
    }

    static onDownloadRCK(element, id) {
        IndexPage.beforeReport("Формируется выгрузка РЦК...");

        IndexPage.awake(element, id);

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7159099470552366682",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка РЦК сформирована!", "report_ock_2025/report_rck_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7159099470552366682'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, id);
            },
            error: function(error) {
                IndexPage.onError(7159099470552366682);

                IndexPage.sleep(element, id);
            }
        });
    }

    static onDownloadDossierRckOck(element, id) {
        IndexPage.beforeReport("Формируется выгрузка из досье РЦК/ОЦК...");

        IndexPage.awake(element, id);

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7248569681397643041",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка из досье РЦК/ОЦК сформирована!", "report_col_ock_rck/rck_kval_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7248569681397643041'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, id);
            },
            error: function(error) {
                IndexPage.sleep(element, id);

                IndexPage.onError(7248569681397643041);
            }
        });
    }

    static onDownloadDossierRckOckSS(id) {

    }

    static hideMessageBox() {
        $("#message").css("visibility", "hidden");
    }

    static beforeReport(message) {
        $("#loader").css("visibility", "visible");

        const messageElement = $("#message");
        messageElement.css("color", "whitesmoke");
        messageElement.css("visibility", "visible");
        messageElement.html(message);
    }

    static afterReport(message, path) {
        const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/" + path;

        var link= document.createElement('a');
        document.body.appendChild(link);
        link.href = fileURL;
        link.rel = "nofollow";
        link.click();

        $("#loader").css("visibility", "hidden");

        $("#message").html(message);

        setTimeout(IndexPage.hideMessageBox, 15000);
    }

    static onError(id) {
        $("#loader").css("visibility", "hidden");

        const messageElement = $("#message");

        messageElement.css("color", "hotpink");
        messageElement.html("Системная ошибка! Смотрите лог шаблона документа " + id);

        console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
    }

    static sleep(element, id) {
        $("#" + element.id).removeClass("go-to-up");
        $("#" + element.id).addClass("go-to-down");

        const cardElement = $("#" + id);
        cardElement.removeClass("awake");
        cardElement.addClass("sleep");
    }

    static awake(element, id) {
        $("#" + element.id).removeClass("go-to-down");
        $("#" + element.id).addClass("go-to-up");

        const cardElement = $("#" + id);
        cardElement.removeClass("sleep");
        cardElement.addClass("awake");
    }
}