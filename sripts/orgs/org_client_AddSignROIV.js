// AGENT 6938293073941629853
DropFormsCache("*AgentUtils*");
AgentUtils = OpenCodeLib("x-local://wtv/custom_libraries/AgentUtils.1.0.0.7.js");

if(!LdsIsServer) {


    var agentId = agentData.id;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate = new Date();
    var loggerName = "aa_agent_client.add.sign.roiv";
    var ws = AgentUtils.getWebsocketClient();
    var agent = AgentUtils.getAgentInstance(agentData, loggerName);

    try {
        var processed = 0;
        var saved = 0;

        AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

        var is_roiv = (Param.is_roiv == "1") ? "true" : "false";
        var skip_first_row = Param.skip_first_row;
        var column_inn = OptInt(Param.column_inn);
        var protocol_column = OptInt(Param.protocol_column);
        var send_message_to = Param.send_message_to;
        var alert_message = "";

        excel_url = Screen.AskFileOpen('', "Выбери файл *.xls*");
        excel = new ActiveXObject("Excel.Application");
        excelFile = excel.Workbooks.Open(excel_url);
        excel_sheet = excelFile.Worksheets(1);

        cur_row = skip_first_row == "1" ? 2 : 1;

        agent.message = "Обработка данных...";
        ws = AgentUtils.sendMessageToWebsocket(ws, agent);

        while (true) {
            if (excel_sheet.Cells(cur_row, column_inn).Value == undefined) {
                break;
            }

            org_inn_str = String(excel_sheet.Cells(cur_row, column_inn).Value);
            org_inn = Trim(UnifySpaces(org_inn_str));

            found_org = ArrayOptFirstElem(tools.xquery("for $elem in orgs where $elem/code='" + org_inn + "' return $elem"));
            if (found_org == undefined) {
                alert_message += "Не найдена организация с ИНН " + org_inn + "; ";
                if (send_message_to == "excel") {
                    excel_sheet.Cells(cur_row, protocol_column).Value = "Не найдена организация с ИНН " + org_inn;
                    AgentUtils.addLogMessage(
                        loggerName,
                        "[agent.id: " + agentId + "] Не найдена организация с ИНН: " + org_inn
                    );
                }
            } else {
                excel_sheet.Cells(cur_row, protocol_column).Value = "'" + found_org.id;
                org_doc = tools.open_doc(found_org.id);
                org_doc_te = org_doc.TopElem;
                org_doc_te.custom_elems.ObtainChildByKey("is_roiv").value = is_roiv;
                org_doc.Save();

                saved++;
            }
            cur_row++;

            processed++;

            if (processed % 100 == 0) {
                agent.processed = processed;
                agent.saved = saved;
                ws = AgentUtils.sendMessageToWebsocket(ws, agent);
            }
            if (processed % 1000 == 0) {
                AgentUtils.addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] " + processed + " processed, " + saved + " saved ..."
                );
            }
        }

        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Сохраняем Excel файл...";
        agent.refreshChart = 1;
        ws = AgentUtils.sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        excelFile.Save();

        if (alert_message != "") {
            if (send_message_to == "notification") {
                tools.create_notification("agent_alert_message", tools.cur_user_id, alert_message);
            }
        }

        agent.state = 1;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.processed = processed;
        agent.saved = saved;
        AgentUtils.refreshMsPerRow(agent, startDate, processed);
        duration = AgentUtils.getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Закончено. Продолжительность " + duration;
        ws = AgentUtils.sendMessageToWebsocket(ws, agent);

        AgentUtils.addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            null,
            processed + " processed, ",
            saved + " saved",
            null
        );
        AgentUtils.addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + AgentUtils.getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );
    } catch (e) {
        excelFile.Close(true);
        excel.Application.Quit();

        agent.state = 2;
        agent.errorMessage = e;
        AgentUtils.sendMessageToWebsocket(ws, agent);

        AgentUtils.addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
        alert("ERROR: " + e);
    } finally {
        excelFile.Close(true);
        excel.Application.Quit();
    }
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}