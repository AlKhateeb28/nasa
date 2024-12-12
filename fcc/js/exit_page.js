function getExitPageContent() {
    return `<h1>Выход</h1>`;
}

function activeExitPage() {
    $("#content").empty();
    $("#content").append(getExitPageContent());
}
