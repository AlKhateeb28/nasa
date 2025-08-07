// 6792951946834683946
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 6792951946834683946;
var loggerName = "report_6792951946834683946";

try {
    oCollectionParam;
} catch( err ) {
    oCollectionParam = tools.wvars_to_object( TopElem.wvars );
}

viewType = oCollectionParam.GetOptProperty( 'view_type', '' );
viewBaseName = viewType == '' ? oCollectionParam.catalog_name : viewType;
viewBase = view_types.GetChildByKey( viewBaseName );
checkAccess = tools_web.is_true( oCollectionParam.GetOptProperty( 'check_access', global_settings.settings.check_access_on_lists ) );
openDocFlag = tools_web.is_true( oCollectionParam.GetOptProperty( 'open_doc', false ) );

iLinkFieldIndex = OptInt( oCollectionParam.GetOptProperty( 'link_field_index' ), 0 );
linkObjectField = oCollectionParam.GetOptProperty( 'link_object_field', '' );
linkObjectField = linkObjectField == '' ? 'PrimaryKey' : linkObjectField;
linkProp = Trim( oCollectionParam.GetOptProperty( 'link_prop', '' ) );
linkPropFlag = StrBegins( linkProp, '=' );
linkProp = linkPropFlag ? linkProp.slice( 1 ) : linkProp;

dispCheckBox = tools_web.is_true( oCollectionParam.GetOptProperty( 'disp_check_box', false ) );
isDataGrid = tools_web.is_true( oCollectionParam.GetOptProperty( 'is_data_grid', false ) );
dataFields = oCollectionParam.GetOptProperty( 'data_fields', '' );
dataFields = dataFields == '' ? [] : dataFields.split( ';' );

colCells = oCollectionParam.GetOptProperty( 'col_cells', '' );
colCells = colCells == '' ? [] : colCells.split( ';' );

dispSort = tools_web.is_true( oCollectionParam.GetOptProperty( 'disp_sort', false ) );

dispIcon = tools_web.is_true( oCollectionParam.GetOptProperty( 'disp_icon', false ) );

iCutOff = OptInt( oCollectionParam.GetOptProperty( 'cutoff' ), ( global_settings.settings.script_evaluation_cutoff.HasValue ? global_settings.settings.script_evaluation_cutoff : 0 ) );

sortDirect = "+";

if (iCutOff > 0) {
    iCutOff = GetCurTicks() + (iCutOff * 1000);
}

if ( dispSort ) {
    if ( SORT.FIELD == null ) {
        sortDirect = oCollectionParam.GetOptProperty( 'sort_direct', '' );
        sortDirect = sortDirect == '' ? '+' : sortDirect;
        SORT.DIRECTION = sortDirect == '+' ? 'ASC' : 'DESC';
    } else {
        sortDirect = SORT.DIRECTION == 'ASC' ? '+' : '-';
        oCollectionParam.SetProperty( 'sort_direct', sortDirect );
        oCollectionParam.SetProperty( 'sort_data_field', SORT.FIELD );
    }
} else {
    SORT.FIELD = null;
}

dispPaging = tools_web.is_true( oCollectionParam.GetOptProperty( 'disp_paging', false ) );
PAGING.MANUAL = true;
if ( PAGING.SIZE == null ) {
    if ( dispPaging ) {
        PAGING.SIZE = oCollectionParam.paging_size;
    }
} else {
    oCollectionParam.SetProperty( 'paging_size', PAGING.SIZE );
    oCollectionParam.SetProperty( 'paging_index', PAGING.INDEX );
}

sSid = Request.Session.GetOptProperty( "sid" );
bDispOnly = ( sSid == undefined || sSid == "" || ! tools_web.check_secid( oCollectionParam.GetOptProperty( "secid" ), Request.Session.sid ) );
if ( bDispOnly ) {
    oCollectionParam.SetProperty( "disp_only", true );
    oCollectionParam.SetProperty( "show_all", false );
}

bDispFirstOnly = bDispOnly || curDevice.disp_type != "" || tools_web.is_true( oCollectionParam.GetOptProperty( "disp_first_only", false ) );

