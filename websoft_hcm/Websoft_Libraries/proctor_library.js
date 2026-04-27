/**
 * @namespace Websoft.WT.Proctor
*/

// Переопределение типов
/**
 * @typedef {number} integer
*/
/**
 * @typedef {number} int
*/
/**
 * @typedef {number} real
*/
/**
 * @typedef {number} bigint
*/
/**
 * @typedef {date} datetime
*/
/**
 * @typedef {boolean} bool
*/
/**
 * @typedef {Object} XmDoc
*/
/**
 * @typedef {Object} XmElem
*/

function alerd( sText, bDebug )
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
		bDebug = false;
	}
	if( bDebug )
		alert( 'proctor_library.js ' + sText )
}

/**
 * @typedef {Object} WTProctorResult
 * @property {number} error – код ошибки
 * @property {string} message – текст ошибки
*/
/**
 * @function GetProctoringObjectId
 * @memberof Websoft.WT.Proctor
 * @description Получение ID объекта прокторинга.
 * @param {bigint} iLearningObjectId - ID назначенного обучения
 * @returns {bigint}
 */
function GetProctoringObjectId( iLearningObjectId )
{
	return get_proctoring_object_id( iLearningObjectId );
}

function get_proctoring_object_id( iLearningObjectId, teLearningObject )
{
	/*
		получение ID объекта прокторинга
		iLearningObjectId 	- ID назначенного обучения
		teLearningObject	- TopElem назначенного обучения
	*/
	try
	{
		teLearningObject.Name
	}
	catch( ex )
	{
		try
		{
			teLearningObject = OpenDoc( UrlFromDocID( Int( iLearningObjectId ) ) ).TopElem;
		}
		catch( ex )
		{
			return undefined;
		}
	}
	iProctorObjectId = undefined;
	switch( teLearningObject.Name )
	{
		case 'active_learning':
		case 'learning':
			iProctorObjectId = teLearningObject.course_id;
			break;
		case 'active_test_learning':
		case 'test_learning':
			iProctorObjectId = teLearningObject.assessment_id;
			break;
		case 'poll_result':
			iProctorObjectId = teLearningObject.poll_id;
			break;
	}
	try
	{
		return iProctorObjectId;
	}
	catch( ex )
	{
		return undefined;
	}
}

function get_proctoring_object( iLearningObjectId, teLearningObject )
{
	/*
		возвращает TopElem объекта прокторинга
		iLearningObjectId 	- ID назначенного обучения
		teLearningObject	- TopElem назначенного обучения
	*/
	try
	{
		teLearningObject.Name
	}
	catch( ex )
	{
		teLearningObject = null;
	}

	try
	{
		return OpenDoc( UrlFromDocID( get_proctoring_object_id( iLearningObjectId, teLearningObject ) ) ).TopElem;
	}
	catch( ex )
	{
		return undefined;
	}
}


function get_proctoring_learning_object( iLearningObjectId, bReturnDoc )
{
	/*
		возвращает назначенное обучение по прокторингу
		iLearningObjectId	- ID назначенное обучение
		bReturnDoc			- возвращать документ ( иначе TopElem )
	*/
	try
	{
		if( bReturnDoc == undefined || bReturnDoc == null )
			throw "error";
			
		bReturnDoc = tools_web.is_true( bReturnDoc );
	}
	catch( ex )
	{
		bReturnDoc = false;
	}
		
	try
	{
		dDoc = OpenDoc( UrlFromDocID( Int( iLearningObjectId ) ) );
		if( bReturnDoc )
			return dDoc;
		else
			return dDoc.TopElem;
	}
	catch( ex ){}
	
	for( sType in common.proctoring_objects )
		switch( sType.id )
		{
			case 'assessment':
				oObj = ArrayOptFirstElem( XQuery( 'for $i in test_learnings where $i/active_test_learning_id = ' + iLearningObjectId + ' return $i' ) );
				if( oObj != undefined )
				{
					dDoc = OpenDoc( UrlFromDocID( oObj.id ) );
					if( bReturnDoc )
						return dDoc;
					else
						return dDoc.TopElem;
				}
				break;
			case 'course':
				oObj = ArrayOptFirstElem( XQuery( 'for $i in learnings where $i/active_learning_id = ' + iLearningObjectId + ' return $i' ) );
				if( oObj != undefined )
				{
					dDoc = OpenDoc( UrlFromDocID( oObj.id ) );
					if( bReturnDoc )
						return dDoc;
					else
						return dDoc.TopElem;
				}
				break;
		}
		
	return undefined;
}

/**
 * @function GetProctoringActiveObjectId
 * @memberof Websoft.WT.Proctor
 * @description Возращает ID назначенного обучения по записи прокторинга.
 * @param {bigint} iLearningObjectId - ID назначенного обучения
 * @returns {bigint}
 */
function GetProctoringActiveObjectId( iLearningObjectId )
{
	return get_proctoring_active_object_id( null, null, iLearningObjectId );
}

function get_proctoring_active_object_id( teLearningRecord, feLearning, iLearningRecordId )
{
	/*
		возращает ID назначенного обучения по записи прокторинга
		teLearningRecord	- TopElem записи тестирования
		feLearning			- TopElem/ForeignElem обучения
		iLearningRecordId	- ID записи тестирования
	*/
	try
	{
		teLearningRecord.Name
	}
	catch( ex )
	{
		try
		{
			teLearningRecord = OpenDoc( UrlFromDocID( Int( iLearningRecordId ) ) ).TopElem;
		}
		catch( ex )
		{
			return undefined
		}
	}
	try
	{
		feLearning.Name
	}
	catch( ex )
	{
		feLearning = undefined
	}
	switch( teLearningRecord.object_type )
	{
		case 'test_learning':
			if( feLearning == undefined )
				feLearning = teLearningRecord.object_id.ForeignElem
			return feLearning.active_test_learning_id;
		case 'learning':
			if( feLearning == undefined )
				feLearning = teLearningRecord.object_id.ForeignElem
			return feLearning.active_learning_id;
	}
	return teLearningRecord.object_id;
}

/**
 * @function FinishLearningRecord
 * @memberof Websoft.WT.Proctor
 * @description Завершение записи прокторинга.
 * @param {bigint} iLearningObjectId - ID назначенного обучения
 * @returns {WTProctorResult}
 */
function FinishLearningRecord( iLearningObjectId )
{
	return finish_learning_record( null, iLearningObjectId );
}

function learning_record_finish( iLearningID, teLearning, teProctoringObject )
{
	/*
		завершение записи прокторинга
		iLearningID	- ID назначенного обучения
		teLearning	- TopElem назначенного обучения
		teProctoringObject	- TopElem объекта прокторинга
	*/
	try
	{
		iLearningID = Int( iLearningID );
	}
	catch( ex )
	{
		return false;
	}
		
	try
	{
		teLearning.Name
	}
	catch( ex )
	{
		teLearning = OpenDoc( UrlFromDocID( iLearningID ) ).TopElem
	}
		
	try
	{
		teProctoringObject.Name
	}
	catch( ex )
	{
		teProctoringObject = tools_proctor.get_proctoring_object( iLearningID, teLearning )
	}
	catLearningRecord = ArrayOptFirstElem( XQuery( 'for $elem in learning_records where $elem/object_id = ' + tools_proctor.get_proctoring_active_object_id( teProctoringObject, teLearning ) + ' return $elem/Fields(\'id\')' ) );
	if( catLearningRecord != undefined && !catLearningRecord.is_finish_record )
		try
		{
			
			docLearningRecord = OpenDoc( UrlFromDocID( catLearningRecord.id ) );
			docLearningRecord.TopElem.is_finish_record = true;
			docLearningRecord.TopElem.finish_date = Date();
			docLearningRecord.TopElem.object_id = iLearningID;
			docLearningRecord.TopElem.object_type = teLearning.Name;
			docLearningRecord.Save();
		}
		catch( ex )
		{
			return false
		}
			
	return true;
}

/**
 * @function GetProctoringLearningUrl
 * @memberof Websoft.WT.Proctor
 * @description Получения ссылки для запуска прокторинга.
 * @param {bigint} iLearningObjectId - ID назначенного обучения
 * @param {string} sCurHostPath - хост
 * @param {string} sLaunchUrl - ID назначенного обучения
 * @param {string} [sUrlParams] - параметры url для запуска обучения
 * @returns {string}
 */
function GetProctoringLearningUrl( iLearningObjectId, sCurHostPath, sLaunchUrl, sUrlParams )
{
	get_proctoring_learning_url( iLearningObjectId, null, sCurHostPath, sLaunchUrl, sUrlParams, null )
}
function get_proctoring_learning_url( iLearningId, teLearning, sCurHostPath, sLaunchUrl, sUrlParams, teProctoringObject )
{
	/*
		получения ссылки для запуска прокторинга
		iLearningId	- ID назначенного обучения
		teLearning	- TopElem назначенного обучения
		sCurHostPath	- хост
		sLaunchUrl	- url для запуска обучения
		sUrlParams	- параметры url для запуска обучения
		teProctoringObject	- TopElem объекта прокторинга
	*/
	try
	{
		teLearning.Name
	}
	catch( ex )
	{
		try
		{
			teLearning = OpenDoc( UrlFromDocID( Int( iLearningId ) ) ).TopElem;
		}
		catch( err )
		{
			alert( err )
			return '';
		}
	}
	try
	{
		if( sCurHostPath == undefined || sCurHostPath == null )
			throw "error";
	}
	catch( ex )
	{
		sCurHostPath = '';
	}
	try
	{
		teProctoringObject.Name
	}
	catch( ex )
	{
		teProctoringObject = tools_proctor.get_proctoring_object( Int( iLearningId ), teLearning )
	}
	try
	{
		teProctoringSystem = OpenDoc( UrlFromDocID( Int( teProctoringObject.proctoring.proctoring_system_id ) ) ).TopElem
	}
	catch( ex )
	{
		alert( ex )
		return '';
	}
		
	oLaunchParams = {};
	oLaunchParams.sHost = sCurHostPath;
	oLaunchParams.teProctoringSystem = teProctoringSystem;
	oLaunchParams.teProctoringObject = teProctoringObject;
	oLaunchParams.iLearningId = iLearningId;
	oLaunchParams.sLaunchUrl = sLaunchUrl;
	oLaunchParams.sUrlParams = sUrlParams;
	try
	{
		return CallObjectMethod( OpenCodeLib( 'x-local://wtv/' + teProctoringSystem.library_url ), 'getTestUrl', [ oLaunchParams ] );
	}
	catch( ex )
	{
		alert( ex )
		return '';
	}
}
/**
 * @function DownloadProctoringFiles
 * @memberof Websoft.WT.Proctor
 * @description Загрузка файлов прокторинга в WT.
 * @param {bigint} iLearningRecordID - ID записи прокторинга
 * @returns {string}
 */
function DownloadProctoringFiles( iLearningRecordID )
{
	download_proctoring_files( iLearningRecordID )
}
function download_proctoring_files( iLearningRecordID )
{
	/*
		загрузка файлов прокторинга в WT
		iLearningRecordID	- ID записи прокторинга
	*/
	oParams = new Object();
	try
	{
		teRecord = OpenDoc( UrlFromDocID( Int( iLearningRecordID ) ) ).TopElem;
	}
	catch( ex )
	{
		return ex;
	}
	oParams.SetProperty( 'iLearningRecordID', iLearningRecordID );
	oParams.SetProperty( 'iActiveLearningID', get_proctoring_active_learning_id( teRecord ) );

	teProctoringSystem = OpenDoc( UrlFromDocID( teRecord.proctoring_system_id ) ).TopElem;
	CodeLib = OpenCodeLib( 'x-local://wtv/' + teProctoringSystem.library_url );
	oParams.SetProperty( 'teProctoringSystem', teProctoringSystem );

	if( teProctoringSystem.library_url.HasValue )
		return CallObjectMethod( CodeLib, 'DownloadFiles', [ oParams ] );
	else
		return 'В системе прокторинга не указан файл библиотеки функций.'
}
/**
 * @function GetProctoringActiveLearningId
 * @memberof Websoft.WT.Proctor
 * @description Получение ID назначенного обучения.
 * @param {bigint} iLearningRecordID - ID записи прокторинга
 * @returns {string}
 */
function GetProctoringActiveLearningId( iLearningRecordID )
{
	get_proctoring_active_learning_id( null, iLearningRecordID )
}

function get_proctoring_active_learning_id( teRecord, iLearningRecordId )
{
	/*
		получение ID назначенного обучения
		teRecord	- TopElem записи прокторинга
		iLearningRecordId	- ID записи прокторинга
	*/
	try
	{
		teRecord.Name
	}
	catch( ex )
	{
		try
		{
			teRecord = OpenDoc( UrlFromDocID( Int( iLearningRecordId ) ) ).TopElem;
		}
		catch( err )
		{
			alert( err )
			return undefined;
		}
	}
	if( !teRecord.object_id.HasValue )
		return undefined;

	switch( teRecord.object_type )
	{
		case 'test_learning':
			feObject = teRecord.object_id.OptForeignElem;
			if( feObject == undefined )
				return undefined;
			else
				return feObject.active_test_learning_id;
		case 'learning':
			feObject = teRecord.object_id.OptForeignElem;
			if( feObject == undefined )
				return undefined;
			else
				return feObject.active_learning_id;
		default:
			return teRecord.object_id;
	}
	return undefined;
}


