//7057483934904380681
function certificate ( _MyDate, _curDoc, i, _str ) {
    docCertificate = tools.create_certificate_to_person( object_id, certificate_type_id )
    docCertificate.TopElem.serial = "ВТ"
    docCertificate.TopElem.delivery_date = _MyDate
    docCertificate.TopElem.custom_elems.ObtainChildByKey( "programm_name" ).value = _str
    docCertificate.TopElem.custom_elems.ObtainChildByKey( "object_data" ).value = _curDoc.DocID
    docCertificate.Save()
    _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value = docCertificate.DocID
    if( _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
        _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false
        tools.create_notification( "cert_vn_tr_print", object_id, _str, docCertificate.DocID )
    }
    _curDoc.Save()
}
function check_date( _MyCombo, _MyDate, _str ) {
    if ( _MyCombo == "Сертифицировать" && OptDate( _MyDate ) == undefined ) {
        ERROR = 1
        MESSAGE = "Заполните Дату в " + _str
        Cancel()
    }
}
function check_combo( _MyCombo, _MyDate, _curDoc, i, _str ) {
    if ( _MyCombo == "Сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey( "certificate_" + i ).value == '' ) {
        _str = String( _str )
        _str = StrContains( _str, "«" ) && StrContains( _str, "»" ) ? StrRangePos( _str, _str.indexOf("«")+2, _str.indexOf("»") ) : _str
        certificate( _MyDate, _curDoc, i, _str )
    }
    if ( _MyCombo == "Не сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value ) {
        _str = String( _str )
        _str = StrContains( _str, "«" ) && StrContains( _str, "»" ) ? StrRangePos( _str, _str.indexOf("«")+2, _str.indexOf("»") ) : _str
        _curDoc.TopElem.custom_elems.ObtainChildByKey( "flag" + i ).value = false
        _curDoc.Save()
        tools.create_notification( "cert_vn_tr_cancel", object_id, _str )
    }
}

var certificate_type_id = 7057492735637724805 // Сертификат внутренних тренеров
var cert_object_data_type_id = 7057466522817022402 // Сертификация внутренних тренеров силами ФЦК
object_id = OptInt( object_id )

check_date( MyCombo1, MyDate1, custom_templates.object_data_type.items[1].sheets[0].title )
check_date( MyCombo2, MyDate2, custom_templates.object_data_type.items[1].sheets[1].title )
check_date( MyCombo3, MyDate3, custom_templates.object_data_type.items[1].sheets[2].title )
check_date( MyCombo4, MyDate4, custom_templates.object_data_type.items[1].sheets[3].title )
check_date( MyCombo5, MyDate5, custom_templates.object_data_type.items[1].sheets[4].title )
check_date( MyCombo6, MyDate6, custom_templates.object_data_type.items[1].sheets[5].title )
check_date( MyCombo7, MyDate7, custom_templates.object_data_type.items[1].sheets[6].title )
check_date( MyCombo8, MyDate8, custom_templates.object_data_type.items[1].sheets[7].title )
check_date( MyCombo9, MyDate9, custom_templates.object_data_type.items[1].sheets[8].title )
check_date( MyCombo10, MyDate10, custom_templates.object_data_type.items[1].sheets[9].title )
check_date( MyCombo11, MyDate11, custom_templates.object_data_type.items[1].sheets[10].title )

//sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " and $elem/sec_object_id=" + curUserID + " return $elem"
sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " return $elem"

