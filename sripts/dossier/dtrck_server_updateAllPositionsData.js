// 7369105928112447378
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getRccDossiers() {
    try {
        sqlQuery =
            "SELECT *" +
            " FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs]";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

var agentId = 7369105928112447378;
var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7369105928112447378";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var skipped = 0;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    resultArray = getRccDossiers();
    total = ArrayCount(resultArray);

    if(total > 0) {
        AgentUtils.addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] " + total + " total, Expected time: " + AgentUtils.getDurationMessage( total * msPerRecord )
        );
    }

    agent.refreshChart = 1;
    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (result in resultArray) {
        dossier = tools.open_doc(result.id);

        if(dossier == undefined) {
            AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Broken dossier. ID: " + result.id);
            skipped++;
            continue;
        }

        dossierTE = dossier.TopElem;

        if(OptInt(dossierTE.student_position) != undefined) {
            position = tools.open_doc(dossierTE.student_position);

            if(position == undefined) {
                AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Broken student_position. ID: " + result.id + " Position.ID: " + dossierTE.student_position);
                skipped++;
                continue;
            }

            dossierTE.student_position = position.TopElem.name;

            dossier.Save();
        } else {
            skipped++;
        }

        processed++;

        if(processed % 1000 == 0) {
            AgentUtils.addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed, " + skipped + " skipped, remaining time: " + AgentUtils.getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    AgentUtils.addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed, ",
        null,
        skipped + " skipped"
    );

    AgentUtils.addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );

    AgentUtils.addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Finished"
    );

} catch (e) {
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    alert("ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}