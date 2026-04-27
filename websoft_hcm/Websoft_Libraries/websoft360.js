function InitObjects(teObject, bUpdate)
{
	_app = tools_app.get_cur_application(null, null, teObject.id, teObject);
	_o_str = 'websoft360_app_workflow_1;websoft360_app_workflow_2;websoft360_app_request_1';
	_o_str += ';websoft360_app_template_1;websoft360_app_template_2;websoft360_app_template_3;websoft360_app_template_4;websoft360_app_template_5';
	_o_str += ';websoft360_app_xaml_insert;websoft360_app_resp_sel_dlg;websoft360_app_capability_operation;websoft360_unidlg_hxaml_respondent_submit;websoft360_unidlg_hxaml_tile_elem';
	_o_str += ';websoft360_unidlg_dlgselectcolls;websoft360_unidlg_hxaml_respondent_collection;websoft360_app_materials';
	_o_str += ';websoft360_unidlg_uni_catalog_list;websoft360_unidlg_uni_catalog_tree_tasks;websoft360_unidlg_uni_catalog_tree_colls;websoft360_unidlg_uni_catalog_tree_subdivs;websoft360_unidlg_uni_catalog_menu';
	_o_str += ';websoft360_histogram_wt3_no_owc';
	for (_st in String(_o_str).split(';'))
	{
		if (_app.wvars.ObtainChildByKey( 'objects.' + StrReplace(StrReplace(_st,'websoft360_app_',''),'websoft360_','') ).value == '')
		{
			bUpdate = true;
			break;
		}
	}
	if (tools_web.is_true(_app.wvars.ObtainChildByKey("application_init").value) && !bUpdate)
	{
		return true;
	}
	_workflow_1 = ArrayOptFirstElem(XQuery("for $obj in workflows where $obj/code='websoft360_app_workflow_1' return $obj/Fields('id')"));
	if (_workflow_1!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "workflow_1").value = _workflow_1.id.Value;
	}
	_workflow_2 = ArrayOptFirstElem(XQuery("for $obj in workflows where $obj/code='websoft360_app_workflow_2' return $obj/Fields('id')"));
	if (_workflow_2!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "workflow_2").value = _workflow_2.id.Value;
	}
	_request_1 = ArrayOptFirstElem(XQuery("for $obj in request_types where $obj/code='websoft360_app_request_1' return $obj/Fields('id')"));
	if (_request_1!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "request_1").value = _request_1.id.Value;
	}
	_template_1 = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_template_1' return $obj/Fields('id')"));
	if (_template_1!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "template_1").value = _template_1.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_template_1', 
			name: 'Подготовка формы компетенций', 
			url: '',
			html: 'tools_app.get_application_lib(curAssessmentAppraise).TemplateCode_1( oData, curAssessmentAppraise, curAssessmentAppraise.id.Value, curPersonID, curPA, obtainTEFromCache( curPA.workflow_id, "workflow" ) );',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_template_1 = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "template_1" ).value = _template_1.DocID;
	}
	_template_2 = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_template_2' return $obj/Fields('id')"));
	if (_template_2!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "template_2").value = _template_2.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_template_2', 
			name: 'Подготовка формы общей оценки', 
			url: '',
			html: 'tools_app.get_application_lib(curAssessmentAppraise).TemplateCode_2( oData, curAssessmentAppraise, curAssessmentAppraise.id.Value, curPersonID, curPA, obtainTEFromCache( curPA.workflow_id, "workflow" ) );',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_template_2 = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "template_2" ).value = _template_2.DocID;
	}
	_template_3 = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_template_3' return $obj/Fields('id')"));
	if (_template_3!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "template_3").value = _template_3.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_template_3', 
			name: 'Сохранение формы компетенций', 
			url: '',
			html: 'tools_app.get_application_lib(curAssessmentAppraise).TemplateCode_3( oData, curAssessmentAppraise, curAssessmentAppraise.id.Value, curPersonID, curPA, obtainTEFromCache( curPA.workflow_id, "workflow" ), xmlPartData );',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_template_3 = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "template_3" ).value = _template_3.DocID;
	}
	_template_4 = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_template_4' return $obj/Fields('id')"));
	if (_template_4!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "template_4").value = _template_4.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_template_4', 
			name: 'Сохранение формы общей оценки', 
			url: '',
			html: 'tools_app.get_application_lib(curAssessmentAppraise).TemplateCode_4( oData, curAssessmentAppraise, curAssessmentAppraise.id.Value, curPersonID, curPA, obtainTEFromCache( curPA.workflow_id, "workflow" ), xmlPartData );',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_template_4 = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "template_4" ).value = _template_4.DocID;
	}
	_template_5 = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_template_5' return $obj/Fields('id')"));
	if (_template_5!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "template_5").value = _template_5.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_template_5', 
			name: 'Дерево Опроса 360', 
			url: '',
			html: 'tools_app.get_application_lib(curAssessmentAppraise).TemplateCode_5( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID );',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_template_5 = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "template_5" ).value = _template_5.DocID;
	}
	_ass_34_xaml_insert = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_xaml_insert' return $obj/Fields('id')"));
	if (_ass_34_xaml_insert!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "xaml_insert").value = _ass_34_xaml_insert.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_xaml_insert', 
			name: 'Custom_xaml_template', 
			url: 'x-local://applications/websoft360/ass_34_xaml_insert.html',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_ass_34_xaml_insert = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "xaml_insert" ).value = _ass_34_xaml_insert.DocID;
	}
	_app_materials = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_materials' return $obj/Fields('id')"));
	if (_app_materials!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "materials").value = _app_materials.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_materials', 
			name: 'Custom_xaml_template', 
			url: 'x-local://applications/websoft360/ass_34_materials.xaml',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_app_materials = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "materials" ).value = _app_materials.DocID;
	}
	_aap_360_resp_sel_dlg = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_app_resp_sel_dlg' return $obj/Fields('id')"));
	if (_aap_360_resp_sel_dlg!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "resp_sel_dlg").value = _aap_360_resp_sel_dlg.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_resp_sel_dlg', 
			name: 'Выбор респондентов (диалог) XAML', 
			url: 'x-local://applications/websoft360/aap_dlg_sel_resp.xaml',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_aap_360_resp_sel_dlg = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "resp_sel_dlg" ).value = _aap_360_resp_sel_dlg.DocID;
	}
	
	_capability_operation = ArrayOptFirstElem(XQuery("for $obj in operations where $obj/code='websoft360_app_capability_operation' return $obj/Fields('id')"));
	if (_capability_operation!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "capability_operation").value = _capability_operation.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_app_capability_operation', 
			name: 'Право на подачу заявки на участие подчиненного в опросе', 
			operation_type: '1',
			object_name: 'collaborator'
			};
		_capability_operation = tools_app.create_application_instance_object( 'operation', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "capability_operation" ).value = _capability_operation.DocID;
	}
	
	_unidlg_hxaml_respondent_submit = ArrayOptFirstElem(XQuery("for $obj in remote_actions where $obj/code='websoft360_unidlg_hxaml_respondent_submit' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_submit!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_respondent_submit").value = _unidlg_hxaml_respondent_submit.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_hxaml_respondent_submit', 
			name: 'Сохранение выбора респондентов',
			url: 'x-local://applications/websoft360/aap_dialog_resp_submit.bs',
			type: 'eval'
			};
		_unidlg_hxaml_respondent_submit = tools_app.create_application_instance_object( 'remote_action', _tmpobj, teObject, false );
		_vvv = [{name: 'sContext', type: 'string', position: 4}, 
			{name: 'person_id', type: 'foreign_elem', catalog: 'collaborator', position: 1}, 
			{name: 'assessment_appraise_id', type: 'foreign_elem', catalog: 'assessment_appraise', position: 2},
			{name: 'bConfirmWrongRespCount', value: 0, type: 'bool', position: 3}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_submit.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
		}
		_unidlg_hxaml_respondent_submit.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_respondent_submit" ).value = _unidlg_hxaml_respondent_submit.DocID;
	}
	
	_unidlg_hxaml_respondent_submit = ArrayOptFirstElem(XQuery("for $obj in remote_actions where $obj/code='websoft360_unidlg_treeconfirm' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_submit!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_treeconfirm").value = _unidlg_hxaml_respondent_submit.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_treeconfirm', 
			name: 'Сохранение выбора респондентов',
			url: 'x-local://applications/websoft360/websoft360_unidlg_treeconfirm.bs',
			type: 'eval'
			};
		_unidlg_hxaml_respondent_submit = tools_app.create_application_instance_object( 'remote_action', _tmpobj, teObject, false );
		_vvv = [{name: 'Confirm', type: 'bool', position: 1}, 
			{name: 'SearchStr', type: 'string', position: 2}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_submit.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
		}
		_unidlg_hxaml_respondent_submit.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_treeconfirm" ).value = _unidlg_hxaml_respondent_submit.DocID;
	}
	
	_unidlg_hxaml_tile_elem = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_unidlg_hxaml_tile_elem' return $obj/Fields('id')"));
	if (_unidlg_hxaml_tile_elem!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_tile_elem").value = _unidlg_hxaml_tile_elem.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_hxaml_tile_elem', 
			name: 'Плашка формы выбора респондентов', 
			url: 'x-local://applications/websoft360/aap_unidlg_hxaml_tile_elem.xaml',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_tile_elem = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_tile_elem" ).value = _unidlg_hxaml_tile_elem.DocID;
	}
	
	_unidlg_DlgSelectColls = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_unidlg_dlgselectcolls' return $obj/Fields('id')"));
	if (_unidlg_DlgSelectColls!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_dlgselectcolls").value = _unidlg_DlgSelectColls.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_dlgselectcolls', 
			name: 'Диалог выбора (с деревом)', 
			url: 'x-local://applications/websoft360/aap_unidlg_dlgselectcolls.xaml',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_DlgSelectColls = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_dlgselectcolls" ).value = _unidlg_DlgSelectColls.DocID;
	}
	
	_unidlg_DlgSelectColls = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_unidlg_dlgselecttree_viewcataloglist' return $obj/Fields('id')"));
	if (_unidlg_DlgSelectColls!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_dlgselecttree_viewcataloglist").value = _unidlg_DlgSelectColls.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_dlgselecttree_viewcataloglist', 
			name: 'Диалог выбора (с деревом)', 
			url: 'x-local://applications/websoft360/app_unidlg_dlgselecttree_viewcataloglist.xaml',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_DlgSelectColls = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_dlgselecttree_viewcataloglist" ).value = _unidlg_DlgSelectColls.DocID;
	}
	
	_unidlg_DlgSelectColls = ArrayOptFirstElem(XQuery("for $obj in custom_web_templates where $obj/code='websoft360_histogram_wt3_no_owc' return $obj/Fields('id')"));
	if (_unidlg_DlgSelectColls!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "histogram_wt3_no_owc").value = _unidlg_DlgSelectColls.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_histogram_wt3_no_owc', 
			name: 'Построение гистограмм', 
			url: 'x-local://applications/websoft360/histogram_wt3_no_owc.html',
			cwt_type: 'default',
			out_type: 'undefined'
			};
		_unidlg_DlgSelectColls = tools_app.create_application_instance_object( 'custom_web_template', _tmpobj, teObject, true );
		_app.wvars.ObtainChildByKey( 'objects.' + "histogram_wt3_no_owc" ).value = _unidlg_DlgSelectColls.DocID;
	}
	
	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_hxaml_respondent_collection' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_respondent_collection").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_hxaml_respondent_collection', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/aap_360_unidlg_hxaml_respondent_collection.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_vvv = [{name: 'catalog_name', type: 'string', position: 1}, 
			{name: 'selected_item_id', type: 'string', position: 2}, 
			{name: 'selected_item_ids', type: 'string', position: 3}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_collection.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
		}
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_hxaml_respondent_collection" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}

	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_uni_catalog_list' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_list").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_uni_catalog_list', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/websoft360_unidlg_uni_catalog_list.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_vvv = [{"name":"catalog_name", "type":"string", "position":2},
{"name":"xquery_qual", "type":"string", "position":4},
{"name":"view_type", "type":"string", "position":5},
{"name":"check_access", "type":"bool", "position":6},
{"name":"open_doc", "type":"bool", "position":7},
{"name":"link_object_field", "value":"PrimaryKey", "type":"string", "position":8},
{"name":"disp_link","value":"false","type":"string", "position":9},
{"name":"col_headers", "type":"string","position":10},
{"name":"col_cells", "type":"string","position":11},
{"name":"external_eval", "type":"string", "position":12},
{"name":"disp_sort","value":1,"type":"bool", "position":13},
{"name":"list_columns", "type":"string","position":14},
{"name":"link_field_index", "type":"integer", "position":15},
{"name":"link_mode", "type":"string", "position":16},
{"name":"link_prop", "type":"string", "position":3},
{"name":"list_headers", "type":"string","position":17},
{"name":"disp_check_box", "type":"bool", "position":18},
{"name":"disp_array","value":0,"type":"bool", "position":19},
{"name":"array", "type":"string","position":20},
{"name":"filter", "type":"string", "position":23},
{"name":"filter_conditions", "type":"string", "position":24},
{"name":"sort_index", "type":"integer", "position":25},
{"name":"sort_direct","value":"+","type":"combo","entries":[{"id":"+","name":"+"},{"id":"-","name":"-"}],"position":26},
{"name":"link_action", "type":"string", "position":27},
{"name":"is_data_grid", "type":"bool", "position":28},
{"name":"array_selected","value":"#empty#","type":"string", "position":21},
{"name":"search", "type":"string", "position":30},
{"name":"disp_paging","value":0,"type":"bool", "position":31},
{"name":"paging_size","value":100,"type":"integer", "position":32},
{"name":"paging_max_win","value":500,"type":"integer", "position":33},
{"name":"array_link_field","value":"id","type":"string", "position":22},
{"name":"data_fields", "type":"string","position":29},
{"name":"source_type", "type":"string", "position":34},
{"name":"show_all","value":1,"type":"bool", "position":35},
{"name":"cutoff","value":0,"type":"integer","position":36},
{"name":"link_field_name", "type":"string", "position":37},
{"name":"sort_field_name", "type":"string", "position":38},
{"name":"doUpdate", "type":"string", "position":0},
{"name":"myDepartmentSubdivLevel", "type":"string", "position":39},
{"name":"myDepartmentSubdivCustomElemCode", "type":"string", "position":40},
{"name":"myDepartmentSubdivGroupID", "type":"string", "position":41},
{"name":"viewRestriction", "type":"string", "position":42}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_collection.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
			if (_vv.HasProperty("entries"))
			{
				for (_ee in _vv.entries)
				{
					_grt = _svr.entries.Add();
					_grt.id = _ee.GetOptProperty("id");
					_grt.name = _ee.GetOptProperty("name");
				}
			}
		}
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_list" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}
	
	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_uni_catalog_tree_tasks' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_tasks").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_uni_catalog_tree_tasks', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/websoft36_unidlg_uni_catalog_tree_tasks.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_vvv = [{"name": "myDepartmentSubdivLevel","type": "integer","position": "2"},
{"name": "myDepartmentSubdivCustomElemCode","type": "string","position": "3"},
{"name": "myDepartmentSubdivGroupID","type": "integer","position": "4"},
{"name": "viewRestriction","type": "string","position": "5"},
{"name": "doUpdate","type": "bool","position": "1"},
{"name": "folder_xquery_qual","type": "string","position": "6"},
{"name": "xquery_qual","type": "string","position": "7"},
{"name": "folder_ids","type": "string","position": "8"},
{"name": "folders_with_children","type": "string","position": "9"}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_collection.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
			if (_vv.HasProperty("entries"))
			{
				for (_ee in _vv.entries)
				{
					_grt = _avr.entries.Add();
					_grt.id = _ee.GetOptProperty("id");
					_grt.name = _ee.GetOptProperty("name");
				}
			}
		}
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_tasks" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}
	
	
	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_uni_catalog_tree_colls' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_colls").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_uni_catalog_tree_colls', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/websoft360_unidlg_uni_catalog_tree_colls.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_vvv = [{"name": "myDepartmentSubdivLevel","type": "integer","position": "2"},
{"name": "myDepartmentSubdivCustomElemCode","type": "string","position": "3"},
{"name": "myDepartmentSubdivGroupID","type": "integer","position": "4"},
{"name": "viewRestriction","type": "string","position": "5"},
{"name": "doUpdate","type": "bool","position": "1"},
{"name": "folder_xquery_qual","type": "string","position": "6"},
{"name": "xquery_qual","type": "string","position": "7"},
{"name": "filter","type": "string","position": "8"},
{"name": "filter_conditions","type": "string","position": "9"},
{"name": "search","type": "string","position": "10"},
{"name": "useSimpleHierBuilding","type": "string","position": "11"}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_collection.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
			if (_vv.HasProperty("entries"))
			{
				for (_ee in _vv.entries)
				{
					_grt = _avr.entries.Add();
					_grt.id = _ee.GetOptProperty("id");
					_grt.name = _ee.GetOptProperty("name");
				}
			}
		}
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_colls" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}
	
	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_uni_catalog_tree_subdivs' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_subdivs").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_uni_catalog_tree_subdivs', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/websoft360_unidlg_uni_catalog_tree_subdivs.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_vvv = [{"name": "myDepartmentSubdivLevel","type": "integer","position": "2"},
{"name": "myDepartmentSubdivCustomElemCode","type": "string","position": "3"},
{"name": "myDepartmentSubdivGroupID","type": "integer","position": "4"},
{"name": "viewRestriction","type": "string","position": "5"},
{"name": "doUpdate","type": "bool","position": "1"},
{"name": "folder_xquery_qual","type": "string","position": "6"},
{"name": "xquery_qual","type": "string","position": "7"}];
		for (_vv in _vvv)
		{
			_svr = _unidlg_hxaml_respondent_collection.TopElem.wvars.ObtainChildByKey( _vv.name );
			_svr.type = _vv.GetOptProperty( 'type', '' );
			_svr.position = _vv.GetOptProperty( 'position', '' );
			_svr.catalog = _vv.GetOptProperty( 'catalog', '' );
			_svr.value = _vv.GetOptProperty( 'value', '' );
			if (_vv.HasProperty("entries"))
			{
				for (_ee in _vv.entries)
				{
					_grt = _avr.entries.Add();
					_grt.id = _ee.GetOptProperty("id");
					_grt.name = _ee.GetOptProperty("name");
				}
			}
		}
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_tree_subdivs" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}
	
	
	_unidlg_hxaml_respondent_collection = ArrayOptFirstElem(XQuery("for $obj in remote_collections where $obj/code='websoft360_unidlg_uni_catalog_menu' return $obj/Fields('id')"));
	if (_unidlg_hxaml_respondent_collection!=undefined)
	{
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_menu").value = _unidlg_hxaml_respondent_collection.id.Value;
	}
	else
	{
		_tmpobj = {
			code: 'websoft360_unidlg_uni_catalog_menu', 
			name: 'Выборка блока респондентов', 
			url: 'x-local://applications/websoft360/websoft360_unidlg_uni_catalog_menu.bs',
			cwt_type: 'default',
			out_type: 'xaml'
			};
		_unidlg_hxaml_respondent_collection = tools_app.create_application_instance_object( 'remote_collection', _tmpobj, teObject, false );
		_unidlg_hxaml_respondent_collection.Save();
		_app.wvars.ObtainChildByKey( 'objects.' + "unidlg_uni_catalog_menu" ).value = _unidlg_hxaml_respondent_collection.DocID;
	}
	
	
	_app.wvars.ObtainChildByKey("application_init").value = 'true';
	_appDoc = tools.open_doc(_app.id.Value);
	for (_st in String(_o_str).split(';'))
	{
		_appDoc.TopElem.wvars.ObtainChildByKey( 'objects.' + StrReplace(_st,'websoft360_app_','') ).value = _app.wvars.ObtainChildByKey( 'objects.' + StrReplace(_st,'websoft360_app_','') ).value;
	}
	_appDoc.TopElem.wvars.ObtainChildByKey("application_init").value = 'true';
	_appDoc.Save();
}

