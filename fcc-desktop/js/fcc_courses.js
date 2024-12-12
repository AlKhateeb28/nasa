
$(document).ready(function () {
    $.ajax({
        url: "http://192.168.0.96/custom_web_template.html?object_id=7401083011735638492",
        async: true,
        cache: false,
        type: "POST",
        dataType: "text",
        success: function ( response ) {
            coursesArr = JSON.parse( response );

            console.log("Response: " + response);
        },
        error: function() {
            console.log("Ajax не прошел")
        }
    })
});