<%
    // 7294971710576419446
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.indexes = [];

var agentId = 7294971710576419446;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();

var loggerName = "web_7294971710576419446";

start = Date();

try {
    var total = 0;
    var processed = 0;

    tableParam = Request.Query.GetOptProperty("table");
    if (tableParam == undefined || tableParam == "") {
        tableParam = "";
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    if (tableParam != "") {
        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _view AS ( " +
            "   SELECT ps.object_id, " +
            "       ps.index_id, " +
            "       MAX(OBJECT_NAME(ps.object_id)) AS table_name, " +
            "       MAX(i.name) AS index_name, " +
            "       MAX(i.type_desc) AS index_type, " +
            "       SUM(CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2))) AS size, " +
            "       SUM(CAST(ps.avg_fragmentation_in_percent AS DECIMAL(10, 2))) AS frag, " +
            "       SUM(ps.page_count) AS page_count " +
            "   FROM [WTDB].sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('" + tableParam + "'), NULL, NULL, 'LIMITED') ps " +
            "       JOIN[WTDB].sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id " +
            "   WHERE i.object_id = OBJECT_ID('" + tableParam + "') " +
            "   GROUP BY ps.object_id, ps.index_id " +
            " ) " +
            " SELECT _view.*, " +
            "       STUFF(( " +
            "           SELECT ', ' + COL_NAME(ic.object_id, ic.column_id) " +
            "           FROM sys.index_columns ic " +
            "           WHERE _view.object_id = ic.object_id AND _view.index_id = ic.index_id AND ic.is_included_column = 0 " +
            "               FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS field_name, " +
            "       t.name AS column_type, " +
            "       c.max_length AS column_len, " +
            "       s.user_seeks AS seeks, " +
            "       s.user_scans AS scans, " +
            "       s.user_lookups AS lookups, " +
            "       s.user_updates AS total_writes " +
            " FROM _view " +
            "   JOIN [WTDB].sys.index_columns ic ON _view.object_id = ic.object_id AND _view.index_id = ic.index_id " +
            "   JOIN [WTDB].sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id " +
            "   JOIN [WTDB].sys.types t ON c.user_type_id = t.user_type_id " +
            "   LEFT JOIN [WTDB].sys.dm_db_index_usage_stats s ON s.database_id = DB_ID() AND _view.object_id = s.object_id AND _view.index_id = s.index_id "));

        for (data in dataList) {
            element = {};
            element.index = data.index_name;
            element.type = data.index_type;
            element.field = data.field_name;
            element.frag = data.frag;
            element.size = data.size;
            element.pageCount = data.page_count;
            element.columnType = data.column_type;
            element.columnLength = data.column_len;
            element.seeks = data.seeks;
            element.scans = data.scans;
            element.lookups = data.lookups;
            element.totalWrites = data.total_writes;

            if (data.column_type == "varchar" || data.column_type === "nvarchar") {

                fieldMaxLengthList = ArrayDirect(XQuery("sql: " +
                    " SELECT MAX(LEN(" + data.field_name + ")) AS max_length " +
                    " FROM " + tableParam));

                if (ArrayCount(fieldMaxLengthList) > 0) {
                    element.maxLength = fieldMaxLengthList[0].max_length;
                } else {
                    element.maxLength = 0;
                }
            } else {
                element.maxLength = "";
            }
            resultData.indexes.push(element);
        }
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(resultData));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}
%>