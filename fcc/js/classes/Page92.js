var page92 = null;

function openPage92(actionId) {
    const pageId = 92;

    if(!globalPage.getForcingReload() && parseInt(globalPage.getCurrentPageId()) === pageId) {
        return;
    }

    globalPage.setCurrentPageId(actionId);

    if(!globalPage.isPageVisited(pageId)) {
        globalPage.initializePage(pageId);

        page92 = new Page92(actionId);

        page92.initialize();
    }

    globalPage.activatePage(pageId);

    setInterval(page90Refresh, 60000);

    return page92;
}

function page90Refresh() {
    page92.refreshPage(moment().format("DD.MM.YYYY"));
}

class Page92 extends Page {
    actionId = 0;
    data = [];
    selectedId = null;

    static agentColors = [
        {id: "7397715395783318274", color: "#7928ca"},
        {id: "7413654006667034412", color: "#ff0080"},
        {id: "6898265584977189358", color: "#0d6efd"},
        {id: "7417799912131682816", color: "#ffa500"},
        {id: "7426708767212722308", color: "#191970"},
        {id: "7389214479898473355", color: "#4a4fd4"},
        {id: "7418487622955379774", color: "#32cd32"},
        {id: "7368463748813160933", color: "#008000"},
        {id: "74114653868075912985", color: "#00008b"},
        {id: "7412921813726668808", color: "#ff7f50"},
        {id: "6901298909405270647", color: "#2f4f4f"},
        {id: "7097117756238813319", color: "#9f5901"},
        {id: "7425912810798652153", color: "#9b0086"},
        {id: "7140255621678765675", color: "#0a4d85"},
        {id: "7150632653983591079", color: "#212a5e"},
        {id: "7369897360496222886", color: "#0da394"},
        {id: "7369216028941956636", color: "#1b141a"},
        {id: "7095037835551307471", color: "#b75353"},
        {id: "6974513176326201916", color: "#2f5b31"},
        {id: "7411465386805912985", color: "#4e92cd"},
        {id: "7358373207434405549", color: "#ffff00"},
        {id: "7361391346412363816", color: "#adff2f"},
        {id: "7421123736934631203", color: "#00ffff"},
        {id: "7260016733638312977", color: "#0000ff"},
        {id: "7407324307505112574", color: "#483d8b"},
        {id: "7365809179739829543", color: "#721c24"},
        {id: "7156482553976480164", color: "#00acc1"},
        {id: "7125684059657017851", color: "#2f3740"},
        {id: "7104199816568887658", color: "#849fc5"},
        {id: "7366242919464721978", color: "#0d6efd"},
        {id: "7407345068771463161", color: "#003c3b"}
    ];

    constructor(actionId) {
        super();

        this.actionId = actionId;
    }

    getId() {
        return 92;
    };

    getActionId() {
        return this.actionId;
    }

    initialize() {
        GlobalPage.showWaiter();

        GlobalPage.sleep(1);

        $("#content_" + this.getId()).append(this.getContent());

        globalPage.markFavorite(this.getId());

        for(let i = 6; i >= 0; i--) {
            const localDate = moment().subtract('days', i);

            $("#page92_date_box").append(Page.template("page92_date_template"));

            $("#page92_date_parent").attr("id", "page92_date_parent_" + i);
            const parentElement = $("#page92_date_parent_" + i);
            parentElement.attr("sel_date", localDate.format("DD.MM.YYYY"));

            if(i === 0) {
                parentElement.addClass("date92_selected");
            }

            $("#page92_date").attr("id", "page92_date_" + i);
            $("#page92_date_" + i).html(localDate.format("DD.MM.YYYY"));

            $("#page92_day").attr("id", "page92_day_" + i);
            $("#page92_day_" + i).html(Page92.getDayName(localDate));
        }

        this.refreshPage(moment().format("DD.MM.YYYY"));
    }

