<%
// 7171809918284888706
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function hasAdminAccess(userId) {
    for(j = 0; j < ArrayCount(adminIds); j++) {
        if(userId == adminIds[j]) {
            return 1;
        }
    }

    return 0;
}

function getShortQuery(regionId) {
    return regionId == 0 ? "" : " INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id AND os.region_id = " + regionId;
}

function getLongQuery(regionId) {
    return regionId == 0 ? "" : " INNER JOIN [WTDB].[dbo].collaborators cs ON courses.person_id = cs.id " +
        " INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id AND os.region_id = " + regionId;
}

var adminIds = [
    7351734047845980789, // AA
    6743923349751162819, //FK
    6614087247971038079, //TO
    6614087235644112866, //ZI
    6787990739804452036, // SN
    6726778101707318995, // RA
    7036680427249492033 // MT
];

var agentId = 7171809918284888706;
var loggerName = "agent_7171809918284888706";

var result = {};
result.errorMessage = "";
result.date = {};
result.state0Data = [];
result.state1Data = [];
result.state4Data = [];

try {
    // COURSES BY WEEK
    week = OptInt(Request.Query.GetOptProperty("week", "1"));
    year = OptInt(Request.Query.GetOptProperty("year", "2025"));

    // STATE0 (Назначено)
    state0List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " WITH _view AS ( " +
        "    SELECT DAY(als.start_usage_date) AS cs_day, " +
        "        MAX(als.start_usage_date) AS cs_date, " +
        "        COUNT(als.id) AS cnt " +
        "    FROM [WTDB].[dbo].active_learnings als " +
        "             INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "    WHERE als.state_id = 0 " +
        "      AND DATEPART(week, als.start_usage_date) = " + week +
        "      AND YEAR(als.start_usage_date) = " + year +
        "    GROUP BY DAY(als.start_usage_date) " +
        " ) " +
        " SELECT *, " +
        "       DATEPART(weekday, cs_date) AS day " +
        " FROM _view " +
        " ORDER BY cs_date " ));

    step = 1;

    result.state0Data = [];

    for(state0Element in state0List) {
        element = {};

        element.day = state0Element.day;
        element.count = state0Element.cnt;
        result.state0Data.push(element);

        if(step == 1) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Date: -" + state0Element.cs_date + "-");

            result.date = StrDate(state0Element.cs_date, false, false);
        }

        step++;
    }

    // STATE1 (В процессе)
    state1List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " WITH _view AS ( " +
        "    SELECT DAY(als.start_learning_date) AS cs_day, " +
        "        MAX(als.start_learning_date) AS cs_date, " +
        "        COUNT(als.id) AS cnt " +
        "    FROM [WTDB].[dbo].active_learnings als " +
        "             INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "    WHERE als.state_id = 1 " +
        "      AND DATEPART(week, als.start_learning_date) = " + week +
        "      AND YEAR(als.start_learning_date) = " + year +
        "    GROUP BY DAY(als.start_learning_date) " +
        " ) " +
        " SELECT *, " +
        "       DATEPART(weekday, cs_date) AS day " +
        " FROM _view " +
        " ORDER BY cs_date " ));

    step = 1;

    result.state1Data = [];

    for(state1Element in state1List) {
        element = {};

        element.day = state1Element.day;
        element.count = state1Element.cnt;

        result.state1Data.push(element);

        if(step == 1) {
            result.date = StrDate(state1Element.cs_date, false, false);
        }

        step++;
    }

    // STATE4 (Пройдено)
    state4List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " WITH _view AS ( " +
        "    SELECT DAY(als.last_usage_date) AS cs_day, " +
        "        MAX(als.last_usage_date) AS cs_date, " +
        "        COUNT(als.id) AS cnt " +
        "    FROM [WTDB].[dbo].learnings als " +
        "             INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "    WHERE als.state_id = 4 " +
        "      AND DATEPART(week, als.last_usage_date) = " + week +
        "      AND YEAR(als.last_usage_date) = " + year +
        "    GROUP BY DAY(als.last_usage_date) " +
        " ) " +
        " SELECT *, " +
        "       DATEPART(weekday, cs_date) AS day " +
        " FROM _view " +
        " ORDER BY cs_date " ));

    step = 1;

    result.state4Data = [];

    for(state4Element in state4List) {
        element = {};

        element.day = state4Element.day;
        element.count = state4Element.cnt;

        result.state4Data.push(element);

        if(step == 1) {
            result.date = StrDate(state4Element.cs_date, false,false);
        }

        step++;
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>