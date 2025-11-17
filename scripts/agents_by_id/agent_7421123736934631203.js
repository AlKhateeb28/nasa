// 7421123736934631203
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function getCertificateNumber(certificateId) {
    if(certificateId == "") {
        return "";
    }

    certificateDoc = tools.open_doc(certificateId);

    if(certificateDoc != undefined) {
        certificateDocTE = certificateDoc.TopElem;

        return certificateDocTE.serial + "-" + certificateDocTE.number + "/" + Year(certificateDocTE.delivery_date);
    } else {
        return "Не найден";
    }

}

function getFinishedCoursesCount(collaboratorId, spitedCoursesIds) {
    courcesCount = ArrayDirect(XQuery("sql: " +
        " WITH tmp_View AS " +
        "   (SELECT DISTINCT course_id " +
        "   FROM [WTDB].[dbo].active_learnings " +
        "   WHERE state_id = 4 " +
        "       AND person_id = " + collaboratorId +
        "       AND course_id IN (" + spitedCoursesIds + ") " +
        "                 UNION " +
        "   SELECT DISTINCT course_id " +
        "   FROM [WTDB].[dbo].learnings " +
        "   WHERE state_id = 4 " +
        "       AND learnings.person_id = " + collaboratorId +
        "       AND learnings.course_id IN (" + spitedCoursesIds + ") " +
        "                 ) " +
        "SELECT COUNT(*) AS cnt " +
        "FROM tmp_View "));

    if(ArrayCount(courcesCount) > 0) {
        return courcesCount[0].cnt;
    } else {
        return 0;
    }
}