    getContent() {
        return `
            <style>
            .page92-info-header {
                text-align: center;
                background-color: #483d8b;
                color: var(--color-mintcream);
            }
            
            .page92-row-border {               
                border-bottom: 1px solid var(--color-border)          
            }
            
            .page92_row:nth-child(odd) {
                background-color: #faf9f9;
            }
            
            .date92 {
                cursor: pointer;
            }
            
            .date92_selected {
                background-color: var(--color-lightblue);
                color: var(--color-mintcream);
            }
            </style>
            
            <div id="page92_like_box" liked="0" class="fcc-card like-box" onclick="GlobalPage.userInfoLikePage(92)">
                <img id="page92_like_img" src="./images/like.png" class="like-img" alt=""/>    
            </div>
            <div id="page92_date_box" style="height: 50px;">
            
            </div>
            <div id="page92_box" style="padding-top: 20px">
                <div>
                    
                </div>
            </div>
            
            <script type="text/html" id="page92_date_template">
                <div id="page92_date_parent" class="float-left fcc-card date92" style="width: 100px; height: 50px;" onclick="Page92.chooseDate(this)">
                    <div id="page92_date" style="text-align: center; margin-top: 5px; font-weight: 600; font-size: 1.1em;"></div>                
                    <div id="page92_day" style="text-align: center; margin-top: 5px; font-size: medium;"></div>
                </div>
            </script>
            
            <script type="text/html" id="page92_card_template">
                <div id="page92_card" class="float-left fcc-card">
                    <div id="page92_chart"></div>                
                </div>
            </script>
            
            <script type="text/html" id="page92_info_template">
                <tr id="page92_row">
                    <td id="page92_index" class="page92-row-border"></td>                   
                    <td id="page92_id" class="page92-row-border"></td>
                    <td id="page92_color" class="page92-row-border">
                        <div id="page92_color_box" style="width: 20px; height: 20px; border-radius: 10px;">&nbsp;</div>
                    </td>
                    <td id="page92_name" class="page92-row-border"></td>
                    <td id="page92_start_date" class="page92-row-border"></td>
                    <td id="page92_finish_date" class="page92-row-border"></td>
                    <td id="page92_duration" class="page92-row-border"></td>
                    <td id="page92_type" class="page92-row-border"></td>
                    <td id="page92_period" class="page92-row-border"></td>
                    <td id="page92_start_time" class="page92-row-border"></td>
                    <td id="page92_finish_time" class="page92-row-border"></td>
                    <td id="page92_start_all_day" class="page92-row-border"></td>
                </tr>
            </script>
        `;
    }

