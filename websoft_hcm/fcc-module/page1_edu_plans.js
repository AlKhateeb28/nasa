<%
// 7432649999618495024
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7431469925384870412;
var loggerName = "aa_agent_7431469925384870412";

var result = {};
result.errorMessage = "";
result.educationPlans = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    educationPlanList = ArrayDirect(XQuery("sql: " +
        " SELECT id, object_id, object_name, plan_date AS start, finish_date AS finish" +
        " FROM [WTDB].[dbo].education_plans " +
        " WHERE type = 'group' " +
        "   AND (state_id = 0 OR state_id = 1) " +
        " ORDER BY start DESC "));

    if(ArrayCount(educationPlanList) > 0) {
        for (educationPlan in educationPlanList) {
            groupDoc = tools.open_doc(educationPlan.object_id);

            if (groupDoc != undefined) {
                groupDocTE = groupDoc.TopElem;

                for (collaborator in groupDocTE.collaborators) {
                    if (collaborator.collaborator_id == userId) {

                        element = {};
                        element.id = "" + educationPlan.id;
                        element.name = educationPlan.object_name;
                        element.start = StrDate(educationPlan.start, false);
                        element.finish = StrDate(educationPlan.finish, false);

                        result.educationPlans.push(element);
                    }
                }
            }
        }
    }

} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>