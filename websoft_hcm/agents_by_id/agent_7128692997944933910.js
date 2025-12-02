// 7128692997944933910
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function normalizeWaveNumber(wave) {
    return StrReplace(wave, "/", "\\");
}

function getBaseCertificateCount(value1, value2, value3, value4, value5, value6, value7,) {
    count = 0;

    if(value1 != undefined && value1 != "") {
        count++;
    }
    if(value2 != undefined && value2 != "") {
        count++;
    }
    if(value3 != undefined && value3 != "") {
        count++;
    }
    if(value4 != undefined && value4 != "") {
        count++;
    }
    if(value5 != undefined && value5 != "") {
        count++;
    }
    if(value6 != undefined && value6 != "") {
        count++;
    }
    if(value7 != undefined && value7 != "") {
        count++;
    }

    return count;
}

var agentId = 7128692997944933910;
var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
var msPerRecord = 0.001;

var startDate = Date();
var prevDate;
var loggerName = "agent_7128692997944933910";
var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

var total = 0;
var processed = 0;

var excel = new ActiveXObject("Websoft.Office.Excel.Document");
var reportString = new Binary();

agent.message = "Получение данных...";
ws = sendMessageToWebsocket(ws, agent);
prevDate = new Date();

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

try {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ds.trainer_fullname AS fullname, " +
        "    d.data.value('(//position_trainer)[1]', 'varchar(max)') AS position, " +
        "    d.data.value('(//organization_inn)[1]', 'varchar(max)') AS inn, " +
        "    os.name AS org_name, " +
        "    d.data.value('(//headcount)[1]', 'varchar(max)') AS headcount, " +
        "    d.data.value('(//region_organization)[1]', 'varchar(max)') AS region, " +
        "    d.data.value('(//region_in_reporting)[1]', 'varchar(max)') AS report_region, " +
        "    d.data.value('(//email)[1]', 'varchar(max)') AS email, " +
        "    d.data.value('(//phone)[1]', 'varchar(max)') AS phone, " +
        "    d.data.value('(//trainer_type)[1]', 'varchar(max)') AS type, " +
        "    d.data.value('(//basic_training_program)[1]', 'varchar(max)') AS program, " +
        "    d.data.value('(//support_format)[1]', 'varchar(max)') AS support, " +
        "    d.data.value('(//curator_fullname)[1]', 'varchar(max)') AS curator_fio, " +
        "    d.data.value('(//curator_email)[1]', 'varchar(max)') AS curator_email, " +
        "    d.data.value('(//curator_phone)[1]', 'varchar(max)') AS curator_phone, " +
        "    d.data.value('(//date_selection)[1]', 'varchar(max)') AS date_selection, " +
        "    d.data.value('(//result_selection)[1]', 'varchar(max)') AS result_selection, " +
        "    d.data.value('(//wave_number)[1]', 'varchar(max)') AS wave_number, " +
        "    d.data.value('(//start_date)[1]', 'varchar(max)') AS start, " +
        "    d.data.value('(//finish_date)[1]', 'varchar(max)') AS finish, " +
        "    d.data.value('(//fact_trained)[1]', 'varchar(max)') AS trained, " +
        "    d.data.value('(//status_trainer)[1]', 'varchar(max)') AS status, " +
        "    d.data.value('(//comments)[1]', 'varchar(max)') AS comment, " +
        "    d.data.value('(//obp_result)[1]', 'varchar(max)') AS obp_result, " +
        "    d.data.value('(//obp_cert_date)[1]', 'varchar(max)') AS obp_cert_date, " +
        "    d.data.value('(//obp_cert)[1]', 'varchar(max)') AS obp_cert, " +
        "    d.data.value('(//mrp_result)[1]', 'varchar(max)') AS mrp_result, " +
        "    d.data.value('(//mrp_cert_date)[1]', 'varchar(max)') AS mrp_cert_date, " +
        "    d.data.value('(//mrp_cert)[1]', 'varchar(max)') AS mrp_cert, " +
        "    d.data.value('(//kart_result)[1]', 'varchar(max)') AS kart_result, " +
        "    d.data.value('(//kart_cert_date)[1]', 'varchar(max)') AS kart_cert_date, " +
        "    d.data.value('(//kart_cert)[1]', 'varchar(max)') AS kart_cert, " +
        "    d.data.value('(//pa_result)[1]', 'varchar(max)') AS pa_result, " +
        "    d.data.value('(//pa_cert_date)[1]', 'varchar(max)') AS pa_cert_date, " +
        "    d.data.value('(//pa_cert)[1]', 'varchar(max)') AS pa_cert, " +
        "    d.data.value('(//vp7_result)[1]', 'varchar(max)') AS vp7_result, " +
        "    d.data.value('(//vp7_cert_date)[1]', 'varchar(max)') AS vp7_cert_date, " +
        "    d.data.value('(//vp7_cert)[1]', 'varchar(max)') AS vp7_cert, " +
        "    d.data.value('(//rpu_result)[1]', 'varchar(max)') AS rpu_result, " +
        "    d.data.value('(//rpu_cert_date)[1]', 'varchar(max)') AS rpu_cert_date, " +
        "    d.data.value('(//rpu_cert)[1]', 'varchar(max)') AS rpu_cert, " +
        "    d.data.value('(//c5_result)[1]', 'varchar(max)') AS c5_result, " +
        "    d.data.value('(//c5_cert_date)[1]', 'varchar(max)') AS c5_cert_date, " +
        "    d.data.value('(//c5_cert)[1]', 'varchar(max)') AS c5_cert, " +
        "    0 AS count1, " +
        "    ems1.name AS dop_1_name, " +
        "    d.data.value('(//dop_1_event_date)[1]', 'varchar(max)') AS dop_1_event_date, " +
        "    d.data.value('(//dop_1_cert_date)[1]', 'varchar(max)') AS dop_1_cert_date, " +
        "    d.data.value('(//dop_1_result)[1]', 'varchar(max)') AS dop_1_result, " +
        "    d.data.value('(//dop_1_cert)[1]', 'varchar(max)') AS dop_1_cert, " +
        "    ems2.name AS dop_2_name, " +
        "    d.data.value('(//dop_2_event_date)[1]', 'varchar(max)') AS dop_2_event_date, " +
        "    d.data.value('(//dop_2_cert_date)[1]', 'varchar(max)') AS dop_2_cert_date, " +
        "    d.data.value('(//dop_2_result)[1]', 'varchar(max)') AS dop_2_result, " +
        "    d.data.value('(//dop_2_cert)[1]', 'varchar(max)') AS dop_2_cert, " +
        "    ems3.name AS dop_3_name, " +
        "    d.data.value('(//dop_3_event_date)[1]', 'varchar(max)') AS dop_3_event_date, " +
        "    d.data.value('(//dop_3_cert_date)[1]', 'varchar(max)') AS dop_3_cert_date, " +
        "    d.data.value('(//dop_3_result)[1]', 'varchar(max)') AS dop_3_result, " +
        "    d.data.value('(//dop_3_cert)[1]', 'varchar(max)') AS dop_3_cert, " +
        "    ems4.name AS dop_4_name, " +
        "    d.data.value('(//dop_4_event_date)[1]', 'varchar(max)') AS dop_4_event_date, " +
        "    d.data.value('(//dop_4_cert_date)[1]', 'varchar(max)') AS dop_4_cert_date, " +
        "    d.data.value('(//dop_4_result)[1]', 'varchar(max)') AS dop_4_result, " +
        "    d.data.value('(//dop_4_cert)[1]', 'varchar(max)') AS dop_4_cert, " +
        "    ems5.name AS dop_5_name, " +
        "    d.data.value('(//dop_5_event_date)[1]', 'varchar(max)') AS dop_5_event_date, " +
        "    d.data.value('(//dop_5_cert_date)[1]', 'varchar(max)') AS dop_5_cert_date, " +
        "    d.data.value('(//dop_5_result)[1]', 'varchar(max)') AS dop_5_result, " +
        "    d.data.value('(//dop_5_cert)[1]', 'varchar(max)') AS dop_5_cert, " +
        "    ems6.name AS dop_6_name, " +
        "    d.data.value('(//dop_6_event_date)[1]', 'varchar(max)') AS dop_6_event_date, " +
        "    d.data.value('(//dop_6_cert_date)[1]', 'varchar(max)') AS dop_6_cert_date, " +
        "    d.data.value('(//dop_6_result)[1]', 'varchar(max)') AS dop_6_result, " +
        "    d.data.value('(//dop_6_cert)[1]', 'varchar(max)') AS dop_6_cert, " +
        "    0 AS count2, " +
        "    ds.trainer_id AS trainer_id, " +
        "    cs.fullname AS trainer_fio, " +
        "    os.code AS org_inn, " +
        "    rs.name AS region_name, " +
        "    ds.id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s ds " +
        "    LEFT JOIN [WTDB].[dbo].cc_dossier_vntren_2025 d ON ds.id = d.id " +
        "    LEFT JOIN [WTDB].[dbo].collaborators cs ON ds.trainer_id = cs.id " +
        "    LEFT JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    LEFT JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems1 ON d.data.value('(//dop_1)[1]', 'bigint') = ems1.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems2 ON d.data.value('(//dop_2)[1]', 'bigint') = ems2.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems3 ON d.data.value('(//dop_3)[1]', 'bigint') = ems3.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems4 ON d.data.value('(//dop_4)[1]', 'bigint') = ems4.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems5 ON d.data.value('(//dop_5)[1]', 'bigint') = ems5.id " +
        "    LEFT JOIN [WTDB].[dbo].education_methods ems6 ON d.data.value('(//dop_6)[1]', 'bigint') = ems6.id "));

    total = ArrayCount(dataList);

    agent.total = total;
    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    reportString.AppendStr("<html>");
    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>");
    reportString.AppendStr("<td class='header'>ФИО тренера</td>");
    reportString.AppendStr("<td class='header'>Должность</td>");
    reportString.AppendStr("<td class='header'>ИНН</td>");
    reportString.AppendStr("<td class='header'>Предприятие</td>");
    reportString.AppendStr("<td class='header'>Среднесписочная численность предприятия</td>");
    reportString.AppendStr("<td class='header'>Регион ВТ/ИБП</td>");
    reportString.AppendStr("<td class='header'>Регион в отчетности</td>");
    reportString.AppendStr("<td class='header'>Адрес эл.почты</td>");
    reportString.AppendStr("<td class='header'>Номер телефона</td>");
    reportString.AppendStr("<td class='header'>Вид тренера</td>");
    reportString.AppendStr("<td class='header'>Основная программа подготовки</td>");
    reportString.AppendStr("<td class='header'>Формат поддержки</td>");
    reportString.AppendStr("<td class='header'>ФИО контактного лица / тренера РЦК</td>");
    reportString.AppendStr("<td class='header'>email контактного лица/тренера РЦК</td>");
    reportString.AppendStr("<td class='header'>Номер телефона контактного лица/тренера РЦК</td>");
    reportString.AppendStr("<td class='header'>Дата отбора</td>");
    reportString.AppendStr("<td class='header'>Результат очного отбора</td>");
    reportString.AppendStr("<td class='header'>Номер группы ВТ /Номер волны ИБП</td>");
    reportString.AppendStr("<td class='header'>Дата начала обучения</td>");
    reportString.AppendStr("<td class='header'>Дата завершения обучения</td>");
    reportString.AppendStr("<td class='header'>ПРОШЕЛ ПОДГОТОВКУ (для отчетности)</td>");
    reportString.AppendStr("<td class='header'>Статус тренера/ИБП</td>");
    reportString.AppendStr("<td class='header'>Комментарии</td>");
    reportString.AppendStr("<td class='header'>Программа \"Основы бережливого производства\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"Методика решения проблем\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"Картирование\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"Производственный анализ\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"7 видов потерь\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"Реализация проекта по улучшению\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Программа \"5С на производстве\" результат</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Кол-во сертификатов</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 1</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 2</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 3</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 4</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 5</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Дополнительная программа 6</td>");
    reportString.AppendStr("<td class='header'>Дата обучения</td>");
    reportString.AppendStr("<td class='header'>Дата сертификации</td>");
    reportString.AppendStr("<td class='header'>Сертификат</td>");
    reportString.AppendStr("<td class='header'>Кол-во сертификатов</td>");
    reportString.AppendStr("<td class='header'>ID пользователя</td>");
    reportString.AppendStr("<td class='header'>ФИО пользователя</td>");
    reportString.AppendStr("<td class='header'>ИНН пользователя</td>");
    reportString.AppendStr("<td class='header'>Организация пользователя</td>");
    reportString.AppendStr("<td class='header'>Регион пользователя</td>");
    reportString.AppendStr("<td class='header'>ID досье тренера</td>");

    reportString.AppendStr("</tr>");

    for (data in dataList) {
        reportString.AppendStr(
            "<tr>" +
            "<td>" + data.fullname + "</td>" +
            "<td>" + data.position + "</td>" +
            "<td>" + data.inn + "</td>" +
            "<td>" + data.org_name + "</td>" +
            "<td>" + data.headcount + "</td>" +
            "<td>" + data.region + "</td>" +
            "<td>" + data.report_region + "</td>" +
            "<td>" + data.email + "</td>" +
            "<td>" + data.phone + "</td>" +
            "<td>" + data.type + "</td>" +
            "<td>" + data.program + "</td>" +
            "<td>" + data.support + "</td>" +
            "<td>" + data.curator_fio + "</td>" +
            "<td>" + data.curator_email + "</td>" +
            "<td>" + data.curator_phone + "</td>" +
            "<td>" + (data.date_selection == "" ? "" : StrDate(Date(data.date_selection), false, false)) + "</td>" +
            "<td>" + data.result_selection + "</td>" +
            "<td>" + normalizeWaveNumber(data.wave_number) + "</td>" +
            "<td>" + data.start + "</td>" +
            "<td>" + data.finish + "</td>" +
            "<td>" + data.trained + "</td>" +
            "<td>" + data.status + "</td>" +
            "<td>" + data.comment + "</td>" +
            "<td>" + data.obp_result + "</td>" +
            "<td>" + (data.obp_cert_date == "" ? "" : StrDate(Date(data.obp_cert_date), false, false)) + "</td>" +
            "<td>" + data.obp_cert + "</td>" +
            "<td>" + data.mrp_result + "</td>" +
            "<td>" + (data.mrp_cert_date == "" ? "" : StrDate(Date(data.mrp_cert_date), false, false)) + "</td>" +
            "<td>" + data.mrp_cert + "</td>" +
            "<td>" + data.kart_result + "</td>" +
            "<td>" + (data.kart_cert_date == "" ? "" : StrDate(Date(data.kart_cert_date), false, false)) + "</td>" +
            "<td>" + data.kart_cert + "</td>" +
            "<td>" + data.pa_result + "</td>" +
            "<td>" + (data.pa_cert_date == "" ? "" : StrDate(Date(data.pa_cert_date), false, false)) + "</td>" +
            "<td>" + data.pa_cert + "</td>" +
            "<td>" + data.vp7_result + "</td>" +
            "<td>" + (data.vp7_cert_date == "" ? "" : StrDate(Date(data.vp7_cert_date), false, false)) + "</td>" +
            "<td>" + data.vp7_cert + "</td>" +
            "<td>" + data.rpu_result + "</td>" +
            "<td>" + (data.rpu_cert_date == "" ? "" : StrDate(Date(data.rpu_cert_date), false, false)) + "</td>" +
            "<td>" + data.rpu_cert + "</td>" +
            "<td>" + data.c5_result + "</td>" +
            "<td>" + (data.c5_cert_date == "" ? "" : StrDate(Date(data.c5_cert_date), false, false)) + "</td>" +
            "<td>" + data.c5_cert + "</td>" +
            "<td>" + getBaseCertificateCount(data.obp_cert, data.mrp_cert, data.kart_cert, data.pa_cert, data.vp7_cert, data.rpu_cert, data.c5_cert) + "</td>" +
            "<td>" + data.dop_1_name + "</td>" +
            "<td>" + (data.dop_1_event_date == "" ? "" : StrDate(Date(data.dop_1_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_1_cert_date == "" ? "" : StrDate(Date(data.dop_1_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_1_result + "</td>" +
            "<td>" + data.dop_1_cert + "</td>" +
            "<td>" + data.dop_2_name + "</td>" +
            "<td>" + (data.dop_2_event_date == "" ? "" : StrDate(Date(data.dop_2_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_2_cert_date == "" ? "" : StrDate(Date(data.dop_2_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_2_result + "</td>" +
            "<td>" + data.dop_2_cert + "</td>" +
            "<td>" + data.dop_3_name + "</td>" +
            "<td>" + (data.dop_3_event_date == "" ? "" : StrDate(Date(data.dop_3_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_3_cert_date == "" ? "" : StrDate(Date(data.dop_3_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_3_result + "</td>" +
            "<td>" + data.dop_3_cert + "</td>" +
            "<td>" + data.dop_4_name + "</td>" +
            "<td>" + (data.dop_4_event_date == "" ? "" : StrDate(Date(data.dop_4_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_4_cert_date == "" ? "" : StrDate(Date(data.dop_4_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_4_result + "</td>" +
            "<td>" + data.dop_4_cert + "</td>" +
            "<td>" + data.dop_5_name + "</td>" +
            "<td>" + (data.dop_5_event_date == "" ? "" : StrDate(Date(data.dop_5_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_5_cert_date == "" ? "" : StrDate(Date(data.dop_5_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_5_result + "</td>" +
            "<td>" + data.dop_5_cert + "</td>" +
            "<td>" + data.dop_6_name + "</td>" +
            "<td>" + (data.dop_6_event_date == "" ? "" : StrDate(Date(data.dop_6_event_date), false, false)) + "</td>" +
            "<td>" + (data.dop_6_cert_date == "" ? "": StrDate(Date(data.dop_6_cert_date), false, false)) + "</td>" +
            "<td>" + data.dop_6_result + "</td>" +
            "<td>" + data.dop_6_cert + "</td>" +
            "<td>" + getBaseCertificateCount(data.dop_1_cert, data.dop_2_cert, data.dop_3_cert, data.dop_4_cert, data.dop_5_cert, data.dop_6_cert) + "</td>" +
            "<td>'" + data.trainer_id + "</td>" +
            "<td>" + data.trainer_fio + "</td>" +
            "<td>" + data.org_inn + "</td>" +
            "<td>" + data.region_name + "</td>" +
            "<td>'" + data.id + "</td>" +
            "</tr>");

        processed++;

        if (processed % 100 == 0) {
            agent.processed = processed;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
        }
        if (processed % 1000 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage((total - processed) * msPerRecord)
            );
        }
    }

    agent.processed = processed;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Сохраняем Excel файл...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    // SAVE EXCEL FILE
    reportString.AppendStr("</table></html>");
    excel.LoadHtmlString(reportString.GetStr(), "");
    excel.SaveAs("E:/Websoft/WebSoftServer/wt/web/Reports/inner_trainers/dossier_vt_" + ParseDate(Date()) + ".xlsx");

    agent.state = 1;
    agent.processed = processed;
    agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, total);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        total + " total, ",
        processed + " processed",
        null,
        null
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );
} catch (e) {
    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) {}
