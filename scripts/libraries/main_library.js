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

function select_page_sort_params( aArray, oPagingParam, oSortParam )
{
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
	if( oSortParam.GetOptProperty( "FIELD", null ) != null && oSortParam.GetOptProperty( "DIRECTION", null ) != null )
	{
		aArray = ArraySort( aArray, oSortParam.FIELD, ( oSortParam.DIRECTION == "ASC" ? "+" : "-" ) );
	}

	if( OptInt( oPagingParam.GetOptProperty( "SIZE" ), null ) != null )
	{
		oPagingParam.SetProperty( "MANUAL", true );
		oPagingParam.SetProperty( "TOTAL", ArrayOptSize( aArray ) );
		if( OptInt( oPagingParam.GetOptProperty( "START_INDEX" ), null ) != null )
		{
			aArray = ArrayRange( aArray, oPagingParam.START_INDEX, oPagingParam.SIZE );
		}
		else
		{
			aArray = ArrayRange( aArray, ( oPagingParam.SIZE * OptInt( oPagingParam.GetOptProperty( "INDEX" ), 0 ) ), oPagingParam.SIZE );
		}
	}
	return ({oResult: aArray, oPaging: oPagingParam});
}
/**
 * @namespace Websoft.WT.Main
*/


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
 * @typedef {import('./classes_library').WTLPECountResult} WTLPECountResult
*/
/**
 * @typedef {import('./classes_library').WTLPETextResult} WTLPETextResult
*/
/**
 * @typedef {import('./classes_library').WTLPEBooleanResult} WTLPEBooleanResult
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
/**
 * @typedef {import('./classes_library').WTScopeWvars} WTScopeWvars
*/




/**
 * @function toLog
 * @memberof Websoft.WT.Main
 * @description Запись в лог подсистемы.
 * @author BG
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
		EnableLog('main_library');
		LogEvent('main_library', sText)
	}
}

/**
 * @function getFile
 * @memberof Websoft.WT.Main
 * @description Получения УРЛ файла
 * @author IG
 * @param {Object} [Ps] - объект
 * @param {integer} [iFileID] - ID файла
 */
function getFile( Ps, iFileID )
{
	var sReturnUrl = '';
	iFileID = OptInt(iFileID, null)
	if (iFileID != null)
	{
		fldFile = ArrayOptFind(Ps.data.files, 'This.id=='+iFileID)
		if (fldFile != undefined)
		{
			if (!System.IsWebClient)
			{
				sUrl=UrlToFilePath(fldFile.file_name)
				if (!FilePathExists(sUrl))
				{
					if (fldFile.data.HasValue)
					{
						sTempDir = ObtainSessionTempFile();
						CreateDirectory( sTempDir );
						sFileName = FileName(sUrl);
						sTempFileUrl = FilePathToUrl(UrlToFilePath(UrlAppendPath( sTempDir, sFileName )));
						PutUrlData(sTempFileUrl, fldFile.data);
						fldFile.file_name = sTempFileUrl;
					}
				}
			}
			sReturnUrl = fldFile.file_name
		}
	}
	
	sUrlPath = 'download_report.html?file_url='+UrlEncode(sReturnUrl);
	try
	{
		sUrlPath = UrlAppendPath( global_settings.settings.portal_base_url.Value, sUrlPath );
	}
	catch(ex)
	{
		sUrlPath = global_settings.settings.portal_base_url+(StrEnds(global_settings.settings.portal_base_url,'/')?'':'/')+sUrlPath;
	}

	return sUrlPath;
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
 * @function GetObjectKnowledgeParts
 * @memberof Websoft.WT.Main
 * @description Получения списка значений карты знаний по объекту.
 * @param {bigint} iObjectID - ID объекта
 * @param {bigint} [iCurUserID] - ID пользователя
 * @param {boolean} [bShowOnlyAcknowledgement=true] - показывать только подтвержденные значения
 * @returns {WTKnowledgePartResult}
 */
function GetObjectKnowledgeParts( iObjectID, iCurUserID, bShowOnlyAcknowledgement, oLngItems, teObject )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
	}
	try
	{
		bShowOnlyAcknowledgement = tools_web.is_true( bShowOnlyAcknowledgement );
	}
	catch( ex )
	{
		bShowOnlyAcknowledgement = true;
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
	var RESULT = new Array();

	for ( fldKnowledgePartElem in teObject.knowledge_parts )
	{
		if ( fldKnowledgePartElem.require_acknowledgement )
			continue;

		try
		{
			teKnowledgePart = OpenDoc( UrlFromDocID ( fldKnowledgePartElem.PrimaryKey ) ).TopElem;
		}
		catch ( err )
		{
			continue;
		}
		try
		{
			sClassName = teKnowledgePart.knowledge_classifier_id.ForeignElem.name.Value;
		}
		catch( err )
		{
			sClassName = i18n.t( 'vkpb_not_classified' );
		}
		RESULT.push( { id: fldKnowledgePartElem.PrimaryKey.Value, name: teKnowledgePart.name.Value, desc: fldKnowledgePartElem.desc.Value, class: sClassName } );
	}
	oRes.array = RESULT;
	return oRes;
}

/**
 * @typedef {Object} oRerquestType
 * @property {bigint} id - ID типа заявки.
 * @property {string} name - Наименование типа заявки.
 * @property {string} img_url - Иконка типа заявки.
*/
/**
 * @typedef {Object} WTRequestTypes
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oRerquestType[]} array – Массив типов заявок.
*/
/**
 * @typedef {Object} QuasyReq
 * @property {string} name – Наименование заявки.
 * @property {string} img_url – URL аватарки заявки.
 * @property {bigint} ra_id – ID удаленного действия - обработчика.
 * @property {string} ra_param – параметры УД в виде stringfield JSON.
*/
/**
 * @function GetRequestTypesByRoles
 * @memberof Websoft.WT.Main
 * @description Получение списока типов заявок.
 * @param {bigint} aRolesID - IDs категорий.
 * @param {boolean} bChilds - Учитывать дочерние категории.
 * @param {boolean} bIgnoreRoles - Возвращать всё (без учета категорий).
 * @param {boolean} bQuasyReqToEnd - Квази-заявки добавляются в конец списка.
 * @param {QuasyReq[]} QuasyReqs - набор дополнительных квази-заявок
 * @returns {WTRequestTypes}
*/

function GetRequestTypesByRoles(aRolesID, bChilds, bIgnoreRoles, bQuasyReqToEnd, QuasyReqs)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];

	try
	{
		if (ArrayCount(aRolesID) > 0)
		{
			sRolesIDs = ArrayMerge(aRolesID, 'This', ',');
		}
		else
		{
			throw '';
		}
	}
	catch(e) { sRolesIDs = '' }

	try
	{
		bChilds = tools_web.is_true(bChilds);
	}
	catch(e) { bChilds = false }

	try
	{
		bIgnoreRoles = tools_web.is_true(bIgnoreRoles);
	}
	catch(e) { bIgnoreRoles = false }

	try
	{
		bQuasyReqToEnd = tools_web.is_true(bQuasyReqToEnd);
	}
	catch(e) { bQuasyReqToEnd = false }

	try
	{
		arrQuasyReqs = ParseJson(QuasyReqs);
		if(!IsArray(arrQuasyReqs))
			throw 'no array'
	}
	catch(e) { arrQuasyReqs = [] }

	function _getRequestTypes(payload)
	{
		if (IsArray(payload))
		{
			return tools.xquery("for $elem in request_types where MatchSome( $elem/role_id, ( " + ArrayMerge(payload, 'This', ',') + " ) ) return $elem/id, $elem/__data");
		}
		else
		{
			return tools.xquery("for $elem in request_types where MatchSome( $elem/role_id, ( " + payload + " ) ) return $elem/id, $elem/__data");
		}
	}

	xarrRequestTypes = [];
	arrRqstHierRoleIDs = [];
	if (bIgnoreRoles || sRolesIDs == '')
	{
		xarrRequestTypes = tools.xquery("for $elem in request_types return $elem/id, $elem/__data");
	}
	else if (!bChilds && sRolesIDs != '')
	{
		xarrRequestTypes = _getRequestTypes(sRolesIDs);
	}
	else if (bChilds && sRolesIDs != '')
	{
		arrRqstHierRoleIDs = ArrayExtract(aRolesID, "OptInt(This)");

		arrRqstHierChildRoleIDs = [];
		for (iRoleID in arrRqstHierRoleIDs)
		{
			xarrRoleChilds = tools.xquery("for $elem in roles where IsHierChild( $elem/id, " + iRoleID + " ) order by $elem/Hier() return $elem/Fields('id')");
			for (role in xarrRoleChilds)
			{
				arrRqstHierChildRoleIDs.push(role.id.Value);
			}
		}
		xarrRequestTypes = _getRequestTypes(ArrayMerge(ArrayUnion(arrRqstHierRoleIDs, arrRqstHierChildRoleIDs), "This", ","));
	}
	var obj;
	for (type in xarrRequestTypes)
	{
		obj = {};
		dRequestType = tools.open_doc(type.id)
		if (dRequestType != undefined)
		{
			teRequestType = dRequestType.TopElem;
			if (!bIgnoreRoles && sRolesIDs == '' && teRequestType.ChildExists("role_id"))
			{
				continue;
			}
			obj.id = teRequestType.id.Value;
			obj.name = teRequestType.name.Value;
			obj.img_url = get_object_image_url(teRequestType);

			if( teRequestType.remote_action_id.HasValue )
			{
				obj.type = "quasy";
				obj.ra_id = teRequestType.remote_action_id.Value;
				oWvar = new Object();
				for( _wvar in teRequestType.wvars )
				{
					oWvar.SetProperty( _wvar.name.Value, { value: _wvar.value.Value } )
				}
				obj.ra_params = EncodeJson( oWvar );
			}
			else
			{
				obj.type = "main";
				obj.ra_id = null;
				obj.ra_params = "";
			}
			oRes.array.push(obj);
		}
	}

	if(ArrayOptFirstElem(arrQuasyReqs) != undefined)
	{
		var arrOutQuasy = [];
		for(quasy in arrQuasyReqs)
		{
			obj = {};
			obj.id = tools_web.get_md5_id(quasy.name + quasy.img_url + quasy.ra_id);
			obj.type = "quasy";
			obj.name = quasy.name;
			obj.img_url = quasy.img_url;
			obj.ra_id = quasy.ra_id;
			obj.ra_params = quasy.ra_params;

			arrOutQuasy.push(obj)
		}
		oRes.array = bQuasyReqToEnd ? ArrayUnion(oRes.array, arrOutQuasy) : ArrayUnion(arrOutQuasy, oRes.array);
	}

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
 * @function GetObjectLectors
 * @memberof Websoft.WT.Main
 * @description Получения списка преподавателей по объекту.
 * @param {bigint} iObjectID - ID объекта
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @returns {WTLectorResult}
*/
function GetObjectLectors( iObjectID, bShowDismiss )
{
	return get_object_lectors( iObjectID, null, bShowDismiss )
}
function get_object_lectors( iObjectID, teObject, bShowDismiss )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
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

	if( !teObject.ChildExists( "lectors" ) )
		return oRes

	RESULT = [];
	for ( fldLector in teObject.lectors )
	{
		catLector = fldLector.PrimaryKey.OptForeignElem;
		if( !bShowDismiss && catLector.is_dismiss )
			continue;
		obj = new Object();
		obj.id = catLector.id.Value;
		obj.name = catLector.lector_fullname.Value;
		obj.image_url = "";
		obj.link = get_object_link( "lector", obj.id );
		if( catLector.resource_id.HasValue )
		{
			obj.image_url = tools_web.get_object_source_url( 'resource', catLector.resource_id );
		}
		else if(catLector.type == "collaborator")
		{
			obj.image_url = tools_web.get_object_source_url( 'person', catLector.person_id );
		}
		else
		{
			obj.image_url = "pics/nophoto.png";
		}

		RESULT.push( obj );
	}

	oRes.array = RESULT;
	return oRes;
}

/**
 * @typedef {Object} oLectorCatalogElem
 * @property {bigint} id - ID
 * @property {string} name - ФИО
 * @property {string} phone - Телефон
 * @property {string} email - E-Mail
 * @property {string} mobile_phone - Мобильный телефон
 * @property {string} system_email - Внутренний E-Mail
 * @property {string} comment - Комментарий
 * @property {string} desc - Описание
 * @property {string} image_url - URL аватарки
 * @property {string} link - ссылка на карточку
 * @property {string} type - тип преподавателя
 * @property {string} provider - название обучающей организации
 * @property {bigint} education_method_count - число учебных программ
 * @property {bigint} event_count - число мероприятий
*/
/**
 * @typedef {Object} WTLectorCatalogResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {oLectorCatalogElem[]} array – массив
*/
/**
 * @function GetLectors
 * @memberof Websoft.WT.Main
 * @description Получение справочника преподавателей.
 * @param {string} [sLectorType='all'] - Тип преподавателя (all/invitee/collaborator)
 * @param {bigint[]} [aRolesID] - массив ID категории
 * @param {boolean} [bGetRoleHier=false] - брать все категории вниз по иерархии
 * @param {boolean} [bShowDismiss=false] - показывать уволенных сотрудников
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication код (или id) приложения, по которому определяется доступ
 * @param {string[]} [arrReturnData] - массив полей для вывода: "education_method_count"(число учебных программ, в которых указан преподаватель),"event_count"(число мероприятий, в которых указан преподаватель)
 * @param {boolean} bShowActive - показывать неуволенных сотрудников
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {WTLectorCatalogResult}
*/
function GetLectors( sLectorType, aRolesID, bGetRoleHier, bShowDismiss, iCurUserID, sAccessType, sApplication, arrReturnData, bShowActive, sXQueryQual, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];

	var conds = [];
	try
	{
		if( sLectorType == undefined || sLectorType == null || sLectorType == "" )
			throw "";
		sLectorType = String( sLectorType );
	}
	catch( ex )
	{
		sLectorType = "all";
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
			aRolesID = ArrayUnion( aRolesID, ArrayExtract(tools.xquery("for $elem in roles where IsHierChild( $elem/id, " + _role_id + " ) order by $elem/Hier() return $elem/Fields('id')"), "This.id.Value") );
		}
		aRolesID = ArraySelectDistinct( aRolesID, "This" );
	}

	try
	{
		if( bShowActive == undefined || bShowActive == null )
			throw '';
			bShowActive = tools_web.is_true( bShowActive );
	}
	catch( ex )
	{
		bShowActive = false;
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
				arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'lector' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");
			}
			if ( ArrayOptFirstElem(arrRoles) != undefined)
				conds.push("MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) )");
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
		conds.push( sXQueryQual );
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
            conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
		}
	}


	try
	{
		if(sLectorType != "all")
			conds.push("$elem/type=" + XQueryLiteral(sLectorType));

		if(ArrayOptFirstElem(aRolesID) != undefined)
			conds.push("MatchSome($elem/role_id, (" + ArrayMerge(aRolesID, "This", ",") + ") )");
		
 		var sSortCond = "";
		if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
		{
			var sFieldName = oCollectionParams.sort.FIELD;
			switch(sFieldName)
			{
				case "name":
					sSortCond = " order by $elem/person_fullname"
					break;
				case "position":
					sSortCond = " order by $elem/person_position_name"
					break;
			}
			if(sSortCond != "" && oCollectionParams.sort.DIRECTION == "DESC")
				sSortCond += " descending";
		}

		var sLectorsReq = "for $elem in lectors" + (ArrayOptFirstElem(conds) != undefined ? " where " + ArrayMerge(conds, "This", " and ") : "") + sSortCond + " return $elem/Fields('id','type','is_dismiss','person_id', 'lector_fullname')";
		var xqLectors = tools.xquery(sLectorsReq);

		var sEduOrgLectorsReq = "for $elem in education_org_lectors where MatchSome($elem/lector_id, (" + ArrayMerge(xqLectors, "This.id.Value", ",") + ") ) order by $elem/lector_id return $elem/Fields('education_org_id', 'lector_id')";
		var xqEduOrgLectors = ArrayDirect(tools.xquery(sEduOrgLectorsReq));

		if ( ArrayOptFirstElem( arrReturnData ) != undefined )
		{
			for ( itemReturnData in arrReturnData )
			{
				switch ( itemReturnData )
				{
					case "education_method_count": //число учебных программ, в которых указан преподаватель
									var sEduMethodLectorsReq = "for $elem in education_method_lectors where MatchSome($elem/lector_id, (" + ArrayMerge(xqLectors, "This.id.Value", ",") + ") ) order by $elem/lector_id return $elem/Fields('lector_id')";
									var xqEduMethodLectors = ArrayDirect(tools.xquery(sEduMethodLectorsReq));
									break;
					case "event_count": //число мероприятий, в которых указан преподаватель
									var sEventLectorsReq = "for $elem in event_lectors where MatchSome($elem/lector_id, (" + ArrayMerge(xqLectors, "This.id.Value", ",") + ") ) order by $elem/lector_id return $elem/Fields('lector_id')";
									var xqEventLectors = ArrayDirect(tools.xquery(sEventLectorsReq));
									break;
				}
			}
		}
		if( !bShowDismiss || !bShowActive )
		{
			var xarrLectorCollaborators = new Array();
			if( ArrayOptFindByKey( xqLectors, "collaborator", "type" ) != undefined )
			{
				xarrLectorCollaborators = ArrayDirect(XQuery( "for $elem_qc in collaborators where MatchSome( $elem_qc/id, (" + ArrayMerge( ArraySelectByKey( xqLectors, "collaborator", "type" ), "XQueryLiteral( This.person_id )", "," ) + ") ) order by $elem_qc/id return $elem_qc/Fields('id','is_dismiss')" ));
			}
			function check_active_lector( catElem )
			{
				var bIsDismiss = catElem.is_dismiss.Value;
				if( catElem.type == "collaborator" )
				{
					fldPerson = ArrayOptFindBySortedKey( xarrLectorCollaborators, catElem.person_id, "id" );;
					if(fldPerson != undefined)
						bIsDismiss = bIsDismiss || fldPerson.is_dismiss.Value;
				}

				if( !bShowDismiss && bIsDismiss )
					return false;

				if( !bShowActive && !bIsDismiss )
					return false;
				return true;
			}
			xqLectors = ArraySelect( xqLectors, "check_active_lector( This )" );
		}
		if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
		{
			oCollectionParams.paging.MANUAL = true;
			oCollectionParams.paging.TOTAL = ArrayCount(xqLectors);
			oRes.paging = oCollectionParams.paging;
			xqLectors = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xqLectors, oCollectionParams.paging, oCollectionParams.sort ] ).oResult;
		}

		var oLector, bIsDismiss;
		var teLector, fldPerson;
		for(itemLector in xqLectors)
		{

			teLector = tools.open_doc(itemLector.id.Value).TopElem
			sImg = "";
			if( teLector.resource_id.HasValue )
			{
				sImg = tools_web.get_object_source_url( 'resource', teLector.resource_id );
			}
			else if(teLector.type == "collaborator")
			{
				sImg = tools_web.get_object_source_url( 'person', teLector.person_id );
			}
			else
			{
				sImg = "pics/nophoto.png";
			}

			oLector ={
				id: itemLector.id.Value,
				name: itemLector.lector_fullname.Value,
				position: teLector.person_position_name.Value, //forced by higher power to edit code due to task #4977.
				phone: "",
				email: "",
				mobile_phone: "",
				system_email: "",
				comment: "",
				desc: "",
				image_url: sImg,
				link: get_object_link( "lector", itemLector.id.Value ),
				type: null,
				provider: null,
				education_method_count: null,
				event_count: null
			};

			if ( ArrayOptFirstElem( arrReturnData ) != undefined )
			{
				for ( itemReturnData in arrReturnData )
				{
					switch ( itemReturnData )
					{
						case "education_method_count": //число учебных программ, в которых указан преподаватель
							oLector.education_method_count = ArrayCount( ArraySelectBySortedKey( xqEduMethodLectors, itemLector.id.Value, "lector_id" ) );
							break;
						case "event_count": //число мероприятий, в которых указан преподаватель
							oLector.event_count = ArrayCount( ArraySelectBySortedKey( xqEventLectors, itemLector.id.Value, "lector_id" ) );
							break;
					}
				}
			}

			if ( teLector.type.HasValue )
				switch(teLector.type)
				{
					case "invitee":
						oLector.type = i18n.t( 'vneshniy' );
						break;
					case "collaborator":
						oLector.type = i18n.t( 'vnutrenniy' )
						break;
				}

			oProvider = ArrayOptFindBySortedKey(xqEduOrgLectors, itemLector.id.Value, "lector_id");
			if( oProvider != undefined)
				oLector.provider = oProvider.education_org_id.HasValue ? oProvider.education_org_id.OptForeignElem.disp_name : null;
			else
				oLector.provider = '-';

			if(tools_web.is_true(teLector.allow_publication.Value))
			{
				oLector.comment = teLector.comment.Value;
				oLector.desc = teLector.desc.Value;
				switch(teLector.type)
				{
					case "collaborator":
					{
						oLector.phone = fldPerson != undefined ? fldPerson.phone.Value : "";
						oLector.mobile_phone = fldPerson != undefined ? fldPerson.mobile_phone.Value : "";;
						oLector.email = teLector.email.HasValue ? teLector.email.Value : (fldPerson != undefined ? fldPerson.email.Value : "");
						break;
					}
					case "invitee":
					{
						oLector.phone = teLector.phone.Value;
						oLector.mobile_phone = teLector.mobile_phone_conf.Value ? teLector.mobile_phone.Value : "";
						oLector.email = teLector.email_conf.Value ? teLector.email.Value : "";
						oLector.system_email = teLector.system_email.Value;
						break;
					}
				}
			}

			oRes.array.push(oLector);
		}

	}
	catch(err)
	{
		oRes.error = 502;
		oRes.errorText = err;
	}
	return oRes;
}

/**
 * @typedef {Object} oFile
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {number} size
 * @property {string} link
*/
/**
 * @typedef {Object} WTFileResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {oFile[]} array – массив
*/
/**
 * @function GetObjectFiles
 * @memberof Websoft.WT.Main
 * @description Получения списка материалов по объекту.
 * @param {bigint} iObjectID - ID объекта
 * @returns {WTFileResult}
*/
function GetObjectFiles( iObjectID )
{
	return get_object_files( iObjectID, null )
}
function get_object_files( iObjectID, teObject, bDispPlayer )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
	}
	try
	{
		if( bDispPlayer == undefined || bDispPlayer == null )
			throw '';
			bDispPlayer = tools_web.is_true( bDispPlayer );
	}
	catch( ex )
	{
		bDispPlayer = false;
	}

	if( !teObject.ChildExists( "files" ) )
		return oRes

	RESULT = [];
	arrTypes = new Array();
	function get_type_name( _type_id )
	{
		var catType = ArrayOptFind( arrTypes, "This.id == _type_id" );
		if( catType == undefined )
		{
			catType = new Object();
			catType.id = _type_id;
			catType.name = _type_id.ForeignElem.name.Value;
			arrTypes.push( catType );
		}
		return catType.name;
	}
	for ( fldFile in teObject.files )
	{
		catFile = fldFile.file_id.OptForeignElem;
		if( catFile == undefined )
			continue;
		obj = new Object();
		obj.id = fldFile.file_id.Value;
		obj.name = catFile.name.Value;
		obj.type = get_type_name( catFile.type );
		obj.size = catFile.size.Value;
		if( fldFile.ChildExists( "visibility" ) )
			obj.visibility = fldFile.visibility.Value;
		obj.link = tools_web.get_object_source_url( 'resource', fldFile.file_id, ( bDispPlayer ? ({ 'type': 'library_material' }) : ({}) ) );

		RESULT.push( obj );
	}

	oRes.array = RESULT;
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
 * @function GetObjectRequests
 * @memberof Websoft.WT.Main
 * @description Получения списка заявок по объекту.
 * @param {bigint} iObjectID - ID объекта
 * @returns {WTRequestResult}
*/
function GetObjectRequests( iObjectID )
{
	return get_object_requests( iObjectID );
}
function get_object_requests( iObjectID )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
		return oRes;
	}

	conds = new Array();
	conds.push( "$i/object_id = " + iObjectID );
	RESULT = [];
	for ( fldRequest in XQuery( "for $i in requests where " + ArrayMerge( conds, "This", " and " ) + " order by $i/create_date descending return $i" ) )
	{
		obj = new Object();
		obj.id = fldRequest.id.Value;
		obj.person_fullname = fldRequest.person_fullname.Value;
		obj.create_date = fldRequest.create_date.Value;
		obj.status = fldRequest.status_id.ForeignElem.name.Value;
		obj.link = get_object_link( "request", fldRequest.id );

		RESULT.push( obj );
	}

	oRes.array = RESULT;
	return oRes;
}
/**
 * @typedef {Object} oResponse
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {bigint} person_id
 * @property {date} create_date
 * @property {string} link
 * @property {string} type
 * @property {string} basic_desc
 * @property {string} basic_score
*/
/**
 * @typedef {Object} WTResponseResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oResponse[]} array – массив
*/
/**
 * @function GetObjectResponses
 * @memberof Websoft.WT.Main
 * @description Получения списка отзывов по объекту.
 * @param {bigint} iObjectID - ID объекта
 * @returns {WTResponseResult}
*/
/* copy to @component employee_management  */
function GetObjectResponses( iObjectID )
{
	return get_object_responses( iObjectID );
}

/* copy to @component employee_management  */
function get_object_responses( iObjectID, aObjectIds )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];
	bUseArray = false;

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		if( !IsArray( aObjectIds ) || ArrayOptFirstElem( aObjectIds ) == undefined )
		{
			oRes.error = 1;
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
		bUseArray = true;
	}

	conds = new Array();
	if( bUseArray )
		conds.push( "MatchSome( $i/object_id, (" + ArrayMerge( aObjectIds, "This", "," ) + ") )" );
	else
		conds.push( "$i/object_id = " + iObjectID );

	RESULT = [];
	var oBasicFieldValue
	for ( fldResponse in XQuery( "for $i in responses where " + ArrayMerge( conds, "This", " and " ) + " order by $i/create_date descending return $i" ) )
	{
		obj = new Object();
		obj.id = fldResponse.id.Value;
		obj.person_fullname = fldResponse.person_fullname.Value;
		obj.person_id = fldResponse.person_id.Value;
		obj.create_date = fldResponse.create_date.Value;
		obj.type = fldResponse.type.Value;
		obj.link = get_object_link( "response", fldResponse.id );

		oBasicFieldValue = get_response_basic_fields(fldResponse);
		obj.basic_desc = fldResponse.basic_desc; // oBasicFieldValue.basic_desc;
		obj.basic_score = fldResponse.basic_score; // oBasicFieldValue.basic_score;

		RESULT.push( obj );
	}

	oRes.array = RESULT;
	return oRes;
}

function get_response_basic_fields(fldResponse)
{
	oRet = {basic_desc: "", basic_score: null};
	try
	{
		fldResponse.Name;
		// teResponse = fldResponse;
		var iResponseID = fldResponse.id.Value
	}
	catch(e)
	{
		iResponseID = OptInt(fldResponse);
		if(iResponseID == undefined)
			throw i18n.t( 'peredannekorre_1' );
	}

	var docResponse = tools.open_doc(iResponseID);
	if(docResponse == undefined)
		throw StrReplace(i18n.t( 'obektsidparamn' ), "{PARAM1}", iResponseID);

	var teResponse = docResponse.TopElem;
	var sCatalog = teResponse.Name;

	if(sCatalog != "response")
			throw StrReplace(i18n.t( 'peredannyyobek' ), "{PARAM1}", sCatalog);

	var fldResponseType = teResponse.response_type_id.OptForeignElem;
	if(fldResponseType == undefined)
		return oRet;

	var sBasicDescFieldName = fldResponseType.basic_desc_field.HasValue ? fldResponseType.basic_desc_field.Value : "";
	var fldCustomField;
	if(sBasicDescFieldName != "")
	{
		fldCustomField = teResponse.custom_elems.GetOptChildByKey(sBasicDescFieldName);
		if(fldCustomField != undefined)
		{
			oRet.basic_desc = fldCustomField.value.Value;
		}
	}

	var sBasicScoreFieldName = fldResponseType.basic_score_field.HasValue ? fldResponseType.basic_score_field.Value : "";
	if(sBasicScoreFieldName != "")
	{
		fldCustomField = teResponse.custom_elems.GetOptChildByKey(sBasicScoreFieldName);
		if(fldCustomField != undefined)
		{
			//oRet.basic_score = OptInt(fldCustomField.value.Value, 0);
			oRet.basic_score = fldCustomField.value.Value;
		}
	}

	return oRet;
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
 * @function GetCertificates
 * @memberof Websoft.WT.Main
 * @description Получения списка сертификатов.
 * @param {bigint} [iPersonID] - ID сотрудника
 * @param {bigint} [iEventID] - ID мероприятия
 * @returns {WTCertificateResult}
*/
function GetCertificates( iPersonID, iEventID )
{
	return get_certificates( iPersonID, iEventID );
}
function get_certificates( iPersonID, iEventID )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		iPersonID = null;
	}
	try
	{
		iEventID = Int( iEventID );
	}
	catch( ex )
	{
		iEventID = null;
	}

	conds = new Array();
	if( iPersonID != null )
		conds.push( "$i/person_id = " + iPersonID );
	if( iEventID != null )
		conds.push( "$i/event_id = " + iEventID );
	RESULT = [];
	for ( fldCertificate in XQuery( "for $i in certificates where " + ArrayMerge( conds, "This", " and " ) + " order by $i/expire_date descending return $i" ) )
	{
		obj = new Object();
		obj.id = fldCertificate.id.Value;
		obj.person_fullname = fldCertificate.person_fullname.Value;
		obj.type_name = fldCertificate.type_name.Value;
		obj.serial = fldCertificate.serial.Value;
		obj.number = fldCertificate.number.Value;
		obj.event_name = "";
		if( fldCertificate.event_id.HasValue )
		{
			feEvent = fldCertificate.event_id.OptForeignElem;
			if( feEvent != undefined )
				obj.event_name = feEvent.name.Value;
		}
		obj.expire_date = fldCertificate.expire_date.Value;

		RESULT.push( obj );
	}

	oRes.array = RESULT;
	return oRes;
}

/**
 * @typedef {Object} oQualificationAssignment
 * @property {bigint} id
 * @property {string} person_fullname
 * @property {date} assignment_date
 * @property {string} status
 * @property {string} qualification_name
 * @property {string} event_name
*/
/**
 * @typedef {Object} WTQualificationAssignmentResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oQualificationAssignment[]} array – массив
*/
/**
 * @function GetQualificationAssignments
 * @memberof Websoft.WT.Main
 * @description Получения списка присвоенных квалификаций.
 * @param {bigint} [iPersonID] - ID сотрудника
 * @param {bigint} [iQualificationID] - ID квалификации
 * @param {bigint} [iEventID] - ID мероприятия
 * @returns {WTQualificationAssignmentResult}
*/
function GetQualificationAssignments( iPersonID, iQualificationID, iEventID )
{
	return get_qualification_assigns( iPersonID, iQualificationID, iEventID );
}
function get_qualification_assigns( iPersonID, iQualificationID, iEventID )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		iPersonID = null;
	}
	try
	{
		iQualificationID = Int( iQualificationID );
	}
	catch( ex )
	{
		iQualificationID = null;
	}
	try
	{
		iEventID = Int( iEventID );
	}
	catch( ex )
	{
		iEventID = null;
	}

	conds = new Array();
	if( iPersonID != null )
		conds.push( "$elem/person_id = " + iPersonID );
	if( iQualificationID != null )
		conds.push( "$elem/qualification_id = " + iQualificationID );
	if( iEventID != null )
		conds.push( "$elem/event_id = " + iEventID );
	RESULT = [];
	for ( fldQualificationAssign in XQuery( "for $elem in qualification_assignments " + ( ArrayOptFirstElem( conds ) != undefined ? " where " + ArrayMerge( conds, "This", " and " ) : "" ) + " order by $elem/assignment_date descending return $elem" ) )
	{
		obj = new Object();
		obj.id = fldQualificationAssign.id.Value;
		obj.person_fullname = fldQualificationAssign.person_fullname.Value;
		obj.status = fldQualificationAssign.status.ForeignElem.name.Value;
		obj.event_name = "";
		if( fldQualificationAssign.event_id.HasValue )
		{
			feEvent = fldQualificationAssign.event_id.OptForeignElem;
			if( feEvent != undefined )
				obj.event_name = feEvent.name.Value;
		}
		obj.qualification_name = "";
		if( fldQualificationAssign.qualification_id.HasValue )
		{
			feQualification = fldQualificationAssign.qualification_id.OptForeignElem;
			if( feQualification != undefined )
				obj.qualification_name = feQualification.name.Value;
		}
		obj.assignment_date = fldQualificationAssign.assignment_date.Value;

		RESULT.push( obj );
	}

	oRes.array = RESULT;
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
 * @function GetTestLearnings
 * @memberof Websoft.WT.Main
 * @description Получения списка тестирования.
 * @param {bigint} iPersonID - ID сотрудника
 * @param {bigint} iAssessmentID - ID теста
 * @param {bigint} iEventID - ID мероприятия
 * @returns {WTTestLearningResult}
*/
function GetTestLearnings( iPersonID, iAssessmentID, iEventID )
{
	return get_learnings( iPersonID, iAssessmentID, iEventID, "active_test_learnings;test_learnings" );
}

function get_learnings( iPersonID, iObjectID, iEventID, sType )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		iPersonID = null;
	}
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		iObjectID = null;
	}
	try
	{
		iEventID = Int( iEventID );
	}
	catch( ex )
	{
		iEventID = null;
	}
	try
	{
		if( sType == undefined || sType == null )
			throw "error";
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre_2' );
		return oRes;
	}
	xarrObjects = new Array();
	for( _type in String( sType ).split( ";" ) )
	{
		conds = new Array();
		if( iPersonID != null )
			conds.push( "$i/person_id = " + iPersonID );
		if( iEventID != null )
			conds.push( "$i/event_id = " + iEventID );
		xarrObjects
		switch( _type )
		{
			case "active_test_learnings":
			case "test_learnings":
				if( iObjectID != null )
					conds.push( "$i/assessment_id = " + iObjectID );
				break;
			case "active_learnings":
			case "learnings":
				if( iObjectID != null )
					conds.push( "$i/course_id = " + iObjectID );
				break;
		}
		xarrObjects = ArrayUnion( xarrObjects, XQuery( "for $i in " + _type + ( ArrayOptFirstElem( conds ) != undefined ? " where " + ArrayMerge( conds, "This", " and " ) : "" ) + " return $i" ) );
	}

	for ( fldObject in xarrObjects )
	{
		obj = new Object();
		obj.id = fldObject.id.Value;
		obj.person_fullname = fldObject.person_fullname.Value;
		obj.score = fldObject.score.Value;
		obj.start_usage_date = fldObject.start_usage_date.Value;
		obj.status = fldObject.state_id.ForeignElem.name.Value;
		obj.event_name = "";
		if( fldObject.event_id.HasValue )
		{
			feEvent = fldObject.event_id.OptForeignElem;
			if( feEvent != undefined )
				obj.event_name = feEvent.name.Value;
		}
		switch( fldObject.Name )
		{
			case "active_test_learning":
			case "test_learning":
				obj.name = fldObject.assessment_name.Value;
				break;
			case "active_learning":
			case "learning":
				obj.name = fldObject.course_name.Value;
				break;
		}

		oRes.array.push( obj );
	}
	return oRes
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
 * @function GetObjectCompetences
 * @memberof Websoft.WT.Main
 * @description Получения списка компетенций объекта.
 * @param {bigint} iObjectID - ID объекта
 * @returns {WTObjectCompetenceResult}
*/
function GetObjectCompetences( iObjectID )
{
	return get_object_competences( iObjectID );
}

function get_object_competences( iObjectID, teObject )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
	}

	if( !teObject.ChildExists( "competences" ) )
		return oRes;

	for ( _comp in teObject.competences )
	{
		obj = new Object();
		obj.id = _comp.competence_id.Value;
		obj.weight = _comp.weight.Value;
		obj.name = "";
		obj.plan_value = _comp.plan.Value;
		obj.plan_value_name = "";
		if( _comp.plan.HasValue )
			try
			{
				teComp = OpenDoc( UrlFromDocID( _comp.competence_id ) ).TopElem;
				obj.name = teComp.name.Value;
				catScale = teComp.scales.GetOptChildByKey( _comp.plan );
				if( catScale != undefined )
					obj.plan_value_name = catScale.name.Value;
			}
			catch(ex){}
		else
		{
			feComp = _comp.competence_id.OptForeignElem;
			if( feComp != undefined )
				obj.name = feComp.name.Value;
		}

		oRes.array.push( obj );
	}
	return oRes
}


/**
 * @typedef {Object} oSubPerson
 * @property {bigint} id
 * @property {string} fullname
 * @property {string} position
 * @property {string} sub
 * @property {string} status
 * @property {string} url_status
 * @property {date} last_date
 * @property {number} max_score
 * @property {string} rec
 * @property {string} url
 * @property {string} status_class
*/
/**
 * @typedef {Object} WTSubPersonResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oSubPerson[]} array – массив
*/
/**
 * @typedef {Object} oPagingParam
 * @property {number} INDEX
 * @property {number} SIZE
 * @property {boolean} MANUAL
 * @property {number} TOTAL
*/
/**
 * @typedef {Object} oSortParam
 * @property {string} FIELD
 * @property {string} DIRECTION
*/
/**
 * @function GetSubPersonList
 * @deprecated с v.2023.2. Взамен следует использовать libLearning/GetBossLearnings
 * @memberof Websoft.WT.Main
 * @description получения списка подчиненных
 * @param {bigint} iObjectID - ID объекта ( курс, тест или учебная программа )
 * @param {bigint} iPersonID - ID сотрудника
 * @param {string} [sSearchFullname] - поиск по ФИО
 * @param {oPagingParam} oPagingParam - параметры страницы
 * @param {oSortParam} oSortParam - параметры сортировки
 * @returns {WTSubPersonResult}
*/

function GetSubPersonList( iObjectID, iPersonID, sSearchFullname, oPagingParam, oSortParam )
{
	return get_sub_person_list( iObjectID, null, iPersonID, sSearchFullname, oPagingParam, oSortParam )
}

/**
 * @deprecated с v.2023.2. Взамен следует использовать libLearning/GetBossLearnings
*/
function get_sub_person_list( iObjectID, teObject, iUserID, sSearchFullname, oPagingParam, oSortParam, oLngItems )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.array = [];

	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
		return oRes;
	}
	try
	{
		iUserID = Int( iUserID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
	}
	if(IsEmptyValue(sSearchFullname))
		sSearchFullname = "";

	RESULT = [];
	try
	{
		if( ObjectType( oSortParam ) != "JsObject" )
			throw "error";
	}
	catch( ex )
	{
		oSortParam = {};
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

	curSubPersonIDsByManagerIDSearch = tools.get_sub_person_ids_by_func_manager_id( iUserID, null, null, null, sSearchFullname );
	curSubPersonByManagerID = QueryCatalogByKeys( 'collaborators', 'id', curSubPersonIDsByManagerIDSearch );
	curSubPersonByManagerID = ArraySelectByKey( curSubPersonByManagerID, false, 'is_dismiss' );

	if ( oSortParam.GetOptProperty( "FIELD", null ) == null )
	{
		oSortParam.SetProperty( "DIRECTION", "ASC" );
	}
	oSortParam.SetProperty( "FIELD", "fullname" );

	select_page_sort_params( curSubPersonByManagerID, oPagingParam, oSortParam )

	sProjectColor = "rgba(250,250,120,0.7)";
	sPlanColor = "rgba(150,150,250,0.7)";
	sActiveColor = "rgba(150,250,150,0.7)";
	sCloseColor = "rgba(150,150,250,0.7)";

	iCourseID = iObjectID;
	sPersons = ArrayMerge( curSubPersonByManagerID, 'id', ',' );
	xarrActiveLearning = new Array();
	switch ( teObject.Name )
	{
		case "education_method":
			if ( teObject.type == 'course' )
			{
				if ( teObject.course_id.HasValue )
				{
					iCourseID = teObject.course_id.Value;
					// Проболжаем выполнение кода в case "course"
				}
				else
				{
					xarrActiveLearning = [];
					xarrLearning = [];
					xarrRequest = [];
					sPersonFieldName = "person_id";
					break;
				}
			}
			else
			{
				xarrActiveLearning = XQuery( 'for $elem in event_collaborators where $elem/education_method_id = ' + iObjectID + ' and ( $elem/status_id = \'plan\' or $elem/status_id = \'active\' ) and MatchSome( $elem/collaborator_id, (' + sPersons + ') ) return $elem' );
				xarrLearning = XQuery( 'for $elem in event_collaborators where $elem/education_method_id = ' + iObjectID + ' and $elem/status_id = \'close\' and MatchSome( $elem/collaborator_id, (' + sPersons + ') ) return $elem' );
				xarrEvent = XQuery( "for $elem in events where $elem/education_method_id = " + iObjectID + " return $elem" );
				xarrRequest = XQuery( "for $elem in requests where $elem/status_id = 'active' and MatchSome( $elem/person_id, (" + sPersons + ") ) and MatchSome( $elem/object_id, (" + ArrayMerge( xarrEvent, 'id', ',' ) + ") ) return $elem" );
				xarrRequest = ArrayUnion( xarrRequest, XQuery( "for $elem in requests where $elem/object_id = " + iObjectID + " and $elem/status_id = 'active' and MatchSome( $elem/person_id, (" + sPersons + ") ) return $elem" ) );
				sPersonFieldName = "collaborator_id";
				sModePref = 'event';
				break;
			}
		case "course":
			xarrActiveLearning = XQuery( 'for $elem in active_learnings where $elem/course_id = ' + iCourseID + ' and MatchSome( $elem/person_id, (' + sPersons + ') ) return $elem' );
			xarrLearning = XQuery( 'for $elem in learnings where $elem/course_id = ' + iCourseID + ' and MatchSome( $elem/person_id, (' + sPersons + ') ) return $elem' );
			xarrRequest = XQuery( "for $elem in requests where $elem/object_id = " + iCourseID + " and $elem/status_id = 'active' and MatchSome( $elem/person_id, (" + sPersons + ") ) return $elem" );
			sPersonFieldName = "person_id";
			sModePref = 'learning';
			break;

		case "assessment":
			xarrActiveLearning = XQuery( 'for $elem in active_test_learnings where $elem/assessment_id = ' + iObjectID + ' and MatchSome( $elem/person_id, (' + sPersons + ') ) return $elem' );
			xarrLearning = XQuery( 'for $elem in test_learnings where $elem/assessment_id = ' + iObjectID + ' and MatchSome( $elem/person_id, (' + sPersons + ') ) return $elem' );
			xarrRequest = XQuery( "for $elem in requests where $elem/object_id = " + iObjectID + " and $elem/status_id = 'active' and MatchSome( $elem/person_id, (" + sPersons + ") ) return $elem" );
			sPersonFieldName = "person_id";
			sModePref = 'test_learning';
			break;
	}

	for ( catPersonElem in curSubPersonByManagerID )
	{
		catLearning = undefined;
		sLastDate = "";
		arrMandatory = tools.get_mandatory_learnings( catPersonElem.id, iObjectID, null, teObject );
		bMandatory = ArrayOptFirstElem( arrMandatory ) != undefined;
		bLearning = false;
		sMaxScore = "";
		sColor = "";
		sColorClass = "";

		xarrActiveLearningPerson = ArraySelectByKey( xarrActiveLearning, catPersonElem.id, sPersonFieldName );
		catActiveLearning = ArrayOptFirstElem( xarrActiveLearningPerson );

		switch ( teObject.Name )
		{
			case "education_method":
				if ( teObject.type == 'course' )
				{
					// Проболжаем выполнение кода в case "course"
				}
				else
				{
					if ( catActiveLearning == undefined )
					{
						xarrLearningPerson = ArraySelectByKey( xarrLearning, catPersonElem.id, sPersonFieldName );
						catLearning = ArrayOptMax( xarrLearningPerson, 'finish_date' );
						if ( catLearning == undefined )
						{
							catRequest = ArrayOptFirstElem( ArraySelectByKey( xarrRequest, catPersonElem.id, 'person_id' ) );
							if ( catRequest == undefined )
							{
								sStatus = i18n.t( 'neizuchalsya' );
								sColor = sProjectColor;
								sColorClass = "color-project";
								sUrlStatus = '';
							}
							else
							{
								sStatus = i18n.t( 'zayavkanasoglas' );
								sColor = sPlanColor;
								sColorClass = "color-plan";
								sUrlStatus = tools_web.get_mode_clean_url( null, catRequest.id );
							}
						}
						else
						{
							sStatus = i18n.t( 'izuchen' );
							sColor = sCloseColor;
							sColorClass = "color-finish";
							sUrlStatus = tools_web.get_mode_clean_url( null, catLearning.event_id );
							sLastDate = StrDate( catLearning.finish_date, true, false );
						}
					}
					else
					{
						sStatus = i18n.t( 'vprocesseizuche' );
						sColor = sActiveColor;
						sColorClass = "color-process";
						sUrlStatus = tools_web.get_mode_clean_url( null, catActiveLearning.event_id );
						sLastDate = StrDate( ArrayMax( xarrActiveLearningPerson, 'finish_date' ).finish_date, true, false );
						bLearning = true;
					}
					sMandatory = bMandatory ? '+' : '';
					break;
				}
			case "assessment":
			case "course":
				if ( catActiveLearning == undefined )
				{
					xarrLearningPerson = ArraySelectByKey( xarrLearning, catPersonElem.id, sPersonFieldName );
					catLearning = ArrayOptMax( xarrLearningPerson, 'score' );
					if ( catLearning == undefined )
					{
						catRequest = ArrayOptFirstElem( ArraySelectByKey( xarrRequest, catPersonElem.id, 'person_id' ) );
						if ( catRequest == undefined )
						{
							sStatus = i18n.t( 'neizuchalsya' );
							sColor = sProjectColor;
							sColorClass = "color-project";
							sUrlStatus = '';
						}
						else
						{
							sStatus = i18n.t( 'zayavkanasoglas' );
							sColor = sPlanColor;
							sColorClass = "color-plan";
							sUrlStatus = tools_web.get_mode_clean_url( null, catRequest.id );
						}
					}
					else
					{
						sStatus = i18n.t( 'izuchen' );
						sColor = sCloseColor;
						sColorClass = "color-finish";
						sUrlStatus = tools_web.get_mode_clean_url( null, catLearning.id );
						sLastDate = StrDate( ArrayMax( xarrLearningPerson, 'last_usage_date' ).last_usage_date, true, false );
					}
				}
				else
				{
					sStatus = i18n.t( 'vprocesseizuche' );
					sColor = sActiveColor;
					sColorClass = "color-process";
					sUrlStatus = tools_web.get_mode_clean_url( null, catActiveLearning.id );
					sLastDate = StrDate( ArrayMax( xarrActiveLearningPerson, 'last_usage_date' ).last_usage_date, true, false );
					bLearning = true;
				}
				sMandatory = ArrayMerge( arrMandatory, 'object_name', ', ' );
				sMaxScore = catLearning == undefined ? ( catActiveLearning == undefined ? '' : catActiveLearning.score.Value ) : catLearning.score.Value;
				break;
		}

		if ( sColor == "" && bMandatory )
			sColor = sCloseColor;


		RESULT.push( {
			"id": catPersonElem.id.Value,
			"fullname": catPersonElem.fullname.Value,
			"position": catPersonElem.position_name.Value,
			"sub": catPersonElem.position_parent_name.Value,
			"status": sStatus,
			"url_status": sUrlStatus,
			"last_date": sLastDate,
			"max_score": sMaxScore,
			"rec": sMandatory,
			"url": ( tools_web.get_mode_clean_url( null, catPersonElem.id ) ),
			"status_class": sColorClass
		} );
	}
	oRes.array = RESULT;
	return oRes;
}

/**
 * @typedef {Object} oMainCatalogObject
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} comment
 * @property {string} link
 * @property {string} image_url
*/
/**
 * @typedef {Object} WTMainCatalogResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oMainCatalogObject[]} array – массив
*/
/**
 * @function GetObjectCatalogs
 * @memberof Websoft.WT.Main
 * @description Получения списка прикрепленных объектов.
 * @param {bigint} iObjectID - ID объекта
 * @param {string} [sCatalogName] - каталог
 * @returns {WTMainCatalogResult}
*/
function GetObjectCatalogs( iObjectID, sCatalogName )
{
	return get_object_catalogs( iObjectID, null, sCatalogName );
}
function get_object_catalogs( iObjectID, teObject, sCatalogName )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];

	var oResArray = new Array();
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre' );
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
			oRes.errorText = i18n.t( 'peredannekorre' );
			return oRes;
		}
	}
	try
	{
		if( sCatalogName == undefined || sCatalogName == "" )
			throw "error";
	}
	catch( ex )
	{
		sCatalogName = null
	}

	if( !teObject.ChildExists( "catalogs" ) )
		return oRes;

	for ( _catalog in teObject.catalogs )
	{
		if( !_catalog.type.HasValue )
			continue;
		if( sCatalogName != null && sCatalogName != _catalog.type )
			continue;
		if( !_catalog.all && ArrayOptFirstElem( _catalog.objects ) == undefined )
			continue;
		sTypeName = common.exchange_object_types.GetChildByKey( _catalog.type ).title.Value;
		conds = new Array();
		if( !_catalog.all )
		{
			conds.push( "MatchSome( $i/id, ( " + ArrayMerge( _catalog.objects, "This.object_id", "," ) + " ) )" )
		}
		for( _object in XQuery( "for $i in " + _catalog.type + "s " + ( ArrayOptFirstElem( conds ) != undefined ? ( " where " + ArrayMerge( conds, "This", " and " ) ) : "" ) + " return $i" ) )
		{
			obj = new Object();
			obj.id = _object.id.Value;
			obj.name = tools.get_disp_name_value( _object );
			obj.type = sTypeName;
			obj.link = get_object_link( _catalog.type, _object.id );
			obj.image_url = get_object_image_url( _object );

			catComment = _catalog.objects.GetOptChildByKey( _object.id )
			obj.comment = catComment != undefined ? catComment.comment.Value : "";

			oRes.array.push( obj );
		}
	}
	return oRes
}

/**
 * @typedef {Object} oMainToDoObject
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} type_name
 * @property {string} state_id
 * @property {string} state
 * @property {string} action
 * @property {string} actionLabel
 * @property {string} image
 * @property {string} value
 * @property {datetime} date
 * @property {string} strDate
 * @property {boolean} exceeded
 * @property {boolean} indefinite
 * @property {boolean} critical
 * @property {boolean} future
*/
/**
 * @typedef {Object} WTMainToDoResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oMainToDoObject[]} array – массив
*/
/**
 * @function GetToDo
 * @memberof Websoft.WT.Main
 * @description Получения списка текущих задач пользователя.
 * @param {bigint} iPersonID - ID сотрудника
 * @param {string} [sStatus] - Статус задач (все, просроченные, срочные, предстоящие)
 * @param {number} [iDaysToShow] - Количество дней, в течение которых задача попадает в список (т.е. указываем 30 дней, видим задачи на месяц вперед + просроченные)
 * @param {number} [iCriticalDays] - Количество дней, которое остается до выполнения задачи, чтобы отнести ее к срочным
 * @param {boolean} [bShowCourse] - Показывать назначенные курсы
 * @param {boolean} [bShowTest] - Показывать назначенные тесты
 * @param {boolean} [bShowEventConfirmation] - Показывать напоминания о подтверждении участия в мероприятии
 * @param {boolean} [bShowResponseLeaving] - Показывать напоминания оставить отзыв
 * @param {boolean} [bShowPolls] - Показывать опросы
 * @param {boolean} [bShowRequests] - Показывать заявки на согласование
 * @param {boolean} [bShowAssessmentApraises] - Показывать оценочные процедуры
 * @param {boolean} [bShowLibraryMaterials] - Показывать материалы библиотеки, с которыми необходимо ознакомиться
 * @param {boolean} [bShowChatInvites] - Показывать новые сообщения в чате
 * @param {boolean} [bShowTasks] - Показывать задачи
 * @param {boolean} [bShowAcquaints] - Показывать ознакомления
 * @param {boolean} [bShowLearningTasks] - Показывать выполнения заданий
 * @param {boolean} [sSearch] - Строка для поиска
 * @returns {WTMainToDoResult}
*/
function GetToDo( iPersonID, sStatus, iDaysToShow, iCriticalDays, bShowCourse, bShowTest, bShowEventConfirmation, bShowResponseLeaving, bShowPolls, bShowRequests, bShowAssessmentApraises, bShowLibraryMaterials, bShowChatInvites, bShowTasks, bShowAcquaints, bShowLearningTasks, sSearch )
{
	function get_value( sValue )
	{
		if( sValue == undefined || sValue == null || sValue == "" )
			 "";
		return sValue;
	}
	function set_value( sName, sValue )
	{
		oParams.SetProperty( sName, get_value( sValue ) )
	}
	oParams = new Object();

	set_value( "type", "" );
	set_value( "sStatus", sStatus );
	set_value( "iDaysToShow", iDaysToShow );
	set_value( "iCriticalDays", iCriticalDays );
	set_value( "bShowCourses", bShowCourse );
	set_value( "bShowTest", bShowTest );
	set_value( "bShowEventConfirmation", bShowEventConfirmation );
	set_value( "bShowResponseLeaving", bShowResponseLeaving );
	set_value( "bShowPolls", bShowPolls );
	set_value( "bShowRequests", bShowRequests );
	set_value( "bShowAssessmentApraises", bShowAssessmentApraises );
	set_value( "bShowLibraryMaterials", bShowLibraryMaterials );
	set_value( "bShowChatInvites", bShowChatInvites );
	set_value( "bShowTasks", bShowTasks );
	set_value( "bShowAcquaints", bShowAcquaints );
	set_value( "bShowLearningTasks", bShowLearningTasks );
	set_value( "bUseCache", false );
	set_value( "bUseTimezone", false );
	set_value( "sSearch", sSearch );

	return get_todo( iPersonID, null, oParams );
}


function get_todo( iUserID, teUser, oParams, Session, oLngItems, oToDoInit, oTarget, sLngShortID, Request, iOverrideWebTemplateID )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];
	try
	{
		iUserID = Int( iUserID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}
	try
	{
		iOverrideWebTemplateID = Int( iOverrideWebTemplateID );
	}
	catch( ex )
	{
		iOverrideWebTemplateID = undefined;
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
			oRes.errorText = i18n.t( 'peredannekorre_3' );
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
		oParams = new Object();
	}
	try
	{
		if( ObjectType( oToDoInit ) != "JsObject" )
			throw "error";
	}
	catch( ex )
	{
		oToDoInit = new Object();
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
		if( Session == undefined || Session == null || Session == "" )
			throw "error";
	}
	catch( ex )
	{
		Session = null;
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
	arrStates = new Array();
	function get_state_name( _state_id )
	{
		catState = ArrayOptFind( arrStates, "This.id == _state_id" );
		if( catState != undefined )
		{
			return catState.name;
		}
		return "";
	}
	try
	{
		// const_start
		var sConstFinishAssProcedure = i18n.t( 'zavershitproced' );
		// const_end

		//sParamPrefix = "TodoDropdown";
		sParamPrefixTmp = oToDoInit.GetOptProperty( "type", "todo" );
		sParamPrefix = sParamPrefixTmp;
		curOverrideWebTemplateID = iOverrideWebTemplateID;
		if( sParamPrefix != "" )
			sParamPrefix = sParamPrefixTmp + ".";

		bUseCache = tools_web.is_true(tools_web.get_web_param( oParams, sParamPrefix + "bUseCache", "default", true ));

		iTimeToCache = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iTimeToCache", 300, true ), 300 );

		iDaysToShow = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iDaysToShow", "1", true ), 1 );

		iWarningDays = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iWarningDays", "3", true ), 3 );
		iCriticalDays = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iCriticalDays", "1", true ), 1 );

		bShowCourses = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowCourses", "1", true ) );
		bShowTests = tools_web.is_true(  tools_web.get_web_param( oParams, sParamPrefix + "bShowTests", "1", true ) );
		bShowEventConfirmation = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowEventConfirmation", "1", true ) );
		bShowResponseLeaving = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowResponseLeaving", "1", true ) );
		bShowPolls = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowPolls", "1", true ) );
		bShowRequests = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowRequests", "1", true ) );
		bShowChatInvites = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowChatInvites", "1", true ) );
		bShowAssessmentApraises = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowAssessmentApraises", "1", true ) );
		bShowTasks = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowTasks", "1", true ) );
		bShowAssignerTasks = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowAssignerTasks", "1", true ) );
		bShowAcquaints = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowAcquaints", true, true ) );
		bShowLibraryMaterials = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowLibraryMaterials", true, true ) );
		bShowLearningTasks = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowLearningTasks", true, true ) );

		iCoursesWarningDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iCoursesWarningDaysCount", iWarningDays, true ), 3 );
		iCoursesCriticalDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iCoursesCriticalDaysCount", iCriticalDays, true ), 1 );
		iTestsWarningDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iTestsWarningDaysCount", iWarningDays, true ), 3 );
		iTestsCriticalDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iTestsCriticalDaysCount", iCriticalDays, true ), 1 );

		iConfirmEventParticipationWarningCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iConfirmEventParticipationWarningCount", iWarningDays, true ), 3 );
		iConfirmEventParticipationCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iConfirmEventParticipationCriticalCount", iCriticalDays, true ), 1 );
		iLeaveResponseWarningCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iLeaveResponseWarningCount", iWarningDays, true ), 2 );
		iLeaveResponseCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iLeaveResponseCriticalCount", iCriticalDays, true ), 3 );
		iPollsWarningCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iPollsWarningCount", iWarningDays, true ), 3 );
		iPollsCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iPollsCriticalCount", iCriticalDays, true ), 1 );
		iRequestsCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iRequestsCriticalCount", iCriticalDays, true ), 1 );

		iAssessmentWarningCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iAssessmentWarningCount", iWarningDays, true ), 3 );
		iAssessmentCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iAssessmentCriticalCount", iCriticalDays, true ), 1 );
		iAssessmentCollectionID = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iAssessmentCollectionID", "null", true ),null);

		iTaskWarningCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iTaskWarningCount", iWarningDays, true ), 3 );
		iTaskCriticalCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iTaskCriticalCount", iCriticalDays, true ), 1 );
		arrTaskStatuses = String( tools_web.get_web_param( oParams, sParamPrefix + "strTaskStatus", "r;0", true ) ).split( ";" );
		sSearch = String( tools_web.get_web_param( oParams, sParamPrefix + "sSearch", "", true ) );
		sStatusID = String( tools_web.get_web_param( oParams, sParamPrefix + "sStatus", "", true ) );
		bStartLaunch = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bStartLaunch", true, true ) );
		bOpenLearningObject = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bOpenLearningObject", true, true ) );
		
		bUseTimezone = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bUseTimezone", false, true ) );

		bShowTiles = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowTiles", true, true ) );
		bShowDefaultImage = tools_web.is_true( tools_web.get_web_param( oParams, sParamPrefix + "bShowDefaultImage", true, true ) );

		iMaxCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + "iMaxCnt", "", true ) );

		iRawSeconds = DateToRawSeconds( Date() );
		dDateToShow = RawSecondsToDate(iRawSeconds +  86400 * iDaysToShow);
		
		var bStartApproved = true;

		if( bUseCache )
		{
			sPrimaryKey = "todo_items_" + sParamPrefixTmp + "_" + ( Session != null ? ( Session.sid + "_" ) : "" ) + iUserID;
		}
		//oToDoInit = new Object;
		arrToDoItems = [];

		bUpdateCache = false;
		if( bUseCache )
		{
			oCacheRes = tools_web.get_user_data( sPrimaryKey );
			if ( oCacheRes == null )
			{
				bUpdateCache = true;
			}
			else
			{
				oToDoInit = oCacheRes
				arrToDoItems = oToDoInit.arrToDoItems;
				switch( sStatusID )
				{
					case "exceeded":
						arrToDoItems = ArraySelect( arrToDoItems, "This.exceeded" );
						break;
					case "critical":
						arrToDoItems = ArraySelect( arrToDoItems, "This.critical && !This.exceeded" );
						break;
					case "future":
						arrToDoItems = ArraySelect( arrToDoItems, "This.future && !This.critical && !This.exceeded" );
						break;
				}
				if( sSearch != "" )
				{
					arrToDoItems = ArraySelect( arrToDoItems, "StrContains( This.name, sSearch ) || StrContains( This.type_name, sSearch )" );
				}
				if( iMaxCount != undefined )
				{
					arrToDoItems = ArrayRange( arrToDoItems, 0, iMaxCount );
				}
				oRes.array = arrToDoItems;

				return oRes;
			}
		}

		if( ! bUseCache || bUpdateCache )
		{
			if(bShowCourses)
			{
				bStartApproved = true;
				curActiveLearnings = ArraySelectAll( XQuery( "for $elem in active_learnings where $elem/person_id = " + iUserID + " return $elem" ) );
				if(ArrayOptFirstElem(curActiveLearnings) != undefined)
				{
					curActiveLearnings = ArraySort( curActiveLearnings, "max_end_date", "+" );

					dCoursesWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iCoursesWarningDaysCount);
					dCourseCriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iCoursesCriticalDaysCount);

					xarrCourses = new Array();
					if( ArrayOptFirstElem( curActiveLearnings ) != undefined )
					{
						xarrCourses = ArraySelectAll( XQuery( "for $elem in courses where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( curActiveLearnings, "This.course_id" ), "This.course_id", "," ) + " ) ) return $elem/Fields('id', 'name', 'resource_id', 'view_type')" ) );
					}
					arrStates = new Array();
					for( _state in common.learning_states )
					{
						arrStates.push( { "id": _state.id.Value, "name": _state.name.Value } )
					}
					for(catLearning in curActiveLearnings)
						try
						{
							//catCourse = catLearning.course_id.OptForeignElem;
							catCourse = ArrayOptFindByKey( xarrCourses, catLearning.course_id, "id" );
							bStartApproved = !catLearning.start_learning_date.HasValue || catLearning.start_learning_date <= Date();
							if( catCourse != undefined )
							{
								oValues = ({
									"id": catLearning.id.Value,
									"type": "learning",
									"type_name": i18n.t( 'c_course' ),
									"state_id": catLearning.state_id.Value,
									"state": get_state_name( catLearning.state_id ),
									"name": tools_web.get_cur_lng_name( catCourse.name.Value, sLngShortID ),
									"action": ( bStartApproved && bStartLaunch && Session != null ? ( catCourse.view_type == "single" ? ( "/course_launch.html?object_id=" + catLearning.id + "&course_id=" + catLearning.course_id + "&sid=" + tools_web.get_sum_sid( catLearning.course_id, Session.sid ) ) : ( "/course_launch.html?structure=first&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) )  ) ) : ( !bOpenLearningObject ? tools_web.get_mode_clean_url( null, catLearning.PrimaryKey ) : tools_web.get_mode_clean_url( null, catLearning.course_id ) ) ),
									"actionLabel": i18n.t( 'proytielektron' ),
									"image": ( catCourse.resource_id.Value ? ("/download_file.js?file_id=" + catCourse.resource_id.Value) : ( bShowDefaultImage ? ("/images/course.png") : "" ) )
								});
								if ( catLearning.max_end_date.HasValue )
								{
									oValues.SetProperty( "value", catLearning.max_end_date.XmlValue );
									oValues.SetProperty( "date", StrDate( catLearning.max_end_date, false, false ) );
									oValues.SetProperty( "strDate", tools_web.get_date_remain_string( catLearning.max_end_date, oLngItems ) );
									oValues.SetProperty( "exceeded", (catLearning.max_end_date < CurDate) );
									oValues.SetProperty( "indefinite", false );
									oValues.SetProperty( "critical", (catLearning.max_end_date < dCourseCriticalDate) );
									oValues.SetProperty( "future", (catLearning.max_end_date >= CurDate) );
								}
								else
								{
									oValues.SetProperty( "value", ( catLearning.start_learning_date.HasValue ? catLearning.start_learning_date.XmlValue : "" ) );
									oValues.SetProperty( "date", StrDate( catLearning.start_learning_date, false, false ) );
									oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) );
									oValues.SetProperty( "exceeded", false );
									oValues.SetProperty( "indefinite", true );
									oValues.SetProperty( "critical", false );
									oValues.SetProperty( "future", false );
								}
								arrToDoItems.push( oValues );
							}
						}
						catch( err )
						{
						}
				}
			}

			if ( bShowTests )
			{
				curActiveTestLearnings = ArraySelectAll( XQuery( "for $elem in active_test_learnings where $elem/person_id = " + iUserID + " return $elem" ) );
				bStartApproved = true;
				if(ArrayOptFirstElem(curActiveTestLearnings) != undefined)
				{
					curActiveTestLearnings = ArraySort( curActiveTestLearnings, "max_end_date", "+" );

					dTestsWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iTestsWarningDaysCount);
					dTestsCriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iTestsCriticalDaysCount);


					xarrTests = new Array();
					if( ArrayOptFirstElem( curActiveTestLearnings ) != undefined )
					{
						xarrTests = XQuery( "for $elem in assessments where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( curActiveTestLearnings, "This.assessment_id" ), "This.assessment_id", "," ) + " ) ) return $elem/Fields('id', 'title', 'resource_id')" )
						xarrTests = ArrayDirect( xarrTests );
					}
					arrStates = new Array();
					for( _state in common.learning_states )
					{
						arrStates.push( { "id": _state.id.Value, "name": _state.name.Value } )
					}
					for(catLearning in curActiveTestLearnings)
						try
						{
							catAssessment = ArrayOptFindByKey( xarrTests, catLearning.assessment_id, "id" );
							if( catAssessment != undefined )
							{
								currentTestImage = "";
								if (bShowTiles)
								{
									if( catAssessment.resource_id.HasValue )
										currentTestImage = "/download_file.js?file_id=" + catAssessment.resource_id;
									else if( bShowDefaultImage )
										currentTestImage = "/images/test_learning.png";
								}
								else if( bShowDefaultImage )
								{
									currentTestImage = "/images/test_learning.png";
								}
								
								bStartApproved = !catLearning.start_learning_date.HasValue || catLearning.start_learning_date <= Date();

								oValues = ({
									"id": catLearning.id.Value,
									"type": "test",
									"type_name": i18n.t( 'c_test' ),
									"state_id": catLearning.state_id.Value,
									"state": get_state_name( catLearning.state_id ),
									"name": tools_web.get_cur_lng_name( catAssessment.title.Value, sLngShortID ),
									"action": ( bStartApproved && bStartLaunch && Session != null ? ( "/test_launch.html?structure=first&assessment_id=" + catLearning.assessment_id + "&object_id=" + catLearning.id + "&launch_id=" + tools_web.encrypt_launch_id( catLearning.id, DateOffset( Date(), 86400*365 ) ) ) : ( !bOpenLearningObject ? tools_web.get_mode_clean_url( null, catLearning.PrimaryKey ) : tools_web.get_mode_clean_url( null, catLearning.assessment_id ) ) ),
									"actionLabel": i18n.t( 'proytitest' ),
									"image": currentTestImage
								});
								if ( catLearning.max_end_date.HasValue )
								{
									oValues.SetProperty( "value", catLearning.max_end_date.XmlValue );
									oValues.SetProperty( "date", StrDate( catLearning.max_end_date, false, false ) );
									oValues.SetProperty( "strDate", tools_web.get_date_remain_string( catLearning.max_end_date, oLngItems) );
									oValues.SetProperty( "exceeded", (catLearning.max_end_date < CurDate) );
									oValues.SetProperty( "indefinite", false );
									oValues.SetProperty( "critical", (catLearning.max_end_date < dTestsCriticalDate) );
									oValues.SetProperty( "future", (catLearning.max_end_date >= CurDate) );
								}
								else
								{
									oValues.SetProperty( "value", ( catLearning.start_learning_date.HasValue ? catLearning.start_learning_date.XmlValue : "" ) );
									oValues.SetProperty( "date", StrDate( catLearning.start_learning_date, false, false ) );
									oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) );
									oValues.SetProperty( "exceeded", false );
									oValues.SetProperty( "indefinite", true );
									oValues.SetProperty( "critical", false );
									oValues.SetProperty( "future", false );
								}
								arrToDoItems.push( oValues );
							}
						}
						catch( err )
						{
						}
				}
			}

			if(bShowEventConfirmation)
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
				var catDefaultTimezone = null;
				var catUserTimezone = null;
				if( bUseTimezone )
				{
					catDefaultTimezone = global_settings.settings.timezone_id.HasValue ? global_settings.settings.timezone_id.ForeignElem : null;
					catUserTimezone = tools_web.get_timezone( iUserID );
					catUserTimezone = catUserTimezone.HasValue ? catUserTimezone.ForeignElem : null;
				}
				xarrEventResults = XQuery("for $elem in event_results where $elem/event_start_date < date('" + get_date( dDateToShow, true ) + "') and $elem/event_start_date > date('" + get_date( CurDate, true ) + "') and $elem/person_id=" + iUserID + " and $elem/is_confirm!= true() and $elem/not_participate!= true() order by $elem/event_start_date ascending return $elem");
				if(ArrayOptFirstElem(xarrEventResults) != undefined)
				{
					xarrEvents = new Array();
					xarrEvents = XQuery( "for $elem in events where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," ) + " ) ) return $elem/Fields('id', 'name', 'resource_id', 'status_id')" )
					xarrEvents = ArrayDirect( xarrEvents );

					for(catEventResult in xarrEventResults)
						try
						{
							
							catEvent = ArrayOptFind( xarrEvents, "This.id == catEventResult.event_id" );
							if( catEvent != undefined && catEvent.status_id != "close" && catEvent.status_id != "cancel" )
							{
								catEventTimezone = null;
								if( bUseTimezone )
								{
									catEventTimezone = tools_web.get_timezone( catEvent.id, catEvent );
									catEventTimezone = catEventTimezone.HasValue ? catEventTimezone.ForeignElem : null;
								}
								dConfirmEventParticipaintWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iConfirmEventParticipationWarningCount);
								dConfirmEventParticipationCriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iConfirmEventParticipationCriticalCount);

								currentEventImage = "";
								if (bShowTiles)
								{
									if( catEvent.resource_id.HasValue )
										currentEventImage = "/download_file.js?file_id=" + catEvent.resource_id;
									else if( bShowDefaultImage )
										currentEventImage = "/images/event.png";
								}
								else if( bShowDefaultImage )
								{
									currentEventImage = "/images/event.png";
								}
								arrToDoItems.push( {
									"id": catEventResult.id.Value,
									"value": ( catEventResult.event_start_date.HasValue ? catEventResult.event_start_date.XmlValue : "" ),
									"type": "event",
									"type_name": i18n.t( 'c_event' ),
									"state_id": '',
									"state": '',
									"name": tools_web.get_cur_lng_name( catEvent.name.Value, sLngShortID ),
									"action": ( tools_web.get_mode_clean_url( null, catEventResult.event_id ) ),
									"actionLabel": i18n.t( 'podtverdituchas' ),
									"future": (catEventResult.event_start_date > dConfirmEventParticipaintWarningDate),
									"critical": (catEventResult.event_start_date < dConfirmEventParticipationCriticalDate),
									"indefinite": false,
									"date": StrDate( get_date( catEventResult.event_start_date, false, catEventTimezone ), false, false ),
									"strDate": tools_web.get_date_remain_string( get_date( catEventResult.event_start_date, false, catEventTimezone ), oLngItems ) ,
									"exceeded": (catEventResult.event_start_date < CurDate),
									"image": currentEventImage
								} );
							}
						}
						catch( err )
						{
						}
				}
			}

			if(bShowResponseLeaving)
			{
				dLeaveResponseCriticalDate = RawSecondsToDate(iRawSeconds +  86400 * iLeaveResponseCriticalCount);
				xarrEventResults = XQuery("for $elem in event_results where $elem/event_start_date < date('" + dLeaveResponseCriticalDate + "') and $elem/person_id=" + iUserID + " and $elem/is_assist=true() order by $elem/event_start_date ascending return $elem");
				arrEvents = new Array();

				if( ArrayOptFirstElem( xarrEventResults ) != undefined )
				{
					arrEvents = XQuery( "for $elem in events where $elem/status_id = 'close' and $elem/default_response_type_id != null() and $elem/mandatory_fill_response = true() and ( $elem/finish_date != null() and $elem/finish_date < " + XQueryLiteral( dLeaveResponseCriticalDate ) + " ) and MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( xarrEventResults, "This.event_id" ), "This.event_id", "," ) + " ) ) return $elem/Fields('id', 'name', 'resource_id', 'status_id', 'finish_date', 'default_response_type_id')" )
				}

				if(ArrayOptFirstElem( arrEvents ) != undefined )
				{
					xarrResponses = XQuery("for $elem in responses where MatchSome( $elem/object_id, ( " + ArrayMerge( arrEvents, "This.id", "," ) + " ) ) and $elem/person_id=" + iUserID + " return $elem/Fields('id', 'response_type_id', 'object_id' )" );

					for( catEvent in arrEvents )
						try
						{
							if( ArrayOptFind( xarrResponses, "This.object_id == catEvent.id && This.response_type_id == catEvent.default_response_type_id" ) != undefined )
							{
								continue;
							}
							sDateToLeaveResponse = RawSecondsToDate(DateToRawSeconds(catEvent.finish_date) + 86400 * iLeaveResponseWarningCount);
							dLeaveResponseWarningDate = RawSecondsToDate(DateToRawSeconds(catEvent.finish_date) +  86400 * iLeaveResponseWarningCount);
							dLeaveResponseCriticalDate = RawSecondsToDate(DateToRawSeconds(catEvent.finish_date) +  86400 * iLeaveResponseCriticalCount);

							currentEventImage = "";
							if (bShowTiles)
							{
								if( catEvent.resource_id.HasValue )
									currentEventImage = "/download_file.js?file_id=" + catEvent.resource_id;
								else if( bShowDefaultImage )
									currentEventImage = "/images/event.png";
							}
							else if( bShowDefaultImage )
							{
								currentEventImage = "/images/event.png";
							}
							arrToDoItems.push( {
								"id": catEvent.id.Value,
								"value": StrXmlDate( Date( sDateToLeaveResponse ) ),
								"type": "response",
								"type_name": i18n.t( 'c_responce' ),
								"state_id": '',
								"state": '',
								"name": tools_web.get_cur_lng_name( catEvent.name.Value, sLngShortID ),
								"action": ( tools_web.get_mode_clean_url( "response", null, { response_type_id: catEvent.default_response_type_id, response_object_id: catEvent.id } ) ),
								"actionLabel": i18n.t( 'ostavitotzyvob' ),
								"future": false,
								"critical": (dLeaveResponseWarningDate < CurDate),
								"indefinite": false,
								"date": StrDate( sDateToLeaveResponse, false, false ),
								"strDate": tools_web.get_date_remain_string( sDateToLeaveResponse, oLngItems ),
								"exceeded": (dLeaveResponseCriticalDate < CurDate),
								"image": currentEventImage
							} );
						}
						catch( err )
						{
						}
				}
			}

			if(bShowPolls)
			{
				xarrPollResults = XQuery("for $elem in poll_results where $elem/person_id = " + iUserID + " and $elem/status = 0 and $elem/is_done != true() return $elem");
				xarrPollProcedures = new Array();
				if( ArrayOptFind( xarrPollResults, "This.poll_procedure_id.HasValue" ) != undefined )
				{
					xarrPollProcedures = XQuery( "for $elem in poll_procedures where $elem/end_date < " + XQueryLiteral( dDateToShow ) + " and MatchSome( $elem/id, ( " + ArrayMerge( ArraySelect( xarrPollResults, "This.poll_procedure_id.HasValue" ), "This.poll_procedure_id", "," ) + " ) ) return $elem" )
				}

				xarrPollResultToAnswers = ArraySelectDistinct( ArraySelect( xarrPollResults, "This.poll_procedure_id.HasValue" ), "This.poll_procedure_id" );

				if(ArrayOptFirstElem(xarrPollResultToAnswers) != undefined )
				{
					dPollsWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iPollsWarningCount);
					dPollsCriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iPollsCriticalCount);

					for(catPollResult in xarrPollResultToAnswers)
						try
						{
							carPollProcedure = ArrayOptFind( xarrPollProcedures, "This.id == catPollResult.poll_procedure_id" );
							if ( carPollProcedure == undefined )
								continue;

							//sDateToEndPoll = RawSecondsToDate(DateToRawSeconds(carPollProcedure.end_date) + 86400 * iPollsWarningCount);
							//carPollProcedure.end_date = sDateToEndPoll;
							if(carPollProcedure.end_date.HasValue)
							{
								arrToDoItems.push( {
									"id": carPollProcedure.id.Value,
									"value": ( carPollProcedure.end_date.HasValue ? carPollProcedure.end_date.XmlValue : "" ),
									"type": "poll",
									"type_name": i18n.t( 'c_poll' ),
									"state_id": '',
									"state": '',
									"name": tools_web.get_cur_lng_name( carPollProcedure.name.Value, sLngShortID ),
									"action": ( tools_web.get_mode_clean_url( null, catPollResult.poll_procedure_id ) ),
									"actionLabel": i18n.t( 'zavershitprohozh' ),
									"future": (carPollProcedure.end_date > dPollsWarningDate),
									"critical": (carPollProcedure.end_date < dPollsCriticalDate),
									"indefinite": false,
									"date": StrDate( carPollProcedure.end_date, false, false ),
									"strDate": tools_web.get_date_remain_string( carPollProcedure.end_date, oLngItems),
									"exceeded": (carPollProcedure.end_date < CurDate),
									"image": ( bShowDefaultImage ? "/images/poll_procedure.png" : "" )
								} );
							}
							else
							{
								arrToDoItems.push( {
									"id": carPollProcedure.id.Value,
									"value": ( carPollProcedure.start_date.HasValue ? carPollProcedure.start_date.XmlValue : "" ),
									"type": "poll",
									"type_name": i18n.t( 'c_poll' ),
									"state_id": '',
									"state": '',
									"name": tools_web.get_cur_lng_name( carPollProcedure.name.Value, sLngShortID ),
									"action": ( tools_web.get_mode_clean_url( null, catPollResult.poll_procedure_id ) ),
									"actionLabel": i18n.t( 'zavershitprohozh' ),
									"future": false,
									"critical": false,
									"indefinite": true,
									"date": "",
									"strDate": i18n.t( 'bezsroka' ),
									"exceeded": false,
									"image": ( bShowDefaultImage ? "/images/poll_procedure.png" : "" )
								} );

							}
						}
						catch( err )
						{
						}
				}
			}

			if(bShowRequests)
			{
				var curUserID = iUserID;
				var curUser = teUser;
				//xarrRequests = XQuery( "for $elem in requests where $elem/workflow_id != null() and $elem/status_id='active'  and ( MatchSome( $elem/workflow_person_id, (" + curUserID + ") ) or IsEmpty( $elem/workflow_person_id ) = true() ) return $elem" );

				dRequestsCriticalDate = RawSecondsToDate(iRawSeconds - 86400 * iRequestsCriticalCount);

				// В условии видимости документооборота может использоваться переменная curObject, в данном случае в этой роли выступает карточка заявки.
				curMode = "";

				if( Session != null )
				{
					Env = Session.GetOptProperty( "Env" );
					if( Env != undefined )
					{
						curMode = Env.GetOptProperty( "curMode", "" );
					}
				}
				else
				{
					try
					{
						Env = CurRequest.Session.Env;
					}
					catch( ex )
					{
						Env = ({});
					}
				}
				xarrRequestTypes = XQuery( "for $elem in request_types return $elem" );
				oParams = {
					xquery_qual: "$elem/status_id = 'active'"
				};
				try
				{
					var oExtRes = tools_web.external_eval( "workflow_condition_requests", oParams, Env );
					for ( catRequestElem in oExtRes.array )
					{
						try
						{
							oRequest = catRequestElem;
							teRequest = tools.open_doc( catRequestElem.id ).TopElem;
							catRequestType = ArrayOptFind( xarrRequestTypes, "This.id == teRequest.request_type_id" );
							if(oRequest != null)
							{
								arrToDoItems.push( {
									"id": oRequest.id.Value,
									"value": ( oRequest.modification_date.HasValue ? oRequest.modification_date.XmlValue : "" ),
									"type": "request",
									"type_name": i18n.t( 'c_request' ),
									"state_id": '',
									"state": '',
									"name": ( catRequestType == undefined ? i18n.t( 'c_deleted' ) : tools_web.get_cur_lng_name( catRequestType.name.Value, sLngShortID ) ),
									"action": ( tools_web.get_mode_clean_url( null, oRequest.PrimaryKey ) ),
									"actionLabel": i18n.t( 'soglasovatzayav' ),
									"future": false,
									"critical": (oRequest.modification_date > dRequestsCriticalDate),
									"indefinite": false,
									"date": StrDate( oRequest.modification_date, false, false ),
									"strDate": tools_web.get_date_remain_string( oRequest.modification_date, oLngItems ),
									"exceeded": ( teRequest.plan_close_date.HasValue && teRequest.plan_close_date < CurDate ),
									"image": ( bShowDefaultImage ? "/images/request.png" : "" )
								} );
							}
						}
						catch ( err )
						{
						}
					}
				}
				catch( ex )
				{}
			}

			if(bShowChatInvites)
			{
				xarrNewInvites = XQuery("for $elem in personal_chats where $elem/person_id = " + iUserID + " and $elem/prohibited != true() and $elem/partner_prohibited != true() and $elem/confirmed != true() and $elem/partner_confirmed = true() order by $elem/last_message_date return $elem");
				for ( catChat in xarrNewInvites )
				{
					arrToDoItems.push( {
						"id": catChat.id.Value,
						"value": ( catChat.modification_date.HasValue ? catChat.modification_date.XmlValue : "" ),
						"type": "invite",
						"type_name": i18n.t( 'c_chat' ),
						"state_id": '',
						"state": '',
						"name": catChat.partner_fullname.Value,
						"action": tools_web.get_mode_clean_url( "communications" ),
						"actionLabel": i18n.t( 'podtverditobshe' ),
						"future": false,
						"critical": false,
						"indefinite": false,
						"date": StrDate( catChat.modification_date, false, false ),
						"strDate": "-",
						"exceeded": false,
						"image": ( bShowDefaultImage ? "/images/chat.png" : "" )
					} );
				}
			}



			if(bShowAssessmentApraises)
			{
				var teCollection = null
				if (iAssessmentCollectionID==null)
				{
					teCollection = OpenDoc(UrlFromDocID(ArrayOptFirstElem(XQuery("for $elem in remote_collections where $elem/code = 'GetAssessmentListToParticipate' return $elem")).PrimaryKey)).TopElem;
					teCollection.wvars.ObtainChildByKey("AssMode").value = 0;
					teCollection.wvars.ObtainChildByKey( "assessmentStatus" ).value = "0";
					teCollection.wvars.ObtainChildByKey( "bIncludeSelf" ).value = true;
				}
				else
				{
					teCollection = OpenDoc(UrlFromDocID(iAssessmentCollectionID)).TopElem;
				}

				if (teCollection !=null)
				{
					oTempRequest = tools_web.get_empty_request();
					oTempRequest.Session.Env.curUserID = iUserID;
					oTempRequest.Session.Env.curUser = teUser;
					var oResult = teCollection.evaluate("raw", ( Request != null ? Request : oTempRequest ) );
					if(oResult.error == 0 && ArrayOptFirstElem(oResult.result) != undefined )
					{
						dAssAprWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iAssessmentWarningCount);
						dAssAprriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iAssessmentCriticalCount);
						function get_assessment_appraise( iId )
						{
							iId = OptInt( iId );
							if( iId == undefined )
								return undefined;

							var oAssessmentAppraise = ArrayOptFind( arrAssessmentAppraises, "This.id == iId" );
							if( oAssessmentAppraise == undefined )
							{
								oAssessmentAppraise = new Object();
								oAssessmentAppraise.id = iId;
								var TE = undefined;
								try
								{
									TE = OpenDoc( UrlFromDocID( iId ) ).TopElem;
								}
								catch( ex )
								{}
								oAssessmentAppraise.top_elem = TE;
								arrAssessmentAppraises.push( oAssessmentAppraise );
							}
							return oAssessmentAppraise.top_elem;
						}
						var arrAssessmentAppraises = new Array();
						for( oResult in ArraySelect( oResult.result, "This.start_date < dDateToShow" ) )
							try
							{
								if(oResult.name == "")
									continue;

								teAssessment = OpenDoc(UrlFromDocID(Int(oResult.id))).TopElem;
								sUrl = (teAssessment.player == 1)  ?  ("/appr_player.html?assessment_appraise_id=" + oResult.id) : tools_web.get_mode_clean_url( "assessment_appraise", null, { assessment_appraise_id: oResult.id } );
								//teAssessmentAppraise = get_assessment_appraise( teAssessment.assessment_appraise_id );
								if(teAssessment.end_date.HasValue)
								{
									oValues = ({
										"id": Int( oResult.id ),
										"type": "assessment",
										"type_name": i18n.t( 'ass_name' ),
										"state_id": '',
										"state": '',
										"name": (tools_web.get_cur_lng_name( RValue( oResult.name ), sLngShortID )),
										"value": teAssessment.end_date.XmlValue,
										"action": sUrl,
										"future": (teAssessment.end_date > dAssAprWarningDate),
										"critical": (teAssessment.end_date < dAssAprriticalDate),
										"indefinite": false,
										"date": StrDate( teAssessment.end_date, false, false ),
										"strDate": tools_web.get_date_remain_string( teAssessment.end_date, oLngItems),
										"exceeded": (teAssessment.end_date < CurDate),
										"actionLabel": sConstFinishAssProcedure,
										"image": ( teAssessment.resource_id.HasValue || bShowDefaultImage ? get_object_image_url( teAssessment ) : "" )
									});
								}
								else
								{
									oValues = ({
										"id": Int( oResult.id ),
										"type": "assessment",
										"type_name": i18n.t( 'ass_name' ),
										"state_id": '',
										"state": '',
										"name": (tools_web.get_cur_lng_name( RValue( oResult.name ), sLngShortID )),
										"value": ( teAssessment.start_date.HasValue ? teAssessment.start_date.XmlValue : "" ),
										"action": sUrl,
										"future": false,
										"critical": false,
										"indefinite": true,
										"date": "",
										"strDate": i18n.t( 'bezsroka' ),
										"exceeded": false,
										"actionLabel": sConstFinishAssProcedure,
										"image": ( teAssessment.resource_id.HasValue || bShowDefaultImage ? get_object_image_url( teAssessment ) : "" )
									});
								}
								arrToDoItems.push( oValues );
							}
							catch( err )
							{
							}
					}
				}
			}


			if(bShowTasks)
			{

				strQuery='for $elem in tasks'
				strWhere='$elem/executor_id='+iUserID
				if (bShowAssignerTasks)
				{
					strWhere=strWhere+' or $elem/assigner_id='+iUserID
				}
				conds = new Array();
				conds.push( '('+strWhere+')' );
				OptInt( tools_web.get_web_param( oParams, sParamPrefix + "task_type_id", "3", true ) );
				arrTaskTypeIds = tools_web.parse_multiple_parameter( tools_web.get_web_param( oParams, sParamPrefix + "task_type_id", "3", true ) );
				if( ArrayOptFirstElem( arrTaskTypeIds ) != undefined  )
				{
					conds.push( 'MatchSome( $elem/task_type_id , (' + ArrayMerge( arrTaskTypeIds, "This", "," ) + ') )' );

				}

				strWhere = "";
				for(sStatus in arrTaskStatuses)
				{
					if(sStatus != "")
					{
						if(strWhere != "")
							strWhere += " or ";
						strWhere += " $elem/status='" + sStatus + "'";
					}
				}
				if(strWhere != "")
					conds.push( '('+strWhere+')' );


				arrTasks=XQuery( "for $elem in tasks where " + ArrayMerge( conds, "This", " and " ) + " return $elem" )

				if(ArrayOptFirstElem(arrTasks) != undefined )
				{
					dTaskWarningDate = RawSecondsToDate(iRawSeconds +  86400 * iTaskWarningCount);
					dTaskCriticalDate = RawSecondsToDate(iRawSeconds + 86400 * iTaskCriticalCount);

					arrTaskTypes = new Array();
					function get_task_type( iId )
					{
						iId = OptInt( iId );
						if( iId == undefined )
							return undefined;

						var oTaskType = ArrayOptFind( arrTaskTypes, "This.id == iId" );
						if( oTaskType == undefined )
						{
							oTaskType = new Object();
							oTaskType.id = iId;
							var TE = undefined;
							try
							{
								TE = OpenDoc( UrlFromDocID( iId ) ).TopElem;
							}
							catch( ex )
							{}
							oTaskType.top_elem = TE;
							arrTaskTypes.push( oTaskType );
						}
						return oTaskType.top_elem;
					}
					function get_task_url( catElem )
					{
						if( !catElem.task_type_id.HasValue )
							return tools_web.get_mode_clean_url( null, catElem.id );
						teTaskType = get_task_type( catElem.task_type_id );
						if( teTaskType == undefined || !teTaskType.eval_code_for_url.HasValue )
							return tools_web.get_mode_clean_url( null, catElem.id );
						try
						{
							return eval( teTaskType.eval_code_for_url );
						}
						catch( err )
						{
							alert( err )
						}
						return tools_web.get_mode_clean_url( null, catElem.id );
					}

					for(catTaskResult in arrTasks)
						try
						{
							sUrl = get_task_url( catTaskResult )
							if (sUrl!='')
							{
								if(catTaskResult.date_plan.HasValue)
								{
									arrToDoItems.push( {
										"id": catTaskResult.id.Value,
										"value": ( catTaskResult.date_plan.HasValue ? catTaskResult.date_plan.XmlValue : "" ),
										"type": "task",
										"type_name": i18n.t( 'vdb_aim_task' ),
										"state_id": '',
										"state": '',
										"name": tools_web.get_cur_lng_name( catTaskResult.name.Value, sLngShortID ),
										"action": sUrl,
										"actionLabel": i18n.t( 'vypolnitzadachu' ),
										"future": (catTaskResult.date_plan < dTaskWarningDate),
										"critical": (catTaskResult.date_plan < dTaskCriticalDate),
										"indefinite": false,
										"date": StrDate( catTaskResult.date_plan, false, false ),
										"strDate": tools_web.get_date_remain_string( catTaskResult.date_plan, oLngItems),
										"exceeded": (catTaskResult.date_plan < CurDate),
										"image": ( bShowDefaultImage ? "/images/task.png" : "" )
									} );
								}
								else
								{
									arrToDoItems.push( {
										"id": catTaskResult.id.Value,
										"value": ( catTaskResult.modification_date.HasValue ? catTaskResult.modification_date.XmlValue : "" ),
										"type": "task",
										"type_name": i18n.t( 'vdb_aim_task' ),
										"state_id": '',
										"state": '',
										"name": tools_web.get_cur_lng_name( catTaskResult.name.Value, sLngShortID ),
										"action": sUrl,
										"actionLabel": i18n.t( 'vypolnitzadachu' ),
										"future": false,
										"critical": false,
										"indefinite": true,
										"date": "",
										"strDate": i18n.t( 'bezsroka' ),
										"exceeded": false,
										"image": ( bShowDefaultImage ? "/images/task.png" : "" )
									} );
								}
							}
							else
							{
								if(catTaskResult.date_plan.HasValue)
								{
									arrToDoItems.push( {
										"id": catTaskResult.id.Value,
										"value": ( catTaskResult.date_plan.HasValue ? catTaskResult.date_plan.XmlValue : "" ),
										"type": "task",
										"type_name": i18n.t( 'vdb_aim_task' ),
										"state_id": '',
										"state": '',
										"name": tools_web.get_cur_lng_name( catTaskResult.name.Value, sLngShortID ),
										"action": '#',
										"actionLabel": i18n.t( 'vypolnitzadachu' ),
										"future": (catTaskResult.date_plan < dTaskWarningDate),
										"critical": (catTaskResult.date_plan < dTaskCriticalDate),
										"indefinite": false,
										"date": StrDate( catTaskResult.date_plan, false, false ),
										"strDate": tools_web.get_date_remain_string( catTaskResult.date_plan, oLngItems),
										"exceeded": (catTaskResult.date_plan < CurDate),
										"image": ( bShowDefaultImage ? "/images/task.png" : "" )
									} );
								}
								else
								{
									arrToDoItems.push( {
										"id": catTaskResult.id.Value,
										"value": ( catTaskResult.modification_date.HasValue ? catTaskResult.modification_date.XmlValue : "" ),
										"type": "task",
										"type_name": i18n.t( 'vdb_aim_task' ),
										"state_id": '',
										"state": '',
										"name": tools_web.get_cur_lng_name( catTaskResult.name.Value, sLngShortID ),
										"action": '#',
										"actionLabel": i18n.t( 'vypolnitzadachu' ),
										"future": false,
										"critical": false,
										"indefinite": true,
										"date": "",
										"strDate": i18n.t( 'bezsroka' ),
										"exceeded": false,
										"image": ( bShowDefaultImage ? "/images/task.png" : "" )
									} );
								}
							}
						}
						catch( err )
						{
						}
				}
			}


			if ( bShowLibraryMaterials )
			{
				curLibraryMaterialViewings = ArraySelectAll( XQuery( "for $elem in library_material_viewings where $elem/person_id = " + iUserID + " and ( $elem/state_id = 'active' or $elem/state_id = 'plan' ) return $elem" ) );
				if ( ArrayOptFirstElem( curLibraryMaterialViewings ) != undefined )
				{
					iLibraryMaterialCriticalDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + ".iLibraryMaterialCriticalDaysCount", 3, true ), 3 );
					dLibraryMaterialCriticalDate = RawSecondsToDate( iRawSeconds + 86400 * iLibraryMaterialCriticalDaysCount );

					xarrMaterials = new Array();
					if( ArrayOptFind( curLibraryMaterialViewings, "This.material_id.HasValue" ) != undefined )
					{
						xarrMaterials = XQuery( "for $elem in library_materials where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( curLibraryMaterialViewings, "This.material_id.HasValue" ), "This.material_id" ), "This.material_id", "," ) + " ) ) return $elem/Fields('id','resource_id')" );
					}
					for ( catLibraryMaterialViewingElem in curLibraryMaterialViewings )
						try
						{
							catLibraryMaterial = ArrayOptFindByKey( xarrMaterials, catLibraryMaterialViewingElem.material_id, "id" );
							if ( catLibraryMaterialViewingElem.material_id.HasValue && catLibraryMaterial != undefined )
							{
								oValues = ({
									"id": catLibraryMaterialViewingElem.id.Value,
									"type": "library_material",
									"type_name": i18n.t( 'materialbiblio' ),
									"state_id": '',
									"state": '',
									"name": tools_web.get_cur_lng_name( catLibraryMaterialViewingElem.material_name.Value, sLngShortID ),
									"action": tools_web.get_object_source_url( 'library_material', catLibraryMaterialViewingElem.material_id ),
									"actionLabel": i18n.t( 'prosmotretmate' ),
									"image": ( bShowDefaultImage || catLibraryMaterial.resource_id.HasValue ? get_object_image_url( catLibraryMaterial ) : "" )
								});
								if ( catLibraryMaterialViewingElem.start_viewing_date.HasValue )
								{
									oValues.SetProperty( "value", catLibraryMaterialViewingElem.start_viewing_date.XmlValue );
									oValues.SetProperty( "date", StrDate( catLibraryMaterialViewingElem.start_viewing_date, false, false ) );
									oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) ); //tools_web.get_date_remain_string( catLibraryMaterialViewingElem.start_viewing_date, oLngItems ) );
									oValues.SetProperty( "exceeded", false ); //( catLibraryMaterialViewingElem.start_viewing_date < CurDate ) );
									oValues.SetProperty( "indefinite", false );
									oValues.SetProperty( "critical", false ); //( catLibraryMaterialViewingElem.start_viewing_date < dLibraryMaterialCriticalDate ) );
									oValues.SetProperty( "future", ( catLibraryMaterialViewingElem.start_viewing_date > CurDate ) );
								}
								else
								{
									oValues.SetProperty( "value", catLibraryMaterialViewingElem.creation_date.Value );
									oValues.SetProperty( "date", "" );
									oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) );
									oValues.SetProperty( "exceeded", false );
									oValues.SetProperty( "indefinite", true );
									oValues.SetProperty( "critical", false );
									oValues.SetProperty( "future", false );
								}
								arrToDoItems.push( oValues );
							}
						}
						catch( err )
						{
						}
				}
			}


			if ( bShowAcquaints )
			{
				curAcquaintAssigns = ArraySelectAll( XQuery( "for $elem in acquaint_assigns where $elem/person_id = " + iUserID + " and MatchSome( $elem/state_id, ( 'assign', 'active' ) ) return $elem" ) );
				if ( ArrayOptFirstElem( curAcquaintAssigns ) != undefined )
				{
					iAcquaintCriticalDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + ".iAcquaintCriticalDaysCount", 3, true ), 3 );
					dAcquaintAssignCriticalDate = RawSecondsToDate( iRawSeconds + 86400 * iAcquaintCriticalDaysCount );

					for ( catAcquaintAssignElem in curAcquaintAssigns )
						try
						{
							catalog = common.exchange_object_types.GetOptChildByKey( catAcquaintAssignElem.object_type );

							link = "";
							if( catalog != undefined )
							{

								if( catAcquaintAssignElem.object_type == "document" )
								{
									ob = catAcquaintAssignElem.object_id.ForeignElem;
									if( ob.is_link )
										link = ob.link_href.Value;
									else
										link = "" + String( tools_web.doc_link( ob ) );
									if( link == "" )
										link = tools_web.get_mode_clean_url( "doc", null, { doc_id: catAcquaintAssignElem.object_id } );
								}
								else
									link = tools_web.get_mode_clean_url( null, catAcquaintAssignElem.object_id.Value );
									//link = catalog.web_template != "" ? catalog.web_template + ( String( catalog.web_template ).indexOf("?") >= 0 ? "&" : "?" ) + "object_id=" + catAcquaintAssignElem.object_id.Value : "";
							}
							feObject = catAcquaintAssignElem.object_id.OptForeignElem;
							oValues = ({
								"id": catAcquaintAssignElem.id.Value,
								"type": "acquaint",
								"type_name": i18n.t( 'vmkpb_acquaint' ),
								"state_id": '',
								"state": '',
								"name": tools_web.get_cur_lng_name( catAcquaintAssignElem.object_name.Value, sLngShortID ),
								"action": ( link ),
								"actionLabel": i18n.t( 'oznakomitsyasdo' ),
								"sec_object_id": catAcquaintAssignElem.object_id.Value,
								"image": ( feObject != undefined ? ( ( ( feObject.ChildExists( "resource_id" ) && feObject.resource_id.HasValue ) || bShowDefaultImage ) ? get_object_image_url( feObject ) : "" ) : ( bShowDefaultImage ? "/images/acquaint.png" : "" ) )
							});
							if ( catAcquaintAssignElem.normative_date.HasValue )
							{
								oValues.SetProperty( "value", catAcquaintAssignElem.normative_date.XmlValue );
								oValues.SetProperty( "date", StrDate( catAcquaintAssignElem.normative_date, false, false ) );
								oValues.SetProperty( "strDate", tools_web.get_date_remain_string( catAcquaintAssignElem.normative_date.Value, oLngItems ) );
								oValues.SetProperty( "exceeded", ( catAcquaintAssignElem.normative_date < CurDate ) );
								oValues.SetProperty( "indefinite", false );
								oValues.SetProperty( "critical", ( catAcquaintAssignElem.normative_date < dAcquaintAssignCriticalDate ) );
								oValues.SetProperty( "future", ( catAcquaintAssignElem.normative_date > CurDate ) );
							}
							else
							{
								oValues.SetProperty( "value", catAcquaintAssignElem.modification_date.XmlValue );
								oValues.SetProperty( "date", "" );
								oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) );
								oValues.SetProperty( "exceeded", false );
								oValues.SetProperty( "indefinite", true );
								oValues.SetProperty( "critical", false );
								oValues.SetProperty( "future", true );
							}
							arrToDoItems.push( oValues );
						}
						catch( err )
						{
						}
				}
			}


			if ( bShowLearningTasks )
			{
				curLearningTaskResults = ArraySelectAll( XQuery( "for $elem in learning_task_results where $elem/person_id = " + iUserID + " and ($elem/status_id = 'process' or $elem/status_id = 'assign') and $elem/event_id = null() return $elem" ) );
				if ( ArrayOptFirstElem( curLearningTaskResults ) != undefined )
				{
					iLearningTaskCriticalDaysCount = OptInt( tools_web.get_web_param( oParams, sParamPrefix + ".iLearningTaskCriticalDaysCount", 3, true ), 3 );
					dLearningTaskResultCriticalDate = RawSecondsToDate( iRawSeconds + 86400 * iLearningTaskCriticalDaysCount );
					xarrLearningTasks = new Array();
					if( ArrayOptFind( curLearningTaskResults, "This.learning_task_id.HasValue" ) != undefined )
					{
						xarrLearningTasks = XQuery( "for $elem in learning_tasks where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( curLearningTaskResults, "This.learning_task_id.HasValue" ), "This.learning_task_id" ), "This.learning_task_id", "," ) + " ) ) return $elem/Fields('id','resource_id')" );
					}
					for ( catLearningTaskResultElem in curLearningTaskResults )
						try
						{
							if( !catLearningTaskResultElem.learning_task_id.HasValue )
							{
								continue
							}
							catLearningTask = ArrayOptFind( xarrLearningTasks, "This.id == catLearningTaskResultElem.learning_task_id" );
							currentTaskImage = "";
							if (bShowTiles)
								{
									if( catLearningTask.resource_id.HasValue )
										currentTaskImage = "/download_file.js?file_id=" + catLearningTask.resource_id;
									else if( bShowDefaultImage )
										currentTaskImage = "/images/learning_task.png";
								}
								else if( bShowDefaultImage )
								{
									currentTaskImage = "/images/learning_task.png";
								}



							oValues = ({
								"id": catLearningTaskResultElem.id.Value,
								"type": "learning_task",
								"type_name": i18n.t( 'zzzv3sxxx47yyy' ),
								"state_id": '',
								"state": '',
								"name": tools_web.get_cur_lng_name( catLearningTaskResultElem.learning_task_name.Value, sLngShortID ),
								"action": ( tools_web.get_mode_clean_url( null, catLearningTaskResultElem.id ) ),
								"actionLabel": i18n.t( 'vypolnitzadani' ),
								"image": currentTaskImage
							});
							fldResultDate = catLearningTaskResultElem.plan_start_date.HasValue ? catLearningTaskResultElem.plan_start_date : catLearningTaskResultElem.plan_end_date;
							if ( fldResultDate.HasValue )
							{
								oValues.SetProperty( "value", fldResultDate.XmlValue );
								oValues.SetProperty( "date", StrDate( fldResultDate.Value, false, false ) );
								oValues.SetProperty( "strDate", tools_web.get_date_remain_string( fldResultDate.Value, oLngItems ) );
								oValues.SetProperty( "exceeded", ( fldResultDate.Value < CurDate ) );
								oValues.SetProperty( "indefinite", false );
								oValues.SetProperty( "critical", ( fldResultDate.Value < dLearningTaskResultCriticalDate ) );
								oValues.SetProperty( "future", ( fldResultDate.Value > CurDate ) );
							}
							else
							{
								oValues.SetProperty( "value", catLearningTaskResultElem.modification_date.XmlValue );
								oValues.SetProperty( "date", "" );
								oValues.SetProperty( "strDate", i18n.t( 'bezsroka' ) );
								oValues.SetProperty( "exceeded", false );
								oValues.SetProperty( "indefinite", true );
								oValues.SetProperty( "critical", false );
								oValues.SetProperty( "future", true );
							}
							arrToDoItems.push( oValues );
						}
						catch( err )
						{
						}
				}
			}


			arrToDoItems = ArraySort( arrToDoItems, "value", "+" );
			oToDoInit.SetProperty( "arrToDoItems", arrToDoItems );

			if( bUpdateCache )
				tools_web.set_user_data( sPrimaryKey, oToDoInit, iTimeToCache );

			switch( sStatusID )
			{
				case "exceeded":
					oToDoInit.arrToDoItems = ArraySelect( oToDoInit.arrToDoItems, "This.exceeded" );
					break;
				case "critical":
					oToDoInit.arrToDoItems = ArraySelect( oToDoInit.arrToDoItems, "This.critical && !This.exceeded" );
					break;
				case "future":
					oToDoInit.arrToDoItems = ArraySelect( oToDoInit.arrToDoItems, "This.future && !This.critical && !This.exceeded" );
					break;
			}

			oRes.array = oToDoInit.arrToDoItems;
		}

		if( sSearch != "" )
		{
			oRes.array = ArraySelect( oRes.array, "StrContains( This.name, sSearch ) || StrContains( This.type_name, sSearch )" );
		}
		if( iMaxCount != undefined )
		{
			oRes.array = ArrayRange( oRes.array, 0, iMaxCount );
		}
	}
	catch ( err )
	{

		oRes.error = 1;
		oRes.errorText = String( err );
		return oRes;
	}
	return oRes;
}

/**
 * @typedef {Object} oPerson
 * @property {bigint} id
 * @property {string} fullname
 * @property {string} position_name
 * @property {string} link
 * @property {string} image_url
 * @property {string} email
 * @property {string} phone
 * @property {string} org_name
 * @property {string} position_parent_name
 * @property {date} birth_date - Дата рождения
 * @property {int} age - Возраст
 * @property {date} hire_date - Дата приема на работу
 * @property {number} expirience - Стаж в компании в месяцах
 * @property {string} expirience_level - Уровень стажа в компании
 * @property {string} sex - Пол
 * @property {string} status - Общее состояние сотрудника
 * @property {string} status_class - Класс состояния
 * @property {string} tags - Строка тэгов
 * @property {string} effectiveness - Эффективность
 * @property {bigint} efficiency_estimation_id - ID оценки эффективности
 * @property {string} efficiency_estimation - Оценка эффективности
 * @property {bigint} development_potential_id - ID оценки потенциала
 * @property {string} development_potential - Оценка потенциала
*/
/**
 * @typedef {Object} WTMainPersonCollaboratorsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oPerson[]} array – массив
*/
/**
 * @function GetPersonCollaborators
 * @memberof Websoft.WT.Main
 * @description Получения списка сотрудников (коллеги, руководители или подчиненные).
 * @author BG
 * @param {bigint} iPersonID - ID сотрудника
 * @param {string} sTypeCollaborator - Выбор, по кому осуществлять выборку ( colleagues/colleagues_hier/colleagues_org/colleagues_boss/bosses/subordinates/main_subordinates/func_subordinates/all_subordinates )
 * @param {number} [iMaxCnt] - Максимальное количество выводимых сотрудников в блоке
 * @param {boolean} [bShowDismiss=false] - Показывать уволенных сотрудников
 * @param {string} [sSearch] - Поиск по строке
 * @param {string} [bAllHier] - Искать всех руководителей вверх по иерархии
 * @param {bigint[]} [arrBossTypesID] - Типы руководителей
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {WTMainPersonCollaboratorsResult}
*/
/* copy to @component employee_management  */
function GetPersonCollaborators( iPersonID, sTypeCollaborator, iMaxCnt, bShowDismiss, sSearch, bAllHier, arrBossTypesID, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();

	var oPaging = (DataType(oCollectionParams) == 'object' && ObjectType(oCollectionParams) == 'JsObject') ? oCollectionParams.GetOptProperty("paging", {SIZE: null, INDEX: 0}) : {SIZE: null, INDEX: 0};
	oRes.paging = oPaging;

	oRes.array = [];
	oRes.data={};

	var oResArray = new Array();
	var libParam = tools.get_params_code_library('libMain');
	if(!IsArray(arrBossTypesID))
	{
		arrBossTypesID = getDefaultBossTypeIDs(libParam);
	}

	var arrDistinct = (DataType(oCollectionParams) == 'object' && ObjectType(oCollectionParams) == 'JsObject' && IsArray(oCollectionParams.GetOptProperty("distincts", null))) ? oCollectionParams.distincts : [];


	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}
	try
	{
		if( sTypeCollaborator == undefined || sTypeCollaborator == null || sTypeCollaborator == "" )
			throw "error";
	}
	catch( ex )
	{
		sTypeSubordinate = libParam.GetOptProperty("DefaultSubordinateType", "all_subordinates");
	}

	try
	{
		iMaxCnt = OptInt( iMaxCnt );
	}
	catch( ex )
	{
		iMaxCnt = undefined;
	}
	try
	{
		if( bAllHier == undefined || bAllHier == null || bAllHier == "" )
			throw "error";
		bAllHier = tools_web.is_true( bAllHier );
	}
	catch( ex )
	{
		bAllHier = false;
	}
	try
	{
		if( bShowDismiss == undefined || bShowDismiss == null || bShowDismiss == "" )
			throw "error";
		bShowDismiss = tools_web.is_true( bShowDismiss );
	}
	catch( ex )
	{
		bShowDismiss = false;
	}

	var arrCollaborators = []
	try
	{
		arrCollaborators = get_user_collaborators( iPersonID, sTypeCollaborator, bShowDismiss, sSearch, bAllHier, arrBossTypesID, oCollectionParams );
	}
	catch(err)
	{
		oRes.error = 1;
		oRes.errorText = err;
		return oRes;
	}


	// формирование возврата distinct
	var bIsAjaxFilter = false;
	if(ArrayOptFirstElem(arrDistinct) != undefined)
	{
		oRes.data.SetProperty("distincts", {});
		bIsAjaxFilter = true;
		var xarrPositions, xarrSubdivision, xarrStatuses;
		for(sFieldName in arrDistinct)
		{
			oRes.data.distincts.SetProperty(sFieldName, []);
			switch(sFieldName)
			{
				case "f_sex":
				{
					oRes.data.distincts.f_sex = [
						{name:i18n.t( 'muzhskoy' ), value: "m"},
						{name:i18n.t( 'zhenskiy' ), value: "w"}
					];
					break;
				}
				case "f_tags":
				{
					oRes.data.distincts.f_tags = [
						{name: i18n.t( 'adaptaciya' ), value: "adaptation"},
						{name: i18n.t( 'oficialnyypree' ), value: "successor"},
						{name: i18n.t( 'rukovoditel' ), value: "boss"},
						{name: i18n.t( 'ekspert' ), value: "expert"},
						{name: i18n.t( 'nastavnik' ), value: "tutor"}
					];

					for(itemPersReserve in tools.xquery("for $elem in career_reserve_types return $elem"))
					{
						oRes.data.distincts.f_tags.push({name: "#" + itemPersReserve.name.Value, value: itemPersReserve.id.Value})
					}
					break;
				}
				case "f_status":
				{
					oRes.data.distincts.f_status = [{name: i18n.t( 'vsesotrudnikii' ), value: "all"}];
					// if(ArrayOptFind(arrCollaborators, "This.is_dismiss.Value == false && This.current_state.Value == ''") != undefined )
						oRes.data.distincts.f_status.push({name: i18n.t( 'rabotaet' ), value: "active"});
					// if(ArrayOptFind(arrCollaborators, "This.is_dismiss.Value == true") != undefined )
						oRes.data.distincts.f_status.push({name: i18n.t( 'uvolen' ), value: "is_dismiss"});

					//var arrSortCollaborators = ArraySort(arrCollaborators, "This.current_state.Value", "+")
					for(itemState in lists.person_states)
					{
						//if(ArrayOptFirstElem(ArraySelectBySortedKey(arrSortCollaborators, itemState.name.Value,  "current_state")) != undefined )
							oRes.data.distincts.f_status.push({name: itemState.name.Value, value: itemState.id.Value});
					}
					//arrSortCollaborators = undefined;
					break;
				}
			}
		}
	}

	if(ObjectType(oPaging) == 'JsObject' && oPaging.SIZE != null)
	{
		var oRetPage = select_page_sort_params(arrCollaborators, oPaging);
		oPaging = oRetPage.oPaging;
		arrCollaborators = oRetPage.oResult;
	}
	else if( OptInt(iMaxCnt) != undefined )
	{
		arrCollaborators = ArrayRange( arrCollaborators, 0, iMaxCnt );
	}

	var iHighEffectivenessLevel = libParam.GetOptProperty("DefaultHighEffectivenessLevel", 80);
	var iEffectivenessPeriod = libParam.GetOptProperty("EffectivenessPeriod", 365);

	var xarrAssessmentForms, xarrAssessmentForm;
	var fldCareerReserveType, arrTagElems;
	if( ArrayOptFirstElem( arrCollaborators ) != undefined )
	{
		var sMergePersonIds = ArrayMerge( arrCollaborators, "This.id", "," );
		var arrCareerReserves = ArraySelectAll(tools.xquery("for $elem_qc in career_reserves where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) and $elem_qc/status='active' and $elem_qc/position_type='adaptation' order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"));
		var arrSuccessors = ArraySelectAll(tools.xquery("for $elem_qc in successors where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) and $elem_qc/status='active' or $elem_qc/status='approved' order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"));
		var arrPersonReserves = ArraySelectAll(tools.xquery("for $elem_qc in personnel_reserves where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) and $elem_qc/status='in_reserve' order by $elem_qc/person_id return $elem_qc/Fields('id','person_id','career_reserve_type_id')"));
		var arrFuncManagers = ArraySelectAll(tools.xquery("for $elem_qc in func_managers where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"));
		var arrExperts = ArraySelectAll(tools.xquery("for $elem_qc in experts where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"));
		var arrTutors = ArraySelectAll(tools.xquery("for $elem_qc in tutors where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"));
		var xarrAllAssessmentForms = ArraySelectAll(tools.xquery("for $elem_qc in pas where MatchSome( $elem_qc/person_id, (" + sMergePersonIds + ") ) and $elem_qc/assessment_appraise_type='activity_appraisal' and $elem_qc/is_done = true() and some $appr in assessment_appraises satisfies ($elem_qc/assessment_appraise_id = $appr/id and $appr/status = '1' and($appr/end_date > " + XQueryLiteral(DateOffset(Date(), (0-iEffectivenessPeriod)*86400)) + " or $appr/end_date = null())) order by $elem_qc/person_id ascending, $elem_qc/modification_date descending return $elem_qc/Fields('id','person_id','overall')"));
		
		var arrEfficiencyEstimations = new Array();
		var sMergeEfficiencyEstimationIds = ArrayMerge( ArraySelect( ArraySelectDistinct( arrCollaborators, "This.efficiency_estimation_id" ), "This.efficiency_estimation_id.HasValue" ), "XQueryLiteral( This.efficiency_estimation_id )", "," );
		if( sMergeEfficiencyEstimationIds != "" )
		{
			arrEfficiencyEstimations = ArraySelectAll(tools.xquery("for $elem_qc in efficiency_estimations where MatchSome( $elem_qc/id, (" + sMergeEfficiencyEstimationIds + ") ) order by $elem_qc/id return $elem_qc/Fields('id','name')"));
		}

		var sMergeDevelopmentPotentialIds = ArrayMerge( ArraySelect( ArraySelectDistinct( arrCollaborators, "This.development_potential_id" ), "This.development_potential_id.HasValue" ), "XQueryLiteral( This.development_potential_id )", "," );
		var arrDevelopmentPotentials = new Array();
		if( sMergeDevelopmentPotentialIds != "" )
		{
			arrDevelopmentPotentials = ArraySelectAll(tools.xquery("for $elem_qc in development_potentials where MatchSome( $elem_qc/id, (" + sMergeDevelopmentPotentialIds + ") ) order by $elem_qc/id return $elem_qc/Fields('id','name')"));
		}
		var catEfficiencyEstimation, catDevelopmentPotential;
		for( _col in arrCollaborators )
		{
			obj = ({});
			obj.id = _col.id.Value;
			obj.fullname = _col.fullname.Value;
			obj.position_name = _col.position_name.Value;
			obj.link = get_object_link( "collaborator", _col.id );
			obj.image_url = get_object_image_url( _col );
			obj.email = _col.email.Value;
			obj.phone = _col.mobile_phone.Value != "" ? _col.mobile_phone.Value : _col.phone.Value;
			obj.org_name = _col.org_name.Value;
			obj.position_parent_name = _col.position_parent_name.Value;
			obj.birth_date = "";
			obj.age = "";

			// Стаж
			obj.hire_date = ( _col.hire_date.HasValue ) ? _col.hire_date.Value : "";
			obj.expirience = "";
			obj.expirience_level = "-";
			if(obj.hire_date != "")
			{
				obj.expirience = (Year(Date())-Year(obj.hire_date))*12 + (Month(Date())-Month(obj.hire_date));
				if(obj.expirience > 36)
					obj.expirience_level = i18n.t( 'boleehlet' );
				else if(obj.expirience > 24)
					obj.expirience_level = i18n.t( 'boleedvuhlet' );
				else if(obj.expirience > 12)
					obj.expirience_level = i18n.t( 'boleegoda' );
				else
					obj.expirience_level = i18n.t( 'dogoda' );
			}
			
			// Пол
			obj.sex = "";
			switch(StrLowerCase(_col.sex.Value))
			{
				case "w":
					obj.sex = i18n.t( 'zhenskiy' );
					break;
				case "m":
					obj.sex = i18n.t( 'muzhskoy' );
					break;
			}

			// Возраст
			if(_col.birth_date.HasValue)
			{
				obj.age = Year(Date())-Year(_col.birth_date.Value);
				if(DateDiff(Date(), Date(Year(Date()), Month(_col.birth_date.Value), Day(_col.birth_date.Value))) < 0)
					obj.age -= 1;
				obj.birth_date = _col.birth_date.Value;
			}

			// Статус
			obj.status = i18n.t( 'rabotaet' );
			obj.status_class = "green_color"
			if(_col.is_dismiss.Value)
			{
				obj.status = i18n.t( 'uvolen' );
				obj.status_class = "red_color"
			}
			else if(_col.current_state.Value != "")
			{
				obj.status = _col.current_state.Value;
				obj.status_class = ""
			}

			// Тэги
			arrTagElems = [];

			if(ArrayOptFindBySortedKey(arrCareerReserves, _col.id.Value, "person_id") != undefined)
				arrTagElems.push(i18n.t( 'adaptaciya' ));

			if(ArrayOptFindBySortedKey(arrSuccessors, _col.id.Value, "person_id") != undefined)
				arrTagElems.push(i18n.t( 'oficialnyypree' ));

			for(itemPersReserve in ArraySelectDistinct(ArraySelectBySortedKey(arrPersonReserves, _col.id.Value, "person_id"), "career_reserve_type_id"))
			{
				fldCareerReserveType = itemPersReserve.career_reserve_type_id.OptForeignElem;
				if(fldCareerReserveType == undefined)
					continue;
				arrTagElems.push("#" + fldCareerReserveType.name.Value)
			}

			if(ArrayOptFindBySortedKey(arrFuncManagers, _col.id.Value, "person_id") != undefined)
				arrTagElems.push(i18n.t( 'rukovoditel' ));

			if(ArrayOptFindBySortedKey(arrExperts, _col.id.Value, "person_id") != undefined)
				arrTagElems.push(i18n.t( 'ekspert' ));

			if(ArrayOptFindBySortedKey(arrExperts, _col.id.Value, "person_id") != undefined)
				arrTagElems.push(i18n.t( 'nastavnik' ));

			obj.tags = ArrayMerge(arrTagElems, "This", ", ");
			obj.f_tags = ArrayMerge(arrTagElems, "This", "|||");

			// эффективность

			xarrAssessmentForm = ArrayOptFindBySortedKey(xarrAllAssessmentForms, _col.id.Value, "person_id");
			if(xarrAssessmentForm != undefined)
			{
				obj.effectiveness = xarrAssessmentForm.overall;
				obj.effectiveness_str = StrInt(xarrAssessmentForm.overall) + "%";
			}
			else
			{
				obj.effectiveness = null;
				obj.effectiveness_str = "-";
			}

			// Оценка эффективности
			if( _col.efficiency_estimation_id.HasValue )
			{
				catEfficiencyEstimation = ArrayOptFindBySortedKey( arrEfficiencyEstimations, _col.efficiency_estimation_id.Value, "id");
				obj.efficiency_estimation_id = _col.efficiency_estimation_id.Value;
				obj.efficiency_estimation = ( catEfficiencyEstimation != undefined ? catEfficiencyEstimation.name.Value : "" );
			}
			else
			{
				obj.efficiency_estimation_id = null;
				obj.efficiency_estimation = "-";
			}
			// Оценка потенциала
			if( _col.development_potential_id.HasValue )
			{
				catDevelopmentPotential = ArrayOptFindBySortedKey( arrDevelopmentPotentials, _col.development_potential_id.Value, "id");
				obj.development_potential_id = _col.development_potential_id.Value;
				obj.development_potential = ( catDevelopmentPotential != undefined ? catDevelopmentPotential.name.Value : "" );
			}
			else
			{
				obj.development_potential_id = null;
				obj.development_potential = "-";

			}
			oRes.array.push( obj );
		}
	}
	arrCareerReserves = undefined;
	arrSuccessors = undefined;
	arrPersonReserves = undefined;
	arrFuncManagers = undefined;
	arrExperts = undefined;
	arrTutors = undefined;
	xarrAllAssessmentForms = undefined;
	arrDevelopmentPotentials = undefined;
	arrEfficiencyEstimations = undefined;
	
	return oRes;
}

/**
 * @author BG
*/
function get_user_collaborators( iUserID, sTypeCollaborator, bShowDismiss, sSearch, bAllHier, arrBossTypesID, oCollectionParams, bWithoutUseManagementObject, bExcludeCurrentUser )
{
	bWithoutUseManagementObject = tools_web.is_true(bWithoutUseManagementObject);
	var libParam = tools.get_params_code_library('libMain');
	bShowDismiss = tools_web.is_true(bShowDismiss) || tools_web.is_true(libParam.GetOptProperty("bRetunDismissedPerson", false));
	if( IsEmptyValue( bExcludeCurrentUser ) )
	{
		bExcludeCurrentUser = true;
	}
	else
	{
		bExcludeCurrentUser = tools_web.is_true( bExcludeCurrentUser );
	}
	if(DataType(oCollectionParams) != 'object' || ObjectType(oCollectionParams) != 'JsObject')
	{
		oCollectionParams = {
			management_object_ids: null,
			sort: null,
			filters: [],
		};
	}
	else
	{
		if(!oCollectionParams.HasProperty('management_object_ids'))
			oCollectionParams.SetProperty('management_object_ids', null);

		if(!oCollectionParams.HasProperty('sort'))
			oCollectionParams.SetProperty('sort', null);

		if(!oCollectionParams.HasProperty('filters'))
			oCollectionParams.SetProperty('filters', []);
	}

	var xqConds = [];
	var codeConds = [];
	var tagIntersectIDs = null;
	var effectivenessIntersect = null;
	var arrIds = null;
	
	var XQSubordinateConds = [("$elem/id != " + iUserID)]
	if( !bShowDismiss )
	{
		XQSubordinateConds.push( "$elem/is_dismiss != true()" )
	}

	var oGetSubordinateParams = {
			arrTypeSubordinate: ['fact','func'],
			bReturnIDs: false,
			sCatalog: 'collaborator',
			arrFieldsNames: [
								'id',
								'fullname',
								'position_name',
								'email',
								'mobile_phone',
								'phone',
								'org_name',
								'position_parent_name',
								'hire_date',
								'sex',
								'birth_date',
								'is_dismiss',
								'current_state',
								'development_potential_id',
								'efficiency_estimation_id'
							],
			xQueryCond: ArrayMerge(XQSubordinateConds, "This", " and "),
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			arrBossTypeIDs: [],
			bWithoutUseManagementObject: bWithoutUseManagementObject,
			iManagementObjectID: oCollectionParams.management_object_ids,
			oSort: null
	};

	var sCondSort = " order by [{CURSOR}]/fullname";
	if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	{
		switch(oCollectionParams.sort.FIELD)
		{
			case "link":
			case "age":
			case "tags":
			case "effectiveness":
			{
				break;
			}
			case "image_url":
			{
				sCondSort = " order by [{CURSOR}]/fullname" + (StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "") ;
				oGetSubordinateParams.oSort = {FIELD: 'fullname', DIRECTION: oCollectionParams.sort.DIRECTION};
				break;
			}
			case "status":
			{
				sCondSort = " order by [{CURSOR}]/current_state" + (StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "") ;
				oGetSubordinateParams.oSort = {FIELD: 'current_state', DIRECTION: oCollectionParams.sort.DIRECTION};
				break;
			}
			case "phone":
			{
				sCondSort = " order by [{CURSOR}]/mobile_phone" + (StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "") ;
				oGetSubordinateParams.oSort = {FIELD: 'mobile_phone', DIRECTION: oCollectionParams.sort.DIRECTION};
				break;
			}
			default:
			{
				sCondSort = " order by [{CURSOR}]/" + oCollectionParams.sort.FIELD + (StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "") ;
				oGetSubordinateParams.oSort = {FIELD: oCollectionParams.sort.FIELD, DIRECTION: oCollectionParams.sort.DIRECTION};
				break;
			}
		}
	}
	
	try
	{
		if( sSearch == undefined || sSearch == null )
			throw "error";
		sSearch = String( sSearch );
	}
	catch( ex )
	{
		sSearch = "";
	}
	
	var arrFilters = oCollectionParams.filters;
	if(arrFilters != undefined && IsArray(arrFilters) && ArrayOptFirstElem(arrFilters) != undefined)
	{
		var arrTmpXQCond, arrTmpCodeCond, iFltPersReserve, sPersReserveIDs, arrTagsCond;
		var paramValueFrom, paramValueTo;
		var dStartBirthDay, dEndBirthDay;
		var sEffectivenessCond, sReqEffectiveness;
		for(oFilter in arrFilters)
		{
			if(oFilter.type == 'search')
			{
				if(oFilter.value != "") sSearch = oFilter.value;
			}
			else if(oFilter.type == 'select')
			{
				switch(oFilter.id)
				{
					case "f_sex":
					{
						xqConds.push( "MatchSome( $elem_qc/sex, ( " + ArrayMerge(oFilter.value, "XQueryLiteral(This.value)", ",") + " ) )" );
						XQSubordinateConds.push( "(" + ArrayMerge(oFilter.value, "'$elem/sex = ' + XQueryLiteral(This.value)", " or ") + ")" );
						arrTmpXQCond = [];
						for(itemFilterValue in oFilter.value)
						{
							arrTmpXQCond.push("This.sex.Value == " + XQueryLiteral(itemFilterValue.value));
						}
						codeConds.push( "( " + ArrayMerge(arrTmpXQCond, "This", " || ") + " )" );
						break;
					}
					case "f_status":
					{
						arrTmpXQCond = [];
						arrTmpCodeCond = [];
						for(itemFilterValue in oFilter.value)
						{
							if(itemFilterValue.value == "all")
							{
								bShowDismiss = true;
								arrTmpXQCond.push( "$elem_qc/is_dismiss != true()" );
								arrTmpCodeCond.push( "!This.is_dismiss" );
							}
							else if(itemFilterValue.value == "active")
							{
								bShowDismiss = true;
								arrTmpXQCond.push( "($elem_qc/is_dismiss != true() and $elem_qc/current_state = '')" );
								arrTmpCodeCond.push( "(!This.is_dismiss && This.current_state.Value == '')" );
							}
							else if(itemFilterValue.value == "is_dismiss")
							{
								bShowDismiss = true;
								arrTmpXQCond.push( "$elem_qc/is_dismiss = true()" );
								arrTmpCodeCond.push( "This.is_dismiss" );
							}
							else
							{
								arrTmpXQCond.push( "$elem_qc/current_state = " + XQueryLiteral(itemFilterValue.name) );
								arrTmpCodeCond.push( "This.current_state.Value == " + CodeLiteral(itemFilterValue.name) )
							}
						}
						xqConds.push( "( " + ArrayMerge(arrTmpXQCond, "This", " or ") + " )" )
						XQSubordinateConds.push( "( " + StrReplace(ArrayMerge(arrTmpXQCond, "This", " or "), "$elem_qc/", "$elem/") + " )" )
						codeConds.push( "( " + ArrayMerge(arrTmpCodeCond, "This", " || ") + " )" )
						break;
					}
					case "f_tags":
					{
						if(ArrayOptFirstElem(oFilter.value) != undefined)
							tagIntersectIDs = [];

						arrTagsCond = [];
						for(itemFilterValue in ArraySelect(oFilter.value, "OptInt(This.value)==undefined"))
						{
							switch(itemFilterValue.value)
							{
								case "adaptation":
								{
									arrTagsCond.push( "some $cond_a in career_reserves satisfies ($cond_a/person_id=$elem_qc/id and $cond_a/status='active' and $cond_a/position_type='adaptation')" );
									tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in career_reserves where $elem/status='active' and $elem/position_type='adaptation' return $elem"), "person_id"));
									break;
								}
								case "successor":
								{
									arrTagsCond.push( "some $cond_s in successors satisfies ($cond_s/person_id=$elem_qc/id and ($cond_s/status='active' or $cond_s/status='approved') )" );
									tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in successors where ($elem/status='active' or $elem/status='approved') return $elem"), "person_id"));
									break;
								}
								case "boss":
								{
									arrTagsCond.push( "some $cond_b in func_managers satisfies ($cond_b/person_id=$elem_qc/id )" );
									tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in func_managers return $elem"), "person_id"));
									break;
								}
								case "expert":
								{
									arrTagsCond.push( "some $cond_e in experts satisfies ($cond_e/person_id=$elem_qc/id )" );
									tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in experts return $elem"), "person_id"));
									break;
								}
								case "tutor":
								{
									arrTagsCond.push( "some $cond_t in tutors satisfies ($cond_t/person_id=$elem_qc/id )" );
									tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in tutors return $elem"), "person_id"));
									break;
								}
							}
						}


						sPersReserveIDs =  ArrayMerge(ArraySelect(oFilter.value, "OptInt(This.value)!=undefined"), "Int(This.value)", ",");
						arrTagsCond.push( "some $cond_pr in personnel_reserves satisfies ($cond_pr/person_id=$elem_qc/id and $cond_pr/status='in_reserve' and MatchSome($cond_pr/career_reserve_type_id, (" + sPersReserveIDs + ")) )" );
						tagIntersectIDs = ArrayUnion(tagIntersectIDs, ArrayExtract(tools.xquery("for $elem in personnel_reserves where $elem/status='in_reserve' and MatchSome($elem/career_reserve_type_id, (" + sPersReserveIDs + ")) return $elem"), "person_id"));

						xqConds.push("(" + ArrayMerge(arrTagsCond, "This", " or ") + ")")

						break;
					}
				}
			}
			else
			{
				switch(oFilter.type)
				{
					case "date":
					{
						paramValueFrom = oFilter.HasProperty("value_from") ? DateNewTime(ParseDate(oFilter.value_from)) : null;
						paramValueTo = oFilter.HasProperty("value_to") ? DateNewTime(ParseDate(oFilter.value_to), 23, 59, 59) : null;
						break;
					}
					case "int":
					{
						paramValueFrom = oFilter.HasProperty("value_from") ? OptInt(oFilter.value_from) : null;
						paramValueTo = oFilter.HasProperty("value_to") ? OptInt(oFilter.value_to) : null;

						if(paramValueFrom != null && paramValueTo != null && paramValueFrom > paramValueTo)
						{
							paramValueFrom = paramValueTo;
							paramValueTo = Int(oFilter.value_from);
						}
						break;
					}
				}

				switch(oFilter.id)
				{
					case "hire_date":
					{
						if(paramValueFrom != null && paramValueTo != null)
						{
							xqConds.push( "($elem_qc/hire_date >= " + XQueryLiteral(paramValueFrom) + " and $elem_qc/hire_date <= " + XQueryLiteral(paramValueTo) + ")");
							XQSubordinateConds.push( "($elem/hire_date >= " + XQueryLiteral(paramValueFrom) + " and $elem/hire_date <= " + XQueryLiteral(paramValueTo) + ")");
							codeConds.push( "(This.hire_date >= " + CodeLiteral(paramValueFrom) + " && This.hire_date <= " + CodeLiteral(paramValueTo) + ")");
						}
						else if(paramValueFrom != null)
						{
							xqConds.push( "$elem_qc/hire_date >= " + XQueryLiteral(paramValueFrom));
							XQSubordinateConds.push( "$elem/hire_date >= " + XQueryLiteral(paramValueFrom));
							codeConds.push( "This.hire_date >= " + CodeLiteral(paramValueFrom));
						}
						else if(paramValueTo != null)
						{
							xqConds.push( "$elem_qc/hire_date <= " + XQueryLiteral(paramValueTo));
							XQSubordinateConds.push( "$elem/hire_date <= " + XQueryLiteral(paramValueTo));
							codeConds.push( "This.hire_date <= " + CodeLiteral(paramValueTo));
						}
						break;
					}
					case "age":
					{

						dStartBirthDay = paramValueTo != null ? Date(Year(CurDate) - (paramValueTo + 1), Month(CurDate), Day(CurDate)) : null;
						dEndBirthDay = paramValueFrom != null ? Date(Year(CurDate) - paramValueFrom, Month(CurDate), Day(CurDate)) : null;

						if(dStartBirthDay != null && dEndBirthDay != null)
						{
							xqConds.push( "($elem_qc/birth_date >= " + XQueryLiteral(dStartBirthDay) + " and $elem_qc/birth_date <= " + XQueryLiteral(dEndBirthDay) + ")");
							XQSubordinateConds.push( "($elem/birth_date >= " + XQueryLiteral(dStartBirthDay) + " and $elem/birth_date <= " + XQueryLiteral(dEndBirthDay) + ")");
							codeConds.push( "(This.birth_date >= " + CodeLiteral(dStartBirthDay) + " && This.birth_date <= " + CodeLiteral(dEndBirthDay) + ")");
						}
						else if(dStartBirthDay != null)
						{
							xqConds.push( "$elem_qc/birth_date >= " + XQueryLiteral(dStartBirthDay));
							XQSubordinateConds.push( "$elem/birth_date >= " + XQueryLiteral(dStartBirthDay));
							codeConds.push( "This.birth_date >= " + CodeLiteral(dStartBirthDay));
						}
						else if(dEndBirthDay != null)
						{
							xqConds.push( "$elem_qc/birth_date <= " + XQueryLiteral(dEndBirthDay));
							XQSubordinateConds.push( "$elem/birth_date <= " + XQueryLiteral(dEndBirthDay));
							codeConds.push( "This.birth_date <= " + CodeLiteral(dEndBirthDay));
						}
						break;
					}
					case "effectiveness":
					{
						sEffectivenessCond = "";
						if(paramValueFrom != null && paramValueTo != null)
						{
							sEffectivenessCond = "($elem/overall >= " + XQueryLiteral(paramValueFrom) + " and $elem/overall <= " + XQueryLiteral(paramValueTo) + ")";
						}
						else if(paramValueFrom != null)
						{
							sEffectivenessCond = "$elem/overall >= " + XQueryLiteral(paramValueFrom);
						}
						else if(paramValueTo != null)
						{
							sEffectivenessCond = "$elem/overall <= " + XQueryLiteral(paramValueTo);
						}

						if(sEffectivenessCond != "")
						{
							sReqEffectiveness = "for $elem in pas where $elem/assessment_appraise_type='activity_appraisal' and $elem/is_done = true() and " + sEffectivenessCond + " and some $appr in assessment_appraises satisfies ($elem/assessment_appraise_id = $appr/id and $appr/status = 1) return $elem";
							effectivenessIntersect = tools.xquery(sReqEffectiveness);
						}
						break;
					}
					case "fullname":
					{
						if( oFilter.GetOptProperty( "value", "" ) != "" )
						{
							xqConds.push( "contains($elem_qc/fullname, " + XQueryLiteral(oFilter.value) + " )" );
							XQSubordinateConds.push( "contains($elem/fullname, " + XQueryLiteral(oFilter.value) + " )" );
						}
						break;
					}
					case "matrix":
					{
						xqConds.push( "$elem_qc/efficiency_estimation_id > 0" );
						xqConds.push( "$elem_qc/development_potential_id > 0" );
						XQSubordinateConds.push( "$elem/efficiency_estimation_id > 0" );
						XQSubordinateConds.push( "$elem/development_potential_id > 0" );
					}
				}
			}
		}
	}

	oGetSubordinateParams.xQueryCond = ArrayMerge(XQSubordinateConds, "This", " and ");
	var arrSubdivisionIDs = [];
	switch( sTypeCollaborator )
	{
		case "colleagues_boss":
			// var arrBossesIds = tools.get_uni_user_bosses( iUserID, { 'return_object_type': 'collaborator', 'return_object_value': 'id' } );
			var arrBossesIds = get_user_bosses( iUserID, null, true, [ tools.get_default_object_id( 'boss_type', 'main' ) ], { 'return_object_type': 'collaborator', 'return_object_value': 'id' }, false ).array;
			arrIds = [];
			for(itemBossId in arrBossesIds)
			{
				arrIds = ArrayUnion(arrIds, tools.get_direct_sub_person_ids( itemBossId ));
			}
			arrIds = ArrayDirect(XQuery("for $elem_qc in collaborators where MatchSome( $elem_qc/id, (" + ArrayMerge(arrIds,'This',',') + ")) and $elem_qc/id != " + iUserID + " return $elem_qc"));
			break;
		case "colleagues":
			var catUser = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id = " + iUserID + " return $elem/Fields( 'org_id', 'position_parent_id' )" ) );
			if( catUser == undefined )
				throw i18n.t( 'peredannekorre_3' );

			arrSubdivisionIDs = ArrayExtract(tools.xquery( "for $elem in positions where $elem/basic_collaborator_id=" + iUserID + " and $elem/parent_object_id != null() and $elem/is_position_finished != true() and ($elem/position_date = null() or $elem/position_date <= " + XQueryLiteral(Date()) + ") and ($elem/position_finish_date = null() or $elem/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $elem/Fields('parent_object_id')" ), "This.parent_object_id");
			if(ArrayOptFirstElem(arrSubdivisionIDs) == undefined)
			{
				arrSubdivisionIDs.push(catUser.position_parent_id.Value);
			}

			var arrColleaguePositions = tools.xquery("for $elem in positions where MatchSome($elem/parent_object_id, (" + ArrayMerge( arrSubdivisionIDs, "This", "," ) + ")) and $elem/is_position_finished != true() and ($elem/position_date = null() or $elem/position_date <= " + XQueryLiteral(Date()) + ") and ($elem/position_finish_date = null() or $elem/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $elem/Fields('id')")
			
			xqConds.push( "MatchSome( $elem_qc/position_id, ( " + ArrayMerge( arrColleaguePositions, "This.id", "," ) + " ) )");

			break;
		case "colleagues_hier":
			var catUser = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id = " + iUserID + " return $elem/Fields( 'position_parent_id' )" ) );
			if( catUser == undefined )
				throw i18n.t( 'peredannekorre_3' );

			arrSubdivisionIDs = ArrayExtract(XQuery( "for $elem in positions where $elem/basic_collaborator_id=" + iUserID + " and $elem/parent_object_id != null() and $elem/is_position_finished != true() and ($elem/position_date = null() or $elem/position_date <= " + XQueryLiteral(Date()) + ") and ($elem/position_finish_date = null() or $elem/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $elem/Fields('parent_object_id')" ), "This.parent_object_id");
			if(ArrayOptFirstElem(arrSubdivisionIDs) == undefined)
			{
				arrSubdivisionIDs.push(catUser.position_parent_id.Value);
			}

			var arrAllHierSubs = [];
			var arrCurHierSubs;
			arrSubdivisionIDs = ArraySelect( arrSubdivisionIDs, "OptInt( This ) != undefined" );
			for ( id in arrSubdivisionIDs )
			{
				arrCurHierSubs = ArrayExtractKeys( tools.xquery( 'for $elem in subs where IsHierChild( $elem/id, ' + id + ' ) and $elem/type = \'subdivision\' order by $elem/Hier() return $elem/id' ), 'id' );
				arrAllHierSubs = ArrayUnion( arrAllHierSubs, arrCurHierSubs );
			}

			var arrColleaguePositions = tools.xquery("for $elem in positions where MatchSome($elem/parent_object_id, (" + ArrayMerge( ArrayUnion( arrSubdivisionIDs, arrAllHierSubs), "This", "," ) + ")) and $elem/is_position_finished != true() and ($elem/position_date = null() or $elem/position_date <= " + XQueryLiteral(Date()) + ") and ($elem/position_finish_date = null() or $elem/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $elem/Fields('id')")
			
			xqConds.push( "MatchSome( $elem_qc/position_id, ( " + ArrayMerge( arrColleaguePositions, "This.id", "," ) + " ) )");

			break;
		case "colleagues_org":
			var catUser = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id = " + iUserID + " return $elem/Fields( 'org_id' )" ) );
			if( catUser == undefined )
				throw i18n.t( 'peredannekorre_3' );

			if( catUser.org_id.HasValue )
			{
				xqConds.push( "$elem_qc/org_id = " + catUser.org_id );
			}
			break;
		case "bosses":
			var oResult = get_user_bosses( iUserID, null, true, [ tools.get_default_object_id( 'boss_type', 'main' ) ], { 'return_object_type': 'collaborator', 'return_object_value': 'id' }, bAllHier );
			arrIds = oResult.array;
			arrIds = ArrayDirect(arrIds);
			break;
		case "main_subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['fact'];
			oGetSubordinateParams.bGetGroupSubordinate = false;
			oGetSubordinateParams.bGetPersonSubordinate = false;
			oGetSubordinateParams.bInHierSubdivision = false;
			
			arrIds = GetSubordinateRecords(iUserID, oGetSubordinateParams);
			arrIds = ArrayDirect(arrIds);
			break;
		case "subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['fact'];
			oGetSubordinateParams.bGetGroupSubordinate = true;
			oGetSubordinateParams.bGetPersonSubordinate = true;
			oGetSubordinateParams.bInHierSubdivision = true;
			
			arrIds = GetSubordinateRecords(iUserID, oGetSubordinateParams);
			arrIds = ArrayDirect(arrIds);
			break;
		case "func_subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['func'];
			oGetSubordinateParams.bGetGroupSubordinate = true;
			oGetSubordinateParams.bGetPersonSubordinate = true;
			oGetSubordinateParams.bInHierSubdivision = true;
			oGetSubordinateParams.arrBossTypeIDs = arrBossTypesID;
			
			arrIds = GetSubordinateRecords(iUserID, oGetSubordinateParams);
			arrIds = ArrayDirect(arrIds);
			break;
		case "all_subordinates":
			oGetSubordinateParams.bGetGroupSubordinate = true
			oGetSubordinateParams.bGetPersonSubordinate = true
			oGetSubordinateParams.bInHierSubdivision = true
			oGetSubordinateParams.arrBossTypeIDs = arrBossTypesID
			
			arrIds = GetSubordinateRecords(iUserID, oGetSubordinateParams);
			arrIds = ArrayDirect(arrIds);
			break;
	}
	var bArrIDsIsNull = (arrIds == null)
	if( ArrayOptFirstElem( xqConds ) == undefined && bArrIDsIsNull)
	{
		return [];
	}


	if(bArrIDsIsNull)
	{
		if( sSearch != "" )
		{
			xqConds.push( "doc-contains( $elem_qc/id, '" + DefaultDb + "', " + XQueryLiteral( sSearch ) + " )" );
		}
		if( bExcludeCurrentUser )
		{
			xqConds.push( "$elem_qc/id != " + iUserID );
		}
		if( !bShowDismiss )
		{
			xqConds.push( "$elem_qc/is_dismiss != true()" );
		}

		var sCollaboratorReq = "for $elem_qc in collaborators where " + ArrayMerge( xqConds, "This", " and " ) + StrReplace(sCondSort, "[{CURSOR}]", "$elem_qc") + " return $elem_qc/Fields('id','fullname','position_name','email','mobile_phone','phone','org_name','position_parent_name','hire_date','sex','birth_date','is_dismiss','current_state','development_potential_id','efficiency_estimation_id')";
		return tools.xquery(sCollaboratorReq);
	}
	else
	{
		if(DataType(ArrayOptFirstElem(arrIds)) == "integer")
		{
			var sReqIds = "for $elem_qc in collaborators where MatchSome($elem_qc/id, (" + ArrayMerge(arrIds, 'Int(This, 0)', ',') + "))" + StrReplace(sCondSort, "[{CURSOR}]", "$elem_qc") + " return $elem_qc/Fields('id','fullname','position_name','email','mobile_phone','phone','org_name','position_parent_name','hire_date','sex','birth_date','is_dismiss','current_state','development_potential_id','efficiency_estimation_id')";
			var xqIds = tools.xquery(sReqIds);	
			
			if( !bShowDismiss )
			{
				codeConds.push( "!This.is_dismiss" )
			}
			if( bExcludeCurrentUser )
			{
				codeConds.push( "This.id != " + iUserID );
			}

			var arrPrecedCollaborators = ArraySelect(xqIds, ArrayMerge(codeConds, "This" , " && "))
		}
		else
		{
			var arrPrecedCollaborators = arrIds;
		}

		var searchIntersect = null
		if( sSearch != "" )
		{
			searchIntersect = tools.xquery("for $elem_qc in collaborators where doc-contains( $elem_qc/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" + StrReplace(sCondSort, "[{CURSOR}]", "$elem_qc") + " return $elem_qc");
		}

		if(tagIntersectIDs != null)
		{
			arrPrecedCollaborators = ArrayIntersect(arrPrecedCollaborators, tagIntersectIDs, "This.id.Value", "OptInt(This, 0)");
		}

		if(searchIntersect != null)
		{
			arrPrecedCollaborators = ArrayIntersect(arrPrecedCollaborators, searchIntersect, "This.id.Value", "This.id.Value");
		}

		if(effectivenessIntersect != null)
		{
			arrPrecedCollaborators = ArrayIntersect(arrPrecedCollaborators, effectivenessIntersect, "This.id.Value", "This.person_id.Value");
		}

		arrIds = undefined;

		return arrPrecedCollaborators;
	}
}

/**
 * @author BG
 * @deprecated с v.2023.2. Следует использовать IsBossCurUser().
*/
function is_boss_to_user(iCheckUserID, iCurUserID)
{

	var libParam = tools.get_params_code_library('libMain');
	var sTypeSubordinate = libParam.GetOptProperty("DefaultSubordinateType", "all_subordinates"); //by default: Непосредственные и функциональные подчиненные с иерархией

	var arrBossTypesID = [];
	switch(sTypeSubordinate)
	{
		case "func_subordinates":
		case "all_subordinates":
		{
			arrBossTypesID = getDefaultBossTypeIDs(libParam);
			break;
		}
	}

	var arrSubordinates = get_user_collaborators( iCheckUserID, sTypeSubordinate, false, "", null, arrBossTypesID );

	return (ArrayOptFind(arrSubordinates, "OptInt(This.id.Value, 99999) == OptInt(iCurUserID, 0)") != undefined);
}

function getDefaultBossTypeIDs(libParam)
{
	if(libParam == undefined || libParam == null || libParam == "")
		libParam = tools.get_params_code_library('libMain');

	var iBossTypeIDs = libParam.GetOptProperty("iBossTypeIDs", "[]");
	var arrBossTypesID = tools_web.parse_multiple_parameter(iBossTypeIDs);
	if( ArrayOptFirstElem(arrBossTypesID) == undefined)
	{
		var sBossTypeCodes = Trim("" + libParam.GetOptProperty("sBossTypeCodes", ""));
		if(sBossTypeCodes != "")
		{
			var arrBossTypeCodes = tools_web.parse_multiple_parameter(sBossTypeCodes);
			arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where MatchSome($elem/code, (" + ArrayMerge(arrBossTypeCodes, "XQueryLiteral(This)", ",") + ")) return $elem/Fields('id')"), "This.id.Value");
		}
	}

	return arrBossTypesID;
}



/**
 * @typedef {Object} oMainPersonRecommendedLearningObject
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} image_url
 * @property {string} state
 * @property {string} link
*/
/**
 * @typedef {Object} WTMainPersonRecommendedLearningResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oMainPersonRecommendedLearningObject[]} array – массив
*/
/**
 * @function GetPersonRecommendedLearning
 * @memberof Websoft.WT.Main
 * @description получения списка рекомендованного обучения
 * @param {bigint} iPersonID - ID сотрудника
 * @param {string[]} [aTypes] - Массив типов обучения
 * @param {number} [iMaxCnt] - Максимальное количество записей
 * @returns {WTMainPersonRecommendedLearningResult}
*/
function GetPersonRecommendedLearning( iPersonID, aTypes, iMaxCnt )
{

	return get_user_recommended_learning( iPersonID, null, aTypes, iMaxCnt, "lib" );
}


function get_user_recommended_learning( iUserID, teUser, aTypes, iMaxCnt, sTypeFunction, aSelectTypes )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];
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
			oRes.errorText = i18n.t( 'peredannekorre_3' );
			return oRes;
		}
	}
	try
	{
		if( !IsArray( aSelectTypes ) )
			throw 'err';
	}
	catch( ex )
	{
		aSelectTypes = [ "position_common", "group" ];
	}
	try
	{
		if( !IsArray( aTypes ) )
			throw 'err';
	}
	catch( ex )
	{
		aTypes = [ "education_method" ];
	}
	try
	{
		if( sTypeFunction == undefined || sTypeFunction == null || sTypeFunction == "" )
			throw "err";
	}
	catch( ex )
	{
		sTypeFunction = "bs";
	}
	try
	{
		iMaxCnt = OptInt( iMaxCnt );
	}
	catch( ex )
	{
		iMaxCnt = undefined;
	}

	arrItems = new Array();
	function AddItem( iItemId, sMethodType, sMethodName, sItemType )
	{
		switch( sTypeFunction )
		{
			case "bs":
				AddItemBs( iItemId, sMethodType, sMethodName, sItemType )
				break;
			case "lib":
				AddItemLib( iItemId, sMethodType, sMethodName, sItemType )
				break;
			case "recommender":
				AddItemRecommender( iItemId, sMethodType, sMethodName, sItemType )
				break;
			case "js":
				AddItemJs( iItemId, sMethodType, sMethodName, sItemType )
				break;
		}
		if( iMaxCnt != undefined )
		{
			bBreak = iMaxCnt <= ArrayCount( arrItems )
		}
	}
	function AddItemJs( iItemId, sMethodType, sMethodName, sItemType )
	{
		obj = new Object();
		obj.id = OptInt( iItemId );
		obj.object_id = obj.id;
		obj.object_type = RValue( sItemType );
		switch( sItemType )
		{
			case "education_method":
				feObject = iItemId.OptForeignElem;
				if( feObject != undefined && feObject.type == "course" && feObject.course_id.HasValue )
				{
					obj.id = feObject.course_id.Value;
					obj.object_type = "course";
					obj.object_id = obj.id;
				}
				break;
		}
		arrItems.push( obj );
	}
	function AddItemRecommender( iItemId, sMethodType, sMethodName, sItemType )
	{
		obj = new Object();
		obj.object_id = OptInt( iItemId );
		obj.id = obj.object_id;
		teObject = OpenDoc( UrlFromDocID( iItemId ) ).TopElem;
		obj.object_name = RValue( tools.get_disp_name_value( teObject ) );
		obj.object_type = RValue( teObject.Name );
		obj.comment = teObject.ChildExists( "comment" ) ? teObject.comment.Value : "";
		arrItems.push( obj );
	}
	function AddItemLib( iItemId, sMethodType, sMethodName, sItemType )
	{
		obj = new Object();
		obj.id = OptInt( iItemId );
		teObject = OpenDoc( UrlFromDocID( iItemId ) ).TopElem;
		obj.name = RValue( tools.get_disp_name_value( teObject ) );
		obj.type = common.exchange_object_types.GetOptChildByKey( sItemType ).title.Value;
		obj.state = "";
		obj.image_url = get_object_image_url( teObject );
		obj.link = get_object_link( sItemType, obj.id );
		switch( sItemType )
		{
			case "education_method":

				if(teObject.type == 'org')
				{
					xarrEventCollaborators = XQuery('for $elem in event_collaborators where $elem/education_method_id=' + iItemId + ' and $elem/collaborator_id=' + iUserID + ' order by $elem/start_date return $elem');
					for( catEventCollaborator in xarrEventCollaborators )
					{
						catEventResult = ArrayOptFirstElem(XQuery('for $elem in event_results where $elem/event_id=' + catEventCollaborator.event_id + ' and $elem/person_id=' + iUserID + ' return $elem'));
						if(catEventResult != undefined)
						{
							obj.state = catEventCollaborator.status_id.ForeignElem.name.Value;
							break;
						}
					}
				}
				else
				{
					if(teObject.course_id.HasValue && teObject.course_id.OptForeignElem != undefined)
					{
						obj.id = teObject.course_id.Value;
						obj.image_url = get_object_image_url( teObject.course_id.OptForeignElem );
						obj.link = get_object_link( "course", teObject.course_id );
						xarrLearnings = XQuery( 'for $elem in learnings where $elem/course_id = ' + teObject.course_id + ' and $elem/person_id = ' + iUserID + ' return $elem/Fields(\'state_id\', \'score\')' );
						if ( ArrayOptFirstElem( xarrLearnings ) != undefined )
						{
							catLearning = ArrayMax( xarrLearnings, 'score' );
							obj.state = catLearning.state_id.ForeignElem.name.Value;
						}
						else
						{
							catActiveLearning = ArrayOptFirstElem(XQuery('for $elem in active_learnings where $elem/course_id=' + teObject.course_id + ' and $elem/person_id=' + iUserID + ' return $elem/Fields(\'state_id\')'));
							if(catActiveLearning != undefined)
							{
								obj.state = catActiveLearning.state_id.ForeignElem.name.Value;
							}
						}
					}
					else
					{
						return;
					}
				}
				break;

			case "assessment":
				xarrLearnings = XQuery( 'for $elem in test_learnings where $elem/assessment_id = ' + iItemId + ' and $elem/person_id = ' + iUserID + ' return $elem/Fields(\'state_id\', \'score\')' );
				if ( ArrayOptFirstElem( xarrLearnings ) != undefined )
				{
					catLearning = ArrayMax( xarrLearnings, 'score' );
					obj.state = catLearning.state_id.ForeignElem.name.Value;
				}
				else
				{
					catActiveLearning = ArrayOptFirstElem(XQuery('for $elem in active_test_learnings where $elem/assessment_id=' + iItemId + ' and $elem/person_id=' + iUserID + ' return $elem/Fields(\'state_id\')'));
					if(catActiveLearning != undefined)
					{
						obj.state = catActiveLearning.state_id.ForeignElem.name.Value;
					}
				}
				break;
			case "qualification":
				catQualAssigns = ArrayOptFirstElem( XQuery( 'for $elem in qualification_assignments where $elem/qualification_id = ' + iItemId + ' and $elem/person_id = ' + iUserID + ' order by $elem/assignment_date return $elem' ) );
				if ( catQualAssigns != undefined )
				{
					catLearning = ArrayMax( xarrLearnings, 'score' );
					obj.state = catQualAssigns.status.ForeignElem.name.Value;
				}
				break;
		}

		arrItems.push( obj );
	}
	function AddItemBs( iItemId, sMethodType, sMethodName, sItemType )
	{
		oItem = ArrayOptFind(arrItems, 'id == ' + iItemId)
		teObject = OpenDoc( UrlFromDocID( iItemId ) ).TopElem;
		if(oItem == undefined)
		{
			sLearned = '-';
			sFinishDate = '';
			sDataColor = '';
			oItem = new Object();
			oItem.id = iItemId;
			oItem.objectId = null;
			oItem.courseYourselfStart = false;
			oItem.eventName = null;
			oItem.learningId = null;
			oItem.name = RValue( tools.get_disp_name_value( teObject ) );
			oItem.methodsTypes = new Array();
			oItem.type = "";
			oMethodType = new Object();
			oMethodType.name = sMethodName;
			oMethodType.type = sMethodType;
			oItem.methodsTypes[0] = oMethodType;
			oItem.methodType = sMethodType;
			oItem.date = '';
			oItem.status = 'none';
			oItem.mark = '-';
			oItem.nextDate = '';
			oItem.nextPlace = '';
			oItem.userId = iUserID;
			oItem.userName = teUser.fullname;
			if( sItemType == "education_method" )
			{
				oItem.type = teObject.type;
				if(teObject.type == 'org')
				{
					xarrEventCollaborators = XQuery('for $elem in event_collaborators where $elem/education_method_id = ' + iItemId + ' and $elem/collaborator_id = ' + iUserID + ' and $elem/status_id = \'close\' return $elem');
					for( catEventCollaborator in xarrEventCollaborators )
					{
						catEventResult = ArrayOptFirstElem(XQuery('for $elem in event_results where $elem/event_id = ' + catEventCollaborator.event_id + ' and $elem/person_id = ' + iUserID + ' and $elem/is_assist = true() return $elem'));
						if(catEventResult != undefined)
						{
							oItem.status = 'learned';
							if(catEventResult.score.HasValue)
								oItem.mark = catEventResult.score;
							oItem.date = StrDate(catEventCollaborator.finish_date, false, false);
							break;
						}
					}
					catEventNext = ArrayOptFirstElem(XQuery('for $elem in events where $elem/education_method_id = ' + iItemId + ' and $elem/start_date > date(\'' + Date() + '\') and $elem/status_id = \'plan\'  order by $elem/start_date ascending return $elem'));
					if(catEventNext != undefined)
					{
						oItem.nextDate = StrDate(catEventNext.start_date, false, false);
						if(catEventNext.place_id.HasValue && catEventNext.place_id.OptForeignElem != undefined)
							oItem.nextPlace = catEventNext.place_id.ForeignElem.name;
						if(catEventNext.is_public)
						{
							oItem.objectId = catEventNext.PrimaryKey;
							oItem.eventName = catEventNext.name;
						}
					}
				}
				else
				{
					if(teObject.course_id.HasValue && teObject.course_id.OptForeignElem != undefined)
					{
						oItem.objectId = teObject.course_id;
						oItem.courseYourselfStart = teObject.course_id.ForeignElem.yourself_start;
						xarrLearnings = XQuery( 'for $elem in learnings where $elem/course_id = ' + teObject.course_id + ' and $elem/person_id = ' + iUserID + ' return $elem/Fields(\'score\',\'last_usage_date\',\'course_id\')' );
						if ( ArrayOptFirstElem( xarrLearnings ) != undefined )
						{
							catLearning = ArrayMax( xarrLearnings, 'score' );
							oItem.status = 'learned';
							oItem.date = StrDate(catLearning.last_usage_date, false, false);
							if(catLearning.course_id.HasValue && catLearning.course_id.OptForeignElem != undefined)
							{
								if(catLearning.course_id.ForeignElem.max_score != 0)
								{
									oItem.mark = ((catLearning.score * 100) / catLearning.course_id.ForeignElem.max_score) + '%';
								}
								else
								{
									oItem.mark = '100%';
								}
							}
						}
						else
						{
							catActiveLearning = ArrayOptFirstElem(XQuery('for $elem in active_learnings where $elem/course_id=' + teObject.course_id + ' and $elem/person_id=' + iUserID + ' return $elem'));
							if(catActiveLearning != undefined)
							{
								oItem.status = 'process';
								oItem.date = StrDate(catActiveLearning.last_usage_date, false, false);
								if(catActiveLearning.course_id.HasValue && catActiveLearning.course_id.OptForeignElem != undefined)
								{
									if(catActiveLearning.course_id.ForeignElem.max_score != 0)
									{
										oItem.mark = ((catActiveLearning.score * 100) / catActiveLearning.course_id.ForeignElem.max_score) + '%';
									}
									else
									{
										oItem.mark = '100%';
									}
								}
								oItem.learningId = catActiveLearning.PrimaryKey;
							}
						}
					}
					else
					{
						return;
					}
				}
			}
			else if( sItemType == "assessment" )
			{
				oItem.objectId = iItemId;
				oItem.courseYourselfStart = teObject.is_open;
				xarrLearnings = XQuery( 'for $elem in test_learnings where $elem/assessment_id = ' + iItemId + ' and $elem/person_id = ' + iUserID + ' return $elem/Fields(\'score\',\'last_usage_date\',\'assessment_id\')' );
				if ( ArrayOptFirstElem( xarrLearnings ) != undefined )
				{
					catLearning = ArrayMax( xarrLearnings, 'score' );
					oItem.status = 'learned';
					oItem.date = StrDate(catLearning.last_usage_date, false, false);
					if(catLearning.max_score != 0)
					{
						oItem.mark = ((catLearning.score * 100) / catLearning.max_score) + '%';
					}
					else
					{
						oItem.mark = '100%';
					}
				}
				else
				{
					catActiveLearning = ArrayOptFirstElem(XQuery('for $elem in active_test_learnings where $elem/assessment_id=' + iItemId + ' and $elem/person_id=' + iUserID + ' return $elem'));
					if(catActiveLearning != undefined)
					{
						oItem.status = 'process';
						oItem.date = StrDate(catActiveLearning.last_usage_date, false, false);
						if(catActiveLearning.max_score != 0)
						{
							oItem.mark = ((catActiveLearning.score * 100) / catActiveLearning.max_score) + '%';
						}
						else
						{
							oItem.mark = '100%';
						}
					}
					oItem.learningId = catActiveLearning.PrimaryKey;
				}
			}
			else if( sItemType == "qualification" )
			{
				oItem.objectId = iItemId;
				oItem.courseYourselfStart = teObject.join_mode == "open";
				xarrQualAssigns = XQuery( 'for $elem in qualification_assignments where $elem/qualification_id = ' + iItemId + ' and $elem/person_id = ' + iUserID + ' return $elem' );

				catQualAssign = ArrayOptFind( xarrQualAssigns, "This.status == 'assigned'" );
				if( catQualAssign != undefined )
				{

					oItem.status = 'learned';
					oItem.date = StrDate(catQualAssign.assignment_date, false, false);
					oItem.mark = '100%';

					oItem.learningId = catQualAssign.id;
				}
				else
				{
					catQualAssign = ArrayOptFirstElem( xarrQualAssigns );
					if( catQualAssign != undefined )
					{

						oItem.status = 'process';
						rScaled = teObject.get_scaled_progress( iUserID );
						if ( rScaled >= 0.0 )
						{
							oItem.mark = rScaled >= 100 ? '100%' : rScaled + "%";
							oItem.learningId = catQualAssign.id;
						}
					}
				}

			}

			arrItems[ArrayCount(arrItems)] = oItem;
		}
		else
		{
			oMethodType = new Object();
			oMethodType.name = sMethodName;
			oMethodType.type = sMethodType;
			oItem.methodsTypes[ArrayCount(oItem.methodsTypes)] = oMethodType;
			oItem.methodsTypes = ArraySort( oItem.methodsTypes, 'This.type', '+' );
		}
	}
	function AddTypes( iObjectID, teAddObject )
	{

		xarrObjectRequirements = XQuery( "for $elem in object_requirements where $elem/object_id = " + iObjectID + " and $elem/requirement_object_id != null() and MatchSome( $elem/requirement_object_type, ( " + ArrayMerge( aTypes, "XQueryLiteral( This )", "," ) + " ) ) return $elem" );
		for( _requirement in xarrObjectRequirements )
		{

			if( _requirement.requirement_object_id.OptForeignElem == undefined )
			{
				continue;
			}
			AddItem( _requirement.requirement_object_id, _requirement.object_type, _requirement.object_name, _requirement.requirement_object_type );
			if( bBreak )
				break;
		}

	}
	var bBreak = false;

	fePosition = undefined;
	if( teUser.position_id.HasValue )
		fePosition = teUser.position_id.OptForeignElem;

	for( _select_type in aSelectTypes )
	{
		if( bBreak )
		{
			break;
		}
		switch( _select_type )
		{
			case "position_common":
				// Рекомендованное обучение из типовой должности
				if( fePosition != undefined && fePosition.position_common_id.HasValue && fePosition.position_common_id.OptForeignElem != undefined)
				{
					AddTypes( fePosition.position_common_id );
				}
				break;
			case "group":
				// Рекомендованное обучение из карточки группы
				xarrGroupCollaborators = XQuery('for $elem in group_collaborators where $elem/collaborator_id = ' + iUserID  + ' return $elem');
				for(catGroupCollaborator in xarrGroupCollaborators)
				{
					AddTypes( catGroupCollaborator.group_id );
					if( bBreak )
					{
						break;
					}
				}
				break;
			case "subdivision_group":
				if( teUser.position_parent_id.HasValue )
				{
					xarrGroupSubdivisions = XQuery('for $elem in subdivision_group_subdivisions where $elem/subdivision_id = ' + teUser.position_parent_id  + ' return $elem');
					for(catGroupSubdivision in xarrGroupSubdivisions)
					{
						if( bBreak )
							break;
						AddTypes( catGroupSubdivision.subdivision_group_id );
					}
				}
				break;
			case "position_family":
				if( fePosition != undefined )
				{
					docPosition = tools.open_doc( fePosition.id );
					if( docPosition != undefined && docPosition.TopElem.position_family_id.HasValue )
					{
						AddTypes( docPosition.TopElem.position_family_id );
					}
				}
				break;
		}
	}
	oRes.array = ArraySelectDistinct(arrItems, 'id');
	return oRes;
}

/**
 * @author PL
*/
function lp_create_request( iRequestTypeID, sCommand, iPersonID, tePerson, SCOPE_WVARS, iObjectID )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.action_result = ({});
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
		catch( err ){alert(err)}
	}
	try
	{
		iRequestTypeID = Int( iRequestTypeID )
	}
	catch( ex )
	{
		oRes.action_result = { command: "alert", msg: i18n.t( 'nekorrektnyyid' ) };
		return oRes;
	}
	try
	{
		if( ObjectType( SCOPE_WVARS ) != "JsObject" )
			throw "";
	}
	catch( ex )
	{
		 SCOPE_WVARS = ({});
	}
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		iObjectID = "";
	}
	var docObject = undefined;
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		iPersonID = null;
	}
	try
	{
		if( iPersonID != null )
			tePerson.Name;
	}
	catch( ex )
	{
		if( iPersonID != null )
			try
			{
				tePerson = OpenDoc( UrlFromDocID( iPersonID ) ).TopElem;
			}
			catch( ex )
			{
				oRes.action_result = { command: "alert", msg: i18n.t( 'nekorrektnyyid_1' ) };
				return oRes;
			}
		else
			tePerson = null;
	}
	var curLngWeb = tools_web.get_default_lng_web( tePerson );
	request_type_id = Int( iRequestTypeID );
	requestTypeDoc = OpenDoc( UrlFromDocID( request_type_id ) ).TopElem;

	var bCheckRequestExists = tools_web.is_true(SCOPE_WVARS.GetOptProperty( "bCheckRequestExists", false ));
	if(bCheckRequestExists && ArrayOptFirstElem( XQuery( "for $request in requests where $request/person_id = " + iPersonID + "  and $request/request_type_id = " + iRequestTypeID + " and $request/status_id = 'active' and $request/is_group != true() return $request" ) ) != undefined )
	{
		oRes.action_result = { command: "alert", msg: i18n.t( 'uvasuzheestzay_1' ) };
		return oRes;
	}
	else if ( requestTypeDoc.object_type.HasValue && iPersonID != null && iObjectID != "" )
	{
		if ( ! global_settings.settings.recruitment.default_request_type_id.HasValue || iRequestTypeID != global_settings.settings.recruitment.default_request_type_id )
		{
			sObjectID = iObjectID;
			if ( ArrayOptFirstElem( XQuery( "for $request in requests where $request/person_id = " + iPersonID + " and $request/object_id = " + sObjectID + " and $request/request_type_id = " + iRequestTypeID + " and $request/status_id = 'active' and $request/is_group != true() return $request" ) ) != undefined )
			{
				oRes.action_result = { command: "alert", msg: i18n.t( 'uvasuzheestzayav' ) };
				return oRes;
			}
		}
	}
	
	if( requestTypeDoc.boss_only )
	{
		if( iPersonID == null || ArrayOptFirstElem( XQuery( "for $elem in func_managers where $elem/person_id = " + iPersonID + " return $elem" ) ) == undefined )
		{
			oRes.action_result = { command: "alert", msg: i18n.t( 'dannuyuzayavkumo' ) };
			return oRes;
		}
	}
	var arrFormFields = [];
	switch( sCommand )
	{
		case "eval":
		{
			teRequest = OpenNewDoc( 'x-local://wtv/wtv_request.xmd' ).TopElem;
			teRequestType = OpenDoc( UrlFromDocID( iRequestTypeID ) ).TopElem;
			teRequest.request_type_id = iRequestTypeID;

			
			var bDoStep1 = false;			
			if ( teRequestType.object_type.HasValue )
			{
				if ( iObjectID != "" )
				{
					docObject = tools.open_doc( iObjectID );
					if ( docObject != undefined && docObject.TopElem.Name == teRequestType.object_type.Value)
					{
						arrFormFields.push( { name: "selected_object_name", type: "paragraph", value: teRequestType.object_type.ForeignElem.title.Value + ' "' + docObject.TopElem.name + '"' } );
					}
					else
					{
						iObjectID = "";
					}
				}
				
				if(iObjectID != "")
				{
					arrFormFields.push( { name: "selected_object_id", type: "hidden", value: iObjectID } );
				}
				else
				{
					sXqueryQual = teRequestType.object_query_qual.Value;
					if ( sXqueryQual != "" )
					{
						if ( StrContains( sXqueryQual, "<%" ) )
						{
							if ( StrContains( sXqueryQual, "curUserID" ) )
							{
								curUserID = iPersonID;
							}
							if ( StrContains( sXqueryQual, "curUser" ) )
							{
								curUser = tePerson;
							}
							if ( StrContains( sXqueryQual, "curObjectID" ) )
							{
								curObjectID = iObjectId;
							}
							if ( StrContains( sXqueryQual, "curObject" ) )
							{
								if ( docObject == undefined )
								{
									docObject = tools.open_doc( iObjectID );
								}
								if ( docObject == undefined )
								{
									curObject = null;
								}
								else
								{
									curObject = docObject.TopElem;
								}
							}
							try
							{
								sXqueryQual = EvalCodePage( sXqueryQual, true );
							}
							catch ( err )
							{
								EnableLog( "request_workflow_err" );
								LogEvent( "request_workflow_err", "XQ_COND_ERROR TYPEID = " + iRequestTypeID + " FIELD = object_id ERR_TEXT = " + err );
							}
						}
					}
					arrFormFields.push( { name: "selected_object_id", label: teRequestType.object_type.ForeignElem.title.Value, type: "foreign_elem", catalog_name: teRequestType.object_type.Value, query_qual: sXqueryQual, value: iObjectID,  mandatory: true, validation: "nonempty" } );
					bDoStep1 = true;
				}
				
			}

			if( teRequestType.is_can_be_group )
			{
				obj = { name: "is_group", label: i18n.t( 'zayaviteli' ), type: "combo", value: "", entries: [] };
				obj.entries.push( { name: i18n.t( 'individualnaya' ), value: 0 } );
				obj.entries.push( { name: i18n.t( 'gruppovaya' ), value: 1 } );
				arrFormFields.push( obj );
				bDoStep1 = true;
			}

			if( !teRequestType.hide_portal_comment )
			{
				obj = { name: "portal_comment", label: i18n.t( 'obosnovanie' ), type: "text", value: "" };
				arrFormFields.push( obj );
				bDoStep1 = true;
			}

			if(bDoStep1)
			{
				oRes.action_result = { 	
					command: "display_form",
					title: teRequestType.name.Value,
					header: i18n.t( 'zapolnitepolya' ),
					form_fields: arrFormFields 
				};
				break;
			}

		}
		case "submit_form":
		{
			oFormFields = null;
			var form_fields = SCOPE_WVARS.GetOptProperty( "form_fields", "" )
			if ( form_fields != "" )
			{
				oFormFields = ParseJson( form_fields );
			}
			var oResCheck = lp_check_form_fields_files( oFormFields );
			if( oResCheck.error != 0 )
			{
				oRes.action_result = { command: "alert", msg: oResCheck.errorText };
				break;
			}
			
			requestDoc = OpenNewDoc( 'x-local://wtv/wtv_request.xmd' );

			tools.common_filling( 'request_type', requestDoc.TopElem, request_type_id, requestTypeDoc );

			oSourceParam = new Object();
			var sValue;
			for( _field in oFormFields )
			{
				if( StrBegins( _field.name, "custom_field_" ) )
				{
					switch( _field.GetOptProperty( "type" ) )
					{
						case "file":
							if( _field.GetOptProperty( "url", "" ) != "" )
							{
								docResource = OpenNewDoc( 'x-local://wtv/wtv_resource.xmd' );

								if( iPersonID != null )
								{
									docResource.TopElem.person_id = iPersonID;
									tools.common_filling( 'collaborator', docResource.TopElem, iPersonID, tePerson );
								}
								docResource.BindToDb();
								docResource.TopElem.put_data( _field.url );
								docResource.Save();
								sValue = docResource.DocID;
							}
							else
							{
								sValue = _field.value;
							}
							oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), sValue );
							break;
						default:
							if( IsArray( _field.value ) )
							{
								oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), ArrayMerge( _field.value, "This", ";" ) );
							}
							else
							{
								oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), _field.value );
							}
					}
				}
				else
				{
					oSourceParam.SetProperty( _field.name, _field.value );
				}
			}
			//teRequestType = OpenDoc( UrlFromDocID( iRequestTypeID ) ).TopElem;
			requestDoc.TopElem.is_group = tools_web.is_true( oSourceParam.GetOptProperty( "is_group" ) );
			if( requestDoc.TopElem.is_group && oSourceParam.GetOptProperty( "SelectedPersons" ) == undefined )
			{
				arrQQConds = [];
				arrQQConds.push("$elem/is_dismiss != true()");
				if(!requestTypeDoc.is_can_be_add_youself)
					arrQQConds.push("$elem/id != " + iPersonID);
				sQueryQual = ( ArrayOptFirstElem(arrQQConds) != undefined ? ArrayMerge(arrQQConds, "This", " and ") : "" )

				oRes.action_result = { 	
						command: "display_form",
						title: requestTypeDoc.name.Value,
						header: i18n.t( 'zapolnitepolya' ),
						form_fields: arrFormFields 
					};
					
				oRes.action_result.form_fields.push( { name: "SelectedPersons", label: i18n.t( 'sostavgruppy' ), type: "foreign_elem", catalog_name: "collaborator", value: "",  mandatory: true, validation: "nonempty", query_qual: sQueryQual, multiple: true, show_all: requestTypeDoc.show_all.Value } );
				for( _field in oSourceParam )
				{
					oRes.action_result.form_fields.push( { name: _field, type: "hidden", value: oSourceParam.GetOptProperty( _field ) } );
				}
				merge_form_fields();
				break;
			}
			if( requestDoc.TopElem.is_group )
			{
				for ( _pers in String( oSourceParam.GetOptProperty( "SelectedPersons" ) ).split( ";" ) )
					try
					{
						_child = requestDoc.TopElem.persons.ObtainChildByKey( Int( _pers ) );
						tools.common_filling( 'collaborator', _child, Int( _pers ) );
					}
					catch ( err )
					{
						alert( err );
					}
			}

			iSelectedObjectID = OptInt( oSourceParam.GetOptProperty( "selected_object_id" ), OptInt( iObjectID, null ) );
			oSourceParam.SetProperty( "selected_object_id", iSelectedObjectID );
			if ( requestDoc.TopElem.type.HasValue )
			{
				if( iSelectedObjectID == null )
				{
					oRes.action_result = { command: "alert", msg: i18n.t( 'r4ycn3hwme' ) };
					break;
				}
				else if( iPersonID != null )
				{
					if ( ! global_settings.settings.recruitment.default_request_type_id.HasValue || iRequestTypeID != global_settings.settings.recruitment.default_request_type_id )
					{
						sObjectID = iSelectedObjectID;
						if ( ArrayOptFirstElem( XQuery( "for $request in requests where $request/person_id = " + iPersonID + " and $request/object_id = " + sObjectID + " and $request/request_type_id = " + iRequestTypeID + " and $request/status_id = 'active' and $request/is_group != true() return $request" ) ) != undefined )
						{
							oRes.action_result = { command: "alert", msg: i18n.t( 'uvasuzheestzayav' ) };
							break;
						}
					}
				}
			}

			if ( requestDoc.TopElem.type.HasValue )
			{
				teSelectedObject = OpenDoc( UrlFromDocID( iSelectedObjectID ) ).TopElem;
				requestDoc.TopElem.object_id = iSelectedObjectID;
				tools.object_filling( requestDoc.TopElem.type, requestDoc.TopElem, iSelectedObjectID, teSelectedObject );
				tools.admin_access_copying( null, requestDoc.TopElem, iSelectedObjectID, teSelectedObject );
			}
			if( iPersonID != null )
			{
				requestDoc.TopElem.person_id = iPersonID;
				tools.common_filling( 'collaborator', requestDoc.TopElem, iPersonID, tePerson );
			}
			
			sComment = oSourceParam.GetOptProperty( "portal_comment", "" );
			if( sComment != "" ) 
			{
				requestDoc.TopElem.comment = sComment;
			}
			
			fldCustomElems = tools.get_custom_template( requestDoc.TopElem.Name, null, requestDoc.TopElem );
			
			var bCheckCustomFields = tools_web.is_true( oSourceParam.GetOptProperty( "check_custom_fields" ) );
			if ( fldCustomElems != null && !bCheckCustomFields )
			{
				fldCustomElemsFields = ArraySelectByKey( fldCustomElems.fields, true, 'disp_web' );
				if( ArrayOptFirstElem( fldCustomElemsFields ) != undefined )
				{
					oRes.action_result = { 	command: "display_form",
							title: requestTypeDoc.name.Value,
							header: i18n.t( 'zapolnitedopol' ),
							form_fields: arrFormFields };
					for( _field in fldCustomElemsFields )
					{
						if ( ArrayCount( _field.view.conditions ) != 0 )
						{
							bShow_arrCustomFields = SafeEval( tools.create_filter_javascript( _field.view.conditions ), [ { 'fldFieldElem': _field, 'tools': tools, 'curObject': requestDoc.TopElem } ] );
							if ( ! bShow_arrCustomFields )
								continue;
						}
						sXqueryQual = _field.xquery_qual.Value;
						if ( sXqueryQual != "" )
						{
							if ( StrContains( sXqueryQual, "<%" ) )
							{
								if ( StrContains( sXqueryQual, "curUserID" ) )
								{
									curUserID = iPersonID;
								}
								if ( StrContains( sXqueryQual, "curUser" ) )
								{
									curUser = tePerson;
								}
								if ( StrContains( sXqueryQual, "curObjectID" ) )
								{
									curObjectID = iObjectId;
								}
								if ( StrContains( sXqueryQual, "curObject" ) )
								{
									if ( docObject == undefined )
									{
										docObject = tools.open_doc( iObjectID );
									}
									if ( docObject == undefined )
									{
										curObject = null;
									}
									else
									{
										curObject = docObject.TopElem;
									}
								}
								try
								{
									sXqueryQual = EvalCodePage( sXqueryQual, true );
								}
								catch ( err )
								{
									EnableLog( "request_workflow_err" );
									LogEvent( "request_workflow_err", "XQ_COND_ERROR TYPEID = " + iRequestTypeID + " FIELD = " + _field.name.Value + " ERR_TEXT = " + err );
								}
							}
						}
						obj = { name: "custom_field_" + _field.name.Value, label: _field.title.Value, query_qual: sXqueryQual, type: _field.type.Value, value: "", catalog_name: _field.catalog.Value, max_chars: _field.max_chars.Value, mandatory: _field.is_required.Value, validation: ( _field.is_required.Value ? "nonempty" : "" ), entries: [] };
						for( _entr in _field.entries )
							obj.entries.push( { name: _entr.value.Value, value: _entr.value.Value } );
						oRes.action_result.form_fields.push( obj );
					}
					oRes.action_result.form_fields.push( { name: "check_custom_fields", type: "hidden", value: true } );
					for( _field in oSourceParam )
					{
						oRes.action_result.form_fields.push( { name: _field, type: "hidden", value: oSourceParam.GetOptProperty( _field ) } );
					}
					merge_form_fields();
					break;
				}
			}

			if( oFormFields != null )
			{
				oResCustomElems = tools_web.custom_elems_filling( requestDoc.TopElem, oSourceParam, null, ({ 'sCatalogName': requestDoc.TopElem.Name, 'iObjectID': request_type_id, 'bCheckMandatory': true, 'bCheckCondition': true }) );
				if ( oResCustomElems.error != 0 )
				{
					var sErrorText = "";
					var Env = CurRequest.Session.GetOptProperty( "Env", ({}) );
					var oLngEnv = tools_web.get_cur_lng_obj( Env );
					var curLng = oLngEnv.GetOptProperty( "curLng", null );
					if ( ArrayCount( oResCustomElems.mandatory_fields ) != 0 )
					{
						sErrorText += StrReplace( i18n.t( 'neobhodimozapo_1' ), '{PARAM1}', ArrayMerge( oResCustomElems.mandatory_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
					}

					if ( ArrayCount( oResCustomElems.condition_fields ) != 0 )
					{
						sErrorText += ' ' + StrReplace( i18n.t( 'nevernyeznachen' ), '{PARAM1}', ArrayMerge( oResCustomElems.condition_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
					}

					if(!IsEmptyValue(sErrorText))
					{
						oRes.action_result = { command: "alert", msg: sErrorText };
						return oRes;
					}
				}
			}
			
			var oResCreateRequest = CreateRequestMain( request_type_id, requestTypeDoc, oSourceParam, iPersonID, tePerson, requestDoc );
			if( oResCreateRequest.error != 0 )
			{
				oRes.action_result = { command: "alert", msg: oResCreateRequest.errorText };
				return oRes;
			}
			
			oRes.action_result = { command: "close_form", msg: ( requestTypeDoc.create_message.HasValue ? requestTypeDoc.create_message.Value : i18n.t( 'zayavkauspeshnos' ) ), confirm_result: {command: "reload_page"} };
			return oRes;
		}
		default:
			oRes.action_result = { command: "alert", msg: i18n.t( 'neizvestnayakom' ) };
			return oRes;
	}
	return oRes;
}

/**
 * @typedef {Object} WTMainCreateRequestMainResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {XmDoc} doc_request – результат
*/
/**
 * @typedef {Object} oSourceParam
 * @property {bool} is_group – групповая заявка
 * @property {string} SelectedPersons – содержимое группы через ";"
 * @property {number} selected_object_id – объект заявки
 * @property {string} portal_comment – комментарий заявки
*/
/**
 * @function CreateRequestMain
 * @memberof Websoft.WT.Main
 * @description создание карточки заявки
 * @param {bigint} iRequestTypeID - ID типа заявки
 * @param {XmElem} [teRequestType] - TopElem карточки типа заявки
 * @param {oSourceParam} [oSourceParam] - Json объект с набором полей
 * @param {bigint} iPersonID - ID сотрудника
 * @param {XmElem} [tePerson] - TopElem карточки сотрудника
 * @param {XmDoc} [docNewRequest] - Doc новой карточки заявки
 * @returns {WTMainCreateRequestMainResult}
*/
/*
oSourceParam содержит настраиваемые поля и следующие атрибуты:
is_group [bool] групповая заявка
SelectedPersons [string] содержимое группы через ";"
selected_object_id [number] объект заявки
portal_comment [string] комментарий заявки
*/

function CreateRequestMain( iRequestTypeID, teRequestType, oSourceParam, iPersonID, tePerson, docNewRequest )
{
	var oRes = tools.get_code_library_result_object();
	oRes.doc_request = null;
	try
	{
		iRequestTypeID = Int( iRequestTypeID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = "Incorrect iRequestTypeID";
		return oRes;
	}
	try
	{
		teRequestType.Name;
	}
	catch( ex )
	{
		try
		{
			teRequestType = tools.open_doc( iRequestTypeID ).TopElem;
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.errorText = "Incorrect iRequestTypeID";
			return oRes;
		}
	}
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = "Incorrect iPersonID";
		return oRes;
	}
	try
	{
		tePerson.Name;
	}
	catch( ex )
	{
		try
		{
			tePerson = tools.open_doc( iPersonID ).TopElem;
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.errorText = "Incorrect iPersonID";
			return oRes;
		}
	}
	var curLngWeb = tools_web.get_default_lng_web( tePerson );
	try
	{
		 if( DataType( oSourceParam ) != "object" || ObjectType( oSourceParam ) != "JsObject" )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		oSourceParam = new Object();
	}
	try
	{
		docNewRequest.TopElem;
		requestDoc = docNewRequest;
	}
	catch( ex )
	{
		requestDoc = OpenNewDoc( 'x-local://wtv/wtv_request.xmd' );
	}
	tools.common_filling( 'request_type', requestDoc.TopElem, iRequestTypeID, teRequestType );
	requestDoc.TopElem.is_group = tools_web.is_true( oSourceParam.GetOptProperty( "is_group" ) );
	if( requestDoc.TopElem.is_group )
	{
		for ( _pers in tools_web.parse_multiple_parameter( oSourceParam.GetOptProperty( "SelectedPersons" ) ) )

			try
			{
				_child = requestDoc.TopElem.persons.ObtainChildByKey( Int( _pers ) );
				tools.common_filling( 'collaborator', _child, Int( _pers ) );
			}
			catch ( err )
			{
				alert( err );
			}
	}

	var iSelectedObjectID = OptInt( oSourceParam.GetOptProperty( "selected_object_id" ), null );

	if ( requestDoc.TopElem.type.HasValue )
	{
		if( iSelectedObjectID == null )
		{
			oRes.error = 1;
			oRes.errorText = i18n.t( 'nevybranobekt' );
			return oRes;
		}
		else if( iPersonID != null )
		{
			if ( ! global_settings.settings.recruitment.default_request_type_id.HasValue || iRequestTypeID != global_settings.settings.recruitment.default_request_type_id )
			{
				sObjectID = iSelectedObjectID;
				if ( ArrayOptFirstElem( XQuery( "for $request in requests where $request/person_id = " + iPersonID + " and $request/object_id = " + sObjectID + " and $request/request_type_id = " + iRequestTypeID + " and $request/status_id = 'active' and $request/is_group != true() return $request" ) ) != undefined )
				{
					oRes.error = 1;
					oRes.errorText = i18n.t( 'uvasuzheestzayav' );
					return oRes;
				}
			}
		}
	}

	if ( requestDoc.TopElem.type.HasValue )
	{
		teSelectedObject = OpenDoc( UrlFromDocID( iSelectedObjectID ) ).TopElem;
		requestDoc.TopElem.object_id = iSelectedObjectID;
		tools.object_filling( requestDoc.TopElem.type, requestDoc.TopElem, iSelectedObjectID, teSelectedObject );
		tools.admin_access_copying( null, requestDoc.TopElem, iSelectedObjectID, teSelectedObject );
	}
	if( iPersonID != null )
	{
		requestDoc.TopElem.person_id = iPersonID;
		tools.common_filling( 'collaborator', requestDoc.TopElem, iPersonID, tePerson );
	}
	
	sComment = oSourceParam.GetOptProperty( "portal_comment", "" );
	if( sComment != "" ) 
	{
		requestDoc.TopElem.comment = sComment;
	}
	
	oResCustomElems = tools_web.custom_elems_filling( requestDoc.TopElem, oSourceParam, null, ({ 'sCatalogName': requestDoc.TopElem.Name, 'iObjectID': iRequestTypeID, 'bCheckMandatory': true, 'bCheckCondition': true }) );
	if ( oResCustomElems.error != 0 )
	{
		if ( ArrayCount( oResCustomElems.mandatory_fields ) != 0 )
			sErrorText += StrReplace( i18n.t( 'neobhodimozapo_1' ), '{PARAM1}', ArrayMerge( oResCustomElems.mandatory_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
		if ( ArrayCount( oResCustomElems.condition_fields ) != 0 )
			sErrorText += ' ' + StrReplace( i18n.t( 'nevernyeznachen' ), '{PARAM1}', ArrayMerge( oResCustomElems.condition_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );

		oRes.error = 1;
		oRes.errorText = sErrorText;
		return oRes;
	}
	
	requestDoc.BindToDb( DefaultDb );
	try
	{
		requestDoc.Save();

		tools.create_notification( "1", requestDoc.DocID, "", null, requestDoc.TopElem );
		ms_tools.raise_system_event_env( 'portal_create_request', {
			'requestTypeID': iRequestTypeID,
			'requestTypeDoc': teRequestType,
			'curUserID': iPersonID,
			'curUser': tePerson,
			'requestDoc': requestDoc
		} );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = RValue( err );
		return oRes;
	}
	oRes.SetProperty( "doc_request", requestDoc );
	return oRes;
}

/**
 * @author BG
*/
function get_request_group_persons(iRequestID, bHasDismissed, oCollectionParams)
{
	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];
	
	iRequestID = OptInt(iRequestID);
	if(iRequestID == undefined)
	{
		oRes.error = 501
		oRes.errorext = i18n.t( 'neperedanidzaya' )
	}
	
	docRequest = tools.open_doc(iRequestID);
	if(iRequestID == undefined)
	{
		oRes.error = 501
		oRes.errorext = StrReplace(i18n.t( 'nenaydenazayavk' ), "{PARAM1}", iRequestID);
	}
	teRequest = docRequest.TopElem;

	if( !tools_web.check_object(teRequest, "request" ))
	{
		oRes.error = 501
		oRes.errorext = StrReplace(i18n.t( 'peredannyyidne' ), "{PARAM1}", teRequest.Name);
	}
	
	var arrRequestPersons = teRequest.persons;

	if(ArrayOptFirstElem(arrRequestPersons) == undefined)
		return oRes;
	
	if(!tools_web.is_true(bHasDismissed))
	{
		var sUnDismissedPersonReq = "for $elem in collaborators where $elem/is_dismiss != true() and MatchSome($elem/id, (" + ArrayMerge(arrRequestPersons, "This.person_id.Value", ",") + ")) return $elem/Fields('id')";
		var arrUnDismissedPersonIDs = tools.xquery(sUnDismissedPersonReq);
		
		arrRequestPersons = ArrayIntersect(arrRequestPersons, arrUnDismissedPersonIDs, "This.person_id", "This.id")
	}
	
	if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		switch(sFieldName)
		{
			case "name":
				sFieldName = "person_fullname";
				break
			case "position":
				sFieldName = "person_position_name";
			case "subdivision":
				sFieldName = "person_subdivision_name";
		}
		arrRequestPersons = ArraySort(arrRequestPersons, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
	}

	if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount(arrRequestPersons);
		oRes.paging = oCollectionParams.paging;
		arrRequestPersons = ArrayRange(arrRequestPersons, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
	}

	var oItemObj;
	for(itemPerson in arrRequestPersons)
	{
		oItemObj = {
			id: itemPerson.person_id.Value,
			name: itemPerson.person_fullname.Value,
			position: itemPerson.person_position_name.Value,
			subdivision: itemPerson.person_subdivision_name.Value,
			image_url: tools_web.get_object_source_url( 'person', itemPerson.person_id.Value ),
			link: tools_web.get_mode_clean_url( null, itemPerson.person_id.Value )
			};
		oRes.array.push(oItemObj);
	}

	return oRes;
}

function _read_postmultipart_file_info(ct, sBodyB)
{
	var j,i = ct.indexOf("boundary=");
	var boundary, match, anchorLen, hdr, dPart,ctPart, lI = 0;
	var aFileInfo = new Array();

	if (i > 0)
	{
		boundary = StrRangePos(ct,i + 9, -1);

		anchorLen = StrLen(boundary);
		i = StrOptSubStrPosB(sBodyB, boundary);
		while (i >= 0)
		{
			lI = sBodyB.indexOf("\n", i + anchorLen);
			i = -1;
			if (lI > 0)
			{
				dPart = null;
				ctPart = null;
				hdr = null;
				do
				{
					i = lI;
					lI = sBodyB.indexOf("\n", i+1);
					if (lI > i)
					{
						hdr = Trim(StrRangePos(sBodyB, i, lI));
						j = hdr.indexOf(":");

						if (j <= 0)
							hdr = null;
						else
						{
							match = StrLowerCase(StrRangePos(hdr, 0, j));
							switch(match)
							{
								case "content-disposition":
								{
									if ((j=hdr.indexOf("filename=", StrLen(match))) > 0)
									{
										c = StrRangePos(hdr, j + 9, j + 10);
										if (c == '"' || c == "'")
										{
											dPart = StrRangePos(hdr, j + 10, hdr.indexOf(c, j + 10));
										}
										else
										{
											dPart = StrRangePos(hdr, j + 9, hdr.indexOf(";", j + 10));
										}
										
										if (dPart == "") dPart = null;
									}
									break;
								}
								case "content-type":
								{
									ctPart = StrLowerCase(Trim(StrRangePos(hdr, 13, hdr.indexOf(";", 13))));
									break;
								}
							}
							i += StrLen(hdr);
						}

					}
				}
				while (hdr != null);

				if (dPart != null)
					aFileInfo.push(([dPart, ctPart]));

				sBodyB = sBodyB.slice(lI);
				i = StrOptSubStrPosB(sBodyB, boundary);
			}
		}
	}
	return aFileInfo;
}

function _ruleCheck(_file, _person_id, _tePerson, _fileInfo, _config, _ores)
{
	function _match(_rules, _fi, _invert)
	{
		var norules = true;
		if (ObjectType(_rules) == "JsObject")
		{
			var _tps = _rules.GetOptProperty("types");
			if (IsArray(_tps))
			{
				norules = false;
				//if(_tps.indexOf(_fi[1]) < 0)
				if (ArrayOptFind(_tps, "StrLowerCase(This) == " + CodeLiteral(_fi[1])) == undefined)
					return false;
			}

			_tps = _rules.GetOptProperty("fileNameRule", null);
			if (_tps != null && (_tps = Trim(_tps)) != "")
			{
				norules = false;
				var oRegExp = tools_web.reg_exp_init();
				oRegExp.Pattern = _tps;

				var m;
				try
				{
					m = oRegExp.IsMatch(_fi[0]);
				}
				catch(_x_)
				{
					alert("resource_create: regular expression error (" + _tps + ") " + _x_);
					m = false;
				}

				if (!m)
					return false;
			}
		}

		return (norules ? !_invert : true);
	}
	if (_file.FileName != "")
	{
		var sizeCheck, _fileLen = ( _file.GetOptProperty( "file_size" ) != undefined ? _file.GetOptProperty( "file_size" ) : StrLen(_file) );
		if (_config != null)
		{
			if (_fileInfo != null)
			{
				var _fn = ArrayOptFind(_fileInfo, "This[0] == " + CodeLiteral(_file.FileName));
				if (_fn != undefined)
				{
					if (!_match(_config.GetOptProperty("white", null), _fn, false) || _match(_config.GetOptProperty("black", null), _fn, true))
					{
						_ores.error = 5; _ores.errorText = i18n.t( 'zagruzkadannog' ); return false;
					}
				}
				else
				{
					_ores.error = 4; _ores.errorText = "Upload error (4). Body mismatch."; return false;
				}
			}

			sizeCheck = OptInt(_config.GetOptProperty("maxFileSize"));
			if (sizeCheck > 0 && _fileLen > sizeCheck)
			{
				_ores.error = 6; _ores.errorText = i18n.t( 'prevyshendopust' ); return false;
			}

		}

		sizeCheck = tools.check_resource_size(_fileLen, _person_id, _tePerson);

		if (sizeCheck != "ok")
		{
			_ores.error = 2; _ores.errorText = sizeCheck; return false;
		}

		_ores.error = 0; _ores.errorText = "ok"; return true;

	}

	_ores.error = 3; _ores.errorText = "Undefined filename"; return false;

}

function _get_config()
{
	try
	{
		var sConfigJSON = tools.spxml_unibridge.Object.provider.GetUserData('resource_sec_json_upload');
		if (sConfigJSON == undefined)
			throw "redo";
		else if (sConfigJSON == "null")
			return null;

		var oJson = ParseJson(sConfigJSON);
		return oJson.upload;
	}
	catch(_x_)
	{
		try
		{
			var param;
			try
			{
				var iassembly = tools.dotnet_host.Object.GetAssembly('Websoft.Inventa.Client.dll');
				param = iassembly.CallClassStaticMethod('Websoft.Inventa.Core.Client','GetMappedConfigFile', (['resource_sec.json']));

				if (param == undefined || param == null || param == "")
					throw 'default';
			}
			catch(_o_)
			{
				param = AppDirectoryPath() + "/resource_sec.json";
			}
			var json = LoadFileText(param);

			var o = ParseJson(json).upload;
			if (ObjectType(o) != "JsObject")
				throw "no";

			tools.spxml_unibridge.Object.provider.SetUserData('resource_sec_json_upload', json);
			return o;

		}
		catch(_o_)
		{
			tools.spxml_unibridge.Object.provider.SetUserData('resource_sec_json_upload', "null");
		}
	}
	return null;
}
	
function JoinChunk( guid, file_name, fileSize, countChunk, iPersonID, tePerson, sResFileUrl ) 
{
	var sFileChunkFolderUrl = "x-local://wt_data/attachments/filechunk";
	try
	{
		ObtainDirectory( UrlToFilePath( sFileChunkFolderUrl ), true );
	}
	catch( ex ){}

	var oResJoin = {
		Success: false,
		Message: "",
		Result: ""
	};
	var aPath = [];
	try 
	{

		var pathUrlMain;
		try
		{
			if( IsEmptyValue( sResFileUrl ) )
			{
				throw "error";
			}
			pathUrlMain = sResFileUrl;
		}
		catch( err )
		{
			pathUrlMain = ObtainTempFile( UrlPathSuffix( file_name ) );
		}
		PutUrlData( pathUrlMain, "" );
		var pathFileMain = UrlToFilePath( pathUrlMain );

		var startIndex = finishIndex = 0;

		for (i = 0; i < ( countChunk == undefined ? 99999 : countChunk ); i++) 
		{
			pathUrl = UrlAppendPath( UrlAppendPath( sFileChunkFolderUrl, guid ), i );
			try
			{
				data = LoadUrlData( pathUrl );
			}
			catch ( _no_data )
			{
				throw _no_data + " - " + pathUrl;
			}
			sizeChunk = undefined;
			if ( (tools.sys_db_capability & tools.UNI_CAP_BASIC) != 0 )
			{
				sizeChunk = tools.spxml_unibridge.Object.provider.FetchUrlAttribute( pathUrl, 'Length' );
			}
			if( sizeChunk == undefined )
			{
				sizeChunk = UrlFileSize( pathUrl );
			}
			finishIndex = startIndex + sizeChunk;

			PutFileDataRange( pathFileMain, startIndex, finishIndex, data );

			startIndex = finishIndex;
			aPath.push( { url: pathUrl } );
		}
		
		var oType = ArrayOptFindByKey( tools_web.content_types.Object, UrlPathSuffix( pathUrlMain ), "ext" );
		if( oType == undefined )
		{
			oResJoin.Message = i18n.t( 'neizvestnyyfor' );
			return oResJoin;
		}
		var aSecInfo = [ [ file_name, oType.type ] ];
		var oUpConfig = _get_config();
		var oResTemp = ({error: 0, errorText: ""});
		_ruleCheck( { "FileName": file_name, "file_url": pathUrlMain, "file_name": file_name, "file_size": UrlFileSize( pathUrlMain ) }, iPersonID, tePerson, aSecInfo, oUpConfig, oResTemp);
		if( oResTemp.error != 0 )
		{
			oResJoin.Success = false;
			oResJoin.Result = "";
			oResJoin.Message = oResTemp.errorText;
			return oResJoin;
		}	

		if ( UrlFileSize( pathUrlMain ) == fileSize ) 
		{
			oResJoin.Success = true;
			oResJoin.Result = pathUrlMain;
		}

	} catch (e) 
	{
		alert( "ERROR[upload_big_file]: " + e );
		oResJoin.Message = e;
	}
	for (i = 0; i < countChunk; i++) 
	{
		try
		{
			pathUrl = UrlAppendPath( UrlAppendPath( sFileChunkFolderUrl, guid ), i );
			DeleteUrl(pathUrl);
		}
		catch( ex )
		{}
	}
	return oResJoin;
}

function UploadFile( Request, bJoinFile, iPersonID, tePerson, sResFileUrl ) 
{
	try
	{
		if( IsEmptyValue( sResFileUrl ) )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		sResFileUrl = null;
	}
	sFileChunkFolderUrl = "x-local://wt_data/attachments/filechunk";
	try
	{
		ObtainDirectory( UrlToFilePath( sFileChunkFolderUrl ), true );
	}
	catch( ex ){}
	try
	{
		if( bJoinFile == null || bJoinFile == undefined || bJoinFile == "" )
		{
			throw "error";
		}
		bJoinFile = tools_web.is_true( bJoinFile );
	}
	catch( ex )
	{
		bJoinFile = true;
	}
	function UploadChunk(guid, fileName, data, fileSize, numberChunk, countChunk, iPersonID, tePerson) 
	{
		var oResp = {
			"error": 0,
			"codeError": 0,
			"message": "",
			"chunk": true,
			"guid": guid,
			"file_name": fileName,
			"file_size": fileSize,
			"result": ""
		};

		if (fileName != undefined && Trim(fileName) != '') 
		{

			try 
			{
				var oType = ArrayOptFindByKey( tools_web.content_types.Object, UrlPathSuffix( fileName ), "ext" );
				if( oType == undefined )
				{
					oResp.error = 1;
					oResp.message = i18n.t( 'neizvestnyyfor' );
					return oResp;
				}
				var aSecInfo = [ [ fileName, oType.type ] ];
				var oUpConfig = _get_config();
				var oResTemp = ({error: 0, errorText: ""});
				_ruleCheck( { "FileName": fileName, "file_url": "", "file_name": fileName, "file_size": fileSize }, iPersonID, tePerson, aSecInfo, oUpConfig, oResTemp);
				if( oResTemp.error != 0 )
				{
					oResp.error = oResTemp.error;
					oResp.message = oResTemp.errorText;
					return oResp;
				}	
			
				var sFileFileChunkUrl = UrlAppendPath( sFileChunkFolderUrl, guid );
				try
				{
					ObtainDirectory( UrlToFilePath( sFileFileChunkUrl ), true );
				}
				catch( err ){}
				var path = UrlAppendPath( sFileFileChunkUrl, numberChunk );
				var sTempFileUrl = ObtainTempFile( '' );
				PutUrlData( sTempFileUrl, data );
				tools.copy_url( path, sTempFileUrl );
			} 
			catch (e1) 
			{
				oResp.error = 1;
				oResp.message = e1;
				oResp.codeError = 2;
			}
			if (oResp.error == 0) {
				if ( numberChunk == countChunk - 1 ) 
				{
					if( bJoinFile )
					{
						var oResJoin = JoinChunk(guid, fileName, fileSize, countChunk, iPersonID, tePerson, sResFileUrl);
						if (oResJoin.Success) 
						{
							oResp.result = oResJoin.Result;
							return oResp;
						}
						else 
						{
							oResp.error = 1;
							oResp.codeError = 3;
							oResp.message = oResJoin.Message;
						}
					}
				}
			}
		} 
		else 
		{
			oResp.error = 1;
			oResp.codeError = 1;
			oResp.message = "File name not specified";
		}

		return oResp;
	}
	if( Request.Header.GetOptProperty("Content-Range", "") == "" )
	{
		return {
			"error": 0,
			"codeError": 0,
			"message": "",
			"chunk": false,
			"result": ""
		}
	}
	var guid = Request.Query.GetOptProperty( "file_id" );
	var number_chunk = OptInt( Request.Form.GetOptProperty("chunk"), 0 );
	var count_chunk = OptInt( Request.Form.GetOptProperty("chunks_total"), 0 );	
	var file = Base64Decode(String(Request.Form.file_data).split(';base64,')[1]);
	var file_name = Request.Form.GetOptProperty("file_name");
	var file_size = OptInt( Request.Form.GetOptProperty( "file_size" ), 0 );

	return UploadChunk( guid, file_name, file, file_size, number_chunk, count_chunk, iPersonID, tePerson );
}
function create_resource( Request, iPersonID, tePerson )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.doc_resource = null;
	oRes.doc_resources = null;
	try
	{
		if( Request == null || Request == undefined )
			throw "error";
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyre' );
		return oRes;
	}
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
//		oRes.error = 1;
//		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
//		return oRes;
		iPersonID = null;
	}
	try
	{
		if( iPersonID != null )
			tePerson.Name
		else
			tePerson = null;
	}
	catch( ex )
	{
		try
		{
			tePerson = OpenDoc( UrlFromDocID( iPersonID ) ).TopElem;
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
			return oRes;
		}
	}

	oResUpload = UploadFile( Request, true, iPersonID, tePerson );
	if( oResUpload.error != 0 )
	{
		oRes.error = oResUpload.error;
		oRes.errorText = oResUpload.message;
		return oRes;
	}
	
	var oUpConfig = _get_config();
	if( oResUpload.chunk )
	{
		var oType = ArrayOptFindByKey( tools_web.content_types.Object, UrlPathSuffix( oResUpload.file_name ), "ext" );
		if( oType == undefined )
		{
			oRes.error = 1;
			oRes.errorText = i18n.t( 'neizvestnyyfor' );
			return oRes;
		}
		aSecInfo = [ [ oResUpload.file_name, oType.type ] ];
		if( oResUpload.result == "" )
		{
			_ruleCheck( { "FileName": oResUpload.file_name, "file_url": oResUpload.result, "file_name": oResUpload.file_name, "file_size": oResUpload.file_size }, iPersonID, tePerson, aSecInfo, oUpConfig, oRes);
			return oRes;
		}
		else
		{
			aFileFields = [ { "FileName": oResUpload.file_name, "file_url": oResUpload.result, "file_name": oResUpload.file_name, "file_size": oResUpload.file_size } ];
		}
	}
	else
	{
		sFieldName = Request.Query.GetOptProperty( 'add_file_field', 'add_file_url' );
		aFileFields = Request.Query.GetProperties( sFieldName );
		var aSecInfo = _read_postmultipart_file_info(Request.Header.GetOptProperty("Content-Type", ""), Request.Body);
	}
	docResource = null;
	aResourses = new Array();
	
	for ( oFileField in aFileFields )
	{
		_ruleCheck( oFileField, iPersonID, tePerson, aSecInfo, oUpConfig, oRes);
		if (oRes.error == 0)
		{
			
			docResource = OpenNewDoc( 'x-local://wtv/wtv_resource.xmd' );

			if ( Request.Query.HasProperty( 'add_file_status' ) )
				docResource.TopElem.type = Request.Query.add_file_status;

			if ( Request.Query.HasProperty( 'add_file_desc' ) )
				docResource.TopElem.comment = UrlDecode( Request.Query.add_file_desc );

			if ( iPersonID != null )
			{
				docResource.TopElem.person_id = iPersonID;
				tools.common_filling( 'collaborator', docResource.TopElem, iPersonID, tePerson );
			}
			if (Request.Query.HasProperty("add_file_accessobjectid"))
			{
				try
				{
					docResource.TopElem.access.AssignElem(OpenDoc(UrlFromDocID(Int(Request.Query.add_file_accessobjectid)), "form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1").TopElem.access);
				}
				catch(_X_)
				{

				}
			}

			if (Request.Query.HasProperty("access_groups"))
			{
				var catGroup, aGroups = String(Request.Query.GetProperty("access_groups")).split(";");
				if (ArrayOptFirstElem(aGroups) != undefined)
				{
					aGroups = QueryCatalogByKeys("groups", "id", ArraySelect(ArrayExtract(aGroups, "OptInt(This)"), "This != undefined"));
					for (catGroup in aGroups)
					{
						docResource.TopElem.access.access_groups.ObtainChildByKey(catGroup.PrimaryKey);
					}
				}
			}

			docResource.BindToDb();
			if( oResUpload.chunk )
			{
				docResource.TopElem.put_data( oFileField.file_url, null, oFileField.file_name );
				docResource.Save();
			}
			else
			{
				docResource.TopElem.put_str( oFileField, UrlFileName( oFileField.FileName ) );
			}
			
			if ( Request.Query.GetOptProperty( "update_repositorium_id", "" ) != "" )
				try
				{
					docRepo = OpenDoc(UrlFromDocID(Int(Request.Query.GetProperty("update_repositorium_id"))));

					if (tools_web.check_access( docRepo.TopElem, iPersonID, tePerson, Request.Session ))
					{
						docRepo.TopElem.files.ObtainChildByKey(docResource.DocID);
						docRepo.Save();

						if (Request.Query.GetOptProperty("repo_content_access_copy") == "1")
						{
							var oRight, aRights = tools_web.get_object_owners(docRepo.DocID, "repositorium");
							for (oRight in aRights)
							{
								tools_web.set_person_object_info("repositorium", oRight.person_id, null, ([({"id": docRepo.DocID, "name": docRepo.TopElem.name, "can_edit": oRight.can_edit, "can_delete": oRight.can_delete})]));
							}
						}
					}
					else
					{
						throw 'No access to repositorium ' + docRepo.DocID;
					}
				}
				catch(_X_)
				{
					alert("Error updating repositorium for resource " + docResource.DocID);
				}
			aResourses.push(docResource);
		}
	}
	oRes.doc_resource = docResource;
	oRes.doc_resources = aResourses;
	return oRes;
}

/**
 * @typedef {Object} ToDoContext
 * @property {number} exceeded – количество просроченных.
 * @property {number} critical – количество срочный.
 * @property {number} future – количество будущих.
 * @property {number} count – количество всего задач.
 * @property {number} courses – количество задач типа курс.
 * @property {number} tests – количество задач типа тест.
 * @property {number} events – количество задач типа мероприятия.
 * @property {number} acquaints – количество задач типа ознакомление.
 * @property {number} requests – количество задач типа заявка.
*/
/**
 * @typedef {Object} ReturnToDoContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {ToDoContext} context – Контекст мероприятия.
*/
/**
 * @function GetToDoContext
 * @memberof Websoft.WT.Main
 * @description Получение контекста текущих дел.
 * @param {bigint} iPersonID - ID сотрудника
 * @param {number} [iDaysToShow] - Количество дней, в течение которых задача попадает в список (т.е. указываем 30 дней, видим задачи на месяц вперед + просроченные)
 * @param {number} [iCriticalDays] - Количество дней, которое остается до выполнения задачи, чтобы отнести ее к срочным
 * @param {boolean} [bShowCourse] - Показывать назначенные курсы
 * @param {boolean} [bShowTest] - Показывать назначенные тесты
 * @param {boolean} [bShowEventConfirmation] - Показывать напоминания о подтверждении участия в мероприятии
 * @param {boolean} [bShowResponseLeaving] - Показывать напоминания оставить отзыв
 * @param {boolean} [bShowPolls] - Показывать опросы
 * @param {boolean} [bShowRequests] - Показывать заявки на согласование
 * @param {boolean} [bShowAssessmentApraises] - Показывать оценочные процедуры
 * @param {boolean} [bShowLibraryMaterials] - Показывать материалы библиотеки, с которыми необходимо ознакомиться
 * @param {boolean} [bShowChatInvites] - Показывать новые сообщения в чате
 * @param {boolean} [bShowTasks] - Показывать задачи
 * @param {boolean} [bShowAcquaints] - Показывать ознакомления
 * @param {boolean} [bShowLearningTasks] - Показывать выполнения заданий
 * @param {boolean} [sSearch] - Строка для поиска
 * @returns {ReturnToDoContext}
*/
function GetToDoContext( iPersonID, iDaysToShow, iCriticalDays, bShowCourse, bShowTest, bShowEventConfirmation, bShowResponseLeaving, bShowPolls, bShowRequests, bShowAssessmentApraises, bShowLibraryMaterials, bShowChatInvites, bShowTasks, bShowAcquaints, bShowLearningTasks, sSearch )
{
	function get_value( sValue )
	{
		if( sValue == undefined || sValue == null || sValue == "" )
			 "";
		return sValue;
	}
	function set_value( sName, sValue )
	{
		oParams.SetProperty( sName, get_value( sValue ) )
	}
	oParams = new Object();

	set_value( "type", "" );
	set_value( "iDaysToShow", iDaysToShow );
	set_value( "iCriticalDays", iCriticalDays );
	set_value( "bShowCourses", bShowCourse );
	set_value( "bShowTest", bShowTest );
	set_value( "bShowEventConfirmation", bShowEventConfirmation );
	set_value( "bShowResponseLeaving", bShowResponseLeaving );
	set_value( "bShowPolls", bShowPolls );
	set_value( "bShowRequests", bShowRequests );
	set_value( "bShowAssessmentApraises", bShowAssessmentApraises );
	set_value( "bShowLibraryMaterials", bShowLibraryMaterials );
	set_value( "bShowChatInvites", bShowChatInvites );
	set_value( "bShowTasks", bShowTasks );
	set_value( "bShowAcquaints", bShowAcquaints );
	set_value( "bShowLearningTasks", bShowLearningTasks );
	set_value( "bUseCache", false );
	set_value( "sSearch", sSearch );

	return get_todo_context( iPersonID, null, oParams, null, null, { "type": "" } );
}

function get_todo_context( iPersonID, tePerson, oParams, Session, oToDoInit )
{
	var oRes = tools.get_code_library_result_object();
	oRes.context = new Object;
	oResResp = get_todo( iPersonID, tePerson, oParams, Session, null, oToDoInit );

	arrToDoItems = oResResp.array;

	var oContext = {
		exceeded: ArrayCount( ArraySelect( arrToDoItems, "This.exceeded" ) ),
		critical: ArrayCount( ArraySelect( arrToDoItems, "This.critical && !This.exceeded" ) ),
		future: ArrayCount( ArraySelect( arrToDoItems, "This.future && !This.critical && !This.exceeded" ) ),
		count: ArrayCount( arrToDoItems ),
		courses: ArrayCount( ArraySelect( arrToDoItems, "This.type == 'learning'" ) ),
		tests: ArrayCount( ArraySelect( arrToDoItems, "This.type == 'test'" ) ),
		events: ArrayCount( ArraySelect( arrToDoItems, "This.type == 'event'" ) ),
		acquaints: ArrayCount( ArraySelect( arrToDoItems, "This.type == 'acquaint'" ) ),
		requests: ArrayCount( ArraySelect( arrToDoItems, "This.type == 'request'" ) )
	};
	oRes.context = oContext;

	return oRes;
}
/* copy to @component external_sources  */
function start_discharge_on_server( iDischargeID )
{
	var oRes = tools.get_code_library_result_object();
	try
	{
		iDischargeID = Int( iDischargeID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_2' );
		return oRes;
	}

	oThread = new Thread;
	oThread.Param.docID = iDischargeID;
	sRunCode = ' PsDoc = OpenDoc( UrlFromDocID( ' + iDischargeID + ' ) ); Ps = PsDoc.TopElem; ';
	sRunCode += LoadUrlText( 'x-local://wtv/wtv_export_odbc.js' );

	oThread.EvalCode( sRunCode );

	return oRes;
}

function get_socket_url(sPortalUrl, aUIDs)
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.socket_url = "";
	oRes.http_socket_url = "";
	oRes.ws_socket_url = "";
	oRes.ws_media_service_url = "";
	oRes.ws_media_service_is_auth_agnostic = false;
	if (!IsArray(aUIDs))
	{
		aUIDs = null;
	}
	try
	{
		if (sPortalUrl == "" || sPortalUrl == null || sPortalUrl == undefined)
			throw "error";
	}
	catch (ex)
	{
		sPortalUrl = "";
	}
	if (sPortalUrl != "")
	{
		if (StrBegins(sPortalUrl, "ws"))
		{
			sPortalUrl = StrReplaceOne(sPortalUrl, "ws://", "http://");
			sPortalUrl = StrReplaceOne(sPortalUrl, "wss://", "https://");
		}
		oRes.socket_url = UrlSchema(sPortalUrl) + "://" + UrlHost(sPortalUrl);
		oRes.http_socket_url = UrlSchema(sPortalUrl) + "://" + UrlHost(sPortalUrl);
		oRes.ws_socket_url = (UrlSchema(sPortalUrl) == "https" ? "wss://" : "ws://") + UrlHost(sPortalUrl);
		oRes.ws_media_service_url = (UrlSchema(sPortalUrl) == "https" ? "wss://" : "ws://") + UrlHost(sPortalUrl);
		oRes.ws_media_service_is_auth_agnostic = false;
	}
	try
	{
		if (tools.spxml_unibridge.HasValue)
		{
			try
			{
				var oAssembly = tools.get_object_assembly('XHTTPMiddlewareStatic');
				var AuthenticationScheme = "None";
				var host = oRes.ws_socket_url;
				var t_info;
				var a_host = UrlHost(host).split(':');
				var t_host = UrlSchema(host) + "://" + a_host[0];
				var sPort = (ArrayCount(a_host) > 1 ? a_host[1] : (UrlSchema(host) == "wss" ? "443" : "80"));
				var portalHostInfo;
				try
				{
					var sHost = UrlHost(oRes.socket_url ).split(':')[0];
					var arrAuthentications = oAssembly.CallClassStaticMethod('Datex.XHTTP.Context', 'GetAuthenticationConfigurations', [sHost]);
					AuthenticationScheme = String( arrAuthentications[0].Scheme );
				}
				catch (err)
				{
					alert("main_library.js get_socket_url " + err);
				}

				var websocket_info = tools.spxml_unibridge.Object.provider.GetRunningInfo("instance_info", aUIDs, host, AuthenticationScheme, 'WebsocketQueue');
				if (!IsEmptyValue(websocket_info))
				{
					t_info = ParseJson(websocket_info);

					if (t_info.length != 0)
					{
						portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) && This.Value.Port == sPort && This.Value.Scheme == UrlSchema( host ) } catch(e) {alert(e); return false;}");

						if (portalHostInfo == undefined)
						{
							portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) && This.Value.Scheme == UrlSchema( host ) } catch(e) { alert(e); return false;}");
							if (portalHostInfo == undefined)
							{
								portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) } catch(e) {alert(e); return false;}");
								if (portalHostInfo == undefined)
								{
									portalHostInfo = t_info[0]; //first possible host
								}
							}
						}

						oRes.ws_socket_url = portalHostInfo.Value.GetOptProperty("Url");
						oRes.http_socket_url = StrReplace(StrReplace(oRes.ws_socket_url, "wss://", "https://"), "ws://", "http://");
						oRes.socket_url = oRes.http_socket_url;
					}
				}

				var mediaservice_info = tools.spxml_unibridge.Object.provider.GetRunningInfo("instance_info", aUIDs, host, AuthenticationScheme, 'MediaService');
				if (!IsEmptyValue(mediaservice_info))
				{
					t_info = ParseJson(mediaservice_info);

					if (t_info.length != 0)
					{
						portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) && This.Value.Port == sPort && This.Value.Scheme == UrlSchema( host ) } catch(e) {alert(e); return false;}");
						if (portalHostInfo == undefined)
						{
							portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) && This.Value.Scheme == UrlSchema( host ) } catch(e) {alert(e); return false;}");
							if (portalHostInfo == undefined)
							{
								portalHostInfo = ArrayOptFind(t_info, "try { return t_host!='://' && This.Value.Host==UrlHost( t_host ) } catch(e) {alert(e); return false;}");
								if (portalHostInfo == undefined)
								{
									portalHostInfo = t_info[0]; //first possible host
								}
							}
						}
						oRes.ws_media_service_url = portalHostInfo.Value.GetOptProperty("Url");
						oRes.ws_media_service_is_auth_agnostic = portalHostInfo.Value.GetOptProperty("AuthorizationAgnostic",false);
					}
				}
			}
			catch (ex)
			{
				alert(ex);
			}
		}

	}
	catch (err)
	{
		oRes.error = 1;
		oRes.errorText = err;
		return oRes;
	}

	return oRes;
}

/**
 * @typedef {Object} Role
 * @memberof Websoft.WT.Main
 * @property {bigint} id – ID категории.
 * @property {bigint} parent_id – Родительская категория.
 * @property {string} name – Наименование.
*/
/**
 * @typedef {Object} WTRoles
 * @memberof Websoft.WT.Main
 * @property {int} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {Role[]} result – Массив категорий.
*/
/**
 * @function GetRoles
 * @memberof Websoft.WT.Main
 * @description Получение связанного списка (дерева) категорий по объекту или имени каталога и корневой категории.
 * @author BG, AZ
 * @param {string} sSourceParam - имя каталоги или ID объекта каталога.
 * @param {bigint} iRoleIDParam - ID категории, от которой строится набор (root id).
 * @param {boolean} bIncludeSelf - Добавлять в набор также и саму корневую категорию.
 * @param {bigint} iPersonID - Текущий пользователь.
 * @returns {WTRoles}
*/

function GetRoles( sSourceParam, iRoleIDParam, bIncludeSelf, iPersonID )
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = [];

	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		oRes.error = i18n.t( 'peredannekorre_4' );
		oRes.errorText = err;
		return oRes;
	}

	try
	{
		bIncludeSelf = tools_web.is_true(bIncludeSelf);

		var sCatalogName = "";
		var iObjectID = OptInt(sSourceParam);
		if(iObjectID != undefined)
		{
			var docObject = tools.open_doc(iObjectID);
			if(docObject != undefined)
			{
				sCatalogName = docObject.TopElem.Name;
			}
		}
		else if(ArrayOptFind(common.exchange_object_types, "This.name == sSourceParam") != undefined)
		{
			sCatalogName = sSourceParam;
		}

		var iRootRoleID = OptInt(iRoleIDParam, null);
		if(iRootRoleID != null)
		{
			var docRole = tools.open_doc(iRootRoleID);
			if(docRole == undefined)
			{
				iRootRoleID = null;
			}
			else
			{
				if(sCatalogName == "")
				{
					sCatalogName = docRole.TopElem.catalog_name.Value;
				}
				else if(docRole.TopElem.catalog_name.Value != sCatalogName)
				{
					throw StrReplace(StrReplace(i18n.t( 'katalogkornevo' ), "{PARAM1}", docRole.TopElem.catalog_name.Value), "{PARAM2}", sCatalogName);
				}
			}
		}

		oRes.result = ArrayExtract( get_roles( sCatalogName, iRootRoleID, bIncludeSelf, iPersonID ), "({id: This.id.Value, parent_id: (This.id.Value == iRootRoleID ? null : This.parent_role_id.Value), name: This.name.Value, image: ( This.resource_id.HasValue ? tools_web.get_object_source_url( 'resource', This.resource_id.Value ) : '' ), comment: This.comment.Value, desc: This.desc.Value })" );
	}
	catch(err)
	{
		oRes.error = 502;
		oRes.errorText = err;
	}

	return oRes;
}

function get_roles( catalog_name, root_role_id, self_include, iPersonID )
{
	if(root_role_id == null && catalog_name == "")
	{
		return [];
	}
	else if(root_role_id == null && catalog_name != "")
	{
		var sReq = "for $elem in roles where $elem/catalog_name = " + XQueryLiteral(catalog_name) + " return $elem";
	}
	else
	{
		if(self_include)
		{
			var sReq = "for $elem in roles where IsHierChildOrSelf( $elem/id, " + root_role_id + " ) and $elem/catalog_name = " + XQueryLiteral(catalog_name) + " order by $elem/Hier() return $elem"
		}
		else
		{
			var sReq = "for $elem in roles where IsHierChild( $elem/id, " + root_role_id + " ) and $elem/catalog_name = " + XQueryLiteral(catalog_name) + " order by $elem/Hier() return $elem"
		}
	}

	arrRoles = new Array();
	for ( catRole in tools.xquery( sReq ) )
	{
		if ( ! tools_web.check_access( catRole.id, iPersonID ) )
		{
			continue;
		}

		docRole = tools.open_doc( catRole.id );
		if ( docRole != undefined )
		{
			arrRoles.push( docRole.TopElem );
		}
	}

	return arrRoles;
}

/**
 * @typedef {Object} CustomElem
 * @memberof Websoft.WT.Main
 * @property {string} name – Имя.
 * @property {string} value – Значение.
*/
/**
 * @typedef {Object} WTCustomElems
 * @memberof Websoft.WT.Main
 * @property {int} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {CustomElem[]} result – Массив настраиваемых полей.
*/
/**
 * @function GetCustomElems
 * @memberof Websoft.WT.Main
 * @description Получение коллекции настраиваемых полей объекта.
 * @author BG
 * @param {bigint} iObjectIDParam - ID объекта.
 * @returns {WTCustomElems}
*/
function GetCustomElems(iObjectIDParam)
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = [];

	try
	{
		var iObjectID = OptInt(iObjectIDParam);
		if(iObjectID == undefined )
			throw StrReplace(i18n.t( 'nekorrektnyyid_3' ), "{PARAM1}", iObjectIDParam);

		var docObject = tools.open_doc(iObjectID);
		if(docObject == undefined )
			throw StrReplace(i18n.t( 'nenaydenobekts' ), "{PARAM1}", iObjectID);

		var teObject = docObject.TopElem;

		var sCatalogName = teObject.Name;

		if(!teObject.ChildExists("custom_elems"))
		{
			return oRes;
		}

		var curCustomElems = teObject.custom_elems;

		var fldCustomElems = tools.get_custom_template( teObject.Name, null, teObject );
		if( fldCustomElems == null )
		{
			return oRes;
		}
		var fldCurCustomElem, sName, oCustomElem, docFieldObject, iFieldObjectID;
		for(itemCTField in ArraySelectByKey( fldCustomElems.fields, true, 'disp_web' ) )
		{
			if ( ArrayCount( itemCTField.view.conditions ) != 0 )
			{
				bShow_arrCustomFields = SafeEval( tools.create_filter_javascript( itemCTField.view.conditions ), [ { 'fldFieldElem': itemCTField, 'tools': tools, 'curObject': teObject } ] );
				if ( ! bShow_arrCustomFields )
				{
					continue;
				}
			}
			sName = itemCTField.name.Value;
			oCustomElem = {
					id: tools_web.get_md5_id(sName),
					name: sName,
					title: itemCTField.title.Value,
					value: ""
				};

			fldCurCustomElem = curCustomElems.GetOptChildByKey(sName, "name");
			if(fldCurCustomElem != undefined)
			{
				switch(itemCTField.type.Value)
				{
					case "date":
					{
						oCustomElem.value = OptDate(fldCurCustomElem.value.Value);
						if( oCustomElem.value != undefined )
						{
							oCustomElem.value = StrDate( oCustomElem.value, false );
						}
						break;
					}
					case "list":
					{
						sEntries = ArrayMerge(itemCTField.entries, "This.value","##==##");
						listArr = ArraySelect(String(fldCurCustomElem.value.Value).split(";"), "StrContains(sEntries, This)");
						oCustomElem.value = ArrayMerge(listArr, "This", ", ");
						break;
					}
					case "foreign_elem":
					case "file":
					{
						iFieldObjectID = OptInt( fldCurCustomElem.value.Value );
						if( iFieldObjectID != undefined )
						{
							docFieldObject = tools.open_doc( iFieldObjectID );
							if( docFieldObject != undefined )
							{
								sObjectUrl = ( itemCTField.type.Value == "file" ? tools_web.get_object_source_url( 'resource', iFieldObjectID ) : tools_web.get_mode_clean_url( null, iFieldObjectID ) );
								oCustomElem.value =  '<a href="' + sObjectUrl + '">' + RValue( tools.get_disp_name_value( docFieldObject.TopElem ) ) + "</a>"
							}
							else
							{
								oCustomElem.value = "[Object Deleted]";
							}
						}
						break;
						
					}
					default:
						oCustomElem.value = fldCurCustomElem.value.Value;
				}
			}

			oRes.result.push(oCustomElem);
		}

	}
	catch(err)
	{
		oRes.error = 502;
		oRes.errorText = err;
	}
	return oRes;
}

/**
 * @typedef {Object} SetResponseAddParam
 * @property {bigint} cur_user_id – ID текущего пользователя
 * @property {XmElem} cur_user – TopElem текущего пользователя
 * @property {bool} show_comment – сохранять комментарий
*/
/**
 * @function AddResponse
 * @memberof Websoft.WT.Main
 * @description Добавить отзыв на объект.
 * @author BG
 * @param {bigint} iResponseTypeIDParam - ID типа отзыва
 * @param {bigint} iPersonID - ID сотрудника, оставляющего отзыв
 * @param {FormField[]} arrFormFields - Коллекция с полями возврата из формы УД
 * @param {SetResponseAddParam} oAddParam - Параметры выполнения 
 * @returns {WTLPETextResult}
*/
function AddResponse(iResponseTypeIDParam, iPersonID, arrFormFields, oAddParam)
{
	var oRet = tools.get_code_library_result_object();
	oRet.paragraph = "";

	var iResponseTypeID = OptInt(iResponseTypeIDParam)
	if(iResponseTypeID == undefined)
	{
		oRet.error = 501;
		oRet.errorText = i18n.t( 'neukazantipotz' );
		return oRet;
	}
	
	iPersonID = OptInt(iPersonID, null);
	var tePerson = null
	if( iPersonID != null )
	{
		var docPerson = tools.open_doc( iPersonID )
		if(docPerson == undefined)
		{
			oRet.error = 501;
			oRet.errorText = i18n.t( 'nekorrektnyyid_1' );
			return oRet;
		}
		
		tePerson = docPerson.TopElem;
	}
	var curLngWeb = tools_web.get_default_lng_web( tePerson );
	var responseDoc = OpenNewDoc( 'x-local://wtv/wtv_response.xmd' );
	responseDoc.TopElem.response_type_id = iResponseTypeID;
	var responseTypeDoc = tools.open_doc( iResponseTypeID ).TopElem;
	if( ArrayOptFirstElem(arrFormFields) != undefined )
	{
		var oSourceParam = new Object();
		for( _field in arrFormFields )
		{
			if( StrBegins( _field.name, "custom_field_" ) )
			{
				if( IsArray( _field.value ) )
				{
					oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), ArrayMerge( _field.value, "This", ";" ) );
				}
				else
				{
					oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), _field.value );
				}
			}
			else
				oSourceParam.SetProperty( _field.name, _field.value )
		}
		
		var oReturn = tools_web.custom_elems_filling( responseDoc.TopElem, oSourceParam, null, ({ 'sCatalogName': responseDoc.TopElem.Name, 'iObjectID': iResponseTypeID, 'bCheckMandatory': true, 'bCheckCondition': true }) );
		if ( oReturn.error != 0 )
		{
			if ( ArrayCount( oReturn.mandatory_fields ) != 0 )
				sErrorText += StrReplace( i18n.t( 'neobhodimozapo_1' ), '{PARAM1}', ArrayMerge( oReturn.mandatory_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
			if ( ArrayCount( oReturn.condition_fields ) != 0 )
				sErrorText += ' ' + StrReplace( i18n.t( 'nevernyeznachen' ), '{PARAM1}', ArrayMerge( oReturn.condition_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
			oRet.error = 200
			oRet.errorText = "0::" + sErrorText;
			return oRet;
		}
	}

	tools.common_filling( 'response_type', responseDoc.TopElem, iResponseTypeID, responseTypeDoc );

	iSelectedObjectID = OptInt( oSourceParam.GetOptProperty( "selected_object_id" ), null );

	if( tools_web.is_true(oAddParam.GetOptProperty("show_comment")) )
	{
		sComment = oSourceParam.GetOptProperty( "comment", "" );

		responseDoc.TopElem.comment = sComment;
	}

	if ( responseDoc.TopElem.type.HasValue && iSelectedObjectID == null )
	{
		oRet.error = 200
		oRet.errorText = "0::" + i18n.t( 'r4ycn3hwme' );
		return oRet;
	}
	if ( responseDoc.TopElem.type.HasValue )
	{
		teSelectedObject = tools.open_doc( iSelectedObjectID ).TopElem;
		responseDoc.TopElem.object_id = iSelectedObjectID;
		tools.object_filling( responseDoc.TopElem.type, responseDoc.TopElem, iSelectedObjectID, teSelectedObject );
		tools.admin_access_copying( null, responseDoc.TopElem, iSelectedObjectID, teSelectedObject );
	}
	if( iPersonID != null )
	{
		responseDoc.TopElem.person_id = iPersonID;
		tools.common_filling( 'collaborator', responseDoc.TopElem, iPersonID, tePerson );
	}

	responseDoc.BindToDb( DefaultDb );
	responseDoc.Save();

	ms_tools.raise_system_event_env( 'portal_create_response', {
		'iResponseTypeID': iResponseTypeID,
		'teResponseType': responseTypeDoc,
		'curUser': oAddParam.GetOptProperty("cur_user", null),
		'curUserID': oAddParam.GetOptProperty("cur_user_id", null),
		'iResponseID': responseDoc.DocID,
		'teResponse': responseDoc.TopElem
	} );

	oRet.paragraph = i18n.t( 'otzyvuspeshnoso' );
	return oRet;
}

/**
 * @function lp_create_response
 * @deprecated с v.2023.2. В функции реализована интерфейсная часть УД. Код перенесен в файл УД.
*/
function lp_create_response( iResponseTypeID, sCommand, iPersonID, tePerson, SCOPE_WVARS, iObjectID )
{
	var oRes = tools.get_code_library_result_object();
	oRes.action_result = ({});

	try
	{
		iResponseTypeID = Int( iResponseTypeID )
	}
	catch( ex )
	{
		oRes.action_result = { command: "alert", msg: i18n.t( 'nekorrektnyyid_4' ) };
		return oRes;
	}
	try
	{
		if( ObjectType( SCOPE_WVARS ) != "JsObject" )
			throw "";
	}
	catch( ex )
	{
		 SCOPE_WVARS = ({});
	}
	try
	{
		iObjectID = Int( iObjectID );
	}
	catch( ex )
	{
		iObjectID = "";
	}
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		iPersonID = null;
	}
	try
	{
		if( iPersonID != null )
			tePerson.Name;
	}
	catch( ex )
	{
		if( iPersonID != null )
			try
			{
				tePerson = OpenDoc( UrlFromDocID( iPersonID ) ).TopElem;
			}
			catch( ex )
			{
				oRes.action_result = { command: "alert", msg: i18n.t( 'nekorrektnyyid_1' ) };
				return oRes;
			}
		else
			tePerson = null;
	}
	var curLngWeb = tools_web.get_default_lng_web( tePerson );
	var bShowComment = tools_web.is_true( SCOPE_WVARS.GetOptProperty( "bShowComment", false ) )

	switch( sCommand )
	{
		case "eval":
			teResponse = OpenNewDoc( 'x-local://wtv/wtv_response.xmd' ).TopElem;
			teResponseType = OpenDoc( UrlFromDocID( iResponseTypeID ) ).TopElem;
			teResponse.response_type_id = iResponseTypeID;

			oRes.action_result = {
				command: "display_form",
				title: teResponseType.name.Value,
				header: i18n.t( 'zapolnitepolya' ),
				form_fields: [],
				buttons: [
					{ name: "cancel", label: i18n.t( 'otmenit' ), type: "cancel" },
					{ name: "submit", label: "OK", type: "submit" }
				]
			};
						
			if( teResponseType.object_type.HasValue )
			{
				oRes.action_result.form_fields.push( { name: "selected_object_id", label: teResponseType.object_type.ForeignElem.title.Value, type: ( iObjectID != "" ? "hidden" : "foreign_elem" ), catalog_name: teResponseType.object_type.Value, value: iObjectID,  mandatory: true, validation: "nonempty" } );
				if ( iObjectID != "" )
				{
					teSelectedObject = OpenDoc( UrlFromDocID( iObjectID ) ).TopElem;
					teResponse.object_id = iObjectID;
					tools.object_filling( teResponse.type, teResponse, iObjectID, teSelectedObject );
					tools.admin_access_copying( null, teResponse, iObjectID, teSelectedObject );
				}
			}
			if( iPersonID != null )
			{
				teResponse.person_id = iPersonID;
				tools.common_filling( 'collaborator', teResponse, iPersonID, tePerson );
			}
			fldCustomElems = tools.get_custom_template( teResponse.Name, null, teResponse );
			if ( fldCustomElems != null )
			{
				
				for( _field in ArraySelectByKey( fldCustomElems.fields, true, 'disp_web' ) )
				{
					if ( ArrayCount( _field.view.conditions ) != 0 )
					{
						bShow_arrCustomFields = SafeEval( tools.create_filter_javascript( _field.view.conditions ), [ { 'fldFieldElem': _field, 'tools': tools, 'curObject': teResponse } ] );
						if ( ! bShow_arrCustomFields )
							continue;
					}
					obj = { name: "custom_field_" + _field.name.Value, label: _field.title.Value, type: _field.type.Value, value: "", catalog_name: _field.catalog.Value, max_chars: _field.max_chars.Value, mandatory: _field.is_required.Value, validation: ( _field.is_required.Value ? "nonempty" : "" ), entries: [] };
					for( _entr in _field.entries )
						obj.entries.push( { name: _entr.value.Value, value: _entr.value.Value } );
					oRes.action_result.form_fields.push( obj );
				}
			}
			if( bShowComment )
			{
				oRes.action_result.form_fields.push( { name: "comment", label: i18n.t( 'kommentariy' ), type: "text" } );
			}
			break;

		case "submit_form":
			oFormFields = null;
			var form_fields = SCOPE_WVARS.GetOptProperty( "form_fields", "" )
			if ( form_fields != "" )
				oFormFields = ParseJson( form_fields );
			responseDoc = OpenNewDoc( 'x-local://wtv/wtv_response.xmd' );
			response_type_id = Int( iResponseTypeID );
			responseDoc.TopElem.response_type_id = response_type_id;
			responseTypeDoc = OpenDoc( UrlFromDocID( response_type_id ) ).TopElem;
			if( oFormFields != null )
			{
				oSourceParam = new Object();
				for( _field in oFormFields )
					if( StrBegins( _field.name, "custom_field_" ) )
					{
						if( IsArray( _field.value ) )
						{
							oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), ArrayMerge( _field.value, "This", ";" ) );
						}
						else
						{
							oSourceParam.SetProperty( StrReplace( _field.name, "custom_field_", "" ), _field.value );
						}
					}
					else
						oSourceParam.SetProperty( _field.name, _field.value )

				oReturn = tools_web.custom_elems_filling( responseDoc.TopElem, oSourceParam, null, ({ 'sCatalogName': responseDoc.TopElem.Name, 'iObjectID': response_type_id, 'bCheckMandatory': true, 'bCheckCondition': true }) );
				if ( oReturn.error != 0 )
				{
					if ( ArrayCount( oReturn.mandatory_fields ) != 0 )
						sErrorText += StrReplace( i18n.t( 'neobhodimozapo_1' ), '{PARAM1}', ArrayMerge( oReturn.mandatory_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
					if ( ArrayCount( oReturn.condition_fields ) != 0 )
						sErrorText += ' ' + StrReplace( i18n.t( 'nevernyeznachen' ), '{PARAM1}', ArrayMerge( oReturn.condition_fields, 'tools_web.get_cur_lng_name(This.title,curLng.short_id)', '", "' ) );
					oRes.action_result = { command: "alert", msg: sErrorText };
					break;
				}
			}

			tools.common_filling( 'response_type', responseDoc.TopElem, response_type_id, responseTypeDoc );

			iSelectedObjectID = OptInt( oSourceParam.GetOptProperty( "selected_object_id" ), null );

			if( bShowComment )
			{
				sComment = oSourceParam.GetOptProperty( "comment", "" );

				responseDoc.TopElem.comment = sComment;
			}

			if ( responseDoc.TopElem.type.HasValue && iSelectedObjectID == null )
			{
				oRes.action_result = { command: "alert", msg: i18n.t( 'r4ycn3hwme' ) };
				break;
			}
			if ( responseDoc.TopElem.type.HasValue )
			{
				teSelectedObject = OpenDoc( UrlFromDocID( iSelectedObjectID ) ).TopElem;
				responseDoc.TopElem.object_id = iSelectedObjectID;
				tools.object_filling( responseDoc.TopElem.type, responseDoc.TopElem, iSelectedObjectID, teSelectedObject );
				tools.admin_access_copying( null, responseDoc.TopElem, iSelectedObjectID, teSelectedObject );
			}
			if( iPersonID != null )
			{
				responseDoc.TopElem.person_id = iPersonID;
				tools.common_filling( 'collaborator', responseDoc.TopElem, iPersonID, tePerson );
			}

			responseDoc.BindToDb( DefaultDb );
			try
			{
				responseDoc.Save();

				ms_tools.raise_system_event_env( 'portal_create_response', {
					'iResponseTypeID': response_type_id,
					'teResponseType': responseTypeDoc,
					'curUser': SCOPE_WVARS.GetOptProperty("cur_user", null),
					'curUserID': SCOPE_WVARS.GetOptProperty("cur_user_id", null),
					'iResponseID': responseDoc.DocID,
					'teResponse': responseDoc.TopElem
				} );

			}
			catch ( err )
			{
				oRes.action_result = { command: "alert", msg: String( err ) };
				break;
			}

			oRes.action_result = { command: "close_form", msg: i18n.t( 'otzyvuspeshnoso' ), confirm_result: {command: "reload_page"} };
			break;
		default:
			oRes.action_result = { command: "alert", msg: i18n.t( 'neizvestnayakom' ) };
			break;
	}
	return oRes;
}


/**
 * @typedef {Object} RemoteAction
 * @memberof Websoft.WT.Main
 * @property {bigint} id – ID операции.
 * @property {string} operation – код операции.
 * @property {string} name – Наименование операции.
 * @property {bigint} ra_id – ID удаленного действия.
 * @property {string} ra_name – Наименование удаленного действия.
 * @property {string} ra_params – JSON-строка с набором значений параметров УД.
*/
/**
 * @typedef {Object} WTRemoteActions
 * @memberof Websoft.WT.Main
 * @property {int} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {RemoteAction[]} result – Массив операций / Удвленных действий.
*/
/**
 * @function GetRemoteActions
 * @memberof Websoft.WT.Main
 * @description Получение коллекции удаленных действий для сотрудника по объекту.
 * @author BG
 * @param {bigint} iPersonIDParam - ID сотрудника.
 * @param {string} sObjectParam - ID или имя каталога объекта.
 * @param {boolean} bRemoteActionOnly - Возвращать только удаленные действия (default - true).
 * @returns {WTRemoteActions}
*/
function GetRemoteActions(iPersonIDParam, sObjectParam, bRemoteActionOnly)
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = [];

	try
	{
		var xarrOperations = get_operation_by_person(iPersonIDParam, sObjectParam)

		bRemoteActionOnly = (bRemoteActionOnly != null && bRemoteActionOnly != undefined && bRemoteActionOnly != "") ? tools_web.is_true(bRemoteActionOnly) : true;

		var oCastOperation, docRemoteAction, docOperation, oRAParams, sRAName, curParams;
		var iCurObjectID = OptInt(sObjectParam);
		for(itemOperation in xarrOperations)
		{
			if(tools_web.is_true(itemOperation.operation_type.Value))
				continue;
			if(!itemOperation.remote_action_id.HasValue && bRemoteActionOnly)
				continue;
			oRAParams = {};
			sRAName = "";
			if(itemOperation.remote_action_id.HasValue)
			{
				docRemoteAction = tools.open_doc(itemOperation.remote_action_id.Value);
				docOperation = tools.open_doc(itemOperation.id.Value);
				curParams = {};
				if(docRemoteAction != undefined)
				{
					sRAName = docRemoteAction.TopElem.name.Value;
					tools_web.set_override_web_params(curParams, docRemoteAction.TopElem);
					tools_web.set_override_web_params(curParams, docOperation.TopElem);
					for(fldVWarElem in docRemoteAction.TopElem.wvars)
					{
						oRAParams.SetProperty( fldVWarElem.name.Value, {name: fldVWarElem.name.Value, type: fldVWarElem.type.Value, value: curParams.GetOptProperty(fldVWarElem.name.Value)});
					}

					if(iCurObjectID != undefined)
					{
						oRAParams.SetProperty( "iCurObjectID", {name: "iCurObjectID", type: "foreign_elem", value: iCurObjectID});
					}
				}
			}

			oCastOperation = {
				id: itemOperation.id.Value,
				name: itemOperation.name.Value,
				operation: itemOperation.action.Value,
				ra_id: itemOperation.remote_action_id.Value,
				ra_name: sRAName,
				ra_params: EncodeJson(oRAParams)
			};

			oRes.result.push(oCastOperation);
		}
	}
	catch(err)
	{
		oRes.error = 502;
		oRes.errorText = err;
	}
	return oRes;
}

/**
 * @typedef {Object} ActionRule
 * @memberof Websoft.WT.Main
 * @property {bigint} id – ID права.
 * @property {string} rule – код права.
 * @property {string} name – Наименование права.
*/
/**
 * @typedef {Object} WTActionRules
 * @memberof Websoft.WT.Main
 * @property {int} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {ActionRule[]} result – Массив прав действий.
*/
/**
 * @function GetActionRules
 * @memberof Websoft.WT.Main
 * @description Получение коллекции прав действий для сотрудника по объекту.
 * @author BG
 * @param {bigint} iPersonIDParam - ID сотрудника.
 * @param {bigint} sObjectParam - ID или имя каталога объекта.
 * @returns {WTActionRules}
*/
function GetActionRules(iPersonIDParam, sObjectParam)
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = [];
	try
	{
		var xarrOperations = get_operation_by_person(iPersonIDParam, sObjectParam)

		var oCastOperation
		for(itemOperation in xarrOperations)
		{
			if(!tools_web.is_true(itemOperation.operation_type.Value))
				continue;

			oCastOperation = {
				id: itemOperation.id.Value,
				name: itemOperation.name.Value,
				rule: (itemOperation.action.HasValue ? itemOperation.action.Value : itemOperation.code.Value),
			};

			oRes.result.push(oCastOperation);
		}
	}
	catch(err)
	{
		oRes.error = 502;
		oRes.errorText = err;
	}
	return oRes;
}

function get_operation_by_person(person_id, object_param)
{
	var iObjectID;
	var sCatalogName = null
	try
	{
		iObjectID = Int(object_param);
		var docObject = tools.open_doc(iObjectID);
		if(docObject == undefined )
			throw "doc crash";
		sCatalogName = docObject.TopElem.Name;
	}
	catch(e)
	{
		iObjectID = null;
		if(ObjectType(object_param) == 'JsObject' && object_param.HasProperty('type'))
		{
			sCatalogName = object_param.GetProperty('type');
			iObjectID = object_param.GetProperty('id');
		}
		else
		{
			sCatalogName = (object_param == "") ? "#empty#" : object_param;
		}
	}

	var iPersonID = OptInt(person_id);
	if(iPersonID == undefined)
		throw StrReplace(i18n.t( 'argumentneyavlya' ), "{PARAM1}", person_id);
	
	if(sCatalogName == "boss_type")
	{
		var xarrBossTypes = QueryCatalogByKeys( 'boss_types', 'id', [iObjectID]);;
	}
	else if(iObjectID == null)
	{
		var arrManagers = XQuery( 'for $elem in func_managers where $elem/person_id = ' + iPersonID + ' order by $elem/catalog return $elem' );
		if(StrContains("career_reserve_type,key_position,personnel_reserve,recruitment_plan", sCatalogName))
		{
			arrManagers = ArrayUnion(arrManagers, XQuery( 'for $elem in talent_pool_func_managers where $elem/person_id = ' + iPersonID + ' order by $elem/catalog return $elem' ))
		}
		var xarrBossTypes = QueryCatalogByKeys( 'boss_types', 'id', ArrayExtract( arrManagers, 'boss_type_id' ));
		xarrBossTypes = ArraySelectDistinct(xarrBossTypes, 'id');
	}
	else
	{
		var xarrBossTypes = tools.get_object_relative_boss_types(iPersonID, iObjectID);
	}

	var xarrOperation = tools.get_relative_operations_by_boss_types(xarrBossTypes, (sCatalogName == "boss_type" ? "collaborator" : sCatalogName));
	if ( ArrayOptFind( xarrOperation, "This.use_access_eval" ) != undefined )
	{
		for ( catActionElem in xarrOperation )
		{
			if ( catActionElem.use_access_eval )
            {
                teOperation = OpenDoc( UrlFromDocID( catActionElem.id ) ).TopElem;
				try
				{
					if ( ! tools.safe_execution( teOperation.access_eval_code ) )
					{
						catActionElem.id = 0;
					}
				}
				catch( _formula_error_ )
				{
					catActionElem.id = 0;
					alert( "Error in visble formula on operation id = " + teOperation.id + " : " + _formula_error_ );
				}
            }
		}
		xarrOperation = ArraySelect( xarrOperation, "This.id > 0" );
	}
	return ArraySort(ArraySelectDistinct(xarrOperation, 'id'), "This.priority", "+", "This.name", "+") ;
}

function main_socket( Request, Response, Session, sAction, sWebsocketID )
{
	/*
		функция обрабатывает запрос в вебсокет
		Request		- Объект Request
		Response	- Объект Response
		Session		- Объект сессии
		sAction		- Объект с параметрами запроса
		sWebsocketID	- ID сокета
	*/

	try{
		if( Session == null || Session == undefined || Session == '' )
			throw 'not session'
	}
	catch( ex )
	{
		Session = Request.Session;
	}

	var curUser, curUserID, curLngWeb, curLng;
	var oUserInit = tools_web.user_init( Request, ( {} ) );
	//Server.Execute( AppDirectoryPath() + '/wt/web/include/access_init.html' );

	if (!oUserInit.access)
	{
		if (oUserInit.error_code == 'empty_login' && Response != null )
		{
			Response.SetWrongAuth();
		}
		else
		{
			Request.SetRespStatus(403, 'Forbidden');
		}

		return;
	}
	else
	{
		Session = Request.Session;
		curUserID = Session.Env.curUserID;
		curUser = Session.Env.curUser;
		curLngWeb = tools_web.get_default_lng_web( curUser );
	}

	function set_error( text_error )
	{
		oRes.error = 1;
		oAnswer.error = 1;
		oAnswer.message = String( text_error );
		throw '!!!';
	}

	function get_object( id )
	{
		id = OptInt( id );
		gr = ArrayOptFind( arrObjectDoc, 'This.id == ' + id );
		if( gr == undefined )
		{
			gr = new Object();
			gr.id = id;
			gr.doc = OpenDoc( UrlFromDocID( id ) );
			arrObjectDoc.push( gr );
		}
		return gr;
	}
	try
	{
		if( sAction == null || sAction == undefined || sAction == '' )
			throw 'error';
	}
	catch( ex )
	{
		if( Request.QueryString.GetOptProperty( 'action' ) != undefined )
			sAction = tools.read_object( UrlDecode( Request.QueryString.GetOptProperty( 'action', '{}' ) ) );
		else
			sAction = Request.Form;
	}

	arrObjectDoc = new Array();
	var oRes = new Object();
	oRes.error = 0;

	oAnswer = new Object();
	try
	{
		switch( sAction.socket_action )
		{
			case 'init_socket':
				switch( sAction.socket_type )
				{
					default:
						var xHttpStaticAssembly = tools.get_object_assembly( 'XHTTPMiddlewareStatic' );
						var context = xHttpStaticAssembly.CallClassStaticMethod( 'Datex.XHTTP.WebSocketContext', 'CurrentWebSocketContext');
						var oTag = new Object();
						oTag.user_id = String( Int( curUserID ) );
						oTag.socket_type = sAction.socket_type;
						oTag.pong = "1";
						try
						{
							if( IsArray( sAction.GetOptProperty( "socket_tags" ) ) )
							{
								for( _tag in sAction.GetOptProperty( "socket_tags" ) )
								{
									oTag.SetProperty( _tag.name, _tag.value )
								}
							}
						}
						catch( err )
						{
						}
						
						context.WebSocketCurrent.SetTagsFromJson( EncodeJson( oTag ) );
						break;
				}
				break;
			case "close_socket":
				break;
			case "call_method":
				sLibrary = sAction.GetOptProperty( "library", "" );
				sMethod = sAction.GetOptProperty( "method", "" );
				switch( sAction.socket_type )
				{
					default:
						oAnswer = tools.call_code_library_method( sLibrary, sMethod, [ curUserID, sWebsocketID, sAction ] )
						break;
				}
				break;
			default:
				switch( sAction.socket_type )
				{
					case "chat_conversations":
						oAnswer = tools.call_code_library_method( 'libChat', 'conversation_api', [ Request, null, true, Session, sAction, sWebsocketID ] )
						break;
					case "proctoring":
						oAnswer = tools.call_code_library_method( 'libProctor', 'proctor_api', [ Request, null, Session, sAction, sWebsocketID ] )
						break;
				}

				break;
		}
		oAnswer.socket_action = sAction.socket_action;
		oAnswer.socket_type = sAction.socket_type;
		oAnswer.uid = sAction.GetOptProperty( 'uid', "" );
		oRes.SetProperty( "socket_object", oAnswer );
	}
	catch( ex )
	{
		if( !StrBegins( ex, '!!!' ) )
		{
			alert( 'main_socket' + ex )
			oRes.error = 1;
			oRes.message = String( ex );
		}
	}

	return oRes;
}

/**
 * @function GivePersonFeedback
 * @memberof Websoft.WT.Main
 * @description Дать обратную связь сотруднику.
 * @author BG
 * @param {bigint} iPersonID - ID сотрудника, получающего обратную связь.
 * @param {number} iPoints - Размер благодарности.
 * @param {bigint} iCompetence - Компетенция сотрудника, по которой дается обратная связь
 * @param {string} sComment - Комментарий к благодарности.
 * @param {string} sCurrency - Валюта, в которой выражается благодарность. i18n.t( 'spasibo' ) по умолчанию.
 * @param {boolean} bScoresWithoutDebiting - Только начислять баллы, без списания. Для валюты i18n.t( 'spasibo' ) не учитывается
 * @returns {WTLPETextResult}
*/
/* copy to @component employee_management  */
function GivePersonFeedback(iPersonID, iPoints, iCompetence, sComment, sCurrency, bScoresWithoutDebiting )
{
	var oRet = tools.get_code_library_result_object();
	oRet.paragraph = "alert";
	
	iPersonID = OptInt(iPersonID);
	if(iPersonID == undefined)
	{
		oRet.error = 1;
		oRet.errorText = i18n.t( 'neukazansotrud' );
		return oRet;
	}

	iPoints = OptInt(iPoints);
	if(iPoints == undefined)
	{
		oRet.error = 1;
		oRet.errorText = i18n.t( 'neukazanrazmer' );
		return oRet;
	}
	
	iCompetence = OptInt(iCompetence);
	if(iCompetence == undefined)
		iCompetence = null;
	
	if(IsEmptyValue(sComment))
		sComment = "";
	
	if(IsEmptyValue(sCurrency))
		sCurrency = "thanks";
	
	var sType = ( sCurrency == "thanks" ) ? "thanks" : "score";
	var arrTransactions = [];

	var iCurUserID = CurRequest.Session.Env.GetOptProperty( "curUserID" );

	var docTransaction = null;
	var doBalance = false;
	switch( sType )
	{
		case "score":
			
			sSQL = "for $elem in accounts where MatchSome($elem/object_id, (" + XQueryLiteral(OptInt(iCurUserID)) + ")) and MatchSome($elem/currency_type_id, (" + XQueryLiteral(sCurrency) + ")) and $elem/status = 'active' return $elem/Fields('balance')"
			iBalanceCurUser = ArrayOptFirstElem(ArrayExtract(tools.xquery(sSQL), "This.balance.Value"));
			
			var bBalanceCurUserGreaterZero = false
			var bBalanceCurUserGreaterBalancePoints = false

			if(iBalanceCurUser != undefined)
			{	
				bBalanceCurUserGreaterZero = (OptInt(iBalanceCurUser) > 0);
				bBalanceCurUserGreaterBalancePoints = ((OptInt(iBalanceCurUser) - OptInt(iPoints)) >= 0);
				doBalance = bBalanceCurUserGreaterZero && bBalanceCurUserGreaterBalancePoints;
				if(doBalance)
				{
					if(bScoresWithoutDebiting == false){
						arrTransactions.push({
							'iPersonID': iCurUserID,
							'sCurrencyType': sCurrency,
							'iAmount': ( 0 - iPoints ),
							'sComment': sComment,
							'iObjectID': iCompetence,
							'iTransactionPersonID': iPersonID,
							'changeBalance': true,
							'sCode': tools.random_string( 10 )
						});
					}
					
					arrTransactions.push({
						'iPersonID': iPersonID,
						'sCurrencyType': sCurrency,
						'iAmount': iPoints,
						'sComment': sComment,
						'iObjectID': iCompetence,
						'iTransactionPersonID': iCurUserID,
						'changeBalance': true,
						'sCode': tools.random_string( 10 )
					});
				}
			}
			break;
		case "thanks":
			arrTransactions.push({
				'iPersonID': iPersonID,
				'sCurrencyType': sCurrency,
				'iAmount': iPoints,
				'sComment': sComment,
				'iObjectID': null,
				'iTransactionPersonID': iCurUserID,
				'changeBalance': true,
				'sCode': 'thanks_' + tools.random_string( 10 )
			});
			break;
	}
	
	for ( oTransaction in arrTransactions )
	{
		docTransaction = tools.pay_new_transaction_by_object( oTransaction.iPersonID, oTransaction.sCurrencyType, oTransaction.iAmount, oTransaction.sComment, oTransaction.iObjectID, oTransaction.iTransactionPersonID, oTransaction.changeBalance );

		docTransaction.TopElem.code = oTransaction.GetOptProperty( 'sCode', '' );

		docTransaction.Save(); 
	}

	if ( sType == "thanks" )
	{
		ms_tools.raise_system_event_env('portal_thanks_game_dialog', {
			'iPersonID': iPersonID,
			'sTransactionType': sType,
			'sBonusCurrencyType': sCurrency,
			'sThanksCurrencyType': sCurrency,
			'iScoreAmount': iPoints,
			'sComment': sComment,
			'curObjectID': null,
			'curUserID': iCurUserID,
		});
	}

	if ( docTransaction != null )
	{
		oRet.errorText = i18n.t( 'vashaobratnayasv' );
		oRet.paragraph = "close_form";
	}
	else
	{
		oRet.error = 1;
		oRet.errorText = (sType != "thanks" && !doBalance) ? i18n.t( 'nehvatkaballov' ) : i18n.t( 'neudalospereda' ) ;
		oRet.paragraph = "alert";
	}

	return oRet;
}

/**
 * @function lp_person_feedback
 * @deprecated с v.2023.2. В функции реализована интерфейсная часть УД. Код перенесен в файл УД.
*/
function lp_person_feedback(sCommand, sFormFields, iPersonID, iAmntPoints, sCompetence, sText, sCurrency, iCompetenceProfileID, curUserID, bScoresWithoutDebiting)
{
	var oRet = tools.get_code_library_result_object();
	oRet.result = {};

	if(sText == null || sText == undefined)
		sText = "";

	if ( sCommand == "eval" )
	{
		sCondition = "";
		aCurrencies = [];
		for ( currency in lists.currency_types )
		{
			obj = new Object;
			obj.name = currency.name.Value;
			obj.value = currency.id.Value;
			aCurrencies.push( obj );
		}
		if ( ( iProfileCompetence = OptInt( iCompetenceProfileID ) ) != undefined )
		{
			dCptncProfile = tools.open_doc( iProfileCompetence )
			if ( dCptncProfile != undefined )
			{
				teCptncProfile = dCptncProfile.TopElem;
				sCondition = "";
				if ( teCptncProfile.competences.ChildNum > 0 ) {
					sCondition = "and MatchSome( $elem/id, ("+ ArrayMerge( ArrayExtractKeys( teCptncProfile.competences, "competence_id" ), "This", "," ) +") )"
				}
			}
		}
		xarrCompetences = XQuery( "for $elem in competences where $elem/name != null() and $elem/name != '' "+ sCondition +" return $elem" );
		aCompetences = [];
		for ( competence in xarrCompetences )
		{
			obj = new Object;
			obj.name = competence.name.Value;
			obj.value = competence.id.Value;
			aCompetences.push( obj );
		}
		aPoints = [];
		for ( i = 1; i <= OptInt( iAmntPoints, 10 ); i++ )
		{
			obj = new Object;
			obj.name = String(i);
			obj.value = String(i);
			aPoints.push( obj );
		}
		oRet.result = {
			command: "display_form",
			title: i18n.t( 'ocenkasotrudni' ),
			message: "",
			form_fields: [],
			buttons:
			[
				{ name: "submit", label: "OK", type: "submit" },
				{ name: "cancel", label: i18n.t( 'otmenit' ), type: "cancel"}
			],
			no_buttons: false
		};

		oRet.result.form_fields.push({ name: "currency", type: "hidden", value: sCurrency });

		if(sCurrency == "thanks")
		{
			oRet.result.form_fields.push({ name: "score", type: "hidden", value: 1 });
		}
		else
		{
			oRet.result.form_fields.push({ name: "competence_profile", type: "hidden", value: iCompetenceProfileID });
			oRet.result.form_fields.push({ name: "competence", label: i18n.t( 'kompetenciya' ), type: "select", value: sCompetence, mandatory: true, entries: aCompetences, validation: "nonempty" });
			oRet.result.form_fields.push({ name: "score", label: i18n.t( 'ocenka' ), type: "select", value: 1, mandatory: true, entries: aPoints, validation: "nonempty" });
		}

		oRet.result.form_fields.push({ name: "comment", label: i18n.t( 'kommentariy' ), type: "text", value: sText, mandatory: true, validation: "nonempty" });

	}

	if ( sCommand == "submit_form" )
	{
		sMsg = "[lp_person_feedback] - error: ";
		sRetCommand = "alert";
		oFormFields = ( sFormFields != "" ) ? oFormFields = ParseJson( sFormFields ) : undefined;

		if ( oFormFields != undefined )
		{

			sCurrency           = ArrayOptFindByKey( oFormFields, "currency", "name" ).value;
			iPoints             = OptInt( ArrayOptFindByKey( oFormFields, "score", "name" ).value, 0 );
			sComment            = ArrayOptFindByKey( oFormFields, "comment", "name" ).value;
			sType               = ( sCurrency == "thanks" ) ? "thanks" : "score";
			arrTransactions     = [];

			switch( sType )
			{
				case "score":
					iCompetence = OptInt( ArrayOptFindByKey( oFormFields, "competence", "name" ).value );
					
					if(bScoresWithoutDebiting == false){
						arrTransactions.push({
							'iPersonID': curUserID,
							'sCurrencyType': sCurrency,
							'iAmount': ( 0 - iPoints ),
							'sComment': sComment,
							'iObjectID': iCompetence,
							'iTransactionPersonID': iPersonID,
							'changeBalance': true,
							'sCode': tools.random_string( 10 )
						});
					}
					
					arrTransactions.push({
						'iPersonID': iPersonID,
						'sCurrencyType': sCurrency,
						'iAmount': iPoints,
						'sComment': sComment,
						'iObjectID': iCompetence,
						'iTransactionPersonID': curUserID,
						'changeBalance': true,
						'sCode': tools.random_string( 10 )
					});
					break;
				case "thanks":
					arrTransactions.push({
						'iPersonID': iPersonID,
						'sCurrencyType': sCurrency,
						'iAmount': iPoints,
						'sComment': sComment,
						'iObjectID': null,
						'iTransactionPersonID': curUserID,
						'changeBalance': true,
						'sCode': 'thanks_' + tools.random_string( 10 )
					});
					break;
			}

			sSQL = "for $elem in accounts where MatchSome($elem/object_id, (" + XQueryLiteral(curUserID) + ")) and MatchSome($elem/currency_type_id, (" + XQueryLiteral(sCurrency) + ")) and $elem/status = 'active' return $elem/Fields('balance')"
			iBalanceCurUser = ArrayOptFirstElem(ArrayExtract(tools.xquery(sSQL), "This.balance.Value"));
			
			docTransaction = null;
			bBalanceCurUserGreaterZero = false
			bBalanceCurUserGreaterBalancePoints = false

			if(iBalanceCurUser != undefined){
				
				bBalanceCurUserGreaterZero = (OptInt(iBalanceCurUser) > 0);
				bBalanceCurUserGreaterBalancePoints = ((OptInt(iBalanceCurUser) - OptInt(iPoints)) >= 0);
				
				if(bBalanceCurUserGreaterZero && bBalanceCurUserGreaterBalancePoints){

					for ( oTransaction in arrTransactions )
					{
						docTransaction = tools.pay_new_transaction_by_object( oTransaction.iPersonID, oTransaction.sCurrencyType, oTransaction.iAmount, oTransaction.sComment, oTransaction.iObjectID, oTransaction.iTransactionPersonID, oTransaction.changeBalance );
						
						docTransaction.TopElem.code = oTransaction.GetOptProperty( 'sCode', '' );

						docTransaction.Save(); 
					}

				}
			}

			
			if ( sType == "thanks" )
			{
				ms_tools.raise_system_event_env('portal_thanks_game_dialog', {
					'iPersonID': iPersonID,
					'sTransactionType': sType,
					'sBonusCurrencyType': sCurrency,
					'sThanksCurrencyType': sCurrency,
					'iScoreAmount': iPoints,
					'sComment': sComment,
					'curObjectID': null,
					// 'curObject': curObject,
					'curUserID': curUserID,
					//'curUser': curUser
				});
			}

			if ( docTransaction != null )
			{
				sCode = tools.random_string( 10 );
				//docTransaction.Save();
				sMsg = i18n.t( 'vashaobratnayasv' );
				sRetCommand = "close_form";
			}
			else
			{
				if(bBalanceCurUserGreaterZero && bBalanceCurUserGreaterBalancePoints){
					sMsg = i18n.t( 'nehvatkaballov' )
				} else {
					sMsg = i18n.t( 'neudalospereda' )
				}
			}

			oRet.result = {
				command: sRetCommand,
				msg: sMsg
			};
		}
	}

	return oRet;
}

/* copy to @component employee_management  */
function lp_congrats_birthday(sCommand, sFormFields, iPersonID, sText, curUserID)
{
	var oRet = tools.get_code_library_result_object();
	oRet.result = {};

	if(sText == null || sText == undefined)
		sText = "";

	sNameColl = ArrayOptFirstElem(tools.xquery("for $elem in collaborators where $elem/id = " + iPersonID + " return $elem"))

	if ( sCommand == "eval" )
	{
		oRet.result = {
			command: "display_form",
			title: i18n.t( 'pozravit' ),
			message: i18n.t( 'sotrudnik' ) + sNameColl.fullname ,
			form_fields:
			[
				{ name: "fld4", label: i18n.t( 'tekstpozdravle' ), type: "text", value: sText, mandatory: true, validation: "nonempty" }
			],
			buttons:
			[
				{ name: "submit", label: "OK", type: "submit" },
				{ name: "cancel", label: i18n.t( 'otmenit' ), type: "cancel"}
			],
			no_buttons: false
		};
	}

	if ( sCommand == "submit_form" )
	{
		sMsg = "[lp_congrats_birthday] - error: ";
		sCommand = "alert";
		oFormFields = ( sFormFields != "" ) ? oFormFields = ParseJson( sFormFields ) : undefined;

		if ( oFormFields != undefined )
		{
			sCongratsText = ( ArrayOptFirstElem( oFormFields ) != undefined ) ? ArrayOptFirstElem( oFormFields ).value : "";
			// iBirthdayBoy = ParseJson( _ITEM_ ).id;

			iPersonID = OptInt(iPersonID);
			dBirthdayPerson = tools.open_doc( iPersonID );
			if ( dBirthdayPerson != undefined )
			{
				teBirthdayPerson = dBirthdayPerson.TopElem;
				if ( sCongratsText != "" && iPersonID != undefined )
				{
					bSend = tools.create_notification( "congrats_birthday", iPersonID, sCongratsText, curUserID, teBirthdayPerson );
					sMsg = i18n.t( 'vashepozdravlen' );
					sCommand = "close_form";
				}
				else
				{
					sMsg += i18n.t( 'neudalosotprav' )
				}
			}
			else
			{
				sMsg += i18n.t( 'neudalosotkryt' )
			}

			oRet.result = {
				command: sCommand,
				msg: sMsg
			};
		}
	}

	return oRet;
}

/**
 * @typedef {Object} PersonLearningContext
 * @property {number} percent_mandatory_course – % обязательного обучения курсов.
 * @property {number} percent_success_course – % успешности курсов.
 * @property {number} percent_mandatory_test – % обязательного обучения тестов.
 * @property {number} percent_success_test – % успешности тестов.
 * @property {number} learning_course – Всего изучено/закончено курсов.
 * @property {number} learning_test – Всего изучено/закончено тестов.
 * @property {number} youself_course – По собственной инициативе курсов.
 * @property {number} youself_test – По собственной инициативе тестов.
 * @property {number} active_course – В процессе курсов.
 * @property {number} active_test – В процессе тестов.
 * @property {number} mandatory_active_course – Количество незаконченных обязательных курсов.
 * @property {number} mandatory_active_test – Количество незаконченных обязательных тестов.
 * @property {number} percent_not_learning_recommender_course – Процент не изученных рекомендованных курсов.
 * @property {number} finish_event – Пройденные мероприятия.
 * @property {number} percent_assist_event – % посещения мероприятий.
 * @property {number} visiting_hours – Часы посещения.
 * @property {number} future_event – Текущие мероприятия.
 *
 * @property {number} overdue_learning_course – Количество просроченного обучения курсов.
 * @property {number} overdue_learning_test – Количество просроченного обучения тестов.
 * @property {number} overdue_learning – Количество просроченного обучения курсов/тестов.
 *
 * @property {number} percent_overdue_learning_course – Процент просроченного обучения для завершенных курсов.
 * @property {number} percent_overdue_learning_test – Процент просроченного обучения для завершенных тестов.
 * @property {number} percent_overdue_learning – Процент просроченного обучения для завершенных курсов/тестов.
 *
 * @property {number} percent_average_score_course – Средний процент набранных баллов по завершенному обучению курсов.
 * @property {number} percent_average_score_test – Средний процент набранных баллов по завершенному обучению тестов.
 * @property {number} percent_average_score – Средний процент набранных баллов по завершенному обучению курсов/тестов.
 *
 * @property {number} percent_complete_mandatory_course – Процент завершения обязательного обучения курсов.
 * @property {number} percent_complete_mandatory_test – Процент завершения обязательного обучения тестов.
 * @property {number} percent_complete_mandatory – Процент завершения обязательного обучения курсов/тестов.
 *
 * @property {number} percent_success_complete_mandatory_course – Процент успешно завершенного обязательного обучения - от общего числа завершенного обязательного обучения курсов.
 * @property {number} percent_success_complete_mandatory_test – Процент успешно завершенного обязательного обучения - от общего числа завершенного обязательного обучения тестов.
 * @property {number} percent_success_complete_mandatory – Процент успешно завершенного обязательного обучения - от общего числа завершенного обязательного обучения курсов/тестов.
 *
 * @property {number} percent_average_score_mandatory_course – Средний процент набранных баллов по обязательному обучению курсов.
 * @property {number} percent_average_score_mandatory_test – Средний процент набранных баллов по обязательному обучению тестов.
 * @property {number} percent_average_score_mandatory – Средний процент набранных баллов по обязательному обучению курсов/тестов.
 *
 * @property {number} overdue_learning_mandatory_course – Количество просроченных сессий обязательного обучения курсов.
 * @property {number} overdue_learning_mandatory_test – Количество просроченных сессий обязательного обучения тестов.
 * @property {number} overdue_learning_mandatory – Количество просроченных сессий обязательного обучения курсов/тестов.
 *
 * @property {date} max_last_usage_date_course – Время последней учебной активности курсов (максимальное значение поля last_usage_date для активного и завершенного обучения).
 * @property {date} max_last_usage_date_test – Время последней учебной активности тестов (максимальное значение поля last_usage_date для активного и завершенного обучения).
 * @property {date} max_last_usage_date – Время последней учебной активности курсов/тестов (максимальное значение поля last_usage_date для активного и завершенного обучения).
 *
 * @property {date} max_start_usage_date_course – Дата последнего назначения обучения курсов (максимальное значение поля start_usage_date для активного и завершенного обучения).
 * @property {date} max_start_usage_date_test – Дата последнего назначения обучения тестов (максимальное значение поля start_usage_date для активного и завершенного обучения).
 * @property {date} max_start_usage_date – Дата последнего назначения обучения курсов/тестов (максимальное значение поля start_usage_date для активного и завершенного обучения).
 *
 * @property {number} time_average_course – Среднее время, затрачиваемое на обучение курсов, в неделю - сумму всех значений по полю time разделить на число дней между минимальной датой start_learning_date и максимальной датой last_usage_date.
 * @property {number} time_average_test – Среднее время, затрачиваемое на обучение тестов, в неделю - сумму всех значений по полю time разделить на число дней между минимальной датой start_learning_date и максимальной датой last_usage_date.
 * @property {number} time_average – Среднее время, затрачиваемое на обучение курсов/тестов, в неделю - сумму всех значений по полю time разделить на число дней между минимальной датой start_learning_date и максимальной датой last_usage_date.
 *
 * @property {number} response_count_course – Количество заполненных анкет обратной связи курсов.
 * @property {number} response_count_test – Количество заполненных анкет обратной связи тестов.
 * @property {number} response_count – Количество заполненных анкет обратной связи курсов/тестов.
*/
/**
 * @typedef {Object} ReturnPersonLearningContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {PersonLearningContext} context – Контекст моих отпусков.
*/
/**
 * @function GetPersonLearningContext
 * @memberof Websoft.WT.Main
 * @author PL
 * @description Получение контекста сотрудника по обучению.
 * @param {bigint} iUserID - ID сотрудника.
 * @param {bigint} iCurUserID - ID пользователя для поддержки ролевой модели.
 * @param {string} sAppCode - Код приложения для поддержки ролевой модели.
 * @returns {ReturnPersonLearningContext}
*/
function GetPersonLearningContext( iUserID, iCurUserID, sAppCode )
{
	var oRes = tools.get_code_library_result_object();
	oRes.context = new Object;

	try
	{
		iUserID = Int( iUserID );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
	}

	try
	{
		if (iCurUserID == null || iCurUserID == undefined || iCurUserID == "")
			throw ''
	}
	catch ( err )
	{
		iCurUserID = 0;
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

	function get_percent_mandatory_course()
	{
		iCount = ArrayCount( xarrActiveLearningsMandatory ) + ArrayCount( xarrLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveLearnings ) + ArrayCount( xarrLearnings ) );
	}
	function get_percent_active_mandatory_course()
	{
		iCount = ArrayCount( xarrActiveLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveLearnings ) );
	}
	function get_percent_active_mandatory_test()
	{
		iCount = ArrayCount( xarrActiveTestLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveTestLearnings ) );
	}
	function get_percent_mandatory_test()
	{
		iCount = ArrayCount( xarrActiveTestLearningsMandatory ) + ArrayCount( xarrTestLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveTestLearnings ) + ArrayCount( xarrTestLearnings ) );
	}
	function get_percent_success_course()
	{
		if( ArrayOptFirstElem( xarrLearnings ) == undefined )
		{
			return 0;
		}
		return ( ArrayCount( xarrSuccessLearnings ) * 100 ) / ArrayCount( xarrLearnings );
	}
	function get_percent_success_test()
	{
		if( ArrayOptFirstElem( xarrTestLearnings ) == undefined )
		{
			return 0;
		}
		return ( ArrayCount( xarrSuccessTestLearnings ) * 100 ) / ArrayCount( xarrTestLearnings );
	}

	function get_percent_not_learning_recommender_course()
	{
		xarrUserRecommenders = XQuery( "for $elem in user_recommendations where $elem/object_id = " + iUserID + " return $elem" );
		arrUserRecommenders = new Array();
		for( _user_recommender in xarrUserRecommenders )
		{
			docUserRecommender = tools.open_doc( _user_recommender.id );
			if( docUserRecommender == undefined )
			{
				continue;
			}
			arrUserRecommenders = ArrayUnion( arrUserRecommenders, ArrayExtract( ArraySelect( docUserRecommender.TopElem.objects, "This.object_type == 'course' && This.object_id.HasValue" ), "This.object_id" ) );
		}
		if( ArrayOptFirstElem( arrUserRecommenders ) == undefined )
		{
			return 0;
		}
		return ( 100 - ( ( ArrayCount( ArrayIntersect( xarrSuccessLearnings, arrUserRecommenders, "This.course_id", "This" ) ) * 100 ) / ArrayCount( arrUserRecommenders ) ) );
	}
	function get_percent_assist_event()
	{
		if( ArrayOptFirstElem( xarrFinishEventResults ) == undefined )
		{
			return 0;
		}
		return ( ArrayCount( ArraySelect( xarrFinishEventResults, "This.is_assist" ) ) * 100 ) / ArrayCount( xarrFinishEventResults );
	}
	function get_visiting_hours()
	{
		if( ArrayOptFirstElem( xarrFinishEventResults ) == undefined )
		{
			return 0;
		}
		xarrVisitingFinishEventCollaborators = ArrayIntersect( xarrFinishEventCollaborators, ArraySelect( xarrFinishEventResults, "This.is_assist" ), "This.event_id", "This.event_id" );
		return ArraySum( ArraySelectDistinct( xarrVisitingFinishEventCollaborators, "This.event_id" ), "This.duration_fact" );
	}


	function get_overdue_learning_active_course()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrActiveLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));

		return iOverdue_learning;
	}
	function get_overdue_learning_active_test()
	{
		var iOverdue_testing = 0;

		iOverdue_testing += ArrayCount(ArraySelect(xarrActiveTestLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));

		return iOverdue_testing;
	}
	function get_overdue_learning_complete_course()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning;
	}
	function get_overdue_learning_complete_test()
	{
		var iOverdue_testing = 0;

		iOverdue_testing += ArrayCount(ArraySelect(xarrTestLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_testing;
	}
	function get_overdue_learning_course()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrActiveLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning += ArrayCount(ArraySelect(xarrLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning;
	}
	function get_overdue_learning_test()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrActiveTestLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning += ArrayCount(ArraySelect(xarrTestLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning;
	}

	function get_percent_overdue_learning_active_course()
	{
		var iPercent_overdue_learning = 0;

//		iCountMax_end_date = ArrayCount(ArraySelect(xarrActiveLearnings, "This.max_end_date.HasValue"));
		iCountMax_end_date = ArrayCount( xarrActiveLearnings );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_active_course, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}
	function get_percent_overdue_learning_complete_course()
	{
		var iPercent_overdue_learning = 0;

//		iCountMax_end_date = ArrayCount(ArraySelect(xarrActiveLearnings, "This.max_end_date.HasValue"));
		iCountMax_end_date = ArrayCount( xarrLearnings );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_complete_course, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}
	function get_percent_overdue_learning_complete_test()
	{
		var iPercent_overdue_learning = 0;

		iCountMax_end_date = ArrayCount( xarrTestLearnings );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_complete_test, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}
	function get_percent_overdue_learning_course()
	{
		var iPercent_overdue_learning = 0;

//		iCountMax_end_date = ArrayCount(ArraySelect(xarrLearningsCourseAll, "This.max_end_date.HasValue"));
		iCountMax_end_date = ArrayCount( xarrLearningsCourseAll );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_course, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}
	function get_percent_overdue_learning_test()
	{
		var iPercent_overdue_learning = 0;

//		iCountMax_end_date = ArrayCount(ArraySelect(xarrLearningsTestAll, "This.max_end_date.HasValue"));
		iCountMax_end_date = ArrayCount( xarrLearningsTestAll );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_test, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}
	function get_percent_overdue_learning()
	{
		var iPercent_overdue_learning = 0;

//		iCountMax_end_date = ArrayCount(ArraySelect(xarrLearningsAll, "This.max_end_date.HasValue"));
		iCountMax_end_date = ArrayCount( xarrLearningsAll );
		if (iCountMax_end_date > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning, 0)*Real(100))/Real(iCountMax_end_date));
		}

		return iPercent_overdue_learning;
	}

	function get_percent_overdue_learning_mandatory_active_course()
	{
		var iPercent_overdue_learning = 0;

		var iCountMandatory = ArrayCount(xarrActiveLearningsMandatory);
		if (iCountMandatory > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_mandatory_active_course, 0)*Real(100))/Real(iCountMandatory));
		}

		return iPercent_overdue_learning;
	}

	function get_percent_overdue_learning_mandatory_complete_course()
	{
		var iPercent_overdue_learning = 0;

		var iCountMandatory = ArrayCount(xarrLearningsMandatory);
		if (iCountMandatory > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_mandatory_complete_course, 0)*Real(100))/Real(iCountMandatory));
		}

		return iPercent_overdue_learning;
	}

	function get_percent_overdue_learning_mandatory_complete_test()
	{
		var iPercent_overdue_learning = 0;

		var iCountMandatory = ArrayCount(xarrTestLearningsMandatory);
		if (iCountMandatory > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_mandatory_complete_test, 0)*Real(100))/Real(iCountMandatory));
		}

		return iPercent_overdue_learning;
	}

	function get_percent_overdue_learning_mandatory_course()
	{
		var iPercent_overdue_learning = 0;

		var iCountMandatory = ArrayCount(xarrLearningsMandatory) + ArrayCount(xarrActiveLearningsMandatory);
		if (iCountMandatory > 0)
		{
			iPercent_overdue_learning = Math.round((OptReal(iOverdue_learning_mandatory_course, 0)*Real(100))/Real(iCountMandatory));
		}

		return iPercent_overdue_learning;
	}

	function get_percent_overdue_learning_mandatory_test()
	{
		var iPercent_overdue_testing = 0;

		var iCountMandatory = ArrayCount(xarrTestLearningsMandatory) + ArrayCount(xarrActiveTestLearningsMandatory);
		if (iCountMandatory > 0)
		{
			iPercent_overdue_testing = Math.round((OptReal(iOverdue_learning_mandatory_test, 0)*Real(100))/Real(iCountMandatory));
		}

		return iPercent_overdue_testing;
	}

	function get_percent_average_score_course()
	{
		var rPercent_average_score = 0.0;
		var iCountAll = ArrayCount(xarrLearnings);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oLearningElem in xarrLearnings)
		{
			if (OptReal( oLearningElem.max_score, 0 ) > 0)
			{
				rPercent_average_score += OptReal( oLearningElem.score, 0 ) / OptReal( oLearningElem.max_score, 1 );
			}
			else
			{
				// catCourse = oLearningElem.course_id.OptForeignElem;
				catCourse = ArrayOptFindBySortedKey(arrJoinCourses, oLearningElem.course_id.Value, 'id');
				if (catCourse != undefined && OptReal( catCourse.max_score, 0 ) > 0)
				{
					rPercent_average_score += OptReal( oLearningElem.score, 0 ) / OptReal( catCourse.max_score, 1 );
				}
			}
		}

		return Math.round( OptReal( rPercent_average_score, 0 ) * Real(100) / Real(iCountAll));
	}
	function get_percent_average_score_test()
	{
		var rPercent_average_score = 0.0;
		var iCountAll = ArrayCount(xarrTestLearnings);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oTestLearningElem in xarrTestLearnings)
		{
			if ( OptReal( oTestLearningElem.max_score, 0 ) > 0 )
			{
				rPercent_average_score += OptReal( oTestLearningElem.score, 0 ) / OptReal( oTestLearningElem.max_score, 1 );
			}
		}

		return Math.round(Real(rPercent_average_score) * Real(100) / Real(iCountAll));
	}
	function get_percent_average_score()
	{
		var rPercent_average_score = 0.0;
		var iCountAll = ArrayCount(xarrLearnings) + ArrayCount(xarrTestLearnings);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oLearningElem in xarrLearnings)
		{
			if ( OptReal( oLearningElem.max_score, 0 ) > 0 )
			{
				rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( oLearningElem.max_score, 1.0 );
			}
			else
			{
				// catCourse = oLearningElem.course_id.OptForeignElem;
				catCourse = ArrayOptFindBySortedKey(arrJoinCourses, oLearningElem.course_id.Value, 'id');
				if ( catCourse != undefined && OptReal( catCourse.max_score, 0 ) > 0 )
				{
					rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( catCourse.max_score, 1.0 );
				}
			}
		}

		for (oTestLearningElem in xarrTestLearnings)
		{
			if ( OptReal( oTestLearningElem.max_score, 0 ) > 0 )
			{
				rPercent_average_score += OptReal( oTestLearningElem.score, 0.0 ) / OptReal( oTestLearningElem.max_score, 1.0 );
			}
		}

		return Math.round(Real(rPercent_average_score) * Real(100) / Real(iCountAll));
	}

	function get_percent_complete_mandatory_course()
	{
		iCountAll =
			ArrayCount(xarrActiveLearningsMandatory) +
			ArrayCount(xarrLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(Real(ArrayCount(xarrLearningsMandatory))*Real(100) / Real(iCountAll));
	}
	function get_percent_finish_mandatory_course()
	{
		iCountAll =	ArrayCount(xarrLearnings);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(Real(ArrayCount(xarrLearningsMandatory))*Real(100) / Real(iCountAll));
	}

	function get_percent_complete_mandatory_test()
	{
		iCountAll =
			ArrayCount(xarrActiveTestLearningsMandatory) +
			ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(Real(ArrayCount(xarrTestLearningsMandatory))*Real(100) / Real(iCountAll));
	}
	function get_percent_complete_mandatory()
	{
		iCountAll =
			ArrayCount(xarrActiveLearningsMandatory) +
			ArrayCount(xarrLearningsMandatory) +
			ArrayCount(xarrActiveTestLearningsMandatory) +
			ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(Real(ArrayCount(xarrLearningsMandatory) + ArrayCount(xarrTestLearningsMandatory))*Real(100) / Real(iCountAll));
	}

	function get_percent_success_complete_mandatory_course()
	{
		iCountAll = ArrayCount(xarrLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(
			Real(ArrayCount(xarrSuccessLearningsMandatory))*Real(100) / Real(iCountAll)
		);
	}
	function get_percent_success_complete_mandatory_test()
	{
		iCountAll = ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(
			Real(ArrayCount(xarrSuccessTestLearningsMandatory))*Real(100) / Real(iCountAll)
		);
	}
	function get_percent_success_complete_mandatory()
	{
		iCountAll = ArrayCount(xarrLearningsMandatory) + ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}
		return Math.round(
			Real(ArrayCount(xarrSuccessLearningsMandatory) + ArrayCount(xarrSuccessTestLearningsMandatory))*Real(100) / Real(iCountAll)
		);
	}

	function get_percent_average_score_mandatory_course()
	{
		var rPercent_average_score = 0.0;

		var iCountAll = ArrayCount(xarrLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oLearningElem in xarrLearningsMandatory)
		{
			if ( OptReal( oLearningElem.max_score, 0.0 ) > 0 )
			{
				rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( oLearningElem.max_score, 1.0 );
			}
			else
			{
				// catCourse = oLearningElem.course_id.OptForeignElem;
				catCourse = ArrayOptFindBySortedKey(arrJoinCourses, oLearningElem.course_id.Value, 'id');
				if ( catCourse != undefined && OptReal( catCourse.max_score, 0.0 ) > 0 )
				{
					rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( catCourse.max_score, 1.0 );
				}
			}
		}

		return Math.round((Real(rPercent_average_score) * Real(100)) / Real(iCountAll));
	}
	function get_percent_average_score_mandatory_test()
	{
		var rPercent_average_score = 0.0;

		var iCountAll = ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oTestLearningElem in xarrTestLearningsMandatory)
		{
			if ( OptReal( oTestLearningElem.max_score, 0.0 ) > 0 )
			{
				rPercent_average_score += OptReal( oTestLearningElem.score, 0.0 ) / OptReal( oTestLearningElem.max_score, 1.0 );
			}
		}

		return Math.round((Real(rPercent_average_score) * Real(100)) / Real(iCountAll));
	}
	function get_percent_average_score_mandatory()
	{
		var rPercent_average_score = 0.0;

		var iCountAll = ArrayCount(xarrLearningsMandatory) + ArrayCount(xarrTestLearningsMandatory);
		if (iCountAll == 0)
		{
			return 0;
		}

		for (oLearningElem in xarrLearningsMandatory)
		{
			if ( OptReal( oLearningElem.max_score, 0.0 ) > 0 )
			{
				rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( oLearningElem.max_score, 1.0 );
			}
			else
			{
				// catCourse = oLearningElem.course_id.OptForeignElem;
				catCourse = ArrayOptFindBySortedKey(arrJoinCourses, oLearningElem.course_id.Value, 'id');
				if ( catCourse != undefined && OptReal( catCourse.max_score, 0.0 ) > 0 )
				{
					rPercent_average_score += OptReal( oLearningElem.score, 0.0 ) / OptReal( catCourse.max_score, 1.0 );
				}
			}
		}
		for (oTestLearningElem in xarrTestLearningsMandatory)
		{
			if ( OptReal( oTestLearningElem.max_score, 0.0 ) > 0 )
			{
				rPercent_average_score += OptReal( oTestLearningElem.score, 0.0 ) / OptReal( oTestLearningElem.max_score, 1.0 );
			}
		}

		return Math.round((Real(rPercent_average_score) * Real(100)) / Real(iCountAll));
	}

	function get_overdue_learning_mandatory_active_course()
	{
		var iOverdue_learning_mandatory = 0;

		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrActiveLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < Date() "));

		return iOverdue_learning_mandatory;
	}
	function get_overdue_learning_mandatory_active_test()
	{
		var iOverdue_testing_mandatory = 0;

		iOverdue_testing_mandatory += ArrayCount(ArraySelect(xarrActiveTestLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < Date() "));

		return iOverdue_testing_mandatory;
	}
	function get_overdue_learning_mandatory_complete_course()
	{
		var iOverdue_learning_mandatory = 0;

		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning_mandatory;
	}
	function get_overdue_learning_mandatory_complete_test()
	{
		var iOverdue_learning_mandatory = 0;

		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrTestLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning_mandatory;
	}
	function get_overdue_learning_mandatory_course()
	{
		var iOverdue_learning_mandatory = 0;

		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrActiveLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning_mandatory;
	}

	function get_overdue_learning_mandatory_test()
	{
		var iOverdue_learning_mandatory = 0;

		iOverdue_learning_mandatory = ArrayCount(ArraySelect(xarrActiveTestLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning_mandatory += ArrayCount(ArraySelect(xarrTestLearningsMandatory, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning_mandatory;
	}

	function get_max_last_usage_date_course()
	{
		try
		{
			dMax_last_usage_date = ArrayMax(xarrLearningsCourseAll, "last_usage_date").last_usage_date;
		}
		catch (e)
		{
			dMax_last_usage_date = "";
		}
		return dMax_last_usage_date;
	}
	function get_max_last_usage_date_test()
	{
		try
		{
			dMax_last_usage_date = ArrayMax(xarrLearningsTestAll, "last_usage_date").last_usage_date;
		}
		catch (e)
		{
			dMax_last_usage_date = "";
		}
		return dMax_last_usage_date;
	}

	function get_max_start_usage_date_course()
	{
		try
		{
			dMax_start_usage_date = ArrayMax(xarrLearningsCourseAll, "start_usage_date").start_usage_date;
		}
		catch (e)
		{
			dMax_start_usage_date = "";
		}
		return dMax_start_usage_date;
	}
	function get_max_start_usage_date_test()
	{
		try
		{
			dMax_start_usage_date = ArrayMax(xarrLearningsTestAll, "start_usage_date").start_usage_date;
		}
		catch (e)
		{
			dMax_start_usage_date = "";
		}
		return dMax_start_usage_date;
	}

	function getStrTime(iMseconds)
	{
		var sTime = "";

		if (OptInt(iMseconds) == undefined)
		{
			return "";
		}

		if (iMseconds < 60000)
		{
			return i18n.t( 'menshemin' );
		}
		rMseconds = Real(iMseconds);

		iDay = Int(rMseconds / 86400000);
		iHour = (rMseconds % 86400000) / 3600000;
		iMinute = (rMseconds % 3600000) / 60000;

		sTime = "";
		if (iDay > 0)
		{
			sTime += iDay + i18n.t( 'd' )
		}
		if (iHour > 0)
		{
			if (sTime != "")
			{
				sTime += " ";
			}
			sTime += iHour + i18n.t( 'ch' )
		}
		if (iMinute > 0)
		{
			if (sTime != "")
			{
				sTime += " ";
			}
			sTime += iMinute + i18n.t( 'min' )
		}
		return sTime;
	}

	function get_time_average_course()
	{
		if (dMax_last_usage_date_course == "")
		{
			return 0;
		}
		try
		{
			dMin_start_learning_date_course = ArrayMin(
				ArraySelect(xarrLearningsCourseAll, "This.start_learning_date.HasValue"),
				"start_learning_date"
			).start_learning_date;
		}
		catch (e)
		{
			dMin_start_learning_date_course = "";
		}

		if (dMin_start_learning_date_course == "")
		{
			return 0;
		}
		iTime = ArraySum(xarrLearningsCourseAll, "time");
		if (iTime == 0)
		{
			return 0;
		}

		iDiff = DateDiff(dMax_last_usage_date_course, dMin_start_learning_date_course);
		if (iDiff < 0)
		{
			return "";
		}
		iDayDiff = (iDiff / 86400);
		if (iDayDiff == 0)
		{
			if (iDiff > 0)
			{
				iDayDiff = 1;
			}
			else
			{
				return 0;
			}
		}

		iTime_averageDay = iTime / iDayDiff;
		iTime_averageWeek = iTime_averageDay * 7;
		sTime_average = getStrTime(iTime_averageWeek);

		return sTime_average;
	}
	function get_time_average_test()
	{
		if (dMax_last_usage_date_test == "")
		{
			return 0;
		}
		try
		{
			dMin_start_learning_date_test = ArrayMin(
				ArraySelect(xarrLearningsTestAll, "This.start_learning_date.HasValue"),
				"start_learning_date"
			).start_learning_date;
		}
		catch (e)
		{
			dMin_start_learning_date_test = "";
		}

		if (dMin_start_learning_date_test == "")
		{
			return 0;
		}
		iTime = ArraySum(xarrLearningsTestAll, "time");
		if (iTime == 0)
		{
			return "";
		}

		iDiff = DateDiff(dMax_last_usage_date_test, dMin_start_learning_date_test);
		if (iDiff < 0)
		{
			return 0;
		}
		iDayDiff = (iDiff / 86400);
		if (iDayDiff == 0)
		{
			if (iDiff > 0)
			{
				iDayDiff = 1;
			}
			else
			{
				return 0;
			}
		}

		iTime_averageDay = iTime / iDayDiff;
		iTime_averageWeek = iTime_averageDay * 7;
		sTime_average = getStrTime(iTime_averageWeek);

		return sTime_average;
	}
	function get_time_average()
	{
		if (dMax_last_usage_date == "")
		{
			return 0;
		}
		try
		{
			dMin_start_learning_date = ArrayMin(
				ArraySelect(xarrLearningsAll, "This.start_learning_date.HasValue"),
				"start_learning_date"
			).start_learning_date;
		}
		catch (e)
		{
			dMin_start_learning_date = "";
		}

		if (dMin_start_learning_date == "")
		{
			return 0;
		}
		iTime = ArraySum(xarrLearningsAll, "time");
		if (iTime == 0)
		{
			return 0;
		}

		iDiff = DateDiff(dMax_last_usage_date, dMin_start_learning_date);
		if (iDiff < 0)
		{
			return "";
		}
		iDayDiff = (iDiff / 86400);
		if (iDayDiff == 0)
		{
			if (iDiff > 0)
			{
				iDayDiff = 1;
			}
			else
			{
				return 0;
			}
		}

		iTime_averageDay = iTime / iDayDiff;
		iTime_averageWeek = iTime_averageDay * 7;
		sTime_average = getStrTime(iTime_averageWeek);

		return sTime_average;
	}

	iAccessApp = tools.call_code_library_method('libApplication', 'GetPersonApplicationAccessLevel', [iCurUserID, sAppCode]);
	course_conds = "";
	test_conds = "";
	if (iAccessApp == 3)
	{
		arrExpert = tools.xquery("for $elem in experts where $elem/person_id = " + iUserID + " return $elem/Fields('id')");
		if ( ArrayOptFirstElem( arrExpert ) != undefined )
		{
			iExpertID = ArrayOptFirstElem( arrExpert ).id;
			arrCategories = tools.xquery("for $elem in roles where contains ($elem/experts, '" + iExpertID + "') return $elem/Fields('id')");
			sCatExpert = "MatchSome($elem/role_id, (" + ArrayMerge ( arrCategories, 'This.id', ',' ) + "))";

			xarrCourse = XQuery( "for $elem in courses where " + sCatExpert + " return $elem/Fields('id')" );
			course_conds = " and MatchSome($elem/course_id, (" + ArrayMerge(xarrCourse, "This.id", ",") + "))";

			xarrTest = XQuery( "for $elem in assessments where " + sCatExpert + " return $elem/Fields('id')" );
			test_conds = " and MatchSome($elem/assessment_id, (" + ArrayMerge(xarrTest, "This.id", ",") + "))";
		}
	}

	// course
	xarrActiveLearnings = XQuery( "for $elem in active_learnings where $elem/person_id = " + iUserID + course_conds + " return $elem" );
	xarrActiveLearningsMandatory = ArraySelect(xarrActiveLearnings, "This.creation_user_id != " + iUserID + " && This.is_self_enrolled == false");
	xarrLearnings = XQuery( "for $elem in learnings where $elem/person_id = " + iUserID + course_conds + " return $elem" );
	xarrLearningsMandatory = ArraySelect(xarrLearnings, "This.creation_user_id != " + iUserID + " && This.is_self_enrolled == false");

	xarrSuccessLearnings = ArraySelect( xarrLearnings, "This.state_id == 4" );
	xarrSuccessLearningsMandatory = ArraySelect( xarrLearningsMandatory, "This.state_id == 4" );
	arrJoinCourses = ArrayExtract(tools.xquery("for $elem_qc in courses where MatchSome($elem_qc/id, (" + ArrayMerge(xarrLearnings, "course_id", ",") + ")) order by $elem_qc/id return $elem_qc/Fields('id','max_score')"), "({'id': This.id.Value, 'max_score': This.max_score.Value})");

	// test
	xarrActiveTestLearnings = XQuery( "for $elem in active_test_learnings where $elem/person_id = " + iUserID + test_conds + " return $elem" );
	xarrActiveTestLearningsMandatory = ArraySelect(xarrActiveTestLearnings, "This.creation_user_id != " + iUserID + " && This.is_self_enrolled == false");
	xarrTestLearnings = XQuery( "for $elem in test_learnings where $elem/person_id = " + iUserID + test_conds + " return $elem" );
	xarrTestLearningsMandatory = ArraySelect(xarrTestLearnings, "This.creation_user_id != " + iUserID + " && This.is_self_enrolled == false");

	xarrSuccessTestLearnings = ArraySelect( xarrTestLearnings, "This.state_id == 4" );
	xarrSuccessTestLearningsMandatory = ArraySelect( xarrTestLearningsMandatory, "This.state_id == 4" );

	xarrLearningsCourseAll = ArrayUnion(xarrActiveLearnings, xarrLearnings);
	xarrLearningsTestAll = ArrayUnion(xarrActiveTestLearnings, xarrTestLearnings);
	xarrLearningsAll = ArrayUnion(xarrLearningsCourseAll, xarrLearningsTestAll);

	// event
	xarrEventResults = XQuery( "for $elem in event_results where $elem/person_id = " + iUserID + " return $elem" );
	xarrEventCollaborators = XQuery( "for $elem in event_collaborators where $elem/collaborator_id = " + iUserID + " and $elem/status_id != 'cancel' return $elem" );
	xarrFinishEventCollaborators = ArraySelect( xarrEventCollaborators, "This.finish_date < Date()" );
	xarrFutureEventCollaborators = ArraySelect( xarrEventCollaborators, "This.finish_date > Date()" );
	xarrFinishEventResults = ArrayIntersect( xarrEventResults, xarrFinishEventCollaborators, "This.event_id", "This.event_id" );

	xarrResponsesCourse = XQuery("for $elem in responses where $elem/type = 'course' and $elem/person_id = " + iUserID + " return $elem");
	xarrResponsesTest = XQuery("for $elem in responses where $elem/type = 'assessment' and $elem/person_id = " + iUserID + " return $elem");

	iOverdue_learning_active_course = get_overdue_learning_active_course();
	iOverdue_learning_active_test = get_overdue_learning_active_test();
	iOverdue_learning_complete_course = get_overdue_learning_complete_course();
	iOverdue_learning_complete_test = get_overdue_learning_complete_test();
	iOverdue_learning_course = get_overdue_learning_course();
	iOverdue_learning_test = get_overdue_learning_test();
	iOverdue_learning = iOverdue_learning_course + iOverdue_learning_test;

	iOverdue_learning_mandatory_active_course = get_overdue_learning_mandatory_active_course();
	iOverdue_learning_mandatory_active_test = get_overdue_learning_mandatory_active_test();
	iOverdue_learning_mandatory_complete_course = get_overdue_learning_mandatory_complete_course();
	iOverdue_learning_mandatory_complete_test = get_overdue_learning_mandatory_complete_test();
	iOverdue_learning_mandatory_course = get_overdue_learning_mandatory_course();
	iOverdue_learning_mandatory_test = get_overdue_learning_mandatory_test();
	iOverdue_learning_mandatory = iOverdue_learning_mandatory_course + iOverdue_learning_mandatory_test;

	dMax_last_usage_date_course = get_max_last_usage_date_course();
	dMax_last_usage_date_test = get_max_last_usage_date_test();
	dMax_last_usage_date = "";
	if (dMax_last_usage_date_course != "" && dMax_last_usage_date_test != "")
	{
		if (dMax_last_usage_date_course > dMax_last_usage_date_test)
		{
			dMax_last_usage_date = dMax_last_usage_date_course;
		}
		else
		{
			dMax_last_usage_date = dMax_last_usage_date_test;
		}
	}
	else if (dMax_last_usage_date_course != "")
	{
		dMax_last_usage_date = dMax_last_usage_date_course;
	}
	else if (dMax_last_usage_date_test != "")
	{
		dMax_last_usage_date = dMax_last_usage_date_test;
	}

	dMax_start_usage_date_course = get_max_start_usage_date_course();
	dMax_start_usage_date_test = get_max_start_usage_date_test();
	dMax_start_usage_date = "";
	if (dMax_start_usage_date_course != "" && dMax_start_usage_date_test != "")
	{
		if (dMax_start_usage_date_course > dMax_start_usage_date_test)
		{
			dMax_start_usage_date = dMax_start_usage_date_course;
		}
		else
		{
			dMax_start_usage_date = dMax_start_usage_date_test;
		}
	}
	else if (dMax_start_usage_date_course != "")
	{
		dMax_start_usage_date = dMax_start_usage_date_course;
	}
	else if (dMax_start_usage_date_test != "")
	{
		dMax_start_usage_date = dMax_start_usage_date_test;
	}

	var oContext = {
		percent_mandatory_course: get_percent_mandatory_course(),
		percent_active_mandatory_course: get_percent_active_mandatory_course(),
		success_course: ArrayCount( xarrSuccessLearnings ),
		success_test: ArrayCount( xarrSuccessTestLearnings ),
		percent_success_course: get_percent_success_course(),
		percent_mandatory_test: get_percent_mandatory_test(),
		percent_success_test: get_percent_success_test(),
		learning_course: ArrayCount( xarrLearnings ),
		learning_test: ArrayCount( xarrTestLearnings ),
		youself_course: ArrayCount( ArraySelect( xarrLearnings, "This.creation_user_id == iUserID || This.is_self_enrolled" ) ),
		youself_test: ArrayCount( ArraySelect( xarrTestLearnings, "This.creation_user_id == iUserID || This.is_self_enrolled" ) ),
		active_course: ArrayCount( xarrActiveLearnings ),
		active_test: ArrayCount( xarrActiveTestLearnings ),
		mandatory_active_course: ArrayCount( xarrActiveLearningsMandatory ),
		mandatory_course: ArrayCount( xarrLearningsMandatory ),
		mandatory_test: ArrayCount( xarrTestLearningsMandatory ),
		mandatory_active_test: ArrayCount( xarrActiveTestLearningsMandatory ),
		percent_mandatory_active_test: get_percent_active_mandatory_test(),//
		percent_not_learning_recommender_course: get_percent_not_learning_recommender_course(),
		finish_event: ArrayCount( ArraySelect( xarrFinishEventResults, "This.is_assist" ) ),
		percent_assist_event: get_percent_assist_event(),
		visiting_hours: get_visiting_hours(),
		future_event: ArrayCount( ArrayIntersect( xarrEventResults, xarrFutureEventCollaborators, "This.event_id", "This.event_id" ) ),

		overdue_learning_active_course: iOverdue_learning_active_course,
		overdue_learning_active_test: iOverdue_learning_active_test,
		overdue_learning_complete_course: iOverdue_learning_complete_course,
		overdue_learning_complete_test: iOverdue_learning_complete_test,
		overdue_learning_course: iOverdue_learning_course,
		overdue_learning_test: iOverdue_learning_test,
		overdue_learning: iOverdue_learning,

		percent_overdue_learning_active_course: get_percent_overdue_learning_active_course(),
		percent_overdue_learning_complete_course: get_percent_overdue_learning_complete_course(),
		percent_overdue_learning_complete_test: get_percent_overdue_learning_complete_test(),
		percent_overdue_learning_course: get_percent_overdue_learning_course(),
		percent_overdue_learning_test: get_percent_overdue_learning_test(),
		percent_overdue_learning: get_percent_overdue_learning(),

		percent_average_score_course: get_percent_average_score_course(),
		percent_average_score_test: get_percent_average_score_test(),
		percent_average_score: get_percent_average_score(),

		percent_complete_mandatory_course: get_percent_complete_mandatory_course(),
		percent_complete_finish_course: get_percent_finish_mandatory_course(),
		percent_complete_mandatory_test: get_percent_complete_mandatory_test(),
		percent_complete_mandatory: get_percent_complete_mandatory(),

		success_complete_mandatory_course: ArrayCount(xarrSuccessLearningsMandatory),
		success_complete_mandatory_test: ArrayCount(xarrSuccessTestLearningsMandatory),
		percent_success_complete_mandatory_course: get_percent_success_complete_mandatory_course(),
		percent_success_complete_mandatory_test: get_percent_success_complete_mandatory_test(),
		percent_success_complete_mandatory: get_percent_success_complete_mandatory(),

		percent_average_score_mandatory_course: get_percent_average_score_mandatory_course(),
		percent_average_score_mandatory_test: get_percent_average_score_mandatory_test(),
		percent_average_score_mandatory: get_percent_average_score_mandatory(),

		overdue_mandatory_active_course: iOverdue_learning_mandatory_active_course,
		overdue_mandatory_active_test: iOverdue_learning_mandatory_active_test,
		overdue_mandatory_complete_course: iOverdue_learning_mandatory_complete_course,
		overdue_mandatory_complete_test: iOverdue_learning_mandatory_complete_test,
		overdue_learning_mandatory_course: iOverdue_learning_mandatory_course,
		overdue_learning_mandatory_test: iOverdue_learning_mandatory_test,
		overdue_learning_mandatory: iOverdue_learning_mandatory,

		percent_overdue_learning_mandatory_active_course: get_percent_overdue_learning_mandatory_active_course(),
		percent_overdue_learning_mandatory_complete_course: get_percent_overdue_learning_mandatory_complete_course(),
		percent_overdue_learning_mandatory_complete_test: get_percent_overdue_learning_mandatory_complete_test(),
		percent_overdue_learning_mandatory_course: get_percent_overdue_learning_mandatory_course(),
		percent_overdue_learning_mandatory_test: get_percent_overdue_learning_mandatory_test(),

		max_last_usage_date_course: dMax_last_usage_date_course,
		max_last_usage_date_test: dMax_last_usage_date_test,
		max_last_usage_date: dMax_last_usage_date,

		max_start_usage_date_course: dMax_start_usage_date_course,
		max_start_usage_date_test: dMax_start_usage_date_test,
		max_start_usage_date: dMax_start_usage_date,

		time_average_course: get_time_average_course(),
		time_average_test: get_time_average_test(),
		time_average: get_time_average(),

		response_count_course: ArrayCount(xarrResponsesCourse),
		response_count_test: ArrayCount(xarrResponsesTest),
		response_count: 0,
	};
	oContext.response_count = oContext.response_count_course + oContext.response_count_test;
	oContext.percent_response_count_course = ( oContext.learning_course == 0 ? 0: ( ( oContext.response_count_course * 100 ) / oContext.learning_course ) );
	oContext.average_response_score_course = ( oContext.response_count_course == 0 ? 0: OptReal( ArraySum( xarrResponsesCourse, "OptReal( This.basic_score, 0 )") / oContext.response_count_course,2) );
	oRes.context = oContext;

	arrJoinCourses = undefined;

	return oRes;
}

/**
 * @typedef {Object} BossSubordinateContext
 * @property {number} subordinates_count – Количество подчиненных руководителя.
 * @property {string} hired_count – Количество сотрудников из числа подчиненных, принятых на работу в указанный период.
 * @property {number} average_age – Средний возраст подчиненных, лет
 * @property {number} average_expirience – Средний стаж подчиненных, месяцев
 * @property {number} col_birth_month – Количество подчиненных, у которых день рождения в этом месяце
 * @property {number} col_birth_near_month – Количество подчиненных, у которых день рождения в ближайший месяц (30 дней)
 * @property {string} percent_womans – Процент сотрудников от общего числа подчиненных, которые являются женщинами.
 * @property {string} total_womans – Количество женщин от общего числа подчиненных.
 * @property {string} total_mans – Количество мужчин от общего числа подчиненных.
 * @property {number} curr_vacation_count – Количество сотрудников из числа подчиненных, которые находятся в отпуске.
 * @property {number} percent_high_effectiveness – Процент сотрудников от общего числа подчиненных, которые считаются высокоэффективными.
 * @property {number} competences_count – Количество сотрудников с оцененными компетенциями
 * @property {number} percent_competences – Доля сотрудников с оцененными компетенциями
 * @property {number} pdp_count – Количество сотрудников со сформированным ИПР
 * @property {number} percent_pdp – Доля сотрудников, имеющих актуальный ИПР
 * @property {number} adaptation_count – Количество сотрудников из числа подчиненных, которые проходят адаптацию.
 * @property {number} successor_count – Количество сотрудников из числа подчиненных, которые являются преемниками на ключевую должность.
 * @property {number} personnel_reserve_count – Количество сотрудников из числа подчиненных, которые состоят в одном или нескольких кадровых резервах.
 * @property {string} percent_bosses – Процент сотрудников от общего числа подчиненных, которые являются руководителями.
 * @property {string} total_bosses – Количество сотрудников от общего числа подчиненных, которые являются руководителями.
 * @property {number} next_week_vacation_count – Количество сотрудников из числа подчиненных, которые должны уйти в отпуск в течение следующей недели.
 * @property {string} dismiss_count – Количество уволенных за период.
 * @property {string} percent_turnover – Текучесть кадров за период.
 * @property {number} adaptation_readiness_percent – Интегральный процент завершенности адаптаций у подчиненных руководителя.
 * @property {string} overdue_assignment_percent – Процент просроченных поручений у подчиненных руководителя.
 * @property {string} has_many_management_object – У руководителя больше одного объекта управления
 * @property {string} current_management_object_id – ID текущего объекта управления
 * @property {string} current_management_object_name – Название текущего объекта управления
 * @property {string} current_management_object_type – Название каталога текущего объекта управления
 * @property {string[]} bosspanel_frame_rule – Перечень видимых вкладок панели руководителя
*/

/**
 * @typedef {Object} ReturnBossContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {BossSubordinateContext} context – Контекст .
*/
/**
 * @function GetBossSubordinateContext
 * @memberof Websoft.WT.Main
 * @author BG
 * @description Получение контекста руководителя по его подчиненным.
 * @param {bigint} iPersonID - ID сотрудника.
 * @param {string[]} arrCaclulateParam - перечень атрибутов, которые будут вычисляться
 * @param {date} dPeriodStart - Начало периода вычисления для параметров показателя
 * @param {date} dPeriodEnd - Конец периода вычисления для параметров показателя
 * @param {string} PersonnelTurnoverPeriod - Период вычисления текучести кадров (month,quarter,halfyear,year,optionally)
 * @param {boolean} bWithoutFuncManagers - Не учитывать функциональных руководителей (только непосредственных, по должности).
 * @returns {ReturnBossContext}
*/
/* copy to @component employee_management  */
function GetBossSubordinateContext( iPersonID, arrCaclulateParam, dPeriodStart, dPeriodEnd, PersonnelTurnoverPeriod, bWithoutFuncManagers )
{
	var oRes = tools.get_code_library_result_object();
	oRes.context = new Object;

	if(dPeriodStart == undefined) dPeriodStart = null;
	if(dPeriodEnd == undefined) dPeriodEnd = null;

	try
	{
		iPersonID = Int( iPersonID );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
	}
	var libParam = tools.get_params_code_library('libMain');
	var arrSubordinates = GetTypicalSubordinates(iPersonID, libParam.GetOptProperty("DefaultSubordinateType"), libParam.GetOptProperty("iBossTypeIDs"), false, (!tools_web.is_true(libParam.GetOptProperty("bRetunDismissedPerson", false)) ? "$elem/is_dismiss != true()" : ""), (["id","hire_date","birth_date","sex"]));
	var oContext = {};
	var sSubordinateIDs = ArrayMerge(arrSubordinates, "This.id.Value", ",")

	var iTotalCountSubordinate = ArrayCount(arrSubordinates);
	oContext.SetProperty("subordinates_count", iTotalCountSubordinate);

	var bCheckExperience = arrCaclulateParam.indexOf("experience" ) >= 0;
	var bCheckWoman = arrCaclulateParam.indexOf("percent_womans" ) >= 0;
	var bCheckCurrVacation = arrCaclulateParam.indexOf("curr_vacation_count" ) >= 0;
	if(bCheckCurrVacation)
	{
		var iCountVacationSubordinate = 0;
		var sOtpusk = StrTitleCase( i18n.t( 'otpusk' ) );
		//oContext.SetProperty("curr_vacation_count", iCountVacationSubordinate);
	}
	if(bCheckExperience)
	{
		var iHiredCount = (dPeriodStart == null && dPeriodEnd == null) ? iTotalCountSubordinate : 0;
		
		var dHireDate, dBirthDate, iExpirienceMonth, iAge;
		var iExpirienceMonthSum = 0;
		var iExpirienceCount = 0;
		var iAgeSum = 0;
		var iAgeCount = 0;
		var iCountColBirthMonth = 0;
		var iCountColBirthNearMonth = 0;
		// var dPositionDate, xqPosition;
		if(dPeriodStart != null && dPeriodEnd != null && DateDiff(dPeriodEnd, dPeriodStart) < (366*24*3600)) // заявлено начало и конец интервала и интервал меньше года
		{
			if(Month(dPeriodStart) != Month(dPeriodEnd) || Day(dPeriodStart) != Day(dPeriodEnd) || Year(dPeriodStart) == Year(dPeriodEnd)) // Интервал - в пределах одного года
			{
				var dAgePeriodStart = OptDate(Year(Date()), Month(dPeriodStart), Day(dPeriodStart)); // начало и конец интервала приводятся к текущему году
				var dAgePeriodEnd = OptDate(Year(Date()), Month(dPeriodEnd), Day(dPeriodEnd));
			}
			else 
			{
				var dAgePeriodStart = OptDate(Year(Date()), 1, 1);
				var dAgePeriodEnd = OptDate(Year(Date()), 12, 31);
			}
			var bCastToCurYear = true;
		}
		else
		{
			var dAgePeriodStart = dPeriodStart;
			var dAgePeriodEnd = dPeriodEnd;
			var bCastToCurYear = false;
		}
		var dBirthDateInCurYear, bCalculateAge;
		

		
	}
	if( bCheckWoman )
	{
		var iTotalWoman = 0
	}

	if( bCheckExperience || bCheckWoman || bCheckCurrVacation )
	{
		for(xmPerson in arrSubordinates)
		{
			if( bCheckExperience )
			{
				dHireDate = xmPerson.hire_date.HasValue ? xmPerson.hire_date.Value : null; 
				dBirthDate = xmPerson.birth_date.HasValue ? xmPerson.birth_date.Value : null; 
				/*
				dPositionDate = xmPerson.position_date.HasValue ? xmPerson.position_date.Value : null; 
				if(dPositionDate == null)
				{
					xqPosition = xmPerson.position_id.OptForeignElem;
					if(xqPosition != undefined && xqPosition.position_date.HasValue)
						dPositionDate = xqPosition.position_date.Value;
				}
				*/
				
				// hired_count
				if(dHireDate != null)
				{
					if(dPeriodStart != null && dPeriodEnd != null)
					{
						if(xmPerson.hire_date.Value > dPeriodStart && dHireDate < dPeriodEnd)
							iHiredCount++;
					}
					else if(dPeriodStart == null && dPeriodEnd != null)
					{
						if(dHireDate < dPeriodEnd)
							iHiredCount++;
					}
					else if(dPeriodEnd == null && dPeriodStart != null)
					{
						if(dHireDate > dPeriodStart)
							iHiredCount++;
					}
				
					iExpirienceMonth = (Year(Date())-Year(dHireDate))*12 + (Month(Date())-Month(dHireDate));
					iExpirienceMonthSum += iExpirienceMonth
					iExpirienceCount++;
				}
				
				// average age			
				if(dBirthDate != null)
				{
					if(bCastToCurYear)
					{
						dBirthDateInCurYear = OptDate(Year(Date()), Month(dBirthDate), Day(dBirthDate)); // дата ДР в текущем глду
						bCalculateAge = (dAgePeriodStart > dAgePeriodEnd) ? (dBirthDateInCurYear >= dAgePeriodStart || dBirthDateInCurYear <= dAgePeriodEnd) : (dBirthDateInCurYear >= dAgePeriodStart && dBirthDateInCurYear <= dAgePeriodEnd); // считаем, если ДР (в текущем году) - в заявленом интервале 
					}
					else
					{
						bCalculateAge = ((dAgePeriodStart == null || dBirthDate >= dAgePeriodStart) && (dAgePeriodEnd == null || dBirthDate <= dAgePeriodEnd)) // считаем, если ДР (с годом) - в заявленом интервале
					}
					
					if(bCalculateAge)
					{
						iAge = Year(Date())-Year(dBirthDate);
						if(DateDiff(Date(), Date(Year(Date()), Month(dBirthDate), Day(dBirthDate))) < 0)
							iAge -= 1;

						iAgeSum += iAge
						iAgeCount++;					
					}

					dDateNextMonth = tools.AdjustDate(Date(), 29);	
					
					if(Month(dBirthDate) == Month(Date()))
						iCountColBirthMonth++;
					
					if(Month(dBirthDate) == Month(Date()) && Day(dBirthDate) >= Day(Date()) || Month(dBirthDate) == Month(dDateNextMonth) && Day(dBirthDate) < Day(dDateNextMonth))
						iCountColBirthNearMonth++;
				}
			}
			if( bCheckWoman )
			{
				if( xmPerson.sex == "w" )
				{
					iTotalWoman++;
				}
			}
			if( bCheckCurrVacation )
			{
				if( xmPerson.current_state == sOtpusk )
				{
					iCountVacationSubordinate++;
				}
			}
		}
	}
	if( bCheckExperience )
	{
		oContext.SetProperty("hired_count", iHiredCount);
		oContext.SetProperty("average_age", (iAgeCount != 0 ? StrReal(Real(iAgeSum)/Real(iAgeCount), 1) : 0.0));
		oContext.SetProperty("average_expirience", (iExpirienceCount != 0 ? StrReal(Real(iExpirienceMonthSum)/Real(iExpirienceCount), 1) : 0.0));
		oContext.SetProperty("col_birth_month", iCountColBirthMonth);
		oContext.SetProperty("col_birth_near_month", iCountColBirthNearMonth);
	}

	if(bCheckWoman)
	{
		//var arrWomans = ArraySelectByKey( arrSubordinates, "w", "sex" );
		//var arrWomans = XQuery( "for $elem_qc in collaborators where MatchSome($elem_qc/id, (" + sSubordinateIDs + ")) and $elem_qc/sex = 'w' return $elem_qc/Fields('id')" ) 
		var rPercentWomans = iTotalCountSubordinate != 0 ? Real(iTotalWoman)/Real(iTotalCountSubordinate) : 0.0;
		oContext.SetProperty("percent_womans", StrReal(rPercentWomans*100.0, 1));
		oContext.SetProperty("total_womans", iTotalWoman);
		oContext.SetProperty("total_mans", (iTotalCountSubordinate - iTotalWoman));
	}

	if(arrCaclulateParam.indexOf("curr_vacation_count" ) >= 0)
	{
		//var iCountVacationSubordinate = ArrayCount(ArraySelectByKey(arrSubordinates, StrTitleCase( i18n.t( 'otpusk' ) ), "current_state" ));
		oContext.SetProperty("curr_vacation_count", iCountVacationSubordinate);
	}

	var iEffectivenessPeriod = OptInt(libParam.GetOptProperty("EffectivenessPeriod", 365), 365);

	if(arrCaclulateParam.indexOf("percent_high_effectiveness" ) >= 0)
	{
		var iHighEffectivenessLevel = OptInt(libParam.GetOptProperty("DefaultHighEffectivenessLevel", 80), 80);

		var arrAssessmentAppraiseTypes = tools_web.parse_multiple_parameter( libParam.GetOptProperty("sDefaultAssessmentAppraiseTypes", "[]"));
		if(!IsArray(arrAssessmentAppraiseTypes) || ArrayOptFirstElem(arrAssessmentAppraiseTypes) == undefined)
			arrAssessmentAppraiseTypes = ['activity_appraisal'];

		var sReqAssessmentForms = "for $elem in pas, $appr in assessment_appraises where ($elem/assessment_appraise_id = $appr/id and $appr/status = '1' and($appr/end_date > " + XQueryLiteral(DateOffset(Date(), (0-iEffectivenessPeriod)*86400)) + " or $appr/end_date = null())) and MatchSome($elem/assessment_appraise_type, (" + ArrayMerge(arrAssessmentAppraiseTypes, "XQueryLiteral(This)") + ") ) and $elem/is_done = true() and $elem/overall >= " + iHighEffectivenessLevel + " return $elem";
		var xarrAssessmentForms = tools.xquery(sReqAssessmentForms);
		var arrHighEffectivenessSubordinate = ArrayIntersect(arrSubordinates, xarrAssessmentForms, "This.id.Value", "This.person_id.Value");

		var rPercentHighEffective = iTotalCountSubordinate != 0 ? Real(ArrayCount(arrHighEffectivenessSubordinate))/ Real(iTotalCountSubordinate) : 0.0;
		oContext.SetProperty("percent_high_effectiveness", StrReal(rPercentHighEffective*100.0, 1));
	}
	if(arrCaclulateParam.indexOf("competence" ) >= 0)
	{
		var sReqCompsForms = "for $elem in pas, $aa in assessment_appraises where ($elem/assessment_appraise_id = $aa/id and $aa/end_date >= " + XQueryLiteral( DateOffset( Date(), ( 0 - iEffectivenessPeriod ) * 86400 ) ) + ") and $elem/status = 'manager' and $elem/is_done = true() and $elem/assessment_appraise_type = 'competence_appraisal'  return $elem/Fields('id','person_id')";

		var xarrCompsForms = tools.xquery( sReqCompsForms );
		var arrCompsSubordinate = ArrayIntersect( arrSubordinates, xarrCompsForms, "This.id.Value", "This.person_id.Value" );
		oContext.SetProperty( "competences_count", ArrayCount( arrCompsSubordinate ) );
		oContext.SetProperty( "percent_competences", StrReal( ( iTotalCountSubordinate > 0 ? ( ( Real( ArrayCount( arrCompsSubordinate ) ) * 100.0 ) / Real( iTotalCountSubordinate ) ): 0.0 ), 1 ) );
		xarrCompsForms = undefined;
	}

	if(arrCaclulateParam.indexOf("pdp" ) >= 0)
	{
		var sReqPDPForms = "for $elem in pas, $aa in assessment_appraises where ($elem/assessment_appraise_id = $aa/id and $aa/end_date >= " + XQueryLiteral( DateOffset( Date(), ( 0 - ( iEffectivenessPeriod * 3 ) ) * 86400 ) ) + ") and $elem/is_done = true() and $elem/assessment_appraise_type = 'development_plan'  return $elem/Fields('id','person_id')";

		var xarrPDPForms = tools.xquery( sReqPDPForms );
		var arrPDPSubordinate = ArrayIntersect( arrSubordinates, xarrPDPForms, "This.id.Value", "This.person_id.Value" );
		oContext.SetProperty( "pdp_count", ArrayCount( arrPDPSubordinate ) );
		oContext.SetProperty( "percent_pdp", StrReal( ( iTotalCountSubordinate > 0 ? ( ( Real( ArrayCount( arrPDPSubordinate ) ) * 100.0 ) / Real( iTotalCountSubordinate ) ): 0.0 ), 1 ) );
		sReqPDPForms = undefined;
	}
	if(arrCaclulateParam.indexOf("adaptation_count" ) >= 0)
	{
		var arrAdaptationSubordinate = XQuery( "for $elem_qc in career_reserves where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and $elem_qc/status='active' and $elem_qc/position_type='adaptation' return $elem_qc/Fields('id')" ) 
		// var arrAdaptationSubordinate = ArrayIntersect(arrSubordinates, tools.xquery("for $elem in career_reserves where $elem/status='active' and $elem/position_type='adaptation' return $elem"), "This.id.Value", "This.person_id.Value");
		oContext.SetProperty("adaptation_count", ArrayCount(arrAdaptationSubordinate));
	}

	if(arrCaclulateParam.indexOf("successor_count" ) >= 0)
	{
		var arrSuccessorSubordinate = XQuery( "for $elem_qc in successors where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and $elem_qc/status='approved' return $elem_qc/Fields('id')" ) 
		// var arrSuccessorSubordinate = ArrayIntersect(arrSubordinates, tools.xquery("for $elem in successors where $elem/status='approved' return $elem"), "This.id.Value", "This.person_id.Value");
		oContext.SetProperty("successor_count", ArrayCount(arrSuccessorSubordinate));
	}

	if(arrCaclulateParam.indexOf("personnel_reserve_count" ) >= 0)
	{
		var arrReserveSubordinate = XQuery( "for $elem_qc in personnel_reserves where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and $elem_qc/status='in_reserve' return $elem_qc/Fields('id')" ) 
		// var arrReserveSubordinate = ArrayIntersect(arrSubordinates, tools.xquery("for $elem in personnel_reserves where $elem/status='in_reserve' return $elem"), "This.id.Value", "This.person_id.Value");
		oContext.SetProperty("personnel_reserve_count", ArrayCount(arrReserveSubordinate));
	}
	if(arrCaclulateParam.indexOf("percent_bosses" ) >= 0)
	{
		if(bWithoutFuncManagers)
		{
			var sBossReq = "for $elem_qc in func_managers where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and $elem_qc/catalog = 'position' return distinct $elem_qc/Fields('person_id')"
		}
		else
		{
			var sBossReq = "for $elem_qc in func_managers where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and ($elem_qc/catalog = 'collaborator' or $elem_qc/catalog = 'org' or $elem_qc/catalog = 'subdivision' or $elem_qc/catalog = 'position') return distinct $elem_qc/Fields('person_id')"
		}
		
		var arrBosses = tools.xquery(sBossReq);
		var iCountBosses = ArrayCount(arrBosses);
		var rPercentBosses = iTotalCountSubordinate != 0 ? Real(iCountBosses)/ Real(iTotalCountSubordinate) : 0.0;
		oContext.SetProperty("percent_bosses", StrReal(rPercentBosses*100.0, 1));
		oContext.SetProperty("total_bosses", iCountBosses);
	}

	if(arrCaclulateParam.indexOf("next_week_vacation_count" ) >= 0)
	{
		var sPresenceStateIDs = ArrayMerge(tools.xquery("for $elem in presence_states where $elem/is_absence = true() return $elem" ), "This.id.Value", ",");
		var arrVacacies = tools.xquery("for $elem_qc in interval_schedules where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) and MatchSome( $elem_qc/presence_state_id, ( " + sPresenceStateIDs + " ) ) return $elem_qc");
		var iFinStartDate = DateNewTime(DateOffset(Date(), 691200));
		arrVacacies = ArraySelect(arrVacacies, "This.start_date.Value > Date() && This.start_date.Value < iFinStartDate")
		oContext.SetProperty("next_week_vacation_count", ArrayCount(arrVacacies));
	}
	var arrPersonFuncManagers = null;
	var arrAllSubIDs = null;
	var sMergeSubIDs = null;
	var iDismissCount = null;
	var arrAllOrgIDs = null;
	var aOrCond = null;
	if(arrCaclulateParam.indexOf("percent_turnover" ) >= 0)
	{
		arrAllSubIDs = [];
		if( arrPersonFuncManagers == null )
		{
			arrPersonFuncManagers = tools.xquery( "for $elem in func_managers where $elem/person_id = " + iPersonID + " return $elem/Fields('object_id','parent_id','catalog','boss_type_id')" );
		}
		arrSubIDs =  ArraySelect(ArrayUnion(
				ArrayExtract( ArraySelectByKey( arrPersonFuncManagers, "subdivision", "catalog" ), "object_id" ),
				ArrayExtract( ArraySelectByKey( arrPersonFuncManagers, "position", "catalog" ), "parent_id" ),
				ArrayExtract( tools.xquery( "for $elem in collaborators where $elem/id = " + iPersonID + "  return $elem/Fields('position_parent_id')" ), "position_parent_id" )
			), "This.HasValue");
		arrAllOrgIDs = ArraySelect( ArrayExtract( ArraySelectByKey( arrPersonFuncManagers, "org", "catalog" ), "object_id" ), "This.HasValue");
		if( ArrayOptFirstElem( arrSubIDs ) != undefined )
		{
			arrAllSubIDs = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + ArrayMerge( arrSubIDs, "This", "," ) + " ) order by $elem/Hier() return $elem/Fields('id')" );
		}

		if( ArrayOptFirstElem(arrAllSubIDs) == undefined && ArrayOptFirstElem( arrAllOrgIDs ) == undefined )
		{
			oContext.SetProperty("percent_turnover", 0.0)
		}
		else
		{
			//arrAllSubIDs = ArrayDirect(arrAllSubIDs);
			var dTurnoverPeriodStart, dTurnoverPeriodEnd;
			var curYear = Year(Date());
			var curMonth = Month(Date());
			var startYear, startMonth, endYear, endMonth;
			switch(PersonnelTurnoverPeriod)
			{
				case "optionally":
				{
					dTurnoverPeriodStart = DateNewTime(dPeriodStart);
					dTurnoverPeriodEnd = DateNewTime(dPeriodEnd, 23, 59, 59);
					break;
				}
				case "month":
				{
					startMonth = curMonth-1;
					startYear = curYear;
					if(startMonth == 0)
					{
						startMonth = 12;
						startYear = curYear-1;
					}
					dTurnoverPeriodStart = OptDate(startYear, startMonth, 1);
					dTurnoverPeriodEnd = OptDate(curYear, curMonth, 1);
					
					break;
				}
				case "quarter":
				{
					if(curMonth < 4)
					{
						dTurnoverPeriodStart = OptDate(curYear-1, 10, 1);
						dTurnoverPeriodEnd = OptDate(curYear, 1, 1);
					}
					else if(curMonth < 7)
					{
						dTurnoverPeriodStart = OptDate(curYear, 1, 1);
						dTurnoverPeriodEnd = OptDate(curYear, 4, 1);
					}
					else if(curMonth < 10)
					{
						dTurnoverPeriodStart = OptDate(curYear, 4, 1);
						dTurnoverPeriodEnd = OptDate(curYear, 7, 1);
					}
					else
					{
						dTurnoverPeriodStart = OptDate(curYear, 7, 1);
						dTurnoverPeriodEnd = OptDate(curYear, 10, 1);
					}
					
					break;
				}
				case "halfyear":
				{
					if(curMonth < 7)
					{
						dTurnoverPeriodStart = Date(curYear-1, 7, 1);
						dTurnoverPeriodEnd = Date(curYear, 1, 1);
					}
					else
					{
						dTurnoverPeriodStart = Date(curYear, 1, 1);
						dTurnoverPeriodEnd = Date(curYear, 7, 1);
					}
					break;
				}
				case "year":
				{
					dTurnoverPeriodStart = Date(curYear-1, 1, 1);
					dTurnoverPeriodEnd = Date(curYear, 1, 1);
					break;
				}
			}
			sMergeSubIDs = ArrayMerge( arrAllSubIDs, "id", "," );
			aOrCond = new Array();
			if( ArrayOptFirstElem(arrAllSubIDs) != undefined )
			{
				aOrCond.push( "MatchSome( $elem_qc/parent_object_id, (" + sMergeSubIDs + ") )" );
			}
			if( ArrayOptFirstElem( arrAllOrgIDs ) != undefined )
			{
				aOrCond.push( "MatchSome( $elem_qc/org_id, (" + ArrayMerge( arrAllOrgIDs, "This", "," ) + ") )" );
			}
			var xarrPositions = tools.xquery( "for $elem_qc in positions where ( " + ArrayMerge( aOrCond, "This", " or " ) + " ) and MatchSome($elem_qc/basic_collaborator_id, (" + sSubordinateIDs + ")) return $elem_qc/Fields('id')" );
			var iCountPositions = ArrayCount(xarrPositions);
			var xarrDismissedPositions = tools.xquery( "for $elem_qc in positions where MatchSome( $elem_qc/parent_object_id, (" + sMergeSubIDs + ") ) and MatchSome($elem_qc/id, (" + sSubordinateIDs + ")) and some $coll in collaborators satisfies ($elem_qc/basic_collaborator_id = $coll/id and $coll/is_dismiss = true() and $coll/dismiss_date > " + XQueryLiteral(dTurnoverPeriodStart) + " and $coll/dismiss_date < " + XQueryLiteral(dTurnoverPeriodEnd) + ") return $elem_qc/Fields('id')" );
			iDismissCount = ArrayCount(xarrDismissedPositions);
			var rTurnoverPercent = iCountPositions != 0 ? Real(iDismissCount)/Real(iCountPositions) : 0.0;
			oContext.SetProperty("percent_turnover", StrReal(rTurnoverPercent*100.0, 1));
		}
	}
	
	if(arrCaclulateParam.indexOf("adaptation_readiness_percent" ) >= 0)
	{
		var arrCareerReserveBySubordinate = tools.xquery("for $elem_qc in career_reserves where MatchSome($elem_qc/person_id, (" + sSubordinateIDs + ")) return $elem_qc");
		var arrAdaptationBySubordinate = ArraySelectByKey(arrCareerReserveBySubordinate, "adaptation", "position_type" );
		var iFullAdaptationCount = ArrayCount(arrAdaptationBySubordinate);
		var iSumReadinessAdaptationPercent = ArraySum(arrAdaptationBySubordinate, "This.readiness_percent.Value");
		oContext.SetProperty("adaptation_readiness_percent", (iFullAdaptationCount != 0 ? iSumReadinessAdaptationPercent/iFullAdaptationCount : 0));
	}

	if(arrCaclulateParam.indexOf("overdue_assignment_percent" ) >= 0)
	{
		var arrAssignments = tools.xquery("for $elem in tasks, $tt in task_types where ($elem/task_type_id=$tt/id and $tt/code='assignment') and $elem/executor_type='collaborator' and $elem/end_date_plan != null() return $elem");
		var arrSubordinateAssinnments = ArrayIntersect(arrAssignments, arrSubordinates, "This.executor_id.Value", "This.id.Value" );
		var iAssignmentFullCount = ArrayCount(arrSubordinateAssinnments);
		var iAssignmentOverdueCount = ArrayCount(ArraySelect(arrSubordinateAssinnments, "This.end_date_plan.Value < Date() && (This.status.Value == '0' || This.status.Value == 'r' || This.status.Value == 'p')"));
		oContext.SetProperty("overdue_assignment_percent", (iAssignmentFullCount != 0 ? StrReal((Real(iAssignmentOverdueCount)*100.0)/Real(iAssignmentFullCount), 1) : "0"));
		arrAssignments = undefined;
	}
	var oCurrentManagementObject = null;
	var oCacheData = new Object();
	var oResBossManagementObjects;
	if(arrCaclulateParam.indexOf("management_object" ) >= 0)
	{
		oResBossManagementObjects = get_boss_management_objects( iPersonID, true, 2, oCacheData );
		oCacheData = oResBossManagementObjects.cache_data;
		oContext.SetProperty("has_many_management_object", (ArrayCount( oResBossManagementObjects.result ) > 1));
		
		oCurrentManagementObject = get_current_management_object(iPersonID);
		if(oCurrentManagementObject != null)
		{
			oContext.SetProperty("current_management_object_id", oCurrentManagementObject.object_id);
			oContext.SetProperty("current_management_object_name", oCurrentManagementObject.object_name);
			oContext.SetProperty("current_management_object_type", oCurrentManagementObject.catalog_name);
		}
		else
		{
			oContext.SetProperty("current_management_object_id", null);
			oContext.SetProperty("current_management_object_name", i18n.t( 'vsepodchinennye' ));
			oContext.SetProperty("current_management_object_type", "");
		}
	}

	var arrBossRootManagementObjects = null;
	oResBossManagementObjects = null;
	if(arrCaclulateParam.indexOf("bosspanel_frame_rule" ) >= 0)
	{
		if( oCurrentManagementObject == null )
		{
			oCurrentManagementObject = get_current_management_object( iPersonID );
		}
		var arrActionRuleCodes = [];
		if( oCurrentManagementObject.object_id == 9999 )
		{
			oResBossManagementObjects = get_boss_management_objects( iPersonID, null, null, oCacheData );
			oCacheData = oResBossManagementObjects.cache_data;
			arrBossRootManagementObjects = ArraySelect( oResBossManagementObjects.result, "!This.HasProperty('parent_id') || OptInt(This.GetOptProperty('parent_id', null)) == undefined");
			// arrBossRootManagementObjects = ArraySelect( arrBossRootManagementObjects, "This.type != 'collaborator'");
			if( arrPersonFuncManagers == null )
			{
				arrPersonFuncManagers = tools.xquery( "for $elem in func_managers where $elem/person_id = " + iPersonID + " return $elem/Fields('object_id','parent_id','catalog','boss_type_id')" );
			}
			var xarrBossTypes = ArrayDirect( XQuery( "for $elem in boss_types where IsEmpty( $elem/object_type ) = true() or MatchSome( $elem/object_type, ('org','subdivision') ) return $elem/Fields('id','object_type',operations)" ) );
			var xarrOperations = ArrayDirect( XQuery( "for $elem in operations where ( contains( $elem/operation_catalog_list, 'subdivision' ) or contains( $elem/operation_catalog_list, 'org') ) and $elem/operation_type = 1  return $elem/Fields('id','operation_catalog_list','priority','name','action','code')" ) );
			var arrTempBossTypes, arrTempOperations, arrResultOperations;
			var arrOperationsIDs;
			arrResultOperations = null;
			for(itemMO in arrBossRootManagementObjects)
			{
				arrTempBossTypes = new Array();
				switch( itemMO.type )
				{
					case "collaborator":
					{
						arrTempBossTypes = ArrayIntersect( xarrBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'collaborator' && This.object_id == itemMO.id" ), "This.id", "This.boss_type_id" );
						arrTempBossTypes = ArraySelect( arrTempBossTypes, "ArrayOptFirstElem( This.object_type ) == undefined || ArrayOptFind(This.object_type, 'RValue(This) == \"collaborator\"') != undefined" );
						break;
					}
					case "group":
					{
						arrTempBossTypes = ArrayIntersect( xarrBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'group' && This.object_id == itemMO.id" ), "This.id", "This.boss_type_id" );
						arrTempBossTypes = ArraySelect( arrTempBossTypes, "ArrayOptFirstElem( This.object_type ) == undefined || ArrayOptFind(This.object_type, 'RValue(This) == \"group\"') != undefined" );
						break;
					}
					case "org":
					{
						arrTempBossTypes = ArrayIntersect( xarrBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'org' && This.object_id == itemMO.id" ), "This.id", "This.boss_type_id" );
						arrTempBossTypes = ArraySelect( arrTempBossTypes, "ArrayOptFirstElem( This.object_type ) == undefined || ArrayOptFind(This.object_type, 'RValue(This) == \"org\"') != undefined" );
						break;
					}
					case "subdivision":
					{
						
						iSubId = itemMO.id;
						oSub = ArrayOptFirstElem( XQuery( "for $elem in subdivisions where $elem/id = " + iSubId + " return $elem/Fields('id','parent_object_id','org_id')" ) );
						iSubOrgID = null;
						if( oSub != undefined )
						{
							iSubOrgID = oSub.org_id;
						}
						do
						{
							arrTempBossTypes = ArrayUnion( arrTempBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'subdivision' && This.object_id == iSubId" ));
							arrTempBossTypes = ArrayUnion( arrTempBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'position' && This.parent_id == iSubId" ));
							if( oSub != undefined && oSub.parent_object_id.HasValue )
							{
								iSubId = oSub.parent_object_id;
								oSub = ArrayOptFirstElem( XQuery( "for $elem in subdivisions where $elem/id = " + iSubId + " return $elem/Fields('id','parent_object_id')" ) );
							}
							else
							{
								iSubId = null;
								oSub = undefined;
							}
						}
						while( iSubId != null && oSub != undefined );
						if( OptInt( iSubOrgID ) != undefined )
						{
							arrTempBossTypes = ArrayUnion( arrTempBossTypes, ArraySelect( arrPersonFuncManagers, "This.catalog == 'org' && This.object_id == iSubOrgID" ));
						}
						arrTempBossTypes = ArrayIntersect( xarrBossTypes, arrTempBossTypes, "This.id", "This.boss_type_id" );
						arrTempBossTypes = ArraySelect( arrTempBossTypes, "ArrayOptFirstElem( This.object_type ) == undefined || ArrayOptFind(This.object_type, 'RValue(This) == \"subdivision\"') != undefined" )
						break;
					}
				}
				arrOperationsIDs = [];
				for ( catBossTypeElem in arrTempBossTypes )
				{
					if ( catBossTypeElem.operations.HasValue )
					{
						arrOperationsIDs = ArrayUnion( arrOperationsIDs, String( catBossTypeElem.operations ).split( ';' ) );
					}
				}

				arrTempOperations = ArrayIntersect( xarrOperations, arrOperationsIDs, "This.id", "OptInt( This )" );
				arrTempOperations = ArraySelect( arrTempOperations, "StrContains( ( ','+This.operation_catalog_list.Value+',' ) , ( ',' + itemMO.type + ',' ))" );
				if( arrResultOperations == null )
				{
					arrResultOperations = arrTempOperations;
				}
				else
				{
					arrResultOperations = ArrayIntersect( arrResultOperations, arrTempOperations, "This.id", "This.id" );
				}
				if( ArrayOptFirstElem( arrResultOperations ) == undefined )
				{
					break;
				}
			}
			arrActionRuleCodes = new Array();
			if( arrResultOperations != null )
			{
				for(itemOperation in arrResultOperations)
				{
					oCastOperation = {
						id: itemOperation.id.Value,
						name: itemOperation.name.Value,
						rule: (itemOperation.action.HasValue ? itemOperation.action.Value : itemOperation.code.Value),
					};

					arrActionRuleCodes.push(oCastOperation.rule);
				}
			}
		}
		else
		{
			oRet = GetActionRules( iPersonID, oCurrentManagementObject.object_id );
			arrActionRuleCodes = ArrayExtract(oRet.result, "This.rule")
		}
		
		if(ArrayOptFind(arrActionRuleCodes, "This == 'team'") == undefined)
		{
			arrActionRuleCodes.push('team');
		}

		oContext.SetProperty("bosspanel_frame_rules", EncodeJson(arrActionRuleCodes));
	}
	if(arrCaclulateParam.indexOf("dismiss_count" ) >= 0)
	{
		if( oCurrentManagementObject == null )
		{
			oCurrentManagementObject = get_current_management_object( iPersonID );
		}
		aOrCond = new Array()
		if( oCurrentManagementObject.object_id == 9999 )
		{
			if( oResBossManagementObjects == null )
			{
				oResBossManagementObjects = get_boss_management_objects( iPersonID, null, null, oCacheData );
				oCacheData = oResBossManagementObjects.cache_data;

			}
			arrSubs = ArraySelectByKey( oResBossManagementObjects.result, "subdivision", "type" );
			arrOrgs = ArraySelectByKey( oResBossManagementObjects.result, "org", "type" );
			arrAllSubIDs = new Array();
			
			if( ArrayOptFirstElem( arrSubs ) != undefined )
			{
				arrAllSubIDs = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + ArrayMerge( arrSubs, "This.id", "," ) + " ) order by $elem/Hier() return $elem/Fields('id')" );
			}
			if( ArrayOptFirstElem(arrAllSubIDs) != undefined )
			{
				aOrCond.push( "MatchSome( $elem_qc/position_parent_id, (" + ArrayMerge( arrAllSubIDs, "This.id", "," ) + ") )" );
			}
			if( ArrayOptFirstElem( arrOrgs ) != undefined )
			{
				aOrCond.push( "MatchSome( $elem_qc/org_id, (" + ArrayMerge( arrOrgs, "This.id", "," ) + ") )" );
			}
		}
		else
		{
			switch( oCurrentManagementObject.catalog )
			{
				case "org":
				{
					aOrCond.push( "$elem_qc/org_id=" + oCurrentManagementObject.object_id );
					break;
				}
				case "subdivision":
				{
					arrAllSubIDs = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + oCurrentManagementObject.object_id + " ) order by $elem/Hier() return $elem/Fields('id')" );
			
					if( ArrayOptFirstElem(arrAllSubIDs) != undefined )
					{
						aOrCond.push( "MatchSome( $elem_qc/position_parent_id, (" + ArrayMerge( arrAllSubIDs, "This.id", "," ) + ") )" );
					}
					break;
				}
			}
		}
		if( ArrayOptFirstElem(aOrCond) == undefined )
		{
			oContext.SetProperty("dismiss_count", 0);
		}
		else
		{
			xarrDismissedCollaborators = tools.xquery( "for $elem_qc in collaborators where ( " + ArrayMerge( aOrCond, "This", " or " ) + " ) and $elem_qc/is_dismiss = true() return $elem_qc/Fields('id')" );
			iDismissCollaboratorsCount = ArrayCount(xarrDismissedCollaborators);
			oContext.SetProperty("dismiss_count", iDismissCollaboratorsCount);
		}
	}

	oRes.context = oContext;
	return oRes;
}

/**
 * @typedef {Object} oBossObject
*/
/**
 * @typedef {Object} WTUserBossesResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oBossObject[]} array – массив
*/
/**
 * @typedef {Object} oUserBossesParams
 * @property {string} return_object_type
 * @property {string} return_object_value
 * @property {bigint} substitution_type_id
*/
/**
 * @function GetUserBosses
 * @memberof Websoft.WT.Main
 * @author LP
 * @description Возвращает список руководителей сотрудника.
 * @param {bigint} iUserID - ID пользователя
 * @param {bool} [bCheckMain] - проверять руководителей по должности
 * @param {bigint[]} [arrBossTypes] - массив ID типов руководителей
 * @param {oUserBossesParams} [oParams] - параметры возвращаемых данных
 * @param {bool} [bAllHier] - возвращать всех руководителей по иерархии
 * @returns {WTUserBossesResult}
 */
function GetUserBosses( iUserID, bCheckMain, arrBossTypes, oParams, bAllHier )
{
	return get_user_bosses( iUserID, null, bCheckMain, arrBossTypes, oParams, bAllHier )
}
function get_user_bosses( iUserID, feUser, bCheckMain, arrBossTypes, oParams, bAllHier )
{
	try
	{
		if( !IsArray( arrBossTypes ) )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		arrBossTypes = null;
	}
	try
	{
		if( bCheckMain == null || bCheckMain == undefined || bCheckMain == "" )
		{
			throw "error";
		}
		bCheckMain = tools_web.is_true( bCheckMain );
	}
	catch( ex )
	{
		bCheckMain = true;
	}
	if( bCheckMain && arrBossTypes != null )
	{
		arrBossTypes.push( tools.get_default_object_id( "boss_type", "main" ) );
	}
	try
	{
		if( DataType(oParams) != "object" )
		{
			throw "error";
		}
	}
	catch ( err )
	{
		oParams = ({});
	}
	try
	{
		if(bAllHier == undefined || bAllHier == null)
			throw "no param";
	}
	catch ( e )
	{
		bAllHier = true;
	}

	var bReturnPersons = oParams.GetOptProperty( 'return_object_type', 'collaborator' ) == 'collaborator';
	var bReturnID = oParams.GetOptProperty( 'return_object_value', 'field' ) == 'id';
	function return_result()
	{
		if( bReturnPersons )
		{
			if( ArrayOptFirstElem( oRes.array ) == undefined )
			{
				return oRes;
			}
			oRes.array = ArrayUnion( oRes.array, tools.get_func_manager_substitution( oRes.array, { 'person_field_name': 'This', 'substitution_type_id': oParams.GetOptProperty( 'substitution_type_id', null ) } ) );
			if( bReturnID )
			{
				return oRes;
			}
			else
			{
				if( ArrayOptFirstElem( oRes.array ) == undefined )
				{
					return oRes;
				}
				oRes.array = QueryCatalogByKeys( "collaborators", "id", oRes.array );
				return oRes;
			}
		}
		else
		{
			return oRes;
		}
	}

	function add_check_boss( arr )
	{
		if( !bAllHier )
		{
			var xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id != " + iUserID + " and MatchSome( $elem/object_id, ( " + ArrayMerge( arr, "This", "," ) + " ) ) " + ( arrBossTypes != null ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypes, "This", "," ) + " ) )" : "" ) + " return $elem" + ( bReturnPersons ? "/Fields('person_id')" : "" ) );
			if( ArrayOptFirstElem( xarrFuncManagers ) != undefined )
			{
				if( bReturnPersons )
				{
					oRes.array = ArrayExtract( xarrFuncManagers, "This.person_id.Value" );
				}
				else
				{
					oRes.array = xarrFuncManagers;
				}
				return true;
			}
		}
		else
		{
			aCheckedObjects = ArrayUnion( aCheckedObjects, arr );
		}
		return false;
	}


	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.array = [];
	
	if( arrBossTypes != null && ArrayOptFirstElem( arrBossTypes ) == undefined )
	{
		return oRes;
	}

	var xarrFuncManagers = new Array();
	iUserID = OptInt( iUserID );
	if( iUserID == undefined )
	{
		oRes.error = 1
		return oRes;
	}
	try
	{
		feUser.Name;
	}
	catch( ex )
	{
		feUser = ArrayOptFirstElem( XQuery( "for $elem in collaborators where $elem/id = " + iUserID + " return $elem/Fields('id','position_parent_id','org_id')" ) )
	}
	if ( feUser == undefined )
	{
		return oRes;
	}

	var aCheckedObjects = new Array();
	var aResultBosses = new Array();
	var aBossSubdivisions = new Array();

	if( add_check_boss( [ iUserID ] ) )
	{
		return return_result();
	}
	if( add_check_boss( ArrayExtract( XQuery( "for $elem in group_collaborators where $elem/collaborator_id = " + iUserID + " return $elem/Fields('group_id')" ), "This.group_id" ) ) )
	{
		return return_result();
	}

	if( feUser.position_parent_id.HasValue )
	{
		feSubdivision = feUser.position_parent_id.OptForeignElem;

		iNum = 0;
		while( iNum < 50 && feSubdivision != undefined )
		{
			if( ArrayOptFind( aCheckedObjects, "This == feSubdivision.id" ) != undefined )
			{
				break;
			}
			if( bAllHier )
			{
				aBossSubdivisions.push( feSubdivision.id )
				aCheckedObjects.push( feSubdivision.id );
			}
			else
			{
				if( bCheckMain )
				{
					xarrBossPositions = XQuery( "for $elem in subs where MatchSome( $elem/parent_id, ( " + feSubdivision.id + " ) ) and $elem/type = 'position' and $elem/basic_collaborator_id != null() and $elem/basic_collaborator_id != " + iUserID + " and $elem/is_boss = true() return $elem/Fields('id')" );
					if( ArrayOptFirstElem( xarrBossPositions ) != undefined )
					{
						if( add_check_boss( ArrayExtract( xarrBossPositions, "This.id" ) ) )
						{
							return return_result();
						}
					}
					if( add_check_boss( [ feSubdivision.id ] ) )
					{
						return return_result();
					}
				}
			}
			if( feSubdivision.parent_object_id.HasValue )
			{
				feSubdivision = feSubdivision.parent_object_id.OptForeignElem;
			}
			else
			{
				break;
			}
			iNum++;
		}
	}
	if( feUser.org_id.HasValue )
	{
		if( add_check_boss( [ feUser.org_id ] ) )
		{
			return return_result();
		}
	}
	if( bAllHier )
	{
		if( bCheckMain && ArrayOptFirstElem( aBossSubdivisions ) != undefined )
		{
			xarrBossPositions = XQuery( "for $elem in subs where MatchSome( $elem/parent_id, ( " + ArrayMerge( aBossSubdivisions, "This", "," ) + " ) ) and $elem/type = 'position' and $elem/basic_collaborator_id != " + iUserID + " and $elem/basic_collaborator_id != null() and $elem/is_boss = true() return $elem/Fields('id','basic_collaborator_id')" );
			if( ArrayOptFirstElem( xarrBossPositions ) != undefined )
			{
				aCheckedObjects = ArrayUnion( aCheckedObjects, ArrayExtract( xarrBossPositions, "This.id" ) );
			}
		}
	}

	if( ArrayOptFirstElem( aCheckedObjects ) != undefined )
	{
		xarrFuncManagers = XQuery( "for $elem in func_managers where $elem/person_id != " + iUserID + " and MatchSome( $elem/object_id, ( " + ArrayMerge( aCheckedObjects, "This", "," ) + " ) ) " + ( arrBossTypes != null ? " and MatchSome( $elem/boss_type_id, ( " + ArrayMerge( arrBossTypes, "This", "," ) + " ) )" : "" ) + " and some $pos in positions satisfies ($pos/id = $elem/person_position_id and $pos/is_position_finished != true() and ($pos/position_date = null() or $pos/position_date <= " + XQueryLiteral(Date()) + ") and ($pos/position_finish_date = null() or $pos/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $elem" + ( bReturnPersons ? "/Fields('person_id')" : "" ) );
		if( bReturnPersons )
		{
			oRes.array = ArrayExtract( xarrFuncManagers, "This.person_id.Value" );
		}
		else
		{
			oRes.array = xarrFuncManagers;
		}
	}
	return return_result();
}

function is_boss( iUserID, feUser, iBossID, bCheckMain, arrBossTypes )
{

	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.is_boss = false;

	iUserID = OptInt( iUserID );
	iBossID = OptInt( iBossID );
	if( iUserID == undefined || iBossID == undefined )
	{
		return oRes;
	}
	oRes.is_boss = ArrayOptFind( get_user_bosses( iUserID, feUser, bCheckMain, arrBossTypes, ({return_object_type: 'collaborator', return_object_value: 'id'}) ).array, "This == iBossID" ) != undefined;
	return oRes;
}

/**
 * @function IsBossCurUser
 * @memberof Websoft.WT.Main
 * author BG
 * @description Является ли текущий сотрудник руководителем текущего объекта или руководителем вообще
 * @param {bigint} iCurUserIDParam - ID текущего пользователя, проверяемого на руководителя
 * @param {?bigint} iObjectIDParam - ID объекта, для которого текущий пользователь проверяется на руководство (опционально)
 * @param {?bigint[]} arrBossTypesID - Коллекция ID типов руководителя (опционально)
 * @returns {WTLPEBooleanResult}
 */
function IsBossCurUser(iCurUserIDParam, iObjectIDParam, arrBossTypesID )
{
	var oRes = tools.get_code_library_result_object();
	oRes.flag = false;

	var iObjectID = OptInt(iObjectIDParam, null);

	try
	{
		var iCurUserID = CurRequest.Session.Env.GetOptProperty( "curUserID" );
		if(IsEmptyValue(iCurUserID))
			throw "no person is session"
	}
	catch(e)
	{
		iCurUserID = OptInt( iCurUserIDParam, null);
	}
	
	if(IsEmptyValue(iCurUserID))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'neudalospoluchi' );
		return oRes;
	}
	
	var condSomeBoss = [];
	condSomeBoss.push("$elem/person_id = " + iCurUserID);
	condSomeBoss.push("MatchSome($elem/catalog, ('position','group','subdivision','org','collaborator'))");
	
	if(IsArray(arrBossTypesID) && ArrayOptFirstElem(arrBossTypesID) != undefined)
		condSomeBoss.push("MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossTypesID, "OptInt(This,0)", ",") + "))");
	
	sSomeBossReq =  "for $elem in func_managers where " + ArrayMerge(condSomeBoss, "This", " and ") + " return $elem/Fields('id')";
	var catFuncManager = ArrayOptFirstElem( XQuery( sSomeBossReq ) );

	var bIsSomeBoss = (catFuncManager != undefined)

	var bIsBoss = false;
	if(iObjectID != null)
	{
		var docObject = tools.open_doc(iObjectID);
		if(docObject == undefined)
		{
			oRes.error = 502;
			oRes.errorText = StrReplace(i18n.t( 'obektsidparamn' ), "{PARAM1}", iObjectID);
			return oRes;
		}
		var teObject = docObject.TopElem;
		sObjectCatalogName = teObject.Name;

		var iPersonID = null;
		switch(sObjectCatalogName)
		{
			case "collaborator":
				iPersonID = iObjectID;
				break;
			case "position":
				iPersonID = teObject.basic_collaborator_id.Value;
				break;
			case "subdivision":
			case "org":
				iPersonID = null;
				break;
			case "career_resreve":
			case "active_learning":
			case "learning":
			case "active_test_learning":
			case "test_learning":
			case "assessment_appraise":
			case "blog_entry":
			case "blog_entry_comment":
			case "collaborator_schedule":
			case "expert":
			case "lector":
			case "library_material_item":
			case "library_material_viewing":
			case "like":
			case "participant":
			case "personnel_reserve":
			case "poll_procedure":
			case "poll_result":
			case "qualification_assignment":
			case "request":
			case "social_entrys":
			case "subscription":
			case "successor":
			case "time_entry":
			case "transaction":
			case "tutor":
				iPersonID = teObject.person_id.Value;
				break;
			case "task":
				iPersonID = teObject.executor_id.Value;
				break;
			default:
				iPersonID = null;
				break;
		
		}
		
		if(iPersonID == null)
		{
			oRes.flag = bIsSomeBoss;
		}
		else if(iPersonID == iCurUserID)
		{
			oRes.flag = bIsSomeBoss;
		}
		else
		{
			oResBoss = is_boss( iPersonID, null, iCurUserID );
			oRes.flag = oResBoss.is_boss;
			if(oResBoss.error != 0)
			{
				oRes.error = oResBoss.error;
				oRes.errorText = oResBoss.errorText;
			}
		}
	}
	else
	{
		oRes.flag = bIsSomeBoss;
	}
	
	return oRes;
}

/**
 * @typedef {Object} oBossManagementObject
 * @property {bigint} id
 * @property {string} name
 * @property {string} type
 * @property {string} type_name
 * @property {bigint} parent_id
*/
/**
 * @typedef {Object} WTBossManagementObjectsResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oBossManagementObject[]} array – массив
*/
/**
 * @function GetBossManagementObjects
 * @memberof Websoft.WT.Main
 * @description Получения списка объектов управления руководителя.
 * @param {bigint} iPersonID - ID пользователя
 * @param {boolean} bHierSubdivisions - Для руководителей подразделения брать все подразделения вниз по иерархии
 * @param {string[]} arrObjectTypes - перечень возвращаемых типов объектов
 * @param {boolean} bAddManagementObjectClearCommand - добавить команду на очистку объекта управления
 * @param {number} iMaxCnt - максимальное количество записей
 * @param {boolean} [bCheckDisbandedSub] - учитывать расформированные подразделения
 * @returns {WTBossManagementObjectsResult}
 */
function GetBossManagementObjects( iPersonID, bHierSubdivisions, arrObjectTypes, bAddManagementObjectClearCommand, iMaxCnt, bCheckDisbandedSub )
{
	var arrFullManagementObjects = get_boss_management_objects( iPersonID, bHierSubdivisions, iMaxCnt, null, bCheckDisbandedSub );
	
	if(arrObjectTypes == undefined || arrObjectTypes == null || arrObjectTypes == "")
		arrObjectTypes = ['group','subdivision','org','boss_type'];
	
	if(!IsArray(arrObjectTypes))
	{
		switch(arrObjectTypes)
		{
			case "group":
			case "subdivision":
			case "org":
			case "collaborator":
			case "boss_type":
				arrObjectTypes = [arrObjectTypes];
				break;
			default:
				arrObjectTypes = ['group','subdivision','org'];
		}
	}
	
	bAddManagementObjectClearCommand = tools_web.is_true(bAddManagementObjectClearCommand);
	
	var oRes = tools.get_code_library_result_object();
	//oRes.array = arrFullManagementObjects
	arrAdd = [];
	if(bAddManagementObjectClearCommand) 
		arrAdd.push({id: 0, name: i18n.t( 'sbrosobektaupr' ), type: "clear", type_name: i18n.t( 'sbros' ), temp_parent_id: "" });
	
	arrAdd.push({id: 9999, name: i18n.t( 'vsepodchinennye' ), type: "all", type_name: i18n.t( 'vse' ), temp_parent_id: "" });

	oRes.array = ArrayUnion(arrAdd, ArrayIntersect(arrFullManagementObjects, arrObjectTypes, "This.type", "This"));
	
	return oRes;
}

function get_boss_management_objects( iPersonID, bHierSubdivisions, iMaxCnt, oCacheData, bCheckDisbandedSub )
{

	function get_hier_subdivisions( iSubdivisionID, iOrgID )
	{
		var oHierSubObject = new Object();
		if( iOrgID != null )
		{
			var xarrHierSubdivisions = (tools.xquery( "for $elem in subdivisions where $elem/org_id = " + iOrgID + ( !bCheckDisbandedSub ? " and $elem/is_disbanded = false() " : "" ) + " return $elem/Fields('id', 'name', 'parent_object_id', 'org_id')" ));
		}
		else
		{
			var xarrHierSubdivisions = (tools.xquery( "for $elem in subdivisions where IsHierChild( $elem/id, " + ( IsArray( iSubdivisionID ) ? ArrayMerge( iSubdivisionID, "This", "," ) : iSubdivisionID ) + " ) " + ( !bCheckDisbandedSub ? " and $elem/is_disbanded = false() " : "" ) + " order by $elem/Hier() return $elem/Fields('id', 'name', 'parent_object_id', 'org_id')" ));
		}
		for( _subdivision in xarrHierSubdivisions )
		{
			oHierSubObject = new Object();
			oHierSubObject.id = _subdivision.id.Value;
			oHierSubObject.name = _subdivision.name.Value;
			oHierSubObject.type = "subdivision";
			oHierSubObject.temp_parent_id = "";
			oHierSubObject.parent_id = _subdivision.parent_object_id.HasValue ? _subdivision.parent_object_id.Value : _subdivision.org_id.Value;
			if( catSubdivisionExt != undefined )
			{
				oHierSubObject.type_name = catSubdivisionExt.title.Value;
			}
			arrResult.push( oHierSubObject );
		}
		return false;
	}
	try
	{
		if( IsEmptyValue( bCheckDisbandedSub ) )
		{
			throw "error";
		}
		bCheckDisbandedSub = tools_web.is_true( bCheckDisbandedSub );
	}
	catch( ex )
	{
		bCheckDisbandedSub = false;
	}
	var bReturnObject = false;
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = "";
	oRes.cache_data = new Object();
	if( ObjectType( oCacheData ) == "JsObject" )
	{
		bReturnObject = true;
		oRes.cache_data = oCacheData;
	}
	iMaxCnt = OptInt( iMaxCnt, 0 );
	var iCurrentCount = 0;
	var arrResult = [];
	var libParam = tools.get_params_code_library('libMain');

	iPersonID = OptInt( iPersonID );
	if(iPersonID == undefined)
	{
		throw i18n.t( 'nekorrektnyyid_1' );
	}

	try
	{
		if( bHierSubdivisions == null || bHierSubdivisions == "" || bHierSubdivisions == undefined )
		{
			throw "error";
		}
		bHierSubdivisions = tools_web.is_true( bHierSubdivisions );
	}
	catch ( err )
	{
		libParam = tools.get_params_code_library( "libStaff" );
		bHierSubdivisions = tools_web.is_true( libParam.GetOptProperty( "bHierSubdivisions", false ) );
	}
	if( oRes.cache_data.GetOptProperty( "func_managers" ) != undefined )
	{
		var xarrFuncManagers = oCacheData.GetOptProperty( "func_managers" );
	}
	else
	{
		var conds = new Array();
		conds.push( "$elem/person_id = " + iPersonID );
		conds.push( "MatchSome($elem/catalog, ('position','group','subdivision','org','collaborator'))" );
		// conds.push( "$elem/catalog != 'collaborator'" );
		var sReqFM = "for $elem in func_managers where " + ArrayMerge( conds, "This", " and " ) + ( !bCheckDisbandedSub ? " and ( $elem/catalog != 'subdivision' or $elem/is_finished = false() )" : "" ) + " order by $elem/object_id return $elem/Fields( 'catalog', 'object_id', 'object_name', 'parent_id', 'org_id', 'boss_type_id'  )" ;
		var xarrFuncManagers = XQuery( sReqFM );
		oRes.cache_data.SetProperty( "func_managers", xarrFuncManagers );
	}

	for( _object in ArraySelectDistinct(ArraySelect(xarrFuncManagers, "This.catalog.Value == 'collaborator' && This.boss_type_id.HasValue"), "boss_type_id") )
	{
		oManagementObject = new Object();

		oManagementObject.id = _object.boss_type_id.Value;
		oManagementObject.name = _object.boss_type_id.ForeignDispName;
		oManagementObject.type = "boss_type";
		oManagementObject.type_name = "Руководитель сотрудника";
		oManagementObject.temp_parent_id  = "";

		arrResult.push( oManagementObject );
	}
	
	var catSubdivisionExt = common.exchange_object_types.GetOptChildByKey( "subdivision" );

	var arrHierSubIds = new Array();
	for( _object in ArraySelect(xarrFuncManagers, "This.catalog.Value != 'collaborator'") )
	{
		oManagementObject = new Object();

		iObjectID = "";
		iTempParentID = "";
		sName = "";
		sType = "";
		switch( _object.catalog )
		{
			case "position":

				if( _object.parent_id.HasValue )
				{
					sType = "subdivision";
					feSubdivision = _object.parent_id.OptForeignElem;
					if( feSubdivision != undefined )
					{
						iObjectID = feSubdivision.id.Value;
						sName = feSubdivision.name.Value;
						iTempParentID = feSubdivision.parent_object_id.Value;
					}
				}
				else if( _object.org_id.HasValue )
				{
					sType = "org";
					iTempParentID = "";
					iObjectID = _object.org_id.Value;
					feOrg = _object.org_id.OptForeignElem;
					if( feOrg != undefined )
					{
						sName = feOrg.name.Value;
					}
				}
				else
				{
					continue;
				}
				break;

			case "subdivision":
				iTempParentID = _object.parent_id.HasValue ? _object.parent_id.Value : _object.org_id.Value;
			default:
				iObjectID = _object.object_id.Value;
				sName = _object.object_name.Value;
				sType = _object.catalog.Value;
				break;
		}
		
		if( ArrayOptFindByKey( arrResult, iObjectID, "id" ) != undefined )
		{
			continue;
		}
		oManagementObject.id = iObjectID;
		oManagementObject.name = sName;
		oManagementObject.type = sType;
		oManagementObject.temp_parent_id = iTempParentID;

		catExt = common.exchange_object_types.GetOptChildByKey( sType );
		if( catExt != undefined )
		{
			oManagementObject.type_name = catExt.title.Value;
		}
		arrResult.push( oManagementObject );
		iCurrentCount++;
		
		if( iMaxCnt <= 0  )
		{
			if( bHierSubdivisions && sType == "subdivision" )
			{
				arrHierSubIds.push( iObjectID );
				//get_hier_subdivisions( iObjectID, null );
			}
			else if( bHierSubdivisions && sType == "org" )
			{
				get_hier_subdivisions( null, iObjectID );
			}
		}
		else if( iCurrentCount >= iMaxCnt )
		{
			break;
		}
	}
	if( ArrayOptFirstElem( arrHierSubIds ) != undefined )
	{
		get_hier_subdivisions( arrHierSubIds, null );
	}
	if( iMaxCnt > 0 && iCurrentCount < iMaxCnt && bHierSubdivisions )
	{
		var arrNextArray = arrResult;
		var arrTempArray = new Array();
		var arrTempSubs = new Array();
		var xarrTempArray = new Array();
		var arrOrgArray = new Array();
		var arrSubArray = new Array();
		var bBreak = false;
		while( ArrayOptFirstElem( arrNextArray ) != undefined )
		{
			arrTempArray = new Array();
			arrOrgArray = ArraySelectByKey( arrNextArray, "org", "type" );
			arrSubArray = ArraySelectByKey( arrNextArray, "subdivision", "type" );
			if( ArrayOptFirstElem( arrOrgArray ) != undefined )
			{
				xarrTempArray = tools.xquery( "for $elem in subdivisions where MatchSome( $elem/org_id, ( " + ArrayMerge( arrOrgArray, "This.id", "," ) + " ) ) " + ( !bCheckDisbandedSub ? " and $elem/is_disbanded = false() " : "" ) + " and $elem/parent_object_id = null() return $elem/Fields('id', 'name', 'parent_object_id', 'org_id')" );
				for( _object in arrOrgArray )
				{
					arrTempSubs = ArraySelectByKey( xarrTempArray, _object.id, "org_id" );
					if( iMaxCnt < ( iCurrentCount + ArrayCount( arrTempSubs ) ) )
					{
						bBreak = true;
						break;
					}
					for( _subdivision in arrTempSubs )
					{
						if( ArrayOptFindByKey( arrResult, _subdivision.id.Value, "id" ) != undefined )
						{
							continue;
						}
						oHierSubObject = new Object();
						oHierSubObject.id = _subdivision.id.Value;
						oHierSubObject.name = _subdivision.name.Value;
						oHierSubObject.type = "subdivision";
						oHierSubObject.temp_parent_id = "";
						oHierSubObject.parent_id = _subdivision.parent_object_id.HasValue ? _subdivision.parent_object_id.Value : _subdivision.org_id.Value;
						if( catSubdivisionExt != undefined )
						{
							oHierSubObject.type_name = catSubdivisionExt.title.Value;
						}
						arrResult.push( oHierSubObject );
						arrTempArray.push( oHierSubObject );
						iCurrentCount++;
					}
				}
				if( bBreak )
				{
					break;
				}
			}
			if( ArrayOptFirstElem( arrSubArray ) != undefined )
			{
				xarrTempArray = tools.xquery( "for $elem_qc in subdivisions where MatchSome( $elem_qc/parent_object_id, ( " + ArrayMerge( arrSubArray, "This.id", "," ) + " ) ) " + ( !bCheckDisbandedSub ? " and $elem_qc/is_disbanded = false() " : "" ) + " return $elem_qc/Fields('id', 'name', 'parent_object_id', 'org_id')" );
				for( _object in arrSubArray )
				{
					arrTempSubs = ArraySelectByKey( xarrTempArray, _object.id, "parent_object_id" );
					if( iMaxCnt < ( iCurrentCount + ArrayCount( arrTempSubs ) ) )
					{
						bBreak = true;
						break;
					}
					for( _subdivision in arrTempSubs )
					{
						if( ArrayOptFindByKey( arrResult, _subdivision.id.Value, "id" ) != undefined )
						{
							continue;
						}
						oHierSubObject = new Object();
						oHierSubObject.id = _subdivision.id.Value;
						oHierSubObject.name = _subdivision.name.Value;
						oHierSubObject.type = "subdivision";
						oHierSubObject.temp_parent_id = "";
						oHierSubObject.parent_id = _subdivision.parent_object_id.HasValue ? _subdivision.parent_object_id.Value : _subdivision.org_id.Value;
						if( catSubdivisionExt != undefined )
						{
							oHierSubObject.type_name = catSubdivisionExt.title.Value;
						}
						arrResult.push( oHierSubObject );
						arrTempArray.push( oHierSubObject );
						iCurrentCount++;
					}
				}
				if( bBreak )
				{
					break;
				}
			}
			arrNextArray = arrTempArray;
		}
	}
	for( _object in ArraySelect( arrResult, "This.temp_parent_id != ''" ) )
	{
		if( ArrayOptFindByKey( arrResult, _object.temp_parent_id, "id" ) != undefined )
		{
			_object.SetProperty( "parent_id", _object.temp_parent_id );
		}
	}
	
	if( bReturnObject )
	{
		oRes.SetProperty( "result", arrResult );
		return oRes;
	}
	else
	{
		return arrResult;
	}
}

function get_subordinate_records(iPersonID, arrTypeSubordinate, bReturnIDs, sCatalog, arrFieldsNames, xQueryCond, bGetOrgSubordinate, bGetGroupSubordinate, bGetPersonSubordinate, bInHierSubdivision, arrBossTypeIDs, bWithoutUseManagementObject, iManagementObjectID, oSort )
{
// iUserID, ['fact','func'], true, '', null, '', true, false, true, true, arrBossTypesID, false, iManagementObjectID
//    1            2           3    4    5   6     7     8      9     10          11         12             13

	var oParams = {
			arrTypeSubordinate: arrTypeSubordinate,
			bReturnIDs: bReturnIDs,
			sCatalog: sCatalog,
			arrFieldsNames: arrFieldsNames,
			xQueryCond: xQueryCond,
			bGetOrgSubordinate: bGetOrgSubordinate,
			bGetGroupSubordinate: bGetGroupSubordinate,
			bGetPersonSubordinate: bGetPersonSubordinate,
			bInHierSubdivision: bInHierSubdivision,
			arrBossTypeIDs: arrBossTypeIDs,
			bWithoutUseManagementObject: bWithoutUseManagementObject,
			iManagementObjectID: iManagementObjectID,
			oSort: oSort
	};
	
	return GetSubordinateRecords(iPersonID, oParams);
}

/**
 * @typedef {Object} oSubordinateRecordParams
 * @memberof Websoft.WT.Main
 * @property {string[]} arrTypeSubordinate - массив типов отбора подчиненных. func - функциональные, fact - фактические (по должности или с типом «Непосредственный руководитель»)
 * @property {boolean} bReturnIDs - Возвращать массив ID вместо массива каталожных записей
 * @property {string} sCatalog - Каталог, из которого отбираются записи. . Если каталог не указан или указан каталог, не имеющий связей с сотрудниками – collaborators.
 * @property {string[]} arrFieldsNames - Массив имен полей, оставляемых в возврате функции. Если не указано - возвращаются все поля. 
 * @property {string} xQueryCond - Дополнительный отбор (фильтр Xquery-запроса)) в целевом каталоге. Относительно $elem_qc. 
 * @property {boolean} bGetOrgSubordinate - Добавляются подчиненные по организациям
 * @property {boolean} bGetGroupSubordinate - Добавляются подчиненные по группам
 * @property {boolean} bGetPersonSubordinate - Добавляются персональные подчиненные (непосредственно по сотрудникам)
 * @property {boolean} bGetGroupOutStaff - Добавляются сотрудники временного персонала, не привязанные к должности
 * @property {boolean} bGetGroupCandidates - Добавляются кандидаты, не привязанные к должности
 * @property {boolean} bInHierSubdivision - Подчиненные ищутся по всему дочернему поддереву подразделений (по умолчанию - true)
 * @property {bigint[]} arrBossTypeIDs - Массив ID типов руководителей для отбора по функциональному руководителю. В отборе по фактическому руководителю не используется. Если пустой массив - любые руководители
 * @property {boolean} bWithoutUseManagementObject - без учета выбранного объекта управления
 * @property {bigint} iManagementObjectID - ID объекта управления, передаваемого для текущего вызова функции
 * @property {oSort} oSort - параметры сортировки
*/
 
/**
 * @function GetSubordinateRecords
 * @memberof Websoft.WT.Main
 * @description Получения списка связанных с подчиненными текущего сотрудника каталожных записей указанного каталога.
 * author BG
 * @param {bigint} iPersonID - ID руководителя
 * @param {oSubordinateRecordParams} oParams - объект с параметрами вызова функции  
 * @returns {bigint[]}
 */
function GetSubordinateRecords(iPersonID, oParams)
{ 
	if(DataType(oParams) != 'object' || ObjectType(oParams) != 'JsObject')
	{
		oParams = {
			arrTypeSubordinate: ['fact', 'func'],
			bReturnIDs: false,
			sCatalog: "",
			arrFieldsNames: null,
			xQueryCond: "",
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: false,
			bGetPersonSubordinate: false,
			bGetGroupOutStaff: false,
			bGetGroupCandidates: false,
			bInHierSubdivision: true,
			arrBossTypeIDs: [],
			bWithoutUseManagementObject: false,
			iManagementObjectID: null,
			oSort: {FIELD: null, DIRECTION: ""}
		};
	}
	else
	{
		if(!oParams.HasProperty('arrTypeSubordinate'))
			oParams.SetProperty('arrTypeSubordinate', ['fact', 'func']);

		if(!oParams.HasProperty('bReturnIDs'))
			oParams.SetProperty('bReturnIDs', false);

		if(!oParams.HasProperty('sCatalog'))
			oParams.SetProperty('sCatalog', "");

		if(!oParams.HasProperty('arrFieldsNames'))
			oParams.SetProperty('arrFieldsNames', null);

		if(!oParams.HasProperty('xQueryCond'))
			oParams.SetProperty('xQueryCond', "");

		if(!oParams.HasProperty('bGetOrgSubordinate'))
			oParams.SetProperty('bGetOrgSubordinate', true);

		if(!oParams.HasProperty('bGetGroupSubordinate'))
			oParams.SetProperty('bGetGroupSubordinate', false);
		
		if(!oParams.HasProperty('bGetGroupOutStaff'))
			oParams.SetProperty('bGetGroupOutStaff', false);
		
		if(!oParams.HasProperty('bGetGroupCandidates'))
			oParams.SetProperty('bGetGroupCandidates', false);

		if(!oParams.HasProperty('bGetPersonSubordinate'))
			oParams.SetProperty('bGetPersonSubordinate', false);

		if(!oParams.HasProperty('bInHierSubdivision'))
			oParams.SetProperty('bInHierSubdivision', true);

		if(!oParams.HasProperty('arrBossTypeIDs'))
			oParams.SetProperty('arrBossTypeIDs', []);

		if(!oParams.HasProperty('bWithoutUseManagementObject'))
			oParams.SetProperty('bWithoutUseManagementObject', false);

		if(!oParams.HasProperty('iManagementObjectID'))
			oParams.SetProperty('iManagementObjectID', null);

		if(!oParams.HasProperty('oSort'))
			oParams.SetProperty('oSort', {FIELD: null, DIRECTION: ""});
	}

	var sInPlaceEvalArguments = "";
	for(sObjName in oParams)
	{
		switch(ObjectType(oParams.GetProperty(sObjName)))
		{
			case 'JsObject':
			case 'JsArray':
				sInPlaceEvalArguments += sObjName + " = " + EncodeJson(oParams.GetProperty(sObjName)) + ";\r\n";
				break;
			default:
				sInPlaceEvalArguments += sObjName + " = " + CodeLiteral(oParams.GetProperty(sObjName)) + ";\r\n";
		}
	}
	InPlaceEval(sInPlaceEvalArguments);

	function getBossTypeConds(arrBossTypeIDs, bExcludeMainType)
	{
		var elemBossType = ArrayOptFirstElem(arrBossTypeIDs);
		var sBossTypeCond = "";
		if(elemBossType == undefined)
			return "";

		if(bExcludeMainType)
			arrBossTypeIDs = ArraySelect(arrBossTypeIDs, "This != tools.get_default_object_id('boss_type', 'main')");

		return " and MatchSome($fm/boss_type_id, (" + ArrayMerge(arrBossTypeIDs, "This", ",") + "))";
	}

	function getLinkFieldName(sCatalog)
	{
		switch(sCatalog)
		{
			case "collaborator":
				return "id";
			case "position":
				return "basic_collaborator_id";
			case "career_reserve":
			case "active_learning":
			case "learning":
			case "active_test_learning":
			case "test_learning":
			case "assessment_appraise":
			case "blog_entry":
			case "blog_entry_comment":
			case "collaborator_schedule":
			case "expert":
			case "lector":
			case "library_material_item":
			case "library_material_viewing":
			case "like":
			case "participant":
			case "personnel_reserve":
			case "poll_procedure":
			case "poll_result":
			case "qualification_assignment":
			case "request":
			case "social_entrys":
			case "subscription":
			case "successor":
			case "time_entry":
			case "transaction":
			case "tutor":
			case "knowledge_acquaint":
				return "person_id";
			case "task":
				return "executor_id";
			case "group_collaborator":
				return "collaborator_id";

		}

		return "";
	}
	
	bGetOrgSubordinate = tools_web.is_true(bGetOrgSubordinate);
	bGetGroupSubordinate = tools_web.is_true(bGetGroupSubordinate);
	bGetPersonSubordinate = tools_web.is_true(bGetPersonSubordinate);
	bReturnIDs = tools_web.is_true(bReturnIDs);

	bWithoutUseManagementObject = tools_web.is_true(bWithoutUseManagementObject);

	if(arrBossTypeIDs == null || arrBossTypeIDs == undefined || !IsArray(arrBossTypeIDs))
		arrBossTypeIDs = getDefaultBossTypeIDs();

	if(arrTypeSubordinate == null || arrTypeSubordinate == undefined)
		arrTypeSubordinate = ['fact','func'];

	if(arrFieldsNames == null || arrFieldsNames == undefined)
		arrFieldsNames = [];

	if(sCatalog == null || sCatalog == undefined)
		sCatalog = "";

	if(xQueryCond == null || xQueryCond == undefined)
		xQueryCond = "";

	if(xQueryCond != "")
		xQueryCond = " and " + xQueryCond;

	if(bInHierSubdivision == null || bInHierSubdivision == undefined || bInHierSubdivision == "")
		var sSubdivisionLinkField = "subdivision_id";
	else
		var sSubdivisionLinkField = tools_web.is_true(bInHierSubdivision) ? "subdivision_id" : "parent_sub_id";

	bGetFactualSubordinate = (ArrayOptFind(arrTypeSubordinate, "This == 'fact'") != undefined)
	bGetFunctionalSubordinate = (ArrayOptFind(arrTypeSubordinate, "This == 'func'") != undefined)

	if(!bGetFactualSubordinate && !bGetFunctionalSubordinate)
		return [];

	var sFieldsSuff = (ArrayOptFirstElem(arrFieldsNames) != undefined) ? "/Fields(" + ArrayMerge(arrFieldsNames, "XQueryLiteral(This)", ",") + ")" : "";
	if(bReturnIDs)
		sFieldsSuff = "/Fields('id')"

	var oCurrentManagementObject = null;
	if(!bWithoutUseManagementObject)
	{
		if(iManagementObjectID != undefined && iManagementObjectID != null && iManagementObjectID != "")
		{
			oCurrentManagementObject = calculate_management_object_by_id(iManagementObjectID);
		}
		else
		{
			oCurrentManagementObject = get_current_management_object(iPersonID);
		}
	}
	var aPersonIDLists = [];
	var aFuncManagers, aCatalogFMs, sResultReq, sResultReq_bis;

	if(bGetFactualSubordinate && (oCurrentManagementObject == null || oCurrentManagementObject.catalog == "all"))
	{
		aFuncManagers = tools.xquery("for $fm in func_managers where $fm/person_id = " + iPersonID + " and $fm/is_native = true() and $fm/is_finished != true() and ($fm/start_date = null() or $fm/start_date <= " + XQueryLiteral(Date()) + ") and ($fm/end_date = null() or $fm/end_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $fm");

		// Должности подразделений
		aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'position' && This.parent_id.HasValue")
		if(ArrayOptFirstElem(aCatalogFMs) != undefined)
		{
			sResultReq = "for $elem_qc in person_hierarchys where MatchSome($elem_qc/" + sSubdivisionLinkField + ",(" + ArrayMerge(aCatalogFMs, "This.parent_id.Value", ",") + ")) and $elem_qc/collaborator_id != " + iPersonID + " and some $pshn in positions satisfies ($pshn/id = $elem_qc/position_id and $pshn/is_position_finished != true() and ($pshn/position_date = null() or $pshn/position_date <= " + XQueryLiteral(Date()) + ") and ($pshn/position_finish_date = null() or $pshn/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $elem_qc/Fields('collaborator_id')";
			aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.collaborator_id.Value", ","))
		}

		if(bGetOrgSubordinate)
		{
			// Должности организаций
			aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'position' && !This.parent_id.HasValue")
			if(ArrayOptFirstElem(aCatalogFMs) != undefined)
			{
				// sResultReq = "for $elem in collaborators where MatchSome($elem/org_id,(" + ArrayMerge(aCatalogFMs, "This.org_id.Value", ",") + ")) and $elem/id != " + iPersonID + " return $elem/Fields('id')";
				sResultReq = "for $elem in positions where MatchSome($elem/org_id, (" + ArrayMerge( aCatalogFMs, "This.org_id.Value", "," ) + ")) and $elem/basic_collaborator_id != " + iPersonID + " and $elem/basic_collaborator_id != null() and $elem/is_position_finished != true() and ($elem/position_date = null() or $elem/position_date <= " + XQueryLiteral(Date()) + ") and ($elem/position_finish_date = null() or $elem/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $elem/Fields('basic_collaborator_id')";
				aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.basic_collaborator_id.Value", ","))
			}
		}
	}

	if(oCurrentManagementObject != null && oCurrentManagementObject.catalog != "all" && oCurrentManagementObject.catalog != "boss_type")
	{
		aFuncManagers = [oCurrentManagementObject];
	}
	else
	{
		var sAddCatalogCond = "";
		if(oCurrentManagementObject != null && oCurrentManagementObject.catalog == "boss_type")
		{
			arrBossTypeIDs = [oCurrentManagementObject.object_id];
			sAddCatalogCond = " and $fm/catalog = 'collaborator'";
		}

		if(bGetFactualSubordinate && bGetFunctionalSubordinate)
		{
			var sReqFuncManagers = "for $fm in func_managers where $fm/person_id = " + iPersonID + " and $fm/is_finished != true() and ($fm/start_date = null() or $fm/start_date <= " + XQueryLiteral(Date()) + ") and ($fm/end_date = null() or $fm/end_date >= " + XQueryLiteral(DateNewTime(Date())) + ") " + getBossTypeConds(arrBossTypeIDs, false) + sAddCatalogCond + " return $fm";
		}
		else if(bGetFunctionalSubordinate)
		{
			var sReqFuncManagers = "for $fm in func_managers where $fm/person_id = " + iPersonID + getBossTypeConds(arrBossTypeIDs, true) + sAddCatalogCond + " and $fm/is_native != true() return $fm";
		}
		else if(bGetFactualSubordinate)
		{
			var sReqFuncManagers = "for $fm in func_managers where $fm/person_id = " + iPersonID + sAddCatalogCond + " and $fm/is_native = true() and $fm/is_finished != true() and ($fm/start_date = null() or $fm/start_date <= " + XQueryLiteral(Date()) + ") and ($fm/end_date = null() or $fm/end_date >= " + XQueryLiteral(DateNewTime(Date())) + ") return $fm";
		}
		aFuncManagers = tools.xquery(sReqFuncManagers);
	}

	// Подразделения
	aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'subdivision'")
	if(ArrayOptFirstElem(aCatalogFMs) != undefined)
	{
		sResultReq = "for $hier in person_hierarchys where MatchSome($hier/" + sSubdivisionLinkField + ",(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $hier/collaborator_id != " + iPersonID + " and some $pshn in positions satisfies ($pshn/id = $hier/position_id and $pshn/is_position_finished != true() and ($pshn/position_date = null() or $pshn/position_date <= " + XQueryLiteral(Date()) + ") and ($pshn/position_finish_date = null() or $pshn/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $hier/Fields('collaborator_id')";
		aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.collaborator_id.Value", ","))
	}

	// В организации
	if(bGetOrgSubordinate || (oCurrentManagementObject != null && oCurrentManagementObject.catalog != "all"))
	{
		aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'org'")
		if(ArrayOptFirstElem(aCatalogFMs) != undefined)
		{
			sResultReq = "for $elem in collaborators where MatchSome($elem/org_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem/id != " + iPersonID + " and some $pshn in positions satisfies ($pshn/basic_collaborator_id = $elem/id and $pshn/is_position_finished != true() and ($pshn/position_date = null() or $pshn/position_date <= " + XQueryLiteral(Date()) + ") and ($pshn/position_finish_date = null() or $pshn/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $elem/Fields('id')";
			sResultReq_bis = "for $elem in collaborators where MatchSome($elem/org_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem/id != " + iPersonID + " and $elem/position_id = null() return $elem/Fields('id')";
			aPersonIDLists.push(ArrayMerge(ArrayUnion(tools.xquery(sResultReq_bis), tools.xquery(sResultReq)), "This.id.Value", ","))
		}
	}

	// В группе
	if(bGetGroupSubordinate || (oCurrentManagementObject != null && oCurrentManagementObject.catalog != "all"))
	{
		aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'group'")
		if(ArrayOptFirstElem(aCatalogFMs) != undefined)
		{
			sResultReq = "for $gc in group_collaborators where MatchSome($gc/group_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $gc/collaborator_id != " + iPersonID + " and some $pshn in positions satisfies ($pshn/basic_collaborator_id = $gc/collaborator_id and $pshn/is_position_finished != true() and ($pshn/position_date = null() or $pshn/position_date <= " + XQueryLiteral(Date()) + ") and ($pshn/position_finish_date = null() or $pshn/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $gc/Fields('collaborator_id')";
			sResultReq_bis = "for $gc in group_collaborators where MatchSome($gc/group_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $gc/collaborator_id != " + iPersonID + " and some $pshn in collaborators satisfies ($pshn/id = $gc/collaborator_id and $pshn/position_id = null()) return $gc/Fields('collaborator_id')";
			aPersonIDLists.push(ArrayMerge(ArrayUnion(tools.xquery(sResultReq_bis), tools.xquery(sResultReq)), "This.collaborator_id.Value", ","))

			if ( bGetGroupOutStaff )
			{
				sResultReq = "for $gc in group_collaborators where MatchSome($gc/group_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $gc/collaborator_id != " + iPersonID + " and some $pshn in collaborators satisfies ($pshn/id = $gc/collaborator_id and $pshn/is_outstaff = true() and $pshn/position_id = null()) return $gc/Fields('collaborator_id')";
				aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.collaborator_id.Value", ","));
			}
			if ( bGetGroupCandidates )
			{
				sResultReq = "for $gc in group_collaborators where MatchSome($gc/group_id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $gc/collaborator_id != " + iPersonID + " and some $pshn in collaborators satisfies ($pshn/id = $gc/collaborator_id and $pshn/is_candidate = true() and $pshn/position_id = null()) return $gc/Fields('collaborator_id')";
				aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.collaborator_id.Value", ","));
			}
		}
	}

	// Сотрудники напрямую.
	if(bGetPersonSubordinate || (oCurrentManagementObject != null && oCurrentManagementObject.catalog != "all"))
	{
		aCatalogFMs = ArraySelect(aFuncManagers, "This.catalog == 'collaborator'")
		if(ArrayOptFirstElem(aCatalogFMs) != undefined)
		{
			sResultReq = "for $elem_qc in collaborators where MatchSome($elem_qc/id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem_qc/id != " + iPersonID + " and some $pshn in positions satisfies ($pshn/basic_collaborator_id = $elem_qc/id and $pshn/is_position_finished != true() and ($pshn/position_date = null() or $pshn/position_date <= " + XQueryLiteral(Date()) + ") and ($pshn/position_finish_date = null() or $pshn/position_finish_date >= " + XQueryLiteral(DateNewTime(Date())) + ")) return $elem_qc/Fields('id')";
			sResultReq_bis = "for $elem_qc in collaborators where MatchSome($elem_qc/id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem_qc/id != " + iPersonID + " and $elem_qc/position_id = null() return $elem_qc/Fields('id')";
			aPersonIDLists.push(ArrayMerge(ArrayUnion(tools.xquery(sResultReq_bis), tools.xquery(sResultReq)), "This.id.Value", ","))
			if ( bGetGroupOutStaff )
			{
				sResultReq = "for $elem_qc in collaborators where MatchSome($elem_qc/id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem_qc/id != " + iPersonID + " and $elem_qc/position_id = null() and $elem_qc/is_outstaff = true() return $elem_qc/Fields('id')";
				aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.id.Value", ","));
			}
			if ( bGetGroupCandidates )
			{
				sResultReq = "for $elem_qc in collaborators where MatchSome($elem_qc/id,(" + ArrayMerge(aCatalogFMs, "This.object_id", ",") + ")) and $elem_qc/id != " + iPersonID + " and $elem_qc/position_id = null() and $elem_qc/is_candidate = true() return $elem_qc/Fields('id')";
				aPersonIDLists.push(ArrayMerge(tools.xquery(sResultReq), "This.id.Value", ","));
			}
		}
	}

	var sFinalPersonIDList = ArrayMerge(ArraySelect(aPersonIDLists, "This != ''"), "This", ",");

	xQueryCond = StrReplace(xQueryCond, "$elem/", "$elem_qc/")
	var sReqFinal = "for $elem_qc in collaborators where MatchSome($elem_qc/id, (" + sFinalPersonIDList + ")) " + xQueryCond + " return $elem_qc" + sFieldsSuff;
	if(sCatalog != "")
	{
		var xqCatalog = common.exchange_object_types.GetOptChildByKey(sCatalog);
		if(xqCatalog != undefined)
		{
			var sCondSort = "";
			if(oSort != null && oSort != undefined && ObjectType(oSort) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
			{
					var sCatalogDataForm = StrReplace(xqCatalog.form_url.Value, ".xmd", "s.xmd");
					var xmCatalogElem = OpenNewDoc(sCatalogDataForm).TopElem;
					var bHasFieldInCatalog = xmCatalogElem.Add().ChildExists(oSort.FIELD);
					if(bHasFieldInCatalog)
						sCondSort = " order by [{CURSOR}]/" + oSort.FIELD + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
			}
			var sLinkFieldName = getLinkFieldName(sCatalog);
			if(sLinkFieldName != "")
			{
				sReqFinal = "for $elem_qc in " + sCatalog + "s where MatchSome($elem_qc/" + sLinkFieldName + ", (" + sFinalPersonIDList + ")) " + xQueryCond + StrReplace(sCondSort, "[{CURSOR}]", "$elem_qc") + " return $elem_qc" + sFieldsSuff;
			}
			else
			{
				sReqFinal = "for $elem_qc in collaborators where MatchSome($elem_qc/id, (" + sFinalPersonIDList + ")) " + xQueryCond + StrReplace(sCondSort, "[{CURSOR}]", "$elem_qc") + " return $elem_qc" + sFieldsSuff;
			}
		}
	}

	var arrFinalRecords = tools.xquery(sReqFinal);
	if(bReturnIDs)
	{
		arrFinalRecords = ArrayExtract(arrFinalRecords, "id");
	}

	return arrFinalRecords;
 }
 
function get_subordinate_xquery_cond(iPersonIDParam, oParam)
{
// Xquery condition отбора подчиненных для стандартного системного диалогового окна.

	function get_conds_to_string(arrCondition)
	{
		return (ArrayOptFirstElem(arrCondition) != undefined) ? ArrayMerge(arrCondition, "This", " or ") : "false()";
	};

	var iMaxCount = 65535;
	var iCount = 0;
	var arrConds = [];

	var iPersonID = OptInt(iPersonIDParam);
	if(iPersonID == undefined)
		throw i18n.t( 'idrukovoditelya' );

	if(DataType(oParam) != 'object' || ObjectType(oParam) != 'JsObject')
	{
		oParam = {
			bGetGroupSubordinate: false,
			bGetPersonSubordinate: false,
			bIsSubdivisionHier: true,
		};
	}
	else
	{
		if(!oParam.HasProperty('bGetGroupSubordinate'))
			oParam.SetProperty('bGetGroupSubordinate', false);

		if(!oParam.HasProperty('bGetPersonSubordinate'))
			oParam.SetProperty('bGetPersonSubordinate', false);

		if(!oParam.HasProperty('bIsSubdivisionHier'))
			oParam.SetProperty('bIsSubdivisionHier', true);
	}
	
	// Org
	var sReqOrg = "for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iPersonID + " return $elem";
	var arrOrgs = tools.xquery(sReqOrg);
	if(ArrayOptFirstElem(arrOrgs) != undefined)
	{
		iCount += ArrayCount(arrOrgs);
		if(iCount > iMaxCount)
			return get_conds_to_string(arrConds);
		
		arrConds.push("MatchSome($elem/org_id, (" + ArrayMerge(arrOrgs, "This.object_id.Value", ",") + "))")
	}

	// Subdivision
	var sSubdivisionLinkField =( tools_web.is_true(oParam.bIsSubdivisionHier)) ? "subdivision_id" : "parent_sub_id";

	var sReqSubdivision1 = "for $elem in func_managers where $elem/catalog = 'position' and $elem/is_native = true() and  $elem/parent_id != null() and $elem/person_id = " + iPersonID + " return $elem";
	var arrSubdivisionsIDs = ArrayExtract(tools.xquery(sReqSubdivision1), "parent_id");
	var sReqSubdivision2 = "for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iPersonID + " return $elem";
	arrSubdivisionsIDs = ArrayUnion(arrSubdivisionsIDs, ArrayExtract(tools.xquery(sReqSubdivision2), "object_id"));
	if(ArrayOptFirstElem(arrSubdivisionsIDs) != undefined)
	{
		var sReqPersonHier = "for $hier in person_hierarchys where MatchSome($hier/" + sSubdivisionLinkField + ",(" + ArrayMerge(arrSubdivisionsIDs, "This", ",") + ")) and $hier/collaborator_id != " + iPersonID + " return $hier/Fields('collaborator_id')";
		var arrPersonHier = tools.xquery(sReqPersonHier);
		if(ArrayOptFirstElem(arrPersonHier) != undefined)
		{
			iCount += ArrayCount(arrPersonHier);
			if(iCount > iMaxCount)
				return get_conds_to_string(arrConds);
			
			arrConds.push("MatchSome($elem/id, (" + ArrayMerge(arrPersonHier, "This.collaborator_id.Value", ",") + "))")
		}
	}

	// Person
	if(tools_web.is_true(oParam.bGetPersonSubordinate))
	{
		var sReqPerson = "for $elem in func_managers where $elem/catalog = 'collaborator' and $elem/person_id = " + iPersonID + " return $elem";
		var arrPersons = tools.xquery(sReqPerson);
		if(ArrayOptFirstElem(arrPersons) != undefined)
		{
			iCount += ArrayCount(arrPersons);
			if(iCount > iMaxCount)
				return get_conds_to_string(arrConds);

			arrConds.push("MatchSome($elem/id, (" + ArrayMerge(arrPersons, "This.object_id.Value", ",") + "))")
		}
	}

	// Group
	if(tools_web.is_true(oParam.bGetPersonSubordinate))
	{
		var sReqGroup = "for $elem in func_managers where $elem/catalog = 'group' and $elem/person_id = " + iPersonID + " return $elem";
		var arrGroup = tools.xquery(sReqGroup);
		if(ArrayOptFirstElem(arrGroup) != undefined)
		{
			var sReqGroupCollaborator = "for $elem in group_collaborators where MatchSome($elem/group_id, (" + ArrayMerge(arrGroup, "This.object_id.Value", ",") + ")) return $elem";
			var arrGroupCollaborators = tools.xquery(sReqGroupCollaborator);
			if(ArrayOptFirstElem(arrGroupCollaborators) != undefined)
			{
				iCount += ArrayCount(arrGroupCollaborators);
				if(iCount > iMaxCount)
					return get_conds_to_string(arrConds);

				arrConds.push("MatchSome($elem/id, (" + ArrayMerge(arrGroupCollaborators, "This.collaborator_id.Value", ",") + "))")
			}
		}
	}

	return get_conds_to_string(arrConds);
}


/**
 * @function GetTypicalSubordinates
 * @memberof Websoft.WT.Main
 * @description Получения типичных наборов подчиненных с использованием параметров из библиотеки процесса.
 * @param {bigint} iPersonID - ID руководителя
 * @param {string?} sTypeSubordinate - тип подчиненных
 * @param {bigint[]?} arrBossTypesID - типы руководителей для отбора по функциональным руководителям
 * @param {boolean?} bReturnIDs - Возвращать массив ID (иначе - каталожные записи)
 * @param {string?} sXQueryCond - Дополнительное условие отбора в XQuery
 * @param {string[]} [arrResultFieldNames] - массив возвращаемых полей
 * @returns {bigint[]}
 */
function GetTypicalSubordinates(iPersonID, sTypeSubordinate, arrBossTypesID, bReturnIDs, sXQueryCond, arrResultFieldNames )
{
	if((sTypeSubordinate == undefined || sTypeSubordinate == null || sTypeSubordinate == "") && (arrBossTypesID == undefined || arrBossTypesID == null || !IsArray(arrBossTypesID)))
	{
		var libParam = tools.get_params_code_library('libMain');
		if(sTypeSubordinate == undefined || sTypeSubordinate == null || sTypeSubordinate == "")
		{
			sTypeSubordinate = libParam.GetOptProperty("DefaultSubordinateType", "all_subordinates"); //by default: Непосредственные и функциональные подчиненные с иерархией
		}

		if(arrBossTypesID == undefined || arrBossTypesID == null || !IsArray(arrBossTypesID))
		{
			arrBossTypesID = [];
			switch(sTypeSubordinate)
			{
				case "func_subordinates":
				case "all_subordinates":
				{
					var iBossTypeIDs = libParam.GetOptProperty("iBossTypeIDs", "[]");
					arrBossTypesID = tools_web.parse_multiple_parameter(iBossTypeIDs);
					if( ArrayOptFirstElem(arrBossTypesID) == undefined)
					{
						var sBossTypeCodes = Trim("" + libParam.GetOptProperty("sBossTypeCodes", ""));
						if(sBossTypeCodes != "")
						{
							var arrBossTypeCodes = tools_web.parse_multiple_parameter(sBossTypeCodes);
							arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where MatchSome($elem/code, (" + ArrayMerge(arrBossTypeCodes, "XQueryLiteral(This)", ",") + ")) return $elem/Fields('id')"), "This.id.Value");
						}
					}
					break;
				}
			}
		}
	}

	bReturnIDs = tools_web.is_true(bReturnIDs);
	if(sXQueryCond == undefined || sXQueryCond == null)
		sXQueryCond = "";
	if( IsEmptyValue( arrResultFieldNames ) )
	{
		arrResultFieldNames = null;
	}

	var oGetSubordinateParams = {
			arrTypeSubordinate: ['fact','func'],
			bReturnIDs: bReturnIDs,
			sCatalog: "",
			arrFieldsNames: arrResultFieldNames,
			xQueryCond: sXQueryCond,
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			arrBossTypeIDs: [],
			bWithoutUseManagementObject: false,
			iManagementObjectID: null,
			oSort: null
	};

	switch(sTypeSubordinate)
	{
		case "main_subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['fact'];
			oGetSubordinateParams.bGetGroupSubordinate = false;
			oGetSubordinateParams.bGetPersonSubordinate = false;
			oGetSubordinateParams.bInHierSubdivision = false;
			return GetSubordinateRecords( iPersonID, oGetSubordinateParams);
		case "subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['fact'];
			oGetSubordinateParams.bGetGroupSubordinate = true;
			oGetSubordinateParams.bGetPersonSubordinate = true;
			oGetSubordinateParams.bInHierSubdivision = true;
			return GetSubordinateRecords( iPersonID, oGetSubordinateParams);
		case "func_subordinates":
			oGetSubordinateParams.arrTypeSubordinate = ['func'];
			oGetSubordinateParams.arrBossTypeIDs = arrBossTypesID;
			oGetSubordinateParams.bInHierSubdivision = true;
			return GetSubordinateRecords( iPersonID, oGetSubordinateParams);
		case "all_subordinates":
			oGetSubordinateParams.arrBossTypeIDs = arrBossTypesID;
			oGetSubordinateParams.bInHierSubdivision = true;
			return GetSubordinateRecords( iPersonID, oGetSubordinateParams);
	}


	return [];
}

/**
 * @typedef {Object} oBossSubdivisionPath
 * @property {bigint} id - ID подразделения
 * @property {string} name - Наименование подразделения
 * @property {string} link - Ссылка на карточку подразделения
 * @property {string} parent_id - ID родительского подразделения
 * @property {boolean} is_disbanded - Признак расформированности подразделения
 * @property {int} position – Порядковый номер подразделения в списке
 * @property {bigint} root_id - ID корневого подразделения
 * @property {string} root_name - Наименование корневого подразделения
 * @property {int} root_position – Порядковый номер поддерева
*/
/**
 * @typedef {Object} WTBossSubdivisionPathResult
 * @property {int} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {boolean} result – результат
 * @property {oBossSubdivisionPath[]} array – массив
*/
/**
 * @function GetSubdivisionPath
 * @memberof Websoft.WT.Main
 * @description Получения списков подразделений руководителя от текущего до корня дерева подразделений.
 * @param {bigint} iPersonID - ID руководителя
 * @param {boolean} bSortFromRoot - true - сортировка списка ОТ корня (сверху вниз); false - сортировка списка К корню (снизу вверх)
 * @returns {WTBossSubdivisionPathResult}
 */

function GetSubdivisionPath(iPersonID, bSortFromRoot)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];

	var xqHierSubdivision = ArrayOptFirstElem(tools.xquery("for $elem in person_hierarchys where $elem/collaborator_id = " + OptInt(iPersonID) + " return $elem/Fields('subdivision_id')"));

	if(xqHierSubdivision == undefined)
		return [];

	var sReqSubdivisions =  "for $elem in subdivisions where MatchSome( $elem/id, (" + ArrayMerge(xqHierSubdivision.subdivision_id, "This", ",") + ") ) return $elem";
	var xqSubdivisions = tools.xquery( sReqSubdivisions );
	var arrSubdivisionPath = ArrayExtract(xqSubdivisions, "({ 'id': This.id.Value, name: This.name.Value, link: tools_web.get_mode_clean_url( null,  This.id.Value ), parent_id: This.parent_object_id.Value, is_disbanded: tools_web.is_true(This.is_disbanded.Value), position: null, root_id: null , root_name: null , root_position: null })");

	var fldNextSubdivision, iNextSubdivID, position;
	var root_position = 0;
	for(itemRoot in ArraySort(ArraySelect(arrSubdivisionPath, "This.parent_id == null"), "This.name", "+"))
	{
		fldNextSubdivision = itemRoot
		position = 0
		iNextSubdivID;

		while (fldNextSubdivision != undefined)
		{
			fldNextSubdivision.SetProperty("position", position);
			fldNextSubdivision.SetProperty("root_id", itemRoot.id);
			fldNextSubdivision.SetProperty("root_name", itemRoot.name);
			fldNextSubdivision.SetProperty("root_position", root_position);
			iNextSubdivID = fldNextSubdivision.id;
			fldNextSubdivision =  ArrayOptFind(arrSubdivisionPath, "This.parent_id == " + iNextSubdivID);
			position++;
		}
		root_position++;
	}

	var sSort = tools_web.is_true(bSortFromRoot) ? "+" : "-";
	arrSubdivisionPath = ArraySort(arrSubdivisionPath, "This.root_position", "+", "This.position", sSort);

	oRes.array = arrSubdivisionPath;

	return oRes;
}

function calculate_management_object_by_id(iManagementObjectID)
{
	iManagementObjectID = OptInt(iManagementObjectID);
	if(iManagementObjectID == undefined)
		return null;

	var iOrgID = null;
	var iParentID = null;
	var sObjectName = "";
	var sCatalogName = "";
	var sCatalog = "";
	if(iManagementObjectID != 9999)
	{
		xmlCurrentManagementObjectDoc = tools.open_doc(iManagementObjectID);
		if(xmlCurrentManagementObjectDoc == undefined)
			return null;
		xmlCurrentManagementObjectTE = xmlCurrentManagementObjectDoc.TopElem;

		sCatalog = xmlCurrentManagementObjectTE.Name;

		switch(sCatalog)
		{
			case "position":
			case "subdivision":
			{
				iOrgID = xmlCurrentManagementObjectTE.org_id.Value;
				iParentID = xmlCurrentManagementObjectTE.parent_object_id.Value;
				sObjectName = xmlCurrentManagementObjectTE.name.Value;
				sCatalogName = i18n.t( 'podrazdelenie' );
				break;
			}
			case "org":
			{
				iOrgID = iManagementObjectID;
				sObjectName = xmlCurrentManagementObjectTE.name.Value;
				sCatalogName = i18n.t( 'organizaciya' );
				break;
			}
			case "group":
			{
				sObjectName = xmlCurrentManagementObjectTE.name.Value;
				sCatalogName = i18n.t( 'gruppa' );
				break;
			}
			case "boss_type":
			{
				sObjectName = xmlCurrentManagementObjectTE.name.Value;
				sCatalogName = i18n.t( 'rukovod_sotrud' );
				break;
			}
			case "collaborator":
			{
				iOrgID = xmlCurrentManagementObjectTE.org_id.Value;
				iParentID = xmlCurrentManagementObjectTE.position_parent_id.Value;
				sObjectName = RValue(xmlCurrentManagementObjectTE.fullname);
				sCatalogName = i18n.t( 'sotrudnik' );
				break;
			}
		}
	}
	else
	{
		sObjectName = i18n.t( 'vsepodchinennye' );
		sCatalogName = "Any";
		sCatalog = "all";
	}

	return ({
		"object_id": iManagementObjectID,
		"object_name": sObjectName,
		"catalog": sCatalog,
		"catalog_name": sCatalogName,
		"is_native": true,
		"parent_id": iParentID,
		"org_id": iOrgID
		});
}

function set_current_management_object(iPersonID, iCurrentManagementObjectID)
{
	var oManagementObject = calculate_management_object_by_id(iCurrentManagementObjectID);

	return tools_web.set_user_data("CurrentManagementObject_" + StrHexInt(Int(iPersonID)), oManagementObject, 86400);
}

function get_current_management_object(iPersonID)
{
	var oCurrentManagementObject = get_saved_management_object(iPersonID);
	if(oCurrentManagementObject != null)
	{
		return oCurrentManagementObject;
	}

	var arrBossManagementObjects = get_boss_management_objects(iPersonID, true );
	var oManagementObject = ArrayOptFirstElem(arrBossManagementObjects);
	var bHasManyManagementObject = (ArrayCount(arrBossManagementObjects) > 1);
	if(oManagementObject != undefined)
	{
		if(!bHasManyManagementObject)
		{
			var bDoSave = set_current_management_object(iPersonID, oManagementObject.id);
			if(bDoSave)
				return get_saved_management_object(iPersonID);
			//return ({"object_id": oManagementObject.id, "object_name": oManagementObject.name, "catalog": oManagementObject.type, "catalog_name": oManagementObject.type_name, "is_native": true, "parent_id": null, "org_id": null});
		}
		var sReqOwnManagement = "for $elem_qc in person_hierarchys where MatchSome($elem_qc/parent_sub_id, (" + ArrayMerge(arrBossManagementObjects, "This.id", ",") + ")) and $elem_qc/collaborator_id = " + iPersonID + " return $elem_qc";
		var catOwnManagementSubdivision = ArrayOptFirstElem(tools.xquery(sReqOwnManagement));
		if(catOwnManagementSubdivision != undefined)
		{
			bDoSave = set_current_management_object(iPersonID, catOwnManagementSubdivision.parent_sub_id.Value);
			if(bDoSave)
				return get_saved_management_object(iPersonID);
		}
	}

	return ({"object_id": 9999, "object_name": i18n.t( 'vsepodchinennye' ), "catalog": "all", "catalog_name": "Any", "is_native": true, "parent_id": null, "org_id": null});
}

function get_saved_management_object(iPersonID)
{
	var oRet = tools_web.get_user_data("CurrentManagementObject_" + StrHexInt(Int(iPersonID)));
	return oRet;
}

function clear_current_management_object(iPersonID)
{
	return tools_web.remove_user_data("CurrentManagementObject_" + StrHexInt(iPersonID));
}

/**
 * @typedef {Object} EffectivenessContext
 * @property {boolean} is_high_effectiveness – Сотрудник является высокоэффективным.
 * @property {number} effectiveness_level – Уровень эффективности сотрудника. Если в оценок у сотрудника нет - пустая строка
*/
/**
 * @typedef {Object} ReturnEffectivenessContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {EffectivenessContext} context – Контекст .
*/
/**
 * @function GetPersonEffectivenessContext
 * @memberof Websoft.WT.Main
 * @author BG
 * @description Контекст эффективности сотрудника.
 * @param {bigint} iPersonID - ID сотрудника.
 * @param {string[]} arrAssessmentAppraiseTypes - Массив типов оценки. По умолчанию - activity_appraisal.
 * @returns {ReturnEffectivenessContext}
*/
function GetPersonEffectivenessContext( iPersonID, arrAssessmentAppraiseTypes )
{
	var oRes = tools.get_code_library_result_object();
	oRes.context = new Object;

	try
	{
		iPersonID = Int( iPersonID );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
	}


	var libParam = tools.get_params_code_library('libMain');

	if(arrAssessmentAppraiseTypes == null || arrAssessmentAppraiseTypes == undefined || !IsArray(arrAssessmentAppraiseTypes) || ArrayOptFirstElem(arrAssessmentAppraiseTypes) == undefined)
	{
		arrAssessmentAppraiseTypes = tools_web.parse_multiple_parameter( libParam.GetOptProperty("sDefaultAssessmentAppraiseTypes", "[]"));
	}

	if(!IsArray(arrAssessmentAppraiseTypes) || ArrayOptFirstElem(arrAssessmentAppraiseTypes) == undefined)
		arrAssessmentAppraiseTypes = ['activity_appraisal'];

	var iHighEffectivenessLevel = OptInt(libParam.GetOptProperty("DefaultHighEffectivenessLevel", 80), 80);
	var iEffectivenessPeriod = OptInt(libParam.GetOptProperty("EffectivenessPeriod", 365), 365);
	
	var bIsDone = tools_web.is_true(libParam.GetOptProperty("bIsDone", true));
	
	var sXQueryConds = "";
	if (bIsDone)
	{
		sXQueryConds += " and $elem/is_done = true()";
	}
	
	var bIsFinal = tools_web.is_true(libParam.GetOptProperty("bIsFinal", false));
	if (bIsFinal)
	{
		sXQueryConds += " and $elem/is_final = true()";
	}
	
	var sStatusConds = "";
	var sAssessmentStatus = libParam.GetOptProperty("sAssessmentStatus", "finish");
	if (sAssessmentStatus == "active_finish")
	{
		sStatusConds += " and ($appr/status = '1' or $appr/status = '0')";
	}
	else
	{
		sStatusConds += " and $appr/status = '1'";
	}

	var sReqAssessmentForms = "for $elem in pas where MatchSome($elem/assessment_appraise_type, (" + ArrayMerge(arrAssessmentAppraiseTypes, "XQueryLiteral(This)", ",") + ") ) and $elem/person_id = " + XQueryLiteral(iPersonID) + sXQueryConds + " and some $appr in assessment_appraises satisfies ($elem/assessment_appraise_id = $appr/id " + sStatusConds + " and($appr/end_date > " + XQueryLiteral(DateOffset(Date(), (0-iEffectivenessPeriod)*86400)) + " or $appr/end_date = null())) order by $elem/modification_date descending return $elem";
	var xarrAssessmentForms = tools.xquery(sReqAssessmentForms);
	var iEffectiveness = ArrayOptFirstElem(xarrAssessmentForms, {overall:""}).overall;

	oRes.context = {
		"is_high_effectiveness"	: (OptInt(iEffectiveness,0) > iHighEffectivenessLevel),
		"effectiveness_level"	: iEffectiveness
	};
	return oRes;
}

/**
 * @function StrDateInterval
 * @memberof Websoft.WT.Main
 * @author BG
 * @description Возвращает строковое представление временного интервала в формате [ X лет Y месяцев Z дней ]
 * @param {datetime} dStartDate - начало интервала.
 * @param {datetime} dEndDate - начало интервала.
 * @returns {string}
*/
function StrDateInterval(dStartDate, dEndDate, bShowMonth, bShowDays )
{
	try
	{
		if(bShowMonth == undefined || bShowMonth == null || bShowMonth == "")
			throw 'broken'
	}
	catch(e)
	{
		bShowMonth = true;
	}
	try
	{
		if(bShowDays == undefined || bShowDays == null || bShowDays == "")
			throw 'broken'
	}
	catch(e)
	{
		bShowDays = true;
	}
	dStartDate = OptDate(dStartDate);
	if(dStartDate == undefined)
		throw i18n.t( 'nachalointerval' );

	dEndDate = OptDate(dEndDate);
	if(dEndDate == undefined)
		dEndDate = Date();

	if(dStartDate > dEndDate)
	{
		var dTemp = dEndDate;
		dEndDate = dStartDate;
		dStartDate = dTemp;
	}

	var curYear = Year(dEndDate);
	// определение високосного года
	var arrDayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var bIsBisSextus = false;
	if(curYear%400 == 0)
		bIsBisSextus = true;
	else if(curYear%100 == 0)
		bIsBisSextus = false;
	else if(curYear%4 == 0)
		bIsBisSextus = true;

	if(bIsBisSextus)
		arrDayInMonth[1] = 29;

	var iPositionDateYear = curYear - Year(dStartDate);

	var iPositionDateMonth = Month(dEndDate) - Month(dStartDate);
	if(iPositionDateMonth < 0)
	{
		iPositionDateYear -= 1;
		iPositionDateMonth += 12
	}

	var iPositionDateDay = Day(dEndDate) - Day(dStartDate);
	if(iPositionDateDay < 0)
	{
		iPositionDateMonth -= 1;
		if(iPositionDateMonth < 0)
		{
			iPositionDateYear -= 1;
			iPositionDateMonth += 12
		}

		iTargetMonthIndex = Month(dEndDate) == 1 ? 12 : Month(dEndDate)-1;
		iPositionDateDay += arrDayInMonth[iTargetMonthIndex-1]
	}

	return iPositionDateYear + GetNumSuffix(iPositionDateYear, "year") + ( bShowMonth ? ( ( iPositionDateMonth != 0 ? ( " " + iPositionDateMonth + GetNumSuffix(iPositionDateMonth, "month") ) : "" ) + ( bShowDays ? ( ( iPositionDateDay != 0 ? ( " " + iPositionDateDay + GetNumSuffix(iPositionDateDay, "day") ) : "" ) ) : "" ) ) : "" );
}

/**
 * @function GetNumSuffix
 * @memberof Websoft.WT.Main
 * @description Суффикс для числа лет или месяцев.
 * @param {int} iNum - Число для которого определяется суффикс
 * @param {string} sType - Тип суффикса. year - лет, month - месяцев
 * @returns {string}
*/
function GetNumSuffix(iNum, sType, curLngWeb)
{
	try
	{
		curLngWeb;
		if(curLngWeb == undefined || curLngWeb == null || curLngWeb == "")
			throw 'broken'
	}
	catch(e)
	{
		curLngWeb = tools_web.get_default_lng_web();
	}

	var oConst ={
		"month": [StrLowerCase(tools.get_web_str('tm5jxtl2m3')), StrLowerCase(tools.get_web_str('mesyaca')), StrLowerCase(tools.get_web_str('mesyacev'))],
		"year": [StrLowerCase(tools.get_web_str('god')), StrLowerCase(tools.get_web_str('goda')), StrLowerCase(tools.get_web_str('let'))],
		"day": [StrLowerCase(tools.get_web_str('w6n76t3f75')), StrLowerCase(tools.get_web_str('dnya')), StrLowerCase(tools.get_web_str('2kaidfx9na'))]
	};
	var arrCurConst = oConst.GetOptProperty(sType, oConst.year);

	var iModule = iNum % 100;
	if(iModule > 10 && iModule < 20)
		return " " + arrCurConst[2];

	iModule = iNum % 10;
	switch(iModule)
	{
		case 1:
			return " " + arrCurConst[0];
		case 2:
		case 3:
		case 4:
			return " " + arrCurConst[1];
		default:
			return " " + arrCurConst[2];
	}
}

/**
 * @typedef {Object} oSimpleFieldElem
 * @memberof Websoft.WT.Main
 * @property {string} name
 * @property {string} type
 * @property {string} value
*/
/**
 * @typedef {Object} WTOrgDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function OrgDelete
 * @memberof Websoft.WT.Main
 * @description Удаление организации/организаций
 * @author EO
 * @param {bigint[]} arrOrgIDs - массив ID организаций
 * @returns {WTOrgDeleteResult}
*/
function OrgDelete( arrOrgIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrOrgIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrOrgIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "org")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet' );
		return oRes;
	}

	sOrgIDs = ArrayMerge( arrOrgIDs, "This", "," );
	xarrSubdivs = tools.xquery("for $elem in subdivisions where MatchSome($elem/org_id, (" + sOrgIDs + ")) return $elem/Fields('org_id')");
	xarrPositions = tools.xquery("for $elem in positions where MatchSome($elem/org_id, (" + sOrgIDs + ")) return $elem/Fields('org_id')");

	for (itemOrgID in arrOrgIDs)
	{
		try
		{
			iOrgID = OptInt(itemOrgID);
			if(iOrgID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			if ( ( ArrayOptFind (xarrSubdivs, "This.org_id == iOrgID") == undefined ) && ( ArrayOptFind (xarrPositions, "This.org_id == iOrgID") == undefined ) )
			{
				try
				{
					DeleteDoc( UrlFromDocID( iOrgID ), false);
				}
				catch(err)
				{
					throw i18n.t( 'oshibkaudaleniya' );
				}
				oRes.count++;
			}
		}
		catch(err)
		{
			alert("ERROR: OrgDelete: " + ("[" + itemOrgID + "]\r\n") + err, true);
		}
	}
	return oRes;
}

/**
 * @function DeleteObjects
 * @memberof Websoft.WT.Main
 * @description Удаление объектов
 * @author PL
 * @param {string} sCatalogName - каталог объектов
 * @param {WTScopeWvars} SCOPE_WVARS - JSON объект с параметрами удаленного действия
 * @param {WTScopeWvars} PARAMETERS - JSON объект с параметрами удаленного действия
 * @param {integer} iUserID - ID сотрудника
 * @returns {WTLPEFormResult}
*/
function DeleteObjects( sCatalogName, SCOPE_WVARS, PARAMETERS, iUserID, teUser )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.action_result = ({});
	function getParam(_oFormFields, _sName)
	{
		result = "";
		try
		{
			_tmpFld = ArrayOptFind(_oFormFields, "This.name=='" + _sName + "'");
			result = _tmpFld != undefined ? String(_tmpFld.value) : PARAMETERS.GetOptProperty(_sName);
		}
		catch (_err)
		{
			result = "";
			return result;
		}
		return result;
	}

	function get_objects_id()
	{
		var sObjectIDs = "";
		if ( getParam( oFormFields, "selected_objects_id" ) == undefined || getParam( oFormFields, "selected_objects_id" ) == "" )
		{
			try
			{
				var arr = tools_web.parse_multiple_parameter( getParam( oFormFields, "aObjects" ) );
				if( ArrayOptFirstElem( arr )== undefined && getParam( oFormFields, "sObjects" ) != "" )
				{
					arr = tools_web.parse_multiple_parameter( getParam( oFormFields, "sObjects" ) );
				}
				if( ArrayOptFirstElem( arr ) != undefined )
				{
					return arr;
				}
			}
			catch (_err)
			{
				sObjectIDs = "";
			}
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "SELECTED_OBJECT_IDS" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "OBJECT_ID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if ( sObjectIDs == "" )
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "curObjectID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
		}
		else
		{
			sObjectIDs = getParam(oFormFields, "selected_objects_id");
		}

		return ( sObjectIDs != "" ? String( sObjectIDs ).split( ";" ) : [] );
	}
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
	function get_confirm_title( iCount )
	{
		switch( sCatalogName )
		{
			case "risk_perspective":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno' ) : i18n.t( 'vydeystvitelno_1' ) );
			case "key_position":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_2' ) : i18n.t( 'vydeystvitelno_3' ) );
			case "risk_level":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_4' ) : i18n.t( 'vydeystvitelno_5' ) );
			case "key_position_threat":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_6' ) : i18n.t( 'vydeystvitelno_7' ) );
			case "blog_entry_comment":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_8' ) : i18n.t( 'vydeystvitelno_9' ) );
			case "blog_entry":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_10' ) : i18n.t( 'vydeystvitelno_11' ) );
			case "blog":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_12' ) : i18n.t( 'vydeystvitelno_13' ) );
			case "learning_task_result":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_14' ) : i18n.t( 'vydeystvitelno_15' ) );
			case "qualification":
				if (sParam == "reward"){
					_text = iCount == 1 ? i18n.t( 'nagradu' ) : i18n.t( 'nagrady' );
				}
				else if (sParam == "badge"){
					_text = iCount == 1 ? i18n.t( 'beydzh' ) : i18n.t( 'beydzhi' );
				}
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_16' ) + _text + "?" : i18n.t( 'vydeystvitelno_16' ) + _text + "?" );
			case "qualification_assignment":
				if (sParam == "reward"){
					_text = iCount == 1 ? i18n.t( 'nagradu' ) : i18n.t( 'nagrady' );
				}
				else if (sParam == "badge"){
					_text = iCount == 1 ? i18n.t( 'beydzh' ) : i18n.t( 'beydzhi' );
				}
				return ( iCount == 1 ? i18n.t( 'vyhotiteudalit' ) + _text + "?" : i18n.t( 'vyhotiteudalit' ) + _text + "?" );
			case "policy_type":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_17' ) : i18n.t( 'vydeystvitelno_18' ) );
			case "policy":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_19' ) : i18n.t( 'vydeystvitelno_20' ) );
			case "learning_task":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_21' ) : i18n.t( 'vydeystvitelno_22' ) );
			case "forum_entry":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_10' ) : i18n.t( 'vydeystvitelno_11' ) );
			case "forum":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_23' ) : i18n.t( 'vydeystvitelno_24' ) );
			case "item":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_25' ) : i18n.t( 'vydeystvitelno_26' ) );
			case "assessment":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_27' ) : i18n.t( 'vydeystvitelno_28' ) );
			case "attorney":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_29' ) : i18n.t( 'vydeystvitelno_30' ) );
			case "collaborator_schedule":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_31' ) : i18n.t( 'vydeystvitelno_32' ) );
			case "interval_schedule":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_33' ) : i18n.t( 'vydeystvitelno_34' ) );
			case "restricting_collaborator_schedule":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_35' ) : i18n.t( 'vydeystvitelno_36' ) );
			case "absence_reserve":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_37' ) : i18n.t( 'vydeystvitelno_38' ) );
			case "schedule_type":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_39' ) : i18n.t( 'vydeystvitelno_40' ) );
			case "presence_state":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_41' ) : i18n.t( 'vydeystvitelno_42' ) );
			case "check_schedule":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_43' ) : i18n.t( 'vydeystvitelno_44' ) );
			case "restricting_type":
				return ( iCount == 1 ? i18n.t( 'vydeystvitelno_45' ) : i18n.t( 'vydeystvitelno_46' ) );
		}
		return "";
	}
	function get_end_title( iCount, iDelCount )
	{
		switch( sCatalogName )
		{
			case "risk_perspective":
				return ( iDelCount == iCount ? i18n.t( 'urovniriskauda' ) : StrReplace( StrReplace( i18n.t( 'udalenourovney' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "key_position":
				return ( iDelCount == iCount ? i18n.t( 'klyuchevyedolzhno' ) : StrReplace( StrReplace( i18n.t( 'udalenoklyuchevy' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "risk_level":
				return ( iDelCount == iCount ? i18n.t( 'faktoryriskaud' ) : StrReplace( StrReplace( i18n.t( 'udalenofaktoro' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "key_position_threat":
				return ( iDelCount == iCount ? i18n.t( 'ugrozyklyuchevym' ) : StrReplace( StrReplace( i18n.t( 'udalenougrozpa' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "blog_entry_comment":
				return ( iDelCount == iCount ? i18n.t( 'kommentariiuda' ) : StrReplace( StrReplace( i18n.t( 'udalenokomment' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "blog_entry":
				return ( iDelCount == iCount ? i18n.t( 'soobsheniyaudale' ) : StrReplace( StrReplace( i18n.t( 'udalenosoobshen' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "blog":
				return ( iDelCount == iCount ? i18n.t( 'blogiudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenoblogovp' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "learning_task_result":
				return i18n.t( 'zadaniyapolzova' );
			case "qualification":
				if (sParam == "reward"){
					_text = i18n.t( 'nagrady_1' );
					_finish_text = i18n.t( 'udalenonagradp' )
				}
				else if (sParam == "badge"){
					_text = i18n.t( 'beydzhi_1' );
					_finish_text = i18n.t( 'udalenobeydzhey' );
				}
				return ( iDelCount == iCount ? _text + i18n.t( 'udaleny' ) : StrReplace( StrReplace( _finish_text, "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "qualification_assignment":
				if (sParam == "reward"){
					return i18n.t( 'nagradyudaleny' );
				}
				else if (sParam == "badge"){
					return i18n.t( 'beydzhiudaleny' );
				}
			case "policy_type":
				return ( iDelCount == iCount ? i18n.t( 'tipypolisovuda' ) : StrReplace( StrReplace( i18n.t( 'udalenotipovpo' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "policy":
				return i18n.t( 'polisysotrudni' );
			case "learning_task":
				return ( iDelCount == iCount ? i18n.t( 'zadaniyaudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenozadaniy' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "forum_entry":
				return ( iDelCount == iCount ? i18n.t( 'soobsheniyaudale' ) : StrReplace( StrReplace( i18n.t( 'udalenosoobshen_1' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "forum":
				return ( iDelCount == iCount ? i18n.t( 'forumyudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenoforumov' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "item":
				return ( iDelCount == iCount ? i18n.t( 'voprosyudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenovoproso' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "assessment":
				return ( iDelCount == iCount ? i18n.t( 'testyudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenotestovp' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "attorney":
				return i18n.t( 'doverennostiud' );
			case "interval_schedule":
				return ( iDelCount == iCount ? i18n.t( 'intervalyudaleny' ) : StrReplace( StrReplace( i18n.t( 'udalenointervalov' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "collaborator_schedule":
				return ( iDelCount == iCount ? i18n.t( 'udalenygrafikisotrudnika' ) : StrReplace( StrReplace( i18n.t( 'udalenografikovsotrudnika' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "restricting_collaborator_schedule":
				return ( iDelCount == iCount ? i18n.t( 'udalenyogranicheniyagrafikasotrudnika' ) : StrReplace( StrReplace( i18n.t( 'udalenoogranicheniyagrafikasotrudnika' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "presence_state":
				return ( iDelCount == iCount ? i18n.t( 'udaleny_tipprisutstviyaotsutstviya' ) : StrReplace( StrReplace( i18n.t( 'udaleno_tipprisutstviyaotsutstviya' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "absence_reserve":
				return ( iDelCount == iCount ? i18n.t( 'udaleny_rezervnaotsutstvie' ) : StrReplace( StrReplace( i18n.t( 'udaleno_rezervnaotsutstvie' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "check_schedule":
				return ( iDelCount == iCount ? i18n.t( 'udaleny_proverkagrafika' ) : StrReplace( StrReplace( i18n.t( 'udaleno_proverkagrafika' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "restricting_type":
				return ( iDelCount == iCount ? i18n.t( 'udaleny_tipogranicheniya' ) : StrReplace( StrReplace( i18n.t( 'udaleno_tipogranicheniya' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
			case "schedule_type":
				return ( iDelCount == iCount ? i18n.t( 'udaleny_tipgrafika' ) : StrReplace( StrReplace( i18n.t( 'udaleno_tipgrafika' ), "{PARAM1}", iDelCount ), "{PARAM2}", iCount ) );
		}
		return "";
	}
	function check_can_delete( doc )
	{
		if( doc.TopElem.Name != sCatalogName )
		{
			return false;
		}
		switch( sCatalogName )
		{
			case "risk_perspective":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in key_positions where MatchSome( $elem/risk_perspective_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('risk_perspective_id')" ), "This.risk_perspective_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "risk_perspective_id" ) != undefined )
				{
					return false;
				}
				break;
			case "key_position":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in successors where MatchSome( $elem/key_position_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('key_position_id')" ), "This.key_position_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "key_position_id" ) != undefined )
				{
					return false;
				}
				break;
			case "key_position_threat":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in key_positions where MatchSome( $elem/key_position_threat_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('key_position_threat_id')" ), "This.key_position_threat_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "key_position_threat_id" ) != undefined )
				{
					return false;
				}
				break;
			case "blog_entry_comment":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in blog_entry_comments where MatchSome( $elem/parent_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('parent_id')" ), "This.parent_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "parent_id" ) != undefined )
				{
					return false;
				}
				break;
			case "blog_entry":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in blog_entry_comments where MatchSome( $elem/blog_entry_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('blog_entry_id')" ), "This.blog_entry_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "blog_entry_id" ) != undefined )
				{
					return false;
				}
				break;
			case "blog":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in blog_entrys where MatchSome( $elem/blog_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('blog_id')" ), "This.blog_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "blog_id" ) != undefined )
				{
					return false;
				}
				break;
			case "qualification":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in qualification_assignments where MatchSome( $elem/qualification_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('qualification_id')" ), "This.qualification_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "qualification_id" ) != undefined )
				{
					return false;
				}
				break;
			case "policy_type":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in policys where MatchSome( $elem/policy_type_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('policy_type_id')" ), "This.policy_type_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "policy_type_id" ) != undefined )
				{
					return false;
				}
				break;
			case "learning_task":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in learning_task_results where MatchSome( $elem/learning_task_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('learning_task_id')" ), "This.learning_task_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "learning_task_id" ) != undefined )
				{
					return false;
				}
				break;
			case "forum_entry":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in forum_entrys where MatchSome( $elem/parent_forum_entry_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('parent_forum_entry_id')" ), "This.parent_forum_entry_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "parent_forum_entry_id" ) != undefined )
				{
					return false;
				}
				break;
			case "forum":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( XQuery( "for $elem in forum_entrys where MatchSome( $elem/forum_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('forum_id')" ), "This.forum_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "forum_id" ) != undefined )
				{
					return false;
				}
				break;
			case "assessment":
				if( xarrTempArray == null )
				{
					xarrTempArray = ArraySelectDistinct( ArrayUnion(
						XQuery( "for $elem in test_learnings where MatchSome( $elem/assessment_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('assessment_id')" ),
						XQuery( "for $elem in active_test_learnings where MatchSome( $elem/assessment_id, ( " + ArrayMerge( arrObjectIDs, "This", "," ) + " ) ) return $elem/Fields('assessment_id')" ) ), "This.assessment_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "assessment_id" ) != undefined )
				{
					return false;
				}
				break;
			case "item":
				if( xarrTempArray == null )
				{
					xarrTempArray = new Array();
					for( _assessment in XQuery( "for $elem in assessments return $elem/Fields('id')" ) )
					{
						docAssessment = tools.open_doc( _assessment.id );
						if( docAssessment == undefined )
						{
							continue;
						}
						for( _section in docAssessment.TopElem.sections )
						{
							for( _item in _section.items )
							{
								if( _item.id.HasValue )
								{
									xarrTempArray.push( { "item_id": _item.id.Value } );
								}
							}
						}
					}
					xarrTempArray = ArraySelectDistinct( xarrTempArray, "This.item_id" );
				}
				if( ArrayOptFindByKey( xarrTempArray, doc.DocID, "item_id" ) != undefined )
				{
					return false;
				}
				break;
			case "risk_level":
				if( xarrTempArray == null )
				{
					xarrTempArray = XQuery( "for $elem in key_positions where " + ArrayMerge( arrObjectIDs, "'contains( $elem/risk_levels, ' + XQueryLiteral( String( This ) ) + ' )'", " or " ) + " return $elem/Fields('risk_levels')" );
					var arr = new Array();
					for( _elem in xarrTempArray )
					{
						arr = ArrayUnion( arr, String( _elem.risk_levels ).split( ";" ) );
					}
					xarrTempArray = ArraySelectDistinct( arr, "This" );
					xarrTempArray = ArrayExtract( xarrTempArray, "OptInt( This )" );
				}
				if( ArrayOptFind( xarrTempArray, "This == doc.DocID" ) != undefined )
				{
					return false;
				}
				break;
		}
		return true;
	}
	try
	{
		oFormFields = ParseJson(PARAMETERS.GetOptProperty("form_fields", []));
	}
	catch ( _err )
	{
		try
		{
			oFormFields = ParseJson( SCOPE_WVARS.GetOptProperty( "form_fields", "[]" ) );
		}
		catch ( _err )
		{
			oFormFields = [];
		}
	}
	try
	{
		iUserID = Int( iUserID )
	}
	catch( ex )
	{
		oRes.action_result = {
			command: "alert",
			msg: i18n.t( 'peredannekorre_3' ),
		};
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
			teUser = tools.open_doc( iUserID ).TopElem;
		}
		catch( ex )
		{
			oRes.action_result = {
				command: "alert",
				msg: i18n.t( 'peredannekorre_3' ),
			};
			return oRes;
		}
	}
	/*if( !tools_auth.check_lds_access_obj( teUser, null, 'delete', sCatalogName ) )
	{
		oRes.action_result = {
			command: "alert",
			msg: i18n.t( 'uvasnetpravdlya' ),
		};
		return oRes;
	}*/

	var arrObjectIDs = get_objects_id();

	if( ArrayOptFirstElem( arrObjectIDs ) == undefined )
	{
		if(sCatalogName == "qualification_assignment")
		{
			oRes.action_result = {
				command: "close_form",
				msg: i18n.t( 'snachalavyberit' )
			}
		}
		else
		{
			oRes.action_result = {
				command: "select_object",
				title: StrReplace( i18n.t( 'vyberiteparamd' ), "{PARAM1}", StrLowerCase( common.exchange_object_types.GetOptChildByKey( sCatalogName ).title ) ),
				message: StrReplace( i18n.t( 'vyberiteparamd' ), "{PARAM1}", StrLowerCase( common.exchange_object_types.GetOptChildByKey( sCatalogName ).title ) ),
				catalog_name: sCatalogName,
				xquery_qual: "",
				field_name: "selected_objects_id",
				multi_select: true,
				form_fields: []
			};
		}
		
		merge_form_fields()
		return oRes;
	}
	
	var sParam = "";
	if (sCatalogName == "qualification")
	{
		oReward = ArrayOptFirstElem(tools.xquery("for $elem in qualifications where $elem/id = " + ArrayOptFirstElem(arrObjectIDs) + " and $elem/is_reward = true() return $elem/Fields('id')"));
		if (oReward != undefined){
			sParam = "reward";
		}
		else {
			sParam = "badge"
		}
	}
	if (sCatalogName == "qualification_assignment")
	{
		oReward = ArrayOptFirstElem(tools.xquery("for $elem in qualification_assignments where $elem/id = " + ArrayOptFirstElem(arrObjectIDs) + " and $elem/is_reward = true() return $elem/Fields('id')"));
		if (oReward != undefined){
			sParam = "reward";
		}
		else {
			sParam = "badge"
		}
	}

	var bConfirm = tools_web.is_true( getParam( oFormFields, "confirm" ) );
	if( !bConfirm )
	{
		oRes.action_result = {
			command: "confirm",
			msg: get_confirm_title( ArrayCount( arrObjectIDs ) ),
			confirm_result: {
				command: "eval",
				form_fields: [ { name: "confirm", value: true, type: "hidden" } ]
			}
		};
		merge_form_fields();
		return oRes;
	}

	var xarrTempArray = null;
	var xarrTemp2Array = null;
	var iDeletedCount = 0;
	var iAllCount = ArrayCount( arrObjectIDs );
	for( _object_id in arrObjectIDs )
		try
		{
			_object_id = Int( _object_id );
			docObject = tools.open_doc( _object_id );
			if( docObject == undefined )
			{
				continue;
			}
			if( check_can_delete( docObject ) )
			{
				DeleteDoc( UrlFromDocID( _object_id ) );
				iDeletedCount++;

				if (sCatalogName == "qualification" && tools_web.is_true(docObject.TopElem.is_reward) && docObject.TopElem.reward_params.currency_type_id.HasValue)
				{
					lists.currency_types.DeleteOptChildByKey(docObject.TopElem.reward_params.currency_type_id);
					ms_tools.obtain_shared_list_elem( 'lists.currency_types', null, lists.currency_types );
				}
			}
		}
		catch( ex )
		{
			alert( "main_library.js DeleteObjects " + ex );
		}
	oRes.action_result = {
		command: "close_form",
		msg: ( get_end_title( iAllCount, iDeletedCount ) ),
		confirm_result: {
			command: "reload_page"
		}
	};
	return oRes;
}


/**
 * @typedef {Object} WTSubdivDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function SubdivisionDelete
 * @memberof Websoft.WT.Main
 * @description Удаление подразделения/подразделений
 * @author EO
 * @param {bigint[]} arrSubdivIDs - массив ID подразделений
 * @returns {WTSubdivDeleteResult}
*/
function SubdivisionDelete( arrSubdivIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrSubdivIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrSubdivIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "subdivision")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_1' );
		return oRes;
	}


	sSubdivIDs = ArrayMerge( arrSubdivIDs, "This", "," );
	xarrSubdivs = tools.xquery("for $elem in subdivisions where MatchSome($elem/parent_object_id, (" + sSubdivIDs + ")) return $elem/Fields('parent_object_id')");
	xarrPositions = tools.xquery("for $elem in positions where MatchSome($elem/parent_object_id, (" + sSubdivIDs + ")) return $elem/Fields('parent_object_id')");

	while (true)
	{
		CountCurrentLoop = 0;
		xarrSubdivsNextLoop = xarrSubdivs;
		arrSubdivIDsNextLoop = arrSubdivIDs;

		for (itemSubdivID in arrSubdivIDs)
		{
			try
			{
				iSubdivID = OptInt(itemSubdivID);
				if(iSubdivID == undefined)
				{
					throw i18n.t( 'elementmassiva' );
				}
				if ( ( ArrayOptFind (xarrSubdivs, "This.parent_object_id == iSubdivID") == undefined ) && ( ArrayOptFind (xarrPositions, "This.parent_object_id == iSubdivID") == undefined ) )
				{
					try
					{
						DeleteDoc( UrlFromDocID( iSubdivID ), false);
					}
					catch(err)
					{
						throw i18n.t( 'oshibkaudaleniya' );
					}

					xarrSubdivsNextLoop = ArraySelect( xarrSubdivsNextLoop, "This.id != iSubdivID" ); //удаляем элемент с id=iSubdivID из массива
					arrSubdivIDsNextLoop = ArraySelect( arrSubdivIDsNextLoop, "This != iSubdivID" ); //удаляем элемент =iSubdivID из массива
					oRes.count++;
					CountCurrentLoop++;
				}
			}
			catch(err)
			{
				alert("ERROR: SubdivisionDelete: " + ("[" + itemSubdivID + "]\r\n") + err);
			}
		}
		if ( CountCurrentLoop == 0 ) break;
		arrSubdivIDs = arrSubdivIDsNextLoop;
		xarrSubdivs = xarrSubdivsNextLoop;
	}

	return oRes;
}


/**
 * @typedef {Object} WTDeletePollResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function DeletePoll
 * @memberof Websoft.WT.Main
 * @description Удаление опроса/опросов
 * @author EO
 * @param {bigint[]} arrPollIDs - массив ID опросов
 * @returns {WTDeletePollResult}
*/
function DeletePoll( arrPollIDs )
{
	function get_polls_from_procedures()
	{
		arrPollProcIDs = ArrayExtract( tools.xquery("for $elem in poll_procedures return $elem/Fields('id')"), "This.id.Value");
		var arrPollIDs = [];
		for ( iPollProcID in arrPollProcIDs )
		{
			docPollProc = tools.open_doc( iPollProcID );
			if ( docPollProc == undefined || docPollProc.TopElem.Name != 'poll_procedure' )
			{
				continue
			}
			arrPollIDs = ArrayUnion( arrPollIDs, ArrayExtract( docPollProc.TopElem.polls, "This.poll_id.Value" ) ); //опросы в разделе i18n.t( 'poumolchaniyu' )

			for ( oPollGroup in docPollProc.TopElem.additional.poll_groups )
			{
				arrPollIDs = ArrayUnion( arrPollIDs, ArrayExtract( oPollGroup.polls, "This.poll_id.Value" ) ); //опросы в группе опросов
			}
		}
		arrPollIDs = ArraySelectDistinct( arrPollIDs, "This" );

		return arrPollIDs;
	}


	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrPollIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPollIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "poll")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_2' );
		return oRes;
	}

	sPollIDs = ArrayMerge( arrPollIDs, "This", "," );
	xarrPollResults = tools.xquery("for $elem in poll_results where MatchSome($elem/poll_id, (" + sPollIDs + ")) return $elem/Fields('poll_id')");
	arrProcPollIDs = get_polls_from_procedures();

	for (itemPollID in arrPollIDs)
	{
		try
		{
			iPollID = OptInt(itemPollID);
			if(iPollID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			if ( ( ArrayOptFind (xarrPollResults, "This.poll_id == iPollID") == undefined ) && ( ArrayOptFind (arrProcPollIDs, "This == iPollID") == undefined ) )
			{
				try
				{
					DeleteDoc( UrlFromDocID( iPollID ), false);
				}
				catch(err)
				{
					throw i18n.t( 'oshibkaudaleniya' );
				}
				oRes.count++;
			}
		}
		catch(err)
		{
			alert("ERROR: DeletePoll: " + ("[" + itemPollID + "]\r\n") + err, true);
		}
	}
	return oRes;
}


/**
 * @typedef {Object} WTDeletePollProcResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function DeletePollProcedure
 * @memberof Websoft.WT.Main
 * @description Удаление процедуру опроса/процедуры опроса
 * @author EO
 * @param {bigint[]} arrPollIDs - массив ID процедур опроса
 * @returns {WTDeletePollProcResult}
*/
function DeletePollProcedure( arrPollProcIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrPollProcIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPollProcIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "poll_procedure")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_3' );
		return oRes;
	}

	sPollProcIDs = ArrayMerge( arrPollProcIDs, "This", "," );
	xarrPollResults = tools.xquery("for $elem in poll_results where MatchSome($elem/poll_procedure_id, (" + sPollProcIDs + ")) return $elem/Fields('poll_procedure_id')");


	for (itemPollProcID in arrPollProcIDs)
	{
		try
		{
			iPollProcID = OptInt(itemPollProcID);
			if(iPollProcID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			if ( ( ArrayOptFind (xarrPollResults, "This.poll_procedure_id == iPollProcID") == undefined ) )
			{
				try
				{
					DeleteDoc( UrlFromDocID( iPollProcID ), false);
				}
				catch(err)
				{
					throw i18n.t( 'oshibkaudaleniya' );
				}
				oRes.count++;
			}
		}
		catch(err)
		{
			alert("ERROR: DeletePollProcedure: " + ("[" + itemPollProcID + "]\r\n") + err, true);
		}
	}
	return oRes;
}

/**
 * @typedef {Object} WTDeletePositionResult
 * @memberof Websoft.WT.Main
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {string} msg – сообщение о результате
*/
/**
 * @function DeletePosition
 * @author IG BG
 * @description Удаление должностей
 * @param {number[]} arrObjectIDs - список ID должностей
 * @returns {WTDeletePositionResult}
*/
function DeletePosition( arrObjectIDs )
{

	var oRes = tools.get_code_library_result_object();
	oRes.msg = "";

	iCount = 0;
	iCountObjectIDs = ArrayCount( arrObjectIDs );

	try
	{
		if(iCountObjectIDs == 0)
			throw i18n.t( 'peredavaemyeda' )

	}
	catch (err)
	{
		oRes.error = 501; // Invalid param
		oRes.errorText = "{ text: '" + err + "', param_name: 'arrObjectIDs' }";
		return oRes;
	}

	try
	{
		if (ArrayOptFirstElem(arrObjectIDs) != undefined)
		{
			var sReq;
			if(iCountObjectIDs == 1)
			{
				sReq = "for $elem in positions where MatchSome($elem/id, (" + ArrayMerge(arrObjectIDs, "This", ",") + ")) return $elem/Fields('name')";
				xarrPosition = tools.xquery(sReq);
				_oPosition = ArrayOptFirstElem(xarrPosition);
				sPositionName = _oPosition.name.Value
			}

			for (iPositionID in arrObjectIDs)
			{
				iPositionID = OptInt( iPositionID );
				if ( iPositionID != undefined )
				{

					sReq = "for $elem in positions where MatchSome($elem/id, (" + XQueryLiteral(iPositionID) + ")) return $elem/Fields('basic_collaborator_id')";
					xarrCollaborator = tools.xquery(sReq);
					oCollaborator = ArrayOptFirstElem(xarrCollaborator);
					if(oCollaborator.basic_collaborator_id.HasValue)
					{
						iCollaboratorID = oCollaborator.basic_collaborator_id.Value

						curObjectDoc = tools.open_doc(iCollaboratorID)
						curObjectDocTE = curObjectDoc.TopElem

						if(curObjectDoc != undefined && curObjectDocTE.position_id.Value == iPositionID) // удалить записи о должности в карточке сотрудника
						{
							curObjectDocTE.position_id.Clear();
							curObjectDocTE.position_name.Clear();
							curObjectDocTE.position_parent_id.Clear();
							curObjectDocTE.position_parent_name.Clear();

							curObjectDocTE.org_id.Clear();
							curObjectDocTE.org_name.Clear();

							curObjectDoc.Save();

						}
					}
					DeleteDoc( UrlFromDocID( iPositionID ), false); // удаляем должность
					iCount++;
				}
			}

			if ( iCountObjectIDs == 1)
			{
				oRes.msg = i18n.t( 'dolzhnost' ) + sPositionName + i18n.t( 'udalena' );
			}
			else
			{
				oRes.msg = i18n.t( 'udaleno' ) + iCount + i18n.t( 'dolzhnosteyiz' ) + iCountObjectIDs + ".";
			}
		}
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = "ERROR: " + err;
	}

	return oRes;
}

/**
 * @function UpdateDynamicGroups
 * @memberof Websoft.WT.Main
 * @description Обновить динамические группы
 * @author PL
 * @param {WTScopeWvars} SCOPE_WVARS - JSON объект с параметрами удаленного действия
 * @param {WTScopeWvars} PARAMETERS - JSON объект с параметрами удаленного действия
 * @returns {WTLPEFormResult}
*/
/* copy to @component groups  */
function UpdateDynamicGroups( SCOPE_WVARS, PARAMETERS )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.action_result = ({});
	function getParam(_oFormFields, _sName)
	{
		var result = "";
		try
		{
			_tmpFld = ArrayOptFind( _oFormFields, "This.name == _sName");
			result = _tmpFld != undefined ? String( _tmpFld.value ) : PARAMETERS.GetOptProperty( _sName, "" );
		}
		catch (_err)
		{
			result = "";
			return result;
		}
		return result;
	}

	function get_objects_id()
	{
		var sObjectIDs = "";
		if ( getParam( oFormFields, "selected_objects_id" ) == undefined || getParam( oFormFields, "selected_objects_id" ) == "" )
		{
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "SELECTED_OBJECT_IDS" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "OBJECT_ID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if ( sObjectIDs == "" )
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "curObjectID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
		}
		else
		{
			sObjectIDs = getParam(oFormFields, "selected_objects_id");
		}

		return ( sObjectIDs != "" ? String( sObjectIDs ).split( ";" ) : [] );
	}
	function merge_form_fields( oFormFieldResult )
	{
		try
		{
			if( !IsArray( oFormFieldResult ) )
			{
				throw "error";
			}
		}
		catch( ex )
		{
			oFormFieldResult = oRes.action_result.confirm_result.form_fields
		}
		try
		{
			for( _field in oFormFields )
			{
				if( ArrayOptFind( oFormFieldResult, "This.name == _field.name" ) == undefined )
				{
					oFormFieldResult.push( { name: _field.name, type: "hidden", value: _field.value } );
				}
			}
		}
		catch( err ){}
	}
	try
	{
		oFormFields = ParseJson(PARAMETERS.GetOptProperty("form_fields", []));
	}
	catch ( _err )
	{
		try
		{
			oFormFields = ParseJson( SCOPE_WVARS.GetOptProperty( "form_fields", "[]" ) );
		}
		catch ( _err )
		{
			oFormFields = [];
		}
	}
	var bUpdateAll = tools_web.is_true( SCOPE_WVARS.GetOptProperty( "update_all_dynamic_groups" ) );
	if( bUpdateAll )
	{
		var arrObjectIDs = ArrayExtract( XQuery( "for $elem in groups where $elem/is_dynamic = true() return $elem/Fields('id')" ), "This.id" );
		if( ArrayOptFirstElem( arrObjectIDs ) == undefined )
		{
			oRes.action_result = { command: "alert", msg: i18n.t( 'vsistemenetdin' ) };
			return oRes;
		}
	}
	else
	{
		var arrObjectIDs = get_objects_id();

		if( ArrayOptFirstElem( arrObjectIDs ) == undefined )
		{
			var sXQ_qual = "$elem/is_dynamic = true()";
			var iUserID = CurRequest.Session.Env.GetOptProperty( "curUserID" );
			var iManagerTypeID = tools.call_code_library_method("libApplication", "GetApplicationHRBossTypeID", [ SCOPE_WVARS.GetOptProperty( "APPLICATION"), iUserID ])
			if(iManagerTypeID != null)
			{
				sXQ_qual += " and some $fm in func_managers satisfies ($elem/id = $fm/object_id and $fm/catalog = 'group' and $fm/person_id = " + iUserID + " and $fm/boss_type_id = " + iManagerTypeID + ")"
			}

			oRes.action_result = {
				command: "select_object",
				title: i18n.t( 'vyberitegruppy' ),
				message: i18n.t( 'vyberitegruppy' ),
				catalog_name: "group",
				xquery_qual: sXQ_qual,
				field_name: "selected_objects_id",
				multi_select: true,
				mandatory: true,
				form_fields: [ { name: "confirm", value: true, type: "hidden" } ]
			};
			merge_form_fields()
			return oRes;
		}

	}
	var bConfirm = tools_web.is_true( getParam( oFormFields, "confirm" ) );
	if( !bConfirm )
	{
		oRes.action_result =
		{
			command: "confirm",
			msg: i18n.t( 'vyhotiteobnovi' ),
			confirm_result: {
				command: "eval",
				form_fields: [ { name: "confirm", value: true, type: "hidden" } ]
			}
		};
		merge_form_fields( oRes.action_result.confirm_result );
		return oRes;
	}
	var iUpdateCount = 0;
	var docGroup;
	for( _gr_id in arrObjectIDs )
		try
		{
			docGroup = tools.open_doc( _gr_id );
			if( docGroup == undefined || !docGroup.TopElem.is_dynamic )
			{
				continue;
			}
			docGroup.TopElem.dynamic_select_person( true );
			docGroup.Save();
			iUpdateCount++;
		}
		catch( ex )
		{
			alert( "UpdateDynamicGroups error " + ex )
		}
	oRes.action_result = { command: "close_form", msg: StrReplace( i18n.t( 'obnovlenodinam' ), "{PARAM1}", iUpdateCount ), confirm_result: { command: "reload_page" } };
	return oRes;
}

/**
 * @function CreateUpdateGroup
 * @memberof Websoft.WT.Main
 * @description Обновить динамические группы
 * @author PL
 * @param {WTScopeWvars} SCOPE_WVARS - JSON объект с параметрами удаленного действия
 * @param {WTScopeWvars} PARAMETERS - JSON объект с параметрами удаленного действия
 * @returns {WTLPEFormResult}
*/
/* copy to @component groups  */
function CreateUpdateGroup( SCOPE_WVARS, PARAMETERS )
{

	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.result = true;
	oRes.action_result = ({});
	function getParam(_oFormFields, _sName)
	{
		var result = "";
		try
		{
			_tmpFld = ArrayOptFind( _oFormFields, "This.name == _sName");
			result = _tmpFld != undefined ? String( _tmpFld.value ) : PARAMETERS.GetOptProperty( _sName, "" );
		}
		catch (_err)
		{
			result = "";
			return result;
		}
		return result;
	}

	function get_objects_id()
	{
		var sObjectIDs = "";
		if ( getParam( oFormFields, "selected_objects_id" ) == undefined || getParam( oFormFields, "selected_objects_id" ) == "" )
		{
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "SELECTED_OBJECT_IDS" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if (sObjectIDs == "")
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "OBJECT_ID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
			if ( sObjectIDs == "" )
			{
				try
				{
					sObjectIDs = SCOPE_WVARS.GetProperty( "curObjectID" ) + "";
				}
				catch (_err)
				{
					sObjectIDs = "";
				}
			}
		}
		else
		{
			sObjectIDs = getParam(oFormFields, "selected_objects_id");
		}

		return ( sObjectIDs != "" ? String( sObjectIDs ).split( ";" ) : [] );
	}

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

	try
	{
		oFormFields = ParseJson(PARAMETERS.GetOptProperty("form_fields", []));
	}
	catch ( _err )
	{
		try
		{
			oFormFields = ParseJson( SCOPE_WVARS.GetOptProperty( "form_fields", "[]" ) );
		}
		catch ( _err )
		{
			oFormFields = [];
		}
	}
	var iCurUserID =  SCOPE_WVARS.GetOptProperty( "curUserID" );
	var bCreateNew = tools_web.is_true( SCOPE_WVARS.GetOptProperty( "create_new_group" ) );
	var docGroup = undefined;
	var iGroupID = undefined;
	if( !bCreateNew )
	{
		var arrObjectIDs = get_objects_id();
		iGroupID = ArrayOptFirstElem( arrObjectIDs );
		if( iGroupID == undefined )
		{
			oRes.action_result = {
				command: "select_object",
				title: i18n.t( 'vyberitegruppu' ),
				message: i18n.t( 'vyberitegruppu' ),
				catalog_name: "group",
				xquery_qual: "",
				field_name: "selected_objects_id",
				multi_select: false,
				mandatory: true,
				form_fields: []
			};
			merge_form_fields();
			return oRes;
		}
	}
	if( iGroupID != undefined )
	{
		docGroup = tools.open_doc( iGroupID );
	}

	var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, SCOPE_WVARS.GetOptProperty( "APPLICATION") ] );

	if(iApplLevel >= 10)
	{
		sAccessType = "admin"; 			// Администратор приложения
	}
	else if(iApplLevel >= 7)
	{
		sAccessType = "manager"; 		// Администратор процесса
	}
	else if(iApplLevel >= 5)
	{
		sAccessType = "group_leader"; 	// Руководитель групп
	}
	else if(iApplLevel >= 3)
	{
		sAccessType = "hr"; 			// HR
	}
	else if(iApplLevel >= 1)
	{
		sAccessType = "observer";		// Наблюдатель
	}
	else
	{
		sAccessType = "reject";
	}

	var sXQ_qual = '';
	var iAppHRManagerTypeID = null;
	switch(sAccessType)
	{
		case "hr":
			iAppHRManagerTypeID = tools.call_code_library_method("libApplication", "GetApplicationHRBossTypeID", [ SCOPE_WVARS.GetOptProperty( "APPLICATION"), iCurUserID, 3 ])
			var arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, (iAppHRManagerTypeID == null ? [] : [iAppHRManagerTypeID]), true ] );
			sXQ_qual = "MatchSome($elem/id, (" + ArrayMerge(arrSubordinateIDs, "This", ",") + "))";
			break;
		case "observer":
			var arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, [] ] );
			sXQ_qual = "MatchSome($elem/object_id, (" + ArrayMerge(arrSubordinateID, "This", ",") + "))";
			break;
		case "reject":
			sXQ_qual = "$elem/id = 0";
			break;
	}

	var bCreateUpdate = tools_web.is_true( getParam( oFormFields, "create_update" ) );
	if( !bCreateUpdate )
	{
		oRes.action_result = { 
			command: "display_form",
			width: "600vpx",
			height: "600vpx",
			title: ( docGroup != undefined ? i18n.t( 'redaktirovanie' ) : i18n.t( 'sozdanienovoyg' ) ),
			header: i18n.t( 'dobavlenievopr' ),
			form_fields: [] 
		};
								
		oRes.action_result.form_fields.push( { name: "create_update", value: true, type: "hidden" } );
		oRes.action_result.form_fields.push( { name: "code", label: i18n.t( 'kod' ), type: "string", value: ( docGroup != undefined ? docGroup.TopElem.code.Value : "" ) } );
		oRes.action_result.form_fields.push( { name: "name", label: i18n.t( 'nazvanie' ), type: "string", value: ( docGroup != undefined ? docGroup.TopElem.name.Value : "" ), mandatory: true } );

		obj = { name: "join_mode", label: i18n.t( 'tipvstupleniya' ), type: "combo", value: "", entries: [], mandatory: true, column: 1, value: ( docGroup != undefined ? docGroup.TopElem.join_mode.Value : "" ) };
		for( _join_mode_type in common.join_mode_types )
		{
			obj.entries.push( { name: _join_mode_type.name.Value, value: _join_mode_type.id.Value } );
		}
		oRes.action_result.form_fields.push( obj );
		oRes.action_result.form_fields.push( { name: "default_request_type_id", label: i18n.t( 'tipzayavkipoumo' ), type: "foreign_elem", catalog_name: "request_type", display_value: ( docGroup != undefined && docGroup.TopElem.default_request_type_id.HasValue ? docGroup.TopElem.default_request_type_id.ForeignElem.name.Value : "" ), value: ( docGroup != undefined ? docGroup.TopElem.default_request_type_id.Value : "" ), column: 2 } );

		oRes.action_result.form_fields.push( { name: "is_dynamic", label: i18n.t( 'dinamicheskayagr' ), value: ( docGroup != undefined ? docGroup.TopElem.is_dynamic.Value : "" ), type: "bool", view: "check" } );
		oRes.action_result.form_fields.push( { name: "is_educ", label: i18n.t( 'uchebnayagruppa' ), value: ( docGroup != undefined ? docGroup.TopElem.is_educ.Value : "" ), type: "bool", view: "check" } );
		oRes.action_result.form_fields.push( { name: "allow_social_post", label: i18n.t( 'socialnayalenta' ), value: ( docGroup != undefined ? docGroup.TopElem.allow_social_post.Value : "" ), type: "bool", view: "check" } );
		oRes.action_result.form_fields.push( { name: "show_detailed", label: i18n.t( 'pokazyvatpodro' ), value: ( docGroup != undefined ? docGroup.TopElem.show_detailed.Value : "" ), type: "bool", view: "check" } );
		
		// Org
		var sReqOrg = "for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iCurUserID + " return $elem";
		var arrOrgs = tools.xquery(sReqOrg);
		arrOrg = ArrayOptFirstElem(arrOrgs)
		if(arrOrg != undefined)
		{
			if (sXQ_qual == '')
			{
				sXQ_qual = " MatchSome($elem/org_id, (" + arrOrg.object_id.Value + "))";
			} else {
				sXQ_qual += " and MatchSome($elem/org_id, (" + arrOrg.object_id.Value + "))";
			}
		}

		oRes.action_result.form_fields.push( {
			name: "func_manager_list",
			label: i18n.t( 'funkcionalnyer' ),
			multiple: true,
			type: "foreign_elem",
			catalog_name: "collaborator",
			query_qual: sXQ_qual,
			display_value: ( docGroup != undefined ? ArrayMerge( docGroup.TopElem.func_managers, "This.person_fullname", "|||" ) : "" ),
			value: ( docGroup != undefined ? ArrayMerge( docGroup.TopElem.func_managers, "This.person_id", ";" ) : "" )
		} );

		merge_form_fields();
		return oRes;
	}
	var sFuncManagersList = getParam( oFormFields, "func_manager_list" );
	var bSelectFuncManagerType = tools_web.is_true( getParam( oFormFields, "select_func_manager_type" ) );
	if( sFuncManagersList != "" && !bSelectFuncManagerType )
	{
		oRes.action_result = { 	
			command: "display_form",
			title: ( i18n.t( 'vyberitetipydl' ) ),
			header: i18n.t( 'vyberitetipydl' ),
			form_fields: [] 
		};
								
		oRes.action_result.form_fields.push( { name: "select_func_manager_type", value: true, type: "hidden" } );
		var xarrFuncManagers = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + StrReplace( sFuncManagersList, ";", "," ) + " ) ) return $elem/Fields( 'id', 'fullname' )" );
		for( _fm in xarrFuncManagers )
		{
			iBossTypeID = "";
			sBossTypeName = "";
			if( docGroup != undefined )
			{
				catFuncManager = docGroup.TopElem.func_managers.GetOptChildByKey( _fm.id );
				if(catFuncManager != undefined)
				{
					iBossTypeID = catFuncManager.boss_type_id.Value;
					catBossType = catFuncManager.boss_type_id.OptForeignElem;
					if(catBossType != undefined)
						sBossTypeName = catBossType.name.Value
				}
			}
			oRes.action_result.form_fields.push( { name: ( "func_manager_" + _fm.id.Value ), label: RValue( _fm.fullname ), type: "foreign_elem", catalog_name: "boss_type", display_value: sBossTypeName, value: iBossTypeID } );

		}
		merge_form_fields();
		return oRes;
	}

	if( docGroup == undefined )
	{
		docGroup = OpenNewDoc( "x-local://wtv/wtv_group.xmd" );
		docGroup.BindToDb( DefaultDb );
	}
	for( _field in oFormFields )
	{
		if( docGroup.TopElem.ChildExists( _field.name ) )
		{
			docGroup.TopElem.Child( _field.name ).Value = getParam( oFormFields, _field.name );
		}
	}
	docGroup.TopElem.func_managers.Clear();
	if(iAppHRManagerTypeID != null)
	{
		docGroup.TopElem.obtain_func_manager_by_id( iCurUserID, iAppHRManagerTypeID );
	}

	for( _fm in String( sFuncManagersList ).split( ";" ) )
	{
		_fm_id = OptInt( _fm );
		if( _fm_id != undefined )
		{
			docGroup.TopElem.obtain_func_manager_by_id( _fm_id, getParam( oFormFields, ( "func_manager_" + _fm_id ) ) )
		}
	}

	sCatalog = "group";
	iBossTypeID = null;
	sGroupQuery = "for $elem in func_managers where $elem/catalog = " + XQueryLiteral(sCatalog) + " and $elem/person_id = " + iCurUserID +" return $elem";
	xqArrGroup =  tools.xquery(sGroupQuery);
	
	sQuery = "for $elem in boss_types where $elem/code = 'education_manager' return $elem";
	arrBossTypes = tools.xquery(sQuery);
	oBossType = ArrayOptFirstElem(arrBossTypes);
	iBossTypeID = oBossType.id.Value;
	
	var sApplication = PARAMETERS.GetOptProperty( "sAPPLICATION", "" );
	if( sApplication != "" )
	{
		var curApplication = tools_app.get_cur_application( sApplication );
		var teApplication = tools_app.get_application(sApplication);
		
		sAccessType = "";
		if( curApplication != null )
		{
			iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, curApplication.id ] );

			if(iApplLevel >= 10) // Администратор приложения
				sAccessType = "admin";
			else if(iApplLevel >= 7) // администратор процесса
				sAccessType = "manager";
			else if(iApplLevel >= 5) // HR
				sAccessType = "hr";
			else if(iApplLevel >= 3) // методист
				sAccessType = "expert";
			else if(iApplLevel >= 2) // наставник
				sAccessType = "tutor";
			else if(iApplLevel >= 1) // Наблюдатель
				sAccessType = "observer";
			else
				sAccessType = "reject";
			
			if ( curApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
			{
				aBossTypes = tools_web.parse_multiple_parameter(curApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value.Value);
				
				if(ArrayOptFirstElem(aBossTypes) != undefined)
				{
					iBossTypeID = ArrayOptFirstElem(aBossTypes)
				}
			}
		}
	}

	switch(sAccessType)
	{
		case "hr": // HR
			
			sQuery = "for $elem in collaborators where $elem/id = " + iCurUserID + " return $elem";
			arrCollaborator = tools.xquery(sQuery);
			oCollaborator = ArrayOptFirstElem(arrCollaborator);
			
			if (oCollaborator != undefined)
			{
				catFuncManager = docGroup.TopElem.func_managers.ObtainChildByKey( OptInt(iCurUserID) );
				tools.common_filling( "collaborator", catFuncManager, iCurUserID );
				
				catFuncManager.boss_type_id.Value = iBossTypeID;
			}
	
			break;
	}

	docGroup.Save();

	oRes.action_result = { command: "close_form", msg: ( bCreateNew ? i18n.t( 'gruppasozdana' ) : i18n.t( 'gruppaobnovlena' ) ), confirm_result: { command: "reload_page" } };
	return oRes;
}


/**
 * @typedef {Object} WTDeletePollResResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function DeletePollResult
 * @memberof Websoft.WT.Main
 * @description Удаление результата опроса/результатов опроса
 * @author EO
 * @param {bigint[]} arrPollResultIDs - массив ID результатов опроса
 * @returns {WTDeletePollResResult}
*/
function DeletePollResult( arrPollResultIDs )
{
	var oRes = tools.get_code_library_result_object();

	if(!IsArray(arrPollResultIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPollResultIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "poll_result")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_4' );
		return oRes;
	}

	for (itemPollResultID in arrPollResultIDs)
	{
		try
		{
			iPollResultID = OptInt(itemPollResultID);
			if(iPollResultID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}
			try
			{
				DeleteDoc( UrlFromDocID( iPollResultID ), false);
			}
			catch(err)
			{
				throw i18n.t( 'oshibkaudaleniya' );
			}
		}
		catch(err)
		{
			alert("ERROR: DeletePollResult: " + ("[" + itemPollResultID + "]\r\n") + err, true);
		}
	}
	return oRes;
}


/**
 * @typedef {Object} WTPollClearResResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
 * @property {integer} count – количество удаленных результатов опроса.
*/
/**
 * @function PollClearResults
 * @memberof Websoft.WT.Main
 * @description Очистка результатов опроса/опросов
 * @author EO
 * @param {bigint[]} arrPollIDs - массив ID опросов
 * @returns {WTPollClearResResult}
*/
function PollClearResults( arrPollIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrPollIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPollIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "poll")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_2' );
		return oRes;
	}

	sPollIDs = ArrayMerge( arrPollIDs, "This", "," );
	xarrPollResults = tools.xquery("for $elem in poll_results where MatchSome($elem/poll_id, (" + sPollIDs + ")) return $elem/Fields('id')");

	for (itemPollResult in xarrPollResults)
	{
		try
		{
            try
            {
                DeleteDoc( UrlFromDocID( itemPollResult.id ), false);
            }
            catch(err)
            {
                throw i18n.t( 'oshibkaudaleniya' );
            }
            oRes.count++;
		}
		catch(err)
		{
			alert("ERROR: PollClearResults: " + ("[" + itemPollResult.id + "]\r\n") + err, true);
		}
	}
	return oRes;
}

/**
 * @typedef {Object} WTCreatePositionResult
 * @memberof Websoft.WT.Main
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {string} msg – сообщение о результате
*/
/**
 * @function CreatePosition
 * @author AKh
 * @description Создание новой должности
 * @param {string} sCode - код должности
 * @param {string} sName - название должности
 * @param {bigint} iOrgID - ID организации
 * @param {bigint} iSubdivisionID - ID подразделения
 * @param {bigint} iCollaboratorID - ID назначаемого на должность сотрудника
 * @param {string} sTypePurpose - тип назначения
 * @returns {WTCreatePositionResult}
*/
function CreatePosition( sCode, sName, iOrgID, iSubdivisionID, iCollaboratorID, sTypePurpose )
{

	var oRes = tools.get_code_library_result_object();
	oRes.msg = "";

	try
	{
		if(sCode == null || String(sCode) == "")
			throw ""

	}
	catch (err)
	{
		sCode = "";
	}

	try
	{
		if(sName == null || String(sName) == "")
			throw i18n.t( 'neukazanonazva' )

	}
	catch (err)
	{
		oRes.error = 501;
		oRes.errorText = "{ ERROR: '" + err + "', param_name: 'sName' }";
		return oRes;
	}

	try
	{
		if(iOrgID == null || String(iOrgID) == "")
			throw ""

	}
	catch (err)
	{
		iOrgID = "";
	}

	try
	{
		if(iSubdivisionID == null || String(iSubdivisionID) == "")
			throw i18n.t( 'neukazanopodra' )

	}
	catch (err)
	{
		oRes.error = 501;
		oRes.errorText = "{ ERROR: '" + err + "', param_name: 'iSubdivisionID' }";
		return oRes;
	}

	try
	{
		if(iCollaboratorID == null || String(iCollaboratorID) == "")
			throw ""

	}
	catch (err)
	{
		iCollaboratorID = 0;
	}

	try
	{
		if(sTypePurpose == null || String(sTypePurpose) == "")
			throw ""

	}
	catch (err)
	{
		sTypePurpose = "";
	}

	try
	{

		if(iCollaboratorID > 0)
		{
			arrPositions = tools.xquery("for $elem in positions where $elem/basic_collaborator_id = " + iCollaboratorID + " return $elem");

			if (ArrayOptFirstElem(arrPositions) == undefined)
			{
				docPosition = tools.new_doc_by_name( 'position', false );
				docPosition.BindToDb();
				docPosition.TopElem.code = sCode;
				docPosition.TopElem.name = sName;
				docPosition.TopElem.org_id = iOrgID;
				docPosition.TopElem.parent_object_id = iSubdivisionID;
				docPosition.TopElem.basic_collaborator_id = iCollaboratorID;
				docPosition.TopElem.position_date = Date();
				docPosition.Save();
				oRes.msg = i18n.t( 'dolzhnostsozdan' );
			}
			else
			{
				switch(sTypePurpose)
				{
					case "new_position_move":
						docOldPosition = OpenDoc( UrlFromDocID( ArrayOptFirstElem(arrPositions).id ) );
						docOldPosition.TopElem.position_finish_date = Date();
						docOldPosition.TopElem.is_position_finished = 1;
						docOldPosition.TopElem.basic_collaborator_id.Clear();
						docOldPosition.Save();

						docPosition = tools.new_doc_by_name( 'position', false );
						docPosition.BindToDb();
						docPosition.TopElem.code = sCode;
						docPosition.TopElem.name = sName;
						docPosition.TopElem.org_id = iOrgID;
						docPosition.TopElem.parent_object_id = iSubdivisionID;
						docPosition.TopElem.basic_collaborator_id = iCollaboratorID;
						docPosition.TopElem.position_date = Date();
						docPosition.Save();

						docPerson = OpenDoc( UrlFromDocID( iCollaboratorID) );
						docPerson.TopElem.clear_cur_position();
						docPerson.TopElem.position_id = docPosition.DocID;
						docPerson.TopElem.position_parent_id = docPosition.TopElem.parent_object_id;
						docPerson.TopElem.org_id = docPosition.TopElem.org_id;
						docPerson.Save();
						oRes.msg = i18n.t( 'dolzhnostsozdan' );
						break;
					case "part_add":
						docPosition = tools.new_doc_by_name( 'position', false );
						docPosition.BindToDb();
						docPosition.TopElem.code = sCode;
						docPosition.TopElem.name = sName;
						docPosition.TopElem.org_id = iOrgID;
						docPosition.TopElem.parent_object_id = iSubdivisionID;
						docPosition.TopElem.basic_collaborator_id = iCollaboratorID;
						docPosition.TopElem.position_date = Date();
						docPosition.Save();
						oRes.msg = i18n.t( 'dolzhnostsozdan' );
						break;
					case "not_appointment":
						docPosition = tools.new_doc_by_name( 'position', false );
						docPosition.BindToDb();
						docPosition.TopElem.code = sCode;
						docPosition.TopElem.name = sName;
						docPosition.TopElem.org_id = iOrgID;
						docPosition.TopElem.parent_object_id = iSubdivisionID;
						docPosition.Save();
						oRes.msg = i18n.t( 'dolzhnostsozdan_1' );
						break;
				}
			}
		}
		else
		{
			docPosition = tools.new_doc_by_name( 'position', false );
			docPosition.BindToDb();
			docPosition.TopElem.code = sCode;
			docPosition.TopElem.name = sName;
			docPosition.TopElem.org_id = iOrgID;
			docPosition.TopElem.parent_object_id = iSubdivisionID;
			docPosition.Save();
			oRes.msg = i18n.t( 'dolzhnostsozdan_1' );
		}

	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = "ERROR: " + err;
	}

	return oRes;
}


/**
 * @typedef {Object} oOrgsApp
 * @property {bigint} id
 * @property {string} code - Код
 * @property {string} disp_name - Условное название
 * @property {string} name - Официальное название
*/
/**
 * @typedef {Object} ReturnOrgsApp
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oOrgsApp[]} array – Коллекция организаций.
*/

/**
 * @function GetOrgsApp
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка организаций.
 * @param {bigint} iCurUserID ID текущего пользователя.
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"observer"/"auto"
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителей
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnOrgsApp}
*/
function GetOrgsApp( iCurUserID, sAccessType, arrBossTypesID, sApplication, iCurApplicationID, sXQueryQual, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];

	iCurUserID = OptInt( iCurUserID, 0);

	arrFilters = oCollectionParams.filters;

	if ( sXQueryQual == null || sXQueryQual == undefined)
		sXQueryQual = "";

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);
		if(iApplicationID != undefined)
		{
			sApplication = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
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
			sAccessType = "hr";
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

	var xqArrOrg = [];
	var xqIsOrgBoss = [];
	var bSelectByGroup = false;
	switch(sAccessType)
	{
		case "hr":
			{
				arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );
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
					arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
				}

				if(ArrayOptFirstElem(arrBossType) != undefined)
				{
					xqArrOrg =  tools.xquery("for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iCurUserID +" and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) and $elem/is_native = false() return $elem")
					bSelectByGroup = true;
				}

				break;
			}
		case "observer":
			{
				xqArrOrg =  tools.xquery("for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iCurUserID +" and $elem/is_native = false() return $elem")
				xqIsOrgBoss = tools.xquery("for $elem in positions where $elem/basic_collaborator_id = " + iCurUserID + " and $elem/parent_object_id = null() and $elem/is_boss=true() return $elem");
				bSelectByGroup = true;
				break;
			}
		case "reject":
			{
				bSelectByGroup = true;
				break;
			}
	}

//фильтрация
	if ( arrFilters != undefined && arrFilters != null && IsArray(arrFilters) )
	{
		for ( oFilter in arrFilters )
		{
			conds = [];
			if ( oFilter.type == 'search' )
			{
				if ( oFilter.value != '' )
				{
					sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )";
					sXQueryQual = ( sXQueryQual == "" ? sSearchCond : " and "+sSearchCond )
				}
			}
		}
	}

	var xarrOrgsAll = XQuery(
		"for $elem in orgs " +
		(sXQueryQual == "" ? "" : ("where " + sXQueryQual)) +
		" return $elem"
	);

	if(bSelectByGroup)
	{
		arrSelectByGroupOrgsID = ArrayUnion( ArrayExtract( xqArrOrg, "This.object_id" ),  ArrayExtract( xqIsOrgBoss, "This.org_id" ) );
		xarrOrgsAll = ArrayIntersect(xarrOrgsAll, arrSelectByGroupOrgsID, "This.id", "This");
	}

	for ( catOrg in xarrOrgsAll )
	{
		oElem = {
			id: catOrg.id.Value,
			code: catOrg.code.Value,
			disp_name: catOrg.disp_name.Value,
			name: catOrg.name.Value
		};

		oRes.array.push(oElem);
	}

	if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
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
 * @typedef {Object} oCollaboratorsApp
 * @property {string} basic_info
 * @property {bigint} id
 * @property {string} code
 * @property {string} fullname
 * @property {string} sex
 * @property {date} birth_date
 * @property {string} login
 * @property {string} email
 * @property {string} primary_position
 * @property {string} main_subdivision
 * @property {string} main_org
 * @property {string} person_current_state
 * @property {date} hire_date
 * @property {date} dismiss_date
 * @property {string} phone
 * @property {string} access_role
 * @property {number} typical_development_program_count
 * @property {number} adaptation_count
 * @property {number} end_adaptation_count
 * @property {number} active_adaptation_count
 * @property {number} plan_adaptation_count
 * @property {boolean} consent_kedo
 * @property {number} active_badges_count
 * @property {number} badges_count
 * @property {number} active_rewards_count
 * @property {number} rewards_count
 * @property {number} response_given_to_collaborator_count
 * @property {number} requested_response_count
 * @property {number} added_response_count
 * @property {number} need_add_response_count
*/
/**
 * @typedef {Object} ReturnCollaboratorsApp
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oCollaboratorsApp[]} array – Коллекция организаций.
*/
/**
 * @function GetCollaboratorsApp
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка сотрудников
 * @param {bigint} iCurUserID ID текущего пользователя.
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"observer"/"auto"
 * @param {bigint[]} [arrBossTypesID] Массив типов руководителей
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {string} sReturnData Тип сотрудников (Все, Уволенные, Неуволенные)
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @param {string[]} aAdditionalFields дополнительные поля
 * @returns {ReturnCollaboratorsApp}
*/
/* copy to @component employee_management  */
function GetCollaboratorsApp( iCurUserID, sAccessType, arrBossTypesID, sApplication, iCurApplicationID, sReturnData, sXQueryQual, oCollectionParams, aAdditionalFields, request_type )
{
	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];

	iCurUserID = OptInt( iCurUserID, 0);

	arrFilters = oCollectionParams.filters;
	arrDistinct = oCollectionParams.distincts;

	try
	{
		if( !IsArray( aAdditionalFields ) )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		aAdditionalFields = new Array();
	}

	if ( sReturnData == null || sReturnData == undefined || sReturnData == "" )
		sReturnData = "all";

	var arrConds = [];
	if ( sXQueryQual == null || sXQueryQual == undefined)
		sXQueryQual = "";

	if ( sXQueryQual != "" )
		arrConds.push( sXQueryQual );

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);

		if(iApplicationID == undefined)
		{
			iApplicationID = OptInt(iCurApplicationID);
		}

		if(iApplicationID != undefined)
		{
			sApplication = ''+ArrayOptFirstElem(tools.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
			
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
				sAccessType = "hr";
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
	}


	if ( ArrayOptFirstElem( arrDistinct ) != undefined )
	{
		oRes.data.SetProperty( "distincts", {} );
		for ( sFieldName in arrDistinct )
		{
			oRes.data.distincts.SetProperty( sFieldName, [] );
			switch( sFieldName )
			{
				case 'collabs_dismiss':
				{
					oRes.data.distincts.collabs_dismiss.push( { name: i18n.t( 'vse' ), value: "all" } );
					oRes.data.distincts.collabs_dismiss.push( { name: i18n.t( 'uvolennye' ), value: "dismissed" } );
					oRes.data.distincts.collabs_dismiss.push( { name: i18n.t( 'neuvolennye' ), value: "not_dismissed" } );
					break;
				}
			}
		}
	}


//фильтрация
	bBlock_sReturnDataParam = false;
	if ( arrFilters != undefined && arrFilters != null && IsArray(arrFilters) )
	{
		for ( oFilter in arrFilters )
		{
			conds = [];
			if ( oFilter.type == 'search' )
			{
				if ( oFilter.value != '' )
				{
					sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )";
					arrConds.push( sSearchCond );
				}
			}
			else if ( oFilter.type == 'select' )
			{
				switch ( oFilter.id )
				{
					case 'collabs_dismiss':
						{
							bBlock_sReturnDataParam = true;
							oCollabsDismiss = ArrayOptFirstElem(oFilter.value);
							sCollabsDismiss = ( oCollabsDismiss == undefined ? "" : oCollabsDismiss.value );
							if ( sCollabsDismiss == "dismissed" )
							{
								arrConds.push( "$elem/is_dismiss = true()" );
							}
							else if ( sCollabsDismiss == "not_dismissed" )
								{
									arrConds.push( "$elem/is_dismiss = false()" );
								}
							break;
						}

				}
			}
		}
	}

	if ( !bBlock_sReturnDataParam )
	{
		switch( sReturnData )
		{
			case "dismissed" :
			{
				arrConds.push( "$elem/is_dismiss = true()" );
				break;
			}
			case "not_dismissed" :
			{
				arrConds.push( "$elem/is_dismiss = false()" );
				break;
			}

		}
	}

	var bLimitByApplLevel = false;
	var oSubordinateParams = {
			arrTypeSubordinate: ['fact','func'],
			bReturnIDs: true,
			sCatalog: '',
			arrFieldsNames: null,
			xQueryCond: '',
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			arrBossTypeIDs: [],
			bWithoutUseManagementObject: true,
	};
	switch(sAccessType)
	{
		case "hr":
			{
				arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );
				
				if (ArrayOptFirstElem(arrBossType) == undefined)
				{
					arrBossType = tools.call_code_library_method( "libApplication", "GetApplicationHRBossTypes", [ sApplication, iCurUserID ] );
				}

				// xarrCollabsIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, arrBossType, true ] );
				oSubordinateParams.arrTypeSubordinate = ['func'];
				oSubordinateParams.arrBossTypeIDs = arrBossType;
				var xarrCollabsIDs = GetSubordinateRecords(iCurUserID, oSubordinateParams);

				bLimitByApplLevel = true;
				break;
			}
		case "observer":
			{
				// xarrCollabsIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['fact','func'], true, '', null, '', true, true, true, true, [], true ] );
				var xarrCollabsIDs = GetSubordinateRecords(iCurUserID, oSubordinateParams);
				bLimitByApplLevel = true;
				break;
			}
		case "reject":
			{
				bLimitByApplLevel = true;
				var xarrCollabsIDs = [];
				break;
			}
		default:
			{
				var xarrCollabsIDs = ArrayExtract(collaborators, 'id');
			}
	}

	if ( bLimitByApplLevel )
	{
		arrConds.push( "MatchSome($elem/id, (" + ArrayMerge(xarrCollabsIDs, 'This', ',') + "))" );
	}

	var sCondSort = "";
	var sFieldName = "";
	if(ObjectType(oCollectionParams.sort) == 'JsObject' && !IsEmptyValue(oCollectionParams.sort.FIELD) )
	{
		sFieldName = oCollectionParams.sort.FIELD;
	}

	if ( sFieldName == "" || (sFieldName != "development_potential" && sFieldName != "efficiency_estimation") )
	{
		if (sFieldName != "")
		{
			switch(sFieldName)
			{
				case "code":
				case "fullname":
				case "birth_date":
				case "login":
				case "email":
				case "org_name":
				case "hire_date":
				case "dismiss_date":
				case "phone":
					sCondSort = " order by $elem/" + sFieldName;
					break
				case "primary_position":
					sCondSort = " order by $elem/position_name";
					break
				case "main_subdivision":
					sCondSort = " order by $elem/position_parent_name";
					break
				case "person_current_state":
					sCondSort = " order by $elem/current_state";
					break
			}
			sCondSort += (sCondSort != "" && StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "")
		}
		
		arrConds.push( "$elem/is_candidate = false()" );

		sCollabsQuery = "for $elem in collaborators" + ((ArrayOptFirstElem(arrConds) != undefined) ? " where " + ArrayMerge(arrConds, "This", " and ") : "") + sCondSort + " return $elem/Fields('id','fullname','position_name','code','birth_date','login','email','position_name','position_parent_name','org_name','current_state','hire_date','dismiss_date','phone','role_id','sex','position_id','consent_kedo','efficiency_estimation_id','development_potential_id')";
		
		sCollabsQuery = StrReplace( sCollabsQuery, "$elem", "$elem_qc" );
		
		var xarrCollabs = tools.xquery(sCollabsQuery);

		if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
		{
			oCollectionParams.paging.MANUAL = true;
			oCollectionParams.paging.TOTAL = ArrayCount(xarrCollabs);
			oRes.paging = oCollectionParams.paging;
			xarrCollabs = ArrayRange(xarrCollabs, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
		}

		xarrCollabs = ArrayDirect( xarrCollabs );
	}
	else
	{
		switch(sFieldName)
		{
			case "development_potential":
				sQueryFieldName = "development_potential_id";
				break
			case "efficiency_estimation":
				sQueryFieldName = "efficiency_estimation_id";
				break
		}
		sCondSort = " order by ForeignElem($elem/"+sQueryFieldName+")/name"
		sCondSort += (sCondSort != "" && StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "")

		arrConds1stQuery = ArrayUnion(arrConds,["$elem/"+sQueryFieldName+" = null()"]);
		arrConds2ndQuery = ArrayUnion(arrConds,["$elem/"+sQueryFieldName+" != null()"]);
		sCollabs1stQuery = "for $elem in collaborators" + " where " + ArrayMerge(arrConds1stQuery, "This", " and ") + " return $elem/Fields('id','fullname','position_name','code','birth_date','login','email','position_name','position_parent_name','org_name','current_state','hire_date','dismiss_date','phone','role_id','sex','position_id','consent_kedo','efficiency_estimation_id','development_potential_id')";
		sCollabs1stQuery = StrReplace( sCollabs1stQuery, "$elem", "$elem_qc" );

		sCollabs2ndQuery = "for $elem in collaborators" + " where " + ArrayMerge(arrConds2ndQuery, "This", " and ") + sCondSort + " return $elem/Fields('id','fullname','position_name','code','birth_date','login','email','position_name','position_parent_name','org_name','current_state','hire_date','dismiss_date','phone','role_id','sex','position_id','consent_kedo','efficiency_estimation_id','development_potential_id')";
		sCollabs2ndQuery = StrReplace( sCollabs2ndQuery, "$elem", "$elem_qc" );

		if ( StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" )
		{
			sTemp = sCollabs2ndQuery;
			sCollabs2ndQuery = sCollabs1stQuery;
			sCollabs1stQuery = sTemp
		}

		if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
		{//есть пейджинг
			xarrCollabs1stQuery = tools.xquery(sCollabs1stQuery);
			xarrCollabs2ndQuery = tools.xquery(sCollabs2ndQuery);

			oCollectionParams.paging.MANUAL = true;
			oCollectionParams.paging.TOTAL = ArrayCount(xarrCollabs1stQuery)+ArrayCount(xarrCollabs2ndQuery);
			oRes.paging = oCollectionParams.paging;

			iPagingStartIndex = ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE );
			iPagingSize = oCollectionParams.paging.SIZE;
			if (iPagingStartIndex+iPagingSize <= ArrayCount(xarrCollabs1stQuery))
			{
				xarrCollabs = ArrayRange(xarrCollabs1stQuery, iPagingStartIndex, iPagingSize);
			}
			else
			{
				if (iPagingStartIndex >= ArrayCount(xarrCollabs1stQuery))
				{
					xarrCollabs = ArrayRange(xarrCollabs2ndQuery, iPagingStartIndex-ArrayCount(xarrCollabs1stQuery), iPagingSize);
				}
				else
				{
					xarrCollabs = ArrayUnion(ArrayRange(xarrCollabs1stQuery, iPagingStartIndex, ArrayCount(xarrCollabs1stQuery)-iPagingStartIndex), ArrayRange(xarrCollabs2ndQuery, 0, iPagingSize-ArrayCount(xarrCollabs1stQuery)+iPagingStartIndex));
				}
			}
		}
		else
		{//нет пейджинга
			xarrCollabs1stQuery = tools.xquery(sCollabs1stQuery);
			xarrCollabs2ndQuery = tools.xquery(sCollabs2ndQuery);
			xarrCollabs = ArrayUnion(xarrCollabs1stQuery,xarrCollabs2ndQuery)
		}
		xarrCollabs = ArrayDirect( xarrCollabs );
	}

	if( ArrayOptFirstElem( xarrCollabs ) == undefined )
	{
		return oRes;
	}

	sMergedCollabsIds = ArrayMerge( xarrCollabs, "This.id", "," );

	var _field;
	var xarrPositions = new Array(), xarrPositionCommons = new Array(), xarrSubdivisionGroupSubdivisions = new Array(), arrRequirementObjects = new Array();
	var xarrRequirementObjects = new Array();
	var arrAdaptations = null, arrRequests = null, arrCareerPlans = null, arrPersDocs = null, arrAdaptationsPassedFailed = null, arrAdaptationsActive = null;
	var arrAdaptationsPlan = null, arrRequestsActive = null, arrCareerPlansPassed = null, arrCareerPlansActive = null, arrCareerPlansPlan = null, arrPersDocsProcess = null, arrPersDocsActive = null;
	var arrQualificationAssignments = null;
	arrActiveBenefits = new Array(); xarrVirtualBenefits = new Array(); var examCheckBox = false; xarrBenefitProfiles = new Array(); 
	if ( ArrayOptFirstElem(ArrayIntersect(["typical_development_program_count"], aAdditionalFields)) != undefined )
	{
		xarrPositions = tools.xquery( "for $elem_qc in positions where MatchSome( $elem_qc/basic_collaborator_id, ( " + sMergedCollabsIds + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','position_common_id','parent_object_id','position_family_id')" );
		xarrPositions = ArrayDirect(xarrPositions);
		
		if( ArrayOptFind( xarrPositions, "This.position_common_id.HasValue" ) != undefined )
		{
			xarrPositionCommons = ArrayDirect( tools.xquery( "for $elem_qc in position_commons where MatchSome( $elem_qc/id, ( " +  ArrayMerge( ArraySelect( xarrPositions, "This.position_common_id.HasValue" ), "This.position_common_id", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','position_familys')" ) );
			arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtract( xarrPositionCommons, "This.id" ) );
			for( _pc in xarrPositionCommons )
			{
				if( _pc.position_familys.HasValue )
				{
					arrRequirementObjects = ArrayUnion( arrRequirementObjects, String( _pc.position_familys ).split( ";" ) );
				}
			}
			arrRequirementObjects = ArraySelectDistinct( arrRequirementObjects, "This" );
		}
		if( ArrayOptFind( xarrPositions, "This.position_family_id.HasValue" ) != undefined )
		{
			arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtract( ArraySelectDistinct( xarrPositionCommons, "This.position_family_id" ), "This.position_family_id" ) );
			arrRequirementObjects = ArraySelectDistinct( arrRequirementObjects, "This" );
		}
		if( ArrayOptFind( xarrPositions, "This.parent_object_id.HasValue" ) != undefined )
		{
			xarrSubdivisionGroupSubdivisions = ArrayDirect( tools.xquery( "for $elem_qc in subdivision_group_subdivisions where MatchSome( $elem_qc/subdivision_id, ( " + ArrayMerge( ArraySelect( xarrPositions, "This.parent_object_id.HasValue" ), "This.parent_object_id", "," ) + " ) ) order by $elem_qc/subdivision_id return $elem_qc/Fields('subdivision_group_id','subdivision_id')" ) );
			arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArraySelectDistinct( ArrayExtract( xarrSubdivisionGroupSubdivisions, "This.subdivision_group_id" ), "This" ) );
		}
		if( ArrayOptFirstElem( arrRequirementObjects ) != undefined )
		{
			xarrRequirementObjects = tools.xquery( "for $elem in object_requirements where $elem/requirement_object_type = 'typical_development_program' and MatchSome( $elem/object_id, ( " + ArrayMerge( arrRequirementObjects, "This", "," ) + " ) ) return $elem/Fields('object_id', 'requirement_object_id')" );
		}
	}

	if ( ArrayOptFirstElem(ArrayIntersect(["career_routes_request_count","active_career_routes_request_count"], aAdditionalFields)) != undefined )
	{
		if (request_type == '' || request_type == null)
		{
			if (OptInt(iCurApplicationID) != undefined)
			{
				teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
				if (teApplication != null)
				{
					if ( teApplication.wvars.GetOptChildByKey( 'request_type' ) != undefined )
					{
						iReqTypeID = (OptInt( teApplication.wvars.GetOptChildByKey( 'request_type' ).value, 0 ));
					}
				}
			}
		}
		else
			iReqTypeID = OptInt(request_type);

		arrRequests = ArrayDirect( tools.xquery( "for $elem_qc in requests where MatchSome( $elem_qc/person_id, ( " + sMergedCollabsIds + " ) ) and $elem_qc/request_type_id = " + iReqTypeID + " order by $elem_qc/person_id return $elem_qc/Fields('id','person_id','status_id')" ) );
	}

	if ( ArrayOptFirstElem(ArrayIntersect(["active_career_routes_request_count"], aAdditionalFields)) != undefined )
	{
		arrRequestsActive = ArraySelectByKey( arrRequests, "active", "status_id" );
	}

	if ( ArrayOptFirstElem(ArrayIntersect(["career_routes_count","career_routes_complete_count","career_routes_active_count","career_routes_plan_count"], aAdditionalFields)) != undefined )
	{
		arrCareerPlans = ArrayDirect( tools.xquery( "for $elem_qc in career_plans where MatchSome( $elem_qc/object_id, ( " + sMergedCollabsIds + " ) ) and $elem_qc/object_type = 'collaborator' order by $elem_qc/object_id return $elem_qc/Fields('id','status','object_id')" ) );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["career_routes_complete_count"], aAdditionalFields)) != undefined )
	{
		arrCareerPlansPassed = ArraySelectByKey( arrCareerPlans, "passed", "status" );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["career_routes_active_count"], aAdditionalFields)) != undefined )
	{
		arrCareerPlansActive = ArraySelectByKey( arrCareerPlans, "active", "status" );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["career_routes_plan_count"], aAdditionalFields)) != undefined )
	{
		arrCareerPlansPlan = ArraySelectByKey( arrCareerPlans, "plan", "status" );
	}

	if ( ArrayOptFirstElem(ArrayIntersect(["process_personnel_document_count","active_personnel_document_count"], aAdditionalFields)) != undefined )
	{
		arrPersDocs = ArrayDirect( tools.xquery( "for $elem_qc in personnel_documents where MatchSome( $elem_qc/person_id, ( " + sMergedCollabsIds + " ) ) order by $elem_qc/person_id return $elem_qc/Fields('person_id','state_id')" ) );
		arrPersDocsProcess = ArraySelectByKey( arrPersDocs, "process", "state_id" );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["active_personnel_document_count"], aAdditionalFields)) != undefined )
	{
		arrPersDocsActive = ArraySelectByKey( arrPersDocs, "active", "state_id" );
	}
	
	if ( ArrayOptFirstElem(ArrayIntersect(["career_reserve_active_count","career_reserve_finished_count"], aAdditionalFields)) != undefined )
	{
		var sReqCR = "for $elem_qc in career_reserves where $elem_qc/position_type != 'adaptation' and MatchSome($elem_qc/person_id, (" + sMergedCollabsIds + ")) and MatchSome($elem_qc/status, ('active','failed','passed')) order by $elem_qc/position_type, $elem_qc/person_id return $elem_qc/Fields('id','person_id','status')";
		
		arrCareerReserves = ArrayDirect(tools.xquery(sReqCR));
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["career_reserve_finished_count"], aAdditionalFields)) != undefined )
	{
		arrCareerReservesPassedFailed = ArraySelect( arrCareerReserves, "This.status == 'passed' || This.status == 'failed'" );
	}
	
	if ( ArrayOptFirstElem(ArrayIntersect(["career_reserve_active_count"], aAdditionalFields)) != undefined )
	{
		arrCareerReservesActive = ArraySelectByKey( arrCareerReserves, "active", "status" );
	}

	if ( ArrayOptFirstElem(ArrayIntersect(["adaptation_count","end_adaptation_count","active_adaptation_count","plan_adaptation_count"], aAdditionalFields)) != undefined )
	{
		arrAdaptations = ArrayDirect( tools.xquery ( "for $elem_qc in career_reserves where $elem_qc/position_type = 'adaptation' and MatchSome($elem_qc/person_id, (" + sMergedCollabsIds + ")) and MatchSome($elem_qc/status, ('plan','active','failed','passed')) order by $elem_qc/person_id return $elem_qc/Fields('id','person_id','status')" ) );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["end_adaptation_count"], aAdditionalFields)) != undefined )
	{
		arrAdaptationsPassedFailed = ArraySelect( arrAdaptations, "This.status == 'passed' || This.status == 'failed'" );
	}
	
	if ( ArrayOptFirstElem(ArrayIntersect(["active_adaptation_count"], aAdditionalFields)) != undefined )
	{
		arrAdaptationsActive = ArraySelectByKey( arrAdaptations, "active", "status" );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["plan_adaptation_count"], aAdditionalFields)) != undefined )
	{
		arrAdaptationsPlan = ArraySelectByKey( arrAdaptations, "plan", "status" );
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["active_badges_count","badges_count","active_rewards_count","rewards_count"], aAdditionalFields)) != undefined )
	{
		arrQualificationAssignments = tools.xquery("for $elem in qualification_assignments where MatchSome( $elem/person_id, ( " + sMergedCollabsIds + " ) ) order by $elem/person_id return $elem")
	}
	if ( ArrayOptFirstElem(ArrayIntersect(["active_benefits"], aAdditionalFields)) != undefined )
	{
		arrActiveBenefits = tools.xquery( "for $elem_qc in benefit_items where MatchSome( $elem_qc/person_id, ( " + sMergedCollabsIds + " ) ) and $elem_qc/status = 'active' order by $elem_qc/person_id return $elem_qc" );
	}
	if(ArrayOptFirstElem(ArrayIntersect(["benefit_profiles","virtual_benefits"], aAdditionalFields)) != undefined )
	{
		examCheckBox = true; 
	}
	var arrResponseTypesIds = [];
	var arrResponseTypesIdsTypeColl = [];
	var arrResponseTypesIdsTypeProj = [];
	if ( ArrayOptFirstElem(ArrayIntersect(["response_given_to_collaborator_count","requested_response_count","added_response_count","need_add_response_count"], aAdditionalFields)) != undefined )
	{
		var teAppl = tools_app.get_application( 'websoft_continuous_feedback' );
		if (teAppl != undefined)
		{
			var oResponseTypesWvar = ArrayOptFind(teAppl.wvars, "This.name.Value == 'response_types'")
			if (oResponseTypesWvar != undefined)
			{
				var arrResponseTypes = DecodeJson(oResponseTypesWvar.value);
				arrResponseTypesIds = ArrayExtract(arrResponseTypes, "This.response_type_id");
				arrResponseTypesIdsTypeColl = ArrayExtract(tools.xquery("for $elem in response_types where MatchSome( $elem/id, (" + ArrayMerge(arrResponseTypesIds, "This", ",") + ") ) and $elem/code = 'responce_collaborator' return $elem/Fields('id')"),"This.id.Value");
				arrResponseTypesIdsTypeProj = ArrayExtract(tools.xquery("for $elem in response_types where MatchSome( $elem/id, (" + ArrayMerge(arrResponseTypesIds, "This", ",") + ") ) and $elem/code = 'responce_project_participant' return $elem/Fields('id')"),"This.id.Value");
			}
		}

		var xarrResponsesGivenToCollaboratorTypeCollDone = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIdsTypeColl, "This", ",") + ") ) and MatchSome( $elem/object_id, (" + sMergedCollabsIds + ") ) and $elem/status = 'done' order by $elem/object_id return $elem/Fields('object_id')"));
		var xarrResponsesGivenToCollaboratorTypeCollPlan = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIdsTypeColl, "This", ",") + ") ) and MatchSome( $elem/object_id, (" + sMergedCollabsIds + ") ) and $elem/status = 'plan' order by $elem/object_id return $elem/Fields('object_id')"));

		if ( ArrayOptFirstElem(ArrayIntersect(["response_given_to_collaborator_count","requested_response_count"], aAdditionalFields)) != undefined )
		{
			var xarrProjParticipants = tools.xquery("for $elem in project_participants where MatchSome( $elem/object_id,(" + sMergedCollabsIds + ") ) return $elem/Fields('id','object_id')");
		}

		if ( ArrayOptFirstElem(ArrayIntersect(["response_given_to_collaborator_count","requested_response_count"], aAdditionalFields)) != undefined )
		{
			var xarrProjParticipantsResponsesDone = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/object_id, (" + ArrayMerge(xarrProjParticipants, "This.id.Value", ",") + ") ) and MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIdsTypeProj, "This", ",") + ") ) and $elem/status = 'done' order by $elem/object_id return $elem/Fields('id', 'object_id')"));
			var arrCollAsProjParticipantResponsesCountsDone = [];
			for ( catProjParticipants in xarrProjParticipants )
			{
				_count = ArrayCount(ArraySelectBySortedKey(xarrProjParticipantsResponsesDone, catProjParticipants.id, "object_id"));
				if (_count != 0)
				{
					arrCollAsProjParticipantResponsesCountsDone.push({ coll_id: catProjParticipants.object_id.Value, count: _count});
				}
			}
			arrCollAsProjParticipantResponsesCountsDone = ArraySort(arrCollAsProjParticipantResponsesCountsDone, "coll_id", "+");
		}

		if ( ArrayOptFirstElem(ArrayIntersect(["response_given_to_collaborator_count","requested_response_count"], aAdditionalFields)) != undefined )
		{
			var xarrProjParticipantsResponsesPlan = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/object_id, (" + ArrayMerge(xarrProjParticipants, "This.id.Value", ",") + ") ) and MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIdsTypeProj, "This", ",") + ") ) and $elem/status = 'plan' order by $elem/object_id return $elem/Fields('id', 'object_id')"));
			var arrCollAsProjParticipantResponsesCountsPlan = [];
			for ( catProjParticipants in xarrProjParticipants )
			{
				_count = ArrayCount(ArraySelectBySortedKey(xarrProjParticipantsResponsesPlan, catProjParticipants.id, "object_id"));
				if (_count != 0)
				{
					arrCollAsProjParticipantResponsesCountsPlan.push({ coll_id: catProjParticipants.object_id.Value, count: _count});
				}
			}
			arrCollAsProjParticipantResponsesCountsPlan = ArraySort(arrCollAsProjParticipantResponsesCountsPlan, "coll_id", "+");
		}

		if ( ArrayOptFirstElem(ArrayIntersect(["added_response_count"], aAdditionalFields)) != undefined )
		{
			var xarrAddedResponseByCollaboratorDone = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIds, "This", ",") + ") ) and MatchSome( $elem/person_id, (" + sMergedCollabsIds + ") ) and $elem/status = 'done' order by $elem/person_id return $elem/Fields('person_id')"));
		}

		if ( ArrayOptFirstElem(ArrayIntersect(["need_add_response_count"], aAdditionalFields)) != undefined )
		{
			var xarrNeedAddResponseByCollaboratorPlan = ArrayDirect(tools.xquery("for $elem in responses where MatchSome( $elem/response_type_id, (" + ArrayMerge(arrResponseTypesIds, "This", ",") + ") ) and MatchSome( $elem/person_id, (" + sMergedCollabsIds + ") ) and $elem/status = 'plan' order by $elem/person_id return $elem/Fields('person_id')"));
		}
	}

	var catPosition, catPositionCommon, iCountValue, arrSubdivisionGroupSubdivisions;
	for ( catCollab in xarrCollabs )
	{
		oElem = {
			basic_info: catCollab.fullname.Value + " (" + catCollab.position_name.Value + ")",
			id: catCollab.id.Value,
			code: catCollab.code.Value,
			fullname: catCollab.fullname.Value,
			sex: "",
			birth_date: ( catCollab.birth_date.HasValue ? StrDate( catCollab.birth_date.Value, false ): "" ),
			login: catCollab.login.Value,
			email: catCollab.email.Value,
			primary_position: catCollab.position_name.Value,
			main_subdivision: catCollab.position_parent_name.Value,
			main_org: catCollab.org_name.Value,
			person_current_state: catCollab.current_state.Value,
			hire_date: ( catCollab.hire_date.HasValue ? StrDate( catCollab.hire_date.Value, false ): "" ),
			dismiss_date: ( catCollab.dismiss_date.HasValue ? StrDate( catCollab.dismiss_date.Value, false ): "" ),
			phone: catCollab.phone.Value,
			consent_kedo: ( catCollab.consent_kedo ? i18n.t( 'da' ) : i18n.t( 'net' ) ),
			access_role: ( ( catCollab.role_id.OptForeignElem != undefined ) ? catCollab.role_id.ForeignElem.name.Value : "" ),
			efficiency_estimation: (catCollab.efficiency_estimation_id.OptForeignElem != undefined ? catCollab.efficiency_estimation_id.OptForeignElem.name : ''),
			development_potential: (catCollab.development_potential_id.OptForeignElem != undefined ? catCollab.development_potential_id.OptForeignElem.name : '')
		};
		switch( StrLowerCase( catCollab.sex.Value ) )
		{
				case "w":
						oElem.sex = i18n.t( 'zhenskiy' );
						break;
				case "m":
						oElem.sex = i18n.t( 'muzhskoy' );
						break;
		}
		for( _field in aAdditionalFields )
		{
			iCountValue = 0;
			switch( _field )
			{
				case "typical_development_program_count":
					arrRequirementObjects = new Array();
					if( catCollab.position_id.HasValue )
					{
						catPosition = ArrayOptFindBySortedKey( xarrPositions, catCollab.position_id, "id" );
						if( catPosition != undefined && catPosition.position_common_id.HasValue )
						{
							arrRequirementObjects.push( catPosition.position_common_id );
							catPositionCommon = ArrayOptFindBySortedKey( xarrPositionCommons, catPosition.position_common_id, "id" );
							if( catPositionCommon != undefined && catPositionCommon.position_familys.HasValue )
							{
								arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtract( String( catPositionCommon.position_familys ).split( ";" ), "OptInt( This )" ) )
							}
						}
						if( catPosition != undefined && catPosition.parent_object_id.HasValue )
						{
							arrSubdivisionGroupSubdivisions = ArraySelectBySortedKey( xarrSubdivisionGroupSubdivisions, catPosition.parent_object_id, "subdivision_id" );
							arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtractKeys( arrSubdivisionGroupSubdivisions, "subdivision_group_id" ) );
						}
					}
					if( ArrayOptFirstElem( arrRequirementObjects ) != undefined )
					{
						iCountValue = ArrayCount( ArraySelectDistinct( ArrayIntersect( xarrRequirementObjects, arrRequirementObjects, "This.object_id", "This" ), "This.requirement_object_id" ) );
					}
					break;
				case "adaptation_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrAdaptations, catCollab.id, "person_id" ) );
					break;
				case "end_adaptation_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrAdaptationsPassedFailed, catCollab.id, "person_id" ) );
					break;
				case "active_adaptation_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrAdaptationsActive, catCollab.id, "person_id" ) );
					break;
				case "plan_adaptation_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrAdaptationsPlan, catCollab.id, "person_id" ) );
					break;
				case "career_reserve_active_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerReservesActive, catCollab.id, "person_id" ) );
					break;
				case "career_reserve_finished_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerReservesPassedFailed, catCollab.id, "person_id" ) );
					break;
				case "career_routes_request_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrRequests, catCollab.id, "person_id" ) )
					break;
				case "active_career_routes_request_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrRequestsActive, catCollab.id, "person_id" ) );
					break;
				case "career_routes_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerPlans, catCollab.id, "object_id" ) );
					break;
				case "career_routes_complete_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerPlansPassed, catCollab.id, "object_id" ) );
					break;
				case "career_routes_active_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerPlansActive, catCollab.id, "object_id" ) );
					break;
				case "career_routes_plan_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrCareerPlansPlan, catCollab.id, "object_id" ) );
					break;
				case "process_personnel_document_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrPersDocsProcess, catCollab.id, "person_id" ) );
					break;
				case "active_personnel_document_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrPersDocsActive, catCollab.id, "person_id" ) );
					break;
				case "active_badges_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( ArraySelect(arrQualificationAssignments, "This.status == 'assigned' && !tools_web.is_true(This.is_reward)"), catCollab.id, "person_id" ) );
					break;
				case "badges_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( ArraySelect(arrQualificationAssignments, "!tools_web.is_true(This.is_reward)"), catCollab.id, "person_id" ) );
					break;
				case "active_rewards_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( ArraySelect(arrQualificationAssignments, "This.status == 'assigned' && tools_web.is_true(This.is_reward)"), catCollab.id, "person_id" ) );
					break;
				case "rewards_count":
					iCountValue = ArrayCount( ArraySelectBySortedKey( ArraySelect(arrQualificationAssignments, "tools_web.is_true(This.is_reward)"), catCollab.id, "person_id" ) );
					break;
				case "candidate":
					xarrPersonnelReserves = tools.xquery("for $elem in personnel_reserves where $elem/person_id = " + catCollab.id + " and $elem/status = 'candidate' return $elem");
					iCountValue = ArrayCount(xarrPersonnelReserves);
					break;
				case "in_reserve":
					xarrPersonnelReserves = tools.xquery("for $elem in personnel_reserves where $elem/person_id = " + catCollab.id + " and $elem/status = 'in_reserve' return $elem");
					iCountValue = ArrayCount(xarrPersonnelReserves);
					break;
				case "left_reserve":
					xarrPersonnelReserves = tools.xquery("for $elem in personnel_reserves where $elem/person_id = " + catCollab.id + " and $elem/status = 'left_reserve' return $elem");
					iCountValue = ArrayCount(xarrPersonnelReserves);
					break;
				case "failed":
					xarrPersonnelReserves = tools.xquery("for $elem in personnel_reserves where $elem/person_id = " + catCollab.id + " and $elem/status = 'failed' return $elem");
					iCountValue = ArrayCount(xarrPersonnelReserves);
					break;
				case "response_given_to_collaborator_count":
					iCountValue = ArrayCount(ArraySelectBySortedKey(xarrResponsesGivenToCollaboratorTypeCollDone, catCollab.id.Value, "object_id"));
					oCollCount = ArrayOptFindBySortedKey(arrCollAsProjParticipantResponsesCountsDone, catCollab.id.Value, "coll_id");
					iCountValue += ( oCollCount != undefined ? oCollCount.count : 0);
					break;
				case "requested_response_count":
					iCountValue = ArrayCount(ArraySelectBySortedKey(xarrResponsesGivenToCollaboratorTypeCollPlan, catCollab.id.Value, "object_id"));
					oCollCount = ArrayOptFindBySortedKey(arrCollAsProjParticipantResponsesCountsPlan, catCollab.id.Value, "coll_id");
					iCountValue += ( oCollCount != undefined ? oCollCount.count : 0);
					break;
				case "added_response_count":
					iCountValue = ArrayCount(ArraySelectBySortedKey(xarrAddedResponseByCollaboratorDone, catCollab.id.Value, "person_id"));
					break;
				case "need_add_response_count":
					iCountValue = ArrayCount(ArraySelectBySortedKey(xarrNeedAddResponseByCollaboratorPlan, catCollab.id.Value, "person_id"));
					break;
				case "active_benefits":
					iCountValue = ArrayCount( ArraySelectBySortedKey( arrActiveBenefits, catCollab.id, "person_id" ) );
					break;
				case "benefit_profiles":
					if(examCheckBox)
					{
						xarrBenefitProfiles =  tools.call_code_library_method("libBenefit", "GetPersonBenefitProfile", [catCollab.id]);
						iCountValue = ArrayCount(xarrBenefitProfiles)
					}
					break; 
				case "virtual_benefits":
					if(examCheckBox)
					{
						xarrVirtualBenefits =  tools.call_code_library_method("libBenefit", "get_person_virtual_benefit", [catCollab.id]);
						iCountValue = ArrayCount(xarrVirtualBenefits)
					}
					break;
				}
			oElem.SetProperty( _field, iCountValue );
		}
		oRes.array.push(oElem);
	}

	xarrCollabs = undefined;
	xarrPositions = undefined;
	xarrPositionCommons = undefined;
	xarrSubdivisionGroupSubdivisions = undefined;
	arrRequests = undefined;
	arrCareerPlans = undefined;
	arrPersDocs = undefined;
	arrRequirementObjects = undefined;
	arrAdaptationsPassedFailed = undefined;
	arrAdaptationsActive = undefined;
	arrAdaptationsPlan = undefined;
	arrRequestsActive = undefined;
	arrCareerPlansPassed = undefined;
	arrCareerPlansActive = undefined;
	arrCareerPlansPlan = undefined;
	arrPersDocsProcess = undefined;
	arrPersDocsActive = undefined;
	arrCareerReserves = undefined;
	arrCareerReservesPassedFailed = undefined;
	arrCareerReservesActive = undefined;
	arrQualificationAssignments = undefined;
	arrActiveBenefits = undefined;
	xarrBenefitProfiles = undefined; 
	xarrVirtualBenefits = undefined;
	return oRes;
}

/**
 * @typedef {Object} oPositionsApp
 * @property {string} code
 * @property {string} name
 * @property {string} org_name
 * @property {string} subdivision_name
 * @property {string} collaborator_fullname
 * @property {date} position_date
 * @property {string} position_common_name
 * @property {string} kpi_profile_name
 * @property {string} bonus_profile_name
 * @property {string} knowledge_profile_name
*/
/**
 * @typedef {Object} ReturnPositionsApp
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oPositionsApp[]} array – Коллекция организаций.
*/
/**
 * @function GetPositionsApp
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка должностей.
 * @param {bigint} iCurUserID - ID текущего пользователя.
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"observer"/"auto"
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителей
 * @param {string} sApplication - код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID - ID текущего приложения
 * @param {string} sXQueryQual - строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @param {bigint} iTypicalPositions - ID типовой программы
 * @param {string[]} arrReturnData - Дополнительные возвращаемые поля
 * @returns {ReturnPositionsApp}
*/
function GetPositionsApp( iCurUserID, sAccessType, arrBossTypesID, sApplication, iCurApplicationID, sXQueryQual, oCollectionParams, iTypicalPositions, arrReturnData )
{
	try
	{
		if( !IsArray( arrReturnData ) )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		arrReturnData = new Array();
	}

	function get_positions_id_by_boss_types( arrBossTypesID, iTypicalPosition )
	{
		if ( arrBossTypesID == null || arrBossTypesID == undefined || !IsArray(arrBossTypesID) || ArrayOptFirstElem( arrBossTypesID ) == undefined )
		{
			sBossTypeIdCond = "";
		}
		else
		{
			sBossTypeIdCond = "and MatchSome($elem_qc/boss_type_id, (" + ArrayMerge(arrBossTypesID, 'This', ',') + ")) ";
		}

//руководитель (непосредственный) подразделения
		xqArrSubdivBoss =  tools.xquery("for $elem_qc in func_managers where $elem_qc/catalog = 'position' and $elem_qc/person_id = " + iCurUserID +" and $elem_qc/is_native = true() and $elem_qc/parent_id != null() return $elem_qc");

//функциональный руководитель подразделения
		xqArrSubdivFM =  tools.xquery("for $elem_qc in func_managers where $elem_qc/catalog = 'subdivision' and $elem_qc/person_id = " + iCurUserID +" and $elem_qc/is_native = false() " + sBossTypeIdCond + "return $elem_qc");

		arrSubdivsBossFMID = ArrayUnion( ArrayExtract( xqArrSubdivBoss, "This.parent_id.Value" ), ArrayExtract( xqArrSubdivFM, "This.object_id.Value" ));

//Подразделения ниже по иерархии
		var arrSubdivisionWithHier = ArrayExtract( arrSubdivsBossFMID, "({id: This})" );
		arrSubdivisionWithHier = ArraySort( arrSubdivisionWithHier, "This.id", "+" );
		var iCount = 0;
		var arrTempSubs = arrSubdivisionWithHier;
		while( iCount < 100 )
		{
			if( ArrayOptFirstElem( arrTempSubs ) == undefined )
			{
				break;
			}
			arrTempSubs = XQuery( "for $elem_qc in subdivisions where MatchSome($elem_qc/parent_object_id,(" +ArrayMerge(arrTempSubs, "This.id", ",")+ ")) return $elem_qc/Fields('id')" );

			arrTempSubs = ArraySelect( arrTempSubs, "ArrayOptFindBySortedKey( arrSubdivisionWithHier, This.id, 'id' ) == undefined" );
			arrSubdivisionWithHier = ArrayUnion( arrSubdivisionWithHier, arrTempSubs );
			arrSubdivisionsID = ArraySort( arrSubdivisionWithHier, "This.id", "+" );
			iCount++;
		}

//руководитель (непосредственный) организации
		xqOrgBosses = tools.xquery("for $elem_qc in positions where $elem_qc/basic_collaborator_id = " + iCurUserID + " and $elem_qc/parent_object_id = null() and $elem_qc/is_boss=true() return $elem_qc");

//функциональный руководитель организации
		xqArrOrgFM =  tools.xquery("for $elem_qc in func_managers where $elem_qc/catalog = 'org' and $elem_qc/person_id = " + iCurUserID +" and $elem_qc/is_native = false() " + sBossTypeIdCond + "return $elem_qc");

		arrOrgBossFMID = ArrayUnion( ArrayExtract( xqOrgBosses, "This.org_id" ) , ArrayExtract( xqArrOrgFM, "This.org_id.Value" ) );

		xarrSubdivsOrgsBossFM = tools.xquery("for $elem_qc in subdivisions where MatchSome($elem_qc/org_id, (" + ArrayMerge( arrOrgBossFMID, "This", "," ) + ")) return $elem_qc" );
		arrSubdivisionsID = ArrayUnion( arrSubdivisionsID, ArrayExtract( xarrSubdivsOrgsBossFM, "This.id.Value" ) );

//должности отобранных подразделений
		sCond = "";
		iTypicalPosition = OptInt( iTypicalPosition );
		if ( iTypicalPosition != undefined )
		{
			sCond = " and $elem_qc/position_common_id = " + iTypicalPositions;
		}

		sQuery = "for $elem_qc in positions where $elem_qc/parent_object_id != null() and MatchSome($elem_qc/parent_object_id, (" + ArrayMerge(arrSubdivisionsID, "This", ",") + ")) " + sCond + "return $elem_qc";
		xqPositionsByApplLevel =  tools.xquery( sQuery );

		// var arrPositionsToLimitIDs = ArraySelectDistinct( ArrayExtract( xqPositionsByApplLevel, "This.id.Value" ), "This" );
		var arrPositionsToLimitIDs = ArrayExtract( xqPositionsByApplLevel, "This.id.Value" );

		return arrPositionsToLimitIDs;
	}

	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];

	iCurUserID = OptInt( iCurUserID, 0);

	arrFilters = oCollectionParams.filters;

	var arrConds = [];
	if ( sXQueryQual == null || sXQueryQual == undefined)
		sXQueryQual = "";

	if ( sXQueryQual != "" )
		arrConds.push( sXQueryQual );

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);
		if(iApplicationID != undefined)
		{
			sApplication = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
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
			sAccessType = "hr";
		}
		else if(iApplLevel >= 3)
		{
			sAccessType = "expert";
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

	var teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));

	if ( sAccessType == "hr" )
	{
		arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );

		if (ArrayOptFirstElem(arrBossType) == undefined)
		{
			arrBossType = tools.call_code_library_method( "libApplication", "GetApplicationHRBossTypes", [ sApplication, iCurUserID ] );
		}

	}

	var bLimitPositions = false;
	var arrSubdivisionsID = [];
	var arrPositionsToLimitIDs = [];

	if ( iTypicalPositions != undefined && iTypicalPositions != null && iTypicalPositions != "" )
	{// передан iTypicalPositions

		iTypicalPositions = OptInt( iTypicalPositions, 0 );

		if ( teApplication == null ) //не приложение
		{
			xarrRes = tools.xquery("for $elem in positions where $elem/position_common_id = " + iTypicalPositions + " return $elem");
			arrPositionsToLimitIDs = ArrayExtract( xarrRes, "This.id.Value" );
			bLimitPositions = true;
		}
		else //приложение
		{
			switch(sAccessType)
			{
				case "admin":
				case "manager":
				case "expert":
					{
						xarrRes = tools.xquery("for $elem in positions where $elem/position_common_id = " + iTypicalPositions + " return $elem");
						arrPositionsToLimitIDs = ArrayExtract( xarrRes, "This.id.Value" );
						bLimitPositions = true;
						break;
					}
				case "hr":
					{
						arrPositionsToLimitIDs = get_positions_id_by_boss_types( arrBossType, iTypicalPositions );
						bLimitPositions = true;
						break;
					}
				case "observer":
					{
						arrPositionsToLimitIDs = get_positions_id_by_boss_types( [], iTypicalPositions );

						bLimitPositions = true;
						break;
					}
				case "reject":
					{
						return oRes;
					}
			}
		}

	}
	else
	{ // не передан iTypicalPositions
		switch(sAccessType)
		{
			case "hr":
				{
					arrPositionsToLimitIDs = get_positions_id_by_boss_types( arrBossType, null );

					bLimitPositions = true;
					break;
				}
			case "observer":
				{
					arrPositionsToLimitIDs = get_positions_id_by_boss_types( [], null );

					bLimitPositions = true;
					break;
				}
			case "reject":
				{
					bLimitPositions = true;
					break;
				}
		}
	}

//фильтрация
	if ( arrFilters != undefined && arrFilters != null && IsArray(arrFilters) )
	{
		for ( oFilter in arrFilters )
		{
			conds = [];
			if ( oFilter.type == 'search' )
			{
				if ( oFilter.value != '' )
				{
					sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )";
					arrConds.push( sSearchCond );
				}
			}
		}
	}

	if(bLimitPositions)
	{
		arrConds.push( "MatchSome( $elem/id, ( " + ArrayMerge( arrPositionsToLimitIDs, "This", "," ) + " ) )" );
	}

	var sCondSort = "";
	if(ObjectType(oCollectionParams.sort) == 'JsObject' && !IsEmptyValue(oCollectionParams.sort.FIELD) )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		switch(sFieldName)
		{
			case "code":
			case "name":
			case "basic_collaborator_fullname":
			case "position_date":
				sCondSort = " order by $elem/" + sFieldName;
		}
		sCondSort += (sCondSort != "" && StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "")
	}


	var sPositionsResQuery = "for $elem in positions " +
	((ArrayOptFirstElem(arrConds) != undefined) ? " where " + ArrayMerge(arrConds, "This", " and ") : "") +
	sCondSort +
	" return $elem";
	sPositionsResQuery = StrReplace( sPositionsResQuery, "$elem", "$elem_qc" );
	var xarrPositionsRes = tools.xquery( sPositionsResQuery );

	if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount(xarrPositionsRes);
		oRes.paging = oCollectionParams.paging;
		xarrPositionsRes = ArrayRange(xarrPositionsRes, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
	}

	xarrPositionsRes = ArrayDirect( xarrPositionsRes );

	var xarrPositionCommons = null;
	var xarrOrgs = new Array();
	if( ArrayOptFind( xarrPositionsRes, "This.org_id.HasValue" ) != undefined )
	{
		xarrOrgs = ArrayDirect( tools.xquery( "for $elem_qc in orgs where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelect( xarrPositionsRes, "This.org_id.HasValue" ), "This.org_id.Value", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','disp_name','name')" ) );
	}
	var xarrSubdivisions = new Array();
	if( ArrayOptFind( xarrPositionsRes, "This.parent_object_id.HasValue" ) != undefined )
	{
		sMergedParentObjectId = ArrayMerge( ArraySelect( xarrPositionsRes, "This.parent_object_id.HasValue" ), "This.parent_object_id.Value", "," );
		xarrSubdivisions = ArrayDirect( tools.xquery( "for $elem_qc in subdivisions where MatchSome( $elem_qc/id, ( " + sMergedParentObjectId + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','name')" ) );
	}
	var xarrKpiProfiles = new Array();
	if( ArrayOptFind( xarrPositionsRes, "This.kpi_profile_id.HasValue" ) != undefined )
	{
		xarrKpiProfiles = ArrayDirect( tools.xquery( "for $elem_qc in kpi_profiles where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelect( xarrPositionsRes, "This.kpi_profile_id.HasValue" ), "This.kpi_profile_id.Value", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','name')" ) );
	}
	var xarrBonusProfiles = new Array();
	if( ArrayOptFind( xarrPositionsRes, "This.bonus_profile_id.HasValue" ) != undefined )
	{
		xarrBonusProfiles = ArrayDirect( tools.xquery( "for $elem_qc in bonus_profiles where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelect( xarrPositionsRes, "This.bonus_profile_id.HasValue" ), "This.bonus_profile_id.Value", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','name')" ) );
	}
	var xarrKnowledgeProfiles = new Array();
	if( ArrayOptFind( xarrPositionsRes, "This.knowledge_profile_id.HasValue" ) != undefined )
	{
		xarrKnowledgeProfiles = ArrayDirect( tools.xquery( "for $elem_qc in knowledge_profiles where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelect( xarrPositionsRes, "This.knowledge_profile_id.HasValue" ), "This.knowledge_profile_id.Value", "," ) + " ) )  order by $elem_qc/id return $elem_qc/Fields('id','name')" ) );
	}
	var xarrSubdivisionGroups = null;
	var xarrTypicalProgramRequirements = null;
	if( ArrayOptFind( xarrPositionsRes, "This.position_common_id.HasValue" ) != undefined )
	{
		xarrPositionCommons = ArrayDirect( tools.xquery( "for $elem_qc in position_commons where MatchSome( $elem_qc/id, ( " + ArrayMerge( ArraySelect( xarrPositionsRes, "This.position_common_id.HasValue" ), "This.position_common_id.Value", "," ) + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','position_familys','name')" ) );
	}
	else
	{
		xarrPositionCommons = new Array();
	}
	for( _field in arrReturnData )
	{
		switch( _field )
		{
			case "family_position_count":
			{
				break;
			}
			case "group_subdivision_count":
			{
				if( xarrSubdivisionGroups == null )
				{
					if( ArrayOptFind( xarrPositionsRes, "This.parent_object_id.HasValue" ) != undefined )
					{

						// xarrSubdivisionGroups = XQuery( "for $elem in subdivision_group_subdivisions where MatchSome( $elem/id, ( " + ArraySelectDistinct( ArrayExtractKeys( ArraySelect( xarrPositionsAll, "This.parent_object_id.HasValue" ), "parent_object_id" ), "This" ) + " ) ) return $elem/Fields('id','subdivision_id')" );
						xarrSubdivisionGroups = tools.xquery( "for $elem_qc in subdivision_group_subdivisions where MatchSome( $elem_qc/subdivision_id, ( " + sMergedParentObjectId + " ) ) return $elem_qc/Fields('id','subdivision_id')" );
					}
					else
					{
						xarrSubdivisionGroups = new Array();
					}
				}
				break;
			}
			case "uni_typical_program_count":
			case "out_typical_program_count":
			case "internal_typical_program_count":
			case "typical_program_count":
			{
				if( xarrSubdivisionGroups == null )
				{
					if( ArrayOptFind( xarrPositionsRes, "This.parent_object_id.HasValue" ) != undefined )
					{

						// xarrSubdivisionGroups = XQuery( "for $elem in subdivision_group_subdivisions where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArrayExtractKeys( ArraySelect( xarrPositionsAll, "This.parent_object_id.HasValue" ), "parent_object_id" ), "This" ), "This", "," ) + " ) ) return $elem/Fields('subdivision_group_id','subdivision_id')" );
						xarrSubdivisionGroups = tools.xquery( "for $elem in subdivision_group_subdivisions where MatchSome( $elem/id, ( " + sMergedParentObjectId + " ) ) return $elem/Fields('subdivision_group_id','subdivision_id')" );
					}
					else
					{
						xarrSubdivisionGroups = new Array();
					}
				}

				if( xarrTypicalProgramRequirements == null )
				{
					var arrRequirementObjects = new Array();
					arrRequirementObjects = ArrayUnion( ArrayExtractKeys( xarrPositionCommons, "id" ), ArrayExtractKeys( xarrSubdivisionGroups, "subdivision_group_id" ), ArrayMerge( ArraySelect( xarrPositionCommons, "This.position_familys.HasValue" ), "This.position_familys", ";" ).split( ";" ) );
					if( ArrayOptFirstElem( arrRequirementObjects ) != undefined )
					{
						xarrTypicalProgramRequirements = XQuery( "for $elem in object_requirements where MatchSome( $elem/id, ( " + ArrayMerge( arrRequirementObjects, "This", "," ) + " ) ) and $elem/requirement_object_type = 'typical_development_program' return $elem/Fields('object_id','additional_param')" );
					}
					else
					{
						xarrTypicalProgramRequirements = new Array();
					}
				}
				break;
			}
		}
	}
	for ( catPosition in xarrPositionsRes )
	{
		if( catPosition.position_common_id.HasValue )
		{
			catCommonPosition = ArrayOptFindBySortedKey( xarrPositionCommons, catPosition.position_common_id, "id" );
		}
		else
		{
			catCommonPosition = undefined;
		}
		if( catPosition.org_id.HasValue )
		{
			catOrg = ArrayOptFindBySortedKey( xarrOrgs, catPosition.org_id, "id" );
		}
		else
		{
			catOrg = undefined;
		}
		if( catPosition.parent_object_id.HasValue )
		{
			catSubdivision = ArrayOptFindBySortedKey( xarrSubdivisions, catPosition.parent_object_id, "id" );
		}
		else
		{
			catSubdivision = undefined;
		}
		if( catPosition.kpi_profile_id.HasValue )
		{
			catKpiProfile = ArrayOptFindBySortedKey( xarrKpiProfiles, catPosition.kpi_profile_id, "id" );
		}
		else
		{
			catKpiProfile = undefined;
		}
		if( catPosition.bonus_profile_id.HasValue )
		{
			catBonusProfile = ArrayOptFindBySortedKey( xarrBonusProfiles, catPosition.bonus_profile_id, "id" );
		}
		else
		{
			catBonusProfile = undefined;
		}
		if( catPosition.knowledge_profile_id.HasValue )
		{
			catKnowledgeProfile = ArrayOptFindBySortedKey( xarrKnowledgeProfiles, catPosition.knowledge_profile_id, "id" );
		}
		else
		{
			catKnowledgeProfile = undefined;
		}

		arrSubdivisionGroups = null;
		oElem = {
			id: catPosition.id.Value,
			code: catPosition.code.Value,
			name: catPosition.name.Value,
			org_name: ( ( catOrg != undefined ) ? catOrg.disp_name.Value : "" ),
			subdivision_name: ( ( catSubdivision != undefined ) ? catSubdivision.name.Value : "" ),
			collaborator_fullname: catPosition.basic_collaborator_fullname.Value,
			position_date: catPosition.position_date.Value,
			position_common_name: ( ( catCommonPosition != undefined ) ? catCommonPosition.name.Value : "" ),
			kpi_profile_name: ( ( catKpiProfile != undefined ) ? catKpiProfile.name.Value : "" ),
			bonus_profile_name: ( ( catBonusProfile != undefined ) ? catBonusProfile.name.Value : "" ),
			knowledge_profile_name: ( ( catKnowledgeProfile != undefined ) ? catKnowledgeProfile.name.Value : "" )
		};
		arrRequirements = null;
		for( _field in arrReturnData )
		{
			switch( _field )
			{
				case "family_position_count":
				{
					iFamilyPositionsCount = 0;
					if( catPosition.position_common_id.HasValue )
					{
						if( catCommonPosition == null )
						{
							catCommonPosition = ArrayOptFindByKey( xarrPositionCommons, catPosition.position_common_id, "id" );
						}
						if( catCommonPosition != undefined && catCommonPosition.position_familys.HasValue )
						{
							iFamilyPositionsCount = ArrayCount( String( catCommonPosition.position_familys ).split( ";" ) );
						}
					}
					oElem.SetProperty( _field, iFamilyPositionsCount );
					break;
				}
				case "group_subdivision_count":
				{
					iSubdivisionGroupsCount = 0;
					if( catPosition.parent_object_id.HasValue )
					{
						if( arrSubdivisionGroups == null )
						{
							arrSubdivisionGroups = ArraySelectByKey( xarrSubdivisionGroups, catPosition.parent_object_id, "subdivision_id" );
						}
						iSubdivisionGroupsCount = ArrayCount( arrSubdivisionGroups );
					}
					oElem.SetProperty( _field, iSubdivisionGroupsCount );
					break;
				}
				case "uni_typical_program_count":
				case "out_typical_program_count":
				case "internal_typical_program_count":
				case "typical_program_count":
				{
					if( arrRequirements == null )
					{
						arrRequirementObjects = new Array();
						if( catPosition.position_common_id.HasValue )
						{
							arrRequirementObjects.push( catPosition.position_common_id );
						}
						if( catCommonPosition == null )
						{
							catCommonPosition = ArrayOptFindByKey( xarrPositionCommons, catPosition.position_common_id, "id" );
						}
						if( catCommonPosition != undefined && catCommonPosition.position_familys.HasValue )
						{
							arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtract( String( catCommonPosition.position_familys ).split( ";" ), "OptInt( This )" ) );
						}
						if( arrSubdivisionGroups == null )
						{
							arrSubdivisionGroups = ArraySelectByKey( xarrSubdivisionGroups, catPosition.parent_object_id, "subdivision_id" );
						}
						arrRequirementObjects = ArrayUnion( arrRequirementObjects, ArrayExtractKeys( arrSubdivisionGroups, "subdivision_group_id" ) );
						arrRequirements = new Array();
						if( ArrayOptFirstElem( arrRequirementObjects ) != undefined )
						{
							arrRequirements = ArrayIntersect( xarrTypicalProgramRequirements, arrRequirementObjects, "This.object_id", "This" );
						}
					}
					switch( _field )
					{
						case "uni_typical_program_count":
							oElem.SetProperty( _field, ArrayCount( ArraySelectByKey( arrRequirements, "any", "additional_param" ) ) );
							break;
						case "out_typical_program_count":
							oElem.SetProperty( _field, ArrayCount( ArraySelectByKey( arrRequirements, "ext", "additional_param" ) ) );
							break;
						case "internal_typical_program_count":
							oElem.SetProperty( _field, ArrayCount( ArraySelectByKey( arrRequirements, "int", "additional_param" ) ) );
							break;
						case "typical_program_count":
							oElem.SetProperty( _field, ArrayCount( arrRequirements ) );
							break;
					}

					break;
				}
			}
		}
		oRes.array.push(oElem);
	}

	xarrPositionsRes = null;
	xarrOrgs = null;
	xarrSubdivisions = null;
	xarrKpiProfiles = null;
	xarrBonusProfiles = null;
	xarrKnowledgeProfiles = null;
	xarrPositionCommons = null;

	return oRes;
}

/** @typedef {Object} oSubdivisionGroup
 * @property {string} code
 * @property {string} name
 * @property {bigint} subdivisions_count
 * @property {bigint} typical_development_programs_count
 * @property {boolean} is_dynamic
*/
/**
 * @typedef {Object} ReturnSubdivisionGroups
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oSubdivisionGroup[]} array – Коллекция организаций.
*/
/**
 * @function GetSubdivisionGroups
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка групп подразделений.
 * @param {string} sFilter - строка для XQuery-фильтра
 * @param {string} sFulltext - строка для поиска
 * @param {bigint} iTypicalDevelopmentProgram - ID типовой программы развития
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"observer"/"auto"
 * @param {bigint[]} arrBossTypesID - Массив типов руководителей
 * @param {string} ApplicationParam код или ID приложения, по которому определяется доступ
 * @param {string[]} arrReturnData Набор вычисляемых атрибутов выборки
 * @param {bigint} iCurUserIDParam ID текущего пользователя.
 * @returns {ReturnSubdivisionGroups}
*/
function GetSubdivisionGroups( sFilter, sFulltext, iTypicalDevelopmentProgram, sAccessType, arrBossTypesID, ApplicationParam, arrReturnData, iCurUserIDParam )
{
	iTypicalDevelopmentProgram = tools_web.parse_multiple_parameter( iTypicalDevelopmentProgram );
	iTypicalDevelopmentProgram = ArrayOptFirstElem( iTypicalDevelopmentProgram, 0 );

	try
	{
		var iCurUserID = CurRequest.Session.Env.GetOptProperty( "curUserID" );
		if(IsEmptyValue(iCurUserID))
			throw "no person is session"
	}
	catch(e)
	{
		iCurUserID = OptInt( iCurUserIDParam, 0);
	}

	var oRes = tools.get_code_library_result_object();
	oRes.array = [];

	if ( sFilter == null || sFilter == undefined)
		sFilter = "";

	if ( sFulltext == null || sFulltext == undefined)
		sFulltext = "";

	sXQueryQual = sFilter;

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
	{
		sAccessType = "auto";
	}

	if(sAccessType == "auto")
	{
/* 		
		iApplicationID = OptInt(ApplicationParam);
		if(iApplicationID != undefined)
		{
			ApplicationParam = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
		} 
*/
		var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, ApplicationParam ] );

		if(iApplLevel >= 10) // Администратор приложения
		{
			sAccessType = "admin";
		}
		else if(iApplLevel >= 7) // администратор процесса
		{
			sAccessType = "manager";
		}
		else if(iApplLevel >= 5) // HR
		{
			sAccessType = "hr";
		}
		else if(iApplLevel >= 3) // методист
		{
			sAccessType = "expert";
		}
		else if(iApplLevel >= 1) // Наблюдатель
		{
			sAccessType = "observer";
		}
		else
		{
			sAccessType = "reject";
		}
	}
	var bSelectBySubdivision = false;
	var arrSubdivisionIds = null;
	var conds = new Array();
	switch(sAccessType)
	{
		case "admin":
		case "manager":
		case "expert":
			break;
		case "hr":

			arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );

			if (ArrayOptFirstElem(arrBossType) == undefined)
				arrBossType = tools.call_code_library_method( "libApplication", "GetApplicationHRBossTypes", [ ApplicationParam, iCurUserID ] );
			
			if( ArrayOptFirstElem(arrBossType) != undefined )
			{
				sSubdivisionQuery = "for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iCurUserID +" and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) return $elem"

				xqArrSubdivision =  tools.xquery(sSubdivisionQuery);
				arrSubdivisionIds = ArrayExtractKeys( xqArrSubdivision, "object_id" );
				for ( oSubdivisionID in xqArrSubdivision )
				{
					if( ArrayOptFind( arrSubdivisionIds, "This == oSubdivisionID.object_id.Value" ) == undefined )
					{
						oSubs = tools.xquery( "for $elem in subdivisions where IsHierChild( $elem/id, " + oSubdivisionID.object_id.Value + " ) order by $elem/Hier() return $elem/Fields('id')" );
						for( oSub in oSubs )
						{
							arrSubdivisionIds.push( oSub.id.Value );
						}
						arrSubdivisionIds.push( oSubdivisionID.id.Value );
					}
				}
				if( ArrayOptFirstElem( arrSubdivisionIds ) == undefined )
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
			sSubdivisionQuery = "for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iCurUserID +" return $elem"
			xqArrSubdivision = tools.xquery(sSubdivisionQuery)

			arrSubdivisionIds = ArrayExtractKeys( xqArrSubdivision, "object_id" );
			if( ArrayOptFirstElem( arrSubdivisionIds ) == undefined )
			{
				return oRes;
			}
			break;
		case "reject":
			return oRes;
			break;
	}

	if ( sFulltext != '' )
	{
		sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( sFulltext ) + " )";
		sXQueryQual = ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond )
	}

	var xarrSubdivGroups = tools.xquery( "for $elem in subdivision_groups " +
		(sXQueryQual == "" ? "" : ("where " + sXQueryQual)) +
		"return $elem" );
	if( arrSubdivisionIds != null )
	{
		var xarrSelectSubdivGroupSubdivs = tools.xquery( "for $elem_qc in subdivision_group_subdivisions where MatchSome( $elem_qc/subdivision_id, ( " + ArrayMerge( arrSubdivisionIds, "This", "," ) + " ) ) return $elem_qc/Fields('subdivision_group_id')" );
		xarrSelectSubdivGroupSubdivs = ArraySelectDistinct( xarrSelectSubdivGroupSubdivs, "This.subdivision_group_id" );
		xarrSubdivGroups = ArrayIntersect( xarrSubdivGroups, xarrSelectSubdivGroupSubdivs, "This.id", "This.subdivision_group_id" );
	}
	if( ArrayOptFirstElem( xarrSubdivGroups ) == undefined )
	{
		return oRes;
	}
	var xarrSubdivGroupSubdivs = ArrayDirect(tools.xquery( "for $elem_qc in subdivision_group_subdivisions where MatchSome( $elem_qc/subdivision_group_id, ( " + ArrayMerge( xarrSubdivGroups, "This.id", "," ) + " ) ) order by $elem_qc/subdivision_group_id return $elem_qc/Fields('id','subdivision_id','subdivision_group_id')" ));

	var AttributValue, arrSubdivCurSubdivGroup;
	for ( catSubdivGroup in xarrSubdivGroups )
	{
		iTypDevProgCount = 0;
		oJobTransferTypeName = "";

		docSubdivGroup = tools.open_doc( catSubdivGroup.id.Value );
		if( docSubdivGroup != undefined )
		{
			teSubdivGroup = docSubdivGroup.TopElem;
			iTypDevProgCount = ArrayCount( teSubdivGroup.typical_development_programs );

			if ( iTypicalDevelopmentProgram != 0 )
			{
				oFoundElem = ArrayOptFind ( teSubdivGroup.typical_development_programs, "This.typical_development_program_id == iTypicalDevelopmentProgram" );
				if ( iTypicalDevelopmentProgram != 0 && oFoundElem == undefined )
				{
					continue;
				}

				if(oFoundElem != undefined){
					oJobTransferType = ArrayOptFind( common.job_transfer_types, 'This.id == oFoundElem.job_transfer_type_id.Value' );

					if(oJobTransferType != undefined)
						oJobTransferTypeName = oJobTransferType.name.Value
				}
			}
		}
		
		arrSubdivCurSubdivGroup = ArraySelectBySortedKey(xarrSubdivGroupSubdivs, catSubdivGroup.id.Value, "subdivision_group_id");
		oElem = {
			id: catSubdivGroup.id.Value,
			code: catSubdivGroup.code.Value,
			name: catSubdivGroup.name.Value,
			subdivisions_count: ArrayCount( arrSubdivCurSubdivGroup ),
			typical_development_programs_count: iTypDevProgCount,
			is_dynamic: catSubdivGroup.is_dynamic.Value,
			job_transfer_type_id: oJobTransferTypeName
		}
		for(itemData in arrReturnData)
		{
			switch(itemData)
			{
				case "position_num":
				{
					AttributValue = ArrayCount(tools.xquery( "for $elem_qc in positions where MatchSome( $elem_qc/parent_object_id, ( " + ArrayMerge( arrSubdivCurSubdivGroup, "subdivision_id", "," ) + " ) ) return $elem_qc/Fields('id')" ));
					
					oElem.SetProperty("position_num", AttributValue)
					break;
				}
			}
		}
		
		oRes.array.push(oElem);
	}

	return oRes;
}

/**
 * @typedef {Object} WTSubdivisionGroupUpdateResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function SubdivisionGroupUpdate
 * @memberof Websoft.WT.Main
 * @description Обновить список подразделений группы
 * @author EO
 * @param {bigint[]} arrSubdivGroupIDs - массив ID организаций
 * @param {string} sAddType - тип обновления подразделений в группе: "replace"/"add" (заменить/добавить)
 * @returns {WTSubdivisionGroupUpdateResult}
*/
function SubdivisionGroupUpdate( arrSubdivGroupIDs, sAddType )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrSubdivGroupIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrSubdivGroupIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "subdivision_group")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_5' );
		return oRes;
	}

	for ( itemSubdivGroupID in arrSubdivGroupIDs )
	{
		try
		{
			iSubdivGroupID = OptInt(itemSubdivGroupID);
			if(iSubdivGroupID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			docSubdivGroupID = tools.open_doc(iSubdivGroupID);
			if ( docSubdivGroupID == undefined )
			{
				continue;
			}
			if ( docSubdivGroupID.TopElem.is_dynamic )
			{
				docSubdivGroupID.TopElem.dynamic_select_person( sAddType == "add" ? false: true );
				docSubdivGroupID.Save();
				oRes.count++;
			}
		}
		catch(err)
		{
			alert("ERROR: SubdivisionGroupUpdate: " + ("[" + itemSubdivGroupID + "]\r\n") + err, true);
		}
	}
	return oRes;
}


/**
 * @typedef {Object} WTSubdivisionGroupUpdateAllResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {WTLPEForm} action_result – результат
*/
/**
 * @function SubdivisionGroupUpdateAll
 * @memberof Websoft.WT.Main
 * @description Обновить все группы подразделений
 * @author EO
 * @param {string} sAddType - тип обновления подразделений в группе: "replace"/"add" (заменить/добавить)
 * @returns {WTSubdivisionGroupUpdateAllResult}
*/
function SubdivisionGroupUpdateAll( sAddType )
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	xarrSubdivGroups = tools.xquery("for $elem in subdivision_groups where $elem/is_dynamic = true() return $elem/Fields('id')")

	for ( catSubdivGroupID in xarrSubdivGroups )
	{
		try
		{
			docSubdivGroupID = tools.open_doc( catSubdivGroupID.id.Value );
			if ( docSubdivGroupID == undefined )
			{
				continue;
			}
			if ( docSubdivGroupID.TopElem.is_dynamic )
			{
				docSubdivGroupID.TopElem.dynamic_select_person( sAddType == "add" ? false: true );
				docSubdivGroupID.Save();
				oRes.count++;
			}
		}
		catch(err)
		{
			alert("ERROR: SubdivisionGroupUpdateAll: " + ("[" + itemSubdivGroupID + "]\r\n") + err, true);
		}
	}
	return oRes;
}

/**
 * @typedef {Object} SubordinatesLearningContext
 * @property {number} percent_mandatory_course – % обязательного обучения курсов.
 * @property {number} percent_mandatory_test – % обязательного обучения тестов.
 * @property {number} overdue_learning_course – Количество просроченного обучения курсов.
 * @property {number} overdue_learning_test – Количество просроченного обучения тестов.
*/
/**
 * @typedef {Object} ReturnSubordinatesLearningContext
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {SubordinatesLearningContext} context – Контекст моих отпусков.
*/
/**
 * @function GetSubordinatesLearningContext
 * @memberof Websoft.WT.Main
 * @author PL
 * @description Получение контекста сотрудника по обучению.
 * @param {bigint} iCurUserID - ID пользователя для поддержки ролевой модели.
 * @param {string} sAppCode - Код приложения для поддержки ролевой модели.
 * @returns {ReturnSubordinatesLearningContext}
*/
function GetSubordinatesLearningContext( iCurUserID, sAppCode )
{
	var oRes = tools.get_code_library_result_object();
	oRes.context = new Object;

	try
	{
		iCurUserID = Int( iCurUserID );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
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

	function get_percent_mandatory_course()
	{
		iCount = ArrayCount( xarrActiveLearningsMandatory ) + ArrayCount( xarrLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveLearnings ) + ArrayCount( xarrLearnings ) );
	}

	function get_percent_mandatory_test()
	{
		iCount = ArrayCount( xarrActiveTestLearningsMandatory ) + ArrayCount( xarrTestLearningsMandatory );
		if( iCount == 0 )
		{
			return 0;
		}
		return ( iCount * 100 ) / ( ArrayCount( xarrActiveTestLearnings ) + ArrayCount( xarrTestLearnings ) );
	}

	function get_overdue_learning_course()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrActiveLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning += ArrayCount(ArraySelect(xarrLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning;
	}
	function get_overdue_learning_test()
	{
		var iOverdue_learning = 0;

		iOverdue_learning += ArrayCount(ArraySelect(xarrActiveTestLearnings, "This.max_end_date.HasValue && This.max_end_date < Date() "));
		iOverdue_learning += ArrayCount(ArraySelect(xarrTestLearnings, "This.max_end_date.HasValue && This.max_end_date < This.last_usage_date "));

		return iOverdue_learning;
	}
	function get_xquery( sCatalog, sCond )
	{
		return XQuery( "for $elem in " + sCatalog + " where " + sSubordinateCond + ( sCond != "" ? ( " and " + sCond ) : "" ) + " return $elem" );
	}

	iAccessApp = tools.call_code_library_method('libApplication', 'GetPersonApplicationAccessLevel', [iCurUserID, sAppCode]);
	course_conds = "";
	test_conds = "";
	if (iAccessApp == 3)
	{
		arrExpert = tools.xquery("for $elem in experts where $elem/person_id = " + iCurUserID + " return $elem/Fields('id')");
		if ( ArrayOptFirstElem( arrExpert ) != undefined )
		{
			iExpertID = ArrayOptFirstElem( arrExpert ).id;
			arrCategories = tools.xquery("for $elem in roles where contains ($elem/experts, '" + iExpertID + "') return $elem/Fields('id')");
			sCatExpert = "MatchSome($elem/role_id, (" + ArrayMerge ( arrCategories, 'This.id', ',' ) + "))";

			xarrCourse = XQuery( "for $elem in courses where " + sCatExpert + " return $elem/Fields('id')" );
			course_conds = " MatchSome($elem/course_id, (" + ArrayMerge(xarrCourse, "This.id", ",") + "))";

			xarrTest = XQuery( "for $elem in assessments where " + sCatExpert + " return $elem/Fields('id')" );
			test_conds = " MatchSome($elem/assessment_id, (" + ArrayMerge(xarrTest, "This.id", ",") + "))";
		}
	}

	var oGetSubordinateParams = {
			arrTypeSubordinate: ['fact','func'],
			bReturnIDs: true,
			sCatalog: "",
			arrFieldsNames: null,
			xQueryCond: "",
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			bWithoutUseManagementObject: false,
	};
	var arrSubordinateIDs = GetSubordinateRecords(iCurUserID, oGetSubordinateParams);
	
	if( ArrayOptFirstElem( arrSubordinateIDs ) == undefined )
	{
		var oContext = {
			percent_mandatory_course: "",
			percent_mandatory_test: "",
			overdue_learning_course: "",
			overdue_learning_test: "",
		};
	}
	else
	{
		var sSubordinateCond = " MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )";
		// course
		var xarrActiveLearnings = get_xquery( "active_learnings", course_conds );
		var xarrActiveLearningsMandatory = ArraySelect(xarrActiveLearnings, "This.creation_user_id != This.person_id && This.is_self_enrolled == false");
		var xarrLearnings = get_xquery( "learnings", course_conds );
		var xarrLearningsMandatory = ArraySelect(xarrLearnings, "This.creation_user_id != This.person_id && This.is_self_enrolled == false");

		// test
		var xarrActiveTestLearnings = get_xquery( "active_test_learnings", test_conds );
		var xarrActiveTestLearningsMandatory = ArraySelect(xarrActiveTestLearnings, "This.creation_user_id != This.person_id && This.is_self_enrolled == false");
		var xarrTestLearnings = get_xquery( "test_learnings", test_conds );
		var xarrTestLearningsMandatory = ArraySelect(xarrTestLearnings, "This.creation_user_id != This.person_id && This.is_self_enrolled == false");

		var oContext = {
			percent_mandatory_course: get_percent_mandatory_course(),
			percent_mandatory_test: get_percent_mandatory_test(),
			overdue_learning_course: get_overdue_learning_course(),
			overdue_learning_test: get_overdue_learning_test(),
		};
	}
	oRes.context = oContext;

	return oRes;
}


/**
 * @typedef {Object} WTTypicalPositionSpreadPositionsResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество измененных должностей
 * @property {integer} PosCommonCount – количество примененных типовых должностей
*/
/**
 * @function TypicalPositionSpreadPositions
 * @memberof Websoft.WT.Main
 * @description Проставляет должностям типовую должность(должности)
 * @author EO
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {bigint[]} arrPosCommonIDs - массив ID типовых должностей
 * @param {string} sCanChange - вид действия, если у должности уже есть типовая должность: "replace"/"skip" (Заменять/Пропускать)
 * @returns {WTTypicalPositionSpreadPositionsResult}
*/
function TypicalPositionSpreadPositions( iCurUserID, arrPosCommonIDs, sCanChange, sApplicationCode )
{
	function get_positions_id_by_boss_types( arrBossTypesID, iTypicalPosition )
	{
		if ( arrBossTypesID == null || arrBossTypesID == undefined || !IsArray(arrBossTypesID) || ArrayOptFirstElem( arrBossTypesID ) == undefined )
		{
			sBossTypeIdCond = "";
		}
		else
		{
			sBossTypeIdCond = "and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossTypesID, 'This', ',') + ")) ";
		}

//руководитель (непосредственный) подразделения
		xqArrSubdivBoss =  tools.xquery("for $elem in func_managers where $elem/catalog = 'position' and $elem/person_id = " + iCurUserID +" and $elem/is_native = true() and $elem/parent_id != null() return $elem");

//функциональный руководитель подразделения
		xqArrSubdivFM =  tools.xquery("for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iCurUserID +" and $elem/is_native = false() " + sBossTypeIdCond + "return $elem");

		arrSubdivsBossFMID = ArrayUnion( ArrayExtract( xqArrSubdivBoss, "This.parent_id.Value" ), ArrayExtract( xqArrSubdivFM, "This.object_id.Value" ));

//Подразделения ниже по иерархии
		for ( iSubdivID in arrSubdivsBossFMID )
		{
			xarrHierSubdivisions = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + iSubdivID + " ) order by $elem/Hier() return $elem/Fields('id', 'name', 'parent_object_id', 'org_id')" );
			arrSubdivisionsID = ArrayUnion( arrSubdivisionsID, ArrayExtract( xarrHierSubdivisions, "This.id.Value" ) );
		}

//руководитель (непосредственный) организации
		xqOrgBosses = tools.xquery("for $elem in positions where $elem/basic_collaborator_id = " + iCurUserID + " and $elem/parent_object_id = null() and $elem/is_boss=true() return $elem");

//функциональный руководитель организации
		xqArrOrgFM =  tools.xquery("for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iCurUserID +" and $elem/is_native = false() " + sBossTypeIdCond + "return $elem");

		arrOrgBossFMID = ArrayUnion( ArrayExtract( xqOrgBosses, "This.org_id" ) , ArrayExtract( xqArrOrgFM, "This.org_id.Value" ) );

		xarrSubdivsOrgsBossFM = tools.xquery("for $elem in subdivisions where MatchSome($elem/org_id, (" + ArrayMerge( arrOrgBossFMID, "This", "," ) + ")) return $elem" );
		arrSubdivisionsID = ArrayUnion( arrSubdivisionsID, ArrayExtract( xarrSubdivsOrgsBossFM, "This.id.Value" ) );


//должности отобранных подразделений
		sCond = "";
		iTypicalPosition = OptInt( iTypicalPosition );
		if ( iTypicalPosition != undefined )
		{
			sCond = " and $elem/position_common_id = " + iTypicalPositions;
		}
		xqPositionsByApplLevel =  tools.xquery( "for $elem in positions where MatchSome($elem/parent_object_id, (" + ArrayMerge(arrSubdivisionsID, "This", ",") + ")) " + sCond + "return $elem" );

		var arrPositionsToLimitIDs = ArraySelectDistinct( ArrayExtract( xqPositionsByApplLevel, "This.id.Value" ), "This" );

		return arrPositionsToLimitIDs;
	}

	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;
	oRes.PosCommonCount = 0;

	if(!IsArray(arrPosCommonIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPosCommonIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "position_common")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_6' );
		return oRes;
	}


    var teApplication = undefined;
    var iApplLevel = 0;
    try
    {
        teApplication = tools_app.get_cur_application( sApplicationCode );
        iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, teApplication.id ] );
    }
    catch( err) {}

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
    else
    {
        sAccessType = "reject";
    }

	var arrBossType = [];
	var arrSubdivisionsID = [];
	var bLimitPositions = false;
	switch(sAccessType)
	{
		case "admin":
		case "manager":
		case "expert":
			{
				break;
			}
		case "hr":
			{
				if (ArrayOptFirstElem(arrBossType) == undefined)
				{
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

				arrPositionsToLimitIDs = get_positions_id_by_boss_types( arrBossType, null );
				bLimitPositions = true;
				break;
			}
		case "reject":
			{
				oRes.error = 1;
				oRes.errorText = i18n.t( 'typicalpositio' );
				return oRes;
			}
	}

	arrPosCommonIDsApplied = [];
	for ( itemPosCommonID in arrPosCommonIDs )
	{
		try
		{
			iPosCommonID = OptInt(itemPosCommonID);
			if(iPosCommonID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			docPosCommon = tools.open_doc(iPosCommonID);
			if ( docPosCommon == undefined )
			{
				continue;
			}
			if ( docPosCommon.TopElem.status != "active" )
			{
				continue;
			}
			if ( docPosCommon.TopElem.position_names.ChildNum == 0 )
			{
				continue;
			}

			conds = new Array();

			_condition_str = '';
			for ( _name in docPosCommon.TopElem.position_names )
				if ( StrContains( _name.name, '*' ) )
				{
					_piece_str = '';
					_counter = 0;
					for ( _piece in String( _name.name ).split( '*' ) )
						if ( Trim( _piece ) != '' )
						{
							_piece_str += ( _counter == 0 ? '' : ' and ' ) + 'contains($elem/name,' + XQueryLiteral( Trim( _piece ) ) + ')';
							_counter++;
						}

					if ( _piece_str != '' )
						_condition_str += ( _name.ChildIndex == 0 ? '' : ' or ' ) + '( ' + _piece_str + ' )';
				}
				else
				{
					_condition_str += ( _name.ChildIndex == 0 ? '' : ' or ' ) + '( $elem/name = \'' + _name.name + '\' )';
				}
			conds.push( '(' + _condition_str + ')' );
			if( docPosCommon.TopElem.orgs.ChildNum > 0 )
				conds.push( 'MatchSome( $elem/org_id, ( ' + ArrayMerge( docPosCommon.TopElem.orgs, 'This.PrimaryKey', ',' ) + ' ) )' );
			if( docPosCommon.TopElem.subdivisions.ChildNum > 0 )
				conds.push( 'MatchSome( $elem/parent_object_id, ( ' + ArrayMerge( docPosCommon.TopElem.subdivisions, 'This.PrimaryKey', ',' ) + ' ) )' )

			xarrPositions = XQuery( 'for $elem in positions where ' + ArrayMerge( conds, 'This', ' and ' ) + ' return $elem' );

			if ( bLimitPositions )
			{
				xarrPositions = ArrayIntersect( xarrPositions, arrPositionsToLimitIDs, "OptInt( This.id.Value )", "OptInt( This )" )
			}

			for ( catPos in xarrPositions )
			{
				if ( sCanChange == "replace" || ( sCanChange == "skip" && !catPos.position_common_id.HasValue ) )
				{
					docPosition = tools.open_doc( catPos.id.Value );
					if ( docPosition != undefined )
					{
						docPosition.TopElem.position_common_id = iPosCommonID;
						docPosition.Save();
						oRes.count++;

						if ( ArrayOptFind( arrPosCommonIDsApplied, "OptInt( This ) == iPosCommonID" ) == undefined )
						{
							arrPosCommonIDsApplied.push( iPosCommonID );
						}
					}
				}
			}
		}
		catch(err)
		{
			alert("ERROR: TypicalPositionSpreadPositions: " + ("[" + itemPosCommonID + "]\r\n") + err, true);
		}
	}

	oRes.PosCommonCount = ArrayCount( arrPosCommonIDsApplied );

	return oRes;
}


/**
 * @typedef {Object} WTTypicalPositionSpreadPositionsAllResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество измененных должностей
 * @property {integer} PosCommonCount – количество примененных типовых должностей
*/
/**
 * @function TypicalPositionSpreadPositionsAll
 * @memberof Websoft.WT.Main
 * @description Проставляет должностям все типовые должности
 * @author EO
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {bigint[]} arrPosCommonIDs - массив ID типовых должностей
 * @param {string} sCanChange - вид действия, если у должности уже есть типовая должность: "replace"/"skip" (Заменять/Пропускать)
 * @returns {WTTypicalPositionSpreadPositionsAllResult}
*/
function TypicalPositionSpreadPositionsAll( iCurUserID, arrPosCommonIDs, sCanChange, sApplicationCode )
{
	function get_positions_id_by_boss_types( arrBossTypesID, iTypicalPosition )
	{
		if ( arrBossTypesID == null || arrBossTypesID == undefined || !IsArray(arrBossTypesID) || ArrayOptFirstElem( arrBossTypesID ) == undefined )
		{
			sBossTypeIdCond = "";
		}
		else
		{
			sBossTypeIdCond = "and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossTypesID, 'This', ',') + ")) ";
		}

//руководитель (непосредственный) подразделения
		xqArrSubdivBoss =  tools.xquery("for $elem in func_managers where $elem/catalog = 'position' and $elem/person_id = " + iCurUserID +" and $elem/is_native = true() and $elem/parent_id != null() return $elem");

//функциональный руководитель подразделения
		xqArrSubdivFM =  tools.xquery("for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iCurUserID +" and $elem/is_native = false() " + sBossTypeIdCond + "return $elem");

		arrSubdivsBossFMID = ArrayUnion( ArrayExtract( xqArrSubdivBoss, "This.parent_id.Value" ), ArrayExtract( xqArrSubdivFM, "This.object_id.Value" ));

//Подразделения ниже по иерархии
		for ( iSubdivID in arrSubdivsBossFMID )
		{
			xarrHierSubdivisions = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + iSubdivID + " ) order by $elem/Hier() return $elem/Fields('id', 'name', 'parent_object_id', 'org_id')" );
			arrSubdivisionsID = ArrayUnion( arrSubdivisionsID, ArrayExtract( xarrHierSubdivisions, "This.id.Value" ) );
		}

//руководитель (непосредственный) организации
		xqOrgBosses = tools.xquery("for $elem in positions where $elem/basic_collaborator_id = " + iCurUserID + " and $elem/parent_object_id = null() and $elem/is_boss=true() return $elem");

//функциональный руководитель организации
		xqArrOrgFM =  tools.xquery("for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iCurUserID +" and $elem/is_native = false() " + sBossTypeIdCond + "return $elem");

		arrOrgBossFMID = ArrayUnion( ArrayExtract( xqOrgBosses, "This.org_id" ) , ArrayExtract( xqArrOrgFM, "This.org_id.Value" ) );

		xarrSubdivsOrgsBossFM = tools.xquery("for $elem in subdivisions where MatchSome($elem/org_id, (" + ArrayMerge( arrOrgBossFMID, "This", "," ) + ")) return $elem" );
		arrSubdivisionsID = ArrayUnion( arrSubdivisionsID, ArrayExtract( xarrSubdivsOrgsBossFM, "This.id.Value" ) );


//должности отобранных подразделений
		sCond = "";
		iTypicalPosition = OptInt( iTypicalPosition );
		if ( iTypicalPosition != undefined )
		{
			sCond = " and $elem/position_common_id = " + iTypicalPositions;
		}
		xqPositionsByApplLevel =  tools.xquery( "for $elem in positions where MatchSome($elem/parent_object_id, (" + ArrayMerge(arrSubdivisionsID, "This", ",") + ")) " + sCond + "return $elem" );

		var arrPositionsToLimitIDs = ArraySelectDistinct( ArrayExtract( xqPositionsByApplLevel, "This.id.Value" ), "This" );

		return arrPositionsToLimitIDs;
	}

	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;
	oRes.PosCommonCount = 0;

	if(!IsArray(arrPosCommonIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPosCommonIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "position_common")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_6' );
		return oRes;
	}


    var teApplication = undefined;
    var iApplLevel = 0;
    try
    {
        teApplication = tools_app.get_cur_application( sApplicationCode );
        iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, teApplication.id ] );
    }
    catch( err) {}

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
    else
    {
        sAccessType = "reject";
    }

	var arrBossType = [];
	var arrSubdivisionsID = [];
	var bLimitPositions = false;
	switch(sAccessType)
	{
		case "admin":
		case "manager":
		case "expert":
			{
				break;
			}
		case "hr":
			{
				if (ArrayOptFirstElem(arrBossType) == undefined)
				{
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

				arrPositionsToLimitIDs = get_positions_id_by_boss_types( arrBossType, null );
				bLimitPositions = true;
				break;
			}
		case "reject":
			{
				oRes.error = 1;
				oRes.errorText = i18n.t( 'typicalpositio_1' );
				return oRes;
			}
	}

	arrPosCommonIDsApplied = [];
	for ( itemPosCommonID in arrPosCommonIDs )
	{
		try
		{
			iPosCommonID = OptInt(itemPosCommonID);
			if(iPosCommonID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			docPosCommon = tools.open_doc(iPosCommonID);
			if ( docPosCommon == undefined )
			{
				continue;
			}
			if ( docPosCommon.TopElem.status != "active" )
			{
				continue;
			}
			if ( docPosCommon.TopElem.position_names.ChildNum == 0 )
			{
				continue;
			}

			conds = new Array();

			_condition_str = '';
			for ( _name in docPosCommon.TopElem.position_names )
				if ( StrContains( _name.name, '*' ) )
				{
					_piece_str = '';
					_counter = 0;
					for ( _piece in String( _name.name ).split( '*' ) )
						if ( Trim( _piece ) != '' )
						{
							_piece_str += ( _counter == 0 ? '' : ' and ' ) + 'contains($elem/name,' + XQueryLiteral( Trim( _piece ) ) + ')';
							_counter++;
						}

					if ( _piece_str != '' )
						_condition_str += ( _name.ChildIndex == 0 ? '' : ' or ' ) + '( ' + _piece_str + ' )';
				}
				else
				{
					_condition_str += ( _name.ChildIndex == 0 ? '' : ' or ' ) + '( $elem/name = \'' + _name.name + '\' )';
				}
			conds.push( '(' + _condition_str + ')' );
			if( docPosCommon.TopElem.orgs.ChildNum > 0 )
				conds.push( 'MatchSome( $elem/org_id, ( ' + ArrayMerge( docPosCommon.TopElem.orgs, 'This.PrimaryKey', ',' ) + ' ) )' );
			if( docPosCommon.TopElem.subdivisions.ChildNum > 0 )
				conds.push( 'MatchSome( $elem/parent_object_id, ( ' + ArrayMerge( docPosCommon.TopElem.subdivisions, 'This.PrimaryKey', ',' ) + ' ) )' )

			xarrPositions = XQuery( 'for $elem in positions where ' + ArrayMerge( conds, 'This', ' and ' ) + ' return $elem' );

			if ( bLimitPositions )
			{
				xarrPositions = ArrayIntersect( xarrPositions, arrPositionsToLimitIDs, "OptInt( This.id.Value )", "OptInt( This )" )
			}

			for ( catPos in xarrPositions )
			{
				if ( sCanChange == "replace" || ( sCanChange == "skip" && !catPos.position_common_id.HasValue ) )
				{
					docPosition = tools.open_doc( catPos.id.Value );
					if ( docPosition != undefined )
					{
						docPosition.TopElem.position_common_id = iPosCommonID;
						docPosition.Save();
						oRes.count++;

						if ( ArrayOptFind( arrPosCommonIDsApplied, "OptInt( This ) == iPosCommonID" ) == undefined )
						{
							arrPosCommonIDsApplied.push( iPosCommonID );
						}
					}
				}
			}
		}
		catch(err)
		{
			alert("ERROR: TypicalPositionSpreadPositionsAll: " + ("[" + itemPosCommonID + "]\r\n") + err, true);
		}
	}

	oRes.PosCommonCount = ArrayCount( arrPosCommonIDsApplied );

	return oRes;
}


/**
 * @typedef {Object} WTTypicalPositionCreateResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
*/
/**
 * @function TypicalPositionCreate
 * @memberof Websoft.WT.Main
 * @description Создает типовую должность
 * @author EO
 * @param {string} sPosCommonName - название типовой должности
 * @param {bigint} iRoleID - ID категории типовой должности
 * @returns {WTTypicalPositionCreateResult}
*/
function TypicalPositionCreate( sPosCommonName, iRoleID )
{
	var oRes = tools.get_code_library_result_object();

	if( sPosCommonName == undefined || sPosCommonName == null || sPosCommonName == "" )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'neperedanonazv' );
		return oRes;
	}

	iRoleID = OptInt( iRoleID );
	if ( iRoleID != undefined && iRoleID != null )
	{
		docCategory = tools.open_doc( iRoleID );
		if( docCategory == undefined || docCategory.TopElem.Name != "role" )
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'peredannyyid' ) + iRoleID + i18n.t( 'neyavlyaetsyaidka' );
			return oRes;
		}
	}

	try
	{
		docPosCommon = tools.new_doc_by_name("position_common", false);
		docPosCommon.BindToDb();
		docPosCommon.TopElem.name = sPosCommonName;

		if ( iRoleID != undefined && iRoleID != null )
		{
			docPosCommon.TopElem.role_id.ObtainByValue( iRoleID );
		}
		docPosCommon.Save();
	}
	catch( err )
	{
		oRes.error = 503;
		oRes.errorText = err;
	}

	return oRes;
}

/**
 * @typedef {Object} oGroup
 * @memberof Websoft.WT.Main
 * @property {bigint} id 
 * @property {string} code 
 * @property {string} name 
 * @property {boolean} dynamic – признак динамической группы
 * @property {boolean} educ – признак учебной группы
 * @property {number} count - количество участников
 * @property {string} type - тип добавления в группу
*/

/**
 * @typedef {Object} WTGroupsResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {oPaging} paging – Пейджинг
 * @property {oGroup[]} groups – Результат
*/
/**
 * @function GetGroupsApp
 * @memberof Websoft.WT.Main
 * @author IG
 * @description Получение списка групп.
 * @param {string} iApplLevel Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"reject"
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителей
 * @param {string} sApplicationID код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {string} sGroupType типы групп - Все, Статические, Динамические, Учебные
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {WTGroupsResult}
*/
/* copy to @component groups  */
function GetGroupsApp( iApplLevel, arrBossTypesID, sApplicationID, iCurApplicationID, sGroupType, sXQueryQual, oCollectionParams ){

	var xqArrGroup = [];
	var xqIsGroupBoss = [];
	var bSelectByGroup = false;

	sCatalog = "group"
	arrGroupSubordinate = [];
	arrBossType = [];
	
	var oRes = tools.get_code_library_result_object();
		oRes.error = 0;
		oRes.errorText = "";
		oRes.paging = oCollectionParams.GetOptProperty( "paging" );
		oRes.groups = [];

	if(oCollectionParams == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'oshibkanepereda' );
		return oRes;
	}

	try
	{
		iPersonID = Int( oCollectionParams.personID );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}

	try
	{
		sFilters = oCollectionParams.filters ;
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_5' );
		return oRes;
	}

	try
	{
		sSearchText = oCollectionParams.fulltext ;
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_6' );
		return oRes;
	}
	if ( sSearchText == null || sSearchText == undefined)
		sSearchText = "";

	try
	{
		if( ObjectType( oCollectionParams.paging ) != 'JsObject' )
		{
			oRes.error = 501;
			oRes.errorText = i18n.t( 'peredannekorre_7' );
			return oRes;
		}
	}
	catch( err )
	{
		oCollectionParams.paging = ({});
	}
	
	try
	{
		iCurUserID = Int( iCurUserID );
	}
	catch( err )
	{
		iCurUserID = Int( oCollectionParams.GetOptProperty( "personID", "" ), 0 );
	}

	if ( sXQueryQual == null || sXQueryQual == undefined)
		sXQueryQual = "";

	try
	{
		iApplLevel = OptInt( iApplLevel );
	}
	catch ( err )
	{
		iApplLevel = 0;
	}

	iApplicationID = OptInt(sApplicationID);

	if(iApplicationID == undefined)
	{
		iApplicationID = OptInt(iCurApplicationID);
	}

	if(iApplLevel == 0 || iApplLevel == undefined)
	{
		if(iApplicationID != undefined)
		{
			sApplicationID = ArrayOptFirstElem(tools.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: {Value: ""}}).code.Value;
		}

		var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplicationID ] );
	}

	var xqArrSubdivisionFM = [];
	var bSelectByFuncManagers = false;

	switch(iApplLevel)
	{
		case 5: // hr - руководитель групп
			// группы, для которых текущий пользователь является функциональным руководителем типа,
			// указанного в параметр manager_type_id приложения. Если параметр пуст, то берем тип руководителя education_manager;
			
			arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );

			if (ArrayOptFirstElem(arrBossType) == undefined)
			{
				arrBossType = tools.call_code_library_method( "libApplication", "GetApplicationHRBossTypes", [ sApplicationID, iCurUserID ] );
			}

			if(ArrayOptFirstElem(arrBossType) != undefined)
			{
				sGroupQuery = "for $elem_qc in func_managers where $elem_qc/catalog = 'group' and $elem_qc/person_id = " + iPersonID +" and MatchSome($elem_qc/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) return $elem_qc/Fields('object_id')";
				xqArrGroup =  tools.xquery(sGroupQuery);
				bSelectByGroup = true;
			}

			break;
		case 3: // expert - методист / эксперт
			// отбираются группы (с учетом всех существующих условий), в которых состоят функциональные подчиненные текущего пользователя. 
			// Тип функционального подчинения берется из параметра manager_type_id приложения. 
			// Если параметр пуст, то берем функционального руководителя с кодом education_manager.
			
			if(OptInt(iCurApplicationID) != undefined)
			{
				var teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
				if (teApplication != null)
				{
					if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
					{
						arrBossType = ArrayMerge(ParseJson(teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value), "This.__value", ",").split(",");
					}
				}
			}

			if(ArrayOptFirstElem(arrBossType) == undefined)
			{
				arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
			}

			for(iBossTypeID in arrBossType)
			{
				arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, false, true, true, iBossTypeID, true ] );
			}

			sQuery = "for $elem_qc in group_collaborators where MatchSome($elem_qc/collaborator_id,(" +ArrayMerge(arrSubordinateIDs, "This", ",")+ ")) return $elem_qc/Fields('group_id')";
			arrGroupSubordinate =  ArrayExtractKeys( tools.xquery(sQuery), 'group_id' );

			if(ArrayOptFirstElem(arrBossType) != undefined)
			{
				sGroupQuery = "for $elem_qc in func_managers where $elem_qc/catalog = " + XQueryLiteral(sCatalog) + " and $elem_qc/person_id = " + iPersonID +" and MatchSome($elem_qc/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) return $elem_qc";
				xqArrGroup =  tools.xquery(sGroupQuery);
				bSelectByGroup = true;
			}
			
			break;
		case 1: // наблюдатель
			// группы, для которых текущий пользователь является функциональным руководителем любого типа.
			sGroupQuery = "for $elem_qc in func_managers where $elem_qc/catalog = " + XQueryLiteral(sCatalog) + " and $elem_qc/person_id = " + iPersonID +" return $elem_qc";
			xqArrGroup =  tools.xquery(sGroupQuery);

			bSelectByGroup = true;
			
			break;
		case 0:
			bSelectByGroup = false;
			sXQueryQual = "$elem_qc/id = 0";
			break;
	}

	switch(sGroupType){
		case "static":
			sSearchCond = "$elem_qc/is_dynamic = false()";
			sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond );
			break;
		case "dynamic":
			sSearchCond = "$elem_qc/is_dynamic = true()";
			sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond );
			break;
		case "educ":
			sSearchCond = "$elem_qc/is_educ = true()";
			sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond );
			break;
	}

	/* FILTERS */
	if ( sFilters != "" )
	{
		sXQueryQual += ( sXQueryQual == "" ? sFilters : " and " + sFilters );
	}

	/* SEARCH */
	if (sSearchText != "" )
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and " ) + "doc-contains($elem_qc/id, 'DefaultDb', " + XQueryLiteral( sSearchText ) + ")";
	}

	if(bSelectByGroup)
	{
		arrGroupIDs = ArrayExtract( xqArrGroup, "OptInt(This.object_id)", "This.object_id != undefined" );

		if(ArrayCount(arrGroupSubordinate) > 0)
		{
			arrGroupIDs = ArrayUnion(arrGroupIDs, arrGroupSubordinate);
		}

		sGroupsQuery = "for $elem_qc in groups where MatchSome( $elem_qc/id, (" + ArrayMerge(arrGroupIDs, "XQueryLiteral(This)", ",") + ")) " + (sXQueryQual == "" ? "" : ("and " + sXQueryQual)) + " return $elem_qc";
		sGroupsQuery = StrReplace( sGroupsQuery, "$elem/", "$elem_qc/" );
		xarrGroupsAll = tools.xquery(sGroupsQuery);
	} else {
		sGroupsQuery = "for $elem_qc in groups " + (sXQueryQual == "" ? "" : ("where " + sXQueryQual)) + " return $elem_qc";
		sGroupsQuery = StrReplace( sGroupsQuery, "$elem/", "$elem_qc/" );
		xarrGroupsAll = tools.xquery(sGroupsQuery);
	}

	xarrGroupsAll = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrGroupsAll, oCollectionParams.paging, oCollectionParams.sort ] ).oResult;

	for (oGroup in xarrGroupsAll)
	{
		docGroup = tools.open_doc(oGroup.id.Value)
		docGroupTE = docGroup.TopElem

		oType = ArrayOptFind( common.join_mode_types, 'This.id == oGroup.join_mode.Value' );

		oRes.groups.push({
			id: oGroup.id.Value,
			code: oGroup.code.Value,
			name: oGroup.name.Value,
			dynamic: oGroup.is_dynamic.Value,
			educ: oGroup.is_educ.Value,
			count: ArrayCount(docGroupTE.collaborators),
			type: oType.name.Value
		})
	}

	if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		oRes.groups = ArraySort(oRes.groups, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
	}

	return oRes;
}
/**
 * @typedef {Object} oSubdivision
 * @memberof Websoft.WT.Main
 * @property {bigint} id 
 * @property {string} code 
 * @property {string} name 
 * @property {string} company – название организации
 * @property {string} place – расположение
 * @property {string} parent_subdiv_name - название вышестоящего подразделения
 * @property {string} boss_fullname - ФИО непосредственного руководителя
*/
/**
 * @typedef {Object} WTSubdivisionsResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {oPaging} paging - Пейджинг 
 * @property {oSubdivision[]} subdivisions – Результат
*/
/**
 * @function GetSubdivisionsApp
 * @memberof Websoft.WT.Main
 * @author IG
 * @description Получение списка групп.
 * @param {bigint} iCurUserID ID текущего пользователя
 * @param {integer} iApplLevel - Уровень доступа сотрудника в приложении
 * @param {bigint[]} [arrBossTypesID] - Массив типов руководителей
 * @param {string} sApplicationID код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {string} sXQueryQual строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (ID текущего пользователя, отбор, сортировка, пейджинг)
 * @returns {WTSubdivisionsResult}
*/
function GetSubdivisionsApp( iCurUserID, iApplLevel, arrBossTypesID, sApplicationID, iCurApplicationID, sXQueryQual, oCollectionParams, sSubdivisionGroupID ){

	var oRes = tools.get_code_library_result_object();
		oRes.error = 0;
		oRes.errorText = "";
		oRes.paging = oCollectionParams.GetOptProperty( "paging" );
		oRes.subdivisions = [];
	
	iCurUserID = OptInt( iCurUserID, 0);
	
	if(oCollectionParams == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'oshibkanepereda' );
		return oRes;
	}

	try
	{
		iPersonID = Int( oCollectionParams.personID );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}

	try
	{
		sFilters = oCollectionParams.filters ;
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_5' );
		return oRes;
	}
	if ( sFilters == null || sFilters == undefined)
		sFilters = "";

	try
	{
		sSearchText = oCollectionParams.fulltext ;
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_6' );
		return oRes;
	}
	if ( sSearchText == null || sSearchText == undefined)
		sSearchText = "";

	try
	{
		if( ObjectType( oCollectionParams.paging ) != 'JsObject' )
		{
			oRes.error = 501;
			oRes.errorText = i18n.t( 'peredannekorre_7' );
			return oRes;
		}
	}
	catch( err )
	{
		oCollectionParams.paging = ({});
	}

	if(sSubdivisionGroupID == undefined || IsArray(sSubdivisionGroupID)){
		oRes.error = 501;
		oRes.errorText = i18n.t( 'nevernoeilimno' );
		return oRes;
	} else {
		iSubdivisionGroupID = OptInt(sSubdivisionGroupID);
	}

	arrConds = [];
	if ( sXQueryQual == null || sXQueryQual == undefined)
		sXQueryQual = "";
		
	if ( sXQueryQual != "" )
		arrConds.push(sXQueryQual);

	try
	{
		iApplLevel = OptInt( iApplLevel );
	}
	catch ( err )
	{
		iApplLevel = 0;
	}


	iApplicationID = OptInt(sApplicationID);

	if(iApplicationID == undefined)
	{
		iApplicationID = OptInt(iCurApplicationID);
	}

	if(iApplLevel == 0 || iApplLevel == undefined)
	{
		if(iApplicationID != undefined)
		{
			sApplicationID = ''+ArrayOptFirstElem(tools.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
		}

		var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplicationID ] );
	}

	var xqArrSubdivisionFM = [];
	var bSelectByFuncManagers = false;
	switch(iApplLevel)
	{
		case 5: // HR
			// группы, для которых текущий пользователь является функциональным руководителем типа,
			// указанного в параметр boss_types_id приложения. Если параметр пуст, то берем тип руководителя education_manager;

			arrBossType = tools_web.parse_multiple_parameter( arrBossTypesID );

			if (ArrayOptFirstElem(arrBossType) == undefined)
			{
				arrBossType = tools.call_code_library_method( "libApplication", "GetApplicationHRBossTypes", [ sApplicationID, iCurUserID ] );
			}
			
			if(ArrayOptFirstElem(arrBossType) != undefined)
			{
				xarrOrgs = tools.xquery("for $elem in func_managers where $elem/catalog = 'org' and $elem/person_id = " + iPersonID +" and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) return $elem");
				
				if (ArrayOptFirstElem(xarrOrgs) != undefined)
				{
					sSubdivisionQuery = "for $elem in subdivisions where MatchSome($elem/org_id, (" + ArrayMerge(xarrOrgs, 'This.object_id', ',') + ")) return $elem/Fields('id')";
					xqArrSubdivisionFM = ArrayDirect( ArrayExtract(tools.xquery(sSubdivisionQuery), 'This.id') );
				}
				else
				{
					sSubdivisionQuery = "for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iPersonID +" and MatchSome($elem/boss_type_id, (" + ArrayMerge(arrBossType, 'This', ',') + ")) return $elem/Fields('object_id')";
					xqArrSubdivisionFM = ArrayDirect( ArrayExtract(tools.xquery(sSubdivisionQuery), 'This.object_id') );
				}		
				
				bSelectByFuncManagers = true;
			}

			break;
		case 1: // наблюдатель
			// группы, для которых текущий пользователь является функциональным руководителем любого типа.
			sSubdivisionQuery = "for $elem in func_managers where $elem/catalog = 'subdivision' and $elem/person_id = " + iPersonID +" return $elem/Fields('object_id')";
			xqArrSubdivisionFM = ArrayDirect( ArrayExtract(tools.xquery(sSubdivisionQuery), 'This.object_id') );

			bSelectByFuncManagers = true;
			break;
		case 0:
			return oRes;
	}

	if ( bSelectByFuncManagers && ArrayOptFirstElem(xqArrSubdivisionFM) == undefined )
		return oRes;

	if(bSelectByFuncManagers)
	{
		//иерархия
/*
		 arrSubdivisionWithHier = [], arrSubdivHier = [];
		for ( itemSubdivision in xqArrSubdivisionFM )
		{
			if ( ArrayOptFindByKey( arrSubdivisionWithHier, itemSubdivision, "id" ) != undefined )
				continue;

			arrSubdivHier = ArrayDirect( tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + itemSubdivision + " ) order by $elem/Hier() return $elem/Fields('id')" ) );
			arrSubdivisionWithHier = ArrayUnion( arrSubdivHier, arrSubdivisionWithHier );
		}
*/
		//var arrSubdivisionWithHier = tools.xquery( "for $elem in subdivisions where IsHierChildOrSelf( $elem/id, " + ArrayMerge(xqArrSubdivisionFM, "This", "," ) + " ) order by $elem/Hier() return $elem/Fields('id')" );
		
		var arrSubdivisionWithHier = ArrayExtract( xqArrSubdivisionFM, "({id: This})" );
		arrSubdivisionWithHier = ArraySort( arrSubdivisionWithHier, "This.id", "+" );
		var iCount = 0;
		var arrTempSubs = arrSubdivisionWithHier;
		while( iCount < 100 )
		{
			if( ArrayOptFirstElem( arrTempSubs ) == undefined )
			{
				break;
			}
			arrTempSubs = XQuery( "for $elem_qc in subdivisions where MatchSome($elem_qc/parent_object_id,(" +ArrayMerge(arrTempSubs, "This.id", ",")+ ")) return $elem_qc/Fields('id')" );

			arrTempSubs = ArraySelect( arrTempSubs, "ArrayOptFindBySortedKey( arrSubdivisionWithHier, This.id, 'id' ) == undefined" );
			arrSubdivisionWithHier = ArrayUnion( arrSubdivisionWithHier, arrTempSubs );
			arrSubdivisionWithHier = ArraySort( arrSubdivisionWithHier, "This.id", "+" );
			iCount++;
		}
		
		arrConds.push( "MatchSome( $elem/id, ( " + ArrayMerge( arrSubdivisionWithHier, "XQueryLiteral( RValue( This.id ) )", "," ) + " ) )" );
		// arrSubdivHier = null;
		xqArrSubdivisionFM = null;
	}

// FILTERS
	// sXQueryQual += ( sXQueryQual == "" ? sFilters : " and " + sFilters )
	if ( sFilters != "" )
		arrConds.push( '('+sFilters+')' );

// SEARCH
	if (sSearchText != "")
	{
		// sXQueryQual += ( sXQueryQual == "" ? "" : " and " ) + "doc-contains($elem/id, 'DefaultDb', " + XQueryLiteral( sSearchText ) + ")";
		arrConds.push( "doc-contains($elem/id, 'DefaultDb', " + XQueryLiteral( sSearchText ) + ")" );
	}

	if(iSubdivisionGroupID != undefined){
		docSubdivisionGroup = tools.open_doc(iSubdivisionGroupID)
		if ( docSubdivisionGroup != undefined )
		{
			teSubdivisionGroup = docSubdivisionGroup.TopElem;
			arrConds.push( "MatchSome( $elem/id, ( " + ArrayMerge( teSubdivisionGroup.subdivisions, "This.subdivision_id.Value", "," ) + " ) )" );
		}
	}


	sSubdivisionsQuery = "for $elem in subdivisions" + ((ArrayOptFirstElem(arrConds) != undefined) ? " where " + ArrayMerge(arrConds, "This", " and ") : "") + " order by $elem/id return $elem/Fields('id','code', 'name', 'org_id, 'place_id', 'parent_object_id')"
	sSubdivisionsQuery = StrReplace( sSubdivisionsQuery, "$elem", "$elem_qc" );
	arrSubdivisions = ArrayDirect( tools.xquery(sSubdivisionsQuery) );

	var xarrOrgNames = ArrayDirect( tools.xquery("for $elem in orgs order by $elem/id return $elem/Fields('id','name')") );
	var xarrPlaceNames = ArrayDirect( tools.xquery("for $elem in places order by $elem/id return $elem/Fields('id','name')") );

	sSubdivFmQuery = "for $elem_qc in func_managers where MatchSome( $elem_qc/parent_id, ( " + ArrayMerge(arrSubdivisions, 'OptInt(This.id.Value, 0)', ',') + " ) ) and $elem_qc/catalog='position' order by $elem_qc/parent_id return $elem_qc/Fields('parent_id','person_id')";
	var xarrSubdivFmQuery = ArrayDirect( tools.xquery(sSubdivFmQuery) );

	sSubdivBossFullnames = "for $elem_qc in collaborators where MatchSome( $elem_qc/id, ( " + ArrayMerge(xarrSubdivFmQuery, 'OptInt(This.person_id.Value, 0)', ',') + " ) ) order by $elem_qc/id return $elem_qc/Fields('id','fullname')";
	var xarrSubdivBossFullnames = ArrayDirect( tools.xquery(sSubdivBossFullnames) );

	for ( itemSubdivision in arrSubdivisions )
	{
		xmOrgName = undefined;
		sOrgName = "";
		if ( itemSubdivision.org_id.HasValue )
		{
			xmOrgName = ArrayOptFindBySortedKey( xarrOrgNames, itemSubdivision.org_id, "id" )
			if ( xmOrgName != undefined )
				sOrgName = xmOrgName.name;
		}

		xmParentSubdiv = undefined;
		sParentSubdivName = "";
		if(itemSubdivision.parent_object_id.HasValue) 
		{
			if(itemSubdivision.parent_object_id.Value == itemSubdivision.org_id.Value)
				xmParentSubdiv = xmOrgName;
			else
				xmParentSubdiv = ArrayOptFindBySortedKey( arrSubdivisions, itemSubdivision.parent_object_id , "id" );
			
			sParentSubdivName = xmParentSubdiv != undefined ? xmParentSubdiv.name.Value : "";
		}

		sPlaceName = "";
		xmPlaceName = undefined;
		if ( itemSubdivision.place_id.HasValue )
		{
			xmPlaceName = ArrayOptFindBySortedKey( xarrPlaceNames, itemSubdivision.place_id, "id" );
			if ( xmPlaceName != undefined )
				sPlaceName = xmPlaceName.name;
		}

		sBossFullname = "";
		xmSubdivFm = ArrayOptFindBySortedKey( xarrSubdivFmQuery, itemSubdivision.id, "parent_id" );
		if (xmSubdivFm != undefined)
		{
			xmSubdivBossFullname = ArrayOptFindBySortedKey( xarrSubdivBossFullnames, xmSubdivFm.person_id, "id" );
			if (xmSubdivBossFullname != undefined)
			{
				sBossFullname = xmSubdivBossFullname.fullname;
			}
		}

		oRes.subdivisions.push({
			id: itemSubdivision.id.Value,
			code: itemSubdivision.code.Value,
			name: itemSubdivision.name.Value,
			company: sOrgName, // название организации
			place: sPlaceName, //расположение
			parent_subdiv_name: sParentSubdivName, //название вышестоящего подразделения
			boss_fullname: sBossFullname
		})
	
	}

	arrSubdivisions = null;
	xarrOrgNames = null;
	xarrPlaceNames = null;

	if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		oRes.subdivisions = ArraySort(oRes.subdivisions, sFieldName, ((oCollectionParams.sort.DIRECTION == "DESC") ? "-" : "+"));
	}

	if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount(oRes.subdivisions);
		oRes.paging = oCollectionParams.paging;
		oRes.subdivisions = ArrayRange(oRes.subdivisions, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
	}
	
	return oRes;
}

/**
 * @typedef {Object} oTypicalPositions
 * @property {bigint} id
 * @property {string} code
 * @property {string} name
 * @property {number} typical_development_programs_count - Количество типовых программ развития у типовой должности
 * @property {number} positions_count - количество должностей у типовой должности
 * @property {string} job_transfer_type_id - направление перевода
*/
/**
 * @typedef {Object} ReturnTypicalPositionsApp
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oTypicalPositions[]} typical_positions – Типовые должности.
*/
/**
 * @function GetTypicalPositions
 * @memberof Websoft.WT.Main
 * @author IG
 * @description Получение списка типовых должностей.
 * @param {bigint} iPersonID ID текущего пользователя.
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"reject"
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} sApplicationID ID текущего приложения
 * @param {bigint} sState - статус (Действующая, Планируется, Архив)
 * @param {bigint} arrReturnData - Число должностей
 * @param {string} sFilter строка для XQuery-фильтра
 * @param {string} sFullText строка для поиска
 * @returns {ReturnTypicalPositionsApp}
*/
function GetTypicalPositions( iPersonID, sAccessType, sApplication, iCurApplicationID, sState, arrReturnData, sFilter, sFullText, oCollectionParams, sPositionFamilys, sTypicalDevelopmentProgram ){

	var oRes = tools.get_code_library_result_object();
		oRes.error = 0;
		oRes.errorText = "";
		oRes.typical_positions = [];

		sXQueryQual = "";

	try
	{
		iPersonID = OptInt( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}

	if(oCollectionParams == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'oshibkanepereda_1' );
		return oRes;
	}

	var sCondSort = " order by [{CURSOR}]/id ascending";
	var oSort = oCollectionParams.sort;

	if(ObjectType(oSort) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
	{
		switch(oSort.FIELD)
		{
			case "code":
				sCondSort = " order by [{CURSOR}]/code" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
			case "name":
				sCondSort = " order by [{CURSOR}]/name" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
		}
	}

	sXQueryQual = String( sFilter );
	if (String(sFullText) != '')
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and " ) + "doc-contains($elem/id, '" + DefaultDb + "', " + XQueryLiteral( String( sFullText ) ) + ")";
	}

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	if ( sState == "active" || sState == "plan" || sState == "archive" ){
		sStateCond = "MatchSome( $elem/status,(" + XQueryLiteral(sState) + ") )"
		sXQueryQual += ( sXQueryQual == "" ? sStateCond : " and " + sStateCond )
	}

	iPositionFamilys = OptInt(sPositionFamilys);
	if(iPositionFamilys == undefined){
		if(IsArray(sPositionFamilys)){
			oRes.error = 501;
			oRes.errorText = i18n.t( 'nevernoeilimno_1' );
			return oRes;
		}
	} else {
		sSearchCond = "contains($elem/position_familys,'" + iPositionFamilys + "')"
		sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond )
	}

	iTypicalDevelopmentProgram = OptInt(sTypicalDevelopmentProgram);
	if(iTypicalDevelopmentProgram == undefined){
		if(IsArray(sTypicalDevelopmentProgram)){
			oRes.error = 501;
			oRes.errorText = i18n.t( 'nevernoeilimno_2' );
			return oRes;
		}
	}

	/* DISTINCT */
	arrDistinct = oCollectionParams.GetOptProperty( "distincts", [] );

	if ( ArrayOptFirstElem( arrDistinct ) != undefined )
	{
		oRes.data.SetProperty("distincts", {});

		for(sFieldName in arrDistinct)
		{
			oRes.data.distincts.SetProperty(sFieldName, []);

			switch(sFieldName)
			{
				case "filter_states":
				{
					f_states_data = []
					for (data in common.position_common_statuss)
					{
						f_states_data.push({name: data.name.Value, value: data.id.Value})
					}
					oRes.data.distincts.filter_states = f_states_data;
					break;
				}
			}
		}
	}

	/* FILTERS */
	var arrFilters = oCollectionParams.GetOptProperty( "filters", [] );

	for(oFilter in arrFilters)
	{
		if(oFilter.type == 'select') {

			switch(oFilter.id)
			{
				case "filter_states":
				{
					arrStatus = new Array
					if(ArrayOptFind(oFilter.value, "This.value != ''") != undefined)
					{
						for (item in oFilter.value)
						{
							arrStatus.push(XQueryLiteral(item.value))
						}

						sXQueryQual += ( sXQueryQual == "" ? "" : " and ");
						sXQueryQual += "MatchSome( $elem/status, ( " + ArrayMerge(ArraySelect(oFilter.value, "This.value != ''"), "XQueryLiteral(This.value)", ",") + " ) )"
					}
					break;
				}
			}
		}
	}

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);

		if(iApplicationID == undefined)
		{
			iApplicationID = OptInt(iCurApplicationID);
		}

		if(OptInt(iApplicationID) != undefined)
		{
			sGetApplicationQuery = "for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')";
			sApplication = ''+ArrayOptFirstElem(tools.xquery(sGetApplicationQuery), {code: ""}).code;
		}

		if(sApplication != undefined){
			var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplication ] );

			if(iApplLevel >= 10) // Администратор приложения
			{
				sAccessType = "admin";
			}
			else if(iApplLevel >= 7) // администратор процесса
			{
				sAccessType = "manager";
			}
			else if(iApplLevel >= 5) // HR
			{
				sAccessType = "hr";
			}
			else if(iApplLevel >= 3) // методист
			{
				sAccessType = "expert";
			}
			else if(iApplLevel >= 1) // Наблюдатель
			{
				sAccessType = "observer";
			}
		} else {
			sAccessType = "admin";
		}
	}

	var xqArrTypicalPositions = [];
	var xqIsGroupBoss = [];
	var bSelectByTypicalPosition = false;

	switch(sAccessType){
		case "expert": // методист
			bSelectByTypicalPosition = true

			sGetExpertQuery = "for $elem in experts where $elem/person_id = " + iPersonID + " return $elem/Fields('id')"

			iExpertID = ArrayOptFirstElem(tools.xquery(sGetExpertQuery), {id: ""}).id;

			if(iExpertID == undefined){
				oRes.error = 501;
				oRes.errorText = i18n.t( 'oshibkavynenazn' );
				return oRes;
			}
			
			xarrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'position_common' and contains ($elem/experts, " + iExpertID + ") return $elem");
			
			sTypicalPositionsQuery = "for $elem in position_commons where MatchSome($elem/role_id, (" + ArrayMerge(xarrRoles, "This.id.Value", ",") + ")) return $elem"
			xarrTypicalPositions = tools.xquery(sTypicalPositionsQuery);
			
			if(ArrayOptFirstElem(xarrTypicalPositions) != undefined)
			{
				for (oTypicalPosition in xarrTypicalPositions)
				{
					xqArrTypicalPositions.push(oTypicalPosition.id.Value)
				}
			}
			
			break;
		case "reject":
			sXQueryQual = "$elem/id = 0"
			break;
	}

	if(bSelectByTypicalPosition){
		sSearchCond = "MatchSome( $elem/id,(" + ArrayMerge(xqArrTypicalPositions, 'Int(This)', ',') + ") )"
		sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond )
	}

	sTypicalPositionsQuery = "for $elem in position_commons " + (sXQueryQual == "" ? "" : ("where " + sXQueryQual)) + StrReplace(sCondSort, "[{CURSOR}]", "$elem") + " return $elem"
	xarrTypicalPositions = tools.xquery(sTypicalPositionsQuery);
	xarrTypicalPositions = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrTypicalPositions, oCollectionParams.paging, oCollectionParams.sort ] ).oResult;

	for (oTypicalPosition in xarrTypicalPositions )
	{
		docTypicalPosition = tools.open_doc(oTypicalPosition.id.Value)
		docTypicalPositionTE = docTypicalPosition.TopElem

		if(iTypicalDevelopmentProgram != undefined){
			oPrograms = ArrayOptFind(docTypicalPositionTE.typical_development_programs, "OptInt(This.typical_development_program_id) == " + iTypicalDevelopmentProgram)
			if(oPrograms != undefined){

				oJobTransferType = ArrayOptFind( common.job_transfer_types, 'This.id == oPrograms.job_transfer_type_id.Value' );

				oJobTransferTypeName = ""
				if(oJobTransferType != undefined)
					oJobTransferTypeName = oJobTransferType.name.Value

				positions_counter = null
				if (ArrayOptFind(arrReturnData, "This == 'positions_count_active'") != undefined)
				{
					sQuery = "for $elem in positions where MatchSome($elem/position_common_id, " + oTypicalPosition.id.Value + ") return $elem"
					xarrPositions = tools.xquery(sQuery);
					positions_counter = ArrayCount(xarrPositions)
				}

				oRes.typical_positions.push({
					id: docTypicalPositionTE.id.Value,
					code: docTypicalPositionTE.code.Value,
					name: docTypicalPositionTE.name.Value,
					typical_development_programs_count: ArrayCount(docTypicalPositionTE.typical_development_programs),
					positions_count: positions_counter,
					job_transfer_type_id: oJobTransferTypeName
				})
			}
		} else {
			positions_counter = null
			if (ArrayOptFind(arrReturnData, "This == 'positions_count_active'") != undefined)
			{
				sQuery = "for $elem in positions where MatchSome($elem/position_common_id, " + oTypicalPosition.id.Value + ") return $elem"
				xarrPositions = tools.xquery(sQuery);
				positions_counter = ArrayCount(xarrPositions)
			}

			oRes.typical_positions.push({
				id: docTypicalPositionTE.id.Value,
				code: docTypicalPositionTE.code.Value,
				name: docTypicalPositionTE.name.Value,
				typical_development_programs_count: ArrayCount(docTypicalPositionTE.typical_development_programs),
				positions_count: positions_counter,
				job_transfer_type_id: ""
			})
		}
	}

	return oRes;
}

/** @typedef {Object} oAcquaints
 * @property {string} code
 * @property {string} name
 * @property {string} object_type_name
 * @property {string} object_name
 * @property {bigint} acquaint_assign_all_count
 * @property {bigint} acquaint_assign_familiar_count
 * @property {bigint} acquaint_assign_assign_count
 * @property {bigint} acquaint_assign_active_count
 * @property {date} last_assign_date
*/
/**
 * @typedef {Object} ReturnAcquaints
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oAcquaints[]} array – Коллекция ознакомлений.
*/
/**
 * @function GetAcquaints
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка ознакомлений.
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {string} [arrState] - массив состояний: active(Активное), archive(Архив)
 * @param {string} [arrReturnData] - массив полей для вывода: all_count(Общее число назначений), familiar_count(Число назначений со статусом Ознакомлен), assign_count(Число назначений со статусом Назначен), active_count (Число назначений со статусом В процессе), last_assign_date (Дата последнего назначения)
 * @param {string} sFilter - строка для XQuery-фильтра
 * @param {string} sFulltext - строка для поиска
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnAcquaints}
*/
/* copy to @component acquaintance_forms  */
  function GetAcquaints( iCurUserID, sAccessType, sApplication, arrState, arrReturnData, sFilter, sFulltext, oCollectionParams )
  {
	  var oRes = tools.get_code_library_result_object();
	  oRes.array = [];
	  oRes.paging = oCollectionParams.paging;

	  iCurUserID = OptInt( iCurUserID, 0);

	  if ( sFilter == null || sFilter == undefined)
		  sFilter = "";

	  if ( sFulltext == null || sFulltext == undefined)
		  sFulltext = "";

	  arrConds = [];
	  if ( sFilter != "" )
		  arrConds.push( sFilter );

	  if ( sFulltext != '' )
	  {
		  sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( sFulltext ) + " )";
		  arrConds.push( sSearchCond );
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
			  	arrConds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
		  }
	  }
  

	  if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr"&& sAccessType != "expert" && sAccessType != "observer" )
		  sAccessType = "auto";

	  if(sAccessType == "auto")
	  {
		  iApplicationID = OptInt(sApplication);
		  if(iApplicationID != undefined)
		  {
			  sApplication = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
		  }
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


	  var bNoCategoryAsExpert = false;
	  switch(sAccessType)
	  {
		  case "expert":
			  {
				  oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iCurUserID + " return $elem/Fields('id')"));

				  if (oExpert != undefined)
				  {
					  arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'acquaint' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");

					  if (ArrayOptFirstElem(arrRoles) != undefined)
					  {
						  arrConds.push("MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) )");
					  }
					  else
					  {
						  bNoCategoryAsExpert = true;
					  }
				  }

				  break;
			  }
	  }


	  if ( bNoCategoryAsExpert )
	  {
		  var xarrAcquaints = [];
	  }
	  else
		  if ( ArrayOptFirstElem(arrState) != undefined )
		  {
			  sStatusCond = "";
			  for ( itemState in arrState )
			  {
				  switch ( itemState )
				  {
						  case "active":
							  sStatusCond += ( sStatusCond == "" ? "$elem/status = true()" : " or $elem/status = true()" )
							  break;
						  case "archive":
							  sStatusCond += ( sStatusCond == "" ? "$elem/status = false()" : " or $elem/status = false()" )
							  break;
				  }
			  }
			  if ( sStatusCond != "" )
			  {
				  sStatusCond = "("+sStatusCond+")";
				  arrConds.push(sStatusCond);
			  }

			  var xarrAcquaints = tools.xquery( "for $elem in acquaints" + ((ArrayOptFirstElem(arrConds) != undefined) ? " where " + ArrayMerge(arrConds, "This", " and ") : "") + " return $elem/Fields('id','code','name','object_type','object_name')" );
		  }
		  else
		  {
			  var xarrAcquaints = [];
		  }

	  var arrAcquaintsIDs = ArrayExtract( xarrAcquaints, "This.id.Value" )
	  var xarrAcquaintAssigns = tools.xquery( "for $elem in acquaint_assigns where MatchSome( $elem/acquaint_id, ( " + ArrayMerge( arrAcquaintsIDs, "This", ", " )+ " ) ) return $elem/Fields('id','acquaint_id')" );


  //Помещаем в массив время создания Назначенных ознакомлений
	  arrCreateDates = [];
	  for ( catAcquaintAssign in xarrAcquaintAssigns )
	  {
		  docAcquaintAssign = tools.open_doc(  catAcquaintAssign.id.Value )
		  if ( docAcquaintAssign == undefined)
		  {
			  continue;
		  }
		  oDateElem = {
			  acquaint_id: docAcquaintAssign.TopElem.acquaint_id.Value,
			  date: docAcquaintAssign.TopElem.doc_info.creation.date.Value
		  }
		  arrCreateDates.push( oDateElem );
	  }

	  for ( catAcquaint in xarrAcquaints )
	  {
		  dateValue = ArrayOptFirstElem( ArraySort( ArraySelect( arrCreateDates, "This.acquaint_id == catAcquaint.id.Value" ) , "This.date", "-" ), {"date": null} ).date;
		  oElem = {
			  id: catAcquaint.id.Value,
			  code: catAcquaint.code.Value,
			  name: catAcquaint.name.Value,
			  object_type_name: ( catAcquaint.object_type.HasValue ? catAcquaint.object_type.ForeignElem.title.Value : "" ),
			  object_name: catAcquaint.object_name.Value,
			  acquaint_assign_all_count: null,
			  acquaint_assign_familiar_count: null,
			  acquaint_assign_assign_count: null,
			  acquaint_assign_active_count: null,
			  last_assign_date: null,
		  }
		  if ( ArrayOptFirstElem( arrReturnData ) != undefined )
		  {
			  for ( itemReturnData in arrReturnData )
			  {
				  switch ( itemReturnData )
				  {
					  case "all_count": //Общее число назначений
						  oElem.acquaint_assign_all_count = ArrayCount( ArraySelect( xarrAcquaintAssigns, "This.acquaint_id.Value == catAcquaint.id.Value" ) );
						  break;
					  case "familiar_count": //Число назначений со статусом Ознакомлен
						  oElem.acquaint_assign_familiar_count = ArrayCount( ArraySelect( xarrAcquaintAssigns, "This.acquaint_id.Value == catAcquaint.id.Value && This.state_id == 'familiar'" ) );
						  break;
					  case "assign_count": //Число назначений со статусом Назначен
						  oElem.acquaint_assign_assign_count = ArrayCount( ArraySelect( xarrAcquaintAssigns, "This.acquaint_id.Value == catAcquaint.id.Value && This.state_id == 'assign'" ) );
						  break;
					  case "active_count": //Число назначений со статусом В процессе
						  oElem.acquaint_assign_active_count = ArrayCount( ArraySelect( xarrAcquaintAssigns, "This.acquaint_id.Value == catAcquaint.id.Value && This.state_id == 'active'" ) );
						  break;
					  case "last_assign_date": //Дата последнего назначения
						  oElem.last_assign_date = StrDate( dateValue, false, false );
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
			  case "code":
			  case "name":
			  case "object_type_name":
			  case "object_name":
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
 * @typedef {Object} oAcquaintAssign
 * @property {string} code
 * @property {string} fullname
 * @property {string} acquaint_name
 * @property {string} acquaint_assign_state
 * @property {date} normative_date
 * @property {date} finish_date
*/
/**
 * @typedef {Object} ReturnAcquaintAssigns
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oAcquaintAssign[]} array – Коллекция назначенных ознакомлений.
*/
/**
 * @function GetAcquaintAssigns
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Получение списка назначенных ознакомлений.
 * @param {bigint} iCurUserID - ID текущего пользователя
 * @param {string} sAccessType - Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication - код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID - ID текущего приложения
 * @param {string} [arrState] - массив состояний: assigned(Назначен), active(В процессе), familiar(Ознакомлен)
 * @param {string} sFilter - строка для XQuery-фильтра
 * @param {string} sFulltext - строка для поиска
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnAcquaintAssigns}
*/
/* copy to @component acquaintance_forms  */
  function GetAcquaintAssigns( iCurUserID, sAccessType, sApplication, iCurApplicationID, arrState, sFilter, sFulltext, oCollectionParams )
  {
	  var oRes = tools.get_code_library_result_object();
	  oRes.array = [];
	  oRes.paging = oCollectionParams.paging;

	  iCurUserID = OptInt( iCurUserID, 0);

	  if ( sFilter == null || sFilter == undefined)
		  sFilter = "";

	  if ( sFulltext == null || sFulltext == undefined)
		  sFulltext = "";

	  arrConds = [];
	  if ( sFilter != "" )
		  arrConds.push( sFilter );

	  if ( sFulltext != '' )
	  {
		  sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( sFulltext ) + " )";
		  arrConds.push( sSearchCond );
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
			  	arrConds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
		  }
	  }

	  if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr"&& sAccessType != "expert" && sAccessType != "observer" )
		  sAccessType = "auto";

	  if(sAccessType == "auto")
	  {
		  iApplicationID = OptInt(sApplication);
		  if(iApplicationID != undefined)
		  {
			  sApplication = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
		  }
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


	  var arrBossType = [];
	  var bNoCategoryAsExpert = false;
	  switch(sAccessType)
	  {
		  case "hr":
			  {
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

				  arrConds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );

				  break;
			  }
		  case "expert":
			  {
				  oExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + iCurUserID + " return $elem/Fields('id')"));

				  if (oExpert != undefined)
				  {
					  arrRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'acquaint' and contains($elem/experts," + OptInt(oExpert.id, 0) + ") return $elem/Fields('id')");

					  if (ArrayOptFirstElem(arrRoles) != undefined)
					  {
						  arrExpertAcquaint = tools.xquery("for $elem in acquaints where MatchSome( $elem/role_id, ( " + ArrayMerge( arrRoles, "This.id.Value", "," ) + " ) ) return $elem/Fields('id')");
						  arrConds.push( "MatchSome( $elem/acquaint_id, ( " + ArrayMerge( arrExpertAcquaint, "This.id.Value", "," ) + " ) )" );
					  }
					  else
					  {
						  bNoCategoryAsExpert = true;
					  }
				  }
				  break;
			  }
		  case "observer":
			  {
				  arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, [], true ] );
				  if ( ArrayOptFirstElem(arrSubordinateIDs) != undefined )
				  {
					  arrConds.push( "MatchSome( $elem/person_id, ( " + ArrayMerge( arrSubordinateIDs, "This", "," ) + " ) )" );
				  }
				  break;
			  }
	  }


	  if ( bNoCategoryAsExpert )
	  {
		  var xarrAcquaintAssigns = [];
	  }
	  else
		  if ( ArrayOptFirstElem(arrState) != undefined )
		  {
			  sStatusCond = "";
			  arrStateConds = [];
			  for ( itemState in arrState )
			  {
				  switch ( itemState )
				  {
					  case "assign":
					  case "active":
					  case "familiar":
						  arrStateConds.push( "$elem/state_id = '" + itemState + "'" );
						  break;

			  }
			  }

			  if ( ArrayOptFirstElem(arrStateConds) != undefined )
			  {
				  arrConds.push( "(" + ArrayMerge( arrStateConds, "This", " or " ) + ")" );
			  }
			  var xarrAcquaintAssigns = tools.xquery( "for $elem in acquaint_assigns" + ((ArrayOptFirstElem(arrConds) != undefined) ? " where " + ArrayMerge(arrConds, "This", " and ") : "") + " return $elem/Fields('id','code', 'person_id', 'object_name', 'state_id', 'normative_date', 'finish_date')" );
		  }
		  else
		  {
			  var xarrAcquaintAssigns = [];
		  }

	  for ( catAcquaintAssign in xarrAcquaintAssigns )
	  {
		  oElem = {
			  id: catAcquaintAssign.id.Value,
			  code: catAcquaintAssign.code.Value,
			  fullname: ( catAcquaintAssign.person_id.HasValue ? catAcquaintAssign.person_id.ForeignElem.fullname.Value : "" ),
			  acquaint_name: catAcquaintAssign.object_name.Value,
			  acquaint_assign_state: ( catAcquaintAssign.state_id.HasValue ? catAcquaintAssign.state_id.ForeignElem.name.Value : "" ) ,
			  normative_date: StrDate( catAcquaintAssign.normative_date.Value, false, false ),
			  finish_date: StrDate( catAcquaintAssign.finish_date.Value, false, false ),
		  }

		  oRes.array.push(oElem);
	  }

	  if(ObjectType(oCollectionParams.sort) == 'JsObject' && oCollectionParams.sort.FIELD != null && oCollectionParams.sort.FIELD != undefined && oCollectionParams.sort.FIELD != "" )
	  {
		  var sFieldName = oCollectionParams.sort.FIELD;
		  switch(sFieldName)
		  {
			  case "code":
			  case "fullname":
			  case "acquaint_name":
			  case "acquaint_assign_state":
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
 * @typedef {Object} WTAcquaintChangeStateResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
*/
/**
 * @function AcquaintChangeState
 * @memberof Websoft.WT.Main
 * @description Изменяет статус ознакомления (ознакомлений)
 * @author EO
 * @param {bigint[]} arrAcquaintIDs - массив ID ознакомлений
 * @param {string} sState - Статус ознакомления для установки: "active" (Активное), "archive" (Архив)
 * @returns {WTAcquaintChangeStateResult}
*/
/* copy to @component acquaintance_forms  */
function AcquaintChangeState( arrAcquaintIDs, sState )
{
	var oRes = tools.get_code_library_result_object();

	if(!IsArray(arrAcquaintIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrAcquaintIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "acquaint")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_7' );
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
	var xarrAcquaints = XQuery( "for $elem in acquaints where MatchSome( $elem/id, ( " + ArrayMerge( arrAcquaintIDs, "This", "," ) + " ) ) and $elem/status != " + XQueryLiteral( ( sState == "archive" ? false : true ) ) + " return $elem" );
	if ( ArrayOptFirstElem( xarrAcquaints ) == undefined )
	{
		oRes.error = 504;
		oRes.errorText = i18n.t( 'uukazannyhozna' );
		return oRes;
	}
	for ( itemAcquaint in xarrAcquaints )
	{
		iAcquaintID = OptInt( itemAcquaint.id );
		if(iAcquaintID == undefined)
		{
			throw i18n.t( 'elementmassiva' );
		}
		try
		{
			docAcquaint = tools.open_doc(iAcquaintID);
			if ( docAcquaint == undefined )
			{
				continue;
			}
			docAcquaint.TopElem.status = ( sState == "archive" ? false : true )
			docAcquaint.Save();
		}
		catch( err )
		{
			oRes.error = 505;
			oRes.errorText = err;
		}

	}

	return oRes;
}


/**
 * @typedef {Object} WTAcquaintDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} AcquaintDeletedCount – количество удаленных ознакомлений
*/
/**
 * @function AcquaintDelete
 * @memberof Websoft.WT.Main
 * @description Удаляет ознакомления
 * @author EO
 * @param {bigint[]} arrAcquaintIDs - массив ID ознакомлений
 * @returns {WTAcquaintDeleteResult}
*/
/* copy to @component acquaintance_forms  */
function AcquaintDelete( arrAcquaintIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.AcquaintDeletedCount = 0;

	if(!IsArray(arrAcquaintIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrAcquaintIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "acquaint")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_7' );
		return oRes;
	}

	xarrAcquaintAssigns = tools.xquery("for $elem in acquaint_assigns where MatchSome($elem/acquaint_id, (" +  ArrayMerge( arrAcquaintIDs, "This", "," ) + ")) return $elem/Fields('acquaint_id')");

	for ( itemAcquaintID in arrAcquaintIDs )
	{
		try
		{
			iAcquaintID = OptInt(itemAcquaintID);
			if(iAcquaintID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}
			if ( ArrayOptFind( xarrAcquaintAssigns, "OptInt(This.acquaint_id.Value, -1) == iAcquaintID" ) != undefined )
			{
				continue;
			}

			DeleteDoc( UrlFromDocID( Int( iAcquaintID ) ) );
			oRes.AcquaintDeletedCount++;
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
 * @typedef {Object} WTAcquaintAssingDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
*/
/**
 * @function AcquaintAssingDelete
 * @memberof Websoft.WT.Main
 * @description Удаляет назначенные ознакомления
 * @author EO
 * @param {bigint[]} arrAcquaintAssingIDs - массив ID назначенных ознакомлений
 * @returns {WTAcquaintAssingDeleteResult}
*/
/* copy to @component acquaintance_forms  */
function AcquaintAssingDelete( arrAcquaintAssingIDs )
{
	var oRes = tools.get_code_library_result_object();

	if(!IsArray(arrAcquaintAssingIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrAcquaintAssingIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "acquaint_assign")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_7' );
		return oRes;
	}

	for ( itemAcquaintAssingID in arrAcquaintAssingIDs )
	{
		try
		{
			iAcquaintAssingID = OptInt(itemAcquaintAssingID);
			if(iAcquaintAssingID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			DeleteDoc( UrlFromDocID( Int( iAcquaintAssingID ) ) );
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
 * @typedef {Object} WTKnowledgePartDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} KnowledgePartDeletedCount – количество удаленных значений карты знаний
*/
/**
 * @function KnowledgePartDelete
 * @memberof Websoft.WT.Main
 * @description Удаляет значения карты знаний
 * @author EO
 * @param {bigint[]} arrKnowledgePartIDs - массив ID значений карты знаний
 * @returns {WTKnowledgePartDeleteResult}
*/
function KnowledgePartDelete( arrKnowledgePartIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.KnowledgePartDeletedCount = 0;

	if(!IsArray(arrKnowledgePartIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrKnowledgePartIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "knowledge_part")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_8' );
		return oRes;
	}

	sKnowledgePartIDs = ArrayMerge( arrKnowledgePartIDs, "This", "," );
	xarrKnowledgeParts = tools.xquery("for $elem in knowledge_parts where MatchSome($elem/parent_object_id, (" + sKnowledgePartIDs + ")) return $elem/Fields('id','parent_object_id')");
	xarrLinkedObjects = tools.xquery("for $elem in knowledge_objects where MatchSome($elem/knowledge_part_id, (" + sKnowledgePartIDs + ")) return $elem/Fields('knowledge_part_id')");

	while (true)
	{
		CountCurrentLoop = 0;
		arrKnowledgePartIDsNextLoop = arrKnowledgePartIDs;

		for (itemKnowledgePartID in arrKnowledgePartIDs)
		{
			try
			{
				iKnowledgePartID = OptInt(itemKnowledgePartID);
				if(iKnowledgePartID == undefined)
				{
					throw i18n.t( 'elementmassiva' );
				}
				if ( ( ArrayOptFind (xarrKnowledgeParts, "This.parent_object_id == iKnowledgePartID") == undefined ) &&  ( ArrayOptFind (xarrLinkedObjects, "This.knowledge_part_id == iKnowledgePartID") == undefined ) )
				{
					try
					{
						DeleteDoc( UrlFromDocID( iKnowledgePartID ), false);
					}
					catch(err)
					{
						throw i18n.t( 'oshibkaudaleniya' );
					}

					xarrKnowledgeParts = ArraySelect( xarrKnowledgeParts, "This.id != iKnowledgePartID" ); //удаляем элемент с id=iKnowledgePartID из массива
					arrKnowledgePartIDsNextLoop = ArraySelect( arrKnowledgePartIDsNextLoop, "OptInt(This, 0) != iKnowledgePartID" ); //удаляем элемент =iKnowledgePartID из массива
					oRes.KnowledgePartDeletedCount++;
					CountCurrentLoop++;
				}
			}
			catch(err)
			{
				alert("ERROR: KnowledgePartDelete: " + ("[" + itemKnowledgePartID + "]\r\n") + err);
			}
		}
		if ( CountCurrentLoop == 0 ) break;
		arrKnowledgePartIDs = arrKnowledgePartIDsNextLoop;
	}

	return oRes;
}


/**
 * @typedef {Object} WTAssignAcquaintsToCollaboratorsResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} AcquaintAssignedCount – количество назначенных (измененных в т.ч.) ознакомлений
 * @property {integer} NotificationSentCount – количество отправенных (созданных) уведомлений
*/
/**
 * @function AssignAcquaintsToCollaborators
 * @memberof Websoft.WT.Main
 * @description Назначить ознакомления сотрудникам
 * @author EO
 * @param {bigint[]} arrAcquaintIDs - массив ID ознакомлений
 * @param {bigint[]} arrCollaboratorIDs - массив ID сотрудников
 * @param {date} dNormativeDate - Требуемая дата ознакомления
 * @param {string} strReAssignParam - действие, если пользователь уже ознакомлен. "skip"(Пропустить)/"with_periodity"(Назначить, если вышел срок)/"always"(Назначить в любом случае)
 * @param {string} strSendNotificationParam - отправлять или нет уведомление: "yes"(Отправлять)/"no"(Не отправлять)
 * @param {string} strNotificationType - тип уведомления: "template"(По шаблону)/"template_additional_text"(По шаблону с доп. текстом)/"no_template"(Без шаблона)
 * @param {string} strAdditionalText - дополнительный текст в уведомление
 * @param {string} strSubject - тема уведомления
 * @param {string} strFormat - формат уведомления: "plain"(текст)/"html"(HTML)
 * @param {string} strNotificationText - текст уведомления
 * @param {bigint} iNotificationID - ID типа уведомления
 * @returns {WTAssignAcquaintsToCollaboratorsResult}
*/
/* copy to @component acquaintance_forms  */
function AssignAcquaintsToCollaborators( arrAcquaintIDs, arrCollaboratorIDs, dNormativeDate, strReAssignParam, strSendNotificationParam, strNotificationType, strAdditionalText, strSubject, strFormat, strNotificationText, iNotificationID )
{
	function update_acquaint_assign()
	{
		docAcquaintAssign.TopElem.state_id = 'assign';
		docAcquaintAssign.TopElem.finish_date.Clear();
		if ( dNormativeDate != null && dNormativeDate != undefined )
		try
		{
			docAcquaintAssign.TopElem.normative_date = Date( dNormativeDate );
		} catch (err) {}
		docAcquaintAssign.Save();
	}
	function create_notification()
	{
		if ( strSendNotificationParam == "yes" )
		{
			switch( strNotificationType )
			{
				case "template" :
					{
						tools.create_notification( strNotificationCode, iCollaboratorID, '', iAcquaintID, null, docAcquaint.TopElem );
						oRes.NotificationSentCount++;
						break;
					}
				case "template_additional_text" :
					{
						tools.create_notification( strNotificationCode, iCollaboratorID, strAdditionalText, iAcquaintID, null, docAcquaint.TopElem );
						oRes.NotificationSentCount++;
						break;
					}
				case "no_template" :
					{
						newNotif = OpenNewDoc ('x-local://wtv/wtv_dlg_notification_template.xml').TopElem;
						newNotif.recipients.AddChild().recipient_type = 'in_doc'; // отправление сообщения сотруднику
						newNotif.subject = strSubject;
						newNotif.body_type = (strFormat == 'plain') ? strFormat : "html" ;
						newNotif.body = strNotificationText;
						tools.create_notification( '0', iCollaboratorID, '', null, null, null, newNotif);
						oRes.NotificationSentCount++;
						break;
					}

			}
		}
	}

	var oRes = tools.get_code_library_result_object();
	oRes.AcquaintAssignedCount = 0;
	oRes.NotificationSentCount = 0;

	if( !IsArray(arrAcquaintIDs) || !IsArray(arrCollaboratorIDs) )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrAcquaintIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "acquaint")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_7' );
		return oRes;
	}

	catCheckObject = ArrayOptFirstElem(ArraySelect(arrCollaboratorIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "collaborator")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_9' );
		return oRes;
	}

	if ( strReAssignParam == null || strReAssignParam == undefined)
		strReAssignParam = "";
	if ( strSendNotificationParam == null || strSendNotificationParam == undefined )
		strSendNotificationParam = "";
	if ( strNotificationType == null || strNotificationType == undefined )
		strNotificationType = "";
	if ( strAdditionalText == null || strAdditionalText == undefined)
		strAdditionalText = "";
	if ( strSubject == null || strSubject == undefined)
		strSubject = "";
	if ( strFormat == null || strFormat == undefined)
		strFormat = "";
	if ( strNotificationText == null || strNotificationText == undefined)
		strNotificationText = "";
	if ( iNotificationID == null || iNotificationID == undefined)
	{
		strNotificationCode = '73';
	}
	else
	{
		iNotificationID = OptInt( iNotificationID );
		if ( iNotificationID != undefined )
		{
			docNotification = tools.open_doc( iNotificationID );
			if ( docNotification != undefined )
			{
				try
				{
					strNotificationCode = docNotification.TopElem.code;
				}
				catch (err)
				{
					strNotificationCode = '73';
				}
			}
		}
		else
		{
			strNotificationCode = '73';
		}
	}

	sCollaboratorIDs = ArrayMerge( arrCollaboratorIDs, "This", "," );
	xarrAcquaintAssigns = tools.xquery("for $elem in acquaint_assigns where MatchSome($elem/person_id, (" + sCollaboratorIDs + ")) return $elem/Fields('id','person_id', 'acquaint_id', 'state_id')");

	for ( iAcquaintID in arrAcquaintIDs )
	{
		for ( iCollaboratorID in arrCollaboratorIDs )
		{

			try
			{
				oFoundAcquaintAssign = ArrayOptFind( xarrAcquaintAssigns, "XQueryLiteral(This.acquaint_id.Value) == XQueryLiteral(iAcquaintID) && XQueryLiteral(This.person_id.Value) == XQueryLiteral(iCollaboratorID)" );
				if ( oFoundAcquaintAssign != undefined )
				{ // есть назначенного ознакомления
					if ( oFoundAcquaintAssign.state_id.Value == "familiar" )
						if ( strReAssignParam == "always" ) //Назначить в любом случае
						{
							docAcquaintAssign = tools.open_doc( oFoundAcquaintAssign.id.Value )
							if ( docAcquaintAssign != undefined )
							{
								update_acquaint_assign();
								oRes.AcquaintAssignedCount++
								docAcquaint = tools.open_doc( iAcquaintID );
								if ( docAcquaint != undefined)
								{
									create_notification();
								}
							}
						}
						else
							if ( strReAssignParam == "with_periodity" ) //Назначить, если вышел срок
							{
								docAcquaintAssign = tools.open_doc( oFoundAcquaintAssign.id.Value )
								if ( docAcquaintAssign != undefined )
								{
									iPeriod = docAcquaintAssign.TopElem.reacquaintance_period;
									if ( iPeriod > 0 && DateOffset( docAcquaintAssign.TopElem.finish_date, 86400 * iPeriod ) < Date( StrDate( Date(), false, false ) ) )
									{
										update_acquaint_assign();
										oRes.AcquaintAssignedCount++;
										docAcquaint = tools.open_doc( iAcquaintID );
										if ( docAcquaint != undefined)
										{
											create_notification();
										}
									}
								}
							}
				}
				else // нет назначенного ознакомления
				{
					docAcquaint = tools.open_doc( iAcquaintID );
					if ( docAcquaint != undefined )
					{
						docAcquaintAssign = OpenNewDoc( 'x-local://wtv/wtv_acquaint_assign.xmd' );
						docAcquaintAssign.TopElem.AssignElem( docAcquaint.TopElem );
						docAcquaintAssign.TopElem.acquaint_id = iAcquaintID;
						docAcquaintAssign.TopElem.person_id = iCollaboratorID;
						docAcquaintAssign.TopElem.state_id = 'assign';
						if ( dNormativeDate != null && dNormativeDate != undefined )
						try
						{
							docAcquaintAssign.TopElem.normative_date = Date( dNormativeDate );
						} catch (err) {}
						docAcquaintAssign.TopElem.doc_info.Clear();
						docAcquaintAssign.BindToDb( DefaultDb );
						docAcquaintAssign.Save();
						oRes.AcquaintAssignedCount++;
						create_notification();
					}
				}
			}
			catch(err)
			{
				oRes.error = 504;
				oRes.errorText = "ERROR: " + ("[" + iAcquaintID + "]\r\n") + err;
				return oRes;

			}
		}
	}

	return oRes;
}
/**
 * @typedef {Object} oPositionsFamilie
 * @property {bigint} id
 * @property {string} code
 * @property {string} name
 * @property {number} positions_count - количество типовых должностей в семействе
 * @property {number} typical_development_programs_count - Количество типовых программ развития в семействе
 * @property {string} job_transfer_type_id - направление перевода
 * @property {boolean} is_dynamic - динамическая группа
 * @property {date} modification_date - дата изменения
*/
/**
 * @typedef {Object} ReturnPositionsFamiliesApp
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oPositionsFamilie[]} typical_positions – Семейства должностей.
*/

/**
 * @function GetPositionFamilies
 * @memberof Websoft.WT.Main
 * @author IG
 * @description Получение списка семейства должностей.
 * @param {bigint} iCurUserID ID текущего пользователя.
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"reject"
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {bigint} arrReturnData positions_count_active - Число должностей
 * @param {string} sFilter - строка для XQuery-фильтра
 * @param {string} sFullText - строка для поиска
 * @param {string} sPositionCommon - единичный выбор из каталога Типовая должность
 * @param {string} sTypicalDevelopmentProgram - единичный выбор из каталога Типовая программа развития
 * @returns {ReturnPositionsFamiliesApp}
*/
function GetPositionFamilies( iPersonID, sAccessType, sApplication, iCurApplicationID, arrReturnData, sFilter, sFullText, sPositionCommon, sTypicalDevelopmentProgram, oCollectionParams ){

	var oRes = tools.get_code_library_result_object();
		oRes.error = 0;
		oRes.errorText = "";
		oRes.position_families = [];

		sXQueryQual = "";

	try
	{
		iPersonID = OptInt( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}

	try
	{
		if( arrReturnData == undefined || arrReturnData == "" || arrReturnData == null )
		{
			throw "error";
		}
	}
	catch( err )
	{
		arrReturnData = [];
	}

	try
	{
		sFilter = String( sFilter );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredananekorr' );
		return oRes;
	}

	try
	{
		sFullText = String( sFullText );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredananekorr_1' );
		return oRes;
	}

	if(oCollectionParams == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'oshibkanepereda' );
		return oRes;
	}

	sXQueryQual = String( sFilter );
	if (String(sFullText) != '')
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and " ) + "doc-contains($elem/id, '" + DefaultDb + "', " + XQueryLiteral( String( sFullText ) ) + ")";
	}

	var sCondSort = " order by [{CURSOR}]/id ascending";
	var oSort = oCollectionParams.sort;

	if(ObjectType(oSort) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
	{
		switch(oSort.FIELD)
		{
			case "code":
				sCondSort = " order by [{CURSOR}]/code" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
			case "name":
				sCondSort = " order by [{CURSOR}]/name" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
		}
	}

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	iPositionCommon = OptInt(sPositionCommon);
	if(iPositionCommon == undefined){
		if(IsArray(sPositionCommon)){
			oRes.error = 501;
			oRes.errorText = i18n.t( 'nevernoeilimno_1' );
			return oRes;
		}
	} else {
//		sPositionCommonCond = "contains($elem/position_commons,'" + iPositionCommon + "')";
		sPosComXQ = ArrayOptFirstElem( XQuery("for $elem in position_commons where $elem/id = " + iPositionCommon + " return $elem/Fields('position_familys')") );
		if ( sPosComXQ != undefined && sPosComXQ.position_familys != "" )
		{
			sPositionCommonCond = "MatchSome($elem/id,(" + StrReplace( sPosComXQ.position_familys, ";", "," ) + "))";
			sXQueryQual += ( sXQueryQual == "" ? sPositionCommonCond : " and " + sPositionCommonCond )
		}
	}

	iTypicalDevelopmentProgram = OptInt(sTypicalDevelopmentProgram);
	if(iTypicalDevelopmentProgram == undefined){
		if(IsArray(sTypicalDevelopmentProgram)){
			oRes.error = 501;
			oRes.errorText = i18n.t( 'nevernoeilimno_2' );
			return oRes;
		}
	}

	var teApplication = undefined;
    var iApplLevel = 0;

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);

		if(iApplicationID == undefined)
		{
			iApplicationID = OptInt(iCurApplicationID);
		}

		if(OptInt(iApplicationID) != undefined)
		{
			sGetApplicationQuery = "for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')";
			sApplication = ''+ArrayOptFirstElem(tools.xquery(sGetApplicationQuery), {code: ""}).code;
		}

		if(sApplication != undefined)
		{
			iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplication ] );

			if(iApplLevel >= 10) // Администратор приложения
			{
				sAccessType = "admin";
			}
			else if(iApplLevel >= 7) // администратор процесса
			{
				sAccessType = "manager";
			}
			else if(iApplLevel >= 5) // HR
			{
				sAccessType = "hr";
			}
			else if(iApplLevel >= 3) // методист
			{
				sAccessType = "expert";
			}
			else if(iApplLevel >= 1) // Наблюдатель
			{
				sAccessType = "observer";
			}
		}
		else
		{
			sAccessType = "admin";
		}
	}

	var arrBossType = [];
	var xqArrTypicalPositions = [];
	var xqIsGroupBoss = [];
	var bSelectByPositionFamilies = false;

	arrConds = []

	sCatalog = "position"
	switch(sAccessType){
		case "hr": // hr
			if (ArrayOptFirstElem(arrBossType) == undefined)
			{
				teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
				if (teApplication != null)
				{
					var wvManagerTypeIDs = teApplication.wvars.GetOptChildByKey( 'manager_type_id' );
					var arrManagerTypeIDs = wvManagerTypeIDs != undefined ? tools_web.parse_multiple_parameter(wvManagerTypeIDs.value) : [];
					if ( ArrayOptFirstElem(arrManagerTypeIDs) != undefined )
					{
						arrBossType = arrManagerTypeIDs;
					}
				}
			}

			if(ArrayOptFirstElem(arrBossType) == undefined)
			{
				arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
			}

			if(ArrayOptFirstElem(arrBossType) != undefined)
			{
				//"subordinates":
				arrPositions = get_subordinate_records(iPersonID, ['func'], false, 'position', null, '', true, false, true, true, arrBossType, false );
			}

			break;
		case "observer": // только чтение, наблюдатель
			arrPositions = get_subordinate_records(iPersonID, ['fact','func'], false, 'position', null, '', true, false, true, true, [], false );
			break;
		case "reject":
			sXQueryQual = "$elem/id = 0"
			break;
	}

	switch(sAccessType)
	{
		case "hr": // hr
		case "observer": // только чтение, наблюдатель
			arrPosIDs = new Array();
			for (iPositionID in arrPositions)
			{
				arrPosIDs.push(iPositionID.id.Value)
			}

			sql = "for $elem in positions where MatchSome($elem/id, (" + ArrayMerge(arrPosIDs, 'This', ',') + ")) return $elem/Fields('position_common_id')";
			oPositions = tools.xquery(sql);

			arrPosCommonIDs = new Array();
			for (oPosition in oPositions)
			{
				id = OptInt(oPosition.position_common_id.Value)
				if(id != undefined){
					arrPosCommonIDs.push(oPosition.position_common_id.Value)
				}
			}

			sql = "for $elem in position_commons where MatchSome($elem/id, (" + ArrayMerge(arrPosCommonIDs, 'This', ',') + ")) return $elem";
			oPositionCommons = tools.xquery(sql);

			oPosFamilyIDs = new Array();
			for (oItem in oPositionCommons)
			{
				sPosFamilys = oItem.position_familys.Value
				if(sPosFamilys != undefined){
					oPosFamilyIDs = ArrayUnion(oPosFamilyIDs, ArrayExtract(ArraySelect(sPosFamilys.split(";"), "OptInt(This) != undefined"), "OptInt(This)"))
				}
			}

			sSearchCond = "MatchSome($elem/id, (" + ArrayMerge(oPosFamilyIDs, 'This', ',') + "))"
			sXQueryQual += ( sXQueryQual == "" ? sSearchCond : " and " + sSearchCond )
		break;
	}

	sPositionFamiliesQuery = "for $elem in position_familys " + (sXQueryQual == "" ? "" : ("where " + sXQueryQual)) + StrReplace(sCondSort, "[{CURSOR}]", "$elem") + " return $elem"
	xarrPositionFamilies = tools.xquery(sPositionFamiliesQuery);
	xarrPositionFamilies = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrPositionFamilies, oCollectionParams.paging, oCollectionParams.sort ] ).oResult;

	for (oPositionFamily in xarrPositionFamilies )
	{
		docPositionFamily = tools.open_doc(oPositionFamily.id.Value)
		docPositionFamilyTE = docPositionFamily.TopElem
		if( iTypicalDevelopmentProgram != undefined )
		{
			oPrograms = ArrayOptFind(docPositionFamilyTE.typical_development_programs, "OptInt(This.typical_development_program_id) == " + iTypicalDevelopmentProgram)
			if(oPrograms != undefined)
			{

				oJobTransferType = ArrayOptFind( common.job_transfer_types, 'This.id == oPrograms.job_transfer_type_id.Value' );

				oJobTransferTypeName = ""
				if(oJobTransferType != undefined)
					oJobTransferTypeName = oJobTransferType.name.Value

				xarrPositionCommons = XQuery( "for $elem in position_commons where contains( $elem/position_familys, " + XQueryLiteral( String( docPositionFamily.DocID ) ) + " ) return $elem/Fields('id')" )
				typical_positions_counter = ArrayCount(xarrPositionCommons);
				positions_counter = null
				if (ArrayOptFind(arrReturnData, "This == 'positions_count_active'") != undefined && typical_positions_counter > 0)
				{
					// sQuery = "for $elem in positions where MatchSome($elem/position_family_id, ( " + docPositionFamily.DocID + " ) ) " + ( ArrayOptFirstElem( xarrPositionCommons ) != undefined ? " or MatchSome( $elem/position_common_id, ( " + ArrayMerge( xarrPositionCommons, "This.id", "," ) + " ) )" : "" ) + " return $elem"
					sQuery = "for $elem in positions where  MatchSome( $elem/position_common_id, ( " + ArrayMerge( xarrPositionCommons, "This.id", "," ) + " ) ) return $elem"
					xarrPositions = tools.xquery(sQuery);
					positions_counter = ArrayCount(xarrPositions)
				}

				oRes.position_families.push({
					id: docPositionFamily.DocID,
					code: docPositionFamilyTE.code.Value,
					name: docPositionFamilyTE.name.Value,
					typical_positions_count: typical_positions_counter,
					positions_count: positions_counter,
					typical_development_programs_count: ArrayCount(docPositionFamilyTE.typical_development_programs),
					job_transfer_type_id: oJobTransferTypeName,
					is_dynamic: docPositionFamilyTE.code.Value,
					modification_date: docPositionFamilyTE.doc_info.modification.date.Value,
				})
			}
		} 
		else 
		{
			xarrPositionCommons = XQuery( "for $elem in position_commons where contains( $elem/position_familys, " + XQueryLiteral( String( docPositionFamily.DocID ) ) + " ) return $elem/Fields('id')" )
			typical_positions_counter = ArrayCount(xarrPositionCommons)


			positions_counter = null
			if (ArrayOptFind(arrReturnData, "This == 'positions_count_active'") != undefined && typical_positions_counter > 0)
			{
				//sQuery = "for $elem in positions where MatchSome($elem/position_family_id, ( " + docPositionFamily.DocID + " ) ) " + ( ArrayOptFirstElem( xarrPositionCommons ) != undefined ? " or MatchSome( $elem/position_common_id, ( " + ArrayMerge( xarrPositionCommons, "This.id", "," ) + " ) )" : "" ) + " return $elem"
				//xarrPositions = tools.xquery(sQuery);
				//typical_positions_counter = ArrayCount(xarrPositions)
				sQuery = "for $elem in positions where  MatchSome( $elem/position_common_id, ( " + ArrayMerge( xarrPositionCommons, "This.id", "," ) + " ) ) return $elem"
				xarrPositions = tools.xquery(sQuery);
				positions_counter = ArrayCount(xarrPositions)
			}

			oRes.position_families.push({
				id: docPositionFamily.DocID,
				code: docPositionFamilyTE.code.Value,
				name: docPositionFamilyTE.name.Value,
				typical_positions_count: typical_positions_counter,
				positions_count: positions_counter,
				typical_development_programs_count: ArrayCount(docPositionFamilyTE.typical_development_programs),
				is_dynamic: docPositionFamilyTE.code.Value,
				modification_date: docPositionFamilyTE.doc_info.modification.date.Value,
			})
		}
	}

	return oRes;
}

/**
 * @typedef {Object} WTAcquaintAssingChangeStateResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} NotificationSentCount – количество отправенных (созданных) уведомлений
*/
/**
 * @function AcquaintAssingChangeState
 * @memberof Websoft.WT.Main
 * @description Изменить статус назначенных ознакомлений
 * @author EO
 * @param {bigint[]} arrAcquaintAssingIDs - массив ID назначенных ознакомлений
 * @param {date} dNormativeDate - Требуемая дата ознакомления
 * @param {string} strStateParam - статус, который должен быть установлен назначенному ознакомлению: "assign"(Назначен)/"active"(В процессе)/"familiar"(Ознакомлен)
 * @param {string} strSendNotificationParam - отправлять или нет уведомление: "yes"(Отправлять)/"no"(Не отправлять)
 * @param {string} strNotificationType - тип уведомления: "template"(По шаблону)/"template_additional_text"(По шаблону с доп. текстом)/"no_template"(Без шаблона)
 * @param {string} strAdditionalText - дополнительный текст в уведомление
 * @param {string} strSubject - тема уведомления
 * @param {string} strFormat - формат уведомления: "plain"(текст)/"html"(HTML)
 * @param {string} strNotificationText - текст уведомления
 * @param {bigint} iNotificationID - ID типа уведомления
 * @returns {WTAcquaintAssingChangeStateResult}
*/
/* copy to @component acquaintance_forms  */
function AcquaintAssingChangeState( arrAcquaintAssingIDs, dNormativeDate, strStateParam, strSendNotificationParam, strNotificationType, strAdditionalText, strSubject, strFormat, strNotificationText, iNotificationID )
{
	function create_notification()
	{
		if ( strSendNotificationParam == "yes" )
		{
			switch( strNotificationType )
			{
				case "template" :
					{
						tools.create_notification( strNotificationCode, iCollaboratorID, '', iAcquaintAssingID, null, docAcquaintAssign.TopElem );
						oRes.NotificationSentCount++;
						break;
					}
				case "template_additional_text" :
					{
						tools.create_notification( strNotificationCode, iCollaboratorID, strAdditionalText, iAcquaintAssingID, null, docAcquaintAssign.TopElem );
						oRes.NotificationSentCount++;
						break;
					}
				case "no_template" :
					{
						newNotif = OpenNewDoc ('x-local://wtv/wtv_dlg_notification_template.xml').TopElem;
						newNotif.recipients.AddChild().recipient_type = 'in_doc'; // отправление сообщения сотруднику
						newNotif.subject = strSubject;
						newNotif.body_type = (strFormat == 'plain') ? strFormat : "html" ;
						newNotif.body = strNotificationText;
						tools.create_notification( '0', iCollaboratorID, '', null, null, null, newNotif);
						oRes.NotificationSentCount++;
						break;
					}

			}
		}
	}

	var oRes = tools.get_code_library_result_object();
	oRes.NotificationSentCount = 0;

	if( !IsArray(arrAcquaintAssingIDs) )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrAcquaintAssingIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "acquaint_assign")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_10' );
		return oRes;
	}

	if ( strStateParam == null || strStateParam == undefined )
		strStateParam = "";
	if ( strSendNotificationParam == null || strSendNotificationParam == undefined )
		strSendNotificationParam = "";
	if ( strNotificationType == null || strNotificationType == undefined )
		strNotificationType = "";
	if ( strAdditionalText == null || strAdditionalText == undefined)
		strAdditionalText = "";
	if ( strSubject == null || strSubject == undefined)
		strSubject = "";
	if ( strFormat == null || strFormat == undefined)
		strFormat = "";
	if ( strNotificationText == null || strNotificationText == undefined)
		strNotificationText = "";
	if ( iNotificationID == null || iNotificationID == undefined)
	{
		strNotificationCode = '73';
	}
	else
	{
		iNotificationID = OptInt( iNotificationID );
		if ( iNotificationID != undefined )
		{
			docNotification = tools.open_doc( iNotificationID );
			if ( docNotification != undefined )
			{
				try
				{
					strNotificationCode = docNotification.TopElem.code;
				}
				catch (err)
				{
					strNotificationCode = '73';
				}
			}
		}
		else
		{
			strNotificationCode = '73';
		}
	}

	for ( iAcquaintAssingID in arrAcquaintAssingIDs )
	{
		try
		{
			docAcquaintAssign = tools.open_doc( iAcquaintAssingID );
			if ( docAcquaintAssign != undefined )
			{
				docAcquaintAssign.TopElem.state_id = strStateParam;
				if ( strStateParam == "assign" )
				{
					docAcquaintAssign.TopElem.finish_date.Clear();
					if ( dNormativeDate != null && dNormativeDate != undefined )
					try
					{
						docAcquaintAssign.TopElem.normative_date = Date( dNormativeDate );
					} catch (err) {}
				}
				docAcquaintAssign.Save();
				iCollaboratorID = OptInt(docAcquaintAssign.TopElem.person_id);
				if ( iCollaboratorID != undefined )
				{
					create_notification();
				}
			}
		}
		catch(err)
		{
			oRes.error = 504;
			oRes.errorText = "ERROR: " + ("[" + iAcquaintID + "]\r\n") + err;
			return oRes;

		}
	}

	return oRes;
}

/**
 * @function DeleteTypicalPosition
 * @memberof Websoft.WT.Main
 * @description Удаление наставника.
 * @param {bigint[]} arrTypicalPositionIDs - Массив ID наставников, подлежащих удалению
 * @returns {WTLPECountResult}
*/
function DeleteTypicalPosition( arrTypicalPositionIDs ){
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrTypicalPositionIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrTypicalPositionIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "position_common")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_6' );
		return oRes;
	}

	for(itemTypicalPositionID in arrTypicalPositionIDs)
	{

		sSQL = "for $elem in positions where MatchSome( $elem/position_common_id, (" + XQueryLiteral(itemTypicalPositionID) + ") ) return $elem/Fields('id')"
		sPositionID = ArrayOptFirstElem(ArrayExtract(tools.xquery(sSQL), "This.id.Value"));

		if(sPositionID == undefined){
			DeleteDoc( UrlFromDocID( OptInt(itemTypicalPositionID)), false);
			oRes.count++;
		}
	}

	return oRes;
}


/**
 * @function DeletePositionFamily
 * @memberof Websoft.WT.Main
 * @description Удаление семейства должностей.
 * @param {bigint[]} arrPositionFamilyIDs - Массив ID семейства должностей, подлежащих удалению
 * @returns {WTLPECountResult}
*/
function DeletePositionFamily( arrPositionFamilyIDs ){
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrPositionFamilyIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrPositionFamilyIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "position_family")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_6' );
		return oRes;
	}

	for(itemPositionFamilyID in arrPositionFamilyIDs)
	{
		sSQL = "for $elem in position_commons where contains( $elem/position_familys, ('" + XQueryLiteral(itemPositionFamilyID) + "') ) return $elem/Fields('id')"
		sPositionFamilysID = ArrayOptFirstElem(ArrayExtract(tools.xquery(sSQL), "This.id.Value"));
		if(sPositionFamilysID == undefined){
			DeleteDoc( UrlFromDocID( OptInt(itemPositionFamilyID)), false);
			oRes.count++;
		}
	}

	return oRes;
}

/**
 * @typedef {Object} NameTupleResult
 * @property {number} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {string} name – Наименование справочника-источника
 * @property {string} result – результат
*/
/**
 * @function GetCatalogNameTuple
 * @memberof Websoft.WT.Main
 * @description Формирование строки вида i18n.t( 'namenameieshen' )
 * @param {bigint[]} arrIDs - Массив ID записей справочника-источника
 * @param {number} iNum - количество выводимых в кортеж имен. По умолчанию - 2
 * @param {string} sFieldName - Имя поля каталога, выводимого в кортеж. По умолчанию - помеченное как "disp_name" для данного каталога
 * @returns {NameTupleResult}
*/
function GetCatalogNameTuple(arrIDs, iNum, sFieldName)
{
	var oRes = tools.get_code_library_result_object();
	oRes.name = "";
	oRes.result = "";
	try
	{
		if(!IsArray(arrIDs))
			throw i18n.t( 'argumentsperech' );
		
		var iElemID = ArrayOptFirstElem(arrIDs)
		if(iElemID == undefined)
			throw i18n.t( 'massivsidpust' );

		var docElem = tools.open_doc(iElemID);
		if(docElem == undefined)
			throw i18n.t( 'argumentsperech_1' );
		
		var sCatalogName = docElem.TopElem.Name;
		
		var oObjectParam = common.exchange_object_types.GetChildByKey( sCatalogName );
		
		if(sFieldName == undefined || sFieldName == null || sFieldName == "")
		{
			sFieldName = oObjectParam.disp_name.Value;
		}
		oRes.name = oObjectParam.web_title.Value;

		if(OptInt(iNum, 0) < 1)
			iNum = 2;
		
		var sTupleReq = "for $elem in " + sCatalogName + "s where MatchSome( $elem/id, (" + ArrayMerge(arrIDs, 'This', ',') + ") ) return $elem";
		var arrCatalog = tools.xquery(sTupleReq);

		var xmCatElem = tools.new_doc_by_name(sCatalogName + 's', true).TopElem.AddChild(); 
		if(xmCatElem.ChildExists(sFieldName))
		{
			var sExtractEval = "This." + sFieldName + ".Value";
		}
		else
		{
			var sExtractEval = "RValue(tools.open_doc(This.id.Value).TopElem." + sFieldName + ")";
		}
		
		var arrObjectNames = ArrayExtract(ArrayRange(arrCatalog, 0, iNum), sExtractEval);
		
		var iTailCount = ArrayCount(arrCatalog) - iNum;
		if(iTailCount > 0)
			arrObjectNames.push(i18n.t( 'ieshe' ) + iTailCount);

		oRes.result = ArrayMerge(arrObjectNames, "This", ", ")
	}
	catch(err)
	{
		oRes = tools.parse_throw_error(err, oRes)
		oRes.name = "";
		oRes.result = "";
	}
	return oRes;
}

/**
 * @function DetectTutorState
 * @memberof Websoft.WT.Main
 * @description Формирование строки вида i18n.t( 'familiyaiofamil' )
 * @param {bigint[]} arrTutorIDs - Массив ID наставников
 * @returns {WTLPETextResult}
*/
function DetectTutorState( arrTutorIDs ){
	var oRes = tools.get_code_library_result_object();
		oRes.paragraph = ""

	if(arrTutorIDs == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'oshibkaidnastav' );
		return oRes;
	}

	sSQL = "for $elem in tutors where MatchSome( $elem/id, (" + ArrayMerge(arrTutorIDs, 'This', ',') + ") ) return $elem/Fields('person_id')"
	arrPersonIDs = ArrayExtract(tools.xquery(sSQL), "This.person_id.Value");

	oRes.paragraph = GetCatalogNameTuple(arrPersonIDs, iNum, "shortname").result;

	return oRes;
}

function get_persons_fio_tuple(arrPersonIDs, iNum)
{
	return GetCatalogNameTuple(arrPersonIDs, iNum, "shortname").result;
}

/**
 * @function ChangeTutorState
 * @memberof Websoft.WT.Main
 * @description Изменение статусов наставников
 * @param {bigint[]} arrTutorIDs - Массив ID наставников
 * @param {string} sState - статус (active, not_active)
 * @returns {WTLPECountResult}
*/
function ChangeTutorState( arrTutorIDs, sState ){
	var oRes = tools.get_code_library_result_object();
		oRes.count = 0

	if(!IsArray(arrTutorIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	if(sState == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'neperedanstatu' );
		return oRes;
	}

	for (iTutorID in arrTutorIDs)
	{
		docTutor = tools.open_doc(iTutorID)
		docTutorTE = docTutor.TopElem

		if(docTutorTE.status.Value != sState){
			docTutorTE.status.Value = sState
			docTutor.Save()
			oRes.count++
		}
	}

	return oRes;
}


/**
 * @function DeleteSubdivisionGroup
 * @memberof Websoft.WT.Main
 * @description Изменение статусов наставников
 * @param {bigint[]} arrSubdivisionGroupIDs - Массив ID групп подразделений
 * @returns {WTLPECountResult}
*/
function DeleteSubdivisionGroup( arrSubdivisionGroupIDs ){
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrSubdivisionGroupIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrSubdivisionGroupIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "subdivision_group")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_5' );
		return oRes;
	}

	for(itemSubdivisionGroupID in arrSubdivisionGroupIDs)
	{
		docSubdivisionGroup = tools.open_doc(itemSubdivisionGroupID)
		docSubdivisionGroupTE = docSubdivisionGroup.TopElem

		bSubdivisionHas = ArrayOptFind( docSubdivisionGroupTE.subdivisions, 'This.subdivision_id != undefined' );

		if( bSubdivisionHas == undefined ){
			DeleteDoc( UrlFromDocID( OptInt(itemSubdivisionGroupID)), false);
			oRes.count++;
		}
	}

	return oRes;
}
/**
 * @typedef {Object} EssentialData
 * @property {string} name – Название.
 * @property {string} boss_fullname – ФИО руководителя.
 * @property {string} boss_position_name – Должность руководителя.
*/
/**
 * @typedef {Object} GetEssentialDataResult
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {EssentialData} essential – данные юридического лица .
*/
/**
 * @function GetEssentialData
 * @memberof Websoft.WT.Main
 * @description Получение данных юридического лица по сотруднику
 * @param {bigint} iUserID - ID сотрудника
 * @returns {GetEssentialDataResult}
*/
function GetEssentialData( iUserID ){
	var oRes = tools.get_code_library_result_object();
	oRes.essential = {
		name: "",
		boss_fullname: "",
		boss_position_name: ""
	};

	try
	{
		iUserID = Int( iUserID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
	}
	try
	{
		docUser = tools.open_doc( iUserID );
		if( docUser == undefined )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nekorrektnyyid_1' );
		return oRes;
	}
	if( !docUser.TopElem.org_id.HasValue )
	{
		return oRes;
	}
	docOrg = tools.open_doc( docUser.TopElem.org_id );
	if( docOrg == undefined )
	{
		return oRes;
	}
	var catEssential;
	if( docUser.TopElem.provider_legal_id.HasValue )
	{
		catEssential = ArrayOptFind( docOrg.TopElem.essentials,"This.code == docUser.TopElem.provider_legal_id" );
	}
	else
	{
		catEssential = ArrayOptFirstElem( docOrg.TopElem.essentials );
	}
	if( catEssential == undefined )
	{
		return oRes;
	}
	oRes.essential.name = catEssential.name.Value;
	oRes.essential.boss_fullname = catEssential.director.lastname.Value + ( catEssential.director.lastname.HasValue ? " " : "" ) + catEssential.director.firstname.Value + ( catEssential.director.firstname.HasValue ? " " : "" ) + catEssential.director.middlename.Value;
	oRes.essential.boss_position_name = catEssential.director.position_name.HasValue ? catEssential.director.position_name.ForeignElem.name.Value : "";

	return oRes;
}

/**
 * @typedef {Object} oLearningTask
 * @property {bigint} id
 * @property {string} code
 * @property {string} name
 * @property {string} desc - описание
 * @property {string} comment - комментарий
 * @property {number} counts_all_learning_task - бщее количество назначений задания – количество всех назначений данного задания с любым статусом, кроме Отменен.
 * @property {number} counts_active_learning_task - Количество активных назначений задания – количество назначений данного задания со статусами Назначен, В работе, Просмотрен, Оценивается.
 * @property {number} counts_success_learning_task - Количество завершенных назначений задания – количество назначений данного задания со статусами Пройден, Не пройден.
 * @property {number} counts_expired_learning_task - Количество просроченных назначений заданий – количество назначений данного задания, выполнение которых было просрочено. Для статусов Назначен, В работе, Просмотрен, Оценивается назначенное задание просрочено, если поле Планируемая дата завершения заполнено и значение в нем меньше текущей даты. Для статусов Пройден, Не пройден назначенное задание просрочено, если включен флажок Просрочено.
 * @property {date} date_assignment - Дата последнего назначения задания – наибольшая дата создания назначения задания с любым статусом по этому заданию.
*/
/**
 * @typedef {Object} ReturnLearningTasks
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oLearningTask[]} result – Список заданий.
*/

/**
 * @function GetLearningTasks
 * @memberof Websoft.WT.Main
 * @author IG
 * @description Получение списка заданий
 * @param {bigint} iPersonID ID текущего пользователя.
 * @param {boolean} [bCheckAccess=false] Проверять права доступа.
 * @param {string} sAccessType Тип доступа: "admin"/"manager"/"hr"/"expert"/"observer"/"reject"
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID ID текущего приложения
 * @param {bigint} arrReturnData - (Какие показатели будут рассчитываться в результатах): 10 - Общее количество назначений задания, 20 - Количество активных назначений задания, 30 - Количество завершенных назначений задания, 40 - Количество просроченных назначений заданий, 50 - Дата последнего назначения задания
 * @param {string} sFilter - строка для XQuery-фильтра
 * @param {string} sFullText - строка для поиска
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnLearningTasks}
*/
function GetLearningTasks( iPersonID, bCheckAccess, sAccessType, sApplication, iCurApplicationID, arrReturnData, sFilter, sFullText, oCollectionParams ){

	var oRes = tools.get_code_library_result_object();
		oRes.error = 0;
		oRes.errorText = "";
		oRes.result = [];

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

	var sXQueryQual = "";

	try
	{
		iPersonID = OptInt( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' );
		return oRes;
	}

	try
	{
		if( arrReturnData == undefined || arrReturnData == "" || arrReturnData == null )
		{
			throw "error";
		}
	}
	catch( err )
	{
		arrReturnData = "fields";
	}

	try
	{
		sFilter = String( sFilter );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredananekorr' );
		return oRes;
	}

	try
	{
		sFullText = String( sFullText );
	}
	catch( ex )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredananekorr_1' );
		return oRes;
	}

	if(oCollectionParams == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'oshibkanepereda' );
		return oRes;
	}

	var sCondSort = " order by [{CURSOR}]/id ascending";
	var oSort = oCollectionParams.sort;

	if(ObjectType(oSort) == 'JsObject' && oSort.FIELD != null && oSort.FIELD != undefined && oSort.FIELD != "" )
	{
		switch(oSort.FIELD)
		{
			case "code":
				sCondSort = " order by [{CURSOR}]/code" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
			case "name":
				sCondSort = " order by [{CURSOR}]/name" + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
				break;
			default:
				sCondSort = " order by [{CURSOR}]/" + oSort.FIELD + (StrUpperCase(oSort.DIRECTION) == "DESC" ? " descending" : "") ;
		}
	}

	oRes.paging = oCollectionParams.GetOptProperty( "paging" );

	if(sFilter != "")
		sXQueryQual += sFilter;

	if (sFullText != '')
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and " ) + "doc-contains($elem/id, '" + DefaultDb + "', " + XQueryLiteral( sFullText ) + ")";
	}

	if ( sAccessType != "auto" && sAccessType != "admin" && sAccessType != "manager" && sAccessType != "hr" && sAccessType != "observer" )
		sAccessType = "auto";

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);

		if(iApplicationID == undefined)
		{
			iApplicationID = OptInt(iCurApplicationID);
		}

		if(OptInt(iApplicationID) != undefined)
		{
			sGetApplicationQuery = "for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')";
			sApplication = ''+ArrayOptFirstElem(tools.xquery(sGetApplicationQuery), {code: ""}).code;
		}

		if(sApplication != undefined){
			var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iPersonID, sApplication ] );

			if(iApplLevel >= 10) // Администратор приложения
			{
				sAccessType = "admin";
			}
			else if(iApplLevel >= 7) // администратор процесса
			{
				sAccessType = "manager";
			}
			else if(iApplLevel >= 5) // HR
			{
				sAccessType = "hr";
			}
			else if(iApplLevel >= 3) // методист
			{
				sAccessType = "expert";
			}
			else if(iApplLevel >= 1) // Наблюдатель
			{
				sAccessType = "observer";
			}
		} else {
			sAccessType = "admin";
		}
	}

	if(iApplicationID != undefined){
		switch(sAccessType){
			case "expert": // методист
				sGetExpertQuery = "for $elem in experts where $elem/person_id = " + iPersonID + " return $elem/Fields('id')"

				iExpertID = ArrayOptFirstElem(tools.xquery(sGetExpertQuery), {id: null}).id;

				if(iExpertID == null){
					oRes.error = 501;
					oRes.errorText = i18n.t( 'oshibkavynenazn' );
					return oRes;
				}

				arrCategories = tools.xquery("for $elem in roles where contains ($elem/experts, '" + iExpertID + "') return $elem/Fields('id')");
				if ( ArrayOptFirstElem( arrCategories ) != undefined )
				{
					sCatExpert = "MatchSome($elem/role_id, (" + ArrayMerge ( arrCategories, 'This.id', ',' ) + "))";
				}
				else
				{
					sCatExpert = "$elem/id = 0"
				}

				sXQueryQual += ( sXQueryQual == "" ? sCatExpert : " and " + sCatExpert );

				break;
			case "reject":
				sXQueryQual += ( sXQueryQual == "" ? "$elem/id = 0" : " and " + "$elem/id = 0" );
				
				break;
		}
	}

	var bLearningTasks = false
	var arrBossType = new Array()
	var arrSubordinateIDs = new Array()

	var arrIds = new Array()
	switch(sAccessType)
	{
		case "admin": // админ
		case "manager": // менеджер
		case "expert": // методист
			// Администратор (10 и 7) и Эксперт (3) – считаются назначенные задания по всем сотрудникам без исключения;
			bLearningTasks = false
			break;
		case "hr": // HR

			// Менеджер обучения (5) – считаются назначенные задания только по сотрудникам, для которых пользователь является функциональным руководителем с типом, указанным в параметре manager_type_id приложения (если параметр пуст, то берем тип руководителя education_manager, входит в коробку).
			// Учитываются организации, подразделения, группы и персональные руководители.

			if (ArrayOptFirstElem(arrBossType) == undefined)
			{
				teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));
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

			arrSubordinateIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iPersonID, ['func'], true, '', null, '', true, true, true, true, arrBossType, true ] );

			bLearningTasks = true;

		case "observer": // Наблюдатель
		// Наблюдатель (1) - считаются назначения задания только по сотрудникам, для которых пользователь является функциональным руководителем любого типа.
		// Учитываются организации, подразделения, группы и персональные руководители.

			arrSubordinateIDs = tools.call_code_library_method("libMain", "get_subordinate_records", [
					iPersonID,
					['func'],
					/*bReturnIDs*/ true,
					/*sCatalog*/ '',
					/*arrFieldsNames*/ null,
					/*xQueryCond*/ '',
					/*bGetOrgSubordinate*/ true,
					/*bGetGroupSubordinate*/ true,
					/*bGetPersonSubordinate*/ true,
					/*bInHierSubdivision*/ true,
					/*arrBossTypeIDs*/ [],
					/*bWithoutUseManagementObject*/ true
				]);
			bLearningTasks = true;
			break;
	}

	sLearningTasksQuery = "for $elem in learning_tasks " + (sXQueryQual == "" ? "" : ("where " + sXQueryQual)) + StrReplace(sCondSort, "[{CURSOR}]", "$elem") + " return $elem"
	xarrLearningTasks = tools.xquery(sLearningTasksQuery);
	xarrLearningTasks = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ xarrLearningTasks, oCollectionParams.paging, oCollectionParams.sort ] ).oResult;

	for (oLearningTask in xarrLearningTasks)
	{
		docLearningTask = tools.open_doc(oLearningTask.id.Value)
		docLearningTaskTE = docLearningTask.TopElem

		counts_all_learning_task = null
		counts_active_learning_task = null
		counts_success_learning_task = null
		counts_expired_learning_task = 0 // Expired
		date_assignment = ""

		if(IsArray(arrReturnData)){
			for (iData in arrReturnData)
			{
				switch( iData )
				{
					case 10: // Общее количество назначений задания
						if(bLearningTasks)
						{
							sQuery = "for $elem in learning_task_results where MatchSome( $elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + ")) and MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) return $elem/Fields('id')"
						} else {
							sQuery = "for $elem in learning_task_results where MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) return $elem/Fields('id')"
						}

						arrAllLearningTask = tools.xquery(sQuery)
						if ( ArrayOptFirstElem( arrAllLearningTask ) != undefined ){
							counts_all_learning_task = ArrayCount(arrAllLearningTask)
						}
						break;
					case 20: // Количество активных назначений задания
						if(bLearningTasks)
						{
							sQuery = "for $elem in learning_task_results where MatchSome( $elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + ")) and MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('process')) return $elem/Fields('id')"
						} else {
							sQuery = "for $elem in learning_task_results where MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('process')) return $elem/Fields('id')"
						}

						arrProcessLearningTask = tools.xquery(sQuery)
						if ( ArrayOptFirstElem( arrProcessLearningTask ) != undefined ){
							counts_active_learning_task = ArrayCount(arrProcessLearningTask)
						}
						break;
					case 30: // Количество завершенных назначений задания
						if(bLearningTasks)
						{
							sQuery = "for $elem in learning_task_results where MatchSome( $elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + ")) and MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('success')) return $elem/Fields('id')"
						} else {
							sQuery = "for $elem in learning_task_results where MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('success')) return $elem/Fields('id')"
						}

						arrSuccessLearningTask = tools.xquery(sQuery)
						if ( ArrayOptFirstElem( arrSuccessLearningTask ) != undefined ){
							counts_success_learning_task = ArrayCount(arrSuccessLearningTask)
						}
						break;
					case 40: // Количество просроченных назначений заданий

						/*
							Количество просроченных назначений заданий – количество назначений данного задания, выполнение которых было просрочено.
							Для статусов Назначен, В работе, Просмотрен, Оценивается назначенное задание просрочено, если поле @Планируемая дата завершения заполнено@ и значение в нем меньше текущей даты.
							Для статусов Пройден, Не пройден назначенное задание просрочено, если включен флажок Просрочено.
						*/

						if(bLearningTasks)
						{
							sQuery = "for $elem in learning_task_results where MatchSome( $elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + ")) and MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('assign', 'process', 'viewed', 'evaluation')) return $elem"
						} else {
							sQuery = "for $elem in learning_task_results where MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('assign', 'process', 'viewed', 'evaluation')) return $elem"
						}

						arrExpiredLearningTasks = tools.xquery(sQuery)

						for (oExpiredLearningTask in arrExpiredLearningTasks)
						{
							if (oExpiredLearningTask.plan_end_date.HasValue){
								plan_end_date = DateToRawSeconds(oExpiredLearningTask.plan_end_date.Value)
								cur_date = DateToRawSeconds(Date())
								if(cur_date > plan_end_date) counts_expired_learning_task++
							}
						}

						if(bLearningTasks)
						{
							sQuery = "for $elem in learning_task_results where MatchSome( $elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + ")) and MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('success', 'failed')) and $elem/expired = true() return $elem"
						} else {
							sQuery = "for $elem in learning_task_results where MatchSome($elem/learning_task_id, (" + oLearningTask.id.Value + ")) and MatchSome($elem/status_id, ('success', 'failed')) and $elem/expired = true() return $elem"
						}

						arrExpiredLearningTasks = tools.xquery(sQuery)

						if ( ArrayOptFirstElem( arrExpiredLearningTasks ) != undefined ){
							counts_expired_learning_task += ArrayCount(arrExpiredLearningTasks)
						}

						break;
					case 50: // Дата последнего назначения задания
						if (oLearningTask.start_date.HasValue){
							date_assignment = oLearningTask.start_date.Value
						}
						break;
				}
			}
		}

		if(counts_expired_learning_task == 0)
			counts_expired_learning_task = null

		oRes.result.push({
			id: oLearningTask.id.Value,
			code: oLearningTask.code.Value,
			name: oLearningTask.name.Value,
			desc: HtmlToPlainText(docLearningTaskTE.desc.Value), // описание
			comment: docLearningTaskTE.comment.Value, // комментарий
			counts_all_learning_task: counts_all_learning_task, // Общее количество назначений задания – количество всех назначений данного задания с любым статусом, кроме Отменен.
			counts_active_learning_task: counts_active_learning_task, // Количество активных назначений задания – количество назначений данного задания со статусами Назначен, В работе, Просмотрен, Оценивается.
			counts_success_learning_task: counts_success_learning_task, // Количество завершенных назначений задания – количество назначений данного задания со статусами Пройден, Не пройден.
			counts_expired_learning_task: counts_expired_learning_task, // Количество просроченных назначений заданий – количество назначений данного задания, выполнение которых было просрочено. Для статусов Назначен, В работе, Просмотрен, Оценивается назначенное задание просрочено, если поле Планируемая дата завершения заполнено и значение в нем меньше текущей даты. Для статусов Пройден, Не пройден назначенное задание просрочено, если включен флажок Просрочено.
			date_assignment: date_assignment // Дата последнего назначения задания – наибольшая дата создания назначения задания с любым статусом по этому заданию.
		});
	}

	return oRes;
}

/**
 * @function DeleteTypicalDevelopmentProgram
 * @author IG
 * @description Удаление типовых программ развития
 * @param {number[]} arrObjectIDs - список ID типовых программ развития
 * @returns {WTLPECountResult}
*/
function DeleteTypicalDevelopmentProgram( arrObjectIDs ){
	var oRes = tools.get_code_library_result_object();
		oRes.count = 0;

	if(!IsArray(arrObjectIDs))
	{
		oRes.error = 501; // Invalid param
		oRes.errorText = i18n.t( 'argumentarrobj' );
		return oRes;
	}

	iCount = 0;
	iCountObjectIDs = ArrayCount( arrObjectIDs );

	try
	{
		if(iCountObjectIDs == 0)
			throw i18n.t( 'peredavaemyeda_1' )
	}
	catch (err)
	{
		oRes.error = 501; // Invalid param
		oRes.errorText = "{ text: '" + err + "', param_name: 'arrObjectIDs' }";
		return oRes;
	}

	try
	{
		if (ArrayOptFirstElem(arrObjectIDs) != undefined)
		{
			for( iObjectID in arrObjectIDs )
			try
			{
				iObjectID = OptInt( iObjectID );
				docObject = tools.open_doc( iObjectID );
				if( docObject == undefined )
				{
					continue;
				}
				
				sCond = "and MatchSome( $elem/requirement_object_id, ( " + iObjectID + " ) )"
				queryObjectRequirements = "for $elem in object_requirements where MatchSome( $elem/requirement_type, ( 'typical_development_program' ) ) and MatchSome( $elem/object_type, ( 'position_common' ) ) " + sCond + " return $elem"
				docObjectRequirements = tools.xquery( queryObjectRequirements );

				if(ArrayOptFirstElem(docObjectRequirements) == undefined){
					DeleteDoc( UrlFromDocID( iObjectID ) );
					oRes.count++;
				}
				else
				{
					oRes.errorText = i18n.t( "udalitnevozmozhno" );
				}
			}
			catch( ex )
			{
				alert( "main_library.js DeleteTypicalDevelopmentPrograms " + ex );
			}
		}
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.errorText = "ERROR: " + err;
	}

	return oRes;
}

/**
 * @typedef {Object} ExclusionReasonDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
*/
/**
 * @function ExclusionReasonDelete
 * @memberof Websoft.WT.Main
 * @description Удаление оснований для исключения (exclusion_reason)
 * @param {bigint[]} arrRequestIDs - Массив ID оснований для исключения, подлежащих удалению
 * @returns {ExclusionReasonDeleteResult}
*/
function ExclusionReasonDelete( arrObjectIDs )
{
	var oRes = tools.get_code_library_result_object();
	oRes.ObjectDeletedCount = 0;

	if(!IsArray(arrObjectIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrObjectIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "exclusion_reason")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_11' );
		return oRes;
	}

	var xarrPersonnelReserves = ArraySelectAll( tools.xquery("for $elem in personnel_reserves where MatchSome($elem/exclusion_reason_id, (" +  ArrayMerge( arrObjectIDs, "This", "," ) + ")) return $elem/Fields('exclusion_reason_id')") );

	for ( itemExclusionReasonID in arrObjectIDs )
	{
		try
		{
			iExclusionReasonID = OptInt(itemExclusionReasonID);
			if(iExclusionReasonID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			if ( ArrayOptFind( xarrPersonnelReserves, "OptInt(This.exclusion_reason_id.Value, 0) == iExclusionReasonID" ) != undefined )
			{
				continue;
			}
			
			/*
				Для каждого основания проверяется, используется ли он хотя бы в одной карточке кадрового резерва. 
				Если да, то оно пропускается, если нет – удаляется.
			*/
			DeleteDoc( UrlFromDocID( Int( iExclusionReasonID ) ) );
			oRes.ObjectDeletedCount++;
		}
		catch( err )
		{
			oRes.error = 504;
			oRes.errorText = err;
		}
	}

	return oRes;
}

/** @typedef {Object} oRequestApps
 * @property {string} url_photo
 * @property {string} person_fullname
 * @property {string} position_name
 * @property {string} subdivision_name
 * @property {string} org_name
 * @property {date} create_date
 * @property {date} close_date
 * @property {string} status
 * @property {string} workflow_state_name
 * @property {string} request_type
 * @property {string} object_type
 * @property {string} object_name
 * @property {bigint} object_id
*/
/**
 * @typedef {Object} ReturnRequestApps
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oRequestApps[]} array – Коллекция заявок.
*/
/**
 * @function GetRequestApps
 * @memberof Websoft.WT.Main
 * @author AKh
 * @description Получение списка заявок
 * @param {bigint} iCurUserID ID текущего пользователя.
 * @param {string} sAccessType Тип доступа: "admin"/"hr"/"expert"/"observer"/"auto"
 * @param {string} sApplication код приложения, по которому определяется доступ
 * @param {bigint} iCurApplicationID - ID приложения
 * @param {string} iReqTypeID - тип возвращаемых заявок
 * @param {string} sStates - статус заявок (Активная, Закрыта, Отклонена, Оплачена)
 * @param {string} sReturnData - возвращаемые данные
 * @param {string} sXQueryQual - строка для XQuery-фильтра
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnRequestApps}
*/
function GetRequestApps( iCurUserID, sAccessType, sApplication, iCurApplicationID, iReqTypeID, sStates, sReturnData, sXQueryQual, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	oRes.paging = oCollectionParams.paging;
	oRes.array = [];
	
	iCurUserID = OptInt( iCurUserID, 0);
	iReqTypeID = OptInt( iReqTypeID, null);

	arrFilters = oCollectionParams.filters;
	arrDistinct = oCollectionParams.distincts;
	
	if ( sXQueryQual == null || sXQueryQual == undefined )
		sXQueryQual = "";

	if ( sAccessType == null || sAccessType == undefined )
		sAccessType = "auto";

	if(sAccessType == "auto")
	{
		iApplicationID = OptInt(sApplication);
		if(iApplicationID != undefined)
		{
			sApplication = ''+ArrayOptFirstElem(tool.xquery("for $elem in applications where $elem/id = " + iApplicationID + " return $elem/Fields('code')"), {code: ""}).code;
		}
		var iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );

		if(iApplLevel >= 7)
		{
			sAccessType = "admin";
		}
		else if(iApplLevel >= 5)
		{
			sAccessType = "hr";
		}
		else if(iApplLevel >= 3)
		{
			sAccessType = "expert";
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
	
	if ( arrFilters != undefined && arrFilters != null && IsArray(arrFilters) )
	{
		for ( oFilter in arrFilters )
		{
			conds = [];
			if ( oFilter.type == 'search' )
			{
				if ( oFilter.value != '' )
				{
					sSearchCond = "doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )";
					sXQueryQual = ( sXQueryQual == "" ? sSearchCond : " and "+sSearchCond )
				}
			}
		}
	}
	
	var xarrCollabsIDs = [];
	var bLimitByApplLevel = false;
	switch(sAccessType)
	{
		case "hr":
			{
				arrBossType = [];
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

				if(ArrayOptFirstElem(arrBossType) == undefined)
				{
					arrBossType = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
				}

				xarrCollabsIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['func'], true, '', null, '', true, true, true, true, arrBossType, true ] );

				bLimitByApplLevel = true;
				break;
			}
		case "expert":
			{
				oRes.error = 501;
				oRes.errorText = i18n.t( 'otsutstvuyutpra' );
				return oRes;
				break;
			}
		case "observer":
			{
				xarrCollabsIDs = tools.call_code_library_method( "libMain", "get_subordinate_records", [ iCurUserID, ['fact','func'], true, '', null, '', true, true, true, true, [], true ] );
				bLimitByApplLevel = true;
				break;
			}
		case "reject":
			{
				oRes.error = 501;
				oRes.errorText = i18n.t( 'otsutstvuyutpra' );
				return oRes;
				break;
			}
	}

	if ( bLimitByApplLevel )
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and ");
		sXQueryQual += "MatchSome($elem/person_id, (" + ArrayMerge(xarrCollabsIDs, 'This', ',') + "))";
	}

	if ( iReqTypeID != null )
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and ");
		sXQueryQual += "$elem/request_type_id = " + iReqTypeID;
	}
	else
	{
		if ( OptInt(iCurApplicationID) != undefined )
		{
			teApplication = tools_app.get_cur_application(OptInt(iCurApplicationID));

			if (teApplication != null)
			{
				if ( teApplication.wvars.GetOptChildByKey( 'request_type' ) != undefined )
				{
					iReqTypeID = (OptInt( teApplication.wvars.GetOptChildByKey( 'request_type' ).value, 0 ));
					
					if (iReqTypeID != 0)
					{
						sXQueryQual += ( sXQueryQual == "" ? "" : " and ");
						sXQueryQual += "$elem/request_type_id = " + iReqTypeID;
					}
				}
			}
		}
		else
			return oRes;
	}
	
	if (sStates != '' || sStates != null)
	{
		sXQueryQual += ( sXQueryQual == "" ? "" : " and ");
		sXQueryQual += "MatchSome($elem/status_id, ('" + StrReplace(sStates, ";", "','") + "'))";
	}

	var sCondSort = "";
	if(ObjectType(oCollectionParams.sort) == 'JsObject' && !IsEmptyValue(oCollectionParams.sort.FIELD) )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		switch(sFieldName)
		{
			case "person_fullname":
			case "create_date":
			case "close_date":
			case "workflow_state_name":
			case "status":
			case "object_name":
				sCondSort = " order by $elem_qc/" + sFieldName;
		}
		sCondSort += (sCondSort != "" && StrUpperCase(oCollectionParams.sort.DIRECTION) == "DESC" ? " descending" : "")
	}
	
	var xarrRequests = tools.xquery("for $elem_qc in requests" + (sXQueryQual == "" ? "" : (" where " + StrReplace(sXQueryQual, "$elem/", "$elem_qc/"))) + sCondSort + " return $elem_qc");
	
	if( ArrayOptFirstElem( xarrRequests ) == undefined )
	{
		return oRes;
	}
	
	if(ObjectType(oCollectionParams.paging) == 'JsObject' && oCollectionParams.paging.SIZE != null)
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount(xarrRequests);
		oRes.paging = oCollectionParams.paging;
		xarrRequests = ArrayRange(xarrRequests, ( OptInt(oCollectionParams.paging.START_INDEX, 0) > 0 ? oCollectionParams.paging.START_INDEX : OptInt(oCollectionParams.paging.INDEX, 0) * oCollectionParams.paging.SIZE ), oCollectionParams.paging.SIZE);
	}

	for ( catRequest in xarrRequests )
	{
		oElem = new Object();
		oElem.SetProperty( 'id', catRequest.id.Value );
		
		if (StrContains(sReturnData, 'url_photo'))
		{
			pict_url = catRequest.person_id.OptForeignElem != undefined ? catRequest.person_id.ForeignElem.pict_url : '';
			oElem.SetProperty( 'url_photo', pict_url );
		}
		if (StrContains(sReturnData, 'person_fullname'))
		{
			oElem.SetProperty( 'person_fullname', catRequest.person_fullname );
		}
		if (StrContains(sReturnData, 'position'))
		{
			position_name = catRequest.person_id.OptForeignElem != undefined ? catRequest.person_id.ForeignElem.position_name : '';
			oElem.SetProperty( 'position_name', position_name );
		}
		if (StrContains(sReturnData, 'subdivision'))
		{
			subdivision_name = catRequest.person_id.OptForeignElem != undefined ? catRequest.person_id.ForeignElem.position_parent_name : '';
			oElem.SetProperty( 'subdivision_name', subdivision_name );
		}
		if (StrContains(sReturnData, 'org'))
		{
			org_name = catRequest.person_id.OptForeignElem != undefined ? catRequest.person_id.ForeignElem.org_name : '';
			oElem.SetProperty( 'org_name', org_name );
		}
		if (StrContains(sReturnData, 'create_date'))
		{
			oElem.SetProperty( 'create_date', catRequest.create_date );
		}
		if (StrContains(sReturnData, 'create_date'))
		{
			oElem.SetProperty( 'close_date', catRequest.close_date );
		}
		if (StrContains(sReturnData, 'status'))
		{
			status_name = ArrayOptFind(common.request_status_types, 'This.id == catRequest.status_id').name;
			oElem.SetProperty( 'status', status_name );
		}
		if (StrContains(sReturnData, 'workflow_state_name'))
		{
			workflow_state_name = catRequest.workflow_state_name.HasValue ? catRequest.workflow_state_name : '-';
			oElem.SetProperty( 'workflow_state_name', tools_web.get_cur_lng_name(workflow_state_name, 'ru') );
		}
		if (StrContains(sReturnData, 'request_type') && catRequest.request_type_id.HasValue)
		{
			oElem.SetProperty( 'request_type', catRequest.request_type_id.ForeignElem.name );
		}
		if (StrContains(sReturnData, 'object_type') && catRequest.type.HasValue)
		{
			object_type = ArrayOptFind(common.exchange_object_types, 'This.name == catRequest.type').title;
			oElem.SetProperty( 'object_type', object_type );
		}
		if (StrContains(sReturnData, 'object_name') && catRequest.object_name.HasValue)
		{
			oElem.SetProperty( 'object_name', catRequest.object_name );
		}
		if (StrContains(sReturnData, 'object_id') && catRequest.object_id.HasValue)
		{
			oElem.SetProperty( 'object_id', catRequest.object_id );
		}

		oRes.array.push(oElem);
	}
	
	return oRes;
}

/**
 * @typedef {Object} ReturnHasObjectInRole
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {boolean} result – признак наличия других объектов в категориях объекта.
*/
/**
 * @function HasObjectInRole
 * @memberof Websoft.WT.Main
 * @author BG
 * @description Получение признака наличия других объектов в категориях объекта
 * @param {bigint} iObjectIDParam ID текущего объекта.
 * @returns {ReturnHasObjectInRole}
*/
function HasObjectInRole(iObjectIDParam)
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = false;
	try
	{
		var iObjectID = OptInt(iObjectIDParam);
		if(iObjectID == undefined)
			throw StrReplace(i18n.t( 'neukazankorrek' ), "{PARAM1}", iObjectIDParam);
		
		var docObject = tools.open_doc(iObjectID);
		if(docObject == undefined)
			throw StrReplace(i18n.t( 'nenaydenobektp' ), "{PARAM1}", iObjectID);
		
		var sCatalog = docObject.TopElem.Name;
		
		if(ArrayOptFirstElem(docObject.TopElem.role_id) == undefined)
			return oRes;
		
		var sReq = "for $elem in " + sCatalog + "s where MatchSome($elem/role_id, (" + ArrayMerge(docObject.TopElem.role_id, "This.Value", ",") + ")) and $elem/id != " + iObjectID + " return $elem";
		
		oRes.result = (ArrayOptFirstElem(tools.xquery(sReq)) != undefined)
	}
	catch(err)
	{
		oRes.error = 501;
		oRes.errorText = "ERROR: libMain: HasObjectInRole: " + err;
		return oRes;
	}
	
	return oRes;
}


/**
 * @typedef {Object} oObjectInSameRole
 * @property {number} id 
 * @property {string} name – Наименование
 * @property {string} image_url – Ссылка на аватарку объекта
 * @property {string} link – Ссылка на карточку объекта
 * @property {string} comment – Комментарий к объекту
 * @property {string} desc – Описание объекта
*/
/**
 * @typedef {Object} ReturnObjectsInSameRole
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oObjectInSameRole[]} array – коллекция объектов в категории.
*/
/**
 * @function GetObjectsInSameRole
 * @memberof Websoft.WT.Main
 * @author BG
 * @description Получение объектов из той же категории, что и указанный
 * @param {bigint} iObjectIDParam ID текущего объекта.
 * @param {boolean} bAndSelf ID текущего объекта.
 * @param {number} iMaxQuantity Максимальное общее количество отдаваемых записей.
 * @param {oCollectionParam} oCollectionParams - Набор интерактивных параметров (отбор, сортировка, пейджинг)
 * @returns {ReturnObjectsInSameRole}
*/
function GetObjectsInSameRole(iObjectIDParam, bAndSelf, iMaxQuantity, oCollectionParams)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	try
	{
		var iObjectID = OptInt(iObjectIDParam);
		if(iObjectID == undefined)
			throw StrReplace(i18n.t( 'neukazankorrek' ), "{PARAM1}", iObjectIDParam);
		
		var docObject = tools.open_doc(iObjectID);
		if(docObject == undefined)
			throw StrReplace(i18n.t( 'nenaydenobektp' ), "{PARAM1}", iObjectID);
		
		var sCatalog = docObject.TopElem.Name;
		
		if(ArrayOptFirstElem(docObject.TopElem.role_id) == undefined)
			return oRes;
		
		var aConds = [];
		
		aConds.push("MatchSome($elem/role_id, (" + ArrayMerge(docObject.TopElem.role_id, "This.Value", ",") + "))");
		
		if(!tools_web.is_true(bAndSelf))
		{
			aConds.push("$elem/id != " + iObjectID);
		}
		
		if ( oCollectionParams.filters != undefined && oCollectionParams.filters != null && IsArray(oCollectionParams.filters) )
		{
			for ( oFilter in oCollectionParams.filters )
			{
				if ( oFilter.type == 'search' )
				{
					if ( oFilter.value != '' )
					{
						aConds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
					}
				}
			}
		}
		
		var sConds = ArrayOptFirstElem(aConds) != undefined ? " where " + ArrayMerge(aConds, "This", " and ") : "";
		var sReq = "for $elem in " + sCatalog + "s " + sConds + " return $elem";

		var xmCatalogParam = common.exchange_object_types.GetOptChildByKey( sCatalog );
		var sNameField = xmCatalogParam.disp_name.Value;
		
		iMaxQuantity = OptInt(iMaxQuantity);
		
		if(iMaxQuantity != undefined)
			var aObjects = ArrayRange(tools.xquery(sReq), 0, iMaxQuantity);
		else
			var aObjects = tools.xquery(sReq);
		
		var objRes, sObjectImageUrl, docObj;
		for(oItem in aObjects)
		{
			docObj = tools.open_doc(oItem.id.Value);
			if(oItem.ChildExists( 'resource_id' ))
			{
				if(oItem.resource_id.HasValue)
					sObjectImageUrl = tools_web.get_object_source_url( 'resource', oItem.resource_id );
				else 
					sObjectImageUrl = '/images/' + sCatalog + '.png';
			}
			else
			{
				if(docObj != undefined && docObj.TopElem.resource_id.HasValue)
					sObjectImageUrl = tools_web.get_object_source_url( 'resource', docObj.TopElem.resource_id );
				else
					sObjectImageUrl = '/images/' + sCatalog + '.png';
			}
			
			objRes = {
				id: oItem.id.Value,
				name: RValue(oItem.Child(sNameField)),
				image_url: sObjectImageUrl,
				link: tools_web.get_mode_clean_url( null, oItem.id.Value )
			};
			
			
			if(docObj != undefined)
			{
				objRes.comment = docObj.TopElem.ChildExists( 'comment' ) ? docObj.TopElem.comment.Value : "";
				objRes.desc = docObj.TopElem.ChildExists( 'desc' ) ? docObj.TopElem.desc.Value : "";
			}
			
			oRes.array.push(objRes);
		}
	}
	catch(err)
	{
		oRes.error = 501;
		oRes.errorText = "ERROR: libMain: GetObjectsInSameRole: " + err;
		return oRes;
	}
	
	return oRes;
}


/** @typedef {Object} oHighEffectivenessPas
 * @property {bigint} person_id
 * @property {bigint} pa_id
*/
/**
 * @typedef {Object} ReturnHighEffectivenessPas
 * @property {number} error – Код ошибки.
 * @property {string} errorText – Текст ошибки.
 * @property {oHighEffectivenessPas[]} array – массив пользователей и анкет.
*/
/**
 * @function GetHighEffectivenessPas
 * @memberof Websoft.WT.Main
 * @author AKh
 * @description Получение анкет для вычисления эффективности сотрудников
 * @param {bigint[]} arrPersonsIDs - массив ID сотрудников
 * @param {bigint[]} arrAssessmentAppraiseIDs - массив ID процедур оценки
 * @param {bool} bLevelIgnore - не учитывать значение уровня эффективности DefaultHighEffectivenessLevel из параметров библиотеки
 * @returns {ReturnHighEffectivenessPas}
*/
function GetHighEffectivenessPas( arrPersonsIDs, arrAssessmentAppraiseIDs, bLevelIgnore )
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	var conds = "";
	var libParam = tools.get_params_code_library('libMain');
	var iHighEffectivenessLevel = 0;
	
	if (!tools_web.is_true(bLevelIgnore))
	{
		iHighEffectivenessLevel = OptInt(libParam.GetOptProperty("DefaultHighEffectivenessLevel", 80), 80);
	}
	
	var arrAssessmentAppraiseTypes = tools_web.parse_multiple_parameter( libParam.GetOptProperty("sDefaultAssessmentAppraiseTypes", "[]"));
	var sSelfStatus = libParam.GetOptProperty("sSelfStatus", "all");
	var bIsDone = tools_web.is_true(libParam.GetOptProperty("bIsDone", false));
	
	if(!IsArray(arrAssessmentAppraiseTypes) || ArrayOptFirstElem(arrAssessmentAppraiseTypes) == undefined)
			arrAssessmentAppraiseTypes = ['activity_appraisal'];
	
	if(!IsArray(arrPersonsIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}
		
	var catCheckCollaborator = ArrayOptFirstElem(ArraySelect(arrPersonsIDs, "OptInt(This) != undefined"))
	if(catCheckCollaborator == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivesotrud' );
		return oRes;
	}

	var docCollaborator = tools.open_doc(Int(catCheckCollaborator));
	if(docCollaborator == undefined || docCollaborator.TopElem.Name != "collaborator")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_9' );
		return oRes;
	}

	if ( !IsArray(arrAssessmentAppraiseIDs) || ArrayOptFirstElem(arrAssessmentAppraiseIDs) == undefined )
	{
		arrAssessmentAppraiseIDs = get_assessment_appraise_for_high_effectiveness();
	}
	
	if (sSelfStatus == "self")
	{
		conds = " and $elem/status = 'self'";
	}
	else if (sSelfStatus == "manager")
	{
		conds = " and $elem/status = 'manager'";
	}
	
	if(bIsDone)
		conds += " and $elem/is_done = true()"
		
	
	sReqPas = "for $elem in pas where MatchSome($elem/assessment_appraise_id, (" + ArrayMerge(arrAssessmentAppraiseIDs, 'This', ',') + ")) and MatchSome($elem/assessment_appraise_type, (" + ArrayMerge(arrAssessmentAppraiseTypes, "XQueryLiteral(This)", ',') + ") ) and $elem/appraise_date != null() and $elem/overall >= " + StrRealFixed(iHighEffectivenessLevel, 2) + conds + " return $elem";
	xarrPas = tools.xquery(sReqPas);
	
	if (ArrayOptFirstElem(xarrPas) != undefined)
	{
		for(_user in arrPersonsIDs)
		{
			arrPas = ArraySelect(xarrPas, 'This.person_id.Value == OptInt(_user, 0)');
			if (ArrayOptFirstElem(arrPas) == undefined)
			{
				obj = {
					"person_id": _user,
					"pa_id": null
				}
			}
			else
			{
				lastUserPA = ArrayMax(arrPas, 'appraise_date');
				obj = {
					"person_id": _user,
					"pa_id": lastUserPA.id.Value
				}
				
			}
			oRes.array.push(obj);
		}
	}
	
	return oRes;
}


function get_assessment_appraise_for_high_effectiveness()
{
	var arrAssessmentAppraiseIDs = [];
	var conds = "";
	var libParam = tools.get_params_code_library('libMain');
	var iEffectivenessPeriod = OptInt(libParam.GetOptProperty("EffectivenessPeriod", 365), 365);
	var sAssessmentStatus = libParam.GetOptProperty("sAssessmentStatus", 'finish');
	
	if (sAssessmentStatus == "finish")
	{
		conds = " and $elem/status = '1'";
	}
	if (sAssessmentStatus == "active_finish")
	{
		conds = " and ($elem/status = '0' or $elem/status = '1')";
	}

	sReqAssessments = "for $elem in assessment_appraises where $elem/end_date > " + XQueryLiteral(DateOffset(Date(), (0-iEffectivenessPeriod)*86400)) + conds +" return $elem";
	xarrAssessments = tools.xquery(sReqAssessments);
	
	if (ArrayOptFirstElem(xarrAssessments) != undefined)
		arrAssessmentAppraiseIDs = ArrayExtract(xarrAssessments, 'This.id.Value');
		
	return arrAssessmentAppraiseIDs;

}

function GetRandomString( iCountCharString, sCharStr, iMinCountChar, iMinCountNumber, iMinCountTitleChar, iMinCountSpecial )
{
	/*
		iCountCharString	- общая длина
		sCharStr		 	- строка символов для выбора
		iMinCountChar 		- минимальное кол-во маленьких букв
		iMinCountNumber 	- минимальное кол-во цифр
		iMinCountTitleChar	- минимальное кол-во заглавных букв
		iMinCountSpecial	- минимальное кол-во спец. символов
	
	*/
	var oRes = tools.get_code_library_result_object();
	oRes.random_string = "";
	
	iCountCharString = OptInt( iCountCharString );
	if( iCountCharString == undefined )
	{
		return oRes;
	}
	
	try
	{
		if( sCharStr == null || sCharStr == undefined || sCharStr == "" )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		sCharStr = null;
	}
	
	var arr_chars = [
		{ "type": "char", "str": "qwertyuipasdfghjkzxcvbnm", "min_count": OptInt( iMinCountChar, 0 ) },
		{ "type": "number", "str": "0123456789", "min_count": OptInt( iMinCountNumber, 0 ) },
		{ "type": "title", "str": "QWERTYUPASDFGHJKLZXCVBNM", "min_count": OptInt( iMinCountTitleChar, 0 ) },
		{ "type": "special", "str": "!@#$%^&*_+-=?", "min_count": OptInt( iMinCountSpecial, 0 ) }
	]
	arr_chars = ArraySelect( arr_chars, "This.min_count > 0" );
	
	var sAllStr = sCharStr != null ? sCharStr : "qwertyuipasdfghjkzxcvbnm0123456789QWERTYUPASDFGHJKLZXCVBNM!@#$%^&*_+-=?";
	
	var sActiveStr, catElemChars, _ind;
	for( var i = 0; i < iCountCharString; i++ )
	{
		if( ( Random( 0, 1 ) == 0 || ArraySum( arr_chars, "This.min_count" ) >= ( iCountCharString - i + 1 ) ) && ArrayOptFind( arr_chars, "This.min_count > 0" ) != undefined )
		{
			catElemChars = arr_chars[ Random( 0, ArrayCount( arr_chars ) - 1 ) ];
			sActiveStr = catElemChars.str;
			catElemChars.min_count--;
			arr_chars = ArraySelect( arr_chars, "This.min_count > 0" );
		}
		else
		{
			sActiveStr = sAllStr;
		}
		_ind = Random( 0, StrLen( sActiveStr ) - 1 );
		oRes.random_string += sActiveStr.slice( _ind, _ind + 1 );
	}
	
	return oRes;
}


/**
 * @typedef {Object} RequestDeleteResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {integer} count – количество удаленных записей
*/
/**
 * @function RequestDelete
 * @memberof Websoft.WT.Main
 * @description Удаление заявок
 * @param {bigint[]} arrRequestIDs - Массив ID заявок, подлежащих удалению
 * @returns {WTLPECountResult}
*/
function RequestDelete( arrRequestIDs ){

	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;

	if(!IsArray(arrRequestIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}
	
	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrRequestIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}
	
	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "request")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'dannyeneyavlyayut' );
		return oRes;
	}

	for(iRequestID in arrRequestIDs)
	{
		try
		{
			sSQL = "for $elem in requests where contains( $elem/id, ('" + XQueryLiteral(iRequestID) + "') ) return $elem"
		
			oRequestObject = ArrayOptFirstElem(tools.xquery(sSQL));
			
			if(oRequestObject == undefined)
				continue;

			DeleteDoc(UrlFromDocID(OptInt(iRequestID)), false);
			oRes.count++;
		}
		catch(err)
		{
			toLog("ERROR: RequestDelete: " + ("[" + iRequestID + "]\r\n") + err, true);
		}
	}

	return oRes;
}

function get_snils_str( sSnils )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	oRes.snils_str = "";
	
	sSnils = StrReplace( StrReplace( sSnils, " ", "" ), "-", "" );
	// if( OptInt( sSnils ) == undefined || StrLen( sSnils ) != 11 )
	// {
		// oRes.error = 1;
		// oRes.errorText = i18n.t( 'nekorrektnyysn' );
		// return oRes;
	// }
	try
	{
		validateSnils(sSnils)
	}
	catch(err)
	{
		var oErr = tools.parse_throw_error(err);
		oRes.error = oErr.error;
		var oSplitErrText = tools.split_errortext(oErr.errorText);
		oRes.errorText = oSplitErrText.user;
		return oRes;
	}
	
	sSnils = '' + sSnils;
	oRes.snils_str = StrRangePos( sSnils, 0, 3 ) + "-" + StrRangePos( sSnils, 3, 6 ) + "-" + StrRangePos( sSnils, 6, 9 ) + " " + StrRangePos( sSnils, 9, 11 );
	
	return oRes;
}

function validateSnils(SNILS)
{
	var result = false;
	if (DataType(SNILS) == 'integer')
	{
		SNILS = ''+SNILS;
	}
	else if (DataType(SNILS) !== 'string')
	{
		SNILS = '';
	}

	if (SNILS == '')
		throw '1::' + i18n.t( 'nekorrektnyysn1' );

	else if (OptInt(SNILS) == undefined)
	{
		throw '2::' + i18n.t( 'nekorrektnyysn2' );
	} 
	else if (StrLen(SNILS) !== 11)
	{
		throw '3::' + i18n.t( 'nekorrektnyysn3' );
	}
	else
	{
		var sum = 0;
		var arrDigitSnils = StrToCharArray(SNILS);
		for (var i = 0; i < 9; i++)
		{
			sum += Int(arrDigitSnils[i]) * (9 - i);
		}
		
		var checkDigit = 0;
		if (sum < 100)
		{
			checkDigit = sum;
		}
		else if (sum > 101)
		{
			checkDigit = Int(sum % 101);
			if (checkDigit == 100)
			{
				checkDigit = 0;
			}
		}
		
		if (StrEnds(SNILS, checkDigit))
		{
			result = true;
		}
		else
			throw '4::' + i18n.t( 'nekorrektnyysn4' );
	}
	return result;
}

function check_email_value( sText )
{
	oRegExp = tools.get_object_assembly( 'RegExp' );
	oRegExp.Global = true;
	oRegExp.IgnoreCase = true;
	oRegExp.MultiLine = false;
	oRegExp.Pattern = String( "^[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$" );
	oMatches = oRegExp.Execute( sText );
	if ( oMatches.Count == 0 )
	{
		return false;
	}
	return true;
}

function GetLastPersonAssessment( iPersonIDParam, sAssessmentAppraiseType )
{	
	var arrConds = new Array();
	
	if(!IsEmptyValue(sAssessmentAppraiseType))
	{
		arrConds.push("$elem/assessment_appraise_type = " + XQueryLiteral(sAssessmentAppraiseType));
	}
	
	var sConds = (ArrayOptFirstElem(arrConds) != undefined) ? " and " + ArrayMerge(arrConds, "This", " and ") : "";
	
	sReqPas = "for $elem in pas where $elem/person_id = " + iPersonIDParam + sConds + " return $elem";
	xarrPas = tools.xquery(sReqPas);
	
	if (ArrayOptFirstElem(xarrPas) == undefined)
		return null;
	
	sReqAssessments = "for $elem in assessment_appraises where $elem/status = '1' and MatchSome($elem/id, (" + ArrayMerge(xarrPas, 'This.assessment_appraise_id', ',') + ")) order by $elem/end_date descending return $elem";

	xarrAssessments = tools.xquery(sReqAssessments);
	
	if (ArrayOptFirstElem(xarrAssessments) == undefined)
		return null;
	
	return ArrayOptFirstElem(xarrAssessments);
}

function GetCurrentPersonAssessment( iPersonIDParam, sAssessmentAppraiseType )
{	
	var arrConds = new Array();
	
	if(!IsEmptyValue(sAssessmentAppraiseType))
	{
		arrConds.push("$elem/assessment_appraise_type = " + XQueryLiteral(sAssessmentAppraiseType));
	}
	
	var sConds = (ArrayOptFirstElem(arrConds) != undefined) ? " and " + ArrayMerge(arrConds, "This", " and ") : "";
	
	sReqPas = "for $elem in pas where $elem/person_id = " + iPersonIDParam + sConds + " return $elem";
	xarrPas = tools.xquery(sReqPas);
	
	if (ArrayOptFirstElem(xarrPas) == undefined)
		return null;
	
	sReqAssessments = "for $elem in assessment_appraises where $elem/status = '0' and MatchSome($elem/id, (" + ArrayMerge(xarrPas, 'This.assessment_appraise_id', ',') + ")) and $elem/end_date > " + XQueryLiteral(Date()) + " order by $elem/end_date descending return $elem";
	xarrAssessments = tools.xquery(sReqAssessments);
	
	if (ArrayOptFirstElem(xarrAssessments) == undefined)
		return null;
	
	oCurrentPersonAssessment = ArrayOptFirstElem(xarrAssessments);
	sApprTypeName = common.assessment_appraise_types.GetOptChildByKey(sAssessmentAppraiseType) != undefined ? common.assessment_appraise_types.GetOptChildByKey(sAssessmentAppraiseType).name : '';
	
	obj = {
		"id": oCurrentPersonAssessment.PrimaryKey,
		"start_date": oCurrentPersonAssessment.start_date.Value,
		"end_date": oCurrentPersonAssessment.end_date.Value,
		"assessment_appraise_type": sApprTypeName,
		"name": oCurrentPersonAssessment.name.Value,
	}
	
	return obj;
}

/**
 * @typedef {Object} RoleCreateChangeResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {bigint} role_id – id созданной категории
*/
/**
 * @function RoleCreateChange
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Создание / изменение категории
 * @param {bigint} iRoleID - ID категории для изменения
 * @param {bigint} iParentRoleID - ID родительской категории
 * @param {string} sTargetCatalog - название целевого каталога категории
 * @param {string} sName - название категории
 * @param {string} sCode - код категории
 * @param {bigint} iResourceId - ID ресурса изображения
 * @param {bigint[]} arrExpertIDs - массив ID экспертов
 * @param {string} sComment - текст комментария
 * @param {string} sDesc - текст описания
 * @returns {RoleCreateChangeResult}
*/
function RoleCreateChange( iRoleID, iParentRoleID, sTargetCatalog, sName, sCode, iResourceId, arrExpertIDs, sComment, sDesc )
{
	var oRes = tools.get_code_library_result_object();
	oRes.role_id = 0;

	iRoleID = OptInt(iRoleID);
	iParentRoleID = OptInt(iParentRoleID);
	if (DataType(sName) != 'string')
	{
		sName = null;
	}
	if (DataType(sCode) != 'string')
	{
		sCode = null;
	}
	iResourceId = OptInt(iResourceId);
	if (arrExpertIDs == null || arrExpertIDs == undefined || !IsArray(arrExpertIDs))
	{
		arrExpertIDs = [];
	}
	if (DataType(sComment) != 'string')
	{
		sComment = null;
	}
	if (DataType(sDesc) != 'string')
	{
		sDesc = null;
	}

	if ( iRoleID == undefined)
	{
		docRole = OpenNewDoc( 'x-local://qti/qti_role.xmd' );
		docRole.BindToDb();
		if (iParentRoleID != undefined)
		{
			docParentRole = tools.open_doc(iParentRoleID);
			if (docParentRole == undefined || docParentRole.TopElem.Name != 'role')
			{
				oRes.error = 502;
				oRes.errorText = i18n.t( 'peredannyyidne_1' )+iParentRoleID;
				
				return oRes;
			}
			docRole.TopElem.parent_role_id = iParentRoleID
		}
		oCatalog = common.exchange_object_types.GetOptChildByKey(sTargetCatalog);
		if (oCatalog == undefined)
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'peredanonekorr' )+sTargetCatalog;
			return oRes;
		}
		docRole.TopElem.catalog_name = sTargetCatalog;
		oRes.role_id = docRole.DocID;
	}
	else
	{
		docRole = tools.open_doc(iRoleID);
		if (docRole == undefined || docRole.TopElem.Name != 'role')
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'peredannyyidne_1' )+iRoleID;
			return oRes;
		}
	}

	teRole = docRole.TopElem;
	if (sName != null)
	{
		teRole.name = sName;
	}
	if (sCode != null)
	{
		teRole.code = sCode;
	}
	for (iExpertID in arrExpertIDs)
	{
		iExpertID = OptInt(iExpertID);
		if (iExpertID == undefined)
		{
			continue;
		}
		teRole.experts.ObtainChildByKey(iExpertID);
	}
	if (sComment != null)
	{
		teRole.comment = sComment;
	}
	if (iResourceId != undefined)
	{
		teRole.resource_id = iResourceId;
	}
	if (sDesc != null)
	{
		teRole.desc = sDesc;
	}
	docRole.Save();
	
	return oRes;
}

/**
 * @typedef {Object} CategoryAddResult
 * @memberof Websoft.WT.Main
 * @property {integer} error – код ошибки
 * @property {string} errorText – текст ошибки
 * @property {string} category_id – id созданной категории
*/
/**
 * @function CategoryAdd
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Добавляет категорию (в list categorys)
 * @param {string} sId - id категории
 * @param {string} sName - название категории
 * @returns {CategoryAddResult}
 */
function CategoryAdd(sId, sName)
{
	var oRes = tools.get_code_library_result_object();
	oRes.category_id = "";

	if (DataType(sName) != 'string')
	{
		sName = "";
	}
	if (DataType(sId) != 'string')
	{
		sId = "";
	}
	if (sId == "")
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'neperedanidkate' );
		return oRes;
	}

	ListElem = categorys.AddChild();
	ListElem.PrimaryKey.Value = sId;
	ListElem.name = sName;
	ms_tools.obtain_shared_list_elem('categorys', ListElem.PrimaryKey, ListElem);
	oRes.category_id = sId;

	return oRes;
}

/**
 * @function SetObjectRole
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Отнесение объекта к категории
 * @param {bigint} iObjectId - id объекта
 * @param {bigint} iRoleId - id категории
 * @param {string} sSetRole - режим отнесения: "replace" (Только одна категория (добавить в заданную и удалить из остальных)) / "add" (Несколько категорий (только добавить в заданную категорию))
 * @returns {oSimpleResult}
 */
function SetObjectRole(iObjectId, iRoleId, sSetRole)
{
	var oRes = tools.get_code_library_result_object();

	iObjectId = OptInt(iObjectId);
	docObject = tools.open_doc(iObjectId);
	if (docObject == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre' );
		return oRes;
	}
	teObject = docObject.TopElem;
	iRoleIdParam = iRoleId;
	iRoleId = OptInt(iRoleId);
	if (iRoleId == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'peredannyyidne_1' )+iRoleIdParam;
		return oRes;
	}
	if (DataType(sSetRole) != 'string')
	{
		sSetRole = '';
	}

	try
	{
		if (sSetRole == "replace")
		{
			teObject.role_id.Clear();
		}
		if (sSetRole == "replace" || sSetRole == 'add')
		{
			teObject.role_id.ObtainByValue(iRoleId);
		}
		docObject.Save();
	}
	catch (err)
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'katalognepodder' );
	}

	return oRes;
}

/**
 * @function SetCollaboratorCategory
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Установка категории у сотрудника
 * @param {bigint} iCollId - id сотрудника
 * @param {string} sId - id категории
 * @param {string} sSetRole - режим отнесения: "replace" (Только одна категория (добавить в заданную и удалить из остальных)) / "add" (Несколько категорий (только добавить в заданную категорию))
 * @returns {oSimpleResult}
 */
function SetCollaboratorCategory(iCollId, sId, sSetRole)
{
	var oRes = tools.get_code_library_result_object();

	iCollIdParam = iCollId;
	iCollId = OptInt(iCollId);
	docColl = tools.open_doc(iCollId);
	if (docColl == undefined)
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'peredannekorre_3' )+": "+iCollIdParam;
		return oRes;
	}
	teColl = docColl.TopElem;
	if (teColl.Name != 'collaborator')
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'peredannekorre_3' )+": "+iCollIdParam;
		return oRes;
	}
	if (DataType(sId) != 'string')
	{
		sId = "";
	}
	if (sId == "")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'neperedanidkate' );
		return oRes;
	}

	if (sSetRole == "replace")
	{
		teColl.category_id.Clear();
	}
	if (sSetRole == "replace" || sSetRole == 'add')
	{
		teColl.category_id.ObtainByValue(sId);
	}

	docColl.Save();

	return oRes;
}

/**
 * @function RoleDelete
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Удаление категорий
 * @param {bigint[]} arrRoleIDs - массив ID категорий
 * @returns {WTLPECountResult}
 */
function RoleDelete(arrRoleIDs)
{
	var oRes = tools.get_code_library_result_object();
	oRes.count = 0;
	
	if(!IsArray(arrRoleIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrRoleIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "role")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_12' );
		return oRes;
	}

	var xarrChildRoles = ArraySelectAll( tools.xquery("for $elem in roles where MatchSome($elem/parent_role_id, (" +  ArrayMerge( arrRoleIDs, "OptInt(This, 0)", "," ) + ")) order by $elem/parent_role_id return $elem/Fields('parent_role_id')") );
	var xarrRolesCatalogNames = ArraySelectAll( tools.xquery("for $elem in roles where MatchSome($elem/id, (" +  ArrayMerge( arrRoleIDs, "OptInt(This, 0)", "," ) + ")) order by $elem/id return $elem/Fields('id','catalog_name')") );
	var xarrObjectsWithRoles = [];

	for ( itemRoleID in arrRoleIDs )
	{
		try
		{
			iRoleID = OptInt(itemRoleID);
			if(iRoleID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			if ( ArrayOptFindBySortedKey( xarrChildRoles, iRoleID, "parent_role_id"  ) != undefined )
			{
				continue;
			}

			oCatalogName = ArrayOptFindBySortedKey(xarrRolesCatalogNames, iRoleID, "id");
			if (oCatalogName != undefined)
			{
				sCatalogName = oCatalogName.catalog_name.Value;
				try
				{
					xarrObjectsWithRoles = tools.xquery("for $elem in " + sCatalogName + "s where $elem/role_id = " + XQueryLiteral(iRoleID) + " return $elem/Fields('id')");
				}
				catch( err )
				{
					throw i18n.t( 'nekorrektnoezna' )+iRoleID;
				}
	
				if ( ArrayOptFirstElem(xarrObjectsWithRoles) != undefined)
				{
					continue;
				}
			}

			DeleteDoc( UrlFromDocID( Int( iRoleID ) ) );
			oRes.count++;
		}
		catch( err )
		{
			oRes.error = 504;
			oRes.errorText = ''+err;
		}
	}

	return oRes;
}

/**
 * @function RoleMoveToUp
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Делает категории родительскими
 * @param {bigint[]} arrRoleIDs - массив ID категорий
 * @returns {oSimpleResult}
 */
function RoleMoveToUp(arrRoleIDs)
{
	var oRes = tools.get_code_library_result_object();

	if(!IsArray(arrRoleIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrRoleIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "role")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_12' );
		return oRes;
	}

	for ( itemRoleID in arrRoleIDs )
	{
		try
		{
			iRoleID = OptInt(itemRoleID);
			if(iRoleID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			docRole = tools.open_doc(itemRoleID);
			if (docRole == undefined)
			{
				continue;
			}

			docRole.TopElem.parent_role_id.Clear();
			docRole.Save();
		}
		catch( err )
		{
			oRes.error = 504;
			oRes.errorText = ''+err;
		}
	}

	return oRes;
}

/**
 * @function RoleToRole
 * @memberof Websoft.WT.Main
 * @author EO
 * @description Установка родительской категории для категорий
 * @param {bigint[]} arrRoleIDs - массив ID категорий
 * @param {bigint} iParentRoleID - ID категории
 * @returns {oSimpleResult}
 */
function RoleToRole( arrRoleIDs, iParentRoleID)
{
	var oRes = tools.get_code_library_result_object();

	if(!IsArray(arrRoleIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	var catCheckObject = ArrayOptFirstElem(ArraySelect(arrRoleIDs, "OptInt(This) != undefined"))
	if(catCheckObject == undefined)
	{
		oRes.error = 502;
		oRes.errorText = i18n.t( 'vmassivenetnio' );
		return oRes;
	}

	var docObj = tools.open_doc(Int(catCheckObject));
	if(docObj == undefined || docObj.TopElem.Name != "role")
	{
		oRes.error = 503;
		oRes.errorText = i18n.t( 'massivneyavlyaet_12' );
		return oRes;
	}

	docObj = tools.open_doc(OptInt(iParentRoleID, 0));
	if(docObj == undefined || docObj.TopElem.Name != "role")
	{
		oRes.error = 504;
		oRes.errorText = i18n.t( 'peredannyyidne_1' )+iParentRoleID;
		return oRes;
	}
	iParentRoleID = OptInt(iParentRoleID);

	for ( itemRoleID in arrRoleIDs )
	{

		try
		{
			iRoleID = OptInt(itemRoleID);
			if(iRoleID == undefined)
			{
				throw i18n.t( 'elementmassiva' );
			}

			docRole = tools.open_doc(itemRoleID);
			if (docRole == undefined)
			{
				continue;
			}

			docRole.TopElem.parent_role_id = iParentRoleID;
			docRole.Save();
		}
		catch( err )
		{
			oRes.error = 505;
			oRes.errorText = ''+err;
		}

	}

	return oRes;
}

function GetPeriodData( sType, dStartDate, dFinishDate )
{
	var oRes = { start_period_date: "", finish_period_date: "" };

	try
	{
		switch( sType )
		{
			case "week":
			case "month":
			case "day":
			case "year":
			case "quarter":
			case "halfyear":
			case "period":
				break;
			default:
				throw "error";
		}
	}
	catch( ex )
	{
		sType = "month";
	}
	
	dStartDate = OptDate( dStartDate, Date() );
	dFinishDate = OptDate( dFinishDate, Date() );
	switch( sType )
	{
		case "week":
			var iWeekDay = WeekDay( dStartDate )
			if( iWeekDay != 1 )
			{
				dStartDate = DateOffset( dStartDate, ( 0 - 86400*( iWeekDay == 0 ? 6 : ( iWeekDay - 1 ) ) ) );
			}
			oRes.start_previous_period_date = DateNewTime( DateOffset( dStartDate, -7*86400 ), 0, 0, 0 );
			oRes.start_period_date = DateNewTime( dStartDate, 0, 0, 0 );
			oRes.finish_period_date = DateNewTime( DateOffset( dStartDate, 7*86400 ), 0, 0, 0 );
			break;
		case "month":
			var iMonth = Month( dStartDate );
			var iYear = Year( dStartDate );
			if( Day( dStartDate ) != 1 )
			{
				dStartDate = Date( iYear, iMonth, 1 )
			}
			oRes.start_previous_period_date = DateNewTime( Date( ( iMonth == 1 ? ( iYear - 1 ) : iYear ) , ( iMonth == 1 ? 12 : ( iMonth - 1 ) ), 1 ), 0, 0, 0 );
			oRes.start_period_date = DateNewTime( dStartDate, 0, 0, 0 );
			oRes.finish_period_date = DateNewTime( Date( ( iMonth == 12 ? ( iYear + 1 ) : iYear ) , ( iMonth == 12 ? 1 : ( iMonth + 1 ) ), 1 ), 0, 0, 0 );
			break;
		case "year":
			var iYear = Year( dStartDate );
			if( Day( dStartDate ) != 1 )
			{
				dStartDate = Date( iYear, 1, 1 );
			}
			oRes.start_previous_period_date = DateNewTime( Date( iYear - 1, 1, 1 ), 0, 0, 0 );
			oRes.start_period_date = DateNewTime( dStartDate, 0, 0, 0 );
			oRes.finish_period_date = DateNewTime( Date( iYear + 1, 1, 1 ), 0, 0, 0 );
			break;
		case "quarter":
			var iYear = Year( dStartDate );
			var iMonth = Month( dStartDate );
			switch( iMonth )
			{
				case 1:
				case 2:
				case 3:
					oRes.start_previous_period_date = DateNewTime( Date( iYear-1, 10, 1 ), 0, 0, 0 );
					oRes.start_period_date = DateNewTime( Date( iYear, 1, 1 ), 0, 0, 0 );
					oRes.finish_period_date = DateNewTime( Date( iYear, 4, 1 ), 0, 0, 0 );
					break;
				case 4:
				case 5:
				case 6:
					oRes.start_previous_period_date = DateNewTime( Date( iYear, 1, 1 ), 0, 0, 0 );
					oRes.start_period_date = DateNewTime( Date( iYear, 4, 1 ), 0, 0, 0 );
					oRes.finish_period_date = DateNewTime( Date( iYear, 7, 1 ), 0, 0, 0 );
					break;
				case 7:
				case 8:
				case 9:
					oRes.start_previous_period_date = DateNewTime( Date( iYear, 4, 1 ), 0, 0, 0 );
					oRes.start_period_date = DateNewTime( Date( iYear, 7, 1 ), 0, 0, 0 );
					oRes.finish_period_date = DateNewTime( Date( iYear, 10, 1 ), 0, 0, 0 );
					break;
				case 10:
				case 11:
				case 12:
					oRes.start_previous_period_date = DateNewTime( Date( iYear, 7, 1 ), 0, 0, 0 );
					oRes.start_period_date = DateNewTime( Date( iYear, 10, 1 ), 0, 0, 0 );
					oRes.finish_period_date = DateNewTime( Date( iYear + 1, 1, 1 ), 0, 0, 0 );
					break;
			}
			break;
		case "halfyear":
			var iYear = Year( dStartDate );
			var iMonth = Month( dStartDate );
			if(iMonth < 7)
			{
				oRes.start_previous_period_date = DateNewTime( Date(iYear-1, 7, 1), 0, 0, 0 );
				oRes.start_period_date = DateNewTime( Date(iYear, 1, 1), 0, 0, 0 );
				oRes.finish_period_date = DateNewTime( Date(iYear, 7, 1), 0, 0, 0 );
			}
			else
			{
				oRes.start_previous_period_date = DateNewTime( Date(iYear, 1, 1), 0, 0, 0 ) ;
				oRes.start_period_date = DateNewTime(Date(iYear, 7, 1), 0, 0, 0 );
				oRes.finish_period_date = DateNewTime( Date(iYear+1, 1, 1), 0, 0, 0 );
			}
			break;
		case "period":
			oRes.start_previous_period_date = null;
			oRes.start_period_date = DateNewTime( dStartDate, 0, 0, 0 );
			oRes.finish_period_date = DateNewTime( dFinishDate, 23, 59, 59 );
			break;
		case "day":
			oRes.start_previous_period_date = DateOffset( dStartDate, -86400 );
			oRes.start_period_date = DateNewTime( dStartDate, 0, 0, 0 );
			oRes.finish_period_date = DateOffset( dStartDate, 86400 );
			break;
	}

	return oRes;
}

function lp_check_form_fields_files( oFormFields )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.errorText = "";
	var arrNotUploadFiles = new Array();
	var _field;
	if( IsArray( oFormFields ) )
	{
		for( _field in oFormFields )
		{
			switch(  _field.type )
			{
				case "file":
				{
					if( OptInt( _field.GetOptProperty( "error" ), 0 ) != 0 )
					{
						arrNotUploadFiles.push( _field.value );
					}
					break;
				}
				case "array":
				{
					for( _el_array in _field.value )
					{
						for( _el_field_array in _el_array )
						{
							if( _el_field_array.type == "file_field_name" && OptInt( _el_field_array.GetOptProperty( "error" ), 0 ) != 0 )
							{
								arrNotUploadFiles.push( _el_field_array.value );
							}
						}
					}
				}
			}			
		}
	}
	if( ArrayOptFirstElem( arrNotUploadFiles ) != undefined )
	{
		oRes.error = 1;
		oRes.errorText = StrReplace( "Файлы {PARAM1} не были загружены в связи с политикой безопасности. Проверьте формат, размер и названия файлов.", "{PARAM1}", ArrayMerge( arrNotUploadFiles, "This", "," ) );
	}
	return oRes
}

function GetNotificationTemplates( sID, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	oRes.result = [];
	
	if ( oCollectionParams == undefined )
	{
		oCollectionParams = {};
	}
	
	oRes.paging = oCollectionParams.GetOptProperty( "paging", ({}) );
	
	try
	{
		_codeStr = ArrayOptFirstElem(sID) != undefined ? ArrayMerge( sID, "XQueryLiteral(This)", "," ) : "";
		
		var arrFilters = [];
		if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
		{
			arrFilters = ArrayUnion( arrFilters, oCollectionParams.filters );
		}
		else if ( oCollectionParams.HasProperty("filters") && DataType( oCollectionParams.filters ) == "string" )
		{
			arrFilters.push( { "type": "filter", "value": oCollectionParams.filters } );
		}
		
		if ( oCollectionParams.HasProperty("fulltext") && oCollectionParams.fulltext != "" )
		{
			arrFilters.push( { "type": "search", "value": oCollectionParams.fulltext } );
		}

		var conds = [];
		for ( oFilter in arrFilters )
		{
			if ( oFilter.type == 'search' && oFilter.value != '' )
			{
				conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
			}
			else if ( oFilter.type == 'filter' && oFilter.value != '' )
			{
				conds.push( oFilter.value );
			}
		}
	
		var sSortCond = "";
		if ( oCollectionParams.HasProperty( "sort" ) && ObjectType( oCollectionParams.sort ) == "JsObject" && !IsEmptyValue( oCollectionParams.sort.GetOptProperty( "FIELD" , "" ) ) )
		{
			var sFieldName = oCollectionParams.sort.FIELD;
			switch(sFieldName)
			{
				case "id":
					sSortCond = " order by $elem/id"
					break;
				case "code":
					sSortCond = " order by $elem/code"
					break;
				case "name":
					sSortCond = " order by $elem/name"
					break;
			}
			if(sSortCond != "" && oCollectionParams.sort.DIRECTION == "DESC")
				sSortCond += " descending";
		}
		
		
		_xqueryString = "for $elem in notification_templates " + ( _codeStr != "" ? " where MatchSome( $elem/code, (" + _codeStr + ") )" : "" ) + ( ArrayOptFirstElem( conds ) != undefined ? " and " + ArrayMerge( conds, "This", " and " ) : "" ) + sSortCond + " return $elem/Fields('id', 'code','name')";
		result_object_array = XQuery(_xqueryString);
		
		if ( oCollectionParams.HasProperty( "paging" ) && ObjectType( oCollectionParams.paging ) == "JsObject" && !IsEmptyValue( oCollectionParams.paging.GetOptProperty( "SIZE" ) ) )
		{
			oCollectionParams.paging.MANUAL = true;
			oCollectionParams.paging.TOTAL = ArrayCount( result_object_array );
			oRes.paging = oCollectionParams.paging;
			result_object_array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ result_object_array, oCollectionParams.paging, null ] ).oResult;
		}

		result_object_array_modified = [];
		for( _elem in result_object_array )
		{
			_newElem = new Object;
			_newElem.AddProperty( "id", ""+_elem.id );
			_newElem.AddProperty( "code", ""+_elem.code );
			_newElem.AddProperty( "name", ""+_elem.name );
			result_object_array_modified.push(_newElem);
		}

		oRes.result = result_object_array_modified;
	}
	catch(err)
	{
		oRes.error = 1;
		oRes.errorText = err;
	}
	return oRes;
}

function GetObjectDatas( sType, sApplication, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	
	if ( oCollectionParams == undefined )
	{
		oCollectionParams = {};
	}
	
	oRes.paging = oCollectionParams.GetOptProperty( "paging", ({}) );
	
	oRes.result = [];
	_strFilter = '';
	try
	{
		if( sApplication != "" )
		{
			_application = ArrayOptFirstElem( XQuery( "for $elem in applications where $elem/code="+XQueryLiteral( sApplication )+" return $elem" ) );
			if( _application == undefined )
			{
				oRes.error = 1;
				oRes.errorText = "Приложение с указанным кодом не найдено";
				return oRes;
			}
			_strFilter = " where $elem/object_type='application' and $elem/object_id="+XQueryLiteral( _application.id );
		}
		else
		{
			_strFilter = sType != "" ? " where $elem/object_type="+XQueryLiteral(sType)+" " : "";
		}
		
		var arrFilters = [];
		if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
		{
			arrFilters = ArrayUnion( arrFilters, oCollectionParams.filters );
		}
		else if ( oCollectionParams.HasProperty("filters") && DataType( oCollectionParams.filters ) == "string" )
		{
			arrFilters.push( { "type": "filter", "value": oCollectionParams.filters } );
		}
		
		if ( oCollectionParams.HasProperty("fulltext") && oCollectionParams.fulltext != "" )
		{
			arrFilters.push( { "type": "search", "value": oCollectionParams.fulltext } );
		}

		var conds = [];
		for ( oFilter in arrFilters )
		{
			if ( oFilter.type == 'search' && oFilter.value != '' )
			{
				conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
			}
			else if ( oFilter.type == 'filter' && oFilter.value != '' )
			{
				conds.push( oFilter.value );
			}
		}
		
		var sSortCond = "";
		if ( oCollectionParams.HasProperty( "sort" ) && ObjectType( oCollectionParams.sort ) == "JsObject" && !IsEmptyValue( oCollectionParams.sort.GetOptProperty( "FIELD" , "" ) ) )
		{
			var sFieldName = oCollectionParams.sort.FIELD;
			switch(sFieldName)
			{
				case "id":
					sSortCond = " order by $elem/id"
					break;
				case "code":
					sSortCond = " order by $elem/code"
					break;
				case "name":
					sSortCond = " order by $elem/name"
					break;
				case "status":
					sSortCond = " order by ForeignElem( $elem/status_id )/name"
					break;
			}
			if(sSortCond != "" && oCollectionParams.sort.DIRECTION == "DESC")
				sSortCond += " descending";
		}
		
		_xqueryString = "for $elem in object_datas " + _strFilter + ( ArrayOptFirstElem( conds ) != undefined ? " and " + ArrayMerge( conds, "This", " and " ) : "" ) + sSortCond + " return $elem/Fields('id', 'code', 'name', 'status_id')";
		result_object_array = XQuery(_xqueryString);

		result_object_array_modified = [];
		for( _elem in result_object_array )
		{
			_newElem = new Object;
			_newElem.AddProperty( "id", ""+_elem.id );
			_newElem.AddProperty( "code", ""+_elem.code );
			_newElem.AddProperty( "name", ""+_elem.name );
			_newElem.AddProperty( "status", ( _elem.status_id.HasValue ? ( "" + _elem.status_id.ForeignElem.name ): "" ) );
			result_object_array_modified.push(_newElem);
		}

		oRes.result = result_object_array_modified;
	}
	catch(err)
	{
		oRes.error = 1;
		oRes.errorText = err;
	}
	return oRes;
}

function PaHintCreateChange( iObjectID, formFields, bIsNew, sApplication )
{
	var oRes = tools.get_code_library_result_object();

	sName = ArrayOptFind(formFields, 'This.name == "name"').value;
	sStatus = ArrayOptFind(formFields, 'This.name == "status"').value;
	sType = ArrayOptFind(formFields, 'This.name == "form"').value;
	sRole = ArrayOptFind(formFields, 'This.name == "role"').value;
	sDescription = ArrayOptFind(formFields, 'This.name == "desc"').value;

	_objectDataType = ArrayOptFirstElem(XQuery("for $elem in object_data_types where $elem/code='pa_hint' return$elem"));
	_objectDataTypeID = _objectDataType != undefined ? _objectDataType.id : null;

	_jsonObject = new Object;
	_jsonObject.AddProperty( "form", sType );
	_jsonObject.AddProperty( "role", sRole );

	if (tools_web.is_true(bIsNew))
	{
		var docObjectData = tools.new_doc_by_name('object_data');
		docObjectData.BindToDb();
	}
	else
	{
		var docObjectData = tools.open_doc(iObjectID);
		if (docObjectData == undefined)
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'oshibkaotkrytiya_2' );
			return oRes;
		}
	}

	var teObjectData = docObjectData.TopElem;
	teObjectData.name = sName;
	teObjectData.code = sStatus;
	teObjectData.object_data_type_id = _objectDataTypeID;
	teObjectData.data_str = tools.object_to_text( _jsonObject, 'json' );
	teObjectData.desc = sDescription;

	if( sApplication != "" )
	{
		teObjectData.object_type = "application";
		_application = ArrayOptFirstElem(XQuery("for $elem in applications where $elem/code="+XQueryLiteral(sApplication)+" return $elem"));
		if( _application != undefined )
		{
			teObjectData.object_id = _application.id;
			teObjectData.object_name = _application.name;
		}
		else
		{
			teObjectData.object_id = null;
			teObjectData.object_name = null;
		}
	}

	docObjectData.Save();
	return oRes;
}
function GetSubstitutionTypes( _codeArray, sApplication, oCollectionParams )
{
	var oRes = tools.get_code_library_result_object();
	
	if ( oCollectionParams == undefined )
	{
		oCollectionParams = {};
	}
	
	oRes.paging = oCollectionParams.GetOptProperty( "paging", ({}) );

	_strFilter = "";
	if ( !IsEmptyValue( sApplication ) )
	{
		var _application = ArrayOptFirstElem( tools.xquery( "for $elem in applications where $elem/code=" + XQueryLiteral( sApplication ) + " return $elem" ) );
		if( _application != undefined )
		{
			var _applicationDoc =  OpenDoc( UrlFromDocID( _application.id ) );
			if ( _strFilter == "" )
			{
				_strFilter = " where ";
			}
			else
			{
				_strFilter += " and ";
			}
			_strFilter += "$elem/app_instance_id = '" + tools_app.get_str_app_instance_id( _applicationDoc.TopElem.id.Value ) + "'";
		}
	}
	if( ArrayCount( _codeArray ) != 0 )
	{
		if ( _strFilter == "" )
		{
			_strFilter = " where ";
		}
		else
		{
			_strFilter += " and ";
		}
		_strFilter += "( " + ArrayMerge( _codeArray, '"contains( $elem/operation_codes, "+XQueryLiteral( This )+" )"', " or " ) + " )";
	}
	
	var arrFilters = [];
	if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
	{
		arrFilters = ArrayUnion( arrFilters, oCollectionParams.filters );
	}
	else if ( oCollectionParams.HasProperty("filters") && DataType( oCollectionParams.filters ) == "string" )
	{
		arrFilters.push( { "type": "filter", "value": oCollectionParams.filters } );
	}
	
	if ( oCollectionParams.HasProperty("fulltext") && oCollectionParams.fulltext != "" )
	{
		arrFilters.push( { "type": "search", "value": oCollectionParams.fulltext } );
	}

	var conds = [];
    for ( oFilter in arrFilters )
	{
		if ( oFilter.type == 'search' && oFilter.value != '' )
		{
			conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
		}
		else if ( oFilter.type == 'filter' && oFilter.value != '' )
		{
			conds.push( oFilter.value );
		}
	}
	
	var sSortCond = "";
	if ( oCollectionParams.HasProperty( "sort" ) && ObjectType( oCollectionParams.sort ) == "JsObject" && !IsEmptyValue( oCollectionParams.sort.GetOptProperty( "FIELD" , "" ) ) )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		switch(sFieldName)
		{
			case "id":
				sSortCond = " order by $elem/id"
				break;
			case "code":
				sSortCond = " order by $elem/code"
				break;
			case "status":
				sSortCond = " order by ForeignElem( $elem/status )/name"
				break;
			case "name":
				sSortCond = " order by $elem/name"
				break;
		}
		if(sSortCond != "" && oCollectionParams.sort.DIRECTION == "DESC")
			sSortCond += " descending";
	}

	_xqueryString = "for $elem in substitution_types " + _strFilter + ( ArrayOptFirstElem( conds ) != undefined ? " and " + ArrayMerge( conds, "This", " and " ) : "" ) + sSortCond + " return $elem/Fields('id', 'code', 'name', 'is_active')";
	result_object_array = tools.xquery(_xqueryString);
	
	if ( oCollectionParams.HasProperty( "paging" ) && ObjectType( oCollectionParams.paging ) == "JsObject" && !IsEmptyValue( oCollectionParams.paging.GetOptProperty( "SIZE" ) ) )
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount( result_object_array );
		oRes.paging = oCollectionParams.paging;
		result_object_array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ result_object_array, oCollectionParams.paging, null ] ).oResult;
	}
	
	result_object_array_modified = [];
	for( _elem in result_object_array )
	{
		_newElem = new Object;
		_newElem.AddProperty( "id", ""+_elem.id );
		_newElem.AddProperty( "code", ""+_elem.code );
		_newElem.AddProperty( "name", ""+_elem.name );
		_newElem.AddProperty( "is_active", _elem.is_active ? "Да" : "Нет" );
		result_object_array_modified.push(_newElem);
	}
	oRes.result = result_object_array_modified;

	return oRes;
}

function GetSubstitutions( _substitutionTypes, _stateArray, oCollectionParams, sApplication, iCurUserID )
{
	var oRes = tools.get_code_library_result_object();
	
	if ( oCollectionParams == undefined )
	{
		oCollectionParams = {};
	}
	
	oRes.paging = oCollectionParams.GetOptProperty( "paging", ({}) );

	_strStatesFilter = "";
	if( ArrayOptFirstElem(_stateArray) != undefined )
	{
		_strStatesFilter = " MatchSome( $elem/status, (" + ArrayMerge( _stateArray, "XQueryLiteral(This)", "," ) + ") ) ";
	}
	else
	{
		oRes.result = [];
		return oRes;
	}

	_strTypesFilter = "";
	if( ArrayOptFirstElem(_substitutionTypes) != undefined )
	{
		_strTypesFilter = " and MatchSome( $elem/substitution_type_id, (" + ArrayMerge( _substitutionTypes, "XQueryLiteral(OptInt(This.id))", "," ) + ") ) ";
	}

	var arrFilters = [];
	if ( oCollectionParams.HasProperty("filters") && IsArray( oCollectionParams.filters ) )
	{
		arrFilters = ArrayUnion( arrFilters, oCollectionParams.filters );
	}
	else if ( oCollectionParams.HasProperty("filters") && DataType( oCollectionParams.filters ) == "string" )
	{
		arrFilters.push( { "type": "filter", "value": oCollectionParams.filters } );
	}
	
	if ( oCollectionParams.HasProperty("fulltext") && oCollectionParams.fulltext != "" )
	{
		arrFilters.push( { "type": "search", "value": oCollectionParams.fulltext } );
	}

	var conds = [];
    for ( oFilter in arrFilters )
	{
		if ( oFilter.type == 'search' && oFilter.value != '' )
		{
			conds.push("doc-contains( $elem/id, '" + DefaultDb + "'," + XQueryLiteral( oFilter.value ) + " )");
		}
		else if ( oFilter.type == 'filter' && oFilter.value != '' )
		{
			conds.push( oFilter.value );
		}
	}
	
	var iApplLevel = null;
	
	if ( !IsEmptyValue( sApplication ) )
	{
		iApplLevel = tools.call_code_library_method( "libApplication", "GetPersonApplicationAccessLevel", [ iCurUserID, sApplication ] );
		if ( iApplLevel < 7 )
		{
			var arrSubID = tools.call_code_library_method( "libAssessment", "GetFMSubsByBossTypes", [ iCurUserID, iApplLevel, tools_app.get_application( sApplication ) ] );
			if ( ArrayOptFirstElem( arrSubID ) == undefined )
			{
				conds.push( "1=2" );
			}
			else
			{
				conds.push( "$elem/object_type = 'collaborator' and some $coll in collaborators satisfies ( $elem/object_id = $coll/id and MatchSome( $coll/position_parent_id, ( " + ArrayMerge( arrSubID, "XQueryLiteral( OptInt( This, 0 ) ) ", "," ) + " ) ) )" );
			}
		}
	}
	
	var sSortCond = "";
	if ( oCollectionParams.HasProperty( "sort" ) && ObjectType( oCollectionParams.sort ) == "JsObject" && !IsEmptyValue( oCollectionParams.sort.GetOptProperty( "FIELD" , "" ) ) )
	{
		var sFieldName = oCollectionParams.sort.FIELD;
		switch(sFieldName)
		{
			case "id":
				sSortCond = " order by $elem/id"
				break;
			case "code":
				sSortCond = " order by $elem/code"
				break;
			case "status":
				sSortCond = " order by ForeignElem( $elem/status )/name"
				break;
			case "substitution_type":
				sSortCond = " order by ForeignElem( $elem/substitution_type_id )/name"
				break;
			case "object_id":
				sSortCond = " order by $elem/object_name"
				break;
			case "person_id":
				sSortCond = " order by ForeignElem( $elem/person_id )/fullname"
				break;
			case "start_date":
				sSortCond = " order by $elem/start_date"
				break;
			case "finish_date":
				sSortCond = " order by $elem/finish_date"
				break;
		}
		if(sSortCond != "" && oCollectionParams.sort.DIRECTION == "DESC")
			sSortCond += " descending";
	}

	_xqueryString = "for $elem in substitutions where " + _strStatesFilter + _strTypesFilter + ( ArrayOptFirstElem( conds ) != undefined ? " and " + ArrayMerge( conds, "This", " and " ) : "" ) + sSortCond + " return $elem";
	result_object_array = tools.xquery( _xqueryString );
	
	if ( oCollectionParams.HasProperty( "paging" ) && ObjectType( oCollectionParams.paging ) == "JsObject" && !IsEmptyValue( oCollectionParams.paging.GetOptProperty( "SIZE" ) ) )
	{
		oCollectionParams.paging.MANUAL = true;
		oCollectionParams.paging.TOTAL = ArrayCount( result_object_array );
		oRes.paging = oCollectionParams.paging;
		result_object_array = tools.call_code_library_method( 'libMain', 'select_page_sort_params', [ result_object_array, oCollectionParams.paging, null ] ).oResult;
	}

	result_object_array_modified = [];
	for( _elem in result_object_array )
	{
		_teElem = OpenDoc(UrlFromDocID(_elem.id)).TopElem;
		_newElem = new Object;
		_newElem.AddProperty( "id", ""+_elem.id );
		_newElem.AddProperty( "code", ""+_elem.code );
		_newElem.AddProperty( "status", ""+ArrayOptFindByKey( common.substitution_status_types, _elem.status, "id" ).name  );
		_newElem.AddProperty( "substitution_type", ""+_teElem.substitution_type_id.ForeignElem.name );
		_newElem.AddProperty( "object_id", _elem.object_id.HasValue ? ""+_teElem.object_id.ForeignElem.fullname : "Все участники" );
		_newElem.AddProperty( "person_id", ""+_teElem.person_id.ForeignElem.fullname );
		_newElem.AddProperty( "start_date", ""+_elem.start_date );
		_newElem.AddProperty( "finish_date", ""+_elem.finish_date );
		result_object_array_modified.push(_newElem);
	}

	oRes.result = result_object_array_modified;

	return oRes;
}

function SubstitutionTypeCreateChange( iObjectID, formFields, bIsNew, sApplication )
{
	var oRes = tools.get_code_library_result_object();

	sCode = ArrayOptFind(formFields, 'This.name == "code"').value;
	sName = ArrayOptFind(formFields, 'This.name == "name"').value;
	sObjectType = ArrayOptFind(formFields, 'This.name == "object_type"');
	if ( sObjectType != undefined )
	{
		sObjectType = sObjectType.value;
	}
	else
	{
		sObjectType = "";
	}
	sIsActive = ArrayOptFind(formFields, 'This.name == "is_active"');
	if ( sIsActive != undefined )
	{
		sIsActive = sIsActive.value;
	}
	else
	{
		sIsActive = "true";
	}
	sOperations = ArrayOptFind(formFields, 'This.name == "operations"');
	if ( sOperations != undefined )
	{
		sOperations = StrReplace(sOperations.value,";",",");
	}
	else
	{
		sOperations = "0";
	}
	sActions = ArrayOptFind(formFields, 'This.name == "actions"');
	if ( sActions != undefined )
	{
		sActions = StrReplace(sActions.value,";",",");
	}
	else
	{
		sActions = "0";
	}

	if (tools_web.is_true(bIsNew))
	{
		var docSubstitutionType = tools.new_doc_by_name('substitution_type');
		docSubstitutionType.BindToDb();
	}
	else
	{
		var docSubstitutionType = tools.open_doc(iObjectID);
		if (docSubstitutionType == undefined)
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'oshibkaotkrytiya_2' );
			return oRes;
		}
	}

	var teSubstitutionType = docSubstitutionType.TopElem;
	teSubstitutionType.name = sName;
	teSubstitutionType.code = sCode;
	teSubstitutionType.object_type = sObjectType;
	teSubstitutionType.is_active = tools_web.is_true( sIsActive );

	_operationsArray = tools.xquery("for $elem in operations where MatchSome( $elem/id, ( "+sOperations+" ) ) return $elem");
	teSubstitutionType.operations.Clear();
	for( _operation in _operationsArray )
	{
		_newOperation = teSubstitutionType.operations.AddChild();
		_newOperation.operation_id = _operation.id;
		_newOperation.operation_code = _operation.code;		
	}

	_actionsArray = tools.xquery("for $elem in operations where MatchSome( $elem/id, ( "+sActions+" ) ) return $elem");
	teSubstitutionType.remote_actions.Clear();
	for( _action in _actionsArray )
	{
		_newAction = teSubstitutionType.remote_actions.AddChild();
		_newAction.remote_action_id = _action.id;
		_newAction.remote_action_code = _action.code;
	}

	if( sApplication != "" )
	{
		_application = ArrayOptFirstElem( tools.xquery( "for $elem in applications where $elem/code=" + XQueryLiteral( sApplication ) + " return $elem" ) );
		if( _application != undefined )
		{
			_applicationDoc =  OpenDoc( UrlFromDocID( _application.id ) );
			teSubstitutionType.doc_info.creation.app_instance_id = tools_app.get_str_app_instance_id( _applicationDoc.TopElem.id.Value );
		}
	}

	docSubstitutionType.Save();
	return oRes;
}

function SubstitutionTypeDelete( arrObjectIDs )
{
	oRes = tools.get_code_library_result_object();
	oRes.count = 0;
	
	if(!IsArray(arrObjectIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	for(object_id in arrObjectIDs)
	{
		_iObjectId = OptInt(object_id);
		if (_iObjectId == undefined)
			continue;

		_objSubstitution = ArrayOptFirstElem( tools.xquery( "for $elem in substitutions where $elem/substitution_type_id="+XQueryLiteral(_iObjectId)+" return $elem" ) );
		if( _objSubstitution != undefined )
			continue;

		DeleteDoc( UrlFromDocID( OptInt(_iObjectId) ), false );
		oRes.count++;
	}
	return oRes;
}

function SubstitutionCreateChange( iObjectID, formFields, bIsNew, appCode, vars )
{
	var oRes = tools.get_code_library_result_object();

	sSubstitutionType = ArrayOptFind(formFields, 'This.name == "substitution_type"').value;
	docSubstitutionType = tools.open_doc(sSubstitutionType).TopElem;
	sStatus = ArrayOptFind(formFields, 'This.name == "status"').value;
	sCollaborator = ArrayOptFind(formFields, 'This.name == "collaborator"').value;
	docCollaborator = undefined;
	if ( OptInt( sCollaborator, 0 ) > 0 )
	{
		docCollaborator = tools.open_doc( sCollaborator ).TopElem;
	}
	sPerson = ArrayOptFind(formFields, 'This.name == "person"').value;
	docPerson = undefined;
	if ( OptInt( sPerson, 0 ) > 0 )
	{
		docPerson = tools.open_doc( sPerson ).TopElem;
	}
	sStartDate = ArrayOptFind(formFields, 'This.name == "start_date"').value;
	sFinishDate = ArrayOptFind(formFields, 'This.name == "finish_date"').value;

	var prevStatus = "";
	if (tools_web.is_true(bIsNew))
	{
		var docSubstitution = tools.new_doc_by_name('substitution');
		docSubstitution.BindToDb();
	}
	else
	{
		var docSubstitution = tools.open_doc(iObjectID);
		if (docSubstitution == undefined)
		{
			oRes.error = 502;
			oRes.errorText = i18n.t( 'oshibkaotkrytiya_2' );
			return oRes;
		}
		prevStatus = ""+docSubstitution.TopElem.status;
	}

	var teSubstitution = docSubstitution.TopElem;
	teSubstitution.status = sStatus;
	teSubstitution.substitution_type_id = docSubstitutionType.id;
	teSubstitution.target_object_type = docSubstitutionType.object_type;
	teSubstitution.create_date = Date();
	if ( docCollaborator != undefined )
	{
		teSubstitution.object_type = "collaborator";
		teSubstitution.object_id = docCollaborator.id;
		teSubstitution.object_name = docCollaborator.fullname;
	}
	if ( docPerson != undefined )
	{
		teSubstitution.person_selector = "person";
		teSubstitution.person_id = docPerson.id;
		teSubstitution.person_fullname = docPerson.fullname;
	}
	teSubstitution.start_date = OptDate( sStartDate );
	teSubstitution.finish_date = OptDate( sFinishDate );

	if( appCode != "" )
	{
		_application = ArrayOptFirstElem( tools.xquery( "for $elem in applications where $elem/code=" + XQueryLiteral( appCode ) + " return $elem" ) );
		if( _application != undefined )
		{
			_applicationDoc =  OpenDoc( UrlFromDocID( _application.id ) );
			teSubstitution.doc_info.creation.app_instance_id = tools_app.get_str_app_instance_id( _applicationDoc.TopElem.id.Value );
		}
	}

	if (tools_web.is_true(bIsNew))
    {
        _arrNotifyCreate = tools_web.parse_multiple_parameter( ArrayOptFindByKey( vars, "bNotificationCreate", "name" ).value.Value );
        for( notifyElem in _arrNotifyCreate )
        {
			_notificationTypeDoc = undefined;
            switch( notifyElem )
            {
                case 'person':
                    _notificationTypeDoc = OptInt( ArrayOptFindByKey( vars, "iNotificationCreatePerson", "name" ).value );
                    _recipientID = teSubstitution.person_id;
                break;

                case 'collaborator':
                    _notificationTypeDoc = OptInt( ArrayOptFindByKey( vars, "iNotificationCreateCollaborator", "name" ).value );
                    _recipientID = teSubstitution.object_id;
                break;
            }
            if( _notificationTypeDoc != undefined )
            {
                _objDocSec = {
                    substitution_type_name: ""+docSubstitutionType.name,
                    object_fullname: ""+teSubstitution.object_name,
                    person_fullname: ""+teSubstitution.person_fullname,
                    start_date: ""+sStartDate,
                    finish_date: ""+sFinishDate
                }
                tools.create_notification( _notificationTypeDoc, _recipientID, null, docSubstitution.DocID, null, docSubstitution.TopElem ) 
            }
        }
    }
    else if( sStatus != prevStatus )
    {
		_strNotifyChange = "" + ArrayOptFindByKey( vars, "bNotificationChangeState", "name" ).value;
        _arrNotifyChange = tools_web.parse_multiple_parameter( _strNotifyChange );
		for( notifyElem in _arrNotifyChange )
        {
            _notificationTypeDoc = undefined;
            switch( notifyElem )
            {
                case 'person':
                    _notificationTypeDoc = OptInt( ArrayOptFindByKey( vars, "iNotificationChangeStatePerson", "name" ).value );
                    _recipientID = teSubstitution.person_id;
                break;

                case 'collaborator':
                    _notificationTypeDoc = OptInt( ArrayOptFindByKey( vars, "iNotificationChangeStateCollaborator", "name" ).value );
                    _recipientID = teSubstitution.object_id;
                break;
            }

            if( _notificationTypeDoc != undefined )
            {
				sStatusReadable = ""+sStatus;
				objStatus = ArrayOptFindByKey( common.substitution_status_types, sStatus, "id" );
				if( objStatus != undefined )
				{
					sStatusReadable = objStatus.name;
				}
                _objDocSec = {
                    substitution_type_name: ""+docSubstitutionType.name,
                    object_fullname: ""+teSubstitution.object_name,
                    person_fullname: ""+teSubstitution.person_fullname,
                    state_name: ""+sStatusReadable
                }
                tools.create_notification( _notificationTypeDoc, _recipientID, null, docSubstitution.DocID, null, docSubstitution.TopElem )
            }
        }
    }

	docSubstitution.Save();
	return oRes;
}

function SubstitutionDelete( arrObjectIDs, vars )
{
	oRes = tools.get_code_library_result_object();
	oRes.count = 0;
	
	if(!IsArray(arrObjectIDs))
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkci' );
		return oRes;
	}

	_sNotificationChangeState = vars.GetOptProperty( "bNotificationDelete", "person" );

	bNotifyPerson = StrContains( _sNotificationChangeState, "person" ) ? true : false;
	_sNotificationPerson = OptInt( vars.GetOptProperty( "iNotificationDeletePerson", "" ), 0 );
															   
	bNotifyCollaborator = StrContains( _sNotificationChangeState, "collaborator" ) ? true : false;
	_sNotificationCollaborator = OptInt( vars.GetOptProperty( "iNotificationDeleteCollaborator", "" ), 0 );
	
	for(object_id in arrObjectIDs)
	{
		_iObjectId = OptInt(object_id);
		if (_iObjectId == undefined)
			continue;

		docSubstitution = tools.open_doc( _iObjectId );
		if ( docSubstitution == undefined )
		{
			continue;
		}
/*
		docSubstitutionType = docSubstitution.substitution_type_id.OptForeignElem
		if( docSubstitutionType != undefined )
		{
			_sSubstitutionTypeName = docSubstitutionType.name;
		}
		else
		{
			_sSubstitutionTypeName = tools.open_doc( docSubstitution.substitution_type_id ).TopElem.name;
		}
 
		objectDocSec = {
			person_fullname: ""+docSubstitution.person_fullname,
			object_fullname: ""+docSubstitution.object_name,
			substitution_type_name: ""+_sSubstitutionTypeName
		}
*/

		if( bNotifyPerson && _sNotificationPerson > 0 && docSubstitution.TopElem.person_id.HasValue )
		{
			tools.create_notification( _sNotificationPerson, docSubstitution.TopElem.person_id, null, _iObjectId, null, docSubstitution.TopElem );
		}

		if( bNotifyCollaborator && _sNotificationCollaborator > 0 && docSubstitution.TopElem.object_id.HasValue )
		{
			tools.create_notification( _sNotificationCollaborator, docSubstitution.TopElem.object_id, null, _iObjectId, null, docSubstitution.TopElem );
		}

		DeleteDoc( UrlFromDocID( _iObjectId ), false );
		oRes.count++;
	}
	return oRes;
}

function StrLongDate(dDate, bWOYear)
{
	bWOYear = tools_web.is_true(bWOYear);

	dDate = OptDate(dDate);

	if(dDate == undefined)
	{
		return "";
	}
	
	var catMonthGenitive = ArrayOptFindByKey(common.months, Month(dDate), 'number');

	if(catMonthGenitive == undefined)
	{
		return "";
	}
		
	return StrInt(Day(dDate), 2) + " " + catMonthGenitive.name_genitive.Value + (bWOYear ? "" : " " + StrInt(Year(dDate), 4));

}

function ParseConstructorAction(teRemoteAction, oParameters, oEnv)
{
	oRes = tools.get_code_library_result_object();
	oRes.data = "";

	function check_visibility_edit_conditions(oRemoteActionForm)
	{
		var aTmpTabs = [];
		for (_tab in oRemoteActionForm.tabs)
		{
			fldVisible = _tab.visibility_conditions_server;
			if (fldVisible == "" || tools_web.is_true(fldVisible))
			{
				aTmpTabs.push(_tab);
			}
		}
		oRemoteActionForm.tabs = aTmpTabs;

		var aTmpFields = [];
		for (_form_field in oRemoteActionForm.form_fields)
		{
			if (_form_field.GetOptProperty("tab") != undefined &&  ArrayOptFind(oRemoteActionForm.tabs, "This.id == _form_field.tab") == undefined)
			{
				continue;
			}
			fldEdit = _form_field.edit_conditions_server;
			if (fldEdit != "" && !tools_web.is_true(fldEdit))
			{
				_form_field.SetProperty("disabled", true)
			}

			fldVisible = _form_field.visibility_conditions_server;
			if (fldVisible == "" || tools_web.is_true(fldVisible))
			{
				aTmpFields.push(_form_field);
			}

		}
		oRemoteActionForm.form_fields = aTmpFields;

		return oRemoteActionForm;
	}

	if ( teRemoteAction.Name != "remote_action" )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'argumentfunkcii' );
		return oRes;
	}

	if( DataType(oParameters) != 'object' && ObjectType(oParameters) != 'JsObject'  )
	{
		oRes.error = 501;
		oRes.errorText = i18n.t( 'neperedanyparamentry' );
		return oRes;
	}

	try
	{
		var sCommand = oParameters.GetOptProperty("command", "eval");
		var iUserID = OptInt(oParameters.GetOptProperty("curUserID"));
		var iObjectID = OptInt(oParameters.GetOptProperty("curObjectID"));
		if (iObjectID == undefined)
		{
			var oItem = oParameters.GetOptProperty("_ITEM_");
			if (oItem != undefined)
			{
				var _vobj = ParseJson( oItem );
				iObjectID = OptInt(_vobj.GetOptProperty("id"), 0);
			}
		}

		var oActionData;
		var sFileUrl = teRemoteAction.url.Value;
		if ( sFileUrl != '' && ! IsAbsoluteUrlStr( teRemoteAction.url ) )
			sFileUrl = UrlAppendPath( global_settings.web_path, teRemoteAction.url );
	
		if ( sFileUrl == '' )
			oActionData = ParseJson(teRemoteAction.exec_code.code_text.Value);
		else
			oActionData = ParseJson(LoadUrlText(sFileUrl));

		switch (sCommand)
		{
			case "eval":
			{
				sPreprocessorCode = oActionData.GetOptProperty("preprocessor", "");
				if (sPreprocessorCode != "")
				{
					try
					{
						eval(sPreprocessorCode);
					}
					catch(ex)
					{
						throw ex;
						/* oRes.data = "RESULT = " + EncodeJson({
							command: "alert",
							msg: "Ошибка при выполнении программного кода предобработки", //TODO 018n
							confirm_result:{
								command: "reload_page"
							}
						}); */
					}
				}

				var aForms = oActionData.forms;
				var oForm = ArrayOptFirstElem(aForms); //TODO support multiple forms
				var aFormFields = oForm.form_fields;

				if (iObjectID != undefined)
				{
					var docObject = tools.open_doc(iObjectID);
					if (docObject == undefined)
					{
						oRes.error = 501;
						oRes.errorText = i18n.t( 'oshibkaotkrytiya' );
						return oRes;
					}
					
					for (_field in aFormFields)
					{
						if ( !_field.HasProperty("object_field") )
							continue;
		
						xmlElem = docObject.TopElem.OptChild(_field.object_field);
						if ( xmlElem != undefined )
						{
							if (!IsArray(xmlElem))
							{
								_field.value = docObject.TopElem.ChildValue(_field.object_field);
							}
							else
							{
								_field.value = ArrayMerge(xmlElem, "This.PrimaryKey", ";");
							}
						}
					}
				}
		
				var sFormText = EncodeJson(oForm);
				var oCacheData = {
					curUserID: iUserID,
					curObjectID: iObjectID,
					iParentObjectID: teRemoteAction.id.Value,
					param: oParameters,
					can_null_result: true,
					curEnv: oEnv
				}
				var oResText = tools.call_code_library_method( "libChat", "substitution_message_text_model_classif", [ sFormText, oCacheData, iUserID, iObjectID] );
				
				oRaFormData = ParseJson(HtmlToPlainText(oResText.result))
				oRaFormData = check_visibility_edit_conditions(oRaFormData);
				oRes.data = "RESULT = " + EncodeJson(oRaFormData);
				break;
			}
			case "submit_form":
			{
				var aFormFields = ParseJson(oParameters.GetOptProperty("form_fields", []));
				var sCatalogName = teRemoteAction.catalog_name.Value;
				
				if (iObjectID != undefined)
				{
					docObject = tools.open_doc(iObjectID);
					if (docObject == undefined)
					{
						oRes.error = 501;
						oRes.errorText = i18n.t( 'oshibkaotkrytiya' );
						return oRes;
					}
				}
				else
				{
					var xqCatalog = common.exchange_object_types.GetOptChildByKey(sCatalogName);
					docObject = OpenNewDoc(xqCatalog.form_url.Value);
					docObject.BindToDb( DefaultDb );
				}

				for (_field in aFormFields)
				{
					if ( !_field.HasProperty("object_field") )
						continue;
	
					xmlElem = docObject.TopElem.OptChild(_field.object_field);
					if ( xmlElem != undefined )
					{
						if (!IsArray(xmlElem))
						{
							xmlElem.Value = _field.value
						}
						else
						{
							aFldValues = tools_web.parse_multiple_parameter(_field.value);
							xmlElem.Clear();
							for (_val in aFldValues)
							{
								childElem = xmlElem.ObtainChildByKey(_val);
							}								;
						}
					}
				}
				docObject.Save();
				
				sPostCode = oActionData.GetOptProperty("postprocessor", "");
				if (sPostCode != "")
				{
					try{
						eval(sPostCode);
					}
					catch(ex)
					{
						throw ex;
						/* oRes.data = "RESULT = " + EncodeJson({
							command: "alert",
							msg: "Ошибка при выполнении программного кода постобработки", //TODO 018n
							confirm_result:{
								command: "reload_page"
							}
						}); */
					}
				}

				var oResult = oActionData.GetOptProperty("result", ({command: "reload_page"}));
				oRes.data = "RESULT = " + EncodeJson(oResult);
			}
		}		
	}
	catch(e)
	{
		oRes.error = 501;
		oRes.errorText = e;
		return oRes;
	}
		
	return oRes;
}

// ==================================================================================
// ========   Вычисления наборов данных отчетов (блок должен быть последним) ========
// ==================================================================================

function Report_SubdivWOSubdivGroup(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
			
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
	}

	var arrXQCond = [];

	if ( oParams.org_id != null )
		arrXQCond.push( '$elem/org_id = ' + oParams.org_id );

	if ( oParams.subdivision_id != null )
	{
		var sHierSubsIDs = ArrayMerge( tools.xquery( "for $elem in subs where IsHierChild( $elem/id, " + oParams.subdivision_id + " ) and $elem/type = 'subdivision' order by $elem/Hier() return $elem/id" ), "This.id", "," );
		arrXQCond.push( "MatchSome($elem/id, ( " + sHierSubsIDs + " ))" );
	}

	if ( !tools_web.is_true(oParams.include_disband) )
		arrXQCond.push( '$elem/is_disbanded != true()' );

	var sXQCond = ArrayOptFirstElem( arrXQCond ) != undefined ? ' where ' + ArrayMerge( arrXQCond, 'This', ' and ' ) : '';

	arrSubdivisions = XQuery( 'for $elem in subdivisions ' + sXQCond + ' return $elem' );

	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso' );
	tpProgress.ItemCount = ArrayCount( arrSubdivisions );
	tpProgress.CurrentItemIndex = 0;
	
	var arrSubdivInGroup = tools.xquery("for $elem in subdivision_group_subdivisions return $elem");
	
	var xmOrg;
	for ( catSubdiv in arrSubdivisions )
	{
		if ( ArrayOptFind(arrSubdivInGroup, "This.subdivision_id.Value == " + CodeLiteral(catSubdiv.id.Value)) != undefined )
		{
			continue;
		}

		tpProgress.CurrentItemName = catSubdiv.name;

		xmOrg = catSubdiv.org_id.OptForeignElem;
		oElem = {};
		oElem.id = catSubdiv.id.Value;
		oElem.name = catSubdiv.name.Value;
		oElem.org_id = catSubdiv.org_id.Value;
		oElem.org_name = (xmOrg != undefined ? xmOrg.name.Value : '');
		oElem.is_disband = catSubdiv.is_disbanded.Value;
		oRes.array.push( oElem );

		tpProgress.CurrentItemIndex++;
	}

	return oRes;
}

function Report_PositionCommonWOFamily(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}

	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}

	var arrXQCond = [];
	
	arrXQCond.push( '$elem/position_familys = null()')
	
	if ( oParams.HasProperty("arrStatuses") && oParams.arrStatuses != null && IsArray(oParams.arrStatuses) && ArrayOptFirstElem(oParams.arrStatuses) != undefined)
	{
		arrXQCond.push( "MatchSome($elem/status, ( " + ArrayMerge(oParams.arrStatuses, "XQueryLiteral(This)", ",") + " ))" );
	}

	if( oParams.GetOptProperty( 'APPLICATION', '' ) != '' )
	{
		var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, oParams.GetOptProperty( 'APPLICATION', '' ) ] );
		if ( iRoleLevel == 3 )
		{
			var catCurUserExpert = ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/person_id = " + xmCurUser.id.Value + " return $elem"));
			if(catCurUserExpert != undefined)
				arrXQCond.push( "contains($elem/experts, '" + catCurUserExpert.id.Value + "')" );
			else
				arrXQCond.push( "0 = 1" ) ;
		}
	}

	var sXQCond = ArrayOptFirstElem( arrXQCond ) != undefined ? ' where ' + ArrayMerge( arrXQCond, 'This', ' and ' ) : '';

//alert('for $elem in position_commons ' + sXQCond + ' return $elem')

	var arrPositionCommons = XQuery( 'for $elem in position_commons ' + sXQCond + ' return $elem' );
		
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_1' );
	tpProgress.ItemCount = ArrayCount( arrPositionCommons );
	tpProgress.CurrentItemIndex = 0;
	
	for ( catPC in arrPositionCommons )
	{
		tpProgress.CurrentItemName = catPC.name;

		oElem = {};
		oElem.id = catPC.id.Value;
		oElem.name = catPC.name.Value;
		oElem.status_id = catPC.status.Value;
		oElem.status_name = catPC.status.ForeignElem.name.Value;

		oRes.array.push( oElem );

		tpProgress.CurrentItemIndex++;
	}

	return oRes;
}

function Report_PositionWOPositionCommon(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
			
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
	}

	var arrXQCond = [];

	arrXQCond.push( '$elem/position_common_id = null()')

	if ( oParams.org_id != null )
		arrXQCond.push( '$elem/org_id = ' + oParams.org_id );

	if ( oParams.subdivision_id != null )
	{
		var sHierSubsIDs = ArrayMerge( tools.xquery( "for $elem in subs where IsHierChild( $elem/id, " + oParams.subdivision_id + " ) and $elem/type = 'subdivision' order by $elem/Hier() return $elem/id" ), "This.id", "," );
		arrXQCond.push( "MatchSome($elem/parent_object_id, ( " + sHierSubsIDs + " ))" );
	}
	var sXQCond = ArrayOptFirstElem( arrXQCond ) != undefined ? ' where ' + ArrayMerge( arrXQCond, 'This', ' and ' ) : '';

	var APPLICATION = oParams.GetOptProperty( 'APPLICATION', '' )
	if( APPLICATION != '' )
	{
		var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, APPLICATION ] );
		if ( iRoleLevel == 5 || iRoleLevel == 1)
		{
			var arrBossTypesID = [];
			if ( iRoleLevel == 5 )
			{
				var teApplication = tools_app.get_application(APPLICATION);
				if (teApplication != null)
				{
					if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
					{
						manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, null ));
						if (manager_type_id > 0)
							arrBossTypesID.push(manager_type_id);
					}
				}
				if(ArrayOptFirstElem(arrBossTypesID) == undefined)
				{
					arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
				}
			}
			arrPosition = get_subordinate_records(xmCurUser.id.Value, ['fact','func'], false, 'position', null, ArrayMerge( arrXQCond, 'This', ' and ' ), true, true, true, true, arrBossTypesID, true)			
		}
		else
		{
			arrPosition = XQuery( 'for $elem in positions ' + sXQCond + ' return $elem' );
		}
	}
	else
	{
		arrPosition = XQuery( 'for $elem in positions ' + sXQCond + ' return $elem' );
	}

	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_2' );
	tpProgress.ItemCount = ArrayCount( arrPosition );
	tpProgress.CurrentItemIndex = 0;
	
	var xmSubdivision
	for ( catPosition in arrPosition )
	{
		tpProgress.CurrentItemName = catPosition.name;
		
		xmSubdivision = catPosition.parent_object_id.OptForeignElem;
		oElem = {};
		oElem.id = catPosition.id.Value;
		oElem.name = catPosition.name.Value;
		oElem.subdivision_id = catPosition.parent_object_id.Value;
		oElem.subdivision_name = (xmSubdivision != undefined ? xmSubdivision.name.Value : '');
		oElem.person_id = catPosition.basic_collaborator_id.Value;
		oElem.person_name = catPosition.basic_collaborator_fullname.Value;
		oRes.array.push( oElem );

		tpProgress.CurrentItemIndex++;
	}

	return oRes;
}

function Report_ObjectsWOTypicalProgram(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}

	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}

	var arrXQCond = [];
	arrXQCond.push( "$elem/requirement_type = 'typical_development_program'")
	
	if ( oParams.HasProperty("arrTypes") && oParams.arrTypes != null && IsArray(oParams.arrTypes) && ArrayOptFirstElem(oParams.arrTypes) != undefined)
	{
		var arrTypes = ArrayExtract(oParams.arrTypes, "This");
	}
	else
	{
		var arrTypes = ["position_common", "position_family" ,"subdivision_group"]
	}
	arrXQCond.push( "MatchSome($elem/object_type, ( 'position_common', 'position_family' ,'subdivision_group' ))" );

	if ( oParams.HasProperty("arrJobTransferTypes") && oParams.arrJobTransferTypes != null && IsArray(oParams.arrJobTransferTypes) && ArrayOptFirstElem(oParams.arrJobTransferTypes) != undefined)
	{
		arrXQCond.push( "MatchSome($elem/additional_param, ( " + ArrayMerge(oParams.arrJobTransferTypes, "XQueryLiteral(This)", ",") + " ))" );
	}

	var sXQCond = ArrayOptFirstElem( arrXQCond ) != undefined ? ' where ' + ArrayMerge( arrXQCond, 'This', ' and ' ) : '';
	
	var arrObjectsHasTDP = tools.xquery( 'for $elem in object_requirements' + sXQCond + ' return $elem' )
	
	var arrObjects = []
	var sReq, xmCatalog, sCatalog
	for(itemType in arrTypes)
	{
		sXQCond = "";
		
		xmCatalog = common.exchange_object_types.GetOptChildByKey(itemType);
		sCatalog = (xmCatalog != undefined) ? xmCatalog.title.Value : itemType;
		if ( itemType == "position_common" && oParams.HasProperty("arrStatuses") && oParams.arrStatuses != null && IsArray(oParams.arrStatuses) && ArrayOptFirstElem(oParams.arrStatuses) != undefined)
		{
			sXQCond =  " where MatchSome($elem/status, ( " + ArrayMerge(oParams.arrStatuses, "XQueryLiteral(This)", ",") + " ))"
		}
		sReq = "for $elem in " + itemType + "s " + sXQCond + " return $elem";
		arrObjects = ArrayUnion(arrObjects, ArrayExtract(tools.xquery(sReq), "({'id': This.id.Value, 'name': This.name.Value, 'type_id': sCatalog, 'type_name': sCatalog})"))
	}
	
	arrObjects = ArraySelect(arrObjects, "ArrayOptFind(arrObjectsHasTDP, 'This.object_id == ' + CodeLiteral(This.id)) == undefined")
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_3' );
	tpProgress.ItemCount = ArrayCount( arrObjects );
	tpProgress.CurrentItemIndex = 0;
	
	for ( catPC in arrObjects )
	{
		tpProgress.CurrentItemName = catPC.name;

		oElem = {};
		oElem.id = catPC.id;
		oElem.name = catPC.name;
		oElem.type_id = catPC.type_id;
		oElem.type_name = catPC.type_name;

		oRes.array.push( oElem );

		tpProgress.CurrentItemIndex++;
	}

	return oRes;
}

function Report_PositionCommonStatistic(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}

	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_4' );
	tpProgress.ItemCount = 9;
	tpProgress.CurrentItemIndex = 0;

	var arrXQCondPC = [];
		if ( oParams.HasProperty("arrStatuses") && oParams.arrStatuses != null && IsArray(oParams.arrStatuses) && ArrayOptFirstElem(oParams.arrStatuses) != undefined)
		{
			arrXQCondPC.push( "MatchSome($elem/status, ( " + ArrayMerge(oParams.arrStatuses, "XQueryLiteral(This)", ",") + " ))" );
		}
		var sXQCondPC = ArrayOptFirstElem( arrXQCondPC ) != undefined ? ' where ' + ArrayMerge( arrXQCondPC, 'This', ' and ' ) : '';
		var arrFullPositionCommon = XQuery( 'for $elem in position_commons ' + sXQCondPC + ' return $elem' );
	oRes.array.push( {'name': i18n.t( 'tipovyhdolzhnos' ), 'value': ArrayCount(arrFullPositionCommon)} );
	tpProgress.CurrentItemIndex++;

	var arrXQCondRequir = [];
	arrXQCondRequir.push( "MatchSome($elem/object_type, ( 'position_common', 'position_family' ,'subdivision_group' ))" );
	if ( oParams.HasProperty("arrJobTransferTypes") && oParams.arrJobTransferTypes != null && IsArray(oParams.arrJobTransferTypes) && ArrayOptFirstElem(oParams.arrJobTransferTypes) != undefined)
	{
		arrXQCondRequir.push( "MatchSome($elem/additional_param, ( " + ArrayMerge(oParams.arrJobTransferTypes, "XQueryLiteral(This)", ",") + " ))" );
	}
	var sXQCondRequir = ArrayOptFirstElem( arrXQCondRequir ) != undefined ? ' where ' + ArrayMerge( arrXQCondRequir, 'This', ' and ' ) : '';
	var arrObjectsHasTDP = tools.xquery( 'for $elem in object_requirements' + sXQCondRequir + ' return $elem' );
		
	var arrPositionCommonHasTDP = ArraySelect(arrObjectsHasTDP, "This.object_type == 'position_common'");
	var arrPositionCommonWoTDP = ArraySelect(arrFullPositionCommon, "ArrayOptFind(arrPositionCommonHasTDP, 'This.object_id == ' + CodeLiteral(This.id)) == undefined")
	oRes.array.push( {'name': i18n.t( 'tipovyhdolzhnos_1' ), 'value': ArrayCount(arrPositionCommonWoTDP)} );
	tpProgress.CurrentItemIndex++;
	
	var arrXQCondPosition = [];
	arrXQCondPosition.push( '$elem/position_common_id = null()')
		if ( oParams.org_id != null )
			arrXQCondPosition.push( '$elem/org_id = ' + oParams.org_id );
		if ( oParams.subdivision_id != null )
		{
			var sHierSubsIDs = ArrayMerge( tools.xquery( "for $elem in subs where IsHierChild( $elem/id, " + oParams.subdivision_id + " ) and $elem/type = 'subdivision' order by $elem/Hier() return $elem/id" ), "This.id", "," );
			arrXQCondPosition.push( "MatchSome($elem/parent_object_id, ( " + sHierSubsIDs + " ))" );
		}
		var sXQCondPosition = ArrayOptFirstElem( arrXQCondPosition ) != undefined ? ' where ' + ArrayMerge( arrXQCondPosition, 'This', ' and ' ) : '';
		var arrPosition = XQuery( 'for $elem in positions ' + sXQCondPosition + ' return $elem' );
	oRes.array.push( {'name': i18n.t( 'dolzhnosteybezt' ), 'value': ArrayCount(arrPosition)} );
	tpProgress.CurrentItemIndex++;
	
	var arrFullPositionFamilys = XQuery( 'for $elem in position_familys return $elem' );
	oRes.array.push( {'name': i18n.t( 'semeystvdolzhno' ), 'value': ArrayCount(arrFullPositionFamilys)} );
	tpProgress.CurrentItemIndex++;

	var arrPositionFamilyHasTDP = ArraySelect(arrObjectsHasTDP, "This.object_type == 'position_family'");
	var arrPositionFamilyWoTDP = ArraySelect(arrFullPositionFamilys, "ArrayOptFind(arrPositionFamilyHasTDP, 'This.object_id == ' + CodeLiteral(This.id)) == undefined")
	oRes.array.push( {'name': i18n.t( 'semeystvdolzhno_1' ), 'value': ArrayCount(arrPositionFamilyWoTDP)} );
	tpProgress.CurrentItemIndex++;

	var arrPositionCommonWoFamily = ArraySelect(arrFullPositionCommon, "This.position_familys == null || This.position_familys == ''");
	oRes.array.push( {'name': i18n.t( 'tipovyhdolzhnos_2' ), 'value': ArrayCount(arrPositionCommonWoFamily)} );
	tpProgress.CurrentItemIndex++;

	var arrFullSubdivisionGroup = XQuery( 'for $elem in subdivision_groups return $elem' );
	oRes.array.push( {'name': i18n.t( 'grupppodrazdel' ), 'value': ArrayCount(arrFullSubdivisionGroup)} );
	tpProgress.CurrentItemIndex++;
	
	var arrSubdivisionGroupHasTDP = ArraySelect(arrObjectsHasTDP, "This.object_type == 'subdivision_group'");
	var arrSubdivisionGroupWoTDP = ArraySelect(arrFullSubdivisionGroup, "ArrayOptFind(arrSubdivisionGroupHasTDP, 'This.object_id == ' + CodeLiteral(This.id)) == undefined")
	oRes.array.push( {'name': i18n.t( 'grupppodrazdel_1' ), 'value': ArrayCount(arrSubdivisionGroupWoTDP)} );
	tpProgress.CurrentItemIndex++;
	
	var arrXQCondSubdivision = [];
		if ( oParams.org_id != null )
			arrXQCondSubdivision.push( '$elem/org_id = ' + oParams.org_id );
		if ( oParams.subdivision_id != null )
		{
			sHierSubsIDs = ArrayMerge( tools.xquery( "for $elem in subs where IsHierChild( $elem/id, " + oParams.subdivision_id + " ) and $elem/type = 'subdivision' order by $elem/Hier() return $elem/id" ), "This.id", "," );
			arrXQCondSubdivision.push( "MatchSome($elem/id, ( " + sHierSubsIDs + " ))" );
		}
		if ( !tools_web.is_true(oParams.include_disband) )
			arrXQCondSubdivision.push( '$elem/is_disbanded != true()' );
		var sXQCondSubdivision = ArrayOptFirstElem( arrXQCondSubdivision ) != undefined ? ' where ' + ArrayMerge( arrXQCondSubdivision, 'This', ' and ' ) : '';
		var arrSubdivisions = XQuery( 'for $elem in subdivisions ' + sXQCondSubdivision + ' return $elem' );
		var arrSubdivInGroup = tools.xquery("for $elem in subdivision_group_subdivisions return $elem");
		var arrSubdivisionsWoSubdivisionGroup = ArraySelect(arrSubdivisions, "ArrayOptFind(arrSubdivInGroup, 'This.subdivision_id == ' + CodeLiteral(This.id)) == undefined")
	oRes.array.push( {'name': i18n.t( 'podrazdeleniyb' ), 'value': ArrayCount(arrSubdivisionsWoSubdivisionGroup)} );
	tpProgress.CurrentItemIndex++;

	return oRes;
}

function Report_TypicalProgramsDisused(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}

	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_4' );
	tpProgress.CurrentItemIndex = 0;

	var arrXQCondTDPReq = [];
	if ( oParams.HasProperty("arrJobTransferTypes") && oParams.arrJobTransferTypes != null && IsArray(oParams.arrJobTransferTypes) && ArrayOptFirstElem(oParams.arrJobTransferTypes) != undefined)
	{
		arrXQCondTDPReq.push( "MatchSome($elem_qc/additional_param, ( " + ArrayMerge(oParams.arrJobTransferTypes, "XQueryLiteral(This)", ",") + " ))" );
	}
	
	var bHasPositiomCommon = false;
	if ( oParams.HasProperty("arrTypes") && oParams.arrTypes != null && IsArray(oParams.arrTypes) && ArrayOptFirstElem(oParams.arrTypes) != undefined)
	{
		bHasPositiomCommon = (oParams.arrTypes.indexOf('position_common') >= 0);
		arrXQCondTDPReq.push( "MatchSome($elem_qc/object_type, ( " + ArrayMerge(oParams.arrTypes, "XQueryLiteral(This)", ",") + " ))" );
	}
	else
		bHasPositiomCommon = true;
	
	arrXQCondTDPReq.push( "$elem_qc/requirement_type = 'typical_development_program'" );
	
	var sRequireObjReq = "for $elem_qc in object_requirements " + (ArrayOptFirstElem( arrXQCondTDPReq ) != undefined ? ' where ' + ArrayMerge( arrXQCondTDPReq, 'This', ' and ' ) : '') + " return $elem_qc/Fields('object_id','object_type','requirement_object_id')";
	
	var arrObjRequirement = tools.xquery(sRequireObjReq)
	
	if (bHasPositiomCommon && oParams.HasProperty("arrStatuses") && oParams.arrStatuses != null && IsArray(oParams.arrStatuses) && ArrayOptFirstElem(oParams.arrStatuses) != undefined)
	{
		var sReqPositionCommonByState = "for $elem in position_commons where MatchSome($elem/status, ( " + ArrayMerge(oParams.arrStatuses, "XQueryLiteral(This)", ",") + " )) return $elem/Fields('id')"
		var arrPositionCommonByStateIDs = ArrayExtractKeys(tools.xquery(sReqPositionCommonByState), 'id');
		
		arrObjRequirement = ArraySelect(arrObjRequirement, "This.object_type == 'position_family' || This.object_type == 'subdivision_group' || (This.object_type == 'position_common' && arrPositionCommonByStateIDs.indexOf(This.object_id.Value) >= 0)")
	}	
	
	
	
	var sXQCondTDP = ArrayOptFirstElem( arrObjRequirement ) != undefined ? 'MatchSome($elem_qc/id, (' + ArrayMerge( arrObjRequirement, 'This.requirement_object_id.Value', ',' ) + " ))" : 'false()';

	var sXQCondRoles = "";
	var APPLICATION = oParams.GetOptProperty( 'APPLICATION', '' )
	if( APPLICATION != '' )
	{
		var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, APPLICATION ] );
		if ( iRoleLevel > 1 && iRoleLevel < 5)
		{
			sXQCondRoles = ' and false()';
			var iExpertID = RValue(ArrayOptFirstElem(tools.xquery("for $elem in experts where $elem/type = 'collaborator' and $elem/person_id = " + xmCurUser.id.Value + " return $elem/Fields('id')"), {'id':null}).id);
			
			if(iExpertID != null)
			{
				var arrExpertRoles = tools.xquery("for $elem in roles where $elem/catalog_name = 'typical_development_program' and MatchSome($elem/experts, (" + iExpertID + ")) return $elem/Fields('id')");
				if(ArrayOptFirstElem(arrExpertRoles) != undefined)
				{
					sXQCondRoles = ' and MatchSome($elem_qc/role_id, (' + ArrayMerge( arrExpertRoles, 'This.id.Value', ',' ) + '))';
				}
			}
		}
	}
	
	var sTypicalProgramsReq = "for $elem_qc in typical_development_programs where " + sXQCondTDP + sXQCondRoles + " return $elem_qc/Fields('id','name','status')" 
	var arrTypicalPrograms = ArrayExtractKeys(tools.xquery( sTypicalProgramsReq ), 'id');
	var bHasSelected = (ArrayOptFirstElem(arrTypicalPrograms) != undefined);
	var arrDisTypicalProgram = [];
	var xmStatus;
	for(itemTDP in typical_development_programs)
	{
		if(bHasSelected && arrTypicalPrograms.indexOf(itemTDP.id.Value) >=0)
			continue;
		
		xmStatus = itemTDP.status.OptForeignElem;
		oRes.array.push({id: itemTDP.id.Value, name: itemTDP.name.Value, value: (xmStatus != undefined ? xmStatus.name.Value : "")})
		tpProgress.CurrentItemIndex++;
	}
	tpProgress.ItemCount = ArrayCount(oRes.array);

	return oRes;
}

function Report_Adaptations(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}
	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_4' );
	tpProgress.CurrentItemIndex = 0;

	var arrXQCondReq = [];
	
	if (oParams.HasProperty("arrStatuses") && oParams.arrStatuses != null && IsArray(oParams.arrStatuses) && ArrayOptFirstElem(oParams.arrStatuses) != undefined)
	{
		arrXQCondReq.push("MatchSome($elem/status, (" + ArrayMerge(oParams.arrStatuses, "XQueryLiteral(This)", ",") + "))");
	}
	
	var dStartDate = undefined;
	if (oParams.HasProperty("date_start") && !IsEmptyValue(oParams.date_start))
	{
		dStartDate = OptDate(oParams.date_start);
		//arrXQCondReq.push("($elem/start_date = null() or ($elem/start_date != null() and $elem/start_date < " + XQueryLiteral(DateNewTime(oParams.date_start, 23, 59, 59)) + "))")
	}
	
	var dEndDate = undefined;
	if (oParams.HasProperty("date_end") && !IsEmptyValue(oParams.date_end))
	{
		dEndDate = OptDate(oParams.date_end);
		//arrXQCondReq.push("($elem/finish_date = null() or ($elem/finish_date != null() and $elem/finish_date > " + XQueryLiteral(DateNewTime(oParams.date_end)) + "))")
	}
	
	var iOrgID = null;
	if (oParams.HasProperty("org_id") && !IsEmptyValue(oParams.org_id))
	{
		iOrgID = OptInt(oParams.org_id, null);
	}
	
	var iSubdivisionID = null;
	if (oParams.HasProperty("subdivision_id") && !IsEmptyValue(oParams.subdivision_id))
	{
		iSubdivisionID = OptInt(oParams.subdivision_id, null);
	}
	
	
	var sXQCondRoles = "";
	var APPLICATION = oParams.GetOptProperty( 'APPLICATION', '' )
	if( APPLICATION != '' )
	{
		var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, APPLICATION ] );
		var arrBossTypesID = [];
		if(iRoleLevel < 1)
		{
			arrXQCondReq = ' and false()';
		}
		else if ( iRoleLevel == 1)
		{
			var oGetSubordinateParams = {
				arrTypeSubordinate: ['func'],
				bReturnIDs: true,
				sCatalog: "",
				arrFieldsNames: null,
				xQueryCond: "",
				bGetOrgSubordinate: true,
				bGetGroupSubordinate: true,
				bGetPersonSubordinate: true,
				bInHierSubdivision: true,
				arrBossTypeIDs: [],
				bWithoutUseManagementObject: true,
			};
			var arrSubordinateIDs = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );
			
			arrXQCondReq.push("MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + "))")
		}
		else if( iRoleLevel > 1 && iRoleLevel < 5)
		{
			arrBossTypesID = RValue(ArrayOptFirstElem(tools.xquery("for $elem in boss_types where $elem/code = 'talent_pool_tutor' return $elem"), {'id': null}).id);
			var arrXQFMCondReq = [];
			arrXQFMCondReq.push("$elem/catalog = 'career_reserve'");
			arrXQFMCondReq.push("$elem/person_id = " + XQueryLiteral(xmCurUser.id.Value));
			arrXQFMCondReq.push("$elem/boss_type_id = " + XQueryLiteral(arrBossTypesID));
			var sFMCondReq = ArrayMerge(arrXQFMCondReq, "This", " and ");
			var arrFMObjects = tools.xquery("for $elem in talent_pool_func_managers where " + sFMCondReq + " return $elem/Fields('object_id')")
			arrXQCondReq.push("MatchSome($elem/id, (" + ArrayMerge(arrFMObjects, "XQueryLiteral(This.object_id.Value)", ",") + "))")
		}
		else if( iRoleLevel == 5)
		{
			var teApplication = tools_app.get_application(APPLICATION);
			if (teApplication != null)
			{
				if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
				{
					manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, null ));
					if (manager_type_id > 0)
						arrBossTypesID.push(manager_type_id);
				}
			}
			if(ArrayOptFirstElem(arrBossTypesID) == undefined)
			{
				arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
			}
			var oGetSubordinateParams = {
				arrTypeSubordinate: ['func'],
				bReturnIDs: true,
				sCatalog: "",
				arrFieldsNames: null,
				xQueryCond: "",
				bGetOrgSubordinate: true,
				bGetGroupSubordinate: true,
				bGetPersonSubordinate: true,
				bInHierSubdivision: true,
				arrBossTypeIDs: arrBossTypesID,
				bWithoutUseManagementObject: true,
			};
			var arrSubordinateIDs = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );

			arrXQCondReq.push("MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + "))")
		}
	}
	
	var sXQCondReq = ArrayOptFirstElem(arrXQCondReq) != undefined ? StrReplace(" where " + ArrayMerge(arrXQCondReq, "This", " and "), "$elem/", "$elem_qc/") : "";
//alert("Report: libMain: Report_Adaptations: REQ: for $elem_qc in career_reserves" + sXQCondReq + " return $elem_qc")
	
	var arrAdaptations = tools.xquery("for $elem_qc in career_reserves" + sXQCondReq + " return $elem_qc");
	
	var oElem, xmStatus, xmPerson, arrHier;
	for(itemCR in arrAdaptations)
	{
		xmPerson = itemCR.person_id.OptForeignElem;

		if(iOrgID != null && xmPerson.org_id.Value != iOrgID)
			continue;
			
		if(iSubdivisionID != null)
		{
			arrHier = tools.xquery("for $elem in person_hierarchys where $elem/collaborator_id = " + itemCR.person_id.Value + " and $elem/subdivision_id = " + iSubdivisionID + " return $elem");
			if(ArrayOptFirstElem(arrHier) == undefined)
				continue;
		}			

		if(dEndDate != undefined && itemCR.start_date.HasValue && itemCR.start_date.Value > DateNewTime(dEndDate, 23, 59, 59))
			continue;
		
		if(dStartDate != undefined)
		{
			if(itemCR.finish_date.HasValue)
			{
				if(itemCR.finish_date.Value < dStartDate)
					continue
			}
			else if(itemCR.plan_readiness_date.HasValue)
			{
				if(itemCR.plan_readiness_date.Value < dStartDate)
					continue
			}
		}
			
		xmStatus = itemCR.status.OptForeignElem;
		oElem = {
			id: itemCR.id.Value, 
			name: itemCR.person_fullname.Value,
			position_name: itemCR.person_position.Value,
			subdivision_name: (xmPerson != undefined ? xmPerson.position_parent_name.Value : ""),
			org_name: (xmPerson != undefined ? xmPerson.org_name.Value : ""),
			status_name: (xmStatus != undefined ? xmStatus.name.Value : ""),
			start_date: itemCR.start_date.Value,
			plan_date: itemCR.plan_readiness_date.Value,
			fact_date: itemCR.finish_date.Value
		};
		oRes.array.push(oElem)
		tpProgress.CurrentItemIndex++;
	}
	tpProgress.ItemCount = ArrayCount(oRes.array);
	
	return oRes;
}

function Report_Person_WO_Adaptations(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}
	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_4' );
	tpProgress.CurrentItemIndex = 0;

	var arrPersons = tools.xquery("for $elem in collaborators where $elem/is_dismiss != true() return $elem");

	var iOrgID = null;
	if (oParams.HasProperty("org_id") && !IsEmptyValue(oParams.org_id))
	{
		iOrgID = OptInt(oParams.org_id, null);
	}
	
	var iSubdivisionID = null;
	if (oParams.HasProperty("subdivision_id") && !IsEmptyValue(oParams.subdivision_id))
	{
		iSubdivisionID = OptInt(oParams.subdivision_id, null);
	}
	
	var sXQCondRoles = "";
	var APPLICATION = oParams.GetOptProperty( 'APPLICATION', '' )
	if( APPLICATION == '' )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'otchetvyzvanvne' )
		return oRes
	}
	var teApplication = tools_app.get_application(APPLICATION);
	if( teApplication == null )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'nenaydenoukaza' ) + APPLICATION + "]"
		return oRes
	}
	
	var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, APPLICATION ] );
	if(iRoleLevel < 1 || ( iRoleLevel > 1 && iRoleLevel < 5 ))
	{
		arrPersons = [];
	}
	else if ( iRoleLevel == 1)
	{
		var oGetSubordinateParams = {
			arrTypeSubordinate: ['func'],
			bReturnIDs: false,
			sCatalog: "",
			arrFieldsNames: null,
			xQueryCond: "",
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			arrBossTypeIDs: [],
			bWithoutUseManagementObject: true,
		};
		arrPersons = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );
	}
	else if( iRoleLevel == 5)
	{
		var arrBossTypesID = [];
		if (teApplication != null)
		{
			if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
			{
				manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, null ));
				if (manager_type_id > 0)
					arrBossTypesID.push(manager_type_id);
			}
		}
		if(ArrayOptFirstElem(arrBossTypesID) == undefined)
		{
			arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
		}
		var oGetSubordinateParams = {
			arrTypeSubordinate: ['func'],
			bReturnIDs: false,
			sCatalog: "",
			arrFieldsNames: null,
			xQueryCond: "",
			bGetOrgSubordinate: true,
			bGetGroupSubordinate: true,
			bGetPersonSubordinate: true,
			bInHierSubdivision: true,
			arrBossTypeIDs: arrBossTypesID,
			bWithoutUseManagementObject: true,
		};
		arrPersons = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );

	}
	
	var arrAdaptations = ArrayDirect(tools.xquery("for $elem_qc in career_reserves where $elem_qc/position_type = 'adaptation' and MatchSome($elem_qc/status, ('plan','active','active')) and MatchSome($elem_qc/person_id, (" + ArrayMerge(arrPersons, "id", ",") + ")) order by $elem_qc/person_id return $elem_qc/Fields('id','person_id')"))

	var oElem,  arrHier;
	for(xmPerson in arrPersons)
	{
		if(ArrayOptFindBySortedKey(arrAdaptations, xmPerson.id.Value, 'person_id') != undefined)
			continue;

		if(iOrgID != null && xmPerson.org_id.Value != iOrgID)
			continue;
			
		if(iSubdivisionID != null)
		{
			arrHier = tools.xquery("for $elem in person_hierarchys where $elem/collaborator_id = " + xmPerson.id.Value + " and $elem/subdivision_id = " + iSubdivisionID + " return $elem");
			if(ArrayOptFirstElem(arrHier) == undefined)
				continue;
		}			

		sDepthType = tools.call_code_library_method( 'libTalentPool', 'check_person_depth_type', [ xmPerson.id.Value, null, null, teApplication ] ); 
		if(sDepthType == 'external' || sDepthType == 'internal')
		{
			oElem = {
				id: xmPerson.id.Value, 
				name: xmPerson.fullname.Value,
				position_name: xmPerson.position_name.Value,
				subdivision_name: xmPerson.position_parent_name.Value,
				org_name: xmPerson.org_name.Value,
			};
			oRes.array.push(oElem)
		}
		tpProgress.CurrentItemIndex++;
	}
	tpProgress.ItemCount = ArrayCount(oRes.array);
	
	return oRes;
}

function Report_Adaptations_Statistic(oParams, xmCurUser)
{
	var oRes = tools.get_code_library_result_object();
	oRes.array = [];
	
	if ( oParams == null || oParams == undefined )
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'pustyeparametr' )
		return oRes
	}
	try
	{
		if(xmCurUser.Name != 'collaborator')
			throw 'no user'
	}
	catch(e)
	{
		oRes.error = 1;
		oRes.errorText = i18n.t( 'neperedantekush' )
		return oRes
	}
	
	CheckCurThread();

	var tpProgress = new TaskProgress;
	tpProgress.TaskName = i18n.t( 'zagruzhaemspiso_4' );
	tpProgress.CurrentItemIndex = 0;

	var arrXQCondReq = [];
	
	var dStartDate = undefined;
	if (oParams.HasProperty("date_start") && !IsEmptyValue(oParams.date_start))
	{
		dStartDate = OptDate(oParams.date_start)
		//arrXQCondReq.push("($elem/start_date = null() or ($elem/start_date != null() and $elem/start_date < " + XQueryLiteral(DateNewTime(oParams.date_start, 23, 59, 59)) + "))")
	}
	
	var dEndDate = undefined;
	if (oParams.HasProperty("date_end") && !IsEmptyValue(oParams.date_end))
	{
		dEndDate = OptDate(oParams.date_end)
		//arrXQCondReq.push("($elem/finish_date = null() or ($elem/finish_date != null() and $elem/finish_date > " + XQueryLiteral(DateNewTime(oParams.date_end)) + "))")
	}
	
	var iOrgID = null;
	if (oParams.HasProperty("org_id") && !IsEmptyValue(oParams.org_id))
	{
		iOrgID = OptInt(oParams.org_id, null);
	}
	
	var iSubdivisionID = null;
	if (oParams.HasProperty("subdivision_id") && !IsEmptyValue(oParams.subdivision_id))
	{
		iSubdivisionID = OptInt(oParams.subdivision_id, null);
	}
	
	
	var sXQCondRoles = "";
	var APPLICATION = oParams.GetOptProperty( 'APPLICATION', '' )
	if( APPLICATION != '' )
	{
		var iRoleLevel = tools.call_code_library_method( 'libApplication', 'GetPersonApplicationAccessLevel', [ xmCurUser.id.Value, APPLICATION ] );
		var arrBossTypesID = [];
		if(iRoleLevel < 1)
		{
			arrXQCondReq = ' and false()';
		}
		else if ( iRoleLevel == 1)
		{
			var oGetSubordinateParams = {
				arrTypeSubordinate: ['func'],
				bReturnIDs: true,
				sCatalog: "",
				arrFieldsNames: null,
				xQueryCond: "",
				bGetOrgSubordinate: true,
				bGetGroupSubordinate: true,
				bGetPersonSubordinate: true,
				bInHierSubdivision: true,
				arrBossTypeIDs: [],
				bWithoutUseManagementObject: true,
			};
			var arrSubordinateIDs = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );
			
			arrXQCondReq.push("MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + "))")
		}
		else if( iRoleLevel > 1 && iRoleLevel < 5)
		{
			arrBossTypesID = RValue(ArrayOptFirstElem(tools.xquery("for $elem in boss_types where $elem/code = 'talent_pool_tutor' return $elem"), {'id': null}).id);
			var arrXQFMCondReq = [];
			arrXQFMCondReq.push("$elem/catalog = 'career_reserve'");
			arrXQFMCondReq.push("$elem/person_id = " + XQueryLiteral(xmCurUser.id.Value));
			arrXQFMCondReq.push("$elem/boss_type_id = " + XQueryLiteral(arrBossTypesID));
			var sFMCondReq = ArrayMerge(arrXQFMCondReq, "This", " and ");
			var arrFMObjects = tools.xquery("for $elem in talent_pool_func_managers where " + sFMCondReq + " return $elem/Fields('object_id')")
			arrXQCondReq.push("MatchSome($elem/id, (" + ArrayMerge(arrFMObjects, "XQueryLiteral(This.object_id.Value)", ",") + "))")
		}
		else if( iRoleLevel == 5)
		{
			var teApplication = tools_app.get_application(APPLICATION);
			if (teApplication != null)
			{
				if ( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ) != undefined )
				{
					manager_type_id = (OptInt( teApplication.wvars.GetOptChildByKey( 'manager_type_id' ).value, null ));
					if (manager_type_id > 0)
						arrBossTypesID.push(manager_type_id);
				}
			}
			if(ArrayOptFirstElem(arrBossTypesID) == undefined)
			{
				arrBossTypesID = ArrayExtract(tools.xquery("for $elem in boss_types where $elem/code = 'education_manager' return $elem"), 'id');
			}
			var oGetSubordinateParams = {
				arrTypeSubordinate: ['func'],
				bReturnIDs: true,
				sCatalog: "",
				arrFieldsNames: null,
				xQueryCond: "",
				bGetOrgSubordinate: true,
				bGetGroupSubordinate: true,
				bGetPersonSubordinate: true,
				bInHierSubdivision: true,
				arrBossTypeIDs: arrBossTypesID,
				bWithoutUseManagementObject: true,
			};
			var arrSubordinateIDs = GetSubordinateRecords( xmCurUser.id.Value, oGetSubordinateParams );

			arrXQCondReq.push("MatchSome($elem/person_id, (" + ArrayMerge(arrSubordinateIDs, "XQueryLiteral(This)", ",") + "))")
		}
	}
	
	var sXQCondReq = ArrayOptFirstElem(arrXQCondReq) != undefined ? StrReplace(" where " + ArrayMerge(arrXQCondReq, "This", " and "), "$elem/", "$elem_qc/") : "";
//alert("Report: libMain: Report_Adaptations: REQ: for $elem_qc in career_reserves" + sXQCondReq + " return $elem_qc")
	
	var arrAdaptations = ArraySelectAll(tools.xquery("for $elem_qc in career_reserves" + sXQCondReq + " return $elem_qc/Fields('id','name','status','person_id','start_date','finish_date','plan_readiness_date')"));
	
	var arrFinal = ArrayExtract(ArraySort(common.career_reserve_status_types, "id", "+"), "({name: This.name.Value, code: This.id.Value, count: 0})");
	var oTotal = {name: i18n.t( 'vsego' ), code: 'total', count: 0};
	
	var oCurStat, xmPerson, arrHier;
	for(itemCR in arrAdaptations)
	{
		xmPerson = itemCR.person_id.OptForeignElem;

		if(iOrgID != null && xmPerson.org_id.Value != iOrgID)
			continue;
			
		if(iSubdivisionID != null)
		{
			arrHier = tools.xquery("for $elem in person_hierarchys where $elem/collaborator_id = " + itemCR.person_id.Value + " and $elem/subdivision_id = " + iSubdivisionID + " return $elem");
			if(ArrayOptFirstElem(arrHier) == undefined)
				continue;
		}			

		if(dEndDate != undefined && itemCR.start_date.HasValue && itemCR.start_date.Value > dEndDate)
			continue;
		
		if(dStartDate != undefined)
		{
			if(itemCR.finish_date.HasValue)
			{
				if(itemCR.finish_date.Value < dStartDate)
					continue
			}
			else if(itemCR.plan_readiness_date.HasValue)
			{
				if(itemCR.plan_readiness_date.Value < dStartDate)
					continue
			}
		}
		
		oTotal.count++;
		oCurStat = ArrayOptFindBySortedKey(arrFinal, itemCR.status.Value, "code");
		oCurStat.count++;

		tpProgress.CurrentItemIndex++;
	}
	oRes.array = ArrayUnion([oTotal], ArraySort(arrFinal, "name", "+"));
	tpProgress.ItemCount = ArrayCount(oRes.array);
	
	return oRes;
}

// ==================================================================================================
// ========   Конец блока вычисления наборов данных отчетов (блок должен быть последним) ============
// ==================================================================================================

function switchColumns(oColumns){

	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';

	oRes.columns = [];

	for(oColumn in oColumns){
		oRes.columns.push({
			'name': oColumn.name,
			'const': oColumn.const
		});
	}

	return oRes;
}