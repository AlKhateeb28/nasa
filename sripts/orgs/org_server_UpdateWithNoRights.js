// 7395513524439841797
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function updateNoRightsFlag(id, flag) {
    collaboratorList = ArrayDirect(XQuery("sql:" +
        " SELECT c.id" +
        " FROM [WTDB].[dbo].collaborators c" +
        " WHERE c.org_id = " + id));

    for (collaborator in collaboratorList) {
        collaboratorDoc = tools.open_doc(collaborator.id);

        collaboratorDoc.TopElem.custom_elems.ObtainChildByKey('With_no_right').value = flag;

        //collaboratorDoc.Save();
    }
}

function updateCollaboratorFlag(id, organization) {
    //in_program
    //is_fcc
    //is_rck
    //is_roiv
    //is_partner
    //is_a_commerce_client
    if(organization.in_program == "true") {
        collaboratorList = ArrayDirect(XQuery("sql:" +
            " SELECT c.id" +
            " FROM [WTDB].[dbo].collaborators c" +
            " WHERE c.org_id = " + id));

        for (collaborator in collaboratorList) {
            collaboratorDoc = tools.open_doc(collaborator.id);
            collaboratorDocTE = collaboratorDoc.TopElem;

            if (!StrBegins(collaboratorDocTE.login, "rck_muc", true) && !StrBegins(collaboratorDocTE.login, "load_muc", true)) {
                if (collaboratorDocTE.custom_elems.ObtainChildByKey('in_program').value == "" || collaboratorDocTE.custom_elems.ObtainChildByKey('in_program').value == "false") {
                    collaboratorDocTE.custom_elems.ObtainChildByKey('in_program').value = "true";

                    collaboratorDoc.Save();

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Org.ID: " + id + " Col.ID: " + collaboratorDocTE.id + " FIO: " + collaboratorDocTE.fullname);

                    notFound++;
                }
            }
        }
    }
}

if (LdsIsServer ) {
    var agentId = "7395513524439841797";
    var userId = curUserID;
    var msPerRecord = 0.018;

    var startDate = Date();
    var prevDate;
    var loggerName = "aa_agent_7395513524439841797";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var notFound = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        organizationList = ArrayDirect(XQuery("sql:" +
            " SELECT os.id, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') in_program, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'varchar(max)') is_fcc, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'varchar(max)') is_rck, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'varchar(max)') is_roiv, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'varchar(max)') is_partner, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'varchar(max)') is_a_commerce_client, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''in_program1'']/value)[1]', 'varchar(max)') AS in_program1, " +
            "   o.data.value('(org/custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'varchar(max)') AS With_no_right " +
            " FROM [WTDB].[dbo].orgs os" +
            "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id"));

        total = ArrayCount(organizationList);

        agent.refreshChart = 1;
        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (organization in organizationList) {
            organizationDoc = tools.open_doc(OptInt(organization.id));

            if(organizationDoc != undefined) {
                if( (organization.is_fcc == "" || organization.is_fcc == "false") &&
                    (organization.in_program == "" || organization.in_program == "false") &&
                    (organization.in_program1 == "") &&
                    (organization.is_rck == "" || organization.is_rck == "false") &&
                    (organization.is_roiv == "" || organization.is_roiv == "false") &&
                    (organization.is_partner == "" || organization.is_partner == "false") &&
                    (organization.is_a_commerce_client == "" || organization.is_a_commerce_client == "false") ) {

                    if(organization.With_no_right == "false") {
                        // All property is not checked and "With_no_right" is NOT checked
                        flag = "true";

                        updateNoRightsFlag(organization.id, flag);

                        organizationDoc.TopElem.custom_elems.ObtainChildByKey('With_no_right').value = flag;
                        //organizationDoc.Save();

                        saved++;
                    }
                } else {
                    // All property is not checked, but "With_no_right" is checked
                    if(organization.With_no_right == "true") {
                        // Has checked property, but "With_no_right" is not checked
                        flag = "false";

                        updateNoRightsFlag(organization.id, flag);

                        organizationDoc.TopElem.custom_elems.ObtainChildByKey('With_no_right').value = flag;
                        //organizationDoc.Save();

                        saved++;
                    } else {
                        // Change custom collaborator SINGLE flag manually
                        //updateCollaboratorFlag(organization.id, organization);
                    }
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + organization.id + " not exist!");

                notFound++;
            }

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.saved = saved;
                agent.notFound = notFound;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if(processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
                );
            }
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.notFound = notFound;
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
            processed  + " processed",
            saved + " saved, ",
            notFound + " not found"
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
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}