<%
// 7436649459432433382
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7436649459432433382;
var loggerName = "aa_agent_7436649459432433382";

var result = {};
result.errorMessage = "";
result.events = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    eventList = ArrayDirect(XQuery("sql: " +
        " SELECT es.id, " +
        "       es.name, " +
        "       es.start_date AS start, " +
        "       es.finish_date AS finish, " +
        "       es.status_id, " +
        "       e.data.value('(event/place)[1]', 'varchar(max)') AS place, " +
        "       CASE " +
        "           WHEN es.status_id = 'plan' THEN 'Планируется' " +
        "           WHEN es.status_id = 'project' THEN 'Проект' " +
        "           WHEN es.status_id = 'close' THEN 'Завершено' " +
        "           ELSE '' END  AS state " +
        " FROM [WTDB].[dbo].event_results ers " +
        "    INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND (es.status_id = 'plan' OR es.status_id = 'project' OR es.status_id = 'close') " +
        "    INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
        " WHERE ers.person_id = " + userId +
        " ORDER BY start DESC "));

    if(ArrayCount(eventList) > 0) {
        for (event in eventList) {
            element = {};
            element.id = "" + event.id;
            element.name = event.name;
            element.start = StrDate(event.start, true, false);
            element.startDate = event.start;
            element.finish = StrDate(event.finish, true, false);
            element.finishDate = event.finish;
            element.statusId = event.status_id;
            element.place = event.place;
            element.state = event.state;

            result.events.push(element);
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>