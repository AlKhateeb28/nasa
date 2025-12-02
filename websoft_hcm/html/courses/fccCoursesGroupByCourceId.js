// 7401083011735638492

var result = {};
result.uniquePersons = 0;
result.courses = [];

var agentId = "7401083011735638492";
var loggerName = "aa_agent_7401083011735638492";

EnableLog(loggerName,true);

LogEvent(loggerName, "[agent.id: " + agentId + "] -------------------");
LogEvent(loggerName, "[agent.id: " + agentId + "] Started");
LogEvent(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    courcesList = ArrayDirect(XQuery("sql: " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl1 " +
        " FROM ( " +
        "   SELECT c_name, 1 as type, SUM(cnt) AS cnt " +
        "   FROM " +
        "   ( " +
        "       SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "       FROM [WTDB].[dbo].courses c " +
        "           LEFT JOIN [WTDB].[dbo].active_learnings l ON c.id = l.course_id AND l.state_id = 1 " +
        "       WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        "    UNION " +
        "       SELECT c_name, 0 as type, SUM(cnt) AS cnt " +
        "       FROM " +
        "       ( " +
        "           SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "           FROM [WTDB].[dbo].courses c " +
        "               LEFT JOIN [WTDB].[dbo].active_learnings l ON c.id = l.course_id AND l.state_id = 0 " +
        "           WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        " ) AS view1; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl2 " +
        " FROM ( " +
        "       SELECT * " +
        "       FROM [WTDB].[dbo].#tbl1 " +
        "   UNION " +
        "       SELECT c_name, 3 as type, SUM(cnt) AS cnt " +
        "       FROM ( " +
        "           SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "           FROM [WTDB].[dbo].courses c " +
        "               LEFT JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 3 " +
        "           WHERE c.code LIKE '%FCK%' " +
        "       ) AS tbl " +
        "       GROUP BY c_name " +
        " ) AS view2; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#tbl3 " +
        " FROM ( " +
        "           SELECT * " +
        "           FROM [WTDB].[dbo].#tbl2 " +
        "       UNION " +
        "           SELECT c_name, 4 as type, SUM(cnt) AS cnt " +
        "           FROM ( " +
        "               SELECT c.id AS c_id, c.name AS c_name, CASE WHEN l.id IS NULL THEN 0 ELSE 1 END AS cnt " +
        "               FROM [WTDB].[dbo].courses c " +
        "                   LEFT JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 4 " +
        "               WHERE c.code LIKE '%FCK%' " +
        "           ) AS tbl " +
        "           GROUP BY c_name " +
        " ) AS view3; " +
        " " +
        " SELECT * " +
        " INTO [WTDB].[dbo].#result_tbl " +
        " FROM ( " +
        "           SELECT * " +
        "           FROM [WTDB].[dbo].#tbl3 " +
        "       UNION " +
        "           SELECT c_name, 6 as type, SUM(cnt) AS cnt " +
        "           FROM ( " +
        "               SELECT c_name, 1 AS cnt " +
        "               FROM ( " +
        "                   SELECT l.person_id, c.name AS c_name " +
        "                   FROM [WTDB].[dbo].courses c " +
        "                       LEFT JOIN [WTDB].[dbo].learnings l ON c.id = l.course_id AND l.state_id = 4 " +
        "                   WHERE c.code LIKE '%FCK%' " +
        "               ) AS tbl " +
        "               GROUP BY person_id, c_name " +
        "           ) AS view11 " +
        "           GROUP BY c_name " +
        " ) AS view5; " +
        " " +
        " SELECT c_name, " +
        "   SUM(CASE WHEN type = 1 THEN cnt ELSE 0 END) AS cnt1, " +
        "   SUM(CASE WHEN type = 0 THEN cnt ELSE 0 END) AS cnt0, " +
        "   SUM(CASE WHEN type = 3 THEN cnt ELSE 0 END) AS cnt3, " +
        "   SUM(CASE WHEN type = 4 THEN cnt ELSE 0 END) AS cnt4, " +
        "   SUM(CASE WHEN type = 6 THEN cnt ELSE 0 END) AS cnt6, " +
        "   SUM(CASE WHEN type = 1 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 0 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 3 THEN cnt ELSE 0 END) + SUM(CASE WHEN type = 4 THEN cnt ELSE 0 END) AS total " +
        " FROM [WTDB].[dbo].#result_tbl " +
        " WHERE cnt > 0 " +
        " GROUP BY c_name " +
        " ORDER BY total DESC; DROP TABLE [WTDB].[dbo].#tbl1; DROP TABLE [WTDB].[dbo].#tbl2; DROP TABLE [WTDB].[dbo].#tbl3; DROP TABLE [WTDB].[dbo].#result_tbl; "));

    for (course in courcesList) {
        courseElement = {};
        courseElement.name = cource.c_name;
        courseElement.cnt1 = cource.cnt1;
        courseElement.cnt0 = cource.cnt0;
        courseElement.cnt3 = cource.cnt3;
        courseElement.cnt4 = cource.cnt4;
        courseElement.cnt6 = cource.cnt6;
        courseElement.total = cource.total;

        result.courses.push(courseElement);
    }

    uniquePersonList = ArrayDirect(XQuery("sql: " +
        " SELECT l.person_id " +
        "FROM [WTDB].[dbo].learnings l " +
        "   LEFT JOIN [WTDB].[dbo].courses c ON l.course_id = c.id AND c.code LIKE '%FCK%' " +
        "WHERE l.state_id = 4 " +
        "GROUP BY l.person_id"));

    result.uniquePersons = ArrayCount(uniquePersonList);

    LogEvent(loggerName, "[agent.id: " + agentId + "] Finished");
} catch (e) {
    LogEvent(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

EnableLog(loggerName,false);

Response.Write(tools.object_to_text(result.courses, "json"));