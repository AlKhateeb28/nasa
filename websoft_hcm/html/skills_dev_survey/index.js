let educationProgramDropdown = null;
let isChangeFioDropdown = null;
let educationLevelDropdown = null;
let recieptMethodDropdown = null;
let canGetDocumentsDropdown = null;
let sexDropdown = null;

function initialize() {
    IMask(
        $("#start_date").get(0),
        {
            mask: Date,
            /*min: new Date(2018, 0, 1),
            max: new Date(2099, 0, 1),*/
            lazy: false
        }
    ).updateValue();

    educationProgramDropdown = new Dropdown("educationProgramDropdown", "education_program_dropdown");
    educationProgramDropdown.addOption(educationProgramDropdown.getDropdownId(), "Выберите программу из выпадающего списка", 0, true, true);
    $(".edu-program").each((index, box) => {
        educationProgramDropdown.addOption(educationProgramDropdown.getDropdownId(), $(box).text(), $(box).attr("data-id"));
    });

    $("#calendar_element").html(Calendar.getContent());

    $(".calendar-header").css("padding", "25px 0px 10px");
    $(".calendar-header").css("justify-content", "space-around");
    $(".calendar-header").css("background-color", "cornsilk");

    Calendar.initialize();
    Calendar.hide();

    isChangeFioDropdown = new Dropdown("isChangeFioDropdown", "is_change_fio");
    isChangeFioDropdown.addOption(isChangeFioDropdown.getDropdownId(), "Нет", "Нет", true);
    isChangeFioDropdown.addOption(isChangeFioDropdown.getDropdownId(), "Да", "Да");

    educationLevelDropdown = new Dropdown("educationLevelDropdown", "education_level");
    educationLevelDropdown.addOption(educationLevelDropdown.getDropdownId(), "Выберите значение из выпадающего списка", 0, true, true);
    educationLevelDropdown.addOption(educationLevelDropdown.getDropdownId(), "Высшее", "Высшее");
    educationLevelDropdown.addOption(educationLevelDropdown.getDropdownId(), "Среднее профессиональное", "Среднее профессиональное");
    educationLevelDropdown.addOption(educationLevelDropdown.getDropdownId(), "Я являюсь студентом", "Я являюсь студентом");

    IMask(
        $("#snils").get(0),
        {
            mask: "000-000-000 00",
            /*min: new Date(2018, 0, 1),
            max: new Date(2099, 0, 1),*/
            lazy: false
        }
    ).updateValue();

    IMask(
        $("#birth_date").get(0),
        {
            mask: Date,
            /*min: new Date(2018, 0, 1),
            max: new Date(2099, 0, 1),*/
            lazy: false
        }
    ).updateValue();

    recieptMethodDropdown = new Dropdown("recieptMethodDropdown", "reciept_method");
    recieptMethodDropdown.addOption(recieptMethodDropdown.getDropdownId(), "Лично в офисе в Москве", "Лично в офисе в Москве");
    recieptMethodDropdown.addOption(recieptMethodDropdown.getDropdownId(), "Почтой России (РФ и за рубеж)", "Почтой России (РФ и за рубеж)");

    canGetDocumentsDropdown = new Dropdown("canGetDocumentsDropdown", "can_get_documents");
    canGetDocumentsDropdown.addOption(canGetDocumentsDropdown.getDropdownId(), "Выберите значение из выпадающего списка", 0, true, true);
    canGetDocumentsDropdown.addOption(canGetDocumentsDropdown.getDropdownId(), "Подтверждаю", "Подтверждаю");
    canGetDocumentsDropdown.addOption(canGetDocumentsDropdown.getDropdownId(), "Не смогу получить документы указанным способом в течение 2-х месяцев после заполнения данной анкеты", "Не смогу получить документы указанным способом в течение 2-х месяцев после заполнения данной анкеты");

    sexDropdown = new Dropdown("sexDropdown", "sex_dropdown");
    sexDropdown.addOption(sexDropdown.getDropdownId(), "Выберите значение из выпадающего списка", 0, true, true);
    sexDropdown.addOption(sexDropdown.getDropdownId(), "Мужской", "Мужской");
    sexDropdown.addOption(sexDropdown.getDropdownId(), "Женский", "Женский");

    $(".survey").each((index, survey) => {
        const surveyElement = $("#survey_btn_" + $(survey).attr("data-step"));

        surveyElement.removeClass("disable-survey-btn");
        surveyElement.attr("data-id", $(survey).attr("data-id"));
        surveyElement.attr("title", $(survey).attr("data-name") + " | " + $(survey).attr("data-cr-date"));
    });
}

