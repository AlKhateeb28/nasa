// 7121746117100119626
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7121746117100119626;
var loggerName = "report_7121746117100119626";

var aReturn = [];
var i=0;

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    //RESULT = tools_web.get_user_data("boss_panel_collaborators_cache_for_reports" + OptInt(curUserID));

    //dataList = ArrayExtract(RESULT.result_array, "This");
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ids " +
        " FROM [WTDB].[dbo].cc_boss_cache_ids " +
        " WHERE person_id = " + curUserID +
        "   AND CONVERT(DATE, created_date) >= CONVERT(DATE, DATEADD(DAY,  -1 , GETDATE()))"));


//{"data": "position_parent_name", "title": tools_web.get_web_const( "c_subd", curLngWeb ),"type": "string", "sortable": true, "colorsource": "color", "width": 200},

    COLUMNS = ([
        {"data": "id", "title": "ID", "width": "50", "type": "string", "ghost": false, "hidden": true},
        {"data": "fullname", "title": "ФИО", "type": "link", "sortable": true, "colorsource": "color", "minwidth": 250, "click": ("OPENURL=view_doc.html?mode=collaborator&doc_id=" + curDocID + "&object_id={id}")},
        {"data": "position_name", "title": tools_web.get_web_const( "c_position", curLngWeb ),  "type": "string", "sortable": true, "colorsource": "color", "width": 200},
        {"data": "email", "title": "Email",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "org_inn", "title": "ИНН",  "type": "string", "sortable": true, "colorsource": "color", "width": 150},
        {"data": "org_name", "title": "Название организации",  "type": "string", "sortable": true, "colorsource": "color", "width": 200},
        {"data": "assigned_courses", "title": "Назначено",  "type": "string", "sortable": true, "colorsource": "color", "width": 100},
        {"data": "progress_courses", "title": "В процессе",  "type": "string", "sortable": true, "colorsource": "color", "width": 100},
        {"data": "completed_courses", "title": "Пройдено",  "type": "string", "sortable": true, "colorsource": "color", "width": 100},
        {"data": "create_date", "title": "Дата регистрации",  "type": "string", "sortable": true, "colorsource": "color", "width": 150}
    ]);

    step = 1;
    xarrResults = [];

    for(data in dataList) {
        collList = XQuery("sql: " +
            " SELECT col.id, " +
            "    cols.fullname, " +
            "    cols.position_parent_name, " +
            "    cols.position_name, " +
            "    cols.email, " +
            "    CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','date'), 104) AS create_date, " +
            "    ogs.name AS org_name, " +
            "    ogs.code AS org_inn " +
            " FROM [WTDB].[dbo].collaborators cols " +
            "     INNER JOIN [WTDB].[dbo].collaborator col ON col.id = cols.id " +
            "     INNER JOIN [WTDB].[dbo].orgs ogs ON ogs.id = cols.org_id " +
            " WHERE cols.id IN (" + data.ids + ")" +
            "    AND (cols.code IS NULL OR cols.code NOT LIKE '%muc%') " +
            " ORDER BY org_inn, fullname ");

        for(coll in collList) {
            element = {};
            element.id = coll.id;
            element.fullname = coll.fullname;
            element.position_parent_name = coll.position_parent_name;
            element.position_name = coll.position_name;
            element.email = coll.email;
            element.create_date = coll.create_date;
            element.org_name = coll.org_name;
            element.org_inn = coll.org_inn;

            xarrResults.push(element);
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Step: " + step);
        step++;
    }

    if (ArrayOptFirstElem(xarrResults) != undefined) {
        for (catRes in xarrResults) {
            xarrPersonNewActiveLearns = XQuery("for $elem in active_learnings where $elem/person_id=" + catRes.id + " and $elem/state_id=0 return $elem");
            xarrPersonProcessActiveLearns = XQuery("for $elem in active_learnings where $elem/person_id=" + catRes.id + " and $elem/state_id=1 return $elem");

            xarrPersonCompletActiveLearns = XQuery("for $elem in active_learnings where $elem/person_id=" + catRes.id + " and $elem/state_id=4 return $elem");
            xarrPersonCompletLearns = XQuery("for $elem in learnings where $elem/person_id=" + catRes.id + " and $elem/state_id=4 return $elem");
            xarrPersonAllCompletLearns = ArrayUnion(xarrPersonCompletActiveLearns, xarrPersonCompletLearns);

            aReturn.push({
                PrimaryKey: (i++),
                fullname: catRes.fullname.Value,
                position_name: catRes.position_name.Value,
                email: catRes.email.Value,
                org_inn: catRes.org_inn.Value,
                org_name: catRes.org_name.Value,
                assigned_courses: (ArrayOptFirstElem(xarrPersonNewActiveLearns) != undefined ? String(ArrayCount(xarrPersonNewActiveLearns)) : '0' ),
                progress_courses: (ArrayOptFirstElem(xarrPersonProcessActiveLearns) != undefined ? String(ArrayCount(xarrPersonProcessActiveLearns)) : '0' ),
                completed_courses: (ArrayOptFirstElem(xarrPersonAllCompletLearns) != undefined ? String(ArrayCount(xarrPersonAllCompletLearns)) : '0' ),
                create_date: ( catRes.create_date.HasValue && catRes.create_date != '' ? StrDate(ParseDate(catRes.create_date), false, false) : '' )
            });
        }
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    RESULT = aReturn;
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}