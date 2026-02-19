<%
// 7161948549086699962
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}


var resultData = {};
resultData.message = "";
resultData.errorMessage = "";

var agentId = 7161948549086699962;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7161948549086699962";
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

var regionId = OptInt(Request.Query.GetOptProperty("region_id"));

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy; " +
        " DECLARE @from_date datetime = '01.01.2024'; " +
        " SELECT rs.name AS region_name, " +
        "       os.code AS inn, " +
        "       os.name AS orgs_name, " +
        "       cs.fullname, " +
        "       ps.name AS position_name, " +
        "       es.name event_name, " +
        "       ers.event_name AS event_result_name, " +
        "       es.finish_date, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''month_report''])[1]/value[1]', 'varchar(max)') AS month, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''year_report''])[1]/value[1]', 'varchar(max)') AS year, " +
        "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_dossier_rcc_exist''])[1]/value[1]') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''is_dossier_rcc_exist''])[1]/value[1]', 'bit') AS INT)) AS is_dossier_rcc_exist, " +
        "       es.id AS event_id, " +
        "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps " +
        " FROM [WTDB].[dbo].event_results ers " +
        "         INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        "         INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.finish_date BETWEEN @from_date AND GETDATE() " +
        "         INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
        "         INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(//custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = " + regionId +
        "         LEFT JOIN [WTDB].[dbo].regions rs ON o.data.value('(//custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        "         LEFT JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        " WHERE cs.code LIKE '%rck_muc%' "));

    total = ArrayCount(dataList);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Total: " + total);

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
    reportString.AppendStr(".row_height {height: 25px;}");
    reportString.AppendStr(".column_grey {background-color: #ececec;}");
    reportString.AppendStr(".align-center {text-align: center;}");
    reportString.AppendStr("th { position: sticky; top: 0; }");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<th class='header'>Учитывать в отчетности региона</th>");
    reportString.AppendStr("<th class='header'>ИНН организации</th>");
    reportString.AppendStr("<th class='header' style='width: 500px;'>Организация</th>");
    reportString.AppendStr("<th class='header' style='width: 400px;'>ФИО участника</th>");
    reportString.AppendStr("<th class='header'>Должность</th>");
    reportString.AppendStr("<th class='header' style='width: 500px;'>Учебная программа</th>");
    reportString.AppendStr("<th class='header' style='width: 500px;'>Название мероприятия</th>");
    reportString.AppendStr("<th class='header'>Дата мероприятия</th>");
    reportString.AppendStr("<th class='header'>Месяц отчета</th>");
    reportString.AppendStr("<th class='header'>Год отчета</th>");
    reportString.AppendStr("<th class='header'>Ответственный за проведение</th>");
    reportString.AppendStr("<th class='header'>Тренер</th>");
    reportString.AppendStr("<th class='header'>Включен в уникально обученные</th>");
    reportString.AppendStr("<th class='header'>NPS</th>");

    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td>" + data.region_name + "</td>");
        reportString.AppendStr("<td>" + data.inn + "</td>");
        reportString.AppendStr("<td>" + data.orgs_name + "</td>");
        reportString.AppendStr("<td>" + data.fullname + "</td>");
        reportString.AppendStr("<td>" + data.position_name + "</td>");
        reportString.AppendStr("<td>" + data.event_name + "</td>");
        reportString.AppendStr("<td>" + data.event_result_name + "</td>");
        reportString.AppendStr("<td>" + (data.finish_date == null ? "" : StrDate(data.finish_date, false, false)) + "</td>");
        reportString.AppendStr("<td>" + data.month + "</td>");
        reportString.AppendStr("<td>" + data.year + "</td>");

        responsibles = "";
        treners = "";
        if(data.event_id != null) {
            eventDoc = tools.open_doc(data.event_id);

            if(eventDoc != undefined) {
                eventDocTE = eventDoc.TopElem;

                // Ответсвенный
                for(collaborator in eventDocTE.tutors) {
                    collaboratorDoc = tools.open_doc(collaborator.collaborator_id);

                    if(collaboratorDoc != undefined) {
                        responsibles += collaboratorDoc.TopElem.fullname + ";";
                    }
                }
                // Тренер
                for(collaborator in eventDocTE.even_preparations) {
                    collaboratorDoc = tools.open_doc(collaborator.person_id);

                    if(collaboratorDoc != undefined) {
                        treners += collaboratorDoc.TopElem.fullname + ";";
                    }
                }
            }
        }

        if(StrCharCount(responsibles) > 0) {
            responsibles = StrCharRangePos(responsibles, 0, StrCharCount(responsibles) - 1);
        }
        if(StrCharCount(treners) > 0) {
            treners = StrCharRangePos(treners, 0, StrCharCount(treners) - 1);
        }

        reportString.AppendStr("<td>" + responsibles + "</td>");
        reportString.AppendStr("<td>" + treners + "</td>");

        if(data.is_dossier_rcc_exist == 0) {
            reportString.AppendStr("<td>Нет</td>");
        } else {
            reportString.AppendStr("<td>Да</td>");
        }

        reportString.AppendStr("<td>" + data.nps + "</td>");

        reportString.AppendStr("</tr>");

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
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/Reports/outcast_report/participant_report_" + ParseDate(Date()) + ".xlsx");

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

    resultData.total = total;
    resultData.message = "Agent is started";

    Response.Write(EncodeJson(resultData));
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
%>