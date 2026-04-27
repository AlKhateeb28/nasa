// 7302462599334600205
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7302462599334600205;
var loggerName = "report_7302462599334600205";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
	
var arrResult = Array();

var isMobile = tools_web.is_true(SCOPE_WVARS.GetOptProperty("is_mobile"));

if (SORT.FIELD == null) {
	SORT.FIELD = "person_fullname";
}

var arrID = tools_web.get_user_data("boss_panel_collaborators_cache_" + curUserID);

if (arrID != null && arrID.HasProperty("result_array")) {
	arrID = ArrayExtract( arrID.result_array, 'id' );
} else {
	arrID = new Array();
}
var curPersonsArray;

if (ArrayOptFirstElem( arrID ) == undefined) {
	curPersonsArray = Array();
} else {
	curPersonsArray = QueryCatalogByKeys( 'collaborators', 'id', arrID );
}

alert("curPersonsArray: " + ArrayCount(curPersonsArray));

var sXQueryAdd = "";
if(sSearchWord != "") {
	sXQueryAdd = " and doc-contains($elem/id, '" + DefaultDb + "', '" + sSearchWord + "')";
}

var sPersons = ArrayMerge( curPersonsArray, 'id', ',' );

var arrAllLearning = Array();

var sLearningCore, sFilterData, aLearningCore = sLearningType.split(",")
var aLearnTypes = Array();

for (sLearningCore in aLearningCore) {
	switch(StrLeftRange(Trim(sLearningCore), 2)) {
		case "t:":
			sFilterData = Trim(StrRightRangePos(sLearningCore, 2));
			if (sFilterData != '')
				aLearnTypes.push(sFilterData);
			break;
		case "s:":
			sFilterData = OptInt(StrRightRangePos(sLearningCore, 2));
			if (sFilterData != undefined)
				sXQueryAdd += " and $elem/state_id = " + XQueryLiteral(sFilterData);
			break;
		case "p:":
			sFilterData = StrRightRangePos(sLearningCore, 2).split("-");
			if (ArrayCount(sFilterData) == 2) {
				sFilterData[0] = OptInt(sFilterData[0]);
				sFilterData[1] = OptInt(sFilterData[1]);
				if (sFilterData[0] != undefined)
					sXQueryAdd += " and $elem/score >= " + sFilterData[0];
				if (sFilterData[1] != undefined)
					sXQueryAdd += " and $elem/score <= " + sFilterData[1];
			}
			break;
		case "f:":
			sFilterData = StrRightRangePos(sLearningCore, 2).split("--");
			if (ArrayCount(sFilterData) == 2) {
				sFilterData[0] = Trim(sFilterData[0]);
				sFilterData[1] = Trim(sFilterData[1]);
				if (sFilterData[0] != "")
					sXQueryAdd += " and $elem/last_usage_date >= date('" + sFilterData[0] + "')";
				if (sFilterData[1] != "")
					sXQueryAdd += " and $elem/last_usage_date <= date('" + sFilterData[1] + "')";
			}
			break;
		case "c:":
			sFilterData = StrRightRangePos(sLearningCore, 2).split("--");
			if (ArrayCount(sFilterData) == 2) {
				if (sFilterData[0] != "" || sFilterData[1] != "") {
					alert("Course sFilterData[0]: " + sFilterData[0]);
					var arrCollabs = Array();
					var strWhere = "";
		
					dDate1 = (sFilterData[0] != "" ? ParseDate(Trim(sFilterData[0])) : "");
					dDate2 = (sFilterData[1] != "" ? ParseDate(Trim(sFilterData[1])) : "");
									
					sKeyDate1 = (dDate1 != "" ? String(Day(dDate1)) + String(Month(dDate1)) + String(Year(dDate1)) : "");
					sKeyDate2 = (dDate2 != "" ? String(Day(dDate2)) + String(Month(dDate2)) + String(Year(dDate2)) : "");
					//alert("sKeyDate1: " + sKeyDate1);
					//alert("sKeyDate2: " + sKeyDate2);
		
					sUserCacheKey = "bp_filtcoll_" + sKeyDate1 + "_" + sKeyDate2;
					alert("sUserCacheKey: " + sUserCacheKey);
		
					if (global_settings.settings.web_api_settings.use_cache.Value && (arrCollabs = tools_web.get_user_data(sUserCacheKey)) != null && IsArray(arrCollabs.GetOptProperty("data", null))) {
						alert("arrCollabs from cache");
						//alert("Data: " + ArrayCount(arrCollabs.GetOptProperty("data")));
						arrCollabs = arrCollabs.data;
					} else {
						alert("arrCollabs create now");
						
						arrCollabs = Array();
						arrCachCollabs = Array();
						
						if (dDate1!= "") {
							 strWhere += "AND CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','datetime2'), 104) >= CONVERT(datetime2, '" + StrDate(ParseDate(Trim(dDate1)), false, false)  + "', 104)";
						}
						
						if (dDate2 != "") {
							strWhere += "AND CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','datetime2'), 104) <= CONVERT(datetime2, '" + StrDate(ParseDate(Trim(dDate2)), false, false)  + "', 104)";
						}
						alert("strWhere: " + strWhere);
											
						sQuery = "sql: " +
						" SELECT col.id, " +
						" 		cols.fullname, " +
						" 		cols.position_parent_name, " +
						" 		cols.position_name, " +
						" 		cols.email, " +
						" 		CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','date'), 104) create_date, " +
						" 		os.code, " + 
						" 		os.name AS org_name "
						" FROM [WTDB].[dbo].collaborators cols " +
						" 		INNER JOIN [WTDB].[dbo].collaborator col ON col.id = cols.id " +
						" 		INNER JOIN [WTDB].[dbo].orgs os ON cols.org_id = os.id " +
						" WHERE (cols.code IS NULL OR NOT cols.code LIKE '%muc%') " + strWhere + 
						" ORDER BY fullname";
						
						arrCollabs = XQuery(sQuery);
						
						
						if (ArrayOptFirstElem(arrCollabs) != undefined) {
							for (catCollab in arrCollabs) {
								oCachCollab = new Object;
								oCachCollab.id = catCollab.id.Value;
								oCachCollab.fullname = catCollab.fullname.Value;
								oCachCollab.position_parent_name = catCollab.position_parent_name.Value;
								oCachCollab.position_name = catCollab.position_name.Value;
								oCachCollab.email = catCollab.email.Value;
								oCachCollab.create_date = catCollab.create_date.Value;
								oCachCollab.code = catCollab.code.Value;
								oCachCollab.org_name = catCollab.org_name.Value;
								
								arrCachCollabs.push(oCachCollab);
							}
						}
						
						alert("arrCachCollabs: " + ArrayCount(arrCachCollabs));
						
						tools_web.set_user_data(sUserCacheKey, ({"data": arrCachCollabs}), 604800);
					}
		
					alert("ArrCollab2: " + ArrayCount(arrCollabs));
										
					if (ArrayOptFirstElem(arrCollabs) != undefined) {
						strCollabsIds = ArrayMerge(ArrayExtract(arrCollabs, "This.id"), "This", ",");
						//alert("strCollabsIds: " + strCollabsIds);
						arrSelectCollabs = ArraySelect(curPersonsArray, "StrContains(strCollabsIds, String(This.id))");
						//alert("arrSelectCollabs: " + ArrayCount(arrSelectCollabs));
						if (ArrayOptFirstElem(arrSelectCollabs) != undefined)
							sPersons = ArrayMerge( arrSelectCollabs, 'id', ',' );
						
						//sXQueryAdd += " and MatchSome( $elem/person_id, ( " + ArrayMerge( arrCollabsIds, "This", "," ) + " ))";
					}
				}
			}
			break;
	}
}

