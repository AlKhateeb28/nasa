let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

let educationProgramDropdown = null;

function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

function initialize() {
    IMask(
        $("#start").get(0),
        {
            mask: Date,
            /*min: new Date(2026, 0, 1),
            max: new Date(2099, 0, 1),*/
            lazy: false
        }
    ).updateValue();

    IMask(
        $("#finish").get(0),
        {
            mask: Date,
            /*min: new Date(2026, 0, 1),
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

    const currentYear = parseInt(moment().format('YYYY'));

    $(".year_row_checkbox").each((index, checkbox) => {
        if (parseInt($(checkbox).attr("data-year")) === currentYear) {
            $(checkbox).prop("checked", true);
        }
    });

    $("#month_2").attr("data-last", moment(currentYear + "-02").daysInMonth()); 

    calculateStartAndFinish();
}

function calculateStartAndFinish() {
    // DAY
    let startDay = null;
    let finishDay = null;

    // MONTH
    let startMonth = null;
    let finishMonth = null;

    $(".month_row_checkbox").each((index, checkbox) => {
        if ($(checkbox).prop("checked")) {
            if(startMonth === null) {
                startDay = parseInt($(checkbox).attr("data-first"));
                startMonth = parseInt($(checkbox).attr("data-month"));
            }

            finishDay = parseInt($(checkbox).attr("data-last"));
            finishMonth = parseInt($(checkbox).attr("data-month"));
        }
    });

    $(".month_row_checkbox").each((index, checkbox) => {
        const month = parseInt($(checkbox).attr("data-month"));

        if (month >= startMonth && month <= finishMonth) {
            $(checkbox).prop("checked", true);
        }
    });

    if (startDay === null) {
        startDay = "";
    }
    if (finishDay === null) {
        finishDay = "";
    }

    if(startMonth === null) {
        startMonth = "";
    }
    if (finishMonth === null) {
        finishMonth = "";
    }

    // YEAR    
    let startYear = null;
    let finishYear = null;

    $(".year_row_checkbox").each((index, checkbox) => {
        if ($(checkbox).prop("checked")) {
            if (startYear === null) {
                startYear = parseInt($(checkbox).attr("data-year"));
            }

            finishYear = parseInt($(checkbox).attr("data-year"));
        }
    });

    $(".year_row_checkbox").each((index, checkbox) => {
        const year = parseInt($(checkbox).attr("data-year"));

        if (year >= startYear && year <= finishYear) {
            $(checkbox).prop("checked", true);
        }
    });

    if (startYear === null) {
        startYear = "";
    }

    if (finishYear === null) {
        finishYear = "";
    }

    if(startDay !== "" && startMonth !== "" && startYear != "") {
        $("#start").val(
            String(startDay).padStart(2, '0') + "." + 
            String(startMonth).padStart(2, '0') + "." +
            String(startYear).padStart(2, '0')
        );
    } else {
        $("#start").val("");
    }

    if (finishDay !== "" && finishMonth !== "" && finishYear != "") {
        $("#finish").val(
            String(finishDay).padStart(2, '0') + "." +
            String(finishMonth).padStart(2, '0') + "." +
            String(finishYear).padStart(2, '0')
        );
    } else {
        $("#finish").val("");
    }
}

function onMonthChange(event) {
    const checkboxElement = $("#" + event.currentTarget.id);

    if (event.currentTarget.checked) {
        if (parseInt(checkboxElement.attr("data-month")) === 0) {
            $(".month_row_checkbox").each((index, checkbox) => {
                $(checkbox).prop("checked", true);
            });
        } else {
            $("#month_header").prop("indeterminate", true);
        }
    } else {
        if (parseInt(checkboxElement.attr("data-month")) === 0) {
            $(".month_row_checkbox").each((index, checkbox) => {
                $(checkbox).prop("checked", false);
            });
        } else {
            $("#month_header").prop("indeterminate", true);
        }
    }

    let checkedCount = 0;

    $(".month_row_checkbox").each((index, checkbox) => {
        if($(checkbox).prop("checked")) {
            checkedCount++;
        }
    });

    if(checkedCount === 0) {
        $("#month_header").prop("indeterminate", false);
        $("#month_header").prop("checked", false);
    } else if (checkedCount === 12) {
        $("#month_header").prop("indeterminate", false);
        $("#month_header").prop("checked", true);
    }

    calculateStartAndFinish();
}

function onYearChange(event) {
    calculateStartAndFinish();
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

function onReport(element) {
    clickedElement = element;

    if (clickedElement !== undefined) {
        $(clickedElement).addClass("report-btn-flash");

        sleep(1000).then((r) => {
            $(clickedElement).removeClass("report-btn-flash")
        });
    }

    // CHECK MONTH
    let checkedCount = 0;
    
    $(".month_row_checkbox").each((index, checkbox) => {
        if ($(checkbox).prop("checked")) {
            checkedCount++;
        }
    });

    if (checkedCount === 0) {
        openAlertPopupWindow("Выберите месяц для выгрузки!");
        return;
    }

    // CHER YEAR
    checkedCount = 0;

    $(".year_row_checkbox").each((index, checkbox) => {
        if ($(checkbox).prop("checked")) {
            checkedCount++;
        }
    });

    if (checkedCount === 0) {
        openAlertPopupWindow("Выберите год для выгрузки!");
        return;
    }

    // CHECK start DATE
    if ($("#start").val() === "__.__.____") {
        openAlertPopupWindow("Выберите дату начала!");
        return;
    }

    // CHECK finish DATE
    if ($("#finish").val() === "__.__.____") {
        openAlertPopupWindow("Выберите дату окончания!");
        return;
    }

    // COMPARE start AND finish DATES
    const startDate = moment($("#start").val(), "DD.MM.YYYY");
    const finishDate = moment($("#finish").val(), "DD.MM.YYYY");

    if(startDate > finishDate) {
        openAlertPopupWindow("Дата начала не может быть больше даты окончания!");
        return;
    }

    beforeReload("Выгружаем");

    const survey = {};
    survey.educationProgramId = educationProgramDropdown.getSelectedOptionValues().value;
    survey.start = $("#start").val();
    survey.finish = $("#finish").val();

    const json = JSON.stringify(survey);

    //educationProgramDropdown.getSelectedOptionValues().value

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7315826288883524378",
        async: true,
        type: "POST",
        data: {
            json: json
        },
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                var link = document.createElement('a');
                document.body.appendChild(link);
                link.href = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/surveys/survey_" + getCurrentDate() + ".xlsx";
                link.rel = "nofollow";
                link.click();
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