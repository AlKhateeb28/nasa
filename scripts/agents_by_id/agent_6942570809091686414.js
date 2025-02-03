// 6942570809091686414
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 6942570809091686414;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_6942570809091686414";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;

    var fromDate = Param.date_from == '' ? '01.01.2010 00:00:00' : Param.date_from;
    var toDate = Param.date_to == '' ? ParseDate( Date() ) + ' 23:59:59' : Param.date_to;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        dataList = ArrayDirect(XQuery("sql:" +
            " SET DATEFORMAT dmy " +
            "            DECLARE " + " @date_from datetime = '" + fromDate + "'; " +
            "            DECLARE " + " @date_to datetime = '" + toDate + "'; " +
            " WITH TempTable1 AS ( " +
            "    SELECT events.id AS e_id, lectors.lector_fullname AS lec_fio " +
            "    FROM [WTDB].[dbo].events " +
            "             LEFT JOIN [WTDB].[dbo].event e " +
            "                       ON events.id = e.id " +
            "             CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
            "             LEFT JOIN [WTDB].[dbo].lectors " +
            "                       ON T.c.value('lector_id[1]','varchar(max)') = lectors.id " +
            "    WHERE " +
            "        events.finish_date BETWEEN @date_from AND @date_to " +
            " ) " +
            " SELECT e_id, lec_fio_s = STUFF ( " +
            "        ( " +
            "            SELECT '|' + lec_fio " +
            "            FROM TempTable1 tt2 " +
            "            WHERE tt2.e_id = tt1.e_id " +
            "            FOR XML PATH ('') " +
            "        ) " +
            "    , 1, 1, '' " +
            "                         ) " +
            " INTO [WTDB].[dbo].#Table1 " +
            " FROM TempTable1 tt1 " +
            " GROUP BY e_id; " +
            " WITH TempTable2 AS ( " +
            "    SELECT events.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS pre_fio " +
            "    FROM [WTDB].[dbo].events " +
            "             LEFT JOIN [WTDB].[dbo].event e " +
            "                       ON events.id = e.id " +
            "             CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c) " +
            "    WHERE " +
            "        events.finish_date BETWEEN @date_from AND @date_to " +
            " ) " +
            " SELECT e_id, pre_fio_s = STUFF ( " +
            "        ( " +
            "            SELECT '|' + pre_fio " +
            "            FROM TempTable2 tt2 " +
            "            WHERE tt2.e_id = tt1.e_id " +
            "            FOR XML PATH ('') " +
            "        ) " +
            "    , 1, 1, '' " +
            "                         ) " +
            " INTO [WTDB].[dbo].#Table2 " +
            " FROM TempTable2 tt1 " +
            " GROUP BY e_id; " +
            " SELECT " +
            "    CONCAT( '''', ers.id ) AS PK, " +
            "    ers.is_assist, " +
            "    ers.not_participate, " +
            "    events.finish_date AS f_date, " +
            "    YEAR(events.finish_date) AS f_date_year, " +
            "    MONTH(events.finish_date) AS f_date_month, " +
            "    DAY(events.finish_date) AS f_date_day, " +
            "    CONCAT( '''', events.id ) AS e_id, " +
            "    events.code AS e_code, " +
            "    events.name AS e_name, " +
            "    event_types.name AS e_type_name, " +
            "    collaborators.code AS col_code, " +
            "    collaborators.fullname AS col_fullname, " +
            "    places.name AS place_name, " +
            "    [common.event_status_types].name AS status_name, " +
            "    education_methods.name AS edu_meth_name, " +
            "    CONCAT( '''', education_methods.id  ) AS edu_meth_id, " +
            "    events.education_org_name AS edu_org_name, " +
            "    tbl1.lec_fio_s AS lec_fio_s, " +
            "    tbl2.pre_fio_s AS pre_fio_s, " +
            "    event.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps, " +
            "    CONCAT( '''', orgs.code ) AS o_inn, " +
            "    orgs.name AS o_name, " +
            "    org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part, " +
            "    CASE " +
            "        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "        ELSE '-' " +
            "        END AS is_rck, " +
            "    CASE " +
            "        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "        ELSE '-' " +
            "        END AS is_roiv, " +
            "    CASE " +
            "        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "        ELSE '-' " +
            "        END AS is_partner, " +
            "    CASE " +
            "        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_commercial''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "        ELSE '-' " +
            "        END AS is_commercial, " +
            "    CASE " +
            "        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_extended_support''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "        ELSE '-' " +
            "        END AS is_extended_support, " +
            "    org.data.value('(org/custom_elems/custom_elem[name=''region_code''])[1]/value[1]', 'varchar(max)') AS reg_code, " +
            "    ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name, " +
            "    regions.name AS reg_name, " +
            "    collaborator.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS col_lastname, " +
            "    collaborator.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS col_firstname, " +
            "    collaborator.data.value('(collaborator/middlename)[1]', 'varchar(max)') AS col_middlename, " +
            "    collaborator.data.value('(collaborator/mobile_phone)[1]', 'varchar(max)') AS col_mobile_phone, " +
            "    CONCAT( collaborators.code, '_', collaborators.fullname ) AS col_code_fullname, " +
            "    CASE " +
            "        WHEN ers.is_assist = 'false' THEN 0 " +
            "        ELSE row_number() over( partition BY collaborators.code, '_', collaborators.fullname " +
            "            ORDER BY collaborators.fullname, orgs.name, ers.not_participate, events.finish_date ) " +
            "        END AS num, " +
            "    CONCAT( '''', orgs.code, '_', collaborators.fullname ) AS col_inn_fullname, " +
            "    CONCAT( '''', orgs.code, '_', orgs.name ) AS o_inn_name, " +
            "    CASE " +
            "        WHEN events.event_form = 'conference' THEN 'конференция' " +
            "        WHEN events.event_form = 'examination' THEN 'сертификация' " +
            "        WHEN events.event_form = 'game' THEN 'деловая игра' " +
            "        WHEN events.event_form = 'meeting' THEN 'стартовое совещание' " +
            "        WHEN events.event_form = 'meth_day' THEN 'методический день' " +
            "        WHEN events.event_form = 'pered_prog' THEN 'передача программ' " +
            "        WHEN events.event_form = 'praktikum' THEN 'тренинг-площадка' " +
            "        WHEN events.event_form = 'scan' THEN 'сканирование' " +
            "        WHEN events.event_form = 'seminar' THEN 'семинар' " +
            "        WHEN events.event_form = 'stagirovka' THEN 'стажировка' " +
            "        WHEN events.event_form = 'supervis_tren' THEN 'супервизия тренеров' " +
            "        WHEN events.event_form = 'training' THEN 'тренинг' " +
            "        WHEN events.event_form = 'webinar' THEN 'вебинар' " +
            "        ELSE '' " +
            "        END AS event_form " +
            "        , positions.name AS pos_name " +
            "        , er.data.value('(event_result/custom_elems/custom_elem[name=''event_guid''])[1]/value[1]', 'varchar(max)') AS event_guid " +
            "        , er.data.value('(event_result/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS er_guid " +
            "        , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS col_guid " +
            " FROM [WTDB].[dbo].event_results AS ers " +
            "         LEFT JOIN [WTDB].[dbo].event_result AS er ON ers.id = er.id " +
            "         LEFT JOIN [WTDB].[dbo].collaborators ON ers.person_id = collaborators.id " +
            "         LEFT JOIN [WTDB].[dbo].collaborator ON ers.person_id = collaborator.id " +
            "         LEFT JOIN [WTDB].[dbo].events ON ers.event_id = events.id " +
            "         LEFT JOIN [WTDB].[dbo].event ON ers.event_id = event.id " +
            "         LEFT JOIN [WTDB].[dbo].event_types ON events.event_type_id = event_types.id " +
            "         LEFT JOIN [WTDB].[dbo].places ON events.place_id = places.id " +
            "         LEFT JOIN [WTDB].[dbo].[common.event_status_types] ON events.status_id = [common.event_status_types].id " +
            "         LEFT JOIN [WTDB].[dbo].education_methods ON events.education_method_id = education_methods.id " +
            "         LEFT JOIN [WTDB].[dbo].#Table1 AS tbl1 ON events.id = tbl1.e_id " +
            "         LEFT JOIN [WTDB].[dbo].#Table2 AS tbl2 ON events.id = tbl2.e_id " +
            "         LEFT JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id " +
            "         LEFT JOIN [WTDB].[dbo].org ON collaborators.org_id = org.id " +
            "         LEFT JOIN [WTDB].[dbo].regions ON regions.id = orgs.region_id " +
            "         LEFT JOIN [WTDB].[dbo].positions ON positions.id = collaborators.position_id " +
            " WHERE " +
            "    collaborators.code LIKE '%tren_muc%' " +
            "  AND events.finish_date BETWEEN @date_from AND @date_to " +
            " ORDER BY col_fullname, o_name, not_participate, f_date " +
            " DROP TABLE [WTDB].[dbo].#Table1; DROP TABLE [WTDB].[dbo].#Table2; "));

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
        reportString.AppendStr("<td class='header'>ИНН</td>");
        reportString.AppendStr("<td class='header'>Организация</td>");
        reportString.AppendStr("<td class='header'>Код региона</td>");
        reportString.AppendStr("<td class='header'>Тип поддержки</td>");
        reportString.AppendStr("<td class='header'>РЦК?</td>");
        reportString.AppendStr("<td class='header'>Код участника</td>");
        reportString.AppendStr("<td class='header'>ФИО участника</td>");
        reportString.AppendStr("<td class='header'>Присутствие</td>");
        reportString.AppendStr("<td class='header'>Отказ</td>");
        reportString.AppendStr("<td class='header'>id мероприятия</td>");
        reportString.AppendStr("<td class='header'>Код мероприятия</td>");
        reportString.AppendStr("<td class='header'>Мероприятие</td>");
        reportString.AppendStr("<td class='header'>Обучающая организация</td>");
        reportString.AppendStr("<td class='header'>id Учебной программаы</td>");
        reportString.AppendStr("<td class='header'>Учебная программа</td>");
        reportString.AppendStr("<td class='header'>Тип мероприятия</td>");
        reportString.AppendStr("<td class='header'>Дата</td>");
        reportString.AppendStr("<td class='header'>Место проведения</td>");
        reportString.AppendStr("<td class='header'>Тренер</td>");
        reportString.AppendStr("<td class='header'>NPS</td>");
        reportString.AppendStr("<td class='header'>Статус</td>");
        reportString.AppendStr("<td class='header'>Ответственный</td>");
        reportString.AppendStr("<td class='header'>День</td>");
        reportString.AppendStr("<td class='header'>Месяц</td>");
        reportString.AppendStr("<td class='header'>Год</td>");
        reportString.AppendStr("<td class='header'>Регион</td>");
        reportString.AppendStr("<td class='header'>Факт.Регион</td>");
        reportString.AppendStr("<td class='header'>Фамилия</td>");
        reportString.AppendStr("<td class='header'>Имя</td>");
        reportString.AppendStr("<td class='header'>Отчество</td>");
        reportString.AppendStr("<td class='header'>ИНН_ФИО</td>");
        reportString.AppendStr("<td class='header'>Код_ФИО</td>");
        reportString.AppendStr("<td class='header'>Форма проведения мероприятия</td>");
        reportString.AppendStr("<td class='header'>num</td>");
        reportString.AppendStr("<td class='header'>Должность</td>");
        reportString.AppendStr("<td class='header'>Телефон</td>");
        reportString.AppendStr("<td class='header'>Guid мероприятия по проекту</td>");
        reportString.AppendStr("<td class='header'>col_guid</td>");
        reportString.AppendStr("<td class='header'>РОИВ?</td>");
        reportString.AppendStr("<td class='header'>Партнер?</td>");
        reportString.AppendStr("<td class='header'>Коммерческое?</td>");
        reportString.AppendStr("<td class='header'>Расширенная поддержка?</td>");
        reportString.AppendStr("<td class='header'>guid</td>");
        reportString.AppendStr("<td class='header'>ID Результ.</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            reportString.AppendStr("<tr>");
            reportString.AppendStr("<td>" + data.o_inn + "</td>");
            reportString.AppendStr("<td>"+ data.o_name + "</td>");
            reportString.AppendStr("<td>"+ data.reg_code + "</td>");
            reportString.AppendStr("<td>"+ data.format_part + "</td>");
            reportString.AppendStr("<td>"+ data.is_rck + "</td>");
            reportString.AppendStr("<td>"+ data.col_code + "</td>");
            reportString.AppendStr("<td>"+ data.col_fullname + "</td>");
            reportString.AppendStr("<td>"+ data.is_assist + "</td>");
            reportString.AppendStr("<td>"+ data.not_participate + "</td>");
            reportString.AppendStr("<td>"+ data.e_id + "</td>");
            reportString.AppendStr("<td>"+ data.e_code + "</td>");
            reportString.AppendStr("<td>"+ data.e_name + "</td>");
            reportString.AppendStr("<td>"+ data.edu_org_name + "</td>");
            reportString.AppendStr("<td>"+ data.edu_meth_id + "</td>");
            reportString.AppendStr("<td>"+ data.edu_meth_name + "</td>");
            reportString.AppendStr("<td>"+ data.e_type_name + "</td>");
            reportString.AppendStr("<td>"+ Date(StrDate(data.f_date, false)) + "</td>");
            reportString.AppendStr("<td>"+ data.place_name + "</td>");
            reportString.AppendStr("<td>"+ data.lec_fio_s + "</td>");
            reportString.AppendStr("<td>"+ data.nps + "</td>");
            reportString.AppendStr("<td>"+ data.status_name + "</td>");
            reportString.AppendStr("<td>"+ data.pre_fio_s + "</td>");
            reportString.AppendStr("<td>"+ data.f_date_day + "</td>");
            reportString.AppendStr("<td>"+ data.f_date_month + "</td>");
            reportString.AppendStr("<td>"+ data.f_date_year + "</td>");
            reportString.AppendStr("<td>"+ data.reg_name + "</td>");
            reportString.AppendStr("<td>"+ data.fact_reg_name + "</td>");
            reportString.AppendStr("<td>"+ data.col_lastname + "</td>");
            reportString.AppendStr("<td>"+ data.col_firstname + "</td>");
            reportString.AppendStr("<td>"+ data.col_middlename + "</td>");
            reportString.AppendStr("<td>"+ data.col_inn_fullname + "</td>");
            reportString.AppendStr("<td>"+ data.col_code_fullname + "</td>");
            reportString.AppendStr("<td>"+ data.event_form + "</td>");
            reportString.AppendStr("<td>"+ data.num + "</td>");
            reportString.AppendStr("<td>"+ data.pos_name + "</td>");
            reportString.AppendStr("<td>"+ data.col_mobile_phone + "</td>");
            reportString.AppendStr("<td>"+ data.event_guid + "</td>");
            reportString.AppendStr("<td>"+ data.col_guid + "</td>");
            reportString.AppendStr("<td>"+ data.is_roiv + "</td>");
            reportString.AppendStr("<td>"+ data.is_partner + "</td>");
            reportString.AppendStr("<td>"+ data.is_commercial + "</td>");
            reportString.AppendStr("<td>"+ data.is_extended_support + "</td>");
            reportString.AppendStr("<td>"+ data.er_guid + "</td>");
            reportString.AppendStr("<td>"+ data.PK + "</td>");
            reportString.AppendStr("</tr>");

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
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/report_only_tren_muc/report_only_tren_muc_" + ParseDate(Date()) + ".xlsx");

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
    } catch (e) {
    }
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const("c_info"), 'info', 'ok');
}