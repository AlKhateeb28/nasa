// 7248259687813234397
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isEventExist(eventList, dossierId) {
    for(eventId in eventList) {
        if(OptInt(eventId) == OptInt(dossierId)) {
            return true;
        }
    }

    return false;
}

function getRCKOckSign(data) {
    result = "";

    if(data.is_rcc != null && data.is_rcc == 1) {
        result += "Является РЦК";
    }

    if(data.is_ock_ss != null && data.is_ock_ss == 1) {
        if(StrCharCount(result) > 0) {
            result += ", Является ОЦК_Соц.сфера";
        } else {
            result += "Является ОЦК_Соцюсфера";
        }
    }

    if(data.is_ock_bno != null && data.is_ock_bno == 1) {
        if(StrCharCount(result) > 0) {
            result += ", Является ОЦК_БНО";
        } else {
            result += "Является ОЦК_БНО";
        }
    }

    return result;
}

function getNormalizedModuleName(name) {
    if(StrCharCount(name) == 0) {
        return "-";
    }

    return name;
}

// RP
function getRpCertificateNumbers(certificateIds) {
    result = "";

    for(certificate in certificateIds) {
        certificateDoc = tools.open_doc(OptInt(certificate.ock_tren_certificate_id));

        if(certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            if(certificateDocTE.type_id == 7129689286386417453) {
                result += certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
            }
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getRpCertificateNumber(certificateId) {
    certificateDoc = tools.open_doc(OptInt(certificateId));

    if(certificateDoc == undefined) {
        return "";
    }

    certificateDocTE = certificateDoc.TopElem;

    if(certificateDocTE.type_id == 7129689286386417453) {
        return certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
    }

    return "";
}

function getRpOtherEvents(eventResultList) {
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

function getRpEduMethodCount(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT COUNT(ems.id) AS cnt " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND ems.id = 7131096280190570779 " +
            " WHERE ers.person_id =  " + collaborator.collaborator_list_id +
            " GROUP BY ems.id "));

        for(data in dataList) {
            result += data.cnt;
        }
    }

    return result;
}

function getRpEventResultNames(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT TOP 1 ers.id, " +
            "       MAX(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) AS name, " +
            "       MAX(ers.event_start_date) AS event_start_date " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND ems.id = 7131096280190570779 " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            " GROUP BY ers.id "+
            " ORDER BY event_start_date DESC "));

        if(ArrayCount(dataList) > 0) {
            result = dataList[0].name;
        }
    }

    return result;
}

function  getRpNotPassedEduMethods(dossierAccountingIds) {
    result = "";

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.id, " +
            "       ems.name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "         INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "         INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND LOWER(ems.code) LIKE '%fck_ock_rp_am%' " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "  AND ers.not_participate = 1 " +
            "  AND ems.id NOT IN ( " +
            "    SELECT ems1.id " +
            "    FROM [WTDB].[dbo].event_results ers1 " +
            "             INNER JOIN [WTDB].[dbo].events es1 ON ers1.event_id = es1.id " +
            "             INNER JOIN [WTDB].[dbo].education_methods ems1 ON es1.education_method_id = ems1.id AND LOWER(ems1.code) LIKE '%fck_ock_rp_am%' " +
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

function getRpUniqueEvents(data, list, childTagName, max) {
    startDatetime = null;
    finishDatetime = null;

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

                        if (startDatetime == null) {
                            startDatetime = eventDocTE.start_date;
                        } else {
                            if (eventDocTE.start_date < startDatetime) {
                                startDatetime = eventDocTE.start_date;
                            }
                        }

                        if (finishDatetime == null) {
                            finishDatetime = eventDocTE.finish_date;
                        } else {
                            if (eventDocTE.finish_date > finishDatetime) {
                                finishDatetime = eventDocTE.finish_date;
                            }
                        }
                    }
                }
            }
        }
    }

    name = ArrayCount(eventList) + " из " + max;

    if(data.qualification_id == 7195880997527743133) {
        name = "-";
    }

    return {
        count: ArrayCount(eventList),
        name :  name,
        start : startDatetime,
        finish : finishDatetime
    }
}

// TREN
function hasTrenCertType(type, typeList) {
    for(certType in typeList) {
        if(type == certType) {
            return true
        }
    }

    return false
}

