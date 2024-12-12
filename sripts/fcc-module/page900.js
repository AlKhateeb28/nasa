<%
// 7438880312075971778
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7438880312075971778;
var loggerName = "aa_agent_7438880312075971778";

var result = {};
result.errorMessage = "";
result.tests = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    // Add tests
    testList = ArrayDirect(XQuery("sql: " +
        " SELECT id, " +
        "       assessment_name  AS name, " +
        "       start_usage_date AS start, " +
        "       max_end_date AS finish, " +
        "       score " +
        " FROM [WTDB].[dbo].active_test_learnings " +
        " WHERE person_id = " + userId +
        "    AND (state_id = 0 OR state_id = 1) "));

    if (ArrayCount(testList) > 0) {
        found = 0;

        for (test in testList) {
            element = {};
            element.id = "" + test.id;
            element.name = test.name;
            element.start = StrDate(test.start, false);
            element.finish = StrDate(test.finish, false);
            element.score = test.score;

            result.tests.push(element);

            found++;
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>