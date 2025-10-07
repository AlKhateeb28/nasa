<%
// 7205448492112338122
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function save(dossierDoc, dossierDocTE, personId, code, program, certificationResult, certificateDate, serial, sendNotification, certificateTypeId) {
    personId = OptInt(personId);

    eval("dossierDocTE.custom_elems.ObtainChildByKey('ss_result_" + code  + "').value = '" + certificationResult + "'");
    if(certificateDate != "") {
        eval("dossierDocTE.custom_elems.ObtainChildByKey('ss_date_" + code  + "').value = '" + certificateDate + "'");
    }

    certificateDoc = null;

    if (certificationResult == "Сертифицировать") {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT os.name " +
            " FROM [WTDB].[dbo].collaborators cs" +
            "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            " WHERE cs.id = " + personId));

        if(ArrayCount(dataList) == 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Person with ID " + personId + " is not exist!");

            throw "Person with ID " + personId + " is not exist!";
        }

        certificateDoc = tools.create_certificate_to_person(personId, OptInt(certificateTypeId));
        certificateDoc.TopElem.serial = serial;
        certificateDoc.TopElem.delivery_date = Date(certificateDate);
        certificateDoc.TopElem.custom_elems.ObtainChildByKey("programm_name").value = program;
        certificateDoc.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = program;
        certificateDoc.TopElem.custom_elems.ObtainChildByKey("org_name").value = dataList[0].name;

        certificateDoc.Save();

        eval("dossierDocTE.custom_elems.ObtainChildByKey('ss_cert_" + code  + "_id').value = " + certificateDoc.DocID);
    }

    dossierDoc.Save();

    if(sendNotification == "true") {
        if (certificationResult == "Сертифицировать") {
            templateCode = "cert_ock_ss_tren_print";

            if (code == "rp" || code == "am") {
                templateCode = "cert_ock_ss_rp_am_print";
            }

            if(personId == 7351734047845980789 || personId == 6743923349751162819) {
                tools.create_notification(templateCode, personId, "", OptInt(certificateDoc.DocID));
            }
        }/* else {
            templateCode = "cert_tr_rck_cancel";

            if (code == "" || code == "") {
                templateCode = "cert_tr_rck_cancel_rp";
            }

            message = program;
            tools.create_notification(templateCode, OptInt(personId), message);
        }*/
    }
}

agentId = 7205448492112338122;
var loggerName = "agent_7205448492112338122";

var result = {};
result.errorMessage = "";

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    program = Request.Query.GetOptProperty("program");
    certificationResult = Request.Query.GetOptProperty("res");
    certificateDate = Request.Query.GetOptProperty("cert");
    serial = Request.Query.GetOptProperty("serial");
    sendNotification = Request.Query.GetOptProperty("noti");
    code = Request.Query.GetOptProperty("code");
    type = Request.Query.GetOptProperty("type");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Program: " + program);

    if(StrCharCount(certificationResult) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Empty certification's result!");

        throw new Error("Empty certification's result!");
    }

    if(certificationResult == "Сертифицировать" && StrCharCount(certificateDate) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Mode is 'certificated' but certification's date is empty!");

        throw new Error("Mode is 'certificated' but certification's date is empty!");
    }

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id " +
        " FROM [WTDB].[dbo].object_datas doss " +
        " WHERE doss.object_id = " + personId +
        "       AND doss.object_data_type_id = 7205394578516177541"));

    dossiersCount = ArrayCount(personDossiers);

    if(dossiersCount > 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] More than one dossiers for person with ID " + personId + " found");

        throw "More than one dossiers for person with ID " + personId + " found";
    }

    dossierDoc = null;
    dossierDocTE = null;

    personDoc = tools.open_doc(personId);

    if(personDoc == undefined) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + personId + " is not exist!");

        throw "Collaborator with ID " + personId + " is not exist!";
    }

    if(dossiersCount == 0) {
        personData = ArrayDirect(XQuery("sql: " +
            " SELECT cs.fullname " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            " WHERE cs.id = " + personId));

        if(ArrayCount(personData) == 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Person with ID " + personId + " is not exist!");

            throw "Person with ID " + personId + " is not exist!";
        }

        dossierDoc = tools.new_doc_by_name( "object_data", false )
        dossierDoc.BindToDb(DefaultDb);

        dossierDocTE = dossierDoc.TopElem;

        dossierDocTE.name = personData[0].fullname;
        dossierDocTE.object_data_type_id = 7205394578516177541;
        dossierDocTE.status_id = "active"
        dossierDocTE.object_type = "collaborator"
        dossierDocTE.object_id = OptInt(personId);
        dossierDocTE.object_name = personData[0].fullname;
        dossierDocTE.sec_object_type = "collaborator";
        dossierDocTE.sec_object_id = curUserID;
        dossierDocTE.is_std = 0;
        dossierDocTE.changed = 0;

        dossierDoc.Save();

        dossierDoc = tools.open_doc(dossierDoc.DocID);

        dossierDocTE = dossierDoc.TopElem;
    } else {
        dossierDoc = tools.open_doc(personDossiers[0].id);

        if(dossierDoc == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + personDossiers[0].id + " is not exist!");

            throw "Dossier with ID " + personDossiers[0].id + " is not exist!";
        }

        dossierDocTE = dossierDoc.TopElem;
    }

    result.code = code;
    result.program = program;

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "        dos.data.value('(//custom_elems/custom_elem[name=''ss_result_" + code + "'']/value)[1]', 'varchar(max)') AS result " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "    INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + personId +
        "       AND doss.object_data_type_id = 7205394578516177541"));

    if (ArrayCount(personDossiers) == 0) {
        save(dossierDoc, dossierDocTE, personId, code, program, certificationResult, certificateDate, serial, sendNotification, type);
    } else if(ArrayCount(personDossiers) == 1) {
        if(personDossiers[0].result != "Сертифицировать") {
            save(dossierDoc, dossierDocTE, personId, code, program, certificationResult, certificateDate, serial, sendNotification, type);
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BASE. Can't save certificated document!");

            throw "Can't save certificated document!";
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong sql result for code = " + code + ". SQL statement MUST returns 1 record. Found: " + ArrayCount(personDossiers));

        throw "Wrong sql result for code = " + code + ". SQL statement must returns 1 record.";
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>