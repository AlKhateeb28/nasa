// 6093072174151072199
// Агент для удаления дублей из персонала
// Параметры
//  _delete_positions - delete/clear/keep - действие с должностью
//   delete - удалять карточку должности
//   clear - только разрывать связь с карточкой должности
//   keep - оставлять как неосновную
//
//   _select_xquery - условие отбора карточек сотрудников, для которых надо проверять наличие дублей
//
//  _delete_persons - true/false - удалять дубли из персонала или только переименовывать...
//  _copy_learning - true/flase - привязывать историю обучения к основному документу
//
//  _eq_fields - code, fullname, login, birth_date, email, position_name .....
//   список полей каталога , по которым происходит сравнение
//	 _eq_accountname - сравнивать имя аккаунта в домене АД или почтовом (AD/EMAIL/пустаястрока)
//  _eq_custom_fields - список дополнительных полей карточки сотрудника, по которым проводить сравнение
//  _eq_xquery - дополнительное условие отбора из каталога сотрудников, для поиска дублей
//
//  _main_flag - nullfield/solidfield/maxdate/mindate - признак, по которому определяется главный документ из нескольких дублей
//   nullfield - по наличию пустого поля
//   solidfield - по наличию непустого поля
//   maxdate - по максимуму значения даты
//   mindate - по минимуму значения даты
//
//
//
//  _main_field - code,login,email ....  -  поле, по которому определяется главный документ из нескольких дублей,
//  если признак _main_flag определяет макс/мин дату - то поле типа даты,
//  если признак _main_flag определяет пустое/непустое полк - то поле типа текст
//
//
//  _copy_fields - code, login, password, email ....
//  список полей, копирующихся в основной документ из дублей, если в основном они пустые
//
//
//  _replace_fields - ....
//  список полей, замещающихся в документах-дубликатах значениями из основного, используется, если _delete_persons=false
//
//
//  _clear_fields - ......
//  список полей, очищающихся в документах-дубликатах, используется, если _delete_persons=false
//
//
// _req_custom_fields  - список кодов доп. полей заявок, в которых может использоваться ID пользователя
// _req_workflow_fields - список кодов полей документооборота заявок, в которых может использоваться ID пользователя
//
//
//


bIsLog = true; // вести логирование выполнения агента
sLogMethod = "ext"; // метод вывода в лог - ext = вывод в отдельный текстовый журнал, system = вывод в основной журнал системы, report = вывод в события базы, excel = вывод в файл формата Excel
sLogMethodExt = "doubles"; // префикс файла журнала (для sLogMethod = "ext")
slogMethodPath = "x-local://Logs"; //директория для сохранения файла на сервер (sLogMethod = "excel")
sLogMode = "error;success;delete"; // тип событий, требующих записи в лог error = ошибки, success = успешный поиск дублей и объединение, notfound = когда дублей не найдено, details = данные по каждому измененному объекту, delete = удаления
bLogError = StrContains(sLogMode, "error");
bLogNotFound = StrContains(sLogMode, "notfound");
bLogSuccess = StrContains(sLogMode, "success");
bLogDetails = StrContains(sLogMode, "details");
bLogDelete = StrContains(sLogMode, "delete");

var _delete_positions = "delete" ;
var _delete_persons = true;
var _copy_learning = true;
var _eq_fields = "email,code,fullname";
var _eq_accountname = "";
var _eq_custom_fields = "";//UNID
var _eq_xquery = "";

// вот 2 переменные по которым ищется основная карточка
var _main_flag = "maxdate";
//var _main_field = "custom_elems.ObtainChildByKey('od').value";
var _main_field = "doc_info.creation.date";

var _copy_fields = "";
var _replace_fields = "";
var _clear_fields = "";

// Слияние истории состояний сотрудника
var MERGE_HISTORY_STATES = false;

var _select_xquery = " for $obj in collaborators, $obj2 in group_collaborators where $obj/id = $obj2/collaborator_id and $obj2/group_id = 6943858965424526143 return $obj ";

var _req_custom_fields = ""; //"participant_id,cs_recruiter_id,declarer_id";
var _req_workflow_fields = "";

