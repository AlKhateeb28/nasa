<%
// 7431912320805250846
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7431912320805250846;
var loggerName = "aa_agent_7431912320805250846";

var result = {};
result.errorMessage = "";
result.data = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));
    paramAction = OptInt(Request.Query.GetOptProperty("action", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    if(paramAction > 0) {
        statisticList = [];

        switch (paramAction) {
            case 1 :
                statisticList = ArrayDirect(XQuery("sql: " +
                    " SELECT ls.start_learning_date AS start_date, " +
                    "   ls.last_usage_date AS last_usage, " +
                    "   ls.course_name AS name, " +
                    "   ls.score, " +
                    "   ls.max_score, " +
                    "   '' AS serial, " +
                    "   '' AS number, " +
                    "   '' AS year " +
                    " FROM [WTDB].[dbo].learnings ls " +
                    " WHERE ls.state_id = 4 " +
                    "    AND ls.person_id = " + userId +
                    " ORDER BY start_learning_date "));
                break;

            case 2 :
                statisticList = ArrayDirect(XQuery("sql: " +
                    " SELECT es.start_date AS start_date, " +
                    "   es.finish_date AS last_usage, " +
                    "   es.name AS name, " +
                    "   '-' AS score, " +
                    "   '-' AS max_score, " +
                    "   '' AS serial, " +
                    "   '' AS number, " +
                    "   '' AS year " +
                    " FROM [WTDB].[dbo].event_results ers " +
                    "   INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id " +
                    " WHERE ers.person_id = " + userId +
                    " ORDER BY start_date "));
                break;

            case 3 :
                statisticList = ArrayDirect(XQuery("sql: " +
                    " WITH _view AS (SELECT ss.activity_code, " +
                    "                      lms.name, " +
                    "                      CASE " +
                    "                          WHEN lms.state_id = 0 THEN 'Проект' " +
                    "                          WHEN lms.state_id = 1 THEN 'Действующий' " +
                    "                          ELSE 'Архив' " +
                    "                          END AS score, " +
                    "                      GETDATE() AS start_date, " +
                    "                      GETDATE() AS last_usage, " +
                    "                      '' AS max_score, " +
                    "                      FORMAT(DAY(ss.create_date), '00') AS serial, " +
                    "                      FORMAT(MONTH(ss.create_date), '00') AS number, " +
                    "                      YEAR(ss.create_date) AS year " +
                    "               FROM [WTDB].[dbo].statements ss " +
                    "                        LEFT JOIN [WTDB].[dbo].library_materials lms ON RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) = lms.id " +
                    "               WHERE ss.person_id = " + userId +
                    "                 AND UPPER(ss.verb_name) LIKE '%COMPLETED%' " +
                    " ) " +
                    " SELECT DISTINCT activity_code, year, name, score, start_date, last_usage, max_score, serial, number " +
                    " FROM _view " +
                    " ORDER BY year, number, serial "));

                break;

            case 4 :
                statisticList = ArrayDirect(XQuery("sql: " +
                    " SELECT cs.delivery_date AS start_date, " +
                    "   '' AS last_usage, " +
                    "   cs.type_name AS name, " +
                    "   '' AS score, " +
                    "   '' AS max_score, " +
                    "   cs.serial, " +
                    "   cs.number, " +
                    "   YEAR(cs.delivery_date) AS year " +
                    "FROM [WTDB].[dbo].certificates cs " +
                    "WHERE cs.person_id = " + userId +
                    "ORDER BY start_date "));
                break;
        }

        if(ArrayCount(statisticList) > 0) {
            for(statistic in statisticList) {
                element = {};
                element.startDate = StrDate(statistic.start_date, false);
                element.lastUsage = StrDate(statistic.last_usage, false);
                element.name = statistic.name;
                element.score = statistic.score;
                element.maxScore = statistic.max_score;
                element.serial = statistic.serial;
                element.number = statistic.number;
                element.year = statistic.year;

                result.data.push(element);
            }
        }
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>