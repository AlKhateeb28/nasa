var page80 = null;

function openPage80(actionId) {
    const pageId = 80;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page80 = new Page80(actionId);

        page80.initialize();
    }

    globalPage.activatePage(pageId);

    return page80;
}

class Page80 extends Page {
    actionId = 0;
    data = [];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId() {
        return 80;
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
    }
}