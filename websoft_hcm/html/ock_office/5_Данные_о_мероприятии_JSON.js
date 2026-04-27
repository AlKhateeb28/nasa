<%
// 7265547476708537900
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7265547476708537900;
var loggerName = "web_7265547476708537900";

var result = {};
result.errorMessage = "";
result.message = "";

try {
    result.isBlocked = false;

    idParam = Request.Query.GetOptProperty("id");
    if (idParam == undefined || idParam == "") {
        idParam = "0000000000000000000";
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    eventDoc = tools.open_doc(idParam);

    if (eventDoc != undefined) {
        eventDocTE = eventDoc.TopElem;

        result.id = eventDocTE.id;
        result.status = eventDocTE.status_id;
        result.name = eventDocTE.name;
        result.startDate = StrDate(eventDocTE.start_date, false);
        result.finishDate = StrDate(eventDocTE.finish_date, false);
        result.nps = eventDocTE.custom_elems.ObtainChildByKey("nps").value;
        result.comment = eventDocTE.comment;

        result.eduMethodId = "0000000000000000000";
        result.eduMethodName = "";

        eduMetodDoc = tools.open_doc(eventDocTE.education_method_id);

        if (eduMetodDoc != undefined) {
            eduMetodDocTE = eduMetodDoc.TopElem;

            result.eduMethodId = eduMetodDocTE.id;
            result.eduMethodName = eduMetodDocTE.name;
        }

        result.tutors = [];
        for (tutor in eventDocTE.tutors) {
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.id, " +
                " 		os.code AS inn, " +
                "		cs.fullname AS name, " +
                "		ps.id AS position_id, " +
                "		ps.name AS position_name " +
                " FROM [WTDB].[dbo].collaborators cs " +
                "	INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                " 	INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
                " WHERE cs.id = " + tutor.collaborator_id));

            if (ArrayCount(dataList) > 0) {
                element = {};

                element.id = dataList[0].id;
                element.inn = dataList[0].inn;
                element.name = dataList[0].name;
                element.positionId = dataList[0].position_id;
                element.positionName = dataList[0].position_name;

                result.tutors.push(element);
            }
        }

        result.persons = [];

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.id, " +
            " 		os.code AS inn, " +
            " 		cs.fullname AS name, " +
            "		ps.id AS position_id, " +
            "		ps.name AS position_name " +
            " FROM [WTDB].[dbo].event_results ers " +
            "	INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
            " 	INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "	INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            " WHERE ers.event_id = " + idParam));

        for (data in dataList) {
            element = {};

            element.id = data.id;
            element.inn = data.inn;
            element.name = data.name;
            element.positionId = data.position_id;
            element.positionName = data.position_name;

            result.persons.push(element);
        }

        day = Day(Date());
        month = Month(Date());
        year = Year(Date());

        first = Date("01." + month + "." + year + " 00:00:00");
        last = Date("05." + month + "." + year + " 23:59:59");

        if (first <= Date() && Date() <= last) {
            if (eventDocTE.finish_date < first) {
                result.isBlocked = true;
            }
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>