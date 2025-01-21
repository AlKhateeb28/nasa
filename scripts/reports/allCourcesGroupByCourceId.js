// 7400371210226778827
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
function getReportWebsocketClient(){try{return new WebSocketClient("ws://192.168.0.96:3000/");}catch(e){}}function getReportInstance(agentId) {report={};report.id=agentId;report.type = "REPORT_IC_GD";report.data=[];return report;}function sendReportMessageToWebsocket(ws, report) {try{ws.Send("#"+EncodeJson(report));return ws;}catch(e){return null;}}

function getReportData(list) {
    result = [];

    for (element in list) {
        resultElement = {};
        resultElement.name = element.c_name;
        resultElement.value1 = element.cnt1;
        resultElement.value0 = element.cnt0;
        resultElement.value3 = element.cnt3;
        resultElement.value4 = element.cnt4;
        resultElement.value6 = element.cnt6;
        resultElement.total = element.total;

        result.push(resultElement);
    }

    return result;
}

var agentId = "7400371210226778827";
var reportId = 7400371210226778827 + "_report";
var userId = 7389518304440750773; // Websoft inner user;
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7400371210226778827";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var reportWS = getReportWebsocketClient();
var report = getReportInstance(reportId);

var total = 0;
var processed = 0;

var excel = new ActiveXObject("Websoft.Office.Excel.Document")
var reportString = new Binary()

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    courcesList = ArrayDirect(XQuery("sql: " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl1 " +
        " FROM ( " +
        "   SELECT c_name, 1 as type, SUM(cnt) AS cnt " +
        "   FROM " +
        "   ( " +
        "       SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "       FROM [WTDB].[dbo].courses c " +
        "           INNER JOIN [WTDB].[dbo].active_learnings l ON c.id = l.course_id AND l.state_id = 1 " +
        "       WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        "    UNION " +
        "       SELECT c_name, 0 as type, SUM(cnt) AS cnt " +
        "       FROM " +
        "       ( " +
        "           SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "           FROM [WTDB].[dbo].courses c " +
        "               INNER JOIN [WTDB].[dbo].active_learnings l ON c.id = l.course_id AND l.state_id = 0 " +
        "           WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        " ) AS view1; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl2 " +
        " FROM ( " +
        "       SELECT * " +
        "       FROM [WTDB].[dbo].#tbl1 " +
        "   UNION " +
        "       SELECT c_name, 3 as type, SUM(cnt) AS cnt " +
        "       FROM ( " +
        "           SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "           FROM [WTDB].[dbo].courses c " +
        "               INNER JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 3 " +
        "           WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        " ) AS view2; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl3 " +
        " FROM ( " +
        "           SELECT * " +
        "           FROM [WTDB].[dbo].#tbl2 " +
        "       UNION " +
        "           SELECT c_name, 4 as type, SUM(cnt) AS cnt " +
        "           FROM ( " +
        "               SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "               FROM [WTDB].[dbo].courses c " +
        "                   INNER JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 4 " +
        "               WHERE c.code LIKE '%FCK%' " +
        "           ) AS tbl " +
        "           GROUP BY c_name " +
        " ) AS view3; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#result_tbl " +
        " FROM ( " +
        "           SELECT * " +
        "           FROM [WTDB].[dbo].#tbl3 " +
        "       UNION " +
        "           SELECT c_name, 6 as type, SUM(cnt) AS cnt " +
        "           FROM ( " +
        "               SELECT c_name, 1 AS cnt " +
        "               FROM ( " +
        "                   SELECT l.person_id, c.name AS c_name " +
        "                   FROM [WTDB].[dbo].courses c " +
        "                       INNER JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 4 " +
        "                   WHERE c.code LIKE '%FCK%' " +
        "               ) AS tbl " +
        "               GROUP BY person_id, c_name " +
        "           ) AS view11 " +
        "           GROUP BY c_name " +
        " ) AS view5; " +
        " " +
        " SELECT c_name, " +
        "   SUM(CASE WHEN type = 1 THEN cnt ELSE 0 END) AS cnt1, " +
        "   SUM(CASE WHEN type = 0 THEN cnt ELSE 0 END) AS cnt0, " +
        "   SUM(CASE WHEN type = 3 THEN cnt ELSE 0 END) AS cnt3, " +
        "   SUM(CASE WHEN type = 4 THEN cnt ELSE 0 END) AS cnt4, " +
        "   SUM(CASE WHEN type = 6 THEN cnt ELSE 0 END) AS cnt6, " +
        "   SUM(CASE WHEN type = 1 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 0 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 3 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 4 THEN cnt ELSE 0 END) AS total " +
        " FROM [WTDB].[dbo].#result_tbl " +
        " WHERE cnt > 0 " +
        " GROUP BY c_name " +
        " ORDER BY total DESC; DROP TABLE [WTDB].[dbo].#tbl1; DROP TABLE [WTDB].[dbo].#tbl2; DROP TABLE [WTDB].[dbo].#tbl3; DROP TABLE [WTDB].[dbo].#result_tbl; "));

    total = ArrayCount(courcesList);

    agent.refreshChart = 1;
    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    reportString.AppendStr( "<html><table border='0'>");

    reportString.AppendStr( "<tr>" )
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 600px; height: 20px; color: white;'>Название курса</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>В процессе</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>Назначен</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>Не пройден</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>Пройден</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>Уникальные. Пройден</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; width: 200px; height: 20px; color: white;'>Общий итог</td>");
    reportString.AppendStr("</tr>");

    cnt1Total = 0, cnt0Total = 0, cnt3Total = 0, cnt4Total = 0, cnt6Total = 0, commonTotal = 0;

    for (cource in courcesList) {
        reportString.AppendStr( "<tr>" )
        reportString.AppendStr("<td style='height: 20px;'>" + cource.c_name + "</td>");
        reportString.AppendStr("<td style='text-align: right; height: 20px;'>" + cource.cnt1 + "</td>");
        reportString.AppendStr("<td style='text-align: right; height: 20px;'>" + cource.cnt0 + "</td>");
        reportString.AppendStr("<td style='background-color: #97CF80; text-align: right; height: 20px;'>" + cource.cnt3 + "</td>");
        reportString.AppendStr("<td style='background-color: #97CF80; text-align: right; height: 20px;'>" + cource.cnt4 + "</td>");
        reportString.AppendStr("<td style='background-color: #90a4ae; text-align: right; height: 20px;'>" + cource.cnt6 + "</td>");
        reportString.AppendStr("<td style='text-align: right; height: 20px;'>" + cource.total + "</td>");
        reportString.AppendStr("</tr>");

        cnt1Total += cource.cnt1;
        cnt0Total += cource.cnt0;
        cnt3Total += cource.cnt3;
        cnt4Total += cource.cnt4;
        cnt6Total += cource.cnt6;
        commonTotal += cource.total;

        processed++;

        agent.processed = processed;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    reportString.AppendStr( "<tr>" )
    reportString.AppendStr("<td style='background-color: #0CA4C2; height: 20px; color: white;'>Общий итог</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; height: 20px; color: white;'>" + cnt1Total + "</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; height: 20px; color: white;'>" + cnt0Total + "</td>");
    reportString.AppendStr("<td style='background-color: #D3B772; height: 20px;'>" + cnt3Total + "</td>");
    reportString.AppendStr("<td style='background-color: #D3B772; height: 20px;'>" + cnt4Total + "</td>");
    reportString.AppendStr("<td style='background-color: #D3B772; height: 20px;'>" + cnt6Total + "</td>");
    reportString.AppendStr("<td style='background-color: #0CA4C2; height: 20px; color: white;'>" + commonTotal + "</td>");
    reportString.AppendStr("</tr>");

    uniquePersonList = ArrayDirect(XQuery("sql: " +
        " SELECT l.person_id " +
        "FROM [WTDB].[dbo].learnings l " +
        "   INNER JOIN [WTDB].[dbo].courses c ON l.course_id = c.id AND c.code LIKE '%FCK%' " +
        "WHERE l.state_id = 4 " +
        "GROUP BY l.person_id"));

    reportString.AppendStr( "<tr>" )
    reportString.AppendStr("<td colspan='5' style='text-align: right;'>Всего уникально обученных</td>");
    reportString.AppendStr("<td style='background-color: #D3B772; text-align: right;'>" + ArrayCount(uniquePersonList) + "</td>");
    reportString.AppendStr("<td></td>");
    reportString.AppendStr( "</tr>" )

    reportString.AppendStr( "<tr>" )
    reportString.AppendStr("<td colspan='7'></td>");
    reportString.AppendStr( "</tr>" )

    reportString.AppendStr( "<tr>" )
    reportString.AppendStr("<td colspan='7' style='text-align: center; color: red'>Доходимость: " + eval((cnt3Total + cnt4Total) + ".0 / " + commonTotal) + "</td>");
    reportString.AppendStr( "</tr>" )

    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Сохранение файла..."
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    excel.SaveAs("E:/Websoft/Reports/report_org_learnings_full/report_org_all_learnings_NEW_" + ParseDate(Date()) + ".xlsx")

    agent.state = 1;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Закончено"
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    report.state = 0;
    report.data = getReportData(courcesList);
    sendReportMessageToWebsocket(reportWS, report);

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
try {
    reportWS.Send("close");
} catch (e) {}
