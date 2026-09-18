// Доступные переменные: oParams, teLibrarySystem.
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

function getLoggerName() {
	return "alkhateeb_mif_log";
}

function getReaderUrl(oParams) {	
	try {
		addLogMessage(getLoggerName(), "-------------------");
		addLogMessage(getLoggerName(), "[getReaderUrl]");

		iMaterialId = Int(oParams.GetOptProperty("iMaterialId"));
		iUserId = Int(oParams.GetOptProperty("iUserId"));
		teMaterial = OpenDoc(UrlFromDocID(iMaterialId)).TopElem;
		teLibrarySystem = getLibrarySystem();
		sLibraryCode = teLibrarySystem.code.Value;
		sLibUrl = teLibrarySystem.get_setting("lib_url").value;
		sExternalId = teMaterial.external_id;
		
		if (StrBegins(sExternalId,sLibraryCode+"_")) {
			sExternalId = StrReplaceOne(sExternalId,sLibraryCode+"_","");
		}

		arrResult = callMethod("books/"+sExternalId, "");
		bEbook = tools_web.is_true(arrResult.ebook);
		sExp = String(arrResult.ebook_expire);
		
		if (bEbook && sExp!="" && Date(sExp)>=DateNewTime(Date())) {
			return ("/view_play_resource.html?object_id=" + iMaterialId);
		}

		//sExternalId = getFileId(sExternalId, "pdf");
		sReaderUrl = UrlAppendPath(sLibUrl, ("/#/book/" + sExternalId + "/ebook")) + "?jwt=" + generateJWT(iUserId, teLibrarySystem);	

		addLogMessage(getLoggerName(), "[getReaderUrl] URL: " + sReaderUrl);
	} catch (e) {
		addLogMessage(getLoggerName(), "[getReaderUrl] ERROR: " + e);
	}

	return sReaderUrl;
}

function getDownLoadUrl(oParams) {
	iMaterialId = Int(oParams.GetOptProperty("iMaterialId"));
	iUserId = Int(oParams.GetOptProperty("iUserId"));
	teMaterial = OpenDoc(UrlFromDocID(iMaterialId)).TopElem;
	teLibrarySystem = getLibrarySystem();
	sLibraryCode = teLibrarySystem.code.Value;
	sLibUrl = teLibrarySystem.get_setting("lib_url").value;
	sExternalId = teMaterial.external_id;

	if (StrBegins(sExternalId,sLibraryCode+"_")) {
		sExternalId = StrReplaceOne(sExternalId,sLibraryCode+"_","");
	}

	sExternalId = getFileId(sExternalId, "pdf");
	sDownLoadUrl = UrlAppendPath(sLibUrl, ("/books/download")) + "?id=" + sExternalId + "&jwt=" + generateJWT(iUserId, teLibrarySystem);	
	
	return sDownLoadUrl;
}

function getFileId(sBookIdParam, sFormatParam) {
	sParams = "book_id="+sBookIdParam;
	arrResult = callMethod("books/files", sParams);
	oBook = ArrayOptFind(arrResult,"This.format=="+CodeLiteral(sFormatParam));
	
	if (oBook!=undefined) {
		return String(oBook.file_id);
	} else {
		return 0;
	}
}

function getLibrarySystemDoc() {
	try {
		docLibrarySystem
	} catch(__lsyserror) {
		docLibrarySystem = OpenDoc(UrlFromDocID(ArrayOptFirstElem(XQuery("for $elem in library_systems where $elem/code='mif' return $elem")).id));
	}

	return docLibrarySystem;
}

function getLibrarySystem(){
	return getLibrarySystemDoc().TopElem;
}

function getFileSource(){
	return getFileSourceDoc().TopElem;
}

function getFileSourceDoc(){
	try  {
		docFileSource
	} catch(__lsyserror) {
		docFileSource = OpenDoc(UrlFromDocID(ArrayOptFirstElem(XQuery("for $elem in file_sources where $elem/code='mif' return $elem")).id));
	}

	return docFileSource;
}

function getFileSystem(){
	return getFileSystemDoc().TopElem;
}


function encodeParams(oParamsParam) {
	sResult = UrlEncodeQuery(oParamsParam);
	sResult = StrReplace(sResult, "%2E", ".");
	sResult = StrReplace(sResult, "%20", "+");
	sResult = StrReplace(sResult, "%2D", "-");	

	return sResult;
}

function addUrlParams(oParamsParam) {
	if (oParamsParam == undefined) {
		return "";
	} 
	
	_result = "";
	
	for (_v in oParamsParam) {
		_result += "&" + _v + "=" + UrlEncode(oParamsParam.GetProperty(_v));
	}

	return _result;
}

