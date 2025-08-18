// 7188446357598852262
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7188446357598852262;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7188446357598852262";
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

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, doss.student_id AS person_id " +
        " FROM [WTDB].[dbo].cc_dossier_rcc_employees doss " +
        " WHERE doss.student_id IS NOT NULL "));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        eventResultList = ArrayDirect(XQuery("sql: " +
            " SELECT ers.id, " +
            "       ems.code " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND UPPER(es.status_id) = 'CLOSE' AND YEAR(es.start_date) >= 2025 " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            " WHERE ers.person_id = " + data.person_id +
            "    AND ers.is_assist = 1 "));

        if(ArrayCount(eventResultList) > 0) {
            dossierDoc = tools.open_doc(OptInt(data.id));

            if(dossierDoc != undefined) {
                dossierDocTE = dossierDoc.TopElem;

                for (eventResult in eventResultList) {
                    if(StrContains(StrLowerCase(eventResult.code), "fck_rck_rp_m0")) {
                        dossierDocTE.rcc_rp_programs_m1s.ObtainChildByKey(eventResult.id);
                        dossierDocTE.rcc_rp_programs_m2s.ObtainChildByKey(eventResult.id);
                        dossierDocTE.rcc_rp_programs_m3s.ObtainChildByKey(eventResult.id);
                        dossierDocTE.rcc_rp_programs_m4s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_rp_m1")) {
                        dossierDocTE.rcc_rp_programs_m1s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_rp_m1")) {
                        dossierDocTE.rcc_rp_programs_m1s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_rp_m2")) {
                        dossierDocTE.rcc_rp_programs_m2s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_rp_m2")) {
                        dossierDocTE.rcc_rp_programs_m2s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_rp_m3")) {
                        dossierDocTE.rcc_rp_programs_m3s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_rp_m3")) {
                        dossierDocTE.rcc_rp_programs_m3s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_rp_m4")) {
                        dossierDocTE.rcc_rp_programs_m4s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_rp_m4")) {
                        dossierDocTE.rcc_rp_programs_m4s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_tren_m0")) {
                        dossierDocTE.rcc_tren_programss.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_tren_m1")) {
                        dossierDocTE.rcc_tren_programss.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_rck_tren_m2")) {
                        dossierDocTE.rcc_tren_programss.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_tren_m1")) {
                        dossierDocTE.rcc_tren_programss.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_com_rck_tren_m2")) {
                        dossierDocTE.rcc_tren_programss.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_ock_rp_am_m1")) {
                        if(dossierDocTE.is_ock_ss || dossierDocTE.is_ock_bno) {
                            dossierDocTE.ock_rp_programs_m1s.ObtainChildByKey(eventResult.id);
                        }
                        if(dossierDocTE.is_ock_ss_analyst || dossierDocTE.is_ock_bno_analyst) {
                            dossierDocTE.ock_am_programs_m1s.ObtainChildByKey(eventResult.id);
                        }
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_ock_rp_am_m2")) {
                        if(dossierDocTE.is_ock_ss || dossierDocTE.is_ock_bno) {
                            dossierDocTE.ock_rp_programs_m2s.ObtainChildByKey(eventResult.id);
                        }
                        if(dossierDocTE.is_ock_ss_analyst || dossierDocTE.is_ock_bno_analyst) {
                            dossierDocTE.ock_am_programs_m2s.ObtainChildByKey(eventResult.id);
                        }
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_ock_rp_am_m3")) {
                        if(dossierDocTE.is_ock_ss || dossierDocTE.is_ock_bno) {
                            dossierDocTE.ock_rp_programs_m3s.ObtainChildByKey(eventResult.id);
                        }
                        if(dossierDocTE.is_ock_ss_analyst || dossierDocTE.is_ock_bno_analyst) {
                            dossierDocTE.ock_am_programs_m3s.ObtainChildByKey(eventResult.id);
                        }
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_ock_am_m4")) {
                        dossierDocTE.ock_am_programs_m4s.ObtainChildByKey(eventResult.id);
                    } else if(StrContains(StrLowerCase(eventResult.code), "fck_ock_tr_m1")) {
                        dossierDocTE.ock_tren_programss.ObtainChildByKey(eventResult.id);
                    } else {
                        if(!StrContains(StrLowerCase(eventResult.code), "fck_rck") &&
                            !StrContains(StrLowerCase(eventResult.code), "fck_ock") &&
                            !StrContains(StrLowerCase(eventResult.code), "fck_com_rck")) {
                            dossierDocTE.other_eventss.ObtainChildByKey(eventResult.id);
                        }
                    }
                }

                dossierDoc.Save();

            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier OCK/RCK with ID " + data.id + " is not exist!");

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
