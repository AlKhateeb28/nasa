// 7164375705371632561
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function putToPersonArray(element) {
    index = -1;

    for (i = 0; i < ArrayCount(persons); i++ ) {
        if(StrUpperCase(persons[i].fullname) == StrUpperCase(element.fullname)) {
            index = i;

            break;
        }
    }

    if(index > -1) {
        if(OptInt(persons[index].code) < OptInt(element.code)) {
            persons[index].code = element.code;
            persons[index].email = element.email;
        }
    } else {
        persons.push(element);
    }
}

var agentId = 7164375705371632561;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7164375705371632561";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;
var saved = 0;
var skipped = 0;
var notFound = 0;

var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

var persons = [];
var sorted = [];

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    groupDoc = tools.open_doc(6899725301946718140);

    if(groupDoc != undefined) {
        groupDocTE = groupDoc.TopElem;

        total = ArrayCount(groupDocTE.collaborators);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("<html>");
        reportString.AppendStr("<style>");
        reportString.AppendStr(".orange_header {background-color: #ffcc99; width: 200px;}");
        reportString.AppendStr(".green_header {background-color: #92d050; width: 200px;}");
        reportString.AppendStr(".row_height {height: 2px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='orange_header' style='width: 80px; text-align: center'>Код</td>");
        reportString.AppendStr("<td class='orange_header' style='width: 400px;'>ФИО</td>");
        reportString.AppendStr("<td class='orange_header'>Email в системе</td>");
        reportString.AppendStr("<td class='orange_header'>В Альпине</td>");
        reportString.AppendStr("<td class='orange_header'>В Миф</td>");
        reportString.AppendStr("<td class='green_header'>Фамилия</td>");
        reportString.AppendStr("<td class='green_header'>Имя</td>");
        reportString.AppendStr("<td class='green_header'>Отчество</td>");
        reportString.AppendStr("<td class='green_header'>Email</td>");
        reportString.AppendStr("<td class='green_header'>Пароль</td>");
        reportString.AppendStr("</tr>");

        for (collaborator in groupDocTE.collaborators) {
            collaboratorDoc = tools.open_doc(collaborator.collaborator_id);

            if (collaboratorDoc != undefined) {
                collaboratorDocTE = collaboratorDoc.TopElem;

                element = {};
                element.code = collaboratorDocTE.code;
                element.fullname = collaboratorDocTE.fullname;
                element.email = collaboratorDocTE.email;

                putToPersonArray(element);
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + collaborator.collaborator_id + " is not exist!");
            }
        }

        step = 1;

        for (person in persons) {
            reportString.AppendStr("<tr>");
            reportString.AppendStr("<td>" + person.code + "</td>");
            reportString.AppendStr("<td>" + person.fullname + "</td>");
            reportString.AppendStr("<td>" + person.email + "</td>");
            if(step == 1) {
                reportString.AppendStr("<td>ИНДЕКС(AL!$A:$A; ПОИСКПОЗ(C2;AL!$A:$A;0))</td>");
                reportString.AppendStr("<td>ИНДЕКС(MF!$A:$A; ПОИСКПОЗ(C2;MF!$A:$A;0))</td>");
            } else {
                reportString.AppendStr("<td></td>");
                reportString.AppendStr("<td></td>");
            }

            fullFIO = person.fullname + " #empty #empty";
            fioList = fullFIO.split(" ");

            reportString.AppendStr("<td>" + fioList[0] + "</td>");
            reportString.AppendStr("<td>" + (fioList[1] == "#empty" ? "" : fioList[1]) + "</td>");
            reportString.AppendStr("<td>" + (fioList[2] == "#empty" ? "" : fioList[2]) + "</td>");
            reportString.AppendStr("<td>" + person.email + "</td>");
            if(step == 1) {
                reportString.AppendStr("<td>СЛУЧМЕЖДУ(100000;999999)</td>");
            } else {
                reportString.AppendStr("<td></td>");
            }
            reportString.AppendStr("</tr>");

            processed++;

            agent.processed = processed;
            agent.skipped = skipped;
            agent.saved = saved;
            agent.notFound = notFound;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            if (processed % 100 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                );
            }

            step++;
        }

        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        reportString.AppendStr("</table></html>");
        excel.LoadHtmlString(reportString.GetStr(), "");
        excel.SaveAs("E:/Websoft/Reports/import/person_to_library_" + ParseDate(Date()) + ".xlsx");

        reservedGroupDoc = tools.open_doc(7164400604808986532);

        if(reservedGroupDoc != undefined) {
            // SET GROUP COPY
            reservedGroupDocTE = reservedGroupDoc.TopElem;

            reservedGroupDocTE.collaborators.Clear();

            for (collaborator in groupDocTE.collaborators) {
                reservedGroupDocTE.collaborators.ObtainChildByKey(collaborator.collaborator_id);
            }

            reservedGroupDoc.Save();

            // CLEAR GROUP
            groupDoc.TopElem.collaborators.Clear();
            groupDoc.Save();
        }

    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID 6899725301946718140 is not exist!");
    }

    agent.state = 1;
    agent.processed = processed;
    agent.saved = saved;
    agent.skipped = skipped;
    agent.notFound = notFound;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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
