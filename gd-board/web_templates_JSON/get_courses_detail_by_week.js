<%
// 7193439281983944051
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

/*function hasAdminAccess(userId) {
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
}*/

var adminIds = [
    7351734047845980789, // AA
    6743923349751162819, //FK
    6614087247971038079, //TO
    6614087235644112866, //ZI
    6787990739804452036, // SN
    6726778101707318995, // RA
    7036680427249492033 // MT
];

var agentId = 7193439281983944051;
var loggerName = "agent_7193439281983944051";

var result = {};
result.errorMessage = "";
result.date = {};

try {
    year = OptInt(Request.Query.GetOptProperty("year", "2025"));
    week = OptInt(Request.Query.GetOptProperty("week", "1"));
    
    details = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(week, ls.start_learning_date) AS from_week, " +
        "       MAX(YEAR(ls.start_learning_date)) AS from_year, " +
        "       COUNT(*) AS cnt, " +
        "       MIN(ls.start_learning_date) AS start " +
        " FROM [WTDB].[dbo].learnings ls " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE ls.state_id = 4 " +
        "    AND YEAR(ls.last_usage_date) = " + year +
        "    AND DATEPART(week, ls.last_usage_date) = " + week +
        " GROUP BY DATEPART(week, ls.start_learning_date) " +
        " ORDER BY from_year, from_week  "));

    result.details = [];

    for(detail in details) {
        element = {};

        element.fromWeek = detail.from_week;
        element.fromYear = detail.from_year;
        element.count = detail.cnt;
        element.start = StrDate(detail.start, false, false);

        result.details.push(element);

        if(week == element.fromWeek && year == element.fromYear) {
            result.date = StrDate(detail.start, false, false);
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>