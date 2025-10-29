// 7216028827362718788
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (!LdsIsServer) {
    ids = OBJECTS_ID_STR.split(";");

    selected = [];

    try{
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT id, " +
            "       name" +
            " FROM [WTDB].[dbo].professional_areas " +
            " ORDER BY name"));

        var areaList = [];

        for (data in dataList) {
            area = {};
            area.id = OptInt(data.id);
            area.name = data.name;

            areaList.push(area);
        }

        var dlgDoc = OpenDoc("//wtv/wtv_dlg_edit_list_item.xml");
        var options = [{
            name: "professional_area",
            title: "Сфера",
            type: "combo",
            values: areaList
        }];

        for (option in options) {
            child = dlgDoc.TopElem.fields.AddChild();
            child.name = option.name;
            child.title = option.title;
            child.type = option.type;
            if (option.HasProperty("values")) {
                for (value in option.values) {
                    entry = child.entries.AddChild();
                    entry.id = value.id;
                    entry.value = value.name;
                }
            }
        }

        ActiveScreen.ModalDlg(dlgDoc);

        selected = ArrayExtract(dlgDoc.TopElem.fields, "({title: RValue(This.title), value: RValue(This.value)})");
    } catch(err) {
        alert("В процессе выполнения агента произошла ошибка.");
        Cancel();
    };

    if (ArrayCount(selected) > 0 && selected[0].value != "") {
        var agentId = 7216028827362718788;
        var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7216028827362718788";
        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

        var total = 0;
        var processed = 0;
        var saved = 0;

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        try {
            total = ArrayCount(ids);

            agent.total = total;
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.message = "Обработка данных...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            for (key in ids){
                orgDoc = tools.open_doc(OptInt(key));

                if(orgDoc != undefined) {
                    orgDoc.TopElem.custom_elems.ObtainChildByKey("professional_area").value = OptInt(selected[0].value);
                    orgDoc.Save();

                    saved++;
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " +  key + " is not exist!");
                }

                processed++;

                if (processed % 100 == 0) {
                    agent.processed = processed;
                    agent.saved = saved;
                    refreshMsPerRow(agent, startDate, processed);
                    if (ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }
                }

            };

            agent.state = 1;
            agent.processed = processed;
            agent.saved = saved;
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
    } else {
        alert("Не выбрана 'Сфера'.");
        Cancel();
    };
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}