<%
// 7170770401108980357
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7170770401108980357;
var loggerName = "agent_7170770401108980357";

var result = {};
result.errorMessage = "";

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    code = Request.Query.GetOptProperty("code");
    sendNotification = Request.Query.GetOptProperty("noti", "false");
    text = Request.Query.GetOptProperty("text", "");

    result.activeCode = code;

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''certificate_" + code + "'']/value)[1]', 'varchar(max)') AS certificate_id " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "       INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + personId +
        "       AND doss.object_data_type_id = 7103978283796946164"));

    dossiersCount = ArrayCount(personDossiers);

    if(dossiersCount == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossiers with person ID " + personId + " is not exist");

        throw new Exception("More than one dossiers for person with ID " + personId + " found");
    } else if(dossiersCount > 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] More than one dossiers for person with ID " + personId + " found");

        throw new Exception("More than one dossiers for person with ID " + personId + " found");
    }

    dossierDoc = tools.open_doc(personDossiers[0].id);

    if(dossierDoc == undefined) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossiers with person ID " + personId + " not found");

        throw new Exception("More than one dossiers for person with ID " + personId + " found");
    }

    dossierDocTE = dossierDoc.TopElem;

    eval("dossierDocTE.custom_elems.ObtainChildByKey('result_" + code  + "').value = ''");
    eval("dossierDocTE.custom_elems.ObtainChildByKey('date_" + code  + "').value = ''");
    eval("dossierDocTE.custom_elems.ObtainChildByKey('comment_" + code  + "').value = ''");
    eval("dossierDocTE.custom_elems.ObtainChildByKey('flag_" + code  + "').value = 'false'");
    eval("dossierDocTE.custom_elems.ObtainChildByKey('certificate_" + code  + "').value = ''");

    dossierDoc.Save();

    if(personDossiers[0].certificate_id != "") {
        DeleteDoc(UrlFromDocID(OptInt(personDossiers[0].certificate_id)));
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Noti: " + sendNotification);

    if(sendNotification == "true") {
        if (OptInt(code) == 13 || OptInt(code) == 14) {
            text = "Руководитель проекта";
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Sent");

        tools.create_notification("cert_vn_tr_delete", OptInt(personId), '"' + text + '"');
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>