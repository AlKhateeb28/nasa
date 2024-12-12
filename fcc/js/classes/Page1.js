var page1 = null;

function openPage1(actionId) {
    const pageId = 1;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page1 = new Page1(actionId);

        page1.initialize();
    }

    globalPage.activatePage(pageId);

    return page1;
}

class Page1 extends Page {
    actionId = 0;
    refreshCounter = 0;

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId () {
        return 1;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        $("#content_" + this.getId()).append(this.getContent());

        globalPage.markFavorite(1);

        this.refreshPage();
    }

    getContent() {
        return `            
                <div id="page1_like_box" liked="0" class="fcc-card like-box" onclick="GlobalPage.userInfoLikePage(1)">
                    <img id="page1_like_img" src="./images/like.png" class="like-img"/>    
                </div>
                <!-- COLLABORATOR INFO -->
                <div class="float-left fcc-card" style="width: 40%; height: 200px;">
                    <div class="float-left" style="margin-left: 10px; margin-top: 23px;">
                        <img src="./images/office_user.png" style="width: 150px; height: 150px;"/>
                    </div>
                    <div style="padding-left: 170px;">
                        <div id="page1_fio" style="font-size: x-large; padding-top: 15px; font-weight: bold;"></div>
                        <div id="page1_position" style="font-size: large; padding-top: 15px;"></div>
                        <div id="page1_orgs" style="font-weight: bold; padding-top: 15px;"></div>
                        <div id="page1_region" style="font-size: large; padding-top: 15px;"></div>
                    </div>
                </div>
                <!-- MY PREFERENCES -->
                <div class="float-left fcc-card" style="width: 57%; height: 200px;">
                    <div class="pg-chart-header">Мои предпочтения</div>
                    <div style="margin-left: 40px;">
                        <div id="pref1" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Основы бережливого производства (ОБП)</div>
                        <div id="pref2" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Картирование процессов</div>
                        <div id="pref3" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Решение проблем (РП)</div>
                        <div id="pref4" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">5С</div>
                        <div id="pref5" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Стандартизированная работа (СР)</div>
                        <div id="pref6" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Быстрая переналадка (SMED)</div>
                        <div id="pref7" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Реализация проекта по улучшению (РПУ)</div>
                        <div id="pref8" picked="0" class="float-left preferences" onclick="Page1.selectPreference(this)">Тренинги руководителей</div>
                    </div>
                </div>
                <!-- TRAINING STATISTIC HEADER -->
                <div class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page1-header">
                        Статистика по обучению
                    </div>
                </div>
                <!-- TRAINING STATISTIC BOXES-->   
                <div id="page1_training_statistic"></div>
                
                <!-- ACTIVE TRAININGS HEADER-->
                <div class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page1-header">
                        Активное обучение
                    </div>
                </div>
                <!-- TESTS -->
                <div id="page1_at_box0" class="float-left" style="width: 100%;">               
                    <div id="page1_at_box0_1" class="float-left fcc-card edu-plan-box edu-plan-box faked-box0" style="display: none;" onclick="Page1.showTest(this)"></div>        
                    <div id="page1_at_box0_2" class="float-left fcc-card edu-plan-box edu-plan-box faked-box0" style="display: none;" onclick="Page1.showTest(this)"></div>
                    <div id="page1_at_box0_3" class="float-left fcc-card edu-plan-box edu-plan-box faked-box0" style="display: none;" onclick="Page1.showTest(this)"></div>
                    <div id="page1_at_box0_4" class="float-left fcc-card edu-plan-box faked-box0" style="height: 85px; margin-top: 9px; padding-right: 7px; display: none;" onclick="Page1.showTest(null)">
                        <div id="page1_at_box0_caption" class="float-left small-bullet"></div>           
                        <div class="float-left" style="font-size: x-large; font-weight: bold; margin-left: 7px; padding-left: 10px; padding-top: 20px;">Смотреть все</div>
                        <div id="page1_at_box0_4_count" class="float-left" style="font-size: xxx-large; margin-left: 3px; color: #00bfff; padding-left: 20px; padding-top: 20px;"></div>
                    </div>
                </div>    
                <!-- ACTIVE TRAININGS -->
                <div id="page1_at_box1" class="float-left" style="width: 100%;">               
                    <div id="page1_at_box1_1" class="float-left fcc-card edu-plan-box edu-plan-box faked-box1" style="display: none;" onclick="Page1.showEduPlan(this)"></div>        
                    <div id="page1_at_box1_2" class="float-left fcc-card edu-plan-box edu-plan-box faked-box1" style="display: none;" onclick="Page1.showEduPlan(this)"></div>
                    <div id="page1_at_box1_3" class="float-left fcc-card edu-plan-box edu-plan-box faked-box1" style="display: none;" onclick="Page1.showEduPlan(this)"></div>
                    <div id="page1_at_box1_4" class="float-left fcc-card edu-plan-box faked-box1" style="height: 85px; margin-top: 9px; padding-right: 7px; display: none;" onclick="Page1.showEduPlan(null)">
                        <div id="page1_at_box1_caption" class="float-left small-bullet"></div>           
                        <div class="float-left" style="font-size: x-large; font-weight: bold; margin-left: 7px; padding-left: 10px; padding-top: 20px;">Смотреть все</div>
                        <div id="page1_at_box1_4_count" class="float-left" style="font-size: xxx-large; margin-left: 3px; color: #00bfff; padding-left: 20px; padding-top: 20px;"></div>
                    </div>
                </div>    
                <!-- EL COURSES -->
                <div id="page1_at_box2" class="float-left" style="width: 100%;">               
                    <div id="page1_at_box2_1" class="float-left fcc-card edu-plan-box edu-plan-box faked-box2" style="display: none;" onclick="Page1.showElCourse(this)"></div>        
                    <div id="page1_at_box2_2" class="float-left fcc-card edu-plan-box edu-plan-box faked-box2" style="display: none;" onclick="Page1.showElCourse(this)"></div>
                    <div id="page1_at_box2_3" class="float-left fcc-card edu-plan-box edu-plan-box faked-box2" style="display: none;" onclick="Page1.showElCourse(this)"></div>
                    <div id="page1_at_box2_4" class="float-left fcc-card edu-plan-box faked-box2" style="height: 85px; margin-top: 9px; padding-right: 7px; display: none;" onclick="Page1.showElCourse(null)">
                        <div id="page1_at_box2_caption" class="float-left small-bullet"></div>           
                        <div class="float-left" style="font-size: x-large; font-weight: bold; margin-left: 7px; padding-left: 10px; padding-top: 20px;">Смотреть все</div>
                        <div id="page1_at_box2_4_count" class="float-left" style="font-size: xxx-large; margin-left: 3px; color: #00bfff; padding-left: 20px; padding-top: 20px;"></div>
                    </div>
                </div> 
                <!-- RECOMMENDATION TRAININGS HEADER-->
                <div class="float-left fcc-card page1-group" style="background: url(./images/banner02.png) no-repeat 1% / 101%;">
                    <div class="page1-header">
                        Рекомендованное обучение
                    </div>
                </div>
                <!-- RECOMMENDATION TRAININGS -->
                <div id="page1_rt_box3" class="float-left" style="width: 100%;">               
                    <div id="page1_rt_box3_1" class="float-left fcc-card edu-plan-box edu-plan-box faked-box3" style="width: 99%" onclick="showEduPlan(this)"></div>                
                </div>
                <!-- RECOMMENDATION EL COURSES -->
                <div id="page1_rec_box4" class="float-left" style="width: 100%;">               
                    <div id="page1_rec_box4_1" class="float-left fcc-card edu-plan-box edu-plan-box faked-box4" style="width: 32.2%" onclick="Page1.showElCourse(this)"></div>                
                    <div id="page1_rec_box4_2" class="float-left fcc-card edu-plan-box edu-plan-box faked-box4" style="width: 32.2%" onclick="Page1.showElCourse(this)"></div>
                    <div id="page1_rec_box4_3" class="float-left fcc-card edu-plan-box edu-plan-box faked-box4" style="width: 32.3%" onclick="Page1.showElCourse(this)"></div>
                </div>       
                
               
                <!-- TEMPLATES -->
                <!-- TRAINING STATISTIC SMALL BOX TEMPLATE -->
                <script type="text/html" id="page1_box_small_template">
                    <div id="page1_chart_parent" class="float-left fcc-card" style="cursor: pointer;" action="" onclick="Page1.showStatistic(this)">
                        <div class="small-chart">               
                            <div id="page1_header" class="float-left pg-chart-header"></div><br/>                             
                            <div id="page1_value" class="pg-chart-value">0</div><br/>
                            <div id="page1_chart" style="margin-left: 30px;"></div>
                        </div>
                    </div>
                </script>   
                <!-- ACTIVE TRAINING & EL COURSES SMALL BOX TEMPLATE -->
                <script type="text/html" id="page1_box_at_template">
                    <div>
                        <div id="temp_caption" class="float-left small-bullet"></div>        
                        <div class="float-left" style="margin-left: 10px; width: 65%; padding-top: 10px;">               
                            <div id="temp_name" style="text-align: center; font-weight: 600;"></div>
                            <div id="temp_start_box">
                                <div class="float-left" style="width: 50px;">Старт:</div>
                                <div id="temp_start" class="float-left edu-plan-date"></div>
                            </div>
                            <br/>
                            <div id="temp_finish_box">
                                <div class="float-left" style="width: 50px;">Финиш:</div>
                                <div id="temp_finish" class="float-left edu-plan-date"></div>
                            </div>               
                        </div>
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
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7431469925384870412" + userIdParameter,
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    if(data.isAdmin) {
                        $("#special_users").css("display", "block");
                    }

                    Page1.refreshUserInfoBlock(data);

                    Page1.refreshChartBlock(data.learnings, "Пройдено эл. курсов", "#ff8c00", 1, "20px");
                    Page1.refreshChartBlock(data.eventResults, "Пройдено (очных) тренингов", "#ff0080", 2, "-18px");
                    Page1.refreshChartBlock(data.statements, "Изучено материалов", "#4a4fd4", 3, "20px");
                    Page1.refreshChartBlock(data.certificates, "Получено сертификатов", "#7cfc00", 4, "-18px", "#2f4f4f");

                    Page1.refreshATTests(data.tests);
                    Page1.refreshATEducationPlans(data.educationPlans);
                    Page1.refreshATElCourses(data.activeLearnings);

                    Page1.refreshRTEducationPlan();
                    Page1.refreshRTElCourses();

                    GlobalPage.hideWaiter();
                } else {
                    GlobalPage.showNotification("<div>Возможно произошла ошибка.<br/>Пожалуйста, проверте логи веб шаблонов WebSoft HCM.<br/>IDs: 7428923418845716087</div>" +
                        "<div style='font-size: x-small; margin-top: 10px; color: silver;'>Описание: " + data.substring(1) + "</div>");
                }
            },
            error: function(error) {
                console.log("P1: State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                /*script language="javascript">
                    document.location.href = "/default.html" + window.location.hash;
                </script>*/

                GlobalPage.showNotification("Пожалуйста, авторизируйтесь на сайте <a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/' target='_blank'>сдо.производительность.рф</a>");
            }
        });
    }
    // STATIC METHODS
    static showStatistic(element) {
        const selectedElement = $("#" + element.id);

        const action = parseInt(selectedElement.attr("action"));

        switch (action) {
            case 1 :
                globalPage.addToHistory(element.id);
                openPage903(action);
                break;

            case 2 :
                globalPage.addToHistory(element.id);
                openPage904(action);
                break;

            case 3 :
                globalPage.addToHistory(element.id);
                openPage905(action);
                break;

            case 4 :
                globalPage.addToHistory(element.id);
                openPage906(action);
                break;
        }
    }

    static selectPreference(element) {
        const preferenceElement = $("#" + element.id);

        if(parseInt(preferenceElement.attr("picked")) === 0) {
            preferenceElement.attr("picked", 1);
            preferenceElement.addClass("preferences-picked");
        } else {
            preferenceElement.attr("picked", 0);
            preferenceElement.removeClass("preferences-picked");
        }
    }

    static showTest(element) {
        if(element === null) {
            openPage900(null)
        } else {
            Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/test_learning_proc?object_id=" + $("#" + element.id).attr("test_id"));
        }
    }

    static showEduPlan(element) {
        if(element === null) {
            openPage901(null);
        } else {
            Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=education_plan_cabinet&object_id=" + $("#" + element.id).attr("edu_plan_id"));
        }
    }

    static showElCourse(element) {
        if(element === null) {
            openPage902(null);
        } else {
            Page.openLink("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/learning_proc?object_id=" + $("#" + element.id).attr("el_course_id"));
        }
    }

    static getChartOption(data, color, foreColor, width, height) {
        if(foreColor === undefined) {
            foreColor = "#f5fffa";
        }

        if(width === undefined) {
            width = 300;
        }
        if(height === undefined) {
            height = 150;
        }

        let optionCategories = [];
        let optionData = [];

        data.forEach((element, index) => {
            optionCategories.push(element.year);
            optionData.push(element.count);
        });

        return {
            series: [{
                color: color,
                data: optionData,
            }],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 99, 100],
                    gradientToColors: ["#f5fffa"]
                }
            },
            chart: {
                animations: {enabled: false},
                width: width,
                height: height,
                type: "area",
                toolbar: {show: false},
                zoom: {enabled: false}
            },
            dataLabels: {
                enabled: true,
                fontWeight: "normal",
                formatter: function (val) {
                    return val === 0 ? "" : val;
                },
                style: {
                    fontSize: "10px",
                    fontWeight: "bold"
                },
                background: {
                    enabled: true,
                    foreColor: foreColor
                }
            },
            grid: {show: false, xaxis: {lines: {show: false}},yaxis: {lines: {show: false}}},
            tooltip: {enabled: false},
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                categories: optionCategories,
                position: "bottom",
                axisBorder: {show: false},
                axisTicks: {show: false},
                tooltip: {enabled: false},
                labels: {
                    show: true,
                    style: {
                        fontSize: "12px",
                        fontFamily: "'Noto Sans', sans-serif"/*,
                    colors: getFccXAxisColors(getCurrentYear())*/
                    }
                }
            },
            legend: {show: false},
            yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}}
        };
    }

    static refreshUserInfoBlock(data) {
        $("#current_user_id").html("<b>ID:</b> " + data.id);

        globalPage.setCurrentUserId(data.id);

        $("#info_box_user").html(data.fullname);

        $("#page1_fio").html(data.fullname);
        $("#page1_orgs").html(data.orgName);
        $("#page1_position").html(data.positionName);
        $("#page1_region").html(data.regionName);
    }

    static refreshChartBlock(list, text, color, index, cssValue, foreColor) {
        $("#page1_training_statistic").append(Page.template("page1_box_small_template"));

        $("#page1_chart_parent").attr("id", "page1_chart_parent_" + index);

        const parentElement = $("#page1_chart_parent_" + index);
        parentElement.attr("action", index);
        if(index === 1) {
            parentElement.css("margin-left", "30px");
        }
        $("#page1_header").attr("id", "page1_header_" + index);
        $("#page1_header_" + index).html(text);
        $("#page1_value").attr("id", "page1_value_" + index);
        $("#page1_chart").attr("id", "page1_chart_" + index);

        let data = [];

        if(list.length === 1) {
            const element = {};
            element.year = parseInt(list[0].year) - 1;
            element.count = 0;

            data.push(element);
        }

        let fullCount = 0;

        list.forEach((item, index) => {
            let element = {};
            element.year = item.year;
            element.count = item.count;

            fullCount += item.count;

            data.push(element);
        });

        const valueElement = $("#page1_value_" + index);
        valueElement.html(fullCount);
        if(cssValue !== undefined) {
            valueElement.css("margin-top", cssValue)
        }

        const chart = new ApexCharts($("#page1_chart_" + index).get(0), Page1.getChartOption(data, color, foreColor));
        chart.render();
    }

    static refreshATTests(list) {
        list.forEach((element, index) => {
            let parentElement = null;

            if(index === 0) {
                parentElement = $("#page1_at_box0_1");

                $(".faked-box0").css("width", "99%");
            } else if(index === 1) {
                parentElement = $("#page1_at_box0_2");

                $(".faked-box0").css("width", "48.8%");
            } else if(index === 2) {
                parentElement = $("#page1_at_box0_3");

                $(".faked-box0").css("width", "32%");
            } else if(index === 3) {
                parentElement = null;

                $("#page1_at_box0_4_count").html(element.name);
                $("#page1_at_box0_4").css("display", "block").css("background-color", Page.activeCardBackgroundColor);
                $("#page1_at_box0_caption").html("Тест<BR/><BR/>");

                $(".faked-box0").css("width", "24%");
            }

            if(parentElement !== null) {
                parentElement.css("display", "block");
                parentElement.css("background-color", Page.activeCardBackgroundColor);
                parentElement.attr("test_id", element.id);

                // FROM TEMPLATE
                parentElement.append(Page.template("page1_box_at_template"));

                $("#temp_caption").attr("id", "temp_caption_at_test_" + index);
                $("#temp_caption_at_test_" + index).html("Тест<BR/><BR/>");

                $("#temp_name").attr("id", "temp_name_at_test_" + index);
                let name = element.name;
                if(name.length > 60) {
                    name = name.substring(0, 60) + " ..."
                }
                $("#temp_name_at_test_" + index).html(name);

                $("#temp_start_box").attr("id", "temp_start_box_at_test_" + index);

                $("#temp_start").attr("id", "temp_start_at_test_" + index);
                $("#temp_start_at_test_" + index).html(element.start);

                $("#temp_finish_box").attr("id", "temp_finish_box_0_" + index);

                $("#temp_finish").attr("id", "temp_finish_at_test_" + index);
                $("#temp_finish_at_test_" + index).html(element.finish);
            }
        });
    }

    static refreshATEducationPlans(list) {
        list.forEach((element, index) => {
            let parentElement = null;

            if(index === 0) {
                parentElement = $("#page1_at_box1_1");

                $(".faked-box1").css("width", "99%");
            } else if(index === 1) {
                parentElement = $("#page1_at_box1_2");

                $(".faked-box1").css("width", "48.8%");
            } else if(index === 2) {
                parentElement = $("#page1_at_box1_3");

                $(".faked-box1").css("width", "32%");
            } else if(index === 3) {
                parentElement = null;

                $("#page1_at_box1_4_count").html(element.name);
                $("#page1_at_box1_4").css("display", "block").css("background-color", Page.activeCardBackgroundColor);
                $("#page1_at_box1_caption").html("Планы<BR/>обучения");

                $(".faked-box1").css("width", "24%");
            }

            if(parentElement !== null) {
                parentElement.css("display", "block");
                parentElement.css("background-color", Page.activeCardBackgroundColor);
                parentElement.attr("edu_plan_id", element.id);

                // FROM TEMPLATE
                parentElement.append(Page.template("page1_box_at_template"));

                $("#temp_caption").attr("id", "temp_caption_at_ep_" + index);
                $("#temp_caption_at_ep_" + index).html("План<BR/>обучения");

                $("#temp_name").attr("id", "temp_name_at_ep_" + index);
                $("#temp_name_at_ep_" + index).html(element.name);

                $("#temp_start_box").attr("id", "temp_start_box_at_ep_" + index);

                $("#temp_start").attr("id", "temp_start_at_ep_" + index);
                $("#temp_start_at_ep_" + index).html(element.start);

                $("#temp_finish_box").attr("id", "temp_finish_box_1_" + index);

                $("#temp_finish").attr("id", "temp_finish_at_ep_" + index);
                $("#temp_finish_at_ep_" + index).html(element.finish);
            }
        });
    }

    static refreshATElCourses(list) {
        list.forEach((element, index) => {
            let parentElement = null;

            if(index === 0) {
                parentElement = $("#page1_at_box2_1");

                $(".faked-box2").css("width", "99%");
            } else if(index === 1) {
                parentElement = $("#page1_at_box2_2");

                $(".faked-box2").css("width", "48%");
            } else if(index === 2) {
                parentElement = $("#page1_at_box2_3");

                $(".faked-box2").css("width", "32%");
            } else if(index === 3) {
                parentElement = null;

                $("#page1_at_box2_4_count").html(element.name);
                $("#page1_at_box2_4").css("display", "block").css("background-color", Page.activeCardBackgroundColor);
                $("#page1_at_box2_caption").html("Электронные<BR/>курсы");

                $(".faked-box2").css("width", "24%");
            }

            if(parentElement !== null) {
                parentElement.css("display", "block");
                parentElement.css("background-color", Page.activeCardBackgroundColor);
                parentElement.attr("el_course_id", element.id);

                // FROM TEMPLATE
                parentElement.append(Page1.template("page1_box_at_template"));

                $("#temp_caption").attr("id", "temp_caption_at_ec_" + index);
                $("#temp_caption_at_ec_" + index).html("Электронный<BR/>курс");

                $("#temp_name").attr("id", "temp_name_at_ec_" + index);
                $("#temp_name_at_ec_" + index).html(element.name);

                $("#temp_start_box").attr("id", "temp_start_box_at_ec_1");

                $("#temp_start").attr("id", "temp_start_at_ec_" + index);
                $("#temp_start_at_ec_" + index).html(element.start);

                $("#temp_finish_box").attr("id", "temp_finish_box_2_" + index);
                $("#temp_finish_box_2_" + index).css("display", "none");

                $("#temp_finish").attr("id", "temp_finish_at_ep_" + index);
                $("#temp_finish_at_ep_" + index).html(element.finish);
            }
        });
    }

    static refreshRTEducationPlan() {
        $(".faked-box3").css("width", "98%");

        let parentElement = $("#page1_rt_box3_1");

        parentElement.css("background-color", "#cde2f5");
        parentElement.attr("edu_plan_id", "7333119320042215512");

        // FROM TEMPLATE
        parentElement.append(Page.template("page1_box_at_template"));

        $("#temp_caption").attr("id", "temp_caption_rt_ep_1");
        $("#temp_caption_rt_ep_1").html("План<BR/>обучения");

        $("#temp_name").attr("id", "temp_name_rt_ep_1");
        $("#temp_name_rt_ep_1").html("Модульная программа подготовки_Приморский край");

        $("#temp_start_box").attr("id", "temp_start_box_rt_ep_1");
        $("#temp_start_box_rt_ep_1").css("display", "none");

        $("#temp_finish_box").attr("id", "temp_finish_box_rt_ep_1");
        $("#temp_finish_box_rt_ep_1").css("display", "none");
    }

    static refreshRTElCourses() {
        for(let i = 1; i <= 3; i++) {
            const elCourseData = Page1.getElCourse(i);

            let parentElement = $("#page1_rec_box4_" + i);

            parentElement.css("background-color", "#e1c3ca");
            parentElement.attr("el_course_id", elCourseData.id);

            // FROM TEMPLATE
            parentElement.append(Page.template("page1_box_at_template"));

            $("#temp_caption").attr("id", "temp_caption_rt_ec_" + i);
            $("#temp_caption_rt_ec_" + i).html("Электронный<BR/>курс");

            $("#temp_name").attr("id", "temp_name_rt_ec_" + i);
            $("#temp_name_rt_ec_" + i).html(elCourseData.name);

            $("#temp_start_box").attr("id", "temp_start_box_rt_ec_" + i);
            $("#temp_start_box_rt_ec_" + i).css("display", "none");

            $("#temp_finish_box").attr("id", "temp_finish_box_rt_ec_" + i);
            $("#temp_finish_box_rt_ec_" + i).css("display", "none");
        }
    }

    static getElCourse(index) {
        const result = {};

        if(index === 1) {
            result.id = "6873418491420152819";
            result.name = "Работа с предложениями по улучшениям";
        } else if(index === 2) {
            result.id =  "6906175698591618817";
            result.name = "Введение в управление изменениями";
        } else {
            result.id = "6984284919967737226";
            result.name = "Эргономика рабочих мест";
        }

        return result;
    }
}