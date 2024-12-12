var modal;
var globalPage = null;
var notifyElement = null;

var isAdminBoxVisited = false;

function openFccSite() {
    var o = document.createElement("object");

    o.data = "/default.html" + window.location.hash;

    o.remove();

    console.log("Open FCC site");
}

class GlobalPage extends Page {
    refreshCounter = 0;
    currentUserId;
    currentPageId = 0;
    favorites = [];
    histories = [];
    pages = [];
    isForcingReload = false;

    constructor(actionId) {
        super();
    }

    getCurrentUserId() {
        return this.currentUserId;
    }

    setCurrentUserId(userId) {
        this.currentUserId = userId;
    }

    getCurrentPageId() {
        return this.currentPageId;
    }

    setCurrentPageId(pageId) {
        this.currentPageId = pageId;
    }

    getFavorites() {
        let favorites = [];

        this.favorites.forEach((menuId, index) => {
            favorites.push(menuId);
        });

        return favorites;
    }

    setFavorites(favorites) {
        this.favorites = favorites;
    }

    getHistories() {
        let histories = [];

        this.histories.forEach((history, index) => {
            histories.push(history);
        });

        return histories;
    }

    setHistories(histories) {
        this.histories = histories;
    }

    getPages() {
        let pages = [];

        this.pages.forEach((page, index) => {
            pages.push(page);
        });

        return pages;
    }

    setPages(pages) {
        this.pages = pages;
    }

    getForcingReload() {
        return this.isForcingReload;
    }

    setForcingReload(isForcingReload) {
        this.isForcingReload = isForcingReload;
    }

    addHistory(history) {
        this.histories.push(history);
    }

