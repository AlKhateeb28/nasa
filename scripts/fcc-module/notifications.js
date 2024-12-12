<%
// 7101807729834720822
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7101807729834720822;
var loggerName = "agent_7101807729834720822";

var result = {};
result.errorMessage = "";
result.notifications = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if (paramUserId != 0) {
        userId = paramUserId;
    }

    eventList = ArrayDirect(XQuery("sql: " +
        " SELECT name, " +
        "       start_date AS start, " +
        "       finish_date AS finish, " +
        "       all_day " +
        " FROM [WTDB].[dbo]._aa_notifications " +
        " WHERE person_id = 7351734047845980789 " +
        "       AND GETDATE() > start_date " +
        "       AND active = 1 "));

    if (ArrayCount(eventList) > 0) {
        for (event in eventList) {
            element = {};
            element.name = event.name;
            element.start = event.start;
            element.finish = event.finish;
            element.allDay = event.all_day;
            result.notifications.push(element);
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>