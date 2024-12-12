var page10 = null;

function openPage10(actionId, scrollElementId) {
    const pageId = 10;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page10 = new Page10(actionId);

        page10.initialize();
    }

    globalPage.activatePage(pageId);

    return page10;
}

class Page10 extends Page {
    actionId = 0;
    data = [];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId () {
        return 10;
    };

    getActionId() {
        return this.actionId;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }

    initialize() {
        switch (this.action) {
            case 11 :
                Page10.goToAllCourses();
                break;

            default:
                GlobalPage.showWaiter();

                $("#content_" + this.getId()).append(this.getContent(this.getActionId()));

                globalPage.markFavorite(this.getId());

                this.refreshPage();

                break;
        }
    }

    getContent() {
        return `
                <div id="page10_like_box" liked="0" class="fcc-card like-box" onclick="GlobalPage.userInfoLikePage(10)">
                    <img id="page10_like_img" src="./images/like.png" class="like-img" alt=""/>    
                </div>
                <!-- COURSES HEADER & FILTER-->
                <div id="page10_ec_header" class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page10-ec-header">&nbsp;
                        <div class="float-left page10-ec-header-caption">Электронные курсы</div>
                        <div class="float-left">
                            <div id="page10_filter_0" filter="0" class="float-left page10-ec-filter page10-ec-filter-selected" onclick="page10.applyCoursesFilter(this)">Все</div>
                            <div id="page10_filter_1" filter="1" class="float-left page10-ec-filter" onclick="page10.applyCoursesFilter(this)">Активные</div>
                            <div id="page10_filter_2" filter="2" class="float-left page10-ec-filter" onclick="page10.applyCoursesFilter(this)">Завершенные</div>
                        </div>
                    </div>
                </div>
                <!-- COURSES -->
                <div id="page10_courses_box"></div>
                
                <!-- EDU PLANS HEADER & FILTER-->
                <div id="page10_ep_header" class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page10-ec-header">&nbsp;
                        <div class="float-left page10-ec-header-caption">Учебные планы</div>
                        <div class="float-left">
                            <div id="page10_filter_3" filter="0" class="float-left page10-ep-filter page10-ep-filter-selected" onclick="page10.applyEduPlanFilter(this)">Все</div>
                            <div id="page10_filter_4" filter="1" class="float-left page10-ep-filter" onclick="page10.applyEduPlanFilter(this)">Активные</div>
                            <div id="page10_filter_5" filter="2" class="float-left page10-ep-filter" onclick="page10.applyEduPlanFilter(this)">Завершенные</div>
                        </div>
                    </div>
                </div>
                <!-- EDU PLANS -->
                <div id="page10_edu_plans_box"></div>
                
                <!-- TESTS HEADER & FILTER-->
                <div id="page10_test_header" class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page10-ec-header">&nbsp;
                        <div class="float-left page10-ec-header-caption">Тесты</div>
                        <div class="float-left">
                            <div id="page10_filter_6" filter="0" class="float-left page10-test-filter page10-test-filter-selected" onclick="page10.applyTestFilter(this)">Все</div>
                            <div id="page10_filter_7" filter="1" class="float-left page10-test-filter" onclick="page10.applyTestFilter(this)">Активные</div>
                            <div id="page10_filter_8" filter="2" class="float-left page10-test-filter" onclick="page10.applyTestFilter(this)">Завершенные</div>
                        </div>
                    </div>
                </div>
                <!-- TESTS -->
                <div id="page10_test_box"></div>
                
                <!-- SINGLE COURSE TEMPLATE-->
                <script type="text/html" id="page10_ec_card_template">
                    <div id="page10_card_parent" type="" class="float-left fcc-card page10-ec-card" onclick="Page10.goToObject(this)">
                        <div>
                            <table>
                                <tr>
                                    <td>
                                        <div id="page10_card_img" class="page10-ec-card-img">&nbsp;</div>
                                    </td>
                                    <td style="width: 500px">
                                        <div id="page10_card_name" class="page10-ec-card-name"></div>
                                    </td>
                                    <td style="width: 100px; text-align: center;">           
                                        <div id="page10_card_state" class="page10-ec-card-state"></div>
                                    </td>
                                    <td>
                                        <div id="page10_card_score" class="page10-ec-card-score"></div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div id="page10_card_date" class="page10-ec-card-date"></div>
                    </div>
                </script>
                <!-- SINGLE EDUCATION PLAN TEMPLATE-->
                <script type="text/html" id="page10_ep_card_template">
                    <div id="page10_card_parent" type="" class="float-left fcc-card page10-ep-card" onclick="Page10.goToObject(this)">
                        <div>
                            <table>
                                <tr>
                                    <td>
                                        <div id="page10_card_img" class="page10-ec-card-img">&nbsp;</div>
                                    </td>
                                    <td style="width: 444px">
                                        <div id="page10_card_name" class="page10-ec-card-name"></div>
                                    </td>
                                    <td style="width: 100px; text-align: center;">           
                                        <div id="page10_card_state" class="float-left page10-ec-card-state"></div>
                                    </td>
                                    <td>
                                        <div id="page10_card_score" class="page10-ec-card-score"></div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div id="page10_card_date" class="page10-ec-card-date"></div>
                    </div>
                </script>
                <!-- SINGLE TEST TEMPLATE-->
                <script type="text/html" id="page10_test_card_template">
                    <div id="page10_card_parent" type="" class="float-left fcc-card page10-test-card" onclick="Page10.goToObject(this)">
                        <div>
                            <table>
                                <tr>
                                    <td>
                                        <div id="page10_card_img" class="page10-ec-card-img">&nbsp;</div>
                                    </td>
                                    <td style="width: 500px">
                                        <div id="page10_card_name" class="page10-ec-card-name"></div>
                                    </td>
                                    <td style="width: 100px; text-align: center;">           
                                        <div id="page10_card_state" class="page10-ec-card-state"></div>
                                    </td>
                                    <td>
                                        <div id="page10_card_score" class="page10-ec-card-score"></div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div>
                        <div id="page10_card_label1" class="page10-test-card-date" style="padding-left: 59%;">Назначен:</div>
                        <div id="page10_card_start_date" class="float-left page10-test-card-date" style="padding-left: 67%; margin-top: -13px;"></div>
                        <div id="page10_card_label2" class="page10-test-card-date" style="padding-left: 79%; margin-top: -13px;">Пройти до:</div>
                        <div id="page10_card_finish_date" class="float-left page10-test-card-date" style="padding-left: 87%; margin-top: -13px;"></div>
                        </div>
                    </div>
                </script>
    `;
    }

