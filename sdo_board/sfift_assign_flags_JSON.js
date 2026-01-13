<%
// 7226648571481683640
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getTotal(table, state, week, year) {
    return ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT COUNT(als.id) AS count " +
        " FROM [WTDB].[dbo]." + table + " als " +
        "    INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = " + state +
        "    AND YEAR(als.start_usage_date) = " + year +
        "    AND DATEPART(week, als.start_usage_date) = " + week));
}

function getCoursesCountByFlag(table, state, flag, week, year) {
    list = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT COUNT(als.id) AS count " +
        " FROM [WTDB].[dbo]." + table + " als " +
        "    INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(//custom_elems/custom_elem[name=''" + flag + "''])[1]/value[1]', 'bit') = 1 " +
        "    INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = " + state +
        "    AND YEAR(als.start_usage_date) = " + year +
        "    AND DATEPART(week, als.start_usage_date) = " + week));

    if(ArrayCount(list) > 0) {
        return list[0].count;
    } else {
        return 0;
    }
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

var agentId = 7226648571481683640;
var loggerName = "agent_7226648571481683640";

var result = {};
result.errorMessage = "";
result.weekTotal = 0;
result.rck = 0;
result.ock = 0;
result.fck = 0;
result.roiv = 0;
result.partner = 0;
result.commerce = 0;
result.withNoRight = 0;

result.passWeekTotal = 0;
result.passRck = 0;
result.passOck = 0;
result.passFck = 0;
result.passRoiv = 0;
result.passPartner = 0;
result.passCommerce = 0;
result.passWithNoRight = 0;

try {
    week = OptInt(Request.Query.GetOptProperty("week", "1"));
    year = OptInt(Request.Query.GetOptProperty("year", "2026"));

    assignList = getTotal("active_learnings", 0, week, year);
    passList = getTotal("learnings", 4, week, year);;

    if(ArrayCount(assignList) > 0 && ArrayCount(passList) > 0) {
        result.weekTotal = assignList[0].count;
        result.rck = getCoursesCountByFlag("active_learnings", 0, "is_rck", week, year);
        result.ock = getCoursesCountByFlag("active_learnings", 0, "is_ock", week, year);
        result.fck = getCoursesCountByFlag("active_learnings", 0, "is_fcc", week, year);
        result.roiv = getCoursesCountByFlag("active_learnings", 0, "is_roiv", week, year);;
        result.partner = getCoursesCountByFlag("active_learnings", 0, "is_partner", week, year);;
        result.commerce = getCoursesCountByFlag("active_learnings", 0, "is_a_commerce_client", week, year);;
        result.withNoRight = getCoursesCountByFlag("active_learnings", 0, "With_no_right", week, year);;

        result.passWeekTotal = passList[0].count;
        result.passRck = getCoursesCountByFlag("learnings", 4, "is_rck", week, year);
        result.passOck = getCoursesCountByFlag("learnings", 4, "is_ock", week, year);
        result.passFck = getCoursesCountByFlag("learnings", 4, "is_fcc", week, year);
        result.passRoiv = getCoursesCountByFlag("learnings", 4, "is_roiv", week, year);;
        result.passPartner = getCoursesCountByFlag("learnings", 4, "is_partner", week, year);;
        result.passCommerce = getCoursesCountByFlag("learnings", 4, "is_a_commerce_client", week, year);;
        result.passWithNoRight = getCoursesCountByFlag("learnings", 4, "With_no_right", week, year);;
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>