function callMethod(sApiMethod, oParamsParam) {
	addLogMessage(getLoggerName(), "[callMethod] sApiMethod: " + sApiMethod);

	teLibrarySystem = getLibrarySystem();
	sApiUrl = teLibrarySystem.get_setting("api_url").value; 
	sApiKey = teLibrarySystem.get_setting("api_key").value;
	sSecretToken = teLibrarySystem.get_setting("secret_token").value;
	sLibID = teLibrarySystem.get_setting("lib_id").value;
	sUser = teLibrarySystem.get_setting("user").value;
	sHeaders = "Accept: application/json";	

//	if(oParamsParam == undefined)
//		oParamsParam = new Object();
	if(oParamsParam == undefined) {
		oParamsParam = ""
	} else {
		oParamsParam = "&"+oParamsParam;
	}
	

	addLogMessage(getLoggerName(), "[callMethod] sApiUrl: " + sApiUrl);
	addLogMessage(getLoggerName(), "[callMethod] sLibID: " + sLibID);
	addLogMessage(getLoggerName(), "[callMethod] sSecretToken: " + sSecretToken);
	addLogMessage(getLoggerName(), "[callMethod] Encoded.sSecretToken: " + UrlEncode(sSecretToken));
	addLogMessage(getLoggerName(), "[callMethod] sUser: " + sUser);
	addLogMessage(getLoggerName(), "[callMethod] Encoded.sUser: " + UrlEncode(sUser));
	addLogMessage(getLoggerName(), "[callMethod] UrlAppendPath: " + UrlAppendPath(sApiUrl, "sso"));
	addLogMessage(getLoggerName(), "[callMethod] LoginFullUrl: " + UrlAppendPath(sApiUrl, "sso") + "?lib=" + sLibID + "&secret=" + UrlEncode(sSecretToken) + "&login=" + UrlEncode(sUser));

	if (sApiKey=="" && sSecretToken!="" && sLibID!="" && sUser!="") {
		sUrl = UrlAppendPath(sApiUrl, "sso") + "?lib=" + sLibID + "&secret=" + UrlEncode(sSecretToken) + "&login=" + UrlEncode(sUser);
		
		//alert("sUrl: " + sUrl);
		//alert("sUser: " + sUser);
		
		oResp = HttpRequest(sUrl, "get");	
		
		//alert("sApiMethod: " + sApiMethod);
		//alert("sApiKey:" + sApiKey);
		//alert("sSecretKey:" + sSecretToken);
		//alert(oResp.Body);

		if (Trim(String(oResp.Body))!="") {
			sApiKey = Trim(String(oResp.Body));

			//alert("sApiKey:" + sApiKey);
			
			try {
				docLibrarySystem = getLibrarySystemDoc();
				docLibrarySystem.TopElem.get_setting("api_key").value = sApiKey;
				docLibrarySystem.Save();
			} catch(_no_Doc) {
				alert(_no_Doc);
			}
		}
	}
	
	//alert("sApiMethod: " + sApiMethod);
	//alert("sApiKey:" + sApiKey);
	//alert("sSecretKey:" + sSecretToken);
	
	sUrl = UrlAppendPath(sApiUrl, sApiMethod) + "?access-token=" + sApiKey + "&lib=" + sLibID + oParamsParam;
	//alert("sUrl: " + sUrl);

	addLogMessage(getLoggerName(), "[callMethod] URL: " + sUrl);

	oResp = HttpRequest(sUrl, "get", null, sHeaders);
	//alert(oResp.Body);

	return ParseJson(oResp.Body);
}

