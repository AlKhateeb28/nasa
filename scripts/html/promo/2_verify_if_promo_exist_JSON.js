<%
// 7201577243611495245
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getDefaultImageNameIfNeeded(imageName) {
    if(imageName == "") {
        return "7203969542123393659";
    } else {
        return imageName;
    }
}

agentId = 7201577243611495245;
var loggerName = "web_7201577243611495245";

var result = {};
result.errorMessage = "";
result.message = "";
result.response = {};
result.response.count = 0;

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    promoList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].benefit_items " +
        " WHERE status = 'active' " +
        "   AND GETDATE() < finish_date + 1"));

    promoCount = ArrayCount(promoList);

    if(promoCount > 0) {
        promoList = ArrayDirect(XQuery("sql: " +
            " SELECT bis1.code AS promo_code1, " +
            "       bis1.name AS name1, " +
            "       bi1.data.value('(//custom_elems/custom_elem[name=''direct_url'']/value)[1]', 'varchar(max)') AS url1, " +
            "       bis1.finish_date AS finish_date1, " +
            "       bi1.data.value('(//custom_elems/custom_elem[name=''image_id'']/value)[1]', 'varchar(max)') AS image1, " +
            "       bis2.code AS promo_code2, " +
            "       bis2.name AS name2, " +
            "       bi2.data.value('(//custom_elems/custom_elem[name=''direct_url'']/value)[1]', 'varchar(max)') AS url2, " +
            "       bis2.finish_date AS finish_date2, " +
            "       bi2.data.value('(//custom_elems/custom_elem[name=''image_id'']/value)[1]', 'varchar(max)') AS image2, " +
            "       bis3.code AS promo_code3, " +
            "       bis3.name AS name3, " +
            "       bi3.data.value('(//custom_elems/custom_elem[name=''direct_url'']/value)[1]', 'varchar(max)') AS url3, " +
            "       bis3.finish_date AS finish_date3, " +
            "       bi3.data.value('(//custom_elems/custom_elem[name=''image_id'']/value)[1]', 'varchar(max)') AS image3 " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id " +
            "    LEFT JOIN [WTDB].[dbo].benefit_items bis1 ON c.data.value('(//custom_elems/custom_elem[name=''promo_1'']/value)[1]', 'bigint') = bis1.id AND bis1.status = 'active' AND GETDATE() < bis1.finish_date + 1 " +
            "    LEFT JOIN [WTDB].[dbo].benefit_item bi1 ON bis1.id = bi1.id " +
            "    LEFT JOIN [WTDB].[dbo].benefit_items bis2 ON c.data.value('(//custom_elems/custom_elem[name=''promo_2'']/value)[1]', 'bigint') = bis2.id AND bis2.status = 'active' AND GETDATE() < bis2.finish_date + 1 " +
            "    LEFT JOIN [WTDB].[dbo].benefit_item bi2 ON bis2.id = bi2.id " +
            "    LEFT JOIN [WTDB].[dbo].benefit_items bis3 ON c.data.value('(//custom_elems/custom_elem[name=''promo_3'']/value)[1]', 'bigint') = bis3.id AND bis3.status = 'active' AND GETDATE() < bis3.finish_date + 1 " +
            "    LEFT JOIN [WTDB].[dbo].benefit_item bi3 ON bis3.id = bi3.id " +
            " WHERE cs.id = " + curUserID));

        count = ArrayCount(promoList)

        if(count > 0 && (promoList[0].promo_code1 != "" || promoList[0].promo_code2 != "" || promoList[0].promo_code3 != "")) {
            if(promoList[0].promo_code1 != "" && promoList[0].promo_code2 != "" && promoList[0].promo_code3 != "") {
                result
            } else {

            }

            result.response.count = count;
            result.response.code1 = promoList[0].promo_code1;
            result.response.name1 = promoList[0].name1;
            result.response.url1 = promoList[0].url1;
            result.response.finish1 = StrDate(promoList[0].finish_date1, false, false);
            result.response.image1 = getDefaultImageNameIfNeeded(promoList[0].image1);
            result.response.code2 = promoList[0].promo_code2;
            result.response.name2 = promoList[0].name2;
            result.response.url2 = promoList[0].url2;
            result.response.finish2 = StrDate(promoList[0].finish_date2, false, false);
            result.response.image2 = getDefaultImageNameIfNeeded(promoList[0].image2);
            result.response.code3 = promoList[0].promo_code3;
            result.response.name3 = promoList[0].name3;
            result.response.url3 = promoList[0].url3;
            result.response.finish3 = StrDate(promoList[0].finish_date3, false, false);
            result.response.image3 = getDefaultImageNameIfNeeded(promoList[0].image3);
        }
    }

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>