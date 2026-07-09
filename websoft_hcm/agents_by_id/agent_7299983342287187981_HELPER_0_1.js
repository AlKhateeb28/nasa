// 7299983342287187981
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

var agentId = 7299983342287187981;

var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7299983342287187981";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

flags = [
    {
        property: "in_program",
        parentFlag: "inProgram"
    },
    {
        property: "is_fcc",
        parentFlag: "isFcc"
    },
    {
        property: "is_rck",
        parentFlag: "isRck"
    },
    {
        property: "is_ock",
        parentFlag: "isOck"
    },
    {
        property: "is_roiv",
        parentFlag: "isRoiv"
    },
    {
        property: "is_partner",
        parentFlag: "isPartner"
    },
    {
        property: "is_a_commerce_client",
        parentFlag: "isCommerce"
    },
    {
        property: "is_project_ended",
        parentFlag: "isProjectEnded"
    },
    {
        property: "With_no_right",
        parentFlag: "withNoRight"
    }
];

try {
    if (!isAgentRunning(agentId)) {
        if (!isAgentRunning(7300978396789946474)) { // Запущен ли УБЕРНАТОР
            prevPeriod = "";

            agentDoc = tools.open_doc(agentId);
            agentDocTE = agentDoc.TopElem;

            for (wvar in agentDocTE.wvars) {
                if (wvar.name == "processed_mode") {
                    if (wvar.value == "update" && agentDocTE.trigger_type != "never") {
                        prevPeriod = agentDocTE.period;

                        agentDocTE.period = "300";

                        agentDoc.Save();
                    }
                }
            }

            var total = ArrayCount(flags);
            var processed = 0;
            var saved = 0;
            var skipped = 0;

            if (Param.processed_mode == "lookup") {
                agent.processed_mode = "lookup";
            } else {
                agent.processed_mode = "update";
            }

            agent.message = "Получение данных...";
            ws = sendMessageToWebsocket(ws, agent);
            prevDate = new Date();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

            step = 1;

            for (flag in flags) {
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Шаг " + step + " из " + ArrayCount(flags) + " Обработка данных " + flag.property + ". 0 в false...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                sql = "";
                flagCount = 0;

                if (Param.processed_mode == "lookup") {
                    sql = " WITH _view AS ( " +
                        "     SELECT cs.id " +
                        "     FROM [WTDB].[dbo].collaborators cs " +
                        "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
                        "     WHERE c.data.exist('//custom_elem[name=''" + flag.property + "'']/value[. = ''0'']') = 1 " +
                        " ) " +
                        " SELECT COUNT(id) AS count " +
                        " FROM _view ";
                } else {
                    sql = " UPDATE [WTDB].[dbo].collaborator " +
                        "   SET data.modify(' " +
                        "       replace value of " +
                        "           (//custom_elem[name=''" + flag.property + "'']/value/text())[1] " +
                        "       with ''false'' ') " +
                        " WHERE data.exist('//custom_elem[name=''" + flag.property + "'']/value[. = ''0'']') = 1; " +
                        " SELECT @@ROWCOUNT AS count";
                }

                execList = ArrayDirect(XQuery("sql: " +
                    sql));

                if (ArrayCount(execList) > 0) {
                    processed += execList[0].count;
                    flagCount += execList[0].count;
                }

                agent.processed = processed;
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Шаг " + step + " из " + ArrayCount(flags) + " Обработка данных " + flag.property + ". 1 в true...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                if (Param.processed_mode == "lookup") {
                    sql = " WITH _view AS ( " +
                        "     SELECT cs.id " +
                        "     FROM [WTDB].[dbo].collaborators cs " +
                        "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
                        "     WHERE c.data.exist('//custom_elem[name=''" + flag.property + "'']/value[. = ''1'']') = 1 " +
                        " ) " +
                        " SELECT COUNT(id) AS count " +
                        " FROM _view ";
                } else {
                    sql = " UPDATE [WTDB].[dbo].collaborator " +
                        "   SET data.modify(' " +
                        "       replace value of " +
                        "           (//custom_elem[name=''" + flag.property + "'']/value/text())[1] " +
                        "       with ''true'' ') " +
                        " WHERE data.exist('//custom_elem[name=''" + flag.property + "'']/value[. = ''1'']') = 1; " +
                        " SELECT @@ROWCOUNT AS count"
                }

                execList = ArrayDirect(XQuery("sql: " +
                    sql));

                if (ArrayCount(execList) > 0) {
                    processed += execList[0].count;
                    flagCount += execList[0].count;
                }

                eval("agent." + flag.parentFlag + " = " + flagCount);

                step++;

                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }

            agentDoc = tools.open_doc(agentId);
            agentDocTE = agentDoc.TopElem;

            for (wvar in agentDocTE.wvars) {
                if (wvar.name == "processed_mode") {
                    if (agentDocTE.trigger_type != "never" && processed > 0 && wvar.value == "lookup") {
                        wvar.value = "update";

                        agentDoc.Save();
                    } else if (wvar.value == "update") {
                        agentDocTE.period = prevPeriod;

                        wvar.value = "lookup";

                        agentDoc.Save();
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
            addLogMessage(loggerName, "[agent.id: " + agentId + "] УБЕРНАТОР agent is running. Waiting for the next time running!");

            agent.state = 1;
            agent.processed = 0;
            agent.saved = 0;
            agent.skipped = 0;
            agent.message = "Закончено. Работает УБЕРНАТОР. Ждем следующего запуска!";
            sendMessageToWebsocket(ws, agent);
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to be completed!");

        agent.state = 1;
        agent.processed = 0;
        agent.saved = 0;
        agent.skipped = 0;
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