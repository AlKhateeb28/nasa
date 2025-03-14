var selectedOption = null;

class EditPage extends Object {
    constructor() {
        super();
    }

    static afterLoad() {
        $("#date").mask("99.99.9999");

        EditPage.addOption("serial", "ВТ", "ВТ");
        EditPage.addOption("serial", "К", "К");
    }

    static addOption(elementId, name, value, code, type) {
        $("#" + elementId).append(Common.getTemplate("option_element_template"));

        $("#option").attr("id", "option_" + value);
        let optionElement = $("#option_" + value)
        optionElement.html(name);
        optionElement.val(value);
        optionElement.attr("data-code", code);
        optionElement.attr("data-type", type);

        return optionElement;
    }

    static getJson(activeCode, programId) {
        let userIdParameter = "&person_id=" + $("#person").attr("data-id");

        if(activeCode === undefined) {
            activeCode = "";
        } else {
            activeCode = "&active_code=" + activeCode;
        }

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7126548019478755931" + userIdParameter + activeCode,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    EditPage.refreshElements("disable-button", "enable-button", false);
                    if($('#program').find(":selected").attr("data-type") === "BASE") {
                        EditPage.refreshEducationBlock("disable-button", "enable-button", false);
                    } else {
                        EditPage.refreshEducationBlock("disable-button", "enable-button", false);
                    }

                    $("#person").html(data.personName);

                    if (data.org_code != null) {
                        $("#organization").html(data.org_code + ", " + data.org_name);
                    }

                    $("#main_group").empty();

                    data.baseProgram.forEach((element, index) => {
                        EditPage.addOption("main_group", element.name, element.id, element.code, element.type);
                    });

                    $("#additional_group").empty();

                    data.extraProgram.forEach((element, index) => {
                        const optionElement = EditPage.addOption("additional_group", element.name, element.id, element.code, element.type);

                        if (data.takenCount === 6 && parseInt(element.isTaken) == 0) {
                            optionElement.attr("disabled", true);
                        }
                    });

                    if(programId !== undefined) {
                        $("#program").val(programId);
                    }

                    $("#result").val(data.certificate_result);
                    $("#education_date").val(data.education_date);
                    $("#certificate_date").val(data.certificate_date);

                    const serialElement = $("#serial");

                    if(data.certificate_result.toString().length > 0) {
                        if(data.certificate_result === "сертифицирован") {
                            EditPage.refreshElements("enable-button", "disable-button", true);
                            EditPage.refreshEducationBlock("enable-button", "disable-button", true);

                            serialElement.val(data.serial);
                        } else {
                            serialElement.val("ВТ");
                        }
                    } else {
                        EditPage.refreshElements("disable-button", "enable-button", false);

                        if($('#program').find(":selected").attr("data-type") === "BASE") {
                            EditPage.refreshEducationBlock("enable-button", "disable-button", true);
                        } else {
                            EditPage.refreshEducationBlock("disable-button", "enable-button", false);
                        }

                        serialElement.val("ВТ");
                    }

                    $("#notification").prop("checked", false);

                    if(data.isCollaboratorExist) {
                        $("#person").attr("data-exist", 1);
                    } else {
                        $("#person").attr("data-exist", 0);


                        EditPage.showMessageBox("success-response",  "error-response", "Сотрудник не найден!");

                        EditPage.disableAllElements();
                    }
                } else {
                    console.log("Error: " + data.errorMessage);
                }

                if(parseInt(data.sameDossiers) > 1) {
                    EditPage.showMessageBox("success-response",  "error-response", "Проверьте сотрудника с ID " + data.personId + ". Найдено <b>" + data.sameDossiers + "</b> досье!");

                    EditPage.disableAllElements();
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static refreshElements(removedClass, enabledClass, disable, isResult) {
        const certificateButton = $("#certificate_button");
        certificateButton.attr("disabled", disable);
        certificateButton.removeClass(removedClass);
        certificateButton.addClass(enabledClass);

        const saveButton = $("#save_button");
        saveButton.attr("disabled", disable);
        saveButton.removeClass(removedClass);
        saveButton.addClass(enabledClass);

        $("#notification").attr("disabled", disable);
        $("#certificate_date").attr("disabled", disable);
        $("#result").attr("disabled", disable);
        $("#serial").attr("disabled", disable);
    }

    static refreshEducationBlock(removedClass, enabledClass, disable) {
        const educationButton = $("#education_button");

        educationButton.attr("disabled", disable);
        educationButton.removeClass(removedClass);
        educationButton.addClass(enabledClass);

        $("#education_date").attr("disabled", disable);
    }

    static onProgramChange() {
        const selectedOption = $('#program').find(":selected");

        this.getJson(selectedOption.attr("data-code"), selectedOption.val());
    }

    static disableAllElements() {
        $("#program").attr("disabled", true);

        this.refreshElements("enable-button", "disable-button", true);
        this.refreshEducationBlock("enable-button", "disable-button", true);
    }

    static save() {
        const programElement = $("#program");

        selectedOption = programElement.find(":selected");

        const programMode = selectedOption.attr("data-type");
        const resultElement = $("#result");
        const certificateDateElement = $("#certificate_date");

        if(resultElement.val() === null) {
            alert("Выберите результат сертификации.");
            return;
        }

        if(resultElement.val() === "сертифицирован" && certificateDateElement.val().length === 0) {
            alert("Введите дату сертификации.");

            certificateDateElement.focus();
            return;
        }

        const parameters = `&person_id=${$("#person").attr("data-id")}&prog=${programElement.val()}&mode=${programMode}&res=${resultElement.val()}&edu=${$("#education_date").val()}` +
            `&cert=${certificateDateElement.val()}&serial=${$("#serial").val()}&noti=${$("#notification").prop("checked")}&code=${programElement.find(":selected").attr("data-code")}`;

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7127204375175819280" + parameters,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    EditPage.showMessageBox("error-response", "success-response", "Досье сохранено.");

                    EditPage.setTimeoutOnMessageBox();

                    $("#main_group").empty();
                    $("#additional_group").empty();

                    EditPage.getJson(data.activeCode, selectedOption.val());
                } else {
                    EditPage.showMessageBox("success-response",  "error-response", "Ошибка. Детали в логе 'agent_7127204375175819280'!");

                    EditPage.setTimeoutOnMessageBox();

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static setTimeoutOnMessageBox() {
        setTimeout(EditPage.hideMessageBox, 10000);
    }

    static hideMessageBox() {
        $("#message_box").css("display", "none");
    }

    static showMessageBox(removedClass, enabledClass, message) {
        const messageElement = $("#message");
        messageElement.removeClass(removedClass);
        messageElement.addClass(enabledClass);
        messageElement.html(message);

        $("#message_box").css("display", "block");
    }

    static onResultChange() {
        if($("#result").val() === "сертифицирован") {
            const certificateButton = $("#certificate_button");
            certificateButton.attr("disabled", false);
            certificateButton.removeClass("disable-button");
            certificateButton.addClass("enable-button");

            $("#notification").attr("disabled", false);
            $("#certificate_date").attr("disabled", false);
            $("#serial").attr("disabled", false);
        }
    }
}