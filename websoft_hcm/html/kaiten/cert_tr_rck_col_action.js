// 7103978829344489282
function certificate ( _MyDate, _curDoc, i, _str, qualification ) {
    if( i <= 10 ) {
        docCertificate = tools.create_certificate_to_person( object_id, certificate_type_id_1 );
        docCertificate.TopElem.serial = "Т";
        docCertificate.TopElem.delivery_date = _MyDate;
        docCertificate.TopElem.qualification_id = qualification;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "object_data" ).value = _curDoc.DocID;
        docCertificate.Save();
        if( _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
            _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false;
            tools.create_notification( "cert_tr_rck_t_print", object_id, _str, docCertificate.DocID );
        }
    }
    if( i == 11 || i == 12 ) {
        docCertificate = tools.create_certificate_to_person( object_id, certificate_type_id_2 );
        docCertificate.TopElem.serial = "Д";
        docCertificate.TopElem.delivery_date = _MyDate;
        docCertificate.TopElem.qualification_id = qualification;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "object_data" ).value = _curDoc.DocID;
        docCertificate.Save();
        if( _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
            _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false;
            tools.create_notification( "cert_tr_rck_d_print", object_id, _str, docCertificate.DocID );
        }
    }
    if( i == 13 ) {
        docCertificate = tools.create_certificate_to_person( object_id, certificate_type_id_3 );
        docCertificate.TopElem.serial = "РП";
        docCertificate.TopElem.delivery_date = _MyDate;
        docCertificate.TopElem.qualification_id = qualification;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "edu_prog_names" ).value = _str;
        docCertificate.TopElem.custom_elems.ObtainChildByKey( "object_data" ).value = _curDoc.DocID;
        docCertificate.Save();
        if( _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
            _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false;
            tools.create_notification( "cert_tr_rck_rp_print", object_id, _str, docCertificate.DocID );
        }
    }
    _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value = docCertificate.DocID;
    _curDoc.Save();
}

function check_date( _MyCombo, _MyDate, _str ) {
    if ( _MyCombo == "Сертифицировать" && OptDate( _MyDate ) == undefined ) {
        ERROR = 1;
        MESSAGE = "Заполните Дату в " + _str;
        Cancel();
    }
}

function check_combo( _MyCombo, _MyDate, _curDoc, i, _str, qualification ) {
    if ( _MyCombo == "Сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value == '' ) {
        _str = String( _str );
        _str = StrContains( _str, "«" ) && StrContains( _str, "»" ) ? StrRangePos( _str, _str.indexOf("«")+2, _str.indexOf("»") ) : _str;
        certificate( _MyDate, _curDoc, i, _str, qualification );
    }
    if ( _MyCombo == "Не сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
        _str = String( _str );
        _str = StrContains( _str, "«" ) && StrContains( _str, "»" ) ? StrRangePos( _str, _str.indexOf("«")+2, _str.indexOf("»") ) : _str;
        _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false;
        _curDoc.Save();
        if ( i == 13  ) {
            tools.create_notification( "cert_tr_rck_cancel_rp", object_id, _str );
        }
        if ( i < 13 ) {
            tools.create_notification( "cert_tr_rck_cancel", object_id, _str );
        }
    }
}

var certificate_type_id_1 = 7103979688639225943; // Сертификат тренера РЦК (серия Т)
var certificate_type_id_2 = 7104191211056400336; // Сертификат тренера РЦК (серия Д)
var certificate_type_id_3 = 7104191280476593480; // Сертификат тренера РЦК (серия РП)
var cert_object_data_type_id = 7103978283796946164; // Сертификация тренеров РЦК
object_id = OptInt( object_id );

