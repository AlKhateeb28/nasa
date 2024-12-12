// 7366242919464721978
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isCollaboratorExistsInDossier(collsId) {
    return tools.get_doc_by_key("cc_dossier_subsidized_trained", "student_code", collsId) != null;
}

function getMethodsFromDts(collsId) {
    try {
        var sqlQuery =
            "WITH _view_cc_dossier_subsidized_trained AS (" +
            "   SELECT evrs.person_id AS id, evs.education_method_id, edms.name AS edm_name" +
            "       FROM [WTDB].[dbo].event_results AS evrs" +
            "           INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id" +
            "               INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            "   WHERE evrs.person_id = " + collsId +
            "       AND evrs.is_assist = 1" +
            " GROUP BY evrs.person_id, evs.education_method_id, edms.name" +
            " ) " +
            " SELECT _view1.id, edm_name = STUFF (" +
            "    (SELECT ';' + edm_name" +
            "       FROM _view_cc_dossier_subsidized_trained AS _view2" +
            "       WHERE _view2.id = _view1.id" +
            "       ORDER BY edm_name" +
            "           FOR XML PATH ('')" +
            "       ), 1, 1, '')," +
            "       COUNT(_view1.id) as edm_count" +
            " INTO _tbl_result" +
            " FROM _view_cc_dossier_subsidized_trained _view1" +
            " GROUP BY _view1.id; SELECT * FROM _tbl_result; DROP TABLE _tbl_result;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

var startDate = Date();
var loggerName = "agent_7366242919464721978";
var agentId = 7366242919464721978;
var userId = tools.cur_user.Object.id;

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

var excelURL = Screen.AskFileOpen( "", "Выбери файл *.xls*" );
var excel = new ActiveXObject( "Excel.Application" );
var excelFile = excel.Workbooks.Open(excelURL);

try {
    var excelSheet = excelFile.Worksheets( 1 );
    var isProcessing = true;
    var currentRow = 2;
    var processed = 0, saved = 0;
    var skipped = 0, edMethodsSkipped = 0;

    agent.message = "Обрабатывается ...";
    ws = sendMessageToWebsocket(ws, agent);

    while(isProcessing) {
        if(excelSheet.Cells(currentRow, 1).Value == undefined) {
            isProcessing = false;
        } else {
            collaboratorCode = excelSheet.Cells(currentRow, 1).Value;

            if(!isCollaboratorExistsInDossier(collaboratorCode)) {
                collaborator = tools.get_doc_by_key("collaborator", "login", collaboratorCode);

                if(collaborator == null) {
                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] WARNING | Excel colls.id: " + collaboratorCode + " not found. Row: " + currentRow
                    );

                    skipped++;
                } else {
                    newDossier = tools.new_doc_by_name("cc_dossier_subsidized_trained", false);
                    newDossier.BindToDb(DefaultDb);

                    newDossierTE = newDossier.TopElem;
                    collaboratorTE = collaborator.TopElem;

                    newDossierTE.student_id = collaboratorTE.id;
                    newDossierTE.student_code = collaboratorTE.login;
                    newDossierTE.student_fullname = collaboratorTE.fullname;

                    positionDoc = tools.open_doc(collaboratorTE.position_id);

                    if(positionDoc != undefined) {
                        newDossierTE.student_position = positionDoc.TopElem.name;
                    } else {
                        newDossierTE.student_position = "Не задано";
                    }

                    organization = tools.open_doc(collaboratorTE.org_id);

                    organizationTE = organization.TopElem;

                    newDossierTE.subdivision_inn = organizationTE.code;
                    newDossierTE.subdivision_name = organizationTE.name;

                    region = tools.open_doc(organizationTE.region_id);
                    newDossierTE.region_name = region.TopElem.name;

                    region = tools.open_doc(organizationTE.custom_elems.ObtainChildByKey("fact_region_id").value);
                    newDossierTE.fact_region_name = region.TopElem.name;

                    resultArray = getMethodsFromDts(collaboratorTE.id);

                    resultCount = ArrayCount(resultArray);
                    if (resultCount == 1) {
                        newDossierTE.num_trainings = resultArray[0].edm_count;
                        newDossierTE.programs = resultArray[0].edm_name;
                    } else if (resultCount == 0) {
                        // No education methods
                        edMethodsSkipped++;

                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] No education methods. Colls.ID: " + collaboratorTE.org_id
                        );
                    } else {
                        // More education methods
                        edMethodsSkipped++;

                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] More education methods. Colls.ID: " + collaboratorTE.org_id
                        );
                    }

                    newDossierTE.in_month = excelSheet.Cells(currentRow, 2).Value;
                    newDossierTE.in_year = excelSheet.Cells(currentRow, 3).Value;
                    collaboratorTE.custom_elems.ObtainChildByKey("is_dossier_exist").value = true;

                    newDossier.Save();
                    collaborator.Save();

                    saved++;
                }
            } else {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] WARNING | Excel colls.id: " + collaboratorCode + " is skipped. Row: " + currentRow
                );

                skipped++;
            }

            currentRow++;
            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped + edMethodsSkipped;
                agent.saved = saved;
                agent.message = "Обрабатывается ...";
                if(ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }

            if(currentRow % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed, " + (skipped + edMethodsSkipped) + " skipped, " + saved + " saved..."
                );
            }
        }
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed, ",
        saved + " saved, ",
        skipped + " skipped, " + edMethodsSkipped + " edMethods skipped"
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );

    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));

    agent.state = 1;
    agent.processed = processed;
    agent.skipped = skipped + edMethodsSkipped;
    agent.saved = saved;
    refreshMsPerRow(agent, startDate, processed);
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(startDate);
    agent.message = "Закончено. Продолжительность " + duration;
    if(ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    alert(
        "Обработано: " + processed + "\n" +
        "Сохранено: " + saved + "\n" +
        "Пропущено: " + skipped + "\n" +
        "Время: " + getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate)));
} catch (e) {
    excelFile.Close(true);
    excel.Application.Quit();

    agent.state = 2;
    agent.errorMessage = e;
    if(ws != null) {
        sendMessageToWebsocket(ws, agent);
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    alert("ERROR: " + e);
} finally {
    excelFile.Close(true);
    excel.Application.Quit();
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}