// Доступные переменные: oParams, teLibrarySystem.

function getReaderUrl(oParams)
{	
	var iMaterialId = Int(oParams.GetOptProperty("iMaterialId"));
	var iUserId = Int(oParams.GetOptProperty("iUserId"));
	var teMaterial = OpenDoc(UrlFromDocID(iMaterialId)).TopElem;
	var teLibrarySystem = getLibrarySystem();
	var sLibraryCode = teLibrarySystem.code.Value;
	var sLibUrl = teLibrarySystem.get_setting("lib_url").value;
	var bSendEmail = tools_web.is_true( teLibrarySystem.get_setting("send_email").value );
	var bSendPass = tools_web.is_true( teLibrarySystem.get_setting("send_pass").value );
	var sExternalId = teMaterial.external_id;
	var bUseLink = false;
	var sApiUrl = "https://api5.alpinadigital.ru/api/v2/b2b/";
	if (StrBegins(sExternalId,sLibraryCode+"_"))
		sExternalId = StrReplaceOne(sExternalId,sLibraryCode+"_","");

	try 
	{
		var docUser = tools.open_doc(iUserId);
		var teUser = docUser.TopElem;
		var sUserEmail = "";
		var sUserPass = "";
		var sAlpinaUserID = "";
		
		if ( bSendEmail )
		{
			sUserEmail = String(teUser.email.Value);
		}
		else
		{
			sUserEmail = String(teUser.custom_elems.ObtainChildByKey("alpina_user_email").value);
		}
		if ( bSendPass )
		{
			sUserPass = String(teUser.password.Value);
		}
		else
		{
			sUserPass = String(teUser.custom_elems.ObtainChildByKey("alpina_user_password").value);
		}
		
		sAlpinaUserID = String(teUser.custom_elems.ObtainChildByKey("alpina_user_id").value);
		var ssoToken = "0";
		
		if ( sAlpinaUserID != "" )
		{
			try
			{
				arrResult = callMethod('users/'+sAlpinaUserID, 'get');
				sUserEmail = String(arrResult[0].email);
			}
			catch(_nouser)
			{
				sAlpinaUserID = "";
			}
		}
		if ( sAlpinaUserID == "" && sUserEmail != "" )
		{
			try
			{
				oMethodParams = {"email": sUserEmail};
				arrResult = callMethod('users', 'get', oMethodParams);
				sAlpinaUserID = String(arrResult[0].id);
			}
			catch(_nouser)
			{
				sAlpinaUserID = "";
			}
			if ( sAlpinaUserID != "" )
			{
				teUser.custom_elems.ObtainChildByKey("alpina_user_id").value = sAlpinaUserID;
				docUser.Save();
			}
				
		}
		if ( sAlpinaUserID == "" && sUserEmail != "" )
		{
			if ( sUserPass == "" )
			{
				sUserPass = tools.random_string( 8 );
			}
			try
			{
				oMethodParams = {"email": sUserEmail, "password": sUserPass};
				arrResult = callMethod('users', 'post', oMethodParams);
				sAlpinaUserID = String(arrResult[0].id);
			}
			catch(_nouser)
			{

			}
			
			if ( sAlpinaUserID != "" )
			{
				teUser.custom_elems.ObtainChildByKey("alpina_user_id").value = sAlpinaUserID;
				teUser.custom_elems.ObtainChildByKey("alpina_user_password").value = sUserPass;
				docUser.Save();
			}
		}
		if (sAlpinaUserID != "" && sUserEmail != "")
		{
			try
			{
				oMethodParams = {"users": sUserEmail};
				arrResult = callMethod('users/activate', 'post', oMethodParams);
			}
			catch(_nouser)
			{

			}
		}
		if (sUserEmail != "")
		{
			if ( bUseLink )
			{
				oMethodParams = {"content_id": sExternalId, "content_type": "item", "login": sUserEmail};
				arrResult = callMethod('sso-link', 'post', oMethodParams); 
				ssoToken = arrResult.sso_link;
			}
			else
			{
				oMethodParams = {"login": sUserEmail};
				arrResult = callMethod('sso', 'post', oMethodParams);
				ssoToken = arrResult[0].token;
				arrResult = callMethod( ( "users/" + sAlpinaUserID + "/inventory" ), 'post', ({ "item_id": sExternalId }));
			}
		}
	}
	catch(_sdfr)
	{
		alert( "Alpina Errors = " + _sdfr );
		ssoToken = "0";
	}
    if ( !bUseLink )
	{
		_sTypeL = "/?redirect=/reader/book/";
		if ( teMaterial.library_material_type_id.HasValue && teMaterial.library_material_type_id.OptForeignElem != undefined && teMaterial.library_material_type_id.OptForeignElem.code == "audio" )
		{
			_sTypeL = "/?redirect=/audio/";
		}
		sReaderUrl = UrlAppendPath( sLibUrl, ("/sso/" + ssoToken) ) + _sTypeL + sExternalId;  
	}
	else
	{
		sReaderUrl = ssoToken;
	}
	return sReaderUrl;
}

