<%
// 7135042110124703382
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7135042110124703382;
var loggerName = "agent_7135042110124703382";

var result = {};
result.errorMessage = "";
result.message = "";
result.id = "";

try {
    addLogMessage(loggerName, "----------");

    certificateId = OptInt(Request.Query.GetOptProperty("id"), null);

    if(certificateId == null) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate ID  is empty!");

        throw new Error("Certificate ID  is empty!");
    }

    DeleteDoc(UrlFromDocID(certificateId));

    result.message = "DELETED";

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>