foundObjectData = ArrayOptFirstElem( XQuery( sXQ ) )
if ( foundObjectData == undefined ) {
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
    teNewDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1
    teNewDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2
    teNewDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3
    teNewDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4
    teNewDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5
    teNewDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6
    teNewDoc.custom_elems.ObtainChildByKey( "result_7" ).value = MyCombo7
    teNewDoc.custom_elems.ObtainChildByKey( "result_8" ).value = MyCombo8
    teNewDoc.custom_elems.ObtainChildByKey( "result_9" ).value = MyCombo9
    teNewDoc.custom_elems.ObtainChildByKey( "result_10" ).value = MyCombo10
    teNewDoc.custom_elems.ObtainChildByKey( "result_11" ).value = MyCombo11
    teNewDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1
    teNewDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2
    teNewDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3
    teNewDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4
    teNewDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5
    teNewDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6
    teNewDoc.custom_elems.ObtainChildByKey( "date_7" ).value = MyDate7
    teNewDoc.custom_elems.ObtainChildByKey( "date_8" ).value = MyDate8
    teNewDoc.custom_elems.ObtainChildByKey( "date_9" ).value = MyDate9
    teNewDoc.custom_elems.ObtainChildByKey( "date_10" ).value = MyDate10
    teNewDoc.custom_elems.ObtainChildByKey( "date_11" ).value = MyDate11
    teNewDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1
    teNewDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2
    teNewDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3
    teNewDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4
    teNewDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5
    teNewDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6
    teNewDoc.custom_elems.ObtainChildByKey( "comment_7" ).value = Edit7
    teNewDoc.custom_elems.ObtainChildByKey( "comment_8" ).value = Edit8
    teNewDoc.custom_elems.ObtainChildByKey( "comment_9" ).value = Edit9
    teNewDoc.custom_elems.ObtainChildByKey( "comment_10" ).value = Edit10
    teNewDoc.custom_elems.ObtainChildByKey( "comment_11" ).value = Edit11
    teNewDoc.custom_elems.ObtainChildByKey( "flag1" ).value = checkbox1
    teNewDoc.custom_elems.ObtainChildByKey( "flag2" ).value = checkbox2
    teNewDoc.custom_elems.ObtainChildByKey( "flag3" ).value = checkbox3
    teNewDoc.custom_elems.ObtainChildByKey( "flag4" ).value = checkbox4
    teNewDoc.custom_elems.ObtainChildByKey( "flag5" ).value = checkbox5
    teNewDoc.custom_elems.ObtainChildByKey( "flag6" ).value = checkbox6
    teNewDoc.custom_elems.ObtainChildByKey( "flag7" ).value = checkbox7
    teNewDoc.custom_elems.ObtainChildByKey( "flag8" ).value = checkbox8
    teNewDoc.custom_elems.ObtainChildByKey( "flag9" ).value = checkbox9
    teNewDoc.custom_elems.ObtainChildByKey( "flag10" ).value = checkbox10
    teNewDoc.custom_elems.ObtainChildByKey( "flag11" ).value = checkbox11
    newDoc.Save()
    curDoc = newDoc
} else {
    myDoc = tools.open_doc( foundObjectData.id )
    teMyDoc = myDoc.TopElem
    teMyDoc.custom_elems.ObtainChildByKey( "result_1" ).value = MyCombo1
    teMyDoc.custom_elems.ObtainChildByKey( "result_2" ).value = MyCombo2
    teMyDoc.custom_elems.ObtainChildByKey( "result_3" ).value = MyCombo3
    teMyDoc.custom_elems.ObtainChildByKey( "result_4" ).value = MyCombo4
    teMyDoc.custom_elems.ObtainChildByKey( "result_5" ).value = MyCombo5
    teMyDoc.custom_elems.ObtainChildByKey( "result_6" ).value = MyCombo6
    teMyDoc.custom_elems.ObtainChildByKey( "result_7" ).value = MyCombo7
    teMyDoc.custom_elems.ObtainChildByKey( "result_8" ).value = MyCombo8
    teMyDoc.custom_elems.ObtainChildByKey( "result_9" ).value = MyCombo9
    teMyDoc.custom_elems.ObtainChildByKey( "result_10" ).value = MyCombo10
    teMyDoc.custom_elems.ObtainChildByKey( "result_11" ).value = MyCombo11
    teMyDoc.custom_elems.ObtainChildByKey( "date_1" ).value = MyDate1
    teMyDoc.custom_elems.ObtainChildByKey( "date_2" ).value = MyDate2
    teMyDoc.custom_elems.ObtainChildByKey( "date_3" ).value = MyDate3
    teMyDoc.custom_elems.ObtainChildByKey( "date_4" ).value = MyDate4
    teMyDoc.custom_elems.ObtainChildByKey( "date_5" ).value = MyDate5
    teMyDoc.custom_elems.ObtainChildByKey( "date_6" ).value = MyDate6
    teMyDoc.custom_elems.ObtainChildByKey( "date_7" ).value = MyDate7
    teMyDoc.custom_elems.ObtainChildByKey( "date_8" ).value = MyDate8
    teMyDoc.custom_elems.ObtainChildByKey( "date_9" ).value = MyDate9
    teMyDoc.custom_elems.ObtainChildByKey( "date_10" ).value = MyDate10
    teMyDoc.custom_elems.ObtainChildByKey( "date_11" ).value = MyDate11
    teMyDoc.custom_elems.ObtainChildByKey( "comment_1" ).value = Edit1
    teMyDoc.custom_elems.ObtainChildByKey( "comment_2" ).value = Edit2
    teMyDoc.custom_elems.ObtainChildByKey( "comment_3" ).value = Edit3
    teMyDoc.custom_elems.ObtainChildByKey( "comment_4" ).value = Edit4
    teMyDoc.custom_elems.ObtainChildByKey( "comment_5" ).value = Edit5
    teMyDoc.custom_elems.ObtainChildByKey( "comment_6" ).value = Edit6
    teMyDoc.custom_elems.ObtainChildByKey( "comment_7" ).value = Edit7
    teMyDoc.custom_elems.ObtainChildByKey( "comment_8" ).value = Edit8
    teMyDoc.custom_elems.ObtainChildByKey( "comment_9" ).value = Edit9
    teMyDoc.custom_elems.ObtainChildByKey( "comment_10" ).value = Edit10
    teMyDoc.custom_elems.ObtainChildByKey( "comment_11" ).value = Edit11
    teMyDoc.custom_elems.ObtainChildByKey( "flag1" ).value = checkbox1
    teMyDoc.custom_elems.ObtainChildByKey( "flag2" ).value = checkbox2
    teMyDoc.custom_elems.ObtainChildByKey( "flag3" ).value = checkbox3
    teMyDoc.custom_elems.ObtainChildByKey( "flag4" ).value = checkbox4
    teMyDoc.custom_elems.ObtainChildByKey( "flag5" ).value = checkbox5
    teMyDoc.custom_elems.ObtainChildByKey( "flag6" ).value = checkbox6
    teMyDoc.custom_elems.ObtainChildByKey( "flag7" ).value = checkbox7
    teMyDoc.custom_elems.ObtainChildByKey( "flag8" ).value = checkbox8
    teMyDoc.custom_elems.ObtainChildByKey( "flag9" ).value = checkbox9
    teMyDoc.custom_elems.ObtainChildByKey( "flag10" ).value = checkbox10
    teMyDoc.custom_elems.ObtainChildByKey( "flag11" ).value = checkbox11
    myDoc.Save()
    curDoc = myDoc
}

