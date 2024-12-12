// 7368463748813160933
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getEducationMethodsFromDts() {
    try {
        sqlQuery = " SELECT doss.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , doss.programs, doss.num_trainings AS doss_count"+
            " INTO _view_dossier" +
            " FROM [WTDB].[dbo].[cc_dossier_subsidized_traineds] AS doss" +
            " INNER JOIN [WTDB].[dbo].event_results AS evrs ON doss.student_id = evrs.person_id AND evrs.is_assist = 1" +
            " INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id AND evs.education_method_id IS NOT NULL" +
            " INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            " INNER JOIN [WTDB].[dbo].event_result_types AS evrts ON evrs.event_result_type_id = evrts.id" +
            " AND (UPPER(evrts.code) = UPPER('std_event_result') OR evrts.code IS NULL)" +
            " GROUP BY doss.id, evs.education_method_id, evrs.person_id, edms.name , doss.programs, doss.num_trainings;" +
            " " +
            " SELECT _view1.id, edm_name = STUFF (" +
            " (SELECT ';' + edm_name" +
            " FROM _view_dossier AS _view2" +
            " WHERE _view2.id = _view1.id" +
            " ORDER BY edm_name" +
            " FOR XML PATH ('')" +
            " ), 1, 1, '')," +
            " COUNT(_view1.id) as edm_count," +
            " _view1.programs as programs," +
            " _view1.doss_count," +
            " _view1.person_id" +
            " INTO _view_result" +
            " FROM _view_dossier _view1" +
            " GROUP BY _view1.id, programs, doss_count, person_id" +
            " HAVING doss_count < COUNT(_view1.id)" +
            " ORDER BY id; SELECT * FROM _view_result; DROP TABLE _view_dossier; DROP TABLE _view_result;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function getEducationMethodsFromDtRck() {
    try {
        sqlQuery = " SELECT doss.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , doss.programs, " +
            "   CASE WHEN doss.num_trainings IS NULL THEN 0 ELSE doss.num_trainings END AS doss_count " +
            " INTO _view_dossier" +
            " FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs] AS doss" +
            "   INNER JOIN [WTDB].[dbo].event_results AS evrs ON doss.student_id = evrs.person_id AND evrs.is_assist = 1" +
            "   INNER JOIN [WTDB].[dbo].event_result_types AS evrts ON evrs.event_result_type_id = evrts.id  AND evrts.code = 'rck org_event_result' " +
            "   INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id AND evs.education_method_id IS NOT NULL AND evs.status_id = 'close'" +
            "   INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            "   INNER JOIN [WTDB].[dbo].education_orgs AS edorgs ON evs.education_org_id = edorgs.id AND edorgs.code = '7'" +
            " GROUP BY doss.id, evs.education_method_id, evrs.person_id, edms.name , doss.programs, doss.num_trainings" +
            " " +
            " SELECT _view1.id, edm_name = STUFF (" +
            " (SELECT ';' + edm_name" +
            " FROM _view_dossier AS _view2" +
            " WHERE _view2.id = _view1.id" +
            " ORDER BY edm_name" +
            " FOR XML PATH ('')" +
            " ), 1, 1, '')," +
            " COUNT(_view1.id) as edm_count," +
            " _view1.programs as programs," +
            " _view1.doss_count," +
            " _view1.person_id" +
            " INTO _view_result" +
            " FROM _view_dossier _view1" +
            " GROUP BY _view1.id, programs, doss_count, person_id" +
            " HAVING doss_count < COUNT(_view1.id)" +
            " ORDER BY id; SELECT * FROM _view_result; DROP TABLE _view_dossier; DROP TABLE _view_result;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function updateDossierElement(result, isDossierExistKey) {
    dossierDoc = tools.open_doc(result.id);

    dossierDocTE = dossierDoc.TopElem;
    dossierDocTE.programs = result.edm_name;
    dossierDocTE.num_trainings = result.edm_count;

    dossierDoc.Save();

    collaboratorDoc = tools.open_doc(result.person_id);

    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey(isDossierExistKey).value = true;

    collaboratorDoc.Save();

    saved++;
}

var agentId = 7368463748813160933;
var userId = 7389518304440750773; // Websoft inner user
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();
var loggerName = "agent_7368463748813160933";

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;

try {
    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dtsResultArray = getEducationMethodsFromDts();
    dtsCount = ArrayCount(dtsResultArray);

    dtRckResultArray = getEducationMethodsFromDtRck();
    dtRckCount = ArrayCount(dtRckResultArray);

    total = dtsCount + dtRckCount;

    agent.total = total;
    agent.message = "Обработка данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] " + dtsCount + " dts, " + dtRckCount + " dtRck");

    if (total > 0) {
        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Expected time: " + getDurationMessage(total * msPerRecord)
        );
    }

    for (result in dtsResultArray) {
        processed++;

        updateDossierElement(result, "is_dossier_exist");

        if (processed % 100 == 0) {
            agent.processed = processed;
            agent.saved = saved;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    for (result in dtRckResultArray) {
        processed++;

        updateDossierElement(result, "is_dossier_rcc_exist");

        if (processed % 100 == 0) {
            agent.processed = processed;
            agent.saved = saved;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    agent.state = 1;
    agent.processed = processed;
    agent.saved = saved;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Сервер | Закончено. Продолжительность " + duration;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        "Total: " + total,
        " | " + "Processed: " + processed,
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