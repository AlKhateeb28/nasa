// 7133563756352591141
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getEventData(eventResultId) {
    result = {};
    result.eventResult = "";
    result.finishDate = "";
    result.certificateDate = "";

    resultList = ArrayDirect(XQuery("sql: " +
        " SELECT es.finish_date, " +
        "   er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') AS event_result, " +
        "   er.data.value('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]', 'varchar(max)') AS cert_date " +
        " FROM [WTDB].[dbo].event_results ers " +
        "   INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        "   INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
        " WHERE ers.id = " + eventResultId));

    if(ArrayCount(resultList) > 0) {
        result.eventResult = resultList[0].finish_date;

        if(resultList[0].cert_date != "") {
            result.certificateDate = StrDate(Date(resultList[0].cert_date), false, false);
        }

        if(resultList[0].finish_date != "") {
            result.finishDate = StrDate(resultList[0].finish_date, false, false);
        }
    }

    return result;
}

function getCertificateNumber(certificateId) {
    certificateDoc = tools.open_doc(certificateId);

    if(certificateDoc != undefined) {
        return certificateDoc.TopElem.number;
    } else {
        return "";
    }
}

function getCertificationData(eventResultId) {
    result = {};
    result.certificateResult = "";
    result.certificateDate = "";

    resultList = ArrayDirect(XQuery("sql: " +
        " SELECT er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') AS sert_result, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]', 'varchar(max)') AS cert_date " +
        " FROM [WTDB].[dbo].event_results ers " +
        "    INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        " WHERE ers.id = " + eventResultId));

    if(ArrayCount(resultList) > 0) {
        result.certificateResult = resultList[0].sert_result;

        if(resultList[0].cert_date != "") {
            result.certificateDate = StrDate(Date(resultList[0].cert_date), false, false);
        }
    }

    return result;
}

if (LdsIsServer) {
    var agentId = 7133563756352591141;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7133563756352591141";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var skipped = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ds.id, " +
            "       ds.subdivision_inn AS inn, " +
            "       os.name AS org_name, " +
            "       ds.student_fullname AS fio, " +
            "       cs.fullname AS student_name, " +
            "       ds.student_position, " +
            "       ds.date_selection, " +
            "       ds.result_selection, " +
            "       ds.date_position, " +
            "       ds.type_position, " +
            "       d.data.value('(//dismiss_date)[1]', 'date') AS dismiss_date, " +
            "       d.data.value('(//ock_rp_internship)[1]', 'varchar(max)') AS internship_rp, " +
            "       d.data.value('(//ock_rp_curator_fullname)[1]', 'varchar(max)') AS curator_name_rp, " +
            "       IIF(d.data.exist('(//ock_rp_qualification)') = 0, 'Нет', 'Да') AS cs_flag, " +
            "       d.data.value('(//ock_rp_certification)[1]', 'varchar(max)') AS cert_id, " +
            "       IIF(d.data.exist('(//ock_tren_qualification)') = 0, 'Нет', 'Да') AS tren_flag, " +
            "       d.data.value('(//ock_am_internship)[1]', 'varchar(max)') AS internship_am, " +
            "       d.data.value('(//ock_ap_curator_fullname)[1]', 'varchar(max)') AS curator_name_am, " +
            "       IIF(d.data.exist('(//ock_rp_qualification)') = 0, 'Нет', 'Да') AS am_flag " +
            " FROM [WTDB].[dbo].cc_dossier_rcc_employees ds " +
            "         INNER JOIN [WTDB].[dbo].cc_dossier_rcc_employee d ON ds.id = d.id " +
            "         LEFT JOIN [WTDB].[dbo].orgs os ON ds.subdivision_inn = os.code " +
            "         LEFT JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "         LEFT JOIN [WTDB].[dbo].collaborators cs ON ds.student_id = cs.id " +
            " WHERE o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') = 1 " +
            " ORDER BY fio  "));

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("<html>");
        reportString.AppendStr("<style>");
        reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 150px;}");
        reportString.AppendStr(".row_height {height: 25px;}");
        reportString.AppendStr(".column_grey {background-color: #ececec;}");
        reportString.AppendStr(".align-center {text-align: center;}");
        reportString.AppendStr("th { position: sticky; top: 0; }");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<th class='header'>ID</th>");
        reportString.AppendStr("<th class='header'>ИНН</th>");
        reportString.AppendStr("<th class='header' style='width: 500px'>Организация</th>");
        reportString.AppendStr("<th class='header' style='width: 200px'>ФИО</th>");
        reportString.AppendStr("<th class='header'>Ссылка на сотрудника</th>");
        reportString.AppendStr("<th class='header' style='width: 200px;'>Должность</th>");
        reportString.AppendStr("<th class='header'>Дата отбора</th>");
        reportString.AppendStr("<th class='header'>Результат отбора</th>");
        reportString.AppendStr("<th class='header'>Дата трудостройства</th>");
        reportString.AppendStr("<th class='header'>Тип трудостройства</th>");
        reportString.AppendStr("<th class='header'>Рекомендован на подготовку</th>");
        reportString.AppendStr("<th class='header'>Дата увольнения</th>");
        reportString.AppendStr("<th class='header'>РП Модуль 1</th>");
        reportString.AppendStr("<th class='header'>РП Модуль 2</th>");
        reportString.AppendStr("<th class='header'>РП Модуль 3</th>");
        reportString.AppendStr("<th class='header'>Дата аттестации РП</th>");
        reportString.AppendStr("<th class='header'>Результат аттестации РП</th>");
        reportString.AppendStr("<th class='header'>Удостоверение РП</th>");
        reportString.AppendStr("<th class='header'>Стажировка РП</th>");
        reportString.AppendStr("<th class='header'>ФИО наставника</th>");
        reportString.AppendStr("<th class='header'>Квалификация РП ОЦК</th>");
        reportString.AppendStr("<th class='header'>Результат сертификации РП</th>");
        reportString.AppendStr("<th class='header'>Дата сертификации РП</th>");
        reportString.AppendStr("<th class='header'>Номер сертификата РП</th>");
        reportString.AppendStr("<th class='header'>Тренер Модуль 1</th>");
        reportString.AppendStr("<th class='header'>Квалификация Тренер ОЦК</th>");
        reportString.AppendStr("<th class='header'>Сертификаты Тренера ОЦК</th>");
        reportString.AppendStr("<th class='header'>АМ Модуль 1</th>");
        reportString.AppendStr("<th class='header'>АМ Модуль 2</th>");
        reportString.AppendStr("<th class='header'>АМ Модуль 3</th>");
        reportString.AppendStr("<th class='header'>АМ Модуль 4</th>");
        reportString.AppendStr("<th class='header'>Дата аттестации АМ</th>");
        reportString.AppendStr("<th class='header'>Результат аттестации АМ</th>");
        reportString.AppendStr("<th class='header'>Удостоверение АМ</th>");
        reportString.AppendStr("<th class='header'>Стажировка АМ</th>");
        reportString.AppendStr("<th class='header'>ФИО наставника</th>");
        reportString.AppendStr("<th class='header'>Квалификация АМ ОЦК</th>");
        reportString.AppendStr("<th class='header'>Результат сертификации РП</th>");
        reportString.AppendStr("<th class='header'>Дата сертификации РП</th>");
        reportString.AppendStr("<th class='header'>Номер сертификата РП</th>");
        reportString.AppendStr("<th class='header'>Прочие мероприятия</th>");


        reportString.AppendStr("</tr>");

        reportString.AppendStr("<tr>");
        for(i = 1; i <= 41; i++) {
            reportString.AppendStr("<td style='text-align: center; font-weight: bold;'>" + i + "</td>");
        }
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            dossierDoc = tools.open_doc(data.id);

            if(dossierDoc != undefined) {
                dossierDocTE = dossierDoc.TopElem;
                typeValue = "";

                for(type in dossierDoc.TopElem.training_type) {
                    typeValue += type.value + ", ";
                }

                if(StrCharCount(typeValue) > 0) {
                    typeValue = StrCharRangePos(typeValue, 0, StrCharCount(typeValue) - 2);
                }

                reportString.AppendStr("<tr>");
                reportString.AppendStr("<td>'" + data.id + "</td>");
                reportString.AppendStr("<td>" + data.inn + "</td>");
                reportString.AppendStr("<td>" + data.org_name + "</td>");
                reportString.AppendStr("<td>" + data.fio + "</td>");
                reportString.AppendStr("<td>'" + data.student_name + "</td>");
                reportString.AppendStr("<td>'" + data.student_position + "</td>");
                reportString.AppendStr("<td class='align-center'>" + StrDate(data.date_selection, false, false) + "</td>");
                reportString.AppendStr("<td>'" + data.result_selection + "</td>");
                reportString.AppendStr("<td>" + StrDate(data.date_position, false, false) + "</td>");
                reportString.AppendStr("<td>'" + data.type_position + "</td>");
                reportString.AppendStr("<td>" + typeValue + "</td>");
                reportString.AppendStr("<td class='align-center'>" + (data.dismiss_date == "" ? "" : StrDate(Date(data.dismiss_date), false, false)) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_rp_programs_m1s) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_rp_programs_m2s) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_rp_programs_m3s) + "</td>");

                if(data.id == 7130033509317443225) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] ock_rp_review: " + dossierDocTE.ock_rp_review);
                }

                if(dossierDocTE.ock_rp_review != "") {
                    eventResultData = getEventData(OptInt(dossierDocTE.ock_rp_review));
                    reportString.AppendStr("<td class='align-center'>" + eventResultData.finishDate + "</td>");
                    reportString.AppendStr("<td>" + eventResultData.eventResult + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                    reportString.AppendStr("<td></td>");
                }

                if(dossierDocTE.ock_rp_document != "") {
                    reportString.AppendStr("<td>" + getCertificateNumber(OptInt(dossierDocTE.ock_rp_document)) + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                }

                reportString.AppendStr("<td>" + data.internship_rp + "</td>");
                reportString.AppendStr("<td>" + data.curator_name_rp + "</td>");
                reportString.AppendStr("<td class='align-center'>" + data.cs_flag + "</td>");

                if(dossierDocTE.ock_rp_certification != "") {
                    eventResultData = getEventData(OptInt(dossierDocTE.ock_rp_certification));
                    reportString.AppendStr("<td>" + eventResultData.eventResult + "</td>");
                    reportString.AppendStr("<td class='align-center'>" + eventResultData.certificateDate + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                    reportString.AppendStr("<td></td>");
                }

                if(dossierDocTE.ock_rp_certificate_id != "") {
                    reportString.AppendStr("<td>" + getCertificateNumber(OptInt(dossierDocTE.ock_rp_certificate_id)) + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                }

                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_tren_programss) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + data.tren_flag + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_tren_certificates) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_am_programs_m1s) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_am_programs_m2s) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_am_programs_m3s) + "</td>");
                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.ock_am_programs_m4s) + "</td>");

                if(dossierDocTE.ock_am_reviews != "") {
                    eventResultData = getEventData(OptInt(dossierDocTE.ock_am_reviews));
                    reportString.AppendStr("<td>" + eventResultData.eventResult + "</td>");
                    reportString.AppendStr("<td class='align-center'>" + eventResultData.certificateDate + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                    reportString.AppendStr("<td></td>");
                }


                if(dossierDocTE.ock_am_documents != "") {
                    reportString.AppendStr("<td>" + getCertificateNumber(OptInt(dossierDocTE.ock_am_documents)) + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                }

                reportString.AppendStr("<td>" + data.internship_am + "</td>");
                reportString.AppendStr("<td>" + data.curator_name_am + "</td>");
                reportString.AppendStr("<td class='align-center'>" + data.am_flag + "</td>");

                if(dossierDocTE.ock_am_certification != "") {
                    eventResultData = getCertificationData(OptInt(dossierDocTE.ock_am_certification));
                    reportString.AppendStr("<td>" + eventResultData.certificateResult + "</td>");
                    reportString.AppendStr("<td class='align-center'>" + eventResultData.certificateDate + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                    reportString.AppendStr("<td></td>");
                }

                if(dossierDocTE.ock_am_certificate != "") {
                    reportString.AppendStr("<td>" + getCertificateNumber(OptInt(dossierDocTE.ock_am_certificate)) + "</td>");
                } else {
                    reportString.AppendStr("<td></td>");
                }

                reportString.AppendStr("<td class='align-center'>" + ArrayCount(dossierDocTE.other_eventss) + "</td>");

                reportString.AppendStr("</tr>");
            } else {
                skipped++;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + data.id + " is not exist!");
            }

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
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
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/report_ock_2025/report_ock_module_" + ParseDate(Date()) + ".xlsx");

        agent.state = 1;
        agent.processed = processed;
        agent.skipped = skipped;
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
            null,
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