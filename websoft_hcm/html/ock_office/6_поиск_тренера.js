<%
// 7265653330370099293
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var PERSON_CODE_PART = "_muc_";

var agentId = 7265653330370099293;
var loggerName = "web_7265653330370099293";

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

	orgId = "0000000000000000000";
	
	collaboratorDoc = tools.open_doc(curUserID)
	
	if(collaboratorDoc != undefined) {
		orgId = collaboratorDoc.TopElem.org_id; 
	}
	
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.id, " +
        "	cs.fullname AS name, " +
        "	os.code AS inn, " +
        "	os.name AS org_name, " +
        "	ps.name AS position_name " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "	INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id AND os.id = " + orgId +
        "	INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        " WHERE cs.code NOT LIKE('%" + PERSON_CODE_PART + "%') " + nameParam + 
        " ORDER BY name "));

    for (data in dataList) {
        element = {};

        element.id = data.id;
        element.name = data.name;
        element.inn = data.inn;
        element.orgName = data.org_name;
        element.positionName = data.position_name;

        result.trainers.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>