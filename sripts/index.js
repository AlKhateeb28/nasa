$(document).ready(function () {
    /*$.getJSON( "data/settings.json", function( data ) {
        $.each( data, function( key, value ) {
            if(key === "selected") {
                value.forEach(function(id) {
                    dataObject.selected.push(id);

                    var selectedElement = $("#" + id);
                    selectedElement.addClass("active");
                    selectedElement.find(".checkbox").prop("checked", true);

                    $("[rel-id='" + selectedElement.attr("id") + "']").addClass("active");
                    openedCount++;
                });
            }
        });

        $("#opened_tech").text(openedCount);
    });*/

    showArrayElements();
});

// -------
function showArrayElements() {
    var resultArray = [['a', 'b', 'c'], []];

    var result = '';

    resultArray.forEach(function callback(element, index, array) {
        result = result.concat(element, "<br/>");
    });

    $("#infoBlock").html( result );
}