    applyCoursesFilter(element) {
        const filterElement = $("#" + element.id);

        if(!filterElement.hasClass("page10-ec-filter-selected")) {
            $(".page10-ec-filter").removeClass("page10-ec-filter-selected");

            filterElement.addClass("page10-ec-filter-selected");

            const activeElements = $(".page10-ec-card[type='0']");
            const finishedElements = $(".page10-ec-card[type='1']");

            switch (parseInt(filterElement.attr("filter"))) {
                case 0 :
                    $(".page10-ec-card").css("display", "block");
                    break;

                case 1 :
                    activeElements.css("display", "block");
                    finishedElements.css("display", "none");

                    break;

                case 2 :
                    activeElements.css("display", "none");
                    finishedElements.css("display", "block");

                    break;
            }
        }
    }

    applyEduPlanFilter(element) {
        const filterElement = $("#" + element.id);

        if(!filterElement.hasClass("page10-ep-filter-selected")) {
            $(".page10-ep-filter").removeClass("page10-ep-filter-selected");

            filterElement.addClass("page10-ep-filter-selected");

            const activeElements = $(".page10-ep-card[type='2']");
            const finishedElements = $(".page10-ep-card[type='3']");

            switch (parseInt(filterElement.attr("filter"))) {
                case 0 :
                    $(".page10-ep-card").css("display", "block");
                    break;

                case 1 :
                    activeElements.css("display", "block");
                    finishedElements.css("display", "none");

                    break;

                case 2 :
                    activeElements.css("display", "none");
                    finishedElements.css("display", "block");

                    break;
            }
        }
    }

    applyTestFilter(element) {
        const filterElement = $("#" + element.id);

        if(!filterElement.hasClass("page10-test-filter-selected")) {
            $(".page10-test-filter").removeClass("page10-test-filter-selected");

            filterElement.addClass("page10-test-filter-selected");

            const activeElements = $(".page10-test-card[type='4']");
            const finishedElements = $(".page10-test-card[type='5']");

            switch (parseInt(filterElement.attr("filter"))) {
                case 0 :
                    $(".page10-test-card").css("display", "block");
                    break;

                case 1 :
                    activeElements.css("display", "block");
                    finishedElements.css("display", "none");

                    break;

                case 2 :
                    activeElements.css("display", "none");
                    finishedElements.css("display", "block");

                    break;
            }
        }
    }

