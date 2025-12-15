// 7222773095990292161
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getData(eventId, result) {
    return ArrayDirect(XQuery("sql: " +
        " SELECT ers.id, " +
        "       es.id AS event_id, " +
        "       ers.person_id AS person_id, " +
        "       os.name AS org_name, " +
        "       es.name AS event_name, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]', 'varchar(max)') AS cert_date, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''is_rck_alone''])[1]/value[1]', 'varchar(max)') AS is_rck_alone " +
        " FROM [WTDB].[dbo].event_results ers " +
        "    INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        "            AND er.data.exist('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]') = 1 " +
        "            AND er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') IS NOT NULL " +
        "            AND er.data.value('(//custom_elems/custom_elem[name=''is_rck_alone''])[1]/value[1]', 'varchar(max)') != '' " +
        "    INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.id = " + eventId + " AND es.status_id = 'close' " +
        "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND ems.id IN (7124735507140964982, 7124747534142012406) " +
        "    INNER JOIN [WTDB].[dbo].event_result_types erts ON ers.event_result_type_id = erts.id AND erts.id IN (7124737289579322741, 7124737605533923555) " +
        " WHERE UPPER(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) = '" + result + "' "));
}

function getCertificateCount(personId, certificateTypeId) {
    certificationList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].certificates " +
        " WHERE person_id = " + personId +
        "    AND type_id = " + certificateTypeId));

    return ArrayCount(certificationList);
}

function createCertificate(personId, certificateTypeId, serial, orgName, deliveryDate, notiCode, eventId) {
    program = "Руководитель проекта";

    certificateDoc = tools.create_certificate_to_person(OptInt(personId), OptInt(certificateTypeId));

    certificateDoc.TopElem.serial = serial;
    certificateDoc.TopElem.delivery_date = Date(deliveryDate);
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("programm_name").value = program;
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = program;
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("org_name").value = orgName;
    certificateDoc.TopElem.event_id = eventId;

    certificateDoc.Save();

    if (OptInt(notiCode) == 13) {
        templateCode = "cert_tr_rck_rp_print_13";
    } else if(OptInt(notiCode) == 14) {
        templateCode = "cert_tr_rck_rp_print_14";
    }

    tools.create_notification(templateCode, OptInt(personId), "", OptInt(certificateDoc.DocID));

    return certificateDoc.DocID;
}

function addCertificateIdIntoEventResult(eventResultId, certificateId) {
    eventResultDoc = tools.open_doc(eventResultId);

    if(eventResultId != undefined) {
        eventResultDoc.TopElem.certificate_id = certificateId;

        eventResultDoc.Save();
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] EventResult with ID " + eventResultId + " is not exist!");
    }
}

if (!LdsIsServer) {
    var agentId = 7222773095990292161;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7222773095990292161";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;

    var cert = 0;
    var noCert = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        if (OBJECTS_ID_STR != '') {
            ids = OBJECTS_ID_STR.split(";");

            for(id in ids) {
                certList = getData(id, "СЕРТИФИЦИРОВАН");

                noCertList = getData(id, "НЕ СЕРТИФИЦИРОВАН");

                total = ArrayCount(certList) + ArrayCount(noCertList);

                agent.total = total;
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                for (data in certList) {
                    if (data.is_rck_alone == "РЦК самостоятельно") {
                        if (getCertificateCount(data.person_id, 7164453663916057169) == 0) {
                            // CREATE CERTIFICATE
                            certificateId = createCertificate(data.person_id, 7164453663916057169, "РП", data.org_name, data.cert_date, 14, data.event_id);

                            addCertificateIdIntoEventResult(data.id, certificateId);

                            cert++;
                            saved++;
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID already has a certificate with type 7164453663916057169!");

                            skipped++;
                        }
                    } else if (data.is_rck_alone == "ФЦК") {
                        if (getCertificateCount(data.person_id, 7164453267946338582) == 0) {
                            // CREATE CERTIFICATE
                            certificateId = createCertificate(data.person_id, 7164453267946338582, "РП", data.org_name, data.cert_date, 13, data.event_id);

                            addCertificateIdIntoEventResult(data.id, certificateId);

                            cert++;
                            saved++;
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID already has a certificate with type 7164453267946338582!");

                            skipped++;
                        }
                    }

                    processed++;

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

                for (data in noCertList) {
                    tools.create_notification("cert_tr_rck_cancel_rp", OptInt(data.person_id), "");

                    noCert++;
                    processed++;

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
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}

    alert("Сертифицировано: " + cert + "\nНе сертифицировано: " + noCert + "\nПропущено: " + skipped);
}