if (ArrayOptFirstElem(aLearnTypes) == undefined) {
	aLearnTypes.push("active_learnings", "learnings");
}

for (_catalog in aLearnTypes) {
	arrAllLearning = ArrayUnion(arrAllLearning,XQuery(('for $elem in ' + _catalog + ' where MatchSome($elem/person_id, (' + sPersons + '))' +sXQueryAdd+ /*' order by $elem/' +SORT.FIELD+ (SORT.DIRECTION == "DESC" ? " descending" : "") +*/ ' return $elem')));
	
	arrAllLearning = ArraySort(arrAllLearning, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));
}

if (PAGING.SIZE != null) {
	PAGING.MANUAL = true;
	PAGING.TOTAL = ArrayCount(arrAllLearning);
	arrAllLearning = ArrayRange(arrAllLearning, OptInt(PAGING.INDEX, 0) * PAGING.SIZE, PAGING.SIZE);
}

var oResult, iResultCounter = 0;
for (fldLearningElem in arrAllLearning) {
	oResult=new Object;
	oResult.person_fullname = fldLearningElem.person_fullname.Value;

	oResult.person_id = fldLearningElem.person_id.Value + "";
	oResult.parent_id = "x" + oResult.person_id;
	oResult.person_position_name = tools_web.get_cur_lng_name(fldLearningElem.person_position_name.Value, curLng.short_id);
	oResult.person_subdivision_name = tools_web.get_cur_lng_name(fldLearningElem.person_subdivision_name.Value, curLng.short_id);
	docPerson = tools.open_doc(fldLearningElem.person_id);
	oResult.create_date = StrDate(docPerson.TopElem.doc_info.creation.date, false, false);
	//oResult.create_date = StrDate(fldLearningElem.person_id.ForeignElem.creation_date, false, false);
	
	
	orgDoc = tools.open_doc(docPerson.TopElem.org_id);
	if(orgDoc != undefined) {
		oResult.org_code = orgDoc.TopElem.code.Value; 
		oResult.org_name = orgDoc.TopElem.name.Value;
	}	 
	
	oResult.id = fldLearningElem.id.Value + "";
	oResult.url_name= tools_web.get_mode_clean_url(null, fldLearningElem.course_id.Value, ({"doc_id": curDocID}));
	oResult.score = fldLearningElem.score.Value;

	fldCourse = fldLearningElem.course_id.OptForeignElem;
	if (fldCourse != undefined) {
		oResult.course_name= tools_web.get_cur_lng_name(fldCourse.name.Value, curLng.short_id);
		if ( fldLearningElem.score.HasValue && fldCourse.max_score.HasValue && fldCourse.max_score > 0 ) {
			oResult.score += " (" + StrReal( ( fldLearningElem.score.Value / fldCourse.max_score.Value ) * 100.0, 1 ) + "%)";
		}
	} else {
		oResult.course_name = "";
	}
	
	oResult.last_usage_date = StrDate(fldLearningElem.last_usage_date.Value, true, false);
	oResult.start_usage_date = StrDate(fldLearningElem.start_usage_date.Value, true, false);
	oResult.start_learning_date = StrDate(fldLearningElem.start_learning_date.Value, true, false);
	
	oResult.url = tools_web.get_mode_clean_url("collaborator", fldLearningElem.person_id.Value, ({"doc_id": curDocID}));
	oResult.url_status = "";
	if (fldLearningElem.state_id.HasValue) {
		oResult.state_id = curLngCommon.learning_states.GetChildByKey(fldLearningElem.state_id).name.Value;
	}
	
	oResult.url_status= tools_web.get_mode_clean_url("learning_stat", fldLearningElem.id.Value, ({"doc_id": curDocID}));

	arrResult[iResultCounter]=oResult;
	iResultCounter++;
}