function open_log() {
    if (!bIsLog)     {
        return false;
    }
    if (sLogMethod == "system") {
        return true;
    }
    else if (sLogMethod == "ext") {
        EnableLog(sLogMethodExt, true);
    } else if (sLogMethod == "report") {
        docReport = OpenNewDoc('x-local://wtv/wtv_action_report.xmd');
        docReport.BindToDb(DefaultDb);
        docReport.TopElem.create_date = Date();
        docReport.TopElem.type = "import_excel";
        docReport.TopElem.completed = false;
        docReport.TopElem.report_text = "Загрузка данных сотрудников из Excel.\n";
        docReport = tools.add_report(docReport.DocID, 'Запуск процесса.', docReport);
        sLogStr = docReport.TopElem.report_text;
    } else if (sLogMethod == "excel") {
        sLogStr = "<HTML>
            <META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=utf-8\"/>
    <BODY>
    <TABLE BORDER=\"1\" CELLPADDING=\"2\" CELLSPACING=\"0\">
    <TR><TD><B>" + Date() + "-   ПРОЦЕСС ИМПОРТА ЗАПУЩЕН</B></TD></TR>";
    } else {
        return false;
    }
}

function close_log() {
    if (!bIsLog) {
        return false;
    }
    if (sLogMethod == "system") {
        return true;
    } else if (sLogMethod == "ext") {
        EnableLog(sLogMethodExt, false);
    } else if (sLogMethod == "report") {
        docReport.TopElem.completed = !bError;
        docReport.TopElem.report_text = sLogStr + "\n" + Date() + '  Процесс завершен.';
        docReport.Save();
    } else if (sLogMethod == "excel") {
        sLogStr = sLogStr + "
            <TR><TD><B>" + Date() + "-   ПРОЦЕСС ИМПОРТА ЗАВЕРШЕН</B></TD></TR>
    </TABLE>
    </BODY>
    </HTML>";
        if (LdsIsServer) {
            filemname = slogMethodPath + (sLogMethodExt + "_" + Year(Date()) + "_" + Month(Date()) + "_" + Day(Date()) + "_" + Hour(Date()) + "_" + Minute(Date())) + ".xls";
            PutUrlText(_filemname, sLogStr);
        } else {
            _filemname = ObtainTempFile('.xls');
            PutUrlText(_filemname, sLogStr);
            ShellExecute('open', _filemname);
        }
    } else {
        return false;
    }
}

function write_log_text(text) {
    if (!bIsLog) {
        return false;
    }
    if (sLogMethod == "system") {
        alert(text);
    } else if (sLogMethod == "ext") {
        LogEvent(sLogMethodExt, text);
    } else if (sLogMethod == "report") {
        sLogStr = sLogStr + "\n" + Date() + " -  " + text;
    } else if (sLogMethod == "excel") {
        sLogStr = sLogStr + "<TR><TD>" + Date() + " -  " + text + "</TD></TR>";
    } else{
        return false;
    }
}

function wLog(id, errstr, obj, key, doubles, delete_id) {
    if (!bIsLog) {
        return false;
    }
    _text = "ID:" + id + "; ";
    if (errstr != "" && bLogError) {
        write_log_text(_text + "ОШИБКА: " + errstr);
        return true;
    } if (obj == null && bLogNotFound) {
        write_log_text(_text + "НЕ НАЙДЕНО ПО ЗАПРОСУ: " + key);
        return true;
    }
    if (obj != null && bLogDelete && delete_id!=null) {
        _text += "УДАЛЕН ОБЪЕКТ С ID:  "+delete_id+" тип:"+obj+" ПО ЗАПРОСУ: " + key;
        write_log_text(_text);
        return true;
    } else if (obj != null && bLogSuccess && delete_id==null && doubles!=null) {
        _text += "НАЙДЕНА ЗАПИСЬ ПО КЛЮЧУ: " + key + ". ЗАМЕНЕНО: "+doubles;
        write_log_text(_text);
        return true;
    }
    if (obj != undefined && bLogDetails && delete_id==null) {
        _text += "ИЗМЕНЕН ОБЪЕКТ С ID:  "+obj.id+" тип:"+obj.Name+" ПО ЗАПРОСУ: " + key;
        write_log_text(_text);
        return true;
    } else {
        return true;
    }
    write_log_text(_text);
    return true;
}

_agent_num=Random(0,100000);

var _arr_eq_fields = _eq_fields.split(",");
var _arr_eq_custom_fields = _eq_custom_fields.split(",");
var _arr_main_field = _main_field.split(".");
var _arr_copy_fields = _copy_fields.split(",");
var _arr_replace_fields = _replace_fields.split(",");
var _arr_clear_fields = _clear_fields.split(",");
var _arr_req_custom_fields = String(_req_custom_fields).split(",");
var _arr_req_workflow_fields = String(_req_workflow_fields).split(",");

