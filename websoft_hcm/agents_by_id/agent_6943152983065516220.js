// 6943152983065516220
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 6943152983065516220;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_6943152983065516220";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        var fromDate = Param.date_from == '' ? '01.01.2018 00:00:00' : Param.date_from;
        var toDate = Param.date_to == '' ? ParseDate( Date() ) + ' 23:59:59' : Param.date_to;

        var excel = new ActiveXObject("Websoft.Office.Excel.Document");
        var reportString = new Binary();

        extraCondition = ( Param.with_muc == '0' ) ? " cs.code NOT LIKE '%_muc%' AND " : "";

        sql = " SET DATEFORMAT dmy " +
            " DECLARE @date_from " + "datetime = '" + fromDate + "'" +
            " DECLARE @date_to " + "datetime = '" + toDate + "'" +
            " SELECT CONCAT( '''', cs.id ) AS PK," +
            "       cs.code AS col_code," +
            "       cs.fullname AS col_fullname," +
            "       cs.login AS col_login," +
            "       cs.email AS col_email," +
            "       c.data.value('(collaborator/system_email)[1]', 'varchar(max)') AS col_system_email," +
            "       cs.position_name AS position_name," +
            "       orgs.name AS o_name," +
            "       CONCAT( '''', orgs.code ) AS o_inn," +
            "       CASE" +
            "           WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            "           ELSE '-'" +
            "           END AS is_rck" +
            "        , CASE" +
            "              WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            "              ELSE '-'" +
            "           END AS is_roiv" +
            "        , CASE" +
            "              WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'" +
            "              ELSE '-'" +
            "           END AS is_partner" +
            "        , org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part" +
            "        , org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') AS fact_region_id" +
            "        ,CASE" +
            "             WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_past_member''])[1]/value[1]', 'varchar(max)') = 'true' THEN 'Да'" +
            "             ELSE 'Нет'" +
            "           END AS is_past_member" +
            "        ,CASE" +
            "             WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') = 'true' THEN 'Да'" +
            "             ELSE 'Нет'" +
            "           END AS is_project_ended," +
            "       c.created AS col_created," +
            "       c.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS guid," +
            "       c.data.value('(collaborator/doc_info/creation/user_login)[1]', 'varchar(max)') AS col_created_by," +
            "       cs.modification_date AS col_modificated," +
            "       '' AS ar_id," +
            "       '' AS ar_name," +
            "       cs.is_dismiss" +
            " FROM [WTDB].[dbo].collaborators cs" +
            "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id" +
            "         INNER JOIN [WTDB].[dbo].orgs ON orgs.id = cs.org_id" +
            "         INNER JOIN [WTDB].[dbo].org ON org.id = orgs.id" +
            " WHERE " + extraCondition + " c.created BETWEEN @date_from AND @date_to";

        dataList = ArraySelectAll( XQuery( "sql: " +
            sql));

        addLogMessage(loggerName, "[agent.id: " + agentId + "] SQL: " + sql);

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("<html><table>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td>Код</td><td>ФИО</td><td>Логин</td><td>Email</td><td>System Email</td><td>Должность</td><td>Организация</td><td>ИНН</td><td>РЦК</td><td>РОИВ</td><td>Есть партнерское соглашение</td><td>Тип поддержки</td><td>Дата создания</td><td>Кем создан</td><td>Дата модификации</td><td>Роль доступа</td><td>Код роли доступа</td><td>ID Результ.</td><td>guid Пользователя</td><td>Когда-то был участником</td><td>Проект завершён</td><td>Уволен</td>");
        reportString.AppendStr( "</tr>");
        var count_arr = ArrayCount(dataList);

        for(data in dataList) {
            fondFactRegion = ArrayOptFirstElem(XQuery("for $elem in regions where $elem/id=" + data.fact_region_id + " return $elem"));

            factRegion = fondFactRegion == undefined ? "" : fondFactRegion.name;

            reportString.AppendStr("<tr>");
            reportString.AppendStr("<td>"+data.col_code+"</td><td>"+data.col_fullname+"</td><td>"+data.col_login+"</td><td>"+data.col_email+"</td><td>"+data.col_system_email+"</td><td>"+data.position_name+"</td><td>"+data.o_name+"</td><td>"+data.o_inn+"</td><td>"+data.is_rck+"</td><td>"+data.is_roiv+"</td><td>"+data.is_partner+"</td><td>"+data.format_part+"</td><td>"+data.col_created+"</td><td>"+data.col_created_by+"</td><td>"+data.col_modificated+"</td><td>"+data.ar_name+"</td><td>"+data.ar_id+"</td><td>"+data.PK+"</td><td>"+data.guid+"</td><td>"+data.is_past_member+"</td><td>"+data.is_project_ended+"</td><td>"+data.is_dismiss+"</td>");
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

        reportString.AppendStr("</table></html>");

        excel.LoadHtmlString(reportString.GetStr(), "");

        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        excel.SaveAs("E:/Websoft/Reports/report_collaborators/report_collaborators_" + ParseDate(Date()) + ".xlsx");

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
    } catch(e) {
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