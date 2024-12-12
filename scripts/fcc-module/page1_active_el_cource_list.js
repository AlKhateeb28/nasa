<%
// 7433721197830425062
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7433721197830425062;
var loggerName = "aa_agent_7433721197830425062";

var result = {};
result.errorMessage = "";
result.activeLearnings = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    activeLearningList = ArrayDirect(XQuery("sql: " +
        " SELECT id, course_name, start_usage_date AS start " +
        " FROM [WTDB].[dbo].active_learnings " +
        " WHERE (state_id = 0 OR state_id = 1 OR state_id = 2) " +
        "    AND person_id = " + userId +
        " ORDER BY start DESC "));

    if(ArrayCount(activeLearningList) > 0) {
        for (activeLearning in activeLearningList) {
            element = {};
            element.id = "" + activeLearning.id;
            element.name = activeLearning.course_name;
            element.start = StrDate(activeLearning.start, false);

            result.activeLearnings.push(element);
        }
    }

} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>