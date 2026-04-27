let activePage = 1;

let paging = null;
let statusesDropdown = null;
let monthDropdown = null;
let yearDropdown = null;
let eduMethodsDropdown = null;
let eventStatusesDropdown = null;
let confirmPopupWindow = null;
let alertPopupWindow = null;

// 0 - left block visible, 1 - right block visible
let blockPosition = 0;

let isEventChanged = false;
let selectedTrainerId = null;
let afterSave = false;

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

function generateCode(length = 5) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }

    return result;
}

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

    IMask(
        $("#finish_date").get(0),
        {
            mask: Date,
            min: new Date(2018, 0, 1),
            max: new Date(2099, 0, 1),
            lazy: false
        }
    ).updateValue();

    $("body").on("keydown", function (event) {
        if (event.key === 'F3') {
            event.preventDefault();

            if (activePage === 1) {
                openEvent(0);
            }
        } else if (event.key === 'F4') {
            event.preventDefault();

            if (activePage === 1 && $(".selected-row").attr("data-id") !== undefined) {
                openEvent(1);
            }
        } else if (event.key === 'F2') {
            event.preventDefault();

            if (activePage === 2) {
                saveEvent();
            }
        } else if (event.key === 'F8') {
            event.preventDefault();

            if (activePage === 1 && $(".selected-row").attr("data-id") !== undefined) {
                onDeleteEvent();
            }
        } else if (event.key === 'F9') {
            event.preventDefault();

            getReport(0);
        } else if (event.key === 'F10') {
            event.preventDefault();

            getReport(1);
        } else if (event.key === 'Delete') {
            event.preventDefault();

            const selectedPersonRow = $(".selected-person-row");

            if (activePage === 2 && selectedPersonRow !== undefined) {
                selectedPersonRow.remove();
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();

            if (activePage === 2) {
                openConfirmPopupWindow("goToEventCalendar()");
            }
        }
    });

    initModalWindow("modal_box");

    /*$("#start_date").mask("99.99.9999");
    $("#finish_date").mask("99.99.9999");*/

    $("#calendar_element").html(Calendar.getContent());

    $(".calendar-header").css("padding", "25px 0px 10px");
    $(".calendar-header").css("justify-content", "space-around");
    $(".calendar-header").css("background-color", "cornsilk");

    Calendar.initialize();
    Calendar.hide();

    paging = new Paging("paging", "pager_box", "getEvents");
    paging.instace = paging;

    $("#page_number").val(1);

    $("#trainer_add_button").html(svgSmallAddImage);
    $("#trainer_delete_button").html(svgSmallDeleteImage);
    $("#person_add_button").html(svgSmallAddImage);

    statusesDropdown = new Dropdown("statusesDropdown", "statuses", "getEvents()");
    statusesDropdown.addOption(statusesDropdown.getDropdownId(), "Все статусы", "all", true);
    statusesDropdown.addOption(statusesDropdown.getDropdownId(), "Планируется", "project");
    statusesDropdown.addOption(statusesDropdown.getDropdownId(), "Завершено", "close");

    monthDropdown = new Dropdown("monthDropdown", "monthes", "getEvents()");
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Все месяцы", 0, true);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Январь", 1);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Февраль", 2);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Март", 3);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Апрель", 4);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Май", 5);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Июнь", 6);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Июль", 7);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Август", 8);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Сентябрь", 9);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Октябрь", 10);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Ноябрь", 11);
    monthDropdown.addOption(monthDropdown.getDropdownId(), "Декабрь", 12);

    const currentYear = moment().year;

    yearDropdown = new Dropdown("yearDropdown", "years", "getEvents()");

    for (let i = 2026; i <= 2030; i++) {
        let selected = false;

        if (i === currentYear) {
            selected = true;
        }

        yearDropdown.addOption(yearDropdown.getDropdownId(), i, i, selected);
    }

    eventStatusesDropdown = new Dropdown("eventStatusesDropdown", "event_statuses", "onChangeEventStatus()");
    eventStatusesDropdown.addOption(eventStatusesDropdown.getDropdownId(), "Планируется", "project");
    eventStatusesDropdown.addOption(eventStatusesDropdown.getDropdownId(), "Завершено", "close");

    eduMethodsDropdown = new Dropdown("eduMethodsDropdown", "edu_methods", "onChangeEduMethod()");

    getEvents();
}

function onChangeEventStatus() {
    setEventChanged(true);

    eduMethodsDropdown.focus();
}

function onChangeEduMethod() {
    setEventChanged(true);

    const eventNameElement = $("#event_name");

    eventNameElement.val(
        eduMethodsDropdown.getSelectedOptionValues().caption
    );

    eventNameElement.focus();
}

