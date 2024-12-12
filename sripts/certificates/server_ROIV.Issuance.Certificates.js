// 7404793652237988923
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getEducationMethodNames (collaboratorId, ids) {
    sql = "sql: " +
        " SELECT education_methods.name AS edu_name " +
        " FROM event_results " +
        "   LEFT JOIN events  ON events.id = event_results.event_id " +
        "   LEFT JOIN education_methods ON education_methods.id = events.education_method_id " +
        " WHERE events.type_id = 'education_method' " +
        "   AND events.education_method_id IN (" + ids + ") " +
        "   AND event_results.person_id = " + collaboratorId +
        "   AND event_results.is_assist = 1 " +
        "   AND events.status_id = 'close'";

    uniqueEducationNames = ArraySelectDistinct(
        ArraySelectAll(XQuery(sql)),
        "This.edu_name"
    );

    return ArrayMerge(uniqueEducationNames, "This.edu_name", ", ");
}

function copyCertificate(certificateId, certificateTopElement, regionName, extension) {
    result = CallServerMethod('tools', 'process_print_form', [ printFormId, certificateId, true ]);
    fileName = regionName + '_' + certificateTopElement.serial + certificateTopElement.number + '_' + certificateTopElement.person_fullname;
    filePath = "file:///E:/Websoft/Cert/" + certificateTypeId + '/' + fileName + '.' + extension;

    CopyUrl(filePath, result);
}

if (LdsIsServer ) {
    var agentId = 7404793652237988923;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "aa_agent_7404793652237988923";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;

    var dateFrom = Param.date_from == '' ? '01.01.2000 00:00:00' : Param.date_from
    var dateTo = Param.date_to == '' ? ParseDate(Date()) + ' 23:59:59' : Param.date_to

    var certificateTypeId = 7069723285559858963;
    var printFormId = 7069755374566124853;

    var educationMethodsIds = ArrayMerge(tools.read_object(Param.edu_meths), "This.__value", ",");

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id:  " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        printFormList = XQuery( 'for $elem in print_forms where $elem/id = ' + printFormId + ' return $elem' );
        printFormDoc = ArrayFirstElem(printFormList);

        collaboratorList = ArrayDirect(XQuery("sql:" +
            " SET DATEFORMAT dmy; DECLARE @date_from datetime = '" + dateFrom + "'; DECLARE @date_to datetime = '" + dateTo + "'; " +
            " " +
            " SELECT DISTINCT cs.id, rs.name AS region_name " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "   INNER JOIN [WTDB].[dbo].org ON cs.org_id = org.id " +
            "   INNER JOIN [WTDB].[dbo].regions rs ON org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') = rs.id " +
            "   INNER JOIN [WTDB].[dbo].event_results ers ON cs.id = ers.person_id AND ers.is_assist = 1 " +
            "   INNER JOIN [WTDB].[dbo].events es ON  ers.event_id = es.id " +
            "       AND es.education_org_id = 6856735269184478330 " +
            "       AND es.education_method_id IN (" + educationMethodsIds + ") " +
            "       AND es.finish_date BETWEEN @date_from AND @date_to " +
            "       AND es.status_id = 'close' " +
            " WHERE cs.code LIKE '%load_muc%' "));

        total = ArrayCount(collaboratorList);

        agent.refreshChart = 1;
        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (collaborator in collaboratorList) {
            certificateList = "for $elem in certificates where $elem/type_id=" + certificateTypeId + " and $elem/person_id=" + collaborator.id + " return $elem";
            certificate = ArrayOptFirstElem(XQuery(certificateList));

            uniqueEducationMethodNames = getEducationMethodNames(collaborator.id, educationMethodsIds);

            if (certificate == undefined) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] NEW certificate");

                if (uniqueEducationMethodNames != "") {
                    certificateDoc = tools.create_certificate_to_person(collaborator.id, certificateTypeId);

                    docCertificateTE = certificateDoc.TopElem;
                    docCertificateTE.serial = "РК";
                    docCertificateTE.delivery_date = Date();
                    docCertificateTE.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                    certificateDoc.Save();

                    copyCertificate(certificateDoc.DocID, docCertificateTE, collaborator.region_name, printFormDoc.type.ForeignElem.extension);

                    saved++;
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] EXISTING certificate. Edu.Names: " + uniqueEducationMethodNames);
                if (uniqueEducationMethodNames != "") {
                    certificateDoc = tools.open_doc(certificate.id);

                    if(certificateDoc != undefined) {
                        docCertificateTE = certificateDoc.TopElem;

                        addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate.ID: " + certificate.id + " Serial: " + docCertificateTE.serial);

                        if(docCertificateTE.serial == "") {
                            docCertificateTE.serial = "РК";
                        }

                        docCertificateTE.custom_elems.ObtainChildByKey("edu_prog_names").value = uniqueEducationMethodNames;
                        certificateDoc.Save();

                        copyCertificate(certificate.id, docCertificateTE, collaborator.region_name, printFormDoc.type.ForeignElem.extension);

                        saved++;
                    } else {
                        skipped++;
                    }
                }
            }

            processed++;

            if (processed % 10 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if (processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}