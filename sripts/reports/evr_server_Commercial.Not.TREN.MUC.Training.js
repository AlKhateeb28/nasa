// AGENT 7314549822988115287
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7314549822988115287;
    var userId = curUserID;
    var msPerRecord = 0.001;

    sLogMethod = "report"

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7314549822988115287";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try{
        agent.message = "Получение данных...";
        if(ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.date_from: " + Param.date_from);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.date_to: " + Param.date_to);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        var date_from = Param.date_from == '' ? '01.01.2010 00:00:00' : Param.date_from
        var date_to = Param.date_to == '' ? ParseDate( Date() ) + ' 23:59:59' : Param.date_to
        var folder = 'E:/Websoft/Reports/report_not_tren_muc_com/'
        var f_name = 'report_not_tren_muc_com_' + ParseDate( Date() ) + '.xlsx'
        var f_url = folder + f_name
        var excel = new ActiveXObject("Websoft.Office.Excel.Document")
        var report_string = new Binary()

        arr = ArrayDirect( XQuery( "sql: " +
            " SET DATEFORMAT dmy; DECLARE @date_from datetime = '" + date_from + "'; DECLARE @date_to datetime = '" + date_to + "';" +
            " WITH TempTable1 AS (" +
            "     SELECT events.id AS e_id, lectors.lector_fullname AS lec_fio" +
            " FROM [WTDB].[dbo].events" +
            " LEFT JOIN [WTDB].[dbo].event e ON events.id = e.id" +
            " CROSS APPLY e.data.nodes('event/lectors/lector') T(c)" +
            " LEFT JOIN [WTDB].[dbo].lectors ON T.c.value('lector_id[1]','varchar(max)') = lectors.id" +
            " WHERE events.finish_date BETWEEN @date_from AND @date_to)" +
            " SELECT e_id, lec_fio_s = STUFF ((" +
            "     SELECT '|' + lec_fio" +
            " FROM TempTable1 tt2" +
            " WHERE tt2.e_id = tt1.e_id" +
            " FOR XML PATH ('')" +
            " )" +
            " , 1, 1, ''" +
            " )" +
            " INTO #Table1" +
            " FROM TempTable1 tt1" +
            " GROUP BY e_id;" +
            " WITH TempTable2 AS (" +
            "     SELECT events.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS pre_fio" +
            " FROM [WTDB].[dbo].events LEFT JOIN [WTDB].[dbo].event e ON events.id = e.id" +
            " CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c)" +
            " WHERE events.finish_date BETWEEN @date_from AND @date_to)" +
            " SELECT e_id, pre_fio_s = STUFF ((" +
            "     SELECT '|' + pre_fio" +
            " FROM TempTable2 tt2" +
            " WHERE tt2.e_id = tt1.e_id" +
            " FOR XML PATH ('')" +
            " )" +
            " , 1, 1, ''" +
            " )" +
            " INTO #Table2" +
            " FROM TempTable2 tt1" +
            " GROUP BY e_id;" +
            " SELECT CONCAT( '''', event_results.id ) AS PK," +
            "     event_results.is_assist," +
            "     event_results.not_participate," +
            "     event_result_types.name AS event_result_type," +
            "     events.finish_date AS f_date," +
            "     YEAR(events.finish_date) AS f_date_year," +
            "     MONTH(events.finish_date) AS f_date_month," +
            "     DAY(events.finish_date) AS f_date_day," +
            "     CONCAT( '''', events.id ) AS e_id," +
            "     events.code AS e_code," +
            "     events.name AS e_name," +
            "     event_types.name AS e_type_name," +
            "     collaborators.code AS col_code," +
            "     collaborators.fullname AS col_fullname," +
            "     places.name AS place_name," +
            "     [common.event_status_types].name AS status_name," +
            "     education_methods.name AS edu_meth_name," +
            "     CONCAT( '''', education_methods.id  ) AS edu_meth_id," +
            "     events.education_org_name AS edu_org_name," +
            "     #Table1.lec_fio_s AS lec_fio_s," +
            "     #Table2.pre_fio_s AS pre_fio_s," +
            "     event.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps," +
            "     event.data.value('(event/custom_elems/custom_elem[name=''month_otch''])[1]/value[1]', 'varchar(max)') AS month_otch," +
            "     CONCAT( '''', orgs.code ) AS o_inn," +
            "     orgs.name AS o_name," +
            "     org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part," +
            "     CASE" +
            " WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            " ELSE '-'" +
            " END AS is_rck," +
            "     CASE" +
            " WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            " ELSE '-'" +
            " END AS is_roiv," +
            "     CASE" +
            " WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            " ELSE '-'" +
            " END AS is_partner," +
            "     CASE" +
            " WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_commercial''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            " ELSE '-'" +
            " END AS is_commercial," +
            "     CASE" +
            " WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_extended_support''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            " ELSE '-'" +
            " END AS is_extended_support," +
            "     org.data.value('(org/custom_elems/custom_elem[name=''region_code''])[1]/value[1]', 'varchar(max)') AS reg_code," +
            "     ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name," +
            "     regions.name AS reg_name," +
            "     collaborator.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS col_lastname," +
            "     collaborator.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS col_firstname," +
            "     collaborator.data.value('(collaborator/middlename)[1]', 'varchar(max)') AS col_middlename," +
            "     collaborator.data.value('(collaborator/mobile_phone)[1]', 'varchar(max)') AS col_mobile_phone," +
            "     collaborator.data.value('(collaborator/system_email)[1]', 'varchar(max)') AS system_email," +
            "     CONCAT( collaborators.code, '_', collaborators.fullname ) AS col_code_fullname," +
            "     CASE" +
            " WHEN event_results.is_assist = 'false' THEN 0" +
            " ELSE row_number() over( partition BY collaborators.code, '_', collaborators.fullname" +
            " ORDER BY collaborators.fullname, orgs.name, event_results.not_participate, events.finish_date )" +
            " END AS num," +
            "     CONCAT( '''', orgs.code, '_', collaborators.fullname ) AS col_inn_fullname," +
            "     CONCAT( '''', orgs.code, '_', orgs.name ) AS o_inn_name," +
            "     CASE" +
            " WHEN events.event_form = 'conference' THEN 'конференция'" +
            " WHEN events.event_form = 'examination' THEN 'сертификация'" +
            " WHEN events.event_form = 'game' THEN 'деловая игра'" +
            " WHEN events.event_form = 'meeting' THEN 'стартовое совещание'" +
            " WHEN events.event_form = 'meth_day' THEN 'методический день'" +
            " WHEN events.event_form = 'pered_prog' THEN 'передача программ'" +
            " WHEN events.event_form = 'praktikum' THEN 'тренинг-площадка'" +
            " WHEN events.event_form = 'scan' THEN 'сканирование'" +
            " WHEN events.event_form = 'seminar' THEN 'семинар'" +
            " WHEN events.event_form = 'stagirovka' THEN 'стажировка'" +
            " WHEN events.event_form = 'supervis_tren' THEN 'супервизия тренеров'" +
            " WHEN events.event_form = 'training' THEN 'тренинг'" +
            " WHEN events.event_form = 'webinar' THEN 'вебинар'" +
            " ELSE ''" +
            " END AS event_form" +
            "     , positions.name AS pos_name" +
            "     , event_result.data.value('(event_result/custom_elems/custom_elem[name=''event_guid''])[1]/value[1]', 'varchar(max)') AS event_guid" +
            "     , event_result.data.value('(event_result/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS er_guid" +
            "     , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS col_guid" +
            " FROM [WTDB].[dbo].event_results" +
            " LEFT JOIN [WTDB].[dbo].event_result ON event_results.id = event_result.id" +
            " LEFT JOIN [WTDB].[dbo].collaborators ON event_results.person_id = collaborators.id" +
            " LEFT JOIN [WTDB].[dbo].collaborator ON event_results.person_id = collaborator.id" +
            " LEFT JOIN [WTDB].[dbo].events ON event_results.event_id = events.id" +
            " LEFT JOIN [WTDB].[dbo].event ON event_results.event_id = event.id" +
            " LEFT JOIN [WTDB].[dbo].event_result_types ON event_results.event_result_type_id = event_result_types.id" +
            " LEFT JOIN [WTDB].[dbo].event_types ON events.event_type_id = event_types.id" +
            " LEFT JOIN [WTDB].[dbo].places ON events.place_id = places.id" +
            " LEFT JOIN [WTDB].[dbo].[common.event_status_types] ON events.status_id = [common.event_status_types].id" +
            " LEFT JOIN [WTDB].[dbo].education_methods ON events.education_method_id = education_methods.id" +
            " LEFT JOIN #Table1 ON events.id = #Table1.e_id" +
            " LEFT JOIN #Table2 ON events.id = #Table2.e_id" +
            " LEFT JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id" +
            " LEFT JOIN [WTDB].[dbo].org ON collaborators.org_id = org.id" +
            " LEFT JOIN [WTDB].[dbo].regions ON regions.id = orgs.region_id" +
            " LEFT JOIN [WTDB].[dbo].positions ON positions.id = collaborators.position_id" +
            " WHERE" +
            " collaborators.code NOT LIKE '%tren_muc%'" +
            " AND events.finish_date BETWEEN @date_from AND @date_to" +
            " AND event_result_types.code = 'com_event_result'" +
            " ORDER BY col_fullname, o_name, not_participate, f_date; DROP TABLE #Table1; DROP TABLE #Table2;"));

        processed = 0;
        total = ArrayCount(arr);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.refreshChart = 1;
        agent.message = "Обработка данных...";
        if(ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        report_string.AppendStr( '<html><table>' )
        report_string.AppendStr( '<tr>' )
        report_string.AppendStr( '<td>ИНН</td><td>Организация</td><td>Код региона</td><td>Тип поддержки</td><td>РЦК?</td><td>Код участника</td><td>ФИО участника</td><td>Присутствие</td><td>Отказ</td><td>id мероприятия</td><td>Код мероприятия</td><td>Мероприятие</td><td>Обучающая организация</td><td>id Учебной программаы</td><td>Учебная программа</td><td>Тип мероприятия</td><td>Дата</td><td>Место проведения</td><td>Тренер</td><td>NPS</td><td>Статус</td><td>Ответственный</td><td>День</td><td>Месяц</td><td>Год</td><td>Регион</td><td>Факт.Регион</td><td>Фамилия</td><td>Имя</td><td>Отчество</td><td>ИНН_ФИО</td><td>Код_ФИО</td><td>Форма проведения мероприятия</td><td>num</td><td>Должность</td><td>Телефон</td><td>Внутренний email</td><td>Guid мероприятия по проекту</td><td>col_guid</td><td>РОИВ?</td><td>Партнер?</td><td>Коммерческое?</td><td>Расширенная поддержка?</td><td>guid</td><td>ID Результ.</td><td>Тип результата</td><td>Месяц отчёта</td>' )
        report_string.AppendStr( '</tr>' )

        numb = 1
        for ( elem in arr ) {
            report_string.AppendStr( '<tr>' )
            report_string.AppendStr( '<td>'+elem.o_inn+'</td><td>'+elem.o_name+'</td><td>'+elem.reg_code+'</td><td>'+elem.format_part+'</td><td>'+elem.is_rck+'</td><td>'+elem.col_code+'</td><td>'+elem.col_fullname+'</td><td>'+elem.is_assist+'</td><td>'+elem.not_participate+'</td><td>'+elem.e_id+'</td><td>'+elem.e_code+'</td><td>'+elem.e_name+'</td><td>'+elem.edu_org_name+'</td><td>'+elem.edu_meth_id+'</td><td>'+elem.edu_meth_name+'</td><td>'+elem.e_type_name+'</td><td>'+Date( StrDate( elem.f_date, false ) )+'</td><td>'+elem.place_name+'</td><td>'+elem.lec_fio_s+'</td><td>'+elem.nps+'</td><td>'+elem.status_name+'</td><td>'+elem.pre_fio_s+'</td><td>'+elem.f_date_day+'</td><td>'+elem.f_date_month+'</td><td>'+elem.f_date_year+'</td><td>'+elem.reg_name+'</td><td>'+elem.fact_reg_name+'</td><td>'+elem.col_lastname+'</td><td>'+elem.col_firstname+'</td><td>'+elem.col_middlename+'</td><td>'+elem.col_inn_fullname+'</td><td>'+elem.col_code_fullname+'</td><td>'+elem.event_form+'</td><td>'+elem.num+'</td><td>'+elem.pos_name+'</td><td>'+elem.col_mobile_phone+'</td><td>'+elem.system_email+'</td><td>'+elem.event_guid+'</td><td>'+elem.col_guid+'</td><td>'+elem.is_roiv+'</td><td>'+elem.is_partner+'</td><td>'+elem.is_commercial+'</td><td>'+elem.is_extended_support+'</td><td>'+elem.er_guid+'</td><td>'+elem.PK+'</td><td>'+elem.event_result_type+'</td><td>'+elem.month_otch+'</td>')
            report_string.AppendStr('</tr>')

            processed++;

            if(processed % 100 == 0) {
                agent.processed = processed;
                if(ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if(processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
                );
            }
        }

        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Сохраняем Excel файл...";
        agent.refreshChart = 1;
        if(ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        report_string.AppendStr( '</table></html>' )
        excel.LoadHtmlString( report_string.GetStr(), "" )
        excel.SaveAs( f_url )

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Saved to " + f_url);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) );
        agent.message = "Закончено. Продолжительность " + duration;
        if(ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        try {
            ws.Send("close");
        } catch (e) {}
    } catch( e ) {
        agent.state = 2;
        agent.errorMessage = e;

        try {
            ws.Send("close");
        } catch (e) {}

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        excel.Application.Quit();
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok' );
}