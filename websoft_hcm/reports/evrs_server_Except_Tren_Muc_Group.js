// 7140255621678765675
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function notExistInGroup(groupTE, collaboratorId) {
    if(groupTE == null) {
        return false;
    }

    return groupTE.collaborators.GetOptChildByKey(collaboratorId) == undefined;
}

function getEducationProgramName(educationMethodId, educationProgramTEs) {
    for(educationProgramTE in educationProgramTEs) {
        if(educationProgramTE.education_methods.GetOptChildByKey(educationMethodId) != undefined) {
            return educationProgramTE.name;
        }
    }

    return "";
}

var agentId = 7140255621678765675;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7140255621678765675";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;

var date_from = Param.date_from == '' ? '01.01.2010 00:00:00' : Param.date_from;
var date_to = Param.date_to == '' ? ParseDate( Date() ) + ' 23:59:59' : Param.date_to;
var excel = new ActiveXObject("Websoft.Office.Excel.Document");

var reportString = new Binary();

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    eventResultList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy; DECLARE @date_from datetime = '" + date_from + "'; DECLARE @date_to datetime = '" + date_to + "'; " +
        " SELECT os.code AS inn, " +
        "   os.name AS org_name, " +
        "   cs.code AS colls_code, " +
        "   cs.fullname AS colls_fio, " +
        "   IIF(ers.is_assist = 'true', 'Да', 'Нет') AS is_assist, " +
        "   es.id AS es_id, " +
        "   es.name AS es_name, " +
        "   ems.id AS ems_id, " +
        "   ems.name AS ems_name, " +
        "   ests.name AS status_name, " +
        "   DAY(es.finish_date) AS day, " +
        "   MONTH(es.finish_date) AS month, " +
        "   YEAR(es.finish_date) AS year, " +
        "   rs.name AS fact_region, " +
        "   CASE " +
        "       WHEN es.event_form = 'conference' THEN 'конференция' " +
        "       WHEN es.event_form = 'examination' THEN 'сертификация' " +
        "       WHEN es.event_form = 'game' THEN 'деловая игра' " +
        "       WHEN es.event_form = 'meeting' THEN 'стартовое совещание' " +
        "       WHEN es.event_form = 'meth_day' THEN 'методический день' " +
        "       WHEN es.event_form = 'pered_prog' THEN 'передача программ' " +
        "       WHEN es.event_form = 'praktikum' THEN 'тренинг-площадка' " +
        "       WHEN es.event_form = 'scan' THEN 'сканирование' " +
        "       WHEN es.event_form = 'seminar' THEN 'семинар' " +
        "       WHEN es.event_form = 'stagirovka' THEN 'стажировка' " +
        "       WHEN es.event_form = 'supervis_tren' THEN 'супервизия тренеров' " +
        "       WHEN es.event_form = 'training' THEN 'тренинг' " +
        "       WHEN es.event_form = 'webinar' THEN 'вебинар' " +
        "       ELSE '' " +
        "       END AS event_form, " +
        "   erts.name AS erts_id, " +
        "   ers.id AS ers_id, " +
        "   es.finish_date, " +
        "   cs.id AS colls_id" +
        " FROM [WTDB].[dbo].event_results ers " +
        "   INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.code LIKE '%week%' AND es.finish_date BETWEEN @date_from AND @date_to " +
        "   INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
        "   INNER JOIN [WTDB].[dbo].[common.event_status_types] ests ON es.status_id = ests.id " +
        "   INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id AND cs.code NOT LIKE '%tren_muc%' " +
        "   INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "   INNER JOIN [WTDB].[dbo].regions rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') = rs.id " +
        "   INNER JOIN [WTDB].[dbo].event_result_types erts ON ers.event_result_type_id = erts.id " +
        " ORDER BY fullname, org_name, not_participate, finish_date "));

    total = ArrayCount(eventResultList);

    agent.refreshChart = 1;
    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    reportString.AppendStr("<html><table>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr(
        "<td>ИНН</td>" +
        "<td>Организация</td>" +
        "<td>Код участника</td>" +
        "<td>ФИО участника</td>" +
        "<td>Присутствие</td>" +
        "<td>ID мероприятия</td>" +
        "<td>Мероприятие</td>" +
        "<td>ID Учебной программы</td>" +
        "<td>Учебная программа</td>" +
        "<td>Статус</td>" +
        "<td>День</td>" +
        "<td>Месяц</td>" +
        "<td>Год</td>" +
        "<td>Факт.Регион</td>" +
        "<td>Форма проведения мероприятия</td>" +
        "<td>Тип результата</td>" +
        "<td>Набор программ</td>" +
        "<td>ID</td>");
    reportString.AppendStr(" </tr>");

    specialGroupDocTE = null;

    if(Param.special_group != "") {
        specialGroupDoc = tools.open_doc(OptInt(Param.special_group));

        if(specialGroupDoc != undefined) {
            specialGroupDocTE = specialGroupDoc.TopElem;
        }
    }

    educationPrograms = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        "    FROM [WTDB].[dbo].education_programs " +
        "    WHERE code LIKE '%rck%' "));

    educationProgramTEs = [];

    for(educationProgram in educationPrograms) {
        educationProgramDoc = tools.open_doc(educationProgram.id);

        if(educationProgramDoc != undefined) {
            educationProgramTEs.push(educationProgramDoc.TopElem);
        }
    }

    for (eventResult in eventResultList) {
        if(specialGroupDocTE != null) {
            if(notExistInGroup(specialGroupDocTE, eventResult.colls_id)) {
                continue;
            }
        }

        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td>" + eventResult.inn + " </td>" +
            "<td>" + eventResult.org_name + "</td>" +
            "<td>" + eventResult.colls_code + "</td>" +
            "<td>" + eventResult.colls_fio + "</td>" +
            "<td>" + eventResult.is_assist + "</td>" +
            "<td>'" + eventResult.es_id + "</td>" +
            "<td>" + eventResult.es_name + "</td>" +
            "<td>'" + eventResult.ems_id + "</td>" +
            "<td>" + eventResult.ems_name + "</td>" +
            "<td>" + eventResult.status_name + "</td>" +
            "<td>" + eventResult.day + "</td>" +
            "<td>" + eventResult.month + "</td>" +
            "<td>" + eventResult.year + "</td>" +
            "<td>" + eventResult.fact_region + "</td>" +
            "<td>" + eventResult.event_form + "</td>" +
            "<td>" + eventResult.erts_id + "</td>" +
            "<td>" + getEducationProgramName(eventResult.ems_id, educationProgramTEs) + "</td>" +
            "<td>'" + eventResult.ers_id + "</td>");
        reportString.AppendStr(" </tr>");

        processed++;

        if (processed % 100 == 0) {
            agent.processed = processed;

            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Сохраняем Excel файл...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    reportString.AppendStr( " </table></html>"  )
    excel.LoadHtmlString( reportString.GetStr(), "" )
    excel.SaveAs("E:/Websoft/Reports/report_not_tren_muc/report_not_tren_muc_group_" + ParseDate( Date() ) + ".xlsx");

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
        processed  + " processed",
        null,
        null
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );

    try {
        ws.Send("close");
    } catch (e) {}
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    try {
        ws.Send("close");
    } catch (e) {}
}

saveMonitorAgents(agent, startDate);

try {
    excel.Application.Quit();
} catch (e) {}


