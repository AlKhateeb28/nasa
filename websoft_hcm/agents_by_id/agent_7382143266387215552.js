// 7382143266387215552
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}


var url = "E:/Websoft/Reports/report_event_result/report_broken_links_" + ParseDate(Date()) + ".xlsx";
var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

var agentId = 7382143266387215552;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();
var loggerName = "aa_agent_" + agentId;
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

agent.message = "Получение данных...";
prevDate = new Date();
if (ws != null) {
    ws = sendMessageToWebsocket(ws, agent);
}

try {
    eventResultsList = ArrayDirect(XQuery("sql:" +
        " SELECT evrs.id, evrs.event_result_type_id, colls.id AS colls_id, evs.id AS evs_id" +
        " FROM [WTDB].[dbo].event_results evrs" +
        " LEFT OUTER JOIN [WTDB].[dbo].collaborators colls ON colls.id = evrs.person_id" +
        " LEFT OUTER JOIN [WTDB].[dbo].events evs ON evs.id = evrs.event_id" +
        " WHERE colls.id IS NULL OR evs.id IS NULL"));

    processed = 0;
    deleted = 0;
    skipped = 0;
    total = ArrayCount(eventResultsList);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.refreshChart = 1;
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    isSaveFile = false;

    reportString.AppendStr("<html><table border='1'>");
    reportString.AppendStr(
        "<tr>" +
        "<td>Result ID</td>" +
        "<td>Person ID</td>" +
        "<td>Event ID</td>" +
        "</tr>");

    for (eventResult in eventResultsList) {
        eventResultDoc = tools.open_doc(eventResult.id);

        if (eventResult.id != undefined) {
            eventResultDocTE = eventResultDoc.TopElem;

            if(eventResultDocTE.event_result_type_id != 6849424221936501895) {
                DeleteDoc(UrlFromDocID(eventResult.id));

                deleted++;
                saved++;
            } else {
                // Add to file
                isSaveFile = true;

                skipped++;

                reportString.AppendStr(
                    "<tr>" +
                    "<td>'" + eventResult.id + "</td>" +
                    "<td>'" + eventResult.colls_id + "</td>" +
                    "<td>'" + eventResult.evs_id + "</td>" +
                    "</tr>");
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] EventResult with ID " + eventResult.id + " not exist");
            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.saved = saved;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
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
        deleted + " deleted, ",
        skipped + " skipped"
    );

    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);

    if(isSaveFile) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Сохранение файла " + url + " ...");
        agent.processed = processed;
        agent.skipped = skipped;
        agent.message = "Сохранение файла...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("</table></html>");

        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs(url);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Файл сохранен.");

        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Файл не сохранялся.");
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

    agent.state = 1;
    agent.processed = processed;
    agent.skipped = skipped;
    refreshMsPerRow(agent, startDate, total);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Закончено. Продолжительность " + duration;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
} catch (e) {
    agent.state = 2;
    agent.message = "Ошибка";
    agent.errorMessage = e;
    if (ws != null) {
        sendMessageToWebsocket(ws, agent);
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
