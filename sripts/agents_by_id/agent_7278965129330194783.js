// 7278965129330194783
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (!LdsIsServer ) {
    var agentId = 7278965129330194783;
    var userId = tools.cur_user.Object.id;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7278965129330194783";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var groupId = 7270479793740127863 // группа

    x = 0 // Счётчик выкинутых
    y = 0 // Счётчик добавленных

    LastDay = (Int(Param.LastDay) > 0) ? Int(Param.LastDay) : 1
    xDay = DateOffset(Date(), (-86400 * LastDay))

    sql1 = "sql: SELECT colls.* FROM [WTDB].[dbo].collaborators AS colls INNER JOIN [WTDB].[dbo].orgs AS orgs ON orgs.id = colls.org_id WHERE orgs.modification_date > GETDATE()-" + LastDay;
    sql2 = "sql: SELECT colls.* FROM [WTDB].[dbo].collaborators AS colls INNER JOIN [WTDB].[dbo].orgs AS orgs ON orgs.id = colls.org_id WHERE orgs.modification_date > GETDATE()-" + LastDay + " AND colls.is_dismiss = 'true'";

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    agent.message = "Получение данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    try {
        arr1 = ArrayDirect(XQuery(sql1));
        arr2 = ArrayDirect(XQuery(sql2));

        processed = 0;
        total = ArrayCount(arr);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.refreshChart = 1;
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

// Проверка группы на условия отключения
// если вообще есть сотрудники в группе и есть организации по условию то найти и исключить
        groupDoc = OpenDoc(UrlFromDocID(groupId));
        /*if (ArrayCount(groupDoc.TopElem.collaborators) > 0 )
        {
            collsInGroup = ArraySelectAll(groupDoc.TopElem.collaborators); // получение списка сотрудников в группе
            for (col_gr in collsInGroup) // для каждого сотрудников группы
            {

                col_g = OpenDoc(UrlFromDocID(Int(col_gr.collaborator_id))) // карточка сотрудника


                // Если сотрудник не имеет флага отключения и не уволен, то удалить из группы
                if (col_g.TopElem.is_dismiss != true && col_g.TopElem.custom_elems.ObtainChildByKey('is_project_ended').value != 'true')
                {
                    //alert(col_g.TopElem.name + ' '+ col_g.TopElem.is_dismiss + ' ' + col_g.TopElem.custom_elems.ObtainChildByKey('is_project_ended').value)
                    col_gr.Delete() // удалить из списка группы
                    x++
                }
            }
            groupDoc.Save()
        }*/

        for (result in arr1) {
            col_g_1 = OpenDoc(UrlFromDocID(result.id)); // Открываем карточку сотр
            if (col_g_1.TopElem.custom_elems.ObtainChildByKey('is_project_ended').value == 'true') // проверка на закрытый проект
            {
                //alert(org_.TopElem.custom_elems.ObtainChildByKey('is_project_ended').value)
                groupDoc.TopElem.collaborators.ObtainChildByKey(col_g_1.TopElem.id) // добавляем сотрудника в группу
                y++
            }
        }

        for (result in arr1) {
            groupDoc.TopElem.collaborators.ObtainChildByKey(result.id)
            y++
        }

        groupDoc.Save()

        alert('Агент формирования группы для отключения от библиотеки работу завершил. Удалено из группы ' + x + ' / Соответствует условиям ' + y)
    } catch (e) {

    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}
// colls 6638589142806102656 is_project_ended = 'true'
// colls 6638589130257689235 is_project_ended = 'false'