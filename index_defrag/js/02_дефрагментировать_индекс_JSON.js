<%
    // 7288311374876600612
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.table = "";
resultData.index = "";
resultData.frag = -1;
resultData.errorCode = 0;

var agentId = 7288311374876600612;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "web_7288311374876600612";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    tableParam = Request.Query.GetOptProperty("table");
    if (tableParam == undefined || tableParam == "") {
        tableParam = "";
    }

    indexParam = Request.Query.GetOptProperty("index");
    if (indexParam == undefined || indexParam == "") {
        indexParam = "";
    }

    fragParam = Request.Query.GetOptProperty("frag");
    if (fragParam == undefined || fragParam == "") {
        fragParam = 0;
    }

    fragParam = OptInt(fragParam);

    if (tableParam != "" && indexParam != "" && OptInt(fragParam) > 0) {
        resultData.table = tableParam;
        resultData.index = indexParam;

        if (fragParam >= 5) {
            if (fragParam >= 5 && fragParam <= 30) {
                fragParam = "REORGANIZE";
            } else {
                fragParam = "REBUILD";
            }

            sql = " SET LOCK_TIMEOUT 30000; " +
                " BEGIN TRANSACTION " +
                " BEGIN TRY " +
                "	IF OBJECT_ID('[WTDB].[dbo]._defrag_temp', 'U') IS NOT NULL " +
                "       DROP TABLE [WTDB].[dbo]._defrag_temp; " +
                "   SELECT * INTO [WTDB].[dbo]._defrag_temp FROM [WTDB].[dbo]." + tableParam + " WITH(TABLOCKX, HOLDLOCK) WHERE 1 = 0; " +
                "   ALTER INDEX " + indexParam + " ON [WTDB].[dbo].[" + tableParam + "] " + fragParam + //" WITH (FILLFACTOR = 90);" +
                "   COMMIT TRANSACTION; " +
                " 	SELECT 0 AS error_code; " +
                " END TRY " +
                " BEGIN CATCH " +
                "	ROLLBACK TRANSACTION; " +
                "	SELECT ERROR_NUMBER() AS error_code; " +
                " END CATCH" +
                " SET LOCK_TIMEOUT - 1; ";

            addLogMessage(loggerName, "[agent.id: " + agentId + "] SQL: " + sql);

            defragList = ArrayDirect(XQuery("sql: " +
                sql));

            if (ArrayCount(defragList) > 0) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Code: " + defragList[0].error_code);

                resultData.errorCode = defragList[0].error_code;
            } else {
                resultData.errorCode = -7;
            }

            indexName = "";

            if (indexParam == "") {
                indexName = " AND i.name IS NULL ";
            } else {
                indexName = " AND i.name = '" + indexParam + "'";
            }

            defragList = ArrayDirect(XQuery("sql: " +
                " SELECT CAST(ps.avg_fragmentation_in_percent AS DECIMAL(10,2)) AS frag, " +
                "   CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2)) AS size " +
                " FROM[WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps " +
                "   JOIN[WTDB].sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id " +
                " WHERE OBJECT_NAME(ps.object_id) = '" + tableParam + "' " + indexName));

            if (ArrayCount(defragList) > 0) {
                resultData.frag = defragList[0].frag;
            } else {
                resultData.frag = 0;
            }
        } else {
            resultData.frag = fragParam;
        }
    } else {
        resultData.errorCode = -8;
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(resultData));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;
    resultData.errorCode = -9;

    Response.Write(EncodeJson(resultData));
}
%>