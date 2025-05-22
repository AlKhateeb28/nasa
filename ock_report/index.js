function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

class IndexPage extends Object {
    constructor() {
        super();
    }

    static onDownloadOCK() {
        IndexPage.beforeReport("Формируется выгрузка ОЦК ...");

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
            },
            error: function(error) {
                IndexPage.onError();
            }
        });
    }

    static onDownloadOCKBNO() {
        IndexPage.beforeReport("Формируется выгрузка ОЦК БНО...");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7151616261867663994",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка ОЦК БНО сформирована!", "report_ock_2025/report_ock_bno_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7151616261867663994'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                IndexPage.onError();
            }
        });
    }

    static onDownloadRCK() {
        IndexPage.beforeReport("Формируется выгрузка РЦК...");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7159099470552366682",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("Выгрузка РЦКсформирована!", "report_ock_2025/report_rck_" + getCurrentDate() + ".xlsx");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7159099470552366682'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                IndexPage.onError();
            }
        });
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

    static onError() {
        $("#loader").css("visibility", "hidden");

        messageElement.css("color", "hotpink");
        messageElement.html("Системная ошибка!");

        console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
    }
}