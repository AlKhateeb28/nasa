function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 6901298909405270647});
if (included) {
    /*
    var bIsLog = true // вести логирование выполнения агента
    var sLogMethod = "ext" // метод вывода в лог - ext, system, report, excel // report - teCurObject = tools.open_doc( curObjectID ).TopElem
    var sLogMethodExt = "ext_log" // префикс файла журнала (для sLogMethod = "ext")
    var slogMethodPath = "x-local://Logs/" //директория для сохранения файла на сервер (sLogMethod = "excel")
    var docReport
    var sLogStr = ''
    */
    if ( LdsIsServer ) {
        sLogMethod = "report"
        curObjectID = 6901298909405270647
        teCurObject = tools.open_doc( curObjectID ).TopElem
        try{
            open_log()
            var bDebugMode = false
            if ( !bDebugMode ) {
                write_log_text( "bDebugMode = " + bDebugMode )

                group_id = Param.group_id
                group_doc = tools.open_doc( group_id )
                arr = ArraySelectAll( XQuery( "sql:
                DECLARE @curdate datetime
                SET @curdate = GETDATE()
                SELECT
                collaborators.id, collaborator.created
                FROM collaborators
                LEFT JOIN orgs
                ON collaborators.org_id = orgs.id
                LEFT JOIN org
                ON collaborators.org_id = org.id
                LEFT JOIN collaborator
                ON collaborators.id = collaborator.id
                WHERE
                (
                    org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true'
                OR org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true'
                OR org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true'
                OR org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') != ''
                OR orgs.code = '7724426759'
            )
                AND collaborators.code NOT LIKE('%_muc_%')
                AND collaborators.is_dismiss = 0
                AND collaborators.org_id != 6652254925512774352
                AND collaborators.org_id != 6699322438141639615
                AND collaborator.created > DATEADD(day,-2, @curdate)
                ORDER BY collaborator.created DESC
                " ) )

                // group_doc.TopElem.collaborators.Clear()
                i = 0
                for ( elem in arr ) {
                    if ( group_doc.TopElem.collaborators.GetOptChildByKey( elem.id ) == undefined ) {
                        group_doc.TopElem.collaborators.ObtainChildByKey( elem.id )
                        i++
                    }
                }

                group_doc.Save()
                write_log_text( "Группа - " + group_doc.TopElem.name )
                write_log_text( "Добавлено - " + i + " сотрудников" )
                newarr = XQuery( "for $elem in group_collaborators where group_id=" + group_id + " return $elem" )
                write_log_text( "Общее количество - " + ArrayCount( newarr ) + " сотрудников" )
            } else {
                write_log_text( "bDebugMode = " + bDebugMode )
            }
            close_log()
        } catch( e ) {
            write_log_text( "error = " + e )
            close_log()
        }
    }
}