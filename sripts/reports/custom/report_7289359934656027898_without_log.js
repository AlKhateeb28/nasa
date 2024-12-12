// 7289359934656027898
function get_cert_number( _cert_id ){
    if ( _cert_id == '' ) { return '' }
    te_cert = tools.open_doc( _cert_id ).TopElem
    return te_cert.serial + "-" + te_cert.number + "/" + Year(te_cert.delivery_date)
}

courses_ids_arr = "6644416288763437283,6671106418291659865,6838854269792109574,6727253502766890095,6852554380951299709,6836087635825603553,6743177975518886480,6743176161780188235"
videocourses_ids_arr = "6965774666385153326,6966161248012621159,6966165131940952893,6966162084849146109,6966211279387184178"
ibp_courses_ids_arr = "7119812308457777642,7119812071712565068,7119812165002090859,7119812388344499932,7119811761202858978"

if ( {PARAM1} == null || {PARAM1} == '' ) {
    if ( {PARAM2} == null || {PARAM2} == '' ) {
        param_str = ''
    } else {
        param_str = "AND group_collaborators.code LIKE '%" + {PARAM2} + "%'"
    }
} else {
    param_str = 'AND group_collaborators.group_id=' + {PARAM1}
}


arr = XQuery( "sql:
SELECT
object_datas.id AS PK
    , object_datas.object_id AS col_id
    , object_datas.sec_object_id AS tren_id
    , CASE
WHEN object_data.data.value('(object_data/custom_elems/custom_elem[name=''flag''])[1]/value[1]', 'varchar(max)') = '1' THEN '1'
ELSE '0'
END AS cert_flag
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
FROM object_datas
LEFT JOIN group_collaborators
ON object_datas.object_id = group_collaborators.collaborator_id
LEFT JOIN object_data
ON object_data.id = object_datas.id
WHERE
object_datas.object_data_type_id = 6966499755925068211
" + param_str + "
" )

arr = ArraySelectDistinct( arr, "This.PK" )

final_arr = []

for ( elem in arr ){
    col_id = elem.col_id
    te_col = tools.open_doc( col_id ).TopElem

    te_col_org = tools.open_doc( te_col.org_id ).TopElem

    col_org_fact_region_id = te_col_org.custom_elems.ObtainChildByKey( "fact_region_id" ).value
    col_org_reg_name =  col_org_fact_region_id == "" ? te_col_org.region_id.ForeignElem.name : tools.open_doc( col_org_fact_region_id ).TopElem.name

    try {
        col_org_report_region_name = tools.open_doc( te_col_org.custom_elems.ObtainChildByKey( "report_region_id" ).value ).TopElem.name
    } catch( e ) {
        col_org_report_region_name = ""
    }
    te_tren = tools.open_doc( elem.tren_id ).TopElem
    te_tren_org = tools.open_doc( te_tren.org_id ).TopElem
    tren_org_fact_region_id = te_tren_org.custom_elems.ObtainChildByKey( "fact_region_id" ).value
    tren_org_reg_name =  tren_org_fact_region_id == "" ? te_tren_org.region_id.ForeignElem.name : tools.open_doc( te_tren_org.custom_elems.ObtainChildByKey( "fact_region_id" ).value ).TopElem.name

    obj = {}
    obj.SetProperty( "col_fio", String( te_col.fullname ) )
    obj.SetProperty( "col_email", String( te_col.email ) )
    obj.SetProperty( "col_org_name", String( te_col.org_id.ForeignElem.name ) )
    obj.SetProperty( "col_org_inn", String( te_col_org.code ) )
    obj.SetProperty( "col_region", String( col_org_reg_name ) )
    obj.SetProperty( "col_org_report_region_name", String( col_org_report_region_name ) )
    obj.SetProperty( "tren_fio", String( te_tren.fullname ) )
    obj.SetProperty( "tren_email", String( te_tren.email ) )
    obj.SetProperty( "tren_region", String( tren_org_reg_name ) )

    obj.SetProperty( "cert_1", String( get_cert_number( elem.certificate_1 ) ) )
    obj.SetProperty( "cert_2", String( get_cert_number( elem.certificate_2 ) ) )
    obj.SetProperty( "cert_3", String( get_cert_number( elem.certificate_3 ) ) )
    obj.SetProperty( "cert_4", String( get_cert_number( elem.certificate_4 ) ) )
    obj.SetProperty( "cert_5", String( get_cert_number( elem.certificate_5 ) ) )
    obj.SetProperty( "cert_6", String( get_cert_number( elem.certificate_6 ) ) )

    groups_arr = ArraySelectAll( XQuery( "for $elem in group_collaborators where $elem/collaborator_id = " + elem.col_id + " and contains($elem/code, 'ModProg_FCK_') return $elem" ) )
    obj.SetProperty( "groups", ArrayMerge( groups_arr, "name", '; ' ) )

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
    LEFT JOIN [common.learning_states]
    ON [common.learning_states].id = Table_1.state_id
    ORDER BY
    Table_1.course_name DESC
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

    // Изучено методразборов программ из 5
    ibp_courses_arr = ArraySelectAll( XQuery( "sql:
    WITH Table_1 AS (
        SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM active_learnings
    WHERE
    active_learnings.person_id = " + col_id + "
    AND active_learnings.course_id IN (" + ibp_courses_ids_arr + ")
    UNION
    SELECT
    id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
    FROM learnings
    WHERE
    learnings.person_id = " + col_id + "
    AND learnings.course_id IN (" + ibp_courses_ids_arr + ")
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
    final_ibp_courses_arr = ArraySelectDistinct( ibp_courses_arr, "This.course_id" )
    ibp_courses_num = 0
    for ( elem in final_ibp_courses_arr ) {
        if ( elem.state_name == "Пройден" ) ibp_courses_num++
    }

    obj.SetProperty( "ibp_courses_num", String( ibp_courses_num ) )
    // Изучено методразборов программ из 5

    found_al = ArrayOptFirstElem( XQuery( "for $elem in active_learnings where course_id=7119812540134335010 and person_id=" + col_id + " and state_id=2 return $elem" ) )
    found_l = ArrayOptFirstElem( XQuery( "for $elem in learnings where course_id=7119812540134335010 and person_id=" + col_id + " and state_id=4 return $elem" ) )
    ibp_tt_01 = ( found_al != undefined || found_l != undefined ) ? 1 : 0
    obj.SetProperty( "ibp_tt_01", String( ibp_tt_01 ) )

    final_arr.push( obj )
}

columns.Clear()

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "ФИО ИБП"
_cc.column_value = "ListElem.col_fio"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "email ИБП"
_cc.column_value = "ListElem.col_email"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Орг. ИБП"
_cc.column_value = "ListElem.col_org_name"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Орг. ИНН ИБП"
_cc.column_value = "ListElem.col_org_inn"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Регион ИБП"
_cc.column_value = "ListElem.col_region"


_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Регион в отчетности"
_cc.column_value = "ListElem.col_org_report_region_name"


_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "ФИО тренера РЦК"
_cc.column_value = "ListElem.tren_fio"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "email тренера РЦК"
_cc.column_value = "ListElem.tren_email"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Регион тренера РЦК"
_cc.column_value = "ListElem.tren_region"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 1 Выполнение"
_cc.column_value = "ListElem.task_1"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 1 Комментарий"
_cc.column_value = "ListElem.task_comm_1"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 2 Выполнение"
_cc.column_value = "ListElem.task_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 2 Комментарий"
_cc.column_value = "ListElem.task_comm_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 3 Выполнение"
_cc.column_value = "ListElem.task_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Задание 3 Комментарий"
_cc.column_value = "ListElem.task_comm_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Пройдено ЭК из 8"
_cc.column_value = "ListElem.courses_num"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Изучено видеозаписей семинаров из 5"
_cc.column_value = "ListElem.videocourses_num"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Изучено методразборов программ из 5"
_cc.column_value = "ListElem.ibp_courses_num"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Изучен онлайн-тренинг Принципы и технологии обучения взрослых"
_cc.column_value = "ListElem.ibp_tt_01"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Пройдена подготовка/Допущен к сертификации"
_cc.column_value = "ListElem.cert_flag"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Дата допуска к сертификации"
_cc.column_value = "ListElem.date_access"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «7 видов потерь» Результат"
_cc.column_value = "ListElem.result_1"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «7 видов потерь» Дата сертификации"
_cc.column_value = "ListElem.date_1"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «7 видов потерь» Номер сертификата"
_cc.column_value = "ListElem.cert_1"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «7 видов потерь» Комментарий"
_cc.column_value = "ListElem.comment_1"


_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «5С на производстве» Результат"
_cc.column_value = "ListElem.result_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «5С на производстве» Дата сертификации"
_cc.column_value = "ListElem.date_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «5С на производстве» Номер сертификата"
_cc.column_value = "ListElem.cert_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «5С на производстве» Комментарий"
_cc.column_value = "ListElem.comment_2"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Реализация проекта по улучшению» Результат"
_cc.column_value = "ListElem.result_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Реализация проекта по улучшению» Дата сертификации"
_cc.column_value = "ListElem.date_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Реализация проекта по улучшению» Номер сертификата"
_cc.column_value = "ListElem.cert_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Реализация проекта по улучшению» Комментарий"
_cc.column_value = "ListElem.comment_3"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Картирование» Результат"
_cc.column_value = "ListElem.result_4"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Картирование» Дата сертификации"
_cc.column_value = "ListElem.date_4"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Картирование» Номер сертификата"
_cc.column_value = "ListElem.cert_4"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Картирование» Комментарий"
_cc.column_value = "ListElem.comment_4"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Методика решения проблем» Результат"
_cc.column_value = "ListElem.result_5"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Методика решения проблем» Дата сертификации"
_cc.column_value = "ListElem.date_5"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Методика решения проблем» Номер сертификата"
_cc.column_value = "ListElem.cert_5"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Методика решения проблем» Комментарий"
_cc.column_value = "ListElem.comment_5"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Производственный анализ» Результат"
_cc.column_value = "ListElem.result_6"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Производственный анализ» Дата сертификации"
_cc.column_value = "ListElem.date_6"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Производственный анализ» Номер сертификата"
_cc.column_value = "ListElem.cert_6"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Программа «Производственный анализ» Комментарий"
_cc.column_value = "ListElem.comment_6"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Группы"
_cc.column_value = "ListElem.groups"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = false
_cc.datatype = "string"
_cc.column_width = "15"
_cc.column_title = "ID Результ."
_cc.column_value = "ListElem.PrimaryKey"

return final_arr