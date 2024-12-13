var page30 = null;

function openPage30(actionId) {
    const pageId = 30;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page30 = new Page30(actionId);

        page30.initialize();
    }

    globalPage.activatePage(pageId);

    return page30;
}

class Page30 extends Page {
    actionId = 0;
    data = [];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId() {
        return 30;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        GlobalPage.sleep(1);

        $("#content_" + this.getId()).append(this.getContent());

        globalPage.markFavorite(this.getId());

        this.refreshPage();
    }

    getContent() {
        return `
            <div id="page30_like_box" liked="0" class="fcc-card like-box" onclick="GlobalPage.userInfoLikePage(30)">
                <img id="page30_like_img" src="./images/like.png" class="like-img" alt=""/>    
            </div>
            <div id="page30_box" style="padding-top: 20px"></div>         
            <!-- LIST TEMPLATE -->
            <script type="text/html" id="page30_card_list_template">
                <div id="page30_card" class="float-left fcc-card" style="width:40%; min-width: 400px;">
                    <div style="border-bottom: 1px solid #dee2e6; background: url(./images/banner02.png) no-repeat 1% / 101%; margin-top: -18px;">
                        <div id="page30_card_header" style="width: 100%; font-size: x-large; padding-left: 40px; color: mintcream; padding-top: 20px; padding-bottom: 20px;"></div>
                    </div>
                    <div style="width: 100%">
                        <table id="page30_card_content" style="width: 100%;">                        
                        </table>
                    </div>
                </div>
            </script>            
            <!-- LIST ELEMENT TEMPLATE -->
            <script type="text/html" id="page30_card_list_element_template">
                <tr>
                    <td id="page30_card_row" class="page30-card-row" object_id="" onclick="">
                        <div>
                            <div id="page30_card_list_img" class="float-left" style="margin-left: 10px; margin-top: 2px;">
                                <img src="./images/book32.png" alt=""/>
                            </div>
                            <div id="page30_card_list_name" class="float-left" style="margin-left: 20px; margin-top: 8px;"></div>
                        </div>
                    </td>
                </tr>
            </script>
            <!-- CARD LIST TEMPLATE -->
            <script type="text/html" id="page30_card_solution_template">
                <div class="float-left fcc-card" style="width:58%; min-width: 400px; padding-bottom: 19px; background-color: #ffefd5">
                    <div style="border-bottom: 1px solid #dee2e6; background: url(./images/banner02.png) no-repeat 1% / 101%; margin-top: -18px;">
                        <div id="page30_card_solution_header" style="width: 100%; font-size: x-large; padding-left: 40px; color: mintcream; padding-top: 20px; padding-bottom: 20px;"></div>
                    </div>                   
                    <div id="page30_card_solution_content" style="width: 100%">                        
                    </div>
                </div>
            </script> 
            <!-- CARD ELEMENT TEMPLATE -->
            <script type="text/html" id="page30_card_solution_box_template">
                <div class="float-left fcc-card page30-card-element">
                    <div>
                        <div id="page30_solution_name" style="width: 100%; text-align: center; font-size: x-large;"></div>
                    </div>
                    <div id="page30_solution_header" class="page30-solution-header"></div>
                    <div style="padding-top: 10px;">                   
                        <div id="page30_solution_footer" class="float-right page30-solution-footer" object_id="" onclick="Page30.goToSolution(this)">Подробнее</div>
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
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7436726661532301415" + userIdParameter,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page30.refreshData(data.elements);

                    GlobalPage.hideWaiter();
                } else {
                    console.log("Error: " + data.errorMessage);
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    // STATIC METHODS
    static refreshData(list) {
        list.forEach((element, index) => {
            if(index === 0 || index === 2) {
                $("#page30_box").append(Page.template("page30_card_list_template"));

                $("#page30_card").attr("id", "page30_card_" + index);
                if(index === 2) {
                    $("#page30_card_" + index).css("margin-top", "30px");
                }

                const cardContentElement = $("#page30_card_content");
                cardContentElement.attr("id", "page30_card_content_" + index);

                $("#page30_card_header").attr("id", "page30_card_header_" + index);
                $("#page30_card_header_" + index).html(element.name);

                element.children.forEach((child, step) => {
                    cardContentElement.append(Page.template("page30_card_list_element_template"));

                    $("#page30_card_row").attr("id", "page30_card_row_" + index + "_" + step);
                    const rowElement = $("#page30_card_row_" + index + "_" + step);
                    rowElement.attr("object_id", "" + child.id);
                    rowElement.on( "click", function() {
                        Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/_wt/" + child.id + "/doc_id/" + child.id);
                    });

                    $("#page30_card_list_name").attr("id", "page30_card_list_name_" + index + "_" + step);
                    $("#page30_card_list_name_" + index + "_" + step).html(child.name);
                });
            } else if(index === 1) {
                $("#page30_box").append(Page.template("page30_card_solution_template"));

                const cardContentElement = $("#page30_card_solution_content");
                cardContentElement.attr("id", "page30_card_solution_content_" + index);

                $("#page30_card_solution_header").attr("id", "page30_card_solution_header_" + index);
                $("#page30_card_solution_header_" + index).html(element.name);

                element.children.forEach((child, index) => {
                    cardContentElement.append(Page.template("page30_card_solution_box_template"));

                    $("#page30_solution_header").attr("id", "page30_solution_header_" + index);
                    $("#page30_solution_header_" + index).css("background", "url(https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/download_file.html?file_id=" + child.resourceId + ") center center / cover no-repeat");
                    if(index === 2) {
                        $("#page30_solution_header_" + index).css("height", "49px");
                    }

                    $("#page30_solution_name").attr("id", "page30_solution_name_" + index);
                    $("#page30_solution_name_" + index).html(child.name.split("_")[1]);

                    $("#page30_solution_footer").attr("id", "page30_solution_footer_" + index);
                    $("#page30_solution_footer_" + index).attr("object_id", child.id);
                });
            }
        });
    }

    static goToSolution(element) {
        const selectedElement = $("#" + element.id);

        Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=library_material&object_id=" + selectedElement.attr("object_id"))
    }
}