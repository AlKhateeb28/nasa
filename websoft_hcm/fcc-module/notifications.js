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

    paramId = OptInt(Request.Query.GetOptProperty("id", "0"));
    paramType = OptInt(Request.Query.GetOptProperty("type", "0"));

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + paramId + " TYPE: " + paramType);

    switch (paramType) {
        case 0 :
            // SELECT
            eventList = ArrayDirect(XQuery("sql: " +
                " SELECT id, " +
                "       name, " +
                "       start_date AS start, " +
                "       finish_date AS finish, " +
                "       all_day, " +
                "       last_send " +
                " FROM [WTDB].[dbo]._aa_notifications " +
                " WHERE person_id = " + userId +
                "       AND GETDATE() > start_date " +
                "       AND active = 1 "));

            if (ArrayCount(eventList) > 0) {
                for (event in eventList) {
                    element = {};
                    element.id = event.id;
                    element.name = event.name;
                    element.start = event.start;
                    element.finish = event.finish;
                    element.allDay = event.all_day;
                    element.lastSend = event.last_send;
                    result.notifications.push(element);
                }
            }

            break;
        case 1:
            // INSERT ROW
            if(paramId !== 0) {

            }

            break;
        case 2:
            // SET LAST SEND
            addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");

            if(paramId !== 0) {
                XQuery("sql: UPDATE [WTDB].[dbo]._aa_notifications SET last_send = GETDATE() WHERE id = " + paramId)
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Updated");
            }

            break;
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>