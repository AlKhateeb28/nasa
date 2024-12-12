AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.7.js");

startDate = Date();
agentId = 7361777871180874493; agentName = "Исправление реиона в организации. Поле \"Учитывать в регионе\"";

loggerName = "agent_organizations_aa";

skipped = 0;

excelURL = Screen.AskFileOpen( "", "Выбери файл *.xls*" );
excel = new ActiveXObject( "Excel.Application" );

processed = 0; saved = 0; skipped = 0;
currentRow = 2;

try {
    excelSheet = excel.Workbooks.Open( excelURL ).Worksheets( 1 );
    isProcessing = true;

    while(isProcessing) {
        if(excelSheet.Cells(currentRow, 1).Value == undefined) {
            isProcessing = false;
        } else {
            code = excelSheet.Cells(currentRow, 1).Value;
            code = StrCharRangePos ( code, 1, StrCharCount( code ) ) ;

            organization =  tools.get_doc_by_key ( "org", "code", code );

            organization.TopElem.custom_elems.ObtainChildByKey("report_region_id").value = organization.TopElem.custom_elems.ObtainChildByKey("fact_region_id").value;
            organization.Save();

            saved++;

            currentRow++;
            processed++;
        }
    }

    alert("Обработано: " + processed + " записей\nВремя: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate)));
} catch (e) {
    alert("Broken row: " + (currentRow - 2) + " ERROR: "  + e);
} finally {
    excel.Application.Quit();
}