// 7411465386805912985
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getDays(start, finish) {
    days = [];

    while(start <= finish) {
        days.push(start);
        start = DateOffset(start, 86400);
    }

    return days;
}

function getHour(date) {
    hour = Hour(date);

    if(StrCharCount(hour) == 1) {
        hour = "0" + hour;
    }

    return hour;
}

function getMinute(date) {
    minutes = Minute(date);

    return minutes;
}

var agentId = 7411465386805912985;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7411465386805912985";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

var fromDate = Param.fromDate == "" ? "01.01.2025 00:00:00" : Param.fromDate;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    eventList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy; " +
        " DECLARE " + "@fromDate datetime = '" + fromDate + "'; " +
        " DECLARE " + "@toDate datetime = '31.12.2099 23:55:55';" +
        " SELECT es.id " +
        " FROM [WTDB].[dbo].events es " +
        "       INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
        " WHERE es.start_date BETWEEN @fromDate AND @toDate " +
        "       AND e.data.value('(event/phases)[1]', 'varchar(max)') IS NULL " +
        "       AND e.data.value('(event/lectors)[1]', 'varchar(max)') IS NOT NULL" +
        "       AND (es.code LIKE 'week%' OR es.code LIKE 'fck_tren%') "));

    total = ArrayCount(eventList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (event in eventList) {
        eventDoc = tools.open_doc(event.id);

        if(eventDoc != undefined) {
            eventDocTE = eventDoc.TopElem;

            if(ArrayCount(eventDocTE.phases) == 0) {
                eventStartDate = eventDocTE.start_date;
                eventFinishDate = eventDocTE.finish_date;

                days = getDays(eventStartDate, eventFinishDate);

                for(lector in eventDocTE.lectors) {
                    factHours = eventDocTE.duration_fact;

                    for (day in days) {
                        phaseElement = eventDocTE.phases.AddChild("phase");

                        phaseElement.lector_id = lector.lector_id;

                        startHours = Hour(eventStartDate);

                        if(factHours <= 8) {
                            phaseElement.start_date = StrDate(day, false) + " " + startHours + ":00:00";
                            phaseElement.finish_date = StrDate(day, false) + " " + (startHours + factHours) + ":00:00";
                        } else {
                            phaseElement.start_date = StrDate(day, false) + " " + startHours + ":00:00";
                            phaseElement.finish_date = StrDate(day, false) + " " + (startHours + 8) + ":00:00";

                            factHours = factHours - 8;
                        }
                    }
                }

                eventDoc.Save();

                saved++;
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Event with ID " + event.id + " not exist!");
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 100 == 0) {
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
    refreshMsPerRow(agent, startDate, processed);
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