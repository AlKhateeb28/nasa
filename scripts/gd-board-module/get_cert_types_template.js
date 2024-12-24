<%
// 7106644233027277547
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7106644233027277547;
var loggerName = "agent_7106644233027277547";

var result = [];

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cts.id, cts.name " +
        " FROM [WTDB].[dbo].certificate_types cts " +
        " ORDER BY cts.name "));

    for(data in dataList) {
        element = {};

        element.id = "" + data.id;
        element.name = data.name;

        result.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    Response.Write(EncodeJson("#" + e));
}
%>