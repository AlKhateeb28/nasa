// 7437386579509580998
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function updateSingleFlag(flag) {
    agent.message = "Получение " + flag + " данных ...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        " SELECT cs.id AS cs_id, " +
        "       os.id AS org_id, " +
        "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS cs_flag, " +
        "       IIF(o.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''" + flag + "'']/value)[1]', 'bit') AS INT)) AS org_flag " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "           INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "           INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "           INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        " ) " +
        " SELECT TOP 1000 * " +
        " FROM _view " +
        " WHERE cs_flag <> org_flag "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка " + flag + " данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        collaboratorDoc = tools.open_doc(data.cs_id);

        if(collaboratorDoc != undefined) {
            collaboratorDoc.TopElem.custom_elems.ObtainChildByKey(flag).value = data.org_flag;

            collaboratorDoc.Save();

            saved++;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + data.cs_id + " is not exist!");

            skipped++;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

function upWithNoRightFlag() {
    agent.message = "Получение кастомных флагов для поднятия With_no_right флага ...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT cs.id AS cs_id, " +
        "           os.id AS org_id, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''With_no_right''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS INT)) AS with_no_right, " +
        "           o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') AS format_part, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_ock''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS INT)) AS is_ock, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc " +
        "    FROM [WTDB].[dbo].collaborators cs " +
        "             INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "             INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "             INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "    WHERE cs.code NOT LIKE '%_muc_%' " +
        " ) " +
        " SELECT TOP 1000 org_id " +
        " FROM _view " +
        " WHERE format_part IS NULL " +
        "    AND is_rck = 0 " +
        "    AND is_ock = 0 " +
        "    AND is_roiv = 0 " +
        "    AND is_partner = 0 " +
        "    AND is_fcc = 0 " +
        "    AND with_no_right = 0"));

    total += ArrayCount(dataList);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] TOTAL: " + total);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Поднять With_no_right флаг...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    currentOrgId = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] --- UP");

    for (data in dataList) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Cur.Org.ID: " + currentOrgId + "Data.ID: " + data.org_id);

        if(currentOrgId != OptInt(data.org_id)) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] TRUE");

            orgDoc = tools.open_doc(data.org_id);

            if (orgDoc != undefined) {
                orgDoc.TopElem.custom_elems.ObtainChildByKey("With_no_right").value = "true";

                orgDoc.Save();

                saved++;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] UP Org.ID: " + data.org_id);
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + data.org_id + " is not exist!");

                skipped;
            }
        }

        currentOrgId = OptInt(data.org_id);

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}

function clearSpecialFlags() {
    agent.message = "Получение кастомных флагов для очистки ...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS ( " +
        "    SELECT cs.id AS cs_id, " +
        "           os.id AS org_id, " +
        "           o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') AS format_part, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_project_ended''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS INT)) AS is_project_ended, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_ock''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS INT)) AS is_ock, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv, " +
        "           IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner " +
        "    FROM [WTDB].[dbo].collaborators cs " +
        "             INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "             INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "             INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "    WHERE cs.code NOT LIKE '%_muc_%' " +
        " ) " +
        " SELECT TOP 1000 org_id " +
        " FROM _view " +
        " WHERE is_project_ended = 1 " +
        "       AND ((format_part IS NOT NULL " +
        "       AND format_part != '') " +
        "       OR is_rck > 0 " +
        "       OR is_ock > 0 " +
        "       OR is_roiv > 0 " +
        "       OR is_partner > 0) " +
        " GROUP BY org_id "));

    total += ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Очистить специальные флаги ...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (data in dataList) {
        orgDoc = tools.open_doc(data.org_id);

        if (orgDoc != undefined) {
            orgDoc.TopElem.custom_elems.ObtainChildByKey("format_part").value = "";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_rck").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_ock").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_roiv").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("is_partner").value = "false";
            orgDoc.TopElem.custom_elems.ObtainChildByKey("in_program").value = "false";

            orgDoc.Save();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] CLEAR Org.ID: " + data.org_id);

            saved++;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + data.org_id + " is not exist!");

            skipped;
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        if (processed % 10 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    return ArrayCount(dataList);
}


var agentId = 7437386579509580998;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7437386579509580998";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    count = updateSingleFlag("in_program");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed in_program: " + count);

    count = updateSingleFlag("is_fcc");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_fcc: " + count);

    count = updateSingleFlag("is_rck");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_rck: " + count);

    count = updateSingleFlag("is_ock");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_ock: " + count);

    count = updateSingleFlag("is_roiv");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_roiv: " + count);

    count = updateSingleFlag("is_partner");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_partner: " + count);

    count = updateSingleFlag("is_a_commerce_client");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_a_commerce_client: " + count);

    count = updateSingleFlag("is_project_ended");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed is_project_ended: " + count);

    count = updateSingleFlag("With_no_right");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed With_no_right: " + count);

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
