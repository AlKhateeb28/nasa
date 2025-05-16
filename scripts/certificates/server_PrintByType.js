// 7395130741080085278
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var relatedPrintForms = [
    {certificateId:5293675553778464279, serial: null, printFormId: 7156641934046394931},
    {certificateId:7057492735637724805, serial: "ВТ", printFormId: 7058806960858407022},
    {certificateId:7057492735637724805, serial: "К", printFormId: 7255287443703667583},
    {certificateId:7104191211056400336, serial: null, printFormId: 7104194586027166332},
    {certificateId:7104191280476593480, serial: null, printFormId: 7104194604105021334},
    {certificateId:7103979688639225943, serial: null, printFormId: 7171757428961523981},
    {certificateId:7003613659490893183, serial: null, printFormId: 7038882320739342331},
    {certificateId:7069723285559858963, serial: null, printFormId: 7069755374566124853},
    {certificateId:7348016482452706788, serial: null, printFormId: 7264581159128683792},
    {certificateId:7171733281797140705, serial: null, printFormId: 7038882320739342331},
    {certificateId:7264898518546059464, serial: null, printFormId: 7264581159128683792},
    {certificateId:7015457522352069961, serial: null, printFormId: 7037386104057109283}
];

function getRelatedPrintFormId(typeId, serial) {
    for (relatedPrintForm in relatedPrintForms) {
        if(relatedPrintForm.certificateId == typeId) {
            if(relatedPrintForm.serial != null) {
                if(relatedPrintForm.serial == serial) {
                    return relatedPrintForm.printFormId;
                }
            } else {
                return relatedPrintForm.printFormId;
            }
        }
    }

    return null;
}

if (LdsIsServer ) {
    var agentId = 7395130741080085278;
    var userId = curUserID;
    var msPerRecord = 0.78;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7395130741080085278";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        certificateTypeId = OptInt(Param.certificateId);

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        var printFormId = null;
        var fieldType = null;

        certificateList = ArraySelectAll( XQuery( "sql: " +
            " SELECT certificates.id, " +
            "   certificates.serial, " +
            "   certificates.number, " +
            "   certificates.person_fullname, " +
            "   regions.name AS reg_name " +
            " FROM [WTDB].[dbo].certificates " +
            "   LEFT JOIN [WTDB].[dbo].org ON certificates.person_org_id = org.id " +
            "   LEFT JOIN [WTDB].[dbo].regions ON regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') " +
            " WHERE certificates.type_id = " + certificateTypeId
        ));

        total = ArrayCount(certificateList);

        agent.message = "Обработка данных...";
        agent.total = total;
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        for (certificate in  certificateList) {
            if(printFormId == null) {
                printFormId = getRelatedPrintFormId(certificateTypeId, certificate.serial);

                if(printFormId == null) {
                    throw new Error("Не найден связанный PrintForm!");
                }

                printFormList = XQuery( 'for $elem in print_forms where $elem/id = ' + printFormId + ' return $elem' );
                printFormDoc = ArrayFirstElem(printFormList);

                fieldType = printFormDoc.type.ForeignElem;
            }

            result = CallServerMethod('tools', 'process_print_form', [ printFormId, certificate.id, true ]);
            fileName = certificate.reg_name + '_' + certificate.serial + certificate.number + '_' + certificate.person_fullname;
            filePath = "file:///E:/Websoft/Cert/" + certificateTypeId + '/' + fileName + '.' + fieldType.extension;

            addLogMessage(loggerName, "[agent.id: " + agentId + "] File: " + fileName);

            CopyUrl(filePath, result);

            processed++;

            if (processed % 10 == 0) {
                agent.processed = processed;
                refreshMsPerRow(agent, startDate, processed);
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

        agent.state = 1;
        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}