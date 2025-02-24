<%
// 7126548019478755931
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7126548019478755931;
var loggerName = "agent_7126548019478755931";

var result = {};
result.errorMessage = "";

try {
    personId = OptInt(Request.Query.GetOptProperty("person_id"));
    activeCode = Request.Query.GetOptProperty("active_code", null);

    addLogMessage(loggerName, "----------");

    result.personId = "" + personId;
    result.personName = "";
    result.isCollaboratorExist = false;
    result.org_name = null;
    result.org_code = null;
    result.baseProgram = [];
    result.extraProgram = [];
    result.certificate_id = "";
    result.certificate_result = "";
    result.education_date = "";
    result.certificate_date = "";
    result.serial = "";

    collaboratorDoc = tools.open_doc(personId);

    if(collaboratorDoc != undefined) {
        result.isCollaboratorExist = true;
        result.personName = collaboratorDoc.TopElem.fullname;

        orgDoc = tools.open_doc(collaboratorDoc.TopElem.org_id);

        if(orgDoc != undefined) {
            result.org_name = orgDoc.TopElem.name;
            result.org_code = orgDoc.TopElem.code;
        }
    }

    baseList = ArrayDirect(XQuery("sql: " +
        " SELECT ems.id, " +
        "       ems.name, " +
        "       em.data.value('(//custom_elems/custom_elem[name=''vn_tren_code'']/value)[1]', 'varchar(max)') AS code " +
        " FROM [WTDB].[dbo].education_methods ems" +
        "       INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
        " WHERE ems.code = 'cert_vn_tren_base' " +
        " ORDER BY ems.name "));

    count = 0;

    for(base in baseList) {
        name = base.name;

        addLogMessage(loggerName, ">>> " + base.code + " Exist: " + result.isCollaboratorExist);

        if (activeCode == null && count == 0) {
            activeCode = base.code;
        }

        if (result.isCollaboratorExist) {
            dossierList = ArrayDirect(XQuery("sql: " +
                " SELECT doss.id, " +
                "        dos.data.value('(//" + base.code+ ")[1]', 'varchar(max)') AS prog_id, " +
                "        dos.data.value('(//" + base.code + "_result)[1]', 'varchar(max)') AS result, " +
                "        dos.data.value('(//" + base.code + "_cert_date)[1]', 'varchar(max)') AS date, " +
                "        dos.data.value('(//" + base.code + "_cert_id)[1]', 'varchar(max)') AS certificate_id " +
                " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
                "       INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 dos ON doss.id = dos.id " +
                " WHERE doss.trainer_id = " + personId));

            if (ArrayCount(dossierList) > 0) {
                addLogMessage(loggerName, "Cert.ID: " + dossierList[0].certificate_id);

                if (StrCharCount(dossierList[0].certificate_id) > 0) {
                    name = "&#9873; " + name;
                } else {
                    if (dossierList[0].result != "" && dossierList[0].result != "сертифицирован") {
                        name = "&#9872; " + name;
                    }
                }
            }
        }

        element = {};
        element.id = base.id;
        element.name = name;
        element.code = base.code;
        element.type = "BASE";

        result.baseProgram.push(element);

        count++;
    }

    extraList = ArrayDirect(XQuery("sql: " +
        " SELECT ems.id, " +
        "       ems.name, " +
        "       em.data.value('(//custom_elems/custom_elem[name=''vn_tren_code'']/value)[1]', 'varchar(max)') AS code " +
        " FROM [WTDB].[dbo].education_methods ems " +
        "       INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
        " WHERE ems.code = 'cert_vn_tren_extra' " +
        " ORDER BY ems.name "));

    if(ArrayCount(extraList) > 0) {
        takenCount = 0;

        for(extra in extraList) {
            isTaken = 0;

            name = extra.name;
            code = extra.code;

            for(i = 1; i <=6; i++) {
                if (result.isCollaboratorExist) {
                    dossierList = ArrayDirect(XQuery("sql: " +
                        " SELECT doss.id, " +
                        "        dos.data.value('(//dop_" + i + ")[1]', 'varchar(max)') AS prog_id, " +
                        "        dos.data.value('(//dop_" + i + "_result)[1]', 'varchar(max)') AS result, " +
                        "        dos.data.value('(//dop_" + i + "_cert_date)[1]', 'varchar(max)') AS date, " +
                        "        dos.data.value('(//dop_" + i + "_cert_id)[1]', 'varchar(max)') AS certificate_id " +
                        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
                        "       INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 dos ON doss.id = dos.id " +
                        " WHERE doss.trainer_id = " + personId));

                    if (ArrayCount(dossierList) > 0 && OptInt(extra.id) == OptInt(dossierList[0].prog_id)) {
                        if (StrCharCount(dossierList[0].certificate_id) > 0) {
                            name = "&#9873; " + name;
                            code = "dop_" + i;

                            isTaken = 1;
                            takenCount++;
                        } else {
                            if (dossierList[0].result != "" && dossierList[0].result != "сертифицирован") {
                                name = "&#9872; " + name;
                                code = "dop_" + i;

                                isTaken = 1;
                                takenCount++;
                            }
                        }

                        break;
                    }
                }
            }

            element = {};
            element.id = extra.id;
            element.name = name;
            element.code = code;
            element.type = "EXTRA";
            element.isTaken = isTaken;

            result.extraProgram.push(element);
        }
    }

    addLogMessage(loggerName, "ActiveCode: " + activeCode);

    result.takenCount = takenCount;

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
        " WHERE doss.trainer_id = " + personId));

    result.sameDossiers = ArrayCount(personDossiers);

    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//" + activeCode + ")[1]', 'varchar(max)') AS prog_id, " +
        "       dos.data.value('(//" + activeCode + "_cert)[1]', 'varchar(max)') AS cert_number, " +
        "       dos.data.value('(//" + activeCode + "_result)[1]', 'varchar(max)') AS result, " +
        "       dos.data.value('(//" + activeCode + "_cert_date)[1]', 'varchar(max)') AS date, " +
        (StrBegins(activeCode, "dop") ? " dos.data.value('(//" + activeCode + "_event_date)[1]', 'varchar(max)') AS education_date, " : "") +
        "       dos.data.value('(//" + activeCode + "_cert_id)[1]', 'varchar(max)') AS certificate_id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s doss " +
        "    INNER JOIN [WTDB].[dbo].cc_dossier_vntren_2025 dos ON doss.id = dos.id " +
        " WHERE doss.trainer_id = " + personId));

    if(ArrayCount(dossierList) > 0) {
        result.certificate_id = dossierList[0].certificate_id;
        result.certificate_result = dossierList[0].result;
        result.certificate_number = dossierList[0].cert_number;

        if(StrCharCount(dossierList[0].date) > 0) {
            result.certificate_date = StrDate(Date(dossierList[0].date), false, false);
        }
        if(StrBegins(activeCode, "dop") && StrCharCount(dossierList[0].education_date) > 0) {
            result.education_date = StrDate(Date(dossierList[0].education_date), false, false);
        }

        certificateList = ArrayDirect(XQuery("sql: " +
            " SELECT serial " +
            " FROM [WTDB].[dbo].certificates " +
            " WHERE id = " + dossierList[0].certificate_id));

        if(ArrayCount(certificateList) > 0) {
            result.serial = certificateList[0].serial;
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>