function InitProcess(docObject, _dlg)
{
	teObject = docObject.TopElem;
	InitObjects(teObject, false);
	_app = tools_app.get_cur_application(null, null, teObject.id.Value, teObject);
	teObject.workflow_id = _app.wvars.ObtainChildByKey('objects.workflow_1').value;
	teObject.always_check_custom_experts = true;
	teObject.status = '0';
	teObject.web_display = true;
	teObject.flag_use_plan = false;
	teObject.is_model = false;
	teObject.player = 1;
	teObject.tree_custom_web_template_id = _app.wvars.ObtainChildByKey("objects.template_5").value;
	teObject.is_basic_comment = false;
	
	sMarkType = _app.instance.wvars.ObtainChildByKey('score_type').value.Value;
	
	sAuditorys = "";
	sAuditorysMan = "";
	sAuditorysSlf = "";
	iMaxCount = 1000;
	if (tools_app.get_cur_settings("request_type", "instance", 'wvars', null, null, teObject.id.Value, teObject)!="none")
	{
		teObject.ignore_presence = true;
	}
	else
	{
		teObject.ignore_presence = false;
	}
	for (_type in ArraySelect(common.assessment_appraise_participants,'This.index<4'))
	{
		if (tools_web.is_true(_app.wvars.ObtainChildByKey(_type.PrimaryKey).value))
		{
			_part = teObject.participants.ObtainChildByKey(_type.PrimaryKey);
			_aat = _part.assessment_appraise_types.ObtainChildByKey('competence_appraisal');
			if (_app.instance.wvars.ObtainChildByKey('profile_type').value=='one')
			{
				_aat.competence_profile_id = _app.instance.wvars.ObtainChildByKey('profile_user_id').value;
			}
			_aat.formula = 'COUNT==0?0:(SUM/COUNT)';
			if (sMarkType == "comp")
			{
				_aat.sub_formula = "";
			}
			else
			{
				_aat.sub_formula = 'COUNT==0?0:(SUM/COUNT)';
			}
			_aat.custom_web_template_id = _app.wvars.ObtainChildByKey('objects.template_1').value;
			_aat.custom_post_web_template_id = _app.wvars.ObtainChildByKey('objects.template_3').value;
			_aat.index = 2;
			if (_type.PrimaryKey=='self')
			{
				_aat = _part.assessment_appraise_types.ObtainChildByKey('result');
				_aat.type_title = 'Выбор респондентов';
				_aat.custom_web_template_id = _app.wvars.ObtainChildByKey('objects.template_2').value;
				_aat.custom_post_web_template_id = _app.wvars.ObtainChildByKey('objects.template_4').value;
				_aat.index = 1;
				
				if (_app.instance.wvars.ObtainChildByKey('na_active').value.Value == 'true')
				{
					_ncheck = _part.parameters.AddChild(); 
					_ncheck.parameter_id = 'Nchecked'
				}
			}
			if (_type.PrimaryKey == 'coll')
			{
				_part.customize.additional_participants_code = 'tools_aap360 = tool_app.get_application_lib(_Assessment); 
					_cur_app = tools_app.get_application(_Assessment);
					var oBoss = tools.get_uni_user_boss(personID);
					if(oBoss != undefined)
					{
						MASTERS_PACK  = new Array();
						for(iColl in tools_aap360.get_direct_sub_person_ids(oBoss.id))
						{
							if(Int(iColl) != Int(personID))
							{
								MASTERS_PACK.push(iColl);
							}
						}
					}
					else
						MASTERS_PACK = new Array();
					LBOUND = ArrayCount(MASTERS_PACK);
					UBOUND = LBOUND;
					var oCheckObject = tools_app.get_cur_settings( "iMinColl", "instance", null, null, _Assessment.id.Value, _Assessment );
					if ( oCheckObject != "" )
					{
						LBOUND  = OptInt(oCheckObject, LBOUND )
					}
					oCheckObject = tools_app.get_cur_settings( "iMaxColl", "instance", null, null, _Assessment.id.Value, _Assessment );
					if ( oCheckObject != "" )
					{
						UBOUND = OptInt(oCheckObject.value, UBOUND );
					}';
					
				if (_app.instance.wvars.ObtainChildByKey('na_active').value.Value == 'true')
				{
					_ncheck = _part.parameters.AddChild(); 
					_ncheck.parameter_id = 'Nchecked'
				}
			}
			if (_type.PrimaryKey == 'staff')
			{
				_part.customize.additional_participants_code = 'tools_aap360 = tool_app.get_application_lib(_Assessment); 
					_cur_app = tools_app.get_application(_Assessment);
					MASTERS_PACK = tools_aap360.get_direct_sub_person_ids(oBoss.id);
					LBOUND = ArrayCount(MASTERS_PACK);
					UBOUND = LBOUND;
					var oCheckObject = tools_app.get_cur_settings( "iMinStaff", "instance", null, null, _Assessment.id.Value, _Assessment );
					if ( oCheckObject != "" )
					{
						LBOUND  = OptInt(oCheckObject, LBOUND )
					}
					oCheckObject = tools_app.get_cur_settings( "iMaxStaff", "instance", null, null, _Assessment.id.Value, _Assessment );
					if ( oCheckObject != "" )
					{
						UBOUND = OptInt(oCheckObject.value, UBOUND );
					}';
					
				if (_app.instance.wvars.ObtainChildByKey('na_active').value.Value == 'true')
				{
					_ncheck = _part.parameters.AddChild(); 
					_ncheck.parameter_id = 'Nchecked'
				}
			}
			if (_type.PrimaryKey == 'manager')
			{
				_part.customize.additional_participants_code = 'MASTERS_PACK = new Array();
					var oBoss = tools.get_uni_user_boss(personID);
					if(oBoss != undefined)
					{
						MASTERS_PACK.push(oBoss.id)
					}
					LBOUND = ArrayCount(MASTERS_PACK);
					UBOUND = LBOUND;';
				
				if (_app.instance.wvars.ObtainChildByKey('na_active').value.Value == 'true')
				{
					_ncheck = _part.parameters.AddChild(); 
					_ncheck.parameter_id = 'Nchecked'
				}
			}
		}
	}
	sAuditorys = ArrayMerge(docObject.TopElem.auditorys,"String(This.PrimaryKey)",",");
	docObject.TopElem.auditorys.Clear();
	docObject.Save();
	_init_flag = _dlg.wvars.ObtainChildByKey('users_type').value;
	
	if (_init_flag == 'select')
	{
		
	}
	else if (_init_flag == 'all')
	{
		sAuditorys = ArrayMerge( XQuery("for $elem in collaborators where $elem/is_dismiss!=true() return $elem/Fields('id')") ,"String(This.id)",",");
	}
	else if (_init_flag == 'group')
	{
		sReq = "for $elem in group_collaborators where $elem/group_id=" + OptInt(_dlg.wvars.ObtainChildByKey('users_group_id').value,0) + " return $elem/Fields('collaborator_id')";
		sAuditorys = ArrayMerge( tools.xquery(sReq) ,"This.collaborator_id",",");
	}
	else if (_init_flag == 'file')
	{
		sAuditorys = LoadIdsFromFile(_dlg.wvars.ObtainChildByKey('users_file_name').value);
	}
	
	_select_type = tools_app.get_cur_settings( 'select_type', 'instance', 'wvars', null, null, docObject.DocID, teObject);
	_select_type_generate = tools_app.get_cur_settings( 'select_type_generate', 'instance', 'wvars', null, null, docObject.DocID, teObject);
	if (_select_type=='manager' || _select_type=='user' || _select_type=='hr')
	{
		_phase_start = 'sel_resp_coll';
	}
	else
	{
		_phase_start = 'go_assessment';
	}
	_wDoc = tools.open_doc(teObject.workflow_id);
	if (_wDoc!=undefined)
	{
		if (_wDoc.TopElem.default_state != _phase_start)
		{
			_wDoc.TopElem.default_state = _phase_start;
			_wDoc.Save();
		}
	}
	
	if ( _select_type == 'hr' )
	{
		_part = teObject.participants.ObtainChildByKey( 'expert' );
		_part.customize.is_custom_experts = true;
		if ( teObject.person_id.HasValue )
		{
			_part.customize.experts.ObtainChildByKey( teObject.person_id );
		}
		_part.customize.additional_participants_code = " 
		try {
			if ( ArrayCount( personDoc.path_subs ) == 0 )
			{
				personDoc.filling_path_subs();
				_child = personDoc.path_subs.AddChild();
				_child.id = OptInt( personDoc.org_id, 0);
			}
			
			for ( _eee in XQuery( \"for $elem in func_managers where MatchSome($elem/object_id,(\" + ArrayMerge( personDoc.path_subs, \"OptInt( This.id )\", \",\" ) + \")) return $elem/Fields('person_id')\" ) )
			{
				MASTERS_PACK.push(_eee.person_id);
			}
		} catch(_err_) {alert('ERROR CODE EXPERT = ' + _err_)}
		";
		docObject.Save();
	}
	
	_parts = ArraySelect( teObject.participants, "This.customize.is_custom_experts == false" );
		
	if (sAuditorys!="")
	{
		if (_app.instance.wvars.ObtainChildByKey('profile_type').value=='type')
		{
			_profile_user_id = OptInt( _app.instance.wvars.ObtainChildByKey('profile_user_id').value, 0);
			_profile_manager_id = OptInt( _app.instance.wvars.ObtainChildByKey('profile_manager_id').value, 0);
			aAudArray = sAuditorys.split(",");
			sAuditorysMan = "";
			sAuditorysSlf = "";
			aManArray = [];
			iAudCount = ArrayCount(aAudArray);
			for (_im = 0; _im < iAudCount; _im++)
			{
				sAuditorysSlf += ( sAuditorysSlf != "" ? ( "," + aAudArray[_im] ) : ( aAudArray[_im] ) );
				if ( _im >= iMaxCount || _im == (iAudCount-1) )
				{
					aManArray = ArraySelectAll( XQuery("for $elem in func_managers where $elem/is_native = true() and MatchSome($elem/person_id,(" + sAuditorysSlf + ")) return $elem/Fields('person_id')") );
					sAuditorysMan = ArrayMerge( aManArray, "This.person_id", "," );
					if ( sAuditorysMan != "" )
					{
						for ( oManElem in aManArray )
						{
							sAuditorysSlf = StrReplace( sAuditorysSlf, "" + oManElem.person_id, "" );
						}
						while ( sAuditorysSlf.indexOf(",,") >= 0 )
						{
							sAuditorysSlf = StrReplace( sAuditorysSlf, ",,", "," );
						}
					}
					if ( sAuditorysSlf != "" && sAuditorysSlf != "," && _profile_user_id > 0 )
					{
						for ( _part in _parts )
						{
							_aat = _part.assessment_appraise_types.ObtainChildByKey('competence_appraisal');
							_aat.competence_profile_id = _profile_user_id;
						}
						docObject.Save();
						CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorysSlf ] );
					}
					if ( sAuditorysMan != "" && sAuditorysMan != "," && _profile_manager_id > 0 )
					{
						for ( _part in _parts )
						{
							_aat = _part.assessment_appraise_types.ObtainChildByKey('competence_appraisal');
							_aat.competence_profile_id = _profile_manager_id;
						}
						docObject.Save();
						CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorysMan ] );
					}
					sAuditorysMan = "";
					sAuditorysSlf = "";
				}
			}
		}
		else
		{
			CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorys ] );
		}
		if (_select_type != "none" && _select_type_generate != "full")
		{
			if (_select_type_generate == "manager")
			{
				for (_asspa in ArraySelectAll(XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " and $obj/status != 'manager' and $obj/status != 'self' return $obj/Fields('id')")))
				{
					DeleteDoc(UrlFromDocID(_asspa.id), true);
				}
			}
			else if (_select_type_generate == "none")
			{
				for (_asspa in ArraySelectAll(XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " and $obj/status != 'self' return $obj/Fields('id')")))
				{
					DeleteDoc(UrlFromDocID(_asspa.id), true);
				}
			}
		}
		if (tools_web.is_true(_dlg.wvars.ObtainChildByKey('mail_send').value))
		{
			if (_select_type=='user')
			{
				_mail_tmpl = 'websoft360_start_assessment_person';
			}
			else if (_select_type=='manager')
			{
				_mail_tmpl = 'websoft360_start_assessment_manager';
			}
			else if (_select_type=='hr')
			{
				_mail_tmpl = 'websoft360_start_assessment_hr';
			}
			else
			{
				_mail_tmpl = 'websoft360_start_assessment_participant';
			}
			if (_phase_start == 'go_assessment')
			{
				for (_asspa in XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " return $obj/Fields('id')"))
				{
					tools.create_notification(_mail_tmpl, _asspa.id.Value, "", docObject.DocID);
				}
			}
			else
			{
				for (_assplan in XQuery("for $obj in assessment_plans where $obj/assessment_appraise_id=" + docObject.DocID + " return $obj/Fields('id')"))
				{
					tools.create_notification(_mail_tmpl, _assplan.id.Value, "", docObject.DocID);
				}
			}
		}
	}
}

function generate_assessment_plan(ASSESSMENT_ID, PLAN_ONLY, IS_CLEAN, KILL, FLOORBOUND, ACOUNT, GROUP_ID, AUDITORIS_IDS)
{
	try
	{
		if (PLAN_ONLY == undefined) throw '';
		if (PLAN_ONLY) PLAN_ONLY = true; else PLAN_ONLY = false;
	}
	catch(_hrenoplan_)
	{
		PLAN_ONLY = false;
	}
	
	try
	{
		if (IS_CLEAN == undefined) throw '';
		IS_CLEAN = (IS_CLEAN == true);
	}
	catch(_net_)
	{
		IS_CLEAN = false;
	}
	
	try
	{
		GROUP = OpenDoc(UrlFromDocID(GROUP_ID)).TopElem;
	}
	catch(_net_)
	{
		GROUP_ID = null;
	}
	
	try
	{
		if (KILL == undefined) throw '';
		KILL = (KILL == true);
	}
	catch(_ne_ubiy_)
	{
		KILL = true;
	}
	
	_bHardKill = (global_settings.settings.soft_kill_before_regenerate.Value != true);
	
	_AssessmentDoc = OpenDoc(UrlFromDocID( Int (ASSESSMENT_ID) ));
	_Assessment = _AssessmentDoc.TopElem;
				
	_REPORTING = "";
	
	if (KILL)
	{
		//_Assessment.log.Clear();
		_REPORTING +=( StrReplace( ms_tools.get_const('7jsj6nltqv'), '{PARAM1}', _Assessment.name ) + '\n' );
	}
	var sAuditorisType = (AUDITORIS_IDS != null && AUDITORIS_IDS != undefined) ? 'collection' : ( (GROUP_ID != null && GROUP_ID != undefined) ? 'group' : 'assessment')
	
	switch(sAuditorisType)
	{
		case 'collection':
			AUDITORYS = _Assessment.auditorys.Clone();
			AUDITORYS.Clear();
			FLOORBOUND = undefined;
			ACOUNT = undefined;
			if(DataType(AUDITORIS_IDS) == 'string')
			{
				if(StrBegins(AUDITORIS_IDS, '['))
				{
					AUDITORIS_IDS = tools.read_object(AUDITORIS_IDS);
				}
				else
				{
					AUDITORIS_IDS = StrReplace(AUDITORIS_IDS, ';',',').split(',');
				}
			}
			_REPORTING += ('Добавление сотрудников из списка. Количество: ' + ArrayCount(AUDITORIS_IDS) + '/n');
			for(itemAuditory in AUDITORIS_IDS)
			{
				__person_id = OptInt(itemAuditory);
				if(__person_id != undefined)
				{
					itemAuditory = AUDITORYS.AddChild();
					itemAuditory.person_id = __person_id;
					itemAuditory.person_name = '';
				}
			}
			
			break;
		case 'group':
			_REPORTING +=(ms_tools.get_const('wgr8ltkmug') + ' ' + GROUP.name);
			AUDITORYS = GROUP.collaborators;
			FLOORBOUND = undefined;
			ACOUNT = undefined;
			
			break;
		case 'assessment':
		default:
			try
			{
				AUDITORYS = ArrayRange(_Assessment.auditorys, Int(FLOORBOUND), Int(ACOUNT));
			}
			catch(_ne_ubiy_)
			{
				AUDITORYS = _Assessment.auditorys;
				FLOORBOUND = undefined;
				ACOUNT = undefined;
			}
			
			break;
	}
	
	tools_ass.log_log(_REPORTING ,ms_tools.get_const('it6xkarurd') + (ArrayCount(AUDITORYS) > 0 && FLOORBOUND != undefined && ACOUNT != undefined ? ms_tools.get_const('2lh6hr8tru') + ': '+ (FLOORBOUND + 1) + '-' + (FLOORBOUND + ACOUNT) : '')  );


	if (!IS_CLEAN && KILL)
	{

		if (PLAN_ONLY)
		{
			var query = 'for $plan_doc in assessment_plans where $plan_doc/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $plan_doc/Fields(\'id\')';
			var _pa_arr = XQuery( query  );
		}
		else
		{
			var query = 'for $plan_doc in pas where $plan_doc/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $plan_doc/Fields(\'id\')';
			var _pa_arr = XQuery( query  );
			
			query = 'for $plan_doc in assessment_plans where $plan_doc/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $plan_doc/Fields(\'id\')';
			_pa_arr = ArrayUnion(_pa_arr, XQuery( query  ));
			
			query = 'for $plan_doc in development_plans where $plan_doc/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $plan_doc/Fields(\'id\')';
			_pa_arr = ArrayUnion(_pa_arr, XQuery( query  ));
			
		}
		
		_ot_arr = XQuery( 'for $objective_translate in objective_translates where $objective_translate/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $objective_translate/Fields(\'id\')' );
		_ot_arr = ArrayUnion(XQuery('for $elem in tasks where $elem/source_object_id = ' + ASSESSMENT_ID + ' return $elem/Fields(\'id\')'));
		
		for (_pa in _pa_arr) DeleteDoc(UrlFromDocID(_pa.id), _bHardKill);
		for (_ot in _ot_arr) DeleteDoc(UrlFromDocID(_ot.id), _bHardKill);
	}

	_cur_instance_id = tools_app.get_cur_application_instance( null, null, ASSESSMENT_ID, _Assessment ).id.Value;
	_phase_start = tools_app.get_cur_settings( 'select_type', 'instance', null, _cur_instance_id, ASSESSMENT_ID, _Assessment );
	if (_phase_start=='manager' || _phase_start=='user' || _phase_start=='hr')
	{
		_phase_start = 'sel_resp_coll';
	}
	else
	{
		_phase_start = 'go_assessment';
	}
	_is_notify = tools_app.get_cur_settings( 'notify_start', 'instance', null, _cur_instance_id, ASSESSMENT_ID, _Assessment );
	workflowTE = tools.open_doc(_Assessment.workflow_id).TopElem;
	_phase_start_name = ArrayOptFind(workflowTE.states,"This.code=='"+_phase_start+"'").name;
	
	for (_auditory in AUDITORYS)	// Перебор по всем сотрудникам
	{

		
		if (IS_CLEAN && ArrayOptFirstElem(XQuery('for $elem in assessment_plans where $elem/person_id = ' + _auditory.PrimaryKey + ' and $elem/assessment_appraise_id = ' + ASSESSMENT_ID + ' return $elem/Fields(\'id\')')) != undefined)
			continue;
		
		if (GROUP_ID != null && ArrayOptFind(_Assessment.auditorys, 'This.PrimaryKey == ' + _auditory.PrimaryKey) != undefined)
			continue;
		try
		{
			personDoc = OpenDoc(UrlFromDocID(_auditory.PrimaryKey)).TopElem;
		}
		catch(_kaka_)
		{	
			tools_ass.log_log(_REPORTING, ms_tools.get_const('gt6hgrpwh0') + (_auditory.ChildExists('person_name') ? (_auditory.person_name != '' ? _auditory.person_name : _auditory.PrimaryKey) : _auditory.collaborator_fullname));
			continue;
		}
		
		if (!_Assessment.include_fired.Value && tools_ass.is_dismissed_by_id(personDoc) !== false)
			continue;
	
		personID = _auditory.PrimaryKey;
	
		docAssessmentPlan = tools_app.create_application_instance_object( 'assessment_plan', null, _cur_instance_id, false);
		docAssessmentPlan.TopElem.person_id = personID;
		
		tools_ass.assessment_person_filling(docAssessmentPlan.TopElem.person_id, personID);
						
		docAssessmentPlan.TopElem.flag_appraise_department = false;
		docAssessmentPlan.TopElem.assessment_appraise_id = Int(_AssessmentDoc.DocID);
		docAssessmentPlan.TopElem.workflow_id = _Assessment.workflow_id;
		
		docAssessmentPlan.TopElem.user_access_role = _Assessment.user_access_role;
		docAssessmentPlan.TopElem.user_group_id = _Assessment.user_group_id;
		
		//_boss_id = tools.get_user_boss(personID);
		_boss_id = tools.get_uni_user_boss(personID);
						
		if (_boss_id != undefined)
			docAssessmentPlan.TopElem.boss_id = _boss_id.PrimaryKey;
		else
			tools_ass.log_log(_REPORTING, StrReplace(ms_tools.get_const('ntatzfkdtt'), '{PARAM1}', personDoc.fullname));
					
		docAssessmentPlan.TopElem.assessment_appraise_matrix_id = _Assessment.assessment_appraise_matrix_id;
		//docAssessmentPlan.BindToDb(DefaultDb);
					
		_custom_experts_participants = ArraySelect(_Assessment.participants, 'customize.is_custom_experts == true');
						
						
		for(_cep in _custom_experts_participants)
		{
			
			MASTERS_PACK = Array();
			LBOUND = 0;
			UBOUND = null;

			for(_ce in _cep.customize.experts)
			{
				MASTERS_PACK[ArrayCount(MASTERS_PACK)] = _ce.PrimaryKey;
			}
			_is_f_e_experts = tools_ass.get_assessment_parameter(_Assessment, 'expert', 'func_managers');
			if (_is_f_e_experts)
			{
				_func_managers = ArraySelect(personDoc.func_managers,'is_native == false' );
				for (_fe in _func_managers)
				{
					if (_Assessment.include_fired.Value || tools_ass.is_dismissed_by_id(_fe.PrimaryKey) === false)
						MASTERS_PACK.push(_fe.PrimaryKey);
				}
			}
			
			if (_cep.customize.additional_participants_code.HasValue)
			{
				_save_pack = ArraySelectAll(MASTERS_PACK);
				_save_p_start = LBOUND;
				_save_p_end = UBOUND;
				try
				{
					eval(_cep.customize.additional_participants_code);
				}
				catch(_oi_plya_)
				{
					tools_ass.log_log(_REPORTING, StrReplace( StrReplace( StrReplace( ms_tools.get_const('0cv7j0ucbc'), '{PARAM1}', _participant.PrimaryKey ), '{PARAM2}', personDoc.fullname ), '{PARAM3}', ExtractUserError(_oi_plya_) ) );
					MASTERS_PACK = _save_pack;
					LBOUND = _save_p_start;
					UBOUND = _save_p_end;
				}
			}
			i = 0;
			for (_master in MASTERS_PACK)
			if (UBOUND == null || i <= UBOUND)
			{

				fldChild=docAssessmentPlan.TopElem.custom_experts.ObtainChildByKey(_master);
				fldSource=_cep.customize.experts.GetOptChildByKey(_master)
				if ( fldSource!= undefined)
				{
					fldChild.responsible=fldSource.responsible;
				}
				i++;
			}
			
			if (_cep.customize.min.HasValue)
			{
				_lev = 0;
				_boss_unid = _auditory;
				while (_lev <= _cep.customize.min && _boss_unid != undefined)
				{
					//_boss_unid = tools.get_user_boss(_boss_unid.PrimaryKey);
					if (_Assessment.include_fired.Value)
						_boss_unid = tools.get_uni_user_boss(_boss_unid.PrimaryKey);
					else
						_boss_unid = ArrayOptFind(tools.get_uni_user_bosses(_boss_unid.PrimaryKey), 'tools_ass.is_dismissed_by_id(This) === false');
					_lev++;
				}
				
				if (_boss_unid != undefined)
				{
					docAssessmentPlan.TopElem.custom_experts.ObtainChildByKey(_boss_unid.PrimaryKey).person_type = _cep.customize.min;
				}
			}
			
			if (_cep.customize.max.HasValue)
			{
				_lev = 0;
				_boss_unid = _auditory;
				while (_lev <= _cep.customize.max && _boss_unid != undefined)
				{
					//_boss_unid = tools.get_user_boss(_boss_unid.PrimaryKey);
					if (_Assessment.include_fired.Value)
						_boss_unid = tools.get_uni_user_boss(_boss_unid.PrimaryKey);
					else
						_boss_unid = ArrayOptFind(tools.get_uni_user_bosses(_boss_unid.PrimaryKey), 'tools_ass.is_dismissed_by_id(This) === false');
					_lev++;
				}
				
				if (_boss_unid != undefined)
				{
					docAssessmentPlan.TopElem.custom_experts.ObtainChildByKey(_boss_unid.PrimaryKey).person_type = _cep.customize.max;
				}
			}
			
		}
			
		if (!PLAN_ONLY)
		for (_participant in _Assessment.participants )	// Перебор по всем типам оценки
		{		
			if (_participant.customize.is_custom_experts == false)
			{
				LBOUND = 1;
				UBOUND = 1;
				
				if (_participant.customize.min != null ) {LBOUND = Int(_participant.customize.min); UBOUND = LBOUND;}
				if (_participant.customize.max != null ) {UBOUND = Int(_participant.customize.max);}
				
				if (_participant.PrimaryKey == 'expert')
				{
						if (ArrayCount(_participant.customize.experts) > 0)
							{LBOUND = 1; UBOUND = _participant.customize.experts.ChildNum;}
				}
			
				if (tools_ass.get_assessment_parameter(_Assessment, _participant.PrimaryKey, 'func_managers'))
				{
//*************************
					for (_fe in ArraySelect(personDoc.func_managers , 'is_native == false'))
					{
						if (_Assessment.include_fired.Value || tools_ass.is_dismissed_by_id(_fe.PrimaryKey) === false)
							tools_ass.generate_participant(Int(_AssessmentDoc.DocID), _participant, _auditory, personDoc, docAssessmentPlan.TopElem,_fe.PrimaryKey,true,_REPORTING);
					}
				}
				//else
				{
					if (tools_ass.get_assessment_parameter(_Assessment, _participant.PrimaryKey, 'appraise_each_other'))
					{
						for (_potent_auditory in _Assessment.auditorys)
						{
							if (personID != _potent_auditory.person_id)
							{
//*************************
								if (_Assessment.include_fired.Value || tools_ass.is_dismissed_by_id(_potent_auditory.person_id) === false)
									tools_ass.generate_participant(Int(ASSESSMENT_ID), _participant, _auditory, personDoc, docAssessmentPlan.TopElem,_potent_auditory.person_id,true,_REPORTING);
							}
						}
					}
					else
					{
						if (LBOUND > 0)
						{
							if (docAssessmentPlan.TopElem.boss_id.HasValue && (_participant.PrimaryKey == 'manager' || (_participant.PrimaryKey == 'interview' && _participant.customize.person_id.HasValue == false)))
							{
								MASTERS_PACK = Array();
								MASTERS_PACK[0] = docAssessmentPlan.TopElem.boss_id;
							}
							else
								MASTERS_PACK = tools_ass.pick_experts(Int(ASSESSMENT_ID), personID , _participant, true, _REPORTING, false, !_Assessment.include_fired.Value);
								
							if (_participant.customize.additional_participants_code.HasValue)
							{
								_save_pack = ArraySelectAll(MASTERS_PACK);
								_save_p_start = Int(LBOUND);
								_save_p_end = Int(UBOUND);
								try
								{
									eval(_participant.customize.additional_participants_code);
								}
								catch(_oi_plya_)
								{
									tools_ass.log_log(_REPORTING, StrReplace( StrReplace( StrReplace( ms_tools.get_const('0cv7j0ucbc'), '{PARAM1}', _participant.PrimaryKey ), '{PARAM2}', personDoc.fullname ), '{PARAM3}', ExtractUserError(_oi_plya_) ) );
									MASTERS_PACK = _save_pack;
									LBOUND = _save_p_start;
									UBOUND = _save_p_end;
								}
							}
							
							i = 0;
							_top_border = Random(LBOUND, UBOUND)
							
							for (_master in ArraySort(MASTERS_PACK, 'Random(10000,99999)','+'))
							{
								if (i >= _top_border && _participant.PrimaryKey != 'expert')
									break;
//*************************
									tools_ass.generate_participant(Int(ASSESSMENT_ID), _participant, _auditory, personDoc, docAssessmentPlan.TopElem,_master,true,_REPORTING);
								i++;
							}
						}
					}
				}
				
				
			}
			else
	
			
			if (tools_ass.get_assessment_parameter(_Assessment, _participant.PrimaryKey, 'appraise_func_staff'))
			{
				_funk_slaves = XQuery ('for $fs in func_managers where $fs/person_id = ' + personID + ' and $fs/catalog = \'collaborator\' and $fs/is_native = false() return $fs ');
//*************************
				LBOUND = 0;
				UBOUND = 0;
				if (_participant.customize.min != null ) {LBOUND = Int(_participant.customize.min); UBOUND = LBOUND;}
				if (_participant.customize.max != null ) {UBOUND = Int(_participant.customize.max);}
				
				if (LBOUND > 0)
				{
					_top_border = Random(LBOUND, UBOUND)
					_funk_slaves = ArrayRange(_funk_slaves, 0, _top_border);
				}
				
				for (_fs in _funk_slaves)
				{
					if (_Assessment.include_fired.Value || tools_ass.is_dismissed_by_id(_fs.object_id) === false)
						tools_ass.generate_participant(Int(_AssessmentDoc.DocID), _participant, _auditory, personDoc, docAssessmentPlan.TopElem,_fs.object_id,true,_REPORTING);
				}
			}
		}
		
		if (_Assessment.participant_select.HasValue)
		{
			docAssessmentPlan.TopElem.flag_expert_select = true;
		}
		
		docAssessmentPlan.TopElem.workflow_state = _phase_start;
		docAssessmentPlan.TopElem.workflow_state_name = _phase_start_name;
		docAssessmentPlan.TopElem.is_workflow_init = true;
		docAssessmentPlan.Save();

		for (_pa in tools.xquery("for $elem in pas where $elem/assessment_plan_id = "  + docAssessmentPlan.DocID + " return $elem/Fields('id')"))
		{
			_paDoc = tools.open_doc(_pa.id);
			_paDoc.TopElem.workflow_state = _phase_start;
			_paDoc.TopElem.workflow_state_name = _phase_start_name;
			_paDoc.TopElem.is_workflow_init = true;
			_paDoc.Save();
		}
		
		if (_is_notify)
		{
			
		}
		
		for (_test in _Assessment.assessments)
		{
			try
			{
				_test_response = tools.activate_test_to_person( personID, _test.PrimaryKey );
				
				try
				{
					_test_response.TopElem;
					tools_ass.log_log( _REPORTING, StrReplace( StrReplace( ms_tools.get_const('rcteiij8e1'), '{PARAM1}', _test.assessment_name ), '{PARAM2}', personDoc.fullname ) );
					
					_test_response.TopElem.assessment_appraise_id = _AssessmentDoc.DocID;
					_test_response.Save();
					
				}
				catch(_hrenak_)
				{
					tools_ass.log_log(_REPORTING, StrReplace( StrReplace( ms_tools.get_const('tl5hpi7gkq'), '{PARAM1}', _test.assessment_name ), '{PARAM2}', personDoc.fullname ) );
				}
			}
			catch(_lazha_)
			{
				tools_ass.log_log(_REPORTING, StrReplace( StrReplace( ms_tools.get_const('jnpoqy8jen'), '{PARAM1}', _test.assessment_name ), '{PARAM2}', personDoc.fullname ) );
			}
		}
	}
	
	
	
	for (_department in _Assessment.departments)
	{
		docAssessmentPlan = tools_app.create_application_instance_object( 'assessment_plan', null, _cur_instance_id, false);
		docAssessmentPlan.TopElem.department_id = _department.department_id;
		docAssessmentPlan.TopElem.flag_appraise_department = true;
		docAssessmentPlan.TopElem.assessment_appraise_id = Int(_AssessmentDoc.DocID);
		docAssessmentPlan.TopElem.workflow_id = _Assessment.workflow_id;
		docAssessmentPlan.TopElem.assessment_appraise_matrix_id = _Assessment.assessment_appraise_matrix_id;
		
		docAssessmentPlan.TopElem.user_access_role = _Assessment.user_access_role;
		docAssessmentPlan.TopElem.user_group_id = _Assessment.user_group_id;
		
		//docAssessmentPlan.BindToDb(DefaultDb);
	
		_custom_experts_participants = ArraySelect(_Assessment.participants, 'customize.is_custom_experts == true');
		
		_custom_experts_participants = ArraySelect(_Assessment.participants, 'customize.is_custom_experts == true');
						
						
		for(_cep in _custom_experts_participants)
		{
			for(_ce in _cep.customize.experts)
			{
				fldChild=docAssessmentPlan.TopElem.custom_experts.ObtainChildByKey(_ce.PrimaryKey);
				fldChild.responsible=_ce.responsible;
			}
		}
		if(!PLAN_ONLY)
		for (_participant in _Assessment.participants )	// Перебор по всем типам оценки
		{
			if (_participant.customize.is_custom_experts == false)
			{
				LBOUND = 1;
				UBOUND = 1;

				if (_participant.customize.min != null ) {LBOUND = Int(_participant.customize.min); UBOUND = LBOUND;}
				if (_participant.customize.max != null ) {UBOUND = Int(_participant.customize.max);}
								
				if (_participant.PrimaryKey == 'expert')
				{
					if (_participant.customize.experts != null)
						{ LBOUND = 1; UBOUND = _participant.customize.experts.ChildNum;}
						
				}
						
				_masters_pack = pick_experts(Int(ASSESSMENT_ID), _department.PrimaryKey , _participant, false, _REPORTING, false, !_Assessment.include_fired.Value);
				i = 0;
				_top_border = Random(LBOUND, UBOUND)
				for (_master in _masters_pack)
				{
					if (i >= _top_border)
						break;
						
						tools_ass.generate_participant(Int(_AssessmentDoc.DocID), _participant, _department,null, docAssessmentPlan.TopElem,_master,false,_REPORTING);
					i++;
				}
			}
		}
		
		docAssessmentPlan.Save();
	}
	
	tools_ass.log_log(_REPORTING ,ms_tools.get_const('arre09dzkl') + (ArrayCount(AUDITORYS) > 0 && FLOORBOUND != undefined && ACOUNT != undefined ? ms_tools.get_const('2lh6hr8tru') + ': '+ (FLOORBOUND + 1) + '-' + (FLOORBOUND + ACOUNT) : ''));

	_AssessmentDoc.Save();
	if (_Assessment.report_id.HasValue)
		tools.add_report( _Assessment.report_id, _REPORTING );
	
	
}

