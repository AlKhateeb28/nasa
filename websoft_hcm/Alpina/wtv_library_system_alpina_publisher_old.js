// Доступные переменные: oParams, teLibrarySystem.

function getReaderUrl(oParams)
{	
	iMaterialId = Int(oParams.GetOptProperty("iMaterialId"));
	iUserId = Int(oParams.GetOptProperty("iUserId"));
	teMaterial = OpenDoc(UrlFromDocID(iMaterialId)).TopElem;
	teLibrarySystem = getLibrarySystem();
	sLibraryCode = teLibrarySystem.code.Value;
	sLibUrl = teLibrarySystem.get_setting("lib_url").value;
	sExternalId = teMaterial.external_id;
	if (StrBegins(sExternalId,sLibraryCode+"_"))
		sExternalId = StrReplaceOne(sExternalId,sLibraryCode+"_","");

	try 
	{
		oMethodParams = {"login": String(OpenDoc(UrlFromDocID(iUserId)).TopElem.email.Value)};
		arrResult = callMethod('sso', 'post', oMethodParams);
		ssoToken = arrResult[0].token;
	}
	catch(_sdfr)
	{
		ssoToken = "0";
	}
    sReaderUrl = UrlAppendPath( sLibUrl, ("/sso/" + ssoToken) ) + "/?redirect=/reader/book/" + sExternalId;
	alert(sReaderUrl);
	return sReaderUrl;
}

function getLibrarySystemDoc(){
	try 
	{
		docLibrarySystem
	}
	catch(__lsyserror)
	{
		docLibrarySystem = OpenDoc(UrlFromDocID(ArrayOptFirstElem(XQuery("for $elem in library_systems where $elem/code='alpina' return $elem")).id));
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

function callMethod(sApiMethod, sMethodParam, oParamsParam)
{
	teLibrarySystem = getLibrarySystem();
	sApiUrl = "https://api5.alpinadigital.ru/api/v2/b2b/";
	sApiKey = teLibrarySystem.get_setting("api_key").value;
	sSecretKey = teLibrarySystem.get_setting("secret_key").value;
	//sSecretKeyMd5 = StrLowerCase(Md5Hex(sSecretKey));
	sHeaders = "X-Auth-Token: " + sApiKey + "\n";
	
	if(oParamsParam == undefined)
		oParamsParam = new Object();
	sEncryptedString = StrLowerCase(Md5Hex(encodeParams(oParamsParam) + sSecretKey));
	oParamsParam.SetProperty("sig",sEncryptedString);
	
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
			catCategory = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' and $elem/parent_object_id = " + iParentCategoryId + " return $elem"));
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
	do{
		oMethodParams = {limit: iLimit, offset: iOffset, type: "book"};
		arrResult = callMethod("items", "get", oMethodParams);
		for(oItem in arrResult)
		{
			sItemId = sLibraryCode + "_" + oItem.id;
			catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sItemId + "' return $elem"));
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
			}
			docMaterial.TopElem.name = oItem.name;
			docMaterial.TopElem.description = oItem.description;	
			docMaterial.TopElem.year = oItem.year;	
			docMaterial.TopElem.library_system_id = teLibrarySystem.id;
			docMaterial.TopElem.author = ArrayMerge(ArraySelect(oItem.creators, "This.type=='author'"),"This.full_name",",");
			docMaterial.TopElem.publisher = ArrayMerge(ArraySelect(oItem.creators, "This.type=='publisher'"),"This.full_name",",");
			iCategoryId = ArrayOptFirstElem(oItem.categories);
			if(iCategoryId == undefined)
				iCategoryId = iRootCategoryId;
			if(iCategoryId != null)
			{
				sCategory = sLibraryCode + "_" + iCategoryId;
				catSection = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' and $elem/parent_object_id = " + iRootCategoryId + " return $elem"));
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
	/*-------------- Categories sync --------------*/
	dLastUpdateDate = Date();
	fldSyncSetting = teLibrarySystem.get_setting("last_sync_time");
	if(fldSyncSetting.value != "")
	{
		dLastUpdateDate = Date(fldSyncSetting.value);
	}
	sDate = StrXmlDate(dLastUpdateDate, false, false) + " " + StrTime(dLastUpdateDate) + ":00";
	
	iOffset = 0;
	iLimit = 100;
	do{
		oMethodParams = {limit: iLimit, offset: iOffset, since: sDate};
		arrResult = callMethod("statistic", "get", oMethodParams );
		for(oData in arrResult)
		{
			if(oData.HasProperty("external_id"))
			{
				iCollId = Int(oData.external_id);
			}
			else
			{			
				if(tools_web.is_true( teLibrarySystem.get_setting("send_email").value) && oData.HasProperty("email"))
				{
					catColl = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/email='" + oData.email + "' return $elem"));
					if(catColl != undefined)
						iCollId = catColl.id;
					else
						continue;
				}
				else
				{				
					continue;
				}
			}
			sItemId = sLibraryCode + "_" + oData.item_id;
alert("sItemId: " + sItemId);

			catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sItemId + "' return $elem"));
alert("for $elem in library_materials where $elem/external_id='" + sItemId + "' return $elem");

			if(catMaterial != undefined)
			{
				docViewing = null;
				catViewing = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings where $elem/material_id=" + catMaterial.id + " and $elem/person_id=" + iCollId + " return $elem"));
alert("for $elem in library_material_viewings where $elem/material_id=" + catMaterial.id + " and $elem/person_id=" + iCollId + " return $elem");

				if(catViewing == undefined)
				{
alert("new library_material_viewing");
					docViewing = OpenNewDoc( "x-local://wtv/wtv_library_material_viewing.xmd" );
					docViewing.BindToDb( DefaultDb );
					docViewing.TopElem.material_id = catMaterial.id;
					docViewing.TopElem.person_id = iCollId;
					tools.common_filling( "collaborator", docViewing.TopElem, iCollId);
				}
				else
				{
alert("current library_material_viewing");
					docViewing = OpenDoc(UrlFromDocID(catViewing.id));
				}
				if(oData.HasProperty("updated_at"))
				{
					docViewing.TopElem.last_viewing_date = parseDate(oData.updated_at);
				}
				if(!docViewing.TopElem.start_viewing_date.HasValue)
					docViewing.TopElem.start_viewing_date = docViewing.TopElem.last_viewing_date;
				docViewing.TopElem.duration = Int(oData.time);
				if(Int(oData.progress) != 100)
				{
					docViewing.TopElem.state_id = "active";
				}
				else if(docViewing.TopElem.state_id != "finished")
				{
					docViewing.TopElem.state_id = "finished";				
					docViewing.TopElem.finish_viewing_date = docViewing.TopElem.last_viewing_date;
				}
				docViewing.Save();
			}
			
		}
		iOffset += iLimit;
	}
	while(ArrayCount(arrResult) > 0)
	fldSyncSetting.value = Date();
	LibrarySystemDoc.Save();
}