function finish_learning_record_thread( iActiveLearningId, iLearningId, teLearning, teProctorObject )
{
	/*
		функция завершения записи прокторинга
		iActiveLearningId	- id незаконченного обучения
		iLearningId			- id законченного обучения
		teLearning			- TopElem законченного обучения
		teProctorObject	- TopElem объект для прокторинга ( курс/тест/опрос )
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	oRes.doc_learning_record = null;
	oRes.result = true;
	try
	{
		iActiveLearningId = Int( iActiveLearningId )
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iActiveLearningId';
		return oRes;
	}
	try
	{
		iLearningId = Int( iLearningId )
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iLearningId';
		return oRes;
	}
	try
	{
		teLearning.Name
		if( teLearning == null || teLearning == '' )
			throw 'error'
	}
	catch( ex )
	{
		try
		{
			teLearning = OpenDoc( UrlFromDocID( iLearningId ) ).TopElem;
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningId';
			return oRes;
		}
	}
			
	try
	{
		teProctorObject.Name
		if( teProctorObject == null || teProctorObject == '' )
			throw 'error';
	}
	catch( ex )
	{
		try
		{
			teProctorObject = get_proctoring_object( iLearningId, teLearning );
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningId';
			return oRes;
		}
	}
	if( !teLearning.ChildExists( 'use_proctoring' ) || !teLearning.use_proctoring )
	{
		oRes.error = 1;
		oRes.message = 'object not proctoring';
		return oRes;
	}
	oThread = new Thread;
	oThread.Param.SetProperty( 'iActiveLearningId', iActiveLearningId );
	oThread.Param.SetProperty( 'iLearningId', iLearningId );
	oThread.Param.SetProperty( 'teLearning', teLearning );
	oThread.Param.SetProperty( 'teProctorObject', teProctorObject );
	oThread.EvalCode( 'tools_proctor.finish_learning_record( Param.iActiveLearningId, Param.iLearningId, Param.teLearning, Param.teProctorObject )' );
			
	return oRes;
}

function finish_learning_record( iActiveLearningId, iLearningId, teLearning, teProctorObject )
{
	/*
		функция завершения записи прокторинга
		iActiveLearningId	- id незаконченного обучения
		iLearningId			- id законченного обучения
		teLearning			- TopElem законченного обучения
		teProctorObject	- TopElem объект для прокторинга ( курс/тест/опрос )
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	oRes.doc_learning_record = null;
	oRes.result = true;
	
	try
	{
		iLearningId = Int( iLearningId )
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iLearningId';
		return oRes;
	}
	try
	{
		teLearning.Name
	}
	catch( ex )
	{
		try
		{
			teLearning = OpenDoc( UrlFromDocID( iLearningId ) ).TopElem;
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningId';
			return oRes;
		}
	}
	try
	{
		iActiveLearningId = Int( iActiveLearningId )
	}
	catch( ex )
	{
		iActiveLearningId = get_proctoring_active_object_id( null, teLearning, iLearningId )
	}
	try
	{
		teProctorObject.Name
	}
	catch( ex )
	{
		try
		{
			teProctorObject = get_proctoring_object( iLearningId, teLearning );
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningId';
			return oRes;
		}
	}
	if( !teProctorObject.ChildExists( 'use_proctoring' ) || !teProctorObject.use_proctoring )
	{
		oRes.error = 1;
		oRes.message = 'object not proctoring';
		return oRes;
	}
			
	catLearningRecord = ArrayOptFirstElem( XQuery( 'for $elem in learning_records where $elem/object_id = ' + iActiveLearningId + ' return $elem/Fields(\'id\')' ) );
	if( catLearningRecord != undefined )
	{
		docLearningRecord = OpenDoc( UrlFromDocID( catLearningRecord.id ) );
		docLearningRecord.TopElem.is_finish_record = true;
		docLearningRecord.TopElem.finish_date = Date();
		docLearningRecord.TopElem.object_id = iLearningId;
		docLearningRecord.TopElem.object_type = teLearning.Name;
		docLearningRecord.Save();
		oRes.doc_learning_record = docLearningRecord;
	}
		
	try
	{
		teProctoringSystem = OpenDoc( UrlFromDocID( Int( teProctorObject.proctoring.proctoring_system_id ) ) ).TopElem
	}
	catch( ex )
	{
		alert( ex )
		return '';
	}
	
	oParams = new Object();
	oParams.teProctoringSystem = teProctoringSystem;
	oParams.teProctorObject = teProctorObject;
	oParams.iLearningId = iLearningId;
	oParams.teLearning = teLearning;
	oParams.iActiveLearningId = iActiveLearningId;
	try
	{
		oRes.result = CallObjectMethod( OpenCodeLib( 'x-local://wtv/' + teProctoringSystem.library_url ), 'FinishLearningRecord', [ oParams ] );
	}
	catch( ex )
	{
		alert( ex )
		oRes.result = false;
	}
			
	return oRes;
}


function check_foto( iLearningRecordId, docLearningRecord, arrDefaultFotoUrls, rConfidence, sModelType )
{
	/*
		функция  проверки лиц в записи прокторинга
		iLearningRecordId	- id записи прокторинга
		docLearningRecord	- документ записи прокторинга
		arrDefaultFotoUrls	- массив фото сотрудника
		rConfidence			- порог конфиденциальности
		sModelType			- модель  сравнения
	*/
			
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		if( sModelType == undefined || sModelType == null )
			throw "error"
	}
	catch( ex )
	{
		sModelType = 'lbph';
	}
	try
	{
		iLearningRecordId = Int( iLearningRecordId )
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iLearningRecordId';
		return oRes;
	}
	try
	{
		if( !IsArray( arrDefaultFotoUrls ) )
			throw 'error';
	}
	catch( ex )
	{
		arrDefaultFotoUrls = [];
	}
	try
	{
		rConfidence = OptReal( rConfidence, 60.0 )
	}
	catch( ex )
	{
		rConfidence = 60.0;
	}
	
	if ( ! LdsIsServer )
	{
		return CallServerMethod( 'tools_proctor', 'check_foto', [ RValue( iLearningRecordId ), null, null, rConfidence, sModelType ] );
	}

	try
	{
		docLearningRecord.TopElem;
	}
	catch( ex )
	{
		try
		{
			docLearningRecord = OpenDoc( UrlFromDocID( iLearningRecordId ) );
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningRecordId';
			return oRes;
		}
	}
	
	if( ArrayOptFirstElem( arrDefaultFotoUrls ) == undefined )
	{
		try
		{
			tePerson = OpenDoc( UrlFromDocID( docLearningRecord.TopElem.person_id ) ).TopElem;
			if( StrContains( tePerson.pict_url, '/download_file.html?file_id=' ) )
			{
				teResource = OpenDoc( UrlFromDocID( Int( StrReplace( tePerson.pict_url, '/download_file.html?file_id=', '' ) ) ) ).TopElem;
				teResource.save_data();
				if( teResource.file_url.HasValue )
				{
					sOutUrl = ObtainTempFile( UrlPathSuffix( teResource.file_url ) );
					tools.copy_url( sOutUrl, teResource.file_url );
					arrDefaultFotoUrls.push( UrlToFilePath( sOutUrl ) );
				}
			}
		}
		catch( ex ){}
	}
		
	conds = new Array();
	if( docLearningRecord.TopElem.files.ChildNum == 0 )
		return oRes;
	xarrFileTypes =  XQuery( 'for $i in resource_types where MatchSome( $i/code, ( ' + XQueryLiteral( 'proctoring_foto' ) + ',' + XQueryLiteral( 'proctoring_train' )+ ' ) ) return $i' );
	if( ArrayOptFirstElem( xarrFileTypes ) != undefined )
		conds.push( 'MatchSome( $i/resource_type_id, ( ' + ArrayMerge( xarrFileTypes, 'This.id', ',' ) + ' ) )' );
	conds.push( 'MatchSome( $i/id, ( ' + ArrayMerge( docLearningRecord.TopElem.files, 'This.PrimaryKey', ',' ) + ' ) )' );
	xarrResources = XQuery( 'for $i in resources where ' + ArrayMerge( conds, 'This', ' and ' ) + ' return $i' );
	arrResource = new Array();
	
	catFotoType = ArrayOptFind( xarrFileTypes, 'This.code == ' + XQueryLiteral( 'proctoring_foto' ) );
	catTrainType = ArrayOptFind( xarrFileTypes, 'This.code == ' + XQueryLiteral( 'proctoring_train' ) );
	for( file in xarrResources )
		try
		{
			teResource = OpenDoc( UrlFromDocID( file.id ) ).TopElem;
			
			teResource.save_data();
			if( teResource.file_url.HasValue )
			{
				sOutUrl = ObtainTempFile( UrlPathSuffix( teResource.file_url ) );
				tools.copy_url( sOutUrl, teResource.file_url );
				
				obj_file = new Object();
				obj_file.id = file.id.Value;
				obj_file.resource_type_id = file.resource_type_id.Value;
				obj_file.path = UrlToFilePath( sOutUrl );
				arrResource.push( obj_file );
			}
		}
		catch( ex )
		{
			alert( ex )
		}
		
				
	if( ArrayCount( arrResource ) > 1 )
	{
		var face_recogntion = tools.get_object_assembly('FaceRecognition');
		var cascade_path = AppDirectoryPath() + '//wtv//proctoring//cascade_face.xml';
		var arrTrains = new Array();
		if( catTrainType != undefined )
		{
			arrTrains = ArrayExtract( ArraySelect( arrResource, 'This.resource_type_id == catTrainType.id' ), 'This.path' );
		}
		if( ArrayOptFirstElem( arrTrains ) == undefined )
			arrTrains = [ arrResource[0].path ]
		var threshold = 2000;
		var ok = face_recogntion.TraintFaceModel( cascade_path, arrTrains, threshold, sModelType );
		if ( ok )
		{
			arrResource = ArraySelect( arrResource, 'This.resource_type_id == catFotoType.id' );
			var person_filenames = ArrayExtract( arrResource, 'This.path' );
			
			var facts = face_recogntion.CheckFaceFacts( person_filenames, rConfidence );
			for( var i=0; i<ArrayCount( facts ); i++ )
			{
				iResult = Int( facts[i] );
				catElem = docLearningRecord.TopElem.result_comments.ObtainChildByKey( arrResource[i].id );
				switch( iResult )
				{
					case 2:
						catElem.state_id = 'failed';
						catElem.result_comment = 'На фото обнаружено более 1 лица';
						break;
					case 0:
						catElem.state_id = 'failed';
						catElem.result_comment = 'На фото другое лицо';
						break;
					case 3:
						catElem.state_id = 'failed';
						catElem.result_comment = 'На фото не обнаружено лиц';
						break;
					default:
						catElem.state_id = 'success';
						catElem.result_comment = 'Проверка пройдена';
				}
			}
			if( ArrayOptFirstElem( arrDefaultFotoUrls ) != undefined )
				try
				{
					face_recogntion = tools.get_object_assembly('FaceRecognition');
					ok = face_recogntion.TraintFaceModel( cascade_path, arrDefaultFotoUrls, threshold );
					if( ok )
					{
						facts = face_recogntion.CheckFaceFacts( [arrResource[0].path], rConfidence );
						switch( Int( facts[0] ) )
						{
							case 0:
							case 2:
							case 3:
								docLearningRecord.TopElem.check_foto_state_id = 'failed';
								docLearningRecord.TopElem.result_comment = 'На записи прокторинга другое лицо';
								break;
							default:
								docLearningRecord.TopElem.check_foto_state_id = 'success';
								docLearningRecord.TopElem.result_comment.Clear();
						}
					}
					else
					{
						docLearningRecord.TopElem.check_foto_state_id = 'failed';
						docLearningRecord.TopElem.result_comment.Clear();
					}
				}
				catch( ex ){ alert( ex ) }
			docLearningRecord.Save();
		}

		face_recogntion.DisposeFaceModel();
	}
	return oRes;
}

