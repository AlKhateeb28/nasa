var previousValues = [];

var webSocket = getWebSocket(window.WebSocket);

webSocket.onmessage = function(event) {
    receiveMessage(event.data).then(r => r);
};

async function receiveMessage(promise) {
    if(typeof promise === "string") {
        showMessage(promise);
    } else {
        promise.text().then((value) => {
            showMessage(value);
        });
    }
}

function showMessage(message) {
    if (message.indexOf("#") > -1) {
        message = message.substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

        jsonMessage = message;
        let reports = JSON.parse(message, reviver);

        if (reports.type === "REPORT_IC_GD") {
            let result_value1 = 0, result_value0 = 0, result_value3 = 0, result_value4 = 0, result_value6 = 0, result_total = 0;
            $("#table .report-data").remove();

            reports.data.forEach((element, index) => {
                $("#table").append(kendo.template($("#row_template").html()));

                $("#index").attr("id", "index_" + index);
                $("#index_" + index).html(index + 1);
                $("#name").attr("id", "name_" + index);
                $("#name_" + index).html(element.name);

                $("#value1").attr("id", "value1_" + index);
                $("#value1_" + index).html(element.value1.toLocaleString());
                $("#prev1").attr("id", "prev1_" + index);
                $("#diff1").attr("id", "diff1_" + index);
                $("#diff_img1").attr("id", "diff_img1_" + index);
                $("#diff_parent1").attr("id", "diff_parent1_" + index);

                $("#value0").attr("id", "value0_" + index);
                $("#value0_" + index).html(element.value0.toLocaleString());
                $("#prev0").attr("id", "prev0_" + index);
                $("#diff0").attr("id", "diff0_" + index);
                $("#diff_img0").attr("id", "diff_img0_" + index);
                $("#diff_parent0").attr("id", "diff_parent0_" + index);

                $("#value3").attr("id", "value3_" + index);
                $("#value3_" + index).html(element.value3.toLocaleString());
                $("#prev3").attr("id", "prev3_" + index);
                $("#diff3").attr("id", "diff3_" + index);
                $("#diff_img3").attr("id", "diff_img3_" + index);
                $("#diff_parent3").attr("id", "diff_parent3_" + index);

                $("#value4").attr("id", "value4_" + index);
                $("#value4_" + index).html(element.value4.toLocaleString());
                $("#prev4").attr("id", "prev4_" + index);
                $("#diff4").attr("id", "diff4_" + index);
                $("#diff_img4").attr("id", "diff_img4_" + index);
                $("#diff_parent4").attr("id", "diff_parent4_" + index);

                $("#value6").attr("id", "value6_" + index);
                $("#value6_" + index).html(element.value6.toLocaleString());
                $("#prev6").attr("id", "prev6_" + index);
                $("#diff6").attr("id", "diff6_" + index);
                $("#diff_img6").attr("id", "diff_img6_" + index);
                $("#diff_parent6").attr("id", "diff_parent6_" + index);

                $("#total").attr("id", "total_" + index);
                $("#total_" + index).html(element.total.toLocaleString());
                $("#prev_total").attr("id", "prev_total_" + index);
                $("#diff_total").attr("id", "diff_total_" + index);
                $("#diff_img_total").attr("id", "diff_img_total" + index);
                $("#diff_parent_total").attr("id", "diff_parent_total_" + index);

                updatePreviousValue(element, index);

                result_value1 += element.value1;
                result_value0 += element.value0;
                result_value3 += element.value3;
                result_value4 += element.value4;
                result_value6 += element.value6;
                result_total += element.total;
            });

            $("#table").append(kendo.template($("#result_row_template").html()));

            $("#result_name").html("Общий итог");
            $("#result_value1").html(result_value1.toLocaleString());
            $("#result_value0").html(result_value0.toLocaleString());
            $("#result_value3").html(result_value3.toLocaleString());
            $("#result_value4").html(result_value4.toLocaleString());
            $("#result_value6").html(result_value6.toLocaleString());
            $("#result_total").html(result_total.toLocaleString());

            $("#last_update").html("Последнее обновление: " + getCurrentDateTime());
        }
    }
}

