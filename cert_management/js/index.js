let alertPopupWindow = null;

const serials = [
    {
        id: "rp",
        name: "РП"
    }    
];

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

function initialize() {
    $("#header-middle-content").css("height", "1px");

    $("#content").css("padding-top", "1px");
    $("#content").css("padding-bottom", "1px");

    const cid = $("#cid").text();

    if (!hasSerial(cid)) {
        openAlertPopupWindow("Неизвестный тип сертификата!", true);

        $("#alert_popup_svg").html(`
            <div style="margin-top: 42px;">
                <svg fill="#ff0000" width="40px" height="40px" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M624 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h608c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM80.55 341.27c6.28 6.84 15.1 10.72 24.33 10.71l130.54-.18a65.62 65.62 0 0 0 29.64-7.12l290.96-147.65c26.74-13.57 50.71-32.94 67.02-58.31 18.31-28.48 20.3-49.09 13.07-63.65-7.21-14.57-24.74-25.27-58.25-27.45-29.85-1.94-59.54 5.92-86.28 19.48l-98.51 49.99-218.7-82.06a17.799 17.799 0 0 0-18-1.11L90.62 67.29c-10.67 5.41-13.25 19.65-5.17 28.53l156.22 98.1-103.21 52.38-72.35-36.47a17.804 17.804 0 0 0-16.07.02L9.91 230.22c-10.44 5.3-13.19 19.12-5.57 28.08l76.21 82.97z"/></svg>
                </svg>
            </div>
        `);

        $("#alert_popup_message").css("color", "red");

        return;
    }

    $("#serial_name").html(getSerialName(cid));
    
    for(let i = 0; i < 10; i++) {
        $("#table_body").append(getTemplate("row_template"));

        $("#row").attr("id", "row_" + i);
    }
}

function hasSerial(cid) {
    if (cid === "") {
        return false;
    }

    let found = false;

    for (let i = 0; i < serials.length; i++) {
        if (serials[i].id === cid) {
            found = true;

            break;
        }
    }

    return found;
}

function getSerialName(cid) {
    let name = "--";

    for (let i = 0; i < serials.length; i++) {
        if (serials[i].id === cid) {
            name = serials[i].name;
        }
    }

    return name;
}

function openAlertPopupWindow(message, hideButton) {
    $("#popup_box").empty();

    const content = `
			<div style="margin-top: 10px; text-align: center;">
                <div id="alert_popup_svg"></div>
                <div id="alert_popup_message">${message}</div>
            </div>
		`;

    alertPopupWindow = new AlertPopupWindow("alertPopupWindow", "popup_box", content);

    if (hideButton != undefined) {
        if (hideButton) {
            $("#alert_popup_btn").css("display", "none");
        } else {
            $("#alert_popup_btn").css("display", "block");
        }
    }
}

function selectRow(element) {
    $(".row").removeClass("selected-row");

    $(element).addClass("selected-row");
}