function get_record_learning( object_id )
{
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	oRes.doc_record = null;
	try
	{
		object_id = Int( object_id )
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect object_id';
		return oRes;
	}
	catRecord = ArrayOptFirstElem( XQuery( "for $i in learning_records where $i/object_id = " + object_id + " return $i" ) );
	if( catRecord != undefined )
	{
		var docRecord = OpenDoc( UrlFromDocID( catRecord.id ) );
	}
	else
	{
		teObject = OpenDoc( UrlFromDocID( object_id ) ).TopElem;
		teProctoringObject = get_proctoring_object( object_id, teObject );
		var docRecord = OpenNewDoc( "x-local://wtv/wtv_learning_record.xmd" );
		docRecord.BindToDb( DefaultDb );
		docRecord.TopElem.person_id = teObject.ChildExists( "person_id" ) ? teObject.person_id : teObject.ChildExists( "collaborator_id" ) ? teObject.person_id : "";
		docRecord.TopElem.proctoring_system_id = teProctoringObject.proctoring.proctoring_system_id;
		docRecord.TopElem.event_id = teObject.ChildExists( "event_id" ) ? teObject.event_id : "";
		docRecord.TopElem.object_id = object_id;
		docRecord.TopElem.object_type = teObject.Name;
		docRecord.TopElem.object_name = teProctoringObject != undefined ? tools.get_disp_name_value( teProctoringObject ) : "";
		if( docRecord.TopElem.person_id.HasValue )
		{
			tools.common_filling( "collaborator", docRecord.TopElem, docRecord.TopElem.person_id );
		}
		if( teObject.ChildExists( "proctor_prefer_id" ) && teObject.proctor_prefer_id.HasValue )
		{
			catProctor = docRecord.TopElem.proctors.ObtainChildByKey( teObject.proctor_prefer_id );
			catProctor.is_prefer = true;
		}
		docRecord.Save();
	}
	oRes.doc_record = docRecord;
	return oRes
}
function get_learning_record_api( iLearningRecordID, teLearningRecord, oAnswerAction )
{
	try
	{
		if( oAnswerAction == undefined || oAnswerAction == null || oAnswerAction == "" )
			throw "error";
	}
	catch( ex )
	{
		oAnswerAction = new Object();
		oAnswerAction.id = '';
		oAnswerAction.error = 0;
		oAnswerAction.message = '';
	}
	try
	{
		iLearningRecordID = Int( iLearningRecordID )
	}
	catch( ex )
	{
		oAnswerAction.error = 1;
		oAnswerAction.message = 'Incorrect iLearningRecordID';
		return oAnswerAction;
	}
	try
	{
		teLearningRecord.Name;
	}
	catch( ex )
	{
		try
		{
			teLearningRecord = OpenDoc( UrlFromDocID( iLearningRecordId ) ).TopElem;
		}
		catch( ex )
		{
			oAnswerAction.error = 1;
			oAnswerAction.message = 'Incorrect iLearningRecordId';
			return oAnswerAction;
		}
	}
	oAnswerAction.streamUrl = "";
	oAnswerAction.learning_record_id = iLearningRecordID;
	oAnswerAction.violations = new Array();
	oAnswerAction.media_records = new Array();
					
	catSession = ArrayOptFind( teLearningRecord.sessions, "This.state_id == 'active'" );
	if( catSession != undefined )
	{
		oAnswerAction.session_start_date = catSession.start_date.Value;
		oAnswerAction.session_finish_date = catSession.finish_date.Value;
		oAnswerAction.session_state_id = catSession.state_id.Value;
	}
	else
	{
		oAnswerAction.session_start_date = "";
		oAnswerAction.session_finish_date = "";
		oAnswerAction.session_state_id = "";
	}
	oAnswerAction.start_date = teLearningRecord.start_date.Value;
	oAnswerAction.finish_date = teLearningRecord.finish_date.Value;
	oAnswerAction.state_id = teLearningRecord.state_id.Value;
	oAnswerAction.name = teLearningRecord.proctoring_object_name.Value;
	oAnswerAction.type = teLearningRecord.proctoring_object_type.Value;
	oAnswerAction.person_id = teLearningRecord.person_id.Value;
	oAnswerAction.person_fullname = teLearningRecord.person_fullname.Value;
	oAnswerAction.avatar_url = tools_web.get_object_source_url( 'person', teLearningRecord.person_id );
	oAnswerAction.comment = teLearningRecord.result_comment.Value;				
	catConversation = ArrayOptFirstElem( XQuery( "for $elem in conversations where $elem/active_object_id = " + iLearningRecordID + " return $elem/Fields('id', 'active_object_id')" ) );
	oAnswerAction.conversation_id = catConversation != undefined ? catConversation.id.Value : "";
					
	arrPersons = ArrayExtract( ArraySelect( teLearningRecord.violations, "This.person_id.HasValue" ), "This.person_id" );
	arrPersons = ArrayUnion( arrPersons, ArrayExtract( ArraySelect( teLearningRecord.proctors, "This.proctor_id.HasValue" ), "This.proctor_id" ) );
	arrPersons = ArraySelectDistinct( arrPersons, "This" );
	if( ArrayOptFirstElem( arrPersons ) != undefined )
	{
		arrPersons = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + ArrayMerge( arrPersons, "This", "," ) + " ) ) return $elem/Fields( 'id', 'fullname' )" );
	}
	
	for( _media_record in teLearningRecord.media_records )
	{
		oAnswerAction.media_records.push({
			"media_url": _media_record.media_url.Value,
			"stream_number": _media_record.stream_number.Value,
			"type_id": _media_record.type_id.Value
		});
	}
					
	for( _violation in ArraySort( teLearningRecord.violations, "This.ChildIndex", "-" ) )
	{
		catPerson = ArrayOptFind( arrPersons, "This.id == _violation.person_id" );
		oAnswerAction.violations.push({
							"id": _violation.id.Value,
							"type_id": _violation.type_id.Value,
							"person_id": _violation.person_id.Value,
							"stream_number": _violation.stream_number.Value,
							"media_id": _violation.media_id.Value,
							"person_fullname": ( catPerson != undefined ? catPerson.fullname.Value: "" ),
							"person_icon": ( _violation.person_id.HasValue ? tools_web.get_object_source_url( 'person', _violation.person_id ) : "" ),
							"comment": _violation.comment.Value,
							"date": _violation.date.Value,
							"interval": { "start_time": get_seconds_from_interval( _violation.interval.start_time.Value ), "finish_time": get_seconds_from_interval( _violation.interval.finish_time.Value ) },
							"state_id": _violation.state_id.Value,
		});
	}
	oAnswerAction.proctors = new Array();
					
	for( _proctor in teLearningRecord.proctors )
	{
		catPerson = ArrayOptFind( arrPersons, "This.id == _proctor.proctor_id" );
		oAnswerAction.proctors.push({
							id: _proctor.proctor_id.Value,
							person_fullname: ( catPerson != undefined ? catPerson.fullname.Value: "" ),
							avatar_url: ( _proctor.proctor_id.HasValue ? tools_web.get_object_source_url( 'person', _proctor.proctor_id ) : "" )
		});
	}
	return oAnswerAction;
}
function get_seconds_from_interval( sInterval )
{
	sInterval = String( sInterval );
	aInterval = sInterval.split( ":" );
	iStart = 1;
	iSeconds = 0;
	for( i = ( ArrayCount( aInterval ) - 1 ); i >= 0; i-- )
	{
		iSeconds += OptInt( aInterval[ i ], 0 )*iStart;
		iStart = iStart*60;
	}
	return iSeconds;
}
function get_str_time_from_date( date )
{
	date = OptDate( date );
	if( date == undefined )
	{
		return "";
	}

	return StrInt( Hour( date ), 2 ) + ":" + StrInt( Minute( date ), 2 ) + ":" + StrInt( Second( date ), 2 );
}
function get_instance_media_url()
{
	try
	{
		var info = tools.spxml_unibridge.Object.provider.GetRunningInfo( "instance_info" );
		var t_info = ParseJson( info );

		all_internal_hosts = t_info.GetOptProperty('All', new Object()).GetOptProperty('InternalHttpsUrls', []);
		media_internal_hosts = t_info.GetOptProperty('MediaHandler', new Object()).GetOptProperty('InternalHttpsUrls', []);
		
		internal_hosts = ArrayUnion(all_internal_hosts, media_internal_hosts);

		if ( ArrayOptFirstElem( internal_hosts ) == undefined )
		{
			all_internal_hosts = t_info.GetOptProperty('All', new Object()).GetOptProperty('InternalHttpUrls', []);
			media_internal_hosts = t_info.GetOptProperty('MediaHandler', new Object()).GetOptProperty('InternalHttpUrls', []);
			internal_hosts = ArrayUnion(all_internal_hosts, media_internal_hosts);
		}

		if ( ArrayOptFirstElem( internal_hosts ) == undefined)
		{
			alert("get_instance_media_url message: - internal ip is undefined, using default")
			return "";
		}

		ip_round_idx = OptInt(tools.spxml_unibridge.Object.provider.GetUserData('RoundIPIdx'), 0);
		if (ip_round_idx >= ArrayCount(internal_hosts))
			{
				ip_round_idx = 0;
			}
		tools.spxml_unibridge.Object.provider.SetUserData('RoundIPIdx', (ip_round_idx+1));
		return internal_hosts[ip_round_idx];
	}
	catch( ex )
	{
		alert("get_instance_media_url error: - " + ex)
	}
	return "";
}
function start_proctoring_record( _action, curUserID, Request )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	var iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );	
	var docLearningRecord = tools.open_doc( iLearningRecordID );
	if( docLearningRecord.TopElem.person_id != curUserID )
	{
		oRes.error = 1;
		oRes.message = "Access is denied.";
		return oRes;
	}
	
	var iNumRecord = OptInt( docLearningRecord.TopElem.record_num, 0 );
	
	var oVirtualClient = tools.dotnet_host.Object.GetAssembly('Datex.MediaSoup.VirtualClient.dll');
	var bHasVirtual = oVirtualClient.CallClassStaticMethod('Datex.MediaSoup.VirtualClient.VirtualClient', 'IsActiveVirtualClientByRoomId', [(iLearningRecordID+"")]);
	if( bHasVirtual )
	{
		var oStopResult = oVirtualClient.CallClassStaticMethod('Datex.MediaSoup.VirtualClient.VirtualClient', 'StopRecordingRoom', [(iLearningRecordID+"")]);
	}
	
	var sVirtualUserId = String( iLearningRecordID )+"";
	var oMediaSoup = tools.dotnet_host.Object.GetAssembly( "Datex.MediaSoup.dll" );
	var arrRoomTickets = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "GetTickets", [ null, String( iLearningRecordID ), null ] );
	arrRoomTickets = ArrayExtract( arrRoomTickets, "ParseJson( This )" );
	var catVirtualUserTicket = ArrayOptFind( arrRoomTickets, "String( This.UserId ) == sVirtualUserId" );
	if( catVirtualUserTicket == undefined )
	{
		//alert(EncodeJson([ [ sVirtualUserId ], String( iLearningRecordID ), null, tools.call_code_library_method( "libChat", "get_ticket_expire", [] ) ]));
		var aVirtualTickets = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "RegisterRoomTickets", [ [ sVirtualUserId ], String( iLearningRecordID ), null, tools.call_code_library_method( "libChat", "get_ticket_expire", [] ) ] );
		//alert(EncodeJson(aVirtualTickets))
		aVirtualTickets = ArrayExtract( aVirtualTickets, "ParseJson( This )" );
		catVirtualUserTicket = ArrayOptFind( aVirtualTickets, "String( This.UserId ) == sVirtualUserId" );
	}
	else
	{
		if( !tools.call_code_library_method( "libChat", "check_expiration_ticket", [ catVirtualUserTicket ] ) )
		{
			try
			{
				oMediaSoupService.CallClassStaticMethod( "Datex.MediaSoup.Service", "RestoreTicketByPeerId", [ catVirtualUserTicket.GetOptProperty( "PeerId", null ), catVirtualUserTicket.UserId, catUserTicket.Id, tools.call_code_library_method( "libChat", "get_ticket_expire", [] ) ] );
			}
			catch( ex )
			{
				alert(ex)
			}
		}
	}
	if( true )
	{
		try
		{
			var oResSocket = tools.call_code_library_method( 'libMain', 'get_socket_url', [ Request.Url, null ] );
			var sHostUrl = oResSocket.ws_media_service_url;
			var sUrl;
			if( sHostUrl == "" )
			{
				sUrlSchema = UrlSchema( Request.Url );
				switch( sUrlSchema )
				{
					case "ws":
						sUrlSchema = "http";
						break;
					case "wss":
						sUrlSchema = "https";
						break;
				}
				
				sHostUrl = sUrlSchema + '://' + Request.UrlHost;
			}
			else
			{
				sHostUrl = StrReplace( StrReplace( sHostUrl, "ws://", "http://" ), "wss://", "https://" );
			}
			sUrl = UrlAppendPath( sHostUrl, 'record_webm.html' );

			var oConvifg = new Object(false);
			oConvifg.host = sHostUrl;
			oConvifg.ticket_id = catVirtualUserTicket.Id;
			oConvifg.room_id = iLearningRecordID;
			oConvifg.output_folder = "x-local://wftrecords/"+String( iLearningRecordID ),
			oConvifg.url = sUrl;
			oConvifg.stream_number = iNumRecord;
			oConvifg.record_type = "remote";
			//alert("oConvifg "+EncodeJson(oConvifg))
			
			var oClient = oVirtualClient.CallClassStaticMethod('Datex.MediaSoup.VirtualClient.VirtualClient', 'StartJsObjRecordingRoom', [oConvifg]);
		}
		catch( ex )
		{
			alert( ex );
		}
	}
	
	docLearningRecord.TopElem.record_num = iNumRecord + 1;
	docLearningRecord.TopElem.start_record_date = Date();
	docLearningRecord.Save();
	
	return oRes;
}

function get_learning_records( curUserID )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	oRes.learning_records = new Array();
	
	xarrLearningRecords = XQuery( "for $elem in learning_records where MatchSome( $elem/proctors_id, ( " + curUserID + " ) ) return $elem" );
	if( ArrayOptFirstElem( xarrLearningRecords ) != undefined )
	{
		xarrConversations = XQuery( "for $elem in conversations where MatchSome( $elem/active_object_id, ( " + ArrayMerge( xarrLearningRecords, "This.id", "," ) + " ) ) return $elem/Fields('id', 'active_object_id')" );
		
		for( _learning_record in xarrLearningRecords )
		{
			catConversation = ArrayOptFind( xarrConversations, "This.active_object_id == _learning_record.id" );
			oRes.learning_records.push( {
				id: _learning_record.id.Value,
				person_id: _learning_record.person_id.Value,
				person_fullname: _learning_record.person_fullname.Value,
				avatar_url: tools_web.get_object_source_url( 'person', _learning_record.person_id ),
				name: _learning_record.proctoring_object_name.Value,
				type: _learning_record.proctoring_object_type.Value,
				start_date: _learning_record.start_date.Value,
				conversation_id: ( catConversation != undefined ? catConversation.id.Value : "" )
			} );
		}
	}
	
	return oRes;
}

function update_violation( _action, curUserID )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	
	var iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );
	var docLearningRecord = tools.open_doc( iLearningRecordID );
	var sViolationID = _action.GetOptProperty( "violation_id", "" );
	if( docLearningRecord.TopElem.person_id != curUserID && ArrayOptFind( docLearningRecord.TopElem.proctors, "This.proctor_id == curUserID" ) != undefined )
	{
		oRes.error = 1;
		oRes.message = "Access is denied.";
		return oRes;
	}
	if( sViolationID != "" )
	{
		_violation = docLearningRecord.TopElem.violations.ObtainChildByKey( sViolationID );
	}
	else
	{
		_violation = docLearningRecord.TopElem.violations.AddChild();
	}
	if( _action.GetOptProperty( "comment" ) != undefined )
	{
		_violation.comment = _action.GetOptProperty( "comment" );
	}
	if( _action.GetOptProperty( "type_id" ) != undefined )
	{
		_violation.type_id = _action.GetOptProperty( "type_id" );
	}
	if( OptInt( _action.GetOptProperty( "stream_number" ) ) != undefined )
	{
		_violation.stream_number = OptInt( _action.GetOptProperty( "stream_number" ) );
	}
	else
	{
		_violation.stream_number = docLearningRecord.TopElem.record_num.Value;
	}
	if( _action.GetOptProperty( "media_id" ) != undefined )
	{
		_violation.media_id = _action.GetOptProperty( "media_id" );
	}
	if( _action.GetOptProperty( "state_id" ) != undefined )
	{
		_violation.state_id = _action.GetOptProperty( "state_id" );
	}
	if( _action.GetOptProperty( "interval" ) != undefined )
	{
		_violation.interval.start_time = tools.str_time_from_mseconds( OptInt( _action.interval.GetOptProperty( "start_time", "" ), 0 )*1000 );
		_violation.interval.finish_time = tools.str_time_from_mseconds( OptInt( _action.interval.GetOptProperty( "finish_time", "" ), 0 )*1000 );
	}
	else if( docLearningRecord.TopElem.start_record_date.HasValue )
	{
		_violation.interval.start_time = tools.str_time_from_mseconds( DateDiff( Date(), docLearningRecord.TopElem.start_record_date.Value )*1000 );
	}
	if( !_violation.person_id.HasValue )
	{
		_violation.person_id = curUserID;
	}
	if( !_violation.date.HasValue )
	{
		_violation.date = Date();
	}
	docLearningRecord.Save();
	
	return oRes;
}
function get_archive_filter_users( _action, curUserID, curUser, Session  )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	oRes.total = 0;
	oRes.users = new Array();
	var bAccess = false;
	var catCatalogRemoteCollection = ArrayOptFirstElem( XQuery( "for $elem in remote_collections where $elem/code = 'uni_catalog_list_collaborator' return $elem/Fields('id')" ) );
	if ( catCatalogRemoteCollection != undefined )
	{
		bAccess = tools_web.check_access( OpenDoc( UrlFromDocID ( catCatalogRemoteCollection.id ), "form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1" ).TopElem, curUserID, curUser, Session );
	}
	else
	{
		bAccess = true;
	}

	if ( !bAccess )
	{
		oRes.error = 1;
		oRes.message = "Access is denied.";
		return oRes;
	}
	sSearch = String( _action.GetOptProperty( "search" ) );
	
	if( sSearch == "" )
	{
		return oRes;
	}
	iPageSize = OptInt( _action.GetOptProperty( 'page_size' ), 100 );
	iPageNum = OptInt( _action.GetOptProperty( 'page_num' ), 1 );
	conds = new Array();
	conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
	conds.push( "$elem/is_dismiss != true()" );
	xarrUsers = XQuery( "for $elem in collaborators where " + ArrayMerge( conds, "This", " and " ) + " order by $elem/fullname return $elem/Fields('id','fullname','position_name')" );
	oRes.total = ArrayCount( xarrUsers );
	xarrUsers = ArrayRange( xarrUsers, iPageSize*( iPageNum - 1 ), iPageSize );

	for( _user in xarrUsers )
	{
		oRes.users.push( {
				"id": _user.id.Value,
				"person_icon": tools_web.get_object_source_url( 'person', _user.id ),
				"fullname": _user.fullname.Value,
				"position_name": _user.position_name.Value
			});
	}
	
	return oRes;
}


