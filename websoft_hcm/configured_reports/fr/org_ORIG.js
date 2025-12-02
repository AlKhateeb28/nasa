arr = ArraySelectAll( XQuery( "sql:
SELECT
orgs.id AS PK
    , collaborators.id AS col_id
    , collaborators.code AS col_code
    , collaborators.fullname AS col_fio
    , collaborators.email AS col_email
    , boss_types.name AS col_boss_type
    , orgs.name AS o_name
    , CONCAT( '''', orgs.code ) AS o_inn
    , org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') AS org_is_rck
    , org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS org_format_part
    , regions.name AS region_name
    , regions.code AS region_code
    , collaborators.is_dismiss AS col_is_dismiss
FROM func_managers
LEFT JOIN collaborators
ON collaborators.id = func_managers.person_id
LEFT JOIN boss_types
ON boss_types.id = func_managers.boss_type_id
LEFT JOIN orgs
ON orgs.id = func_managers.org_id
LEFT JOIN org
ON org.id = orgs.id
LEFT JOIN regions
ON regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') --orgs.region_id
WHERE func_managers.catalog = 'org'
" ) )

final_arr = []

for ( elem in arr ){
    try{
        te_fm_org =  tools.open_doc( ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id=" + elem.col_id + " return $elem" ) ).org_id ).TopElem
        obj = {}
        obj.SetProperty( "PrimaryKey", String( elem.PK ) )
        obj.SetProperty( "fm_org_name", String( te_fm_org.name ) )
        obj.SetProperty( "fm_org_is_rck", String( te_fm_org.custom_elems.ObtainChildByKey( "is_rck" ).value ) )
        obj.SetProperty( "fm_org_region", String( te_fm_org.region_id.ForeignElem.name ) )
        for( fldElem in elem ){
            obj.SetProperty( fldElem.Name, String( fldElem ) )
        }
        final_arr.push( obj )
    } catch(e){
        continue
    }
}

_cc = columns.Clear()

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = false
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "ID result"
_cc.column_value = "ListElem.PrimaryKey"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "Код"
_cc.column_value = "ListElem.col_code"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "ФИО"
_cc.column_value = "ListElem.col_fio"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Email"
_cc.column_value = "ListElem.col_email"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Организация фр"
_cc.column_value = "ListElem.fm_org_name"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Организация фр РЦК?"
_cc.column_value = "ListElem.fm_org_is_rck"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Организация фр регион"
_cc.column_value = "ListElem.fm_org_region"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Тип"
_cc.column_value = "ListElem.col_boss_type"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "20"
_cc.column_title = "Организация"
_cc.column_value = "ListElem.o_name"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "ИНН"
_cc.column_value = "ListElem.o_inn"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "РЦК?"
_cc.column_value = "ListElem.org_is_rck"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "Тип поддержки"
_cc.column_value = "ListElem.org_format_part"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "Регион"
_cc.column_value = "ListElem.region_name"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "Код региона"
_cc.column_value = "ListElem.region_code"

_cc = columns.AddChild()
_cc.flag_formula = true
_cc.flag_visible = true
_cc.datatype = "string"
_cc.column_width = "10"
_cc.column_title = "Уволен"
_cc.column_value = "ListElem.col_is_dismiss"

return final_arr