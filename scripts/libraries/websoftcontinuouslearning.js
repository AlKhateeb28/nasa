// ***********************************************************
function toLog(Msg, LogNamePrefix, bIsDebug)
{
	if (bIsDebug == undefined)
	{
		bIsDebug = global_settings.debug;
	}
	if (bIsDebug)
	{
		try
		{
			LogNamePrefix = LogName;
		} catch (err)
		{
		}

		if (LogNamePrefix == undefined || LogNamePrefix == null)
		{
			LogNamePrefix = "appl_websoftcontinuouslearning";
			try
			{
				objData;
				var curAppl = tools_app.get_application(objData.id);
			}
			catch (err)
			{
				var curAppl = tools_app.get_application("websoftcontinuouslearning");
			}
			if (curAppl != null)
			{
				LogNamePrefix = "appl_" + curAppl.code;
			}

			EnableLog(LogNamePrefix);
		}

		LogEvent(LogNamePrefix, Msg);
	}
}

// ***********************************************************
function optDate(dDateParam)
{
	var dResultDate = null
	try
	{
		var sDate = dDateParam
		if (StrContains(sDate, "T", true))
		{
			sDate = String(sDate).split("T")[0]
		}

		dResultDate = DateNewTime(ParseDate(sDate))
	}
	catch (ex)
	{
		//alert('optDate: '+ex)
	}
	return dResultDate
}

// ***********************************************************
function PostSaveSetting()
{
	_app = tools_app.get_cur_application();

	// Агент обновления статусов планов обучения

	//var sJSAgentFileURL = _app.wvars.ObtainChildByKey("reglament_agent_url").value;
	//var sJSAgentReglament = _app.wvars.ObtainChildByKey("agent_reglament").value;

	var sJSAgentFileURL = tools_app.get_cur_settings("reglament_agent_url", "app", _app.id.Value, null, null);
	var sJSAgentReglament = tools_app.get_cur_settings("agent_reglament", "app", _app.id.Value, null, null);
	var sJSAgentReglamentDay = OptInt(tools_app.get_cur_settings("agent_reglament_day", "app", _app.id.Value, null, null),0);
	var sJSAgentReglamentHour = OptInt(tools_app.get_cur_settings("agent_reglament_start_time", "app", _app.id.Value, null, null),0);

	if (sJSAgentFileURL != "")
	{
		var sCurAgentReq = "for $elem in server_agents where $elem/app_instance_id=" + CodeLiteral("0x" + StrHexInt(_app.id.Value)) + " and contains($elem/code, " + XQueryLiteral(_app.code.Value) + ") return $elem/Fields('id')";

		var curReq = ArrayOptFirstElem(tools.xquery(sCurAgentReq));
		if (curReq != undefined)
		{
			var docAgent = tools.open_doc(OptInt(curReq.id, 0));

			if (docAgent == undefined)
			{
				return;
			}
		}
		else
		{
			var docAgent = tools.new_doc_by_name("server_agent", false);
			docAgent.BindToDb();
			docAgent.TopElem.code = _app.code.Value + "_reglament";

		}

		sJSAgentFileURL = StrReplace(sJSAgentFileURL, "\\", "/");
		if (!StrContains(sJSAgentFileURL, "/"))
		{
			sJSAgentFileURL = "x-local://applications/" + _app.code + "/" + sJSAgentFileURL
		}

		docAgent.TopElem.name = "Агент обработки статусов и активностей планов обучения";
		docAgent.TopElem.exec_code.code_url = sJSAgentFileURL;
		docAgent.TopElem.doc_info.creation.app_instance_id = "0x" + StrHexInt(_app.id.Value);
		docAgent.TopElem.trigger_type = sJSAgentReglament;
		docAgent.TopElem.start_time = StrInt(sJSAgentReglamentHour,2) + ":00";
		docAgent.TopElem.block = "edu";
		switch (sJSAgentReglament)
		{
			case "period":
				docAgent.TopElem.period = 60;
				docAgent.TopElem.start_time = "00:00";
				docAgent.TopElem.finish_time = "24:00";
				docAgent.TopElem.all_day = true;
				break;
			case "weekly":
				docAgent.TopElem.start_week_day = sJSAgentReglamentDay;
				break;
		}

		docAgent.Save();
	}
}

// ***********************************************************
function FillObject(docObject, _dlg)
{

	var teObject = docObject.TopElem;

	var dispGroup = teObject.object_name.Value;
	var dispCompoundProgram = teObject.compound_program_id.OptForeignElem == undefined ? "" : teObject.compound_program_id.OptForeignElem.name;
	var curInstance = tools_app.get_cur_application_instance(null, null, teObject.id.Value, teObject);
	var curInstanceID = curInstance.id.Value;
	teObject.name = dispCompoundProgram + (dispGroup != "" ? " - " + dispGroup : "")

	curInstance.name = teObject.name.HasValue ? teObject.name.Value : teObject.object_name.Value
	curInstance.code = teObject.code.Value;
	curInstance.Doc.Save();

	var bUpdateType = tools_web.is_true(tools_app.get_cur_settings("update_status_and_activity", "instance", null, null, null, teObject.id.Value));

	docObject.TopElem.update_status_and_activity = bUpdateType;
	docObject.Save();

	// Чаты
	ProcessChatsByEducationPlan(docObject, _dlg)
}

function ProcessChatsByEducationPlan(docObject, _dlg)
{
	var teObject = docObject.TopElem;

	if (teObject.type.Value == "group" && teObject.compound_program_id.HasValue)
	{
		recalculate_chats(teObject.object_id.Value, teObject.compound_program_id.Value, OptInt(teObject.doc_info.creation.app_instance_id.Value));
	}
}

// ***********************************************************
function GroupDoAfterCreate(docObject, _dlg)
{
	docObject.TopElem.is_educ = true;
	docObject.Save();
}

// ***********************************************************
function GroupDoAfterSave(docObject, _dlg)
{

	var _app = tools_app.get_cur_application();

	var arrInstanceIDs = tools_app.get_application_ids(_app.id.Value);

	var strReq = "for $elem in education_plans where $elem/type='group' and $elem/state_id<2 and MatchSome($elem/app_instance_id, ('" + ArrayMerge(arrInstanceIDs, "'0x' + StrHexInt(This)", "','") + "')) and $elem/object_id=" + docObject.DocID + " return $elem";
	//strReq = "for $elem in education_plans where $elem/type='group' and $elem/state_id<2 and $elem/object_id=" + docObject.DocID + " return $elem";
	for (itemEducationPlan in XQuery(strReq))
	{
		recalculate_chats(itemEducationPlan.object_id.Value, itemEducationPlan.compound_program_id.Value, OptInt(itemEducationPlan.app_instance_id.Value));
	}
}

// ***********************************************************
function recalculate_chats(iGroupID, iCompoundProgramID, curInstanceID)
{
	docCompoundProgram = tools.open_doc(iCompoundProgramID)
	if (docCompoundProgram == undefined)
	{
		return;
	}

	var lectorStrReq = "for $elem in lectors where $elem/type='collaborator' and MatchSome($elem/id, (" + ArrayMerge(docCompoundProgram.TopElem.lectors, "XQueryLiteral(This.lector_id.Value)", ",") + ")) return $elem/Fields('person_id')";
	var arrCatPersonBase = ArrayExtract(XQuery(lectorStrReq), "This.person_id");
	var oRes, arrCatPerson, sFullName, hasStrReq, docConversation;
	var arrGrpPerson = [];
	var groupReq = "for $elem in group_collaborators where $elem/group_id=" + iGroupID + " return $elem/Fields('collaborator_id')";
	var xqGroupReq = ArrayExtract(XQuery(groupReq),"This.collaborator_id");
	for (itemFM in xqGroupReq)
	{
		arrCatPerson = [];
		oRes = null;
		iPersonID = OptInt(itemFM);
		oItemColl = ArrayOptFirstElem( XQuery("for $elem in collaborators where $elem/id=" + iPersonID + " return $elem/Fields('fullname')") );
		if (oItemColl == undefined)
			continue;
		arrCatPerson.push(iPersonID);
		arrGrpPerson.push(iPersonID);
		arrCatPerson = ArrayUnion(arrCatPersonBase, arrCatPerson);
		
		sFullName = oItemColl.fullname;

		hasStrReq = "for $elem in chats " +
			" where contains($elem/collaborators, '" + StrInt(iPersonID) + "') " +
			" and ForeignElem($elem/conversation_id)/format_id = 'chat'" +
			" and ForeignElem($elem/conversation_id)/app_instance_id = '0x" + StrHexInt(curInstanceID, 16) + "' " +
			" return $elem";

		xqChat = ArrayOptFirstElem(XQuery(hasStrReq));

		if (xqChat == undefined)
		{
			oRes = CallServerMethod(
				'tools',
				'call_code_library_method',
				[
					'libChat',
					'change_participants_conversation',
					[null, null, 'change', null, (arrCatPerson), null, null, null, null, sFullName + ". " + docCompoundProgram.TopElem.name.Value]
				]
			);
		}

		if (oRes != null && oRes.error != 1)
		{
			docConversation = tools.open_doc(oRes.doc_conversation.conversation.id);
			docConversation.TopElem.doc_info.creation.app_instance_id = "0x" + StrHexInt(curInstanceID, 16);
			docConversation.Save();

//			for (itemParticipant in docConversation.TopElem.participants)
//			{
//				docParticipant = tools.open_doc(itemParticipant.object_id.Value);
//				docParticipant.TopElem.doc_info.creation.app_instance_id = "0x" + StrHexInt(curInstanceID, 16);
//				docParticipant.Save();
//			}
		}
		else if (oRes != null)
		{
//			alert("Error in chat_lib: " + oRes.message);
		}

	}
	hasStrReq = "for $elem in chats " +
	" where contains($elem/collaborators, '" + StrInt(iPersonID) + "') " +
	" and ForeignElem($elem/conversation_id)/format_id = 'group'" +
	" and ForeignElem($elem/conversation_id)/app_instance_id = '0x" + StrHexInt(curInstanceID, 16) + "' " +
	" return $elem";

	xqChat = ArrayOptFirstElem(XQuery(hasStrReq));
	
	if (xqChat == undefined)
	{
		arrCatPerson = ArrayUnion(arrCatPersonBase, arrGrpPerson);
		oRes = CallServerMethod(
			'tools',
			'call_code_library_method',
			[
				'libChat',
				'change_participants_conversation',
				[null, null, 'change', null, (arrCatPerson), null, null, null, null, "Чат группы. " + docCompoundProgram.TopElem.name.Value]
			]
		);
		
		if (oRes != null && oRes.error != 1)
		{
			docConversation = tools.open_doc(oRes.doc_conversation.conversation.id);
			docConversation.TopElem.format_id = "group";
			docConversation.TopElem.doc_info.creation.app_instance_id = "0x" + StrHexInt(curInstanceID, 16);
			docConversation.Save();
		}
	}
}

function get_education_plan_type_name(sType)
{
	switch (sType)
	{
		case 'folder':
			return ms_tools.get_const('c_phase');
		case 'education_program':
			return ms_tools.get_const('c_edu_method');
		case 'education_method':
			return ms_tools.get_const('c_edu_method');
		case 'course':
			return ms_tools.get_const('c_course');
		case 'assessment':
			return ms_tools.get_const('c_test');
		case 'material':
			return 'Изучение материала';
		case 'learning_task':
			return ms_tools.get_const('zzzv3sxxx47yyy');
		case 'notification_template':
			return 'Рассылка информационного сообщения';
	}

	return "";
}

// ***********************************************************
function cast_EducationPlanProgram(fldProgram, oActivity, bClearParent)
{
	var stateDesc = common.education_learning_states.GetOptChildByKey(fldProgram.state_id.Value);
	var teObject = undefined;

	if (fldProgram.object_id.HasValue)
	{
		try
		{
			teObject = fldProgram.object_id.OptForeignElem;
		}
		catch (e)
		{ }
	}

	var sNameField = "name";
	if (teObject != undefined)
	{
		var fldObjectType = ArrayOptFind(common.exchange_object_types, "This.name.Value == teObject.Name");
		sNameField = fldObjectType != undefined ? fldObjectType.disp_name.Value : "name";
	}

	//toLog(fldProgram.name.Value + " (" + fldProgram.id.Value + "/" + fldProgram.type.Value + ") ---> " + (oActivity != null))
	switch (fldProgram.type.Value)
	{
		case "folder":
		case "education_method":
			{
				var sActivityURL = "";
				break;
			}
		case "material":
			{
				var sActivityURL = get_url(fldProgram.catalog_name.Value, fldProgram.object_id.Value);
				break;
			}
		default:
			{
				var sActivityURL = get_url(fldProgram.type.Value, fldProgram.object_id.Value);
				break;
			}
	}

	var sActivityName = "";
	var sActivityStatus = "";
	var sActivityStatusName = fldProgram.type.Value == 'folder' ? "" : "Не назначен";
	if (oActivity != null)
	{
		if (oActivity.url != "")
		{
			sActivityURL = oActivity.url;
		}
		sActivityName = oActivity.name;
		sActivityStatus = oActivity.status;
		sActivityStatusName = oActivity.status_name;
	}
	if (sActivityURL != "" && !StrBegins(sActivityURL, "/"))
	{
		sActivityURL = "/" + sActivityURL;
	}

	//toLog(fldProgram.name.Value + " (" + fldProgram.id.Value + "/" + fldProgram.type.Value + ") ---> " + sActivityURL)

	var bIsExpire = false;
	if (fldProgram.finish_date.HasValue)
	{
		bIsExpire = (Date() > fldProgram.finish_date.Value);
	}
	else if (fldProgram.plan_date.HasValue && fldProgram.type.Value != "folder")
	{
		bIsExpire = (Date() > DateOffset(fldProgram.plan_date.Value, 86400));
	}

	var objRet = {
		PrimaryKey: String(fldProgram.id.Value),
		id: String(fldProgram.id.Value),
		parent_id: (bClearParent ? "": String(fldProgram.parent_progpam_id.Value)),
		parent_progpam_id: (fldProgram.parent_progpam_id.HasValue ? fldProgram.parent_progpam_id.Value : ""),
		has_children: (fldProgram.type.Value == 'folder'),
		name: fldProgram.name.Value,
		type: fldProgram.type.Value,
		type_name: get_education_plan_type_name(fldProgram.type.Value),
		group_status: String(fldProgram.state_id.Value),
		status: cast_StatusCode(oActivity, fldProgram),
		status_name: cast_Status(oActivity, fldProgram),
		comment: fldProgram.comment.Value,
		object_catalog: fldProgram.catalog_name.Value,
		object_id: String(fldProgram.object_id.Value),
		object_name: (teObject != undefined ? teObject.Child(sNameField).Value : ""),
		activity_catalog: fldProgram.result_type.Value,
		activity_id: String(fldProgram.result_object_id.Value),
		activity_name: sActivityName,
		activity_url: sActivityURL,
		activity_status: sActivityStatus,
		create_date: fldProgram.create_date.Value,
		plan_date: fldProgram.plan_date.Value,
		plan_date_str: StrLongDate(fldProgram.plan_date.Value),
		finish_date: fldProgram.finish_date.Value,
		finish_date_str: StrLongDate(fldProgram.finish_date.Value),
		is_expire: bIsExpire,
		required: tools_web.is_true(fldProgram.required.Value),
		finished: (oActivity != null ? tools_web.is_true(oActivity.GetOptProperty('finished')) : 0),
		tasks: 0,
		passed: (oActivity != null ? tools_web.is_true(oActivity.GetOptProperty('passed')): 0),
		message: ""
	};

	return objRet;
}

// ***********************************************************
function cast_xqEvent(oPerson, xqEvent, xqItem)
{

	var objRet = {
		PrimaryKey: oPerson.person_id,
		type: "event",
		type_name: "Мероприятие",
		status: "",
		status_name: "Не назначено",
		id: oPerson.person_id,
		is_fill: false,
		name: "",
		person_name: oPerson.person_fullname,
		confirm: null
	};

	if (xqEvent != undefined)
	{
		var xqEventResult = ArrayOptFirstElem(XQuery("for $elem in event_results " +
			" where $elem/event_id=" + XQueryLiteral(xqEvent.event_id.Value) +
			" and $elem/person_id=" + XQueryLiteral(xqEvent.collaborator_id.Value) +
			" return $elem"))
		var bHasResult = (xqEventResult != undefined);

		objRet = {
			PrimaryKey: xqEvent.event_id.Value,
			type: "event",
			type_name: "Мероприятие",
			status: (xqItem != undefined ? xqItem.status : ""),
			status_name: (xqItem != undefined ? xqItem.status_name : "Не назначено"),
			id: xqEvent.event_id.Value,
			is_fill: true,
			name: xqEvent.name.Value,
			person_name: xqEvent.person_fullname.Value,
			confirm: (bHasResult ? (tools_web.is_true(xqEventResult.is_confirm.Value) ? "Да" : "Нет") : "")
		};
	}

	return objRet;
}