function get_archive_learning_records( _action, curUserID, curUser, Session, Response )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	
	var sSearch = String( _action.GetOptProperty( "search", "" ) );
	var sReportType = String( _action.GetOptProperty( "report_type", "" ) );
	var dStartDate;
	try
	{
		dStartDate = Date( _action.GetOptProperty( "start_date" ) );
	}
	catch( err )
	{
		dStartDate = null;
	}
	var dFinishDate;
	try
	{
		dFinishDate = Date( _action.GetOptProperty( "finish_date" ) );
	}
	catch( err )
	{
		dFinishDate = null;
	}
	var aPersonIds;
	try
	{
		aPersonIds = _action.GetOptProperty( "users" );
		if( !IsArray( aPersonIds ) )
		{
			throw "error";
		}
	}
	catch( err )
	{
		aPersonIds = new Array();
	}
	var aTypes;
	try
	{
		aTypes = _action.GetOptProperty( "types" );
		if( !IsArray( aTypes ) )
		{
			throw "error";
		}
	}
	catch( err )
	{
		aTypes = new Array();
	}
	var aStatuses;
	try
	{
		aStatuses = _action.GetOptProperty( "statuses" );
		if( !IsArray( aStatuses ) )
		{
			throw "error";
		}
	}
	catch( err )
	{
		aStatuses = new Array();
	}
	var aStructureItems;
	try
	{
		aStructureItems = _action.GetOptProperty( "structure_items" );
		if( !IsArray( aStructureItems ) )
		{
			throw "error";
		}
	}
	catch( err )
	{
		aStructureItems = new Array();
	}
	var aViolationTypes;
	try
	{
		aViolationTypes = _action.GetOptProperty( "violations" );
		if( !IsArray( aViolationTypes ) )
		{
			throw "error";
		}
	}
	catch( err )
	{
		aViolationTypes = new Array();
	}
	var bCheckViolation = ArrayOptFirstElem( aViolationTypes ) != undefined;
	
	function check_violation( arrViolations )
	{
		if( !bCheckViolation )
		{
			return true;
		}
		return ArrayOptFirstElem( ArrayIntersect( arrViolations, aViolationTypes, "This.type_id", "This" ) ) != undefined
	}
	function check_violation_by_id( _id )
	{
		if( !bCheckViolation )
		{
			return true;
		}
		var docLearningRecord = get_object( _id ).doc;
		if( docLearningRecord == undefined )
		{
			return false
		}
		
		return ArrayOptFirstElem( ArrayIntersect( docLearningRecord.TopElem.violations, aViolationTypes, "This.type_id", "This" ) ) != undefined
	}
	function get_object( id )
	{
		id = OptInt( id );
		gr = ArrayOptFind( arrObjectDoc, 'This.id == ' + id );
		if( gr == undefined )
		{
			gr = new Object();
			gr.id = id;
			gr.doc = tools.open_doc( id );
			arrObjectDoc.push( gr );
		}
		return gr;
	}
	var arrObjectDoc;
	var sSatisfies = "";
	var arrSubdivisions = new Array();
	var arrPositions = new Array();
	var arrOrgs = new Array();
	for( _item in aStructureItems )
	{
		switch( _item.type )
		{
			case "position":
				arrPositions.push( _item.id );
				break;
			case "org":
				arrOrgs.push( _item.id );
				break;
			case "subdivision":
				arrSubdivisions.push( _item.id );
				if( _item.GetOptProperty( "include_children", false ) )
				{
					arrSubdivisions = ArrayUnion( arrSubdivisions, ArrayExtract( tools.xquery( "for $elem in subdivisions where IsHierChild( $elem/id, " + _item.id + " ) order by $elem/Hier() return $elem/Fields('id')" ), "id" ) );
				}
				break;
		}
	}
	if( ArrayOptFirstElem( arrPositions ) != undefined || ArrayOptFirstElem( arrSubdivisions ) != undefined || ArrayOptFirstElem( arrOrgs ) != undefined )
	{
		var satisfies_conds = new Array();
		if( ArrayOptFirstElem( arrPositions ) != undefined )
		{
			satisfies_conds.push( "MatchSome( $elem_col/position_id, (" + ArrayMerge( arrPositions, "This", "," ) + ") )" );
		}
		if( ArrayOptFirstElem( arrOrgs ) != undefined )
		{
			satisfies_conds.push( "MatchSome( $elem_col/org_id, (" + ArrayMerge( arrOrgs, "This", "," ) + ") )" );
		}
		if( ArrayOptFirstElem( arrSubdivisions ) != undefined )
		{
			satisfies_conds.push( "MatchSome( $elem_col/position_parent_id, (" + ArrayMerge( arrSubdivisions, "This", "," ) + ") )" );
		}
		sSatisfies = " where some $elem_col in collaborators satisfies ( $elem_col/id = $elem/person_id and ( " + ArrayMerge( satisfies_conds, "This", " or " ) + " ) )";
	}
	
	var conds = new Array();
	if( sSearch != "" )
	{
		conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( sSearch ) + " )" );
	}

	if( dStartDate != null )
	{
		conds.push( "$elem/start_date >= " + XQueryLiteral( dStartDate ) );
	}
	if( dFinishDate != null )
	{
		conds.push( "$elem/start_date <= " + XQueryLiteral( dFinishDate ) );
	}

	if( ArrayOptFirstElem( aStatuses ) != undefined )
	{
		conds.push( "MatchSome( $elem/state_id, ( " + ArrayMerge( aStatuses, "XQueryLiteral( String( This ) )", "," ) + " ) )" );
	}
	if( ArrayOptFirstElem( aTypes ) != undefined )
	{
		conds.push( "MatchSome( $elem/proctoring_object_type, ( " + ArrayMerge( aTypes, "XQueryLiteral( String( This ) )", "," ) + " ) )" );
	}
	iGroupFullAccess = OptInt( get_proctoring_system_params().params.GetOptProperty( "full_access_group_id" ) );
	if( iGroupFullAccess == undefined || ArrayOptFirstElem( XQuery( "for $elem in group_collaborators where $elem/collaborator_id = " + curUserID + " and $elem/group_id = " + iGroupFullAccess + " return $elem" ) ) == undefined )
	{
		conds.push( "MatchSome( $elem/archive_proctors_id, ( " + curUserID + " ) )" );
	}
	var iPageSize = OptInt( sAction.GetOptProperty( 'page_size' ), 100 );
	var iPageNum = OptInt( sAction.GetOptProperty( 'page_num' ), 1 );
	//alert("for $elem in learning_records " + sSatisfies + ( ArrayOptFirstElem( conds ) != undefined ? ( sSatisfies == "" ? " where " : " and " ) + ArrayMerge( conds, "This", " and " ) : "" ) + " order by $elem/start_date descending return $elem")
	var xarrLearningRecords = XQuery( "for $elem in learning_records " + sSatisfies + ( ArrayOptFirstElem( conds ) != undefined ? ( sSatisfies == "" ? " where " : " and " ) + ArrayMerge( conds, "This", " and " ) : "" ) + " order by $elem/start_date descending return $elem" );
	
	if( bCheckViolation )
	{
		xarrLearningRecords = ArraySelect( xarrLearningRecords, "check_violation_by_id( This.id )" );
	}
	oRes.total = ArrayCount( xarrLearningRecords );
	xarrLearningRecords = ArrayRange( xarrLearningRecords, iPageSize*( iPageNum - 1 ), iPageSize );
	
	
	oRes.learning_records = new Array();
	if( sReportType == "by_violations" )
	{
		function get_foreign_elem_object( id )
		{
			if( !id.HasValue )
			{
				return undefined;
			}
			catObject = ArrayOptFind( arrForeignElemObject, "This.id == " + id );
			if( catObject == undefined )
			{
				catObject = new Object();
				catObject.id = id.Value;
				catObject.foreign_elem = id.OptForeignElem;
				arrForeignElemObject.push( catObject );
			}
			return catObject.foreign_elem;
		}
		function get_person_staff( id )
		{
			if( !id.HasValue )
			{
				return "";
			}
			catObject = ArrayOptFind( arrStaffPositions, "This.id == " + id );
			if( catObject == undefined )
			{
				catObject = new Object();
				catObject.id = id.Value;
				catObject.staff = tools.person_list_staff_by_person_id( id, null, '','','/' );
				arrStaffPositions.push( catObject );
			}
			return catObject.staff;
		}
		var arrForeignElemObject = new Array();
		var arrStaffPositions = new Array();
		for( _learning_record in xarrLearningRecords )
		{
			arrViolationTypes = new Array();
			docLearningRecord = get_object( _learning_record.id ).doc;
			if( docLearningRecord == undefined )
			{
				continue;
			}
			
			for( _violation in docLearningRecord.TopElem.violations )
			{
				
				iDuration = get_seconds_from_interval( _violation.interval.finish_time ) - get_seconds_from_interval( _violation.interval.start_time );
				arrViolationTypes.push( { "type": _violation.type_id.Value, "start_time": ( _violation.date.HasValue ? get_str_time_from_date( _violation.date ) : "" ), "finish_time": ( _violation.date.HasValue ? get_str_time_from_date( DateOffset( _violation.date, iDuration ) ) : "" ), "duration": (  tools.str_time_from_mseconds( iDuration > 0 ? iDuration*1000 : 0 ) ) } );
			}
			feProctoringObject = get_foreign_elem_object( docLearningRecord.TopElem.proctoring_object_id );
			oRes.learning_records.push( {
					"id": _learning_record.id.Value,
					"person_id": _learning_record.person_id.Value,
					"person_fullname": _learning_record.person_fullname.Value,
					"person_position_name": _learning_record.person_position_name.Value,
					"person_subdivision_name": _learning_record.person_subdivision_name.Value,
					"person_staff": get_person_staff( _learning_record.person_id ),
					"avatar_url": tools_web.get_object_source_url( 'person', _learning_record.person_id ),
					"name": _learning_record.proctoring_object_name.Value,
					"type": _learning_record.proctoring_object_type.Value,
					"code": ( feProctoringObject != undefined && feProctoringObject.ChildExists( "code" ) ? feProctoringObject.code.Value : "" ),
					"violations": arrViolationTypes
				});
		}
		bDownload = tools_web.is_true( sAction.GetOptProperty( "download" ) );
		if( bDownload )
		{
			arrViolationTypes = common.violation_types;
			arrDatas = new Array();
			var oViolation = null;
			for( _learning_record in oRes.learning_records )
			{
				oViolation = _learning_record;
				for( _violation in _learning_record.violations )
				{
					if( oViolation == null )
					{
						oViolation = _learning_record;
					}
					catViolationType = ArrayOptFind( arrViolationTypes, "This.id == _violation.type" );
					oViolation.SetProperty( "violation_name", ( catViolationType != undefined ? RValue( catViolationType.name ) : "" ) );
					oViolation.SetProperty( "violation_start_time", _violation.start_time );
					oViolation.SetProperty( "violation_finish_time", _violation.finish_time );
					oViolation.SetProperty( "violation_duration", _violation.duration );
					arrDatas.push( oViolation );
					oViolation = null;
				}
				
			}
			arrHeaders = new Array();
			arrHeaders.push( { "title": "Код", "data": "code" } );
			arrHeaders.push( { "title": "Мероприятие", "data": "name" } );
			arrHeaders.push( { "title": "ФИО", "data": "person_fullname" } );
			arrHeaders.push( { "title": "Должность", "data": "person_position_name" } );
			arrHeaders.push( { "title": "Подразделение", "data": "person_subdivision_name" } );
			arrHeaders.push( { "title": "Штатное расписание", "data": "person_staff" } );
			arrHeaders.push( { "title": "Тип нарушения", "data": "violation_name" } );
			arrHeaders.push( { "title": "Время начала нарушения", "data": "violation_start_time" } );
			arrHeaders.push( { "title": "Время окончания нарушения", "data": "violation_finish_time" } );
			arrHeaders.push( { "title": "Длительность нарушения", "data": "violation_duration" } );
			oResReport = create_xlsx_report( arrHeaders, arrDatas );
			Response.ContentType = tools_web.url_std_content_type( oResReport.file_url );
			Response.HandleStaticFile( UrlToFilePath( oResReport.file_url ) );
		}
	}
	else if( sReportType == "violations" )
	{
		for( _learning_record in xarrLearningRecords )
		{
			
			arrViolationTypes = new Array();
			docLearningRecord = get_object( _learning_record.id ).doc;
			if( docLearningRecord == undefined )
			{
				continue;
			}
			
			for( _violation in ArraySelectDistinct( docLearningRecord.TopElem.violations, "This.type_id" ) )
			{
				arrViolationTypes.push( { "type": _violation.type_id.Value, "number": ArrayCount( ArraySelect( docLearningRecord.TopElem.violations, "This.type_id == _violation.type_id" ) ) } );
			}
			oRes.learning_records.push( {
					"id": _learning_record.id.Value,
					"person_id": _learning_record.person_id.Value,
					"person_fullname": _learning_record.person_fullname.Value,
					"person_position_name": _learning_record.person_position_name.Value,
					"person_subdivision_name": _learning_record.person_subdivision_name.Value,
					"avatar_url": tools_web.get_object_source_url( 'person', _learning_record.person_id ),
					"name": _learning_record.proctoring_object_name.Value,
					"type": _learning_record.proctoring_object_type.Value,
					"start_date": _learning_record.start_date.Value,
					"status_id": _learning_record.state_id.Value,
					"status_name": _learning_record.state_id.OptForeignElem.name.Value,
					"finish_date": _learning_record.finish_date.Value,
					"violations": arrViolationTypes
				});
		}
		bDownload = tools_web.is_true( sAction.GetOptProperty( "download" ) );
		if( bDownload )
		{
			arrViolationTypes = common.violation_types;
			for( _learning_record in oRes.learning_records )
			{
				arrViolationName = new Array();
				for( _violation in _learning_record.violations )
				{
					catViolationType = ArrayOptFind( arrViolationTypes, "This.id == _violation.type" );
					if( catViolationType != undefined )
					{
						arrViolationName.push( catViolationType.name + " - " + _violation.number );
					}
				}
				_learning_record.SetProperty( "violations_name", ArrayMerge( arrViolationName, "This", "\r\n" ) );
			}
			arrHeaders = new Array();
			arrHeaders.push( { "title": "ФИО", "data": "person_fullname" } );
			arrHeaders.push( { "title": "Должность", "data": "person_position_name" } );
			arrHeaders.push( { "title": "Подразделение", "data": "person_subdivision_name" } );
			arrHeaders.push( { "title": "Мероприятие", "data": "name" } );
			arrHeaders.push( { "title": "Дата начала", "data": "start_date", "format": "date" } );
			arrHeaders.push( { "title": "Дата завершения", "data": "finish_date", "format": "date" } );
			arrHeaders.push( { "title": "Статус", "data": "status_name" } );
			arrHeaders.push( { "title": "Нарушения", "data": "violations_name", "width": 40 } );
			oResReport = create_xlsx_report( arrHeaders, oRes.learning_records );
			Response.ContentType = tools_web.url_std_content_type( oResReport.file_url );
			Response.HandleStaticFile( UrlToFilePath( oResReport.file_url ) );
		}
	}
	else
	{
		
		for( _learning_record in xarrLearningRecords )
		{
			oRes.learning_records.push( {
					"id": _learning_record.id.Value,
					"person_id": _learning_record.person_id.Value,
					"person_fullname": _learning_record.person_fullname.Value,
					"person_position_name": _learning_record.person_position_name.Value,
					"person_subdivision_name": _learning_record.person_subdivision_name.Value,
					"avatar_url": tools_web.get_object_source_url( 'person', _learning_record.person_id ),
					"name": _learning_record.proctoring_object_name.Value,
					"type": _learning_record.proctoring_object_type.Value,
					"start_date": _learning_record.start_date.Value,
					"status_id": _learning_record.state_id.Value,
					"status_name": _learning_record.state_id.OptForeignElem.name.Value,
					"finish_date": _learning_record.finish_date.Value
				});
		}
		bDownload = tools_web.is_true( sAction.GetOptProperty( "download" ) );
		if( bDownload )
		{
			arrHeaders = new Array();
			arrHeaders.push( { "title": "ФИО", "data": "person_fullname" } );
			arrHeaders.push( { "title": "Должность", "data": "person_position_name" } );
			arrHeaders.push( { "title": "Подразделение", "data": "person_subdivision_name" } );
			arrHeaders.push( { "title": "Мероприятие", "data": "name" } );
			arrHeaders.push( { "title": "Дата начала", "data": "start_date", "format": "date" } );
			arrHeaders.push( { "title": "Дата завершения", "data": "finish_date", "format": "date" } );
			arrHeaders.push( { "title": "Статус", "data": "status_name" } );
			oResReport = create_xlsx_report( arrHeaders, oRes.learning_records );
			Response.ContentType = tools_web.url_std_content_type( oResReport.file_url );
			Response.HandleStaticFile( UrlToFilePath( oResReport.file_url ) );
		}
	}
	
	return oRes;
}

