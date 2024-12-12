//7107466891424790180
function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 7107466891424790180});
if (included) {
    /*
    var bIsLog = true // вести логирование выполнения агента
    var sLogMethod = "ext" // метод вывода в лог - ext, system, report, excel // report - teCurObject = tools.open_doc( curObjectID ).TopElem
    var sLogMethodExt = "ext_log" // префикс файла журнала (для sLogMethod = "ext")
    var slogMethodPath = "x-local://Logs/" //директория для сохранения файла на сервер (sLogMethod = "excel")
    var docReport
    var sLogStr = ''
    */
    function add_groups( ind_order_card_id ) {
        doc_ind_order_card = tools.open_doc( ind_order_card_id )
        te_ind_order_card = doc_ind_order_card.TopElem
        for ( stage_num = 1; stage_num <= 9; stage_num++ ) {
            if ( te_ind_order_card.OptChild( "stage_" + stage_num + "_start_date" ) != null && te_ind_order_card.OptChild( "stage_" + stage_num + "_finish_date" ) != null && ArrayCount( te_ind_order_card.OptChild( "stage_" + stage_num + "_documents" ) ) != 0 ) {
                if ( te_ind_order_card.OptChild( "stage_" + stage_num + "_group_id" ) == null ) {
                    // создаем группу доступа
                    group_name = te_ind_order_card.num + "_" + te_ind_order_card.org_id.ForeignElem.code + "_" + stage_num + "_" + StrDate( te_ind_order_card.start_date, false, false )
                    doc_new_group = tools.new_doc_by_name( 'group', false )
                    doc_new_group.BindToDb()
                    te_new_group = doc_new_group.TopElem
                    te_new_group.name = group_name
                    te_new_group.custom_elems.ObtainChildByKey( "ind_order_card_id" ).value = doc_ind_order_card.DocID
                    te_new_group.custom_elems.ObtainChildByKey( "ind_order_card_start_date" ).value = te_ind_order_card.OptChild( "stage_" + stage_num + "_start_date" )
                    te_new_group.custom_elems.ObtainChildByKey( "ind_order_card_finish_date" ).value = te_ind_order_card.OptChild( "stage_" + stage_num + "_finish_date" )
                    doc_new_group.Save()
                    write_log_text( "Создана группа - " + group_name )
                    doc_ids_arr = ArrayExtractKeys( te_ind_order_card.OptChild( "stage_" + stage_num + "_documents" ), "stage_" + stage_num + "_document_id" )
                    for ( doc_id in doc_ids_arr ) {
                        add_access_groups_to_object( doc_id, [doc_new_group.DocID] )
                        add_access_groups_to_attached_objects( doc_id, '', 'all' )
                    }
                    te_ind_order_card.OptChild( "stage_" + stage_num + "_group_id" ).Value = doc_new_group.DocID
                } else {
                    doc_ids_arr = ArrayExtractKeys( te_ind_order_card.OptChild( "stage_" + stage_num + "_documents" ), "stage_" + stage_num + "_document_id" )
                    for ( doc_id in doc_ids_arr ) {
                        add_access_groups_to_object( doc_id, te_ind_order_card.OptChild( "stage_" + stage_num + "_group_id" ).Value )
                        add_access_groups_to_attached_objects( doc_id, '', 'all' )
                    }
                }
            }
        }
        te_ind_order_card.status = "Заказ на исполнении"
        doc_ind_order_card.Save()
    }
    function boss_panel( ind_order_card_id ) {
        doc_ind_order_card = tools.open_doc( ind_order_card_id )
        te_ind_order_card = doc_ind_order_card.TopElem
        for ( boss_panel_org in te_ind_order_card.boss_panel_orgs ) {
            found_card = ArrayOptFirstElem( XQuery( "for $elem in cc_boss_panel_org_courses where org_id=" + boss_panel_org.boss_panel_org_id + " return $elem" ) )
            if ( found_card == undefined ) {
                code_name = te_ind_order_card.num + "_" + tools.get_doc_by_key( "org", "id", boss_panel_org.boss_panel_org_id ).TopElem.code +
                    "_" + StrDate( OptDate( te_ind_order_card.start_date ), false, false )
                doc_new_cc_boss_panel_org_course = tools.new_doc_by_name( 'cc_boss_panel_org_course', false )
                doc_new_cc_boss_panel_org_course.BindToDb()
                te_new_cc_boss_panel_org_course = doc_new_cc_boss_panel_org_course.TopElem
                te_new_cc_boss_panel_org_course.code = code_name
                te_new_cc_boss_panel_org_course.name = te_ind_order_card.num
                te_new_cc_boss_panel_org_course.org_id = boss_panel_org.boss_panel_org_id
                te_new_cc_boss_panel_org_course.start_date = te_ind_order_card.start_date
                te_new_cc_boss_panel_org_course.finish_date = te_ind_order_card.finish_date
                for ( boss_panel_course in te_ind_order_card.boss_panel_courses ) {
                    te_new_cc_boss_panel_org_course.courses.ObtainChildByKey( boss_panel_course.boss_panel_course_id )
                }

                doc_new_group = tools.new_doc_by_name( 'group', false )
                doc_new_group.BindToDb()
                te_new_group = doc_new_group.TopElem
                te_new_group.code = "ВР_" + code_name
                te_new_group.name = "ВР_" + code_name
                for ( boss_panel_col in te_ind_order_card.boss_panel_cols ) {
                    if ( !te_new_group.func_managers.ChildByKeyExists( boss_panel_col.boss_panel_col_id ) ) {
                        teRespCol = tools.open_doc( boss_panel_col.boss_panel_col_id ).TopElem
                        new_func_manager = te_new_group.func_managers.AddChild()
                        new_func_manager.person_id = teRespCol.id
                        new_func_manager.person_fullname = teRespCol.lastname + ' ' + teRespCol.firstname + ' ' + teRespCol.middlename
                        new_func_manager.person_position_id = teRespCol.position_id
                        new_func_manager.person_position_name = teRespCol.position_name
                        new_func_manager.person_position_code = ArrayOptFirstElem( XQuery( 'for $elem in positions where $elem/id = ' + teRespCol.position_id + ' return $elem' ) ) == undefined ? '' : ArrayOptFirstElem( XQuery( 'for $elem in positions where $elem/id = ' + teRespCol.position_id + ' return $elem' ) ).code
                        new_func_manager.person_org_id = teRespCol.org_id
                        new_func_manager.person_org_name = teRespCol.org_name
                        new_func_manager.person_org_code = ArrayOptFirstElem( XQuery( 'for $elem in orgs where $elem/id = ' + teRespCol.org_id + ' return $elem' ) ) == undefined ? '' : ArrayOptFirstElem( XQuery( 'for $elem in orgs where $elem/id = ' + teRespCol.org_id + ' return $elem' ) ).code
                        new_func_manager.person_subdivision_id = teRespCol.position_parent_id
                        new_func_manager.person_subdivision_name = teRespCol.position_parent_name
                        new_func_manager.person_code = teRespCol.code
                        new_func_manager.is_native = '1'
                        new_func_manager.boss_type_id = 7158147030098137646 // Для индивидуального заказа
                    }
                }
                doc_new_group.Save()

                te_new_cc_boss_panel_org_course.group_id = doc_new_group.DocID
                doc_new_cc_boss_panel_org_course.Save()

                doc_org = tools.open_doc( boss_panel_org.boss_panel_org_id )
                te_org = doc_org.TopElem
                for ( boss_panel_col in te_ind_order_card.boss_panel_cols ) {
                    if ( !te_org.func_managers.ChildByKeyExists( boss_panel_col.boss_panel_col_id ) ) {
                        teRespCol = tools.open_doc( boss_panel_col.boss_panel_col_id ).TopElem
                        new_func_manager = te_org.func_managers.AddChild()
                        new_func_manager.person_id = teRespCol.id
                        new_func_manager.person_fullname = teRespCol.lastname + ' ' + teRespCol.firstname + ' ' + teRespCol.middlename
                        new_func_manager.person_position_id = teRespCol.position_id
                        new_func_manager.person_position_name = teRespCol.position_name
                        new_func_manager.person_position_code = ArrayOptFirstElem( XQuery( 'for $elem in positions where $elem/id = ' + teRespCol.position_id + ' return $elem' ) ) == undefined ? '' : ArrayOptFirstElem( XQuery( 'for $elem in positions where $elem/id = ' + teRespCol.position_id + ' return $elem' ) ).code
                        new_func_manager.person_org_id = teRespCol.org_id
                        new_func_manager.person_org_name = teRespCol.org_name
                        new_func_manager.person_org_code = ArrayOptFirstElem( XQuery( 'for $elem in orgs where $elem/id = ' + teRespCol.org_id + ' return $elem' ) ) == undefined ? '' : ArrayOptFirstElem( XQuery( 'for $elem in orgs where $elem/id = ' + teRespCol.org_id + ' return $elem' ) ).code
                        new_func_manager.person_subdivision_id = teRespCol.position_parent_id
                        new_func_manager.person_subdivision_name = teRespCol.position_parent_name
                        new_func_manager.person_code = teRespCol.code
                        new_func_manager.is_native = '1'
                        new_func_manager.boss_type_id = 7158147030098137646 // Для индивидуального заказа
                    }
                }
                doc_org.Save()
            }
        }
        //te_ind_order_card.status = "Заказ на исполнении"
        doc_ind_order_card.Save()
    }

    if ( !LdsIsServer ) {
        sLogMethod = "report"
        curObjectID = 7107466891424790180
        teCurObject = tools.open_doc( curObjectID ).TopElem
        try{
            open_log()
            var bDebugMode = false
            write_log_text( "bDebugMode = " + bDebugMode )
            if ( !bDebugMode ) {
                param_str = OBJECTS_ID_STR == '' ? '' : "and contains( '" + OBJECTS_ID_STR + "', $elem/id )"
                ind_order_cards_arr = ArraySelectAll( XQuery( "for $elem in cc_ind_order_cards where ($elem/status='' or $elem/status='Заказ на исполнении') " + param_str + " return $elem" ) )
                write_log_text( "Найдено " + ArrayCount( ind_order_cards_arr ) + " карточек инд заказа без статуса" )
                for ( ind_order_card in ind_order_cards_arr ) {
                    add_groups( ind_order_card.id )
                    boss_panel( ind_order_card.id )
                }
            } else {
                param_str = OBJECTS_ID_STR == '' ? '' : "and contains( '" + OBJECTS_ID_STR + "', $elem/id )"
                ind_order_cards_arr = ArraySelectAll( XQuery( "for $elem in cc_ind_order_cards where ($elem/status='' or $elem/status='Заказ на исполнении') " + param_str + " return $elem" ) )
                write_log_text( "Найдено " + ArrayCount( ind_order_cards_arr ) + " карточек инд заказа без статуса" )
                for ( ind_order_card in ind_order_cards_arr ) {
                    boss_panel( ind_order_card.id )
                }
            }
            close_log()
        } catch( e ) {
            write_log_text( "error = " + e )
            close_log()
        }
    }
}