if ( bDispOnly || bDispFirstOnly ) {
    colCells = [];
    dispIcon = false;
    oCollectionParam.SetProperty( "disp_first_only", bDispFirstOnly );
}

oContext = tools.read_object(CONTEXT);

sSearch = oContext.GetOptProperty("CatalogListSearchNewsDoc", "");

oFilter = tools.read_object(oCollectionParam.filter_conditions);
sFilterValue = oFilter.GetOptProperty("condition", {value: "#empty#"}).value;
sFilterField = oFilter.GetOptProperty("condition", {field: ""}).field;

oResArrays = tools_web.get_catalog_list_arrays( oCollectionParam, Env, { 'curLngWeb': curLngWeb }, null );

array = StrReplace(array, ';', ',');

curArray = [];

if(Trim(array) != '') {
    curArray = ArrayUnion(tools.xquery("for $elem in active_learnings where MatchSome($elem/id, ( " + array + " ) ) "+(sFilterValue != "#empty#" ? "and $elem/"+sFilterField+" = "+sFilterValue : "")+ (sSearch != "" ? (" and contains($elem/course_name, " + XQueryLiteral(sSearch) + ")") : "") +" return $elem"),
        tools.xquery("for $elem in learnings where MatchSome($elem/id, ( " + array + " ) ) "+(sFilterValue != "#empty#" ? "and $elem/"+sFilterField+" = "+sFilterValue : "")+ (sSearch != "" ? (" and contains($elem/course_name, " + XQueryLiteral(sSearch) + ")") : "") +" return $elem"));
}

if(SORT.FIELD != null) {
    curArray = ArraySort(curArray, oResArrays.arrColumns[OptInt(StrReplaceOne(SORT.FIELD, 'd', ''), 0)].order, sortDirect );
} else {
    curArray = ArraySort(curArray, "This.start_usage_date", "-" );
    SORT.FIELD = "d1";
    SORT.DIRECTION = "DESC";
}

if(dispPaging) {
    curArray = ArrayRange( curArray, PAGING.SIZE * PAGING.INDEX, PAGING.SIZE );
}

arrColumns = oResArrays.arrColumns;
arrHeaders = oResArrays.arrHeaders;
iDispFieldIndex = oResArrays.iDispFieldIndex;
iLinkFieldIndex = oResArrays.iLinkFieldIndex;
iDispFieldIndex = iDispFieldIndex == null ? iLinkFieldIndex : iDispFieldIndex;
sSortDataFieldName = oResArrays.sSortDataFieldName;


if ( PAGING.SIZE != null ) {
    PAGING.TOTAL = String(oCollectionParam.array).split(';').length;
}

if ( dispSort && SORT.FIELD == null ) {
    SORT.FIELD = sSortDataFieldName;
}

columnArrayNum = 0;

if ( dispCheckBox ) {
    oColumn = new Object;
    oColumn.data = 'check';
    oColumn.title = '';
    oColumn.type = 'checkbox';
    oColumn.editable = true;
    oColumn.colorsource = 'col';
    oColumn.width = "30";
    COLUMNS[ columnArrayNum ] = oColumn;
    columnArrayNum++;
}

if ( dispIcon ) {
    oColumn = new Object;
    oColumn.data = 'icon';
    oColumn.title = '';
    oColumn.type = 'fixedimage';
    oColumn.editable = false;
    oColumn.colorsource = 'col';
    oColumn.width = "30";
    COLUMNS[ columnArrayNum ] = oColumn;
    columnArrayNum++;
}

for ( oHeaderElem in arrHeaders ) {
    COLUMNS[ columnArrayNum ] = oHeaderElem;
    columnArrayNum++;
}

if ( isDataGrid ) {
    oColumn = new Object;
    oColumn.data = 'id';
    oColumn.editable = true;
    oColumn.hidden = true;
    oColumn.sortable = false;
    COLUMNS[ columnArrayNum ] = oColumn;
    columnArrayNum++;

    oColumn = new Object;
    oColumn.data = 'disp';
    oColumn.editable = true;
    oColumn.hidden = true;
    oColumn.sortable = false;
    COLUMNS[ columnArrayNum ] = oColumn;
    columnArrayNum++;
}

