<%
// 6945869830255946062
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function out(_text) {
    Response.Write(_text);
}

function getFormValText(_name, _defaultVal) {
    if (_defaultVal == undefined) {
        _defaultVal = "";
    }

    _value = Request.Form.GetOptProperty(_name, _defaultVal);

    return _value;
}

function getJSONstrCourses (search, documentId) {
    courses_arr = [];

    course_objects_arr = tools.open_doc(documentId).TopElem.catalogs[0].objects;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ID: " + documentId + " Objects.Size: " + ArrayCount(course_objects_arr));

    for (course_object in course_objects_arr) {
        sql_str = " SELECT cs.id AS id, " +
            "       cs.name AS name, " +
            "       c.data.value('(course/comment)[1]' ,'varchar(max)') AS description, " +
            "       c.data.value('(course/custom_elems/custom_elem[name=''duration''])[1]/value[1]' ,'varchar(max)') AS duration, " +
            "       CASE " +
            "           WHEN c.data.value('(course/custom_elems/custom_elem[name=''is_new''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+' " +
            "           ELSE '-' " +
            "           END AS isnew, " +
            "       c.data.value('(course/custom_elems/custom_elem[name=''direction''])[1]/value[1]' ,'varchar(max)') AS direction, " +
            "       c.data.value('(course/custom_elems/custom_elem[name=''position''])[1]/value[1]' ,'varchar(max)') AS position, " +
            "       CONCAT( 'download_file.js?file_id=', c.data.value('(course/resource_id)[1]' ,'varchar(max)') ) AS img_url, " +
            "       (SELECT COUNT (l.id) FROM [WTDB].[dbo].likes AS l WHERE l.object_id = cs.id) AS likes, " +
            "       (SELECT COUNT (l.id) FROM [WTDB].[dbo].learnings AS l WHERE l.course_id = cs.id) AS views, " +
            "       CASE " +
            "           WHEN (SELECT COUNT (ls.id) " +
            "                 FROM [WTDB].[dbo].learnings ls " +
            "                          LEFT JOIN [WTDB].[dbo].[common.learning_states] cls ON cls.id = ls.state_id " +
            "                 WHERE ls.person_id = " + curUserID +
            "                   AND ls.course_id = cs.id " +
            "                   AND ls.state_id = 4) >= 1 " +
            "               THEN 'Пройден' " +
            "           ELSE 'Не пройден' " +
            "           END AS status, " +
            "       CASE " +
            "           WHEN (SELECT COUNT (ls.id) " +
            "                 FROM [WTDB].[dbo].learnings ls " +
            "                          LEFT JOIN [WTDB].[dbo].[common.learning_states] cls ON cls.id = ls.state_id " +
            "                 WHERE ls.person_id = " + curUserID +
            "                   AND ls.course_id = cs.id " +
            "                   AND ls.state_id = 4) >= 1 " +
            "               THEN '0,190,0' " +
            "           ELSE '' " +
            "           END AS status_color, " +
            "       IIF(c.data.exist('(//custom_elems/custom_elem[name=''social''])') = 0, 0, CAST(c.data.value('(//custom_elems/custom_elem[name=''social'']/value)[1]', 'bit') AS INT)) AS is_social " +
            " FROM [WTDB].[dbo].courses cs " +
            "       LEFT JOIN [WTDB].[dbo].course c ON cs.id = c.id " +
            " WHERE cs.name LIKE '%" + search + "%' " +
            "       AND cs.id = " + course_object.object_id + " " +
            " ORDER BY cs.modification_date DESC ";

        found_course = ArrayOptFirstElem(XQuery("sql: " + sql_str));

        if (found_course != undefined) {
            courses_arr.push(found_course);
        }
    }

    return tools.array_to_text(courses_arr, 'json');
}

function getJsonStrDirections () {
    directions_arr = [];

    arr_directions = custom_templates.course.fields.GetChildByKey('direction').entries;

    for (el in arr_directions) {
        myObj = {};
                myObj.value = el.value.Value;

        directions_arr.push(myObj);
    }

    return tools.array_to_text(directions_arr, 'json');
}

var agentId = 6945869830255946062;
var loggerName = "template_6945869830255946062";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

action = getFormValText('action');

if(action == 'get_courses') {
    search = getFormValText('search');

    document_id = getFormValText('document_id');

    result = getJSONstrCourses(search, document_id);

    out(result);
}

if (action == 'get_directions') {
    result = getJsonStrDirections();

    out(result);
}

%>