<%
// 7320432274098350978
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7320432274098350978;
var loggerName = "web_7320432274098350978";

var result = {};
result.errorMessage = "";
result.message = "";

try {    
    typeParam = Request.Query.GetOptProperty("type");
    if (typeParam == undefined || typeParam == "") {
        typeParam = "-1";
    }

    actionParam = Request.Query.GetOptProperty("action");
    if (actionParam == undefined || actionParam == "") {
        actionParam = "undefined";
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    kvnDoc = tools.new_doc_by_name("cc_kvn", false);
    kvnDoc.BindToDb(DefaultDb);

    kvnDocTE = kvnDoc.TopElem;

    kvnDocTE.type = typeParam;
    kvnDocTE.person_id = curUserID;
    kvnDocTE.action = actionParam;
    kvnDocTE.cr_date = Date();

    kvnDoc.Save();

    result.message = "SUCCESS";

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>