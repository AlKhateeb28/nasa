var page906 = null;

function openPage906(type) {
    const actionId = 906;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page906 = new Page906(actionId, type);

        page906.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page906;
}

class Page906 extends Page {
    actionId = 0;
    type = null;

    constructor(actionId, type) {
        super();

        this.actionId = actionId;
        this.type = type;
    }

    getId() {
        return 906;
    };

    getActionId() {
        return this.actionId;
    }

    getType() {
        return this.type;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page906.getContent());

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
                    Page906.refresh(data.data);

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
                <div id="page906_header" class="main_statistic_header">Получено сертификатов</div>
                <div>           
                    <div class="float-left">
                        <table id="page906_table">
                            <tr>
                                <td class="table-header table-cell" style="width: 1%">#</td>                       
                                <td class="table-header table-cell">Дата выдачи</td>                       
                                <td class="table-header table-cell">Название</td>
                                <td class="table-header table-cell">Номер</td>                       
                            </tr>
                        </table>
                    </div>           
                </div>
            </div>
            
            <script type="text/html" id="page906_template">
                <tr>
                    <td id="page906_step" class="table-cell table-big_cell"></td>
                    <td id="page906_start" class="table-cell" style="text-align: center"></td>           
                    <td id="page906_name" class="table-cell"></td>
                    <td id="page906_number" class="table-cell table-big_cell" style="text-align: center"></td>           
                </tr>
            </script>            
        `;
    }

    static refresh(list) {
        list.forEach((element, index) => {
            $("#page906_table").append(Page.template("page906_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page906_step").attr("id", "page906_step_" + index);
            const stepElement =  $("#page906_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page906_start").attr("id", "page906_start_" + index);
            const startElement =  $("#page906_start_" + index);
            startElement.html(element.startDate);
            startElement.css("background-color", backgroundColor);

            $("#page906_name").attr("id", "page906_name_" + index);
            const nameElement =  $("#page906_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page906_number").attr("id", "page906_number_" + index);
            const scoreElement =  $("#page906_number_" + index);
            scoreElement.html(element.serial + "-" + element.number + "/" + element.year);
            scoreElement.css("background-color", backgroundColor);
        });
    }
}