AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.7.js");

agentId = 7353976793310768042; startDate = Date(); isUpdate = false; resultArray = []; processedDossiers = []; skippedDossiers = [];

loggerName = "agent_dossier.subsidized.traineds_aa";

EnableLog(loggerName, true);

try {
    AgentUtils.addLogMessage(loggerName, "-------------------");

    AgentUtils.addLogMessage(loggerName, "Param.MODE=" + Param.MODE);
    AgentUtils.addLogMessage(loggerName, "Param.BACKUP=" + Param.BACKUP);

    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    sqlQuery = "SELECT dts.id, dts.student_id, dts.student_code, colls.id as colls_id, colls.login as colls_code" +
        " FROM [WTDB].[dbo].[cc_dossier_subsidized_traineds] AS dts" +
        " INNER JOIN [WTDB].[dbo].orgs AS orgs ON dts.subdivision_inn = orgs.code" +
        " INNER JOIN [WTDB].[dbo].collaborators AS colls ON orgs.id = colls.org_id" +
        " AND (dts.student_fullname) = UPPER(colls.fullname) AND colls.code LIKE 'load_muc%'";

    resultArray = ArrayDirect(XQuery("sql:" + sqlQuery));

    backupData = [];

    for(result in resultArray) {
        dossierDoc = tools.open_doc( result.id );

        if (result.student_id == null && result.colls_id != null) {
            dossierDoc.TopElem.student_id = result.colls_id;
            dossierDoc.TopElem.student_code = result.colls_code;

            processedDossiers.push(result.id);

            if (Param.MODE == "AGENT") {
                row = {};
                row.id = result.id;
                row.studentId = result.colls_id;
                row.studentCode = result.colls_code;
                backupData.push(row);

                dossierDoc.Save();
            }
        } else {
            skippedDossiers.push(result.id);
            //AgentUtils.addLogMessage(loggerName, "Пропущен ID: " + result.id);
        }
    }

    // Add backup
    if (Param.MODE == "AGENT" && Param.BACKUP == "YES") {
        jsonLogger = "aa.cc_dossier_subsidized_traineds.json";

        EnableLog(jsonLogger, true);
        LogEvent(jsonLogger, EncodeJson(backupData));
        EnableLog(jsonLogger, false);

        LogEvent(loggerName, "Backup saved.");
    }

    monitorString = "";
    if (Param.MODE == "MONITOR") {
        monitorString = "Will ";
    }

    AgentUtils.addLogResultMessage(
        loggerName,
        null,
        "Total: " + ArrayCount(resultArray),
        " | " + monitorString + "Processed: " + ArrayCount(processedDossiers),
        " | " + monitorString + "Skipped: " + ArrayCount(skippedDossiers)
    );
    AgentUtils.addLogMessage(
        loggerName,
        "Duration: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );

    AgentUtils.addLogMessage(loggerName, "Finished");
} catch (e) {
    alert(loggerName + " | ERROR: " + e);
    AgentUtils.addLogMessage(loggerName, "ERROR: " + e);
} finally {
    EnableLog(loggerName, false);
}
