// 6971547756809832147
function certificate ( _MyDate, _curDoc, i, programName ) {
    docCertificate = tools.create_certificate_to_person( object_id, certificate_type_id );
    docCertificate.TopElem.serial = "И";
    docCertificate.TopElem.delivery_date = _MyDate;
    docCertificate.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = programName;
    docCertificate.TopElem.custom_elems.ObtainChildByKey( "object_data" ).value = _curDoc.DocID;
    docCertificate.Save();
    _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value = docCertificate.DocID;
    _curDoc.Save();
    tools.create_notification( "cert_ibp_print", object_id, programName, docCertificate.DocID );
}

function validateAllowableDateInterval(incomingDate, prefix, programName) {
    if(incomingDate != undefined) {
        currentDate = Date();
        if(Month(incomingDate) != Month(currentDate) || Year(incomingDate) != Year(currentDate)) {
            ERROR = 1;
            MESSAGE =  prefix + programName + " за пределами текущего месяца!";
            Cancel();
        }
    }
}

function checkAccessDate(objectDataDoc, checkBox, accessDate, programName) {
    incomingDate = OptDate(accessDate);

    if (checkBox == "1" && OptDate(incomingDate) == undefined) {
        ERROR = 1
        MESSAGE = "Заполните Дату допуска к сертификации"
        Cancel()
    }

    if(objectDataDoc == null || !objectDataDoc.TopElem.custom_elems.ObtainChildByKey( "flag" ).value) {
        validateAllowableDateInterval(incomingDate, "", programName);
    }
}

function check_date( objectDataDoc, position, _MyCombo, _MyDate, programName ) {
    incomingDate = OptDate(_MyDate);

    if (_MyCombo == "Сертифицировать" && incomingDate == undefined) {
        //_MyDateObj.Class = "datepicker-error-color";

        ERROR = 1;
        MESSAGE = "Заполните Дату в " + programName + "!";
        Cancel();
    }

    if(objectDataDoc == null || StrUpperCase(objectDataDoc.TopElem.custom_elems.ObtainChildByKey( "result_" + position ).value) != "СЕРТИФИЦИРОВАТЬ") {
        validateAllowableDateInterval(incomingDate, "Выбранная дата в ", programName);
    }
}

function check_combo( _MyCombo, _MyDate, _curDoc, i, programName ) {
    if ( _MyCombo == "Сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value == '' ) {
        programName = String( programName );
        programName = StrContains( programName, "«" ) && StrContains( programName, "»" ) ? StrRangePos( programName, programName.indexOf("«")+2, programName.indexOf("»") ) : programName;
        certificate( _MyDate, _curDoc, i, programName );
    }
}

var certificate_type_id = 5293675553778464279; // Подготовка инструкторов по БП
var cert_object_data_type_id = 6966499755925068211; // Сертификация инструкторов по БП
object_id = OptInt( object_id );

//sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " and $elem/sec_object_id=" + curUserID + " return $elem"
sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " return $elem"

foundObjectData = ArrayOptFirstElem( XQuery( sXQ ) );

