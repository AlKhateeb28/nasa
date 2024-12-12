// 7426368837381915396
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function hasMethodId(education_method_id, qualification_id, qualificationArray) {
    for(qualificationTE in qualificationArray) {
        if(qualificationTE.id == qualification_id) {
            return qualificationTE.education_methods.GetOptChildByKey(education_method_id) != undefined;
        }
    }

    return false;
}

if (LdsIsServer) {
    var agentId = 7426368837381915396;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7426368837381915396";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

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
        qualificationList = ArrayDirect(XQuery("sql: " +
            " SELECT id " +
            "FROM [WTDB].[dbo].qualifications " +
            "WHERE code LIKE 'kval%' "));

        qualificationArray = [];

        for(qualification in qualificationList) {
            qualificationDoc = tools.open_doc(qualification.id);

            if(qualificationDoc != undefined) {
                qualificationArray.push(qualificationDoc.TopElem);
            }
        }

        eventResultList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.id AS education_method_id, qas.id AS qualification_assignments_id, qas.qualification_id AS qualification_id, " +
                    " ems.name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "    INNER JOIN [WTDB].[dbo].qualification_assignments qas ON ers.person_id = qas.person_id " +
            " WHERE es.status_id = 'close' "));

        total = ArrayCount(eventResultList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (eventResult in eventResultList) {
            qualificationDoc = tools.open_doc(eventResult.qualification_id);

            if(qualificationDoc != undefined) {
                if(hasMethodId(eventResult.education_method_id, eventResult.qualification_id, qualificationArray)) {
                    qualificationAssignmentDoc = tools.open_doc(eventResult.qualification_assignments_id);

                    if(qualificationAssignmentDoc != undefined) {
                        qualificationAssignmentDocTE = qualificationAssignmentDoc.TopElem;
                        if(qualificationAssignmentDocTE.education_methods.GetOptChildByKey(eventResult.education_method_id) == undefined) {
                            qualificationAssignmentDocTE.education_methods.ObtainChildByKey(eventResult.education_method_id);

                            qualificationAssignmentDoc.Save();

                            saved++;
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "]  NO Education method " + eventResult.name);
                        }
                    } else {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] qualificationAssignment with ID " + eventResult.qualification_assignments_id + " not exist!");

                        skipped++;
                    }
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Qualification with ID " + eventResult.qualification_id + " not exist!");

                skipped++;
            }


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
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }
        }

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

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}