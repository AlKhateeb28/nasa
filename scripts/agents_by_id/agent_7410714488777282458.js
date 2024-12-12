// 7410714488777282458
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var backupData = {};
source = "active_learnings";

if (LdsIsServer ) {
    var agentId = 7410714488777282458;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7410714488777282458";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var skipped = 0;
    var saved = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        isWillProcessed = false;

        organizationSqlString = "";
        courseSqlString = "";
        projectEndedSqlString = "";

        if(OptInt(Param.type) == 1) {
            if(Param.org_id != "") {
                organizationSqlString = "AND os.id = " + Param.org_id;
                isWillProcessed = true;
            }

            if(Param.course_code != "") {
                courseSqlString = "AND cous.code LIKE '" + Param.course_code + "%'";
            }
        } else {
            if(OptInt(Param.type) == 2) {
                projectEndedSqlString = "AND o.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') = 'true'";

                if(Param.course_code != "") {
                    courseSqlString = "AND cous.code LIKE '" + Param.course_code + "%'";
                }

                isWillProcessed = true;
            }
        }

        if(isWillProcessed) {
            activeLearningList = ArrayDirect(XQuery("sql: " +
                " SELECT als.id " +
                " FROM [WTDB].[dbo].active_learnings als " +
                "   INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id " +
                "   INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " + organizationSqlString +
                "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " + projectEndedSqlString +
                "   INNER JOIN [WTDB].[dbo].courses cous ON als.course_id = cous.id " + courseSqlString +
                " WHERE als.state_id IN (0, 1) "));

            total = ArrayCount(activeLearningList);

            agent.total = total;
            agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
            agent.message = "Обработка данных...";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();

            for (activeLearning in activeLearningList) {
                activeLearningDoc = tools.open_doc(activeLearning.id);

                if(activeLearningDoc != undefined) {
                    //DeleteDoc(UrlFromDocID(activeLearning.id));

                    saved++;
                } else {
                    addLogMessage(loggerName, "[agent.id: " + agentId + "] ActiveLearning with ID " + activeLearning.id + " not exist!");

                    skipped++;
                }

                processed++;

                if (processed % 50 == 0) {
                    agent.processed = processed;
                    agent.skipped = skipped;
                    agent.saved = saved;
                    refreshMsPerRow(agent, startDate, processed);
                    if (ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }
                }
                if (processed % 100 == 0) {
                    addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                    );
                }
            }

            agent.message = "Закончено";
        } else {
            agent.message = "Выборка не выполнялась";
        }

        agent.state = 1;
        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            total + " total, ",
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
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}