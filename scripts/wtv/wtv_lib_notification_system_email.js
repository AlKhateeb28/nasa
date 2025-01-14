
function SendNotification( oParam )
{
	oRes = {
		'error': 0,
		'error_text': '',
		'sRecipients': ''
	};

	iActiveNotificationID = oParam.GetOptProperty( 'iActiveNotificationID', null );
	docActiveNotification = oParam.GetOptProperty( 'docActiveNotification', null );
	if ( docActiveNotification == null )
	{
		try
		{
			docActiveNotification = OpenDoc( UrlFromDocID( iActiveNotificationID ) );
		}
		catch ( err )
		{
			oRes.error = 2;
			oRes.error_text = 'Error. Open active notification document falied. Active notification ID ' + iActiveNotificationID + '. ' + err;
			return oRes;
		}
	}

	oSmtpClient = SmtpClient();
	if ( tools_web.is_true( oParam.GetOptProperty( 'bUseTLSPort', false ) ) )
		oSmtpClient.UseTLSPort = true;
	else if ( tools_web.is_true( oParam.GetOptProperty( 'bUseTLS', false ) ) )
		oSmtpClient.UseTLS = true;
	try
	{
		oSmtpClient.OpenSession( global_settings.settings.own_org.smtp_server );
		if ( global_settings.settings.own_org.use_smtp_authenticate )
			oSmtpClient.Authenticate( global_settings.settings.own_org.smtp_login, global_settings.settings.own_org.smtp_password );
	}
	catch ( err )
	{
		oRes.error = 1;
		oRes.error_text = 'Error. Open SMTP session falied. Server ' + global_settings.settings.own_org.smtp_server + '. ' + err;
		return oRes;
	}

	oMailMessage = MailMessage();
	oMailMessage.AssignElem( docActiveNotification.TopElem );
	if ( docActiveNotification.TopElem.body_type == 'html' )
	{
		oMailMessage.html_body = tools_web.get_web_desc( docActiveNotification.TopElem.body.Value, ({'mode':'message','message':oMailMessage}) );
		oMailMessage.body.Clear();
	}
	docActiveNotification.TopElem.send_counter += 1;
	docActiveNotification.TopElem.status = 'sent';
	docActiveNotification.TopElem.last_send_date = Date();

	oRes.sRecipients = ArrayMerge( docActiveNotification.TopElem.recipients, 'address', ', ' );

	try
	{
		if (docActiveNotification.TopElem.body_type == 'mime' || StrContains(docActiveNotification.TopElem.body.Value,'MIME-Version: 1.0'))
		{
			for (recipientElem in oMailMessage.recipients)
			{
				oSmtpClient.SendMimeMessage(oMailMessage.sender.address.Value, recipientElem.address.Value, docActiveNotification.TopElem.body.Value);
			}
			oSmtpClient.CloseSession();
		}
		else
		{
			oSmtpClient.SendMessage( oMailMessage );
			oSmtpClient.CloseSession();
		}
	}
	catch ( err )
	{
		oRes.error = 3;
		oRes.error_text = 'Error. Email sending falied. Active notification ID ' + iActiveNotificationID + '. Type of notification ID ' + docActiveNotification.TopElem.notification_id + '. ' + err;
		docActiveNotification.TopElem.status = 'send_error';
		oSmtpClient.CloseSession();
	}

	try
	{
		docActiveNotification.Save();
	}
	catch ( err )
	{
		oRes.error = 4;
		oRes.error_text = 'Error. Save active notification status failed. Active notification ID ' + iActiveNotificationID + '. ' + err;
	}
	return oRes;
}