function getLibrarySystemDoc(){
	try 
	{
		docLibrarySystem
	}
	catch(__lsyserror)
	{
		docLibrarySystem = FetchDoc(UrlFromDocID(ArrayOptFirstElem(XQuery("for $elem in library_systems where $elem/code='alpina' return $elem")).id));
	}
	return docLibrarySystem;
}

function getLibrarySystem(){
	return getLibrarySystemDoc().TopElem;
}

function encodeParams(oParamsParam)
{
	sResult = UrlEncodeQuery(oParamsParam);
	sResult = StrReplace(sResult, "%2E", ".");
	sResult = StrReplace(sResult, "%20", "+");
	sResult = StrReplace(sResult, "%2D", "-");	
	return sResult;
}

function getSig( oParams )
{
	teLibrarySystem = getLibrarySystem();
	sSecretKey = teLibrarySystem.get_setting( "secret_key" ).value;
	EncryptedString = StrLowerCase( Md5Hex( encodeParams( oParams) + sSecretKey ) );
	return EncryptedString;
}

function callMethod(sApiMethod, sMethodParam, oParamsParam)
{
	teLibrarySystem = getLibrarySystem();
	sApiUrl = "https://api5.alpinadigital.ru/api/v2/b2b/";
	sApiKey = teLibrarySystem.get_setting("api_key").value;
	sSecretKey = teLibrarySystem.get_setting("secret_key").value;
	//sSecretKeyMd5 = StrLowerCase(Md5Hex(sSecretKey));
	sHeaders = "X-Auth-Token: " + sApiKey + "\nIgnore-Errors: 1\n";
	
	if(oParamsParam == undefined)
		oParamsParam = new Object();
//	sEncryptedString = StrLowerCase(Md5Hex(encodeParams(oParamsParam) + sSecretKey));
//	oParamsParam.SetProperty("sig",sEncryptedString);
	oParamsParam.SetProperty("sig", getSig( oParamsParam ));
	
	//alert("sUrl: " + UrlAppendPath( sApiUrl, sApiMethod ) + "?" + UrlEncodeQuery( oParamsParam ));
	//alert("sApiMethod: " + sApiMethod);
	//alert("sApiKey:" + sApiKey);
	//alert("sSecretKey:" + sSecretKey);

	if(sMethodParam == "get")
	{
		sUrl = UrlAppendPath( sApiUrl, sApiMethod ) + "?" + UrlEncodeQuery( oParamsParam );
		oResp = HttpRequest( sUrl, sMethodParam, null, sHeaders );	
	}
	else
	{		
		sUrl = UrlAppendPath( sApiUrl, sApiMethod ) + "?" + UrlEncodeQuery( oParamsParam );
		oResp = HttpRequest( sUrl, sMethodParam, null, sHeaders );	
	}
	//alert("sUrl: " + sUrl);
	//alert("sApiMethod: " + sApiMethod);
	//alert("sApiKey:" + sApiKey);
	//alert("sSecretKey:" + sSecretKey);
	//alert(oResp.Body)
	return ParseJson(oResp.Body);
}

