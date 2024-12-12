// 6901298909405270647
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function include(ts,p) {var mc;try {mc=TopElem.script;}catch(e){try{te=tools.open_doc(p.id).TopElem;if (p.to=='server_agent')mc=te.run_code;else throw 'unknown object in params: '+p.to;}catch(e){throw "TopElem or self_id not found!";}}mc+='';if(!IsArray(ts))ts=[ts];var c="";for(t in ts)c+='\n'+ld(t);c+='\n'+cmc(mc);try{tools.safe_execution(c);}catch(e){eval(c);}return false;}function ld(tc){curActiveWebTemplate=null;var es=tools_web.insert_custom_code(tc,null,false,true);es=StrRightRangePos(es,es.indexOf( '\<\%' )+2);es=StrLeftRange(es,es.indexOf('\%\>'));return es;}function cmc(c){var x='if (inc'+'luded)';var i=c.indexOf(x);if(i<0)throw '"'+x+'" not found in the main code!';var cc=StrRightRangePos(c,i);cc=StrReplaceOne(cc,x,'if (true)');return cc;}
included = include('server_functions', {to: 'server_agent', id: 6901298909405270647});
if (included) {
    var agentId = 6901298909405270647;
    var userId = 7351734047845980789;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_6901298909405270647";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    if ( LdsIsServer ) {
        sLogMethod = "report"
        curObjectID = 6901298909405270647
        teCurObject = tools.open_doc( curObjectID ).TopElem
        try {
            open_log()
            var bDebugMode = false
            if ( !bDebugMode ) {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

                agent.message = "Получение данных ...";
                if(ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }

                write_log_text( "bDebugMode = " + bDebugMode )

                group_id = Param.group_id
                group_doc = tools.open_doc( group_id )

                arr = ArraySelectAll( XQuery( "sql: DECLARE @curdate datetime; SET @curdate = GETDATE(); " +
                    " SELECT" +
                    " collaborators.id, collaborator.created" +
                    " FROM [WTDB].[dbo].collaborators" +
                    " LEFT JOIN [WTDB].[dbo].orgs" +
                    " ON collaborators.org_id = orgs.id" +
                    " LEFT JOIN [WTDB].[dbo].org" +
                    " ON collaborators.org_id = org.id" +
                    " LEFT JOIN [WTDB].[dbo].collaborator" +
                    " ON collaborators.id = collaborator.id" +
                    " WHERE" +
                    " (" +
                    " org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true'" +
                    " OR org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true'" +
                    " OR org.data.value('(org/custom_elems/custom_elem[name=''is_partner''])[1]/value[1]', 'varchar(max)') = 'true'" +
                    " OR org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') != ''" +
                    " OR orgs.code = '7724426759'" +
                    " OR org.data.value('(org/custom_elems/custom_elem[name=''is_project_ended''])[1]/value[1]', 'varchar(max)') != 'true'" +
                    " )" +
                    " AND collaborators.code NOT LIKE('%_muc_%')" +
                    " AND collaborators.is_dismiss = 0" +
                    " AND collaborators.org_id != 6652254925512774352" +
                    " AND collaborators.org_id != 6699322438141639615" +
                    " AND collaborator.created > DATEADD(day,-2, @curdate)" +
                    " ORDER BY collaborator.created DESC"
                ));

                processed = 0;
                saved = 0;
                total = ArrayCount(arr);

                addLogMessage(loggerName, "[agent.id: " + agentId + "] Processed: " + total);

                agent.total = total;
                agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.refreshChart = 1;
                agent.message = "Обработка данных...";
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
                prevDate = new Date();

                // group_doc.TopElem.collaborators.Clear()
                i = 0
                for ( elem in arr ) {
                    if ( group_doc.TopElem.collaborators.GetOptChildByKey( elem.id ) == undefined ) {
                        group_doc.TopElem.collaborators.ObtainChildByKey( elem.id )
                        i++
                    }

                    processed++;
                    saved++;

                    if (processed % 100 == 0) {
                        agent.processed = processed;
                        agent.saved = saved;
                        if (ws != null) {
                            ws = sendMessageToWebsocket(ws, agent);
                        }
                    }
                    if (processed % 1000 == 0) {
                        addLogMessage(
                            loggerName,
                            "[agent.id: " + agentId + "] " + processed + " processed, " + saved + "saved, remaining time: " + getDurationMessage((total - processed) * msPerRecord)
                        );
                    }
                }

                group_doc.Save()
                write_log_text( "Группа - " + group_doc.TopElem.name )
                write_log_text( "Добавлено - " + i + " сотрудников" )
                newarr = XQuery( "for $elem in group_collaborators where group_id=" + group_id + " return $elem" )
                write_log_text( "Общее количество - " + ArrayCount( newarr ) + " сотрудников" )

                addLogMessage(loggerName, "[agent.id: " + agentId + "] " + processed + " processed, " + saved + "saved");
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");

                agent.state = 1;
                agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
                agent.processed = processed;
                agent.saved = saved;
                refreshMsPerRow(agent, startDate, total);
                duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
                agent.message = "Закончено. Продолжительность " + duration;
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            } else {
                write_log_text( "bDebugMode = " + bDebugMode )
            }
            close_log()
        } catch( e ) {
            agent.state = 2;
            agent.errorMessage = e;
            sendMessageToWebsocket(ws, agent);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

            write_log_text( "error = " + e )
            close_log()
        }

        saveMonitorAgents(agent, startDate);

        try {
            ws.Send("close");
        } catch (e) {}
    } else {
        Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
    }
}