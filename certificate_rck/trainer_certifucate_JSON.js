<%
// 7169385969806241611
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getProgramNamePrefixByIndex(index, personId) {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''result_" + index + "'']/value)[1]', 'varchar(max)') AS result, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''certificate_" + index + "'']/value)[1]', 'bigint') AS certificate " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "         INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + personId +
        "       AND doss.object_data_type_id = 7103978283796946164"));

    if(ArrayCount(dataList) > 0) {
        if(dataList[0].result == "Сертифицировать" && dataList[0].certificate != null) {
            return "&#9873; ";
        } else {
            if(dataList[0].result == "Не сертифицировать" && dataList[0].certificate == null) {
                return "&#9872; ";
            } else {
                return "";
            }
        }
    }

    return "";
}

agentId = 7169385969806241611;
var loggerName = "agent_7169385969806241611";

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
    result.flag = 0;
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

    // RP PROGRAMS
    element = {};
    element.name = getProgramNamePrefixByIndex(13, personId) + "РП РЦК,  подготовка в ФЦК";
    element.index = 13;
    element.certificateTypeId = "" + 7164453267946338582;
    element.serial = "РП";
    result.rpProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(14, personId) + "РП РЦК, самостоятельная подготовка";
    element.index = 14;
    element.certificateTypeId = "" + 7164453663916057169;
    element.serial = "РП";
    result.rpProgram.push(element);

    // BASE PROGRAMS
    element = {};
    element.name = getProgramNamePrefixByIndex(1, personId) + "Основы бережливого производства";
    element.index = 1;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.baseProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(2, personId) + "Реализация проекта по улучшению";
    element.index = 2;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.baseProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(3, personId) + "Система 5С";
    element.index = 3;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.baseProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(4, personId) + "Картирование";
    element.index = 4;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.baseProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(5, personId) + "Производственный анализ";
    element.index = 5;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.baseProgram.push(element);

    // EXTRA PROGRAMS
    element = {};
    element.name = getProgramNamePrefixByIndex(6, personId) + "Стандартизированная работа";
    element.index = 6;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.extraProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(7, personId) + "Быстрая переналадка SMED";
    element.index = 7;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.extraProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(8, personId) + "Автономное обслуживание оборудования";
    element.index = 8;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.extraProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(9, personId) + "Анализ эффективности оборудования (ОЕЕ)";
    element.index = 9;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.extraProgram.push(element);

    element = {};
    element.name = getProgramNamePrefixByIndex(10, personId) + "Методика решения проблем";
    element.index = 10;
    element.certificateTypeId = "" + 7164452761309690093;
    element.serial = "Т";
    result.extraProgram.push(element);

    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT doss.id, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''result_" + activeCode + "'']/value)[1]', 'varchar(max)') AS doss_result, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''date_" + activeCode + "'']/value)[1]', 'varchar(max)') AS doss_date, " +
        "       CAST(dos.data.value('(//custom_elems/custom_elem[name=''flag" + activeCode + "'']/value)[1]', 'bit') AS INT) AS doss_flag, " +
        "       dos.data.value('(//custom_elems/custom_elem[name=''certificate_" + activeCode + "'']/value)[1]', 'varchar(max)') AS doss_certificate " +
        " FROM [WTDB].[dbo].object_datas doss " +
        "       INNER JOIN [WTDB].[dbo].object_data dos ON doss.id = dos.id " +
        " WHERE doss.object_id = " + OptInt(personId) +
        "       AND doss.object_data_type_ID = 7103978283796946164"));

    addLogMessage(loggerName, "Count: " + ArrayCount(dossierList));

    if (ArrayCount(dossierList) > 0) {
        result.certificate_id = OptInt(dossierList[0].doss_certificate);
        result.certificate_result = dossierList[0].doss_result;
        result.flag = dossierList[0].doss_flag;

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