function getTrenCertificateNumbers(certificateIds, typeList) {
    result = "";

    for(certificate in certificateIds) {
        certificateDoc = tools.open_doc(OptInt(certificate.rcc_tren_certificate_id));

        if(certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            if(hasTrenCertType(certificateDocTE.type_id, typeList)) {
                result += certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
            }
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getTrenUniqueEvents(data, list, module, max) {
    startDatetime = null;
    finishDatetime = null;

    count = 0;

    for(trenProgram in list) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.id " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "    INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
            "       AND em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = '" + module + "' " +
            "       AND CAST(em.data.value('(//custom_elems/custom_elem[name=''rck_ock_num''])[1]/value[1]', 'bit') AS INT) = 1 " +
            " WHERE ers.id = " + trenProgram.rcc_tren_programs_id));

        for(data in dataList) {
            count++;

            eventDoc = tools.open_doc(data.id);

            if(eventDoc != undefined) {
                eventDocTE = eventDoc.TopElem;

                if (startDatetime == null) {
                    startDatetime = eventDocTE.start_date;
                } else {
                    if (eventDocTE.start_date < startDatetime) {
                        startDatetime = eventDocTE.start_date;
                    }
                }

                if (finishDatetime == null) {
                    finishDatetime = eventDocTE.finish_date;
                } else {
                    if (eventDocTE.finish_date > finishDatetime) {
                        finishDatetime = eventDocTE.finish_date;
                    }
                }
            }
        }
    }

    name = count + " из " + max;

    /*if(data.qualification_id == 7195880997527743133) {
        name = "-";
    }*/

    return {
        count: count,
        name :  name,
        start : startDatetime,
        finish : finishDatetime
    }
}

function  getTrenNotPassedEduMethods(dossierAccountingIds, isAlone) {
    result = "";

    aloneCondition = "";
    if(isAlone != undefined && isAlone) {
        aloneCondition = " AND (em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль1' " +
            "        OR " +
            "         em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль2' " +
            "    ) ";
    }

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.id, " +
            "       ems.name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "       INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
            "       INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "       INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND LOWER(ems.code) LIKE '%fck_com_rck_tren%' " +
            "       INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "       AND UPPER(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) != 'СЕРТИФИЦИРОВАН' " +
            aloneCondition +
            "       AND ems.id NOT IN ( " +
            "            SELECT ems.id " +
            "            FROM [WTDB].[dbo].event_results ers " +
            "                INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
            "                INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "                INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND LOWER(ems.code) LIKE '%fck_com_rck_tren%' " +
            "                INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
            "            WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "               AND UPPER(er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)')) = 'СЕРТИФИЦИРОВАН')"));

        for(data in dataList) {
            result += data.name + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getTrenEduMethodCount(dossierAccountingIds) {
    result = "";

    count = 0;

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.id " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "    INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "       AND (em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль1' " +
            "           OR " +
            "            em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль2' " +
            "    ) "));

        count += ArrayCount(dataList);
    }

    return count;
}

function getTrenAloneEduMethodCount(dossierAccountingIds) {
    result = "";

    count = 0;

    for(collaborator in dossierAccountingIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.id " +
            " FROM [WTDB].[dbo].event_results ers " +
            "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            "    INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id AND LOWER(ems.code) LIKE '%fck_com_rck_tren%' " +
            "    INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
            " WHERE ers.person_id = " + collaborator.collaborator_list_id +
            "       AND (em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль1' " +
            "           OR " +
            "            em.data.value('(//custom_elems/custom_elem[name=''rck_modul_event''])[1]/value[1]', 'varchar(max)') = 'Тренер Сертификация Модуль2' " +
            "    ) "));

        count += ArrayCount(dataList);
    }

    return count;
}

// DC
function getDcUniqueEvents(programIds) {
    startDatetime = null;
    finishDatetime = null;

    count = 0;

    for(program in programIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.name, " +
            "       es.start_date, " +
            "       es.finish_date " +
            " FROM [WTDB].[dbo].event_results ers " +
            "       INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            " WHERE ers.id = " + program.rcc_dc_programs_id));

        for(data in dataList) {
            count++;

            if (startDatetime == null) {
                startDatetime = data.start_date;
            } else {
                if (data.start_date < startDatetime) {
                    startDatetime = data.start_date;
                }
            }

            if (finishDatetime == null) {
                finishDatetime = data.finish_date;
            } else {
                if (data.finish_date > finishDatetime) {
                    finishDatetime = data.finish_date;
                }
            }
        }
    }

    return {
        count: count,
        name :  count,
        start : startDatetime,
        finish : finishDatetime
    };
}

