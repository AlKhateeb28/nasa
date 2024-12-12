<%
// 7099602215400799441
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7099602215400799441;
var loggerName = "agent_7099602215400799441";

var result = {};
result.errorMessage = "";
result.agents = [];
result.info = [];

try {
    paramDate = Request.Query.GetOptProperty("cur_date", "0");
    if(OptInt(paramDate) == 0) {
        paramDate = StrDate(Date(), false, false);
    }

    agentList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "        SELECT agent_id, format(start_date, 'HH') AS hour, COUNT(*) AS count " +
        "        FROM [WTDB].[DBO].cc_agent_monitor_events " +
        "        WHERE format(start_date, 'dd.MM.yyyy') = '" + paramDate + "'" +
        "        GROUP BY agent_id,  format(start_date, 'HH') " +
        " ) " +
        " SELECT _view.agent_id AS id, " +
        "      _view.hour, " +
        "       _view.count, " +
        "       sas.name " +
        " FROM _view " +
        "    INNER JOIN [WTDB].[DBO].server_agents sas ON _view.agent_id = sas.id " +
        " ORDER BY hour, start_date, agent_id "));

    if (ArrayCount(agentList) > 0) {
        for (agent in agentList) {
            element = {};
            element.id = "" + agent.id;
            element.name = agent.name;
            element.hour = agent.hour;
            element.count = agent.count;
            result.agents.push(element);
        }
    }

    agentList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "        SELECT id, start_date, finish_date, COUNT(*) AS count " +
        "        FROM [WTDB].[DBO].cc_agent_monitor_events " +
        "        WHERE format(start_date, 'dd.MM.yyyy') = '" + paramDate + "'" +
        "        GROUP BY id, start_date, finish_date " +
        " ) " +
        " SELECT _view.id, " +
        "       format(_view.start_date, 'HH') AS hour, " +
        "       _view.count, " +
        "       sas.name, " +
        "       _view.start_date, " +
        "       _view.finish_date, " +
        "       sas.id AS agent_id, " +
        "       sas.trigger_type, " +
        "       sas.period, " +
        "       sas.start_time, " +
        "       sas.finish_time, " +
        "       sas.all_day " +
        " FROM _view " +
        "    INNER JOIN [WTDB].[DBO].cc_agent_monitor_events ames ON _view.id = ames.id " +
        "    INNER JOIN [WTDB].[DBO].server_agents sas ON ames.agent_id = sas.id " +
        " ORDER BY hour, start_date, agent_id "));

    if (ArrayCount(agentList) > 0) {
        for (agent in agentList) {
            element = {};
            element.id = "" + agent.agent_id;
            element.name = agent.name;
            element.hour = agent.hour;
            element.count = agent.count;
            element.startDate = agent.start_date;
            element.finishDate = agent.finish_date;
            element.type = agent.trigger_type;
            element.period = agent.period;
            element.startTime = agent.start_time;
            element.finishTime = agent.finish_time;
            element.allDay = agent.all_day;
            result.info.push(element);
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>