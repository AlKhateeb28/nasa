<%
// 7312691335872272387
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function getAvailableTypesAsString(dossierDocTE) {
    typeValue = "";

    if (dossierDocTE.is_rck_intership) {
        typeValue += "РП РЦК стажировка в ФЦК, ";
    }
    if (dossierDocTE.is_rck_alone) {
        typeValue += "РП РЦК самостоятельно, ";
    }
    if (dossierDocTE.is_rck_trainer) {
        typeValue += "Тренер РЦК, ";
    }
    if (dossierDocTE.is_rck_fck_cert) {
        typeValue += "Сертификация тренера РЦК в ФЦК, ";
    }
    if (dossierDocTE.is_ock_ss) {
        typeValue += "Соц.сфера_ОЦК_РП, ";
    }
    if (dossierDocTE.is_ock_ss_analyst) {
        typeValue += "Соц.сфера_ОЦК_Аналитик-методолог, ";
    }
    if (dossierDocTE.is_ock_ss_trainer) {
        typeValue += "Соц.сфера_ОЦК_Тренер, ";
    }
    if (dossierDocTE.is_ock_bno) {
        typeValue += "БНО_ОЦК_РП, ";
    }
    if (dossierDocTE.is_ock_bno_analyst) {
        typeValue += "БНО_ОЦК_Аналитик-методолог, ";
    }
    if (dossierDocTE.is_ock_bno_trainer) {
        typeValue += "БНО_ОЦК_Тренер, ";
    }
    if (dossierDocTE.is_ock_ss_rp_alone) {
        typeValue += "Соц.сфера_ОЦК_РП самостоятельно, ";
    }
    if (dossierDocTE.is_ock_ss_analyst_alone) {
        typeValue += "Соц.сфера_ОЦК_Аналитик-методолог самостоятельно, ";
    }
    if (dossierDocTE.is_ock_ss_trainer_alone) {
        typeValue += "Соц.сфера_ОЦК_Тренер самостоятельно, ";
    }
    if (dossierDocTE.is_ock_bno_rp_alone) {
        typeValue += "БНО_ОЦК_РП самостоятельно, ";
    }
    if (dossierDocTE.is_ock_bno_analyst_alone) {
        typeValue += "БНО_ОЦК_Аналитик-методолог самостоятельно, ";
    }
    if (dossierDocTE.is_ock_bno_trainer_alone) {
        typeValue += "БНО_ОЦК_Тренер самостоятельно, ";
    }
    if (dossierDocTE.is_rck_trainer_soc) {
        typeValue += "Тренер РЦК для соц.сферы, ";
    }

    if (StrCharCount(typeValue) > 0) {
        typeValue = StrCharRangePos(typeValue, 0, StrCharCount(typeValue) - 2);
    }

    return typeValue;
}