// ***********************************************************
function cast_LearningTask(oPerson, xqLearningTask, itemProgram)
{
	var objRet = {
		PrimaryKey: oPerson.person_id,
		type: "learning_task",
		type_name: "Задание",
		id: oPerson.person_id,
		is_fill: false,
		name: "",
		person_name: oPerson.person_fullname,
		status: null,
		status_name: "Не назначена",
		start_date: "",
	};

	if (xqLearningTask != undefined)
	{
		var oStatusName = ArrayOptFind(common.learning_task_status_types, "This.id == xqLearningTask.status_id.Value")

		objRet = {
			PrimaryKey: xqLearningTask.event_id.Value,
			type: "learning_task",
			type_name: "Задание",
			id: xqLearningTask.id.Value,
			is_fill: true,
			name: xqLearningTask.learning_task_name.Value,
			person_name: oPerson.person_fullname,
			status: xqLearningTask.status_id.Value,
			status_name: (oStatusName != undefined ? oStatusName.name.Value : "Не назначена"),
			start_date: StrLongDate(xqLearningTask.start_date.Value)
		};
	}
	else if (itemProgram != undefined)
	{
		objRet = {
			PrimaryKey: oPerson.person_id,
			type: "learning_task",
			type_name: "Задание",
			id: oPerson.person_id,
			is_fill: false,
			name: itemProgram.name.Value,
			person_name: oPerson.person_fullname,
			status: null,
			status_name: "Не назначена",
			start_date: "",
		};
	}

	return objRet;
}

// ***********************************************************
function cast_LibraryMaterial(oPerson, xqMaterialTask, itemProgram)
{
	var objRet = {
		PrimaryKey: oPerson.person_id,
		type: "library_material",
		type_name: "Материал библиотеки",
		id: oPerson.person_id,
		is_fill: false,
		name: "",
		person_name: oPerson.person_fullname,
		status: null,
		status_name: "Не назначен",
		start_date: "",
		type: null
	};

	if (xqMaterialTask != undefined)
	{
		var oStatusName = ArrayOptFind(common.viewing_states, "This.id == xqMaterialTask.state_id.Value")
		objRet = {
			PrimaryKey: xqMaterialTask.material_id.Value,
			type: "library_material",
			type_name: "Материал библиотеки",
			id: xqMaterialTask.material_id.Value,
			library_material_viewing_id: xqMaterialTask.id.Value,
			is_fill: true,
			name: xqMaterialTask.material_name.Value,
			person_name: oPerson.person_fullname,
			status: xqMaterialTask.state_id.Value,
			status_name: (oStatusName != undefined ? oStatusName.name.Value : "Не назначен"),
			start_date: StrLongDate(xqMaterialTask.start_viewing_date.Value),
			finish_date: StrLongDate(xqMaterialTask.finish_viewing_date.Value)
		};
	}
	else if (itemProgram != undefined)
	{
		objRet = {
			PrimaryKey: oPerson.person_id,
			type: "library_material",
			type_name: "Материал библиотеки",
			id: oPerson.person_id,
			is_fill: false,
			name: itemProgram.name.Value,
			person_name: oPerson.person_fullname,
			status: null,
			status_name: "Не назначен",
			start_date: "",
			type: null
		};
	}

	return objRet;
}

// ***********************************************************
function cast_Learn(oPerson, xqLearn, isActive, itemProgram)
{
	var objRet = {
		PrimaryKey: oPerson.person_id,
		type: "course",
		type_name: "Курсы",
		id: oPerson.person_id,
		is_fill: false,
		name: "",
		person_name: oPerson.person_fullname,
		status: null,
		status_name: "Не назначен",
		start_date: "",
		type: null
	};

	if (xqLearn != undefined)
	{
		var oStatusName = ArrayOptFind(common.learning_states, "This.id == xqLearn.state_id.Value")
		objRet = {
			PrimaryKey: xqLearn.id.Value,
			type: (isActive ? "active_learning" : "learning"),
			type_name: (isActive ? "Назавершенный курс" : "Завершенный курс"),
			id: xqLearn.id.Value,
			is_fill: true,
			name: xqLearn.course_name.Value,
			person_name: oPerson.person_fullname,
			status: xqLearn.state_id.Value,
			status_name: (oStatusName != undefined ? oStatusName.name.Value : "Не назначен"),
			start_date: StrLongDate(xqLearn.start_learning_date.Value),
			finish_date: StrLongDate(xqLearn.last_usage_date.Value)
		};
	}
	else if (itemProgram != undefined)
	{
		objRet = {
			PrimaryKey: oPerson.person_id,
			type: "course",
			type_name: "Курс",
			id: oPerson.person_id,
			is_fill: false,
			name: itemProgram.name.Value,
			person_name: oPerson.person_fullname,
			status: null,
			status_name: "Не назначен",
			start_date: "",
			type: null
		};
	}

	return objRet;
}

// ***********************************************************
function cast_Test(oPerson, xqTest, isActive, itemProgram)
{
	var objRet = {
		PrimaryKey: oPerson.person_id,
		type: "assessment",
		type_name: "Тесты",
		id: oPerson.person_id,
		is_fill: false,
		name: "",
		person_name: oPerson.person_fullname,
		status: null,
		status_name: "Не назначен",
		start_date: "",
		type: null
	};

	if (xqTest != undefined)
	{
		var oStatusName = ArrayOptFind(common.learning_states, "This.id == xqTest.state_id.Value")
		objRet = {
			PrimaryKey: xqTest.id.Value,
			type: (isActive ? "active_test_learning" : "test_learning"),
			type_name: (isActive ? "Назавершенный тест" : "Завершенный тест"),
			id: xqTest.id.Value,
			is_fill: true,
			name: xqTest.assessment_name.Value,
			person_name: oPerson.person_fullname,
			status: xqTest.state_id.Value,
			status_name: (oStatusName != undefined ? oStatusName.name.Value : "Не назначен"),
			start_date: StrLongDate(xqTest.start_learning_date.Value),
			finish_date: StrLongDate(xqTest.last_usage_date.Value)
		};
	}
	else if (itemProgram != undefined)
	{
		objRet = {
			PrimaryKey: oPerson.person_id,
			type: "assessment",
			type_name: "Тест",
			id: oPerson.person_id,
			is_fill: false,
			name: itemProgram.name.Value,
			person_name: oPerson.person_fullname,
			status: null,
			status_name: "Не назначен",
			start_date: "",
			type: null
		};
	}

	return objRet;
}

// ***********************************************************
function cast_Event(teEvent)
{
	objRet = {
		PrimaryKey: teEvent.id.Value,
		id: teEvent.id.Value,
		name: teEvent.name.Value,
		start_date: teEvent.start_date.Value,
		start_date_str: StrLongDate(teEvent.start_date.Value),
		start_time_str: StrTime(teEvent.start_date.Value),
		start_datetime_str: StrLongDate(teEvent.start_date.Value) + " " + StrTime(teEvent.start_date.Value),
		url: tools_web.get_mode_clean_url(null, teEvent.id.Value)
	};

	return objRet;
}

// ***********************************************************
function cast_Tutor(xqLector)
{
	objRet = {
		PrimaryKey: xqLector.person_id.Value,
		id: String(xqLector.person_id.Value),
		name: xqLector.lector_fullname.Value,
		image_url: tools_web.get_object_source_url('person', xqLector.person_id.Value, '200'),
		form_url: tools_web.get_mode_clean_url(null, xqLector.person_id.Value)
	};

	return objRet;
}

// ***********************************************************
// custom tutor link
function cast_Tutor_custom(xqLector)
{
	objRet = {
		PrimaryKey: xqLector.person_id.Value,
		id: String(xqLector.person_id.Value),
		name: xqLector.lector_fullname.Value,
		image_url: tools_web.get_object_source_url('person', xqLector.person_id.Value, '200'),
		form_url: '/tutor_collaborator?object_id=' + xqLector.person_id.Value
	};

	return objRet;
}

function cast_Status(oActivity, fldProgram)
{
	var iStateID = 0;
	if ( oActivity == null || oActivity.xq_object == undefined)
	{
		iStateID = 0;
	}
	else if ( !oActivity.finished )
	{
		if ( oActivity.GetOptProperty("started", true) )
		{
			iStateID = 1;
		}
		else
		{
			iStateID = 0;
		}
	}
	else if ( !oActivity.passed )
	{
		iStateID = 3;
	}
	else
	{
		iStateID = 4;
	}
	
	if(fldProgram != undefined && fldProgram.type == 'material')
	{
		if(oActivity != undefined)
		{
			iStateID = oActivity.status;
		}
	}
	
	switch (iStateID)
	{
		case 0:
			sStatus = "Не начат";
			break;
		case 1:
			sStatus = "В процессе";
			break;
		case 2:
		case 4:
		case 5:
			sStatus = "Изучен успешно";
			break;
		case 3:
			sStatus = "Изучен неуспешно";
			break;
		case 6:
			sStatus = "Отменен";
			break;
		default:
			sStatus = "Не начат";
			break;
	}
	return sStatus
}

function cast_StatusCode(oActivity, fldProgram)
{
	var iStateID = 0;
	if ( oActivity == null || oActivity.xq_object == undefined)
	{
		iStateID = 0;
	}
	else if ( !oActivity.finished )
	{
		iStateID = 1;
	}
	else if ( !oActivity.passed )
	{
		iStateID = 3;
	}
	else
	{
		iStateID = 4;
	}
	return iStateID;
}

// ***********************************************************
function get_url(sCatalog, iObjectID, oAddParam)
{
	if (OptInt(iObjectID) == undefined)
	{
		return "";
	}

	if (oAddParam == undefined || (oAddParam != undefined && !(DataType(oAddParam) == "object" && ObjectType(oAddParam) == "JsObject")))
	{
		oAddParam = null;
	}

	if (sCatalog == "" || sCatalog == null)
	{
		var objDoc = tools.open_doc(iObjectID);
		if (objDoc == undefined)
		{
			return "";
		}

		sCatalog = objDoc.TopElem.Name;
	}

	switch (sCatalog)
	{
		case "library_material":
		case "resource":
			{
				return tools_web.get_object_source_url("resource", iObjectID, { type: "library_material" });
			}
		case "active_test_learning":
			{
				if (oAddParam == null)
				{
					return tools_web.get_mode_clean_url("test_learning_proc", iObjectID);
				}
				else
				{
					return tools_web.get_mode_clean_url("test_learning_proc", iObjectID, oAddParam);
				}
			}
		case "test_learning":
			{
				if (oAddParam == null)
				{
					return tools_web.get_mode_clean_url("test_learning_stat", iObjectID);
				}
				else
				{
					return tools_web.get_mode_clean_url("test_learning_stat", iObjectID, oAddParam);
				}
			}
		case "active_learning":
			{
				if (oAddParam == null)
				{
					return tools_web.get_mode_clean_url("learning_proc", iObjectID);
				}
				else
				{
					return tools_web.get_mode_clean_url("learning_proc", iObjectID, oAddParam);
				}
			}
		case "learning":
			{
				if (oAddParam == null)
				{
					return tools_web.get_mode_clean_url("learning_stat", iObjectID);
				}
				else
				{
					return tools_web.get_mode_clean_url("learning_stat", iObjectID, oAddParam);
				}
			}
		case "document":
			{
				return tools_web.doc_link(iObjectID);
			}
		default:
			{
				return tools_web.get_mode_clean_url(null, iObjectID);
			}
	}

}

// ***********************************************************
function GetSheduledVebinarByPerson(iCompoundProgramID, iPersonID)
{
	var fldLastEducationPlan = get_education_plan_by_person(iCompoundProgramID, iPersonID);
	if (fldLastEducationPlan == null)
	{
		return {
			error: 1,
			errorMessage: StrReplace(StrReplace(
				"Не найдено плана оценки по модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
				"{PARAM1}", iCompoundProgramID), "{PARAM2}", iPersonID
			),
			result: []
		}
	}
	return GetSheduledVebinar(fldLastEducationPlan.id.Value)
}

// ***********************************************************
function GetSheduledVebinar(iEducationPlanID, teEducationPlan)
{
	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	var arrEducations = ArraySelect(teEducationPlan.programs, "This.type.Value == 'education_program' || This.type.Value == 'education_method'");

	var iEventTypeVebinarID = ArrayOptFirstElem(
		tools.xquery("for $elem in event_types " +
			" where $elem/code='webinar' " +
			" return $elem"),
		{ "id": 0 }
	).id;
	var sEducationIDs, arrCurVebinars;
	var strReq1, strReq2;
	var arrVebinarsCollection = [];

	for (itemEducation in arrEducations)
	{
		if (itemEducation.type.Value == 'education_program')
		{
			strReq1 = "for $elem in education_program_education_methods " +
				" where $elem/education_program_id=" + XQueryLiteral(itemEducation.education_program_id.Value) +
				" return $elem/Fields('education_method_id')";

			sEducationIDs = ArrayMerge(XQuery(strReq1), "This.education_method_id.Value", ",");
		}
		else
		{
			sEducationIDs = String(itemEducation.education_method_id.Value);
		}

		strReq2 = "for $elem in events " +
			" where $elem/event_type_id=" + XQueryLiteral(iEventTypeVebinarID) +
			" and $elem/start_date > date('" + DateNewTime(Date()) + "') " +
			" and MatchSome($elem/education_method_id, (" + sEducationIDs + ")) " +
			" order by $elem/start_date descending " +
			" return $elem";
		//toLog("Webinars strReq2: " + strReq2);
		arrCurVebinars = XQuery(strReq2);

		for (itemVebinar in arrCurVebinars)
		{
			arrVebinarsCollection.push(cast_Event(itemVebinar))
		}
	}

	oRet.result = ArraySort(arrVebinarsCollection, "This.start_date", "+");
	return oRet;
}

// ***********************************************************
function GetEducationPlanProgramsByParam(iCompoundProgramID, iPersonID, bReturnTree, iParentID, sReturnType)
{
	var bCheckCompleteActivity = false; // проверять также наличие завершенных активностей
	var fldLastEducationPlan = get_education_plan_by_person(iCompoundProgramID, iPersonID);
	if (fldLastEducationPlan == null)
	{
		return {
			error: 1,
			errorMessage: StrReplace(StrReplace(
				"Не найдено плана оценки по модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
				"{PARAM1}", iCompoundProgramID), "{PARAM2}", iPersonID
			),
			result: []
		}
	}

	return GetEducationPlanPrograms(fldLastEducationPlan.id.Value, null, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity);
}

// ***********************************************************
function GetEducationPlanProgramsByParamCustom(iCompoundProgramID, iPersonID, bReturnTree, iParentID, sReturnType)
{
	var bCheckCompleteActivity = false; // проверять также наличие завершенных активностей
	var fldLastEducationPlan = get_education_plan_by_person(iCompoundProgramID, iPersonID);
	if (fldLastEducationPlan == null)
	{
		return {
			error: 1,
			errorMessage: StrReplace(StrReplace(
				"Не найдено плана оценки по модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
				"{PARAM1}", iCompoundProgramID), "{PARAM2}", iPersonID
			),
			result: []
		}
	}

	return GetEducationPlanProgramsCustom(fldLastEducationPlan.id.Value, null, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity);
	// return GetEducationPlanPrograms(fldLastEducationPlan.id.Value, null, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity);
}
// ***********************************************************
function get_education_plan_by_person(iObjectID, iPersonID)
{
	docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		throw StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
	}
	if (docObject.TopElem.Name == 'compound_program')
	{
		var sGroupsIds = ArrayMerge(
			XQuery("for $elem in group_collaborators " +
				" where $elem/collaborator_id=" + XQueryLiteral(iPersonID) +
				" return $elem/Fields('group_id')"),
			"This.group_id.Value", ",");

		var xqEducationPlans = XQuery("for $elem in education_plans " +
			" where $elem/compound_program_id=" + XQueryLiteral(iObjectID) +
			" and MatchSome($elem/object_id, (" + sGroupsIds + ")) " +
			" order by $elem/create_date descending " +
			" return $elem");

		var xqLastEducationPlan =
			ArrayOptFirstElem(xqEducationPlans) != undefined
				? ArrayMax(xqEducationPlans, "This.create_date.Value")
				: null;
	}
	else if (docObject.TopElem.Name == 'education_plan')
	{
		var xqLastEducationPlan = ArrayOptFirstElem(XQuery("for $elem in education_plans " +
			" where $elem/id=" + XQueryLiteral(iObjectID) +
			" order by $elem/create_date descending " +
			" return $elem"));
		if (xqLastEducationPlan == undefined)
		{
			xqLastEducationPlan = null;
		}
	}

	return xqLastEducationPlan;
}

