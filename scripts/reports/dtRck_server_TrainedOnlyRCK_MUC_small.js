// 7369897360496222886
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var msPerRecord = 0.001;
var agentId = 7369897360496222886;
var userId = curUserID;

if (LdsIsServer ) {
    loggerName = "agent_7369897360496222886";

    sLogMethod = "report";

    var startDate = Date();
    var prevDate = new Date();
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try {
        agent.message = "Обрабатывается... Получение данных";
        ws = sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.date_from: " + Param.date_from);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.date_to: " + Param.date_to);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        var date_from = Param.date_from == '' ? '01.01.2010 00:00:00' : Param.date_from;
        var date_to = Param.date_to == '' ? ParseDate(Date()) + ' 23:59:59' : Param.date_to;
        var folder = 'E:/Websoft/Reports/report_only_rck_muc/';
        var f_name = 'report_only_rck_muc_' + ParseDate(Date()) + '_small.xlsx';
        var f_url = folder + f_name;
        var excel = new ActiveXObject("Websoft.Office.Excel.Document");
        var report_string = new Binary();

        arr = ArrayDirect(XQuery("sql:" +
            " SET DATEFORMAT dmy; DECLARE @date_from datetime = '" + date_from + "'; DECLARE @date_to datetime = '" + date_to + "';" +
            " SELECT  CONCAT( '''', event_results.id ) AS PK," +
            " 	YEAR(events.finish_date) AS f_date_year," +
            " 	MONTH(events.finish_date) AS f_date_month," +
            " 	DAY(events.finish_date) AS f_date_day," +
            " 	CONCAT( '''', events.id ) AS e_id," +
            " 	events.code AS e_code," +
            " 	events.name AS e_name," +
            " 	event_types.name AS e_type_name," +
            " 	collaborators.code AS col_code," +
            " 	collaborators.fullname AS col_fullname," +
            " 	education_methods.name AS edu_meth_name," +
            " 	CONCAT( '''', orgs.code ) AS o_inn," +
            " 	orgs.name AS o_name," +
            " 	( SELECT regions.name FROM [WTDB].[DBO].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name," +
            " 	regions.name AS reg_name," +
            " 	CASE" +
            " 		WHEN event_results.is_assist = 'false' THEN 0" +
            " 		ELSE row_number() over( partition BY collaborators.code, '_', collaborators.fullname" +
            " 		ORDER BY collaborators.fullname, orgs.name, event_results.not_participate, events.finish_date )" +
            " 	END AS num," +
            "	event_result.data.value('(event_result/custom_elems/custom_elem[name=''month_report''])[1]/value[1]', 'varchar(max)') AS month," +
            "	event_result.data.value('(event_result/custom_elems/custom_elem[name=''year_report''])[1]/value[1]', 'varchar(max)') AS year," +
            " 	collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''is_dossier_rcc_exist''])[1]/value[1]', 'varchar(max)') AS is_dossier_rcc_exist" +
            " FROM event_results" +
            " INNER JOIN event_result ON event_results.id = event_result.id" +
            " INNER JOIN collaborators ON event_results.person_id = collaborators.id" +
            " INNER JOIN collaborator ON event_results.person_id = collaborator.id" +
            " INNER JOIN events ON event_results.event_id = events.id" +
            " INNER JOIN event_types	ON events.event_type_id = event_types.id" +
            " INNER JOIN education_methods ON events.education_method_id = education_methods.id" +
            " INNER JOIN orgs ON collaborators.org_id = orgs.id" +
            " INNER JOIN [WTDB].[DBO].org ON orgs.id = orgs.id " +
            " LEFT JOIN regions ON orgs.region_id = regions.id" +
            " WHERE collaborators.code LIKE '%rck_muc%'" +
            " 	AND events.finish_date BETWEEN @date_from AND @date_to" +
            " ORDER BY col_fullname, o_name, not_participate;"
        ));

        processed = 0;
        total = ArrayCount(arr);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обрабатывается...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = Date();

        report_string.AppendStr("<html><table>");

        report_string.AppendStr(
            "<tr>" +
            "<td>День</td>" +
            "<td>Месяц</td>" +
            "<td>Год</td>" +
            "<td>Код участника</td>" +
            "<td>ФИО участника</td>" +
            "<td>id мероприятия</td>" +
            "<td>Код мероприятия</td>" +
            "<td>Мероприятие</td>" +
            "<td>Учебная программа</td>" +
            "<td>ИНН</td>" +
            "<td>Организация</td>" +
            "<td>Регион</td>" +
            "<td>Факт.Регион</td>" +
            "<td>Учитывать в отчетности региона</td>" +
            "<td>num</td>" +
            "<td>ID Результ.</td>" +
            "<td>Тип результата</td>" +
            "<td>Месяц</td>" +
            "<td>Год</td>" +
            "<td>Есть в досье РЦК</td></tr>");

        for (elem in arr) {
            report_string.AppendStr(
                "<tr>" +
                "<td>" + elem.f_date_day + "</td>" +
                "<td>" + elem.f_date_month + "</td>" +
                "<td>" + elem.f_date_year + "</td>" +
                "<td>" + elem.col_code + "</td>" +
                "<td>" + elem.col_fullname + "</td>" +
                "<td>" + elem.e_id + "</td>" +
                "<td>" + elem.e_code + "</td>" +
                "<td>" + elem.e_name + "</td>" +
                "<td>" + elem.edu_meth_name + "</td>" +
                "<td>" + elem.o_inn + "</td>" +
                "<td>" + elem.o_name + "</td>" +
                "<td>" + elem.reg_name + "</td>" +
                "<td>" + elem.fact_reg_name + "</td>" +
                "<td>" + elem.report_reg_name + "</td>" +
                "<td>" + elem.num + "</td>" +
                "<td>" + elem.PK + "</td>" +
                "<td>" + elem.type_name + "</td>" +
                "<td>" + elem.month + "</td>" +
                "<td>" + elem.year + "</td>" +
                "<td>" + elem.is_dossier_rcc_exist + "</td></tr>");

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                ws = sendMessageToWebsocket(ws, agent);
            }
            if (processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }

            Sleep(10);
        }

        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Сохранение Excel файла...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = Date();

        report_string.AppendStr("</table></html>");
        excel.LoadHtmlString(report_string.GetStr(), "");
        excel.SaveAs(f_url);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Saved to " + f_url);
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.processed = processed;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Excel файл сохранен. Продолжительность " + duration;
        ws = sendMessageToWebsocket(ws, agent);
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