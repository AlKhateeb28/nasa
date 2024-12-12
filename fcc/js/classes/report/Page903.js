var page903 = null;

function openPage903(type) {
    const actionId = 903;

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(actionId)) {
        globalPage.initializePage(actionId);

        page903 = new Page903(actionId, type);

        page903.initialize();
    }

    $(".menu-item-selected").removeClass("menu-item-selected");
    globalPage.activatePage(actionId);

    return page903;
}

class Page903 extends Page {
    actionId = 0;
    type = null;

    constructor(actionId, type) {
        super();

        this.actionId = actionId;
        this.type = type;
    }

    getId() {
        return 903;
    };

    getActionId() {
        return this.actionId;
    }

    getType() {
        return this.type;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(Page903.getContent());

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
                    Page903.refresh(data.data);

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
                <div id="page903_header" class="main_statistic_header">Пройдено электронных курсов</div>
                <div>           
                    <div class="float-left">
                        <table id="page903_table">
                            <tr>
                                <td class="table-header table-cell" style="width: 1%">#</td>
                                <td class="table-header table-cell">Дата начала</td>
                                <td class="table-header table-cell">Дата окончания</td>
                                <td class="table-header table-cell">Название</td>
                                <td class="table-header table-cell">Баллы</td>
                                <td class="table-header table-cell">Максимум</td>
                            </tr>
                        </table>
                    </div>           
                </div>
            </div>
            
            <script type="text/html" id="page903_template">
                <tr>
                    <td id="page903_step" class="table-cell table-big_cell"></td>
                    <td id="page903_start" class="table-cell" style="text-align: center"></td>
                    <td id="page903_finish" class="table-cell" style="text-align: center"></td>
                    <td id="page903_name" class="table-cell"></td>
                    <td id="page903_score" class="table-cell table-big_cell" style="text-align: center"></td>
                    <td id="page903_max_score" class="table-cell table-big_cell" style="text-align: center"></td>
                </tr>
            </script>
        `;
    }

    static refresh(list) {
        list.forEach((element, index) => {
            $("#page903_table").append(Page.template("page903_template"));

            let backgroundColor = "white";
            if(index % 2 === 0) {
                backgroundColor = "#f1f1f1";
            }

            $("#page903_step").attr("id", "page903_step_" + index);
            const stepElement =  $("#page903_step_" + index);
            stepElement.html(index + 1);
            stepElement.css("background-color", backgroundColor);

            $("#page903_start").attr("id", "page903_start_" + index);
            const startElement =  $("#page903_start_" + index);
            startElement.html(element.startDate);
            startElement.css("background-color", backgroundColor);

            $("#page903_finish").attr("id", "page903_finish_" + index);
            const finishElement =  $("#page903_finish_" + index);
            finishElement.html(element.lastUsage);
            finishElement.css("background-color", backgroundColor);

            $("#page903_name").attr("id", "page903_name_" + index);
            const nameElement =  $("#page903_name_" + index);
            nameElement.html(element.name);
            nameElement.css("background-color", backgroundColor);

            $("#page903_score").attr("id", "page903_score_" + index);
            const scoreElement =  $("#page903_score_" + index);
            scoreElement.html(element.score);
            scoreElement.css("background-color", backgroundColor);

            $("#page903_max_score").attr("id", "page903_max_score_" + index);
            const maxScoreElement =  $("#page903_max_score_" + index);
            maxScoreElement.html(element.maxScore);
            maxScoreElement.css("background-color", backgroundColor);
        });
    }
}