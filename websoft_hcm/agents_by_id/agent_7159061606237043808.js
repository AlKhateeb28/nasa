// 7159061606237043808
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getQualificationAssignmentData(id) {
    result = {};

    result.qualification = "";
    result.year = "";
    result.region = "";

    if(id != null) {
        qualificationDoc = tools.open_doc(id);

        if(qualificationDoc != undefined) {
            qualificationDocTE = qualificationDoc.TopElem;

            result.qualification = qualificationDocTE.custom_elems.ObtainChildByKey("f_l99s").value;

            if(qualificationDocTE.assignment_date != null) {
                result.year = Year(qualificationDocTE.assignment_date);
            }

            if(qualificationDocTE.custom_elems.ObtainChildByKey("f_qn4n").value != "") {
                regionDoc = tools.open_doc(OptInt(qualificationDocTE.custom_elems.ObtainChildByKey("f_qn4n").value));

                if(regionDoc != undefined) {
                    result.region = regionDoc.TopElem.name;
                } else {
                    result.region = "Не найден";
                }
            }
        } else {
            result.qualification = "Не найдена";
        }
    } else {
        result.qualification = "Нет";
    }

    return result;
}

if (LdsIsServer) {
    var agentId = 7159061606237043808;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7159061606237043808";
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
            " SELECT rs.name AS fact_region_name, " +
            "       doss.subdivision_inn AS inn, " +
            "       os.name AS org_name, " +
            "       doss.student_fullname AS doss_fullname, " +
            "       cs.fullname AS fullname, " +
            "       ps.name AS position_name, " +
            "       doss.date_selection, " +
            "       doss.result_selection, " +
            "       doss.date_position, " +
            "       doss.type_position, " +
            "       '' AS training_type, " +
            "       doss.dismiss_date, " +
            "       doss.rcc_rp_internship AS intership, " +
            "       doss.curator_fullname, " +
            "       er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') AS event_result, " +
            "       er.data.value('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]', 'varchar(max)') AS cert_date, " +
            "       doss.id " +
            " FROM [WTDB].[dbo].cc_dossier_rcc_employees doss " +
            "    INNER JOIN [WTDB].[dbo].cc_dossier_rcc_employees dos ON doss.id = dos.id " +
            "    LEFT JOIN [WTDB].[dbo].collaborators cs ON doss.student_id = cs.id " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON doss.subdivision_name = os.id " +
            "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'bit') = 1 " +
            "    INNER JOIN [WTDB].[dbo].regions rs ON o.data.value('(//custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
            "    LEFT JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "    LEFT JOIN [WTDB].[dbo].event_results ers ON doss.rcc_rp_cert = ers.id " +
            "    LEFT JOIN [WTDB].[dbo].event_result er ON ers.id = er.id "));

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
        reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
        reportString.AppendStr(".row_height {height: 2px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='header'>Фактический регион</td>");
        reportString.AppendStr("<td class='header'>ИНН</td>");
        reportString.AppendStr("<td class='header' style='width: 400px;'>Организация</td>");
        reportString.AppendStr("<td class='header' style='width: 400px;'>ФИО</td>");
        reportString.AppendStr("<td class='header'>Ссылка на сотрудника в базе</td>");
        reportString.AppendStr("<td class='header'>Должность</td>");
        reportString.AppendStr("<td class='header'>Дата отбора</td>");
        reportString.AppendStr("<td class='header'>Результат отбора</td>");
        reportString.AppendStr("<td class='header'>Дата трудоустройства</td>");
        reportString.AppendStr("<td class='header'>Тип трудоустройства</td>");
        reportString.AppendStr("<td class='header'>Рекомендован на подготовку</td>");
        reportString.AppendStr("<td class='header'>Дата увольнения</td>");
        reportString.AppendStr("<td class='header'>Подготовка РП Модуль1</td>");
        reportString.AppendStr("<td class='header'>Подготовка РП Модуль2</td>");
        reportString.AppendStr("<td class='header'>Подготовка РП Модуль3</td>");
        reportString.AppendStr("<td class='header'>Подготовка РП Модуль4</td>");
        reportString.AppendStr("<td class='header'>Стажировка РП</td>");
        reportString.AppendStr("<td class='header'>ФИО наставника</td>");
        reportString.AppendStr("<td class='header'>Результат сертификации РП</td>");
        reportString.AppendStr("<td class='header'>Дата сертификации РП</td>");
        reportString.AppendStr("<td class='header'>Квалификация РП РЦК</td>");
        reportString.AppendStr("<td class='header'>Год квалификации РП</td>");
        reportString.AppendStr("<td class='header'>Подготовился РП по квоте региона</td>");
        reportString.AppendStr("<td class='header'>Сертификаты РП РЦК</td>");
        reportString.AppendStr("<td class='header'>Подготовка Тренера РЦК</td>");
        reportString.AppendStr("<td class='header'>Квалификация Тренера РЦК</td>");
        reportString.AppendStr("<td class='header'>Год квалификации ТР</td>");
        reportString.AppendStr("<td class='header'>Подготовился ТР по квоте региона</td>");
        reportString.AppendStr("<td class='header'>Сертификаты Тренера РЦК</td>");
        reportString.AppendStr("<td class='header'>Подготовка Консультанта ДЦ РЦК</td>");
        reportString.AppendStr("<td class='header'>Квалификация Консультант ДЦ РЦК</td>");
        reportString.AppendStr("<td class='header'>Год квалификации ДЦ</td>");
        reportString.AppendStr("<td class='header'>Подготовился ДЦ по квоте региона</td>");
        reportString.AppendStr("<td class='header'>Сертификаты Консультанта по ДЦ РЦК</td>");
        reportString.AppendStr("<td class='header'>Подготовка Консультанта УИ РЦК</td>");
        reportString.AppendStr("<td class='header'>Квалификация Консультант УИ РЦК</td>");
        reportString.AppendStr("<td class='header'>Год квалификации УИ</td>");
        reportString.AppendStr("<td class='header'>Подготовился УИ по квоте региона</td>");
        reportString.AppendStr("<td class='header'>Сертификаты Консультанта по УИ РЦК</td>");
        reportString.AppendStr("<td class='header'>Прочие мероприятия</td>");
        reportString.AppendStr("</tr>");

        for (data in dataList) {
            dossierDoc = tools.open_doc(data.id);

            if(dossierDoc != undefined) {
                dossierDocTE = dossierDoc.TopElem;

                reportString.AppendStr("<tr>");
                // Фактический регион
                reportString.AppendStr("<td>" + data.fact_region_name + "</td>");
                // ИНН
                reportString.AppendStr("<td>" + data.inn + "</td>");
                // Организация
                reportString.AppendStr("<td>" + data.org_name + "</td>");
                // ФИО
                reportString.AppendStr("<td>" + data.doss_fullname + "</td>");
                // Ссылка на сотрудника в базе
                reportString.AppendStr("<td>" + data.fullname + "</td>");
                // Должность
                reportString.AppendStr("<td>" + data.position_name + "</td>");
                // Дата отбора
                reportString.AppendStr("<td>" + (data.date_selection == null ? "" : StrDate(data.date_selection, false, false)) + "</td>");
                // Результат отбора
                reportString.AppendStr("<td>" + data.result_selection + "</td>");
                // Дата трудоустройства
                reportString.AppendStr("<td>" + (data.date_position == null ? "" : StrDate(data.date_position, false, false)) + "</td>");
                // Тип трудоустройства
                reportString.AppendStr("<td>" + data.type_position + "</td>");

                typeValue = "";

                for(type in dossierDocTE.training_type) {
                    typeValue += type.value + ", ";
                }

                if(StrCharCount(typeValue) > 0) {
                    typeValue = StrCharRangePos(typeValue, 0, StrCharCount(typeValue) - 2);
                }

                // Рекомендован на подготовку
                reportString.AppendStr("<td>" + typeValue + "</td>");
                // Дата увольнения
                reportString.AppendStr("<td>" + (data.dismiss_date == null ? "" : StrDate(data.dismiss_date, false, false)) + "</td>");
                // Подготовка РП Модуль1
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_rp_programs_m1s) + "</td>");
                // Подготовка РП Модуль2
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_rp_programs_m2s) + "</td>");
                // Подготовка РП Модуль3
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_rp_programs_m3s) + "</td>");
                // Подготовка РП Модуль4
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_rp_programs_m4s) + "</td>");
                // Стажировка РП
                reportString.AppendStr("<td>" + data.intership + "</td>");
                // ФИО наставника
                reportString.AppendStr("<td>" + data.curator_fullname + "</td>");
                // Результат сертификации РП
                reportString.AppendStr("<td>" + data.event_result + "</td>");
                // Дата сертификации РП
                reportString.AppendStr("<td>" + (data.cert_date == "" ? "" : StrDate(Date(data.cert_date), false, false)) + "</td>");
                // Квалификация РП РЦК
                qualificationResult =  getQualificationAssignmentData(dossierDocTE.rcc_pr_qualification);

                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.qualification + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.year + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.region + "</td>");
                // Сертификаты РП РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_rp_certificates) + "</td>");
                // Подготовка Тренера РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_tren_programss) + "</td>");
                // Квалификация Тренера РЦК
                qualificationResult =  getQualificationAssignmentData(dossierDocTE.rcc_tren_qualification);

                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.qualification + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.year + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.region + "</td>");
                // Сертификаты Тренера РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_tren_certificates) + "</td>");
                // Подготовка Консультанта ДЦ РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_dc_programss) + "</td>");
                // Квалификация Консультант ДЦ РЦК
                qualificationResult =  getQualificationAssignmentData(dossierDocTE.rcc_dc_qualification);

                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.qualification + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.year + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.region + "</td>");
                // Сертификаты Консультанта по ДЦ РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_dc_certificates) + "</td>");
                // Подготовка Консультанта УИ РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_ui_programss) + "</td>");
                // Квалификация Консультант УИ РЦК
                qualificationResult =  getQualificationAssignmentData(dossierDocTE.rcc_ui_qualification);

                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.qualification + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.year + "</td>");
                reportString.AppendStr("<td style='text-align: center;'>" + qualificationResult.region + "</td>");
                // Сертификаты Консультанта по УИ РЦК
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.rcc_ui_certificates) + "</td>");
                // Прочие мероприятия
                reportString.AppendStr("<td style='text-align: center;'>" + ArrayCount(dossierDocTE.other_eventss) + "</td>");
                reportString.AppendStr("</tr>");
            } else {
                skipped++;
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
        excel.SaveAs("E:/Websoft/Reports/report_rck_2025/report_dossier_rck_" + ParseDate(Date()) + ".xlsx");

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