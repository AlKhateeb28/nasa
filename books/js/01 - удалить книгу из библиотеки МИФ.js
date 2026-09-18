<%
// 7328198076491720999
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";
resultData.deleted = false;

var agentId = 7328198076491720999;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var loggerName = "web_7328198076491720999";

try {
    var total = 0;
    var processed = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    bookId = Request.Query.GetOptProperty("id", "9999999999999999999");

    if (bookId != "9999999999999999999") {
        bookId = OptInt(bookId);

        resourceDoc = tools.open_doc(bookId);

        if (resourceDoc != undefined) {
            DeleteDoc(UrlFromDocID(bookId));
            
            resultData.deleted = true;

            addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + bookId + " Deleted!");
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + bookId + " Not deleted!");
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Empty ID. Not deleted!");
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] FINISHED.");

    Response.Write(EncodeJson(resultData));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}
%>