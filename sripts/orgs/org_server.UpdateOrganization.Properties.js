// AGENT 7369216028941956636
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7369216028941956636;
var userId = 7351734047845980789;

var startDate = Date();
var loggerName = "aa_agent_update.organizations.properties";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

if (LdsIsServer ) {
    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        orgsList = ArrayDirect(XQuery("sql: SELECT orgs.id FROM [WTDB].[dbo].orgs"));

        total = ArrayCount(orgsList);

        agent.message = "Обработка данных ...";
        agent.total = total;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        processed = 0;
        skipped = 0;
        saved = 0;
        notFound = 0;

        for (org in orgsList) {
            organization = tools.open_doc(org.id);

            if (organization == undefined) {
                notFound++;
            } else {
                if (organization.TopElem.custom_elems.ObtainChildByKey("is_project_ended").value == "true") {
                    organization.TopElem.custom_elems.ObtainChildByKey("is_project_ended").value = "false";

                    organization.Save();

                    saved++;
                } else {
                    skipped++;
                }
            }

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                agent.notFound = notFound;
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
        }

        agent.state = 1;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(startDate);
        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        agent.notFound = notFound;
        refreshMsPerRow(agent, startDate, processed);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Всего " + total + ", обработано " + processed + ", пропущено " + skipped + ", сохранено " + saved + ", не найдено " + notFound + " записей");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        alert("Всего " + total + ", обработано " + processed + ", пропущено " + skipped + ", сохранено " + saved + ", не найдено " + notFound + " записей");
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        alert("ERROR: " + e + "\nRow: " + currentRow);
    }

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok' );
}

try {
    ws.Send("close");
} catch (e) {}