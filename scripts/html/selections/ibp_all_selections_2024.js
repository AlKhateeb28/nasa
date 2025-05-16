// 7156594026239955098
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function get_cert_number( _cert_id ){
    if (_cert_id == '') { 
        return '' 
    }
    
    te_cert = tools.open_doc( _cert_id ).TopElem;
    return te_cert.serial + "-" + te_cert.number + "/" + Year(te_cert.delivery_date);
}

try {
    var agentId = 7156594026239955098;
    var loggerName = "agent_7156594026239955098";

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    courses_ids_arr = "6644416288763437283,6671106418291659865,6838854269792109574,6727253502766890095,6852554380951299709,6836087635825603553,6743177975518886480,6743176161780188235"
    videocourses_ids_arr = ArrayMerge(XQuery("for $elem in courses where MatchSome($elem/role_id,(7033858916945914689,7033858854651232288)) return $elem"), "id", ",")

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') AS id " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        " WHERE cs.id = " + curUserID));



    if(ArrayCount(dataList) == 0) {
        throw new Error("Сотрудник с ID " + curUserID + " не найден");
    }
    
    arr = ArraySelectAll(XQuery("sql: " +
        " SET DATEFORMAT dmy; " +
        "SELECT cs.id, " +
        "       cs.fullname AS col_fio, " +
        "       cs.email AS col_email, " +
        "       os.name AS col_org_name, " +
        "       os.code AS col_org_inn, " +
        "       rs.name AS col_region, " +
        "       tren_cs.fullname AS tren_fio, " +
        "       tren_cs.email AS tren_email, " +
        "       tren_rs.name AS tren_region, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_1'']/value)[1]', 'varchar(max)') AS task_1, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_comm_1'']/value)[1]', 'varchar(max)') AS task_com_1, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_2'']/value)[1]', 'varchar(max)') AS task_2, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_comm_2'']/value)[1]', 'varchar(max)') AS task_com_2, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_3'']/value)[1]', 'varchar(max)') AS task_3, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''task_comm_3'']/value)[1]', 'varchar(max)') AS task_com_3, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''flag'']/value)[1]', 'bit') AS cert_flag, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_access'']/value)[1]', 'varchar(max)') AS date_access, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_1'']/value)[1]', 'varchar(max)') AS result_1, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_1'']/value)[1]', 'varchar(max)') AS date_1, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_2'']/value)[1]', 'varchar(max)') AS result_2, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_2'']/value)[1]', 'varchar(max)') AS date_2, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_3'']/value)[1]', 'varchar(max)') AS result_3, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_3'']/value)[1]', 'varchar(max)') AS date_3, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_4'']/value)[1]', 'varchar(max)') AS result_4, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_4'']/value)[1]', 'varchar(max)') AS date_4, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_5'']/value)[1]', 'varchar(max)') AS result_5, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_5'']/value)[1]', 'varchar(max)') AS date_5, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''result_6'']/value)[1]', 'varchar(max)') AS result_6, " +
        "       od.data.value('(//custom_elems/custom_elem[name=''date_6'']/value)[1]', 'varchar(max)') AS date_6, " +
        "       rep_rs.name AS col_report_region_name, " +
        "       o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') AS fact_region_id " +
        " FROM [WTDB].[dbo].object_datas ods " +
        "         INNER JOIN [WTDB].[dbo].object_data od ON ods.id = od.id " +
        "    AND od.data.value('(//custom_elems/custom_elem[name=''date_access'']/value)[1]', 'varchar(max)') != '' " +
        "         INNER JOIN [WTDB].[dbo].collaborators cs ON ods.object_id = cs.id " +
        "         INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "         INNER JOIN [WTDB].[dbo].org o ON os.id = o.id AND o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = " + dataList[0].id +
        "         INNER JOIN [WTDB].[dbo].regions rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        "         LEFT JOIN [WTDB].[dbo].regions AS rep_rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rep_rs.id " +
        "         INNER JOIN [WTDB].[dbo].collaborators tren_cs ON ods.sec_object_id = tren_cs.id " +
        "         INNER JOIN [WTDB].[dbo].orgs tren_os ON tren_cs.org_id = tren_os.id " +
        "         INNER JOIN [WTDB].[dbo].org tren_o ON tren_os.id = tren_o.id " +
        "         INNER JOIN [WTDB].[dbo].regions tren_rs ON tren_o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = tren_rs.id " +
        " WHERE ods.object_data_type_id = 6966499755925068211 " +
        "       AND ods.object_type = 'collaborator' " +
        "       AND YEAR(CAST(od.data.value('(//custom_elems/custom_elem[name=''date_access'']/value)[1]', 'varchar(max)') AS DATE)) <= 2024 " +
        " ORDER BY ods.create_date DESC "));

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Main selection finished");

    final_arr = [];

    for (elem in arr) {
        obj = {};

        for (fldElem in elem) {
            obj.SetProperty(fldElem.Name, String(fldElem));
        }

        // Пройдено ЭК из 8
        courses_arr = ArraySelectAll(XQuery("sql: " +
            " WITH Table_1 AS ( " +
            "    SELECT id, " +
            "           course_id, " +
            "           course_name, " +
            "           start_usage_date, " +
            "           last_usage_date, " +
            "           start_learning_date, " +
            "           score, " +
            "           state_id " +
            "    FROM [WTDB].[dbo].active_learnings " +
            "    WHERE active_learnings.person_id = " + elem.id +
            "      AND active_learnings.course_id IN (" + courses_ids_arr + ") " +
            "    UNION " +
            "    SELECT " +
            "        id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id " +
            "    FROM [WTDB].[dbo].learnings " +
            "    WHERE " +
            "        learnings.person_id = " + elem.id +
            "      AND learnings.course_id IN (" + courses_ids_arr + ") " +
            " ) " +
            " SELECT Table_1.id AS id, " +
            "       Table_1.course_id AS course_id, " +
            "       Table_1.course_name AS course_name, Table_1.score AS score, " +
            "       Table_1.start_usage_date AS start_usage_date, " +
            "       Table_1.last_usage_date AS last_usage_date, " +
            "       Table_1.start_learning_date AS start_learning_date, " +
            "       [common.learning_states].name AS state_name " +
            " FROM Table_1 " +
            "         LEFT JOIN [WTDB].[dbo].[common.learning_states] ON [common.learning_states].id = Table_1.state_id " +
            " ORDER BY Table_1.course_name DESC, " +
            "         Table_1.score DESC, " +
            "         Table_1.start_usage_date DESC  "));

        final_courses_arr = ArraySelectDistinct(courses_arr, "This.course_id");

        courses_num = 0;

        for (element in final_courses_arr) {
            if (element.state_name == "Пройден") {
                courses_num++;
            }
        }

        obj.SetProperty("courses_num", String(courses_num))

        // Изучено видеозаписей семинаров из 5
        videocourses_arr = ArraySelectAll(XQuery("sql: " +
            " WITH Table_1 AS ( " +
            "    SELECT id, " +
            "           course_id, " +
            "           course_name, " +
            "           start_usage_date, " +
            "           last_usage_date, " +
            "           start_learning_date, " +
            "           score, " +
            "           state_id " +
            "    FROM [WTDB].[dbo].active_learnings " +
            "    WHERE active_learnings.person_id = " + elem.id +
            "      AND active_learnings.course_id IN (" + courses_ids_arr + ") " +
            "    UNION " +
            "    SELECT " +
            "        id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id " +
            "    FROM [WTDB].[dbo].learnings " +
            "    WHERE " +
            "        learnings.person_id = " + elem.id +
            "      AND learnings.course_id IN (" + courses_ids_arr + ") " +
            " ) " +
            " SELECT Table_1.id AS id, " +
            "       Table_1.course_id AS course_id, " +
            "       Table_1.course_name AS course_name, Table_1.score AS score, " +
            "       Table_1.start_usage_date AS start_usage_date, " +
            "       Table_1.last_usage_date AS last_usage_date, " +
            "       Table_1.start_learning_date AS start_learning_date, " +
            "       [common.learning_states].name AS state_name " +
            " FROM Table_1 " +
            "         LEFT JOIN [WTDB].[dbo].[common.learning_states] ON [common.learning_states].id = Table_1.state_id " +
            " ORDER BY Table_1.course_name DESC, " +
            "         Table_1.score DESC, " +
            "         Table_1.start_usage_date DESC  "));

        final_videocourses_arr = ArraySelectDistinct(videocourses_arr, "This.course_id");
        videocourses_num = 0;
        for (element in final_videocourses_arr) {
            if (element.state_name == "Пройден") {
                videocourses_num++;
            }
        }

        obj.SetProperty("videocourses_num", (ArrayCount(videocourses_arr)));

        final_arr.push(obj);
    }

    addLogMessage(loggerName, "[agent.id: " + agentId + "] All finished");

    SORT.FIELD;
    PAGING.MANUAL = false;
    PAGING.SIZE = 10;
    PAGING.TOTAL = ArrayCount(final_arr);
    RESULT = ArraySort(final_arr, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));

    COLUMNS = ([
        {"data": "col_fio", "hidden": false, "sortable": true, "title": "ФИО ИБП"},
        {"data": "col_email", "hidden": false, "sortable": true, "title": "email ИБП"},
        {"data": "col_org_name", "hidden": false, "sortable": true, "title": "Орг. ИБП"},
        {"data": "col_org_inn", "hidden": false, "sortable": true, "title": "Орг. ИНН ИБП"},
        {"data": "col_region", "hidden": false, "sortable": true, "title": "Регион ИБП"},
        {"data": "tren_fio", "hidden": false, "sortable": true, "title": "ФИО тренера РЦК"},
        {"data": "tren_email", "hidden": false, "sortable": true, "title": "email тренера РЦК"},
        {"data": "tren_region", "hidden": false, "sortable": true, "title": "Регион тренера РЦК"},
        {"data": "task_1", "hidden": false, "sortable": true, "title": "Задание 1 Выполнение"},
        {"data": "task_comm_1", "hidden": false, "sortable": true, "title": "Задание 1 Комментарий"},
        {"data": "task_2", "hidden": false, "sortable": true, "title": "Задание 2 Выполнение"},
        {"data": "task_comm_2", "hidden": false, "sortable": true, "title": "Задание 2 Комментарий"},
        {"data": "task_3", "hidden": false, "sortable": true, "title": "Задание 3 Выполнение"},
        {"data": "task_comm_3", "hidden": false, "sortable": true, "title": "Задание 3 Комментарий"},
        {"data": "courses_num", "hidden": false, "sortable": true, "title": "Пройдено ЭК из 8"},
        {"data": "videocourses_num", "hidden": false, "sortable": true, "title": "Изучено видеозаписей семинаров из 5"},
        {"data": "cert_flag", "hidden": false, "sortable": true, "title": "Пройдена подготовка/Допущен к сертификации"},
        {"data": "date_access", "hidden": false, "sortable": true, "title": "Дата допуска к сертификации"},
        {"data": "result_1", "hidden": false, "sortable": true, "title": "Программа «7 видов потерь» Результат"},
        {"data": "date_1", "hidden": false, "sortable": true, "title": "Программа «7 видов потерь» Дата сертификации"},
        {"data": "cert_1", "hidden": false, "sortable": true, "title": "Программа «7 видов потерь» Номер сертификата"},
        {"data": "comment_1", "hidden": false, "sortable": true, "title": "Программа «7 видов потерь» Комментарий"},
        {"data": "result_2", "hidden": false, "sortable": true, "title": "Программа «5С на производстве» Результат"},
        {
            "data": "date_2",
            "hidden": false,
            "sortable": true,
            "title": "Программа «5С на производстве» Дата сертификации"
        },
        {
            "data": "cert_2",
            "hidden": false,
            "sortable": true,
            "title": "Программа «5С на производстве» Номер сертификата"
        },
        {"data": "comment_2", "hidden": false, "sortable": true, "title": "Программа «5С на производстве» Комментарий"},
        {
            "data": "result_3",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Реализация проекта по улучшению» Результат"
        },
        {
            "data": "date_3",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Реализация проекта по улучшению» Дата сертификации"
        },
        {
            "data": "cert_3",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Реализация проекта по улучшению» Номер сертификата"
        },
        {
            "data": "comment_3",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Реализация проекта по улучшению» Комментарий"
        },
        {"data": "result_4", "hidden": false, "sortable": true, "title": "Программа «Картирование» Результат"},
        {"data": "date_4", "hidden": false, "sortable": true, "title": "Программа «Картирование» Дата сертификации"},
        {"data": "cert_4", "hidden": false, "sortable": true, "title": "Программа «Картирование» Номер сертификата"},
        {"data": "comment_4", "hidden": false, "sortable": true, "title": "Программа «Картирование» Комментарий"},
        {
            "data": "result_5",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Методика решения проблем» Результат"
        },
        {
            "data": "date_5",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Методика решения проблем» Дата сертификации"
        },
        {
            "data": "cert_5",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Методика решения проблем» Номер сертификата"
        },
        {
            "data": "comment_5",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Методика решения проблем» Комментарий"
        },
        {
            "data": "result_6",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Производственный анализ» Результат"
        },
        {
            "data": "date_6",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Производственный анализ» Дата сертификации"
        },
        {
            "data": "cert_6",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Производственный анализ» Номер сертификата"
        },
        {
            "data": "comment_6",
            "hidden": false,
            "sortable": true,
            "title": "Программа «Производственный анализ» Комментарий"
        },
        {"data": "col_report_region_name", "hidden": false, "sortable": true, "title": "Учитывать в отчетности региона"},
        {"data": "id", "hidden": false, "sortable": true, "title": "PRIMARY KEY"}
    ])
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}