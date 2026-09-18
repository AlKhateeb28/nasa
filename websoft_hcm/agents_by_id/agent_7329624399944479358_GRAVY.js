// 7329624399944479358
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function modifyYearOfDate(datetime) {
    datetimeAsString = StrDate(datetime);

    datetimeAsArray = datetimeAsString.split(" ");

    dateAsArray = datetimeAsArray[0].split(".");

    return Date(dateAsArray[0] + "." + dateAsArray[1] + "." + toYear + " " + datetimeAsArray[1]);
}

function createCertificate(personId, courseId, learningId, deliveryDate) {
    certificateDoc = tools.create_certificate_to_person(OptInt(personId), 7015457522352069961);

    certificateDoc.TopElem.serial = "ЭК";
    certificateDoc.TopElem.delivery_date = Date(deliveryDate);
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("course_id").value = courseId;
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("learning_id").value = learningId;
    certificateDoc.TopElem.doc_info.creation.date = deliveryDate;

    certificateDoc.Save();

    dataList = ArrayDirect(XQuery("sql: " +
        " UPDATE [WTDB].[dbo].certificates " +
        "       SET modification_date = CAST('" + deliveryDate + "' AS DATETIME) " +
        " WHERE id = " + certificateDoc.DocID));

    return certificateDoc.DocID;
}

var agentId = 7329624399944479358;

var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7329624399944479358";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var monthCount = Param.month_count;
if (monthCount == "") {
    monthCount = 0;
}

var fromYear = Param.from_year;
if (fromYear == "") {
    fromYear = 2026
}

var toYear = Param.to_year;
if (toYear == "") {
    toYear = 2026
}

if (LdsIsServer) {
    try {
        if (!isAgentRunning(agentId)) {
            var total = 0;
            var processed = 0;
            var skipped = 0;
            var saved = 0;

            agent.message = "Получение данных...";
            ws = sendMessageToWebsocket(ws, agent);
            prevDate = new Date();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

            for (month = 1; month <= Month(Date()); month++) {
                dataList = ArrayDirect(XQuery("sql: " +
                    " SELECT TOP " + monthCount + " ls.id, " +
                    "   ls.person_id, " +
                    "   ls.course_id, " +
                    "   ls.creation_date, " +
                    "   ls.modification_date, " +
                    "   ls.start_usage_date, " +
                    "   ls.start_learning_date, " +
                    "   ls.last_usage_date, " +
                    "   l.data.value('(//parts/part/start_usage_date)[1]', 'datetime') AS part_start_usage_date, " +
                    "   l.data.value('(//parts/part/last_usage_date)[1]', 'datetime') AS part_last_usage_date, " +
                    "   l.data.value('(//doc_info/creation/date)[1]', 'datetime') AS creation, " +
                    "   l.data.value('(//doc_info/modification/date)[1]', 'datetime') AS modification, " +
                    "   cs.max_score " +
                    " FROM [WTDB].[dbo].active_learnings AS ls " +
                    "   INNER JOIN [WTDB].[dbo].active_learning AS l ON ls.id = l.id " +
                    "   INNER JOIN [WTDB].[dbo].courses AS cs ON ls.course_id = cs.id AND cs.code LIKE '%FCK-%' " +
                    " WHERE ls.state_id = 1 " +
                    "   AND YEAR(ls.start_usage_date) = " + fromYear +
                    "   AND MONTH(ls.start_usage_date) = " + month +
                    "   AND DATEPART(week, ls.start_usage_date) < DATEPART(week, GETDATE()) "));

                total += ArrayCount(dataList);

                agent.total = total;
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                for (data in dataList) {
                    learningId = tools.active_learning_finish(OptInt(data.id));

                    learningDoc = tools.open_doc(OptInt(learningId));

                    if (learningDoc != null) {
                        learningDocTE = learningDoc.TopElem;

                        learningDocTE.state_id = 4;  
                        learningDocTE.last_usage_date = modifyYearOfDate(Date());
                        
                        learningDoc.Save();

                        saved++;

                        dataList = ArrayDirect(XQuery("sql: " +
                            " UPDATE [WTDB].[dbo].learnings " +
                            "       SET gravy = 1 " +
                            "           creation_date = CAST('" + modifyYearOfDate(Date()) + "' AS DATETIME), " +
                            "           modification_date = CAST('" + modifyYearOfDate(Date()) + "' AS DATETIME) " +
                            " WHERE id = " + learningId));

                        //certificateId = createCertificate(data.person_id, data.course_id, learningId, modifyYearOfDate(data.creation));                        
                        //addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate.ID: " + certificateId);
                    } else {
                        skipped++;
                    }

                    processed++;

                    agent.processed = processed;
                    agent.saved = saved;
                    agent.skipped = skipped;
                    agent.message = "Месяц: " + month + " Обработка данных...";
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
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to be completed!");

            agent.state = 1;
            agent.processed = 0;
            agent.saved = 0;
            agent.message = "Закончено. Работает предыдущий экземпляр агента!";
            sendMessageToWebsocket(ws, agent);
        }
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) { }
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}