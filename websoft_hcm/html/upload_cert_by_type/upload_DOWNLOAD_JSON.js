<%
// 7215704071994585819
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var resultData = {};
resultData.message = "";
resultData.errorMessage = "";

var agentId = 7215704071994585819;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var loggerName = "web_7215704071994585819";

var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

var serial = Request.Query.GetOptProperty("serial");

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT certs.delivery_date, " +
        "       YEAR(certs.delivery_date) AS year, " +
        "       certs.serial, " +
        "       certs.number, " +
        "       cs.fullname, " +
        "       rs.name AS region_name, " +
        "       fact_rs.name AS fact_region_name, " +
        "       os.code, " +
        "       os.name AS org_name, " +
        "       cert.data.value('(//custom_elems/custom_elem[name=''form_dogovor_sootvet'']/value)[1]', 'varchar(max)') AS dogovor, " +
        "       cert.data.value('(//custom_elems/custom_elem[name=''edu_prog_names'']/value)[1]', 'varchar(max)') AS edu_name, " +
        "       cert.data.value('(//custom_elems/custom_elem[name=''programm_name'']/value)[1]', 'varchar(max)') AS prog_name " +
        " FROM [WTDB].[dbo].certificates certs " +
        "   INNER JOIN [WTDB].[dbo].certificate cert ON certs.id = cert.id " +
        "   INNER JOIN [WTDB].[dbo].collaborators cs ON certs.person_id = cs.id " +
        "   INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id" +
        "   INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        "   INNER JOIN [WTDB].[dbo].regions fact_rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = fact_rs.id " +
        (StrCharCount(serial) == 0 ? "" : " WHERE certs.serial = '" + serial + "' ")));

    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81);}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>Номер сертификата</td>");
    reportString.AppendStr("<td class='header'>Дата выдачи</td>");
    reportString.AppendStr("<td class='header'>ФИО сотрудника</td>");
    reportString.AppendStr("<td class='header'>Регион</td>");
    reportString.AppendStr("<td class='header'>Фактический регион</td>");
    reportString.AppendStr("<td class='header'>ИНН</td>");
    reportString.AppendStr("<td class='header'>Предприятие</td>");
    reportString.AppendStr("<td class='header'>Формулировка</td>");
    reportString.AppendStr("<td class='header'>Учебные программы</td>");
    reportString.AppendStr("<td class='header'>Уч. программа</td>");
    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr(
            "<tr>" +
            "<td>" + data.serial + "-" + data.number + "/" + data.year + "</td>" +
            "<td>" + data.delivery_date + "</td>" +
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.region_name + "</td>" +
            "<td>" + data.fact_region_name + "</td>" +
            "<td>" + data.code + "</td>" +
            "<td>" + data.org_name + "</td>" +
            "<td>" + data.dogovor + "</td>" +
            "<td>" + data.edu_name + "</td>" +
            "<td>" + data.prog_name + "</td>" +
            "</tr>");
    }

    // SAVE EXCEL FILE
    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/upload/upload_by_type_" + serial + "_" + ParseDate(Date()) + ".xlsx");

    resultData.message = "Agent is started";
    resultData.total = ArrayCount(dataList);

    Response.Write(EncodeJson(resultData));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    resultData.errorMessage = "#" + e;

    Response.Write(EncodeJson(resultData));
}
%>