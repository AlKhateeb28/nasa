<%
// 7288243525935543905
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.indexes = [];

var agentId = 7288243525935543905;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "web_7257828458375147659";

try {
    var total = 0;
    var processed = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT OBJECT_NAME(ps.object_id) AS table_name, " +
        "         i.name AS index_name, " +
        "         i.type_desc AS index_type, " +
        "         STUFF(( " +
        "           SELECT ', ' + COL_NAME(ic.object_id, ic.column_id) " +
        "           FROM sys.index_columns ic " +
        "           WHERE ic.object_id = ps.object_id " +
        "               AND ic.index_id = ps.index_id " +
        "               AND ic.is_included_column = 0 " +
        "               FOR XML PATH(''), TYPE " +
        "                   ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS field_name, " +
        "         CAST(ps.avg_fragmentation_in_percent AS DECIMAL(10, 2)) AS avg_fragmentation, " +
        "         CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2)) AS size, " +
        "         ps.avg_page_space_used_in_percent AS page_space_used, " +
        "         ps.page_count, " +
        "         ps.record_count " +        
        " FROM [WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps " +
        "       JOIN [WTDB].sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id " +
        " WHERE ps.avg_fragmentation_in_percent > 5 " +
        "     AND ps.page_count > 1000 " +
        "     AND OBJECT_NAME(ps.object_id) NOT LIKE '(%' " +
        " ORDER BY table_name, avg_fragmentation DESC; "));

    for (data in dataList) {
        element = {};
        element.table = data.table_name;
        element.index = data.index_name;
        element.type = data.index_type;
        element.field = data.field_name;
        element.frag = data.avg_fragmentation;
        element.size = data.size;
        element.pageSpaceUsed = data.page_space_used;
        element.pageCount = data.page_count;
        element.recordCount = data.record_count;
        
        columnList = ArrayDirect(XQuery("sql: " +
            " SELECT DATA_TYPE AS type, " +
            "       CHARACTER_MAXIMUM_LENGTH AS length" +
            " FROM[WTDB].INFORMATION_SCHEMA.COLUMNS " +
            " WHERE TABLE_NAME = '" + element.table + "' " +
            "   AND COLUMN_NAME = '" + element.field + "' "));
        
        element.columnType = "";
        element.columnLength = null;

        if (ArrayCount(columnList) > 0) {
            element.columnType = columnList[0].type;
            element.columnLength = columnList[0].length;
        }

        resultData.indexes.push(element);

        processed++;
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