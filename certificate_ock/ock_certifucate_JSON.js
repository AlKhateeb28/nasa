<%
// 7205436617131291755
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getCertificateByIndex(index, personId) {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''ss_result_" + index + "'']/value)[1]', 'varchar(max)') AS result, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''ss_cert_" + index + "_id'']/value)[1]', 'bigint') AS certificate_id " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "         INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + personId +
        "       AND doss.object_data_type_id = 7205394578516177541"));

    certificateData = {};
    certificateData.id = "";
    certificateData.prefix = "";

    if(ArrayCount(dataList) > 0) {
        if(dataList[0].result == "Сертифицировать" && dataList[0].certificate_id != null) {
            certificateData.id = dataList[0].certificate_id;
            certificateData.prefix = "&#9873; ";
        } else {
            if(dataList[0].result == "Не сертифицировать" && dataList[0].certificate_id == null) {
                certificateData.id = "";
                certificateData.prefix = "&#9872; ";
            }
        }
    }

    return certificateData;
}

agentId = 7205436617131291755;
var loggerName = "agent_7205436617131291755";

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
    result.rpProgram = [];
    result.baseProgram = [];
    result.extraProgram = [];
    result.certificate_id = "";
    result.certificate_result = "";
    result.certificate_date = "";
    result.isDeleteAvailable = 0;

    collaboratorDoc = tools.open_doc(personId);

    if (collaboratorDoc != undefined) {
        result.isCollaboratorExist = true;
        result.personName = collaboratorDoc.TopElem.fullname;

        orgDoc = tools.open_doc(collaboratorDoc.TopElem.org_id);

        if (orgDoc != undefined) {
            result.org_name = orgDoc.TopElem.name;
            result.org_code = orgDoc.TopElem.code;
        }
    }

    // BASE PROGRAMS
    certificateData = getCertificateByIndex("obp", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "Основы бережливого производства в социальной сфере";
    element.index = "obp";
    element.certificateTypeId = "" + 7129685550282174837;
    element.serial = "Т-С";
    element.printForm = "" + 7206147180817478603;
    result.baseProgram.push(element);

    certificateData = getCertificateByIndex("vsm", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "Картирование процессов в социальной сфере";
    element.index = "vsm";
    element.certificateTypeId = "" + 7129685550282174837;
    element.serial = "Т-С";
    element.printForm = "" + 7206147180817478603;
    result.baseProgram.push(element);

    certificateData = getCertificateByIndex("mrp", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "Методика решения проблем для социальной сферы";
    element.index = "mrp";
    element.certificateTypeId = "" + 7129685550282174837;
    element.serial = "Т-С";
    element.printForm = "" + 7206147180817478603;
    result.baseProgram.push(element);

    certificateData = getCertificateByIndex("5c", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "5С в организации социальной сферы";
    element.index = "5c";
    element.certificateTypeId = "" + 7129685550282174837;
    element.serial = "Т-С";
    element.printForm = "" + 7206147180817478603;
    result.baseProgram.push(element);

    // RP PROGRAMS
    certificateData = getCertificateByIndex("rp", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "Руководитель проекта";
    element.index = "rp";
    element.certificateTypeId = "" + 7129689286386417453;
    element.serial = "РП-С";
    element.printForm = "" + 7206147797616163353;
    result.rpProgram.push(element);

    // EXTRA PROGRAMS
    certificateData = getCertificateByIndex("am", personId);
    element = {};
    element.certificateId = certificateData.id;
    element.name = certificateData.prefix + "Аналитик-методолог";
    element.index = "am";
    element.certificateTypeId = "" + 7129689433552140002;
    element.serial = "А-С";
    element.printForm = "" + 7206147797616163353;
    result.extraProgram.push(element);

    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''ss_result_" + activeCode + "'']/value)[1]', 'varchar(max)') AS doss_result, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''ss_date_" + activeCode + "'']/value)[1]', 'varchar(max)') AS doss_date, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''ss_cert_" + activeCode + "_id'']/value)[1]', 'varchar(max)') AS doss_certificate " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "       INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + OptInt(personId) +
        "       AND doss.object_data_type_ID = 7205394578516177541"));

    addLogMessage(loggerName, "Count: " + ArrayCount(dossierList));

    if (ArrayCount(dossierList) > 0) {
        result.certificate_id = OptInt(dossierList[0].doss_certificate);
        result.certificate_result = dossierList[0].doss_result;

        if (StrCharCount(dossierList[0].doss_date) > 0) {
            result.certificate_date = StrDate(Date(dossierList[0].doss_date), false, false);
        }

        if(result.certificate_result == "Сертифицировать") {
            result.isDeleteAvailable = 1;
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>