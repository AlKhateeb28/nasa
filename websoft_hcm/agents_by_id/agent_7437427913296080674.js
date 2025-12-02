// 7437427913296080674
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function processAttribute(inProgram, isFcc, isRck, isRoiv, isPartner, isCommerce, isProjectEnded, id) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] in_program: " + inProgram + " is_fcc: " + isFcc);


    XQuery("sql: " +
        /*" WITH _view AS ( " +
        "    SELECT id, data " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        "   SET data.modify('insert " +
        "                            <custom_elems> " +
        "                            </custom_elems> " +
        "                            as last into " +
        "                            (/collaborator)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id AND c.data.exist('//custom_elems') = 0; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id, data " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        "   SET data.modify('delete (//custom_elems/custom_elem[name=''in_program'' or name=''is_fcc'' or name=''is_rck'' or name=''is_roiv'' or name=''is_partner'' or name=''is_a_commerce_client'' or name=''is_project_ended''])') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +*/
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator" +
        "   SET data.modify('insert <custom_elem><name>in_program</name><value>" + inProgram + "</value></custom_elem> as last into (//custom_elems)[1]') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " /*+
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        "   SET data.modify('insert <custom_elem><name>is_fcc</name><value>" + isFcc + "</value></custom_elem> as last into (//custom_elems)[1]') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        "   SET data.modify('insert " +
        "                            <custom_elem> " +
        "                                <name>is_rck</name> " +
        "                                <value>" + isRck + "</value> " +
        "                            </custom_elem> " +
        "                            as last into " +
        "                            (//custom_elems)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        "   SET data.modify('insert " +
        "                            <custom_elem> " +
        "                                <name>is_roiv</name> " +
        "                                <value>" + isRoiv + "</value> " +
        "                            </custom_elem> " +
        "                            as last into " +
        "                            (//custom_elems)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        " SET data.modify('insert " +
        "                            <custom_elem> " +
        "                                <name>is_partner</name> " +
        "                                <value>" + isPartner + "</value> " +
        "                            </custom_elem> " +
        "                            as last into " +
        "                            (//custom_elems)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        " SET data.modify('insert " +
        "                            <custom_elem> " +
        "                                <name>is_a_commerce_client</name> " +
        "                                <value>" + isCommerce + "</value> " +
        "                            </custom_elem> " +
        "                            as last into " +
        "                            (//custom_elems)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT id " +
        "    FROM collaborator " +
        "    WHERE id = " + id +
        " ) " +
        " UPDATE collaborator " +
        " SET data.modify('insert " +
        "                            <custom_elem> " +
        "                                <name>is_project_ended</name> " +
        "                                <value>" + isProjectEnded + "</value> " +
        "                            </custom_elem> " +
        "                            as last into " +
        "                            (//custom_elems)[1] " +
        "                ') " +
        " FROM collaborator c" +
        "   INNER JOIN _view _v ON c.id = _v.id; "*/);
}

var agentId = 7437427913296080674;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7437427913296080674";
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
    id = "6870736682355282053";

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.id AS cs_id, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''format_part'']/value)[1]') = 0, 0, 1) AS format_part, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS INT)) AS in_program, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_a_commerce_client''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS INT)) AS is_commerce, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_project_ended''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS INT)) AS is_project_ended " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        //" WHERE cs.modification_date > DATEADD(MINUTE, -30, GETDATE()) " +
        " WHERE cs.id = " + id));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        processAttribute(data.format_part, data.is_fcc, data.is_rck, data.is_roiv, data.is_partner, data.is_commerce, data.is_project_ended, id);

        processed++;
        saved++;

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
        saved + " saved",
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

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
