// 7283623346795409887
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function addLogResultMessage(loggerName, message, total, processed, saved, skipped) { EnableLog(loggerName, true); try { result = ""; if (message != null) { result = message + " "; } if (total != null) { result = result + total + " "; } if (processed != null) { result = result + processed + " "; } if (saved != null) { result = result + saved; } if (skipped != null) { result = result + skipped; } LogEvent(loggerName, result); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } } function getDurationMessage(duration) { try { var durationMessage = " sec"; if (duration >= 60 && duration < 3600) { duration = duration / 60; durationMessage = " min"; } if (duration >= 3600) { duration = duration / 3600; durationMessage = " hour"; } return StrReal(duration, 1) + durationMessage; } catch (e) { throw new Error(e); } } function getWebsocketClient() { try { return new WebSocketClient("ws://192.168.0.96:3000/"); } catch (e) { } } function getAgentInstance(agentId, userId, loggerName) { agentDoc = tools.open_doc(agentId); userDoc = tools.open_doc(userId); userDocTE = userDoc.TopElem; agent = {}; agent.type = "AGENT"; agent.loggerName = loggerName; agent.id = agentId; agent.name = agentDoc.TopElem.name; agent.userId = userId; agent.userName = userDocTE.lastname + " " + userDocTE.firstname + " " + userDocTE.middlename; agent.state = 0; agent.total = "--"; agent.processed = "--"; agent.skipped = "--"; agent.saved = "--"; agent.notFound = "--"; agent.message = ""; agent.errorMessage = ""; agent.fetchTime = 0; agent.handlingTime = 0; agent.savingTime = 0; agent.refreshChart = 0; agent.msPerRow = 0; agent.minMsPerRow = 999999; agent.maxMsPerRow = 0; return agent; } function sendMessageToWebsocket(ws, agent) { try { try { ws.Send("#" + EncodeJson(agent)); agent.refreshChart = 0; } catch (e) { addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket"); ws = getWebsocketClient(); } return ws; } catch (e) { return null; } } function refreshMsPerRow(agent, startDate, total) { try { if (total > 0) { agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total); } else { agent.msPerRow = 0; } } catch (e) { } } function saveMonitorAgents(agent, startDate) { try { monitorAgent = tools.new_doc_by_name("cc_agent_monitor_event", false); monitorAgent.BindToDb(DefaultDb); monitorAgentTE = monitorAgent.TopElem; monitorAgentTE.type = agent.type; monitorAgentTE.agent_id = agent.id; monitorAgentTE.user_id = agent.userId; monitorAgentTE.state = agent.state; monitorAgentTE.total = agent.total; monitorAgentTE.processed = agent.processed; monitorAgentTE.skipped = agent.skipped; monitorAgentTE.saved = agent.saved; monitorAgentTE.not_found = agent.notFound; monitorAgentTE.logger_name = agent.loggerName; monitorAgentTE.error_message = agent.errorMessage; monitorAgentTE.start_date = startDate; monitorAgentTE.finish_date = Date(); monitorAgent.Save(); } catch (e) { } }

function isCollaboratorExistsInDossier(collsCode) {
    dossierList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        "    FROM [WTDB].[dbo].cc_dossier_subsidized_traineds " +
        "    WHERE student_code = '" + collsCode + "'"));

    return ArrayCount(dossierList) > 0;
}

function addYearCondition() {
    if (yearParam != "") {
        return " AND YEAR(es.finish_date) >= " + OptInt(yearParam) + " ";
    }

    return "";
}

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

if (LdsIsServer) {
    var yearParam = Param.from_year;

    var agentId = 7283623346795409887;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7283623346795409887";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;

    excelDoc = tools.get_object_assembly('Excel');
    excelDoc.CreateWorkBook();
    excelWorksheet = excelDoc.GetWorksheet(0);

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        dataList = ArrayDirect(XQuery("sql: " +
            " WITH _lectors AS ( " +
            "    SELECT events.id, lectors.lector_fullname AS lector_fio " +
            "    FROM [WTDB].[dbo].events " +
            "        INNER JOIN [WTDB].[dbo].event e ON events.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/lectors/lector') T(c) " +
            "        INNER JOIN [WTDB].[dbo].lectors ON T.c.value('lector_id[1]','varchar(max)') = lectors.id " +
            " ), " +
            " _temp_lectors AS ( " +
            "    SELECT id, " +
            "    lector_fio = STUFF( " +
            "    ( " +
            "        SELECT '|' + lector_fio " +
            "        FROM _lectors tmp " +
            "        WHERE tmp.id = ls.id " +
            "            FOR XML PATH ('')), 1, 1, '') " +
            "    FROM _lectors ls " +
            "    GROUP BY ls.id), " +
            " _preparations AS ( " +
            "    SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio " +
            "    FROM [WTDB].[dbo].events es " +
            "        LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id " +
            "        CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c) " +
            " ), " +
            " _temp_preparations AS ( " +
            "    SELECT id, " +
            "        preparation_fio = STUFF( " +
            "        ( " +
            "            SELECT '|' + pre_fio " +
            "            FROM _preparations tmp " +
            "            WHERE tmp.id = ps.id " +
            "                FOR XML PATH ('')), 1, 1, '') " +
            "    FROM _preparations ps " +
            "    GROUP BY id " +
            " ) " +
            " SELECT rs.name AS region_name, " +
            "       f_rs.name AS fact_region_name, " +
            "       os.code AS inn, " +
            "       os.name AS org_name, " +
            "       cs.code AS person_code, " +
            "       cs.fullname AS fullname, " +
            "       ps.name AS position_name, " +
            "       IIF(ers.is_assist = 1, 'Истина', 'Ложь') AS is_assist, " +
            "       es.education_org_name, " +
            "       ems.id AS education_method_id, " +
            "       em.data.value('(//custom_elems/custom_elem[name=''subcode'']/value)[1]', 'varchar(max)') AS subcode, " +
            "       ems.name AS education_method_name, " +
            "       es.id AS event_id, " +
            "       es.code AS event_code, " +
            "       es.name AS event_name, " +
            "       es.start_date, " +
            "       es.finish_date, " +
            "       e.data.value('(event/place)[1]', 'varchar(max)') AS place, " +
            "       CASE " +
            "           WHEN es.event_form = 'conference' THEN 'конференция' " +
            "           WHEN es.event_form = 'examination' THEN 'сертификация' " +
            "           WHEN es.event_form = 'game' THEN 'деловая игра' " +
            "           WHEN es.event_form = 'meeting' THEN 'стартовое совещание' " +
            "           WHEN es.event_form = 'meth_day' THEN 'методический день' " +
            "           WHEN es.event_form = 'pered_prog' THEN 'передача программ' " +
            "           WHEN es.event_form = 'praktikum' THEN 'тренинг-площадка' " +
            "           WHEN es.event_form = 'scan' THEN 'сканирование' " +
            "           WHEN es.event_form = 'seminar' THEN 'семинар' " +
            "           WHEN es.event_form = 'stagirovka' THEN 'стажировка' " +
            "           WHEN es.event_form = 'supervis_tren' THEN 'супервизия тренеров' " +
            "           WHEN es.event_form = 'training' THEN 'тренинг' " +
            "           WHEN es.event_form = 'webinar' THEN 'вебинар' " +
            "           ELSE '' " +
            "           END AS event_form, " +
            "       tls.lector_fio, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps, " +
            "       cests.name AS status_name, " +
            "       tps.preparation_fio, " +
            "       CASE " +
            "           WHEN ers.is_assist = 'false' THEN 0 " +
            "           ELSE row_number() over(partition BY cs.code, '_', cs.fullname ORDER BY cs.fullname, os.name, ers.not_participate, es.finish_date) " +
            "           END AS num, " +
            "       DAY(es.finish_date) AS day, " +
            "       MONTH(es.finish_date) AS month, " +
            "       YEAR(es.finish_date) AS year, " +
            "       ers.id AS event_result_id, " +
            "       erts.name AS result_type_name, " +
            "       IIF(c.data.value('(collaborator/custom_elems/custom_elem[name=''is_dossier_exist''])[1]/value[1]', 'bit') = 1, 'Истина', 'Ложь') AS is_doss_exist, " +
            "       e.data.value('(//custom_elems/custom_elem[name=''month_otch'']/value)[1]', 'varchar(max)') AS report_month, " +
            "       ers.event_start_date, " +
            "       o.data.value('(//custom_elems/custom_elem[name=''wave'']/value)[1]', 'varchar(max)') AS wave, " +
            "       pcs.name AS typical_position_name " +
            " FROM [WTDB].[dbo].event_results AS ers " +
            "         INNER JOIN [WTDB].[dbo].events AS es ON ers.event_id = es.id " + addYearCondition() +
            "               AND es.education_org_id IN (7100351150313827874, 7410749948253583035, 7100351480975785298, 6148914691236517202, 6148914691236517203, 6802513472431981115, 6938000483356197646, 6938001238782589341, 7034790057599700358, 6856726259800948992, 7086784658178339954, 7410046389105987361, 7410749948253583035, 6856735269184478330, 6856735325928247512, 6856735493587543129, 6869760264243199229, 6870054939308859763) " +
            "         INNER JOIN [WTDB].[dbo].event AS e ON es.id = e.id " +
            "         INNER JOIN [WTDB].[dbo].event_result_types AS erts ON ers.event_result_type_id = erts.id " +
            "         LEFT JOIN [WTDB].[dbo].education_methods AS ems ON es.education_method_id = ems.id " +
            "         INNER JOIN [WTDB].[dbo].education_method AS em ON ems.id = em.id " +
            "         INNER JOIN [WTDB].[dbo].collaborators AS cs ON ers.person_id = cs.id " +
            "         INNER JOIN [WTDB].[dbo].collaborator AS c ON cs.id = c.id " +
            "         LEFT JOIN [WTDB].[dbo].positions AS ps ON cs.position_id = ps.id " +
            "         LEFT JOIN [WTDB].[dbo].position_commons AS pcs ON ps.position_common_id = pcs.id " +
            "         INNER JOIN [WTDB].[dbo].orgs AS os ON cs.org_id = os.id " +
            "         INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS rs ON os.region_id = rs.id " +
            "         INNER JOIN [WTDB].[dbo].regions AS f_rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = f_rs.id " +
            "         LEFT JOIN _temp_lectors AS tls ON e.id = tls.id " +
            "         LEFT JOIN _temp_preparations AS tps ON e.id = tps.id " +
            "         INNER JOIN [WTDB].[dbo].[common.event_status_types] AS cests ON es.status_id = cests.id " +
            " ORDER BY cs.fullname, os.name, es.finish_date  "));

        total = ArrayCount(dataList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        setCellCss(excelWorksheet, "A1", "Регион", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(0, Real(50));
        setCellCss(excelWorksheet, "B1", "Фактический регион", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(1, Real(50));
        setCellCss(excelWorksheet, "C1", "ИНН", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(2, Real(20));
        setCellCss(excelWorksheet, "D1", "Организация", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(3, Real(50));
        setCellCss(excelWorksheet, "E1", "Код участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(4, Real(20));
        setCellCss(excelWorksheet, "F1", "ФИО участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(5, Real(50));
        setCellCss(excelWorksheet, "G1", "Должность участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(6, Real(50));
        setCellCss(excelWorksheet, "H1", "Присутствие", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(7, Real(20));
        setCellCss(excelWorksheet, "I1", "Обучающая организация", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(8, Real(50));
        setCellCss(excelWorksheet, "J1", "ID учебной программы", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(9, Real(20));
        setCellCss(excelWorksheet, "K1", "Код учебной программы", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(10, Real(20));
        setCellCss(excelWorksheet, "L1", "Учебная программа", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(11, Real(50));        
        setCellCss(excelWorksheet, "M1", "ID мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(12, Real(50));
        setCellCss(excelWorksheet, "N1", "Код мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(13, Real(20));
        setCellCss(excelWorksheet, "O1", "Мероприятие", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(14, Real(50));
        setCellCss(excelWorksheet, "P1", "Дата начала мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(15, Real(20));
        setCellCss(excelWorksheet, "Q1", "Дата завершения мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(16, Real(20));
        setCellCss(excelWorksheet, "R1", "Место проведения", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(17, Real(50));        
        setCellCss(excelWorksheet, "S1", "Форма проведения мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(18, Real(20));
        setCellCss(excelWorksheet, "T1", "Тренер", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(19, Real(50));
        setCellCss(excelWorksheet, "U1", "NPS", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(22, Real(50));
        setCellCss(excelWorksheet, "V1", "Статус", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(21, Real(20));
        setCellCss(excelWorksheet, "W1", "Ответственный", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(22, Real(50));
        setCellCss(excelWorksheet, "X1", "num", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(23, Real(20));
        setCellCss(excelWorksheet, "Y1", "Дата завершения мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(24, Real(20));
        setCellCss(excelWorksheet, "Z1", "Месяц завершения мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(25, Real(20));
        setCellCss(excelWorksheet, "AA1", "Год завершения мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(26, Real(20));
        setCellCss(excelWorksheet, "AB1", "ID результата мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(27, Real(50));
        setCellCss(excelWorksheet, "AC1", "Тип результата мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(28, Real(50));
        setCellCss(excelWorksheet, "AD1", "Есть в досье", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(29, Real(20));
        setCellCss(excelWorksheet, "AE1", "Месяц отчета", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(30, Real(20));
        setCellCss(excelWorksheet, "AF1", "Дата создания результата мероприятия", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(31, Real(20));
        setCellCss(excelWorksheet, "AG1", "Фамилия участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(32, Real(20));
        setCellCss(excelWorksheet, "AH1", "Имя участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(33, Real(20));
        setCellCss(excelWorksheet, "AI1", "Отчество участника", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(34, Real(20));
        setCellCss(excelWorksheet, "AJ1", "Волна", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(35, Real(20));
        setCellCss(excelWorksheet, "AK1", "Есть в досье", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(36, Real(20));
        setCellCss(excelWorksheet, "AL1", "Типовая должность", "lime", "Center");
        excelWorksheet.Cells.SetColumnWidth(37, Real(20));

        currentPage = 2;

        for (data in dataList) {
            fullFIO = data.fullname + " #empty #empty";

            fioList = fullFIO.split(" ");

            setCellCss(excelWorksheet, "A" + currentPage, data.region_name.Value, null, null);
            setCellCss(excelWorksheet, "B" + currentPage, data.fact_region_name.Value, null, null);
            setCellCss(excelWorksheet, "C" + currentPage, data.inn.Value, null, "Right");
            setCellCss(excelWorksheet, "D" + currentPage, data.org_name.Value, null, null);
            setCellCss(excelWorksheet, "E" + currentPage, data.person_code.Value, null, null);
            setCellCss(excelWorksheet, "F" + currentPage, data.fullname.Value, null, null);
            setCellCss(excelWorksheet, "G" + currentPage, data.position_name.Value, null, null);
            setCellCss(excelWorksheet, "H" + currentPage, data.is_assist.Value, null, null);
            setCellCss(excelWorksheet, "I" + currentPage, data.education_org_name.Value, null, null);
            setCellCss(excelWorksheet, "J" + currentPage, "'" + data.education_method_id, null, null);
            setCellCss(excelWorksheet, "K" + currentPage, data.subcode.Value, null, null);
            setCellCss(excelWorksheet, "L" + currentPage, data.education_method_name.Value, null, null);
            setCellCss(excelWorksheet, "M" + currentPage, "'" + data.event_id, null, null);
            setCellCss(excelWorksheet, "N" + currentPage, data.event_code.Value, null, null);
            setCellCss(excelWorksheet, "O" + currentPage, data.event_name.Value, null, null);
            setCellCss(excelWorksheet, "P" + currentPage, StrDate(data.start_date, true, false), null, null);
            setCellCss(excelWorksheet, "Q" + currentPage, StrDate(data.finish_date, true, false), null, null);
            setCellCss(excelWorksheet, "R" + currentPage, data.place.Value, null, null);
            setCellCss(excelWorksheet, "S" + currentPage, data.event_form.Value, null, null);
            setCellCss(excelWorksheet, "T" + currentPage, data.lector_fio.Value, null, null);
            setCellCss(excelWorksheet, "U" + currentPage, data.nps.Value, null, "Right");
            setCellCss(excelWorksheet, "V" + currentPage, data.status_name.Value, null, null);
            setCellCss(excelWorksheet, "W" + currentPage, data.preparation_fio.Value, null, null);
            setCellCss(excelWorksheet, "X" + currentPage, data.num, null, "Right");
            setCellCss(excelWorksheet, "Y" + currentPage, data.day, null, "Right");
            setCellCss(excelWorksheet, "Z" + currentPage, data.month, null, "Right");
            setCellCss(excelWorksheet, "AA" + currentPage, data.year, null, "Right");
            setCellCss(excelWorksheet, "AB" + currentPage, "'" + data.event_result_id, null, null);
            setCellCss(excelWorksheet, "AC" + currentPage, data.result_type_name.Value, null, null);
            setCellCss(excelWorksheet, "AD" + currentPage, data.is_doss_exist.Value, null, null);
            setCellCss(excelWorksheet, "AE" + currentPage, data.report_month.Value, null, null);
            setCellCss(excelWorksheet, "AF" + currentPage, StrDate(data.event_start_date, true, false), null, null);
            setCellCss(excelWorksheet, "AG" + currentPage, fioList[0], null, null);
            setCellCss(excelWorksheet, "AH" + currentPage, (fioList[1] == "#empty" ? "" : fioList[1]), null, null);
            setCellCss(excelWorksheet, "AI" + currentPage, (fioList[2] == "#empty" ? "" : fioList[2]), null, null);
            setCellCss(excelWorksheet, "AJ" + currentPage, data.wave.Value, null, null);
            setCellCss(excelWorksheet, "AK" + currentPage, (isCollaboratorExistsInDossier(data.person_code) ? "Да" : "Нет"), null, null);
            setCellCss(excelWorksheet, "AL" + currentPage, data.typical_position_name.Value, null, null);

            currentPage++;
            processed++;

            agent.processed = processed;
            refreshMsPerRow(agent, startDate, processed);
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
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
        try {
            excelDoc.SaveAs("E:/Websoft/Reports/report_fck_2025/report_fck_all_" + ParseDate(Date()) + ".xlsx");
        } catch (e) {
            throw new Error("Возможно файл открыт другим процессом!");
        }

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
    } catch (e) { }
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}