<%
    // 7265269220802297335
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var EVENT_CODE_PREFIX = "S_";

var agentId = 7265269220802297335;
var loggerName = "web_7265269220802297335";

var result = {};
result.errorMessage = "";
result.message = "";

result.events = [];

try {
    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    statusQuery = "";
    statusParam = Request.Query.GetOptProperty("status");
    if (statusParam != "all") {
        statusQuery = " AND es.status_id = '" + statusParam + "'";
    }

    monthQuery = "";
    monthParam = Request.Query.GetOptProperty("month");
    if (OptInt(monthParam) != 0) {
        monthQuery = " AND MONTH(es.start_date) = " + monthParam;
    }

    typeParam = Request.Query.GetOptProperty("type");
    if (typeParam == undefined || typeParam == "") {
        // 0 - экспорт, 1 - общий отчет
        typeParam = 0;
    }

    typeParam = OptInt(typeParam);

    yearParam = Request.Query.GetOptProperty("year");

    nameParam = Request.Query.GetOptProperty("name");

    personData = "0000000000000000000";
    nameQuery = "";

    isFindPerson = false;

    if (nameParam != undefined) {
        if (StrBegins(nameParam, "S")) {
            personIdList = nameParam.split("-");

            if (personIdList.length == 2) {
                personData = personIdList[1];

                if (OptInt(personData) == undefined) {
                    if (personData != "") {
                        nameQuery = " UPPER(cs.fullname) LIKE '%" + StrUpperCase(personData) + "%' ";
                    }
                } else {
                    nameQuery = " cs.id = " + personData;
                }
            }
        } else if (OptInt(nameParam) == undefined) {
            if (nameParam != "") {
                nameQuery = " AND (es.name LIKE '%" + nameParam + "%' OR e.data.value('(//comment)[1]', 'varchar(max)') LIKE '%" + nameParam + "%') ";
            }
        } else {
            nameQuery = " AND es.id = " + nameParam;
        }
    }

    result.personData = personData;

    page = OptInt(Request.Query.GetOptProperty("page"));

    offset = 0;

    personCode = "0000000000";
    inn = "0000000000";

    collaboratorList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.code AS person_code, " +
        " 		os.code AS inn " +
        " FROM [WTDB].[dbo].collaborators cs " +
        " 		INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        " WHERE cs.id = " + curUserID));

    if (ArrayCount(collaboratorList) > 0) {
        personCode = collaboratorList[0].person_code;
        inn = collaboratorList[0].inn;
    }

    dataList = null;

    result.type = typeParam;

    if (typeParam == 0) {
        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _preparations AS (" +
            "	SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "    	LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c)  " +
            " ),  " +
            " _temp_preparations AS ( " +
            "	SELECT id, preparation_fio = STUFF ( " +
            "    	(SELECT '|' + pre_fio  " +
            "        	FROM _preparations tmp " +
            "            WHERE tmp.id = ps.id  " +
            "            FOR XML PATH ('')  " +
            "            ), 1, 1, '')  " +
            "    FROM _preparations ps  " +
            "    GROUP BY id  " +
            " ), " +
            " _lectors AS ( " +
            "	SELECT es.id, T.c.value('person_fullname[1]','varchar(max)') AS lector_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "    	LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/tutors/tutor') T(c) " +
            " ), " +
            " _temp_lectors AS ( " +
            " SELECT id, lector_fio = STUFF ( " +
            "    (SELECT '|' + lector_fio " +
            "        FROM _lectors tmp " +
            "        WHERE tmp.id = ls.id " +
            "        	FOR XML PATH ('')) " +
            "            , 1, 1, '') " +
            " FROM _lectors ls " +
            " GROUP BY id " +
            " ) " +
            " SELECT os.code AS inn, " +
            "	os.name AS os_name,  " +
            "    rs.code AS region_code, " +
            "    rs.name AS region_name, " +
            "    cs.fullname, " +
            "    ps.name AS pos_name, " +
            "    ems.name AS edu_method_name, " +
            "    es.name AS event_name, " +
            "    es.start_date AS start, " +
            "	e.data.value('(//custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps, " +
            "    CASE   " +
            "    	WHEN es.status_id = 'project' THEN 'Планируется' " +
            "        WHEN es.status_id = 'close' THEN 'Завершено'  " +
            "    	ELSE ''  " +
            "    END AS state_name, " +
            "    es.status_id AS state, " +
            "    tps.preparation_fio, " +
            "    tls.lector_fio " +
            " FROM [WTDB].[dbo].event_results ers " +
            "	INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%' " +
            "    INNER JOIN [WTDB].[dbo].event e ON es.id = e.id  " +
            "    INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
            "	INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "	LEFT JOIN _temp_preparations AS tps ON e.id = tps.id " +
            "	LEFT JOIN _temp_lectors AS tls ON e.id = tls.id " +
            " 	WHERE YEAR(es.start_date) = " + yearParam +
            statusQuery +
            monthQuery +
            nameQuery +
            " ORDER BY start DESC "));

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Year: " + yearParam + " Status: " + statusQuery + " Month: " + monthQuery + " Name: " + nameQuery);
    } else {
        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _preparations AS (" +
            "	SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "    	LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c)  " +
            " ),  " +
            " _temp_preparations AS ( " +
            "	SELECT id, preparation_fio = STUFF ( " +
            "    	(SELECT '|' + pre_fio  " +
            "        	FROM _preparations tmp " +
            "            WHERE tmp.id = ps.id  " +
            "            FOR XML PATH ('')  " +
            "            ), 1, 1, '')  " +
            "    FROM _preparations ps  " +
            "    GROUP BY id  " +
            " ), " +
            " _lectors AS ( " +
            "	SELECT es.id, T.c.value('person_fullname[1]','varchar(max)') AS lector_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "    	LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/tutors/tutor') T(c) " +
            " ), " +
            " _temp_lectors AS ( " +
            " SELECT id, lector_fio = STUFF ( " +
            "    (SELECT '|' + lector_fio " +
            "        FROM _lectors tmp " +
            "        WHERE tmp.id = ls.id " +
            "        	FOR XML PATH ('')) " +
            "            , 1, 1, '') " +
            " FROM _lectors ls " +
            " GROUP BY id " +
            " ) " +
            " SELECT os.code AS inn, " +
            "	os.name AS os_name,  " +
            "    rs.code AS region_code, " +
            "    rs.name AS region_name, " +
            "    cs.fullname, " +
            "    ps.name AS pos_name, " +
            "    ems.name AS edu_method_name, " +
            "    es.name AS event_name, " +
            "    es.start_date AS start, " +
            "	 e.data.value('(//custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps, " +
            "    CASE   " +
            "    	WHEN es.status_id = 'project' THEN 'Планируется' " +
            "        WHEN es.status_id = 'close' THEN 'Завершено'  " +
            "    	ELSE ''  " +
            "    END AS state_name, " +
            "    es.status_id AS state, " +
            "    tps.preparation_fio, " +
            "    tls.lector_fio " +
            " FROM [WTDB].[dbo].event_results ers " +
            "	INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%' " +
            "    INNER JOIN [WTDB].[dbo].event e ON es.id = e.id  " +
            "    INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
            "	INNER JOIN [WTDB].[dbo].education_methods ems ON es.education_method_id = ems.id " +
            "	LEFT JOIN _temp_preparations AS tps ON e.id = tps.id " +
            "	LEFT JOIN _temp_lectors AS tls ON e.id = tls.id " +            
            " ORDER BY start DESC "));
    }

    result.count = ArrayCount(dataList);
    
    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>ИНН</td>");
    reportString.AppendStr("<td class='header'>Оганизация</td>");
    reportString.AppendStr("<td class='header'>Название региона организации</td>");
    reportString.AppendStr("<td class='header'>ФИО участника</td>");
    reportString.AppendStr("<td class='header'>Должность</td>");
    reportString.AppendStr("<td class='header'>Учебная программа</td>");
    reportString.AppendStr("<td class='header'>Название мероприятия</td>");
    reportString.AppendStr("<td class='header'>Дата мероприятия</td>");
    reportString.AppendStr("<td class='header'>Тренер</td>");
    reportString.AppendStr("<td class='header'>Ответственный</td>");
    reportString.AppendStr("<td class='header'>NPS</td>");
    reportString.AppendStr("<td class='header'>Статус мероприятия</td>");
    reportString.AppendStr("</tr>");

    if (ArrayCount(dataList) > 0) {
        for (data in dataList) {
            reportString.AppendStr(
                "<tr>" +
                "<td>" + data.inn + "</td>" +
                "<td>" + data.os_name + "</td>" +
                "<td>" + data.region_name + "</td>" +
                "<td>" + data.fullname + "</td>" +
                "<td>" + data.pos_name + "</td>" +
                "<td>" + data.edu_method_name + "</td>" +
                "<td>" + data.event_name + "</td>" +
                "<td>" + (data.start == "" ? "" : StrDate(data.start, false, false)) + "</td>" +
                "<td>" + data.lector_fio + "</td>" +
                "<td>'" + data.preparation_fio + "</td>" +
                "<td>" + data.nps + "</td>" +
                "<td>" + data.state_name + "</td>" +
                "</tr>");
        }

    }

    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");

    fileName = "";

    if (typeParam == 0) {
        fileName = "export";
    } else {
        fileName = "report";
    }

    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/report_ock/" + fileName + "_" + ParseDate(Date()) + ".xlsx");
    
    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>