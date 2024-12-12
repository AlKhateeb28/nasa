// 7382565057229631525
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function saveEventsAndEventResults(id) {
    collaboratorDoc = tools.open_doc(id);
    collaboratorDocTE = collaboratorDoc.TopElem;

    eventResultList = ArrayDirect(XQuery("sql:" +
        " SELECT evrs.id, evrs.event_id, evrs.person_id" +
        " FROM [WTDB].[dbo].event_results AS evrs" +
        " WHERE evrs.person_id = " + collaboratorDocTE.id));

    printed =false;

    for (eventResult in eventResultList) {
        isSaved = false;

        eventResultDoc = tools.open_doc(eventResult.id);

        if (eventResultDoc != undefined) {
            eventResultDocTE = eventResultDoc.TopElem;

            if (StrUpperCase(eventResultDocTE.person_fullname) != StrUpperCase(collaboratorDocTE.fullname)) {
                if(!printed) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] ----------");
                    printed = true;
                }

                addLogMessage(loggerName, "[agent.id: " + agentId + "] EVENT_RESULT.ID " + eventResultDocTE.id +
                    " FROM=" + eventResultDocTE.person_fullname + "= TO=" + collaboratorDocTE.fullname + "=");

                eventResultDocTE.person_fullname = collaboratorDocTE.fullname
                eventResultDoc.Save();

                isSaved = true;
            }
        } else {
            skipped++;

            addLogMessage(loggerName, "[agent.id: " + agentId + "] Event result with ID " + eventResult.id + " not exist");
        }

        if(isSaved) {
            saved++;
        }
    }

    return { saved: saved, skipped: skipped };
}

if (LdsIsServer ) {
    var agentId = 7382565057229631525;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = Date();
    var loggerName = "aa_agent_" + agentId;
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    agent.message = "Получение данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        collaboratorList = ArrayDirect(XQuery("sql:" +
            " SELECT colls.id" +
            " FROM [WTDB].[dbo].collaborators AS colls" +
            " WHERE colls.code LIKE '%rck_muc%'"));

        collaboratorCount = ArrayCount(collaboratorList);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborators: " + collaboratorCount);

        groupCollaboratorList = ArrayDirect(XQuery("sql:" +
            " SELECT colls.id" +
            " FROM [WTDB].[dbo].groups AS grs" +
            " INNER JOIN [WTDB].[dbo].[group] AS gr ON grs.id = gr.id" +
            " INNER JOIN [WTDB].[dbo].collaborators AS colls ON colls.id = gr.data.value('(group/collaborators/collaborator)[1]/collaborator_id[1]', 'varchar(max)')" +
            "   AND colls.code LIKE '%rck_muc%'"));

        groupCount = ArrayCount(groupCollaboratorList);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Groups: " + groupCount);

        var processed = 0;
        var saved = 0;
        var skipped = 0;
        var total = collaboratorCount + groupCount;

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.refreshChart = 1;
        agent.message = "Обработка данных сотрудников ...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ---------- COLLABORATORS");

        for (collaborator in collaboratorList) {
            result = saveEventsAndEventResults(collaborator.id);

            skipped = result.skipped;
            saved = result.saved;

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, processed);
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

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ---------- GROUPS");

        agent.message = "Обработка данных групп ...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        for (collaborator in groupCollaboratorList) {
            result = saveEventsAndEventResults(collaborator.id);

            skipped = result.skipped;
            saved = result.saved;

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, processed);
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

        addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            total + " total, ",
            processed + " processed, ",
            saved + " saved, ",
            skipped + " skipped"
        );

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, processed);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        saveMonitorAgents(agent, startDate);
    } catch (e) {
        agent.state = 2;
        agent.message = "Ошибка";
        agent.errorMessage = e;
        if (ws != null) {
            sendMessageToWebsocket(ws, agent);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        saveMonitorAgents(agent, startDate);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}