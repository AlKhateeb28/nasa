// 7397671274748933246
function addLogMessage(loggerName, message){
    EnableLog(loggerName,true);
    try{
        if(message==null){
            message = "Empty message";
        }

        LogEvent(loggerName,message);
    } catch (e) {
        throw new Error(e);
    } finally {
        EnableLog(loggerName, false);
    }
}

function isFlagNeedSave(colTopElement, orgTopElement, flag) {
    if(orgTopElement != undefined) {
        if (!StrBegins(colTopElement.login, "rck_muc", true) &&
            !StrBegins(colTopElement.login, "load_muc", true) &&
            !StrBegins(colTopElement.login, "tren_muc", true)) {

            if (orgTopElement.custom_elems.ObtainChildByKey(flag).value != colTopElement.custom_elems.ObtainChildByKey(flag).value) {
                colTopElement.custom_elems.ObtainChildByKey(flag).value = orgTopElement.custom_elems.ObtainChildByKey(flag).value;

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Flag: " + flag + " Org.ID: " + orgTopElement.id + " Coll.ID: " + colTopElement.id + " FIO: " + colTopElement.fullname);

                return true;
            }
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Flag: " + flag + " Coll.ID: " + colTopElement.id + " is skipped. Organization is undefined");
    }

    return false;
}

function verifyToChangeFlags() {
    collaboratorList = ArrayDirect(XQuery("sql:" +
        " SELECT os.id AS org_id, cs.id AS coll_id " +
        " FROM [WTDB].[dbo].orgs os " +
        "   INNER JOIN [WTDB].[dbo].collaborators cs ON os.id = cs.org_id AND cs.login NOT LIKE '_muc_' " +
        " WHERE os.modification_date > DATEADD(MINUTE, -" + OptInt(Param.time, 30) + ", GETDATE())"));

    total = ArrayCount(collaboratorList);

    for (collaborator in collaboratorList) {
        collaboratorDoc = tools.open_doc(collaborator.coll_id);

        isSaved = false;

        if(collaboratorDoc != undefined) {
            collaboratorDocTE = collaboratorDoc.TopElem;

            organizationDoc = tools.open_doc(collaborator.org_id);

            if(organizationDoc != undefined) {
                organizationDocTE = organizationDoc.TopElem;

                if (!StrBegins(collaboratorDocTE.login, "rck_muc", true) && !StrBegins(collaboratorDocTE.login, "load_muc", true)) {
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "in_program")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_fcc")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_rck")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_roiv")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_partner")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_a_commerce_client")) {
                        isSaved = true;
                    }
                    if (isFlagNeedSave(collaboratorDocTE, organizationDocTE, "is_project_ended")) {
                        isSaved = true;
                    }

                    if (isSaved) {
                        collaboratorDoc.Save();

                        saved++;
                    }
                }
            }
        }
    }
}

try {
    var agentId = "7397671274748933246";

    var loggerName = "aa_agent_7397671274748933246";

    var total = 0;
    var saved = 0;

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    verifyToChangeFlags();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] " + total + " total, " + saved + " saved.");
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}
