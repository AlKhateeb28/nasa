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

    courseIds = [
        7033345432254749026,
        7033317173098334621,
        7033353503783534178,
        7033373371731500927,
        7033393111894403431,
        7119812308457777642,
        7119812071712565068,
        7119812165002090859,
        7119812388344499932,
        7119811761202858978,
        7119812540134335010
    ];

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Person.ID: " + personId);

    for (courseId in courseIds) {
        tools.activate_course_to_person(personId, courseId);

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