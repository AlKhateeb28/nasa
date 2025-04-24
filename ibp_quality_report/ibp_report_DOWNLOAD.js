<%
// 7149217851380724098
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function normalizeEduPlanName(name) {
    if(name == null || name == "") {
        return "";
    }

    nameParts = name.split(" - ");

    if(ArrayCount(nameParts) == 1) {
        return name;
    } else {
        return nameParts[1];
    }
}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";

var agentId = 7149217851380724098;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7149217851380724098";
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
    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT learnings.id, person_id, course_id, start_usage_date, last_usage_date, start_learning_date, education_plan_id AS ep_id " +
        "    FROM [WTDB].[dbo].learnings " +
        "    WHERE learnings.state_id > 0 " +
        "    UNION " +
        "    SELECT active_learnings.id, person_id, course_id, start_usage_date, last_usage_date, start_learning_date, education_plan_id AS ep_id " +
        "    FROM [WTDB].[dbo].active_learnings " +
        "    WHERE active_learnings.state_id > 0 " +
        " ) " +
        " SELECT _view.id, " +
        "    cs.fullname AS fullname, " +
        "       cs.email AS email, " +
        "       os.code AS inn, " +
        "       os.name AS org_name, " +
        "       _view.start_usage_date AS activate_date, " +
        "       _view.start_learning_date AS learning_date, " +
        "       _view.last_usage_date AS last_date, " +
        "       DATEDIFF(minute, _view.start_learning_date, _view.last_usage_date) AS  duration, " +
        "       eps.name AS edu_plan_name, " +
        "       rs.name AS region_name, " +
        "       eps.id AS eps_id " +
        " FROM _view " +
        "         INNER JOIN [WTDB].[dbo].courses cos ON _view.course_id = cos.id AND cos.code LIKE 'IBP-%' " +
        "         INNER JOIN [WTDB].[dbo].collaborators cs ON _view.person_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "         INNER JOIN [WTDB].[dbo].education_plans eps ON _view.ep_id = eps.id " +
        "         INNER JOIN [WTDB].[dbo].regions AS rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        " ORDER BY edu_plan_name  "));

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
    reportString.AppendStr("<td class='header'>ФИО</td>");
    reportString.AppendStr("<td class='header'>Email</td>");
    reportString.AppendStr("<td class='header'>Код организации</td>");
    reportString.AppendStr("<td class='header' style='width: 500px;'>Название организации</td>");
    reportString.AppendStr("<td class='header'>Дата активации курса</td>");
    reportString.AppendStr("<td class='header'>Дата начала обучения</td>");
    reportString.AppendStr("<td class='header'>Дата последнего обучения</td>");
    reportString.AppendStr("<td class='header'>Время прохождения (мин)</td>");
    reportString.AppendStr("<td class='header' style='width: 500px;'>Название плана обучения / Волны подготовки ИБП</td>");
    reportString.AppendStr("<td class='header'>Фактический регион</td>");
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr(
            "<tr>" +
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.email + "</td>" +
            "<td>" + data.inn + "</td>" +
            "<td>" + data.org_name + "</td>" +
            "<td>" + data.activate_date + "</td>" +
            "<td>" + data.learning_date + "</td>" +
            "<td>" + data.last_date + "</td>" +
            "<td>" + data.duration + "</td>" +
            "<td>" + normalizeEduPlanName("" + data.edu_plan_name) + "</td>" +
            "<td>" + data.region_name + "</td>" +
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
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/ibp_report/ibp_quality_" + ParseDate(Date()) + ".xlsx");

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