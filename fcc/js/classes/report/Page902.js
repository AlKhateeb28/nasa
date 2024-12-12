var page902 = null;

function openPage902(objectId) {
    const actionId = 902;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page902 = new Page902(actionId, objectId);

        page902.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page902;
}

class Page902 extends Page {
    actionId = 0;
    objectId = null;

    constructor(actionId, objectId) {
        super();

        this.actionId = actionId;
        this.objectId = objectId;
    }

    getId() {
        return 902;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page902.getContent());

        this.refreshPage();
    }

    refreshPage() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7433721197830425062&user_id=" + globalPage.getCurrentUserId(),
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page902.refresh(data.activeLearnings);

                    GlobalPage.hideWaiter();
                } else {
                    GlobalPage.showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                        "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

            }
        });
    }

    // STATIC METHODS
    static getContent() {
        return `
            <div>
                <div id="page902_header" class="main_statistic_header">Электронные курсы</div>
                <div>           
                    <div class="float-left">
                        <table id="page902_table">
                            <tr>
                                <td class="table-header table-cell" style="width: 1%">#</td>
                                <td class="table-header table-cell">Название</td>
                                <td class="table-header table-cell">Дата начала</td>                                            
                                <td class="table-header table-cell"></td>
                            </tr>
                        </table>
                    </div>           
                </div>
            </div>
            
            <script type="text/html" id="page902_template">
                <tr>
                    <td id="page902_step" class="table-cell table-big_cell"></td>
                    <td id="page902_name" class="table-cell"></td>
                    <td id="page902_start" class="table-cell" style="text-align: center"></td>          
                    <td id="page902_btn" class="table-cell" onclick="Page902.goToObject(this)"><div class="btn">Перейти</div></td>           
                </tr>
            </script>
        `;
    }

    static refresh(list) {
        list.forEach((element, index) => {
            $("#page902_table").append(Page.template("page902_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page902_step").attr("id", "page902_step_" + index);
            const stepElement =  $("#page902_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page902_name").attr("id", "page902_name_" + index);
            const nameElement =  $("#page902_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page902_start").attr("id", "page902_start_" + index);
            const startElement =  $("#page902_start_" + index);
            startElement.html(element.start);
            startElement.css("background-color", backgroundColor);

            $("#page902_btn").attr("id", "page902_btn_" + index);
            const elCourseBtnElement = $("#page902_btn_" + index);
            elCourseBtnElement.attr("object_id", element.id);
            elCourseBtnElement.css("background-color", backgroundColor);
        });
    }

    static goToObject(element) {
        const selectedElement = $("#" + element.id);

        Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/learning_proc?object_id=" + selectedElement.attr("object_id"));
    }
}