function getDcCertificateNumbers(certificatesIds) {
    result = "";

    for(certificate in certificatesIds) {
        certificateDoc = tools.open_doc(OptInt(certificate.rcc_dc_certificate_id));

        if(certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            result += certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

// UI
function getUiUniqueEvents(programIds) {
    startDatetime = null;
    finishDatetime = null;

    count = 0;

    for(program in programIds) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.name, " +
            "       es.start_date, " +
            "       es.finish_date " +
            " FROM [WTDB].[dbo].event_results ers " +
            "       INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
            " WHERE ers.id = " + program.rcc_ui_programs_id));

        for(data in dataList) {
            count++;

            if (startDatetime == null) {
                startDatetime = data.start_date;
            } else {
                if (data.start_date < startDatetime) {
                    startDatetime = data.start_date;
                }
            }

            if (finishDatetime == null) {
                finishDatetime = data.finish_date;
            } else {
                if (data.finish_date > finishDatetime) {
                    finishDatetime = data.finish_date;
                }
            }
        }
    }

    return {
        count: count,
        name :  count,
        start : startDatetime,
        finish : finishDatetime
    };
}

function getUiCertificateNumbers(certificatesIds) {
    result = "";

    for(certificate in certificatesIds) {
        certificateDoc = tools.open_doc(OptInt(certificate.rcc_ui_certificate_id));

        if(certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            result += certificateDocTE.serial + "-" + certificateDocTE.number + "/" + StrDate(Date(certificateDocTE.delivery_date), false, false).split(".")[2] + ";";
        }
    }

    if(StrCharCount(result) > 0) {
        result = StrCharRangePos(result, 0, StrCharCount(result) - 1);
    }

    return result;
}

function getEmptyFinality() {
    return {
        count: 0,
        name: "-",
        start: null,
        finish: null
    }
}

function getState(assignmentDate, finality1, finality2, finality3, finality4, successRate) {

    if(assignmentDate != null && Year(assignmentDate) < 2025) {
        return "Завершена";
    }

    state = "В процессе";

    if(finality1.count == 0 && finality2.count == 0 && finality3.count == 0 && finality4.count == 0) {
        state = "Не начата";
    } else if(successRate >= 80) {
        state = "Завершена";
    }

    return state;
}

