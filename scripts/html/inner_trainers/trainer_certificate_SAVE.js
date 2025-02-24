<%
// 7127204375175819280
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function save(dossierDoc, dossierDocTE, mode, code, programId, certificationResult, certificateDate, educationDate, serial) {
    eval("dossierDocTE." + code + " = " + programId);
    eval("dossierDocTE." + code + "_result = '" + certificationResult + "'");
    if (certificationResult == "сертифицирован") {
        programList = ArrayDirect(XQuery("sql: " +
            " SELECT ems.name " +
            " FROM [WTDB].[dbo].education_methods ems " +
            " WHERE ems.id = " + programId));

        if(ArrayCount(programList) == 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Education method with ID " + programId + " is not exist!");

            throw new Exception("Person with ID " + personId + " is not exist!");
        }

        certificateDoc = tools.create_certificate_to_person(personId, 7057492735637724805);
        certificateDoc.TopElem.serial = serial;
        certificateDoc.TopElem.delivery_date = Date(certificateDate);
        certificateDoc.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = programList[0].name;

        certificateDoc.Save();

        createdCrtificateDoc = tools.open_doc(certificateDoc.DocID);

        if(createdCrtificateDoc == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Created certificate with ID " + certificateDoc.DocID + " is not exist!");

            throw new Exception("Created certificate with ID " + certificateDoc.DocID + " is not exist!");
        }

        createdCrtificateDocTE = createdCrtificateDoc.TopElem;

        splittedDate = certificateDate.split(".");

        if(ArrayCount(splittedDate) != 3) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong certificate date: " + certificateDate);

            throw new Exception("Wrong certificate date: " + certificateDate);
        }

        certificateNumber = serial + "-" + createdCrtificateDocTE.number + "/" + splittedDate[2];

        eval("dossierDocTE." + code + "_cert_date = Date('" + certificateDate + "')");
        eval("dossierDocTE." + code + "_cert_id = " + certificateDoc.DocID);
        eval("dossierDocTE." + code + "_cert = '" + certificateNumber + "'");
    }

    if (mode == "EXTRA" && ArrayCount(educationDate.split(".")) == 3) {
        eval("dossierDocTE." + code + "_event_date = Date('" + educationDate + "')");
    }

    dossierDoc.Save();
}

agentId = 7127204375175819280;
var loggerName = "agent_7127204375175819280";

