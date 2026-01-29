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

    static onDownloadOCK(element, taskPrefix) {
        //IndexPage.beforeReport();

        IndexPage.awake(element, taskPrefix);

        $("#task_message_" + taskPrefix).html("Формируется...");

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7137494958071545430",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport(taskPrefix,"report_ock_2025/report_ock_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);

            },
            error: function(error) {
                IndexPage.onError(7137494958071545430);

                IndexPage.sleep(element, taskPrefix);
            }
        });
    }

    static onDownloadOCKBNO(element, taskPrefix) {
        //IndexPage.beforeReport();

        IndexPage.awake(element, taskPrefix);

        $("#task_message_" + taskPrefix).html("Формируется...");

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7151616261867663994",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport(taskPrefix, "report_ock_2025/report_ock_bno_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7151616261867663994'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);
            },
            error: function(error) {
                IndexPage.onError(7151616261867663994);

                IndexPage.sleep(element, taskPrefix);
            }
        });
    }

    static onDownloadRCK(element, taskPrefix) {
        //IndexPage.beforeReport();

        IndexPage.awake(element, taskPrefix);

        $("#task_message_" + taskPrefix).html("Формируется...");

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7159099470552366682",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport(taskPrefix, "report_ock_2025/report_rck_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7159099470552366682'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);
            },
            error: function(error) {
                IndexPage.onError(7159099470552366682);

                IndexPage.sleep(element, taskPrefix);
            }
        });
    }

    static onDownloadDossierRckOck(element, taskPrefix) {
        //IndexPage.beforeReport();

        IndexPage.awake(element, taskPrefix);

        $("#task_message_" + taskPrefix).html("Формируется...");

        const messageElement = $("#message");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7248569681397643041",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport(taskPrefix, "report_col_ock_rck/rck_kval_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7248569681397643041'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);
            },
            error: function(error) {
                IndexPage.sleep(element, taskPrefix);

                IndexPage.onError(7248569681397643041);
            }
        });
    }

    static onDownloadDossierRckOckSS(id) {

    }

    static hideMessageBox() {
        $("#message").css("visibility", "hidden");
    }

    static beforeReport() {
        $("#loader").css("visibility", "visible");
    }

    static afterReport(taskPrefix, path) {
        const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/" + path;

        var link= document.createElement('a');
        document.body.appendChild(link);
        link.href = fileURL;
        link.rel = "nofollow";
        link.click();

        $("#loader").css("visibility", "hidden");

        $("#task_message_" + taskPrefix).html("");
    }

    static onError(id) {
        $("#loader").css("visibility", "hidden");

        const messageElement = $("#message");

        messageElement.css("color", "hotpink");
        messageElement.html("Системная ошибка! Смотрите лог шаблона документа " + id);

        console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
    }

    static sleep(element, taskPrefix) {
        $("#" + element.id).removeClass("go-to-up");
        $("#" + element.id).addClass("go-to-down");

        const cardElement = $("#card_" + taskPrefix);
        cardElement.removeClass("awake");
        cardElement.addClass("sleep");
    }

    static awake(element, taskPrefix) {
        $("#" + element.id).removeClass("go-to-down");
        $("#" + element.id).addClass("go-to-up");

        const cardElement = $("#card_" + taskPrefix);
        cardElement.removeClass("sleep");
        cardElement.addClass("awake");
    }
}