function get_proctoring_settings( _action, curUserID )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = "";
	var iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );
	var oParams = new Object();
	var teRecord = OpenDoc( UrlFromDocID( Int( iLearningRecordID ) ) ).TopElem;
	
	oParams.SetProperty( 'iLearningId', iLearningRecordID );

	var teProctoringSystem = OpenDoc( UrlFromDocID( teRecord.proctoring_system_id ) ).TopElem;
	
	oParams.SetProperty( 'teProctoringSystem', teProctoringSystem );
	
	oRes.has_mats = false;
	oRes.settings = new Object();
	if( teProctoringSystem.library_url.HasValue )
	{
		CodeLib = OpenCodeLib( 'x-local://wtv/' + teProctoringSystem.library_url );
		oRes.settings = CallObjectMethod( CodeLib, 'getParamsProctoring', [ oParams ] );
	}
	
	if ( IsDirectory( 'x-local://wt/web/faces' ) )
	{
		try
		{
			arrFileNames = ReadDirectory( 'x-local://wt/web/faces' );
			for ( sFileNameElem in arrFileNames )
			{
				if ( UrlFileName( sFileNameElem ) == 'face_' + curUserID + ".mats" )
				{
					oRes.has_mats = true;
					break;
				}
			}
		}
		catch ( err2 )
		{
			alert( err2 );
		}
	}
	
	oRes.mediasoup = new Object();
	oRes.mediasoup.room_id = iLearningRecordID;
	oRes.mediasoup.ws_media_service_url = "";
	oRes.mediasoup.ticket_id = "";
	
	var oMediaSoup = tools.dotnet_host.Object.GetAssembly( "Datex.MediaSoup.dll" );
	
	try
	{
		var sResGetRoomJson = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "GetRoom", [ null, String( iLearningRecordID ) ] );
		oResRegisterRoom = ArrayOptFirstElem( sResGetRoomJson );
		if( oResRegisterRoom == undefined )
		{
			throw "error";
		}
		oResRegisterRoom = ParseJson( oResRegisterRoom );
		oRes.mediasoup.ws_media_service_url = oResRegisterRoom.GetOptProperty( "Url", "" );
	}
	catch( ex )
	{
		try
		{
			var CurRequestUrl;
			try
			{
				CurRequestUrl = CurRequest.Url;
			}
			catch( er )
			{
				CurRequestUrl = "";
			}
			
			var oNetworkLimits = null;
			var aUIDs = null;	

			var oResSocket = tools.call_code_library_method( 'libMain', 'get_socket_url', [ CurRequestUrl, aUIDs ] );
			//alert("oResSocket "+EncodeJson(oResSocket));
			var sResRegisterRoomJson = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "RegisterRoom", [ ( curUserID + "" ), String( iLearningRecordID ), null, oResSocket.ws_media_service_url ] );
			
			oMediaSoup.CallClassStaticMethod( 'Datex.MediaSoup.InterServices','RemoveRoomAudioLevelObserverOptions',[ String( iLearningRecordID )]);
			oRes.mediasoup.ws_media_service_url = oResSocket.ws_media_service_url;
			if( oNetworkLimits != null )
			{
				oMediaSoup.CallClassStaticMethod( 'Datex.MediaSoup.InterServices','SetRoomNetworkLimits',[ EncodeJson( oNetworkLimits ) ]);  
			}
		}
		catch( err )
		{
			alert(err);
			oRes.error = 1;
			oRes.message = "Error create room.";
			return oRes;
		}
	}
	var oMediaSoupService = tools.dotnet_host.Object.GetAssembly( "Datex.MediaSoup.Service.dll" );
	var arrRoomTickets = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "GetTickets", [ null, String( iLearningRecordID ), null ] );
	arrRoomTickets = ArrayExtract( arrRoomTickets, "ParseJson( This )" );
	var catUserTicket = ArrayOptFind( arrRoomTickets, "OptInt( This.UserId ) == curUserID" );
	if( catUserTicket == undefined )
	{
		var aTickets = oMediaSoup.CallClassStaticMethod( "Datex.MediaSoup.InterServices", "RegisterRoomTickets", [ [curUserID], String( iLearningRecordID ), null, tools.call_code_library_method( "libChat", "get_ticket_expire", [] ) ] );
		aTickets = ArrayExtract( aTickets, "ParseJson( This )" );
		catUserTicket = ArrayOptFind( aTickets, "OptInt( This.UserId ) == curUserID" );
	}
	else
	{
		if( !tools.call_code_library_method( "libChat", "check_expiration_ticket", [ catUserTicket ] ) )
		{
			try
			{
				oMediaSoupService.CallClassStaticMethod( "Datex.MediaSoup.Service", "RestoreTicketByPeerId", [ catUserTicket.GetOptProperty( "PeerId", null ), catUserTicket.UserId, catUserTicket.Id, tools.call_code_library_method( "libChat", "get_ticket_expire", [] ) ] );
			}
			catch( ex )
			{
				alert(ex)
			}
		}
	}
	oRes.mediasoup.ticket_id = catUserTicket.Id;
	
	return oRes
}

