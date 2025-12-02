// 7195843694249801726 №6
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer ) {
    var agentId = 7195843694249801726;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7195843694249801726";
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
            start = "01.01.2018 00:00:00";
        }

        finish = Param.finish;
        if(finish == "") {
            finish = "31.12.2100 23:59:59";
        }

        dataList = ArrayDirect(XQuery("sql: " +
            " SET DATEFORMAT dmy; " +
            " DECLARE " + "@from_date datetime = '" + start + "'; " +
            " DECLARE " + "@to_date datetime = '" + finish + "'; " +
            " WITH _view AS ( " +
            "        SELECT id, person_id, course_id, start_usage_date, last_usage_date, score, state_id " +
            "        FROM [WTDB].[dbo].learnings " +
            "        WHERE start_usage_date BETWEEN @from_date AND @to_date " +
            "    UNION " +
            "        SELECT id, person_id, course_id, start_usage_date, last_usage_date, score, state_id " +
            "        FROM [WTDB].[dbo].active_learnings als " +
            "        WHERE start_usage_date BETWEEN @from_date AND @to_date " +
            " ) " +
            " SELECT _view.id, " +
            "                   cs.fullname AS fullname, " +
            "                   cs.email AS email, " +
            "                   os.name AS org_name, " +
            "                   CONCAT( '''', os.code ) AS inn, " +
            "                   crs.code AS course_code, " +
            "                   crs.name AS course_name, " +
            "                   _view.start_usage_date AS start, " +
            "                   _view.last_usage_date AS finish, " +
            "                   _view.score, " +
            "                   clss.name AS state, " +
            "                   o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part, " +
            "                   IIF(o.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'bit') = 'true', 'Да', 'Нет') AS is_project_ended " +
            " FROM _view " +
            "         INNER JOIN [WTDB].[dbo].courses crs ON _view.course_id = crs.id " +
            "         INNER JOIN [WTDB].[dbo].collaborators cs ON _view.person_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "         INNER JOIN [WTDB].[dbo].[common.learning_states] clss ON _view.state_id = clss.id " +
            " ORDER BY fullname "));

        // TOP 1040000

        total = ArrayCount(dataList);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Total: " + total);

        agent.refreshChart = 1;
        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr( "<html>");
        reportString.AppendStr("<style>");
        reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81);}");
        reportString.AppendStr(".row_height {height: 2px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr( "<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='header'>ID</td>");
        reportString.AppendStr("<td class='header'>ФИО</td>");
        reportString.AppendStr("<td class='header'>Email</td>");
        reportString.AppendStr("<td class='header'>ИНН</td>");
        reportString.AppendStr("<td class='header'>Название организации</td>");
        reportString.AppendStr("<td class='header'>Код курса</td>");
        reportString.AppendStr("<td class='header'>Название курса</td>");
        reportString.AppendStr("<td class='header'>Дата завершения</td>");
        reportString.AppendStr("<td class='header'>Статус</td>");
        reportString.AppendStr("<td class='header'>Дата активации</td>");
        reportString.AppendStr("<td class='header'>Баллы</td>");
        reportString.AppendStr("<td class='header'>Формат участия</td>");
        reportString.AppendStr("<td class='header'>Проект завершен</td>");
        reportString.AppendStr("</tr>");

        count = 0;

        for (data in dataList) {
            reportString.AppendStr(
                "<tr>" +
                "<td>'" + data.id + "</td>" +
                "<td>'" + data.fullname + "</td>" +
                "<td>'" + data.email + "</td>" +
                "<td>'" + data.inn + "</td>" +
                "<td>'" + data.org_name + "</td>" +
                "<td>'" + data.course_code + "</td>" +
                "<td>'" + data.course_name + "</td>" +
                "<td>'" + (data.finish == "" ? "" : StrDate(data.finish, false, false)) + "</td>" +
                "<td>'" + data.state + "</td>" +
                "<td>'" + (data.start == "" ? "" : StrDate(data.start, false, false)) + "</td>" +
                "<td>'" + data.score + "</td>" +
                "<td>'" + data.format_part + "</td>" +
                "<td>'" + data.is_project_ended + "</td>" +
                "</tr>");

            processed++;

            count++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if (processed % 100000 == 0) {
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
        excel.SaveAs("E:/Websoft/Reports/report_org_learnings_full/report_org_all_learnings_all_states_" + ParseDate(Date()) + ".xlsx");

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