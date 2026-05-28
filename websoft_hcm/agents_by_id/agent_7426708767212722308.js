// 7426708767212722308
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7426708767212722308;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();
var loggerName = "agent_7426708767212722308";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;

agent.message = "Пересоздание таблицы 'Белое & Серое'...";
ws = sendMessageToWebsocket(ws, agent);

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " BEGIN TRY DROP TABLE [WTDB].[dbo]._white_gray_ids; END TRY BEGIN CATCH END CATCH; " +
        " WITH _tmp_white AS( " +
        "   SELECT cs.id, cs.org_id, cs.fullname " +
	    "   FROM [WTDB].[dbo].collaborators cs " +
        "   WHERE cs.is_dismiss = 0 " +
        " 	    AND cs.login NOT LIKE '%_muc_%' " +
        " 	    AND cs.org_id IS NOT NULL " +
        " ), " +
        " _tmp_fcc AS( " +
        "   SELECT cs.id, cs.org_id, cs.fullname " +
        "   FROM [WTDB].[dbo].collaborators cs " +
        "   WHERE cs.login LIKE '%load_muc%' " +
        " 	    AND cs.is_dismiss = 0 " +
        " 	    AND cs.org_id IS NOT NULL " +
        " ), " +
        " _tmp_rck AS( " +
        "   SELECT cs.id, cs.org_id, cs.fullname " +
        "   FROM [WTDB].[dbo].collaborators cs " +
        "   WHERE cs.login LIKE '%rck_muc%' " +
        " 	    AND cs.is_dismiss = 0 " +
        " 	    AND cs.org_id IS NOT NULL " +
        " ), " +
        " _tmp_tren AS( " +
        "   SELECT cs.id, cs.org_id, cs.fullname " +
        "   FROM [WTDB].[dbo].collaborators cs " +
        "   WHERE cs.login LIKE '%tren_muc_%' " +
        " 	    AND cs.is_dismiss = 0 " +
        " 	    AND cs.org_id IS NOT NULL " +
        " ) " +
        " SELECT IDENTITY(INT, 1, 1) AS id, " +
        "       cs.id AS cs_id , " +
        "       white.id AS white_id, " +
        "       fcc.id AS fcc_gray_id, " +
        "       rck.id AS rck_gray_id, " +
        "       tren.id AS tren_gray_id " +
        " INTO [WTDB].[dbo]._white_gray_ids " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "   LEFT JOIN _tmp_white AS white ON UPPER(cs.fullname) = UPPER(white.fullname) AND cs.org_id = white.org_id " +
        "   LEFT JOIN _tmp_fcc AS fcc ON UPPER(cs.fullname) = UPPER(fcc.fullname) AND cs.org_id = fcc.org_id " +
        "   LEFT JOIN _tmp_rck AS rck ON UPPER(cs.fullname) = UPPER(rck.fullname) AND cs.org_id = rck.org_id " +
        "   LEFT JOIN _tmp_tren AS tren ON UPPER(cs.fullname) = UPPER(tren.fullname) AND cs.org_id = tren.org_id " +
        " WHERE cs.is_dismiss = 0 " +
        "   AND cs.org_id IS NOT NULL; " +
        " ALTER TABLE [WTDB].[dbo]._white_gray_ids ADD PRIMARY KEY (id); " +
        " CREATE NONCLUSTERED INDEX IX__white_gray_ids_cs_id ON[WTDB].[dbo]._white_gray_ids(cs_id); " +
        " CREATE NONCLUSTERED INDEX IX__white_gray_ids_white_id ON[WTDB].[dbo]._white_gray_ids(white_id); " +
        " CREATE NONCLUSTERED INDEX IX__white_gray_ids_fcc_gray_id ON[WTDB].[dbo]._white_gray_ids(fcc_gray_id); " +
        " CREATE NONCLUSTERED INDEX IX__white_gray_ids_rck_gray_id ON[WTDB].[dbo]._white_gray_ids(rck_gray_id); " +
        " CREATE NONCLUSTERED INDEX IX__white_gray_ids_tren_gray_id ON[WTDB].[dbo]._white_gray_ids(tren_gray_id); " +
        " SELECT * FROM [WTDB].[dbo]._white_gray_ids "));

    total = ArrayCount(dataList);

    agent.state = 1;
    agent.total = total;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total",
        null,
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
