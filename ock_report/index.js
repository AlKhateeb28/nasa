function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

class IndexPage extends Object {
    constructor() {
        super();
    }

    static onDownload() {
        $("#loader").css("visibility", "visible");

        const messageElement = $("#message");
        messageElement.css("color", "whitesmoke");
        messageElement.css("visibility", "visible");
        messageElement.html("Формируется выгрузка ОЦК...");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7137494958071545430",
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/report_ock_2025/report_ock_" + getCurrentDate() + ".xlsx";

                    var link= document.createElement('a');
                    document.body.appendChild(link);
                    link.href = fileURL;
                    link.rel = "nofollow";
                    link.click();

                    $("#loader").css("visibility", "hidden");

                    messageElement.html("Выгрузка ОЦК сформирована!");

                    setTimeout(IndexPage.hideMessageBox, 15000);
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                $("#loader").css("visibility", "hidden");

                messageElement.css("color", "hotpink");
                messageElement.html("Системная ошибка!");

                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static hideMessageBox() {
        $("#message").css("visibility", "hidden");
    }
}