check_combo( MyCombo1, MyDate1, curDoc, 1, custom_templates.object_data_type.items[1].sheets[0].title )
check_combo( MyCombo2, MyDate2, curDoc, 2, custom_templates.object_data_type.items[1].sheets[1].title )
check_combo( MyCombo3, MyDate3, curDoc, 3, custom_templates.object_data_type.items[1].sheets[2].title )
check_combo( MyCombo4, MyDate4, curDoc, 4, custom_templates.object_data_type.items[1].sheets[3].title )
check_combo( MyCombo5, MyDate5, curDoc, 5, custom_templates.object_data_type.items[1].sheets[4].title )
check_combo( MyCombo6, MyDate6, curDoc, 6, custom_templates.object_data_type.items[1].sheets[5].title )
check_combo( MyCombo7, MyDate7, curDoc, 7, custom_templates.object_data_type.items[1].sheets[6].title )
check_combo( MyCombo8, MyDate8, curDoc, 8, custom_templates.object_data_type.items[1].sheets[7].title )
check_combo( MyCombo9, MyDate9, curDoc, 9, custom_templates.object_data_type.items[1].sheets[8].title )
check_combo( MyCombo10, MyDate10, curDoc, 10, custom_templates.object_data_type.items[1].sheets[9].title )
check_combo( MyCombo11, MyDate11, curDoc, 11, custom_templates.object_data_type.items[1].sheets[10].title )

MESSAGE = '<span style="color:green;font-weight:bold">Сохранено</span>';