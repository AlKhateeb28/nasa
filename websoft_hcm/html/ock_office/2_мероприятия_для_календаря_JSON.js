<%
// 7260348212639037233
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var EVENT_CODE_PREFIX = "S_";

var agentId = 7260348212639037233;
var loggerName = "web_7260348212639037233";

var result = {};
result.errorMessage = "";
result.message = "";
result.recordsOnPage = 25;

result.count = 0;
result.events = [];

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    day = Day(Date());
    month = Month(Date());
    year = Year(Date());

    first = Date("01." + month + "." + year + " 00:00:00");
    last = Date("05." + month + "." + year + " 23:59:59");

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

    yearParam = Request.Query.GetOptProperty("year");

    nameParam = Request.Query.GetOptProperty("name");

    personData = "0000000000000000000";
    nameQuery = "";

    isFindPerson = false;

    if (nameParam != undefined) {
        if (StrBegins(nameParam, "S")) {
            personIdList = nameParam.split("-");

            if (personIdList.length == 2) {
                isFindPerson = true;

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

    if (page > 1) {
        offset = (page - 1) * result.recordsOnPage;
    }

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

    if (!isFindPerson) {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT COUNT(es.id) AS count " +
            " FROM [WTDB].[dbo].events es" +
            " WHERE es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%' " +
            " 	AND YEAR(es.start_date) = " + yearParam +
            statusQuery +
            monthQuery +
            nameQuery));

        if (ArrayCount(dataList) > 0) {
            result.count = dataList[0].count;
        }

        result.query = nameQuery;

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.id AS id, " +
            " 	es.name, " +
            " 	e.data.value('(//custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps, " +
            " CASE  " +
            "	WHEN es.status_id = 'project' THEN 'Планируется' " +
            "	WHEN es.status_id = 'close' THEN 'Завершено' " +
            "	ELSE '' " +
            " END AS state_name, " +
            " es.status_id AS state, " +
            " es.start_date AS start, " +
            " es.finish_date AS finish, " +
            " e.data.value('(//comment)[1]', 'varchar(max)') AS comment " +
            " FROM [WTDB].[dbo].events es " +
            " 	INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            " WHERE es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%' " +
            " 	AND YEAR(es.start_date) = " + yearParam +
            statusQuery +
            monthQuery +
            nameQuery +
            " ORDER BY start DESC " +
            " OFFSET " + offset + " ROWS " +
            " FETCH NEXT " + result.recordsOnPage + " ROWS ONLY "));
    } else {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT COUNT(es.id) AS count " +
            " FROM [WTDB].[dbo].event_results ers " +
            "	INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id AND " + nameQuery +
            " 	INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%' " +
            " WHERE YEAR(es.start_date) = " + yearParam +
            statusQuery +
            monthQuery));

        if (ArrayCount(dataList) > 0) {
            result.count = dataList[0].count;
        }
		
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT es.id AS id, " +
            " 	es.name, " +
            " e.data.value('(//custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps, " +
            " CASE  " +
            "	WHEN es.status_id = 'project' THEN 'Планируется' " +
            "	WHEN es.status_id = 'close' THEN 'Завершено' " +
            "	ELSE '' " +
            " END AS state_name, " +
            " es.status_id AS state, " +
            " es.start_date AS start, " +
            " es.finish_date AS finish, " +
            " e.data.value('(//comment)[1]', 'varchar(max)') AS comment " +
            " FROM [WTDB].[dbo].event_results ers " +
            "	INNER JOIN [WTDB].[dbo].collaborators cs ON ers.person_id = cs.id AND " + nameQuery +
            " 	INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.code LIKE '" + EVENT_CODE_PREFIX + inn + "%'" +
            " 	INNER JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            " WHERE YEAR(es.start_date) = " + yearParam +
            statusQuery +
            monthQuery +
            " ORDER BY start DESC " +
            " OFFSET " + offset + " ROWS " +
            " FETCH NEXT " + result.recordsOnPage + " ROWS ONLY "));
    }

    for (data in dataList) {
        element = {};

        element.id = data.id;
        element.name = data.name;
        element.nps = data.nps;
        element.state = data.state;
        element.stateName = data.state_name;
        element.start = StrDate(data.start, false, false);
        element.finish = StrDate(data.finish, false, false);
        element.comment = data.comment;
        element.isBlocked = false;
        
        if (first <= Date() && Date() <= last) {
            if (data.finish < first) {
                element.isBlocked = true;
            }
        }
        
        countList = ArrayDirect(XQuery("sql: " +
            " SELECT COUNT(ers.person_id) AS count " +
            " FROM [WTDB].[dbo].event_results ers " +
            " 		INNER JOIN [WTDB].[dbo].events es ON ers.event_id = es.id AND es.id = " + data.id));

        if (ArrayCount(countList) > 0) {
            element.count = countList[0].count;
        } else {
            element.count = 0;
        }

        result.events.push(element);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>