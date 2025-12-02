// 7007019280575171701
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7007019280575171701;
var loggerName = "report_7007019280575171701";

function log(text, arFlag, alFlag) {
    EnableLog('uni_catalog_list_menu_custom', true);

    if (arFlag == undefined || arFlag == false) {
        LogEvent('uni_catalog_list_menu_custom', text);
        if (alFlag != undefined || alFlag == true) alert(text);
    } else {
        LogEvent('uni_catalog_list_menu_custom', tools.object_to_text(text, 'json'));
        if (alFlag != undefined || alFlag == true) alert(tools.object_to_text(text, 'json'));
    }
}

docParentObject = tools.open_doc(parent_node_object_id);
docParentObjectCatalog = "";

if(docParentObject != undefined)
{
    docParentObjectCatalog = docParentObject.TopElem.Name;
}


catalog_name = "collaborator";

oSelected = tools.read_object( selected_data );
iSelectedCount = ArrayCount( oSelected );
sIdField = id_field_name == '' ? 'id' : id_field_name;
if ( iSelectedCount == 0 )
{
    try
    {
        if(oSelected != null && oSelected.HasProperty(sIdField))
        {
            // Передан одиночный объект (не массив)
            oSelected = [oSelected];
            iSelectedCount = ArrayCount(oSelected);
        }
    }
    catch(x)
    {
    }
}

oFirstSelect = ArrayOptFirstElem( oSelected );
arrResult = [];

function getOperations(sFieldId)
{
    if(sFieldId != "")
    {
        iIDField=OptInt(sFieldId,null)
        try
        {
            arrFuncManagers = tools.get_relative_boss_types( curUserID, iIDField );
            xarrCurOperations = tools.get_relative_operations( arrFuncManagers );
        }
        catch(x)
        {
            xarrCurOperations = new Array();
        }
        //Кастомные роли свойственные только по отношению выбранному объекту
        xarrBossTypes = tools.get_object_relative_boss_types(curUserID, iIDField);

        //Роли и операции свойственные только текущему объекту
        if(curObjectID != undefined && curObjectID != null)
        {
            xarrBossTypes = ArrayUnion( xarrBossTypes, tools.get_object_relative_boss_types(curUserID, curObjectID) );
            //xarrCurOperations = ArrayUnion( xarrCurOperations, tools.get_relative_operations_by_boss_types(xarrBossTypes) );
        }
        xarrCurOperations = ArrayUnion( xarrCurOperations, tools.get_relative_operations_by_boss_types(xarrBossTypes) );

        return ArraySelectDistinct(xarrCurOperations, 'id');
    }
    else
    {
        return new Array();
    }
}

