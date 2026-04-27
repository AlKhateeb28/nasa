<%
// 7270559282030501424
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var EDUCATION_METHOD_CODE = "prog_obuch_ock";

var agentId = 7270559282030501424;
var loggerName = "web_7270559282030501424";

var result = {};
result.errorMessage = "";
result.message = "";

result.trainers = [];

try {
    nameParam = Request.Query.GetOptProperty("name");
    if (nameParam == undefined || nameParam == "") {
        nameParam = "";
    } else {
        nameParam = " AND UPPER(cs.fullname) LIKE '%" + StrUpperCase(nameParam) + "%'";
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    result.edu_methods = [];

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ems.id, " +
        "		ems.name " +
        " FROM [WTDB].[dbo].education_methods ems " +
        " WHERE ems.code = '" + EDUCATION_METHOD_CODE + "' " +
        " ORDER BY name "));

    result.count = ArrayCount(dataList);

    for (data in dataList) {
        element = {};

        element.id = data.id;
        element.name = data.name;

        result.edu_methods.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>