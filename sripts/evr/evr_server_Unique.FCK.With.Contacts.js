// 7403655021424354932
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer ) {
    var agentId = 7403655021424354932;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7403655021424354932";
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
        eventResultList = ArrayDirect(XQuery("sql: " +
            " SELECT ers.id, " +
            "   eos.disp_name,  " +
            "   r.name AS region_name, " +
            "   os.code AS inn, " +
            "   os.name AS org_name, " +
            "   cs.code, " +
            "   cs.fullname, " +
            "   ps.name AS position_name, " +
            "   cs.email, " +
            "   c.data.value('(collaborator/system_email)[1]', 'varchar(max)') AS system_email, " +
            "   erts.name AS result_name" +
            " FROM [WTDB].[dbo].education_orgs eos " +
            "   INNER JOIN [WTDB].[dbo].education_org eo ON eos.id = eo.id " +
            "   INNER JOIN [WTDB].[dbo].events es ON eos.id = es.education_org_id " +
            "   INNER JOIN [WTDB].[dbo].event_results ers ON es.id = ers.event_id " +
            "   INNER JOIN [WTDB].[dbo].event_result_types erts ON ers.event_result_type_id = erts.id " +
            "   INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
            "   INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
            "   INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "   INNER JOIN [WTDB].[dbo].regions r ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') = r.id " +
            "   INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "WHERE eos.id IN (7086784658178339954, 6802513472431981115, 6148914691236517203, 6869760264243199229, 6938000483356197646,  " +
            "   6938001238782589341, 7002226526819926273, 6856735269184478330, 6870054939308859763, 6856726259800948992,  " +
            "   7143557734477881436, 7109417077652022021, 6148914691236517202, 7034790057599700358) "));

        total = ArrayCount(eventResultList);

        agent.refreshChart = 1;
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
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr class='header'>");
        reportString.AppendStr("<td>ID результата мероприятия</td>");
        reportString.AppendStr("<td>Обуч. организация</td>");
        reportString.AppendStr("<td>Название региона</td>");
        reportString.AppendStr("<td>ИНН</td>");
        reportString.AppendStr("<td>Название предприятия</td>");
        reportString.AppendStr("<td>Код обученного</td>");
        reportString.AppendStr("<td>ФИО обученного</td>");
        reportString.AppendStr("<td>Должность</td>");
        reportString.AppendStr("<td>Email</td>");
        reportString.AppendStr("<td>Тип результата мероприятия</td>");
        reportString.AppendStr("</tr>")

        for (eventResult in eventResultList) {
            reportString.AppendStr(
                "<tr>" +
                "<td>'" + eventResult.id + "</td>" +
                "<td>" + eventResult.disp_name + "</td>" +
                "<td>" + eventResult.region_name + "</td>" +
                "<td>'" + eventResult.inn + "</td>" +
                "<td>" + eventResult.org_name + "</td>" +
                "<td>" + eventResult.code + "</td>" +
                "<td>" + eventResult.fullname + "</td>" +
                "<td>" + eventResult.position_name + "</td>" +
                "<td>" + (eventResult.email != "" ? eventResult.email : eventResult.system_email) + "</td>" +
                "<td>" + eventResult.result_name + "</td>" +
                "</tr>");

            processed++;

            if (processed % 1000 == 0) {
                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if(processed % 10000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
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

        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/report_event_result/unique_fcc_contacts_" + ParseDate( Date() ) + ".xlsx");

        agent.state = 1;
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
            processed  + " processed",
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