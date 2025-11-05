// 7217075736311895442
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7217075736311895442;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7217075736311895442";
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

    paramCheckDate = Param.check_date;

    if(paramCheckDate != "") {
        try {
            checkDateParts = paramCheckDate.split(" ")[0].split(".");

            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT als.id AS learning_id, " +
                "       css.name AS course_name, " +
                "       cs.id AS coll_id, " +
                "       cs.fullname, " +
                "       os.id AS org_id, " +
                "       os.code AS inn, " +
                "       os.name AS org_name, " +
                "       c.data.value('(//doc_info/creation)[1]/date[1]', 'datetime') AS create_date, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS INT)) AS in_program, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_ock''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS INT)) AS is_ock, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''With_no_right''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS INT)) AS with_no_right, " +
                "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_a_commerce_client''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS INT)) AS is_commerce " +
                " FROM [WTDB].[dbo].active_learnings als " +
                "       INNER JOIN [WTDB].[dbo].courses css ON als.course_id = css.id " +
                "       INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id " +
                "       INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
                "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                " WHERE DAY(als.creation_date) = " + checkDateParts[0] +
                "       AND MONTH(als.creation_date) = " + checkDateParts[1] +
                "       AND YEAR(als.creation_date) = " + checkDateParts[2]));



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
            reportString.AppendStr("<td class='header' style='width: 200px;'>ID курса</td>");
            reportString.AppendStr("<td class='header' style='width: 300px;'>Название курса</td>");
            reportString.AppendStr("<td class='header' style='width: 200px;'>ID сотрудника</td>");
            reportString.AppendStr("<td class='header' style='width: 300px;'>ФИО</td>");
            reportString.AppendStr("<td class='header' style='width: 100px;'>Дата создания</td>");
            reportString.AppendStr("<td class='header' style='width: 100px;'>Время создания</td>");
            reportString.AppendStr("<td class='header' style='width: 200px;'>ID организации</td>");
            reportString.AppendStr("<td class='header' style='width: 100px;'>ИНН</td>");
            reportString.AppendStr("<td class='header' style='width: 400px;'>Организация</td>");
            reportString.AppendStr("<td class='header'>in_program</td>");
            reportString.AppendStr("<td class='header'>is_rck</td>");
            reportString.AppendStr("<td class='header'>is_ock</td>");
            reportString.AppendStr("<td class='header'>is_fcc</td>");
            reportString.AppendStr("<td class='header'>is_roiv</td>");
            reportString.AppendStr("<td class='header'>is_partner</td>");
            reportString.AppendStr("<td class='header'>with_no_right</td>");
            reportString.AppendStr("<td class='header'>is_commerce</td>");
            reportString.AppendStr("</tr>");

            for (data in dataList) {
                reportString.AppendStr(
                    "<tr>" +
                    "<td>'" + data.learning_id + "</td>" +
                    "<td>" + data.course_name + "</td>" +
                    "<td>'" + data.coll_id + "</td>" +
                    "<td>" + data.fullname + "</td>" +
                    "<td>" + StrDate(data.create_date, false, false) + "</td>" +
                    "<td>" + Hour(data.create_date) + ":" + Minute(data.create_date) + "</td>" +
                    "<td>'" + data.org_id + "</td>" +
                    "<td>" + data.inn + "</td>" +
                    "<td>" + data.org_name + "</td>" +
                    "<td style='text-align: center'>" + data.in_program + "</td>" +
                    "<td style='text-align: center'>" + data.is_rck + "</td>" +
                    "<td style='text-align: center'>" + data.is_ock + "</td>" +
                    "<td style='text-align: center'>" + data.is_fcc + "</td>" +
                    "<td style='text-align: center'>" + data.is_roiv + "</td>" +
                    "<td style='text-align: center'>" + data.is_partner + "</td>" +
                    "<td style='text-align: center'>" + data.with_no_right + "</td>" +
                    "<td style='text-align: center'>" + data.is_commerce + "</td>" +
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
            excel.LoadHtmlString(reportString.GetStr(), "");
            excel.SaveAs("E:/Websoft/Reports/trash/active_learnings_by_date_" + ParseDate(Date(paramCheckDate)) + ".xlsx");

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
    } else {
        agent.state = 1;
        agent.processed = processed;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Пустой параметр даты выборки. Закончено.";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}