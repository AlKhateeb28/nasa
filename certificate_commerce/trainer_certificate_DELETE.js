<%
// 7136806679986788131
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7136806679986788131;
var loggerName = "agent_7136806679986788131";

var result = {};
result.errorMessage = "";

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    mode = Request.Query.GetOptProperty("mode");
    code = Request.Query.GetOptProperty("code");
    sendNotification = Request.Query.GetOptProperty("noti", "false");
    text = Request.Query.GetOptProperty("text", "");

    result.activeCode = code;

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT ds.id, " +
        "    d.data.value('(//" + code + "_cert_id)[1]', 'varchar(max)') AS cert_id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s ds " +
        "    INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 d ON ds.id = d.id " +
        " WHERE ds.trainer_id = " + personId));

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

    eval("dossierDocTE." + code + " = ''");
    eval("dossierDocTE." + code + "_result = ''");
    eval("dossierDocTE." + code + "_cert_date = ''");
    eval("dossierDocTE." + code + "_cert_id = ''");
    eval("dossierDocTE." + code + "_cert = ''");
    if (mode == "EXTRA") {
        eval("dossierDocTE." + code + "_event_date = ''");
    }

    dossierDoc.Save();

    if(personDossiers[0].cert_id != "") {
        DeleteDoc(UrlFromDocID(OptInt(personDossiers[0].cert_id)));
    }

    if(sendNotification == "true") {
        tools.create_notification("cert_vn_tr_delete", OptInt(personId), '"' + text + '"');
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>