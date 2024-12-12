AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.5.js");

function getEventResults() {
    try {
        sqlQuery =
            " SELECT evrs.id," +
            " evr.data.value('(event_result/custom_elems/custom_elem[name=''f_wmpt''])[1]/value[1]', 'varchar(max)') AS month," +
            " evr.data.value('(event_result/custom_elems/custom_elem[name=''f_0wv1''])[1]/value[1]', 'varchar(max)') AS year" +
            " FROM [WTDB].[dbo].event_results as evrs" +
            " INNER JOIN [WTDB].[dbo].event_result as evr ON evrs.id = evr.id" +
            " WHERE evr.data.value('(event_result/custom_elems/custom_elem[name=''f_wmpt''])[1]/value[1]', 'varchar(max)') IS NOT NULL";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

loggerName = "agent_event.result_aa";

msPerRecord = 0.04;
agentId = 7361383795201999862;
startDate = Date();
result = 0;
processed = 0;
saved = 0;
skipped = 0;
processingString = "Processing...";

try {
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    resultArray = getEventResults();

    // Expected time
    resultCount = ArrayCount(resultArray);
    if(resultCount > 0) {
        AgentUtils.addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Expected time: " + AgentUtils.getDurationMessage( resultCount * msPerRecord )
        );
    }

    for (result in resultArray) {
        eventResults = tools.open_doc(result.id);

        eventResults.TopElem.custom_elems.ObtainChildByKey("month_report").value = Int(result.month);
        eventResults.TopElem.custom_elems.ObtainChildByKey("year_report").value = result.year;

        eventResults.Save();

        saved++;

        processed++;

        // Remaining time
        if(processed % 100 == 0) {
            AgentUtils.addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + AgentUtils.getDurationMessage((resultCount - processed) * msPerRecord)
            );
        }
    }

    AgentUtils.addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        resultCount + " total, ",
        processed + " processed, ",
        saved + " saved, ",
        skipped + " skipped"
    );

    AgentUtils.addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );
} catch (e) {
    alert(loggerName + " | ERROR: " + e);

    EnableLog(loggerName, true);
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    EnableLog(loggerName, false);
}