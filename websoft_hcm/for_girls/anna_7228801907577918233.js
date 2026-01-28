// 7228801907577918233
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function upp_first_char_low_other( str ) {
    new_str = StrUpperCase( StrCharRangePos ( str, 0, 1 ) ) + StrLowerCase( StrCharRangePos ( str, 1, StrCharCount( str ) ) );
    return new_str;
}

function upp_first_char( str ) {
    new_str = StrUpperCase( StrCharRangePos ( str, 0, 1 ) ) + StrCharRangePos ( str, 1, StrCharCount( str ) );
    return new_str;
}

function addPersonToEventResult(personId, eventId, defaultEventResultTypeId, isWorkGroup) {
    tools.add_person_to_event(personId,eventId);

    if(defaultEventResultTypeId != null) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT id " +
            " FROM [WTDB].[dbo].event_results " +
            " WHERE event_id = " + eventId +
            "      AND person_id = " + personId));

        if(ArrayCount(dataList) > 0) {
            eventResultDoc = tools.open_doc(dataList[0].id);

            eventResultDoc.TopElem.event_result_type_id = defaultEventResultTypeId;
            if(isWorkGroup) {
                eventResultDoc.TopElem.custom_elems.ObtainChildByKey("col_rg").value = true;
            }

            eventResultDoc.Save();
        }
    }
}

var agentId = 7228801907577918233;
var userId = tools.cur_user.Object.id;
var msPerRecord = 0.01;