function onError(error, id) {
    /*const messageElement = $("#message");

    messageElement.css("color", "hotpink");
    messageElement.html("Системная ошибка! Смотрите лог шаблона документа " + id);*/

    console.log("ERROR (See " + id + " log file):" + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
}

function getEvents() {
    beforeReload("Загружаем...");

    const eventsTableElement = $("#events_table");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7260348212639037233&page=" + paging.currentPage +
            "&name=" + $("#find_input").val() +
            "&status=" + statusesDropdown.getSelectedOptionValues().value +
            "&month=" + monthDropdown.getSelectedOptionValues().value +
            "&year=" + yearDropdown.getSelectedOptionValues().value,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                eventsTableElement.empty();
                eventsTableElement.append(getTemplate("event_header_row_template"));

                paging.setMaxPageValue(Math.ceil(data.count / data.recordsOnPage));

                data.events.forEach((event, index) => {
                    eventsTableElement.append(getTemplate("event_row_template"));

                    $("#row").attr("id", "row_" + index);
                    const rowElement = $("#row_" + index);
                    rowElement.attr("data-id", event.id);                    
                    if (event.isBlocked) {
                        rowElement.addClass("blocked-row");
                    }
                    $("#name").attr("id", "name_" + index);
                    $("#name_" + index).html(event.name);

                    $("#nps").attr("id", "nps_" + index);
                    $("#nps_" + index).html(event.nps);

                    $("#state").attr("id", "state_" + index);
                    const stateElement = $("#state_" + index);
                    stateElement.html(event.stateName);

                    if (event.state == "project") {
                        stateElement.addClass("state-project");
                    } else if (event.state == "close") {
                        stateElement.addClass("state-close");
                    }

                    $("#start").attr("id", "start_" + index);
                    $("#start_" + index).html(event.start);

                    $("#finish").attr("id", "finish_" + index);
                    $("#finish_" + index).html(event.finish);

                    $("#count").attr("id", "count_" + index);
                    $("#count_" + index).html(event.count);

                    $("#comment").attr("id", "comment_" + index);
                    $("#comment_" + index).html(event.comment);

                    if (index === 0) {
                        rowElement.click();
                    }
                });

                getEduMethods();                
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function getEduMethods() {
    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7270559282030501424",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                $("#" + eduMethodsDropdown.getDropdownId()).empty();

                eduMethodsDropdown.addOption(eduMethodsDropdown.getDropdownId(), "<Выберите программу>", 0);

                data.edu_methods.forEach((method, index) => {
                    eduMethodsDropdown.addOption(eduMethodsDropdown.getDropdownId(), method.name, method.id);
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function enableEditPage() {
    $("#save_button").css("display", "block");
    $("#" + eventStatusesDropdown.getDropdownId()).prop("disabled", false);
    $("#" + eduMethodsDropdown.getDropdownId()).prop("disabled", false);
    $("#event_name").prop("disabled", false);
    $("#start_date").prop("disabled", false);
    $("#start_date_button").css("display", "block");
    $("#finish_date").prop("disabled", false);
    $("#finish_date_button").css("display", "block");
    $("#nps").prop("disabled", false);
    $("#comment").prop("disabled", false);
    $("#trainer_buttons").css("display", "block");
    $("#person_buttons").css("display", "block");
}

function disableEditPage() {
    $("#save_button").css("display", "none");
    $("#" + eventStatusesDropdown.getDropdownId()).prop("disabled", true);
    $("#" + eduMethodsDropdown.getDropdownId()).prop("disabled", true);
    $("#event_name").prop("disabled", true);
    $("#start_date").prop("disabled", true);
    $("#start_date_button").css("display", "none");
    $("#finish_date").prop("disabled", true);
    $("#finish_date_button").css("display", "none");
    $("#nps").prop("disabled", true);
    $("#comment").prop("disabled", true);
    $("#trainer_buttons").css("display", "none");
    $("#person_buttons").css("display", "none");
}

function openEvent(mode) {
    const selectedEventCount = getSelectedEventsCount();

    if(mode === 1) {
        if (selectedEventCount === 0) {        
            openAlertPopupWindow("Выберите хоть одно мероприятие для редактирования.");

            return;
        } else if (selectedEventCount > 1) {
            let eventName = "мероприятий";

            if (selectedEventCount >= 2 && selectedEventCount <= 4) {
                eventName = "мероприятия";
            }
            
            openAlertPopupWindow("Выбрано " + selectedEventCount + " " + eventName + ". Для редактирования выберите одно мероприятие.");

            return;
        }
    }

    const selectedEventId = $(".selected-row").attr("data-id");

    if (mode === 1 && selectedEventId === undefined) {
        return;
    }

    activePage = 2;

    setEventChanged(false);

    $("#left_block").css("display", "none");
    $("#right_block").css("display", "block");

    const eventElement = $("#event_id");

    enableEditPage();

    eduMethodsDropdown.setFirstOptionAsSelected();

    $("#event_name").val("");
    $("#start_date").val("");
    $("#finish_date").val("");
    $("#nps").val("");
    $("#comment").val("");

    const trainerTable = $("#trainer_table");
    trainerTable.empty();
    trainerTable.append(getTemplate("trainer_header_row_template"));

    const personTable = $("#person_table");
    personTable.empty();
    personTable.append(getTemplate("person_header_row_template"));

    if (mode === 0) {
        $("#add_new_button").css("display", "none");
        $("#lp_button").css("display", "none");

        eventElement.html("");
    } else {
        $("#add_new_button").css("display", "block");
        $("#lp_button").css("display", "block");

        eventElement.html(
            selectedEventId
        );

        showEvent($(".selected-row").attr("data-id"));
    }

    $("#" + eduMethodsDropdown.getDropdownId()).focus();
}

function showEvent(eventId) {
    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7265547476708537900&id=" + eventId,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if(data.isBlocked) {
                    disableEditPage();

                    $("#blocked_event_id").html($("#event_id").html());
                    $("#blocked_event_id_box").css("visibility", "visible");

                    const notification = new Notification("Мероприятие заблокировано от редактирования, так как идет сверка мероприятий за прошлый период.", 1);
                    notification.show();
                } else {
                    enableEditPage();

                    $("#blocked_event_id_box").css("visibility", "hidden");
                }

                // $(this).val()
                // $(this).text();
                $("#" + eventStatusesDropdown.getDropdownId() + " option").each(function () {
                    if ($(this).val() === data.status) {
                        $(this).prop("selected", true);
                    }
                });

                $("#" + eduMethodsDropdown.getDropdownId() + " option").each(function () {
                    if ($(this).val() === data.eduMethodId) {
                        $(this).prop("selected", true);
                    }
                });

                $("#event_name").val("");
                $("#event_name").val(data.name);

                $("#start_date").val("");
                $("#start_date").val(data.startDate);

                $("#finish_date").val("");
                $("#finish_date").val(data.finishDate);

                $("#nps").val("");
                $("#nps").val(data.nps);

                $("#comment").val("");
                $("#comment").val(data.comment);

                const trainerTable = $("#trainer_table");
                trainerTable.empty();
                trainerTable.append(getTemplate("trainer_header_row_template"));

                data.tutors.forEach((tutor, index) => {
                    trainerTable.append(getTemplate("trainer_row_template"));

                    $("#trainer").attr("id", "trainer_" + tutor.id);
                    const trainerRow = $("#trainer_" + tutor.id);
                    trainerRow.attr("data-trainer-id", tutor.id);
                    trainerRow.attr("data-trainer-inn", tutor.inn);
                    trainerRow.attr("data-trainer-name", tutor.name);
                    trainerRow.attr("data-trainer-position", tutor.positionName);
                    trainerRow.attr("is-new", "false");

                    $("#trainer_inn").attr("id", "trainer_inn_" + tutor.id);
                    $("#trainer_inn_" + tutor.id).html(tutor.inn);

                    $("#trainer_fio").attr("id", "trainer_fio_" + tutor.id);
                    $("#trainer_fio_" + tutor.id).html(tutor.name);

                    $("#trainer_position").attr("id", "trainer_position_" + tutor.id);
                    $("#trainer_position_" + tutor.id).html(tutor.positionName);
                });

                const personTable = $("#person_table");
                personTable.empty();
                personTable.append(getTemplate("person_header_row_template"));

                data.persons.forEach((person, index) => {
                    personTable.append(getTemplate("person_row_template"));

                    $("#person_row").attr("id", "person_row_" + person.id);
                    const personRow = $("#person_row_" + person.id);
                    personRow.attr("data-person-id", person.id);
                    personRow.attr("data-person-inn", person.inn);
                    personRow.attr("data-person-name", person.name);
                    personRow.attr("data-person-position", person.positionName);
                    personRow.attr("data-person-id", person.id);
                    personRow.attr("is-new", "false");
                    personRow.attr("delete", "false");

                    $("#person_inn").attr("id", "person_inn_" + person.id);
                    $("#person_inn_" + person.id).html(person.inn);

                    $("#person_fio").attr("id", "person_fio_" + person.id);
                    $("#person_fio_" + person.id).html(person.name);

                    $("#person_position").attr("id", "person_position_" + person.id);
                    $("#person_position_" + person.id).html(person.positionName);                    
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function getSelectedEventsCount() {
    let selectedCount = 0;
    
    $(".selected-row").each(function () {
        selectedCount++;
    });

    return selectedCount;
}

function selectEvent(element, event) {
    const selectedEvent = $("#" + element.id);

    if (event.ctrlKey && event.button === 0) {
        selectedEvent.addClass("selected-row");
    } else {
        $(".row").removeClass("selected-row");
        selectedEvent.addClass("selected-row");
    }
}

function selectTrainer(element) {
    const selectedTrainer = $("#" + element.id);

    $(".trainer-row").removeClass("selected-trainer-row");
    selectedTrainer.addClass("selected-trainer-row");

    selectedTrainerId = selectedTrainer.attr("data-trainer-id");
}

function selectPerson(element) {
    const selectedPerson = $("#" + element.id);

    $(".person-row").removeClass("selected-person-row");
    selectedPerson.addClass("selected-person-row");
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

function resetFilters() {
    statusesDropdown.setFirstOptionAsSelected();
    monthDropdown.setFirstOptionAsSelected();
    yearDropdown.setFirstOptionAsSelected();

    $("#find_input").val("");

    getEvents();
}

function showCalendar(elementId) {
    let verifyMethod = "";

    if (elementId === "finish_date") {
        verifyMethod = "verifyFinishDate();"
    }

    Calendar.afterSelectAction = elementId;
    Calendar.executeAfterSelect = "setEventChanged(true); " + verifyMethod;
    Calendar.show();
}

function openConfirmPopupWindow(executeMethod) {
    if (isEventChanged) {
        $("#popup_box").empty();

        const content = `
			<div style="margin-top: 10px;">Введенные данные будут утеряны.</div>
			<div style="height: 100%; text-align: center; margin-top: 40px;">Уже уходите?</div>
		`;

        confirmPopupWindow = new ConfirmPopupWindow("confirmPopupWindow", "popup_box", content, executeMethod);
    } else {
        eval(executeMethod);
    }
}

function openAlertPopupWindow(message) {
    $("#popup_box").empty();

    const content = `
			<div style="margin-top: 10px;">${message}</div>			
		`;

    alertPopupWindow = new AlertPopupWindow("alertPopupWindow", "popup_box", content, "goToEventCalendar()");
}

function goToEventCalendar() {
    $("#stickyNotification").remove();

    activePage = 1;

    setEventChanged(false);

    $("#blocked_event_id_box").css("visibility", "hidden");

    $("#right_block").css("display", "none");
    $("#left_block").css("display", "block");

    $("#save_button").css("background-color", "#e8e8e8");
    $("#save_label").css("display", "none");
    $("#red_rows_caption").css("display", "none");

    if (afterSave) {
        afterSave = false;

        getEvents();
    }
}

function setEventChanged(value) {
    isEventChanged = value;

    if (isEventChanged) {
        $("#save_button").css("background-color", "#86c8fd");

        $("#save_label").css("display", "block");
    }
}

function deleteTrainer() {
    $("#trainer_table tr").each(function () {
        if (parseInt($(this).attr("data-trainer-id")) === parseInt($(".selected-trainer-row").attr("data-trainer-id"))) {
            $(this).remove();

            selectedTrainerId = null;
        }
    });
}

async function pickSingleFile() {
    const [fileHandle] = await window.showOpenFilePicker();

    return await fileHandle.getFile();
}

function isPersonExistRow(row) {
    const name = removeUnnecessarySpaces(row[1]);

    let isAlreadyExist = false;

    $(".person-row").each(function () {
        if ($(this).attr("data-person-inn").toUpperCase() === String(row[0]) && $(this).attr("data-person-name").toUpperCase() === String(name).toUpperCase()) {
            isAlreadyExist = true;
        }
    });

    return isAlreadyExist;
}

function getNameParts(name) {
    const nameParts = name.split(" ");

    if (nameParts.length == 2) {
        return {
            length: 2,
            name: nameParts[1].trim(),
            fatherName: "",
            surname: nameParts[0].trim()
        }
    } else if (nameParts.length == 3) {
        return {
            length: 3,
            name: nameParts[1].trim(),
            fatherName: nameParts[2].trim(),
            surname: nameParts[0].trim()
        }
    } else {
        return {
            length: 0,
            name: "",
            fatherName: "",
            surname: ""
        }
    }
}

function removeUnnecessarySpaces(value) {
    const nameChars = [...value];

    let metSpace = false;

    let collectedName = "";

    nameChars.forEach((char, index) => {
        if (char != " ") {
            if (metSpace) {
                collectedName += " ";

                metSpace = false;
            }

            collectedName += char;
        } else {
            metSpace = true;
        }
    });

    return collectedName.trim();
}

function nameDeepValidate(fullname) {
    if (fullname.length < 2) {
        return false;
    }

    fullname = removeUnnecessarySpaces(fullname);

    let loweredName = fullname.toLowerCase();
    loweredName = loweredName.replace(/[А-Яа-яЁё -]/g, "")
     
    if (loweredName.length > 0) {         
        return false;
    }

    const nameParts = getNameParts(fullname);

    if (nameParts.length == 3) {
        const name = nameParts.name;
        const fatherName = nameParts.fatherName;
        const surname = nameParts.surname;

        if (fatherName == "-") {
            if (name.length < 2 || surname.length < 2) {
                return false;
            }
        } else {
            if (name.length < 2 || fatherName.length < 2 || surname.length < 2) {
                return false;
            }
        }
    } else if (nameParts.length == 2) {
        const name = nameParts.name;
        const surname = nameParts.surname;

        if (name.length < 2 || surname.length < 2) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}

async function readFile(file) {
    readXlsxFile(file).then(function (rows) {
        //const json = JSON.stringify(event);
        const persons = [];

        rows.forEach((row, index) => {
            if (index > 0) {
                if (!isPersonExistRow(row)) {
                    const person = {};

                    person.inn = row[0];
                    person.name = row[1];
                    person.position = row[2];

                    persons.push(person);
                }
            }
        });

        beforeReload();

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7267422403964104487&json=" + JSON.stringify(persons),
            async: true,
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data.errorMessage.indexOf("#") < 0) {
                    if (data.persons.length > 0) {
                        setEventChanged(true);
                    }

                    let hasRedRows = false;

                    data.persons.forEach((person, index) => {
                        const isNameValid = nameDeepValidate(person.name);

                        $("#person_table").append(getTemplate("person_row_template"));

                        $("#person_row").attr("id", "person_row_" + index);
                        const personRow = $("#person_row_" + index);
                        personRow.attr("data-person-id", 0);
                        personRow.attr("data-person-inn", person.inn);
                        personRow.attr("data-person-name", person.name);
                        personRow.attr("data-person-position", person.position);
                        personRow.attr("is-new", "true");
                        personRow.attr("delete", "false");
                        if (person.wrongRow) {
                            personRow.addClass("bad-row");
                        } else {
                            if (!isNameValid) {
                                personRow.addClass("bad-row");
                            }
                        }

                        $("#person_inn").attr("id", "person_inn_" + index);
                        const innElement = $("#person_inn_" + index);
                        innElement.html(person.inn);
                        if (person.wrongInn) {
                            innElement.addClass("bad-cell");

                            hasRedRows = true;
                        }

                        $("#person_fio").attr("id", "person_fio_" + index);
                        const fioElement = $("#person_fio_" + index);
                        fioElement.html(person.name);
                        if (!isNameValid || person.wrongName) {
                            fioElement.addClass("bad-cell");

                            hasRedRows = true;
                        }

                        $("#person_position").attr("id", "person_position_" + index);
                        $("#person_position_" + index).html(person.position);
                    });

                    if (hasRedRows) {
                        $("#red_rows_caption").css("display", "block");
                    } else {
                        $("#red_rows_caption").css("display", "none");
                    }
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                afterReload();
            },
            error: function (error) {
                onError(error, 7260348212639037233);

                afterReload();
            }
        });
    })
}

function addPersons() {
    pickSingleFile()
        .then(readFile);
}

function deleteRedRows() {
    $(".bad-row").each(function () {
        $(this).remove();
    });

    $("#red_rows_caption").css("display", "none");
}

function getReport(type) {
    beforeReload("Выгружаем...");

    let params = "";

    if (type === 0) {
        params = "&name=" + $("#find_input").val() +
            "&status=" + statusesDropdown.getSelectedOptionValues().value +
            "&month=" + monthDropdown.getSelectedOptionValues().value +
            "&year=" + yearDropdown.getSelectedOptionValues().value;
    }

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7265269220802297335&type=" + type + params,
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if (type == 0) {
                    fileName = "export";
                } else {
                    fileName = "report";
                }
                const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/report_ock/" + fileName + "_" + getCurrentDate() + ".xlsx";

                var link = document.createElement('a');
                document.body.appendChild(link);
                link.href = fileURL;
                link.rel = "nofollow";
                link.click();
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function convertToBoolean(value) {
    if (value === "false") {
        return false;
    } else {
        return true;
    }
}

function isValidEvent() {
    if (eduMethodsDropdown.getSelectedOptionValues().value === "0") {
        openAlertPopupWindow("Выберите учебную программу.");

        return false;
    }

    if (eventStatusesDropdown.getSelectedOptionValues().value === "close" && $("#nps").val() === "") {
        openAlertPopupWindow("Мероприятие с завершенным статусом должна иметь не пустой NPS.");

        return false;
    }

    const npsElement = $("#nps");
    if (npsElement.val() !== "" && (parseInt(npsElement.val()) < -100 || parseInt(npsElement.val()) > 100) ) {
        openAlertPopupWindow("Значение NPS должно быть в интервале -100..100 или пустым.");

        return false;
    }

    const startDateElement = $("#start_date");
    if (startDateElement.val() === "") {
        openAlertPopupWindow("Введите корректную дату начала мероприятия.");

        return false;
    }

    const finishDateElement = $("#finish_date");
    if (finishDateElement.val() === "") {
        openAlertPopupWindow("Введите корректную дату окончания мероприятия.");

        return false;
    }

    return true;
}

function saveEvent() {
    if (!isValidEvent()) {
        return;
    }

    beforeReload("Сохраняем...");

    const json = JSON.stringify(getEventAsObject());

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7266009075903625099",
        async: true,
        type: "POST",
        data: {
            json: json
        },
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if (data.lowFinish) {
                    $("#wait").css("display", "none");

                    openAlertPopupWindow("Дата окончания мероприятия не может быть меньше даты начала мероприятия!");

                    return;
                } else if (data.isVerification) {
                    if (!data.isDateValid) {
                        $("#wait").css("display", "none");

                        openAlertPopupWindow("Идет сверка мероприятий за прошлый месяц. Вводимая дата должна начинаться с " + data.start);

                        return;
                    }
                } else {
                    if (!data.isDateValid) {
                        $("#wait").css("display", "none");

                        openAlertPopupWindow("Нельзя сохранить мероприятие в закрытый период. Вводимая дата должна начинаться с " + data.start);

                        return;
                    }
                }

                $("#event_id").html(data.event.id);

                const notification = new Notification("Мероприятие сохранено!", 0, 10000);
                notification.show();

                showEvent(data.event.id + "");

                setEventChanged(false);

                afterSave = true;
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));

                const notification = new Notification("Ошибка при сохранении мероприятия сохранена в логе сервиса!", 2, 30000);
                notification.show();
            }

            $("#save_button").css("background-color", "#e8e8e8");
            $("#save_label").css("display", "none");
            $("#red_rows_caption").css("display", "none");
            $("#gray_rows_caption").css("display", "none");

            $("#add_new_button").css("display", "block");
            $("#lp_button").css("display", "block");

            $("#wait").css("display", "none");
        },
        error: function (error) {
            const notification = new Notification("Ошибка при сохранении мероприятия сохранена в консоли!", 2, 30000);
            notification.show();

            onError(error, "7266009075903625099");

            $("#wait").css("display", "none");
        }
    });
}

function getFindTrainerContent() {
    return `
		<div>
			<input id="find_person" placeholder="Для поиска введите фамилию тренера и нажмите ENTER" type="text" name="text" class="input" style="width: 500px;" onchange="findTrainer()">			
		</div>
		<div class="scrollbar-control" style="height: 560px;">
			<table id="trainers_table" border="0" style="margin-top: 10px;"></table>
		</div>
		<div>
			<div style="float: left;">
				<button class="operate-button" style="margin-top: 10px;" onclick="addFoundTrainer()">Выбрать</button>
			</div>
			<div style="float: left; margin-left: 20px;">
				<button class="operate-button" style="margin-top: 10px;" onclick="ModalWindow.close()">Закрыть</button>
			</div>
		</div>
	`;
}

function addTrainer() {
    //content, width, height, marginTop
    ModalWindow.show(
        getFindTrainerContent(),
        "50%",
        "70%",
        "50px");

    $("#modal").css("z-index", "1000");
    $("#btn_modal_close").css("display", "none");
    $("#trainers_table").append(getTemplate("find_trainer_header_template"));

    $("#find_person").focus();

    findTrainers();
}

function findTrainers() {
    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7270580480313905015",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const findTrainerTable = $("#trainers_table");
                findTrainerTable.empty();

                findTrainerTable.append(getTemplate("find_trainer_header_template"));

                data.trainers.forEach((trainer, index) => {
                    findTrainerTable.append(getTemplate("find_trainer_template"));

                    $("#find_trainer").attr("id", "find_trainer_" + trainer.id);
                    $("#find_trainer_" + trainer.id).attr("data-found-person-id", trainer.id);

                    $("#find_trainer_fio").attr("id", "find_trainer_fio_" + trainer.id);
                    $("#find_trainer_fio_" + trainer.id).html(trainer.name);

                    $("#find_trainer_inn").attr("id", "find_trainer_inn_" + trainer.id);
                    $("#find_trainer_inn_" + trainer.id).html(trainer.inn);

                    $("#find_trainer_org").attr("id", "find_trainer_org_" + trainer.id);
                    $("#find_trainer_org_" + trainer.id).html(trainer.orgName);

                    $("#find_trainer_position").attr("id", "find_trainer_position_" + trainer.id);
                    $("#find_trainer_position_" + trainer.id).html(trainer.positionName);
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function findTrainer() {
    beforeReload();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7265653330370099293&name=" + $("#find_person").val(),
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const findTrainerTable = $("#trainers_table");
                findTrainerTable.empty();

                findTrainerTable.append(getTemplate("find_trainer_header_template"));

                data.trainers.forEach((trainer, index) => {
                    findTrainerTable.append(getTemplate("find_trainer_template"));

                    $("#find_trainer").attr("id", "find_trainer_" + trainer.id);
                    $("#find_trainer_" + trainer.id).attr("data-found-person-id", trainer.id);

                    $("#find_trainer_fio").attr("id", "find_trainer_fio_" + trainer.id);
                    $("#find_trainer_fio_" + trainer.id).html(trainer.name);

                    $("#find_trainer_inn").attr("id", "find_trainer_inn_" + trainer.id);
                    $("#find_trainer_inn_" + trainer.id).html(trainer.inn);

                    $("#find_trainer_org").attr("id", "find_trainer_org_" + trainer.id);
                    $("#find_trainer_org_" + trainer.id).html(trainer.orgName);

                    $("#find_trainer_position").attr("id", "find_trainer_position_" + trainer.id);
                    $("#find_trainer_position_" + trainer.id).html(trainer.positionName);
                });
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function selectFoundTrainer(element) {
    const selectedTrainer = $("#" + element.id);

    $(".found-trainer-row").removeClass("selected-found-trainer-row");
    selectedTrainer.addClass("selected-found-trainer-row");

    //selectedTrainerId = selectedTrainer.attr("data-trainer-id");
}

function addFoundTrainer() {
    setEventChanged(true);

    $("#trainer_table tr").removeClass("selected-trainer-row");

    const foundTrainerId = $(".selected-found-trainer-row").attr("data-found-person-id");

    let isAlreadyExist = false;

    const trainerTableElement = $("#trainer_table");

    $("#trainer_table tr").each(function () {
        if ($(this).attr("data-trainer-id") === foundTrainerId) {
            isAlreadyExist = true;
        }
    });

    if (!isAlreadyExist) {
        trainerTableElement.append(getTemplate("trainer_row_template"));

        const inn = $("#find_trainer_inn_" + foundTrainerId).html();
        const name = $("#find_trainer_fio_" + foundTrainerId).html();
        const position = $("#find_trainer_position_" + foundTrainerId).html();

        $("#trainer").attr("id", "trainer_" + foundTrainerId);
        const trainerRow = $("#trainer_" + foundTrainerId);
        trainerRow.attr("data-trainer-id", foundTrainerId);
        trainerRow.attr("data-trainer-inn", inn);
        trainerRow.attr("data-trainer-fio", name);
        trainerRow.attr("data-trainer-position", position);
        trainerRow.attr("is-new", "true");

        $("#trainer_inn").attr("id", "trainer_inn_" + foundTrainerId);
        $("#trainer_inn_" + foundTrainerId).html(inn);

        $("#trainer_fio").attr("id", "trainer_fio_" + foundTrainerId);
        $("#trainer_fio_" + foundTrainerId).html(name);

        $("#trainer_position").attr("id", "trainer_position_" + foundTrainerId);
        $("#trainer_position_" + foundTrainerId).html(position);

        trainerTableElement.removeClass("selected-trainer-row");
        $("#trainer_" + foundTrainerId).addClass("selected-trainer-row");

        selectedTrainerId = foundTrainerId;
    }

    ModalWindow.close()
}


function deletePerson() {
    const deletedRow = $(".selected-person-row");

    if (deletedRow.attr("is-new") === "true") {
        deletedRow.remove();
    } else {
        deletedRow.attr("delete", "true");

        deletedRow.addClass("delete-on-save");

        $("#gray_rows_caption").css("display", "block");
    }

    hideRedCaption = true;

    $(".bad-row").each(function () {
        hideRedCaption = false;
    });

    if (hideRedCaption) {
        $("#red_rows_caption").css("display", "none");
    }

    setEventChanged(true);
}

function togllePersonRows(element) {
    const toglleButton = $("#" + element.id);

    if (toglleButton.attr("data-type") === "red") {
        toglleButton.attr("data-type", "all");
        toglleButton.removeClass("bad-row-button");
        toglleButton.html("Показать все строки");

        $(".person-row").hide();
        $(".bad-row").show();
    } else {
        toglleButton.attr("data-type", "red");
        toglleButton.addClass("bad-row-button");
        toglleButton.html("Показать только красные строки");

        $(".person-row").show();
    }
}

function onDeleteEvent() {
    const selectedEventCount = getSelectedEventsCount();
    
    let deleteMessage = "";

    if (selectedEventCount === 1) {
        deleteMessage = "выбранные " + selectedEventCount + " мероприятие";
    } else if (selectedEventCount >= 2 && selectedEventCount <= 4) {
        deleteMessage = "выбранные " + selectedEventCount + " мероприятия";
    } else {
        deleteMessage = "выбранные " + selectedEventCount + " мероприятий";
    }

    const selectedEventId = $(".selected-row").attr("data-id");

    if (selectedEventId !== undefined) {
        const message = `
			<div style="margin-top: 10px;"></div>
			<div style="height: 100%; text-align: center; margin-top: 40px;">Хотите удалить ${deleteMessage}?</div>
		`;
        deletePopupWindow = new ConfirmPopupWindow("deletePopupWindow", "popup_box", message, "deleteEvent(" + selectedEventId + ")");
    }
}

function deleteEvent(eventId) {
    beforeReload();

    const selectedEventCount = getSelectedEventsCount();

    if (selectedEventCount === 0) {
        openAlertPopupWindow("Выберите хоть одно мероприятие для удаления.");

        return;
    }

    $(".selected-row").each(function () {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7269880594011385270&id=" + $(this).attr("data-id"),
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data.errorMessage.indexOf("#") < 0) {
                    getEvents();
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                afterReload();
            },
            error: function (error) {
                onError(error, 7260348212639037233);

                afterReload();
            }
        });
    });
}

function isFinishDateValid() {
    const startDateElement = $("#start_date");
    const finishDateElement = $("#finish_date");

    if (new Date(finishDateElement.val()) < new Date(startDateElement.val())) {
        return false;
    }

    return true;
}

function verifyFinishDate() {
    if (!isFinishDateValid()) {
        $("#start_date").val("");
        openAlertPopupWindow("Дата окончания мероприятия не может быть меньше даты начала мероприятия!");

        return false;
    }

    beforeReload("Проверяем...");

    const finishDateElement = $("#finish_date");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7270945294156437341&date=" + finishDateElement.val(),
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if (data.isVerification) {
                    if (!data.isDateValid) {
                        finishDateElement.val("");

                        openAlertPopupWindow("Идет сверка мероприятий за прошлый месяц. Вводимая дата должна начинаться с " + data.start);
                    }
                } else {
                    if (!data.isDateValid) {
                        finishDateElement.val("");

                        openAlertPopupWindow("Нельзя сохранить мероприятие в закрытый период. Вводимая дата должна начинаться с " + data.start);
                    }
                }
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function (error) {
            onError(error, 7260348212639037233);

            afterReload();
        }
    });
}

