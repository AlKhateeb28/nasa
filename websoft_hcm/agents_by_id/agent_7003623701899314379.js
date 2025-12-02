// 7003623701899314379
function getUniqueNames ( _col_id, _edu_meths_str ) {
    sql_str = "sql: " +
    " SELECT education_methods.name AS e_m_name " +
    " FROM [WTDB].[dbo].event_results " +
    "       LEFT JOIN [WTDB].[dbo].events ON events.id = event_results.event_id " +
    "       LEFT JOIN [WTDB].[dbo].education_methods ON education_methods.id = events.education_method_id " +
    " WHERE events.type_id = 'education_method' " +
    " AND events.education_method_id IN (" + _edu_meths_str + ")" +
    " AND event_results.person_id = " + _col_id +
    " AND event_results.is_assist = 1 " +
    " AND events.status_id = 'close'";

    eventResultList = ArraySelectAll( XQuery( sql_str ) )

    uniqueNames = ArraySelectDistinct( eventResultList, "This.e_m_name" )

    return ArrayMerge( uniqueNames, "This.e_m_name", ", " )
    //return unique_e_m_names_str = ArrayMerge( uniqueNames, "This.e_m_name", ", " )
}

if ( LdsIsClient ) {
    var certificate_type_id = 7003613659490893183
    var org_id = Param.org_id
    var group_id = Param.group_id
    var edu_meths_arr = tools.read_object( Param.edu_meths )
    var edu_meths_str = ArrayMerge( edu_meths_arr, "This.edu_meth", "," )
    var educationOrgId = Param.edu_org_id;

    switch ( Param.work_type ) {
        case 'org':
            my_id = OBJECT_ID == null ? org_id : OBJECT_ID


            org_cols_arr = ArraySelectAll( XQuery( "for $elem in collaborators where $elem/org_id='" + my_id + "' and contains($elem/code, 'load_muc') return $elem" ) )
            for ( org_col in org_cols_arr ) {
                xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + org_col.id + " return $elem"
                found_col_certificate = ArrayOptFirstElem( XQuery( xq_str ) )
                if ( found_col_certificate == undefined ) {
                    unique_e_m_names_str = getUniqueNames( org_col.id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.create_certificate_to_person( org_col.id, certificate_type_id )
                        docCertificate.TopElem.serial = "РГ"
                        docCertificate.TopElem.delivery_date = Date()
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str

                        if(educationOrgId != '') {
                            docCertificate.TopElem.education_org_id = educationOrgId;
                        }

                        docCertificate.Save();
                    }
                } else {
                    unique_e_m_names_str = getUniqueNames( org_col.id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.open_doc( found_col_certificate.id )
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str

                        if(educationOrgId != '') {
                            docCertificate.TopElem.education_org_id = educationOrgId;
                        }

                        docCertificate.Save();
                    }
                }
            }

            if (my_id != null)
            {
                sql_org = "for $el in orgs where id = '" + my_id + "' return $el";
                org_arr= ArrayOptFirstElem( XQuery(sql_org));
                x_o = org_arr[0];
                //alert(x_o);
                x = 0;
                org_x = tools.open_doc(Int(x_o)).TopElem;
                //	alert(org_x.disp_name);
                func_manager_s = org_x.func_managers;
                for (func in func_manager_s)
                {
                    //	alert(func.person_fullname);
                    //	alert(func.person_id.ForeignElem.email);
                    if ((org_x.code == func.person_org_code) && (func.boss_type_id == 2691248884100914019))
                    {
                        tools.create_notification(26101, func.person_id);
                    }
                    //	alert(x++);
                    //if (x >=3) {break};
                }
            }

            break
        case 'group':
            my_id = OBJECT_ID == null ? group_id : OBJECT_ID
            group_cols_arr = ArraySelectAll( XQuery( "sql: " +
            " SELECT group_collaborators.collaborator_id AS col_id " +
            " FROM group_collaborators " +
            "       LEFT JOIN collaborators ON group_collaborators.collaborator_id = collaborators.id " +
            " WHERE group_collaborators.group_id = '" + my_id + "'" +
            "       AND collaborators.code LIKE '%load_muc%' "));

            for ( group_col in group_cols_arr ) {
                xq_str = "for $elem in certificates where $elem/type_id=" + certificate_type_id + " and $elem/person_id=" + group_col.col_id + " return $elem"
                found_col_certificate = ArrayOptFirstElem( XQuery( xq_str ) )
                if ( found_col_certificate == undefined ) {
                    unique_e_m_names_str = getUniqueNames( group_col.col_id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.create_certificate_to_person( group_col.col_id, certificate_type_id )
                        docCertificate.TopElem.serial = "РГ"
                        docCertificate.TopElem.delivery_date = Date()
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str

                        if(educationOrgId != '') {
                            docCertificate.TopElem.education_org_id = educationOrgId;
                        }

                        docCertificate.Save();
                    }
                } else {
                    unique_e_m_names_str = getUniqueNames( group_col.col_id, edu_meths_str )
                    if ( unique_e_m_names_str != "" ) {
                        docCertificate = tools.open_doc( found_col_certificate.id )
                        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = unique_e_m_names_str

                        if(educationOrgId != '') {
                            docCertificate.TopElem.education_org_id = educationOrgId;
                        }

                        docCertificate.Save();
                    }
                }
            }
            break
    }
}