// 7302030574288336155
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

if (LdsIsServer) {
    try {
        var agentId = 7302030574288336155;
        var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7302030574288336155";
        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

        var total = 0;
        var processed = 0;
        var saved = 0;
        var skipped = 0;
        var notFound = 0;

        var excelDoc = tools.get_object_assembly("Excel");
        var reportString = new Binary();

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT os.id, " +
            "       os.name, " +
            "       os.code AS inn, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_fullname_1'']/value)[1]', 'varchar(max)') AS fullname_1, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_position_1'']/value)[1]', 'varchar(max)') AS position_1, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_email_1'']/value)[1]', 'varchar(max)') AS email_1, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_phone_1'']/value)[1]', 'varchar(max)') AS phone_1, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_fullname_2'']/value)[1]', 'varchar(max)') AS fullname_2, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_position_2'']/value)[1]', 'varchar(max)') AS position_2, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_email_2'']/value)[1]', 'varchar(max)') AS email_2, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''contact_phone_2'']/value)[1]', 'varchar(max)') AS phone_2 " +
            " FROM orgs os " +
            "     INNER JOIN org o ON os.id = o.id " +
            " WHERE o.data.exist('(//custom_elems/custom_elem[name=''contact_fullname_1''])') = 1 " +
            "     OR " +
            "       o.data.exist('(//custom_elems/custom_elem[name=''contact_fullname_2''])') = 1 "));

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("<html>");
        reportString.AppendStr("<style>");
        reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81);}");
        reportString.AppendStr(".row_height {height: 2px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='header' style='width: 250px;'>ФИО</td>");
        reportString.AppendStr("<td class='header' style='width: 300px;'>Должность</td>");
        reportString.AppendStr("<td class='header' style='width: 250px;'>Почта</td>");
        reportString.AppendStr("<td class='header' style='width: 250px;'>Контактный телефон</td>");
        reportString.AppendStr("<td class='header' style='width: 650px;'>Организация</td>");
        reportString.AppendStr("<td class='header' style='width: 140px;'>ИНН</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            if (data.fullname_1 != "" || data.position_1 != "" || data.email_1 != "" || data.phone_1 != "") {
                reportString.AppendStr(
                    "<tr>" +
                    "<td>" + data.fullname_1 + "</td>" +
                    "<td>" + data.position_1 + "</td>" +
                    "<td>" + data.email_1 + "</td>" +
                    "<td>" + data.phone_1 + "</td>" +
                    "<td>" + data.name + "</td>" +
                    "<td>" + data.inn + "</td>" +
                    "</tr>");
            }

            if (data.fullname_2 != "" || data.position_2 != "" || data.email_2 != "" || data.phone_2 != "") {
                reportString.AppendStr(
                    "<tr>" +
                    "<td>" + data.fullname_2 + "</td>" +
                    "<td>" + data.position_2 + "</td>" +
                    "<td>" + data.email_2 + "</td>" +
                    "<td>" + data.phone_2 + "</td>" +
                    "<td>" + data.name + "</td>" +
                    "<td>" + data.inn + "</td>" +
                    "</tr>");
            }

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            agent.notFound = notFound;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }

        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excelDoc.LoadHtmlString(reportString.GetStr(), "");
        try {
            excelDoc.SaveAs("E:/Websoft/Reports/trash/orgs_contacts_" + ParseDate(Date()) + ".xlsx");
        } catch (e) {
            throw new Error("Возможно файл открыт другим процессом!");
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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
    } catch (e) { }
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}