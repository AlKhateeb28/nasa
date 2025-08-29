//tools_app.clear_application_cache()

try
{
    var teApplication = tools_app.get_application("websoftcontinuouslearning");
    var oLib = tools_app.get_cur_application_lib(teApplication.id.Value);
    var iProgID = OptInt(curObjectID, iObjectID);
    var oRes = oLib.GetEducationPlanTutorsCustom(iProgID, iPersonID);

    RESULT = oRes.result;

    //oLib.toLog("RESULT: " + EncodeJson(RESULT));
    //oLib.toLog("URLs: " + ArrayMerge(RESULT, 'This.activity_url', '\r\n'));

    ERROR = oRes.error;
    MESSAGE = oRes.errorMessage;
    if(ERROR != 0) oLib.toLog(MESSAGE);
}
catch(err)
{
    EnableLog('error')
    LogEvent("error","RemoteCollection: GetEducationPlanTutors:\r\n" + err);
}