function showCalendar(elementId) {
    Calendar.afterSelectAction = elementId;
    Calendar.show();
}

function openAlertPopupWindow(message) {
    $("#popup_box").empty();

    const content = `
			<div style="margin-top: 10px; text-align: center;">${message}</div>			
		`;

    alertPopupWindow = new AlertPopupWindow("alertPopupWindow", "popup_box", content, "goToEventCalendar()");

    $("#alert_popup_btn").css("margin-left", "16rem");
}

function onSave(element) {
    $(element).addClass("group-btn-flash");

    $("#confirm_box").css("background-color", "#ffffff");
    $("#education_program_box").css("background-color", "#ffffff");
    $("#education_level_box").css("background-color", "#ffffff");
    $("#can_get_documents_box").css("background-color", "#ffffff");
    $("#sex_box").css("background-color", "#ffffff");

    if (educationProgramDropdown.getSelectedOptionValues().value === "0") {
        $("#education_program_box").css("background-color", "#ff7f50");

        openAlertPopupWindow("Выберите программу из списка в пункте 1!");

        $(element).removeClass("group-btn-flash");

        return;
    }

    if (educationLevelDropdown.getSelectedOptionValues().value === "0") {
        $("#education_level_box").css("background-color", "#ff7f50");

        openAlertPopupWindow("Выберите значение из списка в пункте 6!");

        $(element).removeClass("group-btn-flash");

        return;
    }

    if (sexDropdown.getSelectedOptionValues().value === "0") {
        $("#sex_box").css("background-color", "#ff7f50");

        openAlertPopupWindow("Выберите значение из списка в пункте 7!");

        $(element).removeClass("group-btn-flash");

        return;
    }

    if (!$("#confirmed").prop("checked")) {
        $("#confirm_box").css("background-color", "#ff7f50");

        openAlertPopupWindow("Подтвердите данные в пункте 12!");

        $(element).removeClass("group-btn-flash");

        return;
    }

    if (canGetDocumentsDropdown.getSelectedOptionValues().value === "0") {
        $("#can_get_documents_box").css("background-color", "#ff7f50");

        openAlertPopupWindow("Выберите значение из списка в пункте 13!");

        $(element).removeClass("group-btn-flash");

        return;
    }

    beforeReload("Сохраняем...");

    const survey = {};
    survey.educationProgramId = educationProgramDropdown.getSelectedOptionValues().value;
    survey.startDate = $("#start_date").val();
    survey.email = $("#email").val();
    survey.fio = $("#fio").val();
    survey.isChangeFio = isChangeFioDropdown.getSelectedOptionValues().value;
    survey.educationLevel = educationLevelDropdown.getSelectedOptionValues().value;
    survey.sex = sexDropdown.getSelectedOptionValues().value;
    survey.passport = $("#passport").val();
    survey.snils = $("#snils").val();
    survey.birthDate = $("#birth_date").val();
    survey.recieptMethod = recieptMethodDropdown.getSelectedOptionValues().value;
    if($("#confirmed").prop("checked")) {
        survey.confirmation = 1;
    } else {
        survey.confirmation = 0;
    }
    survey.canGetDocuments = canGetDocumentsDropdown.getSelectedOptionValues().value;

    const json = JSON.stringify(survey);

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7307692369401052853",
        async: true,
        type: "POST",
        data: {
            json: json
        },
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if(data.enableSave) {
                    let step = 1;

                    data.surveys.forEach((survey, index) => {
                        const surveyElement = $("#survey_btn_" + step);

                        surveyElement.removeClass("disable-survey-btn");
                        surveyElement.attr("data-id", survey.id);
                        surveyElement.attr("title", survey.name + " | " + survey.createdDate);

                        step++;
                    });

                    const notification = new Notification("Анкета сохранена!", 0, 15000);
                    notification.show(); 
                } else {
                    openAlertPopupWindow("Анкета с такой программой уже есть. Выберите другую программу.");
                }
            } else {
                const notification = new Notification("Ошибка при сохранении анкеты сохранена в консоли!", 2, 30000);
                notification.show();
                
                console.log("ERROR: " + data.errorMessage);
            }

            afterReload();
        },
        error: function (error) {
            const notification = new Notification("Ошибка при сохранении анкеты сохранена в консоли!", 2, 30000);
            notification.show();

            onError(error, "7307692369401052853");

            afterReload();
        }
    });
}

