<%
// 7270945294156437341
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var agentId = 7270945294156437341;
var loggerName = "web_7270945294156437341";

var result = {};
result.errorMessage = "";
result.message = "";

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    dateParam = Request.Query.GetOptProperty("date");
    if (dateParam == undefined || dateParam == "") {
        dateParam = Date();
    } else {
        dateParam = Date(dateParam);
    }

    result.start = "";
    result.isDateValid = true;


    day = Day(Date());
    month = Month(Date());
    year = Year(Date());

    createAndEditStart = Date("01." + month + "." + year + " 00:00:00");
    verificationStart = Date("01." + month + "." + year + " 00:00:00");
    verificationFinish = Date("05." + month + "." + year + " 23:59:59");

    if (verificationStart <= Date() && Date() <= verificationFinish) {
        result.isVerification = true;

        if (dateParam <= DateOffset(createAndEditStart, -1)) {
            result.isDateValid = false;
            result.start = StrDate(createAndEditStart, false, false);
        }
    } else {
        if (dateParam <= DateOffset(createAndEditStart, -1)) {
            result.isDateValid = false;
            result.start = StrDate(createAndEditStart, false, false);
        }
    }
    
    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>