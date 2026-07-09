<%
// 7151616261867663994
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}};function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getAvailableTypesAsString(dossierDocTE) {
    typeValue="";
    
    if(dossierDocTE.is_rck_intership) {
        typeValue+="РП РЦК стажировка в ФЦК, ";
    }
    if(dossierDocTE.is_rck_alone) {
        typeValue+="РП РЦК самостоятельно, ";
    }
    if(dossierDocTE.is_rck_trainer) {
        typeValue+="Тренер РЦК, ";
    }
    if(dossierDocTE.is_rck_fck_cert) {
        typeValue+="Сертификация тренера РЦК в ФЦК, ";
    }
    if(dossierDocTE.is_ock_ss) {
        typeValue+="Соц.сфера_ОЦК_РП, ";
    }
    if(dossierDocTE.is_ock_ss_analyst) {
        typeValue+="Соц.сфера_ОЦК_Аналитик-методолог, ";
    }
    if(dossierDocTE.is_ock_ss_trainer) {
        typeValue+="Соц.сфера_ОЦК_Тренер, ";
    }
    if(dossierDocTE.is_ock_bno) {
        typeValue+="БНО_ОЦК_РП, ";
    }
    if(dossierDocTE.is_ock_bno_analyst) {
        typeValue+="БНО_ОЦК_Аналитик-методолог, ";
    }
    if(dossierDocTE.is_ock_bno_trainer) {
        typeValue+="БНО_ОЦК_Тренер, ";
    }
    if(dossierDocTE.is_ock_ss_rp_alone) {
        typeValue+="Соц.сфера_ОЦК_РП самостоятельно, ";
    }
    if(dossierDocTE.is_ock_ss_analyst_alone) {
        typeValue+="Соц.сфера_ОЦК_Аналитик-методолог самостоятельно, ";
    }
    if(dossierDocTE.is_ock_ss_trainer_alone) {
        typeValue += "Соц.сфера_ОЦК_Тренер самостоятельно, ";
    }
    if(dossierDocTE.is_ock_bno_rp_alone) {
        typeValue+="БНО_ОЦК_РП самостоятельно, ";
    }
    if(dossierDocTE.is_ock_bno_analyst_alone) {
        typeValue+="БНО_ОЦК_Аналитик-методолог самостоятельно, ";
    }
    if(dossierDocTE.is_ock_bno_trainer_alone) {
        typeValue+="БНО_ОЦК_Тренер самостоятельно, ";
    }
    if (dossierDocTE.is_rck_trainer_soc) {
        typeValue += "Тренер РЦК для соц.сферы, ";
    }
    
    if(StrCharCount(typeValue) > 0) {
        typeValue=StrCharRangePos(typeValue,0,StrCharCount(typeValue)-2);
    }

    return typeValue;
}

function getEventData(personId, educationMethodIds, isAssessment) {
    result = {};
    result.eventResult = "";
    result.startDate = "";

    educationMethodIdString = "";

    for (id in educationMethodIds) {
        educationMethodIdString += id + ", ";
    }

    if (StrCharCount(educationMethodIdString) > 0) {
        educationMethodIdString = StrCharRangePos(educationMethodIdString, 0, StrCharCount(educationMethodIdString) - 2);        
    } else {
        return result;
    }

    resultList = ArrayDirect(XQuery("sql: " +
        " SELECT ers.is_assist, " +
        "   es.start_date, " +
        "   er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') AS event_result " +
        " FROM [WTDB].[dbo].event_results ers " +
        "   INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        "   INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
        " WHERE ers.person_id = " + personId +
        "   AND es.education_method_id IN (" + educationMethodIdString + ")"));

    if(ArrayCount(resultList) > 0) {
        if(isAssessment) {
            result.eventResult = resultList[0].event_result;
        } else {
            if (resultList[0].is_assist) {
                result.eventResult = "+";
            } else {
                result.eventResult = "-";
            }
        }

        if(resultList[0].start_date != "") {
            result.startDate = StrDate(resultList[0].start_date, false, false);
        }
    }

    return result;
}

