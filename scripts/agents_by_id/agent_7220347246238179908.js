// 7220347246238179908
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function addToOrganizationList(orgId, okvdType) {
    // okvdType = 0 - no contains okvd, okvdType = 1 - contains okvd
    element = {};
    element.id = orgId;
    element.okvdType = okvdType;

    organizationList.push(element);
}

function getOkvdType(orgId) {
    for(i = 0; i < ArrayCount(organizationList); i++) {
        if(organizationList[i].id == orgId) {
            return organizationList[i].okvdType;
        }
    }

    return null;
}

function hasOkvd(okvd) {
    for(i = 0; i < ArrayCount(okvds); i++) {
        if(okvd == okvds[i]) {
            return true;
        }
    }

    return false;
}

if (!LdsIsServer) {
    var organizationList = [];

    var okvds = ["01.11", "01.12", "01.13", "01.14", "01.15", "01.16", "01.19", "01.21", "01.22", "01.23", "01.24",
        "01.25", "01.26", "01.27", "01.28", "01.29", "01.30", "01.41", "01.42", "01.43", "01.44", "01.45", "01.46", "01.47",
        "01.49", "01.50", "01.61", "01.62", "01.63", "01.64", "01.70", "02.10", "02.20", "02.30", "02.40", "03.11", "03.12",
        "03.21", "03.22", "10.11", "10.12", "10.13", "10.20", "10.31", "10.32", "10.39", "10.41", "10.42", "10.51", "10.52",
        "10.61", "10.62", "10.71", "10.72", "10.73", "10.81", "10.82", "10.83", "10.84", "10.85", "28.30", "28.93", "33.12",
        "33.20", "46.11", "46.12.32", "46.17", "46.21", "46.22", "46.23", "46.24", "46.31", "46.32", "46.33", "46.34", "46.35",
        "46.36", "46.37", "46.38", "46.39", "46.45.2", "46.61", "46.69.4", "46.73.1", "46.75.1", "49.20.9", "49.41.1", "49.41.2"];

    var agentId = 7220347246238179908;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7220347246238179908";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;

    var excelURL = Screen.AskFileOpen("", "Выбери файл *.xls*");
    var excel = new ActiveXObject("Excel.Application");
    var excelFile = excel.Workbooks.Open(excelURL);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        excelSheet = excelFile.Worksheets(1);
        isProcessing = true;
        currentRow = 2;

        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        isSave = false;

        while (isProcessing) {
            if (excelSheet.Cells(currentRow, 2).Value == undefined) {
                isProcessing = false;
            } else {
                inn = Trim(excelSheet.Cells(currentRow, 2).Value);

                if(StrBegins(inn, "'")) {
                    inn = StrCharRangePos(inn,1,StrCharCount(inn) - 1);
                }

                dataList = ArrayDirect(XQuery("sql: " +
                    " SELECT os.id, " +
                    "       o.data.value('(//custom_elems/custom_elem[name=''industry_code'']/value)[1]', 'varchar(max)') AS industry_code " +
                    " FROM [WTDB].[dbo].orgs os " +
                    "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
                    " WHERE os.code = '" + inn + "' "));

                processed += ArrayCount(dataList);

                if(ArrayCount(dataList) > 0) {
                    okvdType = getOkvdType(dataList[0].id);

                    if(okvdType != null) {
                        if(okvdType == 1) {
                            excelSheet.Cells(currentRow, 1).Value = "1";

                            isSave = true;
                            saved++;
                        }
                    } else {
                        if (hasOkvd(dataList[0].industry_code)) {
                            excelSheet.Cells(currentRow, 1).Value = "1";

                            isSave = true;
                            saved++;

                            addToOrganizationList(dataList[0].id, 1);
                        } else {
                            addToOrganizationList(dataList[0].id, 0);
                        }
                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with INN is not exist!");
                }

                total++;
                currentRow++;

                agent.total = total;
                agent.processed = processed;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
        }

        if(isSave) {
            agent.total = total;
            agent.processed = processed;
            agent.saved = saved;
            agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            refreshMsPerRow(agent, startDate, total);
            agent.message = "Сохраняем Excel файл...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            excelFile.Save();
        }

        agent.state = 1;
        agent.total = total;
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
        alert(e);

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