AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.7.js");

function getRccDossiers() {
    try {
        sqlQuery =
            "SELECT *" +
            " FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs]" +
        " ORDER BY student_fullname";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

agentId = 7369216028941956636;
loggerName = "aa_agent_dossier.trained.by.rcc.unload";
msPerRecord = 0.002;
startDate = Date(); resultArray = []; total = 0; processed = 0;

try {
    excelDoc = new ActiveXObject("Websoft.Office.Excel.Document");

    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    resultArray = getRccDossiers();

    total = ArrayCount(resultArray);

    if(total > 0) {
        AgentUtils.addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] " + total + " total, Expected time: " + AgentUtils.getDurationMessage( total * msPerRecord )
        );
    }

    reportResult = new Binary();
    reportResult.AppendStr("<html lang='en'>");
    reportResult.AppendStr("<style>");
    reportResult.AppendStr(".header {background-color: #fff2cc; text-align: center;}");
    reportResult.AppendStr("</style>");
    reportResult.AppendStr("<table>");
    reportResult.AppendStr("<tr>");
    reportResult.AppendStr("<td class='header'>Учтен в месяце</td>");
    reportResult.AppendStr("<td class='header'>Учтен в году</td>");
    reportResult.AppendStr("<td class='header'>Код уникально обученного в СДО</td>");
    reportResult.AppendStr("<td class='header'>ФИО обученного силами РЦК</td>");
    reportResult.AppendStr("<td class='header'>Должность обученного</td>");
    reportResult.AppendStr("<td class='header'>ИНН организации</td>");
    reportResult.AppendStr("<td class='header'>Организация</td>");
    reportResult.AppendStr("<td class='header'>Регион</td>");
    reportResult.AppendStr("<td class='header'>Учитывать в отчетности региона</td>");
    reportResult.AppendStr("<td class='header'>Количество посещенных мероприятий</td>");
    reportResult.AppendStr("<td class='header'>Пройденные учебные программы</td>");
    reportResult.AppendStr("</tr>");

    for (result in resultArray) {
        reportResult.AppendStr("<tr>");
        reportResult.AppendStr("<td>" + result.in_month + "</td>");
        reportResult.AppendStr("<td>" + result.in_year + "</td>");
        reportResult.AppendStr("<td>" + result.student_code + "</td>");
        reportResult.AppendStr("<td>" + result.student_fullname + "</td>");
        reportResult.AppendStr("<td>" + result.student_position + "</td>");
        reportResult.AppendStr("<td>" + result.subdivision_inn + "</td>");
        reportResult.AppendStr("<td>" + result.subdivision_name + "</td>");
        reportResult.AppendStr("<td>" + result.region_name + "</td>");
        reportResult.AppendStr("<td>" + result.reporting_region_name + "</td>");
        reportResult.AppendStr("<td>" + result.num_trainings + "</td>");
        reportResult.AppendStr("<td>" + result.programs + "</td>");

        reportResult.AppendStr("</tr>");

        processed++;

        if(processed % 1000 == 0) {
            AgentUtils.addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed, remaining time: " + AgentUtils.getDurationMessage( (total - processed) * msPerRecord )
            );
        }
    }

    reportResult.AppendStr("</table></html>");

    excelDoc.LoadHtmlString(reportResult.GetStr(), "");
    excelDoc.SaveAs("E:/Websoft/Reports/report_only_rck_muc/report_unload_dossier_rck_" + ParseDate(Date()) + ".xlsx");

    AgentUtils.addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
        processed + " processed, ",
        null,
        null
    );

    AgentUtils.addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );
} catch (e) {
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    alert("ERROR: " + e);
}
