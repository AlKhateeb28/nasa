// 7437057559620972968
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getHelperRunningId() {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT id, run_count " +
        "FROM [WTDB].[dbo].cc_glovars " +
        "WHERE code = 'helper_1_hour' "));

    if(ArrayCount(dataList) == 0){
        return null;
    }

    return OptInt(dataList[0].id);
}

function addGlovarRecord() {
    glovarDooc = tools.new_doc_by_name( 'cc_glovar', false );
    glovarDooc.BindToDb( DefaultDb );

    glovarDocTE = glovarDooc.TopElem;
    glovarDocTE.code = "helper_1_hour";
    glovarDocTE.type = "string";
    glovarDocTE.value = "Running...";
    glovarDocTE.run_count = 1;

    glovarDooc.Save();

    return glovarDooc.DocID;
}

function updateSingleFlag(flag, step) {
    agent.message = step + " из 9. Получение " + flag + " данных ...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        " SELECT cs.id AS cs_id, " +
        "       os.id AS org_id, " +
        "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS cs_flag, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS org_flag " +
        "         FROM [WTDB].[dbo].collaborators cs " +
        "           INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "           INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "           INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "         WHERE cs.modification_date > DATEADD(MINUTE, " + pastTimeOffset + ", GETDATE()) " +
        "           OR os.modification_date > DATEADD(MINUTE, " + pastTimeOffset + ", GETDATE()) " +
        " ) " +
        " SELECT * " +
        " FROM _view " +
        " WHERE cs_flag <> org_flag "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка " + flag + " данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        collaboratorDoc = tools.open_doc(data.cs_id);

        if(collaboratorDoc != undefined) {
            collaboratorDoc.TopElem.custom_elems.ObtainChildByKey(flag).value = data.org_flag;

            collaboratorDoc.Save();

            saved++;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + data.cs_id + " is not exist!");

            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

var agentId = 7437057559620972968;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7437057559620972968";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

var pastTimeOffset = "-60";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

var helperAgentId = getHelperRunningId();

if(helperAgentId == null) {
    helperAgentId = addGlovarRecord();

    try {
        step = 1;
        count = updateSingleFlag("in_program", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed in_program: " + count);

        step++;
        count = updateSingleFlag("is_fcc", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_fcc: " + count);

        step++;
        count = updateSingleFlag("is_rck", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_rck: " + count);

        step++;
        count = updateSingleFlag("is_ock", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_ock: " + count);

        step++;
        count = updateSingleFlag("is_roiv", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_roiv: " + count);

        step++;
        count = updateSingleFlag("is_partner", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_partner: " + count);

        step++;
        count = updateSingleFlag("is_a_commerce_client", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_a_commerce_client: " + count);

        step++;
        count = updateSingleFlag("is_project_ended", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_project_ended: " + count);

        step++;
        count = updateSingleFlag("With_no_right", step);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed With_no_right: " + count);

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
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

    DeleteDoc(UrlFromDocID(helperAgentId));
} else {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to end!");

    glovarsDoc = tools.open_doc(helperAgentId);

    if(glovarsDoc != undefined) {
        glovarsDoc.TopElem.run_count = glovarsDoc.TopElem.run_count + 1;

        glovarsDoc.Save();
    }

    agent.state = 1;
    agent.processed = 0;
    agent.saved = 0;
    agent.skipped = 0;
    agent.message = "Закончено. Работает предыдущий экземпляр агента!";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {
}