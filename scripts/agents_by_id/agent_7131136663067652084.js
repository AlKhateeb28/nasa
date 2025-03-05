// 7131136663067652084
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7131136663067652084;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7131136663067652084";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var skipped = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ds.id, " +
            "       ds.student_id, " +
            "       ds.student_fullname, " +
            "       ds.student_position, " +
            "       os.name AS org_name, " +
            "       os.code AS inn, " +
            "       ds.region_name, " +
            "       ds.date_selection, " +
            "       ds.result_selection, " +
            "       ds.date_position, " +
            "       ds.type_position, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit')  AS isOck " +
            " FROM [WTDB].[dbo].cc_dossier_rcc_employees ds " +
            "         LEFT JOIN [WTDB].[dbo].orgs os ON ds.subdivision_inn = os.code " +
            "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id "));

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
        reportString.AppendStr(".row_height {height: 25px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='header'>ОЦК?</td>");
        reportString.AppendStr("<td class='header'>ФИО</td>");
        reportString.AppendStr("<td class='header'>Должность</td>");
        reportString.AppendStr("<td class='header'>Организация</td>");
        reportString.AppendStr("<td class='header'>ИНН</td>");
        reportString.AppendStr("<td class='header'>Регион</td>");
        reportString.AppendStr("<td class='header'>Дата отбора</td>");
        reportString.AppendStr("<td class='header'>Результат отбора</td>");
        reportString.AppendStr("<td class='header'>Дата трудостройства</td>");
        reportString.AppendStr("<td class='header'>Тип трудоустройства</td>");
        reportString.AppendStr("<td class='header'>Рекомендован на подготовку</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            dossierDoc = tools.open_doc(data.id);

            if(dossierDoc != undefined) {
                typeValue = "";
                for(type in dossierDoc.TopElem.training_type) {
                    typeValue = typeValue + " | " +  type.value
                }

                reportString.AppendStr(
                    "<tr>" +
                    "<td>" + (data.isOck ? "Да" : "") + "</td>" +
                    "<td>" + data.student_fullname + "</td>" +
                    "<td>" + data.student_position + "</td>" +
                    "<td>" + data.org_name + "</td>" +
                    "<td>" + data.inn + "</td>" +
                    "<td>" + data.region_name + "</td>" +
                    "<td>" + StrDate(data.date_selection, false, false) + "</td>" +
                    "<td>" + data.result_selection + "</td>" +
                    "<td>" + StrDate(data.date_position, false, false) + "</td>" +
                    "<td>" + data.type_position + "</td>" +
                    "<td>" + typeValue + "</td>" +
                    "</tr>");
            } else {
                skipped++;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + data.id + " is not exist!");
            }

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
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
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/report_ock_2025/report_ock_" + ParseDate(Date()) + ".xlsx");

        agent.state = 1;
        agent.processed = processed;
        agent.skipped = skipped;
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