for ( sFiledElem in dataFields ) {
    oColumn = new Object;
    oColumn.data = sFiledElem;
    oColumn.editable = true;
    oColumn.hidden = true;
    oColumn.sortable = false;
    COLUMNS[ columnArrayNum ] = oColumn;
    columnArrayNum++;
}

arrWorkflows = [];
sIcoCatalog = "ico/" + viewBaseName + ".ico";
RESULTSTREAM.WriteStr( '[' );
curArrayNum = 0;

for ( ListElem in curArray ) {
    _cur_link_field = GetObjectProperty( ListElem, linkObjectField );
    ListElemDoc = openDocFlag ? OpenDoc( UrlFromDocID ( _cur_link_field ) ).TopElem : null;

    if ( checkAccess ) {
        try {
            if (tools_web.check_access((ListElemDoc == null ? OpenDoc(UrlFromDocID(_cur_link_field), 'form=x-local://wtv/wtv_form_doc_access.xmd;ignore-top-elem-name=1').TopElem : ListElemDoc), curUserID, curUser, Request.Session) == false)
                continue;
        } catch (err) {
            continue;
        }
    }

    arrEvalObjects = [ { "ListElem": ListElem, "common": curLngCommon, "tools": tools, "lists": lists, "ms_tools": ms_tools } ];
    arrEvalCellObjects = [ { "ListElem": ListElem, "ListElemDoc": ListElemDoc, "tools": tools, "curLngCommon": curLngCommon, "Env": Env } ];
    sElem = ( curArrayNum == 0 ? '' : ',' ) + ( isDataGrid ? '{"id":"' + _cur_link_field + '",' : '{' ) + '"icon":"' + ( viewBase.row_image_url.HasValue ? SafeEval( viewBase.row_image_url, arrEvalObjects ) : sIcoCatalog ) + '"';
    for ( sFiledElem in dataFields ) {
        sElem += ',"' + sFiledElem + '":"' + ListElem.EvalPath(sFiledElem) + '"';
    }

    columnArrayNum = 0;
    for ( fldColumnElem in arrColumns ) {
        try {
            sColumnValue = CodeLiteral( tools_web.get_cur_lng_name( SafeEval( fldColumnElem.name, arrEvalObjects ), curLng.short_id ), '"' );
            if ( columnArrayNum == iDispFieldIndex && isDataGrid )
                sElem += ',"disp":' + sColumnValue;
        } catch ( err ) {
            sColumnValue = CodeLiteral( err, '"' );
        }

        sElem += ',"d' + columnArrayNum + '":' + sColumnValue;
        columnArrayNum++;
    }

    for ( sCellElem in colCells ) {
        sElem += ',"d' + columnArrayNum + '":' + CodeLiteral( SafeEval( sCellElem, arrEvalCellObjects ), '"' );
        columnArrayNum++;
    }

    if ( linkPropFlag ) {
        try {
            linkPropResult = SafeEval( linkProp, arrEvalCellObjects );
        } catch( e ) {
            linkPropResult = '';
        }

        if ( linkPropResult != '' ) {
            sElem += ',"link":"' + linkPropResult + '"';
        }
    }

    if ( viewBase.row_bk_color.HasValue ) {
        sElem += ',"col":"#' + StrHexColor(SafeEval(viewBase.row_bk_color, arrEvalCellObjects)) + '"';
    }

    sElem += '}';
    RESULTSTREAM.WriteStr( sElem );
    curArrayNum++;

    if (iCutOff > 0 && iCutOff < GetCurTicks()) {
        alert( StrReplace( StrReplace( 'WARNING uni_catalog_list.bs: Time out query "{PARAM1}" from number {PARAM2}.', '{PARAM1}', oResArrays.sQuery ), '{PARAM2}', curArrayNum ) );
        break;
    }
}

RESULTSTREAM.WriteStr( ']' );

//alert(RESULTSTREAM.DetachStr())