<%
// 7097148700169281373
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7097148700169281373;
var loggerName = "aa_agent_7097148700169281373";

var result = {};
result.errorMessage = "";
result.events = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));
    paramStart = Request.Query.GetOptProperty("start", "0");
    paramFinish = Request.Query.GetOptProperty("finish", "0");

    if(paramStart != "0" && paramFinish != "0") {
        if (paramUserId != 0) {
            userId = paramUserId;
        }

        eventList = ArrayDirect(XQuery("sql: " +
            " SET DATEFORMAT dmy; " +
            " DECLARE @date_from " + "datetime = '" + paramStart + "'; " + 
            " DECLARE @date_to " + "datetime = '" + paramFinish + "'; " +
            "       SELECT es.id, " +
            "           es.name, " +
            "           es.start_date AS start, " +
            "           es.finish_date AS finish, " +
            "           0 AS type, " +
            "           'Мероприятие' AS type_name " +
            "       FROM [WTDB].[dbo].event_results ers " +
            "           INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND (es.status_id = 'plan' OR es.status_id = 'project' OR es.status_id = 'close') " +
            "           INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "       WHERE ers.person_id = " + userId +
            "           AND es.start_date BETWEEN @date_from AND @date_to " +
            "UNION " +
            "    SELECT aan.id AS id, " +
            "           aan.name, " +
            "           aan.start_date AS start, " +
            "           aan.finish_date AS finish, " +
            "           1 AS type, " +
            "           'Уведомление' AS type_name " +
            "    FROM [WTDB].[dbo]._aa_notifications aan " +
            "    WHERE aan.person_id = " + userId +
            "       AND aan.start_date BETWEEN @date_from AND @date_to " +
            "ORDER BY start ASC, finish DESC "));

        if (ArrayCount(eventList) > 0) {
            for (event in eventList) {
                element = {};
                element.id = "" + event.id;
                element.name = event.name;
                element.start = StrDate(event.start, true, false);
                element.startDate = event.start;
                element.finish = StrDate(event.finish, true, false);
                element.finishDate = event.finish;
                element.type = event.type;
                element.typeName = event.type_name;
                result.events.push(element);
            }
        }
    } else {
        result.errorMessage = "#Пустой параметр start или finish";
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>