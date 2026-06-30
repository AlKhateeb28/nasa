// 7207884401104677018
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function updateFlag(id, name, value, updateCounts) {
    updateList = ArrayDirect(XQuery("sql: " +
        " UPDATE[WTDB].[dbo].collaborator " +
        "       SET data.modify('delete (//custom_elems/custom_elem[name=''" + name + "''])[1]') " +
        " WHERE id = " + id + ";" +
        " " +
        " UPDATE[WTDB].[dbo].collaborator " +
        "       SET data.modify(' " +
        "             insert <custom_elem> " +
        "                   <name>" + name + "</name> " +
        "                   <value>" + value + "</value> " +
        "             </custom_elem> " +
        "       as first into(//custom_elems)[1]') " +
        " WHERE id = " + id + ";" +
        " SELECT 1 AS code;"
    ));

    if (ArrayCount(updateList) > 0 && OptInt(updateList[0].code) == 1) {
        if (updateCounts) {
            saved++;
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Save failed.");

        if (updateCounts) {
            skipped++;
        }
    }
}

function downWithNoRightFlag() {
    agent.message = "1 из 3. Получение данных для снятие With_no_right флага...";
    sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT os.id " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "       INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') = 1 " +
        " WHERE cs.code NOT LIKE '%_muc_%' " +
        "       AND (o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') = 1 " +
        "       OR o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') = 1 " +
        "       OR o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') = 1 " +
        "       OR o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') = 1 " +
        "       OR o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') = 1 " +
        "       OR o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') != '') " +
        " GROUP BY os.id "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "1 из 3. Снимаем With_no_right флаг...";
    sendMessageToWebsocket(ws, agent);

    prevDate = new Date();

    agent.optionalData = {};
    agent.optionalData.name1 = "Сохранено сотрудников";

    for (data in dataList) {
        orgDoc = tools.open_doc(data.id);

        if (orgDoc != undefined) {
            orgDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "false";

            orgDoc.Save();

            collaboratorList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.id " +
                " FROM  [WTDB].[dbo].collaborators cs " +
                " WHERE cs.org_id = " + data.id));

            collaboratorsProcessed = 0;
            collaroratorsCount = ArrayCount(collaboratorList);

            agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;

            for (collaborator in collaboratorList) {
                collaboratorDoc = tools.open_doc(collaborator.id);

                if (collaboratorDoc != undefined) {
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "false";

                    collaboratorDoc.Save();
                }

                collaboratorsProcessed++;
                agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Org with ID " + data.id + " is not exist!");

            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        sendMessageToWebsocket(ws, agent);

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

function upWithNoRightFlag() {
    agent.message = "2 из 3. Получение данных для поднятия With_no_right флага...";
    sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT os.id, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''With_no_right''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS INT)) AS with_no_right, " +
        "           o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') AS format_part, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_ock''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS INT)) AS is_ock, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc " +
        "    FROM [WTDB].[dbo].collaborators cs " +
        "             INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "             INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "    WHERE cs.code NOT LIKE '%_muc_%' " +
        " ) " +
        " SELECT id " +
        " FROM _view " +
        " WHERE format_part IS NULL " +
        "    AND is_rck = 0 " +
        "    AND is_ock = 0 " +
        "    AND is_roiv = 0 " +
        "    AND is_partner = 0 " +
        "    AND is_fcc = 0 " +
        "    AND with_no_right = 0 " +
        " GROUP BY id "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "2 из 3. Поднимаем With_no_right флаг...";
    sendMessageToWebsocket(ws, agent);

    prevDate = new Date();

    agent.optionalData = {};
    agent.optionalData.name1 = "Сохранено сотрудников";
    
    for (data in dataList) {
        orgDoc = tools.open_doc(data.id);

        if (orgDoc != undefined) {
            orgDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "true";

            orgDoc.Save();

            collaboratorList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.id " +
                " FROM  [WTDB].[dbo].collaborators cs " +
                " WHERE cs.org_id = " + data.id));

            collaboratorsProcessed = 0;
            collaroratorsCount = ArrayCount(collaboratorList);

            agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;

            for (collaborator in collaboratorList) {
                collaboratorDoc = tools.open_doc(collaborator.id);

                if (collaboratorDoc != undefined) {
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "true";

                    collaboratorDoc.Save();
                }

                collaboratorsProcessed++;
                agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Org with ID " + data.id + " is not exist!");

            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        sendMessageToWebsocket(ws, agent);

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

function onProjectEnded() {
    agent.message = "3 из 3. Получение данных. Снятие кастомных флагов, если проект завершен...";
    sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT os.id, " +
        "           o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') AS format_part, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_project_ended''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS INT)) AS is_project_ended, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS INT)) AS in_program, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_ock''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS INT)) AS is_ock, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner " +
        "    FROM [WTDB].[dbo].collaborators cs " +
        "             INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "             INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "    WHERE cs.code NOT LIKE '%_muc_%' " +
        " ) " +
        " SELECT id " +
        " FROM _view " +
        " WHERE is_project_ended = 1 " +
        "       AND (format_part IS NOT NULL OR in_program = 1 OR is_fcc = 1 OR is_rck = 1 OR is_ock = 1 OR is_roiv = 1 OR is_partner = 1) " +
        " GROUP BY id "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "3 из 3. Проект завершен. Снимаем кастомные флаги...";
    sendMessageToWebsocket(ws, agent);

    prevDate = new Date();

    agent.optionalData = {};
    agent.optionalData.name1 = "Сохранено сотрудников";

    for (data in dataList) {
        orgDoc = tools.open_doc(data.id);

        if (orgDoc != undefined) {
            orgDoc.TopElem.custom_elems.ObtainChildByKey("format_part").value = "";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("in_program").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_rck").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_ock").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_roiv").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_partner").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "true";

            orgDoc.Save();

            collaboratorList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.id " +
                " FROM  [WTDB].[dbo].collaborators cs " +
                " WHERE cs.org_id = " + data.id));

            collaboratorsProcessed = 0;
            collaroratorsCount = ArrayCount(collaboratorList);

            agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;

            for (collaborator in collaboratorList) {
                collaboratorDoc = tools.open_doc(collaborator.id);

                if (collaboratorDoc != undefined) {
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("format_part").value = "";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("in_program").value = "false";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("is_rck").value = "false";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("is_ock").value = "false";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("is_roiv").value = "false";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("is_partner").value = "false";
                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "true";

                    collaboratorDoc.Save();
                }

                collaboratorsProcessed++;
                agent.optionalData.value1 = collaboratorsProcessed + " / " + collaroratorsCount;
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Org with ID " + data.id + " is not exist!");

            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        sendMessageToWebsocket(ws, agent);

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

var agentId = 7207884401104677018;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = Date();
var loggerName = "agent_7207884401104677018";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    if (!isAgentRunning(agentId)) {
        count = downWithNoRightFlag();
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Rise With_no_right: " + count);

        count = upWithNoRightFlag();
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Fall With_no_right: " + count);

        count = onProjectEnded();
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Do something if project ended:  " + count);

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
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to end!");

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
    addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] WS: " + (ws == null));
    ws.Send("close");
} catch (e) {
    addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Error 2: " + e);
}