function updatePreviousValue(element, index) {
    let previousIndex = null;

    for(let i = 0; i < previousValues.length; i++) {
        if(previousValues[i].name.toUpperCase() === element.name.toUpperCase()) {
            previousIndex = i;
            break;
        }
    }

    if(previousIndex === null) {
        const previousValue = {};
        previousValue.name = element.name;
        previousValue.value1 = element.value1;
        previousValue.value0 = element.value0;
        previousValue.value3 = element.value3;
        previousValue.value4 = element.value4;
        previousValue.value6 = element.value6;
        previousValue.total = element.total;

        previousValues.push(previousValue);
    } else {
        changeValuesColor("value1_", "diff1_", "diff_parent1_", "diff_img1_", index, element.value1, previousValues[previousIndex].value1);
        changeValuesColor("value0_", "diff0_", "diff_parent0_", "diff_img0_", index, element.value0, previousValues[previousIndex].value0);
        changeValuesColor("value3_", "diff3_", "diff_parent3_", "diff_img3_", index, element.value3, previousValues[previousIndex].value3);
        changeValuesColor("value4_", "diff4_", "diff_parent4_", "diff_img4_", index, element.value4, previousValues[previousIndex].value4);
        changeValuesColor("value6_", "diff6_", "diff_parent6_", "diff_img6_", index, element.value6, previousValues[previousIndex].value6);
        changeValuesColor("total_", "diff_total_", "diff_parent_total", "diff_img_total_", index, element.total, previousValues[previousIndex].total);

        $("#prev1_" + index).html(previousValues[previousIndex].value1.toLocaleString());
        $("#prev0_" + index).html(previousValues[previousIndex].value0.toLocaleString());
        $("#prev3_" + index).html(previousValues[previousIndex].value3.toLocaleString());
        $("#prev4_" + index).html(previousValues[previousIndex].value4.toLocaleString());
        $("#prev6_" + index).html(previousValues[previousIndex].value6.toLocaleString());
        $("#prev_total_" + index).html(previousValues[previousIndex].total.toLocaleString());

        previousValues[previousIndex].value1 = element.value1;
        previousValues[previousIndex].value0 = element.value0;
        previousValues[previousIndex].value3 = element.value3;
        previousValues[previousIndex].value4 = element.value4;
        previousValues[previousIndex].value6 = element.value6;
        previousValues[previousIndex].total = element.total;
    }
}

function changeValuesColor(elementId, diff, diffParent, diffImg, index, currentValue, previousValue) {
    const element = $("#" + elementId + index);
    const diffElement = $("#" + diff + index);
    const diffParentElement = $("#" + diffParent + index);
    const diffImgElement = $("#" + diffImg + index);

    if(previousValue === currentValue) {
        removeClasses(element);
        element.addClass("nil-color");

        diffElement.css("visibility", "hidden");
        diffParentElement.css("visibility", "hidden");
        diffImgElement.attr("src", "../images/blank1.png");
    } else if(previousValue < currentValue) {
        removeClasses(element);
        element.addClass("up-color");

        diffParentElement.css("visibility", "visible");
        diffElement.css("visibility", "visible");
        diffElement.css("color", "#7FFF00");
        diffElement.html("+" + (currentValue - previousValue));
        diffImgElement.attr("src", "../images/up1.png");
    } else {
        removeClasses(element);
        element.addClass("down-color");

        diffParentElement.css("visibility", "visible");
        diffElement.css("visibility", "visible");
        diffElement.css("color", "#fc185a");
        diffElement.html(currentValue - previousValue);
        diffImgElement.attr("src", "../images/down1.png");
    }
}

function removeClasses(element) {
    element.removeClass("up-color");
    element.removeClass("down-color");
    element.removeClass("nil-color");
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

$(document).ready(function () {

});