// ***********************************************************
function filterActivity(fldObject, sReturnType, bReturnTree, arrParentIDs)
{
	switch (sReturnType)
	{
		case "activity":
			{
				var bIsActivity = (
					fldObject.type.Value != 'folder'
					&& fldObject.type.Value != 'notification_template'
					&& fldObject.type.Value != 'material'
				);

				var bIsActivityMaterial = (
					fldObject.type.Value == 'material'
					&&
					ArrayOptFind(
						['blog', 'poll', 'document', 'resource', 'forum', 'chat'],
						'This == fldObject.catalog_name.Value') == undefined
				);

				var bIsParent = true;
				if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined)
				{
					bIsParent = (ArrayOptFind(arrParentIDs, "fldObject.parent_progpam_id.Value == This") != undefined);
				}

				return bIsParent && (bIsActivity || bIsActivityMaterial);
			}
		case "stage":
			{
				if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined)
				{
					var bIsParent = (
						fldObject.parent_progpam_id.HasValue
						&& ArrayOptFind(arrParentIDs, "fldObject.parent_progpam_id.Value == This") != undefined
					);
				}
				else
				{
					var bIsParent = !fldObject.parent_progpam_id.HasValue
				}

				return (fldObject.type.Value == 'folder' || bReturnTree) && bIsParent && fldObject.type.Value != 'notification_template';
			}
		case "all":
			{
				return (fldObject.type.Value != 'notification_template');
			}
	}
}

