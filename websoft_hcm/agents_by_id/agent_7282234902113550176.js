// 7282220574086987739
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + agentId); addLogMessage(loggerName, "[agent.id: " + agentId + "] TE: " + agentDoc.TopElem); agentDocTE = agentDoc.TopElem; userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDocTE.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function fillEducationMethodFields(eduMethodCountField, npsField, step, max) {
    agent.message = "Шаг " + step + " из " + max + ". Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ls.id, " +
        "        em.data.value('(//custom_elems/custom_elem[name=''access_education_method''])[1]/value[1]', 'bigint') AS access_education_method " +
        " FROM[WTDB].[dbo].lectors ls " +
        " 	INNER JOIN[WTDB].[dbo].lector l ON ls.id = l.id " +
        "	INNER JOIN[WTDB].[dbo].education_methods ems ON l.data.value('(//custom_elems/custom_elem[name=''" + eduMethodCountField + "''])[1]/value[1]', 'bigint') = ems.id " +
        "   INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
        " WHERE (l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Тренер ФЦК субсидия' " +
        "		OR l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Тренер ФЦК коммерция' " +
        " 		OR l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Методолог ФЦК') "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Шаг " + step + " из " + max + ". Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        eduMethodsCount = 0;
        nps = 0;
        npsCount = 0;

        ccTrenFckDoc = tools.open_doc(OptInt(data.access_education_method));

        if (ccTrenFckDoc != undefined) {
            lectorsDoc = tools.open_doc(OptInt(data.id));

            if (lectorsDoc != undefined) {
                for (education_method_list in ccTrenFckDoc.TopElem.education_method_lists) {
                    eventList = ArrayDirect(XQuery("sql: " +
                        " SELECT es.id, " +
                        "        e.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps " +
                        " FROM[WTDB].[dbo].events es " +
                        "	INNER JOIN[WTDB].[dbo].event e ON es.id = e.id " +
                        "    CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
                        "    INNER JOIN[WTDB].[dbo].lectors ls ON T.c.value('lector_id[1]', 'varchar(max)') = ls.id AND ls.id = " + data.id +
                        " WHERE es.education_method_id = " + education_method_list.education_method_list_id));

                    eduMethodsCount += ArrayCount(eventList);

                    for (event in eventList) {
                        calculatedNps = OptInt(event.nps);

                        if (calculatedNps != undefined) {
                            nps += calculatedNps;
                            npsCount++;
                        }
                    }
                }

                lectorsDoc.TopElem.custom_elems.ObtainChildByKey(eduMethodCountField).value = eduMethodsCount;

                if (npsCount > 0) {
                    nps = Math.round(nps / npsCount);
                }
                lectorsDoc.TopElem.custom_elems.ObtainChildByKey(npsField).value = nps;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] " + eduMethodCountField + ": " + eduMethodsCount + " " + data.id + ": " + nps);

                lectorsDoc.Save();

                saved++;
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Lector with ID " + data.id + " is not exist!");
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] cc_tren_fck with ID " + data.cc_tren_fck_id + " is not exist!");
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
}

try {
    var agentId = 7282220574086987739;
    var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7282220574086987739";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    max = 18;
    fillEducationMethodFields("education_method_base", "nps_base", 1, max);

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
