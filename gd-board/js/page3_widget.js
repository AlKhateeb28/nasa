function getPage3Content() {
    return `
    <div>
        
    </div>`;
}

function reloadPage3() {
    // Dynamically load on tab click
    if(visitPage(3)) {
        $("#wait").css("visibility", "visible");

        sleep(1).then(r => page3Refresh(0));
        //page2Refresh(0);
    }
}

function page3Refresh() {

}

$(document).ready(function () {
    initVisitPage(false);

    $("#page3").append(getPage3Content());
});