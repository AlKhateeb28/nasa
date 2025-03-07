// 7128653326876244381
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function normalizeWaveNumber(wave) {
    return StrReplace(wave, "/", "\\");
}

if (!LdsIsServer) {
    var agentId = 7128653326876244381;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7128653326876244381";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var processed = 0;
    var saved = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    var excelURL = Screen.AskFileOpen("", "Выбери файл *.xls*");
    var excel = new ActiveXObject("Excel.Application");
    var excelFile = excel.Workbooks.Open(excelURL);

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] 1");

        excelSheet = excelFile.Worksheets(1);
        isProcessing = true;
        currentRow = 2;

        addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");

        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        while (isProcessing) {
            if (excelSheet.Cells(currentRow, 1).Value == undefined) {
                isProcessing = false;
            } else {
                dataList = ArrayDirect(XQuery("sql: " +
                    " SELECT id " +
                    " FROM [WTDB].[dbo].collaborators " +
                    " WHERE email = '" + excelSheet.Cells(currentRow, 8) + "'"));

                if(ArrayCount(dataList) == 1) {
                    dossierList = ArrayDirect(XQuery("sql: " +
                        " SELECT doss.id " +
                        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
                        " WHERE doss.trainer_id = " + dataList[0].id));

                    dossierDoc = null;

                    if(ArrayCount(dossierList) == 0) {
                        dossierDoc = tools.new_doc_by_name( "cc_dossier_vntren_2025", false )
                        dossierDoc.BindToDb(DefaultDb);
                    } else {
                        dossierDoc = tools.open_doc(dossierList[0].id);
                    }

                    dossierDocTE = dossierDoc.TopElem;

                    dossierDocTE.trainer_id = dataList[0].id;

                    if(excelSheet.Cells(currentRow, 1).Value != undefined) {
                        dossierDocTE.trainer_fullname = excelSheet.Cells(currentRow, 1).Value;
                    }
                    if(excelSheet.Cells(currentRow, 2).Value != undefined) {
                        dossierDocTE.position_trainer = excelSheet.Cells(currentRow, 2).Value;
                    }
                    if(excelSheet.Cells(currentRow, 3).Value != undefined) {
                    dossierDocTE.organization_inn = excelSheet.Cells(currentRow, 3).Value;
                    }
                    if(excelSheet.Cells(currentRow, 4).Value != undefined) {
                        dossierDocTE.organization_name = excelSheet.Cells(currentRow, 4).Value;
                    }
                    if(excelSheet.Cells(currentRow, 5).Value != undefined) {
                        dossierDocTE.headcount = excelSheet.Cells(currentRow, 5).Value;
                    }
                    if(excelSheet.Cells(currentRow, 6).Value != undefined) {
                        dossierDocTE.region_organization = excelSheet.Cells(currentRow, 6).Value;
                    }
                    if(excelSheet.Cells(currentRow, 7).Value != undefined) {
                        dossierDocTE.region_in_reporting = excelSheet.Cells(currentRow, 7).Value;
                    }
                    if(excelSheet.Cells(currentRow, 8).Value != undefined) {
                        dossierDocTE.email = excelSheet.Cells(currentRow, 8).Value;
                    }
                    if(excelSheet.Cells(currentRow, 9).Value != undefined) {
                        dossierDocTE.phone = excelSheet.Cells(currentRow, 9).Value;
                    }
                    if(excelSheet.Cells(currentRow, 10).Value != undefined) {
                        dossierDocTE.trainer_type = excelSheet.Cells(currentRow, 10).Value;
                    }
                    if(excelSheet.Cells(currentRow, 11).Value != undefined) {
                        dossierDocTE.basic_training_program = excelSheet.Cells(currentRow, 11).Value;
                    }
                    if(excelSheet.Cells(currentRow, 12).Value != undefined) {
                        dossierDocTE.support_format = excelSheet.Cells(currentRow, 12).Value;
                    }
                    if(excelSheet.Cells(currentRow, 13).Value != undefined) {
                        dossierDocTE.curator_fullname = excelSheet.Cells(currentRow, 13).Value;
                    }
                    if(excelSheet.Cells(currentRow, 14).Value != undefined) {
                        dossierDocTE.curator_email = excelSheet.Cells(currentRow, 14).Value;
                    }
                    if(excelSheet.Cells(currentRow, 15).Value != undefined) {
                        dossierDocTE.curator_phone = excelSheet.Cells(currentRow, 15).Value;
                    }
                    if(excelSheet.Cells(currentRow, 16).Value != undefined) {
                        dossierDocTE.date_selection = excelSheet.Cells(currentRow, 16).Value;
                    }
                    if(excelSheet.Cells(currentRow, 17).Value != undefined) {
                        dossierDocTE.result_selection = StrLowerCase(excelSheet.Cells(currentRow, 17).Value);
                    }
                    if(excelSheet.Cells(currentRow, 18).Value != undefined) {
                        dossierDocTE.wave_number = normalizeWaveNumber(excelSheet.Cells(currentRow, 18).Value);
                    }
                    if(excelSheet.Cells(currentRow, 19).Value != undefined) {
                        dossierDocTE.start_date = excelSheet.Cells(currentRow, 19).Value;
                    }
                    if(excelSheet.Cells(currentRow, 20).Value != undefined) {
                        dossierDocTE.finish_date = excelSheet.Cells(currentRow, 20).Value;
                    }
                    if(excelSheet.Cells(currentRow, 21).Value != undefined) {
                        dossierDocTE.fact_trained = excelSheet.Cells(currentRow, 21).Value;
                    }
                    if(excelSheet.Cells(currentRow, 22).Value != undefined) {
                        dossierDocTE.status_trainer = excelSheet.Cells(currentRow, 22).Value;
                    }
                    if(excelSheet.Cells(currentRow, 23).Value != undefined) {
                        dossierDocTE.comments = excelSheet.Cells(currentRow, 23).Value;
                    }

                    dossierDoc.Save();

                    excelSheet.Cells(currentRow, 25).Value = "Досье создано";
                    excelSheet.Cells(currentRow, 26).Value = "Порядок";
                    saved++;
                } else {
                    if(ArrayCount(dataList) == 0) {
                        excelSheet.Cells(currentRow, 24).Value = "Сотрудник не найден";
                    } else {
                        excelSheet.Cells(currentRow, 24).Value = "Найдено более одного сотрудника по email";
                    }

                }

                processed++;
                currentRow++;

                if (processed % 10 == 0) {
                    agent.processed = processed;
                    agent.saved = saved;
                    refreshMsPerRow(agent, startDate, processed);
                    if (ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }
                }
            }
        }

        agent.processed = processed;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, processed);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        excelFile.Save();

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, processed);
        agent.message = "Закончено";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            null,
            processed + " processed, ",
            saved + " saved, ",
            null
        );

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );

        excel.Application.Quit();
    } catch (e) {
        excel.Application.Quit();

        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}