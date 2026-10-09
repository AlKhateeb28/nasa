// 7305934630346030055
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function getCertificateIdByEduMethodsIds(personId, eduMethodIds) {
    certificateList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 1 ers.id AS ers_id, " +
        "       certs.id AS certs_id " +
        " FROM[WTDB].[dbo].event_results ers " +
        "       INNER JOIN[WTDB].[dbo].event_result er ON ers.id = er.id " +
        "       INNER JOIN[WTDB].[dbo].events es ON ers.event_id = es.id " +
        "           AND es.status_id = 'close' AND es.education_method_id IN(" + eduMethodIds + ") " +
        "       INNER JOIN[WTDB].[dbo].collaborators cs ON ers.person_id = cs.id AND cs.id = " + personId +
        "       INNER JOIN[WTDB].[dbo].certificates certs ON ers.certificate_id = certs.id " +
        " WHERE UPPER(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) = 'СЕРТИФИЦИРОВАН' " +
        " ORDER BY es.finish_date DESC "));

    result = {};
    result.eventResultId = null;
    result.certificateId = null;

    if (ArrayCount(certificateList) > 0) {
        result.eventResultId = certificateList[0].ers_id;
        result.certificateId = certificateList[0].certs_id;
    }

    return result;
}

var agentId = 7305934630346030055;

var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7305934630346030055";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

if (LdsIsServer) {
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

            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT doss.id, " +
                "       doss.student_id AS person_id " +
                " FROM[WTDB].[dbo].cc_dossier_rcc_employees doss " +
                " WHERE doss.student_id IS NOT NULL"));

            total = ArrayCount(dataList);

            agent.total = total;
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.message = "Обработка данных...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            for (data in dataList) {
                dossierDoc = tools.open_doc(data.id);

                isSaved = false;

                if (dossierDoc != undefined) {
                    dossierDocTE = dossierDoc.TopElem;

                    // RCK_RP
                    returnedObject = getCertificateIdByEduMethodsIds(data.person_id, "7124747534142012406, 7124735507140964982");
                    if (returnedObject.eventResultId != null) {
                        dossierDocTE.rcc_rp_cert = returnedObject.eventResultId;
                        isSaved = true;
                    }
                    if (returnedObject.certificateId != null) {
                        // Remove broken certificate's links
                        for (certificate in dossierDocTE.rcc_rp_certificates) {
                            certificationDoc = tools.open_doc(certificate.rcc_rp_certificate_id);

                            if (certificationDoc == undefined) {
                                try {
                                    dossierDocTE.rcc_rp_certificates.DeleteChildByKey(certificate.rcc_rp_certificate_id);                                    
                                } catch(e) {}                                
                            }
                        }

                        // Add new certificate id
                        dossierDocTE.rcc_rp_certificates.ObtainChildByKey(returnedObject.certificateId);
                        isSaved = true;
                    }

                    // OCK_RP
                    returnedObject = getCertificateIdByEduMethodsIds(data.person_id, "7131096280190570779");
                    if (returnedObject.eventResultId != null) {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] 1");
                        dossierDocTE.ock_rp_certification = returnedObject.eventResultId;
                        isSaved = true;
                    }
                    if (returnedObject.certificateId != null) {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");
                        dossierDocTE.ock_rp_certificate_id = returnedObject.certificateId;
                        isSaved = true;                        
                    }

                    // OCK_AM
                    returnedObject = getCertificateIdByEduMethodsIds(data.person_id, "7131096832623867767, 7143846913328314346");
                    if (returnedObject.eventResultId != null) {
                        dossierDocTE.ock_am_certification = returnedObject.eventResultId;
                        isSaved = true;
                    }
                    if (returnedObject.certificateId != null) {
                        dossierDocTE.ock_am_certificate = returnedObject.certificateId;
                        isSaved = true;                        
                    }

                    // OCK_BNO_RP
                    returnedObject = getCertificateIdByEduMethodsIds(data.person_id, "7143846913328314346");
                    if (returnedObject.eventResultId != null) {
                        dossierDocTE.ock_rp_certification = returnedObject.eventResultId;
                        isSaved = true;
                    }
                    if (returnedObject.certificateId != null) {
                        dossierDocTE.ock_am_certificate = returnedObject.certificateId;
                        isSaved = true;
                    }

                    // OCK_BNO_AM
                    returnedObject = getCertificateIdByEduMethodsIds(data.person_id, "7260348075183431472");
                    if (returnedObject.eventResultId != null) {
                        dossierDocTE.ock_am_certification = returnedObject.eventResultId;
                        isSaved = true;
                    }
                    if (returnedObject.certificateId != null) {
                        dossierDocTE.ock_am_certificate = returnedObject.certificateId;
                        isSaved = true;
                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + data.id + " is not exist!");
                    
                    skipped++;
                }

                processed++;

                if (isSaved) {
                    dossierDoc.Save();

                    saved++;
                }

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
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}