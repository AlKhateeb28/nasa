// 7423020591490164427
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7423020591490164427;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7423020591490164427";
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
        courseList = ArrayDirect(XQuery("sql: " +
            " WITH _view AS (" +
            " SELECT course_id, YEAR(start_learning_date) AS year, COUNT(*) as cnt " +
            "               FROM [WTDB].[dbo].learnings " +
            "               WHERE state_id > 0 " +
            "                 AND start_learning_date IS NOT NULL " +
            "               GROUP BY course_id, YEAR(start_learning_date) " +
            "               UNION " +
            "               SELECT course_id, YEAR(start_learning_date) AS year, COUNT(*) as cnt " +
            "               FROM [WTDB].[dbo].active_learnings " +
            "               WHERE state_id > 0 " +
            "                 AND start_learning_date IS NOT NULL " +
            "               GROUP BY course_id, YEAR(start_learning_date) " +
            " ) " +
            " SELECT course_id, " +
            "       year, " +
            "       SUM(cnt) AS cnt, " +
            "       SUM(CASE WHEN year = 2019 THEN cnt ELSE 0 END) AS year19, " +
            "       SUM(CASE WHEN year = 2020 THEN cnt ELSE 0 END) AS year20, " +
            "       SUM(CASE WHEN year = 2021 THEN cnt ELSE 0 END) AS year21, " +
            "       SUM(CASE WHEN year = 2022 THEN cnt ELSE 0 END) AS year22, " +
            "       SUM(CASE WHEN year = 2023 THEN cnt ELSE 0 END) AS year23, " +
            "       SUM(CASE WHEN year = 2024 THEN cnt ELSE 0 END) AS year24 " +
            " INTO _tbl " +
            " FROM _view " +
            " GROUP BY course_id, year " +
            " ORDER BY course_id, year; " +
            " " +
            " SELECT cs.id, " +
            "       cs.code, " +
            "       cs.name, " +
            "       c.data.value('(//custom_elems/custom_elem[name=''expluatation_date'']/value)[1]', 'varchar(max)') AS expluatation_date, " +
            "       _tbl.year19, " +
            "       _tbl.year20, " +
            "       _tbl.year21, " +
            "       _tbl.year22, " +
            "       _tbl.year23, " +
            "       _tbl.year24 " +
            " INTO _tbl1 " +
            " FROM _tbl " +
            "         INNER JOIN [WTDB].[dbo].courses cs ON _tbl.course_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].course c ON cs.id = c.id " +
            " WHERE cs.code LIKE '%FCK-%' AND NOT cs.code LIKE '%-FCK-%' " +
            " ORDER BY cs.id, _tbl.year; " +
            " " +
            " SELECT id, " +
            "       code, " +
            "       name, " +
            "       expluatation_date," +
            "       CAST(expluatation_date as date) AS exp_date, " +
            "       SUM(year19) AS year19, " +
            "       SUM(year20) AS year20, " +
            "       SUM(year21) AS year21, " +
            "       SUM(year22) AS year22, " +
            "       SUM(year23) AS year23, " +
            "       SUM(year24) AS year24 " +
            " FROM _tbl1 " +
            " GROUP BY id, code, name, expluatation_date " +
            " ORDER BY exp_date; DROP TABLE _tbl; DROP TABLE _tbl1; "));

        total = ArrayCount(courseList);

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
        reportString.AppendStr("<td class='header' style='width: 200px;'>ID</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Код курса</td>");
        reportString.AppendStr("<td class='header' style='width: 700px;'>Название</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Дата ввода в эксплуатацию</td>");
        reportString.AppendStr("<td class='header'>2019</td>");
        reportString.AppendStr("<td class='header'>2020</td>");
        reportString.AppendStr("<td class='header'>2021</td>");
        reportString.AppendStr("<td class='header'>2022</td>");
        reportString.AppendStr("<td class='header'>2023</td>");
        reportString.AppendStr("<td class='header'>2024</td>");
        reportString.AppendStr("</tr>");

        currentCourseId = 0;

        for (course in courseList) {
            currentCourseId = course.id;

            reportString.AppendStr(
                "<tr>" +
                "<td>'" + course.id + "</td>" +
                "<td>" + course.code + "</td>" +
                "<td>" + course.name + "</td>" +
                "<td>" + StrDate(Date(course.expluatation_date),false) + "</td>" +
                "<td>" + course.year19 + "</td>" +
                "<td>" + course.year20 + "</td>" +
                "<td>" + course.year21 + "</td>" +
                "<td>" + course.year22 + "</td>" +
                "<td>" + course.year23 + "</td>" +
                "<td>" + course.year24 + "</td>" +
                "</tr>"
            );

            processed++;

            if (processed % 10 == 0) {
                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if (processed % 100 == 0) {
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
        excel.SaveAs("E:/Websoft/Reports/data/courses_by_years_" + ParseDate(Date()) + ".xlsx");

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