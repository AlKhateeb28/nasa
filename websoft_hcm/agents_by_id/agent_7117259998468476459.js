// 7117259998468476459
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isCollaboratorExistsInRccDossier(collsCode) {
    //return tools.get_doc_by_key("cc_dossier_trained_by_rcc", "student_code", collsCode) != null;
    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].cc_dossier_trained_by_rccs " + 
        " WHERE student_code = '" + collsCode + "'"));

    if (ArrayCount(dossierList) > 0) {
        return true;
    } 

    return false;
}

if (LdsIsServer) {
    try {
        var agentId = 7117259998468476459;
        var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7117259998468476459";

        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

        var total = 0;
        var processed = 0;

        var excelDoc = tools.get_object_assembly('Excel');
        var reportString = new Binary();

        var dateFrom = Param.date_from == '' ? '01.01.2025 00:00:00' : Param.date_from

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        dataList = ArrayDirect(XQuery("sql: " +
            " IF OBJECT_ID('tempdb..#lectors') IS NOT NULL " +
	        "       DROP TABLE #lectors; " +
            "  " +
            " IF OBJECT_ID('tempdb..#lec1') IS NOT NULL " +
            "       DROP TABLE #lec1; " +
            "  " +
            " IF OBJECT_ID('tempdb..#preparations') IS NOT NULL " +
            "       DROP TABLE #preparations; " +
            " IF OBJECT_ID('tempdb..#prep1') IS NOT NULL " +
            "	    DROP TABLE #prep1; " +
            "  " +
            " SET DATEFORMAT dmy; " +
            " DECLARE @date_from datetime = '" + dateFrom + "'; " +
            " DECLARE @date_to datetime = '31.12.2099 23:59:59'; " +
            "  " +             
            " SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS lector_fio " +
            " INTO #lec1 " +
            " FROM[WTDB].[dbo].events es " +
            "       LEFT JOIN[WTDB].[dbo].event e ON es.id = e.id " +
            "       CROSS APPLY e.data.nodes('event/tutors/tutor') T(c) " +
            "       WHERE es.start_date BETWEEN @date_from AND @date_to; " +            
            "  " +
            " SELECT id, lector_fio = STUFF((" +
            "       SELECT '|' + lector_fio " +
            "       FROM #lec1 tmp " +
            "       WHERE tmp.id = ls.id " +
            "           FOR XML PATH('') " +
            "           ), 1, 1, '') " +
            " INTO #lectors" +
            " FROM #lec1 ls " +
            " GROUP BY id; " +
            " " +            
            " SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio " +
            "       INTO #prep1" + 
            " FROM[WTDB].[dbo].events AS es " +
            "       LEFT JOIN[WTDB].[dbo].event AS e ON es.id = e.id " +
            "       CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c) " +
            " WHERE es.start_date BETWEEN @date_from AND @date_to; " +
            "  " +            
            " SELECT id, preparation_fio = STUFF((" +
            "       SELECT '|' + pre_fio " +
            "       FROM #prep1 tmp " +
            "       WHERE tmp.id = ps.id " +
            "               FOR XML PATH('') " +
            "               ), 1, 1, '') " +
            " INTO #preparations " +
            " FROM #prep1 ps " +
            "       GROUP BY id; " +            
            "  " +
            " SELECT rs.name AS region_name, " +
            "       f_rs.name AS fact_region_name, " +
            "       rep_rs.name AS rep_region_name, " +
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
            "       tls.lector_fio AS lector_fio, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
            "       cests.name AS status_name, " +
            "       tps.preparation_fio AS preparation_fio, " +
            "       CASE " +
            "           WHEN ers.is_assist = 'false' THEN 0 " +
            "           ELSE row_number() over(partition BY cs.code, '_', cs.fullname ORDER BY cs.fullname, os.name, ers.not_participate, es.finish_date) " +
            "       END AS num, " +
            "       DAY(es.finish_date) AS day, " +
            "       MONTH(es.finish_date) AS month, " +
            "       YEAR(es.finish_date) AS year, " +
            "       ers.id AS event_result_id, " +
            "       erts.name AS result_type_name, " +
            "       ers.event_start_date, " +
            "       er.data.value('(//custom_elems/custom_elem[name=''month_report''])[1]/value[1]', 'varchar(max)') AS report_month, " +
            "       er.data.value('(//custom_elems/custom_elem[name=''year_report''])[1]/value[1]', 'varchar(max)') AS report_year, " +
            "       e.data.value('(//comment)[1]', 'varchar(max)') AS comment " +
            " FROM [WTDB].[dbo].event_results AS ers " +
            "       INNER JOIN [WTDB].[dbo].event_result AS er ON ers.id = er.id " +
            "       INNER JOIN [WTDB].[dbo].events AS es ON ers.event_id = es.id AND es.education_org_id = 6856734512956512163 AND es.start_date BETWEEN @date_from AND @date_to " +
            "       INNER JOIN [WTDB].[dbo].event AS e ON es.id = e.id " +
            "       LEFT JOIN [WTDB].[dbo].event_result_types AS erts ON ers.event_result_type_id = erts.id " +
            "       LEFT JOIN [WTDB].[dbo].education_methods AS ems ON es.education_method_id = ems.id " +
            "       INNER JOIN [WTDB].[dbo].education_method AS em ON ems.id = em.id " +
            "       INNER JOIN [WTDB].[dbo].collaborators AS cs ON ers.person_id = cs.id " +
            "       INNER JOIN [WTDB].[dbo].collaborator AS c ON cs.id = c.id " +
            "       LEFT JOIN [WTDB].[dbo].positions AS ps ON cs.position_id = ps.id " +
            "       INNER JOIN [WTDB].[dbo].orgs AS os ON cs.org_id = os.id " +
            "       INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id " +
            "       INNER JOIN [WTDB].[dbo].regions AS rs ON os.region_id = rs.id " +
            "       INNER JOIN [WTDB].[dbo].regions AS f_rs ON o.data.value('(//custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = f_rs.id " +
            "       LEFT JOIN [WTDB].[dbo].regions AS rep_rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rep_rs.id " +
            "       LEFT JOIN #lectors AS tls ON e.id = tls.id " +
            "       LEFT JOIN #preparations AS tps ON e.id = tps.id " +
            "       INNER JOIN [WTDB].[dbo].[common.event_status_types] AS cests ON es.status_id = cests.id " +
            " ORDER BY cs.fullname, os.name, es.finish_date; " +
            "  " +
            " IF OBJECT_ID('tempdb..#preparations') IS NOT NULL " +
            "       DROP TABLE #preparations; " +
            " IF OBJECT_ID('tempdb..#prep1') IS NOT NULL " +
            "	    DROP TABLE #prep1; " +            
            "  " +
            " IF OBJECT_ID('tempdb..#lectors') IS NOT NULL " +
	        "       DROP TABLE #lectors; " +
            "  " +
            " IF OBJECT_ID('tempdb..#lec1') IS NOT NULL " +
            "       DROP TABLE #lec1; "));

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
        reportString.AppendStr("<td class='header'>Учитывать в отчетности региона</td>");
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
        reportString.AppendStr("<td class='header'>Дата создания результата мероприятия</td>");
        reportString.AppendStr("<td class='header'>Месяц отчета</td>");
        reportString.AppendStr("<td class='header'>Год отчета</td>");
        reportString.AppendStr("<td class='header'>Есть в досье</td>");
        reportString.AppendStr("<td class='header'>Коментарий</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            fullFIO = data.fullname + " #empty #empty";

            fioList = fullFIO.split(" ");

            reportString.AppendStr(
                "<tr>" +
                "<td>" + data.region_name + "</td>" +
                "<td>" + data.fact_region_name + "</td>" +
                "<td>" + data.rep_region_name + "</td>" +
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
                "<td>" + StrDate(data.start_date, false, false) + "</td>" +
                "<td>" + StrDate(data.finish_date, false, false) + "</td>" +
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
                "<td>" + StrDate(data.event_start_date, true, false) + "</td>" +
                "<td>" + data.report_month + "</td>" +
                "<td>" + data.report_year + "</td>" +
                "<td>" + (isCollaboratorExistsInRccDossier(data.person_code) ? "Да": "Нет") + "</td>" +
                "<td>" + data.comment + "</td>" +
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
            excelDoc.SaveAs("E:/Websoft/Reports/report_rck_2025/report_rck_" + ParseDate(Date()) + ".xlsx");
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