function get_direct_sub_person_ids(iUserId)
{
	var iMainBossTypeID = ArrayOptFirstElem(XQuery('for $elem in boss_types where code=\'main\' return $elem'),{id:0}).id;
	
	if(iMainBossTypeID == 0)
		return [];
	
	arrCollaborators = new Array();
	arrSubdivisionIds = ArrayExtract(XQuery('for $elem in func_managers where $elem/boss_type_id = ' + iMainBossTypeID + ' and $elem/person_id = ' + iUserId + ' and $elem/catalog = \'position\' return $elem'),'parent_id');
	
	arrSubdivisionIds = ArrayUnion(arrSubdivisionIds, ArrayExtract(XQuery('for $elem in func_managers where $elem/boss_type_id = ' + iMainBossTypeID + ' and $elem/person_id = ' + iUserId + ' and $elem/catalog = \'subdivision\' return $elem'),'object_id'));	
	
	if(ArrayOptFirstElem(arrSubdivisionIds) != undefined)
		arrCollaborators = ArrayExtract(XQuery('for $elem in positions where MatchSome( $elem/parent_object_id, (' + ArrayMerge(arrSubdivisionIds,'This',',') + ')) and $elem/basic_collaborator_id != ' + iUserId + ' return $elem'),'basic_collaborator_id');
		
	arrOrgIds = ArrayExtract(XQuery('for $elem in func_managers where $elem/boss_type_id = ' + iMainBossTypeID + ' and $elem/person_id = ' + iUserId + ' and $elem/catalog = \'org\' return $elem'),'object_id');
	
	if(ArrayOptFirstElem(arrOrgIds) != undefined)
		arrCollaborators = ArrayUnion(ArrayExtract(XQuery('for $elem in positions where MatchSome( $elem/org_id, (' + ArrayMerge(arrOrgIds,'This',',') + ')) and $elem/parent_object_id = null() and $elem/basic_collaborator_id != ' + iUserId + ' return $elem'),'basic_collaborator_id'),arrCollaborators);
	
	arrCollaborators = ArrayUnion(ArrayExtract(XQuery('for $elem in func_managers where $elem/boss_type_id = ' + iMainBossTypeID + ' and $elem/person_id = ' + iUserId + ' and $elem/catalog = \'collaborator\' return $elem'),'object_id'),arrCollaborators);
	
	arrCollaborators = ArrayExtract(QueryCatalogByKeys('collaborators','id',arrCollaborators), 'id');
	return arrCollaborators;
}

function get_func_manager_id(iUserId, sOperCode)
{
	function fnTopHierSubdivision(base_subdiv_id, array_subdiv_id)
	{
		if(array_subdiv_id == undefined)
			array_subdiv_id = [];

		array_subdiv_id.push(base_subdiv_id);

		var parent_subdiv_id = ArrayOptFirstElem(tools.xquery('for $elem in subdivisions where id = ' + base_subdiv_id + ' return $elem/Fields(\'parent_object_id\')')).parent_object_id;
		if(parent_subdiv_id != null)
		{
			array_subdiv_id = fnTopHierSubdivision(parent_subdiv_id, array_subdiv_id)
		}

		return array_subdiv_id;
	}

	var oOper = ArrayOptFirstElem( tools.xquery( 'for $elem in operations where $elem/code = ' + CodeLiteral(sOperCode) + ' and $elem/operation_type = 1 return $elem/Fields(\'id\')' ) );
	if( oOper == undefined )
		return null;

	arrBossType = ArraySelectAll( tools.xquery( 'for $elem in boss_types where contains($elem/operations, \'' + oOper.id + '\') return $elem/Fields(\'id\')' ) );

	catFuncManager = ArrayOptFirstElem(tools.xquery('for $elem in func_managers where catalog=\'collaborator\' and MatchSome($elem/boss_type_id, (' + ArrayMerge( arrBossType, 'This.id', ',' ) + ') ) and object_id=' + iUserId + ' return $elem'));

	if(catFuncManager != undefined)
	{
		return catFuncManager.person_id;
	}
	else
	{
		iPesonSubdivID = ArrayOptFirstElem(tools.xquery('for $elem in collaborators where $elem/id=' + iUserId + ' return $elem/Fields(\'position_parent_id\')'), {position_parent_id:0}).position_parent_id;
		for(HierSubdivID in fnTopHierSubdivision(iPesonSubdivID))
		{
			catFuncManager = ArrayOptFirstElem(tools.xquery('for $elem in func_managers where catalog=\'subdivision\' and MatchSome($elem/boss_type_id, (' + ArrayMerge( arrBossType, 'This.id', ',' ) + ') ) and object_id=' + HierSubdivID + ' return $elem'));
			if(catFuncManager != undefined)
			{
				return catFuncManager.person_id;
			}
		}
		return null;
	}
}

function create_pa(oStatus, iAssessmentPlanID, iExpertID, sWorkflowStatus)
{
	var curPlan = tools.open_doc(iAssessmentPlanID).TopElem;
	
	var curAssessmentAppraiseID = curPlan.assessment_appraise_id
	var curAssessmentAppraise = tools.open_doc(curAssessmentAppraiseID).TopElem
	 
	oPart = curAssessmentAppraise.participants.GetOptChildByKey(oStatus.participant);
	if(oPart != undefined)
	{
		oCompetenceAppraise = oPart.assessment_appraise_types.GetOptChildByKey('competence_appraisal', 'assessment_appraise_type_id')
		iCompetenceProfileID = oCompetenceAppraise != undefined ? OptInt(oCompetenceAppraise.competence_profile_id, 0) : 0;
		if(iCompetenceProfileID == 0 )
		{
			iCompetenceProfileID = OptInt(ArrayOptFirstElem(tools.xquery('for $p in positions, $c in collaborators where $p/id = $c/position_id and $c/id = ' + curPlan.person_id + ' return $p/competence_profile_id'), {competence_profile_id : 0}).competence_profile_id, 0);
		}
		
		try
		{
			teCompetenceProfile = OpenDoc(UrlFromDocID(iCompetenceProfileID)).TopElem;
		}
		catch(e)
		{
			teCompetenceProfile = null;
			iCompetenceProfileID = 0;
		}
	}
	else
	{
		teCompetenceProfile = null;
		iCompetenceProfileID = 0;
	}

	var existPA = ArrayOptFirstElem(tools.xquery('for $elem in pas where $elem/assessment_plan_id = '  + iAssessmentPlanID + ' and $elem/expert_person_id = '  + iExpertID + ' and $elem/status = '  + CodeLiteral(oStatus.participant) + ' return $elem/Fields(\'id\')'))

	if(existPA == undefined)
	{
		tools_ass.generate_participant( curAssessmentAppraiseID, oPart, curPlan, null, curPlan, iExpertID, true, null );
		var newPA = ArrayOptFirstElem(tools.xquery('for $elem in pas where $elem/assessment_plan_id = '  + iAssessmentPlanID + ' and $elem/expert_person_id = '  + iExpertID + ' and $elem/status = '  + CodeLiteral(oStatus.participant) + ' return $elem/Fields(\'id\')'))

		if(newPA != undefined)
		{
			docChangePA = tools.open_doc(newPA.id);
		}
		else
		{
			docChangePA = null
		}
	}
	else
	{
		docChangePA = tools.open_doc(existPA.id);
	}

	if(docChangePA != null)
	{
		if(teCompetenceProfile != null)
		{		
			docChangePA.TopElem.competence_profile_id = iCompetenceProfileID;
			docChangePA.TopElem.competences.AssignElem( teCompetenceProfile.competences );
		}

		docChangePA.TopElem.custom_experts.AssignElem( curPlan.custom_experts );
		docChangePA.TopElem.workflow_state = sWorkflowStatus;
		docChangePA.TopElem.workflow_state_name = docChangePA.TopElem.get_workflow_state_name( null );
		docChangePA.TopElem.add_workflow_log_entry({finish_state: sWorkflowStatus, person_fullname: 'StartAgent'});
		docChangePA.TopElem.set_workflow_state_last_date(null);
		docChangePA.TopElem.custom_elems.ObtainChildByKey('participant_subclass').value = oStatus.name;

		docChangePA.Save();
	}
	
	return docChangePA == null ? null : docChangePA.DocID;
}
function SetProcess(docObject, _dlg)
{
	var sFillAuditorysType = _dlg.wvars.ObtainChildByKey('users_type').value;
	teObject = docObject.TopElem;
	var sAuditorys = "";
	var iMaxCount = 1000;
	switch(sFillAuditorysType)
	{
		case 'group':
			sReq = "for $elem in group_collaborators where $elem/group_id=" + OptInt(_dlg.wvars.ObtainChildByKey('users_group_id').value,0) + " return $elem/Fields('collaborator_id')";
			sAuditorys = ArrayMerge( tools.xquery(sReq) ,"This.collaborator_id",",");
			break;
		default:
			sAuditorys = ArrayMerge(docObject.TopElem.auditorys,"This.PrimaryKey",",");
			break;
	}
	_select_type = tools_app.get_cur_settings( 'select_type', 'instance', 'wvars', null, null, docObject.DocID, teObject);
	_select_type_generate = tools_app.get_cur_settings( 'select_type_generate', 'instance', 'wvars', null, null, docObject.DocID, teObject);
	_type = tools_app.get_cur_settings( 'profile_type', 'instance', 'wvars', null, null, docObject.DocID, teObject);
	if (_select_type=='manager' || _select_type=='user' || _select_type=='hr')
	{
		_phase_start = 'sel_resp_coll';
	}
	else
	{
		_phase_start = 'go_assessment';
	}
	_wDoc = tools.open_doc(teObject.workflow_id);
	if (_wDoc!=undefined)
	{
		if (_wDoc.TopElem.default_state != _phase_start)
		{
			_wDoc.TopElem.default_state = _phase_start;
			_wDoc.Save();
		}
	}
	
	if ( _select_type == 'hr' )
	{
		_part = teObject.participants.ObtainChildByKey( 'expert' );
		_part.customize.is_custom_experts = true;
		if ( teObject.person_id.HasValue )
		{
			_part.customize.experts.ObtainChildByKey( teObject.person_id );
		}
		_part.customize.additional_participants_code = " 
		try {
			if ( ArrayCount( personDoc.path_subs ) == 0 )
			{
				personDoc.filling_path_subs();
				_child = personDoc.path_subs.AddChild();
				_child.id = OptInt( personDoc.org_id, 0);
			}
			
			for ( _eee in XQuery( \"for $elem in func_managers where MatchSome($elem/object_id,(\" + ArrayMerge( personDoc.path_subs, \"OptInt( This.id )\", \",\" ) + \")) return $elem/Fields('person_id')\" ) )
			{
				MASTERS_PACK.push(_eee.person_id);
			}
		} catch(_err_) {alert('ERROR CODE EXPERT = ' + _err_)}
		";
		docObject.Save();
	}
	
	_parts = ArraySelect( teObject.participants, "This.customize.is_custom_experts == false" );
	
	if (sAuditorys!="")
	{
		if ( _type == 'type' )
		{
			_profile_user_id = OptInt( tools_app.get_cur_settings( 'profile_user_id', 'instance', 'wvars', null, null, docObject.DocID, teObject), 0);
			_profile_manager_id = OptInt( tools_app.get_cur_settings( 'profile_manager_id', 'instance', 'wvars', null, null, docObject.DocID, teObject), 0);
			aAudArray = sAuditorys.split(",");
			sAuditorysMan = "";
			sAuditorysSlf = "";
			aManArray = [];
			iAudCount = ArrayCount(aAudArray);
			for (_im = 0; _im < iAudCount; _im++)
			{
				sAuditorysSlf += ( sAuditorysSlf != "" ? ( "," + aAudArray[_im] ) : ( aAudArray[_im] ) );
				if ( _im >= iMaxCount || _im == (iAudCount-1) )
				{
					aManArray = ArraySelectAll( XQuery("for $elem in func_managers where $elem/is_native = true() and MatchSome($elem/person_id,(" + sAuditorysSlf + ")) return $elem/Fields('person_id')") );
					sAuditorysMan = ArrayMerge( aManArray, "This.person_id", "," );
					if ( sAuditorysMan != "" )
					{
						for ( oManElem in aManArray )
						{
							sAuditorysSlf = StrReplace( sAuditorysSlf, "" + oManElem.person_id, "" );
						}
						while ( sAuditorysSlf.indexOf(",,") >= 0 )
						{
							sAuditorysSlf = StrReplace( sAuditorysSlf, ",,", "," );
						}
					}
					if ( sAuditorysSlf != "" && sAuditorysSlf != "," && _profile_user_id > 0 )
					{
						for ( _part in _parts )
						{
							_aat = _part.assessment_appraise_types.ObtainChildByKey('competence_appraisal');
							_aat.competence_profile_id = _profile_user_id;
						}
						docObject.Save();
						CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorysSlf ] );
					}
					if ( sAuditorysMan != "" && sAuditorysMan != "," && _profile_manager_id > 0 )
					{
						for ( _part in _parts )
						{
							_aat = _part.assessment_appraise_types.ObtainChildByKey('competence_appraisal');
							_aat.competence_profile_id = _profile_manager_id;
						}
						docObject.Save();
						CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorysMan ] );
					}
					sAuditorysMan = "";
					sAuditorysSlf = "";
				}
			}
		}
		else
		{
			CallServerMethod( 'tools_ass', 'generate_assessment_plan', [docObject.DocID, false, true, false, null, null, null, sAuditorys ] );
		}
		if (_select_type != "none" && _select_type_generate != "full")
		{
			if (_select_type_generate == "manager")
			{
				for (_asspa in ArraySelectAll(XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " and MatchSome($obj/person_id,("+sAuditorys+")) and $obj/status != 'manager' and $obj/status != 'self' return $obj/Fields('id')")))
				{
					DeleteDoc(UrlFromDocID(_asspa.id), true);
				}
			}
			else if (_select_type_generate == "none")
			{
				for (_asspa in ArraySelectAll(XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " and MatchSome($obj/person_id,("+sAuditorys+")) and $obj/status != 'self' return $obj/Fields('id')")))
				{
					DeleteDoc(UrlFromDocID(_asspa.id), true);
				}
			}
		}
		if (tools_web.is_true(_dlg.wvars.ObtainChildByKey('mail_send').value))
		{
			if (_select_type=='user')
			{
				_mail_tmpl = 'websoft360_start_assessment_person';
			}
			else if (_select_type=='manager')
			{
				_mail_tmpl = 'websoft360_start_assessment_manager';
			}
			else if (_select_type=='hr')
			{
				_mail_tmpl = 'websoft360_start_assessment_hr';
			}
			else
			{
				_mail_tmpl = 'websoft360_start_assessment_participant';
			}
			if (_phase_start == 'go_assessment')
			{
				for (_asspa in XQuery("for $obj in pas where $obj/assessment_appraise_id=" + docObject.DocID + " and MatchSome($obj/person_id,("+sAuditorys+")) return $obj/Fields('id')"))
				{
					tools.create_notification(_mail_tmpl, _asspa.id.Value, "", docObject.DocID);
				}
			}
			else
			{
				for (_assplan in XQuery("for $obj in assessment_plans where $obj/assessment_appraise_id=" + docObject.DocID + " and MatchSome($obj/person_id,("+sAuditorys+")) return $obj/Fields('id')"))
				{
					tools.create_notification(_mail_tmpl, _assplan.id.Value, "", docObject.DocID);
				}
			}
		}
		docObject.TopElem.auditorys.Clear();
	}
}

