// 7107466891424790180
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isExistInCatalogById(catalogName, id) {
    return ArrayOptFirstElem(XQuery("for $elem in " + catalogName + "s where $elem/id = " + id + " return $elem")) != undefined;
}

function isNotExistInAccessGroup(docObjectTE, groupId) {
    return docObjectTE.access.access_groups.GetOptChildByKey(groupId) == undefined;
}

function addAccessGroupsToObject(docId, newGroupDocId) {
    docObject = tools.open_doc(docId)
    docObjectTE = docObject.TopElem;

    if (isExistInCatalogById("group", newGroupDocId) && isNotExistInAccessGroup(docObjectTE, newGroupDocId)) {
        docObjectTE.access.access_groups.ObtainChildByKey(newGroupDocId);
        docObject.Save();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] addAccessGroupsToObject. Дали доступ. DocID: " + docId + " NewGroupID: " + newGroupDocId);
    }
}

function addGroups(id) {
    indOrderCardDoc = tools.open_doc(id);

    indOrderCardTE = indOrderCardDoc.TopElem;

    for (stageNum = 1; stageNum <= 9; stageNum++) {
        if (indOrderCardTE.OptChild("stage_" + stageNum + "_start_date") != null && indOrderCardTE.OptChild("stage_" + stageNum + "_finish_date") != null && ArrayCount(indOrderCardTE.OptChild("stage_" + stageNum + "_documents")) != 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] addGroups. stageNum: " + stageNum + " Условия выполняются");

            groupId = null;

            if (indOrderCardTE.OptChild("stage_" + stageNum + "_group_id") == null) {
                // создаем группу доступа
                groupName = indOrderCardTE.num + "_" + indOrderCardTE.org_id.ForeignElem.code + "_" + stageNum + "_" + StrDate(indOrderCardTE.start_date, false, false);

                newGroupDoc = tools.new_doc_by_name("group", false);

                newGroupDoc.BindToDb();

                newGroupTE = newGroupDoc.TopElem;

                newGroupTE.name = groupName;

                newGroupTE.custom_elems.ObtainChildByKey("ind_order_card_start_date").value = indOrderCardTE.OptChild("stage_" + stageNum + "_start_date");
                newGroupTE.custom_elems.ObtainChildByKey("ind_order_card_finish_date").value = indOrderCardTE.OptChild("stage_" + stageNum + "_finish_date");

                newGroupDoc.Save();

                indOrderCardTE.OptChild("stage_" + stageNum + "_group_id").Value = newGroupDoc.DocID;

                groupId = newGroupDoc.DocID;
            } else {
                groupId = indOrderCardTE.OptChild("stage_" + stageNum + "_group_id").Value;

                existGroupDoc = tools.open_doc(groupId);

                if(existGroupDoc != null) {
                    existGroupDocTE = existGroupDoc.TopElem;

                    existGroupDocTE.custom_elems.ObtainChildByKey("ind_order_card_start_date").value = indOrderCardTE.OptChild("stage_" + stageNum + "_start_date");
                    existGroupDocTE.custom_elems.ObtainChildByKey("ind_order_card_finish_date").value = indOrderCardTE.OptChild("stage_" + stageNum + "_finish_date");
                    existGroupDocTE.custom_elems.ObtainChildByKey("ind_order_card_id").value = indOrderCardTE.id;
                    existGroupDoc.Save();

                    indOrderCardTE.OptChild("stage_" + stageNum + "_group_id").Value = existGroupDocTE.id;
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID " + groupId + " not exist!");
                }
            }

            docIds = ArrayExtractKeys(indOrderCardTE.OptChild("stage_" + stageNum + "_documents"), "stage_" + stageNum + "_document_id");
            for (docId in docIds) {
                addAccessGroupsToObject(docId, groupId);
            }

            docIds = ArrayExtractKeys(indOrderCardTE.OptChild("stage_" + stageNum + "_courses"), "stage_" + stageNum + "_course_id");
            for (docId in docIds) {
                addAccessGroupsToObject(docId, groupId);
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] addGroups. Условия не выполняются");
        }
    }

    indOrderCardTE.status = "Заказ на исполнении";
    indOrderCardDoc.Save();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] addGroups. Сохранили indOrderCard");

    if(indOrderCardTE.org_id != null && indOrderCardTE.start_date != null && indOrderCardTE.finish_date != null) {
        orgDoc = tools.open_doc(indOrderCardTE.org_id);

        if(orgDoc != undefined) {
            if(indOrderCardTE.start_date <= Date() && Date() <= indOrderCardTE.finish_date) {
                orgDoc.TopElem.custom_elems.ObtainChildByKey("is_a_commerce_client").value = "true";

                orgDoc.Save();
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + indOrderCardTE.org_id + " is not exist!");
        }
    }
}

