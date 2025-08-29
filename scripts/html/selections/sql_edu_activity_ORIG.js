tools_app.clear_application_cache()

try
{
    var teApplication = tools_app.get_application("websoftcontinuouslearning");
    var oLib = tools_app.get_cur_application_lib(teApplication.id.Value);

    var iObjectID = OptInt(curObjectID,iCompoundProgramID);

    iParentID = OptInt(iParentID, null);
    if(iParentID == null && tools_web.is_true(bGetCurrentModule))
    {
        iParentID =  oLib.GetActualModule(iObjectID, curUserID).id;
    }

    var oRes = oLib.GetEducationPlanProgramsByParam(iObjectID , curUserID, bReturnTree, iParentID, sReturnType );
    if (IsArray(oRes.result) && ArrayOptFirstElem(oRes.result)!= undefined)
    {
        for (oResElem in oRes.result)
        {
            if (OptDate(oResElem.plan_date, undefined) != undefined)
            {
                oResElem.SetProperty("plan_date_str", tools.call_code_library_method ("libSchedule", "get_str_date_from_date", [Date(oResElem.plan_date)]).date_str);
            }

            if (OptDate(oResElem.finish_date, undefined) != undefined)
            {
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

}
catch(err)
{
    EnableLog('error');
    LogEvent("error","RemoteCollection: GetEducationPlanProgramsByParam:\r\n" +err); alert("QQQ=" + err);
}