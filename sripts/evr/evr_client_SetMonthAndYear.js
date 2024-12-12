// 7361391346412363816
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7361391346412363816;
var userId = tools.cur_user.Object.id;
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = Date();
loggerName = "agent_7361391346412363816";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

excelURL = Screen.AskFileOpen( "", "Выбери файл *.xls*" );
excel = new ActiveXObject( "Excel.Application" );
excelFile = excel.Workbooks.Open( excelURL );
currentRow = Int(Param.ROW);
processed = 0; saved = 0; skipped = 0;

try {
    excelSheet = excelFile.Worksheets( 1 );
    isProcessing = true;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    agent.message = "Обработка данных...";
    ws = sendMessageToWebsocket(ws, agent);

    while(isProcessing) {
        if(excelSheet.Cells(currentRow, 1).Value == undefined) {
            isProcessing = false;
        } else {
            eventResultId = Int(excelSheet.Cells(currentRow, 1).Value);

            // Get EventResult object
            eventResultDoc = tools.open_doc(eventResultId);
            if(eventResultDoc != undefined) {
                try {
                        eventResultDoc.TopElem.custom_elems.ObtainChildByKey("month_report").value = Param.MONTH;
                        eventResultDoc.TopElem.custom_elems.ObtainChildByKey("year_report").value = Param.YEAR;

                        eventResultDoc.Save();

                        saved++;
                } catch(e) {
                    // Send error message to agent's monitor
                    alert("Ошибочная запись: " + currentRow + " Error: " + e);

                    throw Error(e);
                }
            } else {
                // Not event_results object. Wrong excel ID
                skipped++;
            }

            currentRow++;
            processed++;
        }

        if (processed % 50 == 0) {
            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            agent.message = "Обрабатывается ...";
            if(ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(currentRow % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed, " + skipped + " skipped, " + saved + " saved..."
            );

            Sleep(10);
        }
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed, ",
        saved + " saved, ",
        skipped + " skipped"
    );
    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );
    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Finished."
    );

    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));

    agent.state = 1;
    agent.processed = processed;
    agent.skipped = skipped;
    agent.saved = saved;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(startDate);
    agent.message = "Закончено. Продолжительность " + duration;
    if(ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    alert("Обработано: " + (currentRow - 2) + " записей\nПропущено: " + skipped + " записей\nВремя: " + duration);
} catch (e) {
    excelFile.Close(true);
    excel.Application.Quit();

    agent.state = 2;
    agent.errorMessage = e;
    if(ws != null) {
        sendMessageToWebsocket(ws, agent);
    }

    alert("Broken row: " + currentRow + " ERROR: "  + e);
} finally {
    excelFile.Close(true);
    excel.Application.Quit();
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}