function bossPanel(id) {
    indOrderCardDoc = tools.open_doc(id);
    indOrderCardTE = indOrderCardDoc.TopElem;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] BOSS Panel. Обрабатываем " + ArrayCount(indOrderCardTE.boss_panel_orgs) + " boss_panel_orgs");

    for (bossPanelOrg in indOrderCardTE.boss_panel_orgs) {
        foundCard = ArrayOptFirstElem(XQuery("for $elem in cc_boss_panel_org_courses where org_id=" + bossPanelOrg.boss_panel_org_id + " return $elem"));

        if (foundCard == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BossPanel. Новая запись в cc_boss_panel_org_courses");

            codeName = indOrderCardTE.num + "_" + tools.get_doc_by_key("org", "id", bossPanelOrg.boss_panel_org_id).TopElem.code +
                "_" + StrDate(OptDate(indOrderCardTE.start_date), false, false);
            newBossPanelOrgCourseDoc = tools.new_doc_by_name("cc_boss_panel_org_course", false);
            newBossPanelOrgCourseDoc.BindToDb();
            newCCBossPanelOrgCourseTE = newBossPanelOrgCourseDoc.TopElem;
            newCCBossPanelOrgCourseTE.code = codeName;
            newCCBossPanelOrgCourseTE.name = indOrderCardTE.num;
            newCCBossPanelOrgCourseTE.org_id = bossPanelOrg.boss_panel_org_id;
            newCCBossPanelOrgCourseTE.start_date = indOrderCardTE.start_date;
            newCCBossPanelOrgCourseTE.finish_date = indOrderCardTE.finish_date;
            newCCBossPanelOrgCourseTE.group_id = indOrderCardTE.OptChild("stage_1_group_id").Value;

            for (bossPanelCourse in indOrderCardTE.boss_panel_courses) {
                newCCBossPanelOrgCourseTE.courses.ObtainChildByKey(bossPanelCourse.boss_panel_course_id);
            }

            orgDoc = tools.open_doc(bossPanelOrg.boss_panel_org_id);
            orgDocTE = null;
            if(orgDoc != undefined) {
                orgDocTE = orgDoc.TopElem;
            }

            stage1GroupDoc = tools.open_doc(OptInt(newCCBossPanelOrgCourseTE.group_id));
            stage1GroupDocTE = null;
            if(stage1GroupDoc != undefined) {
                stage1GroupDocTE = stage1GroupDoc.TopElem;
            }

            for (bossPanelCol in indOrderCardTE.boss_panel_cols) {
                collaboratorDoc = tools.open_doc(bossPanelCol.boss_panel_col_id);

                if(collaboratorDoc != undefined) {
                    collaboratorDocTE = collaboratorDoc.TopElem;

                    // NEW GROUP
                    if (!newGroupTE.func_managers.ChildByKeyExists(bossPanelCol.boss_panel_col_id)) {
                        getNewFuncManager(newGroupTE, collaboratorDocTE);
                    }

                    // ORGANIZATION
                    if (orgDocTE != null && !orgDocTE.func_managers.ChildByKeyExists(bossPanelCol.boss_panel_col_id)) {
                        getNewFuncManager(orgDocTE, collaboratorDocTE);
                    }

                    // STAGE1 GROUP
                    if (stage1GroupDocTE != null && !stage1GroupDocTE.func_managers.ChildByKeyExists(bossPanelCol.boss_panel_col_id)) {
                        getNewFuncManager(stage1GroupDocTE, collaboratorDocTE);
                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + bossPanelCol.boss_panel_col_id + " is not exist!");
                }
            }

            orgDoc.Save();
            stage1GroupDoc.Save();

            newBossPanelOrgCourseDoc.Save();
        }
    }

    indOrderCardDoc.Save();

    // ADD PERSONS FOR PR INTO GROUP
    specialGroupDoc = tools.open_doc(7374801458644609163);

    if(specialGroupDoc != undefined) {
        specialGroupDocTE = specialGroupDoc.TopElem;

        for(bossPanelCols in indOrderCardTE.boss_panel_cols) {
            specialGroupDocTE.collaborators.ObtainChildByKey(bossPanelCols.boss_panel_col_id);
        }

        specialGroupDoc.Save();
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Special group with ID " + 7374801458644609163 + " is not exist!");
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] BossPanel. Сохранили indOrderCardDoc");
}

