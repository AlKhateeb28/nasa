try {
    boss_type_id = 6878899960667451125 // RCK_Collaborator Сотрудник РЦК
    access_role = "OrganizingTrainerRCK" // Тренер-организатор РЦК

    group_collaborators_arr = XQuery( "sql:
    SELECT
    group_collaborators.collaborator_id AS col_id
    FROM group_collaborators
    LEFT JOIN collaborators
    ON collaborators.id = group_collaborators.collaborator_id
    LEFT JOIN org
    ON collaborators.org_id = org.id
    WHERE
    group_collaborators.group_id = " + Param.group_id + "
    AND org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true'
    " )
    for ( group_collaborator in group_collaborators_arr ) {
        col_doc = tools.open_doc( group_collaborator.col_id )
        col_doc_te = col_doc.TopElem
        col_doc_te.access.access_role = access_role
        col_doc.Save()
        /*
                try{
                    reg_code = col_doc_te.org_id.ForeignElem.region_id.ForeignElem.code
                }catch(e){
                    try{
                        reg_code = col_doc_te.org_id.ForeignElem.custom_elems.ObtainChildByKey( "region_code" ).value
                    }catch(er){
                        reg_code = col_doc_te.custom_elems.ObtainChildByKey( "region_code" ).value
                    }
                }
        */
        try{
            fact_reg_id = tools.open_doc( col_doc_te.org_id ).TopElem.custom_elems.ObtainChildByKey( "fact_region_id" ).value
        }catch(e){ fact_reg_id = undefined }
        if ( fact_reg_id != undefined ) {
            orgs_arr = ArraySelectAll( XQuery( "sql:
            SELECT
            orgs.*
            FROM orgs
            LEFT JOIN org
            ON org.id = orgs.id
            WHERE
            org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') = " + fact_reg_id + "
            AND org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'rcc'
            " ) )
            //alert( ArrayCount( orgs_arr ) )

            for ( org in orgs_arr ) {

                try{
                    org_doc = tools.open_doc( org.id )
                    org_doc_te = org_doc.TopElem
                    if ( org_doc_te.func_managers.GetOptChildByKey( group_collaborator.col_id ) == undefined ) {
                        fm = org_doc_te.func_managers.ObtainChildByKey( group_collaborator.col_id, 'person_id' )
                        fm.person_fullname = col_doc_te.fullname
                        fm.person_position_id = col_doc_te.position_id
                        fm.person_position_name = col_doc_te.position_name
                        fm.person_position_code = col_doc_te.position_id.ForeignElem.code
                        fm.person_org_id = col_doc_te.org_id
                        fm.person_org_name = col_doc_te.org_name
                        fm.person_org_code = col_doc_te.org_id.ForeignElem.code
                        fm.person_code = col_doc_te.code
                        fm.is_native = '0'
                        fm.boss_type_id = boss_type_id
                        org_doc.Save()
                    }
                } catch( err ) { continue }

            }
        }
        /*
        col_org_fms_not_rcc_arr = ArraySelectAll( XQuery( "sql:
            SELECT
                func_managers.*
            FROM func_managers
            INNER JOIN orgs
                ON orgs.id = func_managers.object_id
            INNER JOIN org
                ON org.id = orgs.id
            WHERE
                func_managers.person_id = " + group_collaborator.col_id + "
                AND (
                    org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') != 'rcc'
                    OR org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') IS NULL
                )
        " ) )
        //alert( ArrayCount( col_org_fms_not_rcc_arr ) )
        for ( col_org_fm in col_org_fms_not_rcc_arr) {
            //alert( col_org_fm.object_id )

            try{
                org_doc = tools.open_doc( col_org_fm.object_id )
                org_doc_te = org_doc.TopElem
                if ( org_doc_te.func_managers.GetOptChildByKey( col_org_fm.person_id ) != undefined ) {
                    org_doc_te.func_managers.DeleteChildByKey( col_org_fm.person_id )
                    org_doc.Save()
                }
            } catch( err ) { continue }

        }
        */
    }
} catch( err ) {
    alert( err )
}