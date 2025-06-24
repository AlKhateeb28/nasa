var selectedOption = null;

class EditPage extends Object {
    constructor() {
        super();
    }

    static afterLoad() {
        $("#date").mask("99.99.9999");

        EditPage.addOption("serial", "РП", 111);
        EditPage.addOption("serial", "Т", 112);
    }

    static addOption(elementId, name, index) {
        $("#" + elementId).append(Common.getTemplate("option_element_template"));

        $("#option").attr("id", "option_" + index);
        let optionElement = $("#option_" + index)
        optionElement.html(name);
        optionElement.val(index);

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
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7169385969806241611" + userIdParameter + activeCode,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    EditPage.refreshElements("disable-button", "enable-button", false);

                    $("#person").html(data.personName);

                    if (data.org_code != null) {
                        $("#organization").html(data.org_code + ", " + data.org_name);
                    }

                    $("#rp_group").empty();
                    data.rpProgram.forEach((element, index) => {
                        const optionElement = EditPage.addOption("rp_group", element.name, element.index);

                        optionElement.attr("data-dossier-index", element.index);
                        optionElement.attr("data-cert-type-id", element.certificateTypeId);
                        optionElement.attr("data-cert", element.serial);
                    });

                    $("#main_group").empty();
                    data.baseProgram.forEach((element, index) => {
                        const optionElement = EditPage.addOption("main_group", element.name, element.index);

                        optionElement.attr("data-dossier-index", element.index);
                        optionElement.attr("data-cert-type-id", element.certificateTypeId);
                        optionElement.attr("data-cert", element.serial);
                    });

                    $("#additional_group").empty();
                    data.extraProgram.forEach((element, index) => {
                        const optionElement = EditPage.addOption("additional_group", element.name, element.index);

                        optionElement.attr("data-dossier-index", element.index);
                        optionElement.attr("data-cert-type-id", element.certificateTypeId);
                        optionElement.attr("data-cert", element.serial);
                    });

                    if (programId !== undefined) {
                        $("#program").val(programId);
                    }

                    $("#result").val(data.certificate_result);
                    $("#certificate_date").val(data.certificate_date);


                    const selectedOption = $('#program').find(":selected");

                    const serialElement = $("#serial");
                    serialElement.val(selectedOption.attr("data-cert"));


                    if (data.certificate_result.toString().length > 0) {
                        if (data.certificate_result === "Сертифицировать") {
                            EditPage.refreshElements("enable-button", "disable-button", true);
                        }
                    } else {
                        EditPage.refreshElements("disable-button", "enable-button", false);
                    }

                    if(data.flag === 1) {
                        $("#notification").prop("checked", true);
                    } else {
                        $("#notification").prop("checked", false);
                    }

                    if (data.isCollaboratorExist) {
                        $("#person").attr("data-exist", 1);
                    } else {
                        $("#person").attr("data-exist", 0);


                        EditPage.showMessageBox("success-response", "error-response", "Сотрудник не найден!");

                        EditPage.disableAllElements();
                    }

                    EditPage.validateDeleteButtonAccess(data.isDeleteAvailable);
                } else {
                    console.log("Error: " + data.errorMessage);
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

        $("#certificate_date").attr("disabled", disable);
        $("#result").attr("disabled", disable);
    }

    static onProgramChange() {
        const selectedOption = $('#program').find(":selected");

        this.getJson(selectedOption.attr("data-dossier-index"), selectedOption.val());
    }

    static disableAllElements() {
        $("#program").attr("disabled", true);

        this.refreshElements("enable-button", "disable-button", true);
    }

    static save() {
        const programElement = $("#program");

        selectedOption = programElement.find(":selected");

        const resultElement = $("#result");
        const certificateDateElement = $("#certificate_date");

        if(resultElement.val() === null) {
            alert("Выберите результат сертификации.");
            return;
        }

        if(resultElement.val() === "Сертифицировать" && certificateDateElement.val().length === 0) {
            alert("Введите дату сертификации.");

            certificateDateElement.focus();
            return;
        }

        const program = programElement.find(":selected").html().replaceAll("⚐ ", "").replaceAll("⚑ ", "");

        const parameters = `&person_id=${$("#person").attr("data-id")}` +
            `&program=${program}` +
            `&res=${resultElement.val()}` +
            `&cert=${certificateDateElement.val()}` +
            `&serial=${$("#serial").val()}` +
            `&noti=${$("#notification").prop("checked")}` +
            `&code=${programElement.find(":selected").attr("data-dossier-index")}` +
            `&type=${programElement.find(":selected").attr("data-cert-type-id")}`;

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7170712277311337342" + parameters,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    EditPage.showMessageBox("error-response", "success-response", "Досье сохранено.");

                    EditPage.setTimeoutOnMessageBox();

                    $("#main_group").empty();
                    $("#additional_group").empty();

                    EditPage.getJson(data.code, data.code);
                } else {
                    EditPage.showMessageBox("success-response",  "error-response", "Ошибка. Детали в логе 'agent_7170712277311337342'!");

                    EditPage.setTimeoutOnMessageBox();

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static delete() {
        if(!confirm("Удалить ошибочный сертификат?")) {
            return;
        }

        const programElement = $("#program");

        selectedOption = programElement.find(":selected");

        const program = selectedOption.html().replaceAll("⚐ ", "").replaceAll("⚑ ", "");

        const parameters = `&person_id=${$("#person").attr("data-id")}` +
            `&code=${selectedOption.attr("data-dossier-index")}` +
            `&noti=${$("#notification").prop("checked")}` +
            `&text=${program}`;

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7170770401108980357" + parameters,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    EditPage.showMessageBox("error-response", "success-response", "Сертификат удален.");

                    EditPage.setTimeoutOnMessageBox();

                    $("#main_group").empty();
                    $("#additional_group").empty();

                    EditPage.getJson(data.activeCode, data.activeCode);
                } else {
                    EditPage.showMessageBox("success-response",  "error-response", "Ошибка. Детали в логе 'agent_7170770401108980357'!");

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
        if($("#result").val() === "Сертифицировать") {
            const certificateButton = $("#certificate_button");
            certificateButton.attr("disabled", false);
            certificateButton.removeClass("disable-button");
            certificateButton.addClass("enable-button");

            $("#certificate_date").attr("disabled", false);
        }
    }

    static validateDeleteButtonAccess(isDeleteAvailable) {
        const deleteButtonElement = $("#delete_button");

        if(parseInt(isDeleteAvailable) === 0) {
            deleteButtonElement.attr("disabled", true);
            deleteButtonElement.removeClass("enable-button");
            deleteButtonElement.addClass("disable-button");
        } else {
            deleteButtonElement.attr("disabled", false);
            deleteButtonElement.removeClass("disable-button");
            deleteButtonElement.addClass("enable-button");
        }
    }
}