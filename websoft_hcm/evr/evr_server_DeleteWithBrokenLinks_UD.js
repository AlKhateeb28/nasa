// 7016289963953509200
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if ( LdsIsServer ) {
    var agentId = 7016289963953509200;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = Date();
    var loggerName = "aa_agent_" + agentId;
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    agent.message = "Сервер | Получение данных...";
    prevDate = new Date();
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    sql_str = "sql: " +
        " SELECT event_results.id" +
        " FROM event_results" +
        " LEFT JOIN events ON event_results.event_id = events.id" +
        " WHERE events.id IS NULL";

    arr = XQuery( sql_str );
    arr_count = ArrayCount( arr );

    sql_str2 = "sql: " +
        " SELECT event_results.id" +
        " FROM event_results" +
        " LEFT JOIN collaborators ON event_results.person_id = collaborators.id" +
        " WHERE collaborators.id IS NULL";

    arr2 = XQuery( sql_str2 );
    arr_count2 = ArrayCount( arr2 );

    processed = 0;
    skipped = 0;
    total = arr_count + arr_count2;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.refreshChart = 1;
    agent.message = "Сервер | Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    _count = 0;
    for ( elem in arr ) {
        try {
            if(Param.isDelete) {
                DeleteDoc(UrlFromDocID(elem.id));
            }

            processed++;
            _count++;
        } catch ( er ) {
            skipped++;
        }

        if (processed % 100 == 0) {
            agent.processed = processed;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if (processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

   _count2 = 0;
    for ( elem2 in arr2 ) {
        try {
            if(Param.isDelete) {
                DeleteDoc(UrlFromDocID(elem2.id));
            }

            processed++;
            _count2++
        } catch ( er ) {
            skipped++;
        }

        if (processed % 100 == 0) {
            agent.processed = processed;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if (processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    agent.processed = processed;
    agent.skipped = skipped;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.refreshChart = 1;
    agent.message = "Сервер | Сохранение файла...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
        processed + " processed, ",
        null,
        skipped + " skipped"
    );

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

    agent.state = 1;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Сервер | Закончено. Продолжительность " + duration;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}