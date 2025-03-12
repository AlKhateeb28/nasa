<%
// 7134264789160591460
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getSqlFromCode(code) {
    if(code == 0) {
        return " AND cs.code LIKE '%load_muc%' ";
    } else {
        return " AND cs.code NOT LIKE '%_muc_%' ";
    }
}

agentId = 7134264789160591460;
var loggerName = "agent_7134264789160591460";

var result = {};
result.errorMessage = "";
result.persons = [];

try {
    paramName = Request.Query.GetOptProperty("name", null);
    paramCode = OptInt(Request.Query.GetOptProperty("code", -1));

    addLogMessage(loggerName, "----------");

    if(paramName != null && StrCharCount(paramName) >= 3 && paramCode >= 0) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.id, " +
            "       cs.fullname AS fio, " +
            "       cs.email, " +
            "       os.code AS inn, " +
            "       os.name AS org_name, " +
            "       ps.name AS position_name " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            " WHERE LOWER(cs.fullname) LIKE N'%" + StrLowerCase(paramName) + "%' " +
            getSqlFromCode(paramCode) +
            " ORDER BY fullname "));

        for (data in dataList) {
            element = {};
            element.id = "" + data.id;
            element.fio = data.fio;
            element.email = data.email;
            element.positionName = data.position_name;
            element.inn = data.inn;
            element.organizationName = data.org_name;

            result.persons.push(element);
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>