if ( foundObjectData == undefined ) {
    checkAccessDate( null, checkbox1, MyDateAccess, "Дата допуска к сертификации ");
    check_date( null, 1, MyCombo1, MyDate1, custom_templates.object_data_type.items[0].sheets[1].title );
    check_date( null, 2, MyCombo2, MyDate2, custom_templates.object_data_type.items[0].sheets[2].title );
    check_date( null, 3, MyCombo3, MyDate3, custom_templates.object_data_type.items[0].sheets[3].title );
    check_date( null, 4, MyCombo4, MyDate4, custom_templates.object_data_type.items[0].sheets[4].title );
    check_date( null, 5, MyCombo5, MyDate5, custom_templates.object_data_type.items[0].sheets[5].title );
    check_date( null, 6, MyCombo6, MyDate6, custom_templates.object_data_type.items[0].sheets[6].title );

    newDoc = tools.new_doc_by_name( 'object_data', false )
    newDoc.BindToDb()

    teNewDoc = newDoc.TopElem
    teNewDoc.object_data_type_id = cert_object_data_type_id
    teNewDoc.object_type = "collaborator"
    teNewDoc.object_id = object_id
    foundCol = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id="+object_id+" return $elem" ) )
    teNewDoc.object_name = foundCol == undefined ? '' : foundCol.fullname
    teNewDoc.sec_object_type = "collaborator"
    teNewDoc.sec_object_id = curUserID
    teNewDoc.custom_elems.ObtainChildByKey( "flag" ).value = checkbox1
    if ( checkbox1 == "1" ) { teNewDoc.custom_elems.ObtainChildByKey( "date_access" ).value = MyDateAccess }
    teNewDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1
    teNewDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2
    teNewDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3
    teNewDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4
    teNewDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5
    teNewDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6
    teNewDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1
    teNewDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2
    teNewDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3
    teNewDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4
    teNewDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5
    teNewDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6
    teNewDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1
    teNewDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2
    teNewDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3
    teNewDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4
    teNewDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5
    teNewDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6
    teNewDoc.custom_elems.ObtainChildByKey( "task_1" ).value = MyCombo_task1
    teNewDoc.custom_elems.ObtainChildByKey( "task_2" ).value = MyCombo_task2
    teNewDoc.custom_elems.ObtainChildByKey( "task_3" ).value = MyCombo_task3
    teNewDoc.custom_elems.ObtainChildByKey( "task_comm_1" ).value = Edit_task1
    teNewDoc.custom_elems.ObtainChildByKey( "task_comm_2" ).value = Edit_task2
    teNewDoc.custom_elems.ObtainChildByKey( "task_comm_3" ).value = Edit_task3

    newDoc.Save()
    curDoc = newDoc
} else {
    myDoc = tools.open_doc( foundObjectData.id );

    checkAccessDate( myDoc, checkbox1, MyDateAccess, "Дата допуска к сертификации ");
    check_date( myDoc, 1, MyCombo1, MyDate1, custom_templates.object_data_type.items[0].sheets[1].title );
    check_date( myDoc, 2, MyCombo2, MyDate2, custom_templates.object_data_type.items[0].sheets[2].title );
    check_date( myDoc, 3, MyCombo3, MyDate3, custom_templates.object_data_type.items[0].sheets[3].title );
    check_date( myDoc, 4, MyCombo4, MyDate4, custom_templates.object_data_type.items[0].sheets[4].title );
    check_date( myDoc, 5, MyCombo5, MyDate5, custom_templates.object_data_type.items[0].sheets[5].title );
    check_date( myDoc, 6, MyCombo6, MyDate6, custom_templates.object_data_type.items[0].sheets[6].title );

    teMyDoc = myDoc.TopElem
    teMyDoc.custom_elems.ObtainChildByKey( "flag" ).value = checkbox1
    teMyDoc.custom_elems.ObtainChildByKey( "date_access" ).value = MyDateAccess
    teMyDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1
    teMyDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2
    teMyDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3
    teMyDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4
    teMyDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5
    teMyDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6
    teMyDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1
    teMyDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2
    teMyDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3
    teMyDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4
    teMyDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5
    teMyDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6
    teMyDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1
    teMyDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2
    teMyDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3
    teMyDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4
    teMyDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5
    teMyDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6
    teMyDoc.custom_elems.ObtainChildByKey( "task_1" ).value = MyCombo_task1
    teMyDoc.custom_elems.ObtainChildByKey( "task_2" ).value = MyCombo_task2
    teMyDoc.custom_elems.ObtainChildByKey( "task_3" ).value = MyCombo_task3
    teMyDoc.custom_elems.ObtainChildByKey( "task_comm_1" ).value = Edit_task1
    teMyDoc.custom_elems.ObtainChildByKey( "task_comm_2" ).value = Edit_task2
    teMyDoc.custom_elems.ObtainChildByKey( "task_comm_3" ).value = Edit_task3

    myDoc.Save()
    curDoc = myDoc
}

if ( checkbox1 != '' ) {
    check_combo( MyCombo1, MyDate1, curDoc, 1, custom_templates.object_data_type.items[0].sheets[1].title )
    check_combo( MyCombo2, MyDate2, curDoc, 2, custom_templates.object_data_type.items[0].sheets[2].title )
    check_combo( MyCombo3, MyDate3, curDoc, 3, custom_templates.object_data_type.items[0].sheets[3].title )
    check_combo( MyCombo4, MyDate4, curDoc, 4, custom_templates.object_data_type.items[0].sheets[4].title )
    check_combo( MyCombo5, MyDate5, curDoc, 5, custom_templates.object_data_type.items[0].sheets[5].title )
    check_combo( MyCombo6, MyDate6, curDoc, 6, custom_templates.object_data_type.items[0].sheets[6].title )
}
MESSAGE = '<span style="color:green;font-weight:bold">Сохранено</span>';