function LoadIdsFromFile( _file_name )
{
	return "";
}


function getUserInfo(person_id)
{
	var oPerson = ArrayOptFirstElem(tools.xquery("for $elem in collaborators where $elem/id =  " + person_id + " return $elem/fullname, $elem/position_name, $elem/position_parent_name"));
	
	if(oPerson == undefined)
		return "";
	
	var sSubPath = tools.person_list_staff_by_person_id(person_id, null, 0, 1, "&nbsp;<b>--></b>&nbsp;");
	
	var oBoss = tools.get_uni_user_boss(person_id);
	sBossFullname = oBoss == undefined ? "" : ", Руководитель: " + oBoss.fullname;
	
	return sSubPath + ", Должность: " + oPerson.position_name + sBossFullname;
}

function fnGetWVarsConfig(curAssessmentAppraiseID, curAssessmentAppraise)
{
	return tools_app.get_cur_settings( null, 'instance', 'wvars', null, null, curAssessmentAppraiseID, curAssessmentAppraise);
}

function fnSetWorkwlowStatePanel(curPA, arrApproverCodes, oWFStatesTitle, curWorkflow)
{
	var constArrResp = [
		{id:"sel_resp_coll", "name":""}
	];
	var constArrAppr = [
		{id:"go_assessment", "name":""},
		{id:"end_assessment", "name":""}
	];
	
	var iRespSelLength = arrApproverCodes.length;
	var bFnHasApprover = (iRespSelLength > 0) || ArrayOptFind( oWFStatesTitle, "This.state == 'sel_resp_coll'");
	for(i=1; i <= iRespSelLength; i++)
	{
		constArrResp.push({id:String(i)+"_approve", "name":""});
	}
	arrShowWFStates = bFnHasApprover ? ArrayUnion(constArrResp, constArrAppr) : constArrAppr;
	
	var arrStates = [];
	var sCurState;
	for( oState in curWorkflow.states )
	{
		sCurState = oState.code.Value;
		oShowWFState = ArrayOptFind( arrShowWFStates, "This.id == '" + sCurState + "'" );
		if( oShowWFState != undefined )
		{
			sCurStateTitle = ArrayOptFind(oWFStatesTitle, "This.state == " + CodeLiteral(sCurState));
			oNewState = {
				id: sCurState,
				name: (sCurStateTitle == undefined ? oState.name.Value : sCurStateTitle.title),
				title: (sCurStateTitle == undefined ? oState.name.Value : sCurStateTitle.title)
			};
			
			arrStates.push( oNewState );
		}
	}
	
	return arrStates;
}

function TemplateCode_1( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow )
{

	var oCheckObject;
	sMarkType = "ind";
	sViewType = "tile";
	bUseFullSave = false;
	bRespSel = false;

	try
	{
		STATUS = oData.data.status;
		var xRespWVars = fnGetWVarsConfig(curAssessmentAppraiseID, curAssessmentAppraise);
		oCheckObject = xRespWVars.GetOptChildByKey( "score_type", "name" );
		if( oCheckObject == undefined )
			throw "В настройках оценки для вида оценки [" + STATUS + "] отсутстствует параметр [sMarkType]";
		sMarkType = oCheckObject.value.Value;
		
		oCheckObject = xRespWVars.GetOptChildByKey( "form_type", "name" );
		if( oCheckObject == undefined )
			throw "В настройках оценки для вида оценки [" + STATUS + "] отсутстствует параметр [sViewType]";
		sViewType = oCheckObject.value.Value;

		
		oCheckObject = xRespWVars.GetOptChildByKey( "full_save", "name" );
		if( oCheckObject == undefined )
			throw "В настройках оценки для вида оценки [" + STATUS + "] отсутстствует параметр [bUseFullSave]";
		bUseFullSave = tools_web.is_true( oCheckObject.value.Value );

		bRespSel = false;

		oCheckObject = xRespWVars.GetOptChildByKey( "select_type", "name" );
	//	if( oCheckObject == undefined )
	//		throw "В настройках оценки для самооценки отсутстствует параметр [arrApprovers]";
		bRespSel = ( oCheckObject!=undefined && oCheckObject.value != null && Trim(oCheckObject.value.Value) != "none" );
		var arrApproverCodes = []; //oCheckObject!=undefined && oCheckObject.value.Value != "" ? oCheckObject.value.Value.split(";") : [];
		oCheckObject = xRespWVars.GetOptChildByKey( "select_type", "name" );
		if ( oCheckObject=undefined || Trim(oCheckObject.value.Value) != "none" )
		{
			oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
			if ( oCheckObject=undefined || !tools_web.is_true(oCheckObject.value.Value) )
			{
				oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_manager", "name" );
				if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
				{
					arrApproverCodes.push( "main" );
				}
				oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_func_manager", "name" );
				if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
				{
					arrApproverCodes.push( "func" );
				}
				oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_hr", "name" );
				if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
				{
					arrApproverCodes.push( "hr" );
				}
			}
		}

		oCheckObject = xRespWVars.GetOptChildByKey( "oStateTitles", "name" );
	//	if(oCheckObject == undefined)
	//		throw "В настройках оценки для самооценки отсутствует параметр [oStateTitles] (наименования этапов оценки)";
		var oWFStatesTitle = (oCheckObject!=undefined && oCheckObject.value.Value != "") ? ParseJson(oCheckObject.value.Value) : [{"state":"1_approve","title":"Согласование непосредственным руководителем"},{"state":"2_approve","title":"Согласование функциональным руководителем"},{"state":"3_approve","title":"Согласование ответственным за оценку"}];

		oCheckObject = xRespWVars.GetOptChildByKey( "overall_all", "name" );
		if( oCheckObject == undefined )
			throw "В настройках оценки для вида оценки [" + STATUS + "] отсутстствует параметр [sOverviewHideType]";
		sOverviewHideType = tools_web.is_true(oCheckObject.value.Value)?"show":"hide";
		
		oCheckObject = xRespWVars.GetOptChildByKey( "sPromptTitle", "name" );
		sPromptTitle = oCheckObject != undefined ? oCheckObject.value.Value : "";

		oCheckObject = xRespWVars.GetOptChildByKey( "sPromptText", "name" );
		sPromptText = oCheckObject != undefined ? Trim(oCheckObject.value.Value) : "";

		oCheckObject = xRespWVars.GetOptChildByKey( "bUseComment", "name" );
		bUseComment = oCheckObject != undefined ? tools_web.is_true( oCheckObject.value.Value ) : false;

		oCheckObject = xRespWVars.GetOptChildByKey( "bUseCompetenceComment", "name" );
		bUseCompetenceComment = oCheckObject != undefined ? tools_web.is_true( oCheckObject.value.Value ) : false;

		oCheckObject = xRespWVars.GetOptChildByKey( "bControlBelowTitle", "name" );
		bControlBelowTitle = oCheckObject != undefined ? tools_web.is_true( oCheckObject.value.Value ) : false;
		bControlBelowTitle = false

		oCheckObject = xRespWVars.GetOptChildByKey( "na_active_text", "name" );
		sNScaleTitle = oCheckObject != undefined ? oCheckObject.value.Value : "";
	}
	catch(err)
	{
		throw "Ошибка при считывании настроек: \n" + err;
	}

	switch(sOverviewHideType)
	{
		case "hide":
			oData.data.overall_view = "none";
			break;
		case "show":
			oData.data.overall_view = null;
			break;
		case "show_if_done":
			oData.data.overall_view =  oData.data.is_done ? null : "none";
			break;
	}

	var arrShowWFStates = bRespSel ? [ "sel_resp_coll", "first_approve", "second_approve", "go_assessment", "end_assessment" ] : ["go_assessment", "end_assessment" ];
	if ( bRespSel )
	{
		oWFStatesTitle.push( {"state":"sel_resp_coll","title":"Выбор респондентов"} );
	}


	var sButCommentName = "Добавить комментарий";

	oData.data.workflow_state = curPA.workflow_state;

	if( !oData.data.HasProperty("dataset") )
		oData.data.dataset = {};
	oData.data.dataset.workflow = { states: fnSetWorkwlowStatePanel(curPA, arrApproverCodes, oWFStatesTitle, curWorkflow) };


	oData.data.custom_experts = null;
	oData.data.expert.title = "Оценивающий:";
	oData.data.person.header = "Оцениваемый:";
	oData.data.expert.header = "Оценивающий:";

	if(sNScaleTitle != "")
		oData.data.n_name = sNScaleTitle;

	if( bUseComment )
	{
		if( ArrayOptFind(curPA.custom_comments, "This.person_id == curPersonID && This.workflow_state == curPA.workflow_state") != undefined )
		{
			sButCommentName = "Изменить комментарий";
		}
		
		oData.data.wfparameters = new Object();
		
		oBtnCmnt = {
			action: "comment",
			visible: true,
			title: sButCommentName,
			position: "bottom"
		};
		
		oData.data.wfparameters.buttons = []
		oData.data.wfparameters.buttons.push( oBtnCmnt );
	}
	else
	{
		oData.data.custom_comments = null;
	}

	oData.data.view_type = sViewType;
	if( sPromptText != "" )
	{
		oData.data.wfcomment_title = sPromptTitle;
		oData.data.wfcomment = sPromptText;
	}

	oData.data.config = {}

	oData.data.config.btn_iframe = [
		{"id":"sel_resp","visible":false}
	];

	if( bUseFullSave )
	{
		oData.data.config.full_save = true;
		oData.data.config.full_save_mask = true;
		oData.data.config.full_save_btn_text = "Сохранить";
		oData.data.config.full_save_btn_position = "both";
	}

	oData.data.config.assessment_title = "Предоставление обратной связи для \"" + oData.data.person.fullname + "\"";
	oData.data.config.welcome_string = getUserInfo(oData.data.person.id);

	//oData.data.competence_blocks = [{competnce_block_id: "prof", name: "Профессиональные"}]

	if( oData.data.HasProperty( "competences" ) )
	for( oComp in oData.data.competences )
	{
		oComp.competnce_block_id = "prof";
		//oComp.control_below_title = true;
		if (sMarkType == "comp")
		{
			oComp.indicators = [];
			oComp.control_below_title = bControlBelowTitle;
			oComp.control_type = "radio-col-left";
		}
		else if( oComp.HasProperty( "indicators" ) )
		{
			for( oInd in oComp.indicators )
			{
				/*if( oInd.HasProperty( "scale" ) )
				{
					// alert( "--- +++ ---" );
					// alert( EncodeJson( oInd ) );
					// alert( "--- --- ---" );
					for (_s in oInd.scale)
						_s.desc = "Description"
				}*/
				oInd.has_comment = bUseCompetenceComment;
				oInd.control_below_title = bControlBelowTitle;
				oInd.control_type = "radio-col-left";
			}
		}
		oComp.has_comment = bUseCompetenceComment;
	}
}

