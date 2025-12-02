// 7270449219325031427
function get_field_value( catElem, field_name )
{
    return RValue( GetObjectProperty( catElem, field_name ) );
}
function GetWorkspaceTasks()
{
    var oRes = new Object();
    oRes.error = 0;
    oRes.errorText = "";
    oRes.total = 0;
    oRes.array = [];
    oRes.data = new Object();

    var CurSession = null;
    try
    {
        CurSession = CurRequest.Session;
    }
    catch( ex )
    {
    }
    try
    {
        var iUserID = CurRequest.Session.Env.GetOptProperty( "curUserID" );
        var teUser = CurRequest.Session.Env.GetOptProperty( "curUser" );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = "Некорректный curUserID";
        return oRes;
    }
    try
    {
        iPersonID = Int( iPersonID );
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = "Передан некорректный ID сотрудника";
        return oRes;
    }
    try
    {
        iExecutorID = OptInt( iExecutorID );
    }
    catch( ex )
    {
        iExecutorID = undefined;
    }


    try
    {
        iTaskTypeID = Int( SCOPE_WVARS.GetOptProperty( "iTaskTypeID" ) );
        var docTaskType = tools.open_doc( iTaskTypeID );
        if( !tools_web.check_access( docTaskType.TopElem, iUserID, teUser, CurSession ) )
        {
            oRes.error = 1;
            oRes.errorText = "У вас нет прав на этот тип задач";
            return oRes;
        }
    }
    catch( ex )
    {
        oRes.error = 1;
        oRes.errorText = "Передан некорректный ID типа задачи";
        return oRes;
    }
    try
    {
        if( sSortField == undefined || sSortField == null || sSortField == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSortField = "priority";
    }
    try
    {
        if( sSortDirection == undefined || sSortDirection == null || sSortDirection == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSortDirection = "asc";
    }
    iSourceObjectID = OptInt( SCOPE_WVARS.GetOptProperty( "iSourceObjectID" ) );
    iPageNum = OptInt( iPageNum );
    iPageSize = OptInt( iPageSize );
    try
    {
        if( sTaskType == undefined || sTaskType == null || sTaskType == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sTaskType = "my";
    }
    try
    {
        if( bUsePageByCustomState == undefined || bUsePageByCustomState == null || bUsePageByCustomState == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        bUsePageByCustomState = false;
    }
    try
    {
        if( bList == undefined || bList == null || bList == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        bList = false;
    }

    try
    {
        if( sSearchText == undefined || sSearchText == null )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sSearchText = "";
    }
    try
    {
        if( sTaskNameSearch == undefined || sTaskNameSearch == null )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sTaskNameSearch = "";
    }

    try
    {
        if( sStateID == undefined || sStateID == null || sStateID == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sStateID = null;
    }

    switch( sTaskType )
    {
        case "all":
            if( docTaskType.TopElem.view_task_type_id == "youself" )
            {
                sTaskType = "my";
            }
            break;
        case "subordinates":
            if( docTaskType.TopElem.view_task_type_id == "youself" )
            {
                oRes.error = 1;
                oRes.errorText = "Для этого типа задач запрещено просматривать задачи подчиненных";
                return oRes;
            }
            break;
    }
    try
    {
        if( sCustomStateID == undefined || sCustomStateID == null || sCustomStateID == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sCustomStateID = null;
    }
    try
    {
        if( sExpireType == undefined || sExpireType == null || sExpireType == "" )
        {
            throw "error";
        }
    }
    catch( ex )
    {
        sExpireType = "all";
    }

    var arrFilters = new Array();
    try
    {
        _FILTERS;
        if (_FILTERS == undefined || _FILTERS == null || _FILTERS == '')
        {
            throw 'no filter';
        }

        arrFilters = tools_web.parse_multiple_parameter(_FILTERS);
    }
    catch(e){}

    var arrDistincts = new Array();
    try
    {
        _DISTINCTS;
        if (_DISTINCTS == undefined || _DISTINCTS == null || _DISTINCTS == '')
            throw 'no filter';
        //arrDistincts = tools_web.parse_multiple_parameter(_DISTINCTS);
    }
    catch(e)
    {
        arrDistincts = new Object();
    }
    //alert("arrDistincts "+EncodeJson(arrDistincts))
    var arrBaseFilters = new Array();
    arrBaseFilters.push( { "id": "parent_task_id", "type": "select", "catalog_name": "task", "title": "Родительская задача" } );
    arrBaseFilters.push( { "id": "project_org_id", "type": "select", "catalog_name": "org", "title": "Организация" } );
    var sLearningType = "task";

    var arrPageStates = new Array();
    var _state;
    var bUsePage = ( iPageNum != undefined && iPageSize != undefined );
    var iStartIndex, iEndIndex;
    var sCatalogName = "task";
    if( sCatalogName == undefined )
    {
        return oRes;
    }
    var aCatalogName = new Array();
    if( !IsArray( sCatalogName ) )
    {
        aCatalogName.push( sCatalogName )
    }
    else
    {
        aCatalogName = sCatalogName;
    }
    if( bUsePage )
    {
        iStartIndex = ( iPageNum - 1 )*iPageSize;
        iEndIndex = iPageNum*iPageSize;
        if( !bList )
        {
            if( bUsePageByCustomState )
            {
                for( _state in docTaskType.TopElem.custom_states )
                {
                    if( sCustomStateID == null || sCustomStateID == _state.code )
                    {
                        arrPageStates.push( { id: _state.code.Value, current: 0, full: false } );
                    }
                }
            }
            else
            {
                var catCommonStates = null;
                if( docTaskType.TopElem.virtual && docTaskType.TopElem.related_object_type.HasValue )
                {
                    sLearningType = docTaskType.TopElem.related_object_type.Value;
                    sCatalogName = ArrayOptFirstElem( aCatalogName );

                    if( sCatalogName != "" && sCatalogName != undefined )
                    {
                        var fldCatalogItem = tools.new_doc_by_name( sCatalogName, true ).TopElem.AddChild();
                        if( true )
                        {
                            var fStatus = GetObjectProperty( fldCatalogItem, "status" );

                            try
                            {
                                catCommonStates = eval( fStatus.FormElem.ForeignArrayExpr );
                            }
                            catch( ex ){alert(ex)}
                        }
                    }
                }
                if( catCommonStates == null )
                {
                    catCommonStates = common.task_statuses;
                }
                for( _state in catCommonStates )
                {
                    if( sStateID == null || sStateID == _state.id )
                    {
                        arrPageStates.push( { id: _state.id.Value, current: 0, full: false } );
                    }
                }
            }
        }
    }
    var conds = new Array();

    conds.push( "$elem/task_type_id = " + iTaskTypeID );

    if( iSourceObjectID != undefined )
    {
        conds.push( "$elem/source_object_id = " + iSourceObjectID );
    }
    if( iExecutorID != undefined)
    {
        conds.push( "$elem/executor_id = " + iExecutorID );
    }
    var catFilter;
    var sTempValue;
    var sAddJoinCatalog = "";
    for( _filter in arrBaseFilters )
    {
        catFilter = ArrayOptFind( arrFilters, "This.id == _filter.id" );
        if( catFilter == undefined )
        {
            arrFilters.push( _filter );
        }
        /*else
        {
            switch( catFilter.id )
            {
                case "parent_task_id":
                {
                    sTempValue = OptInt( catFilter.GetOptProperty( "value" ) );
                    if( sTempValue != undefined )
                    {
                        conds.push( "$elem/parent_task_id = " + sTempValue );
                    }
                    break;
                }
                case "project_org_id":
                {
                    sTempValue = OptInt( catFilter.GetOptProperty( "value" ) );
                    if( sTempValue != undefined )
                    {
                        conds.push( "$elem/source_object_id = $source_project/id" + sTempValue );
                        conds.push( "$source_project/org_id = " + sTempValue );
                        sAddJoinCatalog += ", $source_project in projects ";
                    }
                    break;
                }
            }

        }*/
    }
    oRes.data.SetProperty( "filters", arrFilters );
    oRes.data.SetProperty( "distincts", ({}) );
    var libParam = tools.get_params_code_library( "libWorkspace" );
    var aPersonID = new Array();
    switch( sTaskType )
    {
        case "all":
        case "my":
            aPersonID.push( { id: iPersonID } );
            if( sTaskType == "my" )
            {
                break;
            }
        case "subordinates":
            aPersonID = ArrayUnion( aPersonID, tools.call_code_library_method( "libMain", "get_user_collaborators", [ iPersonID, libParam.GetOptProperty( "select_subordinates_collaborator_type" ), false, "", null, null, null, true ] ) );
            break;
        default:
            oRes.error = 1;
            oRes.errorText = "Неизвестный тип отбора сотрудников";
            return oRes;

            break;

    }
    conds.push( "MatchSome( $elem/executor_id, ( " + ArrayMerge( aPersonID, "This.id", "," ) + " ) )" );

    if( sPeriodType != "all" )
    {
        var oResPeriodData = tools.call_code_library_method( "libOnline", "get_period_data", [ sPeriodType ] );
        conds.push( "$elem/start_date_plan >= " + XQueryLiteral( oResPeriodData.start_period_date ) );
        conds.push( "$elem/start_date_plan < " + XQueryLiteral( oResPeriodData.finish_period_date ) );
    }
    switch( sExpireType )
    {
        case "without_date":
            conds.push( "$elem/end_date_plan = null()" );
            break;
        case "expired":
            if( sLearningType == "task" )
            {
                conds.push( "$elem/end_date_plan != '1' and $elem/status != 'x'" );
            }
            conds.push( "$elem/end_date_plan != null()" );
            conds.push( "$elem/end_date_plan < " + XQueryLiteral( Date() ) );
            break;
        case "expire_day":
            if( sLearningType == "task" )
            {
                conds.push( "$elem/status != '1' and $elem/status != 'x'" );
            }
            var sExpiredDateEnd = DateOffset( Date(), 86400 );
            conds.push( "$elem/end_date_plan != null()" );
            conds.push( "( $elem/end_date_plan > " + XQueryLiteral( Date() ) + " and $elem/end_date_plan < " + XQueryLiteral( sExpiredDateEnd ) + ")" );
            break;
        case "expire_week":
            if( sLearningType == "task" )
            {
                conds.push( "$elem/status != '1' and $elem/status != 'x'" );
            }
            var sExpiredDateEnd = DateOffset( Date(), 7*86400 );
            conds.push( "$elem/end_date_plan != null()" );
            conds.push( "( $elem/end_date_plan > " + XQueryLiteral( Date() ) + " and $elem/end_date_plan < " + XQueryLiteral( sExpiredDateEnd ) + ")" );
            break;
        case "expire_month":
            if( sLearningType == "task" )
            {
                conds.push( "$elem/status != '1' and $elem/status != 'x'" );
            }
            var sExpiredDateEnd = DateOffset( Date(), 30*86400 );
            conds.push( "$elem/end_date_plan != null()" );
            conds.push( "( $elem/end_date_plan > " + XQueryLiteral( Date() ) + " and $elem/end_date_plan < " + XQueryLiteral( sExpiredDateEnd ) + ")" );
            break;
        case "period":
            var sExpiredDateEnd = OptDate( dFinishExpireDate );
            var sExpiredDateStart = OptDate( dStartExpireDate );
            if( sExpiredDateEnd != undefined )
            {
                sExpiredDateEnd = DateNewTime( sExpiredDateEnd, 23, 59, 59 );
                conds.push( "$elem/end_date_plan <= " + XQueryLiteral( sExpiredDateEnd ) );
            }
            if( sExpiredDateStart != undefined )
            {
                sExpiredDateStart = DateNewTime( sExpiredDateStart, 0, 0, 0 );
                conds.push( "$elemend_date_plan >= " + XQueryLiteral( sExpiredDateStart ) );
            }
            if( sExpiredDateStart != undefined || sExpiredDateEnd != undefined )
            {
                if( sLearningType == "task" )
                {
                    conds.push( "$elem/status != '1' and $elem/status != 'x'" );
                }
                conds.push( "$elem/end_date_plan != null()" );
            }
            break;
    }
    if( sSearchText != "" )
    {
        conds.push( "doc-contains( $elem/id, 'wt_data', " + XQueryLiteral( String( sSearchText ) ) + " )" );
    }
    if( sTaskNameSearch != "" )
    {
        conds.push( "contains( $elem/name, " + XQueryLiteral( sTaskNameSearch ) + " )" );
    }
    if( sStateID != null )
    {
        conds.push( "$elem/status = " + XQueryLiteral( sStateID ) );
    }

    var _catalog_name;
    var xarrTasks = new Array();
    var bPastSort = true;
    var sOrder = "";
    if( ArrayCount( aCatalogName ) == 1 )
    {
        if( true )
        {
            sOrder = ( "order by $elem/" + sSortField + ( sSortDirection == "desc" ? " descending" : " ascending" ) );
            bPastSort = false;
        }
    }
    for( _catalog_name in aCatalogName )
    {
        xarrTasks = ArrayUnion( xarrTasks, XQuery( "for $elem in " + _catalog_name + "s " + sAddJoinCatalog + " where " + ArrayMerge( conds, "This", " and " ) + " " + sOrder + " return $elem" ) );
    }
    if( bPastSort )
    {
        if( true )
        {
            xarrTasks = ArraySort( xarrTasks, "This." +  sSortField, ( sSortDirection == "desc" ? "+" : "-" ) );
            bPastSort = false;
        }
    }
    var _task, oTask, catExecutor;
    var xarrProjects = new Array();
    for( _filter in oRes.data.filters )
    {
        switch( _filter.id )
        {
            case "parent_task_id":
            {
                arrParentTasks = ArraySelectDistinct( xarrTasks, "This.parent_task_id" );
                oRes.data.distincts.SetProperty( _filter.id, [] );
                if( ArrayOptFirstElem( arrParentTasks ) != undefined )
                {
                    for( _task in XQuery( "for $elem in tasks where MatchSome( $elem/id, ( " + ArrayMerge( arrParentTasks, "XQueryLiteral( This.parent_task_id )", "," ) + " ) ) return $elem/Fields('id','name')" ) )
                    {
                        oRes.data.distincts.GetProperty( _filter.id ).push( {title: _task.name.Value, value: _task.id.Value} );
                    }
                    if( ArrayOptFind( arrParentTasks, "!This.parent_task_id.HasValue" ) != undefined )
                    {
                        oRes.data.distincts.GetProperty( _filter.id ).push( {title: "-Без родительской задачи-", value: ""} );
                    }
                }
                break;
            }
            case "project_org_id":
            {
                arrParentProjects = ArraySelectDistinct( xarrTasks, "This.source_object_id" );
                oRes.data.distincts.SetProperty( _filter.id, [] );
                if( ArrayOptFirstElem( arrParentProjects ) != undefined )
                {
                    xarrProjects = XQuery( "for $elem in projects where MatchSome( $elem/id, ( " + ArrayMerge( arrParentProjects, "XQueryLiteral( This.source_object_id )", "," ) + " ) ) return $elem/Fields('id','org_id')" );
                    xarrOrgs = XQuery( "for $elem in orgs where MatchSome( $elem/id, ( " + ArrayMerge( xarrProjects, "XQueryLiteral( This.org_id )", "," ) + " ) ) return $elem/Fields('id','disp_name')" );
                    for( _task in xarrOrgs )
                    {
                        oRes.data.distincts.GetProperty( _filter.id ).push( {title: _task.disp_name.Value, value: _task.id.Value} );
                    }
                    if( ArrayOptFind( xarrProjects, "!This.org_id.HasValue" ) != undefined )
                    {
                        oRes.data.distincts.GetProperty( _filter.id ).push( {title: "-Без организации-", value: ""} );
                    }
                }
                break;
            }
        }
    }
    for( _filter in oRes.data.filters )
    {
        switch( _filter.id )
        {
            case "parent_task_id":
            {
                arrSelectedValues = _filter.GetOptProperty( "value", [] );
                if( ArrayOptFirstElem( arrSelectedValues ) != undefined )
                {
                    xarrTasks = ArrayIntersect( xarrTasks, arrSelectedValues, "This.parent_task_id", "OptInt( This.value, null )" );
                }
                break;
            }
            case "project_org_id":
            {
                arrSelectedValues = _filter.GetOptProperty( "value", [] );
                if( ArrayOptFirstElem( arrSelectedValues ) != undefined )
                {
                    xarrProjects = ArrayIntersect( xarrProjects, arrSelectedValues, "This.org_id", "OptInt( This.value )" );
                    bHasNull = ArrayOptFind( arrSelectedValues, "OptInt( This.value )" ) != undefined;
                    xarrTasks = ArraySelect( xarrTasks, "( bHasNull && !This.source_object_id.HasValue ) || ArrayOptFindByKey( xarrProjects, This.source_object_id, 'id' ) != undefined" );
                }
                break;
            }
        }
    }
    var xarrExecutors = new Array();
    var xarrRelatedProjects = new Array();
    var xarrParentTasks = new Array();
    var bUseRelatedProject = docTaskType.TopElem.related_to_projects.Value;
    var bUseParentTask = true;
    if( ArrayOptFirstElem( xarrTasks ) != undefined )
    {
        xarrExecutors = XQuery( "for $elem in collaborators where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( xarrTasks, "This.executor_id" ), "XQueryLiteral( This.executor_id )", "," ) + " ) ) return $elem/Fields('id','fullname')" );
        if( bUseRelatedProject && ArrayOptFind( xarrTasks, ( "This.source_object_type == 'project' && This.source_object_id.HasValue" ) ) != undefined )
        {
            xarrRelatedProjects = XQuery( "for $elem in projects where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrTasks, "This.source_object_type == 'project' && This.source_object_id.HasValue" ), "This.source_object_id" ), "XQueryLiteral( This.source_object_id )", "," ) + " ) ) return $elem/Fields('id','name')" );
        }
        if( bUseParentTask && ArrayOptFind( xarrTasks, "This.parent_task_id.HasValue" ) != undefined )
        {
            xarrParentTasks = XQuery( "for $elem in tasks where MatchSome( $elem/id, ( " + ArrayMerge( ArraySelectDistinct( ArraySelect( xarrTasks, "This.parent_task_id.HasValue" ), "This.parent_task_id" ), "XQueryLiteral( This.parent_task_id )", "," ) + " ) ) return $elem/Fields('id','name')" );
        }
    }
    xarrRelatedProjects = ArraySort( xarrRelatedProjects, "id", "+" );
    xarrParentTasks = ArraySort( xarrParentTasks, "id", "+" );
    xarrExecutors = ArraySort( xarrExecutors, "id", "+" );
    var sTaskStateID, sTaskCustomStateID, sCheckStateValue, catState, catRelatedProject, catParentTask;
    oRes.total = ArrayCount( xarrTasks );
    if( bList && bUsePage && !bPastSort )
    {
        bUsePage = false;
        xarrTasks = ArrayRange( xarrTasks, iStartIndex, iPageSize );
    }
    for( _task in xarrTasks )
    {
        sTaskStateID = get_field_value( _task, "status", sLearningType );
        sTaskCustomStateID = get_field_value( _task, "custom_state_id", sLearningType );
        sCheckStateValue = bUsePageByCustomState ? sTaskCustomStateID : sTaskStateID;
        if( bUsePage && !bPastSort )
        {
            catState = ArrayOptFind( arrPageStates, "This.id == sCheckStateValue" );
            if( catState != undefined )
            {
                catState.current++;
                if( catState.current >= iEndIndex )
                {
                    catState.full = true;
                    continue;
                }
                else if( catState.current < iStartIndex )
                {
                    continue;
                }

            }
            else
            {
                continue;
            }
        }
        oTask = new Object();
        oTask.id = _task.id.Value;
        oTask.object_type = sLearningType;
        oTask.code = get_field_value( _task, "code", sLearningType );
        oTask.name = get_field_value( _task, "name", sLearningType );
        oTask.status = sTaskStateID;
        oTask.finished = false;
        if( sLearningType == "task" )
        {
            oTask.finished = oTask.status == "1" || oTask.status == "x";
        }
        oTask.custom_state_id = sTaskCustomStateID;
        oTask.executor_id = get_field_value( _task, "executor_id", sLearningType );
        oTask.priority = get_field_value( _task, "priority", sLearningType );
        oTask.start_date = get_field_value( _task, "start_date_plan", sLearningType );
        oTask.end_date = get_field_value( _task, "end_date_plan", sLearningType );
        oTask.conversation_url = "/get_workspace_conversation.html?object_id=" + _task.id + "&task_type_id=" + iTaskTypeID;
        oTask.activity_url = "";

        oTask.executor_url = tools_web.get_object_source_url( "person", oTask.executor_id );
        if( bUseRelatedProject )
        {
            oTask.project_id = get_field_value( _task, "source_object_id", sLearningType );
            catRelatedProject = ArrayOptFindBySortedKey( xarrRelatedProjects, oTask.project_id, "id" );
            if( catRelatedProject != undefined )
            {
                oTask.project_name = catRelatedProject.name.Value;
            }
        }
        if( bUseParentTask )
        {
            oTask.parent_task_id = get_field_value( _task, "parent_task_id", sLearningType );
            catParentTask = ArrayOptFindBySortedKey( xarrParentTasks, oTask.parent_task_id, "id" );
            if( catParentTask != undefined )
            {
                oTask.parent_task_name = catParentTask.name.Value;
            }
        }

        oTask.executor_name = "";
        if( oTask.executor_id != "" )
        {
            catExecutor = ArrayOptFindBySortedKey( xarrExecutors, oTask.executor_id, "id" );
            if( catExecutor != undefined )
            {
                oTask.executor_name = RValue( catExecutor.fullname );
            }
        }
        oRes.array.push( oTask );
        if( bUsePage && !bPastSort )
        {
            if( ArrayOptFind( arrPageStates, "!This.full" ) == undefined )
            {
                break;
            }
        }
    }

    if( bPastSort )
    {
        oRes.array = ArraySort( oRes.array, "This." + sSortField, ( sSortDirection == "desc" ? "+" : "-" ) );
        if( bList && bUsePage )
        {
            bUsePage = false;
            oRes.array = ArrayRange( oRes.array, iStartIndex, iPageSize );
        }
    }

    return oRes;
}
var oResWorkspaceTasks = GetWorkspaceTasks();
//alert(EncodeJson(oResWorkspaceTasks))
if( oResWorkspaceTasks.error == 0 )
{
    PAGING.TOTAL = oResWorkspaceTasks.total;
    PAGING.MANUAL = true;
    RESULT = oResWorkspaceTasks.array;
    DATA = oResWorkspaceTasks.data;
}