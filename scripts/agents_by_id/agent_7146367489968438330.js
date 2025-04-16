// 7146367489968438330
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function modifyOrgsList(orgId, currentWaveId, otherWaveID, wave) {
    for(data in orgsList) {
        if(orgId == data.orgId) {
            if(currentWaveId == otherWaveID) {
                data.currentWaveCount++;
            } else {
                data.otherWaveCount++;
            }

            data.wave += ", " + wave;

            return;
        }
    }

    element = {};
    element.orgId = orgId;
    element.wave = wave;
    if(currentWaveId == otherWaveID) {
        element.currentWaveCount = 1;
        element.otherWaveCount = 0;
    } else {
        element.currentWaveCount = 0;
        element.otherWaveCount = 1;
    }

    orgsList.push(element);
}

function createNotificationMessage(currentWave) {
    isShowNotification = false;

    header = new Binary();

    header.AppendStr("<div>");
    header.AppendStr("<p>Текущая волна: <b>");
    header.AppendStr(currentWave);
    header.AppendStr("</b></p>");
    header.AppendStr("<table border='1' style='width: 100%'>");
    header.AppendStr("<tr>");
    header.AppendStr("<th>ИНН</th>");
    header.AppendStr("<th>Название организации</th>");
    header.AppendStr("<th>Фактический регион</th>");
    header.AppendStr("<th>Число сотрудников в этой волне</th>");
    header.AppendStr("<th>Число сотрудников в остальных волнах</th>");
    header.AppendStr("<th>Волна</th>");
    header.AppendStr("</tr>");

    footer = new Binary();

    footer.AppendStr("</table>");
    footer.AppendStr("</div>");

    content = new Binary();

    for(data in orgsList) {
        if(data.currentWaveCount + data.otherWaveCount >= 4) {
            isShowNotification = true;

            organizations = ArrayDirect(XQuery("sql: " +
                " SELECT os.code, " +
                "       os.name AS org_name, " +
                "       rs.name AS region_name " +
                " FROM [WTDB].[dbo].orgs AS os " +
                "    INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id " +
                "    INNER JOIN [WTDB].[dbo].regions AS rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
                " WHERE os.id = " + data.orgId));

            for(organization in organizations) {
                content.AppendStr("<tr>");
                content.AppendStr("<td style='text-align: center'>");
                content.AppendStr(organization.code);
                content.AppendStr("</td>");
                content.AppendStr("<td>");
                content.AppendStr(organization.org_name);
                content.AppendStr("</td>");
                content.AppendStr("<td>");
                content.AppendStr(organization.region_name);
                content.AppendStr("</td>");
                content.AppendStr("<td style='text-align: center'>");
                content.AppendStr(data.currentWaveCount);
                content.AppendStr("</td>");
                content.AppendStr("<td style='text-align: center'>");
                content.AppendStr(data.otherWaveCount);
                content.AppendStr("</td>");
                content.AppendStr("<td>");
                content.AppendStr(data.wave);
                content.AppendStr("</td>")
                content.AppendStr("</tr>");
            }
        }
    }

    if(isShowNotification) {
        result.AppendStr(header.GetStr());
        result.AppendStr(content.GetStr());
        result.AppendStr(footer.GetStr());
    }
}

var agentId = 7146367489968438330;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7146367489968438330";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var processed = 0;

var orgsList = [];

var result = new Binary();

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    currentWave = ArrayDirect(XQuery("sql: " +
        " SELECT rs.id, " +
        "       rs.name " +
        " FROM [WTDB].[dbo].roles AS rs " +
        " WHERE rs.parent_role_id = 6943895863721274797 " +
        "       AND rs.name LIKE '%" + StrDate(Date(), false, false) + "%' "));

    if(ArrayCount(currentWave) > 0) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT rs.id, " +
            "       rs.name" +
            " FROM [WTDB].[dbo].roles AS rs " +
            " WHERE rs.parent_role_id = 6943895863721274797 " +
            "    AND YEAR(rs.modification_date) >= 2025 " +
            "    AND YEAR(rs.modification_date) < 2031 "));

        for (data in dataList) {
            waveList = ArrayDirect(XQuery("sql: " +
                " SELECT gs.id, gs.person_num " +
                " FROM [WTDB].[dbo].groups AS gs " +
                "    INNER JOIN [WTDB].[dbo].[group] AS g ON gs.id = g.id " +
                " WHERE g.data.value('(//role_id)[1]', 'bigint') = " + data.id +
                "    AND gs.person_num >= 4 "));

            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.message = "Обработка данных...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            for (wave in waveList) {
                groupDoc = tools.open_doc(wave.id);

                if (groupDoc != undefined) {
                    groupDocTE = groupDoc.TopElem;

                    for (collaborator in groupDocTE.collaborators) {
                        collaboratorDoc = tools.open_doc(collaborator.collaborator_id);

                        if (collaboratorDoc != undefined) {
                            modifyOrgsList(collaboratorDoc.TopElem.org_id, currentWave[0].id, data.id, data.name);
                        }
                    }
                }

                processed++;
            }

            agent.processed = processed;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }

        createNotificationMessage(currentWave[0].name);

        if (result.Size > 0) {
            groupDoc = tools.open_doc(6946146383492809494);

            if (groupDoc != undefined) {
                groupDocTE = groupDoc.TopElem;

                for (collaborator in groupDocTE.collaborators) {
                    tools.create_notification("notification_wave_ibp", OptInt(collaborator.collaborator_id), result.GetStr());
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID " + 6946146383492809494 + " is not exist!");
            }
        }
    }

    agent.state = 1;
    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        processed + " total, ",
        processed + " processed",
        null,
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
