let tasks = [];

let task = {};
task.name = "ock";
task.isRunning = false;
tasks.push(task);

task = {};
task.name = "ock_bno";
task.isRunning = false;
tasks.push(task);

task = {};
task.name = "rck";
task.isRunning = false;
tasks.push(task);

task = {};
task.name = "ock_rck";
task.isRunning = false;
tasks.push(task);

task = {};
task.name = "ock_rck_ss";
task.isRunning = false;
tasks.push(task);

function isTaskRunning(name) {
    let isRunning = false;

    tasks.forEach((task, index) => {
        if(task.name === name) {
            isRunning = task.isRunning;
        }
    });

    return isRunning;
}

function setIsRunning(name, isRunning) {
    tasks.forEach((task, index) => {
        if(task.name === name) {
            task.isRunning = isRunning;
        }
    });
}

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
        if(isTaskRunning(taskPrefix)) {
            return;
        }

        setIsRunning(taskPrefix, true);

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

                    IndexPage.getRunningTime("7137494958071545430", "_ock");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            },
            error: function(error) {
                IndexPage.onError(7137494958071545430);

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            }
        });
    }

    static onDownloadOCKBNO(element, taskPrefix) {
        if(isTaskRunning(taskPrefix)) {
            return;
        }

        setIsRunning(taskPrefix, true);

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

                    IndexPage.getRunningTime("7151616261867663994", "_ock_bno");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7151616261867663994'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            },
            error: function(error) {
                IndexPage.onError(7151616261867663994);

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            }
        });
    }

    static onDownloadRCK(element, taskPrefix) {
        if(isTaskRunning(taskPrefix)) {
            return;
        }

        setIsRunning(taskPrefix, true);

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

                    IndexPage.getRunningTime("7159099470552366682", "_rck");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7159099470552366682'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            },
            error: function(error) {
                IndexPage.onError(7159099470552366682);

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            }
        });
    }

    static onDownloadDossierRckOck(element, taskPrefix) {
        if(isTaskRunning(taskPrefix)) {
            return;
        }

        setIsRunning(taskPrefix, true);

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

                    IndexPage.getRunningTime("7248569681397643041", "_ock_rck");
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7248569681397643041'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                IndexPage.sleep(element, taskPrefix);

                setIsRunning(taskPrefix, false);
            },
            error: function(error) {
                IndexPage.sleep(element, taskPrefix);

                IndexPage.onError(7248569681397643041);

                setIsRunning(taskPrefix, false);
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

    static getRunningTime(templateId, taskSuffix) {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7248982558480427455&id=" + templateId,
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    if(parseInt(data.seconds) === 0) {
                        $("#running_time" + taskSuffix).html("~ ? сек");

                        const svgElement = $("#svg" + taskSuffix);
                        svgElement.empty();
                        svgElement.append(unknownRunningMan);
                    } else if(parseInt(data.seconds) < 60) {
                        $("#running_time" + taskSuffix).html("~ " + data.seconds + " сек");

                        const svgElement = $("#svg" + taskSuffix);
                        svgElement.empty();
                        svgElement.append(runningMan);
                    } else {
                        $("#running_time" + taskSuffix).html("~ " + data.minutes + " мин");

                        if(parseInt(data.minutes) <= 5) {
                            const svgElement = $("#svg" + taskSuffix);
                            svgElement.empty();
                            svgElement.append(runningMan);
                        } else {
                            const svgElement = $("#svg" + taskSuffix);
                            svgElement.empty();
                            svgElement.append(slowRunningMan);
                        }
                    }
                } else {
                    messageElement.css("color", "hotpink");
                    messageElement.html("Ошибка! Подробности в логе 'agent_7248569681397643041'");

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                IndexPage.onError(7248982558480427455);
            }
        });
    }
}