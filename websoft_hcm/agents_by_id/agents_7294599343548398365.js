// 7294599343548398365
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

try {
    var agentId = 7294599343548398365;

    if (!isAgentRunning(agentId)) {
        var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7294599343548398365";
        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

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

        parentGroup = ArrayDirect(XQuery("sql: " +
            " SELECT gs.id, " +
            "       gs.code " +
            " FROM [WTDB].[dbo].groups gs " +
            "       INNER JOIN[WTDB].[dbo].[group] g ON gs.id = g.id " +
            " WHERE gs.code LIKE 'ModProg_FCK_group_%' " +
            "       AND g.data.value('(//custom_elems/custom_elem[name=''IBP_wave_start_date''])[1]/value[1]', 'date') IS NOT NULL " +
            "       AND g.data.value('(//custom_elems/custom_elem[name=''IBP_wave_start_date''])[1]/value[1]', 'date') = CAST(GETDATE() AS DATE) "));

        total = ArrayCount(parentGroup);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        if (total > 0) {
            for (parentGr in parentGroup) {
                agent.message = "Обработка данных " + parentGr.code + "...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }

                groupCodeArray = parentGr.code.Value.split("_");

                if (ArrayCount(groupCodeArray) == 4) {
                    wave = groupCodeArray[3];

                    parentGroupDoc = tools.open_doc(OptInt(parentGr.id));

                    if (parentGroupDoc != undefined) {
                        isFoundCollaborator = false;

                        childGroup = ArrayDirect(XQuery("sql: " +
                            " SELECT gs.id, " +
                            "       gs.code " +
                            " FROM[WTDB].[dbo].groups gs " +
                            " WHERE gs.code LIKE 'ibp_volna-" + wave + "%' "));

                        if (ArrayCount(childGroup) > 0) {
                            agent.optionalData = {};
                            agent.optionalData.name1 = "Добавлено сотрудников";
                            agent.optionalData.value1 = "0";

                            optionalCount = 0;

                            for (childGr in childGroup) {
                                childGroupDoc = tools.open_doc(OptInt(childGr.id));

                                if (childGroupDoc != undefined) {
                                    for (collaborator in childGroupDoc.TopElem.collaborators) {
                                        isFoundCollaborator = true;

                                        child = parentGroupDoc.TopElem.collaborators.AddChild();
                                        child.collaborator_id = collaborator.collaborator_id;

                                        optionalCount++
                                        agent.optionalData.value1 = optionalCount;
                                    }
                                } else {
                                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Child group with ID  " + childGr.id + " is not exist!");
                                }
                            }

                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Added:  " + optionalCount);
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] No found children group(s)");
                        }

                        if (isFoundCollaborator) {
                            parentGroupDoc.Save();
                        }
                    } else {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] Parent group with ID  " + parentGr.id + " is not exist!");
                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong parent group CODE format: " + group.code);
                }

                processed++;

                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
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
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] No found parent group(s)");
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