function TemplateCode_2( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow )
{

	EnableLog("resp");
	var xRespWVars = fnGetWVarsConfig(curAssessmentAppraiseID, curAssessmentAppraise);

	_in_time = (curAssessmentAppraise.status == '0');
	
	if (curPA != undefined && curPA.start_date.HasValue)
		_dStartDate = curPA.start_date;
	else if (curAssessmentAppraise.start_date.HasValue)
		_dStartDate = curAssessmentAppraise.start_date;
	else _dStartDate = null;

	if (curPA != undefined && curPA.end_date.HasValue)
		_dEndDate = curPA.end_date;
	else if (curAssessmentAppraise.end_date.HasValue)
		_dEndDate = curAssessmentAppraise.end_date;
	else _dEndDate = null;
	
	if (_dStartDate != null && DateNewTime(_dStartDate) > DateNewTime(Date()))
	{
		_in_time = false;
	}
	
	if (_in_time && _dEndDate != null && DateNewTime(_dEndDate) < DateNewTime(Date()))
	{
		_in_time = false;
	}											  
	bRespSel = false;
	oCheckObject = xRespWVars.GetOptChildByKey( "select_type", "name" );
	bHasSel = ( oCheckObject!=undefined && oCheckObject.value != null && Trim(oCheckObject.value.Value) != "none" );
	bRespSel = ( oCheckObject!=undefined && oCheckObject.value != null && Trim(oCheckObject.value.Value) != "none" ); 
	sRespType = ( oCheckObject!=undefined && oCheckObject.value != null ? Trim(oCheckObject.value.Value) : "user" ); 
	if ( sRespType == "user" && curPersonID != curPA.person_id.Value )
	{
		bRespSel = false;
	}
	if ( sRespType == "manager" && curPersonID != curPA.boss_id.Value )
	{
		bRespSel = false;
	}
	if ( sRespType == "hr" && ArrayOptFind( curPA.custom_experts, "This.person_id == " + curPersonID ) == undefined && curAssessmentAppraise.person_id.Value != curPersonID )
	{
		bRespSel = false;
	}
	var arrApproverCodes = []; //oCheckObject!=undefined && oCheckObject.value.Value != "" ? oCheckObject.value.Value.split(";") : [];
	oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
	if ( oCheckObject==undefined || !tools_web.is_true(oCheckObject.value.Value) )
	{
		oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_manager", "name" );
		if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
		{
			arrApproverCodes.push( "main" );
		}
		oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_func_manager", "name" );
		if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
		{
			arrApproverCodes.push( "func" );
		}
		oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_hr", "name" );
		if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
		{
			arrApproverCodes.push( "hr" );
		}
	}
	xaml_sel_resp_template_id = OptInt( tools_app.get_cur_settings( 'objects.resp_sel_dlg', 'app', '', null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0);

	oCheckObject = xRespWVars.GetOptChildByKey( "oStateTitles", "name" );
	//	if(oCheckObject == undefined)
	//		throw "В настройках оценки для самооценки отсутствует параметр [oStateTitles] (наименования этапов оценки)";
	var oWFStatesTitle = (oCheckObject!=undefined && oCheckObject.value.Value != "") ? ParseJson(oCheckObject.value.Value) : [{"state":"1_approve","title":"Согласование непосредственным руководителем"},{"state":"2_approve","title":"Согласование функциональным руководителем"},{"state":"3_approve","title":"Согласование ответственным за оценку"}];
	if ( bHasSel )
	{
		oWFStatesTitle.push( {"state":"sel_resp_coll","title":"Выбор респондентов"} );
	}


	if( !oData.data.HasProperty("dataset") )
		oData.data.dataset = {};
	oData.data.dataset.workflow = { states: fnSetWorkwlowStatePanel(curPA, arrApproverCodes, oWFStatesTitle, curWorkflow) };

	oData.data.wfparameters = new Object();
	oData.data.wfparameters.buttons = [];

	if( StrContains( curPA.workflow_state, "sel_resp_" ) )
	{
		if( ArrayOptFirstElem( curPA.custom_experts ) == undefined )
		{
			oData.data.custom_comments = null;
		}
	}
	else if( StrContains( curPA.workflow_state, "_approve" ) && _in_time )
	{
		oBtnCmnt = {
			action: "comment",
			visible: true,
			title: "Добавить комментарий",
			position: "bottom"
		};
		
		if( ArrayOptFind(curPA.custom_comments, "This.person_id == curPersonID && This.workflow_state == curPA.workflow_state") != undefined )
		{
			oBtnCmnt.title = "Изменить комментарий";
		}
		
		if( curPA.person_id != curPersonID)
		{
			oData.data.wfparameters.buttons.push( oBtnCmnt );
		}
	}

	oData.data.workflow_state = curPA.workflow_state;

	if( !oData.data.HasProperty("dataset") )
		oData.data.dataset = {};

	//oData.data.editset = [{required: false,editable: false,visible: false}];

	oData.data.custom_experts = null;
	//oData.data.boss = null;
	oData.data.expert.title = "Оценивающий:";
	oData.data.person.header = "Оцениваемый:";
	oData.data.expert.header = "Оценивающий:";

	oTabsel = curPA.custom_elems.GetOptChildByKey( "hid_resp_coll" );

	if( oTabsel != undefined )
	{
		oTabsel = tools.read_object( oTabsel.value );
	}


	bMinMaxIsStrict = tools_web.is_true( xRespWVars.ObtainChildByKey( "bMinMaxIsStrict" ).value );
	sPromptTitle = String( xRespWVars.ObtainChildByKey( "sPromptTitle", "name" ).value );
	sPromptText = String( xRespWVars.ObtainChildByKey( "sPromptText", "name" ).value );

	if( sPromptText != "" )
	{
		oData.data.wfcomment_title = sPromptTitle;
		oData.data.wfcomment = sPromptText;
	}
	else 
		oData.data.wfcomment = null;
	/*
	if(!StrContains(curPA.workflow_state, "sel_resp_"))
	{
		oBtnIframe = 
		{
			"btn_iframe": [{
				"id": "sel_resp",
				"visible": false
			}]
		}
		
		oData.data.config = oBtnIframe;
	}
	else
	*/
		oData.data.config = {};

	oData.data.config.assessment_title = "Предоставление обратной связи для \"" + oData.data.person.fullname + "\"";
	oData.data.config.welcome_string = getUserInfo(oData.data.person.id);

	sButtonUrl = (xaml_sel_resp_template_id > 0) ? "/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=" + xaml_sel_resp_template_id : "/custom_web_template.html?object_code=websoft360_app_resp_sel_dlg"


	if (_in_time && bRespSel)
	{
		oData.data.wfparameters.buttons.push(
				{
					"action": "iframe",
					"target": "iframe",
					"id": "sel_resp",
					"title": "Изменить список респондентов",
					"position": "bottom",
					"url": UrlEncode(sButtonUrl + "&person_id=" + oData.data.person.id + "&ap_id=" + curAssessmentAppraise.Doc.DocID + "&editable=" + oData.data.editable),
					"title_close_action": "reload_pa",
					"dialog_title": "Выбор респондентов для \"" + oData.data.person.fullname + "\"",
					"iframe_width": 90,
					"iframe_height": 100,
					"hide_close_action":true,
					"class": "XAML_sel_resp_button",
					"dialog_buttons": [{action:"reload_all","title":"Отмена"}]
				}
			);
	}



	if(oData.data.is_done && oData.data.HasProperty("wfbuttons") && _in_time)
	{
		var oApproveAction = ArrayOptFind(oData.data.wfbuttons, "StrEnds(This.code, 'approve')");
		if(oApproveAction != undefined)
		{
			oData.data.msg = {
				type: "confirm",	
				title: "На согласование",
				text: "Список респондентов заполнен корректно. " + oApproveAction.title + "?",
				action: {
					type: "workflow",
					id: oApproveAction.code
				}
					
					
				   
	  
			};
			if ( bRespSel )
			{
				oData.data.msg.cancel_action = { type: "iframe", id: "sel_resp" };
			}
		}
	}
	else if (_in_time && curPA.workflow_state == "sel_resp_coll" && bRespSel)
	{
		oData.data.msg = {
			type: "action",	
			//title: "Test",
			//text: "Testestest",
			action: {
				type: "iframe",
				id: "sel_resp"
			}
		};
	}
	else if (!_in_time)
	{
		oData.data.msg = "Сроки проведения процедуры истекли";
	}
	else if (!bRespSel)
	{
		oData.data.msg = "Идет выбор респондентов.<br/>Процесс оценки начнется после окончания этапа выбора и согласования списка респондентов.";
	}
}

function TemplateCode_3( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow, xmlPartData )
{
	//---------------------------------------------------------------------------------------------------------------------------------------------------------
	// автор:	Sergey Leonov
	// создан: 	15.05.2019
	// изменен: 
	// ----------------------------------------------------------------Описание-----------------------------------------------------------------------------
	// Опрос 360 Компетенции POST
	// Вычисление валидности анкеты
	// -----------------------------------------------------------Предупреждение-------------------------------------------------------------------------
	// нет
	// -----------------------------------------------------------Параметры отчета------------------------------------------------------------------------
	// нет
	//---------------------------------------------------------------------------------------------------------------------------------------------------------

	var IND_COUNT = 0;
	var COMP_COUNT = 0;
	var NA_COUNT = 0;
	var IND_PERCENT = 0;
	var COMP_PERCENT = 0;
	var NA_PERCENT = 0;

	var iCompCountAll = 0;
	var iIndCountAll = 0;
	var bIsDone = true;
	var bIsValid = true;

	var bDoValidatePA = tools_web.is_true( tools_app.get_cur_settings( "bDoValidatePA", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ) );
	var sDoValidateFormula = tools_app.get_cur_settings( "sDoValidateFormula", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise );
	var bDoValidateDone = tools_web.is_true( tools_app.get_cur_settings( "bDoValidateDone", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ) );
	var bInd = tools_app.get_cur_settings( "score_type", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ) != "comp";
	

	for( oCompElem in curPA.competences )
	{
		iCompCountAll++;
		
		if( oCompElem.mark.HasValue )
		{
			COMP_COUNT++;
		}
		else if( !bInd || ArrayCount( oCompElem.indicators ) == 0 )
		{
			bIsDone = false;
			break;
		}
		
		if( bInd )
		{
			for( oIndElem in oCompElem.indicators )
			{
				iIndCountAll++;
				
				if( oIndElem.mark.HasValue )
				{
					IND_COUNT++;
					
					if ( oIndElem.mark == "N" )
					{
						NA_COUNT++;
					}
				}
				else
				{
					bIsDone = false;
					break;
				}
			}
		}
		
		if( !bIsDone )
		{
			break;
		}
	}

	if( bIsDone )
	{
		if( iIndCountAll != 0 )
		{
			if( IND_COUNT != 0 )
			{
				IND_PERCENT = 100 * ( Real( IND_COUNT ) / Real( iIndCountAll ) );
			}
			
			if( NA_COUNT != 0 )
			{
				NA_PERCENT = 100 * ( Real( NA_COUNT ) / Real( iIndCountAll ) );
			}
		}
		
		if( iCompCountAll != 0 && COMP_COUNT != 0 )
		{
			COMP_PERCENT = 100 * ( Real( COMP_COUNT ) / Real( iCompCountAll ) );
		}
		
		if( sDoValidateFormula != "" )
		{
			try
			{
				bIsValid = tools_web.is_true( tools.safe_execution( sDoValidateFormula ) );
				curPA.custom_elems.ObtainChildByKey("pa_no_valid").value = bDoValidatePA ? !bIsValid: false;
				if ( bDoValidateDone )
				{
					bIsDone = bIsValid;
				}
			}
			catch( err )
			{
				alert( "Ошибка в формуле расчёта валидности: " + err );
				bIsDone = false;
			}
		}
	}

	curPA.is_done = bIsDone;
}

function TemplateCode_4( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow, xmlPartData )
{
	
}

function TemplateCode_5( oData, curAssessmentAppraise, curAssessmentAppraiseID, curPersonID ) // Template Tree
{
	if ( OptInt( curPersonID, 0 ) == 0 )
	{
		return false;
	}
	
	//---------------------------------------------------------------------------------------------------------------------------------------------------------
	// автор:	Sergey Leonov
	// создан: 	15.05.2018
	// изменен: 
	// ----------------------------------------------------------------Описание-----------------------------------------------------------------------------
	// Дерево Опроса 360
	// -----------------------------------------------------------Предупреждение-------------------------------------------------------------------------
	// нет
	// -----------------------------------------------------------Параметры отчета------------------------------------------------------------------------
	// нет
	//---------------------------------------------------------------------------------------------------------------------------------------------------------

	// Изменение: Автор: Boris Gordon, Дата: 27.09.2019

	function getConfigWVars()
	{
		return tools_app.get_cur_settings( null, 'instance', 'wvars', null, null, curAssessmentAppraiseID, curAssessmentAppraise );
		var oAAPTemplateConfig = {};
		// Получение типа оценки "Самооценка"
		var oPartSelf = curAssessmentAppraise.participants.GetOptChildByKey( "self", "participant_id" );
		if( oPartSelf == undefined )
		{
			throw "Ошибка настройки процедуры оценки. --- В процедуре с ID " + iAapID + " не указана самооценка." ;
		}
		
		// Получение параметров работы шаблона
		oTypeResult = oPartSelf.assessment_appraise_types.GetOptChildByKey( "result", "assessment_appraise_type_id" );
		if( oTypeResult == undefined )
		{
			throw "Ошибка настройки процедуры оценки. --- В процедуре с ID " + iAapID + " не указана общая оценка для самооценки.\n";
		}
		
		 return oTypeResult.wvars;
	}

	try
	{
		xaml_sel_resp_template_id = OptInt( tools_app.get_cur_settings( 'objects.resp_sel_dlg', 'app', '', null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0);
		material_template_id = OptInt( tools_app.get_cur_settings( 'objects.materials', 'app', '', null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0);
		capability_id =  OptInt( tools_app.get_cur_settings( 'objects.capability_operation', 'app', '', null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0);
		var strReq1 = "for $bt in boss_types, $fm in func_managers where $fm/boss_type_id=$bt/id and contains($bt/operations, '" + capability_id + "') and $fm/person_id=" + curPersonID + " return $fm";
		var strReq3 = "for $bt in boss_types where contains($bt/operations, '" + capability_id + "') return $bt";
		var strReq4 = "for $fm in func_managers where $fm/person_id=" + curPersonID + " and $fm/is_native = true() return $fm";
		var strReq5 = "for $fm in func_managers where $fm/person_id=" + curPersonID + " return $fm";
		var bHasBossCapability = ArrayOptFirstElem(tools.xquery(strReq1)) != undefined || ( ArrayOptFirstElem(tools.xquery(strReq3)) == undefined && ArrayOptFirstElem(tools.xquery(strReq4)) != undefined );
		var bHasHRCapability = ArrayOptFirstElem(tools.xquery(strReq5)) != undefined;
		var strReq2 = "for $elem in assessment_plans where $elem/person_id=" + curPersonID + " and $elem/assessment_appraise_id=" + curAssessmentAppraiseID + " return $elem";
		var bMissedAssessmentPlan = ArrayOptFirstElem(tools.xquery(strReq2)) == undefined;

		var xRespWVars = getConfigWVars();
		var wvarConfig = tools.wvars_to_object( xRespWVars );
		curWorkflow = tools.open_doc( curAssessmentAppraise.workflow_id ).TopElem;

		sButtonUrl = (xaml_sel_resp_template_id > 0) ? "/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=" + xaml_sel_resp_template_id : "custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=6798507539072865852";

		var oButtonItem = {};

		oConfig = {
			"btn_objectives": false,
			"btn_logs": false,
			"btn_iframe": false,
			"sTreeLoadMethod": "before",
			"buttons": [
						{
							"action": "iframe",
							"id": "sel_resp",
							"title": "Выбрать респондентов",
							"url": UrlEncode( sButtonUrl + "&person_id=" + curPersonID + "&ap_id=" + curAssessmentAppraiseID ),
							"title_close_action": "reload_pa",
							"dialog_title": "Выбор респондентов",
							"iframe_width": 90,
							"iframe_height": 100,
							"visible": false
						},
						]
		};


		if(tools_web.is_true(wvarConfig.GetOptProperty("request_show_button", false)) && OptInt(wvarConfig.GetOptProperty("request_type_id"), 0)>0 && ( ( bHasBossCapability && wvarConfig.GetOptProperty("request_type", "") == "manager" ) || ( bMissedAssessmentPlan && wvarConfig.GetOptProperty("request_type", "") == "user" ) ) )
		{
			var iRequestTypeID = OptInt(wvarConfig.GetOptProperty("request_type_id"), 0);
			oButtonItem = 	{
							"action": "iframe",
							"id": "call_request",
							"title": "Подать заявку",
							"url": UrlEncode("/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=5481109866077046168&request_type_id=" + iRequestTypeID + "&new=1&request_object_id=" + curAssessmentAppraiseID + "&doc_code=requests"),
							"title_close_action": "reload_all",
							"dialog_title": "Подача заявки",
							"iframe_width": 90,
							"iframe_height": 100,
							"visible": true
						}

			oConfig.buttons.push(oButtonItem);
		}
		else if ( tools_web.is_true( wvarConfig.GetOptProperty( "request_show_button", false ) ) && bHasHRCapability && wvarConfig.GetOptProperty("request_type", "") == "hr" )
		{
			var iRequestTypeID = OptInt(wvarConfig.GetOptProperty("request_type_id"), 0);
			oButtonItem = 	{
							"action": "iframe",
							"id": "call_request",
							"class": "call_request",
							"title": wvarConfig.GetOptProperty( "request_button_text", "Подать заявку" ),
							"url": UrlEncode("/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=5481109866077046168&request_type_id=" + iRequestTypeID + "&new=1&request_object_id=" + curAssessmentAppraiseID + "&doc_code=requests"),
							"title_close_action": "reload_all",
							"dialog_title": wvarConfig.GetOptProperty( "request_button_text", "Подать заявку" ),
							"iframe_width": 90,
							"iframe_height": 100,
							"visible": true
						}

			oConfig.buttons.push(oButtonItem);
		}

		
		if(tools_web.is_true(wvarConfig.GetOptProperty("buttons.help.is_view", false)) && OptInt(wvarConfig.GetOptProperty("buttons.help.document_id"), 0)>0 )
		{
			sButtonUrl = (material_template_id > 0) ? "/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=" + material_template_id : "/custom_web_template.html?object_code=websoft360_app_xaml_insert&xaml_id=6576714058923669854";
			var iDocumentID = OptInt(wvarConfig.GetOptProperty("buttons.help.document_id"), 0);
			oButtonItem = 	{
							"action": "iframe",
							"id": "help",
							"title": "Помощь и информация",
							"url": UrlEncode(sButtonUrl + "&doc_id=" + iDocumentID),
							"title_close_action": "none",
							"dialog_title": "Помощь и информация",
							"iframe_width": 90,
							"iframe_height": 100,
							"visible": true
						}

			oConfig.buttons.push(oButtonItem);
		}

		oData.config = oConfig;
		
		var arrApproverCodes = []; //oCheckObject!=undefined && oCheckObject.value.Value != "" ? oCheckObject.value.Value.split(";") : [];
		oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
		if ( oCheckObject=undefined || true )
		{
			oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_manager", "name" );
			if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
			{
				arrApproverCodes.push( "main" );
			}
			oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_func_manager", "name" );
			if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
			{
				arrApproverCodes.push( "func" );
			}
			oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow_hr", "name" );
			if ( oCheckObject!=undefined && oCheckObject.value != null && tools_web.is_true(Trim(oCheckObject.value.Value)) )
			{
				arrApproverCodes.push( "hr" );
			}
		}
		
		oCheckObject = xRespWVars.GetOptChildByKey( "oStateTitles", "name" );
		var oWFStatesTitle = (oCheckObject!=undefined && oCheckObject.value.Value != "") ? ParseJson(oCheckObject.value.Value) : [{"state":"1_approve","title":"Согласование непосредственным руководителем"},{"state":"2_approve","title":"Согласование функциональным руководителем"},{"state":"3_approve","title":"Согласование ответственным за оценку"}];
		
		oCheckObject = xRespWVars.GetOptChildByKey( "select_type", "name" );
		if ( oCheckObject!=undefined && oCheckObject.value.Value != "" && oCheckObject.value.Value != "none" )
		{
			oWFStatesTitle.push( {"state":"sel_resp_coll","title":"Выбор респондентов"} );
		}
		
		if( !oData.HasProperty("dataset") )
		{
			oData.dataset = {};
		}
		oData.dataset.workflow = { states: fnSetWorkwlowStatePanel(null, arrApproverCodes, oWFStatesTitle, curWorkflow) };

	}
	catch(err)
	{
		alert(err);
	}
}



function ArraySimpleSelectDistinctF(arr, fieldName)
{
	arr = ArraySort(arr, "This", "+");
	
	var result = [];
	
	var prevElem;
	
	for (elem in arr)
	{
		if (elem != prevElem)
		{
			result.push(elem);
			prevElem = elem;
		}
	}
	
	return result;
}

function ArraySelectDistinctF(arr, field)
{
	var fieldCode = field;
	
	var plainSearch = field == undefined || field == "This"
	
	if (!plainSearch)
	{
		fieldCode = "This."+field;
	}
	
	arr = ArraySort(arr, fieldCode, "+");
	
	var result = [];
	
	var prevElem;
	
	for (elem in arr)
	{
		if ((plainSearch && elem != prevElem) || (!plainSearch && (prevElem == undefined || eval('elem.'+field) != eval('prevElem.'+field))))
		{
			result.push(elem);
			prevElem = elem;
		}
	}
	
	//alert("ArraySelectDistinctF ArrayCount(arr): "+ArrayCount(arr))
	//alert("ArraySelectDistinctF ArrayCount(result): "+ArrayCount(result))
	
	return result;
}

function ArrayUnionF(array1, array2)
{
	for (elem in array2)
		array1.push(elem);
	
	return array1;
}

function getSubdivsWithParentsF(subdivIDs, fields)
{	
	var result = [];
	
	if (!IsArray(subdivIDs))
		subdivIDs = [subdivIDs];
	
	var xSubdivWithParents, xSubdiv;

	for (subdivID in subdivIDs)
	{	
		xSubdivWithParents = getSubdivWithParentsF(OptInt(subdivID), fields);
		
		result = ArrayUnionF(result, xSubdivWithParents);
		//for (xSubdiv in xSubdivWithParents)
		//	result.push(xSubdiv);
	}
	
	return result;
}


function getSubdivWithParentsF(subdivID, fields)
{
	try
	{
		xSUBDIVS_ALL
	}
	catch(_zzz)
	{
		xSUBDIVS_ALL = undefined;
	}
	if (xSUBDIVS_ALL == undefined)
		xSUBDIVS_ALL = ArraySelectAll(XQuery("for $elem in subdivisions order by $elem/id return $elem/Fields('id', 'name', 'parent_object_id')"));
	
	var xSubdiv = ArrayOptFindBySortedKey(xSUBDIVS_ALL, subdivID, 'id');	
	var upperSubdivs = [];
	
	if (xSubdiv == undefined)
		return [];
	
	if (xSubdiv.parent_object_id > 0)
		upperSubdivs = getSubdivWithParentsF(xSubdiv.parent_object_id, fields);
	
	return ArrayUnion(upperSubdivs, [xSubdiv]);
}


function getSubdivIDsWithParents(subdivIDs, fields)
{
	var result = [];
	
	if (!IsArray(subdivIDs))
		subdivIDs = [subdivIDs];

	for (subdivID in subdivIDs)
	{
		result = ArrayUnion(result, ArrayExtract(getSubdivWithParents(OptInt(subdivID), fields), "This.id"));
	}
	
	return result;
}

function getSubdivsWithParents(subdivIDs, fields)
{
	var result = [];
	
	if (!IsArray(subdivIDs))
		subdivIDs = [subdivIDs];

	for (subdivID in subdivIDs)
	{
		result = ArrayUnion(result, getSubdivWithParents(OptInt(subdivID), fields));
	}
	
	return result;
}

function getSubdivWithParents(subdivID, fields)
{
	var xSubdiv = getElemByID("subdivision", subdivID, fields);	
	var upperSubdivs = [];
	
	if (xSubdiv.id == 0)
		return [];
	
	if (xSubdiv.parent_object_id > 0)
		upperSubdivs = getSubdivWithParents(xSubdiv.parent_object_id, fields);
	
	return ArrayUnion(upperSubdivs, [xSubdiv]);
}


function getElemByID(catalog, id, fields)
{
	try
	{
		if (id == "" || id == 0)
			throw "Empty elem id!";
			
		var fieldsStr = '$elem';
		
		if (IsArray(fields))
			fieldsStr = ArrayMerge(fields, "'$elem/'+This", ',');
			
		var result = ArrayFirstElem(XQuery("for $elem in "+catalog+"s where $elem/id = "+XQueryLiteral(id)+" return "+fieldsStr));
		return result;
	}
	catch(e)
	{
		return {id: 0};
	}
}

function getSubdivHierarchyXQ(subdivID)
{
	var xSubdivs = XQuery("for $elem in subdivisions where $elem/id = "+subdivID+" return $elem");
	xSubdivs = ArrayUnion(xSubdivs, XQuery("CatalogHierSubset('subdivisions', "+subdivID+")"));
	return xSubdivs;
}

function subdivIsInGroup(subdivID, docSubdivGroup)
{
	return ArrayOptFind(docSubdivGroup.TopElem.subdivisions, "This.subdivision_id == subdivID") != undefined;
}

function strIsEmpty(str)
{
	return str == undefined || str == null || str == '';
}

function findDepartmentSubdivID(collSubdivID, departmentLevel, departmentCustomElemCode, departmentSubdivGroupID)
{
	departmentLevel = OptInt(departmentLevel);
	departmentSubdivGroupID = OptInt(departmentSubdivGroupID);
	
	var subdivIDs = getSubdivIDsWithParents( OptInt(collSubdivID) );
	var subdivID;
	
	//alert("subdivIDs: "+subdivIDs.join(', '));
	
	var xFuncManagers, xFuncManager;
	
	var departmentSubdivID;
	var docSubdiv, docSubdivGroup;
	
	if (departmentLevel > 0)
	{
		if (departmentLevel <= ArrayCount(subdivIDs))
			departmentSubdivID = subdivIDs[departmentLevel-1];
	}
	else 
	{
		var departmentFound = false;
		
		for (i = ArrayCount(subdivIDs)-1; i >= 0; i--)
		{
			subdivID = subdivIDs[i];
			
			if (!strIsEmpty(departmentCustomElemCode))
			{
				docSubdiv = tools.open_doc(subdivID);
				
				if (docSubdiv != undefined)
				{
					if (tools_web.is_true( docSubdiv.TopElem.custom_elems.ObtainChildByKey(departmentCustomElemCode).value) )
					{
						departmentSubdivID = subdivID;
						break;
					}
				}
			}
			else if (departmentSubdivGroupID > 0)
			{
				if (docSubdivGroup == undefined)
					docSubdivGroup = tools.open_doc(departmentSubdivGroupID);
				
				if (docSubdivGroup != undefined)
				{
					if (subdivIsInGroup(subdivID, docSubdivGroup))
					{
						departmentSubdivID = subdivID;
						break;
					}
				}
			}
		}
	}
	
	return departmentSubdivID;
}

function CheckApprove(curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow, curObject)
{
	var xRespWVars = tools_app.get_cur_settings( null, 'instance', 'wvars', null, null, curAssessmentAppraiseID, curAssessmentAppraise);
	
	oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
	if( oCheckObject != undefined )
	{
		if ( tools_web.is_true(oCheckObject.value.Value) )
		{
			sApprovers = "self";
		}
		else
		{
			_man = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_manager" ).value);
			_fun = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_func_manager" ).value);
			_exp = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_hr" ).value);
			if (_man || _fun)
			{
				if (_exp)
				{
					sApprovers = "nr_expert";
				}
				else
				{
					sApprovers = "nr";
				}
			}
			else if (_exp)
			{
				sApprovers = "expert";
			}
			else
			{
				sApprovers = "self";
			}
		}
	}
	else
	{
		sApprovers = "self";
	}
	
	arrApprovers = StrReplace(sApprovers,"nr","main").split("_");
	
	iCountApprovers = String(ArrayCount(arrApprovers));
	arrState = String(curObject.workflow_state+"_").split('_');
	bIsApproveState = (arrState[1] == 'approve');
	iCurNumApproveState = ((arrState[1] == 'approve') ? arrState[0] : undefined);
	return (bIsApproveState && iCurNumApproveState < iCountApprovers && ArrayOptFind(curObject.custom_experts, 'This.person_id == curPersonID && This.person_type == ' + iCurNumApproveState) != undefined)
}

function CheckGoAssessment(curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow, curObject)
{
	var xRespWVars = tools_app.get_cur_settings( null, 'instance', 'wvars', null, null, curAssessmentAppraiseID, curAssessmentAppraise);
	
	oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
	if( oCheckObject != undefined )
	{
		if ( tools_web.is_true( oCheckObject.value ) )
		{
			sApprovers = "self";
		}
		else
		{
			_man = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_manager" ).value);
			_fun = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_func_manager" ).value);
			_exp = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_hr" ).value);
			if (_man || _fun)
			{
				if (_exp)
				{
					sApprovers = "nr_expert";
				}
				else
				{
					sApprovers = "nr";
				}
			}
			else if (_exp)
			{
				sApprovers = "expert";
			}
			else
			{
				sApprovers = "self";
			}
		}
	}
	else
	{
		sApprovers = "self";
	}
	
	arrApprovers = StrReplace(sApprovers,"nr","main").split("_");
	
	iCountApprovers = String(ArrayCount(arrApprovers));
	return ( (StrBegins( curObject.workflow_state, "sel_resp_coll" ) && sApprovers == "self" && curObject.is_done) || (StrBegins( curObject.workflow_state, iCountApprovers + "_approve" ) && ArrayOptFind(curObject.custom_experts, "This.person_id == curPersonID && This.person_type == " + iCountApprovers) != undefined) || (StrBegins( curObject.workflow_state, "sel_resp_coll" ) && ArrayOptFirstElem( ArraySelect( curObject.custom_experts, "This.person_id != curPersonID") ) == undefined && curObject.is_done))
}

function CheckGoApprove(curAssessmentAppraise, curAssessmentAppraiseID, curPersonID, curPA, curWorkflow, curObject)
{
	var xRespWVars = tools_app.get_cur_settings( null, 'instance', 'wvars', null, null, curAssessmentAppraiseID, curAssessmentAppraise);
	
	oCheckObject = xRespWVars.GetOptChildByKey( "select_workflow", "name" );
	oSelectObject = xRespWVars.GetOptChildByKey( "select_type", "name" );
	if ( oSelectObject != undefined )
	{
		sSelectType = String(oSelectObject.value);
	}
	else
	{
		sSelectType = "none";
	}
	bIsCurrent =  (( sSelectType == "user" && curPersonID == curObject.person_id ) || ( sSelectType == "manager" && curPersonID == curObject.boss_id ) || ( sSelectType == "hr" && ArrayOptFind(curObject.custom_experts, "This.person_id == curPersonID") != undefined ));
	
	if( oCheckObject != undefined )
	{
		if (tools_web.is_true(oCheckObject.value.Value))
		{
			sApprovers = "self";
		}
		else
		{
			_man = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_manager" ).value);
			_fun = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_func_manager" ).value);
			_exp = tools_web.is_true(xRespWVars.ObtainChildByKey( "select_workflow_hr" ).value);
			if (_man || _fun)
			{
				if (_exp)
				{
					sApprovers = "nr_expert";
				}
				else
				{
					sApprovers = "nr";
				}
			}
			else if (_exp)
			{
				sApprovers = "expert";
			}
			else
			{
				sApprovers = "self";
			}
		}
	}
	else
	{
		sApprovers = "self";
	}
	
	arrApprovers = StrReplace(sApprovers,"nr","main").split("_");
	
	iCountApprovers = String(ArrayCount(arrApprovers));
	
	return ( bIsCurrent && sApprovers != "self" && curObject.assessment_appraise_type == "result" && StrBegins( curObject.workflow_state, "sel_resp_coll" ) && ArrayOptFirstElem( ArraySelect( curObject.custom_experts, "This.person_id != curPersonID") ) != undefined && curObject.is_done );
}

function fnCreatePA(oStatus, iAssessmentPlanID, iExpertID, sWorkflowStatus)
{
	try
	{
		curPlan = tools.open_doc(iAssessmentPlanID).TopElem;
		
		var curAssessmentAppraiseID = curPlan.assessment_appraise_id
		var curAssessmentAppraise = tools.open_doc(curAssessmentAppraiseID).TopElem
		
		var sProfileType = tools_web.is_true( tools_app.get_cur_settings( "profile_type", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ) );

		oPart = curAssessmentAppraise.participants.GetOptChildByKey(oStatus.participant);
		if(oPart != undefined)
		{

			oCompetenceAppraise = oPart.assessment_appraise_types.GetOptChildByKey("competence_appraisal", "assessment_appraise_type_id")
			if (sProfileType == 'one')
			{
				iCompetenceProfileID = OptInt( tools_app.get_cur_settings( "profile_user_id", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0 );
			}
			else if (sProfileType == 'type')
			{
				bIsMan = ArrayOptFirstElem( XQuery("for $elem in func_managers where $elem/is_native = true() and $elem/person_id = " + curPlan.person_id + " return $elem/Fields('person_id')") );
				if (bIsMan)
				{
					iCompetenceProfileID = OptInt( tools_app.get_cur_settings( "profile_manager_id", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0 );
				}
				else
				{
					iCompetenceProfileID = OptInt( tools_app.get_cur_settings( "profile_user_id", "instance", "", null, null, curAssessmentAppraiseID, curAssessmentAppraise ), 0 );
				}
			}
			else
			{
				iCompetenceProfileID = oCompetenceAppraise != undefined ? OptInt(oCompetenceAppraise.competence_profile_id, 0) : 0;
			}
			if(iCompetenceProfileID == 0 )
			{
				iCompetenceProfileID = OptInt(ArrayOptFirstElem(tools.xquery("for $p in positions, $c in collaborators where $p/id = $c/position_id and $c/id = " + curPlan.person_id + " return $p/Fields('competence_profile_id')"), {competence_profile_id : 0}).competence_profile_id, 0);
			}
			
			try
			{
				teCompetenceProfile = OpenDoc(UrlFromDocID(iCompetenceProfileID)).TopElem;
			}
			catch(e)
			{
				teCompetenceProfile = null;
				iCompetenceProfileID = 0;
			}
		}
		else
		{
			teCompetenceProfile = null;
			iCompetenceProfileID = 0;
		}

		var existPA = ArrayOptFirstElem(tools.xquery("for $elem in pas where $elem/assessment_plan_id = "  + iAssessmentPlanID + " and $elem/expert_person_id = "  + iExpertID + " and $elem/status = "  + CodeLiteral(oStatus.participant) + " return $elem/Fields('id')"))

		if(existPA == undefined)
		{
			tools_ass.generate_participant( curAssessmentAppraiseID, oPart, curPlan, null, curPlan, iExpertID, true, null );
			var newPA = ArrayOptFirstElem(tools.xquery("for $elem in pas where $elem/assessment_plan_id = "  + iAssessmentPlanID + " and $elem/expert_person_id = "  + iExpertID + " and $elem/status = "  + CodeLiteral(oStatus.participant) + " return $elem/Fields('id')"))

			if(newPA == undefined)
				throw "Не удалось получить ID созданной анкеты для {AssessmentPlanID:" + iAssessmentPlanID + ", ExpertID: " + iExpertID + ", Тип: " + CodeLiteral(oStatus.participant) + "}"

			docChangePA = tools.open_doc(newPA.id);
		}
		else
			docChangePA = tools.open_doc(existPA.id);
		
		if(docChangePA == null)
			throw "Не удалось открыть анкету {ID:" + newPA.id + "}"

		if(teCompetenceProfile != null)
		{		
			docChangePA.TopElem.competence_profile_id = iCompetenceProfileID;
			docChangePA.TopElem.competences.AssignElem( teCompetenceProfile.competences );
		}

		docChangePA.TopElem.custom_experts.AssignElem( curPlan.custom_experts );
		docChangePA.TopElem.workflow_state = sWorkflowStatus;
//		docChangePA.TopElem.set_workflow_state_last_date(null);
		docChangePA.TopElem.workflow_state_name = docChangePA.TopElem.get_workflow_state_name( null );
		docChangePA.TopElem.custom_elems.ObtainChildByKey('participant_subclass').value = oStatus.name;

		docChangePA.Save();
		
		return docChangePA.DocID;
	}
	catch(err)
	{
			sErrStr = "Ошибка сохранения карточки новой анкеты.";
			WORKFLOW_ACTION_BREAK = true;
			WORKFLOW_CREATE_BREAK = true;
			alert( sErrStr + ": " + err );
			throw sErrStr + ": " + err ;
	}
}

function GetImpersonator( iPersonIDParam, curAssessmentAppraiseParam )
{
	// если ничего не найдется то сам
	var iAddresseeID = iPersonIDParam
	// все актуальные на данную дату имперсонаторы данной процедуры оценки
	var arrImperPersons = ArraySelect( curAssessmentAppraiseParam.impersonate_persons, "(This.from_date.HasValue == false || This.from_date <= DateNewTime(Date())) && (This.to_date.HasValue == false || This.to_date >= DateNewTime(Date()))" );
	// имперсонатор для указанного сотрудника
	curImperPerson = ArrayOptFindByKey( arrImperPersons, iAddresseeID, "face_person_id" );
	if (curImperPerson != undefined)
	{
		iAddresseeID = curImperPerson.impersonator_id;
	}
	
	return iAddresseeID
}

function printReport( vArrColumns, vArrData , vArrDataType, oParams)
{
	var oRow, oColumn;
	var sFilePath = "";
	var arrColumns = vArrColumns;
	var arrRecs = vArrData;
	var sArrRecsType = StrLowerCase(vArrDataType);
	var oParamFormParam = OpenNewDoc( 'x-local://applications/websoft360/app_export_excel.xmd' ).TopElem;
	var oDataFormParam = OpenNewDoc( 'x-local://wtv/wtv_form_table_data.xmd' ).TopElem;
	
	if (oParams != undefined)
	{
		for (vParam in oParams)
		{
			if (oParamFormParam.ChildExists(vParam))
			{
				oParamFormParam.Child(vParam).Value = oParams.GetOptProperty(vParam);
			}
		}
	}
	switch (sArrRecsType)
	{
		case 'xml':
			if( IsArray( arrColumns ) && IsArray( arrRecs ) )
			{
				for( oCol in arrColumns )
				{
					oColumn = oParamFormParam.columns.AddChild();
					oColumn.name = oCol.name;
					oColumn.const = oCol.const;
					
					oColumn.row = oCol.ChildExists( "row" ) ? oCol.row : oColumn.row;
					oColumn.hspan = oCol.ChildExists( "hspan" ) ? oCol.hspan : oColumn.hspan;
					oColumn.vspan = oCol.ChildExists( "vspan" ) ? oCol.vspan : oColumn.vspan;
				}
				for( oRec in arrRecs )
				{
					oRow = oDataFormParam.rs.AddChild();
					for( oCol in arrColumns )
					{
						oColumn = oRow.cs.AddChild();
						oColumn.name = oCol.name;
						oColumn.t = oRec.ChildExists( oCol.name ) ? oRec.Child( oCol.name ) : "";
					}
				}
				oPrint = tools_report.fnCreateExcelFile( null, oParamFormParam, oDataFormParam );
				sFilePath = "x-local://trash/temp/websoft360_report_" + Year( Date() ) + "_" + Month( Date() ) + "_" + Day( Date() ) + "_" + Hour( Date() ) + Minute( Date() ) + "_" + Second( Date() ) + ".xlsx";
				oPrint.SaveAs( UrlToFilePath( sFilePath ) );
				return sFilePath;
				
			}
			break;
		case 'json':
			if( IsArray( arrColumns ) && IsArray( arrRecs ) )
			{
				for( oCol1 in arrColumns )
				{
					if(DataType(oCol1) == 'string')
					{
						oCol = OpenDocFromStr(oCol1).TopElem;
					}
					else
					{
						oCol = oCol1;
					}
					oColumn = oParamFormParam.columns.AddChild();
					oColumn.name = String(oCol.OptChild('name'));
					oColumn.const = String(oCol.OptChild('const'));
					
					oColumn.row = oCol.ChildExists( "row" ) ? oCol.row : oColumn.row;
					oColumn.hspan = oCol.ChildExists( "hspan" ) ? oCol.hspan : oColumn.hspan;
					oColumn.vspan = oCol.ChildExists( "vspan" ) ? oCol.vspan : oColumn.vspan;
				}
				for( oRec in arrRecs )
				{
					oRow = oDataFormParam.rs.AddChild();
					for( oCol1 in arrColumns )
					{
						if(DataType(oCol1) == 'string')
						{
							oCol = OpenDocFromStr(oCol1).TopElem;
						}
						else
						{
							oCol = oCol1;
						}
						oColumn = oRow.cs.AddChild();
						oColumn.name = oCol.name;
						oColumn.t = oRec.GetOptProperty( oCol.name ) != undefined ? oRec.GetOptProperty( oCol.name ) : "";
					}
				}
				oPrint = tools_report.fnCreateExcelFile( null, oParamFormParam, oDataFormParam );
				sFilePath = "x-local://trash/temp/websoft360_report_" + Year( Date() ) + "_" + Month( Date() ) + "_" + Day( Date() ) + "_" + Hour( Date() ) + Minute( Date() ) + "_" + Second( Date() ) + ".xlsx";
				oPrint.SaveAs( UrlToFilePath( sFilePath ) );
				return sFilePath;
			}
			break;
	}
	return sFilePath;
}

function printPersonalReport (_static_data, _comp_array, _ind_array, _scales_array, _comp_rows, _ind_rows, _report_info, _competence_only)
{
	function Log ( text, param )
	{
		if ( param == undefined )
		{
			LogEvent( sLogName, text );
		}
		if( param == true )
		{
			LogEvent( sLogName, tools.object_to_text( text, "xml" ) );
		}
	}
	var sLogName = "personal_report_to_pdf_test";
	EnableLog( sLogName, true );
	var sFilePath = "x-local://trash/temp/personal_report_"+tools.random_string(15)+ ".xlsx";
	var oStaticData = _static_data == null ? OpenDoc('x-local://applications/websoft360/app_view_personal_report_static_data.xml').TopElem : _static_data;
	var oReportInfo = DataType( _report_info ) == "string" ? ParseJson( _report_info ) : _report_info;
	var aCompetences = DataType( _comp_array ) == "string" ? ParseJson( _comp_array ) : _comp_array;
	var aIndicators = DataType( _ind_array ) == "string" ? ParseJson( _ind_array ) : _ind_array;
	var aScales = DataType( _scales_array ) == "string" ? ParseJson( _scales_array ) : _scales_array;
	var aCompMatrix = DataType( _comp_rows ) == "string" ? ParseJson( _comp_rows ) : _comp_rows;
	var aIndMatrix = DataType( _ind_rows ) == "string" ? ParseJson( _ind_rows ) : _ind_rows;
	var bCompetenceOnly = tools_web.is_true( _competence_only );
	var iTitleHeight = 20.0;
	var iRowHeight = 12.5;
	var iCoeff = 100;
	var i = 0;
	try 
	{
	oExcelDoc =  tools.get_object_assembly('Excel');
	oExcelDoc.CreateWorkBook();
	oWorksheet = oExcelDoc.GetWorksheet(0);	
	oCells = oWorksheet.Cells;

	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oReportInfo.appr_name;
	oCell.Style.FontSize = 14;
	oCell.Style.IsBold = true;
	oCell.Style.HorizontalAlignment = 'Center';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Дата оценки: '+oReportInfo.start_date; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	i++;

	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Дата отчета: '+oReportInfo.cur_date; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Ф.И.О. сотрудника: '+oReportInfo.person_name; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Должность: '+oReportInfo.position; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Подразделение: '+oReportInfo.subdivision; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_intro.Value; 
	oCell.Style.FontSize = 14; 
	oCell.Style.IsBold = true;
	oCell.Style.HorizontalAlignment = 'Center';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_purpose.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text1.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.HorizontalAlignment = 'Justify';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = 78.75
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_components.Value; 
	oCell.Style.FontSize = 14; 
	oCell.Style.IsBold = true;
	oCell.Style.HorizontalAlignment = 'Center';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_competences.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text2.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.HorizontalAlignment = 'Justify';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
// Таблица со списком компетенций
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = ''; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,1,1,3);
	oCell = oCells.GetCell('B'+(i+1));
	oCell.Value = 'Компетенции'; 
	oCell.Style.FontSize = 10; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,4,1,16);
	oCell = oCells.GetCell('E'+(i+1));
	oCell.Value = 'Определение'; 
	oCell.Style.FontSize = 10; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	i++;
	for (_comp in ArraySort(aCompetences, 'This.position', '+'))
	{
		oCell = oCells.GetCell('A'+(i+1));
		oCell.Value = _comp.position; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,1,1,3);
		oCell = oCells.GetCell('B'+(i+1));
		oCell.Value = _comp.name; 
		oCell.Style.FontSize = 10; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,4,1,16);
		oCell = oCells.GetCell('E'+(i+1));
		oCell.Value = _comp.desc; 
		oCell.Style.FontSize = 10; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oRow = oCells.Rows.GetRow(i);
		oRow.Height = (StrCharCount(_comp.desc) > iCoeff) ? iRowHeight*(StrCharCount(oCell.Value)/iCoeff) + 1 : iRowHeight;
		i++;
	}
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text3.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text4.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text5.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
// Шкала оценки компетенций/индикаторов
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Оценка'; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,1,1,3);
	oCell = oCells.GetCell('B'+(i+1));
	oCell.Value = 'Уровень'; 
	oCell.Style.FontSize = 10; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,4,1,16);
	oCell = oCells.GetCell('E'+(i+1));
	oCell.Value = 'Описание'; 
	oCell.Style.FontSize = 10; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	i++;
	for (_scale in ArraySort(aScales, 'This.value', '+'))
	{
		oCell = oCells.GetCell('A'+(i+1));
		oCell.Value = _scale.value; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,1,1,3);
		oCell = oCells.GetCell('B'+(i+1));
		oCell.Value = _scale.name; 
		oCell.Style.FontSize = 10; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,4,1,16);
		oCell = oCells.GetCell('E'+(i+1));
		oCell.Value = _scale.desc; 
		oCell.Style.FontSize = 10; 
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oRow = oCells.Rows.GetRow(i);
		oRow.Height = (StrCharCount(_scale.desc) > iCoeff) ? iRowHeight*(StrCharCount(oCell.Value)/iCoeff) + 1 : iRowHeight;
		i++;
	}
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_profit.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text6.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = 40.5;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_result.Value; 
	oCell.Style.FontSize = 14; 
	oCell.Style.IsBold = true;
	oCell.Style.HorizontalAlignment = 'Center';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_analys.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text7.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = 67.0;
	i++;
// Графики по компетенциям/индикаторам
	
	for (_comp in aCompetences)
	{
		i++;
		oCells.Merge(i,0,1,3);
		oCell = oCells.GetCell('A'+(i+1));
		oCell.Value = _comp.name; 
		oCell.Style.FontSize = 10; 
		oCell.Style.IsBold = true;
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,3,1,17);
		oCell = oCells.GetCell('D'+(i+1));
		oCell.Value = _comp.desc; 
		oCell.Style.FontSize = 10; 
		oCell.Style.IsTextWrapped = true;
		oRow = oCells.Rows.GetRow(i);
		oRow.Height = (StrCharCount(_comp.desc) > iCoeff) ? iRowHeight*(StrCharCount(oCell.Value)/iCoeff) + 1 : iRowHeight*2;
		i = i+2;
		try
		{
			oPic = oWorksheet.Pictures.AddRelative( UrlToFilePath( _comp.competence_image ), i, 2, i+13, 18 );
		}
		catch(_zp1) {}
		i = i+14;
		if( _comp.indicators_image != "" && !bCompetenceOnly )
		{
			oCells.Merge(i,1,1,19);
			oCell = oCells.GetCell('B'+(i+1));
			oCell.Value = 'Индикаторы компетенции '+_comp.name; 
			oCell.Style.FontSize = 10; 
			oCell.Style.IsBold = true;
			oCell.Style.IsTextWrapped = true;
			i = i+2;
			aIndImages = _comp.indicators_image.split(',');
			for( j = 0; j < aIndImages.length; j++ )
			{
				try
				{
					oPic = oWorksheet.Pictures.AddRelative( UrlToFilePath(aIndImages[j]), i, 2, i+30, 18 );
				}
				catch(_zp1) {}
				i = i+31;
			}
		}
	}
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.title_matrix.Value; 
	oCell.Style.FontSize = 14; 
	oCell.Style.IsBold = true;
	oCell.Style.HorizontalAlignment = 'Center';
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text8.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = 30.0;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = oStaticData.text9.Value; 
	oCell.Style.FontSize = 10; 
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = 79.5;
	i++;
	
	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Анализ по компетенциям'; 
	oCell.Style.FontSize = 12; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
