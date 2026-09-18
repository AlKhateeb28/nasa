// 7325009016076074521
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function normalize(value) {
    if (value == "false") {
        return "Нет";
    } else {
        return "Да";
    }
}

var agentId = 7325009016076074521;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7325009016076074521";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;

var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " IF OBJECT_ID('tempdb..#learnings') IS NOT NULL " +
        "       DROP TABLE #learnings; " +
        " " +
        " SELECT cs.id, " +
        "       MAX(ls.last_usage_date) AS last_date, " +
        "       COUNT(cs.id) AS count " +
        " INTO #learnings " +
        "     FROM[WTDB].[dbo].learnings ls " +
        "         INNER JOIN[WTDB].[dbo].courses cos ON ls.course_id = cos.id AND UPPER(cos.code) LIKE UPPER('%" + Param.code + "%') " +
        "         INNER JOIN[WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        " WHERE ls.state_id > 0 " +
        "         AND YEAR(ls.start_usage_date) >= 2025 " +
        " GROUP BY cs.id; " +
        " " +
        " SELECT _view.*, " +
        "       cs.fullname AS fullname, " +
        "       cs.email AS email, " +
        "       os.code AS inn, " +
        "       os.name AS org_name, " +
        "       rs.name AS region_name, " +
        "       o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') AS in_program, " +
        "       o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part " +
        " FROM #learnings AS _view " +
        "       INNER JOIN[WTDB].[dbo].collaborators cs ON _view.id = cs.id " +
        "       INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "       INNER JOIN[WTDB].[dbo].org o ON os.id = o.id " +
        "           AND IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) = 0 " +
        "           AND IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) = 0 " +
        "       INNER JOIN[WTDB].[dbo].regions AS rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rs.id; " +
        " " +        
        " IF OBJECT_ID('tempdb..#learnings') IS NOT NULL " +
        "       DROP TABLE #learnings; "));

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
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");    
    reportString.AppendStr("<td class='header'>ФИО</td>");
    reportString.AppendStr("<td class='header'>Email</td>");
    reportString.AppendStr("<td class='header'>Пройдено курсов</td>");
    reportString.AppendStr("<td class='header'>Код организации</td>");
    reportString.AppendStr("<td class='header' style='width: 500px;'>Название организации</td>");
    reportString.AppendStr("<td class='header'>Дата последнего обучения</td>");
    reportString.AppendStr("<td class='header'>Фактический регион</td>");
    reportString.AppendStr("<td class='header'>В программе</td>");
    reportString.AppendStr("<td class='header'>Тип поддержки</td>");
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr(
            "<tr>" +            
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.email + "</td>" +
            "<td>" + data.count + "</td>" +
            "<td>" + data.inn + "</td>" +
            "<td>" + data.org_name + "</td>" +            
            "<td>" + data.last_date + "</td>" +
            "<td>" + data.region_name + "</td>" +
            "<td>" + normalize(data.in_program) + "</td>" +
            "<td>" + data.format_part + "</td>" +
            "</tr>");

        processed++;

        agent.processed = processed;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Сохраняем Excel файл...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    // SAVE EXCEL FILE
    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    excel.SaveAs("E:/Websoft/Reports/trash/learnings_" + Param.code + "_" + ParseDate(Date()) + ".xlsx");

    agent.state = 1;
    agent.processed = processed;
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