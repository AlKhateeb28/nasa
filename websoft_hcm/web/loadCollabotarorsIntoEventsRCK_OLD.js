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
        } else {
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

if (LdsIsClient == true) {
    excelFileUrl = Screen.AskFileOpen('', 'Выбери файл&#09;*.xls*');

    var excelWorkSheet = null;

    try {
        excelFile = OpenDoc(excelFileUrl);
        docResourseTE = excelFile.TopElem;

        sTempFileUrl = ObtainSessionTempFile( UrlPathSuffix( docResourseTE.file_url ) );
        try
        {
            docResourseTE.get_data( sTempFileUrl );
        }
        catch ( err )
        {
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
        try
        {
            docResourseTE.get_data( sTempFileUrl );
        }
        catch ( err )
        {
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

    if(ArrayOptFind(aNotUploadedColls, "This.fullname == " + CodeLiteral(collFullname)) != undefined)
    {
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

    collArr = XQuery("sql: select t1.id, t1.code, t1.fullname, t1.email, t2.created from collaborators as t1 left join collaborator as t2 on t1.id=t2.id left join orgs as t3 on t1.org_id=t3.id left join org as t4 on t3.id=t4.id where (t1.fullname = '" + ArrayMerge([Trim(collSurname), Trim(collName), Trim(collFathersname)], "This", " ") + "') and t1.code like '%rck_muc_%' and t1.org_id = "+OptInt(iOrgId)+" order by t2.created desc");

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

        collDoc.TopElem.firstname = Trim(collName);
        collDoc.TopElem.middlename = Trim(collFathersname);
        collDoc.TopElem.lastname = Trim(collSurname);
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