var page900 = null;

function openPage900(objectId) {
    const actionId = 900;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page900 = new Page900(actionId, objectId);

        page900.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page900;
}

class Page900 extends Page {
    actionId = 0;
    objectId = null;

    constructor(actionId, objectId) {
        super();

        this.actionId = actionId;
        this.objectId = objectId;
    }

    getId() {
        return 900;
    };

    getActionId() {
        return this.actionId;
    }

    getObjectId() {
        return this.objectId;
    };

    setObjectId(objectId) {
        this.objectId = objectId;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page900.getContent());

        this.refreshPage();
    }

    showSelectedTest(element) {
        const selectedElement = $("#" + element.id);

        this.goToObject(selectedElement.attr("object_id"));
    }

    refreshPage() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7438880312075971778&user_id=" + globalPage.getCurrentUserId(),
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page900.refreshTests(data.tests);

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
    static refreshTests(list) {
        list.forEach((element, index) => {
            $("#page900_table").append(Page.template("page900_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page900_step").attr("id", "page900_step_" + index);
            const stepElement =  $("#page900_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page900_name").attr("id", "page900_name_" + index);
            const nameElement =  $("#page900_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page900_start").attr("id", "page900_start_" + index);
            const startElement =  $("#page900_start_" + index);
            startElement.html(element.start);
            startElement.css("background-color", backgroundColor);

            $("#page900_finish").attr("id", "page900_finish_" + index);
            const finishElement =  $("#page900_finish_" + index);
            finishElement.html(element.finish);
            finishElement.css("background-color", backgroundColor);

            if(element.type === 0 && moment().isAfter(element.checkDate)) {
                finishElement.css("color", "#ed143d");
            }

            $("#page900_score").attr("id", "page900_score_" + index);
            const scoreElement =  $("#page900_score_" + index);
            scoreElement.html(element.score);
            scoreElement.css("background-color", backgroundColor);

            $("#page900_btn").attr("id", "page900_btn_" + index);
            const eduPlanBtnElement = $("#page900_btn_" + index);
            eduPlanBtnElement.attr("object_id", element.id);
            eduPlanBtnElement.css("background-color", backgroundColor);
        });
    }

    static getContent() {
        return `
        <div>
        <div id="page900_header" class="main_statistic_header">Активные тесты</div>
        <div>           
            <div class="float-left">
                <table id="page900_table">
                    <tr>
                        <td class="table-header table-cell" style="width: 1%">#</td>
                        <td class="table-header table-cell">Название</td>
                        <td class="table-header table-cell">Дата начала</td>
                        <td class="table-header table-cell">Дата окончания</td>                      
                        <td class="table-header table-cell">Баллы</td>
                        <td class="table-header table-cell"></td>
                    </tr>
                </table>
            </div>           
        </div>
    </div>
    
    <script type="text/html" id="page900_template">
        <tr>
            <td id="page900_step" class="table-cell table-big_cell"></td>
            <td id="page900_name" class="table-cell"></td>
            <td id="page900_start" class="table-cell" style="text-align: center"></td>
            <td id="page900_finish" class="table-cell" style="text-align: center"></td>          
            <td id="page900_score" class="table-cell" style="text-align: center"></td>
            <td id="page900_btn" class="table-cell" onclick="page900.showSelectedTest(this)"><div class="btn">Перейти</div></td>           
        </tr>
    </script>
    `;
    }
}