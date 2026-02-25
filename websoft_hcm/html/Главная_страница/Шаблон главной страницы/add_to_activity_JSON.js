<%
// 7253905325755555432
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

parameters = [];

function putToParametersList(pageId, mode, webTemplate, docId, objectId) {
    element = {};

    element.pageId = pageId;
    element.mode = mode;
    element.webTemplate = webTemplate;
    element.docId = docId;
    element.objectId = objectId;

    parameters.push(element);

}

function getFromParametersList(modeValue, webTemplateValue, docIdValue, objectIdValue) {
    if(modeValue == "doc_type") {
        for (parameter in parameters) {
            if (parameter.mode == modeValue && parameter.docId == OptInt(docIdValue)) {
                return parameter;
            }
        }
    } else if(modeValue == "") {
        for (parameter in parameters) {
            if (parameter.mode == modeValue && parameter.objectId == 7133142834232692894) {
                // Кабинет инструктора бережливого производства
                return parameter;
            } else if(parameter.mode == modeValue && parameter.objectId == 7233299066424924288) {
                // базовые электронные курсы

            } else if(parameter.mode == modeValue && parameter.objectId == 6942857854747950262) {
                // Программа 7 видов потерь
                return parameter;
            } else if(parameter.mode == modeValue && parameter.objectId == 7238934874905064168) {
                // Полезная информация
                return parameter;
            }
        }
    } else {
        for (parameter in parameters) {
            if (parameter.mode == modeValue) {
                return parameter;
            }
        }
    }

    return null;
}

putToParametersList(7235904129700723090, "unknown", "", "", "");
putToParametersList(7235877002894078514, "home", "", "", "");
putToParametersList(7235877183216677614, "my_doc", "", "", "");
putToParametersList(7235877278222015711, "courses_fck", "", "", "");
putToParametersList(7253617528570598405, "course", "", "", "");
putToParametersList(7235877373230380149, "my_account", "", "", "");
putToParametersList(7253618434808738473, "learning_proc", "", "", "");
putToParametersList(7253619653521964114, "learning_stat", "", "", "");
putToParametersList(7253620522133352728, "doc", "", "", "");
putToParametersList(7253621177128550368, "boss_panel", "", "", "");
putToParametersList(7253621823013074607, "cert_ibp", "", "", "");
putToParametersList(7253623693257644520, "cert_ibp_col", "", "", "");
putToParametersList(7253942263530617616, "courses_catalog", "", "", "");
putToParametersList(7255657739787925986, "doc_type", "", 6745706538192416992, "");
putToParametersList(7255638995713246121, "doc_type", "", 6852304826012604653, "");
putToParametersList(7255701302301162154, "doc_type", "", 6674846170380136045, "");
putToParametersList(7255673007476045651, "custom_doc", "", "", "");
putToParametersList(7255673936739794098, "doc_type", "", 7142596450867968041, "");
putToParametersList(7255675772071732660, "custom_event", "", "", "");
putToParametersList(7255677568570864555, "trainer_personal_account", "", "", "");
putToParametersList(7255679119255860341, "education_plan_cabinet", "", "", "");
putToParametersList(7255679742051586833, "certificate_print", "", "", "");
putToParametersList(7255680247697594239, "library_material", "", "", "");
putToParametersList(7255680851729708034, "custom_report", "", "", "");
putToParametersList(7255681345187430688, "collaborator", "", "", "");
putToParametersList(7255681974100719202, "response", "", "", "");
putToParametersList(7255682393840680359, "error", "", "", "");
putToParametersList(7255686629082101461, "", "", "", 7133142834232692894);
putToParametersList(7255687961825965206, "", "", "", 7233299066424924288);
putToParametersList(7255688868486288419, "", "", "", 6942857854747950262);
putToParametersList(7255689744342835855, "", "", "", 7238934874905064168);
putToParametersList(7255695495903403207, "tutor_collaborator", "", "", "");
putToParametersList(7255698991530800509, "resource", "", "", "");
putToParametersList(7255699763015283157, "main_book_shelves", "", "", "");
putToParametersList(7255700357934625229, "active_learning", "", "", "");
putToParametersList(7235877002894078514, "default", "", "", "");

function getPageIdFromParams(paramList) {
    modeValue = "";
    webTemplateValue = "";
    docIdValue = "";
    objectIdValue = "";

    for (param in paramList) {
        paramElement = param.split("=");

        if (paramElement[0] == "mode") {
            modeValue = paramElement[1];
        } else if(paramElement[0] == "custom_web_template") {
            webTemplateValue = paramElement[1];
        } else if(paramElement[0] == "doc_id") {
            docIdValue = paramElement[1];
        } else if(paramElement[0] == "object_id") {
            objectIdValue = paramElement[1];
        }
    }

    result = getFromParametersList(modeValue, webTemplateValue, docIdValue, objectIdValue);

    if(result == null) {
        result = getFromParametersList("unknown");
    }

    return result;
}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.params = "";
resultData.paramsAsObject = "";

var agentId = 7253905325755555432;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS

var startDate = Date();
var loggerName = "agent_7253905325755555432";

var paramDuration = Request.Query.GetOptProperty("duration", null);

var paramAsString = Request.Query.GetOptProperty("param", null);
if(paramAsString != null) {
    paramAsString = UrlDecode(paramAsString);
}

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    resultData.params = paramAsString;

    params = paramAsString.split("?");

    if(params.length == 2) {
        params = params[1].split("&");

        displayType = 0;

        if (curDevice.disp_type == "mobile") {
            displayType = 7235882882502681639;
        } else {
            displayType = 7235882792364407838;
        }

        webActivityDoc = tools.new_doc_by_name("cc_web_activity", false)
        webActivityDoc.BindToDb(DefaultDb);

        webActivityDocTE = webActivityDoc.TopElem;

        webActivityDocTE.person_id = OptInt(curUserID);
        webActivityDocTE.visit_date = Date();
        webActivityDocTE.page_id = getPageIdFromParams(params).pageId;
        webActivityDocTE.device_id = displayType;
        webActivityDocTE.url_params = paramAsString;
        //webActivityDocTE.duration = paramDuration;

        webActivityDoc.Save();

        resultData.paramsAsObject = getPageIdFromParams(params);
    }

    resultData.message = "Agent is started";

    Response.Write(EncodeJson(resultData));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}
%>