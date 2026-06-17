<%
// 7292142554092386196
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function getDataList(table) {
    return ArrayDirect(XQuery("sql: " +
        " SELECT CAST(ps.avg_fragmentation_in_percent AS INT) AS frag " +
        " FROM[WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps " +
        "   JOIN[WTDB].sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id " +
        " WHERE OBJECT_NAME(ps.object_id) = '" + table + "' " +
        "   AND i.name = 'PK__" + table + "' "));
}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.coll_frag = 0;
resultData.org_frag = 0;
resultData.reg_frag = 0;
resultData.ers_frag = 0;
resultData.es_frag = 0;
resultData.erts_frag = 0;
resultData.ls_frag = 0;
resultData.cour_frag = 0;
resultData.edu_plans_frag = 0;
resultData.trash_docs_farg = 0;

var agentId = 7292142554092386196;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "web_7292142554092386196";

try {
    var total = 0;
    var processed = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dataList = getDataList("collaborators");
    if (ArrayCount(dataList) > 0) {
        resultData.coll_frag = dataList[0].frag;
    } else {
        resultData.coll_frag = -1;
    }

    dataList = getDataList("orgs");
    if (ArrayCount(dataList) > 0) {
        resultData.org_frag = dataList[0].frag;
    } else {
        resultData.org_frag = -1;
    }

    dataList = getDataList("regions");
    if (ArrayCount(dataList) > 0) {
        resultData.reg_frag = dataList[0].frag;
    } else {
        resultData.reg_frag = -1;
    }

    dataList = getDataList("event_results");
    if (ArrayCount(dataList) > 0) {
        resultData.ers_frag = dataList[0].frag;
    } else {
        resultData.ers_frag = -1;
    }

    dataList = getDataList("events");
    if (ArrayCount(dataList) > 0) {
        resultData.es_frag = dataList[0].frag;
    } else {
        resultData.es_frag = -1;
    }

    dataList = getDataList("event_result_types");
    if (ArrayCount(dataList) > 0) {
        resultData.erts_frag = dataList[0].frag;
    } else {
        resultData.erts_frag = -1;
    }

    dataList = getDataList("active_learnings");
    if (ArrayCount(dataList) > 0) {
        resultData.als_frag = dataList[0].frag;
    } else {
        resultData.als_frag = -1;
    }

    dataList = getDataList("learnings");
    if (ArrayCount(dataList) > 0) {
        resultData.ls_frag = dataList[0].frag;
    } else {
        resultData.ls_frag = -1;
    }

    dataList = getDataList("courses");
    if (ArrayCount(dataList) > 0) {
        resultData.cour_frag = dataList[0].frag;
    } else {
        resultData.cour_farg = -1;
    }

    dataList = getDataList("education_plans");
    if (ArrayCount(dataList) > 0) {
        resultData.edu_plans_frag = dataList[0].frag;
    } else {
        resultData.edu_plans_farg = -1;
    }

    dataList = getDataList("trash_docs");
    if (ArrayCount(dataList) > 0) {
        resultData.trash_docs_frag = dataList[0].frag;
    } else {
        resultData.trash_docs_farg = -1;
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
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}
%>