    refreshPage(currentDate) {
        GlobalPage.showWaiter();

        const instance = this;

        $("#page92_box").empty();

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7099602215400799441&cur_date=" + currentDate,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    instance.drawAgents(data.agents);
                    instance.drawAgentInfo(data.info);

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

    drawAgents(agents) {
        const parentElement = $("#page92_box");
        parentElement.empty();

        let fromIndex = 0, toIndex = 0;

        for(let i = 0; i < 4; i++) {
            parentElement.append(Page.template("page92_card_template"));

            $("#page92_card").attr("id", "page92_card_" + i);
            $("#page92_card_" + i).css("width", "49%");
            $("#page92_chart").attr("id", "page92_chart_" + i);

            const categories = [];

            for(let j = toIndex; j < toIndex + 6; j++) {
                const hours = j.toString().padStart(2, "0") + ":00-" + (j + 1).toString().padStart(2, "0") + ":00";

                categories.push(hours);
            }

            fromIndex = toIndex;
            toIndex = toIndex + 6;

            const options = Page92.getAgentsOptions(this.getChartSeries(fromIndex, toIndex, i, agents), categories);

            const agentsChart = new ApexCharts($("#page92_chart_" + i).get(0), options);
            agentsChart.render();
        }
    }

    getChartSeries(from, to, chartIndex, list) {
        const chartSeries = [];

        list.forEach((agent, index) => {
            const hour = parseInt(agent.hour);

            if(from <= hour && hour < to) {
                let series = this.getSeries(agent, chartSeries);
                const dataIndex = Math.abs(chartIndex * 6 - hour);

                if (series === null) {
                    series = Page92.getNewSeries(agent.id, agent.name);

                    series.data[dataIndex] = agent.count;

                    chartSeries.push(series);
                } else {
                    series.data[dataIndex] = agent.count;
                }
            }
        });

        return chartSeries;
    }

    getSeries(agent, series) {
        for(let i = 0; i < series.length; i++) {
            if(series[i].id === agent.id) {
                return series[i];
            }
        }

        return null;
    }

    drawAgentInfo(list) {
        const parentElement = $("#page92_box");

        parentElement.append(Page.template("page92_card_template"));

        $("#page92_card").attr("id", "page92_card_info");

        const infoCardElement = $("#page92_card_info");
        infoCardElement.css("width", "99%");
        infoCardElement.css("border-radius", "0px");

        $("#page92_chart").attr("id", "page92_agent_info");

        $("#page92_agent_info").append("<table id='page92_table' border='0' style='width: 100%'></table>");

        const tableElement = $("#page92_table");
        tableElement.append(Page.template("page92_info_template"));

        $("#page92_row").attr("id", "page92_row_header");
        $("#page92_row_header").addClass("page92-info-header");

        $("#page92_index").attr("id", "page92_index_header");
        const indexElement = $("#page92_index_header");
        indexElement.html("#");

        $("#page92_id").attr("id", "page92_id_header");
        const idElement = $("#page92_id_header");
        idElement.html("ID");
        idElement.css("text-align", "center");
        idElement.css("width", "9%");

        $("#page92_color").attr("id", "page92_color_header");
        $("#page92_color_box").attr("id", "page92_color_box_header");

        $("#page92_name").attr("id", "page92_name_header");
        const nameElement = $("#page92_name_header");
        nameElement.html("Название");
        nameElement.css("text-align", "center");

        $("#page92_start_date").attr("id", "page92_start_date_header");
        const startDateElement = $("#page92_start_date_header");
        startDateElement.html("Старт");
        startDateElement.css("text-align", "center");

        $("#page92_finish_date").attr("id", "page92_finish_date_header");
        const finishDateElement = $("#page92_finish_date_header");
        finishDateElement.html("Финиш");
        finishDateElement.css("text-align", "center");

        $("#page92_duration").attr("id", "page92_duration_header");
        const durationElement = $("#page92_duration_header");
        durationElement.html("Длительность");
        durationElement.css("text-align", "center");

        $("#page92_type").attr("id", "page92_type_header");
        const typeElement = $("#page92_type_header");
        typeElement.html("Тип");
        typeElement.css("text-align", "center");

        $("#page92_period").attr("id", "page92_period_header");
        const periodElement = $("#page92_period_header");
        periodElement.html("Период");
        periodElement.css("text-align", "center");

        $("#page92_start_time").attr("id", "page92_start_time_header");
        const startTimeElement = $("#page92_start_time_header");
        startTimeElement.html("ВС");
        startTimeElement.css("text-align", "center");

        $("#page92_finish_time").attr("id", "page92_finish_time_header");
        const finishTimeElement = $("#page92_finish_time_header");
        finishTimeElement.html("ВO");
        finishTimeElement.css("text-align", "center");

        $("#page92_start_all_day").attr("id", "page92_start_all_day_header");
        const allDayElement = $("#page92_start_all_day_header");
        allDayElement.html("Целый день");
        allDayElement.css("text-align", "center");

        list.forEach((row, index) => {
            tableElement.append(Page.template("page92_info_template"));

            $("#page92_row").attr("id", "page92_row_" + index);
            $("#page92_row_" + index).addClass("page92_row");
            $("#page92_row_" + index).attr("agent_id", row.id);

            $("#page92_index").attr("id", "page92_index_" + index);
            $("#page92_index_" + index).html(index + 1);

            $("#page92_id").attr("id", "page92_id_" + index);
            $("#page92_id_" + index).html(row.id);

            $("#page92_color").attr("id", "page92_color_" + index);
            $("#page92_color_box").attr("id", "page92_color_box_" + index);
            $("#page92_color_box_" + index).css("background-color", Page92.getAgentColor(row.id));

            $("#page92_name").attr("id", "page92_name_" + index);
            const nameElement = $("#page92_name_" + index);
            nameElement.html(row.name);
            nameElement.css("text-indent", "10px");

            $("#page92_start_date").attr("id", "page92_start_date_" + index);
            const startDateElement = $("#page92_start_date_" + index);
            startDateElement.html(Page92.getTimeWithoutTimezone(row.startDate));
            startDateElement.css("width", "4%");
            startDateElement.css("text-align", "center");

            $("#page92_finish_date").attr("id", "page92_finish_date_" + index);
            const finishDateElement = $("#page92_finish_date_" + index);
            finishDateElement.html(Page92.getTimeWithoutTimezone(row.finishDate));
            finishDateElement.css("width", "4%");
            finishDateElement.css("text-align", "center");

            const duration = moment(row.finishDate).diff(moment(row.startDate));

            $("#page92_duration").attr("id", "page92_duration_" + index);
            const durationElement = $("#page92_duration_" + index);
            durationElement.html(Page92.getDurationToString(duration));
            durationElement.css("text-align", "center");
            if(duration > 600000) {
                durationElement.css("color", "#ed143d");
            }

            $("#page92_type").attr("id", "page92_type_" + index);
            const typeElement = $("#page92_type_" + index);
            typeElement.html(row.type);
            typeElement.css("width", "3%");
            typeElement.css("text-align", "center");

            $("#page92_period").attr("id", "page92_period_" + index);
            const periodElement = $("#page92_period_" + index);
            periodElement.html(row.period);
            periodElement.css("width", "4%");
            periodElement.css("text-align", "center");

            $("#page92_start_time").attr("id", "page92_start_time_" + index);
            const startTimeElement = $("#page92_start_time_" + index);
            startTimeElement.html(row.startTime);
            startTimeElement.css("width", "3%");
            startTimeElement.css("text-align", "center");

            $("#page92_finish_time").attr("id", "page92_finish_time_" + index);
            const finishTimeElement = $("#page92_finish_time_" + index);
            finishTimeElement.html(row.finishTime);
            finishTimeElement.css("width", "3%");
            finishTimeElement.css("text-align", "center");

            $("#page92_start_all_day").attr("id", "page92_start_all_day_" + index);
            const allDayElement = $("#page92_start_all_day_" + index);
            allDayElement.html(row.allDay);
            allDayElement.css("width", "3%");
            allDayElement.css("text-align", "center");
        });
    }

    <!-- STATIC METHODS -->
    static getTimeWithoutTimezone(datetime) {
        if(datetime != null) {
            return moment.utc(datetime).format("HH:mm:ss");
        } else {
            return "";
        }
    }

    static getNewSeries(id, name) {
        if (name.length > 50) {
            name = name.substring(0, 46) + " ...";
        }

        return {
            id: id,
            name: name,
            color: Page92.getAgentColor(id),
            data: [0, 0, 0, 0, 0, 0]
        };
    }

    static showSelectedAgent(selectedId) {
        page92.selectedId = selectedId;

        $(".page92_row").css("display", "none");

        const rowElements = $("#page92_table").children(".page92_row");

        rowElements.each(function (index, element) {
            if (parseInt(selectedId) === parseInt($("#" + element.id).attr("agent_id"))) {
                $("#" + element.id).css("display", "");
            }
        });
    }

    static getAgentsOptions(chartSeries, categories) {
        return {
            series: chartSeries,
            chart: {
                height: 350,
                type: "bar",
                dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.5
                },
                animations: {enabled: false},
                zoom: {enabled: false},
                toolbar: {show: false},
                events: {
                    dataPointSelection(event, chartContext, opts) {
                        // opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
                        const selectedAgent = opts.w.config.series[opts.seriesIndex];

                        if(page92.selectedId === null) {
                            Page92.showSelectedAgent(selectedAgent.id);
                        } else {
                            if(selectedAgent.id === page92.selectedId) {
                                $(".page92_row").css("display", "");
                            } else {
                                Page92.showSelectedAgent(selectedAgent.id);
                            }
                        }
                    }
                }
            },
            plotOptions: {
                bar: {
                    rangeBarOverlap: false,
                    borderRadius: 1,
                    columnWidth: "10px",
                    //barHeight: "80px",
                    dataLabels: {
                        show: false
                    }
                }
            },
            //colors: colors92,
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth"
            },
            title: {
                show: false
            },
            grid: {
                borderColor: "#e7e7e7",
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: categories,
                labels: {
                    show: true,
                    style: {
                        fontSize: "12px",
                        fontFamily: "'Noto Sans', sans-serif"
                    }
                }
            },
            yaxis: {
                stepSize: 4,
                max: 10,
                labels: {
                    show: true,
                    style: {
                        fontSize: "10px",
                        fontFamily: "'Noto Sans', sans-serif"/*,
                        colors: ["blanchedalmond"]*/
                    }
                }
            },
            legend: {show: false}
        };
    }

    static getAgentColor(id) {
        for(let i = 0; i < Page92.agentColors.length; i++) {
            if(Page92.agentColors[i].id === "" + id) {
                return Page92.agentColors[i].color;
            }
        }

        return "#c0c0c0";
    }

    static getDurationToString(duration) {
        const ms =  duration % 1000;
        duration = (duration - ms) / 1000;
        const secs = duration % 60;
        duration = (duration - secs) / 60;
        const mins = duration % 60;
        const hrs = (duration - mins) / 60;

        return hrs.toString().padStart(2, "0") + ':' + mins.toString().padStart(2, "0") + ':' + secs.toString().padStart(2, "0");
    }

    static getDayName(date) {
        const dayOfWeek = moment(date).day();

        switch (dayOfWeek) {
            case 0:
                return "ВС";
            case 1:
                return "ПН";
            case 2:
                return "ВТ";
            case 3:
                return "СР";
            case 4:
                return "ЧТ";
            case 5:
                return "ПТ";
            default:
                return "СБ";
        }
    }

    static chooseDate(element) {
        const selectedElement = $("#" + element.id);

        $(".date92").removeClass("date92_selected");

        selectedElement.addClass("date92_selected");

        page92.refreshPage(selectedElement.attr("sel_date"));
    }
}