function syncData()
{	
	teLibrarySystem = getLibrarySystem();
	iRootCategoryId = OptInt(teLibrarySystem.get_setting("root_category_id").value);
	iFormatTypeId = OptInt(teLibrarySystem.get_setting("format_type_id").value);
	
	sLibraryCode = teLibrarySystem.code.Value;
	/*-------------- Categories sync -------------*/
	arrResult = callMethod("categories", "get" );
	function syncCategories(arrCategories, iParentCategoryId)
	{
		for(oCategory in arrCategories)
		{
			sCategory = sLibraryCode + "_" + oCategory.id;
			catCategory = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' and $elem/parent_object_id = " + iParentCategoryId + " and $elem/id != " + Random(0,800000000) + " return $elem"));
			if(catCategory == undefined)
			{
				docCategory = OpenNewDoc( "x-local://wtv/wtv_library_section.xmd" );
				docCategory.BindToDb( DefaultDb );
				docCategory.TopElem.external_id = sCategory;
				docCategory.TopElem.parent_object_id = iParentCategoryId;
			}
			else
			{
				docCategory = OpenDoc(UrlFromDocID(catCategory.id));
			}
			docCategory.TopElem.name = oCategory.name;
			docCategory.TopElem.position = oCategory.weight;
			docCategory.Save();
			if(ArrayCount(oCategory.children) > 0)
			{
				syncCategories(oCategory.children, docCategory.DocID);
			}
		}
	}
	syncCategories(arrResult, iRootCategoryId);
	/*-------------- Materials sync -------------*/
	iOffset = 0;
	iLimit = 100;
	var aTypes = ArrayExtract( library_material_types, "({ id: This.id.Value, code: This.code.Value, name: This.name.Value })" );
	var sType = "";
	var xqType = undefined;
	var iTypeID = null;
	do{
		oMethodParams = {limit: iLimit, offset: iOffset};//, type: "book"};
		arrResult = callMethod("items", "get", oMethodParams);
		for(oItem in arrResult)
		{
			sItemId = sLibraryCode + "_" + oItem.id;
			catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sItemId + "'" + " and $elem/id != " + Random(0,800000000) + " return $elem"));
			if(catMaterial == undefined)
			{
				docMaterial = OpenNewDoc( "x-local://wtv/wtv_library_material.xmd" );
				docMaterial.BindToDb( DefaultDb );
				docMaterial.TopElem.external_id = sItemId;
				docMaterial.TopElem.library_material_formats.ObtainChildByKey(iFormatTypeId);
				docMaterial.TopElem.allow_download = false;
			}
			else
			{
				docMaterial = OpenDoc(UrlFromDocID(catMaterial.id));
				docMaterial.TopElem.external_id = sItemId;
				docMaterial.TopElem.library_material_formats.ObtainChildByKey(iFormatTypeId);
				docMaterial.TopElem.allow_download = false;
			}
			docMaterial.TopElem.name = oItem.name;
			docMaterial.TopElem.description = oItem.description;	
			docMaterial.TopElem.year = oItem.year;	
			docMaterial.TopElem.library_system_id = teLibrarySystem.id;
			docMaterial.TopElem.author = ArrayMerge(ArraySelect(oItem.creators, "This.type=='author'"),"This.full_name",",");
			docMaterial.TopElem.publisher = ArrayMerge(ArraySelect(oItem.creators, "This.type=='publisher'"),"This.full_name",",");
			sType = oItem.GetOptProperty( "type", "book" );
			xqType = ArrayOptFind( aTypes, "This.code == " + CodeLiteral( sType ) );
			if ( xqType == undefined )
			{
				_type_doc = tools.new_doc_by_name( "library_material_type" );
				_type_doc.TopElem.code = sType;
				_type_doc.TopElem.name = ( sType == "book" ? "Книга": ( sType == "audiobook" ? "Аудио": ( sType == "summary" ? "Саммари": ( sType == "doc" ? "Файл": ( sType == "video" ? "Видео": ( sType == "audio" ? "Аудио": ( sType == "course" ? "Курс": "" ) ) ) ) ) ) );
				_type_doc.BindToDb( DefaultDb );
				_type_doc.Save();
				xqType = { id: _type_doc.DocID, code: _type_doc.TopElem.code.Value, name: _type_doc.TopElem.name.Value };
				aTypes.push( xqType );
			}
			docMaterial.TopElem.library_material_type_id = xqType.id;
			
			iCategoryId = undefined;
			if ( ArrayCount( oItem.categories ) > 0 )
			{
				iCategoryId = oItem.categories[ ArrayCount( oItem.categories ) - 1 ];
			}
			if(iCategoryId == undefined)
			{
				iCategoryId = iRootCategoryId;
			}
			if( iCategoryId != null )
			{
				sCategory = sLibraryCode + "_" + iCategoryId;
				catSection = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' return $elem"));
				if(catSection == undefined)
				{
					continue;
				}
				docMaterial.TopElem.section_id = catSection.id;
					
			}
			oImages = ArraySort(ArrayDirect(oItem.images), "This.height", "-");
			oImage = ArrayOptFirstElem(oImages);
			if(!docMaterial.TopElem.image.HasValue && oImage != undefined)
			{
				docResource = undefined;
				try
				{
					oImageResp = HttpRequest( oImage.url, "get" );
					
					docResource = OpenNewDoc( 'x-local://wtv/wtv_resource.xmd' );
					docResource.BindToDb( DefaultDb );
					docResource.TopElem.name = docMaterial.TopElem.name + " - " + " обложка";
					docResource.TopElem.put_str( oImageResp.Body, docMaterial.DocID + UrlPathSuffix(oImage.url), docMaterial.TopElem );
					docResource.Save();
					docMaterial.TopElem.image = docResource.DocID;
					if (!docMaterial.TopElem.resource_id.HasValue && ArrayCount(oImages)==1)
					{
						docMaterial.TopElem.resource_id = docResource.DocID;
					}
					else if (!docMaterial.TopElem.resource_id.HasValue && ArrayCount(oImages)>1)
					{
						oImage = oImages[ArrayCount(oImages)-1];
						oImageResp = HttpRequest( oImage.url, "get" );
					
						docResource = OpenNewDoc( 'x-local://wtv/wtv_resource.xmd' );
						docResource.BindToDb( DefaultDb );
						docResource.TopElem.name = docMaterial.TopElem.name + " - " + " превью";
						docResource.TopElem.put_str( oImageResp.Body, docMaterial.DocID + UrlPathSuffix(oImage.url), docMaterial.TopElem );
						docResource.Save();
						docMaterial.TopElem.resource_id = docResource.DocID;
					}
				}
				catch(ex)
				{
					alert(ex);
				}
				
			}
			docMaterial.Save();
		}
		iOffset += iLimit;
	}
	while(ArrayCount(arrResult) > 0)
}


