// 7176435673224669806
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isCollaboratorExistsInDossier(collsCode) {
    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        "    FROM [WTDB].[dbo].cc_dossier_subsidized_traineds " +
        "    WHERE student_code = '" + collsCode + "'"));

    return ArrayCount(dossierList) > 0;
}

function addYearCondition(year) {
    if (year != "") {
        return " AND YEAR(es.finish_date) >= " + OptInt(yearParam);
    }

    return "";
}

if (LdsIsServer) {
    var yearParam = Param.from_year;
   
    var agentId = 7176435673224669806;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7176435673224669806";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;

    var excelDoc = tools.get_object_assembly('Excel');
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _lectors AS ( " +
            "    SELECT events.id, lectors.lector_fullname AS lector_fio " +
            "    FROM [WTDB].[dbo].events " +
            "        INNER JOIN [WTDB].[dbo].event e ON events.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
            "        INNER JOIN [WTDB].[dbo].lectors ON T.c.value('lector_id[1]','varchar(max)') = lectors.id " +
            " ), " +
            " _temp_lectors AS ( " +
            "    SELECT id, " +
            "    lector_fio = STUFF( " +
            "    ( " +
            "        SELECT '|' + lector_fio " +
            "        FROM _lectors tmp " +
            "        WHERE tmp.id = ls.id " +
            "            FOR XML PATH ('')), 1, 1, '') " +
            "    FROM _lectors ls " +
            "    GROUP BY ls.id), " +
            " _preparations AS ( " +
            "    SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "        LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c) " +
            " ), " +
            " _temp_preparations AS ( " +
            "    SELECT id, " +
            "        preparation_fio = STUFF( " +
            "        ( " +
            "            SELECT '|' + pre_fio " +
            "            FROM _preparations tmp " +
            "            WHERE tmp.id = ps.id " +
            "                FOR XML PATH ('')), 1, 1, '') " +
            "    FROM _preparations ps " +
            "    GROUP BY id " +
            " ) " +
            " SELECT rs.name AS region_name, " +
            "       f_rs.name AS fact_region_name, " +
            "       os.code AS inn, " +
            "       os.name AS org_name, " +
            "       cs.code AS person_code, " +
            "       cs.fullname AS fullname, " +
            "       ps.name AS position_name, " +
            "       IIF(ers.is_assist = 1, 'Истина', 'Ложь') AS is_assist, " +
            "       es.education_org_name, " +
            "       ems.id AS education_method_id, " +
            "       em.data.value('(//custom_elems/custom_elem[name=''subcode'']/value)[1]', 'varchar(max)') AS subcode, " +
            "       ems.name AS education_method_name, " +
            "       es.id AS event_id, " +
            "       es.code AS event_code, " +
            "       es.name AS event_name, " +
            "       es.start_date, " +
            "       es.finish_date, " +
            "       e.data.value('(event/place)[1]', 'varchar(max)') AS place, " +
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
            "       tls.lector_fio, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
            "       cests.name AS status_name, " +
            "       tps.preparation_fio, " +
            "       CASE " +
            "           WHEN ers.is_assist = 'false' THEN 0 " +
            "           ELSE row_number() over(partition BY cs.code, '_', cs.fullname ORDER BY cs.fullname, os.name, ers.not_participate, es.finish_date) " +
            "           END AS num, " +
            "       DAY(es.finish_date) AS day, " +
            "       MONTH(es.finish_date) AS month, " +
            "       YEAR(es.finish_date) AS year, " +
            "       ers.id AS event_result_id, " +
            "       erts.name AS result_type_name, " +
            "       IIF(c.data.value('(collaborator/custom_elems/custom_elem[name=''is_dossier_exist''])[1]/value[1]', 'bit') = 1, 'Истина', 'Ложь') AS is_doss_exist, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''month_otch'']/value)[1]', 'varchar(max)') AS report_month, " +
            "       ers.event_start_date, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''wave'']/value)[1]', 'varchar(max)') AS wave, " +
            "       pcs.name AS typical_position_name " +
            " FROM [WTDB].[dbo].event_results AS ers " +
            "         INNER JOIN [WTDB].[dbo].events AS es ON ers.event_id = es.id " + addYearCondition(yearParam) +
            "               AND es.education_org_id IN (7100351150313827874, 7410749948253583035, 7100351480975785298, 6148914691236517202, 6148914691236517203, 6802513472431981115, 6938000483356197646, 6938001238782589341, 7034790057599700358, 6856726259800948992, 7086784658178339954, 7410046389105987361, 7410749948253583035, 6856735269184478330, 6856735325928247512, 6856735493587543129, 6869760264243199229, 6870054939308859763) " +
            "         INNER JOIN [WTDB].[dbo].event AS e ON es.id = e.id " +
            "         INNER JOIN [WTDB].[dbo].event_result_types AS erts ON ers.event_result_type_id = erts.id " +
            "         LEFT JOIN [WTDB].[dbo].education_methods AS ems ON es.education_method_id = ems.id " +
            "         INNER JOIN [WTDB].[dbo].education_method AS em ON ems.id = em.id " +
            "         INNER JOIN [WTDB].[dbo].collaborators AS cs ON ers.person_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].collaborator AS c ON cs.id = c.id " +
            "         LEFT JOIN [WTDB].[dbo].positions AS ps ON cs.position_id = ps.id " +
            "         LEFT JOIN [WTDB].[dbo].position_commons AS pcs ON ps.position_common_id = pcs.id " +
            "         INNER JOIN [WTDB].[dbo].orgs AS os ON cs.org_id = os.id " +
            "         INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS rs ON os.region_id = rs.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS f_rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = f_rs.id " +
            "         LEFT JOIN _temp_lectors AS tls ON e.id = tls.id " +
            "         LEFT JOIN _temp_preparations AS tps ON e.id = tps.id " +
            "         INNER JOIN [WTDB].[dbo].[common.event_status_types] AS cests ON es.status_id = cests.id " +
            " ORDER BY cs.fullname, os.name, es.finish_date  "));

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
        reportString.AppendStr("<td class='header'>Регион</td>");
        reportString.AppendStr("<td class='header'>Фактический регион</td>");
        reportString.AppendStr("<td class='header'>ИНН</td>");
        reportString.AppendStr("<td class='header'>Организация</td>");
        reportString.AppendStr("<td class='header'>Код участника</td>");
        reportString.AppendStr("<td class='header'>ФИО участника</td>");
        reportString.AppendStr("<td class='header'>Должность участника</td>");
        reportString.AppendStr("<td class='header'>Присутствие</td>");
        reportString.AppendStr("<td class='header'>Обучающая организация</td>");
        reportString.AppendStr("<td class='header'>ID учебной программы</td>");
        reportString.AppendStr("<td class='header'>Код учебной программы</td>");
        reportString.AppendStr("<td class='header'>Учебная программа</td>");
        reportString.AppendStr("<td class='header'>ID мероприятия</td>");
        reportString.AppendStr("<td class='header'>Код мероприятия</td>");
        reportString.AppendStr("<td class='header'>Мероприятие</td>");
        reportString.AppendStr("<td class='header'>Дата начала мероприятия</td>");
        reportString.AppendStr("<td class='header'>Дата завершения мероприятия</td>");
        reportString.AppendStr("<td class='header'>Место проведения</td>");
        reportString.AppendStr("<td class='header'>Форма проведения мероприятия</td>");
        reportString.AppendStr("<td class='header'>Тренер</td>");
        reportString.AppendStr("<td class='header'>NPS</td>");
        reportString.AppendStr("<td class='header'>Статус</td>");
        reportString.AppendStr("<td class='header'>Ответственный</td>");
        reportString.AppendStr("<td class='header'>num</td>");
        reportString.AppendStr("<td class='header'>Дата завершения мероприятия</td>");
        reportString.AppendStr("<td class='header'>Месяц завершения мероприятия</td>");
        reportString.AppendStr("<td class='header'>Год завершения мероприятия</td>");
        reportString.AppendStr("<td class='header'>ID результата мероприятия</td>");
        reportString.AppendStr("<td class='header'>Тип результата мероприятия</td>");
        reportString.AppendStr("<td class='header'>Есть в досье</td>");
        reportString.AppendStr("<td class='header'>Месяц отчета</td>");
        reportString.AppendStr("<td class='header'>Дата создания результата мероприятия</td>");
        reportString.AppendStr("<td class='header'>Фамилия участника</td>");
        reportString.AppendStr("<td class='header'>Имя участника</td>");
        reportString.AppendStr("<td class='header'>Отчество участника</td>");
        reportString.AppendStr("<td class='header'>Волна</td>");
        reportString.AppendStr("<td class='header'>Есть в досье</td>");
        reportString.AppendStr("<td class='header'>Типовая должность</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            fullFIO = data.fullname + " #empty #empty";

            fioList = fullFIO.split(" ");

            reportString.AppendStr(
                "<tr>" +
                "<td>" + data.region_name + "</td>" +
                "<td>" + data.fact_region_name + "</td>" +
                "<td>" + data.inn + "</td>" +
                "<td>" + data.org_name + "</td>" +
                "<td>" + data.person_code + "</td>" +
                "<td>" + data.fullname + "</td>" +
                "<td>" + data.position_name + "</td>" +
                "<td>" + data.is_assist + "</td>" +
                "<td>" + data.education_org_name + "</td>" +
                "<td>'" + data.education_method_id + "</td>" +
                "<td>" + data.subcode + "</td>" +
                "<td>" + data.education_method_name + "</td>" +
                "<td>'" + data.event_id + "</td>" +
                "<td>" + data.event_code + "</td>" +
                "<td>" + data.event_name + "</td>" +
                "<td>" + StrDate(data.start_date, true, false) + "</td>" +
                "<td>" + StrDate(data.finish_date, true, false) + "</td>" +
                "<td>" + data.place + "</td>" +
                "<td>" + data.event_form + "</td>" +
                "<td>" + data.lector_fio + "</td>" +
                "<td>" + data.nps + "</td>" +
                "<td>" + data.status_name + "</td>" +
                "<td>" + data.preparation_fio + "</td>" +
                "<td>" + data.num + "</td>" +
                "<td>" + data.day + "</td>" +
                "<td>" + data.month + "</td>" +
                "<td>" + data.year + "</td>" +
                "<td>'" + data.event_result_id + "</td>" +
                "<td>" + data.result_type_name + "</td>" +
                "<td>" + data.is_doss_exist + "</td>" +
                "<td>" + data.report_month + "</td>" +
                "<td>" + StrDate(data.event_start_date, true, false) + "</td>" +
                "<td>" + fioList[0] + "</td>" +
                "<td>" + (fioList[1] == "#empty" ? "" : fioList[1]) + "</td>" +
                "<td>" + (fioList[2] == "#empty" ? "" : fioList[2]) + "</td>" +
                "<td>" + data.wave + "</td>" +
                "<td>" + (isCollaboratorExistsInDossier(data.person_code) ? "Да": "Нет") + "</td>" +
                "<td>" + data.typical_position_name + "</td>" +
                "</tr>");

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
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
        excelDoc.LoadHtmlString(reportString.GetStr(), "");
        try {
            excelDoc.SaveAs("E:/Websoft/Reports/report_fck_2025/report_fck_all_" + ParseDate(Date()) + ".xlsx");
        } catch (e) {
            throw new Error("Возможно файл открыт другим процессом!");
        }

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