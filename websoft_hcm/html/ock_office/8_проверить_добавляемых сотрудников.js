<%
// 7267422403964104487
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var BOSS_TYPE_ID = 7260247233658818719;

function removeUnnecessarySpaces(value) {
	value = Trim(value);

	nameChars = StrToCharArray(value);

	metSpace = false;

	collectedName = "";

	for (char in nameChars) {
		if (char != " ") {
			if (metSpace) {
				collectedName += " ";

				metSpace = false;
			}

			collectedName += char;
		} else {
			metSpace = true;
		}
	}

	return collectedName;
}

var agentId = 7267422403964104487;
var loggerName = "web_7267422403964104487";

var result = {};
result.errorMessage = "";
result.message = "";

try {
    jsonParam = Request.Query.GetOptProperty("json");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
	addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    persons = ParseJson(jsonParam);

    for (person in persons) {
		dataList = ArrayDirect(XQuery("sql: " +
			" SELECT fm.object_id AS id, " +
			" 			os.code " +
			" FROM [WTDB].[dbo].func_managers fm " +
			" INNER JOIN [WTDB].[dbo].orgs os ON fm.object_id = os.id AND os.code = '" + person.inn + "'" + 
			" WHERE fm.person_id = " + curUserID +
			"	AND fm.catalog = 'org' " +
			"	AND fm.boss_type_id = " + BOSS_TYPE_ID));
		
		wrong = true;		
		if(ArrayCount(dataList) > 0) {
			wrong = false;
		}
		person.wrongInn = wrong;
		
		person.name = removeUnnecessarySpaces(person.name);

		nameParts = person.name.split(" ");
		wrong = false;
		if (ArrayCount(nameParts) < 2 || ArrayCount(nameParts) > 3) {
			wrong = true;
		}
		person.wrongName = wrong;

		person.wrongRow = false;
		if (person.wrongInn || person.wrongName) {
			person.wrongRow = true;
		}				
    }

	result.persons = persons;

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>