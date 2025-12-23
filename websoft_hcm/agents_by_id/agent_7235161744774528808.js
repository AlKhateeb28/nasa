// 7235161744774528808
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isEventExist(eventList, dossierId) {
    for(eventId in eventList) {
        if(OptInt(eventId) == OptInt(dossierId)) {
            return true;
        }
    }

    return false;
}

function getUniqueEvents(list, childTagName, max) {
    start = null;
    finish = null;

    eventList = [];

    eventResultId = 0;

    for(events in list) {
        eval("eventResultId = events." + childTagName);

        if(eventResultId != 0) {
            eventResultDoc = tools.open_doc(OptInt(eventResultId));

            if(eventResultDoc != undefined) {
                eventResultDocTE = eventResultDoc.TopElem;

                if(!isEventExist(eventList, eventResultDocTE.event_id)) {
                    eventDoc = tools.open_doc(eventResultDocTE.event_id);

                    if(eventDoc != undefined) {
                        eventDocTE = eventDoc.TopElem;

                        eventList.push(OptInt(eventResultDocTE.event_id));

                        if (start == null) {
                            start = eventDocTE.start_date;
                        } else {
                            if (eventDocTE.start_date < start) {
                                start = eventDocTE.start_date;
                            }
                        }

                        if (finish == null) {
                            finish = eventDocTE.finish_date;
                        } else {
                            if (eventDocTE.finish_date > finish) {
                                finish = eventDocTE.finish_date;
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        count: ArrayCount(eventList),
        name : ArrayCount(eventList) + " из " + max,
        start : start,
        finish : finish
    }
}

function getRPCertificateNumbers(certificateIds) {
    result = "";

    for(certificate in certificateIds) {
        certificateDoc = tools.open_doc(OptInt(certificate.rcc_rp_certificate_id));

        if(certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            if(certificateDocTE.type_id == 7104191280476593480 || certificateDocTE.type_id == 7164453267946338582) {
                result += certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
            }
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getRPOtherEvents(eventResultList) {
    result = "";

    for(eventResult in eventResultList) {
        eventResultDoc = tools.open_doc(eventResult.other_events_id);

        if(eventResultDoc != undefined) {
            result += eventResultDoc.TopElem.event_name + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getRPEduMethodNames(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.id, " +
            "       MAX(ems.name) AS name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND ems.id IN (7124747534142012406, 7124735507140964982) " +
            " WHERE ers.person_id =  " + collaborator.collaborator_list_id +
            " GROUP BY ems.id "));

        for(data in dataList) {
            result += data.name + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getRPEventResultNames(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ers.id, " +
            "       MAX(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) AS name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND ems.id IN (7124747534142012406, 7124735507140964982) " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            " GROUP BY ers.id "));

        for(data in dataList) {
            result += data.name + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function  getRPNotPassedEduMethods(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.id, " +
            "       ems.name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "         INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "         INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND LOWER(ems.code) LIKE '%fck_com_rck_rp%' " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "  AND ers.not_participate = 1 " +
            "  AND ems.id NOT IN ( " +
            "    SELECT ems1.id " +
            "    FROM [WTDB].[dbo].event_results ers1 " +
            "             INNER JOIN [WTDB].[dbo].events es1 ON ers1.event_id = es1.id " +
            "             INNER JOIN [WTDB].[dbo].education_methods ems1 ON es1.education_method_id = ems1.id AND LOWER(ems1.code) LIKE '%fck_com_rck_rp%' " +
            "    WHERE ers1.person_id = " + collaborator.collaborator_list_id +
            "      AND ers1.is_assist = 1 " +
            " ) "));

        for(data in dataList) {
            result += data.name + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getReportHeader() {
    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>Регион</td>");
    reportString.AppendStr("<td class='header'>Квота региона</td>");
    reportString.AppendStr("<td class='header'>ИНН организации</td>");
    reportString.AppendStr("<td class='header'>Организация</td>");
    reportString.AppendStr("<td class='header'>ФИО сотрудника</td>");
    reportString.AppendStr("<td class='header'>Должность сотрудника</td>");
    reportString.AppendStr("<td class='header'>Ссылка на сотрудника в базе</td>");
    reportString.AppendStr("<td class='header'>Дата отбора</td>");
    reportString.AppendStr("<td class='header'>Результат отбора</td>");
    reportString.AppendStr("<td class='header'>Дата трудоустройства</td>");
    reportString.AppendStr("<td class='header'>Дата увольнения</td>");
    reportString.AppendStr("<td class='header'>Тип трудоустройства</td>");
    reportString.AppendStr("<td class='header'>Тип подготовки</td>");
    reportString.AppendStr("<td class='header'>Основание</td>");
    reportString.AppendStr("<td class='header'>Направление подготовки</td>");
    reportString.AppendStr("<td class='header'>Статус</td>");
    reportString.AppendStr("<td class='header'>Дата присвоения</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 1</td>");
    reportString.AppendStr("<td class='header'>Дата начала</td>");
    reportString.AppendStr("<td class='header'>Дата завершения</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 2</td>");
    reportString.AppendStr("<td class='header'>Дата начала</td>");
    reportString.AppendStr("<td class='header'>Дата завершения</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 3</td>");
    reportString.AppendStr("<td class='header'>Дата начала</td>");
    reportString.AppendStr("<td class='header'>Дата завершения</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 4</td>");
    reportString.AppendStr("<td class='header'>Дата начала</td>");
    reportString.AppendStr("<td class='header'>Дата завершения</td>");
    reportString.AppendStr("<td class='header'>Непройденные программы подготовки</td>");
    reportString.AppendStr("<td class='header'>Номер сертификата</td>");
    reportString.AppendStr("<td class='header'>Прочие программы</td>");
    reportString.AppendStr("<td class='header'>Количество сертификаций РП</td>");
    reportString.AppendStr("<td class='header'>Результат последней сертификации</td>");
    reportString.AppendStr("<td class='header'>Успешность прохождения подготовки, %</td>");
    reportString.AppendStr("<td class='header'>Статус прохождения подготовки</td>");

    reportString.AppendStr("<td class='header'>ID квалификации</td>");
    reportString.AppendStr("</tr>");
}

if (LdsIsServer) {
    var agentId = 7235161744774528808;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7235161744774528808";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;
    var notFound = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        getReportHeader();

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT qas.id AS qas_id, " +
            "       doss.id AS dossier_id, " +
            "       rs.name AS doss_fact_region, " +
            "       kvota_rs.name AS reg_kvota, " +
            "       os.code AS doss_inn, " +
            "       os.name AS doss_org_name, " +
            "       doss.student_fullname, " +
            "       ps.name AS position_name, " +
            "       cs.fullname, " +
            "       doss.date_selection, " +
            "       doss.result_selection, " +
            "       doss.date_position, " +
            "       doss.dismiss_date, " +
            "       doss.type_position, " +
            "       qa.data.value('(//custom_elems/custom_elem[name=''f_l99s''])[1]/value[1]', 'varchar(max)') AS type_prep, " +
            "       qas.reason, " +
            "       q.name AS qual_name, " +
            "       CASE " +
            "           WHEN qas.status = 'assigned' THEN 'Присвоена' " +
            "           WHEN qas.status = 'not_assigned' THEN 'Неприсвоена' " +
            "           WHEN qas.status = 'in_process' THEN 'В процессе' " +
            "           WHEN qas.status = 'expired' THEN 'Истекла' " +
            "           ELSE '' END AS status, " +
            "       qas.expiration_date " +
            "   FROM [WTDB].[dbo].qualification_assignments qas " +
            "         INNER JOIN [WTDB].[dbo].qualification_assignment qa ON qas.id = qa.id " +
            "         INNER JOIN [WTDB].[dbo].collaborators cs ON qas.person_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
            "         INNER JOIN [WTDB].[dbo].cc_dossier_rcc_employees doss ON c.data.value('(//custom_elems/custom_elem[name=''dossier_id'']/value)[1]', 'bigint') = doss.id " +
            "         INNER JOIN [WTDB].[dbo].orgs os ON doss.subdivision_name = os.id " +
            "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS rs ON o.data.value('(//custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS kvota_rs ON qa.data.value('(//custom_elems/custom_elem[name=''f_qn4n''])[1]/value[1]', 'bigint') = kvota_rs.id " +
            "         INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "         LEFT JOIN [WTDB].[dbo].qualifications q ON qas.qualification_id = q.id " +
            " WHERE qas.qualification_id IN (7289051946840112569, 7195880997527743133) "));

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (data in dataList) {
            dossierDoc = tools.open_doc(OptInt(data.dossier_id));

            if(dossierDoc != undefined) {
                dossierDocTE = dossierDoc.TopElem;

                result1 = getUniqueEvents(dossierDocTE.rcc_rp_programs_m1s, "rcc_rp_programs_m1_id", 5);
                result2 = getUniqueEvents(dossierDocTE.rcc_rp_programs_m2s, "rcc_rp_programs_m2_id", 2);
                result3 = getUniqueEvents(dossierDocTE.rcc_rp_programs_m3s, "rcc_rp_programs_m3_id", 5);
                result4 = getUniqueEvents(dossierDocTE.rcc_rp_programs_m4s, "rcc_rp_programs_m4_id", 5);

                successRate = OptInt((result1.count + result2.count + result3.count + result4.count) * 100 / 16);

                state = "В процессе";

                if(result1.count == 0 && result2.count == 0 && result3.count == 0 && result4.count == 0) {
                    state = "Не начата";
                } else if(result1.count > 0 && result2.count > 0 && result3.count > 0 && result4.count > 0 && successRate >= 80) {
                    state = "Завершена";
                }

                // РП закладка
                reportString.AppendStr(
                    "<tr>" +
                    "<td>" + data.doss_fact_region + "</td>" +
                    "<td>" + data.reg_kvota + "</td>" +
                    "<td>" + data.doss_inn + "</td>" +
                    "<td>" + data.doss_org_name + "</td>" +
                    "<td>" + data.student_fullname + "</td>" +
                    "<td>" + data.position_name + "</td>" +
                    "<td>" + data.fullname + "</td>" +
                    "<td>" + StrDate(data.date_selection, false, false) + "</td>" +
                    "<td>" + data.result_selection + "</td>" +
                    "<td>" + StrDate(data.date_position, false, false) + "</td>" +
                    "<td>" + StrDate(data.dismiss_date, false, false) + "</td>" +
                    "<td>" + data.type_position + "</td>" +
                    "<td>" + data.type_prep + "</td>" +
                    "<td>" + data.reason + "</td>" +
                    "<td>" + data.qual_name + "</td>" +
                    "<td>" + data.status + "</td>" +
                    "<td>" + StrDate(data.expiration_date, false, false) + "</td>" +
                    "<td>" + result1.name + "</td>" +
                    "<td>" + StrDate(result1.start, true, false) + "</td>" +
                    "<td>" + StrDate(result1.finish, true, false) + "</td>" +
                    "<td>" + result2.name + "</td>" +
                    "<td>" + StrDate(result2.start, true, false) + "</td>" +
                    "<td>" + StrDate(result2.finish, true, false) + "</td>" +
                    "<td>" + result3.name + "</td>" +
                    "<td>" + StrDate(result3.start, true, false) + "</td>" +
                    "<td>" + StrDate(result3.finish, true, false) + "</td>" +
                    "<td>" + result4.name + "</td>" +
                    "<td>" + StrDate(result4.start, true, false) + "</td>" +
                    "<td>" + StrDate(result4.finish, true, false) + "</td>" +
                    "<td>" + getRPNotPassedEduMethods(dossierDocTE.collaborator_lists) + "</td>" +
                    "<td>" + getRPCertificateNumbers(dossierDocTE.rcc_rp_certificates) + "</td>" +
                    "<td>" + getRPOtherEvents(dossierDocTE.other_eventss) + "</td>" +
                    "<td>" + getRPEduMethodNames(dossierDocTE.collaborator_lists) + "</td>" +
                    "<td>" + getRPEventResultNames(dossierDocTE.collaborator_lists) + "</td>" +
                    "<td>" + successRate + "</td>" +
                    "<td>" + state + "</td>" +
                    "<td>'" + data.qas_id + "</td>" +
                    "</tr>");
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + data.id + " is not exist");

                skipped++;
            }

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            agent.notFound = notFound;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            if (processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }
        }

        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        //excel.SaveAs("E:/Websoft/Reports/report_not_tren_muc_com/report_not_tren_muc_com_" + ParseDate(Date()) + ".xlsx");
        excel.SaveAs("E:/Websoft/Reports/trash/qas_" + ParseDate(Date()) + ".xlsx");

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}