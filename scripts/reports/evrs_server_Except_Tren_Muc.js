// 7425912810798652153
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function hasSpecialGroup(specialGroupDocTE, collaboratorId) {
    if(specialGroupDocTE == null) {
        return "Нет";
    } else {
        if(specialGroupDocTE.collaborators.GetOptChildByKey(collaboratorId) == undefined) {
            return "Нет";
        } else {
            return "Да";
        }
    }
}

function notExistInGroup(groupTE, collaboratorId) {
    if(groupTE == null) {
        return false;
    }

    return groupTE.collaborators.GetOptChildByKey(collaboratorId) == undefined;
}

var agentId = 7425912810798652153;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7425912810798652153";
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
    eventResultList = ArrayDirect(XQuery("sql:
    SET DATEFORMAT dmy;
    DECLARE @date_from datetime = '" + date_from + "';
    DECLARE @date_to datetime = '" + date_to + "';

    SELECT lec_fio_s = STUFF (
                    (
                        SELECT '|' + lec_fio
                FROM (
                    SELECT ev1.id AS e_id, lectors.lector_fullname AS lec_fio
                FROM [WTDB].[dbo].events ev1
                INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
                CROSS APPLY e1.data.nodes('event/lectors/lector') T(c)
                INNER JOIN [WTDB].[dbo].lectors
                ON T.c.value('lector_id[1]','varchar(max)') = lectors.id
            ) tt2
                WHERE tt2.e_id = events.id
                FOR XML PATH ('')
            ), 1, 1, ''),
    pre_fio_s = STUFF (
                    (
                        SELECT '|' + pre_fio
                FROM (
                    SELECT ev1.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS pre_fio
                FROM [WTDB].[dbo].events ev1
                INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
                CROSS APPLY e1.data.nodes('event/even_preparations/even_preparation') T(c)
            ) tt2
                WHERE tt2.e_id = events.id
                FOR XML PATH ('')
            ), 1, 1, ''),
    events.id,
        CONCAT( '''', event_results.id ) AS PK,
        event_results.is_assist,
        event_results.not_participate,
        event_result_types.name AS event_result_type,
        events.finish_date AS f_date,
        YEAR(events.finish_date) AS f_date_year,
        MONTH(events.finish_date) AS f_date_month,
        DAY(events.finish_date) AS f_date_day,
        CONCAT( '''', events.id ) AS e_id,
        events.name AS e_name,
        collaborators.code AS col_code,
        collaborators.fullname AS col_fullname,
        places.name AS place_name,
        [common.event_status_types].name AS status_name,
        education_methods.name AS edu_meth_name,
        CONCAT( '''', education_methods.id  ) AS edu_meth_id,
        events.education_org_name AS edu_org_name,
        event.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps,
        event.data.value('(event/custom_elems/custom_elem[name=''month_otch''])[1]/value[1]', 'varchar(max)') AS month_otch,
        CONCAT( '''', orgs.code ) AS o_inn,
        orgs.name AS o_name,
        org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part,
        CASE
    WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
    ELSE '-'
    END AS is_rck,
        CASE
    WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
    ELSE '-'
    END AS is_roiv,
        CASE
    WHEN org.data.value('(org/custom_elems/custom_elem[name=''be_in_sr''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
    ELSE '-'
    END AS be_in_sr,
        ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name,
        regions.name AS reg_name,
        collaborator.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS col_lastname,
        collaborator.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS col_firstname,
        collaborator.data.value('(collaborator/middlename)[1]', 'varchar(max)') AS col_middlename,
        CONCAT( '''', orgs.code, '_', orgs.name ) AS o_inn_name,
        CONCAT( collaborators.code, '_', collaborators.fullname ) AS col_code_fullname,
        CASE
    WHEN event_results.is_assist = 'false' THEN 0
    ELSE row_number() over(partition BY collaborators.code, '_', collaborators.fullname
    ORDER BY collaborators.fullname, orgs.name, event_results.not_participate,
        events.finish_date)
    END AS num,
        CASE
    WHEN events.event_form = 'conference' THEN 'конференция'
    WHEN events.event_form = 'examination' THEN 'сертификация'
    WHEN events.event_form = 'game' THEN 'деловая игра'
    WHEN events.event_form = 'meeting' THEN 'стартовое совещание'
    WHEN events.event_form = 'meth_day' THEN 'методический день'
    WHEN events.event_form = 'pered_prog' THEN 'передача программ'
    WHEN events.event_form = 'praktikum' THEN 'тренинг-площадка'
    WHEN events.event_form = 'scan' THEN 'сканирование'
    WHEN events.event_form = 'seminar' THEN 'семинар'
    WHEN events.event_form = 'stagirovka' THEN 'стажировка'
    WHEN events.event_form = 'supervis_tren' THEN 'супервизия тренеров'
    WHEN events.event_form = 'training' THEN 'тренинг'
    WHEN events.event_form = 'webinar' THEN 'вебинар'
    ELSE ''
    END AS event_form
        , positions.name AS pos_name
        , event_result.data.value('(event_result/custom_elems/custom_elem[name=''event_guid''])[1]/value[1]', 'varchar(max)') AS event_guid
        , event_result.data.value('(event_result/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS er_guid
        , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS col_guid,
        collaborators.id AS colls_id,
        l.data.value('(lector/custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') AS trener_type
    FROM [WTDB].[dbo].event_results
        INNER JOIN [WTDB].[dbo].event_result ON event_results.id = event_result.id
        INNER JOIN [WTDB].[dbo].collaborators ON event_results.person_id = collaborators.id AND collaborators.code NOT LIKE '%tren_muc%'
        INNER JOIN [WTDB].[dbo].collaborator ON event_results.person_id = collaborator.id
        INNER JOIN [WTDB].[dbo].events ON event_results.event_id = events.id /*AND events.code LIKE '%week%'*/ AND events.finish_date BETWEEN @date_from AND @date_to
        INNER JOIN [WTDB].[dbo].event ON event_results.event_id = event.id
        LEFT JOIN [WTDB].[dbo].event_result_types ON event_results.event_result_type_id = event_result_types.id
        LEFT JOIN [WTDB].[dbo].places ON events.place_id = places.id
        INNER JOIN [WTDB].[dbo].[common.event_status_types] ON events.status_id = [common.event_status_types].id
        LEFT JOIN [WTDB].[dbo].education_methods ON events.education_method_id = education_methods.id
        INNER JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id
        INNER JOIN [WTDB].[dbo].org ON collaborators.org_id = org.id
        INNER JOIN [WTDB].[dbo].regions ON regions.id = orgs.region_id
        LEFT JOIN [WTDB].[dbo].positions ON positions.id = collaborators.position_id
        LEFT JOIN [WTDB].[dbo].lector l ON event.data.value('(//lectors/lector)[1]/lector_id[1]', 'varchar(max)') = l.id
    ORDER BY col_fullname, o_name, not_participate, f_date;
    "));

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
        "<td>Тип поддержки</td>" +
        "<td>РЦК?</td>" +
        "<td>Код участника</td>" +
        "<td>ФИО участника</td>" +
        "<td>Присутствие</td>" +
        "<td>id мероприятия</td>" +
        "<td>Мероприятие</td>" +
        "<td>Обучающая организация</td>" +
        "<td>id Учебной программы</td>" +
        "<td>Учебная программа</td>" +
        "<td>Дата</td>" +
        "<td>Место проведения</td>" +
        "<td>Тренер</td>" +
        "<td>NPS</td>" +
        "<td>Статус</td>" +
        "<td>Ответственный</td>" +
        "<td>День</td>" +
        "<td>Месяц</td>" +
        "<td>Год</td>" +
        "<td>Регион</td>" +
        "<td>Факт.Регион</td>" +
        "<td>Фамилия</td>" +
        "<td>Имя</td>" +
        "<td>Отчество</td>" +
        "<td>Форма проведения мероприятия</td>" +
        "<td>num</td>" +
        "<td>Должность</td>" +
        "<td>РОИВ?</td>" +
        "<td>guid</td>" +
        "<td>Тип результата</td>" +
        "<td>Месяц отчёта</td>" +
        "<td>Есть в СР</td>" +
        "<td>ID</td>" +
        "<td>Тип тренера</td>");
    reportString.AppendStr(" </tr>");

    for (eventResult in eventResultList) {
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td>" + eventResult.o_inn + " </td>" +
            "<td>" + eventResult.o_name + "</td>" +
            "<td>" + eventResult.format_part + "</td>" +
            "<td>" + eventResult.is_rck + "</td>" +
            "<td>" + eventResult.col_code + "</td>" +
            "<td>" + eventResult.col_fullname + "</td>" +
            "<td>" + eventResult.is_assist + "</td>" +
            "<td>" + eventResult.e_id + "</td>" +
            "<td>" + eventResult.e_name + "</td>" +
            "<td>" + eventResult.edu_org_name + "</td>" +
            "<td>" + eventResult.edu_meth_id + "</td>" +
            "<td>" + eventResult.edu_meth_name + "</td>" +
            "<td>" + (eventResult.f_date == null ? "" : Date(StrDate(eventResult.f_date, false))) + "</td>" +
            "<td>" + eventResult.place_name + "</td>" +
            "<td>" + eventResult.lec_fio_s + "</td>" +
            "<td>" + eventResult.nps + "</td>" +
            "<td>" + eventResult.status_name + "</td>" +
            "<td>" + eventResult.pre_fio_s + "</td>" +
            "<td>" + eventResult.f_date_day + "</td>" +
            "<td>" + eventResult.f_date_month + "</td>" +
            "<td>" + eventResult.f_date_year + "</td>" +
            "<td>" + eventResult.reg_name + "</td>" +
            "<td>" + eventResult.fact_reg_name + "</td>" +
            "<td>" + eventResult.col_lastname + "</td>" +
            "<td>" + eventResult.col_firstname + "</td>" +
            "<td>" + eventResult.col_middlename + "</td>" +
            "<td>" + eventResult.event_form + " </td>" +
            "<td>" + eventResult.num + "</td>" +
            "<td>" + eventResult.pos_name + "</td>" +
            "<td>" + eventResult.is_roiv + "</td>" +
            "<td>" + eventResult.er_guid + "</td>" +
            "<td>" + eventResult.event_result_type + "</td>" +
            "<td>" + eventResult.month_otch + "</td>" +
            "<td>" + eventResult.be_in_sr + "</td>" +
            "<td>" + eventResult.PK + "</td>"+
            "<td>" + eventResult.trener_type + "</td>");
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
    excel.SaveAs("E:/Websoft/Reports/report_not_tren_muc/report_not_tren_muc_" + ParseDate( Date() ) + ".xlsx");

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