var page20 = null;

function openPage20(actionId) {
    const pageId = 20;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page20 = new Page20(actionId);

        page20.initialize();
    }

    globalPage.activatePage(pageId);

    return page20;
}

class Page20 extends Page {
    actionId = 0;
    data = [];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId() {
        return 20;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(this.getContent());

        globalPage.markFavorite(this.getId());

        this.refreshPage();
    }

    getContent() {
        return `
            <div id="page20_like_box" liked="0" class="fcc-card like-box" onclick="GlobalPage.userInfoLikePage(20)">
                <img id="page20_like_img" src="./images/like.png" class="like-img" alt=""/>    
            </div>
            <div id="page20_events_box" style="color: #f5fffa"></div>
            
            <script type="text/html" id="page20_small_card_template">
                <div id="page20_small_card" class="float-left fcc-card page20-card" style="width: 32%; height: 300px;"></div>
            </script>
            
            <script type="text/html" id="page20_big_card_template">
                <div id="page20_big_card" class="float-left fcc-card page20-card" style="width: 48.3%; height: 300px;">&nbsp;</div>
            </script>
            
            <script type="text/html" id="page20_card_template">
                <div id="page20_card_name" style="font-size: xx-large; width: 100%; text-align: center; padding-top: 120px;"></div>
                <div id="page20_card_date_box" style="padding-top: 30px; padding-left: 40%; font-size: large; font-weight: bold">
                    <div id="page20_card_start" class="float-left"></div>
                    <div class="float-left">&nbsp;-&nbsp;</div>
                    <div id="page20_card_finish" class="float-left"></div>
                </div>
                <br/><br/>       
                <div id="page20_card_footer" style="padding-top: 10%;">
                    <div id="page20_card_state" class="float-left" style="margin-left: 30px;"></div>
                    <div id="page20_card_place" class="float-right page-link" style="margin-right: 30px;" onclick="Page.openLink('https://yandex.ru/maps/213/moscow/probki/?ll=37.654202%2C55.750056&z=18.21')"></div>
                </div>
            </script>          
        `;
    }

    refreshPage() {
        let userIdParameter = "";
        const pickedId = GlobalPage.getPickedUserId();

        if(pickedId !== null) {
            userIdParameter = "&user_id=" + pickedId;
        }

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7436649459432433382" + userIdParameter,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page20.refreshData(data.events);

                    GlobalPage.hideWaiter();
                } else {
                    console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                GlobalPage.showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
            }
        });
    }

    static isBigCard(index) {
        if((index + 1) % 5 === 0 || (index + 1) % 5 === 4) {
            return true;
        } else {
            return false;
        }
    }

    static refreshData(list) {
        list.forEach((element, index) => {
            let eventBoxElement;
            const imageNumber = (index + 1) % 5;

            if(Page20.isBigCard(index)) {
                $("#page20_events_box").append(Page.template("page20_big_card_template"));

                $("#page20_big_card").attr("id", "page20_big_card_" + index);
                eventBoxElement = $("#page20_big_card_" + index);
            } else {
                $("#page20_events_box").append(Page.template("page20_small_card_template"));

                $("#page20_small_card").attr("id", "page20_small_card_" + index);
                eventBoxElement = $("#page20_small_card_" + index);
            }

            eventBoxElement.append(Page.template("page20_card_template"));

            $("#page20_card_name").attr("id", "page20_card_name_" + index);
            const nameElement = $("#page20_card_name_" + index);
            nameElement.html(element.name);

            $("#page20_card_date_box").attr("id", "page20_card_date_box_" + index);
            if(element.statusId == "close") {
                nameElement.css("color", "#c0c0c0");

                $("#page20_card_date_box_" + index).css("color", "#c0c0c0");
            } else if(moment().isSame(element.startDate) || (moment().isAfter(element.startDate) && moment().isBefore(element.finishDate)) || moment().isSame(element.finishDate)) {
                $("#page20_card_date_box_" + index).css("color", "#7fff00");
            }

            $("#page20_card_start").attr("id", "page20_card_start_" + index);
            $("#page20_card_start_" + index).html(element.start);

            $("#page20_card_finish").attr("id", "page20_card_finish_" + index);
            $("#page20_card_finish_" + index).html(element.finish);

            $("#page20_card_footer").attr("id", "page20_card_footer_" + index);
            if(Page20.isBigCard(index)) {
                $("#page20_card_footer_" + index).css("padding-top", "4.5%");
            } else {
                $("#page20_card_footer_" + index).css("padding-top", "10%");
            }

            $("#page20_card_state").attr("id", "page20_card_state_" + index);
            const stateElement = $("#page20_card_state_" + index);
            stateElement.html(element.state);
            if(element.statusId === "close") {
                stateElement.css("color", "#7fff00");
            } else {
                stateElement.css("color", Page.activeCardBackgroundColor);
            }

            $("#page20_card_place").attr("id", "page20_card_place_" + index);
            $("#page20_card_place_" + index).html(element.place);
        });
    }
}