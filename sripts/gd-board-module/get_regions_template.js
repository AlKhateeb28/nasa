<%
// 7428923418845716087
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7428923418845716087;
var loggerName = "aa_agent_7428923418845716087";

var result = [];

try {
    regionsList = ArrayDirect(XQuery("sql: " +
        " SELECT id, name " +
        " FROM [WTDB].[dbo].regions " +
        " WHERE code IS NOT NULL " +
        " ORDER BY name "));

    for(region in regionsList) {
        element = {};

        element.id = "" + region.id;
        element.name = region.name;

        result.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    Response.Write(EncodeJson("#" + e));
}
%>