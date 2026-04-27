// 6792310979461644364
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

try {
    sFileUrl = '';

    for (i = 0; i <= 60; i++) {
        xarrResource = ArrayOptFirstElem(XQuery("for $elem in resources where $elem/id=" + Int(ResourseId) + " return $elem"));
        if (xarrResource != undefined) {
            teResource = OpenDoc(UrlFromDocID(xarrResource.id)).TopElem;
            sFileUrl = teResource.file_url;
            break;
        } else {
            Sleep(2000);
        }
    }

    userRoleCod = curUser.access.access_role;
    bOrganizingTrainer = (userRoleCod == "OrganizingTrainer");

    oOrganizingTrainerRCK = ArrayOptFirstElem(tools.xquery("for $elem in func_managers where $elem/person_id = " + curUserID + " and $elem/boss_type_id = 6878899960667451125 and $elem/catalog = 'org' return $elem"));
    bOrganizingTrainerRCK = oOrganizingTrainerRCK != undefined;

    if (!bOrganizingTrainer && !bOrganizingTrainerRCK) {
        docAgent = tools.open_doc(6795453920059029722);
        docAgentTE = docAgent.TopElem;

        for (wvar in docAgentTE.wvars) {
            if (wvar.name == "event_id") {
                wvar.value = OptInt(EventId);
            }
        }
        docAgent.Save();

        tools.start_agent(6795453920059029722, null, xarrResource.id, null, null);
    } else {
        iAgentID = 0;
        if (bOrganizingTrainer) {
            iAgentID = 6852175329665701223;
        } else if (bOrganizingTrainerRCK) {
            iAgentID = 6898265584977189358;
        }

        docAgent = tools.open_doc(iAgentID);
        docAgentTE = docAgent.TopElem;

        for (wvar in docAgentTE.wvars) {
            if (wvar.name == "event_id") {
                wvar.value = OptInt(EventId);
            }
        }
        docAgent.Save();
        tools.start_agent(iAgentID, null, "{sFileUrl:'" + xarrResource.id + "',orgId:'" + curUser.org_id + "',curUserID:'" + curUserID + "'}", null, null);
    }

    MESSAGE = "Сотрудники будут загружены в течение нескольких минут";
    //RESULT=1;
}
catch (err) {
    alert(err);
    ERROR = 1;
    MESSAGE = tools_web.get_web_const('c_error', curLngWeb);
}