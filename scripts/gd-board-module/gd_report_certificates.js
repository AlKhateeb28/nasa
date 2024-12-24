<%
// 7106651538719735074
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function hasAdminAccess(userId) {
    for(j = 0; j < ArrayCount(adminIds); j++) {
        if(userId == adminIds[j]) {
            return 1;
        }
    }

    return 0;
}

function getRegionQuery(regionId) {
    return regionId == 0 ? "" : " INNER JOIN [WTDB].[dbo].collaborators cs ON certs.person_id = cs.id " +
        " INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id AND os.region_id = " + regionId;
}

function getCertificateTypeQuery(certificateTypeId) {
    return certificateTypeId == 0 ? "" : " AND certs.type_id = " + certificateTypeId;
}

function getCertificateSerialQuery(certificateSerial) {
    return certificateSerial == "0" ? "" : " AND certs.serial = '" + certificateSerial + "'";
}

var adminIds = [
    7351734047845980789, // AA
    6743923349751162819, //FK
    6614087247971038079, //TO
    6614087235644112866, //ZI
    6787990739804452036, // SN
    6726778101707318995, // RA
    7036680427249492033 // MT
];

var agentId = 7106651538719735074;
var loggerName = "agent_7106651538719735074";

var result = {};
result.errorMessage = "";

try {
    regionId = OptInt(Request.Query.GetOptProperty("region_id", "0"));
    certificateTypeId = OptInt(Request.Query.GetOptProperty("type_id", "0"));
    certificateSerial = Request.Query.GetOptProperty("serial", "0");

    // Chart block
    sql = " SELECT MONTH(certs.delivery_date) AS month, YEAR(certs.delivery_date) AS year, COUNT(certs.id) AS cnt " +
        " FROM [WTDB].[dbo].certificates AS certs " +
        getRegionQuery(regionId) +
        " WHERE YEAR(certs.delivery_date) > 2018 " +
        getCertificateTypeQuery(certificateTypeId) +
        getCertificateSerialQuery(certificateSerial) +
        " GROUP BY MONTH(certs.delivery_date), YEAR(certs.delivery_date) " +
        " ORDER BY year, month ";

    addLogMessage(loggerName, "[agent.id: " + agentId + "] SQL: " + sql);

    chartList = ArrayDirect(XQuery("sql: " + sql));

    result.chartData = [];

    for(chartData in chartList) {
        charElement = {};

        charElement.month = chartData.month;
        charElement.year = chartData.year;
        charElement.count = chartData.cnt;

        result.chartData.push(charElement);
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>