// 7283274236657878791
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function setCellCss(worksheet, name, value, foregroundColor, alignment) {    
    cell = worksheet.Cells.GetCell(name);

    cell.Value = value;
    cell.Style.Borders.SetColor("#000000");
    cell.Style.Borders.SetStyle("Thin");

    if (foregroundColor != null) {
        cell.Style.ForegroundColor = foregroundColor;
    }    
    if (alignment != null) {
        cell.Style.HorizontalAlignment = alignment;
    }
}

function addCells(worksheet, lectorDocTE, fieldSuffix) {
    setCellCss(worksheet, "A" + currentRow, lectorDocTE.person_fullname.Value, null, null);
    setCellCss(worksheet, "B" + currentRow, lectorDocTE.custom_elems.ObtainChildByKey("type_trener").value.Value, null, null);

    eduMethodName = "";
    eduMethodDoc = tools.open_doc(OptInt(lectorDocTE.custom_elems.ObtainChildByKey("education_method_" + fieldSuffix).value));
    if (eduMethodDoc != undefined) {
        eduMethodName = eduMethodDoc.TopElem.name.Value;
    }    
    setCellCss(worksheet, "C" + currentRow, eduMethodName, null, null);

    if (lectorDocTE.custom_elems.ObtainChildByKey("lector_status_exp_" + fieldSuffix).value == "true") {
        setCellCss(worksheet, "D" + currentRow, "Эксперт", null, null);
        setCellCss(worksheet, "E" + currentRow, "", null, null);
    } else {
        setCellCss(worksheet, "D" + currentRow, lectorDocTE.custom_elems.ObtainChildByKey("lector_status_" + fieldSuffix).value.Value, null, null);
        setCellCss(worksheet, "E" + currentRow, lectorDocTE.custom_elems.ObtainChildByKey("lector_status_code_" + fieldSuffix).value.Value, null, null);
    }

    setCellCss(worksheet, "F" + currentRow, lectorDocTE.custom_elems.ObtainChildByKey("event_count_" + fieldSuffix).value.Value, null, "Center");
    setCellCss(worksheet, "G" + currentRow, lectorDocTE.custom_elems.ObtainChildByKey("nps_" + fieldSuffix).value.Value, null, "Center");

    lectorDate = lectorDocTE.custom_elems.ObtainChildByKey("training_date_" + fieldSuffix).value;
    if (lectorDate == "") {
        setCellCss(worksheet, "H" + currentRow, "", null, null, null);
    } else {
        setCellCss(worksheet, "H" + currentRow, StrDate(Date(lectorDate), false, false), null, "Center");
    }

    lectorDate = lectorDocTE.custom_elems.ObtainChildByKey("expert_access_" + fieldSuffix).value;
    if (lectorDate == "") {
        setCellCss(worksheet, "I" + currentRow, "", null, null);
    } else {
        setCellCss(worksheet, "I" + currentRow, StrDate(Date(lectorDate), false, false), null, "Center");
    }

    expertId = lectorDocTE.custom_elems.ObtainChildByKey("expert_" + fieldSuffix).value;
    if (expertId == "") {
        setCellCss(worksheet, "J" + currentRow, "", null, null);
    } else {
        expertDoc = tools.open_doc(OptInt(expertId));

        if (expertDoc != undefined) {
            setCellCss(worksheet, "J" + currentRow, expertDoc.TopElem.person_fullname.Value, null, null);
        } else {
            setCellCss(worksheet, "J" + currentRow, "", null, null);
        }
    }

    lectorDate = lectorDocTE.custom_elems.ObtainChildByKey("methodologist_access_" + fieldSuffix).value;
    if (lectorDate == "") {
        setCellCss(worksheet, "K" + currentRow, "", null, null);
    } else {
        setCellCss(worksheet, "K" + currentRow, StrDate(Date(lectorDate), false, false), null, "Center");
    }

    metodologId = lectorDocTE.custom_elems.ObtainChildByKey("methodologist_" + fieldSuffix).value;
    if (metodologId == "") {
        setCellCss(worksheet, "L" + currentRow, "", null, null);
    } else {
        metodologDoc = tools.open_doc(OptInt(metodologId));

        if (metodologDoc != undefined) {
            setCellCss(worksheet, "L" + currentRow, metodologDoc.TopElem.person_fullname.Value, null, null);
        } else {
            setCellCss(worksheet, "L" + currentRow, "", null, null);
        }
    }

    lectorDate = lectorDocTE.custom_elems.ObtainChildByKey("education_method_cert_" + fieldSuffix).value;
    if (lectorDate == "") {
        setCellCss(worksheet, "M" + currentRow, "", null, null);
    } else {
        setCellCss(worksheet, "M" + currentRow, StrDate(Date(lectorDate), false, false), null, "Center");
    }

    certificateId = lectorDocTE.custom_elems.ObtainChildByKey("certificate_" + fieldSuffix).value;
    if (certificateId == "") {
        setCellCss(worksheet, "N" + currentRow, "", null, null);
    } else {
        certificateDoc = tools.open_doc(OptInt(certificateId));

        if (certificateDoc != undefined) {
            certificateDocTE = certificateDoc.TopElem;

            setCellCss(worksheet, "N" + currentRow, certificateDocTE.serial + "-" + certificateDocTE.number + "/" + Year(certificateDocTE.delivery_date), null, null);
        } else {
            setCellCss(worksheet, "N" + currentRow, "", null, null);
        }
    }

    currentRow++;
}

