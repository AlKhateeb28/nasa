// 7305587563521009534
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }
function isAgentRunning(id) { runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running'); if (runningAgentList != undefined) { runningCount = 0; for (runningAgentId in runningAgentList) { agentJsonData = tools.spxml_unibridge.Object.provider.GetUserData('ag_info_' + runningAgentId); runningAgent = tools.read_object(agentJsonData); if (OptInt(runningAgent.GetOptProperty('id')) == OptInt(id)) { runningCount++; } } } if (runningCount > 1) { return true; } return false; }

function deleteFromAllStatuses(docTE, id) {
    try {
        docTE.experts.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.practitioners.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.beginners.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.theorists.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.students.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.candidates.DeleteChildByKey(id);
    } catch (e) {}
    try {
        docTE.whithout_statuss.DeleteChildByKey(id);
    } catch (e) {}
}

function addLectorsToPermissionRunPrograms(program, step) {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ls.id AS lector_id, " +
        " ls.person_id, " +
        " ls.is_dismiss, " +
        " l.data.value('(//custom_elems/custom_elem[name=''lector_status_code_" + program.suffix + "''])[1]/value[1]', 'varchar') AS status " +
        " FROM [WTDB].[dbo].cc_permission_run_programs_fcks prps " +
        "    INNER JOIN [WTDB].[dbo].lector l " +
        "       ON prps.education_method_id = l.data.value('(//custom_elems/custom_elem[name=''education_method_" + program.suffix + "''])[1]/value[1]', 'bigint') " +
        "    INNER JOIN [WTDB].[dbo].lectors ls ON l.id = ls.id " +
        " WHERE prps.id = " + program.id +
        " ORDER BY ls.person_fullname "));

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Шаг " + step + " из " + total + ". Обработка данных " + program.suffix + "...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    permissionDoc = tools.open_doc(program.id);

    if (permissionDoc != undefined) {
        permissionDocTE = permissionDoc.TopElem;

        isSave = false;

        for (data in dataList) {
            if (OptInt(data.is_dismiss) == 1) {
                deleteFromAllStatuses(permissionDocTE, data.lector_id);

                isSave = true;
            } else {
                if (data.status == "-") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.whithout_statuss.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "План") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.candidates.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "0") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.students.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "1") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.theorists.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "2") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.beginners.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "3") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.practitioners.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else if (data.status == "4") {
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    permissionDocTE.experts.ObtainChildByKey(data.lector_id);

                    isSave = true;
                } else {
                    // LECTOR DOESN'T HAVE DEFINED STATUSES
                    deleteFromAllStatuses(permissionDocTE, data.lector_id);

                    isSave = true;
                }
            }

            if (isSave) {
                permissionDoc.Save();
            }
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Permission with ID " + program.id + " is not found!");
    }
}

var programs = [
    { suffix: "base", id: 7305565340283008252 },
    { suffix: "ao", id: 7305574430795227928 },
    { suffix: "oee", id: 7305575060006222631 },
    { suffix: "smed", id: 7305575654360604724 },
    { suffix: "tpm", id: 7305577596182159014 },
    { suffix: "vk", id: 7305578259796289423 },
    { suffix: "vp", id: 7305579116661541777 },
    { suffix: "dc", id: 7305579462401930551 },
    { suffix: "twi", id: 7305580081868013117 },
    { suffix: "pp", id: 7305580808869851812 },
    { suffix: "ree", id: 7305582685720623690 },
    { suffix: "sl", id: 7305583332655591498 },
    { suffix: "sr", id: 7305585121029986366 },
    { suffix: "uz", id: 7305585919904152804 },
    { suffix: "ei", id: 7305587626818370828 },
    { suffix: "office", id: 7305588197972212237 },
    { suffix: "ssd", id: 7305591190890478021 },
    { suffix: "ppr", id: 7305612986770204054 },
    { suffix: "fp", id: 7305613812485924960 },
    { suffix: "fp_ppr", id: 7305614500293993192 },
    { suffix: "fop", id: 7305616942385331212 },
    { suffix: "fop_ppr", id: 7305617779836528189 },
    { suffix: "flp", id: 7305618280226484782 },
    { suffix: "flp_ppr", id: 7305618760286535458 }
];

var agentId = 7305587563521009534;

var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7305587563521009534";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

if (LdsIsServer) {
    try {
        if (!isAgentRunning(agentId)) {
            var total = ArrayCount(programs);
            var processed = 0;

            agent.message = "Получение данных...";
            ws = sendMessageToWebsocket(ws, agent);
            prevDate = new Date();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

            for (program in programs) {
                processed++;

                addLectorsToPermissionRunPrograms(program, processed);

                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }

            agent.state = 1;
            agent.processed = processed;
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
                null,
                null
            );

            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
            );
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent is running. Waiting for it to be completed!");

            agent.state = 1;
            agent.processed = 0;
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