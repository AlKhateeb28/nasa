<%
// 7201541556392622416

// ERROR CODES
// be5cb3 - user not found
// d99a5d - can't load collaborator by id
// 4deff0 - group not found by promo code
// fe529e - can't load group by promo code
// ff00ff - collaborator is not exist

function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function isPromoAlreadyActivated(promoId) {
    promoId = OptInt(promoId);

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.id " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "    INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        " WHERE cs.id = " + curUserID +
        "    AND (c.data.value('(//custom_elems/custom_elem[name=''promo_1'']/value)[1]', 'bigint') = " + promoId +
        "    OR c.data.value('(//custom_elems/custom_elem[name=''promo_2'']/value)[1]', 'bigint') = " + promoId +
        "    OR c.data.value('(//custom_elems/custom_elem[name=''promo_3'']/value)[1]', 'bigint') = " + promoId + ") "));

    return ArrayCount(dataList) > 0;
}

function isActivationAvailable(promoId) {
    collaboratorDoc = tools.open_doc(curUserID);

    if(collaboratorDoc != undefined) {
        collaboratorDocTE = collaboratorDoc.TopElem;

        if(collaboratorDocTE.org_id == 6650093861350539604) {
            // NO CHECK ACTIVATED LIMIT FOR FCK ORGANIZATION
            return true;
        }

        promoId = OptInt(promoId);

        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _view AS ( " +
            "    SELECT cs.id, " +
            "           " + promoId + " AS promo_id " +
            "    FROM [WTDB].[dbo].collaborators cs " +
            "        INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
            "    WHERE cs.org_id = " + collaboratorDocTE.org_id +
            "        AND (c.data.value('(//custom_elems/custom_elem[name=''promo_1'']/value)[1]', 'bigint') = " + promoId +
            "            OR c.data.value('(//custom_elems/custom_elem[name=''promo_2'']/value)[1]', 'bigint') = " + promoId +
            "            OR c.data.value('(//custom_elems/custom_elem[name=''promo_3'']/value)[1]', 'bigint') = " + promoId + ") " +
            " ) " +
            " SELECT COUNT(_v.promo_id) AS count, " +
            "       MAX(bi.data.value('(//custom_elems/custom_elem[name=''max_from_org'']/value)[1]', 'int')) AS max " +
            " FROM _view AS _v " +
            "    INNER JOIN [WTDB].[dbo].benefit_items bis ON _v.promo_id = bis.id " +
            "    INNER JOIN [WTDB].[dbo].benefit_item bi ON bis.id = bi.id " +
            " GROUP BY _v.promo_id "));

        if(ArrayCount(dataList) == 0) {
            return true;
        } else {
            return dataList[0].max == null || dataList[0].count < dataList[0].max;
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + curUserID + " is not exist!");

        result.errorMessage = "#Произошла ошибка на сервере. Обратитесь в службу поддержки. Код ошибки: ff00ff";

        return false;
    }
}

function getFreePromoSlotIndex() {
    activatedPromoList = ArrayDirect(XQuery("sql: " +
        " SELECT c.data.value('(//custom_elems/custom_elem[name=''promo_1'']/value)[1]', 'bigint') AS promo1, " +
        "       c.data.value('(//custom_elems/custom_elem[name=''promo_2'']/value)[1]', 'bigint') AS promo2, " +
        "       c.data.value('(//custom_elems/custom_elem[name=''promo_3'']/value)[1]', 'bigint') AS promo3 " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "    INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
        " WHERE cs.id = " + curUserID));

    if(ArrayCount(activatedPromoList) == 0) {
        return 1;
    } else {
        if(activatedPromoList[0].promo1 == null) {
            return 1;
        } if(activatedPromoList[0].promo2 == null) {
            return 2;
        } if(activatedPromoList[0].promo3 == null) {
            return 3;
        } else {
            return null;
        }
    }
}

agentId = 7201541556392622416;
var loggerName = "web_7201541556392622416";

var result = {};
result.errorMessage = "";
result.message = "";

try {
    paramPromo = Request.Query.GetOptProperty("promo", null);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    if(paramPromo != null && paramPromo != "") {
        promoList = ArrayDirect(XQuery("sql: " +
            " SELECT id " +
            " FROM [WTDB].[dbo].benefit_items " +
            " WHERE UPPER(code) = '" + StrUpperCase(paramPromo) + "' " +
            "   AND status = 'active' " +
            "   AND GETDATE() < finish_date + 1"));

        if(ArrayCount(promoList) > 0) {
            // CHECK IF PROMO IS ALREADY ACTIVATED ON CURRENT USER
            if(!isPromoAlreadyActivated(promoList[0].id)) {
                // CHECK COUNT ENTERED PROMO BY ORGANIZATION
                if (isActivationAvailable(promoList[0].id)) {
                    collaboratorList = ArrayDirect(XQuery("sql: " +
                        " SELECT id " +
                        " FROM [WTDB].[dbo].collaborators " +
                        " WHERE id = " + curUserID));

                    if (ArrayCount(collaboratorList) > 0) {
                        collaboratorDoc = tools.open_doc(collaboratorList[0].id);

                        if (collaboratorDoc != undefined) {
                            freePromoSlotIndex = getFreePromoSlotIndex();

                            if(freePromoSlotIndex != null) {
                                collaboratorDoc.TopElem.custom_elems.ObtainChildByKey("promo_" + freePromoSlotIndex).value = promoList[0].id;

                                collaboratorDoc.Save();

                                groupList = ArrayDirect(XQuery("sql: " +
                                    " SELECT id " +
                                    " FROM [WTDB].[dbo].groups " +
                                    " WHERE UPPER(code) = '" + StrUpperCase(paramPromo) + "' "));

                                if (ArrayCount(groupList) > 0) {
                                    groupDoc = tools.open_doc(groupList[0].id);

                                    if (groupDoc != undefined) {
                                        groupDoc.TopElem.collaborators.ObtainChildByKey(collaboratorList[0].id);

                                        groupDoc.Save();

                                        result.message = "Successful";
                                    } else {
                                        result.errorMessage = "#Произошла ошибка на сервере. Обратитесь в службу поддержки. Код ошибки: fe529e";
                                    }
                                } else {
                                    result.errorMessage = "#Произошла ошибка на сервере. Обратитесь в службу поддержки. Код ошибки: 4deff0";
                                }
                            } else {
                                result.errorMessage = "#Активировано промокодов 3 из 3.";
                            }
                        } else {
                            result.errorMessage = "#Произошла ошибка на сервере. Обратитесь в службу поддержки. Код ошибки: d99a5d";
                        }
                    } else {
                        result.errorMessage = "#Произошла ошибка на сервере. Обратитесь в службу поддержки. Код ошибки: be5cb3";
                    }




                } else {
                    if(result.errorMessage == "") {
                        result.errorMessage = "#Превышен лимит активируемого промокода.";
                    }
                }
            } else {
                result.errorMessage = "#Промокод уже активирован.";
            }
        } else {
            result.errorMessage = "#Данный промокод не существует или истек.";
        }
    } else {
        result.errorMessage = "#Пустое значение промокода!";
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>