function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 6943152983065516220});
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
        curObjectID = 6943152983065516220
        teCurObject = tools.open_doc( curObjectID ).TopElem
        try{
            open_log()
            var bDebugMode = false
            if ( !bDebugMode ) {
                write_log_text( "bDebugMode = " + bDebugMode )

                var date_from = Param.date_from == '' ? '01.01.2010 00:00:00' : Param.date_from
                var date_to = Param.date_to == '' ? ParseDate( Date() ) + ' 23:59:59' : Param.date_to
                var with_muc = Param.with_muc
                var folder = 'E:/Websoft/Reports/report_collaborators/'
                var f_name = 'report_collaborators_' + ParseDate( Date() ) + '.xlsx'
                var f_url = folder + f_name
                var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document")
                var report_string = new Binary()

                param_str = ( with_muc == '0' ) ? " AND collaborators.code NOT LIKE '%_muc%' " : ""
                arr = ArraySelectAll( XQuery( "sql:
                SET DATEFORMAT dmy;
                DECLARE @date_from datetime = '" + date_from + "';
                DECLARE @date_to datetime = '" + date_to + "';
                WITH withtable1 AS (
                    SELECT
                CONVERT(xml,(data )) as xml_data
                FROM [(spxml_blobs)]
                WHERE
                url like '%access_roles%'
            )
                SELECT
                T.Loc.value('(id)[1]', 'varchar(max)') AS ar_id,
                    T.Loc.value('(name)[1]', 'varchar(max)') AS ar_name
                INTO #TempTable1
                FROM withtable1 AS wt1
                CROSS APPLY
                wt1.xml_data.nodes('./access_roles/access_role') AS T(Loc);

                SELECT CONCAT( '''', collaborators.id ) AS PK
                    , collaborators.code AS col_code
                    , collaborators.fullname AS col_fullname
                    , collaborators.login AS col_login
                    , collaborators.email AS col_email
                    , collaborator.data.value('(collaborator/system_email)[1]', 'varchar(max)') AS col_system_email
                    , collaborators.position_name AS position_name
                    , orgs.name AS o_name
                    , CONCAT( '''', orgs.code ) AS o_inn
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
                    , org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part
                    , org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') AS fact_region_id
                    ,CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_past_member''])[1]/value[1]', 'varchar(max)') = 'true' THEN 'Да'
                ELSE 'Нет'
                END AS is_past_member
                    ,CASE
                WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') = 'true' THEN 'Да'
                ELSE 'Нет'
                END AS is_project_ended,
                    collaborator.created AS col_created,
                    collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS guid,
                    collaborator.data.value('(collaborator/doc_info/creation/user_login)[1]', 'varchar(max)') AS col_created_by,
                    collaborators.modification_date AS col_modificated,
                    regions.code AS region_code,
                    regions.name AS region_name,
                    #TempTable1.ar_id AS ar_id,
                    #TempTable1.ar_name AS ar_name,
                    collaborators.is_dismiss
                FROM collaborators
                LEFT JOIN collaborator
                ON collaborator.id = collaborators.id
                LEFT JOIN orgs
                ON orgs.id = collaborators.org_id
                LEFT JOIN org
                ON org.id = orgs.id
                LEFT JOIN regions
                ON regions.id = orgs.region_id
                LEFT JOIN #TempTable1
                ON #TempTable1.ar_id = collaborators.role_id
                WHERE
                collaborator.created BETWEEN @date_from AND @date_to
                " + param_str + ";
                DROP TABLE #TempTable1
                " ) )

                report_string.AppendStr( '<html><table>' )

                report_string.AppendStr( '<tr>' )

                report_string.AppendStr( '<td>Код</td><td>ФИО</td><td>Логин</td><td>Email</td><td>System Email</td><td>Должность</td><td>Организация</td><td>ИНН</td><td>РЦК</td><td>РОИВ</td><td>Есть партнерское соглашение</td><td>Тип поддержки</td><td>Дата создания</td><td>Кем создан</td><td>Дата модификации</td><td>Код региона</td><td>Регион</td><td>Факт.Регион</td><td>Роль доступа</td><td>Код роли доступа</td><td>ID Результ.</td><td>guid Пользователя</td><td>Когда-то был участником</td><td>Проект завершён</td><td>Уволен</td>' )

                report_string.AppendStr( '</tr>' )

                var count_arr = ArrayCount( arr )

                for ( i = 0; i < count_arr; i++ ) {
                    elem = arr[i]
                    found_fact_reg = ArrayOptFirstElem( XQuery( "for $elem in regions where $elem/id=" + elem.fact_region_id + " return $elem" ) )
                    fact_reg = found_fact_reg == undefined ? '' : found_fact_reg.name
                    obj = {}
                    obj.SetProperty( "PrimaryKey", elem.PK )
                    for( fldElem in elem ){
                        obj.SetProperty( fldElem.Name, fldElem )
                    }
                    report_string.AppendStr( '<tr>' )
                    report_string.AppendStr( '<td>'+elem.col_code+'</td><td>'+elem.col_fullname+'</td><td>'+elem.col_login+'</td><td>'+elem.col_email+'</td><td>'+elem.col_system_email+'</td><td>'+elem.position_name+'</td><td>'+elem.o_name+'</td><td>'+elem.o_inn+'</td><td>'+elem.is_rck+'</td><td>'+elem.is_roiv+'</td><td>'+elem.is_partner+'</td><td>'+elem.format_part+'</td><td>'+elem.col_created+'</td><td>'+elem.col_created_by+'</td><td>'+elem.col_modificated+'</td><td>'+elem.region_code+'</td><td>'+elem.region_name+'</td><td>'+fact_reg+'</td><td>'+elem.ar_name+'</td><td>'+elem.ar_id+'</td><td>'+elem.PK+'</td><td>'+elem.guid+'</td><td>'+elem.is_past_member+'</td><td>'+elem.is_project_ended+'</td><td>'+elem.is_dismiss+'</td>' )
                    report_string.AppendStr('</tr>')
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