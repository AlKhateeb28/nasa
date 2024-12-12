// 6898265584977189358
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

function isContainUmlauts(fullname) {
    return StrContains(fullname, "ё", true);
}

function normalizeName(name) {
    name = StrReplace(name, "Ё", "Е");
    name = StrReplace(name, "ё", "е");

    return Trim(name);
}

function checkCorrectFullname(sFullname) {
    if(sFullname != "undefined") {
        if(StrCharCount(sFullname) < 2) {
            return false;
        }

        var sTempStr = StrLowerCase(sFullname);
        for(sChar in aRusAlf) {
            sTempStr = StrReplace(sTempStr, sChar, '');
        }

        if(StrCharCount(sTempStr) > 0) {
            return false;
        }

        var tempArr = sFullname.split(" ");

        if (ArrayCount(tempArr) == 3) {
            var collSurname = Trim(tempArr[0]);
            var collName = Trim(tempArr[1]);
            var collFathersname = Trim(tempArr[2]);

            if(StrCharCount(collSurname) < 2 || StrCharCount(collName) < 2 || StrCharCount(collFathersname) < 2) {
                return false;
            }
        } else if (ArrayCount(tempArr) == 2) {
            var collSurname = Trim(tempArr[0]);
            var collName = Trim(tempArr[1]);

            if(StrCharCount(collSurname) < 2 || StrCharCount(collName) < 2) {
                return false;
            }
        } else {not
            return false;
        }
    }

    return true;
}

function log(text, arFlag, alFlag) {
    EnableLog('agentImportColls', true);

    if (arFlag == undefined || arFlag == false) {
        LogEvent('agentImportColls', text);
        if (alFlag != undefined || alFlag == true) alert(text);
    } else {
        LogEvent('agentImportColls', tools.object_to_text(text, 'json'));
        if (alFlag != undefined || alFlag == true) alert(tools.object_to_text(text, 'json'));
    }
}

var startDate = Date();
var prevDate = new Date();
var loggerName = "agent_6898265584977189358";
var agentId = 6898265584977189358;
var userId = 7389518304440750773; // Websoft inner user
var msPerRecord = 0.001;
var processed = 0;
var skipped = 0;

var eventId = Int(Param.event_id);
var eventDoc = OpenDoc(UrlFromDocID(eventId));
var currentUserId = tools.cur_user_id;
var excelFile = null;
var excelFileUrl = "";
var aRusAlf = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я', ' '];
var sPath = UrlToFilePath("x-local://trash/temp/" + eventId + "ExcelImport.txt");

var iNumberUploadedColls = 0;
var aNotUploadedColls = [];

var sResultText = "Количество импортированных в систему обученных: {number_uploaded_colls}.<br/>Количество не импортированных в систему: {number_not_uploaded_colls}.";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");
addLogMessage(loggerName, "[agent.id: " + agentId + "] User.ID: " + userId);

var ws = getWebsocketClient();
var agent = getAgentInstance(agentId, userId, loggerName);