// Таблица Матричный анализ по компетенциям
	oCells.Merge(i,0,1,5);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Сильная зона'; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,5,1,5);
	oCell = oCells.GetCell('F'+(i+1));
	oCell.Value = 'Зона скрытых возможностей'; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,10,1,5);
	oCell = oCells.GetCell('K'+(i+1));
	oCell.Value = 'Слепая зона'; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oCells.Merge(i,15,1,5);
	oCell = oCells.GetCell('P'+(i+1));
	oCell.Value = 'Зона роста'; 
	oCell.Style.ForegroundColor = '#f7f8fe';
	oCell.Style.Borders.SetStyle("Thin");
	oCell.Style.Borders.SetColor("#000000");
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iRowHeight*2;
	i++;
	for (_row in aCompMatrix)
	{
		oCells.Merge(i,0,1,5);
		oCell = oCells.GetCell('A'+(i+1));
		oCell.Value = _row.zone_strong;
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,5,1,5);
		oCell = oCells.GetCell('F'+(i+1));
		oCell.Value = _row.zone_hidden;
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,10,1,5);
		oCell = oCells.GetCell('K'+(i+1));
		oCell.Value = _row.zone_blind;
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,15,1,5);
		oCell = oCells.GetCell('P'+(i+1));
		oCell.Value = _row.zone_growth;
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oRow = oCells.Rows.GetRow(i);
		oRow.Height = iRowHeight*2;
		i++;
	}

	oCells.Merge(i,0,1,20);
	oCell = oCells.GetCell('A'+(i+1));
	oCell.Value = 'Анализ по индикаторам'; 
	oCell.Style.FontSize = 12; 
	oCell.Style.IsBold = true;
	oCell.Style.IsTextWrapped = true;
	oRow = oCells.Rows.GetRow(i);
	oRow.Height = iTitleHeight;
	i++;
// Таблица Матричный анализ по индикаторам
	if(!bCompetenceOnly)
	{
		oCells.Merge(i,0,1,5);
		oCell = oCells.GetCell('A'+(i+1));
		oCell.Value = 'Сильная зона'; 
		oCell.Style.ForegroundColor = '#f7f8fe';
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,5,1,5);
		oCell = oCells.GetCell('F'+(i+1));
		oCell.Value = 'Зона скрытых возможностей'; 
		oCell.Style.ForegroundColor = '#f7f8fe';
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,10,1,5);
		oCell = oCells.GetCell('K'+(i+1));
		oCell.Value = 'Слепая зона'; 
		oCell.Style.ForegroundColor = '#f7f8fe';
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oCells.Merge(i,15,1,5);
		oCell = oCells.GetCell('P'+(i+1));
		oCell.Value = 'Зона роста'; 
		oCell.Style.ForegroundColor = '#f7f8fe';
		oCell.Style.Borders.SetStyle("Thin");
		oCell.Style.Borders.SetColor("#000000");
		oCell.Style.IsTextWrapped = true;
		oRow = oCells.Rows.GetRow(i);
		oRow.Height = iRowHeight*2;
		i++;
		for (_row in aIndMatrix)
		{
			oCells.Merge(i,0,1,5);
			oCell = oCells.GetCell('A'+(i+1));
			oCell.Value = _row.zone_strong;
			oCell.Style.Borders.SetStyle("Thin");
			oCell.Style.Borders.SetColor("#000000");
			oCell.Style.IsTextWrapped = true;
			oCells.Merge(i,5,1,5);
			oCell = oCells.GetCell('F'+(i+1));
			oCell.Value = _row.zone_hidden;
			oCell.Style.Borders.SetStyle("Thin");
			oCell.Style.Borders.SetColor("#000000");
			oCell.Style.IsTextWrapped = true;
			oCells.Merge(i,10,1,5);
			oCell = oCells.GetCell('K'+(i+1));
			oCell.Value = _row.zone_blind;
			oCell.Style.Borders.SetStyle("Thin");
			oCell.Style.Borders.SetColor("#000000");
			oCell.Style.IsTextWrapped = true;
			oCells.Merge(i,15,1,5);
			oCell = oCells.GetCell('P'+(i+1));
			oCell.Value = _row.zone_growth;
			oCell.Style.Borders.SetStyle("Thin");
			oCell.Style.Borders.SetColor("#000000");
			oCell.Style.IsTextWrapped = true;
			oRow = oCells.Rows.GetRow(i);
			oRow.Height = iRowHeight*2;
			i++;
		}
	}
	
	oExcelDoc.SaveAs( UrlToFilePath( sFilePath ) );
	} 
	catch(_zzz) 
	{
		alert('ERROR in PrintPersonalReport:' + _zzz);
		sFilePath = "";
	}
	return sFilePath;
}

function addGraphsToExcell (_data_array, _file_path)
{
	var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document");
	oExcelDoc.Open(UrlToFilePath(_file_path));
	oExcelDoc.GetWorksheet(0).Name = "Таблица";
	oWorkSheet = oExcelDoc.AddWorksheet();
	oWorkSheet.Name = "Графики";
	n = 1;
	for (_elem in _data_array)
	{
		oPic = oWorkSheet.Pictures.AddAbsolute(UrlToFilePath(_elem.image_url), n, 1, 100, 100);
		n += 43;
	}
	oExcelDoc.Save();
}

function getGroupReportGraphImage (obj_data)
{
	try
	{
		if(DataType(obj_data) == 'string')
		{
			_temp_data = OpenDocFromStr(obj_data).TopElem;
			_temp_doc = OpenNewDoc('x-local://applications/websoft360/app_view_assessment_appraise_group_report.xml').TopElem;
			obj_data = _temp_doc.Child( _temp_data.Name + 's' ).AddChild();
			obj_data.AssignElem( _temp_data );
		}
		
		
		oExcelDoc =  tools.get_object_assembly('Excel');
		oExcelDoc.CreateWorkBook();
		oWorksheet = oExcelDoc.GetWorksheet(0);	
		chart = oWorksheet.Charts.AddFloatingChart('Column', 0, 0, 1000, 700);
		series_data = '{'+( obj_data.ChildExists("competences") && ArrayCount(obj_data.competences)>0 ? ArrayMerge(obj_data.competences, 'StrRealFixed(This.value, 2)', ','): '0')+','+ StrRealFixed(obj_data.average.Value, 2)+'}';//'{'+StrRealFixed(obj_data.plan_avg.Value, 2)+','+ArrayMerge(obj_data.competences, 'StrRealFixed(This.value, 2)', ',')+','+ StrRealFixed(obj_data.average.Value, 2)+'}';
		series_legend = '{'+ (obj_data.ChildExists("competences") && ArrayCount(obj_data.competences)>0 ? ArrayMerge(obj_data.competences, 'This.competence_id.OptForeignElem.name', ','): '0')+', Средняя оценка по компетенциям}'//'{Желаемый уровень, '+ArrayMerge(obj_data.competences, 'This.competence_id.OptForeignElem.name', ',')+', Средняя оценка по компетенциям}';
		series = chart.AddSeries('Column', series_data, true);
		series.XValues = series_legend;
		series.Name = '' //(obj_data.ChildExists('subdivision_name')) ? String('Результаты оценки компетенций по подразделению '+obj_data.subdivision_name.Value) : (obj_data.ChildExists('org_name')) ? String('Результаты оценки компетенций по организации '+obj_data.org_name.Value) : '';
		chart.Title.IsBold = true;
		chart.LegendPosition = 'top';
		chart.BackgroundColor  = '#FFFFFF';
		_max = obj_data.ChildExists("competences") && ArrayCount(obj_data.competences)>0 ? OptInt( ArrayMax( obj_data.competences, "OptInt( This.value, 4 )" ).value, 4 ) : 0;
		if ( OptInt( obj_data.average, 4 ) > _max )
		{
			_max = OptInt( obj_data.average, 4 );
		}
		chart.ValueAxis.MaxValue = _max + 1;
		series.DataLabels.ShowValue = true;
		series.DataLabels.Position = "Center";
		series.DataLabels.Font.Color = "white";
		chart.Title.Text = (obj_data.ChildExists('collaborator_id')) ? 'Средняя оценка по компетенциям сотрудника' : (obj_data.ChildExists('subdivision_id')) ? String(obj_data.image_title) : (obj_data.ChildExists('org_id')) ? String('Средняя оценка по компетенциям организации') : '';
		chart.ShowLegend = false;
		chart.Title.IsVisible;
		file_path = 'x-local://trash/temp/group_graph_'+tools.random_string(15)+ '.png'
		chart.ToImage(UrlToFilePath(file_path));
		return file_path;
	}
	catch(err)
	{
		LogEvent('', 'getGraphImageUrl_group error:' +err);
	}
}