function getUniqueEvents(data, dossierDocTE) {
    if(OptInt(data.qualification_id) == 7133958088135497285) {
        // ОЦК РП СС
        finality1 = getRpUniqueEvents(data, dossierDocTE.ock_rp_programs_m1s, "ock_rp_programs_m1_id", 3);
        finality2 = getRpUniqueEvents(data, dossierDocTE.ock_rp_programs_m2s, "ock_rp_programs_m2_id", 4);
        finality3 = getRpUniqueEvents(data, dossierDocTE.ock_rp_programs_m3s, "ock_rp_programs_m3_id", 4);
        finality4 = getEmptyFinality();

        successRate = OptInt((finality1.count + finality2.count + finality3.count) * 100 / 11);

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: getRpNotPassedEduMethods(dossierDocTE.collaborator_lists),
            certificateNumbers: getRpCertificateNumber(dossierDocTE.ock_rp_certificate_id),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: getRpEduMethodCount(dossierDocTE.collaborator_lists),

            eventResultNames: getRpEventResultNames(dossierDocTE.collaborator_lists),

            successRate: successRate,
            state: getState(data.assignment_date, finality1, finality2, finality3, finality4, successRate)
        };
    } else if(OptInt(data.qualification_id) == 7195880997527743133) {
        // РП Самостоятельно
        finality1 = getRpUniqueEvents(data, dossierDocTE.rcc_rp_programs_m1s, "rcc_rp_programs_m1_id", 4);
        finality2 = getRpUniqueEvents(data, dossierDocTE.rcc_rp_programs_m2s, "rcc_rp_programs_m2_id", 2);
        finality3 = getRpUniqueEvents(data, dossierDocTE.rcc_rp_programs_m3s, "rcc_rp_programs_m3_id", 5);
        finality4 = getRpUniqueEvents(data, dossierDocTE.rcc_rp_programs_m4s, "rcc_rp_programs_m4_id", 5);

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: getTrenNotPassedEduMethods(dossierDocTE.collaborator_lists),
            certificateNumbers: getRpCertificateNumber(dossierDocTE.ock_rp_certificate_id),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: getRpEduMethodCount(dossierDocTE.collaborator_lists),
            eventResultNames: getRpEventResultNames(dossierDocTE.collaborator_lists),
            successRate: "-",
            state: getState(data.assignment_date, finality1, finality2, finality3, finality4, successRate)
        }
    } else if(OptInt(data.qualification_id) == 7291203475375342689) {
        // Тренер
        finality1 = getTrenUniqueEvents(data, dossierDocTE.rcc_tren_programss, "Тренер Модуль1", 2);
        finality2 = getTrenUniqueEvents(data, dossierDocTE.rcc_tren_programss, "Тренер Модуль2", 1);
        finality3 = getEmptyFinality();
        finality4 = getEmptyFinality();

        successRate = OptInt((finality1.count + finality2.count) * 100 / 3);
        if(successRate >= 99) {
            successRate = 100;
        }

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: getTrenNotPassedEduMethods(dossierDocTE.collaborator_lists),
            certificateNumbers: getTrenCertificateNumbers(dossierDocTE.rcc_tren_certificates, [7103979688639225943, 7164452761309690093]),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: getTrenEduMethodCount(dossierDocTE.collaborator_lists),
            eventResultNames: "-",
            successRate: successRate,
            state: getState(data.assignment_date, finality1, finality2, finality3, finality4, successRate)
        };
    } else if(OptInt(data.qualification_id) == 7291203475375342689) {
        // Тренер Самостоятельно
        finality1 = getEmptyFinality();
        finality2 = getEmptyFinality();
        finality3 = getEmptyFinality();
        finality4 = getEmptyFinality();

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: getTrenNotPassedEduMethods(dossierDocTE.collaborator_lists, true),
            certificateNumbers: getTrenCertificateNumbers(dossierDocTE.rcc_tren_certificates, [7244036822215294966]),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: getTrenAloneEduMethodCount(dossierDocTE.collaborator_lists),
            eventResultNames: "-",
            successRate: "-",
            state: "-"
        };
    } else if(OptInt(data.qualification_id) == 7291203742998932205) {
        // Консультант ДЦ
        finality1 = getDcUniqueEvents(dossierDocTE.rcc_dc_programss);
        finality2 = getEmptyFinality();
        finality3 = getEmptyFinality();
        finality4 = getEmptyFinality();

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: "-",
            certificateNumbers: getDcCertificateNumbers(dossierDocTE.rcc_dc_certificates),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: "-",
            eventResultNames: "-",
            successRate: "-",
            state: "Завершена"
        };
    } else if(OptInt(data.qualification_id) == 7291203828333050298) {
        // Консультант УИ
        finality1 = getUiUniqueEvents(dossierDocTE.rcc_ui_programss);
        finality2 = getEmptyFinality();
        finality3 = getEmptyFinality();
        finality4 = getEmptyFinality();

        return {
            finality1: finality1,
            finality2: finality2,
            finality3: finality3,
            finality4: finality4,
            passedMethods: "-",
            certificateNumbers: getUiCertificateNumbers(dossierDocTE.rcc_ui_certificates),
            otherEvents: getRpOtherEvents(dossierDocTE.other_eventss),
            eduMethodCount: "-",
            eventResultNames: "-",
            successRate: "-",
            state: "Завершена"
        };
    } else {
        return {
            finality1: getEmptyFinality(),
            finality2:  getEmptyFinality(),
            finality3 : getEmptyFinality(),
            finality4 : getEmptyFinality(),
            passedMethods: "",
            certificateNumbers: "",
            otherEvents: "",
            eduMethodCount: "",
            eventResultNames: "",
            successRate: "-",
            state: ""
        }
    }
}

