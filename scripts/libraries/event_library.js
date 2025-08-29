/**
 * @typedef {import('./classes_library').integer} integer
 */
/**
 * @typedef {import('./classes_library').int} int
 */
/**
 * @typedef {import('./classes_library').real} real
 */
/**
 * @typedef {import('./classes_library').datetime} datetime
 */
/**
 * @typedef {import('./classes_library').bool} bool
 */
/**
 * @typedef {import('./classes_library').object} object
 */
/**
 * @typedef {import('./classes_library').display_form} display_form
 */
/**
 * @typedef {import('./classes_library').select_object} select_object
 */
/**
 * @typedef {import('./classes_library').XmDoc} XmDoc
 */
/**
 * @typedef {import('./classes_library').XmElem} XmElem
 */
/**
 * @typedef {import('./classes_library').oCollectionParam} oCollectionParam
 */
/**
 * @typedef {import('./classes_library').oSimpleFilterElem} oSimpleFilterElem
 */
/**
 * @typedef {import('./classes_library').oPaging} oPaging
 */
/**
 * @typedef {import('./classes_library').oSort} oSort
 */
/**
 * @typedef {import('./classes_library').oSimpleEntrisElem} oSimpleEntrisElem
 */
/**
 * @typedef {import('./classes_library').oSimpleElem} oSimpleElem
 */
/**
 * @typedef {import('./classes_library').oDispRole} oDispRole
 */
/**
 * @typedef {import('./classes_library').FormField} FormField
 */
/**
 * @typedef {import('./classes_library').FormButton} FormButton
 */
/**
 * @typedef {import('./classes_library').WTLPEForm} WTLPEForm
 */
/**
 * @typedef {import('./classes_library').WTLPEFormResult} WTLPEFormResult
 */
/**
 * @typedef {import('./classes_library').oSimpleResult} oSimpleResult
 */
/**
 * @typedef {import('./classes_library').oSimpleResultCount} oSimpleResultCount
 */
/**
 * @typedef {import('./classes_library').oSimpleResultParagraph} oSimpleResultParagraph
 */
/**
 * @typedef {import('./classes_library').oSimpleRAResult} oSimpleRAResult
 */


function AddCondition( FilterConditions, Field, Value, OptionType )
{
    //fldFilterConditions = CreateElem( "x-local://wtv/wtv_general.xmd", "view_conditions_base.conditions" );
    _child = FilterConditions.AddChild();
    _child.field = Field;
    _child.value = Value;
    _child.option_type = OptionType;
    return FilterConditions;
}

function get_object_link( sObjectName, iObjectID )
{
    /*catExt = common.exchange_object_types.GetOptChildByKey( sObjectName );
	if( catExt != undefined && catExt.web_template.HasValue )
	{
		return catExt.web_template + "&object_id=" + iObjectID;
	}*/
    return tools_web.get_mode_clean_url( null, iObjectID );
}

function get_object_image_url( catElem )
{
    switch( catElem.Name )
    {
        case "collaborator" :
            return tools_web.get_object_source_url( 'person', catElem.id );
        default:
        {
            if( catElem.ChildExists( "resource_id" ) && catElem.resource_id.HasValue )
            {
                return tools_web.get_object_source_url( 'resource', catElem.resource_id );
            }
        }

    }

    return "/images/" + catElem.Name + ".png";
}
/**
 * @namespace Websoft.WT.Event
 */
/**
 * @typedef {Object} oPaging
 * @property {boolean} MANUAL
 * @property {?int} INDEX
 * @property {?int} SIZE
 * @property {?int} TOTAL
 */
/**
 * @typedef {Object} oSort
 * @property {?string} FIELD
 * @property {?string} DIRECTION
 */

/**
 * @typedef {Object} oSimpleFilterElem
 * @memberof Websoft.WT.Event
 * @property {string} id
 * @property {string} type
 * @property {string} value
 */

/**
 * @typedef {Object} oEvent
 * @property {bigint} id
 * @property {string} code
 * @property {string} name
 * @property {string} type_name
 * @property {string} status_id
 * @property {string} status_name
 * @property {string} education_org_name
 * @property {boolean} is_open
 * @property {date} start_date
 * @property {date} finish_date
 * @property {number} person_num
 * @property {string} image_url
 * @property {string} link
 */
/**
 * @typedef {Object} WTEducationMethodEventResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEvent[]} array
 */
/**
 * @function GetEducationMethodEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка мероприятий по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {bigint} iCurUserID - ID пользователя
 * @param {boolean} [bShowOnlyFutureEvents=false] - показывать только будущие мероприятия
 * @param {boolean} [bUseTimezone=false] - учитывать таймзоны
 * @returns {WTEducationMethodEventResult}
 */
function GetEducationMethodEvents( iEducationMethodID, iCurUserID, bShowOnlyFutureEvents, arrStatuses, bUseTimezone )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        if( bShowOnlyFutureEvents == undefined || bShowOnlyFutureEvents == null )
            throw '';
        bShowOnlyFutureEvents = tools_web.is_true( bShowOnlyFutureEvents );
    }
    catch( ex )
    {
        bShowOnlyFutureEvents = false;
    }
    try
    {
        if( bUseTimezone == undefined || bUseTimezone == null || bUseTimezone == "" )
        {
            throw "error";
        }
        bUseTimezone = tools_web.is_true( bUseTimezone );
    }
    catch( ex )
    {
        bUseTimezone = false;
    }

    var catDefaultTimezone = null;
    var catUserTimezone = null;
    curUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
    if( bUseTimezone )
    {
        catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
        catUserTimezone = tools_web.get_timezone( iCurUserID, curUser );
        catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
    }

    var _date_str = "";
    if( bShowOnlyFutureEvents )
        _date_str = " and $elem/start_date > date('" + Date() + "')";

    var _status_conds = "";
    if ( ArrayOptFirstElem(arrStatuses) != undefined )
        _status_conds = " and MatchSome($elem/status_id, ('" + ArrayMerge(arrStatuses, "This", "','") + "'))";

    var array = XQuery( 'for $elem in events where $elem/education_method_id = ' + iEducationMethodID + _date_str + _status_conds + ' order by $elem/start_date return $elem' );
    if ( curUser.access.access_role != 'admin' )
    {
        curUserEventArray = XQuery( 'for $elem in event_collaborators where $elem/collaborator_id = ' + iCurUserID + _date_str + ' return $elem' );
        curLectorEventArray = XQuery( 'for $elem in event_lectors where $elem/person_id = ' + iCurUserID + _date_str + ' return $elem' );
        array = ArraySelect( array, 'is_public || ArrayOptFind(curUserEventArray,\'event_id==\'+PrimaryKey)!=undefined || ArrayOptFind(curLectorEventArray,\'event_id==\'+PrimaryKey)!=undefined' );
    }

    oRes.array = get_list_events( array, { bGetImage: true, bGetUrl : true, bUseTimezone: bUseTimezone, catDefaultTimezone: catDefaultTimezone, catUserTimezone: catUserTimezone } );
    return oRes
}
/**
 * @typedef {Object} oKnowledgePart
 * @property {bigint} id
 * @property {string} name
 * @property {string} desc
 * @property {string} class
 */
/**
 * @typedef {Object} WTKnowledgePartResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oKnowledgePart[]} array – массив
 */
/**
 * @function GetEduMethodKnowledgeParts
 * @memberof Websoft.WT.Event
 * @description Получения списка значений карты знаний учебной программы.
 * @param {bigint} iEduMethodID - ID объекта
 * @param {bigint} iCurUserID - ID пользователя
 * @param {boolean} [bShowOnlyAcknowledgement=true] - показывать только подтвержденные значения
 * @returns {WTKnowledgePartResult}
 */
function GetEduMethodKnowledgeParts( iEduMethodID, iCurUserID, bShowOnlyAcknowledgement )
{
    return tools.call_code_library_method( 'libMain', 'GetObjectKnowledgeParts', [ iEduMethodID, iCurUserID, bShowOnlyAcknowledgement ] );
}

/**
 * @typedef {Object} WTResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 */
/**
 * @function AddPersonToEventBase
 * @memberof Websoft.WT.Event
 * @description Добавление сотрудника в мероприятие ( tools.add_person_to_event ).
 * @param {bigint} iPersonIDParam - ID сотрудника
 * @param {bigint} iEventIDParam - ID мероприятия
 * @param {bigint} [iEducationPlanIDParam=null] - ID плана обучения
 * @param {bigint} [iRequestPersonIDParam=null] - ID инициатора заявки
 * @param {bigint} [iRequestIDParam=null] - ID заявки
 * @returns {WTResult} oResult
 */
function AddPersonToEventBase( iPersonIDParam, iEventIDParam, iEducationPlanIDParam, iRequestPersonIDParam, iRequestIDParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };
    try
    {
        iPersonIDParam = Int( iPersonIDParam );
        tePersonParam = OpenDoc( UrlFromDocID( iPersonIDParam ) ).TopElem;
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }
    try
    {
        iEventIDParam = Int( iEventIDParam );
        docEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    try
    {
        iEducationPlanIDParam = OptInt( iEducationPlanIDParam, null );
    }
    catch( ex )
    {
        iEducationPlanIDParam = null;
    }
    try
    {
        iRequestPersonIDParam = OptInt( iRequestPersonIDParam, null );
    }
    catch( ex )
    {
        iRequestPersonIDParam = null;
    }
    try
    {
        iRequestIDParam = OptInt( iRequestIDParam, null );
    }
    catch( ex )
    {
        iRequestIDParam = null;
    }

    return AddPersonToEventXmd( {
        'iEventID': iEventIDParam,
        'docEvent': docEventParam,
        'iPersonID': iPersonIDParam,
        'tePerson': tePersonParam,
        'iEducationPlanID': iEducationPlanIDParam,
        'iRequestPersonID': iRequestPersonIDParam,
        'iRequestID': iRequestIDParam,
        'bDoObtain': false,
        'bDoFilling': true,
        'bDoSave': true,
        'bCreateEventResult': true,
        'bSendNotification': true
    } );
}

function AddPersonToEvent( iPersonIDParam, iEventIDParam, tePersonParam, docEventParam, iEducationPlanIDParam, iRequestPersonIDParam, iRequestIDParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };
    try
    {
        iPersonIDParam = Int( iPersonIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }
    try
    {
        tePersonParam.Name;
    }
    catch( ex )
    {
        try
        {
            tePersonParam = OpenDoc( UrlFromDocID( iPersonIDParam ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre' ), false )
            return oResult;
        }
    }
    try
    {
        iEventIDParam = Int( iEventIDParam );

    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    try
    {
        docEvent.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEvent = OpenDoc( UrlFromDocID( iEventIDParam ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }
    try
    {
        iEducationPlanIDParam = OptInt( iEducationPlanIDParam, null );
    }
    catch( ex )
    {
        iEducationPlanIDParam = null;
    }
    try
    {
        iRequestPersonIDParam = OptInt( iRequestPersonIDParam, null );
    }
    catch( ex )
    {
        iRequestPersonIDParam = null;
    }
    try
    {
        iRequestIDParam = OptInt( iRequestIDParam, null );
    }
    catch( ex )
    {
        iRequestIDParam = null;
    }


    return AddPersonToEventXmd( {
        'iEventID': iEventIDParam,
        'docEvent': docEvent,
        'iPersonID': iPersonIDParam,
        'tePerson': tePersonParam,
        'iEducationPlanID': iEducationPlanIDParam,
        'iRequestPersonID': iRequestPersonIDParam,
        'iRequestID': iRequestIDParam,
        'bDoObtain': false,
        'bDoFilling': true,
        'bDoSave': true,
        'bCreateEventResult': true,
        'bSendNotification': true
    } );
}

function AddPersonToEventXmd( oInputParam )
{
    /*
	функция добавления сотрудника в мероприятия
	Входные параметры
	oInputParam - объект с полями
		iEventID	- ID мероприятия
		docEvent	- карточка мероприятия
		iPersonID	- ID сотрудника
		tePerson	- TopElem карточки сотрудника
		iEducationPlanID	- ID плана обучения
		iRequestPersonID	- ID инициатора заявки
		iRequestID	- ID заявки
		bDoObtain	- обновлять данные по сотруднику в мероприятии
		bDoFilling	- обновлять данные сотрудника в мероприятии
		bDoSave		- сохранять мероприятие
		bCreateEventResult	- созлавать результат мероприятия
		bSendNotification	- отправлять уведомление сотруднику
		bSaveInEvent	- добавлять сотрудника в карточку мероприятие
*/
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };
    try
    {
        oInputParam;
    }
    catch ( err )
    {
        oInputParam = {};
    }
    arrParamNames = Array('iPersonID','tePerson','iEducationPlanID','iRequestPersonID','iRequestID','bDoObtain','bDoFilling','bDoSave','bCreateEventResult','bSendNotification','bSaveInEvent','bGuestLogin');
    arrParamValues = Array(null,null,null,null,null,false,true,true,true,true,true,false);
    for ( i=0; i < arrParamNames.length; i++ )
    {
        sParamName = arrParamNames[ i ];
        if ( ! oInputParam.HasProperty( sParamName ) )
            oInputParam.SetProperty( sParamName, arrParamValues[ i ] );
    }

    try
    {
        iEventID = Int( oInputParam.iEventID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    try
    {
        if( oInputParam.HasProperty( "docEvent" ) )
            docEvent = oInputParam.docEvent;
        docEvent.TopElem
    }
    catch( ex )
    {
        try
        {
            docEvent = OpenDoc( UrlFromDocID( iEventID ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }

    teEvent = docEvent.TopElem;
    var feEventType = teEvent.event_type_id.OptForeignElem;
    if(oInputParam.bSaveInEvent)
    {
        if ( oInputParam.bDoObtain != true && teEvent.collaborators.ChildByKeyExists( oInputParam.iPersonID ) )
        {
            oResult.result = false;
            return oResult;
        }

        if ( oInputParam.tePerson == null && ( oInputParam.bDoFilling || oInputParam.bCreateEventResult ) )
            oInputParam.tePerson = OpenDoc( UrlFromDocID( oInputParam.iPersonID ) ).TopElem;

        fldPersonChild = teEvent.collaborators.ObtainChildByKey( oInputParam.iPersonID );
        if ( oInputParam.bDoFilling == true )
            tools.common_filling( 'collaborator', fldPersonChild, oInputParam.iPersonID, oInputParam.tePerson );

        if( feEventType != undefined )
        {
            fldPersonChild.can_use_camera = feEventType.can_use_camera;
            fldPersonChild.can_use_microphone = feEventType.can_use_microphone;
        }

        if ( oInputParam.iEducationPlanID != null )
            fldPersonChild.education_plan_id = oInputParam.iEducationPlanID;

        if ( oInputParam.iRequestPersonID != null && ! fldPersonChild.request_person_id.HasValue )
            fldPersonChild.request_person_id = oInputParam.iRequestPersonID;
    }

    if( teEvent.is_room )
    {
        if(oInputParam.bSaveInEvent)
        {
            if ( oInputParam.bDoSave == true )
            {
                tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEvent ] );
            }
        }
        return oResult;
    }

    try
    {
        oParam = new Object();
        oParam.docEvent = docEvent;
        oParam.iEventId = docEvent.DocID;
        oParam.iUserId = oInputParam.iPersonID;
        //oResultMethod = teEvent.call_webinar_system_method('onUserAdd',oParam);
        oResultMethod = tools.call_webinar_system_method( teEvent.webinar_system_id, "onUserAdd", oParam );
        if( oResultMethod.error != 0 )
        {
            return oResultMethod;
        }
    }
    catch(ex){}
    if(oInputParam.bSaveInEvent)
    {
        if ( oInputParam.bDoSave == true )
        {
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEvent ] );
        }
    }
    docEventResult=null;
    if ( oInputParam.bCreateEventResult == true )
    {
        catEventResult = ArrayOptFirstElem(XQuery('for $elem in event_results where $elem/event_id='+ iEventID +' and $elem/person_id=' + oInputParam.iPersonID + ' return $elem'));
        if(catEventResult == undefined)
        {
            docEventResult = OpenNewDoc( 'x-local://wtv/wtv_event_result.xmd' );
            docEventResult.TopElem.event_id = iEventID;
            docEventResult.TopElem.person_id = oInputParam.iPersonID;
            tools.common_filling( 'event', docEventResult.TopElem, iEventID, teEvent );
            tools.common_filling( 'collaborator', docEventResult.TopElem, oInputParam.iPersonID, oInputParam.tePerson );
            tools.admin_access_copying( '', docEventResult.TopElem, '', teEvent );
            docEventResult.TopElem.guest = oInputParam.bGuestLogin;

            if( oInputParam.GetOptProperty( "bEventResultAssist" ) != undefined )
            {
                docEventResult.TopElem.is_assist = tools_web.is_true( oInputParam.GetOptProperty( "bEventResultAssist" ) );
            }
            else if( feEventType != undefined && feEventType.online )
            {
                docEventResult.TopElem.is_assist = false;
            }
            docEventResult.BindToDb( DefaultDb );
            docEventResult.Save();
            oResult.docEventResult = docEventResult;

            ms_tools.raise_system_event_env( 'common_event_add_participant', {
                'curSystemEventObjectID': iEventID,
                'iEventId': iEventID,
                'curUser': tools.get_cur_user(),
                'curUserID': tools.get_cur_user_id(),
                'iUserId': oInputParam.iPersonID,
                'docEventResult': docEventResult
            } );
        }
        else
        {
            oResult.docEventResult = OpenDoc(UrlFromDocID(catEventResult.id));
        }
    }

    if ( oInputParam.bSendNotification == true && teEvent.status_id != 'close' && teEvent.status_id != 'cancel' && teEvent.status_id != 'project' )
    {
        if (teEvent.event_settings.send_type=='adding')
        {
            if (teEvent.event_settings.send_collaborators)
            {
                if (docEventResult==null)
                {
                    try
                    {
                        docEventResult=OpenDoc( UrlFromDocID( ArrayFirstElem(XQuery('for $elem in event_results where $elem/event_id='+ iEventID +' and  $elem/person_id='+oInputParam.iPersonID+' return $elem')).id))
                    }
                    catch(ex)
                    {
                    }
                }

                if (docEventResult!=null)
                {
                    docEventResult.TopElem.last_sending_date = Date();
                    docEventResult.Save();
                }
                tools.create_notification( '23', oInputParam.iPersonID, teEvent.name, iEventID, null, teEvent, null, docEventResult );
            }

            if (teEvent.event_settings.send_bosses)
            {
                tools.create_notification( '25', oInputParam.iPersonID, teEvent.name, iEventID, null, teEvent  );
            }
        }
    }

    oResult.result = true;
    return oResult;
}

/**
 * @function DeletePersonFromEventBase
 * @memberof Websoft.WT.Event
 * @description Удаление сотрудника из мероприятия ( tools.del_person_from_event ).
 * @param {bigint} iPersonIDParam - ID сотрудника
 * @param {bigint} iEventIDParam - ID мероприятия
 * @returns {WTResult} oResult
 */
function DeletePersonFromEventBase( iPersonIDParam, iEventIDParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };
    try
    {
        iPersonIDParam = Int( iPersonIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }
    try
    {
        iEventIDParam = Int( iEventIDParam );
        docEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    return DeletePersonFromEventXmd( {
        'iEventID': iEventIDParam,
        'docEvent': docEventParam,
        'iPersonID': iPersonIDParam,
        'bDoSave': true,
        'bSendNotification': true
    } );

}
function DeletePersonFromEvent( iPersonIDParam, iEventIDParam, docEventParam, bDoSave )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };
    try
    {
        iPersonIDParam = Int( iPersonIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }

    try
    {
        iEventIDParam = Int( iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    try
    {
        docEventParam.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }
    try
    {
        if( bDoSave == undefined || bDoSave == null )
            throw '';
        bDoSave = tools_web.is_true( bDoSave );
    }
    catch( ex )
    {
        bDoSave = true;
    }
    return DeletePersonFromEventXmd( {
        'iEventID': iEventIDParam,
        'docEvent': docEventParam,
        'iPersonID': iPersonIDParam,
        'bDoSave': bDoSave,
        'bSendNotification': true
    } );

}

function DeletePersonFromEventXmd( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };

    try
    {
        oInputParam;
    }
    catch ( err )
    {
        oInputParam = {};
    }
    arrParamNames = Array('iPersonID','bDoSave','iEventResultId','bSendNotification');
    arrParamValues = Array(null,true,null,true);
    for ( i=0; i < arrParamNames.length; i++ )
    {
        sParamName = arrParamNames[ i ];
        if ( ! oInputParam.HasProperty( sParamName ) )
            oInputParam.SetProperty( sParamName, arrParamValues[ i ] );
    }
    try
    {
        iEventID = Int( oInputParam.iEventID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    try
    {
        docEventParam = oInputParam.docEvent;
        docEventParam.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEventParam = OpenDoc( UrlFromDocID( iEventID ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }

    try
    {
        oParam = new Object();
        oParam.docEvent = docEventParam;
        oParam.iUserId = oInputParam.iPersonID;
        oParam.iEventId = docEventParam.DocID;
        //TopElem.call_webinar_system_method('onUserRemove',oParam);
        oResult = tools.call_webinar_system_method( docEventParam.TopElem.webinar_system_id, "onUserRemove", oParam );
        if( oResult.error != 0 )
        {
            return oResult;
        }
    }
    catch(ex){}


    fldPersonChild = docEventParam.TopElem.collaborators.GetOptChildByKey( oInputParam.iPersonID );
    if ( fldPersonChild == undefined )
    {
        if(oInputParam.iEventResultId == null)
        {
            oResult.result = false;
            return oResult;
        }
    }
    else
    {
        fldPersonChild.Delete();
    }

    if ( oInputParam.bDoSave )
        docEventParam.Save();

    ms_tools.raise_system_event_env( 'common_event_delete_participant', {
        'curSystemEventObjectID': iEventID,
        'iEventId': iEventID,
        'curUser': tools.get_cur_user(),
        'curUserID': tools.get_cur_user_id(),
        'iUserId': oInputParam.iPersonID
    } );

    if(oInputParam.iEventResultId == null)
    {
        xarrEventResults = XQuery( 'for $elem in event_results where $elem/person_id = ' + oInputParam.iPersonID + ' and $elem/event_id = ' + iEventID + ' return $elem' );
        for ( catEventResultElem in xarrEventResults )
            try
            {
                DeleteDoc( UrlFromDocID( catEventResultElem.PrimaryKey ) );
            }
            catch ( err )
            {
                alert( err );
            }
    }
    else
    {
        DeleteDoc( UrlFromDocID( oInputParam.iEventResultId ) );
    }

    if ( oInputParam.bSendNotification == true && docEventParam.TopElem.status_id != 'close' && docEventParam.TopElem.status_id != 'cancel' && docEventParam.TopElem.status_id != 'project' )
    {
        if (docEventParam.TopElem.event_settings.send_type=='adding')
        {
            if (docEventParam.TopElem.event_settings.send_collaborators)
            {
                tools.create_notification( '24', oInputParam.iPersonID, docEventParam.TopElem.name, iEventID, null, docEventParam.TopElem );
            }
        }
    }

    oResult.result = true;
    return oResult;

}

/**
 * @function ActivateTestToEventBase
 * @memberof Websoft.WT.Event
 * @description Назначение теста участникам мероприятия ( tools.activate_test_to_event ).
 * @param {bigint} iEventIDParam - ID мероприятия
 * @param {bigint} iTestIDParam - ID назначаемого теста
 * @param {number} [iDurationParam] - продолжительность обучения
 * @param {date} [dStartLearningDate] - дата начала обучения
 * @param {date} [dLastLearningDate] - дата окончания обучения
 * @param {string} [sTypeAction] - тип назначения
 * @param {boolean} [bSkipDismissed] - не назначать уволенным сотрудникам
 * @returns {WTResult} oResult
 */
function ActivateTestToEventBase( iEventIDParam, iTestIDParam, iDurationParam, dStartLearningDate, dLastLearningDate, sTypeAction, bSkipDismissed )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };
    try
    {
        iTestIDParam = Int( iTestIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_2' ), false )
        return oResult;
    }
    try
    {
        iEventIDParam = Int( iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    return ActivateTestToEvent( {
        'iEventIDParam': iEventIDParam,
        'iTestIDParam': iTestIDParam,
        'iDurationParam': iDurationParam,
        'dStartLearningDate': dStartLearningDate,
        'dLastLearningDate': dLastLearningDate,
        'sTypeAction': sTypeAction,
        'bSkipDismissed': bSkipDismissed
    } );

}
function ActivateTestToEvent( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };

    try
    {
        iTestIDParam = Int( oInputParam.iTestIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_2' ), false )
        return oResult;
    }
    try
    {
        teAssessment = oInputParam.teAssessment;
        teAssessment.Name;
    }
    catch( ex )
    {
        try
        {
            teAssessment = OpenDoc( UrlFromDocID( iTestIDParam ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_2' ), false )
            return oResult;
        }
    }
    try
    {
        iEventIDParam = Int( oInputParam.iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    try
    {
        iDurationParam = OptInt( oInputParam.GetOptProperty( "iDurationParam" ), null );
    }
    catch(err)
    {
        iDurationParam = null;
    }
    try
    {
        dStartLearningDate = Date( oInputParam.GetOptProperty( "dStartLearningDate" ) );
    }
    catch(err)
    {
        dStartLearningDate = null;
    }
    try
    {
        dLastLearningDate = Date( oInputParam.GetOptProperty( "dLastLearningDate" ) );
    }
    catch(err)
    {
        dLastLearningDate = '';
    }
    try
    {
        sActTypeParam = oInputParam.GetOptProperty( "sActTypeParam" )
        if( sActTypeParam == undefined || sActTypeParam == null )
            throw '';
    }
    catch ( err )
    {
        sActTypeParam = 'all';
    }
    try
    {
        if( bSkipDismissed == undefined || bSkipDismissed == null )
            throw '';
        bSkipDismissed = tools_web.is_true( bSkipDismissed );
    }
    catch ( err )
    {
        bSkipDismissed = false;
    }
    switch ( sActTypeParam )
    {
        case 'post':
            arrPersonIDs = ArrayExtract( XQuery( 'for $elem in event_results where $elem/event_id = ' + iEventIDParam + '  and $elem/is_assist = true() return $elem' ), 'person_id' );
            break;

        default:
            arrPersonIDs = ArrayExtract( XQuery( 'for $elem in event_results where $elem/event_id = ' + iEventIDParam + ' return $elem' ), 'person_id' );
            break;
    }

    _counter = 0;
    for ( iPersonIDElem in arrPersonIDs )
        try
        {
            oRes = tools.activate_test_to_person( ({
                'iPersonID': iPersonIDElem,
                'iAssessmentID': iTestIDParam,
                'teAssessment': teAssessment,
                'iEventID': iEventIDParam,
                'iDuration': iDurationParam,
                'dtStartLearningDate': dStartLearningDate,
                'dtLastLearningDate': dLastLearningDate,
                'iGroupID': null,
                'bSkipDismissed': bSkipDismissed
            }) ).TopElem;
            if(OptInt(oRes) == undefined)
                _counter++;
        }
        catch ( err )
        {
        }
    oResult.count = _counter;
    return oResult;
}
/**
 * @function ActivateCourseToEventBase
 * @memberof Websoft.WT.Event
 * @description Назначение курса участникам мероприятия ( tools.activate_course_to_event ).
 * @param {bigint} iEventIDParam - ID мероприятия
 * @param {bigint} iCourseIDParam - ID назначаемого курса
 * @param {number} [iDurationParam] - продолжительность обучения
 * @param {date} [dStartLearningDate] - дата начала обучения
 * @param {date} [dLastLearningDate] - дата окончания обучения
 * @returns {WTResult} oResult
 */
function ActivateCourseToEventBase( iEventIDParam, iCourseIDParam, iDurationParam, dStartLearningDate, dLastLearningDate )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };
    try
    {
        iCourseIDParam = Int( iCourseIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_3' ), false )
        return oResult;
    }
    try
    {
        iEventIDParam = Int( iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }
    return ActivateCourseToEvent( {
        'iEventIDParam': iEventIDParam,
        'iCourseIDParam': iCourseIDParam,
        'iDurationParam': iDurationParam,
        'dStartLearningDate': dStartLearningDate,
        'dLastLearningDate': dLastLearningDate
    } );

}
function ActivateCourseToEvent( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };

    try
    {
        iCourseIDParam = Int( oInputParam.iCourseIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_3' ), false )
        return oResult;
    }
    try
    {
        iEventIDParam = Int( oInputParam.iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    try
    {
        iDurationParam = OptInt( oInputParam.GetOptProperty( "iDurationParam" ), null );
    }
    catch(err)
    {
        iDurationParam = null;
    }
    try
    {
        dStartLearningDate = Date( oInputParam.GetOptProperty( "dStartLearningDate" ) );
    }
    catch(err)
    {
        dStartLearningDate = null;
    }
    try
    {
        dLastLearningDate = Date( oInputParam.GetOptProperty( "dLastLearningDate" ) );
    }
    catch(err)
    {
        dLastLearningDate = '';
    }

    arrPersonIDs = ArrayExtract( XQuery( 'for $elem in event_collaborators where $elem/event_id = ' + iEventIDParam + '  and $elem/is_collaborator = true() return $elem' ), 'collaborator_id' );

    _counter = 0;
    for ( _person_id in arrPersonIDs )
        try
        {
            tools.activate_course_to_person( _person_id, iCourseIDParam, iEventIDParam, null, null, iDurationParam, dStartLearningDate, dLastLearningDate ).TopElem;
            _counter++;
        }
        catch ( ff )
        {
            //alert(ff)
        }
    oResult.count = _counter;
    return oResult;
}

/**
 * @function ActivateEducationProgramToPersonBase
 * @memberof Websoft.WT.Event
 * @description Назначение набора программ сотруднику ( tools.activate_education_program_to_person ).
 * @param {bigint} iEducationProgramIDParam - ID набора программ
 * @param {bigint} iPersonIDParam - ID сотрудника
 * @returns {WTResult} oResult
 */
function ActivateEducationProgramToPersonBase( iEducationProgramIDParam, iPersonIDParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };
    try
    {
        iEducationProgramIDParam = Int( iEducationProgramIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_4' ), false )
        return oResult;
    }
    try
    {
        iPersonIDParam = Int( iPersonIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }
    return ActivateEducationProgramToPerson( {
        'iEducationProgramIDParam': iEducationProgramIDParam,
        'iPersonIDParam': iPersonIDParam
    } );

}
function ActivateEducationProgramToPerson( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };

    try
    {
        iEducationProgramIDParam = Int( oInputParam.iEducationProgramIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_4' ), false )
        return oResult;
    }
    try
    {
        iPersonIDParam = Int( oInputParam.iPersonIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false )
        return oResult;
    }

    try
    {
        tePerson = oInputParam.tePerson;
        tePerson.Name;
    }
    catch( ex )
    {
        try
        {
            tePerson = OpenDoc( UrlFromDocID( iPersonIDParam ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre' ), false )
            return oResult;
        }
    }
    try
    {
        teEducationProgram = oInputParam.teEducationProgram;
        teEducationProgram.Name;
    }
    catch( ex )
    {
        try
        {
            teEducationProgram = OpenDoc( UrlFromDocID( iEducationProgramIDParam ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_4' ), false )
            return oResult;
        }
    }

    successCounter = 0;
    for ( _education_method in teEducationProgram.education_methods )
        try
        {
            educationMethodCatalog = _education_method.PrimaryKey.ForeignElem;
            if ( educationMethodCatalog.type == 'course' && educationMethodCatalog.course_id.HasValue )
                try
                {
                    res = tools.activate_course_to_person( iPersonIDParam, educationMethodCatalog.course_id, null, tePerson );
                    res.TopElem;
                    successCounter++;
                }
                catch ( err2 )
                {
                }
        }
        catch ( err )
        {
        }
    oResult.count = successCounter;
    return oResult;
}

/**
 * @function SetStatusEventBase
 * @memberof Websoft.WT.Event
 * @description Обновления статуса мероприятия.
 * @param {bigint} iEventIDParam - ID мероприятия
 * @param {string} sNewStatusParam - новый статус
 * @param {boolean} bSendNotificationsParam - уотправлять уведомления
 * @returns {WTResult} oResult
 */
function SetStatusEventBase( iEventIDParam, sNewStatusParam, bSendNotificationsParam )
{
    return SetStatusEvent( {
        'iEventIDParam': iEventIDParam,
        'sNewStatusParam': sNewStatusParam,
        'bSendNotificationsParam': bSendNotificationsParam,
    } );

}
function SetStatusEvent( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };

    try
    {
        iEventIDParam = Int( oInputParam.iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    sNewStatusParam = oInputParam.sNewStatusParam;

    try
    {
        docEventParam = oInputParam.docEventParam;
        docEventParam.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }

    oScreenParam = oInputParam.GetOptProperty( "oScreenParam" )

    teEvent = docEventParam.TopElem;
    sOldStatus = teEvent.status_id.Value;
    teEvent.status_id = sNewStatusParam;
    try
    {
        bSendNotificationsParam = oInputParam.bSendNotificationsParam;
        if( bSendNotificationsParam == undefined || bSendNotificationsParam == null )
            throw '';
    }
    catch(x)
    {
        bSendNotificationsParam = true;
    }
    var feEventType = teEvent.event_type_id.OptForeignElem;
    switch ( sNewStatusParam )
    {
        case 'active':
        {
            for ( fldPerson in teEvent.collaborators )
            {
                if( teEvent.course_id.HasValue )
                {
                    docLearning = tools.activate_course_to_person( fldPerson.PrimaryKey, teEvent.course_id, fldPerson );
                    try
                    {
                        docLearning.DocID;
                    }
                    catch ( wer )
                    {
                        docLearning = OpenDoc( UrlFromDocID( docLearning ) );
                    }
                    _event = docLearning.TopElem.events.ObtainChildByKey( iEventId );
                    docLearning.Save();
                }
                if ( fldPerson.education_plan_id.HasValue )
                    try
                    {
                        docEducationPlan = OpenDoc( UrlFromDocID( fldPerson.education_plan_id ) );

                        try
                        {
                            _program = ArrayFind( docEducationPlan.TopElem.programs, 'type==\'event\' && object_id==iEventId' );
                            if ( _program.state_id == 0 )
                            {
                                _program.state_id = 1;
                                docEducationPlan.Save();
                            }
                        }
                        catch ( hjk )
                        {
                        }
                    }
                    catch ( vv )
                    {
                        if ( !LdsIsServer && oScreenParam != undefined )
                            oScreenParam.MsgBox( ms_tools.get_const('0yzvhpdp54') + fldPerson.person_fullname + '.', ms_tools.get_const('c_error'), 'error', 'ok' );
                        else
                            alert(ms_tools.get_const('0yzvhpdp54') + fldPerson.person_fullname + '.');
                    }
            }
            var feWebinarSystem = teEvent.webinar_system_id.HasValue ? teEvent.webinar_system_id.OptForeignElem : undefined;
            if( !teEvent.conversation_id.HasValue && ( teEvent.use_vclass || ( feEventType != undefined && feEventType.online && feWebinarSystem != undefined && ( feWebinarSystem.code == 'vclass3' || feWebinarSystem.code == "vclass4" ) ) ) )
            {
                oResCreateVclassSetting = CallServerMethod( "tools", "call_code_library_method", [ "libEducation", "CreateVclassSetting", [ iEventIDParam, teEvent.name.Value, teEvent.code.Value ] ] );
                teEvent.vclass_setting_id = oResCreateVclassSetting.vclass_setting_id;
                teEvent.conversation_id = oResCreateVclassSetting.conversation_id;
            }
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEventParam ] );
            ms_tools.raise_system_event( 'common_start_event', null, iEventIDParam, docEventParam );
            break;
        }
        case 'close':
        {
            for ( fldPerson in teEvent.collaborators )
            {
                arrEventResults = XQuery( 'for $event_result in event_results where $event_result/event_id = ' + iEventIDParam + ' and  $event_result/person_id = ' + fldPerson.collaborator_id + ' return $event_result' );

                if ( ArrayOptFirstElem( arrEventResults ) != undefined)
                {
                    curResult = ArrayFirstElem( arrEventResults );
                }
                else if( !teEvent.is_room )
                {
                    docResult = OpenNewDoc( 'x-local://wtv/wtv_event_result.xmd' );
                    docResult.BindToDb( DefaultDb );
                    docResult.TopElem.person_id = fldPerson.collaborator_id;
                    docResult.TopElem.event_id = iEventIDParam;
                    docResult.TopElem.AssignElem( fldPerson );
                    docResult.TopElem.doc_info.Clear();
                    tools.common_filling( 'event', docResult.TopElem, iEventIDParam, teEvent );
                    docResult.BindToDb( DefaultDb );
                    docResult.Save();

                    curResult = docResult.TopElem;
                }

                if( teEvent.course_id != null && curResult.score != null )
                {
                    docLearning = tools.activate_course_to_person( fldPerson.PrimaryKey, teEvent.course_id, fldPerson );
                    try
                    {
                        docLearning.DocID;
                    }
                    catch ( wer )
                    {
                        docLearning = OpenDoc( UrlFromDocID( docLearning ) );
                    }
                    fldEvent = docLearning.TopElem.events.ObtainChildByKey( iEventId );
                    fldEvent.score = curResult.score;
                    docLearning.Save();
                }

                if( fldPerson.education_plan_id != null )
                    try
                    {
                        teCommand = OpenDocFromStr( tools.xml_header() + '<queue_code_library/>' ).TopElem;
                        teCommand.AddChild( 'type', 'string' ).Value = 'call_method';
                        teCommand.AddChild( 'method', 'string' ).Value = 'update_education_plan';
                        teCommand.AddChild( 'library', 'string' ).Value = 'libEducation';
                        teCommand.AddChild( 'params', 'string' ).Value = EncodeJson( [ fldPerson.education_plan_id.Value, null, fldPerson.collaborator_id.Value ] );
                        teCommand.AddChild( 'start_date', 'string' ).Value = StrDate( DateOffset( Date(), 60 ), true, true );
                        tools.put_message_in_queue( 'code-library-queue', teCommand.GetXml( { 'tabs': false } ) );
                    }
                    catch ( ff )
                    {
                        if ( !LdsIsServer && oScreenParam!= undefined )
                            oScreenParam.MsgBox( StrReplace( ms_tools.get_const('ge6tsvb9dv'), '{PARAM1}', fldPerson.person_fullname ), ms_tools.get_const('c_error'), 'error', 'ok' );
                        else
                            alert( ff )
                    }
            }
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEventParam ] );
            ms_tools.raise_system_event_env( 'common_finish_event', {
                'curSystemEventObjectID': iEventIDParam,
                'iEventId': iEventIDParam,
                'docEvent': docEventParam,
                'curUser': tools.get_cur_user(),
                'curUserID': tools.get_cur_user_id()
            } );

            break;
        }
        case 'plan':
        {
            if (sOldStatus =='project' && bSendNotificationsParam)
            {
                SendNotificationsEvent( {
                    'iEventIDParam': iEventIDParam,
                    'sSendTypeParam': "all",
                    'docEventParam': docEventParam
                } );
            }
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEventParam ] );
            break;
        }
        default:
        {
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEventParam ] );
            break;
        }
    }

    if( feEventType != undefined && feEventType.online && teEvent.webinar_system_id.HasValue && teEvent.webinar_system_id.OptForeignElem != undefined)
    {
        try
        {
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEventParam ] );
        }
        catch(ex){}
        oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "onEventStatusChanged", { docEvent: docEventParam, iEventId: iEventIDParam, sOldStatus: sOldStatus } );
        var catConversation = ArrayOptFirstElem( XQuery( "for $elem in conversations where $elem/active_object_id = " + iEventIDParam + " return $elem" ) );
        if( catConversation != undefined )
        {
            CallServerMethod( 'tools', 'call_code_library_method', [ "libChat", "update_conversation_data", [ catConversation.id.Value, null, null, true ] ] )
        }
    }

    ms_tools.raise_system_event_env( 'common_event_status_change', {
        'curSystemEventObjectID': iEventIDParam,
        'iEventId': iEventIDParam,
        'docEvent': docEventParam,
        'curUser': tools.get_cur_user(),
        'curUserID': tools.get_cur_user_id(),
        'sNewStatus': sNewStatusParam,
        'sOldStatus': sOldStatus
    } );
    oResult.result = true;
    return oResult;
}

/**
 * @function SendNotificationsEventBase
 * @memberof Websoft.WT.Event
 * @description Рассылка уведомлений по мероприятию.
 * @param {bigint} iEventIDParam - ID мероприятия
 * @param {string} sSendTypeParam - тип рассылки уведомлений
 * @returns {WTResult} oResult
 */
function SendNotificationsEventBase( iEventIDParam, sSendTypeParam )
{
    return SendNotificationsEvent( {
        'iEventIDParam': iEventIDParam,
        'sSendTypeParam': sSendTypeParam
    } );

}
function SendNotificationsEvent( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'result': false
    };

    try
    {
        iEventIDParam = Int( oInputParam.iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    try
    {
        sSendTypeParam = oInputParam.sSendTypeParam;
        if( sSendTypeParam == undefined || sSendTypeParam == null || sSendTypeParam == "" )
            throw '';
    }
    catch(ex)
    {
        sSendTypeParam = "all"
    }

    try
    {
        docEventParam = oInputParam.docEventParam;
        docEventParam.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }
    if (docEventParam.TopElem.event_settings.send_type=='adding' || sSendTypeParam == 'custom')
    {
        if (docEventParam.TopElem.event_settings.send_collaborators||docEventParam.TopElem.event_settings.send_bosses)
        {
            for ( _collaborator in docEventParam.TopElem.collaborators )
            {
                if (sSendTypeParam!='not_send')
                {
                    if (docEventParam.TopElem.event_settings.send_collaborators)
                    {
                        arrCollaborResults = XQuery( 'for $elem in event_results where $elem/event_id = ' + iEventIDParam + ' and $elem/person_id='+_collaborator.PrimaryKey+' return $elem' );
                        if (sSendTypeParam =='new')
                        {
                            try
                            {
                                arrNotifResults = ArraySelect(arrCollaborResults,'Date(last_sending_date)<= Date(\''+Date()+'\')')
                            }
                            catch(ex)
                            {
                                arrNotifResults = Array()
                            }

                            if (ArrayOptFirstElem(arrNotifResults)!=undefined)
                            {
                                continue;
                            }
                        }

                        try
                        {
                            curResult=ArrayOptFirstElem(arrCollaborResults)
                            if (curResult!=undefined)
                            {
                                docEventResult=OpenDoc( UrlFromDocID( curResult.id ) )
                                docEventResult.TopElem.last_sending_date = Date();
                                docEventResult.Save();
                            }
                        }
                        catch(ex)
                        {
                        }
                        tools.create_notification( '23', _collaborator.PrimaryKey, docEventParam.TopElem.name, iEventIDParam, null, docEventParam.TopElem, null, docEventResult );
                    }
                }
                if (docEventParam.TopElem.event_settings.send_bosses)
                {
                    tools.create_notification( '25', _collaborator.PrimaryKey, docEventParam.TopElem.name, iEventIDParam, null, docEventParam.TopElem );
                }
            }
        }

        if (docEventParam.TopElem.event_settings.send_tutors)
        {
            for( _tutor in docEventParam.TopElem.tutors )
                tools.create_notification( '51', _tutor.collaborator_id, '', iEventIDParam, null, docEventParam.TopElem );
        }

        if (docEventParam.TopElem.event_settings.send_event_preparations)
        {
            for( _even_preparation in docEventParam.TopElem.even_preparations )
                tools.create_notification( '53', _even_preparation.person_id, '', iEventIDParam, null, docEventParam.TopElem );
        }

        if (docEventParam.TopElem.event_settings.send_lectors)
        {
            for( _person in docEventParam.TopElem.lectors )
                tools.create_notification( '55', _person.lector_id, '', iEventIDParam, null, docEventParam.TopElem );
        }
    }

    oResult.result = true;
    return oResult;
}

/**
 * @function CreateResultsEventBase
 * @memberof Websoft.WT.Event
 * @description Создание результатов мероприятия.
 * @param {bigint} iEventIDParam - ID мероприятия
 * @returns {WTResult} oResult
 */
function CreateResultsEventBase( iEventIDParam )
{
    return CreateResultsEvent( {
        'iEventIDParam': iEventIDParam
    } );

}
function CreateResultsEvent( oInputParam )
{
    function set_error( iError, sErrorText, bResult )
    {
        oResult.error = iError;
        oResult.errorText = sErrorText;
        oResult.result = bResult;
    }
    oResult = { 'error': 0,
        'errorText': '',
        'count': '',
        'result': false
    };

    try
    {
        iEventIDParam = Int( oInputParam.iEventIDParam );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_1' ), false )
        return oResult;
    }

    try
    {
        sSendTypeParam = oInputParam.sSendTypeParam;
        if( sSendTypeParam == undefined || sSendTypeParam == null || sSendTypeParam == "" )
            throw '';
    }
    catch(ex)
    {
        sSendTypeParam = "all"
    }

    try
    {
        teEventParam = oInputParam.teEventParam;
        teEventParam.Name;
    }
    catch( ex )
    {
        try
        {
            teEventParam = OpenDoc( UrlFromDocID( iEventIDParam ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_1' ), false )
            return oResult;
        }
    }

    _counter = 0;
    _del_counter = 0;
    eventResultArray = XQuery( 'for $elem in event_results where $elem/event_id = ' + iEventIDParam + ' return $elem' );
    if( teEventParam.is_room )
    {
        for ( _event_result in eventResultArray )
            try
            {
                DeleteDoc( UrlFromDocID( _event_result.PrimaryKey ) );
            }
            catch ( err )
            {
                alert( err );
            }
        oResult.result = true;
        return oResult;
    }

    teEventParam.view.result_array = eventResultArray;

    var feEventType = teEventParam.event_type_id.OptForeignElem;
    var bOnline = feEventType != undefined && feEventType.online;
    if ( teEventParam.collaborators.ChildNum )
    {
        for ( _collaborator in teEventParam.collaborators )
            if ( ArrayOptFind( eventResultArray, 'person_id==_collaborator.PrimaryKey' ) == undefined )
            {
                docEventResult = OpenNewDoc( 'x-local://wtv/wtv_event_result.xmd' );
                docEventResult.TopElem.event_id = iEventIDParam;
                docEventResult.TopElem.person_id = _collaborator.PrimaryKey;

                tools.common_filling( 'event', docEventResult.TopElem, iEventIDParam, teEventParam );
                tools.common_filling( 'collaborator', docEventResult.TopElem, docEventResult.TopElem.person_id );
                //docEventResult.TopElem.AssignElem( _collaborator );
                //copy group
                tools.admin_access_copying('', docEventResult.TopElem, '', teEventParam );
                docEventResult.BindToDb( DefaultDb );

                if( bOnline )
                    docEventResult.TopElem.is_assist = false;


                if ( teEventParam.status_id != 'close' && teEventParam.status_id != 'cancel' && teEventParam.status_id != 'project')
                {
                    if (teEventParam.event_settings.send_type=='adding')
                    {
                        if (teEventParam.event_settings.send_collaborators)
                        {
                            docEventResult.TopElem.last_sending_date = Date();
                            docEventResult.Save();
                            tools.create_notification( '23', _collaborator.PrimaryKey, teEventParam.name, iEventIDParam, null, teEventParam, null, docEventResult );
                        }
                        else
                        {
                            docEventResult.Save();
                        }

                        if (teEventParam.event_settings.send_bosses)
                        {
                            tools.create_notification( '25', _collaborator.PrimaryKey, teEventParam.name, iEventIDParam, null, teEventParam );
                        }
                    }
                    else
                    {
                        docEventResult.Save();
                    }
                }
                else
                {
                    docEventResult.Save();
                }

                ms_tools.raise_system_event_env( 'common_event_add_participant', {
                    'curSystemEventObjectID': iEventIDParam,
                    'iEventId': iEventIDParam,
                    'curUser': tools.get_cur_user(),
                    'curUserID': tools.get_cur_user_id(),
                    'iUserId': _collaborator.PrimaryKey,
                    'docEventResult': docEventResult
                } );
                _counter++;
            }
    }
    var _evres;
    var arrForDelete = new Array();
    for ( _evres in eventResultArray )
    {
        if ( ! teEventParam.collaborators.ChildByKeyExists( _evres.person_id ) )
        {
            if ( teEventParam.status_id != 'close' && teEventParam.status_id != 'cancel'  && teEventParam.status_id != 'project')
            {
                if (teEventParam.event_settings.send_type=='adding')
                {
                    if (teEventParam.event_settings.send_collaborators)
                    {
                        tools.create_notification( '24', _evres.person_id, teEventParam.name, iEventIDParam, null, teEventParam );
                    }
                }
            }

            try
            {
                ms_tools.raise_system_event_env( 'common_event_delete_participant', {
                    'curSystemEventObjectID': iEventIDParam,
                    'iEventId': iEventIDParam,
                    'curUser': tools.get_cur_user(),
                    'curUserID': tools.get_cur_user_id(),
                    'iUserId': _evres.person_id
                } );

                try
                {
                    if( teEventParam.webinar_system_id.HasValue )
                    {
                        oParam = new Object();
                        oParam.docEvent = teEventParam.Doc;
                        oParam.iUserId = _evres.person_id.Value;
                        oParam.iEventId = iEventIDParam;
                        oResult = tools.call_webinar_system_method( teEventParam.webinar_system_id, "onUserRemove", oParam );
                        if( oResult.error != 0 )
                        {
                            throw oResult.message;
                        }
                    }
                }
                catch(ex){}
                //DeleteDoc( UrlFromDocID( _event_result.PrimaryKey ) );
                arrForDelete.push( _evres.id.Value )
                _del_counter++;
            }
            catch ( err )
            {
                alert( err );
            }
        }
    }
    var _evres_id
    for( _evres_id in arrForDelete )
        try
        {
            DeleteDoc( UrlFromDocID( _evres_id ) );
        }
        catch ( err )
        {
            alert( err );
        }
    teEventParam.view.collaborators.AssignElem( teEventParam.collaborators );
    if ( _counter != 0 || _del_counter != 0 )
    {
        eventResultArray = XQuery( 'for $elem in event_results where $elem/event_id = ' + iEventIDParam + ' return $elem' );
        teEventParam.view.result_array = eventResultArray;
    }

    if ( teEventParam.view.last_distribute_cost_type != teEventParam.distribute_cost_type )
    {
        switch ( teEventParam.distribute_cost_type )
        {
            case 'person':
                teEventParam.cost_centers.Clear();
                break;

            case 'cost_center':
                for ( _event_result in eventResultArray )
                {
                    docEventResult = OpenDoc( UrlFromDocID( _event_result.id ) );
                    docEventResult.TopElem.expense_items.Clear();
                    docEventResult.Save();
                }
                break;
        }
    }

    oResult.count = _counter;
    oResult.result = true;
    return oResult;
}

/**
 * @typedef {Object} WTEventParticipantResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {EventResult[]} array
 */
/**
 * @typedef {Object} EventResult
 * @property {bigint} event_result_id
 * @property {bigint} person_id
 * @property {string} person_fullname
 * @property {string} person_position_name
 * @property {boolean} is_confirm
 * @property {boolean} is_assist
 * @property {string} link
 * @property {string} pict_url
 */
/**
 * @function GetEventParticipants
 * @memberof Websoft.WT.Event
 * @description Получения списка участников мероприятия.
 * @param {bigint} iEventID - ID мероприятия
 * @param {bigint} iCurUserID - ID пользователя
 * @param {boolean} [bShowAllSub=false] - показывать всех сотрудников
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTEventParticipantResult[]}
 */
function GetEventParticipants( iEventID, iCurUserID, bShowAllSub, bShowDismiss )
{
    return get_event_articipants( iEventID, null, iCurUserID, null, bShowAllSub, bShowDismiss )
}
function get_event_articipants( iEventID, teEvent, iCurUserID, curUser, bShowAllSub, bShowDismiss )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    var oResArray = new Array();
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        curUser.Name;
    }
    catch( ex )
    {
        try
        {
            curUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        if( bShowAllSub == undefined || bShowAllSub == null )
            throw '';
        bShowAllSub = tools_web.is_true( bShowAllSub );
    }
    catch( ex )
    {
        bShowAllSub = false;
    }
    try
    {
        if( bShowDismiss == undefined || bShowDismiss == null )
            throw '';
        bShowDismiss = tools_web.is_true( bShowDismiss );
    }
    catch( ex )
    {
        bShowDismiss = false;
    }
    function CheckRights(sAction)
    {
        return (ArrayOptFind(xarrOperationsRights, "This.action == '" + sAction + "'") !=undefined);
    }

    xarrBossTypes = tools.get_object_relative_boss_types( iCurUserID, iEventID );
    xarrBossTypes = ArrayUnion( xarrBossTypes, XQuery( "for $elem in boss_types where $elem/code = 'current_user' return $elem" ) )
    xarrOperations = tools.get_relative_operations_by_boss_types(xarrBossTypes);
    xarrOperations = ArraySelect(xarrOperations, "This.operation_catalog_list.HasValue && ( StrContains(','+This.operation_catalog_list.Value+',', ',event,') || StrContains(','+This.operation_catalog_list.Value+',', ',event_result,'))");
    xarrOperationsRights = ArraySelect(xarrOperations, "This.operation_type == 1");

    if( !CheckRights( "event_view_collaborators_tab_right" ) && !teEvent.disp_persons_for_all )
    {
        return oRes;
    }
    xarrEventResults = XQuery( "for $i in event_results where $i/event_id = " + iEventID + " order by $i/person_fullname return $i" );

    if( !bShowAllSub )
    {
        arrPersonID = tools.get_sub_person_ids_by_func_manager_id( iCurUserID )
        xarrEventResults = ArrayIntersect( xarrEventResults, arrPersonID, "This.person_id", "This" );
    }
    if( !bShowDismiss )
    {
        xarrCollabs = XQuery( "for $elem in collaborators where $elem/is_dismiss = false() and MatchSome( $elem/id, ( " + ArrayMerge( xarrEventResults, "This.person_id", "," ) + " ) ) return $elem/Fields( 'id' )" );
        xarrEventResults = ArrayIntersect( xarrEventResults, xarrCollabs, "This.person_id", "This.id" );
    }

    var arrExistsPerson = []
    for( _elem in xarrEventResults )
    {
        if(arrExistsPerson.indexOf(_elem.person_id.Value) >= 0)
            continue;
        else
            arrExistsPerson.push(_elem.person_id.Value);

        obj = new Object();
        obj.id = _elem.id.Value;
        obj.person_id = _elem.person_id.Value;
        obj.person_fullname = _elem.person_fullname.Value;
        obj.person_position_name = _elem.person_position_name.Value;
        obj.is_confirm = _elem.is_confirm.Value;
        obj.is_assist = _elem.is_assist.Value;
        obj.link = get_object_link( "collaborator", _elem.person_id );
        obj.pict_url = tools_web.get_object_source_url( 'person', _elem.person_id );
        oResArray.push( obj );
    }
    oRes.array = oResArray;
    return oRes;
}

/**
 * @typedef {Object} oLector
 * @property {bigint} id
 * @property {string} name
 * @property {string} image_url
 * @property {string} link
 */
/**
 * @typedef {Object} WTLectorResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oLector[]} array – массив
 */
/**
 * @function GetEventLectors
 * @memberof Websoft.WT.Event
 * @description Получения списка преподавателей по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTLectorResult}
 */
function GetEventLectors( iEventID, bShowDismiss )
{
    return tools.call_code_library_method( 'libMain', 'get_object_lectors', [ iEventID, null, bShowDismiss ] );
}

/**
 * @typedef {Object} oCollaborator
 * @property {bigint} id
 * @property {string} fullname
 * @property {string} position_name
 * @property {string} position_parent_name
 * @property {string} org_name
 * @property {string} image_url
 * @property {string} link
 */
/**
 * @typedef {Object} WTTutorResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oCollaborator[]} array – массив
 */
/**
 * @function GetEventTutors
 * @memberof Websoft.WT.Event
 * @description Получения списка ответственных по мероприятию.
 * @param {bigint} iEventID - ID объекта
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @param {string} [sType=false] - тип ответственных ( all/tutors/preparations )
 * @returns {WTLectorResult}
 */
function GetEventTutors( iEventID, bShowDismiss, sType )
{
    return get_event_tutors( iEventID, null, bShowDismiss, sType );
}

function get_event_tutors( iEventID, teEvent, bShowDismiss, sType )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    var oResArray = new Array();

    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }

    try
    {
        if( bShowDismiss == undefined || bShowDismiss == null )
            throw '';
        bShowDismiss = tools_web.is_true( bShowDismiss );
    }
    catch( ex )
    {
        bShowDismiss = false;
    }
    try
    {
        if( sType == undefined || sType == null )
            throw '';
    }
    catch( ex )
    {
        sType = false;
    }
    var arrTutors = new Array();

    switch( sType )
    {
        case "all":
        case "tutors":
            arrTutors = ArrayUnion( arrTutors, ArrayExtract( teEvent.tutors, "This.PrimaryKey" ) );
            if( sType == "tutors" )
            {
                break;
            }
        case "preparations":
            arrTutors = ArrayUnion( arrTutors, ArrayExtract( teEvent.even_preparations, "This.person_id" ) );
            if( sType == "preparations" )
            {
                break;
            }
    }

    if( ArrayOptFirstElem( arrTutors ) == undefined )
        return oRes;
    oResArray = new Array();
    conds = new Array();
    conds.push( "MatchSome( $elem/id, ( " + ArrayMerge( arrTutors, "This", "," ) + " ) )" );
    if( !bShowDismiss )
        conds.push( "$elem/is_dismiss = false()" );
    for( _elem in XQuery( "for $elem in collaborators where " + ArrayMerge( conds, "This", " and " ) + " return $elem/Fields( 'id', 'fullname', 'position_name', 'position_parent_name', 'org_name' )" ) )
    {
        obj = new Object();
        obj.id = _elem.id.Value;
        obj.fullname = _elem.fullname.Value;
        obj.position_name = _elem.position_name.Value;
        obj.position_parent_name = _elem.position_parent_name.Value;
        obj.org_name = _elem.org_name.Value;
        obj.link = get_object_link( "collaborator", _elem.id );
        obj.pict_url = tools_web.get_object_source_url( 'person', _elem.id );
        oResArray.push( obj );
    }
    oRes.array = oResArray;
    return oRes;
}

/**
 * @typedef {Object} oFile
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} link
 */
/**
 * @typedef {Object} WTFileResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oFile[]} array – массив
 */
/**
 * @function GetEventFiles
 * @memberof Websoft.WT.Event
 * @description Получения списка файлов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @param {bigint} iCurUserID - ID сотрудника
 * @param {bigint} [bShowEventResultFiles=false] - отображать файлы и результатов мероприятия
 * @returns {WTFileResult}
 */
function GetEventFiles( iEventID, iCurUserID, bShowEventResultFiles )
{
    return get_event_files( iEventID, null, iCurUserID, null, bShowEventResultFiles )
}
function get_event_files( iEventID, teEvent, iCurUserID, curUser, bShowEventResultFiles )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        curUser.Name;
    }
    catch( ex )
    {
        try
        {
            curUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( bShowEventResultFiles == undefined || bShowEventResultFiles == null )
            throw '';
        bShowEventResultFiles = tools_web.is_true( bShowEventResultFiles );
    }
    catch( ex )
    {
        bShowEventResultFiles = false;
    }

    isParticipant = teEvent.collaborators.GetOptChildByKey( iCurUserID ) != undefined;
    isTutor = teEvent.tutors.GetOptChildByKey( iCurUserID ) != undefined;

    oTmpRes = tools.call_code_library_method( 'libMain', 'get_object_files', [ iEventID, teEvent ] );
    if( oTmpRes.error == 0 )
        for( _file in oTmpRes.array )
            if( _file.visibility == "all" || ( _file.visibility == "responsible" && isTutor ) || ( _file.visibility == "participants" && isParticipant ) )
                oRes.array.push( _file );

    if( bShowEventResultFiles )
    {
        for ( _er in XQuery( "for $i in event_results where $i/event_id = " + iEventID + " return $i/Fields( 'id' )" ) )
        {
            oTmpRes = tools.call_code_library_method( 'libMain', 'get_object_files', [ _er.id ] );
            if( oTmpRes.error == 0 )
                oRes.array = ArrayUnion( oRes.array, oTmpRes.array );
        }
    }

    return oRes;
}

/**
 * @typedef {Object} oRequest
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {date} create_date
 * @property {string} status
 * @property {string} link
 */
/**
 * @typedef {Object} WTRequestResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oRequest[]} array – массив
 */
/**
 * @function GetEventRequests
 * @memberof Websoft.WT.Event
 * @description Получения списка заявок по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTRequestResult}
 */
function GetEventRequests( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_requests', [ iEventID ] );
}

/**
 * @typedef {Object} oResponse
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {date} create_date
 * @property {string} link
 */
/**
 * @typedef {Object} WTResponseResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oResponse[]} array – массив
 */
/**
 * @function GetEventResponses
 * @memberof Websoft.WT.Event
 * @description Получения списка отзывов по объекту.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTResponseResult}
 */
function GetEventResponses( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_responses', [ iEventID ] );
}

/**
 * @typedef {Object} oCerificate
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {date} expire_date
 * @property {string} type_name
 * @property {string} serial
 * @property {string} number
 * @property {string} event_name
 */
/**
 * @typedef {Object} WTCertificateResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oCerificate[]} array – массив
 */
/**
 * @function GetEventCertificates
 * @memberof Websoft.WT.Event
 * @description Получения списка сертификатов по мероприятию.
 * @param {bigint} [iEventID] - ID мероприятия
 * @returns {WTCertificateResult}
 */
function GetEventCertificates( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_certificates', [ null, iEventID ] );
}


/**
 * @typedef {Object} oQualificationAssign
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {date} assignment_date
 * @property {string} status
 * @property {string} qualification_name
 * @property {string} event_name
 */
/**
 * @typedef {Object} WTQualificationAssignResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oQualificationAssign[]} array – массив
 */
/**
 * @function GetEventQualificationAssignments
 * @memberof Websoft.WT.Event
 * @description Получения списка присвоенных квалификаций по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTQualificationAssignResult}
 */
function GetEventQualificationAssignments( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_qualification_assigns', [ null, null, iEventID ] );
}

/**
 * @typedef {Object} oAssessment
 * @property {bigint} id
 * @property {string} name
 * @property {number} duration
 * @property {string} status
 * @property {number} passing_score
 * @property {string} link
 * @property {string} image_url
 */
/**
 * @typedef {Object} WTAssessmentResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oAssessment[]} array – массив
 */
/**
 * @function GetEventPrevTests
 * @memberof Websoft.WT.Event
 * @description Получения списка предварительных тестов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTAssessmentResult}
 */
function GetEventPrevTests( iEventID )
{
    return get_object_assessments( iEventID, null, "prev_testing" );
}
/**
 * @function GetEventPostTests
 * @memberof Websoft.WT.Event
 * @description Получения списка пост-тестов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTAssessmentResult}
 */
function GetEventPostTests( iEventID )
{
    return get_object_assessments( iEventID, null, "post_testing" );
}
function get_object_assessments( iObjectID, teObject, sTypeAssessment )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        iObjectID = Int( iObjectID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teObject.Name;
    }
    catch( ex )
    {
        try
        {
            teObject = OpenDoc( UrlFromDocID( iObjectID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        if( sTypeAssessment == undefined || sTypeAssessment == null )
            throw "error";
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'neperedantipte' );
        return oRes;
    }
    if( !teObject.ChildExists( sTypeAssessment ) || !teObject.Child( sTypeAssessment ).ChildExists( "assessments" ) )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_5' );
        return oRes;
    }
    for( _assessment in teObject.Child( sTypeAssessment ).assessments )
    {
        obj = new Object();
        try
        {
            teAssessment = OpenDoc( UrlFromDocID( _assessment.PrimaryKey ) ).TopElem;
        }
        catch( ex )
        {
            continue;
        }
        obj.id = _assessment.PrimaryKey.Value;
        obj.name = teAssessment.title.Value;
        obj.status = teAssessment.status.ForeignElem.name.Value;
        obj.duration = teAssessment.duration.Value;
        obj.passing_score = teAssessment.passing_score.Value;
        obj.link = get_object_link( "assessment", _assessment.PrimaryKey );
        obj.image_url = get_object_image_url( teAssessment );

        oRes.array.push( obj );
    }
    return oRes;
}
/**
 * @typedef {Object} oLearning
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {string} name
 * @property {number} score
 * @property {date} start_usage_date
 * @property {string} status
 */
/**
 * @typedef {Object} WTTestLearningResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oLearning[]} array – массив
 */
/**
 * @function GetEventActiveTestLearnings
 * @memberof Websoft.WT.Event
 * @description Получения списка назначенных тестов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTTestLearningResult}
 */
function GetEventActiveTestLearnings( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_learnings', [ null, null, iEventID, "active_test_learnings" ] );
}
/**
 * @function GetEventTestLearnings
 * @memberof Websoft.WT.Event
 * @description Получения списка законченных тестов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTTestLearningResult}
 */
function GetEventTestLearnings( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_learnings', [ null, null, iEventID, "test_learnings" ] );
}
/**
 * @function GetEventLearnings
 * @memberof Websoft.WT.Event
 * @description Получения списка законченных курсов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTTestLearningResult}
 */
function GetEventLearnings( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_learnings', [ null, null, iEventID, "learnings" ] );
}
/**
 * @function GetEventActiveLearnings
 * @memberof Websoft.WT.Event
 * @description Получения списка незаконченных курсов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTTestLearningResult}
 */
function GetEventActiveLearnings( iEventID )
{
    return tools.call_code_library_method( 'libMain', 'get_learnings', [ null, null, iEventID, "active_learnings" ] );
}

/**
 * @function GetEducationMethodLectors
 * @memberof Websoft.WT.Event
 * @description Получения списка преподавателей по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTLectorResult}
 */
function GetEducationMethodLectors( iEducationMethodID, bShowDismiss )
{
    return tools.call_code_library_method( 'libMain', 'get_object_lectors', [ iEducationMethodID, null, bShowDismiss ] );
}

/**
 * @function GetEducationMethodFiles
 * @memberof Websoft.WT.Event
 * @description Получения списка материалов по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTFileResult}
 */
function GetEducationMethodFiles( iEducationMethodID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_files', [ iEducationMethodID ] );
}
/**
 * @function GetEducationMethodRequests
 * @memberof Websoft.WT.Event
 * @description Получения списка заявок по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTRequestResult}
 */
function GetEducationMethodRequests( iEducationMethodID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_requests', [ iEducationMethodID ] );
}

/**
 * @function GetEducationMethodResponses
 * @memberof Websoft.WT.Event
 * @description Получения списка отзывов по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {string} sType - Тип учебной программы
 * @returns {WTResponseResult}
 */
function GetEducationMethodResponses( iEducationMethodID, sType )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEducationMethodID = Int( iEducationMethodID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_6' );
        return oRes;
    }
    try
    {
        if( sType == undefined || sType == null || sType == "" )
        {
            throw "";
        }
    }
    catch( ex )
    {
        sType = "event";
    }
    arrObjects = new Array();
    switch( sType )
    {
        case "all":
        case "event":
            arrObjects = ArrayUnion( arrObjects, ArrayExtract( XQuery( "for $elem in events where $elem/education_method_id = " + iEducationMethodID + " and $elem/type_id = 'education_method' return $elem" ), "This.id" ) );
            if( sType == "event" )
            {
                break;
            }
        case "education_method":
            arrObjects.push( iEducationMethodID );
            break;
    }

    oRes = tools.call_code_library_method( 'libMain', 'get_object_responses', [ null, arrObjects ] );
    for( _resp in oRes.array )
    {
        _resp.SetProperty( "type_name", ( _resp.type == "event" ? i18n.t( 'omeropriyatii' ) : i18n.t( 'obuchebnoyprogr' ) ) );
    }
    return oRes;
}

/**
 * @function GetEducationMethodPrevTests
 * @memberof Websoft.WT.Event
 * @description Получения списка предварительных тестов по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTAssessmentResult}
 */
function GetEducationMethodPrevTests( iEducationMethodID )
{
    return get_object_assessments( iEducationMethodID, null, "prev_testing" );
}
/**
 * @function GetEducationMethodPostTests
 * @memberof Websoft.WT.Event
 * @description Получения списка пост-тестов по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTAssessmentResult}
 */
function GetEducationMethodPostTests( iEducationMethodID )
{
    return get_object_assessments( iEducationMethodID, null, "post_testing" );
}


/**
 * @typedef {Object} oEvent
 * @property {bigint} id
 * @property {string} name
 * @property {string} link
 * @property {string} image_url
 * @property {date} start_date
 * @property {date} finish_date
 * @property {string} status
 * @property {string} type
 */
/**
 * @typedef {Object} WTPersonEventsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEvent[]} array – массив
 */
/**
 * @function GetPersonEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка мероприятий сотрудника.
 * @param {bigint} iPersonID - ID сотрудника
 * @param {string[]} [aStatus] - массив статусов
 * @param {bigint[]} [aEventType] - массив ID типов мероприятия
 * @param {bigint[]} [aRolesID] - массив ID категории
 * @param {boolean} [bOpenWebinar=false] - передавать ссылку на вебинар, а не на карточку мероприятия
 * @param {boolean} [bGetRoleHier=false] - брать все категории вниз по иерархии
 * @returns {WTPersonEventsResult}
 */
function GetPersonEvents( iPersonID, aStatus, aEventType, aRolesID, bOpenWebinar, bGetRoleHier )
{
    return get_user_events( iPersonID, aStatus, aEventType, aRolesID, bOpenWebinar, bGetRoleHier );
}

function get_user_events( iPersonID, aStatus, aEventType, aRolesID, bOpenWebinar, bGetRoleHier )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_7' );
        return oRes;
    }
    try
    {
        iRoleID = Int( iRoleID );
    }
    catch( ex )
    {
        iRoleID = null;
    }
    try
    {
        ArrayOptFirstElem( aStatus )
    }
    catch( ex )
    {
        aStatus = [ 'plan', 'active' ];
    }
    try
    {
        ArrayOptFirstElem( aEventType )
    }
    catch( ex )
    {
        aEventType = [];
    }
    try
    {
        if( bOpenWebinar == undefined || bOpenWebinar == null || bOpenWebinar == "" )
            throw "";
        bOpenWebinar = tools_web.is_true( bOpenWebinar );
    }
    catch( ex )
    {
        bOpenWebinar = false;
    }
    try
    {
        if( bGetRoleHier == undefined || bGetRoleHier == null || bGetRoleHier == "" )
            throw "";
        bGetRoleHier = tools_web.is_true( bGetRoleHier );
    }
    catch( ex )
    {
        bGetRoleHier = false;
    }
    try
    {
        if( !IsArray( aRolesID ) )
        {
            throw "error";
        }
        aRolesID = ArraySelect( aRolesID, "OptInt( This ) != undefined" )
    }
    catch( ex )
    {
        aRolesID = [];
    }
    if( bGetRoleHier )
    {
        var aTmpRoles = aRolesID
        for( _role_id in aTmpRoles )
        {
            aRolesID = ArrayUnion( aRolesID, tools.xquery("for $elem in roles where IsHierChild( $elem/id, " + _role_id + " ) order by $elem/Hier() return $elem/Fields('id')") );
        }
        aRolesID = ArraySelectDistinct( aRolesID, "This" );
    }

    conds = new Array();
    conds.push( "$i/collaborator_id = " + iPersonID )
    conds.push( "( $i/is_collaborator = true() or $i/is_tutor = true() )" )
    if( ArrayOptFirstElem( aStatus ) != undefined )
        conds.push( "MatchSome( $i/status_id, (" + ArrayMerge( aStatus, "XQueryLiteral( String( This ) )", "," ) + ") )" );

    if( ArrayOptFirstElem( aEventType ) != undefined )
        conds.push( "MatchSome( $i/event_type_id, (" + ArrayMerge( aEventType, "This", "," ) + ") )" );
    xarrEvents = XQuery( "for $i in event_collaborators where " + ArrayMerge( conds, "This", " and " ) + " return $i" );

    if( ArrayOptFirstElem( aRolesID ) != undefined  )
    {
        xarrRoleEvents = XQuery( "for $i in events where MatchSome( $i/role_id, ( " + ArrayMerge( aRolesID, "This", "," ) + " ) ) return $i/Fields( 'id' )" );
        xarrEvents = ArrayIntersect( xarrEvents, xarrRoleEvents, "This.event_id", "This.id" )
    }
    try
    {
        sUrl = CurRequest.Url;
    }
    catch( ex )
    {
        sUrl = "";
    }
    var xarrEventTypes = new Array();
    if( ArrayOptFirstElem( xarrEvents ) != undefined )
    {
        xarrEventTypes = XQuery( "for $elem in  event_types return $elem" );
    }
    RESULT = new Array();
    for( _elem in xarrEvents )
    {
        obj = new Object();
        obj.id = _elem.event_id.Value;
        obj.name = _elem.name.Value;
        obj.start_date = _elem.start_date.Value;
        obj.finish_date = _elem.finish_date.Value;

        feStatus = _elem.status_id.HasValue ? _elem.status_id.OptForeignElem : undefined
        obj.status = feStatus != undefined ? feStatus.name.Value : "";

        feType = ArrayOptFindByKey( xarrEventTypes, _elem.event_type_id, "id" );
        obj.type = feType != undefined ? feType.name.Value : "";

        if( bOpenWebinar && feType.online )
            try
            {
                obj.link = OpenDoc( UrlFromDocID( _elem.event_id ) ).TopElem.get_webinar_url( _elem.collaborator_id, sUrl );
            }
            catch( ex )
            {
                obj.link = get_object_link( "event", _elem.event_id );
            }
        else
            obj.link = get_object_link( "event", _elem.event_id );

        feEvent = _elem.event_id.OptForeignElem;
        if( feEvent != undefined && feEvent.ChildExists( "resource_id" ) && feEvent.resource_id.HasValue )
        {
            obj.image_url = tools_web.get_object_source_url( 'resource', feEvent.resource_id );
        }
        else
        {
            obj.image_url = "images/event.png";
        }

        RESULT.push( obj );
    }
    oRes.array = RESULT;
    return oRes;
}

/**
 * @typedef {Object} oObjectCompetence
 * @property {bigint} id
 * @property {string} name
 * @property {string} plan_value
 * @property {string} plan_value_name
 * @property {number} weight
 */
/**
 * @typedef {Object} WTObjectCompetenceResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oObjectCompetence[]} array – массив
 */
/**
 * @function GetEducationMethodCompetences
 * @memberof Websoft.WT.Event
 * @description Получения списка компетенций учебной программы.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTObjectCompetenceResult}
 */
function GetEducationMethodCompetences( iEducationMethodID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_competences', [ iEducationMethodID ] );
}

/**
 * @typedef {Object} oEduProgram
 * @property {bigint} id
 * @property {string} name
 * @property {string} link
 */
/**
 * @typedef {Object} WTEduMethodProgramResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEduProgram[]} array – массив
 */
/**
 * @function GetEducationMethodPrograms
 * @memberof Websoft.WT.Event
 * @description Получения списка набора программ учебной программы.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @returns {WTEduMethodProgramResult}
 */
function GetEducationMethodPrograms( iEducationMethodID )
{
    return get_edu_programs( iEducationMethodID );
}

function get_edu_programs( iEduMethodID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEduMethodID = Int( iEduMethodID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_8' );
        return oRes;
    }


    conds = new Array();
    conds.push( "MatchSome( $i/education_methods_id, ( " + iEduMethodID + " ) )" )

    xarrEduPrograms = XQuery( "for $i in education_programs where " + ArrayMerge( conds, "This", " and " ) + " return $i" );

    RESULT = new Array();
    for( _elem in xarrEduPrograms )
    {
        obj = new Object();
        obj.id = _elem.id.Value;
        obj.name = _elem.name.Value;
        obj.link = get_object_link( "education_program", _elem.id );
        RESULT.push( obj );
    }
    oRes.array = RESULT;
    return oRes;
}

/**
 * @typedef {Object} oEduMethod
 * @property {bigint} id
 * @property {string} name
 * @property {string} link
 * @property {string} type
 * @property {string} object_name
 * @property {number} person_num
 * @property {number} cost
 * @property {string} image_url
 */
/**
 * @typedef {Object} WTEduMethodResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEduMethod[]} array – массив
 */
/**
 * @function GetSimilarEducationMethods
 * @memberof Websoft.WT.Event
 * @description Получения списка похожих учебных программ.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {string} [sTypeSimilar=tags] - по какому признаку выбирать похожие
 * @returns {WTEduMethodResult}
 */
function GetSimilarEducationMethods( iEducationMethodID, sTypeSimilar )
{
    return get_edu_programs( iEducationMethodID, sTypeSimilar );
}

function get_similar_edu_methods( iEduMethodID, sTypeSimilar )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEduMethodID = Int( iEduMethodID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_8' );
        return oRes;
    }
    try
    {
        if( sTypeSimilar == undefined || sTypeSimilar == null )
            throw "error";
    }
    catch( ex )
    {
        sTypeSimilar = tags
    }

    var xarrEduMethods = new Array();
    switch( sTypeSimilar )
    {
        case "tags":
            xarrTaggedObjects = XQuery( "for $i in tagged_objects where $i/object_id = " + iEduMethodID + " return $i" );
            if( ArrayOptFirstElem( xarrTaggedObjects ) != undefined )
            {
                xarrTaggedSimilarObjects = XQuery( "for $i in tagged_objects where $i/catalog = 'education_method' and MatchSome( $i/tag_id, ( " + ArrayMerge( xarrTaggedObjects, "This.tag_id", "," ) + " ) ) return $i" );
                xarrEduMethods = XQuery( "for $i in education_methods where MatchSome( $i/id, ( " + ArrayMerge( xarrTaggedSimilarObjects, "This.object_id", "," ) + " ) ) return $i" );
            }
            break;
        case "education_program":
            xarrEduPrograms = XQuery( "for $i in education_programs where MatchSome( $i/education_methods_id, ( " + iEduMethodID + " ) ) return $i" );
            arrTmp = new Array();
            for( _ep in xarrEduPrograms )
                arrTmp = ArrayUnion( arrTmp, _ep.education_methods_id );
            if( ArrayOptFirstElem( arrTmp ) != undefined )
            {
                xarrEduMethods = XQuery( "for $i in education_methods where MatchSome( $i/id, ( " + ArrayMerge( arrTmp, "This", "," ) + " ) ) return $i" );
            }
            break;
        case "education_method":
            try
            {
                teEduMethod = OpenDoc( UrlFromDocID( iEduMethodID ) ).TopElem;
                if( teEduMethod.similar_education_methods.ChildNum > 0 )
                {
                    xarrEduMethods = XQuery( "for $i in education_methods where MatchSome( $i/id, ( " + ArrayMerge( teEduMethod.similar_education_methods, "This.PrimaryKey", "," ) + " ) ) return $i" );
                }
            }
            catch( ex ){}
            break;
        case "role":
            catEduMethod = ArrayOptFirstElem( XQuery( "for $i in education_methods where $i/id = " + iEduMethodID + " return $i" ) );
            if( catEduMethod != undefined && ArrayOptFirstElem( catEduMethod.role_id ) != undefined )
            {
                xarrEduMethods = tools.xquery( "for $elem in education_methods where MatchSome( $elem/role_id, ( " + ArrayMerge( catEduMethod.role_id, "This", "," ) + " ) ) return $elem/id,$elem/__data" );
            }
            break;
    }

    oRes.array = get_list_education_methods( ArraySelect( xarrEduMethods, "This.id != iEduMethodID" ) );
    return oRes;
}
function get_list_education_methods( xarrEduMethods )
{
    var RESULT = new Array();
    var _doc, _te;
    for( _elem in xarrEduMethods )
    {
        _doc = tools.open_doc(_elem.id.Value);
        if(_doc == undefined)
            continue;

        _te = _doc.TopElem;

        obj = new Object();
        obj.id = _elem.id.Value;
        obj.name = _te.name.Value;
        obj.type = _te.type.Value;
        obj.object_name = "";
        feObject = undefined
        switch( _te.type )
        {
            case "org":
                if( _te.education_org_id.HasValue )
                    feObject = _te.education_org_id.OptForeignElem;
                break;
            case "course":
                if( _elem.course_id.HasValue )
                    feObject = _te.course_id.OptForeignElem;
                break;
        }
        if( feObject != undefined )
            obj.object_name = feObject.name.Value;
        obj.person_num = _te.person_num.Value;
        obj.cost = _te.cost.Value;
        obj.desc = _te.desc.Value;
        obj.comment = _te.comment.Value;
        obj.link = get_object_link( "education_method", _te.id );
        obj.image_url = get_object_image_url( _te );

        RESULT.push( obj );
    }
    return RESULT;
}

/**
 * @typedef {Object} oCompoundProgram
 * @property {bigint} id
 * @property {string} name
 * @property {string} link
 * @property {string} image_url
 * @property {bigint} min_person_num
 * @property {string} lectors_name
 * @property {bigint} duration
 * @property {string} allow_self_assignment
 * @property {string} education_plan_state_name
 * @property {string} education_plan_state_id
 * @property {string} roles_name
 * @property {bigint} folder_program_count
 * @property {bigint} program_count
 * @property {bigint} trained_person_count
 * @property {bigint} trained_group_count
 */
/**
 * @typedef {Object} WTCompoundProgramEduMethodResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oCompoundProgram[]} array – массив
 */
/**
 * @function GetEducationMethodCompoundPrograms
 * @memberof Websoft.WT.Event
 * @description получения списка модульных программ по учебной программе
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {bigint} iRoleID - ID категории с модульными программами
 * @param {bool} bAllowSelfAssignment - Отбор по признаку возможности самоназначения
 * @param {bigint} iPersonID - ID сотрудника по которому строится список
 * @param {oCollectionParam} oCollectionParams - Параметры выборки.
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication - код приложения, по которому определяется доступ
 * @param {string[]} arrReturnData - массив полей для вывода: "folder_program_count"(Число этапов),"program_count"(Число активностей), "trained_person_count"(Число обученных сотрудников), "trained_group_count"(Число обученных групп)
 * @param {bigint} iCurApplicationID - ID текущего приложения
 * @returns {WTCompoundProgramEduMethodResult}
 */
function GetEducationMethodCompoundPrograms( iEducationMethodID, iRoleID, bAllowSelfAssignment, iPersonID, oCollectionParams, sXQueryQual, sAccessType, sApplication, arrReturnData, iCurApplicationID )
{
    return get_compound_programs( iEducationMethodID, iRoleID, bAllowSelfAssignment, true, iPersonID, oCollectionParams, sXQueryQual, sAccessType, sApplication, arrReturnData, iCurApplicationID );
}

function get_compound_programs( arrObjectsID, arrRolesID, bAllowSelfAssignment, bLiteData, iPersonID, oCollectionParams, sXQueryQual, sAccessType, sApplication, arrReturnData, iCurApplicationID )
{
    oRes = tools.get_code_library_result_object();
    oRes.array = [];
    var oPaging = oCollectionParams.GetOptProperty("paging");
    oRes.paging = oPaging;

    conds = new Array();
    try
    {
        if( OptInt( arrObjectsID ) != undefined )
        {
            iObjectID = OptInt( arrObjectsID );
            arrObjectsID = new Array();
            arrObjectsID.push( iObjectID );
        }
        else
        {
            if( !IsArray( arrObjectsID ) )
            {
                throw "";
            }
        }
    }
    catch( ex )
    {
        arrObjectsID = new Array();
    }

    try
    {
        if( OptInt( arrRolesID ) != undefined )
        {
            iRoleID = OptInt( arrRolesID );
            arrRolesID = new Array();
            arrRolesID.push( iRoleID );
        }
        else
        {
            if( !IsArray( arrRolesID ) )
            {
                throw "";
            }
        }
    }
    catch( ex )
    {
        arrRolesID = new Array();
    }

    try
    {
        bLiteData = bLiteData != false;
    }
    catch( ex )
    {
        bLiteData = true;
    }

    try
    {
        if( bAllowSelfAssignment != true && bAllowSelfAssignment != false )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        bAllowSelfAssignment = null;
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        iPersonID = null;
    }

    if ( sXQueryQual == null || sXQueryQual == undefined)
        sXQueryQual = "";

    if ( sXQueryQual != "" )
    {
        conds.push( sXQueryQual );
    }

    if ( sAccessType == null || sAccessType == undefined)
    {
        sAccessType = "auto";
    }

    if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "expert" && sAccessType != "observer" )
    {
        sAccessType = "auto";
    }

    if ( sApplication == null || sApplication == undefined)
    {
        sApplication = "";
    }

    iApplicationID = OptInt(sApplication);
    if(iApplicationID != undefined)
    {
        sApplication = ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
    }

    if(sApplication != "")
    {
        var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplication ] );

        if(iApplLevel >= 10 && (sAccessType == "auto" || sAccessType == "admin"))
        {
            sAccessType = "admin"; //Администратор приложения
        }
        else if(iApplLevel >= 7 && (sAccessType == "auto" || sAccessType == "manager"))
        {
            sAccessType = "manager"; //Администратор процесса
        }
        else if(iApplLevel >= 5 && (sAccessType == "auto" || sAccessType == "hr"))
        {
            sAccessType = "hr"; //Администратор HR
        }
        else if(iApplLevel >= 3 && (sAccessType == "auto" || sAccessType == "expert"))
        {
            sAccessType = "expert"; //Эксперт
        }
        else if(iApplLevel >= 1 && (sAccessType == "auto" || sAccessType == "observer"))
        {
            sAccessType = "observer"; //Наблюдатель
        }
        else
        {
            sAccessType = "reject";
        }
    }

    arrEduPlansPersonsCond = [];
    arrEduPlansGroupsCond = [];
    var arrBossType = [];
    switch(sAccessType)
    {
        case "hr":
            manager_type_id_app = 0;
//для показателей по сотрудникам
            if (ArrayOptFirstElem(arrBossType) == undefined)
            {
                var teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
                if (teApplication != null)
                {
                    if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
                    {
                        manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 ));
                        manager_type_id_app = manager_type_id;
                        if (manager_type_id > 0)
                            arrBossType.push(manager_type_id);
                    }
                }
            }
            if(ArrayOptFirstElem(arrBossType) == undefined)
            {
                arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id.Value');
            }
            arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, arrBossType, true ] );
            arrEduPlansPersonsCond.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );

//для показателей по группам
            xarrGroups = XQuery("for $elem in func_managers where $elem/catalog = 'group' and $elem/person_id = " + iPersonID + " and $elem/boss_type_id = " + manager_type_id_app + " return $elem/Fields('object_id')");
            arrEduPlansGroupsCond.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( xarrGroups, "This.object_id.Value", "," ) + " ) )" );
            break;

        case "expert":
            oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iPersonID + " return $elem/Fields('id')"));
            arrRoles= [];
            if (oExpert != undefined)
            {
                arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'compound_program' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");
                if ( ArrayOptFirstElem( arrRoles )!= undefined )
                {
                    conds.push( "MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) )" );
                }
                else
                {
                    return oRes;
                }
            }
            else
            {
                return oRes;
            }

            break;
        case "observer":
//для показателей по сотрудникам
            arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [], true ] );
            arrEduPlansPersonsCond.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );

//для показателей по группам
            xarrFMGroups = tools.xquery( "for $elem in func_managers where $elem/catalog = 'group' and $elem/person_id = " + iPersonID + "  return $elem/Fields('object_id')" );
            arrEduPlansGroupsCond.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( xarrFMGroups, "This.object_id.Value", "," ) + " ) )" );
            break;
        case "reject":
            return oRes;

    }

    if( ArrayOptFirstElem( arrObjectsID ) != undefined )
    {
        conds.push( "MatchSome( $elem/objects_id, ( " + ArrayMerge( arrObjectsID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( bAllowSelfAssignment != null )
    {
        conds.push( "$elem/allow_self_assignment = " + XQueryLiteral( bAllowSelfAssignment ) );
    }

//фильтрация
    var arrFilters = oCollectionParams.GetOptProperty( "filters", [] );

    if ( arrFilters != undefined && arrFilters != null && IsArray(arrFilters) )
    {
        for ( oFilter in arrFilters )
        {
            if ( oFilter.type == 'search' )
            {
                if ( oFilter.value != '' )
                {
                    conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
                }
            }
        }
    }

    sFields = "/Fields('id', 'name', 'resource_id')";
    if( !bLiteData )
    {
        sFields = "/Fields('id', 'name', 'resource_id', 'min_person_num', 'lectors_id', 'allow_self_assignment', 'duration', 'role_id' )";
    }
    var sCPReq = "for $elem in compound_programs " + ( ArrayOptFirstElem( conds ) != undefined ? ( " where " + ArrayMerge( conds, "This", " and " ) ) : "" ) + " return $elem" + sFields;

    xarrCompoundPrograms = tools.xquery( sCPReq );

    if ( arrReturnData == null || arrReturnData == undefined)
    {
        arrReturnData = [];
    }
    bFolder_program_count = false; //Число этапов
    bProgram_count = false; //Число активностей
    bTrained_person_count = false; //Число обученных сотрудников
    bTrained_group_count = false; //Число обученных групп
    if ( ArrayOptFirstElem( arrReturnData ) != undefined )
    {
        for ( itemReturnData in arrReturnData )
        {
            switch ( itemReturnData )
            {
                case "folder_program_count": //Число этапов
                    bFolder_program_count = true;
                    break;
                case "program_count": //Число активностей
                    bProgram_count = true;
                    break;
                case "trained_person_count": //Число обученных сотрудников
                    bTrained_person_count = true;
                    break;
                case "trained_group_count": //Число обученных групп
                    bTrained_group_count = true;
                    break;
            }
        }
    }

    if ( bFolder_program_count || bProgram_count )
    {
        xarrCompProgEduMeths = tools.xquery( "for $elem in compound_program_education_methods where MatchSome( $elem/compound_program_id, ( " + ArrayMerge( xarrCompoundPrograms, "This.id.Value", "," ) + " ) ) return $elem/Fields('compound_program_id','object_type')" );
    }

    if ( bTrained_person_count )
        xarrEduPlansPersons = tools.xquery( "for $elem in education_plans where $elem/type = 'collaborator' and $elem/state_id = 4 " + ( ArrayOptFirstElem( arrEduPlansPersonsCond ) != undefined ? ( " and " + ArrayMerge( arrEduPlansPersonsCond, "This", " and " ) ) : "" ) + " return $elem/Fields('compound_program_id')" );

    if ( bTrained_group_count )
        xarrEduPlansGroups = tools.xquery( "for $elem in education_plans where $elem/type = 'group' and $elem/state_id = 4 " + ( ArrayOptFirstElem( arrEduPlansGroupsCond ) != undefined ? ( " and " + ArrayMerge( arrEduPlansGroupsCond, "This", " and " ) ) : "" ) + " return $elem/Fields('compound_program_id')" );


    if( bLiteData )
    {
        for( _elem in xarrCompoundPrograms )
        {
            obj = new Object();
            obj.id = _elem.id.Value;
            obj.name = _elem.name.Value;
            obj.link = get_object_link( "compound_program", _elem.id );
            obj.image_url = get_object_image_url( _elem );

            oRes.array.push( obj );
        }
    }
    else
    {
        function get_role_name( _role_id )
        {
            catRole = ArrayOptFindBySortedKey( arrRoles, _role_id, "id" );
            return ( catRole != undefined ? catRole.name.Value : "" );
        }
        arrRoles = new Array();
        for( _elem in xarrCompoundPrograms )
        {
            if( _elem.role_id.HasValue )
            {
                arrRoles = ArrayUnion( arrRoles, _elem.role_id );
            }
        }
        if( ArrayOptFirstElem( arrRoles ) != undefined )
        {
            arrRoles = ArrayDirect( tools.xquery( "for $elem_qc in roles where MatchSome( $elem_qc/id, ( " + ArrayMerge( arrRoles, "This", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields( 'id', 'name' )" ) );
        }
        arrLectors = Array();
        for( _elem in xarrCompoundPrograms )
        {
            if( ArrayOptFirstElem( _elem.lectors_id ) != undefined )
            {
                arrLectors = ArrayUnion( arrLectors, _elem.lectors_id );
            }
        }
        xarrLectors = new Array();
        if( ArrayOptFirstElem( arrLectors ) != undefined )
        {
            xarrLectors = ArrayDirect( tools.xquery( "for $elem in lectors where MatchSome( $elem/id, ( " + ArrayMerge( arrLectors, "This", "," ) + " ) ) order by $elem/id return $elem/Fields( 'id', 'lector_fullname' )" ) )
        }
        xarrEducationPlan = new Array();
        if( iPersonID != null )
        {
            var education_plan_conds = new Array();
            xarrPersonGroups = tools.xquery( "for $elem in group_collaborators where $elem/collaborator_id = " + iPersonID + " return $elem/Fields( 'group_id' )" );
            if( ArrayOptFirstElem( xarrPersonGroups ) != undefined )
            {
                education_plan_conds.push( "( $elem/type = 'group' and MatchSome( $elem/object_id, ( " + ArrayMerge( xarrPersonGroups, "This.group_id", "," ) + " ) ) )" );
            }
            education_plan_conds.push( "$elem/person_id = " + iPersonID );

            xarrEducationPlan = ArrayDirect( tools.xquery( "for $elem in education_plans where $elem/compound_program_id != null() and ( " + ArrayMerge( education_plan_conds, "This", " or " ) + " ) order by $elem/compound_program_id return $elem/Fields('id', 'state_id','compound_program_id')" ) );
        }
        for( _elem in xarrCompoundPrograms )
        {
            obj = new Object();
            obj.id = _elem.id.Value;
            obj.name = _elem.name.Value;
            obj.min_person_num = _elem.min_person_num.Value;
            obj.duration = _elem.duration.Value;
            obj.allow_self_assignment = ( _elem.allow_self_assignment ? i18n.t( 'da' ) : i18n.t( 'net' ) );
            arrLectorNames = new Array();
            for( _lector in _elem.lectors_id )
            {
                catLector = ArrayOptFindBySortedKey( xarrLectors, _lector, "id" );
                if( catLector != undefined )
                {
                    arrLectorNames.push( catLector.lector_fullname.Value );
                }
            }
            obj.lectors_name = ArrayMerge( arrLectorNames, "This", ", " );
            obj.link = get_object_link( "compound_program", _elem.id );
            obj.image_url = get_object_image_url( _elem );
            obj.roles_name = ArrayMerge( _elem.role_id, "get_role_name( This )", ", " );
            obj.education_plan_state_name = "";
            obj.education_plan_state_id = "";
            catEducationPlan = ArrayOptFindBySortedKey( xarrEducationPlan, _elem.id, "compound_program_id" );
            if( catEducationPlan != undefined )
            {
                obj.education_plan_state_name = ( catEducationPlan.state_id.HasValue ? catEducationPlan.state_id.ForeignElem.name.Value : "" );
                obj.education_plan_state_id = catEducationPlan.state_id.Value;
            }

            if ( bFolder_program_count )
                obj.folder_program_count = ArrayCount( ArraySelect( xarrCompProgEduMeths, "This.compound_program_id.Value == _elem.id.Value && This.object_type.Value == 'folder'" ) ); //Число этапов – количество разделов модульной программы с типом Этап
            else
                obj.folder_program_count = null;

            if ( bProgram_count )
                obj.program_count = ArrayCount( ArraySelect( xarrCompProgEduMeths, "This.compound_program_id.Value == _elem.id.Value && This.object_type.Value != 'folder'" ) ); //Число активностей – количество разделов модульной программы с любым типом, кроме Этап
            else
                obj.program_count = null;

            if ( bTrained_person_count )
                obj.trained_person_count = ArrayCount( ArraySelect( xarrEduPlansPersons, "This.compound_program_id.Value == _elem.id.Value" ) ); //Число обученных сотрудников – число планов обучения с типом Сотрудник, привязанных к данной программе и имеющих статус Пройден
            else
                obj.trained_person_count = null;

            if ( bTrained_group_count )
                obj.trained_group_count = ArrayCount( ArraySelect( xarrEduPlansGroups, "This.compound_program_id.Value == _elem.id.Value" ) ); //Число обученных групп – число планов обучения с типом Группа, привязанных к данной программе и имеющих статус Пройден
            else
                obj.trained_group_count = null;

            oRes.array.push( obj );
        }
    }

    if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
    {
        var sFieldName = oCollectionParams.sort.FIELD;
        oRes.array = ArraySort(oRes.array, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
    }

    if(ObjectType(oPaging) == 'JsObject' && oPaging.SIZE != null)
    {
        oPaging.MANUAL = true;
        oPaging.TOTAL = ArrayCount(oRes.array);
        oRes.paging = oPaging;
        oRes.array = ArrayRange(oRes.array, ( OptInt(oPaging.START_INDEX, 0) > 0 ? oPaging.START_INDEX : OptInt(oPaging.INDEX, 0) * oPaging.SIZE ), oPaging.SIZE);
    }

    return oRes;
}

/**
 * @typedef {Object} oEventAction
 * @property {bigint} id
 * @property {string} name
 * @property {string} action_type
 * @property {string} action_id
 * @property {string} method
 * @property {string} url
 */
/**
 * @typedef {Object} WTEventActionResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEventAction[]} array – массив
 */
/**
 * @function GetEventActions
 * @memberof Websoft.WT.Event
 * @description получения списка действий по мероприятию
 * @param {bigint} iEventID - ID мероприятия
 * @param {bigint} iCurUserID - ID сотрудника
 * @returns {WTEventActionResult}
 */
function GetEventActions( iEventID, iCurUserID )
{
    return get_event_actions( iEventID, iCurUserID );
}
function get_event_actions( iEventID, iCurUserID, teEvent, teUser, oLngItems )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        teUser.Name;
    }
    catch( ex )
    {
        try
        {
            teUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }

    function CheckRights(sAction)
    {
        return (ArrayOptFind(xarrOperationsRights, "This.action == '" + sAction + "'") !=undefined);
    }
    try
    {
        sUrl = CurRequest.Url;
    }
    catch( ex )
    {
        sUrl = "";
    }

    sEventTypeCode = "";
    sEventTypeName = "";
    var bOnline = false;
    if( teEvent.event_type_id.HasValue)
    {
        if( teEvent.event_type_id.OptForeignElem != undefined)
        {
            catEventType = teEvent.event_type_id.ForeignElem;
            sEventTypeCode = catEventType.code;
            sEventTypeName = catEventType.name;
            bOnline = catEventType.online;
        }
    }
    else
    {
        catEventType = ArrayOptFirstElem( XQuery( 'for $elem in event_types where $elem/code = ' + XQueryLiteral(teEvent.type_id) + ' return $elem' ) );
        if ( catEventType != undefined )
        {
            sEventTypeCode = catEventType.code;
            sEventTypeName = catEventType.name;
            bOnline = catEventType.online;
        }
    }

    xarrBossTypes = tools.get_object_relative_boss_types( iCurUserID, iEventID );
    xarrBossTypes = ArrayUnion( xarrBossTypes, XQuery( "for $elem in boss_types where $elem/code = 'current_user' return $elem" ) )
    xarrOperations = tools.get_relative_operations_by_boss_types(xarrBossTypes);
    xarrOperations = ArraySelect(xarrOperations, "This.operation_catalog_list.HasValue && ( StrContains(','+This.operation_catalog_list.Value+',', ',event,') || StrContains(','+This.operation_catalog_list.Value+',', ',event_result,'))");
    xarrOperationsActions = ArraySelect(xarrOperations, "This.operation_type == 0 && StrContains(','+This.operation_catalog_list.Value+',', ',event,')");
    xarrOperationsRights = ArraySelect(xarrOperations, "This.operation_type == 1");

    //bUserIsAdmin = ( teUser.access.access_role == "admin");
    bUserIsAdmin = false;
    bUserIsAnonym = (!bUserIsAdmin && ArrayCount(xarrBossTypes)==0);

    bUserIsTutor = ArrayOptFind(xarrBossTypes,"This.code == 'event_tutor'") != undefined;
    bUserIsLector = ArrayOptFind(xarrBossTypes,"This.code == 'event_lector'") != undefined;
    bUserIsCollaborator = ArrayOptFind(xarrBossTypes,"This.code == 'event_participaint'") != undefined;
    bUserIsPreparator = ArrayOptFind(xarrBossTypes,"This.code == 'event_preparation'") != undefined;
    bUserIsRequester = ArrayOptFindByKey( teEvent.collaborators, iCurUserID, "request_person_id" ) != undefined;

    bUserIsParticipant = (bUserIsAdmin || bUserIsTutor || bUserIsLector || bUserIsCollaborator || bUserIsPreparator);

    xarrEventResults = XQuery( "for $elem in event_results where $elem/event_id = " + iEventID + " return $elem" );
    bFreePlacesExist = true;
    if( teEvent.max_person_num.HasValue)
    {
        bCheckNotParticipate = true;
        iRegisteredPersonsNum = ArrayCount( xarrEventResults ) - ( !bCheckNotParticipate ? ArrayCount( ArraySelect( xarrEventResults, "This.not_participate" ) ) : 0 ) + OptInt(teEvent.unnamed_person_num,0);
        bFreePlacesExist = teEvent.max_person_num > iRegisteredPersonsNum
    }
    catEventResult = ArrayOptFind( xarrEventResults, "This.person_id == iCurUserID" );

    var bRequestDateFinished = ( teEvent.date_request_rejection_over.HasValue && DateDiff( teEvent.date_request_rejection_over, CurDate ) < 0 );
    var bUserConfirmedParticipation = (catEventResult != undefined && catEventResult.is_confirm );
    var bShowNotConfirmedMessage = bUserIsCollaborator && !bUserConfirmedParticipation && ( teEvent.status_id == "plan" || teEvent.status_id == "project") && !catEventResult.not_participate && !bRequestDateFinished;

    docEventResult = null;
    teEventResult = null;
    if( catEventResult != undefined )
    {
        docEventResult = OpenDoc( UrlFromDocID( catEventResult.PrimaryKey ) );
        teEventResult = docEventResult.TopElem;
    }

    if( CheckRights("event_change_right") && false )
    {
        oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'c_save' ), action_type: "remote_action", action_id: "lp_event_action", method: "save_action" } );
    }

    if( bShowNotConfirmedMessage )
    {
        oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'podtverdituchas_1' ), action_type: "remote_action", action_id: "lp_event_action", method: "is_confirm" } );
        oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'otkazatsyaotucha' ), action_type: "remote_action", action_id: "lp_event_action", method: "not_participate" } );
    }

    if( bOnline ) // && (((bUserIsParticipant || teEvent.allow_guest_login) && teEvent.status_id == "active") || (teEvent.record_exists && (teEvent.show_record || teEvent.allow_record_download))))
    {
        if( teEvent.status_id == "active")
        {
            if(bUserIsParticipant)
            {
                var iWebibarUserId = iCurUserID;
                var docEvent = OpenDoc( UrlFromDocID( iEventID ) )
                if(bUserIsLector)
                {
                    var catLector = ArrayOptFirstElem(XQuery( "for $elem in lectors where $elem/person_id = " + iCurUserID + " and $elem/is_dismiss != true() return $elem" ));
                    if(catLector != undefined)
                        iWebibarUserId = catLector.PrimaryKey;
                }
                sWebinarUrl = docEvent.TopElem.get_webinar_url( iWebibarUserId, sUrl );
                if( sWebinarUrl != "" )
                {
                    oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'veb_login_webinar' ), action_type: "remote_action", action_id: "lp_event_action",method: "open_url", url: sWebinarUrl } );
                }
            }
            else if(teEvent.allow_guest_login)
            {
                oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'zaregistrirova' ), action_type: "remote_action", action_id: "lp_event_action", method: "register_to_event" } );
            }
        }

        if(teEvent.record_exists)
        {
            var sRecordHostUrl = "";
            if(teEvent.show_record)
            {
                sRecordUrl = teEvent.get_webinar_record_url(sRecordHostUrl);
                if(sRecordUrl != "")
                {
                    oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'yofxnyehpq' ), action_type: "remote_action", action_id: "lp_event_action", method: "open_url", url: sRecordUrl } );
                }
            }

            if(teEvent.allow_record_download)
            {
                sRecordDownloadUrl = teEvent.get_webinar_record_download_url(sRecordHostUrl);
                if(sRecordDownloadUrl != "")
                {
                    oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'zagruzitzapis' ), action_type: "remote_action", action_id: "lp_event_action", method: "open_url", url: sRecordDownloadUrl } );
                }
            }
        }
    }

    /*if( bUserIsParticipant && teEvent.use_vclass && teEvent.status_id == "active" )
	{
		oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'onlaynobuchenie' ), action_type: "remote_action", action_id: "lp_event_action", method: "open_url", url: "vclass/webinar.html?room=" + iEventID + "&code=" + iCurUserID } );
	}*/
    if( CheckRights("event_change_status_right") || CheckRights("event_change_right") )
    {
        if(teEvent.status_id != "plan" && teEvent.status_id != "active")
        {
            oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'kplanirovaniyu' ), action_type: "remote_action", action_id: "lp_event_action", method: "set_status", new_status: "plan" } );
        }
        if(teEvent.status_id == "plan")
        {
            oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'vlpb_start' ), action_type: "remote_action", action_id: "lp_event_action", method: "set_status", new_status: "active" } );
        }
        if(teEvent.status_id == "active")
        {
            oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'vllb_close' ), action_type: "remote_action", action_id: "lp_event_action", method: "set_status", new_status: "close" } );
        }
        if(teEvent.status_id == "plan" || teEvent.status_id == "active")
        {
            oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'veb_to_cancel' ), action_type: "remote_action", action_id: "lp_event_action", method: "set_status", new_status: "cancel" } );
        }
    }
    if( CheckRights( "event_change_collaborators_right" ) && false )
    {
        oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'veb_b7' ), action_type: "remote_action", action_id: "ChangeEventCollaborators" } );
    }
    bAllowRequestsIfFull = false;
    bUserRequestExists  = ( ArrayOptFirstElem( XQuery( "for $elem in requests where $elem/person_id = " + iCurUserID + " and $elem/object_id = " + iEventID + "  and $elem/is_group = false() and $elem/status_id = 'close' return $elem" )) != undefined );

    if ( ((!bUserRequestExists && !bUserIsCollaborator) ) && teEvent.is_open && teEvent.status_id != "project" && teEvent.status_id != "close" && teEvent.status_id != "cancel" &&  !teUser.in_request_black_list && (bFreePlacesExist || bAllowRequestsIfFull))
    {
        if ( !(teEvent.date_request_over.HasValue && DateDiff( teEvent.date_request_over, Date() ) < 0 ) && !( teEvent.date_request_begin.HasValue && DateDiff( teEvent.date_request_begin, Date() ) > 0 ))
        {
            if ( teEvent.default_request_type_id.HasValue && teEvent.default_request_type_id.OptForeignElem != undefined)
            {
                teRequest = OpenDoc(UrlFromDocID(teEvent.default_request_type_id)).TopElem;
                if(!teRequest.boss_only || ArrayOptFirstElem(XQuery( "for $elem in func_managers where $elem/person_id=" + iCurUserID + " return $elem" )) != undefined)
                {
                    oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'c_text_create_request' ), action_type: "remote_action", action_id: "lp_event_action", method: "create_request", request_type_id: teEvent.default_request_type_id.Value, object_id: iEventID } );
                }
            }
        }
    }
    if ( bUserIsCollaborator && teEvent.default_response_type_id.HasValue && ( teEvent.status_id == "active" || teEvent.status_id == "close" ) )
    {
        catResponse = ArrayOptFirstElem(XQuery( "for $elem in responses where $elem/object_id = " + iEventID + " and $elem/person_id=" + iCurUserID + " return $elem" ))
        if(catResponse == undefined)
        {
            oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'c_text_create_response' ), action_type: "remote_action", action_id: "lp_event_action", method: "create_response", response_type_id: teEvent.default_response_type_id.Value, object_id: iEventID } );
        }
    }

    if(bUserIsParticipant)
    {
        if(sEventTypeCode == "real_time")
        {
            if(teEvent.course_id.HasValue)
            {
                oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'otkrytkartochku_2' ), action_type: "remote_action", action_id: "lp_event_action", method: "open_url", url: tools_web.get_mode_clean_url( null, teEvent.course_id ) } );
            }
            if(teEvent.chat_id.HasValue)
            {
                oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'otkrytchat' ), action_type: "remote_action", action_id: "lp_event_action", method: "open_url", url: tools_web.get_mode_clean_url( null, teEvent.chat_id )} );
            }
        }
    }

    if(teEventResult != null && CheckRights("event_result_write_comment_right"))
    {
        oRes.array.push( { id: Random( 0, 99999999 ), name: ( teEventResult.collaborator_comment.HasValue ? i18n.t( 'izmenitkomment' ) : i18n.t( 'dc_write_comment' ) ), action_type: "remote_action", action_id: "lp_event_action", method: "edit_comment"} );
    }
    if( CheckRights("event_result_upload_files_right") )
    {
        oRes.array.push( { id: Random( 0, 99999999 ), name: i18n.t( 'vdb_add_file' ), action_type: "remote_action", action_id: "lp_event_action", method: "add_event_result_file" } );
    }

    for( _operation in xarrOperationsActions )
    {
        if( _operation.remote_action_id.HasValue )
        {
            oRes.array.push( { id: _operation.id.Value, name: _operation.name.Value, action_type: "operation", action_id: _operation.id.Value, method: _operation.action.Value } );
        }
    }

    return oRes;
}


function UniEventAction( iEventID, iCurUserID, SCOPE_WVARS, docEvent, teUser, oLngItems, bOpenNewWindow )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.action_result = {};

    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        docEvent.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEvent = OpenDoc( UrlFromDocID( iEventID ) );
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        teUser.Name;
    }
    catch( ex )
    {
        try
        {
            teUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }
    try
    {
        if( ObjectType( SCOPE_WVARS ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'neperedanypere' );
        return oRes;
    }
    try
    {
        if( bOpenNewWindow == undefined || bOpenNewWindow == null )
            throw '';
        bOpenNewWindow = tools_web.is_true( bOpenNewWindow );
    }
    catch( ex )
    {
        bOpenNewWindow = true;
    }
    function set_message( sMessage )
    {
        oRes.action_result = {
            command: "alert",
            msg: RValue( sMessage )
        };
    }

    oItem = tools.read_object( SCOPE_WVARS.GetOptProperty( "_ITEM_", "{}" ) );

    sMethod = oItem.GetOptProperty( "method", "" );

    switch( sMethod )
    {
        case "open_url":
        {
            if( bOpenNewWindow )
            {
                sUrl = oItem.GetOptProperty( "url", "" );
                oRes.action_result = {
                    command: "new_window",
                    url: sUrl
                };
            }
            else
            {
                sUrl = oItem.GetOptProperty( "url", "" );
                oRes.action_result = {
                    command: "redirect",
                    redirect_url: sUrl
                };
            }

            break;
        }
        case "save_action":
        {

            break;
        }
        case "register_to_event":
        {
            if( docEvent.TopElem.guest_restrictions.HasValue )
            {
                if( docEvent.TopElem.guest_restrictions <= ArrayCount( XQuery( "for $elem in event_results where $elem/event_id = " + iEventID + " and $elem/guest = true() return $elem/Fields('id')" ) ) )
                {
                    set_message( i18n.t( 'prevyshenlimitg' ) );
                    break;
                }
            }
            if( tools.add_person_to_event( iCurUserID, iEventID, null, docEvent, null, null, null, true ) == null )
            {
                set_message( i18n.t( 'priregistracii' ) );
            }
            else
            {
                oResult = tools.check_event_fields( iEventID, docEvent, docEvent.TopElem );
                if( oResult == null )
                    set_message( i18n.t( 'priregistracii' ) );
                else
                {
                    set_message( i18n.t( 'vyzaregistriro' ) );
                    oRes.action_result.SetProperty( "confirm_result", { command: "reload_page" } );
                }
            }
            break;
        }
        case "set_status":
        {
            sStatus = oItem.GetOptProperty( "new_status", "" );
            oResult = tools.call_code_library_method( 'libEducation', 'SetStatusEvent', [ { iEventIDParam: iEventID, sNewStatusParam: sStatus, docEventParam: docEvent, bSendNotificationsParam: true } ] );
            //docEvent.TopElem.set_status( sStatus );
            if( oResult.error != 0 && oResult.message != '' )
            {
                set_message( oResult.message );
                break;
            }

            oResult = tools.check_event_fields( iEventID, docEvent, docEvent.TopElem );
            if( oResult.error != 0 && oResult.message != '' )
            {
                set_message( oResult.message );
            }
            else
            {
                set_message( StrReplace( i18n.t( 'statusmeropriya_1' ), "{PARAM1}", "\"" + common.event_status_types.GetChildByKey( docEvent.TopElem.status_id ).name + "\"") );
                oRes.action_result.SetProperty( "confirm_result", { command: "reload_page" } );
            }
            break;
        }
        case "edit_comment":
        {
            sCommand = SCOPE_WVARS.GetOptProperty( "command", "eval" );
            //alert('sCommand '+sCommand)
            switch( sCommand )
            {
                case "eval":
                {
                    teEventResult = null;
                    catEventResult = ArrayOptFirstElem( XQuery( "for $i in event_results where $i/event_id = " + iEventID + " and $i/person_id = " + iCurUserID + " return $i" ) );
                    if( catEventResult != undefined )
                    {
                        docEventResult = OpenDoc( UrlFromDocID( catEventResult.id ) );
                        teEventResult = docEventResult.TopElem;
                    }
                    oRes.action_result =	{
                        command: "display_form",
                        title: ( teEventResult.collaborator_comment.HasValue ? i18n.t( 'izmenitkomment' ) :i18n.t( 'dc_write_comment' ) ),
                        header: i18n.t( 'c_comment' ),
                        form_fields:
                            [
                                { name: "collaborator_comment", label: i18n.t( 'c_comment' ), type: "string", value: teEventResult.collaborator_comment.Value, mandatory: true, validation: "nonempty" },
                            ]
                    };
                    break;
                }

                case "submit_form":
                {

                    sMsg = "ERROR!!!!";
                    oFormFields = undefined;
                    form_fields = SCOPE_WVARS.GetOptProperty( "form_fields", "" )
                    if ( form_fields != "" )
                    {

                        oFormFields = ParseJson( form_fields );
                    }

                    if ( oFormFields != undefined )
                    {

                        oComment = ArrayOptFind( oFormFields, "This.name == 'collaborator_comment'" );
                        catEventResult = ArrayOptFirstElem( XQuery( "for $i in event_results where $i/event_id = " + iEventID + " and $i/person_id = " + iCurUserID + " return $i" ) );
                        if( catEventResult != undefined )
                        {
                            docEventResult = OpenDoc( UrlFromDocID( catEventResult.id ) );
                            teEventResult = docEventResult.TopElem;
                            teEventResult.collaborator_comment = oComment.value;
                            docEventResult.Save();
                        }
                        set_message( i18n.t( 'kommentariysoh' ) );
                        oRes.action_result.SetProperty( "confirm_result", { command: "reload_page" } );
                    }
                }
            }
            break;
        }
        case "add_event_result_file":
        {

            break;
        }
        case "create_request":
        {
            sCommand = SCOPE_WVARS.GetOptProperty( "command", "eval" );
            iObjectID = OptInt( oItem.GetOptProperty( "object_id", "" ) );
            iRequestTypeID = OptInt( oItem.GetOptProperty( "request_type_id", "" ) )

            return tools.call_code_library_method( 'libMain', 'lp_create_request', [ iRequestTypeID, sCommand, iCurUserID, teUser, SCOPE_WVARS, iObjectID  ] );
            break;
        }
        case "create_response":
        {
            sCommand = SCOPE_WVARS.GetOptProperty( "command", "eval" );
            iObjectID = OptInt( oItem.GetOptProperty( "object_id", "" ) );
            iResponseTypeID = OptInt( oItem.GetOptProperty( "response_type_id", "" ) )

            return tools.call_code_library_method( 'libMain', 'lp_create_response', [ iResponseTypeID, sCommand, iCurUserID, teUser, SCOPE_WVARS, iObjectID  ] );
            break;
        }
        case "is_confirm":
        {
            catEventResult = ArrayOptFirstElem(XQuery("for $elem in event_results where  $elem/event_id=" + iEventID + " and $elem/person_id=" + iCurUserID + "  return $elem"))
            if(catEventResult != undefined)
            {
                docEventResult = OpenDoc( UrlFromDocID( catEventResult.PrimaryKey ) );
                docEventResult.TopElem.is_confirm = true;
                docEventResult.Save();

                set_message( i18n.t( 'uchastiepodtver' ) );
                ms_tools.raise_system_event_env( 'portal_event_confirm_participation', {
                    'curSystemEventObjectID':catEventResult.PrimaryKey,
                    'iEventId': iEventID,
                    'curUser': teUser,
                    'curUserID': iCurUserID,
                    'docEventResult': docEventResult,
                    'iEventResultId': catEventResult.PrimaryKey
                } );
            }
            else
            {
                set_message( i18n.t( 'c_error' ) );
            }
            oRes.action_result.SetProperty( "confirm_result", { command: "reload_page" } );
            break;
        }
        case "not_participate":
        {
            catEventResult = ArrayOptFirstElem(XQuery("for $elem in event_results where  $elem/event_id=" + iEventID + " and $elem/person_id=" + iCurUserID + "  return $elem"))
            if(catEventResult != undefined)
            {
                docEventResult = OpenDoc( UrlFromDocID( catEventResult.PrimaryKey ) );
                docEventResult.TopElem.not_participate = true;
                docEventResult.TopElem.is_assist = false;
                docEventResult.TopElem.is_confirm = false;
                docEventResult.Save();
                set_message( i18n.t( 'vyotkazalisotu' ) );
                ms_tools.raise_system_event_env( 'portal_event_refused_participation', {
                    'curSystemEventObjectID':iEventID,
                    'iEventId': iEventID,
                    'curUser': teUser,
                    'curUserID': iCurUserID,
                    'docEventResult': docEventResult,
                    'iEventResultId': catEventResult.PrimaryKey
                } );
            }
            else
            {
                set_message( i18n.t( 'c_error' ) );
            }
            oRes.action_result.SetProperty( "confirm_result", { command: "reload_page" } );
            break;
        }
        default:
        {
            set_message( i18n.t( 'neizvestnoedey' ) );
        }
    }
    //alert( tools.object_to_text(oRes, 'json') )
    return oRes;
}

function event_lp_operation_action( iCurUserID, SCOPE_WVARS, teUser, oLngItems )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.action_result = {};
    try
    {
        if( ObjectType( SCOPE_WVARS ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'neperedanypere' );
        return oRes;
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        teUser.Name;
    }
    catch( ex )
    {
        try
        {
            teUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }
    function set_message( sMessage )
    {
        oRes.action_result = {
            command: "alert",
            msg: sMessage
        };
    }
    oItem = tools.read_object( SCOPE_WVARS.GetOptProperty( "_ITEM_", "{}" ) );

    aItemsArray = new Array();
    if( SCOPE_WVARS.GetOptProperty( "_ITEMS_ARRAY_", "" ) != "" )
        try
        {
            aItemsArray = tools.read_object( SCOPE_WVARS.GetOptProperty( "_ITEMS_ARRAY_" ) );
            aItemsArray = ArrayExtract( aItemsArray, "This.id" )
        }
        catch ( err )
        {
            alert( err );
            ERROR = 1;
            MESSAGE = i18n.t( 'nevernyedannye' );
            return;
        }
    else
        aItemsArray.push( SCOPE_WVARS.GetOptProperty( "_remote_object_id", "" ) );

    sRemoteOperationMethod = SCOPE_WVARS.GetOptProperty( "_remote_operation_method", "" )

    switch( sRemoteOperationMethod )
    {
        case "event_send_notification_action":
        {
            for( _object_id in aItemsArray )
            {
                SendNotificationsEvent( {
                    'iEventIDParam': _object_id,
                    'sSendTypeParam': "custom"
                } );
            }
            set_message( i18n.t( 'uvedomleniyasfo' ) );
            break;
        }
        case "event_activate_course_action":
        {

            break;
        }
        case "event_excel_import_collaborators_action":
        {

            break;
        }
        case "delete_event":
        {
            for( _object_id in aItemsArray )
            {
                DeleteDoc( UrlFromDocID( Int( _object_id ) ), false);
            }
            set_message( i18n.t( 'mepropriyatiyaud' ) );
            break;
        }
        case "event_duplicate_action":
        {

            iEventId = Int( ArrayOptFirstElem( aItemsArray ) );
            docEvent = OpenNewDoc( "x-local://wtv/wtv_event.xmd" );
            teOldEvent = OpenDoc( UrlFromDocID( iEventId ) ).TopElem;

            docEvent.TopElem.AssignElem(teOldEvent);
            docEvent.BindToDb( DefaultDb );

            docEvent.TopElem.name += " - " + StrNonTitleCase( i18n.t( 'kopiya' ) );
            docEvent.TopElem.start_date=Date()
            docEvent.TopElem.finish_date.Clear();
            var feEventType = docEvent.TopElem.event_type_id.OptForeignElem;
            if( feEventType != undefined && feEventType.online )
            {
                docEvent.TopElem.record_exists = false;
                docEvent.TopElem.record_date = null;
                docEvent.TopElem.record_download_count = 0;
                docEvent.TopElem.record_view_count = 0;
            }

            docEvent.TopElem.duration_plan.Clear();
            docEvent.TopElem.duration_days_plan.Clear();
            docEvent.TopElem.duration_fact.Clear();
            docEvent.TopElem.duration_days_fact.Clear();

            docEvent.TopElem.collaborators.Clear();
            docEvent.TopElem.educ_groups.Clear();
            fldChild = docEvent.TopElem.tutors.ObtainChildByKey( iCurUserID );
            tools.common_filling( "collaborator", fldChild, iCurUserID, teUser );
            docEvent.Save();
            set_message( i18n.t( 'mepropriyatieso' ) );
            break;
        }
        case "event_activate_test_action":
        {

            break;
        }
        case "event_result_replace_participant_action":
        {

            break;
        }
        case "event_result_toggle_collaborator_assist_action":
        {

            break;
        }
        case "event_result_exclude_collaborator_action":
        {

            break;
        }

    }
    return oRes.action_result
}

/**
 * @function GetEducationMethodActions
 * @memberof Websoft.WT.Event
 * @description Получения списка действий по учебной программе.
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {bigint} iCurUserID - ID сотрудника
 * @returns {WTEventActionResult}
 */
function GetEducationMethodActions( iEducationMethodID, iCurUserID )
{
    return get_edu_method_actions( iEducationMethodID, iCurUserID );
}
function get_edu_method_actions( iEduMethodID, iCurUserID, teEduMethod, oLngItems )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEduMethodID = Int( iEduMethodID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_9' );
        return oRes;
    }
    try
    {
        teEduMethod.Name;
    }
    catch( ex )
    {
        try
        {
            teEduMethod = OpenDoc( UrlFromDocID( iEduMethodID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_9' );
            return oRes;
        }
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }
    xarrBossTypes = tools.get_object_relative_boss_types( iCurUserID, iEduMethodID );
    xarrBossTypes = ArrayUnion( xarrBossTypes, XQuery( "for $elem in boss_types where $elem/code = 'current_user' return $elem" ) )
    xarrOperations = tools.get_relative_operations_by_boss_types( xarrBossTypes );
    xarrOperations = ArraySelect(xarrOperations, "This.operation_catalog_list.HasValue && ( StrContains(','+This.operation_catalog_list.Value+',', ',education_method,'))");
    xarrOperationsActions = ArraySelect(xarrOperations, "This.operation_type == 0 && StrContains(','+This.operation_catalog_list.Value+',', ',education_method,')");

    if( teEduMethod.is_open )
    {
        xarrRequestTypes = XQuery( "for $elem in request_types where $elem/object_type = 'education_method' " + ( teEduMethod.default_request_type_id.HasValue ? " and $elem/id = " + teEduMethod.default_request_type_id : "" ) + " return $elem" );
        if ( ArrayOptFirstElem( xarrRequestTypes ) != undefined )
        {

            for ( catRequestTypeElem in xarrRequestTypes )
            {
                if( !tools_web.check_access( catRequestTypeElem.id, iCurUserID ) )
                {
                    continue;
                }
                oRes.array.push( { id: Random( 0, 99999999 ), name: RValue( tools_web.get_cur_lng_name( catRequestTypeElem.name, global_settings.settings.default_lng.Value ) ), action_type: "remote_action", action_id: "lp_event_action", method: "create_request", object_id: iEduMethodID, request_type_id: catRequestTypeElem.PrimaryKey } );
            }
        }
    }
    for( _operation in xarrOperationsActions )
    {
        oRes.array.push( { id: _operation.id.Value, name: _operation.name.Value, action_type: "operation", action_id: _operation.id.Value, method: _operation.action.Value } );
    }

    return oRes;
}

/**
 * @typedef {Object} WTLectorEventResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEvent[]} array
 */
/**
 * @function GetLectorEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка мероприятий для преподавателя.
 * @param {bigint} iLectorID - ID преподавателя
 * @param {bigint} iUserID - ID сотрудника
 * @param {boolean} [bUseTimezone=false] - учитывать таймзоны
 * @returns {WTLectorEventResult}
 */
function GetLectorEvents( iLectorID, iUserID, bUseTimezone )
{
    return get_lector_events( iLectorID, iUserID, bUseTimezone )
}
function get_lector_events( iLectorID, iUserID, bUseTimezone )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iLectorID = Int( iLectorID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_10' );
        return oRes;
    }
    try
    {
        if( bUseTimezone == undefined || bUseTimezone == null || bUseTimezone == "" )
        {
            throw "error";
        }
        bUseTimezone = tools_web.is_true( bUseTimezone );
    }
    catch( ex )
    {
        bUseTimezone = false;
    }

    var catDefaultTimezone = null;
    var catUserTimezone = null;
    if( bUseTimezone )
    {
        catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
        catUserTimezone = tools_web.get_timezone( iUserID );
        catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
    }

    var xarrLectorEvents = XQuery( 'for $elem in event_lectors where $elem/lector_id = ' + iLectorID + ' return $elem' );
    if( ArrayOptFirstElem( xarrLectorEvents ) != undefined )
    {
        var array = XQuery( 'for $elem in events where MatchSome( $elem/id, ( ' + ArrayMerge( xarrLectorEvents, "This.event_id", "," ) + ' ) ) return $elem' );

        oRes.array = get_list_events( array, { bGetImage: true, bGetUrl : true, bUseTimezone: bUseTimezone, catDefaultTimezone: catDefaultTimezone, catUserTimezone: catUserTimezone } );
    }
    return oRes
}

function get_list_events( arrEvents, oParams )
{
    function get_date( dDate, bIn, catTimezone )
    {
        if( bUseTimezone )
        {
            if( bIn )
            {
                return tools_web.get_timezone_date( dDate, catUserTimezone, catDefaultTimezone )
            }
            else
            {
                return tools_web.get_timezone_date( dDate, catTimezone, catUserTimezone )
            }
        }
        else
            return dDate
    }
    try
    {
        if( ObjectType( oParams ) != "JsObject" )
            throw "";
    }
    catch( ex )
    {
        oParams = {};
    }

    var bUseTimezone = oParams.GetOptProperty( "bUseTimezone", false );
    var catDefaultTimezone = oParams.GetOptProperty( "catDefaultTimezone", null );
    var catUserTimezone = oParams.GetOptProperty( "catUserTimezone", null );
    var bGetImage = oParams.GetOptProperty( "bGetImage", false );
    var bGetUrl = oParams.GetOptProperty( "bGetUrl", false );
    var catEventTimezone = null;

    xarrEventTypes = ArrayDirect( XQuery( "for $elem in event_types order by $elem/id return $elem/Fields( 'id', 'name' )" ) )
    RESULT = new Array()
    for( _elem in arrEvents )
    {
        if( bUseTimezone )
        {
            catEventTimezone = tools_web.get_timezone( _elem.id, _elem );
        }
        obj = new Object();
        obj.id = _elem.id.Value;
        obj.code = _elem.code.Value;
        obj.name = _elem.name.Value;
        obj.education_org_name = _elem.education_org_name.Value;
        feType = _elem.event_type_id.HasValue ? ArrayOptFindByKey( xarrEventTypes, _elem.event_type_id, "id" ) : undefined;
        obj.type_name = feType != undefined ? feType.name.Value : "";
        obj.is_open = _elem.is_open.Value;
        obj.status_id = _elem.status_id.Value;
        obj.status_name = _elem.status_id.ForeignElem.name.Value;
        obj.start_date = get_date( _elem.start_date.Value, false, catEventTimezone );
        obj.finish_date = get_date( _elem.finish_date.Value, false, catEventTimezone );
        obj.person_num = _elem.person_num.Value;
        if( bGetImage )
        {
            obj.image_url = get_object_image_url( _elem );
        }
        if( bGetUrl )
        {
            obj.link = get_object_link( "event", _elem.id );
        }
        RESULT.push( obj );

    }
    return RESULT
}

/**
 * @typedef {Object} WTEduMethodResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEduMethod[]} array – массив
 */
/**
 * @function GetLectorEducationMethods
 * @memberof Websoft.WT.Event
 * @description Получения списка учебных программ преподавателя.
 * @param {bigint} iLectorID - ID преподавателя
 * @returns {WTEduMethodResult}
 */
function GetLectorEducationMethods( iLectorID )
{
    return get_lector_edu_methods( iLectorID );
}

function get_lector_edu_methods( iLectorID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iLectorID = Int( iLectorID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_10' );
        return oRes;
    }

    xarrLectorEduMethods = XQuery( "for $i in education_method_lectors where $i/lector_id = " + iLectorID + " return $i" );
    if( ArrayOptFirstElem( xarrLectorEduMethods ) != undefined )
    {
        xarrEduMethods = tools.xquery( "for $elem in education_methods where MatchSome( $elem/id, ( " + ArrayMerge( xarrLectorEduMethods, "This.education_method_id", "," ) + " ) ) return $elem/id,$elem/__data" );

        oRes.array = get_list_education_methods( xarrEduMethods );
    }

    return oRes;
}
/**
 * @function GetLectorResponses
 * @memberof Websoft.WT.Event
 * @description Получения списка отзывов по преподавателю.
 * @param {bigint} iLectorID - ID преподавателя
 * @returns {WTResponseResult}
 */
function GetLectorResponses( iLectorID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_responses', [ iLectorID ] );
}

/**
 * @function GetEducationOrgLectors
 * @memberof Websoft.WT.Event
 * @description Получения списка преподавателей по учебной организации.
 * @param {bigint} iEducationOrgID - ID учебной организации
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTLectorResult}
 */
function GetEducationOrgLectors( iEducationOrgID, bShowDismiss )
{
    return tools.call_code_library_method( 'libMain', 'get_object_lectors', [ iEducationOrgID, null, bShowDismiss ] );
}

/**
 * @typedef {Object} oCourseDef
 * @property {bigint} id
 * @property {string} code
 * @property {string} name
 * @property {string} status
 * @property {bigint} education_org_id
 * @property {int} mastery_score
 * @property {int} max_score
 * @property {int} duration
 */
/**
 * @typedef {Object} WTCourseResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {oCourseDef[]} array – массив
 */
/**
 * @function GetEducationOrgCourses
 * @memberof Websoft.WT.Event
 * @description Получения списка курсов по учебной организации.
 * @param {bigint} iEducationOrgID - ID учебной организации
 * @returns {WTCourseResult}
 */
function GetEducationOrgCourses( iEducationOrgID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.array = [];

    try
    {
        iEducationOrgID = Int( iEducationOrgID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_11' );
        return oRes;
    }

    xarrEduOrgCourses = tools.xquery("for $elem in courses where $elem/education_org_id = " + iEducationOrgID + " return $elem");

    for ( oCourse in xarrEduOrgCourses )
    {
        obj = new Object();
        obj.id = oCourse.id.Value;
        obj.code = oCourse.code.Value;
        obj.name = oCourse.name.Value;
        obj.status = common.course_test_states.GetOptChildByKey( oCourse.status.Value ).name.Value;
        obj.education_org_id = oCourse.education_org_id.Value;
        obj.mastery_score = oCourse.mastery_score.Value;
        obj.max_score = oCourse.max_score.Value;
        obj.duration = oCourse.duration.Value;
        oRes.array.push( obj );
    }

    return oRes;
}

/**
 * @function GetEducationOrgResponses
 * @memberof Websoft.WT.Event
 * @description Получения списка отзывов по обучающей организации.
 * @param {bigint} iEducationOrgID - ID учебной организации
 * @returns {WTResponseResult}
 */
function GetEducationOrgResponses( iEducationOrgID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_responses', [ iEducationOrgID ] );
}

/**
 * @function GetEducationOrgEducationMethods
 * @memberof Websoft.WT.Event
 * @description Получения списка учебных программ обучающей организации.
 * @param {bigint} iEducationOrgID - ID обучающей организации
 * @returns {WTEduMethodResult}
 */
function GetEducationOrgEducationMethods( iEducationOrgID )
{
    return get_edu_org_edu_methods( iEducationOrgID );
}

function get_edu_org_edu_methods( iEduOrgID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEduOrgID = Int( iEduOrgID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_11' );
        return oRes;
    }

    xarrEduMethods = tools.xquery( "for $elem in education_methods where $elem/education_org_id = " + iEduOrgID + " return $elem/id,$elem/__data" );
    oRes.array = get_list_education_methods( xarrEduMethods );

    return oRes;
}

/**
 * @typedef {Object} WTEduOrgEventResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEvent[]} array
 */
/**
 * @function GetEducationOrgEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка мероприятий для обучающей организации.
 * @param {bigint} iEducationOrgID - ID обучающей организации
 * @param {bigint} iUserID - ID сотрудника
 * @param {boolean} [bUseTimezone] - учитывать таймзоны
 * @returns {WTEduOrgEventResult}
 */
function GetEducationOrgEvents( iEduOrgID, iUserID, bUseTimezone )
{
    return get_edu_org_events( iEduOrgID, iUserID, bUseTimezone )
}
function get_edu_org_events( iEduOrgID, iUserID, bUseTimezone )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iEduOrgID = Int( iEduOrgID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_11' );
        return oRes;
    }
    try
    {
        if( bUseTimezone == undefined || bUseTimezone == null || bUseTimezone == "" )
        {
            throw "error";
        }
        bUseTimezone = tools_web.is_true( bUseTimezone );
    }
    catch( ex )
    {
        bUseTimezone = false;
    }

    var catDefaultTimezone = null;
    var catUserTimezone = null;
    if( bUseTimezone )
    {
        catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
        catUserTimezone = tools_web.get_timezone( iUserID );
        catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
    }

    var array = XQuery( 'for $elem in events where $elem/education_org_id = ' + iEduOrgID + ' return $elem' );
    oRes.array = get_list_events( array, { bGetImage: true, bGetUrl : true, bUseTimezone: bUseTimezone, catDefaultTimezone: catDefaultTimezone, catUserTimezone: catUserTimezone } );

    return oRes
}

/**
 * @typedef {Object} WTUpcomingEventsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEvent[]} array
 */
/**
 * @function GetUpcomingEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка ближайших мероприятий.
 * @param {bigint} iPersonID - ID пользователя
 * @param {number} iDays - Кол-во дней за которое мероприятие считается ближайшим
 * @param {string} [sEventTypes] - Типы мероприятий через ;
 * @param {string} [sType=all] - Тип мероприятий ( all/my/open )
 * @param {boolean} [bCheckUserPlace] - Проверять расположение сотрудника
 * @param {string} [sXQueryQual] - условие xquery выборки
 * @param {boolean} [bUseTimezone] - учитывать таймзоны
 * @param {boolean} [bShowCurrentEvent] - учитывать текущие мероприятия
 * @param {boolean} [bCheckAnonimusAccess] - разрешить просмотр ближайших мероприятий без привязки к пользователю
 * @returns {WTUpcomingEventsResult}
 */
function GetUpcomingEvents( iPersonID, iDays, sEventTypes, sType, bCheckUserPlace, sXQueryQual, bUseTimezone, bShowCurrentEvent )
{
    return get_upcoming_events( iPersonID, null, iDays, sEventTypes, sType, bCheckUserPlace, sXQueryQual, null, null, null, null, null, bUseTimezone, bShowCurrentEvent );
}

function get_upcoming_events( iUserID, teUser, iDays, sEventTypes, sType, bCheckUserPlace, sXQueryQual, oPagingParam, oSortParam, Request, iMaxCnt, bCheckAnonimusAccess, bUseTimezone, bShowCurrentEvent)
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        if( bCheckUserPlace == undefined || bCheckUserPlace == null )
        {
            throw 'error';
        }
        bCheckUserPlace = tools_web.is_true( bCheckUserPlace );
    }
    catch( ex )
    {
        bCheckUserPlace = false;
    }
    try
    {
        if( bCheckAnonimusAccess == undefined || bCheckAnonimusAccess == null )
        {
            throw 'error';
        }
        bCheckAnonimusAccess = tools_web.is_true( bCheckAnonimusAccess );
    }
    catch( ex )
    {
        bCheckAnonimusAccess = false;
    }
    if (bCheckAnonimusAccess)
    {
        iUserID = 100;
        teUser = null;
        bCheckUserPlace = false;
        bUseTimezone = false;
    }
    try
    {
        if( bShowCurrentEvent == undefined || bShowCurrentEvent == null )
        {
            throw 'error';
        }
        bShowCurrentEvent = tools_web.is_true( bShowCurrentEvent );
    }
    catch( ex )
    {
        bShowCurrentEvent = false;
    }
    try
    {
        iUserID = Int( iUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        teUser.Name
    }
    catch( ex )
    {
        teUser = null;
    }
    try
    {
        iMaxCnt = Int( iMaxCnt )
    }
    catch( ex )
    {
        iMaxCnt = 10;
    }
    try
    {
        iDays = Int( iDays )
    }
    catch( ex )
    {
        iDays = 7;
    }
    try
    {
        if( sEventTypes == undefined || sEventTypes == null || sEventTypes == "" )
            throw '';
    }
    catch( ex )
    {
        sEventTypes = "";
    }
    try
    {
        if( sType == undefined || sType == null || sType == "" )
            throw '';
    }
    catch( ex )
    {
        sType = "all";
    }
    try
    {
        if( sXQueryQual == undefined || sXQueryQual == null )
            throw '';
    }
    catch( ex )
    {
        sXQueryQual = "";
    }
    try
    {
        if( Request == undefined || Request == null || Request == "" )
            throw "error";
    }
    catch( ex )
    {
        Request = null;
    }
    try
    {
        if( bUseTimezone == undefined || bUseTimezone == null || bUseTimezone == "" )
        {
            throw "error";
        }
        bUseTimezone = tools_web.is_true( bUseTimezone );
    }
    catch( ex )
    {
        bUseTimezone = false;
    }

    var catDefaultTimezone = null;
    var catUserTimezone = null;
    if( bUseTimezone )
    {
        catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
        catUserTimezone = tools_web.get_timezone( iUserID, teUser );
        catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
    }
    aEventCodeTypes = String( sEventTypes ).split( ";" );

    aEventTypes = new Array();
    if( sEventTypes != "" )
        aEventTypes = XQuery( "for $i in event_types where MatchSome( $i/code, (" + ArrayMerge( aEventCodeTypes, "XQueryLiteral( This )", "," ) + ") ) return $i" );
    try
    {
        if( ObjectType( oSortParam ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oSortParam = {};
    }

    if ( oSortParam.GetOptProperty( "FIELD", null ) == null )
    {
        oSortParam.SetProperty( "DIRECTION", "ASC" );
    }
    oSortParam.SetProperty( "FIELD", "start_date" );

    conds = new Array();
    conds.push( "( $elem/status_id = 'plan' " + ( bShowCurrentEvent ? " or $elem/status_id = 'active'" : "" ) + ")" );
    if( bShowCurrentEvent )
    {
        conds.push( "( $elem/finish_date >= date( '" + Date() + "' ) )" );
    }
    else
    {
        conds.push( "( $elem/start_date >= date( '" + Date() + "' ) )" );
    }
    if( iDays != undefined )
    {
        conds.push( "$elem/start_date < date( '" + DateOffset( Date(), iDays*86400 ) + "' )" );
    }
    if( sEventTypes != "" )
        conds.push( "MatchSome( $elem/event_type_id, (" + ArrayMerge( aEventTypes, "This.id", "," ) + ") )" );

    type_conds = new Array();
    switch( sType )
    {
        case "all":
        case "my":
            xarrMyEvents = XQuery( "for $elem in event_collaborators where " + ArrayMerge( conds, "This", " and " ) + " and ($elem/is_collaborator = true() or $elem/is_tutor = true()) and $elem/collaborator_id = " + iUserID + " return $elem" );
            if( ArrayOptFirstElem( xarrMyEvents ) != undefined )
                type_conds.push( "MatchSome( $elem/id, ( " + ArrayMerge( xarrMyEvents, "This.event_id", "," ) + " ) )" )
            if( sType == "my" )
                break;
        case "open":
            type_conds.push( "$elem/is_public = true()" )
            break;
    }

    if( ArrayOptFirstElem( type_conds ) != undefined )
    {
        if( bCheckUserPlace || ( global_settings.settings.check_access_on_lists && Request != null ) )
        {
            try
            {
                teUser = OpenDoc( UrlFromDocID( iUserID ) ).TopElem;
            }
            catch( ex )
            {
                oRes.error = 1;
                oRes.errorText = i18n.t( 'peredannekorre' );
                return oRes;
            }
        }
        if( sXQueryQual != "" )
            conds.push( sXQueryQual );
        conds.push( "( " + ArrayMerge( type_conds, "This", " or " ) + " )" )
        if( bCheckUserPlace )
        {
            xarrPlacesIds = new Array();

            if( teUser.position_parent_id.HasValue )
            {
                catSub = teUser.position_parent_id.OptForeignElem;
                _cnt = 0;
                while( catSub != undefined )
                {
                    _cnt++;
                    if( _cnt > 50 )
                        break;
                    if( catSub.place_id.HasValue )
                        xarrPlacesIds.push( catSub.place_id );
                    if( !catSub.parent_object_id.HasValue )
                        break;
                    catSub = catSub.parent_object_id.OptForeignElem;
                }
            }
            if( teUser.place_id.HasValue )
                xarrPlacesIds.push( teUser.place_id );
            conds.push( "MatchSome( $elem/place_id, (" + ArrayMerge( xarrPlacesIds, "This", "," ) + ") )" );
        }

        xarrEvents = XQuery( "for $elem in events where " + ArrayMerge( conds, "This", " and " ) + " order by $elem/start_date return $elem" );
        xarrEvents = ArrayDirect( xarrEvents );
        if( global_settings.settings.check_access_on_lists && Request != null )
        {
            if( iMaxCnt != undefined )
            {
                var arrTempArray = new Array();
                var iCount = 0;
                for( _event in xarrEvents )
                {
                    if( tools_web.check_access( _event.id, iUserID, teUser, Request.Session ) )
                    {
                        arrTempArray.push( _event );
                        iCount++;
                    }
                    if( iCount >= iMaxCnt )
                    {
                        break;
                    }
                }
                xarrEvents = arrTempArray;
            }
            else
            {
                xarrEvents = ArraySelect( xarrEvents, "tools_web.check_access( This.id, iUserID, teUser, Request.Session )" );
            }
        }
        else if( iMaxCnt != undefined )
            xarrEvents = ArrayRange( xarrEvents, 0, iMaxCnt );

        xarrEvents = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrEvents, oPagingParam, oSortParam ] ).oResult;

        oRes.array = get_list_events( xarrEvents, { bGetImage: true, bGetUrl : true, bUseTimezone: bUseTimezone, catDefaultTimezone: catDefaultTimezone, catUserTimezone: catUserTimezone } )
    }
    return oRes
}

/**
 * @typedef {Object} WTEventCalendarEventsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEvent[]} array
 */
/**
 * @function GetEventCalendarEvents
 * @memberof Websoft.WT.Event
 * @description Получения списка мероприятий сотрудника.
 * @param {bigint} iUserID - ID пользователя
 * @param {string} [sSearchWord] - Строка для поиска
 * @param {string} [sType] - Принадлежность мероприятия ( all/my/mysub )
 * @param {string} [sStatus] - Статус мероприятия
 * @param {bigint} [iPlace] - Расположение мероприятия
 * @param {bigint} [iEducationOrg] - Обучающая организация
 * @param {string} [sOrgForm] - Организационная форма
 * @param {string} [sEventForm] - Форма проведения
 * @param {bigint} [iLector] - Преподаватель, в мероприятии
 * @param {bigint} [iEducationProgram] - Набор программ
 * @param {boolean} [bShowOnlySamePlace] - Отображать только мероприятия из расположения сотрудника
 * @param {boolean} [bCheckHirePlace] - Учитывать расположения вниз по иерархии
 * @param {string} [sUserType] - Тип участия в мероприятии через ; ( participant/lector/tutor )
 * @param {date} [dStartDate] - Дата с
 * @param {date} [dEndDate] - Дата по
 * @param {boolean} [bShowOnlyOpen] - Показывать только открытие мероприятия
 * @param {boolean} [bShowOnlyPublic] - Показывать только публичные мероприятия
 * @param {bigint} [iEventType] - Тип мероприятия
 * @returns {WTEventCalendarEventsResult}
 */
function GetEventCalendarEvents( iUserID,  sSearchWord, sType, sStatus, iPlace, iEducationOrg, sOrgForm, sEventForm, iLector, iEducationProgram, bShowOnlySamePlace, bCheckHirePlace, sUserType, dStartDate, dEndDate, bShowOnlyOpen, bShowOnlyPublic, iEventType )
{
    oParams = {
        sSearchWord: sSearchWord,
        sType: sType,
        sStatus: sStatus,
        iPlace: iPlace,
        iEventType: iEventType,
        iEducationOrg: iEducationOrg,
        sOrgForm: sOrgForm,
        sEventForm: sEventForm,
        iLector: iLector,
        iEducationProgram: iEducationProgram,
        bShowOnlySamePlace: bShowOnlySamePlace,
        bCheckHirePlace: bCheckHirePlace,
        sUserType: sUserType,
        dStartDate: dStartDate,
        dEndDate: dEndDate,
        bShowOnlyOpen: bShowOnlyOpen,
        bShowOnlyPublic: bShowOnlyPublic,
        sView: "lib"
    };
    return get_event_calendar_events( iUserID, null, null, null, null, oParams );
}

function get_event_calendar_events( iUserID, teUser, oPagingParam, oSortParam, Request, oParams, sLngShortId, oLngItems, arrFilters, arrDistincts, sXQueryQual, sAccessType, sApplication )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.paging = oPagingParam;
    oRes.array = [];
    oRes.data = ({});
    function get_param_value( sParamName, sDefaultValue )
    {
        sParamValue = oParams.GetOptProperty( sParamName, sDefaultValue )
        try
        {
            if( sParamValue == undefined || sParamValue == null || sParamValue == "" )
                return sDefaultValue;

        }
        catch( ex )
        {
            return sDefaultValue;
        }
        return sParamValue;
    }

    try
    {
        iUserID = Int( iUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        teUser.Name;
    }
    catch( ex )
    {
        try
        {
            teUser = OpenDoc( UrlFromDocID( iUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( ObjectType( oParams ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oParams = {};
    }
    try
    {
        if( Request == undefined || Request == null || Request == "" )
            throw "error";
    }
    catch( ex )
    {
        Request = null;
    }
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }
    try
    {
        if( sLngShortID == undefined || sLngShortID == null || sLngShortID == "" )
            throw "error";
    }
    catch( ex )
    {
        sLngShortID = "ru";
    }
    try
    {
        if( !IsArray( arrFilters ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        arrFilters = new Array();
    }
    try
    {
        if( ObjectType( oPagingParam ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oPagingParam = {SIZE: null, INDEX: 0};
    }
    try
    {
        if( ObjectType( oSortParam ) != "JsObject" )
            throw "error";
    }
    catch( ex )
    {
        oSortParam = {FIELD: null, DIRECTION: null};
    }
    if( !IsArray( arrDistincts ) )
    {
        arrDistincts = new Array();
    }
    var sSearchWord = get_param_value( "sSearchWord", "" );
    var sType = get_param_value( "sType", "all" );
    var sStatus = get_param_value( "sStatus", "all" );
    var sCategory = get_param_value( "sCategory", "" );
    var iPlace = OptInt( get_param_value( "iPlace", null ), null );
    var iEventType = OptInt( get_param_value( "iEventType", null ), null );
    var iEducationOrg = OptInt( get_param_value( "iEducationOrg", null ), null );
    var sOrgForm = get_param_value( "sOrgForm", "all" );
    var sEventForm = get_param_value( "sEventForm", "all" );
    var iLector = OptInt( get_param_value( "iLector", null ), null );
    var iEducationProgram = OptInt( get_param_value( "iEducationProgram", null ), null );
    var iMonth = OptInt( get_param_value( "iMonth", "" ), 0 );
    var iYear = OptInt( get_param_value( "iYear", "" ), 0 );
    var sSubType = get_param_value( "sSubType", "" );
    var sEventTypes = get_param_value( "sEventTypes", ArrayMerge( event_types, "This.code", "," ) );
    var sStatuses = get_param_value( "sStatuses", "plan;active;close;cancel" );
    var bShowOnlySamePlace = tools_web.is_true( get_param_value( "bShowOnlySamePlace", false ) );
    var bShowEducationalMethodName = tools_web.is_true( get_param_value( "bShowEducationalMethodName", false ) );
    var bShowDesc = tools_web.is_true( get_param_value( "bShowDesc", false ) );
    var sPostCode = get_param_value( "sPostCode", "" );
    var sColumnList = get_param_value( "sColumnList", "" );
    var bUseTimezone = tools_web.is_true( get_param_value( "bUseTimezone", "" ) );
    var sSortField = get_param_value( "sSortField", "" );
    var sSortDirection = get_param_value( "sSortDirection", "" );
    var bCheckHirePlace = tools_web.is_true( get_param_value( "bCheckHirePlace", "" ) );
    var iCategoryId = OptInt( get_param_value( "iCategoryId", "" ), null );
    var sUserType = get_param_value( "sUserType", "participant;lector;tutor" );
    var dStartDate = get_param_value( "dStartDate", "" );
    var dEndDate = get_param_value( "dEndDate", "" );
    var sView = get_param_value( "sView", "list" );
    var bCheckAccess = get_param_value( "bCheckAccess", null );
    if ( bCheckAccess == null || bCheckAccess == undefined)
        bCheckAccess = global_settings.settings.check_access_on_lists.Value;
    else
        bCheckAccess = tools_web.is_true( bCheckAccess );
    var iCurUserID = get_param_value( "iCurUserID", null );
    if ( iCurUserID == null || OptInt(iCurUserID) == undefined )
    {
        //alert( 'iCurUserID= '+tools.object_to_text( iCurUserID, 'json') );
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_12' );
        return oRes;
    }
    docCurUser = tools.open_doc( iCurUserID );
    if ( docCurUser == undefined )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaotkrytiya' ) + iCurUserID;
        return oRes;
    }
    teCurUser = docCurUser.TopElem;

    var bShowOnlyPublic = tools_web.is_true( get_param_value( "bShowOnlyPublic", false ) );
    var bShowOnlyOpen = tools_web.is_true( get_param_value( "bShowOnlyOpen", false ) );

    // const_start
    var sConstEventName = i18n.t( 'c_event' );
    // const_end
    function GetDirectSubPersonIds(iUserId)
    {
        arrCollaborators = new Array();
        arrPositions = XQuery("for $elem in positions where $elem/is_boss=true() and $elem/basic_collaborator_id = " + iUserId + " return $elem");
        arrSubdivisionIds = ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'subdivision' return $elem"),"object_id");
        arrCollaborators = ArrayExtract(XQuery("for $elem in positions where MatchSome( $elem/parent_object_id, (" + ArrayMerge(arrSubdivisionIds,"This",",") + ")) and $elem/basic_collaborator_id != " + iUserId + " return $elem"),"basic_collaborator_id");
        arrOrgIds = ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'org' return $elem"),"object_id");
        arrCollaborators = ArrayUnion(ArrayExtract(XQuery("for $elem in positions where MatchSome( $elem/org_id, (" + ArrayMerge(arrOrgIds,"This",",") + ")) and $elem/parent_object_id = null() and $elem/basic_collaborator_id != " + iUserId + " return $elem"),"basic_collaborator_id"),arrCollaborators);
        arrCollaborators = ArrayUnion(ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'collaborator' return $elem"),"object_id"),arrCollaborators);
        return arrCollaborators;
    }

    function get_date( dDate, bIn, catTimezone )
    {
        if( bUseTimezone )
        {
            if( bIn )
            {
                return tools_web.get_timezone_date( dDate, catUserTimezone, catDefaultTimezone )
            }
            else
            {
                return tools_web.get_timezone_date( dDate, catTimezone, catUserTimezone )
            }
        }
        else
            return dDate
    }

    try
    {
        bUseTimezone = tools_web.is_true( bUseTimezone );
        bCheckHirePlace = tools_web.is_true( bCheckHirePlace );
        var catDefaultTimezone = null;
        var catUserTimezone = null;
        if( bUseTimezone )
        {
            catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
            catUserTimezone = tools_web.get_timezone( iUserID, teUser );
            catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
        }

        arrEventTypes = tools_web.parse_multiple_parameter( sEventTypes );
        arrEventStatuses = tools_web.parse_multiple_parameter( sStatuses );
        iLector = OptInt( iLector, null );
        iPlace = OptInt( iPlace, null );
        iEducationOrg = OptInt( iEducationOrg, null );
        iCategoryId = OptInt( iCategoryId, null );
        iEducationProgram = OptInt( iEducationProgram, null );
        if( sUserType == "all" )
            sUserType = "participant;lector;tutor";

        var aFilterStatuses = null;
        var aFilterTypes = null;
        sDateQueryAdd = "";
        var sSearchCond = "";
        for( oFilter in arrFilters )
        {
            if(oFilter.type == "search" )
            {
                if ( oFilter.value != '' )
                {
                    sSearchCond = tools.create_search_condition(oFilter.value, "event");
                }
            }
            else
            {
                switch( oFilter.id )
                {
                    case "f_status_id":
                    {
                        if( ArrayOptFirstElem( oFilter.value ) != undefined )
                        {
                            aFilterStatuses = ArrayExtract( oFilter.value, "This.value" );
                        }
                        break;
                    }
                    case "f_type_id":
                    {
                        if( ArrayOptFirstElem( oFilter.value ) != undefined )
                        {
                            aFilterTypes = ArrayExtract( oFilter.value, "This.value" );
                        }
                        break;
                    }
                    case "start_date":
                    {
                        try
                        {
                            sDateQueryAdd += " and $elem/start_date >= date('" + get_date( Date( oFilter.value_from ), true ) + "')";
                        }
                        catch( ex ){}
                        try
                        {
                            sDateQueryAdd += " and $elem/start_date <= date('" + get_date( DateNewTime( Date( oFilter.value_to ), 23, 59, 59 ), true ) + "')";
                        }
                        catch( ex ){}
                        break;
                    }
                    case "finish_date":
                    {
                        try
                        {
                            sDateQueryAdd += " and $elem/finish_date >= date('" + get_date( Date( oFilter.value_from ), true ) + "')";
                        }
                        catch( ex ){}
                        try
                        {
                            sDateQueryAdd += " and $elem/finish_date <= date('" + get_date( DateNewTime( Date( oFilter.value_to ), 23, 59, 59 ), true ) + "')";
                        }
                        catch( ex ){}
                        break;
                    }
                }
            }
        }

        // Добавка к запросу для фильтрации по дате
        if(dEndDate != "")
            dEndDate = DateNewTime(Date(dEndDate),23,59,59);
        if(sView == "calendar" && dStartDate != "" && dEndDate != "")
        {
            dStartDate = get_date( dStartDate, true );
            dEndDate = get_date( dEndDate, true );
            sDateQueryAdd += " and (($elem/finish_date > date('" + dStartDate + "') and $elem/start_date < date('" + dEndDate + "') ) or ($elem/finish_date = null() and $elem/start_date > date('" + dStartDate + "') ) )";
        }
        else
        {
            if( dStartDate != "" )
            {
                dStartDate = get_date( dStartDate, true );
                sDateQueryAdd += " and ( $elem/finish_date > date('" + dStartDate + "') or $elem/finish_date = null()  )"
            }
            if( dEndDate != "" )
            {
                dEndDate = get_date( dEndDate, true );
                sDateQueryAdd += " and $elem/start_date < date('" + dEndDate + "')"
            }
        }
        iYear = OptInt( iYear, 0 )
        iMonth = OptInt( iMonth, 0 )
        if(sView != "calendar" && iYear != 0)
        {
            if(iMonth != 0)
            {
                dStartDate = Date("01." + StrInt(iMonth, 2) + "." + iYear);
                dEndDate = null;
                if(iMonth != 12)
                {
                    dEndDate = DateOffset(Date("01." + StrInt(iMonth + 1, 2) + "." + iYear), 0-1);
                }
                else
                {
                    dEndDate = DateOffset(Date("01.01." + (iYear + 1)), 0-1);
                }
            }
            else
            {
                dStartDate = Date("01.01." + iYear);
                dEndDate = Date("31.12." + iYear);
            }
            dStartDate = get_date( dStartDate, true );
            dEndDate = get_date( dEndDate, true );
            sDateQueryAdd += " and ($elem/finish_date > date('" + dStartDate + "') and $elem/start_date < date('" + dEndDate + "') )";
        }

        // Добавка к запросу для фильтрации по типу
        sTypeQueryAdd = "";

        if( aFilterTypes != null )
        {
            arrEventTypes = aFilterTypes;
            sType = "all";
        }

        if(ArrayOptFirstElem(arrEventTypes) != undefined)
            sTypeQueryAdd = " and MatchSome($elem/type_id, (" + ArrayMerge(arrEventTypes, "XQueryLiteral(This)", ",") + "))";

        if( iEventType != null )
        {
            if(sTypeQueryAdd != "")
                sTypeQueryAdd += " and  ";
            sTypeQueryAdd += " $elem/event_type_id = " + iEventType;
        }

        // Добавка к запросу для фильтрации по статусу
        sStatusQueryAdd = "";
        // Если пользователь смотрит свои мероприятия и является преподавателем или ответственным, он должен всегда видеть мероприятия с типом i18n.t( 'proekt' )
        if(StrLowerCase(sType) == "my" && ( StrContains( sUserType, "tutor" ) || StrContains( sUserType, "lector" ) ) && ArrayOptFind(arrEventTypes,"This=='project'") == undefined)
        {
            arrEventStatuses.push("project");
        }

        if( aFilterStatuses != null )
        {
            arrEventStatuses = aFilterStatuses;
            sStatus = "all";
        }
        if(sStatus == "all")
        {
            if(ArrayOptFirstElem(arrEventStatuses) != undefined)
                sStatusQueryAdd = " and MatchSome($elem/status_id, (" + ArrayMerge(arrEventStatuses, "XQueryLiteral(This)", ",") + "))";
        }
        else
        {
            sStatusQueryAdd = " and $elem/status_id = " + XQueryLiteral(sStatus);
        }

        arrEvents = new Array();
        switch(StrLowerCase(sType))
        {
            case "all":
                // Находим все публичные
                sQuery = "for $elem in events where $elem/is_public=true() ";
                sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                sQuery +=  " return $elem";

                arrEvents = XQuery(sQuery);

                // Находим все, где я участник
                sQuery = "for $elem in event_collaborators where $elem/collaborator_id = " + iUserID;
                sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                sQuery +=  " return $elem";

                arrEvents = ArrayUnion( arrEvents, XQuery(sQuery) );

                // Находим все, где я преподаватель
                sQuery = "for $elem in event_lectors where $elem/person_id = " + iUserID;
                sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                sQuery +=  " return $elem";

                arrEvents = ArrayUnion( arrEvents, XQuery(sQuery) );
                break;
            case "my":
                if( sUserType == "" )
                    break;

                for( catType in String( sUserType ).split( ";" ) )
                {
                    switch(catType)
                    {
                        case "participant":
                            sQuery = "for $elem in event_collaborators where $elem/collaborator_id = " + iUserID + " and $elem/is_collaborator=true()";
                            sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                            sQuery +=  " return $elem";
                            arrEvents = ArrayUnion( arrEvents, XQuery(sQuery));
                            break;

                        case "lector":
                            arrLectors = XQuery( 'for $elem in lectors where $elem/person_id = ' + iUserID + ' and $elem/is_dismiss != true() return $elem' );
                            for ( _lector in arrLectors )
                            {
                                sQuery = "for $elem in event_lectors where $elem/lector_id = " + _lector.id;
                                sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                                sQuery += " return $elem";
                                arrEvents = ArrayUnion( arrEvents, XQuery(sQuery));

                            }
                            break

                        case "tutor":
                            sQuery = "for $elem in event_collaborators where $elem/collaborator_id = " + iUserID + " and ($elem/is_tutor=true() or $elem/is_preparation=true()) ";
                            sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                            sQuery +=  " return $elem";

                            arrEvents = ArrayUnion( arrEvents, XQuery(sQuery));
                            break;

                    }
                }
                break;
            case "mysub":
                arrCollaborators = tools.call_code_library_method( "libMain", "GetTypicalSubordinates", [ iUserID, (sSubType == "direct" ? "subordinates" : "all_subordinates")] );
                if(ArrayOptFirstElem(arrCollaborators) != undefined)
                {

                    arrEvents = XQuery(StrReplace("for $elem_qc in event_collaborators where MatchSome( $elem_qc/collaborator_id, (" + ArrayMerge(arrCollaborators,"PrimaryKey",",") + "))" + sDateQueryAdd +" return $elem_qc", "$elem/", "$elem_qc/"));

                    if(sView == "calendar")
                    {
                        arrEvents = ArraySelect( arrEvents, "DateNewTime(start_date)>=dStartDate&&DateNewTime(start_date)<=dEndDate" );
                    }

                    sTypeQueryAdd = "";
                    for(sEventType in arrEventTypes)
                    {
                        if(sEventType != "")
                        {
                            if(sTypeQueryAdd != "")
                                sTypeQueryAdd += " || ";
                            sTypeQueryAdd += " type_id=='" + sEventType + "'";
                        }
                    }
                    if(sTypeQueryAdd != "")
                        arrEvents = ArraySelect( arrEvents, sTypeQueryAdd );

                    sStatusQueryAdd = "";
                    if(sStatus == "all")
                    {
                        for(_status in arrEventStatuses)
                        {
                            if(_status != "")
                            {
                                if(sStatusQueryAdd != "")
                                    sStatusQueryAdd += " || ";
                                sStatusQueryAdd += (" status_id=='" + _status + "'");
                            }
                        }
                    }
                    else
                    {
                        sStatusQueryAdd = "status_id=='" + sStatus + "'";
                    }
                    if(sStatusQueryAdd != "")
                    {
                        arrEvents = ArraySelect( arrEvents, sStatusQueryAdd );
                    }
                    arrEvents = ArraySelectDistinct( arrEvents, "event_id" );
//					arrEvents = ArrayExtract(arrEvents, "event_id");
                }
                break;
        }

        sAdditionCond = "";
        if( bShowOnlyOpen )
        {
            sAdditionCond += " and $elem_qc/is_open = true()";
        }
        if( bShowOnlyPublic )
        {
            sAdditionCond += " and $elem_qc/is_public = true()";
        }
        sAdditionCond += " and $elem_qc/is_model = false()";

        if ( !IsEmptyValue(sXQueryQual) )
            sAdditionCond += " and " + sXQueryQual;

        if(sAccessType == "auto")
        {
            iApplicationID = OptInt(sApplication);
            if(iApplicationID != undefined)
            {
                sApplication = ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
            }
            var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );

            if(iApplLevel >= 10)
            {
                sAccessType = "admin";
            }
            else if(iApplLevel >= 7)
            {
                sAccessType = "manager";
            }
            else if(iApplLevel >= 5)
            {
                sAccessType = "admin_workspace";
            }
            else if(iApplLevel >= 3)
            {
                sAccessType = "moderator";
            }
            else if(iApplLevel >= 1)
            {
                sAccessType = "observer";
            }
            else
            {
                sAccessType = "reject";
            }
        }

        switch(sAccessType)
        {
            case "admin_workspace":
            case "moderator":
            case "observer":
            case "reject":
            {
                sAdditionCond = "$elem/id = 0";
                break;
            }
        }

        sEventsQuery = "for $elem_qc in events where MatchSome($elem_qc/id, (" + ArrayMerge(arrEvents, "This.Name == 'event' ? This.id.Value : This.event_id.Value", ",") + ")) ";
        sEventsQuery += sAdditionCond;
        if(sSearchCond != "")
            sEventsQuery += " and " + sSearchCond;

        if( sSortField != "" && sSortDirection != "" )
            sEventsQuery += " order by $elem_qc/" + sSortField + ( sSortDirection == "ASC" ? " ascending " : " descending " )
        sEventsQuery += " return $elem_qc";

        arrEvents = XQuery(StrReplace(sEventsQuery, "$elem/", "$elem_qc/"));

        //Если указано расположение, отбираем по нему

        xarrUserPlacesIds = new Array();
        if( bShowOnlySamePlace ) // Показ только мероприятий, совпадающих по расположению с подразделением участника
        {

            if( teUser.position_parent_id.HasValue && teUser.position_parent_id.ForeignElem != undefined)
            {
                iParentId = teUser.position_parent_id;
                do
                {
                    teSub = OpenDoc(UrlFromDocID( iParentId )).TopElem;
                    if(teSub.place_id.HasValue)
                    {
                        xarrUserPlacesIds.push(teSub.place_id);
                        if( bCheckHirePlace )
                            xarrUserPlacesIds = ArrayUnion( xarrUserPlacesIds, ArrayExtract(XQuery("CatalogHierSubset('places', " + teSub.place_id + ")"), "PrimaryKey") );
                    }
                    iParentId = teSub.parent_object_id;
                }
                while( teSub.parent_object_id.HasValue && teSub.parent_object_id.OptForeignElem != undefined )
            }
        }

        if(iPlace != 0 && iPlace != null)
        {
            xarrPlacesIds = new Array();
            if( bCheckHirePlace )
                xarrPlacesIds = ArrayExtract(XQuery("CatalogHierSubset('places', " + iPlace + ")"), "PrimaryKey");
            xarrPlacesIds.push(iPlace);
            if( bShowOnlySamePlace )
                xarrPlacesIds = ArrayIntersect( xarrPlacesIds, xarrUserPlacesIds, "This", "This" )
        }
        else
            xarrPlacesIds = xarrUserPlacesIds;

        //Если указана обучающая организация, отбираем по ней
        if(iEducationOrg != 0 && iEducationOrg != null)
        {
            arrEvents = ArraySelect(arrEvents, "This.education_org_id.HasValue && This.education_org_id == " + iEducationOrg );
        }
        //Если указано расположение, отбираем по нему
        if((iPlace != 0 && iPlace != null) || bShowOnlySamePlace)
        {
            arrEvents = ArraySelect(arrEvents, "This.place_id.HasValue && ArrayOptFind(xarrPlacesIds, 'This == ' + This.place_id) != undefined");
        }

        if(iCategoryId != 0 && iCategoryId != null)
        {
            arrEvents = ArraySelect(arrEvents, "This.role_id.ByValueExists( iCategoryId ) " );
        }

        //Если указана организационная форма, отбираем по ней
        if(sOrgForm != "all")
        {
            arrEvents = ArraySelect(arrEvents, "This.organizational_form.HasValue && This.organizational_form == " + XQueryLiteral( String( sOrgForm ) ) );
        }

        //Если указана форма проведения, отбираем по ней
        if(sEventForm != "all")
        {
            arrEvents = ArraySelect(arrEvents, "This.event_form.HasValue && This.event_form == " + XQueryLiteral( String( sEventForm ) ));
        }

        //Если указан набор програм - отбираем по нему
        if(iEducationProgram != 0 && iEducationProgram != null)
        {
            arrEvents = ArraySelect(arrEvents, "This.education_program_id.HasValue && This.education_program_id == " + iEducationProgram );
        }

        if(iLector != 0 && iLector != null)
        {
            xarrLectorEventsIds = ArrayExtract(XQuery("for $elem in event_lectors where $elem/lector_id = " + iLector + " return $elem"), "event_id");
            arrEvents = ArraySelect(arrEvents, "ArrayOptFind(xarrLectorEventsIds, 'This == ' + This.id) != undefined");
        }

        // получение entrys для полей фильтра типа select
        if(ArrayOptFirstElem(arrDistincts) != undefined)
        {
            oRes.data.SetProperty("distincts", {});
            for(sFieldName in arrDistincts)
            {
                oRes.data.distincts.SetProperty(sFieldName, []);
                switch(sFieldName)
                {
                    case "f_status_id":
                    {
                        arrDistinctStates = new Array();
                        for( _state in ArrayIntersect(arrEventStatuses, arrEvents, "This", "status_id") )
                        {
                            arrDistinctStates.push( { "name": common.event_status_types.GetChildByKey( _state ).name.Value, "value": _state } )
                        }
                        oRes.data.distincts.SetProperty( "f_status_id", arrDistinctStates );
                        break;
                    }
                    case "f_type_id":
                    {
                        arrDistinctTypes = new Array();
                        for( _state in ArrayIntersect(arrEventTypes, arrEvents, "This", "type_id") )
                        {
                            arrDistinctTypes.push( { "name": common.event_types.GetChildByKey( _state ).name.Value, "value": _state } )
                        }
                        oRes.data.distincts.SetProperty( "f_type_id", arrDistinctTypes );
                        break;
                    }
                }
            }
        }

        if( oSortParam.GetOptProperty( "FIELD", null ) != null && oSortParam.GetOptProperty( "DIRECTION", null ) != null )
        {
            arrEvents = ArraySort( arrEvents, oSortParam.FIELD, ( oSortParam.DIRECTION == "ASC" ? "+" : "-" ) );
        }

        var iStartIndex = null;
        var bPage = false;
        var iSize = OptInt( oPagingParam.GetOptProperty( "SIZE" ), null );
        var iFinishIndex = null;
        oPagingParam.SetProperty( "TOTAL", ArrayOptSize( arrEvents ) );
        if( iSize != null )
        {
            bPage = true;
            oPagingParam.SetProperty( "MANUAL", true );

            if( OptInt( oPagingParam.GetOptProperty( "START_INDEX" ), null ) != null )
            {
                iStartIndex = OptInt( oPagingParam.GetOptProperty( "START_INDEX" ), null );
            }
            else
            {
                iStartIndex = iSize * OptInt( oPagingParam.GetOptProperty( "INDEX" ), 0 );
            }
            iFinishIndex = iStartIndex+iSize;
        }

        RESULT = new Array();
        aListColumns = String( sColumnList ).split( ";" );

        var arrTempList = new Array();
        var iCurEventCount = 0-1;
        for(catEvent in arrEvents)
        {
            if( bCheckAccess )
            {
                if( !tools_web.check_access( catEvent.id, iCurUserID, teCurUser, ( Request != null ? Request.Session : null ) ) )
                {
                    oPagingParam.TOTAL--;
                    continue;
                }
            }
            iCurEventCount++;
            if( bPage )
            {
                if( iCurEventCount < iStartIndex )
                {
                    continue;
                }
                else if( iCurEventCount >= iFinishIndex )
                {
                    break;
                }
            }
            arrTempList.push( catEvent );
        }
        if( sView == "list" || sView == "tiles" || sView == "calendar" )
        {

            for(catEvent in arrTempList)
            {
                try
                {
                    sDataClass = tools_web.get_class_for_status( catEvent.status_id );

                    catEventTimezone = null;
                    if( bUseTimezone )
                    {
                        catEventTimezone = tools_web.get_timezone( catEvent.id, catEvent );
                        catEventTimezone = catEventTimezone.HasValue ? catEventTimezone.ForeignElem : null;
                    }

                    sName = "";
                    if(bShowEducationalMethodName && catEvent.education_method_id.HasValue && (catEvent.education_method_id.OptForeignElem != undefined) )
                    {
                        sName = tools_web.get_cur_lng_name( catEvent.education_method_id.ForeignElem.name.Value, sLngShortID );
                    }
                    else
                    {
                        sName = tools_web.get_cur_lng_name( catEvent.name.Value, sLngShortID );
                    }

                    if(catEvent.event_type_id.HasValue)
                    {
                        if(catEvent.event_type_id.OptForeignElem != undefined)
                        {
                            sType = tools_web.get_cur_lng_name( catEvent.event_type_id.OptForeignElem.name.Value, sLngShortID );
                        }
                        else
                        {
                            sType = i18n.t( 'c_deleted' );
                        }
                    }
                    else
                    {
                        sType = common.event_types.GetOptChildByKey( catEvent.type_id ).name.Value;
                    }
                    if(sView == "list")
                    {

                        if(bShowDesc)
                        {
                            sDesc = OpenDoc(UrlFromDocID(catEvent.PrimaryKey)).TopElem.comment.Value;
                        }
                        else
                        {
                            sDesc = ""
                        }

                        oResult = {"id":catEvent.id.Value,"name":sName,"type":sType, "f_status_id": catEvent.status_id.Value, "status_id":common.event_status_types.GetChildByKey( catEvent.status_id ).name.Value, "start_date":StrDate( get_date( catEvent.start_date, false, catEventTimezone ), true, false), "finish_date":StrDate( get_date( catEvent.finish_date, false, catEventTimezone ), true, false), "class": sDataClass, "desc": sDesc};
                        for( elem in aListColumns )
                        {
                            if( oResult.GetOptProperty( elem ) != undefined )
                                continue;
                            if( catEvent.ChildExists( elem ) )
                                oResult.SetProperty( elem, catEvent.Child( elem ).Value )
                        }
                    }
                    else
                    {
                        docEvent = OpenDoc(UrlFromDocID(catEvent.PrimaryKey));
                        teEvent = docEvent.TopElem;
                        sCategoryName = "";
                        if(sCategory != "")
                        {
                            if(sCategory == "education_method_id" && false)
                            {
                                sCategoryName = "";
                            }
                            else
                            {

                                if(teEvent.Child(sCategory).HasValue && teEvent.Child(sCategory).OptForeignElem != undefined)
                                {
                                    sCategoryName = teEvent.Child(sCategory).ForeignElem.name.Value;
                                }
                                else
                                {
                                    // Обучающая организация может быть введена текстом, а не ссылкой на объект
                                    if(sCategory == "education_org_id" && teEvent.education_org_name.HasValue)
                                    {
                                        sCategoryName = teEvent.education_org_name.Value;
                                    }
                                }
                            }
                        }
                        if(bShowDesc)
                        {
                            sDesc = "";

                            sDesc += sConstEventName + ": " +  tools_web.get_cur_lng_name( teEvent.name, sLngShortID ) + ".";
                            if(teEvent.start_date.HasValue)
                            {
                                sDesc += " " + i18n.t( 'c_time' ) + ": " + StrTime( get_date( teEvent.start_date, false, catEventTimezone ) );
                                if( teEvent.finish_date.HasValue )
                                    sDesc += " - " + StrTime( get_date( teEvent.finish_date, false, catEventTimezone ) ) + ".";
                                else
                                    sDesc += ".";
                            }
                            if(teEvent.place_id.HasValue && teEvent.place_id.OptForeignElem != undefined)
                                sDesc += " " + i18n.t( 'c_place' ) + ": " + tools_web.get_cur_lng_name( teEvent.place_id.ForeignElem.name, sLngShortID ) + ".";
                            if(teEvent.place.HasValue)
                                sDesc += " " + i18n.t( 'c_action_place' ) + ": " + teEvent.place +  ".";
                            if(ArrayOptFirstElem(teEvent.lectors) != undefined)
                            {
                                sLectorStr = '';
                                for ( fldLector in teEvent.lectors )
                                {
                                    catLector = fldLector.PrimaryKey.OptForeignElem;
                                    if(catLector != undefined)
                                    {
                                        if(catLector.type == "invitee")
                                            sLectorStr = sLectorStr + ( sLectorStr == '' ? '' : ', ' ) + catLector.lector_fullname;
                                        else
                                            sLectorStr = sLectorStr + ( sLectorStr == '' ? '' : ', ' ) + catLector.person_fullname;
                                    }
                                }
                                if(sLectorStr != "")
                                    sDesc += " " + i18n.t( 'vllec_title' ) + ": " + XmlAttrEncode( sLectorStr ) + ".";
                            }
                        }
                        else
                        {
                            sDesc = sName;
                        }
                        oResult = {"id":catEvent.PrimaryKey.Value,"name":sName, "desc":String(sDesc), "type":sType, "f_status_id": teEvent.status_id.Value, "status_id": common.event_status_types.GetChildByKey( teEvent.status_id ).name.Value, "start_date":StrDate( get_date( teEvent.start_date, false, catEventTimezone ), true, false), "finish_date":StrDate( get_date( teEvent.finish_date, false, catEventTimezone ), true, false), "category": sCategoryName, "formatfld":"d.m.Y H:i", "class": sDataClass};

                    }
                    if(sPostCode != "")
                        tools.safe_execution( sPostCode );
                    if(oResult != null)
                        RESULT.push(oResult);
                }
                catch(x)
                {
                    alert(x);
                }
            }
        }
        else
        {
            RESULT = get_list_events( arrTempList, { bGetImage: true, bGetUrl : true, bUseTimezone: bUseTimezone, catDefaultTimezone: catDefaultTimezone, catUserTimezone: catUserTimezone } );
        }
    }
    catch(x)
    {
        oRes.error = 1;
        oRes.errorText = x;
        oRes.paging = {};
        return oRes;
    }

    oRes.paging = oPagingParam;
    oRes.array = RESULT

    return oRes
}

/** @typedef {Object} oEducationPlan
 * @property {bigint} id
 * @property {string} name
 * @property {string} status_name
 * @property {date} create_date
 * @property {string} link
 * @property {string} compound_program_image_url
 */
/**
 * @typedef {Object} WTPersonEducationPlansResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEducationPlan[]} array
 */
/**
 * @function GetPersonEducationPlans
 * @memberof Websoft.WT.Event
 * @author PL
 * @description Получения списка планов обучения сотрудника.
 * @param {bigint} iPersonID - ID пользователя
 * @param {string} sStateID - статус плана обучения
 * @returns {WTPersonEducationPlansResult}
 */
function GetPersonEducationPlans( iPersonID, sStateID )
{
    return get_user_education_plans( iPersonID, sStateID )
}

function get_user_education_plans( iPersonID, sStateID, arrFilters )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    oRes.data = ({});

    try
    {
        if( !IsArray( arrFilters ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        arrFilters = new Array();
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    function get_filter_state( _state_id )
    {
        switch( _state_id )
        {
            case 0:
            case 1:
                return i18n.t( 'aktivnyy' );
            default:
                return i18n.t( 'zavershennyy' );
        }
        return "";
    }
    sSearchWord = "";
    for( oFilter in arrFilters )
    {
        if(oFilter.type == "search" )
        {
            if(oFilter.value != "")
            {
                sSearchWord = oFilter.value;
            }
        }
        else
        {
            switch( oFilter.id )
            {
                case "f_status_id":
                {
                    aFilterStatuses = ArrayExtract( oFilter.value, "This.value" );
                    if( ArrayOptFind( aFilterStatuses, "This == 'active'" ) != undefined && ArrayOptFind( aFilterStatuses, "This == 'finished'" ) != undefined )
                    {
                        sStateID = "all";
                    }
                    else if( ArrayOptFind( aFilterStatuses, "This == 'active'" ) != undefined )
                    {
                        sStateID = "active";
                    }
                    else if( ArrayOptFind( aFilterStatuses, "This == 'finished'" ) != undefined )
                    {
                        sStateID = "finished";
                    }
                    break;
                }
            }
        }
    }
    oRes.data.SetProperty( "distincts", ({}) );
    arrDistinctStates = new Array();
    arrDistinctStates.push( { "name": i18n.t( 'vprocesse' ), "value": "active" } );
    arrDistinctStates.push( { "name": i18n.t( 'arhiv' ), "value": "finished" } )
    oRes.data.distincts.SetProperty( "f_status_id", arrDistinctStates );
    sStatusQual = "";
    switch( sStateID )
    {
        case "active":
            sStatusQual = " and MatchSome( $elem/state_id, ( 0, 1 ) )";
            break;
        case "finished":
            sStatusQual = " and MatchSome( $elem/state_id, ( 2, 3, 4, 5, 6 ) )";
            break;
    }

    xarrGroupCollaborators = XQuery( "for $elem in group_collaborators where $elem/collaborator_id = " + iPersonID + " return $elem/Fields('group_id')" );

    xarrObjects = ArrayExtract( xarrGroupCollaborators, "This.group_id" );

    conds = new Array();
    conds.push( "( $elem/type = 'collaborator' and $elem/person_id = " + iPersonID + " )" );
    if( ArrayOptFirstElem( xarrObjects ) != undefined )
    {
        conds.push( "( $elem/type = 'group' and MatchSome( $elem/object_id, ( " + ArrayMerge( xarrObjects, "This", "," ) + " ) ) )" );
    }
    if( sSearchWord != "" )
    {
        sStatusQual += " and doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( String( sSearchWord ) ) + " )";
    }

    xarrEducationPlans = XQuery( "for $elem in education_plans where ( " + ArrayMerge( conds, "This", " or " ) + " ) " + sStatusQual + " return $elem" );
    arrCompoundPrograms = ArraySelectDistinct( ArraySelect( xarrEducationPlans, "This.compound_program_id.HasValue" ), "This.compound_program_id" );
    xarrCompoundPrograms = new Array();
    if( ArrayOptFirstElem( arrCompoundPrograms ) != undefined )
    {
        xarrCompoundPrograms = XQuery( "for $elem_qc in compound_programs where MatchSome( $elem_qc/id, ( " + ArrayMerge( arrCompoundPrograms, "This.compound_program_id", "," ) + " ) ) return $elem_qc" );
    }
    for( _ep in xarrEducationPlans )
    {
        catCompoundProgram = undefined;
        if( _ep.compound_program_id.HasValue )
        {
            catCompoundProgram = ArrayOptFindByKey( xarrCompoundPrograms, _ep.compound_program_id, "id" );
        }
        oRes.array.push( {
            "id": _ep.id.Value,
            "name": _ep.name.Value,
            "type": ( _ep.type == "group" ? i18n.t( 'gruppovoy' ) : i18n.t( 'personalnyy' ) ),
            "object_name": _ep.object_name.Value,
            "status_id": _ep.state_id.Value,
            "filter_state": get_filter_state( _ep.state_id ),
            "status_name": _ep.state_id.ForeignElem.name.Value,
            "create_date": _ep.create_date.Value,
            "plan_date": _ep.plan_date.Value,
            "compound_program_image_url": ( catCompoundProgram != undefined ? get_object_image_url( catCompoundProgram ) : "" ),
            "link": get_object_link( "education_plan", _ep.id ) } );
    }
    return oRes;
}

/** @typedef {Object} oEducationPlanProgram
 * @property {string} id
 * @property {string} name
 * @property {string} parent_id
 * @property {string} status_name
 * @property {string} type_name
 * @property {string} link
 */
/**
 * @typedef {Object} WTEducationPlanProgramsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEducationPlanProgram[]} array
 */
/**
 * @function GetEducationPlanPrograms
 * @memberof Websoft.WT.Event
 * @description Получения списка этапов учебного плана.
 * @param {bigint} iEducationPlanID - ID учебного плана
 * @returns {WTEducationPlanProgramsResult}
 */
function GetEducationPlanPrograms( iEducationPlanID )
{
    return get_education_plan_programs( iEducationPlanID )
}
function get_education_plan_programs( iEducationPlanID, teEducationPlan )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        iEducationPlanID = Int( iEducationPlanID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_13' ), false );
        return oRes;
    }
    try
    {
        teEducationPlan.Name;
    }
    catch( ex )
    {
        try
        {
            teEducationPlan = OpenDoc( UrlFromDocID( iEducationPlanID ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_13' ), false );
            return oRes;
        }
    }

    for( _program in teEducationPlan.programs )
    {
        oProgram = new Object();
        oProgram.id = _program.id.Value;
        oProgram.name = _program.name.Value;
        oProgram.status_name = ""
        if( _program.state_id.HasValue )
        {
            oProgram.status_name = _program.state_id.ForeignElem.name.Value;
        }
        oProgram.parent_id = _program.parent_progpam_id.Value;
        oProgram.type_name = get_education_plan_program_type_name( _program );
        oProgram.link = get_education_plan_program_link( _program );
        oRes.array.push( oProgram );
    }
    return oRes;
}
function get_education_plan_program_link( oProgram )
{
    switch( oProgram.type )
    {
        case "folder":
            return "";
        case "education_method":
            if( !oProgram.education_method_id.HasValue )
                return "";
            var feEducationMethod = oProgram.education_method_id.OptForeignElem;
            if( feEducationMethod == undefined )
                return "";
            if( feEducationMethod.type == "course" )
            {
                return feEducationMethod.course_id.HasValue ? get_object_link( null, feEducationMethod.course_id ) : "";
            }
            else
            {
                return oProgram.education_method_id.HasValue ? get_object_link( null, oProgram.education_method_id ) : "";
            }
        default:
            return oProgram.object_id.HasValue ? get_object_link( null, oProgram.object_id ) : "";
    }
}
function get_education_plan_program_type_name( oProgram, oLngItems )
{
    try
    {
        if( ObjectType( oLngItems ) != "JsObject" && ObjectType( oLngItems ) != "object" )
            throw "error";
    }
    catch( ex )
    {
        oLngItems = lngs.GetChildByKey( global_settings.settings.default_lng.Value ).items;
    }
    switch( oProgram.type )
    {
        case "folder":
            return i18n.t( 'c_phase' );
        case "course":
            return i18n.t( 'c_course' );
        case "assessment":
            return i18n.t( 'c_test' );
        case "learning_task":
            return i18n.t( 'zzzv3sxxx47yyy' );
        case "education_program":
            return i18n.t( 'c_edu_prog' );
        case "education_method":
            return i18n.t( 'c_edu_method' );
        case "notification_template":
            return i18n.t( 'rassylkainform' );
        case "material":
            return i18n.t( 'izucheniemateri' ) + ' - ' + ( oProgram.catalog_name.HasValue ? common.exchange_object_types.GetOptChildByKey( oProgram.catalog_name ).web_title : "" );
    }
}
/** @typedef {Object} oCompoundProgramProgram
 * @property {string} id
 * @property {string} name
 * @property {string} parent_id
 * @property {string} duration
 * @property {string} required
 * @property {string} comment
 * @property {number} cost
 * @property {number} person_num
 * @property {string} type_name
 * @property {string} link
 */
/**
 * @typedef {Object} WTCompoundProgramProgramsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oCompoundProgramProgram[]} array
 */
/**
 * @function GetCompoundProgramPrograms
 * @memberof Websoft.WT.Event
 * @description Получения списка этапов модульной программы.
 * @param {bigint} iCompoundProgramID - ID модульной программы
 * @returns {WTCompoundProgramProgramsResult}
 */
function GetCompoundProgramPrograms( iCompoundProgramID )
{
    return get_compound_program_programs( iCompoundProgramID )
}
function get_compound_program_programs( iCompoundProgramID, teCompoundProgram )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        iCompoundProgramID = Int( iCompoundProgramID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_14' ), false );
        return oRes;
    }
    try
    {
        teCompoundProgram.Name;
    }
    catch( ex )
    {
        try
        {
            teCompoundProgram = OpenDoc( UrlFromDocID( iCompoundProgramID ) ).TopElem;
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_14' ), false );
            return oRes;
        }
    }

    for( _program in teCompoundProgram.programs )
    {
        if( _program.type == "notification_template" )
        {
            continue;
        }
        oProgram = new Object();
        oProgram.id = _program.id.Value;
        oProgram.name = _program.name.Value;
        oProgram.parent_id = _program.parent_progpam_id.Value;
        oProgram.duration = _program.days.Value;
        oProgram.required = ( _program.required ? i18n.t( 'da' ) : i18n.t( 'net' ) );
        oProgram.comment = _program.comment.Value;
        oProgram.person_num = _program.person_num.Value;
        oProgram.cost = _program.cost.Value;
        oProgram.type_name = get_education_plan_program_type_name( _program );
        oProgram.link = get_education_plan_program_link( _program );
        oRes.array.push( oProgram );
    }
    return oRes;
}

function update_education_plan( iEducationPlanID, docEducationPlan, iPersonID, bIgnoreNotUpdate )
{
    function set_error( iError, sErrorText, bResult )
    {
        oRes.error = iError;
        oRes.errorText = sErrorText;
        oRes.result = bResult;
    }
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre' ), false );
        return oRes;
    }

    try
    {
        if( bIgnoreNotUpdate == undefined || bIgnoreNotUpdate == null )
            throw '';
    }
    catch( ex )
    {
        bIgnoreNotUpdate = false;
    }

    try
    {
        iEducationPlanID = Int( iEducationPlanID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_13' ), false );
        return oRes;
    }
    try
    {
        docEducationPlan.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEducationPlan = OpenDoc( UrlFromDocID( iEducationPlanID ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_13' ), false );
            return oRes;
        }
    }
    function check_access_plan()
    {
        switch( teEducationPlan.type )
        {
            case "collaborator":
                return teEducationPlan.person_id == iPersonID;

            case "group":
                return ArrayOptFirstElem( XQuery( "for $i in group_collaborators where $i/group_id = " + teEducationPlan.object_id + " and $i/collaborator_id = " + iPersonID + " return $i" ) ) != undefined;
        }
        return false;
    }

    var tePerson = null;
    teEducationPlan = docEducationPlan.TopElem;
    if( !check_access_plan() )
    {
        set_error( 1, i18n.t( 'usotrudnikanet' ), false );
        return oRes;
    }
    if( !teEducationPlan.update_status_and_activity && !bIgnoreNotUpdate )
        return oRes;
    function get_person()
    {
        if( tePerson == null )
        {
            tePerson = OpenDoc( UrlFromDocID( iPersonID ) ).TopElem;
        }
        return tePerson;
    }

    function check_is_assist_event( catEventCollaborator )
    {

        catEventResult = ArrayOptFind( get_learning_objects( "event_results" ), "This.event_id == catEventCollaborator.event_id" );
        if( catEventResult != undefined )
        {
            return catEventResult.is_assist ? 4 : 3;
        }
        return 3;
    }

    function check_active_learning( _object_id, _cat_program, sType, iCheckedObjectId )
    {
        if( !_object_id.HasValue )
        {
            return _cat_program.state_id.Value;
        }
        if( OptInt( iCheckedObjectId ) != undefined )
        {
            _cat_program = ArrayOptFindByKey( _cat_program.result_objects, OptInt( iCheckedObjectId ), "object_id" );
        }
        if( _cat_program == undefined )
        {
            return 0;
        }
        sFieldName = sType == "learnings" ? "course_id" : "assessment_id";

        oLearning = ArrayOptFind( get_learning_objects( sType ), "This." + sFieldName + " == _object_id" );
        if( oLearning != undefined )
        {
            if( teEducationPlan.type == "collaborator" && ( _cat_program.result_type + "s" ) != sType )
            {
                sFinishFieldName = sType == "learnings" ? "active_learning_id" : "active_test_learning_id";
                oFinishLearning = ArrayOptFind( get_learning_objects( sType ), "This." + sFinishFieldName + " == _cat_program.result_object_id" );
                if( oFinishLearning != undefined && _cat_program.result_object_id.OptForeignElem == undefined )
                {
                    _program.result_object_id = oFinishLearning.id;
                    _program.result_type = sType == "learnings" ? "learning" : "test_learning";;
                    bNeedSave = true;
                }
            }

            return oLearning.state_id.Value;
        }
        oLearning = ArrayOptFind( get_learning_objects( "active_" + sType ), "This." + sFieldName + " == _object_id" );
        if( oLearning != undefined )
            return 1;
        return 0;
    }

    function check_result_object( _c_program, _result_object_id )
    {
        if( _c_program.result_object_id == _result_object_id || ArrayOptFindByKey( _c_program.result_objects, _result_object_id, "result_object_id" ) != undefined )
        {
            return true;
        }
        var _c_p;
        for( _c_p in teEducationPlan.programs )
        {
            if( _c_p.result_object_id == _result_object_id || ArrayOptFindByKey( _c_p.result_objects, _result_object_id, "result_object_id" ) != undefined )
            {
                return false;
            }
        }
        return true;
    }

    function get_status( program_id )
    {
        var _program = teEducationPlan.programs.GetOptChildByKey( program_id );
        var oLearning;
        if( _program != undefined )
        {
            switch( _program.type )
            {
                case "folder":
                {
                    var arrChildPrograms = ArraySelectByKey( teEducationPlan.programs, program_id, "parent_progpam_id" );
                    if( ArrayOptFirstElem( arrChildPrograms ) != undefined )
                    {
                        if( ArrayOptFind( arrChildPrograms, "This.state_id != 2" ) == undefined )
                        {
                            return 2;
                        }
                        if( ArrayOptFind( arrChildPrograms, "This.state_id != 4" ) == undefined )
                        {
                            return 4;
                        }
                    }
                    break;
                }
                case "course":
                {
                    return check_active_learning( _program.object_id, _program, "learnings" );
                }
                case "assessment":
                {
                    return check_active_learning( _program.object_id, _program, "test_learnings" );
                }
                case "learning_task":
                {
                    if( !_program.object_id.HasValue )
                        return _program.state_id.Value;
                    oLearning = ArrayOptFind( get_learning_objects( "learning_task_results" ), "This.learning_task_id == _program.object_id" );
                    if( oLearning != undefined )
                        return oLearning.status_id == "success" ? 4 : oLearning.status_id == "failed" ? 3 : 1;
                    return 0;
                }
                case "education_program":
                {
                    if( !_program.education_program_id.HasValue )
                    {
                        return _program.state_id.Value;
                    }
                    var docEduProgram = get_object_from_cache( _program.education_program_id );
                    var feEducationMethod;
                    var arrEPStates = new Array();
                    for( _em in docEduProgram.TopElem.education_methods )
                    {
                        feEducationMethod = ArrayOptFindByKey( xarrCacheEducationMethods, _em.education_method_id, "id" );
                        if( feEducationMethod == undefined )
                        {
                            continue;
                        }
                        if( feEducationMethod.type == "course" )
                        {
                            arrEPStates.push( check_active_learning( feEducationMethod.course_id, _program, "learnings", _em.education_method_id ) );
                            continue;
                        }
                        else
                        {
                            oLearning = ArrayOptFind( get_learning_objects( "event_collaborators" ), "This.education_method_id == _em.education_method_id && check_result_object( _program, This.event_id )" );
                            if( oLearning != undefined )
                            {
                                arrEPStates.push( oLearning.status_id == "close"  ? check_is_assist_event( oLearning ) : oLearning.status_id == "cancel" ? 3 : 1 );
                                continue;
                            }
                        }
                        arrEPStates.push( 0 );
                    }

                    if( ArrayOptFind( arrEPStates, 'This == 0' ) != undefined )
                    {
                        return 0;
                    }
                    else if( ArrayOptFind( arrEPStates, 'This == 0' ) == undefined && ArrayOptFind( arrEPStates, 'This == 1' ) != undefined )
                    {
                        return 1;
                    }
                    else if( ArrayOptFind( arrEPStates, 'This != 2' ) == undefined )
                    {
                        return 2;
                    }
                    else if( ArrayOptFind( arrEPStates, 'This == 3' ) != undefined )
                    {
                        return 3;
                    }

                    return 4;
                }
                case "education_method":
                {
                    if( !_program.education_method_id.HasValue )
                        return _program.state_id.Value;
                    var feEducationMethod = ArrayOptFindByKey( xarrCacheEducationMethods, _program.education_method_id, "id" );
                    if( feEducationMethod == undefined )
                        return _program.state_id.Value;
                    if( feEducationMethod.type == "course" )
                    {
                        return check_active_learning( feEducationMethod.course_id, _program, "learnings" );
                    }
                    else
                    {
                        oLearning = ArrayOptFind( get_learning_objects( "event_collaborators" ), "This.education_method_id == _program.education_method_id && check_result_object( _program, This.event_id )" );
                        if( oLearning != undefined )
                            return oLearning.status_id == "close"  ? check_is_assist_event( oLearning ) : oLearning.status_id == "cancel" ? 3 : 1;
                    }
                    return 0;
                }
                case "notification_template":
                {
                    if( _program.program_results.GetOptChildByKey( iPersonID, "person_id" ) != undefined )
                        return 4;
                    return 0;
                }
                case "material":
                {
                    if( !_program.object_id.HasValue )
                        return _program.state_id.Value;
                    switch( _program.catalog_name )
                    {
                        case "poll":
                            oLearning = ArrayOptFind( get_learning_objects( "poll_results" ), "This.poll_id == _program.object_id" );
                            if( oLearning != undefined )
                                return oLearning.is_done ? 4 : 1;
                            return 0;
                        case "library_material":
                            oLearning = ArrayOptFind( get_learning_objects( "library_material_viewings" ), "This.material_id == _program.object_id" );
                            if( oLearning != undefined )
                                return oLearning.state_id == "finished" ? 4 : 1;
                            return 0;
                    }
                    break;
                }

            }
            return _program.state_id.Value;
        }
        return 0;

    }
    function activate_course( _program, _course_id, _rp_program )
    {
        _result = tools.activate_course_to_person( iPersonID, _course_id, null, get_person(), iEducationPlanID, OptInt( _program.days, 0 ) );
        if( teEducationPlan.type == "collaborator" )
        {
            if( !IsEmptyValue( _rp_program ) )
            {
                try
                {
                    _rp_program.result_object_id = _result.DocID;
                    _rp_program.result_type = 'active_learning';
                    _program.state_id = 0;
                }
                catch ( sdf )
                {
                    _rp_program.result_object_id = _result;
                    _rp_program.result_type = 'active_learning';
                    _program.state_id = 1;
                }
            }
            else
            {
                try
                {
                    _program.active_learning_id = _result.DocID;
                    _program.result_object_id = _result.DocID;
                    _program.result_type = 'active_learning';
                    _program.state_id = 0;
                }
                catch ( sdf )
                {
                    _program.active_learning_id = _result;
                    _program.result_object_id = _result;
                    _program.result_type = 'active_learning';
                    _program.state_id = 1;
                }
            }
        }
        return _result;
    }
    function create_event( _program, feObject )
    {
        var docEvent = OpenNewDoc( 'x-local://wtv/wtv_event.xmd' );
        var sType = "";
        if( _program.type == "education_method" )
        {
            if( feObject.event_type_id.HasValue )
            {
                docEvent.TopElem.event_type_id = feObject.event_type_id;
                catEventType = ArrayOptFirstElem( XQuery( "for $elem in event_types where $elem/id = " + feObject.event_type_id + " return $elem" ) );
                if ( catEventType != undefined )
                    docEvent.TopElem.type_id = catEventType.code;
            }
            else
                sType = "education_method";
        }
        else
        {
            sType = "education_method_from_program";
        }

        if( sType != "" )
        {
            docEvent.TopElem.type_id = sType;
            catEventType = ArrayOptFirstElem( XQuery( "for $elem in event_types where $elem/code = " + XQueryLiteral( sType ) + " return $elem" ) );
            if ( catEventType != undefined )
                docEvent.TopElem.event_type_id = catEventType.id;
        }


        docEvent.TopElem.create_compound_program_id = teEducationPlan.compound_program_id;
        docEvent.TopElem.compound_program_id = teEducationPlan.compound_program_id;
        if( _program.type == "education_method" )
        {
            docEvent.TopElem.education_method_id = _program.education_method_id;
            docEvent.TopElem.program_id = _program.education_method_id;
            tools.common_filling( 'education_method', docEvent.TopElem, _program.education_method_id, null, false );
            docEvent.TopElem.event_form = feObject.event_form;
        }
        else
        {
            docEvent.TopElem.education_program_id = _program.object_id;
            docEvent.TopElem.program_id = _program.object_id;
            if ( feObject.Name == "education_method" )
            {
                docEvent.TopElem.education_method_id = feObject.id;
            }
        }

        docEvent.TopElem.name = _program.name;

        docEvent.BindToDb(DefaultDb);
        return docEvent;
    }
    function activate_program( _program )
    {
        //alert('activate_program '+_program.id)
        if( _program != undefined )
        {
            switch( _program.type )
            {
                case "course":
                {
                    if( !_program.object_id.HasValue )
                        return false;
                    _result = activate_course( _program, _program.object_id )
                    break;
                }
                case "assessment":
                {
                    if( !_program.object_id.HasValue )
                        return false;
                    _result = tools.activate_test_to_person( iPersonID, _program.object_id, null, get_person(), null, null, OptInt( _program.days, 0 ), null, '', null, iEducationPlanID );
                    if( teEducationPlan.type == "collaborator" )
                        try
                        {
                            _program.result_object_id = _result.DocID;
                            _program.result_type = 'active_test_learning';
                            _program.state_id = 0;
                        }
                        catch ( sdf )
                        {
                            _program.result_object_id = _result;
                            _program.result_type = 'active_test_learning';
                            _program.state_id = 1;
                        }
                    break;
                }
                case "learning_task":
                {
                    if( !_program.object_id.HasValue )
                        return false;
                    catLearningTasResult = ArrayOptFirstElem( XQuery( 'for $i in learning_task_results where $i/person_id = ' + iPersonID + ' and $i/learning_task_id = ' + _program.object_id + ' return $i' ) );
                    if( catLearningTasResult != undefined )
                        _result = catLearningTasResult.id;
                    else
                    {
                        docLearningTaskResult = tools_knlg.activate_learning_task( { 	person_id: iPersonID,
                            tePerson: get_person(),
                            learning_task_id: _program.object_id,
                            plan_start_date: _program.plan_date,
                            expert_id: _program.tutor_id,
                            start_date: _program.create_date,
                            education_plan_id: iEducationPlanID
                        } ).doc_learning_task_result;

                        _result = docLearningTaskResult;
                    }
                    break;
                }
                case "education_program":
                {
                    if( !_program.education_program_id.HasValue )
                        return false;
                    var docEduProgram = get_object_from_cache( _program.education_program_id );
                    var feEducationMethod, catResultObject;
                    for( _em in docEduProgram.TopElem.education_methods )
                    {
                        feEducationMethod = ArrayOptFindByKey( xarrCacheEducationMethods, _em.education_method_id, "id" );
                        if( feEducationMethod == undefined )
                        {
                            //alert(_em.education_method_id + " continue")
                            continue;
                        }
                        catResultObject = _program.result_objects.GetOptChildByKey( _em.education_method_id, "object_id" );
                        if( catResultObject == undefined )
                        {
                            catResultObject = _program.result_objects.AddChild();
                            catResultObject.object_id = _em.education_method_id;
                        }
                        if( feEducationMethod.type == "course" )
                        {
                            if( !feEducationMethod.course_id.HasValue )
                            {
                                continue;
                            }
                            _result = activate_course( _program, feEducationMethod.course_id, catResultObject );
                            if( OptInt( _result ) != undefined )
                            {
                                _result = get_object_from_cache( _result );
                            }
                            if( _result.TopElem.ChildExists( "education_plan_id" )  )
                            {
                                if( !_result.TopElem.education_plan_id.HasValue )
                                {
                                    _result.TopElem.education_plan_id = iEducationPlanID;
                                    _result.Save();
                                }
                                else if( _result.TopElem.education_plan_id != iEducationPlanID )
                                    continue;
                            }
                            if( teEducationPlan.type == "collaborator" )
                            {
                                catResultObject.result_object_id = _result.DocID;
                                catResultObject.result_type = _result.TopElem.Name;
                                continue;
                            }
                        }
                        else
                        {
                            if( catResultObject.result_object_id.HasValue )
                            {
                                docEvent = null;
                                iEventID = catResultObject.result_object_id;
                            }
                            else
                            {
                                docEvent = null;
                                if ( teEducationPlan.group_id.HasValue )
                                {
                                    _foundPlans = XQuery("for $elem in education_plans where $elem/group_id = " + teEducationPlan.group_id + " return $elem/Fields('id')");
                                    if ( ArrayOptFirstElem( _foundPlans ) != undefined )
                                    {
                                        _foundEvent = ArrayOptFirstElem( XQuery("for $elem in event_collaborators where $elem/is_collaborator = true() and $elem/education_method_id = " + _em.education_method_id + " and MatchSome( $elem/education_plan_id, (" + ArrayMerge( _foundPlans, "This.id", "," ) + ") ) return $elem/Fields('event_id')") );
                                        if ( _foundEvent != undefined )
                                        {
                                            docEvent = get_object_from_cache( _foundEvent.event_id );
                                            if ( docEvent == undefined )
                                            {
                                                docEvent = null;
                                            }
                                        }
                                    }
                                }
                                if ( docEvent == null || ( docEvent.TopElem.collaborators.GetOptChildByKey( iPersonID ) != undefined && docEvent.TopElem.collaborators.GetOptChildByKey( iPersonID ).education_plan_id.HasValue ) )
                                {
                                    docEvent = create_event( _program, feEducationMethod );
                                }
                                iEventID = docEvent.DocID;
                                catResultObject.result_object_id = iEventID;
                                catResultObject.result_type = "event";
                            }

                            tools.add_person_to_event( iPersonID, iEventID, get_person(), docEvent, iEducationPlanID, null, null, null, true );
                        }
                    }
                    return true;
                }
                case "education_method":
                {
                    if( !_program.education_method_id.HasValue )
                        return false;
                    var feEducationMethod = ArrayOptFindByKey( xarrCacheEducationMethods, _program.education_method_id, "id" );
                    if( feEducationMethod == undefined )
                        return false;
                    if( feEducationMethod.type == "course" )
                    {
                        if( !feEducationMethod.course_id.HasValue )
                            return false;
                        _result = activate_course( _program, feEducationMethod.course_id )
                    }
                    else
                    {
                        if( _program.result_object_id.HasValue )
                        {
                            docEvent = null;
                            iEventID = _program.result_object_id;
                        }
                        else
                        {
                            docEvent = null;
                            if ( teEducationPlan.group_id.HasValue )
                            {
                                _foundPlans = XQuery("for $elem in education_plans where $elem/group_id = " + teEducationPlan.group_id + " return $elem/Fields('id')");
                                if ( ArrayOptFirstElem( _foundPlans ) != undefined )
                                {
                                    _foundEvent = ArrayOptFirstElem( XQuery("for $elem in event_collaborators where $elem/is_collaborator = true() and $elem/education_method_id = " + _program.education_method_id + " and MatchSome( $elem/education_plan_id, (" + ArrayMerge( _foundPlans, "This.id", "," ) + ") ) return $elem/Fields('event_id')") );
                                    if ( _foundEvent != undefined )
                                    {
                                        docEvent = get_object_from_cache( _foundEvent.event_id );
                                        if ( docEvent == undefined )
                                        {
                                            docEvent = null;
                                        }
                                    }
                                }
                            }
                            if ( docEvent == null || ( docEvent.TopElem.collaborators.GetOptChildByKey( iPersonID ) != undefined && docEvent.TopElem.collaborators.GetOptChildByKey( iPersonID ).education_plan_id.HasValue ) )
                            {
                                docEvent = create_event( _program, feEducationMethod );
                            }
                            iEventID = docEvent.DocID;
                            _program.result_object_id = iEventID;
                            _program.result_type = "event";
                        }

                        tools.add_person_to_event( iPersonID, iEventID, get_person(), docEvent, iEducationPlanID, null, null, null, true );
                        return true;
                    }
                    break;
                }
                case "notification_template":
                {
                    teActiveNotification = OpenNewDoc( 'x-local://wtv/wtv_dlg_notification_template.xml' ).TopElem;
                    if( _program.edit_notification )
                    {
                        teActiveNotification.subject = _program.subject;
                        teActiveNotification.body = _program.body;
                        teActiveNotification.body_type = _program.body_type;
                    }
                    else
                    {
                        if( !_program.object_id.HasValue )
                            break;
                        teNotificationTemplate = get_object_from_cache( _program.object_id ).TopElem;
                        teActiveNotification.subject = teNotificationTemplate.subject;
                        teActiveNotification.body = teNotificationTemplate.body;
                        teActiveNotification.body_type = teNotificationTemplate.body_type;
                    }
                    teActiveNotification.recipients.ObtainChildByKey( 'in_doc' );

                    tools.create_notification( 0, iPersonID, _program.id, iEducationPlanID, get_person(), teEducationPlan, teActiveNotification );
                    _program.program_results.ObtainChildByKey( iPersonID, "person_id" );
                    return true;
                }
                case "material":
                {
                    if( !_program.object_id.HasValue )
                        return false;
                    switch( _program.catalog_name )
                    {
                        case "poll":
                        {
                            catPollResult = ArrayOptFind( get_learning_objects( "poll_results" ), "This.poll_id == _program.object_id" );
                            if( catPollResult != undefined )
                                _result = catPollResult.id;
                            else
                                _result = tools.activate_poll_to_person( get_person(), _program.object_id, null, iEducationPlanID );
                            break;
                        }
                        case "library_material":
                        {
                            _result = tools.recommend_library_material_to_person( iPersonID, _program.object_id, get_person(), null, false , iEducationPlanID );
                            break;
                        }
                        default:
                            return false;
                    }
                    break;
                }
                default:
                    return false;


            }
            if( OptInt( _result ) != undefined )
            {
                _result = get_object_from_cache( _result );
            }
            if( _result.TopElem.ChildExists( "education_plan_id" )  )
            {
                if( !_result.TopElem.education_plan_id.HasValue )
                {
                    _result.TopElem.education_plan_id = iEducationPlanID;
                    _result.Save();
                }
                else if( _result.TopElem.education_plan_id != iEducationPlanID )
                    return false
            }
            if( teEducationPlan.type == "collaborator" )
            {
                _program.result_object_id = _result.DocID;
                _program.result_type = _result.TopElem.Name;
                return true
            }
        }
        return false;

    }
    function get_program( program_id )
    {
        var catProgram = ArrayOptFind( arrPrograms, "This.id == program_id" );
        if( catProgram == undefined )
        {
            catProgram = new Object();
            catProgram.id = program_id;
            catProgram.state_id = get_status( program_id );
            arrPrograms.push( catProgram );
        }
        return catProgram;
    }
    function get_learning_objects( _type )
    {

        _learning_objects = oLearningObject.GetProperty( _type );
        if( _learning_objects == null )
        {
            var sOrder = "";
            switch( _type )
            {
                case "active_learnings":
                case "active_test_learnings":
                case "learnings":
                case "test_learnings":
                    sOrder = " order by $elem/score descending ";
                    break
            }
            var conds = new Array();
            if( _type != "event_results" )
            {
                conds.push( "$elem/education_plan_id = " + iEducationPlanID );
            }
            if( _type == "event_collaborators" )
            {
                conds.push( "$elem/collaborator_id = " + iPersonID );
            }
            else
            {
                conds.push( "$elem/person_id = " + iPersonID );
            }
            _learning_objects = ArraySelectAll( XQuery( "for $elem in " + _type + " where " + ArrayMerge( conds, "This", " and " ) + sOrder + " return $elem" ) );
            oLearningObject.SetProperty( _type, _learning_objects )
        }
        return _learning_objects;
    }

    function need_activate_program( catProgram )
    {
        if( catProgram.start_type != "auto" )
            return false;
        //alert('need_activate_program 1')
        if( catProgram.plan_date.HasValue )
        {
            if( catProgram.plan_date > Date() )
                return false
        }
        else
        {
            dStartPlanDate = teEducationPlan.plan_date.HasValue ? teEducationPlan.plan_date : teEducationPlan.create_date;
            if( catProgram.delay_days.HasValue && dStartPlanDate.HasValue && DateOffset( dStartPlanDate.Value, catProgram.delay_days*86400 ) > Date() )
                return false;
        }
        //alert('need_activate_program 2')
        if( catProgram.completed_parent_programs.ChildNum > 0 && ArrayOptFind( catProgram.completed_parent_programs, "get_program( This.program_id.Value ).state_id < 2" ) != undefined )
            return false;

        return true;
    }

    function get_object_from_cache( _object_id )
    {
        _object_id = OptInt( _object_id );
        if( _object_id == undefined )
        {
            return undefined;
        }
        var oObject = ArrayOptFind( aCacheObjects, "This.DocID == _object_id" );
        if( oObject == undefined )
        {
            oObject = tools.open_doc( _object_id );
            aCacheObjects.push( oObject );
        }
        return oObject;
    }

    function update_parent_program( _parent_program_id, iLevel )
    {
        iLevel = OptInt( iLevel, 0 );
        if( iLevel > 10 )
        {
            return null;
        }
        var _parent_program = teEducationPlan.programs.GetOptChildByKey( _parent_program_id );
        if ( _parent_program != undefined )
        {
            var catProgram = ArrayOptFind( arrPrograms, "This.id == _parent_program_id" );
            if( catProgram != undefined )
            {
                catProgram.state_id = get_status( catProgram.id );
                if( _parent_program.state_id != catProgram.state_id )
                {
                    _parent_program.state_id = catProgram.state_id;
                    teEducationPlan.last_activity_date = Date();
                    bNeedSave = true;
                }
            }
            if( _parent_program.parent_progpam_id.HasValue )
            {
                update_parent_program( _parent_program.parent_progpam_id, (iLevel+1) );
            }
        }
    }
    var oLearningObject = {
        'learnings': null,
        'active_learnings': null,
        'test_learnings': null,
        'active_test_learnings': null,
        'poll_results': null,
        'learning_task_results': null,
        'library_material_viewings': null,
        'event_collaborators': null,
        'event_results': null
    }
    var aCacheObjects = new Array();
    var xarrCacheEducationMethodIds = new Array();
    var xarrCacheEducationMethods = new Array();
    for( _program in teEducationPlan.programs )
    {
        switch( _program.type )
        {
            case "education_method":
            {
                if( _program.education_method_id.HasValue )
                {
                    xarrCacheEducationMethodIds.push( _program.education_method_id.Value );
                }
                break;
            }
            case "education_program":
            {
                if( _program.object_id.HasValue )
                {
                    for( _em in get_object_from_cache( _program.object_id ).TopElem.education_methods )
                    {
                        xarrCacheEducationMethodIds.push( _em.education_method_id.Value );
                    }
                }
                break;
            }
        }
    }
    if( ArrayOptFirstElem( xarrCacheEducationMethodIds ) != undefined )
    {
        xarrCacheEducationMethods = XQuery( "for $elem_qc in education_methods where MatchSome( $elem_qc/id, ( " + ArrayMerge( xarrCacheEducationMethodIds, "This", "," ) + " ) ) return $elem_qc" );
    }

    var bNeedSave = false;
    var arrPrograms = new Array();
    for( _program in teEducationPlan.programs )
    {
        oProgram = get_program( _program.id.Value );
        if( _program.state_id != oProgram.state_id )
        {
            if( teEducationPlan.type == "collaborator" )
            {
                _program.state_id = oProgram.state_id;
                if( _program.parent_progpam_id.HasValue )
                {
                    update_parent_program( _program.parent_progpam_id );
                }
            }
            teEducationPlan.last_activity_date = Date();
            bNeedSave = true;
        }
    }
    //alert( tools.object_to_text(arrPrograms, 'json') )
    for( _program in teEducationPlan.programs )
        try
        {
            //alert(_program.id + ' ' +need_activate_program( _program ))
            oProgram = get_program( _program.id.Value );
            if( oProgram.state_id == 0 && need_activate_program( _program ) )
            {
                if( activate_program( _program ) )
                {
                    if( _program.state_id == 0 )
                        _program.state_id = 1;
                    teEducationPlan.last_activity_date = Date();
                    bNeedSave = true;
                }
            }
            if ( _program.state_id > 0 )
            {
                _parent_program = teEducationPlan.programs.GetOptChildByKey( _program.parent_progpam_id );
                if ( _parent_program != undefined && _parent_program.type == "folder" && _parent_program.state_id == 0 )
                {
                    oParentProgram = get_program( _program.id.Value );
                    _parent_program.state_id = 1;
                    bNeedSave = true;
                }
            }
        }
        catch( ex )
        {
            alert('update_education_plan '+ex)
        }
    if( bNeedSave )
    {
        docEducationPlan.Save();
    }
    oRes.doc_education_plan = docEducationPlan;
    return oRes;
}


function update_education_plan_date( iEducationPlanID, docEducationPlan )
{
    function set_error( iError, sErrorText, bResult )
    {
        oRes.error = iError;
        oRes.errorText = sErrorText;
        oRes.result = bResult;
    }
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;


    try
    {
        iEducationPlanID = Int( iEducationPlanID );
    }
    catch( ex )
    {
        set_error( 1, i18n.t( 'peredannekorre_13' ), false );
        return oRes;
    }
    try
    {
        docEducationPlan.TopElem;
    }
    catch( ex )
    {
        try
        {
            docEducationPlan = OpenDoc( UrlFromDocID( iEducationPlanID ) );
        }
        catch( ex )
        {
            set_error( 1, i18n.t( 'peredannekorre_13' ), false );
            return oRes;
        }
    }

    teEducationPlan = docEducationPlan.TopElem;
    var bNeedSave = true;
    var dEducationPlanDate = teEducationPlan.plan_date.HasValue ? teEducationPlan.plan_date : teEducationPlan.create_date;
    var arrErrorPrograms = new Array();
    if( dEducationPlanDate == null )
    {
        set_error( 1, i18n.t( 'neukazanadatan' ), false );
        tools.alert_server( oRes.errorText );
        return oRes;
    }

    function update_plan_date( catProgram, dStartDate )
    {
        var _ch_program;
        var dLastPlanDate = null;


        catProgram.plan_date = DateOffset( dStartDate, 86400*OptInt( catProgram.delay_days, 0 ) );
        if( catProgram.days.HasValue )
            catProgram.finish_date = DateOffset( catProgram.plan_date, 86400*OptInt( catProgram.days, 0 ) );

        for( _ch_program in  ArraySelect( teEducationPlan.programs, "This.parent_progpam_id == catProgram.id" ) )
        {
            update_plan_date( _ch_program, ( catProgram.type == 'folder' ? catProgram.plan_date : dStartDate ) );
            if( dLastPlanDate == null || dLastPlanDate < _ch_program.finish_date )
                dLastPlanDate = _ch_program.finish_date.Value;
        }

        if( !catProgram.days.HasValue )
            catProgram.finish_date = dLastPlanDate;
        else if( catProgram.finish_date < dLastPlanDate )
            arrErrorPrograms.push( catProgram.id.Value );
    }

    for( _program in ArraySelect( teEducationPlan.programs, "!This.parent_progpam_id.HasValue" ) )
    {
        update_plan_date( _program, dEducationPlanDate, null )
    }
    if( !teEducationPlan.finish_date.HasValue )
    {
        var catMaxEndDateProgram = ArrayOptMax( ArraySelect( teEducationPlan.programs, "This.finish_date.HasValue" ), "This.finish_date" );
        if( catMaxEndDateProgram != undefined )
        {
            teEducationPlan.finish_date = catMaxEndDateProgram.finish_date;
        }
    }
    if( bNeedSave )
    {
        docEducationPlan.Save();
    }
    oRes.doc_education_plan = docEducationPlan;

    if( ArrayOptFirstElem( arrErrorPrograms ) != undefined )
    {
        set_error( 1, StrReplace( i18n.t( 'vetapahparamda' ), "{PARAM1}", ArrayMerge( arrErrorPrograms, "teEducationPlan.programs.GetChildByKey( This ).name.Value", ", " ) ), false );
        tools.alert_server( oRes.errorText );
        return oRes;
    }

    return oRes;
}

/**
 * @typedef {Object} EventContext
 * @property {bool} bHasMaterials – Имеются материалы.
 * @property {bool} bHasCollaborators – Имеются участники.
 * @property {bool} bHasRequest – Имеются заявки.
 * @property {bool} bHasResponse – Имеются отзывы.
 * @property {bool} bHasLector – Имеются преподаватели.
 * @property {bool} bHasRecord – Имеются записи вебинара.
 * @property {bool} bIsParticipant – Сотрудник является участником мероприятия.
 * @property {bool} bIsTutor – Сотрудник является ответственным по мероприятию.
 * @property {bool} bDiffTimezone – Признак, что часовой пояс пользователя отличается от системы.
 * @property {date} dStartDateWithTimezone – Время начала мероприятия с учетом таймзоны.
 * @property {date} dFinishDateWithTimezone – Время завершения мероприятия с учетом таймзоны.
 * @property {string} sUserTimezone – Таймзона сотрудника.
 * @property {bool} bHasPreTestsToDo – Есть незаконченные предварительные тесты.
 * @property {bool} bHasApprove – Сотрудник подтвердил участие в мероприятии.
 * @property {bool} bHasResponseToDo – Требуется заполнить необязательный отзыв.
 * @property {bool} bHasResponseRequiredToDo – Требуется заполнить обязательный отзыв.
 * @property {bool} bHasPostTestsToDo – Требуется пройти пост-тесты.
 * @property {bool} bIsFinished  – Мероприятие завершено.
 * @property {bool} bIsCanceled – Мероприятие отменено.
 * @property {bool} bHasPlace – В мероприятии указано местоположение.
 * @property {bool} bHasTutor – В мероприятии есть хотя бы один ответственный за проведение.
 * @property {bool} bTomorrowOrLetter – Дата начала мероприятия завтра или позже.
 * @property {bool} bHasAddition – Имеются материалы, преподаватели или предварительные тесты.
 */
/**
 * @typedef {Object} ReturnEventContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {EventContext} context – Контекст мероприятия.
 */
/**
 * @function GetEventContext
 * @memberof Websoft.WT.Event
 * @description Получение контекста мероприятия.
 * @param {bigint} iDocumentID - ID раздела портала.
 * @returns {ReturnEventContext}
 */
function GetEventContext( iEventID, iPersonID )
{
    return get_event_context( iEventID, null, iPersonID );
}
function get_event_context( iEventID, teEvent, iPersonID )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    function get_date( dDate, bIn, catTimezone )
    {
        if( bUseTimezone )
        {
            if( bIn )
            {
                return tools_web.get_timezone_date( dDate, catUserTimezone, catDefaultTimezone )
            }
            else
            {
                return tools_web.get_timezone_date( dDate, catTimezone, catUserTimezone )
            }
        }
        else
            return dDate
    }
    try
    {
        if( ObjectType( oParams ) != "JsObject" )
            throw "";
    }
    catch( ex )
    {
        oParams = {};
    }

    var bUseTimezone = true;
    var catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
    var catUserTimezone = tools_web.get_timezone( iPersonID );
    catUserTimezone = catUserTimezone != null && catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch ( err )
        {
            oRes.error = 503;
            oRes.errorText = "{ text: 'Object not found.', param_name: 'iEventID' }";
            return oRes;
        }
    }
    var catEventTimezone = tools_web.get_timezone( iEventID, teEvent );
    bHasRecordFiles = false;
    try
    {
        oParam = new Object();
        oParam.iEventID = iEventID;
        oParam.teEvent = teEvent;
        oParam.iPersonID = iPersonID;
        oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "HasRecordFiles", oParam );
        bHasRecordFiles = oResult.GetOptProperty( "has_record", false );
    }
    catch( ex )
    {
        alert(ex)
    }
    var libParam = tools.get_params_code_library( "libEducation" );
    var iDepthSearchTest = OptInt( libParam.GetOptProperty( "depth_search_test" ) );
    var arrPrevTests = get_object_assessments( iEventID, teEvent, "prev_testing" ).array;
    var bHasPreTestsToDo = false;
    var catEventResult = ArrayOptFirstElem( XQuery( "for $elem in event_results where $elem/event_id = " + iEventID + " and $elem/person_id = " + iPersonID + " return $elem" ) );
    var xarrPersonTestLearnings = new Array();

    if( ArrayOptFirstElem( arrPrevTests ) != undefined )
    {
        xarrPersonTestLearnings  = XQuery( "for $elem in test_learnings where MatchSome( $elem/assessment_id, ( " + ArrayMerge( arrPrevTests, "This.id", "," ) + " ) ) and $elem/person_id = " + iPersonID + ( iDepthSearchTest != undefined ? ( " and $elem/last_usage_date > " + XQueryLiteral( DateOffset( Date(), 0 - iDepthSearchTest*86400 ) ) ) : "" ) + " return $elem/Fields('id','assessment_id')" );
        bHasPreTestsToDo = ArrayCount( arrPrevTests ) > ArrayCount( ArraySelectDistinct( xarrPersonTestLearnings, "This.assessment_id" ) );
    }
    var bHasPostTestsToDo = false;
    if( teEvent.status_id == "close" )
    {

        if( catEventResult != undefined && catEventResult.is_assist )
        {
            var arrPostTests = get_object_assessments( iEventID, teEvent, "post_testing" ).array;
            if( ArrayOptFirstElem( arrPostTests ) != undefined )
            {
                xarrPersonTestLearnings = XQuery( "for $elem in test_learnings where MatchSome( $elem/assessment_id, ( " + ArrayMerge( arrPostTests, "This.id", "," ) + " ) ) and $elem/person_id = " + iPersonID + ( iDepthSearchTest != undefined ? ( " and $elem/last_usage_date > " + XQueryLiteral( DateOffset( Date(), 0 - iDepthSearchTest*86400 ) ) ) : "" ) + " return $elem/Fields('id','assessment_id')" );
                bHasPostTestsToDo = ArrayCount( arrPostTests ) > ArrayCount( ArraySelectDistinct( xarrPersonTestLearnings, "This.assessment_id" ) );
            }
        }
    }
    var bHasResponseRequiredToDo = false;
    var bHasResponseToDo = false;
    if( teEvent.default_response_type_id.HasValue )
    {
        var catEventResponse = ArrayOptFirstElem( XQuery( "for $elem in responses where $elem/object_id = " + iEventID + " and $elem/person_id = " + iPersonID + " and $elem/response_type_id = " + teEvent.default_response_type_id + " return $elem" ) );
        if( catEventResponse == undefined )
        {
            bHasResponseRequiredToDo = teEvent.mandatory_fill_response.Value;
            bHasResponseToDo = !teEvent.mandatory_fill_response.Value;
        }
    }
    var xarrLectors = XQuery( "for $elem in lectors where $elem/person_id = " + iPersonID + " return $elem/Fields('id')" );
    var oContext = {
        bHasMaterials: ( teEvent.files.ChildNum != 0 ),
        bHasCollaborators: ( teEvent.collaborators.ChildNum != 0 ),
        bHasRequest: ( ArrayOptFirstElem( XQuery( "for $elem in requests where $elem/object_id = " + iEventID + " return $elem/Fields('id')" ) ) != undefined ),
        bHasResponse: ( ArrayOptFirstElem( XQuery( "for $elem in responses where $elem/object_id = " + iEventID + " return $elem/Fields('id')" ) ) != undefined ),
        bHasLector: ( teEvent.lectors.ChildNum != 0 ),
        bHasRecord: bHasRecordFiles,
        bIsParticipant: ( teEvent.collaborators.ChildByKeyExists( iPersonID ) ),
        bIsTutor: ( teEvent.tutors.ChildByKeyExists( iPersonID ) ),
        bIsPreparator: ( ArrayOptFindByKey( teEvent.even_preparations, iPersonID, "person_id" ) != undefined ),
        bIsLector: ArrayOptFirstElem( ArrayIntersect( xarrLectors, teEvent.lectors, "This.id", "This.PrimaryKey" ) ) != undefined,
        dStartDateWithTimezone: get_date( teEvent.start_date.Value, false, catEventTimezone ),
        dFinishDateWithTimezone: get_date( teEvent.finish_date.Value, false, catEventTimezone ),
        sUserTimezone: ( catUserTimezone != null ? catUserTimezone.name.Value : "" ),
        bDiffTimezone: ( catUserTimezone != null && catEventTimezone != catUserTimezone.id ),
        bHasPreTestsToDo: bHasPreTestsToDo,
        bHasPostTestsToDo: bHasPostTestsToDo,
        bHasResponseRequiredToDo: bHasResponseRequiredToDo,
        bHasResponseToDo: bHasResponseToDo,
        bHasApprove: ( catEventResult != undefined && catEventResult.is_confirm ),
        bIsFinished: ( teEvent.status_id == "close" ),
        bIsCanceled: ( teEvent.status_id == "cancel" ),
        bHasPlace: ( teEvent.place_id.HasValue ),
        bHasTutor: ( ArrayOptFirstElem( teEvent.tutors ) != undefined ),
        bTomorrowOrLetter: ( teEvent.start_date.HasValue && teEvent.start_date > DateNewTime( DateOffset( Date(), 86400 ), 0, 0, 0 ) )
    };
    oContext.SetProperty( "bHasAddition", (oContext.bHasLector || oContext.bHasMaterials || oContext.bHasPreTestsToDo) );
    oRes.context = oContext;

    return oRes;
}

/**
 * @typedef {Object} ReturnPublishRecord
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 */
/**
 * @function PublishRecord
 * @memberof Websoft.WT.Event
 * @description Получение контекста мероприятия.
 * @param {bigint} iEventID - ID мероприятия.
 * @returns {ReturnPublishRecord}
 */
function PublishRecord( iEventID )
{
    return publish_record( iEventID, null );
}
function publish_record( iEventID, teEvent )
{
    var oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch ( err )
        {
            oRes.error = 503;
            oRes.errorText = "{ text: 'Object not found.', param_name: 'iEventID' }";
            return oRes;
        }
    }
    var oParam = new Object();
    oParam.teEvent = teEvent;
    oParam.iEventID = iEventID;
    try
    {
        //oResult = teEvent.call_webinar_system_method( 'PublishRecord', oParam );
        oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "PublishRecord", oParam );
        oRes.error = oResult.GetOptProperty( "error", 0 );
        if( oResult.GetOptProperty( "message", "" ) != "" )
            oRes.errorText = oResult.GetOptProperty( "errorText", oResult.GetOptProperty( "message", "" ) );
        if( oResult.GetOptProperty( "errorText", "" ) != "" )
            oRes.errorText = oResult.GetOptProperty( "errorText", oResult.GetOptProperty( "errorText", "" ) );
    }
    catch( ex )
    {
        oRes.error = 500;
        oRes.errorText = ex;
    }
    return oRes;
}

/**
 * @typedef {Object} ReturnWebinarRecordFiles
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oFile} array – Массив файлов.
 */
/**
 * @function GetWebinarRecordFiles
 * @memberof Websoft.WT.Event
 * @description Получение контекста мероприятия.
 * @param {bigint} iEventID - ID мероприятия.
 * @param {bigint} iPersonID - ID сотрудника.
 * @returns {ReturnWebinarRecordFiles}
 */
function GetWebinarRecordFiles( iEventID, iPersonID )
{
    return get_webinar_record_files( iEventID, iPersonID );
}
function get_webinar_record_files( iEventID, iPersonID, teEvent )
{
    var oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.array = [];
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch ( err )
        {
            oRes.error = 503;
            oRes.errorText = "{ text: 'Object not found.', param_name: 'iEventID' }";
            return oRes;
        }
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch ( err )
    {
        oRes.error = 503;
        oRes.errorText = "{ text: 'Incorrect parameters.', param_name: 'iPersonID' }";
        return oRes;
    }
    var feEventType = teEvent.event_type_id.OptForeignElem;
    if( feEventType == undefined || !feEventType.online || !teEvent.webinar_system_id.HasValue )
    {
        oRes.error = 504;
        return oRes;
    }
    var oParam = new Object();
    oParam.teEvent = teEvent;
    oParam.iEventID = iEventID;
    oParam.iPersonID = iPersonID;
    try
    {
        //oResult = teEvent.call_webinar_system_method( 'GetWebinarRecordFiles', oParam );
        oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "GetWebinarRecordFiles", oParam );
        //oRes.array = oResult.files;

        arrFileIDs = ArraySelect(ArrayExtract(teEvent.files, "OptInt(This.file_id)"), "This != undefined");

        for(iFileID in arrFileIDs)
        {
            teFile = OpenDoc( UrlFromDocID( iFileID ) ).TopElem;

            size_to_kb = OptReal(teFile.size.Value / 1024);
            size_to_mb = StrReal(OptReal((size_to_kb / 1024)), 1);
            if(OptInt(size_to_mb) == 0){ size_to_mb = '0.1' }

            oRes.array.push({
                id: iFileID,
                name: teFile.name.Value,
                type: teFile.type.Value,
                size: size_to_mb,
                link: tools_web.get_mode_clean_url( null, iFileID ) //teFile.file_url.Value
            });
        }
    }
    catch( ex )
    {
        oRes.error = 500;
        oRes.errorText = ex;
    }
    return oRes;
}

function call_provider_courses_type_method( sMethodNameParam, iProviderCoursesTypeID, teProviderCourseType, oParams )
{

    var sCodeToEval = "";
    var oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.array = [];
    try
    {
        if( oParams == null || oParams == undefined )
            throw "error";
    }
    catch( ex )
    {
        oParams = new Object();
    }


    try
    {
        iProviderCoursesTypeID = Int( iProviderCoursesTypeID );
        oParams.SetProperty( "iProviderCoursesTypeID", iProviderCoursesTypeID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = "Incorrect iProviderCoursesTypeID";
        return oRes;
    }
    try
    {
        teProviderCourseType.Name;
        oParams.SetProperty( "teProviderCourseType", teProviderCourseType );
    }
    catch( ex )
    {
        try
        {
            teProviderCourseType = OpenDoc( UrlFromDocID( iProviderCoursesTypeID ) ).TopElem;
            oParams.SetProperty( "teProviderCourseType", teProviderCourseType );
        }
        catch ( err )
        {
            oRes.error = 503;
            oRes.errorText = "Incorrect iProviderCoursesTypeID";
            return oRes;
        }
    }

    if( teProviderCourseType.library_url.HasValue )
    {
        if(StrBegins( teProviderCourseType.library_url, 'x-local:/', true))
        {
            sCodeToEval = LoadUrlText( teProviderCourseType.library_url );
        }
        else
        {
            sCodeToEval = LoadUrlText( 'x-local://wtv/' + teProviderCourseType.library_url );
        }
    }
    if( sCodeToEval != "" )
        try
        {
            InPlaceEval( sCodeToEval + ' ' + sMethodNameParam + '()');
        }
        catch( ex )
        {
            alert( ex )
        }
    return oRes;
}

/** @typedef {Object} oEducationOrg
 * @property {bigint} id
 * @property {string} name
 * @property {string} desc
 * @property {string} image
 * @property {string} link
 */
/**
 * @typedef {Object} WTEducationOrgsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEducationOrg[]} array
 */
/**
 * @function GetEducationOrgs
 * @memberof Websoft.WT.Event
 * @description Получения списка обучающих организаций.
 * @param {bigint[]} aRolesID - массив категорий
 * @param {boolean} bWithComment - возвращать комментарий
 * @param {boolean} bRetByHier - возвращать также из дочерних категорий
 * @param {boolean} bIgnoreRoles - Не учитывать категории в отборе
 * @returns {WTEducationOrgsResult}
 */
function GetEducationOrgs( iCurUserID, bCheckAccess, aRolesID, bWithComment, bRetByHier, bIgnoreRoles, arrDistinct, arrFilters, oSort, oPaging )
{
    return get_education_orgs( iCurUserID, bCheckAccess, aRolesID, bWithComment, bRetByHier, bIgnoreRoles, arrDistinct, arrFilters, oSort, oPaging  )
}

function get_education_orgs( iCurUserID, bCheckAccess, aRolesID, bWithComment, bRetByHier, bIgnoreRoles, arrDistinct, arrFilters, oSort, oPaging  )
{
    var oRes = tools.get_code_library_result_object();
    oRes.array = [];
    oRes.data = {};
    oRes.paging = oPaging;

    try
    {
        if ( bCheckAccess == undefined || bCheckAccess == null )
            throw '';

        bCheckAccess = tools_web.is_true( bCheckAccess );
    }
    catch( ex )
    {
        bCheckAccess = global_settings.settings.check_access_on_lists.Value;
    }

    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 501;
        oRes.errorText = "{ text: 'Invalid param iCurUserID.', param_name: 'iCurUserID' }";
        return oRes;
    }

    try
    {
        if( !IsArray( aRolesID ) )
        {
            throw "error";
        }
        aRolesID = ArraySelect( ArrayExtract(aRolesID, "OptInt( This )"), "This  != undefined" );

        if(bRetByHier)
        {
            var _arrHierRoles = [];
            for ( iRoleID in aRolesID )
            {
                _arrHierRoles = ArrayUnion( _arrHierRoles, tools.xquery( "for $elem in roles where IsHierChild( $elem/id, " + iRoleID + " ) order by $elem/Hier() return $elem/Fields('id')" ) );
            }

            aRolesID = ArrayUnion(aRolesID, ArrayExtract(_arrHierRoles, "OptInt( This.id )"));
        }
    }
    catch( ex )
    {
        aRolesID = new Array();
    }
    try
    {
        if( bWithComment == undefined || bWithComment == null || bWithComment == "" )
        {
            throw "error";
        }
        bWithComment = tools_web.is_true( bWithComment );
    }
    catch( ex )
    {
        bWithComment = false;
    }

    conds = [];

    if(!bIgnoreRoles)
    {
        if( ArrayOptFirstElem( aRolesID ) != undefined )
        {
            conds.push( "MatchSome( $elem/role_id, ( " + ArrayMerge( aRolesID, "This", "," ) + " ) )" );
        }
        else
        {
            conds.push( "IsEmpty( $elem/role_id)=true()" );
        }
    }

    for ( oFilter in arrFilters )
    {
        if ( oFilter.type == 'search' )
        {
            if ( oFilter.value != '' ) conds.push( "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )" );
        }
        else if ( oFilter.type == 'select' )
        {
            switch ( oFilter.id )
            {
                case "role_id":
                {
                    sRoleCond = "";
                    if(ArrayOptFind(oFilter.value, "This.value != ''") != undefined)
                    {
                        sRoleCond =  "MatchSome( $elem/role_id, ( " + ArrayMerge(ArraySelect(oFilter.value, "This.value != ''"), "This.value", ",") + " ) )";
                    }

                    if(ArrayOptFind(oFilter.value, "This.value == ''") != undefined)
                    {
                        if(sRoleCond == "")
                            sRoleCond = "IsEmpty($elem/role_id)=true()";
                        else
                            sRoleCond = "( " + sRoleCond + " or IsEmpty($elem/role_id)=true() )"
                    }

                    if(sRoleCond != "")
                        conds.push( sRoleCond );
                    break;
                }
            }
        }
    }

    var sCondSort = " order by $elem/name";
    if ( ObjectType( oSort ) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
    {
        switch ( oSort.FIELD )
        {
            case "name":
                sCondSort = " order by $elem/name" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
                break;
            case "comment":
            case "desc":
                break;
        }
    }

    var sConds = ArrayOptFirstElem(conds) == undefined ? "" : " where " + ArrayMerge( conds, "This", " and " );

    var sReqEdus = "for $elem in education_orgs " + sConds + sCondSort + " return $elem/Fields('id','role_id')";

    var xarrEdus = tools.xquery(sReqEdus)

    if(bCheckAccess){
        var arrEdusPush = new Array()
        for(oEdu in xarrEdus){
            if(tools_web.check_access( oEdu.id.Value, iCurUserID )){
                arrEdusPush.push(oEdu)
            }
        }
        xarrEdus = arrEdusPush
    }

    if ( ArrayOptFirstElem( arrDistinct ) != undefined )
    {
        oRes.data.SetProperty( "distincts", {} );
        for ( sFieldName in arrDistinct )
        {
            oRes.data.distincts.SetProperty( sFieldName, [] );
            switch( sFieldName )
            {

                case "role_id":
                {
                    var strRoles = ArrayMerge(xarrEdus, "ArrayMerge(This.role_id, 'This.Value', ',')", ",");
                    var arrRoles = ArrayExtract(ArraySelectDistinct(strRoles.split(",")), "OptInt(This,null)");
                    var xarrRoles = tools.xquery("for $elem in roles where $elem/catalog_name='education_org' and MatchSome($elem/id, (" + ArrayMerge(ArraySelect(arrRoles, "This!=null"), "This", ",") + ")) return $elem/Fields('name','id')")

                    if(ArrayOptFind(arrRoles, "This==null") != undefined)
                    {
                        oRes.data.distincts.role_id.push({name:i18n.t( 'bezkategorii' ), value: ""})
                    }

                    for(fldRole in xarrRoles )
                    {
                        oRes.data.distincts.role_id.push({name:fldRole.name.Value, value: fldRole.id.Value})
                    }
                    break;
                }
            }
        }
    }

    if ( ObjectType( oPaging ) == 'JsObject' && oPaging.SIZE != null )
    {
        oPaging.MANUAL = true;
        oPaging.TOTAL = ArrayCount( xarrEdus );
        oRes.paging = oPaging;
        xarrEdus = ArrayRange( xarrEdus, OptInt( oPaging.INDEX, 0 ) * oPaging.SIZE, oPaging.SIZE );
    }

    var teEdu, oItem;
    for( catEdu in xarrEdus)
    {
        teEdu = tools.open_doc(catEdu.id.Value).TopElem;

        sComment = "";
        if(bWithComment == true )
        {
            sComment = teEdu.comment.Value;
        }

        oItem = {
            "id": teEdu.id.Value
            ,"name": teEdu.name.Value
            ,"link": get_object_link( "education_plan", teEdu.id )
            ,"image": get_object_image_url( teEdu )
            ,"desc": teEdu.desc.Value
            ,"comment": sComment
        };

        oItem.roles_names = ArrayMerge(teEdu.role_id, "This.ForeignElem.name.Value", "|||");

        oRes.array.push(oItem);
    }

    return oRes;
}

function get_desc( iObjectID )
{
    iObjectID = OptInt( iObjectID );
    if( iObjectID == undefined )
    {
        return "";
    }
    try
    {
        docObject = tools.open_doc( iObjectID );
        if( docObject != undefined )
        {
            teObject = docObject.TopElem;
            if( teObject.ChildExists( "desc" ) )
            {
                return teObject.desc.Value;
            }
            if( teObject.ChildExists( "text_area" ) )
            {
                return teObject.text_area.Value;
            }
        }
    }
    catch( ex ){}
    return "";
}

/** @typedef {Object} oEducationMethod
 * @property {bigint} id
 * @property {string} name
 * @property {string} link
 * @property {string} image
 * @property {string} desc
 * @property {string} comment
 * @property {string} roles_names
 * @property {string} type
 * @property {string} object_name
 * @property {string} state
 * @property {string} edu_type
 * @property {bigint} duration
 * @property {bigint} all_event_count
 * @property {bigint} planned_event_count
 * @property {bigint} trained_persons_count
 * @property {bigint} planned_persons_count
 * @property {bigint} lector_count
 */
/**
 * @typedef {Object} WTEducationMethodsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEducationMethod[]} array
 */
/**
 * @function GetEducationMethods
 * @memberof Websoft.WT.Event
 * @description Получения списка учебных программ.
 * @param {boolean} bCheckAccess - Проверять права доступа
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {bigint[]} aRolesID - массив категорий
 * @param {boolean} bGetDesc - возвращать описание
 * @param {boolean} bWithArchive - добавлять архивные учебные программы
 * @param {string[]} arrDistinct - перечень полей для формирования дополнительных списков для виджета фильтров
 * @param {oSimpleFilterElem[]} arrFilters - набор фильтров
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {boolean} bWithActive - добавлять действующие учебные программы
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication - код приложения, по которому определяется доступ
 * @param {string[]} arrReturnData - массив полей для вывода: "all_event_count"(Общее число мероприятий),"planned_event_count"(Число планируемых мероприятий),"trained_persons_count"(Число обученных сотрудников),"planned_persons_count"(Число сотрудников с запланированным обучением),"lector_count"(Число преподавателей)
 * @param {string} sXqueryFilter - строка Xquery-фильтра
 * @param {bigint} iCurApplicationID - ID текущего приложения
 * @returns {WTEducationMethodsResult}
 */
function GetEducationMethods( bCheckAccess, iCurUserID, aRolesID, bGetDesc, bWithArchive, arrDistinct, arrFilters, oSort, oPaging, bWithActive, sAccessType, sApplication, arrReturnData, sXqueryFilter, iCurApplicationID )
{
    return get_education_methods( bCheckAccess, iCurUserID, aRolesID, bGetDesc, bWithArchive, arrDistinct, arrFilters, oSort, oPaging, bWithActive, sAccessType, sApplication, arrReturnData, sXqueryFilter, iCurApplicationID )
}

function get_education_methods( bCheckAccess, iCurUserID, aRolesID, bGetDesc, bWithArchive, arrDistinct, arrFilters, oSort, oPaging, bWithActive, sAccessType, sApplication, arrReturnData, sXqueryFilter, iCurApplicationID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.array = [];
    oRes.data = {};
    oRes.paging = oPaging;

    try
    {
        if ( bCheckAccess == undefined || bCheckAccess == null )
            throw '';

        bCheckAccess = tools_web.is_true( bCheckAccess );
    }
    catch( ex )
    {
        bCheckAccess = global_settings.settings.check_access_on_lists.Value;
    }

    try
    {
        iCurUserID = OptInt( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 501;
        oRes.errorText = "{ text: 'Invalid param iCurUserID.', param_name: 'iCurUserID' }";
        return oRes;
    }

    if (aRolesID != null)
    {
        try
        {
            if( !IsArray( aRolesID ) )
            {
                throw "error";
            }
            aRolesID = ArraySelect( aRolesID, "OptInt( This ) != undefined" );
        }
        catch( ex )
        {
            aRolesID = new Array();
        }
    }

    try
    {
        if( bGetDesc == undefined || bGetDesc == null || bGetDesc == "" )
        {
            throw "error";
        }
        bGetDesc = tools_web.is_true( bGetDesc );
    }
    catch( ex )
    {
        bGetDesc = false;
    }

    bWithArchive = tools_web.is_true( bWithArchive );

    if ( sAccessType == null || sAccessType == undefined)
    {
        sAccessType = "auto";
    }

    if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "expert" && sAccessType != "observer" )
    {
        sAccessType = "auto";
    }

    if ( sApplication == null || sApplication == undefined)
    {
        sApplication = "";
    }

    iApplicationID = OptInt(sApplication);
    if(iApplicationID != undefined)
    {
        sApplication = ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
    }

    if(sAccessType == "auto" && sApplication != "")
    {

        var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );

        if(iApplLevel >= 10)
        {
            sAccessType = "admin"; //Администратор приложения
        }
        else if(iApplLevel >= 7)
        {
            sAccessType = "manager"; //Администратор процесса
        }
        else if(iApplLevel >= 5)
        {
            sAccessType = "hr"; //Администратор HR
        }
        else if(iApplLevel >= 3)
        {
            sAccessType = "expert"; //Эксперт
        }
        else if(iApplLevel >= 1)
        {
            sAccessType = "observer"; //Наблюдатель
        }
        else
        {
            sAccessType = "reject";
        }
    }

    conds = new Array();
    var arrBossType = [];
    arrPersonConds = [];
    switch(sAccessType)
    {
        case "hr":
            if (ArrayOptFirstElem(arrBossType) == undefined)
            {
                var teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
                if (teApplication != null)
                {
                    if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
                    {
                        manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 ));
                        if (manager_type_id > 0)
                            arrBossType.push(manager_type_id);
                    }
                }
            }

            if(ArrayOptFirstElem(arrBossType) == undefined)
            {
                arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id.Value');
            }
            arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, arrBossType, true ] );

            arrPersonConds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );
            break;

        case "expert":
            oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iCurUserID + " return $elem/Fields('id')"));
            xarrEducationMethods = [];
            if (oExpert != undefined)
            {
                arrCategories = tools.xquery("for $elem in roles where $elem/catalog_name = 'education_method' and contains ($elem/experts, '" + oExpert.id + "') return $elem/Fields('id')");
//				xarrEducationMethods = tools.xquery( "for $elem in education_methods where contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id') " );
//				if ( ArrayOptFirstElem( xarrEducationMethods ) != undefined )
//				{
//					conds.push( "MatchSome( $elem/id, ( " + ArrayMerge( xarrEducationMethods, "This.id", "," ) + " ) )" );
//				}
                if ( ArrayOptFirstElem( arrCategories ) != undefined )
                {
                    conds.push( "MatchSome($elem/role_id, (" + ArrayMerge ( arrCategories, 'This.id', ',' ) + "))" );
                }
                else
                {
                    return oRes;
                }
            }
            else
            {
                return oRes;
            }

            break;
        case "observer":
            arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, [], true ] );
            if ( ArrayOptFirstElem(arrSubordinateIDs) != undefined )
            {
                arrPersonConds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );
            }
            break;
        case "reject":
            return oRes;
    }

    if ( arrReturnData == null || arrReturnData == undefined)
    {
        arrReturnData = [];
    }
    bAll_event_count = false; //Общее число мероприятий
    bPlanned_event_count = false; //Число планируемых мероприятий
    bTrained_persons_count = false; //Число обученных сотрудников
    bPlanned_persons_count = false; //Число сотрудников с запланированным обучением
    bLector_count = false; //Число преподавателей
    if ( ArrayOptFirstElem( arrReturnData ) != undefined )
    {
        for ( itemReturnData in arrReturnData )
        {
            switch ( itemReturnData )
            {
                case "all_event_count": //Общее число мероприятий
                    bAll_event_count = true;
                    break;
                case "planned_event_count": //Число планируемых мероприятий
                    bPlanned_event_count = true;
                    break;
                case "trained_persons_count": //Число обученных сотрудников
                    bTrained_persons_count = true;
                    break;
                case "planned_persons_count": //Число сотрудников с запланированным обучением
                    bPlanned_persons_count = true;
                    break;
                case "lector_count": //Число преподавателей
                    bLector_count = true;
                    break;
            }
        }
    }

    if ( bWithActive == null || bWithActive == undefined || bWithActive == "" )
    {
        bWithActive = true
    }
    else
    {
        bWithActive = tools_web.is_true( bWithActive );
    }

    if ( sXqueryFilter == null || sXqueryFilter == undefined)
        sXqueryFilter = "";

    if ( sXqueryFilter != "" )
    {
        conds.push( sXqueryFilter );
    }

    if( aRolesID != null )
    {
        conds.push( "MatchSome( $elem/role_id, ( " + ArrayMerge( aRolesID, "This", "," ) + " ) )" );
    }

    if(!bWithArchive)
    {
        conds.push( "$elem/state_id != 'archive'" );
    }

    if(!bWithActive)
    {
        conds.push( "$elem/state_id != 'active'" );
    }

    var sRoleCond;
    var bIsAjaxRoleFilter = false;
    for(oFilter in arrFilters)
    {
        if(oFilter.type == 'search')
        {
            if(oFilter.value != "") conds.push( "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )" );
        }
        else if(oFilter.type == 'select')
        {
            switch(oFilter.id)
            {
                case "role_id":
                {
                    bIsAjaxRoleFilter = true;
                    sRoleCond = "";
                    if(ArrayOptFind(oFilter.value, "This.value != ''") != undefined)
                    {
                        sRoleCond =  "MatchSome( $elem/role_id, ( " + ArrayMerge(ArraySelect(oFilter.value, "This.value != ''"), "This.value", ",") + " ) )";
                    }

                    if(ArrayOptFind(oFilter.value, "This.value == ''") != undefined)
                    {
                        if(sRoleCond == "")
                            sRoleCond = "IsEmpty($elem/role_id)=true()";
                        else
                            sRoleCond = "( " + sRoleCond + " or IsEmpty($elem/role_id)=true() )"
                    }

                    if(sRoleCond != "")
                        conds.push( sRoleCond );
                    break;
                }
            }
        }
        else
        {
            /*switch(oFilter.id)
			{
				case "status":
				{

					break;
				}
			}
			*/
        }
    }

    var sCondSort = " order by $elem/name";
    var bSortByQuery = true;
    if(ObjectType(oSort) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
    {
        switch(oSort.FIELD)
        {
            case "name":
                sCondSort = " order by $elem/name" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
                break;
            case "comment":
            case "desc":
            default:
                var oCatObj = tools.new_doc_by_name( "education_method", true ).TopElem.AddChild();
                if ( oCatObj.ChildExists( oSort.FIELD ) )
                {
                    sCondSort = " order by $elem/" + oSort.FIELD + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
                }
                else
                {
                    bSortByQuery = false;
                }
        }
    }

    var sXQueryConditions = ArrayOptFirstElem( conds ) != undefined ? " where " + ArrayMerge( conds, "This", " and " ) : "" ;
    var sReqEduMethods =  "for $elem in education_methods " + sXQueryConditions + sCondSort + " return $elem/Fields( 'id', 'name', 'resource_id', 'role_id' )";
    var arrEduMethods = tools.xquery(sReqEduMethods);
    var iTotal = ArrayOptSize( arrEduMethods );

    if(bCheckAccess){
        var arrEduMethodsPush = new Array()
        for (oEduMethod in arrEduMethods){
            if(tools_web.check_access( oEduMethod.id.Value, iCurUserID )){
                arrEduMethodsPush.push(oEduMethod)
            }
        }
        arrEduMethods = arrEduMethodsPush
    }

    if(ArrayOptFirstElem(arrDistinct) != undefined)
    {
        oRes.data.SetProperty("distincts", {});
        for(sFieldName in arrDistinct)
        {
            oRes.data.distincts.SetProperty(sFieldName, []);
            switch(sFieldName)
            {
                case "role_id":
                {
//					var strRoles = ArrayMerge(arrEduMethods, "ArrayMerge(This.role_id, 'This.Value', ',')", ",");
//					var arrRoles = ArrayExtract(ArraySelectDistinct(strRoles.split(",")), "OptInt(This,null)");
//					var xarrRoles = tools.xquery("for $elem in roles where $elem/catalog_name='education_method' and MatchSome($elem/id, (" + ArrayMerge(ArraySelect(arrRoles, "This!=null"), "This", ",") + ")) return $elem/Fields('name','id')")

//					if(ArrayOptFind(arrRoles, "This==null") != undefined)
//					{
                    oRes.data.distincts.role_id.push({name:i18n.t( 'bezkategorii' ), value: ""})
//					}
                    var xarrRoles = tools.xquery("for $elem in roles where $elem/catalog_name='education_method' return $elem/Fields('name','id')")

                    for(fldRole in xarrRoles )
                    {
                        oRes.data.distincts.role_id.push({name:fldRole.name.Value, value: fldRole.id.Value})
                    }
                    break;
                }
            }
        }
    }


    if(ObjectType(oPaging) == 'JsObject' && oPaging.SIZE != null && bSortByQuery && iTotal > 0)
    {
        oPaging.MANUAL = true;
        oPaging.TOTAL = iTotal;
        oRes.paging = oPaging;
        arrEduMethods = ArrayRange(arrEduMethods, ( OptInt(oPaging.START_INDEX, 0) > 0 ? oPaging.START_INDEX : OptInt(oPaging.INDEX, 0) * oPaging.SIZE ), oPaging.SIZE);
    }

    xarrEvents = tools.xquery( "for $elem in events where $elem/education_method_id != null() return $elem/Fields('education_method_id', 'status_id', 'id')" );

    if ( bTrained_persons_count || bPlanned_persons_count )
    {
        sEventResultsXQueryConditions = ArrayOptFirstElem( arrPersonConds ) != undefined ? " where " + ArrayMerge( arrPersonConds, "This", " and " ) : "" ;
        xarrEventResults = tools.xquery( "for $elem in event_results " + sEventResultsXQueryConditions + " return $elem/Fields('event_id', 'is_assist')" );
    }

    var docEduM, teEduM, feEducationOrg;
    for( _em in arrEduMethods )
    {
        arrRolesNames = [];
        if(!bIsAjaxRoleFilter)
        {
            for ( fldRole in _em.role_id )
            {
                fldRoleFE = fldRole.OptForeignElem;
                if ( fldRoleFE != undefined )
                    arrRolesNames.push( fldRoleFE.name.Value );
            }
        }

        docEduM = tools.open_doc(_em.id.Value);

        if(docEduM == undefined)
            continue

        teEduM = docEduM.TopElem;

        if ( teEduM.type.Value == "org" )
        {
            if( teEduM.education_org_id.HasValue )
            {
                feEducationOrg = teEduM.education_org_id.OptForeignElem;
                sObject_name = ( feEducationOrg != undefined ? feEducationOrg.disp_name.Value : "[object deleted]" );
            }
            else
            {
                sObject_name = "";
            }
        }
        else
            sObject_name = ( teEduM.course_id.HasValue ? teEduM.course_id.ForeignElem.name.Value : "" )

        oEM = {
            "id": _em.id.Value,
            "name": _em.name.Value,
            "link": get_object_link( "education_plan", _em.id ),
            "image": get_object_image_url( _em ),
            "desc": ( bGetDesc ? teEduM.desc.Value : "" ),
            "comment": ( bGetDesc ? teEduM.comment.Value : "" ),
            "roles_names" : ArrayMerge( arrRolesNames, 'This', '|||' ),
            "type": ( teEduM.type.Value == "org"? i18n.t( 'provayder' ) : i18n.t( 'kurs' )), //Тип – строка: Провайдер или Курс в зависимости от типа программы;
            "object_name": sObject_name,  //Объект – краткое название обучающей организации (если тип Провайдер) или курса (если тип Курс);
            "state": teEduM.state_id.ForeignElem.name, //Статус;
            "edu_type": common.education_method_types.GetChildByKey( teEduM.type.Value ).name.Value, //Тип обучения;
            "duration": teEduM.duration.Value,//Длительность (часов);
            "all_event_count": null, //Общее число мероприятий
            "planned_event_count": null, //Число планируемых мероприятий
            "trained_persons_count": null, //Число обученных сотрудников
            "planned_persons_count": null, //Число сотрудников с запланированным обучением
            "lector_count": null //Число преподавателей
        }

        if ( bAll_event_count || bPlanned_event_count || bTrained_persons_count || bPlanned_persons_count )
        {
            xarrEvents = ArraySelectAll( xarrEvents );
        }

        if ( bAll_event_count )
        {
            oEM.all_event_count = ArrayCount( ArraySelect( xarrEvents, "This.education_method_id.Value == _em.id.Value && This.status_id.Value != 'cancel' && This.status_id.Value != 'project'" ) ); //кроме Отменено и Проект
        }
        if ( bPlanned_event_count )
        {
            oEM.planned_event_count = ArrayCount( ArraySelect( xarrEvents, "This.education_method_id.Value == _em.id.Value && This.status_id.Value == 'plan'" ) ); //со статусом Планируется
        }
        if ( bTrained_persons_count )
        {
            arrPersonsCond = [];
            xarrTrainedPersonsEvents = ArraySelect( xarrEvents, "This.education_method_id.Value == _em.id.Value && (This.status_id.Value == 'active' || This.status_id.Value == 'close')" )
            if (  ArrayOptFirstElem(xarrTrainedPersonsEvents) != undefined )
            {
                arrPersonsCond.push( "(This.event_id.Value == " + ArrayMerge(xarrTrainedPersonsEvents, "This.id.Value", " || This.event_id.Value == ") + ")" );
                arrPersonsCond.push("This.is_assist.Value == true");
            }
            oEM.trained_persons_count = ArrayCount( ArraySelect( xarrEventResults, ArrayMerge( arrPersonsCond, "This" , " && " ) ) ); //Число обученных сотрудников – число всех участников мероприятий со статусами Проводится и Завершено, у которых отмечен признак присутствия
        }

        if ( bPlanned_persons_count )
        {
            arrPersonsCond = [];
            xarrPlannedPersonsEvents = ArraySelect( xarrEvents, "This.education_method_id.Value == _em.id.Value && This.status_id.Value == 'plan'" )
            if (  ArrayOptFirstElem(xarrPlannedPersonsEvents) != undefined )
            {
                arrPersonsCond.push( "(This.event_id.Value == " + ArrayMerge(xarrPlannedPersonsEvents, "This.id.Value", " || This.event_id.Value == ") + ")" );
            }
            oEM.planned_persons_count = ArrayCount( ArraySelect( xarrEventResults, ArrayMerge( arrPersonsCond, "This" , " && " ) ) ); //Число сотрудников с запланированным обучением - число всех участников мероприятий со статусом Планируется
        }

        if ( bLector_count )
        {
            oEM.lector_count = ArrayCount( teEduM.lectors ); //Число преподавателей
        }

        oRes.array.push( oEM );
    }
    if ( !bSortByQuery && iTotal > 0 )
    {
        oRes.array = ArraySort( oRes.array, oSort.FIELD, ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? "-" : "+" ) );
        if( ObjectType(oPaging) == 'JsObject' && oPaging.SIZE != null )
        {
            oPaging.MANUAL = true;
            oPaging.TOTAL = iTotal;
            oRes.paging = oPaging;
            oRes.array = ArrayRange( oRes.array, ( OptInt( oPaging.START_INDEX, 0 ) > 0 ? oPaging.START_INDEX : OptInt( oPaging.INDEX, 0 ) * oPaging.SIZE ), oPaging.SIZE );
        }
    }
    return oRes;
}

/** @typedef {Object} oEventResult
 * @property {bigint} id
 * @property {string} event_name
 * @property {string} person_fullname
 * @property {string} status_id
 * @property {string} status_name
 * @property {string} person_icon
 * @property {string} person_link
 * @property {string} person_position_name
 * @property {string} event_link
 * @property {string} event_type_name
 * @property {boolean} is_assist
 * @property {number} score
 * @property {date} start_date
 * @property {date} finish_date
 * @property {string} education_org_name
 */
/**
 * @typedef {Object} WTPersonEventResultsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oEventResult[]} array
 */
/**
 * @function GetPersonEventResults
 * @memberof Websoft.WT.Event
 * @author PL
 * @description Получения списка результата мероприятий по сотруднику.
 * @param {bigint} iPersonID - ID пользователя
 * @param {string} [sType] - Тип отбора сотрудников
 * @param {string[]} [aStates] - Массив статусов
 * @param {boolean} [bOnlyPast] - Показывать только данные по прошедшим мероприятиям
 * @param {boolean} [bShowDismiss] - Показывать уволенных сотрудников
 * @param {string} [sSearch] - Строка поиска
 * @param {boolean} [bAllHier] - Искать всех руководителей вверх по иерархии
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителя
 * @param {number} [iNum] - Количество возвращаемых записей
 * @returns {WTPersonEventResultsResult}
 */
function GetPersonEventResults( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum )
{
    return get_person_event_results( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum );
}

function get_person_event_results( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        iNum = OptInt( iNum );
    }
    catch( ex )
    {
        iNum = undefined;
    }

    try
    {
        if( sSearch == undefined || sSearch == null || sSearch == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSearch = "";
    }

    try
    {
        if( sType == undefined || sType == null || sType == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sType = "all_subordinates";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( !IsArray( aStates ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        aStates = new Array();
    }

    try
    {
        if( bOnlyPast == undefined || bOnlyPast == null || bOnlyPast == "" )
        {
            throw "error";
        }
        bOnlyPast = tools_web.is_true( bOnlyPast );
    }
    catch( ex )
    {
        bOnlyPast = false;
    }

    try
    {
        if( bAllHier == undefined || bAllHier == null || bAllHier == "" )
        {
            throw "error";
        }
        bAllHier = tools_web.is_true( bAllHier );
    }
    catch( ex )
    {
        bAllHier = false;
    }

    try
    {
        if( bShowDismiss == undefined || bShowDismiss == null || bShowDismiss == "" )
        {
            throw "error";
        }
        bShowDismiss = tools_web.is_true( bShowDismiss );
    }
    catch( ex )
    {
        bShowDismiss = false;
    }


    arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, sType, bShowDismiss, sSearch, bAllHier, arrBossTypesID ] );
    if( ArrayOptFirstElem( arrCollaborators ) == undefined )
    {
        return oRes;
    }
    iLastCount = 0;
    iCurCount = 0;
    iCollaboratorCount = ArrayCount( arrCollaborators );
    event_conds = new Array();
    if( bOnlyPast )
    {
        event_conds.push( "$event/finish_date < " + XQueryLiteral( Date() ) );
    }
    if( ArrayOptFirstElem( aStates ) != undefined )
    {
        event_conds.push( "MatchSome( $event/status_id, ( " + ArrayMerge( aStates, "XQueryLiteral( String( This ) )", "," ) + " ) )" );
    }
    event_conds.push( "$elem/event_id = $event/id" );
    while( iLastCount < iCollaboratorCount )
    {
        arrTempCollaborator = ArrayRange( arrCollaborators, iLastCount, 1000 );
        conds = new Array();
        if( sSearch != "" )
        {
            conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
        }

        conds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrTempCollaborator, "This.id", "," ) + " ) )" );
        if( ArrayOptFirstElem( aStates ) != undefined || bOnlyPast )
        {
            xarrEventResults =XQuery( "for $elem in event_results where some $event in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and " + ArrayMerge( conds, "This", " and " ) + "  return $elem/Fields('id','person_id','person_fullname','person_position_name','event_id','event_name','is_assist','score')" );
        }
        else
        {
            xarrEventResults = XQuery( "for $elem in event_results where " + ArrayMerge( conds, "This", " and " ) + " return $elem/Fields('id','person_id','person_fullname','person_position_name','event_id','event_name','is_assist','score')" );
        }
        bBreak = false;
        for( _ev in xarrEventResults )
        {
            oEventResult = new Object();
            oEventResult.id = _ev.id.Value;
            oEventResult.person_id = _ev.person_id.Value;
            oEventResult.person_fullname = _ev.person_fullname.Value;
            oEventResult.person_position_name = _ev.person_position_name.Value;
            oEventResult.person_icon = tools_web.get_object_source_url( 'person', _ev.person_id );
            oEventResult.person_link = get_object_link( null, _ev.person_id );
            oEventResult.event_link = get_object_link( null, _ev.event_id );
            oEventResult.event_id = _ev.event_id.Value;
            oEventResult.event_name = _ev.event_name.Value;
            oEventResult.is_assist = _ev.is_assist.Value;
            oEventResult.score = _ev.score.Value;
            oRes.array.push( oEventResult );

            iCurCount++;
            if( iNum != undefined && iNum <= iCurCount )
            {
                bBreak = true;
                break;
            }
        }
        if( bBreak )
        {
            break;
        }
        iLastCount += 1000;
    }
    if( ArrayOptFirstElem( oRes.array ) != undefined )
    {
        xarrEvents =XQuery( "for $elem_qc in events where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelectDistinct( oRes.array, "This.event_id" ), "This.event_id", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','status_id','start_date','duration_fact','finish_date','education_org_name','resource_id','event_type_id')" );
        if( ArrayOptFirstElem( xarrEvents ) != undefined )
        {
            xarrEvents =  ArrayDirect( xarrEvents )
            xarrEventTypes = ArrayDirect( XQuery( "for $elem_qc in event_types where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelectDistinct( xarrEvents, "This.event_type_id" ), "This.event_type_id", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','name')" ) );
            for( _ev in oRes.array )
            {
                catEvent = ArrayOptFindBySortedKey( xarrEvents, _ev.event_id, "id" );
                if( catEvent == undefined )
                {
                    continue;
                }
                _ev.SetProperty( "status_id", catEvent.status_id.Value );
                feStatus = catEvent.status_id.OptForeignElem;
                if( feStatus != undefined )
                {
                    _ev.SetProperty( "status_name", feStatus.name.Value );
                }
                _ev.SetProperty( "start_date", catEvent.start_date.Value );
                _ev.SetProperty( "duration_fact", catEvent.duration_fact.Value );
                _ev.SetProperty( "finish_date", catEvent.finish_date.Value );
                _ev.SetProperty( "education_org_name", catEvent.education_org_name.Value );
                _ev.SetProperty( "event_image", get_object_image_url( catEvent ) );
                catEventType = ArrayOptFindBySortedKey( xarrEventTypes, catEvent.event_type_id, "id" );
                if( catEvent != undefined )
                {
                    _ev.SetProperty( "event_type_name", catEventType.name.Value );
                }
            }
        }
    }
    return oRes;
}

/** @typedef {Object} oPopularEvent
 * @property {bigint} id
 * @property {string} name
 * @property {string} image
 * @property {number} count
 * @property {number} success_percent
 * @property {number} total_hours
 * @property {boolean} is_coming
 * @property {number} total_num
 */
/**
 * @typedef {Object} WTPopularEventsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oPopularEvent[]} array
 */
/**
 * @function GetPopularEvents
 * @memberof Websoft.WT.Event
 * @author PL
 * @description Получения списка cамых популярных мероприятий.
 * @param {bigint} iPersonID - ID пользователя
 * @param {string} [sType] - Тип отбора сотрудников
 * @param {string[]} [aStates] - Массив статусов
 * @param {boolean} [bOnlyPast] - Показывать только данные по прошедшим мероприятиям
 * @param {boolean} [bShowDismiss] - Показывать уволенных сотрудников
 * @param {string} [sSearch] - Строка поиска
 * @param {boolean} [bAllHier] - Искать всех руководителей вверх по иерархии
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителя
 * @param {number} [iNum] - Количество возвращаемых записей
 * @param {string} [sSortType] - Тип сортировки
 * @returns {WTPopularEventsResult}
 */
function GetPopularEvents( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType )
{
    return get_popular_events( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType );
}

function get_popular_events( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType, bCheckAccess, iCurUserID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        iNum = OptInt( iNum );
    }
    catch( ex )
    {
        iNum = undefined;
    }

    try
    {
        if( sSearch == undefined || sSearch == null || sSearch == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSearch = "";
    }

    try
    {
        if( sType == undefined || sType == null || sType == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sType = "all_subordinates";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( !IsArray( aStates ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        aStates = new Array();
    }

    try
    {
        if( bAllHier == undefined || bAllHier == null || bAllHier == "" )
        {
            throw "error";
        }
        bAllHier = tools_web.is_true( bAllHier );
    }
    catch( ex )
    {
        bAllHier = false;
    }

    try
    {
        if( bShowDismiss == undefined || bShowDismiss == null || bShowDismiss == "" )
        {
            throw "error";
        }
        bShowDismiss = tools_web.is_true( bShowDismiss );
    }
    catch( ex )
    {
        bShowDismiss = false;
    }
    try
    {
        if ( bCheckAccess == undefined || bCheckAccess == null )
            throw '';

        bCheckAccess = tools_web.is_true( bCheckAccess );
    }
    catch( ex )
    {
        bCheckAccess = global_settings.settings.check_access_on_lists.Value;
    }
    docCurUser = tools.open_doc( iCurUserID );
    if ( docCurUser == undefined )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaotkrytiya' ) + iCurUserID;
        return oRes;
    }
    teCurUser = docCurUser.TopElem;


    arrEventResults = get_person_event_results( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID ).array;
    if( ArrayOptFirstElem( arrEventResults ) == undefined )
    {
        return oRes;
    }

    for( _event in ArraySelectDistinct( arrEventResults, "This.event_id" ) )
    {
        arrEventEventResults = ArraySelect( arrEventResults, "This.event_id == _event.event_id" );
        arrAssistEventResults = ArraySelect( arrEventEventResults, "This.is_assist" );
        oRes.array.push( {
            "id": _event.event_id,
            "name": _event.event_name,
            "image": _event.GetOptProperty( "event_image", "" ),
            "event_link": _event.GetOptProperty( "event_link", "" ),
            "count": ArrayCount( arrAssistEventResults ),
            "total_num": ArrayCount( arrEventEventResults ),
            "total_hours": _event.duration_fact,
            "is_coming": ( _event.finish_date > Date() ),
            "success_percent": ( ArrayCount( arrEventEventResults ) > 0 ? ( ( ArrayCount( arrAssistEventResults ) * 100 )/ArrayCount( arrEventEventResults ) ) : 0 )
        } )
    }

    switch( sSortType )
    {
        case "name":
            oRes.array = ArraySort( oRes.array, "This.name", "+" );
            break;
        default:
            oRes.array = ArraySort( oRes.array, "This.count", "-" );
            break;
    }
    if( iNum != undefined )
    {
        oRes.array = ArrayRange( oRes.array, 0, iNum );
    }

    if ( bCheckAccess )
    {
        oRes.array = ArraySelect( oRes.array, "tools_web.check_access( This.id, iCurUserID, teCurUser )" );
    }

    return oRes;
}

/** @typedef {Object} oTrainedPerson
 * @property {bigint} id
 * @property {string} name
 * @property {string} position_name
 * @property {string} person_link
 * @property {string} image
 * @property {number} count
 * @property {number} past_count
 * @property {number} presense_percent
 * @property {number} total_hours
 * @property {number} plan_count
 */
/**
 * @typedef {Object} WTTrainedPersonsResult
 * @property {number} error
 * @property {string} errorText
 * @property {boolean} result
 * @property {oTrainedPerson[]} array
 */
/**
 * @function GetTrainedPersons
 * @memberof Websoft.WT.Event
 * @author PL
 * @description Получения списка cамых обученных сотрудников.
 * @param {bigint} iPersonID - ID пользователя
 * @param {string} [sType] - Тип отбора сотрудников
 * @param {string[]} [aStates] - Массив статусов
 * @param {boolean} [bOnlyPast] - Показывать только данные по прошедшим мероприятиям
 * @param {boolean} [bShowDismiss] - Показывать уволенных сотрудников
 * @param {string} [sSearch] - Строка поиска
 * @param {boolean} [bAllHier] - Искать всех руководителей вверх по иерархии
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителя
 * @param {number} [iNum] - Количество возвращаемых записей
 * @param {string} [sSortType] - Тип сортировки
 * @returns {WTTrainedPersonsResult}
 */
function GetTrainedPersons( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType )
{
    return get_trained_persons( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType );
}

function get_trained_persons( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID, iNum, sSortType )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        iNum = OptInt( iNum );
    }
    catch( ex )
    {
        iNum = undefined;
    }

    try
    {
        if( sSearch == undefined || sSearch == null || sSearch == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSearch = "";
    }

    try
    {
        if( sType == undefined || sType == null || sType == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sType = "all_subordinates";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( !IsArray( aStates ) )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        aStates = new Array();
    }

    try
    {
        if( bAllHier == undefined || bAllHier == null || bAllHier == "" )
        {
            throw "error";
        }
        bAllHier = tools_web.is_true( bAllHier );
    }
    catch( ex )
    {
        bAllHier = false;
    }

    try
    {
        if( bShowDismiss == undefined || bShowDismiss == null || bShowDismiss == "" )
        {
            throw "error";
        }
        bShowDismiss = tools_web.is_true( bShowDismiss );
    }
    catch( ex )
    {
        bShowDismiss = false;
    }


    arrEventResults = get_person_event_results( iPersonID, sType, aStates, bOnlyPast, bShowDismiss, sSearch, bAllHier, arrBossTypesID ).array;
    if( ArrayOptFirstElem( arrEventResults ) == undefined )
    {
        return oRes;
    }

    for( _person in ArraySelectDistinct( arrEventResults, "This.person_id" ) )
    {
        arrPersonEventResults = ArraySelect( arrEventResults, "This.person_id == _person.person_id" );
        iPastCount = ArrayCount( ArraySelect( arrPersonEventResults, "This.is_assist && This.finish_date < Date()" ) );
        arrPastEventResults = ArraySelect( arrPersonEventResults, "This.finish_date < Date() && This.status_id != 'cancel'" );
        arrAssistPastEventResults = ArraySelect( arrPastEventResults, "This.is_assist" );
        iPresensePastCount = ArrayCount( arrPastEventResults );
        oRes.array.push( {
            "id": _person.person_id,
            "name": _person.person_fullname,
            "position_name": _person.person_position_name,
            "image": _person.GetOptProperty( "person_icon", "" ),
            "person_link": _person.GetOptProperty( "person_link", "" ),
            "count": ArrayCount( ArraySelect( arrPersonEventResults, "This.is_assist" ) ),
            "past_count": iPastCount,
            "presense_percent": ( iPresensePastCount == 0 ? 0 : ( ( ArrayCount( arrAssistPastEventResults ) * 100 ) / iPresensePastCount ) ),
            "total_hours": ArraySum( arrAssistPastEventResults, "OptInt( This.GetOptProperty( 'duration_fact' ), 0 )" ),
            "plan_count": ArrayCount( ArraySelect( arrPersonEventResults, "This.finish_date > Date() && This.status_id != 'cancel'" ) )
        } )
    }

    switch( sSortType )
    {
        case "name":
            oRes.array = ArraySort( oRes.array, "This.name", "+" );
            break;
        default:
            oRes.array = ArraySort( oRes.array, "This.count", "-" );
            break;
    }
    if( iNum != undefined )
    {
        oRes.array = ArrayRange( oRes.array, 0, iNum );
    }

    return oRes;
}

/**
 * @typedef {Object} oEventMaterial
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} link
 */
/**
 * @typedef {Object} WTEventMaterialResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oEventMaterial[]} array – массив
 */
/**
 * @function GetEventMaterials
 * @memberof Websoft.WT.Event
 * @description Получения списка материалов по мероприятию.
 * @param {bigint} iEventID - ID мероприятия
 * @param {bigint} iCurUserID - ID сотрудника
 * @param {string} [sTypeMaterial] - тип материала
 * @param {boolean} [bShowEventResultFiles=false] - отображать файлы результатов мероприятия
 * @returns {WTEventMaterialResult}
 */
function GetEventMaterials( iEventID, iCurUserID, sTypeMaterial, bShowEventResultFiles )
{
    return get_event_materials( iEventID, null, iCurUserID, null, sTypeMaterial, bShowEventResultFiles )
}
function get_event_materials( iEventID, teEvent, iCurUserID, curUser, sTypeMaterial, bShowEventResultFiles )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];
    try
    {
        iEventID = Int( iEventID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_1' );
        return oRes;
    }
    try
    {
        teEvent.Name;
    }
    catch( ex )
    {
        try
        {
            teEvent = OpenDoc( UrlFromDocID( iEventID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre_1' );
            return oRes;
        }
    }
    try
    {
        iCurUserID = Int( iCurUserID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre' );
        return oRes;
    }
    try
    {
        curUser.Name;
    }
    catch( ex )
    {
        try
        {
            curUser = OpenDoc( UrlFromDocID( iCurUserID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 1;
            oRes.errorText = i18n.t( 'peredannekorre' );
            return oRes;
        }
    }
    try
    {
        if( bShowEventResultFiles == undefined || bShowEventResultFiles == null )
            throw '';
        bShowEventResultFiles = tools_web.is_true( bShowEventResultFiles );
    }
    catch( ex )
    {
        bShowEventResultFiles = false;
    }
    try
    {
        if( sTypeMaterial == undefined || sTypeMaterial == null || sTypeMaterial == "" )
            throw '';
    }
    catch( ex )
    {
        sTypeMaterial = "all";
    }

    switch( sTypeMaterial )
    {
        case "all":
        case "files":
            oRes.array = ArrayUnion( oRes.array, get_event_files( iEventID, teEvent, iCurUserID, curUser, bShowEventResultFiles ).array );
            if( sTypeMaterial == "files" )
            {
                break;
            }
        case "catalogs":
            oRes.array = ArrayUnion( oRes.array, tools.call_code_library_method( 'libMain', 'get_object_catalogs', [ iEventID, teEvent ] ).array );
            break;
    }

    return oRes;
}

/**
 * @typedef {Object} WTSaveEventResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {XmDoc} doc_event – документ карточки мероприятия
 */
/**
 * @function SaveEvent
 * @memberof Websoft.WT.Event
 * @author PL
 * @description Сохранение карточки мероприятия.
 * @param {XmDoc} docEvent - документ карточки мероприятия
 * @param {boolean} bNeedSave - сохранить карточку
 * @returns {WTSaveEventResult}
 */
function SaveEvent( docEvent, bNeedSave )
{

    try{
        if( bNeedSave == null || bNeedSave == undefined || bNeedSave == "" )
        {
            throw "error";
        }
        bNeedSave = tools_web.is_true( bNeedSave );
    }
    catch( ex )
    {
        bNeedSave = true;
    }
    var oRes = new Object();
    oRes.error = 0;
    oRes.message = "";

    try
    {
        docEvent.TopElem;
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect docEvent";
        return oRes;
    }
    var teEvent = docEvent.TopElem;
    var iEventID = teEvent.id.HasValue ? teEvent.id.Value: docEvent.DocID;
    oResCheck = tools.check_event_fields( iEventID, docEvent, teEvent );
    if( oResCheck.error != 0 )
    {
        return oResCheck;
    }

    var teLastSavedData = undefined;
    try
    {
        if( !docEvent.NeverSaved )
        {
            teLastSavedData = tools.open_doc( iEventID );
            if( teLastSavedData != undefined )
            {
                teLastSavedData = teLastSavedData.TopElem;
            }
        }
    }
    catch( ex ){}
    var feEventType = teEvent.event_type_id.OptForeignElem;
    var teWebinarSystem = null;
    var oParam;
    if( feEventType != undefined && feEventType.online && teEvent.webinar_system_id.HasValue && teEvent.webinar_system_id.OptForeignElem != undefined )
    {
        oParam = new Object();
        oParam.iEventId = iEventID;
        oParam.docEvent = docEvent;

        //teWebinarSystem = OpenDoc( UrlFromDocID( teEvent.webinar_system_id ) ).TopElem;

        var bNeedCallSaveMethod = teLastSavedData == undefined || teLastSavedData.name != teEvent.name || teLastSavedData.start_date != teEvent.start_date || teLastSavedData.webinar_system_id != teEvent.webinar_system_id || !teEvent.get_webinar_setting('first_saved','bool');
        try
        {
            var oResNeedCallSaveMethod = tools.call_webinar_system_method( teEvent.webinar_system_id, "NeedCallSaveMethod", oParam );
            if( oResNeedCallSaveMethod.need_update != true && oResNeedCallSaveMethod.need_update != false )
            {
                throw "error";
            }
            bNeedCallSaveMethod = oResNeedCallSaveMethod.need_update;
        }
        catch( ex )
        {}

        if( bNeedCallSaveMethod )
        {
            if( !teEvent.get_webinar_setting( 'first_saved', 'bool' ) )
            {
                teEvent.set_webinar_setting('first_saved', true, 'bool');
            }
            oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "onEventSave", oParam );
            if( oResult.error != 0 )
            {
                return oResult;
            }
            if( oResult.GetOptProperty( "message", "" ) != "" )
            {
                oRes.SetProperty( "message", oResult.GetOptProperty( "message", "" ) );
            }
        }
    }

    var feWebinarSystem = teEvent.webinar_system_id.HasValue ? teEvent.webinar_system_id.OptForeignElem : undefined;
    if( teEvent.status_id == "active" && !teEvent.conversation_id.HasValue && ( teEvent.use_vclass || ( feEventType != undefined && feEventType.online && feWebinarSystem != undefined && ( feWebinarSystem.code == 'vclass3' || feWebinarSystem.code == "vclass4" ) ) ) )
    {
        oResCreateVclassSetting = CallServerMethod( "tools", "call_code_library_method", [ "libEducation", "CreateVclassSetting", [ iEventID, teEvent.name.Value, teEvent.code.Value ] ] );
        teEvent.vclass_setting_id = oResCreateVclassSetting.vclass_setting_id;
        teEvent.conversation_id = oResCreateVclassSetting.conversation_id;
    }
    oRes.doc_event = docEvent;

    if( oRes.error != 0 )
    {
        return oRes;
    }
    if( docEvent.TopElem.need_create_results )
    {
        docEvent.TopElem.create_results();
        docEvent.TopElem.need_create_results = false;
    }
    if( bNeedSave )
    {
        docEvent.Save();
        AfterSaveEvent( iEventID, docEvent, feEventType );
    }
    return oRes;
}

function CreateVclassSetting( iEventID, sEventName, sEventCode )
{
    var oRes = new Object();
    oRes.error = 0;
    oRes.message = "";
    oRes.vclass_setting_id = "";
    oRes.conversation_id = "";
    var catConversation = ArrayOptFirstElem( XQuery( "for $elem in conversations where $elem/active_object_id = " + iEventID + " return $elem" ) );
    if( catConversation == undefined )
    {
        var oParticipantEvent = new Object();
        oParticipantEvent.id = iEventID;
        oParticipantEvent.type = "event";
        oParticipantEvent.name = sEventName;
        var oResConversation = CallServerMethod( "tools", "call_code_library_method", [ "libChat", "change_participants_conversation", [ null, null, "event", iEventID, null, null, null, null, "channel", sEventName, null, null, null, oParticipantEvent ] ] );
        if( oResConversation.error == 0 )
        {
            oRes.conversation_id = oResConversation.conversation_id;
        }
    }
    else
    {
        oRes.conversation_id = catConversation.id.Value;
    }
    return oRes;
}

function AfterSaveEvent( iEventID, docEvent, feEventType )
{
    var oRes = new Object();
    oRes.error = 0;
    oRes.message = "";

    try
    {
        docEvent.TopElem;
    }
    catch( err )
    {
        docEvent = tools.open_doc( iEventID );
        if( docEvent == undefined )
        {
            oRes.error = 1;
            oRes.message = "Incorrect docEvent";
            return oRes;
        }
    }
    var teEvent = docEvent.TopElem;
    try
    {
        feEventType.Name;
    }
    catch( ex )
    {
        feEventType = teEvent.event_type_id.OptForeignElem;
    }

    if( feEventType != undefined && feEventType.online && teEvent.webinar_system_id.HasValue && teEvent.webinar_system_id.OptForeignElem != undefined )
    {
        var oParam = new Object();
        oParam.iEventId = iEventID;
        oParam.docEvent = docEvent;

        var bNeedCallAfterSaveMethod = false;
        try
        {
            var oResNeedCallAfterSaveMethod = tools.call_webinar_system_method( teEvent.webinar_system_id, "NeedCallAfterSaveMethod", oParam );
            if( oResNeedCallAfterSaveMethod.need_update != true && oResNeedCallAfterSaveMethod.need_update != false )
            {
                throw "error";
            }
            bNeedCallAfterSaveMethod = oResNeedCallAfterSaveMethod.need_update;
        }
        catch( ex )
        {}

        if( bNeedCallAfterSaveMethod )
        {
            if( !teEvent.get_webinar_setting( 'first_saved', 'bool' ) )
            {
                teEvent.set_webinar_setting('first_saved', true, 'bool');
            }
            var oResult = tools.call_webinar_system_method( teEvent.webinar_system_id, "onAfterEventSave", oParam );
            if( oResult.error != 0 )
            {
                return oResult;
            }
            if( oResult.GetOptProperty( "message", "" ) != "" )
            {
                oRes.SetProperty( "message", oResult.GetOptProperty( "message", "" ) );
            }
        }
    }
    return oRes;
}

function ChangeEventCollaborators( sCommand, iPersonID, arrEventIds, sAction, bOnlyFutureEvent, bSendNotification, iAddNotificationID, iExcludeNotificationID, bAddTextNotification, bSendNotificationBoss, iAddNotificationBossID, SCOPE_WVARS )
{
    function merge_form_fields()
    {
        try
        {
            var oResFormFields = new Array();
            if( oRes.action_result.GetOptProperty( "form_fields" ) != undefined )
            {
                oResFormFields = oRes.action_result.form_fields;
            }
            else if( oRes.action_result.GetOptProperty( "confirm_result" ) != undefined && oRes.action_result.confirm_result.GetOptProperty( "form_fields" ) != undefined )
            {
                oResFormFields = oRes.action_result.confirm_result.form_fields;
            }
            for( _field in oFormFields )
            {
                if( ArrayOptFind( oResFormFields, "This.name == _field.name" ) == undefined )
                {
                    oResFormFields.push( { name: _field.name, type: "hidden", value: _field.value } );
                }
            }
        }
        catch( err ){}
    }

    function arr_buttons()
    {
        return [
            { name: "cancel", label: ms_tools.get_const('c_cancel'), type: "cancel", css_class: "btn-submit-custom" },
            { name: "submit", label: i18n.t( 'dalee' ), type: "submit", css_class: "btn-cancel-custom" }
        ];
    }
    var oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.action_result = ({});

    try{
        if( sAction == null || sAction == undefined || sAction == '' )
        {
            throw 'error';
        }
    }
    catch( ex )
    {
        sAction = "admin";
    }
    try{
        if( bOnlyFutureEvent == null || bOnlyFutureEvent == undefined || bOnlyFutureEvent == '' )
        {
            throw 'error';
        }
        bOnlyFutureEvent = tools_web.is_true( bOnlyFutureEvent );
    }
    catch( ex )
    {
        bOnlyFutureEvent = false;
    }
    try{
        if( bSendNotification == null || bSendNotification == undefined || bSendNotification == '' )
        {
            throw 'error';
        }
        bSendNotification = tools_web.is_true( bSendNotification );
    }
    catch( ex )
    {
        bSendNotification = true;
    }
    try{
        if( bAddTextNotification == null || bAddTextNotification == undefined || bAddTextNotification == '' )
        {
            throw 'error';
        }
        bAddTextNotification = tools_web.is_true( bAddTextNotification );
    }
    catch( ex )
    {
        bAddTextNotification = false;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.action_result = { command: "alert", msg: i18n.t( 'nekorrektnyyid' ) };
        return oRes;
    }
    try{
        if( bSendNotificationBoss == null || bSendNotificationBoss == undefined || bSendNotificationBoss == '' )
        {
            throw 'error';
        }
        bSendNotificationBoss = tools_web.is_true( bSendNotificationBoss );
    }
    catch( ex )
    {
        bSendNotificationBoss = true;
    }

    iAddNotificationID = OptInt( iAddNotificationID );
    iExcludeNotificationID = OptInt( iExcludeNotificationID );
    iAddNotificationBossID = OptInt( iAddNotificationBossID );

    var sAddNotificationText = "";
    var sExcludeNotificationText = "";
    try
    {
        if( ObjectType( SCOPE_WVARS ) != "JsObject" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        SCOPE_WVARS = ({});
    }
    var bShowAllSub = tools_web.is_true( SCOPE_WVARS.GetOptProperty( "show_all_collaborators" ) );
    oFormFields = ParseJson( SCOPE_WVARS.GetOptProperty( "form_fields", "[]" ) );

    var sApplicationCode = SCOPE_WVARS.GetOptProperty( "sAPPLICATION", null );
    var sAccessLevel = null;
    if( sApplicationCode != "" && sApplicationCode != null )
    {
        iAccessLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplicationCode ] );

        if (iAccessLevel == 0)
        {
            oResGetRules = tools.call_code_library_method("libMain",  "GetActionRules", [iPersonID, ArrayOptFirstElem( arrEventIds )]);

            if (ArrayOptFindByKey( oResGetRules.result, 'event_change_collaborators_right', 'rule') == undefined)
            {
                oRes.action_result = { command: "alert", msg: i18n.t( 'netpravnaizmen' ) };
                return oRes;
            }
            else
                sAccessLevel = "lpe_manager"
        }
        else
        {
            sAccessLevel = "";
            switch(iAccessLevel)
            {
                case 10:
                case 7:
                    sAccessLevel = "admin";
                    break;
                case 5:
                    sAccessLevel = "manager";
                    break;
                case 3:
                    sAccessLevel = "tutor";
                    break;
                case 1:
                    sAccessLevel = "observer";
                    break;
            }
        }
    }
    try
    {
        if( !IsArray( arrEventIds ) || ArrayOptFirstElem( arrEventIds ) == undefined )
        {
            throw "error";
        }
        if( bOnlyFutureEvent && ArrayCount( arrEventIds ) == 1 )
        {
            docEvent = tools.open_doc( ArrayOptFirstElem( arrEventIds ) );
            if( docEvent == undefined )
            {
                oRes.action_result = { command: "alert", msg: i18n.t( 'peredannekorre_15' ) };
                return oRes;
            }
            if( docEvent.TopElem.status_id != "plan" && docEvent.TopElem.status_id != "project" )
            {
                oRes.action_result = { command: "alert", msg: i18n.t( 'vynemozheteizme' ) };
                return oRes;
            }
        }
    }
    catch( ex )
    {
        arrEventIds = new Array();
        catSelectedObjects = ArrayOptFind( oFormFields, "This.name == 'selected_object_ids'" )
        if( catSelectedObjects != undefined && catSelectedObjects.value != "" )
        {
            arrEventIds = String( catSelectedObjects.value ).split( ";" );
        }
        else
        {
            sQueryQual = ( bOnlyFutureEvent ? "( $elem/status_id = 'plan' or $elem/status_id = 'project' )" : "" );
            oRes.action_result = {
                command: "select_object",
                title: ( i18n.t( 'izmenenieuchast' ) ),
                message: ( sAction != "edit" ? i18n.t( 'vyberitemeropr' ) : i18n.t( 'vyberitemeropr_1' ) ),
                catalog_name: "event",
                xquery_qual: sQueryQual,
                multi_select: ( false && sAction != "edit" ),
                title: ( sAction != "edit" ? i18n.t( 'vyberitemeropr' ) : i18n.t( 'vyberitemeropr_1' ) ),
                field_name: "selected_object_ids",
                form_fields: [],
                buttons: arr_buttons(),
                no_buttons: false
            };
            merge_form_fields();
            return oRes;
        }
    }

    _name = "";
    if ( ArrayCount( arrEventIds ) == 1 )
    {
        _ev = ArrayOptFirstElem( XQuery( "for $elem in events where $elem/id = " + OptInt( ArrayFirstElem( arrEventIds ) ) + " return $elem/Fields('id','name')" ) );
        if ( _ev != undefined )
        {
            _name = "'" + _ev.name + "'";
        }
    }

    if( sAction == "admin" )
    {
        catAction = ArrayOptFind( oFormFields, "This.name == 'action'" )
        if( catAction != undefined && catAction.value != "" )
        {
            sAction = catAction.value;
        }
        else
        {
            oRes.action_result = {
                command: "display_form",
                title: i18n.t( 'izmenenieuchast_1' ) + _name,
                height: 300,
                message: "",
                form_fields:[
                    {
                        name: "action",
                        label: i18n.t( 'vyberitedeystv' ),
                        type: "radio",
                        entries: [
                            { name: i18n.t( 'dobavitnovyhuch' ), value: "add" },
                            { name: i18n.t( 'sformirovatnov' ), value: "replace" },
                            { name: i18n.t( 'izmenitspisoku' ), value: "edit" }
                        ],
                        value: "",
                        mandatory: true,
                    },
                ],
                buttons: arr_buttons(),
                no_buttons: false
            };
            merge_form_fields();
            return oRes;
        }
    }


    switch( sAction )
    {
        case "edit":
            if( ArrayCount( arrEventIds ) > 1 )
            {
                oRes.action_result = { command: "alert", msg: i18n.t( 'nelzyaizmenyatuch' ) };
                return oRes;
            }
            break;
    }

    var arrSelectedCollaborators = new Array();
    catSelectedCollaborators = ArrayOptFind( oFormFields, "This.name == 'selected_collaborators_ids'" );

    var teApplication = tools_app.get_cur_application( sApplicationCode );

    if( catSelectedCollaborators != undefined && ( sAction == "edit" || catSelectedCollaborators.value != "" ) )
    {
        if( catSelectedCollaborators.value != "" )
        {
            arrSelectedCollaborators = String( catSelectedCollaborators.value ).split( ";" );
        }
    }
    else
    {
        sQueryQual = "";
        if( sAction == "add" && ArrayCount( arrEventIds ) == 1 )
        {
            xarrEventCollaborators = XQuery( "for $elem in event_collaborators where $elem/event_id = " + ( ArrayOptFirstElem( arrEventIds ) ) + " and $elem/is_collaborator = true() return $elem" );
            sQueryQual = ArrayMerge( xarrEventCollaborators, "' and $elem/id != ' + This.collaborator_id", " " );
        }

        if ( sAccessLevel == "admin" )
        {
            sQueryQual = "";
        }
        else if( sAccessLevel == "manager" )
        {
            _manager_type_id = 0;

            if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
            {
                _manager_type_id = OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 );
            }

            if ( _manager_type_id == 0 )
            {
                _manager_type_id = ArrayOptFirstElem( XQuery('for $elem in boss_types where $elem/code = \'education_manager\' return $elem/Fields(\'id\')') );
                if ( _manager_type_id == undefined )
                {
                    _manager_type_id = 0;
                }
                else
                {
                    _manager_type_id = _manager_type_id.id.Value;
                }
            }

            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [_manager_type_id], true ]);
            arrSubordinates.push(iPersonID);

            sQueryQual += " and MatchSome($elem_qc/id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))"
        }
        else if (sAccessLevel == "lpe_manager")
        {
            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [], true ]);
            arrSubordinates.push(iPersonID);
            sQueryQual += " and MatchSome($elem_qc/id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))"
        }
        else if( !bShowAllSub )
        {
            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func', 'fact'], true, '', null, '', true, true, true, true, [], true ]);
            arrSubordinates.push(iPersonID);
            sQueryQual += " and MatchSome($elem_qc/id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";
        }

        oRes.action_result = {
            command: "select_object",
            title: i18n.t( 'izmenenieuchast_1' ) + _name,
            message: i18n.t( 'vyberitesotrud' ) + _name,
            catalog_name: "collaborator",
            xquery_qual: "$elem_qc/is_dismiss != true() and $elem_qc/is_outstaff != true() and $elem_qc/is_candidate != true()" + sQueryQual,
            field_name: "selected_collaborators_ids",
            multi_select: true,
            form_fields: [],
            buttons: arr_buttons(),
            no_buttons: false,
            show_all: true,
            disp_tree_selector: sAccessLevel == 'manager' ? false : true
        };
        if( sAction == "edit" )
        {
            xarrEventCollaborators = XQuery( "for $elem in event_collaborators where $elem/event_id = " + ( ArrayOptFirstElem( arrEventIds ) ) + " and $elem/is_collaborator = true() return $elem" );
            oRes.action_result.selected_object_ids = ArrayMerge( xarrEventCollaborators, "This.collaborator_id", ";" );
        }

        merge_form_fields();
        return oRes;
    }

    if( bSendNotification && ( ( iExcludeNotificationID != undefined && sAction != "add" ) || iAddNotificationID != undefined ) )
    {
        var catExcludeNotificationText = undefined;
        var catAddNotificationText = undefined;
        if( iExcludeNotificationID != undefined && sAction != "add" )
        {
            catExcludeNotificationText = ArrayOptFind( oFormFields, "This.name == 'exclude_notification_text'" );
            if( catExcludeNotificationText != undefined )
            {
                sExcludeNotificationText = catExcludeNotificationText.value;
            }
        }
        if( iAddNotificationID != undefined )
        {
            catAddNotificationText = ArrayOptFind( oFormFields, "This.name == 'add_notification_text'" );
            if( catAddNotificationText != undefined )
            {
                sAddNotificationText = catAddNotificationText.value;
            }
        }
        if( catExcludeNotificationText == undefined && catAddNotificationText == undefined && bAddTextNotification)
        {
            oRes.action_result = {
                command: "display_form",
                height: 280,
                title: i18n.t( 'izmenenieuchast_1' ) + _name,
                message: "",
                form_fields: [],
                buttons: arr_buttons(),
                no_buttons: false
            };
            if( iAddNotificationID != undefined )
            {
                oRes.action_result.form_fields.push( { name: "add_notification_text", label: i18n.t( 'vveditetekstko' ), type: "text", value: "", mandatory: false } );
            }
            if( iExcludeNotificationID != undefined && sAction != "add" )
            {
                oRes.action_result.form_fields.push( { name: "exclude_notification_text", label: i18n.t( 'vveditetekstko' ), type: "text", value: "", mandatory: false } );
            }

            merge_form_fields();
            return oRes;
        }
    }

    for( _event_id in arrEventIds )
        try
        {
            docEvent = tools.open_doc( _event_id );
            if( docEvent == undefined )
            {
                continue;
            }
            if( bOnlyFutureEvent && ( docEvent.TopElem.status_id != "plan" && docEvent.TopElem.status_id != "project" ) )
            {
                continue;
            }

            switch( sAction )
            {
                case "edit":
                case "replace":
                    arrDeleteCollaborators = new Array();
                    for( _collaborator in docEvent.TopElem.collaborators )
                    {
                        if( ArrayOptFind( arrSelectedCollaborators, "OptInt( This ) == _collaborator.PrimaryKey" ) != undefined )
                        {
                            continue;
                        }
                        arrDeleteCollaborators.push( _collaborator.PrimaryKey )

                    }
                    for( _collaborator_id in arrDeleteCollaborators )
                    {
                        oResDeletePerson = tools.call_code_library_method( 'libEducation', 'DeletePersonFromEventXmd', [ {
                            'iPersonID': _collaborator_id,
                            'iEventID': _event_id,
                            'docEvent': docEvent,
                            'bDoSave': false,
                            'bSendNotification': ( bSendNotification && iExcludeNotificationID == undefined ) } ] );
                        if( oResDeletePerson.error != 0 )
                        {
                            oRes.action_result ={ command: "close_form", msg: oResDeletePerson.message, confirm_result: {command: "reload_page"} };
                            return oRes;
                        }

                        if( bSendNotification && iExcludeNotificationID != undefined )
                        {
                            tools.create_notification( iExcludeNotificationID, _collaborator.PrimaryKey, sExcludeNotificationText, _event_id, null, docEvent.TopElem );
                        }
                    }
                case "add":

                    if (teApplication != null)
                    {
                        oRemoteAction = ArrayOptFind( teApplication.remote_actions, 'This.code == \'ChangeEventCollaborators\'' );

                        if(oRemoteAction != undefined)
                        {
                            oRemoteActionParamSendNotification = ArrayOptFind( oRemoteAction.wvars, 'This.name == \'send_notification\'' );

                            if(oRemoteActionParamSendNotification != undefined)
                            {
                                bSendNotification = false;

                                if( oRemoteActionParamSendNotification.value.HasValue )
                                {
                                    bSendNotification = tools_web.is_true(oRemoteActionParamSendNotification.value.Value);
                                }
                            }

                            oRemoteActionParamSendNotificationBoss = ArrayOptFind( oRemoteAction.wvars, 'This.name == \'send_notification_boss\'' );

                            if(oRemoteActionParamSendNotificationBoss != undefined)
                            {
                                bSendNotificationBoss = false;

                                if( oRemoteActionParamSendNotificationBoss.value.HasValue )
                                {
                                    bSendNotificationBoss = tools_web.is_true(oRemoteActionParamSendNotificationBoss.value.Value);
                                }
                            }
                        }
                    }

                    if(sAddNotificationText == "")
                    {
                        docEventTE = docEvent.TopElem;
                        sAddNotificationText = docEventTE.name.Value;
                    }

                    for( _collaborator_id in arrSelectedCollaborators )
                    {
                        _collaborator_id = OptInt( _collaborator_id );
                        if( docEvent.TopElem.collaborators.GetOptChildByKey( _collaborator_id ) != undefined )
                        {
                            continue;
                        }

                        oResAddPerson = tools.call_code_library_method( 'libEducation', 'AddPersonToEventXmd', [ {
                            'iEventID': _event_id,
                            'docEvent': docEvent,
                            'iPersonID': _collaborator_id,
                            'tePerson': null,
                            'bDoObtain': false,
                            'bDoFilling': true,
                            'bDoSave': false,
                            'bCreateEventResult': true,
                            'bSendNotification': ( bSendNotification && iAddNotificationID == undefined ),
                            'bEventResultAssist': false
                        } ] );

                        if( oResAddPerson.error != 0 )
                        {
                            oRes.action_result ={ command: "close_form", msg: oResAddPerson.message, confirm_result: {command: "reload_page"} };
                            return oRes;
                        }

                        sQuery = "for $elem in collaborators where MatchSome( $elem/id, ( " + _collaborator_id + " ) ) return $elem";
                        sEmail = ArrayOptFirstElem(ArrayExtract(tools.xquery(sQuery), "This.email.Value"));
                        bCheckEmail = tools.call_code_library_method("libMain", "check_email_value", [ sEmail ]);

                        sCollaboratorFullname = '';
                        oCollaborator = ArrayOptFirstElem(tools.xquery(sQuery));
                        if(oCollaborator != undefined)
                        {
                            sCollaboratorFullname = oCollaborator.fullname.Value;
                        }

                        docCollaborator = tools.open_doc(_collaborator_id);
                        docCollaboratorTE = docCollaborator.TopElem;

                        if( bCheckEmail && bSendNotification && iAddNotificationID != undefined )
                        {
                            oNotification = {
                                event_id: docEventTE.id.Value,
                                event_name: docEventTE.name,
                                event_start_date: docEventTE.start_date.Value
                            }

                            tools.create_notification( iAddNotificationID, _collaborator_id, oNotification);
                        }

                        if( bSendNotificationBoss && iAddNotificationBossID != undefined )
                        {
                            //arrBosses = tools.call_code_library_method("libMain", "GetUserBosses", [ _collaborator_id, true, tools.get_default_object_id ('boss_type', 'main'), {}, true ]).array;
                            arrBosses = tools.call_code_library_method("libMain", "GetUserBosses", [ _collaborator_id ]).array;

                            if(ArrayOptFirstElem(arrBosses) != undefined)
                            {
                                for(oBoss in arrBosses)
                                {
                                    bBossCheckEmail = false;

                                    bBossCheckEmail = tools.call_code_library_method("libMain", "check_email_value", [ oBoss.email.Value ]);

                                    if(bBossCheckEmail)
                                    {
                                        oNotification = {
                                            collaborator_fullname: sCollaboratorFullname,
                                            event_id: docEventTE.id.Value,
                                            event_name: docEventTE.name.Value,
                                            event_start_date: docEventTE.start_date.Value
                                        }

                                        tools.create_notification( iAddNotificationBossID, oBoss.id.Value, oNotification );
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            tools.call_code_library_method( 'libEducation', 'SaveEvent', [ docEvent ] )
        }
        catch( ex )
        {
            oRes.action_result ={ command: "close_form", msg: String( ex ), confirm_result: {command: "reload_page"} };
            return oRes;
        }

    oRes.action_result = { command: "close_form", msg: i18n.t( 'spisokuchastnik' ), confirm_result: {command: "reload_page"} };

    return oRes;
}

/**
 * @typedef {Object} oTrainerEvent
 * @property {bigint} id - ID
 * @property {string} name - название мероприятия
 * @property {string} code - код мероприятия
 * @property {string} status_name - Статус мероприятия
 * @property {string} status_id - статус мероприятия
 * @property {bigint} resource_id - идентификатор картинки
 * @property {string} image_url - адрес картинки
 * @property {date} start_date - дата и время начала мероприятия
 * @property {date} finish_date - дата и время завершения мероприятия
 * @property {bigint} place_id - идентификатор расположения
 * @property {bigint} event_type_id - идентификатор типа мероприятия
 * @property {number} person_num - количество участников
 * @property {number} duration - продолжительность
 */
/**
 * @typedef {Object} WTTrainerEventsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerEvent[]} array – массив
 */
/**
 * @function GetTrainerEvents
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка по мероприятиям для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sTypeID] - тип отбора мероприятий
 * @param {string} [sPeriodType] - тип периода
 * @param {date} [dStartDate] - дата начала
 * @param {date} [dFinishDate] - дата завершения
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerEventsResult}
 */
function GetTrainerEvents( iPersonID, tePerson, sSearch, sFilterID, sAccessTypeID, arrBossTypesID, arrStatuses, arrEventTypesID, arrRolesID, sTypeID, sPeriodType, dStartDate, dFinishDate, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "name;code;status_name;status_id;resource_id;image_url;start_date;finish_date;place_id;event_type_id;person_num;duration" ).split( ";" );
    }
    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }

    try
    {
        dStartDate = Date( dStartDate );
    }
    catch( err )
    {
        dStartDate = null;
    }
    try
    {
        dFinishDate = Date( dFinishDate );
    }
    catch( err )
    {
        dFinishDate = null;
    }
    try
    {
        if( sTypeID == undefined || sTypeID == "" || sTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sTypeID = "period";
    }
    try
    {
        if( sPeriodType == undefined || sPeriodType == "" || sPeriodType == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sPeriodType = "all";
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
        if ( OptInt( sAccessTypeID, 0 ) > 0 )
        {

        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }
    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    conds = new Array();

    arrSatisfiers = new Array();
    arrCollaborators = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $elem/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $elem/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );
            break;

        case "tutor":
            arrSatisfiers.push( "some $ec in event_collaborators satisfies ( $elem/id = $ec/event_id and $ec/collaborator_id = " + iPersonID + " and ( $ec/is_tutor = true() or $ec/is_preparation = true() ))" );
            arrSatisfiers.push( "some $el in event_lectors satisfies ( $elem/id = $el/event_id and $el/person_id = " + iPersonID + " )" );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            // arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            // if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            // {
            // 	return oRes;
            // }
            // arrSatisfiers.push( "some $ec in event_collaborators satisfies ( $elem/id = $ec/event_id and MatchSome( $ec/collaborator_id, ( " + ArrayMerge( arrCollaborators, "This.id", "," ) + " ) ) and $ec/is_collaborator = true() )" );

            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }

            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $elem/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $elem/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }

    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }
    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        conds.push( "MatchSome( $elem/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }
    switch( sTypeID )
    {
        case "period":
            switch( sPeriodType )
            {
                case "past":
                    conds.push( "$elem/finish_date < " + XQueryLiteral( Date() ) );
                    break;
                case "current":
                    conds.push( "$elem/start_date < " + XQueryLiteral( Date() ) );
                    conds.push( "$elem/finish_date > " + XQueryLiteral( Date() ) );
                    break;
                case "future":
                    conds.push( "$elem/start_date > " + XQueryLiteral( Date() ) );
                    break;
            }
            break;
        case "date":
            if( dStartDate != null )
            {
                conds.push( "$elem/finish_date > " + XQueryLiteral( dStartDate ) );
            }
            if( dFinishDate != null )
            {
                conds.push( "$elem/start_date < " + XQueryLiteral( dFinishDate ) );
            }
            break;
    }

    if( sFilterID != null )
    {
        catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
        if( catFilter != undefined && catFilter.catalog == "event" )
        {
            conds.push( tools.create_filter_xquery( catFilter.conditions ) );
        }
    }
    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }
    var sOrderQuery = "";
    if( ( ArrayOptFirstElem( arrSatisfiers ) == undefined || ArrayCount( arrSatisfiers ) == 1 ) && oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        switch( oSort.GetOptProperty( "FIELD" ) )
        {
            case "status_name":
                sOrderQuery = " order by ForeignElem( $elem/status_id )/name";
                break;
            case "default":
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }
    xarrEvents = new Array();
    if( ArrayOptFirstElem( arrSatisfiers ) == undefined )
    {
        xarrEvents = tools.xquery( "for $elem in events " + ( ArrayOptFirstElem( conds ) != undefined ? ( " where " + ArrayMerge( conds, "This", " and " ) ) : "" ) + sOrderQuery + " return $elem, $elem/__data" );
    }
    else
    {
        for( _satisfier in arrSatisfiers )
        {
            xarrEvents = ArrayUnion( xarrEvents, tools.xquery( "for $elem in events where " + _satisfier + ( ArrayOptFirstElem( conds ) != undefined ? ( " and " + ArrayMerge( conds, "This", " and " ) ) : "" ) + sOrderQuery + " return $elem, $elem/__data" ) );
        }
        xarrEvents = ArraySelectDistinct(xarrEvents, 'id');
    }

    xarrEvents = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrEvents, oPaging, ( ( ArrayOptFirstElem( arrSatisfiers ) == undefined || ArrayCount( arrSatisfiers ) == 1 ) ? ({}) : oSort ) ] ).oResult;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( "event", true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }

    var sShortForm = '<?xml version="1.0" encoding="utf-8"?><SPXML-FORM><event><duration_plan TYPE="real"/><duration_days_plan TYPE="real"/></event></SPXML-FORM>';
    var sNameForm = Md5Hex( sShortForm );

    if(GetOptCachedForm(sNameForm) == undefined)
    {
        try
        {
            RegisterFormFromStr( sNameForm, sShortForm );
        }
        catch(e)
        {
            alert( i18n.t( 'gettrainereven' ) + e );
        }
    }

    for( _event in xarrEvents )
    {
        oEvent = new Object();
        oEvent.id = _event.id.Value;
        for( _field in arrFields )
        {
            switch( _field )
            {
                case "image_url":
                    oEvent.SetProperty( "image_url", get_object_image_url( _event ) );
                    break;
                case "status_name":
                    oEvent.SetProperty( "status_name", RValue( _event.status_id.ForeignElem.name ) );
                default:
                    if( _event.ChildExists( _field ) )
                    {
                        oEvent.SetProperty( _field, RValue( _event.Child( _field ) ) );
                    }
                    break;
            }
        }
        docEvent = tools.open_doc(_event.id);
        oEvent.duration_plan = docEvent.TopElem.duration_plan.Value;
        oEvent.duration_days_plan = docEvent.TopElem.duration_days_plan.Value;

        oRes.array.push( oEvent );
    }
    return oRes;
}

/**
 * @typedef {Object} oTrainerResponse
 * @property {bigint} id - ID
 * @property {string} fullname - ФИО
 * @property {string} position_name - Должность
 * @property {string} position_parent_name - Подразделение
 * @property {string} event_name - Мероприятие
 * @property {date} event_finish_date - Дата окончания
 * @property {date} response_create_date - Дата отзыва
 * @property {string} basic_desc - Отзыв
 * @property {number} basic_score - Оценка
 */
/**
 * @typedef {Object} WTTrainerResponsesResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerResponse[]} array – массив
 */
/**
 * @function GetTrainerResponses
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка отзывов по мероприятиям для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventsID] - массив мероприятий
 * @param {bigint[]} [arrResponseTypesID] - массив типов отзывов
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerResponsesResult}
 */
function GetTrainerResponses( iPersonID, tePerson, sSearch, sFilterID, sAccessTypeID, arrBossTypesID, arrStatuses, arrEventsID, arrResponseTypesID, arrEventTypesID, arrRolesID, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "image_url;fullname;position_name;position_parent_name;org_name;response_create_date;event_name;event_type;event_type_name;basic_score;basic_desc" ).split( ";" );
    }

    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }

    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }
    try
    {
        if( !IsArray( arrResponseTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrResponseTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventsID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventsID = new Array();
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }
    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    conds = new Array();
    event_conds = new Array();

    var arrSatisfiers = new Array();
    var arrCollaborators = null;
    var arrEventIds = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            event_conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );
            break;

        case "tutor":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            arrEventIds = new Array();
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_collaborators where ( $elem/collaborator_id = " + iPersonID + " and ( $elem/is_tutor = true() or $elem/is_preparation = true() )) return $elem/Fields('event_id')" ), "This.event_id" ) );
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_lectors where $elem/person_id = " + iPersonID + " return $elem/Fields('event_id')" ), "This.event_id" ) );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            // arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            // if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            // {
            // 	return oRes;
            // }
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, [], arrStatuses, arrEventTypesID, arrRolesID, null, null, null, null, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }
    conds.push( "$elem/type = 'event'" );
    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }
    if( ArrayOptFirstElem( arrResponseTypesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/response_type_id, ( " + ArrayMerge( arrResponseTypesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }

    if( ArrayOptFirstElem( arrEventsID ) != undefined )
    {
        event_conds = new Array();
        conds.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( arrEventsID, "This", "," ) + " ) )" );
    }

    if( sFilterID != null )
    {
        catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
        if( catFilter != undefined && catFilter.catalog == "response" )
        {
            conds.push( tools.create_filter_xquery( catFilter.conditions ) );
        }
    }
    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$elem/object_id = $ev/id" );
    }

    var sOrderQuery = "";
    var sOrderField = "";
    if( oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        sOrderField = oSort.GetOptProperty( "FIELD" );
        switch( oSort.GetOptProperty( "FIELD" ) )
        {
            case "default":
            case "event_name":
            case "event_start_date":
            case "event_finish_date":
            case "org_name":
            case "position_name":
            case "position_parent_name":
            case "event_type_name":
            case "event_type_id":
                break;
            case "fullname":
                sOrderQuery = " order by $elem/person_fullname";
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }

    xarrResponses = XQuery( "for $elem in responses where " + ( ArrayOptFirstElem( event_conds ) != undefined ? ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  ) : "" ) + ( ArrayMerge( conds, "This", " and " ) ) + sOrderQuery + " return $elem" );

    if( arrEventIds != null )
    {
        xarrResponses = ArrayIntersect( xarrResponses, arrEventIds, "This.object_id", "This" );
    }
    if( arrCollaborators != null )
    {
        xarrResponses = ArrayIntersect( xarrResponses, arrCollaborators, "This.person_id", "This.id" );
    }

    xarrResponses = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrResponses, oPaging, ({}) ] ).oResult;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( "response", true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }
    xarrEventTypes = new Array();
    xarrEvents = new Array();
    xarrPersons = new Array();
    if( ArrayOptFind( arrFields, "This == 'image_url'" ) != undefined || ArrayOptFind( arrFields, "This == 'fullname'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_parent_name'" ) != undefined  || ArrayOptFind( arrFields, "This == 'org_name'" ) != undefined  )
    {
        if( ArrayOptFind( xarrResponses, "This.person_id.HasValue" ) != undefined )
        {
            xarrPersons = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrResponses, "This.person_id.HasValue" ), "This.person_id" ), "This.person_id", "," ) + " ) ) return $elem/Fields( 'id', 'fullname', 'position_name', 'position_parent_name', 'org_name' )" );
        }
    }
    if( ArrayOptFind( arrFields, "This == 'event_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_id'" ) != undefined  || ArrayOptFind( arrFields, "This == 'event_finish_date'" ) != undefined  )
    {
        if( ArrayOptFind( xarrResponses, "This.object_id.HasValue" ) != undefined )
        {
            xarrEvents = XQuery( "for $elem in events where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrResponses, "This.object_id.HasValue" ), "This.object_id" ), "This.object_id", "," ) + " ) ) return $elem/Fields( 'id', 'event_type_id', 'name', 'finish_date' )" );
            if( ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined )
            {
                if( ArrayOptFind( xarrEvents, "This.event_type_id.HasValue" ) != undefined )
                {
                    xarrEventTypes = XQuery( "for $elem in event_types where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrEvents, "This.event_type_id.HasValue" ), "This.event_type_id" ), "This.event_type_id", "," ) + " ) ) return $elem/Fields( 'id', 'name' )" );
                }
            }
        }
    }
    for( _response in xarrResponses )
    {
        fePerson = null;
        feEvent = null;
        feEventType = null;
        oResponse = new Object();
        oResponse.id = _response.id.Value;
        oResponse.object_id = _response.object_id.Value;


        for( _field in arrFields )
        {
            switch( _field )
            {
                case "image_url":
                    oResponse.SetProperty( "image_url", tools_web.get_object_source_url( "person", _response.person_id ) );
                    break;
                case "fullname":
                case "org_name":
                case "position_name":
                case "position_parent_name":
                    if( fePerson == undefined || !_response.person_id.HasValue )
                    {
                        continue;
                    }
                    if( fePerson == null )
                    {
                        fePerson = ArrayOptFind( xarrPersons, "This.id == _response.person_id" );
                    }
                    if( fePerson == undefined )
                    {
                        continue;
                    }
                    oResponse.SetProperty( _field, RValue( fePerson.Child( _field ) ) );
                    break;
                case "event_name":
                case "event_type_name":
                case "event_type_id":
                case "event_finish_date":
                    if( feEvent == undefined || !_response.object_id.HasValue )
                    {
                        continue;
                    }
                    if( feEvent == null )
                    {
                        feEvent = ArrayOptFind( xarrEvents, "This.id == _response.object_id" );
                    }
                    if( feEvent == undefined )
                    {
                        continue;
                    }
                    switch( _field )
                    {
                        case "event_name":
                            oResponse.SetProperty( _field, RValue( feEvent.name ) );
                            break;
                        case "event_type_name":
                            if( feEventType == undefined || !feEvent.event_type_id.HasValue )
                            {
                                continue;
                            }
                            if( feEventType == null )
                            {
                                feEventType = ArrayOptFind( xarrEventTypes, "This.id == feEvent.event_type_id" );
                            }
                            if( feEventType == undefined )
                            {
                                continue;
                            }
                            oResponse.SetProperty( _field, RValue( feEventType.name ) );
                            break;
                        case "event_type_id":
                            oResponse.SetProperty( _field, RValue( feEvent.event_type_id ) );
                            break;
                        case "event_finish_date":
                            oResponse.SetProperty( _field, RValue( feEvent.finish_date ) );
                            break;
                    }

                    break;

                default:
                    if( _response.ChildExists( _field ) )
                    {
                        oResponse.SetProperty( _field, RValue( _response.Child( _field ) ) );
                    }
                    break;
            }
        }
        oRes.array.push( oResponse );
    }
    switch( sOrderField )
    {
        case "org_name":
        case "position_name":
        case "position_parent_name":
        case "event_name":
        case "event_type_name":
        case "event_type_id":
        case "event_finish_date":
            oRes.array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ oRes.array, oPaging, oSort ] ).oResult;
            break;
    }
    return oRes;
}

/**
 * @typedef {Object} oTrainerLearning
 * @property {bigint} id - ID
 * @property {string} person_fullname - ФИО
 * @property {string} person_position_name - Должность
 * @property {string} person_subdivision_name - Подразделение
 * @property {string} event_name - Мероприятие
 * @property {date} event_start_date - Дата начала
 * @property {string} object_name - Курс/Тест
 * @property {date} start_usage_date - Дата активации
 * @property {number} score - Результат
 * @property {string} state_id - Статус
 */
/**
 * @typedef {Object} WTTrainerLearningsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerLearning[]} array – массив
 */
/**
 * @function GetTrainerLearnings
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка курсов по мероприятиям для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sLearningType] - тип обучения
 * @param {string} [sLearningStatus] - статус обучения
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerLearningsResult}
 */

function GetTrainerLearnings( iPersonID, tePerson, sLearningType, sLearningStatus, sSearch, sFilterID, sAccessTypeID, arrBossTypesID, arrStatuses, arrEventTypesID, arrRolesID, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        if( sLearningType == undefined || sLearningType == "" || sLearningType == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sLearningType = "course";
    }
    try
    {
        if( sLearningStatus == undefined || sLearningStatus == "" || sLearningStatus == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sLearningStatus = "all";
    }
    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "image_url;person_fullname;person_position_name;person_subdivision_name;person_org_name;start_usage_date;finish_learning_date;event_name;event_start_date;event_finish_date;event_type_name;score;state_id;object_name" ).split( ";" );
    }
    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    conds = new Array();
    event_conds = new Array();

    var arrSatisfiers = new Array();
    var arrCollaborators = null;
    var arrEventIds = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            event_conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );
            break;

        case "tutor":
            arrEventIds = new Array();
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_collaborators where ( $elem/collaborator_id = " + iPersonID + " and ( $elem/is_tutor = true() or $elem/is_preparation = true() )) return $elem/Fields('event_id')" ), "This.event_id" ) );
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_lectors where $elem/person_id = " + iPersonID + " return $elem/Fields('event_id')" ), "This.event_id" ) );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            //arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            //if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            //{
            //	return oRes;
            //}
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, [], arrStatuses, arrEventTypesID, arrRolesID, null, null, null, null, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }
    conds.push( "$elem/event_id != null()" );
    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }
    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }

    if( sFilterID != null )
    {
        catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
        if( catFilter != undefined && ( catFilter.catalog == ( sLearningType == "test" ? "test_learning" : "learning" ) || catFilter.catalog == ( sLearningType == "test" ? "active_test_learning" : "active_learning" ) ) )
        {
            conds.push( tools.create_filter_xquery( catFilter.conditions ) );
        }
    }
    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }

    var sOrderQuery = "";
    if( sLearningStatus != "all" && oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        switch( oSort.GetOptProperty( "FIELD" ) )
        {
            case "default":
                break;
            case "event_name":
                sOrderQuery = " order by ForeignElem( $elem/event_id )/name";
                break;
            case "event_start_date":
                sOrderQuery = " order by ForeignElem( $elem/event_id )/start_date";
                break;
            case "event_finish_date":
                sOrderQuery = " order by ForeignElem( $elem/event_id )/finish_date";
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$elem/event_id = $ev/id" );
    }
    var xarrLearnings = new Array();
    switch( sLearningStatus )
    {
        case "all":
        case "active":
            xarrLearnings = ArrayUnion( xarrLearnings, XQuery( "for $elem in active_" + ( sLearningType == "test" ? "test_" : "" ) + "learnings where " + ( ArrayOptFirstElem( event_conds ) != undefined ? ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  ) : "" ) + ( ArrayMerge( conds, "This", " and " ) ) + sOrderQuery + " return $elem" ) );
            if( sLearningStatus == "active" )
            {
                break;
            }
        case "finish":
            xarrLearnings = ArrayUnion( xarrLearnings, XQuery( "for $elem in " + ( sLearningType == "test" ? "test_" : "" ) + "learnings where " + ( ArrayOptFirstElem( event_conds ) != undefined ? ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  ) : "" ) + ( ArrayMerge( conds, "This", " and " ) ) + sOrderQuery + " return $elem" ) );
            break;
    }

    if( arrEventIds != null )
    {
        xarrLearnings = ArrayIntersect( xarrLearnings, arrEventIds, "This.event_id", "This" );
    }
    if( arrCollaborators != null )
    {
        xarrLearnings = ArrayIntersect( xarrLearnings, arrCollaborators, "This.person_id", "This.id" );
    }

    xarrLearnings = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrLearnings, oPaging, ( sLearningStatus == "all" ? oSort : ({}) ) ] ).oResult;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( ( sLearningType == "test" ? "active_test_learning" : "active_learning" ), true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }
    xarrEventTypes = new Array();
    xarrEvents = new Array();

    if( ArrayOptFind( arrFields, "This == 'event_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_id'" ) != undefined  || ArrayOptFind( arrFields, "This == 'event_finish_date'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_start_date'" ) != undefined  )
    {
        if( ArrayOptFind( xarrLearnings, "This.event_id.HasValue" ) != undefined )
        {
            xarrEvents = XQuery( "for $elem in events where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrLearnings, "This.event_id.HasValue" ), "This.event_id" ), "This.event_id", "," ) + " ) ) return $elem/Fields( 'id', 'event_type_id', 'name', 'finish_date', 'start_date' )" );
            if( ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined )
            {
                if( ArrayOptFind( xarrEvents, "This.event_type_id.HasValue" ) != undefined )
                {
                    xarrEventTypes = XQuery( "for $elem in event_types where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrEvents, "This.event_type_id.HasValue" ), "This.event_type_id" ), "This.event_type_id", "," ) + " ) ) return $elem/Fields( 'id', 'name' )" );
                }
            }
        }
    }
    for( _learning in xarrLearnings )
    {
        feEvent = null;
        feEventType = null;
        oLearning = new Object();
        oLearning.id = _learning.id.Value;
        oLearning.event_id = _learning.event_id.Value;
        oLearning.object_type = sLearningType;

        for( _field in arrFields )
        {
            switch( _field )
            {
                case "object_name":
                    oLearning.SetProperty( "object_name", ( sLearningType == "test" ? _learning.assessment_name.Value : _learning.course_name.Value ) );
                    break;
                case "image_url":
                    oLearning.SetProperty( "image_url", tools_web.get_object_source_url( "person", _learning.person_id ) );
                    break;
                case "event_name":
                case "event_type_name":
                case "event_type_id":
                case "event_finish_date":
                case "event_start_date":
                    if( feEvent == undefined || !_learning.event_id.HasValue )
                    {
                        continue;
                    }
                    if( feEvent == null )
                    {
                        feEvent = ArrayOptFind( xarrEvents, "This.id == _learning.event_id" );
                    }
                    if( feEvent == undefined )
                    {
                        continue;
                    }
                    switch( _field )
                    {
                        case "event_name":
                            oLearning.SetProperty( _field, RValue( feEvent.name ) );
                            break;
                        case "event_type_name":
                            if( feEventType == undefined || !feEvent.event_type_id.HasValue )
                            {
                                continue;
                            }
                            if( feEventType == null )
                            {
                                feEventType = ArrayOptFind( xarrEventTypes, "This.id == feEvent.event_type_id" );
                            }
                            if( feEventType == undefined )
                            {
                                continue;
                            }
                            oLearning.SetProperty( _field, RValue( feEventType.name ) );
                            break;
                        case "event_type_id":
                            oLearning.SetProperty( _field, RValue( feEvent.event_type_id ) );
                            break;
                        case "event_finish_date":
                            oLearning.SetProperty( _field, RValue( feEvent.finish_date ) );
                            break;
                        case "event_start_date":
                            oLearning.SetProperty( _field, RValue( feEvent.start_date ) );
                            break;
                    }

                    break;

                default:
                    if( _learning.ChildExists( _field ) )
                    {
                        oLearning.SetProperty( _field, RValue( _learning.Child( _field ) ) );
                    }
                    break;
            }
        }
        oRes.array.push( oLearning );
    }
    return oRes;
}

/**
 * @typedef {Object} oTrainerRequest
 * @property {bigint} id - ID
 * @property {string} fullname - ФИО
 * @property {string} position_name - Должность
 * @property {string} position_parent_name - Подразделение
 * @property {string} event_name - Мероприятие
 * @property {date} event_start_date - Дата начала
 * @property {string} comment - Комментарий
 * @property {date} create_date - Дата подачи
 * @property {string} status_id - Статус
 */
/**
 * @typedef {Object} WTTrainerRequestsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerRequest[]} array – массив
 */
/**
 * @function GetTrainerRequests
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка заявок по мероприятиям для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {string[]} [arrRequestStates] - массив статусов заявок
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventsID] - массив мероприятий
 * @param {bigint[]} [arrRequestTypesID] - массив типов заявок
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerRequestsResult}
 */
function GetTrainerRequests( iPersonID, tePerson, sSearch, sFilterID, sAccessTypeID, arrRequestStates, arrBossTypesID, arrStatuses, arrEventsID, arrRequestTypesID, arrEventTypesID, arrRolesID, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrRequestStates ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRequestStates = [ "all" ];
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "image_url;fullname;position_name;position_parent_name;org_name;response_create_date;event_name;event_type;event_type_name;basic_score;basic_desc" ).split( ";" );
    }
    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }
    try
    {
        if( !IsArray( arrRequestTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRequestTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventsID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventsID = new Array();
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    conds = new Array();
    event_conds = new Array();

    var arrSatisfiers = new Array();
    var arrCollaborators = null;
    var arrEventIds = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            event_conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );
            break;

        case "tutor":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            arrEventIds = new Array();
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_collaborators where ( $elem/collaborator_id = " + iPersonID + " and ( $elem/is_tutor = true() or $elem/is_preparation = true() )) return $elem/Fields('event_id')" ), "This.event_id" ) );
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_lectors where $elem/person_id = " + iPersonID + " return $elem/Fields('event_id')" ), "This.event_id" ) );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            //arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            //if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            //{
            //	return oRes;
            //}
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, [], arrStatuses, arrEventTypesID, arrRolesID, null, null, null, null, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }
    conds.push( "$elem/type = 'event'" );
    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }
    if( ArrayOptFirstElem( arrRequestTypesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/request_type_id, ( " + ArrayMerge( arrRequestTypesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }

    if( ArrayOptFirstElem( arrEventsID ) != undefined )
    {
        event_conds = new Array();
        conds.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( arrEventsID, "This", "," ) + " ) )" );
    }

    if( sFilterID != null )
    {
        catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
        if( catFilter != undefined && catFilter.catalog == "request" )
        {
            conds.push( tools.create_filter_xquery( catFilter.conditions ) );
        }
    }
    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }
    if( ArrayOptFirstElem( arrRequestStates ) != undefined && ArrayOptFind( arrRequestStates, "This == 'all'" ) == undefined )
    {
        conds.push( "MatchSome( $elem/status_id, ( " + ArrayMerge( arrRequestStates, "XQueryLiteral( String( This ) )", "," ) + " ) )" );
    }

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$elem/object_id = $ev/id" );
    }
    var sOrderQuery = "";
    var sOrderField = "";
    if( oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        sOrderField = oSort.GetOptProperty( "FIELD" );
        switch( oSort.GetOptProperty( "FIELD" ) )
        {
            case "default":
                break;
            case "fullname":
                sOrderQuery = " order by $elem/person_fullname";
                break;
            case "event_status_name":
            case "org_name":
            case "position_name":
            case "position_parent_name":
            case "event_name":
            case "event_type_name":
            case "event_type_id":
            case "event_start_date":
            case "comment":
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }
    xarrRequests = XQuery( "for $elem in requests where " + ( ArrayOptFirstElem( event_conds ) != undefined ? ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  ) : "" ) + ( ArrayMerge( conds, "This", " and " ) ) + sOrderQuery + " return $elem" );

    if( arrEventIds != null )
    {
        xarrRequests = ArrayIntersect( xarrRequests, arrEventIds, "This.object_id", "This" );
    }
    if( arrCollaborators != null )
    {
        xarrRequests = ArrayIntersect( xarrRequests, arrCollaborators, "This.person_id", "This.id" );
    }

    xarrRequests = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrRequests, oPaging, ({}) ] ).oResult;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( "request", true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }
    xarrEventTypes = new Array();
    xarrEvents = new Array();
    xarrPersons = new Array();
    if( ArrayOptFind( arrFields, "This == 'image_url'" ) != undefined || ArrayOptFind( arrFields, "This == 'fullname'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_parent_name'" ) != undefined  || ArrayOptFind( arrFields, "This == 'org_name'" ) != undefined  )
    {
        if( ArrayOptFind( xarrRequests, "This.person_id.HasValue" ) != undefined )
        {
            xarrPersons = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrRequests, "This.person_id.HasValue" ), "This.person_id" ), "This.person_id", "," ) + " ) ) return $elem/Fields( 'id', 'fullname', 'position_name', 'position_parent_name', 'org_name' )" );
        }
    }
    if( ArrayOptFind( arrFields, "This == 'event_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_id'" ) != undefined  || ArrayOptFind( arrFields, "This == 'event_start_date'" ) != undefined  )
    {
        if( ArrayOptFind( xarrRequests, "This.object_id.HasValue" ) != undefined )
        {
            xarrEvents = XQuery( "for $elem in events where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrRequests, "This.object_id.HasValue" ), "This.object_id" ), "This.object_id", "," ) + " ) ) return $elem/Fields( 'id', 'event_type_id', 'name', 'start_date' )" );
            if( ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined )
            {
                if( ArrayOptFind( xarrEvents, "This.event_type_id.HasValue" ) != undefined )
                {
                    xarrEventTypes = XQuery( "for $elem in event_types where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrEvents, "This.event_type_id.HasValue" ), "This.event_type_id" ), "This.event_type_id", "," ) + " ) ) return $elem/Fields( 'id', 'name' )" );
                }
            }
        }
    }
    if ( ArrayOptFind( arrFields, "This == 'comment'" ) != undefined || ArrayOptFind( arrFields, "StrBegins( This, 'custom_' )" ) != undefined )
    {
        isTE = true;
    }
    else
    {
        isTE = false;
    }
    for( _request in xarrRequests )
    {
        fePerson = null;
        feEvent = null;
        feEventType = null;
        oRequest = new Object();
        oRequest.id = _request.id.Value;
        oRequest.object_id = _request.object_id.Value;
        if ( isTE )
        {
            oTE = tools.open_doc( _request.id ).TopElem;
        }
        for( _field in arrFields )
        {
            switch( _field )
            {
                case "image_url":
                    oRequest.SetProperty( "image_url", tools_web.get_object_source_url( "person", _request.person_id ) );
                    break;
                case "fullname":
                case "org_name":
                case "position_name":
                case "position_parent_name":
                    if( fePerson == undefined || !_request.person_id.HasValue )
                    {
                        continue;
                    }
                    if( fePerson == null )
                    {
                        fePerson = ArrayOptFind( xarrPersons, "This.id == _request.person_id" );
                    }
                    if( fePerson == undefined )
                    {
                        continue;
                    }
                    oRequest.SetProperty( _field, RValue( fePerson.Child( _field ) ) );
                    break;
                case "event_name":
                case "event_type_name":
                case "event_type_id":
                case "event_start_date":
                    if( feEvent == undefined || !_request.object_id.HasValue )
                    {
                        continue;
                    }
                    if( feEvent == null )
                    {
                        feEvent = ArrayOptFind( xarrEvents, "This.id == _request.object_id" );
                    }
                    if( feEvent == undefined )
                    {
                        continue;
                    }
                    switch( _field )
                    {
                        case "event_name":
                            oRequest.SetProperty( _field, RValue( feEvent.name ) );
                            break;
                        case "event_type_name":
                            if( feEventType == undefined || !feEvent.event_type_id.HasValue )
                            {
                                continue;
                            }
                            if( feEventType == null )
                            {
                                feEventType = ArrayOptFind( xarrEventTypes, "This.id == feEvent.event_type_id" );
                            }
                            if( feEventType == undefined )
                            {
                                continue;
                            }
                            oRequest.SetProperty( _field, RValue( feEventType.name ) );
                            break;
                        case "event_type_id":
                            oRequest.SetProperty( _field, RValue( feEvent.event_type_id ) );
                            break;
                        case "event_start_date":
                            oRequest.SetProperty( _field, RValue( feEvent.start_date ) );
                            break;
                    }

                    break;
                case "comment":
                    oRequest.SetProperty( "comment", RValue( oTE.Child( "comment" ) ) );
                    break;
                default:
                    if( _request.ChildExists( _field ) )
                    {
                        oRequest.SetProperty( _field, RValue( _request.Child( _field ) ) );
                    }
                    else if ( StrBegins( _field, "custom_" ) )
                    {
                        oRequest.SetProperty( _field, RValue( oTE.custom_elems.ObtainChildByKey( StrReplace( _field, "custom_", "" ) ).value ) );
                    }
                    break;
            }
        }
        oRes.array.push( oRequest );
    }
    switch( sOrderField )
    {
        case "event_status_name":
        case "org_name":
        case "position_name":
        case "position_parent_name":
        case "event_name":
        case "event_type_name":
        case "event_type_id":
        case "event_start_date":
        case "comment":
            oRes.array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ oRes.array, oPaging, oSort ] ).oResult;
            break;
    }
    return oRes;
}
/**
 * @typedef {Object} oTrainerLearningTaskResult
 * @property {bigint} id - ID
 * @property {string} fullname - ФИО
 * @property {string} position_name - Должность
 * @property {string} position_parent_name - Подразделение
 * @property {string} event_name - Мероприятие
 * @property {date} event_start_date - Дата начала
 * @property {date} event_finish_date - Дата окончания
 * @property {string} learning_task_name - Задание
 * @property {date} start_date - Дата назначения
 * @property {number} mark - Оценка
 * @property {string} status_id - Статус
 */
/**
 * @typedef {Object} WTTrainerLearningTaskResultsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerLearningTaskResult[]} array – массив
 */
/**
 * @function GetTrainerLearningTaskResults
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка выполнения заданий по мероприятиям для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {string[]} [arrLearningTaskResultStates] - массив статусов задания
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventsID] - массив мероприятий
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerLearningTaskResultsResult}
 */

function GetTrainerLearningTaskResults( iPersonID, tePerson, sSearch, sFilterID, sAccessTypeID, arrLearningTaskResultStates, arrBossTypesID, arrStatuses, arrEventsID, arrEventTypesID, arrRolesID, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrLearningTaskResultStates ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrLearningTaskResultStates = [];
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "image_url;fullname;position_name;position_parent_name;org_name;event_name;event_type_id;event_type_name;start_date;finish_date;event_start_date;event_finish_date;learning_task_name;mark;status_id" ).split( ";" );
    }
    try
    {
        if( sQueryQual == undefined || sQueryQual == "" || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }
    try
    {
        if( !IsArray( arrEventsID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventsID = new Array();
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    conds = new Array();
    event_conds = new Array();

    var arrSatisfiers = new Array();
    var arrCollaborators = null;
    var arrEventIds = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            access_type_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                access_type_conds.push( "MatchSome( $ev/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            event_conds.push( "( " + ArrayMerge( access_type_conds, "This", " or " ) + " )" );
            break;

        case "tutor":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            arrEventIds = new Array();
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_collaborators where ( $elem/collaborator_id = " + iPersonID + " and ( $elem/is_tutor = true() or $elem/is_preparation = true() )) return $elem/Fields('event_id')" ), "This.event_id" ) );
            arrEventIds = ArrayUnion( arrEventIds, ArrayExtract( XQuery( "for $elem in event_lectors where $elem/person_id = " + iPersonID + " return $elem/Fields('event_id')" ), "This.event_id" ) );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            // arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            // if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            // {
            // 	return oRes;
            // }

            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, [], arrStatuses, arrEventTypesID, arrRolesID, null, null, null, null, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }
    conds.push( "$elem/event_id != null()" );
    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }

    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }

    if( ArrayOptFirstElem( arrEventsID ) != undefined )
    {
        event_conds = new Array();
        conds.push( "MatchSome( $elem/object_id, ( " + ArrayMerge( arrEventsID, "This", "," ) + " ) )" );
    }

    if( sFilterID != null )
    {
        catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
        if( catFilter != undefined && catFilter.catalog == "learning_task_result" )
        {
            conds.push( tools.create_filter_xquery( catFilter.conditions ) );
        }
    }
    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }
    if( ArrayOptFirstElem( arrLearningTaskResultStates ) != undefined )
    {
        conds.push( "MatchSome( $elem/status_id, ( " + ArrayMerge( arrLearningTaskResultStates, "XQueryLiteral( String( This ) )", "," ) + " ) )" );
    }

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$elem/event_id = $ev/id" );
    }

    var sOrderQuery = "";
    if( oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        switch( oSort.GetOptProperty( "FIELD" ) )
        {
            case "default":
                break;
            case "fullname":
                sOrderQuery = " order by $elem/person_fullname";
                break;
            case "event_name":
                sOrderQuery = " order by ForeignElem( $elem/event_id )/name";
                break;
            case "event_start_date":
                sOrderQuery = " order by ForeignElem( $elem/event_id )/start_date";
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }
    xarrLearningTaskResults = XQuery( "for $elem in learning_task_results where " + ( ArrayOptFirstElem( event_conds ) != undefined ? ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  ) : "" ) + ( ArrayMerge( conds, "This", " and " ) ) + sOrderQuery + " return $elem" );

    if( arrEventIds != null )
    {
        xarrLearningTaskResults = ArrayIntersect( xarrLearningTaskResults, arrEventIds, "This.event_id", "This" );
    }
    if( arrCollaborators != null )
    {
        xarrLearningTaskResults = ArrayIntersect( xarrLearningTaskResults, arrCollaborators, "This.person_id", "This.id" );
    }

    xarrLearningTaskResults = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrLearningTaskResults, oPaging, {} ] ).oResult;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( "learning_task_result", true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }
    xarrEventTypes = new Array();
    xarrEvents = new Array();
    xarrPersons = new Array();
    if( ArrayOptFind( arrFields, "This == 'image_url'" ) != undefined || ArrayOptFind( arrFields, "This == 'fullname'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'position_parent_name'" ) != undefined  || ArrayOptFind( arrFields, "This == 'org_name'" ) != undefined  )
    {
        if( ArrayOptFind( xarrLearningTaskResults, "This.person_id.HasValue" ) != undefined )
        {
            xarrPersons = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrLearningTaskResults, "This.person_id.HasValue" ), "This.person_id" ), "This.person_id", "," ) + " ) ) return $elem/Fields( 'id', 'fullname', 'position_name', 'position_parent_name', 'org_name' )" );
        }
    }
    if( ArrayOptFind( arrFields, "This == 'event_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined || ArrayOptFind( arrFields, "This == 'event_type_id'" ) != undefined  || ArrayOptFind( arrFields, "This == 'event_start_date'" ) != undefined  )
    {
        if( ArrayOptFind( xarrLearningTaskResults, "This.event_id.HasValue" ) != undefined )
        {
            xarrEvents = XQuery( "for $elem in events where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrLearningTaskResults, "This.event_id.HasValue" ), "This.event_id" ), "This.event_id", "," ) + " ) ) return $elem/Fields( 'id', 'event_type_id', 'name', 'start_date' )" );
            if( ArrayOptFind( arrFields, "This == 'event_type_name'" ) != undefined )
            {
                if( ArrayOptFind( xarrEvents, "This.event_type_id.HasValue" ) != undefined )
                {
                    xarrEventTypes = XQuery( "for $elem in event_types where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrEvents, "This.event_type_id.HasValue" ), "This.event_type_id" ), "This.event_type_id", "," ) + " ) ) return $elem/Fields( 'id', 'name' )" );
                }
            }
        }
    }
    for( _learning_task_result in xarrLearningTaskResults )
    {
        fePerson = null;
        feEvent = null;
        feEventType = null;
        oLearningTaskResult = new Object();
        oLearningTaskResult.id = _learning_task_result.id.Value;
        oLearningTaskResult.event_id = _learning_task_result.event_id.Value;

        for( _field in arrFields )
        {
            switch( _field )
            {
                case "image_url":
                    oLearningTaskResult.SetProperty( "image_url", tools_web.get_object_source_url( "person", _learning_task_result.person_id ) );
                    break;
                case "fullname":
                case "org_name":
                case "position_name":
                case "position_parent_name":
                    if( fePerson == undefined || !_learning_task_result.person_id.HasValue )
                    {
                        continue;
                    }
                    if( fePerson == null )
                    {
                        fePerson = ArrayOptFind( xarrPersons, "This.id == _learning_task_result.person_id" );
                    }
                    if( fePerson == undefined )
                    {
                        continue;
                    }
                    oLearningTaskResult.SetProperty( _field, RValue( fePerson.Child( _field ) ) );
                    break;
                case "event_name":
                case "event_type_name":
                case "event_type_id":
                case "event_start_date":
                    if( feEvent == undefined || !_learning_task_result.event_id.HasValue )
                    {
                        continue;
                    }
                    if( feEvent == null )
                    {
                        feEvent = ArrayOptFind( xarrEvents, "This.id == _learning_task_result.event_id" );
                    }
                    if( feEvent == undefined )
                    {
                        continue;
                    }
                    switch( _field )
                    {
                        case "event_name":
                            oLearningTaskResult.SetProperty( _field, RValue( feEvent.name ) );
                            break;
                        case "event_type_name":
                            if( feEventType == undefined || !feEvent.event_type_id.HasValue )
                            {
                                continue;
                            }
                            if( feEventType == null )
                            {
                                feEventType = ArrayOptFind( xarrEventTypes, "This.id == feEvent.event_type_id" );
                            }
                            if( feEventType == undefined )
                            {
                                continue;
                            }
                            oLearningTaskResult.SetProperty( _field, RValue( feEventType.name ) );
                            break;
                        case "event_type_id":
                            oLearningTaskResult.SetProperty( _field, RValue( feEvent.event_type_id ) );
                            break;
                        case "event_start_date":
                            oLearningTaskResult.SetProperty( _field, RValue( feEvent.start_date ) );
                            break;
                    }

                    break;

                default:
                    if( _learning_task_result.ChildExists( _field ) )
                    {
                        oLearningTaskResult.SetProperty( _field, RValue( _learning_task_result.Child( _field ) ) );
                    }
                    break;
            }
        }
        oRes.array.push( oLearningTaskResult );
    }
    return oRes;
}
/**
 * @typedef {Object} oTrainerCollaborator
 * @property {bigint} id - ID
 * @property {string} name - ФИО
 * @property {string} name_second - Должность
 * @property {string} name_third - Подразделение
 * @property {string} image_url - Картинка
 * @property {number} active_events - в процессе
 * @property {number} active_events_no_confirm - не подтвердил
 * @property {number} project_events - проекты
 * @property {number} archive_events - завершено
 * @property {number} archive_events_assist - участвовал
 * @property {number} archive_events_no_assist - не участвовал
 * @property {number} active_courses - курсов в процессе
 * @property {number} courses - курсов завершил
 * @property {number} active_tests - тестов в процессе
 * @property {number} tests - тестов завершил
 * @property {number} passed_tests - тестов сдал
 * @property {number} active_tasks - заданий в процессе
 * @property {number} tasks - заданий выполнено
 * @property {number} active_requests - активных заявок
 * @property {number} requests - подано заявок
 * @property {date} last_event_date - последнее участие
 * @property {date} future_event_date - будет участвовать
 */
/**
 * @typedef {Object} WTTrainerCollaboratorsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerCollaborator[]} array – массив
 */
/**
 * @function GetTrainerCollaborators
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка сотрудников для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sFilterID] - идентификатор фильтра
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {string[]} [arrRestrictions] - исключения сотрудников
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string[]} [arrAddColumns] - массив дополнительных полей
 * @returns {WTTrainerCollaboratorsResult}
 */

function GetTrainerCollaborators( iPersonID, tePerson, sSearch, sFilterID, sQueryQual, sAccessTypeID, arrRestrictions, arrBossTypesID, arrStatuses, arrEventTypesID, arrRolesID, oSort, oPaging, arrAddColumns )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrAddColumns ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrAddColumns = new Array();
    }
    try
    {
        if( !IsArray( arrRestrictions ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRestrictions = new Array();
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }

    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }

    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }
    try
    {
        if( sFilterID == undefined || sFilterID == "" )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sFilterID = null;
    }
    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }

    var bShowDismiss = false;
    var bShowCandidate = false;
    var bShowOutstaff = false;
    for( _restriction in arrRestrictions )
    {
        switch( _restriction )
        {
            case "dismiss":
                bShowDismiss = true;
                break;
            case "candidate":
                bShowCandidate = true;
                break;
            case "outstaff":
                bShowOutstaff = true;
                break;
        }
    }
    conds = new Array();

    if( !bShowDismiss )
    {
        conds.push( "$elem/is_dismiss = false()" )
    }
    if( !bShowCandidate )
    {
        conds.push( "$elem/is_candidate = false()" )
    }
    if( !bShowOutstaff )
    {
        conds.push( "$elem/is_outstaff = false()" )
    }

    var arrCollaborators = null;
    var arrEventIds = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            break;
        case "manager":
            if( ArrayOptFirstElem( arrEventsID ) != undefined )
            {
                break;
            }
            if( ArrayOptFirstElem( arrBossTypesID ) == undefined )
            {
                catEducationManager = ArrayOptFirstElem( XQuery( "for $elem in boss_types where $elem/code = 'education_manager' return $elem/Fields( 'id' )" ) );
                if( catEducationManager != undefined )
                {
                    arrBossTypesID.push( catEducationManager.id.Value );
                }
            }
            xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + ( ArrayOptFirstElem( arrBossTypesID ) != undefined ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypesID, "This", "," ) + " ) )" : "" ) + " and MatchSome( $elem/catalog, ( 'org', 'subdivision' ) ) return $elem/Fields( 'object_id', 'catalog' )" )
            if( ArrayOptFirstElem( xarrFuncManagers ) == undefined )
            {
                return oRes;
            }
            col_conds = new Array();
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'org'" ) != undefined )
            {
                col_conds.push( "MatchSome( $elem/org_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'org'" ), "This.object_id", "," ) + " ) )" );
            }
            if( ArrayOptFind( xarrFuncManagers, "This.catalog == 'subdivision'" ) != undefined )
            {
                col_conds.push( "MatchSome( $elem/position_parent_id, ( " + ArrayMerge( ArraySelect( xarrFuncManagers, "This.catalog == 'subdivision'" ), "This.object_id", "," ) + " ) )" );
            }
            conds.push( "( " + ArrayMerge( col_conds, "This", " or " ) + " )" );
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", bShowDismiss, sSearch, true, arrBossTypesID, null, oSort ] );
            arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, "", null, "", true, true, true, true, arrBossTypesID, true ] );
            if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            {
                return oRes;
            }
            if( !bShowDismiss )
            {
                arrCollaborators = ArraySelectByKey( arrCollaborators, false, "is_dismiss" );
            }
            if( !bShowCandidate )
            {
                arrCollaborators = ArraySelectByKey( arrCollaborators, false, "is_candidate" );
            }
            if( !bShowOutstaff )
            {
                arrCollaborators = ArraySelectByKey( arrCollaborators, false, "is_outstaff" );
            }
            if( sSearch != "" )
            {
                arrCollaborators = ArraySelect( arrCollaborators, "StrContains( This.fullname, sSearch ) || StrContains( This.position_name, sSearch ) || StrContains( This.position_parent_name, sSearch )" );
            }

            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }
    if( arrCollaborators == null )
    {
        var sOrderQuery = "";
        if( oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
        {
            sOrderQuery= " order by $elem/" + oSort.FIELD + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
        }
        if( sSearch != "" )
        {
            conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
        }
        if( sFilterID != null )
        {
            catFilter = lists.view_conditions_schemes.GetOptChildByKey( sFilterID );
            if( catFilter != undefined && catFilter.catalog == "learning_task_result" )
            {
                conds.push( tools.create_filter_xquery( catFilter.conditions ) );
            }
        }
        if( sQueryQual != "" )
        {
            conds.push( " ( " + sQueryQual + " ) " );
        }

        arrCollaborators = XQuery( "for $elem in collaborators " + ( ArrayOptFirstElem( conds ) != undefined ? ( " where " + ArrayMerge( conds, "This", " and " ) ) : "" ) + sOrderQuery + " return $elem" );
    }

    arrCollaborators = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ arrCollaborators, oPaging, null ] ).oResult;
    if( ArrayOptFirstElem( arrCollaborators ) == undefined )
    {
        return oRes;
    }
    var event_conds = new Array();
    if( ArrayOptFirstElem( arrStatuses ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrRolesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
    }
    if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
    {
        event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
    }

    var sEventSatisfier = "";
    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$elem/event_id = $ev/id" );
        sEventSatisfier = ( "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) and "  );
    }
    else
    {
        sEventSatisfier = " $elem/event_id != null() and "
    }

    var sMergeCollaborators = ArrayMerge( arrCollaborators, "This.id", "," );
    var xarrEventCollaborators = ArrayDirect( XQuery( "for $elem in event_collaborators where " + sEventSatisfier + " $elem/is_collaborator = true() and MatchSome( $elem/collaborator_id, ( " + sMergeCollaborators + " ) ) order by $elem/collaborator_id ascending return $elem/Fields( 'collaborator_id', 'status_id', 'event_id', 'finish_date', 'start_date' )" ) );
    var xarrEventResults = ArrayDirect( XQuery( "for $elem in event_results where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'is_assist', 'is_confirm', 'event_id' )" ) );
    var xarrActiveLearnings = ArrayDirect( XQuery( "for $elem in active_learnings where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'state_id' )" ) );
    var xarrLearnings = ArrayDirect( XQuery( "for $elem in learnings where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'state_id' )" ) );
    var xarrActiveTestLearnings = ArrayDirect( XQuery( "for $elem in active_test_learnings where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'state_id' )" ) );
    var xarrTestLearnings = ArrayDirect( XQuery( "for $elem in test_learnings where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'state_id' )" ) );

    var xarrLearningTaskResults = ArrayDirect( XQuery( "for $elem in learning_task_results where " + sEventSatisfier + " MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'status_id' )" ) );

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        var xarrEventRequests = XQuery( "for $elem in requests where " + StrReplace( sEventSatisfier, "$elem/event_id", "$elem/object_id" ) + " $elem/type = 'event' and MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'status_id' )" );
        xarrEventRequests = ArrayUnion( xarrEventRequests, XQuery( "for $elem in requests where $elem/type = 'education_method' and MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'status_id' )" ) );
        xarrEventRequests = ArraySort( xarrEventRequests, "This.person_id", "+" )
    }
    else
    {
        var xarrEventRequests = ArrayDirect( XQuery( "for $elem in requests where ( $elem/type = 'education_method' or $elem/type = 'event' ) and MatchSome( $elem/person_id, ( " + sMergeCollaborators + " ) ) order by $elem/person_id ascending return $elem/Fields( 'person_id', 'status_id' )" ) );
    }

    for( _collaborator in arrCollaborators )
    {
        arrPersonEventCollaborators = ArraySelectBySortedKey( xarrEventCollaborators, _collaborator.id, "collaborator_id" );
        arrPersonEventresults = ArraySelectBySortedKey( xarrEventResults, _collaborator.id, "person_id" );
        arrPersonActiveLearnings = ArraySelectBySortedKey( xarrActiveLearnings, _collaborator.id, "person_id" );
        arrPersonLearnings = ArraySelectBySortedKey( xarrLearnings, _collaborator.id, "person_id" );
        arrPersonActiveTestLearnings = ArraySelectBySortedKey( xarrActiveTestLearnings, _collaborator.id, "person_id" );
        arrPersonTestLearnings = ArraySelectBySortedKey( xarrTestLearnings, _collaborator.id, "person_id" );
        arrPersonLearningTaskResults = ArraySelectBySortedKey( xarrLearningTaskResults, _collaborator.id, "person_id" );
        arrPersonEventRequests = ArraySelectBySortedKey( xarrEventRequests, _collaborator.id, "person_id" );

        oCollaborator = new Object();
        oCollaborator.id = _collaborator.id.Value;
        oCollaborator.name = _collaborator.fullname.Value;
        oCollaborator.name_second = _collaborator.position_name.Value;
        oCollaborator.name_third = _collaborator.position_parent_name.Value;
        oCollaborator.SetProperty( "image_url", tools_web.get_object_source_url( "person", _collaborator.id ) );
        for( _field in arrAddColumns )
        {
            switch( _field )
            {
                default:
                    if( _collaborator.ChildExists( _field ) )
                    {
                        oCollaborator.SetProperty( _field, RValue( _collaborator.Child( _field ) ) );
                    }
                    break;
            }
        }
        arrPersonActiveEventResult = ArraySelect( arrPersonEventCollaborators, "This.status_id == 'plan' || This.status_id == 'active'" );
        arrPersonNotAssistEventResult = ArraySelectByKey( arrPersonEventresults, false, "is_assist" );
        oCollaborator.SetProperty( "active_events", ArrayCount( arrPersonActiveEventResult ) );
        oCollaborator.SetProperty( "active_events_no_confirm", ArrayCount( ArrayIntersect( ArraySelectByKey( arrPersonEventresults, false, "is_confirm" ), arrPersonActiveEventResult, "This.event_id", "This.event_id" ) ) );

        arrPersonCloseEventResult = ArraySelectByKey( arrPersonEventCollaborators, "close", "status_id" );

        oCollaborator.SetProperty( "project_events", ArrayCount( ArraySelectByKey( arrPersonEventCollaborators, "project", "status_id" ) ) );
        oCollaborator.SetProperty( "archive_events", ArrayCount( arrPersonCloseEventResult ) );
        oCollaborator.SetProperty( "archive_events_assist ", ArrayCount( ArrayIntersect( ArraySelectByKey( arrPersonEventresults, true, "is_assist" ), arrPersonCloseEventResult, "This.event_id", "This.event_id" ) ) );
        oCollaborator.SetProperty( "archive_events_no_assist ", ArrayCount( ArrayIntersect( arrPersonNotAssistEventResult, arrPersonCloseEventResult, "This.event_id", "This.event_id" ) ) );

        oCollaborator.SetProperty( "active_courses", ArrayCount( arrPersonActiveLearnings ) );
        oCollaborator.SetProperty( "courses", ArrayCount( arrPersonLearnings ) );
        oCollaborator.SetProperty( "active_tests", ArrayCount( arrPersonActiveTestLearnings ) );
        oCollaborator.SetProperty( "tests", ArrayCount( arrPersonTestLearnings ) );
        oCollaborator.SetProperty( "passed_tests", ArrayCount( ArraySelectByKey( arrPersonTestLearnings, 4, "state_id" ) ) );

        iAllLearningTaskResult = ArrayCount( arrPersonLearningTaskResults );
        iFinishedLearningTaskResult = ArrayCount( ArraySelect( arrPersonLearningTaskResults, "This.status_id == 'success' || This.status_id == 'failed'" ) );
        oCollaborator.SetProperty( "active_tasks", ( iAllLearningTaskResult - iFinishedLearningTaskResult ) );
        oCollaborator.SetProperty( "tasks", iFinishedLearningTaskResult );

        oCollaborator.SetProperty( "active_requests", ArrayCount( ArraySelectByKey( arrPersonEventRequests, "active", "status_id" ) ) );
        oCollaborator.SetProperty( "requests", ArrayCount( arrPersonEventRequests ) );

        catLastEvent = ArrayOptFind( ArraySort( arrPersonEventCollaborators, "This.finish_date", "-" ), "This.finish_date < Date()" );
        oCollaborator.SetProperty( "last_event_date", ( catLastEvent != undefined ? RValue( catLastEvent.finish_date ) : "" ) );
        catFutureEvent = ArrayOptFind( ArraySort( arrPersonEventCollaborators, "This.start_date", "+" ), "This.start_date > Date()" );
        oCollaborator.SetProperty( "future_event_date", ( catFutureEvent != undefined ? RValue( catFutureEvent.start_date ) : "" ) );
        oRes.array.push( oCollaborator );
    }
    return oRes;
}
/**
 * @typedef {Object} oTrainerEventResult
 * @property {bigint} id - ID
 * @property {string} event_name - название мероприятия
 * @property {string} person_fullname - ФИО
 * @property {string} person_position_name - название должности
 * @property {string} person_subdivision_name - название подразделения
 * @property {string} image_url - адрес картинки
 * @property {string} event_status_id - статус мероприятия
 * @property {date} event_start_date - дата и время начала мероприятия
 * @property {boolean} has_tests - назначались ли участнику тесты в рамках мероприятия
 * @property {boolean} tests_passed - сдал ли участник успешно все тесты, назначенные в рамках мероприятия
 * @property {boolean} has_courses - назначались ли участнику курсы в рамках мероприятия
 * @property {boolean} courses_passed - прошел ли участник успешно все курсы, назначенные в рамках мероприятия
 * @property {boolean} has_learning_tasks - назначались ли участнику задания в рамках мероприятия
 * @property {boolean} learning_tasks_passed - прошел ли участник успешно все задания, назначенные в рамках мероприятия
 * @property {boolean} is_confirm - подтвердил участие
 * @property {boolean} not_participate - отказался от участия
 * @property {boolean} is_assist - присутствовал
 * @property {string} event_status_name - Статус мероприятия
 */
/**
 * @typedef {Object} WTTrainerEventResultsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oTrainerEventResult[]} array – массив
 */
/**
 * @function GetTrainerEventResults
 * @memberof Websoft.WT.Event
 * @author PL
 * @description выборка по результатам мероприятия для Кабинета тренера.
 * @param {bigint} iPersonID - идентификатор сотрудника
 * @param {XmElem} [tePerson] - TopElem сотрудника
 * @param {string} [sSearch] - строка для поиска
 * @param {string} [sAccessTypeID] - тип доступа
 * @param {bigint[]} [arrBossTypesID] - массив типов руководителей
 * @param {string[]} [arrStatuses] - массив статусов
 * @param {bigint[]} [arrEventTypesID] - массив типов мероприятий
 * @param {bigint[]} [arrRolesID] - массив категорий мероприятий
 * @param {string} [sTypeID] - тип отбора мероприятий
 * @param {string} [sPeriodType] - тип периода
 * @param {date} [dStartDate] - дата начала
 * @param {date} [dFinishDate] - дата завершения
 * @param {string} [sReturnData] - тип возвращаемых данных
 * @param {string[]} [arrFields] - массив возвращаемых полей
 * @param {oSort} oSort - Информация из рантайма о сортировке
 * @param {oPaging} oPaging - Информация из рантайма о пейджинге
 * @param {string} [sQueryQual] - условие XQuery выборки
 * @returns {WTTrainerEventResultsResult}
 */
function GetTrainerEventResults( iPersonID, tePerson, sSearch, sAccessTypeID, arrBossTypesID, arrStatuses, arrEventTypesID, arrRolesID, sTypeID, sPeriodType, dStartDate, dFinishDate, sReturnData, arrFields, oSort, oPaging, sQueryQual )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }
    try
    {
        if( !IsArray( arrFields ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrFields = String( "event_name;person_fullname;person_position_name;person_subdivision_name;image_url;event_status_id;event_start_date;has_tests;tests_passed;has_courses;courses_passed;has_learning_tasks;learning_tasks_passed;is_confirm;not_participate;is_assist" ).split( ";" );
    }
    try
    {
        if( sQueryQual == undefined || sQueryQual == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sQueryQual = "";
    }
    try
    {
        if( sReturnData == undefined || sReturnData == "" || sReturnData == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sReturnData = "fields";
    }

    try
    {
        if ( dStartDate != null )
        {
            dStartDate = Date( dStartDate );
        }
    }
    catch( err )
    {
        dStartDate = null;
    }
    try
    {
        if ( dFinishDate != null )
        {
            dFinishDate = Date( dFinishDate );
        }
    }
    catch( err )
    {
        dFinishDate = null;
    }
    try
    {
        if( sTypeID == undefined || sTypeID == "" || sTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sTypeID = "period";
    }
    try
    {
        if( sPeriodType == undefined || sPeriodType == "" || sPeriodType == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sPeriodType = "current";
    }
    try
    {
        if( !IsArray( arrRolesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrRolesID = new Array();
    }
    try
    {
        if( !IsArray( arrEventTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypesID = new Array();
    }
    try
    {
        if( !IsArray( arrStatuses ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrStatuses = new Array();
    }
    try
    {
        if( sAccessTypeID == undefined || sAccessTypeID == "" || sAccessTypeID == null )
        {
            throw "error";
        }
    }
    catch( err )
    {
        sAccessTypeID = "admin";
    }
    try
    {
        if( !IsArray( arrBossTypesID ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrBossTypesID = new Array();
    }
    try
    {
        if( sSearch == undefined || sSearch == null )
        {
            throw "error";
        }
        sSearch = String( sSearch );
    }
    catch( err )
    {
        sSearch = "";
    }

    try
    {
        if( ObjectType( oPaging ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oPaging = ({});
    }
    try
    {
        if( ObjectType( oSort ) != 'JsObject' )
        {
            throw "error";
        }
    }
    catch( err )
    {
        oSort = ({});
    }
    function add_event_conds()
    {
        if( ArrayOptFirstElem( arrStatuses ) != undefined )
        {
            event_conds.push( "MatchSome( $ev/status_id, ( " + ArrayMerge( arrStatuses, "XQueryLiteral( This )", "," ) + " ) )" );
        }
        if( ArrayOptFirstElem( arrRolesID ) != undefined )
        {
            event_conds.push( "MatchSome( $ev/role_id, ( " + ArrayMerge( arrRolesID, "This", "," ) + " ) )" );
        }
        if( ArrayOptFirstElem( arrEventTypesID ) != undefined )
        {
            event_conds.push( "MatchSome( $ev/event_type_id, ( " + ArrayMerge( arrEventTypesID, "This", "," ) + " ) )" );
        }
        switch( sTypeID )
        {
            case "period":
                switch( sPeriodType )
                {
                    case "past":
                        event_conds.push( "$ev/finish_date < " + XQueryLiteral( Date() ) );
                        break;
                    case "current":
                        event_conds.push( "$ev/start_date < " + XQueryLiteral( Date() ) );
                        event_conds.push( "$ev/finish_date > " + XQueryLiteral( Date() ) );
                        break;
                    case "future":
                        event_conds.push( "$ev/start_date > " + XQueryLiteral( Date() ) );
                        break;
                }
                break;
            case "date":
                if( dStartDate != null )
                {
                    event_conds.push( "$ev/finish_date > " + XQueryLiteral( dStartDate ) );
                }
                if( dFinishDate != null )
                {
                    event_conds.push( "$ev/start_date < " + XQueryLiteral( dFinishDate ) );
                }
                break;
        }
    }
    conds = new Array();

    event_conds = new Array();
    arrCollaborators = null;
    arrEvents = null;
    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, "websoft_event_process" ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            add_event_conds();
            break;
        case "manager":
        case "tutor":
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, arrBossTypesID, arrStatuses, arrEventTypesID, arrRolesID, sTypeID, sPeriodType, dStartDate, dFinishDate, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }
            break;

        case "observer":
            //arrCollaborators = tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, "all_subordinates", false, "", true, arrBossTypesID ] );
            //arrCollaborators = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['fact','func'], false, '', null, "", true, true, true, true, arrBossTypesID, true ] );
            // if( ArrayOptFirstElem( arrCollaborators ) == undefined )
            // {
            // 	return oRes;
            // }
            // if( ArrayCount( arrCollaborators ) < 1000 )
            // {
            // 	conds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrCollaborators, "This.id", "," ) + " ) )" );
            // 	arrCollaborators = null;
            // }
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, [], arrStatuses, arrEventTypesID, arrRolesID, sTypeID, sPeriodType, dStartDate, dFinishDate, "fields", [ "id" ], ({}), ({}), StrReplace(sQueryQual, 'event_id', 'id') )
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }
            add_event_conds();
            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }

    if( ArrayOptFirstElem( event_conds ) != undefined )
    {
        event_conds.push( "$ev/id = $elem/event_id" );
    }

    if( sSearch != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
    }

    if( sQueryQual != "" )
    {
        conds.push( sQueryQual );
    }
    var sOrderQuery = "";
    var sOrderField = "";
    if( oSort.GetOptProperty( "FIELD" ) != undefined && oSort.GetOptProperty( "FIELD" ) != null )
    {
        sOrderField = oSort.GetOptProperty( "FIELD" );
        switch( sOrderField )
        {
            case "event_status_name":
            case "default":
            case "has_tests":
            case "tests_passed":
            case "has_courses":
            case "courses_passed":
            case "has_learning_tasks":
            case "learning_tasks_passed":
            case "":
                break;
            default:
                sOrderQuery = " order by $elem/" + oSort.FIELD;
                break;
        }
        if( sOrderQuery != "" )
        {
            sOrderQuery += ( StrUpperCase( oSort.DIRECTION ) == "DESC" ? " descending" : "" );
        }
    }
    if( ArrayOptFirstElem( event_conds ) == undefined )
    {
        var sEventResultsReq = "for $elem in event_results " + ( ArrayOptFirstElem( conds ) != undefined ? ( " where " + ArrayMerge( conds, "This", " and " ) ) : "" ) + sOrderQuery + " return $elem";
    }
    else
    {
        sSatisfier = "some $ev in events satisfies ( " + ArrayMerge( event_conds, "This", " and " ) + " ) ";
        var sEventResultsReq = "for $elem in event_results where " + sSatisfier + ( ArrayOptFirstElem( conds ) != undefined ? ( " and " + ArrayMerge( conds, "This", " and " ) ) : "" ) + sOrderQuery + " return $elem";
    }

    var xarrEventResults = tools.xquery(sEventResultsReq);

    if( arrEvents != null )
    {
        xarrEventResults = ArrayIntersect( xarrEventResults, arrEvents, "This.event_id", "This.id" );
    }
    if( arrCollaborators != null )
    {
        xarrEventResults = ArrayIntersect( xarrEventResults, arrCollaborators, "This.person_id", "This.id" );
    }
    switch( sOrderField )
    {
        case "event_status_name":
        case "has_tests":
        case "tests_passed":
        case "has_courses":
        case "courses_passed":
        case "has_learning_tasks":
        case "learning_tasks_passed":
            break;
        default:
            xarrEventResults = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrEventResults, oPaging, null ] ).oResult;
            break;
    }
    if( ArrayOptFirstElem( xarrEventResults ) == undefined )
    {
        return oRes;
    }
    xarrEvents = new Array();
    xarrTests = new Array();
    xarrCourses = new Array();
    xarrLearningTasks = new Array();
    sPersonsIdMerge = null;
    sEventsIdMerge = null;

    switch( sReturnData )
    {
        case "all":
            arrFields = new Array();
            _array_fields = tools.new_doc_by_name( "event_result", true ).TopElem.AddChild();
            for( _field in _array_fields )
            {
                if( !_field.IsTemp )
                {
                    arrFields.push( _field.Name );
                }
            }
            break;
    }

    if( ArrayOptFind( arrFields, "This == 'event_status_id'" ) != undefined )
    {
        if( sEventsIdMerge == null )
        {
            sEventsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," );
        }
        xarrEvents = ArrayDirect( XQuery( "for $elem_qc in events where MatchSome( $elem_qc/id, ( " + sEventsIdMerge + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','status_id')" ) );
    }

    if( ArrayOptFind( arrFields, "This == 'has_tests'" ) != undefined || ArrayOptFind( arrFields, "This == 'tests_passed'" ) != undefined )
    {
        if( sEventsIdMerge == null )
        {
            sEventsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," );
        }
        if( sPersonsIdMerge == null )
        {
            sPersonsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.person_id" ), "This.person_id", "," );
        }
        xarrTests = ArrayUnion( XQuery( "for $elem in active_test_learnings where MatchSome( $elem/event_id, ( " + sEventsIdMerge + " ) ) and MatchSome( $elem/person_id, ( " + sPersonsIdMerge + " ) ) return $elem/Fields('person_id','event_id','state_id')" ),
            XQuery( "for $elem in test_learnings where MatchSome( $elem/event_id, ( " + sEventsIdMerge + " ) ) and MatchSome( $elem/person_id, ( " + sPersonsIdMerge + " ) ) return $elem/Fields('person_id','event_id','state_id')" ));
    }
    if( ArrayOptFind( arrFields, "This == 'has_learning_tasks'" ) != undefined || ArrayOptFind( arrFields, "This == 'learning_tasks_passed'" ) != undefined )
    {
        if( sEventsIdMerge == null )
        {
            sEventsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," );
        }
        if( sPersonsIdMerge == null )
        {
            sPersonsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.person_id" ), "This.person_id", "," );
        }
        xarrLearningTasks = XQuery( "for $elem in learning_task_results where MatchSome( $elem/event_id, ( " + sEventsIdMerge + " ) ) and MatchSome( $elem/person_id, ( " + sPersonsIdMerge + " ) ) return $elem/Fields('person_id','event_id','status_id')" );
    }
    if( ArrayOptFind( arrFields, "This == 'has_courses'" ) != undefined || ArrayOptFind( arrFields, "This == 'courses_passed'" ) != undefined )
    {
        if( sEventsIdMerge == null )
        {
            sEventsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," );
        }
        if( sPersonsIdMerge == null )
        {
            sPersonsIdMerge = ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.person_id" ), "This.person_id", "," );
        }
        xarrCourses = ArrayUnion( XQuery( "for $elem in active_learnings where MatchSome( $elem/event_id, ( " + sEventsIdMerge + " ) ) and MatchSome( $elem/person_id, ( " + sPersonsIdMerge + " ) ) return $elem/Fields('person_id','event_id','state_id')" ),
            XQuery( "for $elem in learnings where MatchSome( $elem/event_id, ( " + sEventsIdMerge + " ) ) and MatchSome( $elem/person_id, ( " + sPersonsIdMerge + " ) ) return $elem/Fields('person_id','event_id','state_id')" ));
    }

    for( _event_result in xarrEventResults )
    {
        arrPersonCourses = null;
        arrPersonTests = null;
        arrPersonLearningTasks = null;
        oEventResult = new Object();
        oEventResult.id = _event_result.id.Value;
        oEventResult.event_id = _event_result.event_id.Value;

        for( _field in arrFields )
        {
            switch( _field )
            {
                case "image_url":
                    oEventResult.SetProperty( "image_url", tools_web.get_object_source_url( "person", _event_result.person_id ) );
                    break;
                case "event_status_id":
                case "event_status_name":
                    feEvent = ArrayOptFindBySortedKey( xarrEvents, _event_result.event_id, 'id' );
                    if( feEvent != undefined )
                    {
                        oEventResult.SetProperty( "event_status_id", feEvent.status_id.Value );
                        oEventResult.SetProperty( "event_status_name", feEvent.status_id.OptForeignElem.name.Value );
                    }
                    break;
                case "has_tests":
                    if( arrPersonTests == null )
                    {
                        arrPersonTests = ArraySelect( xarrCourses, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "has_tests", ( ArrayOptFirstElem( arrPersonTests ) != undefined ) );
                    break;
                case "tests_passed":
                    if( arrPersonTests == null )
                    {
                        arrPersonTests = ArraySelect( xarrCourses, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "tests_passed", ( ArrayOptFirstElem( arrPersonTests ) == undefined ? '': ArrayOptFind( arrPersonTests, "This.state_id != 4" ) == undefined ) );
                    break;
                case "has_courses":
                    if( arrPersonCourses == null )
                    {
                        arrPersonCourses = ArraySelect( xarrCourses, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "has_courses", ( ArrayOptFirstElem( arrPersonCourses ) != undefined ) );
                    break;
                case "courses_passed":
                    if( arrPersonCourses == null )
                    {
                        arrPersonCourses = ArraySelect( xarrCourses, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "courses_passed", ( ArrayOptFirstElem( arrPersonCourses ) == undefined ? '': ArrayOptFind( arrPersonCourses, "This.state_id != 4" ) == undefined ) );
                case "has_learning_tasks":
                    if( arrPersonLearningTasks == null )
                    {
                        arrPersonLearningTasks = ArraySelect( xarrLearningTasks, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "has_learning_tasks", ( ArrayOptFirstElem( arrPersonLearningTasks ) != undefined ) );
                    break;
                case "learning_tasks_passed":
                    if( arrPersonLearningTasks == null )
                    {
                        arrPersonLearningTasks = ArraySelect( xarrLearningTasks, "This.person_id == _event_result.person_id && This.event_id == _event_result.event_id" );
                    }
                    oEventResult.SetProperty( "learning_tasks_passed", ( ArrayOptFirstElem( arrPersonLearningTasks ) == undefined ? '': ArrayOptFind( arrPersonLearningTasks, "This.status_id != 'success'" ) == undefined ) );
                default:
                    if( _event_result.ChildExists( _field ) )
                    {
                        oEventResult.SetProperty( _field, RValue( _event_result.Child( _field ) ) );
                    }
                    break;
            }
        }
        oRes.array.push( oEventResult );
    }
    switch( sOrderField )
    {
        case "event_status_name":
        case "has_tests":
        case "tests_passed":
        case "has_courses":
        case "courses_passed":
        case "has_learning_tasks":
        case "learning_tasks_passed":
            oRes.array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ oRes.array, oPaging, oSort ] ).oResult;
            break;
    }
    return oRes;
}

/**
 * @typedef {Object} PersonCompoundProgramContext
 * @property {bool} bActiveEducationPlan – Наличие у текущего пользователя активного плана обучения, связанного с модульной программой.
 * @property {bool} bLector – Является ли текущий пользователь преподавателем, указанным в карточке модульной программы.
 * @property {bigint} iEducationPlanID – ID учебного плана.
 * @property {string} sEducationPlanState – Статус учебного плана.
 * @property {string} sEducationPlanStateName – Наименование статуса учебного плана.
 @property {bigint} iCompoundProgramID – ID модульной программы.
 */
/**
 * @typedef {Object} ReturnPersonCompoundProgramContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {PersonCompoundProgramContext} context – Контекст мероприятия.
 */
/**
 * @function GetPersonCompoundProgramContext
 * @memberof Websoft.WT.Event
 * @description Получение контекста мероприятия.
 * @param {bigint} iPersonID - ID сотрудника.
 * @param {bigint} iCompoundProgramID - ID модульной программы.
 * @returns {ReturnPersonCompoundProgramContext}
 */
function GetPersonCompoundProgramContext( iPersonID, iCompoundProgramID )
{
    return get_person_compound_program_context( iPersonID, iCompoundProgramID );
}
function get_person_compound_program_context( iPersonID, iCompoundProgramID, teCompoundProgram, iEducationPlanID )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    catEducationPlan = null;
    try
    {
        iEducationPlanID = Int( iEducationPlanID );
        catEducationPlan = ArrayOptFirstElem( XQuery( "for $elem in education_plans where $elem/id = " + iEducationPlanID + " return $elem/Fields('id', 'state_id', 'compound_program_id')" ) );
    }
    catch( ex )
    {
        iEducationPlanID = null;
    }

    try
    {
        iCompoundProgramID = Int( iCompoundProgramID );
    }
    catch( ex )
    {
        if( iEducationPlanID == null )
        {
            oRes.error = 503;
            oRes.errorText = "{ text: 'Object not found.', param_name: 'iCompoundProgramID' }";
            return oRes;
        }
        iCompoundProgramID = catEducationPlan.compound_program_id;
    }
    try
    {
        teCompoundProgram.Name;
    }
    catch( ex )
    {
        try
        {
            teCompoundProgram = OpenDoc( UrlFromDocID( iCompoundProgramID ) ).TopElem;
        }
        catch( ex )
        {
            oRes.error = 503;
            oRes.errorText = "{ text: 'Object not found.', param_name: 'iCompoundProgramID' }";
            return oRes;
        }
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 503;
        oRes.errorText = "{ text: 'Object not found.', param_name: 'iPersonID' }";
        return oRes;
    }
    if( catEducationPlan == null )
    {
        var education_plan_conds = new Array();
        xarrPersonGroups = XQuery( "for $elem in group_collaborators where $elem/collaborator_id = " + iPersonID + " return $elem/Fields( 'group_id' )" );
        if( ArrayOptFirstElem( xarrPersonGroups ) != undefined )
        {
            education_plan_conds.push( "( $elem/type = 'group' and MatchSome( $elem/object_id, ( " + ArrayMerge( xarrPersonGroups, "This.group_id", "," ) + " ) ) )" );
        }
        education_plan_conds.push( "$elem/person_id = " + iPersonID );

        catEducationPlan = ArrayOptFirstElem( XQuery( "for $elem in education_plans where MatchSome( $elem/state_id, ( 0, 1 ) ) and $elem/compound_program_id = " + iCompoundProgramID + " and ( " + ArrayMerge( education_plan_conds, "This", " or " ) + " ) return $elem/Fields('id', 'state_id')" ) );
    }
    xarrLectors = XQuery( "for $elem in lectors where $elem/person_id = " + iPersonID + " and $elem/is_dismiss != true() return $elem/Fields('id')" );
    var oContext = {
        iCompoundProgramID: iCompoundProgramID,
        bActiveEducationPlan: ( catEducationPlan != undefined	),
        bLector: ( ArrayOptFirstElem( ArrayIntersect( xarrLectors, teCompoundProgram.lectors, "This.id", "This.PrimaryKey" ) ) != undefined )
    };
    if( oContext.bActiveEducationPlan )
    {
        oContext.SetProperty( "iEducationPlanID", catEducationPlan.id.Value );
        oContext.SetProperty( "sEducationPlanState", catEducationPlan.state_id.Value );
        oContext.SetProperty( "sEducationPlanStateName", catEducationPlan.state_id.ForeignElem.name.Value );
    }


    oRes.context = oContext;

    return oRes;
}

/**
 * @function GetCompoundProgramFiles
 * @memberof Websoft.WT.Event
 * @description Получения списка материалов по модульной программе.
 * @param {bigint} iCompoundProgramID - ID модульной программы
 * @returns {WTFileResult}
 */
function GetCompoundProgramFiles( iCompoundProgramID )
{
    return tools.call_code_library_method( 'libMain', 'get_object_files', [ iCompoundProgramID ] );
}

function check_access_education_plan( fldEducationPlan, iPersonID )
{
    switch( fldEducationPlan.type )
    {
        case "group":
            return ArrayOptFirstElem( XQuery( "for $elem in group_collaborators where $elem/group_id = " + fldEducationPlan.object_id + " and $elem/collaborator_id = " + iPersonID + " return $elem" ) ) != undefined;
            break;
        case "collaborator":
            return fldEducationPlan.person_id == iPersonID;
    }
    return false;
}

/**
 * @typedef {Object} ContinuousLearningStat
 * @property {bool} access – У сотрудника есть доступ к плану.
 * @property {string} type – тип плана обучения.
 * @property {string} status_name – наименование статуса.
 * @property {date} plan_date – планируемая дата начала.
 * @property {date} finish_date – дата завершения.
 * @property {number} count – количество активностей.
 * @property {number} finished_count – завершено активностей.
 * @property {number} passed_count – успешно завершено активностей.
 * @property {real} finished_procent – процент завершеных активностей.
 * @property {real} passed_procent – процент успешно завершеных активностей.
 */
/**
 * @typedef {Object} ReturnContinuousLearningStat
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {ContinuousLearningStat} context – Контекст учебного плана.
 */
/**
 * @function GetContinuousLearningStat
 * @memberof Websoft.WT.Event
 * @description Получение контекста по учебному плану.
 * @param {bigint} iPersonID - ID сотрудника.
 * @param {bigint} iEducationPlanID - ID учебного плана.
 * @param {bigint} [iProgramID] - ID этапа учебного плана.
 * @returns {ReturnContinuousLearningStat}
 */
function GetContinuousLearningStat( iPersonID, iEducationPlanID, iProgramID )
{
    return get_continuous_learning_stat( iPersonID, iEducationPlanID, iProgramID );
}
function get_continuous_learning_stat( iPersonID, iEducationPlanID, iProgramID, oParams )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    var bCheckCompleteActivity = false;
    try
    {
        bCheckCompleteActivity = tools_web.is_true( oParams.GetOptProperty( "bCheckCompleteActivity", false ) );
    }
    catch( _zzz )
    {
        bCheckCompleteActivity = tools_web.is_true( oParams );
        oParams = { "bCheckCompleteActivity": bCheckCompleteActivity };
    }

    var oContext = {
        access: false,
        type: "",
        count: 0,
        finished_count: 0,
        finished_procent: 0.0,
        passed_count: 0,
        passed_procent: 0.0,
        status_name: "",
        plan_date: "",
        finish_date: ""
    };

    var iProgramID;
    try
    {
        iProgramID = OptInt( iProgramID );
    }
    catch(_dersl)
    {
        iProgramID = undefined;
    }

    var fldEducationPlan = get_education_plan_by_person( iEducationPlanID, iPersonID );
    if (fldEducationPlan == null)
    {
        oRes.error = 2;
        oRes.errorText = StrReplace(StrReplace(
            i18n.t( 'nenaydenoplana' ),
            "{PARAM1}", iEducationPlanID), "{PARAM2}", iPersonID);
        return oRes;
    }
    oContext.type = fldEducationPlan.type.Value;
    oContext.access = check_access_education_plan( fldEducationPlan, iPersonID );

    var teEducationPlan = tools.open_doc( fldEducationPlan.id.Value ).TopElem;

    oContext.status_name = ( teEducationPlan.state_id.HasValue ? teEducationPlan.state_id.ForeignElem.name.Value : "" );
    oContext.plan_date = teEducationPlan.plan_date.Value;
    oContext.finish_date = teEducationPlan.finish_date.Value;
    var xqItem;
    var aPrograms = [];
    var iHierNum = 0;

    function get_hier_prgs(iParent)
    {
        iHierNum++;
        if( iHierNum > 50 )
        {
            return false;
        }
        aTmp = ArraySelect( teEducationPlan.programs, "This.parent_progpam_id == " + iParent );

        for (_vrem in aTmp)
        {
            if( ArrayOptFind( aPrograms, "This.id == _vrem.id" ) != undefined )
            {
                continue;
            }
            aPrograms.push( _vrem );
            get_hier_prgs(_vrem.id);
        }
    }

    if( oContext.access || teEducationPlan.type == "collaborator" )
    {
        iCheckPersonID = ( !oContext.access ? teEducationPlan.person_id : iPersonID )
        if (iProgramID == undefined)
        {
            aPrograms = teEducationPlan.programs;
        }
        else
        {
            itemTask = ArrayOptFind(teEducationPlan.programs, "This.id == " + iProgramID);
            if (itemTask!=undefined)
            {
                aPrograms = ArrayUnion(aPrograms, itemTask);
                get_hier_prgs( iProgramID );
            }
        }


        for ( itemTask in ArraySelect( aPrograms, "filterActivity(This, 'activity')" ) )
        {
            if ( itemTask.type == "education_program" )
            {
                for ( _v in tools.xquery( "for $elem in education_program_education_methods where $elem/education_program_id = " + itemTask.object_id + " return $elem/Fields('type', 'education_method_id', 'education_method_name')" ) )
                {
                    cloneItem = itemTask.Clone();
                    if ( _v.type == "course" )
                    {
                        cloneItem.type = "course";
                        _vc = ArrayOptFirstElem( tools.xquery( "for $elem in education_methods where $elem/id = " + _v.education_method_id + " return $elem/Fields('course_id')" ) );
                        if ( _vc != undefined )
                        {
                            cloneItem.object_id = _vc.course_id;
                            cloneItem.name = _v.education_method_name;
                        }
                    }
                    else
                    {
                        cloneItem.type = "education_method";
                        cloneItem.object_id = _v.education_method_id;
                        cloneItem.education_method_id = _v.education_method_id;
                        cloneItem.name = _v.education_method_name;
                    }
                    xqItem = get_activity_by_task( fldEducationPlan.id.Value, teEducationPlan, cloneItem, iCheckPersonID, oParams );
                    oContext.count++;
                    if (xqItem == null || xqItem == undefined)
                    {
                        continue;
                    }

                    if (tools_web.is_true(xqItem.GetOptProperty('finished')))
                    {
                        oContext.finished_count++;
                    }
                    if (tools_web.is_true(xqItem.GetOptProperty('passed')))
                    {
                        oContext.passed_count++;
                    }
                }
            }
            else
            {
                xqItem = get_activity_by_task( fldEducationPlan.id.Value, teEducationPlan, itemTask, iCheckPersonID, oParams )
                oContext.count++;
                if (xqItem == null || xqItem == undefined)
                {
                    continue;
                }

                if (tools_web.is_true(xqItem.GetOptProperty('finished')))
                {
                    oContext.finished_count++;
                }
                if (tools_web.is_true(xqItem.GetOptProperty('passed')))
                {
                    oContext.passed_count++;
                }
            }
        }
    }
    if ( oContext.count > 0 )
    {
        oContext.finished_procent = Real( oContext.finished_count ) * 100.0 / Real( oContext.count );
    }
    if ( oContext.count > 0 )
    {
        oContext.passed_procent = Real( oContext.passed_count ) * 100.0 / Real( oContext.count );
    }

    oContext.count = StrInt( oContext.count );
    oContext.finished_count = StrInt( oContext.finished_count );
    oContext.passed_count = StrInt( oContext.passed_count );
    oContext.finished_procent = StrReal( oContext.finished_procent, 1 );
    oContext.passed_procent = StrReal( oContext.passed_procent, 1 );


    oRes.context = oContext;

    return oRes;
}

function filterActivity(fldObject, sReturnType, bReturnTree, arrParentIDs)
{
    switch (sReturnType)
    {
        case "activity":
        {
            var bIsActivity = (
                fldObject.type.Value != 'folder'
                && fldObject.type.Value != 'notification_template'
                && fldObject.type.Value != 'material'
            );

            var bIsActivityMaterial = (
                fldObject.type.Value == 'material'
                &&
                ArrayOptFind(
                    ['blog', 'poll', 'document', 'resource', 'forum', 'chat'],
                    'This == fldObject.catalog_name.Value') == undefined
            );

            var bIsParent = true;
            if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined)
            {
                bIsParent = (ArrayOptFind(arrParentIDs, "fldObject.parent_progpam_id.Value == This") != undefined);
            }

            return bIsParent && (bIsActivity || bIsActivityMaterial);
        }
        case "stage":
        {
            if (IsArray(arrParentIDs) && ArrayOptFirstElem(arrParentIDs) != undefined)
            {
                var bIsParent = (
                    fldObject.parent_progpam_id.HasValue
                    && ArrayOptFind( arrParentIDs, "fldObject.parent_progpam_id.Value == This" ) != undefined
                );
            }
            else
            {
                var bIsParent = !fldObject.parent_progpam_id.HasValue
            }

            return (fldObject.type.Value == 'folder' || bReturnTree) && bIsParent && fldObject.type.Value != 'notification_template';
        }
        case "all":
        {
            return (fldObject.type.Value != 'notification_template');
        }
    }
    return false;
}
function get_activity_by_task( iEducationPlanID, teEducationPlan, Task, iPersonID, oParams )
{

    var bCheckCompleteActivity = tools_web.is_true( oParams.GetOptProperty( "bCheckCompleteActivity", false ) );

    var bAutoLaunch = tools_web.is_true( oParams.GetOptProperty( "bAutoLaunch", false ) );

    var oAddParam = { "bAutoLaunch": bAutoLaunch };

    try
    {
        teEducationPlan.Name
        var hasDocEP = true
    }
    catch (e)
    {
        var hasDocEP = false
    }

    iEducationPlanID = OptInt(iEducationPlanID);
    if (iEducationPlanID == undefined)
    {
        if (hasDocEP)
        {
            iEducationPlanID = teEducationPlan.id.Value;
        }
        else
        {
            throw i18n.t( 'neperedanainfo' );
        }
    }
    else if (!hasDocEP)
    {
        var docEducationPlan = tools.open_doc(iEducationPlanID);
        if (docEducationPlan == undefined)
        {
            throw StrReplace(i18n.t( 'nevozmozhnootkr' ), "{PARAM1}", iEducationPlanID);
        }

        teEducationPlan = docEducationPlan.TopElem;
    }

    var fldTask = OptInt(Task) != undefined ? ArrayOptFind(teEducationPlan.programs, "This.id.Value == Task") : Task;
    if (fldTask == undefined)
    {
        throw StrReplace(
            StrReplace(
                i18n.t( 'vplaneobucheniya' ), "{PARAM1}", iEducationPlanID
            ),
            "{PARAM2}",
            Task
        );
    }

    if (ObjectType(fldTask) != 'XmElem')
    {
        throw i18n.t( 'peredannyyargu' ) +
        "\r\n" + tools.object_to_text(fldTask, "json");
    }

    var xqItem = null;
    var xqItem_bis = null
    var sReqItem, sReqItem_bis;

    switch (fldTask.type.Value)
    {
        case "education_method":
        {
            xqItem = get_activity(
                "event_collaborator", fldTask.education_method_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
            );

            if (xqItem.xq_object == undefined)
            {
                return null;
            }

            xqItem.url = get_education_plan_activity_url( "event", xqItem.xq_object.event_id.Value, oAddParam );
            return xqItem;
        }
        case "course":
        {
            xqItem = get_activity("active_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object != undefined)
            {
                xqItem.url = get_education_plan_activity_url( "active_learning", xqItem.xq_object.id.Value, oAddParam );
                return xqItem;
            }
            else
            {
                xqItem_bis = get_activity("learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
                if (xqItem_bis.xq_object != undefined)
                {
                    xqItem_bis.url = bCheckCompleteActivity ? "" : get_education_plan_activity_url( "learning", xqItem_bis.xq_object.id.Value, oAddParam );
                    return xqItem_bis;
                }
                else
                {
                    return null;
                }
            }
        }
        case "assessment":
        {
            xqItem = get_activity("active_test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object != undefined)
            {
                xqItem.url = get_education_plan_activity_url( "active_test_learning", xqItem.xq_object.id.Value, oAddParam );
                return xqItem;
            }
            else
            {
                xqItem_bis = get_activity("test_learning", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);
                if ( xqItem_bis.xq_object != undefined && !xqItem_bis.passed && fldTask.object_id.OptForeignElem.is_open )
                {
//						var newTest = tools.activate_test_to_person({
//							"iPersonID": iPersonID,
//							"iAssessmentID": fldTask.object_id.Value,
//							"iEducationPlanID": iEducationPlanID
//						});

                    xqItem_bis.url = get_education_plan_activity_url( "assessment", fldTask.object_id.Value, oAddParam );
                    fldTask.result_object_id.Clear();
                    return xqItem_bis;
                }
                else if (xqItem_bis.xq_object != undefined)
                {
                    xqItem_bis.url = bCheckCompleteActivity ? "" : get_education_plan_activity_url( "test_learning", xqItem_bis.xq_object.id.Value, oAddParam );
                    return xqItem_bis;
                }
                else
                {
                    return null;
                }
            }
        }
        case "material":
        {
            switch (fldTask.catalog_name.Value)
            {
                case "document":
                case "resource":
                {
                    xqItem = get_activity(
                        "object_data", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
                    );

                    if (xqItem.xq_object == undefined)
                    {
                        var stateDesc = common.education_learning_states.GetOptChildByKey(fldTask.state_id.Value);
                        xqItem = {
                            "catalog": "resource",
                            "url": get_education_plan_activity_url( fldTask.catalog_name.Value, fldTask.object_id.Value, oAddParam ),
                            "name": fldTask.name.Value,
                            "status": fldTask.state_id.Value,
                            "status_name": (stateDesc != undefined ? stateDesc.name.Value : i18n.t( 'nenaznacheno' )),
                            "xq_object": undefined,
                            "finished": (fldTask.state_id.Value > 1),
                            "passed": (fldTask.state_id.Value == 4)
                        };
                    }
                    else
                    {
                        stateDesc = common.education_learning_states.GetOptChildByKey(5);
                        xqItem.url = get_education_plan_activity_url( fldTask.catalog_name.Value, fldTask.object_id.Value, oAddParam );
                        xqItem.name = fldTask.name.Value;
                        xqItem.status = 5;
                        xqItem.status_name = (stateDesc != undefined ? stateDesc.name.Value : "");
                    }
                    return xqItem;
                }
                case "library_material":
                {
                    xqItem = get_activity(
                        "library_material_viewing", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value
                    );

                    if (xqItem.xq_object == undefined)
                    {
                        return null;
                    }

                    xqItem.url = get_education_plan_activity_url( "library_material", xqItem.xq_object.material_id.Value, oAddParam );
                    //toLog(xqItem.name + " (" + fldTask.id.Value + ") ---> " + xqItem.url)
                    return xqItem;
                }
                case "poll":
                {
                    xqItem = get_activity("poll_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

                    if (xqItem.xq_object == undefined)
                    {
                        return null;
                    }

                    xqItem.url = get_education_plan_activity_url( "poll_result", xqItem.xq_object.id.Value, oAddParam );
                    return xqItem;
                }
                default:
                {
                    throw StrReplace(i18n.t( 'neobsluzhivaemy' ), "{PARAM1}", fldTask.catalog_name.Value);
                }
            }

            break;
        }
        case "learning_task":
        {
            xqItem = get_activity("learning_task_result", fldTask.object_id.Value, iPersonID, iEducationPlanID, teEducationPlan.create_date.Value);

            if (xqItem.xq_object == undefined)
            {
                return null;
            }

            xqItem.url = get_education_plan_activity_url( "learning_task_result", xqItem.xq_object.id.Value, oAddParam );
            return xqItem;
        }
        case "folder":
        {
            return null;
        }
        case "notification_template":
        {
            return null;
        }
        default:
        {
            throw StrReplace(i18n.t( 'neobsluzhivaemy_1' ), "{PARAM1}", fldTask.type.Value);
        }
    }
}

function get_activity(catalog, object_id, person_id, education_plan_id, start_date)
{
    var bConstFilterByEducationPlan = false
    var sFilterByEducationPlan =
        bConstFilterByEducationPlan && OptInt(education_plan_id) != undefined
            ? " $elem/education_plan_id=" + XQueryLiteral(education_plan_id) + " and "
            : "";

    // var dStartDate = OptDate(start_date);
    // var sFilterByStartDate = (dStartDate == undefined) ? "" : "$elem/[{PARAM}]>=" + XQueryLiteral(DateNewTime(dStartDate)) + " and ";

    var xqItem, sReqItem, arrItems, arrPassedItems;
    var oRetObject = {
        "catalog": "",
        "url": "",
        "name": "",
        "status": "",
        "status_name": i18n.t( 'nenaznachalsya' ),
        "xq_object": undefined,
        "started": false,
        "finished": false,
        "passed": false
    };
    switch (catalog)
    {
        case "event_collaborator":
        {
            sReqItem = "for $elem in event_collaborators where " + sFilterByEducationPlan +
                " $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/education_method_id=" + XQueryLiteral(object_id) +
                " and $elem/collaborator_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_date descending return $elem";

            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);
            //toLog(sReqItem)

            var bIsAssist =
                xqItem != undefined
                    ? tools_web.is_true(
                        ArrayOptFirstElem(
                            XQuery("for $elem in event_results " +
                                " where $elem/event_id=" + XQueryLiteral(xqItem.event_id.Value) +
                                " and $elem/person_id=" + XQueryLiteral(person_id) +
                                " return $elem/Fields('is_assist')"),
                            { is_assist: false }
                        ).is_assist)
                    : false;

            oRetObject.catalog = "event_collaborator";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.name.Value;
                oRetObject.status = xqItem.status_id.Value;
                oRetObject.started = (xqItem.start_date.HasValue && xqItem.start_date >= Date());
                oRetObject.finished = (xqItem.status_id.Value == 'close');
                oRetObject.passed = (xqItem.status_id.Value == 'close' && bIsAssist);
                if (xqItem.status_id.HasValue)
                {
                    var fldStatus = xqItem.status_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "active_learning":
        {
            sReqItem = "for $elem in active_learnings " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/course_id = " + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_usage_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "active_learning";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.course_name.Value;
                oRetObject.status = xqItem.state_id.Value;
                oRetObject.started = (xqItem.state_id.Value > 0);
                oRetObject.finished = (xqItem.state_id.Value > 2);
                oRetObject.passed = (xqItem.state_id.Value == 4);
                if (xqItem.state_id.HasValue)
                {
                    var fldStatus = xqItem.state_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "learning":
        {
            sReqItem =
                "for $elem in learnings " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/course_id = " + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_usage_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            arrPassedItems = ArraySelectByKey(arrItems, 4, "state_id");
            xqItem = ArrayOptFirstElem(arrPassedItems);
            if(xqItem == undefined)
                xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "learning";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.course_name.Value;
                oRetObject.status = xqItem.state_id.Value;
                oRetObject.started = (xqItem.state_id.Value > 0);
                oRetObject.finished = (xqItem.state_id.Value > 2);
                oRetObject.passed = (xqItem.state_id.Value == 4);
                if (xqItem.state_id.HasValue)
                {
                    var fldStatus = xqItem.state_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "active_test_learning":
        {
            sReqItem = "for $elem in active_test_learnings " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/assessment_id = " + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_usage_date descending return $elem";

            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "active_test_learning";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.assessment_name.Value;
                oRetObject.status = xqItem.state_id.Value;
                oRetObject.started = (xqItem.state_id.Value > 0);
                oRetObject.finished = (xqItem.state_id.Value > 2);
                oRetObject.passed = (xqItem.state_id.Value == 4);
                if (xqItem.state_id.HasValue)
                {
                    var fldStatus = xqItem.state_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;

        }
        case "test_learning":
        {
            sReqItem = "for $elem in test_learnings " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/assessment_id = " + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_usage_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            arrPassedItems = ArraySelectByKey(arrItems, 4, "state_id");
            xqItem = ArrayOptFirstElem(arrPassedItems);
            if(xqItem == undefined)
                xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "test_learning";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.assessment_name.Value;
                oRetObject.status = xqItem.state_id.Value;
                oRetObject.started = (xqItem.state_id.Value > 0);
                oRetObject.finished = (xqItem.state_id.Value > 2);
                oRetObject.passed = (xqItem.state_id.Value == 4);
                if (xqItem.state_id.HasValue)
                {
                    var fldStatus = xqItem.state_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "library_material_viewing":
        {
            sReqItem = "for $elem in library_material_viewings " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/material_id=" + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/last_viewing_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "library_material_viewing";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.material_name.Value;
                oRetObject.status = xqItem.state_id.Value;
                oRetObject.started = (xqItem.state_id.Value != 'plan');
                oRetObject.finished = (xqItem.state_id.Value == 'finished');
                oRetObject.passed = (xqItem.state_id.Value == 'finished');
                if (xqItem.state_id.HasValue)
                {
                    var fldStatus = xqItem.state_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "object_data":
        {
            sReqItem = "for $elem in object_datas " +
                " where $elem/object_id = " + XQueryLiteral(education_plan_id) +
                " and $elem/sec_object_id=" + XQueryLiteral(person_id) +
                " and contains($elem/data_str, '" + XQueryLiteral(object_id) + "')" +
                " return $elem/Fields('id')";

            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "object_data";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.status = xqItem.status_id.Value;
                oRetObject.started = true;
                oRetObject.finished = true;
                oRetObject.passed = true;
                if (xqItem.status_id.HasValue)
                {
                    fldStatus = xqItem.status_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "learning_task_result":
        {
            sReqItem = "for $elem in learning_task_results " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/learning_task_id=" + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/start_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "learning_task_result";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.learning_task_name.Value;
                oRetObject.status = xqItem.status_id.Value;
                oRetObject.started = (xqItem.status_id.Value != 'assign');
                oRetObject.finished = (xqItem.status_id.Value != 'assign' && xqItem.status_id.Value != 'process' && xqItem.status_id.Value != 'evaluation');
                oRetObject.passed = (xqItem.status_id.Value == 'success');
                if (xqItem.status_id.HasValue)
                {
                    var fldStatus = xqItem.status_id.OptForeignElem;
                    if (fldStatus != undefined)
                    {
                        oRetObject.status_name = fldStatus.name.Value;
                    }
                }
            }
            return oRetObject;
        }
        case "poll_result":
        {
            sReqItem = "for $elem in poll_results " +
                " where $elem/education_plan_id=" + XQueryLiteral(education_plan_id) +
                " and $elem/poll_id=" + XQueryLiteral(object_id) +
                " and $elem/person_id=" + XQueryLiteral(person_id) +
                " order by $elem/create_date descending return $elem";

            //toLog(sReqItem)
            arrItems = XQuery(sReqItem);
            xqItem = ArrayOptFirstElem(arrItems);

            oRetObject.catalog = "poll_result";
            oRetObject.xq_object = xqItem;
            if (xqItem != undefined)
            {
                oRetObject.name = xqItem.name.Value;
                oRetObject.status = xqItem.status.Value;
                oRetObject.started = (xqItem.status.HasValue && xqItem.status.Value != 0);
                oRetObject.finished = (xqItem.is_done);
                oRetObject.passed = (xqItem.is_done);
            }
            return oRetObject;
        }
        default:
        {
            throw StrReplace(i18n.t( 'neobsluzhivaemy_2' ), "{PARAM1}", catalog);
        }
    }
}
function get_education_plan_activity_url(sCatalog, iObjectID, oAddParam)
{
    if (OptInt(iObjectID) == undefined)
    {
        return "";
    }

    if (oAddParam == undefined || (oAddParam != undefined && !(DataType(oAddParam) == "object" || ObjectType(oAddParam) == "JsObject")))
    {
        oAddParam = null;
    }

    if (sCatalog == "" || sCatalog == null)
    {
        var objDoc = tools.open_doc(iObjectID);
        if (objDoc == undefined)
        {
            return "";
        }

        sCatalog = objDoc.TopElem.Name;
    }

    var bAutoLaunch = true;
    if ( oAddParam != null )
    {
        bAutoLaunch = tools_web.is_true( oAddParam.GetOptProperty( "bAutoLaunch", false ) );
    }

    switch (sCatalog)
    {
        case "library_material":
        case "resource":
        {
            return tools_web.get_object_source_url("resource", iObjectID, { type: "library_material" });
        }
        case "active_test_learning":
        {
            if ( bAutoLaunch )
            {
                return tools_web.get_mode_clean_url(null, iObjectID);
            }

            catLearning = ArrayOptFirstElem( XQuery( "for $elem in active_test_learnings where $elem/id = " + iObjectID + " return $elem" ) );
            if( catLearning != undefined )
            {
                return ( "test_launch.html?structure=first&assessment_id=" + catLearning.assessment_id + "&object_id=" + catLearning.id + "&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) ) )
            }
            else
            {
                return "";
            }

        }
        case "test_learning":
        {
            if ( bAutoLaunch )
            {
                return tools_web.get_mode_clean_url(null, iObjectID);
            }

            catLearning = ArrayOptFirstElem( XQuery( "for $elem in test_learnings where $elem/id = " + iObjectID + " return $elem" ) );
            if( catLearning != undefined )
            {
                return ( "test_launch.html?structure=first&assessment_id=" + catLearning.assessment_id + "&object_id=" + catLearning.id + "&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) ) )
            }
            else
            {
                return "";
            }

        }
        case "active_learning":
        {
            if ( bAutoLaunch )
            {
                return tools_web.get_mode_clean_url(null, iObjectID);
            }

            catLearning = ArrayOptFirstElem( XQuery( "for $elem in active_learnings where $elem/id = " + iObjectID + " return $elem" ) );
            if( catLearning != undefined )
            {
                catCourse = catLearning.course_id.OptForeignElem;
                try
                {
                    Session = CurRequest.Session;
                }
                catch( ex )
                {
                    Session = null;
                }
                return ( catCourse != undefined && catCourse.view_type == "single" && Session != null ? ( "course_launch.html?object_id=" + catLearning.id + "&course_id=" + catLearning.course_id + "&sid=" + tools_web.get_sum_sid( catLearning.course_id, Session.sid ) ) : ( "course_launch.html?structure=first&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) )  ) );
            }
            else
            {
                return "";
            }

        }
        case "learning":
        {
            if ( bAutoLaunch )
            {
                return tools_web.get_mode_clean_url(null, iObjectID);
            }

            catLearning = ArrayOptFirstElem( XQuery( "for $elem in learnings where $elem/id = " + iObjectID + " return $elem" ) );
            if( catLearning != undefined )
            {
                catCourse = catLearning.course_id.OptForeignElem;
                try
                {
                    Session = CurRequest.Session;
                }
                catch( ex )
                {
                    Session = null;
                }
                return ( catCourse != undefined && catCourse.view_type == "single" && Session != null ? ( "course_launch.html?object_id=" + catLearning.id + "&course_id=" + catLearning.course_id + "&sid=" + tools_web.get_sum_sid( catLearning.course_id, Session.sid ) ) : ( "course_launch.html?structure=first&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) )  ) );
            }
            else
            {
                return "";
            }
        }
        case "poll_result":
        {
            return "/poll_launch.html?object_id=" + iObjectID;
        }
        case "document":
        {
            return tools_web.doc_link(iObjectID);
        }
        default:
        {
            return tools_web.get_mode_clean_url(null, iObjectID);
        }
    }

}
function get_education_plan_by_person( iObjectID, iPersonID )
{
    xqLastEducationPlan = null;
    docObject = tools.open_doc(iObjectID);
    if (docObject == undefined)
    {
        throw StrReplace(i18n.t( 'nevozmozhnootkr_1' ), "{PARAM1}", iObjectID);
    }
    if (docObject.TopElem.Name == 'compound_program' )
    {
        var sGroupsIds = ArrayMerge(
            XQuery("for $elem in group_collaborators " +
                " where $elem/collaborator_id=" + XQueryLiteral(iPersonID) +
                " return $elem/Fields('group_id')"),
            "This.group_id.Value", ",");


        var xqEducationPlans = XQuery("for $elem in education_plans " +
            " where $elem/compound_program_id=" + XQueryLiteral(iObjectID) +
            " and ( " + ( sGroupsIds != "" ? "MatchSome($elem/object_id, (" + sGroupsIds + ")) or " : "" ) + " $elem/person_id =  " + iPersonID + " ) " +
            " order by $elem/create_date descending " +
            " return $elem");

        xqLastEducationPlan =
            ArrayOptFirstElem(xqEducationPlans) != undefined
                ? ArrayMax(xqEducationPlans, "This.create_date.Value")
                : null;
    }
    else if (docObject.TopElem.Name == 'education_plan')
    {
        xqLastEducationPlan = ArrayOptFirstElem(XQuery("for $elem in education_plans " +
            " where $elem/id=" + XQueryLiteral(iObjectID) +
            " return $elem"));
        if ( xqLastEducationPlan == undefined )
        {
            xqLastEducationPlan = null;
        }
    }

    return xqLastEducationPlan;
}

function GetEducationPlanProgramsByParam( iCompoundProgramID, iPersonID, bReturnTree, iParentID, sReturnType, oParams )
{
    var bCheckCompleteActivity = false; // проверять также наличие завершенных активностей

    try
    {
        if ( !oParams.HasProperty( "bCheckCompleteActivity" ) )
        {
            oParams.SetProperty( "bCheckCompleteActivity", false );
        }
    }
    catch( _zzz )
    {
        oParams = { "bCheckCompleteActivity": false };
    }

    var fldLastEducationPlan = get_education_plan_by_person( iCompoundProgramID, iPersonID );
    if (fldLastEducationPlan == null)
    {
        return {
            error: 1,
            errorMessage: StrReplace(StrReplace(
                i18n.t( 'nenaydenoplana' ),
                "{PARAM1}", iCompoundProgramID), "{PARAM2}", iPersonID
            ),
            array: []
        }
    }

    return GetMarathonEducationPlanPrograms( fldLastEducationPlan.id.Value, null, iPersonID, bReturnTree, iParentID, sReturnType, oParams, undefined );
}
function GetMarathonEducationPlanPrograms( iEducationPlanID, teEducationPlan, iPersonID, bReturnTree, iParentID, sReturnType, oParams, oFilter )
{

    function fnRecursion(iParentIDRec, array)
    {
        array.push(iParentIDRec);

        for (itemNodes in ArraySelect(teEducationPlan.programs, "This.parent_progpam_id.Value == OptInt(iParentIDRec)"))
        {

            if (itemNodes.type.Value == 'folder')
            {
                array.push(itemNodes.id.Value);
                fnRecursion(itemNodes.id.Value, array);
            }
        }
    }

    if (sReturnType == null || sReturnType == undefined || sReturnType == "")
    {
        sReturnType = "activity";
    }

    bReturnTree = tools_web.is_true( bReturnTree );

    var oRes = {
        error: 0,
        errorMessage: "",
        array: []
    }

    try
    {
        teEducationPlan.Name
        var hasDocEP = true
    }
    catch (e)
    {
        var hasDocEP = false
    }

    iEducationPlanID = OptInt(iEducationPlanID);
    if (iEducationPlanID == undefined)
    {
        if (hasDocEP)
        {
            iEducationPlanID = teEducationPlan.id.Value;
        }
        else
        {
            oRes.error = 1;
            oRes.errorMessage = i18n.t( 'neperedanainfo' );
            return oRes;
        }
    }
    else if (!hasDocEP)
    {
        var docEducationPlan = tools.open_doc(iEducationPlanID);
        if (docEducationPlan == undefined)
        {
            oRes.error = 1;
            oRes.errorMessage = StrReplace(i18n.t( 'nevozmozhnootkr' ), "{PARAM1}", iEducationPlanID);
            return oRes;
        }
        teEducationPlan = docEducationPlan.TopElem;
    }

    var bCheckCompleteActivity = false;
    try
    {
        bCheckCompleteActivity = tools_web.is_true( oParams.GetOptProperty( "bCheckCompleteActivity", false ) );
    }
    catch( _zzz )
    {
        bCheckCompleteActivity = tools_web.is_true( oParams );
        oParams = { "bCheckCompleteActivity": bCheckCompleteActivity };
    }

    if (oFilter == undefined)
    {
        switch(sReturnType)
        {
            case "activity":
            {
                var bClearParent = true
                break;
            }
            case "stage":
            {
                var bClearParent = true
                break;
            }
            case "all":
            {
                var bClearParent = false
                break;
            }
            default:
            {
                var bClearParent = false
            }
        }
        var arrParentIDs = [iParentID];
        if(bReturnTree && iParentID != undefined && iParentID != null && iParentID != "")
        {
            fnRecursion(OptInt(iParentID), arrParentIDs);

            arrParentIDs =  ArraySelectDistinct(arrParentIDs);
        }

        var arrParentIDActive = ArrayExtract(ArraySelect(arrParentIDs, "OptInt(This) != undefined"), "OptInt(This)");
        var arrProgramCollection = ArraySelect(teEducationPlan.programs, "filterActivity(This, sReturnType, bReturnTree, arrParentIDActive)");
        var oActivity, sUrl;
        for(itemProgram in arrProgramCollection)
        {
            if ( itemProgram.type == "education_program" )
            {
                for ( _v in tools.xquery( "for $elem in education_program_education_methods where $elem/education_program_id = " + itemProgram.object_id + " return $elem/Fields('type', 'education_method_id', 'education_method_name')" ) )
                {
                    cloneItem = itemProgram.Clone();
                    cloneItem.id += Random( 99999999, 1000000000 );
                    if ( _v.type == "course" )
                    {
                        cloneItem.type = "course";
                        _vc = ArrayOptFirstElem( tools.xquery( "for $elem in education_methods where $elem/id = " + _v.education_method_id + " return $elem/Fields('course_id')" ) );
                        if ( _vc != undefined )
                        {
                            cloneItem.object_id = _vc.course_id;
                            cloneItem.name = _v.education_method_name;
                        }
                    }
                    else
                    {
                        cloneItem.type = "education_method";
                        cloneItem.object_id = _v.education_method_id;
                        cloneItem.education_method_id = _v.education_method_id;
                        cloneItem.name = _v.education_method_name;
                    }
                    oActivity = get_activity_by_task( teEducationPlan, teEducationPlan, cloneItem, ( teEducationPlan.type == "collaborator" ? teEducationPlan.person_id : iPersonID ), oParams );
                    oRes.array.push( cast_EducationPlanProgram( cloneItem, oActivity, ( bClearParent && (itemProgram.parent_progpam_id.Value == OptInt(iParentID)) ), teEducationPlan, oParams ) );
                }
            }
            else
            {
                oActivity = get_activity_by_task( teEducationPlan, teEducationPlan, itemProgram, ( teEducationPlan.type == "collaborator" ? teEducationPlan.person_id : iPersonID ), oParams );
                oRes.array.push( cast_EducationPlanProgram( itemProgram, oActivity, ( bClearParent && (itemProgram.parent_progpam_id.Value == OptInt(iParentID)) ), teEducationPlan, oParams ) );
            }
        }
        oRes.array = FuncStampPassed( oRes.array, (sReturnType != "stage" ? null : teEducationPlan), iPersonID );
    }
    else
    {
        var oActivity, sUrl;

        for (itemProgram in teEducationPlan.programs)
        {
            if (checkFilter(itemProgram, oFilter) == false)
            {
                continue;
            }

            oActivity = get_activity_by_task( teEducationPlan, teEducationPlan, itemProgram, ( teEducationPlan.type == "collaborator" ? teEducationPlan.person_id : iPersonID ), oParams );
            oRes.array.push(
                cast_EducationPlanProgram( itemProgram, oActivity, true, teEducationPlan, oParams )
            );
        }
    }

    return oRes;
}

function FuncStampPassed( oRetParam, tePlan, iPersonID )
{
    try
    {
        _cur_id = OptInt(GetActualModule(null, iPersonID, tePlan, true).id,0);
    }
    catch (_no_actual)
    {
        _cur_id = 0;
    }
    if (tePlan==null)
    {
        for (_oObj in oRetParam)
        {
            _aObjs = ArraySelect(oRetParam, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            _aFldrs = ArraySelect(oRetParam, "This.type == 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            for (_fldr in _aFldrs)
            {
                _aObjs = ArrayUnion(_aObjs, ArraySelect(oRetParam, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
            }
            _oObj.tasks = ArrayCount(_aObjs);
            _oObj.finished = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('finished'))"));
            _oObj.passed = ArrayCount(ArraySelect(_aObjs, "This != null && tools_web.is_true(This.GetOptProperty('passed'))"));
            _oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
        }
    }
    else
    {
        for (_oObj in oRetParam)
        {
            _aObjs = ArraySelect(tePlan.programs, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            _aFldrs = ArraySelect(tePlan.programs, "This.type == 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_oObj.id, 999));
            for (_fldr in _aFldrs)
            {
                _aObjs = ArrayUnion(_aObjs, ArraySelect(tePlan.programs, "This.type != 'folder' && OptInt(This.parent_progpam_id,0) == " + OptInt(_fldr.id, 999)));
            }
            _oObj.tasks = ArrayCount(_aObjs);
            if (_oObj.tasks>0)
            {
                _aActs = ArrayExtract(_aObjs, "get_activity_by_task( tePlan, tePlan, This, ( tePlan.type == 'collaborator' ? tePlan.person_id : iPersonID ), ({ bCheckCompleteActivity: true }) )");
                _oObj.finished = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && This.xq_object != undefined && tools_web.is_true(This.GetOptProperty('finished'))")))/Real(_oObj.tasks),2);
                _oObj.passed = StrReal(Real(100.0 * ArrayCount(ArraySelect(_aActs, "This != null && This.xq_object != undefined && tools_web.is_true(This.GetOptProperty('passed'))")))/Real(_oObj.tasks),2);
            }
            else
            {
                _oObj.finished = 0;
                _oObj.passed = 0;
            }
            _oObj.is_actual = (_cur_id == OptInt(_oObj.id,999));
        }
    }
    return oRetParam;
}
function cast_EducationPlanProgram( fldProgram, oActivity, bClearParent, teEducationPlan, oParams )
{
    var stateDesc = common.education_learning_states.GetOptChildByKey(fldProgram.state_id.Value);
    var teObject = undefined;

    if (fldProgram.object_id.HasValue)
    {
        try
        {
            teObject = fldProgram.object_id.OptForeignElem;
        }
        catch (e)
        { }
    }

    var sNameField = "name";
    if (teObject != undefined)
    {
        var fldObjectType = ArrayOptFind(common.exchange_object_types, "This.name.Value == teObject.Name");
        sNameField = fldObjectType != undefined ? fldObjectType.disp_name.Value : "name";
    }
    var bAccess = true;

    if( fldProgram.plan_date.HasValue && ( !teEducationPlan.ChildExists( "strong_date_control" ) || tools_web.is_true( teEducationPlan.Child( "strong_date_control" ) ) ) )
    {
        if( fldProgram.plan_date > Date() )
        {
            bAccess = false
        }
        else
        {
            var dStartPlanDate = teEducationPlan.plan_date.HasValue ? teEducationPlan.plan_date : teEducationPlan.create_date;
            if( fldProgram.delay_days.HasValue && dStartPlanDate.HasValue && DateOffset( dStartPlanDate.Value, fldProgram.delay_days*86400 ) > Date() )
            {
                bAccess = false;
            }
        }
    }
    if( fldProgram.completed_parent_programs.ChildNum > 0 && ArrayOptFind( fldProgram.completed_parent_programs, "teEducationPlan.programs.ChildByKeyExists( This.program_id.Value ) && teEducationPlan.programs.GetOptChildByKey( This.program_id.Value ).state_id < 2" ) != undefined )
    {
        bAccess = false;
    }
    //toLog(fldProgram.name.Value + " (" + fldProgram.id.Value + "/" + fldProgram.type.Value + ") ---> " + (oActivity != null))
    var sActivityURL = "";
    if( bAccess )
    {
        switch (fldProgram.type.Value)
        {
            case "folder":
            {
                sActivityURL = "";
                break;
            }
            case "material":
            {
                sActivityURL = get_education_plan_activity_url( fldProgram.catalog_name.Value, fldProgram.object_id.Value, oParams );
                break;
            }
            default:
            {
                sActivityURL = get_education_plan_activity_url( fldProgram.type.Value, fldProgram.object_id.Value, oParams );
                break;
            }
        }
    }
    var sActivityName = "";
    var sActivityStatus = "";
    var sActivityStatusName = fldProgram.type.Value == 'folder' ? "" : i18n.t( 'nenaznachen' );
    var sProgramUrl = "";
    if ( oActivity != null )
    {
        if ( oActivity.url != "" && bAccess )
        {
            sActivityURL = oActivity.url;
        }
        sActivityName = oActivity.name;
        sActivityStatus = oActivity.status;
        sActivityStatusName = oActivity.status_name;
        if( oActivity.xq_object != undefined && fldProgram.type == "learning_task" )
        {
            sProgramUrl = get_object_link( null, oActivity.xq_object.id );
        }
        else
        {
            sProgramUrl = get_education_plan_program_link( fldProgram );
        }
    }
    if (sActivityURL != "" && !StrBegins(sActivityURL, "/"))
    {
        sActivityURL = "/" + sActivityURL;
    }
    if ( sActivityURL != "" && !StrContains( sActivityURL , "education_plan_id" ) && StrContains( sActivityURL , "/_wt/" ) )
    {
        sActivityURL = sActivityURL + "/education_plan_id/" + teEducationPlan.id;
    }
    else if ( sActivityURL != "" && !StrContains( sActivityURL , "education_plan_id" ) && StrContains( sActivityURL , "?" ) && StrContains( sActivityURL , "=" ) )
    {
        sActivityURL = sActivityURL + "&education_plan_id=" + teEducationPlan.id;
    }

    //toLog(fldProgram.name.Value + " (" + fldProgram.id.Value + "/" + fldProgram.type.Value + ") ---> " + sActivityURL)

    var bIsExpire = false;
    if (fldProgram.finish_date.HasValue)
    {
        bIsExpire = (Date() > fldProgram.finish_date.Value);
    }
    else if (fldProgram.plan_date.HasValue && fldProgram.type.Value != "folder")
    {
        bIsExpire = (Date() > DateOffset(fldProgram.plan_date.Value, 86400));
    }

    var objRet = {
        PrimaryKey: String(fldProgram.id.Value),
        id: String(fldProgram.id.Value),
        parent_id: (bClearParent ? "": String(fldProgram.parent_progpam_id.Value)),
        parent_progpam_id: (fldProgram.parent_progpam_id.HasValue ? fldProgram.parent_progpam_id.Value : ""),
        has_children: (fldProgram.type.Value == 'folder'),
        name: fldProgram.name.Value,
        type: fldProgram.type.Value,
        type_name: get_education_plan_program_type_name( fldProgram ),
        group_status: String(fldProgram.state_id.Value),
        status: cast_StatusCode(oActivity, fldProgram),
        status_name: cast_Status(oActivity, fldProgram),
        comment: fldProgram.comment.Value,
        object_catalog: fldProgram.catalog_name.Value,
        object_id: String(fldProgram.object_id.Value),
        object_name: (teObject != undefined ? teObject.Child(sNameField).Value : ""),
        activity_catalog: fldProgram.result_type.Value,
        activity_id: String(fldProgram.result_object_id.Value),
        activity_name: sActivityName,
        activity_url: sActivityURL,
        activity_status: sActivityStatus,
        program_url: sProgramUrl,
        create_date: fldProgram.create_date.Value,
        plan_date: fldProgram.plan_date.Value,
        plan_date_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ fldProgram.plan_date.Value ] ).date_str,
        finish_date: fldProgram.finish_date.Value,
        finish_date_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ fldProgram.finish_date.Value ] ).date_str,
        is_expire: bIsExpire,
        required: tools_web.is_true(fldProgram.required.Value),
        required_name: ( tools_web.is_true(fldProgram.required.Value) ? i18n.t( 'obyazatelnyyeta' ) : "" ),
        finished: (oActivity != null ? tools_web.is_true(oActivity.GetOptProperty('finished')) : 0),
        tasks: 0,
        passed: (oActivity != null ? tools_web.is_true(oActivity.GetOptProperty('passed')): 0),
        message: "",
        access: bAccess
    };

    return objRet;
}
function cast_StatusCode(oActivity, fldProgram)
{
    var iStateID = 0;
    if ( oActivity == null || oActivity.xq_object == undefined)
    {
        if( fldProgram.type == "folder" )
        {
            iStateID = fldProgram.state_id.Value;
        }
        else
        {
            iStateID = 0;
        }
    }
    else if ( !oActivity.finished )
    {
        iStateID = 1;
    }
    else if ( !oActivity.passed )
    {
        iStateID = 3;
    }
    else
    {
        iStateID = 4;
    }
    return iStateID;
}
function cast_Status(oActivity, fldProgram)
{
    var iStateID = cast_StatusCode(oActivity, fldProgram);

    switch (iStateID)
    {
        case 0:
            sStatus = i18n.t( 'nenachat' );
            break;
        case 1:
            sStatus = i18n.t( 'vprocesse' );
            break;
        case 2:
        case 4:
        case 5:
            sStatus = i18n.t( 'izuchenuspeshno' );
            break;
        case 3:
            sStatus = i18n.t( 'izuchenneuspeshno' );
            break;
        case 6:
            sStatus = i18n.t( 'otmenen' );
            break;
        default:
            sStatus = i18n.t( 'nenachat' );
            break;
    }
    return sStatus
}
function GetActualModule(iObjectID, iPersonID, tePlan, id_only)
{
    try
    {
        is_plan = tePlan.Name == "education_plan";
    }
    catch(_noPlan_)
    {
        is_plan = false;
    }
    try
    {
        _flag_id = id_only == true;
    }
    catch(_noPlan_)
    {
        _flag_id = false;
    }
    var teEducationPlan = undefined;
    try
    {
        if ( !is_plan )
        {
            var xqLastEducationPlan = get_education_plan_by_person(iObjectID, iPersonID);
            if (xqLastEducationPlan == null)
            {
                throw StrReplace(StrReplace(
                    i18n.t( 'nenaydenoplana_1' ),
                    "{PARAM1}", iObjectID), "{PARAM2}", iPersonID);
            }

            var docEducationPlan = tools.open_doc(xqLastEducationPlan.id.Value);
            if (docEducationPlan == undefined)
            {
                throw StrReplace(i18n.t( 'nevozmozhnootkr' ), "{PARAM1}", xqLastEducationPlan.id.Value);
            }

            teEducationPlan = docEducationPlan.TopElem;
        }
        else
        {
            teEducationPlan = tePlan
        }

        var fldActualModule = ArrayOptFind(
            teEducationPlan.programs,
            " !This.parent_progpam_id.HasValue " +
            " && " +
            " (This.plan_date.HasValue && This.plan_date.Value <= Date()) && (This.finish_date.HasValue && This.finish_date.Value >= Date())"
        );

        if (fldActualModule == undefined)
        {
            fldActualModule = ArrayOptFirstElem(ArraySort(
                ArraySelect(teEducationPlan.programs, "!This.parent_progpam_id.HasValue"),
                "This.plan_date.Value", "+"));
        }

        var oRet = [{
            id: String(fldActualModule.id.Value),
            name: fldActualModule.name.Value,
            plan_date_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ fldActualModule.plan_date.Value ] ).date_str,
            finish_date_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ fldActualModule.finish_date.Value ] ).date_str,
            comment: fldActualModule.comment.Value
        }];

        if (!_flag_id)
        {
            oRet = FuncStampPassed(oRet, teEducationPlan, iPersonID);
        }

        return ArrayOptFirstElem(oRet);

    }
    catch (err)
    {
        //alert("ERROR: GetActualModule: iObjectID: [" + iObjectID + "], iPersonID: [" + iPersonID + "], " + err);
        return {
            id: 0,
            name: "",
            plan_date_str: "",
            finish_date_str: "",
            comment: ""
        }
    }
}

function GetEducationPlanTutors( iObjectIDParam, bShowDismiss )
{
    return GetEducationPlanLectors( iObjectIDParam, bShowDismiss )
}

/**
 * @function GetEducationPlanLectors
 * @memberof Websoft.WT.Event
 * @description Получения списка преподавателей по учебному плану/программе.
 * @param {bigint} iObjectIDParam - ID учебного плана/программы
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTLectorResult}
 */
function GetEducationPlanLectors( iObjectIDParam, bShowDismiss )
{
    var oRes = {
        error: 0,
        errorMessage: "",
        array: []
    }

    iObjectID = OptInt(iObjectIDParam);
    if (iObjectID == undefined)
    {
        oRes.error = 1;
        oRes.errorMessage = StrReplace( i18n.t( 'idobektaneyavlya' ), "{PARAM1}", iObjectIDParam );
        return oRes;
    }

    var docObject = tools.open_doc( iObjectID );
    if (docObject == undefined)
    {
        oRes.error = 1;
        oRes.errorMessage = StrReplace(i18n.t( 'nevozmozhnootkr_1' ), "{PARAM1}", iObjectID);
        return oRes;
    }

    if (docObject.TopElem.Name == 'education_plan')
    {
        var docCompoundProgram = tools.open_doc(docObject.TopElem.compound_program_id.Value);
        if (docCompoundProgram == undefined)
        {
            oRes.error = 1;
            oRes.errorMessage = StrReplace(
                i18n.t( 'vplaneocenkisi' ), "{PARAM1}",
                iObjectID
            );
            return oRes;
        }
        var teCompoundProgram = docCompoundProgram.TopElem;

    }
    else if (docObject.TopElem.Name == 'compound_program')
    {
        var teCompoundProgram = docObject.TopElem;
    }
    else
    {
        oRes.error = 1;
        oRes.errorMessage = StrReplace(
            i18n.t( 'peredannyyidne' ), "{PARAM1}",
            iObjectID
        );
        return oRes;
    }
    return tools.call_code_library_method( 'libMain', 'get_object_lectors', [ iObjectID, teCompoundProgram, bShowDismiss ] );
}

function GetEducationPlanEvents( iEducationPlanID, iPersonID, arrEventTypes, bReturnFuture )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.result = true;
    oRes.array = [];

    try
    {
        if( bReturnFuture == null || bReturnFuture == undefined || bReturnFuture == "" )
        {
            throw "error"
        }
        bReturnFuture = tools_web.is_true( bReturnFuture );
    }
    catch( err )
    {
        bReturnFuture = false;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        iEducationPlanID = Int( iEducationPlanID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iEducationPlanID";
        return oRes;
    }
    try
    {
        if( !IsArray( arrEventTypes ) )
        {
            throw "error";
        }
    }
    catch( err )
    {
        arrEventTypes = new Array();
    }
    var conds = new Array();
    var xarrEventTypesID = new Array();
    if( ArrayOptFirstElem( arrEventTypes ) != undefined )
    {
        xarrEventTypesID = XQuery( "for $elem in event_types where MatchSome( $elem/code, ( " + ArrayMerge( arrEventTypes, "XQueryLiteral( String( This ) )", "," ) + " ) ) return $elem/Fields( 'id' )" );
        if( ArrayOptFirstElem( xarrEventTypesID ) == undefined )
        {
            return oRes;
        }
    }
    if( ArrayOptFirstElem( xarrEventTypesID ) != undefined )
    {
        conds.push( "MatchSome( $elem/event_type_id, ( " + ArrayMerge( xarrEventTypesID, "This.id", "," ) + " ) )" );
    }
    if( bReturnFuture )
    {
        conds.push( "$elem/start_date > " + XQueryLiteral( DateNewTime( Date() ) ) );
    }

    xarrEvents = tools.xquery( "for $elem in events where some $ec in event_collaborators satisfies ( $elem/id = $ec/event_id and $ec/collaborator_id = " + iPersonID + " and $ec/education_plan_id = " + iEducationPlanID + " and $ec/is_collaborator = true() ) " + ArrayMerge( conds, "' and ' + This", " " ) + " order by $elem/start_date descending  return $elem/Fields( 'id', 'name', 'start_date' )" );

    for( _event in xarrEvents )
    {
        oRes.array.push( {
            id: _event.id.Value,
            name: _event.name.Value,
            start_date: _event.start_date.Value,
            start_date_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ _event.start_date.Value ] ).date_str,
            start_time_str: StrTime( _event.start_date.Value ),
            start_datetime_str: tools.call_code_library_method( 'libSchedule', 'get_str_date_from_date', [ _event.start_date.Value ] ).date_str + " " + StrTime( _event.start_date.Value ),
            url: tools_web.get_mode_clean_url( null, _event.id.Value )
        } );
    }
    return oRes;
}
/**
 * @typedef {Object} oEducationPlanPerson
 * @property {bigint} collaborator_id – ID сотрудника.
 * @property {bigint} id – ID сотрудника.
 * @property {string} collaborator_fullname – ФИО обучающегося.
 * @property {string} collaborator_photo – URL фотографии сотрудника.
 * @property {string} collaborator_position – Название должности сотрудника.
 * @property {string} collaborator_department – Название подразделения сотрудника.
 * @property {string} collaborator_org – Название организации сотрудника.
 * @property {string} url – Адрес карточки сотрудника на портале.
 */
/**
 * @typedef {Object} ReturnGetEducationPlanPersons
 * @property {number} error – Код ошибки.
 * @property {string} errorMessage – Текст ошибки.
 * @property {oEducationPlanPerson[]} array – массив сотрудников.
 */
/**
 * @function GetEducationPlanPersons
 * @memberof Websoft.WT.Event
 * @description Получение массива сотрудников группы учебного плана.
 * @param {bigint} iEducationPlanID - ID учебного плана.
 * @returns {ReturnGetEducationPlanPersons}
 */
function GetEducationPlanPersons( iEducationPlanID )
{
    var oObj;

    var oRet = {
        error: 0,
        errorMessage: "",
        array: []
    }

    try
    {
        teEducationPlan.Name
        var hasDocEP = true
    }
    catch (e)
    {
        var hasDocEP = false
    }

    iEducationPlanID = OptInt(iEducationPlanID);
    if (iEducationPlanID == undefined)
    {
        if (hasDocEP)
        {
            iEducationPlanID = teEducationPlan.id.Value;
        }
        else
        {
            oRet.error = 1;
            oRet.errorMessage = i18n.t( 'neperedanainfo' );
            return oRet;
        }
    }
    else if (!hasDocEP)
    {
        var docEducationPlan = tools.open_doc(iEducationPlanID);
        if (docEducationPlan == undefined)
        {
            oRet.error = 1;
            oRet.errorMessage = StrReplace(i18n.t( 'nevozmozhnootkr' ), "{PARAM1}", iEducationPlanID);
            return oRet;
        }
        teEducationPlan = docEducationPlan.TopElem;
    }

    if (teEducationPlan.type != "group")
    {
        oRet.error = 1;
        oRet.errorMessage = i18n.t( 'nuzhnovybratpla' );
        return oRet;
    }

    if (teEducationPlan.object_id.HasValue == false)
    {
        oRet.error = 1;
        oRet.errorMessage = i18n.t( 'vvybrannomplan' );
        return oRet;
    }

    xarrGroup_collaborator = XQuery("for $elem in group_collaborators " +
        " where $elem/group_id=" + teEducationPlan.object_id.Value +
        " return $elem");

    for (oGroup_collaboratorElem in xarrGroup_collaborator)
    {
        _collGroupCat = oGroup_collaboratorElem.collaborator_id.OptForeignElem;
        if (_collGroupCat != undefined)
        {
            oObj = new Object();
            oObj.id = ( oGroup_collaboratorElem.collaborator_id.Value );
            oObj.collaborator_id = ( oGroup_collaboratorElem.collaborator_id.Value);
            oObj.url = tools.call_code_library_method( "libMain", "get_object_link", [ "collaborator", oGroup_collaboratorElem.collaborator_id.Value ] );
            oObj.collaborator_fullname = _collGroupCat.fullname.Value;
            oObj.collaborator_photo = ( _collGroupCat.pict_url.HasValue ? _collGroupCat.pict_url.Value : "/pics/nophoto.jpg" );
            oObj.collaborator_position = _collGroupCat.position_name.Value;
            oObj.collaborator_department = _collGroupCat.position_parent_name.Value;
            oObj.collaborator_org = _collGroupCat.org_name.Value;
            oRet.array.push(oObj);
        }
    }

    return oRet;
}
/**
 * @typedef {Object} TrainerEventContext
 * @property {int} iPersonsCount – количество участников
 * @property {int} iPersonsConfirm – Подтвердили участие
 * @property {int} iPersonsNotPrt – Отказались от участия
 * @property {int} iPersonsAssist – Присутствовали
 * @property {int} iRequestsActive – Заявки не закрыты
 * @property {int} iTasksActive – Выполнение заданий не завершено
 * @property {int} iTestsFailed – Тестов не сдано
 * @property {int} iCoursesActive – курсов не закончено
 * @property {int} iResponsesCount – Отзывов заполнено
 * @property {string} sScoreAvg – Средний балл
 */
/**
 * @typedef {Object} ReturnGetTrainerEventContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {TrainerEventContext} context – Контекст мероприятия.
 */
/**
 * @function GetTrainerEventContext
 * @memberof Websoft.WT.Event
 * @description Получение статистики мероприятия.
 * @param {bigint} iEventID - ID мероприятия.
 * @returns {ReturnGetTrainerEventContext}
 */
function GetTrainerEventContext( iEventID )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    try
    {
        iEventID = Int( iEventID );
        catEvent = ArrayOptFirstElem( XQuery("for $elem in events where $elem/id = " + XQueryLiteral( iEventID ) + " return $elem") );
        iEventID = catEvent.id.Value;
    }
    catch ( err )
    {
        oRes.error = 503;
        oRes.errorText = "{ text: 'Object not found.', param_name: 'iEventID' }";
        return oRes;
    }

    oRes.context.iPersonsCount = ArrayCount( XQuery("for $elem in event_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " return $elem/Fields('id')") );
    oRes.context.iPersonsConfirm = ArrayCount( XQuery("for $elem in event_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " and $elem/is_confirm = true() return $elem/Fields('id')") );
    oRes.context.iPersonsNotPrt = ArrayCount( XQuery("for $elem in event_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " and $elem/not_participate = true() return $elem/Fields('id')") );
    oRes.context.iPersonsAssist = ArrayCount( XQuery("for $elem in event_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " and $elem/is_assist = true() return $elem/Fields('id')") );
    oRes.context.iRequestsActive = ArrayCount( XQuery("for $elem in requests where $elem/object_id = " + XQueryLiteral( iEventID ) + " and $elem/status_id = 'active' return $elem/Fields('id')") );
    oRes.context.iTasksActive = ArrayCount( XQuery("for $elem in learning_task_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " and $elem/status_id = 'evaluation' return $elem/Fields('id')") );
    oRes.context.iTestsFailed = ArrayCount( XQuery("for $elem in test_learnings where $elem/event_id = " + XQueryLiteral( iEventID ) + " and $elem/state_id = 4 return $elem/Fields('id')") );
    oRes.context.iCoursesActive = ArrayCount( XQuery("for $elem in active_learnings where $elem/event_id = " + XQueryLiteral( iEventID ) + " return $elem/Fields('id')") );
    oRes.context.iResponsesCount = ArrayCount( XQuery("for $elem in responses where $elem/object_id = " + XQueryLiteral( iEventID ) + " return $elem/Fields('id')") );
    oRes.context.sScoreAvg = oRes.context.iPersonsCount == 0 ? '0': StrReal( ArraySum( XQuery("for $elem in event_results where $elem/event_id = " + XQueryLiteral( iEventID ) + " return $elem/Fields('score')"), "OptReal( This.score, 0 )" ) / OptReal( oRes.context.iPersonsCount ), 2 );

    return oRes;
}

/**
 * @typedef {Object} TrainerEventsContext
 * @property {int} iPersonsCount – количество участников
 * @property {int} iHoursSum – Часов обучения
 * @property {int} iEventsCount – Запланировано мероприятий
 * @property {int} iEventsFinishCount – Проведено мероприятий
 * @property {int} iRequestsActive – Заявки не закрыты
 * @property {int} iTasksActive – Выполнение заданий не завершено
 * @property {int} iTestsFailed – Тестов не сдано
 * @property {int} iPersonsNotPrt – Не подтвердили участие
 */
/**
 * @typedef {Object} ReturnGetTrainerEventsContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {TrainerEventsContext} context – Контекст мероприятия.
 */
/**
 * @function GetTrainerEventsContext
 * @memberof Websoft.WT.Event
 * @description Получение статистики по мероприятиям.
 * @author PL BG
 * @param {bigint} iPersonID - ID текущего пользователя.
 * @param {string} sAppCode - Код приложения.
 * @param {string} sAccessTypeID - Тип доступа.
 * @param {date} dStartDate - Дата начала периода.
 * @param {date} dEndDate - Дата окончания периода.
 * @returns {ReturnGetTrainerEventsContext}
 */
function GetTrainerEventsContext( iPersonID, sAppCode, sAccessTypeID, dStartDate, dEndDate )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    conds = [""];
    event_conds = [""];
    var tePerson = null;

    function get_person_top_elem()
    {
        if( tePerson == null )
        {
            tePerson = tools.open_doc( iPersonID ).TopElem;
        }
        return tePerson;
    }

    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( err )
    {
        oRes.error = 1;
        oRes.message = "Incorrect iPersonID";
        return oRes;
    }
    try
    {
        tePerson.Name;
    }
    catch( err )
    {
        tePerson = null;
    }

    switch( sAccessTypeID )
    {
        case "admin":
            if( get_person_top_elem().access.access_role != "admin" )
            {
                oResAppLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ iPersonID, sAppCode ] );
                if( oResAppLevel < 7 )
                {
                    return oRes;
                }
            }
            if ( dStartDate != null || dEndDate != null )
            {
                oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, "", "plan;active;close;cancel", "", "", "", "", dStartDate, dEndDate, "fields", [ "id" ], ({}), ({}), "" );
                if( ArrayOptFirstElem( oResEvent.array ) == undefined )
                {
                    return oRes;
                }
                arrEvents = oResEvent.array;
                if( ArrayCount( arrEvents ) < 1000 )
                {
                    conds.push( "MatchSome( $elem_qc/id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                    event_conds.push( "MatchSome( $elem_qc/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                    arrEvents = null;
                }
            }
            break;
        case "manager":
        case "tutor":
        case "observer":
            oResEvent = GetTrainerEvents( iPersonID, tePerson, "", "", sAccessTypeID, "", "plan;active;close;cancel", "", "", "", "", dStartDate, dEndDate, "fields", [ "id" ], ({}), ({}), "" );
            if( ArrayOptFirstElem( oResEvent.array ) == undefined )
            {
                return oRes;
            }
            arrEvents = oResEvent.array;
            if( ArrayCount( arrEvents ) < 1000 )
            {
                conds.push( "MatchSome( $elem_qc/id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                event_conds.push( "MatchSome( $elem_qc/event_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) )" );
                arrEvents = null;
            }
            break;
        default:
            oRes.error = 1;
            oRes.message = "Incorrect sAccessTypeID";
            return oRes;
    }

    //var sReqPersonsCount = "for $elem_qc in event_results where ForeignElem( $elem_qc/event_id )/status_id = 'close' and $elem_qc/is_assist = true()" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')";
    var sReqPersonsCount = "for $elem_qc in event_results where some $event in events satisfies ($elem/event_id = $event/id and $event/status_id = 'close') and $elem_qc/is_assist = true()" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')";
    oRes.context.iPersonsCount = ArrayCount( XQuery(sReqPersonsCount) );

    oRes.context.iHoursSum = ArraySum( XQuery("for $elem_qc in events, $er in event_results where $elem_qc/id = $er/event_id and $elem_qc/status_id = 'close' and $er/is_assist = true()" + ArrayMerge( conds, "This", " and " ) + " return $elem_qc/Fields('duration_fact')"), "OptReal( This.duration_fact, 0)" );
    oRes.context.iEventsCount = ArrayCount( XQuery("for $elem_qc in events where MatchSome( $elem_qc/status_id, ('plan') )" + ArrayMerge( conds, "This", " and " ) + " return $elem_qc/Fields('id')") );
    oRes.context.iEventsFinishCount = ArrayCount( XQuery("for $elem_qc in events where MatchSome( $elem_qc/status_id, ('close') )" + ArrayMerge( conds, "This", " and " ) + " return $elem_qc/Fields('id')") );
    oRes.context.iRequestsActive = ArrayCount( XQuery("for $elem_qc in requests where $elem_qc/type = 'event' and $elem_qc/status_id = 'active'" + ArrayMerge( event_conds, "StrReplace( This, 'event_id', 'object_id')", " and " ) + " return $elem_qc/Fields('id')") );
    oRes.context.iTasksActive = ArrayCount( XQuery("for $elem_qc in learning_task_results where $elem_qc/event_id != null() and $elem_qc/status_id = 'evaluation'" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')") );
    oRes.context.iTestsFailed = ArrayCount( XQuery("for $elem_qc in active_test_learnings where $elem_qc/event_id != null() and $elem_qc/state_id = 0" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')") );

    //var sReqPersonsNotPrt = "for $elem_qc in event_results where ( ForeignElem( $elem_qc/event_id )/status_id = 'active' or ForeignElem( $elem_qc/event_id )/status_id = 'plan') and $elem_qc/is_confirm = false() and $elem_qc/not_participate = false()" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')"
    var sReqPersonsNotPrt = "for $elem_qc in event_results where some $event in events satisfies ($elem/event_id = $event/id and ($event/status_id = 'active' or $event//status_id = 'plan') ) and $elem_qc/is_confirm = false() and $elem_qc/not_participate = false()" + ArrayMerge( event_conds, "This", " and " ) + " return $elem_qc/Fields('id')"
    oRes.context.iPersonsNotPrt = ArrayCount( XQuery(sReqPersonsNotPrt) );

    return oRes;
}

/**
 * @function GetCourseModuleCourses
 * @memberof Websoft.WT.Event
 * @description Получения списка курсов, в которые входит учебный модуль.
 * @param {bigint} iCourseModuleID - ID учебного модуля
 * @returns {WTCourseResult}
 */
function GetCourseModuleCourses( iCourseModuleID )
{
    oRes = new Object();
    oRes.error = 0;
    oRes.result = true;
    oRes.array = [];

    try
    {
        iCourseModuleID = Int( iCourseModuleID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'peredannekorre_16' );
        return oRes;
    }

    xarrCourseParts = tools.xquery("for $elem in course_parts where $elem/course_module_id = " + iCourseModuleID + " return $elem/Fields('course_id')");
    xarrCourses = tools.xquery("for $elem in courses where MatchSome( $elem/id, (" + ArrayMerge( xarrCourseParts, 'course_id', ',' )+ ")) return $elem");

    for ( oCourse in xarrCourses )
    {
        obj = new Object();
        obj.id = oCourse.id.Value;
        obj.code = oCourse.code.Value;
        obj.name = oCourse.name.Value;
        obj.status = common.course_test_states.GetOptChildByKey( oCourse.status.Value ).name.Value;
        obj.education_org_id = oCourse.education_org_id.Value;
        obj.mastery_score = oCourse.mastery_score.Value;
        obj.max_score = oCourse.max_score.Value;
        obj.duration = oCourse.duration.Value;
        oRes.array.push( obj );
    }

    return oRes;
}

/**
 * @typedef {Object} LearningTaskContext
 * @property {number} assigned_task_count – количество всех назначений заданий с любым статусом, кроме Отменено, по этому заданию
 * @property {number} complete_task_count - сумма всех назначений заданий по данному заданию со статусами Пройден, Не пройден
 * @property {number} percent_complete_task - процент назначений заданий по данному заданию со статусами Пройден, Не пройден от назначенных
 * @property {number} avg_mark - средняя оценка по всем выполнениям заданий по данному заданию со статусами Пройден, Не пройден. Если в выполнении задании оценки нет, то в среднем значении не учитывается
 * @property {number} success_task_count - сумма всех назначений заданий по данному заданию со статусом Пройден
 * @property {number} percent_success_task - процент назначений заданий по данному заданию со статусами Пройден от показателя Завершено
 * @property {number} avg_duration - средняя продолжительность выполнения по всем выполнениям задания со статусами Пройден, Не пройден
 * @property {number} last_start_date - наибольшая дата создания назначения задания с любым статусом по этому заданию
 */
/**
 * @typedef {Object} ReturnLearningTaskContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {LearningTaskContext} context – Контекст задания.
 */
/**
 * @function GetLearningTaskContext
 * @memberof Websoft.WT.Event
 * @description Получение статистики по заданию.
 * @author AKh
 * @param {bigint} iLearningTaskID - ID задания.
 * @param {bigint} iPersonID - ID текущего пользователя.
 * @param {string} sAppCode - Код приложения.
 * @returns {ReturnLearningTaskContext}
 */
function GetLearningTaskContext( iLearningTaskID, iPersonID, sAppCode )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    try
    {
        iLearningTaskID = Int( iLearningTaskID );
    }
    catch ( err )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
        return oRes;
    }

    try
    {
        if (iPersonID == null || iPersonID == undefined || iPersonID == "")
            throw ''
    }
    catch ( err )
    {
        iPersonID = 0;
    }

    try
    {
        if (sAppCode == null || sAppCode == undefined || sAppCode == "")
            throw ''
    }
    catch ( err )
    {
        sAppCode = '';
    }

    function get_percent_complete_task()
    {
        if (iAsignedTaskCount == 0)
        {
            return 0;
        }
        return Math.round(Real(iCompleteTaskCount * 100) / Real(iAsignedTaskCount));
    }

    function get_percent_success_task()
    {
        if (iCompleteTaskCount == 0)
        {
            return 0;
        }
        return Math.round(Real(iSuccessTaskCount * 100) / Real(iCompleteTaskCount));
    }

    function get_avg_duration()
    {
        if (ArrayOptFirstElem(arrCompleteTaskResult) != undefined)
        {
            _duration = 0;
            for (_task in arrCompleteTaskResult)
            {
                if (_task.finish_execution_date == '' || _task.finish_execution_date == null)
                {
                    continue;
                }
                else
                    _duration += DateDiff(Date(_task.finish_execution_date), Date(_task.start_execution_date))
            }

            _avg_time = _duration / ArrayCount (arrCompleteTaskResult);
            _avg_time_days = Real(_avg_time / 86400);
            _avg_time_hours = Real((_avg_time - (_avg_time_days * 86400)) / 3600);

            if (_avg_time_days > 0)
            {
                if (_avg_time_hours > 0)
                    return _avg_time_days + i18n.t( 'dn' ) + _avg_time_hours + i18n.t( 'ch' );
                else
                    return _avg_time_days + i18n.t( 'dn' );
            }
            else
            {
                if (_avg_time_hours >= 1)
                    return _avg_time_hours + i18n.t( 'ch' );
                else if (_avg_time_hours < 1 && _avg_time_hours > 0)
                    return i18n.t( 'meneech' );
                else
                    return 0 + i18n.t( 'dn' ) + 0 + i18n.t( 'ch' );
            }
        }
        else
            return 0 + i18n.t( 'dn' ) + 0 + i18n.t( 'ch' );
    }

    iAccessApp = tools.call_code_library_method('libApplication', 'GetPersonApplicationAccessLevel', [iPersonID, sAppCode]);
    subordinate_conds = "";
    switch(iAccessApp)
    {
        case 5:
            var teApplication = tools_app.get_cur_application(sAppCode);

            _manager_type_id = 0;

            if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
            {
                _manager_type_id = OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 );
            }

            if ( _manager_type_id == 0 )
            {
                _manager_type_id = ArrayOptFirstElem( XQuery('for $elem in boss_types where $elem/code = \'education_manager\' return $elem/Fields(\'id\')') );
                if ( _manager_type_id == undefined )
                {
                    _manager_type_id = 0;
                }
                else
                {
                    _manager_type_id = _manager_type_id.id.Value;
                }
            }

            arrSubordinates = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['func'], true, "", null, "", true, true, true, true, [_manager_type_id], true ] );
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";
            break;
        case 1:
            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [], true ]);
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";
            break;
    }

    xarrLearningTaskResult = XQuery( "for $elem in learning_task_results where $elem/learning_task_id = " + iLearningTaskID + subordinate_conds + " return $elem" );

    arrAssignedLearningTaskResult = ArraySelect(xarrLearningTaskResult, "This.status_id != 'cancel'");
    arrSuccessLearningTaskResult = ArraySelect(xarrLearningTaskResult, "This.status_id == 'success'");
    arrFailedLearningTaskResult = ArraySelect(xarrLearningTaskResult, "This.status_id == 'failed'");
    arrCompleteTaskResult = ArrayUnion(arrSuccessLearningTaskResult, arrFailedLearningTaskResult);

    iAsignedTaskCount = ArrayCount(arrAssignedLearningTaskResult)
    iSuccessTaskCount = ArrayCount(arrSuccessLearningTaskResult)
    iCompleteTaskCount = ArrayCount(arrCompleteTaskResult);

    avg_mark = 0;
    iCountTask = 0;
    for (_elem in arrCompleteTaskResult)
    {
        if (_elem.mark.HasValue)
        {
            avg_mark += Real(elem.mark);
            iCountTask++;
        }
        else
            continue;
    }

    if (ArrayOptFirstElem(arrCompleteTaskResult) != undefined && iCountTask > 0)
        avg_mark = Real(avg_mark) / Real(iCountTask);

    var oContext = {
        assigned_task_count: iAsignedTaskCount,
        complete_task_count: iCompleteTaskCount,
        percent_complete_task: get_percent_complete_task(),
        avg_mark: avg_mark,
        success_task_count: iSuccessTaskCount,
        percent_success_task: get_percent_success_task(),
        last_start_date: ArrayMax(xarrLearningTaskResult, 'start_date').start_date,
        avg_duration: get_avg_duration()
    }

    oRes.context = oContext;

    return oRes;
}

/**
 * @typedef {Object} CompoundProgramContext
 * @property {number} folder_count – количество разделов модульной программы с типом Этап
 * @property {number} activity_count - количество разделов модульной программы с любым типом, кроме Этап
 * @property {number} collaborators_trained_count - число планов обучения с типом Сотрудник, привязанных к данной программе и имеющих статус Пройден
 * @property {number} groups_trained_count - число планов обучения с типом Группа, привязанных к данной программе и имеющих статус Пройден
 */
/**
 * @typedef {Object} ReturnCompoundProgramContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {CompoundProgramContext} context – Контекст модульной программы.
 */
/**
 * @function GetCompoundProgramContext
 * @memberof Websoft.WT.Event
 * @description Получение статистики по модульной программе.
 * @author AKh
 * @param {bigint} iCompoundProgramID - ID модульной программы.
 * @param {bigint} iPersonID - ID текущего пользователя.
 * @param {string} sAppCode - Код приложения.
 * @returns {ReturnCompoundProgramContext}
 */
function GetCompoundProgramContext( iCompoundProgramID, iPersonID, sAppCode )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    try
    {
        iCompoundProgramID = Int( iCompoundProgramID );
    }
    catch ( err )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'nekorrektnyyid_2' );
        return oRes;
    }

    try
    {
        if (iPersonID == null || iPersonID == undefined || iPersonID == "")
            throw ''
    }
    catch ( err )
    {
        iPersonID = 0;
    }

    try
    {
        if (sAppCode == null || sAppCode == undefined || sAppCode == "")
            throw ''
    }
    catch ( err )
    {
        sAppCode = '';
    }

    iAccessApp = tools.call_code_library_method('libApplication', 'GetPersonApplicationAccessLevel', [iPersonID, sAppCode]);
    subordinate_conds = "";
    groups_conds = "";
    switch(iAccessApp)
    {
        case 5:
            var teApplication = tools_app.get_cur_application(sAppCode);

            _manager_type_id = 0;

            if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
            {
                _manager_type_id = OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 );
            }

            if ( _manager_type_id == 0 )
            {
                _manager_type_id = ArrayOptFirstElem( XQuery('for $elem in boss_types where $elem/code = \'education_manager\' return $elem/Fields(\'id\')') );
                if ( _manager_type_id == undefined )
                {
                    _manager_type_id = 0;
                }
                else
                {
                    _manager_type_id = _manager_type_id.id.Value;
                }
            }

            arrSubordinates = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['func'], true, "", null, "", true, true, true, true, [_manager_type_id], true ] );
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";

            arrGroups = XQuery("for $elem in func_managers where $elem/catalog = 'group' and $elem/person_id = " + iPersonID + " and $elem/boss_type_id = " + _manager_type_id + " return $elem/Fields('object_id')");
            groups_conds = " and MatchSome($elem/object_id, (" + ArrayMerge(arrGroups, 'This.object_id', ',') + "))";

            break;
        case 1:
            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [], true ]);
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";

            arrGroups = XQuery("for $elem in func_managers where $elem/catalog = 'group' and $elem/person_id = " + iPersonID + " return $elem/Fields('object_id')");
            groups_conds = " and MatchSome($elem/object_id, (" + ArrayMerge(arrGroups, 'This.object_id', ',') + "))";
            break;
    }

    docCompoundProgram = tools.open_doc(iCompoundProgramID);
    teCompoundProgram = docCompoundProgram.TopElem;

    iFolderCount = ArrayCount(ArraySelect(teCompoundProgram.programs, 'This.type == "folder"'));
    iActivityCount = ArrayCount(ArraySelect(teCompoundProgram.programs, 'This.type != "folder"'));

    xarrCollEducPlan = XQuery("for $elem in education_plans where $elem/type = 'collaborator' and $elem/state_id = 4 and $elem/compound_program_id = " + iCompoundProgramID + subordinate_conds + " return $elem");

    xarrGroupEducPlan = XQuery("for $elem in education_plans where $elem/type = 'group' and $elem/state_id = 4 and $elem/compound_program_id = " + iCompoundProgramID + groups_conds + " return $elem");


    var oContext = {
        folder_count: iFolderCount,
        activity_count: iActivityCount,
        collaborators_trained_count: ArrayCount(xarrCollEducPlan),
        groups_trained_count: ArrayCount(xarrGroupEducPlan)
    }

    oRes.context = oContext;

    return oRes;
}

/**
 * @typedef {Object} EducationMethodContext
 * @property {number} event_count – сумма всех мероприятий по этой программе с любыми статусами, кроме Отменено и Проект
 * @property {number} collaborators_trained_count - число всех участников мероприятий со статусами Проводится и Завершено, у которых отмечен признак присутствия
 * @property {date} next_event - ближайшее по дате и времени проведение мероприятие по данной учебной программе со статусом Планируется или Проводится
 * @property {number} planned_event - сумма всех мероприятий по этой программе со статусом Планируется
 * @property {number} planned_education - число всех участников мероприятий со статусом Планируется
 * @property {number} response_count - количество анкет (отзывов)
 * @property {number} percent_response - процент заполнения отзывов
 * @property {number} average_response - средняя оценка по отзывам
 */
/**
 * @typedef {Object} ReturnEducationMethodContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {EducationMethodContext} context – Контекст учебной программы.
 */
/**
 * @function GetEducationMethodContext
 * @memberof Websoft.WT.Event
 * @description Получение статистики по учебной программе.
 * @author AKh
 * @param {bigint} iEducationMethodID - ID учебной программы.
 * @param {bigint} iPersonID - ID текущего пользователя.
 * @param {string} sAppCode - Код приложения.
 * @returns {ReturnEducationMethodContext}
 */
function GetEducationMethodContext( iEducationMethodID, iPersonID, sAppCode )
{
    var oRes = tools.get_code_library_result_object();
    oRes.context = new Object;

    try
    {
        iEducationMethodID = Int( iEducationMethodID );
    }
    catch ( err )
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'nekorrektnyyid_3' );
        return oRes;
    }

    try
    {
        if (iPersonID == null || iPersonID == undefined || iPersonID == "")
            throw ''
    }
    catch ( err )
    {
        iPersonID = 0;
    }

    try
    {
        if (sAppCode == null || sAppCode == undefined || sAppCode == "")
            throw ''
    }
    catch ( err )
    {
        sAppCode = '';
    }

    function get_percent_response()
    {
        xarrTrained = XQuery("for $elem in event_results where MatchSome($elem/event_id,(" + ArrayMerge(arrTrainedEvents, 'This.id', ',') + ")) and $elem/is_assist = true() " + " return $elem");

        if (ArrayOptFirstElem(xarrTrained) == undefined)
        {
            return 0;
        }
        return Math.round( Real( iResponseCount * 100) / Real( ArrayCount(xarrTrained) ) );
    }

    function get_average_response()
    {
        if (iResponseCount == 0)
        {
            return 0;
        }
        return StrReal( ArraySum( xarrResponsesEducMethod, "OptReal( This.basic_score, 0 )" ) / Real( iResponseCount ), 2 )
    }

    iAccessApp = tools.call_code_library_method('libApplication', 'GetPersonApplicationAccessLevel', [iPersonID, sAppCode]);
    subordinate_conds = "";
    switch(iAccessApp)
    {
        case 5:
            var teApplication = tools_app.get_cur_application(sAppCode);

            _manager_type_id = 0;

            if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
            {
                _manager_type_id = OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, 0 );
            }

            if ( _manager_type_id == 0 )
            {
                _manager_type_id = ArrayOptFirstElem( XQuery('for $elem in boss_types where $elem/code = \'education_manager\' return $elem/Fields(\'id\')') );
                if ( _manager_type_id == undefined )
                {
                    _manager_type_id = 0;
                }
                else
                {
                    _manager_type_id = _manager_type_id.id.Value;
                }
            }

            arrSubordinates = tools.call_code_library_method( 'libMain', 'get_subordinate_records', [ iPersonID, ['func'], true, "", null, "", true, true, true, true, [_manager_type_id], true ] );
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";
            break;
        case 1:
            arrSubordinates = tools.call_code_library_method("libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, [], true ]);
            subordinate_conds = " and MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinates, 'This', ',') + "))";
            break;
    }

    xarrEvents = XQuery("for $elem in events where $elem/education_method_id = " + iEducationMethodID + " return $elem/Fields('id', 'status_id', 'start_date')");

    arrAllEvents = ArraySelect(xarrEvents, 'This.status_id != "project" && This.status_id != "cancel"');
    iEventsCount = ArrayCount(arrAllEvents);

    arrPlannedEvents = ArraySelect(xarrEvents, 'This.status_id == "plan"');
    iPlannedEventsCount = ArrayCount(arrPlannedEvents);

    var nextEventDate = '';

    arrNextEvent = ArraySelect(xarrEvents, 'This.status_id == "active" || This.status_id == "plan"');

    if (ArrayOptFirstElem(arrNextEvent) != undefined)
    {
        nextEventDate = ArrayMax(arrNextEvent, 'start_date').start_date;

        if (nextEventDate < Date())
            nextEventDate = '';
    }

    arrTrainedEvents = ArraySelect(xarrEvents, 'This.status_id == "active" || This.status_id == "close"');
    xarrCollTrained = XQuery("for $elem in event_results where MatchSome($elem/event_id,(" + ArrayMerge(arrTrainedEvents, 'This.id', ',') + ")) and $elem/is_assist = true() " + subordinate_conds + " return $elem");
    iCollTrainedCount = ArrayCount(xarrCollTrained);

    xarrEducPlaned = XQuery("for $elem in event_results where MatchSome($elem/event_id,(" + ArrayMerge(arrPlannedEvents, 'This.id', ',') + "))" + subordinate_conds + " return $elem");
    iPlannedEducCount = ArrayCount(xarrEducPlaned);

    xarrResponsesEducMethod = XQuery("for $elem in responses where $elem/type = 'education_method' and $elem/object_id = " + iEducationMethodID + " return $elem");
    iResponseCount = ArrayCount( xarrResponsesEducMethod );

    var oContext = {
        event_count: iEventsCount,
        collaborators_trained_count: iCollTrainedCount,
        next_event: nextEventDate,
        planned_event: iPlannedEventsCount,
        planned_education: iPlannedEducCount,
        response_count: iResponseCount,
        percent_response: get_percent_response(),
        average_response: get_average_response()
    }

    oRes.context = oContext;

    return oRes;
}


/**
 * @typedef {Object} oReturnEducationPrograms
 * @property {bigint} id
 * @property {string} name - название набора программ
 * @property {bigint} methods_count - число программ, входящих в набор
 * @property {bigint} event_count - число мероприятий для данного набора программ
 *
 */

/**
 * @typedef {Object} ReturnEducationPrograms
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oReturnEducationPrograms[]} array – Коллекция наборов программ
 */

/**
 * @function GetEducationPrograms
 * @memberof Websoft.WT.Event
 * @author EO
 * @description Получение списка наборов программ
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication код (или id) приложения, по которому определяется доступ
 * @param {string} [arrReturnData] - массив полей для вывода: "methods_count"(число программ, входящих в набор),"event_count"(число мероприятий для данного набора программ)
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnEducationPrograms}
 */
function GetEducationPrograms( iCurUserID, sAccessType, sApplication, arrReturnData, sXQueryQual, oCollectionParams )
{
    var oRes = tools.get_code_library_result_object();
    oRes.paging = oCollectionParams.paging;
    oRes.array = [];

    var arrXQConds = [];

    if ( sAccessType == null || sAccessType == undefined)
    {
        sAccessType = "auto";
    }

    if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "expert" && sAccessType != "observer" )
    {
        sAccessType = "auto";
    }

    if ( sApplication == null || sApplication == undefined)
    {
        sApplication = "";
    }

    iApplicationID = OptInt( sApplication );
    if ( iApplicationID != undefined )
    {
        sApplication = ArrayOptFirstElem( tools.xquery( "for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')" ), { code: "" } ).code;
    }

    if ( sAccessType == "auto" && sApplication != "" )
    {
        var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );

        if(iApplLevel >= 10)
        {
            sAccessType = "admin"; //Администратор приложения
        }
        else if(iApplLevel >= 7)
        {
            sAccessType = "manager"; //Администратор процесса
        }
        else if(iApplLevel >= 5)
        {
            sAccessType = "hr"; //Администратор HR
        }
        else if(iApplLevel >= 3)
        {
            sAccessType = "expert"; //Эксперт
        }
        else if(iApplLevel >= 1)
        {
            sAccessType = "observer"; //Наблюдатель
        }
        else
        {
            sAccessType = "reject";
        }
    }

    switch(sAccessType)
    {
        case "expert":
            oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iCurUserID + " return $elem/Fields('id')"));

            arrRoles = [];
            if (oExpert != undefined)
            {
                arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'education_program' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");
            }
            if ( ArrayOptFirstElem(arrRoles) != undefined)
                arrXQConds.push("MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) )");
            else
                return oRes;
            break;
        case "reject":
            return oRes;
            break;
    }

    if ( sXQueryQual == null || sXQueryQual == undefined)
        sXQueryQual = "";

    if ( sXQueryQual != "" )
    {
        arrXQConds.push( sXQueryQual );
    }

    if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
    {
        arrFilters = oCollectionParams.filters;
    }
    else
    {
        arrFilters = [];
    }

    for ( oFilter in arrFilters )
    {
        if ( oFilter.type == 'search' )
        {
            if ( oFilter.value != '' )
                arrXQConds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
        }
    }

    var sXQConds = ArrayOptFirstElem(arrXQConds) == undefined ? "" : " where " + ArrayMerge(arrXQConds, "This", " and ");
    var sReq = "for $elem in education_programs" + sXQConds + " order by $elem/name return $elem/Fields('id','code','name')";
    var xarrEduPrograms = tools.xquery(sReq);


    sReq = "for $elem in education_program_education_methods where MatchSome($elem/education_program_id, (" + ArrayMerge(xarrEduPrograms, "This.id.Value", ",") + ")) return $elem/Fields('education_program_id')";
    var xarrEduMethods = tools.xquery(sReq);

    sReq = "for $elem in events where MatchSome($elem/education_program_id, (" + ArrayMerge(xarrEduPrograms, "This.id.Value", ",") + ")) and $elem/type_id = 'education_method_from_program' return $elem/Fields('education_program_id')";
    var xarrEvents = tools.xquery(sReq);

    for ( oItem in xarrEduPrograms )
    {
        oElem = {
            id: oItem.id.Value,
            name: oItem.name.Value,
            methods_count: null,
            event_count: null
        };

        if ( ArrayOptFirstElem( arrReturnData ) != undefined )
        {
            for ( itemReturnData in arrReturnData )
            {
                switch ( itemReturnData )
                {
                    case "methods_count": //число программ, входящих в набор
                        oElem.methods_count = ArrayCount( ArraySelect( xarrEduMethods, "This.education_program_id.Value == oItem.id.Value" ) );
                        break;
                    case "event_count": //число мероприятий для данного набора программ
                        oElem.event_count = ArrayCount( ArraySelect( xarrEvents, "This.education_program_id.Value == oItem.id.Value" ) );
                        break;
                }
            }
        }
        oRes.array.push(oElem);
    }

    if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
    {
        var sFieldName = oCollectionParams.sort.FIELD;
        switch(sFieldName)
        {
            case "name":
                sFieldName = "StrUpperCase("+sFieldName+")";
        }
        oRes.array = ArraySort(oRes.array, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
    }

    if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
    {
        oCollectionParams.paging.MANUAL = true;
        oCollectionParams.paging.TOTAL = ArrayCount(oRes.array);
        oRes.paging = oCollectionParams.paging;
        oRes.array = ArrayRange(oRes.array, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
    }

    return oRes;
}


/**
 * @typedef {Object} oReturnEduOrgs
 * @property {bigint} id
 * @property {string} disp_name - условное название обучающей организации
 * @property {string} name - официальное название обучающей организации
 * @property {string} provider_courses - поставщик электронных курсов – i18n.t( 'da_1' ) / i18n.t( 'net_1' )
 * @property {bigint} lectors_count - число преподавателей, указанных в данной обучающей организации
 * @property {bigint} education_method_count - число учебных программ, в которых указана данная обучающая организация
 * @property {bigint} event_count - число мероприятий, в которых указана данная обучающая организация
 */

/**
 * @typedef {Object} ReturnEduOrgs
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oReturnEduOrgs[]} array – Коллекция обучающих организаций
 */

/**
 * @function GetEduOrgs
 * @memberof Websoft.WT.Event
 * @author EO
 * @description Получение списка обучающих организаций
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication код (или id) приложения, по которому определяется доступ
 * @param {string} [arrTypesOrgs] - какие обучающие организации будут возвращаться: "is_provider_courses"(Поставщики курсов), "is_not_provider_courses"(Не поставщики курсов)
 * @param {string} [arrReturnData] - массив полей для вывода: "lectors_count"(число преподавателей), "education_method_count"(число программ), "event_count"(число мероприятий)
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnEduOrgs}
 */
function GetEduOrgs( iCurUserID, sAccessType, sApplication, arrTypesOrgs, arrReturnData, sXQueryQual, oCollectionParams )
{
    var oRes = tools.get_code_library_result_object();
    oRes.paging = oCollectionParams.paging;
    oRes.array = [];

    var arrXQConds = [];

    if ( sAccessType == null || sAccessType == undefined)
    {
        sAccessType = "auto";
    }

    if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "expert" && sAccessType != "observer" )
    {
        sAccessType = "auto";
    }

    if ( sApplication == null || sApplication == undefined)
    {
        sApplication = "";
    }

    iApplicationID = OptInt( sApplication );
    if ( iApplicationID != undefined )
    {
        sApplication = ArrayOptFirstElem( tools.xquery( "for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')" ), { code: "" } ).code;
    }

    if ( sAccessType == "auto" && sApplication != "" )
    {
        var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );

        if(iApplLevel >= 10)
        {
            sAccessType = "admin"; //Администратор приложения
        }
        else if(iApplLevel >= 7)
        {
            sAccessType = "manager"; //Администратор процесса
        }
        else if(iApplLevel >= 5)
        {
            sAccessType = "hr"; //Администратор HR
        }
        else if(iApplLevel >= 3)
        {
            sAccessType = "expert"; //Эксперт
        }
        else if(iApplLevel >= 1)
        {
            sAccessType = "observer"; //Наблюдатель
        }
        else
        {
            sAccessType = "reject";
        }
    }

    switch(sAccessType)
    {
        case "expert":
            oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iCurUserID + " return $elem/Fields('id')"));

            arrRoles = [];
            if (oExpert != undefined)
            {
                arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'education_org' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");
            }
            if ( ArrayOptFirstElem(arrRoles) != undefined)
                arrXQConds.push("MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) )");
            else
                return oRes;
            break;
        case "reject":
            return oRes;
            break;
    }

    if ( sXQueryQual == null || sXQueryQual == undefined)
        sXQueryQual = "";

    if ( sXQueryQual != "" )
    {
        arrXQConds.push( sXQueryQual );
    }

    if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
    {
        arrFilters = oCollectionParams.filters;
    }
    else
    {
        arrFilters = [];
    }

    for ( oFilter in arrFilters )
    {
        if ( oFilter.type == 'search' )
        {
            if ( oFilter.value != '' )
                arrXQConds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
        }
    }

    arrTypesOrgsConds = [];
    if ( ArrayOptFirstElem( arrTypesOrgs ) != undefined )
    {
        for ( itemTypesOrgs in arrTypesOrgs )
        {
            switch ( itemTypesOrgs )
            {
                case "is_provider_courses": //Поставщики курсов
                    arrTypesOrgsConds.push( "$elem/is_provider_courses = true()" );
                    break;
                case "is_not_provider_courses": //Не поставщики курсов
                    arrTypesOrgsConds.push( "$elem/is_provider_courses = false()" );
                    break;
            }
        }
    }
    if ( ArrayOptFirstElem( arrTypesOrgsConds ) != undefined )
        arrXQConds.push( "( " + ArrayMerge(arrTypesOrgsConds, "This", " or ") + " )" );
    else
        arrXQConds.push("1 = 0");

    var sXQConds = ArrayOptFirstElem(arrXQConds) == undefined ? "" : " where " + ArrayMerge(arrXQConds, "This", " and ");
    var sReq = "for $elem in education_orgs" + sXQConds + " order by $elem/name return $elem/Fields('id','code','disp_name','name')";
    var xarrEduOrgs = tools.xquery(sReq);

    if ( ArrayOptFirstElem( arrReturnData ) != undefined )
    {
        for ( itemReturnData in arrReturnData )
        {
            switch ( itemReturnData )
            {
                case "lectors_count": //число преподавателей, в которых указана данная обучающая организация
                    sReq = "for $elem in education_org_lectors where MatchSome($elem/education_org_id, (" + ArrayMerge(xarrEduOrgs, "This.id.Value", ",") + ")) return $elem/Fields('education_org_id')"
                    var xarrEduOrgsLectors = tools.xquery(sReq);
                    break;
                case "education_method_count": //число учебных программ, в которых указана данная обучающая организация
                    sReq = "for $elem in education_methods where MatchSome($elem/education_org_id, (" + ArrayMerge(xarrEduOrgs, "This.id.Value", ",") + ")) return $elem/Fields('education_org_id')";
                    var xarrEduMethods = tools.xquery(sReq);
                    break;
                case "event_count": //число мероприятий, в которых указана данная обучающая организация
                    sReq = "for $elem in events where MatchSome($elem/education_org_id, (" + ArrayMerge(xarrEduOrgs, "This.id.Value", ",") + ")) return $elem/Fields('education_org_id')";
                    var xarrEvents = tools.xquery(sReq);
                    break;
            }
        }
    }

    for ( oItem in xarrEduOrgs )
    {
        oElem = {
            id: oItem.id.Value,
            disp_name: oItem.disp_name.Value,
            name: oItem.name.Value,
            provider_courses: (oItem.is_provider_courses.HasValue ? (oItem.is_provider_courses.Value ? i18n.t( 'da_1' ) : i18n.t( 'net_1' )) : i18n.t( 'net_1' )),
            lectors_count: null,
            education_method_count: null,
            event_count: null
        };

        if ( ArrayOptFirstElem( arrReturnData ) != undefined )
        {
            for ( itemReturnData in arrReturnData )
            {
                switch ( itemReturnData )
                {
                    case "lectors_count": //число преподавателей, в которых указана данная обучающая организация
                        oElem.lectors_count = ArrayCount( ArraySelect( xarrEduOrgsLectors, "This.education_org_id.Value == oItem.id.Value" ) );
                        break;
                    case "education_method_count": //число учебных программ, в которых указана данная обучающая организация
                        oElem.education_method_count = ArrayCount( ArraySelect( xarrEduMethods, "This.education_org_id.Value == oItem.id.Value" ) );
                        break;
                    case "event_count": //число мероприятий, в которых указана данная обучающая организация
                        oElem.event_count = ArrayCount( ArraySelect( xarrEvents, "This.education_org_id.Value == oItem.id.Value" ) );
                        break;
                }
            }
        }
        oRes.array.push(oElem);
    }

    if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
    {
        var sFieldName = oCollectionParams.sort.FIELD;
        switch(sFieldName)
        {
            case "disp_name":
            case "name":
            case "provider_courses":
                sFieldName = "StrUpperCase("+sFieldName+")";
        }
        oRes.array = ArraySort(oRes.array, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
    }

    if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
    {
        oCollectionParams.paging.MANUAL = true;
        oCollectionParams.paging.TOTAL = ArrayCount(oRes.array);
        oRes.paging = oCollectionParams.paging;
        oRes.array = ArrayRange(oRes.array, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationMethodChangeLectorsResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 */
/**
 * @function EducationMethodChangeLectors
 * @memberof Websoft.WT.Event
 * @description Устанавливает список преподавателей в учебной программе
 * @author EO
 * @param {bigint} iEduMethodID - ID учебной программы
 * @param {bigint[]} arrLectorIDs - массив ID преподавателей
 * @returns {WTEducationMethodChangeLectorsResult}
 */
function EducationMethodChangeLectors( iEduMethodID, arrLectorIDs )
{
    var oRes = tools.get_code_library_result_object();

    if(!IsArray(arrLectorIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrLectorIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    iEduMethodID = OptInt( iEduMethodID );
    var docEduMethod = tools.open_doc(Int(iEduMethodID));
    if(docEduMethod == undefined || docEduMethod.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'peredannyyid' )+iEduMethodID+i18n.t( 'neyavlyaetsyaiduch' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "lector")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet' );
        return oRes;
    }

    var teEduMethod = docEduMethod.TopElem;
    teEduMethod.lectors.Clear();
    try
    {
        for ( itemLectorID in arrLectorIDs )
        {
            iLectorID = OptInt(itemLectorID);
            if(iLectorID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }
            oLector = teEduMethod.lectors.AddChild();
            oLector.lector_id = iLectorID;
        }
        docEduMethod.Save();
    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationMethodAddEducationProgramResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 */
/**
 * @function EducationMethodAddEducationProgram
 * @memberof Websoft.WT.Event
 * @description Добавляет учебные программы в наборы программ
 * @author EO
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @param {bigint[]} arrEduProgramIDs - массив ID наборов программ
 * @returns {WTEducationMethodAddEducationProgramResult}
 */
function EducationMethodAddEducationProgram( arrEduMethodIDs, arrEduProgramIDs )
{
    var oRes = tools.get_code_library_result_object();

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    if(!IsArray(arrEduProgramIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassiveuchebny' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduProgramIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenaboro' );
        return oRes;
    }

    docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_program")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_2' );
        return oRes;
    }

    try
    {
        for ( itemEduProgram in arrEduProgramIDs )
        {
            iEduProgram = OptInt( itemEduProgram );
            if(iEduProgram == undefined)
            {
                throw i18n.t( 'elementmassiva_1' );
            }
            docEduProgram = tools.open_doc( iEduProgram );

            if ( docEduProgram.TopElem.Name != "education_program" )
                throw i18n.t( 'elementmassiva_2' ) + itemEduProgram + i18n.t( 'neyavlyaetsyaidna' );

            for ( itemEduMethod in arrEduMethodIDs )
            {
                iEduMethod = OptInt( itemEduMethod );
                if( iEduMethod == undefined )
                {
                    throw i18n.t( 'elementmassiva_3' );
                }
                docEduProgram.TopElem.education_methods.ObtainChildByKey( iEduMethod );
            }
            docEduProgram.Save();
        }

    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationMethodChangeStateResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 */
/**
 * @function EducationMethodChangeState
 * @memberof Websoft.WT.Event
 * @description Изменяет статус учебных программ
 * @author EO
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @param {string} sState - Статус учебной программы для установки: "active" (Действующая), "archive" (Архив)
 * @returns {WTEducationMethodChangeStateResult}
 */
function EducationMethodChangeState( arrEduMethodIDs, sState )
{
    var oRes = tools.get_code_library_result_object();

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassiveuchebny' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    if ( sState == null || sState == undefined || sState == "")
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan' );
        return oRes;
    }

    if ( sState != "active" && sState != "archive" )
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan' );
        return oRes;
    }

    try
    {
        for ( itemEduMethod in arrEduMethodIDs )
        {
            iEduMethod = OptInt( itemEduMethod );
            if( iEduMethod == undefined )
            {
                throw i18n.t( 'elementmassiva_3' );
            }

            docEduMethod = tools.open_doc(iEduMethod);
            if ( docEduMethod == undefined )
            {
                continue;
            }
            docEduMethod.TopElem.state_id = sState;
            docEduMethod.Save();
        }
    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationMethodDeleteResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} EducationMethodDeletedCount – количество удаленных учебных программ
 */
/**
 * @function EducationMethodDelete
 * @memberof Websoft.WT.Event
 * @description Удаляет учебные программы
 * @author EO
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @returns {WTEducationMethodDeleteResult}
 */
function EducationMethodDelete( arrEduMethodIDs )
{
    function IsEducationMethodInTDP( iTdpID, iEducationMethodID )
    {
        if ( ArrayOptFind(arrTdpIDs, "This == iTdpID") == undefined )
        {
            var docTDP = tools.open_doc( iTdpID );

            arrTdpIDs.push( iTdpID );
            if ( docTDP != undefined)
            {
                arrTdpTasks = ArrayUnion( arrTdpTasks, ArrayExtract( ArraySelect( docTDP.TopElem.tasks, "This.object_type.Value == 'education_method'" ) , "This.object_id.Value" ) );
            }
        }

        if ( ArrayOptFind(arrTdpTasks, "This == iEducationMethodID") != undefined )
        {
            return true
        }
        else
        {
            return false
        }
    }

    function IsEducationMethodInCareerReserve( iCareerReserveID, iEducationMethodID )
    {
        if ( ArrayOptFind(arrCareerReserveIDs, "This == iCareerReserveID") == undefined )
        {
            var docCareerReserve = tools.open_doc( iCareerReserveID );

            arrCareerReserveIDs.push( iCareerReserveID );
            if ( docCareerReserve != undefined)
            {
                arrCareerReserveTasks = ArrayUnion( arrCareerReserveTasks, ArrayExtract( ArraySelect( docCareerReserve.TopElem.tasks, "This.object_type.Value == 'education_method'" ) , "This.object_id.Value" ) );
            }
        }

        if ( ArrayOptFind(arrCareerReserveTasks, "This == iEducationMethodID") != undefined )
        {
            return true
        }
        else
        {
            return false
        }
    }


    var oRes = tools.get_code_library_result_object();
    oRes.EducationMethodDeletedCount = 0;

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    var	xarrEvents = tools.xquery("for $elem in events where $elem/type_id = 'education_method' and MatchSome($elem/education_method_id, (" +  ArrayMerge( arrEduMethodIDs, "This", "," ) + ")) return $elem/Fields('education_method_id')");

    var	xarrCompProgramEduMethods = tools.xquery("for $elem in compound_program_education_methods where MatchSome($elem/education_method_id, (" +  ArrayMerge( arrEduMethodIDs, "This", "," ) + ")) return $elem/Fields('education_method_id')");

    var	xarrEduPlanCollabs = tools.xquery("for $elem in education_plan_collaborators where MatchSome($elem/education_method_id, (" +  ArrayMerge( arrEduMethodIDs, "This", "," ) + ")) return $elem/Fields('education_method_id')");

    var	xarrEduProgrEduMethods = tools.xquery("for $elem in education_program_education_methods where MatchSome($elem/education_method_id, (" +  ArrayMerge( arrEduMethodIDs, "This", "," ) + ")) return $elem/Fields('education_method_id')");

    var arrTdpIDs = [];
    var arrTdpTasks = [];
    var arrCareerReserveIDs = [];
    var arrCareerReserveTasks = [];

    for ( itemEduMethodID in arrEduMethodIDs )
    {
        try
        {
            iEduMethodID = OptInt(itemEduMethodID);
            if(iEduMethodID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }

            if ( ArrayOptFind( xarrEvents, "OptInt(This.education_method_id.Value, -1) == iEduMethodID" ) != undefined )
            {
                continue;
            }
            if ( ArrayOptFind( xarrCompProgramEduMethods, "OptInt(This.education_method_id.Value, -1) == iEduMethodID" ) != undefined )
            {
                continue;
            }
            if ( ArrayOptFind( xarrEduPlanCollabs, "OptInt(This.education_method_id.Value, -1) == iEduMethodID" ) != undefined )
            {
                continue;
            }
            if ( ArrayOptFind( xarrEduProgrEduMethods, "OptInt(This.education_method_id.Value, -1) == iEduMethodID" ) != undefined )
            {
                continue;
            }

            bFoundInTDP = false;
            xarrTDP = tools.xquery("for $elem in typical_development_programs return $elem/Fields('id')");
            for ( oTDP in xarrTDP )
            {
                if ( IsEducationMethodInTDP(oTDP.id.Value, iEduMethodID) )
                {
                    bFoundInTDP = true;
                    break;
                }
            }
            if ( bFoundInTDP )
            {
                continue;
            }


            bFoundInCareerReserve = false;
            xarrCareerReserve = tools.xquery("for $elem in career_reserves where MatchSome($elem/status, ('active', 'plan')) return $elem/Fields('id')");
            for ( oCareerReserve in xarrCareerReserve )
            {
                if ( IsEducationMethodInCareerReserve(oCareerReserve.id.Value, iEduMethodID) )
                {
                    bFoundInCareerReserve = true;
                    break;
                }

            }
            if ( bFoundInCareerReserve )
            {
                continue;
            }

            DeleteDoc( UrlFromDocID( Int( iEduMethodID ) ) );
            oRes.EducationMethodDeletedCount++;
        }
        catch( err )
        {
            oRes.error = 504;
            oRes.errorText = err;
        }
    }

    return oRes;
}


/**
 * @function EducationMethodOpenFullPostAction
 * @memberof Websoft.WT.Event
 * @description Проставляет категории у объекта, заданного параметром iEducationMethodID. Категории берутся из teRemoteAction. Эта функция - post_action, вызываемая при сохранении карточки учебной программы
 * @author EO
 * @param {bigint} iEducationMethodID - ID учебной программы
 * @param {boolean} bIsEdit - состояние параметра is_edit объекта-команды вызова карточки (command: "open_doc"...)
 * @param {bigint} iAppID - id текущего приложения
 * @param {oPaging} teRemoteAction - TopElem текущего удаленного действия
 * @returns {oSimpleResult}
 */
function EducationMethodOpenFullPostAction( iEducationMethodID, bIsEdit, iAppID, teRemoteAction )
{
    oRes = tools.get_code_library_result_object();

    try
    {
        sFormFields = teRemoteAction.wvars.ObtainChildByKey( 'form_fields' ).value;
        oFormFields = ParseJson( sFormFields );
        sRoleIDs = ArrayOptFind( oFormFields, "This.name == 'roles_id'" );
        arrRoleIDs = tools_web.parse_multiple_parameter( sRoleIDs.value );

        if ( ArrayOptFirstElem(arrRoleIDs) == undefined )
        {
            return oRes;
        }

        iEducationMethodID = OptInt( iEducationMethodID );
        if ( iEducationMethodID != undefined )
        {
            var docEducationMethod = tools.open_doc( iEducationMethodID );
            if ( docEducationMethod != undefined && docEducationMethod.TopElem.Name == "education_method" )
            {
                for ( iRoleID in arrRoleIDs )
                {
                    iRoleID = OptInt( iRoleID );
                    if ( iRoleID != undefined )
                    {
                        docEducationMethod.TopElem.role_id.ObtainByValue ( iRoleID )
                    }
                }
                docEducationMethod.Save();
            }
        }
    }
    catch (err)
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaprivypolneniifunktcii' ) + ' EducationMethodOpenFullPostAction: ' + err;
    }
    return oRes;
}


/**
 * @function EducationProgramOpenFullPostAction
 * @memberof Websoft.WT.Event
 * @description Проставляет категории у объекта, заданного параметром iEducationProgramID. Категории берутся из teRemoteAction. Эта функция - post_action, вызываемая при сохранении карточки набора программ
 * @author EO
 * @param {bigint} iEducationProgramID - ID набора программ
 * @param {boolean} bIsEdit - состояние параметра is_edit объекта-команды вызова карточки (command: "open_doc"...)
 * @param {bigint} iAppID - id текущего приложения
 * @param {oPaging} teRemoteAction - TopElem текущего удаленного действия
 * @returns {oSimpleResult}
 */
function EducationProgramOpenFullPostAction( iEducationProgramID, bIsEdit, iAppID, teRemoteAction )
{
    oRes = tools.get_code_library_result_object();

    try
    {
        sFormFields = teRemoteAction.wvars.ObtainChildByKey( 'form_fields' ).value;
        oFormFields = ParseJson( sFormFields );
        sRoleIDs = ArrayOptFind( oFormFields, "This.name == 'roles_id'" );
        arrRoleIDs = tools_web.parse_multiple_parameter( sRoleIDs.value );

        if ( ArrayOptFirstElem(arrRoleIDs) == undefined )
        {
            return oRes;
        }

        iEducationProgramID = OptInt( iEducationProgramID );
        if ( iEducationProgramID != undefined )
        {
            var docEducationProgram = tools.open_doc( iEducationProgramID );
            if ( docEducationProgram != undefined && docEducationProgram.TopElem.Name == "education_program" )
            {
                for ( iRoleID in arrRoleIDs )
                {
                    iRoleID = OptInt( iRoleID );
                    if ( iRoleID != undefined )
                    {
                        docEducationProgram.TopElem.role_id.ObtainByValue ( iRoleID )
                    }
                }
                docEducationProgram.Save();
            }
        }
    }
    catch (err)
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaprivypolneniifunktcii' ) + ' EducationProgramOpenFullPostAction: ' + err;
    }
    return oRes;
}


/**
 * @function LectorOpenFullPostAction
 * @memberof Websoft.WT.Event
 * @description Проставляет категории у объекта, заданного параметром iLectorID. Категории берутся из teRemoteAction. Эта функция - post_action, вызываемая при сохранении карточки преподавателя
 * @author EO
 * @param {bigint} iLectorID - ID преподавателя
 * @param {boolean} bIsEdit - состояние параметра is_edit объекта-команды вызова карточки (command: "open_doc"...)
 * @param {bigint} iAppID - id текущего приложения
 * @param {oPaging} teRemoteAction - TopElem текущего удаленного действия
 * @returns {oSimpleResult}
 */
function LectorOpenFullPostAction( iLectorID, bIsEdit, iAppID, teRemoteAction )
{
    oRes = tools.get_code_library_result_object();

    try
    {
        sFormFields = teRemoteAction.wvars.ObtainChildByKey( 'form_fields' ).value;
        oFormFields = ParseJson( sFormFields );
        sRoleIDs = ArrayOptFind( oFormFields, "This.name == 'roles_id'" );
        arrRoleIDs = tools_web.parse_multiple_parameter( sRoleIDs.value );

        if ( ArrayOptFirstElem(arrRoleIDs) == undefined )
        {
            return oRes;
        }

        iLectorID = OptInt( iLectorID );
        if ( iLectorID != undefined )
        {
            var docLector = tools.open_doc( iLectorID );
            if ( docLector != undefined && docLector.TopElem.Name == "lector" )
            {
                for ( iRoleID in arrRoleIDs )
                {
                    iRoleID = OptInt( iRoleID );
                    if ( iRoleID != undefined )
                    {
                        docLector.TopElem.role_id.ObtainByValue ( iRoleID )
                    }
                }
                docLector.Save();
            }
        }
    }
    catch (err)
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaprivypolneniifunktcii' ) + ' LectorOpenFullPostAction: ' + err;
    }
    return oRes;
}


/**
 * @function EducationOrgOpenFullPostAction
 * @memberof Websoft.WT.Event
 * @description Проставляет категории у объекта, заданного параметром iEducationOrgID. Категории берутся из teRemoteAction. Эта функция - post_action, вызываемая при сохранении карточки обучающей организации
 * @author EO
 * @param {bigint} iEducationOrgID - ID обучающей организации
 * @param {boolean} bIsEdit - состояние параметра is_edit объекта-команды вызова карточки (command: "open_doc"...)
 * @param {bigint} iAppID - id текущего приложения
 * @param {oPaging} teRemoteAction - TopElem текущего удаленного действия
 * @returns {oSimpleResult}
 */
function EducationOrgOpenFullPostAction( iEducationOrgID, bIsEdit, iAppID, teRemoteAction )
{
    oRes = tools.get_code_library_result_object();

    try
    {
        sFormFields = teRemoteAction.wvars.ObtainChildByKey( 'form_fields' ).value;
        oFormFields = ParseJson( sFormFields );
        sRoleIDs = ArrayOptFind( oFormFields, "This.name == 'roles_id'" );
        arrRoleIDs = tools_web.parse_multiple_parameter( sRoleIDs.value );

        if ( ArrayOptFirstElem(arrRoleIDs) == undefined )
        {
            return oRes;
        }

        iEducationOrgID = OptInt( iEducationOrgID );
        if ( iEducationOrgID != undefined )
        {
            var docEducationOrg = tools.open_doc( iEducationOrgID );
            if ( docEducationOrg != undefined && docEducationOrg.TopElem.Name == "education_org" )
            {
                for ( iRoleID in arrRoleIDs )
                {
                    iRoleID = OptInt( iRoleID );
                    if ( iRoleID != undefined )
                    {
                        docEducationOrg.TopElem.role_id.ObtainByValue ( iRoleID )
                    }
                }
                docEducationOrg.Save();
            }
        }
    }
    catch (err)
    {
        oRes.error = 1;
        oRes.errorText = i18n.t( 'oshibkaprivypolneniifunktcii' ) + ' EducationOrgOpenFullPostAction: ' + err;
    }
    return oRes;
}


/**
 * @typedef {Object} WTEducationProgramChangeProgramsResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 */
/**
 * @function EducationProgramChangePrograms
 * @memberof Websoft.WT.Event
 * @description Устанавливает учебные программы в наборе программ
 * @author EO
 * @param {bigint} iEduProgramID - ID набора программ
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @returns {WTEducationProgramChangeProgramsResult}
 */
function EducationProgramChangePrograms( iEduProgramID, arrEduMethodIDs )
{
    var oRes = tools.get_code_library_result_object();

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    iEduProgramID = OptInt( iEduProgramID );
    var docEduProgram = tools.open_doc(Int(iEduProgramID));
    if(docEduProgram == undefined || docEduProgram.TopElem.Name != "education_program")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'peredannyyid' )+iEduProgramID+i18n.t( 'neyavlyaetsyaidna_1' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    var teEduProgram = docEduProgram.TopElem;
    teEduProgram.education_methods.Clear();
    try
    {
        for ( itemEduMethodID in arrEduMethodIDs )
        {
            iEduMethodID = OptInt(itemEduMethodID);
            if(iEduMethodID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }
            oEduMethod = teEduProgram.education_methods.AddChild();
            oEduMethod.education_method_id = iEduMethodID;
        }
        docEduProgram.Save();
    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationProgramDeleteResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} EducationProgramDeletedCount – количество удаленных наборов программ
 */
/**
 * @function EducationProgramDelete
 * @memberof Websoft.WT.Event
 * @description Удаляет наборы программ
 * @author EO
 * @param {bigint[]} arrEduProgramIDs - массив ID наборов программ
 * @returns {WTEducationProgramDeleteResult}
 */
function EducationProgramDelete( arrEduProgramIDs )
{
    var oRes = tools.get_code_library_result_object();
    oRes.EducationProgramDeletedCount = 0;

    if(!IsArray(arrEduProgramIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduProgramIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_program")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_2' );
        return oRes;
    }

    var	xarrEvents = tools.xquery("for $elem in events where $elem/type_id = 'education_method_from_program' and MatchSome($elem/education_program_id, (" +  ArrayMerge( arrEduProgramIDs, "This", "," ) + ")) return $elem/Fields('education_program_id')");

    var	xarrCompProgramEduMethods = tools.xquery("for $elem in compound_program_education_methods where $elem/object_type = 'education_program' and MatchSome($elem/object_id, (" +  ArrayMerge( arrEduProgramIDs, "This", "," ) + ")) return $elem/Fields('object_id')");

    var	xarrEduPlanCollabs = tools.xquery("for $elem in education_plan_collaborators where MatchSome($elem/education_program_id, (" +  ArrayMerge( arrEduProgramIDs, "This", "," ) + ")) return $elem/Fields('education_program_id')");

    for ( itemEduProgramID in arrEduProgramIDs )
    {
        try
        {
            iEduProgramID = OptInt(itemEduProgramID);
            if(iEduProgramID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }

            if ( ArrayOptFind( xarrEvents, "OptInt(This.education_program_id.Value, -1) == iEduProgramID" ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrCompProgramEduMethods, "OptInt(This.object_id.Value, -1) == iEduProgramID" ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrEduPlanCollabs, "OptInt(This.education_program_id.Value, -1) == iEduProgramID" ) != undefined )
            {
                continue;
            }

            DeleteDoc( UrlFromDocID( Int( iEduProgramID ) ) );
            oRes.EducationProgramDeletedCount++;
        }
        catch( err )
        {
            oRes.error = 504;
            oRes.errorText = err;
        }
    }

    return oRes;
}


/**
 * @typedef {Object} WTLectorsAddEducationMethodResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 */
/**
 * @function LectorsAddEducationMethod
 * @memberof Websoft.WT.Event
 * @description Добавляет преподавателей в учебные программы
 * @author EO
 * @param {bigint[]} arrLectorIDs - массив ID преподавателей
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @returns {WTLectorsAddEducationMethodResult}
 */
function LectorsAddEducationMethod( arrLectorIDs, arrEduMethodIDs )
{
    var oRes = tools.get_code_library_result_object();

    if(!IsArray(arrLectorIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrLectorIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassiveprepod' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "lector")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet' );
        return oRes;
    }

    catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassiveuchebny' );
        return oRes;
    }

    docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    try
    {
        for ( itemLector in arrEduMethodIDs )
        {
            iLector = OptInt( itemLector );
            if(iLector == undefined)
            {
                throw i18n.t( 'elementmassiva_3' );
            }
            docEduMethod = tools.open_doc( iLector );

            if ( docEduMethod.TopElem.Name != "education_method" )
                throw i18n.t( 'elementmassiva_4' ) + itemLector + i18n.t( 'neyavlyaetsyaiduch' );

            for ( itemLector in arrLectorIDs )
            {
                iLector = OptInt( itemLector );
                if( iLector == undefined )
                {
                    throw i18n.t( 'elementmassiva_5' );
                }
                docEduMethod.TopElem.lectors.ObtainChildByKey( iLector );
            }
            docEduMethod.Save();
        }

    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTLectorsAddEducationOrgResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} LectorCount – количество удаленных учебных программ
 */
/**
 * @function LectorsAddEducationOrg
 * @memberof Websoft.WT.Event
 * @description Относит преподавателей к обучающей организации
 * @author EO
 * @param {bigint} iEduOrgID - ID обучающей организации
 * @param {bigint[]} arrLectorIDs - массив ID преподавателей
 * @param {string} sCanRemove - Действие с преподавателем, если он уже отнесен к какой либо обучающей организации: "skip" (Пропускать), "move" (Переносить), "copy" (Копировать)
 * @returns {WTLectorsAddEducationOrgResult}
 */
function LectorsAddEducationOrg( iEduOrgID, arrLectorIDs, sCanRemove )
// Используется, по крайней мере, в двух УД: LectorsAddEducationOrg и EducationOrgChangeLectors
{
    function ClearLectorFromEduOrgs()
    {
        for ( oEduOrgLector in ArraySelect( xarrEduOrgLectors, 'This.lector_id.Value == iLectorID' ) )
        {
            docEducationOrg = tools.open_doc( oEduOrgLector.education_org_id.Value );
            if ( docEducationOrg == undefined )
                continue;

            docEducationOrg.TopElem.lectors.DeleteChildByKey( iLectorID );

            docEducationOrg.Save();
        }
    }

    var oRes = tools.get_code_library_result_object();
    oRes.LectorCount = 0;

    if(!IsArray(arrLectorIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrLectorIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    iEduOrgID = OptInt( iEduOrgID );
    var docEduOrg = tools.open_doc(Int(iEduOrgID));
    if(docEduOrg == undefined || docEduOrg.TopElem.Name != "education_org")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'peredannyyid' )+iEduOrgID+i18n.t( 'neyavlyaetsyaidob' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "lector")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet' );
        return oRes;
    }

    if ( sCanRemove == null || sCanRemove == undefined || sCanRemove == "")
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan_1' );
        return oRes;
    }

    if ( sCanRemove != "skip" && sCanRemove != "copy" && sCanRemove != "move" )
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan_1' );
        return oRes;
    }

    var teEduOrg = docEduOrg.TopElem;
    try
    {
        var xarrEduOrgLectors = ArraySelectAll( tools.xquery( "for $elem in education_org_lectors where $elem/education_org_id != " + XQueryLiteral(iEduOrgID) + " and MatchSome($elem/lector_id, (" +  ArrayMerge( arrLectorIDs, "This", "," ) + ")) return $elem/Fields('education_org_id','lector_id')" ) );

        for ( itemLectorID in arrLectorIDs )
        {
            iLectorID = OptInt(itemLectorID);
            if(iLectorID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }
            if ( ArrayOptFind( xarrEduOrgLectors, 'This.lector_id.Value == iLectorID' ) != undefined )
            {
                switch ( sCanRemove )
                {
                    case 'skip':
                        continue;
                    case 'move':
                        ClearLectorFromEduOrgs();
                        break;
                }

            }

            teEduOrg.lectors.ObtainChildByKey( iLectorID )
            oRes.LectorCount++;
        }
        docEduOrg.Save();
    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @typedef {Object} WTLectorDeleteResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} LectorDeletedCount – количество удаленных преподавателей
 */
/**
 * @function LectorDelete
 * @memberof Websoft.WT.Event
 * @description Удаляет преподавателей
 * @author EO
 * @param {bigint[]} arrLectorIDs - массив ID преподавателей
 * @returns {WTLectorDeleteResult}
 */
function LectorDelete( arrLectorIDs )
{
    var oRes = tools.get_code_library_result_object();
    oRes.LectorDeletedCount = 0;

    if(!IsArray(arrLectorIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrLectorIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "lector")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet' );
        return oRes;
    }

    var xarrEventLectors = ArraySelectAll( tools.xquery("for $elem in event_lectors where MatchSome($elem/lector_id, (" +  ArrayMerge( arrLectorIDs, "This", "," ) + ")) return $elem/Fields('lector_id')") );

    var	xarrEduMethodLectors = ArraySelectAll( tools.xquery("for $elem in education_method_lectors where MatchSome($elem/lector_id, (" +  ArrayMerge( arrLectorIDs, "This", "," ) + ")) return $elem/Fields('lector_id')") );

    var xarrEduOrgLectors = ArraySelectAll( tools.xquery( "for $elem in education_org_lectors where MatchSome($elem/lector_id, (" +  ArrayMerge( arrLectorIDs, "This", "," ) + ")) return $elem/Fields('education_org_id','lector_id')" ) );

    for ( itemLectorID in arrLectorIDs )
    {
        try
        {
            iLectorID = OptInt(itemLectorID);
            if(iLectorID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }

            if ( ArrayOptFind( xarrEventLectors, "OptInt(This.lector_id.Value, -1) == iLectorID" ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrEduMethodLectors, "OptInt(This.lector_id.Value, -1) == iLectorID" ) != undefined )
            {
                continue;
            }

            for ( oEduOrgLector in ArraySelect( xarrEduOrgLectors, 'This.lector_id.Value == iLectorID' ) )
            {
                docEducationOrg = tools.open_doc( oEduOrgLector.education_org_id.Value );
                if ( docEducationOrg == undefined )
                    continue;

                docEducationOrg.TopElem.lectors.DeleteChildByKey( iLectorID );

                docEducationOrg.Save();
            }

            DeleteDoc( UrlFromDocID( Int( iLectorID ) ) );
            oRes.LectorDeletedCount++;
        }
        catch( err )
        {
            oRes.error = 504;
            oRes.errorText = err;
        }
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationOrgDeleteResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} EducationOrgDeletedCount – количество удаленных провайдеров
 */
/**
 * @function EducationOrgDelete
 * @memberof Websoft.WT.Event
 * @description Удаляет провайдеры
 * @author EO
 * @param {bigint[]} arrEducationOrgIDs - массив ID провайдеров
 * @returns {WTEducationOrgDeleteResult}
 */
function EducationOrgDelete( arrEducationOrgIDs )
{
    var oRes = tools.get_code_library_result_object();
    oRes.EducationOrgDeletedCount = 0;

    if(!IsArray(arrEducationOrgIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEducationOrgIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_org")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_3' );
        return oRes;
    }

    var xarrCourses = tools.xquery("for $elem in courses where MatchSome($elem/education_org_id, (" + ArrayMerge( arrEducationOrgIDs, "This", "," ) + ")) return $elem/Fields('education_org_id')");

    var xarrEvents = tools.xquery("for $elem in events where MatchSome($elem/education_org_id, (" +  ArrayMerge( arrEducationOrgIDs, "This", "," ) + ")) return $elem/Fields('education_org_id')");

    var xarrEduMethods = tools.xquery("for $elem in education_methods where MatchSome($elem/education_org_id, (" +  ArrayMerge( arrEducationOrgIDs, "This", "," ) + ")) return $elem/Fields('education_org_id')");

    for ( itemEduOrgID in arrEducationOrgIDs )
    {
        try
        {
            iEduOrgID = OptInt(itemEduOrgID);
            if(iEduOrgID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }

            if ( ArrayOptFind( xarrCourses, "OptInt(This.education_org_id.Value, -1) == iEduOrgID" ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrEvents, "OptInt(This.education_org_id.Value, -1) == iEduOrgID" ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrEduMethods, "OptInt(This.education_org_id.Value, -1) == iEduOrgID" ) != undefined )
            {
                continue;
            }

            DeleteDoc( UrlFromDocID( Int( iEduOrgID ) ) );
            oRes.EducationOrgDeletedCount++;
        }
        catch( err )
        {
            oRes.error = 504;
            oRes.errorText = err;
        }
    }

    return oRes;
}


/**
 * @typedef {Object} WTEducationMethodChangeOrgResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} EduMethodCount – количество измененных учебных программ
 */
/**
 * @function EducationMethodChangeOrg
 * @memberof Websoft.WT.Event
 * @description Изменяет обучающую организацию в учебных программах
 * @author EO
 * @param {bigint} iEduOrgID - ID обучающей организации
 * @param {bigint[]} arrEduMethodIDs - массив ID учебных программ
 * @param {string} sCanRewrite - Действие с учебной программой, если обучающая организация в ней уже заполнена: "skip" (Пропускать), "overwrite" (Перезаписывать)
 * @returns {WTEducationMethodChangeOrgResult}
 */
function EducationMethodChangeOrg( iEduOrgID, arrEduMethodIDs, sCanRewrite )
// Используется, по крайней мере, в двух УД: EducationMethodChangeOrg и EducationOrgChangePrograms
{
    var oRes = tools.get_code_library_result_object();
    oRes.EduMethodCount = 0;

    if(!IsArray(arrEduMethodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrEduMethodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    iEduOrgID = OptInt( iEduOrgID );
    var docEduOrg = tools.open_doc(Int(iEduOrgID));
    if(docEduOrg == undefined || docEduOrg.TopElem.Name != "education_org")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'peredannyyid' )+iEduOrgID+i18n.t( 'neyavlyaetsyaidob' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "education_method")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
        return oRes;
    }

    if ( sCanRewrite == null || sCanRewrite == undefined || sCanRewrite == "")
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan_2' );
        return oRes;
    }

    if ( sCanRewrite != "skip" && sCanRewrite != "overwrite" )
    {
        oRes.error = 504;
        oRes.errorText = i18n.t( 'nevernoperedan_2' );
        return oRes;
    }

    try
    {
        var xarrEduMethods = tools.xquery( "for $elem in education_methods where MatchSome($elem/id, (" +  ArrayMerge( arrEduMethodIDs, "This", "," ) + ")) return $elem/Fields('id', 'type', 'education_org_id')" );

        for ( itemEduMethodID in arrEduMethodIDs )
        {
            iEduMethodID = OptInt(itemEduMethodID);
            if(iEduMethodID == undefined)
            {
                throw i18n.t( 'elementmassiva' );
            }

            if ( ArrayOptFind( xarrEduMethods, "OptInt(This.id.Value, -1) == iEduMethodID && This.type.Value == 'course' " ) != undefined )
            {
                continue;
            }

            if ( ArrayOptFind( xarrEduMethods, 'This.id.Value == iEduMethodID && This.education_org_id.Value != null' ) != undefined )
            {
                if ( sCanRewrite == 'skip' )
                {
                    continue;
                }

            }

            docEduMethod = tools.open_doc( iEduMethodID);
            if ( docEduMethod == undefined )
                continue;

            if ( docEduMethod.TopElem.Name != "education_method" )
                throw i18n.t( 'elementmassiva_4' ) + itemEduMethodID + i18n.t( 'neyavlyaetsyaiduch' );


            docEduMethod.TopElem.education_org_id = iEduOrgID;
            docEduMethod.Save();
            oRes.EduMethodCount++;
        }
    }
    catch( err )
    {
        oRes.error = 504;
        oRes.errorText = err;
    }

    return oRes;
}


/**
 * @function toLog
 * @memberof Websoft.WT.Staff
 * @author BG
 * @description Запись в лог подсистемы.
 * @param {string} sText - Записываемое сообщение
 * @param {boolean} bDebug - вкл/выкл вывода
 */
function toLog(sText, bDebug)
{
    /*
		запись сообщения в лог
		sText		- сообщение
		bDebug		- писать или нет сообщение
	*/
    try
    {
        if( bDebug == undefined || bDebug == null )
            throw "error";
        bDebug = tools_web.is_true( bDebug );
    }
    catch( ex )
    {
        bDebug = global_settings.debug;
    }

    if( bDebug )
    {
        EnableLog('lib_event_library');
        LogEvent('lib_event_library', sText )
    }
}
/**
 * @typedef {Object} DeleteBudgetResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */
/**
 * @function DeleteBudget
 * @memberof Websoft.WT.Event
 * @description Удаление бюджета
 * @param {bigint[]} arrBudgetIDs - Массив ID бюджетов, подлежащих удалению
 * @returns {DeleteBudgetResult}
 */
/* copy to @component budgets */
function DeleteBudget( arrBudgetIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;

    if(!IsArray(arrBudgetIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrBudgetIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "budget")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut' );
        return oRes;
    }

    for(iBudgetID in arrBudgetIDs)
    {
        try
        {
            sSQL = "for $elem in budgets where contains( $elem/id, ('" + XQueryLiteral(iBudgetID) + "') ) return $elem"

            oBudgetObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetObject == undefined)
                continue;

            DeleteDoc(UrlFromDocID(OptInt(iBudgetID)), false);
            oRes.count++;
        }
        catch(err)
        {
            toLog("ERROR: DeleteBudget: " + ("[" + iBudgetID + "]\r\n") + err, true);
        }
    }

    return oRes;
}

/**
 * @typedef {Object} DeleteBudgetTypeResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */
/**
 * @function DeleteBudgetType
 * @memberof Websoft.WT.Event
 * @author IG
 * @description Удаление типов бюджета
 * @param {bigint[]} arrBudgetTypeIDs - Массив ID типов бюджета, подлежащих удалению
 * @returns {DeleteBudgetTypeResult}
 */
/* copy to @component budgets */
function DeleteBudgetType( arrBudgetTypeIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;
    var countHasObject = 0

    if(!IsArray(arrBudgetTypeIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrBudgetTypeIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "budget_type")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_1' );
        return oRes;
    }

    for(iBudgetTypeID in arrBudgetTypeIDs)
    {
        try
        {
            sSQL = "for $elem in budget_types where contains( $elem/id, ('" + XQueryLiteral(iBudgetTypeID) + "') ) return $elem"
            oBudgetTypeObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oBudgetTypeObject == undefined)
                continue;

            sSQL = "for $elem in budgets where contains( $elem/type_id, ('" + XQueryLiteral(iBudgetTypeID) + "') ) return $elem"
            oBudgetObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oBudgetObject != undefined)
                continue;

            DeleteDoc( UrlFromDocID( iBudgetTypeID ), false);
            oRes.count++;
        }
        catch(err)
        {
            toLog("ERROR: DeleteBudgetType: " + ("[" + iBudgetTypeID + "]\r\n") + err, true);
        }
    }

    return oRes;
}

/**
 * @typedef {Object} DeleteExpenseItemResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */
/**
 * @function DeleteExpenseItem
 * @memberof Websoft.WT.Event
 * @author IG
 * @description Удаление статей затрат
 * @param {bigint[]} arrExpenseItemIDs - Массив ID статей затрат, подлежащих удалению
 * @returns {DeleteExpenseItemResult}
 */
/* copy to @component budgets */
function DeleteExpenseItem( arrExpenseItemIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;
    var checkHas = false;

    if(!IsArray(arrExpenseItemIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrExpenseItemIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "expense_item")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_2' );
        return oRes;
    }

    for(iExpenseItemID in arrExpenseItemIDs)
    {
        try
        {
            checkHas = false

            sSQL = "for $elem in expense_items where contains( $elem/id, ('" + XQueryLiteral(iExpenseItemID) + "') ) return $elem"
            oExpenseItemObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oExpenseItemObject == undefined)
                continue;

            /*
				Для каждой статьи затрат проверяется, используется ли она хотя бы в одном объекте разных каталогов.
				Если нет, то статья затрат удаляется, иначе пропускается. Проверяем объекты следующих каталогов:
					* Статьи затрат (есть или нет подчиненные) * expense_item
					* Бюджеты * budget
					* Затраты * pay_phase
					* Результаты мероприятия * event_result
					* Мероприятия * event
			*/

            /* Статьи затрат (есть или нет подчиненные) */
            sSQL = "for $elem in expense_items where contains( $elem/parent_id, ('" + XQueryLiteral(iExpenseItemID) + "') ) return $elem"
            oExpenseItemChildObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oExpenseItemChildObject != undefined)
                continue;

            /* Бюджеты */
            sSQL = "for $elem in budgets where contains( $elem/expense_item_id, ('" + XQueryLiteral(iExpenseItemID) + "') ) return $elem"
            oBudgetObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetObject != undefined)
                continue;

            /* Затраты */
            sSQL = "for $elem in pay_phases return $elem";
            aPayPhaseObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iPayPhaseObjectID in aPayPhaseObjectIDs)
            {
                docPayPhase = tools.open_doc( iPayPhaseObjectID );
                docPayPhaseTE = docPayPhase.TopElem;

                if (docPayPhaseTE != null)
                {
                    oPayPhaseObject = ArrayOptFind(docPayPhaseTE.expense_items, "OptInt(This.expense_item_id) == " + iExpenseItemID);
                    if(oPayPhaseObject != undefined){
                        checkHas = true;
                        continue;
                    }
                }
            }

            if(checkHas == true){
                continue;
            } else { /* Результаты мероприятия * event_result */
                sSQL = "for $elem in event_results return $elem";
                aEventResultObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

                for (iEventResultObjectID in aEventResultObjectIDs)
                {
                    docEventResult = tools.open_doc( iEventResultObjectID );
                    docEventResultTE = docEventResult.TopElem;

                    if (docEventResultTE != null)
                    {
                        oEventResultObject = ArrayOptFind(docEventResultTE.expense_items, "OptInt(This.expense_item_id) == " + iExpenseItemID);
                        if(oEventResultObject != undefined){
                            checkHas = true;
                            continue;
                        }
                    }
                }
            }

            if(checkHas == true){
                continue;
            } else { /* Мероприятия * event */

                sSQL = "for $elem in events return $elem";
                aEventObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

                for (iEventID in aEventObjectIDs)
                {
                    docEvent = tools.open_doc( OptInt(iEventID) );
                    docEventTE = docEvent.TopElem;

                    if (docEventTE != null){

                        /* Расписание */
                        if(ArrayCount(docEventTE.regular_schedule.expense_items) > 0)
                        {
                            oExpenseItems = ArrayOptFind(docEventTE.regular_schedule.expense_items, "This.expense_item_id == iExpenseItemID");

                            if(oExpenseItems != undefined)
                            {
                                checkHas = true;
                                continue;
                            }
                        }

                        /* Финансы -> Затраты */
                        if(ArrayCount(docEventTE.expense_items) > 0)
                        {
                            oExpenseItems = ArrayOptFind(docEventTE.expense_items, "This.expense_item_id == iExpenseItemID");

                            if(oExpenseItems != undefined)
                            {
                                checkHas = true;
                                continue;
                            }
                        }
                    }
                }
            }

            if(checkHas == true){
                continue;
            } else {
                DeleteDoc( UrlFromDocID( iExpenseItemID ), false);
                oRes.count++;
            }
        }
        catch(err)
        {
            toLog("ERROR: DeleteExpenseItem: " + ("[" + iExpenseItemID + "]\r\n") + err, true);
        }
    }

    return oRes;
}
/**
 * @typedef {Object} DeleteCostCenterResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */

/**
 * @function DeleteCostCenter
 * @memberof Websoft.WT.Event
 * @author IG
 * @description Удаление центров затрат
 * @param {bigint[]} arrCostCenterIDs - Массив ID центров затрат, подлежащих удалению
 * @returns {DeleteCostCenterResult}
 */
/* copy to @component budgets */
function DeleteCostCenter( arrCostCenterIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;
    var checkHas = false;

    if(!IsArray(arrCostCenterIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrCostCenterIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "cost_center")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_3' );
        return oRes;
    }

    for(iCostCenterID in arrCostCenterIDs)
    {
        try
        {
            checkHas = false

            sSQL = "for $elem in cost_centers where contains( $elem/id, ('" + XQueryLiteral(iCostCenterID) + "') ) return $elem"
            oCostCenterObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oCostCenterObject == undefined)
                continue;

            /*
				Для каждой статьи затрат проверяется, используется ли она хотя бы в одном объекте разных каталогов.
				Если нет, то центр затрат удаляется, иначе пропускается. Проверяем объекты следующих каталогов:
					* Центры затрат (есть или нет подчиненные) * cost_center
					* Бюджеты * budget
					* Затраты * pay_phase
					* Результаты мероприятия * event_result
					* Мероприятия * event
					* Сотрудники * collaborator
					* Подразделение * subdivision
			*/


            // Центры затрат (есть или нет подчиненные)
            sSQL = "for $elem in cost_centers where contains( $elem/parent_id, ('" + XQueryLiteral(iCostCenterID) + "') ) return $elem"
            oCostCenterChildObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oCostCenterChildObject != undefined)
                continue;

            // Бюджеты
            sSQL = "for $elem in budgets where contains( $elem/cost_center_id, ('" + XQueryLiteral(iCostCenterID) + "') ) return $elem"
            oBudgetObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetObject != undefined)
                continue;

            // Затраты
            sSQL = "for $elem in pay_phases return $elem";
            aPayPhaseObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iPayPhaseObjectID in aPayPhaseObjectIDs)
            {
                docPayPhase = tools.open_doc( iPayPhaseObjectID );
                docPayPhaseTE = docPayPhase.TopElem;

                if (docPayPhaseTE != null)
                {
                    oPayPhaseObject = ArrayOptFind(docPayPhaseTE.cost_centers, "OptInt(This.cost_center_id) == " + iCostCenterID);
                    if(oPayPhaseObject != undefined)
                    {
                        checkHas = true;
                        continue;
                    }
                }
            }

            if(checkHas == true)
                continue;

            //	Результаты мероприятия * event_result
            sSQL = "for $elem in event_results where contains( $elem/cost_center_id, ('" + XQueryLiteral(iCostCenterID) + "') ) return $elem"
            oEventResultObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oEventResultObject != undefined)
                continue;

            //	Мероприятия * event
            sSQL = "for $elem in events return $elem";
            aEventObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iEventID in aEventObjectIDs)
            {
                docEvent = tools.open_doc( OptInt(iEventID) );
                docEventTE = docEvent.TopElem;

                if (docEventTE != null){

                    if(ArrayCount(docEventTE.cost_centers) > 0)
                    {
                        oCostCenter = ArrayOptFind(docEventTE.cost_centers, "This.cost_center_id == iCostCenterID");

                        if(oCostCenter != undefined)
                        {
                            checkHas = true;
                            continue;
                        }
                    }
                }
            }

            if(checkHas == true)
                continue;

            //	Сотрудники * collaborator
            sSQL = "for $elem in collaborators return $elem";
            aCollaboratorObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iCollaboratorID in aCollaboratorObjectIDs)
            {
                docCollaborator = tools.open_doc( OptInt(iCollaboratorID) );
                docCollaboratorTE = docCollaborator.TopElem;

                if (docCollaboratorTE != null){

                    if(docCollaboratorTE.cost_center_id != null && docCollaboratorTE.cost_center_id == iCostCenterID)
                    {
                        checkHas = true;
                        continue;
                    }
                }
            }

            if(checkHas == true)
                continue;

            //	Подразделение * subdivision
            sSQL = "for $elem in subdivisions where contains( $elem/cost_center_id, ('" + XQueryLiteral(iCostCenterID) + "') ) return $elem"
            oSubdivisionObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oSubdivisionObject != undefined)
                continue;

            DeleteDoc( UrlFromDocID( iCostCenterID ), false);
            oRes.count++
        }
        catch(err)
        {
            toLog("ERROR: DeleteCostCenter: " + ("[" + iCostCenterID + "]\r\n") + err, true);
        }
    }

    return oRes;
}

/**
 * @typedef {Object} DeleteBudgetPeriodResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */

/**
 * @function DeleteBudgetPeriod
 * @memberof Websoft.WT.Event
 * @description Удаление бюджетного периода
 * @param {bigint[]} arrBudgetPeriodIDs - Массив ID бюджетных периодов, подлежащих удалению
 * @returns {DeleteBudgetPeriodResult}
 */
/* copy to @component budgets */
function DeleteBudgetPeriod( arrBudgetPeriodIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;
    var checkHas = false;

    if(!IsArray(arrBudgetPeriodIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrBudgetPeriodIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "budget_period")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_4' );
        return oRes;
    }

    for(iBudgetPeriodID in arrBudgetPeriodIDs)
    {
        try
        {
            checkHas = false

            sSQL = "for $elem in budget_periods where contains( $elem/id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"

            oBudgetPeriodObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetPeriodObject == undefined)
                continue;

            /*
				Для каждого бюджетного проверяется, используется ли он хотя бы в одном объекте разных каталогов.
				Если нет, то бюджетный период удаляется, иначе пропускается.

				Проверяем объекты следующих каталогов:
			*/

            /* Центры затрат (есть или нет подчиненные) */
            sSQL = "for $elem in budget_periods where contains( $elem/parent_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oBudgetPeriodChildObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetPeriodChildObject != undefined)
                continue;

            /* Бюджеты */
            sSQL = "for $elem in budgets where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oBudgetObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBudgetObject != undefined)
                continue;

            /* Затраты */
            sSQL = "for $elem in pay_phases return $elem";
            aPayPhaseObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iPayPhaseID in aPayPhaseObjectIDs)
            {
                docPayPhase = tools.open_doc( OptInt(iPayPhaseID) );
                docPayPhaseTE = docPayPhase.TopElem;

                if (docPayPhaseTE != null){

                    if(docPayPhaseTE.budget_period_id != null && docPayPhaseTE.budget_period_id == iBudgetPeriodID)
                    {
                        checkHas = true;
                        continue;
                    }
                }
            }

            if(checkHas == true)
                continue;

            /* Планы мероприятий */
            sSQL = "for $elem in training_plans where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oTrainingPlanObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oTrainingPlanObject != undefined)
                continue;

            /* Результаты мероприятия */
            sSQL = "for $elem in event_results where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oEventResultObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oEventResultObject != undefined)
                continue;

            /* Мероприятия */
            sSQL = "for $elem in events where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oEventObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oEventObject != undefined)
                continue;

            /* Планы оценки (Оценка персонала) */
            sSQL = "for $elem in assessment_plans where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oAssessmentPlanObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oAssessmentPlanObject != undefined)
                continue;

            /* Формы оценки (Оценка персонала) */
            sSQL = "for $elem in pas where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oPAObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oPAObject != undefined)
                continue;

            /* Премии * bonus_item (Премирование) */
            sSQL = "for $elem in bonus_items where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oBonusItemObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oBonusItemObject != undefined)
                continue;

            /* Планы подбора (Подбор персонала) */
            sSQL = "for $elem in recruitment_plans where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oRecruitmentPlanObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oRecruitmentPlanObject != undefined)
                continue;

            /* Выплаты сотрудникам (Компенсации и льготы)  */
            sSQL = "for $elem in payments where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oPaymentObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oPaymentObject != undefined)
                continue;

            /* Привилегии (Компенсации и льготы) */
            sSQL = "for $elem in benefit_items where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oPaymentObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oPaymentObject != undefined)
                continue;

            /* Полисы (Компенсации и льготы) */
            sSQL = "for $elem in policys where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oPolicyObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oPolicyObject != undefined)
                continue;

            /* Обзоры зарплат (Компенсации и льготы) */
            sSQL = "for $elem in salary_surveys where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oSalarySurveyObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oSalarySurveyObject != undefined)
                continue;

            /* Ключевые должности (план преемственности) */
            sSQL = "for $elem in key_positions where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oKeyPositionObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oKeyPositionObject != undefined)
                continue;

            /* Преемники (план преемственности) */
            sSQL = "for $elem in successors where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oSuccessorObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oSuccessorObject != undefined)
                continue;

            /* Счета (геймификация) */
            sSQL = "for $elem in accounts where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oAccountObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oAccountObject != undefined)
                continue;

            /* График (график сотрудника) */
            sSQL = "for $elem in schedule_days where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oScheduleDayObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oScheduleDayObject != undefined)
                continue;

            /* Ограничение графика сотрудника (график сотрудника) */
            sSQL = "for $elem in restricting_collaborator_schedules where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oRestrictingCollaboratorScheduleObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oRestrictingCollaboratorScheduleObject != undefined)
                continue;

            /* Резерв на отсутствие (график сотрудника) */
            sSQL = "for $elem in absence_reserves where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oAbsenceReserveObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oAbsenceReserveObject != undefined)
                continue;

            /* График сотрудника (график сотрудника) */
            sSQL = "for $elem in collaborator_schedules where contains( $elem/budget_period_id, ('" + XQueryLiteral(iBudgetPeriodID) + "') ) return $elem"
            oCollaboratorScheduleObject = ArrayOptFirstElem(tools.xquery(sSQL));

            if(oCollaboratorScheduleObject != undefined)
                continue;

            /* Задача (проекты) * task *** plan_budget_period_id *** fact_budget_period_id */
            sSQL = "for $elem in tasks return $elem";
            aTaskObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iTaskID in aTaskObjectIDs)
            {
                if(checkHas == true)
                    continue;

                docTask = tools.open_doc( OptInt(iTaskID) );
                docTaskTE = docTask.TopElem;

                if (docTaskTE != null){

                    if((docTaskTE.plan_budget_period_id != null && docTaskTE.plan_budget_period_id == iBudgetPeriodID) || (docTaskTE.fact_budget_period_id != null && docTaskTE.fact_budget_period_id == iBudgetPeriodID))
                    {
                        checkHas = true;
                        continue;
                    }
                }
            }

            /* Процедуры оценки */
            sSQL = "for $elem in assessment_appraises return $elem"
            aAssessmentAppraiseObjectIDs = ArrayExtract(tools.xquery(sSQL), "This.id.Value");

            for (iAssessmentAppraiseID in aAssessmentAppraiseObjectIDs)
            {
                if(checkHas == true)
                    continue;

                docAssessmentAppraise = tools.open_doc( OptInt(iAssessmentAppraiseID) );
                docAssessmentAppraiseTE = docAssessmentAppraise.TopElem;

                if (docAssessmentAppraiseTE != null)
                {
                    oParticipants = docAssessmentAppraiseTE.participants;

                    for( oParticipant in oParticipants )
                    {
                        if(ArrayOptFind(oParticipant.assessment_appraise_types, "This.budget_period_id == iBudgetPeriodID") != undefined)
                        {
                            checkHas = true;
                            continue;
                        }
                    }
                }
            }

            if(checkHas == true)
                continue;

            DeleteDoc(UrlFromDocID(OptInt(iBudgetPeriodID)), false);
            oRes.count++;
        }
        catch(err)
        {
            toLog("ERROR: DeleteBudgetPeriod: " + ("[" + iBudgetPeriodID + "]\r\n") + err, true);
        }
    }

    return oRes;
}

/**
 * @typedef {Object} DeleteExpertResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */
/**
 * @function DeleteExpert
 * @memberof Websoft.WT.Event
 * @author IG
 * @description Удаление экспертов
 * @param {bigint[]} arrExpertIDs - Массив ID экспертов, подлежащих удалению
 * @returns {DeleteExpertResult}
 */
function DeleteExpert( arrExpertIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;
    var countHasObject = 0

    if(!IsArray(arrExpertIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrExpertIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "expert")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_5' );
        return oRes;
    }

    for(iExpertID in arrExpertIDs)
    {
        try
        {
            sSQL = "for $elem in experts where contains( $elem/id, ('" + XQueryLiteral(iExpertID) + "') ) return $elem"
            oExpertObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oExpertObject == undefined)
                continue;

            /*
				Для каждого эксперта проверяется, есть или нет для него хотя бы один вопрос.
				Также проверяется, отмечен он или нет экспертом хотя бы в одном значении карты знаний.
				Если эксперт нигде не упомянут, то он удаляется, иначе пропускается.
			*/

            sSQL = "for $elem in expert_questions where contains( $elem/expert_id, ('" + XQueryLiteral(iExpertID) + "') ) return $elem"
            oExpertQuestionObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oExpertQuestionObject != undefined)
                continue;

            DeleteDoc( UrlFromDocID( iExpertID ), false);
            oRes.count++;
        }
        catch(err)
        {
            toLog("ERROR: DeleteExpert: " + ("[" + iExpertID + "]\r\n") + err, true);
        }
    }

    return oRes;
}
/**
 * @typedef {Object} DeleteExpertQuestionResult
 * @memberof Websoft.WT.Event
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
 */
/**
 * @function DeleteExpertQuestion
 * @memberof Websoft.WT.Event
 * @author IG
 * @description Удаление вопросов эксперту
 * @param {bigint[]} arrExpertQuestionIDs - Массив ID вопросов эксперту, подлежащих удалению
 * @returns {DeleteExpertQuestionResult}
 */
function DeleteExpertQuestion( arrExpertQuestionIDs ){

    var oRes = tools.get_code_library_result_object();
    oRes.count = 0;

    if(!IsArray(arrExpertQuestionIDs))
    {
        oRes.error = 501;
        oRes.errorText = i18n.t( 'argumentfunkci' );
        return oRes;
    }

    var catCheckObject = ArrayOptFirstElem(ArraySelect(arrExpertQuestionIDs, "OptInt(This) != undefined"))
    if(catCheckObject == undefined)
    {
        oRes.error = 502;
        oRes.errorText = i18n.t( 'vmassivenetnio' );
        return oRes;
    }

    var docObj = tools.open_doc(Int(catCheckObject));
    if(docObj == undefined || docObj.TopElem.Name != "expert_question")
    {
        oRes.error = 503;
        oRes.errorText = i18n.t( 'dannyeneyavlyayut_5' );
        return oRes;
    }

    for(iExpertQuestionID in arrExpertQuestionIDs)
    {
        try
        {
            sSQL = "for $elem in expert_questions where contains( $elem/id, ('" + XQueryLiteral(iExpertQuestionID) + "') ) return $elem"
            oExpertQuestionObject = ArrayOptFirstElem(tools.xquery(sSQL));
            if(oExpertQuestionObject == undefined)
                continue;

            DeleteDoc( UrlFromDocID( iExpertQuestionID ), false);
            oRes.count++;
        }
        catch(err)
        {
            toLog("ERROR: DeleteExpertQuestion: " + ("[" + iExpertQuestionID + "]\r\n") + err, true);
        }
    }

    return oRes;
}

/**
 * @function HandleCommonEducationPlanCreate
 * @author AZ
 * @memberof Websoft.WT.Event
 * @param {bigint} iEducationPlanID - ID плана обучения.
 * @param {object} teEducationPlan - TopElem карточки плана обучения.
 * @param {bigint} iChatbotID - ID чат-бота.
 * @description Событие Создание плана обучения.
 */
function HandleCommonEducationPlanCreate( iEducationPlanID, teEducationPlan, iChatbotID )
{
    try
    {
        if ( teEducationPlan == undefined || teEducationPlan == null || teEducationPlan == '' || teEducationPlan.Name != 'education_plan' )
            throw '';

        docEducationPlan = OpenDoc( UrlFromDocID( teEducationPlan.id ) );
    }
    catch( ex )
    {
        try
        {
            iEducationPlanID = Int( iEducationPlanID );

            docEducationPlan = OpenDoc( UrlFromDocID( iEducationPlanID ) );
            teEducationPlan = docEducationPlan.TopElem;
        }
        catch( ex )
        {
            teEducationPlan = null;
        }
    }

    try
    {
        iChatbotID = Int( iChatbotID );
    }
    catch( ex )
    {
        iChatbotID = null;
    }

    var arrChatParticipants = new Array();
    var sChatName = '';
    var arrInnerLectors = new Array();
    var arrOuterLectors = new Array();
    var arrParticipants = new Array();

    if ( teEducationPlan != null )
    {
        if ( teEducationPlan.type == 'group' && teEducationPlan.object_id.HasValue )
        {
            arrParticipants = XQuery( "for $elem in group_collaborators where $elem/group_id = " + teEducationPlan.object_id + " return $elem/Fields( 'collaborator_id' )" );
            arrChatParticipants = ArrayUnion( arrChatParticipants, ArrayExtractKeys( arrParticipants, 'collaborator_id' ) );
        }

        if ( teEducationPlan.tutor_id.HasValue )
        {
            arrChatParticipants.push( teEducationPlan.tutor_id );
        }

        if ( teEducationPlan.compound_program_id.HasValue )
        {
            docCompoundProgram = tools.open_doc( teEducationPlan.compound_program_id );
            if ( docCompoundProgram != undefined )
            {
                sChatName = docCompoundProgram.TopElem.name;

                arrInnerLectors = XQuery( "for $elem in lectors where $elem/type = 'collaborator' and MatchSome( $elem/id, ( " + ArrayMerge( docCompoundProgram.TopElem.lectors, 'This.lector_id', ',' ) + " ) ) return $elem/Fields( 'person_id' )" );
                arrOuterLectors = XQuery( "for $elem in lectors where $elem/type = 'invitee' and MatchSome( $elem/id, ( " + ArrayMerge( docCompoundProgram.TopElem.lectors, 'This.lector_id', ',' ) + " ) ) return $elem/Fields( 'id' )" );

                arrChatParticipants = ArrayUnion( arrChatParticipants, ArrayExtractKeys( arrInnerLectors, 'person_id' ) );
                arrChatParticipants = ArrayUnion( arrChatParticipants, ArrayExtractKeys( arrOuterLectors, 'id' ) );
            }
        }

        try
        {
            oRes = CallServerMethod( "tools", "call_code_library_method", [ "libChat", "change_participants_conversation", [ null, null, "change_object", null, arrChatParticipants, iChatbotID, null, docEducationPlan, 'group', sChatName ] ] );

            if ( oRes.error == 0 )
            {
                CallServerMethod( "tools", "call_code_library_method", [ "libChat", "add_chatbot_to_conversation", [ oRes.conversation_id, iChatbotID ] ] );

                arrEduMethods = ArraySelect( teEducationPlan.programs, "This.type == 'education_method'" );

                if ( ArrayCount( arrEduMethods ) > 0 )
                {
                    arrEvents = XQuery( "for $elem in events where MatchSome( $elem/education_method_id, ( " + ArrayMerge( arrEduMethods, 'This.education_method_id', ',' ) + " ) ) return $elem/Fields( 'id', 'start_date', 'finish_date' )" );

                    for ( catEvent in arrEvents )
                    {
                        try
                        {
                            docCalendarEvent = OpenNewDoc( "x-local://wtv/wtv_calendar_event.xmd" );
                            docCalendarEvent.BindToDb( DefaultDb );

                            teCalendarEvent = docCalendarEvent.TopElem;

                            teCalendarEvent.object_type = "conversation";
                            teCalendarEvent.object_id = oRes.conversation_id;
                            teCalendarEvent.state_id = 'plan';
                            teCalendarEvent.person_id = teEducationPlan.doc_info.creation.user_id;

                            tools.common_filling( 'collaborator', teEducationPlan, teCalendarEvent.person_id );

                            teCalendarEvent.name = sChatName;

                            teCalendarEvent.plan_start_date = catEvent.start_date;
                            teCalendarEvent.start_time = StrTime( catEvent.start_date );
                            teCalendarEvent.plan_end_date = catEvent.finish_date;
                            teCalendarEvent.end_time = StrTime( catEvent.finish_date );

                            for ( catPerson in arrParticipants )
                            {
                                _child = teCalendarEvent.block_participant.participants.AddChild();
                                _child.person_id = catPerson.collaborator_id;
                            }

                            if ( teEducationPlan.tutor_id.HasValue )
                            {
                                _child = teCalendarEvent.block_participant.participants.AddChild();
                                _child.person_id = teEducationPlan.tutor_id;
                            }

                            for ( catLector in arrInnerLectors )
                            {
                                _child = teCalendarEvent.block_tutor.tutors.AddChild();
                                _child.person_id = catLector.person_id;
                            }

                            docCalendarEvent.Save();
                        }
                        catch( ex )
                        {
                            alert( 'HandleCommonEducationPlanCreate ERROR: ' + ex );
                        }
                    }
                }
            }
        }
        catch( ex )
        {
            tools.alert_server( 'HandleCommonEducationPlanCreate ERROR: ' + ex );
        }
    }
}