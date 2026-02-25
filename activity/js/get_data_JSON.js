<%
// 7256008661971890453
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.topActivities = [];
resultData.fromDate = "";
resultData.currentRegion = "";
resultData.regions = [];
resultData.currentOrgInn = "";
resultData.orgs = [];

var agentId = 7256008661971890453;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "web_7256008661971890453";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

try {
    var total = 0;
    var processed = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT  was.page_id, " +
        "           MAX(wp.code) AS code, " +
        "           MAX(wp.name) AS name, " +
        "            COUNT(*) AS count " +
        "    FROM [WTDB].[dbo].cc_web_activitys was " +
        "             INNER JOIN [WTDB].[dbo].cc_web_pages wp ON was.page_id = wp.id " +
        "    WHERE wp.code NOT IN ('home', 'unknown', 'library_material', 'pptrf2019', 'certificate_print', 'error', 'my_doc') " +
        "    GROUP BY was.page_id " +
        " ) " +
        " SELECT TOP 8 MAX(_v.name) AS name, " +
        "       SUM(_v.count) AS quantity " +
        " FROM _view _v " +
        "    INNER JOIN [WTDB].[dbo].cc_web_pages wp ON _v.page_id = wp.id " +
        " GROUP BY _v.code " +
        " ORDER BY quantity DESC "));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    step = 1;

    for(data in dataList) {
        element = {};
        element.position = step;
        element.name = data.name;
        element.quantity = data.quantity;

        resultData.topActivities.push(element);

        step++;
        processed++;

        agent.processed = processed;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

    }

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 1 visit_date " +
        " FROM [WTDB].[dbo].cc_web_activitys " +
        " ORDER BY visit_date "));

    if(ArrayCount(dataList) > 0) {
        resultData.fromDate = StrDate(dataList[0].visit_date, false, false);
    }

    // Regions
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 15 " +
        "       rs.id, " +
        "       MAX(rs.name) AS name, " +
        "       COUNT(*) AS count " +
        "   FROM [WTDB].[dbo].cc_web_activitys was " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON was.person_id = cs.id " +
        "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "       INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        " GROUP BY rs.id " +
        " ORDER BY count DESC "));

    total = ArrayCount(dataList);

    agent.total += total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    step = 1;
    currentRegionId = 0;

    for(data in dataList) {
        if(step == 1) {
            resultData.currentRegion = data.name;
            currentRegionId = data.id;
        }

        element = {};
        element.id = "" + data.id;
        element.name = data.name;
        element.count = data.count;

        resultData.regions.push(element);

        step++;
        processed++;

        agent.processed = processed;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    // Organizations
    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT  TOP 10 os.id, " +
        "            COUNT(*) AS count " +
        "    FROM [WTDB].[dbo].cc_web_activitys was " +
        "        INNER JOIN [WTDB].[dbo].collaborators cs ON was.person_id = cs.id " +
        "        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id AND os.region_id = " + currentRegionId +
        "    GROUP BY os.id " +
        "    ORDER BY count DESC " +
        " ) " +
        " SELECT _v.id, " +
        "       os.code AS inn, " +
        "       os.name AS os_name, " +
        "       pas.name AS pas_name, " +
        "       _v.count " +
        " FROM _view _v " +
        "       INNER JOIN [WTDB].[dbo].orgs os ON _v.id = os.id " +
        "       INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "       LEFT JOIN [WTDB].[dbo].professional_areas AS pas ON o.data.value('(//custom_elems/custom_elem[name=''professional_area''])[1]/value[1]', 'bigint') = pas.id " +
        " ORDER BY count DESC  "));

    total = ArrayCount(dataList);

    agent.total += total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    step = 1;

    for(data in dataList) {
        if(step == 1) {
            resultData.currentOrgInn = data.inn;
        }

        element = {};
        element.id = "" + data.id;
        element.inn = data.inn;
        element.osName = data.os_name;
        element.pasName = data.pas_name;
        element.count = data.count;

        resultData.orgs.push(element);

        step++;
        processed++;

        agent.processed = processed;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

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