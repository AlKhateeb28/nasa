<%
// 7307692369401052853
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7307692369401052853;
var loggerName = "web_7307692369401052853";

var result = {};
result.errorMessage = "";
result.message = "";
result.surveys = [];
result.enableSave = true;

try {
    jsonParam = Request.Query.GetOptProperty("json");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    surveyObject = ParseJson(jsonParam);

    surveyList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].cc_person_profiles " +
        " WHERE education_program_id = " + surveyObject.educationProgramId +
        " ORDER BY cr_date DESC "));

    if (ArrayCount(surveyList) == 0) {
        personProfileDoc = tools.new_doc_by_name("cc_person_profile", false);
        personProfileDoc.BindToDb(DefaultDb);

        personProfileDocTE = personProfileDoc.TopElem;

        personProfileDocTE.person_id = curUserID;
        personProfileDocTE.education_program_id = OptInt(surveyObject.educationProgramId);
        personProfileDocTE.start_date = Date(surveyObject.startDate);
        personProfileDocTE.email = surveyObject.email;
        personProfileDocTE.fio = surveyObject.fio;
        personProfileDocTE.is_change_fio = surveyObject.isChangeFio;
        personProfileDocTE.education_level = surveyObject.educationLevel;
        personProfileDocTE.sex = surveyObject.sex;
        personProfileDocTE.passport = surveyObject.passport;
        personProfileDocTE.snils = surveyObject.snils;
        personProfileDocTE.birth_date = surveyObject.birthDate;
        personProfileDocTE.reciept_method = surveyObject.recieptMethod;
        personProfileDocTE.confirmation = surveyObject.confirmation;
        personProfileDocTE.can_get_documents = surveyObject.canGetDocuments;
        personProfileDocTE.cr_date = Date();

        personProfileDoc.Save();
    } else {
        result.enableSave = false;
    }

    surveyList = ArrayDirect(XQuery("sql: " +
        " SELECT TOP 5 cpp.id, " +
        "       eps.name, " +
        "       FORMAT(cpp.cr_date, 'dd-MM-yyyy HH:mm:ss') AS created_date " +
        " FROM [WTDB].[dbo].cc_person_profiles cpp " +
        "     INNER JOIN [WTDB].[dbo].education_programs eps ON cpp.education_program_id = eps.id " +
        " WHERE cpp.person_id = " + curUserID +
        " ORDER BY cr_date DESC "));

    for (survey in surveyList) {
        element = {};
        element.id = survey.id;
        element.name = survey.name;
        element.createdDate = survey.created_date;

        result.surveys.push(element);
    }
        
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>