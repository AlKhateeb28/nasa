class Page extends Object {
    constructor() {
        super();
    }

    static afterLoad() {
        $("#date").mask("99.99.9999");

        //Page.addOption("main_group", "Программа «Анализ эффективности оборудования (OEE)»", "1");
        //Page.addOption("additional_group", "&#8730; Дополнительная 1", "11");

        Page.addOption("serial", "ВТ", "ВТ");
        Page.addOption("serial", "К", "К");
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

    static getJson(activeCode) {
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
                    const programElement = $("#program");

                    if(parseInt(programElement.attr("data-loaded")) === 0) {
                        $("#person").html(data.personName);

                        if (data.org_code != null) {
                            $("#organization").html(data.org_code + ", " + data.org_name);
                        }

                        data.baseProgram.forEach((element, index) => {
                            Page.addOption("main_group", element.name, element.id, element.code, element.type);
                        });

                        data.extraProgram.forEach((element, index) => {
                            const optionElement = Page.addOption("additional_group", element.name, element.id, element.code, element.type);

                            if(data.takenCount === 6 && parseInt(element.isTaken) == 0) {
                                optionElement.attr("disabled", true);
                            }
                        });

                        programElement.attr("data-loaded", "1");
                    }

                    $("#result").val(data.certificate_result);
                    $("#education_date").val(data.education_date);

                    $("#certificate_date").val(data.certificate_date);

                    const serialElement = $("#serial");

                    serialElement.val(data.serial);

                    if(data.certificate_result.toString().length > 0) {
                        Page.refreshElements("enable-button", "disable-button", true);
                        Page.refreshEducationBlock("enable-button", "disable-button", true);
                    } else {
                        Page.refreshElements("disable-button", "enable-button", false);

                        if($('#program').find(":selected").attr("data-type") === "BASE") {
                            Page.refreshEducationBlock("enable-button", "disable-button", true);
                        } else {
                            Page.refreshEducationBlock("disable-button", "enable-button", false);
                        }

                        serialElement.val("ВТ");
                    }

                    $("#notification").prop("checked", false);
                } else {
                    console.log("Error: " + data.errorMessage);
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static refreshElements(removedClass, enabledClass, disable) {
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
        this.getJson($('#program').find(":selected").attr("data-code"));
    }
}