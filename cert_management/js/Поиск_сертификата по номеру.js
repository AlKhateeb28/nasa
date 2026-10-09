<%
// 7335330126860569305
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

agentId = 7335330126860569305;
var loggerName = "web_7335330126860569305";

var result = {};
result.errorMessage = "";
result.message = "";
result.sertificates = [];
result.total = 0;

try {
    addLogMessage(loggerName, "----------");

    certificateNumber = Request.Query.GetOptProperty("number");

    if (certificateNumber == "") {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate NUMBER is empty!");

        throw new Error("Certificate NUMBER is empty!");
    }

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT certs.serial, " +
        "   certs.number, " +
        "   certs.delivery_date, " +
        "   YEAR(certs.delivery_date) AS year, " +
        "   certs.expire_date, " +
        "   certs.valid, " +
        "   cs.fullname, " +
        "   cert.data.value('(//custom_elems/custom_elem[name=''withdrawn'']/value)[1]', 'bit') AS withdrawn, " +
        "   DATEDIFF(DAY, GETDATE(), certs.expire_date) AS diff " +
        " FROM [WTDB].[dbo].certificates certs " +
        "     INNER JOIN [WTDB].[dbo].certificate cert ON  certs.id = cert.id " +
        "     INNER JOIN [WTDB].[dbo].collaborators cs ON certs.person_id = cs.id " +
        " WHERE certs.number = '" + certificateNumber + "' "));

    result.total = ArrayCount(dataList);

    for (data in dataList) {
        element = {};
        element.serial = data.serial;
        element.number = data.number;
        element.deliveryDate = StrDate(data.delivery_date, false, false);
        element.year = data.year;
        if (data.expire_date != null) {
            element.expireDate = StrDate(data.expire_date, false, false);
        } else {
            element.expireDate = null;
        }
        element.valid = data.valid;
        element.fullname = data.fullname;
        element.withdrawn = data.withdrawn;
        element.diff = data.diff;

        result.sertificates.push(element);
    }
    
    result.message = "SUCCESS";

    addLogMessage(loggerName, "Finished");

    Response.Write(EncodeJson(result));    
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>