function getReportHeader() {
    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>Признак РЦК/ОЦК</td>");
    reportString.AppendStr("<td class='header'>ФОИВ</td>");
    reportString.AppendStr("<td class='header'>Квота ОЦК</td>");
    reportString.AppendStr("<td class='header'>ИНН организации</td>");
    reportString.AppendStr("<td class='header'>Организация</td>");
    reportString.AppendStr("<td class='header'>Кратное название организации</td>");
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
    reportString.AppendStr("<td class='header'>Год присвоения</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 1</td>");
    reportString.AppendStr("<td class='header'>Дата начала Модуль 1</td>");
    reportString.AppendStr("<td class='header'>Дата завершения Модуль 1</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 2</td>");
    reportString.AppendStr("<td class='header'>Дата начала Модуль 2</td>");
    reportString.AppendStr("<td class='header'>Дата завершения Модуль 2</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 3</td>");
    reportString.AppendStr("<td class='header'>Дата начала Модуль 3</td>");
    reportString.AppendStr("<td class='header'>Дата завершения Модуль 3</td>");
    reportString.AppendStr("<td class='header'>Завершенность Модуль 4</td>");
    reportString.AppendStr("<td class='header'>Дата начала Модуль 4</td>");
    reportString.AppendStr("<td class='header'>Дата завершения Модуль 4</td>");
    reportString.AppendStr("<td class='header'>Непройденные программы подготовки</td>");
    reportString.AppendStr("<td class='header'>Номер сертификата</td>");
    reportString.AppendStr("<td class='header'>Прочие программы</td>");
    reportString.AppendStr("<td class='header'>Количество сертификаций</td>");
    reportString.AppendStr("<td class='header'>Результат последней сертификации</td>");
    reportString.AppendStr("<td class='header'>Успешность прохождения подготовки, %</td>");
    reportString.AppendStr("<td class='header'>Статус прохождения подготовки</td>");
    reportString.AppendStr("<td class='header'>ID квалификации</td>");
    reportString.AppendStr("<td class='header'>ID типа квалификации</td>");
    reportString.AppendStr("<td class='header'>ID сотрудника</td>");
    reportString.AppendStr("</tr>");
}

