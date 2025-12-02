// 6974513176326201916
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 6974513176326201916;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS;
var msPerRecord = 0.001;

sLogMethod = "report";

var startDate = Date();
var prevDate= Date();
var loggerName = "agent_6974513176326201916";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);

    groupCollaboratorsList = ArrayDirect(XQuery("sql: " +
        " SELECT group_collaborators.collaborator_id AS colls_id" +
        " FROM [WTDB].[dbo].group_collaborators" +
        " LEFT JOIN [WTDB].[dbo].collaborators ON collaborators.id = group_collaborators.collaborator_id" +
        " LEFT JOIN [WTDB].[dbo].org ON collaborators.org_id = org.id" +
        " WHERE group_collaborators.group_id = " + Param.group_id +
        " AND org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true'"));

    total = ArrayCount(groupCollaboratorsList);
    processed = 0;
    saved = 0;
    fullDeleted = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Total: " + total + " processing");

    agent.total = total;
    agent.processed = processed;
    agent.saved = saved;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.refreshChart = 1;
    agent.message = "Обработка данных...";
    ws = sendMessageToWebsocket(ws, agent);

    prevDate = Date();

    count = 0;
    organizationCount = 0;
    functionManagersCount = 0;

    agent.optionalData = {};
    agent.optionalData.name1 = "Сохранено организаций";
    agent.optionalData.value1 = "0 / 0";
    agent.optionalData.name2 = "Удалено из групп";
    agent.optionalData.value2 = "0 / 0";

    for (groupCollaborator in groupCollaboratorsList) {
        collaboratorDoc = tools.open_doc(groupCollaborator.colls_id);

        collaboratorTE = collaboratorDoc.TopElem;
        collaboratorTE.access.access_role = "OrganizingTrainerRCK"; // Тренер-организатор РЦК
        collaboratorDoc.Save();

        collsOrganization = tools.open_doc(collaboratorTE.org_id);

        if (collsOrganization != undefined) {
            collsOrganizationTE = collsOrganization.TopElem;

            organizationList = ArraySelectAll(XQuery("sql: " +
                " SELECT orgs.id " +
                " FROM [WTDB].[dbo].orgs " +
                "   INNER JOIN [WTDB].[dbo].org  ON orgs.id = org.id " +
                " WHERE " +
                "   org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') = " + collsOrganizationTE.custom_elems.ObtainChildByKey("fact_region_id").value +
                "   AND org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'rcc'"));

            organizationCount += ArrayCount(organizationList);

            for (organizationResult in organizationList) {
                organization = tools.open_doc(organizationResult.id);

                organizationTE = organization.TopElem;
                fmCollaborator = organizationTE.func_managers.GetOptChildByKey(groupCollaborator.colls_id);

                if (fmCollaborator == undefined) {
                    fm = organizationTE.func_managers.ObtainChildByKey(groupCollaborator.colls_id, "person_id");

                    fm.person_fullname = collaboratorTE.fullname;
                    fm.person_position_id = collaboratorTE.position_id;
                    fm.person_position_name = collaboratorTE.position_name;
                    fm.person_position_code = collaboratorTE.position_id.ForeignElem.code;
                    fm.person_org_id = collaboratorTE.org_id;
                    fm.person_org_name = collaboratorTE.org_name;
                    fm.person_org_code = collaboratorTE.org_id.ForeignElem.code;
                    fm.person_code = collaboratorTE.code;
                    fm.is_native = "0";
                    fm.boss_type_id = 6878899960667451125; // RCK_Collaborator Сотрудник РЦК

                    organization.Save();

                    saved++;

                    agent.optionalData.value1 = saved + " / " + organizationCount;
                }

                count++;

                agent.message = "Обработано организаций " + count + " из " + organizationCount;
                ws = sendMessageToWebsocket(ws, agent);
            }

            functionManagersList = ArrayDirect(XQuery("sql: SELECT fm.id, fm.catalog, fm.object_id FROM [WTDB].[dbo].func_managers AS fm WHERE fm.person_id = " + collaboratorTE.id));

            deleted = 0;
            functionManagersCount += ArrayCount(functionManagersList);

            for (fmResult in functionManagersList) {
                if(fmResult.catalog == "org") {
                    organization = tools.open_doc(fmResult.object_id);

                    if (organization != undefined) {
                        try {
                            organizationTE = organization.TopElem;

                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Coll Org Region: -" + collsOrganizationTE.custom_elems.ObtainChildByKey("fact_region_id").value +
                                "- Org Region: -" + organizationTE.custom_elems.ObtainChildByKey("fact_region_id").value + "-");

                            if(collsOrganizationTE.custom_elems.ObtainChildByKey("fact_region_id").value != organizationTE.custom_elems.ObtainChildByKey("fact_region_id").value) {
                                organizationTE.func_managers.DeleteChildByKey(collaboratorTE.id);
                                organization.Save();

                                deleted++;

                                agent.optionalData.value2 = deleted + " / " + functionManagersCount;
                            }
                        } catch (e) {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] FM error: " + e);
                        }
                    } else {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID = " + fmResult.object_id + " not exist!");
                    }
                }

                count++;

                if (count % 10 == 0) {
                    agent.message = "Организиции: Удалено " + deleted + " из " + functionManagersCount + " FM объектов";
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }

            fullDeleted += deleted;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID: " + collaboratorTE.org_id + " not exist!");
        }

        processed++;

        agent.processed = processed;
        agent.saved = saved;
        ws = sendMessageToWebsocket(ws, agent);

        if (processed % 100 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed" + ", " + saved + " saved, remaining time: " + getDurationMessage((total - processed) * msPerRecord));
        }
    }

    //addLogMessage(loggerName, "[agent.id: " + agentId + "] " + fullDeleted + " deleted");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] " + total + " total, " + processed + " processed, " + saved + " saved");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

    agent.state = 1;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.processed = processed;
    agent.saved = saved;
    refreshMsPerRow(agent, startDate, total);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Закончено. Продолжительность " + duration;
    ws = sendMessageToWebsocket(ws, agent);
} catch(e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    alert("ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
