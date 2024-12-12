function find_e_m_names ( _col_id, _edu_meths_str ) {
    sql_str = "sql:
    SELECT
    education_methods.name AS e_m_name
    FROM event_results
    LEFT JOIN events
    ON events.id = event_results.event_id
    LEFT JOIN education_methods
    ON education_methods.id = events.education_method_id
    WHERE events.type_id = 'education_method'
    AND events.education_method_id IN (" + _edu_meths_str + ")
    AND event_results.person_id = " + _col_id + "
    AND event_results.is_assist = 1
    AND events.status_id = 'close'
    "
    col_event_results_arr = ArraySelectAll( XQuery( sql_str ) )
    unique_e_m_names_arr = ArraySelectDistinct( col_event_results_arr, "This.e_m_name" )
    return unique_e_m_names_str = ArrayMerge( unique_e_m_names_arr, "This.e_m_name", ", " )
}

if ( LdsIsClient ) {
    var certificate_type_id = 7069723285559858963
    var org_id = Param.org_id
    var group_id = Param.group_id
    var edu_meths_arr = tools.read_object( Param.edu_meths )
    var edu_meths_str = ArrayMerge( edu_meths_arr, "This.edu_meth", "," )
    switch ( Param.work_type ) {
        case 'org':
            my_id = OBJECT_ID == null ? org_id : OBJECT_ID
            org_cols_arr = ArraySelectAll( XQuery( "for $elem in collaborators where $elem/org_id='" + my_id + "' and contains($elem/code, 'load_muc') return $elem" ) )
            for ( org_col in org_cols_arr ) {
                xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + org_col.id + " return $elem"
                found_col_certificate = ArrayOptFirstElem( XQuery( xq_str ) )
                if ( found_col_certificate == undefined ) {
                    unique_e_m_names_str = find_e_m_names( org_col.id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.create_certificate_to_person( org_col.id, certificate_type_id )
                        docCertificate.TopElem.serial = "РК"
                        docCertificate.TopElem.delivery_date = Date()
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str
                        docCertificate.Save()
                    }
                } else {
                    unique_e_m_names_str = find_e_m_names( org_col.id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.open_doc( found_col_certificate.id )
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str
                        docCertificate.Save()
                    }
                }
            }
            break
        case 'group':
            my_id = OBJECT_ID == null ? group_id : OBJECT_ID
            group_cols_arr = ArraySelectAll( XQuery( "sql:
            SELECT
            group_collaborators.collaborator_id AS col_id
            FROM group_collaborators
            LEFT JOIN collaborators
            ON group_collaborators.collaborator_id = collaborators.id
            WHERE group_collaborators.group_id = '" + my_id + "'
            AND collaborators.code LIKE '%load_muc%'
            " ) )
            for ( group_col in group_cols_arr ) {
                xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + group_col.col_id + " return $elem"
                found_col_certificate = ArrayOptFirstElem( XQuery( xq_str ) )
                if ( found_col_certificate == undefined ) {
                    unique_e_m_names_str = find_e_m_names( group_col.col_id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.create_certificate_to_person( group_col.col_id, certificate_type_id )
                        docCertificate.TopElem.serial = "РК"
                        docCertificate.TopElem.delivery_date = Date()
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str
                        docCertificate.Save()
                    }
                } else {
                    unique_e_m_names_str = find_e_m_names( group_col.col_id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.open_doc( found_col_certificate.id )
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str
                        docCertificate.Save()
                    }
                }
            }
            break
    }
}