function createPersonalReport(_ps, _query_str)
{
	function Log ( text, param )
	{
		if ( param == undefined )
		{
			LogEvent( sLogName, text );
		}
		if( param == true )
		{
			LogEvent( sLogName, tools.object_to_text( text, "xml" ) );
		}
	}
	var sLogName = "personal_report_to_pdf_test";
	EnableLog( sLogName, true );
	
	_xquery = 'for $pa in pas';
	_pas_array = tools.xquery( _xquery + ( _query_str == '' ? '' : ' where ' ) + _query_str + ' return $pa' );
	count = 1;
	for (_pa_data in _pas_array)
	{
		try
		{
			doc_pa = tools.open_doc(OptInt(_pa_data.id, 0));
		}
		catch(e)
		{}
		
		if (doc_pa == undefined)
		{
			continue;
		}
		else
		{
			obj_pa = doc_pa.TopElem;
		}

		for(_competence in obj_pa.competences)
		{
			cur_competence = ArrayOptFind(_ps.competences, 'This.competence_id == _competence.competence_id');
			if(cur_competence == undefined)
			{
				competence_child = _ps.competences.AddChild();
				competence_child.AssignElem(_competence);
				competence_child.competence_id = _competence.competence_id;
				competence_child.count = count;
				count++;

				doc_competence = tools.open_doc(OptInt(competence_child.competence_id, 0));
				if (doc_competence != undefined)
				{
					competence_child.name = (doc_competence == undefined) ? null : doc_competence.TopElem.name;
					competence_child.competence_desc = (doc_competence == undefined) ? null : doc_competence.TopElem.comment;
					if(!_ps.scales.ChildExists('scale'))
					{
						for (_scale in doc_competence.TopElem.scales)
						{
							scale_child = _ps.scales.AddChild();
							scale_child.AssignElem(_scale);
							scale_child.scale_id = _scale.ChildExists('id') ? _scale.id : null;
							scale_child.scale_name = _scale.ChildExists('name') ? _scale.name : null;
							scale_child.scale_desc = _scale.ChildExists('desc') ? _scale.desc : null;
							scale_child.scale_value = _scale.ChildExists('percent') ? _scale.percent : null;
						}
					}
				}
			}
			for(_indicator in _competence.indicators)
			{
				cur_indicator = ArrayOptFind(_ps.indicators, 'This.indicator_id == _indicator.indicator_id');
				if(cur_indicator == undefined)
				{
					indicator_child = _ps.indicators.AddChild();
					indicator_child.indicator_id = _indicator.indicator_id;
					indicator_child.competence_id = _competence.competence_id;
					doc_indicator = tools.open_doc(OptInt(_indicator.indicator_id, 0));
					if (doc_indicator != undefined)
					{
						indicator_child.name = doc_indicator.TopElem.name;
						indicator_child.indicator_desc = doc_indicator.TopElem.comment;
					}
				}
			}
		}

		for(_competence in _ps.competences)
		{
			obj_competence = ArrayOptFind(obj_pa.competences, 'This.competence_id == _competence.competence_id');
			if(obj_competence != undefined)
			{
				if(ArrayOptFind(_competence.pa_datas, 'This.pa_id == obj_pa.id') == undefined)
				{
					pa_data_child = _competence.pa_datas.AddChild();
					pa_data_child.pa_id = obj_pa.id;
					if (obj_pa.status.HasValue)
					{
						pa_data_child.status = obj_pa.status;
						try
						{
							pa_data_child.status_name = pa_data_child.pa_id.ForeignElem.status.ForeignElem.name;
						}
						catch(_bugoga_)
						{
							pa_data_child.status_name = "";
						}
					}
					pa_data_child.value = obj_competence.ChildExists('mark_value') ? obj_competence.mark_value : pa_data_child.value;
					pa_data_child.expert_person_id = obj_pa.expert_person_id;
				}
				for (_indicator in _ps.indicators)
				{
					obj_indicator = ArrayOptFind(obj_competence.indicators, 'This.indicator_id == _indicator.indicator_id');
					if(obj_indicator != undefined)
					{
						if(ArrayOptFind(_indicator.pa_datas, 'This.pa_id == obj_pa.id') == undefined)
						{
							pa_data_child = _indicator.pa_datas.AddChild();
							pa_data_child.pa_id = obj_pa.id;
							if (obj_pa.status.HasValue)
							{
								pa_data_child.status = obj_pa.status;
								try
								{
									pa_data_child.status_name = pa_data_child.pa_id.ForeignElem.status.ForeignElem.name;
								}
								catch(_bugoga_)
								{
									pa_data_child.status_name = "";
								}
							}
							pa_data_child.value = obj_indicator.ChildExists('mark_value') ? obj_indicator.mark_value : pa_data_child.value;
							pa_data_child.expert_person_id = obj_pa.expert_person_id;
						}
					}
				}
			}
		}
	}
	
	aIndDatas = new Array();
	for(_indicator in _ps.indicators)
	{
		_summ = null;
		_count = 0;
		for(_pa_data in _indicator.pa_datas)
		{
			if(_pa_data.status == 'self')
			{
				_indicator.indicator_self = _pa_data.value;
			}
			else
			{
				if(_pa_data.value != null)
				{
					_summ = _summ == null ? _pa_data.value : _summ + _pa_data.value;
					_count++;
				}
			}
		}
		_indicator.indicator_avg = (_count == 0) ? null : _summ/_count;
		
		if(OptReal(_indicator.indicator_self, 0) >= _ps.zone_level && OptReal(_indicator.indicator_avg, 0) >= _ps.zone_level)
		{
			_indicator.indicator_zone = 'zone_strong';
		}
		else if(_indicator.indicator_self < _ps.zone_level && _indicator.indicator_avg >= _ps.zone_level)
		{
			_indicator.indicator_zone = 'zone_hidden';
		}
		else if(_indicator.indicator_self >= _ps.zone_level && _indicator.indicator_avg < _ps.zone_level)
		{
			_indicator.indicator_zone = 'zone_blind';
		}
		else if(_indicator.indicator_self < _ps.zone_level && _indicator.indicator_avg < _ps.zone_level)
		{
			_indicator.indicator_zone = 'zone_growth';
		}
		_indicator.count = ArrayCount(ArraySelect(_ps.indicators, 'This.indicator_zone == _indicator.indicator_zone'));
		
		aStatuses = ArraySelectDistinct( ArrayMerge( _indicator.pa_datas, "This.status", "," ).split( "," ) );
		for ( i = 0; i < aStatuses.length; i++ )
		{
			aPaData = ArraySelect( _indicator.pa_datas, "This.status == aStatuses[i]" );
			if ( aStatuses[i] == 'self' )
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.indicator_id = OptInt( _indicator.indicator_id, 0 );
				oData.competence_id = OptInt( _indicator.competence_id, 0 );
				oData.name = String( StrReplace(_indicator.name, ',', " ") );
				oData.status = 0;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aIndDatas.push(oData);
			}
			else if( aStatuses[i] == 'manager' )
			{
				iOrder = 0;
				for( elem in aPaData )
				{
					oData = new Object;
					oData.indicator_id = OptInt( _indicator.indicator_id, 0 );
					oData.competence_id = OptInt( _indicator.competence_id, 0 );
					oData.name = String( StrReplace(_indicator.name, ',', " ") );
					oData.status = 1;
					oData.value = OptReal( elem.value, null )
					oData.order = iOrder;
					iOrder++;
					oData.status_name = String( elem.status_name )+" "+iOrder;
					aIndDatas.push( oData );
				}
			}
			else if ( aStatuses[i] == 'staff' )
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.indicator_id = OptInt( _indicator.indicator_id, 0 );
				oData.competence_id = OptInt( _indicator.competence_id, 0 );
				oData.name = String( StrReplace(_indicator.name, ',', " " ) );
				oData.status = 2;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aIndDatas.push(oData);
			}
			else if ( aStatuses[i] == 'coll' )
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.indicator_id = OptInt( _indicator.indicator_id, 0 );
				oData.competence_id = OptInt( _indicator.competence_id, 0 );
				oData.name = String( StrReplace(_indicator.name, ',', " ") );
				oData.status = 3;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aIndDatas.push(oData);
			}
			else
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.indicator_id = OptInt( _indicator.indicator_id, 0 );
				oData.competence_id = OptInt( _indicator.competence_id, 0 );
				oData.name = String( StrReplace(_indicator.name, ',', " ") );
				oData.status = 10;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aIndDatas.push(oData);
			}
		}
	}
	
	for ( _competence in _ps.competences )
	{
		_summ = null;
		_count = 0;
		for( _pa_data in _competence.pa_datas )
		{
			if( _pa_data.status == 'self' )
			{
				_competence.competence_self = _pa_data.value;
			}
			else
			{
				if( _pa_data.value != null )
				{
					_summ = _summ == null ? _pa_data.value : _summ + _pa_data.value;
					_count++;
				}
			}
		}
		_competence.competence_avg = (_count == 0) ? null : _summ/_count;
		
		if(OptReal(_competence.competence_self, 0) >= _ps.zone_level && OptReal(_competence.competence_avg, 0) >= _ps.zone_level)
		{
			_competence.competence_zone = 'zone_strong';
		}
		else if(_competence.competence_self < _ps.zone_level && _competence.competence_avg >= _ps.zone_level)
		{
			_competence.competence_zone = 'zone_hidden';
		}
		else if(_competence.competence_self >= _ps.zone_level && _competence.competence_avg < _ps.zone_level)
		{
			_competence.competence_zone = 'zone_blind';
		}
		else if(_competence.competence_self < _ps.zone_level && _competence.competence_avg < _ps.zone_level)
		{
			_competence.competence_zone = 'zone_growth';
		}
		_competence.count = ArrayCount(ArraySelect(_ps.competences, 'This.competence_zone == _competence.competence_zone'));
		
		aStatuses = ArrayMerge( _competence.pa_datas, "This.status", "," ).split(",");
		aStatuses = ArraySelectDistinct( aStatuses );
		aDatas = new Array();
		for ( i = 0; i < aStatuses.length; i++ )
		{
			aPaData = ArraySelect( _competence.pa_datas, "This.status == aStatuses[i]" );
			if( aStatuses[i] == 'self' )
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.status = 0;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aDatas.push(oData);
			}
			else if(aStatuses[i] == 'manager')
			{
				iOrder = 0;
				for( elem in aPaData )
				{
					oData = new Object;
					oData.status = 1;
					oData.value = OptReal( elem.value, null )
					oData.order = iOrder;
					iOrder++;
					oData.status_name = String( elem.status_name )+" "+iOrder;
					aDatas.push( oData );
				}
			}
			else if( aStatuses[i] == 'staff' )
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.status = 2;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aDatas.push(oData);
			}
			else if (aStatuses[i] == 'coll')
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.status = 3;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aDatas.push(oData);
			}
			else
			{
				pa_data_summ = null;
				pa_data_count = 0;
				for ( elem in aPaData )
				{
					if( elem.value != null )
					{
						pa_data_summ = pa_data_summ == null ? OptReal( elem.value, 0 ) : pa_data_summ + OptReal( elem.value, 0 );
						pa_data_count++;
					}
				}
				oData = new Object;
				oData.status = 10;
				oData.status_name = ArrayOptFirstElem( aPaData ) != undefined ? String( ArrayOptFirstElem(aPaData).status_name ) : "";
				oData.value = pa_data_count == 0 ? null : OptReal( pa_data_summ/pa_data_count, 0 );
				oData.order = "";
				aDatas.push(oData);
			}
		}
		_competence.competence_image = getPersonalReportGraphs( aDatas, "Bar" );
		
		aDatas = [];
		aCurCompIndData = ArraySelect( aIndDatas, "This.competence_id == _competence.competence_id" );
		iSeriesInChart = 5;
		iStartPos = 0;
		iIndCount = ArrayCount( ArraySelectDistinct( aCurCompIndData, "This.indicator_id" ) );
		iStatusCount = ArrayCount( ArraySelectDistinct( aCurCompIndData, "This.status_name" ) );
		if( iIndCount > iSeriesInChart )
		{
			iChartNumber = OptInt( StrRealFixed( ( iIndCount / iSeriesInChart ), 0 ), 0 ) + 1;
			for( i = 0; i < iChartNumber; i++ )
			{
				aDatas = [];
				aChart = ArrayRange( aCurCompIndData, iStartPos, ( iSeriesInChart * iStatusCount ) );
				iStartPos += iSeriesInChart * iStatusCount;
				
				for( _status in ArraySelectDistinct( aChart, "This.status" ) )
				{
					aStatusData = ArraySelect( aChart, "This.status == _status.status" );
					if( _status.status == 0 )
					{
						oData = new Object;
						oData.status = _status.status;
						oData.status_name = String( _status.status_name );
						oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
						oData.value = ArrayMerge( aStatusData, "This.value", "," );
						oData.order = "";
						
						aDatas.push( oData );
					}
					else if( _status.status == 1 )
					{
						for( _expert in ArraySelectDistinct( aStatusData, "This.order" ) )
						{
							aExpertData = ArraySelect( aStatusData, "This.order == _expert.order" )
							oData = new Object;
							oData.status = _status.status;
							oData.status_name = String( _expert.status_name );
							oData.x_value = ArrayMerge( aExpertData, "This.name", "," );
							oData.value = ArrayMerge( aExpertData, "This.value", "," );
							oData.order = _expert.order;
							aDatas.push( oData );
						}
					}
					else if( _status.status == 2 )
					{
						oData = new Object;
						oData.status = _status.status;
						oData.status_name = String( _status.status_name );
						oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
						oData.value = ArrayMerge( aStatusData, "This.value", "," );
						oData.order = "";
						
						aDatas.push( oData );
					}
					else if( _status.status == 3 )
					{
						oData = new Object;
						oData.status = _status.status;
						oData.status_name = String( _status.status_name );
						oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
						oData.value = ArrayMerge( aStatusData, "This.value", "," );
						oData.order = "";
						
						aDatas.push( oData );
					}
					else
					{
						oData = new Object;
						oData.status = _status.status;
						oData.status_name = String( _status.status_name );
						oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
						oData.value = ArrayMerge( aStatusData, "This.value", "," );
						oData.order = "";
						
						aDatas.push( oData );
					}
				}
				sImageUrl = getPersonalReportGraphs( aDatas, "Column" );
				_competence.indicators_image = sImageUrl == "" ? _competence.indicators_image.Value : _competence.indicators_image == "" ? sImageUrl : _competence.indicators_image.Value+','+sImageUrl;
			}
		}
		else
		{
			aDatas = [];
			for( _status in ArraySelectDistinct( aCurCompIndData, "This.status" ) )
			{
				aStatusData = ArraySelect( aCurCompIndData, "This.status == _status.status" );
				if( _status.status == 0 )
				{
					oData = new Object;
					oData.status = _status.status;
					oData.status_name = String( _status.status_name );
					oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
					oData.value = ArrayMerge( aStatusData, "This.value", "," );
					oData.order = "";
					
					aDatas.push( oData );
				}
				else if( _status.status == 1 )
				{
					for( _expert in ArraySelectDistinct( aStatusData, "This.order" ) )
					{
						aExpertData = ArraySelect( aStatusData, "This.order == _expert.order" )
						oData = new Object;
						oData.status = _status.status;
						oData.status_name = String( _expert.status_name );
						oData.x_value = ArrayMerge( aExpertData, "This.name", "," );
						oData.value = ArrayMerge( aExpertData, "This.value", "," );
						oData.order = _expert.order;
						aDatas.push( oData );
					}
				}
				else if( _status.status == 2 )
				{
					oData = new Object;
					oData.status = _status.status;
					oData.status_name = String( _status.status_name );
					oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
					oData.value = ArrayMerge( aStatusData, "This.value", "," );
					oData.order = "";
					
					aDatas.push( oData );
				}
				else if( _status.status == 3 )
				{
					oData = new Object;
					oData.status = _status.status;
					oData.status_name = String( _status.status_name );
					oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
					oData.value = ArrayMerge( aStatusData, "This.value", "," );
					oData.order = "";
					
					aDatas.push( oData );
				}
				else
				{
					oData = new Object;
					oData.status = _status.status;
					oData.status_name = String( _status.status_name );
					oData.x_value = ArrayMerge( aStatusData, "This.name", "," );
					oData.value = ArrayMerge( aStatusData, "This.value", "," );
					oData.order = "";
					
					aDatas.push( oData );
				}
			}
			_competence.indicators_image = getPersonalReportGraphs( aDatas, "Column" );
		}
	}
	
	return _ps;
}

function getPersonalReportGraphs ( graph_data, graph_type )
{
	function Log ( text, param )
	{
		if ( param == undefined )
		{
			LogEvent( sLogName, text );
		}
		if( param == true )
		{
			LogEvent( sLogName, tools.object_to_text( text, "xml" ) );
		}
	}
	function addSeries( _chart, _data, _name, _color, _xvals ) {
		oSeries = _chart.AddSeries( graph_type, _data, true );
		oSeries.Area.ForegroundColor = _color;
		oSeries.Name = _name;
		if( _xvals != "" )
		{
			oSeries.XValues = _xvals;
		}
		oSeries.DataLabels.ShowValue = true;
		oSeries.DataLabels.Position = "OutsideEnd";
		oSeries.DataLabels.Font.Color = "black";
		oSeries.DataLabels.Font.IsBold = true;
		oSeries.DataLabels.Font.Size = 12;
	}
	
	var sSeriesName = "";
	var sSeriesData = "";
	var bSecManager = false;
	var sColor = "";
	var sFilePath = 'x-local://trash/temp/graph_'+tools.random_string(15)+ '.png';
	var sLogName = "personal_report_to_pdf_test";
	EnableLog( sLogName, true );
	
	if( ArrayCount( graph_data ) == 0 )
	{
		return "";
	}
	try
	{
		var oExcelDoc =  tools.get_object_assembly('Excel');
		oExcelDoc.CreateWorkBook();
		var oWorksheet = oExcelDoc.GetWorksheet(0);
		if( graph_type == 'Column' )
		{
			var oChart = oWorksheet.Charts.AddFloatingChart( graph_type, 0, 0, 900, 400 );
			aStatuses = ArrayMerge( ArraySort( graph_data, "This.status", "+" ), "This.status", "," ).split(",");
		}
		else
		{
			var oChart = oWorksheet.Charts.AddFloatingChart( graph_type, 0, 0, 900, 200 );
			aStatuses = ArrayMerge( ArraySort( graph_data, "This.status", "-" ), "This.status", "," ).split(",");
		}

		aStatuses = ArraySelectDistinct( aStatuses );
		for( i = 0; i < aStatuses.length; i++ )
		{
			if( aStatuses[i] == "0" )
			{
				aStatusData = ArraySelect( graph_data, "String(This.status) == aStatuses[i]" );
				for( data in aStatusData )
				{
					sSeriesData = data.value != null ? "{"+data.value+"}" : "{0}";
					sSeriesName = data.status_name;
					sXVals = graph_type == "Column" ? "{"+data.x_value+"}" : "";
					sColor = "#C20300";
					addSeries( oChart, sSeriesData, sSeriesName, sColor, sXVals );
				}
			}
			else if ( aStatuses[i] == "1" )
			{
				if( graph_type == 'Column' )
				{
					aStatusData = ArraySort( ArraySelect( graph_data, "String(This.status) == aStatuses[i]" ), "This.order", "+" );
				}
				else
				{
					aStatusData = ArraySort( ArraySelect( graph_data, "String(This.status) == aStatuses[i]" ), "This.order", "-" );
				}
				bSecManager = false;
				for( data in  aStatusData  )
				{
					sSeriesData = data.value != null ? "{"+data.value+"}" : "{0}";
					sSeriesName = data.status_name;
					sXVals = graph_type == "Column" ? "{"+data.x_value+"}" : "";
					if( !bSecManager )
					{
						sColor = "#C4C4C4";
						bSecManager = true;
					}
					else
					{
						sColor = "#7D7D7D";
						bSecManager = false;
					}
					addSeries( oChart, sSeriesData, sSeriesName, sColor, sXVals );
				}
			}
			else if ( aStatuses[i] == "2" )
			{
				aStatusData = ArraySelect( graph_data, "String(This.status) == aStatuses[i]" );
				for( data in aStatusData )
				{
					sSeriesData = data.value != null ? "{"+data.value+"}" : "{0}";
					sSeriesName = data.status_name;
					sXVals = graph_type == "Column" ? "{"+data.x_value+"}" : "";
					sColor = "#4D0100";
					addSeries( oChart, sSeriesData, sSeriesName, sColor, sXVals );
				}
			}
			else if ( aStatuses[i] == "3" )
			{
				aStatusData = ArraySelect( graph_data, "String(This.status) == aStatuses[i]" );
				for( data in aStatusData )
				{
					sSeriesData = data.value != null ? "{"+data.value+"}" : "{0}";
					sSeriesName = data.status_name;
					sXVals = graph_type == "Column" ? "{"+data.x_value+"}" : "";
					sColor = "#0E1E36";
					addSeries( oChart, sSeriesData, sSeriesName, sColor, sXVals );
				}
			}
			else 
			{
				aStatusData = ArraySelect( graph_data, "String(This.status) == aStatuses[i]" );
				for( data in aStatusData )
				{
					sSeriesData = data.value != null ? "{"+data.value+"}" : "{0}";
					sSeriesName = data.status_name;
					sXVals = graph_type == "Column" ? "{"+data.x_value+"}" : "";
					sColor = "#2B5A9F";
					addSeries( oChart, sSeriesData, sSeriesName, sColor, sXVals );
				}
			}
		}

		oChart.Title.Text = "";
		oChart.LegendPosition = "Left";
		oChart.ChartArea.Border.IsVisible = false;
		oChart.CategoryAxis.TickLabelPosition = graph_type == 'Column' ? "NextToAxis" : "None";
		oChart.ValueAxis.MaxValue = 5;
		oChart.BackgroundColor  = '#FFFFFF';
		oChart.ToImage( UrlToFilePath( sFilePath ) );
	}
	catch(err)
	{
		alert( 'getGraphImageUrl error:' +err );
		sFilePath = "";
	}
	return sFilePath;
}

