<%
// 7436726661532301415
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function hasAccess(documentTE, role, userId) {
    for(accessRole in documentTE.access.access_roles) {
        if (accessRole.access_role_id == role) {
            return true;
        }
    }

    for(accessGroup in documentTE.access.access_groups) {
        groupDoc = tools.open_doc(accessGroup.group_id);

        if(groupDoc != undefined) {
            if(groupDoc.TopElem.collaborators.GetOptChildByKey(userId) != undefined) {
                return true;
            }
        }
    }

    return false;
}

var agentId = 7436726661532301415;
var loggerName = "aa_agent_7436726661532301415";

var result = {};
result.errorMessage = "";
result.elements = [];

try {
    userId = curUserID;

    paramUserId = OptInt(Request.Query.GetOptProperty("user_id", "0"));

    if(paramUserId != 0) {
        userId = paramUserId;
    }

    userDoc = tools.open_doc(userId);

    if(userDoc != undefined) {
        role = userDoc.TopElem.access.access_role;

        elementList = ArrayDirect(XQuery("sql: " +
            " SELECT ds.id, " +
            "       ds.name, " +
            "       ds.custom_template_type, " +
            "       ds.template, " +
            "       d.data.value('(document/comment)[1]', 'int') AS block " +
            " FROM [WTDB].[dbo].documents ds " +
            "    INNER JOIN [WTDB].[dbo].document d ON ds.id = d.id AND d.data.value('(document/custom_elems/custom_elem[name=''portal_tag''])[1]/value[1]', 'varchar(max)') = 'knowledge_base' " +
            " ORDER BY block "));

        if (ArrayCount(elementList) > 0) {
            for (elem in elementList) {
                documentDoc = tools.open_doc(elem.id);

                if (documentDoc != undefined) {
                    if (hasAccess(documentDoc.TopElem, role, userId)) {
                        //putElement();
                        element = {};
                        element.id = "" + elem.id;
                        element.name = elem.name;
                        element.customTemplateType = "" + elem.custom_template_type;
                        element.template = elem.template;
                        element.block = elem.block;
                        element.children = [];

                        if(elem.id == 6927927814292523559) {
                            solutionList = ArrayDirect(XQuery("sql: " +
                                " SELECT id, " +
                                "    name, " +
                                "    resource_id " +
                                " FROM [WTDB].[dbo].library_materials " +
                                " WHERE name LIKE '%Памятка_%' " +
                                "    AND code LIKE '%m-%' " +
                                "    AND has_digital = 0 "));

                            if (ArrayCount(solutionList) > 0) {
                                for (solution in solutionList) {
                                    childElement = {};
                                    childElement.id = "" + solution.id;
                                    childElement.name = solution.name;
                                    childElement.resourceId = "" + solution.resource_id;

                                    element.children.push(childElement);
                                }
                            }
                        } else {
                            childrenList = ArrayDirect(XQuery("sql: " +
                                " SELECT ds.id, " +
                                "       ds.name " +
                                " FROM [WTDB].[dbo].documents ds " +
                                " WHERE ds.parent_document_id = " + element.id +
                                " ORDER BY name "));

                            if (ArrayCount(childrenList) > 0) {
                                for (child in childrenList) {
                                    childDoc = tools.open_doc(child.id);

                                    if (childDoc != undefined) {
                                        if (hasAccess(childDoc.TopElem, role, userId)) {
                                            childElement = {};
                                            childElement.id = "" + child.id;
                                            childElement.name = child.name;

                                            element.children.push(childElement);
                                        }
                                    }
                                }
                            }
                        }

                        result.elements.push(element);
                    }
                }
            }
        }
    } else {
        result.errorMessage = "# Collaborator with ID " + userId + " is not exist!";
    }
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;
}

Response.Write(EncodeJson(result));
%>