check_date( MyCombo1, MyDate1, custom_templates.object_data_type.items[2].sheets[0].title );
check_date( MyCombo2, MyDate2, custom_templates.object_data_type.items[2].sheets[1].title );
check_date( MyCombo3, MyDate3, custom_templates.object_data_type.items[2].sheets[2].title );
check_date( MyCombo4, MyDate4, custom_templates.object_data_type.items[2].sheets[3].title );
check_date( MyCombo5, MyDate5, custom_templates.object_data_type.items[2].sheets[4].title );
check_date( MyCombo6, MyDate6, custom_templates.object_data_type.items[2].sheets[5].title );
check_date( MyCombo7, MyDate7, custom_templates.object_data_type.items[2].sheets[6].title );
check_date( MyCombo8, MyDate8, custom_templates.object_data_type.items[2].sheets[7].title );
check_date( MyCombo9, MyDate9, custom_templates.object_data_type.items[2].sheets[8].title );
check_date( MyCombo10, MyDate10, custom_templates.object_data_type.items[2].sheets[9].title );
check_date( MyCombo11, MyDate11, custom_templates.object_data_type.items[2].sheets[10].title );
check_date( MyCombo12, MyDate12, custom_templates.object_data_type.items[2].sheets[11].title );
check_date( MyCombo13, MyDate13, custom_templates.object_data_type.items[2].sheets[12].title );

//sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " and $elem/sec_object_id=" + curUserID + " return $elem"
sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " return $elem";

