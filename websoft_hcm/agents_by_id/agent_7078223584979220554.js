// 7078223584979220554
function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 7078223584979220554});
if (included) {
    /*
    var bIsLog = true // вести логирование выполнения агента
    var sLogMethod = "ext" // метод вывода в лог - ext, system, report, excel // report - teCurObject = tools.open_doc( curObjectID ).TopElem
    var sLogMethodExt = "ext_log" // префикс файла журнала (для sLogMethod = "ext")
    var slogMethodPath = "x-local://Logs/" //директория для сохранения файла на сервер (sLogMethod = "excel")
    var docReport
    var sLogStr = ''
    */
    sLogMethod = "report"
    curObjectID = 7078223584979220554
    teCurObject = tools.open_doc( curObjectID ).TopElem

    if( !LdsIsServer ) {
        open_log()

        var org_id = Param.org_id
        var boss_type_id = Param.boss_type_id
        var group_id = Param.group_id
        var group_id_2 = Param.group_id_2
        var what_to_do = Param.what_to_do
        var col_ids_arr = ArrayExtractKeys( tools.read_object( Param.col_ids ), "col_id" )

        org_format_part = ce_value( "org", "format_part", "id", org_id )
        if( org_format_part == "" ) {
            alert( "Не участник проекта" )
        } else {
            add_to_group_arr = []
            del_from_group_arr = []
            org_doc = tools.open_doc( org_id )
            org_doc_te = org_doc.TopElem
            for( col_id in col_ids_arr ) {
                found_collaborator = ArrayOptFirstElem( XQuery( "sql:
                SELECT
                collaborators.id AS col_id,
                    collaborators.code AS col_code,
                    collaborators.fullname AS col_fullname,
                    positions.id AS pos_id,
                    positions.name AS pos_name,
                    positions.code AS pos_code,
                    orgs.id AS o_id,
                    orgs.name AS o_name,
                    orgs.code AS o_code
                FROM collaborators
                LEFT JOIN positions
                ON collaborators.position_id = positions.id
                LEFT JOIN orgs
                ON collaborators.org_id = orgs.id
                WHERE collaborators.id = '" + col_id + "'
                ") )
                if( found_collaborator != undefined ) {
                    if ( what_to_do == 'add' ) {
                        found_fm_another_boss_type = ArrayOptFirstElem( XQuery( "for $elem in func_managers where $elem/catalog = 'org'" +
                            " and $elem/person_id=" + col_id + " and $elem/object_id=" + org_id + " and $elem/boss_type_id!=" + boss_type_id + " return $elem" ) )
                        if ( found_fm_another_boss_type == undefined ) {
                            fm = org_doc_te.func_managers.ObtainChildByKey( found_collaborator.col_id, 'person_id' )
                            fm.person_fullname = found_collaborator.col_fullname
                            fm.person_position_id = found_collaborator.pos_id
                            fm.person_position_name = found_collaborator.pos_name
                            fm.person_position_code = found_collaborator.pos_code
                            fm.person_org_id = found_collaborator.o_id
                            fm.person_org_name = found_collaborator.o_name
                            fm.person_org_code = found_collaborator.o_code
                            fm.person_code = found_collaborator.col_code
                            fm.is_native = '0'
                            fm.boss_type_id = boss_type_id

                            col_doc = tools.open_doc( col_id )
                            col_doc.TopElem.custom_elems.ObtainChildByKey( "date_boss_panel" ).value = Date()
                            if( col_doc.TopElem.access.access_role == "user" ) { //organizer - Для панели руководителя, user - Integration
                                col_doc.TopElem.access.access_role = "organizer"
                            }
                            col_doc.Save()
                            add_to_group_arr.push( col_id )
                        } else {
                            write_log_text( col_id + " - ФР отличается от менеджер по персоналу" )
                        }
                    } else if ( what_to_do == 'del' ) {
                        found_fm_another_boss_type = ArrayOptFirstElem( XQuery( "for $elem in func_managers where $elem/catalog = 'org'" +
                            " and $elem/person_id=" + col_id + " and $elem/object_id=" + org_id + " and $elem/boss_type_id=" + boss_type_id + " return $elem" ) )
                        if ( found_fm_another_boss_type != undefined ) {
                            org_doc_te.func_managers.DeleteChildByKey( found_collaborator.col_id )

                            col_doc = tools.open_doc( col_id )
                            col_doc.TopElem.custom_elems.ObtainChildByKey( "date_boss_panel" ).value.Clear()
                            col_doc.Save()

                            del_from_group_arr.push( col_id )
                        }
                    }
                }
            }
            org_doc.Save()
            if ( what_to_do == 'add' ) {
                add_cols_to_groups( [group_id, group_id_2], add_to_group_arr )
            } else if ( what_to_do == 'del' ) {
                del_cols_from_groups( [group_id, group_id_2], del_from_group_arr )
            }
        }
        close_log()
    }

}