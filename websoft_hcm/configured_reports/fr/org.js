// 6935800404268030540
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

var agentId = 6935800404268030540;
var userId = 7351734047845980789;
var loggerName = "report_6935800404268030540";
var msPerRecord = 0.001;

var startDate = Date();
var prevDate= Date();
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);

arr = ArraySelectAll( XQuery( "sql: " +
    "SELECT orgs.id AS PK, " +
    "     collaborators.id AS col_id, " +
    "     collaborators.code AS col_code, " +
    "     collaborators.fullname AS col_fio, " +
    "     collaborators.email AS col_email, " +
    "     boss_types.name AS col_boss_type, " +
    "     orgs.id AS o_id, " +
    "     orgs.name AS o_name, " +
    "     CONCAT( '''', orgs.code ) AS o_inn, " +
    "     org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') AS org_is_rck, " +
    "     org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS org_format_part, " +
    "     regions.name AS region_name, " +
    "     regions.code AS region_code, " +
    "     collaborators.is_dismiss AS col_is_dismiss, " +
    "     ps.name AS pos_name, " +
    "     org.data.value('(//custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') AS is_project_ended " +
    " FROM func_managers" +
    " LEFT JOIN collaborators ON collaborators.id = func_managers.person_id" +
    " LEFT JOIN boss_types ON boss_types.id = func_managers.boss_type_id" +
    " LEFT JOIN orgs ON orgs.id = func_managers.org_id" +
    " LEFT JOIN org ON org.id = orgs.id" +
    " LEFT JOIN regions ON regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') " +
    " LEFT JOIN [WTDB].[dbo].positions ps ON collaborators.position_id = ps.id " +
    " WHERE func_managers.catalog = 'org'"));

total = ArrayCount(arr);
processed = 0;

agent.total = total;
agent.processed = processed;
agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
agent.refreshChart = 1;
agent.message = "Обработка данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = Date();

results = [];

for (elem in arr) {
    try {
        organizations = ArraySelectAll(XQuery("sql: " +
            " SELECT orgs.id AS org_id," +
            "   orgs.name AS org_name," +
            "   org.data.value('(//custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') AS is_rck," +
            "   regs.name AS fact_region_name " +
            " FROM [WTDB].[dbo].collaborators AS colls" +
            "   INNER JOIN [WTDB].[dbo].orgs as orgs ON orgs.id = colls.org_id" +
            "   INNER JOIN [WTDB].[dbo].org AS org ON org.id = orgs.id" +
            "   INNER JOIN [WTDB].[dbo].regions AS regs ON regs.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)')" +
            " WHERE colls.id = " + elem.col_id
        ));

        obj = {};
        obj.SetProperty("PrimaryKey", String(elem.PK));

        if(ArrayCount(organizations) > 0) {
            obj.SetProperty("fm_org_name", String(organizations[0].org_name));
            obj.SetProperty("fm_org_is_rck", String(organizations[0].is_rck));
            obj.SetProperty("fm_org_region", String(organizations[0].fact_region_name));
        } else {
            obj.SetProperty("fm_org_name", "Не найдена");
            obj.SetProperty("fm_org_is_rck", "false");
            obj.SetProperty("fm_org_region", "Не найден");
        }

        for(fldElem in elem) {
            obj.SetProperty( fldElem.Name, String(fldElem));
        }

        results.push(obj);
    } catch(e){
        //agent.errorMessage = e;
        //ws = sendMessageToWebsocket(ws, agent);
    }

    processed++;

    if (processed % 100 == 0) {
        agent.processed = processed;
        ws = sendMessageToWebsocket(ws, agent);
    }
}

agent.state = 1;
agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
agent.processed = processed;
refreshMsPerRow(agent, startDate, total);
duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
agent.message = "Закончено. Продолжительность " + duration;
ws = sendMessageToWebsocket(ws, agent);

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}

_cc = columns.Clear();

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = false;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "ID result";
_cc.column_value = "ListElem.PrimaryKey";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Код";
_cc.column_value = "ListElem.col_code";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "ФИО";
_cc.column_value = "ListElem.col_fio";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Должность";
_cc.column_value = "ListElem.pos_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Email";
_cc.column_value = "ListElem.col_email";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Организация фр";
_cc.column_value = "ListElem.fm_org_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Организация фр РЦК?";
_cc.column_value = "ListElem.fm_org_is_rck";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Фактический регион организации руководителя ";
_cc.column_value = "ListElem.fm_org_region";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Тип";
_cc.column_value = "ListElem.col_boss_type";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "20";
_cc.column_title = "Организация";
_cc.column_value = "ListElem.o_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "ИНН";
_cc.column_value = "ListElem.o_inn";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "РЦК?";
_cc.column_value = "ListElem.org_is_rck";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Тип поддержки";
_cc.column_value = "ListElem.org_format_part";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Фактический регион";
_cc.column_value = "ListElem.region_name";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Код фактического региона";
_cc.column_value = "ListElem.region_code";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Уволен";
_cc.column_value = "ListElem.col_is_dismiss";

_cc = columns.AddChild();
_cc.flag_formula = true;
_cc.flag_visible = true;
_cc.datatype = "string";
_cc.column_width = "10";
_cc.column_title = "Проект завершен";
_cc.column_value = "ListElem.is_project_ended";

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}

return results;