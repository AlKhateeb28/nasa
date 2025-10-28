// 7203977764643545140
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function verifyIncomingParameters(code, name, finish, groupName, url) {
    if(code == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param 'code' is empty!");

        errorMessage = "Пустой параметр 'code'";

        alert(errorMessage);

        throw errorMessage;
    } else if(name == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param 'name' is empty!");

        errorMessage = "Пустой параметр 'name'";

        alert(errorMessage);

        throw errorMessage;
    } else if(finish == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param 'finish' is empty!");

        errorMessage = "Пустой параметр 'finish'";

        alert(errorMessage);

        throw errorMessage;
    } else if(groupName == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param 'group_name' is empty!");

        errorMessage = "Пустой параметр 'group_name'";

        alert(errorMessage);

        throw errorMessage;
    } else if(url == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Param 'direct_url' is empty!");

        errorMessage = "Пустой параметр 'direct_url'";

        alert(errorMessage);

        throw errorMessage;
    }

    if(StrContains(url, "courses_catalog")) {
        return 1;
    } else {
        return 2;
    }
}

if (!LdsIsServer) {
    var agentId = 7203977764643545140;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7203977764643545140";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        // CHECK INCOMING PARAMETERS
        paramCode = Param.code;
        paramName = Param.name;
        paramState = Param.state;
        paramFinish = Param.finish_date;
        paramBenefitId = Param.benefit_id;
        paramMax = Param.max_from_org;
        paramGroupName = Param.group_name;
        paramUrl = Param.direct_url;
        paramCoursesList = Param.courses_list;
        paramPortalPages = Param.portal_pages;

        total = verifyIncomingParameters(paramCode, paramName, paramFinish, paramGroupName, paramUrl);

        agent.total = total;
        agent.processed = processed;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Проверка параметров...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        errorMessage = "";

        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Проверка существования промокода...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT id " +
            " FROM [WTDB].[dbo].benefit_items " +
            " WHERE UPPER(code) = '" + StrUpperCase(paramCode) + "' "));

        if(ArrayCount(dataList) > 0) {
            errorMessage = "Промокод с кодом '" + paramCode + "' уже зарегистрирован";

            alert(errorMessage);

            throw errorMessage;
        }

        processed++;

        agent.message = "Создание группы...";
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        // GET EXIST OR ADD NEW GROUP
        groupId = null;

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT id " +
            " FROM [WTDB].[dbo].groups " +
            " WHERE UPPER(code) = '" + StrUpperCase(paramCode) + "' "));

        if(ArrayCount(dataList) > 0) {
            groupId = OptInt(dataList[0].id);
        } else {
            groupDoc = tools.new_doc_by_name( 'group', false );
            groupDoc.BindToDb( DefaultDb );

            groupDocTE = groupDoc.TopElem;
            groupDocTE.code = paramCode;
            groupDocTE.name = paramGroupName;

            groupDoc.Save();

            groupId = groupDoc.DocID;
        }

        resourceId = "";

        if(Param.create_image == 1) {
            processed++;

            agent.message = "Создание ресурса картинки...";
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.processed = processed;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            // GET EXIST OR ADD NEW IMAGE RESOURCE
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT id " +
                " FROM [WTDB].[dbo].resources " +
                " WHERE UPPER(code) = '" + StrUpperCase(paramCode) + "' "));

            if (ArrayCount(dataList) > 0) {
                resourceId = OptInt(dataList[0].id);
            } else {
                resourceDoc = tools.new_doc_by_name('resource', false);
                resourceDoc.BindToDb(DefaultDb);

                resourceDocTE = resourceDoc.TopElem;
                resourceDocTE.code = paramCode;
                resourceDocTE.name = "Картинка для промокода " + paramCode;
                resourceDocTE.type = "img";
                resourceDocTE.allow_unauthorized_download = 1;

                resourceDoc.Save();

                resourceId = resourceDoc.DocID;
            }
        }

        processed++;

        agent.message = "Создание промокода...";
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        // ADD NEW promo code - benefit_items entity ()
        promoDoc = tools.new_doc_by_name( 'benefit_item', false );
        promoDoc.BindToDb( DefaultDb );

        promoDocTE = promoDoc.TopElem;
        promoDocTE.code = paramCode;
        promoDocTE.name = paramName;
        promoDocTE.status = paramState;
        promoDocTE.finish_date = paramFinish;
        promoDocTE.benefit_id = paramBenefitId;
        promoDocTE.custom_elems.ObtainChildByKey("group").value = groupId;
        promoDocTE.custom_elems.ObtainChildByKey("max_from_org").value = paramMax;
        promoDocTE.custom_elems.ObtainChildByKey("direct_url").value = paramUrl;
        promoDocTE.custom_elems.ObtainChildByKey("image_id").value = resourceId;

        promoDoc.Save();

        if(total == 1) {
            processed++;

            agent.message = "Создание карточки индивидуального заказа...";
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.processed = processed;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            // ADD NEW INDIVIDUAL ORDER CARD
            indOrderCardDoc = tools.new_doc_by_name('cc_ind_order_card', false);
            indOrderCardDoc.BindToDb(DefaultDb);

            indOrderCardDocTE = indOrderCardDoc.TopElem;
            indOrderCardDocTE.num = paramCode;
            indOrderCardDocTE.org_id = 6650093861350539604; // FCK
            indOrderCardDocTE.start_date = Date();
            indOrderCardDocTE.finish_date = paramFinish;
            indOrderCardDocTE.stage_1_group_id = groupId;
            indOrderCardDocTE.stage_1_start_date = Date();
            indOrderCardDocTE.stage_1_finish_date = paramFinish;

            for (course in ParseJson(paramCoursesList)) {
                indOrderCardDocTE.stage_1_courses.ObtainChildByKey(course.__value);
            }

            for (page in ParseJson(paramPortalPages)) {
                indOrderCardDocTE.stage_1_documents.ObtainChildByKey(page.__value);
            }

            indOrderCardDoc.Save();

            processed++;

            // RUN AGENT №1 WITH ID=7107466891424790180
            tools.start_agent(7107466891424790180);
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Закончено. Агент по индивидуальным карточкам заказа №1 запущен.";
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
}
