let selectedCertificateId = null;
let certificates = [];

class EditPage extends Object {
    constructor() {
        super();
    }

    static initialize(isSelectRow, newIds) {
        $("#loader").css("visibility", "visible");
        $("#buttons_box").css("display", "none");

        const paramsElement = $("#params");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7134672182251616310&person_id=" + paramsElement.attr("data-id") + "&type=" + paramsElement.attr("data-type"),
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                certificates = [];

                if(data.errorMessage.indexOf("#") < 0) {
                    $("#person_name").html(data.personName);
                    $("#position_name").html("Должность: " + data.positionName);
                    $("#inn_org_name").html(data.inn + ", " + data.organizationName);

                    const certificateTypeElement = $("#cert_type");
                    certificateTypeElement.html("Тип сертификатов: " + data.certificateTypeName);
                    certificateTypeElement.attr("data-id", data.certificateTypeId);

                    $("#card_table").empty();
                    $("#card_table").append(Common.getTemplate("header_row_template"));

                    data.certificates.forEach((certificate, index) => {
                        const element = {};
                        element.id = certificate.id;
                        element.index = index;
                        element.checked = false;
                        element.serial = certificate.serial;
                        element.number = certificate.number;

                        certificates.push(element);

                        $("#card_table").append(Common.getTemplate("certificate_row_template"));

                        $("#row").attr("id", "row_" + index);
                        $("#row_" + index).attr("data-id", certificate.id);

                        $("#row_check").attr("id", "row_check_" + index);
                        $("#row_check_" + index).attr("data-id", certificate.id);

                        $("#serial").attr("id", "serial_" + index);
                        $("#serial_" + index).html(certificate.serial);

                        $("#number").attr("id", "number_" + index);
                        $("#number_" + index).html(certificate.number);

                        $("#delivery").attr("id", "delivery_" + index);
                        $("#delivery_" + index).html(certificate.deliveryDate);

                        $("#expire").attr("id", "expire_" + index);
                        $("#expire_" + index).html(certificate.expireDate);

                        $("#valid").attr("id", "valid_" + index);
                        if (certificate.isValid) {
                            $("#valid_" + index).html("Да");
                        } else {
                            $("#valid_" + index).html("Нет");
                        }

                        $("#contract").attr("id", "contract_" + index);
                        $("#contract_" + index).html(certificate.contract);

                        $("#programs").attr("id", "programs_" + index);
                        $("#programs_" + index).html(certificate.programs);
                    });

                    if(data.certificates.length === 0) {
                        EditPage.disableButton("delete_button");
                        EditPage.disableButton("pdf_button");
                        EditPage.disableButton("word_button");
                    }

                    if(isSelectRow !== undefined && isSelectRow) {
                        $(".row").removeClass("selected-row");
                        $("#card_table").children().eq(1).addClass("selected-row");
                    }

                    $("#buttons_box").css("display", "block");

                    EditPage.checkRowsIfSaved(newIds);
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                $("#loader").css("visibility", "hidden");
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                $("#loader").css("visibility", "hidden");
            }
        });
    }

    static enableButton(id) {
        const buttonElement = $("#" + id);
        buttonElement.prop("disabled", false);
        buttonElement.removeClass("enable-button");
        buttonElement.removeClass("disable-button");
        buttonElement.addClass("enable-button");
    }

    static disableButton(id) {
        const buttonElement = $("#" + id);
        buttonElement.prop("disabled", true);
        buttonElement.removeClass("enable-button");
        buttonElement.removeClass("disable-button");
        buttonElement.addClass("disable-button");
    }

    static onChooseCertificate(element) {
        const selectedRow = $("#" + element.id);

        $(".row").removeClass("selected-row");
        selectedRow.addClass("selected-row");

        selectedCertificateId = selectedRow.attr("data-id");
    }

    static onCreate() {
        EditPage.openCertificate();
    }

    static onDelete() {
        if(selectedCertificateId === null) {
            alert("Выберите сертификат!");
            return;
        }

        $("#loader").css("visibility", "visible");

        if(confirm("Удалить сертификат(ы)?")) {
            const deletedList = [];

            certificates.forEach((certificate, index) => {
                if(certificate.checked) {
                    const element = {};
                    element.id = certificate.id;
                    element.index = certificate.index;

                    deletedList.push(element);
                }
            });

            if(deletedList.length === 0) {
                const element = {};
                element.id = selectedCertificateId;
                element.index = -1;

                for(let i = 0; i < certificates.length; i++) {
                    if(parseInt(certificates[i].id) === parseInt(selectedCertificateId)) {
                        element.index = i;
                        break;
                    }
                }

                deletedList.push(element);
            }

            deletedList.forEach((certificate, index) => {
                $.ajax({
                    url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7135042110124703382&id=" + certificate.id,
                    async: true,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        if (data.errorMessage.indexOf("#") < 0) {
                            EditPage.initialize();

                            EditPage.showMessageBox("error-response", "success-response", "Сертификат(ы) удален(ы).");
                            EditPage.setTimeoutOnMessageBox();

                            certificates.splice(certificate.index, 1);
                        } else {
                            EditPage.showMessageBox("success-response", "error-response", "Ошибка. Детали в логе 'agent_7135042110124703382'!");
                            EditPage.setTimeoutOnMessageBox();

                            console.log("Error: " + data.errorMessage.indexOf("#"));
                        }

                        $("#loader").css("visibility", "hidden");

                        selectedCertificateId = null;
                    },
                    error: function (error) {
                        console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                        $("#loader").css("visibility", "hidden");
                    }
                });
            });
        }
    }

    static onPDF() {
        if(selectedCertificateId === null) {
            alert("Выберите сертификат!");
            return;
        }

        window.open(
            "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_print_form.html?print_form_id=7264581159128683792&object_id=" + selectedCertificateId + "&sid=7863045222699914512",
            "_blank"
        );
    }

    static onWord() {
        if(selectedCertificateId === null) {
            alert("Выберите сертификат!");
            return;
        }

        const selectedList = [];

        certificates.forEach((certificate, index) => {
            if(certificate.checked) {
                const element = {};
                element.id = certificate.id;
                element.serial = certificate.serial;
                element.number = certificate.number;

                selectedList.push(element);
            }
        });

        if(selectedList.length === 0) {
            const selectedCertificate = EditPage.getCertificateById(selectedCertificateId);

            if(selectedCertificate != null) {
                const element = {};
                element.id = selectedCertificate.id;
                element.serial = selectedCertificate.serial;
                element.number = selectedCertificate.number;

                selectedList.push(element);
            }
        }

        selectedList.forEach((certificate, index) => {
            const fileName = $("#person_name").html().replaceAll(" ", "_") + "_" + certificate.serial + "-" + certificate.number + ".docx";

            window.open(
                "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_print_form.html?print_form_id=7265701810242785209&object_id=" + certificate.id + "&sid=7635850167628340003&file_name=" + fileName,
                "_blank"
            );
        });
    }

    static openCertificate() {
        $("#edit_box").css("display", "block");

        const deliveryDateElement = $("#edit_delivery_date");

        deliveryDateElement.val("");
        $("#edit_expire_date").val("");
        $("#edit_contract").val("");

        const programsElement = $("#edit_programs");
        programsElement.val("");
        programsElement.prop("disabled", false);
        $("#edit_valid").prop("checked", true);

        $("#pref_parent").empty();

        programs.forEach((program, index) => {
            $("#pref_parent").append(Common.getTemplate("pref_template"));

            $("#pref").attr("id", "pref_" + index);
            const prefElement = $("#pref_" + index);
            prefElement.html(program);
        });

        deliveryDateElement.focus();
    }

    static onClose() {
        $("#edit_box").css("display", "none");
    }

    static onSave() {
        const deliveryElement = $("#edit_delivery_date");

        if(deliveryElement.val().length === 0) {
            alert("Введите дату выдачи сертификата!");
            return;
        }

        $("#loader").css("visibility", "visible");

        $("#edit_box").css("display", "none");

        let params = "";

        params += "&person_id=" + $("#params").attr("data-id");
        params += "&serial=" + $("#edit_serial").val();
        params += "&delivery=" + deliveryElement.val();
        params += "&expire=" + $("#edit_expire_date").val();
        params += "&valid=" + $("#edit_valid").prop("checked");
        params += "&contract=" + $("#edit_contract").val();
        params += "&type=" + $("#cert_type").attr("data-id");

        let programs = "";

        const children = $("#pref_parent").children();

        for(let i = 0; i < children.length; i++) {
            if(parseInt($("#" + children[i].id).attr("picked")) === 1) {
                programs += $("#" + $("#pref_parent").children()[i].id).html() + ",";
            }
        };

        if(programs.length === 0) {
            params += "&programs=" + $("#edit_programs").val().replaceAll(", ", ",");
        } else {
            params += "&programs=" + programs.substring(0, programs.length - 1);
        }

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7134978122771741241" + params,
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    if(data.certificatesIds.length >= 1) {
                        selectedCertificateId = data.certificatesIds[0];

                        EditPage.initialize(true, data.certificatesIds);
                    } else {
                        selectedCertificateId = null;

                        EditPage.initialize();
                    }

                    EditPage.showMessageBox("error-response", "success-response", "Создан новый сертификат.");
                    EditPage.setTimeoutOnMessageBox();

                } else {
                    EditPage.showMessageBox("success-response",  "error-response", "Ошибка. Детали в логе 'agent_7134978122771741241'!");
                    EditPage.setTimeoutOnMessageBox();

                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                $("#loader").css("visibility", "hidden");

                EditPage.enableButton("delete_button");
                EditPage.enableButton("pdf_button");
                EditPage.enableButton("word_button");
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                $("#loader").css("visibility", "hidden");
            }
        });
    }

    static showMessageBox(removedClass, enabledClass, message) {
        const messageElement = $("#message");
        messageElement.removeClass(removedClass);
        messageElement.addClass(enabledClass);
        messageElement.html(message);

        $("#message_box").css("display", "block");
    }

    static setTimeoutOnMessageBox() {
        setTimeout(EditPage.hideMessageBox, 10000);
    }

    static hideMessageBox() {
        $("#message_box").css("display", "none");
    }

    static selectPreference(element) {
        const preferenceElement = $("#" + element.id);

        if(parseInt(preferenceElement.attr("picked")) === 0) {
            preferenceElement.attr("picked", 1);
            preferenceElement.addClass("preferences-picked");

            const programsElement = $("#edit_programs");
        } else {
            preferenceElement.attr("picked", 0);
            preferenceElement.removeClass("preferences-picked");
        }

        let pickedCount = 0;

        for(let i = 0; i < $("#pref_parent").children().length; i++) {
            if(parseInt($("#" + $("#pref_parent").children()[i].id).attr("picked")) === 1) {
                pickedCount++;

                break;
            }
            //console.log("ID: " + $("#pref_parent").children()[i].id + " Picked: " + $("#" + $("#pref_parent").children()[i].id).attr("picked"));
        };

        const programsElement =  $("#edit_programs");

        if(pickedCount > 0) {
            programsElement.val("");
            programsElement.prop("disabled", true);
        } else {
            programsElement.prop("disabled", false);
        }
    }

    static onHeaderCheckBoxChange(event) {
        if(event.currentTarget.checked) {
            certificates.forEach((certificate, index) => {
                certificate.checked = true;

                $("#row_check_" + index).prop("checked", true);
            });

            if(certificates.length > 0) {
                selectedCertificateId = certificates[0].id;

                $(".row").removeClass("selected-row");
                $("#card_table").children().eq(1).addClass("selected-row");
            }
        } else {
            certificates.forEach((certificate, index) => {
                certificate.checked = false;

                $("#row_check_" + index).prop("checked", false);
            });
        }
    }

    static onRowCheckBoxChange(element, event) {
        $("#header_check").prop("checked", false);

        const certificate = EditPage.getCertificateById($("#" + element.id).attr("data-id"));

        if(event.currentTarget.checked) {
            if(certificate != null) {
                certificate.checked = true;
            }
        } else {
            if(certificate != null) {
                certificate.checked = false;
            }
        }

        EditPage.verifyHeaderCheckbox();
    }

    static getCertificateById(id) {
        for(let i = 0; i < certificates.length; i++) {
            if(parseInt(certificates[i].id) === parseInt(id)) {
                return certificates[i];
            }
        }

        return null;
    }

    static verifyHeaderCheckbox() {
        let checkedCount = 0;

        certificates.forEach((certificate, index) => {
            if(certificate.checked) {
                checkedCount++;
            }
        });

        const headerChecker = $("#header_check");

        if(checkedCount === 0) {
            headerChecker.prop("indeterminate", false);
            headerChecker.prop("checked", false);
        } else if(checkedCount === certificates.length) {
            headerChecker.prop("indeterminate", false);
            headerChecker.prop("checked", true);
        } else {
            headerChecker.prop("indeterminate", true);
        }
    }

    static checkRowsIfSaved(newIds) {
        if(newIds != undefined) {
            certificates.forEach((certificate, index) => {
                certificate.checked = false;
                $("#row_check_" + certificate.index).prop("checked", false);

                for (let i = 0; i < newIds.length; i++) {
                    if (parseInt(certificate.id) === parseInt(newIds[i])) {
                        certificate.checked = true;
                        $("#row_check_" + certificate.index).prop("checked", true);

                        break;
                    }
                }
            });

            EditPage.verifyHeaderCheckbox();
        }
    }
}