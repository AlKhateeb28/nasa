var page901 = null;

function openPage901(objectId) {
    const actionId = 901;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page901 = new Page901(actionId, objectId);

        page901.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page901;
}

class Page901 extends Page {
    actionId = 0;
    objectId = null;

    constructor(actionId, objectId) {
        super();

        this.actionId = actionId;
        this.objectId = objectId;
    }

    getId() {
        return 901;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page901.getContent());

        this.refreshPage();
    }

    refreshPage() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7432649999618495024&user_id=" + globalPage.getCurrentUserId(),
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page901.refresh(data.educationPlans);

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
            <div id="page901_header" class="main_statistic_header">Учебные программы</div>
            <div>           
                <div class="float-left">
                    <table id="page901_table">
                        <tr>
                            <td class="table-header table-cell" style="width: 1%">#</td>
                            <td class="table-header table-cell">Название</td>
                            <td class="table-header table-cell">Дата начала</td>
                            <td class="table-header table-cell">Дата окончания</td>                      
                            <td class="table-header table-cell"></td>
                        </tr>
                    </table>
                </div>           
            </div>
        </div>
        
        <script type="text/html" id="page901_template">
            <tr>
                <td id="page901_step" class="table-cell table-big_cell"></td>
                <td id="page901_name" class="table-cell"></td>
                <td id="page901_start" class="table-cell" style="text-align: center"></td>
                <td id="page901_finish" class="table-cell" style="text-align: center"></td>          
                <td id="page901_btn" class="table-cell" onclick="Page901.goToObject(this)"><div class="btn">Перейти</div></td>           
            </tr>
        </script>
        `;
    }

    static refresh(list) {
        list.forEach((element, index) => {
            $("#page901_table").append(Page.template("page901_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page901_step").attr("id", "page901_step_" + index);
            const stepElement =  $("#page901_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page901_name").attr("id", "page901_name_" + index);
            const nameElement =  $("#page901_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page901_start").attr("id", "page901_start_" + index);
            const startElement =  $("#page901_start_" + index);
            startElement.html(element.start);
            startElement.css("background-color", backgroundColor);

            $("#page901_finish").attr("id", "page901_finish_" + index);
            const finishElement =  $("#page901_finish_" + index);
            finishElement.html(element.finish);
            finishElement.css("background-color", backgroundColor);

            $("#page901_btn").attr("id", "page901_btn_" + index);
            const eduPlanBtnElement = $("#page901_btn_" + index);
            eduPlanBtnElement.attr("object_id", element.id);
            eduPlanBtnElement.css("background-color", backgroundColor);
        });
    }

    static goToObject(element) {
        const selectedElement = $("#" + element.id);

        Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=education_plan_cabinet&object_id=" + selectedElement.attr("object_id"));
    }
}