function syncData() {	
	docLibrarySystem = getLibrarySystemDoc();
	docLibrarySystem.TopElem.get_setting("api_key").value = "";
	docLibrarySystem.Save();
	teLibrarySystem = getLibrarySystem();
	iRootCategoryId = OptInt(teLibrarySystem.get_setting("root_category_id").value);
	iFormatTypeId = OptInt(teLibrarySystem.get_setting("format_type_id").value);
	sLibraryCode = teLibrarySystem.code.Value;
	/*-------------- Categories sync -------------*/
	arrResult = callMethod("categories");

	function syncCategories(arrCategories, iParentCategoryId) {
		for(oCategory in arrCategories) {
			sCategory = sLibraryCode + "_" + oCategory.id;
			catCategory = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' and $elem/parent_object_id = " + iParentCategoryId + " return $elem"));
			
			if(catCategory == undefined) {
				docCategory = OpenNewDoc("x-local://wtv/wtv_library_section.xmd");
				docCategory.BindToDb(DefaultDb);
				docCategory.TopElem.external_id = sCategory;
				docCategory.TopElem.parent_object_id = iParentCategoryId;
			} else {
				docCategory = OpenDoc(UrlFromDocID(catCategory.id));
			}

			docCategory.TopElem.name = oCategory.name;
			docCategory.TopElem.position = oCategory.priority;
			docCategory.TopElem.comment = oCategory.text;
			docCategory.Save();
		}
	}

	syncCategories(arrResult, iRootCategoryId);
	/*-------------- Materials sync -------------*/
	pageCount = 1;
	pageNum = 1;
	pageMax = 100000;
	isNextPage = true;
	iFileSourceID = getFileSourceDoc().DocID;
	while (isNextPage) {
		arrResult = callMethod("books", ("&page="+pageNum));
		pageNum++;
		curCount = ArrayCount(arrResult);
		if (curCount > pageCount) {
			pageCount = curCount;
		}

		if (curCount < pageCount || pageNum > pageMax) {
			isNextPage = false;
		}

		for(oItem in arrResult) {
			sItemId = sLibraryCode + "_" + oItem.id;
			bHasBook = oItem.HasProperty("ebook_expire") && String(oItem.ebook_expire)!="";
			
			if (bHasBook) {
				try {
					if(Date(String(oItem.ebook_expire))<DateNewTime(Date()))
					{
						bHasBook = false;
					}
				} catch(_date_not_correct_) {
					continue;
				}
			}		

			catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sItemId + "' return $elem"));
			
			if (catMaterial == undefined && !bHasBook) {
				continue;
			} else if (catMaterial == undefined) {
				docMaterial = OpenNewDoc("x-local://wtv/wtv_library_material.xmd");
				docMaterial.BindToDb(DefaultDb);
				docMaterial.TopElem.external_id = sItemId;
				docMaterial.TopElem.library_material_formats.ObtainChildByKey(iFormatTypeId);
				docMaterial.TopElem.allow_download = false;
			} else {
				docMaterial = OpenDoc(UrlFromDocID(catMaterial.id));
			}

			docMaterial.TopElem.name = oItem.name;
			docMaterial.TopElem.description = oItem.description;
			docMaterial.TopElem.library_system_id = teLibrarySystem.id;
			docMaterial.TopElem.author = oItem.authors;
			iCategoryId = ArrayOptFirstElem(oItem.categories);
			
			if(iCategoryId == undefined) {
				iCategoryId = iRootCategoryId;
			}
					
			if(iCategoryId != null && bHasBook) {
				sCategory = sLibraryCode + "_" + iCategoryId;
				catSection = ArrayOptFirstElem(XQuery("for $elem in library_sections where $elem/external_id='" + sCategory + "' and $elem/parent_object_id = " + iRootCategoryId + " return $elem"));
				if(catSection == undefined) {
					continue;
				}

				docMaterial.TopElem.section_id = catSection.id;					
			} else if (!bHasBook) {
				docMaterial.TopElem.section_id.Clear();
			}
			
			if(oItem.HasProperty("cover")) {
				try {
					oImageResp = HttpRequest(oItem.cover, "get");
					if (docMaterial.TopElem.image.HasValue && docMaterial.TopElem.image.OptForeignElem!=undefined) {
						docResource = tools.open_doc(docMaterial.TopElem.image);
					} else {
						docResource = OpenNewDoc('x-local://wtv/wtv_resource.xmd');
						docResource.BindToDb(DefaultDb);
					}

					docResource.TopElem.name = docMaterial.TopElem.name + " - " + " обложка";
					docResource.TopElem.put_str(oImageResp.Body, docMaterial.DocID + UrlPathSuffix(oItem.cover), docMaterial.TopElem);
					docResource.Save();
					docMaterial.TopElem.image = docResource.DocID;
					docMaterial.TopElem.resource_id = docResource.DocID;
				} catch(ex) {
					alert(ex);
				}
			}
			
			if (!docMaterial.TopElem.file_name.HasValue || docMaterial.TopElem.file_name.OptForeignElem==undefined) {
				docResource = OpenNewDoc('x-local://wtv/wtv_resource.xmd');
				docResource.BindToDb(DefaultDb);
			} else {
				docResource = OpenDoc(UrlFromDocID(docMaterial.TopElem.file_name));
			}

			docResource.TopElem.code = docMaterial.TopElem.code;
			docResource.TopElem.name = docMaterial.TopElem.name;
			docResource.TopElem.file_source = iFileSourceID;
			docResource.TopElem.file_name = docMaterial.DocID+".pdf";
			docResource.TopElem.file_url = "x-local://trash/temp/"+docResource.TopElem.file_name;
			docResource.TopElem.guess_type(docResource.TopElem.file_url);
			docResource.Save();
			docMaterial.TopElem.file_name = docResource.DocID;
			
			docMaterial.Save();
		}
	}
}


function parseDate(sDate) {
	if(sDate == "") {
		return null;
	}

	var arrFullDate = String(sDate).split(" ");
	var arrDate = String(arrFullDate[0]).split("-");
	
	sResultDate = arrDate[2] + "." + arrDate[1] + "." + arrDate[0] + " " + arrFullDate[1];
	
	return Date(sResultDate);
}