    refreshPage() {
        let userIdParameter = "";
        const pickedId = GlobalPage.getPickedUserId();

        if(pickedId !== null) {
            userIdParameter = "&user_id=" + pickedId;
        }

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7434498905755289557" + userIdParameter,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    page10.setData(data);

                    page10.refreshCoursesBox();
                    page10.refreshEduPlansBox();
                    page10.refreshTestBox();

                    GlobalPage.hideWaiter();
                } else {
                    console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                    GlobalPage.showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                        "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                GlobalPage.showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
            }
        });
    }

    refreshCoursesBox() {
        if(this.getData().courses.length > 0) {
            this.getData().courses.forEach((element, index) => {
                $("#page10_courses_box").append(Page.template("page10_ec_card_template"));

                const parentElement = $("#page10_card_parent");
                parentElement.attr("id", "page10_card1_parent_" + index);
                parentElement.attr("object_id", element.id);

                $("#page10_card_img").attr("id", "page10_card1_img_" + index);

                if(element.resourceId === "" || parseInt(element.resourceId) === 6966190884178253432) {
                    $("#page10_card1_img_" + index).css("background", "url(./images/course.png) center center / cover no-repeat");
                } else {
                    $("#page10_card1_img_" + index).css("background", "url(https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/download_file.html?file_id=" + element.resourceId + ") center center / cover no-repeat");
                }

                $("#page10_card_name").attr("id", "page10_card1_name_" + index);

                const nameElement = $("#page10_card1_name_" + index);
                nameElement.html(element.name);

                $("#page10_card_state").attr("id", "page10_card1_state_" + index);
                const stateElement = $("#page10_card1_state_" + index);
                stateElement.html(element.state);

                $("#page10_card_score").attr("id", "page10_card1_score_" + index);
                const scoreElement = $("#page10_card1_score_" + index);
                const chart = new ApexCharts(scoreElement.get(0), Page10.getChartOption(element.score));
                chart.render();

                $("#page10_card_date").attr("id", "page10_card1_date_" + index);
                const dateElement = $("#page10_card1_date_" + index);
                dateElement.html(element.date);

                if(parseInt(element.stateId) === 4) {
                    parentElement.attr("type", "1");

                    parentElement.css("background-color", "#7faaaa");
                    nameElement.css("color", "papayawhip");
                    dateElement.css("color", "papayawhip");
                    stateElement.css("color", "gold");
                    //scoreElement.css("color", "gold");
                } else {
                    parentElement.attr("type", "0");

                    parentElement.css("background-image", "linear-gradient(290deg, #fce3b7, #f5fffa, #FCE3B8) !important");
                    parentElement.css("background-color", Page.activeCardBackgroundColor);
                }
            });
        }
    }

    refreshEduPlansBox() {
        if(this.getData().educationPlans.length > 0) {
            this.getData().educationPlans.forEach((element, index) => {
                $("#page10_edu_plans_box").append(Page.template("page10_ep_card_template"));

                const parentElement = $("#page10_card_parent");
                parentElement.attr("id", "page10_card2_parent_" + index);
                parentElement.attr("object_id", element.id);

                $("#page10_card_img").attr("id", "page10_card2_img_" + index);

                $("#page10_card2_img_" + index).css("background", "url(./images/edu_plan.png) center center / cover no-repeat");
                $("#page10_card_name").attr("id", "page10_card2_name_" + index);

                const nameElement = $("#page10_card2_name_" + index);
                nameElement.html(element.name);

                $("#page10_card_state").attr("id", "page10_card2_state_" + index);
                const stateElement = $("#page10_card2_state_" + index);
                stateElement.html(element.state);

                $("#page10_card_score").attr("id", "page10_card2_score_" + index);

                $("#page10_card_date").attr("id", "page10_card2_date_" + index);
                const dateElement = $("#page10_card2_date_" + index);
                dateElement.html(element.start);

                if(parseInt(element.stateId) === 2 || parseInt(element.stateId) === 4) {
                    parentElement.attr("type", "3");

                    parentElement.css("background-color", "#7faaaa");
                    nameElement.css("color", "papayawhip");
                    dateElement.css("color", "papayawhip");
                    stateElement.css("color", "gold");
                } else {
                    parentElement.attr("type", "2");

                    parentElement.css("background-image", "linear-gradient(290deg, #fce3b7, #f5fffa, #FCE3B8) !important");
                    parentElement.css("background-color", Page.activeCardBackgroundColor);
                }
            });
        }
    }

    refreshTestBox() {
        if(this.getData().tests.length > 0) {
            this.getData().tests.forEach((element, index) => {
                $("#page10_test_box").append(Page.template("page10_test_card_template"));

                const parentElement = $("#page10_card_parent");
                parentElement.attr("id", "page10_card3_parent_" + index);
                parentElement.attr("object_id", element.id);

                $("#page10_card_img").attr("id", "page10_card3_img_" + index);
                $("#page10_card3_img_" + index).css("background", "url(./images/test.png) center center / cover no-repeat");

                $("#page10_card_name").attr("id", "page10_card3_name_" + index);
                const nameElement = $("#page10_card3_name_" + index);
                nameElement.html(element.name);

                $("#page10_card_state").attr("id", "page10_card3_state_" + index);
                const stateElement = $("#page10_card3_state_" + index);
                stateElement.html(element.state);

                $("#page10_card_score").attr("id", "page10_card3_score_" + index);
                const scoreElement = $("#page10_card3_score_" + index);

                let chartValue = 0;
                if(element.maxScore !== null && element.maxScore !== 0) {
                    chartValue = Math.round(element.score * 100 / element.maxScore);
                }

                const chart = new ApexCharts(scoreElement.get(0), Page10.getChartOption(chartValue));
                chart.render();

                $("#page10_card_start_date").attr("id", "page10_card3_start_date_" + index);
                const startDateElement = $("#page10_card3_start_date_" + index);
                startDateElement.html(element.start);

                $("#page10_card_finish_date").attr("id", "page10_card3_finish_date_" + index);
                const finishDateElement = $("#page10_card3_finish_date_" + index);
                finishDateElement.html(element.finish);

                if(element.type === 0 && moment().isAfter(element.checkDate)) {
                    finishDateElement.css("color", "#ed143d");
                }

                $("#page10_card_label1").attr("id", "page10_card_label1_" + index);
                const label1Element = $("#page10_card_label1_" + index);

                $("#page10_card_label2").attr("id", "page10_card_label2_" + index);
                const label2Element = $("#page10_card_label2_" + index);

                if(parseInt(element.stateId) === 2 || parseInt(element.stateId) === 4) {
                    parentElement.attr("type", "5");

                    parentElement.css("background-color", "#7faaaa");
                    nameElement.css("color", "papayawhip");
                    startDateElement.css("color", "papayawhip");
                    finishDateElement.css("color", "papayawhip");
                    label1Element.css("color", "papayawhip");
                    label2Element.css("color", "papayawhip");
                    stateElement.css("color", "gold");
                } else {
                    parentElement.attr("type", "4");

                    parentElement.css("background-image", "linear-gradient(290deg, #fce3b7, #f5fffa, #FCE3B8) !important");
                    parentElement.css("background-color", Page.activeCardBackgroundColor);
                }
            });
        }
    }

    <!-- STATIC METHODS -->
    static getChartOption(value) {
        return {
            series: [value],
            chart: {
                width: 150,
                height: 80,
                type: 'radialBar',
                offsetX: -30,
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -110,
                    endAngle: 110,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: 2,
                            fontSize: '14px',
                            fontWeight: 600,
                            formatter: function (val) {
                                return val
                            }
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                colors: ["#ff0080"],
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91],
                    gradientToColors: ["#7928ca"]
                },
            }
        };
    }

    static goToObject(element) {
        const selectedElement = $("#" + element.id);

        if(parseInt(selectedElement.attr("type")) === 0 || parseInt(selectedElement.attr("type")) === 1) {
            window
                .open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=course&doc_id=6674846170380136045&object_id=" + selectedElement.attr("object_id"), '_blank')
                .focus();
        } else if(parseInt(selectedElement.attr("type")) === 2 || parseInt(selectedElement.attr("type")) === 3) {
            window
                .open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=education_plan_cabinet&object_id=" + selectedElement.attr("object_id"), '_blank')
                .focus();
        } else if(parseInt(selectedElement.attr("type")) === 4 || parseInt(selectedElement.attr("type")) === 5) {
            window
                .open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/test_learning_proc?object_id=" + selectedElement.attr("object_id"), '_blank')
                .focus();
        }
    }

    static moveTo(elementId) {
        globalPage.activatePage(10);

        $([document.documentElement, document.body]).animate({
            scrollTop: $("#" + elementId).offset().top - 50
        }, 1000);
    }

    static goToAllCourses() {
        window
            .open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/_wt/courses_fck?doc_id=6674846170380136045", '_blank')
            .focus();
    }
}