foundObjectData = ArrayOptFirstElem( XQuery( sXQ ) );
if ( foundObjectData == undefined ) {
    newDoc = tools.new_doc_by_name( 'object_data', false );
    newDoc.BindToDb();
    teNewDoc = newDoc.TopElem;
    teNewDoc.object_data_type_id = cert_object_data_type_id;
    teNewDoc.object_type = "collaborator";
    teNewDoc.object_id = object_id;
    foundCol = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id="+object_id+" return $elem" ) );
    teNewDoc.object_name = foundCol == undefined ? '' : foundCol.fullname;
    teNewDoc.sec_object_type = "collaborator";
    teNewDoc.sec_object_id = curUserID;
    teNewDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1;
    teNewDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2;
    teNewDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3;
    teNewDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4;
    teNewDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5;
    teNewDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6;
    teNewDoc.custom_elems.ObtainChildByKey( "result_7" ).value = MyCombo7;
    teNewDoc.custom_elems.ObtainChildByKey( "result_8" ).value = MyCombo8;
    teNewDoc.custom_elems.ObtainChildByKey( "result_9" ).value = MyCombo9;
    teNewDoc.custom_elems.ObtainChildByKey( "result_10" ).value = MyCombo10;
    teNewDoc.custom_elems.ObtainChildByKey( "result_11" ).value = MyCombo11;
    teNewDoc.custom_elems.ObtainChildByKey( "result_12" ).value = MyCombo12;
    teNewDoc.custom_elems.ObtainChildByKey( "result_13" ).value = MyCombo13;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_1" ).value = qualification1;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_2" ).value = qualification2;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_3" ).value = qualification3;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_4" ).value = qualification4;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_5" ).value = qualification5;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_6" ).value = qualification6;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_7" ).value = qualification7;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_8" ).value = qualification8;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_9" ).value = qualification9;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_10" ).value = qualification10;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_11" ).value = qualification11;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_12" ).value = qualification12;
    teNewDoc.custom_elems.ObtainChildByKey( "kval_13" ).value = qualification13;
    teNewDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1;
    teNewDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2;
    teNewDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3;
    teNewDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4;
    teNewDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5;
    teNewDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6;
    teNewDoc.custom_elems.ObtainChildByKey( "date_7" ).value = MyDate7;
    teNewDoc.custom_elems.ObtainChildByKey( "date_8" ).value = MyDate8;
    teNewDoc.custom_elems.ObtainChildByKey( "date_9" ).value = MyDate9;
    teNewDoc.custom_elems.ObtainChildByKey( "date_10" ).value = MyDate10;
    teNewDoc.custom_elems.ObtainChildByKey( "date_11" ).value = MyDate11;
    teNewDoc.custom_elems.ObtainChildByKey( "date_12" ).value = MyDate12;
    teNewDoc.custom_elems.ObtainChildByKey( "date_13" ).value = MyDate13;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_7" ).value = Edit7;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_8" ).value = Edit8;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_9" ).value = Edit9;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_10" ).value = Edit10;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_11" ).value = Edit11;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_12" ).value = Edit12;
    teNewDoc.custom_elems.ObtainChildByKey( "comment_13" ).value = Edit13;
    teNewDoc.custom_elems.ObtainChildByKey( "flag1" ).value = checkbox1;
    teNewDoc.custom_elems.ObtainChildByKey( "flag2" ).value = checkbox2;
    teNewDoc.custom_elems.ObtainChildByKey( "flag3" ).value = checkbox3;
    teNewDoc.custom_elems.ObtainChildByKey( "flag4" ).value = checkbox4;
    teNewDoc.custom_elems.ObtainChildByKey( "flag5" ).value = checkbox5;
    teNewDoc.custom_elems.ObtainChildByKey( "flag6" ).value = checkbox6;
    teNewDoc.custom_elems.ObtainChildByKey( "flag7" ).value = checkbox7;
    teNewDoc.custom_elems.ObtainChildByKey( "flag8" ).value = checkbox8;
    teNewDoc.custom_elems.ObtainChildByKey( "flag9" ).value = checkbox9;
    teNewDoc.custom_elems.ObtainChildByKey( "flag10" ).value = checkbox10;
    teNewDoc.custom_elems.ObtainChildByKey( "flag11" ).value = checkbox11;
    teNewDoc.custom_elems.ObtainChildByKey( "flag12" ).value = checkbox12;
    teNewDoc.custom_elems.ObtainChildByKey( "flag13" ).value = checkbox13;
    newDoc.Save();
    curDoc = newDoc;

    loggerName = "aa_web_7103978829344489282";
    EnableLog(loggerName, true);
    LogEvent(loggerName, "Save NEW");
    EnableLog(loggerName, false);
} else {
    myDoc = tools.open_doc( foundObjectData.id );
    teMyDoc = myDoc.TopElem;
    teMyDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1;
    teMyDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2;
    teMyDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3;
    teMyDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4;
    teMyDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5;
    teMyDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6;
    teMyDoc.custom_elems.ObtainChildByKey( "result_7" ).value = MyCombo7;
    teMyDoc.custom_elems.ObtainChildByKey( "result_8" ).value = MyCombo8;
    teMyDoc.custom_elems.ObtainChildByKey( "result_9" ).value = MyCombo9;
    teMyDoc.custom_elems.ObtainChildByKey( "result_10" ).value = MyCombo10;
    teMyDoc.custom_elems.ObtainChildByKey( "result_11" ).value = MyCombo11;
    teMyDoc.custom_elems.ObtainChildByKey( "result_12" ).value = MyCombo12;
    teMyDoc.custom_elems.ObtainChildByKey( "result_13" ).value = MyCombo13;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_1" ).value = qualification1;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_2" ).value = qualification2;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_3" ).value = qualification3;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_4" ).value = qualification4;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_5" ).value = qualification5;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_6" ).value = qualification6;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_7" ).value = qualification7;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_8" ).value = qualification8;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_9" ).value = qualification9;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_10" ).value = qualification10;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_11" ).value = qualification11;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_12" ).value = qualification12;
    teMyDoc.custom_elems.ObtainChildByKey( "kval_13" ).value = qualification13;
    teMyDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1;
    teMyDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2;
    teMyDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3;
    teMyDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4;
    teMyDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5;
    teMyDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6;
    teMyDoc.custom_elems.ObtainChildByKey( "date_7" ).value = MyDate7;
    teMyDoc.custom_elems.ObtainChildByKey( "date_8" ).value = MyDate8;
    teMyDoc.custom_elems.ObtainChildByKey( "date_9" ).value = MyDate9;
    teMyDoc.custom_elems.ObtainChildByKey( "date_10" ).value = MyDate10;
    teMyDoc.custom_elems.ObtainChildByKey( "date_11" ).value = MyDate11;
    teMyDoc.custom_elems.ObtainChildByKey( "date_12" ).value = MyDate12;
    teMyDoc.custom_elems.ObtainChildByKey( "date_13" ).value = MyDate13;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_7" ).value = Edit7;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_8" ).value = Edit8;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_9" ).value = Edit9;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_10" ).value = Edit10;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_11" ).value = Edit11;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_12" ).value = Edit12;
    teMyDoc.custom_elems.ObtainChildByKey( "comment_13" ).value = Edit13;
    teMyDoc.custom_elems.ObtainChildByKey( "flag1" ).value = checkbox1;
    teMyDoc.custom_elems.ObtainChildByKey( "flag2" ).value = checkbox2;
    teMyDoc.custom_elems.ObtainChildByKey( "flag3" ).value = checkbox3;
    teMyDoc.custom_elems.ObtainChildByKey( "flag4" ).value = checkbox4;
    teMyDoc.custom_elems.ObtainChildByKey( "flag5" ).value = checkbox5;
    teMyDoc.custom_elems.ObtainChildByKey( "flag6" ).value = checkbox6;
    teMyDoc.custom_elems.ObtainChildByKey( "flag7" ).value = checkbox7;
    teMyDoc.custom_elems.ObtainChildByKey( "flag8" ).value = checkbox8;
    teMyDoc.custom_elems.ObtainChildByKey( "flag9" ).value = checkbox9;
    teMyDoc.custom_elems.ObtainChildByKey( "flag10" ).value = checkbox10;
    teMyDoc.custom_elems.ObtainChildByKey( "flag11" ).value = checkbox11;
    teMyDoc.custom_elems.ObtainChildByKey( "flag12" ).value = checkbox12;
    teMyDoc.custom_elems.ObtainChildByKey( "flag13" ).value = checkbox13;
    myDoc.Save();
    curDoc = myDoc;
}