if (LdsIsServer) {
    var coursesIds = "6644416288763437283,6671106418291659865,6838854269792109574,6727253502766890095,6852554380951299709,6836087635825603553,6743177975518886480,6743176161780188235"
    var videoCoursesIds = "6965774666385153326,6966161248012621159,6966165131940952893,6966162084849146109,6966211279387184178"
    var ibpCoursesIds = "7119812308457777642,7119812071712565068,7119812165002090859,7119812388344499932,7119811761202858978"

    var resultList = [];

    var agentId = 7421123736934631203;
    var userId = curUserID; // 7389518304440750773; // Websoft inner user || FOR SCHEDULED AGENTS
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7421123736934631203";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var excel = new ActiveXObject("Websoft.Office.Excel.Document");
    var reportString = new Binary();

    var total = 0;
    var processed = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        objectList = ArrayDirect(XQuery("sql: " +
            " SELECT DISTINCT ods.id AS PK, " +
            "    ods.object_id AS colls_id, " +
            "    cs.fullname AS colls_fio, " +
            "    cs.email AS colls_email, " +
            "    cs.org_id AS colls_org_id, " +
            "    ods.sec_object_id AS tren_id, " +
            "    trcs.fullname AS tren_fio, " +
            "    trcs.email AS tren_email, " +
            "    trcs.org_id AS tren_org_id, " +
            "    IIF(od.data.value('(object_data/custom_elems/custom_elem[name=''flag''])[1]/value[1]', 'bit') = 'true', '1', '0') AS cert_flag, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_access''])[1]/value[1]', 'varchar(max)') AS date_access, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_1''])[1]/value[1]', 'varchar(max)') AS result_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_2''])[1]/value[1]', 'varchar(max)') AS result_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_3''])[1]/value[1]', 'varchar(max)') AS result_3, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_4''])[1]/value[1]', 'varchar(max)') AS result_4, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_5''])[1]/value[1]', 'varchar(max)') AS result_5, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''result_6''])[1]/value[1]', 'varchar(max)') AS result_6, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_1''])[1]/value[1]', 'varchar(max)') AS date_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_2''])[1]/value[1]', 'varchar(max)') AS date_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_3''])[1]/value[1]', 'varchar(max)') AS date_3, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_4''])[1]/value[1]', 'varchar(max)') AS date_4, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_5''])[1]/value[1]', 'varchar(max)') AS date_5, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''date_6''])[1]/value[1]', 'varchar(max)') AS date_6, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_1''])[1]/value[1]', 'varchar(max)') AS comment_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_2''])[1]/value[1]', 'varchar(max)') AS comment_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_3''])[1]/value[1]', 'varchar(max)') AS comment_3, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_4''])[1]/value[1]', 'varchar(max)') AS comment_4, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_5''])[1]/value[1]', 'varchar(max)') AS comment_5, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''comment_6''])[1]/value[1]', 'varchar(max)') AS comment_6, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_1''])[1]/value[1]', 'varchar(max)') AS certificate_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_2''])[1]/value[1]', 'varchar(max)') AS certificate_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_3''])[1]/value[1]', 'varchar(max)') AS certificate_3, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_4''])[1]/value[1]', 'varchar(max)') AS certificate_4, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_5''])[1]/value[1]', 'varchar(max)') AS certificate_5, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''certificate_6''])[1]/value[1]', 'varchar(max)') AS certificate_6, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_1''])[1]/value[1]', 'varchar(max)') AS task_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_2''])[1]/value[1]', 'varchar(max)') AS task_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_3''])[1]/value[1]', 'varchar(max)') AS task_3, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_1''])[1]/value[1]', 'varchar(max)') AS task_comm_1, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_2''])[1]/value[1]', 'varchar(max)') AS task_comm_2, " +
            "    od.data.value('(object_data/custom_elems/custom_elem[name=''task_comm_3''])[1]/value[1]', 'varchar(max)') AS task_comm_3, " +
            "    od.data.value('(//doc_info/modification)[1]/date[1]', 'datetime') AS modification_date" +
            " FROM [WTDB].[dbo].object_datas ods " +
            "    INNER JOIN [WTDB].[dbo].object_data od ON ods.id = od.id " +
            "    INNER JOIN [WTDB].[dbo].collaborators cs ON ods.object_id = cs.id " +
            "    INNER JOIN [WTDB].[dbo].collaborators trcs ON ods.sec_object_id = trcs.id " +
            "    INNER JOIN [WTDB].[dbo].group_collaborators gcs ON ods.object_id = gcs.collaborator_id " +
            " WHERE " +
            "    ods.object_data_type_id = 6966499755925068211 " +
            "    AND  gcs.code LIKE  '%ModProg_FCK_%' "));

        total = ArrayCount(objectList);

        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        reportString.AppendStr("<html>");
        reportString.AppendStr("<style>");
        reportString.AppendStr(".header {background-color: rgba(255, 227, 147, 0.81); width: 300px;}");
        reportString.AppendStr(".row_height {height: 2px;}");
        reportString.AppendStr("</style>");
        reportString.AppendStr("<table border='1'>");
        reportString.AppendStr("<tr>");
        reportString.AppendStr("<td class='header'>ФИО ИБП</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>email ИБП</td>");
        reportString.AppendStr("<td class='header' style='width: 600px;'>Орг. ИБП</td>");
        reportString.AppendStr("<td class='header' style='width: 150px;'>Орг. ИНН ИБП</td>");
        reportString.AppendStr("<td class='header'>Регион ИБП</td>");
        reportString.AppendStr("<td class='header'>Регион в отчетности</td>");
        reportString.AppendStr("<td class='header'>ФИО тренера РЦК</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>email тренера РЦК</td>");
        reportString.AppendStr("<td class='header'>Регион тренера РЦК</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 1 Выполнение</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 1 Комментарий</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 2 Выполнение</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 2 Комментарий</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 3 Выполнение</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Задание 3 Комментарий</td>");
        reportString.AppendStr("<td class='header' style='width: 150px;'>Пройдено ЭК из 8</td>");
        reportString.AppendStr("<td class='header'>Изучено видеозаписей семинаров из 5</td>");
        reportString.AppendStr("<td class='header'>Изучено методразборов программ из 5</td>");
        reportString.AppendStr("<td class='header'>Изучен онлайн-тренинг Принципы и технологии обучения взрослых</td>");
        reportString.AppendStr("<td class='header'>Пройдена подготовка/Допущен к сертификации</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Дата допуска к сертификации</td>");
        reportString.AppendStr("<td class='header' style='width: 200px;'>Последнее изменение</td>");
        reportString.AppendStr("<td class='header'>Программа «7 видов потерь» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «7 видов потерь» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «7 видов потерь» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «7 видов потерь» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Программа «5С на производстве» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «5С на производстве» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «5С на производстве» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «5С на производстве» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Программа «Реализация проекта по улучшению» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «Реализация проекта по улучшению» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «Реализация проекта по улучшению» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «Реализация проекта по улучшению» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Программа «Картирование» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «Картирование» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «Картирование» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «Картирование» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Программа «Методика решения проблем» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «Методика решения проблем» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «Методика решения проблем» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «Методика решения проблем» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Программа «Производственный анализ» Результат</td>");
        reportString.AppendStr("<td class='header'>Программа «Производственный анализ» Дата сертификации</td>");
        reportString.AppendStr("<td class='header'>Программа «Производственный анализ» Номер сертификата</td>");
        reportString.AppendStr("<td class='header'>Программа «Производственный анализ» Комментарий</td>");
        reportString.AppendStr("<td class='header'>Группы</td>");
        reportString.AppendStr("<td class='header' style='width: 160px;'>ID Результ.</td>");
        reportString.AppendStr("</tr>");


        for (result in objectList) {
            element = {};

            for(resultElement in result) {
                element.SetProperty(resultElement.Name, resultElement);
            }

            //Collaborator
            orgDoc = tools.open_doc(result.colls_org_id);

            if(orgDoc != undefined) {
                orgDocTE = orgDoc.TopElem;

                element.colls_org_name = orgDocTE.name;
                element.colls_org_inn = orgDocTE.code;

                if(orgDocTE.custom_elems.ObtainChildByKey("fact_region_id").value == "") {
                    element.colls_region = orgDocTE.region_id.ForeignElem.name
                } else {
                    regionDoc = tools.open_doc(orgDocTE.custom_elems.ObtainChildByKey("fact_region_id").value);

                    if(regionDoc != undefined) {
                        element.colls_region = regionDoc.TopElem.name;
                    } else {
                        element.colls_region = "Не найден";
                    }
                }

                if(orgDocTE.custom_elems.ObtainChildByKey("report_region_id").value == "") {
                    element.colls_org_report_region_name = orgDocTE.region_id.ForeignElem.name;
                } else {
                    regionDoc = tools.open_doc(orgDocTE.custom_elems.ObtainChildByKey("report_region_id").value);

                    if(regionDoc != undefined) {
                        element.colls_org_report_region_name = regionDoc.TopElem.name;
                    } else {
                        element.colls_org_report_region_name = "Не найден";
                    }
                }

            } else {
                element.colls_org_name = "Не найдена";
                element.colls_org_inn = "";
                element.colls_region = "";
                element.colls_org_report_region_name = "";
            }

            // Trainer
            orgDoc = tools.open_doc(result.tren_org_id);

            if(orgDoc != undefined) {
                orgDocTE = orgDoc.TopElem;

                element.tren_region = orgDocTE.region_id.ForeignElem.name;
            } else {
                element.tren_region = "Не найден";
            }

            element.cert_1 = getCertificateNumber(element.certificate_1);
            element.cert_2 = getCertificateNumber(element.certificate_2);
            element.cert_3 = getCertificateNumber(element.certificate_3);
            element.cert_4 = getCertificateNumber(element.certificate_4);
            element.cert_5 = getCertificateNumber(element.certificate_5);
            element.cert_6 = getCertificateNumber(element.certificate_6);

            groupsList = ArraySelectAll(XQuery("for $elem in group_collaborators where $elem/collaborator_id = " + element.colls_id + " and contains($elem/code, 'ModProg_FCK_') return $elem"));
            element.groups = ArrayMerge(groupsList,"name",'; ');

            element.courses_num = getFinishedCoursesCount(element.colls_id, coursesIds);
            element.videocourses_num = getFinishedCoursesCount(element.colls_id, videoCoursesIds);
            element.ibp_courses_num = getFinishedCoursesCount(element.colls_id, ibpCoursesIds);

            completedValue =  ArrayDirect(XQuery("sql: " +
                "   SELECT id " +
                "   FROM [WTDB].[dbo].active_learnings " +
                "   WHERE course_id = 7119812540134335010 " +
                "       AND person_id = " + element.colls_id + " AND state_id = 2 " +
                " UNION " +
                "   SELECT id " +
                "   FROM [WTDB].[dbo].learnings " +
                "   WHERE course_id = 7119812540134335010 " +
                "       AND person_id = " + element.colls_id + " AND state_id = 4"
            ));

            element.ibp = ArrayCount(completedValue) > 0 ? 1 : 0;

            resultList.push(element);

            processed++;

            if (processed % 50 == 0) {
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

        for(item in resultList) {
            reportString.AppendStr(
                "<tr>" +
                "<td>" + item.colls_fio + "</td>" +
                "<td>" + item.colls_email + "</td>" +
                "<td>" + item.colls_org_name + "</td>" +
                "<td>" + item.colls_org_inn + "</td>" +
                "<td>" + item.colls_region + "</td>" +
                "<td>" + item.colls_org_report_region_name + "</td>" +
                "<td>" + item.tren_fio + "</td>" +
                "<td>" + item.tren_email + "</td>" +
                "<td>" + item.tren_region + "</td>" +
                "<td>" + item.task_1 + "</td>" +
                "<td>" + item.task_comm_1 + "</td>" +
                "<td>" + item.task_2 + "</td>" +
                "<td>" + item.task_comm_2 + "</td>" +
                "<td>" + item.task_3 + "</td>" +
                "<td>" + item.task_comm_3 + "</td>" +
                "<td>" + item.courses_num + "</td>" +
                "<td>" + item.videocourses_num + "</td>" +
                "<td>" + item.ibp_courses_num + "</td>" +
                "<td>" + item.ibp + "</td>" +
                "<td>" + item.cert_flag + "</td>" +
                "<td>" + (item.date_access == "" ? "" : StrDate(Date(item.date_access), false)) + "</td>" +
                "<td>" + (item.modification_date == "" ? "" : StrDate(Date(item.modification_date), true, true)) + "</td>" +
                "<td>" + item.result_1 + "</td>" +
                "<td>" + item.date_1 + "</td>" +
                "<td>" + item.cert_1 + "</td>" +
                "<td>" + item.comment_1 + "</td>" +
                "<td>" + item.result_2 + "</td>" +
                "<td>" + item.date_2 + "</td>" +
                "<td>" + item.cert_2 + "</td>" +
                "<td>" + item.comment_2 + "</td>" +
                "<td>" + item.result_3 + "</td>" +
                "<td>" + item.date_3 + "</td>" +
                "<td>" + item.cert_3 + "</td>" +
                "<td>" + item.comment_3 + "</td>" +
                "<td>" + item.result_4 + "</td>" +
                "<td>" + item.date_4 + "</td>" +
                "<td>" + item.cert_4 + "</td>" +
                "<td>" + item.comment_4 + "</td>" +
                "<td>" + item.result_5 + "</td>" +
                "<td>" + item.date_5 + "</td>" +
                "<td>" + item.cert_5 + "</td>" +
                "<td>" + item.comment_5 + "</td>" +
                "<td>" + item.result_6 + "</td>" +
                "<td>" + item.date_6 + "</td>" +
                "<td>" + item.cert_6 + "</td>" +
                "<td>" + item.comment_6 + "</td>" +
                "<td>" + item.groups + "</td>" +
                "<td>'" + item.PK + "</td>" +
                "</tr>");
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
        excel.SaveAs("E:/Websoft/Reports/ibp_result_certification/report_" + ParseDate(Date()) + ".xlsx");

        agent.state = 1;
        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
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
} else {
    Screen.MsgBox("Запустите агент на стороне сервера!", ms_tools.get_const('c_info'), 'info', 'ok');
}