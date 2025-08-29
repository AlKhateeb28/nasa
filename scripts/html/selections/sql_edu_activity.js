// 7121349910013678311
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

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

function get_education_plan_by_person(iObjectID, iPersonID) {
    docObject = tools.open_doc(iObjectID);
    if (docObject == undefined) {
        throw StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
    }

    if (docObject.TopElem.Name == 'compound_program'){
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
    } else if (docObject.TopElem.Name == 'education_plan') {
        var xqLastEducationPlan = ArrayOptFirstElem(XQuery("for $elem in education_plans " +
            " where $elem/id=" + XQueryLiteral(iObjectID) +
            " order by $elem/create_date descending " +
            " return $elem"));
        if (xqLastEducationPlan == undefined) {
            xqLastEducationPlan = null;
        }
    }

    return xqLastEducationPlan;
}

function GetActualModule(iObjectID, iPersonID, tePlan, id_only) {
    try {
        is_plan = tePlan.Name == "education_plan";
    } catch(_noPlan_) {
        is_plan = false;
    }

    try {
        _flag_id = id_only == true;
    } catch(_noPlan_) {
        _flag_id = false;
    }

    var teEducationPlan = undefined;

    try{
        if ( !is_plan ) {
            var xqLastEducationPlan = get_education_plan_by_person(iObjectID, iPersonID);
            if (xqLastEducationPlan == null) {
                throw StrReplace(StrReplace(
                    "Не найдено плана оценки по плану оценки/модульной программе ID [{PARAM1}] и сотруднику [{PARAM2}]",
                    "{PARAM1}", iObjectID), "{PARAM2}", iPersonID);
            }

            var docEducationPlan = tools.open_doc(xqLastEducationPlan.id.Value);
            if (docEducationPlan == undefined) {
                throw StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", xqLastEducationPlan.id.Value);
            }

            teEducationPlan = docEducationPlan.TopElem;
        } else {
            teEducationPlan = tePlan
        }

        var fldActualModule = ArrayOptFind(
            teEducationPlan.programs,
            " !This.parent_progpam_id.HasValue " +
            " && " +
            " (This.plan_date.HasValue && This.plan_date.Value <= Date()) && (This.finish_date.HasValue && This.finish_date.Value >= Date())"
        );

        if (fldActualModule == undefined) {
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

        if (!_flag_id) {
            oRet = FuncStampPassed(oRet, teEducationPlan, iPersonID);
        }

        return ArrayOptFirstElem(oRet);

    } catch (err) {
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

function FuncStampPassed(oRetParam, tePlan, iPersonID) {
    try {
        _cur_id = OptInt(GetActualModule(null, iPersonID, tePlan, true).id,0);
    } catch (_no_actual) {
        _cur_id = 0;
    }

    if (tePlan==null) {
        for (_oObj in oRetParam) {
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
    } else {
        for (_oObj in oRetParam) {
            _aObjs = ArraySelect(tePlan.programs, "(This.type != 'folder' && This.type != 'notification_template') && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            _aFldrs = ArraySelect(tePlan.programs, "(This.type == 'folder' || This.type == 'notification_template') && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            for (_fldr in _aFldrs) {
                _aObjs = ArrayUnion(_aObjs, ArraySelect(tePlan.programs, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
            }

            _oObj.tasks = ArrayCount(_aObjs);

            if (_oObj.tasks>0) {
                _aActs = ArrayExtract(_aObjs, "get_activity_by_task(tePlan, tePlan, This, iPersonID, true)");

                _oObj.finished = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && (This.xq_object != undefined || (This.catalog == 'document' || This.catalog == 'blog' || This.catalog == 'library_material' || This.catalog == 'poll' || This.catalog == 'resource' || This.catalog == 'forum' || This.catalog == 'chat')) && tools_web.is_true(This.GetOptProperty('finished'))")))/Real(_oObj.tasks),2);
                _oObj.passed = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && (This.xq_object != undefined || (This.catalog == 'document' || This.catalog == 'blog' || This.catalog == 'library_material' || This.catalog == 'poll' || This.catalog == 'resource' || This.catalog == 'forum' || This.catalog == 'chat')) && tools_web.is_true(This.GetOptProperty('passed'))")))/Real(_oObj.tasks),2);
            } else {
                _oObj.finished = 0;
                _oObj.passed = 0;
            }

            _oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
        }
    }
    return oRetParam;
}

function GetEducationPlanProgramsByParam(iCompoundProgramID, iPersonID, bReturnTree, iParentID, sReturnType) {
    var bCheckCompleteActivity = false; // проверять также наличие завершенных активностей
    var fldLastEducationPlan = get_education_plan_by_person(iCompoundProgramID, iPersonID);
    if (fldLastEducationPlan == null) {
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

function GetEducationPlanPrograms(iEducationPlanID, teEducationPlan, iPersonID, bReturnTree, iParentID, sReturnType, bCheckCompleteActivity, oFilter) {
    function fnRecursion(iParentIDRec, array) {
        array.push(iParentIDRec);

        for (itemNodes in ArraySelect(teEducationPlan.programs, "This.parent_progpam_id.Value == OptInt(iParentIDRec)")) {

            if (itemNodes.type.Value == 'folder') {
                array.push(itemNodes.id.Value);
                fnRecursion(itemNodes.id.Value, array);
            }
        }
    }

    if (sReturnType == null || sReturnType == undefined || sReturnType == "") {
        sReturnType = "activity";
    }

    bReturnTree = tools_web.is_true(bReturnTree);

    var oRet = {
        error: 0,
        errorMessage: "",
        result: []
    }

    try {
        teEducationPlan.Name
        var hasDocEP = true
    } catch (e) {
        var hasDocEP = false
    }

    iEducationPlanID = OptInt(iEducationPlanID);
    if (iEducationPlanID == undefined) {
        if (hasDocEP) {
            iEducationPlanID = teEducationPlan.id.Value;
        } else {
            oRet.error = 1;
            oRet.errorMessage = "Не передана информация о плане обучения";
            return oRet;
        }
    } else if (!hasDocEP) {
        var docEducationPlan = tools.open_doc(iEducationPlanID);
        if (docEducationPlan == undefined) {
            oRet.error = 1;
            oRet.errorMessage = StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
            return oRet;
        }
        teEducationPlan = docEducationPlan.TopElem;
    }

    if (oFilter == undefined) {
        switch(sReturnType) {
            case "activity": {
                var bClearParent = true
                break;
            }
            case "stage": {
                var bClearParent = true
                break;
            }
            case "all":{
                var bClearParent = false
                break;
            }
            default: {
                var bClearParent = false
            }
        }

        var arrParentIDs = [iParentID];

        if(bReturnTree && iParentID != undefined && iParentID != null && iParentID != "") {
            fnRecursion(OptInt(iParentID), arrParentIDs);

            arrParentIDs =  ArraySelectDistinct(arrParentIDs);
        }

        var arrParentIDActive = ArrayExtract(ArraySelect(arrParentIDs, "OptInt(This) != undefined"), "OptInt(This)");
        var arrProgramCollection = ArraySelect(teEducationPlan.programs, "filterActivity(This, sReturnType, bReturnTree, arrParentIDActive)");
        var oActivity, sUrl;

        for(itemProgram in arrProgramCollection) {
            oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
            oRet.result.push(cast_EducationPlanProgram(itemProgram, oActivity, bClearParent && (itemProgram.parent_progpam_id.Value == OptInt(iParentID))));
        }

        oRet.result = FuncStampPassed( oRet.result, (sReturnType != "stage" ? null : teEducationPlan), iPersonID );
    } else {
        var oActivity, sUrl;

        for (itemProgram in teEducationPlan.programs) {
            if (checkFilter(itemProgram, oFilter) == false) {
                continue;
            }

            oActivity = get_activity_by_task(teEducationPlan, teEducationPlan, itemProgram, iPersonID, bCheckCompleteActivity);
            oRet.result.push( cast_EducationPlanProgram(itemProgram, oActivity));
        }
        // toLog("oRet: " + EncodeJson(oRet))
    }
    return oRet;
}

function get_activity_by_task(iEducationPlanID, teEducationPlan, Task, iPersonID, bCheckCompleteActivity) {
    bCheckCompleteActivity = tools_web.is_true(bCheckCompleteActivity);

    try {
        teEducationPlan.Name
        var hasDocEP = true
    } catch (e) {
        var hasDocEP = false
    }

    iEducationPlanID = OptInt(iEducationPlanID);
    if (iEducationPlanID == undefined) {
        if (hasDocEP)
        {
            iEducationPlanID = teEducationPlan.id.Value;
        }
        else
        {
            throw "Не передана информация о плане обучения";
        }
    } else if (!hasDocEP) {
        var docEducationPlan = tools.open_doc(iEducationPlanID);
        if (docEducationPlan == undefined) {
            throw StrReplace("Невозможно открыть план обучения с ID {PARAM1}", "{PARAM1}", iEducationPlanID);
        }

        teEducationPlan = docEducationPlan.TopElem;
    }

    var fldTask = OptInt(Task) != undefined ? ArrayOptFind(teEducationPlan.programs, "This.id.Value == Task") : Task;

    if (fldTask == undefined) {
        throw StrReplace(
            StrReplace(
                "В плане обучения ID [{PARAM1}] не найдено задачи с ID [{PARAM2}]", "{PARAM1}", iEducationPlanID
            ),
            "{PARAM2}",
            Task
        );
    }

    if (ObjectType(fldTask) != 'XmElem') {
        throw "Переданный аргумент Task не является элементом программы обучения или ID такого элемента: " +
        "\r\n" + tools.object_to_text(fldTask, "json");
    }

    var xqItem = null;
    var xqItem_bis = null
    var sReqItem, sReqItem_bis;

    switch (fldTask.type.Value) {
        case "education_method": {
            xqItem = get_activity(
                "event_collaborator", fldTask.education_method_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
            );

            if (xqItem.xq_object == undefined) {
                return null;
            }

            xqItem.url = get_url("event", xqItem.xq_object.event_id.Value);
            return xqItem;
        }
        case "course": {
            xqItem = get_activity("active_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object != undefined) {
                xqItem.url = get_url("active_learning", xqItem.xq_object.id.Value);
                return xqItem;
            } else {
                xqItem_bis = get_activity("learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
                if (xqItem_bis.xq_object != undefined) {
                    xqItem_bis.url = bCheckCompleteActivity ? "" : get_url("learning", xqItem_bis.xq_object.id.Value);
                    return xqItem_bis;
                } else {
                    return null;
                }
            }
        }
        case "assessment": {
            xqItem = get_activity("active_test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object != undefined) {
                xqItem.url = get_url("active_test_learning", xqItem.xq_object.id.Value);
                return xqItem;
            } else {
                xqItem_bis = get_activity("test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
                if ( xqItem_bis.xq_object != undefined && !xqItem_bis.passed && fldTask.object_id.OptForeignElem.is_open ) {
//						var newTest = tools.activate_test_to_person({
//							"iPersonID": iPersonID,
//							"iAssessmentID": fldTask.object_id.Value,
//							"iEducationPlanID": iEducationPlanID
//						});

                    xqItem_bis.url = get_url("assessment", fldTask.object_id.Value);
                    fldTask.result_object_id.Clear();
                    return xqItem_bis;
                } else if (xqItem_bis.xq_object != undefined) {
                    xqItem_bis.url = bCheckCompleteActivity ? "" : get_url("test_learning", xqItem_bis.xq_object.id.Value);
                    return xqItem_bis;
                } else {
                    return null;
                }
            }
        }
        case "material": {
            switch (fldTask.catalog_name.Value) {
                case "document":
                case "resource": {
                    xqItem = get_activity("object_data", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

                    if (xqItem.xq_object == undefined)  {
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
                    } else {
                        stateDesc = common.education_learning_states.GetOptChildByKey(5);
                        xqItem.url = get_url(fldTask.catalog_name.Value, fldTask.object_id.Value);
                        xqItem.name = fldTask.name.Value;
                        xqItem.status = 5;
                        xqItem.status_name = (stateDesc != undefined ? stateDesc.name.Value : "");
                    }

                    return xqItem;
                }
                case "library_material":{
                    xqItem = get_activity(
                        "library_material_viewing", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
                    );

                    if (xqItem.xq_object == undefined) {
                        return null;
                    }

                    xqItem.url = get_url("library_material", xqItem.xq_object.material_id.Value);
                    //toLog(xqItem.name + " (" + fldTask.id.Value + ") ---> " + xqItem.url)
                    return xqItem;
                }
                case "poll": {
                    xqItem = get_activity(
                        "poll_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
                    );

                    if (xqItem.xq_object == undefined) {
                        return null;
                    }

                    xqItem.url = get_url("poll_result", xqItem.xq_object.id.Value);
                    //toLog(xqItem.name + " (" + fldTask.id.Value + ") ---> " + xqItem.url)
                    return xqItem;
                }
                default: {
                    throw StrReplace("Необслуживаемый тип учебного материала: [{PARAM1}]", "{PARAM1}", fldTask.catalog_name.Value);
                }
            }

            break;
        }
        case "learning_task": {
            xqItem = get_activity("learning_task_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object == undefined) {
                return null;
            }

            xqItem.url = get_url("learning_task", xqItem.xq_object.learning_task_id.Value);
            return xqItem;
        }
        case "folder": {
            return null;
        }
        case "notification_template": {
            return null;
        }
        default:{
            throw StrReplace("Необслуживаемый тип задачи: [{PARAM1}]", "{PARAM1}", fldTask.type.Value);
        }
    }
}

function filterActivity(fldObject, sReturnType, bReturnTree, arrParentIDs) {
    switch (sReturnType) {
        case "activity": {
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
            if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined) {
                bIsParent = (ArrayOptFind(arrParentIDs, "fldObject.parent_progpam_id.Value == This") != undefined);
            }

            return bIsParent && (bIsActivity || bIsActivityMaterial);
        }
        case "stage": {
            if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined) {
                var bIsParent = (
                    fldObject.parent_progpam_id.HasValue
                    && ArrayOptFind(arrParentIDs, "fldObject.parent_progpam_id.Value == This") != undefined
                );
            } else {
                var bIsParent = !fldObject.parent_progpam_id.HasValue
            }

            return (fldObject.type.Value == 'folder' || bReturnTree) && bIsParent && fldObject.type.Value != 'notification_template';
        }
        case "all": {
            return (fldObject.type.Value != 'notification_template');
        }
    }
}

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

            xqItem = ArrayOptFirstElem( XQuery( sReqItem ) );

            if (xqItem == undefined)
            {
                sReqItem = "for $elem in library_material_viewings " +
                    " where $elem/material_id=" + XQueryLiteral(object_id) +
                    " and $elem/person_id=" + XQueryLiteral(person_id) +
                    " order by $elem/last_viewing_date descending return $elem";

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

tools_app.clear_application_cache()

var agentId = 7121349910013678311;
var loggerName = "sql_7121349910013678311";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    var teApplication = tools_app.get_application("websoftcontinuouslearning");
    var oLib = tools_app.get_cur_application_lib(teApplication.id.Value);

    var iObjectID = OptInt(curObjectID,iCompoundProgramID);

    iParentID = OptInt(iParentID, null);

    if(iParentID == null && tools_web.is_true(bGetCurrentModule)) {
        //iParentID =  oLib.GetActualModule(iObjectID, curUserID).id;
        iParentID =  GetActualModule(iObjectID, curUserID).id;
    }

    //var oRes = oLib.GetEducationPlanProgramsByParam(iObjectID , curUserID, bReturnTree, iParentID, sReturnType );
    var oRes = GetEducationPlanProgramsByParam(iObjectID , curUserID, bReturnTree, iParentID, sReturnType );

    if (IsArray(oRes.result) && ArrayOptFirstElem(oRes.result) != undefined) {
        for (oResElem in oRes.result) {
            if (OptDate(oResElem.plan_date, undefined) != undefined) {
                oResElem.SetProperty("plan_date_str", tools.call_code_library_method ("libSchedule", "get_str_date_from_date", [Date(oResElem.plan_date)]).date_str);
            }

            if (OptDate(oResElem.finish_date, undefined) != undefined) {
                oResElem.SetProperty("finish_date_str", tools.call_code_library_method ("libSchedule", "get_str_date_from_date", [Date(oResElem.finish_date)]).date_str);
            }
        }
    }

    ERROR = oRes.error;
    MESSAGE = oRes.errorMessage;
    if(ERROR != 0) oLib.toLog(MESSAGE);

    RESULT = oRes.result;
//EnableLog("marathon"); LogEvent("marathon", "RESULT: " + EncodeJson(oRes))
//oLib.toLog("RESULT: " + EncodeJson(oRes), "marathon", true);
//oLib.toLog("URLs: " + ArrayMerge(RESULT, 'This.activity_url', '\r\n'), "marathon", true);

} catch(err) {
    EnableLog('error');
    LogEvent("error","RemoteCollection: GetEducationPlanProgramsByParam:\r\n" +err); alert("QQQ=" + err);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Error: " + err);
}