<%
// 7428876886603078129
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

var agentId = 7428876886603078129;
var loggerName = "agent_7428876886603078129";

var result = {};
result.errorMessage = "";

try {
    regionId = OptInt(Request.Query.GetOptProperty("region_id", "0"));

    // Chart block
    chartList = ArrayDirect(XQuery("sql: " +
        " SELECT MONTH(courses.start_usage_date) AS month, YEAR(courses.start_usage_date) AS year, COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings AS courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getLongQuery(regionId) +
        " WHERE (courses.state_id = 3 OR courses.state_id = 4) " +
        " AND YEAR(courses.start_usage_date) >= YEAR(GETDATE()) - 1 " +
        " GROUP BY MONTH(courses.start_usage_date), YEAR(courses.start_usage_date) " +
        " ORDER BY year, month "));

    result.chartData = [];

    for(chartData in chartList) {
        charElement = {};

        charElement.month = chartData.month;
        charElement.year = chartData.year;
        charElement.count = chartData.cnt;

        result.chartData.push(charElement);
    }

    // Block1 (Уникально обученные)
    block1List = ArrayDirect(XQuery("sql: " +
        " WITH _view AS " + " ( SELECT cs.id " +
        "       FROM [WTDB].[dbo].learnings courses " +
        "           INNER JOIN [WTDB].[dbo].collaborators cs ON courses.person_id = cs.id " +
        "           INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getShortQuery(regionId) +
        "       WHERE cs.login NOT LIKE '%muc%' " +
        "       GROUP BY cs.id) " +
        " SELECT COUNT(id) AS cnt" +
        " FROM _view "));

    result.block1Value = 0;

    if(ArrayCount(block1List) > 0) {
        result.block1Value = block1List[0].cnt;
    }

    // Block2 (Размещено курсов)
    block2List = ArrayDirect(XQuery("sql: " +
        " WITH _view AS (SELECT " + "c.data.value('(//custom_elems/custom_elem[name=''expluatation_date'']/value)[1]', 'date') AS expluatation_date, cs.id " +
        "               FROM [WTDB].[dbo].courses cs " +
        "                        INNER JOIN [WTDB].[dbo].course c ON cs.id = c.id " +
        "               WHERE cs.status = 'publish' " +
        " ) " +
        " SELECT YEAR(expluatation_date) AS year, COUNT(id) AS cnt " +
        " FROM _view " +
        " GROUP BY YEAR(expluatation_date); "));



    result.block2Data = [];

    for(block2Element in block2List) {
        element = {};

        element.year = block2Element.year;
        element.count = block2Element.cnt;

        result.block2Data.push(element);
    }

    // Block3 (Назначено)
    block3List = ArrayDirect(XQuery("sql: " +
        " SELECT YEAR(courses.start_usage_date) AS year, COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getLongQuery(regionId) +
        " WHERE courses.state_id = 1 " +
        " GROUP BY YEAR(courses.start_usage_date) " +
        " ORDER BY year"));

    result.block3Data = [];

    for(block3Element in block3List) {
        element = {};

        element.year = block3Element.year;
        element.count = block3Element.cnt;

        result.block3Data.push(element);
    }

    // Block4 (Назначено)
    block4List = ArrayDirect(XQuery("sql: " +
        " SELECT YEAR(courses.start_usage_date) AS year, COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].active_learnings courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getLongQuery(regionId) +
        " WHERE courses.state_id = 0 " +
        " GROUP BY YEAR(courses.start_usage_date) " +
        " ORDER BY year"));

    result.block4Data = [];

    for(block4Element in block4List) {
        element = {};

        element.year = block4Element.year;
        element.count = block4Element.cnt;

        result.block4Data.push(element);
    }

    // Block5 (Пройдено)
    block5List = ArrayDirect(XQuery("sql: " +
        " SELECT YEAR(courses.start_usage_date) AS year, COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getLongQuery(regionId) +
        " WHERE courses.state_id = 4 " +
        " GROUP BY YEAR(courses.start_usage_date) " +
        " ORDER BY year"));

    result.block5Data = [];

    for(block5Element in block5List) {
        element = {};

        element.year = block5Element.year;
        element.count = block5Element.cnt;

        result.block5Data.push(element);
    }

    // Block 6. For (Доходимость) calculate only
    block6List = ArrayDirect(XQuery("sql: " +
        " SELECT COUNT(courses.id) AS cnt " +
        " FROM [WTDB].[dbo].learnings courses " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON courses.course_id = crs.id AND crs.code LIKE '%FCK-%' " + getLongQuery(regionId) +
        " WHERE courses.state_id = 3 "));

    result.block6Value = 0;

    if(ArrayCount(block6List) > 0) {
        result.block6Value = block6List[0].cnt;
    }

    topCoursesList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 5 crs.name, COUNT(crs.id) as count " +
        " FROM [WTDB].[dbo].learnings AS ls " +
        "   INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        " WHERE ls.state_id = 4 " +
        "   AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "   AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        " GROUP BY crs.name " +
        " ORDER BY count DESC "));

    result.topCoursesData = [];
    if(ArrayCount(topCoursesList) > 0) {
        for(course in topCoursesList) {
            element = {};
            element.name = course.name;
            element.count = course.count;

            result.topCoursesData.push(element);
        }
    }

    topOrgsList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 7 os.id, os.name, COUNT(os.id) as count " +
        " FROM [WTDB].[dbo].learnings AS ls " +
        "         INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "         INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        " WHERE ls.state_id = 4 " +
        "  AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "  AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        " GROUP BY os.id, os.name " +
        " ORDER BY count DESC "));

    result.topOrgsData = [];
    if(ArrayCount(topOrgsList) > 0) {
        for(org in topOrgsList) {
            element = {};
            element.name = org.name;
            element.count = org.count;

            result.topOrgsData.push(element);
        }
    }

    topRegionList = ArrayDirect(XQuery("sql: " +
        " SELECT rs.id, rs.name, COUNT(crs.id) as count " +
        "         FROM [WTDB].[dbo].learnings AS ls " +
        "           INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "           INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "           INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "           INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        "         WHERE ls.state_id = 4 " +
        "           AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "           AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "         GROUP BY rs.id, rs.name " +
        "         ORDER BY count DESC "));

    result.topRegionData = [];
    if(ArrayCount(topRegionList) > 0) {
        for(region in topRegionList) {
            element = {};
            element.id = "" + region.id;
            element.name = region.name;
            element.count = region.count;

            result.topRegionData.push(element);
        }
    }

    divisionList = ArrayDirect(XQuery("sql: " +
        " WITH _view AS (SELECT 'ФЦК' AS division " +
        "            FROM [WTDB].[dbo].learnings AS ls " +
        "                        INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "                        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "                        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "            WHERE ls.state_id = 4 " +
        "                AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "                AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "                AND o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'fcc' " +
        " ) " +
        " SELECT division, COUNT(*) AS count " +
        " INTO _tbl1 " +
        " FROM _view " +
        " GROUP BY division " +
        " ORDER BY count DESC; " +
        " " +
        " WITH _view AS (SELECT 'РЦК' AS division " +
        "               FROM [WTDB].[dbo].learnings AS ls " +
        "                        INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "                        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "                        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "               WHERE ls.state_id = 4 " +
        "                 AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "                 AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "                 AND o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'rcc' " +
        " ) " +
        " SELECT division, COUNT(*) AS count " +
        " INTO _tbl2 " +
        " FROM _view " +
        " GROUP BY division " +
        " ORDER BY count DESC; " +
        " " +
        " SELECT * " +
        " INTO _result1 " +
        " FROM ( " +
        "         SELECT * " +
        "         FROM _tbl1 " +
        "         UNION " +
        "         SELECT * " +
        "         FROM _tbl2 " +
        "     ) AS _tmp; " +
        " " +
        " WITH _view AS (SELECT 'Самостоятельно' AS division " +
        "               FROM [WTDB].[dbo].learnings AS ls " +
        "                        INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "                        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "                        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "               WHERE ls.state_id = 4 " +
        "                 AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "                 AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "                 AND o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'independently' " +
        " ) " +
        " SELECT division, COUNT(*) AS count " +
        " INTO _tbl3 " +
        " FROM _view " +
        " GROUP BY division " +
        " ORDER BY count DESC; " +
        " " +
        " SELECT * " +
        " INTO _result2 " +
        " FROM ( " +
        "         SELECT * " +
        "         FROM _tbl3 " +
        "         UNION " +
        "         SELECT * " +
        "         FROM _result1 " +
        "     ) AS _tmp; " +
        " " +
        " WITH _view AS (SELECT 'РОИВ' AS division " +
        "               FROM [WTDB].[dbo].learnings AS ls " +
        "                        INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "                        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "                        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "               WHERE ls.state_id = 4 " +
        "                 AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "                 AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "                 AND o.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'bit') = '1' " +
        " ) " +
        " SELECT division, COUNT(*) AS count " +
        " INTO _tbl4 " +
        " FROM _view " +
        " GROUP BY division " +
        " ORDER BY count DESC; " +
        " " +
        " SELECT * " +
        " INTO _result3 " +
        " FROM ( " +
        "         SELECT * " +
        "         FROM _tbl4 " +
        "         UNION " +
        "         SELECT * " +
        "         FROM _result2 " +
        "     ) AS _tmp; " +
        " " +
        " WITH _view AS (SELECT 'Коммерция' AS division " +
        "               FROM [WTDB].[dbo].learnings AS ls " +
        "                        INNER JOIN [WTDB].[dbo].courses crs ON ls.course_id = crs.id AND crs.code LIKE '%FCK-%' " +
        "                        INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id " +
        "                        INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "                        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "               WHERE ls.state_id = 4 " +
        "                 AND MONTH(ls.start_usage_date) = MONTH(GETDATE()) " +
        "                 AND YEAR(ls.start_usage_date) = YEAR(GETDATE()) " +
        "                 AND o.data.value('(org/custom_elems/custom_elem[name=''is_a_commerce_client''])[1]/value[1]', 'bit') = '1' " +
        " ) " +
        " SELECT division, COUNT(*) AS count " +
        " INTO _tbl5 " +
        " FROM _view " +
        " GROUP BY division " +
        " ORDER BY count DESC; " +
        " " +
        " SELECT * " +
        " INTO _result4 " +
        " FROM ( " +
        "         SELECT * " +
        "         FROM _tbl5 " +
        "         UNION " +
        "         SELECT * " +
        "         FROM _result3 " +
        "     ) AS _tmp; " +
        " " +
        " SELECT * " +
        " FROM _result4 " +
        " ORDER BY count DESC; " +
        " " +
        " DROP TABLE " + "_tbl1; DROP TABLE _tbl2; DROP TABLE _result1; DROP TABLE _tbl3; " +
        " DROP TABLE " + "_result2; DROP TABLE _tbl4; DROP TABLE _result3; DROP TABLE _tbl5; DROP TABLE _result4; "));

    result.divisionData = [];
    if(ArrayCount(divisionList) > 0) {
        for(division in divisionList) {
            element = {};
            element.name = division.division;
            element.count = division.count;

            result.divisionData.push(element);
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>