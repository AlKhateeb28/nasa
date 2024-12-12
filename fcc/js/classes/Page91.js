var page91 = null;

function openPage91(actionId) {
    const pageId = 91;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);
        page91 = new Page91(actionId);

        page91.initialize();
    }

    globalPage.activatePage(pageId);

    return page91;
}

class Page91 extends Page {
    actionId = 0;

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    initialize(action) {
        globalPage.setCurrentPageId(action);

        GlobalPage.showWaiter();

        this.show();
    }

    show() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/gd-board/index.html",
            async: false,
            type: "GET",
            dataType: "html",
            success: function (data) {
                $("#content_91").html(data);

                GlobalPage.hideWaiter();
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }
}