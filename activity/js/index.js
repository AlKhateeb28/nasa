let topActivities = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
let regionActivities = [
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE
];

function getCurrentDate() {
const currentDate = new Date();

return currentDate.toLocaleString("ru-RU").split(",")[0];
}

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

function createTopPageBox(parentId, index, svg) {
    $("#" + parentId + index).append(getTemplate("button_template"));
    $("#prompt").attr("id", "prompt_" + index);
    $("#title").attr("id", "title_" + index);
    $("#footer").attr("id", "footer_" + index);
    $("#footer_" + index).html(svg);
    $("#card").attr("id", "card_" + index);
    $("#task_message").attr("id", "task_message_" + index);
    $("#time_footer").attr("id", "time_footer_" + index);
    $("#running_time").attr("id", "running_time_" + index);
    $("#running_arrow").attr("id", "running_arrow_" + index);
    $("#running_arrow_" + index).html(greenArrow);
    $("#svg").attr("id", "svg_" + index);
}

function reloadData() {
    beforeReload();

    const messageElement = $("#message");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7256008661971890453",
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                refreshActivities(data);
            } else {
                messageElement.css("color", "hotpink");
                messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function(error) {
            afterReload();

            onError(7137494958071545430);
        }
    });
}

function hideMessageBox() {
    $("#message").css("visibility", "hidden");
}

function onError(id) {
    $("#loader").css("visibility", "hidden");

    const messageElement = $("#message");

    messageElement.css("color", "hotpink");
    messageElement.html("Системная ошибка! Смотрите лог шаблона документа " + id);

    console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
}

function refreshActivities(data) {
    $("#from_date").html(data.fromDate);

    data.topActivities.forEach((activity, index) => {
        $("#prompt_" + activity.position).html(activity.name);
        $("#title_" + activity.position).html(activity.name);
        $("#running_time_" + activity.position).html(activity.quantity.toLocaleString("ru-RU"));

        const arrowElement = $("#running_arrow_" + activity.position);
        let applyingClass = "";

        if(arrowElement.hasClass("fade-out-arrow1") || arrowElement.hasClass("fade-out-arrow2")) {
            if(arrowElement.hasClass("fade-out-arrow1")) {
                applyingClass = "fade-out-arrow2";
            } else {
                applyingClass = "fade-out-arrow1";
            }
        } else {
            applyingClass = "fade-out-arrow1";
        }

        if (topActivities[index] < activity.quantity) {
            arrowElement.css("display", "block");

            arrowElement.removeClass("fade-out-arrow1");
            arrowElement.removeClass("fade-out-arrow2");
            arrowElement.addClass(applyingClass);
        } else {
            arrowElement.css("display", "none");
            arrowElement.removeClass("fade-out-arrow1");
            arrowElement.removeClass("fade-out-arrow2");
        }

        topActivities[index] = activity.quantity;
    });

    const regionsElement = $("#regions");
    regionsElement.empty();
    regionsElement.append(getTemplate("regions_caption"));

    data.regions.forEach((region, index) => {
        regionsElement.append(getTemplate("region_template"));

        $("#region_name").attr("id", "region_name_" + index);
        const regionNameElement = $("#region_name_" + index);
        regionNameElement.html(region.name);
        regionNameElement.addClass("region-hook");
        regionNameElement.attr("data-region-id", region.id)

        $("#region_quality").attr("id", "region_quality_" + index);        
        $("#region_quality_" + index).attr("data-region-id", region.id)

        $("#region_value").attr("id", "region_value_" + index);
        const regionValueElement = $("#region_value_" + index);
        regionValueElement.html(region.count);
        regionValueElement.attr("data-region-id", region.id)

        $("#region_arrow").attr("id", "region_arrow_" + index);
        const arrowElement = $("#region_arrow_" + index);
        arrowElement.html(greenArrowSmall);
        //arrowElement.css("visibility", "visible");

        let applyingClass = "";

        if(arrowElement.hasClass("fade-out-arrow1") || arrowElement.hasClass("fade-out-arrow2")) {
            if(arrowElement.hasClass("fade-out-arrow1")) {
                applyingClass = "fade-out-arrow2";
            } else {
                applyingClass = "fade-out-arrow1";
            }
        } else {
            applyingClass = "fade-out-arrow1";
        }

        if (regionActivities[index] < region.count) {
            arrowElement.css("visibility", "visible");

            arrowElement.removeClass("fade-out-arrow1");
            arrowElement.removeClass("fade-out-arrow2");
            arrowElement.addClass(applyingClass);
        } else {
            arrowElement.css("visibility", "hidden");
            arrowElement.removeClass("fade-out-arrow1");
            arrowElement.removeClass("fade-out-arrow2");
        }

        regionActivities[index] = region.count;
    });
}

function beforeReload() {
    $("#loader").css("visibility", "visible");
}

function afterReload() {
    $("#loader").css("visibility", "hidden");
}

function getOrgs(element) {
    beforeReload();

    $(".region-hook").removeClass("region-selected");

    const regionElement = $("#" + element.id);
    regionElement.addClass("region-selected");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7257828458375147659&id=" + regionElement.attr("data-region-id"),
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                $("#current_region").html(data.currentRegion);

                const orgsBoxElement = $("#orgs_box");

                orgsBoxElement.empty();
                
                data.orgs.forEach((org, index) => {
                    orgsBoxElement.append(getTemplate("organization_template"));

                    $("#org_box").attr("id", "org_box_" + index);

                    const orgBoxElement = $("#org_box_" + index);
                    orgBoxElement.addClass("org-hook")
                    orgBoxElement.attr("data-org-id", org.id)

                    $("#org_name").attr("id", "org_name_" + index);
                    $("#org_name_" + index).html(org.osName);

                    $("#org_inn").attr("id", "org_inn_" + index);
                    $("#org_inn_" + index).html(org.inn);

                    $("#org_sphera").attr("id", "org_sphera_" + index);
                    $("#org_sphera_" + index).html(org.pasName);

                    $("#org_count").attr("id", "org_count_" + index);
                    $("#org_count_" + index).html(org.count);
                });
            } else {
                messageElement.css("color", "hotpink");
                messageElement.html("Ошибка! Подробности в логе 'agent_7137494958071545430'");

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function(error) {
            afterReload();

            onError(7257828458375147659);
        }
    });
}

function getOrgActivity(element) {
    beforeReload();

    $(".org-hook").removeClass("org-selected");

    const orgElement = $("#" + element.id);
    orgElement.addClass("org-selected");

    const activitiesElement = $("#activities");
    activitiesElement.css("display", "none");

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7258125168537235843&id=" + orgElement.attr("data-org-id"),
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                data.activities.forEach((activity, index) => {
                    console.log("Pos: " + activity.position + " Quantity: " + activity.quantity);

                    $("#prompt_" + activity.position).html(activity.name);
                    $("#title_" + activity.position).html(activity.name);

                    const runningTimeElement = $("#running_time_" + activity.position);
                    runningTimeElement.css("margin-left", "0px");
                    runningTimeElement.css("width", "100%");
                    runningTimeElement.html(activity.quantity.toLocaleString("ru-RU"));

                });

                activitiesElement.css("display", "block");
            } else {
                messageElement.css("color", "hotpink");
                messageElement.html("Ошибка! Подробности в логе 'agent_7258125168537235843'");

                console.log("Error: " + data.errorMessage.indexOf("#"));
            }

            afterReload();
        },
        error: function(error) {
            afterReload();

            onError(7258125168537235843);
        }
    });
}