<%
// 7134978122771741241
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

agentId = 7134978122771741241;
var loggerName = "agent_7134978122771741241";

var result = {};
result.errorMessage = "";
result.message = "";
result.id = "";

try {
    addLogMessage(loggerName, "----------");

    personId = Request.Query.GetOptProperty("person_id");
    serial = Request.Query.GetOptProperty("serial");
    delivery = Request.Query.GetOptProperty("delivery");
    expire = Request.Query.GetOptProperty("expire");
    valid = Request.Query.GetOptProperty("valid");
    contract = Request.Query.GetOptProperty("contract");
    programs = Request.Query.GetOptProperty("programs");
    typeId = Request.Query.GetOptProperty("type");

    if(StrCharCount(personId) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Person ID  is empty!");

        throw new Error("Person ID is empty!");
    }

    if(StrCharCount(serial) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Serial is empty!");

        throw new Error("Serial is empty!");
    }

    if(StrCharCount(delivery) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Certification's date is empty!");

        throw new Error("Certification's date is empty!");
    } else {
        deliveryDateList = delivery.split(".");

        if(ArrayCount(deliveryDateList) != 3) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong date format of delivery date!");

            throw new Error("Wrong date format of delivery date!");
        }
    }

    if(StrCharCount(expire) > 0) {
        expireDateList = expire.split(".");

        if(ArrayCount(expireDateList) != 3) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Wrong date format of expire date!");

            throw new Error("Wrong date format of expire date!");
        }
    }

    if(StrCharCount(typeId) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Type ID  is empty!");

        throw new Error("Type ID is empty!");
    }

    certificateDoc = tools.create_certificate_to_person(OptInt(personId), OptInt(typeId));
    certificateDoc.TopElem.serial = serial;
    certificateDoc.TopElem.delivery_date = Date(delivery);
    if(StrCharCount(expire) > 0) {
        certificateDoc.TopElem.expire_date = Date(expire);
    }
    certificateDoc.TopElem.valid = valid;
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("form_dogovor_sootvet").value = contract;
    certificateDoc.TopElem.custom_elems.ObtainChildByKey("edu_prog_names").value = programs;

    certificateDoc.Save();

    result.id = "" + certificateDoc.DocID;
    result.message = "SAVED";

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>