// 7389939808110063496
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getInstructorRules() {
    rules = [];

    rule = {};
    rule.id = 1;
    rule.resultField = "prog_result_7vidpoter";
    rule.dateField = "prog_date_7vidpoter";
    rule.certificateField = "sertificate_7vidpoter";
    rules.push(rule);
    rule = {};
    rule.id = 2;
    rule.resultField = "prog_result_5c";
    rule.dateField = "prog_date_5c";
    rule.certificateField = "number_sertificate_5c";
    rules.push(rule);
    rule = {};
    rule.id = 3;
    rule.resultField = "prog_result_rpu";
    rule.dateField = "prog_date_rpu";
    rule.certificateField = "number_sertificate_rpu";
    rules.push(rule);
    rule = {};
    rule.id = 4;
    rule.resultField = "prog_result_kart";
    rule.dateField = "prog_date_kart";
    rule.certificateField = "number_sertificate_kart";
    rules.push(rule);
    rule = {};
    rule.id = 5;
    rule.resultField = "prog_result_mrp";
    rule.dateField = "prog_date_mrp";
    rule.certificateField = "number_sertificate_mrp";
    rules.push(rule);
    rule = {};
    rule.id = 6;
    rule.resultField = "prog_result_pa";
    rule.dateField = "prog_date_pa";
    rule.certificateField = "number_sertificate_pa";
    rules.push(rule);

    return rules;
}

function getTrainerRules() {
    rules = [];

    rule = {};
    rule.id = 1;
    rule.resultField = "prog_result_obp";
    rule.dateField = "prog_date_obp";
    rule.certificateField = "number_sertificate_obp";
    rules.push(rule);
    rule = {};
    rule.id = 2;
    rule.resultField = "prog_result_rpu";
    rule.dateField = "prog_date_rpu";
    rule.certificateField = "number_sertificate_rpu";
    rules.push(rule);
    rule = {};
    rule.id = 3;
    rule.resultField = "prog_result_5c";
    rule.dateField = "prog_date_5c";
    rule.certificateField = "number_sertificate_5c";
    rules.push(rule);
    rule = {};
    rule.id = 4;
    rule.resultField = "prog_result_kart";
    rule.dateField = "prog_date_kart";
    rule.certificateField = "number_sertificate_kart";
    rules.push(rule);
    rule = {};
    rule.id = 5;
    rule.resultField = "prog_result_pa";
    rule.dateField = "prog_date_pa";
    rule.certificateField = "number_sertificate_pa";
    rules.push(rule);
    rule = {};
    rule.id = 6;
    rule.resultField = "prog_result_sr";
    rule.dateField = "prog_date_sr";
    rule.certificateField = "number_sertificate_sr";
    rules.push(rule);
    rule = {};
    rule.id = 7;
    rule.resultField = "prog_result_smed";
    rule.dateField = "prog_date_smed";
    rule.certificateField = "number_sertificate_smed";
    rules.push(rule);
    rule = {};
    rule.id = 8;
    rule.resultField = "prog_result_ao";
    rule.dateField = "prog_date_ao";
    rule.certificateField = "number_sertificate_ao";
    rules.push(rule);
    rule = {};
    rule.id = 9;
    rule.resultField = "prog_result_oee";
    rule.dateField = "prog_date_oee";
    rule.certificateField = "number_sertificate_oee";
    rules.push(rule);
    rule = {};
    rule.id = 10;
    rule.resultField = "prog_result_mrp";
    rule.dateField = "prog_date_mrp";
    rule.certificateField = "number_sertificate_mrp";
    rules.push(rule);
    rule = {};
    rule.id = 11;
    rule.resultField = "prog_result_iz";
    rule.dateField = "prog_date_iz";
    rule.certificateField = "number_sertificate_iz";
    rules.push(rule);

    return rules;
}

var iRules = getInstructorRules();
var trRules = getTrainerRules();

function getInstructorRule(id) {
    for(rule in iRules) {
        if(rule.id == id) {

            return rule;
        }
    }

    return null;
}

function getTrainerRule(id) {
    for(rule in trRules) {
        if(rule.id == id) {

            return rule;
        }
    }

    return null;
}