if(LdsIsClient) {
    excelURL = Screen.AskFileOpen('', "Выбери файл *.xls*");
    excel = new ActiveXObject("Excel.Application");
    excelFile = excel.Workbooks.Open(excelURL);
    excelSheet = excelFile.Worksheets(1);

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7228801907577918233";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    try {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

        var total = 0;
        var processed = 0;
        var saved = 0;
        var skipped = 0;

        try {
            var send_message_to = String(Param.send_message_to);
            var event_id = OptInt(Param.event_id);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] Param.event_id: " + Param.event_id);

            // var subdivision_id_1 = 7098973675361929525 // load_muc
            // var subdivision_name_1 = "load_muc"
            event_doc = tools.open_doc(event_id);
            education_method_id = event_doc.TopElem.education_method_id;
            defaultEventResultTypeId = event_doc.TopElem.default_event_result_type_id;

            alert_message = "";
            num_rows = 0;
            currentRow = 2;

            agent.total = total;
            agent.refreshChart = 1;
            agent.message = "Обработка данных...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            while (true) {
                if (excelSheet.Cells(currentRow, 1).Value == undefined) {
                    break;
                }

                processed++;

                excelSheet.Cells(currentRow, 7).Value = "";

                col_fullname = excelSheet.Cells(currentRow, 1).Value == undefined ? "" : Trim(UnifySpaces(excelSheet.Cells(currentRow, 1).Value));
                col_email = excelSheet.Cells(currentRow, 2).Value == undefined ? "" : Trim(UnifySpaces(excelSheet.Cells(currentRow, 2).Value));
                col_phone = excelSheet.Cells(currentRow, 3).Value == undefined ? "" : Trim(UnifySpaces(excelSheet.Cells(currentRow, 3).Value));
                str = excelSheet.Cells(currentRow, 4).Value == undefined ? "" : Trim(UnifySpaces(excelSheet.Cells(currentRow, 4).Value));
                col_position_name = upp_first_char(str);
                col_org_inn = excelSheet.Cells(currentRow, 5).Value == undefined ? "" : Trim(UnifySpaces(excelSheet.Cells(currentRow, 5).Value));

                col_fullname_arr = col_fullname.split(" ");
                col_fullname_arr_count = ArrayCount(col_fullname_arr);

                if (StrContains(col_fullname, '.', false)) {
                    alert_message += "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    if (send_message_to == 'excel') {
                        excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    }

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не добален, так как неверно заполнено ФИО. 01");

                    currentRow++;
                    skipped++;
                    continue;
                }
                if (col_fullname_arr_count < 2 || col_fullname_arr_count > 4) {
                    alert_message += "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    if (send_message_to == 'excel') {
                        excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    }

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не добален, так как неверно заполнено ФИО. 02");

                    currentRow++;
                    skipped++;
                    continue;
                } else {
                    if (col_fullname_arr_count == 2) {
                        col_lastname = upp_first_char_low_other(col_fullname_arr[0]);
                        col_firstname = upp_first_char_low_other(col_fullname_arr[1]);
                        col_middlename = "";
                    } else if (col_fullname_arr_count == 3) {
                        col_lastname = upp_first_char_low_other(col_fullname_arr[0]);
                        col_firstname = upp_first_char_low_other(col_fullname_arr[1]);
                        col_middlename = upp_first_char_low_other(col_fullname_arr[2]);
                    } else if (col_fullname_arr_count == 4) {
                        col_lastname = upp_first_char_low_other(col_fullname_arr[0]);
                        col_firstname = upp_first_char_low_other(col_fullname_arr[1]);
                        col_middlename = upp_first_char_low_other(col_fullname_arr[2]) + " " + upp_first_char_low_other(col_fullname_arr[3]);
                    }
                }

                if (StrCharCount(col_firstname) == 1 || StrCharCount(col_middlename) == 1) {
                    alert_message += "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    if (send_message_to == 'excel') {
                        excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не добален, так как неверно заполнено ФИО; ";
                    }

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не добален, так как неверно заполнено ФИО. 03");

                    currentRow++;
                    skipped++;
                    continue;
                }

                organization = tools.get_doc_by_key("org", "code", col_org_inn);

                if (organization == null) {
                    alert_message += "Участник " + col_fullname + " не добален, так как не найдена организация с ИНН - " + col_org_inn + "; ";
                    if (send_message_to == 'excel') {
                        excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не добален, так как не найдена организация с ИНН - " + col_org_inn + "; ";
                    }

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не добален, так как не найдена организация с ИНН - " + col_org_inn);

                    currentRow++;
                    skipped++;
                    continue;
                } else {
                    organizationTE = organization.TopElem;

                    if (Param.checkFormPart && StrCharCount(organizationTE.custom_elems.ObtainChildByKey("format_part").value) == 0) {
                        alert_message += "Участник " + col_fullname + " не является участником нац.проекта; ";
                        if (send_message_to == 'excel') {
                            excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не является участником нац.проекта; ";
                        }

                        addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не является участником нац.проекта");

                        currentRow++;
                        skipped++;
                        continue;
                    }

                    collaboratorList = ArrayOptFirstElem(XQuery("sql: " +
                        " SELECT" +
                        " collaborators.id AS col_id" +
                        " FROM collaborators" +
                        " LEFT JOIN orgs" +
                        " ON collaborators.org_id = orgs.id" +
                        " WHERE collaborators.fullname = '" + col_fullname + "'" +
                        " AND collaborators.code LIKE '%load_muc%'" +
                        " AND orgs.code = '" + col_org_inn + "'"
                    ));

                    isWorkGroup = false;
                    if(excelSheet.Cells(currentRow, 6).Value != undefined && StrUpperCase(excelSheet.Cells(currentRow, 6).Value) == "ДА") {
                        isWorkGroup = true;
                    }

                    if (collaboratorList == undefined) {
                        a1 = StrDate(Date()).split(" ");
                        a2 = a1[0].split(".");
                        a3 = a1[1].split(":");
                        my_str = "load_muc_" + a2[2] + a2[1] + a2[0] + "_" + a3[0] + a3[1] + a3[2] + "_" + tools.random_string(5);

                        collaboratorDoc = tools.new_doc_by_name('collaborator', false);
                        collaboratorDoc.BindToDb(DefaultDb);
                        collaboratorDocTE = collaboratorDoc.TopElem;
                        collaboratorDocTE.lastname = col_lastname;
                        collaboratorDocTE.firstname = col_firstname;
                        collaboratorDocTE.middlename = col_middlename;
                        collaboratorDocTE.code = my_str;
                        collaboratorDocTE.login = my_str;
                        //collaboratorDocTE.password = tools.random_string( 20 );
                        collaboratorDocTE.custom_elems.ObtainChildByKey("uf_inn").value = col_org_inn;
                        collaboratorDocTE.custom_elems.ObtainChildByKey("load_muc").value = true;
                        collaboratorDocTE.custom_elems.ObtainChildByKey("guid_status").value = "Надо получить";
                        collaboratorDocTE.custom_elems.ObtainChildByKey("comment").value = "|||" + StrDate(Date()) + " - Создан агентом для добавление в мероприятие «" + event_doc.TopElem.name + "» в качестве участника.";
                        if(isWorkGroup) {
                            collaboratorDocTE.custom_elems.ObtainChildByKey("col_rg").value = true;
                        }
                        collaboratorDocTE.access.web_banned = true;
                        collaboratorDocTE.org_id = organizationTE.id;
                        collaboratorDocTE.org_name = organizationTE.name;
                        collaboratorDocTE.last_import_date = Date();
                        collaboratorDocTE.system_email = col_email;
                        collaboratorDocTE.mobile_phone = col_phone;
                        collaboratorDocTE.birth_date.Clear();

                        positionDoc = tools.new_doc_by_name('position', false);
                        positionDoc.BindToDb(DefaultDb);
                        positionDocTE = positionDoc.TopElem;
                        positionDocTE.name = col_position_name;
                        positionDocTE.org_id = organizationTE.id;
                        positionDocTE.position_appointment_type_id = 6820005324597779239; // Тип назначения Основная

                        collaboratorDoc.Save();
                        positionDoc.Save();

                        positionDocTE.basic_collaborator_id = collaboratorDoc.DocID;
                        //positionDocTE.parent_object_id = subdivision_id_1;
                        collaboratorDocTE.position_id = positionDoc.DocID;
                        //collaboratorDocTE.position_parent_id = subdivision_id_1;
                        //collaboratorDocTE.position_parent_name = subdivision_name_1;

                        collaboratorDoc.Save();
                        positionDoc.Save();

                        addPersonToEventResult(collaboratorDoc.DocID, event_id, defaultEventResultTypeId, isWorkGroup);

                        saved++;
                    } else {
                        found_events_arr = ArraySelectAll(XQuery("sql: " +
                            " SELECT" +
                            " event_results.event_id" +
                            " FROM event_results" +
                            " LEFT JOIN events" +
                            " ON events.id = event_results.event_id" +
                            " WHERE event_results.person_id = " + collaboratorList.col_id +
                            " AND event_results.is_assist = 1" +
                            " AND events.education_method_id = " + education_method_id
                        ));

                        collaboratorDoc = tools.open_doc(collaboratorList.col_id);

                        if(collaboratorDoc != undefined) {
                            if (ArrayCount(found_events_arr) == 0) {
                                addPersonToEventResult(collaboratorList.col_id, event_id, defaultEventResultTypeId, isWorkGroup);

                                collaboratorDoc = tools.open_doc(collaboratorList.col_id);
                                collaboratorDoc.TopElem.system_email = col_email;
                                collaboratorDoc.TopElem.mobile_phone = col_phone;
                                if (isWorkGroup) {
                                    collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("col_rg").value = true;
                                }
                                collaboratorDoc.Save();

                                saved++;
                            } else {
                                if (isWorkGroup) {
                                    collaboratorDocTE.custom_elems.ObtainChildByKey("col_rg").value = true;

                                    collaboratorDoc.Save();
                                }

                                alert_message += "Участник " + col_fullname + " не добален, так как участвовал в мероприятиях: " + ArrayMerge(found_events_arr, "This.event_id", ", ");
                                if (send_message_to == 'excel') {
                                    excelSheet.Cells(currentRow, 7).Value = "Участник " + col_fullname + " не добален, так как участвовал в мероприятиях: " + ArrayMerge(found_events_arr, "This.event_id", ", ");
                                }

                                addLogMessage(loggerName, "[agent.id: " + agentId + "] Участник " + col_fullname + " не добален, так как участвовал в мероприятиях: " + ArrayMerge(found_events_arr, "This.event_id", ", "));

                                currentRow++;
                                skipped++;
                                continue;
                            }
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID  " + collaboratorList.col_id + " is not found!");
                        }
                    }
                }

                currentRow++;

                if (processed % 100 == 0) {
                    agent.processed = processed;
                    agent.saved = saved;
                    agent.skipped = skipped;
                    if(ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }
                }
                if (processed % 1000 == 0) {
                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] " + processed + " processed, " + saved + " saved, " + skipped + " skipped ..."
                    );
                }
            }

            agent.processed = processed;
            agent.saved = saved;
            agent.skipped = skipped;
            agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.message = "Сохраняем Excel файл...";
            agent.refreshChart = 1;
            if(ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            num_rows = currentRow - 1;

            if (alert_message != '') {
                if (send_message_to == 'alert') {
                    alert(alert_message);
                }
                if (send_message_to == 'notification') {
                    tools.create_notification('load_muc_err', tools.cur_user_id, alert_message);
                }
            }
            excelFile.Save();

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
                "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
            );

            agent.state = 1;
            agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.processed = processed;
            agent.saved = saved;
            agent.skipped = skipped;
            refreshMsPerRow(agent, startDate, total);
            duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
            agent.message = "Закончено. Продолжительность " + duration;
            if(ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            saveMonitorAgents(agent, startDate);
        } catch (e) {
            agent.state = 2;
            agent.errorMessage = e;
            if(ws != null) {
                sendMessageToWebsocket(ws, agent);
            }

            throw new Error(e);
        }
    } catch (e) {
        excelFile.Save();

        excelFile.Close(true);
        excel.Application.Quit();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        agent.state = 2;
        agent.errorMessage = e;
        if(ws != null) {
            sendMessageToWebsocket(ws, agent);
        }

        saveMonitorAgents(agent, startDate);

        alert("ERROR: " + e + "\nRow: " + currentRow);
    } finally {
        excelFile.Close(true);
        excel.Application.Quit();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

        Screen.MsgBox(
            "Обработано: " + processed + "\n" +
            "Сохранено: " + saved + "\n" +
            "Пропущено: " + skipped + "\n" +
            "Время: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate)), ms_tools.get_const('c_info'), 'info', 'ok');
    }

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}