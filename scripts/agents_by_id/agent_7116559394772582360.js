// 7116559394772582360
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function delAccessGroupsFromObject(objectID, accessGroupIDs) {
    try {
        docObject = tools.open_doc(objectID);

        if(docObject != undefined) {
            objectTE = docObject.TopElem;

            for (accessGroupID in accessGroupIDs) {
                accessGroupID = OptInt(accessGroupID);

                if (objectTE.access.access_groups.ChildByKeyExists(accessGroupID)) {
                    objectTE.access.access_groups.DeleteChildByKey(accessGroupID);
                }
            }

            docObject.Save();
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Document with ID " + objectID + " not exist!");
            skipped++;
        }

        return true;
    } catch ( err ) {
        return false;
    }
}

function delAccessGroupsFromAttachedObjects(documentID, documentTE, catalogType, delAccessGroupIDs) {
    try {
        docTE = (tools.open_doc( documentID ) == undefined) ? documentTE : tools.open_doc(documentID).TopElem;

        objectIDs = getAttachedObjectIds('', docTE, catalogType);

        for (objectID in objectIDs) {
            delAccessGroupsFromObject( objectID, delAccessGroupIDs )
        }
        return true
    } catch ( err ) {
        return false
    }
}

function getAttachedObjectIds(documentID, documentTE, catalogType) {
    try {
        docTE = (tools.open_doc(documentID) == undefined) ? documentTE : tools.open_doc(documentID).TopElem;

        if ( catalogType == 'all' ) {
            results = [];
            for (catalog in docTE.catalogs) {
                ids = ArrayExtractKeys(catalog.objects, "object_id");
                for (id in ids) {
                    results.push(id);
                }
            }

            return results;
        } else {
            foundCatalog = ArrayOptFirstElem(docTE.catalogs, "This.type == '" + catalogType + "'");
            if (foundCatalog == undefined) {
                return [];
            } else {
                return ArrayExtractKeys(foundCatalog.objects, "object_id");
            }
        }
    } catch (err) {
        return [];
    }
}

function removeCondition(doc, orgId) {
    if(doc != undefined) {
        patternDocTE = doc.TopElem;

        for(condition in patternDocTE.access.conditions) {
            if(OptReal(condition.value) == orgId) {
                condition.Delete();
                break;
            }
        }

        doc.Save();
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Document with ID " + orgId + " not exist!");
        skipped++;
    }
}

if (!LdsIsServer) {
    var agentId = 7116559394772582360;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7116559394772582360";
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

    try{
        curDate = Date();
        paramStr = OBJECTS_ID_STR == '' ? '' : "and contains( '" + OBJECTS_ID_STR + "', $elem/id )";

        indOrderCards = ArraySelectAll(XQuery("for $elem in cc_ind_order_cards where $elem/status='Заказ на исполнении' and finish_date <= date() " + paramStr + " return $elem" ));

        total = ArrayCount(indOrderCards);

        agent.refreshChart = 1;
        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (indOrderCard in indOrderCards) {
            indOrderCardDoc = tools.open_doc(indOrderCard.id);

            if(indOrderCardDoc != undefined) {
                indOrderCardTE = indOrderCardDoc.TopElem;

                for (stage_num = 1; stage_num <= 9; stage_num++) {
                    docIds = ArrayExtractKeys(indOrderCardTE.OptChild("stage_" + stage_num + "_documents"), "stage_" + stage_num + "_document_id");
                    for (docId in docIds) {
                        delAccessGroupsFromObject(docId, [indOrderCardTE.OptChild("stage_" + stage_num + "_group_id").Value]);
                        delAccessGroupsFromAttachedObjects(docId, '', 'all', [indOrderCardTE.OptChild("stage_" + stage_num + "_group_id").Value]);
                    }
                }

                indOrderCardTE.status = "Заказ исполнен";
                indOrderCardDoc.Save();

                removeCondition(tools.open_doc(7247017380757573251), indOrderCard.org_id);
                removeCondition(tools.open_doc(7247026493378216428), indOrderCard.org_id);
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Document with ID " + indOrderCard.id + " not exist!");
                skipped++;
            }

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            if (processed % 10 == 0) {
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
    } catch(e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
}