function isValidCertificate(certificateProgram, certificateNumber, dossierCertificate, certificateDate, dossierDate, dossierResult) {
    if (StrUpperCase(dossierResult) == "НЕ УСТАНОВЛЕНО" || StrUpperCase(dossierResult) == "НЕ СЕРТИФИЦИРОВАН") {
        return true;
    }

    if (StrUpperCase(dossierResult) == "НЕ ЯВКА") {
        // NEW CASE
        if(dossierDate == null) {
            return true;
        }

        if(Date(dossierDate) <= Date(certificateDate)) {
            return true;
        }
    }

    if(dossierDate == null && dossierCertificate == "") {
        return true;
    }

    if(StrUpperCase(dossierResult) == "СЕРТИФИЦИРОВАН" && dossierCertificate == "") {
        // FIX MISSED CERTIFICATE NUMBER
        return true;
    }

    return certificateNumber == dossierCertificate;
}

function processing(certification, type) {
    certificationDoc = tools.open_doc(certification.id);

    if(certificationDoc != undefined) {
        certificationDocTE = certificationDoc.TopElem;

        isSaved = false;
        isSkipped = false;

        dossierList = ArrayDirect(XQuery("sql:" +
            " SELECT id" +
            " FROM [WTDB].[dbo].cc_trainers_for_reports" +
            " WHERE trainer_id = " + certification.object_id +
            " AND trainer_type IN ('ИБП', 'ВТ')"));

        dossiersCount = ArrayCount(dossierList);

        if (dossiersCount == 1) {
            dossierDoc = tools.open_doc(dossierList[0].id);

            if (dossierDoc != null) {
                dossierDocTE = dossierDoc.TopElem;

                for (programId = 1; programId <= 11; programId++) {
                    if (certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value != "") {
                        certificateId = certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value;

                        certificateDoc = tools.open_doc(certificateId);

                        if (certificateDoc != undefined) {
                            certificateDocTE = certificateDoc.TopElem;

                            certificateResult = certificationDocTE.custom_elems.ObtainChildByKey("result_" + programId).value;
                            certificateDate = certificationDocTE.custom_elems.ObtainChildByKey("date_" + programId).value;
                            certificateNumber = certificateDocTE.serial + "-" + certificateDocTE.number + "/" + Year(Date(certificateDocTE.delivery_date));
                            certificateProgram = certificateDocTE.custom_elems.ObtainChildByKey("programm_name").value;

                            rule = null;

                            if (type == "INSTRUCTOR") {
                                rule = getInstructorRule(programId);
                            } else {
                                rule = getTrainerRule(programId);
                            }

                            if (rule != null) {
                                dossierResult = eval('dossierDocTE.' + rule.resultField);
                                dossierDate = eval('dossierDocTE.' + rule.dateField);
                                dossierCertificate = eval('dossierDocTE.' + rule.certificateField);

                                if(isValidCertificate(certificateProgram, certificateNumber, dossierCertificate, certificateDate, dossierDate, dossierResult)) {
                                    if(dossierCertificate == "") {
                                        eval("dossierDocTE." + rule.resultField + "='сертифицирован';");
                                        eval("dossierDocTE." + rule.dateField + "=Date('" + certificateDate + "');");
                                        eval("dossierDocTE." + rule.certificateField + "='" + certificateNumber + "';");

                                        isSaved = true;
                                    }
                                } else {
                                    htmlCode.AppendStr(
                                        "<tr>" +
                                        "<td>'" + certification.id + "</td>" +
                                        "<td>'" + dossierDocTE.id + "</td>" +
                                        "<td>'" + certification.object_id + "</td>" +
                                        "<td>" + certificateProgram + "</td>" +
                                        "<td>" + certificateDate + " | " + dossierDate + "</td>" +
                                        "<td>" + certificateNumber + " | " + dossierCertificate + "</td>" +
                                        "<td></td>" +
                                        "</tr>");

                                    isSkipped = true;
                                }
                            }
                        } else {
                            addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate with ID " + certificateId + " not exist! Person.ID=" + certification.object_id);
                            notFound++;
                        }
                    }
                }

                if (isSaved) {
                    dossierDoc.Save();

                    saved++;
                }
                if (isSkipped) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Certification.ID " + certification.id + " Dossier.ID=" + dossierDocTE.id + " was skipped");

                    skipped++;
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier person ID " + certification.object_id + " not found");

                message = "";

                for (programId = 1; programId <= 11; programId++) {
                    if (certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value != "") {
                        certificateId = certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value;

                        certificateDoc = tools.open_doc(certificateId);

                        if (certificateDoc != undefined) {
                            certificateDocTE = certificateDoc.TopElem;

                            message += certificateDocTE.custom_elems.ObtainChildByKey("programm_name").value + "\n" +
                                certificateDocTE.serial + "-" + certificateDocTE.number + "/" + Year(Date(certificateDocTE.delivery_date)) + "\n" +
                                certificationDocTE.custom_elems.ObtainChildByKey("date_" + programId).value + "\n";
                        }
                    }
                }

                htmlCode.AppendStr(
                    "<tr>" +
                    "<td>'" + certification.id + "</td>" +
                    "<td></td>" +
                    "<td>'" + certification.object_id + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td>" + message + "</td>" +
                    "<td>Нет досье</td>" +
                    "</tr>");
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] User.ID= " + certification.object_id + " Dossiers.Count=" + dossiersCount);

            for(dossier in dossierList) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier.ID= " + dossier.id);
            }
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Certification with ID not " + certification.id + " not exist!");
    }
}

