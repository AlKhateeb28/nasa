// 6859359773849356007
if(LdsIsClient){
    arrSelected = OBJECTS_ID_STR.split(";");
//	arrSelected = '6758780577176115205';
    alert("Введите ИНН организации");
    try{
        dlgDoc = OpenDoc( 'x-local://wtv/wtv_dlg_new_object.xml' );
        dlgDoc.TopElem.title = "Введите ИНН целевой организации в системе";
        ActiveScreen.ModalDlg( dlgDoc );
        sOrgINN = Trim(dlgDoc.TopElem.object_name);
        alert("sOrgINN = " + sOrgINN);
    }catch(err){
        alert("В процессе выполнения агента произошла ошибка.");
        Cancel();
    };
    if (sOrgINN!="") {
        try{
            iOrgID = ArrayOptFirstElem(XQuery("for $elem in orgs where $elem/code="+XQueryLiteral(sOrgINN)+" return $elem/id")).id;
            for (key in arrSelected){
                //docEdtDoc = OpenDoc(UrlFromDocID(Int(6758780577176115205)));
                docEdtDoc = OpenDoc(UrlFromDocID(Int(key)));
                docEdtDoc.TopElem.org_id = iOrgID;
                docEdtDoc.Save();

                //alert('iOrgID = ' + iOrgID);
            };
        }catch(err){
            alert("В процессе выполнения произошла ошибка. Проверьте поле ИНН.");
        };
    }else{
        alert("Поле ИНН не может быть пустым");
        Cancel();
    };
}else{
    alert("Агент предназначен для выполнения на стороне клиента.")
};