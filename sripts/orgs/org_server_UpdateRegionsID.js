// 7360638553163767265
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer ) {
    var agentId = 7360638553163767265;
    var userId = curUserID;
    var msPerRecord = 0.042;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "aa_agent_7360638553163767265";

    var total = 0;
    var processed = 0;
    var skipped = 0;
    var saved = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);

        resultArray = ArrayDirect(XQuery("sql:" +
            " SELECT orgs.id, orgs.region_id," +
            "   org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') AS fact_region_id " +
            " FROM orgs " +
            "   INNER JOIN [WTDB].[dbo].org ON orgs.id = org.id " +
            " WHERE orgs.region_id IS NOT NULL " +
            "    AND org.data.exist('(//custom_elems/custom_elem[name=''fact_region_id''])') = 1 " +
            "    AND org.data.exist('(//custom_elems/custom_elem[name=''report_region_id''])') = 0 "));

        total = ArrayCount(resultArray);

        agent.total = total;
        agent.message = "Обработка данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        if (total > 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Expected time: " + getDurationMessage(total * msPerRecord)
            );
        }

        for (result in resultArray) {
            if (result.region_id != null) {
                organizationDoc = tools.open_doc(result.id);

                if(organizationDoc != undefined) {
                    organizationDoc.TopElem.custom_elems.ObtainChildByKey("report_region_id").value = result.fact_region_id;

                    organizationDoc.Save();

                    saved++;
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + result.id + " is not exist!");
                }
            } else {
                // Empty region id
                skipped++;
            }

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.saved = saved;
                agent.skipped = skipped;
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

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Сервер | Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        if (ws != null) {
            sendMessageToWebsocket(ws, agent);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        saveMonitorAgents(agent, startDate);
    }

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok' );
}