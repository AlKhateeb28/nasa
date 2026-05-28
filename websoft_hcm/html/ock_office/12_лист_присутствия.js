<%
    // 7272711228520791583
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

function setCellCss(cell, value) {
    cell.Value = value;
    cell.Style.FontSize = 18;
    cell.Style.Borders.SetColor("#000000");
    cell.Style.Borders.SetStyle("Thin");
    cell.Style.HorizontalAlignment = "Left";
    cell.Style.VerticalAlignment = "Center";
}

function getEventDates(start, finish) {
    dates = [];

    startDate = Date(start);
    finishDate = Date(finish);

    if (startDate == finishDate) {
        dates.push(startDate);

        return dates;
    }

    breakStep = 1;
    calculatingDate = startDate;

    isProcessing = true;

    while (isProcessing) {
        if (calculatingDate == finishDate || breakStep == 20) {
            isProcessing = false;
        }

        dates.push(calculatingDate);

        calculatingDate = DateOffset(calculatingDate, 86400);

        breakStep++;
    }

    return dates;
}

var agentId = 7272711228520791583;
var loggerName = "web_7272711228520791583";

var letters = ["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var result = {};
result.errorMessage = "";
result.message = "";

result.trainers = [];

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    excelDoc = tools.get_object_assembly("Excel");
    excelDoc.Open("e:/Websoft/WebSoftServer/wt/web/fcc/report_templates/lp_template.xlsx");
    excelWorksheet = excelDoc.GetWorksheet(0);

    jsonParam = Request.Query.GetOptProperty("json");

    eventObject = ParseJson(jsonParam);

    result.event = eventObject;

    eventDoc = tools.open_doc(OptInt(eventObject.id));

    if (eventDoc != undefined) {
        eventDocTE = eventDoc.TopElem;

        preparationNames = "";        
        for (preparation in eventDocTE.even_preparations) {
            preparationNames += preparation.person_fullname + "/";
        }
        if (StrCharCount(preparationNames) > 0) {
            preparationNames = StrCharRangePos(preparationNames, 0, StrCharCount(preparationNames) - 1);
        }

        tutorNames = "";
        for (tutor in eventDocTE.tutors) {
            tutorNames += tutor.person_fullname + "/";
        }
        if (StrCharCount(tutorNames) > 0) {
            tutorNames = StrCharRangePos(tutorNames, 0, StrCharCount(tutorNames) - 1);
        }    

        eventName = "none";

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT name " +
            " FROM [WTDB].[dbo].events " +
            " WHERE id = " + eventObject.id));

        if (ArrayCount(dataList) > 0) {
            eventName = dataList[0].name;
        }

        cells = excelWorksheet.Cells;
        rows = cells.Rows;

        cells.GetCell("C1").Value = eventName.Value;
        cells.GetCell("C2").Value = preparationNames;
        cells.GetCell("E4").Value = tutorNames;

        currentRow = 7;
        step = 1;
        rowHeight = 100.0;

        eventDates = getEventDates(eventObject.startDate, eventObject.finishDate);

        signatureCellColor = cells.GetCell("H5").Style.ForegroundColor;
        dateCellColor = cells.GetCell("H6").Style.ForegroundColor;;

        for (person in eventObject.persons) {
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT cs.id, " +
                "	cs.fullname AS name, " +
                "	ps.name AS position_name, " +
                "	os.name AS org_name, " +
                "	rs.name AS region_name, " +
                "	cs.email, " +
                "	cs.phone " +
                " FROM [WTDB].[dbo].collaborators cs " +
                "	INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                "	INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
                "	INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
                " WHERE cs.id = " + person.id));

            if (ArrayCount(dataList) > 0) {
                row = rows.GetRow(currentRow);
                row.Height = rowHeight;

                aCell = cells.GetCell("A" + currentRow);
                setCellCss(aCell, step);

                bCell = cells.GetCell("B" + currentRow);
                setCellCss(bCell, dataList[0].name.Value);

                cCell = cells.GetCell("C" + currentRow);
                setCellCss(cCell, dataList[0].position_name.Value);

                dCell = cells.GetCell("D" + currentRow);
                setCellCss(dCell, dataList[0].org_name.Value);

                eCell = cells.GetCell("E" + currentRow);
                setCellCss(eCell, dataList[0].region_name.Value);

                fCell = cells.GetCell("F" + currentRow);
                setCellCss(fCell, dataList[0].email.Value);

                gCell = cells.GetCell("G" + currentRow);
                setCellCss(gCell, dataList[0].phone.Value);

                for (i = 0; i < ArrayCount(eventDates); i++) {
                    signatureCell = cells.GetCell(letters[i] + 5);
                    signatureCell.Style.ForegroundColor = signatureCellColor;
                    signatureCell.Style.Borders.SetColor("#000000");
                    signatureCell.Style.Borders.SetStyle("Thin");
                    signatureCell.Value = "Место для подписи";

                    dateCell = cells.GetCell(letters[i] + 6);
                    dateCell.Style.ForegroundColor = dateCellColor;
                    dateCell.Style.Borders.SetColor("#000000");
                    dateCell.Style.Borders.SetStyle("Thin");
                    dateCell.Value = StrDate(eventDates[i], false, false);

                    hCell = cells.GetCell(letters[i] + currentRow);
                    setCellCss(hCell, "");
                }
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + person.id + " is not exist!");
            }

            step++;
            currentRow++;
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Event with ID " + eventObject.id + " is not exist");   
    }

    fileWebPath = "Reports/lp/lp_" + eventObject.id + "_" + ParseDate(Date()) + ".xlsx";

    excelDoc.SaveAs("E:/Websoft/WebSoftServer/wt/web/" + fileWebPath);

    result.message = "SUCCESS";
    result.fileWebPath = fileWebPath;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>