if(oFirstSelect != undefined)
{
    sFirstSelectIdField = oFirstSelect.GetOptProperty( sIdField, undefined );
    iFirstSelectIdField = OptInt( sFirstSelectIdField );
    if ( iFirstSelectIdField == undefined )
    {
        RESULT = [];
        Cancel();
    }

    docFirstSelect = OpenDoc( UrlFromDocID( iFirstSelectIdField ) );
    docFirstSelectTE = docFirstSelect.TopElem;

    if ( iSelectedCount == 1 || calc_by_first == true)
    {
        xarrOperations = getOperations( iFirstSelectIdField )
    }
    else
    {
        function arrCrossId( arr1, arr2 )
        {
            return ArraySelect( arr1, "ArrayOptFindByKey(arr2,This.id,'id')!=undefined" );
        }

        xarrOperations = null;
        for ( oSelElem in oSelected )
        {
            xarrStepOperations = getOperations( oSelElem.GetOptProperty( sIdField, "" ) );
            if ( xarrOperations == null )
            {
                xarrOperations = xarrStepOperations;
            }
            else
            {
                xarrOperations = arrCrossId( xarrOperations, xarrStepOperations );
                if ( ArrayCount( xarrOperations ) == 0 )
                    break;
            }
        }
    }

    oParam = {
        "result_type": "xaml",
        "name_id": name_id,
        "source_type": source_type,
        "curUserID": curUserID,
        "curUser": curUser,
        "first_object_id": iFirstSelectIdField
    };

    if(source_type == null || source_type == "")
        source_type = catalog_name;
    for(catalog_name in String(source_type).split(","))
    {
        for ( catOperation in xarrOperations )
        {
            if ( catOperation.operation_type != 0 )
                continue;
            if ( catalog_name != "" && ArrayOptFind( String( catOperation.operation_catalog_list ).split( "," ), "This=='" + catalog_name + "'" ) == undefined )
                continue;
            if ( catOperation.use_access_eval )
            {
                teOperation = OpenDoc( UrlFromDocID( catOperation.id ) ).TopElem;
                if ( ! tools.safe_execution( teOperation.access_eval_code ) )
                    continue;
            }

            sClick = tools_web.eval_operation_script( catOperation.id, 'xaml', oParam );
            arrResult.push( { "title": ( '' + tools_web.get_cur_lng_name( catOperation.name, curLng.short_id ) ), "click": sClick } );
        }

        if ( ArrayOptFind( xarrOperations, "action=='show_custom_reports'||action=='show_all'" ) != undefined )
        {
            iCounter = 0;
            xarrCustomReport = XQuery( "for $elem in custom_reports where $elem/connect_2_object = '" + catalog_name + "' order by $elem/name return $elem" );
            for ( catCustomReportElem in xarrCustomReport )
                if ( tools_web.check_access( catCustomReportElem.id, curUserID, curUser, Request.Session ) )
                {
                    if ( iCounter == 0 )
                    {
                        arrResult.push( { "title": "-" } );
                        iCounter++
                    }
                    arrResult.push( { "title": ( tools_web.get_web_const( '7e1dwbst85', curLngWeb ) + ': ' + tools_web.get_cur_lng_name( catCustomReportElem.name, curLng.short_id ) ), "click": ( "OPENURL=" + tools_web.get_mode_clean_url( null, catCustomReportElem.id, { int_id: iFirstSelectIdField } ) ) } );
                }
        }

        switch ( catalog_name )
        {
            case "collaborator":
                if ( iSelectedCount == 1)
                {
                    if( iFirstSelectIdField != curUserID )
                    {
                        catChat = ArrayOptFirstElem( XQuery("for $elem in personal_chats where $elem/person_id=" + curUserID + " and $elem/partner_id=" + iFirstSelectIdField + " order by $elem/last_message_date descending return $elem") );
                        if(catChat != undefined)
                        {
                            if( !catChat.prohibited && !catChat.partner_prohibited)
                            {
                                arrResult.push( { "title": "-" } );
                                if( catChat.confirmed && catChat.partner_confirmed)
                                {
                                    if ( tools_web.check_session_user( Request, iFirstSelectIdField ) )
                                        arrResult.push( { "title": tools_web.get_web_const( 'poobshatsyavonla', curLngWeb ), "click": ( "OPENURL=" + tools_web.get_mode_clean_url( "personal_chat", null ) + "#" + iFirstSelectIdField ) } );
                                    arrResult.push( { "title": tools_web.get_web_const( 'napisatsoobshen', curLngWeb ), "click": ( "OPENURL=" + tools_web.get_mode_clean_url( "communication", iFirstSelectIdField ) ) } );
                                }
                            }
                        }
                        else
                        {
                            if(docFirstSelectTE.allow_personal_chat_request)
                            {
                                /*
                                sAction = "InviteUserAction" + name_id;
                                arrResult.push( { "title": tools_web.get_web_const( 'priglasitkobshe', curLngWeb ), "click": ( "SET=" + sAction + "/iUserId," + iFirstSelectIdField + ";SET=" + sAction + "/sAction,invite;ACTION=" + sAction + ";") } );
                                */
                                arrResult.push( { "title": "Отправить уведомление", "click": "SET=NotifPersonID,"+iFirstSelectIdField+";OPENDIALOG=DialogCreateCollaboratorNotification" } );
                            }
                        }
                    }
                }
                break;

            case "request":
                try
                {
                    curObject = docFirstSelectTE;
                    if ( ! curObject.workflow_id.HasValue )
                        break;

                    teWorkflow = OpenDoc( UrlFromDocID( curObject.workflow_id ) ).TopElem;

                    sSelectedObjectIDs = "";
                    if ( ArrayCount( oSelected ) > 1 )
                    {
                        arrSelected = ArraySelect( oSelected, "OptInt(This.GetOptProperty(" + CodeLiteral( sIdField ) + "))!=undefined" );
                        if ( ArrayCount( arrSelected ) > 1 )
                        {
                            arrSelected = ArrayRange( arrSelected, 1, ArrayCount( arrSelected ) );
                            sSelectedObjectIDs = ArrayMerge( arrSelected, "This.GetOptProperty(" + CodeLiteral( sIdField ) + ")", ";" );
                        }
                    }

                    iCounter = ArrayCount( arrResult ) == 0 ? 1 : 0;
                    for ( fldActionElem in teWorkflow.actions )
                    {
                        if ( tools.safe_execution( fldActionElem.condition_eval_str ) )
                        {
                            if ( ArrayOptFindByKey( fldActionElem.operations, 'set_workflow_custom_state', 'type' ) != undefined )
                                continue;

                            if ( iCounter == 0 )
                            {
                                arrResult.push( { "title": "-" } );
                                iCounter++
                            }
                            sAction = "WorckflowAction" + name_id;
                            arrResult.push( { "title": tools_web.get_cur_lng_name( fldActionElem.name.Value, curLng.short_id ), "click": ( "SET=" + sAction + "/object_id," + iFirstSelectIdField + ( sSelectedObjectIDs == "" ? "" : ";SET=" + sAction + "/selected_object_ids," + UrlEncode( sSelectedObjectIDs ) ) + ";SET=" + sAction + "/action_id," + fldActionElem.PrimaryKey + ";ACTION=" + sAction + ";" ) } );
                        }
                    }
                }
                catch ( err )
                {
                    alert( err );
                }
                break;
        }
        //if(ArrayCount(xarrOperations) > 0 || catalog_name == "collaborator")
        //arrResult.push( { "title": "-" } );
    }
    //if(ArrayCount(arrResult) > 0)
    //arrResult = ArrayRange(arrResult, 0, ArrayCount(arrResult) - 1);

    var aNewItems = [];

    arrResult.push({title: "Уволенный сотрудник", click: ("OPENDIALOG=DialogPersonSetDismissed" + name_id)});

    // if (docParentObjectCatalog == 'org')
    if (docFirstSelectTE.Name == 'collaborator')
    {

        var sCourseIdsFilter = ArrayMerge(ArrayUnion([{'course_id':0}], ArraySelectAll(tools.xquery('for $elem in active_learnings where $elem/person_id = ' + OptInt(iFirstSelectIdField, 0) + ' and $elem/state_id != 1 and $elem/state_id != 2 return $elem/course_id'))), 'This.course_id', '\,');
        arrResult.push({title: "Отмена назначения", click: "SET=SelectedCourseIDsFilter,"+sCourseIdsFilter+";SET=SelectedOrgPersonID,"+iFirstSelectIdField+";OPENDIALOG=DialogDeleteAssignedCourse"});
    }

    if(curUser.access.access_role == 'OrganizingTrainerRCK' || curUser.access.access_role == 'organizer') {
        arrResult = ArraySelect(arrResult, "This.title != 'Пригласить к общению' && This.title != 'Отправить уведомление'");

        aNewItems = [
            {title: "Добавить в группу", click: "OPENDIALOG=DialogAddToGroup"},
            {title: "Удалить из группы", click: "OPENDIALOG=DialogRemoveFromGroup"}
        ];
    }

    if(curUser.access.access_role == 'fck') {
        arrResult = ArraySelect(arrResult, "This.title != 'Пригласить к общению' && This.title != 'Отправить уведомление'");

        aNewItems = [
            {title: "Назначить курс ФЦК", click: "OPENDIALOG=DialogActivateHiddenCourse"}
        ];
    }

    if(ArrayOptFirstElem(XQuery("for $elem in func_managers where $elem/person_id = " + curUserID + " and $elem/boss_type_id = 7158147030098137646 and $elem/object_id = " + docFirstSelectTE.org_id + " return $elem")) != undefined) {
        arrResult = ArraySelect(arrResult, "This.title != 'Пригласить к общению' && This.title != 'Отправить уведомление'");

        aNewItems = [
            {title: "Добавить в группу", click: "OPENDIALOG=DialogAddCustomizedOrderGroup"},
            {title: "Удалить из группы", click: "OPENDIALOG=DialogRemoveCustomizedOrderGroup"},
        ];

        if(docParentObjectCatalog == 'group')
        {
            aNewItems.push({title: "Назначить электронный курс", click: "OPENDIALOG=DialogActivateCustomizedOrderCourse"});
            // aNewItems.push({title: "Завершить электронный курс", click: "OPENDIALOG=DialogDeactivateCustomizedOrderCourse"});
            // aNewItems.push({title: "Отмена назначения", click: "SET=SelectedOrgPersonID,"+iFirstSelectIdField+";OPENDIALOG=DialogDeleteAssignedCustomizedOrderCourse"});
        }
    }
}

RESULT = ArrayUnion(arrResult, aNewItems);