var agentId = 7389939808110063496;
var userId = curUserID;
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7389939808110063496";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var skipped = 0;
var saved = 0;
var notFound = 0;

var notExistDossier = 0;

var isSaved = false;
var isSkipped = false;

var htmlCode = new Binary();
var excelURL = "E:/Websoft/Reports/inner_trainers/dossier_" + ParseDate(Date()) + ".xlsx";
var excel = new ActiveXObject("Websoft.Office.Excel.Document");

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    htmlCode.AppendStr("<html><table border='1'>");
    htmlCode.AppendStr(
        "<tr>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 200px;'>ID сертификации</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 200px;'>ID досье</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 200px;'>Сотрудник</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 400px;'>Программа</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 200px;'>Дата (С | Д)</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 400px;'>Сертификат (С | Д)</td>" +
        "<td style='text-align: center; background-color: #baffa1; font-weight: bold; width: 200px;'>Сообщение</td>" +
        "</tr>");

    instructorCertification = ArrayDirect(XQuery( "sql:" +
        " SELECT ods.id, ods.object_id" +
        " FROM [WTDB].[dbo].object_datas AS ods" +
        " INNER JOIN [WTDB].[dbo].collaborators AS colls ON ods.object_id = colls.id" +
        " WHERE ods.object_data_type_id = 6966499755925068211"));

    trainerCertification = ArrayDirect(XQuery( "sql:" +
        " SELECT ods.id, ods.object_id" +
        " FROM [WTDB].[dbo].object_datas AS ods" +
        " INNER JOIN [WTDB].[dbo].collaborators AS colls ON ods.object_id = colls.id" +
        " WHERE ods.object_data_type_id = 7057466522817022402"));

    total = ArrayCount(instructorCertification) + ArrayCount(trainerCertification);

    agent.refreshChart = 1;
    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (certification in instructorCertification) {
        processing(certification, "INSTRUCTOR");

        processed++;

        if (processed % 100 == 0) {
            agent.processed = processed;
            agent.saved = saved;
            agent.skipped = skipped;
            agent.notFound = notFound;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    for (certification in trainerCertification) {
        processing(certification, "TRAINER");

        processed++;

        if (processed % 100 == 0) {
            agent.processed = processed;
            agent.saved = saved;
            agent.skipped = skipped;
            agent.notFound = notFound;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if(processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    agent.refreshChart = 1;
    agent.processed = processed;
    agent.skipped = skipped;
    agent.saved = saved;
    agent.notFound = notFound;
    agent.handlingTimeTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Сохранение файла...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    htmlCode.AppendStr("</table></html>");
    excel.LoadHtmlString(htmlCode.GetStr(), "");
    excel.SaveAs(excelURL);

    agent.state = 1;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Сервер | Закончено. Продолжительность " + duration;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
        processed  + " processed",
        saved + " saved,",
        skipped + " skipped."
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );
}  catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    saveMonitorAgents(agent, startDate);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
