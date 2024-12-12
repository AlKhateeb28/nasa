// 7096753758654051976
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function from_str_to_header(_str) {
    return param_columns.ObtainChildByKey( _str ).name;
}

function create_header(columns_arr) {
    header_str = "";
    for (colmn in columns_arr) {
        header_str += "<td>" + from_str_to_header( colmn ) + "</td>";
    }

    return header_str;
}

function create_row(_elem, columns_arr) {
    row_str = "";
    for ( colmn in columns_arr ) {
        if (_elem.ChildExists(colmn)) {
            row_str += "<td>" + _elem.Child( colmn ) + "</td>";
        }
    }

    return row_str;
}

if (LdsIsServer ) {
    var agentId = 7096753758654051976;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "aa_agent_7096753758654051976";
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
        curObjectDoc = tools.open_doc(agentId);

        columns_arr = Param.columns.split( ";" );
        param_columns = curObjectDoc.TopElem.wvars.ObtainChildByKey( "columns" ).entries;

        dataList = ArrayDirect(XQuery("sql: " +
            " WITH Table_1 AS ( " +
            "     SELECT learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id " +
            " FROM [WTDB].[dbo].learnings " +
            " WHERE learnings.state_id = 0 " +
            " UNION " +
            " SELECT active_learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id " +
            " FROM [WTDB].[dbo].active_learnings " +
            " WHERE active_learnings.state_id = 0 " +
            " ) " +
            " SELECT CONCAT( '''', Table_1.id ) AS l_id, " +
            "   CONCAT( '''', collaborators.id ) AS col_id, " +
            "   collaborators.code AS col_code, " +
            "   collaborators.fullname AS col_fullname, " +
            "   collaborators.email AS col_email, " +
            "   collaborators.position_name AS col_p_name, " +
            "   orgs.name AS o_name, " +
            "   CONCAT( '''', orgs.code ) AS o_code, " +
            "   courses.code AS course_code, " +
            "   courses.name AS course_name, " +
            "   Table_1.start_usage_date AS start_date, " +
            "   Table_1.last_usage_date AS finish_date, " +
            "   Table_1.score, " +
            "   [common.learning_states].name AS state, " +
            "   regions.name AS region_name, " +
            "   regions.code AS region_code, " +
            "   org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part" +
            " FROM Table_1 " +
            "   INNER JOIN [WTDB].[dbo].courses ON Table_1.course_id = courses.id " +
            "   INNER JOIN [WTDB].[dbo].collaborators ON Table_1.person_id = collaborators.id " +
            "   INNER JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id " +
            "   INNER JOIN [WTDB].[dbo].org ON orgs.id = org.id" +
            "   INNER JOIN [WTDB].[dbo].regions ON orgs.region_id = regions.id " +
            "   INNER JOIN [WTDB].[dbo].[common.learning_states] ON Table_1.state_id = [common.learning_states].id "));

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

        reportString.AppendStr( "<html><table>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr(create_header(columns_arr));
        reportString.AppendStr("</tr>");

        for (elem in dataList) {
            reportString.AppendStr("<tr>");
            try {
                reportString.AppendStr(create_row(elem, columns_arr));
            } catch(err) {
                continuel
            }
            reportString.AppendStr("</tr>");
            processed++;

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
        excel.SaveAs("E:/Websoft/Reports/report_org_learnings_full/report_org_all_learnings_full_ass_" + ParseDate(Date()) + ".xlsx");

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

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}