// 7220677842195404232
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var spheres = [
        {name: "БИБЛИОТЕК", id: "7195548998441105898"},
        {name: "ДВОРЕЦ КУЛЬТУРЫ", id: "7195548998441105898"},
        {name: "ДОМ-МУЗЕЙ", id: "7195548998441105898"},
        {name: "ДОСУГ", id: "7195548998441105898"},
        {name: "КИНОДОСУГОВЫЙ", id: "7195548998441105898"},
        {name: "КИНОТЕАТР", id: "7195548998441105898"},
        {name: "КЛУБНАЯ СИСТЕМА", id: "7195548998441105898"},
        {name: "УЧРЕЖДЕНИЕ КУЛЬТУРЫ", id: "7195548998441105898"},
        {name: "КРАЕВЕДЧЕСКИЙ", id: "7195548998441105898"},
        {name: "КУЛЬТУР", id: "7195548998441105898"},
        {name: "МОЛОДЕЖНЫЙ ЦЕНТР", id: "7195548998441105898"},
        {name: "МУЗЕЙ", id: "7195548998441105898"},
        {name: "МУЗЫКАЛЬНАЯ ШКОЛА", id: "7195548998441105898"},
        {name: "НАРОДНОГО ТВОРЧЕСТВА", id: "7195548998441105898"},
        {name: "КУЛЬТУРЫ И ОТДЫХА", id: "7195548998441105898"},
        {name: "ТЕАТР", id: "7195548998441105898"},
        {name: "ХУДОЖЕСТВЕННАЯ ШКОЛА", id: "7195548998441105898"},
        {name: "БИБЛИОТЕЧНАЯ", id: "7195548998441105898"},
        {name: "ШКОЛА ИСКУССТВ", id: "7195548998441105898"},
        {name: "ГИМНАЗИЯ", id: "7199067533224439890"},
        {name: "ДЕТСКИЙ САД", id: "7199067533224439890"},
        {name: "ДЕТСКО-ЮНОШЕСКОГО", id: "7199067533224439890"},
        {name: "ДОМ ДЕТСКОГО ТВОРЧЕСТВА", id: "7199067533224439890"},
        {name: "ДОМ ШКОЛЬНИКОВ", id: "7199067533224439890"},
        {name: "ДОПОЛНИТЕЛЬНОГО ОБРАЗОВАНИЯ ДЕТЕЙ", id: "7199067533224439890"},
        {name: "ДОШКОЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", id: "7199067533224439890"},
        {name: "КОЛЛЕДЖ", id: "7199067533224439890"},
        {name: "ЛИЦЕЙ", id: "7199067533224439890"},
        {name: "ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", id: "7199067533224439890"},
        {name: "ОЗДОРОВИТЕЛЬНО-ОБРАЗОВАТЕЛЬНЫЙ", id: "7199067533224439890"},
        {name: "ОСНОВНАЯ ШКОЛА", id: "7199067533224439890"},
        {name: "ОБРАЗОВАТЕЛЬНЫХ УЧРЕЖДЕНИЙ", id: "7199067533224439890"},
        {name: "ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА", id: "7199067533224439890"},
        {name: "СРЕДНЯЯ ШКОЛА", id: "7199067533224439890"},
        {name: "СТАНЦИЯ ЮНЫХ", id: "7199067533224439890"},
        {name: "ВНЕШКОЛЬНОЙ РАБОТЫ", id: "7199067533224439890"},
        {name: "ДОПОЛНИТЕЛЬНОГО ОБРАЗОВАНИЯ ДЕТЕЙ", id: "7199067533224439890"},
        {name: "РАЗВИТИЯ И ТВОРЧЕСТВА", id: "7199067533224439890"},
        {name: "РАЗВИТИЯ РЕБЕНКА", id: "7199067533224439890"},
        {name: "ШКОЛА-ИНТЕРНАТ", id: "7199067533224439890"},
        {name: "ШКОЛА-ЛИЦЕЙ", id: "7199067533224439890"},
        {name: "ИНСТИТУТ РАЗВИТИЯ ОБРАЗОВАНИЯ", id: "7199067805017158059"},
        {name: "НАУЧНОЕ УЧРЕЖДЕНИЕ", id: "7199067805017158059"},
        {name: "НАУЧНО-ИССЛЕДОВАТЕЛЬСКИЙ", id: "7199067805017158059"},
        {name: "ВЫСШЕГО ОБРАЗОВАНИЯ", id: "7199067805017158059"},
        {name: "МЕДИКО-ХИРУРГИЧЕСКИЙ", id: "7199068129538865039"},
        {name: "МЕДИЦИНСКИЙ", id: "7199068129538865039"},
        {name: "ЗДРАВООХРАНЕНИЯ", id: "7199068129538865039"},
        {name: "СОЦИАЛЬНОГО ОБСЛУЖИВАНИЯ", id: "7199068329439359865"},
        {name: "СОЦИАЛЬНОЕ КУЛЬТУРНОЕ", id: "7199068329439359865"},
        {name: "СОЦИАЛЬНО-КУЛЬТУРНЫЙ", id: "7199068329439359865"},
        {name: "СОЦИАЛЬНОЙ ПОМОЩИ", id: "7199068329439359865"},
        {name: "СПОРТИВНАЯ ШКОЛА", id: "7199068510062801481"},
        {name: "СПОРТИВНЫЙ", id: "7199068510062801481"},
        {name: "ФИЗИЧЕСКОЙ КУЛЬТУРЫ", id: "7199068510062801481"},
        {name: "ВОДОКАНАЛ", id: "7201123422191965889"},
        {name: "КАНАЛИЗАЦИОННОГО ХОЗЯЙСТВА", id: "7201123422191965889"},
        {name: "ТЕПЛОВЫЕ СЕТИ", id: "7201123422191965889"}
    ];

    var agentId = 7220677842195404232;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7220677842195404232";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var processed = 0;
    var saved = 0;
    var skipped = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for(i = 0; i < ArrayCount(spheres); i++) {
            professionalAreaId = spheres[i].id;

            if(StrBegins(professionalAreaId, "'")) {
                professionalAreaId = StrCharRangePos(professionalAreaId,1,StrCharCount(professionalAreaId) - 1);
            }

            hashTag = spheres[i].name;

            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT id " +
                " FROM [WTDB].[dbo].orgs " +
                " WHERE UPPER(name) LIKE UPPER('%" + hashTag + "%') "));

            for(data in dataList) {
                orgDoc = tools.open_doc(OptInt(data.id));

                if(orgDoc != undefined) {
                    if(orgDoc.TopElem.custom_elems.ObtainChildByKey("professional_area").value != professionalAreaId) {
                        orgDoc.TopElem.custom_elems.ObtainChildByKey("professional_area").value = professionalAreaId;
                        orgDoc.Save();

                        saved++;
                    }
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + data.id + " is not exist!");
                }

                processed++;

                agent.message = "Обработка данных... Хештэг: " + hashTag;
                agent.processed = processed;
                agent.saved = saved;
                agent.skipped = skipped;
                refreshMsPerRow(agent, startDate, processed);
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
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
            processed + " processed, ",
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