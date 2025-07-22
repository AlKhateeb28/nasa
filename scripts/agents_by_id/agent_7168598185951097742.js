// 7168598185951097742
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function setNotFinishedReminderDate(collaboratorId) {
    collaboratorDoc = tools.open_doc(collaboratorId);

    if(collaboratorDoc != undefined) {
        collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("not_finished_reminder").value = Date();

        collaboratorDoc.Save();

        saved++;
    }
}

function isScheduledDay(datetime) {
    if(WeekDay(datetime) >= 1 && WeekDay(datetime) < 6 && Hour(Date()) >=8 &&  Hour(Date()) < 18) {
        return true
    }

    return false;
}

function getNormalizedMessage(count) {
    if(count == 1) {
        return " незавершенный курс";
    } else {
        if(count > 1 && count <= 4) {
            return " незавершенных курса";
        } else {
            return " незавершенных курсов";
        }
    }
}

var agentId = 7168598185951097742;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7168598185951097742";
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
    dataList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy; " +
        " WITH _group_colls_view AS ( " +
        "    SELECT TOP 50 cs.id " +
        "    FROM [WTDB].[dbo].active_learnings als " +
        "             INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND UPPER(crs.code) LIKE '%FCK-%' " +
        "             INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id " +
        "             INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "                AND IIF(c.data.value('(//custom_elems/custom_elem[name=''not_finished_reminder'']/value)[1]', 'varchar(max)') IS NULL, " +
        "                        CAST ('01.01.2020' AS date), " +
        "                        CAST(c.data.value('(//custom_elems/custom_elem[name=''not_finished_reminder'']/value)[1]', 'varchar(max)') AS date)) < DATEADD(DAY,  -90 , GETDATE()) " +
        "        AND c.data.value('(collaborator/access/web_banned)[1]', 'varchar(max)') != 1 " +
        "    WHERE als.start_usage_date < DATEADD(DAY,  -14 , GETDATE()) " +
        "    GROUP BY cs.id " +
        " ) " +
        " SELECT cs.id AS coll_id, " +
        "       als.id course_id, " +
        "       crs.name AS course_name, " +
        "       colls.fullname, " +
        "       colls.email " +
        " FROM [WTDB].[dbo].active_learnings als " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND UPPER(crs.code) LIKE '%FCK-%' " +
        "         INNER JOIN _group_colls_view cs ON als.person_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].collaborators colls ON cs.id = colls.id " +
        "         INNER JOIN [WTDB].[dbo].collaborator c ON colls.id = c.id " +
        "                AND IIF(c.data.value('(//custom_elems/custom_elem[name=''not_finished_reminder'']/value)[1]', 'varchar(max)') IS NULL, " +
        "                        CAST ('01.01.2020' AS date), " +
        "                        CAST(c.data.value('(//custom_elems/custom_elem[name=''not_finished_reminder'']/value)[1]', 'varchar(max)') AS date)) < DATEADD(DAY,  -90 , GETDATE()) " +
        " WHERE als.start_usage_date < DATEADD(DAY,  -14 , GETDATE()) " +
        " ORDER BY coll_id "));

    total = ArrayCount(dataList);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Total: " + total);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    notificationCount = 0;
    currentPersonId = 0;
    personCoursesCount = 0;

    coursesLinks = new Binary();
    colobaratorList = new Binary();

    for (data in dataList) {
        if(currentPersonId == 0) {
            currentPersonId = data.coll_id;
        }

        if(data.coll_id != currentPersonId) {
            // SEND NOTIFICATION
            setNotFinishedReminderDate(currentPersonId);

            tools.create_notification("incomplete_course", OptInt(currentPersonId), coursesLinks.GetStr());

            colobaratorList.AppendStr("<div>" + dataList[processed - 1].fullname + " Email: " + dataList[processed - 1].email + " (" + currentPersonId + ") - " + personCoursesCount + getNormalizedMessage(personCoursesCount) + "</div>");

            notificationCount++;
            personCoursesCount = 0;

            currentPersonId = data.coll_id;

            coursesLinks = new Binary();
        }

        coursesLinks.AppendStr("<p><a href='https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/learning_proc?object_id=" + data.course_id + "' target='_blank'>" + data.course_name + "</a></p>");

        personCoursesCount++;
        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    if(total > 0) {
        // SEND NOTIFICATION FOR LAST COLLABORATOR
        setNotFinishedReminderDate(currentPersonId);

        tools.create_notification("incomplete_course", OptInt(currentPersonId), coursesLinks.GetStr());

        notificationCount++;

        colobaratorList.AppendStr("<div>" + dataList[total - 1].fullname + " Email: " + dataList[total - 1].email + " (" + dataList[total - 1].coll_id + ") - " + personCoursesCount + getNormalizedMessage(personCoursesCount) + "</div>");

        if(Param.send_notification_to_admin != '' && OptInt(Param.send_notification_to_admin) == 1 && isScheduledDay(Date())) {
            notificationMessage = "<p><b>Отправлено " + notificationCount + " сообщений сотрудниркам о незавершенных курсах</b></p>" + colobaratorList.GetStr();

            tools.create_notification("find_incomplete_course", 7351734047845980789, notificationMessage); // AA
            tools.create_notification("find_incomplete_course", 6743923349751162819, notificationMessage); // FK
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

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
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
