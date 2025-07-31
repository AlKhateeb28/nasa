// 7182083984912785634
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total=0;agent.processed=0;agent.skipped=0;agent.saved=0;agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
function getHelperWebsocketClient(){try{return new WebSocketClient("ws://192.168.0.96:3000/");}catch(e){}}function sendHelperMessageToWebsocket(ws, helper) {try{ws.Send("#"+EncodeJson(helper));return ws;}catch(e){return null;}}

var agentId = 7182083984912785634;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7182083984912785634";

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var helperWS = getHelperWebsocketClient();

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    result = {};
    result.type = "HELPER";
    result.total = 0;
    result.processed = 0;
    result.saved = 0;
    result.ticks = [];

    summaryList = ArrayDirect(XQuery("sql: " +
        " SELECT SUM(CAST(total AS INT)) AS total, " +
        "       SUM(CAST(processed AS INT)) AS processed, " +
        "       SUM(CAST(skipped AS INT)) AS skipped, " +
        "       SUM(CAST(saved AS INT)) AS saved " +
        " FROM [WTDB].[dbo].cc_agent_monitor_events " +
        " WHERE agent_id = 7437057559620972968 " +
        "  AND DAY(start_date) = DAY(GETDATE()) " +
        "  AND MONTH(start_date) = MONTH(GETDATE()) " +
        "  AND YEAR(start_date) = YEAR(GETDATE()) "));

    if(ArrayCount(summaryList) >> 0) {
        result.total = summaryList[0].total;
        result.processed = summaryList[0].processed;
        result.saved = summaryList[0].saved;
        result.skipped = summaryList[0].skipped;
    }

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT processed, " +
        "       state, " +
        "       error_message, " +
        "       start_date, " +
        "       finish_date, " +
        "       DATEDIFF(second, start_date, finish_date) AS diff " +
        " FROM [WTDB].[dbo].cc_agent_monitor_events " +
        " WHERE agent_id = 7437057559620972968 " +
        "    AND DAY(start_date) = DAY(GETDATE()) " +
        "    AND MONTH(start_date) = MONTH(GETDATE()) " +
        "    AND YEAR(start_date) = YEAR(GETDATE()) " +
        " ORDER BY start_date "));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        element = {};
        element.processed = data.processed;
        element.state = data.state;
        element.errorMessage = data.error_message;
        element.startDate = data.start_date;
        element.finishDate = data.finish_date;
        element.diff = data.diff;

        result.ticks.push(element);

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 100 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    if(helperWS != null) {
        helperWS = sendHelperMessageToWebsocket(helperWS, result);
    }

    agent.state = 1;
    agent.processed = processed;
    agent.saved = saved;
    agent.skipped = skipped;
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
        saved + " saved, ",
        skipped + " skipped"
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
    helperWS.Send("close");
} catch (e) {}