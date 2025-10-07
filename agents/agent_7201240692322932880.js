// 7201240692322932880
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total=0;agent.processed=0;agent.skipped=0;agent.saved=0;agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
function getAgentsMonitorWebsocketClient(){try{return new WebSocketClient("ws://192.168.0.96:3000/");}catch(e){}}function sendAgentsMonitorMessageToWebsocket(ws, agentsMonitor) {try{ws.Send("#"+EncodeJson(agentsMonitor));return ws;}catch(e){return null;}}

function hasException(list, exception) {
    if(exception == "" || exception == null) {
        return true;
    }

    for(element in list) {
        if(StrUpperCase(element) == StrUpperCase(exception)) {
            return true;
        }
    }

    return false;
}

function getCompletedAgentsStatisticByHour(hour) {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ames.agent_id, " +
        "    COUNT(ames.agent_id) AS run_count, " +
        "    MAX(sas.name) AS agent_name, " +
        "    MIN(DATEPART(minute, ames.start_date)) AS minute, " +
        "    MIN(DATEPART(second, ames.start_date)) AS second, " +
        "    MAX(DATEDIFF(second, ames.start_date, ames.finish_date)) AS max_diff, " +
        "    MAX(sas.trigger_type) AS type, " +
        "    MAX(sas.period) AS period, " +
        "    MAX(sas.start_time) AS start " +
        " FROM [WTDB].[dbo].cc_agent_monitor_events ames " +
        "    INNER JOIN [WTDB].[dbo].server_agents sas ON ames.agent_id = sas.id " +
        " WHERE DAY(ames.start_date) = DAY(GETDATE()) " +
        "  AND MONTH(ames.start_date) = MONTH(GETDATE()) " +
        "  AND YEAR(ames.start_date) = YEAR(GETDATE()) " +
        "  AND DATEPART(hour, ames.start_date) = " + hour +
        " GROUP BY ames.agent_id " +
        " ORDER BY minute, second "));

    if(ArrayCount(dataList) > 0) {
        eval("hourSlotObject = result.hour" + i + " = {}");

        hourSlotObject.agents = [];

        for (data in dataList) {
            agentSlot = {};

            agentSlot.agentId = data.agent_id;
            agentSlot.hour = hour;
            agentSlot.name = data.agent_name;
            agentSlot.type = data.type;
            agentSlot.period = data.period;
            agentSlot.start = data.start;
            agentSlot.runCount = data.run_count;
            agentSlot.maxDiff = data.max_diff;

            agentSlot.launches = [];
            agentSlot.exceptions = [];

            hourSlotObject.agents.push(agentSlot);

            statisticList = ArrayDirect(XQuery("sql: " +
                " SELECT CONCAT(REPLACE(STR(DATEPART(hour, ames.start_date), 2), SPACE(1), '0'), REPLACE(STR(DATEPART(minute, ames.start_date), 2), SPACE(1), '0')) AS run_time_id, " +
                "    CONCAT(REPLACE(STR(DATEPART(hour, ames.start_date), 2), SPACE(1), '0'), ':', REPLACE(STR(DATEPART(minute, ames.start_date), 2), SPACE(1), '0')) AS run_time, " +
                "    ames.error_message AS exception " +
                " FROM [WTDB].[dbo].cc_agent_monitor_events ames " +
                " WHERE ames.agent_id = " + data.agent_id +
                "    AND DAY(ames.start_date) = DAY(GETDATE()) " +
                "    AND MONTH(ames.start_date) = MONTH(GETDATE()) " +
                "    AND YEAR(ames.start_date) = YEAR(GETDATE()) " +
                "    AND DATEPART(hour, ames.start_date) = " + hour +
                " ORDER BY run_time "));

            for (statistic in statisticList) {
                stat = {};
                stat.runTimeId = statistic.run_time_id;
                stat.runTime = statistic.run_time;

                agentSlot.launches.push(stat);

                exception = statistic.exception;

                if (!hasException(agentSlot.exceptions, exception)) {
                    agentSlot.exceptions.push(exception);
                }
            }
        }
    } else {
        eval("hourSlotObject = result.hour" + i + " = null");
    }
}

var agentId = 7201240692322932880;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7201240692322932880";

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var agentsMonitorWS = getAgentsMonitorWebsocketClient();

var total = 0;
var processed = 0;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    total = 24;

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    result = {};
    result.type = "AGENTS_MONITOR";

    for(i = 0; i <= 23; i++) {
        getCompletedAgentsStatisticByHour(i);

        processed++;

        agent.processed = processed;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    if(agentsMonitorWS != null) {
        agentsMonitorWS = sendAgentsMonitorMessageToWebsocket(agentsMonitorWS, result);
    }

    agent.state = 1;
    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
        processed + " processed",
        null,
        null
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
try {
    agentsMonitorWS.Send("close");
} catch (e) {}