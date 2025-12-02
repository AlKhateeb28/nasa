<%
/*
for (h in Request.Header)
{
	alert(h + "="+ Request.Header.GetProperty(h));
}
*/
Response.WriteMode = 'direct';
if ( ( iFileID = OptInt( Request.Query.file_id ) ) != undefined )
{
	docFile = tools.open_doc( iFileID )
	if ( docFile != undefined )
	{
		teFile = docFile.TopElem;
		isMedia = teFile.type.OptForeignElem;
		isMedia = isMedia == undefined ? false : ( isMedia.is_media == true );
		bIsOnline = isMedia || Request.Query.GetOptProperty( "no_disposition" ) == "1";
		bAllowDownload = true;
		bUnauthorizeDownload = teFile.access.enable_anonymous_access || teFile.allow_unauthorized_download;

		sSid = tools_web.get_user_data("res_" + iFileID);
		bGodMode = false;
		if(sSid != null && Request.Query.HasProperty("ssid"))
		{
			bGodMode = (sSid == Request.Query.ssid);
		}
		//alert("File debug (" + teFile.name + ") 1");
		if(!bGodMode)
		{
			if ( ! isMedia && ! teFile.allow_download )
			{
				bAllowDownload = false;
				//alert("File debug (" + teFile.name + ") 1.1");
			}
			else
			{
			//alert("File debug (" + teFile.name + ") 2");
				if( !bUnauthorizeDownload )
				{
					if ( Request.Session.HasProperty( 'Env' ) )
					{
						Env = Request.Session.Env;
					}
					else
					{
						Env = new SafeObject;
						Request.Session.SetProperty( 'Env', Env );
					}
					Server.Execute( "include/user_init.html" );
				}
			//alert("File debug (" + teFile.name + ") 3");
				if ( ! isMedia && !bUnauthorizeDownload && ! teFile.allow_download )
				{
				//alert("File debug (" + teFile.name + ") 3.1");
					try
					{
						curSid = Request.Query.sid;
						//alert("File debug (" + teFile.name + ") 3.1.1");
						if ( ! tools_web.check_sum_sid( iFileID, curSid, Session.sid ) )
						{
							throw "error_check_sum_sid";
						}
					}
					catch ( err )
					{
						//alert("File debug (" + teFile.name + ") 3.1.2");
						bAllowDownload = false;
					}
				}
				if ( !bUnauthorizeDownload )
				{
				//alert("File debug (" + teFile.name + ") 3.2");
					try
					{
					//alert("File debug (" + teFile.name + ") 3.2.1");
						if ( ! tools_web.check_access( teFile, curUserID, curUser, Session ) )
						{
							throw "error_check_access";
						}
						if ( teFile.resource_type_id.HasValue && teFile.resource_type_id.OptForeignElem != undefined && ! tools_web.check_access( OpenDoc(UrlFromDocID(teFile.resource_type_id)).TopElem, curUserID, curUser, Session ) )
						{
							throw "error_check_access";
						}
					}
					catch ( err )
					{
					//alert("File debug (" + teFile.name + ") 3.2.2");
						bAllowDownload = false;
					}
				}
			}
			//alert("File debug (" + teFile.name + ") 4");
			if ( ! bAllowDownload )
			{
			//alert("File debug (" + teFile.name + ") 4.1");
				Server.Execute( "view_access_panel.html" );
				Cancel();
			}
			//alert("File debug (" + teFile.name + ") 5");
		}
		teFile.save_data();
		if ( docFile.IsChanged )
			docFile.Save();
		//alert("File debug (" + teFile.name + ") 6");
		if ( ! teFile.file_url.HasValue )
			Cancel();
		//alert("File debug (" + teFile.name + ") 7");


		sAddID = Request.Query.GetOptProperty( "add_id", "" );
		if ( sAddID == "" )
		{
			sUrl = teFile.file_url.Value;
			sUrlFileName = teFile.file_name.Value;
		}
		else
		{
			var bAddKey = tools_web.is_true(Request.Query.GetOptProperty( "add_key_code"));
			if (bAddKey)
			{
				fldFileUrlChild = ArrayOptFindByKey(teFile.file_urls, UrlDecode(sAddID), "code" );
				sAddID = fldFileUrlChild.id.Value;
			}
			else
				fldFileUrlChild = teFile.file_urls.GetChildByKey( UrlDecode(sAddID) );
				
			sUrl = fldFileUrlChild.url.Value;
			sUrlFileName = UrlFileName( sUrl );
		}

		Response.ContentType = tools_web.url_std_content_type( sUrl );
		sDisposition = ( bIsOnline ? "inline" : "attachment" ) + "; filename*=UTF-8''" + UrlEncode( sUrlFileName );
		Response.AddHeader( "Content-Disposition", sDisposition );

		if ( sAddID == "" )
			teFile.download( Request, Response );
		else
			teFile.download_add( sAddID, Request, Response );
		//alert("File debug (" + teFile.name + ") 8");
	}
}
%>