<%

function out ( _text ) {
    // 7394380647044118705

    Response.Write( _text )
}

function getFormValText ( _name, _defaultVal ) {
    if ( _defaultVal == undefined ) {
        _defaultVal = "";
    }
    _value = Request.Form.GetOptProperty( _name, _defaultVal )
    return _value
}

function getJSONCourses ( _search, _document_id ) {
    courses_arr = []

    //ocl = OpenCodeLib( "x-local://UD/ocl.js" )
    //course_objects_arr = ocl.wd( "server_functions" ).getAttachedObjectIDs( 6674846170380136045, "course" )

    course_objects_arr = tools.open_doc( _document_id ).TopElem.catalogs[0].objects;
    for ( course_object in course_objects_arr ) {

        sql_str = " SELECT courses.id AS id " +
            " , courses.name AS name " +
            " , course.data.value('(course/comment)[1]' ,'varchar(max)') AS description " +
            " , course.data.value('(course/custom_elems/custom_elem[name=''duration''])[1]/value[1]' ,'varchar(max)') AS duration " +
            " , CASE " +
            "   WHEN course.data.value('(course/custom_elems/custom_elem[name=''is_new''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "       ELSE '-' " +
            "   END AS isnew " +
            " , course.data.value('(course/custom_elems/custom_elem[name=''direction''])[1]/value[1]' ,'varchar(max)') AS direction " +
            " , course.data.value('(course/custom_elems/custom_elem[name=''position''])[1]/value[1]' ,'varchar(max)') AS position " +
            " , CONCAT( 'download_file.html?file_id=', course.data.value('(course/resource_id)[1]' ,'varchar(max)') ) AS img_url " +
            " , ( SELECT COUNT (l.id) FROM likes AS l WHERE l.object_id = courses.id ) AS likes " +
            " , ( SELECT COUNT (l.id) FROM learnings AS l WHERE l.course_id = courses.id ) AS views " +
            " , '' AS status " +
            ", '' AS status_color " +
        " FROM courses " +
            " LEFT JOIN course ON course.id = courses.id " +
            " WHERE courses.id = " + course_object.object_id +
            " ORDER BY courses.modification_date DESC"

        found_course = ArrayOptFirstElem( XQuery( "sql: " + sql_str ) );
        if ( found_course != undefined ) {
            courses_arr.push( found_course );
        }
    }

    return tools.array_to_text( courses_arr, 'json' );
}
function getJSONDirections () {
    directions_arr = [];
    arr_directions = custom_templates.course.fields.GetChildByKey('direction').entries;
    for ( el in arr_directions ) {
        myObj = {};
        myObj.value = el.value.Value;
        directions_arr.push( myObj );
    }
    return tools.array_to_text( directions_arr, 'json' );
}

action = getFormValText( 'action' );


if ( action == 'get_courses' ) {
    search = getFormValText( 'search' );
    document_id = getFormValText( 'document_id' );
    result = getJSONCourses( search, document_id );
    out( result );
}

if ( action == 'get_directions' ) {
    result = getJSONDirections();
    out( result );
}

%>