    showFavorites() {
        let instance = this;

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7431526482344747895",
            data: {
                mode: 1
            },
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state === "SUCCESS") {
                    console.log("GP Success");

                    let favorites = [];

                    data.favorites.forEach((menuId, index) => {
                        favorites.push(menuId);

                        const item = Menu.getMenuItemById(menuId);

                        if(item !== null) {
                            GlobalPage.addUserBoxItem(menuId, item.name);
                        }
                    });

                    globalPage.setFavorites(favorites);

                    openPage1(1);
                } else {
                    console.log("GetFavorites.Error: " + data.errorMessage);
                }
            },
            error: function(error) {
                console.log("GP.Show.Favorites - State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                /*if(instance.refreshCounter === 0) {
                    console.log("Trying to login");

                    instance.refreshCounter++;

                    openFccSite();

                    instance.showFavorites();
                }*/
            }
        });
    }
    
    markFavorite(action) {
        for(let i = 0; i < this.getFavorites().length; i++) {
            if(this.getFavorites()[i] === action) {
                $("#page" + action + "_like_img").attr("src", "./images/like_up.png");

                break;
            }
        }
    }

    clearSelectedValues() {
        for(let i = 0; i < this.histories.length; i++) {
            this.histories[i].selected = 0;
        }
    }

    addToHistory(elementId) {
        const element = $("#" + elementId);

        if(element.attr("add_to_history") === undefined || element.attr("add_to_history") === 1) {
            if (this.histories[this.histories.length - 1].location === elementId) {
                this.clearSelectedValues();

                this.histories[this.histories.length - 1].selected = 1;

                return;
            }

            const tempHistories = [];

            for (let i = 0; i < this.histories.length; i++) {
                const elem = {};
                elem.location = this.histories[i].location;
                elem.selected = 0;

                tempHistories.push(elem);

                if (this.histories[i].selected === 1) {
                    break;
                }
            }

            this.histories = tempHistories;

            const elem = {};
            elem.location = elementId;
            elem.selected = 1;
            this.addHistory(elem);
        }
    }

    goBack() {
        if(this.histories.length > 0 && this.histories[0].selected) {
            return;
        }

        for(let i = this.histories.length - 1; i => 0; i--) {
            if(this.histories[i].selected === 1) {
                if(i > 0) {
                    this.histories[i].selected = 0;
                    this.histories[i - 1].selected = 1;

                    const historyElement = $("#" + this.histories[i - 1].location);

                    historyElement.attr("add_to_history", "0");
                    historyElement.click();
                    historyElement.attr("add_to_history", "1");

                    break;
                }
            }
        }
    }

    goForward() {
        if(this.histories.length > 0 && this.histories[this.histories.length - 1].selected) {
            return;
        }

        for(let i = this.histories.length - 1; i >= 0; i--) {
            if(this.histories[i].selected === 1) {
                if(i !== this.histories.length - 1) {
                    this.histories[i].selected = 0;
                    this.histories[i + 1].selected = 1;

                    const historyElement = $("#" + this.histories[i + 1].location);
                    historyElement.attr("add_to_history", "0");
                    historyElement.click();
                    historyElement.attr("add_to_history", "1");

                    break;
                }
            }
        }
    }

    selectSpecialUser(element) {
        this.clearOpenedPages();

        GlobalPage.onUserInfoImageClick();

        $("#item_img_90").attr("src", "./images/admin_other_user.png");

        const specialUserElements = $(".special-user");

        specialUserElements.removeClass("picked");
        //specialUserElements.removeClass("unpicked");
        specialUserElements.attr("picked", "0")

        const selectedUserElement = $("#" + element.id);

        if(parseInt(selectedUserElement.attr("picked")) === 0) {
            selectedUserElement.addClass("picked");

            /*selectedUserElement.css("color", "white");
            selectedUserElement.css("background-color", "orange");*/
            selectedUserElement.attr("picked", "1");

            this.setCurrentUserId(selectedUserElement.attr("picked_id"));
            this.setForcingReload(true);

            Menu.activateMenuItem({id : "item_parent_" + this.getCurrentPageId()});

            this.setForcingReload(false);
        }
    }

    clearOpenedPages() {
        this.pages.forEach((page, index) => {
            $("#content_" + page).empty();
        });

        this.pages = [];
    }

    initializePage(pageId) {
        this.pages.push(pageId);
    }

    isPageVisited(pageId) {
        for(let i = 0; i < this.pages.length; i++) {
            if(this.pages[i] === pageId) {
                return true;
            }
        }

        return false;
    }

    activatePage(pageId) {
        this.setCurrentPageId(pageId);

        this.getPages().forEach((page, index) => {
            $("#content_" + page).css("display", "none");
        });

        $("#content_" + pageId).css("display", "block");
    }

    // STATIC METHODS
    static getCurrentDateTime() {
        const currentDate = new Date();

        return currentDate.toLocaleString("ru-RU").split(",")[0] +
            currentDate.toLocaleString("ru-RU").split(",")[1];
    }

    static getCurrentDate() {
        const currentDate = new Date();

        return currentDate.toLocaleString("ru-RU").split(",")[0];
    }

    static getMonthFromDatetime(datetime) {
        const currentDate = new Date(datetime).toLocaleString("ru-RU").split(",")[0];

        return parseInt(currentDate.split(".")[1]);
    }

    static getYearFromDatetime(datetime) {
        const currentDate = new Date(datetime).toLocaleString("ru-RU").split(",")[0];

        return parseInt(currentDate.split(".")[2]);
    }

    static getCurrentDay() {
        const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

        return parseInt(currentDate.split(".")[0]);
    }

    static getCurrentMonth() {
        const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

        return parseInt(currentDate.split(".")[1]);
    }

    static getCurrentYear() {
        const currentDate = new Date().toLocaleString("ru-RU").split(",")[0];

        return parseInt(currentDate.split(".")[2]);
    }

    static showWaiter() {
        $("#fcc_wait").css("display", "block");
    }

    static hideWaiter() {
        $("#fcc_wait").css("display", "none");
    }

    static removeNotification() {
        $('#stickyNotification').remove();
    }

    static showNotification(message){
        notifyElement = document.createElement("div");

        notifyElement.id = "stickyNotification";
        notifyElement.style.display = "block";
        notifyElement.style.position = "absolute";
        notifyElement.style.width = "350px";
        notifyElement.style.height = "150px";
        notifyElement.style.padding = "10px";
        notifyElement.style.borderRadius = "5px";
        notifyElement.style.border = "1px solid black";
        notifyElement.style.right = "10px";
        notifyElement.style.bottom = "10px";
        notifyElement.style.backgroundColor = "whitesmoke";
        notifyElement.innerHTML = "<div>" +
            "<div>" +
            "<div style='background-color: red; font-weight: bold; color: white; text-align: center; width: 91%;margin-left: -6px; padding-right: 18px;'>Внимание</div>" +
            "<div style='float: right; margin-top: -17px; cursor: pointer;'><img src='images/close.png' style='width: 16px; height: 16px; cursor: pointer;' onclick='GlobalPage.removeNotification()';></div>" +
            "</div>" +
            "<div style='color: black; background-color: whitesmoke; margin-top: 10px;'>" + message + "</div>" +
            "</div>";
        document.body.appendChild(notifyElement);

        document.addEventListener("scroll", (event) => {
            let btmPos = -window.scrollY + 10;
            notifyElement.style.bottom = btmPos + "px";
        });

        setTimeout(function() {
            document.body.removeChild(notifyElement);
        }, 30000 );
    }

    static onBodyClick() {
        const bodyElement = $("body");

        if(parseInt(bodyElement.attr("reaction_onclick")) === 0) {
            const userIconBoxElement = $("#user_icon_box");

            if (parseInt(userIconBoxElement.attr("opened")) === 1) {
                userIconBoxElement.attr("opened", "0");

                $("#user_box").css("display", "none");
            }
        } else {
            bodyElement.attr("reaction_onclick", "0");
        }
    }

    static onUserInfoImageClick() {
        const userIconBoxElement = $("#user_icon_box");

        if (parseInt(userIconBoxElement.attr("opened")) === 0) {
            $("body").attr("reaction_onclick", "1");

            userIconBoxElement.attr("opened", "1");

            $("#user_box").css("display", "block");
        } else {
            userIconBoxElement.attr("opened", "0");

            $("#user_box").css("display", "none");
        }
    }

    static userInfoLikePage(menuId) {
        const likeBoxElement = $("#page" + menuId + "_like_box");

        if(parseInt(likeBoxElement.attr("liked")) === 0) {
            likeBoxElement.attr("liked", "1");

            $("#page" + menuId + "_like_img").attr("src", "./images/like_up.png");

            const menuItem = Menu.getMenuItemById(menuId);

            if(menuItem !== null) {
                this.addUserBoxItem(menuId, menuItem.name);
            }

            GlobalPage.processFavorites(2, menuId); // ADD to favorites
        } else {
            likeBoxElement.attr("liked", "0");

            $("#page" + menuId + "_like_img").attr("src", "./images/like.png");

            this.removeUserBoxItem(menuId);

            GlobalPage.processFavorites(8, menuId); // DELETE from favorites
        }
    }

    static addUserBoxItem(menuId, name) {
        const userBoxElement = $("#user_box");
        userBoxElement.attr("count", parseInt(userBoxElement.attr("count")) + 1);

        userBoxElement.append(Page.template("user_box_item_template"));
        let elementNumber = parseInt(userBoxElement.attr("count"));

        $("#user_box_item").attr("id", "user_box_item_" + elementNumber);

        const newUserBoxElement = $("#user_box_item_" + elementNumber);

        newUserBoxElement.attr("page_id", menuId);
        newUserBoxElement.addClass("like-item-" + menuId);
        newUserBoxElement.html(name);
    }

    static removeUserBoxItem(menuId) {
        $(".like-item-" + menuId).remove();
    }

    static selectPage(element) {
        this.onUserInfoImageClick();

        const favoriteElement = $("#" + element.id);
        const menuId = favoriteElement.attr("page_id");

        Menu.activateMenuItem({
            id : "item_parent_" + menuId
        });
    }

    /*autoLogin() {
        $.ajax({
            //url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/",
            //url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/home?mode=home",
            //url: "https://xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/",
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7431526482344747895",
            async: true,
            type: "GET",
            dataType: "text",
            success: function (data) {
                console.log("GP Success");
            },
            error: function(error) {
                console.log("GP - State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }*/

    static getPickedUserId() {
        if(parseInt($("#fk").attr("picked")) === 1) {
            return $("#fk").attr("picked_id");
        } else if(parseInt($("#to").attr("picked")) === 1) {
            return $("#to").attr("picked_id");
        } else if(parseInt($("#aa").attr("picked")) === 1) {
            return $("#aa").attr("picked_id");
        }

        return null;
    }

    static sleep(delay) {
        new Promise((resolve) => setTimeout(resolve, delay)).then();
    }

    static processFavorites(mode, pageId) {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7431526482344747895",
            data: {
                mode: mode,
                page_id: pageId
            },
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {},
            error: function(error) {
                console.log("GP.Process.Favorites  - State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }
}

function setLastSendDate(id) {
    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7101807729834720822&type=2&id=" + id,
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
            }  else {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        },
        error: function(error) {
            console.log("GP.Process.Favorites  - State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
        }
    });
}

function verifyNotification() {
    let userIdParameter = "";
    const pickedId = GlobalPage.getPickedUserId();

    if(pickedId !== null) {
        userIdParameter = "&user_id=" + pickedId;
    }

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7101807729834720822" + userIdParameter,
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.errorMessage.indexOf("#") < 0) {
                data.notifications.forEach((notification, index) => {
                    console.log("ID: " + notification.id + " Send.NULL: " + (notification.lastSend === null));

                    if(notification.lastSend === null) {
                        //Page.sendNotification("СДО", notification.name);

                        setLastSendDate(notification.id);
                    }
                });
            }  else {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        },
        error: function(error) {
            console.log("GP.Process.Favorites  - State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
        }
    });
}

$(document).ready(function () {
    initModalWindow("modal_box");

    globalPage = new GlobalPage();

    //globalPage.autoLogin();

    $("#user_box").css("left", $(window).width() - 540);

    /*verifyNotification();
    setInterval(verifyNotification, 30000);*/

    globalPage.showFavorites();
});