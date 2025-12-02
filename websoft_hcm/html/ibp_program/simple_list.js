<%
// 6589515242172407361
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "LIST", // for error msgs
        sBlockPrefix: "block_list", // for common get_web_param calls
        sConstructor: "WTLPList" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS (HAS COLLECTION) */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    var aRuntimeParamsToDelete = [ "iActionId", "iCollectionId", "sActionParams", "sCollectionType" ];
    for(i=0; i<aRuntimeParamsToDelete.length; i++)
    {
        oBData.oParams.DeleteOptProperty(aRuntimeParamsToDelete[i]);
    }
    for(oElem in oBData.aItems)
    {
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
        oElem.icon = _Substitute({ sText: oElem.icon });
        oElem.header = _Substitute({ sText: oElem.header });
        oElem.desc = _Substitute({ sText: oElem.desc });
        oElem.link = _Substitute({ sText: oElem.link });
    }
    oBData.oParams.sMultipleActionsHeader = _Substitute({ sText: oBData.oParams.sMultipleActionsHeader });
    oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
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
                if(oResult.HasProperty("result") && IsArray(oResult.result))
                {
                    g_oALL[sHexOWTId].oRuntimeData.aResult = oResult.result;
                    for(oElem in oResult.result)
                    {
                        iInt = OptInt(oElem.id);
                        oElem.hex_id = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : oElem.id);
                        g_oALL[sHexOWTId].oRuntimeData.aItems.push(
                            {
                                id: String(oElem.id),
                                hex_id: oElem.hex_id,
                                icon: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sIcon", sParam: "icon" }),
                                header:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sHeader", sParam: "header" }),
                                desc: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sDesc", sParam: "desc" }),
                                link: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sLink", sParam: "link" })
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
        g_oALL[sHexOWTId].oRuntimeData.aItems = tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".item"), [], true );
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
            { name: "sListIconColor", var_name: "color_icon", type: "string", def: "#4176ea" },
            { name: "sIconSize", var_name: "font_size", type: "string", def: "medium" },

            { name: "bItemHasBG", var_name: "item_has_bg", type: "bool", def: false },
            { name: "sItemBGColor", var_name: "color_bg_item", type: "string", def: "#e2e2e3" },
            { name: "bItemHasShadow", var_name: "item_has_shadow", type: "bool", def: false },
            { name: "bItemHasBorder", var_name: "item_has_border", type: "bool", def: false },
            { name: "sItemBorderColor", var_name: "color_border_item", type: "string", def: "#cccccc" },
            { name: "iItemBorderWidth", var_name: "item_border_size", type: "int", def: 1 },
            { name: "bItemIsRounded", var_name: "item_is_rounded", type: "bool", def: false },

            { name: "nItemPaddingLeft", var_name: "item_padding_left", type: "real", def: 1 },
            { name: "nItemPaddingRight", var_name: "item_padding_right", type: "real", def: 1 },
            { name: "nItemPaddingTop", var_name: "item_padding_top", type: "real", def: 1 },
            { name: "nItemPaddingBottom", var_name: "item_padding_bottom", type: "real", def: 1 },
            { name: "nMarginInterItem", var_name: "margin_inter_item", type: "real", def: 0.4 },

            { name: "bBlockHasBG", var_name: "outline", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_bg", type: "string", def: "#ffffff" },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockBorderWidth", var_name: "border_size", type: "int", def: 1 },
            { name: "bBlockIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "bBlockHasShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 2 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 2 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 2 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 2 },

            { name: "sHeaderFontFamily", var_name: "font_family_header", type: "string", def: "Roboto" },
            { name: "sHeaderFontFamilyCustom", var_name: "font_family_custom_header", type: "string", def: "" },
            { name: "sHeaderFontSize", var_name: "font_size_header", type: "string", def: "medium" },
            { name: "sHeaderFontWeight", var_name: "font_weight_header", type: "string", def: "normal" },
            { name: "sHeaderFontStyle", var_name: "font_style_header", type: "string", def: "normal" },
            { name: "sHeaderFontColor", var_name: "color_font_header", type: "string", def: "#999999" },

            { name: "sFontFamily", var_name: "font_family_text", type: "string", def: "Roboto" },
            { name: "sFontFamilyCustom", var_name: "font_family_custom_text", type: "string", def: "" },
            { name: "sFontSize", var_name: "font_size_text", type: "string", def: "medium" },
            { name: "sFontWeight", var_name: "font_weight_text", type: "string", def: "normal" },
            { name: "sFontStyle", var_name: "font_style_text", type: "string", def: "normal" },
            { name: "sFontColor", var_name: "color_font_text", type: "string", def: "#262626" },

            { name: "sAlign", var_name: "align", type: "string", def: "left" },
            { name: "sListIcon", var_name: "icon", type: "string", def: "check" },
            { name: "bHeaderAsLink", var_name: "header_as_link", type: "bool", def: false },
            { name: "bTextAsLink", var_name: "text_as_link", type: "bool", def: false },
            { name: "sTargetType", var_name: "target_type", type: "string", def: "_self" }

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
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink);
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

    var aWorkareaClasses = [ "wt-lp-wlist-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aMsgEmptyCSS = _GetMsgEmptyCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aWrapperClasses = [ "wt-lp-wlist-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWrapperCSS = tools_lp.get_block_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? '' : ' wt-sub-bg="sBlockImgLink"';

    var aBodyClasses = [ "wt-lp-wlist-body" ];
    var aBodyCSS = [];
    var aListItemClasses = [ "wt-lp-wlist-item" ];
    var aListItemCSS = [ ("margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nMarginInterItem + "em") ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG)
    {
        aListItemClasses.push("wt-lp-has-bg");
        aListItemCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sItemBGColor);
        if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasShadow)
        {
            aListItemClasses.push("wt-lp-has-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder)
    {
        aListItemClasses.push("wt-lp-has-border");
        aListItemCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sItemBorderColor);
        aListItemCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iItemBorderWidth + "px");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bItemHasBorder)
    {
        aListItemCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nItemPaddingLeft + "em");
        if(g_oALL[sHexOWTId].oDesignData.oParams.bItemIsRounded)
        {
            aListItemClasses.push("wt-lp-is-rounded");
        }
    }
    var aListItemTextCSS = [ "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sAlign ];
    var aItemHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sHeaderFont", sSizePrefix: "header" }) ];
    var aItemTextCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sFont" }) ];
    var aIconCSS = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sListIconColor + ";font-size:" + oLPParams.iconsize[g_oALL[sHexOWTId].oDesignData.oParams.sIconSize] ];
    var aIconTextCSS = [ "width:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sIconSize] + ";height:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sIconSize] ];

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-msg-empty {" + aMsgEmptyCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-body {" + aBodyCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item {" + aListItemCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-text {" + aListItemTextCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-text-header {" + aItemHeaderCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-text-text {" + aItemTextCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sListIcon!="none")
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-icon {" + aIconCSS.join(";") + "; }\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-icon-text {" + aIconTextCSS.join(";") + "; }\n";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bHeaderAsLink)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-link:hover div[wt-role='item-header'] { text-decoration: underline; }\n";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bTextAsLink)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wlist-item-link:hover div[wt-role='item-text'] { text-decoration: underline; }\n";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: sDivCSSName + " " });
    }

    sHTMLData = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    sHTMLData += '<div class="' + aWorkareaClasses.join(' ') + '" wt-lazy-block="' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTMLData += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTMLData += '>';
    sHTMLData += '<div class="wt-template-storage" wt-template-box="' + sHexOWTId + '" id="WT_ST_' + sHexOWTId + '">';
    sHTMLData += '<ul>';
    sHTMLData += '<li class="' + aListItemClasses.join(' ') + '" wt-lazy-item="" wt-role="item">';
    sHTMLData += '<a class="wt-lp-wlist-item-link" href="javascript:void(0)" wt-role="link" target="' + g_oALL[sHexOWTId].oDesignData.oParams.sTargetType + '">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sListIcon!="none")
    {
        sHTMLData += '<div class="wt-lp-wlist-item-icon"><icon wt-role="item-icon-text" class="wt-lp-wlist-item-icon-text"></icon></div>';
    }
    sHTMLData += '<div class="wt-lp-wlist-item-text" wt-role="item-info-block">';
    sHTMLData += '<div class="wt-lp-wlist-item-text-header" wt-role="item-header"></div>';
    sHTMLData += '<div class="wt-lp-wlist-item-text-text" wt-role="item-text"></div>';
    sHTMLData += '</div>';
    sHTMLData += '</a>';
    sHTMLData += '</li>';
    sHTMLData += '</ul>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aWrapperClasses.join(' ') + '" ' + sWrapperBGAttr + '>';
    sHTMLData += '<ul class="' + aBodyClasses.join(" ") + '" wt-role="list"></ul>';
    sHTMLData += '<div class="wt-lp-msg-empty" wt-role="msg-empty" wt-sub-html="sMsgEmpty"></div>';
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

            { name: "bDataExternal", var_name: "__data_external", type: "bool", def: false },
            { name: "sActionType", var_name: "action_type", type: "string", def: "link" },
            { name: "bOverrideNewWindowOnMobile", var_name: "override_new_window_on_mobile", type: "bool", def: false },
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

            { name: "sListIcon", var_name: "icon", type: "string", def: "check" },
            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "bUseTransition", var_name: "use_transition", type: "bool", def: false },

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

    g_oALL[sHexOWTId].oRuntimeData.oParams.sIconClass = oLPParams.icon[g_oALL[sHexOWTId].oRuntimeData.oParams.sListIcon];

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
                        { name: "sIcon", var_name: "__mapping__icon", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header", type: "string", def: "" },
                        { name: "sDesc", var_name: "__mapping__desc", type: "string", def: "" },
                        { name: "sLink", var_name: "__mapping__link", type: "string", def: "" },
                        { name: "sIconValue", var_name: "__mapping__icon__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header__value", type: "string", def: "" },
                        { name: "sDescValue", var_name: "__mapping__desc__value", type: "string", def: "" },
                        { name: "sLinkValue", var_name: "__mapping__link__value", type: "string", def: "" }
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
                        { name: "sIcon", var_name: "__mapping__icon_common", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header_common", type: "string", def: "" },
                        { name: "sDesc", var_name: "__mapping__desc_common", type: "string", def: "" },
                        { name: "sLink", var_name: "__mapping__link_common", type: "string", def: "" },
                        { name: "sIconValue", var_name: "__mapping__icon_common__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header_common__value", type: "string", def: "" },
                        { name: "sDescValue", var_name: "__mapping__desc_common__value", type: "string", def: "" },
                        { name: "sLinkValue", var_name: "__mapping__link_common__value", type: "string", def: "" }
                    ];
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oMapping = tools_lp.get_owt_params(curParams, aMapping, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } );
        g_oALL[sHexOWTId].oRuntimeData.aMap =
            [
                { name_in_item: "icon", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sIcon" }) },
                { name_in_item: "header", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sHeader" }) },
                { name_in_item: "desc", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sDesc" }) },
                { name_in_item: "link", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sLink" }) }
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