<%
// 7134672182251616310
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getSqlFromCode(code) {
    if(code == 0) {
        return " AND cs.code LIKE '%load_muc%' ";
    } else {
        return " AND cs.code NOT LIKE '%_muc_%' ";
    }
}

agentId = 7134672182251616310;
var loggerName = "agent_7134672182251616310";

var result = {};
result.errorMessage = "";
result.personName = "";
result.inn = "";
result.organizationName = "";
result.certificateTypeId = "";
result.certificateTypeName = "";
result.certificates = [];

try {
    paramPersonId = Request.Query.GetOptProperty("person_id", null);
    paramType = OptInt(Request.Query.GetOptProperty("type", -1));

    addLogMessage(loggerName, "----------");

    if(paramPersonId != null && paramType >= 0) {
        certificateTypeId = null;

        if(paramType == 0) {
            certificateTypeId = 7171733281797140705;
        } else {
            certificateTypeId = 7264898518546059464;
        }

        result.id = paramPersonId;
        result.certificateTypeId = "" + certificateTypeId;

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.fullname, " +
            "       os.code AS inn, " +
            "       os.name AS name, " +
            "       ps.name AS position_name " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            " WHERE cs.id = " + paramPersonId));

        if(ArrayCount(dataList) > 0) {
            result.personName = dataList[0].fullname;
            result.positionName = dataList[0].position_name;
            result.inn = dataList[0].inn;
            result.organizationName = dataList[0].name;
        }

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT cts.id, " +
            "       cts.name " +
            " FROM [WTDB].[dbo].certificate_types cts " +
            " WHERE cts.id  = " + certificateTypeId));

        if(ArrayCount(dataList) > 0) {
            result.certificateTypeName = dataList[0].name;
        }

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.id, " +
            "       cs.serial, " +
            "       cs.number, " +
            "       cs.delivery_date, " +
            "       cs.expire_date, " +
            "       cs.valid, " +
            "       c.data.value('(//custom_elems/custom_elem[name=''form_dogovor_sootvet'']/value)[1]', 'varchar(max)') contract, " +
            "       c.data.value('(//custom_elems/custom_elem[name=''edu_prog_names'']/value)[1]', 'varchar(max)') programs " +
            " FROM [WTDB].[dbo].certificates cs " +
            "    INNER JOIN [WTDB].[dbo].certificate c ON cs.id = c.id " +
            " WHERE cs.type_id = " + certificateTypeId +
            "    AND cs.person_id = " + paramPersonId +
            " ORDER BY cs.delivery_date DESC "));

        for (data in dataList) {
            element = {};
            element.id = "" + data.id;
            element.serial = data.serial;
            element.number = data.number;
            element.deliveryDate = data.delivery_date == "" ? "" : StrDate(data.delivery_date, false, false);
            element.expireDate = data.expire_date == "" ? "" : StrDate(data.expire_date, false, false);
            element.isValid = data.valid;
            element.contract = data.contract;
            element.programs = data.programs;

            result.certificates.push(element);
        }
    } else {
        throw new Error("Wrong or empty incoming parameters!");
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>