<%

function out ( _text ) {
    Response.Write( _text )
}

function getFormValText ( _name, _defaultVal ) {
    if ( _defaultVal == undefined ) {
        _defaultVal = "";
    }
    _value = Request.Form.GetOptProperty( _name, _defaultVal )
    return _value
}

function getJSONstrCourses ( _search, _document_id ) {
    courses_arr = []
    group_cards_arr = XQuery( "sql:
    SET DATEFORMAT dmy
    ;
    SELECT
    group_collaborators.group_id AS group_id
        , g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_id''])[1]/value[1]', 'varchar(max)') AS ind_card_id
    FROM group_collaborators
    LEFT JOIN [WTDB].[dbo].[group] g
    ON g.id = group_collaborators.group_id
    WHERE group_collaborators.collaborator_id = " + curUserID + "
    AND g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_id''])[1]/value[1]', 'varchar(max)') IS NOT NULL
    AND GETDATE() BETWEEN g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_start_date''])[1]/value[1]', 'date') AND g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_finish_date''])[1]/value[1]', 'date')
    " )
    course_ids_arr = []
    for ( group_card in group_cards_arr ) {
        te_ind_order_card = tools.open_doc( group_card.ind_card_id ).TopElem
        for ( stage_num = 1; stage_num <= 9; stage_num++ ) {
            if ( te_ind_order_card.ChildValue( "stage_" + stage_num + "_group_id" ) == group_card.group_id ) {
                my_sql_str = "sql:
                SELECT
                T.c.value('stage_" + stage_num + "_course_id[1]','varchar(max)') AS course_id
                FROM cc_ind_order_cards
                LEFT JOIN cc_ind_order_card
                ON cc_ind_order_card.id = cc_ind_order_cards.id
                CROSS APPLY cc_ind_order_card.data.nodes('(cc_ind_order_card/stage_" + stage_num + "_courses/stage_" + stage_num + "_course)') T(c)
                WHERE cc_ind_order_cards.id = " + group_card.ind_card_id + "
                "
                my_arr = ArrayExtractKeys( XQuery( my_sql_str ), "course_id" )
                my_arr = ArraySelectDistinct( my_arr, "This" )
                for ( el in my_arr ) {
                    course_ids_arr.push( el )
                }
            }
        }
    }
    course_ids_str = ""
    for( el in course_ids_arr ) {
        course_ids_str += el + ";"
    }

    course_objects_arr = tools.open_doc( _document_id ).TopElem.catalogs[0].objects
    course_objects_arr = ArraySelect( course_objects_arr, "StrContains('" + course_ids_str + "', This.object_id)" )
    for ( course_object in course_objects_arr ) {
        sql_str = "
        SELECT
        courses.id AS id
            , courses.name AS name
            , course.data.value('(course/comment)[1]' ,'varchar(max)') AS description
            , course.data.value('(course/custom_elems/custom_elem[name=''duration''])[1]/value[1]' ,'varchar(max)') AS duration
            , CASE
        WHEN course.data.value('(course/custom_elems/custom_elem[name=''is_new''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS isnew
            , course.data.value('(course/custom_elems/custom_elem[name=''direction''])[1]/value[1]' ,'varchar(max)') AS direction
            , course.data.value('(course/custom_elems/custom_elem[name=''position''])[1]/value[1]' ,'varchar(max)') AS position
            , CONCAT( 'download_file.js?file_id=', course.data.value('(course/resource_id)[1]' ,'varchar(max)') ) AS img_url
            , ( SELECT COUNT (l.id) FROM likes AS l WHERE l.object_id = courses.id ) AS likes
            , ( SELECT COUNT (l.id) FROM learnings AS l WHERE l.course_id = courses.id ) AS views
            , CASE
        WHEN (SELECT COUNT (learnings.id) FROM learnings LEFT JOIN [common.learning_states] ON [common.learning_states].id = learnings.state_id WHERE learnings.person_id = " + curUserID + " AND learnings.course_id = courses.id AND learnings.state_id = 4) >= 1 THEN 'Пройден'
        ELSE 'Не пройден'
        END AS status
            , CASE
        WHEN (SELECT COUNT (learnings.id) FROM learnings LEFT JOIN [common.learning_states] ON [common.learning_states].id = learnings.state_id WHERE learnings.person_id = " + curUserID + " AND learnings.course_id = courses.id AND learnings.state_id = 4) >= 1 THEN '0,190,0'
        ELSE ''
        END AS status_color
        FROM courses
        LEFT JOIN course
        ON course.id = courses.id
        WHERE
        courses.name LIKE '%" + _search + "%'
        AND courses.id = " + course_object.object_id + "
        ORDER BY courses.modification_date DESC
        "
        found_course = ArrayOptFirstElem( XQuery( "sql: " + sql_str ) )
        if ( found_course != undefined ) {
            courses_arr.push( found_course )
        }
    }

    return tools.array_to_text( courses_arr, 'json' )
}
function getJSONstrDirections () {
    directions_arr = []
    arr_directions = custom_templates.course.fields.GetChildByKey('direction').entries
    for ( el in arr_directions ) {
        myObj = {}
        myObj.value = el.value.Value
        directions_arr.push( myObj )
    }
    return tools.array_to_text( directions_arr, 'json' )
}

action = getFormValText( 'action' )


if ( action == 'get_courses' ) {
    search = getFormValText( 'search' )
    document_id = getFormValText( 'document_id' )
    result = getJSONstrCourses( search, document_id )
    out( result )
}

if ( action == 'get_directions' ) {
    result = getJSONstrDirections()
    out( result )
}

%>