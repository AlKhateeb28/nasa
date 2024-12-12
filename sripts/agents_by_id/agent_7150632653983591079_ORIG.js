function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 7150632653983591079});
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
        curObjectID = 7150632653983591079
        teCurObject = tools.open_doc( curObjectID ).TopElem

        try {
            open_log()
            var bDebugMode = false
            if ( !bDebugMode ) {
                write_log_text( "bDebugMode = " + bDebugMode )

                var folder = 'E:/Websoft/Reports/report_orgs/'
                var f_name = 'report_orgs_' + ParseDate( Date() ) + '.xlsx'
                var f_url = folder + f_name
                var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document")
                var report_string = new Binary()

                arr = ArrayDirect( XQuery( "sql:
                SELECT
                CONCAT ( '''', orgs.id ) AS PK
                    , CONCAT ( '''', orgs.code ) AS o_inn
                    , orgs.name AS o_name
                    , regions.code AS reg_code
                    , regions.name AS reg_name
                    , ( SELECT regions.name FROM regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name
                    , ( SELECT regions.name FROM regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'varchar(max)') ) AS report_region_name
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''in_program''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS in_program
                    , org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_rck
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_roiv
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_partner
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_commercial''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_commercial
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_extended_support''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_extended_support
                    , CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_past_member''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                ELSE '-'
                END AS is_past_member
                    , org.data.value('(org/custom_elems/custom_elem[name=''industry''])[1]/value[1]', 'varchar(max)') AS industry
                    , org.data.value('(org/custom_elems/custom_elem[name=''org_address''])[1]/value[1]', 'varchar(max)') AS org_address
                    , org.data.value('(org/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS guid
                    , org.created AS o_created_date
                    , orgs.modification_date AS o_modification_date
                    , ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.web_banned = 1 ) AS count_muc_cols
                    , ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.web_banned = 0 ) AS count_not_muc_cols
                    , (
                    SELECT COUNT (*)
                FROM group_collaborators
                LEFT JOIN collaborators ON collaborators.id = group_collaborators.collaborator_id
                WHERE collaborators.org_id = orgs.id
                AND collaborators.web_banned = 0
                AND group_collaborators.group_id = 6638815798247752808
            ) AS count_treners_by_group
                --, ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.code LIKE '%muc%' ) AS count_muc_cols
                --, ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.code NOT LIKE '%muc%' ) AS count_not_muc_cols
                FROM orgs
                LEFT JOIN org
                ON org.id = orgs.id
                LEFT JOIN regions
                ON regions.id = orgs.region_id
                --where orgs.id = 6633385604985605782
                " ) )

                report_string.AppendStr( '<html><table>' )

                report_string.AppendStr( '<tr>' )

                report_string.AppendStr( '<td>ID</td><td>ИНН/код</td><td>Официальное название</td><td>Код региона</td><td>Регион по справочнику</td><td>Фактический регион</td><td>Учитывать в отчетности региона</td><td>В программе?</td><td>Тип поддержки</td><td>РЦК?</td><td>РОИВ?</td><td>Партнер?</td><td>Коммерция?</td><td>Расширенная поддрежка?</td><td>Когда-то был участником</td><td>Вид деятельности по ОКВЭД</td><td>Адрес организации</td><td>guid</td><td>Дата создания</td><td>Дата модификации</td><td>Кол-во ФЛ</td><td>Кол-во пользователей</td><td>Кол-во вн. тренеров</td>' )
                /*
                        for ( elem in ArrayOptFirstElem( arr ) ) {
                            report_string.AppendStr( '<td>' )
                            report_string.AppendStr( elem.Name )
                            report_string.AppendStr( '</td>' )
                        }
                */
                report_string.AppendStr( '</tr>' )

                for ( elem in arr ) {
                    report_string.AppendStr( '<tr>' )
                    for ( el in elem ) {
                        report_string.AppendStr( '<td>' )
                        report_string.AppendStr( el.Value )
                        report_string.AppendStr( '</td>' )
                    }
                    report_string.AppendStr( '</tr>' )
                }

                report_string.AppendStr( '</table></html>' )

                oExcelDoc.LoadHtmlString( report_string.GetStr(), "" )

                oExcelDoc.SaveAs( f_url )
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