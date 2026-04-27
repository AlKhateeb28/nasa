<%
    // 7269880594011385270
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

agentId = 7269880594011385270;
var loggerName = "web_7269880594011385270";

var result = {};
result.errorMessage = "";
result.message = "";

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    idParam = Request.Query.GetOptProperty("id");

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].event_results " +
        " WHERE event_id = " + idParam));

    for (data in dataList) {
        DeleteDoc(UrlFromDocID(OptInt(data.id)));
    }

    DeleteDoc(UrlFromDocID(OptInt(idParam)));

    result.isDeleted = true;
    
    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>