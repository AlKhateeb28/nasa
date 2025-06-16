<%
// 7100353776568465126
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

var agentId = 7100353776568465126;
var loggerName = "agent_7100353776568465126";

var result = {};
result.errorMessage = "";
result.chartData = [];
result.categoriesData = [];
result.materialData = [];
result.materialMonthData = [];
result.personMonthData = [];

try {
    // CHART BLOCK
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT MONTH(ss.create_date) AS month, " +
        "       YEAR(ss.create_date) AS year, " +
        "       COUNT(*) AS count " +
        " FROM [WTDB].[dbo].statements ss " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON ss.person_id = cs.id AND ISNUMERIC(cs.code) = 1 " +
        " WHERE UPPER(ss.verb_name) LIKE '%INITIALIZED%' " +
        "       AND (YEAR(ss.create_date) = YEAR(GETDATE()) - 1 OR YEAR(ss.create_date) = YEAR(GETDATE())) " +
        " GROUP BY MONTH(ss.create_date), YEAR(ss.create_date) " +
        " ORDER BY year, month "));
    
    for(data in dataList) {
        element = {};

        element.month = data.month;
        element.year = data.year;
        element.count = data.count;

        categories = data.month + "." + data.year;

        result.chartData.push(element);
        result.categoriesData.push(categories);
    }

    // TOP 5 MATERIAL block
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 5 RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) AS mat_id, " +
        "       MAX(lms.name) AS name, " +
        "       COUNT(*) AS count " +
        " FROM [WTDB].[dbo].statements ss " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON ss.person_id = cs.id AND ISNUMERIC(cs.code) = 1 " +
        "       INNER JOIN [WTDB].[dbo].library_materials lms ON RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) = lms.id " +
        " WHERE UPPER(ss.verb_name) LIKE '%INITIALIZED%' " +
        " GROUP BY RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) " +
        " ORDER BY count DESC "));

    for(data in dataList) {
        element = {};

        element.name = data.name;
        element.count = data.count;

        result.materialData.push(element);
    }

    // TOP 5 MONTH MATERIAL block
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 5 RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) AS mat_id, " +
        "       MAX(lms.name) AS name, " +
        "       COUNT(*) AS count " +
        " FROM [WTDB].[dbo].statements ss " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON ss.person_id = cs.id AND ISNUMERIC(cs.code) = 1 " +
        "       INNER JOIN [WTDB].[dbo].library_materials lms ON RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) = lms.id " +
        " WHERE UPPER(ss.verb_name) LIKE '%INITIALIZED%' " +
        "       AND MONTH(ss.create_date) = MONTH(GETDATE()) " +
        " GROUP BY RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) " +
        " ORDER BY count DESC "));

    for(data in dataList) {
        element = {};

        element.name = data.name;
        element.count = data.count;

        result.materialMonthData.push(element);
    }

    // TOP 5 MONTH PERSON block
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 5 ss.person_id, " +
        "       MAX(cs.fullname) AS name, " +
        "       COUNT(*) AS count " +
        "FROM [WTDB].[dbo].statements ss " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON ss.person_id = cs.id AND ISNUMERIC(cs.code) = 1 " +
        "       INNER JOIN [WTDB].[dbo].library_materials lms ON RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) = lms.id " +
        " WHERE UPPER(ss.verb_name) LIKE '%INITIALIZED%' " +
        "       AND MONTH(ss.create_date) = MONTH(GETDATE()) " +
        " GROUP BY ss.person_id " +
        " ORDER BY count DESC "));

    for(data in dataList) {
        element = {};

        element.name = data.name;
        element.count = data.count;

        result.personMonthData.push(element);
    }

    // COURSES BY WEEK
    year = OptInt(Request.Query.GetOptProperty("year", "2025"));

    // STATE0 (Назначено)
    state0List = ArrayDirect(XQuery("sql: " +
        " SELECT DATEPART(week, als.start_usage_date) AS week, " +
        "       COUNT(als.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings als " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = 0 " +
        "       AND YEAR(als.start_usage_date) = " + year +
        " GROUP BY DATEPART(week, als.start_usage_date) " +
        " ORDER BY week "));

    result.state0Data = [];

    for(state0Element in state0List) {
        element = {};

        element.week = state0Element.week;
        element.count = state0Element.cnt;

        result.state0Data.push(element);
    }

    // STATE1 (В процессе)
    state1List = ArrayDirect(XQuery("sql: " +
        " SELECT DATEPART(week, als.start_learning_date) AS week, " +
        "       COUNT(als.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings als " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = 1 " +
        "       AND YEAR(als.start_learning_date) = " + year +
        " GROUP BY DATEPART(week, als.start_learning_date) " +
        " ORDER BY week "));

    result.state1Data = [];

    for(state1Element in state1List) {
        element = {};

        element.week = state1Element.week;
        element.count = state1Element.cnt;

        result.state1Data.push(element);
    }

    // STATE4 (Пройдено)
    state4List = ArrayDirect(XQuery("sql: " +
        " SELECT DATEPART(week, ls.last_usage_date) AS week, " +
        "       COUNT(ls.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings ls " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE ls.state_id = 4 " +
        "       AND YEAR(ls.last_usage_date) = " + year +
        " GROUP BY DATEPART(week, ls.last_usage_date) " +
        " ORDER BY week "));

    result.state4Data = [];

    for(state4Element in state4List) {
        element = {};

        element.week = state4Element.week;
        element.count = state4Element.cnt;

        result.state4Data.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>