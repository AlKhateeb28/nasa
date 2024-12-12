var page70 = null;
var calendar70 = null;

function openPage70(actionId) {
    const pageId = 70;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page70 = new Page70(actionId);

        page70.initialize();
    }

    globalPage.activatePage(pageId);

    return page70;
}

class Page70 extends Page {
    actionId = 0;
    data = [];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId() {
        return 70;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.sleep(1);

        globalPage.markFavorite(this.getId());

        this.refreshPage();
    }

    refreshPage() {
        let userIdParameter = "";
        const pickedId = GlobalPage.getPickedUserId();

        if(pickedId !== null) {
            userIdParameter = "&user_id=" + pickedId;
        }

        calendar70 = new Calendar(70,  "content_70", this.getDataUrl());
        calendar70.refreshData("calendar70", moment().format("YYYY-MM-DD"))
    }

    getDataUrl() {
        let userIdParameter = "";
        const pickedId = GlobalPage.getPickedUserId();

        if(pickedId !== null) {
            userIdParameter = "&user_id=" + pickedId;
        }

        return "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7097148700169281373" + userIdParameter;
    }
}