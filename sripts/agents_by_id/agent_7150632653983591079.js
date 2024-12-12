// 7150632653983591079
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if (LdsIsServer) {
    var agentId = 7150632653983591079;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7150632653983591079";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var skipped = 0;
    var notFound = 0;

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        var f_url = "E:/Websoft/Reports/report_orgs/report_orgs_" + ParseDate( Date() ) + ".xlsx";
        var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document");
        var report_string = new Binary();

        arr = ArrayDirect( XQuery( "sql:
        SELECT
        CONCAT ( '''', orgs.id ) AS PK
            , CONCAT ( '''', orgs.code ) AS o_inn
            , orgs.name AS o_name
            , regions.code AS reg_code
            , regions.name AS reg_name
            , ( SELECT regions.name FROM regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name
            , ( SELECT regions.name FROM regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'varchar(max)') ) AS report_region_name
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''in_program''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS in_program
            , org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_rck
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_roiv
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_partner
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_commercial''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_commercial
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_extended_support''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_extended_support,
            CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_a_commerce_client''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_a_commerce_client
            , CASE
        WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
        ELSE '-'
        END AS is_project_ended
            , org.data.value('(org/custom_elems/custom_elem[name=''industry''])[1]/value[1]', 'varchar(max)') AS industry
            , org.data.value('(org/custom_elems/custom_elem[name=''org_address''])[1]/value[1]', 'varchar(max)') AS org_address
            , org.data.value('(org/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS guid
            , org.created AS o_created_date
            , orgs.modification_date AS o_modification_date
            , ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.web_banned = 1 ) AS count_muc_cols
            , ( SELECT COUNT (*) FROM collaborators WHERE org_id = orgs.id AND collaborators.web_banned = 0 ) AS count_not_muc_cols
            , (
            SELECT COUNT (*)
        FROM group_collaborators
        LEFT JOIN collaborators ON collaborators.id = group_collaborators.collaborator_id
        WHERE collaborators.org_id = orgs.id
        AND collaborators.web_banned = 0
        AND group_collaborators.group_id = 6638815798247752808
    ) AS count_treners_by_group
        FROM orgs
        LEFT JOIN org
        ON org.id = orgs.id
        LEFT JOIN regions
        ON regions.id = orgs.region_id
        " ) );

        total = ArrayCount(arr);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        report_string.AppendStr( '<html><table>' );

        report_string.AppendStr( '<tr>' );

        report_string.AppendStr( '<td>ID</td><td>ИНН/код</td><td>Официальное название</td><td>Код региона</td><td>Регион по справочнику</td><td>Фактический регион</td><td>Учитывать в отчетности региона</td><td>В программе?</td><td>Тип поддержки</td><td>РЦК?</td><td>РОИВ?</td><td>Партнер?</td><td>Коммерция?</td><td>Расширенная поддрежка?</td><td>Коммерческий клиент</td><td>Проект завершен</td><td>Вид деятельности по ОКВЭД</td><td>Адрес организации</td><td>guid</td><td>Дата создания</td><td>Дата модификации</td><td>Кол-во ФЛ</td><td>Кол-во пользователей</td><td>Кол-во вн. тренеров</td>' );
        report_string.AppendStr( '</tr>' );

        for ( elem in arr ) {
            report_string.AppendStr( '<tr>' );
            for ( el in elem ) {
                report_string.AppendStr( '<td>' );
                report_string.AppendStr( el.Value );
                report_string.AppendStr( '</td>' );
            }
            report_string.AppendStr( '</tr>' );

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.skipped = skipped;
                agent.saved = saved;
                agent.notFound = notFound;
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

        report_string.AppendStr( '</table></html>' );

        oExcelDoc.LoadHtmlString( report_string.GetStr(), "" );

        agent.processed = processed;
        agent.saved = saved;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        oExcelDoc.SaveAs( f_url );

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
            saved + " saved, ",
            skipped + " skipped"
        );

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );
    } catch( e ) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
}