function get_structure( _action, curUserID, curUser, Session )
{
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = "";
	function get_staff_structure( catElem )
	{
		var aStaff = new Array();
		while( catElem.parent_id.HasValue )
		{
			catElem = ArrayOptFirstElem( XQuery( "for $elem in subs where $elem/id = " + catElem.parent_id + " return $elem/Fields('id','name','parent_id')" ) );
			if( catElem == undefined )
			{
				break;
			}
			aStaff.push( catElem.name.Value );
		}
		var a2Staff = new Array();
		for( i = ( aStaff.length - 1 ); i>=0; i-- )
		{
			a2Staff.push( aStaff[ i ] );
		}
		return ArrayMerge( a2Staff, "This", " / " )
	}
	
	var bAccess = false;
	var catCatalogRemoteCollection = ArrayOptFirstElem( XQuery( "for $elem in remote_collections where $elem/code = 'uni_catalog_list_org' return $elem/Fields('id')" ) );
	if ( catCatalogRemoteCollection != undefined )
	{
		bAccess = tools_web.check_access( OpenDoc( UrlFromDocID ( catCatalogRemoteCollection.id ), "form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1" ).TopElem, curUserID, curUser, Session );
	}
	else
	{
		bAccess = true;
	}
	if( bAccess )
	{
		catCatalogRemoteCollection = ArrayOptFirstElem( XQuery( "for $elem in remote_collections where $elem/code = 'uni_catalog_list_subdivision' return $elem/Fields('id')" ) );
		if ( catCatalogRemoteCollection != undefined )
		{
			bAccess = tools_web.check_access( OpenDoc( UrlFromDocID ( catCatalogRemoteCollection.id ), "form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1" ).TopElem, curUserID, curUser, Session );
		}
		else
		{
			bAccess = true;
		}
	}
	if( bAccess )
	{
		catCatalogRemoteCollection = ArrayOptFirstElem( XQuery( "for $elem in remote_collections where $elem/code = 'uni_catalog_list_position' return $elem/Fields('id')" ) );
		if ( catCatalogRemoteCollection != undefined )
		{
			bAccess = tools_web.check_access( OpenDoc( UrlFromDocID ( catCatalogRemoteCollection.id ), "form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1" ).TopElem, curUserID, curUser, Session );
		}
		else
		{
			bAccess = true;
		}
	}

	if ( !bAccess )
	{
		oRes.error = 1;
		oRes.message = "Access is denied.";
		return oRes;
	}
	var iCurrentSubID = OptInt( _action.GetOptProperty( "item_id" ) );
	var sSearch = String( _action.GetOptProperty( "search", "" ) );
	oRes.SetProperty( "items", [] );
	if( sSearch == "" )
	{
		var xarrSubs = XQuery( "for $elem in subs where $elem/parent_id = " + ( iCurrentSubID == undefined ? "null()" : iCurrentSubID ) + " return $elem/Fields('id', 'name', 'type', 'parent_id', 'basic_collaborator_fullname')" );
		if( ArrayOptFirstElem( xarrSubs ) != undefined )
		{
			var sStaff = undefined;
			var xarrChildrenSubs = ArraySelectDistinct( XQuery( "for $elem_qc in subs where MatchSome( $elem_qc/parent_id, ( " + ArrayMerge( xarrSubs, "This.id", "," ) + " ) ) return $elem_qc/Fields('parent_id')" ), "This.parent_id" );
			for( _sub in xarrSubs )
			{
				if( sStaff == undefined )
				{
					sStaff = get_staff_structure( _sub );
				}
				oSub = new Object();
				oSub.id = _sub.id.Value;
				oSub.name = (_sub.type == "position" ? _sub.basic_collaborator_fullname.Value : _sub.name.Value );
				oSub.type = _sub.type.Value;
				oSub.staff = sStaff;
				if( ArrayOptFind( xarrChildrenSubs, "This.parent_id == _sub.id" ) != undefined )
				{
					oSub.SetProperty( "children", [] )
				}
				oRes.items.push( oSub );
			}
		}
	}
	else
	{
		var xarrSubs = XQuery( "for $elem in subs where contains( $elem/basic_collaborator_fullname, ( " + XQueryLiteral( sSearch ) + " ) ) or contains( $elem/name, ( " + XQueryLiteral( sSearch ) + " ) ) return $elem/Fields('id', 'name', 'type', 'parent_id', 'basic_collaborator_fullname')" );
		for( _sub in xarrSubs )
		{
			oSub = new Object();
			oSub.id = _sub.id.Value;
			oSub.name = (_sub.type == "position" ? _sub.basic_collaborator_fullname.Value : _sub.name.Value );
			oSub.type = _sub.type.Value;
			oSub.staff = get_staff_structure( _sub );
			oRes.items.push( oSub );
		}
	}
	return oRes;
}
function proctor_api( Request, Response, Session, sAction, sWebSocketCurrentId )
{
	/*
		функция обрабатывает запрос от интерфейса проктора
		Request		- Объект Request
		Response	- Объект Response
		Session		- Объект сессии
		sAction		- Объект с параметрами запроса
	*/
	alerd( 'proctor_api start ')
	try
	{
		if( Session == null || Session == undefined || Session == '' )
			throw 'not session'
	}
	catch( ex )
	{
		Session = Request.Session;
	}
	try
	{
		if( sWebSocketCurrentId == undefined || sWebSocketCurrentId == '' )
			throw 'not sWebSocketCurrentId'
	}
	catch( ex )
	{
		sWebSocketCurrentId = null;
	}

	var curUser, curUserID, curLngWeb, curLng;
	var oUserInit = tools_web.user_init( Request, ( sWebSocketCurrentId == null ? Request.Query : {} ) );
			
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
		alerd( 'proctor_api finish ')
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
		oAnswer.error = 1;
		oAnswer.message = String( text_error );
		throw '!!!';
	}

	function get_object( id )
	{
		id = OptInt( id );
		var gr = ArrayOptFind( arrObjectDoc, 'This.id == ' + id );
		if( gr == undefined )
		{
			gr = new Object();
			gr.id = id;
			gr.doc = tools.open_doc( id );
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
		else if( Request.Form.GetOptProperty( "action" ) != undefined )
			sAction = Request.Form;
		else
			sAction = tools.read_object( ( Request.Body ) );
	}

	arrObjectDoc = new Array();
	oAnswer = new Object();
	oAnswer.error = 0;
	oAnswer.actions = new Array();
	aActions = new Array();
	if( IsArray( sAction ) )
	{
		aActions = sAction;
	}
	else
	{
		aActions.push( sAction );
	}
	for( _action in aActions )
	{
		oAnswerAction = new Object();
		oAnswerAction.id = _action.GetOptProperty( "id", "" );
		oAnswerAction.error = 0;
		oAnswerAction.message = "";
		try
		{
			//oAnswer.action = sAction.action;
			oAnswerAction = new Object();
			oAnswerAction.id = _action.GetOptProperty( "id", "" );
			
			oAnswerAction.action = _action.action;
			switch( _action.action )
			{
				case "init_proctor":
				{
					oResInit = init_proctor_session( curUserID, sWebSocketCurrentId );
					if( oResInit.error != 0 )
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
					//oAnswerAction.session_id = oResInit.session_id;
					break;
				}
				case "close_proctor":
				{
					oResInit = close_proctor_session( curUserID, sWebSocketCurrentId );
					if( oResInit.error != 0 )
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
					//oAnswerAction.session_id = oResInit.session_id;
					break;
				}
				case "start_proctoring_record":
				{
					oResInit = start_proctoring_record( _action, curUserID, Request );
					if( oResInit.error != 0 )
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
														  
							  
					//oAnswerAction.session_id = oResInit.session_id;
					break;
				}
				case "init_proctoring":
				{
					iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );	
					docLearningRecord = get_object( iLearningRecordID ).doc;
					if( docLearningRecord.TopElem.person_id != curUserID )
					{
						oAnswerAction.error = 1;
						oAnswerAction.message = "Access is denied.";
						break;
					}
					oResInit = init_proctoring_session( iLearningRecordID, docLearningRecord, sWebSocketCurrentId );
					if( oResInit.error != 0 )
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
					oAnswerAction.learning_record_id = iLearningRecordID;
					oAnswerAction.session_id = oResInit.session_id;
					break;
				}
				case "close_proctoring":
				{
					iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );	
					docLearningRecord = get_object( iLearningRecordID ).doc;
					if( docLearningRecord.TopElem.person_id != curUserID )
					{
						oAnswerAction.error = 1;
						oAnswerAction.message = "Access is denied.";
						break;
					}
					sSessionID = _action.GetOptProperty( "session_id", "" );
					if( sSessionID == "" )
					{
						oAnswerAction.error = 1;
						oAnswerAction.message = "Incorrect session_id.";
						break;
					}

																																					 
	 
					oResInit = close_proctoring_session( iLearningRecordID, docLearningRecord, sSessionID, sWebSocketCurrentId );
					if( oResInit.error != 0 )
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
					break;
				}
				case "app_init":
				{
					function get_wvar_value( name, default_value )
					{
						_wvar = teApp.wvars.GetOptChildByKey( "logoUrlLight" );
						if( _wvar == undefined || !_wvar.value.HasValue )
						{
							return default_value;
						}
						return _wvar.value.Value
					}

					oAnswerAction.SetProperty( "signed_in", true );
					oAnswerAction.SetProperty( "has_access", ( ArrayOptFirstElem( XQuery( "for $elem in object_experts where $elem/person_id = " + curUserID + " and $elem/type = 'proctor' return $elem" ) ) != undefined ) );
					var sLang;
					try {
						var resEnv = tools_web.get_host_obj(CurRequest);
						sLang = String(resEnv.curLng.short_id);
					}
					catch (error) {
						sLang = "ru";
					}
					oAnswerAction.SetProperty( "lang", sLang );
					break;
				}
				case "get_learning_records":
				{
					oAnswerAction.learning_records = get_learning_records( curUserID ).learning_records;
																
	  
																																																						
	  
													
	   
																										   
											 
									  
													
																
																							
															
															
													  
																						 
		   
	   
	  
					break;
				}
				case "update_violation":
																				  
															 
																 

							 
				{
					oResInit = update_violation( _action, curUserID );
					if( oResInit.error != 0 )
		 
	  
																   
	  
														   
	  
															   
	  
														   
	  
															   
	  
																		   
	  
																					 
	  
		 
	  
																			
	  
															
	  
																 
	  
															
	  
																 
	  
															
	  
																																			 
																																			   
	  
																	
	  
																																				  
	  
										 
	  
									   
	  
									
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
							  
					break;
				}
				case "get_learning_record":
				{
					iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );
					teLearningRecord = get_object( iLearningRecordID ).doc.TopElem;
					
					oAnswerAction = get_learning_record_api( iLearningRecordID, teLearningRecord, oAnswerAction );
					
					break;
				}
				case "update_learning_record":
				{
					iLearningRecordID = OptInt( _action.GetOptProperty( "learning_record_id" ) );
					oAnswerAction.learning_record_id = iLearningRecordID;
					docLearningRecord = get_object( iLearningRecordID ).doc;
					
					if( _action.GetOptProperty( "state_id", "" ) != "" )
					{
						docLearningRecord.TopElem.state_id = _action.GetOptProperty( "state_id", "" );
					}
					if( _action.GetOptProperty( "comment", "" ) != "" )
					{
						docLearningRecord.TopElem.result_comment = _action.GetOptProperty( "comment", "" );
					}
					docLearningRecord.Save();
					
					break;
				}
				case "get_archive_filter_users":
				{
																																												
												   
	  
					oResInit = get_archive_filter_users( _action, curUserID, curUser, Session );
					if( oResInit.error != 0 )
		 
	  
					 
	  

					
	  
							  
												  
			
	  
															
							 
									   
						
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
																	  
																  
						 
																						   
												
																																														
												   
																				

							  
	  
								 
							 
																			 
										 
												  
		  
	  
					oAnswerAction.total = oResInit.total;
					oAnswerAction.users = oResInit.users;
					break;
				}
				case "get_archive_learning_records":
 
																
																		 
		
				{
					oResInit = get_archive_learning_records( _action, curUserID, curUser, Session, Response );
					if( oResInit.error != 0 )
				 
	  
						
	  
		
	  
																	
	  
				 
	  
						 
	  
		
	  
													 
								  
	   
					 
	   
	  
				 
	  
							   
	  
		
	  
												 
							  
	   
					 
	   
	  
				 
	  
						   
	  
		
	  
													   
								 
	   
					 
	   
	  
				 
	  
							  
	  
		
	  
																	
									   
	   
					 
	   
	  
				 
	  
									
	  
		
	  
															   
									   
	   
					 
	   
	  
				 
	  
									
	  
																			 
	 
											  
	  
							
	   
				   
	   
																													   
	  
										  
	  
							
	   
				   
	   
													
										  
	   
				   
	   
	  
																																			  
	  
	 
					 
								   
								
						   
									
	  
						  
	   
					   
									  
			  
				  
								 
			  
						  
										 
															   
		 
																																																							
		 
			  
	   
	  
																																						   
	  
									
														  
	   
																													   
	   
													 
	   
																											 
	   
															 
	   
																																 
	   
																																									   
	  
	 
						 
						
	  
																							
	  

							 
	  
																		 
	  
							  
	  
																		  
	  
														 
		
																										
		
													  
	  
																															   
	  
												   
	  
																																		  
	  
																												 
																																																									 
	  
																					
	  
																	  
																  
																																																														 
																																																																				 
	 
						  
	  
																								   
	  
															 
																									
	 
	 
												  
										 
	  
											
	   
						 
		
						 
		
																			
								   
		
								 
								
												   
											   
		
									 
	   
									 
	   
						 
		
				  
		
																		 
								   
		
								 
								
																					  
											
		
							  
	   
										 
									  
													
	   
									   
																 
										   
		
				 
		
	   
																
		
		
																																			   
																																																																																												
		
																									  
											 
										 
													   
																   
																			 
																				   
																		
																							   
															   
															   
																																	  
										
		   
	   
																			
					 
	   
												  
							  
							 
																
		
									  
														
		 
								 
		  
										
		  
																							
																															  
																				 
																				   
																			 
									 
						   
		 
		
		
								
																
																				
																		   
																							
																									   
																									 
																							 
																													
																														   
																												   
															   
																					
																		 
	   
	  
										   
	  
													
	   
	   
									   
																 
										   
		
				 
		
	   
																									   
		
																																														  
		
											 
										 
													   
																   
																			 
																				   
																							   
															   
															   
														 
													  
																			
														   
										
		   
	   
																			
					 
	   
												  
																
		
									   
														
		 
																							
											
		  
																					 
		  
		 
																										  
		
								
																		   
																							
																									   
																				
																									   
																												
																			 
																									
																					 
																					
																		 
	   
	  
		 
					{
	  
													
	   
						oAnswerAction.error = oResInit.error;
										 
													   
																   
																			 
																				   
																							   
															   
															   
														 
													  
																			
														  
		   
	   
																			
					 
	   
								
																		   
																							
																									   
																				
																									   
																												
																			 
						oAnswerAction.message = oResInit.message;
						break;
																		 
	   
					}
					oAnswerAction.total = oResInit.total;
					oAnswerAction.learning_records = oResInit.learning_records;
					break;
				}
				case "get_violation_settings":
				{
					oAnswerAction.violation = new Object();
					oAnswerAction.violation.types = new Object();
					oAnswerAction.violation.statuses = new Object();
					for( _status in common.violation_states )
					{
						oAnswerAction.violation.statuses.SetProperty( _status.id.Value, { "name": _status.name.Value } )
					}
					for( _type in common.violation_types )
					{
						oAnswerAction.violation.types.SetProperty( _type.id.Value, { "name": _type.name.Value, "icon": _type.icon_url.Value } )
					}
					break;
				}
				case "get_session_settings":
				{
					oAnswerAction.session = new Object();
					oAnswerAction.session.types = new Object();
					oAnswerAction.session.statuses = new Object();
					for( _status in common.learning_record_statuss )
					{
						oAnswerAction.session.statuses.SetProperty( _status.id.Value, { "name": _status.name.Value, "icon": _status.icon_url.Value } )
					}
					for( _type in common.proctoring_objects )
					{
						oAnswerAction.session.types.SetProperty( _type.id.Value, { "name": common.exchange_object_types.GetOptChildByKey( _type.id.Value ).title.Value, "icon": _type.icon_url.Value } )
					}
					break;
				}
				case "get_proctoring_settings":
				{
					oResInit = get_proctoring_settings( _action, curUserID );
					if( oResInit.error != 0 )
	 
															 

																						   
	 
																	 
	 
									
										   
												  
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
					oAnswerAction.SetProperty( "has_mats", oResInit.has_mats );
					oAnswerAction.SetProperty( "mediasoup", oResInit.mediasoup );
					oAnswerAction.SetProperty( "settings", oResInit.settings );
					
												   
	  
		 
	   
																
											
		
																			
		 
									   
			   
		 
		
	   
					
	   
					 
	   
	  
																					
											
														 
													   
											
								  
		
	  
																																				  
															  
										 
	   
					 
	   
													   
																								  
	  
				
	  
		 
	   
						 
		  
		
									   
		
				  
		
						   
		
	   
								 
						 
	
																												
													 
																																																				  
	   
																																			   
																					  
								   
		
																																	 
		
							   
	   
	   
				  
	   
				  
							   
													
			 
	   
	  
																								   
																																						 
																		  
																							  
									 
	  
																																																										  
															   
																					 
	  
		 
	  
																									  
	   
		  
		
																																																																		
		
				  
		
				 
		
	   
	  
														  
														 
																										  
											
	  
																																																															 
																			 
																										
	  
		 
	  
																											 
	   
		  
		
																																																																					  
		
				  
		
				 
		
	   
	  
						   
	  
		 
	   
	   
																   
				
						   
		
											  
							
		 
				   
							  
				
					
							   
				
		 
		
														
		
		   
		
																								  
		
															

										
								
													
											
																					
						   
											   
																									  
	   
																																				
	   
				 
	   
				   
	   
	  
					break;
				}
				case "get_structure":
											
	  
							   
										 
	   
																																							
								 
		
			  
		
										 
	   
								
												 
				{
								   
	   
												 
	  
	 
					 
																																									   
												   
	  
					oResInit = get_structure( _action, curUserID, curUser, Session );
					if( oResInit.error != 0 )
		 
	  
					 
	  
				  
	  
																																												
													
	   
																																																			   
	   
		  
	   
					  
	   
	  
				  
	  
																																											 
													
	   
																																																			   
	   
		  
	   
					  
	   
	  

					
					{
						oAnswerAction.error = oResInit.error;
						oAnswerAction.message = oResInit.message;
						break;
					}
																   
																
					oAnswerAction.SetProperty( "items", oResInit.has_mats );
						
	  
																																																							   
													  
	   
						  
																																																								  
							  
		
								 
		 
											  
		 
							
								
																										  
									
							
																						
		 
										   
		 
										 
		
	   
	  
		 
	  
																																																																							   
							 
	   
						   
							   
																										 
								   
												
										
	   
	  
					
					break;
				}
				default:
				{
					set_error( 'Действие не определено' );
				}
			}
			oAnswerAction.SetProperty( "action", _action.action );
		}
		catch( ex )
		{
			if( !StrBegins( ex, '!!!' ) )
			{
				alert( 'proctor_api ' + ex )
				oAnswerAction.error = 1;
				oAnswerAction.message = String( ex );
			}
		}
		oAnswer.actions.push( oAnswerAction );
	}
	alerd( 'proctor_api finish ')
	return oAnswer;
}

/**
 * @function InitProctorSession
 * @memberof Websoft.WT.Proctor
 * @description Инициализация сессии проктора.
 * @param {bigint} iPersonID - ID проктора
 * @returns {WTProctorResult}
 */
function InitProctorSession( iPersonID )
{
	return init_proctor_session( iPersonID );
}