function getNewFuncManager(documentTE, collaboratorDocTE) {
    newFuncManager = documentTE.func_managers.AddChild();
    newFuncManager.person_id = collaboratorDocTE.id;
    newFuncManager.person_fullname = collaboratorDocTE.lastname + " " + collaboratorDocTE.firstname + " " + collaboratorDocTE.middlename;
    newFuncManager.person_position_id = collaboratorDocTE.position_id;
    newFuncManager.person_position_name = collaboratorDocTE.position_name;
    newFuncManager.person_position_code = ArrayOptFirstElem(XQuery("for $elem in positions where $elem/id = " + collaboratorDocTE.position_id + " return $elem")) == undefined ? "" : ArrayOptFirstElem(XQuery("for $elem in positions where $elem/id = " + collaboratorDocTE.position_id + " return $elem")).code;
    newFuncManager.person_org_id = collaboratorDocTE.org_id;
    newFuncManager.person_org_name = collaboratorDocTE.org_name;
    newFuncManager.person_org_code = ArrayOptFirstElem(XQuery("for $elem in orgs where $elem/id = " + collaboratorDocTE.org_id + " return $elem")) == undefined ? "" : ArrayOptFirstElem(XQuery("for $elem in orgs where $elem/id = " + collaboratorDocTE.org_id + " return $elem")).code;
    newFuncManager.person_subdivision_id = collaboratorDocTE.position_parent_id;
    newFuncManager.person_subdivision_name = collaboratorDocTE.position_parent_name;
    newFuncManager.person_code = collaboratorDocTE.code;
    newFuncManager.is_native = "1";
    newFuncManager.boss_type_id = 7158147030098137646; // Для индивидуального заказа
}

function isOrgsExistInConditions(conditions, orgId) {
    for(condition in conditions) {
        if(OptReal(condition.value) == orgId) {
            return true;
        }
    }

    return false;
}

function addCondition(docId, orgId, step) {
    doc = tools.open_doc(docId);

    if(doc != undefined) {
        patternDocTE = doc.TopElem;

        if(!isOrgsExistInConditions(patternDocTE.access.conditions, orgId)) {
            conditionElement = patternDocTE.access.conditions.AddChild("condition");

            conditionElement.field = "org_id";
            conditionElement.title = "Организация";
            conditionElement.value = orgId;
            conditionElement.type = "integer";
            conditionElement.option_type = "neq";
            conditionElement.is_custom_field = 1;
            conditionElement.and_or = "and";

            // DELETE
            /*for(condition in patternDocTE.access.conditions) {
                if(OptReal(condition.value) == indOrderCard.org_id) {
                    condition.Delete();
                }
            }*/

            doc.Save();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] addCondition. Добавили условие для организации с ID: " + orgId);
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Document with ID " + orgId + " not exist!");
        skipped++;
    }
}

var agentId = 7107466891424790180;
var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7107466891424790180";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var skipped = 0;

var errorStringNumber = 0;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try{
    //params = OBJECTS_ID_STR == "" ? "" : "AND CONTAINS('" + OBJECTS_ID_STR + "'";

    indOrderCards = ArrayDirect(XQuery("sql: " +
        " SELECT id, org_id " +
        " FROM [WTDB].[dbo].cc_ind_order_cards " +
        " WHERE GETDATE() < finish_date " +
        "    AND (status IS NULL OR UPPER(status) = N'ЗАКАЗ НА ИСПОЛНЕНИИ') "/* + params*/));

    total = ArrayCount(indOrderCards);

    agent.refreshChart = 1;
    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Найдено " + ArrayCount(indOrderCards) + " cc_ind_order_cards");

    for (indOrderCard in indOrderCards) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] >>>>>>>>> OrgID: " + indOrderCard.org_id);

        addGroups(indOrderCard.id);
        bossPanel(indOrderCard.id);

        addCondition(7247017380757573251, indOrderCard.org_id, 1);
        addCondition(7247026493378216428, indOrderCard.org_id, 2);

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
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
        null,
        skipped + " skipped"
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );
} catch(e) {
    agent.state = 2;
    agent.errorMessage = e + " Line " + errorStringNumber;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e  + " Line " + errorStringNumber);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}

