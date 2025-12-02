<%
// 7431469925384870412
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function hasAdminAccess(userId) {
    for(j = 0; j < ArrayCount(adminIds); j++) {
        if(userId == adminIds[j]) {
            return true;
        }
    }

    return false;
}

var adminIds = [
    7351734047845980789, // AA
    6743923349751162819, //FK
    6614087247971038079 //TO
];

var agentId = 7431469925384870412;
var loggerName = "aa_agent_7431469925384870412";

var result = {};
result.errorMessage = "";
result.isAdmin = hasAdminAccess(curUserID);
result.learnings = [
    {year: Year(Date()) - 1, count: 0},
    {year: Year(Date()), count: 0}
];
result.eventResults = [
    {year: Year(Date()) - 1, count: 0},
    {year: Year(Date()), count: 0}
];
result.statements = [
    {year: Year(Date()) - 1, count: 0},
    {year: Year(Date()), count: 0}
];
result.certificates = [
    {year: Year(Date()) - 1, count: 0},
    {year: Year(Date()), count: 0}
];
result.educationPlans = [];
result.activeLearnings = [];
result.tests = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    collaboratorList = ArrayDirect(XQuery("sql: " +
        " SELECT  cs.id, " +
        "        cs.fullname, " +
        "        os.name AS org_name, " +
        "        rs.name AS region_name, " +
        "        ps.name AS position_name " +
        "FROM [WTDB].[dbo].collaborators cs " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        "WHERE cs.id = " + userId + " AND cs.code NOT LIKE '%muc%'"));

    if(ArrayCount(collaboratorList) > 0) {
        result.id = "" + collaboratorList[0].id;
        result.fullname = collaboratorList[0].fullname;
        result.orgName = collaboratorList[0].org_name;
        result.regionName = collaboratorList[0].region_name;
        result.positionName = collaboratorList[0].position_name;

        // Add learnings
        learningList = ArrayDirect(XQuery("sql: " +
            " SELECT YEAR(ls.start_usage_date) AS year, COUNT(ls.id) AS count " +
            " FROM [WTDB].[dbo].learnings ls " +
            " WHERE ls.state_id = 4 " +
            "   AND ls.person_id = " + userId +
            " GROUP BY YEAR(ls.start_usage_date) " +
            " ORDER BY year "));

        if (ArrayCount(learningList) > 0) {
            result.learnings = [];

            for (learning in learningList) {
                element = {};
                element.year = learning.year;
                element.count = learning.count;

                result.learnings.push(element);
            }
        }

        // Add event results
        eventResultList = ArrayDirect(XQuery("sql: " +
            " SELECT YEAR(ers.event_start_date) AS year, COUNT(ers.id) AS count " +
            " FROM [WTDB].[dbo].event_results ers " +
            " WHERE ers.person_id = " + userId +
            " GROUP BY YEAR(ers.event_start_date) " +
            " ORDER BY year "));

        if (ArrayCount(eventResultList) > 0) {
            result.eventResults = [];

            for (eventResult in eventResultList) {
                element = {};
                element.year = eventResult.year;
                element.count = eventResult.count;

                result.eventResults.push(element);
            }
        }

        // Add statements
        statementList = ArrayDirect(XQuery("sql: " +
            " WITH _view AS " + "(SELECT ss.activity_code, YEAR(ss.create_date) AS year " +
            "               FROM [WTDB].[dbo].statements ss " +
            "               WHERE ss.person_id = " + userId +
            "                    AND UPPER(ss.verb_name) LIKE '%COMPLETED%' " +
            " ) " +
            " SELECT DISTINCT year, activity_code " +
            " INTO _tbl1 " +
            " FROM _view; " +
            " " +
            " SELECT year, COUNT(activity_code) AS count " +
            " FROM _tbl1 " +
            " GROUP BY year; DROP TABLE  _tbl1; "));

        if (ArrayCount(statementList) > 0) {
            result.statements = [];

            for (statement in statementList) {
                element = {};
                element.year = statement.year;
                element.count = statement.count;

                result.statements.push(element);
            }
        }

        // Add certificates
        certificateList = ArrayDirect(XQuery("sql: " +
            " SELECT YEAR(cs.delivery_date) AS year, COUNT(cs.id) AS count " +
            " FROM [WTDB].[dbo].certificates cs " +
            " WHERE cs.person_id = " + userId +
            " GROUP BY YEAR(cs.delivery_date) " +
            " ORDER BY year "));

        if (ArrayCount(certificateList) > 0) {
            result.certificates = [];

            for (certificate in certificateList) {
                element = {};
                element.year = certificate.year;
                element.count = certificate.count;

                result.certificates.push(element);
            }
        }

        // Add education plans
        educationPlanList = ArrayDirect(XQuery("sql: " +
            " SELECT id, object_id, object_name, plan_date AS start, finish_date AS finish " +
            " FROM [WTDB].[dbo].education_plans " +
            " WHERE type = 'group' " +
            "   AND (state_id = 0 OR state_id = 1) " +
            " ORDER BY plan_date DESC "));

        if (ArrayCount(educationPlanList) > 0) {
            found = 0;

            for (educationPlan in educationPlanList) {
                groupDoc = tools.open_doc(educationPlan.object_id);

                if (groupDoc != undefined) {
                    groupDocTE = groupDoc.TopElem;

                    for (collaborator in groupDocTE.collaborators) {
                        if (collaborator.collaborator_id == userId) {
                            if (found < 3) {
                                element = {};
                                element.id = "" + educationPlan.id;
                                element.name = educationPlan.object_name;
                                element.start = StrDate(educationPlan.start, false);
                                element.finish = StrDate(educationPlan.finish, false);

                                result.educationPlans.push(element);

                                found++;

                                break;
                            }

                            found++;
                        }
                    }
                }
            }

            if (found > 3) {
                element = {};
                element.id = null;
                element.name = found;
                element.start = null;
                element.finish = null;

                result.educationPlans.push(element);
            }
        }

        // Add active learnings
        activeLearningList = ArrayDirect(XQuery("sql: " +
            " SELECT id, course_name, start_usage_date AS start " +
            " FROM [WTDB].[dbo].active_learnings " +
            " WHERE (state_id = 0 OR state_id = 1 OR state_id = 2) " +
            "    AND person_id = " + userId +
            " ORDER BY start DESC "));

        if (ArrayCount(activeLearningList) > 0) {
            found = 0;

            for (activeLearning in activeLearningList) {
                if (found < 3) {
                    element = {};
                    element.id = "" + activeLearning.id;
                    element.name = activeLearning.course_name;
                    element.start = StrDate(activeLearning.start, false);

                    result.activeLearnings.push(element);
                }

                found++;
            }

            if (found > 3) {
                element = {};
                element.id = null;
                element.name = found;
                element.start = null;
                element.finish = null;

                result.activeLearnings.push(element);
            }
        }

        // Add tests
        testList = ArrayDirect(XQuery("sql: " +
            " SELECT id, " +
            "       assessment_name  AS name, " +
            "       start_usage_date AS start, " +
            "       max_end_date     AS finish " +
            " FROM [WTDB].[dbo].active_test_learnings " +
            " WHERE person_id = " + userId +
            "    AND (state_id = 0 OR state_id = 1) "));

        if (ArrayCount(testList) > 0) {
            found = 0;

            for (test in testList) {
                if (found < 3) {
                    element = {};
                    element.id = "" + test.id;
                    element.name = test.name;
                    element.start = StrDate(test.start, false);
                    element.finish = StrDate(test.finish, false);

                    result.tests.push(element);
                }

                found++;
            }

            if (found > 3) {
                element = {};
                element.id = null;
                element.name = found;
                element.start = null;
                element.finish = null;

                result.tests.push(element);
            }
        }
    } else {
        result.errorMessage = "#Сотрудник с ID " + userId + " не найден!";
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>