function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 7097117756238813319});
if (included) {
    /*
    var bIsLog = true // вести логирование выполнения агента
    var sLogMethod = "ext" // метод вывода в лог - ext, system, report, excel // report - teCurObject = tools.open_doc( curObjectID ).TopElem
    var sLogMethodExt = "ext_log" // префикс файла журнала (для sLogMethod = "ext")
    var slogMethodPath = "x-local://Logs/" //директория для сохранения файла на сервер (sLogMethod = "excel")
    var docReport
    var sLogStr = ''
    */

    function from_str_to_header( _str ) {
        return param_columns.ObtainChildByKey( _str ).name
    }

    function create_header() {
        header_str = ""
        for ( colmn in columns_arr ) {
            header_str += "<td>" + from_str_to_header( colmn ) + "</td>"
        }
        return header_str
    }

    function create_row( _elem ) {
        row_str = ""
        for ( colmn in columns_arr ) {
            if ( _elem.ChildExists( colmn ) ) row_str += "<td>" + _elem.Child( colmn ) + "</td>"
        }
        return row_str
    }

    if ( LdsIsServer ) {
        sLogMethod = "report"
        curObjectID = 7097117756238813319
        curObjectDoc = tools.open_doc( curObjectID )
        teCurObject = curObjectDoc.TopElem

        columns_arr = Param.columns.split( ";" )
        param_columns = teCurObject.wvars.ObtainChildByKey( "columns" ).entries

        try {
            open_log()
            var bDebugMode = false
            if ( !bDebugMode ) {
                write_log_text( "bDebugMode = " + bDebugMode )
                var date_start_report = Date()
                var folder = 'E:/Websoft/Reports/report_org_learnings_full/'
                var f_name = 'report_org_all_learnings_full_' + ParseDate( Date() ) + '.xlsx'
                var f_url = folder + f_name
                var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document")
                var report_string = new Binary()


                // tools.create_notification( "start_report", tools.cur_user_id, f_name, tools.cur_user_id )
                /*
                sql_str = "sql:
                    WITH Table_2 AS (
                        SELECT
                            [orgs].id AS org_id,
                            [func_managers].person_fullname AS fm
                        FROM [orgs]
                        LEFT JOIN [func_managers]
                            ON [orgs].id = [func_managers].[object_id]
                        )
                    SELECT
                        org_id,
                        fms = STUFF( ( SELECT '|' + fm FROM Table_2 t1 WHERE t1.org_id = t2.org_id FOR XML PATH ('') ) , 1, 1, '' )
                    INTO #TempTable
                    FROM Table_2 t2
                    GROUP BY org_id;
                    WITH Table_1 AS (
                        SELECT
                            learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id
                            , learning.data.value('(learning/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS guid
                        FROM learnings
                        LEFT JOIN learning
                            ON learnings.id = learning.id
                        UNION
                        SELECT
                            active_learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id
                            , active_learning.data.value('(active_learning/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS guid
                        FROM active_learnings
                        LEFT JOIN active_learning
                            ON active_learnings.id = active_learning.id
                        )
                    SELECT top 1000000
                        CONCAT( '''', Table_1.id ) AS l_id
                        , Table_1.guid AS l_guid
                        , CONCAT( '''', collaborators.id ) AS col_id
                        , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS col_guid
                        , collaborators.code AS col_code
                        , collaborators.fullname AS col_fullname
                        , collaborators.email AS col_email
                        , collaborators.position_name AS col_p_name
                        , orgs.name AS o_name
                        , CONCAT( '''', orgs.code ) AS o_code
                        , courses.code AS course_code
                        , courses.name AS course_name
                        , course.data.value('(course/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS course_guid
                        , Table_1.start_usage_date AS start_date
                        , Table_1.last_usage_date AS finish_date
                        , Table_1.score
                        , [common.learning_states].name AS state
                        , regions.name AS region_name
                        , regions.code AS region_code
                        , org.data.value('(org/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS org_guid
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
                        , #TempTable.fms AS fms
                    FROM Table_1
                    LEFT JOIN courses
                        ON Table_1.course_id = courses.id
                    LEFT JOIN course
                        ON courses.id = course.id
                    LEFT JOIN collaborators
                        ON Table_1.person_id = collaborators.id
                    LEFT JOIN collaborator
                        ON collaborators.id = collaborator.id
                    LEFT JOIN orgs
                        ON collaborators.org_id = orgs.id
                    LEFT JOIN org
                        ON collaborators.org_id = org.id
                    LEFT JOIN regions
                        ON orgs.region_id = regions.id
                    LEFT JOIN [common.learning_states]
                        ON Table_1.state_id = [common.learning_states].id
                    LEFT JOIN #TempTable
                        ON orgs.id = #TempTable.org_id
                    ;
                    DROP TABLE #TempTable
                "
                */
                sql_str = "sql:
                WITH Table_1 AS (
                    SELECT
                learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id
                    , learning.data.value('(learning/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS guid
                FROM learnings
                LEFT JOIN learning
                ON learnings.id = learning.id
                WHERE learnings.state_id > 0
                UNION
                SELECT
                active_learnings.id, person_id, course_id, start_usage_date, last_usage_date, score, state_id
                    , active_learning.data.value('(active_learning/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS guid
                FROM active_learnings
                LEFT JOIN active_learning
                ON active_learnings.id = active_learning.id
                WHERE active_learnings.state_id > 0
            )
                SELECT
                CONCAT( '''', Table_1.id ) AS l_id
                    , Table_1.guid AS l_guid
                    , CONCAT( '''', collaborators.id ) AS col_id
                    , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS col_guid
                    , collaborators.code AS col_code
                    , collaborators.fullname AS col_fullname
                    , collaborators.email AS col_email
                    , collaborators.position_name AS col_p_name
                    , orgs.name AS o_name
                    , CONCAT( '''', orgs.code ) AS o_code
                    , courses.code AS course_code
                    , courses.name AS course_name
                    , course.data.value('(course/custom_elems/custom_elem[name=''guid''])[1]/value[last()]', 'varchar(max)') AS course_guid
                    , Table_1.start_usage_date AS start_date
                    , Table_1.last_usage_date AS finish_date
                    , Table_1.score
                    , [common.learning_states].name AS state
                    , regions.name AS region_name
                    , regions.code AS region_code
                    , org.data.value('(org/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS org_guid
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
                FROM Table_1
                LEFT JOIN courses
                ON Table_1.course_id = courses.id
                LEFT JOIN course
                ON courses.id = course.id
                LEFT JOIN collaborators
                ON Table_1.person_id = collaborators.id
                LEFT JOIN collaborator
                ON collaborators.id = collaborator.id
                LEFT JOIN orgs
                ON collaborators.org_id = orgs.id
                LEFT JOIN org
                ON collaborators.org_id = org.id
                LEFT JOIN regions
                ON orgs.region_id = regions.id
                LEFT JOIN [common.learning_states]
                ON Table_1.state_id = [common.learning_states].id
                "
                arr = ArraySelectAll( XQuery( sql_str ) )

                var fields_arr = ArrayOptFirstElem( arr )

                report_string.AppendStr( '<html><table>' )

                report_string.AppendStr( '<tr>' )
                report_string.AppendStr( create_header() )
                report_string.AppendStr( '</tr>' )

                for( elem in arr ){
                    report_string.AppendStr( '<tr>' )
                    try {
                        report_string.AppendStr( create_row( elem ) )
                    } catch( err ) { continue }
                    /*
                    report_string.AppendStr( '<td>'+elem.l_id+'</td><td>'+elem.l_guid+'</td><td>'+elem.col_id+'</td><td>'+elem.col_guid+'</td><td>'+elem.col_code+'</td><td>'+elem.col_fullname+'</td><td>'+elem.col_email+'</td><td>'+elem.col_p_name+'</td><td>'+elem.o_code+'</td><td>'+elem.o_name+'</td><td>'+elem.fms+'</td><td>'+elem.course_code+'</td><td>'+elem.course_name+'</td><td>'+elem.course_guid+'</td><td>'+elem.start_date+'</td><td>'+elem.finish_date+'</td><td>'+elem.score+'</td><td>'+elem.state+'</td><td>'+elem.is_rck+'</td><td>'+elem.is_roiv+'</td><td>'+elem.is_partner+'</td><td>'+elem.format_part+'</td><td>'+elem.org_guid+'</td><td>'+elem.region_name+'</td><td>'+elem.region_code+'</td>' )
                    */

                    report_string.AppendStr('</tr>')
                }
                report_string.AppendStr( '</table></html>' )
                oExcelDoc.LoadHtmlString( report_string.GetStr(), "" )
                oExcelDoc.SaveAs( f_url )

                // tools.create_notification( "finish_report", tools.cur_user_id, f_name, tools.cur_user_id )
                delta = DateToRawSeconds( Date() ) - DateToRawSeconds( date_start_report )
                duration = StrReal( delta / 60.0, 0 ) + " мин"
                teCurObject.custom_elems.ObtainChildByKey( "work_duration" ).value = duration
                curObjectDoc.Save()
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