// 7358373207434405549
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if(!LdsIsServer) {
    var agentId = 7358373207434405549;
    var userId = tools.cur_user.Object.id;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7358373207434405549";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    excelURL = Screen.AskFileOpen("", "Выбери файл *.xls*");
    excel = new ActiveXObject("Excel.Application");
    excelFile = excel.Workbooks.Open(excelURL);

    currentRow = OptInt(Param.START_ROW);
    processed = 0;
    saved = 0;
    skipped = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] START_ROW: " + Param.START_ROW);
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.TYPE: " + Param.TYPE);

    try {
        excelSheet = excelFile.Worksheets(1);
        isProcessing = true;

        loop = OptInt(Param.LOOP);

        agent.message = "Обработка данных...";
        ws = sendMessageToWebsocket(ws, agent);

        while (isProcessing) {
            if (excelSheet.Cells(currentRow, 1).Value == undefined) {
                isProcessing = false;
            } else {
                eventResultId = OptInt(excelSheet.Cells(currentRow, 1).Value);

                // Get EventResult object
                eventResultDoc = tools.open_doc(eventResultId);
                if (eventResultDoc != undefined) {
                    try {
                        if (eventResultDoc.TopElem.event_result_type_id != Param.TYPE) {
                            eventResultDoc.TopElem.event_result_type_id = Param.TYPE;

                            eventResultDoc.Save();

                            saved++;
                        } else {
                            skipped++;
                        }
                    } catch (e) {
                        // Send error message to agent's monitor
                        alert("Broken row: " + currentRow + " Error: " + e);

                        throw Error(e);
                    }
                } else {
                    skipped++;
                }

                currentRow++;
                processed++;

                if (loop > 0 && processed == loop) {
                    isProcessing = false;
                }
            }

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if (processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed, " + skipped + " skipped, " + saved + " saved ..."
                );
            }

            if (currentRow % 1000 == 0) {
                Sleep(10);
            }
        }

        agent.state = 1;
        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, processed);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        agent.refreshChart = 1;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] " + processed + " processed, " + skipped + " skipped, " + saved + " saved"
        );
        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Finished."
        );

        alert("Start from: " + Param.START_ROW + "\nОбработано: " + processed + " записей\nПропущено: " + skipped + " записей\nВремя: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate)));
    } catch (e) {
        excelFile.Close(true);
        excel.Application.Quit();

        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        alert("Broken row: " + (currentRow - 2) + " ERROR: " + e);
    } finally {
        excelFile.Close(true);
        excel.Application.Quit();
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}