function Delete_positions( a ) {
    try {
        PersonDoc = OpenDoc ( UrlFromDocID ( a ) );
        xq = " for $position in positions where $position/basic_collaborator_id=  " + a + " return $position ";
        ArrayAllPositions = XQuery ( xq );
        for ( _position in ArrayAllPositions ) {
            PositionDoc = OpenDoc ( UrlFromDocID ( _position.PrimaryKey ) );
            if ( _delete_positions == "delete" ) {
                PersonDoc.TopElem.position_id.Clear (  );
                PersonDoc.TopElem.position_name.Clear (  );
                PersonDoc.Save (  );
                DeleteDoc ( UrlFromDocID ( _position.PrimaryKey ) );
                wLog(a, "", "position", xq, null, _position.PrimaryKey);
            } else if ( _delete_positions == "clear" ||  _delete_positions == "keep") {
                if (_delete_persons == false) {
                    PersonDoc.TopElem.position_id.Clear (  );
                    PersonDoc.TopElem.position_name.Clear (  );
                    PersonDoc.Save (  );
                    wLog(a, "", PersonDoc.TopElem, xq, null, null)
                }
                if ( _delete_positions == "keep" ) {
                    PositionDoc.TopElem.basic_collaborator_id = _main_person_id;
                    PositionDoc.TopElem.basic_collaborator_id.sd.fullname = teMainPerson.fullname;
                    PositionDoc.TopElem.basic_collaborator_id.sd.position_name = PositionDoc.TopElem.name;
                    PositionDoc.TopElem.basic_collaborator_id.sd.position_id = _position.PrimaryKey;
                    PositionDoc.TopElem.basic_collaborator_id.sd.is_dismiss = teMainPerson.is_dismiss;
                    wLog(a, "", PositionDoc.TopElem, xq, null, null)
                } else {
                    PositionDoc.TopElem.basic_collaborator_id.Clear ( );
                    wLog(a, "", PositionDoc.TopElem, xq, null, null)
                }
                PositionDoc.Save (  );
            }
        }
    } catch ( dp_error ) {
        wLog(a, dp_error, null, null, null, null)
    }
}

function InfoChanging ( _test_or_course , m_person_id, xq) {
    if ( _copy_learning == true ) {
        docObject = OpenDoc ( UrlFromDocID ( _test_or_course.id ) );
        docObject.TopElem.person_id = m_person_id;
        //alert(tools.common_filling( 'collaborator', docObject.TopElem, m_person_id));
        if (tools.common_filling( 'collaborator', docObject.TopElem, m_person_id)) {
            docObject.Save();
            wLog(_test_or_course.id, "", docObject.TopElem, xq, null, null)
        } else {
            wLog(_test_or_course.id, "tools.common_fillin_failed", docObject.TopElem, xq, null, null)
        }
    }
}

function GetDotValue ( _obj , _arr_field ) {
    var ch_obj = _obj;
    for ( _m_arr_field in _arr_field ) {
//alert(_m_arr_field);
        eval("ch_obj = ch_obj." + _m_arr_field );
    }
//alert("ChvalueAll=" + ch_obj.Value);
    return ch_obj.Value;
}

function SetDotValue ( _obj , _arr_field , _v_value ) {
    var ch_obj = _obj;
    for ( _m_arr_field in _arr_field ) {
        eval("ch_obj = ch_obj." + _m_arr_field );
    }
    ch_obj.Value = _v_value;
//alert("ChObjValue=" + ch_obj.Value);
    return true;
}

