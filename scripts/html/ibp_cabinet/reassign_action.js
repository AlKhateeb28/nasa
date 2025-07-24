<%
// 7168319587610451307
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7168319587610451307;
var loggerName = "action_7168319587610451307";

var result = {};
result.errorMessage = "";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    ids = Request.Query.GetOptProperty("ids");

    courseIds = [];

    if(StrCharCount(ids) > 0) {
        courseIds = ids.split(",");
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Person.ID: " + personId + " Count: " + ArrayCount(courseIds));

    for (courseId in courseIds) {
        tools.activate_course_to_person(personId, OptInt(courseId));

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Activated.ID: " + courseId);
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>