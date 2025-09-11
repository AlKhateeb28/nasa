// 7169007381472566729
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function setForcedActivationDate(collaboratorId, fullName, flag) {
    isSaved = false;

    collaboratorDoc = tools.open_doc(collaboratorId);

    if(collaboratorDoc != undefined) {
        collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("forced_activation").value = 'true';

        collaboratorDoc.Save();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Set forced activation date. Flag: " + flag + " - " + fullName + " ( " + collaboratorId + " )");

        isSaved = true;
    }

    return isSaved;
}

function assignCoursesByFlag(execute, ids, flag) {
    isSaved = false;

    if(OptInt(execute) == 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Flag: " + flag);

        agent.message = "Получение данных " + flag + " ...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT TOP 50 cs.id, " +
            "       cs.fullname " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "         INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
            "                AND IIF(c.data.exist('(//custom_elems/custom_elem[name=''" + flag + "''])[1]/value[1]') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''" + flag + "''])[1]/value[1]', 'bit') AS INT)) = 1 " +
            "                AND IIF(c.data.exist('(//custom_elems/custom_elem[name=''forced_activation''])[1]/value[1]') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''forced_activation''])[1]/value[1]', 'bit') AS INT)) = 0 " +
            "                AND DAY(c.data.value('(//doc_info/creation)[1]/date[1]', 'datetime')) = DAY(GETDATE()) " +
            "                AND MONTH(c.data.value('(//doc_info/creation)[1]/date[1]', 'datetime')) = MONTH(GETDATE()) " +
            "                AND YEAR(c.data.value('(//doc_info/creation)[1]/date[1]', 'datetime')) = YEAR(GETDATE()) " +
            " WHERE UPPER(cs.code) NOT LIKE '%_MUC_%' " +
            "       AND (c.data.exist('(//custom_elems/custom_elem[name=''is_a_commerce_client''])') = 0 " +
            "           OR " +
            "       CAST(c.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS INT) = 0) "));

        total += ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (data in dataList) {
            coursesIds = ArrayExtractKeys(tools.read_object(ids), "course_id");

            for(courseId in coursesIds) {
                tools.activate_course_to_person(OptInt(data.id), courseId);

                isSaved = setForcedActivationDate(data.id, data.fullname, flag);
            }

            processed++;
            if(isSaved) {
                saved++;
            }

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
    }
}

var agentId = 7169007381472566729;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7169007381472566729";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;

var flags = [
    {flag: "in_program"},
    {flag: "is_rck"},
    {flag: "is_ock"},
    {flag: "is_fcc"},
    {flag: "is_roiv"},
    {flag: "is_partner"}
];

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    assignCoursesByFlag(Param.in_program, Param.in_program_courses_ids, "in_program");
    assignCoursesByFlag(Param.is_rck, Param.is_rck_courses_ids, "is_rck");
    assignCoursesByFlag(Param.is_ock, Param.is_ock_courses_ids, "is_ock");
    assignCoursesByFlag(Param.is_fcc, Param.is_fcc_courses_ids, "is_fcc");
    assignCoursesByFlag(Param.is_roiv, Param.is_roiv_courses_ids, "is_roiv");
    assignCoursesByFlag(Param.is_partner, Param.is_partner_courses_ids, "is_partner");
    assignCoursesByFlag(Param.with_no_right, Param.with_no_right_courses_ids, "With_no_right");

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

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}