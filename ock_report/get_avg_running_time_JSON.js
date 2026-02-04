<%
// 7248982558480427455
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7248982558480427455;
var loggerName = "agent_7248982558480427455";

var result = {};
result.errorMessage = "";
result.seconds = 0;
result.minutes = 0;

try {
    templateId = Request.Query.GetOptProperty("id", "0");

    if(OptInt(templateId) == 0) {
        result.isEmptyIdParam = true;
    } else {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT AVG(DATEDIFF(second , start_date, finish_date)) AS sec, " +
            "       AVG(DATEDIFF(minute , start_date, finish_date)) AS min " +
            " FROM [WTDB].[dbo].cc_agent_monitor_events " +
            " WHERE agent_id = " + templateId));

        if(ArrayCount(dataList) > 0) {
            result.isEmptyIdParam = false;
            result.seconds = dataList[0].sec == null ? 0 : dataList[0].sec;
            result.minutes = dataList[0].min == null ? 0 : dataList[0].min;
        } else {
            result.isEmptyIdParam = true;
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>