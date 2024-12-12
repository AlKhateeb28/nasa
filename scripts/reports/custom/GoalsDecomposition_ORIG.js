date_from = ( {PARAM1} == null || {PARAM1} == '' ) ? '01.01.2000 00:00:00' : {PARAM1}
date_to = ( {PARAM2} == null || {PARAM2} == '' ) ? '01.01.3000 00:00:00' : {PARAM2}
param_str = ( {PARAM3} == null || {PARAM3} == '' ) ? '' : 'AND events.education_method_id IN(' + {PARAM3} + ')'

arr = ArraySelectAll( XQuery( "sql:
SET DATEFORMAT dmy
DECLARE @date_from datetime = '" + date_from + "'
DECLARE @date_to datetime = '" + date_to + "'
;
SELECT
event_results.id AS PK
    , events.finish_date AS e_finish_date
    , orgs.code AS org_inn
    , orgs.name AS org_name
    , events.finish_date AS e_finish_date
    , regions.name AS reg_name
    , collaborators.fullname AS col_fio
    , collaborators.mobile_phone AS col_mobile_phone
    , collaborator.data.value('(collaborator/system_email)[1]', 'varchar(max)') AS col_system_email
FROM event_results
LEFT JOIN collaborators
ON collaborators.id = event_results.person_id
LEFT JOIN collaborator
ON collaborator.id = collaborators.id
LEFT JOIN orgs
ON orgs.id = collaborators.org_id
LEFT JOIN regions
ON regions.id = orgs.region_id
LEFT JOIN events
ON events.id = event_results.event_id
WHERE
events.finish_date BETWEEN @date_from AND @date_to
" + param_str + "
" ) );

final_arr = [];

for ( elem in arr ){
    obj = {};
    obj.SetProperty( "PrimaryKey", String( elem.PK ) )
    for( fldElem in elem ){
        obj.SetProperty( fldElem.Name, String( fldElem ) )
    }
    final_arr.push( obj );
};

columns.Clear();

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Дата завершения";
_cc.column_value = "ListElem.e_finish_date";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "ИНН организации";
_cc.column_value = "ListElem.org_inn";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Регион";
_cc.column_value = "ListElem.reg_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Организация";
_cc.column_value = "ListElem.org_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "ФИО";
_cc.column_value = "ListElem.col_fio";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Email";
_cc.column_value = "ListElem.col_system_email";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Телефон";
_cc.column_value = "ListElem.col_mobile_phone";


_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = false;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "ID Результ.";
_cc.column_value = "ListElem.PrimaryKey";

return final_arr