check_combo( MyCombo1, MyDate1, curDoc, 1, custom_templates.object_data_type.items[2].sheets[0].title, qualification1 );
check_combo( MyCombo2, MyDate2, curDoc, 2, custom_templates.object_data_type.items[2].sheets[1].title, qualification2 );
check_combo( MyCombo3, MyDate3, curDoc, 3, custom_templates.object_data_type.items[2].sheets[2].title, qualification3 );
check_combo( MyCombo4, MyDate4, curDoc, 4, custom_templates.object_data_type.items[2].sheets[3].title, qualification4 );
check_combo( MyCombo5, MyDate5, curDoc, 5, custom_templates.object_data_type.items[2].sheets[4].title, qualification5 );
check_combo( MyCombo6, MyDate6, curDoc, 6, custom_templates.object_data_type.items[2].sheets[5].title, qualification6 );
check_combo( MyCombo7, MyDate7, curDoc, 7, custom_templates.object_data_type.items[2].sheets[6].title, qualification7 );
check_combo( MyCombo8, MyDate8, curDoc, 8, custom_templates.object_data_type.items[2].sheets[7].title, qualification8 );
check_combo( MyCombo9, MyDate9, curDoc, 9, custom_templates.object_data_type.items[2].sheets[8].title, qualification9 );
check_combo( MyCombo10, MyDate10, curDoc, 10, custom_templates.object_data_type.items[2].sheets[9].title, qualification10 );
check_combo( MyCombo11, MyDate11, curDoc, 11, custom_templates.object_data_type.items[2].sheets[10].title, qualification11 );
check_combo( MyCombo12, MyDate12, curDoc, 12, custom_templates.object_data_type.items[2].sheets[11].title, qualification12 );
check_combo( MyCombo13, MyDate13, curDoc, 13, custom_templates.object_data_type.items[2].sheets[12].title, qualification13 );

MESSAGE = '<span style="color:green;font-weight:bold">Сохранено</span>';