try {
    agent.message = "Получение данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    if (LdsIsClient == true) {
        excelFileUrl = Screen.AskFileOpen('', 'Выбери файл&#09;*.xls*');

        var excelWorkSheet = null;

        try {
            excelFile = OpenDoc(excelFileUrl);
            docResourseTE = excelFile.TopElem;

            sTempFileUrl = ObtainSessionTempFile( UrlPathSuffix( docResourseTE.file_url ) );
            try {
                docResourseTE.get_data( sTempFileUrl );
            }
            catch ( err ){
                alert(err)
            }

            oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document");
            oExcelDoc.Open(UrlToFilePath(sTempFileUrl));

            excelWorkSheet = oExcelDoc.GetWorksheet(0);
        } catch (err) {
            alert("Ошибка при открытии файла " + excelFileUrl);
        }
    } else {
        var excelWorkSheet = null;
        try {
            oReq = tools.read_object(OBJECTS_ID_STR);
            excelFile = tools.open_doc(oReq.sFileUrl);
            docResourseTE = excelFile.TopElem;

            sTempFileUrl = ObtainSessionTempFile( UrlPathSuffix( docResourseTE.file_url ) );
            try {
                docResourseTE.get_data( sTempFileUrl );
            }
            catch ( err ) {
                alert(err)
            }

            oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document");
            oExcelDoc.Open(UrlToFilePath(sTempFileUrl));

            excelWorkSheet = oExcelDoc.GetWorksheet(0);
            DeleteFile(sTempFileUrl);
        } catch (err) {
            alert("Ошибка при открытии файла " + excelFileUrl);
        }
    }

    var collSurname = "";
    var collName = "";
    var collFathersname = "";

    var lastExcelString = 0;

    agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.message = "Обработка данных...";
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }
    prevDate = new Date();

    for (i = 2; i < 5000; i++) {
        sTempFullname = Trim(excelWorkSheet.Cells.GetCell('B'+i).Value);

        if(!checkCorrectFullname(sTempFullname)) {
            aNotUploadedColls.push({
                fullname: sTempFullname,
                inn: Trim(excelWorkSheet.Cells.GetCell('A'+(i)).Value)
            });
        }

        if (excelWorkSheet.Cells.GetCell('B'+i).Value != undefined) {
            lastExcelString++;
        }
    }

    for (i = 1; i <= lastExcelString; i++) {
        sOrgINN = Trim(excelWorkSheet.Cells.GetCell('A'+(i+1)).Value);
        collFullname = Trim(excelWorkSheet.Cells.GetCell('B'+(i+1)).Value);
        collPosition = Trim(excelWorkSheet.Cells.GetCell('C'+(i+1)).Value);

        if(isContainUmlauts(collFullname)) {
            addLogMessage(loggerName,  "[agent.id: " + agentId + "] Collaborator " + collFullname + " (Org.INN: )" + sOrgINN + " contains wrong umlaut 'Ё' or 'ё'");

            skipped++;

            continue;
        }

        if(ArrayOptFind(aNotUploadedColls, "This.fullname == " + CodeLiteral(collFullname)) != undefined) {
            continue;
        }

        sQuery = "sql: \
		SELECT\
			fm.object_id id\
		FROM\
			func_managers fm\
		WHERE\
			fm.person_id = "+oReq.curUserID+"\
			AND fm.catalog = 'org'\
			AND fm.boss_type_id = 6878899960667451125";

        aCurrOrgs = tools.xquery(sQuery);

        oOrg = ArrayOptFirstElem(tools.xquery("for $elem in orgs where $elem/code = " + sOrgINN + " and MatchSome($elem/id, ("+ArrayMerge(aCurrOrgs, "This.id", ", ")+")) return $elem"));
        if(oOrg != undefined){
            iOrgId = oOrg.id;
        } else {
            aNotUploadedColls.push({
                fullname: collFullname,
                inn: sOrgINN
            });

            continue;
        }

        tempArr = collFullname.split(" ");
        if (ArrayCount(tempArr) == 3) {
            collSurname = Trim(tempArr[0]);
            collName = Trim(tempArr[1]);
            collFathersname = Trim(tempArr[2]);
        } else if (ArrayCount(tempArr) == 2) {
            collSurname = Trim(tempArr[0]);
            collName = Trim(tempArr[1]);
            collFathersname = "";
        } else if (ArrayCount(tempArr) > 3) {
            collSurname = Trim(tempArr[0]);
            collName = Trim(tempArr[1]);
            collFathersname = Trim(tempArr[2]) + " " + Trim(tempArr[3]);
        }

        collArr = XQuery("sql: " +
            " SELECT cs.id, cs.code, cs.fullname, cs.email, c.created " +
            " FROM collaborators cs " +
            "   INNER JOIN collaborator c ON cs.id = c.id " +
            "   INNER JOIN orgs os ON cs.org_id = os.id " +
            "   INNER JOIN org o ON os.id = o.id " +
            " WHERE UPPER(cs.fullname) = UPPER('" + collFullname + "') " +
            "   AND cs.code like '%rck_muc_%' " +
            "   AND cs.org_id = " + OptInt(iOrgId));

        if (ArrayOptFirstElem(collArr) == undefined) {
            collDoc = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            a1 = StrDate(Date()).split(" ");
            a2 = a1[0].split(".");
            a3 = a1[1].split(":");
            collCode = "rck_muc_" + a2[2] + a2[1] + a2[0] + "_" + a3[0] + a3[1] + a3[2] + "_" + tools.random_string(5);

            if (ArrayCount(XQuery("for $elem in collaborators where $elem/code = '" + collCode + "' return $elem")) == 0) {
                collDoc.TopElem.code = collCode;
                collDoc.TopElem.login = collCode;
            } else {
                collCode += "@2" + tools.random_string(3);
                collDoc.TopElem.code = collCode;
                collDoc.TopElem.login = collCode;
            }

            collDoc.TopElem.firstname = normalizeName(collName);
            collDoc.TopElem.middlename = normalizeName(collFathersname);
            collDoc.TopElem.lastname = normalizeName(collSurname);
            collDoc.TopElem.password = tools.random_string(20);
            collDoc.TopElem.custom_elems.ObtainChildByKey("date_register").value = Date();
            collDoc.TopElem.access.web_banned = true;
            collDoc.TopElem.last_import_date = Date();
            collDoc.TopElem.birth_date.Clear();
            collDoc.TopElem.org_id = OptInt(iOrgId);
            collDoc.BindToDb(DefaultDb);


            collPositionDoc = OpenNewDoc('x-local://wtv/wtv_position.xmd');
            collPositionDoc.TopElem.name = collPosition;
            collPositionDoc.TopElem.basic_collaborator_id = collDoc.DocID;
            collPositionDoc.TopElem.org_id = OptInt(iOrgId);
            collPositionDoc.BindToDb(DefaultDb);

            collDoc.TopElem.position_id = collPositionDoc.DocID;
            collDoc.TopElem.position_name = collPosition;

            collPositionDoc.Save();
            collDoc.Save();

            collId = collDoc.DocID;

            tools.add_person_to_event(collDoc.DocID, eventId, null, null, null, currentUserId, null);
        } else {
            collId = ArrayOptFirstElem(collArr).id;
            tools.add_person_to_event(ArrayOptFirstElem(collArr).id, eventId, null, null, null, currentUserId, null);
        }

        iNumberUploadedColls++;

        processed++;

        if (processed % 10 == 0) {
            agent.processed = processed;
            agent.skipped = skipped;
            if (ws != null) {
                ws = sendMessageToWebsocket(ws, agent);
            }
            prevDate = new Date();
        }
        if (processed % 100 == 0) {
            addLogMessage(
                loggerName,
                "[agent.id: " + agentId + "] " + processed + " processed..."
            );
        }
    }

    var iNumberNotUploadedColls = ArrayCount(aNotUploadedColls);
    var sNotUploadedCollsInn = ArrayMerge( ArraySelectDistinct( ArrayExtract(aNotUploadedColls, "This.inn"), "This" ), "This", ", " );

    sResultText = StrReplace(sResultText, "{number_uploaded_colls}", iNumberUploadedColls);
    sResultText = StrReplace(sResultText, "{number_not_uploaded_colls}", iNumberNotUploadedColls);

    if(iNumberNotUploadedColls > 0)
    {

        sResultText += "<br/>ИНН предприятий: " + sNotUploadedCollsInn + ".";
    }

    PutFileData(sPath, sResultText);

    agent.state = 1;
    agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
    agent.processed = processed;
    agent.skipped = skipped;
    refreshMsPerRow(agent, startDate, processed);
    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    agent.message = "Закончено. Продолжительность " + duration;
    if (ws != null) {
        ws = sendMessageToWebsocket(ws, agent);
    }

    addLogResultMessage(
        loggerName,
        "[agent.id: " + agentId + "]",
        null,
        processed + " processed, ",
        null,
        null
    );

    duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
    addLogMessage(
        loggerName,
        "[agent.id: " + agentId + "] Duration: " + duration
    );
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}

saveMonitorAgents(agent, startDate);

try {ws.Send("close");} catch (e) {}

addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished.");