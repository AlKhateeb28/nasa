// 7287905423581988190
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

var agentId = 7287905423581988190;
var loggerName = "agent_7287905423581988190";

try {
    var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");

    var startDate = Date();
    var prevDate;    

    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    var processed = 0;

    excelDoc = tools.get_object_assembly("Excel");
    excelDoc.Open("e:/Websoft/WebSoftServer/wt/web/trash/mailing_24-26_VT_IBP.xlsx");

    excelWorksheet = excelDoc.GetWorksheet(0);

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    isProcessing = true;
    currentRow = 2;
    notificated = 0;

    cells = excelWorksheet.Cells;

    while (isProcessing) {
        if (!isProcessing) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BREAK. Processing is false");

            break;
        }

        if (notificated == 50) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BREAK. Notificated = 50");

            break;
        }

        if (cells.GetCell("A" + currentRow).Value == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BREAK. Cell A is undefined");

            break;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Cell A is NOT undefined");

            cellA = cells.GetCell("A" + currentRow);
            cellB = cells.GetCell("B" + currentRow);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] CurrentRow: " + currentRow + " B is undefined: " + (cellB.Value == undefined));

            if (cellB.Value == undefined) {
                dataList = ArrayDirect(XQuery("sql: " +
                    " SELECT id " +
                    " FROM[WTDB].[dbo].collaborators " +
                    " WHERE email = '" + cellA.Value + "' "));

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Person found: " + ArrayCount(dataList));

                if (ArrayCount(dataList) > 0) {
                    tools.create_notification("mailing_24-26_vt_ibp", OptInt(dataList[0].id), "");

                    cellB.Value = "1";

                    notificated++;
                } else {
                    cellB.Value = "-1";
                }                
            }

            processed++;
            currentRow++;

            agent.processed = processed;

            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            if (processed > 10000) {
                isProcessing = false;
            }
        }
    }

    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Сохраняем Excel файл...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    // SAVE EXCEL FILE     
    if (notificated > 0) {
        try {
            excelDoc.Save();
        } catch (e) {
            throw new Error("Возможно файл открыт другим процессом!");
        }
    }

    agent.state = 1;
    agent.processed = processed;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed",
        null,
        null
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
} catch (e) { }
