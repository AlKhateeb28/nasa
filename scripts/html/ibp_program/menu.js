<%
// 6769900896653832210
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "MENU", // for error msgs
        sBlockPrefix: "block_menu", // for common get_web_param calls
        sConstructor: "WTLPMenu" // for constructor call
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
        oElem.text = _Substitute({ sText: oElem.text });
        oElem.link_url = _Substitute({ sText: oElem.link_url });
        try
        {
            oElem.is_selected = tools_web.is_true(oElem.is_selected);
        }
        catch(e)
        {
            oElem.is_selected = false;
        }
        if(oElem.icon!="")
        {
            try
            {
                oElem.icon = "download_file.js?file_id=" + Int(oElem.icon);
            }
            catch(e)
            {
            }
        }
        if(oElem.icon_hover!="")
        {
            try
            {
                oElem.icon_hover = "download_file.js?file_id=" + Int(oElem.icon_hover);
            }
            catch(e)
            {
            }
        }
        if(oElem.icon_selected!="")
        {
            try
            {
                oElem.icon_selected = "download_file.js?file_id=" + Int(oElem.icon_selected);
            }
            catch(e)
            {
            }
        }
    }
    oBData.oParams.sMultipleActionsHeader = _Substitute({ sText: oBData.oParams.sMultipleActionsHeader });
    oBData.oParams.sMsgEmpty = _Substitute({ sText: oBData.oParams.sMsgEmpty });
    oBData.oParams.sCommonActionParams = _Substitute({ sText: oBData.oParams.sCommonActionParams });
    oBData.oParams.sCollectionParams = _Substitute({ sText: oBData.oParams.sCollectionParams });
    oBData.oParams.sCommonCollectionParams = _Substitute({ sText: oBData.oParams.sCommonCollectionParams });
    tools_lp.update_runtime_env({ oData: oBData });
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
                var bSelected = false;
                if(oResult.HasProperty("result") && IsArray(oResult.result))
                {
                    g_oALL[sHexOWTId].oRuntimeData.aResult = oResult.result;
                    for(oElem in oResult.result)
                    {
                        iInt = OptInt(oElem.id);
                        oElem.hex_id = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : oElem.id);
                        bSelected = (false || tools_web.is_true(oElem.GetOptProperty("is_actual", false)) );
                        if(g_oALL[sHexOWTId].oRuntimeData.oMapping.HasProperty("sIsSelected"))
                        {
                            bSelected = tools_web.is_true( _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sIsSelected", sParam: "is_selected" }) );
                        }
                        g_oALL[sHexOWTId].oRuntimeData.aItems.push(
                            {
                                id: String(oElem.id),
                                hex_id: oElem.hex_id,
                                text: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sText", sParam: "text" }),
                                icon: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sIcon", sParam: "icon" }),
                                icon_hover: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sIconHover", sParam: "icon_hover" }),
                                icon_selected: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sIconSelected", sParam: "icon_selected" }),
                                link_url: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sLinkURL", sParam: "link_url" }),
                                is_selected: bSelected
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
    else
    {
        g_oALL[sHexOWTId].oRuntimeData.aItems = tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".items"), [], true );
        for(oElem in g_oALL[sHexOWTId].oRuntimeData.aItems)
        {
            oElem.id = oElem.hex_id = tools.random_string(10);
        }
    }
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
            { name: "sLayout", var_name: "layout", type: "string", def: "h" },
            { name: "bUnifyItems", var_name: "unify_items", type: "bool", def: true },
            { name: "sAlignItems", var_name: "align_items", type: "string", def: "left" },
            { name: "nPaddingCommon", var_name: "padding_common", type: "real", def: 0 },
            { name: "nInterItem", var_name: "inter_item", type: "real", def: 0 },
            { name: "bUseBG", var_name: "use_bg", type: "bool", def: true },
            { name: "sColorBG", var_name: "color_bg", type: "string", def: "#262626" },
            { name: "bUseShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "bUseBorder", var_name: "use_border", type: "bool", def: true },
            { name: "sColorBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "iBorderWidth", var_name: "border_width", type: "int", def: 1 },
            { name: "bIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "bItemHasBG", var_name: "item_has_bg", type: "bool", def: true },
            { name: "sColorItemBG", var_name: "color_item_bg", type: "string", def: "#262626" },
            { name: "sColorItemBGHover", var_name: "color_item_bg_hover", type: "string", def: "#787878" },
            { name: "sColorItemBGSelected", var_name: "color_item_bg_selected", type: "string", def: "#4176ea" },
            { name: "bItemHasShadow", var_name: "item_has_shadow", type: "bool", def: false },
            { name: "bItemHasBorder", var_name: "item_has_border", type: "bool", def: false },
            { name: "sColorItemBorder", var_name: "color_item_border", type: "string", def: "#c2c3c4" },
            { name: "sColorItemBorderHover", var_name: "color_item_border_hover", type: "string", def: "#e2e3e4" },
            { name: "sColorItemBorderSelected", var_name: "color_item_border_selected", type: "string", def: "#f2f3f4" },
            { name: "iItemBorderWidth", var_name: "item_border_size", type: "int", def: 1 },
            { name: "bBottomBorderOnly", var_name: "bottom_border_only", type: "bool", def: true },
            { name: "bItemIsRounded", var_name: "item_is_rounded", type: "bool", def: false },
            { name: "bDisplayItemIcon", var_name: "display_item_icon", type: "bool", def: false },
            { name: "sIconPosition", var_name: "item_icon_position", type: "string", def: "none" },
            { name: "bIconSyncSize", var_name: "icon_size_sync", type: "bool", def: false },
            { name: "nItemIconSize", var_name: "item_icon_width", type: "real", def: 1 },
            { name: "bDisplayItemText", var_name: "display_item_text", type: "bool", def: true },

            { name: "sTextFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sTextFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sTextFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sTextFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sTextFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sTextFontColor", var_name: "color_font", type: "string", def: "#c2c3c4" },
            { name: "sTextFontColorHover", var_name: "color_font_hover", type: "string", def: "#f2f3f4" },
            { name: "sTextFontColorSelected", var_name: "color_font_selected", type: "string", def: "#ffffff" },
            { name: "sTextAlign", var_name: "text_align", type: "string", def: "left" },
            { name: "bWrapText", var_name: "wrap_text", type: "bool", def: true },
            { name: "nItemPaddingH", var_name: "item_padding_h", type: "real", def: 1 },
            { name: "nItemPaddingV", var_name: "item_padding_v", type: "real", def: 0.5 },
        ];
    aDesignParams = ArrayUnion(aDesignParams, aMsgEmptyDesignParams); // typical msg empty params
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
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

    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var aWorkareaClasses = [ "wt-lp-menu-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aMsgEmptyCSS = _GetMsgEmptyCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var aBlockClasses = [ "wt-lp-menu-block" ];
    var aBlockCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingCommon + "em" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBG)
    {
        aBlockCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBG);
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseShadow)
        {
            aBlockClasses.push("wt-lp-menu-shadow");
        }
    }
    else
    {
        aBlockCSS.push("background-color:transparent");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder)
    {
        aBlockClasses.push("wt-lp-menu-border");
        aBlockCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBorder);
        aBlockCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBorderWidth + "px");
    }
    else
    {
        aBlockCSS.push("border:none");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBG && g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder && g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aBlockClasses.push("wt-lp-menu-rounded");
    }
    var aListClasses = [ "wt-lp-menu-list", "wt-lp-menu-list-" + g_oALL[sHexOWTId].oDesignData.oParams.sLayout ];
    var aListCSS = [ ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sLayout=="h")
    {
        aListCSS.push("justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sAlignItems]);
    }
    var aItemClasses = [ "wt-lp-menu-item" ];
    var aItemCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingV + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingH + "em" ];
    var sLinkStyle = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasShadow)
        {
            aItemClasses.push("wt-lp-menu-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sLayout=="h")
    {
        aItemCSS.push("margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nInterItem + "em");
    }
    else
    {
        aItemCSS.push("margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nInterItem + "em");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBottomBorderOnly)
        {
            aItemClasses.push("wt-lp-menu-border-bottom-only");
            aItemCSS.push("border-bottom-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iItemBorderWidth + "px");
        }
        else
        {
            aItemClasses.push("wt-lp-menu-border");
            aItemCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iItemBorderWidth + "px");
        }
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bItemIsRounded)
    {
        aItemClasses.push("wt-lp-menu-rounded");
    }
    var aItemIconClasses = [];
    var aItemIconCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemIcon)
    {
        aItemClasses.push("wt-lp-menu-has-icon");
        aItemClasses.push("wt-lp-menu-icon-" + g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition);
        aItemIconClasses = [ "wt-lp-menu-item-icon" ];
        if(g_oALL[sHexOWTId].oDesignData.oParams.bIconSyncSize)
        {
            aItemIconCSS = [ "min-height:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sTextFontSize], "height:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sTextFontSize], "min-width:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sTextFontSize], "width:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sTextFontSize] ];
        }
        else
        {
            aItemIconCSS = [ "min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemIconSize + "em", "height:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemIconSize + "em", "min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemIconSize + "em", "width:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemIconSize + "em" ];
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition=="left")
        {
            aItemIconCSS.push("margin-right:1em");
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition=="right")
        {
            aItemIconCSS.push("margin-left:1em");
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition=="top")
        {
            aItemIconCSS.push("margin-bottom:1em");
        }
    }
    var aItemTextClasses = [];
    var aItemTextCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemText)
    {
        aItemTextClasses = [ "wt-lp-menu-item-text" ];
        aItemTextCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sTextFont", bArray: true, bOmitColor: true });
        aItemTextCSS.push("text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sTextAlign);
        if(g_oALL[sHexOWTId].oDesignData.oParams.bWrapText)
        {
            aItemTextCSS.push("white-space:nowrap");
        }
        else
        {
            aItemTextCSS.push("white-space:normal");
        }
    }

    var aCSSIdle = [];
    var aCSSHover = [];
    var aCSSSelected = [];
    var aCSSIconIdle = [];
    var aCSSIconHover = [];
    var aCSSIconSelected = [];
    var aCSSTextIdle = [];
    var aCSSTextHover = [];
    var aCSSTextSelected = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG)
    {
        aCSSIdle.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBG);
        aCSSHover.push("background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBGHover);
        aCSSSelected.push("background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBGSelected);
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder)
    {
        aCSSIdle.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBorder);
        aCSSHover.push("border-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBorderHover);
        aCSSSelected.push("border-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sColorItemBorderSelected);
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemText)
    {
        aCSSTextIdle.push("color:" + g_oALL[sHexOWTId].oDesignData.oParams.sTextFontColor);
        aCSSTextHover.push("color:" + g_oALL[sHexOWTId].oDesignData.oParams.sTextFontColorHover);
        aCSSTextSelected.push("color:" + g_oALL[sHexOWTId].oDesignData.oParams.sTextFontColorSelected);
    }
    var sCSSToAppend = ".wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item {" + aCSSIdle.join(';') + "; } .wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item:not([wt-state='selected']):hover {" + aCSSHover.join(';') + "} .wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item[wt-state='selected'] {" + aCSSSelected.join(';') + "} ";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sLayout=="h")
    {
        sCSSToAppend += " .wt-lp-menu-item:first-of-type { margin-left: 0 !important; }";
    }
    else
    {
        sCSSToAppend += " .wt-lp-menu-item:first-of-type { margin-top: 0 !important; }";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemText)
    {
        sCSSToAppend += ".wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item .wt-lp-menu-item-text {" + aCSSTextIdle.join(';') + "; } .wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item:not([wt-state='selected']):hover .wt-lp-menu-item-text {" + aCSSTextHover.join(';') + "} .wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] .wt-lp-menu-item[wt-state='selected'] .wt-lp-menu-item-text {" + aCSSTextSelected.join(';') + "} ";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemIcon)
    {
        sCSSToAppend += aCSSIconIdle.join(" ") + " " + aCSSIconHover.join(" ") + " " + aCSSIconSelected.join(" ");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-menu-workarea[wt-id='" + sHexOWTId + "'] " });
    }

    sHTMLData = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    sHTMLData += '<div class="' + aWorkareaClasses.join(' ') + '" wt-lazy-block="' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" style="' + aWorkareaCSS.join(';') + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTMLData += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTMLData += '>';
    sHTMLData += '<div class="wt-template-storage" wt-template-box="' + sHexOWTId + '" id="WT_ST_' + sHexOWTId + '">';
    sHTMLData += '<div class="wt-lp-wmenu-children" wt-role="child-menu"><div class="wt-lp-wmenu-children-arrow" style="" wt-role="arrow"></div><ul class="wt-lp-wmenu-child-list" wt-role="child-list"></ul></div>';
    sHTMLData += '<ul>';
    sHTMLData += '<li class="' + aItemClasses.join(' ') + '" style="' + aItemCSS.join(';') + '" wt-role="item" wt-owt-id="" wt-item-id="" wt-state="">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemIcon)
    {
        sHTMLData += '<div class="' + aItemIconClasses.join(' ') + '" style="' + aItemIconCSS.join(';') + '" wt-role="icon"></div>';
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayItemText)
    {
        sHTMLData += '<div class="' + aItemTextClasses.join(' ') + '" style="' + aItemTextCSS.join(';') + '" wt-role="text"></div>';
    }
    sHTMLData += '<a href="" class="wt-lp-menu-link" wt-role="link" style="' + sLinkStyle + '"></a>';
    sHTMLData += '</li>';
    sHTMLData += '<li class="wt-lp-wmenu-child" style="" wt-role="child" wt-owt-id="" wt-item-id="" wt-child-id="">';
    sHTMLData += '<div class="wt-lp-wmenu-child-icon" style="" wt-role="icon"></div>';
    sHTMLData += '<div class="wt-lp-wmenu-child-block" style="" wt-role="block">';
    sHTMLData += '<div class="wt-lp-wmenu-child-text1" style="" wt-role="text1"></div>';
    sHTMLData += '<div class="wt-lp-wmenu-child-text2" style="" wt-role="text2"></div>';
    sHTMLData += '</div>';
    sHTMLData += '</li>';
    sHTMLData += '</ul>';

    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aBlockClasses.join(' ') + '" style="' + aBlockCSS.join(';') + '">';
    sHTMLData += '<ul class="' + aListClasses.join(' ') + '" style="' + aListCSS.join(';') + '" wt-role="list"></ul>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="wt-lp-msg-empty" style="' + aMsgEmptyCSS.join(';') + '" wt-role="msg-empty" wt-sub-html="sMsgEmpty"></div>';
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

            { name: "bDataExternal", var_name: "__data_external", type: "bool", def: false },
            { name: "sActionType", var_name: "action_type", type: "string", def: "link" },
            { name: "bCollectFlds", var_name: "collect_flds", type: "bool", def: false },
            { name: "sRemoteActionType", var_name: "remote_action_type", type: "string", def: "object" },
            { name: "iRemoteActionId", var_name: "__remote_action__", type: "int", def: 0 },
            { name: "iRemoteActionCommonId", var_name: "remote_action_common", type: "int", def: 0 },
            { name: "sLocalAction", var_name: "local_action", type: "string", def: "object" },
            { name: "sLocalVar", var_name: "local_var", type: "string", def: "" },
            { name: "sFunctionName", var_name: "function_name", type: "string", def: "" },
            { name: "sMultipleActionsHeader", var_name: "multiple_actions_header", type: "string", def: "Select action" },
            { name: "sCollectionType", var_name: "collection_type", type: "string", def: "object" },
            { name: "bDeferredLoading", var_name: "deferred_loading", type: "bool", def: false },
            { name: "bHTMLAllowed", var_name: "allow_html", type: "bool", def: false },

            { name: "sLayout", var_name: "layout", type: "string", def: "h" },
            { name: "bUnifyItems", var_name: "unify_items", type: "bool", def: true },
            { name: "nInterItem", var_name: "inter_item", type: "real", def: 0 },
            { name: "bDisplayItemIcon", var_name: "display_item_icon", type: "bool", def: false },
            { name: "bDisplayItemText", var_name: "display_item_text", type: "bool", def: true },
            { name: "bWrapText", var_name: "wrap_text", type: "bool", def: true },

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
                        { name: "sText", var_name: "__mapping__text", type: "string", def: "" },
                        { name: "sIcon", var_name: "__mapping__icon", type: "string", def: "" },
                        { name: "sIconHover", var_name: "__mapping__icon_hover", type: "string", def: "" },
                        { name: "sIconSelected", var_name: "__mapping__icon_selected", type: "string", def: "" },
                        { name: "sLinkURL", var_name: "__mapping__link_url", type: "string", def: "" },
                        { name: "sIsSelected", var_name: "__mapping__is_selected", type: "string", def: "" },
                        { name: "sTextValue", var_name: "__mapping__text__value", type: "string", def: "" },
                        { name: "sIconValue", var_name: "__mapping__icon__value", type: "string", def: "" },
                        { name: "sIconHoverValue", var_name: "__mapping__icon_hover__value", type: "string", def: "" },
                        { name: "sIconSelectedValue", var_name: "__mapping__icon_selected__value", type: "string", def: "" },
                        { name: "sLinkURLValue", var_name: "__mapping__link_url__value", type: "string", def: "" },
                        { name: "sIsSelectedValue", var_name: "__mapping__is_selected__value", type: "string", def: "" }
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
                        { name: "sText", var_name: "__mapping__text_common", type: "string", def: "" },
                        { name: "sIcon", var_name: "__mapping__icon_common", type: "string", def: "" },
                        { name: "sIconHover", var_name: "__mapping__icon_hover_common", type: "string", def: "" },
                        { name: "sIconSelected", var_name: "__mapping__icon_selected_common", type: "string", def: "" },
                        { name: "sLinkURL", var_name: "__mapping__link_url_common", type: "string", def: "" },
                        { name: "sIsSelected", var_name: "__mapping__is_selected_common", type: "string", def: "" },
                        { name: "sTextValue", var_name: "__mapping__text_common__value", type: "string", def: "" },
                        { name: "sIconValue", var_name: "__mapping__icon_common__value", type: "string", def: "" },
                        { name: "sIconHoverValue", var_name: "__mapping__icon_hover_common__value", type: "string", def: "" },
                        { name: "sIconSelectedValue", var_name: "__mapping__icon_selected_common__value", type: "string", def: "" },
                        { name: "sLinkURLValue", var_name: "__mapping__link_url_common__value", type: "string", def: "" },
                        { name: "sIsSelectedValue", var_name: "__mapping__is_selected_common__value", type: "string", def: "" }
                    ];
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oMapping = tools_lp.get_owt_params(curParams, aMapping, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } );
        g_oALL[sHexOWTId].oRuntimeData.aMap =
            [
                { name_in_item: "text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sText" }) },
                { name_in_item: "icon", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sIcon" }) },
                { name_in_item: "icon_hover", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sIconHover" }) },
                { name_in_item: "icon_selected", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sIconSelected" }) },
                { name_in_item: "link_url", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sLinkURL" }) },
                { name_in_item: "is_selected", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sIsSelected" }) }
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
            { name: "sMultipleActionsHeader", value: "Select action" },
            { name: "bOverrideNewWindowOnMobile", value: false },
            { name: "bDeferredLoading", value: false }
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