function syncStatistics() {
	docLibrarySystem = getLibrarySystemDoc();
	docLibrarySystem.TopElem.get_setting("api_key").value = "";
	docLibrarySystem.Save();
	teLibrarySystem = getLibrarySystem();
	sLibraryCode = teLibrarySystem.code.Value;

	dLastUpdateDate = Date();
	fldSyncSetting = teLibrarySystem.get_setting("last_sync_time");
	
	if(fldSyncSetting.value != "") {
		dLastUpdateDate = Date(fldSyncSetting.value);
	}

	sDate = StrXmlDate(dLastUpdateDate, false, false) + " " + StrTime(dLastUpdateDate) + ":00";
	sCurDate = StrXmlDate(Date(), false, false) + " " + StrTime(Date()) + ":00";

	//alert("****************mif syncStatistics***************");

	oMethodParams = "dateFrom=" + (fldSyncSetting.value != ""?sDate:"") + "&dateTo=" + sCurDate;
	arrResult = callMethod("statistics", "get", oMethodParams);

	//alert("CntResult: " + ArrayCount(arrResult));

	for(oData in arrResult) {
		catColl = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/email='" + oData.userEmail + "' return $elem"));
		
		if(catColl != undefined) {
			iCollId = catColl.id;
		} else {
			continue;
		}

		sBookId = sLibraryCode + "_" + oData.bookId;
		//alert("sBookId: " + sBookId);

		catMaterial = ArrayOptFirstElem(XQuery("for $elem in library_materials where $elem/external_id='" + sBookId + "' return $elem"));
		//alert("for $elem in library_materials where $elem/external_id='" + sBookId + "' return $elem");

		if(catMaterial != undefined) {
			docViewing = null;
			catViewing = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings where $elem/material_id=" + catMaterial.id + " and $elem/person_id=" + iCollId + " return $elem"));
			
			//alert("catViewing: " + "for $elem in library_material_viewings where $elem/material_id=" + catMaterial.id + " and $elem/person_id=" + iCollId + " return $elem");
			
			if(catViewing == undefined) {
				//alert("new");

				docViewing = OpenNewDoc("x-local://wtv/wtv_library_material_viewing.xmd");
				docViewing.BindToDb(DefaultDb);
				docViewing.TopElem.material_id = catMaterial.id;
				docViewing.TopElem.person_id = iCollId;
				tools.common_filling("collaborator", docViewing.TopElem, iCollId);
				docViewing.TopElem.start_viewing_date = Date(sDate);
			} else {

				//alert("current");

				docViewing = OpenDoc(UrlFromDocID(catViewing.id));
			}

			docViewing.TopElem.state_id = "active";
			docViewing.Save();
		}
	}

	docLibrarySystem = getLibrarySystemDoc();
	docLibrarySystem.TopElem.get_setting("last_sync_time").value = Date(sCurDate);
	docLibrarySystem.Save();
}

function ReplaceBase64Encode(sValue) {
	sValue = StrReplace(sValue, "=", "");
	sValue = StrReplace(sValue, "+", "-");
	sValue = StrReplace(sValue, "/", "_");

	return sValue;
}

function generateJWT(iUserId, teLibrarySystem) {
	
	var oHeader = {
		alg: "HS256"
	};
	
	try {
		sAud = String(teLibrarySystem.get_setting("audience").value);
	} catch(sddf) {
		sAud = "";
	}

	if (sAud=="") {
		sAud = String(UrlHost(teLibrarySystem.get_setting("lib_url").value)).split(".")[0];
	}

	try {
		email = tools.open_doc(iUserId).TopElem.email+'';
	} catch(_Zzz) {
		email = "";
	}
	
	var oPayload = {
	  "aud": sAud,
	  "exp": (DateToRawSeconds(Date())+86400),
	  "sub": email
	};

	var sSecretToken = teLibrarySystem.get_setting("secret_token").value;
	
	try {
		bDotnetcore = AppConfig.GetProperty('DOTNETCORE') == '1';
	} catch(_slsjj) {
		bDotnetcore = false;
	}

	if (bDotnetcore) {
		var oAssembly = tools.dotnet_host.Object.GetAssembly("Websoft.Utils.dll");
		var oCrypto = oAssembly.CreateClassObject("Websoft.Utils.Crypto");
	} else {
		var oCrypto = new ActiveXObject("Websoft.Utils.Crypto");
	}

	var sWSToken = 	Base64Encode(EncodeJson(oHeader)) + "." + 
					Base64Encode(EncodeJson(oPayload));
	sWSToken = ReplaceBase64Encode(sWSToken);

	sWSToken += "." + (oCrypto.HMAC_SHA256(sWSToken, sSecretToken));
	sWSToken = ReplaceBase64Encode(sWSToken);

	return sWSToken;
}