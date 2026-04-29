// 7122058815701410688
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7122058815701410688;
var loggerName = "report_7122058815701410688";

var xarrResults = new Array();

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    //var RESULT = tools_web.get_user_data("boss_panel_collaborators_cache_for_reports" + OptInt(curUserID));

    //aCollIds = ArrayExtract(RESULT.result_array, "This");

    COLUMNS = ([
        {"data": "id", "title": "ID", "width": "50", "type": "string", "ghost": false, "hidden": true},
        {"data": "fullname", "title": "ФИО", "type": "link", "sortable": true, "colorsource": "color", "minwidth": 250, "click": ("OPENURL=view_doc.html?mode=collaborator&doc_id=" + curDocID + "&object_id={id}")},
        {"data": "email", "title": "Email",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "org_inn", "title": "ИНН",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "org_name", "title": "Название организации",  "type": "string", "sortable": true, "colorsource": "color", "width": 200},
        {"data": "org_region", "title": "Регион",  "type": "string", "sortable": true, "colorsource": "color", "width": 100},
        {"data": "course_name", "title": "Название курса",  "type": "string", "sortable": true, "colorsource": "color", "width": 200},
        {"data": "course_code", "title": "Код курса",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "start_usage_date", "title": "Дата активации",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "enrolled", "title": "Тип активации",  "type": "string", "sortable": true, "colorsource": "color", "width": 200},
        {"data": "start_learning_date", "title": "Дата начала",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "last_usage_date", "title": "Дата завершения",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "score", "title": "Балл",  "type": "integer", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "status", "title": "Статус курса",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "coll_create_date", "title": "Дата регистрации",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "number", "title": "Номер сертификата", "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        { "data": "category", "title": "Категория курсов", "type": "string", "sortable": true, "colorsource": "color", "width": 200 },
    ]);

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ids " +
        " FROM [WTDB].[dbo].cc_boss_cache_ids " +
        " WHERE person_id = " + curUserID +
        "   AND CONVERT(DATE, created_date) >= CONVERT(DATE, DATEADD(DAY,  -1 , GETDATE()))"));

    step = 1;

    for (data in dataList) {
        collList = XQuery("sql: " +
            " WITH _view AS ( " +
            "    SELECT cols.id, " +
            "        cols.fullname, " +
            "        cols.email, " +
            "        ogs.name AS org_name, " +
            "        ogs.code AS org_inn, " +
            "        og.data.value('(//custom_elems/custom_elem[name=''region_code'']/value)[1]', 'varchar(5)') AS org_region, " +
            "        FORMAT(CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]', 'date'), 104), 'dd.MM.yyyy') AS coll_create_date " +
            "    FROM [WTDB].[dbo].collaborators cols " +
            "        INNER JOIN [WTDB].[dbo].collaborator col ON col.id = cols.id " +
            "        INNER JOIN [WTDB].[dbo].orgs ogs ON ogs.id = cols.org_id " +
            "        INNER JOIN [WTDB].[dbo].org og ON og.id = ogs.id " +
            "    WHERE cols.id IN (" + data.ids + ") " +
            "        AND (cols.code IS NULL OR NOT cols.code LIKE '%muc%') " +
            " ), " +
            " _view1 AS ( " +
            "        SELECT tc.*, " +
            "            crs.code AS course_code, " +
            "            crs.name AS course_name, " +
            "            FORMAT(als.start_usage_date, 'dd.MM.yy HH:mm') AS start_usage_date, " +
            "            IIF(al.data.value('(//is_self_enrolled)[1]', 'bit') = 1, 'Самостоятельно', 'Назначен') AS enrolled, " +
            "            FORMAT(als.start_learning_date, 'dd.MM.yy HH:mm') AS start_learning_date, " +
            "            FORMAT(als.last_usage_date, 'dd.MM.yy HH:mm') AS last_usage_date, " +
            "            als.score, " +
            "            CASE als.state_id " +
            "                WHEN 0 THEN 'Назначен' " +
            "                WHEN 1 THEN 'В процессе' " +
            "                WHEN 2 THEN 'Завершен' " +
            "                WHEN 3 THEN 'Не пройден' " +
            "                WHEN 4 THEN 'Пройден' " +
            "                WHEN 5 THEN 'Просмотрен' " +
            "           END AS status, " +
            "           cs.data.value('(//custom_elems/custom_elem[name=''category'']/value)[1]', 'varchar(max)') AS category " +
            "        FROM _view tc " +
            "            INNER JOIN [WTDB].[dbo].active_learnings als ON als.person_id = tc.id " +
            "            INNER JOIN [WTDB].[dbo].courses crs ON crs.id = als.course_id " +
            "            INNER JOIN [WTDB].[dbo].course cs ON crs.id = cs.id " +
            "            INNER JOIN [WTDB].[dbo].active_learning al ON al.id = als.id " +
            "    UNION " +
            "        SELECT tc.*, " +
            "            crs.code course_code, " +
            "            crs.name course_name, " +
            "            FORMAT(als.start_usage_date, 'dd.MM.yy HH:mm') start_usage_date, " +
            "            IIF(al.data.value('(//is_self_enrolled)[1]', 'bit') = 1, 'Самостоятельно', 'Назначен') enrolled, " +
            "            FORMAT(als.start_learning_date, 'dd.MM.yy HH:mm') start_learning_date, " +
            "            FORMAT(als.last_usage_date, 'dd.MM.yy HH:mm') last_usage_date, " +
            "            als.score, " +
            "            CASE als.state_id " +
            "                WHEN 0 THEN 'Назначен' " +
            "                WHEN 1 THEN 'В процессе' " +
            "                WHEN 2 THEN 'Завершен' " +
            "                WHEN 3 THEN 'Не пройден' " +
            "                WHEN 4 THEN 'Пройден' " +
            "                WHEN 5 THEN 'Просмотрен' " +
            "           END status, " +
            "           cs.data.value('(//custom_elems/custom_elem[name=''category'']/value)[1]', 'varchar(max)') AS category " +
            "        FROM _view tc " +
            "            INNER JOIN [WTDB].[dbo].learnings als ON als.person_id = tc.id " +
            "            INNER JOIN [WTDB].[dbo].courses crs ON crs.id = als.course_id " +
            "            INNER JOIN [WTDB].[dbo].course cs ON crs.id = cs.id " +
            "            INNER JOIN [WTDB].[dbo].learning al ON al.id = als.id " +
            " ) " +
            " SELECT _view1.*, " +
            "       IIF(cs.id IS NULL, null, CONCAT(cs.serial, '-', cs.number,'/', YEAR(cs.delivery_date))) AS number " +
            " FROM _view1 " +
            "    LEFT JOIN [WTDB].[dbo].certificates cs ON _view1.last_usage_date =  FORMAT(cs.delivery_date, 'dd.MM.yy HH:mm') " +
            "        AND cs.type_id = 7015457522352069961 " +
            "        AND cs.person_id IN (" + data.ids + ") ");

        for (coll in collList) {
            element = {};
            element.id = coll.id.Value;
            element.fullname = coll.fullname.Value;
            element.email = coll.email.Value;
            element.org_name = coll.org_name.Value;
            element.org_inn = coll.org_inn.Value;
            element.org_region = coll.org_region.Value;
            element.coll_create_date = coll.coll_create_date.Value;
            element.course_code = coll.course_code.Value;
            element.course_name = coll.course_name.Value;
            element.start_usage_date = coll.start_usage_date.Value;
            element.enrolled = coll.enrolled.Value;
            element.start_learning_date = coll.start_learning_date.Value;
            element.last_usage_date = coll.last_usage_date.Value;
            element.score = coll.score.Value;
            element.status = coll.status.Value;
            element.number = coll.number.Value;
            element.category = coll.category.Value;

            xarrResults.push(element);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Step: " + step + " Count: " + ArrayCount(xarrResults));
		addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished cources");
        step++;
    }

    RESULT = xarrResults;
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}