// ***********************************************************
function checkFilter(itemProgram, oFilter)
{
	var bFilterDateGood, dFilter_date_start, dFilter_date_end;

	if (oFilter == undefined)
	{
		return true;
	}
	
	dFilter_date_start = optDate(oFilter.filter_date_start);
	dFilter_date_end = optDate(oFilter.filter_date_end);

	if (itemProgram.type == "education_method" && oFilter.filter_show_education_method == false)
	{
		return false;
	}
	else if (itemProgram.type == "course" && oFilter.filter_show_course == false)
	{
		return false;
	}
	else if (itemProgram.type == "assessment" && oFilter.filter_show_assessment == false)
	{
		return false;
	}
	else if (itemProgram.type == "material" && oFilter.filter_show_material == false)
	{
		return false;
	}
	else if (itemProgram.type == "learning_task" && oFilter.filter_show_learning_task == false)
	{
		return false;
	}
	else if (itemProgram.type == "notification_template" && oFilter.filter_show_notification_template == false)
	{
		return false;
	}

	if (
		itemProgram.type != "folder"
		&&
		(dFilter_date_start != null || dFilter_date_end != null)
	)
	{
		bFilterDateGood = false;

		dProgram_date_start = null;
		dProgram_date_end = null;

		if (itemProgram.plan_date.HasValue)
		{
			dProgram_date_start = DateNewTime(itemProgram.plan_date);
		}
		else if (itemProgram.create_date.HasValue)
		{
			dProgram_date_start = DateNewTime(itemProgram.create_date);
		}
		if (itemProgram.finish_date.HasValue)
		{
			dProgram_date_end = DateNewTime(itemProgram.finish_date);
		}

		if (dProgram_date_start == null && dProgram_date_end == null)
		{
			bFilterDateGood = false;
		}
		else if (dProgram_date_start != null || dProgram_date_end != null)
		{
			if (dProgram_date_start != null && dProgram_date_end != null)
			{
				if (dFilter_date_start != null && dFilter_date_end != null)
				{
					if (
						dProgram_date_start >= dFilter_date_start
						&& dProgram_date_start <= dFilter_date_end
						&& dProgram_date_end >= dFilter_date_start
						&& dProgram_date_end >= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
					else if (
						dProgram_date_start <= dFilter_date_start
						&& dProgram_date_start <= dFilter_date_end
						&& dProgram_date_end >= dFilter_date_start
						&& dProgram_date_end >= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
					else if (
						dProgram_date_start <= dFilter_date_start
						&& dProgram_date_start <= dFilter_date_end
						&& dProgram_date_end >= dFilter_date_start
						&& dProgram_date_end <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
					else if (
						dProgram_date_start >= dFilter_date_start
						&& dProgram_date_start <= dFilter_date_end
						&& dProgram_date_end >= dFilter_date_start
						&& dProgram_date_end <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start != null && dFilter_date_end == null)
				{
					if (
						dProgram_date_start >= dFilter_date_start
						|| dProgram_date_end >= dFilter_date_start
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start == null && dFilter_date_end != null)
				{
					if (
						dProgram_date_start <= dFilter_date_end
						|| dProgram_date_end <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
			}
			else if (dProgram_date_start != null && dProgram_date_end == null)
			{
				if (dFilter_date_start != null && dFilter_date_end != null)
				{
					if (
						dProgram_date_start >= dFilter_date_start
						&& dProgram_date_start <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start != null && dFilter_date_end == null)
				{
					if (
						dProgram_date_start >= dFilter_date_start
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start == null && dFilter_date_end != null)
				{
					if (
						dProgram_date_start <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
			}
			else if (dProgram_date_start == null && dProgram_date_end != null)
			{
				// Такого не может быть
				if (dFilter_date_start != null && dFilter_date_end != null)
				{
					if (
						dProgram_date_end >= dFilter_date_start
						&& dProgram_date_end <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start != null && dFilter_date_end == null)
				{
					if (
						dProgram_date_end >= dFilter_date_start
					)
					{
						bFilterDateGood = true;
					}
				}
				else if (dFilter_date_start == null && dFilter_date_end != null)
				{
					if (
						dProgram_date_end <= dFilter_date_end
					)
					{
						bFilterDateGood = true;
					}
				}
			}
		}

		if (bFilterDateGood == false)
		{
			return false;
		}
	}

	return true;
}

// ***********************************************************
function GetEducationPlanPrograms(
	iEducationPlanID, teEducationPlan, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity, oFilter
)
{

	function fnRecursion(iParentIDRec, array)
	{
		array.push(iParentIDRec);

		for (itemNodes in ArraySelect(teEducationPlan.programs, "This.parent_progpam_id.Value == OptInt(iParentIDRec)"))
		{

			if (itemNodes.type.Value == 'folder')
			{
				array.push(itemNodes.id.Value);
				fnRecursion(itemNodes.id.Value, array);
			}
		}
	}

	if (sReturnType == null || sReturnType == undefined || sReturnType == "")
	{
		sReturnType = "activity";
	}
	bReturnTree = tools_web.is_true(bReturnTree);

	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	if (oFilter == undefined)
	{
		switch(sReturnType)
		{
			case "activity":
			{
				var bClearParent = true
				break;
			}
			case "stage":
			{
				var bClearParent = true
				break;
			}
			case "all":
			{
				var bClearParent = false
				break;
			}
			default:
			{
				var bClearParent = false
			}
		}
		var arrParentIDs = [iParentID];
		if(bReturnTree && iParentID != undefined && iParentID != null && iParentID != "")
		{
			fnRecursion(OptInt(iParentID), arrParentIDs);
			
			arrParentIDs =  ArraySelectDistinct(arrParentIDs);
		}
		
		var arrParentIDActive = ArrayExtract(ArraySelect(arrParentIDs, "OptInt(This) != undefined"), "OptInt(This)");
		var arrProgramCollection = ArraySelect(teEducationPlan.programs, "filterActivity(This, sReturnType, bReturnTree, arrParentIDActive)");
		var oActivity, sUrl;
		for(itemProgram in arrProgramCollection)
		{
			oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
			oRet.result.push(cast_EducationPlanProgram(itemProgram, oActivity, bClearParent && (itemProgram.parent_progpam_id.Value == OptInt(iParentID))));
		}
		
		oRet.result = FuncStampPassed( oRet.result, (sReturnType != "stage" ? null : teEducationPlan), iPersonID );
	}
	else
	{
		var oActivity, sUrl;

		for (itemProgram in teEducationPlan.programs)
		{
			if (checkFilter(itemProgram, oFilter) == false)
			{
				continue;
			}
			
			oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
			oRet.result.push(
				cast_EducationPlanProgram(itemProgram, oActivity)
			);
		}
		// toLog("oRet: " + EncodeJson(oRet))
	}
	return oRet;
}

// ***********************************************************
function GetEducationPlanProgramsCustom(
	iEducationPlanID, teEducationPlan, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity, oFilter
)
{

	function fnRecursion(iParentIDRec, array)
	{
		array.push(iParentIDRec);

		for (itemNodes in ArraySelect(teEducationPlan.programs, "This.parent_progpam_id.Value == OptInt(iParentIDRec)"))
		{

			if (itemNodes.type.Value == 'folder')
			{
				array.push(itemNodes.id.Value);
				fnRecursion(itemNodes.id.Value, array);
			}
		}
	}

	if (sReturnType == null || sReturnType == undefined || sReturnType == "")
	{
		sReturnType = "activity";
	}
	bReturnTree = tools_web.is_true(bReturnTree);

	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	if (oFilter == undefined)
	{
		switch(sReturnType)
		{
			case "activity":
			{
				var bClearParent = true
				break;
			}
			case "stage":
			{
				var bClearParent = true
				break;
			}
			case "all":
			{
				var bClearParent = false
				break;
			}
			default:
			{
				var bClearParent = false
			}
		}
		var arrParentIDs = [iParentID];
		if(bReturnTree && iParentID != undefined && iParentID != null && iParentID != "")
		{
			fnRecursion(OptInt(iParentID), arrParentIDs);
			
			arrParentIDs =  ArraySelectDistinct(arrParentIDs);
		}
		
		var arrParentIDActive = ArrayExtract(ArraySelect(arrParentIDs, "OptInt(This) != undefined"), "OptInt(This)");
		var arrProgramCollection = ArraySelect(teEducationPlan.programs, "filterActivity(This, sReturnType, bReturnTree, arrParentIDActive)");
		var oActivity, sUrl;
		for(itemProgram in arrProgramCollection)
		{
			oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
			oRet.result.push(cast_EducationPlanProgram(itemProgram, oActivity, bClearParent && (itemProgram.parent_progpam_id.Value == OptInt(iParentID))));
		}
		// oRet.result = FuncStampPassed( oRet.result, (sReturnType != "stage" && sReturnType != "notification_template" ? null : teEducationPlan), iPersonID );
		oRet.result = FuncStampPassedCustom( oRet.result, (sReturnType != "stage" && sReturnType != "notification_template" ? null : teEducationPlan), iPersonID );
	}
	else
	{
		var oActivity, sUrl;

		for (itemProgram in teEducationPlan.programs)
		{
			if (checkFilter(itemProgram, oFilter) == false)
			{
				continue;
			}
			
			oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
			oRet.result.push(
				cast_EducationPlanProgram(itemProgram, oActivity)
			);
		}
		// toLog("oRet: " + EncodeJson(oRet))
	}
	return oRet;
}

function FuncStampPassed(oRetParam, tePlan, iPersonID)
{
	try 
	{
		_cur_id = OptInt(GetActualModule(null, iPersonID, tePlan, true).id,0);
	}
	catch (_no_actual)
	{
		_cur_id = 0;
	}
	if (tePlan==null)
	{
		for (_oObj in oRetParam)
		{
			_aObjs = ArraySelect(oRetParam, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			_aFldrs = ArraySelect(oRetParam, "This.type == 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			for (_fldr in _aFldrs)
			{
				_aObjs = ArrayUnion(_aObjs, ArraySelect(oRetParam, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
			}
			_oObj.tasks = ArrayCount(_aObjs);
			_oObj.finished = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('finished'))"));
			_oObj.passed = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('passed'))"));
			_oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
		}
	}
	else
	{
		for (_oObj in oRetParam)
		{
			_aObjs = ArraySelect(tePlan.programs, "(This.type != 'folder' && This.type != 'notification_template') && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			_aFldrs = ArraySelect(tePlan.programs, "(This.type == 'folder' || This.type == 'notification_template') && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			for (_fldr in _aFldrs)
			{
				_aObjs = ArrayUnion(_aObjs, ArraySelect(tePlan.programs, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
			}
			_oObj.tasks = ArrayCount(_aObjs);
			if (_oObj.tasks>0)
			{
				_aActs = ArrayExtract(_aObjs, "get_activity_by_task(tePlan, tePlan, This, iPersonID, true)");

				_oObj.finished = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && (This.xq_object != undefined || (This.catalog == 'document' || This.catalog == 'blog' || This.catalog == 'library_material' || This.catalog == 'poll' || This.catalog == 'resource' || This.catalog == 'forum' || This.catalog == 'chat')) && tools_web.is_true(This.GetOptProperty('finished'))")))/Real(_oObj.tasks),2);
				_oObj.passed = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && (This.xq_object != undefined || (This.catalog == 'document' || This.catalog == 'blog' || This.catalog == 'library_material' || This.catalog == 'poll' || This.catalog == 'resource' || This.catalog == 'forum' || This.catalog == 'chat')) && tools_web.is_true(This.GetOptProperty('passed'))")))/Real(_oObj.tasks),2);
			}
			else
			{
				_oObj.finished = 0;
				_oObj.passed = 0;
			}
			_oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
		}
	}
	return oRetParam;
}

function FuncStampPassedCustom(oRetParam, tePlan, iPersonID)
{
	try 
	{
		_cur_id = OptInt(GetActualModule(null, iPersonID, tePlan, true).id,0);
	}
	catch (_no_actual)
	{
		_cur_id = 0;
	}
	if (tePlan==null)
	{
		for (_oObj in oRetParam)
		{
			_aObjs = ArraySelect(oRetParam, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			_aFldrs = ArraySelect(oRetParam, "This.type == 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			for (_fldr in _aFldrs)
			{
				_aObjs = ArrayUnion(_aObjs, ArraySelect(oRetParam, "This.type != 'folder' && This.type != 'notification_template' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
			}
			_oObj.tasks = ArrayCount(_aObjs);
			_oObj.finished = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('finished'))"));
			_oObj.passed = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('passed'))"));
			_oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
		}
	}
	else
	{
		for (_oObj in oRetParam)
		{
			_aObjs = ArraySelect(tePlan.programs, "This.type != 'folder' && This.type != 'notification_template' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			_aFldrs = ArraySelect(tePlan.programs, "This.type == 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
			for (_fldr in _aFldrs)
			{
				_aObjs = ArrayUnion(_aObjs, ArraySelect(tePlan.programs, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
			}
			_oObj.tasks = ArrayCount(_aObjs);
			if (_oObj.tasks>0)
			{
				_aActs = ArrayExtract(_aObjs, "get_activity_by_task(tePlan, tePlan, This, iPersonID, true)");
				_oObj.finished = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && This.xq_object != undefined && tools_web.is_true(This.GetOptProperty('finished'))")))/Real(_oObj.tasks),2);
				_oObj.passed = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && This.xq_object != undefined && tools_web.is_true(This.GetOptProperty('passed'))")))/Real(_oObj.tasks),2);
			}
			else
			{
				_oObj.finished = 0;
				_oObj.passed = 0;
			}
			_oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
		}
	}
	return oRetParam;
}

// ***********************************************************
function GetEducationPlanTutors(iObjectIDParam)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	iObjectID = OptInt(iObjectIDParam);
	if (iObjectID == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM1}]", "{PARAM1}", iObjectIDParam);
		return oRet;
	}

	var docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
		return oRet;
	}

	if (docObject.TopElem.Name == 'education_plan')
	{
		var docCompoundProgram = tools.open_doc(docObject.TopElem.compound_program_id.Value);
		if (docCompoundProgram == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace(
				"В плане оценки с ID [{PARAM1}] отсутствует ссылка на модульную программу", "{PARAM1}",
				iObjectID
			);
			return oRet;
		}
		var teCompoundProgram = docCompoundProgram.TopElem;

	}
	else if (docObject.TopElem.Name == 'compound_program')
	{
		var teCompoundProgram = docObject.TopElem;
	}
	else
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace(
			"Переданный ID не является ID плана оценки или модульной программы [{PARAM1}]", "{PARAM1}",
			iObjectID
		);
		return oRet;
	}

	var strReq = "for $elem in lectors " +
		" where MatchSome($elem/id, (" + ArrayMerge(teCompoundProgram.lectors, "This.lector_id", ",") + ")) " +
		" return $elem";
	for (itemLector in XQuery(strReq))
	{
		oRet.result.push(cast_Tutor(itemLector));
	}

	return oRet;
}

// custom GetEducationPlanTutors
function GetEducationPlanTutorsCustom(iObjectIDParam, iUserIDParam)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	iObjectID = OptInt(iObjectIDParam);
	if (iObjectID == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM1}]", "{PARAM1}", iObjectIDParam);
		return oRet;
	}

	var docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
		return oRet;
	}


	if (docObject.TopElem.Name == 'education_plan')
	{
		var docCompoundProgram = tools.open_doc(docObject.TopElem.compound_program_id.Value);
		if (docCompoundProgram == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace(
				"В плане оценки с ID [{PARAM1}] отсутствует ссылка на модульную программу", "{PARAM1}",
				iObjectID
			);
			return oRet;
		}
		var teCompoundProgram = docCompoundProgram.TopElem;

	}
	else if (docObject.TopElem.Name == 'compound_program')
	{
		var teCompoundProgram = docObject.TopElem;
	}
	else
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace(
			"Переданный ID не является ID плана оценки или модульной программы [{PARAM1}]", "{PARAM1}",
			iObjectID
		);
		return oRet;
	}
    var docUser;
	var bModProgFCK = StrContains(teCompoundProgram.code.Value, 'ModProg_FCK', true);
    var sFactRegionID = "";
    if (bModProgFCK)
    {
        iUserID = OptInt(iUserIDParam);
        if (iUserID == undefined)
        {
            oRet.error = 1;
            oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM2}]", "{PARAM2}", iUserIDParam);
            return oRet;
        }
        docUser = tools.open_doc(iUserID);
        if (docUser == undefined)
        {
            oRet.error = 1;
            oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM2}]", "{PARAM2}", iUserID);
            return oRet;
        }
        try {
            docOrg = tools.open_doc(docUser.TopElem.org_id.Value)
            sFactRegionID = docOrg.TopElem.custom_elems.ObtainChildByKey('fact_region_id').value
        } catch(e) { }
        if (sFactRegionID == "") {
            sFactRegionID = docUser.TopElem.region_id.Value
        }
    }
	
    var strReq = "sql: \
        SELECT \
            lecs.* \
        FROM \
            lectors lecs " + (bModProgFCK && sFactRegionID != "" ? " \
            JOIN lector lec ON lec.id = lecs.id \
            JOIN collaborators cols ON cols.id = lecs.person_id \
            JOIN org o ON cols.org_id = o.id " : "") + " \
        WHERE \
            lecs.id IN ("  + ArrayMerge(teCompoundProgram.lectors, "This.lector_id", ",") + ") " + (bModProgFCK && sFactRegionID != "" ? ("\
            AND TRY_CONVERT(BIGINT, o.data.value('(/org/custom_elems/custom_elem[name=\"fact_region_id\"]/value)[1]', 'VARCHAR(22)')) = " + sFactRegionID + " \
            AND lec.data.value('(/lector/custom_elems/custom_elem[name=\"type_trener\"]/value)[1]', 'NVARCHAR(20)') = 'Тренер РЦК'") : "") + " \
    ";
	for (itemLector in XQuery(strReq))
	{
		oRet.result.push(cast_Tutor_custom(itemLector));
	}

	return oRet;
}

// ***********************************************************
function GetProgramActivitys(iEducationPlanID, teEducationPlan, iProgramID)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	var itemProgram = ArrayOptFind(teEducationPlan.programs, "This.id.Value == iProgramID");
	var xqItem, xqItem_bis, sReqItem;
	for (itemPerson in get_education_plan_auditoris(teEducationPlan))
	{
		switch (itemProgram.type.Value)
		{
			case "education_program":
				{
					//education_program_id
					//object_id нету
					break;
				}
			case "education_method":
				{
					if (itemProgram.education_method_id.OptForeignElem != undefined && itemProgram.education_method_id.OptForeignElem.type == "course" && itemProgram.education_method_id.OptForeignElem.course_id.HasValue)
					{
						_course_id = itemProgram.education_method_id.OptForeignElem.course_id;
						xqItem = get_activity(
							"active_learning",
							_course_id.Value,
							itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
						).xq_object;
						if (xqItem != undefined)
						{
							oRet.result.push(cast_Learn(itemPerson, xqItem, true));
						}

						xqItem_bis = get_activity(
							"learning",
							_course_id.Value,
							itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
						).xq_object;
						if (xqItem_bis != undefined)
						{
							oRet.result.push(cast_Learn(itemPerson, xqItem_bis, false));
						}

						if (xqItem == undefined && xqItem_bis == undefined)
						{
							oRet.result.push(cast_Learn(itemPerson, undefined, false));
						}
					}
					else
					{
						xqItem = get_activity(
							"event_collaborator",
							itemProgram.education_method_id.Value,
							itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
						).xq_object;
					}
					oRet.result.push(cast_xqEvent(itemPerson, xqItem))

					break;
				}
			case "course":
				{
					xqItem = get_activity(
						"active_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem != undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, xqItem, true));
					}

					xqItem_bis = get_activity(
						"learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem_bis != undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, xqItem_bis, false));
					}

					if (xqItem == undefined && xqItem_bis == undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, undefined, false));
					}
					break;
				}
			case "assessment":
				{
					xqItem = get_activity(
						"active_test_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem != undefined)
					{
						oRet.result.push(cast_Test(itemPerson, xqItem, true));
					}

					xqItem_bis = get_activity(
						"test_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem_bis != undefined)
					{
						oRet.result.push(cast_Test(itemPerson, xqItem_bis, false));
					}

					if (xqItem == undefined && xqItem_bis == undefined)
					{
						oRet.result.push(cast_Test(itemPerson, undefined, false));
					}
					break;
				}
			case "material":
				{
					switch (itemProgram.catalog_name.Value)
					{
						case "library_material":
							{
								xqItem = get_activity(
									"library_material_viewing",
									itemProgram.object_id.Value,
									itemPerson.person_id,
									iEducationPlanID,
									teEducationPlan.create_date.Value
								).xq_object;

								oRet.result.push(cast_LibraryMaterial(itemPerson, xqItem))
								break;
							}
						default:
							{
								oRet.error = 1;
								oRet.errorMessage = StrReplace(
									"Необслуживаемый тип учебного материала: [{PARAM1}]", "{PARAM1}",
									itemProgram.catalog_name.Value
								);
								return oRet;
							}
					}

					break;
				}
			case "learning_task":
				{
					xqItem = get_activity(
						"learning_task_result",
						itemProgram.object_id.Value, itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;

					oRet.result.push(cast_LearningTask(itemPerson, xqItem))

					break;
				}
			case "notification_template":
				{
					break;
				}
			default:
				{
//					oRet.error = 1;
//					oRet.errorMessage = StrReplace("Необслуживаемый тип задачи: [{PARAM1}]", "{PARAM1}", itemProgram.type.Value);
//					return oRet;
				}
		}
	}
	return oRet;
}

// ***********************************************************
function GetAccessMarathon(iObjectID, iPersonID)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		result: 0,
	};

	docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
		return oRet;
	}
	;

	if (docObject.TopElem.Name == 'compound_program')
	{
		var sGroupsIds = ArrayMerge(
			XQuery("for $elem in group_collaborators " +
				" where $elem/collaborator_id=" + XQueryLiteral(iPersonID) +
				" return $elem/Fields('group_id')"),
			"This.group_id.Value", ",");

		var xqEducationPlans = XQuery("for $elem in education_plans " +
			" where $elem/compound_program_id=" + XQueryLiteral(iObjectID) +
			" and MatchSome($elem/object_id, (" + sGroupsIds + ")) " +
			" return $elem");

		oRet.result = (ArrayOptFirstElem(xqEducationPlans) != undefined) ? 1 : 0;
	}
	else if (docObject.TopElem.Name == 'education_plan')
	{
		var xqLastEducationPlan = ArrayOptFirstElem(XQuery("for $elem in education_plans " +
			" where $elem/id=" + XQueryLiteral(iObjectID) +
			" return $elem"));
		if (xqLastEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно найли в каталоге план обучения с ID [{PARAM1}]", "{PARAM1}", iObjectID);
			return oRet;
		}
		;
		oRet.result = (ArrayOptFirstElem(XQuery("for $elem in group_collaborators " +
			" where $elem/collaborator_id=" + XQueryLiteral(iPersonID) +
			" and $elem/group_id=" + XQueryLiteral(xqLastEducationPlan.object_id.Value) +
			" return $elem")) != undefined) ? 1 : 0;
	}
	return oRet;
}

// ***********************************************************
function GetStatisticRec(iObjectID, iPersonID, iProgramIDparam)
{
	var bCheckCompleteActivity = false;

	var oRet = {
		error: 0,
		errorMessage: "",
		result: {
			access: false,
			count: 0,
			finished_count: 0,
			finished_procent: 0.0,
			passed_count: 0,
			passed_procent: 0.0
		}
	}

	var iProgramID;
	try
	{
		iProgramID = OptInt(iProgramIDparam);
	}
	catch(_dersl)
	{
		iProgramID = undefined;
	}
	
	var fldEducationPlan = get_education_plan_by_person(iObjectID, iPersonID);
	if (fldEducationPlan == null)
	{
		oRet.error = 2;
		oRet.errorMessage = StrReplace(StrReplace(
			"Не найдено плана оценки по модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
			"{PARAM1}", iObjectID), "{PARAM2}", iPersonID);
		return oRet;
	}

	oRet.access = true;

	var teEducationPlan = tools.open_doc(fldEducationPlan.id.Value).TopElem;
	
	var xqItem;
	var aPrograms = [];
	
	function get_hier_prgs(iParent)
	{
		aTmp = ArraySelect(teEducationPlan.programs, "This.parent_progpam_id == " + iParent);
		if (ArrayCount(aTmp)>0)
		{
			aPrograms = ArrayUnion(aPrograms, aTmp);
			for (_vrem in aTmp)
			{
				get_hier_prgs(_vrem.id);
			}
		}
	}
	
	if (iProgramID == undefined)
	{
		aPrograms = teEducationPlan.programs;
	}
	else
	{
		itemTask = ArrayOptFind(teEducationPlan.programs, "This.id == " + iProgramID);
		if (itemTask!=undefined)
		{
			aPrograms = ArrayUnion(aPrograms, itemTask);
			get_hier_prgs( iProgramID );
		}
	}

	for (itemTask in ArraySelect(aPrograms, "filterActivity(This, 'activity')"))
	{
		xqItem = get_activity_by_task(fldEducationPlan.id.Value, teEducationPlan, itemTask, iPersonID, bCheckCompleteActivity)
		if (xqItem == null || xqItem == undefined)
		{
			continue;
		}
		oRet.result.count++;
		if (tools_web.is_true(xqItem.GetOptProperty('finished')))
		{
			oRet.result.finished_count++;
		}
		if (tools_web.is_true(xqItem.GetOptProperty('passed')))
		{
			oRet.result.passed_count++;
		}
	}
	if (oRet.result.count > 0)
	{
		oRet.result.finished_procent = Real(oRet.result.finished_count) * 100.0 / Real(oRet.result.count);
	}
	if (oRet.result.count > 0)
	{
		oRet.result.passed_procent = Real(oRet.result.passed_count) * 100.0 / Real(oRet.result.count);
	}

	oRet.result.count = StrInt(oRet.result.count);
	oRet.result.finished_count = StrInt(oRet.result.finished_count);
	oRet.result.passed_count = StrInt(oRet.result.passed_count);
	oRet.result.finished_procent = StrReal(oRet.result.finished_procent, 1);
	oRet.result.passed_procent = StrReal(oRet.result.passed_procent, 1);

	return oRet;
}

// ***********************************************************
function GetActualModule(iObjectID, iPersonID, tePlan, id_only)
{
	try
	{
		is_plan = tePlan.Name == "education_plan";
	}
	catch(_noPlan_)
	{
		is_plan = false;
	}
	try
	{
		_flag_id = id_only == true;
	}
	catch(_noPlan_)
	{
		_flag_id = false;
	}
	var teEducationPlan = undefined;
	try
	{
		if ( !is_plan )
		{
			var xqLastEducationPlan = get_education_plan_by_person(iObjectID, iPersonID);
			if (xqLastEducationPlan == null)
			{
				throw StrReplace(StrReplace(
					"Не найдено плана оценки по плану оценки/модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
					"{PARAM1}", iObjectID), "{PARAM2}", iPersonID);
			}

			var docEducationPlan = tools.open_doc(xqLastEducationPlan.id.Value);
			if (docEducationPlan == undefined)
			{
				throw StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", xqLastEducationPlan.id.Value);
			}

			teEducationPlan = docEducationPlan.TopElem;
		}
		else
		{
			teEducationPlan = tePlan
		}

		var fldActualModule = ArrayOptFind(
			teEducationPlan.programs,
			" !This.parent_progpam_id.HasValue " +
			" && " +
			" (This.plan_date.HasValue && This.plan_date.Value <= Date()) && (This.finish_date.HasValue && This.finish_date.Value >= Date())"
		);

		if (fldActualModule == undefined)
		{
			fldActualModule = ArrayOptFirstElem(ArraySort(
				ArraySelect(teEducationPlan.programs, "!This.parent_progpam_id.HasValue"),
				"This.plan_date.Value", "+"));
		}
		
		var oRet = [{
			id: String(fldActualModule.id.Value),
			name: fldActualModule.name.Value,
			plan_date_str: StrLongDate(fldActualModule.plan_date.Value),
			finish_date_str: StrLongDate(fldActualModule.finish_date.Value),
			comment: fldActualModule.comment.Value
		}];

		if (!_flag_id)
		{
			oRet = FuncStampPassed(oRet, teEducationPlan, iPersonID);
		}
		
		return ArrayOptFirstElem(oRet);

	}
	catch (err)
	{
		toLog("ERROR: GetActualModule: iObjectID: [" + iObjectID + "], iPersonID: [" + iPersonID + "], " + err);
		return {
			id: 0,
			name: "",
			plan_date_str: "",
			finish_date_str: "",
			comment: ""
		}
	}
}

// ***********************************************************
function GetPersonalConversationURL(iObjectIDParam, iPersonID)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		url: ""
	}

	var iObjectID = OptInt(iObjectIDParam);
	if (iObjectID == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM1}]", "{PARAM1}", iObjectIDParam);
		return oRet;
	}

	var docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
		return oRet;
	}
	if (docObject.TopElem.Name == 'application')
	{
		var arrApplicationIDs = tools_app.get_application_ids(iObjectID);
	}
	else if (docObject.TopElem.Name == 'application_instance')
	{
		var arrApplicationIDs = tools_app.get_application_ids(docObject.TopElem.application_id.Value);
	}
	else if (docObject.TopElem.doc_info.creation.app_instance_id.HasValue)
	{
		var docApplication = tools.open_doc(OptInt(docObject.TopElem.doc_info.creation.app_instance_id.Value))
		if (docApplication == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace(StrReplace("В объекте [ID: {PARAM1}] указан некорректный ID привязки: [{PARAM2}]", "{PARAM1}", iObjectID), "{PARAM2}", docObject.TopElem.doc_info.creation.app_instance_id.Value);
			return oRet;
		}

		if (docObject.TopElem.Name == 'application')
		{
			var arrApplicationIDs = tools_app.get_application_ids(OptInt(docObject.TopElem.doc_info.creation.app_instance_id.Value));
		}
		else if (docObject.TopElem.Name == 'application_instance')
		{
			var arrApplicationIDs = tools_app.get_application_ids(docApplication.TopElem.application_id.Value);
		}
		else
		{
			var arrApplicationIDs = tools_app.get_application_ids("websoftcontinuouslearning");
		}

	}

	var arrChats = XQuery("for $elem in chats where contains($elem/collaborators, " + XQueryLiteral(String(iPersonID)) + ") and ForeignElem($elem/conversation_id)/format_id = 'chat' return $elem/Fields('conversation_id')");

	var arrConversationIDs = ArrayExtract(ArraySelectDistinct(arrChats, "This.conversation_id"), "OptInt(This.conversation_id)");

	//var sConversationIDs = ArrayMerge(arrConversationIDs, "This", ",");
	//var arrConversationAll = XQuery("for $elem in conversations where MatchSome($elem/id,(" + sConversationIDs + ")) return $elem");

	var cursorDate = Date("01.01.1900");
	var iResultID;
	for (itemConversationID in arrConversationIDs)
	{
		docConversation = tools.open_doc(itemConversationID)
		if (docConversation != undefined && ArrayOptFind(arrApplicationIDs, "This == OptInt(docConversation.TopElem.doc_info.creation.app_instance_id)") != undefined)
		{
			if (docConversation.TopElem.doc_info.modification.date > cursorDate)
			{
				cursorDate = Date(docConversation.TopElem.doc_info.modification.date);
				iResultID = itemConversationID;
			}
		}
	}
	oRet.url = (iResultID == undefined) ? "/vchat/index.html#/" : "/vchat/index.html#/conversation/" + String(iResultID);

	return oRet;
}

