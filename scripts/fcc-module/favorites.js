<%
// 7431526482344747895
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7431526482344747895;
var loggerName = "aa_agent_7431526482344747895";

var result = {};
result.errorMessage = "";
result.favorites = [];

try {
    mode = OptInt(Request.Query.GetOptProperty("mode", "1"));
    pageId = OptInt(Request.Query.GetOptProperty("page_id", "0"));

    if(mode == 1) {
        favoritesList = ArrayDirect(XQuery("sql: " +
            " SELECT page_id " +
            " FROM favorites  " +
            " WHERE user_id = " + curUserID +
            " ORDER BY id "));

        for(favorite in favoritesList) {
            result.favorites.push(favorite.page_id);
        }
    } else if(mode == 2) {
        if(pageId != 0) {
            ArrayDirect(XQuery("sql: " +
                " INSERT " +
                " INTO favorites  " +
                " VALUES(" + curUserID + ", " + pageId + ")"));
        }
    } else if(mode == 8){
        if(pageId != 0) {
            ArrayDirect(XQuery("sql: " +
                " DELETE " +
                " FROM favorites  " +
                " WHERE user_id = " + curUserID +
                " AND page_id = " + pageId));
        }
    }

    result.errorMessage = "";
    result.state = "SUCCESS";
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    result.errorMessage = e;
    result.state = "ERROR";
}

Response.Write(EncodeJson(result));
%>