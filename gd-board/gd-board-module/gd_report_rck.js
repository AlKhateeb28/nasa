<%
// 7424484892990776274
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function hasAdminAccess(userId) {
    for(j = 0; j < ArrayCount(adminIds); j++) {
        if(userId == adminIds[j]) {
            return 1;
        }
    }

    return 0;
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

var literals = [
    'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
    'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
    'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ',
    'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ',
    'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ',
    'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ',
    'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ'
];

var agentId = 7424484892990776274;
var loggerName = "aa_agent_7424484892990776274";

var result = {};
result.errorMessage = "";
result.list =  [];
result.regionGoals = [];

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ---------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    regionsList = ArrayDirect(XQuery("sql: " +
        " SELECT rs.name, " +
        "       r.data.value('(//custom_elems/custom_elem[name=''rcc_trained_goal'']/value)[1]', 'varchar(max)') AS goal " +
        " FROM regions rs " +
        "    INNER JOIN [WTDB].[dbo].region r ON rs.id = r.id " +
        " ORDER BY name "));

    if(ArrayCount(regionsList) > 0) {
        total = 0;

        for(region in regionsList) {
            goalRegion = {};

            goalRegion.name = region.name;

            if(region.goal == '') {
                goalRegion.goal = 0;
            } else {
                goalRegion.goal = OptInt(region.goal);
            }

            total += OptInt(goalRegion.goal);

            result.regionGoals.push(goalRegion);
        }

        goalRegion = {};
        goalRegion.name = "Итого";
        goalRegion.goal = total;

        result.regionGoals.push(goalRegion);
    }

    collaboratorList = ArrayDirect(XQuery("sql: " +
        " SELECT  rs.name " +
        "    FROM [WTDB].[dbo].collaborators cs " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        "    WHERE cs.id = " + curUserID));

    if(ArrayCount(collaboratorList) > 0) {
        excel = new ActiveXObject("Websoft.Office.Excel.Document");
        excel.Open("E:/Websoft/Reports/gd/data.xlsx");
        excelSheet = excel.GetWorksheet(1);

        for(i = 3; i <= 75; i++) {
            data = {};

            data.name = excelSheet.Cells.GetCell('A' + i).Value;
            data.start_datetime = excelSheet.Cells.GetCell('B2').Value;
            data.is_admin = hasAdminAccess(curUserID);
            data.mode = collaboratorList[0].name;
            data.elements = [];

            for(literal in literals) {
                if(excelSheet.Cells.GetCell(literal + 2).Value == undefined) {
                    break;
                }

                element = {};
                element.datetime = excelSheet.Cells.GetCell(literal + 2).Value;
                if(excelSheet.Cells.GetCell(literal + i).Value == undefined) {
                    element.value = 0;
                } else {
                    element.value = excelSheet.Cells.GetCell(literal + i).Value;
                }

                data.elements.push(element);
            }

            result.list.push(data);
        }
    } else {
        result = "#Сотрудник с ID " + curUserID + " не найден!";
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>
