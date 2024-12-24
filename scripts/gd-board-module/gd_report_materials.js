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
    
    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>