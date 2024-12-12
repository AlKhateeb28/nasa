<%
// 7434498905755289557
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7434498905755289557;
var loggerName = "aa_agent_7434498905755289557";

var result = {};
result.errorMessage = "";
result.courses = [];
result.educationPlans = [];
result.tests = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    courseList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS (SELECT cos.id, " +
        "                      cos.name, " +
        "                      co.data.value('(course/comment)[1]', 'varchar(max)') AS comment, " +
        "                      ls.state_id, " +
        "                      ls.score, " +
        "                      ls.max_score, " +
        "                      cos.resource_id, " +
        "                      0 AS type, " +
        "                      ls.start_usage_date AS c_date " +
        "               FROM [WTDB].[dbo].active_learnings ls " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id AND cs.id = " + userId +
        "                        INNER JOIN [WTDB].[dbo].courses cos ON ls.course_id = cos.id " +
        "                        INNER JOIN [WTDB].[dbo].course co ON cos.id = co.id " +
        "               UNION " +
        "               SELECT cos.id, " +
        "                      cos.name, " +
        "                      co.data.value('(course/comment)[1]', 'varchar(max)') AS comment, " +
        "                      ls.state_id, " +
        "                      ls.score, " +
        "                      ls.max_score, " +
        "                      cos.resource_id, " +
        "                      1 AS type, " +
        "                      ls.start_usage_date AS c_date " +
        "               FROM [WTDB].[dbo].learnings ls " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id AND cs.id = " + userId +
        "                        INNER JOIN [WTDB].[dbo].courses cos ON ls.course_id = cos.id " +
        "                        INNER JOIN [WTDB].[dbo].course co ON cos.id = co.id " +
        "               ) " +
        " SELECT *, " +
        "    CASE " +
        "        WHEN state_id = 0 THEN 'Назначен' " +
        "        WHEN state_id = 1 THEN 'В процессе' " +
        "        WHEN state_id = 3 THEN 'Не пройден' " +
        "        WHEN state_id = 4 THEN 'Пройден' " +
        "        ELSE '' END AS state " +
        " FROM _view " +
        " ORDER BY c_date DESC "));

    if (ArrayCount(courseList) > 0) {
        for (course in courseList) {
            element = {};
            element.id = "" + course.id;
            element.name = course.name;
            element.comment = course.comment;
            element.stateId = course.state_id;
            element.score = course.score;
            element.maxScore = course.max_score;
            element.resourceId = "" + course.resource_id;
            element.type = course.type;
            element.date = StrDate(course.c_date, true, false);
            element.state = course.state;

            result.courses.push(element);
        }
    }

    educationPlanList = ArrayDirect(XQuery("sql: " +
        " SELECT id, object_id, object_name AS name, plan_date AS start, state_id, " +
        "       CASE " +
        "           WHEN state_id = 0 THEN 'Назначен' " +
        "           WHEN state_id = 1 THEN 'В процессе' " +
        "           WHEN state_id = 2 THEN 'Завершен' " +
        "           WHEN state_id = 4 THEN 'Пройден' " +
        "           ELSE '' END AS state " +
        " FROM [WTDB].[dbo].education_plans " +
        " WHERE type = 'group' " +
        "  AND (state_id = 0 OR state_id = 1 OR state_id = 2 OR state_id = 4) " +
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
                        element.name = educationPlan.name;
                        element.start = StrDate(educationPlan.start, false);
                        element.stateId = educationPlan.state_id;
                        element.state = educationPlan.state;

                        result.educationPlans.push(element);
                    }
                }
            }
        }
    }

    testList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS (SELECT id, " +
        "                      assessment_name  AS name, " +
        "                      start_usage_date AS start, " +
        "                      max_end_date AS finish, " +
        "                      score, " +
        "                      max_score, " +
        "                      state_id, " +
        "                      0 AS type " +
        "               FROM [WTDB].[dbo].active_test_learnings " +
        "               WHERE person_id = " + userId +
        "                 AND (state_id = 0 OR state_id = 1 OR state_id = 2) " +
        "               UNION " +
        "               SELECT id, " +
        "                      assessment_name  AS name, " +
        "                      start_usage_date AS start, " +
        "                      max_end_date AS finish, " +
        "                      score, " +
        "                      max_score, " +
        "                      state_id, " +
        "                      1 AS type " +
        "               FROM [WTDB].[dbo].test_learnings " +
        "               WHERE person_id = " + userId +
        "                 AND (state_id = 3 OR state_id = 4) " +
        " ) " +
        " SELECT *, " +
        "       CASE " +
        "           WHEN state_id = 0 THEN 'Назначен' " +
        "           WHEN state_id = 1 THEN 'В процессе' " +
        "           WHEN state_id = 2 THEN 'Завершен' " +
        "           WHEN state_id = 3 THEN 'Не пройден' " +
        "           WHEN state_id = 4 THEN 'Пройден' " +
        "           ELSE '' END  AS state " +
        " FROM _view" +
        " ORDER BY start DESC "));

    if(ArrayCount(testList) > 0) {
        for (test in testList) {
            element = {};
            element.id = "" + test.id;
            element.name = test.name;
            element.start = StrDate(test.start, true, false);
            element.finish = StrDate(test.finish, true, false);
            element.checkDate = test.finish;
            element.score = test.score;
            element.maxScore = test.max_score;
            element.stateId = test.state_id;
            element.state = test.state;
            element.type = test.type;

            result.tests.push(element);
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>