function parseDate(sDate)
{
	if(sDate == "")
		return null;
	var arrFullDate = String(sDate).split(" ");
	var arrDate = String(arrFullDate[0]).split("-");
	sResultDate = arrDate[2] + "." + arrDate[1] + "." + arrDate[0] + " " + arrFullDate[1];
	return Date(sResultDate);
}

function syncStatistics()
{
	LibrarySystemDoc = getLibrarySystemDoc();
	teLibrarySystem = LibrarySystemDoc.TopElem;
	sLibraryCode = teLibrarySystem.code.Value;
	try
	{
		iMinPercent = teLibrarySystem.get_setting("min_percent");
		if ( iMinPercent == undefined )
		{
			iMinPercent = 95.0;
		}
		else
		{
			iMinPercent = OptReal(iMinPercent.value, 95.0);
		}
	}
	catch(_xxx)
	{
		iMinPercent = 95.0;
	}
	/*-------------- Categories sync --------------*/
	var dLastUpdateDate = Date();
	var fldSyncSetting = teLibrarySystem.get_setting("last_sync_time");
	var bSendEmail = tools_web.is_true( teLibrarySystem.get_setting("send_email").value );
	if(fldSyncSetting.value != "")
	{
		dLastUpdateDate = Date(fldSyncSetting.value);
	}
	sDate = StrXmlDate(dLastUpdateDate, false, false) + " " + StrTime(dLastUpdateDate) + ":00";
	
	iOffset = 0;
	iLimit = 500;
	do{
		aUsers = [];
		oMethodParams = {limit: iLimit, offset: iOffset, since: sDate};
		arrResult = callMethod("statistic/progress", "get", oMethodParams );
		for(oData in arrResult)
		{
			iCollId = null;
			sEmail = null;
			if(oData.HasProperty("external_id"))
			{
				iCollId = Int(oData.external_id);
			}
			else
			{			
				if(oData.HasProperty("email"))
				{
					sEmail = oData.email;
					oUser = ArrayOptFindBySortedKey( aUsers, sEmail, "email" );
					if ( oUser == undefined )
					{
						if ( bSendEmail )
						{
							catColl = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/email=" + XQueryLiteral( oData.email ) + " return $elem"));
						}
						else
						{
							catColl = ArrayOptFirstElem(XQuery("for $elem in collaborators where doc-contains($elem/id,'wt_data'," + XQueryLiteral( "[alpina_user_email=" + oData.email + "~string]" ) + ") return $elem"));
						}
						if(catColl != undefined)
						{
							iCollId = catColl.id;
							aUsers.push( { id: catColl.id.Value, email: sEmail } );
							aUsers = ArraySort( aUsers, "email", "+" );
						}
						else
							continue;
					}
					else
					{
						iCollId = oUser.id;
					}
				}
				else
				{				
					continue;
				}
			}
			sItemId = sLibraryCode + "_" + oData.item_id;
			catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sItemId + "' return $elem"));
			if(catMaterial != undefined)
			{
				docViewing = null;
				catViewing = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings where $elem/material_id=" + catMaterial.id + " and $elem/person_id=" + iCollId + " return $elem"));
				if(catViewing == undefined)
				{
					docViewing = OpenNewDoc( "x-local://wtv/wtv_library_material_viewing.xmd" );
					docViewing.BindToDb( DefaultDb );
					docViewing.TopElem.material_id = catMaterial.id;
					docViewing.TopElem.person_id = iCollId;
					tools.common_filling( "collaborator", docViewing.TopElem, iCollId);
				}
				else
				{
					docViewing = OpenDoc(UrlFromDocID(catViewing.id));
				}
				if(oData.HasProperty("updated_at"))
				{
					docViewing.TopElem.last_viewing_date = parseDate(oData.updated_at);
				}
				if(!docViewing.TopElem.start_viewing_date.HasValue)
					docViewing.TopElem.start_viewing_date = docViewing.TopElem.last_viewing_date;
				_duration = OptInt(oData.GetOptProperty("total_duration",""));
				if (_duration != undefined)
					docViewing.TopElem.duration = _duration;
				
				_percent = OptReal(oData.GetOptProperty("percent",""));
				if ( _percent <= iMinPercent )
				{
					docViewing.TopElem.state_id = "active";
				}
				else if(docViewing.TopElem.state_id != "finished")
				{
					docViewing.TopElem.state_id = "finished";				
					docViewing.TopElem.finish_viewing_date = docViewing.TopElem.last_viewing_date;
				}
				
				_chapter = OptInt(oData.GetOptProperty("chapter",""));
				if (_chapter != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_chapter").value = _chapter;
				
				_chapter_percent = OptInt(oData.GetOptProperty("chapter_percent",""));
				if (_chapter_percent != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_chapter_percent").value = _chapter_percent;
				
				_index = OptInt(oData.GetOptProperty("index",""));
				if (_index != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_index").value = _index;
				
				_location = OptInt(oData.GetOptProperty("location",""));
				if (_location != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_location").value = _location;
				
				_cfi = OptInt(oData.GetOptProperty("cfi",""));
				if (_cfi != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_cfi").value = _cfi;
				
				_item_type = OptInt(oData.GetOptProperty("item_type",""));
				if (_item_type != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_item_type").value = _item_type;
				
				_id = OptInt(oData.GetOptProperty("id",""));
				if (_id != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_id").value = _id;
				
				_user_id = OptInt(oData.GetOptProperty("user_id",""));
				if (_user_id != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_user_id").value = _user_id;
				
				_percent = OptInt(oData.GetOptProperty("percent",""));
				if (_percent != undefined)
					docViewing.TopElem.custom_elems.ObtainChildByKey("ext_library_percent").value = _percent;
				
				docViewing.Save();
			}
			
		}
		iOffset += iLimit;
	}
	while(ArrayCount(arrResult) > 0)
	fldSyncSetting.value = Date();
	LibrarySystemDoc.Save();
}