function Copy_Person_Values ( _m_doc_te, _d_id  ) {
    var _d_doc = OpenDoc ( UrlFromDocID ( _d_id ) );
    var _d_doc_te = _d_doc.TopElem;
    if ( _copy_fields != "" ) {
        for ( _m_arr_copy_fields in _arr_copy_fields ) {
//alert("CopyFields: " + _m_arr_copy_fields);
            _arr_m_arr_copy_fields = _m_arr_copy_fields.split(".");
//alert("CopyFields2: " + _arr_m_arr_copy_fields);
            if (_m_arr_copy_fields != 'hire_date') {
                if ( String( GetDotValue( _m_doc_te, _arr_m_arr_copy_fields ) ) == "") {
                    SetDotValue( _m_doc_te, _arr_m_arr_copy_fields, GetDotValue( _d_doc_te, _arr_m_arr_copy_fields ) );
                }
            } else if (_m_arr_copy_fields == 'hire_date') {
                dMainDate = GetDotValue( _m_doc_te, _arr_m_arr_copy_fields );
//alert(dMainDate);
                dDblDate = GetDotValue( _d_doc_te, _arr_m_arr_copy_fields );
//alert(dDblDate);
                if (dDblDate < dMainDate) {
                    SetDotValue( _m_doc_te, _arr_m_arr_copy_fields, dDblDate );
                }
            }
        }
    }
    if ( _replace_fields != "" ) {
        for ( _m_arr_replace_fields in _arr_replace_fields ) {
            _arr_m_arr_replace_fields = _m_arr_replace_fields.split(".");
            SetDotValue( _d_doc_te, _arr_m_arr_replace_fields, GetDotValue( _m_doc_te, _arr_m_arr_replace_fields ) );
            _m_doc.Save();
        }
    }
    if ( _clear_fields != "" ) {
        for ( _m_arr_clear_fields in _arr_clear_fields ) {
            _arr_m_arr_clear_fields = _m_arr_clear_fields.split(".");
            SetDotValue( _d_doc_te, _arr_m_arr_replace_fields, "" );
            _d_doc.Save();
        }
    }

}

open_log();

write_log_text("Start. Агент для удаления дублей из персонала");