function GetGroupConversationURL(iObjectIDParam, iPersonID)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		url: ""
	}

	var iObjectID = OptInt(iObjectIDParam);
	if (iObjectID == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM1}]", "{PARAM1}", iObjectIDParam);
		return oRet;
	}

	var docObject = tools.open_doc(iObjectID);
	if (docObject == undefined)
	{
		oRet.error = 1;
		oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
		return oRet;
	}
	if (docObject.TopElem.Name == 'application')
	{
		var arrApplicationIDs = tools_app.get_application_ids(iObjectID);
	}
	else if (docObject.TopElem.Name == 'application_instance')
	{
		var arrApplicationIDs = tools_app.get_application_ids(docObject.TopElem.application_id.Value);
	}
	else if (docObject.TopElem.doc_info.creation.app_instance_id.HasValue)
	{
		var docApplication = tools.open_doc(OptInt(docObject.TopElem.doc_info.creation.app_instance_id.Value))
		if (docApplication == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace(StrReplace("В объекте [ID: {PARAM1}] указан некорректный ID привязки: [{PARAM2}]", "{PARAM1}", iObjectID), "{PARAM2}", docObject.TopElem.doc_info.creation.app_instance_id.Value);
			return oRet;
		}

		if (docObject.TopElem.Name == 'application')
		{
			var arrApplicationIDs = tools_app.get_application_ids(OptInt(docObject.TopElem.doc_info.creation.app_instance_id.Value));
		}
		else if (docObject.TopElem.Name == 'application_instance')
		{
			var arrApplicationIDs = tools_app.get_application_ids(docApplication.TopElem.application_id.Value);
		}
		else
		{
			var arrApplicationIDs = tools_app.get_application_ids("websoftcontinuouslearning");
		}

	}

	var arrChats = XQuery("for $elem in chats where contains($elem/collaborators, " + XQueryLiteral(String(iPersonID)) + ") and ForeignElem($elem/conversation_id)/format_id = 'group' return $elem/Fields('conversation_id')");

	var arrConversationIDs = ArrayExtract(ArraySelectDistinct(arrChats, "This.conversation_id"), "OptInt(This.conversation_id)");

	//var sConversationIDs = ArrayMerge(arrConversationIDs, "This", ",");
	//var arrConversationAll = XQuery("for $elem in conversations where MatchSome($elem/id,(" + sConversationIDs + ")) return $elem");

	var cursorDate = Date("01.01.1900");
	var iResultID;
	for (itemConversationID in arrConversationIDs)
	{
		docConversation = tools.open_doc(itemConversationID)
		if (docConversation != undefined && ArrayOptFind(arrApplicationIDs, "This == OptInt(docConversation.TopElem.doc_info.creation.app_instance_id)") != undefined)
		{
			if (docConversation.TopElem.doc_info.modification.date > cursorDate)
			{
				cursorDate = Date(docConversation.TopElem.doc_info.modification.date);
				iResultID = itemConversationID;
			}
		}
	}
	oRet.url = (iResultID == undefined) ? "/_wt/conversations" : "/_wt/conversations/conversation_id/" + String(iResultID);

	return oRet;
}

// ***********************************************************
function GetProgramCommand(iObjectID, iPersonID, sJSONItemProgram)
{
	var bConstFilterByEducationPlan = false;
	var oRet = {
		error: 0,
		errorMessage: "",
		result: ""
	}

	try
	{
		if (sJSONItemProgram == "" || !(StrBegins(sJSONItemProgram, "[") || StrBegins(sJSONItemProgram, "{")))
		{
			throw StrReplace("Передан не JSON-объект: [{PARAM1}]", "{PARAM1}", sJSONItemProgram);
		}

		var oItemProgram = ParseJson(sJSONItemProgram);

		//var iProgramID = OptInt(iProgramIDParam);
		var iProgramID = OptInt(oItemProgram.id);

		if (iProgramID == undefined)
		{
			throw StrReplace("ID задачи плана не является целым числом: [{PARAM1}]", "{PARAM1}", iProgramIDParam);
		}

		var xqLastEducationPlan = get_education_plan_by_person(iObjectID, iPersonID);
		if (xqLastEducationPlan == null)
		{
			throw StrReplace(StrReplace(
				"Не найдено плана оценки по плану оценки/модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
				"{PARAM1}", iObjectID), "{PARAM2}", iPersonID);
		}

		var docEducationPlan = tools.open_doc(xqLastEducationPlan.id.Value);
		if (docEducationPlan == undefined)
		{
			throw StrReplace(
				"Невозможно открыть план обучения с ID {PARAM1}",
				"{PARAM1}", xqLastEducationPlan.id.Value);
		}

		var teEducationPlan = docEducationPlan.TopElem;

		var sFilterByEducationPlan =
			bConstFilterByEducationPlan
				&& OptInt(xqLastEducationPlan.id.Value) != undefined
				? "$elem/education_plan_id=" + XQueryLiteral(xqLastEducationPlan.id.Value) + " and "
				: "";

		var dStartDate = OptDate(teEducationPlan.create_date.Value);
		var sFilterByStartDate =
			(dStartDate == undefined)
				? ""
				: "$elem/[{PARAM}]>=" + XQueryLiteral(DateNewTime(dStartDate)) + " and ";

		var fldCurrentTask = teEducationPlan.programs.GetOptChildByKey(iProgramID);

		if (fldCurrentTask == undefined)
		{
			throw StrReplace(StrReplace(
				"В плане обучения ID [{PARAM2}] не найдена задача с ID: [{PARAM1}]",
				"{PARAM1}", iProgramID), "{PARAM2}", xqLastEducationPlan.id.Value);
		}

		switch (fldCurrentTask.type.Value)
		{
			case "folder":
				{
					return oRet;
				}
			case "education_method":
				{
					sReqItem = "for $elem in event_collaborators " +
						" where " + sFilterByEducationPlan + StrReplace(sFilterByStartDate, "[{PARAM}]", "start_date") +
						" $elem/education_method_id=" + XQueryLiteral(fldCurrentTask.education_method_id.Value) +
						" and $elem/collaborator_id=" + XQueryLiteral(iPersonID) +
						" return $elem";
					//toLog(sReqItem)
					xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_date.Value", "-"));

					if (xqItem == undefined)
					{
						return null;
					}

					var sUrl = get_url("event", xqItem.event_id.Value);

					oRet.result = { "command": "new_window", "url": sUrl };
					return oRet;
				}
			case "learning_task":
				{
					sReqItem = "for $elem in learning_task_results " +
						" where " + sFilterByEducationPlan + StrReplace(sFilterByStartDate, "[{PARAM}]", "start_date") +
						" $elem/learning_task_id=" + XQueryLiteral(fldCurrentTask.object_id.Value) +
						" and $elem/person_id=" + XQueryLiteral(iPersonID) +
						" return $elem";
					//toLog(sReqItem)
					xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_date.Value", "-"));
					if (xqItem == undefined)
					{
						var docObject = tools.open_doc(fldCurrentTask.object_id.Value);

						if (docObject != undefined)
						{
							var docLearningTaskResult = tools_knlg.activate_learning_task(
								{
									person_id: iPersonID,
									learning_task_id: fldCurrentTask.object_id.Value,
									plan_start_date: docObject.TopElem.start_date,
									plan_end_date: docObject.TopElem.finish_date,
									start_task: true,
									expert_id:
										(docObject.TopElem.experts.ChildNum > 0
											? ArrayOptFirstElem(ArraySort(docObject.TopElem.experts, "Random( 1, 999 )", "-")).person_id
											: null)
								}).doc_learning_task_result;

							docLearningTaskResult.TopElem.education_plan_id = xqLastEducationPlan.id.Value;
							docLearningTaskResult.TopElem.doc_info.creation.app_instance_id = teEducationPlan.doc_info.creation.app_instance_id;
							docLearningTaskResult.Save();

							var sUrl = get_url("learning_task", docLearningTaskResult.DocID);
						}
						else
						{
							var sUrl = "";
						}
					}
					else
					{
						var sUrl = get_url("learning_task", xqItem.id.Value);
					}

					oRet.result = { "command": "new_window", "url": sUrl };
					return oRet;
				}
			case "course":
				{
					if (fldCurrentTask.state_id.Value > 1)
					{
						var sUrl = get_url("course", fldCurrentTask.object_id.Value);
					}
					else
					{
						var newLearning = tools.activate_course_to_person({
							"iPersonID": iPersonID,
							"iCourseID": fldCurrentTask.object_id.Value,
							"iEducationPlanID": xqLastEducationPlan.id.Value
						});

						var iLearningID = OptInt(newLearning);

						if (iLearningID != undefined)
						{
							var sUrl = get_url("active_learning", iLearningID, { course: fldCurrentTask.object_id.Value });
						}
						else
						{
							newLearning.TopElem.education_plan_id = xqLastEducationPlan.id.Value;
							newLearning.TopElem.doc_info.creation.app_instance_id = teEducationPlan.doc_info.creation.app_instance_id;
							newLearning.Save();
							var sUrl = get_url("active_learning", newLearning.DocID, { course: fldCurrentTask.object_id.Value });
						}
					}

					oRet.result = { "command": "new_window", "url": sUrl };
					return oRet;
				}
			case "assessment":
				{
					if ( teEducationPlan.state_id == 1 && fldCurrentTask.state_id.Value == 4 && fldCurrentTask.object_id.OptForeignElem.is_open )
					{
						fldCurrentTask.state_id = 1;
					}
					if (fldCurrentTask.state_id.Value > 1)
					{
						var sUrl = get_url("assessment", fldCurrentTask.object_id.Value);
					}
					else
					{
						var newTest = tools.activate_test_to_person({
							"iPersonID": iPersonID,
							"iAssessmentID": fldCurrentTask.object_id.Value,
							"iEducationPlanID": xqLastEducationPlan.id.Value
						});

						var iTestID = OptInt(newTest);

						if (iTestID != undefined)
						{
							var sUrl = get_url("active_test_learning", iTestID, { assessmemt: fldCurrentTask.object_id.Value });
						}
						else
						{
							newTest.TopElem.education_plan_id = xqLastEducationPlan.id.Value;
							newTest.TopElem.doc_info.creation.app_instance_id = teEducationPlan.doc_info.creation.app_instance_id;
							newTest.Save();
							var sUrl = get_url("active_test_learning", newTest.DocID, { assessmemt: fldCurrentTask.object_id.Value });
						}
					}

					oRet.result = { "command": "new_window", "url": sUrl };
					return oRet;
				}
			case "material":
				{
					switch (fldCurrentTask.catalog_name.Value)
					{
						case "document":
						case "resource":
							{
								var catDocView = ArrayOptFirstElem(XQuery("for $elem in object_datas " +
									" where $elem/object_id = " + XQueryLiteral(xqLastEducationPlan.id.Value) + 
									" and $elem/sec_object_id=" + iPersonID +
									" and $elem/code = " + iProgramID +
									" return $elem/Fields('id')"));
									
								if (catDocView == undefined)
								{
									var docObjectDoc = OpenNewDoc("x-local://wtv/wtv_object_data.xmd");
									docObjectDoc.BindToDb(DefaultDb);
									docObjectDoc.TopElem.object_id = xqLastEducationPlan.id.Value;
									docObjectDoc.TopElem.sec_object_id = iPersonID;
									docObjectDoc.TopElem.code = iProgramID;
									docObjectDoc.TopElem.create_date = Date();
									docObjectDoc.TopElem.start_date = Date();
									docObjectDoc.TopElem.status_id = "close";
									docObjectDoc.TopElem.data_str = "" + fldCurrentTask.object_id.Value;
									docObjectDoc.TopElem.doc_info.creation.app_instance_id = teEducationPlan.doc_info.creation.app_instance_id;
									docObjectDoc.Save();
								}
								
								oRet.result = {
									"command": "new_window",
									"url": get_url(fldCurrentTask.catalog_name.Value, fldCurrentTask.object_id.Value)
								};
								return oRet;
							}
						case "library_material":
							{
								var catLibView = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings " +
									" where " + sFilterByEducationPlan + StrReplace(sFilterByStartDate, "[{PARAM}]", "start_viewing_date") +
									" $elem/person_id=" + iPersonID +
									" and $elem/material_id = " + fldCurrentTask.object_id.Value +
									" and $elem/state_id != 'finished' " +
									" order by $elem/modification_date descending " +
									" return $elem/Fields('id')"));
									
								if ( catLibView == undefined )
								{
									catLibView = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings " +
										" where " + StrReplace(sFilterByStartDate, "[{PARAM}]", "start_viewing_date") +
										" $elem/person_id=" + iPersonID +
										" and $elem/material_id = " + fldCurrentTask.object_id.Value +
										" and $elem/state_id != 'finished' " +
										" order by $elem/modification_date descending " +
										" return $elem/Fields('id')"));
								}

								if (catLibView == undefined)
								{
									var contextObjectDoc = OpenNewDoc("x-local://wtv/wtv_library_material_viewing.xmd");
									contextObjectDoc.BindToDb(DefaultDb);
									var contextObject = contextObjectDoc.TopElem;
									contextObject.material_id = fldCurrentTask.object_id.Value;
									contextObject.material_name = fldCurrentTask.object_name.Value;
									contextObject.person_id = iPersonID;
									contextObject.start_viewing_date = Date();
									tools.common_filling("collaborator", contextObject, iPersonID);
									contextObject.education_plan_id = xqLastEducationPlan.id.Value;
									contextObject.doc_info.creation.app_instance_id = teEducationPlan.doc_info.creation.app_instance_id;
									contextObjectDoc.Save();
								}

								oRet.result = {
									"command": "new_window",
									"url": get_url(fldCurrentTask.catalog_name.Value, fldCurrentTask.object_id.Value)
								};
								return oRet;
							}
						case "poll":
							{
								var catLibView = ArrayOptFirstElem(XQuery("for $elem in poll_results " +
									" where $elem/person_id=" + iPersonID + StrReplace(sFilterByStartDate, "[{PARAM}]", "create_date") +
									" and $elem/poll_id = " + fldCurrentTask.object_id.Value +
									" and $elem/is_done != true() and $elem/status < 2 " +
									" order by $elem/modification_date descending " +
									" return $elem/Fields('id')"));
								if ( catLibView == undefined )
								{
									var contextObjectDoc = tools.activate_poll_to_person( iPersonID, fldCurrentTask.object_id.Value, null, xqLastEducationPlan.id.Value );
									catLibView = contextObjectDoc.TopElem;
								}

								oRet.result = {
									"command": "new_window",
									"url": get_url( fldCurrentTask.catalog_name.Value, catLibView.id.Value )
								};
								return oRet;
							}
						default:
							{
								throw StrReplace(
									"Необрабатываемый тип учебного материала: [{PARAM1}]",
									"{PARAM1}", fldCurrentTask.catalog_name.Value
								);
							}
					}
				}
			default:
				{
					throw StrReplace("Необрабатываемый тип задачи: [{PARAM1}]", "{PARAM1}", fldCurrentTask.type.Value);
				}
		}

	}
	catch (err)
	{
		oRet.error = 1;
		oRet.errorMessage = "ERROR: GetProgramCommand:\r\niObjectID: [" + iObjectID + "],\r\n" +
			"iPersonID: [" + iPersonID + "],\r\n" +
			"iProgramID: [" + iProgramID + "],\r\n" + err;
		return oRet;
	}

}

// ***********************************************************
function get_education_plan_auditoris(teEducationPlan)
{
	var result = [];

	if (teEducationPlan.type.Value == 'group')
	{
		result = ArrayExtract(
			XQuery("for $elem in group_collaborators " +
				" where $elem/group_id=" + teEducationPlan.object_id.Value +
				" return $elem"),
			"({ " +
			" 		'person_id': This.collaborator_id.Value, " +
			" 		'person_fullname': This.collaborator_fullname.Value " +
			" })"
		);
	}
	else
	{
		result.push({
			'person_id': teEducationPlan.person_id.Value,
			'person_fullname': teEducationPlan.person_fullname.Value
		})
	}

	return result;
}

