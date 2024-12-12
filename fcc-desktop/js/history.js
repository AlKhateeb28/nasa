function onChange() {
    console.log("Change toString:: " + kendo.toString(this.value(), "dd-MM-yyyy"));
}

function getDateTime(dateTime) {
    const currentDate = new Date(dateTime);

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function createAgentBox(agent) {
    const newAgentId = agent.getId() + "-" + Math.floor(Math.random() * 100000);

    $("#table").prepend(kendo.template($("#template").html()));

    $("#agentState").attr("id",   "agentState" + newAgentId);
    $("#wsState").attr("id",   "wsState" + newAgentId);

    $("#rowId").attr("id",   "rowId" + newAgentId);
    $("#rowId" + newAgentId).addClass("agent_" + newAgentId);
    $("#agentId").attr("id",   "agentId" + newAgentId);
    $("#agentId" + newAgentId).html(newAgentId);
    $("#agentName").attr("id",   "agentName" + newAgentId);
    $("#agentName" + newAgentId).html(agent.getName());
    $("#agentCopyId").attr("id",   "agentCopyId_" + newAgentId);
    $("#agentCopyId_" + newAgentId).attr("agentId",   newAgentId);
    $("#userCopyId").attr("id",   "userCopyId_" + newAgentId);
    $("#userCopyId_" + newAgentId).attr("userId",   agent.getUserId());
    $("#userId").attr("id",   "userId" + newAgentId);
    $("#userId" + newAgentId).html(agent.getUserId());
    $("#userName").attr("id",   "userName" + newAgentId);
    $("#userName" + newAgentId).html(agent.getUserName());
    $("#total").attr("id",   "total" + newAgentId);
    $("#total" + newAgentId).html(agent.getTotal());
    $("#processed").attr("id",   "processed" + newAgentId);
    $("#processed" + newAgentId).html(agent.getProcessed());
    $("#skipped").attr("id",   "skipped" + newAgentId);
    $("#skipped" + newAgentId).html(agent.getSkipped());
    $("#saved").attr("id",   "saved" + newAgentId);
    $("#saved" + newAgentId).html(agent.getSaved());
    $("#notFound").attr("id",   "notFound" + newAgentId);
    $("#notFound" + newAgentId).html(agent.getNotFound());
    $("#message").attr("id",   "message" + newAgentId);
    $("#message" + newAgentId).html(agent.getMessage());
    $("#duration").attr("id",   "duration" + newAgentId);
    $("#duration" + newAgentId).html("--");
    $("#chart").attr("id", "chart_" + newAgentId);
    $("#msPerRow").attr("id",   "msPerRow_" + newAgentId);
    $("#dateTime").attr("id",   "dateTime_" + newAgentId);
    $("#dateTime_" + newAgentId).html(getDateTime(agent.getMessageDate()));
    $("#expected").attr("id",   "expected_" + newAgentId);
    $("#processCount").attr("id",   "processCount_" + newAgentId);
    $("#processCount_" + newAgentId).html(1);
    $("#owner").attr("id",   "owner_" + newAgentId);
    $("#owner_" + newAgentId).addClass("owner-" + agent.getUserId());
    $("#errorBox").attr("id",   "errorBox_" + newAgentId);
    $("#optionalHeader").attr("id",   "optionalHeader_" + newAgentId);
    $("#optionalData").attr("id",   "optionalData_" + newAgentId);
    $("#name1").attr("id",   "name1_" + newAgentId);
    $("#value1").attr("id",   "value1_" + newAgentId);
    $("#name2").attr("id",   "name2_" + newAgentId);
    $("#value2").attr("id",   "value2_" + newAgentId);

    if(agent.getOptionalData() !== undefined) {
        if(agent.getOptionalData().getName1() !== undefined) {
            $("#optionalData_" + newAgentId).css("display",   "block");

            $("#name1_" + newAgentId).html(agent.getOptionalData().getName1());
            $("#value1_" + newAgentId).html(agent.getOptionalData().getValue1());
        }

        if(agent.getOptionalData().getName2() != undefined) {
            $("#optionalData_" + newAgentId).css("display",   "block");

            $("#name2_" + newAgentId).html(agent.getOptionalData().getName2());
            $("#value2_" + newAgentId).html(agent.getOptionalData().getValue2());
        }
    }

    if(agent.getMsPerRow() > 0) {
        const msPerRow  = Math.ceil((agent.getMsPerRow() * 1000) * 100) / 100;

        $("#msPerRow_" + newAgentId).html( msPerRow + " ms");
    }

    var ds = [
        agent.getValueAsPercent(agent.getFetchTime()),
        agent.getValueAsPercent(agent.getHandlingTime()),
        agent.getValueAsPercent(agent.getSavingTime())
    ];

    $("#chart_" + newAgentId).kendoChart({
        chartArea: {
            height: 95
        },
        legend: {
            position: "bottom"
        },
        seriesDefaults: {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            }
        },
        series: [{
            name: "",
            data: ds
        }],
        valueAxis: {
            labels: {
                format: "{0}%"
            },
            min: 0,
            max: 110,
            majorUnit: 20
        },
        seriesColors: ["#FF1493", "red", "yellow"],
        tooltip: {
            visible: true,
            template: "#= value #%",
            font: "10px Inter"
        }
    });
}

//var calendar = $("#calendar").data("kendoCalendar").selectDates();

$(document).ready(function () {
    // create Calendar from div HTML element
    $("#calendar").kendoCalendar({
        componentType: "classic",
        change: onChange,
    });

    $.getJSON( "json/agents_data_19.06.2024.json", function( data ) {
        for(agent of data) {
            if (agent.type === "AGENT") {
                let clientAgent = createAgent(agent);

                createAgentBox(clientAgent);
            }

        }
    });

});