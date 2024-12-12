// 7122058815701410688
RESULT = tools_web.get_user_data("boss_panel_collaborators_cache_for_reports" + curUserID);

aCollIds = ArrayExtract(RESULT.result_array, "This.id");

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
    {"data": "coll_create_date", "title": "Дата регистрации",  "type": "string", "sortable": true, "colorsource": "color", "width": 150}
]);

var sQuery = "sql:\
    IF (OBJECT_ID('tempdb..#t_cols_data') IS NOT NULL) DROP TABLE #t_cols_data;\
\
    CREATE TABLE #t_cols_data\
    (\
        id BIGINT,\
        fullname NVARCHAR(max),\
        email NVARCHAR(max),\
        org_name NVARCHAR(max),\
        org_inn VARCHAR(30),\
        org_region VARCHAR(5),\
		coll_create_date VARCHAR(30)\
    );\
\
    INSERT INTO #t_cols_data\
    SELECT\
        cols.id,\
        cols.fullname,\
        cols.email,\
		ogs.name org_name,\
        ogs.code org_inn,\
        og.data.value('(//custom_elems/custom_elem[name=''region_code'']/value)[1]', 'varchar(5)') org_region,\
		FORMAT(CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','date'), 104), 'dd.MM.yyyy') coll_create_date \
    FROM\
        collaborators cols\
		INNER JOIN collaborator col ON col.id = cols.id
JOIN orgs ogs ON ogs.id = cols.org_id\
        JOIN org og ON og.id = ogs.id\
    WHERE\
        cols.id IN ( " + ArrayMerge(aCollIds, "This", ",") + " )\
        AND (cols.code IS NULL OR NOT cols.code LIKE '%muc%')\
\
    SELECT\
        tc.*,\
        crs.code course_code,\
        crs.name course_name,\
        FORMAT(als.start_usage_date, 'dd.MM.yy HH:mm') start_usage_date,\
        IIF(al.data.value('(//is_self_enrolled)[1]', 'bit') = 1, 'Самостоятельно', 'Назначен') enrolled,\
        FORMAT(als.start_learning_date, 'dd.MM.yy HH:mm') start_learning_date,\
        FORMAT(als.last_usage_date, 'dd.MM.yy HH:mm') last_usage_date,\
        als.score,\
        CASE als.state_id\
            WHEN 0 THEN 'Назначен'\
            WHEN 1 THEN 'В процессе'\
            WHEN 2 THEN 'Завершен'\
            WHEN 3 THEN 'Не пройден'\
            WHEN 4 THEN 'Пройден'\
            WHEN 5 THEN 'Просмотрен'\
        END status\
    FROM\
        #t_cols_data tc\
        JOIN active_learnings als ON als.person_id = tc.id\
        JOIN courses crs ON crs.id = als.course_id\
        JOIN active_learning al ON al.id = als.id\
    UNION\
    SELECT\
        tc.*,\
        crs.code course_code,\
        crs.name course_name,\
        FORMAT(als.start_usage_date, 'dd.MM.yy HH:mm') start_usage_date,\
        IIF(al.data.value('(//is_self_enrolled)[1]', 'bit') = 1, 'Самостоятельно', 'Назначен') enrolled,\
        FORMAT(als.start_learning_date, 'dd.MM.yy HH:mm') start_learning_date,\
        FORMAT(als.last_usage_date, 'dd.MM.yy HH:mm') last_usage_date,\
        als.score,\
        CASE als.state_id\
            WHEN 0 THEN 'Назначен'\
            WHEN 1 THEN 'В процессе'\
            WHEN 2 THEN 'Завершен'\
            WHEN 3 THEN 'Не пройден'\
            WHEN 4 THEN 'Пройден'\
            WHEN 5 THEN 'Просмотрен'\
        END status\
    FROM\
        #t_cols_data tc\
        JOIN learnings als ON als.person_id = tc.id\
        JOIN courses crs ON crs.id = als.course_id\
        JOIN learning al ON al.id = als.id\
    IF (OBJECT_ID('tempdb..#t_cols_data') IS NOT NULL) DROP TABLE #t_cols_data;\
";


RESULT = XQuery(sQuery);