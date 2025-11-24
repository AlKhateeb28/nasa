// 7224160110549431185
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7224160110549431185;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7224160110549431185";
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
        start = Param.start;
        if(start == "") {
            start = "01.01.2025 00:00:00";
        }

        finish = Param.finish;
        if(finish == "") {
            finish = "31.12.2025 23:59:59";
        }

        dataList = ArrayDirect(XQuery("sql: " +
            " SET DATEFORMAT dmy; " +
            " DECLARE " + "@date_from datetime = '" + start + "'; " +
            " DECLARE " + "@date_to datetime = '" + finish + "'; " +
            " WITH _lectors AS ( " +
            "    SELECT es.id AS event_id, " +
            "           ls.person_id, " +
            "           ls.id AS lector_id, " +
            "           l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]','varchar(max)') AS lector_type " +
            "    FROM [WTDB].[dbo].events es " +
            "        LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "             CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
            "             LEFT JOIN [WTDB].[dbo].lectors ls ON T.c.value('lector_id[1]','varchar(max)') = ls.id " +
            "             INNER JOIN [WTDB].[dbo].lector l ON ls.id = l.id AND ls.type = 'collaborator' " +
            "                    AND ( " +
            "                            l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]','varchar(max)') = 'Тренер ФЦК коммерция' " +
            "                                OR " +
            "                            l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]','varchar(max)') = 'Тренер ФЦК субсидия' " +
            "                        ) " +
            "    WHERE es.finish_date BETWEEN @date_from AND @date_to " +
            "        AND (es.code LIKE '%fck_tren%' OR es.code LIKE '%week%') " +
            " ) " +
            " SELECT es.id AS event_id, " +
            "       cs.id AS colls_id, " +
            "       cs.code AS colls_code, " +
            "       cs.fullname, " +
            "       cs.email, " +
            "       _l.lector_id, " +
            "       _l.lector_type, " +
            "       es.code AS event_code, " +
            "       es.name AS event_name, " +
            "       et.name AS event_type_name, " +
            "       ems.code AS edu_method_code, " +
            "       ems.name AS edu_method_name, " +
            "       eos.name AS edu_org_name, " +
            "       es.person_num, " +
            "       es.start_date, " +
            "       es.finish_date, " +
            "       '' AS fact_event_days, " +
            "       '' AS fact_days, " +
            "       '' AS fact_hours, " +
            "       CASE " +
            "           WHEN es.event_form = 'conference' THEN 'конференция' " +
            "           WHEN es.event_form = 'examination' THEN 'сертификация' " +
            "           WHEN es.event_form = 'game' THEN 'деловая игра' " +
            "           WHEN es.event_form = 'meeting' THEN 'стартовое совещание' " +
            "           WHEN es.event_form = 'meth_day' THEN 'методический день' " +
            "           WHEN es.event_form = 'pered_prog' THEN 'передача программ' " +
            "           WHEN es.event_form = 'praktikum' THEN 'тренинг-площадка' " +
            "           WHEN es.event_form = 'scan' THEN 'сканирование' " +
            "           WHEN es.event_form = 'seminar' THEN 'семинар' " +
            "           WHEN es.event_form = 'stagirovka' THEN 'стажировка' " +
            "           WHEN es.event_form = 'supervis_tren' THEN 'супервизия тренеров' " +
            "           WHEN es.event_form = 'training' THEN 'тренинг' " +
            "           WHEN es.event_form = 'webinar' THEN 'вебинар' " +
            "           ELSE '' " +
            "           END AS event_form, " +
            "       cests.name AS status_name, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
            "       MONTH(es.finish_date) AS month, " +
            "       YEAR(es.finish_date) AS year, " +
            "       '' AS activity_type, " +
            "       '' AS responsible_fullname, " +
            "       ps.name place_name " +
            " FROM _lectors _l " +
            "         INNER JOIN [WTDB].[dbo].events es ON _l.event_id = es.id " +
            "         INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "         INNER JOIN [WTDB].[dbo].collaborators cs ON _l.person_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].event_types et ON es.event_type_id = et.id " +
            "         INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "         INNER JOIN [WTDB].[dbo].education_orgs eos ON es.education_org_id = eos.id " +
            "         INNER JOIN [WTDB].[dbo].[common.event_status_types] AS cests ON es.status_id = cests.id " +
            "         LEFT JOIN [WTDB].[dbo].places ps ON es.place_id = ps.id "));

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
        reportString.AppendStr("<td class='header'>Код сотрудника</td>");
        reportString.AppendStr("<td class='header'>ФИО преподавателя</td>");
        reportString.AppendStr("<td class='header'>E-mail</td>");
        reportString.AppendStr("<td class='header'>Тип тренера</td>");
        reportString.AppendStr("<td class='header'>id мероприятия</td>");
        reportString.AppendStr("<td class='header'>Код мероприятия</td>");
        reportString.AppendStr("<td class='header' style='width: 400px;'>Название мероприятия</td>");
        reportString.AppendStr("<td class='header'>Тип мероприятия</td>");
        reportString.AppendStr("<td class='header'>Код учебной программы</td>");
        reportString.AppendStr("<td class='header' style='width: 400px;'>Учебная программа</td>");
        reportString.AppendStr("<td class='header'>Обучающая организация</td>");
        reportString.AppendStr("<td class='header'>Дата начала мероприятия</td>");
        reportString.AppendStr("<td class='header'>Дата окончания мероприятия</td>");
        reportString.AppendStr("<td class='header'>Число дней мероприятия</td>");
        reportString.AppendStr("<td class='header'>Дата начала загрузки</td>");
        reportString.AppendStr("<td class='header'>Дата завершения загрузки</td>");
        reportString.AppendStr("<td class='header'>Фактическое количество дней</td>");
        reportString.AppendStr("<td class='header'>Фактическое количество часов</td>");
        reportString.AppendStr("<td class='header'>Форма проведения</td>");
        reportString.AppendStr("<td class='header'>Статус мероприятия</td>");
        reportString.AppendStr("<td class='header'>nps</td>");
        reportString.AppendStr("<td class='header'>Месяц</td>");
        reportString.AppendStr("<td class='header'>Год</td>");
        reportString.AppendStr("<td class='header'>Тип активности</td>");
        reportString.AppendStr("<td class='header'>Ответственный за проведение</td>");
        reportString.AppendStr("<td class='header'>Место проведения</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            factStart = "";
            factFinish = "";
            factDays = 0;
            factHours = 0;
            responsibleFullname = "";

            eventDoc = tools.open_doc(OptInt(data.event_id));

            if(eventDoc != undefined) {
                eventDocTE = eventDoc.TopElem;

                responsibleFullname = eventDocTE.even_preparations[0].person_fullname;

                for(phase in eventDocTE.phases) {
                    if(OptInt(phase.lector_id) == OptInt(data.lector_id)) {
                        if(factStart == "") {
                            factStart = phase.start_date;
                        }

                        factFinish = phase.finish_date;

                        factDays++;
                        factHours += DateDiff(Date(phase.finish_date), Date(phase.start_date)) / 3600;
                    }
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Event with ID " + data.event_id + " is not exist!");
            }

            activityType = StrLeftCharRange(data.event_code,4) == "week" ? "Обучение" : "Прочие активности тренера";

            reportString.AppendStr(
                "<tr>" +
                "<td>" + data.colls_code + "</td>" +
                "<td>" + data.fullname + "</td>" +
                "<td>" + data.email + "</td>" +
                "<td>" + data.lector_type + "</td>" +
                "<td>'" + data.event_id + "</td>" +
                "<td>" + data.event_code + "</td>" +
                "<td>" + data.event_name + "</td>" +
                "<td>" + data.event_type_name + "</td>" +
                "<td>" + data.edu_method_code + "</td>" +
                "<td>" + data.edu_method_name + "</td>" +
                "<td>" + data.edu_org_name + "</td>" +
                "<td>" + (data.start_date == "" ? "" : StrDate(data.start_date, true, false)) + "</td>" +
                "<td>" + (data.finish_date == "" ? "" : StrDate(data.finish_date, true, false)) + "</td>" +
                "<td>" + ((DateDiff(Date(StrDate(data.finish_date, false, false)), Date(StrDate(data.start_date, false, false))) / 86400) + 1) + "</td>" +
                "<td>" + factStart + "</td>" +
                "<td>" + factFinish + "</td>" +
                "<td>" + factDays + "</td>" +
                "<td>" + factHours + "</td>" +
                "<td>" + data.event_form + "</td>" +
                "<td>" + data.status_name + "</td>" +
                "<td>" + data.nps + "</td>" +
                "<td>" + data.month + "</td>" +
                "<td>" + data.year + "</td>" +
                "<td>" + activityType + "</td>" +
                "<td>" + responsibleFullname + "</td>" +
                "<td>" + data.place_name + "</td>" +

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
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/lectors/event_lectors_" + ParseDate(Date()) + ".xlsx");

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
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}