function init_proctor_session( iPersonID, sWebSocketCurrentId )
{
	/*
		Инициализация сессии проктора.
		iPersonID			- ID проктора
		sWebSocketCurrentId - ID сокета
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect person_id';
		return oRes;
	}
	try
	{
		if( sWebSocketCurrentId == undefined || sWebSocketCurrentId == '' )
			throw 'not sWebSocketCurrentId'
	}
	catch( ex )
	{
		sWebSocketCurrentId = null;
	}
	sUserDataKey = "proctor_sessions";
	
	oProctor = undefined;
	
	aProctors = tools_web.get_user_data( sUserDataKey );

	if( aProctors == undefined || aProctors == null )
		aProctors = new Array();
	else
		aProctors = aProctors.GetOptProperty( "result", [] )
	oProctor = ArrayOptFind( aProctors, "This.proctor_id == iPersonID " + ( sWebSocketCurrentId != null ? " && This.socket_id == sWebSocketCurrentId" : "" ) );
	if( oProctor == undefined )
	{
		oProctor = new Object();
		oProctor.proctor_id = iPersonID;
		oProctor.socket_id = sWebSocketCurrentId;
		aProctors.push( oProctor );
	}
	tools_web.set_user_data( sUserDataKey, { result: aProctors }, 86400 );
	
	if( sWebSocketCurrentId != null )
	{
		xarrLearningRecords = XQuery( "for $elem in learning_records where MatchSome( $elem/proctors_id, ( " + iPersonID + " ) ) return $elem" );
		oAnswer = new Object();
		oAnswer.error = 0;
		oAnswer.actions = new Array();
		oAnswerAction = new Object();
		oAnswerAction.id = "";
		oAnswerAction.error = 0;
		oAnswerAction.action = "get_learning_records";
		oAnswerAction.learning_records = new Array();
		if( ArrayOptFirstElem( xarrLearningRecords ) != undefined )
		{
			
			xarrConversations = XQuery( "for $elem in conversations where MatchSome( $elem/active_object_id, ( " + ArrayMerge( xarrLearningRecords, "This.id", "," ) + " ) ) return $elem/Fields('id', 'active_object_id')" );
							
			for( _learning_record in xarrLearningRecords )
			{
				catConversation = ArrayOptFind( xarrConversations, "This.active_object_id == _learning_record.id" );
				oAnswerAction.learning_records.push( {
					id: _learning_record.id.Value,
					person_id: _learning_record.person_id.Value,
					person_fullname: _learning_record.person_fullname.Value,
					avatar_url: tools_web.get_object_source_url( 'person', _learning_record.person_id ),
					name: _learning_record.proctoring_object_name.Value,
					type: _learning_record.proctoring_object_type.Value,
					start_date: _learning_record.start_date.Value,
					conversation_id: ( catConversation != undefined ? catConversation.id.Value : "" )
				} );
			}
			
		}
		oAnswer.actions.push( oAnswerAction );
		tools.call_code_library_method( 'libChat', 'send_message_by_socket_id', [ [ sWebSocketCurrentId ], ( oAnswer ) ] )
	}
	return oRes;
}
/**
 * @function CloseProctorSession
 * @memberof Websoft.WT.Proctor
 * @description Закрытие сессии проктора.
 * @param {bigint} iPersonID - ID проктора
 * @returns {WTProctorResult}
 */
function CloseProctorSession( iPersonID )
{
	return close_proctor_session( iPersonID );
}

function close_proctor_session( iPersonID )
{
	/*
		Закрытие сессии проктора.
		iPersonID - ID проктора
	*/
	var oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		iPersonID = Int( iPersonID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect person_id';
		return oRes;
	}
	
	sUserDataKey = "proctor_sessions";
	aProctors = tools_web.get_user_data( sUserDataKey );
	if( aProctors == undefined || aProctors == null )
	{
		aProctors = new Array();
	}
	else
	{
		aProctors = aProctors.GetOptProperty( "result", [] )
	}
	if( aProctors == undefined )
	{
		return oRes;
	}
	for( _learning_record in XQuery( "for $elem in learning_records where MatchSome( $elem/proctors_id, (" + iPersonID + ") ) return $elem/Fields('id')" ) )
		try
		{
			docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
			catProctor = docLearningRecord.TopElem.proctors.GetOptChildByKey( iPersonID );
			if( catProctor != undefined && !catProctor.is_prefer )
			{
				docLearningRecord.TopElem.proctors.DeleteChildByKey( iPersonID );
				docLearningRecord.Save();
			}
		}
		catch( ex ){}
	tools.call_code_library_method( 'libChat', 'send_message_by_socket_id', [ ArrayExtract( ArraySelect( aProctors, "This.proctor_id == iPersonID" ), "This.socket_id" ), {	error: 0,	actions: [ { action: "close_proctor_session" } ] } ] );
	tools_web.set_user_data( sUserDataKey, { result: ArraySelect( aProctors, "This.proctor_id != iPersonID" ) }, 86400 );
	//UpdateProctoringSession();
	return oRes;
}

function get_proctoring_system_params()
{
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	
	sProctoringDataKey = "proctor_system_params";
	
	aProctoringSystemParams = tools_web.get_user_data( sProctoringDataKey );
	if( aProctoringSystemParams == undefined || aProctoringSystemParams == null )
	{
		aProctoringSystemParams = new Object();
		catProctoringSystem = ArrayOptFirstElem( XQuery( "for $elem in proctoring_systems where $elem/code = 'websoft_2' return $elem/Fields('id')" ) );
		if( catProctoringSystem != undefined )
		{
			teProctoringSystem = OpenDoc( UrlFromDocID( catProctoringSystem.id ) ).TopElem;
			aProctoringSystemParams = CallObjectMethod( OpenCodeLib( 'x-local://wtv/' + teProctoringSystem.library_url ), 'getParamsProctoring', [ { "teProctoringSystem": teProctoringSystem } ] )
		}
		
		tools_web.set_user_data( sProctoringDataKey, { params: aProctoringSystemParams }, 3600 );
	}
	else
	{
		aProctoringSystemParams = aProctoringSystemParams.GetOptProperty( "params", {} );
	}
	oRes.params = aProctoringSystemParams;
	return oRes;
}
/**
 * @function UpdateProctoringSession
 * @memberof Websoft.WT.Proctor
 * @description Обновление прокторинговых сессий.
 * @returns {WTProctorResult}
 */
function UpdateProctoringSession()
{
	/*
		Обновление прокторинговых сессий.
	*/
	//alert("UpdateProctoringSession");
	var iCurTicks = GetCurTicks();
	var iStartTicks = iCurTicks;
	sLog = "";
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	
	sUserDataKey = "proctor_sessions";
	oProctor = undefined;
	oProctoringSystemParams = get_proctoring_system_params().params;
	bShowLog = tools_web.is_true( oProctoringSystemParams.GetOptProperty( "show_log", false ) );
	if( bShowLog )
	{
		sLog += "\n" + "Get settings " + ( GetCurTicks() - iCurTicks );
	}
	aProctors = tools_web.get_user_data( sUserDataKey );
	
	if( aProctors == undefined || aProctors == null )
	{
		aProctors = new Array();
	}
	else
	{
		aProctors = aProctors.GetOptProperty( "result", [] );
	}
	if( bShowLog )
	{
		sLog += "\n" + "Get proctors " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	
	var xHttpStaticAssembly = tools.get_object_assembly( 'XHTTPMiddlewareStatic' );
	WebSockets = xHttpStaticAssembly.CallClassStaticMethod( 'Datex.XHTTP.WebSocketContext', 'GetWebSockets').ToArray();
	
	if( bShowLog )
	{
		sLog += "\n" + "GetWebSockets " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	
	iSeconds = OptInt( oProctoringSystemParams.GetOptProperty( "close_proctor_session_timeout", 60 ), 60 );
	bNeedUpdate = false;
	dOffsetDate = DateOffset( Date(), 0 - iSeconds );
	if( bShowLog )
	{
		sLog += "\n" + "dOffsetDate " + dOffsetDate;
	}
	
	xarrWithProctorLearningRecords = XQuery( "for $elem in learning_records where $elem/active_session_id != null() and IsEmpty( $elem/proctors_id ) = false() and $elem/is_prefer_proctor = false() return $elem/Fields( 'id', 'proctors_id', 'proctoring_object_id' )" );
	for( _learning_record in xarrWithProctorLearningRecords )
	{
		arrDeletedProctor = new Array();
		for( _proctor in _learning_record.proctors_id )
		{
			if( ArrayOptFind( aProctors, "OptInt( This.proctor_id ) == _proctor" ) == undefined )
			{
				arrDeletedProctor.push( _proctor );
			}
		}
		
		if( ArrayOptFirstElem( arrDeletedProctor ) != undefined )
		{
			bNeedUpdate = false;
			docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
			for( _elem in arrDeletedProctor )
			{
				_catProctor = ArrayOptFind( docLearningRecord.TopElem.proctors, "This.state_id == 'online' && This.proctor_id == _elem" );
				if( _catProctor != undefined )
				{
					if( _catProctor.last_activity_date.HasValue )
					{
						if( _catProctor.last_activity_date < dOffsetDate )
						{
							_catProctor.Delete();
							bNeedUpdate = true;
						}
					}
					else
					{
						_catProctor.last_activity_date = Date();
						bNeedUpdate = true;
					}
				}
			}
			if( bNeedUpdate )
			{
				docLearningRecord.Save();
			}
		}
	}
	if( bShowLog )
	{
		sLog += "\n" + "Check missing proctors " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	
	xarrMissingLearningRecords = XQuery( "for $elem in learning_records where $elem/active_session_id != null() return $elem/Fields( 'id', 'active_session_id', 'active_session_finish_date' )" );
	for( _learning_record in xarrMissingLearningRecords )
	{
		if( ArrayOptFind( WebSockets, "This.Key == _learning_record.active_session_id" ) == undefined )
		{
			if( _learning_record.active_session_finish_date.HasValue )
			{
				if( _learning_record.active_session_finish_date < dOffsetDate )
				{
					close_proctoring_session( _learning_record.id, null, _learning_record.active_session_id, true );
				}
			}
			else
			{
				docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
				catSession = docLearningRecord.TopElem.sessions.GetOptChildByKey( _learning_record.active_session_id );
				catSession.finish_date = Date();
				docLearningRecord.Save();
			}
		}
		else if( _learning_record.active_session_finish_date.HasValue )
		{
			docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
			catSession = docLearningRecord.TopElem.sessions.GetOptChildByKey( _learning_record.active_session_id );
			catSession.finish_date.Clear();
			docLearningRecord.Save();
		}
	}
	if( bShowLog )
	{
		sLog += "\n" + "Close missing proctoring " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	
	bNeedUpdate = false;
	if( ArrayOptFirstElem( aProctors ) == undefined )
	{
		if( bShowLog )
		{
			alert( "UpdateProctoringSession not proctors " + ( GetCurTicks() - iStartTicks ) + sLog );
		}
		return oRes;
	}
	
	
	
	bNeedUpdateUserData = false;
	for( _proctor in aProctors )
	{
		if( _proctor.socket_id != "" && ArrayOptFind( WebSockets, "This.Key == _proctor.socket_id" ) == undefined )
		{
			try
			{
				dFDate = Date( _proctor.GetOptProperty( "find_disconnect_date" ) );
			}
			catch( ex )
			{
				dFDate = Date();
			}
			if( dFDate < dOffsetDate )
			{
				_proctor.SetProperty( "is_deleted", true );
				bNeedUpdate = true;
			}
			else
			{
				_proctor.SetProperty( "find_disconnect_date", RValue( dFDate ) );
			}
			bNeedUpdateUserData = true;
		}
		else if( _proctor.GetOptProperty( "find_disconnect_date", "" ) != "" )
		{
			_proctor.SetProperty( "find_disconnect_date", "" );
			bNeedUpdateUserData = true;
		}
	}
	if( bShowLog )
	{
		sLog += "\n" + "Check disconnect proctors " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	if( bNeedUpdateUserData && !bNeedUpdate )
	{
		tools_web.set_user_data( sUserDataKey, { result: aProctors }, 86400 );
	}
	if( bNeedUpdate )
	{

		function check_proctor( catProctor, arr )
		{
			return ArrayOptFind( arr, "This.proctor_id == catProctor.proctor_id" ) == undefined;
		}

		arrDeleted = ArraySelect( aProctors, "This.GetOptProperty( 'is_deleted', false )" );

		aProctors = ArraySelect( aProctors, "!This.GetOptProperty( 'is_deleted', false )" );

		arrDeleted = ArraySelect( arrDeleted, "check_proctor( This, aProctors )" );

		for( _learning_record in XQuery( "for $elem in learning_records where MatchSome( $elem/proctors_id, (" + ArrayMerge( arrDeleted, "This.proctor_id", "," ) + ") ) return $elem/Fields('id')" ) )
		{
			try
			{
				docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
				_catProctor = ArrayOptFind( docLearningRecord.TopElem.proctors, "This.state_id == 'online'" );
				for( _proctor in arrDeleted )
				{
					_child = docLearningRecord.TopElem.proctors.GetOptChildByKey( _proctor.proctor_id )
					if( _child != undefined && _child.state_id == "online" )
					{
						_child.Delete();
					}
				}
				docLearningRecord.Save();
			}
			catch( ex ){ alert( "UpdateProctoringSession " + ex ) }
		}
		tools_web.set_user_data( sUserDataKey, { result: aProctors }, 86400 );
		if( bShowLog )
		{
			sLog += "\n" + "Check deleted disconnect proctors " + ArrayCount( arrDeleted ) + " - " + ( GetCurTicks() - iCurTicks );
			iCurTicks = GetCurTicks();
		}
	}
	xarrWithProctorActiveLearningRecords = XQuery( "for $elem in learning_records where $elem/active_session_id != null() and IsEmpty( $elem/proctors_id ) = false() return $elem/Fields( 'id', 'proctors_id', 'proctoring_object_id' )" );
	/*if( ArrayOptFirstElem( xarrActiveLearningRecords ) == undefined )
	{
		if( bShowLog )
		{
			alert( "UpdateProctoringSession not active learning records " + ( GetCurTicks() - iStartTicks ) + sLog );
		}
		return oRes;
	}*/
	aAllProctors = aProctors;
	aProctors = ArraySelectDistinct( aProctors, "This.proctor_id" );
	
	for( _proctor in aProctors )
	{
		iCnt = ArrayCount( ArraySelect( xarrWithProctorActiveLearningRecords, "This.proctors_id.ByValueExists( _proctor.proctor_id )" ) );
		_proctor.SetProperty( "learning_record_count", iCnt );
		_proctor.SetProperty( "new_sessions", [] );
	}
	if( bShowLog )
	{
		sLog += "\n" + "Check calculate active proctor sessions " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	iMaxCnt = OptInt( oProctoringSystemParams.GetOptProperty( "max_session_on_proctor", 10 ), 10 );
	arrLearningRecords = new Array();
	xarrActiveLearningRecords = XQuery( "for $elem in learning_records where $elem/active_session_id != null() and IsEmpty( $elem/proctors_id ) = true() return $elem/Fields( 'id', 'start_date', 'proctoring_object_type', 'proctoring_object_name', 'person_fullname', 'person_id', 'proctors_id', 'proctoring_object_id' )" );
	if( ArrayOptFirstElem( xarrActiveLearningRecords ) != undefined )
	{
		xarrObjectExperts = XQuery( "for $elem in object_experts where MatchSome( $elem/object_id, ( " + ArrayMerge( ArraySelectDistinct( xarrActiveLearningRecords, "This.proctoring_object_id" ), "This.proctoring_object_id", "," ) + " ) ) and MatchSome( $elem/person_id, ( " + ArrayMerge( aProctors, "This.proctor_id", "," ) + " ) ) and $elem/type = 'proctor' return $elem" )
		
		xarrConversations = XQuery( "for $elem in conversations where MatchSome( $elem/active_object_id, ( " + ArrayMerge( xarrActiveLearningRecords, "This.id", "," ) + " ) ) return $elem/Fields('id', 'active_object_id')" );
							
		for( _learning_record in xarrActiveLearningRecords )
			try
			{
				aTmpPtroctor = ArrayIntersect( aProctors, ArraySelect( xarrObjectExperts, "This.object_id == _learning_record.proctoring_object_id" ), "Int( This.proctor_id )", "This.person_id");
				if( ArrayOptFirstElem( aTmpPtroctor ) == undefined )
				{
					continue;
				}
				catProctor = ArrayMin( aTmpPtroctor, "This.learning_record_count" );
				if( catProctor.learning_record_count >= iMaxCnt )
				{
					oRes.error = 0;
					oRes.message = 'Maximum proctor session.';
					continue;
					//return oRes;
				}
				docLearningRecord = OpenDoc( UrlFromDocID( _learning_record.id ) );
				_child = docLearningRecord.TopElem.proctors.ObtainChildByKey( catProctor.proctor_id );
				_child.state_id = "online";
				_child.last_activity_date.Clear();
				docLearningRecord.Save();
				
				catProctor.learning_record_count++;

				catConversation = ArrayOptFind( xarrConversations, "This.active_object_id == _learning_record.id" );
				
				oSendLearningRecord = {
									id: _learning_record.id.Value,
									person_id: _learning_record.person_id.Value,
									person_fullname: _learning_record.person_fullname.Value,
									avatar_url: tools_web.get_object_source_url( 'person', _learning_record.person_id ),
									name: _learning_record.proctoring_object_name.Value,
									type: _learning_record.proctoring_object_type.Value,
									start_date: _learning_record.start_date.Value,
									conversation_id: ( catConversation != undefined ? catConversation.id.Value : "" )
								};
						
				catProctor.new_sessions.push( oSendLearningRecord );
			}
			catch( ex )
			{
				alert( "UpdateProctoringSession " + ex )
			}
	}
	if( bShowLog )
	{
		sLog += "\n" + "Distribution of proctors " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	//alert("aProctors " + EncodeJson(aProctors))
	for( _proctor in aProctors )
	{
		if( ArrayOptFirstElem( _proctor.new_sessions ) != undefined && _proctor.socket_id != "" )
		{
			tools.call_code_library_method( 'libChat', 'send_message_by_socket_id', [ ArrayExtract( ArraySelect( aAllProctors, "This.proctor_id == _proctor.proctor_id" ), "This.socket_id" ), {	error: 0,	actions: [{ action: "add_learning_records", learning_records: _proctor.new_sessions }] } ] );
		}
	}
	if( bShowLog )
	{
		sLog += "\n" + "Send in socket " + ( GetCurTicks() - iCurTicks );
		iCurTicks = GetCurTicks();
	}
	if( bShowLog )
	{
		alert( "UpdateProctoringSession finish " + ( GetCurTicks() - iStartTicks ) + sLog );
	}
	return oRes;
}
/**
 * @typedef {Object} WTInitProctoringSessionResult
 * @property {number} error – код ошибки
 * @property {string} message – текст ошибки
 * @property {string} session_id – ID сессии 
*/
/**
 * @function InitProctoringSession
 * @memberof Websoft.WT.Proctor
 * @description Инициализация сессии прокторинга.
 * @param {bigint} iLearningRecordID - ID записи прокторинга
 * @param {string} [sSessionID] - ID сессии прокторинга
 * @returns {WTInitProctoringSessionResult}
 */
function InitProctoringSession( iLearningRecordID, sSessionID )
{
	return init_proctoring_session( iLearningRecordID, null, sSessionID );
}

function init_proctoring_session( iLearningRecordID, docLearningRecord, sSessionID )
{
	/*
		Инициализация сессии прокторинга.
		iLearningRecordID	- ID записи прокторинга
		docLearningRecord	- документ записи прокторинга
		sSessionID			- ID сессии прокторинга
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		if( sWebSocketCurrentId == undefined || sWebSocketCurrentId == '' )
			throw 'not sWebSocketCurrentId'
	}
	catch( ex )
	{
		sWebSocketCurrentId = null;
	}
	try
	{
		iLearningRecordID = Int( iLearningRecordID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iLearningRecordID';
		return oRes;
	}
	try
	{
		docLearningRecord.TopElem;
	}
	catch( ex )
	{
		try
		{
			docLearningRecord = OpenDoc( UrlFromDocID( iLearningRecordID ) );
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningRecordID';
			return oRes;
		}
	}
	var catActiveSession = undefined;
	if( sSessionID != null )
	{
		catActiveSession = ArrayOptFind( docLearningRecord.TopElem.sessions, "This.id == sSessionID" );
		if( catActiveSession == undefined )
		{
			catActiveSession = docLearningRecord.TopElem.sessions.ObtainChildByKey( sSessionID );
		}
	}
	else
	{
		catActiveSession = docLearningRecord.TopElem.sessions.AddChild();
		sSessionID = catActiveSession.id.Value;
	}
	for( _session in docLearningRecord.TopElem.sessions )
	{
		if( _session.id != sSessionID && _session.state_id == "active" )
		{
			_session.state_id = "close"
		}
	}
	docLearningRecord.Save();
	oRes.session_id = sSessionID;
	//UpdateProctoringSession();
	return oRes;
}
/**
 * @function CloseProctoringSession
 * @memberof Websoft.WT.Proctor
 * @description Закрытие сессии прокторинга.
 * @param {bigint} iLearningRecordID - ID записи прокторинга
 * @param {string} [sSessionID] - ID сессии прокторинга
 * @returns {WTProctorResult}
 */
function CloseProctoringSession( iLearningRecordID, sSessionID )
{
	return close_proctoring_session( iLearningRecordID, null, sSessionID );
}

function close_proctoring_session( iLearningRecordID, docLearningRecord, sSessionID, bMissing )
{
	/*
		Закрытие сессии прокторинга.
		iLearningRecordID	- ID записи прокторинга
		docLearningRecord	- документ записи прокторинга
		sSessionID			- ID сессии прокторинга
		bMissing			- сессия была потеряна
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		iLearningRecordID = Int( iLearningRecordID );
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect iLearningRecordID';
		return oRes;
	}
	try
	{
		if( bMissing == undefined || bMissing == null || bMissing == "" )
			throw "error";
		bMissing = tools_web.is_true( bMissing );
	}
	catch( ex )
	{
		bMissing = false;
	}
	try
	{
		docLearningRecord.TopElem;
	}
	catch( ex )
	{
		try
		{
			docLearningRecord = OpenDoc( UrlFromDocID( iLearningRecordID ) );
		}
		catch( ex )
		{
			oRes.error = 1;
			oRes.message = 'Incorrect iLearningRecordID';
			return oRes;
		}
	}
	
	try
	{
		if( sSessionID == undefined || sSessionID == "" )
			throw "error";
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Incorrect sSessionID';
		return oRes;
	}
	var oVirtualClient = tools.dotnet_host.Object.GetAssembly('Datex.MediaSoup.VirtualClient.dll');
	try
	{
		var oStopResult = oVirtualClient.CallClassStaticMethod('Datex.MediaSoup.VirtualClient.VirtualClient', 'StopRecordingRoom', [(iLearningRecordID+"")]);
	}
	catch(ex)
	{
	}
	
	var catActiveSession = undefined;
	catActiveSession = ArrayOptFind( docLearningRecord.TopElem.sessions, "This.id == sSessionID" );
	if( catActiveSession != undefined )
	{
		catActiveSession.state_id = "close";
	}
	else
	{
		oRes.error = 1;
		oRes.message = 'Session not found.';
		return oRes;
	}
	catProctor = ArrayOptFind( docLearningRecord.TopElem.proctors, "This.state_id == 'online'" );
	if( catProctor != undefined )
	{
		if( !catProctor.is_prefer )
		{
			catProctor.state_id = "offline";
		}
		
		sUserDataKey = "proctor_sessions";
		aProctors = tools_web.get_user_data( sUserDataKey );

		if( aProctors == undefined || aProctors == null )
			aProctors = new Array();
		else
			aProctors = aProctors.GetOptProperty( "result", [] )
		aProctors = ArraySelect( aProctors, "This.proctor_id == catProctor.proctor_id" );
		if( ArrayOptFirstElem( aProctors ) != undefined )
		{
			tools.call_code_library_method( 'libChat', 'send_message_by_socket_id', [ ArrayExtract( aProctors, "This.socket_id" ), {	error: 0,	actions: [ { action: ( bMissing ? "get_missing_sessions" : "get_close_sessions" ), learning_records: [ { "learning_record_id": iLearningRecordID } ] } ] } ] )
		}
	}

	var kurentoToolsLib = OpenCodeLib('x-local://wt/web/vclass/kurento/kurento_tools.bs');
	var oResKurento = CallObjectMethod( kurentoToolsLib, 'FindParticipantByData', ( [ "session_key", "screen_" + iLearningRecordID ]));
	if( oResKurento != null )
	{
		CallObjectMethod( kurentoToolsLib, 'ReleaseRecorder', ( [ oResKurento.sessionid ]))
	}
	oResKurento = CallObjectMethod( kurentoToolsLib, 'FindParticipantByData', ( [ "session_key", "video_" + iLearningRecordID ]));
	
	if( oResKurento != null )
	{
		CallObjectMethod( kurentoToolsLib, 'ReleaseRecorder', ( [ oResKurento.sessionid ]))
	}
	docLearningRecord.Save();
	
	
	return oRes;
}

function processing_media_handler( arrMessages )
{
	/*
		Обработчик очереди медиа потока
		arrMessages	- массив сообщений
	*/
	oRes = new Object();
	oRes.error = 0;
	oRes.message = '';
	try
	{
		if( !IsArray( arrMessages ) )
			throw "error";
	}
	catch( ex )
	{
		oRes.error = 1;
		oRes.message = 'Not messages.';
		return oRes;
	}
	aSendMessages = new Array();
	for( _message in arrMessages )
		try
		{
			//alert("_message "+EncodeJson(_message))
			if( !_message.HasProperty( "Id" ) || !_message.HasProperty( "Code" ) )
			{
				continue;
			}
			sId = _message.GetProperty( "Id" );
			sCode = _message.GetProperty( "Code" );
			aId = String( sId ).split( "_" );
			iRecordID = OptInt( aId[ 0 ] );
			sMediaID = "";
			sStreamNumber = 0;
			if( ArrayCount( aId ) > 1 )
			{
				sMediaID = aId[ 1 ];
			
				if( ArrayCount( aId ) > 2 )
				{
					sStreamNumber = aId[ 1 ];
					sMediaID = aId[ 2 ];
				}
			}
			
			switch( sCode )
			{
				case "Available":
					
					oProperty = _message.GetOptProperty( "Properties", null );
					if( oProperty == null )
					{
						break;
					}
					
					is_face_training = tools_web.is_true( oProperty.GetOptProperty( "facetraining", "" ) );
					if (is_face_training)
					{
						break;
					}
					docLearningRecord = OpenDoc( UrlFromDocID( iRecordID ) );
					_media = docLearningRecord.TopElem.media_records.GetOptChildByKey( oProperty.GetOptProperty( "url", "" ), "media_url" );
					if( _media == undefined )
					{
						_media = docLearningRecord.TopElem.media_records.AddChild();
					}
					_media.type_id = sMediaID;
					_media.stream_number = sStreamNumber; 
					_media.media_url = oProperty.GetOptProperty( "url", "" );

					docLearningRecord.Save();
					catProctor = ArrayOptFind( docLearningRecord.TopElem.proctors, "This.state_id == 'online'" );
					if( catProctor != undefined )
					{
						oSendMessage = new Object();
						oSendMessage.learning_record_id = iRecordID;
						oSendMessage.proctor_id = catProctor.proctor_id.Value;
						oSendMessage.message =  {	error: 0,	actions: [ get_learning_record_api( iRecordID, docLearningRecord.TopElem, { action: "get_learning_record", error: 0, message: "" } )] };
						aSendMessages.push( oSendMessage );
					}
					break;
					
				case "gazeout":
				case "manypeople":
				case "wronghuman":
				case "wrongview":
				case "wrongsubject":
				case "mousemove":
				case "externalvoice":
				case "similarview":
					
					docLearningRecord = OpenDoc( UrlFromDocID( iRecordID ) );
					oProperty = _message.GetOptProperty( "Properties", null );
					if( oProperty == null )
					{
						break;
					}

					_violation = docLearningRecord.TopElem.violations.AddChild();
					
					if( oProperty.GetOptProperty( "comment" ) != undefined )
					{
						_violation.comment = oProperty.GetOptProperty( "comment" );
					}
					_violation.type_id = sCode;
					//_violation.stream_number = docLearningRecord.TopElem.record_num.Value;
					if( oProperty.GetOptProperty( "state_id" ) != undefined )
					{
						_violation.state_id = oProperty.GetOptProperty( "state_id" );
					}
					if( _message.GetOptProperty( "Timestamp" ) != undefined )
					{
						_violation.interval.start_time = tools.str_time_from_mseconds( OptInt( _message.GetOptProperty( "Timestamp" ), 0 )*1000 );
					}
					if( _message.GetOptProperty( "Timestamp" ) != undefined && oProperty.GetOptProperty( "duration" ) != undefined )
					{
						_violation.interval.finish_time = tools.str_time_from_mseconds( ( OptInt( _message.GetOptProperty( "Timestamp" ), 0 ) + OptInt( oProperty.GetOptProperty( "duration" ), 0 ) )*1000 );
					}
					if( sStreamNumber != null )
					{
						_violation.stream_number = sStreamNumber;
					}
	
					if( !_violation.date.HasValue )
					{
						_violation.date = Date();
					}
					docLearningRecord.Save();

					catProctor = ArrayOptFind( docLearningRecord.TopElem.proctors, "This.state_id == 'online'" );
					if( catProctor != undefined )
					{
						oSendMessage = new Object();
						oSendMessage.learning_record_id = iRecordID;
						oSendMessage.proctor_id = catProctor.proctor_id.Value;
						oSendMessage.message =  {	error: 0,	actions: [ get_learning_record_api( iRecordID, docLearningRecord.TopElem, { action: "get_learning_record", error: 0, message: "" } )] };
						aSendMessages.push( oSendMessage );
					}
					break;
				case "facetrained":
				case "facetrainedfailed":
					break;
			}
			
		}
		catch( ex )
		{
			alert( "proctor_library.js processing_media_handler " + ex )
		}
	
	if( ArrayOptFirstElem( aSendMessages ) != undefined )
	{
		sUserDataKey = "proctor_sessions";

		aProctors = tools_web.get_user_data( sUserDataKey );
					
		if( aProctors == undefined || aProctors == null )
			aProctors = new Array();
		else
			aProctors = aProctors.GetOptProperty( "result", [] );
		for( _send_message in aSendMessages )
		{
			tools.call_code_library_method( 'libChat', 'send_message_by_socket_id', [ ArrayExtract( ArraySelect( aProctors, "This.proctor_id == _send_message.proctor_id" ), "This.socket_id" ), _send_message.message ] );
		}
	}
	return oRes;
}

function create_xlsx_report( arrHeaders, arrArray, oParam, sTempDir )
{
	/*
		Создание xlsx файла
	*/
	function get_number_format( sFormat )
	{
		switch( sFormat )
		{
			case "date":
				return 22;
		}
		return 0;
	}
	oRes = new Object();
	oRes.error = 0;
	oRes.message = "";
	oRes.file_url = "";
	
	try
	{
		if( oParam == undefined || oParam == null )
		{
			throw 'error';
		}
	}
	catch( ex )
	{
		oParam = new Object();
	}
	
	var sTitleRowForegroundColor=oParam.GetOptProperty( 'title_row_foreground_color', '#D9D9D9' );
	var sTitleRowBorderStyle=oParam.GetOptProperty( 'title_row_border_style', 'Thin' );
	var sTitleRowBorderColor=oParam.GetOptProperty( 'title_row_border_color', '#000000' );
	var sRowBorderColor=oParam.GetOptProperty( 'row_border_color', '#000000' );
	var sTitleRowHorizontalAlignment=oParam.GetOptProperty( 'title_row_horizontal_alignment', 'Center' );
	var sTitleRowVerticalAlignment=oParam.GetOptProperty( 'title_row_vertical_alignment', 'Top' );
	var iNameLength = oParam.GetOptProperty( 'name_length', 20 );
	var iRowHeigth=oParam.GetOptProperty( 'row_heigth', 12.75 );
	var iColumnWidth=oParam.GetOptProperty( 'column_width', 20 );
	var arrColumnTitles = tools_report.ExcelColumnsList()
	
	var oExcelDoc = tools.get_object_assembly( 'Excel' );
	oExcelDoc.CreateWorkBook();

	oWorksheet = oExcelDoc.GetWorksheet( 0 );
	iCurColumn = 0
	iNewIndex = 1;
	for( _header in arrHeaders )
	{
		oWorksheet.Cells.SetColumnWidth( iCurColumn, Real( _header.GetOptProperty( "width", iColumnWidth ) ) );

		c = oWorksheet.Cells.GetCell( arrColumnTitles[ iCurColumn ] + iNewIndex );

		c.Style.IsBold = true;
		c.Style.ForegroundColor = sTitleRowForegroundColor;
		c.Style.Borders.SetStyle( sTitleRowBorderStyle );
		c.Style.Borders.SetColor(sTitleRowBorderColor);
		c.Style.IsTextWrapped = true;
		c.Style.HorizontalAlignment = sTitleRowHorizontalAlignment;
		c.Style.VerticalAlignment = sTitleRowVerticalAlignment;
		c.Value = _header.title;
		iCurColumn++;
	}
	iNewIndex++;
	for( _row in arrArray )
	{
		iCurColumn = 0;
		for( _header in arrHeaders )
		{
			oWorksheet.Cells.SetColumnWidth( iCurColumn, Real( _header.GetOptProperty( "width", iColumnWidth ) ) );

			c = oWorksheet.Cells.GetCell( arrColumnTitles[ iCurColumn ] + iNewIndex );
			c.Style.Number = get_number_format( _header.GetOptProperty( "format" ) );
			c.Style.VerticalAlignment = "Top";
			c.Style.IsTextWrapped = true;
			c.Style.Borders.SetStyle( sTitleRowBorderStyle );
			c.Style.Borders.SetColor(sRowBorderColor);
			c.Value = _row.GetOptProperty( _header.data, "" );
			iCurColumn++;
		}
		iNewIndex++;
	}
	try
	{
		if( sTempDir == null || sTempDir == "" || sTempDir == undefined )
		{
			throw "error";
		}
	}
	catch( ex )
	{
		sTempDir = ObtainSessionTempFile();
		CreateDirectory( sTempDir );
	}
	sFile = DateToRawSeconds(Date())-Random( 1, 200000 )
	sExcelFileName = UrlToFilePath( UrlAppendPath( sTempDir, sFile + '.xlsx' ) )

	oExcelDoc.SaveAs(sExcelFileName);
	oRes.file_url = FilePathToUrl( sExcelFileName );
	
	return oRes;
}