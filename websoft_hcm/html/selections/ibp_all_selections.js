// 7085721910666027817
function get_cert_number( _cert_id ){
    if ( _cert_id == '' ) { return '' }
    te_cert = tools.open_doc( _cert_id ).TopElem
    return te_cert.serial + "-" + te_cert.number + "/" + Year(te_cert.delivery_date)
}

courses_ids_arr = "7258899558722533245,6671106418291659865,6838854269792109574,6727253502766890095,6852554380951299709,6836087635825603553,6743177975518886480,6743176161780188235"
videocourses_ids_arr = ArrayMerge( XQuery( "for $elem in courses where MatchSome($elem/role_id,(7033858916945914689,7033858854651232288)) return $elem" ), "id", "," )

arr = ArraySelectAll( XQuery( "sql:
SELECT
object_datas.id AS PK
    , object_datas.object_id AS col_id
    , object_datas.sec_object_id AS tren_id
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''flag''])[1]/value[1]', 'varchar(max)') AS cert_flag
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_access''])[1]/value[1]', 'varchar(max)') AS date_access
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_1''])[1]/value[1]', 'varchar(max)') AS result_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_2''])[1]/value[1]', 'varchar(max)') AS result_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_3''])[1]/value[1]', 'varchar(max)') AS result_3
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_4''])[1]/value[1]', 'varchar(max)') AS result_4
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_5''])[1]/value[1]', 'varchar(max)') AS result_5
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''result_6''])[1]/value[1]', 'varchar(max)') AS result_6
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_1''])[1]/value[1]', 'varchar(max)') AS date_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_2''])[1]/value[1]', 'varchar(max)') AS date_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_3''])[1]/value[1]', 'varchar(max)') AS date_3
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_4''])[1]/value[1]', 'varchar(max)') AS date_4
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_5''])[1]/value[1]', 'varchar(max)') AS date_5
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''date_6''])[1]/value[1]', 'varchar(max)') AS date_6
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_1''])[1]/value[1]', 'varchar(max)') AS comment_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_2''])[1]/value[1]', 'varchar(max)') AS comment_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_3''])[1]/value[1]', 'varchar(max)') AS comment_3
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_4''])[1]/value[1]', 'varchar(max)') AS comment_4
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_5''])[1]/value[1]', 'varchar(max)') AS comment_5
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''comment_6''])[1]/value[1]', 'varchar(max)') AS comment_6
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_1''])[1]/value[1]', 'varchar(max)') AS certificate_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_2''])[1]/value[1]', 'varchar(max)') AS certificate_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_3''])[1]/value[1]', 'varchar(max)') AS certificate_3
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_4''])[1]/value[1]', 'varchar(max)') AS certificate_4
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_5''])[1]/value[1]', 'varchar(max)') AS certificate_5
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''certificate_6''])[1]/value[1]', 'varchar(max)') AS certificate_6
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_1''])[1]/value[1]', 'varchar(max)') AS task_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_2''])[1]/value[1]', 'varchar(max)') AS task_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_3''])[1]/value[1]', 'varchar(max)') AS task_3
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_1''])[1]/value[1]', 'varchar(max)') AS task_comm_1
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_2''])[1]/value[1]', 'varchar(max)') AS task_comm_2
    , object_data.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_3''])[1]/value[1]', 'varchar(max)') AS task_comm_3
    , group_collaborators.name AS group_name
FROM group_collaborators
    LEFT JOIN object_datas ON object_datas.object_id = group_collaborators.collaborator_id
    LEFT JOIN object_data ON object_data.id = object_datas.id
    LEFT JOIN [WTDB].[dbo].[group] g ON g.id = group_collaborators.group_id
WHERE group_collaborators.group_id IN (" + sSearchWord + ")
    AND object_datas.object_data_type_id = 6966499755925068211
ORDER BY g.created DESC
" ) )

final_arr = []

