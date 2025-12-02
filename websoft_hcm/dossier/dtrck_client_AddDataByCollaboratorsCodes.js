// 7365809179739829543
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
var currentRow = Int(Param.START_ROW);

function isCollaboratorExistsInRccDossier(collsCode) {
    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        "    FROM [WTDB].[dbo].cc_dossier_trained_by_rccs " +
        "    WHERE student_code = '" + collsCode + "'"));

    return ArrayCount(dossierList) > 0;
}

function getMethodsFromDtRcc(collsId) {
    /*
    evr.data.value('(event_result/custom_elems/custom_elem[name=''month_report''])[1]/value[1]', 'varchar(max)') AS evr_month,
	evr.data.value('(event_result/custom_elems/custom_elem[name=''year_report''])[1]/value[1]', 'varchar(max)') AS evr_year
     */
    try {
        var sqlQuery =
            "WITH _view_cc_dossier_trained_by_rcc AS (" +
            "   SELECT evrs.person_id AS person_id, evs.education_method_id, edms.name AS edm_name" +
            " FROM [WTDB].[dbo].event_results AS evrs" +
            " INNER JOIN [WTDB].[dbo].event_result AS evr ON evr.id = evrs.id" +
            " INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id" +
            " INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            " WHERE evrs.person_id = " + collsId + " AND" +
            " evrs.is_assist = 1" +
            " GROUP BY evrs.person_id, evs.education_method_id, edms.name" +
            " ) " +
            " SELECT _view1.person_id, edm_name = STUFF (" +
            "    (SELECT ';' + edm_name" +
            "       FROM _view_cc_dossier_trained_by_rcc AS _view2" +
            "       WHERE _view2.person_id = _view1.person_id" +
            "       ORDER BY edm_name" +
            "           FOR XML PATH ('')" +
            "       ), 1, 1, '')," +
            "       COUNT(_view1.person_id) as edm_count" +
            " FROM _view_cc_dossier_trained_by_rcc _view1" +
            " GROUP BY _view1.person_id;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function saveExcel(excelFile, excelSheet, message, collaboratorId) {
    excelSheet.Cells(currentRow, 4).Value = message;
    if(collaboratorId != null) {
        excelSheet.Cells(currentRow, 5).Value = "'" + collaboratorId;
    }
    excelFile.Save();
}

if (!LdsIsServer ) {
    var startDate = Date();
    var loggerName = "agent_7365809179739829543";
    var agentId = 7365809179739829543;
    var userId = tools.cur_user.Object.id;

    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var excelURL = Screen.AskFileOpen("", "Выбери файл *.xls*");
    var excel = new ActiveXObject("Excel.Application");
    var excelFile = excel.Workbooks.Open(excelURL);

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.START_ROW:" + currentRow);

        try {
            var excelSheet = excelFile.Worksheets(1);
            var isProcessing = true;

            var processed = 0, saved = 0;
            var skipped = 0, edMethodsSkipped = 0;

            agent.message = "Обрабатывается ...";
            if(ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            while (isProcessing) {
                if (excelSheet.Cells(currentRow, 1).Value == undefined) {
                    isProcessing = false;
                } else {
                    collaboratorCode = excelSheet.Cells(currentRow, 1).Value;

                    if (!isCollaboratorExistsInRccDossier(collaboratorCode)) {
                        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator '" + collaboratorCode + "' not in dossier!");

                        collaborator = tools.get_doc_by_key("collaborator", "login", collaboratorCode);

                        if (collaborator == null) {
                            addLogMessage(
                                loggerName,
                                "[agent.id: " + agentId + "] WARNING | Excel colls.code: " + collaboratorCode + " not found. Row: " + currentRow
                            );
                            saveExcel(excelFile, excelSheet, "Не найден в таблице сотрудника", collaboratorCode);
                            skipped++;
                        } else {
                            newRccDossier = tools.new_doc_by_name("cc_dossier_trained_by_rcc", false);
                            newRccDossier.BindToDb(DefaultDb);

                            collaboratorTE = collaborator.TopElem;
                            newRccDossierTE = newRccDossier.TopElem;

                            newRccDossierTE.student_id = collaboratorTE.id;
                            newRccDossierTE.student_code = collaboratorTE.login;
                            newRccDossierTE.student_fullname = collaboratorTE.fullname;

                            position = tools.open_doc(collaboratorTE.position_id);

                            if(position == undefined) {
                                addLogMessage(
                                    loggerName,
                                    "[agent.id: " + agentId + "] WARNING | Position with ID " + collaboratorTE.position_id + " not found. Row: " + currentRow
                                );
                                saveExcel(excelFile, excelSheet, "Должность " + collaboratorTE.position_id + "не найдена. Пропущено.", collaboratorTE.id);
                                skipped++;

                                currentRow++;

                                continue;
                            }

                            newRccDossierTE.student_position = position.TopElem.name;

                            organization = tools.open_doc(collaboratorTE.org_id);

                            if(organization == undefined) {
                                addLogMessage(
                                    loggerName,
                                    "[agent.id: " + agentId + "] WARNING | Position with ID " + collaboratorTE.org_id + " not found. Row: " + currentRow
                                );
                                saveExcel(excelFile, excelSheet, "Организация " + collaboratorTE.org_id + " не найдена. Пропущено.", collaboratorTE.id);
                                skipped++;

                                currentRow++;

                                continue;
                            }

                            organizationTE = organization.TopElem;

                            newRccDossierTE.subdivision_inn = organizationTE.code;
                            newRccDossierTE.subdivision_name = organizationTE.name;

                            region = tools.open_doc(organizationTE.region_id);

                            if(region == undefined) {
                                addLogMessage(
                                    loggerName,
                                    "[agent.id: " + agentId + "] WARNING | Region with ID " + organizationTE.region_id + " not found. Row: " + currentRow
                                );
                                saveExcel(excelFile, excelSheet, "Регион " + organizationTE.region_id + " не найден. Пропущено.", collaboratorTE.id);
                                skipped++;

                                currentRow++;

                                continue;
                            }

                            newRccDossierTE.region_name = region.TopElem.name;

                            region = tools.open_doc(organizationTE.custom_elems.ObtainChildByKey("report_region_id").value);

                            if(region == undefined) {
                                addLogMessage(
                                    loggerName,
                                    "[agent.id: " + agentId + "] WARNING | Region with ID " + organizationTE.custom_elems.ObtainChildByKey("report_region_id").value + " not found. Row: " + currentRow
                                );
                                saveExcel(excelFile, excelSheet, "Регион " + organizationTE.custom_elems.ObtainChildByKey("report_region_id").value + " не найден. Пропущено.", collaboratorTE.id);
                                skipped++;

                                currentRow++;

                                continue;
                            }

                            newRccDossierTE.reporting_region_name = region.TopElem.name;

                            resultArray = getMethodsFromDtRcc(collaboratorTE.id);

                            resultCount = ArrayCount(resultArray);
                            if (resultCount == 1) {
                                newRccDossierTE.num_trainings = resultArray[0].edm_count;
                                newRccDossierTE.programs = resultArray[0].edm_name;
                            } else {
                                // No education methods
                                edMethodsSkipped++;

                                addLogMessage(
                                    loggerName,
                                    "[agent.id: " + agentId + "] No education methods. Colls.ID: " + collaboratorTE.id + " Row: " + currentRow
                                );

                                saveExcel(excelFile, excelSheet, collaboratorTE.id, "Нет программ обучения", collaboratorTE.id);
                            }

                            newRccDossierTE.in_month = excelSheet.Cells(currentRow, 2).Value;
                            newRccDossierTE.in_year = excelSheet.Cells(currentRow, 3).Value;
                            collaboratorTE.custom_elems.ObtainChildByKey("is_dossier_rcc_exist").value = true;

                            newRccDossier.Save();
                            collaborator.Save();

                            saved++;
                        }
                    } else {
                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] WARNING | Excel colls.code: " + collaboratorCode + " is skipped. Row: " + currentRow
                        );

                        saveExcel(excelFile, excelSheet, null, "", collaboratorCode);

                        skipped++;
                    }

                    currentRow++;
                    processed++;

                    agent.processed = processed;
                    agent.skipped = skipped + edMethodsSkipped;
                    agent.saved = saved;
                    agent.message = "Обрабатывается ...";
                    if (ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }

                    if (processed % 100 == 0) {
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

            duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));

            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Duration: " + duration
            );

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
                "Пропущено: " + (skipped + edMethodsSkipped) + "\n" +
                "Время: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate)));
        } catch (e) {
            agent.state = 2;
            agent.errorMessage = e;
            sendMessageToWebsocket(ws, agent);

            throw new Error(e);
        }
    } catch (e) {
        excelFile.Close(true);
        excel.Application.Quit();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Row: " + currentRow + " ERROR: " + e);

        alert("ERROR: " + e + "\nRow: " + currentRow);
    } finally {
        excelFile.Close(true);
        excel.Application.Quit();
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}