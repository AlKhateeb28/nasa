function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

class IndexPage extends Object {
    constructor() {
        super();
    }

    static createReport() {
        console.log("Started");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7161948549086699962&region_id=" + $("#region").html(),
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.afterReport("outcast_report/participant_report_" + getCurrentDate() + ".xlsx");
                } else {
                    const messageElement = $("#message");

                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7161948549086699962'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                IndexPage.onError(error, 7159099470552366682);
            }
        });
    }

    static afterReport(path) {
        $("#caption").html("Скачиваем файл...");

        const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/" + path;

        var link= document.createElement('a');
        document.body.appendChild(link);
        link.href = fileURL;
        link.rel = "nofollow";
        link.click();

        setTimeout(IndexPage.closeWindow, 1000);
    }

    static closeWindow() {
        window.close();
    }

    static onError(error, id) {
        const messageElement = $("#message");

        messageElement.css("color", "hotpink");
        messageElement.html("Системная ошибка! Смотрите лог шаблона документа " + id);

        console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
    }
}