// 7426708767212722308
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 7426708767212722308;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate = new Date();
var loggerName = "agent_7426708767212722308";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;

agent.message = "Пересоздание таблицы 'Белое & Серое'...";
ws = sendMessageToWebsocket(ws, agent);

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " BEGIN TRY DROP TABLE _white_gray_ids; END TRY BEGIN CATCH END CATCH " +
        " " +
        " DROP TABLE " + "_white_gray_ids; " +
        " " +
        " SELECT cs.id, cs.org_id, cs.fullname, cs.login, cs.is_dismiss " +
        " INTO _tmp0 " +
        " FROM [WTDB].[dbo].collaborators cs " +
        " WHERE cs.is_dismiss = 0; " +
        " " +
        " WITH _view AS ( " +
        "        SELECT _tmp0.id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "        FROM _tmp0 " +
        "        WHERE _tmp0.login NOT LIKE '%_muc_%' " +
        "    ) " +
        " SELECT _view.id, _view.id AS white_id, _view.org_id, _view.fullname, _view.login " +
        " INTO _tmp1 " +
        " FROM _view; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT _tmp0.id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "    FROM _tmp0 " +
        "    WHERE _tmp0.login LIKE '%load_muc%' " +
        " ) " +
        " SELECT _tmp1.id, _tmp1.white_id, _view.id AS fcc_gray_id, _tmp1.org_id, _tmp1.fullname, _tmp1.login " +
        " INTO _tmp2 " +
        " FROM _tmp1 " +
        "    LEFT JOIN _view ON UPPER(_tmp1.fullname) = UPPER(_view.fullname) AND _view.org_id = _tmp1.org_id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT _tmp0.id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "    FROM _tmp0 " +
        "    WHERE _tmp0.login LIKE '%rck_muc%' " +
        " ) " +
        " SELECT _tmp2.id, _tmp2.white_id, _tmp2.fcc_gray_id, _view.id AS rck_gray_id, _tmp2.org_id, _tmp2.fullname, _tmp2.login " +
        " INTO _tmp3 " +
        " FROM _tmp2 " +
        "         LEFT JOIN _view ON UPPER(_tmp2.fullname) = UPPER(_view.fullname) AND _view.org_id = _tmp2.org_id; " +
        " " +
        " WITH _view AS ( " +
        "    SELECT _tmp0.id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "    FROM _tmp0 " +
        "    WHERE _tmp0.login LIKE '%tren_muc%' " +
        " ) " +
        " SELECT _tmp3.id, _tmp3.white_id, _tmp3.fcc_gray_id, _tmp3.rck_gray_id, _view.id AS tren_gray_id, _tmp3.org_id, _tmp3.fullname, _tmp3.login " +
        " INTO _tmp4 " +
        " FROM _tmp3 " +
        "         LEFT JOIN _view ON UPPER(_tmp3.fullname) = UPPER(_view.fullname) AND _view.org_id = _tmp3.org_id; " +
        " " +
        " SELECT * " +
        " INTO _tmp5 " +
        " FROM " +
        " (SELECT _tmp0.id, NULL AS white_id, _tmp0.id AS fcc_gray_id, NULL AS rck_gray_id, NULL AS tren_gray_id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "      FROM _tmp0 " +
        "      WHERE (SELECT COUNT(*) " +
        "             FROM _tmp4 " +
        "             WHERE UPPER(_tmp4.fullname) = UPPER(_tmp0.fullname) " +
        "               AND _tmp4.org_id = _tmp0.org_id " +
        "               AND (_tmp4.id <> _tmp0.id OR _tmp4.fcc_gray_id <> _tmp0.id)) = 0 " +
        "        AND _tmp0.login LIKE '%load_muc_%' " +
        "      UNION " +
        "      SELECT * " +
        "      FROM _tmp4) AS _veiw; " +
        " " +
        " SELECT * " +
        " INTO _tmp6 " +
        " FROM " +
        "    (SELECT _tmp0.id, NULL AS white_id, NULL AS fcc_gray_id, _tmp0.id AS rck_gray_id, NULL AS tren_gray_id, _tmp0.org_id, _tmp0.fullname, _tmp0.login " +
        "     FROM _tmp0 " +
        "     WHERE (SELECT COUNT(*) " +
        "            FROM _tmp4 " +
        "            WHERE UPPER(_tmp4.fullname) = UPPER(_tmp0.fullname) " +
        "              AND _tmp4.org_id = _tmp0.org_id " +
        "              AND (_tmp4.id <> _tmp0.id OR _tmp4.fcc_gray_id <> _tmp0.id)) = 0 " +
        "       AND _tmp0.login LIKE '%rck_muc_%' " +
        "     UNION " +
        "     SELECT * " +
        "     FROM _tmp5) AS _veiw; " +
        " " +
        " SELECT id, white_id, fcc_gray_id, rck_gray_id, tren_gray_id " +
        " INTO _white_gray_ids " +
        " FROM " +
        "    (SELECT _tmp0.id, NULL AS white_id, NULL AS fcc_gray_id, NULL AS rck_gray_id, _tmp0.id AS tren_gray_id " +
        "     FROM _tmp0 " +
        "     WHERE (SELECT COUNT(*) " +
        "            FROM _tmp4 " +
        "            WHERE UPPER(_tmp4.fullname) = UPPER(_tmp0.fullname) " +
        "              AND _tmp4.org_id = _tmp0.org_id " +
        "              AND (_tmp4.id <> _tmp0.id OR _tmp4.fcc_gray_id <> _tmp0.id)) = 0 " +
        "       AND _tmp0.login LIKE '%tren_muc_%' " +
        "     UNION " +
        "     SELECT _tmp6.id, _tmp6.white_id, _tmp6.fcc_gray_id, _tmp6.rck_gray_id, _tmp6.id AS tren_gray_id " +
        "     FROM _tmp6) AS _veiw; " +
        " " +
        " DROP TABLE " + "_tmp0; DROP TABLE _tmp1; DROP TABLE _tmp2; DROP TABLE _tmp3; DROP TABLE _tmp4; DROP TABLE _tmp5; DROP TABLE _tmp6; " +
        " SELECT * FROM " + "_white_gray_ids "));

    total = ArrayCount(dataList);

    agent.state = 1;
    agent.total = total;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total",
        null,
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

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