// ***********************************************************
function get_activity_by_task(iEducationPlanID, teEducationPlan, Task, iPersonID, bCheckCompleteActivity)
{

	bCheckCompleteActivity = tools_web.is_true(bCheckCompleteActivity);

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			throw "Не передана информация о плане обучения";
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			throw StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
		}

		teEducationPlan = docEducationPlan.TopElem;
	}

	var fldTask = OptInt(Task) != undefined ? ArrayOptFind(teEducationPlan.programs, "This.id.Value == Task") : Task;
	if (fldTask == undefined)
	{
		throw StrReplace(
			StrReplace(
				"В плане обучения ID [{PARAM1}] не найдено задачи с ID [{PARAM2}]", "{PARAM1}", iEducationPlanID
			),
			"{PARAM2}",
			Task
		);
	}

	if (ObjectType(fldTask) != 'XmElem')
	{
		throw "Переданный аргумент Task не является элементом программы обучения или ID такого элемента: " +
		"\r\n" + tools.object_to_text(fldTask, "json");
	}

	var xqItem = null;
	var xqItem_bis = null
	var sReqItem, sReqItem_bis;

	switch (fldTask.type.Value)
	{
		case "education_method":
			{
				xqItem = get_activity(
					"event_collaborator", fldTask.education_method_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
				);

				if (xqItem.xq_object == undefined)
				{
					return null;
				}

				xqItem.url = get_url("event", xqItem.xq_object.event_id.Value);
				return xqItem;
			}
		case "course":
			{
				xqItem = get_activity("active_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

				if (xqItem.xq_object != undefined)
				{
					xqItem.url = get_url("active_learning", xqItem.xq_object.id.Value);
					return xqItem;
				}
				else
				{
					xqItem_bis = get_activity("learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
					if (xqItem_bis.xq_object != undefined)
					{
						xqItem_bis.url = bCheckCompleteActivity ? "" : get_url("learning", xqItem_bis.xq_object.id.Value);
						return xqItem_bis;
					}
					else
					{
						return null;
					}
				}
			}
		case "assessment":
			{
				xqItem = get_activity("active_test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

				if (xqItem.xq_object != undefined)
				{
					xqItem.url = get_url("active_test_learning", xqItem.xq_object.id.Value);
					return xqItem;
				}
				else
				{
					xqItem_bis = get_activity("test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
					if ( xqItem_bis.xq_object != undefined && !xqItem_bis.passed && fldTask.object_id.OptForeignElem.is_open )
					{
//						var newTest = tools.activate_test_to_person({
//							"iPersonID": iPersonID,
//							"iAssessmentID": fldTask.object_id.Value,
//							"iEducationPlanID": iEducationPlanID
//						});

						xqItem_bis.url = get_url("assessment", fldTask.object_id.Value);
						fldTask.result_object_id.Clear();
						return xqItem_bis;
					}
					else if (xqItem_bis.xq_object != undefined)
					{
						xqItem_bis.url = bCheckCompleteActivity ? "" : get_url("test_learning", xqItem_bis.xq_object.id.Value);
						return xqItem_bis;
					}
					else
					{
						return null;
					}
				}
			}
		case "material":
			{
				switch (fldTask.catalog_name.Value)
				{
					case "document":
					case "resource":
						{	
							xqItem = get_activity(
								"object_data", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
							);

							if (xqItem.xq_object == undefined)
							{
								var stateDesc = ArrayOptFind(common.education_learning_states, 'This.id == ' + OptInt(fldTask.state_id.Value));
							
								xqItem = {
									"catalog": "resource",
									"url": get_url(fldTask.catalog_name.Value, fldTask.object_id.Value),
									"name": fldTask.name.Value,
									"status": fldTask.state_id.Value,
									"status_name": (stateDesc != undefined ? stateDesc.name.Value : "Не назначено"),
									"xq_object": undefined,
									"finished": (fldTask.state_id.Value > 1),
									"passed": (fldTask.state_id.Value == 4 || fldTask.state_id.Value == 2 || fldTask.state_id.Value == 5)
								};
							}
							else
							{
								stateDesc = common.education_learning_states.GetOptChildByKey(5);
								xqItem.url = get_url(fldTask.catalog_name.Value, fldTask.object_id.Value);
								xqItem.name = fldTask.name.Value;
								xqItem.status = 5;
								xqItem.status_name = (stateDesc != undefined ? stateDesc.name.Value : "");
							}
							return xqItem;
						}
					case "library_material":
						{
							xqItem = get_activity(
								"library_material_viewing", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
							);

							if (xqItem.xq_object == undefined)
							{
								return null;
							}

							xqItem.url = get_url("library_material", xqItem.xq_object.material_id.Value);
							//toLog(xqItem.name + " (" + fldTask.id.Value + ") ---> " + xqItem.url)
							return xqItem;
						}
					case "poll":
						{
							xqItem = get_activity(
								"poll_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
							);

							if (xqItem.xq_object == undefined)
							{
								return null;
							}

							xqItem.url = get_url("poll_result", xqItem.xq_object.id.Value);
							//toLog(xqItem.name + " (" + fldTask.id.Value + ") ---> " + xqItem.url)
							return xqItem;
						}
					default:
						{
							throw StrReplace("Необслуживаемый тип учебного материала: [{PARAM1}]", "{PARAM1}", fldTask.catalog_name.Value);
						}
				}

				break;
			}
		case "learning_task":
			{
				xqItem = get_activity("learning_task_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

				if (xqItem.xq_object == undefined)
				{
					return null;
				}

				xqItem.url = get_url("learning_task", xqItem.xq_object.learning_task_id.Value);
				return xqItem;
			}
		case "folder":
			{
				return null;
			}
		case "notification_template":
			{
				return null;
			}
		default:
			{
				throw StrReplace("Необслуживаемый тип задачи: [{PARAM1}]", "{PARAM1}", fldTask.type.Value);
			}
	}
}

// ***********************************************************
function get_activity(catalog, object_id, person_id, education_plan_id, start_date)
{
	var bConstFilterByEducationPlan = false
	var sFilterByEducationPlan =
		bConstFilterByEducationPlan && OptInt(education_plan_id) != undefined
			? " $elem/education_plan_id=" + XQueryLiteral(education_plan_id) + " and "
			: "";

	// var dStartDate = OptDate(start_date);
	// var sFilterByStartDate = (dStartDate == undefined) ? "" : "$elem/[{PARAM}]>=" + XQueryLiteral(DateNewTime(dStartDate)) + " and ";

	var xqItem, sReqItem;
	var oRetObject = {
		"catalog": "",
		"url": "",
		"name": "",
		"status": "",
		"status_name": "Не назначался",
		"xq_object": undefined,
		"started": false,
		"finished": false,
		"passed": false
	};
	switch (catalog)
	{
		case "event_collaborator":
			{
				sReqItem = "for $elem in event_collaborators where " + sFilterByEducationPlan +
//					" where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
					" $elem/education_method_id=" + XQueryLiteral(object_id) +
					" and $elem/collaborator_id=" + XQueryLiteral(person_id) +
					" return $elem";
				xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_date.Value", "-"));
				//toLog(sReqItem)

				var bIsAssist =
					xqItem != undefined
						? tools_web.is_true(
							ArrayOptFirstElem(
								XQuery("for $elem in event_results " +
									" where $elem/event_id=" + XQueryLiteral(xqItem.event_id.Value) +
									" and $elem/person_id=" + XQueryLiteral(person_id) +
									" return $elem/Fields('is_assist')"),
								{ is_assist: false }
							).is_assist)
						: false;

				oRetObject.catalog = "event_collaborator";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.name.Value;
					oRetObject.status = xqItem.status_id.Value;
					oRetObject.started = (xqItem.start_date.HasValue && xqItem.start_date >= Date());
					oRetObject.finished = (xqItem.status_id.Value == 'close');
					oRetObject.passed = (xqItem.status_id.Value == 'close' && bIsAssist);
					if (xqItem.status_id.HasValue)
					{
						var fldStatus = xqItem.status_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
			// Custom checking learnings before program
		case "active_learning":
		case "learning":
			{
				var docCourse = tools.open_doc(object_id);
				var teCourse;
				if (docCourse != undefined)
				{
					teCourse = docCourse.TopElem;
				}
				sReqItem = "sql: \
							select top 1 l.* \
							from \
								learnings l \
								join courses c ON c.id = l.course_id \
							where \
								l.person_id = " + XQueryLiteral(person_id) + " \
								and " + (teCourse != undefined ? ("(l.code = '" + teCourse.code.Value + "' or c.code = '" + teCourse.code.Value + "')") : ("l.education_plan_id = " + XQueryLiteral(education_plan_id))) + " \
								and l.course_id = " + XQueryLiteral(object_id) + " \
							order by \
								l.state_id asc, \
								l.last_usage_date desc \
							";
				//toLog(sReqItem)
				oRetObject.catalog = "learning";
				xqItem = ArrayOptFirstElem(XQuery(sReqItem));
				if (xqItem == undefined)
				{
					oRetObject.catalog = "active_learning";
					xqItem = ArrayOptFirstElem(XQuery(StrReplace(sReqItem, 'learning', 'active_learning')));
				}

				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.course_name.Value;
					oRetObject.status = xqItem.state_id.Value;
					oRetObject.started = (xqItem.state_id.Value > 0);
					oRetObject.finished = (xqItem.state_id.Value > 1);
					oRetObject.passed = (xqItem.state_id.Value == 4 || xqItem.state_id.Value == 2);
					if (xqItem.state_id.HasValue)
					{
						var fldStatus = xqItem.state_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
		case "active_test_learning":
			{
				sReqItem = "for $elem in active_test_learnings " +
					" where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
					" and $elem/assessment_id = " + XQueryLiteral(object_id) +
					" and $elem/person_id=" + XQueryLiteral(person_id) +
					" return $elem";
				xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_usage_date.Value", "-"));

				oRetObject.catalog = "active_test_learning";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.assessment_name.Value;
					oRetObject.status = xqItem.state_id.Value;
					oRetObject.started = (xqItem.state_id.Value > 0);
					oRetObject.finished = (xqItem.state_id.Value > 1);
					oRetObject.passed = (xqItem.state_id.Value == 4);
					if (xqItem.state_id.HasValue)
					{
						var fldStatus = xqItem.state_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;

			}
		case "test_learning":
			{
				sReqItem = "for $elem in test_learnings " +
					" where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
					" and $elem/assessment_id = " + XQueryLiteral(object_id) +
					" and $elem/person_id=" + XQueryLiteral(person_id) +
					" return $elem";
				//toLog(sReqItem)
				xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_usage_date.Value", "-"));

				oRetObject.catalog = "test_learning";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.assessment_name.Value;
					oRetObject.status = xqItem.state_id.Value;
					oRetObject.started = (xqItem.state_id.Value > 0);
					oRetObject.finished = (xqItem.state_id.Value > 1);
					oRetObject.passed = (xqItem.state_id.Value == 4);
					if (xqItem.state_id.HasValue)
					{
						var fldStatus = xqItem.state_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
		case "library_material_viewing":
			{
				sReqItem = "for $elem in library_material_viewings " +
					" where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
					" and $elem/material_id=" + XQueryLiteral(object_id) +
					" and $elem/person_id=" + XQueryLiteral(person_id) +
					" order by $elem/last_viewing_date descending return $elem";

				//toLog(sReqItem)

				xqItem = ArrayOptFirstElem( XQuery( sReqItem ) );
				
				if (xqItem == undefined)
				{
					sReqItem = "for $elem in library_material_viewings " +
						" where $elem/material_id=" + XQueryLiteral(object_id) +
						" and $elem/person_id=" + XQueryLiteral(person_id) +
						" order by $elem/last_viewing_date descending return $elem";

					//toLog(sReqItem)

					xqItem = ArrayOptFirstElem( XQuery( sReqItem ) );
				}

				oRetObject.catalog = "library_material_viewing";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.material_name.Value;
					oRetObject.status = xqItem.state_id.Value;
					oRetObject.started = (xqItem.state_id.Value != 'plan');
					oRetObject.finished = (xqItem.state_id.Value == 'finished');
					oRetObject.passed = (xqItem.state_id.Value == 'finished');
					if (xqItem.state_id.HasValue)
					{
						var fldStatus = xqItem.state_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
		case "object_data":
			{
				sReqItem = "for $elem in object_datas " +
					" where $elem/object_id = " + XQueryLiteral(education_plan_id) +
					" and $elem/sec_object_id=" + XQueryLiteral(person_id) +
					" and contains($elem/data_str, '" + XQueryLiteral(object_id) + "')" +
					" return $elem/Fields('id')";
				xqItem = ArrayOptFirstElem(XQuery(sReqItem));
				oRetObject.catalog = "object_data";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.status = xqItem.status_id.Value;
					oRetObject.started = true;
					oRetObject.finished = true;
					oRetObject.passed = true;
					if (xqItem.status_id.HasValue)
					{
						fldStatus = xqItem.status_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
		case "learning_task_result":
			{
				sReqItem = "for $elem in learning_task_results " +
					" where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
					" and $elem/learning_task_id=" + XQueryLiteral(object_id) +
					" and $elem/person_id=" + XQueryLiteral(person_id) +
					" return $elem";
				//toLog(sReqItem)
				xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.start_date.Value", "-"));

				oRetObject.catalog = "learning_task_result";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.learning_task_name.Value;
					oRetObject.status = xqItem.status_id.Value;
					oRetObject.started = (xqItem.status_id.Value != 'assign');
					oRetObject.finished = (xqItem.status_id.Value != 'assign' && xqItem.status_id.Value != 'process');
					oRetObject.passed = (xqItem.status_id.Value == 'success');
					if (xqItem.status_id.HasValue)
					{
						var fldStatus = xqItem.status_id.OptForeignElem;
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
				}
				return oRetObject;
			}
		case "poll_result":
			{
				sReqItem = "for $elem in poll_results " +
					" where $elem/poll_id=" + XQueryLiteral(object_id) +
					" and $elem/person_id=" + XQueryLiteral(person_id) +
					" return $elem";
				xqItem = ArrayOptFirstElem(ArraySort(XQuery(sReqItem), "This.create_date.Value", "-"));

				oRetObject.catalog = "poll_result";
				oRetObject.xq_object = xqItem;
				if (xqItem != undefined)
				{
					oRetObject.name = xqItem.poll_id.ForeignElem.name.Value;
					oRetObject.status = xqItem.status.Value;
					oRetObject.started = ( xqItem.is_done || xqItem.status > 0 );
					oRetObject.finished = ( xqItem.is_done || xqItem.status > 1 );
					oRetObject.passed = ( xqItem.is_done && ( xqItem.status == 4 || xqItem.status == 2 ) );
					if ( xqItem.status.HasValue )
					{
						var fldStatus = common.learning_states.GetOptChildByKey( xqItem.status );
						if (fldStatus != undefined)
						{
							oRetObject.status_name = fldStatus.name.Value;
						}
					}
					if ( xqItem.status == 0 && xqItem.is_done )
					{
						oRetObject.status_name = common.learning_states.GetOptChildByKey( 2 ).name.Value;
					}
				}
				return oRetObject;
			}
		default:
			{
				throw StrReplace("Необслуживаемый каталог: [{PARAM1}]", "{PARAM1}", catalog);
			}
	}
}

// ***********************************************************
function GetEducationPlanCollaborators(iEducationPlanID)
{
	var oObj;

	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	if (teEducationPlan.type != "group")
	{
		oRet.error = 1;
		oRet.errorMessage = "Нужно выбрать план по группе.";
		return oRet;
	}

	if (teEducationPlan.object_id.HasValue == false)
	{
		oRet.error = 1;
		oRet.errorMessage = "В выбранном плане не установлена группа.";
		return oRet;
	}

	xarrGroup_collaborator = XQuery("for $elem in group_collaborators " +
		" where $elem/group_id=" + teEducationPlan.object_id.Value +
		" return $elem");

	for (oGroup_collaboratorElem in xarrGroup_collaborator)
	{
		_collGroupCat = oGroup_collaboratorElem.collaborator_id.OptForeignElem;
		if (_collGroupCat != undefined)
		{
			oObj = new Object();
			oObj.id = ("" + oGroup_collaboratorElem.collaborator_id.Value);
			oObj.collaborator_id = ("" + oGroup_collaboratorElem.collaborator_id.Value);
			oObj.url = tools.call_code_library_method( "libMain", "get_object_link", [ "collaborator", oGroup_collaboratorElem.collaborator_id.Value ] );
			oObj.collaborator_fullname = _collGroupCat.fullname.Value;
			oObj.collaborator_photo = ( _collGroupCat.pict_url.HasValue ? _collGroupCat.pict_url.Value : "/pics/nophoto.jpg" );
			oObj.collaborator_position = _collGroupCat.position_name.Value;
			oObj.collaborator_department = _collGroupCat.position_parent_name.Value;
			oObj.collaborator_org = _collGroupCat.org_name.Value;
			oRet.result.push(oObj);
		}
	}

	return oRet;
}

// ***********************************************************
function GetProgramActivitysByPerson(iEducationPlanID, iPersonID, oFilter)
{
	var oRet = {
		error: 0,
		errorMessage: "",
		result: []
	}

	try
	{
		teEducationPlan.Name
		var hasDocEP = true
	}
	catch (e)
	{
		var hasDocEP = false
	}

	iEducationPlanID = OptInt(iEducationPlanID);
	if (iEducationPlanID == undefined)
	{
		if (hasDocEP)
		{
			iEducationPlanID = teEducationPlan.id.Value;
		}
		else
		{
			oRet.error = 1;
			oRet.errorMessage = "Не передана информация о плане обучения";
			return oRet;
		}
	}
	else if (!hasDocEP)
	{
		var docEducationPlan = tools.open_doc(iEducationPlanID);
		if (docEducationPlan == undefined)
		{
			oRet.error = 1;
			oRet.errorMessage = StrReplace(
				"Невозможно открыть план обучения с ID {PARAM1}",
				"{PARAM1}", iEducationPlanID
			);
			return oRet;
		}
		teEducationPlan = docEducationPlan.TopElem;
	}

	itemPerson = new Object();
	itemPerson.person_id = iPersonID;
	itemPerson.person_fullname = "";
	oCol = ArrayOptFirstElem(XQuery("for $elem in collaborators " +
		" where $elem/id = " + iPersonID +
		" return $elem"));

	if (oCol != undefined)
	{
		itemPerson.person_fullname = oCol.fullname.Value;
	}

	for (itemProgram in teEducationPlan.programs)
	{
		if (checkFilter(itemProgram, oFilter) == false)
		{
			continue;
		}

		switch (itemProgram.type.Value)
		{
			case "education_program":
				{
					//education_program_id
					//object_id нету
					break;
				}
			case "folder":
				{
					break;
				}
			case "education_method":
			case "event":
				{
					xqItem = get_activity(
						"event_collaborator",
						itemProgram.education_method_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					);
					oRet.result.push(cast_xqEvent(itemPerson, xqItem.xq_object, xqItem))

					break;
				}
			case "course":
				{
					xqItem = get_activity(
						"active_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem != undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, xqItem, true, itemProgram));
					}

					xqItem_bis = get_activity(
						"learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem_bis != undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, xqItem_bis, false, itemProgram));
					}

					if (xqItem == undefined && xqItem_bis == undefined)
					{
						oRet.result.push(cast_Learn(itemPerson, undefined, false, itemProgram));
					}
					break;
				}
			case "assessment":
				{
					xqItem = get_activity(
						"active_test_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem != undefined)
					{
						oRet.result.push(cast_Test(itemPerson, xqItem, true, itemProgram));
					}

					xqItem_bis = get_activity(
						"test_learning",
						itemProgram.object_id.Value,
						itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;
					if (xqItem_bis != undefined)
					{
						oRet.result.push(cast_Test(itemPerson, xqItem_bis, false, itemProgram));
					}

					if (xqItem == undefined && xqItem_bis == undefined)
					{
						oRet.result.push(cast_Test(itemPerson, undefined, false, itemProgram));
					}
					break;
				}
			case "material":
				{
					switch (itemProgram.catalog_name.Value)
					{
						case "library_material":
							{
								xqItem = get_activity(
									"library_material_viewing",
									itemProgram.object_id.Value,
									itemPerson.person_id,
									iEducationPlanID,
									teEducationPlan.create_date.Value
								).xq_object;

								oRet.result.push(cast_LibraryMaterial(itemPerson, xqItem, itemProgram))
								break;
							}
						default:
							{
								oRet.error = 1;
								oRet.errorMessage = StrReplace(
									"Необслуживаемый тип учебного материала: [{PARAM1}]", "{PARAM1}",
									itemProgram.catalog_name.Value
								);
								return oRet;
							}
					}

					break;
				}
			case "learning_task":
				{
					xqItem = get_activity(
						"learning_task_result",
						itemProgram.object_id.Value, itemPerson.person_id, iEducationPlanID, teEducationPlan.create_date.Value
					).xq_object;

					oRet.result.push(cast_LearningTask(itemPerson, xqItem, itemProgram))

					break;
				}
			case "notification_template":
				{
					oRet.result.push({
						PrimaryKey: itemPerson.person_id,
						type: "notification_template",
						type_name: "Рассылка информационного сообщения",
						id: itemPerson.person_id,
						is_fill: false,
						name: itemProgram.name.Value,
						person_name: itemPerson.person_fullname,
						status: null,
						status_name: "",
						start_date: "",

					})
					break;
				}
			default:
				{
//					oRet.error = 1;
//					oRet.errorMessage = StrReplace("Необслуживаемый тип задачи: [{PARAM1}]", "{PARAM1}", itemProgram.type.Value);
//					return oRet;
				}
		}
	}

	return oRet;
}


function process_print_form(oFormParam, iTopElemParam, bReturnFilename)
{
	try
	{
		TopElem = iTopElemParam;
	}
	catch (err)
	{
		try
		{
			TopElem;
		}
		catch (e)
		{
			TopElem = null;
		}
	}
	try
	{
		bReturnFilename
	}
	catch (err)
	{
		bReturnFilename = false
	}

	function get_temp_url(sSuffix, bTrashDir)
	{
		if (bTrashDir)
			return 'x-local://trash/temp/' + tools.random_string(10) + sSuffix;
		else
			return ObtainTempFile(sSuffix)
	}

	temp_iFormID = OptInt(oFormParam);
	if (temp_iFormID != undefined)
	{
		temp_teForm = OpenDoc(UrlFromDocID(temp_iFormID)).TopElem;
		temp_sRes = Trim(temp_teForm.data.GetStr());
		if (temp_teForm.file_encoding != 'utf-8')
			temp_sRes = DecodeCharset(temp_sRes, temp_teForm.file_encoding);

		temp_sTempUrl = '';
		switch (temp_teForm.type)
		{
			case 'word':
				var temp_oLib = tools.get_object_assembly( 'Word' );
				temp_sTempUrl = get_temp_url('.docx', bReturnFilename);
				PutUrlData(temp_sTempUrl, temp_sRes);
				temp_oLib.Open(UrlToFilePath(temp_sTempUrl));
				temp_arrBookmarks = String(temp_oLib.GetBookmarks()).split(';');
				for (temp_sBookmarkName in temp_arrBookmarks)
				{
					temp_sCode = String(temp_oLib.GetBookmarkText(temp_sBookmarkName));
					if (temp_sCode.charAt(0) == '=')
					{
						temp_sCode = temp_sCode.substr(1);
						if (temp_sCode.charAt(0) == '=')
						{
							temp_sCode = temp_sCode.substr(1);
							temp_oLib.SetBookmarkText(temp_sBookmarkName, eval(temp_sCode));
						}
						else
						{
							temp_oLib.SetBookmarkHtml(temp_sBookmarkName, eval(temp_sCode));
						}
					}
				}
				temp_oLib.Save();
				break;

			case 'pdf':
				temp_sFileSuffix = UrlPathSuffix(temp_teForm.file_name);
				if (temp_sFileSuffix == '.html' || temp_sFileSuffix == '.htm')
				{
					temp_sRes = EvalCodePage(temp_sRes);
					temp_sTempUrl = get_temp_url('.pdf', bReturnFilename);
					tools.html_to_pdf(temp_sRes, '', UrlToFilePath(temp_sTempUrl));
				}
				break;

			case 'word_pdf':
				var temp_oLib = tools.get_object_assembly( 'Word' );
				temp_sTempUrl = get_temp_url('.docx', false);
				PutUrlData(temp_sTempUrl, temp_sRes);
				temp_oLib.Open(UrlToFilePath(temp_sTempUrl));
				temp_arrBookmarks = String(temp_oLib.GetBookmarks()).split(';');
				for (temp_sBookmarkName in temp_arrBookmarks)
				{
					temp_sCode = String(temp_oLib.GetBookmarkText(temp_sBookmarkName));
					if (temp_sCode.charAt(0) == '=')
					{
						temp_sCode = temp_sCode.substr(1);
						if (temp_sCode.charAt(0) == '=')
						{
							temp_sCode = temp_sCode.substr(1);
							temp_oLib.SetBookmarkText(temp_sBookmarkName, eval(temp_sCode));
						}
						else
						{
							temp_oLib.SetBookmarkHtml(temp_sBookmarkName, eval(temp_sCode));
						}
					}
				}
				temp_sTempUrl = get_temp_url('.pdf', bReturnFilename);
				temp_oLib.SaveAs(UrlToFilePath(temp_sTempUrl));
				break;

			default:

				temp_sRes = EvalCodePage(temp_sRes);
				if (bReturnFilename)
				{
					fldType = temp_teForm.type.ForeignElem;
					temp_sTempUrl = get_temp_url('.' + fldType.extension, bReturnFilename);
					PutUrlData(temp_sTempUrl, temp_sRes);
				}
				break;
		}
		if (temp_sTempUrl != '')
		{
			if (bReturnFilename)
			{
				return temp_sTempUrl
			}
			else
			{
				temp_sRes = LoadUrlData(temp_sTempUrl);
				try
				{
					DeleteUrl(temp_sTempUrl);
				}
				catch (err)
				{
				}
			}
		}
	}
	else
	{
		if (StrContains(oFormParam, '../') || StrContains(oFormParam, '..\\'))
			throw 'Form is not correct.';

		temp_sRes = LoadUrlText(UrlAppendPath('x-local://templates/', oFormParam));
		temp_sRes = EvalCodePage(temp_sRes);
	}

	return temp_sRes;
}

// ***********************************************************
function get_filterByGroup(_sCatalog)
{
	result = "";
	var arrGroup = tools.xquery("for $elem in func_managers where catalog = 'group' and person_id = " + XQueryLiteral(tools.cur_user_id) + " return $elem/Fields('object_id')");
	var strGroup = ArrayMerge(arrGroup, "This.object_id", ",");
	if (ArrayCount(arrGroup) > 0)
	{
		switch (_sCatalog)
		{
			case "learning_group":
				{
					result = 'MatchSome($elem/id, (' + strGroup + '))';
					return result;
				}
			case "education_plan":
				{
					result = 'MatchSome($elem/object_id, (' + strGroup + '))';
					return result;
				}
		}
	}
	return result;
}

function get_collaboratorOfGroup(_filter, _iGroupID, _iEducationPlanID)
{
	result = undefined;
	xarrDoc = tools.xquery("for \
																$elem \
													in \
																group_collaborators \
													where \
																$elem/group_id = " + XQueryLiteral(_iGroupID) + _filter + " \
													return \
																$elem/Fields('collaborator_id', 'collaborator_fullname') \
												", "preload-foreign-data=1");
	arrResult = [];
	if (ArrayCount(xarrDoc) > 0)
	{
		docGroup = tools.open_doc(OptInt(_iGroupID, 0));
		if (docGroup != undefined)
		{
			teGroup = docGroup.TopElem;
			for (item in xarrDoc) 
			{
				status_color = "";
				status = "";
				date_start = "";
				date_finish = "";
				tip_title = "";
				curCol = ArrayOptFindByKey(teGroup.collaborators, "0x" + StrHexInt(item.collaborator_id), 'collaborator_id');
				if (curCol != undefined)
				{
					_arrDesc = [];
					try
					{
						_arrDesc = tools.read_object(curCol.desc);
						if (!IsArray(_arrDesc)) _arrDesc = [];
					}
					catch (err)
					{
						_arrDesc = [];
					}
					_oDesc = ArrayOptFindByKey(_arrDesc, _iEducationPlanID, 'education_plan_id');
					if (_oDesc != undefined)
					{
						status = _oDesc.status;
						date_start = _oDesc.date_start;
						date_finish = _oDesc.date_finish;
						if (status != "")
							tip_title = (status == "cancel") ? "Обучение для сотрудника отменено. Дата отмены " + date_start
								: "Обучение для сотрудника заморожено. Дата заморозки " + date_start + ". Дата разморозки " + date_finish;
						switch (status)
						{
							case "lock":
								{
									status_color = "#faf4eb";
									break;
								}
							case "cancel":
								{
									status_color = "#faebeb";
									break;
								}
						}
					}
				}
				_colItem = item.collaborator_id.OptForeignElem;
				collaborator = {
					"collaborator_id": item.collaborator_id.Value,
					"collaborator_fullname": item.collaborator_fullname.Value,
					"email": (_colItem == undefined ? "" : _colItem.email.Value),
					"position_name": (_colItem == undefined ? "" : _colItem.position_name.Value),
					"position_parent_name": (_colItem == undefined ? "" : _colItem.position_parent_name.Value),
					"org_name": (_colItem == undefined ? "" : _colItem.org_name.Value),
					"status_color": status_color,
					"status": status,
					"date_start": date_start,
					"tip_title": tip_title,
					"date_finish": date_finish
				}
				arrResult.push(collaborator);
			}
		}
	}
	if (ArrayCount(arrResult) > 0)
		result = arrResult;
	return result;
}

function reglamentEducation(_iEducationPlanID, _iCollaboratorID)
{
	try
	{
		docEducationPlan = tools.open_doc(OptInt(_iEducationPlanID, 0));
		if (docEducationPlan == undefined)
			return;
		teEducationPlan = docEducationPlan.TopElem;

		checkEducation = true;
		docGroup = tools.open_doc(OptInt(docEducationPlan.TopElem.object_id.Value, 0));
		if (docGroup != undefined)
		{
			teGroup = docGroup.TopElem;
			arrCol = [];
			if (OptInt(_iCollaboratorID) != undefined)
			{
				arrCol.push(OptInt(_iCollaboratorID, 0));
			}
			else
			{
				arrCol = XQuery("for $elem in group_collaborators where $elem/group_id=" + XQueryLiteral(docEducationPlan.TopElem.object_id.Value) + " return $elem/Fields('collaborator_id')");
			}
			for (itemCollaborator in arrCol)
			{
				curCol = ArrayOptFindByKey(teGroup.collaborators, itemCollaborator.collaborator_id, 'collaborator_id');
				if (curCol != undefined)
				{
					_arrDesc = [];
					try
					{
						_arrDesc = tools.read_object(curCol.desc);
						if (!IsArray(_arrDesc)) _arrDesc = [];
					}
					catch (err)
					{
						_arrDesc = [];
					}
					_oDesc = ArrayOptFindByKey(_arrDesc, docEducationPlan.TopElem.id.Value, 'education_plan_id');
					if (_oDesc != undefined)
					{
						if (_oDesc.status != 'cancel' || _oDesc.status != 'lock')
						{
							checkEducation = false;
						}
					}
				}
				if (checkEducation)
				{
					_res = tools.call_code_library_method('libEducation', 'update_education_plan', [teEducationPlan.id.Value, docEducationPlan, itemCollaborator.collaborator_id.Value, true]);
					if (_res.error == 0 && _res.HasProperty("doc_education_plan"))
					{
						update_events_by_model(teEducationPlan.id.Value, _res.doc_education_plan, temCollaborator.collaborator_id.Value, true);
					}
				}
			}
		}
	}
	catch (err)
	{

	}
}

function update_events_by_model(iObjId, docPlan, iPersonID, bSave)
{
	bNeedSave = false;
	for( _program in docPlan.TopElem.programs )
	{
		if( _program.result_object_id.HasValue && _program.result_type == "event" && OptInt(_program.custom_elems.ObtainChildByKey("model_event_id").value,0) > 0 && !tools_web.is_true(_program.custom_elems.ObtainChildByKey("model_passed").value) )
		{
			_model = tools.opem_doc(OptInt(_program.custom_elems.ObtainChildByKey("model_event_id").value,0));
			_event = tools.opem_doc(_program.result_object_id);
			if (_model!=undefined && _event!=undefined)
			{
				_event.TopElem.type_id = _model.TopElem.type_id;
				_event.TopElem.event_type_id = _model.TopElem.event_type_id;
				_event.TopElem.is_room = _model.TopElem.is_room;
				_event.TopElem.place_id = _model.TopElem.place_id;
				_event.TopElem.place = _model.TopElem.place;
				_event.TopElem.vclass_host = _model.TopElem.vclass_host;
				_event.TopElem.use_camera_capture = _model.TopElem.use_camera_capture;
				_event.TopElem.login_with_camera_only = _model.TopElem.login_with_camera_only;
				_event.TopElem.capture_rate = _model.TopElem.capture_rate;
				_event.TopElem.webinar_system_id = _model.TopElem.webinar_system_id;
				_event.TopElem.use_vclass = _model.TopElem.use_vclass;
				_event.TopElem.vclass_setting_id = _model.TopElem.vclass_setting_id;
				_event.TopElem.comment = _model.TopElem.comment;
				_event.TopElem.desc = _model.TopElem.desc;
				_event.TopElem.files.AssignElem(_model.TopElem.files);
				_event.Save();
				_program.custom_elems.ObtainChildByKey("model_passed").value = 'true';
				bNeedSave = true;
			}
		}
	}
	if (bNeedSave && bSave)
	{
		docPlan.Save();
	}
}

function deleteResultForCol(_iEducationPlanID, _iCollaboratorID)
{
	if (OptInt(_iEducationPlanID) == undefined)
		return;
	if (OptInt(_iCollaboratorID) == undefined)
		return;
	arrCatalog = ["active_learnings", "learnings", "active_test_learnings", "test_learnings", "learning_task_results", "poll_results"];
	for (catalog in arrCatalog)
	{
		xarrDoc = XQuery("for $elem in " + catalog + " where $elem/education_plan_id=" + XQueryLiteral(_iEducationPlanID) + " and $elem/person_id=" + XQueryLiteral(_iCollaboratorID) + " return $elem/Fields('id')");
		if (ArrayCount(xarrDoc) > 0)
		{
			for (item in ArraySelectAll(xarrDoc))
				DeleteDoc(UrlFromDocID(item.id));
		}
	}
	xarrEvent = XQuery("for $elem in event_collaborators where $elem/education_plan_id=" + XQueryLiteral(_iEducationPlanID) + " return $elem/Fields('event_id')");
	strEventID = ArrayMerge(xarrEvent, "This.event_id", ",");
	xarrEventResult = XQuery("for $elem in event_results where $elem/person_id=" + XQueryLiteral(_iCollaboratorID) + " and MatchSome($elem/event_id, (" + strEventID + ")) return $elem/Fields('id')");
	if (ArrayCount(xarrEventResult) > 0)
	{
		for (item in ArraySelectAll(xarrEventResult))
			DeleteDoc(UrlFromDocID(item.id));
	}
}
function get_PrintForm(_sCodeApp)
{
	result = "";
	xarrPrintForm = XQuery("for $elem in print_forms where contains($elem/code, '" + _sCodeApp + "') return $elem/Fields('id','code','name','type','file_name')");
	if (ArrayCount(xarrPrintForm) > 0)
		result = xarrPrintForm;
	return result;
}
function get_Resource(_iInstanceID)
{
	result = "";
	xarrResource = XQuery('for $elem in resources where $elem/app_instance_id=' + XQueryLiteral('0x' + StrHexInt(_iInstanceID)) + ' return $elem/id, $elem/__data');
	arrResult = [];
	if (ArrayCount(xarrResource) > 0)
	{
		for (item in xarrResource)
		{
			teDoc = tools.open_doc(item.id.Value).TopElem;
			resource = {
				"id": teDoc.id.Value,
				"file_url": teDoc.file_url.Value,
				"person_id": teDoc.person_id.Value,
				"code": teDoc.code.Value
			}
			arrResult.push(resource);
		}
	}
	if (ArrayCount(arrResult) > 0)
		result = arrResult;
	return result;
}

function sortProgram(iParentProgpamID, arrPrograms, arrNewPrograms, _iPos)
{
	programParents = ArraySelect(arrPrograms, "parent_progpam_id==" + iParentProgpamID);
	if (ArrayCount(programParents) == 0)
		return;

	for (programParent in programParents)
	{
		programParent.pos = _iPos + 1;
		arrNewPrograms.push(programParent);
		sortProgram(programParent.id, arrPrograms, arrNewPrograms, programParent.pos);
	}
}
function getHTMLPrintForm(curObject)
{
	arrPrograms = [];
	try
	{
		for (program in curObject.programs)
		{
			oProgram = {};
			oProgram.SetProperty("id", program.id);
			oProgram.SetProperty("pos", 0);
			oProgram.SetProperty("name", program.name);
			oProgram.SetProperty("parent_progpam_id", program.parent_progpam_id);
			oProgram.SetProperty("plan_date", program.plan_date);
			oProgram.SetProperty("finish_date", program.finish_date);
			strType = program.type;
			switch (program.type)
			{
				case "folder":
					{
						strType = ms_tools.get_const('c_phase');
						break;
					}
				case "education_program":
					{
						strType = ms_tools.get_const('c_edu_prog');
						break;
					}
				case "education_method":
					{
						strType = ms_tools.get_const('c_edu_method');
						break;
					}
				case "course":
					{
						strType = ms_tools.get_const('c_course');
						break;
					}
				case "assessment":
					{
						strType = ms_tools.get_const('c_test');
						break;
					}
				case "material":
					{
						strType = ms_tools.get_const('Изучение материала');
						break;
					}
				case "learning_task":
					{
						strType = ms_tools.get_const('zzzv3sxxx47yyy');
						break;
					}
				case "notification_template":
					{
						strType = ms_tools.get_const('Рассылка информационного сообщения');
						break;
					}
			}
			oProgram.SetProperty("type", strType);
			arrPrograms.push(oProgram);
		}
	}
	catch (_err)
	{
		alert(_err);
	}
	programs = [];
	alert("1");
	programParents = ArraySelect(arrPrograms, "!parent_progpam_id.HasValue");
	alert("2");
	for (programParent in programParents)
	{
		programs.push(programParent);
		sortProgram(programParent.id, arrPrograms, programs, 0);
	}
	alert("3");
	if (ArrayCount(programs) == 0) return "Не найдены программы обучения";
	alert("4.1");
	var lectors = [];
	alert("4.2");
	alert(XQueryLiteral(curObject.compound_program_id));
	xoCompoundProgram = ArrayOptFirstElem(XQuery('for $elem in compound_programs where $elem/id=' + XQueryLiteral(curObject.compound_program_id) + ' return $elem/id, $elem/__data'));
	alert("4.3");
	alert("4");
	if (xoCompoundProgram != undefined)
	{
		doc = tools.open_doc(xoCompoundProgram.id.Value);
		if (doc != undefined)
		{
			alert("5");
			teDoc = doc.TopElem;
			for (lector in teDoc.lectors)
			{
				oLector = {};
				oLector.SetProperty("fullname", lector.lector_id.ForeignElem.lector_fullname.Value);
				oLector.SetProperty("email", lector.lector_id.ForeignElem.email.Value);
				lectors.push(oLector);
				alert("6");
			}
		}
	}
	alert("7");
	sHtmlForm = "";
	arrHTMLForm = [];

	sHTMLSplit = "<tr height=7 style='mso-height-source:userset;height:5.25pt'><td colspan=9 height=7 class=xl2914313 style='height:5.25pt' ></td ></tr>";
	sHTMLSplitEmpty = "<tr height=7 style='mso-height-source:userset;height:5.25pt'><td colspan=9 height=7 class=xl2414313 style='height:5.25pt'></td></tr>";
	arrHTMLForm.push("<html \
									 xmlns: o = 'urn:schemas-microsoft-com:office:office' \
									 xmlns: x = 'urn:schemas-microsoft-com:office:excel' \
									 xmlns = 'http://www.w3.org/TR/REC-html40' \
									 >");

	arrHTMLForm.push("<head>");
	arrHTMLForm.push("<meta http-equiv=Content-Type content='text / html; charset = windows - 1251'>");
	arrHTMLForm.push("<meta name=ProgId content=Excel.Sheet>");
	arrHTMLForm.push("<meta name=Generator content='Microsoft Excel 11'>");
	arrHTMLForm.push("<style>");
	arrHTMLForm.push("table { \
									 mso-displayed-decimal-separator: ','; \
									 mso-displayed-thousand-separator: ' '; \
									}");
	arrHTMLForm.push(".xl2414313 { \
									 padding-top: 1px; \
									 padding-right: 1px; \
									 padding-left: 1px; \
									 mso-ignore: padding; \
									 color: windowtext; \
									 font-size: 10.0pt; \
									 font-weight: 400; \
									 font-style: normal; \
									 text-decoration: none; \
									 font-family: 'Open Sans'; \
									 mso-generic-font-family: 'Open Sans'; \
									 mso-font-charset: 204; \
									 mso-number-format: General; \
									 text-align: center; \
									 vertical-align: bottom; \
									 background: white; \
									 mso-pattern: auto none; \
									 white-space: nowrap; \
									}");
	arrHTMLForm.push(".xl2514313 { \
									 color: black; \
									 font-size: 10.0pt; \
									 font-weight: 700; \
									 font-style: normal; \
									 text-decoration: none; \
									 font-family: 'Open Sans'; \
									 mso-font-charset: 204; \
									 mso-number-format: General; \
									 text-align: left; \
									 vertical-align: middle; \
									 background: white; \
									 mso-pattern: auto none; \
									 white-space: nowrap; \
									 padding-left: 12px; \
									 mso-char-indent-count: 1; \
									}");
	arrHTMLForm.push(".xl2614313 { \
									 padding-top: 1px; \
									 padding-right: 1px; \
									 padding-left: 1px; \
									 mso-ignore: padding; \
									 color: #596278; \
									 font-size: 7.0pt; \
									 font-weight: 700; \
									 font-style: normal; \
									 text-decoration: none; \
									 font-family: 'Open Sans'; \
									 mso-font-charset: 204; \
									 mso-number-format: General; \
									 text-align: center; \
									 vertical-align: middle; \
									 background: white; \
									 mso-pattern: auto none; \
									 white-space: normal; \
									}");
	arrHTMLForm.push(".xl2714313 { \
									 padding-top: 1px; \
									 padding-right: 1px; \
									 padding-left: 3px; \
									 mso-ignore: padding; \
									 border-bottom: 3px solid white; \
									 color: black; \
									 font-size: 8.0pt; \
									 font-weight: 400; \
									 font-style: normal; \
									 text-decoration: none; \
									 font-family: 'Open Sans'; \
									 mso-generic-font-family: 'Open Sans'; \
									 mso-font-charset: 204; \
									 mso-number-format: General; \
									 text-align: center; \
									 vertical-align: middle; \
									 background: #ebebec; \
									 mso-pattern: auto none; \
									 white-space: nowrap; \
									}");
	arrHTMLForm.push(".xl2914313 { \
									 padding-top: 1px; \
									 padding-right: 1px; \
									 padding-left: 1px; \
									 mso-ignore: padding; \
									 color: windowtext; \
									 font-size: 10.0pt; \
									 font-weight: 400; \
									 font-style: normal; \
									 text-decoration: none; \
									 font-family: 'Open Sans'; \
									 mso-generic-font-family: 'Open Sans'; \
									 mso-font-charset: 204; \
									 mso-number-format: General; \
									 text-align: center; \
									 vertical-align: bottom; \
									 background: none; \
									 mso-pattern: auto none; \
									 white-space: nowrap; \
									}");
	arrHTMLForm.push(".header_table { \
									 width: 95%; \
									 background-color: none; \
									}");
	arrHTMLForm.push("</style>");
	arrHTMLForm.push("</head>");
	arrHTMLForm.push("</html>");

	arrHTMLForm.push("<body>");
	arrHTMLForm.push("<div align=center x:publishsource='Excel'>");
	arrHTMLForm.push("<table x:str border=0 cellpadding=0 cellspacing=0 width=90% style='border-collapse:collapse;table-layout:fixed'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=8% style='mso-width-source:userset;mso-width-alt:256'>");
	arrHTMLForm.push("<col width=30% style='mso-width-source:userset;mso-width-alt:3108'>");
	arrHTMLForm.push("<col width=10% style='mso-width-source:userset;mso-width-alt:3108'>");
	arrHTMLForm.push("<col width=10% style='mso-width-source:userset;mso-width-alt:3108'>");
	alert("8");
	if (ArrayCount(lectors) > 0)
	{
		arrHTMLForm.push(sHTMLSplit);
		arrHTMLForm.push(sHTMLSplit);
		arrHTMLForm.push("<tr height=25 style='height:18.75pt'>");
		arrHTMLForm.push("<td class=xl2614313 style='line-height:107%;mso-bidi-font-size:11pt;background: none'>");
		arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;background: none;mso-font-width:129%'>Преподаватели</span>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("</tr>");
		arrHTMLForm.push("<tr height=2 style='mso-height-source:userset'><td colspan=9 height=2 class=xl2914313></td></tr>");
		alert("9");
		for (_lector in lectors)
		{
			arrHTMLForm.push("<tr height=25 style = 'height:18.75pt'>");
			arrHTMLForm.push("<td colspan=6 height=25 class=xl2514313 style='height:18.75pt'>");
			arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:100%'>" + _lector.fullname + "</span>");
			arrHTMLForm.push("</td>");
			arrHTMLForm.push("<td colspan=3 height=25 class=xl2514313 style='height:18.75pt'>");
			arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:100%'>" + _lector.email + "</span>");
			arrHTMLForm.push("</td>");
			arrHTMLForm.push("</tr>");
			arrHTMLForm.push(sHTMLSplit);
			alert("10");
		}
		alert("11");
	}
	arrHTMLForm.push(sHTMLSplit);
	arrHTMLForm.push("<tr height=25 style='height:18.75pt'>");
	arrHTMLForm.push("<td class=xl2614313 colspan=6>");
	arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:129%'>Дата начала</span>");
	arrHTMLForm.push("</td>");
	arrHTMLForm.push("<td colspan=3 class=xl2614313>");
	arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:126%'>Дата окончания</span>");
	arrHTMLForm.push("</td>");
	arrHTMLForm.push("</tr>");
	alert("12");
	arrHTMLForm.push("<tr height=30 style='height:20pt'>");
	arrHTMLForm.push("<td class=xl2714313 colspan=6>" + curObject.plan_date);
	arrHTMLForm.push("</td>");
	arrHTMLForm.push("<td class=xl2714313 colspan=3>" + curObject.finish_date);
	arrHTMLForm.push("</td>");
	arrHTMLForm.push("</tr>");
	arrHTMLForm.push(sHTMLSplitEmpty);
	arrHTMLForm.push(sHTMLSplit);
	alert("13");
	for (_program in programs)
	{
		arrHTMLForm.push("<tr height=25 style = 'height:18.75pt'>");
		if (_program.pos > 0)
		{
			arrHTMLForm.push("<td colspan=" + _program.pos + " height=25 class=xl2514313 style='height:18.75pt'></td>");
		}
		else
		{
			arrHTMLForm.push(sHTMLSplit);
			arrHTMLForm.push(sHTMLSplit);
			arrHTMLForm.push(sHTMLSplit);
			arrHTMLForm.push(sHTMLSplit);
		}
		arrHTMLForm.push("<td colspan=" + 9 - _program.pos + " height=25 class=xl2514313 style='height:18.75pt'>");
		arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:127%'>" + _program.name + "</span>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("</tr>");

		arrHTMLForm.push("<td colspan=7 height=25 class=xl2514313 style='height:18.75pt'>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("<td class=xl2614313 colspan=2>");
		arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:129%'>" + _program.type + "</span>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("</tr>");

		arrHTMLForm.push("<tr height=25 style='height:18.75pt'>");
		arrHTMLForm.push("<td colspan=7 height=25 class=xl2614313  style='height:18.75pt'>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("<td class=xl2614313>");
		arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:129%'>Дата начала</span>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("<td class=xl2614313>");
		arrHTMLForm.push("<span style='line-height:107%;mso-bidi-font-size:11pt;mso-font-width:126%'>Дата окончания</span>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("</tr>");

		arrHTMLForm.push("<tr height=30 style='height:20pt'>");
		arrHTMLForm.push("<td colspan=7 height=30 class=xl2614313 style='height:20pt'>");
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("<td class=xl2714313>" + _program.plan_date);
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("<td class=xl2714313>" + _program.finish_date);
		arrHTMLForm.push("</td>");
		arrHTMLForm.push("</tr>");
		arrHTMLForm.push(sHTMLSplitEmpty);
		arrHTMLForm.push(sHTMLSplit);
		alert("14");
	}
	arrHTMLForm.push("</table>");
	arrHTMLForm.push("</div>");
	arrHTMLForm.push("</body>");
	alert("final");
	sHtmlForm = ArrayMerge(arrHTMLForm, "This", "");
	return sHtmlForm;
}
function getZipCertificateURL(_arrResourceID)
{
	urlTempDirFile = ObtainSessionTempFile();
	CreateDirectory(urlTempDirFile);
	urlTempDirZip = "x-local:///trash/temp";
	urlNameZip = "certificate_" + StrReplace(DateToRawSeconds(CurDate), '.', '') + '.zip';
	if (ArrayCount(_arrResourceID) > 0)
	{
		for (resourceID in _arrResourceID)
		{
			resource = tools.open_doc(OptInt(resourceID, 0));
			if (resource != undefined)
			{
				if (FilePathExists(UrlToFilePath(urlTempDirFile)))
					resource.TopElem.get_data(urlTempDirFile + '/' + resource.TopElem.file_name);
			}
		}
	}
	if (FilePathExists(UrlToFilePath(urlTempDirZip)))
	{
		tools.zip_create(UrlToFilePath(urlTempDirZip + '/' + urlNameZip), UrlToFilePath(urlTempDirFile));
	}
	DeleteDirectory(urlTempDirFile);
	result = urlTempDirZip + '/' + urlNameZip;
	return result;
}
// ***********************************************************
function getReportProgressPlan(idEducation_planParam)
{
	return OpenCodeLib("x-local://applications/websoftcontinuouslearning/app_report_lib.js").getReportProgressPlan(idEducation_planParam);
}

// ***********************************************************
function getReportProgressPerson(idEducation_planParam)
{
	return OpenCodeLib("x-local://applications/websoftcontinuouslearning/app_report_lib.js").getReportProgressPerson(idEducation_planParam);
}
// ***********************************************************
function getChat(idEducation_planParam)
{
	return OpenCodeLib("x-local://applications/websoftcontinuouslearning/app_chat_lib.js").getChat(idEducation_planParam);
}
// ***********************************************************
function getMessage(idChatParam)
{
	return OpenCodeLib("x-local://applications/websoftcontinuouslearning/app_chat_lib.js").getMessage(idChatParam);
}
// ***********************************************************
