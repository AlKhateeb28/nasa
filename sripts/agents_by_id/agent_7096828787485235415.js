// 7096829579191802560
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function find_e_m_names (_col_id) {
    sql_str = "sql: " +
        " SELECT education_methods.name AS e_m_name " +
        " FROM event_results " +
        "   INNER JOIN events ON events.id = event_results.event_id " +
        "   INNER JOIN education_methods ON education_methods.id = events.education_method_id " +
        " WHERE events.type_id = 'education_method' " +
        "   AND event_results.person_id = " + _col_id +
        "   AND event_results.is_assist = 1 " +
        " AND events.status_id = 'close'";

    col_event_results_arr = ArraySelectAll(XQuery(sql_str));
    unique_e_m_names_arr = ArraySelectDistinct(col_event_results_arr, "This.e_m_name");

    return unique_e_m_names_str = ArrayMerge(unique_e_m_names_arr, "This.e_m_name", ", ");
}

if(LdsIsClient) {
    var agentId = 7096829579191802560;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "aa_agent_7096829579191802560";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        var certificate_type_id = 7171733281797140705;
        var org_id = Param.org_id;
        var form_dog_s = Param.form_dog_s;
        var group_id = Param.group_id;

        switch (Param.work_type) {
            case 'org':
                my_id = OBJECT_ID == null ? org_id : OBJECT_ID;

                org_cols_arr = ArraySelectAll(XQuery("for $elem in collaborators where $elem/org_id='" + my_id + "' and contains($elem/code, 'load_muc') return $elem"));

                agent.total = ArrayCount(org_cols_arr);
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                for (org_col in org_cols_arr) {
                    xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + org_col.id + " return $elem";

                    found_col_certificate = ArrayOptFirstElem(XQuery(xq_str));

                    if (found_col_certificate == undefined) {
                        unique_e_m_names_str = find_e_m_names(org_col.id);

                        if ( unique_e_m_names_str != "" ) {
                            newDocCertificate = tools.create_certificate_to_person(org_col.id, certificate_type_id);

                            docCertificate = tools.open_doc(newDocCertificate.DocID);

                            docCertificate.TopElem.serial = "ШК";
                            docCertificate.TopElem.delivery_date = Date();
                            docCertificate.TopElem.custom_elems.ObtainChildByKey( "form_dogovor_sootvet" ).value = form_dog_s;
                            docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str;

                            docCertificate.Save();

                            saved++;
                        }
                    } else {
                        unique_e_m_names_str = find_e_m_names(org_col.id);
                        if (unique_e_m_names_str != "") {
                            docCertificate = tools.open_doc(found_col_certificate.id);
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("form_dogovor_sootvet").value = form_dog_s;
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = unique_e_m_names_str;

                            docCertificate.Save();

                            saved++;
                        }
                    }

                    processed++;

                    agent.processed = processed;
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

                break;
            case 'group':
                my_id = OBJECT_ID == null ? group_id : OBJECT_ID;
                group_cols_arr = ArraySelectAll( XQuery( "sql: " +
                    " SELECT group_collaborators.collaborator_id AS col_id " +
                    " FROM group_collaborators " +
                    "   LEFT JOIN collaborators ON group_collaborators.collaborator_id = collaborators.id " +
                    " WHERE group_collaborators.group_id = '" + my_id + "'" +
                    "   AND collaborators.code LIKE '%load_muc%'"));

                agent.total = ArrayCount(group_cols_arr);
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                for (group_col in group_cols_arr) {
                    xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + group_col.col_id + " return $elem";

                    found_col_certificate = ArrayOptFirstElem(XQuery(xq_str));

                    if (found_col_certificate == undefined) {
                        unique_e_m_names_str = find_e_m_names(group_col.col_id);

                        if (unique_e_m_names_str != "") {
                            certificateDoc = tools.create_certificate_to_person(group_col.col_id, certificate_type_id);

                            docCertificate = tools.open_doc(certificateDoc.DocID);

                            docCertificate.TopElem.serial = "К";
                            docCertificate.TopElem.delivery_date = Date();
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("form_dogovor_sootvet").value = form_dog_s;
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = unique_e_m_names_str;

                            docCertificate.Save();

                            saved++;
                        }
                    } else {
                        unique_e_m_names_str = find_e_m_names(group_col.col_id);
                        if ( unique_e_m_names_str != "" ) {
                            docCertificate = tools.open_doc(found_col_certificate.id);
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("form_dogovor_sootvet").value = form_dog_s;
                            docCertificate.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = unique_e_m_names_str;

                            docCertificate.Save();

                            saved++;
                        }
                    }

                    processed++;

                    agent.processed = processed;
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

                break;
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
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
            saved + " saved ",
            null
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

    try {
        ws.Send("close");
    } catch (e) {}
}
