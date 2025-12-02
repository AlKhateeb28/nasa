// 7379923484682240522
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7379923484682240522;
var userId = curUserID;
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = Date();
var loggerName = "agent_7379923484682240522";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var groupId = 7379921733633142260;

if (LdsIsServer ) {
    try {
        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);

        collaboratorList = ArrayDirect(XQuery("sql: " +
            "SELECT colls.id," +
            "   coll.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS lastname," +
            "   coll.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS firstname," +
            "   org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part," +
            "   org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') as is_rck," +
            "   org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') as is_roiv," +
            "   org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') as is_partner" +
            " FROM [WTDB].[dbo].collaborators AS colls" +
            "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id AND coll.data.value('(collaborator/access/web_banned)[1]', 'varchar(max)') != 1" +
            "   INNER JOIN [WTDB].[dbo].orgs AS orgs ON orgs.id = colls.org_id" +
            "   INNER JOIN [WTDB].[dbo].org AS org ON org.id = orgs.id" +
            " WHERE colls.login NOT LIKE '%_muc_%'"));

        collaboratorList1 = ArrayDirect(XQuery("sql: " +
            " SELECT colls.id" +
            " FROM [WTDB].[dbo].collaborators AS colls" +
            "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id" +
            " WHERE UPPER(coll.data.value('(collaborator/firstname)[1]', 'varchar(max)')) LIKE '%ТЕСТ%'" +
            "   OR UPPER(coll.data.value('(collaborator/lastname)[1]', 'varchar(max)')) LIKE '%ТЕСТ%'"));

        collaboratorList2 = ArrayDirect(XQuery("sql: " +
            " SELECT colls.id" +
            " FROM [WTDB].[dbo].collaborators AS colls" +
            "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id" +
            " WHERE UPPER(coll.data.value('(collaborator/firstname)[1]', 'varchar(max)')) LIKE '%TEST%'" +
            "   OR UPPER(coll.data.value('(collaborator/lastname)[1]', 'varchar(max)')) LIKE '%TEST%'"));

        processed = 0;
        notFound = 0;
        saved = 0;
        total = ArrayCount(collaboratorList) + ArrayCount(collaboratorList1) + ArrayCount(collaboratorList2);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Will processed: " + total);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.refreshChart = 1;
        agent.message = "Обработка данных...";
        ws = sendMessageToWebsocket(ws, agent);

        prevDate = new Date();

        group = tools.open_doc(groupId);

        for (collaborator in collaboratorList) {
            if(collaborator.format_part == null || collaborator.format_part == "false" || collaborator.is_rck == "true" || collaborator.is_roiv == "true" || collaborator.is_partner == "true") {
                isAddToGroup = false;

                if (StrCharCount(Trim(collaborator.firstname)) <= 1 || StrCharCount(Trim(collaborator.lastname)) <= 1) {
                    isAddToGroup = true;
                } else if (OptReal(collaborator.firstname) != undefined || OptReal(collaborator.lastname) != undefined) {
                    isAddToGroup = true;
                } else if (StrContains(collaborator.firstname, "@") || StrContains(collaborator.firstname, ".") || StrContains(collaborator.firstname, "_")
                    || StrContains(collaborator.firstname, "=") || StrContains(collaborator.firstname, "*") || StrContains(collaborator.firstname, "+")
                    || StrContains(collaborator.firstname, "\\") || StrContains(collaborator.firstname, "/") || StrContains(collaborator.firstname, "|")
                    || StrContains(collaborator.firstname, "{") || StrContains(collaborator.firstname, "}") || StrContains(collaborator.firstname, "[")
                    || StrContains(collaborator.firstname, "]") || StrContains(collaborator.firstname, ":") || StrContains(collaborator.firstname, "'")
                    || StrContains(collaborator.firstname, "<") || StrContains(collaborator.firstname, ">") || StrContains(collaborator.firstname, ",")
                    || StrContains(collaborator.firstname, "!") || StrContains(collaborator.firstname, "#") || StrContains(collaborator.firstname, "%")
                    || StrContains(collaborator.firstname, "^") || StrContains(collaborator.firstname, "&") || StrContains(collaborator.firstname, "?")
                    || StrContains(collaborator.firstname, "*") || StrContains(collaborator.firstname, "(") || StrContains(collaborator.firstname, ")")) {

                    isAddToGroup = true;
                } else if (StrContains(collaborator.lastname, "@") || StrContains(collaborator.lastname, ".") || StrContains(collaborator.lastname, "_")
                    || StrContains(collaborator.lastname, "*") || StrContains(collaborator.lastname, "+")
                    || StrContains(collaborator.lastname, "\\") || StrContains(collaborator.lastname, "/") || StrContains(collaborator.lastname, "|")
                    || StrContains(collaborator.lastname, "{") || StrContains(collaborator.lastname, "}") || StrContains(collaborator.lastname, "[")
                    || StrContains(collaborator.lastname, "]") || StrContains(collaborator.lastname, ":") || StrContains(collaborator.lastname, "'")
                    || StrContains(collaborator.lastname, "<") || StrContains(collaborator.lastname, ">") || StrContains(collaborator.lastname, ",")
                    || StrContains(collaborator.lastname, "!") || StrContains(collaborator.lastname, "#") || StrContains(collaborator.lastname, "%")
                    || StrContains(collaborator.lastname, "^") || StrContains(collaborator.lastname, "&") || StrContains(collaborator.lastname, "?")
                    || StrContains(collaborator.lastname, "*") || StrContains(collaborator.lastname, "(") || StrContains(collaborator.lastname, ")")
                    || StrContains(collaborator.lastname, "=")) {
                    isAddToGroup = true;
                } else if (StrContains(collaborator.firstname, "q", true) || StrContains(collaborator.firstname, "w", true) || StrContains(collaborator.firstname, "e", true)
                    || StrContains(collaborator.firstname, "r", true) || StrContains(collaborator.firstname, "t", true) || StrContains(collaborator.firstname, "y", true)
                    || StrContains(collaborator.firstname, "u", true) || StrContains(collaborator.firstname, "i", true) || StrContains(collaborator.firstname, "o", true)
                    || StrContains(collaborator.firstname, "p", true) || StrContains(collaborator.firstname, "a", true) || StrContains(collaborator.firstname, "s", true)
                    || StrContains(collaborator.firstname, "d", true) || StrContains(collaborator.firstname, "f", true) || StrContains(collaborator.firstname, "g", true)
                    || StrContains(collaborator.firstname, "h", true) || StrContains(collaborator.firstname, "j", true) || StrContains(collaborator.firstname, "k", true)
                    || StrContains(collaborator.firstname, "l", true) || StrContains(collaborator.firstname, "z", true) || StrContains(collaborator.firstname, "x", true)
                    || StrContains(collaborator.firstname, "c", true) || StrContains(collaborator.firstname, "v", true) || StrContains(collaborator.firstname, "b", true)
                    || StrContains(collaborator.firstname, "n", true) || StrContains(collaborator.firstname, "m", true)) {

                    isAddToGroup = true;
                } else if (StrContains(collaborator.lastname, "q", true) || StrContains(collaborator.lastname, "w", true) || StrContains(collaborator.lastname, "e", true)
                    || StrContains(collaborator.lastname, "r", true) || StrContains(collaborator.lastname, "t", true) || StrContains(collaborator.lastname, "y", true)
                    || StrContains(collaborator.lastname, "u", true) || StrContains(collaborator.lastname, "i", true) || StrContains(collaborator.lastname, "o", true)
                    || StrContains(collaborator.lastname, "p", true) || StrContains(collaborator.lastname, "a", true) || StrContains(collaborator.lastname, "s", true)
                    || StrContains(collaborator.lastname, "d", true) || StrContains(collaborator.lastname, "f", true) || StrContains(collaborator.lastname, "g", true)
                    || StrContains(collaborator.lastname, "h", true) || StrContains(collaborator.lastname, "j", true) || StrContains(collaborator.lastname, "k", true)
                    || StrContains(collaborator.lastname, "l", true) || StrContains(collaborator.lastname, "z", true) || StrContains(collaborator.lastname, "x", true)
                    || StrContains(collaborator.lastname, "c", true) || StrContains(collaborator.lastname, "v", true) || StrContains(collaborator.lastname, "b", true)
                    || StrContains(collaborator.lastname, "n", true) || StrContains(collaborator.lastname, "m", true)) {
                    isAddToGroup = true;
                }

                if (isAddToGroup) {
                    group.TopElem.collaborators.ObtainChildByKey(collaborator.id);

                    saved++;
                    agent.saved = saved;

                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] Collaborator with ID " + collaborator.id + " is added to suspicious group."
                    );
                }
            }

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                ws = sendMessageToWebsocket(ws, agent);
            }
            if (processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed" + " remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }
        }

        for (collaborator in collaboratorList1) {
            group.TopElem.collaborators.ObtainChildByKey(collaborator.id);

            processed++;
            saved++;
        }

        agent.processed = processed;
        agent.saved = saved;
        ws = sendMessageToWebsocket(ws, agent);

        for (collaborator in collaboratorList2) {
            group.TopElem.collaborators.ObtainChildByKey(collaborator.id);

            processed++;
            saved++;
        }

        agent.processed = processed;
        agent.saved = saved;
        ws = sendMessageToWebsocket(ws, agent);

        group.Save();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        agent.state = 1;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        saveMonitorAgents(agent, startDate);

    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        saveMonitorAgents(agent, startDate);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}