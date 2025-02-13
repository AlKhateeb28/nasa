// 7124454575502753650
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7124454575502753650;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7124454575502753650";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.id, " +
        "       cs.fullname, " +
        "       os.code, " +
        "       os.name AS org_name, " +
        "       rs.name AS region_name" +
        " FROM [WTDB].[dbo].collaborators AS cs " +
        "    INNER JOIN [WTDB].[dbo].collaborator AS c ON cs.id = c.id " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        " INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        " WHERE CAST(c.data.value('(collaborator/doc_info/creation/date)[1]', 'datetime') AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) " +
        "    AND os.code IN ('5902998570', '1654029730', '1328014373', '2312269410', '7203236163', '5249141792', '3444067813', '6234174170', '0274144558', '2128018510', " +
        "                   '4027135732', '1841000829', '4205374558', '7453293679', '2466124870', '3443140595', '3123061930', '6670445849', '7107116177', '1001008131', " +
        "                   '7017996632', '2460030985', '7606078449', '3906905075', '6165216877', '6452133430', '3664077863', '2224142728', '6315990105', '5433158910', " +
        "                   '4826138874', '8904998595', '3702199512', '4705070815', '5837070066', '8601037105', '6670175818', '6829149606', '3328023237', '2623804187', " +
        "                   '3123455885', '4705074785', '2130183609', '5321200265', '4345482426', '5609080058', '9102023116', '3250518930', '3525169877', '2543970855', " +
        "                   '6501287362', '4632268754', '5751061831', '5504223936', '6234189810', '3808198710', '3664248533', '2312295628', '5024194890', '2901294864', " +
        "                   '6950214724', '3443144991', '7712108769', '7018006006', '7328099890', '6732042360', '4100038541', '5190087045', '2721251195', '4345511596', " +
        "                   '1435360755', '1215235607', '3257080300', '1215230038', '2464154029', '6316274640', '8901023569', '5609194640', '5507300480', '4400006300') "));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    notificationMessage = "<p>За " + StrDate(DateOffset(Date(), -86400), false) + " на платформе производительность.рф зарегистрировано " + total + " новы(й)х пользователей от РЦК.</p>";

    if(total > 0) {
        notificationMessage += "<div style='font-size: x-small'>";
        notificationMessage += "<table border='1' style='width: 100%'>";
        notificationMessage += "<tr>";
        notificationMessage += "<th>ID</th>";
        notificationMessage += "<th>ФИО</th>";
        notificationMessage += "<th>ИНН</th>";
        notificationMessage += "<th>Организация</th>";
        notificationMessage += "<th>Регион</th>";
        notificationMessage += "</tr>";

        for (data in dataList) {
            notificationMessage += "<tr>";
            notificationMessage += "<td>" + data.id + "</td>";
            notificationMessage += "<td>" + data.fullname + "</td>";
            notificationMessage += "<td>" + data.code + "</td>";
            notificationMessage += "<td>" + data.org_name + "</td>";
            notificationMessage += "<td>" + data.region_name + "</td>";

            processed++;

            agent.processed = processed;
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

        notificationMessage += "</table>";
        notificationMessage += "</div>";
    }

    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Отправка уведомлений...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    groupNotExistMessage = "";

    groupDoc = tools.open_doc(7124688456013271111);

    if(groupDoc != undefined) {
        groupDocTE = groupDoc.TopElem;

        for(manager in groupDocTE.func_managers) {
            tools.create_notification("new_person_rck", OptInt(manager.person_id), notificationMessage);
        }
    } else {
        groupNotExistMessage = " . Группа 7124688456013271111 для рассылки не найдена.";
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID " + 7124688456013271111 + " is not exist!");
    }

    //

    agent.state = 1;
    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Закончено" + groupNotExistMessage;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
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