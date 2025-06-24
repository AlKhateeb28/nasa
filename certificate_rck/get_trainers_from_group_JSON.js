<%
// 7169347037562560804
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7169347037562560804;
var loggerName = "agent_7169347037562560804";

var result = {};
result.errorMessage = "";
result.trainerGroups = [];

try {
    result.groups = [];
    result.groups.push(7109814009294647976);
    result.groups.push(6714591269572595737);

    for(group in result.groups) {
        groupDoc = tools.open_doc(group);

        if (groupDoc == undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID 7122453257583417322 is not exist");

            throw new Error("Group with ID " + group + " is not exist")
        }

        trainersGroup = {};
        trainersGroup.groupId = "" + group;
        trainersGroup.name = groupDoc.TopElem.name;
        trainersGroup.members = [];

        members = [];

        for (collaborator in groupDoc.TopElem.collaborators) {
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.fullname, " +
                "       cs.email, " +
                "       os.name, " +
                "       os.code, " +
                "       cs.is_dismiss, " +
                "       cs.id" +
                " FROM [WTDB].[dbo].collaborators cs " +
                "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                " WHERE cs.id = " + OptInt(collaborator.collaborator_id)));

            if (ArrayCount(dataList) > 0) {
                element = {};
                element.id = "" + dataList[0].id;
                element.fio = dataList[0].fullname;
                element.email = dataList[0].email;
                element.org_name = dataList[0].name;
                element.inn = dataList[0].code;
                element.isDismiss = dataList[0].is_dismiss;

                members.push(element);
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + collaborator.collaborator_id + " is not exist");
            }
        }

        sortGroup = ArraySort(members, "fio", "+");

        for(member in sortGroup) {
            trainersGroup.members.push(member);
        }

        result.trainerGroups.push(trainersGroup);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>