function getRckOckNames(isRcc, isOckSS, isOckBNO) {
    result = "";

    if (OptInt(isRcc) == 1) {
        result += "РЦК,";
    }

    if (OptInt(isOckSS) == 1) {
        result += "ОЦК_Соц.сфера,";
    }

    if (OptInt(isOckBNO) == 1) {
        result += "ОЦК_БНО,";
    }

    if (StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getWaveNames(personId) {
    result = "";

    groupList = ArrayDirect(XQuery("sql: " +
        " SELECT gcs.group_id " +
        " FROM [WTDB].[dbo].group_collaborators gcs " +
        "         LEFT JOIN [WTDB].[dbo].collaborators cs ON gcs.collaborator_id = cs.id " +
        " WHERE cs.id = " + personId +
        "    AND gcs.group_id IN (7129041349147311066, 7124688456013271111) "));

    for (group in groupList) {
        groupDoc = tools.open_doc(OptInt(group.group_id));

        if (groupDoc != undefined) {
            for (eduGroup in groupDoc.TopElem.educ_groups) {
                for (person in eduGroup.collaborators) {
                    if (OptInt(person.collaborator_id) == OptInt(personId)) {
                        result += eduGroup.name + ",";
                    }
                }
            }
        }
    }

    if (StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";

var agentId = 7312691335872272387;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "web_7312691335872272387";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var skipped = 0;

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
        " SELECT ers.id AS event_result_id, " +
        "       f_rs.name AS fact_region_name, " +
        "       os.code AS inn, " +
        "       os.name AS org_name, " +
        "       cs.code AS person_code, " +
        "       cs.fullname AS fullname, " +
        "       ps.name AS position_name, " +
        "       IIF(ers.is_assist = 1, 'Истина', 'Ложь') AS is_assist, " +
        "       ems.name AS education_method_name, " +
        "       es.id AS event_id, " +
        "       es.code AS event_code, " +
        "       es.name AS event_name, " +
        "       es.start_date, " +
        "       '' AS lector_fio, " +
        "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
        "       '' AS preparation_fio, " +
        "       CASE " +
        "           WHEN ers.is_assist = 'false' THEN 0 " +
        "           ELSE row_number() over(partition BY cs.code, '_', cs.fullname ORDER BY cs.fullname, os.name, ers.not_participate, es.finish_date) " +
        "           END AS num, " +
        "       IIF(o.data.value('(//custom_elems/custom_elem[name=''is_rcc'']/value)[1]', 'bit') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rcc'']/value)[1]', 'bit') AS INT)) AS is_rcc, " +
        "       IIF(o.data.value('(//custom_elems/custom_elem[name=''is_ock_ss'']/value)[1]', 'bit') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock_ss'']/value)[1]', 'bit') AS INT)) AS is_ock_ss, " +
        "       IIF(o.data.value('(//custom_elems/custom_elem[name=''is_ock_bno'']/value)[1]', 'bit') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock_bno'']/value)[1]', 'bit') AS INT)) AS is_ock_bno, " +
        "       pas.name AS pas_name, " +
        "       cs.id AS cs_id, " +
        "       c.data.value('(collaborator/custom_elems/custom_elem[name=''is_dossier_occ_exist''])[1]/value[1]', 'varchar(max)') AS is_dossier_exist " +
        " FROM[WTDB].[dbo].event_results AS ers " +
        "         INNER JOIN[WTDB].[dbo].event_result AS er ON ers.id = er.id " +
        "         INNER JOIN[WTDB].[dbo].events AS es ON ers.event_id = es.id " +
        "         INNER JOIN[WTDB].[dbo].event AS e ON es.id = e.id " +
        "         LEFT JOIN[WTDB].[dbo].education_methods AS ems ON es.education_method_id = ems.id " +
        "         INNER JOIN[WTDB].[dbo].collaborators AS cs ON ers.person_id = cs.id " +
        "         INNER JOIN[WTDB].[dbo].collaborator AS c ON cs.id = c.id " +
        "         LEFT JOIN[WTDB].[dbo].positions AS ps ON cs.position_id = ps.id " +
        "         INNER JOIN[WTDB].[dbo].orgs AS os ON cs.org_id = os.id " +
        "         INNER JOIN[WTDB].[dbo].org AS o ON os.id = o.id " +
        "         INNER JOIN[WTDB].[dbo].regions AS f_rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = f_rs.id " +
        "         LEFT JOIN[WTDB].[dbo].professional_areas pas ON o.data.value('(//custom_elems/custom_elem[name=''professional_area'']/value)[1]', 'bigint') = pas.id " +
        " WHERE YEAR(es.start_date) >= 2025 " +
        "     AND(o.data.value('(//custom_elems/custom_elem[name=''is_rcc'']/value)[1]', 'varchar(5)') = 'true' " +
        "         OR o.data.value('(//custom_elems/custom_elem[name=''is_ock_ss'']/value)[1]', 'varchar(5)') = 'true' " +
        "         OR o.data.value('(//custom_elems/custom_elem[name=''is_ock_bno'']/value)[1]', 'varchar(5)') = 'true' " +
        "         ) " +
        "     AND c.data.value('(//custom_elems/custom_elem[name=''dossier_id'']/value)[1]', 'varchar(max)') IS NULL " +
        " ORDER BY cs.fullname, os.name, es.finish_date "));

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
    reportString.AppendStr("<td class='header'>РЦК/ОЦК</td>");
    reportString.AppendStr("<td class='header'>Сфера</td>");    
    reportString.AppendStr("<td class='header'>Фактический регион обучения</td>");    
    reportString.AppendStr("<td class='header'>ИНН организации обучения</td>");
    reportString.AppendStr("<td class='header'>Организация</td>");
    reportString.AppendStr("<td class='header'>Код участника</td>");
    reportString.AppendStr("<td class='header'>ФИО участника</td>");
    reportString.AppendStr("<td class='header'>Должность участника</td>");    
    reportString.AppendStr("<td class='header'>Учебная программа</td>");
    reportString.AppendStr("<td class='header'>ID мероприятия</td>");
    reportString.AppendStr("<td class='header'>Мероприятие</td>");
    reportString.AppendStr("<td class='header'>Дата начала мероприятия</td>");
    reportString.AppendStr("<td class='header'>Присутствие</td>");
    reportString.AppendStr("<td class='header'>num</td>");
    reportString.AppendStr("<td class='header'>ID результата мероприятия</td>");       
    reportString.AppendStr("<td class='header'>Есть досье</td>");
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr(
            "<tr>" +
            "<td>" + getRckOckNames(data.is_rcc, data.is_ock_ss, data.is_ock_bno) + "</td>" +
            "<td>" + data.pas_name + "</td>" +            
            "<td>" + data.fact_region_name + "</td>" +
            "<td>" + data.inn + "</td>" +
            "<td>" + data.org_name + "</td>" +
            "<td>" + data.person_code + "</td>" +
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.position_name + "</td>" +
            "<td>" + data.education_method_name + "</td>" +
            "<td>'" + data.event_id + "</td>" +
            "<td>" + data.event_name + "</td>" +
            "<td>" + StrDate(data.start_date, false, false) + "</td>" +
            "<td>" + data.is_assist + "</td>" +
            "<td>" + data.num + "</td>" +
            "<td>'" + data.event_result_id + "</td>" +
            "<td>" + (data.is_dossier_exist == "true" ? "Да" : "Нет") + "</td>" +
            "</tr>");

        processed++;

        agent.processed = processed;
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

    agent.processed = processed;
    agent.skipped = skipped;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Сохраняем Excel файл...";
    refreshMsPerRow(agent, startDate, total);
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    // SAVE EXCEL FILE
    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    //excel.SaveAs("E:/Websoft/Reports/report_not_tren_muc_com/report_not_tren_muc_com_" + ParseDate(Date()) + ".xlsx");
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/report_col_ock_rck/rck_ock_result_event_without_dossier_" + ParseDate(Date()) + ".xlsx");

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
        skipped + " skipped"
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );

    resultData.message = "Agent is started";

    Response.Write(EncodeJson(resultData));
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) { }
%>