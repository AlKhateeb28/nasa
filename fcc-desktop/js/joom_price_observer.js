$(document).ready(function () {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7421809736986544030",
        async: true,
        type: "GET",
        dataType: "text",
        success: function (data) {
            $("#joom").html(data);
            objectList = JSON.parse(data);

            console.log("Data: " + objectList);
        },
        error: function() {
            console.log("Ajax не прошел")
        }
    })
});