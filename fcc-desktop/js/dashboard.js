function hiddenAll () {
    $("#dashboard_caption").css("color", "silver");
    $("#dashboard_img").attr("src", "images/dashboard_silver.png");
    $("#agents_caption").css("color", "silver");
    $("#agents_img").attr("src", "images/agents_silver.png");
    $("#network_caption").css("color", "silver");
    $("#network_img").attr("src", "images/network_silver.png");

    $("#mismatch_box").css("display", "none");
    $("#index_box").css("display", "none");
    $("#network_box").css("display", "none");
}

function changeTask(task) {
    switch (task) {
        case "DASHBOARD":
            hiddenAll();
            $("#mismatch_box").css("display", "block");

            $("#dashboard_caption").css("color", "white");
            $("#dashboard_img").attr("src", "images/dashboard_white.png");

            break;

        case "AGENTS":
            hiddenAll();
            $("#index_box").css("display", "block");

            $("#agents_caption").css("color", "white");
            $("#agents_img").attr("src", "images/agents_white.png");

            break;

        case "NETWORK":
            hiddenAll();
            $("#network_box").css("display", "block");

            $("#network_caption").css("color", "white");
            $("#network_img").attr("src", "images/network_white.png");

            break;
    }
}

$(document).ready(function () {

});