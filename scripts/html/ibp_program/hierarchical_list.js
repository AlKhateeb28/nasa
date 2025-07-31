<%
// 6885286210718677252
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "DATATREE", // for error msgs
        sBlockPrefix: "block_datatree", // for common get_web_param calls
        sConstructor: "WTLPDataTree" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS (HAS COLLECTION) */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    oBData.bRefresh = bRefresh;
    var aRuntimeParamsToDelete = [ "iActionId", "iCollectionId", "sActionParams", "sCollectionType" ];
    for(i=0; i<aRuntimeParamsToDelete.length; i++)
    {
        oBData.oParams.DeleteOptProperty(aRuntimeParamsToDelete[i]);
    }
    for(oElem in oBData.aItems)
    {
        oElem.img = _Substitute({ sText: oElem.img });
        oElem.preheader = _Substitute({ sText: oElem.preheader });
        oElem.header = _Substitute({ sText: oElem.header });
        oElem.subheader1 = _Substitute({ sText: oElem.subheader1 });
        oElem.subheader2 = _Substitute({ sText: oElem.subheader2 });
        oElem.text = _Substitute({ sText: oElem.text });
        oElem.css_class = _Substitute({ sText: oElem.css_class });
        oElem.link = _Substitute({ sText: oElem.link });
        oElem.floater = _Substitute({ sText: oElem.floater });
        oElem.floater_class = _Substitute({ sText: oElem.floater_class });
        oElem.floater_color = _Substitute({ sText: oElem.floater_color });
        oElem.btn_text = _Substitute({ sText: oElem.btn_text });
        oElem.switch_text = _Substitute({ sText: oElem.switch_text });
    }
    oBData.oParams.sMultipleActionsHeader = _Substitute({ sText: oBData.oParams.sMultipleActionsHeader });
    oBData.oParams.sBtnText = _Substitute({ sText: oBData.oParams.sBtnText });
    oBData.oParams.sSwitchText = _Substitute({ sText: oBData.oParams.sSwitchText });
    oBData.oParams.sMsgEmpty = _Substitute({ sText: oBData.oParams.sMsgEmpty });
    oBData.oParams.sCommonActionParams = _Substitute({ sText: oBData.oParams.sCommonActionParams });
    oBData.oParams.sCollectionParams = _Substitute({ sText: oBData.oParams.sCollectionParams });
    oBData.oParams.sCommonCollectionParams = _Substitute({ sText: oBData.oParams.sCommonCollectionParams });

    tools_lp.update_runtime_env({ oData: oBData });
    if(oBData.GetOptProperty("iMyTab")!=undefined)
    {
        g_oALL[sHexOWTId].oRuntimeData.sMyTabBlockId = oBData.GetOptProperty("sMyTabBlockId");
        g_oALL[sHexOWTId].oRuntimeData.iMyTab = oBData.GetOptProperty("iMyTab");
    }
    return oBData;
}
function _CUSTOM_BuildData(oArgs)
{
    if(!g_oALL[sHexOWTId].oRuntimeData.oParams.HasProperty("bDeferredLoading"))
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading = false;
    }
    g_oALL[sHexOWTId].oRuntimeData.aItems = [];
    g_oALL[sHexOWTId].oRuntimeData.oCollectionParams = {};
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal && g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
    {
        if(!bLPE && g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading && !bRefresh)
        {
            g_oALL[sHexOWTId].oRuntimeData.iTotal = 0;
            g_oALL[sHexOWTId].oRuntimeData.bFirstLoad = true;
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.bFirstLoad = false;

            COMMON_FillCollectionParams();

            g_oALL[sHexOWTId].aFldsToSub = [ EncodeJson(g_oALL[sHexOWTId].aColVars, { ExportLargeIntegersAsStrings: true } ) ];
            if(!g_bFCache)
            {
                var oResult = _EvalCollection({ oData: g_oALL[sHexOWTId].oRuntimeData, aChildVars: g_oALL[sHexOWTId].aColVars, iCollectionId: g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId });
                var iInt;
                if(oResult.HasProperty("result") && IsArray(oResult.result))
                {
                    g_oALL[sHexOWTId].oRuntimeData.aResult = oResult.result;
                    for(oElem in oResult.result)
                    {
                        if(!oElem.HasProperty("parent_id"))
                        {
                            oElem.parent_id = "";
                            oElem.hex_parent_id = "";
                        }
                        else
                        {
                            iInt = OptInt(oElem.parent_id);
                            oElem.hex_parent_id = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : oElem.parent_id);
                        }
                        iInt = OptInt(oElem.id);
                        oElem.hex_id = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : oElem.id);
                        g_oALL[sHexOWTId].oRuntimeData.aItems.push(
                            {
                                id: String(oElem.id),
                                hex_id: oElem.hex_id,
                                parent_id: oElem.parent_id,
                                hex_parent_id: oElem.hex_parent_id,
                                img: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sImg", sParam: "img" }),
                                preheader:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sPreHeader", sParam: "header" }),
                                header:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sHeader", sParam: "header" }),
                                subheader1:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sSubheader1", sParam: "subheader1" }),
                                subheader2:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sSubheader2", sParam: "subheader2" }),
                                text: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sText", sParam: "text" }),
                                css_class: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sCSSClass", sParam: "css_class" }),
                                link: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sLink", sParam: "link" }),
                                floater: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloater", sParam: "floater" }),
                                floater_class: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloaterClass", sParam: "css_floater" }),
                                floater_color: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloaterColor", sParam: "floater_color" }),
                                btn_text: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sBtnText", sParam: "btn_text" }),
                                switch_text: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sSwitchText", sParam: "switch_text" })
                            });
                    }
                }
                else
                {
                    var sError = g_oALL[sHexOWTId].sTemplateName + " ERROR obtaining data array from collection " + g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId + ". ";
                    if(oResult.HasProperty("messageText"))
                    {
                        sError += oResult.messageText;
                    }
                    throw sError;
                }
            }
        }
    }

    tools_lp.update_runtime_env({ oData: g_oALL[sHexOWTId].oRuntimeData }); // to save "inside tab" params

    if(!bLPE && g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType=="remote_action" && g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId!=0)
    {
        _AppendActionParams({ oData: g_oALL[sHexOWTId].oRuntimeData, iActionId: g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId }); // appends to current oRuntimeData
    }
    else if(g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType=="multiple_remote")
    {
        g_oALL[sHexOWTId].oRuntimeData.aRemoteActions = [];
        var aRemoteActions = tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".__remote_actions__"), [], true );
        var iRAId;
        for(oElem in aRemoteActions)
        {
            if(oElem.__remote_action_item_id__ != undefined && oElem.__remote_action_item_id__ != "")
            {
                iRAId = OptInt(oElem.__remote_action_item_id__);
                if(iRAId!=undefined)
                {
                    g_oALL[sHexOWTId].oRuntimeData.aRemoteActions.push(
                        {
                            iActionId: iRAId,
                            sHexActionId: ("0x" + StrHexInt(iRAId, 16)),
                            sTitle: oElem.__remote_action_item_name__,
                            sParams: oElem.__remote_action_item_params__,
                            oParams: {}
                        });
                    _AppendMultipleActionParams({ oData: g_oALL[sHexOWTId].oRuntimeData, iActionId: iRAId, oActionItem: g_oALL[sHexOWTId].oRuntimeData.aRemoteActions[g_oALL[sHexOWTId].oRuntimeData.aRemoteActions.length-1] });
                }
            }
        }
    }
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "bDisplayAsSequence", var_name: "display_as_sequence", type: "bool", def: true },
            { name: "bCollapsedByDefault", var_name: "collapsed_by_default", type: "bool", def: true },
            { name: "bDisplayConnectors", var_name: "display_connectors", type: "bool", def: true },

            { name: "bDisplayImg", var_name: "display_image", type: "bool", def: false },
            { name: "bDisplayPreHeader", var_name: "display_preheader", type: "bool", def: false },
            { name: "bDisplayHeader", var_name: "display_header", type: "bool", def: true },
            { name: "bDisplaySubHeader1", var_name: "display_subheader1", type: "bool", def: false },
            { name: "bDisplaySubHeader2", var_name: "display_subheader2", type: "bool", def: false },
            { name: "bSubheadersByColumns", var_name: "subheaders_by_columns", type: "bool", def: true },
            { name: "bDisplayBtn", var_name: "display_button", type: "bool", def: true },
            { name: "bDisplayBtnDisabled", var_name: "display_button_disabled", type: "bool", def: false },
            { name: "bDisplayFloater", var_name: "display_floater", type: "bool", def: false },
            { name: "nMarginInterItem", var_name: "margin_inter_item", type: "real", def: 2 },

            { name: "bItemHasBG", var_name: "item_has_bg", type: "bool", def: true },
            { name: "sColorItemBG", var_name: "color_item_bg", type: "string", def: "#fff" },
            { name: "sColorItemBGHover", var_name: "color_item_bg_hover", type: "string", def: "#dbe5f1" },
            { name: "bItemHasBorder", var_name: "item_has_border", type: "bool", def: true },
            { name: "sColorItemBorder", var_name: "color_item_border", type: "string", def: "#e2e3e4" },
            { name: "sColorItemBorderHover", var_name: "color_item_border_hover", type: "string", def: "#b8cce4" },
            { name: "iItemBorderWidth", var_name: "item_border_size", type: "int", def: 1 },
            { name: "bItemIsRounded", var_name: "item_is_rounded", type: "bool", def: false },
            { name: "bItemHasShadow", var_name: "item_has_shadow", type: "bool", def: false },
            { name: "nItemPaddingLeft", var_name: "item_padding_left", type: "real", def: 2 },
            { name: "nItemPaddingRight", var_name: "item_padding_right", type: "real", def: 2 },
            { name: "nItemPaddingTop", var_name: "item_padding_top", type: "real", def: 2 },
            { name: "nItemPaddingBottom", var_name: "item_padding_bottom", type: "real", def: 2 },

            { name: "sImgPosition", var_name: "img_position", type: "string", def: "left" },
            { name: "nImgMargin", var_name: "img_margin", type: "real", def: 2 },
            { name: "iImgWidth", var_name: "img_width", type: "int", def: 20 },
            { name: "iImgHeight", var_name: "img_height", type: "int", def: 100 },
            { name: "sColorImgBG", var_name: "color_img_bg", type: "string", def: "#e2e3e4" },
            { name: "bImgRound", var_name: "img_round", type: "bool", def: false },
            { name: "bImgIsRounded", var_name: "img_is_rounded", type: "bool", def: true },
            { name: "bImgHasShadow", var_name: "img_has_shadow", type: "bool", def: false },

            { name: "sPreHeaderAlign", var_name: "preheader_align", type: "string", def: "left" },
            { name: "nPreHeaderMargin", var_name: "preheader_margin", type: "real", def: 0 },
            { name: "sPreHeaderFontFamily", var_name: "preheader_font_family", type: "string", def: "Roboto" },
            { name: "sPreHeaderFontFamilyCustom", var_name: "preheader_font_family_custom", type: "string", def: "" },
            { name: "sPreHeaderFontSize", var_name: "preheader_font_size", type: "string", def: "small" },
            { name: "sPreHeaderFontWeight", var_name: "preheader_font_weight", type: "string", def: "normal" },
            { name: "sPreHeaderFontStyle", var_name: "preheader_font_style", type: "string", def: "normal" },
            { name: "sPreHeaderFontColor", var_name: "color_preheader_font", type: "string", def: "#999999" },

            { name: "sHeaderAlign", var_name: "header_align", type: "string", def: "left" },
            { name: "nHeaderMargin", var_name: "header_margin", type: "real", def: 0 },
            { name: "sHeaderFontFamily", var_name: "header_font_family", type: "string", def: "Roboto" },
            { name: "sHeaderFontFamilyCustom", var_name: "header_font_family_custom", type: "string", def: "" },
            { name: "sHeaderFontSize", var_name: "header_font_size", type: "string", def: "large" },
            { name: "sHeaderFontWeight", var_name: "header_font_weight", type: "string", def: "bold" },
            { name: "sHeaderFontStyle", var_name: "header_font_style", type: "string", def: "normal" },
            { name: "sHeaderFontColor", var_name: "color_header_font", type: "string", def: "#4176ea" },
            { name: "sHeaderFontColorHover", var_name: "color_header_font_hover", type: "string", def: "#355bbb" },

            { name: "sSubheader1Align", var_name: "subheader1_align", type: "string", def: "left" },
            { name: "nSubheader1Margin", var_name: "subheader1_margin", type: "real", def: 0 },
            { name: "sSubheader1FontFamily", var_name: "subheader1_font_family", type: "string", def: "Roboto" },
            { name: "sSubheader1FontFamilyCustom", var_name: "subheader1_font_family_custom", type: "string", def: "" },
            { name: "sSubheader1FontSize", var_name: "subheader1_font_size", type: "string", def: "small" },
            { name: "sSubheader1FontWeight", var_name: "subheader1_font_weight", type: "string", def: "normal" },
            { name: "sSubheader1FontStyle", var_name: "subheader1_font_style", type: "string", def: "normal" },
            { name: "sSubheader1FontColor", var_name: "color_subheader1_font", type: "string", def: "#999999" },

            { name: "sSubheader2Align", var_name: "subheader2_align", type: "string", def: "left" },
            { name: "nSubheader2Margin", var_name: "subheader2_margin", type: "real", def: 0 },
            { name: "sSubheader2FontFamily", var_name: "subheader2_font_family", type: "string", def: "Roboto" },
            { name: "sSubheader2FontFamilyCustom", var_name: "subheader2_font_family_custom", type: "string", def: "" },
            { name: "sSubheader2FontSize", var_name: "subheader2_font_size", type: "string", def: "small" },
            { name: "sSubheader2FontWeight", var_name: "subheader2_font_weight", type: "string", def: "normal" },
            { name: "sSubheader2FontStyle", var_name: "subheader2_font_style", type: "string", def: "normal" },
            { name: "sSubheader2FontColor", var_name: "color_subheader2_font", type: "string", def: "#999999" },

            { name: "sTextAlign", var_name: "text_align", type: "string", def: "left" },
            { name: "nTextMargin", var_name: "text_margin", type: "real", def: 0 },
            { name: "sTextFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sTextFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sTextFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sTextFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sTextFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sTextFontColor", var_name: "color_font", type: "string", def: "#262626" },

            { name: "sBtnPosition", var_name: "btn_position", type: "string", def: "left" },
            { name: "sBtnFontFamily", var_name: "btn_font_family", type: "string", def: "Roboto" },
            { name: "sBtnFontFamilyCustom", var_name: "btn_font_family_custom", type: "string", def: "" },
            { name: "sBtnFontSize", var_name: "btn_font_size", type: "string", def: "medium" },
            { name: "sBtnFontWeight", var_name: "btn_font_weight", type: "string", def: "bold" },
            { name: "sBtnFontStyle", var_name: "btn_font_style", type: "string", def: "normal" },
            { name: "sBtnFontColor", var_name: "color_btn_font", type: "string", def: "#fff" },
            { name: "sBtnFontColorHover", var_name: "color_btn_font_hover", type: "string", def: "#fff" },
            { name: "sBtnFontColorDisabled", var_name: "color_btn_font_disabled", type: "string", def: "#999" },
            { name: "bBtnHasBG", var_name: "btn_has_bg", type: "bool", def: true },
            { name: "sColorBtnBG", var_name: "color_btn_bg", type: "string", def: "#4176ea" },
            { name: "sColorBtnBGHover", var_name: "color_btn_bg_hover", type: "string", def: "#355bbb" },
            { name: "sColorBtnBGDisabled", var_name: "color_btn_bg_disabled", type: "string", def: "#e2e3e4" },
            { name: "bBtnHasBorder", var_name: "btn_has_border", type: "bool", def: true },
            { name: "sColorBtnBorder", var_name: "color_btn_border", type: "string", def: "#4176ea" },
            { name: "sColorBtnBorderHover", var_name: "color_btn_border_hover", type: "string", def: "#355bbb" },
            { name: "sColorBtnBorderDisabled", var_name: "color_btn_border_disabled", type: "string", def: "#e2e3e4" },
            { name: "iBtnBorderWidth", var_name: "btn_border_size", type: "int", def: 1 },
            { name: "bBtnIsRounded", var_name: "btn_is_rounded", type: "bool", def: false },
            { name: "bBtnHasShadow", var_name: "btn_has_shadow", type: "bool", def: false },
            { name: "nBtnPaddingLeft", var_name: "btn_padding_left", type: "real", def: 2 },
            { name: "nBtnPaddingRight", var_name: "btn_padding_right", type: "real", def: 2 },
            { name: "nBtnPaddingTop", var_name: "btn_padding_top", type: "real", def: 0.5 },
            { name: "nBtnPaddingBottom", var_name: "btn_padding_bottom", type: "real", def: 0.5 },

            { name: "sFloaterPosition", var_name: "floater_position", type: "string", def: "top-left" },
            { name: "sFloaterTextAlign", var_name: "floater_text_align", type: "string", def: "center" },
            { name: "iFloaterWidth", var_name: "floater_width", type: "int", def: 50 },
            { name: "nFloaterMarginH", var_name: "floater_margin_h", type: "real", def: 1 },
            { name: "nFloaterMarginV", var_name: "floater_margin_v", type: "real", def: 1 },
            { name: "bFloaterOnImg", var_name: "floater_on_img", type: "bool", def: false },
            { name: "bFloaterHasBG", var_name: "floater_has_bg", type: "bool", def: true },
            { name: "sColorFloaterBG", var_name: "color_floater_bg", type: "string", def: "#4176ea" },
            { name: "bFloaterHasBorder", var_name: "floater_has_border", type: "bool", def: false },
            { name: "sColorFloaterBorder", var_name: "color_floater_border", type: "string", def: "#4176ea" },
            { name: "iFloaterBorderWidth", var_name: "floater_border_width", type: "int", def: 2 },
            { name: "sFloaterFontFamily", var_name: "font_family_floater", type: "string", def: "Roboto" },
            { name: "sFloaterFontFamilyCustom", var_name: "font_family_floater_custom", type: "string", def: "" },
            { name: "sFloaterFontSize", var_name: "font_size_floater", type: "string", def: "small" },
            { name: "sFloaterFontWeight", var_name: "font_weight_floater", type: "string", def: "normal" },
            { name: "sFloaterFontStyle", var_name: "font_style_floater", type: "string", def: "normal" },
            { name: "sFloaterFontColor", var_name: "color_floater_font", type: "string", def: "#FFFFFF" },
            { name: "bFloaterIsRounded", var_name: "floater_is_rounded", type: "bool", def: true },
            { name: "nFloaterPaddingLeft", var_name: "floater_padding_left", type: "real", def: 0.5 },
            { name: "nFloaterPaddingRight", var_name: "floater_padding_right", type: "real", def: 0.5 },
            { name: "nFloaterPaddingTop", var_name: "floater_padding_top", type: "real", def: 0.2 },
            { name: "nFloaterPaddingBottom", var_name: "floater_padding_bottom", type: "real", def: 0.2 },
            { name: "bFloaterHasShadow", var_name: "floater_has_shadow", type: "bool", def: false },

            { name: "sSwitchPosition", var_name: "switch_position", type: "string", def: "left" },
            { name: "sSwitchChildrenDisplay", var_name: "switch_children_display", type: "string", def: "(" },
            { name: "sSwitchFontFamily", var_name: "switch_font_family", type: "string", def: "Roboto" },
            { name: "sSwitchFontFamilyCustom", var_name: "switch_font_family_custom", type: "string", def: "" },
            { name: "sSwitchFontSize", var_name: "switch_font_size", type: "string", def: "medium" },
            { name: "sSwitchFontWeight", var_name: "switch_font_weight", type: "string", def: "normal" },
            { name: "sSwitchFontStyle", var_name: "switch_font_style", type: "string", def: "normal" },
            { name: "sSwitchFontColor", var_name: "color_switch_font", type: "string", def: "#4176ea" },
            { name: "sSwitchFontColorHover", var_name: "color_switch_font_hover", type: "string", def: "#355bbb" },
            { name: "sConnectorColor", var_name: "color_connector", type: "string", def: "#c2c3c4" },

            { name: "bBlockHasBG", var_name: "use_bg", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_bg", type: "string", def: "#ffffff" },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "use_border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockBorderWidth", var_name: "border_size", type: "int", def: 1 },
            { name: "bBlockIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "bBlockHasShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 2 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 2 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 2 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 2 },
            { name: "sBtnText", var_name: "btn_text", type: "string", def: "Open" },
            { name: "sSwitchText", var_name: "switch_text", type: "string", def: "Items" },
            { name: "sWhenEmpty", var_name: "when_empty", type: "string", def: "none" },
            { name: "sTargetType", var_name: "target_type", type: "string", def: "_self" }
        ];
    aDesignParams = ArrayUnion(aDesignParams, aMsgEmptyDesignParams); // typical msg empty params
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels = tools_web.get_web_param( curParams, g_oALL[sHexOWTId].sBlockPrefix + ".item_levels", [], true );
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sMultipleActionsHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMultipleActionsHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sCommonActionParams!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sCommonActionParams);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sCollectionParams!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sCollectionParams);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sCommonCollectionParams!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sCommonCollectionParams);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBtnText!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBtnText);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sSwitchText!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sSwitchText);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sMsgEmpty!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMsgEmpty);
    }
    g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.aItems);
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTMLData = "";

    var aLegacyDesignUpdates =
        [
            { name: "aItemLevels", value: [] },
            { name: "bDisplayConnectors", value: true },
            { name: "bDisplayFloater", value: false },
            { name: "sFloaterPosition", value: "top-left" },
            { name: "sFloaterTextAlign", value: "center" },
            { name: "iFloaterWidth", value: 50 },
            { name: "nFloaterMarginH", value: 1 },
            { name: "nFloaterMarginV", value: 1 },
            { name: "bFloaterOnImg", value: false },
            { name: "bFloaterHasBG", value: true },
            { name: "sColorFloaterBG", value: "#4176ea" },
            { name: "bFloaterHasBorder", value: false },
            { name: "sColorFloaterBorder", value: "#4176ea" },
            { name: "iFloaterBorderWidth", value: 2 },
            { name: "sFloaterFontFamily", value: "Roboto" },
            { name: "sFloaterFontFamilyCustom", value: "" },
            { name: "sFloaterFontSize", value: "small" },
            { name: "sFloaterFontWeight", value: "normal" },
            { name: "sFloaterFontStyle", value: "normal" },
            { name: "sFloaterFontColor", value: "#FFFFFF" },
            { name: "bFloaterIsRounded", value: true },
            { name: "nFloaterPaddingLeft", value: 0.5 },
            { name: "nFloaterPaddingRight", value: 0.5 },
            { name: "nFloaterPaddingTop", value: 0.2 },
            { name: "nFloaterPaddingBottom", value: 0.2 },
            { name: "bFloaterHasShadow", value: false },
            { name: "sSwitchPosition", value: "left" }
        ];
    if(aLegacyDesignUpdates.length>0 && g_oALL[sHexOWTId].oDesignData!=null)
    {
        g_oALL[sHexOWTId].oDesignData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oDesignData.oParams, aLegacyDesignUpdates);
    }
    /* START DESIGN SECTION - no substitutions here, no runtime data in this section */
    var sDivider1 = "&nbsp;(";
    var sDivider2 = ")";
    switch(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchChildrenDisplay)
    {
        case "[":
        {
            sDivider1 = "&nbsp;[";
            sDivider2 = "]";
            break;
        }
        case ":":
        {
            sDivider1 = ":&nbsp;";
            sDivider2 = "";
            break;
        }
        case "-":
        {
            sDivider1 = "&nbsp;-&nbsp;";
            sDivider2 = "";
            break;
        }
    }
    var sCSSToAppend = "";

    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var aWorkareaClasses = [ "wt-lp-datatree-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });

    var aMsgEmptyCSS = _GetMsgEmptyCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aWrapperClasses = [ "wt-lp-wlist-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWrapperCSS = tools_lp.get_block_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? '' : ' wt-sub-bg="sBlockImgLink"';

    var aListClasses = [ "wt-lp-datatree-list", "wt-lp-datatree-list-" + (g_oALL[sHexOWTId].oDesignData.oParams.bDisplayAsSequence ? "sequence" : "tree") ];
    var aListCSS = [ ];

    var aItemClasses = [ "wt-lp-datatree-item" ];
    var aItemCSS = [ "padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em" ];
    var aItemLevel0CSS = [ "padding-left:0;background-image:none" ];
    var aItemLastCSS = [];
    var sColorEscaped = (StrBegins(g_oALL[sHexOWTId].oDesignData.oParams.sConnectorColor, "#") ? StrReplace(g_oALL[sHexOWTId].oDesignData.oParams.sConnectorColor, "#", "%23") : g_oALL[sHexOWTId].oDesignData.oParams.sConnectorColor);
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayConnectors)
    {
        if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayAsSequence)
        {
            aItemCSS.push("padding-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em;background-repeat:repeat-y,no-repeat;background-position:left top,left " + (0.5*g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem) + "em;background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em");
            aItemCSS.push("background-image:url('data:image/svg+xml;charset=utf8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3A" + sColorEscaped + "%22%20preserveAspectRatio%3D%22none%22%3E%3Cpath%20d%3D%22M0%2C0%200%2C32%202%2C32%202%2C0%20Z%22%2F%3E%3C%2Fsvg%3E'),url('data:image/svg+xml;charset=utf8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3A" + sColorEscaped + "%22%3E%3Cpath%20d%3D%22M32%2C16.009c0-0.267-0.11-0.522-0.293-0.714%20l-9.899-9.999c-0.391-0.395-1.024-0.394-1.414%2C0c-0.391%2C0.394-0.391%2C1.034%2C0%2C1.428l8.193%2C8.275H1c-0.552%2C0-1%2C0.452-1%2C1.01%20s0.448%2C1.01%2C1%2C1.01h27.586l-8.192%2C8.275c-0.391%2C0.394-0.39%2C1.034%2C0%2C1.428c0.391%2C0.394%2C1.024%2C0.394%2C1.414%2C0l9.899-9.999%20C31.894%2C16.534%2C31.997%2C16.274%2C32%2C16.009z%22%20%2F%3E%3C%2Fsvg%3E')");
            aItemLastCSS.push("background-repeat:no-repeat,no-repeat;background-position:left top,left " + (0.5*g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem) + "em;background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em," + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em");
        }
        else
        {
            aItemCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em bottom;background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em");
            aItemCSS.push("background-image:url('data:image/svg+xml;charset=utf8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3A" + sColorEscaped + "%22%3E%3Cpath%20d%3D%22M23.05%2C22a1%2C1%2C0%2C0%2C0-1.41%2C0L17%2C26.56V3a1%2C1%2C0%2C1%2C0-2%2C0V26.53L10.47%2C22a1%2C1%2C0%2C0%2C0-1.42%2C0%2C1%2C1%2C0%2C0%2C0%2C0%2C1.41l6.37%2C6.37a.9.9%2C0%2C0%2C0%2C1.27%2C0l6.36-6.37A1%2C1%2C0%2C0%2C0%2C23.05%2C22Z%22%20%2F%3E%3C%2Fsvg%3E')");
        }
    }
    var aItemContainerClasses = [ "wt-lp-datatree-item-container" ];
    var aItemContainerCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingLeft + "em" ];
    var aItemContainerCSSHover = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG)
    {
        aItemContainerClasses.push("wt-lp-has-bg");
        aItemContainerCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBG);
        aItemContainerCSSHover.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBGHover);
        if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasShadow)
        {
            aItemContainerClasses.push("wt-lp-has-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder)
    {
        aItemContainerClasses.push("wt-lp-has-border");
        aItemContainerCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iItemBorderWidth + "px");
        aItemContainerCSSHover.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBorderHover);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bItemIsRounded)
    {
        aItemContainerClasses.push("wt-lp-is-rounded");
    }

    var aItemBodyClasses = [ "wt-lp-datatree-item-body" ];
    var aItemBodyCSS = [ ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayImg && g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="right")
    {
        aItemBodyCSS.push("flex-direction:row-reverse");
    }

    var aItemImgWrapperClasses = [ "wt-lp-datatree-item-img-wrapper" ];
    var aItemImgWrapperCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayImg)
    {
        aItemImgWrapperCSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.iImgWidth + "%;background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorImgBG);
        aItemImgWrapperCSS.push("margin-" + (g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="right" ? "left:" : "right:") + g_oALL[sHexOWTId].oDesignData.oParams.nImgMargin + "em");
        if(g_oALL[sHexOWTId].oDesignData.oParams.bImgRound)
        {
            sCSSToAppend += ".wt-lp-datatree-item-img-wrapper:before { content: ''; padding-top:100%; float: left; } ";
            aItemImgWrapperClasses.push("wt-lp-datatree-img-round");
        }
        else
        {
            sCSSToAppend += ".wt-lp-datatree-item-img-wrapper:before { content: ''; padding-top: " + g_oALL[sHexOWTId].oDesignData.oParams.iImgHeight + "%; float: left; } ";
            if(g_oALL[sHexOWTId].oDesignData.oParams.bImgIsRounded)
            {
                aItemImgWrapperClasses.push("wt-lp-is-rounded");
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bImgHasShadow)
        {
            aItemImgWrapperClasses.push("wt-lp-has-shadow");
        }
    }

    var aItemContentClasses = [ "wt-lp-datatree-item-content" ];
    var aItemContentCSS = [];

    var aPreHeaderClasses = [ "wt-lp-datatree-preheader" ];
    var aPreHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sPreHeaderFont" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sPreHeaderAlign + ";padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nPreHeaderMargin + "em" ];

    var aItemHeaderClasses = [ "wt-lp-datatree-item-header" ];
    var aItemHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sHeaderFont" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sHeaderAlign + ";padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nHeaderMargin + "em" ];

    var aItemSubheaderBlockClasses = [ "wt-lp-datatree-item-subheader-block" ];
    var aItemSubheaderBlockCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySubHeader1 && g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySubHeader2 && g_oALL[sHexOWTId].oDesignData.oParams.bSubheadersByColumns)
    {
        aItemSubheaderBlockClasses.push("wt-lp-datatree-item-subheaders-row");
    }

    var aItemSubheader1Classes = [ "wt-lp-datatree-item-subheader1" ];
    var aItemSubheader1CSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSubheader1Font" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sSubheader1Align + ";padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nSubheader1Margin + "em" ];

    var aItemSubheader2Classes = [ "wt-lp-datatree-item-subheader2" ];
    var aItemSubheader2CSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSubheader2Font" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sSubheader2Align + ";padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nSubheader2Margin + "em"];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySubHeader1 && g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySubHeader2 && g_oALL[sHexOWTId].oDesignData.oParams.bSubheadersByColumns)
    {
        aItemSubheader1CSS.push("padding-right:1em");
        aItemSubheader2CSS.push("padding-left:1em");
    }

    var aItemTextClasses = [ "wt-lp-datatree-item-text" ];
    var aItemTextCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sTextFont" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sTextAlign + ";padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nTextMargin + "em" ];

    var aItemBtnContainerClasses = [ "wt-lp-datatree-item-btns" ];
    var aItemBtnContainerCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sBtnPosition=="right")
    {
        aItemBtnContainerClasses.push("wt-lp-datatree-item-btns-right");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sBtnPosition=="right_side")
    {
        aItemBtnContainerClasses.push("wt-lp-datatree-item-btns-right-side");
    }

    var aItemBtnClasses = [ "wt-lp-datatree-item-btn" ];
    var aItemBtnCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sBtnFont" }), ("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingLeft + "em") ];
    var aItemBtnCSSHover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBtnFontColorHover ];
    var aItemBtnCSSDisabled = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBtnFontColorDisabled ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBtnHasBG)
    {
        aItemBtnClasses.push("wt-lp-has-bg");
        aItemBtnCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBG);
        aItemBtnCSSHover.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBGHover);
        aItemBtnCSSDisabled.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBGDisabled);
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBtnHasShadow)
        {
            aItemBtnClasses.push("wt-lp-has-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBtnHasBorder)
    {
        aItemBtnClasses.push("wt-lp-has-border");
        aItemBtnCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBtnBorderWidth + "px");
        aItemBtnCSSHover.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBorderHover);
        aItemBtnCSSDisabled.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBtnBorderDisabled);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bBtnHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bBtnHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bBtnIsRounded)
    {
        aItemBtnClasses.push("wt-lp-datatree-item-btn-rounded");
    }

    var aItemSwitchClasses = [ "wt-lp-datatree-toggle-children" ];
    var aItemSwitchCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSwitchFont", bOmitColor: true }) ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchPosition=="right")
    {
        aItemSwitchCSS.push("margin-left:auto");
    }

    var aChildrenListClasses = [ "wt-lp-datatree-children-list" ];
    var aChildrenListCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em 0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayConnectors)
    {
        aChildrenListCSS.push("background-size:"  + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em");
        if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayAsSequence)
        {
            aChildrenListCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em top");
            aChildrenListCSS.push("background-image:url('data:image/svg+xml;charset=utf8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3A" + sColorEscaped + "%22%3E%3Cpath%20d%3D%22M0%2C0%200%2C32%202%2C32%202%2C0%20Z%22%2F%3E%3C%2Fsvg%3E')");
        }
        else
        {
            aChildrenListCSS.push("background-position:" + (2.0*g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem) + "em top");
            aChildrenListCSS.push("background-image:url('data:image/svg+xml;charset=utf8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3A" + sColorEscaped + "%22%3E%3Cpath%20d%3D%22M23.05%2C22a1%2C1%2C0%2C0%2C0-1.41%2C0L17%2C26.56V3a1%2C1%2C0%2C1%2C0-2%2C0V26.53L10.47%2C22a1%2C1%2C0%2C0%2C0-1.42%2C0%2C1%2C1%2C0%2C0%2C0%2C0%2C1.41l6.37%2C6.37a.9.9%2C0%2C0%2C0%2C1.27%2C0l6.36-6.37A1%2C1%2C0%2C0%2C0%2C23.05%2C22Z%22%20%2F%3E%3C%2Fsvg%3E')");
        }
    }
    var aFloaterClasses = [];
    var aFloaterCSS = [];
    var aFloaterTextCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayFloater)
    {
        aFloaterClasses = [ "wt-lp-datatree-floater" ];
        aFloaterTextCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sFloaterFont", sSizePrefix: "note", bArray: true });
        aFloaterCSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.iFloaterWidth + "%");
        aFloaterCSS.push("text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sFloaterTextAlign);
        aFloaterCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterPaddingLeft + "em");
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sFloaterPosition)
        {
            case "top-left":
            case "bottom-left":
            {
                aFloaterCSS.push("left:0;margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterMarginH + "em");
                break;
            }
            case "top-right":
            case "bottom-right":
            {
                aFloaterCSS.push("right:0;margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterMarginH + "em");
                break;
            }
        }
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sFloaterPosition)
        {
            case "top-left":
            case "top-right":
            {
                aFloaterCSS.push("top:0;margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterMarginV + "em");
                break;
            }
            case "bottom-left":
            case "bottom-right":
            {
                aFloaterCSS.push("bottom:0;margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nFloaterMarginV + "em");
                break;
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasBG)
        {
            aFloaterCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorFloaterBG);
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasBorder)
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-border");
            aFloaterCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorFloaterBorder);
            aFloaterCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iFloaterBorderWidth + "px");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bFloaterIsRounded && (g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasBorder))
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-rounded");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasShadow && g_oALL[sHexOWTId].oDesignData.oParams.bFloaterHasBG)
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-shadow");
        }
    }


    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list {" + aChildrenListCSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item {" + aItemCSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list .wt-lp-datatree-item:last-child {" + aItemLastCSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-list-tree > .wt-lp-datatree-item {" + aItemLevel0CSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item .wt-lp-datatree-item-container {" + aItemContainerCSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item:hover .wt-lp-datatree-item-container {" + aItemContainerCSSHover.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item-btn {" + aItemBtnCSS.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item-btn:not([disabled]):hover {" + aItemBtnCSSHover.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-item-btn[disabled] {" + aItemBtnCSSDisabled.join(';') + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-toggle-children:hover { color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColor + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-toggle-children:hover { color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-toggle-children svg { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColor + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-toggle-children:hover svg { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; } ";
    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-toggle-children:hover svg { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; } ";

    var sPreHeaderCSS = "";
    var sHeaderCSS = "";
    var sSubHeader1CSS = "";
    var sSubHeader2CSS = "";
    var sTextCSS = "";
    var sBtnCSS = "";
    var sSwitchCSS = "";
    var sFloaterCSS = "";
    var sFloaterTextCSS = "";
    var nRatio;
    var oLevel;
    for(i=0; i<g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels.length; i++)
    {
        sCSS = "";
        if(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_left!=null && g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_left!="")
        {
            sCSS += "padding-left:" + g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_left + "em !important;";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_right!=null && g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_right!="")
        {
            sCSS += "padding-right:" + g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_right + "em !important;";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_top!=null && g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_top!="")
        {
            sCSS += "padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_top + "em !important;";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_bottom!=null && g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_bottom!="")
        {
            sCSS += "padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].level_padding_bottom + "em !important;";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].display_config!=null && g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].display_config!="")
        {
            oLevel = null;
            try
            {
                oLevel = ParseJson(g_oALL[sHexOWTId].oDesignData.oParams.aItemLevels[i].display_config);
            }
            catch(e) {}
            if(oLevel!=null)
            {
                sPreHeaderCSS = "";
                sHeaderCSS = "";
                sSubHeader1CSS = "";
                sSubHeader2CSS = "";
                sTextCSS = "";
                sBtnCSS = "";
                sSwitchCSS = "";
                sFloaterTextCSS = "";
                for(sVar in oLevel)
                {
                    if(oLevel[sVar]!=null && oLevel[sVar]!="")
                    {
                        switch(sVar)
                        {
                            case "sPreHeaderFontFamily":
                            {
                                sPreHeaderCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nPreHeaderFontSizeRatio":
                            {
                                sPreHeaderCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sPreHeaderFontWeight":
                            {
                                sPreHeaderCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sPreHeaderFontStyle":
                            {
                                sPreHeaderCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sPreHeaderFontColor":
                            {
                                sPreHeaderCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sHeaderFontFamily":
                            {
                                sHeaderCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nHeaderFontSizeRatio":
                            {
                                sHeaderCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sHeaderFontWeight":
                            {
                                sHeaderCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sHeaderFontStyle":
                            {
                                sHeaderCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sHeaderFontColor":
                            {
                                sHeaderCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sSubHeader1FontFamily":
                            {
                                sSubHeader1CSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nSubHeader1FontSizeRatio":
                            {
                                sSubHeader1CSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sSubHeader1FontWeight":
                            {
                                sSubHeader1CSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSubHeader1FontStyle":
                            {
                                sSubHeader1CSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSubHeader1FontColor":
                            {
                                sSubHeader1CSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sSubHeader2FontFamily":
                            {
                                sSubHeader2CSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nSubHeader2FontSizeRatio":
                            {
                                sSubHeader2CSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sSubHeader2FontWeight":
                            {
                                sSubHeader2CSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSubHeader2FontStyle":
                            {
                                sSubHeader2CSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSubHeader2FontColor":
                            {
                                sSubHeader2CSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sTextFontFamily":
                            {
                                sTextCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nTextFontSizeRatio":
                            {
                                sTextCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sTextFontWeight":
                            {
                                sTextCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sTextFontStyle":
                            {
                                sTextCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sTextFontColor":
                            {
                                sTextCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sBtnFontFamily":
                            {
                                sBtnCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nBtnFontSizeRatio":
                            {
                                sBtnCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sBtnFontWeight":
                            {
                                sBtnCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sBtnFontStyle":
                            {
                                sBtnCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sBtnFontColor":
                            {
                                sBtnCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sSwitchFontFamily":
                            {
                                sSwitchCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nSwitchFontSizeRatio":
                            {
                                sSwitchCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sSwitchFontWeight":
                            {
                                sSwitchCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSwitchFontStyle":
                            {
                                sSwitchCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sSwitchFontColor":
                            {
                                sSwitchCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }

                            case "sFloaterFontFamily":
                            {
                                sFloaterTextCSS += "font-family:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "nFloaterFontSizeRatio":
                            {
                                sFloaterTextCSS += "font-size:" + oLevel[sVar] + "em !important;";
                                break;
                            }
                            case "sFloaterFontWeight":
                            {
                                sFloaterTextCSS += "font-weight:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sFloaterFontStyle":
                            {
                                sFloaterTextCSS += "font-style:" + oLevel[sVar] + " !important;";
                                break;
                            }
                            case "sFloaterFontColor":
                            {
                                sFloaterTextCSS += "color:" + oLevel[sVar] + " !important;";
                                break;
                            }
                        }
                    }
                }
                if(sPreHeaderCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-preheader { " + sPreHeaderCSS + " } ";
                }
                if(sHeaderCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-item-header { " + sHeaderCSS + " } ";
                }
                if(sSubHeader1CSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-item-subheader1 { " + sSubHeader1CSS + " } ";
                }
                if(sSubHeader2CSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-item-subheader2 { " + sSubHeader2CSS + " } ";
                }
                if(sTextCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-item-text { " + sTextCSS + " } ";
                }
                if(sBtnCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-item-btn { " + sBtnCSS + " } ";
                }
                if(sSwitchCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-toggle-children { " + sSwitchCSS + " } ";
                }
                if(sFloaterTextCSS!="")
                {
                    sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] .wt-lp-datatree-floater div[wt-role='floater-text'] { " + sFloaterTextCSS + " } ";
                }
            }
        }
        if(sCSS!="")
        {
            sCSSToAppend += ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-datatree-children-list[wt-level='" + (i+1) + "'] { " + sCSS + " } ";
        }
    }

    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-datatree-workarea[wt-id='" + sHexOWTId + "'] " });
    }

    /*creating html*/
    var sSwitchHTML = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchPosition=="right")
    {
        sSwitchHTML = '<button class="' + aItemSwitchClasses.join(' ') + '" wt-btn="1" wt-pos="right" style="' + aItemSwitchCSS.join(';') + '" wt-role="toggle-children"><span wt-sub-html="sSwitchText" wt-role="switch-text"></span>' + sDivider1 + '<span wt-role="task-qty">0</span>' + sDivider2 + '<div class="wt-lp-toggle-icon"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z" /></svg></div></button>';
    }
    else
    {
        sSwitchHTML = '<button class="' + aItemSwitchClasses.join(' ') + '" wt-btn="1" style="' + aItemSwitchCSS.join(';') + '" wt-role="toggle-children"><div class="wt-lp-toggle-icon"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z" /></svg></div><span wt-sub-html="sSwitchText" wt-role="switch-text"></span>' + sDivider1 + '<span wt-role="task-qty">0</span>' + sDivider2 + '</button>';
    }
    sHTMLData = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    sHTMLData += '<div class="' + aWorkareaClasses.join(' ') + '" style="' + aWorkareaCSS.join(';') + '" wt-lazy-block="1" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTMLData += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTMLData += '>';
    sHTMLData += '<div class="wt-template-storage" wt-template-box="' + sHexOWTId + '" id="WT_ST_' + sHexOWTId + '">';
    sHTMLData += '<ul>';

    sHTMLData += '<li class="' + aItemClasses.join(' ') + '" style="" wt-role="item" wt-owt-id="" wt-is-parent="" wt-item-id="" wt-state="">';
    sHTMLData += '<div class="' + aItemContainerClasses.join(' ') + '" style="' + aItemContainerCSS.join(';') + '" wt-role="item-container">';
    sHTMLData += '<div class="' + aItemBodyClasses.join(' ') + '" style="' + aItemBodyCSS.join(';') + '" wt-role="item-body">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayImg)
    {
        sHTMLData += '<div class="' + aItemImgWrapperClasses.join(' ') + '" style="' + aItemImgWrapperCSS.join(';') + '" wt-role="img">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.bFloaterOnImg)
        {
            sHTMLData += '<div class="' + aFloaterClasses.join(' ') + '" style="' + aFloaterCSS.join(';') + '" wt-role="floater"></div>';
        }
        sHTMLData += '</div>';
    }
    sHTMLData += '<div class="' + aItemContentClasses.join(' ') + '" style="' + aItemContentCSS.join(';') + '" wt-role="item-content">';
    sHTMLData += '<div class="' + aPreHeaderClasses.join(' ') + '" style="' + aPreHeaderCSS.join(';') + '" wt-role="preheader"></div>';
    sHTMLData += '<div class="' + aItemHeaderClasses.join(' ') + '" style="' + aItemHeaderCSS.join(';') + '" wt-role="item-header"></div>';
    sHTMLData += '<div class="' + aItemSubheaderBlockClasses.join(' ') + '" style="' + aItemSubheaderBlockCSS.join(';') + '" wt-role="item-subheaders">';
    sHTMLData += '<div class="' + aItemSubheader1Classes.join(' ') + '" style="' + aItemSubheader1CSS.join(';') + '" wt-role="item-subheader1"></div>';
    sHTMLData += '<div class="' + aItemSubheader2Classes.join(' ') + '" style="' + aItemSubheader2CSS.join(';') + '" wt-role="item-subheader2"></div>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aItemTextClasses.join(' ') + '" style="' + aItemTextCSS.join(';') + '" wt-role="item-text"></div>';
    sHTMLData += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sBtnPosition=="right_side")
    {
        sHTMLData += '<div class="' + aItemBtnContainerClasses.join(' ') + '" style="' + aItemBtnContainerCSS.join(';') + '" wt-role="item-btns">';
        sHTMLData += sSwitchHTML;
        sHTMLData += '<button class="' + aItemBtnClasses.join(' ') + '" wt-btn="1" style="" wt-role="item-btn" wt-sub-html="sBtnText"></button>';
        sHTMLData += '</div>';
    }
    sHTMLData += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sBtnPosition!="right_side")
    {
        sHTMLData += '<div class="' + aItemBtnContainerClasses.join(' ') + '" style="' + aItemBtnContainerCSS.join(';') + '" wt-role="item-btns">';
        sHTMLData += sSwitchHTML;
        sHTMLData += '<button class="' + aItemBtnClasses.join(' ') + '" wt-btn="1" style="" wt-role="item-btn" wt-sub-html="sBtnText"></button>';
        sHTMLData += '</div>';
    }
    if(!g_oALL[sHexOWTId].oDesignData.oParams.bFloaterOnImg)
    {
        sHTMLData += '<div class="' + aFloaterClasses.join(' ') + '" style="' + aFloaterCSS.join(';') + '" wt-role="floater"><div style="' + aFloaterTextCSS.join(";") + '" wt-role="floater-text"></div></div>';
    }
    sHTMLData += '</div>';
    sHTMLData += '<ul class="' + aChildrenListClasses.join(' ') + '" style="' + aChildrenListCSS.join(';') + '" wt-role="children-list" wt-owt-id="" wt-item-id="" wt-state=""></ul>';
    sHTMLData += '</li>';


    sHTMLData += '</ul>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aWrapperClasses.join(' ') + '" style="' + aWrapperCSS.join(';') + '" ' + sWrapperBGAttr + '>';
    sHTMLData += '<ul class="' + aListClasses.join(' ') + '" style="' + aListCSS.join(';') + '" wt-role="list"></ul>';
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorBottom!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorBottom + '"></a>';
    }

    sHTMLData += '<div class="wt-init-vars" style="display: none" wt-role="init-css" id="CSS_' + sHexOWTId + '" wt-id="' + sHexOWTId + '">' + sCSSToAppend + '</div>';
    if(oArgs.bLegacy)
    {
        sHTMLData += '<script id="LEG_' + sHexOWTId + '">//({'; // empty script tag to pair legacy cached tag
    }

    return sHTMLData;
}
function _CUSTOM_BuildRuntimeData(oArgs)
{
    var aRuntimeParams =
        [
            { name: "sActionType", var_name: "action_type", type: "string", def: "link" },
            { name: "sTargetType", var_name: "target_type", type: "string", def: "_self" },
            { name: "bCollectFlds", var_name: "collect_flds", type: "bool", def: false },
            { name: "sRemoteActionType", var_name: "remote_action_type", type: "string", def: "object" },
            { name: "iRemoteActionId", var_name: "__remote_action__", type: "int", def: 0 },
            { name: "iRemoteActionCommonId", var_name: "remote_action_common", type: "int", def: 0 },
            { name: "sLocalAction", var_name: "local_action", type: "string", def: "object" },
            { name: "sLocalVar", var_name: "local_var", type: "string", def: "" },
            { name: "sFunctionName", var_name: "function_name", type: "string", def: "" },
            { name: "sMultipleActionsHeader", var_name: "multiple_actions_header", type: "string", def: "Select action" },
            { name: "bHTMLAllowed", var_name: "allow_html", type: "bool", def: false },

            { name: "sCollectionType", var_name: "collection_type", type: "string", def: "object" },
            { name: "sSwitchCount", var_name: "switch_count", type: "string", def: "all" },

            { name: "bCollapsedByDefault", var_name: "collapsed_by_default", type: "bool", def: true },
            { name: "bDisplayAsSequence", var_name: "display_as_sequence", type: "bool", def: false },
            { name: "bDisplayConnectors", var_name: "display_connectors", type: "bool", def: true },

            { name: "bDisplayImg", var_name: "display_image", type: "bool", def: false },
            { name: "bDisplayPreHeader", var_name: "display_preheader", type: "bool", def: false },
            { name: "bDisplayHeader", var_name: "display_header", type: "bool", def: true },
            { name: "bDisplaySubHeader1", var_name: "display_subheader1", type: "bool", def: false },
            { name: "bDisplaySubHeader2", var_name: "display_subheader2", type: "bool", def: false },
            { name: "bSubheadersByColumns", var_name: "subheaders_by_columns", type: "bool", def: true },
            { name: "bDisplayBtn", var_name: "display_button", type: "bool", def: true },
            { name: "bDisplayBtnDisabled", var_name: "display_button_disabled", type: "bool", def: false },
            { name: "bDisplayFloater", var_name: "display_floater", type: "bool", def: false },
            { name: "bFloaterHideEmpty", var_name: "floater_hide_empty", type: "bool", def: true },

            { name: "sBtnText", var_name: "btn_text", type: "string", def: "Open" },
            { name: "sSwitchText", var_name: "switch_text", type: "string", def: "Items" },
            { name: "sWhenEmpty", var_name: "when_empty", type: "string", def: "none" },
            { name: "sMsgEmpty", var_name: "msg_empty", type: "string", def: "No data" },
            { name: "sActionParams", var_name: "__service__remote_action_params", type: "string", def: "" },
            { name: "sCommonActionParams", var_name: "__service__common_remote_action_params", type: "string", def: "" },
            { name: "sCollectionParams", var_name: "__service__collection_params", type: "string", def: "" },
            { name: "sCommonCollectionParams", var_name: "__service__common_collection_params", type: "string", def: "" }
        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            aItems: [],
            aResult: [],
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };
    g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal = true;
    g_oALL[sHexOWTId].oRuntimeData.oParams.aLevelTexts = tools_web.get_web_param( curParams, g_oALL[sHexOWTId].sBlockPrefix + ".level_texts", [], true );
    g_oALL[sHexOWTId].oRuntimeData.oParams.aItemLevels = tools_web.get_web_param( curParams, g_oALL[sHexOWTId].sBlockPrefix + ".item_levels", [], true );

    g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId = 0;
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal)
    {
        var aMapping = [];
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.sCollectionType=="object")
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId = g_oALL[sHexOWTId].bVarsFromCache ? OptInt(g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".__collection__"].value, 0) : OptInt( tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".__collection__"), "0", true ) );
            if(g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
            {
                aMapping =
                    [
                        { name: "sImg", var_name: "__mapping__img", type: "string", def: "" },
                        { name: "sPreHeader", var_name: "__mapping__preheader", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header", type: "string", def: "" },
                        { name: "sSubheader1", var_name: "__mapping__subheader1", type: "string", def: "" },
                        { name: "sSubheader2", var_name: "__mapping__subheader2", type: "string", def: "" },
                        { name: "sText", var_name: "__mapping__text", type: "string", def: "" },
                        { name: "sCSSClass", var_name: "__mapping__css_class", type: "string", def: "" },
                        { name: "sLink", var_name: "__mapping__link", type: "string", def: "" },
                        { name: "sFloater", var_name: "__mapping__floater", type: "string", def: "" },
                        { name: "sFloaterClass", var_name: "__mapping__css_floater", type: "string", def: "" },
                        { name: "sFloaterColor", var_name: "__mapping__floater_color", type: "string", def: "" },
                        { name: "sBtnText", var_name: "__mapping__btn_text", type: "string", def: "" },
                        { name: "sSwitchText", var_name: "__mapping__switch_text", type: "string", def: "" },
                        { name: "sImgValue", var_name: "__mapping__img__value", type: "string", def: "" },
                        { name: "sPreHeaderValue", var_name: "__mapping__preheader__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header__value", type: "string", def: "" },
                        { name: "sSubheader1Value", var_name: "__mapping__subheader1__value", type: "string", def: "" },
                        { name: "sSubheader2Value", var_name: "__mapping__subheader2__value", type: "string", def: "" },
                        { name: "sTextValue", var_name: "__mapping__text__value", type: "string", def: "" },
                        { name: "sCSSClassValue", var_name: "__mapping__css_class__value", type: "string", def: "" },
                        { name: "sLinkValue", var_name: "__mapping__link__value", type: "string", def: "" },
                        { name: "sFloaterValue", var_name: "__mapping__floater__value", type: "string", def: "" },
                        { name: "sFloaterClassValue", var_name: "__mapping__css_floater__value", type: "string", def: "" },
                        { name: "sFloaterColorValue", var_name: "__mapping__floater_color__value", type: "string", def: "" },
                        { name: "sBtnTextValue", var_name: "__mapping__btn_text__value", type: "string", def: "" },
                        { name: "sSwitchTextValue", var_name: "__mapping__switch_text__value", type: "string", def: "" }
                    ];
            }
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId = g_oALL[sHexOWTId].bVarsFromCache ? OptInt(g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".collection_common"].value, 0) : OptInt( tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".collection_common"), "0", true ) );
            if(g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
            {
                aMapping =
                    [
                        { name: "sImg", var_name: "__mapping__img_common", type: "string", def: "" },
                        { name: "sPreHeader", var_name: "__mapping__preheader_common", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header_common", type: "string", def: "" },
                        { name: "sSubheader1", var_name: "__mapping__subheader1_common", type: "string", def: "" },
                        { name: "sSubheader2", var_name: "__mapping__subheader2_common", type: "string", def: "" },
                        { name: "sText", var_name: "__mapping__text_common", type: "string", def: "" },
                        { name: "sCSSClass", var_name: "__mapping__css_class_common", type: "string", def: "" },
                        { name: "sLink", var_name: "__mapping__link_common", type: "string", def: "" },
                        { name: "sFloater", var_name: "__mapping__floater_common", type: "string", def: "" },
                        { name: "sFloaterClass", var_name: "__mapping__css_floater_common", type: "string", def: "" },
                        { name: "sFloaterColor", var_name: "__mapping__floater_color_common", type: "string", def: "" },
                        { name: "sBtnText", var_name: "__mapping__btn_text_common", type: "string", def: "" },
                        { name: "sSwitchText", var_name: "__mapping__switch_text_common", type: "string", def: "" },
                        { name: "sImgValue", var_name: "__mapping__img_common__value", type: "string", def: "" },
                        { name: "sPreHeaderValue", var_name: "__mapping__preheader_common__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header_common__value", type: "string", def: "" },
                        { name: "sSubheader1Value", var_name: "__mapping__subheader1_common__value", type: "string", def: "" },
                        { name: "sSubheader2Value", var_name: "__mapping__subheader2_common__value", type: "string", def: "" },
                        { name: "sTextValue", var_name: "__mapping__text_common__value", type: "string", def: "" },
                        { name: "sCSSClassValue", var_name: "__mapping__css_class_common__value", type: "string", def: "" },
                        { name: "sLinkValue", var_name: "__mapping__link_common__value", type: "string", def: "" },
                        { name: "sFloaterValue", var_name: "__mapping__floater_common__value", type: "string", def: "" },
                        { name: "sFloaterClassValue", var_name: "__mapping__css_floater_common__value", type: "string", def: "" },
                        { name: "sFloaterColorValue", var_name: "__mapping__floater_color_common__value", type: "string", def: "" },
                        { name: "sBtnTextValue", var_name: "__mapping__btn_text_common__value", type: "string", def: "" },
                        { name: "sSwitchTextValue", var_name: "__mapping__switch_text_common__value", type: "string", def: "" }
                    ];
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oMapping = tools_lp.get_owt_params(curParams, aMapping, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } );
        g_oALL[sHexOWTId].oRuntimeData.aMap =
            [
                { name_in_item: "img", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sImg" }) },
                { name_in_item: "preheader", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sPreHeader" }) },
                { name_in_item: "header", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sHeader" }) },
                { name_in_item: "subheader1", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sSubheader1" }) },
                { name_in_item: "subheader2", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sSubheader2" }) },
                { name_in_item: "text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sText" }) },
                { name_in_item: "css_class", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sCSSClass" }) },
                { name_in_item: "link", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sLink" }) },
                { name_in_item: "floater", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloater" }) },
                { name_in_item: "floater_class", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloaterClass" }) },
                { name_in_item: "floater_color", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloaterClass" }) },
                { name_in_item: "btn_text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sBtnText" }) },
                { name_in_item: "switch_text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sSwitchText" }) }
            ];
    }
    g_oALL[sHexOWTId].oRuntimeData.oParams.sHexCollectionId = "0x" + StrHexInt(g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId, 16);
    g_oALL[sHexOWTId].oRuntimeData.oCollectionParams = {};

    g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId = 0;
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType=="remote_action")
    {
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.sRemoteActionType=="object")
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId = g_oALL[sHexOWTId].bVarsFromCache ? OptInt(g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".__remote_action__"].value, 0) : OptInt(tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".__remote_action__"), "0", true ));
            if(g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId!=0)
            {
                g_oALL[sHexOWTId].oRuntimeData.oParams.sActionParams = g_oALL[sHexOWTId].bVarsFromCache ? g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".__service__remote_action_params"].value : tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".__service__remote_action_params"), "", true);
            }
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId = g_oALL[sHexOWTId].bVarsFromCache ? OptInt(g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".remote_action_common"].value, 0) : OptInt(tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".remote_action_common"), "0", true ));
            if(g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId!=0)
            {
                g_oALL[sHexOWTId].oRuntimeData.oParams.sActionParams = g_oALL[sHexOWTId].bVarsFromCache ? g_oALL[sHexOWTId].oVarsCache[g_oALL[sHexOWTId].sBlockPrefix + ".__service__common_remote_action_params"].value : tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".__service__common_remote_action_params"), "", true);
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oParams.sHexActionId = "0x" + StrHexInt(g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId, 16);
    }
    g_oALL[sHexOWTId].oRuntimeData.aItems = [];
    g_oALL[sHexOWTId].oRuntimeData.aResult = [];
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;
    var aLegacyRuntimeUpdates =
        [
            { name: "bDisplayConnectors", value: true },
            { name: "bDisplayPreHeader", value: false },
            { name: "bDisplayFloater", value: false },
            { name: "bDeferredLoading", value: false },
            { name: "sSwitchCount", value: "all" },
            { name: "aLevelTexts", value: [] },
            { name: "aItemLevels", value: [] }
        ];
    if(aLegacyRuntimeUpdates.length>0)
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oRuntimeData.oParams, aLegacyRuntimeUpdates);
    }
    return g_oALL[sHexOWTId].oRuntimeData;
}
/* END TEMPLATE-DEPENDING FUNCTIONS */

/************************************************************************************************/
/* START MAIN FLOW (HAS COLLECTION) */

var oRuntimeToBrowser;

COMMON_InitMode({ bPlainWidget: false }); // check if we should degrade mode to rebuild smth

if(g_bView) // regular page view: legacy 'no fcache' way, or refresh|postloading data with non-empty g_oALL[sHexOWTId].oRuntimeData
{
    if(g_oALL[sHexOWTId].sCacheLevel=="full")
    {
        Response.Write(g_oALL[sHexOWTId].sFullHTML);
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "FULL CACHE" });
        }
    }
    else if(bRefresh) // data only if oRuntimeData ready
    {
        _CUSTOM_BuildData();
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        Response.Write( UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) );
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "REFRESH" });
        }
    }
    else
    {
        _CUSTOM_BuildData();
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        g_oALL[sHexOWTId].sFullHTML = g_oALL[sHexOWTId].sHTMLData + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';
        Response.Write(g_oALL[sHexOWTId].sFullHTML);
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "REFRESH" });
        }
    }
}
else // all editor or compiler modes + refresh with empty g_oALL[sHexOWTId].oRuntimeData
{
    COMMON_InitVars();
    COMMON_InitPreset();

    if(g_oALL[sHexOWTId].oDesignData==null || !g_bView)
    {
        g_oALL[sHexOWTId].oDesignData = _CUSTOM_BuildDesignData();
    }
    g_oALL[sHexOWTId].oRuntimeData = _CUSTOM_BuildRuntimeData();
    _CUSTOM_BuildData();

    var aToSub = _CUSTOM_BuildFldsToSub();
    if(g_bFCache) // data for fcache
    {
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        var sBlockId = tools.random_string(8);
        var sFCache = '<!--[BEGIN ' + sBlockId + ' { "type": "widget", "override_web_template_id": "' + sHexOWTId + '" }]-->';
        sFCache += _CUSTOM_BuildHTML({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: false });

        if(g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal && g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
        {
            if(g_oALL[sHexOWTId].aColVars.length!=0)
            {
                aToSub = ArrayUnion(aToSub, g_oALL[sHexOWTId].aColVars);
            }
            var sColId = tools.random_string(8);
            var oColData = { "type": "collection", "collection_id": g_oALL[sHexOWTId].oRuntimeData.oParams.sHexCollectionId, aVars: g_oALL[sHexOWTId].aColVars, aMap: g_oALL[sHexOWTId].oRuntimeData.aMap, oCollectionParams: g_oALL[sHexOWTId].oRuntimeData.oCollectionParams, "omit_in_fcache": g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading };
            sFCache += '<div class="wt-init-vars" style="display: none" wt-role="init-col" id="COL_' + sHexOWTId + '" wt-id="' + sHexOWTId + '"><!--[BEGIN ' + sColId + ' ' + EncodeJson(oColData, { ExportLargeIntegersAsStrings: true }) + ']--><!--[END ' + sColId + ']--></div>';
            g_oALL[sHexOWTId].oRuntimeData.aMap = undefined;
            g_oALL[sHexOWTId].oRuntimeData.aChildVars = undefined;
        }

        g_oALL[sHexOWTId].oRuntimeData.aSubs = tools_lp.list_subs({ aFlds: aToSub });

        sFCache += '<div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( g_oALL[sHexOWTId].oRuntimeData, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';

        var sSubs = EncodeJson( g_oALL[sHexOWTId].oRuntimeData.aSubs );
        if(sSubs!="[]")
        {
            sFCache += '<!--SUBS' + sSubs + 'SUBS-->';
        }
        sFCache += '<!--[END ' + sBlockId + ']-->';
        Response.Write(sFCache);
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "CREATE FCACHE" });
        }
    }
    else // editor or legacy way
    {
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        g_oALL[sHexOWTId].sHTMLData = _CUSTOM_BuildHTML({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: true });
        g_oALL[sHexOWTId].bSaveCache = !bLPE;

        if(g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal && g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
        {
            if(g_oALL[sHexOWTId].aColVars.length!=0)
            {
                aToSub = ArrayUnion(aToSub, g_oALL[sHexOWTId].aColVars);
            }
        }
        oRuntimeToBrowser.aSubs = tools_lp.list_subs({ aFlds: aToSub });

        g_oALL[sHexOWTId].sFullHTML =	g_oALL[sHexOWTId].sHTMLData + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';

        Response.Write(g_oALL[sHexOWTId].sFullHTML);

        if(g_oALL[sHexOWTId].bSaveCache)
        {
            COMMON_SaveCache();
        }
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: (((bLPE || bLPEPreview) ? "NO ": "") + "CACHE") });
        }
    }
}

/* END MAIN FLOW */
/************************************************************************************************/
%>