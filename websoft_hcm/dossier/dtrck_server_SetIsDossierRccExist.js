// 7370992874327654964
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer ) {
    var startDate = Date();
    var prevDate = Date();
    var loggerName = "agent_7370992874327654964";
    var agentId = 7370992874327654964;
    var userId = curUserID;
    var processed = 0;
    var notFound = 0;
    var saved = 0;
    var msPerRecord = 0.041;

    var ws = getWebsocketClient();
    var agent = agent = getAgentInstance(agentId, userId, loggerName);

    try {
        agent.message = "Обрабатывается...";
        ws = sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

        try {
            var resultArray = ArrayDirect(XQuery("sql:" +
                "SELECT student_id" +
                " FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs] "));
            var total = ArrayCount(resultArray);

            agent.total = total;
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            ws = sendMessageToWebsocket(ws, agent);
            prevDate = Date();

            if (total > 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + total + " total, Expected time: " + getDurationMessage(total * msPerRecord)
                );
            }

            for (result in resultArray) {
                collaborator = tools.open_doc(result.student_id);

                if (collaborator != undefined) {
                    saved++;

                    collaborator.TopElem.custom_elems.ObtainChildByKey("is_dossier_rcc_exist").value = true;

                    collaborator.Save();
                } else {
                    notFound++;

                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] WARNING | Collaborator.id: " + result.student_id + " not found."
                    );
                }

                processed++;

                if (processed % 100 == 0) {
                    agent.processed = processed;
                    agent.saved = saved;
                    agent.notFound = notFound;
                    refreshMsPerRow(agent, startDate, processed);
                    ws = sendMessageToWebsocket(ws, agent);
                }
                if (processed % 1000 == 0) {
                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] " + processed + " processed, " + saved + " saved, " + notFound + " not found, remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                    );
                }
            }

            addLogResultMessage(
                loggerName,
                "[agent.id: " + agentId + "]",
                total + " total, ",
                processed + " processed, ",
                saved + " saved, ",
                notFound + " not found"
            );

            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
            );

            duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
            agent.state = 1;
            agent.processed = processed;
            agent.saved = saved;
            agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.notFound = notFound;
            refreshMsPerRow(agent, startDate, processed);
            agent.message = "Закончено. Продолжительность " + duration;
            ws = sendMessageToWebsocket(ws, agent);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
        } catch (e) {
            agent.state = 2;
            agent.errorMessage = e;
            sendMessageToWebsocket(ws, agent);

            throw new Error(e);
        }
    } catch (e) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        alert("ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}