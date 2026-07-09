// 7304832408683997607
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

try {
    var agentId = 7304832408683997607;
    var userId = 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "agent_7304832408683997607";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var processed = 0;
    var skipped = 0;
    var saved = 0;

    excelDocI = tools.get_object_assembly("Excel");
    excelDocI.Open("E:/Websoft/Reports/trash/ended_inn.xlsx");
    cells = excelDocI.GetWorksheet(0).Cells;

    excelDocO = tools.get_object_assembly("Excel");
    reportString = new Binary();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    reportString.AppendStr("<style>");
    reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 200px;}");
    reportString.AppendStr(".row_height {height: 2px;}");
    reportString.AppendStr("</style>");
    reportString.AppendStr("<table border='1'>");
    reportString.AppendStr("<tr>"); contact_
    reportString.AppendStr("<td class='header'>ИНН</td>");
    reportString.AppendStr("<td class='header' style='width: 300px;'>Организация</td>");
    reportString.AppendStr("<td class='header' style='width: 300px;'>ФИО</td>");
    reportString.AppendStr("<td class='header' style='width: 200px;'>Email</td>");
    reportString.AppendStr("</tr>");

    for (i = 2; i <= 10000; i++) {
        if (cells.GetCell("A" + i).Value == undefined) {
            break;
        } else {
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT os.id " +
                " FROM [WTDB].[dbo].orgs os " +
                "   INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND AND o.data.exist('//custom_elems/custom_elem[name=''format_part'']/value[. != '''']') = 1 " +
                " WHERE os.code = '" + cells.GetCell("B" + i).Value + "' " +
                "   AND os.isprojectended = 0"));

            agent.optionalData = {};
            agent.optionalData.name1 = "Фанк-менеджеров";
            agent.optionalData.value1 = "0 / 0";
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }

            if (ArrayCount(dataList) > 0) {
                orgDoc = tools.open_doc(dataList[0].id);

                if (orgDoc != undefined) {
                    orgDocTE = orgDoc.TopElem;

                    agent.optionalData = {};
                    agent.optionalData.name1 = "Найдено фанк-менеджеров";
                    agent.optionalData.value1 = "0 / " + ArrayCount(orgDocTE.func_managers);
                    if (ws != null) {
                        ws = sendMessageToWebsocket(ws, agent);
                    }

                    funcManagersCount = 0;

                    for (manager in orgDocTE.func_managers) {
                        if (OptInt(manager.boss_type_id) == 2691248884100914019) { // Тип "Менеджер по персоналу"
                            collaboratorsList = ArrayDirect(XQuery("sql: " +
                                " SELECT cs.id AS cs_id, " +
                                "   os.id AS os_id, " +
                                "   os.name, " +
                                "   os.code, " +
                                "   cs.fullname, " +
                                "   cs.email " +
                                " FROM [WTDB].[dbo].collaborators cs " +
                                "     INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                                " WHERE cs.id = " + manager.person_id + 
                                "     AND cs.is_dismiss <> 1 "));

                            if (ArrayCount(collaboratorsList) > 0) {
                                funcManagersCount++;

                                agent.optionalData.value1 = funcManagersCount + " / " + ArrayCount(orgDocTE.func_managers);
                                if (ws != null) {
                                    ws = sendMessageToWebsocket(ws, agent);
                                }

                                // ADD TO OUTPUT EXCEL
                                reportString.AppendStr(
                                    "<tr>" +
                                    "<td>'" + collaboratorsList[0].code + "</td>" +
                                    "<td>" + collaboratorsList[0].name + "</td>" +
                                    "<td>" + collaboratorsList[0].fullname + "</td>" +
                                    "<td>" + collaboratorsList[0].email + "</td>" +
                                    "</tr>"
                                );
                                
                                saved++;
                            }
                        }
                    }
                } else {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        processed++;

        agent.processed = processed;
        agent.skipped = skipped;
        agent.saved = saved;
        refreshMsPerRow(agent, startDate, processed);
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
    }

    // SAVE EXCEL FILE
    agent.processed = processed;
    agent.saved = saved;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Сохраняем Excel файлы...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    reportString.AppendStr("</table></html>");
    excelDocO.LoadHtmlString(reportString.GetStr(), "");
    excelDocO.SaveAs("E:/Websoft/Reports/trash/ended_noti_func.xlsx");

    agent.state = 1;
    agent.processed = processed;
    agent.saved = saved;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    refreshMsPerRow(agent, startDate, processed);
    agent.message = "Закончено";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed, ",
        saved + " saved, ",
        skipped + " skiped"
    );

    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
    );

    //excelDocI.Application.Quit();
} catch (e) {
    //excelDocI.Application.Quit();

    agent.state = 2;
    agent.errorMessage = e;
    sendMessageToWebsocket(ws, agent);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {
    ws.Send("close");
} catch (e) { }
