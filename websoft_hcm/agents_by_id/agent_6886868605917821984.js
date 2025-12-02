// 6886868605917821984
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

sConstApplicationCode = "websoftcontinuouslearning";

var agentId = 6886868605917821984;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_6886868605917821984";
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

if (OptInt(OBJECT_ID) != undefined) {
    var arrEducationPlanIDs = [OptInt(OBJECT_ID)];
} else {
    var arrEducationPlanIDs = ArrayExtract(ArrayOptFirstElem(tools_app.get_application_objects(sConstApplicationCode, "education_plan")).xq_result, "This.id.Value");
}

var docEducationPlan, teEducationPlan;
var dStartDate, sMsg, bChanged;

total = ArrayCount(arrEducationPlanIDs);

agent.total = total;
agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
agent.message = "Обработка данных...";
if (ws != null) {
    ws = sendMessageToWebsocket(ws, agent);
}
prevDate = new Date();

try {
    for (itemEducationPlanID in arrEducationPlanIDs) {
        try {
            docEducationPlan = tools.open_doc(itemEducationPlanID);

            if(docEducationPlan != undefined) {
                educationPlanTE = docEducationPlan.TopElem;

                if (OptInt(educationPlanTE.state_id) <= 1) {


                    addLogMessage(loggerName, "[agent.id: " + agentId + "] " + StrReplace('Обработка плана обучения "{PARAM1}".', "{PARAM1}", educationPlanTE.name.Value));

                    switch (educationPlanTE.type.Value) {
                        case "collaborator":
                            tools.call_code_library_method('libEducation', 'update_education_plan', [educationPlanTE.id.Value, docEducationPlan, (educationPlanTE.person_id.HasValue ? educationPlanTE.person_id.Value : educationPlanTE.object_id.Value), true]);

                            break;
                        case "group": {
                            checkEducation = true;
                            docGroup = tools.open_doc(OptInt(docEducationPlan.TopElem.object_id.Value, 0));
                            if (docGroup != undefined) {
                                teGroup = docGroup.TopElem;
                                for (itemCollaborator in XQuery("for $elem in group_collaborators where $elem/group_id=" + XQueryLiteral(docEducationPlan.TopElem.object_id.Value) + " return $elem/Fields('collaborator_id')")) {
                                    curCol = ArrayOptFindByKey(teGroup.collaborators, itemCollaborator.collaborator_id, 'collaborator_id');
                                    if (curCol != undefined) {
                                        _arrDesc = [];
                                        try {
                                            _arrDesc = tools.read_object(curCol.desc);
                                            if (!IsArray(_arrDesc)) _arrDesc = [];
                                        } catch (err) {
                                            _arrDesc = [];
                                        }

                                        _oDesc = ArrayOptFindByKey(_arrDesc, docEducationPlan.TopElem.id.Value, 'education_plan_id');
                                        if (_oDesc != undefined) {
                                            if (_oDesc.status == 'cancel' || _oDesc.status == 'lock') {
                                                checkEducation = false;
                                            }

                                            if (_oDesc.status == 'lock' && _oDesc.date_finish != '' && CurDate >= ParseDate(_oDesc.date_finish)) {
                                                _oDesc.status = '';
                                                _oDesc.date_start = '';
                                                _oDesc.date_finish = '';
                                            }
                                        }
                                    }

                                    if (checkEducation) {
                                        tools.call_code_library_method('libEducation', 'update_education_plan', [educationPlanTE.id.Value, docEducationPlan, itemCollaborator.collaborator_id.Value, true]);
                                    }
                                }
                            }
                            break;
                        }
                    }

                    tools_app.get_application_lib(sConstApplicationCode).update_events_by_model(itemEducationPlanID, docEducationPlan, null, true);

                    bChanged = false;
                    for (itemProgram in educationPlanTE.programs) {
                        sMsg = null;

                        dStartDate = itemProgram.plan_date.HasValue ? DateNewTime(itemProgram.plan_date.Value) : (itemProgram.create_date.HasValue ? DateNewTime(itemProgram.create_date.Value) : null);

                        if (OptInt(itemProgram.state_id.Value) < 2 && itemProgram.finish_date.HasValue && DateNewTime(Date()) > DateNewTime(itemProgram.finish_date.Value)) {
                            itemProgram.state_id = 2;
                            bChanged = true;
                            sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", educationPlanTE.id.Value + " : " + educationPlanTE.name.Value), "{PARAM3}", "Завершен")
                        } else if (OptInt(itemProgram.state_id.Value) > 0 && dStartDate != null && DateNewTime(Date()) < dStartDate) {
                            itemProgram.state_id = 0;
                            bChanged = true;
                            sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", educationPlanTE.id.Value + " : " + educationPlanTE.name.Value), "{PARAM3}", "Назначен");
                        } else if (OptInt(itemProgram.state_id.Value) != 1 && (dStartDate != null && DateNewTime(Date()) >= dStartDate) && (itemProgram.finish_date.HasValue && DateNewTime(Date()) <= DateNewTime(itemProgram.finish_date.Value))) {
                            itemProgram.state_id = 1;
                            bChanged = true;
                            sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", educationPlanTE.id.Value + " : " + educationPlanTE.name.Value), "{PARAM3}", "В процессе");
                        }

                        if (sMsg != null) {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] " + sMsg);
                        }
                    }

                    if (bChanged) {
                        docEducationPlan.Save();

                        saved++;
                    }
                }
            } else {
                skipped++;
            }
        } catch (err) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] " + "ERROR: Plan ID:[" + itemEducationPlanID + "]: " + err);
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 100 == 0) {
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