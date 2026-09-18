<%
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

	function getOpenUrl(playerTopElem, OBJECTID, OBJECT, contextObjID, sub_id, OOID ) {
		var _sUrl = playerTopElem.player_url.Value + (StrContains(playerTopElem.player_url.Value, "?") ? "&" : "?") + "player_id=" + playerTopElem.id.Value + "&object_id=" + OptInt(OBJECTID, "") + "&sub_id=" + UrlEncode(sub_id) + "&ooid=" + OOID;
		
		if (OptInt(contextObjID) != undefined) {
			_sUrl += "&context_id=" + contextObjID;
		}

		return _sUrl;
	}

	function setResourceAndContext(sType, bIngnoreContext) {
		var sErrorMsg = null;
		switch (sType) {
			case "resource":
				currentResDoc = curObjectDoc;
				currentRes = curObject;
				currentResID = curObjectID;
				break;
			/*
			case "personnel_document":
				currentResDoc = curObjectDoc;
				currentRes = curObject;
				currentResID = curObjectID;
				break;
			*/
			case "library_material":
				currentResDoc = tools.open_doc(curObject.file_name);
				if (currentResDoc != undefined && currentResDoc.TopElem.Name == "resource") {
					currentRes = currentResDoc.TopElem;
					currentResID = currentResDoc.DocID;

					if (!bIngnoreContext)
					{
						var catLibView = ArrayOptFirstElem(XQuery("for $elem in library_material_viewings where $elem/person_id=" + curUserID + " and $elem/material_id = " + curObjectID + " and $elem/state_id != 'finished' order by $elem/modification_date descending return $elem/Fields('id')"));

						var iEducationPlanID = OptInt( Request.Query.GetOptProperty( "education_plan_id", "" ), 0 );
						var docEducationPlan = undefined;
						var bEduChanged = false;

						if (catLibView != undefined)
						{
							contextObjectID = catLibView.id.Value;
							contextObjectDoc = OpenDoc(UrlFromDocID(contextObjectID));
							contextObject = contextObjectDoc.TopElem;
							contextObject.last_viewing_date = Date();
							if ( !contextObject.education_plan_id.HasValue && iEducationPlanID > 0 )
							{
								docEducationPlan = tools.open_doc( iEducationPlanID );
								if ( docEducationPlan != undefined )
								{
									if ( docEducationPlan.TopElem.type == "collaborator" )
									{
										for ( _task in docEducationPlan.TopElem.programs )
										{
											if ( _task.type == "material" && _task.catalog_name == "library_material" && _task.object_id == curObjectID && !_task.result_object_id.HasValue )
											{
												_task.result_object_id = contextObjectID;
												_task.result_type = "library_material_viewing";
												_task.result_object_code = contextObject.code;
												_task.result_object_name = contextObject.material_name;
												bEduChanged = true;
											}
										}
										if ( bEduChanged )
										{
											docEducationPlan.Save();
										}
									}
									contextObject.education_plan_id = iEducationPlanID;
								}
							}
							contextObjectDoc.Save();
						}
						else
						{
							contextObjectDoc = OpenNewDoc( "x-local://wtv/wtv_library_material_viewing.xmd" );
							contextObjectDoc.BindToDb( DefaultDb );
							contextObject = contextObjectDoc.TopElem;
							contextObject.material_id = curObjectID;
							contextObject.material_name = curObject.name;
							contextObject.person_id = curUserID;
							contextObject.start_viewing_date = Date();
							tools.common_filling( "collaborator", contextObject, curUserID, curUser);
							if ( iEducationPlanID > 0 )
							{
								docEducationPlan = tools.open_doc( iEducationPlanID );
								if ( docEducationPlan != undefined )
								{
									if ( docEducationPlan.TopElem.type == "collaborator" )
									{
										for ( _task in docEducationPlan.TopElem.programs )
										{
											if ( _task.type == "material" && _task.catalog_name == "library_material" && _task.object_id == curObjectID && !_task.result_object_id.HasValue )
											{
												_task.result_object_id = contextObjectID;
												_task.result_type = "library_material_viewing";
												_task.result_object_code = contextObject.code;
												_task.result_object_name = contextObject.material_name;
												bEduChanged = true;
											}
										}
										if ( bEduChanged )
										{
											docEducationPlan.Save();
										}
									}
									contextObject.education_plan_id = iEducationPlanID;
								}
							}
							contextObjectDoc.Save();
							contextObjectID = contextObjectDoc.DocID;


							ms_tools.raise_system_event_env( "portal_library_material_start_viewing", {
								"iLibraryMaterialID": curObjectID,
								"teLibraryMaterial": curObject,
								"curUser": curUser,
								"curUserID": curUserID,
								"docLibraryMaterial": curObjectDoc,
								"docMaterialViewing": contextObjectDoc
							});

						}
					}
				}
				else
					sErrorMsg = "Invalid source in library material " + CodeLiteral(curObject.name) + "[" +curObjectID+ "]";
				break;
			default:
				sErrorMsg = "Invalid source " + sType;
				break;
		}
		return sErrorMsg;
	}
	
	function curLngWebFn()
	{
		if (curLngWeb == null)
		{
			var curLngID = null;
			if (curUser != undefined && curUser != null && curUser.lng_id.HasValue && lngs.ChildByKeyExists( curUser.lng_id ) )
				curLngID = curUser.lng_id.Value;
			if ( curLngID == null )
				curLngID = global_settings.settings.default_lng.Value;
				
			curLngWeb = tools_web.get_cur_lng_obj( curLngID ).curLngWeb;
		}
		return curLngWeb;
	}
	
	var bNotAuthorized = false;
	try
	{
		//curObjectID;
		//curObjectDoc;
		//curObject;
		curUserID;
		curUser;
		curLngWeb;
		curDocID;
	}
	catch(_x_)
	{
		try
		{
			//curObjectID = Request.Session.Env.curObjectID;
			//curObjectDoc = Request.Session.Env.curObjectDoc;
			//curObject = curObjectDoc.TopElem;
			curUserID = Request.Session.Env.curUserID;
			if (curUserID === null)
				throw "empty user";
			curUser = Request.Session.Env.curUser;
			curLngWeb = Request.Session.Env.curLngWeb;
			curDocID = Request.Session.Env.GetOptProperty("curDocID", null);
		}
		catch(_o_)
		{
			if (StrContains(Request.Header.GetOptProperty("x-webtutor-app", ""), "Mobile"))
			{
				/*
				var sAuthType = tools_web.wtmobile_get_auth_inner_codename(Request.Url);
				if (sAuthType == "basic")
					bNotAuthorized = tools_web.user_init(Request, ({"auth_type": "mobile", "set_auth": "1", "logout": true})).access == false;
				else
				*/
				bNotAuthorized = tools_web.user_init(Request, Request.Query).access == false;
				if (!bNotAuthorized)
				{
					curUserID = Request.Session.Env.curUserID;
					curUser = Request.Session.Env.curUser;
					curLngWeb = Request.Session.Env.GetOptProperty("curLngWeb", null);
					curDocID = Request.Session.Env.GetOptProperty("curDocID", null);
				}
			}
			else
				bNotAuthorized = true;
		}
	}

	var loggerName = "alkhateeb_common_log";

	addLogMessage(loggerName, "-------------------");
	addLogMessage(loggerName, "Started");

	var docPlayer, currentResDoc, currentRes, currentResID, contextObjectDoc, contextObject, contextObjectID = null;
	var sError = null;
	var bRedirect = true;
	var SUB_ID = null;
	var oUseCMI5 = null;
	var sLearningName = null;
	var bExternal = false;
	var sUrl = null;
	var d = "";

	var info = OptInt(Request.QueryString.GetOptProperty("info"), 0); //1 - default download page, -1 - immediate download only, no players, -2 - download page only, no players
	var bVideoOverrideWidth = tools_web.is_true(Request.QueryString.GetOptProperty("override_width"), 0); // get rid of 861 max-width video player restriction
	
	try {
		Server.Execute("include/object_init.html");
	} catch(_x_) {
		try {
			curObjectID = Int(Request.QueryString.object_id);
			curObject = OpenDoc(UrlFromDocID(curObjectID)).TopElem;
		} catch(_o_) {
			sError = "Cannot initialize object. Error: " + _x_;
		}
	}

	curTemplateMain = true;

	if (sError != null) {
		//
	} else if (curObject == null || curObject == undefined) {
		sError = "Object ID not received";
	} else 
		switch (curObject.Name) {
			case "resource":

				/*** CONFIG: curObject = currentRes = <resource>, contextObject = null ***/
				if (bNotAuthorized && curObject.allow_unauthorized_download.Value != true) {
					Server.Execute("include/user_init.html");
					bNotAuthorized = false;
				}

				if ( !bNotAuthorized && !tools_web.check_access( curObject, curUserID, curUser, Request.Session ) ) {
					sError = tools_web.get_web_const( 'vap_message', curLngWebFn() );
				} else {
					sLearningName = "resource";
					sError = setResourceAndContext(curObject.Name, info < 0);
				}
				break;
			case "library_material":

				/*** CONFIG: curObject = <library_material>, currentRes = <resource>, contextObject = <library_material_viewing> ***/
				if (bNotAuthorized) {
					Server.Execute("include/user_init.html");
					bNotAuthorized = false;
				}

				if ( !bNotAuthorized && !tools_web.check_access( curObject, curUserID, curUser, Request.Session ) ) {
					sError = tools_web.get_web_const( 'vap_message', curLngWebFn() );
				} else {
					addLogMessage(loggerName, "curObject.library_system_id: " + curObject.library_system_id);
					addLogMessage(loggerName, "curObjectID: " + curObjectID);
					addLogMessage(loggerName, "curDocID: " + curDocID);
					addLogMessage(loggerName, "curUserID: " + curUserID);
					addLogMessage(loggerName, "Request.Session.sid: " + Request.Session.sid);
					addLogMessage(loggerName, "curObject.use_old_format.Value: " + curObject.use_old_format.Value);

					sUrl = CallServerMethod(
						"tools", 
						"call_library_system_method", 
						[
							curObject.library_system_id,
							"getReaderUrl",
							{
								"iMaterialId": curObjectID, 
								"iDocId": curDocID, 
								"iUserId": curUserID, 
								"sid": Request.Session.sid, 
								"flash": curObject.use_old_format.Value
							}
						]
					);

					addLogMessage(loggerName, "Finish. URL: " + sUrl);

					if (StrContains(sUrl, "view_play_resource.html")) {
						sUrl = null;
						sLearningName = "library_material_viewing";
						sError = setResourceAndContext(curObject.Name, info < 0);
					} else {
						bExternal = true;
					}
				}
				break;
			case "active_learning":
			case "learning":

				/*** CONFIG: curObject = <active_learning/learning>, currentRes = <resource>, contextObject = <learning_part_id> from part ***/

				//view_play_resource.html?object_id={ACTIVE_LEANING_ID}&sub_id={PART_CODE}

				SUB_ID = Trim(Request.Query.GetOptProperty("sub_id", ""));
				if (SUB_ID != "")
				{
					var fldPart = curObject.parts.GetOptChildByKey(SUB_ID);
					if (fldPart != undefined)
					{
						switch(fldPart.type)
						{
							case "library_material":
								if (bNotAuthorized)
								{
									Server.Execute("include/user_init.html");
									bNotAuthorized = false;
								}

							case "resource":


								sLearningName = "active_learning_" + fldPart.type;

								contextObjectID = curObjectID;
								contextObject = curObject;
								contextObjectDoc = curObjectDoc;

								curObjectID = fldPart.object_id.Value;
								curObjectDoc = tools.open_doc(curObjectID);

								if (curObjectDoc != undefined)
								{
									curObject = curObjectDoc.TopElem;
									sError = setResourceAndContext(curObject.Name, true);

									if (bNotAuthorized && !currentRes.allow_unauthorized_download.Value)
									{
										Server.Execute("include/user_init.html");
										bNotAuthorized = false;
									}

									curObjectID = contextObjectID;
									curObject = contextObject;
									curObjectDoc = contextObjectDoc;

									contextObjectID = fldPart.learning_part_id.Value;
									contextObject = null;

									if (contextObjectID == null)
									{
										oUseCMI5 = false;
										d += "resourcenoctx";
										//sError = "Part " + CodeLiteral(SUB_ID) + " has broken learning_part_id'. Active_learning " + contextObjectID;
									}
								}
								else
									sError = "Part " + CodeLiteral(SUB_ID) + " has broken resource ID '" +fldPart.object_id+ "'. Active_learning " + contextObjectID;
									
								if ( !bNotAuthorized && !tools_web.check_access( curObject, curUserID, curUser, Request.Session ) )
								{
									sError = tools_web.get_web_const( 'vap_message', curLngWebFn() );
								}

								break;
							default:
								sError = "Part " + CodeLiteral(SUB_ID) + " has invalid type " +CodeLiteral(fldPart.type)+ ". Active_learning " + curObjectID;
								break;
						}
					}
					else
					{
						sError = "Part " + CodeLiteral(SUB_ID) + " not found in active_learning " + curObjectID;
					}
				}

				break;
			default:
				sError = "Cannot identify current resource type " + CodeLiteral(curObject.Name);
				break;
		}

	var sBackUrl = Request.Query.GetOptProperty("redirect_url", "");
	//alert(sBackUrl);
	if (sBackUrl != "")
	{
		sBackUrl = StrReplace(Base64Decode(sBackUrl), "'", "");
		var sLBU = StrLowerCase(sBackUrl);
		if (StrContains(sLBU, "javascript") || StrContains(sLBU, "vbscript"))
			sError = "redirect_url XSS violation";
	}
	if (sError != null)
	{
		curErrorText = sError;
		Server.Execute("view_access_panel.html");
	}
	else
	{
		curErrorText = null;

		if (bNotAuthorized)
		{
			oUseCMI5 = false;
			d += "noauth";
		}

		if (bExternal)
		{
			//cmi5?
		}
		else if (!currentRes.allow_download.Value)
		{
			curErrorText = "Access to resource " + CodeLiteral(currentRes.name) + " is restricted. Download not allowed.";
			Server.Execute("view_access_panel.html");
		}
		else if (info >= 0 && currentRes.library_player_id.HasValue)
		{
			docPlayer = tools.open_doc(currentRes.library_player_id);
			if (docPlayer == undefined)
			{
				curErrorText = "Invalid player in resource ID [" + currentResID + "]";
				Server.Execute("view_access_panel.html");
			}
			else
			{
				//sUrl = docPlayer.TopElem.call("OPEN", currentResID, currentRes, contextObjectID, SUB_ID);
				//sUrl = getOpenUrl(docPlayer.TopElem, currentResID, currentRes, contextObjectID, SUB_ID);
				sUrl = getOpenUrl(docPlayer.TopElem, currentResID, currentRes, contextObjectID, SUB_ID, curObjectID);
				

				//if (docPlayer.TopElem.learning_storage_id.HasValue && docPlayer.TopElem.activity_id.HasValue && global_settings.disp_library.Value && oUseCMI5 !== false)
				if (global_settings.disp_library.Value && oUseCMI5 !== false && docPlayer.TopElem.cmi5.Value)
				{
					oUseCMI5 = ({"storage_id": docPlayer.TopElem.learning_storage_id.Value, "activity_id": docPlayer.TopElem.activity_id.Value});
				}
				else
				{
					if (!global_settings.disp_library.Value)
						d += "librarynolic";
					if (!docPlayer.TopElem.cmi5.Value)
						d += "playercmi5disabled";
				}
			}
		}
		else
		{
			var catOpenType = (info >= 0 ? ArrayOptFirstElem(tools_library.get_source_types(currentRes.file_name.Value, currentRes.type.Value)) : undefined);
			if (catOpenType != undefined && catOpenType.library_player_id.HasValue)
			{
				docPlayer = tools.open_doc(catOpenType.library_player_id);
				if (docPlayer == undefined)
				{
					curErrorText = "Invalid player in library material source type [" + catOpenType.PrimaryKey + "]";
					Server.Execute("view_access_panel.html");
				}
				else
				{
					//sUrl = docPlayer.TopElem.call("OPEN", currentResID, currentRes, contextObjectID, SUB_ID);
					//sUrl = getOpenUrl(docPlayer.TopElem, currentResID, currentRes, contextObjectID, SUB_ID);
					sUrl = getOpenUrl(docPlayer.TopElem, currentResID, currentRes, contextObjectID, SUB_ID, curObjectID);
					
					//if (docPlayer.TopElem.learning_storage_id.HasValue && docPlayer.TopElem.activity_id.HasValue && global_settings.disp_library.Value && oUseCMI5 !== false)
					if (global_settings.disp_library.Value && oUseCMI5 !== false && docPlayer.TopElem.cmi5.Value)
					{
						oUseCMI5 = ({"storage_id": docPlayer.TopElem.learning_storage_id.Value, "activity_id": docPlayer.TopElem.activity_id.Value});
					}
					else
					{
						if (!global_settings.disp_library.Value)
							d += "librarynolic";
						if (!docPlayer.TopElem.cmi5.Value)
							d += "playercmi5disabled";
					}
				}
			}
			else if (curObject.Name == "library_material" && !curObject.allow_download.Value)
			{
				curErrorText = "Access to material " + CodeLiteral(curObject.name) + " is restricted.";
				Server.Execute("view_access_panel.html");
			}
			else
			{
				sUrl = "/download_file.html?file_id=" + currentResID;
				if (Request.Query.HasProperty("sid"))
				{
					sUrl += "&sid=" + Request.Query.GetProperty("sid");
				}
				else if (Request.Session.HasProperty("sid"))
				{
					sUrl += "&sid=" + tools_web.get_sum_sid(currentResID, Request.Session.sid);
				}
				if (info == 1 || info == -2)
				{
					bRedirect = false;

					function stringifySize(iSize)
					{

						iSize = OptReal(iSize);

						if (iSize == undefined || iSize < 0)
							iSize = null;
						else
						{
							var base = 1024;
							var i = 0;
							var aPrefixes = (["", "K", "M", "Г", "Т", "П", "Э", "З", "И"]);

							while (iSize > base && base < 70368744177664)
							{
								iSize = iSize / base;
								base *= 1024;
								i++;
							}

							iSize = StrReal(iSize, 2) + " " + aPrefixes[i] + "байт";
						}
						return iSize;
					}

					var fldType = ArrayOptFindByKey(common.resource_types, (currentRes.type.HasValue ? currentRes.type : "file"), "id");
					if (fldType == undefined)
					{
						fldType = ArrayFirstElem(common.resource_types);
					}

%><!DOCTYPE html>
<html>
	<head>
		<title><%=currentRes.name%></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<style>
	html { font-size: 10px; font-family: sans-serif; }
	body { background-color: #eee; padding: 2rem;  }
	.wt-file-container { display: flex; flex-direction: column; box-sizing: border-box; position: relative; width: 30rem; margin: 0 auto; background-color: #fff; padding: 2rem; border-radius: 1rem;}
	.wt-file-icon { width: 26rem; height: 26rem; background-color: #eee; border-radius: 1rem; background-repeat: no-repeat; background-position: center center; }
	/*.wt-file-icon[wt-type='img'] { background-size: cover; }*/
	.wt-file-icon { background-size: 50%; background-image: url(icons/file_types/64/<%=fldType.id%>.png); }
	.wt-file-info { padding: 2rem 0; }
	.wt-file-table { width: 100%; border-spacing: 0; }
	.wt-file-table .wt-file-param-name { font-size: 1.4rem; color: #999; width: 50%; padding: 1rem 0; border-bottom: 1px solid #ccc; }
	.wt-file-table .wt-file-param-value { font-size: 1.4rem; font-weight: bold; width: 50%; padding: 1rem 0; border-bottom: 1px solid #ccc; }
	.wt-file-table tr:first-of-type .wt-file-param-name { border-top: 1px solid #ccc; }
	.wt-file-table tr:first-of-type .wt-file-param-value { border-top: 1px solid #ccc; }
	.wt-file-btn { background-color: #315DFA; color: #fff; border: none; padding: 1rem 2rem; font-size: 1.6rem; font-weight: bold; border-radius: 999999px; outline: none; }
	.wt-file-btn:not([disabled]):hover { cursor: pointer; color: #3598DB; }
		</style>
	<!--[if lte IE 8]>
		<style>
		   .wt-file-container { max-width: 420px; padding: 16px; font-size: 12px; }
		   .wt-file-icon { min-height: 130px; }
		   .wt-file-table .wt-file-param-name { padding: 8px 0 8px 8px; }
		   .wt-file-table .wt-file-param-value { padding: 8px; }
		   .wt-file-btn { display: block; padding: 8px 16px; margin: 16px auto 0 auto; }
		</style>
	<![endif]-->
	</head>

	<body>
		<div class="wt-file-container">
			<div class="wt-file-icon" wt-type="<%=fldType.id%>">&nbsp;</div>
			<div class="wt-file-info">
				<table class="wt-file-table">
					<tr>
						<td class="wt-file-param-name"><%=tools_web.get_web_const("c_name", curLngWebFn())%></td>
						<td class="wt-file-param-value"><%=currentRes.name%></td>
					</tr>
					<tr>
						<td class="wt-file-param-name"><%=tools_web.get_web_const("c_type", curLngWebFn())%></td>
						<td class="wt-file-param-value"><%=fldType.name%></td>
					</tr>
					<tr>
						<td class="wt-file-param-name"><%=tools_web.get_web_const("dataizmeneniya", curLngWebFn())%></td>
						<td class="wt-file-param-value"><%=currentRes.doc_info.modification.date%></td>
					</tr>
					<tr>
						<td class="wt-file-param-name"><%=tools_web.get_web_const("vfb_author", curLngWebFn())%></td>
						<td class="wt-file-param-value"><%=HtmlEncode(currentRes.person_fullname)%></td>
					</tr>
					<tr>
						<td class="wt-file-param-name"><%=tools_web.get_web_const("6t6e9751fk", curLngWebFn())%></td>
						<td class="wt-file-param-value"><%=stringifySize(currentRes.size)%></td>
					</tr>
				</table>
			</div>
			<button type="button" class="wt-file-btn" onclick="window.location.href='<%=sUrl%>';"><%=tools_web.get_web_const("4q6p4lc3ji", curLngWebFn())%></button>
<%
	if (sBackUrl != "")
	{
%>
		<button type="button" class="wt-file-btn" onclick="window.location.href='<%=sBackUrl%>';"><%=tools_web.get_web_const("vernutsyanazad", curLngWebFn())%></button>
<%
	}
%>
		</div>
	</body>
</html>
<%
				}

			}
		}
		if (tools_library.string_is_null_or_empty(sUrl))
		{
			if (curErrorText == null)
			{
				curErrorText = "Result url is empty for resource [" + currentResID + "]";
				Server.Execute("view_access_panel.html");
			}
		}
		else if (bRedirect)
		{
			if ( !bExternal )
			{
				sUrl += (StrContains(sUrl, "?") ? "&" : "?") + "cmi5herald=" + d;
				if(bVideoOverrideWidth)
				{
					sUrl += "&override_width=1";
				}
				if (sBackUrl != "")
					sUrl += "&redirect_url=" + Base64Encode(sBackUrl);
			}

			if (oUseCMI5 != null && oUseCMI5 != false && contextObjectID != null)
			{
				var oRes = tools_lrs.launch_cmi5_learning(contextObjectID, curObjectID, curUser,
				({
					"sLearningName": sLearningName,
					"sUrl": sUrl,
					"sSessionID": tools.random_string(10),
					"curDocID": curDocID,
					"Request": Request
				}) );

				if (oRes.error > 0)
				{
					curErrorText = "launch_cmi5_learning error: " + oRes.error_text;
					Server.Execute("view_access_panel.html");
					Cancel();
				}
				sUrl = oRes.GetOptProperty("url");
			}

			//Response.Redirect(sUrl);

%><!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><script type="text/javascript">window.location.href = <%=CodeLiteral(sUrl)%>;</script></head><body><span>Redirecting..</span></body></html><%

		}
	}
%>