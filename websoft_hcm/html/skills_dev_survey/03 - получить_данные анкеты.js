<%
// 7307725910644353511
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7307725910644353511;
var loggerName = "web_7307725910644353511";

var result = {};
result.errorMessage = "";
result.message = "";

try {    
    idParam = Request.Query.GetOptProperty("id");
    if (idParam == undefined || idParam == "") {
        idParam = "0000000000000000000";
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    personProfileDoc = tools.open_doc(idParam);

    if (personProfileDoc != undefined) {
        personProfileDocTE = personProfileDoc.TopElem;

        result.id = personProfileDocTE.id;
        result.personId = personProfileDocTE.person_id;
        result.educationProgramId = personProfileDocTE.education_program_id;
        result.startDate = StrDate(personProfileDocTE.start_date, false, false);
        result.email = personProfileDocTE.email;
        result.fio = personProfileDocTE.fio;
        result.isChangeFio = personProfileDocTE.is_change_fio;
        result.educationLevel = personProfileDocTE.education_level;
        result.passport = personProfileDocTE.passport;
        result.snils = personProfileDocTE.snils;
        result.personId = personProfileDocTE.person_id;
        result.birthDate = StrDate(personProfileDocTE.birth_date, false, false);
        result.recieptMethod = personProfileDocTE.reciept_method;
        result.confirmation = personProfileDocTE.confirmation;
        result.canGetDocuments = personProfileDocTE.can_get_documents;
    }

    result.message = "Agent is started";
    
    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>