/*
arrResult = ArraySort(arrResult, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));

if (PAGING.INDEX != null && PAGING.SIZE != null)
{
	PAGING.MANUAL = true;
	PAGING.TOTAL = ArrayCount(arrResult);
	arrResult = ArrayRange(arrResult, PAGING.INDEX * PAGING.SIZE, PAGING.SIZE);
}
*/


if (bCategory && !isMobile) {
	aUsers = ArrayExtract(ArraySelectDistinct(arrResult, "This.person_id"), "({'id': This.parent_id, 'person_fullname': This.person_fullname, 'parent_id': '', 'url': This.url, 'url_name': 'STOP', 'person_id': This.person_id})");
	
	for (fldLearningElem in aUsers) {
		fldLearningElem.name = ArrayCount(ArraySelectByKey(arrResult, fldLearningElem.person_id, "person_id")) + "";
	}
	
	for (fldLearningElem in arrResult) {
		fldLearningElem.person_fullname='';
		fldLearningElem.url='';
	}
	arrResult = ArrayUnion(aUsers, arrResult);
}

alert(ArrayCount(arrResult))
RESULT = arrResult;


if (isMobile) {
	COLUMNS = ([
	{"data": "id", "title": "ID", "type": "string", "ghost": false, "hidden": true},
	{"data": "person_id", "title": "parent_id", "type": "string", "ghost": false, "hidden": true},
	{"data": "person_fullname", "title": tools_web.get_web_const( "c_fio", curLngWeb ), "type": "link", "sortable": true, "colorsource": "color", "width": "50%", "click": ("OPENURL={url}")},
	{"data": "course_name", "title": tools_web.get_web_const( "mak5wn2e6o", curLngWeb ), "type": "link", "sortable": true, "colorsource": "color", "width": "50%", "click": ("OPENURL={url_name}")}
	]);
} else {
	COLUMNS = ([
	{"data": "id", "title": "ID", "type": "string", "ghost": false, "hidden": true},
	{"data": "person_id", "title": "parent_id", "type": "string", "ghost": false, "hidden": true},
	{"data": "person_fullname", "title": tools_web.get_web_const( "c_fio", curLngWeb ), "type": "link", "sortable": true, "colorsource": "color", "minwidth": 210, "click": ("OPENURL={url}")},
	{"data": "course_name", "title": tools_web.get_web_const( "mak5wn2e6o", curLngWeb ), "type": "link", "sortable": true, "colorsource": "color", "minwidth": 220, "click": ("OPENURL={url_name}")},
	{"data": "state_id", "title": tools_web.get_web_const( "c_status", curLngWeb ), "type": "link", "sortable": true, "colorsource": "color", "width": 90, "click": ("OPENURL={url_status}")},
	{"data": "score", "title": tools_web.get_web_const( "c_score", curLngWeb ),"type": "string", "sortable": true, "colorsource": "color", "width": 80},
	{"data": "last_usage_date", "title": tools_web.get_web_const( "posesheno", curLngWeb ),"type": "string", "sortable": true, "colorsource": "color", "width": 130},
	{"data": "org_code", "title": "ИНН","type": "string", "sortable": true, "colorsource": "color", "width": 200},
	{"data": "org_name", "title": "Название организации","type": "string", "sortable": true, "colorsource": "color", "width": 220}
	]);
}

addLogMessage(loggerName, "[agent.id: " + agentId + "] AA was here!");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");