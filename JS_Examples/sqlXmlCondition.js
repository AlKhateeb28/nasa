sql_str = "
SELECT
DISTINCT collaborator.id
FROM collaborators
LEFT JOIN collaborator
ON collaborator.id = collaborators.id
WHERE collaborators.code LIKE '%load_muc%'
AND collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid_status''])[1]/value[1]', 'varchar(max)') IS NULL
AND collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') IS NULL
"
arr = ArraySelectAll( XQuery( "sql: " + sql_str ) )
//alert( ArrayCount( arr ) )
num = 1

for ( el in arr ) {
    try {
        col_id = el.id
        col_doc = tools.open_doc( col_id )
        col_doc.TopElem.custom_elems.ObtainChildByKey( "guid_status" ).value = "Надо получить"
        col_doc.Save()

    } catch( err ) { continue }
}