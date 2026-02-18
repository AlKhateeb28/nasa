// 7255035945814716775
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    try {
        var agentId = 7255035945814716775;
        var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7255035945814716775";
        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

        var total = 0;
        var processed = 0;
        var saved = 0;
        var skipped = 0;
        var notFound = 0;

        var excel = new ActiveXObject("Websoft.Office.Excel.Document");
        var reportString = new Binary();

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _view AS ( " +
            "    SELECT events.id, lectors.lector_fullname AS lector_fio " +
            "    FROM [WTDB].[dbo].events " +
            "        INNER JOIN [WTDB].[dbo].event e ON events.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
            "        INNER JOIN [WTDB].[dbo].lectors ON T.c.value('lector_id[1]','varchar(max)') = lectors.id " +
            " ), " +
            " _lectors AS ( " +
            "    SELECT id, " +
            "            lector_fio = STUFF( " +
            "                (SELECT '|' + lector_fio " +
            "                FROM _view tmp " +
            "                WHERE tmp.id = ls.id " +
            "                FOR XML PATH ('')), 1, 1, '') " +
            "    FROM _view ls " +
            "    GROUP BY ls.id " +
            " ) " +
            " SELECT es.id AS es_id, " +
            "       es.name AS es_name, " +
            "       ems.id AS ems_id, " +
            "       ems.name AS ems_name, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
            "       es.finish_date, " +
            "       es.education_org_name, " +
            "       _l.lector_fio " +
            " FROM [WTDB].[dbo].events es " +
            "         INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "         INNER JOIN _lectors _l ON es.id = _l.id " +
            "         INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            " WHERE es.code LIKE '%week%' "));

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
        reportString.AppendStr("<td class='header'>Название учебной программы</td>");
        reportString.AppendStr("<td class='header'>ID учебной программы</td>");
        reportString.AppendStr("<td class='header'>Название мероприятия</td>");
        reportString.AppendStr("<td class='header'>ID мероприятия</td>");
        reportString.AppendStr("<td class='header'>Преподаватель</td>");
        reportString.AppendStr("<td class='header'>NPS</td>");
        reportString.AppendStr("<td class='header'>Дата завершения мероприятия</td>");
        reportString.AppendStr("<td class='header'>Обучающая оргаанизация</td>");
        reportString.AppendStr("</tr>");


        for (data in dataList) {
            reportString.AppendStr(
                "<tr>" +
                "<td>" + data.ems_name + "</td>" +
                "<td>'" + data.ems_id + "</td>" +
                "<td>" + data.es_name + "</td>" +
                "<td>'" + data.es_id + "</td>" +
                "<td>" + data.lector_fio + "</td>" +
                "<td>" + data.nps + "</td>" +
                "<td>" + data.finish_date + "</td>" +
                "<td>" + data.education_org_name + "</td>" +
                "</tr>");

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                agent.notFound = notFound;
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
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/trash/events_week_" + ParseDate(Date()) + ".xlsx");

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
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
            saved + " saved, ",
            skipped + " skipped"
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