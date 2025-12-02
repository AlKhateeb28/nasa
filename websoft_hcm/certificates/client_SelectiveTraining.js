// AGENT 7171722725929743276
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getEducationMethodNames ( _col_id, _edu_meths_str ) {
    sql = "sql: " +
        " SELECT" +
        " education_methods.name AS e_m_name" +
        " FROM event_results" +
        " LEFT JOIN events" +
        " ON events.id = event_results.event_id" +
        " LEFT JOIN education_methods" +
        " ON education_methods.id = events.education_method_id" +
        " WHERE events.type_id = 'education_method'" +
        " AND events.education_method_id IN (" + _edu_meths_str + ")" +
        " AND event_results.person_id = " + _col_id +
        " AND event_results.is_assist = 1" +
        " AND events.status_id = 'close'";

    unique_e_m_names_arr = ArraySelectDistinct(
        ArraySelectAll( XQuery( sql ) ),
        "This.e_m_name"
    );

    return ArrayMerge( unique_e_m_names_arr, "This.e_m_name", ", " );
}

if ( LdsIsClient ) {
    var agentId = 7171722725929743276;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "aa_agent_7171722725929743276";

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try {
        var total = 0;
        var processed = 0;
        var saved = 0;

        var certificateTypeId = 7069723285559858963;
        var edu_meths_arr = tools.read_object(Param.edu_meths);
        var edu_meths_str = ArrayMerge(edu_meths_arr, "This.edu_meth", ",");

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);

        switch (Param.work_type) {
            case 'org':
                organizationList = ArraySelectAll(XQuery("for $elem in collaborators where $elem/org_id='" + Param.org_id + "' and contains($elem/code, 'load_muc') return $elem"));

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);
                total = ArrayCount(organizationList);

                agent.total = total;
                agent.message = "Обработка данных...";
                ws = sendMessageToWebsocket(ws, agent);
                prevDate = new Date();

                for (organization in organizationList) {
                    certificateList = "for $elem in certificates where $elem/type_id=" + certificateTypeId + " and $elem/person_id=" + organization.id + " return $elem";
                    certificate = ArrayOptFirstElem(XQuery(certificateList));

                    uniqueEducationMethodNames = getEducationMethodNames(organization.id, edu_meths_str);

                    if (certificate == undefined) {
                        if (uniqueEducationMethodNames != "") {
                            docCertificate = tools.create_certificate_to_person(organization.id, certificateTypeId);
                            docCertificate.TopElem.serial = "РК";
                            docCertificate.TopElem.delivery_date = Date();
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                            docCertificate.Save();

                            saved++;
                        }
                    } else {
                        if (uniqueEducationMethodNames != "") {
                            docCertificate = tools.open_doc(certificate.id);
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                            docCertificate.Save();

                            saved++;
                        }
                    }

                    processed++;

                    if (processed % 10 == 0) {
                        agent.processed = processed;
                        agent.saved = saved;
                        if (ws != null) {
                            ws = sendMessageToWebsocket(ws, agent);
                        }
                    }
                    if (processed % 1000 == 0) {
                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                        );
                    }
                }
                break;

            case 'group':
                groupList = ArraySelectAll(XQuery("sql: " +
                    " SELECT" +
                    " group_collaborators.collaborator_id AS col_id" +
                    " FROM group_collaborators" +
                    " LEFT JOIN collaborators" +
                    " ON group_collaborators.collaborator_id = collaborators.id" +
                    " WHERE group_collaborators.group_id = '" + Param.group_id + "'" +
                    " AND collaborators.code LIKE '%load_muc%'"
                ));

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);
                total = ArrayCount(groupList);

                agent.total = total;
                agent.message = "Обработка данных...";
                ws = sendMessageToWebsocket(ws, agent);
                prevDate = new Date();

                for (group in groupList) {
                    certificateList = "for $elem in certificates where $elem/type_id=" + certificateTypeId + " and $elem/person_id=" + group.col_id + " return $elem";
                    certificate = ArrayOptFirstElem(XQuery(certificateList));

                    uniqueEducationMethodNames = getEducationMethodNames(group.col_id, edu_meths_str);

                    if (certificate == undefined) {
                        if (uniqueEducationMethodNames != "") {
                            docCertificate = tools.create_certificate_to_person(group.col_id, certificateTypeId);
                            docCertificate.TopElem.serial = "РК";
                            docCertificate.TopElem.delivery_date = Date();
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                            docCertificate.Save();

                            saved++;
                        }
                    } else {
                        if (uniqueEducationMethodNames != "") {
                            docCertificate = tools.open_doc(certificate.id);
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                            docCertificate.Save();

                            saved++;
                        }
                    }

                    processed++;

                    if (processed % 10 == 0) {
                        agent.processed = processed;
                        agent.saved = saved;
                        if (ws != null) {
                            ws = sendMessageToWebsocket(ws, agent);
                        }
                    }
                    if (processed % 1000 == 0) {
                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                        );
                    }
                }
                break;
        }

        addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            total + " total, ",
            processed + " processed, ",
            saved + " saved.",
            null
        );

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Сервер | Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    } catch(e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        saveMonitorAgents(agent, startDate);
    }

    try {
        ws.Send("close");
    } catch (e) {}
}