function getEventAsObject() {
    const event = {};

    event.id = $("#event_id").html();
    event.status = eventStatusesDropdown.getSelectedOptionValues().value;
    event.eduMethodId = eduMethodsDropdown.getSelectedOptionValues().value;
    event.methodName = $("#event_name").val();
    event.startDate = $("#start_date").val();
    event.finishDate = $("#finish_date").val();
    event.nps = $("#nps").val();
    event.comment = $("#comment").val();
    event.preparationId = generateCode();

    event.trainers = [];

    $(".trainer-row").each(function () {
        const trainer = {};

        trainer.id = $(this).attr("data-trainer-id");
        trainer.inn = $(this).attr("data-trainer-inn");
        trainer.name = $(this).attr("data-trainer-name");
        trainer.position = $(this).attr("data-trainer-position");
        trainer.isNew = convertToBoolean($(this).attr("is-new"));

        event.trainers.push(trainer);
    });

    event.persons = [];

    $(".person-row").each(function () {
        const person = {};

        person.id = $(this).attr("data-person-id");
        person.inn = $(this).attr("data-person-inn");
        person.name = $(this).attr("data-person-name");
        person.position = $(this).attr("data-person-position");
        person.isNew = convertToBoolean($(this).attr("is-new"));
        person.isDelete = convertToBoolean($(this).attr("delete"));

        event.persons.push(person);
    });

    return event;
}

function downloadLP() {
    beforeReload("Формируем...");

    const json = JSON.stringify(getEventAsObject());

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7272711228520791583",
        async: true,
        type: "POST",
        data: {
            json: json
        },
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/" + data.fileWebPath;
                link.rel = "nofollow";
                link.click();

                const notification = new Notification("Лист присутствия сформирован!", 0, 10000);
                notification.show();
            } else {
                console.log("Error: " + data.errorMessage.indexOf("#"));

                const notification = new Notification("Ошибка при сохранении мероприятия сохранена в логе сервиса!", 2, 30000);
                notification.show();
            }

            $("#save_button").css("background-color", "#e8e8e8");
            $("#save_label").css("display", "none");
            $("#red_rows_caption").css("display", "none");
            $("#gray_rows_caption").css("display", "none");

            $("#add_new_button").css("display", "block");
            $("#lp_button").css("display", "block");

            $("#wait").css("display", "none");
        },
        error: function (error) {
            const notification = new Notification("Ошибка при сохранении мероприятия сохранена в консоли!", 2, 30000);
            notification.show();

            onError(error, "7266009075903625099");

            $("#wait").css("display", "none");
        }
    });
}