// 7230203611008990351
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

try {
    var agentId = 7230203611008990351;
    var loggerName = "agent_7230203611008990351";

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT fms.object_id AS group_id " +
        " FROM [WTDB].[dbo].func_managers fms " +
        "    LEFT JOIN [WTDB].[dbo].groups ON groups.id = fms.object_id " +
        "    LEFT JOIN [WTDB].[dbo].[group] g ON g.id = groups.id " +
        " WHERE fms.catalog = 'group' " +
        "  AND groups.person_num != 0 " +
        "  AND fms.person_id = " + curUserID +
        "  AND fms.boss_type_id = 6878899960667451125 "));

    final_arr = [];

    if(ArrayCount(dataList) > 0) {
        groupDoc = tools.open_doc(OptInt(dataList[0].group_id));

        if(groupDoc != undefined) {
            for (collaborator in groupDoc.TopElem.collaborators) {
                arr = ArraySelectAll(XQuery("sql: " +
                    " WITH _view AS ( " +
                    "        SELECT id, " +
                    "               person_id, " +
                    "               course_id, " +
                    "               start_usage_date, " +
                    "               start_learning_date, " +
                    "               last_usage_date, " +
                    "               score, " +
                    "               state_id, " +
                    "               is_self_enrolled AS self " +
                    "        FROM [WTDB].[dbo].learnings " +
                    "        WHERE person_id = " + collaborator.collaborator_id +
                    "    UNION " +
                    "        SELECT id, " +
                    "               person_id, " +
                    "               course_id, " +
                    "               start_usage_date, " +
                    "               start_learning_date, " +
                    "               last_usage_date, " +
                    "               score, " +
                    "               state_id, " +
                    "               is_self_enrolled AS self " +
                    "        FROM [WTDB].[dbo].active_learnings " +
                    "        WHERE person_id = " + collaborator.collaborator_id +
                    " ) " +
                    " SELECT _view.id, " +
                    "       CASE _view.state_id " +
                    "           WHEN 0 THEN 'Назначен' " +
                    "           WHEN 1 THEN 'В процессе' " +
                    "           WHEN 2 THEN 'Завершен' " +
                    "           WHEN 3 THEN 'Не пройден' " +
                    "           WHEN 4 THEN 'Пройден' " +
                    "           WHEN 5 THEN 'Просмотрен' " +
                    "           END AS status, " +
                    "       IIF(_view.self = 0, '', 'Самостоятельно')  AS self, " +
                    "       cs.fullname AS fullname, " +
                    "       cs.email AS email, " +
                    "       os.code AS inn, " +
                    "       os.name AS org_name, " +
                    "       cos.code AS course_code, " +
                    "       cos.name AS course_name, " +
                    "       _view.start_usage_date AS start_usage, " +
                    "       _view.start_learning_date AS start_learning, " +
                    "       _view.last_usage_date AS last_usage, " +
                    "       _view.score, " +
                    "       DATEDIFF(minute, _view.start_learning_date, _view.last_usage_date) AS  duration, " +
                    "       rs.code AS region_code, " +
                    "       rs.name AS region_name " +
                    " FROM _view " +
                    "         INNER JOIN [WTDB].[dbo].courses cos ON _view.course_id = cos.id AND cos.code LIKE '%IBP-COURSE%' " +
                    "         INNER JOIN [WTDB].[dbo].collaborators cs ON _view.person_id = cs.id " +
                    "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                    "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
                    "         INNER JOIN [WTDB].[dbo].regions AS rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id "));

                for (elem in arr) {
                    obj = {};

                    for (fldElem in elem) {
                        obj.SetProperty(fldElem.Name, String(fldElem));
                    }

                    final_arr.push(obj);
                }
            }
        } else {
            throw new Error("Группа с ID " + curUserID + " не найден!");
        }
    } else {
        throw new Error("Сотрудник с ID " + dataList[0].group_id + " не найдена!");
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] All finished");

    SORT.FIELD;
    PAGING.MANUAL = false;
    PAGING.SIZE = 10;
    PAGING.TOTAL = ArrayCount(final_arr);
    RESULT = ArraySort(final_arr, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));

    COLUMNS = ([
        {"data": "fullname", "hidden": false, "sortable": true, "title": "ФИО"},
        {"data": "email", "hidden": false, "sortable": true, "title": "email"},
        {"data": "inn", "hidden": false, "sortable": true, "title": "ИНН"},
        {"data": "org_name", "hidden": false, "sortable": true, "title": "Название организации"},
        {"data": "region_code", "hidden": false, "sortable": true, "title": "Регион"},
        {"data": "region_name", "hidden": false, "sortable": true, "title": "Название региона"},
        {"data": "course_code", "hidden": false, "sortable": true, "title": "Код курса"},
        {"data": "course_name", "hidden": false, "sortable": true, "title": "Название курса"},
        {"data": "start_usage", "hidden": false, "sortable": true, "title": "Дата активации"},
        {"data": "self", "hidden": false, "sortable": true, "title": "Тип активации"},
        {"data": "start_learning", "hidden": false, "sortable": true, "title": "Дата начала"},
        {"data": "last_usage", "hidden": false, "sortable": true, "title": "Дата завершения"},
        {"data": "duration", "hidden": false, "sortable": true, "title": "Время прохождения"},
        {"data": "score", "hidden": false, "sortable": true, "title": "Балл"},
        {"data": "status", "hidden": false, "sortable": true, "title": "Статус курса"},
        {"data": "id", "hidden": false, "sortable": true, "title": "PRIMARY KEY"}
    ])
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}