var result = {};
result.errorMessage = "";

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    programId = OptInt(Request.Query.GetOptProperty("prog"));
    mode = Request.Query.GetOptProperty("mode");
    certificationResult = Request.Query.GetOptProperty("res");
    educationDate = Request.Query.GetOptProperty("edu", "");
    certificateDate = Request.Query.GetOptProperty("cert");
    serial = Request.Query.GetOptProperty("serial");
    sendNotification = Request.Query.GetOptProperty("noti");
    code = Request.Query.GetOptProperty("code");

    if(StrCharCount(certificationResult) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Empty certification's result!");

        throw new Error("Empty certification's result!");
    }

    if(certificationResult == "сертифицирован" && StrCharCount(certificateDate) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Mode is 'certificated' but certification's date is empty!");

        throw new Error("Mode is 'certificated' but certification's date is empty!");
    }

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
        " WHERE doss.trainer_id = " + personId));

    dossiersCount = ArrayCount(personDossiers);

    if(dossiersCount > 1) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] More than one dossiers for person with ID " + personId + " found");

        throw new Exception("More than one dossiers for person with ID " + personId + " found");
    }

    dossierDoc = null;
    dossierDocTE = null;

    personDoc = tools.open_doc(personId);

    if(personDoc == undefined) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + personId + " is not exist!");

        throw new Exception("Collaborator with ID " + personId + " is not exist!");
    }

    if(dossiersCount == 0) {
        personData = ArrayDirect(XQuery("sql: " +
            " SELECT ps.name AS position_name, " +
            "       os.code AS inn, " +
            "       os.name AS org_name, " +
            "       rs.name AS region_name, " +
            "       rep_rs.name AS report_region_name, " +
            "       cs.email, " +
            "       cs.phone " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
            "    LEFT JOIN [WTDB].[dbo].regions AS rep_rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rep_rs.id " +
            " WHERE cs.id = " + personId));

        dossierDoc = tools.new_doc_by_name( "cc_dossier_vntren_2025", false )
        dossierDoc.BindToDb(DefaultDb);

        dossierDocTE = dossierDoc.TopElem;

        dossierDocTE.trainer_id = personId;
        dossierDocTE.trainer_fullname = personDoc.TopElem.fullname;

        if(ArrayCount(personData) == 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Person with ID " + personId + " is not exist!");

            throw new Exception("Person with ID " + personId + " is not exist!");
        }

        dossierDocTE.position_trainer = personData[0].position_name;
        dossierDocTE.organization_inn = personData[0].inn;
        dossierDocTE.organization_name = personData[0].org_name;
        dossierDocTE.region_organization = personData[0].region_name;
        dossierDocTE.region_in_reporting = personData[0].report_region_name;
        dossierDocTE.email = personData[0].email;
        dossierDocTE.phone = personData[0].phone;

        dossierDoc.Save();

        dossierDoc = tools.open_doc(dossierDoc.DocID);

        dossierDocTE = dossierDoc.TopElem;
    } else {
        dossierDoc = tools.open_doc(personDossiers[0].id);

        if(dossierDoc == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + personDossiers[0].id + " is not exist!");

            throw new Exception("Dossier with ID " + personDossiers[0].id + " is not exist!");
        }

        dossierDocTE = dossierDoc.TopElem;
    }

    result.activeCode = code;

    if(mode == "BASE") {
        personDossiers = ArrayDirect(XQuery("sql: " +
            " SELECT doss.id, dos.data.exist('(//" + code + ")') AS code FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 dos ON doss.id = dos.id WHERE doss.trainer_id = " + personId));

        if (ArrayCount(personDossiers) == 1 && !personDossiers[0].code) {
            save(dossierDoc, dossierDocTE, mode, code, programId, certificationResult, certificateDate, educationDate, serial);
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] BASE. Wrong sql result for code = " + code + ". SQL statement MUST returns 1 record.");

            throw new Exception("BASE. Wrong sql result for code = " + code + ". SQL statement must returns 1 record.");
        }
    } else if(mode == "EXTRA") {
        personDossiers = ArrayDirect(XQuery("sql: " +
            " SELECT doss.id, " +
            "       dos.data.value('(//dop_1)[1]', 'varchar(max)') AS dop1, " +
            "       dos.data.value('(//dop_2)[1]', 'varchar(max)') AS dop2, " +
            "       dos.data.value('(//dop_3)[1]', 'varchar(max)') AS dop3, " +
            "       dos.data.value('(//dop_4)[1]', 'varchar(max)') AS dop4, " +
            "       dos.data.value('(//dop_5)[1]', 'varchar(max)') AS dop5, " +
            "       dos.data.value('(//dop_6)[1]', 'varchar(max)') AS dop6 " +
            " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
            "         INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 dos ON doss.id = dos.id " +
            " WHERE doss.trainer_id = " + personId));

        if (ArrayCount(personDossiers) == 1) {
            for(i = 1; i <= 6; i++) {
                if(eval("personDossiers[0].dop" + i + " == ''")) {
                    result.activeCode = "dop_" + i;

                    save(dossierDoc, dossierDocTE, mode, result.activeCode, programId, certificationResult, certificateDate, educationDate, serial);

                    break;
                }
            }
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] EXTRA. Wrong sql result for code = " + code + ". SQL statement MUST returns 1 record.");

            throw new Exception("EXTRA. Wrong sql result for code = " + code + ". SQL statement MUST returns 1 record.");
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>