for ( elem in arr ){
    col_id = elem.col_id
    te_col = tools.open_doc( col_id ).TopElem
    te_col_org = tools.open_doc( te_col.org_id ).TopElem

    te_tren = tools.open_doc( elem.tren_id ).TopElem
    te_tren_org = tools.open_doc( te_tren.org_id ).TopElem

    obj = {}
    try {
        obj.SetProperty( "col_report_region_name", String( tools.open_doc( te_col_org.custom_elems.ObtainChildByKey( "report_region_id" ).value ).TopElem.name ) )
    } catch( e ) {
        obj.SetProperty( "col_report_region_name", "" )
    }
    obj.SetProperty( "col_fio", String( te_col.fullname ) )
    obj.SetProperty( "col_email", String( te_col.email ) )
    obj.SetProperty( "col_org_name", String( te_col.org_id.ForeignElem.name ) )
    obj.SetProperty( "col_org_inn", String( te_col_org.code ) )
    obj.SetProperty( "col_region", String( te_col_org.region_id.ForeignElem.name ) )
    obj.SetProperty( "tren_fio", String( te_tren.fullname ) )
    obj.SetProperty( "tren_email", String( te_tren.email ) )
    obj.SetProperty( "tren_region", String( te_tren_org.region_id.ForeignElem.name ) )

    obj.SetProperty( "cert_1", String( get_cert_number( elem.certificate_1 ) ) )
    obj.SetProperty( "cert_2", String( get_cert_number( elem.certificate_2 ) ) )
    obj.SetProperty( "cert_3", String( get_cert_number( elem.certificate_3 ) ) )
    obj.SetProperty( "cert_4", String( get_cert_number( elem.certificate_4 ) ) )
    obj.SetProperty( "cert_5", String( get_cert_number( elem.certificate_5 ) ) )
    obj.SetProperty( "cert_6", String( get_cert_number( elem.certificate_6 ) ) )

    obj.SetProperty( "PrimaryKey", String( elem.PK ) )
    for( fldElem in elem ){
        obj.SetProperty( fldElem.Name, String( fldElem ) )
    }

    // Пройдено ЭК из 8
    courses_arr = ArraySelectAll( XQuery( "sql:
    WITH Table_1 AS (
        SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM active_learnings
    WHERE
    active_learnings.person_id = " + col_id + "
    AND active_learnings.course_id IN (" + courses_ids_arr + ")
    UNION
    SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM learnings
    WHERE
    learnings.person_id = " + col_id + "
    AND learnings.course_id IN (" + courses_ids_arr + ")
)
    SELECT
    Table_1.id AS id
        , Table_1.course_id AS course_id
        , Table_1.course_name AS course_name
        , Table_1.score AS score
        , Table_1.start_usage_date AS start_usage_date
        , Table_1.last_usage_date AS last_usage_date
        , Table_1.start_learning_date AS start_learning_date
        , [common.learning_states].name AS state_name
    FROM Table_1
    LEFT JOIN [common.learning_states]
    ON [common.learning_states].id = Table_1.state_id
    ORDER BY
    Table_1.course_name DESC
        , Table_1.score DESC
        , Table_1.start_usage_date DESC
    " ) )
    final_courses_arr = ArraySelectDistinct( courses_arr, "This.course_id" )
    courses_num = 0
    for ( elem in final_courses_arr ) {
        if ( elem.state_name == "Пройден" ) courses_num++
    }
    obj.SetProperty( "courses_num", String( courses_num ) )
    // Пройдено ЭК из 8

    // Изучено видеозаписей семинаров из 5
    videocourses_arr = ArraySelectAll( XQuery( "sql:
    WITH Table_1 AS (
        SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM active_learnings
    WHERE
    active_learnings.person_id = " + col_id + "
    AND active_learnings.course_id IN (" + videocourses_ids_arr + ")
    UNION
    SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM learnings
    WHERE
    learnings.person_id = " + col_id + "
    AND learnings.course_id IN (" + videocourses_ids_arr + ")
)
    SELECT
    Table_1.id AS id
        , Table_1.course_id AS course_id
        , Table_1.course_name AS course_name
        , Table_1.score AS score
        , Table_1.start_usage_date AS start_usage_date
        , Table_1.last_usage_date AS last_usage_date
        , Table_1.start_learning_date AS start_learning_date
        , [common.learning_states].name AS state_name
    FROM Table_1
        LEFT JOIN [common.learning_states] ON [common.learning_states].id = Table_1.state_id
    ORDER BY Table_1.course_name DESC
        , Table_1.score DESC
        , Table_1.start_usage_date DESC
    " ) )
    final_videocourses_arr = ArraySelectDistinct( videocourses_arr, "This.course_id" )
    videocourses_num = 0
    for ( elem in final_videocourses_arr ) {
        if ( elem.state_name == "Пройден" ) videocourses_num++
    }

    obj.SetProperty( "videocourses_num", String( videocourses_num ) )
    // Изучено видеозаписей семинаров из 5

    final_arr.push( obj )
}

SORT.FIELD;
PAGING.MANUAL = false;
PAGING.SIZE = 10;
PAGING.TOTAL = ArrayCount(final_arr);
RESULT = ArraySort(final_arr, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));

COLUMNS = ([
    { "data" : "group_name", "hidden" : false, "sortable" : true, "title" : "Группа" }
    , { "data" : "col_fio", "hidden" : false, "sortable" : true, "title" : "ФИО ИБП" }
    , { "data" : "col_email", "hidden" : false, "sortable" : true, "title" : "email ИБП" }
    , { "data" : "col_org_name", "hidden" : false, "sortable" : true, "title" : "Орг. ИБП" }
    , { "data" : "col_org_inn", "hidden" : false, "sortable" : true, "title" : "Орг. ИНН ИБП" }
    , { "data" : "col_region", "hidden" : false, "sortable" : true, "title" : "Регион ИБП" }
    , { "data" : "tren_fio", "hidden" : false, "sortable" : true, "title" : "ФИО тренера РЦК" }
    , { "data" : "tren_email", "hidden" : false, "sortable" : true, "title" : "email тренера РЦК" }
    , { "data" : "tren_region", "hidden" : false, "sortable" : true, "title" : "Регион тренера РЦК" }
    , { "data" : "task_1", "hidden" : false, "sortable" : true, "title" : "Задание 1 Выполнение" }
    , { "data" : "task_comm_1", "hidden" : false, "sortable" : true, "title" : "Задание 1 Комментарий" }
    , { "data" : "task_2", "hidden" : false, "sortable" : true, "title" : "Задание 2 Выполнение" }
    , { "data" : "task_comm_2", "hidden" : false, "sortable" : true, "title" : "Задание 2 Комментарий" }
    , { "data" : "task_3", "hidden" : false, "sortable" : true, "title" : "Задание 3 Выполнение" }
    , { "data" : "task_comm_3", "hidden" : false, "sortable" : true, "title" : "Задание 3 Комментарий" }
    , { "data" : "courses_num", "hidden" : false, "sortable" : true, "title" : "Пройдено ЭК из 8" }
    , { "data" : "videocourses_num", "hidden" : false, "sortable" : true, "title" : "Изучено видеозаписей семинаров из 5" }
    , { "data" : "cert_flag", "hidden" : false, "sortable" : true, "title" : "Пройдена подготовка/Допущен к сертификации" }
    , { "data" : "date_access", "hidden" : false, "sortable" : true, "title" : "Дата допуска к сертификации" }
    , { "data" : "result_1", "hidden" : false, "sortable" : true, "title" : "Программа «7 видов потерь» Результат" }
    , { "data" : "date_1", "hidden" : false, "sortable" : true, "title" : "Программа «7 видов потерь» Дата сертификации" }
    , { "data" : "cert_1", "hidden" : false, "sortable" : true, "title" : "Программа «7 видов потерь» Номер сертификата" }
    , { "data" : "comment_1", "hidden" : false, "sortable" : true, "title" : "Программа «7 видов потерь» Комментарий" }
    , { "data" : "result_2", "hidden" : false, "sortable" : true, "title" : "Программа «5С на производстве» Результат" }
    , { "data" : "date_2", "hidden" : false, "sortable" : true, "title" : "Программа «5С на производстве» Дата сертификации" }
    , { "data" : "cert_2", "hidden" : false, "sortable" : true, "title" : "Программа «5С на производстве» Номер сертификата" }
    , { "data" : "comment_2", "hidden" : false, "sortable" : true, "title" : "Программа «5С на производстве» Комментарий" }
    , { "data" : "result_3", "hidden" : false, "sortable" : true, "title" : "Программа «Реализация проекта по улучшению» Результат" }
    , { "data" : "date_3", "hidden" : false, "sortable" : true, "title" : "Программа «Реализация проекта по улучшению» Дата сертификации" }
    , { "data" : "cert_3", "hidden" : false, "sortable" : true, "title" : "Программа «Реализация проекта по улучшению» Номер сертификата" }
    , { "data" : "comment_3", "hidden" : false, "sortable" : true, "title" : "Программа «Реализация проекта по улучшению» Комментарий" }
    , { "data" : "result_4", "hidden" : false, "sortable" : true, "title" : "Программа «Картирование» Результат" }
    , { "data" : "date_4", "hidden" : false, "sortable" : true, "title" : "Программа «Картирование» Дата сертификации" }
    , { "data" : "cert_4", "hidden" : false, "sortable" : true, "title" : "Программа «Картирование» Номер сертификата" }
    , { "data" : "comment_4", "hidden" : false, "sortable" : true, "title" : "Программа «Картирование» Комментарий" }
    , { "data" : "result_5", "hidden" : false, "sortable" : true, "title" : "Программа «Методика решения проблем» Результат" }
    , { "data" : "date_5", "hidden" : false, "sortable" : true, "title" : "Программа «Методика решения проблем» Дата сертификации" }
    , { "data" : "cert_5", "hidden" : false, "sortable" : true, "title" : "Программа «Методика решения проблем» Номер сертификата" }
    , { "data" : "comment_5", "hidden" : false, "sortable" : true, "title" : "Программа «Методика решения проблем» Комментарий" }
    , { "data" : "result_6", "hidden" : false, "sortable" : true, "title" : "Программа «Производственный анализ» Результат" }
    , { "data" : "date_6", "hidden" : false, "sortable" : true, "title" : "Программа «Производственный анализ» Дата сертификации" }
    , { "data" : "cert_6", "hidden" : false, "sortable" : true, "title" : "Программа «Производственный анализ» Номер сертификата" }
    , { "data" : "comment_6", "hidden" : false, "sortable" : true, "title" : "Программа «Производственный анализ» Комментарий" }
    , { "data" : "col_report_region_name", "hidden" : false, "sortable" : true, "title" : "Учитывать в отчетности региона" }
    , { "data" : "PrimaryKey", "hidden" : true, "sortable" : false, "title" : "ID Результ." }
])