ArrayAllPersons = Array();
if (OBJECTS_ID_STR != '') {
    // формирование массива по выделенным карточкам сотрудников
    arrStrObjectsId = OBJECTS_ID_STR.split(";");
    arrObjectsId = Array();
    for ( i=0, j=0; i<ArrayCount(arrStrObjectsId); i++, j++ ) {
        arrObjectsId[j] = Int(arrStrObjectsId[i] );
    }
    ArrayAllPersons = QueryCatalogByKeys( "collaborators", "id", arrObjectsId );
} else {
    // формирование массива по всем карточкам сотрудников
    if (_select_xquery == "") {
        ArrayAllPersons = XQuery(" for $obj in collaborators return $obj ")
    } else {
        ArrayAllPersons = XQuery(_select_xquery)
    }
}
write_log_text('Found ' + ArrayCount(ArrayAllPersons)+ ' Persons');
i=0;
try {
    k=0;
    ArrayDoubles = Array();
    if (ArrayOptFirstElem(ArrayAllPersons) != undefined) {
        for (_col in ArraySelectAll(ArrayAllPersons)) {
            _main_person_id='';
            _main_doc = undefined;
            _main_obj = undefined;
            strXQuery1 = "";
            for (_m_arr_eq_fields in _arr_eq_fields) {
                if (_m_arr_eq_fields=="" || _col.ChildExists(_m_arr_eq_fields)!=true) {
                    continue;
                }

                if ( strXQuery1 != "") {
                    strXQuery1 += " and "
                }
                prAdd = false;
                if (_col.Child( _m_arr_eq_fields ).Value != '' && _col.Child( _m_arr_eq_fields ).Value != null) {
                    if (_m_arr_eq_fields != 'login' && _m_arr_eq_fields != 'email') {
                        if (_m_arr_eq_fields == 'birth_date' || _m_arr_eq_fields == 'hire_date') {
                            strXQuery1 += "($obj/" + _m_arr_eq_fields + " = date('" + _col.Child( _m_arr_eq_fields ).Value + "'))" ;
                            prAdd = true;
                        } else {
                            strXQuery1 += "($obj/" + _m_arr_eq_fields + " = '" + _col.Child( _m_arr_eq_fields ).Value + "')" ;
                            prAdd = true;
                        }
                    } else if (_eq_accountname == "EMAIL" || _eq_accountname == "AD") {
                        _splitter = (_eq_accountname == "EMAIL"?"@":"\\");
                        _acc_name = String(_col.Child( _m_arr_eq_fields ).Value).split(_splitter)[0] + _splitter;
                        strXQuery1 += "contains($obj/" + _m_arr_eq_fields + ", '" + StrLowerCase(_acc_name) + "') or contains($obj/" + _m_arr_eq_fields + ", '" + StrUpperCase(_acc_name) + "') or contains($obj/" + _m_arr_eq_fields + ", '" + (_acc_name) + "')";
                        prAdd = true;
                    } else {
                        strXQuery1 += "($obj/" + _m_arr_eq_fields + " = '" + StrLowerCase(_col.Child( _m_arr_eq_fields ).Value);
                        strXQuery1 += "' or $obj/" + _m_arr_eq_fields + " = '" + StrUpperCase(_col.Child( _m_arr_eq_fields ).Value);
                        strXQuery1 += "' or $obj/" + _m_arr_eq_fields + " = '" + _col.Child( _m_arr_eq_fields ).Value + "')";
                        prAdd = true;
                    }
                }
                if ( prAdd == false ) {
                    strXQuery1 = StrLeftRange(strXQuery1, StrLen(strXQuery1) - StrLen(" and "));
                }
            }
            for (_m_arr_eq_custom_fields in _arr_eq_custom_fields) {
                if (_m_arr_eq_custom_fields!="") {
                    if (_main_person_id=="") {
                        _main_person_id=_col.id;
                    }
                    if (_main_doc==undefined) {
                        _main_doc = OpenDoc ( UrlFromDocID ( _main_person_id ) );
                    }
                    if (_main_obj == undefined) {
                        _main_obj = _main_doc.TopElem;
                    }
                    if ( strXQuery1 != "") {
                        strXQuery1 += " and "
                    }
                    strXQuery1 += "doc-contains($obj/id,'wt_data','["+_m_arr_eq_custom_fields+"="+_main_obj.custom_elems.ObtainChildByKey(_m_arr_eq_custom_fields).value+"]')";
                }
            }
// alert("strXQuery1: " + strXQuery1);
            if (strXQuery1 != '') {
                ArrayDoubles = XQuery("for $obj in collaborators where " + strXQuery1 + " order by $obj/id return $obj");
//ArrayDoubles = ArraySelect(ArrayAllPersons, _XQ1M );
            }

            ii=0;
            if (ArrayCount(ArrayDoubles)>1 ) {
//alert("Doubles= " + ArrayCount(ArrayDoubles) + " " + " Name= " + _col.fullname + " collId= " + _col.id);
                i++;
                if (_main_person_id=="") {
                    _main_person_id=_col.id;
                }
                if (_main_doc==undefined) {
                    _main_doc = OpenDoc ( UrlFromDocID ( _main_person_id ) );
                }
                if (_main_obj == undefined) {
                    _main_obj = _main_doc.TopElem;
                }
                if ( _main_flag == "nullfield" && ( GetDotValue( _main_obj, _arr_main_field ) != "" ) ) {
                    for ( _v_col in ArrayDoubles ) {
                        _v_doc = OpenDoc ( UrlFromDocID ( _v_col.id ) );
                        _v_obj = _v_doc.TopElem;
                        if ( GetDotValue( _v_obj, _arr_main_field ) == "" ) {
                            _main_person_id=_v_col.id
                        }
                    }
                }// end if ( _main_flag == "nullfield")
                if ( _main_flag == "solidfield" && ( GetDotValue( _main_obj, _arr_main_field ) == "" ) ) {
                    for ( _v_col in ArrayDoubles ) {
                        _v_doc = OpenDoc ( UrlFromDocID ( _v_col.id ) );
                        _v_obj = _v_doc.TopElem;
                        if ( GetDotValue( _v_obj, _arr_main_field ) != "" ) {
                            _main_person_id=_v_col.id
                        }
                    }
                }// end if ( _main_flag == "solidfield")
                if ( _main_flag == "maxdate" ) {
                    _m_date = GetDotValue( _main_obj, _arr_main_field );
                    for ( _v_col in ArrayDoubles ) {
                        _v_doc = OpenDoc ( UrlFromDocID ( _v_col.id ) );
                        _v_obj = _v_doc.TopElem;
                        _v_date = GetDotValue( _v_obj, _arr_main_field );
                        if (  _v_date > _m_date ) {
                            _main_person_id=_v_col.id;
//teMainPerson = OpenDoc(UrlFromDocID(_main_person_id)).TopElem;
                            _m_date = _v_date;
                        }
                    }
                }// end if ( _main_flag == "maxdate")
                if ( _main_flag == "mindate" ) {
                    _m_date = GetDotValue( _main_obj, _arr_main_field );
                    for ( _v_col in ArrayDoubles ) {
                        _v_doc = OpenDoc ( UrlFromDocID ( _v_col.id ) );
                        _v_obj = _v_doc.TopElem;
                        _v_date = GetDotValue( _v_obj, _arr_main_field );
                        if (  _v_date < _m_date ) {
                            _main_person_id=_v_col.id;
                            _m_date = _v_date;
                        }
                    }
                }// end if ( _main_flag == "mindate")
//alert("main_person_id= " + _main_person_id );
                docMainPerson = OpenDoc(UrlFromDocID(_main_person_id));
                teMainPerson = docMainPerson.TopElem;

                for (_dbl in ArraySelectAll(ArrayDoubles)) {
                    if (_dbl.id != _main_person_id) {
                        DblDoc = OpenDoc ( UrlFromDocID ( _dbl.id ) );
//DblDoc.TopElem.password='111111';
//DblDoc.Save();
// ------------active_learnings, learnings-------------------------
                        xarrActivLearns = XQuery("for $learn in active_learnings where $learn/person_id = " + _dbl.id + " return $learn");
                        xarrLearnings = XQuery("for $learn in learnings where $learn/person_id = " + _dbl.id + " return $learn");
                        xarrAllLearnings = ArrayUnion(xarrActivLearns, xarrLearnings);
//alert("Name= " + _col.fullname + " mainPersonId= " + _main_person_id + " dblId= " + _dbl.id + " colId= " + _col.id);
//alert("CntArrLearn= " + ArrayCount(xarrLearnings));
                        if (ArrayOptFirstElem(xarrAllLearnings) != undefined) {
                            for ( catLearn in xarrAllLearnings ) {
                                InfoChanging (catLearn,  _main_person_id);
                            }
                        }
// ------------active_test_learnings, test_learnings---------------
                        xarrActivTestLearns = XQuery("for $test_learn in active_test_learnings where $test_learn/person_id = " + _dbl.id + " return $test_learn");
                        xarrTestLearns = XQuery("for $test_learn in test_learnings where $test_learn/person_id = " + _dbl.id + " return $test_learn");
                        xarrAllTestLearnings = ArrayUnion(xarrActivTestLearns, xarrTestLearns);
//alert("CntArrTestLearn= " + ArrayCount(xarrTestLearnings));
                        if (ArrayOptFirstElem(xarrAllTestLearnings) != undefined) {
                            for (catTest in xarrAllTestLearnings ) {
                                InfoChanging (catTest,  _main_person_id);
                            }
                        }
// -----------------events------------------------------------------
//xarrEvents = XQuery("for $elem in events return $elem");
                        xarrEventCollab =XQuery("for $elem in event_collaborators where $elem/collaborator_id=" + _dbl.id + " return $elem");
//alert("CntEventColl=" + ArrayCount(xarrEventCollab));
                        if (ArrayOptFirstElem(xarrEventCollab) != undefined) {
                            for (catEvent in xarrEventCollab) {
                                docEvent = tools.open_doc(catEvent.event_id);
                                if (docEvent==undefined)
                                    continue;
                                if (catEvent.is_collaborator == true) {
                                    elemCollab = docEvent.TopElem.collaborators.GetOptChildByKey(_dbl.id);
                                    if (elemCollab != undefined) {
                                        elemCollab.collaborator_id = _main_person_id;
                                        elemCollab.person_fullname = teMainPerson.fullname;
                                        elemCollab.person_position_name = (teMainPerson.position_name != null? teMainPerson.position_name : '');
                                        elemCollab.person_org_name = (teMainPerson.org_name != null? teMainPerson.org_name : '');
                                        elemCollab.person_subdivision_name = (teMainPerson.position_parent_name != null? teMainPerson.position_parent_name : '');
                                    }
                                }
                                if (catEvent.is_tutor == true) {
                                    elemTutor = docEvent.TopElem.tutors.GetOptChildByKey(_dbl.id);
                                    if (elemTutor != undefined) {
                                        elemTutor.collaborator_id = _main_person_id;
                                        elemTutor.person_fullname = teMainPerson.fullname;
                                        elemTutor.person_position_name = (teMainPerson.position_name != null? teMainPerson.position_name : '');
                                        elemTutor.person_org_name = (teMainPerson.org_name != null? teMainPerson.org_name : '');
                                        elemTutor.person_subdivision_name = (teMainPerson.position_parent_name != null? teMainPerson.position_parent_name : '');
                                    }
                                }
                                if (catEvent.is_preparation == true) {
                                    elemPrepar = docEvent.TopElem.even_preparations.GetOptChildByKey(_dbl.id) ;
                                    if (elemPrepar != undefined) {
                                        elemPrepar.person_id = _main_person_id;
                                        elemPrepar.person_fullname = teMainPerson.fullname;
                                    }
                                }
                                docEvent.Save();
                                wLog(_main_person_id, "", docEvent.TopElem, strXQuery1, null, null);
                            }
                        }
                        xarrResEvents = XQuery("for $elem in event_results where $elem/person_id = " + _dbl.id + " return $elem");
                        if (ArrayOptFirstElem(xarrResEvents)!= undefined)
                        {
                            for (catRes in xarrResEvents)
                            {
                                InfoChanging (catRes, _main_person_id);
                            }
                        }
// --------------------assessment_appraises----------------------------
                        xarrAssessm = XQuery("for $elem in assessment_appraises where $elem/status='0' and $elem/is_model=false() return $elem");
                        for (catAssessm in xarrAssessm)
                        {
                            docAssessm = tools.open_doc(catAssessm.id);
                            if (docAssessm!=undefined)
                            {
                                arrPerson = docAssessm.TopElem.auditorys;
                                elemPers = docAssessm.TopElem.auditorys.GetOptChildByKey(_dbl.id);
                                if (elemPers != undefined)
                                {
                                    elemPers.person_id = _main_person_id;
                                    elemPers.person_name = teMainPerson.fullname;
                                    elemPers.position_name = (teMainPerson.position_name != null? teMainPerson.position_name : '');
                                    docAssessm.Save();
                                    wLog(_main_person_id, "", docAssessm.TopElem, strXQuery1, null, null);
                                }
                            }
                        }
                        xarrPas = XQuery("for $elem in pas where $elem/person_id = " + _dbl.id + " return $elem");
                        xarrDevPlans = XQuery("for $elem in development_plans where $elem/person_id = " + _dbl.id + " return $elem");
                        xarrAssessmPlans = XQuery("for $elem in assessment_plans where $elem/person_id = " + _dbl.id + " return $elem");
                        xarrAllPas = ArrayUnion(xarrPas,xarrDevPlans,xarrAssessmPlans);
                        if (ArrayOptFirstElem(xarrAllPas) != undefined)
                        {
                            for (catPa in xarrPas)
                            {
                                docPa = OpenDoc(UrlFromDocID(catPa.id));
                                docPa.TopElem.person_id = _main_person_id;
                                tools_ass.assessment_person_filling(docPa.TopElem.person_id, _main_person_id);
                                docPa.Save();
                                wLog(_main_person_id, "", docPa.TopElem, strXQuery1, null, null);
                            }
                        }
                        xarrExpPas = XQuery("for $elem in pas where $elem/expert_person_id = " + _dbl.id + " return $elem");
                        xarrExpDevPlans = XQuery("for $elem in development_plans where $elem/expert_person_id = " + _dbl.id + " return $elem");
                        xarrExpAssessmPlans = XQuery("for $elem in assessment_plans where $elem/expert_person_id = " + _dbl.id + " return $elem");
                        xarrAllExpPas = ArrayUnion(xarrExpPas,xarrExpDevPlans,xarrExpAssessmPlans);
                        if (ArrayOptFirstElem(xarrAllExpPas) != undefined)
                        {
                            for (catExpPa in xarrExpPas)
                            {
                                docPas = OpenDoc(UrlFromDocID(catExpPa.id));
                                docPas.TopElem.expert_person_id = _main_person_id;
                                tools_ass.assessment_person_filling(docPas.TopElem.expert_person_id, _main_person_id);
                                docPas.Save();
                                wLog(_main_person_id, "", docPas.TopElem, strXQuery1, null, null);
                            }
                        }
// ------------requests---------------
                        xarrReqs = XQuery("for $req in requests where $req/person_id = " + _dbl.id + " or $req/object_id= " + _dbl.id + ((_req_custom_fields!="" || _req_workflow_fields!="")?" or doc-contains($req/id,'wt_data','"+_dbl.id+"')":"") + " return $req");
                        if (ArrayOptFirstElem(xarrReqs) != undefined)
                        {
                            for (catReq in xarrReqs )
                            {
                                docReq = OpenDoc(UrlFromDocID(catReq.id));
                                is_change = false;
                                if (docReq.TopElem.person_id == _dbl.id)
                                {
                                    docReq.TopElem.person_id = _main_person_id;
                                    is_change = true;
                                }
                                if (docReq.TopElem.object_id == _dbl.id)
                                {
                                    docReq.TopElem.object_id = _main_person_id;
                                    is_change = true;
                                }
                                for (_mfld in _arr_req_custom_fields)
                                {
                                    if (OptInt(docReq.TopElem.custom_elems.ObtainChildByKey(_mfld).value,999) == _dbl.id)
                                    {
                                        docReq.TopElem.custom_elems.ObtainChildByKey(_mfld).value = _main_person_id;
                                        is_change = true;
                                    }
                                }
                                for (_mfld in _arr_req_workflow_fields)
                                {
                                    if (OptInt(docReq.TopElem.workflow_fields.ObtainChildByKey(_mfld).value,999) == _dbl.id)
                                    {
                                        docReq.TopElem.workflow_fields.ObtainChildByKey(_mfld).value = _main_person_id;
                                        is_change = true;
                                    }
                                }
                                if (is_change)
                                {
                                    docReq.Save();
                                    wLog(_main_person_id, "", docReq.TopElem, strXQuery1, null, null);
                                }
                            }
                        }
// ----------------------------------history_states------------------------------------
                        if (MERGE_HISTORY_STATES)
                        {
                            arrChangeLogs = docMainPerson.TopElem.change_logs;
                            iCntLogs = ArrayCount(arrChangeLogs);
                            arrChLogsDbl = DblDoc.TopElem.change_logs ;
                            if (iCntLogs == 0)
                            {
                                for (elemLog in arrChLogsDbl)
                                {
                                    addChangeLog =  arrChangeLogs.AddChild();
                                    addChangeLog.AssignElem( elemLog );
                                }
                            }
                            else
                            {
                                for (elemLog in arrChLogsDbl)
                                {
                                    bPrAdd = true;
                                    for (elemMain in arrChangeLogs)
                                    {
                                        if (elemMain.position_id == elemLog.position_id && elemMain.position_parent_id == elemLog.position_parent_id && elemMain.org_id == elemLog.org_id)
                                        {
                                            bPrAdd = false;
                                            break;
                                        }
                                    }
                                    if (bPrAdd == true)
                                    {
                                        addChangeLog =  arrChangeLogs.InsertChild((iCntLogs-1))
                                        iCntLogs++
                                        addChangeLog.AssignElem( elemLog );
                                    }
                                }
                            }
                            arrHistory = docMainPerson.TopElem.history_states;
                            arrHistoryDbl = DblDoc.TopElem.history_states ;
                            for (elemHist in arrHistoryDbl)
                            {
                                addHistory =  arrHistory.AddChild();
                                addHistory.id = elemHist.id;
                                addHistory.state_id = elemHist.state_id;
                                addHistory.start_date = elemHist.start_date;
                                addHistory.finish_date = elemHist.finish_date;
                                addHistory.comment = elemHist.comment;
                            }
                            Copy_Person_Values ( teMainPerson, _dbl.id );
                            docMainPerson.Save();
                            wLog(_main_person_id, "", docMainPerson.TopElem, strXQuery1, null, null);
                        }
// ------------------------------------------------------------------------------------
                        Delete_positions ( _dbl.id );
                        if ( _delete_persons == true )
                        {
                            DeleteDoc ( UrlFromDocID (_dbl.id) );
                            wLog(_main_person_id, "", "person", strXQuery1, null, _dbl.id);
                            _xq = "for $elem in group_collaborators where $elem/collaborator_id="+_dbl.id+" return $elem";
                            for (catGroup in XQuery(_xq))
                            {
                                docGroup = tools.open_doc(catGroup.group_id);
                                if (docGroup==undefined)
                                    continue;
                                teGroup = docGroup.TopElem ;
                                arrCollaborat = teGroup.collaborators;
                                elemCollab = arrCollaborat.GetOptChildByKey(_dbl.id);
                                if (elemCollab != undefined)
                                {
//									alert("Будет удален сотрудник с id=" + _dbl.id + " из карточки дубля");
                                    arrCollaborat.DeleteChildByKey(_dbl.id);
                                    docGroup.Save();
                                    wLog(_main_person_id, "", teGroup, _xq, null, null);
                                    newElemCollab = arrCollaborat.GetOptChildByKey(_main_person_id);
                                    if (newElemCollab != undefined)
                                    {
//										alert("Сотрудника не добавляем - он и так там есть");
                                    }
                                    else
                                    {
                                        addCollab = arrCollaborat.AddChild();
                                        addCollab.collaborator_id = _main_person_id;
                                        docGroup.Save();
                                        wLog(_main_person_id, "", teGroup, _xq, null, null);
                                    }
                                }
                            }
                        }
                    }// end if (_dbl.id != _main_person_id)
                } // end for (_dbl in ArrayDoubles)
                wLog(_main_person_id, "", docMainPerson.TopElem, strXQuery1, ArrayCount(ArrayDoubles), null);
            } // end if (ArrayCount(ArrayDoubles)>1)
        }// end for (_col in ArrayAllPersons)
    }// end if (ArrayCount(ArrayAllPersons)>0)
}
catch ( eprst )
{
    wLog("", eprst, null, null, null, null)
}

write_log_text(" Agent_clear_doubles finished! Updated " + i + " records");