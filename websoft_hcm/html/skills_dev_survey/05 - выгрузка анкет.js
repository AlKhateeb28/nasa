<%
// 7315826288883524378
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7315826288883524378;
var loggerName = "web_7315826288883524378";

var result = {};
result.errorMessage = "";
result.message = "";

var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

try {
    jsonParam = Request.Query.GetOptProperty("json");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    surveyObject = ParseJson(jsonParam);

    educationProgramIdSql = "";

    if (OptInt(surveyObject.educationProgramId) != 0) {
        educationProgramIdSql = " AND pp.education_program_id = " + surveyObject.educationProgramId;
    }

    surveyList = ArrayDirect(XQuery("sql: " +
        " SET DATEFORMAT dmy; " +
        " DECLARE @from datetime = '" + surveyObject.start + " 00:00:00'; " +
        " DECLARE @to datetime = '" + surveyObject.finish + " 23:59:59'; " +
        " SELECT pp.*, " +
        "       cs.fullname, " +
        "       os.code AS inn, " +
        "       os.name AS os_name, " +
        "       eps.name AS eps_name, " +
        "       pp.id, " +
        "       cs.id AS cs_id, " +
        "       os.id AS os_id " +
        " FROM [WTDB].[dbo].cc_person_profiles pp " +
        "       INNER JOIN [WTDB].[dbo].collaborators cs ON pp.person_id = cs.id " +
        "       INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "       INNER JOIN [WTDB].[dbo].education_programs eps ON pp.education_program_id = eps.id " +
        " WHERE pp.cr_date BETWEEN @from AND @to " +
        educationProgramIdSql +
        " ORDER BY pp.cr_date DESC "));

    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>ФИО</td>");
    reportString.AppendStr("<td class='header'>ИНН</td>");
    reportString.AppendStr("<td class='header'>Организация</td>");
    reportString.AppendStr("<td class='header'>Программа</td>");
    reportString.AppendStr("<td class='header'>Дата начала обучения</td>");
    reportString.AppendStr("<td class='header'>Email</td>");
    reportString.AppendStr("<td class='header'>Анкетное ФИО</td>");
    reportString.AppendStr("<td class='header'>Менялось ли ФИО в период обучения</td>");
    reportString.AppendStr("<td class='header'>Уровень образования</td>");
    reportString.AppendStr("<td class='header'>Пол</td>");
    reportString.AppendStr("<td class='header'>Паспортные данные</td>");
    reportString.AppendStr("<td class='header'>СНИЛС</td>");
    reportString.AppendStr("<td class='header'>Дата рождения</td>");
    reportString.AppendStr("<td class='header'>Сособ получения документов</td>");
    reportString.AppendStr("<td class='header'>Подтверждение о получении документов</td>");
    reportString.AppendStr("<td class='header'>Дата создания анкеты</td>");
    reportString.AppendStr("<td class='header'>ID анкеты</td>");
    reportString.AppendStr("<td class='header'>ID сотрудника</td>");
    reportString.AppendStr("<td class='header'>ID организации</td>");
    reportString.AppendStr("</tr>");

    for(survey in surveyList) {
        reportString.AppendStr(
            "<tr>" +
            "<td>" + survey.fullname + "</td>" +
            "<td>" + survey.inn + "</td>" +
            "<td>" + survey.os_name + "</td>" +
            "<td>" + survey.eps_name + "</td>" +
            "<td>" + (survey.start_date == "" ? "" : StrDate(survey.start_date, false, false)) + "</td>" +
            "<td>" + survey.email + "</td>" +
            "<td>" + survey.fio + "</td>" +
            "<td>" + survey.is_change_fio + "</td>" +
            "<td>" + survey.education_level + "</td>" +
            "<td>" + survey.sex + "</td>" +
            "<td>" + survey.passport + "</td>" +
            "<td>" + survey.snils + "</td>" +
            "<td>" + (survey.birth_date == "" ? "" : StrDate(survey.birth_date, false, false)) + "</td>" +
            "<td>" + survey.reciept_method + "</td>" +
            "<td>" + survey.can_get_documents + "</td>" +
            "<td>" + (survey.cr_date == "" ? "" : StrDate(survey.cr_date, false, false)) + "</td>" +
            "<td>'" + survey.id + "</td>" +
            "<td>'" + survey.cs_id + "</td>" +
            "<td>'" + survey.os_id + "</td>" +
            "</tr>");
    }  

    // SAVE EXCEL FILE
    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/surveys/survey_" + ParseDate(Date()) + ".xlsx");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>