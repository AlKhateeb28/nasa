// 6802848093877855826
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 6802848093877855826;
var loggerName = "report_6802848093877855826";

try {
	addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
	addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
	
    RESULT = tools_web.get_user_data("boss_panel_collaborators_cache_" + curUserID);
    var myArr = new Array();
    var i = 0;

	cacheIds = "";

	dataList = ArrayDirect(XQuery("sql: " +
		" SELECT ids " +
		" FROM [WTDB].[dbo].cc_boss_cache_ids " +
		" WHERE person_id = " + curUserID +
		"   AND CONVERT(DATE, created_date) >= CONVERT(DATE, DATEADD(DAY,  -2 , GETDATE()))"));

	for(data in dataList) {
		cacheIds += "(" + data.ids + "),";
	}

	cacheIds = StrCharRangePos(cacheIds, 0, StrCharCount(cacheIds) - 1);

	if (curUserID == 7350654723072997973) {
		addLogMessage(loggerName, "[agent.id: " + agentId + "] IDS: " + cacheIds);
	}

    xarrResults = Array();
    //if (ArrayOptFirstElem(RESULT.result_array) != undefined) {
	if (cacheIds != "") {
        //aCollIds = ArrayExtract(RESULT.result_array, "This.id");
		var sQuery = "sql:\
			DECLARE @T AS table (id BIGINT);\
			\
			IF (OBJECT_ID('tempdb..#t_act_lean_data') IS NOT NULL) DROP TABLE #t_act_lean_data;\
			IF (OBJECT_ID('tempdb..#t_lean_data') IS NOT NULL) DROP TABLE #t_lean_data;\
			\
			CREATE TABLE #t_act_lean_data\
			(\
				person_id BIGINT,\
				state_id TINYINT,\
				cnt INT\
			);\
			\
			CREATE TABLE #t_lean_data\
			(\
				person_id BIGINT,\
				cnt INT\
			);\
			\
			\
			WITH CTE (id) AS\
			(\
				SELECT V.v \
				FROM \
				(\
					VALUES " + cacheIds + "\
				) AS V(v)\
			)\
			\
			INSERT @T (id)\
			SELECT id \
			FROM CTE;\
			\
			INSERT INTO #t_act_lean_data (person_id, state_id, cnt)\
			SELECT\
				als.person_id,\
				als.state_id,\
				COUNT(1) cnt\
			FROM\
				active_learnings als\
				JOIN @T st ON st.id = als.person_id AND als.state_id IN (0, 1, 4)\
			GROUP BY als.person_id, als.state_id\
			\
			INSERT INTO #t_lean_data (person_id, cnt)\
			SELECT\
				als.person_id,\
				COUNT(1) cnt\
			FROM\
				learnings als\
				JOIN @T st ON st.id = als.person_id AND als.state_id = 4\
			GROUP BY als.person_id\
			\
			SELECT\
				col.id,\
				cols.fullname,\
				cols.position_parent_name,\
				cols.position_name,\
				cols.email,\
				CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','date'), 104) create_date,\
				IIF(tal_new.person_id IS NOT NULL, tal_new.cnt, 0) assigned_courses,\
				IIF(tal_proc.person_id IS NOT NULL, tal_proc.cnt, 0) progress_courses,\
				(IIF(tl_comp.person_id IS NOT NULL, tl_comp.cnt, 0) + IIF(tal_comp.person_id IS NOT NULL, tal_comp.cnt, 0)) completed_courses\
			FROM\
				collaborators cols\
				JOIN @T st ON st.id = cols.id AND (cols.code IS NULL OR NOT cols.code LIKE '%muc%')\
				JOIN collaborator col ON col.id = cols.id\
				LEFT JOIN #t_act_lean_data tal_new ON tal_new.person_id = cols.id AND tal_new.state_id = 0\
				LEFT JOIN #t_act_lean_data tal_proc ON tal_proc.person_id = cols.id AND tal_proc.state_id = 1\
				LEFT JOIN #t_act_lean_data tal_comp ON tal_comp.person_id = cols.id AND tal_comp.state_id = 4\
				LEFT JOIN #t_lean_data tl_comp ON tl_comp.person_id = cols.id\
			ORDER BY fullname\
			\
			\
			IF (OBJECT_ID('tempdb..#t_act_lean_data') IS NOT NULL) DROP TABLE #t_act_lean_data;\
			IF (OBJECT_ID('tempdb..#t_lean_data') IS NOT NULL) DROP TABLE #t_lean_data;\
		";

		if (curUserID == 7350654723072997973) {
			addLogMessage(loggerName, "[agent.id: " + agentId + "] SQL: " + sQuery);
		}
        
		xarrResults = ArraySelectAll(XQuery(sQuery));

		addLogMessage(loggerName, "[agent.id: " + agentId + "] Count: " + ArrayCount(xarrResults));
    }


    if (ArrayOptFirstElem(xarrResults) != undefined) {
        for (catRes in xarrResults) {
            myArr.push({
                id: catRes.id.Value,
                fullname: catRes.fullname.Value,
                position_name: catRes.position_name.Value,
                email: catRes.email.Value,
                assigned_courses: OptInt(catRes.assigned_courses, 0),
                progress_courses: OptInt(catRes.progress_courses, 0),
                completed_courses: OptInt(catRes.completed_courses, 0),
                create_date: (catRes.create_date.HasValue && catRes.create_date != '' ? StrDate(ParseDate(catRes.create_date), false, false) : '')
            });
        }
    }

    RESULT.result_array = myArr;
    if (RESULT != null && RESULT.HasProperty("result_array")) {
        if (SORT.FIELD == null)
            SORT.FIELD = "fullname";
        RESULT = ArraySort(RESULT.result_array, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));
    }
    else
        RESULT = new Array();


    COLUMNS = ([
        { "data": "id", "title": "ID", "width": "50", "type": "string", "ghost": false, "hidden": true },
        { "data": "fullname", "title": "ФИО", "type": "link", "sortable": true, "colorsource": "color", "minwidth": 250, "click": ("OPENURL=view_doc.html?mode=collaborator&doc_id=" + curDocID + "&object_id={id}") }
    ]);

    //{"data": "position_parent_name", "title": tools_web.get_web_const( "c_subd", curLngWeb ),"type": "string", "sortable": true, "colorsource": "color", "width": 260},

    switch (SCOPE_WVARS.GetOptProperty("view_type")) {
        case "mobile": break;
        case "tile":
            COLUMNS = ArrayUnion(COLUMNS, ([
                { "data": "aux_value_0", "title": tools_web.get_web_const("vpb_birthday", curLngWeb), "type": "string", "sortable": true, "colorsource": "color", "width": 150 },
                { "data": "aux_value_1", "title": tools_web.get_web_const("9zrvsdt5a5", curLngWeb), "type": "string", "sortable": true, "colorsource": "color", "width": 150 },
                { "data": "aux_value_2", "title": tools_web.get_web_const("datavstupleniya", curLngWeb), "type": "string", "sortable": true, "colorsource": "color", "width": 150 }
            ]));
            break;
        default:
            COLUMNS = ArrayUnion(COLUMNS, ([
                { "data": "position_name", "title": tools_web.get_web_const("c_position", curLngWeb), "type": "string", "sortable": true, "colorsource": "color", "width": 260 },
                { "data": "email", "title": "Email", "type": "string", "sortable": true, "colorsource": "color", "width": 200 },
                { "data": "assigned_courses", "title": "Назначено", "type": "string", "sortable": true, "colorsource": "color", "width": 90 },
                { "data": "progress_courses", "title": "В процессе", "type": "string", "sortable": true, "colorsource": "color", "width": 90 },
                { "data": "completed_courses", "title": "Пройдено", "type": "string", "sortable": true, "colorsource": "color", "width": 90 },
                { "data": "create_date", "title": "Дата регистрации", "type": "string", "sortable": true, "colorsource": "color", "width": 170 }
            ]));

            var vStat = OptInt(SCOPE_WVARS.GetOptProperty("statistic_id"));
            if (vStat != undefined) {
                vStat = ArrayOptFirstElem(XQuery("for $elem in statistic_recs where $elem/id = " + vStat + " return $elem/Fields('id','name')"));
                if (vStat != undefined)
                    COLUMNS.push(({ "data": "statval", "title": vStat.name.Value, "type": "string", "sortable": false, "colorsource": "color", "width": 150 }));
            }
            break;
    }

	addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
}
catch (er) {
    alert("### Error my_boss_panel: " + er);
	addLogMessage(loggerName, "[agent.id: " + agentId + "] my_boss_panel ERROR: " + e);
}