function getCertificationData(personId, educationMethodId) {
    result = {};
    result.certificateResult = "";
    result.certificateDate = "";

    resultList = ArrayDirect(XQuery("sql: " +
        " SELECT er.data.value('(//custom_elems/custom_elem[name=''sert_result'']/value)[1]', 'varchar(max)') AS sert_result, " +
        "       er.data.value('(//custom_elems/custom_elem[name=''sert_date'']/value)[1]', 'varchar(max)') AS cert_date " +
        " FROM [WTDB].[dbo].event_results ers " +
        "    INNER JOIN [WTDB].[dbo].event_result er ON ers.id = er.id " +
        "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.education_method_id = " + educationMethodId +
        " WHERE ers.person_id = " + personId));

    if(ArrayCount(resultList) > 0) {
        result.certificateResult = resultList[0].sert_result;

        if(resultList[0].cert_date != "") {
            result.certificateDate = StrDate(Date(resultList[0].cert_date), false, false);
        }
    }

    return result;
}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";

var agentId = 7151616261867663994;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7151616261867663994";
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
        "    cs.code, " +
        "    cs.fullname, " +
        "    ds.subdivision_inn AS inn, " +
        "    o.data.value('(//custom_elems/custom_elem[name=''short_name'']/value)[1]', 'varchar(max)') AS short_name, " +
        "    os.name AS org_name, " +
        "    ds.student_fullname AS fio, " +
        "    ds.student_id, " +
        "    ds.student_position, " +
        "    ds.date_selection, " +
        "    ds.date_position, " +
        "    '' AS isInGroup, " +
        "    ds.dismiss_date, " +
        "    pas.name AS sphere_name " +
        " FROM [WTDB].[dbo].cc_dossier_rcc_employees ds " +
        "    INNER JOIN [WTDB].[dbo].cc_dossier_rcc_employee d ON ds.id = d.id " +
        "    LEFT JOIN [WTDB].[dbo].orgs os ON ds.subdivision_inn = os.code " +
        "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(//custom_elems/custom_elem[name=''is_ock_bno'']/value)[1]', 'bit') = 1 " +
        "    LEFT JOIN [WTDB].[dbo].professional_areas pas ON o.data.value('(//custom_elems/custom_elem[name=''professional_area'']/value)[1]', 'bigint') = pas.id " +
        "    LEFT JOIN [WTDB].[dbo].collaborators cs ON ds.student_id = cs.id " +
        " ORDER BY fio "));

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
    reportString.AppendStr("<th class='header'>Код</th>");
    reportString.AppendStr("<th class='header'>Сфера</th>");
    reportString.AppendStr("<th class='header'>ИНН</th>");
    reportString.AppendStr("<th class='header' style='width: 300px'>Короткое название организации</th>");
    reportString.AppendStr("<th class='header' style='width: 500px'>Организация</th>");
    reportString.AppendStr("<th class='header' style='width: 200px'>ФИО</th>");
    reportString.AppendStr("<th class='header'>Ссылка на сотрудника</th>");
    reportString.AppendStr("<th class='header' style='width: 200px;'>Должность</th>");
    reportString.AppendStr("<th class='header'>Дата отбора</th>");
    reportString.AppendStr("<th class='header'>Дата трудостройства</th>");
    reportString.AppendStr("<th class='header'>Дата увольнения</th>");
    reportString.AppendStr("<th class='header'>Рекомендован на подготовку</th>");
    reportString.AppendStr("<th class='header'>Включен в группу на обучение</th>");
    reportString.AppendStr("<th class='header'>ФП дата</th>");
    reportString.AppendStr("<th class='header'>ФП статус</th>");
    reportString.AppendStr("<th class='header'>ОБП/ИнБП дата</th>");
    reportString.AppendStr("<th class='header'>ОБП/ИнБП статус</th>");
    reportString.AppendStr("<th class='header'>СУЭ/ПУ дата</th>");
    reportString.AppendStr("<th class='header'>СУЭ/ПУ статус</th>");
    reportString.AppendStr("<th class='header'>УИ/ОВКР дата</th>");
    reportString.AppendStr("<th class='header'>УИ/ОВКР статус</th>");
    reportString.AppendStr("<th class='header'>ММ1 дата</th>");
    reportString.AppendStr("<th class='header'>ММ1 статус</th>");
    reportString.AppendStr("<th class='header'>ДП дата</th>");
    reportString.AppendStr("<th class='header'>ДП статус</th>");
    reportString.AppendStr("<th class='header'>ОВПП дата</th>");
    reportString.AppendStr("<th class='header'>ОВПП статус</th>");
    reportString.AppendStr("<th class='header'>УИ дата</th>");
    reportString.AppendStr("<th class='header'>УИ статус</th>");
    reportString.AppendStr("<th class='header'>ОКРО дата</th>");
    reportString.AppendStr("<th class='header'>ОКРО статус</th>");
    reportString.AppendStr("<th class='header'>БРП дата</th>");
    reportString.AppendStr("<th class='header'>БРП статус</th>");
    reportString.AppendStr("<th class='header'>ДПБО дата</th>");
    reportString.AppendStr("<th class='header'>ДПБО статус</th>");
    reportString.AppendStr("<th class='header'>ММ2 дата</th>");
    reportString.AppendStr("<th class='header'>ММ2 статус</th>");
    reportString.AppendStr("<th class='header'>МРП дата</th>");
    reportString.AppendStr("<th class='header'>МРП статус</th>");
    reportString.AppendStr("<th class='header'>ИРУМ дата</th>");
    reportString.AppendStr("<th class='header'>ИРУМ статус</th>");
    reportString.AppendStr("<th class='header'>РОЛП дата</th>");
    reportString.AppendStr("<th class='header'>РОЛП статус</th>");
    reportString.AppendStr("<th class='header'>УМП дата</th>");
    reportString.AppendStr("<th class='header'>УМП статус</th>");
    reportString.AppendStr("<th class='header'>ММ3 дата</th>");
    reportString.AppendStr("<th class='header'>ММ3 статус</th>");
    reportString.AppendStr("<th class='header'>ЭЭ дата</th>");
    reportString.AppendStr("<th class='header'>ЭЭ статус</th>");
    reportString.AppendStr("<th class='header'>РА дата</th>");
    reportString.AppendStr("<th class='header'>РА статус</th>");
    reportString.AppendStr("<th class='header'>ОКЦК дата</th>");
    reportString.AppendStr("<th class='header'>ОКЦК статус</th>");
    reportString.AppendStr("<th class='header'>РОКР дата</th>");
    reportString.AppendStr("<th class='header'>РОКР статус</th>");
    reportString.AppendStr("<th class='header'>ММ4 дата</th>");
    reportString.AppendStr("<th class='header'>ММ4 статус</th>");
    reportString.AppendStr("<th class='header'>ФОП дата</th>");
    reportString.AppendStr("<th class='header'>ФОП статус</th>");
    reportString.AppendStr("<th class='header'>ПрПл дата</th>");
    reportString.AppendStr("<th class='header'>ПрПл статус</th>");
    reportString.AppendStr("<th class='header'>СР дата</th>");
    reportString.AppendStr("<th class='header'>СР статус</th>");
    reportString.AppendStr("<th class='header'>ЛиУП дата</th>");
    reportString.AppendStr("<th class='header'>ЛиУП статус</th>");
    reportString.AppendStr("<th class='header'>Серт_РП_БНО дата</th>");
    reportString.AppendStr("<th class='header'>Серт_РП_БНО статус</th>");
    reportString.AppendStr("<th class='header'>ПП_ОБП дата</th>");
    reportString.AppendStr("<th class='header'>ПП_ОБП статус</th>");
    reportString.AppendStr("<th class='header'>ПП_5С дата</th>");
    reportString.AppendStr("<th class='header'>ПП_5С статус</th>");
    reportString.AppendStr("<th class='header'>ПП_Карт дата</th>");
    reportString.AppendStr("<th class='header'>ПП_Карт статус</th>");
    reportString.AppendStr("<th class='header'>ПП_МРП дата</th>");
    reportString.AppendStr("<th class='header'>ПП_МРП статус</th>");
    reportString.AppendStr("<th class='header'>ПП_ПА дата</th>");
    reportString.AppendStr("<th class='header'>ПП_ПА статус</th>");
    reportString.AppendStr("<th class='header'>ТТ дата</th>");
    reportString.AppendStr("<th class='header'>ТТ статус</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_ОБП дата</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_ОБП статус</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_5С дата</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_5С статус</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_Карт дата</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_Карт статус</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_МРП дата</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_МРП статус</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_ПА дата</th>");
    reportString.AppendStr("<th class='header'>Серт_Т_ПА статус</th>");
    reportString.AppendStr("<th class='header'>ДРБ дата</th>");
    reportString.AppendStr("<th class='header'>ДРБ статус</th>");
    reportString.AppendStr("<th class='header'>Серт_АМ_БНО дата</th>");
    reportString.AppendStr("<th class='header'>Серт_АМ_БНО статус</th>");

    reportString.AppendStr("</tr>");

    reportString.AppendStr("<tr>");
    for(i = 1; i <= 94; i++) {
        reportString.AppendStr("<td style='text-align: center; font-weight: bold;'>" + i + "</td>");
    }
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        dossierDoc = tools.open_doc(data.id);

        if(dossierDoc != undefined) {
            typeValue = getAvailableTypesAsString(dossierDoc.TopElem);

            isInGroup = "";

            groupDoc = tools.open_doc(7129041349147311066);

            if(groupDoc != undefined) {
                exist = groupDoc.TopElem.collaborators.GetOptChildByKey(OptInt(data.student_id));

                if(exist != undefined) {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Yes");
                    isInGroup = "Да";
                }
            }

            reportString.AppendStr("<tr>");
            reportString.AppendStr("<td>'" + data.id + "</td>");
            reportString.AppendStr("<td>" + data.code + "</td>");
            reportString.AppendStr("<td>" + data.sphere_name + "</td>");
            reportString.AppendStr("<td>" + data.inn + "</td>");
            reportString.AppendStr("<td>" + data.short_name + "</td>");
            reportString.AppendStr("<td>" + data.org_name + "</td>");
            reportString.AppendStr("<td>" + data.fio + "</td>");
            reportString.AppendStr("<td>'" + data.fullname + "</td>");
            reportString.AppendStr("<td>" + data.student_position + "</td>")
            reportString.AppendStr("<td>" + StrDate(data.date_selection, false, false) + "</td>");
            reportString.AppendStr("<td>" + StrDate(data.date_position, false, false) + "</td>");
            // dismiss_date
            reportString.AppendStr("<td class='align-center'>" + (data.dismiss_date == null ? "" : StrDate(data.dismiss_date, false, false))  + "</td>");
            reportString.AppendStr("<td>" + typeValue + "</td>");
            reportString.AppendStr("<td>" + isInGroup + "</td>");
            // ФП 15-16
            personData = getEventData(data.student_id, [7139579904915384134, 7139584342275056417]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ОБП/ИнБП 17-18
            personData = getEventData(data.student_id, [7139583716715276542, 7260326033895686135]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // СУЭ/ПУ 19-20
            personData = getEventData(data.student_id, [7139583892004006841, 7260339633432155683]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // УИ/ОВКР 21-22
            personData = getEventData(data.student_id, [7139584119654044899, 7260340223731491074]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ММ1 23-24
            personData = getEventData(data.student_id, [7260340839388028681]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ДП 25-26
            personData = getEventData( data.student_id, [7139584611408838535]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ОВПП 27-28
            personData = getEventData( data.student_id, [7139584912880465142]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // УИ 29-30
            personData = getEventData( data.student_id, [7139585150445631860]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ОКРО 31-32
            personData = getEventData(data.student_id, [7260342178739644384]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // БРП 33-34
            personData = getEventData(data.student_id, [7260342428725114921]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ДПБО 35-36
            personData = getEventData(data.student_id, [7260342428725114921]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ММ2 37-38
            personData = getEventData(data.student_id, [7260342884660755156]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // МРП 39-40
            personData = getEventData(data.student_id, [7139585712784635511]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ИРУМ 41-42
            personData = getEventData(data.student_id, [7139585867699419711]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // РОЛП 43-44
            personData = getEventData(data.student_id, [7139586023043529440]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // УМП 45-46
            personData = getEventData(data.student_id, [7139586222744035692]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ММ3 47-48
            personData = getEventData(data.student_id, [7260344969399860432]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ЭЭ 49-50
            personData = getEventData(data.student_id, [7139587160353735460]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // РА 51-52
            personData = getEventData(data.student_id, [7139587337640712479]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ОКЦК 53-54
            personData = getEventData(data.student_id, [7139587483214737195]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // РОКР 55-56
            personData = getEventData(data.student_id, [7139587938917924601]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ММ4 57-58
            personData = getEventData(data.student_id, [7139588594320465247]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // ФОП 59-60
            personData = getEventData(data.student_id, [7260346309096233046]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ПрПл 61-62
            personData = getEventData(data.student_id, [7260346521830257161]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // СР 63-64
            personData = getEventData(data.student_id, [7260346692047926831]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ЛиУП 65-66
            personData = getEventData(data.student_id, [7260347789308848281]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // Серт_РП_БНО 67-68
            certificateData = getCertificationData(data.student_id, 7143846913328314346);
            reportString.AppendStr("<td class='align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + certificateData.certificateResult + "</td>");
            // ПП_ОБП 69-70
            personData = getEventData(data.student_id, [7139594763654621792]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ПП_5С 71-72
            personData = getEventData(data.student_id, [7139597766701841243]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ПП_Карт 73-74
            personData = getEventData(data.student_id, [7139597968774893941]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ПП_МРП 75-76
            personData = getEventData(data.student_id, [7139598255544823032]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ПП_ПА 77-78
            personData = getEventData(data.student_id, [7260333431508669182]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // ТТ 79-80
            personData = getEventData(data.student_id, [7139598651254144932]);
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + personData.eventResult + "</td>");
            // Серт_Т_ОБП 81-82
            certificateData = getCertificationData(data.student_id, 7139599022871804841);
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateResult + "</td>");            
            // Серт_Т_5С 83-84
            certificateData = getCertificationData(data.student_id, 7139599248667965370);
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateResult + "</td>");            
            // Серт_Т_Карт 85-86
            certificateData = getCertificationData(data.student_id, 7139599402891431747);
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateResult + "</td>");            
            // Серт_Т_МРП 87-88
            certificateData = getCertificationData(data.student_id, 7139599997946821817);
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateResult + "</td>");            
            // Серт_Т_ПА 89-90
            certificateData = getCertificationData(data.student_id, 7139600124291833991);
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='column_grey align-center'>" + certificateData.certificateResult + "</td>");            
            // ДРБ 91-92
            personData = getEventData(data.student_id, [7247966448645989959]);
            reportString.AppendStr("<td class='align-center'>" + personData.startDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + personData.eventResult + "</td>");
            // Серт_АМ_БНО 93-94
            certificateData = getCertificationData(data.student_id, 7260348075183431472);
            reportString.AppendStr("<td class='align-center'>" + certificateData.certificateDate + "</td>");
            reportString.AppendStr("<td class='align-center'>" + certificateData.certificateResult + "</td>");            

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
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/report_ock_2025/report_ock_bno_" + ParseDate(Date()) + ".xlsx");

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

    resultData.message = "Agent is started";

    Response.Write(EncodeJson(resultData));
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
%>