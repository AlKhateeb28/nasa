// 7376232626104384076
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7376232626104384076;
var userId = curUserID;
var msPerRecord = 0.09;

if (LdsIsServer ) {
    sLogMethod = "report";

    var startDate = Date();
    var prevDate= Date();
    var loggerName = "agent_7376232626104384076";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);

        collaboratorList = ArrayDirect(XQuery("sql: SELECT cs.id  FROM [WTDB].[dbo].collaborators cs WHERE cs.is_dismiss = 'true'"));

        organizationList = ArrayDirect(XQuery("sql: SELECT *  FROM [WTDB].[dbo].orgs"));
        orgCount = ArrayCount(organizationList);

        groupList = ArrayDirect(XQuery("sql: SELECT *  FROM [WTDB].[dbo].groups"));
        groupCount = ArrayCount(groupList);

        processed = 0;
        skipped = 0;
        saved = 0;
        notFound = 0;

        total = ArrayCount(collaboratorList);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

        agent.total = total;
        agent.saved = saved;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.refreshChart = 1;
        agent.message = "Обработка данных...";
        ws = sendMessageToWebsocket(ws, agent);

        prevDate = Date();

        count = 0;
        functionManagersCount = 0;

        agent.optionalData = {};
        agent.optionalData.name1 = "Удалено из организаций";
        agent.optionalData.value1 = "0 / 0";
        agent.optionalData.name2 = "Удалено из групп";
        agent.optionalData.value2 = "0 / 0";

        for (result in collaboratorList) {
            collaborator = tools.open_doc(result.id);
            if(collaborator != undefined) {
                collaboratorTE = collaborator.TopElem;
                collaboratorTE.access.access_role = "user";
                collaboratorTE.access.web_banned = "1";
                collaborator.Save();

                // Remove from 6803568298380709093 group
                groupDoc = tools.open_doc(6803568298380709093);
                if(groupDoc != undefined) {
                    try {
                        groupDoc.TopElem.collaborators.DeleteChildByKey(collaboratorTE.id);
                        groupDoc.Save();
                    } catch (e) {

                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID = 6803568298380709093 not exist!");
                }

                functionManagersList = ArrayDirect(XQuery("sql: SELECT fm.id, fm.catalog, fm.object_id FROM [WTDB].[dbo].func_managers AS fm WHERE fm.person_id = " + collaboratorTE.id + " ORDER BY fm.catalog"));

                functionManagersCount += ArrayCount(functionManagersList);

                for (fmResult in functionManagersList) {
                    if(fmResult.catalog == "group") {
                        group = tools.open_doc(fmResult.object_id);
                        if (group != undefined) {
                            try {
                                groupTE = group.TopElem;
                                groupTE.func_managers.DeleteChildByKey(collaboratorTE.id);
                                group.Save();

                                count++;

                                agent.optionalData.value2 = count + " / " + functionManagersCount;
                            } catch (e) {

                            }
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID = " + fmResult.object_id + " not exist!");
                        }
                    } else {
                        if(fmResult.catalog == "org") {
                            organization = tools.open_doc(fmResult.object_id);

                            if (organization != undefined) {
                                try {
                                    organizationTE = organization.TopElem;
                                    organizationTE.func_managers.DeleteChildByKey(collaboratorTE.id);
                                    organization.Save();

                                    count++;

                                    agent.optionalData.value1 = count + " / " + functionManagersCount;
                                } catch (e) {

                                }
                            } else {
                                addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID = " + fmResult.object_id + " not exist!");
                            }
                        }
                    }

                    agent.message = "Удаление объектов...";
                    ws = sendMessageToWebsocket(ws, agent);
                }

                if(functionManagersCount > 0) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Удалено объектов " + count + " у collaborator with ID = " + collaboratorTE.id);
                }

                saved++;
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID = " + result.id + " not exist!");

                notFound++;
            }

            processed++;


            agent.processed = processed;
            agent.saved = saved;
            agent.notFound = notFound;
            agent.message = "Обработка данных...";
            ws = sendMessageToWebsocket(ws, agent);

            if(processed % 100 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
                );
            }
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] " + total + " total, " + processed + " processed, " + notFound + " not found");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        ws = sendMessageToWebsocket(ws, agent);

        saveMonitorAgents(agent, startDate);
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        saveMonitorAgents(agent, startDate);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}

} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok' );
}