// 7389214479898473355
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}
function getMismatchWebsocketClient(){try{return new WebSocketClient("ws://192.168.0.96:3000/");}catch(e){}}function getMismatchInstance(agentId) {mismatch={};mismatch.id=agentId;mismatch.type = "MISMATCH";mismatch.dateTime=Date();mismatch.count=0;mismatch.state=0;return mismatch;}function sendMismatchMessageToWebsocket(ws, mismatch) {try{ws.Send("#"+EncodeJson(mismatch));return ws;}catch(e){return null;}}

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

function getEducationMethodsFromDts() {
    try {
        sqlQuery = " SELECT doss.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , doss.programs, doss.num_trainings AS doss_count"+
            " INTO _view_dossier" +
            " FROM [WTDB].[dbo].[cc_dossier_subsidized_traineds] AS doss" +
            " INNER JOIN [WTDB].[dbo].event_results AS evrs ON doss.student_id = evrs.person_id AND evrs.is_assist = 1" +
            " INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id AND evs.education_method_id IS NOT NULL" +
            " INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            " INNER JOIN [WTDB].[dbo].event_result_types AS evrts ON evrs.event_result_type_id = evrts.id" +
            " AND (UPPER(evrts.code) = UPPER('std_event_result') OR evrts.code IS NULL)" +
            " GROUP BY doss.id, evs.education_method_id, evrs.person_id, edms.name , doss.programs, doss.num_trainings;" +
            " " +
            " SELECT _view1.id, edm_name = STUFF (" +
            " (SELECT ';' + edm_name" +
            " FROM _view_dossier AS _view2" +
            " WHERE _view2.id = _view1.id" +
            " ORDER BY edm_name" +
            " FOR XML PATH ('')" +
            " ), 1, 1, '')," +
            " COUNT(_view1.id) as edm_count," +
            " _view1.programs as programs," +
            " _view1.doss_count," +
            " _view1.person_id" +
            " INTO _view_result" +
            " FROM _view_dossier _view1" +
            " GROUP BY _view1.id, programs, doss_count, person_id" +
            " HAVING doss_count < COUNT(_view1.id)" +
            " ORDER BY id; SELECT * FROM _view_result; DROP TABLE _view_dossier; DROP TABLE _view_result;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function getEducationMethodsFromDtRck() {
    try {
        sqlQuery = " SELECT doss.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , doss.programs, doss.num_trainings AS doss_count" +
            " INTO _view_dossier" +
            " FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs] AS doss" +
            " INNER JOIN [WTDB].[dbo].event_results AS evrs ON doss.student_id = evrs.person_id AND evrs.is_assist = 1" +
            " INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id" +
            " INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
            " INNER JOIN [WTDB].[dbo].education_orgs AS edorgs ON evs.education_org_id = edorgs.id AND edorgs.code = '7'" +
            " WHERE evs.education_method_id IS NOT NULL" +
            " GROUP BY doss.id, evs.education_method_id, evrs.person_id, edms.name , doss.programs, doss.num_trainings" +
            " " +
            " SELECT _view1.id, edm_name = STUFF (" +
            " (SELECT ';' + edm_name" +
            " FROM _view_dossier AS _view2" +
            " WHERE _view2.id = _view1.id" +
            " ORDER BY edm_name" +
            " FOR XML PATH ('')" +
            " ), 1, 1, '')," +
            " COUNT(_view1.id) as edm_count," +
            " _view1.programs as programs," +
            " _view1.doss_count," +
            " _view1.person_id" +
            " INTO _view_result" +
            " FROM _view_dossier _view1" +
            " GROUP BY _view1.id, programs, doss_count, person_id" +
            " HAVING doss_count < COUNT(_view1.id)" +
            " ORDER BY id; SELECT * FROM _view_result; DROP TABLE _view_dossier; DROP TABLE _view_result;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function eventBrokenLinks() {
    try {
        sqlQuery = "sql: " +
            " SELECT event_results.id" +
            " FROM event_results" +
            " LEFT JOIN events ON event_results.event_id = events.id" +
            " WHERE events.id IS NULL";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function collaboratorBrokenLinks() {
    try {
        sqlQuery = "sql: " +
            " SELECT event_results.id" +
            " FROM event_results" +
            " LEFT JOIN collaborators ON event_results.person_id = collaborators.id" +
            " WHERE collaborators.id IS NULL";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

function getSuspiciousColls() {
    suspiciousCount = 0;

    collaboratorList = ArrayDirect(XQuery("sql: " +
        "SELECT colls.id," +
        "   coll.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS lastname," +
        "   coll.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS firstname," +
        "   org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part," +
        "   org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') as is_rck," +
        "   org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') as is_roiv," +
        "   org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') as is_partner" +
        " FROM [WTDB].[dbo].collaborators AS colls" +
        "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id AND coll.data.value('(collaborator/access/web_banned)[1]', 'varchar(max)') != 1" +
        "   INNER JOIN [WTDB].[dbo].orgs AS orgs ON orgs.id = colls.org_id" +
        "   INNER JOIN [WTDB].[dbo].org AS org ON org.id = orgs.id" +
        " WHERE colls.login NOT LIKE '%_muc_%'"));

    for (collaborator in collaboratorList) {
        if(collaborator.format_part == null || collaborator.format_part == "false" || collaborator.is_rck == "true" || collaborator.is_roiv == "true" || collaborator.is_partner == "true") {
            isAddToGroup = false;

            if (StrCharCount(Trim(collaborator.firstname)) <= 1 || StrCharCount(Trim(collaborator.lastname)) <= 1) {
                isAddToGroup = true;
            } else if (OptReal(collaborator.firstname) != undefined || OptReal(collaborator.lastname) != undefined) {
                isAddToGroup = true;
            } else if (StrContains(collaborator.firstname, "@") || StrContains(collaborator.firstname, ".") || StrContains(collaborator.firstname, "_")
                || StrContains(collaborator.firstname, "=") || StrContains(collaborator.firstname, "*") || StrContains(collaborator.firstname, "+")
                || StrContains(collaborator.firstname, "\\") || StrContains(collaborator.firstname, "/") || StrContains(collaborator.firstname, "|")
                || StrContains(collaborator.firstname, "{") || StrContains(collaborator.firstname, "}") || StrContains(collaborator.firstname, "[")
                || StrContains(collaborator.firstname, "]") || StrContains(collaborator.firstname, ":") || StrContains(collaborator.firstname, "'")
                || StrContains(collaborator.firstname, "<") || StrContains(collaborator.firstname, ">") || StrContains(collaborator.firstname, ",")
                || StrContains(collaborator.firstname, "!") || StrContains(collaborator.firstname, "#") || StrContains(collaborator.firstname, "%")
                || StrContains(collaborator.firstname, "^") || StrContains(collaborator.firstname, "&") || StrContains(collaborator.firstname, "?")
                || StrContains(collaborator.firstname, "*") || StrContains(collaborator.firstname, "(") || StrContains(collaborator.firstname, ")")) {

                isAddToGroup = true;
            } else if (StrContains(collaborator.lastname, "@") || StrContains(collaborator.lastname, ".") || StrContains(collaborator.lastname, "_")
                || StrContains(collaborator.lastname, "*") || StrContains(collaborator.lastname, "+")
                || StrContains(collaborator.lastname, "\\") || StrContains(collaborator.lastname, "/") || StrContains(collaborator.lastname, "|")
                || StrContains(collaborator.lastname, "{") || StrContains(collaborator.lastname, "}") || StrContains(collaborator.lastname, "[")
                || StrContains(collaborator.lastname, "]") || StrContains(collaborator.lastname, ":") || StrContains(collaborator.lastname, "'")
                || StrContains(collaborator.lastname, "<") || StrContains(collaborator.lastname, ">") || StrContains(collaborator.lastname, ",")
                || StrContains(collaborator.lastname, "!") || StrContains(collaborator.lastname, "#") || StrContains(collaborator.lastname, "%")
                || StrContains(collaborator.lastname, "^") || StrContains(collaborator.lastname, "&") || StrContains(collaborator.lastname, "?")
                || StrContains(collaborator.lastname, "*") || StrContains(collaborator.lastname, "(") || StrContains(collaborator.lastname, ")")
                || StrContains(collaborator.lastname, "=")) {
                isAddToGroup = true;
            } else if (StrContains(collaborator.firstname, "q", true) || StrContains(collaborator.firstname, "w", true) || StrContains(collaborator.firstname, "e", true)
                || StrContains(collaborator.firstname, "r", true) || StrContains(collaborator.firstname, "t", true) || StrContains(collaborator.firstname, "y", true)
                || StrContains(collaborator.firstname, "u", true) || StrContains(collaborator.firstname, "i", true) || StrContains(collaborator.firstname, "o", true)
                || StrContains(collaborator.firstname, "p", true) || StrContains(collaborator.firstname, "a", true) || StrContains(collaborator.firstname, "s", true)
                || StrContains(collaborator.firstname, "d", true) || StrContains(collaborator.firstname, "f", true) || StrContains(collaborator.firstname, "g", true)
                || StrContains(collaborator.firstname, "h", true) || StrContains(collaborator.firstname, "j", true) || StrContains(collaborator.firstname, "k", true)
                || StrContains(collaborator.firstname, "l", true) || StrContains(collaborator.firstname, "z", true) || StrContains(collaborator.firstname, "x", true)
                || StrContains(collaborator.firstname, "c", true) || StrContains(collaborator.firstname, "v", true) || StrContains(collaborator.firstname, "b", true)
                || StrContains(collaborator.firstname, "n", true) || StrContains(collaborator.firstname, "m", true)) {

                isAddToGroup = true;
            } else if (StrContains(collaborator.lastname, "q", true) || StrContains(collaborator.lastname, "w", true) || StrContains(collaborator.lastname, "e", true)
                || StrContains(collaborator.lastname, "r", true) || StrContains(collaborator.lastname, "t", true) || StrContains(collaborator.lastname, "y", true)
                || StrContains(collaborator.lastname, "u", true) || StrContains(collaborator.lastname, "i", true) || StrContains(collaborator.lastname, "o", true)
                || StrContains(collaborator.lastname, "p", true) || StrContains(collaborator.lastname, "a", true) || StrContains(collaborator.lastname, "s", true)
                || StrContains(collaborator.lastname, "d", true) || StrContains(collaborator.lastname, "f", true) || StrContains(collaborator.lastname, "g", true)
                || StrContains(collaborator.lastname, "h", true) || StrContains(collaborator.lastname, "j", true) || StrContains(collaborator.lastname, "k", true)
                || StrContains(collaborator.lastname, "l", true) || StrContains(collaborator.lastname, "z", true) || StrContains(collaborator.lastname, "x", true)
                || StrContains(collaborator.lastname, "c", true) || StrContains(collaborator.lastname, "v", true) || StrContains(collaborator.lastname, "b", true)
                || StrContains(collaborator.lastname, "n", true) || StrContains(collaborator.lastname, "m", true)) {
                isAddToGroup = true;
            }

            if (isAddToGroup) {
                suspiciousCount++;
            }
        }
    }

    collaboratorList1 = ArrayDirect(XQuery("sql: " +
        " SELECT colls.id" +
        " FROM [WTDB].[dbo].collaborators AS colls" +
        "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id" +
        " WHERE UPPER(coll.data.value('(collaborator/firstname)[1]', 'varchar(max)')) LIKE '%ТЕСТ%'" +
        "   OR UPPER(coll.data.value('(collaborator/lastname)[1]', 'varchar(max)')) LIKE '%ТЕСТ%'"));

    suspiciousCount += ArrayCount(collaboratorList1);

    collaboratorList2 = ArrayDirect(XQuery("sql: " +
        " SELECT colls.id" +
        " FROM [WTDB].[dbo].collaborators AS colls" +
        "   INNER JOIN [WTDB].[dbo].collaborator AS coll ON coll.id = colls.id" +
        " WHERE UPPER(coll.data.value('(collaborator/firstname)[1]', 'varchar(max)')) LIKE '%TEST%'" +
        "   OR UPPER(coll.data.value('(collaborator/lastname)[1]', 'varchar(max)')) LIKE '%TEST%'"));

    suspiciousCount += ArrayCount(collaboratorList2);

    return suspiciousCount;
}

function isValidCertificate(certification, certificateNumber, dossierCertificate, certificateDate, dossierDate, dossierResult) {
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
        // NEW CASE
        return true;
    }

    return certificateNumber == dossierCertificate;
}

function processing(certification, type) {
    certificationDoc = tools.open_doc(certification.id);

    if(certificationDoc != undefined) {
        certificationDocTE = certificationDoc.TopElem;

        isSkipped = false;

        dossierList = ArrayDirect(XQuery("sql:" +
            " SELECT id" +
            " FROM [WTDB].[dbo].cc_trainers_for_reports" +
            " WHERE trainer_id = " + certification.object_id +
            " AND trainer_type IN ('ИБП', 'ВТ')"));

        dossiersCount = ArrayCount(dossierList);

        if(dossiersCount == 1) {
            dossierDoc = tools.open_doc(dossierList[0].id);

            if (dossierDoc != null) {
                dossierDocTE = dossierDoc.TopElem;

                for (programId = 1; programId <= 11; programId++) {
                    if (certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value != "") {
                        certificateId = certificationDocTE.custom_elems.ObtainChildByKey("certificate_" + programId).value;

                        certificateDoc = tools.open_doc(certificateId);

                        if (certificateDoc != undefined) {
                            certificateDocTE = certificateDoc.TopElem;

                            certificateDate = certificationDocTE.custom_elems.ObtainChildByKey("date_" + programId).value;
                            certificateNumber = certificateDocTE.serial + "-" + certificateDocTE.number + "/" + Year(Date(certificateDocTE.delivery_date));

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

                                if (!isValidCertificate(certification, certificateNumber, dossierCertificate, certificateDate, dossierDate, dossierResult)) {
                                    addLogMessage(loggerName, "[agent.id: " + agentId + "] ----- " + certification.id);

                                    isSkipped = true;
                                }
                            }
                        }
                    }
                }

                if (isSkipped) {
                    dossCertificatesCount++;
                }
            }
        }
    }
}

function getDossInstructors() {
    instructorCertification = ArrayDirect(XQuery( "sql:" +
        " SELECT ods.id, ods.object_id" +
        " FROM [WTDB].[dbo].object_datas AS ods" +
        " INNER JOIN [WTDB].[dbo].collaborators AS colls ON ods.object_id = colls.id" +
        " WHERE ods.object_data_type_id = 6966499755925068211"));

    dossCertificatesCount = 0;

    for (certification in instructorCertification) {
        processing(certification, "INSTRUCTOR");
    }
}

function getDossTrainers() {
    dossCertificatesCount = 0;

    trainerCertification = ArrayDirect(XQuery( "sql:" +
        " SELECT ods.id, ods.object_id" +
        " FROM [WTDB].[dbo].object_datas AS ods" +
        " INNER JOIN [WTDB].[dbo].collaborators AS colls ON ods.object_id = colls.id" +
        " WHERE ods.object_data_type_id = 7057466522817022402"));

    for (certification in trainerCertification) {
        processing(certification, "TRAINER");
    }
}

function getWrongFckCount() {
    wrongInProgramCount = 0;

    collaboratorList = ArrayDirect(XQuery("sql:" +
        " SELECT co.id AS coll_id, o.id AS org_id " +
        " FROM [WTDB].[dbo].collaborators co " +
        " INNER JOIN [WTDB].[dbo].org o ON co.org_id = o.id " +
        " WHERE co.modification_date > DATEADD(MINUTE, -30, GETDATE()) " +
        " AND o.data.value('(org/custom_elems/custom_elem[name=''is_fcc''])[1]/value[1]', 'varchar(max)')  = 'true'"));

    for (collaborator in collaboratorList) {
        collaboratorDoc = tools.open_doc(collaborator.coll_id);

        if(collaboratorDoc != undefined) {
            collaboratorDocTE = collaboratorDoc.TopElem;

            if(!StrBegins(collaboratorDocTE.login, "rck_muc", true) && !StrBegins(collaboratorDocTE.login, "load_muc", true)) {
                if(collaboratorDocTE.custom_elems.ObtainChildByKey('is_fcc').value == "" || collaboratorDocTE.custom_elems.ObtainChildByKey('is_fcc').value == "false") {
                    wrongInProgramCount++;
                }
            }
        }
    }

    return wrongInProgramCount;
}

var agentId = 7389214479898473355;
var missMatchId = 7389214479898473355 + "_mismatch";

var loggerName = "aa_agent_7389214479898473355";
var userId = 7389518304440750773; // Websoft inner user
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);
agentId += "_agent";

var processed = 0;
var dossCertificatesCount = 0;

var mismatchWS = getMismatchWebsocketClient();
var mismatch = getMismatchInstance(missMatchId);

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    // FCK
    agent.message = "Получение данных ФЦК...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "DOSS_FCK";
    mismatch.dateTime = Date();
    mismatch.count = -1;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    resultArray = getEducationMethodsFromDts();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = ArrayCount(resultArray);
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    // RCK
    agent.message = "Получение данных РЦК...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "DOSS_RCK";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    resultArray = getEducationMethodsFromDtRck();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = ArrayCount(resultArray);
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    // EVENT BROKEN LINKS
    agent.message = "Получение данных ломанным ссылкам events...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "BL_EVENT";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    resultArray = eventBrokenLinks();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = ArrayCount(resultArray);
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    // COLLS BROKEN LINKS
    agent.message = "Получение данных ломанным ссылкам collaborator...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "BL_COLLS";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    resultArray = collaboratorBrokenLinks();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = ArrayCount(resultArray);
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    // DOSS INSTRUCTOR
    agent.message = "Получение данных инструкторов...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "DOSS_INSTRUCTOR";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    getDossInstructors();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = dossCertificatesCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    // DOSS TRAINER
    agent.message = "Получение данных внутренних тренеров...";
    ws = sendMessageToWebsocket(ws, agent);

    mismatch.state = 0;
    mismatch.mismatchType = "DOSS_TRAINER";
    mismatch.dateTime = Date();
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    getDossTrainers();

    mismatch.state = 1;
    mismatch.dateTime = Date();
    mismatch.count = dossCertificatesCount;
    sendMismatchMessageToWebsocket(mismatchWS, mismatch);

    processed += mismatch.count;

    agent.processed = processed;
    ws = sendMessageToWebsocket(ws, agent);

    agent.state = 1;
    agent.processed = processed;
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
        " | " + "Processed: " + processed,
        null,
        null
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
try {
    mismatchWS.Send("close");
} catch (e) {}