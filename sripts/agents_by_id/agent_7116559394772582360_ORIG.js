// 7116559394772582360
function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 7116559394772582360});
if (included) {
    /*
    var bIsLog = true // вести логирование выполнения агента
    var sLogMethod = "ext" // метод вывода в лог - ext, system, report, excel // report - teCurObject = tools.open_doc( curObjectID ).TopElem
    var sLogMethodExt = "ext_log" // префикс файла журнала (для sLogMethod = "ext")
    var slogMethodPath = "x-local://Logs/" //директория для сохранения файла на сервер (sLogMethod = "excel")
    var docReport
    var sLogStr = ''
    */

    if ( !LdsIsServer ) {
        sLogMethod = "report"
        curObjectID = 7116559394772582360
        teCurObject = tools.open_doc( curObjectID ).TopElem
        try{
            open_log()
            var bDebugMode = true
            write_log_text( "bDebugMode = " + bDebugMode )
            if ( !bDebugMode ) {
                alert(1)
            } else {
                curDate = Date()
                param_str = OBJECTS_ID_STR == '' ? '' : "and contains( '" + OBJECTS_ID_STR + "', $elem/id )"
                ind_order_cards_arr = ArraySelectAll( XQuery( "for $elem in cc_ind_order_cards where $elem/status='Заказ на исполнении' and finish_date <= date() "
                    + param_str + " return $elem" ) )
                write_log_text( "Найдено " + ArrayCount( ind_order_cards_arr ) + " карточек инд заказа со статусом Заказ на исполнении" )
                for ( ind_order_card in ind_order_cards_arr ) {
                    doc_ind_order_card = tools.open_doc( ind_order_card.id )
                    te_ind_order_card = doc_ind_order_card.TopElem
                    for ( stage_num = 1; stage_num <= 9; stage_num++ ) {
                        doc_ids_arr = ArrayExtractKeys( te_ind_order_card.OptChild( "stage_" + stage_num + "_documents" ), "stage_" + stage_num + "_document_id" )
                        for ( doc_id in doc_ids_arr ) {
                            del_access_groups_from_object( doc_id, [te_ind_order_card.OptChild( "stage_" + stage_num + "_group_id" ).Value] )
                            del_access_groups_from_attached_objects( doc_id, '', 'all', [te_ind_order_card.OptChild( "stage_" + stage_num + "_group_id" ).Value] )
                        }
                    }
                    te_ind_order_card.status = "Заказ исполнен"
                    doc_ind_order_card.Save()
                }
            }
            close_log()
        } catch( e ) {
            write_log_text( "error = " + e )
            close_log()
        }
    }
}