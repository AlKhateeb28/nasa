// 7358767219045584268
AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.7.js");

function getEducationMethodsFromDossierSubsidizedTraineds() {
    try {
        sqlQuery =
        " WITH _view_dossier_subsidized_traineds AS (" +
            " SELECT dts.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , dts.programs, dts.num_trainings AS dts_count" +
            " FROM [WTDB].[dbo].[cc_dossier_subsidized_traineds] AS dts" +
                " INNER JOIN [WTDB].[dbo].event_results AS evrs ON dts.student_id = evrs.person_id AND evrs.is_assist = 1" +
                " INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id" +
                " INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id" +
                " INNER JOIN [WTDB].[dbo].event_result_types AS evrts ON evrs.event_result_type_id = evrts.id" +
            " WHERE (UPPER(evrts.code) = UPPER('std_event_result') OR evrts.code IS NULL)" +
                " AND evs.education_method_id IS NOT NULL" +
                " AND dts.programs IS NOT NULL" +
            " GROUP BY dts.id, evs.education_method_id, evrs.person_id, edms.name , dts.programs, dts.num_trainings" +
        " ) " +
        " SELECT _view1.id, edm_name = STUFF (" +
            " (SELECT ';' + edm_name" +
                " FROM _view_dossier_subsidized_traineds AS _view2" +
                " WHERE _view2.id = _view1.id" +
                " ORDER BY edm_name" +
                " FOR XML PATH ('')" +
        " ), 1, 1, '')," +
        " COUNT(_view1.id) as edm_count," +
            " _view1.programs as programs," +
            " _view1.dts_count," +
            " _view1.person_id" +
        " FROM _view_dossier_subsidized_traineds _view1" +
        " GROUP BY _view1.id, programs, dts_count, person_id" +
        " ORDER BY id;";

        return ArrayDirect(XQuery( "sql:" + sqlQuery));
    } catch (e) {
        throw new Error(e);
    }
}

loggerName = "aa_agent_dossier.subsidized.traineds";

EnableLog(loggerName, true);

agentId = 7358767219045584268; startDate = Date(); resultArray = []; processedDossiers = []; skippedDossiers = [];

try {
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    resultArray = getEducationMethodsFromDossierSubsidizedTraineds();

    // Expected time
    resultCount = ArrayCount(resultArray);
    if(resultCount > 0) {
        AgentUtils.addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Expected time: " + AgentUtils.getDurationMessage( resultCount * 0.060 )
        );
    }

    for (result in resultArray) {
        dossierDoc = tools.open_doc(result.id);

        if (Int(result.dts_count) <= Int(result.edm_count)) {
            dossierDoc.TopElem.programs = result.edm_name;
            dossierDoc.TopElem.num_trainings = result.edm_count;

            dossierDoc.Save();

            processedDossiers.push(result.id);
        } else {
            skippedDossiers.push(result.id);
        }

        // Update collaborators.is_dossier_exist = true
        collaboratorDoc = tools.open_doc(result.person_id);

        collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("is_dossier_exist").value = true;

        collaboratorDoc.Save();

        // Remaining time
        if(ArrayCount(processedDossiers) % 1000 == 0) {
            AgentUtils.addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + AgentUtils.getDurationMessage( (resultCount - ArrayCount(processedDossiers)) * 0.060 )
            );
        }
    }

    AgentUtils.addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        "Total: " + resultCount,
        " | " + "Processed: " + ArrayCount(processedDossiers),
        " | " + "Skipped: " + ArrayCount(skippedDossiers)
    );

    AgentUtils.addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + AgentUtils.getDurationMessage( DateToRawSeconds(Date()) - DateToRawSeconds(startDate) )
    );
} catch (e) {
    alert(loggerName + " | ERROR: " + e);
    AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
} finally {
    EnableLog(loggerName, false);
}