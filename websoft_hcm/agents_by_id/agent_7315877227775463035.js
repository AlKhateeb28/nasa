// 7315877227775463035
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function normalize(value) {
    if (value == "false") {
        return "Нет";
    } else {
        return "Да";
    }
}

function getSecondsFromLatency(latency) {
    if (latency == "") {
        return 0;
    }

    years = "0";
    months = "0";
    days = "0";
    hours = "0";
    minutes = "0";
    seconds = "0";

    latency = StrReplace(latency, "P", "");
    latency = StrReplace(latency, "T", "");
    latency = StrReplace(latency, "-", "");

    mCount = ArrayCount(latency.split("M"));

    isMonth = false;
    isMinute = false;

    value = "";

    for (char in StrToCharArray(latency)) {
        if (char == "Y") {
            years = value;

            value = "";

            continue;
        }

        if (char == "M") {
            if (mCount == 3) {
                if (!isMonth) {
                    isMonth = true;
                    months = value;

                    value = "";

                    continue;
                }

                if (isMonth && !isMinute) {
                    isMinute = true;
                    minutes = value;

                    value = "";

                    continue;
                }

            } else if (mCount == 2) {
                minutes = value;

                value = "";

                continue;
            }
        }

        if (char == "D") {
            days = value;

            value = "";

            continue;
        }

        if (char == "H") {
            hours = value;

            value = "";

            continue;
        }

        if (char == "S") {
            seconds = value;

            value = "";

            continue;
        }
        value += char;
    }

    if (StrContains(seconds, ".")) {
        part = seconds.split(".");

        seconds = part[0];

    }

    lat = "*-" + months + "-*-" + days + "-*-" + hours + "-*-" + minutes + "-*-" + seconds;

    return (OptInt(years) * 31104000) + (OptInt(months) * 2592000) + (OptInt(days) * 86400) + (OptInt(hours) * 3600) + (OptInt(minutes) * 60) + OptInt(seconds);
}

var id = 0;
var lat = "";

var agentId = 7315877227775463035;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7315877227775463035";
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
        " SELECT cs.fullname AS fullname, " +
        "       cs.email AS email, " +
        "       os.code AS inn, " +
        "       os.name AS org_name, " +
        "       ls.start_learning_date AS learning_date, " +
        "       ls.last_usage_date AS last_date, " +
        "       DATEDIFF(minute, ls.start_learning_date, ls.last_usage_date) AS duration, " +
        "       rs.name AS region_name, " +
        "       o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') AS in_program, " +
        "       o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part, " +
        "       cos.code AS course_code, " +
        "       cos.name AS course_name, " +
        "       ls.state_id, " +
        "       ls.score, " +
        "       ls.id " + 
        " FROM[WTDB].[dbo].learnings ls " +
        "       INNER JOIN[WTDB].[dbo].courses cos ON ls.course_id = cos.id " +
        "       INNER JOIN[WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "       INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "       INNER JOIN[WTDB].[dbo].org o ON os.id = o.id " +
        "           AND  o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') != '' " +
        "       INNER JOIN[WTDB].[dbo].regions AS rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        " WHERE YEAR(ls.start_usage_date) >= 2026 "));

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
    reportString.AppendStr("<td class='header'>Код курса</td>");
    reportString.AppendStr("<td class='header'>Название курса</td>");
    reportString.AppendStr("<td class='header'>ФИО</td>");
    reportString.AppendStr("<td class='header'>Email</td>");
    reportString.AppendStr("<td class='header'>Код организации</td>");
    reportString.AppendStr("<td class='header' style='width: 500px;'>Название организации</td>");
    reportString.AppendStr("<td class='header'>Дата начала обучения</td>");
    reportString.AppendStr("<td class='header'>Дата последнего обучения</td>");
    reportString.AppendStr("<td class='header'>Время прохождения (мин)</td>");
    reportString.AppendStr("<td class='header'>Суммарная задержка (сек)</td>");
    reportString.AppendStr("<td class='header'>Баллы</td>");    
    reportString.AppendStr("<td class='header'>Код статуса</td>");
    reportString.AppendStr("<td class='header'>Фактический регион</td>");
    reportString.AppendStr("<td class='header'>В программе</td>");
    reportString.AppendStr("<td class='header'>Тип поддержки</td>");
    reportString.AppendStr("<td class='header'>ID завершенного курса</td>");
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        learningDoc = tools.open_doc(OptInt(data.id));

        id = data.id;

        latency = 0;

        if (learningDoc != undefined) {
            learningDocTE = learningDoc.TopElem;

            for (part in learningDocTE.parts) {
                for (interaction in part.interactions) {
                    if (interaction.latency != undefined) {
                        latency += getSecondsFromLatency(interaction.latency);
                    }
                }
            }
        }

        reportString.AppendStr(
            "<tr>" +
            "<td>" + data.course_code + "</td>" +
            "<td>" + data.course_name + "</td>" +
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.email + "</td>" +
            "<td>" + data.inn + "</td>" +
            "<td>" + data.org_name + "</td>" +
            "<td>" + data.learning_date + "</td>" +
            "<td>" + data.last_date + "</td>" +
            "<td>" + data.duration + "</td>" +
            "<td>" + latency + "</td>" +
            "<td>" + data.score + "</td>" +            
            "<td>" + data.state_id + "</td>" +
            "<td>" + data.region_name + "</td>" +
            "<td>" + normalize(data.in_program) + "</td>" +
            "<td>" + data.format_part + "</td>" +
            "<td>'" + data.id + "</td>" +
            
            "</tr>");

        processed++;

        if (processed % 100 == 0) {
            agent.processed = processed;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            Sleep(100);
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
    excel.SaveAs("E:/Websoft/Reports/trash/rapid_passing_" + ParseDate(Date()) + ".xlsx");

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

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + id);
    addLogMessage(loggerName, "[agent.id: " + agentId + "] LAT: " + lat);
    
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) { }