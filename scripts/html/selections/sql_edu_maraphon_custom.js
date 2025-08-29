// 7102925884301535770
//tools_app.clear_application_cache()
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function cast_Tutor_custom(xqLector) {
    objRet = {
        PrimaryKey: xqLector.person_id.Value,
        id: String(xqLector.person_id.Value),
        name: xqLector.lector_fullname.Value,
        image_url: tools_web.get_object_source_url('person', xqLector.person_id.Value, '200'),
        form_url: '/tutor_collaborator?object_id=' + xqLector.person_id.Value
    };

    return objRet;
}

function getEducationPlanTutorsCustom(iObjectIDParam, iUserIDParam) {
    var oRet = {
        error: 0,
        errorMessage: "",
        result: []
    }

    iObjectID = OptInt(iObjectIDParam);

    if (iObjectID == undefined) {
        oRet.error = 1;
        oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM1}]", "{PARAM1}", iObjectIDParam);
        return oRet;
    }

    var docObject = tools.open_doc(iObjectID);
    if (docObject == undefined) {
        oRet.error = 1;
        oRet.errorMessage = StrReplace("Невозможно открыть объект с ID [{PARAM1}]", "{PARAM1}", iObjectID);
        return oRet;
    }

    if (docObject.TopElem.Name == 'education_plan') {
        var docCompoundProgram = tools.open_doc(docObject.TopElem.compound_program_id.Value);
        if (docCompoundProgram == undefined) {
            oRet.error = 1;
            oRet.errorMessage = StrReplace(
                "В плане оценки с ID [{PARAM1}] отсутствует ссылка на модульную программу", "{PARAM1}",
                iObjectID
            );
            return oRet;
        }

        var teCompoundProgram = docCompoundProgram.TopElem;
    } else if (docObject.TopElem.Name == 'compound_program') {
        var teCompoundProgram = docObject.TopElem;
    } else {
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

    if (bModProgFCK) {
        iUserID = OptInt(iUserIDParam);

        if (iUserID == undefined) {
            oRet.error = 1;
            oRet.errorMessage = StrReplace("ID объекта не является целым числом: [{PARAM2}]", "{PARAM2}", iUserIDParam);
            return oRet;
        }

        docUser = tools.open_doc(iUserID);

        if (docUser == undefined) {
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

    for (itemLector in XQuery(strReq)) {
        oRet.result.push(cast_Tutor_custom(itemLector));
    }

    return oRet;
}

var agentId = 7102925884301535770;
var loggerName = "sql_7102925884301535770";;

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    var teApplication = tools_app.get_application("websoftcontinuouslearning");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] curUserID: " + curUserID);

    var iProgID = OptInt(curObjectID, iObjectID);

    var oRes = getEducationPlanTutorsCustom(iProgID, iPersonID);

    RESULT = oRes.result;

    //oLib.toLog("RESULT: " + EncodeJson(RESULT));
    //oLib.toLog("URLs: " + ArrayMerge(RESULT, 'This.activity_url', '\r\n'));

    ERROR = oRes.error;
    MESSAGE = oRes.errorMessage;
    if(ERROR != 0) oLib.toLog(MESSAGE);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
} catch(err) {
    EnableLog('error')
    LogEvent("error","RemoteCollection: GetEducationPlanTutors:\r\n" + err);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + err);
}