function operateData() {
    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT qas.id AS qas_id, " +
        "       doss.id AS dossier_id, " +
        "       rs.name AS doss_fact_region, " +
        "       pas.name AS pas_name, " +
        "       pas_kvota.name AS pas_kvota_name, " +
        "       o.data.value('(//custom_elems/custom_elem[name=''short_name''])[1]/value[1]', 'varchar(max)') AS short_name, " +
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
        "       qs.name AS qual_name, " +
        "       CASE " +
        "           WHEN qas.status = 'assigned' THEN 'Присвоена' " +
        "           WHEN qas.status = 'not_assigned' THEN 'Неприсвоена' " +
        "           WHEN qas.status = 'in_process' THEN 'В процессе' " +
        "           WHEN qas.status = 'expired' THEN 'Истекла' " +
        "           ELSE '' END AS status, " +
        "       qas.expiration_date, " +
        "       qas.assignment_date, " +
        "       qas.qualification_id, " +
        "       CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rcc''])[1]/value[1]', 'bit') AS INT) AS is_rcc, " +
        "       CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock_ss''])[1]/value[1]', 'bit') AS INT) AS is_ock_ss, " +
        "       CAST(o.data.value('(//custom_elems/custom_elem[name=''is_ock_bno''])[1]/value[1]', 'bit') AS INT) AS is_ock_bno, " +
        "       qas.person_id " +
        " FROM [WTDB].[dbo].qualification_assignments qas " +
        "         INNER JOIN [WTDB].[dbo].qualification_assignment qa ON qas.id = qa.id " +
        "         INNER JOIN [WTDB].[dbo].collaborators cs ON qas.person_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        "         INNER JOIN [WTDB].[dbo].cc_dossier_rcc_employees doss ON c.data.value('(//custom_elems/custom_elem[name=''dossier_id'']/value)[1]', 'bigint') = doss.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON doss.subdivision_name = os.id " +
        "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "         INNER JOIN [WTDB].[dbo].regions AS rs ON o.data.value('(//custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        "         LEFT JOIN [WTDB].[dbo].professional_areas AS pas ON o.data.value('(//custom_elems/custom_elem[name=''professional_area''])[1]/value[1]', 'bigint') = pas.id " +
        "         LEFT JOIN [WTDB].[dbo].professional_areas AS pas_kvota ON qa.data.value('(//custom_elems/custom_elem[name=''professional_area''])[1]/value[1]', 'bigint') = pas_kvota.id " +
        "         INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        "         INNER JOIN [WTDB].[dbo].qualifications qs ON qas.qualification_id = qs.id AND qs.role_id.value('(//role_id)[1]', 'bigint') = 7133957801530357765 "));

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

            uniqueEvent = getUniqueEvents(data, dossierDocTE);

            reportString.AppendStr(
                "<tr>" +
                "<td>" + getRCKOckSign(data) + "</td>" +
                "<td>" + data.pas_name + "</td>" +
                "<td>" + data.pas_kvota_name + "</td>" +
                "<td>" + data.doss_inn + "</td>" +
                "<td>" + data.doss_org_name + "</td>" +
                "<td>" + data.short_name + "</td>" +
                "<td>" + data.student_fullname + "</td>" +
                "<td>" + data.position_name + "</td>" +
                "<td>" + data.fullname + "</td>" +
                "<td style='text-align: center;'>" + StrDate(data.date_selection, false, false) + "</td>" +
                "<td>" + data.result_selection + "</td>" +
                "<td style='text-align: center;'>" + StrDate(data.date_position, false, false) + "</td>" +
                "<td style='text-align: center;'>" + StrDate(data.dismiss_date, false, false) + "</td>" +
                "<td>" + data.type_position + "</td>" +
                "<td>" + data.type_prep + "</td>" +
                "<td>" + data.reason + "</td>" +
                "<td>" + data.qual_name + "</td>" +
                "<td style='text-align: center;'>" + data.status + "</td>" +
                "<td style='text-align: center;'>" + (data.assignment_date == null ? "" : Year(data.assignment_date)) + "</td>" +
                "<td style='text-align: center;'>" + getNormalizedModuleName(uniqueEvent.finality1.name) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality1.start == null ? "-" : StrDate(uniqueEvent.finality1.start, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality1.finish == null ? "-" : StrDate(uniqueEvent.finality1.finish, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + getNormalizedModuleName(uniqueEvent.finality2.name) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality2.start == null ? "-" : StrDate(uniqueEvent.finality2.start, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality2.finish == null ? "-" : StrDate(uniqueEvent.finality2.finish, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + getNormalizedModuleName(uniqueEvent.finality3.name) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality3.start == null ? "-" : StrDate(uniqueEvent.finality3.start, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality3.finish == null ? "-" : StrDate(uniqueEvent.finality3.finish, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + getNormalizedModuleName(uniqueEvent.finality4.name) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality4.start == null ? "-" : StrDate(uniqueEvent.finality4.start, false, false)) + "</td>" +
                "<td style='text-align: center;'>" + (uniqueEvent.finality4.finish == null ? "-" : StrDate(uniqueEvent.finality4.finish, false, false)) + "</td>" +
                "<td>" + uniqueEvent.passedMethods + "</td>" +
                "<td>" + uniqueEvent.certificateNumbers + "</td>" +
                "<td>" + uniqueEvent.otherEvents + "</td>" +
                "<td style='text-align: center;'>" + uniqueEvent.eduMethodCount + "</td>" +
                "<td style='text-align: center;'>" + uniqueEvent.eventResultNames + "</td>" +
                "<td style='text-align: center;'>" + uniqueEvent.successRate + "</td>" +
                "<td style='text-align: center;'>" + uniqueEvent.state + "</td>" +
                "<td>'" + data.qas_id + "</td>" +
                "<td>'" + data.qualification_id + "</td>" +
                "<td>'" + data.person_id + "</td>" +
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
}

if (LdsIsServer) {
    var agentId = 7248259687813234397;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7248259687813234397";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;
    var notFound = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        maxSteps = 2;

        getReportHeader();
        operateData();

        agent.processed = processed;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        //excel.SaveAs("E:/Websoft/Reports/report_not_tren_muc_com/report_not_tren_muc_com_" + ParseDate(Date()) + ".xlsx");
        excel.SaveAs("E:/Websoft/Reports/report_col_ock_rck/ock_kval_" + ParseDate(Date()) + ".xlsx");

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