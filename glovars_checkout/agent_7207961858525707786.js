// 7207961858525707786
// GLOVARS_CHECKOUT - Агент проверки таблицы glovars
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function sendNotification() {
    tools.create_notification("helper_count_warning", 7351734047845980789);
    tools.create_notification("helper_count_warning", 6743923349751162819);
}

function checkoutHelperAgent() {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT id, run_count " +
        " FROM [WTDB].[dbo].cc_glovars " +
        " WHERE code = 'helper_1_hour' "));

    addLogMessage(loggerName, "[agent.id: " + agentId + "] 1");

    dataCount = ArrayCount(dataList)

    addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");

    if(dataCount == 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] 3");

        notiList = ArrayDirect(XQuery("sql: " +
            " SELECT id, value " +
            " FROM [WTDB].[dbo].cc_glovars " +
            " WHERE code = 'helper_noti_1_hour' "));

        addLogMessage(loggerName, "[agent.id: " + agentId + "] 4");

        if(OptInt(dataList[0].run_count) >= 6) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] 5");

            if(ArrayCount(notiList) == 0) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] 6");

                glovarDooc = tools.new_doc_by_name( 'cc_glovar', false );
                glovarDooc.BindToDb( DefaultDb );

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 7");

                glovarDocTE = glovarDooc.TopElem;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 8");

                glovarDocTE.code = "helper_noti_1_hour";

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 9");

                glovarDocTE.type = "datestring";

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 10");

                glovarDocTE.value = StrDate(Date(), false, false);

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 11");

                glovarDocTE.run_count = 1;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 12");

                glovarDooc.Save();

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 13");

                sendNotification();

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 14");
            } else {
                isAlreadySentToday = false;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 15");

                for(notification in notiList) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] 16");

                    if (notiList[0].value -= StrDate(Date(), false, false)) {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] 17");

                        isAlreadySentToday = true;

                        break;
                    }
                }

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 18");

                if(!isAlreadySentToday) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] 19");

                    sendNotification();
                }
            }
        } else {
            docId = OptInt(notiList[0].id);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] 20");

            glovarDoc = tools.open_doc(docId);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] 21");

            if(glovarDoc != undefined) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] 22");

                DeleteDoc(UrlFromDocID(docId));

                addLogMessage(loggerName, "[agent.id: " + agentId + "] 23");
            }
        }
    } else if(dataCount  > 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Agent code = 'helper_1_hour' is ran more that once");

        throw "Агент helper_1_hour запущен более одного раза!";
    }

    processed++;

    agent.processed = processed;
    agent.skipped = skipped;
    agent.saved = saved;
    refreshMsPerRow(agent, startDate, processed);
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
}

var agentId = 7207961858525707786;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7207961858525707786";
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
    total = 1;

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    // Checkout HELPER agent
    checkoutHelperAgent();

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
