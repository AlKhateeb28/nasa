// 7221362066420380055
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7221362066420380055;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7221362066420380055";
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
    topRecordsDirective = "";

    deleteCount = Param.delete_count;

    if(deleteCount != "" && OptInt(deleteCount) > 0) {
        topRecordsDirective = "TOP " + deleteCount;
    }

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT " + topRecordsDirective + " als.person_id, " +
        "       als.course_id, " +
        "       als.active_learning_id, " +
        "       COUNT(*) AS count, " +
        "       MIN(als.last_usage_date) AS last_usage_date " +
        " FROM [WTDB].[dbo].learnings als " +
        " GROUP BY als.person_id, " +
        "         als.course_id, " +
        "         als.active_learning_id " +
        " HAVING COUNT(*) > 1 " +
        " ORDER BY last_usage_date DESC"));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        isDeleted = false;

        duplicateCoursesData = ArrayDirect(XQuery("sql: " +
            " SELECT als.id, " +
            "       als.person_id, " +
            "       als.course_id, " +
            "       als.active_learning_id, " +
            "       als.last_usage_date " +
            " FROM [WTDB].[dbo].learnings als " +
            " WHERE als.person_id = " + data.person_id +
            "        AND als.course_id = " + data.course_id +
            "        AND als.active_learning_id = " + data.active_learning_id));

        if(ArrayCount(duplicateCoursesData) == OptInt(data.count)) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] --------");

            // DELETE COURSE'S DUPLICATES
            for(i = 1; i < ArrayCount(duplicateCoursesData); i++) {
                DeleteDoc(UrlFromDocID(OptInt(duplicateCoursesData[i].id)));

                isDeleted = true;

                // DELETE CERTIFICATE'S DUPLICATES
                duplicateCertificatesData = ArrayDirect(XQuery("sql: " +
                    " SET DATEFORMAT dmy; " +
                    " DECLARE " + "@cert_date datetime = '" + Date(duplicateCoursesData[i].last_usage_date) + "'; " +
                    " DECLARE " + "@from datetime = DATEADD(MINUTE, -1, @cert_date); " +
                    " DECLARE " + "@to datetime = DATEADD(MINUTE, 1, @cert_date); " +
                    "SELECT cs.id, " +
                    "       cs.delivery_date " +
                    "FROM [WTDB].[dbo].certificates cs " +
                    "         INNER JOIN [WTDB].[dbo].certificate c ON cs.id = c.id " +
                    "WHERE cs.person_id = " +  duplicateCoursesData[i].person_id +
                    "    AND c.data.value('(//custom_elems/custom_elem[name=''course_id''])[1]/value[1]', 'bigint') = " +  duplicateCoursesData[i].course_id +
                    "    AND type_id = 7015457522352069961 " +
                    "    AND cs.delivery_date BETWEEN @from AND @to "));

                step = 0;
                for(j = 1; j < ArrayCount(duplicateCertificatesData); j++) {
                    DeleteDoc(UrlFromDocID(OptInt(duplicateCertificatesData[j].id)));

                    isDeleted = true;
                    step++;
                }

                addLogMessage(loggerName, "[agent.id: " + agentId + "] SERT Deleted: " + step);
            }

            if(isDeleted) {
                saved++;
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong duplicate learning. Expected: " + data.count + " Found: " + ArrayCount(duplicateCoursesData));

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
