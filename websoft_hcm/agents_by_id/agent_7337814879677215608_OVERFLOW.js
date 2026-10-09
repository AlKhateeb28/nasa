// 7337814879677215608 ---
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function getRandom(min, max) {
    random = Random(min, max);

    if (random >= 1 && random <= 9) {
        return "0" + random
    }

    return random;
}

function getRandomDate() {
    return Date(getRandom(1, 28) + "." + getRandom(1, Month(Date()) - 1) + "." + toYear + " " + getRandom(0, 23) + ":" + getRandom(0, 59) + ":" + getRandom(0, 59));
}

var agentId = 7337814879677215608;

var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7337814879677215608";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var overflowCount = Param.overflow_count;
if (overflowCount == "") {
    overflowCount = 0;
}

var fromYear = Param.from_year;
if (fromYear == "") {
    fromYear = 2026;
}

var fromWeek = Param.from_week;
if (fromWeek == "") {
    fromWeek = 0;
}

var toYear = Param.to_year;
if (toYear == "") {
    toYear = 2026;
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

            if (OptInt(fromWeek) != 0) {
                dataList = ArrayDirect(XQuery("sql: " +
                    " SELECT TOP " + overflowCount + " ls.id " +
                    " FROM[WTDB].[dbo].active_learnings AS ls " +
                    "   INNER JOIN[WTDB].[dbo].active_learning AS l ON ls.id = l.id " +
                    "   INNER JOIN[WTDB].[dbo].courses AS cs ON ls.course_id = cs.id AND cs.code LIKE '%FCK-%' " +
                    " WHERE ls.state_id = 0 " +
                    "   AND YEAR(ls.start_usage_date) = " + fromYear +
                    "   AND DATEPART(week, ls.start_usage_date) = " + fromWeek));

                total += ArrayCount(dataList);

                agent.total = total;
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                for (data in dataList) {
                    activeLearningDoc = tools.open_doc(OptInt(data.id));

                    if (activeLearningDoc != null) {
                        activeLearningDocTE = activeLearningDoc.TopElem;                        

                        courseNewDatetime = getRandomDate();
                        startUsageDate = courseNewDatetime;
                        startLearningDate = Date(
                            StrDate(DateOffset(startUsageDate, 86400 * 3), false, false) + " " + getRandom(0, 23) + ":" + getRandom(0, 59) + ":" + getRandom(0, 59)
                        );
                        lastUsageDate = DateOffset(startLearningDate, 3600);

                        activeLearningDocTE.custom_elems.ObtainChildByKey("start_usage_date").value = activeLearningDocTE.start_usage_date;

                        activeLearningDocTE.state_id = 1;
                        activeLearningDocTE.start_usage_date = courseNewDatetime; 
                        activeLearningDocTE.start_learning_date = startLearningDate;
                        activeLearningDocTE.last_usage_date = lastUsageDate;

                        if (ArrayCount(activeLearningDocTE.parts) > 0) {
                            activeLearningDocTE.parts[0].state_id = 1;
                            activeLearningDocTE.parts[0].start_usage_date = startUsageDate;
                            activeLearningDocTE.parts[0].last_usage_date = lastUsageDate;
                            activeLearningDocTE.parts[0].time = 3600000;
                        }

                        addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + data.id + " Date: " + courseNewDatetime);

                        activeLearningDoc.Save();

                        saved++;

                        ArrayDirect(XQuery("sql: " +
                            " UPDATE [WTDB].[dbo].active_learnings " +
                            "       SET overflow = 1 " +                            
                            " WHERE id = " + data.id));
                    } else {
                        skipped++;
                    }

                    processed++;

                    agent.processed = processed;
                    agent.saved = saved;
                    agent.skipped = skipped;
                    agent.message = " Обработка данных...";
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
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Не указан номер недели");
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