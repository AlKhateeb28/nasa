// 7397715395783318274
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
function getMismatchWebsocketClient(){try{return new WebSocketClient("ws://192.168.0.96:3000/");}catch(e){}}function getMismatchInstance(agentId) {mismatch={};mismatch.id=agentId;mismatch.type = "MISMATCH";mismatch.dateTime=Date();mismatch.count=0;mismatch.state=0;return mismatch;}function sendMismatchMessageToWebsocket(ws, mismatch) {try{ws.Send("#"+EncodeJson(mismatch));return ws;}catch(e){return null;}}

function getCollaboratorsByFlag(flag) {
    return ArrayDirect(XQuery("sql:" +
        " WITH _view AS (" +
        " SELECT cs.id AS cs_id," +
        "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS cs_flag, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS org_flag " +
        "         FROM [WTDB].[dbo].collaborators cs" +
        "           INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id" +
        "           INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id" +
        "           INNER JOIN [WTDB].[dbo].org o ON os.id = o.id" +
        "         WHERE cs.modification_date > DATEADD(MINUTE, -120, GETDATE())" +
        " ) " +
        " SELECT *" +
        " FROM _view" +
        " WHERE cs_flag <> org_flag "));
}

var agentId = 7397715395783318274;
var missMatchId = 7397715395783318274 + "_mismatch";

var loggerName = "agent_7397715395783318274";
var userId = 7389518304440750773; // Websoft inner user
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);
agentId += "_agent";

var total = 0;
var processed = 0;

var mismatchWS = getMismatchWebsocketClient();
var mismatch = getMismatchInstance(missMatchId);
var result = "";

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    // IN PROGRAM
    agent.message = "Получение данных in_program сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IN_PROGRAM";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("in_program");
    wrongCount = ArrayCount(collaboratorList);

    result += "in_program: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += wrongCount;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);

    // IS_FCC
    agent.message = "Получение данных is_fcc сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IS_FCC";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("is_fcc");
    wrongCount = ArrayCount(collaboratorList);

    result += ", is_fcc: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);

    // IS_RCK
    agent.message = "Получение данных is_rck сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IS_RCK";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("is_rck");
    wrongCount = ArrayCount(collaboratorList);

    result += ", is_rck: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);

    // IS_ROIV
    agent.message = "Получение данных is_roiv сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IS_ROIV";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("is_roiv");
    wrongCount = ArrayCount(collaboratorList);

    result += ", is_roiv: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);

    // IS_PARTNER
    agent.message = "Получение данных is_partner сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IS_PARTNER";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("is_partner");
    wrongCount = ArrayCount(collaboratorList);

    result += ", is_partner: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);

    // IS_COMMERCE
    agent.message = "Получение данных is_commerce сотрудников...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "IS_COMMERCE";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    collaboratorList = getCollaboratorsByFlag("is_a_commerce_client");
    wrongCount = ArrayCount(collaboratorList);

    result += ", is_commerce: " + wrongCount;

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = wrongCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    refreshMsPerRow(agent, startDate, processed);
    ws = sendMessageToWebsocket(ws, agent);
    //

    agent.state = 1;
    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, processed);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        " | " + "Processed: " + processed,
        " Result: " + result,
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
    mismatchWS.Send("close");
} catch (e) {}
