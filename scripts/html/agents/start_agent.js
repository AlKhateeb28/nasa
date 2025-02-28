<%
// //7129036886315589942
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7129036886315589942;
var loggerName = "agent_//7129036886315589942";

var result = {};
result.message = "";
result.errorMessage = "";

try {
    agentId = OptInt(Request.Query.GetOptProperty("agent_id"));

    tools.start_agent(agentId);

    result.message = "Agent is started";

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>