function createPdfFileUrl ( _obj, _rows_array, _comprows_array )
{
	function Log ( text, param )
	{
		if ( param == undefined )
		{
			LogEvent( sLogName, text );
		}
		if( param == true )
		{
			LogEvent( sLogName, tools.object_to_text( text, "xml" ) );
		}
	}
	var sAssessmentName = ( String( _obj.assessment_appraise_name ) == '' ) ? 'Название процедуры оценки' : String( _obj.assessment_appraise_name );
	var sPersonName = String( _obj.person_name );
	var dCurDate = DateNewTime( Date() );
	var dAssessmentDate = DateNewTime( _obj.assessment_appraise_start_date );
	var sPositionName = ( _obj.position_id.OptForeignElem == undefined ) ? '' : String( _obj.position_id.OptForeignElem.name );
	var sSubdivisionName = ( _obj.subdivision_id.OptForeignElem == undefined ) ? '' : String( _obj.subdivision_id.OptForeignElem.name );
	var iPageNum = 1;
	var sSourcePath = 'x-local://trash/temp';
	var sFilePath = "x-local://trash/temp/personal_report_"+tools.random_string(15)+ ".pdf";
	var sGraphsSourcePath = "x-local://trash/temp";
	var sImagesSourcePath = "x-local://applications/websoft360/personal_report/resources";
	var oResult = {error: true, file_path: ""};
	var sReport = "";
	var sCompTable = "";
	var sScalesTable = "";
	var sImageBlock = "";
	var sCompMatrixBlock = "";
	var sIndMatrixBlock = "";
	var sLogName = "personal_report_to_pdf_test";
	EnableLog( sLogName, true );
	
	if ( DataType( _rows_array ) == "string" )
	{
		_rows_array = ParseJson( _rows_array );
	}
	if ( DataType( _comprows_array ) == "string" )
	{
		_comprows_array = ParseJson( _comprows_array );
	}
											 
	iCompNum = 0;
	for ( _item in _obj.competences )
	{
		iCompNum++;
		sCompName = ( _item.name == null ) ? '' : String( _item.name );
		sCompDesc = ( _item.competence_desc == null ) ? '' : String( _item.competence_desc );
		sCompTable = sCompTable + '<tr><td>'+iCompNum+'</td><td>'+sCompName+'</td><td>'+sCompDesc+'</td></tr>';
	}
	if( StrCharCount( sCompTable ) > 1200 )
	{
		sCopmpTablePageBreak =  '.main_parts_note { \
									page-break-after: always; \
								} \
								.main_parts_page .scales_block:before { \
									content: "'+sPersonName+'"; \
									display: block; \
									font-size: 20px; \
									line-height: 24px; \
									text-align: right; \
									color: #E0E0E0; \
									padding: 20px 0 30px 0; \
								}';
	}
	else
	{
		sCopmpTablePageBreak = '.main_parts_note { \
									margin-bottom: 50px; \
								}';
	}

	for ( _item in _obj.scales )
	{
		sScaleVal = String( _item.ChildIndex + 1 );
		sScaleName = ( _item.scale_name == null ) ? '' : String( _item.scale_name );
		sScaleDesc = ( _item.scale_desc == null ) ? '' : String( _item.scale_desc );
		sScalesTable = sScalesTable + '<tr><td>'+sScaleVal+'</td><td>'+sScaleName+'</td><td>'+sScaleDesc+'</td></tr>';
	}

	for ( _competence in ArraySelect( _obj.competences, "This.indicators_image != ''" ) )
	{
		sImageBlock = sImageBlock + 
		'<div class="image_block_elem"> \
			<div class="h3">'+String( _competence.name )+'</span></div> \
			<div class="elem_image"><img src="'+UrlToFilePath( _competence.competence_image )+'" alt=""></div>';

		if ( !_obj.competence_only && _competence.indicators_image != '' )
		{
			sImageBlock = sImageBlock +	'<div class="h3">Индикаторы компетенции '+String( _competence.name )+'</div>';
			aIndImages = _competence.indicators_image.Value.split(',');
			for( i = 1; i <= aIndImages.length; i++ )
			{
				if( i == 3 || i == 5 || i == 7 || i == 9 ) // перенос 3, 5, 7, 9, графика индикаторов для одной компетенции на следующую страницу
				{
					sImageBlock = sImageBlock +	'<div class="elem_image break_before_image"><img src="'+UrlToFilePath( aIndImages[i-1] )+'" alt=""></div>';
				}
				else
				{
					sImageBlock = sImageBlock +	'<div class="elem_image"><img src="'+UrlToFilePath( aIndImages[i-1] )+'" alt=""></div>';
				}
			}
			sImageBlock = sImageBlock +	'</div>';
		}
		else
		{
			sImageBlock = sImageBlock + '</div>';
		}
	}
	aOnlyComp = ArraySelect( _obj.competences, "This.indicators_image == ''" );
	iCompsPerPage = 4;
	iStartPos = 0;
	iPagesCount = ( ( ArrayCount( aOnlyComp ) % iCompsPerPage ) == 0 ) ? OptInt( ArrayCount( aOnlyComp ) / iCompsPerPage, 0 ) : OptInt( StrRealFixed( ArrayCount( aOnlyComp ) / iCompsPerPage, 0 ), 0 ) + 1;
	for( i = 0; i < iPagesCount ; i++ )
	{
		sImageBlock = sImageBlock + '<div class="image_block_elem">';
		for ( _competence in ArrayRange( aOnlyComp, iStartPos, iCompsPerPage ) )
		{
			sImageBlock = sImageBlock + 
			'<div class="h3">'+String( _competence.name )+'</span></div> \
			<div class="elem_image"><img src="'+UrlToFilePath( _competence.competence_image )+'" alt=""></div>';
		}
		sImageBlock = sImageBlock + '</div>';
		iStartPos += iCompsPerPage;
	}
	
	for ( _row in _comprows_array )
	{
		sMatrixRow = '';
		for ( _zone in _obj.zones )
		{
			cur_zone_value = _row.HasProperty(_zone.zone_id) ? _row.GetOptProperty( _zone.zone_id ) : undefined;
			sMatrixRow = ( cur_zone_value == undefined ) ? sMatrixRow + '<td>-</td>' : sMatrixRow + '<td>'+String( cur_zone_value )+'</td>';
		}
		sCompMatrixBlock = sCompMatrixBlock+'<tr>'+sMatrixRow+'</tr>';
	}
	if ( !_obj.competence_only && ArrayCount( _rows_array ) > 0 )
 	{
		sTableBody = '';
 		for ( _row in _rows_array )
		{
			sMatrixRow = '';
			for ( _zone in _obj.zones )
			{
				cur_zone_value = _row.HasProperty( _zone.zone_id ) ? _row.GetOptProperty( _zone.zone_id ) : undefined;
				sMatrixRow = ( cur_zone_value == undefined ) ? sMatrixRow + '<td>-</td>' : sMatrixRow + '<td>'+String( cur_zone_value )+'</td>';
			}
			sTableBody = sTableBody+'<tr>'+sMatrixRow+'</tr>';
		}
		sIndMatrixBlock = ' <div class="matrix_block ind_table"> \
								<div class="h3">Анализ по индикаторам:</div> \
								<div class="report_table"> \
									<table> \
										<thead> \
											<tr> \
												<td>Сильная зона</td> \
												<td>Зона скрытых возможностей</td> \
												<td>Слепая зона</td> \
												<td>Зона роста</td> \
											</tr> \
										</thead> \
										<tbody>'+sTableBody+'</tbody> \
									</table> \
								</div> \
							</div>';
	}
	sAnalysPageBreak = '';
	iRowsCount = OptInt( ArrayCount(_rows_array)+ArrayCount(_comprows_array), 0 );
	if( iRowsCount <= 10 )
	{
		sAnalysPageBreak = '';
	}
	else if( ArrayCount(_comprows_array) > 15 )
	{
		sAnalysPageBreak = '.analys_page .comp_table { \
								page-break-before: always; \
							} \
							.analys_page .comp_table:before { \
								content: "'+sPersonName+'"; \
								display: block; \
								font-size: 20px; \
								line-height: 24px; \
								text-align: right; \
								color: #E0E0E0; \
								padding: 20px 0 30px 0; \
							}';
	}
	
	sReport = '<!DOCTYPE html> \
	<html lang="ru"> \
	<head> \
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8"/> \
		<style type="text/css"> \
			@font-face { \
				font-family: Montserrat; \
				src: url('+sImagesSourcePath+'/font/Montserrat-Regular.ttf); \
				font-weight: 400; \
				font-style: normal; \
			} \
			@font-face { \
				font-family: Montserrat; \
				src: url('+sImagesSourcePath+'/font/Montserrat-Medium.ttf); \
				font-weight: 500; \
				font-style: normal; \
			} \
			@font-face { \
				font-family: Montserrat; \
				src: url('+sImagesSourcePath+'/font/Montserrat-SemiBold.ttf); \
				font-weight: 600; \
				font-style: normal; \
			} \
			@font-face { \
				font-family: Montserrat; \
				src: url('+sImagesSourcePath+'/font/Montserrat-Bold.ttf); \
				font-weight: 700; \
				font-style: normal; \
			} \
			body { \
				padding: 0; \
				margin: 0; \
				font-family: Montserrat; \
				font-style: normal; \
				font-weight: 400; \
				font-size: 16px; \
				line-height: 20px; \
				color: #000; \
			} \
			p { \
				padding: 0; \
				margin: 0; \
			} \
			ul { \
				list-style: none; \
				margin: 0; \
				padding: 0; \
			} \
			.page { \
				page-break-after: always; \
			} \
				.page:last-child { \
					page-break-after: avoid; \
				} \
				.page:before { \
					content: "'+sPersonName+'"; \
					display: block; \
					font-size: 20px; \
					line-height: 24px; \
					text-align: right; \
					color: #E0E0E0; \
					padding: 20px 37px 0 0; \
				} \
			.content_wrapper { \
				padding: 30px 37px 115px 115px; \
			} \
			.h2 { \
				font-size: 40px; \
				line-height: 49px; \
				color: #4D0100; \
				margin-bottom: 30px; \
			} \
			.h3 { \
				font-weight: 600; \
				font-size: 20px; \
				line-height: 24px; \
				color: #4D0100; \
				margin-bottom: 30px; \
			} \
			.text_block { \
				line-height: 20px; \
				margin-bottom: 25px; \
			} \
			.text_block span { \
				font-weight: 700; \
			} \
				.text_block span:before { \
					content: ""; \
					display: inline-block; \
					width: 18px; \
					height: 16px; \
					margin-right: 10px; \
					border-radius: 3px; \
					background-image: url("'+sImagesSourcePath+'/exclamation.png"); \
				} \
			.content_list li { \
				margin-bottom: 16px; \
			} \
				.content_list li:before { \
					content: ""; \
					display: inline-block; \
					width: 2px; \
					height: 12px; \
					margin-right: 8px; \
					background-color: #C20300; \
					border-radius: 2px; \
				} \
			.report_table { \
				font-size: 15px; \
				line-height: 18px; \
				color: #000000; \
				margin-bottom: 30px; \
			} \
				.report_table table { \
					width: 100%; \
					border-collapse: collapse; \
				} \
				.report_table thead  tr  td { \
					font-weight: 600; \
					padding: 10px 10px 10px 0px; \
					border-bottom: 1px solid #C20300; \
				} \
				.report_table tbody  tr  td { \
					font-weight: 400; \
					padding: 10px 10px 10px 0px; \
					border-bottom: 1px solid #E0E0E0; \
				} \
			.front_page { \
				width: 100%; \
				height: 1397px; \
				position: relative; \
				page-break-after: always; \
			} \
				.front_page img { \
					display: block; \
					width: 100%; \
					height: 100%; \
				} \
				.front_page .title_block { \
					width: 500px; \
					position:absolute; \
					top: 1000px; \
					left: 120px; \
					letter-spacing: 0em; \
					text-align: left; \
				} \
					.title_block .name { \
						font-size: 42px; \
						font-weight: 700; \
						line-height: 51px; \
						margin-bottom: 25px; \
					} \
					.title_block .report { \
						font-size: 24px; \
						font-style: uppercase; \
						font-weight: 500; \
						line-height: 29px; \
						color: #171F36; \
						margin-bottom: 75px; \
					} \
					.title_block .date { \
						font-size: 20px; \
						line-height: 24px; \
						color: #969999; \
					} \
					.title_block .date span { \
						font-weight: 500; \
						color: #C20300; \
					} \
			.contents_page ul { \
				width: 500px; \
				margin-top: 30px; \
				font-size: 20px; \
				line-height: 24px; \
				color: #162037; \
			} \
				.contents_page ul li { \
					padding: 13px 0px; \
					border-bottom: 1px solid #E0E0E0; \
				} \
					.contents_page ul li:before { \
						content: ""; \
						display: inline-block; \
						width: 7px; \
						height: 7px; \
						margin-right: 14px; \
						margin-bottom: 3px; \
						background-color: #C20300; \
					} \
			.intro_page .intro_info{ \
				line-height: 30px; \
				color: #969999; \
				margin-bottom: 45px; \
			} \
				.intro_page .intro_info span { \
					color: #162037; \
				} \
			.intro_main .text_block { \
				font-weight: 500; \
				margin-bottom: 63px; \
			} \
			.intro_main .intro_list_title { \
				font-weight: 500; \
				font-size: 24px; \
				line-height: 29px; \
				color: #4D0100; \
				margin-bottom: 35px; \
			} \
			.intro_main ul li { \
				display: flex; \
				align-items: center; \
				padding: 17px 0px; \
				border-bottom: 1px solid #E0E0E0; \
			} \
				.intro_main ul li .intro_list_image { \
					min-width: 40px; \
					height: 35px; \
					margin-right: 30px; \
				} \
				.intro_main ul li .intro_list_image img { \
					display: block; \
					width: 100%; \
					height: 100%; \
				} \
			.main_parts_page .h3 { \
				margin-top: 50px; \
			} \
			.main_parts_page .text_block { \
				font-weight: 500; \
			} \
			.image_block .image_block_elem { \
				page-break-after: always; \
			} \
				.image_block_elem:first-child:before { \
					content: ""; \
				} \
				.image_block_elem:before { \
					content: "'+sPersonName+'"; \
					display: block; \
					font-size: 20px; \
					line-height: 24px; \
					text-align: right; \
					color: #E0E0E0; \
					padding: 20px 0 30px 0; \
				} \
				.image_block_elem .elem_image { \
					margin-bottom: 50px; \
				} \
				.image_block_elem .elem_image:last-child { \
					margin-bottom: 0px; \
				} \
				.image_block_elem .elem_image img { \
					display: block; \
					width: 100%; \
				} \
				.image_block .image_block_elem:last-child { \
					page-break-after: avoid; \
				} \
				.image_block_elem .break_before_image { \
					page-break-before: always; \
				} \
				.image_block_elem .break_before_image:before { \
					content: "'+sPersonName+'"; \
					display: block; \
					font-size: 20px; \
					line-height: 24px; \
					text-align: right; \
					color: #E0E0E0; \
					padding: 20px 0 30px 0; \
				} \
			.matrix_block .h3 { \
				margin-bottom: 10px; \
			} \
			.analys_page .content_wrapper, .analys_page .content_list { \
				margin-bottom: 0; \
				padding-bottom: 0; \
			} \
			.analys_page .content_list { \
				margin-bottom: 50px; \
			} \
			.analys_page .content_list li span { \
				font-weight: 500; \
			} \
			.analys_page .ind_table { \
				page-break-before: always; \
			} \
			.analys_page .ind_table:before { \
				content: "'+sPersonName+'"; \
				display: block; \
				font-size: 20px; \
				line-height: 24px; \
				text-align: right; \
				color: #E0E0E0; \
				padding: 20px 0 30px 0; \
			} \
			'+sCopmpTablePageBreak+' \
			'+sAnalysPageBreak+' \
		</style> \
	</head> \
	<body> \
	<div class="front_page"> \
		<img src="'+sImagesSourcePath+'/front_page.png" alt=""> \
		<div class="title_block"> \
			<div class="name">'+sPersonName+'</div> \
			<div class="report">Индивидуальный отчет</div> \
			<div class="date">Дата отчета: <span>'+dCurDate+'</span></div> \
		</div> \
	</div> \
	<div class="main_block"> \
		<div class="page contents_page"> \
			<div class="content_wrapper"> \
				<div class="h2">Содержание:</div> \
				<ul> \
					<li>Содержание</li> \
					<li>Введение</li> \
					<li>Основные составляющие отчета</li> \
					<li>Результаты оценки</li> \
					<li>Матричный анализ</li> \
				</ul> \
			</div> \
		</div> \
		<div class="page intro_page"> \
			<div class="content_wrapper"> \
				<div class="h2">Введение</div> \
				<div class="intro_info"> \
					<div>Должность: <span>'+sPositionName+'</span></div> \
					<div>Подразделение: <span>'+sSubdivisionName+'</span></div> \
					<div>Дата оценки: <span>'+dAssessmentDate+'</span></div> \
				</div> \
				<div class="intro_main"> \
					<div class="text_block"><span>Оценка 360 градусов</span> - один из наиболее объективных источников информации о Ваших достижениях. Высокая объективность достигается за счет того, что в процесс оценки вовлечен не только Ваш непосредственный руководитель, но и  люди, достаточно хорошо осведомленные о Ваших профессиональных и личностных качествах: коллеги и лично Вы.</div> \
					<div class="intro_list_title">По результатам Вы сможете:</div> \
					<ul> \
						<li> \
							<div class="intro_list_image"><img src="'+sImagesSourcePath+'/Group 24.png"></div> \
							<div>Повысить личную эффективность, определив свои сильные стороны и зоны роста.</div> \
						</li> \
						<li> \
							<div class="intro_list_image"><img src="'+sImagesSourcePath+'/icon rost.png"></div> \
							<div>Привести Ваши профессиональные качества в соответствие с системой корпоративных ценностей.</div> \
						</li> \
						<li> \
							<div class="intro_list_image"><img src="'+sImagesSourcePath+'/Union.png"></div> \
							<div>Понять   основные   направления   совершенствования   своих   профессиональных   характеристик, сформировать индивидуальный план развития.</div> \
						</li> \
					</ul> \
				</div> \
			</div> \
		</div> \
		<div class="page main_parts_page"> \
			<div class="content_wrapper"> \
				<div class="h2">Основные составляющие отчета</div> \
				<div class="comp_block"> \
					<div class="text_block"><span>Компетенция</span> – набор личностных качеств, умений и навыков, необходимых сотруднику для успешного выполнения работы.</div> \
					<div class="report_table"> \
						<table> \
							<thead> \
								<tr> \
									<td>№</td> \
									<td>Компетенции</td> \
									<td>Определение</td> \
								</tr> \
							</thead> \
							<tbody>'+sCompTable+'</tbody> \
						</table> \
					</div> \
					<div class="main_parts_note">Каждая компетенция включает в себя поведенческие индикаторы.</div> \
				</div> \
				<div class="scales_block"> \
					<div class="text_block"><span>Поведенческие индикаторы</span> - совокупность знаний, навыков и личностных качеств, проявляемых в поведении, которые можно наблюдать, и содержащие описание стандартов поведения персонала.</div> \
					<div class="h3">Шкала оценки компетенций/поведенческих индикаторов:</div> \
					<div class="report_table"> \
						<table> \
							<thead> \
								<tr> \
									<td>Оценка</td> \
									<td>Уровень</td> \
									<td>Описание</td> \
								</tr> \
							</thead> \
							<tbody>'+sScalesTable+'</tbody> \
						</table> \
					</div> \
					<div class="h3">Благодаря методам анализа результатов оценки Вы:</div> \
					<ul class="content_list"> \
						<li>Узнаете Ваши сильные стороны и зоны роста.</li> \
						<li>Узнаете, в каких компетенциях Вы себя недооцениваете, а в каких, наоборот, переоцениваете.</li> \
						<li>Наглядно увидите расхождение между самооценкой и оценками окружающих.</li> \
					</ul> \
				</div> \
			</div> \
		</div> \
		<div class="page results_page"> \
			<div class="content_wrapper"> \
				<div class="h2">Результаты оценки</div> \
				<div class="text_block">Этот раздел состоит из гистограмм по каждой компетенции и поведенческим индикаторам. В гистограмме подробно сравнивается оценка всех групп опрошенных и Ваша самооценка.</div> \
				<div class="image_block">'+sImageBlock+'</div> \
			</div> \
		</div> \
		<div class="page analys_page"> \
			<div class="content_wrapper"> \
				<div class="h2">Матричный анализ</div> \
				<div class="text_block">По соотношению самооценки и оценки окружающих все поведенческие индикаторы можно отнести к сильной зоне и зоне роста оцениваемого, что дает возможность расставить приоритеты при составлении плана развития.</div> \
				<ul class="content_list"> \
					<li><span>Сильная зона</span> - "я и окружающие оценивают мое поведение высоко". Самооценка и оценка окружающих высокая (самооценка и средняя оценка окружающих больше или равна 4).</li> \
					<li><span>Зона скрытых</span> возможностей - "я недооцениваю свои умения, навыки". Самооценка низкая, оценка окружающих высокая (самооценка ниже 4, а средняя оценка окружающих выше или равна 4).</li> \
					<li><span>Слепая зона</span> – "я переоцениваю свои умения, навыки". Самооценка высокая, оценка окружающих низкая (самооценка выше или равна 4, а средняя оценка окружающих ниже 4).</li> \
					<li><span>Зона роста</span> - "я и окружающие оценивают мое поведние низко". Самооценка и оценка окружающих низкая (самооценка и средняя оценка окружающих меньше 4).</li> \
				</ul> \
				<div class="matrix_block comp_table"> \
					<div class="h3">Анализ по компетенциям:</div> \
					<div class="report_table"> \
						<table> \
							<thead> \
								<tr> \
									<td>Сильная зона</td> \
									<td>Зона скрытых возможностей</td> \
									<td>Слепая зона</td> \
									<td>Зона роста</td> \
								</tr> \
							</thead> \
							<tbody>'+sCompMatrixBlock+'</tbody> \
						</table> \
					</div> \
				</div>'+sIndMatrixBlock+'</div> \
		</div> \
	</div> \
	</body> \
	</html>';
	try
	{
		var oPdfGenerator = tools.get_object_assembly('PdfGenerator');
		oPdfGenerator.InitSelectPDF();
		bParam = oPdfGenerator.SelectPDFfromHTMLString(sReport, UrlToFilePath(sFilePath));
		
		oResult.error = !bParam;
		oResult.file_path = sFilePath;
	}
	catch(e)
	{
		Log( "Ошибка при построении отчета: "+e );
	}
	
	return oResult;
}
