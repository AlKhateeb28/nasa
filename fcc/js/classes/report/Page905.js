var page905 = null;

function openPage905(type) {
    const actionId = 905;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page905 = new Page905(actionId, type);

        page905.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page905;
}

class Page905 extends Page {
    actionId = 0;
    type = null;

    constructor(actionId, type) {
        super();

        this.actionId = actionId;
        this.type = type;
    }

    getId() {
        return 905;
    };

    getActionId() {
        return this.actionId;
    }

    getType() {
        return this.type;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page905.getContent());

        this.refreshPage();
    }

    refreshPage() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7431912320805250846&action=" + this.getType() +"&user_id=" + globalPage.getCurrentUserId(),
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    Page905.refresh(data.data);

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
                <div id="page905_header" class="main_statistic_header">Изучено материалов</div>
                <div>           
                    <div class="float-left">
                        <table id="page905_table">
                            <tr>
                                <td class="table-header table-cell" style="width: 1%">#</td>                       
                                <td class="table-header table-cell">Дата</td>                       
                                <td class="table-header table-cell">Название</td>
                                <td class="table-header table-cell">Состояние</td>                       
                            </tr>
                        </table>
                    </div>           
                </div>
            </div>
            
            <script type="text/html" id="page905_template">
                <tr>
                    <td id="page905_step" class="table-cell table-big_cell"></td>
                    <td id="page905_start" class="table-cell" style="text-align: center"></td>           
                    <td id="page905_name" class="table-cell"></td>
                    <td id="page905_number" class="table-cell"></td>           
                </tr>
            </script>
        `;
    }

    static refresh(list) {
        list.forEach((element, index) => {
            $("#page905_table").append(Page.template("page905_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page905_step").attr("id", "page905_step_" + index);
            const stepElement =  $("#page905_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page905_start").attr("id", "page905_start_" + index);
            const startElement =  $("#page905_start_" + index);
            startElement.html(element.serial + "." + element.number + "." + element.year);
            startElement.css("background-color", backgroundColor);

            $("#page905_name").attr("id", "page905_name_" + index);
            const nameElement =  $("#page905_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page905_number").attr("id", "page905_number_" + index);
            const scoreElement =  $("#page905_number_" + index);
            scoreElement.html(element.score);
            scoreElement.css("background-color", backgroundColor);
        });
    }
}