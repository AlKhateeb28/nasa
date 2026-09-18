<%
// 7208564163180227555
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

function createDefaultWeeklyList(list) {
    for(i = 1; i <= 53; i++) {
        element = {};

        element.week = i;
        element.count = 0;

        list.push(element);
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

var agentId = 7208564163180227555;
var loggerName = "agent_7208564163180227555";

var result = {};
result.errorMessage = "";

try {
    year = Request.Query.GetOptProperty("year", "2026");    

    // STATE0 (Назначено)
    result.state0Data = [];
    createDefaultWeeklyList(result.state0Data);

    state0List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(week, als.start_usage_date) AS week, " +
        "       COUNT(als.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings als " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = 0 " +
        "       AND YEAR(als.start_usage_date) = " + year +
        " GROUP BY DATEPART(week, als.start_usage_date) " +
        " ORDER BY week "));

    for(state0Element in state0List) {
        result.state0Data[state0Element.week - 1].count = state0Element.cnt;
    }

    // STATE1 (В процессе)
    state1List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(week, als.start_learning_date) AS week, " +
        "       COUNT(als.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings als " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id = 1 " +
        "       AND YEAR(als.start_learning_date) = " + year +
        " GROUP BY DATEPART(week, als.start_learning_date) " +
        " ORDER BY week "));

    result.state1Data = [];

    for (state1Element in state1List) {
        element = {};

        element.week = state1Element.week;
        element.count = state1Element.cnt;

        result.state1Data.push(element);
    }
    
    // STATE4 (Пройдено) по дню года
    result.state4ByDayData = [];
    state4ByDayList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy;" +
        " DECLARE @from datetime = '01.01." + year + " 00:00:00' " +
        " DECLARE @to datetime = '31.12." + year + " 23:59:59' " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(day, ls.last_usage_date) AS day, " +
        "       DATEPART(month, ls.last_usage_date) AS month, " +
        "       MAX(DATEPART(week, ls.last_usage_date)) AS week, " +
        "       COUNT(ls.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings ls " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE ls.state_id = 4 " +
        "       AND ls.last_usage_date BETWEEN @from AND @to " +
        "GROUP BY DATEPART(day, ls.last_usage_date), DATEPART(month, ls.last_usage_date) " +
        "ORDER BY month, day "));

    for(state4ByDayElement in state4ByDayList) {
        element = {};

        element.day = state4ByDayElement.day;
        element.month = state4ByDayElement.month;
        element.year = year;
        element.week = state4ByDayElement.week;
        element.count = state4ByDayElement.cnt;

        result.state4ByDayData.push(element);
    }

    // STATE4 (Пройдено) по неделе года
    result.state4Data = [];
    createDefaultWeeklyList(result.state4Data);

    state4List = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(week, ls.last_usage_date) AS week, " +
        "       COUNT(ls.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings ls " +
        "       INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE ls.state_id = 4 " +
        "       AND YEAR(ls.last_usage_date) = " + year +
        " GROUP BY DATEPART(week, ls.last_usage_date) " +
        " ORDER BY week "));

    for(state4Element in state4List) {
        result.state4Data[state4Element.week - 1].count = state4Element.cnt;
    }

    // DELETED DUPLICATES
    result.stateDelDupData = [];
    createDefaultWeeklyList(result.stateDelDupData);

    stateDelDupList = ArrayDirect(XQuery("sql: " +
        " SET DATEFIRST 1; " +
        " SELECT DATEPART(week, ames.start_date) AS week, " +
        "       SUM(CAST(IIF(ames.saved = '--', 0, ames.saved) AS INT)) AS deleted " +
        " FROM [WTDB].[dbo].cc_agent_monitor_events ames " +
        " WHERE ames.agent_id = 7225211062640770399 " +
        "    AND YEAR(ames.start_date) = " + year +
        " GROUP BY DATEPART(week, ames.start_date) " +
        " ORDER BY week "));

    for(stateDelDupElement in stateDelDupList) {
        result.stateDelDupData[stateDelDupElement.week - 1].count = stateDelDupElement.deleted;
    }

    // COMPLETED
    result.completedCount = 0;
    completedList = ArrayDirect(XQuery("sql: " +
        " SELECT COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings courses " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE (courses.state_id = 3 OR courses.state_id = 4) "));

    if(ArrayCount(completedList) > 0) {
        result.completedCount = completedList[0].cnt;
    }

    // КОЛИЧЕСТВО КУРСОВ ДО ТЕКУЩЕГО ГОДА
    result.prevYearCount = 0;
    list = ArrayDirect(XQuery("sql: " +
        " SELECT COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE (courses.state_id = 3 OR courses.state_id = 4) " +
        "   AND YEAR(courses.last_usage_date) < " + year));

    if(ArrayCount(list) > 0) {
        result.prevYearCount = list[0].cnt;
    }

    // ПРОЙДЕНО ПОЗАВЧЕРА
    result.beforeYesterdayCount = 0;
    list = ArrayDirect(XQuery("sql: " +
        " SELECT COUNT(als.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings als " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id IN (3, 4) " +
        "  AND DAY(als.last_usage_date) = DAY(DATEADD(DAY, -2, GETDATE())) " +
        "  AND MONTH(als.last_usage_date) = MONTH(DATEADD(DAY, -2, GETDATE())) " +
        "  AND YEAR(als.last_usage_date) = YEAR(DATEADD(DAY, -2, GETDATE())) " +
        " GROUP BY DAY(als.last_usage_date) "));

    if(ArrayCount(list) > 0) {
        result.beforeYesterdayCount = list[0].cnt;
    }

    // ПРОЙДЕНО ВЧЕРА
    result.yesterdayCount = 0;
    list = ArrayDirect(XQuery("sql: " +
        " SELECT als.id, " +
        "       als.last_usage_date " +
        " FROM [WTDB].[dbo].learnings als " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id IN (3, 4) " +
        "  AND DAY(als.last_usage_date) = DAY(DATEADD(DAY, -1, GETDATE())) " +
        "  AND MONTH(als.last_usage_date) = MONTH(DATEADD(DAY, -1, GETDATE())) " +
        "  AND YEAR(als.last_usage_date) = YEAR(DATEADD(DAY, -1, GETDATE())) " +
        " ORDER BY als.last_usage_date "));

    result.yesterdayCount = ArrayCount(list);
    result.beforeYesterdayReachedTime = "--:--";

    if(ArrayCount(list) > 0) {
        count = 1;

        for(learning in list) {
            if(OptInt(count) == OptInt(result.beforeYesterdayCount)) {
                result.beforeYesterdayReachedTime = Hour(learning.last_usage_date) + ":" + Minute(learning.last_usage_date);
                break;
            }

            count++;
        }
    }

    // ПРОЙДЕНО СЕГОДНЯ
    result.todayCount = 0;
    list = ArrayDirect(XQuery("sql: " +
        " SELECT als.id, " +
        "       als.last_usage_date " +
        " FROM [WTDB].[dbo].learnings als " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON als.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE als.state_id IN (3, 4) " +
        "  AND DAY(als.last_usage_date) = DAY(GETDATE()) " +
        "  AND MONTH(als.last_usage_date) = MONTH(GETDATE()) " +
        "  AND YEAR(als.last_usage_date) = YEAR(GETDATE()) " +
        " ORDER BY als.last_usage_date "));

    result.todayCount = ArrayCount(list);;
    result.yesterdayReachedTime = "--:--";

    if(ArrayCount(list) > 0) {
        count = 1;

        for(learning in list) {
            if(OptInt(count) == OptInt(result.yesterdayCount)) {
                result.yesterdayReachedTime = Hour(learning.last_usage_date) + ":" + Minute(learning.last_usage_date);
                break;
            }

            count++;
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>