function onError(error, id) {
    console.log("ERROR (See " + id + " log file):" + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
}

function beforeReload(text) {
    if (text === undefined) {
        text = "";
    }

    $("#wait_caption").html(text)
    $("#wait").css("display", "block");
}

function afterReload() {
    $("#wait").css("display", "none");
}

function loadSurvey(element) {
    if($(element).attr("data-id") === "") {
        return;
    }

    $(element).addClass("group-btn-flash");

    beforeReload("Сохраняем...");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7307725910644353511&id=" + $(element).attr("data-id"),
        async: true,
        type: "GET",        
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                $("#education_program_box").css("background-color", "#ffffff");
                $("#education_level_box").css("background-color", "#ffffff");
                $("#confirm_box").css("background-color", "#ffffff");
                $("#can_get_documents_box").css("background-color", "#ffffff");
                
                educationProgramDropdown.selectOption(data.educationProgramId);
                educationProgramDropdown.disable();

                $("#start_date").val(data.startDate);
                $("#start_date").prop("disabled", true);
                
                $("#start_date_button").css("visibility", "hidden");
                
                $("#email").val(data.email);
                $("#email").prop("disabled", true);

                $("#fio").val(data.fio);
                $("#fio").prop("disabled", true);

                isChangeFioDropdown.selectOption(data.isChangeFio);
                isChangeFioDropdown.disable();

                educationLevelDropdown.selectOption(data.educationLevel);
                educationLevelDropdown.disable();

                $("#passport").val(data.passport);
                $("#passport").prop("disabled", true);

                $("#snils").val(data.snils);
                $("#snils").prop("disabled", true);


                $("#birth_date").val(data.birthDate);
                $("#birth_date").prop("disabled", true);

                $("#birth_date_button").css("visibility", "hidden");

                recieptMethodDropdown.selectOption(data.recieptMethod);
                recieptMethodDropdown.disable();

                if (data.confirmation) {
                    $("#confirmed").prop("checked", "true");
                } else {
                    $("#confirmed").prop("checked", "false");
                }
                $("#confirmed").prop("disabled", true);

                canGetDocumentsDropdown.selectOption(data.canGetDocuments);
                canGetDocumentsDropdown.disable();
                
                $("#save_btn").css("visibility", "hidden");
            } else {
                const notification = new Notification("Ошибка при загрузке анкеты сохранена в консоли!", 2, 30000);
                notification.show();

                console.log("ERROR: " + data.errorMessage);
            }

            afterReload();

            $(element).removeClass("group-btn-flash");
        },
        error: function (error) {
            const notification = new Notification("Ошибка при загрузке анкеты сохранена в консоли!", 2, 30000);
            notification.show();

            onError(error, "7307692369401052853");

            afterReload();

            $(element).removeClass("group-btn-flash");
        }
    });
}