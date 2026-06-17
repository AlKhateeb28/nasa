// 7267716093742053137
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function convertToBooleanAsString(value) {
    if (value == null) {
        return "NULL";
    } else if (OptInt(value) == 0) {
        return "false";
    } else {
        return "true";
    }
}

var agentId = 7267716093742053137;

var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7267716093742053137";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

try {
    if (!isAgentRunning(agentId)) {
        var total = 0;
        var processed = 0;
        var saved = 0;
        var skipped = 0;

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        // ORGS
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT os.id, " +
            "   NULL AS person_id, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS in_program, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'nvarchar(1)') AS is_fcc, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS is_rck, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS is_ock, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS is_roiv, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS is_partner, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS is_commerce, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS is_project_ended, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS with_no_right " +
            " FROM orgs os " +
            "   INNER JOIN org o ON os.id = o.id " +
            " WHERE os.modification_date > DATEADD(MINUTE, -15, GETDATE()) "));
        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных организаций...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (data in dataList) {
            helperProcedureList = ArrayDirect(XQuery("sql: " +
                " DECLARE @Result INT; " +
                " EXEC @Result = [WTDB].[dbo].[Helper] " +
                " @orgID = " + data.id + ", " +
                " @personID = NULL" +
                " @inProgram = '" + convertToBooleanAsString(data.in_program) + "', " +
                " @isFck = '" + convertToBooleanAsString(data.is_fcc) + "', " +
                " @isRck = '" + convertToBooleanAsString(data.is_rck) + "', " +
                " @isOck = '" + convertToBooleanAsString(data.is_ock) + "', " +
                " @isRoiv = '" + convertToBooleanAsString(data.is_roiv) + "', " +
                " @isPartner = '" + convertToBooleanAsString(data.is_partner) + "', " +
                " @isCommerce = '" + convertToBooleanAsString(data.is_commerce) + "', " +
                " @isProjectEnded = '" + convertToBooleanAsString(data.is_project_ended) + "', " +
                " @withNoRight = '" + convertToBooleanAsString(data.with_no_right) + "'; " +
                " SELECT @Result AS code; "));

            if (ArrayCount(helperProcedureList) > 0) {
                if (OptInt(helperProcedureList[0].code) != 1) {
                    throw new Exception("Возвращенный код ошибки: " + helperProcedureList[0].code);
                }
            } else {
                throw new Exception("Хранимая процедура Helper ничего не вернула.");
            }

            processed++;
            saved++;

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }

        // COLLABORATORS
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT os.id, " +
            "   cs.id AS person_id, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS in_program, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'nvarchar(1)') AS is_fcc, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS is_rck, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS is_ock, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS is_roiv, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS is_partner, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS is_commerce, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS is_project_ended, " +
            "   o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS with_no_right " +
            " FROM collaborators cs " +
            "   INNER JOIN orgs os ON cs.org_id = os.id " +
            "   INNER JOIN org o ON os.id = o.id " +
            " WHERE cs.modification_date > DATEADD(MINUTE, -15, GETDATE()) "));

        total = ArrayCount(dataList);

        agent.total += total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных сотрудников...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (data in dataList) {
            helperProcedureList = ArrayDirect(XQuery("sql: " +
                " DECLARE @Result INT; " +
                " EXEC @Result = [WTDB].[dbo].[Helper] " +
                " @orgID = " + data.id + ", " +
                " @personID = "+ data.person_id +
                " @inProgram = '" + convertToBooleanAsString(data.in_program) + "', " +
                " @isFck = '" + convertToBooleanAsString(data.is_fcc) + "', " +
                " @isRck = '" + convertToBooleanAsString(data.is_rck) + "', " +
                " @isOck = '" + convertToBooleanAsString(data.is_ock) + "', " +
                " @isRoiv = '" + convertToBooleanAsString(data.is_roiv) + "', " +
                " @isPartner = '" + convertToBooleanAsString(data.is_partner) + "', " +
                " @isCommerce = '" + convertToBooleanAsString(data.is_commerce) + "', " +
                " @isProjectEnded = '" + convertToBooleanAsString(data.is_project_ended) + "', " +
                " @withNoRight = '" + convertToBooleanAsString(data.with_no_right) + "'; " +
                " SELECT @Result AS code; "));

            if (ArrayCount(helperProcedureList) > 0) {
                if (OptInt(helperProcedureList[0].code) != 1) {
                    throw new Exception("Возвращенный код ошибки: " + helperProcedureList[0].code);
                }
            } else {
                throw new Exception("Хранимая процедура Helper ничего не вернула.");
            }

            processed++;
            saved++;
            
            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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
            saved + " saved, ",
            skipped + " skipped"
        );

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to be completed!");

        agent.state = 1;
        agent.processed = 0;
        agent.saved = 0;
        agent.skipped = 0;
        agent.message = "Закончено. Работает предыдущий экземпляр агента!";
        sendMessageToWebsocket(ws, agent);
    }
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) { }