function addRowsByLector(worksheet, lectorDocTE) {
    addCells(worksheet, lectorDocTE, "base");
    addCells(worksheet, lectorDocTE, "ao");
    addCells(worksheet, lectorDocTE, "oee");
    addCells(worksheet, lectorDocTE, "smed");
    addCells(worksheet, lectorDocTE, "tpm");
    addCells(worksheet, lectorDocTE, "vk");
    addCells(worksheet, lectorDocTE, "vp");
    addCells(worksheet, lectorDocTE, "dc");
    addCells(worksheet, lectorDocTE, "twi");
    addCells(worksheet, lectorDocTE, "pp");
    addCells(worksheet, lectorDocTE, "ree");
    addCells(worksheet, lectorDocTE, "sl");
    addCells(worksheet, lectorDocTE, "sr");
    addCells(worksheet, lectorDocTE, "uz");
    addCells(worksheet, lectorDocTE, "ei");
    addCells(worksheet, lectorDocTE, "office");
    addCells(worksheet, lectorDocTE, "ssd");
    addCells(worksheet, lectorDocTE, "ppr");
    addCells(worksheet, lectorDocTE, "fp");
    addCells(worksheet, lectorDocTE, "fp_ppr");
    addCells(worksheet, lectorDocTE, "fop");
    addCells(worksheet, lectorDocTE, "fop_ppr");
    addCells(worksheet, lectorDocTE, "flp");
    addCells(worksheet, lectorDocTE, "flp_ppr");
}

if (LdsIsServer) {
    try {
        var agentId = 7283274236657878791;
        var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
        var msPerRecord = 0.001;

        var startDate = Date();
        var prevDate;
        var loggerName = "agent_7283274236657878791";
        var ws = getWebsocketClient();
        var agent = getAgentInstance(agentId, userId, loggerName);

        var total = 0;
        var processed = 0;
        var saved = 0;
        var skipped = 0;
        var notFound = 0;

        excelDoc = tools.get_object_assembly('Excel');
        excelDoc.CreateWorkBook();
        excelWorksheet = excelDoc.GetWorksheet(0);

        agent.message = "Получение данных...";
        ws = sendMessageToWebsocket(ws, agent);
        prevDate = new Date();

        addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ls.id " +
            " FROM[WTDB].[dbo].lectors ls " +
            "	    INNER JOIN[WTDB].[dbo].lector l ON ls.id = l.id " +
            " WHERE(l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Тренер ФЦК субсидия' " +
            "		OR l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Тренер ФЦК коммерция' " +
            "       OR l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') = 'Методолог ФЦК') "));

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        cells = excelWorksheet.Cells;
        rows = cells.Rows;

        setCellCss(excelWorksheet, "A1", "ФИО преподавателя", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(0, Real(50));
        setCellCss(excelWorksheet, "B1", "Тип тренера", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(1, Real(20));
        setCellCss(excelWorksheet, "C1", "Программа", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(2, Real(50));
        setCellCss(excelWorksheet, "D1", "Статус тренера", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(3, Real(20));
        setCellCss(excelWorksheet, "E1", "Цифровой статус", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(4, Real(20));
        setCellCss(excelWorksheet, "F1", "Кол - во мероприятий", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(5, Real(20));
        setCellCss(excelWorksheet, "G1", "NPS", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(6, Real(20));
        setCellCss(excelWorksheet, "H1", "Обучение пройдено", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(7, Real(20));
        setCellCss(excelWorksheet, "I1", "Допуск у эксперта", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(8, Real(20));
        setCellCss(excelWorksheet, "J1", "Эксперт по программе", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(9, Real(50));
        setCellCss(excelWorksheet, "K1", "Допуск у методолога", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(10, Real(20));
        setCellCss(excelWorksheet, "L1", "Методолог", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(11, Real(50));
        setCellCss(excelWorksheet, "M1", "Сертификация по программе", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(12, Real(20));
        setCellCss(excelWorksheet, "N1", "Сертификат", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(13, Real(20));

        currentRow = 2;

        for (data in dataList) {
            lectorDoc = tools.open_doc(OptInt(data.id));
            
            if (lectorDoc != undefined) {                
                addRowsByLector(excelWorksheet, lectorDoc.TopElem);
            } else {
                addLogMessage(loggerName, "[agent.id: " + agentId + "] Lector with ID " + data.id + " is not exist!");
            }
            
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

        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound; 3
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        agent.message = "Сохраняем Excel файл...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        // SAVE EXCEL FILE
        try {
            excelDoc.SaveAs("E:/Websoft/Reports/lectors/lector_access_statuses_" + ParseDate(Date()) + ".xlsx");
        } catch (e) {
            throw new Error("Возможно файл открыт другим процессом!");
        }

        agent.state = 1;
        agent.processed = processed;
        agent.saved = saved;
        agent.skipped = skipped;
        agent.notFound = notFound;
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
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) { }
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}